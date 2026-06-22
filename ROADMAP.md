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

### Faz 1 — Veri katmanını sağlamlaştır ("kaydedilmiyor"u bitir)
- [ ] `custom_sentences` ve SRS'i alt-koleksiyona taşı: `users/{uid}/sentences/{id}` (1 MB sınırından kurtul)
- [ ] Sürüm/zaman-damgası ile merge — çok cihazlı last-write-wins veri kaybını gider (index.html:1438, 1477-1496)
- [ ] `LS.set` kota guard'ı + kullanıcıya "depolama dolu" uyarısı (index.html:408-411)
- [ ] Senkron hatasında görünür banner + retry/backoff (index.html:1441-1443)
- [ ] `beforeunload` yerine `visibilitychange`→hidden flush (index.html:1450)
- **Bitti tanımı:** Cümle/ilerleme kalıcı; çok cihaz çakışmıyor; hata kullanıcıya görünür.

### Faz 2 — Sunucu AI proxy + kota (freemium'un kilit taşı)
- [ ] Firebase Cloud Functions (mevcut Auth ile en sıkı entegrasyon) — sahip anahtarı serverda
- [ ] Firebase ID token doğrulama + kullanıcı başına günlük/aylık kota (Firestore sayaç)
- [ ] Yapısal çıktı + retry + dil doğrulama mantığını server'a taşı (tek yerde)
- [ ] Kötüye kullanım izleme + ban; AI çıktısını `innerHTML` yerine `textContent`/sanitize (index.html:871,1333)
- **Bitti tanımı:** İstemcide anahtar yok; ücretsiz/premium kotası server'da zorlanıyor.

### Faz 3 — Ürünleştirme: i18n + UX + öğrenme doğruluğu
- [ ] ES dil sızıntıları: streak "gün"→"días" (434), geri bildirim/ipucu/hata etiketleri `t()`'ye (706,750-754,761,871,873)
- [ ] Onboarding: değer anlatan giriş adımı + açık "devam" (563-590)
- [ ] Dile-duyarlı SRS anahtarı (392,871,1080) + havuz sayım/silme tutarlılığı (435-438,1087)
- [ ] Üretimde dedupe (891,912 ↔ batch 938)
- [ ] Min. erişilebilirlik: aria-label'lar, pinch-zoom kilidini kaldır (5), kontrast (P2)
- **Bitti tanımı:** ES kullanıcı baştan sona kendi dilinde; SRS bozulmuyor; temel a11y barajı geçildi.

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
