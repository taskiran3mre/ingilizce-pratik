# Müfredat & Çalışma Düzeni — Tasarım (Faz 3.5)

> **Amaç:** "Nereden başlamalı, düzenli tekrarla ne yapmalı" belirsizliğini bitirmek. Kullanıcının asıl
> sorunu: **düzen oturtamamak.** Çözüm = her gün net bir plan + ne öğreneceğinin net bir yolu.
>
> **Seçilen model:** Günün Planı motoru + Seviye yolu (birleşik). **Aşamalı kurulur** — önce Günün Planı.

---

## Increment 1 — "Bugün" (Günün Planı motoru) ⭐ önce bu
Tek ekran + tek buton. Karar yorgunluğunu bitirir.

### Ekran: yeni "Bugün" sekmesi
- Üstte: 🔥 seri (mevcut streak) + "günde 1 oturum" hedefi + bugünkü ilerleme yüzdesi.
- Tek büyük buton: **[ ▶ Bugüne Başla ]**.
- Plan kartı (ne içerdiğini gösterir):
  - 🔁 **Tekrar:** SRS'te `nextReview ≤ bugün` olan cümleler (tavan ~15).
  - 🌱 **Yeni:** mevcut konudan birkaç yeni cümle (varsayılan 5; AI veya havuzdan).
  - 🎯 **Zayıf nokta:** en çok hata yapılan etiketlerden 2-3 (varsa).
  - 🔤 **Fiil:** günlük fiil seti (mevcut `showVerbs` günlük mantığı, ~5).

### `buildDailyPlan()` — uyarlanır boyut
- Vadesi gelen tekrar çoksa → yeni cümle sayısını kıs (bunaltma). Azsa → yeni'yi artır.
- Hiç tekrar yoksa ve yeni konu bittiyse → "bugünlük tamam, istersen ekstra pratik" de.
- Çıktı: sıralı bir kuyruk → tekrar → yeni → zayıf → fiil.

### Oturum koşucusu
- Kuyruğu sırayla işler; her blok mevcut alıştırma ekranlarını yeniden kullanır (review/practice/verb).
- Bitince: ✅ özet (kaç doğru, seri uzadı), streak güncellenir.

### Yeniden kullanılan mevcut altyapı
SRS (`getSRS/updateSRS/nextReview/today()`), `genValidatedSentence` (yeni cümle), zayıf-nokta
(`practiceWeakPoint`), günlük fiil (`showVerbs`), streak (`updateStreak`). **Yeni veri modeli minimum.**

### Yeni state
- `LS`: `dailyPlan_<tarih>` (bugünün kuyruğu + ilerleme; gün değişince sıfırlanır), `lastSessionDate`.

---

## Increment 2 — "Seviye Yolu" (ne öğreneceğin) — sonra
- **Yerleştirme:** ilk girişte seviye seç (A1/A2/B1/B2/C1) veya 5 soruluk mini test → `S.curriculumLevel`.
- **Sıralı yol:** mevcut Faz/konular seviyelere eşlenir; yol ekranı: ✓ tamamlanan · ▶ mevcut · 🔒 kilitli.
- **Ustalaşma kapısı:** bir konunun cümlelerinin ~%80'i SRS `correctStreak ≥ 2` olunca konu "ustalaşıldı" → sonraki kilit açılır.
- **Bağlantı:** mevcut konu = Günün Planı'nın "yeni" kaynağı. Böylece iki sistem birleşir:
  seviye yolu *ne*yi, Günün Planı *bugün ne kadarını* söyler.

### Yeni state
- `LS`: `curriculumLevel`, `topicMastery` (konu→durum türetilir; çoğu SRS'ten hesaplanır).

---

## Bilerek BASİT tutulanlar (kapsam kontrolü)
- Yerleştirme = önce basit self-seçim (mini test sonra).
- Ustalaşma eşiği tek sayı (%80), karmaşık model yok.
- Mevcut ekranlar yeniden kullanılır; baştan UI yazılmaz.
- Sosyal/gamification (rozet, lig) şimdilik YOK — önce çekirdek düzen.
