# EN Pratik — Ürünleştirme Yol Haritası

> Tek doğru kaynak. Karar/ilerleme değiştikçe burası güncellenir.
> Roller: ⚖️ Hukuk · 🔬 Ar-Ge · 🏗️ CTO · 📈 Pazarlama · 🛡️ Veri Güvenliği · 🧪 Test

## 📍 KALDIĞIMIZ YER (2026-11-09) — "kullanılır hale getirme" turu
- **AI bağlantısı geri geldi (2026-11-04/09):** Groq `llama-3.3-70b-versatile` free katmanda 16.08.2026'da kapandı (404) → **`openai/gpt-oss-120b`**, 429/5xx'te **`openai/gpt-oss-20b`** (ayrı kota; free: model başına 1000 istek/gün, 8000 token/dk). Gemini anahtarının projesinde **ön ödemeli kredi bitti (402)** → Gemini devre kesiciyle 10 dk atlanıyor; düzeltmek için kullanıcının AI Studio'da *faturalandırması olmayan* projede yeni anahtar açması gerek. Cloud Functions **Node.js 24** (Node 20, 30.10.2026'da kapatıldı). Global kota dokümanı `__global__` Firestore'da rezerve olduğu için HER AI isteği çöküyordu → `usageGlobal/daily`. Kota: kişi başı **200/gün**, global **1800/gün**.
- **AI cümle seviyesi:** "AI ile Yeni Cümle" yanındaki seviye seçici hiç okunmuyordu → artık hedef seviye o (cihazda `ai_level`). Prompt yeniden yazıldı (gerçek modelle test edildi): zorluk = yalnızca gramer konusu, kelimeler sade/sık, deyim yok, seviye başına uzunluk; `quality:'high'` → sunucuda `reasoning_effort: medium` + 2048 token (low'da "I have visited … when I was" gibi gramer hataları çıkıyordu). Uzunluk/dil sızıntısı/yakın tekrar kontrolü + son cümleler "tekrarlama" listesiyle gönderiliyor.
- **Her kelimeye dokun → anlam (Duolingo tarzı):** `learn.js` gloss motoru. Sabit 184 cümle için elle hazırlanmış eşleşmeler (`learn-data.js` → `SENTENCE_GLOSS`, %100 kapsama); AI cümleleri eşleşmeyle birlikte üretiliyor; eski/eksik cümlede dokunulan kelime için cümlenin tamamı AI'dan BİR KEZ isteniyor ve saklanıyor. Her iki yönde (TR→EN, EN→TR) + Tekrar modunda çalışır; 🔊 ile telaffuz.
- **Dil sızıntısı:** Türkçe/İspanyolca cümlede İngilizce kelime ("the", "is"…) olan AI cümlesi reddediliyor; havuzdaki eski bozuklar senkron sırasında ayıklanıyor.
- **"Çift geçme" düzeltildi:** Sonraki/Atla çift dokunuşta iki soru atlatıyordu; Tekrar modunda "Kontrol" iki kez → iki puan + iki geçiş; fiillerde çift Enter → iki zamanlayıcı. Hepsine kilit + 400–600 ms koruma; fiillerde otomatik geçiş kaldırıldı.
- **Düzensiz fiiller v2:** yeni fiiller sıklık sırasıyla (önce be/go/make; overdraw/foresee en sona), önce **öğrenme kartı** (3 hâl + Türkçe anlamlar + İngilizce tanım + 2 örnek + kalıp ailesi), sonra test (anlam + tanım görünür, 👀 Göster), yanlış fiil oturum sonunda tekrar; 📋 kalıp ailelerine göre gruplu, aranabilir liste.
- **🧩 Phrasal Verbs modülü:** edat mantığına göre gruplar (UP = tamamen/artış…), öğrenme kartları, 3 tür test (anlam / ters / eksik edat; çeldiriciler aynı fiilin diğer edatları), aralıklı tekrar 1-3-7-14-30 gün, buluta senkron (`pv_srs`). Modlar + Bugün + Öğren'e bağlı.
- **Diğer:** yön değiştirince Bugün/Öğren'den açılan konu anında "bitti" oluyordu (S.tab ile yeniden kuruluyordu) → aynı kaynakla yeniden kuruluyor. AI cümlesi artık atlanabilir; yanlış cevaptan sonra yeni cümle istenebilir. Veri düzeltmeleri: TR 112/316/417/420, ES 203/253.
- **Gerçek hesapla canlı test (2026-11-09, Chrome):** üretim/hata açıklaması/YES-NO kontrolü/sesli sohbet (Gemini→Groq) çalışıyor, cümle 3–8 sn. Bulunan ve düzeltilenler:
  - 🔴 **Senkron tamamen duruyordu:** gloss `[[a,b]]` = Firestore'da "dizi içinde dizi" → `set()` `invalid-argument`. Buluta `{native,en}` nesneleri yazılıyor, okurken çiftlere çevriliyor (`_sentencesToCloud/_sentencesFromCloud`; `getGloss` iki biçimi de okur). Not: `set(merge:true)` haritaları DERİN birleştirir — yerelde silinen alan/anahtar bulutta kalır.
  - 🔴 **Güncellemeler bir saate kadar gecikiyordu / eski-yeni dosya karışıyordu:** `no-cache` başlığı yalnız `/index.html`'deydi; `/` ve JS'ler `max-age=3600` geliyordu, SW'nin `fetch()`'i de HTTP önbelleğinden bayat kopya alıyordu. firebase.json: `/` + index/data/learn/learn-data/manifest → `no-cache`; sw.js v26: aynı kökenli istekler `{cache:'no-cache'}`, kurulum `{cache:'reload'}`.
  - Hata/doğrulama bantları hiç kapanmıyordu (satır içi `display:flex` > `.hidden`) → stil ile aç/kapat.
  - Fiiller: seri 0 (hiç doğru bilinmemiş) tekrar fiili teste girmeden **🔁 Hatırlayalım** kartıyla yeniden öğretiliyor.
  - AI prompt: gloss parçaları mümkün olan en küçük (ideal: tek kelime); TR koşul cümlelerinde gerçek dışı koşul için -sa/-se kipi ("kazanırsan … gezerdin" hatası). AI konusu `S.tab` bir konu değilse ekrandaki sorunun konusu. Seviye filtresi değişince kuyruk `S.tab` yerine aynı kaynaktan kuruluyor (`rebuildPracticeQueue`).

## 📍 KALDIĞIMIZ YER (2026-06-29)
- **Tamamlanan:** Faz 0 (AI güvenilirlik), Faz 1 (senkron dayanıklılığı), Faz 3 (tüm ES i18n + UX, canlı QA'lı), **Faz 2 backend + istemci DEPLOY EDİLDİ & CANLI**. Hepsi `main`'e commit'li.
- **Faz 2 canlı altyapı:** Cloud Function `ai` (us-central1) · secret `GEMINI_KEY` (Secret Manager) · kota 30/gün (`usage/{uid}`) · Blaze + $10/ay bütçe · temizlik politikası 3 gün. firebase CLI girişi: **taskiran3mre@gmail.com**. Proje: **english-app-b012f** (760623606825).
- **✅ PROXY DOĞRULANDI (loglarla):** Fonksiyon logları `auth: VALID` + `Callable request verification passed` gösterdi → anahtarsız+girişle çağrı sunucuya ulaşıyor, kimlik doğrulanıyor, anahtar sunucuda. Mimari testi GEÇTİ. Tek "hata" `Gemini HTTP 429` = Gemini **ücretsiz katman** kotası dar (~250/gün toplam, $0 harcama; tavan dolunca durur). Kod 429'u zaten zarif yönetiyor + kotayı iade ediyor.
- **✅ Groq YEDEK eklendi + DEPLOY EDİLDİ (`0ff340d`):** Sunucu proxy artık çift-sağlayıcı. `PRIMARY` sabiti sırayı belirler — **test boyunca `'groq'`** (ücretsiz, bol kota, Gemini free kotasını korur), diğeri her durumda yedek. 429/5xx/ağ/boş'ta otomatik geçiş. Kota-bypass koruması korundu (iade SADECE hiçbir sağlayıcı HTTP 200 dönmediyse). `GROQ_KEY` Secret Manager'da. **Lansman: `PRIMARY='gemini'` (tek satır).** Groq modeli: `llama-3.3-70b-versatile`.
- **✅ Faz 3.5 KAPANDI:** Müfredat (📅 **Bugün** günlük plan motoru + 📚 **Yol Haritası** uzun-soluklu rehber: sıralı müfredat, tempo-bazlı 🐢/⚡/🔥 haftalık plan, %80 ustalaşma) · temiz **4-hub IA** (Bugün/Öğren/Modlar/İlerleme; konular Öğren içinde, modlar Modlar içinde) · **Faz→seviye isimleri** (A1·Temeller … B2·İleri Yapılar; veri "Faz N:" kaldı) · 🔊 **sesli dinleme** (Web Speech, en-US, ücretsiz/çevrimdışı) · 🔒 **AI üretim kilidi** (üretilen cümleyi çevirmeden yenisi yok — spam/maliyet önlemi). Hepsi commit'li.
- **✅ Tutarlılık düzeltmesi (2026-06-27):** Üretim kilidiyle çelişen **toplu üretim (🌱 "konuya 10 cümle")** TAMAMEN kaldırıldı (`generateBatchForTopic` + modal yardımcıları + Yol Haritası/alt-konu seçici butonları). Artık tek yol: **tek tek üretim + çeviri kilidi** (weakpoint dahil hepsi kilitli). Karar gerekçesi: maliyet zaten 30/gün ile sert sınırlı; sorun felsefi tutarlılıktı ("bir cümleyi geçemiyorum ama 10 üretebiliyorum" saçmalığı). Kullanıcı "premium yap" yerine "tamamen kaldır"ı seçti. (İleride istenirse batch premium kaldıracı olarak geri gelebilir — şimdilik yok.)
- **🚀 UYGULAMA CANLI & DOĞRULANDI (son commit `d1b64ff`):** Firebase Hosting → **https://english-app-b012f.web.app** (arkadaş testi; sw.js/index.html no-cache → hep güncel; web.app Auth'a otomatik yetkili). **Uçtan-uca CANLI test GEÇTİ (2026-06-26 ~20:50):** auth/giriş ✅ · Groq üretimi temiz (loglarda 429/hata YOK) ✅ · F2 guard alakasız-isteği reddediyor ✅ · kota işliyor ✅. `PRIMARY='groq'`. Deploy: `npm run build:web && npx firebase-tools deploy --only hosting`.
- **✅✅ GÜVENLİK FASLI TAMAMLANDI (2026-06-27, son commit `e0f5fac`) — arkadaş paylaşımına HAZIR:**
  - **App Check KURULDU + ENFORCE EDİLDİ:** reCAPTCHA v3 (classic, site key `6LcGQjctAAAAAE8B78w_LnVsA5nb4agYUl7M3BCU`, public) → Firebase App Check'e secret girildi → istemci `firebase-app-check-compat` + guard'lı `activate(ReCaptchaV3Provider, true)` → fonksiyon `enforceAppCheck: true`. **KANITLANDI:** token akışı çalışıyor (Console Verified > 0; console `✅ App Check aktif (key len=40)`), ve `verify-f2.js` (token'sız node script) artık `Unauthenticated` ile REDDEDİLİYOR → **K1 (script/curl abuse) açığı KAPALI.** App Check **callable**'a (`httpsCallable('ai')`) otomatik token ekler → gerçek app etkilenmez. Kurulum tıkanması: ilk site key 39 krk truncated'dı + secret de yanlış kopyalanmıştı → düzeltildi (CfC ile konsol adımları yapıldı).
  - **E-POSTA DOĞRULAMA = GERÇEK KAPI (client + SUNUCU):** Kayıtta `sendEmailVerification` + üstte sarı bant (akış içinde, Tekrar gönder/Doğruladım). `canUseAI` artık `emailVerified` ister (doğrulanmamış → sabit cümle pratiği serbest, **AI kilitli**). Sunucu da `request.auth.token.email_verified !== true` → reddeder (**K2 kapalı**). "Doğruladım" `getIdToken(true)` ile token'ı zorla tazeler → AI anında açılır, bant kaybolur. **Karar: SERT kapı** (doğrulamadan AI yok; deneme kotası/soft reddedildi). Mail dağıtımı: Firebase varsayılan gönderici **spam'e düşüyor** (bilinen) → kayıt/AI-kapısı mesajları "spam/Promosyonlar'a bak + Tekrar gönder" diyor; **lansmanda özel gönderen alan adı** ile düzeltilecek.
- **✅ Bağımsız 4-ajan güvenlik+kalite denetimi yapıldı, TÜM bulgular düzeltildi:** **XSS (K3/Y1):** AI/kullanıcı metni tüm `innerHTML` sink'lerinde `escapeHtml`'lendi (renderQuestion+keyword regex, handleAccepted, showReviewQ+selRW imza değişti `(btn,idx)`, checkRev, AI havuz) + `validateAISentence` `<>` reddi. **Buglar:** A1 Atla'da üretim kilidi açılmıyordu → AI cümlesinde **Atla GİZLENDİ** (kilit delinmez: üret→çevir→üret); A2 varyasyon kutusunda takılma → manuel "Sonraki →"; E1 gizli-mod localStorage çökmeleri sarmalandı; B1 null email guard. **Regresyon denetimi (2 bağımsız ajan, 2026-06-27): KRİTİK/YÜKSEK/ORTA bulgu YOK** — header/onboarding/AI-kapısı/queue/logout/skip kod yolu izlenerek doğrulandı.
- **✅ Bu oturum UX işleri:** mobil **header sadeleştirildi** (flex-wrap; hesap/dil/⚙️ hep görünür, rozetler alt durum çubuğuna); **ilk açılış dil seçimi** (Adım 0 🇹🇷/🇪🇸 + `_detectLang` navigator.language oto-algılama); **ayarlardan API key alanları kaldırıldı** (giriş+proxy ile çalışır); İngiliz bayrağı→🇺🇸; Bugün ekranı kompakt; **logout artık onboarding/odak/tempo korur** (her çıkışta onboarding gelmesi düzeltildi); **buildQueue `shuffle(due)`** → "hep aynı ilk cümle" giderildi (çeşitlilik; doğru cevaplanan SRS ile ileriye planlanır, tekrar gelmez).
- **Freemium kapısı tasarımı (Faz 4 notu):** ücretsizdeki kısıtlar = premium açılışları → 🆓 30/gün+önce-çevir-kilidi+cihaz sesi · 💎 yüksek/sınırsız kota+belli sayıda "geç" hakkı+premium neural ses (bulut TTS). Mimari hazır, premium sadece gevşetir.
- **Faz 2 KAPANDI** (proxy doğrulandı + güvenlik denetimi geçti), **Faz 3 KAPANDI** (i18n wave-5, ES tam).
- **Faz 4 SÜRÜYOR — Capacitor native iskeleti KURULDU (`13e3286`):** package.json + capacitor.config (appId placeholder!) + `www/` copy script (test edildi) + NATIVE.md runbook. npm install OK (cap CLI 6.2.1). Native proje üretimi/derleme build makinesinde (JDK17+, Android Studio; iOS=Mac).
- **✅ Kullanıcı testi geri bildirimi — 9 madde düzeltildi (2026-06-27, `5285fa7`):** çıkışta veri kaybı (bekleyen senkron çıkıştan önce flush + level_filter/daily_log korunur; srs/gstats zaten buluta senkron → girişte geri gelir) · soft "neredeyse kusursuz" sonsuz döngü (2 deneme + "Yine de gönder") · düşünürken eski hata flash'ı (resetUI temizler) · yanlışta "Tekrar Dene" sayaç/cevap düzeltmesi · doğru cevap 2sn→3.5sn · ses butonu etiketli ("🔊 Dinle") · **AI üretiminde özne çeşitliliği** (he/she/-s) · **"🎯 Zayıf Noktam" tamamen kaldırıldı** (kullanıcı kararı; Tekrar/SRS + Odaklan yeterli).
- **✅ Test geri bildirimi tur-2 (2026-06-27):** **he/she/it değerlendirmede eşdeğer kabul** (kaynak TR "o" cinsiyetsiz → "he" yazınca ref "she" olsa da kabul; yerel `_pronEq` + AI grade kuralı — soft "neredeyse kusursuz" batağının ASIL kökü buydu) + AI üretiminde özne çeşitliliği (he/she/-s). **Doğru/kabul sonrası OTOMATİK GEÇİŞ KAPATILDI** → kullanıcı "Sonraki →" ile kendi geçer (dinleyebilir / AI üretebilir); `_showContinue`, auto-advance setTimeout'ları kaldırıldı.
- **✅ 🎙️ SESLİ SOHBET v1 KURULDU (2026-06-27, `178b39f`) — "aktif öğrenme" parçası:** Modlar → Sesli Sohbet. Turn-based: AI İngilizce casual sohbet başlatır → `speak()` TTS okur → kullanıcı **mikrofonla** cevaplar (Web Speech `SpeechRecognition`, en-US) → AI doğal cevap + sohbeti sürdürür → TTS → döngü. "Bitir & Değerlendir" → konuşmayı inceleyip TR/ES geri bildirim (hatalar + öneri). **Kalite için GEMINI beyni** (functions `data.model='gemini'` → Gemini önce, Groq yedek; cümle üretimi Groq kalır). Maliyet App Check + 30/gün kota ile sınırlı (~1¢/sohbet). **Kısıtlar:** telaffuz puanı YOK (ileride premium); iOS Safari STT zayıf (web+Android OK). **App Check enforce olduğu için backend node-test edilemez → tarayıcı testi kullanıcıda.**
  - **SONRAKİ AŞAMA (kullanıcı planı):** realtime (Gemini Live / OpenAI Realtime, ~50¢-1.5$/sohbet=premium) · 3-4 turn'de toplu hata özeti · telaffuz puanı (Azure, premium) · doğal neural ses (premium).
- **✅ Test geri bildirimi tur-3 (2026-06-27, `72489d4`):** gen-kilidi ORTA YOL (yanlış cevap açmaz; sadece doğru/kabul açar — saçma cevapla üretim engeli; takılırsa konu pratiği açar) · AI örnek cümle **2/konu** sınırı · roadmap % artık **"X/Y cümle · %Z"** (mantık: ustalaşma=correctStreak≥2, %80'de tamam) · **B1 CEFR kalibrasyonu** (yan cümle/bağlaç ister) + **dil-saflığı** kuralı · **stripForeign** (必要 gibi CJK/Kiril/Arap sızıntısı aiHtml+hata-analizinden ayıklanır) · fiil **shuffle** (çeşitlilik).
- **⏸️ AÇIK TUTULAN (kullanıcı "şimdilik takılma" dedi, test sonrası karar):** Otomatik geçiş — cümle akışında MANUEL yapıldı; **FİİLLER (checkVerb) hâlâ otomatik** (kullanıcı manuel istedi ama önce mevcut manuel sürümü test edecek).
- **✅ Fiil listesi genişletildi (2026-06-27, `f548666`):** ~46 → **157 doğrulanmış düzensiz fiil** (workflow: üret + 3-mercek EN/TR/ES doğrulama; 13 regular + 10 çöp/dupe elendi). checkVerb slash-alternatif kabul ediyor (be→was/were).
- **💡 İLERİDE (kullanıcı fikirleri):** **kelime çalışma kampı** (zayıf çıkan kelimeler — şu an stats "Odaklan" hata-etiketi bazlı çalışıyor, KALDIRILMADI; sadece AI-üreten "Zayıf Noktam" butonu kalktı) · müfredat **interleaving** (Öğren'de hep aynı konu yerine konu çeşitliliği / "haftanın teması") · lansmanda **PRIMARY='gemini'** (Groq llama TR/ES'te kalite + yabancı-alfabe sızıntısı yapıyor).
- **👥 Test kullanıcıları (2026-06-27, auth:export): 6 hesap** — doğrulanmış: taskiran3mre@gmail.com (sahip, 103g), tahaboshesap@gmail.com; doğrulanmamış: taha@app.com, tablet1881@gmail.com, marco_nicolini@hotmail.com, test-faz2@deneme.com. Çoğu tek-oturum. **AI kullanımı:** usage/{uid} yalnızca GÜNLÜK sayaç tutar (her gün üzerine yazılır) → kümülatif token/çağrı izlenmiyor; toplam için Console→Functions→ai→metrics.
- **✅ Maliyet güvenliği (2026-06-27, `ccef7be`):** Kodda **SERT global günlük kota** `GLOBAL_DAILY_LIMIT=500` (functions/index.js) — TÜM kullanıcılar toplam/gün; `usage/__global__` atomik sayaç (per-user 30/gün ile aynı transaction). Aşılırsa AI durur → para harcama ihtimaline karşı devre kesici. Şu an her şey ücretsiz katmanda ($0); bu, paid'e geçilse bile sert tavan. **TTS iyileştirildi:** `_pickEnVoice` neural/natural sesleri önce seçiyor (Edge "Online (Natural)" / Android Google neural = ücretsiz+doğal; Chrome=Google US English). Gerçek-her-cihazda-doğal ses = paid cloud TTS (premium, sonra).
- **🛡️ HARİCİ/ÇOK-AJANLI GÜVENLİK DENETİMİ (2026-06-29) — genel sonuç: İYİ SAVUNULMUŞ, kritik/yüksek açık YOK.** 30 ajan + düşmanca doğrulama (22 ham bulgu → 10 yanlış-pozitif elendi). Mimari sağlam: AI anahtarları Secret Manager'da, App Check enforce, e-posta doğrulama enforce, atomik kota (30/kullanıcı + 500 global), Firestore kuralları kapalı, XSS-bilinçli escapeHtml/aiHtml. Repoda commit'li gerçek sır YOK.
  - **✅ TEK GERÇEK KOD BUG'I DÜZELTİLDİ (`879ec4c`):** AI havuzu sil butonu kaçışsız `${s.id}`'yi inline `onclick`'e basıyordu (depolanmış-XSS taşıyıcısı; istismar: Firebase SDK ile kendi `users/{uid}` dokümanına `id:"x');payload//"` yaz → çöp-kutusu tıkla → keyfi JS, **self-XSS** çünkü Firestore sahip-bazlı). **Çift savunma:** (1) sink kaldırıldı → `data-del-id` + `escapeHtml` + delegated listener; (2) okuma yolu → `sanitizeAISentences` artık `id`'yi `/^[A-Za-z0-9_-]+$/` ile doğruluyor (buluttan gelen kötücül id `syncFromCloud`'da ayıklanır).
  - **✅ Sertleştirmeler (aynı commit):** generic auth hatası (`_authErrMsg`: ham `e.message` yerine kod-eşlemeli; wrong-password/user-not-found tek generic → **e-posta enumeration** sızıntısı kapandı) · `showTopicSummary` başlığında topic HTML-kaçışı (topic statik müfredat verisi, derinlemesine savunma) · **güvenlik başlıkları** firebase.json'a: X-Content-Type-Options nosniff, X-Frame-Options DENY, Referrer-Policy, HSTS, Permissions-Policy(microphone=self,camera=(),geolocation=()) + CSP'nin inline-kırmayan alt kümesi (`object-src 'none'; base-uri 'self'; frame-ancestors 'none'`) · SW v21→v22.
  - **⏳ KULLANICI DEPLOY ETMELİ (CLI bu makinede yok):** `npm run build:web && npx firebase-tools deploy --only hosting` — başlıklar + kod fix'leri ANCAK deploy sonrası canlıda etkili.
  - **⏳ FIREBASE CONSOLE (kod değil, kullanıcı paneli):** (1) Authentication → Settings → **Email Enumeration Protection** AÇ. (2) Google Cloud Console → Web API key'e **HTTP referrer + API kısıtı** (`*.web.app`/`firebaseapp.com`) — apiKey public kimliktir, koddan silmek çözüm değil; kısıtlama doğru savunma. Not: Auth REST uçları (signUp/sendOobCode) App Check kapsamı dışında → bunlar önemli ama tek başlarına düşük etki (Firebase kendi gönderim kotasıyla sınırlı).
  - **⏳ KARAR GEREKTİREN (yapılmadı, bilinçli):** **Firestore write'a `email_verified` şartı** = UX tradeoff (doğrulanmamış testçi ilerleme senkronu kaybeder) → eklenmedi, karar bekliyor; alternatif Console'da **Firestore için App Check enforcement** (UX maliyeti yok). **Tam `script-src` CSP** ertelendi: uygulama her yerde inline `onclick` kullanıyor → gerçek CSP tüm handler'ların refaktörünü gerektirir (büyük iş). **Tailwind CDN'i build-time gömme** (prod hijyen, SRI yerine). **🎙️ Sesli sohbet KVKK/GDPR:** mikrofon transkriptini ABD AI sağlayıcısına aydınlatma/onay olmadan gönderiyor → **ilk kullanımda onay diyaloğu + gizlilik politikası** (Faz 4 hukuki ile bütünleştir; AB/İspanya hedefi + olası reşit-olmayan kullanıcı nedeniyle önemli).
  - **✅ Endişe GEREKTİRMEYEN (doğrulandı):** AI anahtar yönetimi (sunucuda, sızmıyor) · kota atomik (yarış-bypass yok) · "500 global = DoS" → bilinçli/belgeli maliyet devre-kesici, açık değil · SSRF/prompt-injection/temperature → kotayla sınırlı · `users/` alan-allowlist yok → latent (hiçbir kod users/'tan rol/premium okumuyor; ileride entitlement'ı AYRI `entitlements/{uid}` koleksiyonuna koy).
- **SIRADAKİ (Faz 4):** monetizasyon mimarisi (RevenueCat/IAP + freemium kapısı) · hukuki metinler (ToS/KVKK/gizlilik — **sesli sohbet onay diyaloğu dahil**) · appId kesinleştir · **lansmanda: e-posta özel gönderen alan adı (spam'i azaltır) + `PRIMARY='gemini'`.** ~~App Check + e-posta doğrulama~~ ✅ TAMAMLANDI (2026-06-27). ~~Güvenlik denetimi~~ ✅ TAMAMLANDI (2026-06-29, kod fix'leri commit'li; Console + deploy kullanıcıda).
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
