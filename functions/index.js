/**
 * EN Pratik — sunucu taraflı AI proxy (Faz 2)
 *
 * Güvenlik ilkeleri:
 *  - Gemini anahtarı yalnızca Secret Manager'da; istemciye/loglara/hata mesajına DÜŞMEZ.
 *  - Çağrı için Firebase kimlik doğrulaması ZORUNLU (onCall + request.auth).
 *  - Günlük kota, ayrı `usage/{uid}` dokümanında ATOMİK transaction ile sayılır
 *    (paralel istekle yarış-koşulu bypass'ı yok). usage'a istemci erişemez (rules: kapalı).
 *  - Girdi doğrulanır + uzunluk sınırlanır (maliyet/DoS koruması).
 *  - Fonksiyon yalnızca sabit Gemini URL'ine çıkar (SSRF yok).
 */
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { setGlobalOptions } = require('firebase-functions/v2');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const GEMINI_KEY = defineSecret('GEMINI_KEY');

const DAILY_LIMIT = 30;          // kullanıcı başına günlük AI isteği
const MAX_PROMPT_CHARS = 4000;   // maliyet / DoS koruması
const MODEL = 'gemini-2.5-flash';

setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

exports.ai = onCall(
  { secrets: [GEMINI_KEY], timeoutSeconds: 30, memory: '256MiB' },
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

    // İade SADECE çağrının hiç FATURALANMADIĞI kesin durumlarda (ağ hatası / HTTP !ok).
    // HTTP 200 dönen ama metni boş/parse-uyumsuz yanıtlar FATURALANIR → iade EDİLMEZ
    // (aksi halde kasıtlı boş-yanıt üretip sınırsız ücretli çağrı yapılabilirdi = kota bypass).
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

    // 4) Gemini çağrısı — anahtar URL'de DEĞİL, header'da (loglama sızıntı yüzeyini daraltır)
    const gc = { temperature, maxOutputTokens: 1024 };   // çıktı maliyeti tavanı (sunucu sabiti, istemci değiştiremez)
    if (wantJson) gc.responseMimeType = 'application/json';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

    let resp;
    try {
      resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY.value() },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: gc })
      });
    } catch (e) {
      console.error('Gemini fetch failed');               // ayrıntı/anahtar loglanmaz
      await refund();
      throw new HttpsError('unavailable', 'AI servisine ulaşılamadı.');
    }

    if (!resp.ok) {
      console.error('Gemini HTTP', resp.status);           // gövdeyi loglama (anahtar sızıntısı riski)
      await refund();
      if (resp.status === 429) throw new HttpsError('resource-exhausted', 'AI servisi yoğun, biraz sonra dene.');
      throw new HttpsError('internal', 'AI yanıtı alınamadı.');
    }

    let json;
    try {
      json = await resp.json();
    } catch (e) {
      // 200 alındı = çağrı faturalandı → iade YOK
      throw new HttpsError('internal', 'AI yanıtı çözümlenemedi.');
    }

    const text =
      json && json.candidates && json.candidates[0] && json.candidates[0].content &&
      json.candidates[0].content.parts && json.candidates[0].content.parts[0] &&
      json.candidates[0].content.parts[0].text;

    // Boş yanıt da kotayı tüketir (200 = faturalandı); iade YOK.
    return { text: text || null };
  }
);
