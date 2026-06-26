# Native Kabuk (Capacitor) — Kurulum & Yayın Kılavuzu

> Bu PWA, **Capacitor** ile Android/iOS native uygulamasına sarılır. Kök yapı (index.html, data.js, sw.js…)
> **kaynak doğruluğunda** kalır; `npm run build:web` bunları `www/` derleme klasörüne kopyalar ve Capacitor
> oradan paketler. Yani web tarafını her zamanki gibi geliştir; native sadece `www/`'yi sarar.

## 0. Durum (iskelet hazır)
- `package.json` — Capacitor 6 bağımlılıkları + scriptler ✅
- `capacitor.config.json` — `appId`, `appName`, `webDir: www` ✅
- `scripts/copy-web.mjs` — web varlıklarını `www/`'ye kopyalar ✅
- `.gitignore` — `www/`, `android/`, `ios/`, imza anahtarları dışlandı ✅
- **Native proje (`android/`, `ios/`) ve derleme bu makinede YAPILMADI** — aşağıdaki ortam gerekçesiyle.

## 1. Ön koşullar (derleme makinesinde — bir kez)
| Platform | Gerekli | Not |
|---|---|---|
| **Android** | **JDK 17+** (mevcut JDK 8 YETMEZ) · Android Studio + Android SDK · `ANDROID_HOME` | Capacitor 6 → JDK 17. Studio'yu kurunca SDK + emulator gelir. |
| **iOS** | **macOS** + Xcode + CocoaPods | iOS **Windows'ta derlenemez** — Mac şart (veya bulut Mac CI). |

> ⚠️ Bu projedeki mevcut ortam: JDK 8 + Android SDK yok + Windows. Yani native build için yukarıdakiler kurulmalı.

## 2. İlk kurulum (derleme makinesinde)
```bash
npm install                      # Capacitor paketlerini çek
npm run build:web                # www/ üret
npx cap add android              # android/ native projesini üretir
npx cap add ios                  # (yalnızca Mac) ios/ native projesini üretir
```

## 3. Geliştirme döngüsü (web değişince)
```bash
npm run cap:sync                 # = build:web + cap sync (www → native)
npx cap open android             # Android Studio'da aç → Run
npx cap open ios                 # (Mac) Xcode'da aç → Run
```

## 4. appId — YAYINDAN ÖNCE KESİNLEŞTİR ⚠️
`capacitor.config.json` → `appId` şu an **placeholder**: `com.enpratik.app`.
- Mağazaya ilk yüklemeden sonra **DEĞİŞTİRİLEMEZ**. İdeali sahip olduğun bir alan adının tersi (ör. `com.<şirket>.enpratik`).
- Karar verince hem burada hem (oluşturulduysa) `android/` & `ios/` içinde güncelle.

## 5. Bilinen native uyarlamalar (Faz 4 işleri — iskelet sonrası)
- **Firebase Auth**: WebView'de popup çalışmaz. Native'de `signInWithRedirect` veya `@capacitor-firebase/authentication` gerekir. (Şu an e-posta/şifre kullanıldığı için popup sorunu yok; Google/Apple ile giriş eklenirse bu gerekli.)
- **Service Worker**: Native'de varlıklar zaten yerelde paketli; SW gereksiz/çakışabilir. Native build'de SW kaydını `Capacitor.isNativePlatform()` ile atlamayı değerlendir.
- **App Check**: Web'de reCAPTCHA; native'de **Play Integrity (Android) / App Attest (iOS)** — farklı sağlayıcı. (Lansman kapısı; `usage/` kotası + auth zaten devrede.)
- **IAP / Abonelik**: RevenueCat (`@revenuecat/purchases-capacitor`) ile Apple+Google tek çatı. (Ayrı Faz 4 iş kolu.)
- **Durum çubuğu / splash / ikonlar**: `@capacitor/status-bar`, `@capacitor/splash-screen`, `cordova-res`/`@capacitor/assets` ile native ikon/splash üretimi.

## 6. İmzalama (yayın) — güvenlik
- Android: release `*.keystore`/`*.jks` üret, **GÜVENLİ sakla, ASLA commit etme** (`.gitignore`'da). Kaybedilirse uygulama güncellenemez.
- iOS: Apple geliştirici hesabı + signing certificate + provisioning profile.
