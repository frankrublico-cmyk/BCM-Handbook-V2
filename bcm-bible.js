/* ============================================================
   BCM Handbook - Biblia sa sulod sa matag leksyon
   - 📖 button sa kanunay makita sa matag leksyon
   - Tanang teksto sa leksyon (pananglitan "Juan 3:16") mahimong i-tap
   - Mga bersyon: Cebuano, Tagalog, KJV, NIV (gikarga lang kung kinahanglan)
   Mga file nga gikinahanglan sa samang folder:
   cebuano_bible.js, TagAngBiblia.js, ver_kjv.js, ver_niv.js
   ============================================================ */
(function () {
  'use strict';
  if (window.__bcmBible) return;
  window.__bcmBible = true;

  /* ---------- Mga basahon (display name + aliases) ---------- */
  var BOOKS = [
    ['Genesis', ['Genesis']],
    ['Exodo', ['Exodo', 'Exodus']],
    ['Levitico', ['Levitico', 'Leviticus']],
    ['Numeros', ['Numeros', 'Numbers']],
    ['Deuteronomio', ['Deuteronomio', 'Deuteronomy']],
    ['Josue', ['Josue', 'Joshua']],
    ['Hukom', ['Mga Hukom', 'Maghuhukom', 'Hukom', 'Judges']],
    ['Rut', ['Rut', 'Ruth']],
    ['1 Samuel', []],
    ['2 Samuel', []],
    ['1 Hari', []],
    ['2 Hari', []],
    ['1 Cronicas', []],
    ['2 Cronicas', []],
    ['Esdras', ['Esdras', 'Ezra']],
    ['Nehemias', ['Nehemias', 'Nehemiah']],
    ['Ester', ['Ester', 'Esther']],
    ['Job', ['Job']],
    ['Salmo', ['Mga Salmo', 'Salmos', 'Salmo', 'Psalms', 'Psalm']],
    ['Proverbio', ['Mga Proverbio', 'Proverbios', 'Proverbio', 'Proverbs']],
    ['Eclesiastes', ['Eclesiastes', 'Ecclesiastes', 'Magwawali']],
    ['Awit ni Solomon', ['Awit ni Solomon', 'Awit sa mga Awit', 'Song of Solomon', 'Song of Songs']],
    ['Isaias', ['Isaias', 'Isaiah']],
    ['Jeremias', ['Jeremias', 'Jeremiah']],
    ['Lamentasyon', ['Lamentasyon', 'Lamentaciones', 'Lamentations']],
    ['Ezekiel', ['Ezekiel', 'Ezequiel']],
    ['Daniel', ['Daniel']],
    ['Hosea', ['Hosea', 'Oseas']],
    ['Joel', ['Joel']],
    ['Amos', ['Amos']],
    ['Obadias', ['Obadias', 'Abdias', 'Obadiah']],
    ['Jonas', ['Jonas', 'Jonah']],
    ['Mikas', ['Mikas', 'Miqueas', 'Micah']],
    ['Nahum', ['Nahum']],
    ['Habacuc', ['Habacuc', 'Habakkuk']],
    ['Sofonias', ['Sofonias', 'Zephaniah']],
    ['Hagai', ['Hagai', 'Ageo', 'Haggai']],
    ['Zacarias', ['Zacarias', 'Zechariah']],
    ['Malakias', ['Malakias', 'Malaquias', 'Malachi']],
    ['Mateo', ['Mateo', 'Matthew']],
    ['Marcos', ['Marcos', 'Mark']],
    ['Lucas', ['Lucas', 'Lukas', 'Luke']],
    ['Juan', ['Juan', 'John']],
    ['Buhat', ['Mga Buhat', 'Buhat', 'Acts']],
    ['Roma', ['Roma', 'Romans']],
    ['1 Corinto', []],
    ['2 Corinto', []],
    ['Galacia', ['Galacia', 'Galatians']],
    ['Efeso', ['Efeso', 'Ephesians']],
    ['Filipos', ['Filipos', 'Philippians']],
    ['Colosas', ['Colosas', 'Colossians']],
    ['1 Tesalonica', []],
    ['2 Tesalonica', []],
    ['1 Timoteo', []],
    ['2 Timoteo', []],
    ['Tito', ['Tito', 'Titus']],
    ['Filemon', ['Filemon', 'Philemon']],
    ['Hebreo', ['Hebreohanon', 'Hebreo', 'Hebrews']],
    ['Santiago', ['Santiago', 'James']],
    ['1 Pedro', []],
    ['2 Pedro', []],
    ['1 Juan', []],
    ['2 Juan', []],
    ['3 Juan', []],
    ['Judas', ['Judas', 'Hudas', 'Jude']],
    ['Pinadayag', ['Pinadayag', 'Gipadayag', 'Pagpadayag', 'Apocalipsis', 'Revelation']]
  ];
  /* mga basahon nga naay numero sa unahan: ngalan -> [index sa 1, 2, 3] */
  var GROUPS = {
    'Samuel': [8, 9], 'Hari': [10, 11], 'Reyes': [10, 11], 'Kings': [10, 11],
    'Cronicas': [12, 13], 'Crónicas': [12, 13], 'Chronicles': [12, 13],
    'Corinto': [45, 46], 'Corinthians': [45, 46],
    'Tesalonica': [51, 52], 'Tesalonicense': [51, 52], 'Thessalonians': [51, 52],
    'Timoteo': [53, 54], 'Temoteo': [53, 54], 'Timothy': [53, 54],
    'Pedro': [59, 60], 'Peter': [59, 60],
    'Juan': [61, 62, 63], 'John': [61, 62, 63]
  };

  var ALIAS = {};            // lowercase -> index (walay numero)
  var scanNames = [];
  BOOKS.forEach(function (b, i) {
    b[1].forEach(function (a) { ALIAS[a.toLowerCase()] = i; scanNames.push(a); });
  });
  Object.keys(GROUPS).forEach(function (g) { scanNames.push(g); });
  scanNames.sort(function (a, b) { return b.length - a.length; });
  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var NAME_RX = scanNames.map(esc).join('|');
  var SCAN_SRC = '(^|[^A-Za-z0-9\\u00C0-\\u00FF])([123]\\s?|I{1,3}\\s)?(' + NAME_RX +
    ')\\s(\\d{1,3}):(\\d{1,3})(?:\\s?[-\\u2013]\\s?(\\d{1,3}))?';
  var CONT_RX = /^\s?[,;]\s?(\d{1,3}):(\d{1,3})(?:\s?[-\u2013]\s?(\d{1,3}))?/;

  function romanNum(r) { return r ? r.length : 0; }
  function resolveBook(name, num) {
    if (GROUPS[name]) {
      if (!num) return (name === 'Juan' || name === 'John') ? 42 : -1;
      return GROUPS[name][num - 1] != null ? GROUPS[name][num - 1] : -1;
    }
    var i = ALIAS[name.toLowerCase()];
    return i == null ? -1 : i;
  }

  /* ---------- Mga bersyon ---------- */
  var VERS = {
    ceb: { label: 'Cebuano', file: 'cebuano_bible.js', kind: 'obj', data: function () { return typeof myBibleData !== 'undefined' ? myBibleData : null; } },
    tgl: { label: 'Tagalog', file: 'TagAngBiblia.js', kind: 'obj', data: function () { return typeof myTagalogData !== 'undefined' ? myTagalogData : null; } },
    kjv: { label: 'English (KJV)', file: 'ver_kjv.js', kind: 'arr', data: function () { return window.BV_kjv || null; } },
    niv: { label: 'English (NIV)', file: 'ver_niv.js', kind: 'arr', data: function () { return window.BV_niv || null; } }
  };
  var loading = {};
  function loadVersion(key) {
    var V = VERS[key];
    if (V.data()) return Promise.resolve();
    if (loading[key]) return loading[key];
    loading[key] = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = V.file;
      s.onload = function () { V.data() ? resolve() : reject(new Error('empty')); };
      s.onerror = function () { s.remove(); reject(new Error('missing')); };
      document.head.appendChild(s);
    });
    loading[key].catch(function () { delete loading[key]; });
    return loading[key];
  }
  function chapterCount(key, b) {
    var D = VERS[key].data();
    if (!D) return 0;
    return VERS[key].kind === 'obj' ? (D.books[b] ? D.books[b].chapters.length : 0) : (D[b] ? D[b].length : 0);
  }
  function getChapter(key, b, c) {
    var D = VERS[key].data(), out = [], i;
    if (!D) return out;
    if (VERS[key].kind === 'obj') {
      var chs = D.books[b] && D.books[b].chapters;
      if (!chs) return out;
      var ch = chs[c - 1];
      if (!ch || ch.chapter != c) {
        ch = null;
        for (i = 0; i < chs.length; i++) if (chs[i].chapter == c) { ch = chs[i]; break; }
      }
      if (!ch) return out;
      for (i = 0; i < ch.verses.length; i++) out.push([ch.verses[i].verse, String(ch.verses[i].text).replace(/\s+/g, ' ').trim()]);
    } else {
      var arr = D[b] && D[b][c - 1];
      if (!arr) return out;
      for (i = 0; i < arr.length; i++) out.push([i + 1, arr[i]]);
    }
    return out;
  }

  /* ---------- Local storage (luwas sa error) ---------- */
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

  /* ---------- CSS ---------- */
  var css = '' +
    '.bcm-bible-root,.bcm-bible-root *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}' +
    '.bcm-bible-root{font-family:"Outfit",system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5;text-align:left}' +
    '.bcm-fab{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:99980;display:flex;align-items:center;gap:8px;padding:12px 18px;border:2px solid #fff3b0;border-radius:40px;background:linear-gradient(135deg,#ffd700,#ff9d00);color:#1a1200;font:700 1rem/1 "Outfit",system-ui,sans-serif;cursor:pointer;box-shadow:0 0 18px rgba(255,200,0,.55),0 6px 18px rgba(0,0,0,.5);animation:bcmPulse 2.6s ease-in-out infinite}' +
    '.bcm-fab:active{transform:scale(.95)}' +
    '@keyframes bcmPulse{0%,100%{box-shadow:0 0 14px rgba(255,200,0,.45),0 6px 18px rgba(0,0,0,.5)}50%{box-shadow:0 0 28px rgba(255,200,0,.9),0 6px 18px rgba(0,0,0,.5)}}' +
    '.bcm-back{position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,.65);opacity:0;pointer-events:none;transition:opacity .25s}' +
    '.bcm-back.on{opacity:1;pointer-events:auto}' +
    '.bcm-sheet{position:fixed;left:0;right:0;bottom:0;margin:0 auto;z-index:99991;width:100%;max-width:780px;height:90%;display:flex;flex-direction:column;background:#0b0f17;color:#e8edf5;border:2px solid #d4af37;border-bottom:0;border-radius:20px 20px 0 0;box-shadow:0 -8px 40px rgba(212,175,55,.35);transform:translateY(105%);transition:transform .3s ease;visibility:hidden}' +
    '.bcm-sheet.on{transform:translateY(0);visibility:visible}' +
    '.bcm-head{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid rgba(212,175,55,.35);flex:0 0 auto}' +
    '.bcm-head h3{margin:0;flex:1;color:#ffd700;font:900 1rem/1.2 "Orbitron","Outfit",sans-serif;letter-spacing:1px}' +
    '.bcm-sheet select,.bcm-sheet input{background:#141b28;color:#f2f5fa;border:1px solid rgba(212,175,55,.55);border-radius:10px;padding:9px 10px;font:600 16px "Outfit",system-ui,sans-serif;min-width:0}' +
    '.bcm-sheet select:focus,.bcm-sheet input:focus{outline:2px solid #ffd700}' +
    '.bcm-x{flex:0 0 auto;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.08);color:#fff;font-size:1.2rem;cursor:pointer}' +
    '.bcm-row{display:flex;gap:8px;padding:10px 14px 0;flex:0 0 auto}' +
    '.bcm-row input{flex:1}' +
    '.bcm-btn{flex:0 0 auto;border:0;border-radius:10px;padding:9px 14px;background:linear-gradient(135deg,#ffd700,#ff9d00);color:#1a1200;font:800 .9rem "Outfit",system-ui,sans-serif;cursor:pointer}' +
    '.bcm-btn.ghost{background:rgba(255,215,0,.1);color:#ffd700;border:1px solid rgba(255,215,0,.5)}' +
    '.bcm-btn:disabled{opacity:.4}' +
    '.bcm-chips{padding:10px 14px 0;flex:0 0 auto}' +
    '.bcm-chips small{display:block;color:#9fb0c8;font-weight:600;margin-bottom:6px}' +
    '.bcm-chip-list{display:flex;flex-wrap:wrap;gap:6px;max-height:76px;overflow-y:auto}' +
    '.bcm-chip{border:1px solid rgba(0,255,242,.55);background:rgba(0,255,242,.08);color:#7ffcf6;border-radius:20px;padding:5px 11px;font:700 .82rem "Outfit",sans-serif;cursor:pointer;white-space:nowrap}' +
    '.bcm-chip.cur{background:#00fff2;color:#00201f}' +
    '.bcm-nav{display:flex;align-items:center;gap:8px;padding:10px 14px;flex:0 0 auto}' +
    '.bcm-nav select{flex:1}' +
    '.bcm-nav .bcm-ch{flex:0 0 76px}' +
    '.bcm-body{position:relative;flex:1 1 auto;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding:4px 16px 24px;border-top:1px solid rgba(212,175,55,.2)}' +
    '.bcm-title{text-align:left!important;margin:12px 0 8px;color:#ffd700;font:800 1.15rem "Outfit",sans-serif}' +
    '.bcm-title span{color:#9fb0c8;font-weight:600;font-size:.85rem;margin-left:6px}' +
    '.bcm-v{text-align:left!important;word-spacing:normal!important;hyphens:none;margin:0;padding:7px 8px;border-left:3px solid transparent;border-radius:6px;font-size:var(--bcm-fs,1.05rem);line-height:1.75;color:#eef2f8;cursor:pointer}' +
    '.bcm-v sup{color:#ffd700;font-weight:800;font-size:.7em;margin-right:5px}' +
    '.bcm-v.hl{background:rgba(255,215,0,.16);border-left-color:#ffd700}' +
    '.bcm-v.sel{background:rgba(0,255,242,.16);border-left-color:#00fff2}' +
    '.bcm-msg{padding:30px 10px;text-align:center;color:#c8d3e3}' +
    '.bcm-foot{display:flex;align-items:center;gap:8px;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid rgba(212,175,55,.35);flex:0 0 auto;background:#0b0f17}' +
    '.bcm-foot .bcm-sp{flex:1;color:#9fb0c8;font-size:.8rem}' +
    '.bcm-ref{color:#00e5ff;border-bottom:1px dashed #00e5ff;cursor:pointer;font-weight:inherit;white-space:nowrap}' +
    '.bcm-ref:hover,.bcm-ref:focus{background:rgba(0,229,255,.18);outline:0}' +
    '@media(max-width:520px){.bcm-fab{padding:11px 15px;font-size:.95rem}.bcm-head h3{font-size:.85rem}.bcm-sheet{height:92%}}';

  /* ---------- Estado ---------- */
  var st = {
    ver: VERS[lsGet('bcmBibleVer', 'ceb')] ? lsGet('bcmBibleVer', 'ceb') : 'ceb',
    b: -1, c: 1, v1: 0, v2: 0, sel: {}, open: false, token: 0
  };
  var fs = parseFloat(lsGet('bcmBibleFs', '1.05')) || 1.05;
  var lessonRefs = [];
  var el = {};

  /* ---------- Pag-buhat sa UI ---------- */
  function build() {
    var s = document.createElement('style');
    s.id = 'bcm-bible-css';
    s.textContent = css;
    document.head.appendChild(s);

    var root = document.createElement('div');
    root.className = 'bcm-bible-root notranslate';
    root.setAttribute('translate', 'no');
    root.innerHTML =
      '<button type="button" class="bcm-fab" aria-label="Ablihi ang Biblia">📖 <span>Biblia</span></button>' +
      '<div class="bcm-back"></div>' +
      '<div class="bcm-sheet" role="dialog" aria-modal="true" aria-label="Biblia">' +
        '<div class="bcm-head"><h3>📖 BIBLIA</h3>' +
          '<select class="bcm-ver" aria-label="Bersyon"></select>' +
          '<button type="button" class="bcm-x" aria-label="Isira">✕</button></div>' +
        '<div class="bcm-row"><input class="bcm-q" type="text" placeholder="Pangitaa: Juan 3:16 o Roma 8" autocomplete="off" autocapitalize="words" enterkeyhint="go">' +
          '<button type="button" class="bcm-btn bcm-go">Adtoa</button></div>' +
        '<div class="bcm-chips" hidden><small>📌 Mga teksto niining leksyona:</small><div class="bcm-chip-list"></div></div>' +
        '<div class="bcm-nav"><button type="button" class="bcm-btn ghost bcm-prev" aria-label="Miaging kapitulo">◀</button>' +
          '<select class="bcm-book" aria-label="Basahon"></select>' +
          '<select class="bcm-ch" aria-label="Kapitulo"></select>' +
          '<button type="button" class="bcm-btn ghost bcm-next" aria-label="Sunod nga kapitulo">▶</button></div>' +
        '<div class="bcm-body"></div>' +
        '<div class="bcm-foot"><button type="button" class="bcm-btn ghost bcm-fm">A−</button>' +
          '<button type="button" class="bcm-btn ghost bcm-fp">A+</button>' +
          '<span class="bcm-sp">Tap ang bersikulo aron pilion</span>' +
          '<button type="button" class="bcm-btn bcm-copy" hidden>📋 Kopyaha</button></div>' +
      '</div>';
    document.body.appendChild(root);

    el.root = root;
    ['fab', 'back', 'sheet', 'ver', 'x', 'q', 'go', 'chips', 'chip-list', 'prev', 'next', 'book', 'ch', 'body', 'fm', 'fp', 'copy', 'sp']
      .forEach(function (k) { el[k] = root.querySelector('.bcm-' + k); });
    el.sheet.style.setProperty('--bcm-fs', fs + 'rem');

    Object.keys(VERS).forEach(function (k) {
      var o = document.createElement('option');
      o.value = k; o.textContent = VERS[k].label;
      el.ver.appendChild(o);
    });
    el.ver.value = st.ver;
    BOOKS.forEach(function (b, i) {
      var o = document.createElement('option');
      o.value = i; o.textContent = b[0];
      el.book.appendChild(o);
    });

    el.fab.addEventListener('click', function () { openReader(); });
    el.back.addEventListener('click', function () { closeReader(); });
    el.x.addEventListener('click', function () { closeReader(); });
    el.go.addEventListener('click', doSearch);
    el.q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
    el.ver.addEventListener('change', function () {
      st.ver = el.ver.value; lsSet('bcmBibleVer', st.ver); st.sel = {};
      show(st.b, st.c, st.v1, st.v2);
    });
    el.book.addEventListener('change', function () { show(parseInt(el.book.value, 10), 1, 0, 0); });
    el.ch.addEventListener('change', function () { show(st.b, parseInt(el.ch.value, 10), 0, 0); });
    el.prev.addEventListener('click', function () { step(-1); });
    el.next.addEventListener('click', function () { step(1); });
    el.fm.addEventListener('click', function () { setFs(fs - 0.1); });
    el.fp.addEventListener('click', function () { setFs(fs + 0.1); });
    el.copy.addEventListener('click', copySel);
    el.body.addEventListener('click', function (e) {
      var p = e.target.closest ? e.target.closest('.bcm-v') : null;
      if (!p) return;
      var n = p.getAttribute('data-n');
      if (st.sel[n]) { delete st.sel[n]; p.classList.remove('sel'); } else { st.sel[n] = 1; p.classList.add('sel'); }
      updCopy();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && st.open) closeReader(); });
    window.addEventListener('popstate', function () { if (st.open) hide(); });
  }

  function setFs(v) {
    fs = Math.max(0.8, Math.min(2, v));
    lsSet('bcmBibleFs', String(fs));
    el.sheet.style.setProperty('--bcm-fs', fs + 'rem');
  }

  function openReader(ref) {
    if (!st.open) {
      st.open = true;
      el.back.classList.add('on');
      el.sheet.classList.add('on');
      try { history.pushState({ bcmBible: 1 }, ''); } catch (e) { }
    }
    if (ref) show(ref.b, ref.c, ref.v1, ref.v2);
    else if (st.b < 0) {
      var f = lessonRefs[0] || { b: 42, c: 3, v1: 0, v2: 0 };
      show(f.b, f.c, f.v1, f.v2);
    }
  }
  function hide() {
    st.open = false;
    el.back.classList.remove('on');
    el.sheet.classList.remove('on');
  }
  function closeReader() {
    if (!st.open) return;
    var hasState = false;
    try { hasState = history.state && history.state.bcmBible; } catch (e) { }
    hide();
    if (hasState) { try { history.back(); } catch (e) { } }
  }

  function step(d) {
    var b = st.b, c = st.c + d;
    if (c < 1) { b = (b + 65) % 66; c = chapterCount(st.ver, b) || 1; }
    else if (c > (chapterCount(st.ver, b) || 1)) { b = (b + 1) % 66; c = 1; }
    show(b, c, 0, 0);
  }

  function fillChapters(count, cur) {
    el.ch.innerHTML = '';
    for (var i = 1; i <= count; i++) {
      var o = document.createElement('option');
      o.value = i; o.textContent = i;
      el.ch.appendChild(o);
    }
    el.ch.value = cur;
  }

  function show(b, c, v1, v2) {
    if (b < 0) return;
    var tok = ++st.token;
    st.b = b; st.c = c; st.v1 = v1 || 0; st.v2 = v2 || v1 || 0; st.sel = {};
    updCopy();
    el.book.value = b;
    markChips();
    if (!VERS[st.ver].data()) {
      el.body.innerHTML = '<div class="bcm-msg">⏳ Gikarga ang Biblia…<br><small>(Una nga higayon pa ang ' + VERS[st.ver].label + ', palihog hulat gamay)</small></div>';
    }
    el.prev.disabled = el.next.disabled = true;
    loadVersion(st.ver).then(function () {
      if (tok !== st.token) return;
      var count = chapterCount(st.ver, b);
      if (c > count) { c = st.c = count; }
      fillChapters(count, c);
      render(tok);
      el.prev.disabled = el.next.disabled = false;
    }).catch(function () {
      if (tok !== st.token) return;
      el.body.innerHTML = '<div class="bcm-msg">⚠️ Dili maablihan ang <b>' + VERS[st.ver].file + '</b>.<br>' +
        'Siguroha nga naa kini sa samang folder sa mga leksyon, ug naka-online ka sa unang paggamit.<br><br>' +
        '<button type="button" class="bcm-btn bcm-retry">Sulayi pag-usab</button></div>';
      var r = el.body.querySelector('.bcm-retry');
      if (r) r.addEventListener('click', function () { show(st.b, st.c, st.v1, st.v2); });
    });
  }

  function render(tok) {
    var verses = getChapter(st.ver, st.b, st.c);
    var frag = document.createDocumentFragment();
    var h = document.createElement('div');
    h.className = 'bcm-title';
    h.textContent = BOOKS[st.b][0] + ' ' + st.c;
    var sm = document.createElement('span');
    sm.textContent = VERS[st.ver].label;
    h.appendChild(sm);
    frag.appendChild(h);
    if (!verses.length) {
      var m = document.createElement('div');
      m.className = 'bcm-msg';
      m.textContent = 'Walay makita nga teksto niini nga kapitulo sa ' + VERS[st.ver].label + '.';
      frag.appendChild(m);
    }
    var first = null;
    verses.forEach(function (vv) {
      var p = document.createElement('p');
      p.className = 'bcm-v';
      p.setAttribute('data-n', vv[0]);
      var inRange = st.v1 && vv[0] >= st.v1 && vv[0] <= Math.max(st.v1, st.v2);
      if (inRange) { p.classList.add('hl'); if (!first) first = p; }
      var sup = document.createElement('sup');
      sup.textContent = vv[0];
      p.appendChild(sup);
      p.appendChild(document.createTextNode(vv[1]));
      frag.appendChild(p);
    });
    el.body.innerHTML = '';
    el.body.appendChild(frag);
    el.body.scrollTop = first ? Math.max(0, first.offsetTop - 44) : 0;
  }

  function updCopy() {
    var n = Object.keys(st.sel).length;
    el.copy.hidden = n === 0;
    el.sp.hidden = n !== 0;
    el.copy.textContent = '📋 Kopyaha (' + n + ')';
  }

  function compress(nums) {
    nums.sort(function (a, b) { return a - b; });
    var out = [], i = 0;
    while (i < nums.length) {
      var j = i;
      while (j + 1 < nums.length && nums[j + 1] === nums[j] + 1) j++;
      out.push(j > i ? nums[i] + '-' + nums[j] : String(nums[i]));
      i = j + 1;
    }
    return out.join(', ');
  }
  function copySel() {
    var nums = Object.keys(st.sel).map(Number);
    if (!nums.length) return;
    nums.sort(function (a, b) { return a - b; });
    var verses = getChapter(st.ver, st.b, st.c), map = {};
    verses.forEach(function (v) { map[v[0]] = v[1]; });
    var text = nums.map(function (n) { return map[n]; }).join(' ');
    var out = '“' + text + '”\n— ' + BOOKS[st.b][0] + ' ' + st.c + ':' + compress(nums.slice()) + ' (' + VERS[st.ver].label + ')';
    function done() {
      el.copy.textContent = '✅ Na-kopya!';
      setTimeout(function () { st.sel = {}; Array.prototype.forEach.call(el.body.querySelectorAll('.sel'), function (n) { n.classList.remove('sel'); }); updCopy(); }, 900);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(out).then(done, fallback);
    } else fallback();
    function fallback() {
      var t = document.createElement('textarea');
      t.value = out; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); done(); } catch (e) { }
      t.remove();
    }
  }

  /* ---------- Pangita sa reference ---------- */
  function parseInput(str) {
    var m = /^\s*(?:([123])\s?|(I{1,3})\s)?([A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF ]*?)\s*(\d{1,3})(?:\s*[:.]\s*(\d{1,3})(?:\s*[-\u2013]\s*(\d{1,3}))?)?\s*$/i.exec(str);
    if (!m) return null;
    var num = m[1] ? parseInt(m[1], 10) : romanNum(m[2]);
    var name = m[3].trim().replace(/\s+/g, ' ');
    var low = name.toLowerCase(), idx = -1, g;
    for (g in GROUPS) if (g.toLowerCase() === low) { idx = resolveBook(g, num); break; }
    if (idx < 0 && !num && ALIAS[low] != null) idx = ALIAS[low];
    if (idx < 0 && !num) {
      for (var i = 0; i < BOOKS.length && idx < 0; i++) {
        if (BOOKS[i][0].toLowerCase().indexOf(low) === 0 && (low.length >= 3)) idx = i;
        else BOOKS[i][1].forEach(function (a) { if (idx < 0 && low.length >= 3 && a.toLowerCase().indexOf(low) === 0) idx = i; });
      }
    }
    if (idx < 0 && num) {   // numero + ngalan nga dili grupo: pananglitan "1 Juan"
      for (g in GROUPS) if (g.toLowerCase().indexOf(low) === 0 && low.length >= 3) { idx = resolveBook(g, num); break; }
    }
    if (idx < 0) return null;
    return { b: idx, c: parseInt(m[4], 10), v1: m[5] ? parseInt(m[5], 10) : 0, v2: m[6] ? parseInt(m[6], 10) : (m[5] ? parseInt(m[5], 10) : 0) };
  }
  function doSearch() {
    var r = parseInput(el.q.value);
    if (!r) {
      el.q.style.outline = '2px solid #ff4d4d';
      setTimeout(function () { el.q.style.outline = ''; }, 1200);
      el.q.placeholder = 'Dili makita. Pananglitan: Juan 3:16';
      return;
    }
    show(r.b, Math.max(1, r.c), r.v1, r.v2);
    el.q.blur();
  }

  /* ---------- Pag-link sa mga teksto sa sulod sa leksyon ---------- */
  function refLabel(r) {
    var s = BOOKS[r.b][0] + ' ' + r.c + ':' + r.v1;
    if (r.v2 && r.v2 !== r.v1) s += '-' + r.v2;
    return s;
  }
  function mkSpan(text, r) {
    var sp = document.createElement('span');
    sp.className = 'bcm-ref';
    sp.setAttribute('translate', 'no');
    sp.setAttribute('role', 'button');
    sp.tabIndex = 0;
    sp.setAttribute('data-b', r.b);
    sp.setAttribute('data-c', r.c);
    sp.setAttribute('data-v1', r.v1);
    sp.setAttribute('data-v2', r.v2);
    sp.textContent = text;
    var key = r.b + '|' + r.c + '|' + r.v1 + '|' + r.v2;
    for (var i = 0; i < lessonRefs.length; i++) if (lessonRefs[i].key === key) return sp;
    lessonRefs.push({ key: key, b: r.b, c: r.c, v1: r.v1, v2: r.v2 });
    return sp;
  }
  function linkify(node) {
    var text = node.nodeValue;
    if (!/\d:\d/.test(text)) return;
    var re = new RegExp(SCAN_SRC, 'g'), m, last = 0, frag = null;
    while ((m = re.exec(text))) {
      var numTxt = (m[2] || '').replace(/\s/g, '');
      var numStr = /^[123]$/.test(numTxt) ? parseInt(numTxt, 10) : numTxt.length;
      var name = m[3];
      var idx = resolveBook(name, numStr);
      var start = m.index + m[1].length;
      var end = m.index + m[0].length;
      if (idx < 0) { re.lastIndex = end; continue; }
      if (!GROUPS[name]) start += (m[2] || '').length;   // ang numero dili parte sa ngalan sa basahon
      var c = parseInt(m[4], 10), v1 = parseInt(m[5], 10), v2 = m[6] ? parseInt(m[6], 10) : v1;
      if (!frag) frag = document.createDocumentFragment();
      if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
      frag.appendChild(mkSpan(text.slice(start, end), { b: idx, c: c, v1: v1, v2: v2 }));
      last = end;
      var cm;
      while ((cm = CONT_RX.exec(text.slice(last)))) {
        var sep = cm[0].slice(0, cm[0].search(/\d/));
        var body = cm[0].slice(sep.length);
        frag.appendChild(document.createTextNode(sep));
        var cv1 = parseInt(cm[2], 10);
        frag.appendChild(mkSpan(body, { b: idx, c: parseInt(cm[1], 10), v1: cv1, v2: cm[3] ? parseInt(cm[3], 10) : cv1 }));
        last += cm[0].length;
      }
      re.lastIndex = last;
    }
    if (frag) {
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  }
  function linkAll() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        while (p && p !== document.body) {
          var t = p.nodeName;
          if (t === 'SCRIPT' || t === 'STYLE' || t === 'A' || t === 'TEXTAREA' || t === 'SELECT' || t === 'BUTTON' || t === 'NOSCRIPT') return NodeFilter.FILTER_REJECT;
          if (p.id === 'translate_wrapper' || p.id === 'google_translate_element') return NodeFilter.FILTER_REJECT;
          if (p.classList && (p.classList.contains('bcm-bible-root') || p.classList.contains('bcm-ref') || p.classList.contains('notranslate'))) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return /\d:\d/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(linkify);
  }
  function refFromSpan(sp) {
    return { b: +sp.getAttribute('data-b'), c: +sp.getAttribute('data-c'), v1: +sp.getAttribute('data-v1'), v2: +sp.getAttribute('data-v2') };
  }

  function buildChips() {
    if (!lessonRefs.length) return;
    el.chips.hidden = false;
    var list = el['chip-list'];
    lessonRefs.forEach(function (r) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bcm-chip';
      b.textContent = refLabel(r);
      b.setAttribute('data-key', r.key);
      b.addEventListener('click', function () { show(r.b, r.c, r.v1, r.v2); });
      list.appendChild(b);
    });
  }
  function markChips() {
    if (!lessonRefs.length) return;
    var key = st.b + '|' + st.c + '|' + st.v1 + '|' + st.v2;
    Array.prototype.forEach.call(el['chip-list'].children, function (c) {
      c.classList.toggle('cur', c.getAttribute('data-key') === key);
    });
  }

  /* ---------- Sinugdan ---------- */
  function init() {
    try { linkAll(); } catch (e) { /* ayaw guba-a ang leksyon kung naay sayop */ }
    build();
    buildChips();
    document.addEventListener('click', function (e) {
      var sp = e.target.closest ? e.target.closest('.bcm-ref') : null;
      if (sp) { e.preventDefault(); openReader(refFromSpan(sp)); }
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('bcm-ref')) {
        e.preventDefault(); openReader(refFromSpan(e.target));
      }
    });
    if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
      navigator.serviceWorker.register('sw.js').catch(function () { });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.BCMBible = { open: function (s) { var r = parseInput(s); if (r) openReader(r); else openReader(); } };
})();
