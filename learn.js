/* EN Pratik — öğrenme katmanı (learn.js)
 *  1) Kelime anlamı (gloss): cümledeki HER kelimeye/ifadeye dokununca anlamı — Duolingo tarzı baloncuk.
 *  2) Düzensiz fiiller v2: yeni fiil önce ÖĞRETİLİR (anlam + İngilizce tanım + örnek + kalıp ailesi), sonra test edilir.
 *  3) Phrasal verbs: edat (particle) mantığına göre gruplar, öğrenme kartları, çoktan seçmeli test, aralıklı tekrar.
 *
 * index.html'deki global yardımcıları kullanır: S, LS, L, t, escapeHtml, speak, speakBtn, TTS_OK, geminiCall,
 * canUseAI, extractJSON, getNative, getKw, today, shuffle, showScreen, getCurVerbs, getVerbSRS, saveVerbSRS,
 * getVerbNative, updateStreak, bumpDaily, getAISentences, lastApiError.
 * Veri: learn-data.js (SENTENCE_GLOSS, VERB_INFO, VERB_FAMILIES, PV_GROUPS, PHRASAL_VERBS).
 */

function _esc(x) { return escapeHtml(x); }
function _shuf(a) { const b = a.slice(); shuffle(b); return b; }
function _addDays(n) { return new Date(Date.now() + 86400000 * n).toISOString().split('T')[0]; }
function _rxEsc(x) { return String(x).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/* ============================================================================
 * 1) KELİME ANLAMI (gloss)
 * Veri biçimi: [[ana dil parçası, İngilizce parça], ...] — cümle sırasında, tüm kelimeleri kapsar.
 * Kaynak: AI cümlesinin kendi q.gloss alanı → sabit cümleler için SENTENCE_GLOSS → yerel önbellek.
 * Hiçbiri yoksa dokunulan kelime için cümlenin tamamının eşleşmesi AI'dan BİR KEZ istenir (ensureGloss).
 * ========================================================================== */
const GLOSS_CACHE_KEY = 'gloss_cache';
const _glossCtx = {};        // kapsayıcı kimliği → { q, srcIdx, text, render }
const _glossTried = {};      // cümle anahtarı → bu oturumda AI'dan istendi mi
const _glossInflight = {};   // cümle anahtarı → bekleyen istek
const _G_WORD_RX = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

function _gLang() { return S.lang === 'es' ? 'es' : 'tr'; }
function _gKey(q) { return _gLang() + ':' + (q && q.id); }
// Uzunluğu KORUYAN küçük harf (İ→i, I→ı; tek kod birimi) → bulunan konumlar orijinal metinle birebir aynı.
function _gNorm(x) { return String(x == null ? '' : x).split('').map(c => { const l = c.toLocaleLowerCase('tr'); return l.length === 1 ? l : c; }).join('').replace(/[’‘`´]/g, "'"); }
function _gIsW(c) { return !!c && /[\p{L}\p{N}]/u.test(c); }
function _gTrimPunct(x) { return String(x || '').trim().replace(/^[.,!?;:"“”()¿¡]+|[.,!?;:"“”()¿¡]+$/g, '').trim(); }
function _gCache() { try { return JSON.parse(localStorage.getItem(GLOSS_CACHE_KEY) || '{}') || {}; } catch (e) { return {}; } }
function _gCacheSet(q, pairs) {
    try {
        const c = _gCache(); c[_gKey(q)] = pairs;
        const k = Object.keys(c); if (k.length > 500) k.slice(0, k.length - 500).forEach(x => delete c[x]);
        localStorage.setItem(GLOSS_CACHE_KEY, JSON.stringify(c));   // LS.set değil: buluta yazmaya gerek yok
    } catch (e) {}
}

function getGloss(q) {
    if (!q) return null;
    if (Array.isArray(q.gloss) && q.gloss.length) return q.gloss;
    try {
        const m = (typeof SENTENCE_GLOSS !== 'undefined') && SENTENCE_GLOSS[_gLang()];
        const st = m && m[q.id];
        if (st && st.length) return st;
    } catch (e) {}
    const c = _gCache()[_gKey(q)];
    return Array.isArray(c) && c.length ? c : null;
}

// AI'dan gelen eşleşmeyi temizle: yalnızca [metin, metin] çiftleri, makul uzunluk, HTML karakteri yok.
function cleanGloss(raw) {
    if (!Array.isArray(raw)) return null;
    const out = [];
    for (const p of raw) {
        let a, b;
        if (Array.isArray(p)) { a = p[0]; b = p[1]; }
        else if (p && typeof p === 'object') { a = p.tr != null ? p.tr : (p.es != null ? p.es : p.native); b = p.en; }
        if (typeof a !== 'string' || typeof b !== 'string') continue;
        a = _gTrimPunct(a); b = b.trim();
        if (!a || !b || a.length > 80 || b.length > 80 || /[<>]/.test(a + b)) continue;
        out.push([a, b]);
        if (out.length >= 40) break;
    }
    return out.length ? out : null;
}

// Parçaları metinde bul → [{s, e, hint}] (çakışmasız, kelime sınırında).
// srcIdx 0: ana dil metni gösteriliyor (parçalar cümle sırasında → imleçli arama).
// srcIdx 1: İngilizce metin gösteriliyor (sıra farklı → uzun parça önce, ilk boş yer).
// "Have you ... been" gibi bölünmüş parçalar desteklenir (her bölüm sırayla aranır, hepsine aynı anlam).
function _gLocate(text, pairs, srcIdx) {
    const T = _gNorm(text), spans = [];
    const free = (s, e) => !spans.some(x => s < x.e && e > x.s);
    const ok = (s, e) => !_gIsW(T[s - 1]) && !_gIsW(T[e]) && free(s, e);
    const find = (n, from) => { let pos = T.indexOf(n, from); while (pos !== -1 && !ok(pos, pos + n.length)) pos = T.indexOf(n, pos + 1); return pos; };
    const list = (pairs || []).map(p => ({ src: String(p[srcIdx] || ''), hint: String(p[1 - srcIdx] || '').trim() }));
    if (srcIdx === 1) list.sort((a, b) => b.src.length - a.src.length);
    let cursor = 0;
    for (const it of list) {
        const parts = it.src.split(/\s*(?:\.\.\.|…)\s*/).map(x => _gNorm(_gTrimPunct(x))).filter(Boolean);
        if (!parts.length || !it.hint) continue;
        let from = srcIdx === 0 ? cursor : 0;
        const found = [];
        for (const n of parts) {
            let pos = find(n, from);
            if (pos === -1 && srcIdx === 0 && !found.length) pos = find(n, 0);   // sıra dışı parça → baştan boş yer
            if (pos === -1) { found.length = 0; break; }
            found.push({ s: pos, e: pos + n.length });
            from = pos + n.length;
        }
        if (!found.length) continue;
        found.forEach(f => spans.push({ s: f.s, e: f.e, hint: it.hint }));
        if (srcIdx === 0) cursor = Math.max(cursor, found[found.length - 1].e);
    }
    return spans.sort((a, b) => a.s - b.s);
}

// Metindeki kelimelerin ne kadarı bir anlamla kaplı (0..1) — AI çıktısını kabul etmek için.
function glossCoverage(text, pairs, srcIdx) {
    const spans = _gLocate(text, pairs, srcIdx || 0);
    let tot = 0, cov = 0;
    for (const m of String(text || '').matchAll(_G_WORD_RX)) {
        tot++;
        const s = m.index, e = s + m[0].length;
        if (spans.some(x => s >= x.s && e <= x.e)) cov++;
    }
    return tot ? cov / tot : 0;
}

function glossHtml(text, q, srcIdx, ctxId) {
    text = String(text || '');
    let pairs = getGloss(q);
    // AI'sız yedek: en azından anahtar kelimeler anında açılsın (eski davranış)
    if (!pairs && q && Array.isArray(q.keywords)) pairs = q.keywords.map(k => [getKw(k), k.en]).filter(p => p[0] && p[1]);
    const spans = _gLocate(text, pairs || [], srcIdx);
    const kws = (q && Array.isArray(q.keywords) ? q.keywords : []).map(k => _gNorm(srcIdx === 0 ? getKw(k) : k.en)).filter(Boolean);
    const plain = seg => {
        let out = '', last = 0;
        for (const m of seg.matchAll(_G_WORD_RX)) {
            out += _esc(seg.slice(last, m.index)) + '<span class="gw gw-miss">' + _esc(m[0]) + '</span>';
            last = m.index + m[0].length;
        }
        return out + _esc(seg.slice(last));
    };
    let html = '', i = 0;
    for (const sp of spans) {
        const piece = text.slice(sp.s, sp.e), pn = _gNorm(piece);
        const isKw = kws.some(k => pn === k || (' ' + pn + ' ').includes(' ' + k + ' '));
        html += plain(text.slice(i, sp.s)) + '<span class="gw' + (isKw ? ' gw-kw' : '') + '" data-h="' + _esc(sp.hint) + '">' + _esc(piece) + '</span>';
        i = sp.e;
    }
    return '<span class="gloss-line" data-gctx="' + _esc(ctxId) + '">' + html + plain(text.slice(i)) + '</span>';
}

// Bir cümleyi kapsayıcıya "dokunulabilir" olarak çiz ve bağlamını kaydet.
function mountGloss(el, ctxId, q, srcIdx, text, suffixHtml) {
    if (!el) return;
    hideWordPop();
    const ctx = { q, srcIdx, text: String(text || ''), suffix: suffixHtml || '' };
    ctx.render = () => { el.innerHTML = glossHtml(ctx.text, q, srcIdx, ctxId) + ctx.suffix; };
    _glossCtx[ctxId] = ctx;
    ctx.render();
}

function _wpEl() {
    let p = document.getElementById('wordPop');
    if (!p) { p = document.createElement('div'); p.id = 'wordPop'; p.setAttribute('role', 'tooltip'); document.body.appendChild(p); }
    return p;
}
function hideWordPop() {
    const p = document.getElementById('wordPop'); if (p) p.style.display = 'none';
    document.querySelectorAll('.gw.gw-on').forEach(x => x.classList.remove('gw-on'));
}
function showWordPop(anchor, html) {
    if (!anchor || !anchor.isConnected) return;
    hideWordPop();
    const p = _wpEl();
    p.innerHTML = html;
    p.style.display = 'block'; p.style.visibility = 'hidden'; p.style.left = '0px'; p.style.top = '0px';
    const r = anchor.getBoundingClientRect(), pw = p.offsetWidth, ph = p.offsetHeight, vw = document.documentElement.clientWidth;
    const left = Math.max(8, Math.min(r.left + r.width / 2 - pw / 2, vw - pw - 8));
    let top = r.top - ph - 10, below = false;
    if (top < 8) { top = r.bottom + 10; below = true; }
    p.style.left = left + 'px'; p.style.top = top + 'px';
    p.style.setProperty('--ax', Math.max(12, Math.min(pw - 12, r.left + r.width / 2 - left)) + 'px');
    p.classList.toggle('below', below);
    p.style.visibility = 'visible';
    anchor.classList.add('gw-on');
}
function _wpHtml(word, hint, ctx) {
    // Seslendirilecek taraf İngilizce olan: ana dil gösteriliyorsa anlam, İngilizce gösteriliyorsa kelimenin kendisi.
    const en = (ctx && ctx.srcIdx === 1 ? word : hint).replace(/\s*(?:\.\.\.|…)\s*/g, ' ');
    return '<span class="font-semibold">' + _esc(hint.replace(/\.\.\./g, '…')) + '</span>'
        + (TTS_OK ? '<button class="wp-say" onclick="event.stopPropagation();speak(this.dataset.s)" data-s="' + _esc(en) + '" aria-label="' + _esc(L('Sesli dinle', 'Escuchar')) + '">🔊</button>' : '');
}

// Cümlenin tamamı için kelime eşleşmesini AI'dan iste (cümle başına en fazla bir kez); sonucu sakla.
function ensureGloss(q) {
    if (!q) return Promise.resolve(false);
    const key = _gKey(q);
    if (_glossInflight[key]) return _glossInflight[key];
    if (_glossTried[key]) return Promise.resolve(false);
    _glossTried[key] = true;
    const p = (async () => {
        const native = getNative(q), en = q.english;
        if (!native || !en) return false;
        const NL = _gLang() === 'es' ? 'Spanish' : 'Turkish';
        const prompt = `Split this ${NL}–English translation pair into aligned chunks for a "tap a word to see its meaning" feature.\n`
            + `${NL}: "${native}"\nEnglish: "${en}"\n`
            + `Return ONLY JSON: {"gloss":[["${NL} chunk","English chunk"]]}\n`
            + `Rules:\n- ${NL} chunks: copied EXACTLY from the ${NL} sentence, in order, non-overlapping, together covering EVERY word (ignore punctuation). Usually 1–3 words each.\n`
            + `- English chunk: copy EXACTLY the part of the English sentence with the same meaning (attach small words like the/a/to/did). If no part fits, give a short English meaning.\n`
            + `- Keep idioms, phrasal verbs and fixed expressions together as one chunk.`;
        const txt = await geminiCall(prompt, { json: true, temperature: 0.1 });
        const j = txt ? extractJSON(txt) : null;
        const pairs = cleanGloss(j && (j.gloss || j.chunks));
        if (!pairs) return false;
        q.gloss = pairs;
        if (typeof q.id === 'string' && q.id.indexOf('ai_') === 0) {
            try { const all = getAISentences(); const it = all.find(x => x && x.id === q.id); if (it) { it.gloss = pairs; LS.set('custom_sentences', all); } } catch (e) {}
        } else _gCacheSet(q, pairs);
        return true;
    })().finally(() => { delete _glossInflight[key]; });
    _glossInflight[key] = p;
    return p;
}

async function _gResolveMissing(w, line, ctx) {
    const word = _gNorm(w.textContent);
    const ctxId = line.dataset.gctx;
    if (!canUseAI()) { showWordPop(w, '<span class="text-gray-300">' + _esc(L('Bu kelimenin anlamı için giriş yap (AI).', 'Inicia sesión para ver el significado (IA).')) + '</span>'); return; }
    showWordPop(w, '<span class="animate-pulse text-gray-400">' + _esc(L('Anlamı getiriliyor…', 'Buscando significado…')) + '</span>');
    const ok = await ensureGloss(ctx.q);
    if (_glossCtx[ctxId] !== ctx) return;   // bu arada soru değişti
    ctx.render();
    const nl = document.querySelector('.gloss-line[data-gctx="' + ctxId + '"]');
    const all = nl ? [...nl.querySelectorAll('.gw')] : [];
    const hit = all.find(x => x.dataset.h && (_gNorm(x.textContent) === word || (' ' + _gNorm(x.textContent) + ' ').includes(' ' + word + ' ')));
    if (hit) { showWordPop(hit, _wpHtml(hit.textContent, hit.dataset.h, ctx)); return; }
    if (!ok) delete _glossTried[_gKey(ctx.q)];   // ağ/kota hatası → sonra tekrar denenebilsin
    const again = all.find(x => _gNorm(x.textContent) === word);
    const msg = ok ? L('Bu kelime için anlam bulunamadı.', 'No se encontró el significado.')
        : (lastApiError === 'quota' ? L('Günlük AI hakkın doldu.', 'Límite diario de IA alcanzado.') : L('Anlam alınamadı — tekrar dokun.', 'No se pudo obtener — toca de nuevo.'));
    if (again) showWordPop(again, '<span class="text-gray-400">' + _esc(msg) + '</span>');
}

document.addEventListener('click', function (e) {
    const tgt = e.target;
    const w = tgt && tgt.closest ? tgt.closest('.gw') : null;
    if (!w) { if (!(tgt && tgt.closest && tgt.closest('#wordPop'))) hideWordPop(); return; }
    if (w.classList.contains('gw-on')) { hideWordPop(); return; }   // aynı kelimeye tekrar dokun → kapat
    const line = w.closest('.gloss-line');
    const ctx = line ? _glossCtx[line.dataset.gctx] : null;
    if (w.dataset.h) { showWordPop(w, _wpHtml(w.textContent, w.dataset.h, ctx)); return; }
    if (ctx) _gResolveMissing(w, line, ctx);
});
// Kelimeye dokunmak cevap kutusundaki odağı (ve telefon klavyesini) kapatmasın.
document.addEventListener('mousedown', function (e) { if (e.target && e.target.closest && e.target.closest('.gw, #wordPop')) e.preventDefault(); });
window.addEventListener('scroll', hideWordPop, { passive: true });
window.addEventListener('resize', hideWordPop);

/* ============================================================================
 * 2) DÜZENSİZ FİİLLER v2
 * - Yeni fiiller SIKLIK sırasıyla gelir (önce be/go/make…; overdraw/foresee gibi nadirler en sona).
 * - Yeni fiil önce öğretilir: 3 hâl + Türkçe anlamlar + İngilizce tanım + 2 örnek + aynı kalıptaki fiiller.
 * - Test kartında anlam ve tanım hep görünür; "Göster" ile cevap açılabilir.
 * - Yanlış/gösterilen fiil oturumun sonunda bir kez daha sorulur.
 * - Otomatik geçiş YOK: "Sonraki →" + kilit → çift Enter/çift dokunuş fiil atlatmaz ("çift geçme").
 * ========================================================================== */
const VERB_FAM_ORDER = ['AAA', 'ABB_other', 't_end', 'd_end', 'ought', 'ABA', 'i_a_u', 'ew_own', 'o_en', 'ore_orn', 'ABC_en', 'ABC_other'];
function vInfo(v) { return (typeof VERB_INFO !== 'undefined' && v && VERB_INFO[v.v1]) || null; }
function vLvl(v) { const i = vInfo(v); return (i && i.lvl) || 2; }
function vFam(v) { const i = vInfo(v); return (i && i.fam) || 'ABC_other'; }
function vFamInfo(f) { return (typeof VERB_FAMILIES !== 'undefined' && VERB_FAMILIES[f]) || null; }
function vIsNew(v) { const e = getVerbSRS(v.v1); return !e.seen && !e.streak && !e.wrong; }
function vIsLearned(v) { const e = getVerbSRS(v.v1); return !!(e.learned || e.streak >= 3); }
function _formsSay(v) { return [v.v1, v.v2, v.v3].map(f => String(f).split('/')[0].trim()).join(', '); }
function _hiForm(sentence, forms) {
    let h = _esc(sentence);
    String(forms).split('/').map(f => f.trim()).filter(Boolean).forEach(f => {
        h = h.replace(new RegExp('\\b(' + _rxEsc(f) + ')\\b', 'i'), '<strong class="text-yellow-300">$1</strong>');
    });
    return h;
}

function vFormsHtml(v) {
    const nv = [getVerbNative(v), getVerbNative(v, '2'), getVerbNative(v, '3')];
    const lab = ['V1', 'V2', 'V3'], forms = [v.v1, v.v2, v.v3];
    return '<div class="grid grid-cols-3 gap-2 text-center">' + forms.map((f, k) =>
        '<div class="rounded-xl py-2 px-1" style="background:#0f0f0f;border:1px solid #2a2a2a">'
        + '<p class="text-xs text-gray-500">' + lab[k] + '</p>'
        + '<p class="text-lg font-bold ' + (k === 0 ? 'text-white' : 'text-yellow-300') + '">' + _esc(f) + '</p>'
        + '<p class="text-xs text-gray-400">' + _esc(nv[k] || '') + '</p></div>').join('') + '</div>';
}
function vExamplesHtml(v) {
    const i = vInfo(v); if (!i) return '';
    const isTR = S.lang !== 'es';
    const row = (en, tr, form) => '<div class="mb-2"><p class="text-gray-100">' + _hiForm(en, form) + ' ' + speakBtn(en) + '</p>'
        + (isTR && tr ? '<p class="text-xs text-gray-500">' + _esc(tr) + '</p>' : '') + '</div>';
    return '<div class="mt-3 text-left"><p class="text-xs text-gray-500 mb-1">' + _esc(L('Örnekler', 'Ejemplos')) + '</p>'
        + row(i.ex, i.exTr, v.v2) + row(i.ex3, i.ex3Tr, v.v3) + '</div>';
}
function vFamHtml(v) {
    const fam = vFam(v), fi = vFamInfo(fam); if (!fi) return '';
    const sib = getCurVerbs().filter(x => x.v1 !== v.v1 && vFam(x) === fam).sort((a, b) => vLvl(a) - vLvl(b)).slice(0, 5);
    return '<div class="rounded-xl p-3 mt-3 text-sm text-left" style="background:#0c1929;border:1px solid #1e3a5f">'
        + '<p class="font-semibold text-blue-300 mb-1">🧩 ' + _esc(L(fi.tr, fi.es)) + '</p>'
        + '<p class="text-gray-300 text-xs mb-1">' + _esc(L(fi.tipTr, fi.tipEs)) + '</p>'
        + (sib.length ? '<p class="text-xs text-gray-400">' + _esc(L('Aynı kalıp: ', 'Mismo patrón: ')) + sib.map(x => '<span class="text-gray-200">' + _esc(x.v1 + ' → ' + x.v2 + ' → ' + x.v3) + '</span>').join(' · ') + '</p>' : '')
        + '</div>';
}
function _verbHeader() {
    const VV = getCurVerbs();
    const el = document.getElementById('verbProgress'); if (el) el.textContent = VV.filter(vIsLearned).length + '/' + VV.length;
    const sub = document.getElementById('verbSubtitle'); if (sub) sub.textContent = L('Yeni fiili önce öğren, sonra test et · yanlışlar aynı gün tekrar gelir', 'Primero aprende el verbo nuevo, luego practica · los errores vuelven el mismo día');
    const lb = document.getElementById('verbListBtn'); if (lb) lb.textContent = L('📋 Liste', '📋 Lista');
}

function showVerbs(moreNew) {
    showScreen('verbScreen'); _verbHeader();
    const VV = getCurVerbs(), td = today();
    const due = VV.filter(v => !vIsNew(v) && getVerbSRS(v.v1).nextReview <= td);
    shuffle(due);
    const fresh = VV.map((v, i) => ({ v, i })).filter(x => vIsNew(x.v)).sort((a, b) => vLvl(a.v) - vLvl(b.v) || a.i - b.i).map(x => x.v);
    let list;
    if (moreNew) list = fresh.slice(0, 5).map(v => ({ v, learn: true }));
    else {
        const d = due.slice(0, 10);
        list = d.map(v => ({ v, learn: false })).concat(fresh.slice(0, d.length >= 8 ? 2 : 5).map(v => ({ v, learn: true })));
    }
    S.verbList = list; S.verbIdx = 0; S.vReq = {};
    showVerbCard();
}
function _verbDoneHtml() {
    const fresh = getCurVerbs().filter(vIsNew).length;
    return '<div class="rounded-2xl p-6 text-center fade-in" style="background:#161616;border:1px solid #222"><p class="text-3xl mb-2">🎉</p>'
        + '<p class="text-gray-200 font-semibold mb-1">' + _esc(L('Bugünlük fiiller tamam!', '¡Verbos de hoy completados!')) + '</p>'
        + '<p class="text-xs text-gray-500 mb-4">' + _esc(L('Doğru bildiklerin birkaç gün sonra tekrar gelecek.', 'Los que acertaste volverán en unos días.')) + '</p>'
        + (fresh ? '<button onclick="showVerbs(true)" class="w-full py-2.5 rounded-xl font-semibold text-sm mb-2" style="background:#3B82F6;color:white">' + _esc(L('+5 yeni fiil öğren', '+5 verbos nuevos')) + '</button>' : '')
        + '<button onclick="showVerbList()" class="w-full py-2.5 rounded-xl text-sm" style="background:#1a1a1a;border:1px solid #2a2a2a;color:#e5e5e5">' + _esc(L('📋 Tüm fiiller (kalıplara göre)', '📋 Todos los verbos (por patrón)')) + '</button></div>';
}
function showVerbCard() {
    hideWordPop();
    const area = document.getElementById('verbDailyArea'); if (!area) return;
    S.verbAnswered = false; S.verbAnsweredAt = 0;
    if (!S.verbList || S.verbIdx >= S.verbList.length) { area.innerHTML = _verbDoneHtml(); return; }
    const it = S.verbList[S.verbIdx];
    if (it.learn) { area.innerHTML = verbLearnCard(it.v, 'session'); return; }
    area.innerHTML = verbQuizCard(it.v);
    setTimeout(() => { const i = document.getElementById('v2Input'); if (i) i.focus(); }, 50);
}
function verbLearnCard(v, mode) {
    const i = vInfo(v), fi = vFamInfo(vFam(v));
    const top = mode === 'session'
        ? '<span class="text-blue-400 text-sm font-medium">' + (S.verbIdx + 1) + ' / ' + S.verbList.length + '</span><span class="text-xs px-2 py-0.5 rounded-full" style="background:#1e2a3a;color:#60a5fa">✨ ' + _esc(L('Yeni fiil', 'Verbo nuevo')) + '</span>'
        : '<button onclick="showVerbList()" class="text-xs text-gray-400 hover:text-white">← ' + _esc(L('Liste', 'Lista')) + '</button><span class="text-xs text-gray-500">' + _esc(fi ? L(fi.tr, fi.es) : '') + '</span>';
    const btn = mode === 'session'
        ? '<button onclick="verbLearnDone()" id="verbLearnBtn" class="w-full py-3 rounded-xl font-semibold text-sm mt-4" style="background:#3B82F6;color:white">' + _esc(L('Öğrendim, test et →', 'Aprendido, ¡a practicar! →')) + '</button>'
        : `<button onclick="verbQuizSingle('${_esc(v.v1)}')" class="w-full py-3 rounded-xl font-semibold text-sm mt-4" style="background:#3B82F6;color:white">✏️ ${_esc(L('Kendini test et', 'Ponte a prueba'))}</button>`;
    return '<div class="verb-card rounded-2xl p-5 mb-4 fade-in" style="background:#161616;border:1px solid #222">'
        + '<div class="flex justify-between items-center mb-3">' + top + '</div>'
        + (TTS_OK ? '<p class="text-center mb-3"><button onclick="speak(this.dataset.s)" data-s="' + _esc(_formsSay(v)) + '" class="text-xs px-3 py-1 rounded-full" style="background:#0c1929;border:1px solid #1e3a5f;color:#60a5fa">🔊 ' + _esc(L('Üç hâlini dinle', 'Escucha las tres formas')) + '</button></p>' : '')
        + vFormsHtml(v)
        + (i ? '<p class="text-center text-sm italic text-gray-300 mt-3">“' + _esc(i.def) + '”</p>' : '')
        + vExamplesHtml(v) + vFamHtml(v) + btn + '</div>';
}
function verbLearnDone() {
    const it = S.verbList && S.verbList[S.verbIdx]; if (!it || !it.learn) return;
    const e = getVerbSRS(it.v.v1); e.seen = true; saveVerbSRS(e);
    it.learn = false;
    showVerbCard();
}
function verbQuizCard(v) {
    const i = vInfo(v), cur = S.verbList[S.verbIdx] || {};
    const inputCls = 'w-full rounded-xl px-3 py-3 text-sm font-medium';
    const inputSt = 'background:#0f0f0f;border:1px solid #2a2a2a;color:#f5f5f5';
    const inAttrs = 'autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"';
    return '<div class="verb-card rounded-2xl p-5 mb-4 fade-in" style="background:#161616;border:1px solid #222">'
        + '<div class="flex justify-between items-center mb-3"><span class="text-blue-400 text-sm font-medium">' + (S.verbIdx + 1) + ' / ' + S.verbList.length + '</span>'
        + (cur.again ? '<span class="text-xs px-2 py-0.5 rounded-full" style="background:#2a1a0a;color:#fbbf24">🔁 ' + _esc(L('Tekrar', 'Repaso')) + '</span>' : '') + '</div>'
        + '<p class="text-center text-3xl font-bold text-white">' + _esc(v.v1) + ' ' + speakBtn(v.v1) + '</p>'
        + '<p class="text-center text-base font-semibold mt-1" style="color:#fbbf24">' + _esc(getVerbNative(v)) + '</p>'
        + (i ? '<p class="text-center text-xs italic text-gray-500 mt-1">“' + _esc(i.def) + '”</p>' : '')
        + '<div class="grid grid-cols-2 gap-3 mt-4 mb-4">'
        + `<div><label class="block text-xs text-gray-500 mb-1">${_esc(L('V2 · geçmiş', 'V2 · pasado'))}</label><input type="text" id="v2Input" placeholder="${_esc(v.v1)}…" class="${inputCls}" style="${inputSt}" ${inAttrs} onkeydown="if(event.key==='Enter'){event.preventDefault();document.getElementById('v3Input').focus();}"></div>`
        + `<div><label class="block text-xs text-gray-500 mb-1">${_esc(L('V3 · perfect', 'V3 · participio'))}</label><input type="text" id="v3Input" placeholder="${_esc(v.v1)}…" class="${inputCls}" style="${inputSt}" ${inAttrs} onkeydown="if(event.key==='Enter'){event.preventDefault();checkVerb();}"></div>`
        + '</div>'
        + '<div id="verbFb" class="hidden rounded-xl p-3 mb-4 text-sm"></div>'
        + '<div id="verbBtns" class="flex gap-2">'
        + '<button onclick="checkVerb()" class="flex-1 py-2.5 rounded-xl font-semibold text-sm" style="background:#3B82F6;color:white">' + _esc(t('checkBtn')) + '</button>'
        + '<button onclick="checkVerb(true)" class="px-3 py-2.5 rounded-xl text-sm" style="background:#1a1a1a;border:1px solid #2a2a2a;color:#fbbf24">👀 ' + _esc(L('Göster', 'Ver')) + '</button>'
        + '<button onclick="skipVerb()" class="px-3 py-2.5 rounded-xl text-sm" style="background:#1a1a1a;border:1px solid #2a2a2a;color:#aaa">' + _esc(t('skip')) + '</button>'
        + '</div></div>';
}
function checkVerb(reveal) {
    if (S.verbAnswered) return;   // kilit: çift Enter / çift dokunuş ikinci kez puanlamasın
    const it = S.verbList && S.verbList[S.verbIdx]; if (!it || it.learn) return;
    const v = it.v;
    const i2 = document.getElementById('v2Input'), i3 = document.getElementById('v3Input');
    const a2 = ((i2 && i2.value) || '').trim().toLowerCase(), a3 = ((i3 && i3.value) || '').trim().toLowerCase();
    if (!reveal && (!a2 || !a3)) { const empty = !a2 ? i2 : i3; if (empty) empty.focus(); return; }
    S.verbAnswered = true; S.verbAnsweredAt = Date.now();
    bumpDaily();
    const match = (inp, c) => String(c).toLowerCase().split('/').map(x => x.trim()).includes(inp);
    const ok2 = !reveal && match(a2, v.v2), ok3 = !reveal && match(a3, v.v3), allOk = ok2 && ok3;
    const e = getVerbSRS(v.v1); e.seen = true;
    let requeued = false;
    if (allOk) { e.streak = (e.streak || 0) + 1; e.nextReview = _addDays(Math.min(e.streak * 2, 14)); if (e.streak >= 3) e.learned = true; updateStreak(); }
    else {
        e.streak = 0; e.wrong = (e.wrong || 0) + 1; e.nextReview = _addDays(1); e.learned = false;
        if (!S.vReq) S.vReq = {};
        if (!S.vReq[v.v1]) { S.vReq[v.v1] = 1; S.verbList.push({ v, learn: false, again: true }); requeued = true; }
    }
    saveVerbSRS(e);
    [i2, i3].forEach(x => { if (x) x.disabled = true; });
    if (i2) i2.style.borderColor = ok2 ? '#16a34a' : '#dc2626';
    if (i3) i3.style.borderColor = ok3 ? '#16a34a' : '#dc2626';
    const fb = document.getElementById('verbFb'); fb.classList.remove('hidden');
    fb.style.background = allOk ? '#0f2a1a' : '#2a0f0f'; fb.style.border = '1px solid ' + (allOk ? '#16a34a' : '#dc2626'); fb.style.color = allOk ? '#4ade80' : '#f87171';
    const col = ok => ok ? '#4ade80' : '#fbbf24';
    fb.innerHTML = (allOk ? '✅ ' : (reveal ? '👀 ' : '❌ '))
        + '<strong>' + _esc(v.v1) + ' → <span style="color:' + col(ok2) + '">' + _esc(v.v2) + '</span> → <span style="color:' + col(ok3) + '">' + _esc(v.v3) + '</span></strong>'
        + (requeued ? '<p class="text-xs text-gray-400 mt-1">' + _esc(L('Bu fiil oturumun sonunda bir kez daha sorulacak.', 'Este verbo se repetirá al final de la sesión.')) + '</p>' : '')
        + vExamplesHtml(v) + vFamHtml(v);
    document.getElementById('verbBtns').innerHTML = '<button onclick="nextVerb()" id="verbNextBtn" class="flex-1 py-2.5 rounded-xl font-semibold text-sm" style="background:#3B82F6;color:white">' + _esc(t('next')) + ' →</button>';
    setTimeout(() => { const b = document.getElementById('verbNextBtn'); if (b) b.focus(); }, 60);
}
function nextVerb() {
    if (!S.verbAnswered) return;
    if (Date.now() - (S.verbAnsweredAt || 0) < 600) return;   // aynı Enter'ın tekrarı geri bildirimi atlatmasın
    S.verbIdx++; showVerbCard();
}
function skipVerb() {
    if (S.verbAnswered) return;
    const now = Date.now(); if (now - (S._vSkipAt || 0) < 500) return; S._vSkipAt = now;
    S.verbIdx++; showVerbCard();
}
function showVerbList(q) {
    showScreen('verbScreen'); _verbHeader();
    const area = document.getElementById('verbDailyArea'); if (!area) return;
    area.innerHTML = '<div class="flex items-center gap-2 mb-3">'
        + '<button onclick="showVerbs()" class="text-xs px-3 py-2 rounded-lg flex-shrink-0" style="background:#1a1a1a;border:1px solid #2a2a2a;color:#e5e5e5">← ' + _esc(L('Günlük pratik', 'Práctica diaria')) + '</button>'
        + '<input id="verbSearch" type="search" placeholder="' + _esc(L('Ara: go, gitmek…', 'Buscar: go, ir…')) + '" class="flex-1 min-w-0 rounded-lg px-3 py-2 text-sm" style="background:#161616;border:1px solid #2a2a2a;color:#f5f5f5" oninput="_renderVerbList(this.value)" autocomplete="off"></div>'
        + '<p class="text-xs text-gray-500 mb-2">' + _esc(L('Aynı kalıptakileri birlikte ezberle — dokun → öğren.', 'Memoriza juntos los del mismo patrón — toca → aprende.')) + '</p>'
        + '<div id="verbListBody"></div>';
    _renderVerbList(q || '');
}
function _renderVerbList(q) {
    const body = document.getElementById('verbListBody'); if (!body) return;
    const n = _gNorm(String(q || '').trim());
    const VV = getCurVerbs().filter(v => !n || [v.v1, v.v2, v.v3, getVerbNative(v)].some(x => _gNorm(x).includes(n)));
    let html = '';
    VERB_FAM_ORDER.forEach(f => {
        const list = VV.filter(v => vFam(v) === f).sort((a, b) => vLvl(a) - vLvl(b) || a.v1.localeCompare(b.v1));
        if (!list.length) return;
        const fi = vFamInfo(f);
        html += '<div class="mb-4"><p class="text-sm font-bold text-blue-300 mt-2">🧩 ' + _esc(fi ? L(fi.tr, fi.es) : f) + ' <span class="text-xs text-gray-500 font-normal">(' + list.length + ')</span></p>'
            + (fi ? '<p class="text-xs text-gray-500 mb-2">' + _esc(L(fi.tipTr, fi.tipEs)) + '</p>' : '')
            + list.map(v => {
                const st = vIsLearned(v) ? '<span style="color:#22c55e">✓</span>' : (vIsNew(v) ? '<span style="color:#4b5563">○</span>' : '<span style="color:#fbbf24">•</span>');
                return `<div onclick="openVerbCard('${_esc(v.v1)}')" class="flex items-center justify-between gap-2 rounded-xl px-3 py-2 mb-1" style="background:#161616;border:1px solid #222;cursor:pointer">`
                    + '<span class="text-sm"><span class="mr-2">' + st + '</span><span class="text-gray-100 font-medium">' + _esc(v.v1) + '</span> <span class="text-gray-500">–</span> <span class="text-yellow-300">' + _esc(v.v2) + '</span> <span class="text-gray-500">–</span> <span class="text-yellow-300">' + _esc(v.v3) + '</span></span>'
                    + '<span class="text-xs text-gray-400 text-right">' + _esc(getVerbNative(v)) + '</span></div>';
            }).join('') + '</div>';
    });
    body.innerHTML = html || '<p class="text-center text-gray-500 py-8 text-sm">' + _esc(L('Sonuç yok.', 'Sin resultados.')) + '</p>';
}
function openVerbCard(v1) {
    const v = getCurVerbs().find(x => x.v1 === v1); if (!v) return;
    document.getElementById('verbDailyArea').innerHTML = verbLearnCard(v, 'list');
    window.scrollTo(0, 0);
}
function verbQuizSingle(v1) {
    const v = getCurVerbs().find(x => x.v1 === v1); if (!v) return;
    S.verbList = [{ v, learn: false }]; S.verbIdx = 0; S.vReq = {};
    showVerbCard();
}

/* ============================================================================
 * 3) PHRASAL VERBS
 * Edat (particle) mantığıyla gruplar → öğrenme kartı (anlam + tanım + örnek + grup ipucu) → çoktan seçmeli test:
 *   "mean": phrasal verb → anlamı · "rev": anlam → phrasal verb · "part": örnek cümlede eksik edat.
 * Çeldiriciler bilerek AYNI FİİLİN diğer edatlarıyla seçilir (give up / give in / give out…) — asıl karışıklık orada.
 * Aralıklı tekrar: 1 → 3 → 7 → 14 → 30 gün; yanlış kart aynı oturumun sonunda bir kez daha gelir.
 * ========================================================================== */
const PV_STEPS = [1, 3, 7, 14, 30];
const PV_PARTS = ['up', 'down', 'out', 'off', 'on', 'in', 'over', 'back', 'away', 'around', 'through', 'after', 'across', 'along', 'forward', 'into', 'about', 'for', 'with'];
function pvItems() { return (typeof PHRASAL_VERBS !== 'undefined' && Array.isArray(PHRASAL_VERBS)) ? PHRASAL_VERBS : []; }
function pvGroups() { return (typeof PV_GROUPS !== 'undefined' && Array.isArray(PV_GROUPS)) ? PV_GROUPS : []; }
function pvGroup(p) { return pvGroups().find(g => g.p === p) || null; }
function _pvAll() { return LS.get('pv_srs', {}) || {}; }
function getPv(id) { return _pvAll()[id] || { id, streak: 0, wrong: 0, seen: false, next: today() }; }
function savePv(e) { const d = _pvAll(); d[e.id] = e; LS.set('pv_srs', d); }
function pvIsLearned(it) { return getPv(it.id).streak >= 3; }
function pvProgress() { const a = pvItems(); return a.length ? a.filter(pvIsLearned).length / a.length : 0; }
function pvMeaning(it) { return S.lang === 'es' ? (it.es || it.def) : it.tr; }
function _pvBase(it) { return String(it.pv).split(/\s+/)[0].toLowerCase(); }
function _pvDue(items) { const td = today(); return items.filter(it => { const e = getPv(it.id); return e.seen && e.next <= td; }); }
function _pvNew(items) { return items.map((it, i) => ({ it, i })).filter(x => !getPv(x.it.id).seen).sort((a, b) => (a.it.lvl || 2) - (b.it.lvl || 2) || a.i - b.i).map(x => x.it); }
function pvTodayBlock() {
    const a = pvItems(); if (!a.length) return null;
    const d = _pvDue(a).length, n = Math.min(d >= 8 ? 2 : 5, _pvNew(a).length);
    if (!d && !n) return L('Bugünlük tamam 👍', '¡Listo por hoy! 👍');
    return L((d ? d + ' tekrar · ' : '') + n + ' yeni kart', (d ? d + ' repasos · ' : '') + n + ' tarjetas nuevas');
}
function _pvHi(sentence, it) {   // örnekte phrasal verb'ü vurgula: edat(lar) + fiilin yalın/-s/-ing/-ed hâli
    let h = _esc(sentence);
    const w = String(it.pv).split(/\s+/), base = w[0];
    const forms = [base, base + 's', base + 'es', base + 'ing', base + 'ed', base.replace(/e$/, '') + 'ing'];
    h = h.replace(new RegExp('\\b(' + forms.map(_rxEsc).join('|') + ')\\b', 'i'), '<strong class="text-yellow-300">$1</strong>');
    w.slice(1).forEach(x => { h = h.replace(new RegExp('\\b(' + _rxEsc(x) + ')\\b(?![^<]*</strong>)', 'i'), '<strong class="text-yellow-300">$1</strong>'); });
    return h;
}
function _pvBtn(label, onclick, primary) {
    return '<button onclick="' + onclick + '" class="w-full py-3 rounded-xl font-semibold text-sm mt-2" style="' + (primary ? 'background:#3B82F6;color:white' : 'background:#1a1a1a;border:1px solid #2a2a2a;color:#e5e5e5') + '">' + label + '</button>';
}

function showPV() { showScreen('pvScreen'); renderPVHome(); }
function renderPVHome() {
    showScreen('pvScreen');
    const el = document.getElementById('pvArea'); if (!el) return;
    const items = pvItems();
    if (!items.length) { el.innerHTML = '<p class="text-center text-gray-500 py-12">' + _esc(L('Phrasal verb verisi yüklenemedi.', 'No se pudieron cargar los datos.')) + '</p>'; return; }
    const learned = items.filter(pvIsLearned).length, due = _pvDue(items).length, nNew = Math.min(due >= 8 ? 2 : 5, _pvNew(items).length);
    let h = '<div class="rounded-2xl p-5 mb-4" style="background:#161616;border:1px solid #222">'
        + '<div class="flex justify-between items-center mb-1"><h2 class="text-lg font-bold text-gray-100">🧩 Phrasal Verbs</h2><span class="text-xs px-2 py-1 rounded-full" style="background:#1a1a1a;color:#aaa">' + learned + '/' + items.length + '</span></div>'
        + '<p class="text-xs text-gray-400 mb-4">' + _esc(L('Phrasal verb = fiil + küçük bir kelime (up, out, off…). O küçük kelimenin mantığını öğrenince ezberlemek kolaylaşır — aynı mantıktakileri grup grup çalış.', 'Phrasal verb = verbo + partícula (up, out, off…). Si entiendes la lógica de la partícula, es más fácil recordarlos — estudia por grupos.')) + '</p>'
        + '<button onclick="startPVSession()" class="w-full py-3 rounded-xl font-semibold text-sm" style="background:#3B82F6;color:white">▶ ' + _esc(L('Günlük pratik', 'Práctica diaria'))
        + '<span class="block text-xs font-normal opacity-80">' + _esc(L(due + ' tekrar · ' + nNew + ' yeni', due + ' repasos · ' + nNew + ' nuevos')) + '</span></button></div>';
    h += '<p class="text-xs text-gray-500 mb-2 px-1">' + _esc(L('Gruplar — dokun, mantığını öğren', 'Grupos — toca y aprende la lógica')) + '</p><div class="grid grid-cols-2 gap-2">';
    pvGroups().forEach(g => {
        const its = items.filter(it => it.p === g.p); if (!its.length) return;
        const ln = its.filter(pvIsLearned).length, pct = Math.round(ln / its.length * 100);
        h += `<div onclick="showPVGroup('${_esc(g.p)}')" class="rounded-2xl p-3 transition hover:opacity-90" style="background:#161616;border:1px solid #2a2a2a;cursor:pointer">`
            + '<p class="font-bold text-blue-300">' + _esc(g.title) + '</p>'
            + '<p class="text-xs text-gray-400 mb-2" style="min-height:2.4em">' + _esc(S.lang === 'es' ? g.es : g.tr) + '</p>'
            + '<div class="rounded-full h-1.5" style="background:#0f0f0f"><div class="h-1.5 rounded-full" style="background:#3B82F6;width:' + pct + '%"></div></div>'
            + '<p class="text-xs text-gray-500 mt-1">' + ln + '/' + its.length + '</p></div>';
    });
    el.innerHTML = h + '</div>';
}
function showPVGroup(p) {
    showScreen('pvScreen');
    const el = document.getElementById('pvArea'), g = pvGroup(p); if (!el) return; if (!g) { renderPVHome(); return; }
    const its = pvItems().filter(it => it.p === p).map((it, i) => ({ it, i })).sort((a, b) => (a.it.lvl || 2) - (b.it.lvl || 2) || a.i - b.i).map(x => x.it);
    const fresh = its.filter(it => !getPv(it.id).seen).length, seen = its.length - fresh;
    let h = '<button onclick="renderPVHome()" class="mb-3 text-xs text-gray-500 hover:text-white">← Phrasal Verbs</button>'
        + '<div class="rounded-2xl p-5 mb-4" style="background:#161616;border:1px solid #222">'
        + '<h2 class="text-2xl font-bold text-blue-300">' + _esc(g.title) + '</h2>'
        + '<p class="text-sm text-gray-300 mb-2">' + _esc(S.lang === 'es' ? g.es : g.tr) + '</p>'
        + (S.lang !== 'es' && g.tip ? '<p class="text-sm rounded-xl p-3 mb-3" style="background:#0c1929;border:1px solid #1e3a5f;color:#bfdbfe">💡 ' + _esc(g.tip) + '</p>' : '')
        + '<div class="flex gap-2">'
        + (fresh ? `<button onclick="startPVSession('${_esc(p)}', 'learn')" class="flex-1 py-2.5 rounded-xl font-semibold text-sm" style="background:#3B82F6;color:white">📖 ${_esc(L('Yeni kartları öğren', 'Aprende las nuevas'))}</button>` : '')
        + (seen ? `<button onclick="startPVSession('${_esc(p)}', 'quiz')" class="flex-1 py-2.5 rounded-xl font-semibold text-sm" style="background:#1a1a1a;border:1px solid #3B82F6;color:#60a5fa">✏️ ${_esc(L('Grubu test et', 'Practica el grupo'))}</button>` : '')
        + '</div></div>';
    h += its.map(it => {
        const e = getPv(it.id);
        const st = e.streak >= 3 ? '<span style="color:#22c55e">✓</span>' : (e.seen ? '<span style="color:#fbbf24">•</span>' : '<span style="color:#4b5563">○</span>');
        return `<div onclick="pvOpenCard('${_esc(it.id)}')" class="flex items-center justify-between gap-2 rounded-xl px-3 py-2 mb-1" style="background:#161616;border:1px solid #222;cursor:pointer">`
            + '<span class="text-sm"><span class="mr-2">' + st + '</span><span class="text-gray-100 font-medium">' + _esc(it.pv) + '</span></span>'
            + '<span class="text-xs text-gray-400 text-right">' + _esc(pvMeaning(it)) + '</span></div>';
    }).join('');
    el.innerHTML = h;
    window.scrollTo(0, 0);
}
function pvCardHtml(it, mode) {   // mode: 'session' (oturum içi yeni kart) | 'single' (listeden açılan kart)
    const g = pvGroup(it.p), P = S.pv;
    const top = mode === 'session'
        ? '<span class="text-blue-400 text-sm font-medium">' + (P.idx + 1) + ' / ' + P.list.length + '</span>'
        : `<button onclick="showPVGroup('${_esc(it.p)}')" class="text-xs text-gray-400 hover:text-white">← ${_esc(g ? g.title : '')}</button>`;
    const w = String(it.pv).split(/\s+/);
    const sepEx = it.sep ? w[0] + ' it ' + w.slice(1).join(' ') : '';
    return '<div class="rounded-2xl p-5 mb-4 fade-in" style="background:#161616;border:1px solid #222">'
        + '<div class="flex justify-between items-center mb-3">' + top + '<span class="text-xs px-2 py-0.5 rounded-full" style="background:#1e2a3a;color:#60a5fa">' + (mode === 'session' ? '✨ ' + _esc(L('Yeni', 'Nuevo')) + ' · ' : '') + _esc(g ? g.title : it.p) + '</span></div>'
        + '<p class="text-center text-3xl font-bold text-white">' + _esc(it.pv) + ' ' + speakBtn(it.pv) + '</p>'
        + '<p class="text-center text-lg font-semibold mt-1" style="color:#fbbf24">' + _esc(pvMeaning(it)) + '</p>'
        + '<p class="text-center text-sm italic text-gray-400 mt-1">“' + _esc(it.def) + '”</p>'
        + '<div class="rounded-xl p-3 mt-4" style="background:#0f0f0f;border:1px solid #2a2a2a"><p class="text-gray-100">' + _pvHi(it.ex, it) + ' ' + speakBtn(it.ex) + '</p>'
        + (S.lang !== 'es' && it.exTr ? '<p class="text-xs text-gray-500 mt-1">' + _esc(it.exTr) + '</p>' : '') + '</div>'
        + (it.sep ? '<p class="text-xs text-gray-400 mt-2">↔️ ' + _esc(L('Ayrılabilir — nesne araya girebilir: ', 'Separable — el objeto puede ir en medio: ')) + '<span class="text-gray-200">' + _esc(sepEx) + '</span></p>' : '')
        + (g && g.tip && S.lang !== 'es' ? '<p class="text-xs rounded-xl p-3 mt-3" style="background:#0c1929;border:1px solid #1e3a5f;color:#bfdbfe">💡 ' + _esc(g.tip) + '</p>' : '')
        + (mode === 'session'
            ? '<button onclick="pvLearnDone()" id="pvMainBtn" class="w-full py-3 rounded-xl font-semibold text-sm mt-4" style="background:#3B82F6;color:white">' + _esc(L('Anladım, test et →', 'Entendido, ¡a practicar! →')) + '</button>'
            : `<button onclick="startPVSingle('${_esc(it.id)}')" class="w-full py-3 rounded-xl font-semibold text-sm mt-4" style="background:#3B82F6;color:white">✏️ ${_esc(L('Kendini test et', 'Ponte a prueba'))}</button>`)
        + '</div>';
}
function pvOpenCard(id) {
    const it = pvItems().find(x => x.id === id); if (!it) return;
    showScreen('pvScreen');
    document.getElementById('pvArea').innerHTML = pvCardHtml(it, 'single');
    window.scrollTo(0, 0);
}
function startPVSingle(id) {
    const it = pvItems().find(x => x.id === id); if (!it) return;
    S.pv = { list: [{ it, learn: false, firstTest: !getPv(id).seen }], idx: 0, p: it.p, req: {}, ok: 0, nok: 0, answered: false };
    showScreen('pvScreen'); pvRender();
}
function startPVSession(p, mode) {
    const items = pvItems().filter(it => !p || it.p === p);
    let list = [];
    if (mode === 'learn') list = _pvNew(items).slice(0, 6).map(it => ({ it, learn: true }));
    else if (mode === 'quiz') list = _shuf(items.filter(it => getPv(it.id).seen)).slice(0, 10).map(it => ({ it, learn: false }));
    else {
        const d = _shuf(_pvDue(items)).slice(0, 10);
        list = d.map(it => ({ it, learn: false })).concat(_pvNew(items).slice(0, d.length >= 8 ? 2 : 5).map(it => ({ it, learn: true })));
    }
    S.pv = { list, idx: 0, p: p || null, req: {}, ok: 0, nok: 0, answered: false };
    showScreen('pvScreen');
    if (!list.length) {
        document.getElementById('pvArea').innerHTML = '<div class="rounded-2xl p-6 text-center fade-in" style="background:#161616;border:1px solid #222"><p class="text-3xl mb-2">👍</p>'
            + '<p class="text-gray-200 mb-4">' + _esc(L('Şu an çalışılacak kart yok — başka bir grup seç.', 'No hay tarjetas ahora — elige otro grupo.')) + '</p>'
            + _pvBtn('← Phrasal Verbs', 'renderPVHome()', true) + '</div>';
        return;
    }
    pvRender();
}
function pvRender() {
    hideWordPop();
    const P = S.pv, el = document.getElementById('pvArea'); if (!P || !el) return;
    P.answered = false; P.opts = null;
    if (P.idx >= P.list.length) {
        const more = _pvNew(pvItems().filter(it => !P.p || it.p === P.p)).length;
        el.innerHTML = '<div class="rounded-2xl p-6 text-center fade-in" style="background:#161616;border:1px solid #222"><p class="text-3xl mb-2">🎉</p>'
            + '<p class="text-gray-200 font-semibold mb-1">' + _esc(L('Oturum bitti!', '¡Sesión terminada!')) + '</p>'
            + '<p class="text-sm text-gray-400 mb-4">✅ ' + P.ok + ' &nbsp; ❌ ' + P.nok + '</p>'
            + (more ? _pvBtn(_esc(L('+ Yeni kartlar öğren', '+ Aprender tarjetas nuevas')), "startPVSession(" + (P.p ? "'" + _esc(P.p) + "'" : 'null') + ", 'learn')", true) : '')
            + _pvBtn('← Phrasal Verbs', 'renderPVHome()', !more) + '</div>';
        return;
    }
    const cur = P.list[P.idx];
    if (cur.learn) { el.innerHTML = pvCardHtml(cur.it, 'session'); window.scrollTo(0, 0); return; }
    pvQuiz(cur);
}
function pvLearnDone() {
    const P = S.pv, cur = P && P.list[P.idx]; if (!cur || !cur.learn) return;
    const e = getPv(cur.it.id); if (!e.seen) { e.seen = true; e.next = today(); savePv(e); }
    cur.learn = false; cur.firstTest = true;
    pvRender();
}
function _pvBlank(it) {
    if (!it.part) return null;
    const rx = new RegExp('\\b' + _rxEsc(it.part) + '\\b', 'i');
    if (!rx.test(it.ex)) return null;
    return _esc(it.ex.replace(rx, '\u0000')).replace('\u0000', '<span class="px-2 rounded" style="background:#1e2a3a;color:#60a5fa">____</span>');
}
function _pvPick(pool, n, exclude) {
    const out = [], seen = new Set(exclude.map(x => String(x).toLowerCase()));
    for (const x of pool) { if (out.length >= n) break; const k = String(x).toLowerCase(); if (x && !seen.has(k)) { seen.add(k); out.push(x); } }
    return out;
}
// Anlamları kesişen iki phrasal verb (ortak bir Türkçe karşılık) aynı soruda şık olmasın → iki doğru cevap olurdu.
// Aynı fiille iki edatın da doğru olduğu boşluklar (veri yazarının notu): yanlış şık olarak sunulmaz.
const PV_PART_ALT = { throw: [['away', 'out']], get: [['along', 'on']], go: [['over', 'through']], think: [['over', 'through']], cut: [['down', 'back']], mess: [['around', 'about']] };
function _pvPartAlts(base, part) {
    const out = [];
    (PV_PART_ALT[base] || []).forEach(([a, b]) => { if (a === part) out.push(b); else if (b === part) out.push(a); });
    return out;
}
function _pvSenses(it) { return String(pvMeaning(it) || '').toLocaleLowerCase('tr').replace(/\([^)]*\)/g, '').split(/[,;\/]/).map(x => x.trim()).filter(Boolean); }
function _pvClash(a, b) { const sb = _pvSenses(b); return _pvSenses(a).some(x => sb.includes(x)); }
function pvQuiz(cur) {
    const P = S.pv, it = cur.it, items = pvItems(), base = _pvBase(it), mean = pvMeaning(it);
    const blank = _pvBlank(it);
    const types = ['mean', 'rev'].concat(blank ? ['part', 'part'] : []);
    const type = cur.firstTest ? (Math.random() < 0.5 ? 'mean' : 'rev') : types[Math.floor(Math.random() * types.length)];
    // Aynı phrasal verb'ün diğer anlamı (take off: uçak / kıyafet) ve anlamı kesişenler çeldirici olamaz.
    const others = items.filter(x => x.id !== it.id && x.pv !== it.pv && !_pvClash(x, it));
    let q = '', opts = [], correct = '', twoCol = false;
    if (type === 'part') {
        correct = String(it.part).toLowerCase();
        const sameVerb = others.filter(x => _pvBase(x) === base && x.part).map(x => String(x.part).toLowerCase());
        const alsoRight = _pvPartAlts(base, correct);   // boşluğa o da doğru girer (throw away/out…) → yanlış şık olamaz
        opts = [correct].concat(_pvPick(_shuf(sameVerb).concat(_shuf(PV_PARTS)), 3, [correct].concat(alsoRight)));
        twoCol = true;
        q = '<p class="text-xs text-gray-500 mb-2">' + _esc(L('Boşluğa hangi kelime gelir?', '¿Qué palabra falta?')) + '</p>'
            + '<p class="text-lg text-gray-100 leading-relaxed">' + blank + '</p>'
            + '<p class="text-sm mt-2" style="color:#fbbf24">(' + _esc(mean) + ')</p>';
    } else if (type === 'mean') {
        correct = mean;
        const pool = _shuf(others.filter(x => _pvBase(x) === base)).concat(_shuf(others.filter(x => x.p === it.p)), _shuf(others)).map(pvMeaning);
        opts = [correct].concat(_pvPick(pool, 3, [correct]));
        q = '<p class="text-xs text-gray-500 mb-2">' + _esc(L('Anlamı ne?', '¿Qué significa?')) + '</p>'
            + '<p class="text-3xl font-bold text-white text-center">' + _esc(it.pv) + ' ' + speakBtn(it.pv) + '</p>';
    } else {
        correct = it.pv;
        const ok = x => pvMeaning(x) !== mean;   // aynı anlama gelen başka phrasal verb çeldirici olmasın
        const pool = _shuf(others.filter(x => _pvBase(x) === base && ok(x))).concat(_shuf(others.filter(x => x.p === it.p && ok(x))), _shuf(others.filter(ok))).map(x => x.pv);
        opts = [correct].concat(_pvPick(pool, 3, [correct]));
        q = '<p class="text-xs text-gray-500 mb-2">' + _esc(L('Hangisi bu anlama gelir?', '¿Cuál significa esto?')) + '</p>'
            + '<p class="text-xl font-semibold text-center" style="color:#fbbf24">' + _esc(mean) + '</p>';
    }
    shuffle(opts);
    P.opts = opts; P.correct = opts.indexOf(correct); P.type = type;
    document.getElementById('pvArea').innerHTML = '<div class="rounded-2xl p-5 mb-4 fade-in" style="background:#161616;border:1px solid #222">'
        + '<div class="flex justify-between items-center mb-3"><span class="text-blue-400 text-sm font-medium">' + (P.idx + 1) + ' / ' + P.list.length + '</span>'
        + (cur.again ? '<span class="text-xs px-2 py-0.5 rounded-full" style="background:#2a1a0a;color:#fbbf24">🔁 ' + _esc(L('Tekrar', 'Repaso')) + '</span>' : '') + '</div>'
        + q
        + '<div class="grid ' + (twoCol ? 'grid-cols-2' : 'grid-cols-1') + ' gap-2 mt-4">'
        + opts.map((o, k) => '<button onclick="pvAnswer(' + k + ')" id="pvOpt' + k + '" class="opt-btn text-left px-4 py-3 rounded-xl text-sm font-medium" style="background:#1a1a1a;border:1px solid #2a2a2a;color:#e5e5e5"><span class="text-gray-500 mr-2">' + (k + 1) + '</span>' + _esc(o) + '</button>').join('')
        + '</div>'
        + '<div id="pvFb" class="hidden rounded-xl p-3 mt-3 text-sm"></div>'
        + '<div id="pvNextWrap" class="hidden mt-3"><button onclick="pvNext()" id="pvNextBtn" class="w-full py-3 rounded-xl font-semibold text-sm" style="background:#3B82F6;color:white">' + _esc(t('next')) + ' →</button></div>'
        + '</div>';
}
function pvAnswer(k) {
    const P = S.pv; if (!P || P.answered || !P.opts) return;
    const cur = P.list[P.idx]; if (!cur || cur.learn) return;
    P.answered = true; P.answeredAt = Date.now();
    const it = cur.it, ok = k === P.correct;
    P.opts.forEach((_, i) => {
        const b = document.getElementById('pvOpt' + i); if (!b) return;
        b.disabled = true;
        if (i === P.correct) { b.style.background = '#0f2a1a'; b.style.borderColor = '#16a34a'; b.style.color = '#4ade80'; }
        else if (i === k) { b.style.background = '#2a0f0f'; b.style.borderColor = '#dc2626'; b.style.color = '#f87171'; }
        else b.style.opacity = '.55';
    });
    const e = getPv(it.id); e.seen = true;
    let requeued = false;
    if (ok) { P.ok++; e.streak = (e.streak || 0) + 1; e.next = _addDays(PV_STEPS[Math.min(e.streak - 1, PV_STEPS.length - 1)]); updateStreak(); }
    else {
        P.nok++; e.streak = 0; e.wrong = (e.wrong || 0) + 1; e.next = today();
        if (!P.req[it.id]) { P.req[it.id] = 1; P.list.push({ it, learn: false, again: true }); requeued = true; }
    }
    savePv(e); bumpDaily();
    const fb = document.getElementById('pvFb'); fb.classList.remove('hidden');
    fb.style.background = ok ? '#0f2a1a' : '#2a0f0f'; fb.style.border = '1px solid ' + (ok ? '#16a34a' : '#dc2626');
    fb.innerHTML = '<p class="font-semibold" style="color:' + (ok ? '#4ade80' : '#f87171') + '">' + (ok ? '✅ ' + _esc(L('Doğru!', '¡Correcto!')) : '❌ ' + _esc(L('Doğrusu:', 'Correcto:')))
        + ' <span class="text-white">' + _esc(it.pv) + '</span> = <span style="color:#fbbf24">' + _esc(pvMeaning(it)) + '</span></p>'
        + '<p class="text-gray-200 mt-2">' + _pvHi(it.ex, it) + ' ' + speakBtn(it.ex) + '</p>'
        + (S.lang !== 'es' && it.exTr ? '<p class="text-xs text-gray-500">' + _esc(it.exTr) + '</p>' : '')
        + (requeued ? '<p class="text-xs text-gray-400 mt-2">' + _esc(L('Bu kart oturumun sonunda tekrar gelecek.', 'Esta tarjeta volverá al final.')) + '</p>' : '');
    document.getElementById('pvNextWrap').classList.remove('hidden');
    setTimeout(() => { const b = document.getElementById('pvNextBtn'); if (b) b.focus(); }, 60);
}
function pvNext() {
    const P = S.pv; if (!P || !P.answered) return;
    if (Date.now() - (P.answeredAt || 0) < 500) return;   // çift dokunuş geri bildirimi atlatmasın
    P.idx++; pvRender();
}
// Masaüstü kısayolu: 1–4 ile şık seç (yazı alanında değilken).
document.addEventListener('keydown', function (e) {
    const scr = document.getElementById('pvScreen');
    if (!scr || scr.classList.contains('hidden')) return;
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const P = S.pv;
    if (P && P.opts && !P.answered && /^[1-4]$/.test(e.key) && +e.key <= P.opts.length) { e.preventDefault(); pvAnswer(+e.key - 1); }
});

/* ============================================================================
 * Başlangıç
 * ========================================================================== */
(function initLearn() {
    try { const sel = document.getElementById('aiLevelSelect'); if (sel && typeof getAILevel === 'function') sel.value = getAILevel(); } catch (e) {}
    // index.html ilk ekranı learn.js yüklenmeden çizmiş olabilir → yeni blokların (phrasal verbs) görünmesi için yenile.
    try { if (S.tab === 'today' && typeof renderToday === 'function' && !document.getElementById('todayScreen').classList.contains('hidden')) renderToday(); } catch (e) {}
    try { if (S.tab === 'roadmap' && typeof renderRoadmap === 'function' && !document.getElementById('roadmapScreen').classList.contains('hidden')) renderRoadmap(); } catch (e) {}
})();
