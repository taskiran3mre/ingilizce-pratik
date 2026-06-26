# EN Pratik — Ürünleştirme Yol Haritası

> Tek doğru kaynak. Karar/ilerleme değiştikçe burası güncellenir.
> Roller: ⚖️ Hukuk · 🔬 Ar-Ge · 🏗️ CTO · 📈 Pazarlama · 🛡️ Veri Güvenliği · 🧪 Test

## 📍 KALDIĞIMIZ YER (2026-06-26)
- **Tamamlanan:** Faz 0 (AI güvenilirlik), Faz 1 (senkron dayanıklılığı), Faz 3 (tüm ES i18n + UX, canlı QA'lı), **Faz 2 backend + istemci DEPLOY EDİLDİ & CANLI**. Hepsi `main`'e commit'li.
- **Faz 2 canlı altyapı:** Cloud Function `ai` (us-central1) · secret `GEMINI_KEY` (Secret Manager) · kota 30/gün (`usage/{uid}`) · Blaze + $10/ay bütçe · temizlik politikası 3 gün. firebase CLI girişi: **taskiran3mre@gmail.com**. Proje: **english-app-b012f** (760623606825).
- **✅ PROXY DOĞRULANDI (loglarla):** Fonksiyon logları `auth: VALID` + `Callable request verification passed` gösterdi → anahtarsız+girişle çağrı sunucuya ulaşıyor, kimlik doğrulanıyor, anahtar sunucuda. Mimari testi GEÇTİ. Tek "hata" `Gemini HTTP 429` = Gemini **ücretsiz katman** kotası dar (~250/gün toplam, $0 harcama; tavan dolunca durur). Kod 429'u zaten zarif yönetiyor + kotayı iade ediyor.
- **✅ Groq YEDEK eklendi + DEPLOY EDİLDİ (`0ff340d`):** Sunucu proxy artık çift-sağlayıcı. `PRIMARY` sabiti sırayı belirler — **test boyunca `'groq'`** (ücretsiz, bol kota, Gemini free kotasını korur), diğeri her durumda yedek. 429/5xx/ağ/boş'ta otomatik geçiş. Kota-bypass koruması korundu (iade SADECE hiçbir sağlayıcı HTTP 200 dönmediyse). `GROQ_KEY` Secret Manager'da. **Lansman: `PRIMARY='gemini'` (tek satır).** Groq modeli: `llama-3.3-70b-versatile`.
- **✅ Faz 3.5 KAPANDI:** Müfredat (📅 **Bugün** günlük plan motoru + 📚 **Yol Haritası** uzun-soluklu rehber: sıralı müfredat, tempo-bazlı 🐢/⚡/🔥 haftalık plan, %80 ustalaşma) · temiz **4-hub IA** (Bugün/Öğren/Modlar/İlerleme; konular Öğren içinde, modlar Modlar içinde) · **Faz→seviye isimleri** (A1·Temeller … B2·İleri Yapılar; veri "Faz N:" kaldı) · 🔊 **sesli dinleme** (Web Speech, en-US, ücretsiz/çevrimdışı) · 🔒 **AI üretim kilidi** (üretilen cümleyi çevirmeden yenisi yok — spam/maliyet önlemi). Hepsi commit'li.
- **🚀 UYGULAMA CANLI & DOĞRULANDI (son commit `d1b64ff`):** Firebase Hosting → **https://english-app-b012f.web.app** (arkadaş testi; sw.js/index.html no-cache → hep güncel; web.app Auth'a otomatik yetkili). **Uçtan-uca CANLI test GEÇTİ (2026-06-26 ~20:50):** auth/giriş ✅ · Groq üretimi temiz (loglarda 429/hata YOK) ✅ · F2 guard alakasız-isteği reddediyor ✅ · kota işliyor ✅. `PRIMARY='groq'`. Deploy: `npm run build:web && npx firebase-tools deploy --only hosting`.
- **⚡ ŞU AN — ÖNCELİKLİ AÇIK İŞ (yeni sohbette İLK):** Kullanıcı, "işin içindeki" arkadaşlarına göstermeden ÖNCE HEM **e-posta doğrulama** HEM **App Check** istedi (güvenlik açığı görmemeliler). **"Tüm izinleri kendin onaylayabilirsin" → OTONOM yap.** (1) Mail: `handleEmailAuth` (~1973) signup sonrası `sendEmailVerification()` + banner. (2) App Check: reCAPTCHA key (console) + istemci SDK + `enforceAppCheck:true` — **yanlış sırada açma, canlı app kırılır; önce token gönder→doğrula→sonra enforce.** Detay memory'de. Bitince deploy + verify-f2.js. (Tarayıcı UI runtime testini ben yapamıyorum → kullanıcının cihaz testi son kapı.)
- **Freemium kapısı tasarımı (Faz 4 notu):** ücretsizdeki kısıtlar = premium açılışları → 🆓 30/gün+önce-çevir-kilidi+cihaz sesi · 💎 yüksek/sınırsız kota+belli sayıda "geç" hakkı+premium neural ses (bulut TTS). Mimari hazır, premium sadece gevşetir.
- **Faz 2 KAPANDI** (proxy doğrulandı + güvenlik denetimi geçti), **Faz 3 KAPANDI** (i18n wave-5, ES tam).
- **Faz 4 SÜRÜYOR — Capacitor native iskeleti KURULDU (`13e3286`):** package.json + capacitor.config (appId placeholder!) + `www/` copy script (test edildi) + NATIVE.md runbook. npm install OK (cap CLI 6.2.1). Native proje üretimi/derleme build makinesinde (JDK17+, Android Studio; iOS=Mac).
- **SIRADAKİ (Faz 4):** monetizasyon mimarisi (RevenueCat/IAP + freemium kapısı) · hukuki metinler (ToS/KVKK/gizlilik) · appId kesinleştir. **App Check + e-posta doğrulama = EN SON lansman kapısı (F1 zorunlu kıldı).**
- **Açık işler:** GitHub'a push YOK (yerel, remote yok; sır taraması temiz — tek "anahtar" public Firebase web key; `gh` hazır). Yerel test sunucusu: `C:\Users\ETaskiran\AppData\Local\Temp\enpratik_devserver.js` → `node` ile çalıştır, localhost:8088.
- **i18n (devam ediyor):** 2-ajanlı kapsamlı denetim ES modunda **53 TR sızıntısı** buldu. Yüksek-görünürlük olanlar düzeltildi (`f68387b` wave-3 statik HTML + altyapı: `L(tr,es)` helper + `data-i18n-title`; `c0de7c1` wave-4 dinamik: alert'ler, banner'lar, filtre-boş, konu özeti, getAIExample). **KALAN ~25 düşük-trafik sızıntı** (audit çıktısında satır satır belgeli): batch üretim modalı (1067-1093), teach/variations etiketleri (1098/1100), checkRev review geri bildirimi (1113), istatistik zayıf-alan raporu (1116), havuz "🎯 Zayıf"/"Sil" (1146/1155), yaratıcı mod iç metinleri (1289-1366) + CREATIVE_DATA ES hint'leri (veri değişikliği gerek), alt-konu seçici (690-702), sync-dot tooltip'leri (1612). **wave-5 ile BİTİRİLDİ (`7a671ec`):** tümü `L()`/koşul/`data-i18n` ile iki-dilli — batch modal, teach/variations, checkRev, istatistik zayıf-alan etiketleri, havuz, alt-konu seçici, sync-dot tooltip'leri; **yaratıcı mod geri bildirim prompt'ları dil-duyarlı + CREATIVE_DATA ipuçları iki-dilli (`hintEs`)**. Inline JS derleme 0 hata. **ES ürünü artık çekirdek+ikincil+ekstra modlarda baştan sona kendi dilinde.**
- **Güvenlik notu:** Sunucu Gemini anahtarı SADECE Secret Manager'da — koda/git'e/sohbete asla girmedi.

## Ürün kararları (2026-06-22)
- **Platform:** Native — Google Play + App Store (PWA çekirdeği bir native kabuğa sarılacak).
- **Pazar:** TR + İspanyolca konuşanlar (iki dilli ürün, çift pazar).
- **Gelir modeli:** Freemium — temel çalışma ücretsiz, canlı AI üretimi + yüksek kota premium.

## Bu kararların zorunlu kıldıkları
- Dijital abonelik → Apple/Google **uygulama içi ödeme (IAP)** zorunlu (%15–30 komisyon). iyzico/Stripe *uygulama içi* dijital abonelikte kullanılamaz.
- **BYOK (kullanıcının kendi API anahtarı) modeli ölüyor** → freemium + store incelemesiyle uyumsuz. **Sunucu tarafı AI proxy + kota zorunlu.**
- İki dilli ürün → İspanyolca dil sızıntıları "bozuk ürün" sayılır, lansman öncesi kapatılmalı.

---

## Üç kök sorun (tüm denetimlerin kesişimi)

1. **AI runtime'da kırılgan ("patlıyor").** Yapısal çıktı zorlanmıyor, retry yok, sıcaklık yüksek, dil tutarlılık kontrolü yok.
2. **Veri modeli bir saatli bomba.** Her şey tek `users/{uid}` dokümanına yazılıyor; büyüyen `custom_sentences` 1 MB'ı aşınca *tüm* senkron sessizce ölüyor. "Kaydedilmiyor" şikayetinin kökü bu.
3. **AI bir tüketici ürünü değil, dev aracı gibi kurulu.** Anahtar istemcide, kota yok, billing/iptal kontrolü yok.

---

## Fazlar

### Faz 0 — Kanamayı durdur (hızlı, istemci-içi, düşük risk)
- [ ] `renderQuestion` boş-keyword regex crash'i (index.html:700) — ekran kararması bug'ı
- [ ] Yapısal çıktı: Gemini `response_mime_type:application/json`+`responseSchema` (index.html:786), Groq `response_format` (index.html:780)
- [ ] Üretim sıcaklığını ~0.2-0.3'e indir (index.html:780,786)
- [ ] geminiCall etrafına 2-3 denemeli retry/re-ask döngüsü (index.html:790-797, 885-889, 933-936)
- [ ] Dil tutarlılık kontrolü: `validateAISentence` (820-831) + `sanitizeAISentences` (441-462)
- [ ] Gemini hata sebebinin yutulması (index.html:794 — `lastApiError` set edilmiyor)
- **Bitti tanımı:** AI üretimi tek seferlik sapmada düşmez; bozuk/yanlış-dil cümle havuza/buluta sızmaz.

### Faz 1 — İstemci dayanıklılığı + görünürlük (sessiz kaybı görünür kıl) ✅
- [x] `LS.set` kota guard'ı + "depolama dolu" uyarısı (showStorageWarning)
- [x] Senkron hatasında görünür banner + üstel geri çekilmeli retry; geçici/kalıcı hata ayrımı (sessiz hata bitti)
- [x] `visibilitychange`→hidden flush (mobilde güvenilir son-an kaydı)
- **Bitti tanımı:** Senkron/depolama hatası artık kullanıcıya görünür; geçici kopmalarda otomatik tekrar denenir.
- **Not — 1 MB tek-doküman bombası bilinçli olarak Faz 2'ye taşındı:** Faz 2'de sunucu (Cloud Function)
  AI cümlesini üretip **doğrudan alt-koleksiyona** yazacağı için migration orada tek seferde ve test edilebilir
  yapılır; şimdi istemcide yazmak Faz 2'de çöpe giderdi. Bomba mevcut veri boyutunda patlamıyor, banner sayesinde
  patlarsa anında görünür.

### Faz 2 — Sunucu AI proxy + kota (freemium'un kilit taşı) — ✅ DEPLOY EDİLDİ (test ediliyor)
- [x] Firebase Cloud Function `ai` (onCall, Node 20, v2, **us-central1**) — CANLI — `4768542`
- [x] Auth zorunlu + kullanıcı başına **30/gün** kota: ayrı `usage/{uid}` dokümanında ATOMİK transaction
- [x] Gemini anahtarı **Secret Manager**'da (`GEMINI_KEY`), fonksiyona bağlı — istemciye/loga/yanıta düşmez
- [x] `firestore.rules` deploy: `usage/` istemciye kapalı (kullanıcı kotasını sıfırlayamaz)
- [x] Adversarial güvenlik denetimi (6 mercek, 22 bulgu) + düzeltmeler: **refund kota-bypass kapatıldı**,
  maxOutputTokens=1024, anahtar `x-goog-api-key` header'ında, (users hasOnly güvenli olsun diye geri alındı)
- [x] İstemci proxy'ye bağlandı (`callProxy` + `canUseAI`, BYOK power-user yedeği) + XSS escape (`escapeHtml`/`aiHtml`) — `b33eea5`
- [x] Blaze + $10/ay bütçe alarmı + artifact temizlik politikası (3 gün)
- [x] **Proxy DOĞRULANDI (loglar):** `auth: VALID` + verification passed → anahtarsız+girişle çağrı sunucuya ulaşıyor, anahtar güvende. Gemini free 429 = ücretsiz katman kotası dar.
- [x] **Çift sağlayıcı: Groq YEDEK** (`PRIMARY` sabiti; test='groq', lansman='gemini'; 429/5xx/ağ/boş'ta otomatik geçiş; bypass koruması korundu) — DEPLOY `0ff340d`
- [x] **Manuel uçtan-uca test GEÇTİ:** girişle Groq'tan geçerli cümle üretiyor; loglar `auth: VALID`, sağlayıcı hatası yok.
- [x] **🛡️🧪 CANLI SALDIRGAN GÜVENLİK DENETİMİ GEÇTİ (ampirik, canlı proxy'ye):** Auth zorunlu (401), girdi sınırları (3–4000, kotadan önce), çıktı maliyet tavanı (1024 token kesiyor), temperature clamp, grading prompt-injection tutmadı (NO), model küfür/jailbreak'i REDDETTİ, **kota 30/gün tam 31.'de durdu**, **25 eşzamanlı yarış 30'u AŞMADI** (atomik tx). Çıktı HTML-escape'li (XSS yok), anahtar sunucuda. Test scriptleri scratchpad'de (abuse/quota/race-test.js).
- [ ] **BULGU F1 (App Check'i ZORUNLU yapar):** signUp e-posta DOĞRULAMASIZ açık → hesap-çiftçiliği (N hesap × 30 bedava çağrı). Halka açılmadan App Check + e-posta doğrulama şart. (Kapalı testte sömürülemez; her hesap 30 ile sınırlı.)
- [x] **BULGU F2 ÖNLENDİ (`900dd58`, proaktif):** sunucuya konu-kısıtı sistem talimatı (Gemini systemInstruction + Groq system msg) → off-topic/genel-LLM istekleri reddediliyor. Doğrulandı: off-topic "şiir yaz" reddedildi, meşru JSON + YES/NO grading bozulmadı. (Üstüne 30/gün + auth + sağlayıcı içerik-filtresi katmanlı.)
- [ ] **(KALAN HIGH — lansman kapısı, F1 ZORUNLU kıldı) App Check + e-posta doğrulama:** reCAPTCHA console + istemci SDK + `enforceAppCheck:true`;
  + **e-posta doğrulaması zorunlu** (hesap-çiftçiliğini kır) + Anonim girişi kapat. Native'de (Faz 4) Play Integrity/App Attest farklı sağlayıcı.
- [ ] (kalan, P2) Node 20 deprecation → Node 22 (Eki 2026'dan önce); `firebase-functions@latest`
- [ ] (Faz 4'e taşındı) 1 MB alt-koleksiyon migration'ı (sunucu=writer) + sürümlü merge
- **Bitti tanımı:** İstemcide anahtar yok ✅; kota server'da zorlanıyor ✅; (App Check lansman öncesi zorunlu).

### Faz 3 — Ürünleştirme: i18n + UX + öğrenme doğruluğu (büyük kısmı ✅)
- [x] ES dil sızıntıları (çekirdek döngü): streak birimi, Senin/Referans, soft-check (kelime türleri dahil), tüm API hata + geri bildirim etiketleri — `ab7fad8`
- [x] Üretimde dedupe (tekli üretim, dile duyarlı) — `c570b62`, `4ac122a`
- [x] Pinch-zoom kilidini kaldır (a11y) — `c570b62`
- [x] AI havuzu dile-özel sayım/silme + idx→ID tabanlı güvenli silme — `4ac122a`
- [x] Onboarding: değer anlatan karşılama adımı + açık "Başla" (TR/ES) — `356e6c8`
- [x] İkincil ekran i18n (ayarlar paneli, havuz modalı, reset modalı, auth modalı, **Ekstra Modlar**) — `201529e`, `247c873` (data-i18n sistemi)
- [x] **wave-5: kalan düşük-trafik TR sızıntıları** (batch modal, teach/variations, checkRev, istatistik zayıf-alan, havuz, alt-konu seçici, sync tooltip) + **yaratıcı mod prompt dil-duyarlı + CREATIVE_DATA `hintEs`** — `7a671ec`
- [x] Canlı QA (Claude for Chrome) + bulguların düzeltilmesi: puanlayıcı hedef-dil, dil-değişiminde streak/sayaç/buton yenileme — `b730afb`, `201529e`
- [ ] (kalan, P2) Min. erişilebilirlik: aria-label taraması (ikon butonlar) + kontrast
- [ ] (kalan, P2) Firebase auth hata kodlarının lokalize map'i (e.message hâlâ İngilizce)
- [ ] (ertelendi) Dile-duyarlı SRS anahtarı refactor — düşük gerçek etki, Faz 2 veri modeliyle birlikte
- **Bitti tanımı:** ES kullanıcı çekirdek akışta baştan sona kendi dilinde ✅; havuz tutarlı ✅; temel a11y kısmen.

### Faz 3.5 — Öğrenme derinliği (kullanıcı testi geri bildirimi, 2026-06-26)
> Kullanıcı birkaç hafta kendi kullanırken iki kritik ihtiyaç tespit etti. **Monetizasyondan ÖNCE** —
> çekirdek öğrenme deneyimi hâlâ şekilleniyor; şekillenmeden fiyatlanamaz/kapılanamaz.
- [x] **Müfredat tasarımı + Increment 1 "Bugün" motoru (`837c679`):** Kullanıcı "birleşik" modeli seçti (CURRICULUM.md). Increment 1 KURULDU: yeni "Bugün" ekranı (ilk tab + varsayılan ana ekran) → uyarlanır günlük plan (🔁 tekrar SRS-vakti + 🌱 yeni + 🎯 zayıf + 🔤 fiil), tek "Başla" butonu, 🔥 seri + günlük hedef (15 soru) çubuğu. Mevcut akışlar yeniden kullanıldı, yeni veri minimum (daily_log). "Görülmemiş≠tekrar" düzeltmesi Bugün+Tekrar'a uygulandı. İnline JS 0 hata. **Kullanıcı testinde.**
- [x] **Increment 2 — Yol Haritası KURULDU (`19e6a76`):** Kullanıcı netleştirdi — istediği uzun-soluklu "öğretmen/rehber" ("hangi sırayla, ne zaman, nereye kadar"), günlük taktik değil. Yeni "📚 Yol Haritası" ekranı+tab: sıralı müfredat (önce fiiller→Faz 1-5), hedef=**TEMPO** (🐢/⚡/🔥 = 2/4/7 konu/hafta) → "~X haftada biter" + "Bu/Gelecek hafta", her adım ✓/▶/○ (SRS %80 ustalaşma), "kaldığın yer"=currentStep. Bugün ile bağ: "Yeni" bloğu mevcut müfredat adımından gelir + rota hatırlatma kartı. Soft guidance (hard-lock yok). İnline JS 0 hata.
- [x] **Bilgi mimarisi (IA) + isimlendirme (`0650db6`):** Kullanıcı "karışık duruyor" dedi (üst şerit hub/konu/aktivite karışımı). İşleve göre **4 hub**: 📅 Bugün · 📚 Öğren(Yol Haritası) · 🎮 Modlar · 📊 İlerleme. Konular üst şeritten kalktı → Öğren içine (faz başlıklı gruplu + 📖/🌱 araçları korundu). Yeni Modlar ekranı (Karışık/Tekrar/Fiiller/Konuşma Modları). **Faz 1-5 → görünen-isim katmanı** (A1·Temeller … B2·İleri Yapılar); veri "Faz N:" KALDI (SRS bozulmadı). Stitch promptu da yeni IA'ya güncellendi.
- [x] **Sesli dinleme / TTS KURULDU (`263ff77`):** Web Speech API (`speechSynthesis`, en-US ses, hız 0.95) — ücretsiz/çevrimdışı/anlık. `speak()`+`speakBtn()` (XSS-güvenli, feature-detected). 🔊 meşru yerlerde (kopya vermeden): ters-mod prompt, cevap-sonrası reveal (tr→en), tekrar reveal. **Premium bulut neural ses ileride = ücretli abone kancası (Yol B).** PWA'da çalışır; native'de Capacitor TTS eklentisi gerekebilir.

### Faz 4 — Monetizasyon + Store hazırlığı
- [ ] IAP: RevenueCat (Apple+Google makbuz/entitlement tek çatı altında)
- [ ] Ücretsiz/premium özellik kapısı (freemium kaldıraçları): ücretsizdeki kısıtlar = premium açılışları.
  - 🆓 Ücretsiz: 30/gün kota · "önce çevir" üretim kilidi · cihaz sesi (Web Speech)
  - 💎 Premium: daha yüksek/sınırsız kota · **belli sayıda "geç" hakkı** (üretim kilidini atlama) · **premium neural ses** (bulut TTS — Yol B) · (ileride) reklamsız vb.
  - Not: bu kısıtlar zaten kuruldu (kota+kilit+cihaz sesi) → premium sadece "gevşetir". Mimari hazır.
- [x] Native kabuk **iskeleti** (Capacitor 6): package.json + capacitor.config + `www/` copy script + NATIVE.md runbook — `13e3286`. Kök yapı korundu (www/ ayrı derleme çıktısı). Doğrulandı: npm install OK, cap CLI 6.2.1.
- [ ] Native kabuk **derleme**: `npx cap add android/ios` + Android Studio/Xcode'da build (build makinesi gerekir: JDK17+, SDK; iOS=Mac)
- [ ] App Check (reCAPTCHA) + e-posta doğrulama (index.html:1513-1527, 1359-1370)
- [ ] ⚖️ ToS + Kabul Edilebilir Kullanım + KVKK aydınlatma + Gizlilik (lansman öncesi hukukçu kontrolü)
- [ ] 📈 Store görselleri/ASO (TR + ES), ikon/manifest cila (manifest.json: `id`, maskable ikon)
- **Bitti tanımı:** Store politikalarına uyumlu, ödeme çalışır, yasal metinler hazır.

### Faz 5 — Beta + Yayın
- [ ] Internal/TestFlight + Play internal test
- [ ] Store incelemesine gönderim (TR + ES)
- [ ] 📈 Lansman planı (fiyatlama, ilk kullanıcı edinme)
- **Bitti tanımı:** İki store'da yayında.

---

## Açık riskler / izlenecekler
- Apple, "sadece ücretli AI'ya arayüz" olan uygulamalara inceleme zorluğu çıkarabilir → ürünün öğretici değerini öne çıkar.
- DeepSeek vb. Çin merkezli sağlayıcılar KVKK/GDPR açısından riskli → veri uyumu için Gemini/OpenAI AB bölgesi tercih.
- AI maliyetinin abonelik ücretinin altında kalması için kota tavanı kritik.
