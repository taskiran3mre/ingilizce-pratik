// Capacitor webDir (www/) için statik web varlıklarını kökten kopyalar.
// Kök yapı "kaynak doğruluğu"nda kalır; www/ ÜRETİLEN bir derleme çıktısıdır (gitignore'lu).
// Böylece native kabuk için ayrı bir build adımı kurmadan, mevcut PWA aynen paketlenir.
import { mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');

// Native kabuğa girmesi gereken tüm statik varlıklar:
const ASSETS = ['index.html', 'data.js', 'sw.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];

if (existsSync(www)) rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

let copied = 0;
for (const f of ASSETS) {
  const src = join(root, f);
  if (!existsSync(src)) { console.warn('UYARI: bulunamadı, atlanıyor →', f); continue; }
  copyFileSync(src, join(www, f));
  copied++;
}
console.log(`www/ hazır — ${copied}/${ASSETS.length} varlık kopyalandı.`);
