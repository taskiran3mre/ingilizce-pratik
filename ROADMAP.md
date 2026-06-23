# EN Pratik — Ürünleştirme Yol Haritası

> Tek doğru kaynak. Karar/ilerleme değiştikçe burası güncellenir.
> Roller: ⚖️ Hukuk · 🔬 Ar-Ge · 🏗️ CTO · 📈 Pazarlama

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

### Faz 2 — Sunucu AI proxy + kota + veri modeli (freemium'un kilit taşı)
- [ ] Firebase Cloud Functions (mevcut Auth ile en sıkı entegrasyon) — sahip anahtarı serverda
- [ ] Firebase ID token doğrulama + kullanıcı başına günlük/aylık kota (Firestore sayaç)
- [ ] Yapısal çıktı + retry + dil doğrulama mantığını server'a taşı (tek yerde)
- [ ] **1 MB bomba çözümü:** `custom_sentences` → `users/{uid}/sentences/{id}` alt-koleksiyonu — sunucu üretince
  doğrudan oraya yazar, istemci okur. `firestore.rules` güncellenir + **deploy** (kullanıcı erişimi gerekli).
- [ ] Sürümlü/zaman-damgalı merge — çok cihazlı last-write-wins veri kaybını gider
- [ ] Var olan tek-doküman verisinin alt-koleksiyona güvenli (yıkıcı-olmayan) migration'ı + canlı Firebase testi
- [ ] Kötüye kullanım izleme + ban; AI çıktısını `innerHTML` yerine `textContent`/sanitize (index.html:871,1333)
- **Bitti tanımı:** İstemcide anahtar yok; kota server'da zorlanıyor; veri alt-koleksiyonda, 1 MB sınırı tarihe karıştı.

### Faz 3 — Ürünleştirme: i18n + UX + öğrenme doğruluğu (büyük kısmı ✅)
- [x] ES dil sızıntıları (çekirdek döngü): streak birimi, Senin/Referans, soft-check (kelime türleri dahil), tüm API hata + geri bildirim etiketleri — `ab7fad8`
- [x] Üretimde dedupe (tekli üretim, dile duyarlı) — `c570b62`, `4ac122a`
- [x] Pinch-zoom kilidini kaldır (a11y) — `c570b62`
- [x] AI havuzu dile-özel sayım/silme + idx→ID tabanlı güvenli silme — `4ac122a`
- [x] Onboarding: değer anlatan karşılama adımı + açık "Başla" (TR/ES) — `356e6c8`
- [ ] (kalan) Min. erişilebilirlik: aria-label taraması (ikon butonlar) + kontrast (P2)
- [ ] (kalan) İkincil ekran i18n taraması (havuz modalı chrome, ayarlar, istatistik metinleri)
- [ ] (ertelendi) Dile-duyarlı SRS anahtarı refactor — düşük gerçek etki, Faz 2 veri modeliyle birlikte
- **Bitti tanımı:** ES kullanıcı çekirdek akışta baştan sona kendi dilinde ✅; havuz tutarlı ✅; temel a11y kısmen.

### Faz 4 — Monetizasyon + Store hazırlığı
- [ ] IAP: RevenueCat (Apple+Google makbuz/entitlement tek çatı altında)
- [ ] Ücretsiz/premium özellik kapısı (kota + canlı AI)
- [ ] Native kabuk: Capacitor (mevcut PWA'yı sarar, native IAP erişimi)
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
