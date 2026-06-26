# Google Stitch — Frontend Redesign Prompt

> Aşağıdaki bloğu Google Stitch'e yapıştır. İstersen önce "OVERVIEW + DESIGN SYSTEM"i ver,
> sonra her ekranı tek tek "SCREENS" bölümünden besle (Stitch ekran-ekran daha iyi çalışır).
> **Önemli:** Stitch çıktısı GÖRSEL keşif/koddur — mevcut tek-dosya uygulamaya birleştirmek
> ayrı ve dikkatli bir iş; araçları kırmadan sonra beraber yaparız.

---

```
You are designing a polished, modern redesign of an existing mobile-first language-learning app.
Keep ALL existing features — this is a visual/UX redesign, NOT a feature change. Every tool in the
"MUST-KEEP CHECKLIST" at the end must appear somewhere in the design.

# APP OVERVIEW
"İngilizce Pratik" is a mobile-first PWA that teaches English to Turkish and Spanish speakers through
translation practice powered by AI. The user reads a sentence in their native language (Turkish or
Spanish) and types the English translation; the app checks it, explains mistakes, generates new
practice sentences with AI, and schedules spaced-repetition review. Fully bilingual UI (Turkish default,
Spanish variant). Adult, self-study audience.

# DESIGN DIRECTION
Modern, clean, focused, encouraging — Duolingo-level polish but more adult and minimal (not childish).
Subtle gamification (streak flames, progress bars), never noisy. Strong visual hierarchy, generous
spacing, large tap targets, accessible contrast.

# DESIGN SYSTEM
- Theme: DARK mode primary. Background near-black (#0F0F0F), cards #161616, borders #232323.
- Accent: blue #3B82F6 (primary actions). Success green #22C55E, error red #EF4444, warning amber #EAB308.
- Typography: clean sans-serif; clear weight hierarchy (bold titles, muted secondary text #9CA3AF).
- Shapes: rounded-2xl cards, pill-shaped tabs and badges, large rounded primary buttons.
- Layout: mobile-first (360–430px wide), also usable as an installed app. Bottom tab navigation.
- Emoji may be used as small functional icons.

# LOCALIZATION
UI labels are in TURKISH by default (a Spanish variant exists). Use the Turkish labels given below.
Leave room for longer Spanish strings (designs must not break with ~30% longer text).

# NAVIGATION (bottom tab bar — EXACTLY 4 hubs, grouped by function)
Tabs: "📅 Bugün" (today/home), "📚 Öğren" (curriculum/roadmap — all learning UNITS live here),
"🎮 Modlar" (practice modes: mixed drill, review, verbs, conversation modes),
"📊 İlerleme" (stats). Settings gear + language toggle in the header.
CRITICAL IA RULE: do NOT place topic units or activity types as top-level tabs. Topic units live
INSIDE "Öğren"; activity types live INSIDE "Modlar". The top bar shows ONLY these 4 hubs.

# UNIT NAMING (curriculum units — use these, NOT "Faz 1/2")
Ordered learning path inside "Öğren": 🔤 Temel (irregular verbs) → A1 · Temeller (nouns/pronouns/to be)
→ A2 · Zamanlar (tenses) → A2–B1 · Yardımcı Fiiller (modals) → B1 · Bağlantı & Karşılaştırma
(comparatives/conjunctions/prepositions) → B2 · İleri Yapılar (passive/conditionals/reported speech).
Each unit shows mastery progress (✓ done · ▶ now · ○ upcoming) and the user can tap to study it.
"Öğren" also offers a pace selector (🐢 Rahat / ⚡ Normal / 🔥 Yoğun) → weekly plan ("Bu hafta / Gelecek hafta").

# SCREENS (design all of these)

1) HEADER (persistent top bar)
   App name "İngilizce Pratik"; streak chip "🔥 7 gün"; AI-pool badge "🤖 8"; session score "12 / 15";
   account chip showing email + "Çıkış"; language toggle "TR / ES"; settings gear ⚙️.

2) BUGÜN (Today — primary home screen) [NEW]
   A daily study-plan dashboard. Top: big streak "🔥 7 gün" + daily goal "Günde 1 oturum" + a progress
   ring/bar "%40". A "plan card" listing today's mix as checklist rows:
     "🔁 10 Tekrar"  "🌱 5 Yeni cümle"  "🎯 3 Zayıf nokta"  "🔤 5 Fiil".
   One large primary button: "▶ Bugüne Başla". Estimated time "~12 dk".
   Also a "completed" state: a celebratory summary card (correct count, streak extended).

3) PRATİK (main practice loop)
   - Topic tabs as horizontal pills: "🎲 Karışık", "Faz 1", "Faz 2", "Faz 3", "Faz 4", "Faz 5", "🔁 Tekrar".
   - Row with: translation direction toggle "TR → US"; a "📚 Konu" topic picker; a level dropdown (A1–C1, e.g. "B1").
   - QUESTION CARD: a small topic tag (e.g. "Faz 1: To Be"), the native sentence to translate
     (Turkish/Spanish) with a few underlined tappable vocabulary words that reveal meaning below,
     and a 🔊 speaker button to hear the English sentence (American accent, English only).
   - Text input with placeholder "İngilizce çevirinizi yazın...".
   - Primary button "Kontrol Et"; secondary "💡 İpucu" and "Atla".
   - Below: a row of two buttons "🤖 AI ile Yeni Cümle" and "🎯 Zayıf Noktam".
   - FEEDBACK states: correct (green), incorrect (red) showing the correct answer, and an AI
     explanation block (error type + explanation + hint) plus a "📖 Bu konuyu bana öğret" and
     "🔄 Bu cümleyi başka nasıl kurarım?" expandable AI helper.

4) TEKRAR (Review — spaced repetition)
   Due-count header "Bugün 10 cümle tekrar zamanı." A word-order exercise: the native sentence on top,
   a set of tappable word chips (scrambled English words) the user taps to build the sentence into an
   answer area, with "Kontrol Et", "Temizle", "Atla".

5) FİİLLER (Irregular verbs)
   A card showing the base verb (V1) big, two inputs for V2 and V3, a "Kontrol Et" button. After
   answering, show a tense mini-lesson: "Present Simple / Past Simple / Present Perfect" example
   sentences with tappable tooltips for the native meaning. Progress "learned / total".

6) EKSTRA MODLAR (Extra AI modes)
   A grid of four mode cards:
     "🎭 Senaryo — Roleplay" (respond to a real-life situation in English),
     "🚫 Tabu — Kelime Açıkla" (describe a word in English without translating),
     "📖 Hikaye Tamamlama" (continue a half-finished sentence/story),
     "💡 Kelime Çağrışım" (write 3 associations in English).
   Each opens a screen: a prompt/scenario, a multi-line English answer box, a "Gönder" button, and an
   AI feedback panel (evaluation, mistakes, better version, teacher note).

7) İSTATİSTİK (Stats)
   Cards for: accuracy "%", "Öğrenildi" learned count, streak. A "Konu Bazında Performans" list with
   per-topic progress bars. A "⚠️ Zayıf Alan Raporu" listing top error types with counts and a
   "Odaklan" button each. A pool summary "Temel / AI / Toplam" sentence counts.

8) AI HAVUZU (AI Pool modal)
   A scrollable list of AI-generated sentences; each row has tags (topic, source "🤖 AI" or "🎯 Zayıf",
   language "TR/ES", date) and a delete 🗑️ button. A count header and an empty state.

9) SEVİYE YOLU (Curriculum / Level Path) [NEW]
   A visual learning path of topics shown as connected nodes: ✓ completed, ▶ current, 🔒 locked.
   A level indicator (A1–C1) and a small "mastery %" per topic. Tapping current continues practice.

10) AYARLAR (Settings)
   Focus-area selector ("🎯 Hedef Alanım"), level-filter chips, optional API-key inputs, and a
   "🗑️ Tüm Veriyi Sıfırla" destructive button (with a confirm modal).

11) GİRİŞ (Auth modal)
   Email + password fields, primary "Giriş Yap", and a toggle to "Kayıt Ol".

12) ONBOARDING
   A welcome step explaining the value, then a focus-area selection, then a "Başla →" button.

# MUST-KEEP CHECKLIST (do NOT omit any of these tools)
[ ] Daily plan ("Bugün") with start button & streak/goal
[ ] Translation practice with check / hint / skip
[ ] Tappable vocabulary hints on the question
[ ] 🔊 Audio playback of the English sentence (American accent)
[ ] AI: generate new sentence, weak-point practice, "teach me this", "other phrasings"
[ ] Spaced-repetition Review (word-order builder)
[ ] Irregular verbs trainer (V1/V2/V3 + tenses)
[ ] Four Extra AI modes (roleplay, taboo, story, word-association)
[ ] Stats (accuracy, learned, per-topic bars, weak-area report, pool counts)
[ ] AI pool list (view/delete generated sentences)
[ ] Level path / curriculum with locked-topic progression
[ ] Topic tabs (Karışık + Faz 1–5 + Tekrar), level selector, direction toggle
[ ] Streak indicator, AI-pool badge, session score
[ ] Settings (focus area, level filter, reset), Auth (login/register), Onboarding
[ ] Bilingual UI (Turkish default, Spanish variant), dark mode

# DELIVERABLE
Design consistent mobile screens for all the above using the design system. Provide a cohesive set
(home/Bugün first), reusable components (cards, pills, buttons, badges), and an optional light-mode variant.
```
