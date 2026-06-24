/**
 * EN Pratik — sunucu taraflı AI proxy (Faz 2)
 *
 * Güvenlik ilkeleri:
 *  - Sağlayıcı anahtarları yalnızca Secret Manager'da; istemciye/loglara/hata mesajına DÜŞMEZ.
 *  - Çağrı için Firebase kimlik doğrulaması ZORUNLU (onCall + request.auth).
 *  - Günlük kota, ayrı `usage/{uid}` dokümanında ATOMİK transaction ile sayılır
 *    (paralel istekle yarış-koşulu bypass'ı yok). usage'a istemci erişemez (rules: kapalı).
 *  - Girdi doğrulanır + uzunluk sınırlanır (maliyet/DoS koruması).
 *  - Fonksiyon yalnızca sabit sağlayıcı URL'lerine çıkar (SSRF yok).
 *
 * Sağlayıcı stratejisi: Gemini BİRİNCİL (TR kalite + AB uyum), Groq YEDEK
 * (Gemini 429/hata/boş dönünce devreye girer → 429 derdi biter, dayanıklılık artar).
 */
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const GEMINI_KEY = defineSecret('GEMINI_KEY');
const GROQ_KEY = defineSecret('GROQ_KEY');

const DAILY_LIMIT = 30;          // kullanıcı başına günlük AI isteği
const MAX_PROMPT_CHARS = 4000;   // maliyet / DoS koruması
const GEMINI_MODEL = 'gemini-2.5-flash';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// Sağlayıcı çağrısı dönüşü: { billed, text }
//  - billed === true  → sağlayıcı HTTP 200 döndü (= bizi faturalandırdı). İçerik boş olsa bile iade EDİLMEZ.
//  - billed === false → ağ hatası / HTTP !ok (429, 5xx). Faturalanmadı → iade güvenli.
async function callGemini(prompt, gc) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  let resp;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY.value() },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: gc })
    });
  } catch (e) {
    console.error('Gemini fetch failed');                 // ayrıntı/anahtar loglanmaz
    return { billed: false, text: null };
  }
  if (!resp.ok) {
    console.error('Gemini HTTP', resp.status);            // gövdeyi loglama (anahtar sızıntısı riski)
    return { billed: false, text: null };                 // 429/5xx → faturalanmadı
  }
  let json;
  try { json = await resp.json(); } catch (e) { return { billed: true, text: null }; } // 200 = faturalandı
  const text =
    json && json.candidates && json.candidates[0] && json.candidates[0].content &&
    json.candidates[0].content.parts && json.candidates[0].content.parts[0] &&
    json.candidates[0].content.parts[0].text;
  return { billed: true, text: text || null };
}

async function callGroq(prompt, temperature, wantJson) {
  const body = {
    model: GROQ_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature,
    max_tokens: 1024
  };
  if (wantJson) body.response_format = { type: 'json_object' };  // prompt zaten "JSON" diyor
  let resp;
  try {
    resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY.value()}` },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.error('Groq fetch failed');
    return { billed: false, text: null };
  }
  if (!resp.ok) {
    console.error('Groq HTTP', resp.status);
    return { billed: false, text: null };
  }
  let json;
  try { json = await resp.json(); } catch (e) { return { billed: true, text: null }; }
  const text = json && json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
  return { billed: true, text: text || null };
}

exports.ai = onCall(
  { secrets: [GEMINI_KEY, GROQ_KEY], timeoutSeconds: 30, memory: '256MiB' },
  async (request) => {
    // 1) Kimlik doğrulama zorunlu
    const uid = request.auth && request.auth.uid;
    if (!uid) throw new HttpsError('unauthenticated', 'Giriş gerekli.');

    // 2) Girdi doğrulama
    const data = request.data || {};
    const prompt = typeof data.prompt === 'string' ? data.prompt.trim() : '';
    if (prompt.length < 3) throw new HttpsError('invalid-argument', 'Geçersiz istek.');
    if (prompt.length > MAX_PROMPT_CHARS) throw new HttpsError('invalid-argument', 'İstek çok uzun.');
    const wantJson = data.json === true;
    let temperature = (typeof data.temperature === 'number' && isFinite(data.temperature)) ? data.temperature : 0.3;
    temperature = Math.min(1, Math.max(0, temperature));

    // 3) Kota — atomik rezervasyon (önce ayır, sonra çağır)
    const usageRef = db.collection('usage').doc(uid);
    const today = todayStr();
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(usageRef);
      const d = snap.exists ? snap.data() : {};
      const count = d.date === today ? (d.count || 0) : 0;
      if (count >= DAILY_LIMIT) {
        throw new HttpsError('resource-exhausted', 'Günlük AI limitine ulaştın. Yarın tekrar dene.');
      }
      tx.set(usageRef, {
        date: today,
        count: count + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });

    // İade SADECE çağrının HİÇ FATURALANMADIĞI kesin durumda (hiçbir sağlayıcı HTTP 200 dönmedi).
    // HTTP 200 dönen ama metni boş/parse-uyumsuz yanıt FATURALANIR → iade EDİLMEZ
    // (aksi halde kasıtlı boş-yanıt üretip sınırsız ücretli çağrı = kota bypass).
    const refund = async () => {
      try {
        await db.runTransaction(async (tx) => {
          const snap = await tx.get(usageRef);
          if (!snap.exists) return;
          const d = snap.data();
          if (d.date === today && (d.count || 0) > 0) tx.update(usageRef, { count: d.count - 1 });
        });
      } catch (_) { /* iade best-effort */ }
    };

    // 4) Üretim — Gemini birincil, başarısızsa Groq yedek. (Anahtarlar header'da, URL'de DEĞİL.)
    const gc = { temperature, maxOutputTokens: 1024 };   // çıktı maliyeti tavanı (sunucu sabiti)
    if (wantJson) gc.responseMimeType = 'application/json';

    let anyBilled = false;

    const g = await callGemini(prompt, gc);
    anyBilled = anyBilled || g.billed;
    if (g.text) return { text: g.text };

    // Gemini metin vermedi (429/5xx/ağ/boş) → Groq yedeğine düş
    const q = await callGroq(prompt, temperature, wantJson);
    anyBilled = anyBilled || q.billed;
    if (q.text) return { text: q.text };

    // İki sağlayıcı da kullanılabilir metin vermedi
    if (!anyBilled) {
      await refund();                                    // hiçbiri faturalandırmadı → iade güvenli
      throw new HttpsError('resource-exhausted', 'AI servisi yoğun, biraz sonra dene.');
    }
    // En az biri faturalandı (200 ama boş/filtreli) → iade YOK (kota-bypass koruması)
    return { text: null };
  }
);
