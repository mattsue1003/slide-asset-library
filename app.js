/* 簡報素材庫 — 主程式 */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const IC = id => (LIB.items.icons.find(i => i.id === 'ic-' + id) || {}).svg || '';
  const svg = (id, s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC(id)}</svg>`;

  /* ---------- 類別設定 ---------- */
  const CATS = [
    { k: 'templates', n: '簡報模板', ic: 'image', kind: 'slide', wide: 1, d: '整套配色＋字型＋裝飾的投影片主題' },
    { k: 'fonts', n: '字型', ic: 'book', kind: 'font', d: '繁中、日文、英文 Google Fonts，可直接連結使用' },
    { k: 'palettes', n: '配色方案', ic: 'sun', kind: 'palette', isNew: 1, d: '五色一組：底色、輔色、主色、強調、文字' },
    { k: 'backgrounds', n: '背景', ic: 'cloud', kind: 'bg', isNew: 1, d: '漸層、圖樣、紙質紋理、會動的背景' },
    { k: 'layouts', n: '版面配置', ic: 'sliders', kind: 'layout', wide: 1, isNew: 1, d: '封面、雙欄、圖文、數據、團隊、感謝頁等排版' },
    { k: 'transitions', n: '轉場', ic: 'arrow-right', kind: 'transition', d: '換頁效果：推移、翻轉、擦拭、圓形展開…' },
    { k: 'animations', n: '畫面動畫', ic: 'play', kind: 'anim', d: '元素進場、強調、循環動畫' },
    { k: 'textboxes', n: '文字方塊', ic: 'chat', kind: 'block', w: 480, d: '便利貼、對話框、提示框、引言、標籤…' },
    { k: 'shapes', n: '形狀裝飾', ic: 'star', kind: 'block', w: 440, isNew: 1, d: '分隔線、色塊、徽章、箭頭、框線、點綴' },
    { k: 'icons', n: '圖示', ic: 'smile', kind: 'icon', isNew: 1, d: '線條 SVG 圖示，含醫療、生活、商務' },
    { k: 'charts', n: '圖表元件', ic: 'bar-chart', kind: 'block', w: 520, isNew: 1, d: '純 CSS／SVG 圖表：甜甜圈、長條、雷達…' },
    { k: 'infographics', n: '資訊圖塊', ic: 'pie', kind: 'block', w: 640, isNew: 1, d: '時間軸、流程、SWOT、心智圖、比較表…' },
    { k: 'interactive', n: '互動元件', ic: 'target', kind: 'ix', w: 480, isNew: 1, d: '選擇題、是非題、翻牌、轉盤、計時器…' },
    { k: 'sounds', n: '音效', ic: 'music', kind: 'sound', isNew: 1, d: '答對、答錯、掌聲、鼓聲…即時合成免音檔' },
  ];
  const CAT = Object.fromEntries(CATS.map(c => [c.k, c]));
  const ALL = [];
  CATS.forEach(c => LIB.items[c.k].forEach(it => { it.cat = c.k; ALL.push(it); }));
  const BY_ID = Object.fromEntries(ALL.map(i => [i.id, i]));

  /* ---------- 全域樣式與字型 ---------- */
  const globalCss = [LIB.slideBase, LIB.layoutBase];
  ALL.forEach(it => { if (it.css && it.cat !== 'interactive') globalCss.push(it.css); });
  const st = document.createElement('style'); st.id = 'libcss'; st.textContent = globalCss.join('\n'); document.head.appendChild(st);
  LIB.items.fonts.forEach(f => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = LIB.fontLink(f.family, f.weights); document.head.appendChild(l);
  });

  /* ---------- 小工具 ---------- */
  const toast = (msg) => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1800); };
  async function copy(text, msg = '已複製，可以貼到對話裡了') {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    toast(msg);
  }
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } },
  };
  function download(name, text, type = 'text/plain') {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  function playSound(it) { try { new Function(LIB.sfxCore + '\n' + it.body)(); } catch (e) { console.warn(e); } }

  /* ---------- 片段（給 Claude／複製用） ---------- */
  function snippet(it) {
    const c = it.cat, s = { head: '', css: '', html: '', js: '', usage: '' };
    if (c === 'fonts') { s.head = it.head; s.css = it.css; s.html = it.html; s.usage = `在 <head> 放入字型連結，再把 class「${it.id}」加到元素上，或在 CSS 寫 font-family:'${it.family}'。`; }
    else if (c === 'templates') {
      s.head = it.fonts.map(f => { const ft = LIB.items.fonts.find(x => x.family === f); return ft ? ft.head : ''; }).filter(Boolean).join('\n');
      s.css = LIB.slideBase + '\n' + it.css;
      s.html = `<section class="slide ${it.id}">\n  <h1>投影片標題</h1>\n  <h2>副標題</h2>\n  <ul><li>重點一</li><li>重點二</li><li>重點三</li></ul>\n</section>`;
      s.usage = `每張投影片是 1280×720 的 <section class="slide ${it.id}">，主色 ${it.accent}、底色 ${it.bg}、文字 ${it.fg}。`;
    }
    else if (c === 'layouts') { s.css = LIB.layoutBase + '\n' + it.css; s.html = it.html; s.usage = '放進 <section class="slide 模板class"> 裡面，會沿用模板的 --accent、--bg 顏色。'; }
    else if (c === 'palettes') { s.css = it.css; s.usage = `色票：${it.colors.join('、')}（${it.desc}）。把 class「${it.id}」加在投影片或 body 上即可套用 CSS 變數。`; }
    else if (c === 'backgrounds') { s.css = it.css; s.html = `<section class="slide ${it.id}">…</section>`; s.usage = '把 class 加到投影片上即可。'; }
    else if (c === 'transitions') {
      s.css = it.css;
      s.js = `// 換頁時：舊頁加上 ${it.id}-out、新頁加上 ${it.id}-in，動畫結束（約 ${it.dur * 1000}ms）後移除\nfunction goTo(oldSlide, newSlide){\n  newSlide.classList.add('active','${it.id}-in');\n  oldSlide.classList.add('${it.id}-out');${it.outTop ? "\n  oldSlide.style.zIndex=2; newSlide.style.zIndex=1;" : "\n  oldSlide.style.zIndex=1; newSlide.style.zIndex=2;"}\n  setTimeout(()=>{oldSlide.classList.remove('active','${it.id}-out');newSlide.classList.remove('${it.id}-in');}, ${Math.round(it.dur * 1000)});\n}`;
      s.usage = `轉場效果「${it.name}」，時間 ${it.dur} 秒。投影片需要 position:absolute 疊在一起。`;
    }
    else if (c === 'animations') { s.css = it.css; s.html = it.html; s.usage = `把 class「${it.id}」加到要動的元素；要依序出現可加 style="animation-delay:.2s"。`; }
    else if (c === 'icons') { s.html = it.html; s.usage = '線條圖示，顏色跟著文字顏色（color），可直接改 width / height。'; }
    else if (c === 'sounds') { s.js = it.js; s.usage = `呼叫 ${it.fn}() 就會播放（需在使用者點擊之後才能發聲）。`; }
    else { s.css = it.css || ''; s.html = it.html || ''; s.js = it.js || ''; s.usage = it.js ? '把 CSS、HTML、JS 一起放進簡報即可使用，可重複放多個。' : '把 CSS 放進 <style>，HTML 放進投影片即可。'; }
    return s;
  }
  function promptFor(it) {
    const s = snippet(it);
    let t = `【簡報素材｜${CAT[it.cat].n}】${it.name}（ID：${it.id}）\n說明：${it.desc || ''}\n使用方式：${s.usage}${s.css || s.html ? '（素材以 *{box-sizing:border-box} 設計）' : ''}\n`;
    if (s.head) t += '\n```html\n<!-- head -->\n' + s.head + '\n```\n';
    if (s.css) t += '\n```css\n' + s.css + '\n```\n';
    if (s.html) t += '\n```html\n' + s.html + '\n```\n';
    if (s.js) t += '\n```js\n' + s.js + '\n```\n';
    return t;
  }

  /* ---------- 預覽 ---------- */
  function ixDoc(it, extraCss = '') {
    return `<!doctype html><html><head><meta charset="utf-8"><style>*,*::before,*::after{box-sizing:border-box}html,body{margin:0;height:100%}body{display:flex;align-items:center;justify-content:center;font-family:'Noto Sans TC',system-ui,sans-serif;background:#fff;overflow:hidden}#w{flex:none}${it.css}${extraCss}</style></head><body><div id="w">${it.html}</div><script>${it.js || ''};(function(){var w=document.getElementById('w');function f(){w.style.zoom=1;var s=Math.min((innerWidth-20)/w.offsetWidth,(innerHeight-20)/w.offsetHeight,1.3);w.style.zoom=s}f();addEventListener('resize',f)})()<\/script></body></html>`;
  }
  function render(it, el, big) {
    const c = CAT[it.cat]; el.innerHTML = ''; el.className = (big ? 'modal-pv' : 'pv');
    if (c.kind === 'slide' || c.kind === 'layout') {
      el.classList.add('slidepv');
      const inner = c.kind === 'slide'
        ? `<div class="slide ${it.id}"><h1>${esc(it.name)}</h1><h2>${esc(it.desc)}</h2><ul><li>清楚好讀的重點條列</li><li>主色會用在項目符號與副標</li></ul><div class="pageno">3 / 12</div></div>`
        : `<div class="slide tp-minimal">${it.html}</div>`;
      el.innerHTML = `<div class="slidebox z">${inner}</div>`;
      el.dataset.fit = 'slide';
    } else if (c.kind === 'font') {
      el.innerHTML = `<div class="font-pv z ${it.id}"><div class="big">永遠的好朋友</div><div class="big" style="font-size:26px">Slide Deck 2026</div><div class="small">${esc(it.family)}</div></div>`;
    } else if (c.kind === 'palette') {
      el.innerHTML = `<div class="pal">${it.colors.map((x, i) => `<i style="background:${x};color:${i === 4 || i === 2 ? it.colors[0] : it.colors[4]}">${x}</i>`).join('')}</div>`;
    } else if (c.kind === 'bg') {
      el.innerHTML = `<div class="${it.id}" style="position:absolute;inset:0"></div>`;
    } else if (c.kind === 'transition') {
      el.innerHTML = `<div class="tr-stage"><div class="a">A</div><div class="b">B</div></div>`;
      startTransitionDemo(it, el);
    } else if (c.kind === 'anim') {
      el.innerHTML = `<div class="an-stage ${it.id} z">重點文字</div>`;
      if (!it.loop) startAnimDemo(it, el);
    } else if (c.kind === 'icon') {
      el.innerHTML = `<div class="icon-pv z">${it.html.replace('width="48" height="48"', big ? 'width="140" height="140"' : 'width="64" height="64"')}</div>`;
    } else if (c.kind === 'sound') {
      el.innerHTML = `<div class="snd"><button aria-label="播放">▶</button><small class="muted">${esc(it.group)}</small></div>`;
      el.querySelector('button').onclick = e => { e.stopPropagation(); playSound(it); };
    } else if (c.kind === 'ix') {
      const f = document.createElement('iframe'); f.title = it.name; f.loading = 'lazy';
      if (big) f.srcdoc = ixDoc(it); else { f.dataset.lazy = 1; ixObserver.observe(f); f._it = it; }
      el.appendChild(f);
    } else {
      el.innerHTML = `<div class="z">${it.html}</div>`;
      if (it.cat === 'shapes' || it.cat === 'textboxes') el.classList.add('checker');
    }
    requestAnimationFrame(() => fit(el));
  }
  const ixObserver = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && e.target.dataset.lazy) { e.target.srcdoc = ixDoc(e.target._it); delete e.target.dataset.lazy; ixObserver.unobserve(e.target); }
  }), { rootMargin: '200px' });
  function fit(pv) {
    const z = pv.querySelector('.z'); if (!z) return;
    const W = pv.clientWidth, H = pv.clientHeight; if (!W) return;
    if (pv.dataset.fit === 'slide') {
      const s = Math.min(W / 1280, H / 720); z.style.zoom = s;
      z.style.marginLeft = ((W - 1280 * s) / 2 / s) + 'px'; z.style.marginTop = ((H - 720 * s) / 2 / s) + 'px';
      return;
    }
    z.style.zoom = 1;
    const w = z.offsetWidth || 1, h = z.offsetHeight || 1;
    z.style.zoom = Math.min((W - 24) / w, (H - 24) / h, pv.classList.contains('modal-pv') ? 1.6 : 1);
  }
  const ro = new ResizeObserver(es => es.forEach(e => fit(e.target)));

  const demos = new Set();
  function startTransitionDemo(it, el) {
    const st = el.querySelector('.tr-stage'); let showB = false, timer = 0;
    const step = () => {
      const a = st.querySelector(showB ? '.b' : '.a'), b = st.querySelector(showB ? '.a' : '.b');
      [a, b].forEach(x => x.className = x.className.split(' ')[0]);
      a.classList.add(it.id + '-out'); b.classList.add(it.id + '-in');
      a.style.zIndex = it.outTop ? 2 : 1; b.style.zIndex = it.outTop ? 1 : 2;
      setTimeout(() => { a.className = a.className.split(' ')[0]; a.style.zIndex = 0; }, it.dur * 1000 + 30);
      showB = !showB;
    };
    st.querySelector('.b').style.zIndex = 0; st.querySelector('.a').style.zIndex = 1;
    const d = { el, on() { if (!timer) { step(); timer = setInterval(step, it.dur * 1000 + 900); } }, off() { clearInterval(timer); timer = 0; } };
    demos.add(d);
    el.addEventListener('mouseenter', d.on); el.addEventListener('mouseleave', d.off);
    if (el.classList.contains('modal-pv')) d.on();
  }
  function startAnimDemo(it, el) {
    const node = el.querySelector('.an-stage');
    const replay = () => { node.classList.remove(it.id); void node.offsetWidth; node.classList.add(it.id); };
    el.addEventListener('mouseenter', replay);
    if (el.classList.contains('modal-pv')) { el._iv = setInterval(replay, it.dur * 1000 + 1000); }
  }

  /* ---------- 素材籃 ---------- */
  let basket = store.get('sal-basket', []).filter(id => BY_ID[id]);
  function saveBasket() { store.set('sal-basket', basket); $('#basketCount').textContent = basket.length; renderBasket(); syncCards(); }
  function toggleBasket(id) {
    const i = basket.indexOf(id);
    if (i >= 0) { basket.splice(i, 1); toast('已從素材籃移除'); } else { basket.push(id); toast('已加入素材籃'); }
    saveBasket();
  }
  function syncCards() {
    $$('.card').forEach(c => { const on = basket.includes(c.dataset.id); c.classList.toggle('in-basket', on); const b = c.querySelector('.add'); if (b) { b.classList.toggle('on', on); b.textContent = on ? '✓ 已加入' : '＋ 素材籃'; } });
    const mb = $('#mActs .add'); if (mb && current) mb.textContent = basket.includes(current.id) ? '✓ 已在素材籃（點擊移除）' : '＋ 加入素材籃';
  }
  function renderBasket() {
    const L = $('#basketList');
    if (!basket.length) { L.innerHTML = '<div class="empty">素材籃是空的<br>在素材卡片上按「＋ 素材籃」加入</div>'; return; }
    L.innerHTML = basket.map(id => { const it = BY_ID[id]; return `<div class="row"><div><b>${esc(it.name)}</b><small>${CAT[it.cat].n}・${id}</small></div><button class="btn sm" data-copy="${id}">複製</button><button class="x" data-rm="${id}" aria-label="移除">✕</button></div>`; }).join('');
  }
  function basketPrompt() {
    const items = basket.map(id => BY_ID[id]);
    const head = `請幫我製作一份網頁簡報（單一 HTML 檔，每張投影片 1280×720，會依視窗等比縮放，可用方向鍵、點擊或滑動換頁）。\n請使用以下 ${items.length} 個素材：\n` + items.map(it => `- ${CAT[it.cat].n}：${it.name}（${it.id}）`).join('\n') + '\n\n以下是每個素材的程式碼：\n\n';
    return head + items.map(promptFor).join('\n---\n\n');
  }
  $('#basketList').addEventListener('click', e => {
    const c = e.target.closest('[data-copy]'), r = e.target.closest('[data-rm]');
    if (c) copy(promptFor(BY_ID[c.dataset.copy]));
    if (r) toggleBasket(r.dataset.rm);
  });
  const openDrawer = (on) => { $('#drawer').classList.toggle('open', on); $('#scrim').classList.toggle('on', on); $('#drawer').setAttribute('aria-hidden', !on); };
  $('#basketBtn').onclick = () => openDrawer(true);
  $('#drawerClose').onclick = () => openDrawer(false);
  $('#scrim').onclick = () => { openDrawer(false); $('#side').classList.remove('open'); };
  $('#copyAll').onclick = () => basket.length ? copy(basketPrompt(), `已複製 ${basket.length} 個素材的提示詞`) : toast('素材籃是空的');
  $('#dlMd').onclick = () => basket.length ? download('簡報素材包.md', basketPrompt(), 'text/markdown') : toast('素材籃是空的');
  $('#clearBasket').onclick = () => { if (basket.length && confirm('確定清空素材籃？')) { basket = []; saveBasket(); } };
  $('#toStudio').onclick = () => {
    const s = studioState();
    basket.map(id => BY_ID[id]).forEach(it => {
      if (it.cat === 'templates') s.tp = it.id;
      if (it.cat === 'fonts') { if (!s._f) { s.hf = it.id; s._f = 1; } else s.bf = it.id; }
      if (it.cat === 'palettes') s.pl = it.id;
      if (it.cat === 'backgrounds') s.bg = it.id;
      if (it.cat === 'transitions') s.tr = it.id;
      if (it.cat === 'animations') s.an = it.id;
      if (it.cat === 'sounds') s.sx = it.id;
    });
    const blocks = basket.filter(id => INSERTABLE.has(BY_ID[id].cat));
    if (blocks.length) s.src = s.src.trim() + '\n---\n# 素材籃的元件\n' + blocks.map(id => `[[${id}]]`).join('\n');
    delete s._f; store.set('sal-studio', s); openDrawer(false); location.hash = '#studio'; route(); toast('已套用到簡報工作室');
  };

  /* ---------- 詳細視窗 ---------- */
  let current = null;
  function openModal(it) {
    current = it; const s = snippet(it);
    render(it, $('#modalPv'), true);
    $('#mName').textContent = it.name; $('#mId').textContent = it.id; $('#mDesc').textContent = it.desc || '';
    const studioable = ['templates', 'fonts', 'palettes', 'backgrounds', 'transitions', 'animations', 'sounds'].includes(it.cat) || INSERTABLE.has(it.cat);
    $('#mActs').innerHTML = `<button class="btn primary cp">複製給 Claude</button><button class="btn add"></button>${studioable ? '<button class="btn use">用在簡報工作室</button>' : ''}${it.cat === 'sounds' ? '<button class="btn play">▶ 播放</button>' : ''}`;
    $('#mActs .cp').onclick = () => copy(promptFor(it));
    $('#mActs .add').onclick = () => toggleBasket(it.id);
    if (studioable) $('#mActs .use').onclick = () => useInStudio(it);
    if (it.cat === 'sounds') $('#mActs .play').onclick = () => playSound(it);
    const tabs = [['prompt', '給 Claude 的提示詞', promptFor(it)]];
    if (s.head) tabs.push(['head', 'HEAD', s.head]);
    if (s.css) tabs.push(['css', 'CSS', s.css]);
    if (s.html) tabs.push(['html', 'HTML', s.html]);
    if (s.js) tabs.push(['js', 'JS', s.js]);
    $('#mTabs').innerHTML = tabs.map((t, i) => `<button class="${i ? '' : 'on'}" data-i="${i}">${t[1]}</button>`).join('') + '<span style="flex:1"></span><button class="cp-tab">複製此分頁</button>';
    const show = i => { $('#mCode').textContent = tabs[i][2]; $$('#mTabs [data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === i)); $('#mTabs').dataset.cur = i; };
    $$('#mTabs [data-i]').forEach(b => b.onclick = () => show(+b.dataset.i));
    $('#mTabs .cp-tab').onclick = () => copy(tabs[+$('#mTabs').dataset.cur][2]);
    show(0); syncCards();
    $('#modal').classList.add('open');
    requestAnimationFrame(() => fit($('#modalPv')));
  }
  function closeModal() {
    const pv = $('#modalPv'); clearInterval(pv._iv); demos.forEach(d => { if (d.el === pv) { d.off(); demos.delete(d); } });
    pv.innerHTML = ''; $('#modal').classList.remove('open'); current = null;
  }
  $('#modalClose').onclick = closeModal;
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); openDrawer(false); } });
  new ResizeObserver(() => fit($('#modalPv'))).observe($('#modalPv'));

  /* ---------- 側欄與路由 ---------- */
  function renderSide(active) {
    $('#side').innerHTML = `<a href="#home" class="${active === 'home' ? 'on' : ''}">${svg('home')}總覽</a><a href="#studio" class="${active === 'studio' ? 'on' : ''}">${svg('rocket')}簡報工作室</a><a href="#pick/fonts" class="${active === 'pick' ? 'on' : ''}">${svg('search')}一覽挑選</a><div class="sep">素材分類</div>` +
      CATS.map(c => `<a href="#${c.k}" class="${active === c.k ? 'on' : ''}">${svg(c.ic)}${c.n}<span class="n">${LIB.items[c.k].length}</span></a>`).join('');
  }
  $('#menuBtn').onclick = () => { $('#side').classList.toggle('open'); };
  let groupFilter = '';
  function route() {
    demos.forEach(d => { if (!d.el.closest('#modal')) { d.off(); demos.delete(d); } });
    const h = decodeURIComponent(location.hash.slice(1)) || 'home';
    const q = $('#q').value.trim();
    $('#side').classList.remove('open');
    if (q) { renderSide(''); return renderSearch(q); }
    stopPick();
    if (h.startsWith('pick')) { renderSide('pick'); return renderPick(h.split('/')[1] || 'fonts'); }
    renderSide(h);
    if (h === 'studio') return renderStudio();
    if (CAT[h]) return renderCat(h);
    renderHome();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', () => { groupFilter = ''; $('#q').value = ''; route(); window.scrollTo(0, 0); });
  let qT; $('#q').addEventListener('input', () => { clearTimeout(qT); qT = setTimeout(route, 200); });

  function cardHtml(it) {
    const on = basket.includes(it.id);
    return `<div class="card ${on ? 'in-basket' : ''}" data-id="${it.id}"><div class="pv"></div><div class="meta"><b>${esc(it.name)}</b><code>${it.id}</code><p>${esc(it.desc || '')}</p></div><div class="acts"><button class="btn sm cp">複製給 Claude</button><button class="btn sm add ${on ? 'on' : ''}">${on ? '✓ 已加入' : '＋ 素材籃'}</button></div></div>`;
  }
  function mountCards(root) {
    $$('.card', root).forEach(card => {
      const it = BY_ID[card.dataset.id], pv = card.querySelector('.pv');
      render(it, pv); ro.observe(pv);
      pv.addEventListener('click', () => openModal(it));
      card.querySelector('.cp').onclick = () => copy(promptFor(it));
      card.querySelector('.add').onclick = () => toggleBasket(it.id);
    });
  }
  function renderCat(k) {
    const c = CAT[k], items = LIB.items[k];
    const groups = [...new Set(items.map(i => i.group || (i.tags || [])[0]).filter(Boolean))];
    const list = groupFilter ? items.filter(i => (i.group || (i.tags || [])[0]) === groupFilter) : items;
    $('#view').innerHTML = `<div class="page-head"><div><h1>${c.n} <small class="muted" style="font-size:15px;font-weight:400">${items.length} 個</small></h1><p>${c.d}。點預覽看大圖與程式碼，${c.kind === 'transition' || c.kind === 'anim' ? '滑鼠移上去會播放，' : ''}按「複製給 Claude」直接貼進對話。</p></div></div>` +
      (groups.length > 1 ? `<div class="chips"><button class="chip ${groupFilter ? '' : 'on'}" data-g="">全部</button>${groups.map(g => `<button class="chip ${g === groupFilter ? 'on' : ''}" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>` : '') +
      `<div class="grid ${c.wide ? 'wide' : ''}">${list.map(cardHtml).join('')}</div>`;
    $$('.chip').forEach(b => b.onclick = () => { groupFilter = b.dataset.g; renderCat(k); });
    mountCards($('#view'));
    document.fonts && document.fonts.ready.then(() => $$('.pv').forEach(fit));
  }
  function renderSearch(q) {
    const t = q.toLowerCase();
    const hit = ALL.filter(i => [i.name, i.id, i.desc, i.group, ...(i.tags || []), CAT[i.cat].n, i.family].join(' ').toLowerCase().includes(t));
    $('#view').innerHTML = `<div class="page-head"><div><h1>搜尋「${esc(q)}」</h1><p>找到 ${hit.length} 個素材</p></div></div><div class="grid">${hit.slice(0, 120).map(cardHtml).join('')}</div>`;
    mountCards($('#view'));
  }
  function renderHome() {
    const total = ALL.length;
    $('#view').innerHTML = `<section class="hero"><h1>簡報素材庫</h1><p>共 <b>${CATS.length}</b> 類、<b>${total}</b> 個網頁簡報素材。每個素材都附有預覽和可直接使用的程式碼。按「複製給 Claude」，貼進對話就能請 Claude 幫你做簡報；也可以在「簡報工作室」直接組成一份能播放、能下載的網頁簡報。</p><div class="row"><a class="btn primary" href="#studio">開始做簡報</a><a class="btn" href="#pick/fonts">一覽挑選字型／轉場／動畫</a><a class="btn" href="#templates">瀏覽模板</a><a class="btn" href="#interactive">看互動元件</a></div></section>
      <div class="howto"><div><b>① 挑素材</b><p>在各分類點預覽可以看大圖、程式碼；滑鼠移到轉場和動畫上會自動播放。</p></div><div><b>② 複製或加入素材籃</b><p>單個素材按「複製給 Claude」；想一次用很多個，就先加入素材籃，再一鍵複製全部。</p></div><div><b>③ 貼到對話或工作室</b><p>貼進 Claude 對話說「幫我用這些素材做簡報」，或在工作室用簡單語法直接排版、播放、下載。</p></div></div>
      <h2 class="sec">素材分類</h2><div class="cat-grid">${CATS.map(c => `<a class="cat-card" href="#${c.k}"><i>${svg(c.ic, 22)}</i><div><b>${c.n}<span>${LIB.items[c.k].length} 個</span>${c.isNew ? '<em class="new">新增</em>' : ''}</b><p>${c.d}</p></div></a>`).join('')}</div>`;
  }

  /* ---------- 簡報工作室 ---------- */
  const INSERTABLE = new Set(['textboxes', 'shapes', 'icons', 'charts', 'infographics', 'interactive', 'layouts']);
  const DEFAULT_SRC = `# 健康生活小學堂
## 2026 社區長者講座
講者：王小明　職能治療師
---
# 今天要聊什麼？
- 為什麼要多活動？
- 在家就能做的簡單運動
- 吃得健康又開心
---
!! 30 分鐘 | 每天建議的活動時間
---
# 小測驗
[[ix-ox]]
---
# 一週的運動量
[[ch-bar]]
---
> 活動活動，要活就要動。
---
@bg bg-g-warm
[[ly-thanks]]`;
  const DEF = { tp: 'tp-beige', hf: '', bf: '', pl: '', bg: '', tr: 'tr-fade', an: 'an-fade-up', sx: '', pn: true, title: '我的網頁簡報', src: DEFAULT_SRC };
  const studioState = () => Object.assign({}, DEF, store.get('sal-studio', {}));
  function useInStudio(it) {
    const s = studioState(), map = { templates: 'tp', palettes: 'pl', backgrounds: 'bg', transitions: 'tr', animations: 'an', sounds: 'sx' };
    if (map[it.cat]) s[map[it.cat]] = it.id;
    else if (it.cat === 'fonts') s.hf = it.id;
    else s.src = s.src.trim() + `\n---\n[[${it.id}]]`;
    store.set('sal-studio', s); closeModal(); location.hash = '#studio'; route(); toast('已套用到簡報工作室');
  }

  function parseSlides(src) {
    const used = new Set(), usedTp = new Set(), usedBg = new Set();
    const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/==(.+?)==/g, '<mark>$1</mark>');
    const slides = src.split(/^\s*---\s*$/m).map(chunk => {
      let html = '', ul = null, i = 0, tp = '', bg = '', kinds = { h1: 0, other: 0, p: 0 };
      const A = () => ` class="anim" style="--i:${i++}"`;
      const flush = () => { if (ul) { html += `<ul>${ul.join('')}</ul>`; ul = null; } };
      chunk.split('\n').forEach(raw => {
        const l = raw.trim(); if (!l) return;
        let m;
        if ((m = l.match(/^@tp\s+(\S+)/))) { tp = m[1]; return; }
        if ((m = l.match(/^@bg\s+(\S+)/))) { bg = m[1]; return; }
        if (/^[-*]\s+/.test(l)) { (ul = ul || []).push(`<li${A()}>${inline(l.replace(/^[-*]\s+/, ''))}</li>`); kinds.other++; return; }
        flush();
        if ((m = l.match(/^#\s+(.*)/))) { html += `<h1${A()}>${inline(m[1])}</h1>`; kinds.h1++; }
        else if ((m = l.match(/^##\s+(.*)/))) html += `<h2${A()}>${inline(m[1])}</h2>`;
        else if ((m = l.match(/^>\s*(.*)/))) { html += `<blockquote${A()}>${inline(m[1])}</blockquote>`; kinds.other++; }
        else if ((m = l.match(/^!!\s*([^|]+)\|?\s*(.*)/))) { html += `<div class="bignum anim" style="--i:${i++}"><b>${inline(m[1].trim())}</b><span>${inline(m[2])}</span></div>`; kinds.other++; }
        else if ((m = l.match(/^!\[(.*?)\]\((.+?)\)/))) { html += `<img${A()} alt="${esc(m[1])}" src="${esc(m[2])}">`; kinds.other++; }
        else if ((m = l.match(/^\[\[([\w-]+)\]\]$/))) {
          const it = BY_ID[m[1]];
          if (it && INSERTABLE.has(it.cat)) { used.add(it.id); const cls = it.cat === 'layouts' ? (/position:absolute/.test(it.css) ? 'blk lyt full' : 'blk lyt') : 'blk';
            html += `<div class="anim ${cls}" style="--i:${i++}">${it.html}</div>`; kinds.other++; }
          else html += `<p${A()} style="color:#c0392b">找不到素材 ${esc(m[1])}</p>`;
        }
        else { html += `<p${A()}>${inline(l)}</p>`; kinds.p++; }
      });
      flush();
      if (tp && BY_ID[tp]) usedTp.add(tp); else tp = '';
      if (bg && BY_ID[bg]) usedBg.add(bg); else bg = '';
      const isTitle = kinds.h1 && !kinds.other && kinds.p <= 1;
      return { html, tp, bg, isTitle };
    }).filter(s => s.html);
    return { slides, used, usedTp, usedBg };
  }

  function buildDeck(s, opts = {}) {
    const { slides, used, usedTp, usedBg } = parseSlides(s.src);
    const tp = BY_ID[s.tp] || BY_ID['tp-minimal'];
    usedTp.add(tp.id); if (s.bg && BY_ID[s.bg]) usedBg.add(s.bg);
    const tr = BY_ID[s.tr] || BY_ID['tr-fade'], an = BY_ID[s.an], sx = BY_ID[s.sx], pl = BY_ID[s.pl];
    const hf = BY_ID[s.hf], bf = BY_ID[s.bf];
    const fams = new Set();
    usedTp.forEach(id => BY_ID[id].fonts.forEach(f => fams.add(f)));
    if (hf) fams.add(hf.family); if (bf) fams.add(bf.family);
    const links = [...fams].map(f => LIB.items.fonts.find(x => x.family === f)).filter(Boolean).map(f => f.head).join('\n');
    const css = [
      '*,*::before,*::after{box-sizing:border-box}','html,body{margin:0;height:100%;background:#111;overflow:hidden}',
      `.deck{position:absolute;left:50%;top:50%;width:1280px;height:720px;overflow:hidden;transform:translate(-50%,-50%) scale(var(--scale,1));background:#000;${hf ? `--hf:'${hf.family}',sans-serif;` : ''}${bf ? `--bf:'${bf.family}',sans-serif;` : ''}}`,
      LIB.slideBase, LIB.layoutBase,
      '.slide{display:none}.slide.active{display:flex}',
      '.slide .blk{max-width:100%}.slide .blk:not(.lyt){zoom:1.5;align-self:center}.slide .blk.lyt{align-self:stretch}.slide .blk.full{position:absolute!important;inset:0;z-index:1}.slide .blk.full>*{width:100%;height:100%}',
      ...[...usedTp].map(id => BY_ID[id].css),
      pl ? `.deck .slide{--bg:${pl.colors[0]};--surface:${pl.colors[1]};--accent:${pl.colors[2]};--accent2:${pl.colors[3]};--fg:${pl.colors[4]};--muted:${pl.colors[4]}cc}` : '',
      ...[...usedBg].map(id => { const b = BY_ID[id]; return `.deck .slide.${id}{background:${b.decl}}\n${b.extra.replace(new RegExp('\\.' + id + '\\{', 'g'), `.deck .slide.${id}{`)}`; }),
      tr.css,
      an ? `@keyframes ${an.id}-kf{${an.kf}}\n.slide.play .anim{${an.pre}animation:${an.id}-kf ${an.dur}s ${an.ease} ${an.loop ? 'infinite' : 'both'};animation-delay:${an.loop ? '0s' : 'calc(var(--i) * .16s + .25s)'}}` : '',
      ...[...used].map(id => BY_ID[id].css || ''),
      '.bar{position:fixed;left:0;bottom:0;height:4px;background:var(--bar,#c98b4e);transition:width .3s;z-index:5}',
      '.hint{position:fixed;right:14px;bottom:12px;font:12px system-ui,sans-serif;color:rgba(255,255,255,.45);z-index:5;pointer-events:none}',
      '@media print{html,body{overflow:visible;background:#fff}.deck{position:static;transform:none}.slide{display:flex!important;position:relative;page-break-after:always}.bar,.hint{display:none}}',
    ].filter(Boolean).join('\n');
    const N = slides.length;
    const body = slides.map((sl, i) => `<section class="slide ${sl.tp || tp.id}${sl.bg ? ' ' + sl.bg : (s.bg ? ' ' + s.bg : '')}${sl.isTitle ? ' title-slide' : ''}${i === 0 ? ' active' : ''}">\n${sl.html}${s.pn && i > 0 ? `<div class="pageno">${i + 1} / ${N}</div>` : ''}\n</section>`).join('\n');
    const js = `(function(){var D=document.querySelector('.deck'),S=[].slice.call(document.querySelectorAll('.slide')),cur=0,busy=0,TR=${JSON.stringify(tr.id)},DUR=${Math.round(tr.dur * 1000)},TOP=${tr.outTop ? 1 : 0},bar=document.querySelector('.bar');
${sx ? sx.js + '\n' : ''}function fit(){D.style.setProperty('--scale',Math.min(innerWidth/1280,innerHeight/720))}addEventListener('resize',fit);fit();
function play(sl){sl.classList.remove('play');void sl.offsetWidth;sl.classList.add('play')}
function upd(){bar.style.width=((cur+1)/S.length*100)+'%';if(!window.__start)try{history.replaceState(null,'','#'+(cur+1))}catch(e){}parent!==window&&parent.postMessage({deck:1,cur:cur,n:S.length},'*')}
function go(n){if(n<0||n>=S.length||n===cur||busy)return;var a=S[cur],b=S[n];busy=1;b.classList.add('active',TR+'-in');a.classList.add(TR+'-out');a.style.zIndex=TOP?3:1;b.style.zIndex=TOP?1:3;a.style.display='flex';play(b);${sx ? sx.fn + '();' : ''}cur=n;upd();setTimeout(function(){a.classList.remove('active','play',TR+'-out');a.style.display='';a.style.zIndex='';b.classList.remove(TR+'-in');b.style.zIndex='';busy=0},DUR+30)}
addEventListener('keydown',function(e){var k=e.key;if(/^(ArrowRight|ArrowDown|PageDown| |Enter)$/.test(k)){e.preventDefault();go(cur+1)}else if(/^(ArrowLeft|ArrowUp|PageUp|Backspace)$/.test(k)){e.preventDefault();go(cur-1)}else if(k==='Home')go(0);else if(k==='End')go(S.length-1);else if(k==='f'||k==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()}});
D.addEventListener('click',function(e){if(e.target.closest('button,input,a,label,details,summary,select,textarea,canvas,[class^="ix-"],[class*=" ix-"]'))return;var r=D.getBoundingClientRect();go(e.clientX<r.left+r.width*.25?cur-1:cur+1)});
var tx=0;addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)go(d<0?cur+1:cur-1)});
addEventListener('message',function(e){var m=e.data||{};if(m.go==='next')go(cur+1);else if(m.go==='prev')go(cur-1);else if(typeof m.go==='number')go(m.go)});
var h=window.__start||parseInt(location.hash.slice(1),10);if(h>1&&h<=S.length){S[0].classList.remove('active');cur=h-1;S[cur].classList.add('active')}play(S[cur]);upd();})();`;
    const ixJs = [...used].map(id => BY_ID[id].js).filter(Boolean).join('\n');
    return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(s.title || '網頁簡報')}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${links}
<style>
${css}
</style>
</head>
<body>
<div class="deck">
${body}
</div>
<div class="bar" style="--bar:${tp.accent}"></div>${opts.preview ? '' : '\n<div class="hint">← → 換頁・F 全螢幕</div>'}
<script>
${js}
${ixJs}
<\/script>
</body>
</html>`;
  }

  function renderStudio() {
    const s = studioState();
    const opt = (cat, sel, none) => (none ? `<option value="">${none}</option>` : '') + LIB.items[cat].map(i => `<option value="${i.id}" ${i.id === sel ? 'selected' : ''}>${esc(i.name)}</option>`).join('');
    const grouped = (cat, sel, none) => { const g = {}; LIB.items[cat].forEach(i => (g[i.group] = g[i.group] || []).push(i)); return (none ? `<option value="">${none}</option>` : '') + Object.entries(g).map(([k, arr]) => `<optgroup label="${k}">${arr.map(i => `<option value="${i.id}" ${i.id === sel ? 'selected' : ''}>${esc(i.name)}</option>`).join('')}</optgroup>`).join(''); };
    const ins = [...INSERTABLE].map(k => `<optgroup label="${CAT[k].n}">${LIB.items[k].map(i => `<option value="${i.id}">${esc(i.name)}（${i.id}）</option>`).join('')}</optgroup>`).join('');
    $('#view').innerHTML = `<div class="page-head"><div><h1>簡報工作室</h1><p>選模板、字型、轉場，用簡單的文字語法寫內容，就能播放、下載成網頁簡報，或整份複製給 Claude 繼續加工。</p></div></div>
    <div class="studio">
      <div class="panel">
        <h3>外觀設定</h3>
        <div class="fields">
          <label class="full">簡報名稱<input type="text" id="sTitle" value="${esc(s.title)}"></label>
          <label class="full">簡報模板<select id="sTp">${opt('templates', s.tp)}</select></label>
          <label>標題字型<select id="sHf">${grouped('fonts', s.hf, '模板預設')}</select></label>
          <label>內文字型<select id="sBf">${grouped('fonts', s.bf, '模板預設')}</select></label>
          <label>配色覆寫<select id="sPl">${opt('palettes', s.pl, '使用模板配色')}</select></label>
          <label>背景覆寫<select id="sBg">${grouped('backgrounds', s.bg, '使用模板背景')}</select></label>
          <label>轉場<select id="sTr">${opt('transitions', s.tr)}</select></label>
          <label>元素動畫<select id="sAn">${grouped('animations', s.an, '不使用')}</select></label>
          <label>換頁音效<select id="sSx">${grouped('sounds', s.sx, '不使用')}</select></label>
          <label class="chk" style="align-self:end"><input type="checkbox" id="sPn" ${s.pn ? 'checked' : ''}>顯示頁碼</label>
        </div>
        <textarea id="deckSrc" spellcheck="false">${esc(s.src)}</textarea>
        <div class="fields" style="margin-top:8px"><label class="full">插入素材到游標位置<select id="sIns"><option value="">選擇要插入的元件…</option>${ins}</select></label></div>
        <div class="syntax"><b>語法：</b><code>---</code> 換新頁　<code># 標題</code>　<code>## 副標</code>　<code>- 條列</code>　<code>&gt; 引言</code>　<code>!! 87% | 說明</code> 大數字　<code>![說明](圖片網址)</code>　<code>[[素材ID]]</code> 插入元件　<code>**粗體**</code>　<code>==螢光==</code>　單頁換模板 <code>@tp tp-chalk</code>　單頁換背景 <code>@bg bg-dots</code></div>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" id="sReset">還原範例</button></div>
      </div>
      <div class="stage-wrap">
        <div class="stage"><iframe id="stageFrame" title="簡報預覽"></iframe></div>
        <div class="stage-bar">
          <button class="btn" id="pPrev">← 上一頁</button><span id="pNo" class="muted">1 / 1</span><button class="btn" id="pNext">下一頁 →</button>
          <span class="sp"></span>
          <button class="btn" id="pPlay">▶ 全螢幕播放</button>
          <button class="btn" id="pDl">下載 HTML</button>
          <button class="btn primary" id="pCopy">複製給 Claude</button>
        </div>
        <p class="muted" style="font-size:13px;line-height:1.7">提示：預覽中可以直接點互動元件試玩。下載的 HTML 雙擊就能用瀏覽器播放（方向鍵換頁、F 全螢幕、Ctrl+P 可列印成 PDF）。</p>
      </div>
    </div>`;
    const fields = { title: '#sTitle', tp: '#sTp', hf: '#sHf', bf: '#sBf', pl: '#sPl', bg: '#sBg', tr: '#sTr', an: '#sAn', sx: '#sSx' };
    let cur = 0, t;
    const read = () => { const o = {}; for (const k in fields) o[k] = $(fields[k]).value; o.pn = $('#sPn').checked; o.src = $('#deckSrc').value; return o; };
    const refresh = (keep) => {
      const st = read(); store.set('sal-studio', st);
      const f = $('#stageFrame');
      f.srcdoc = buildDeck(st, { preview: 1 }).replace('<script>', `<script>window.__start=${keep ? cur + 1 : 1};`);
    };
    const later = () => { clearTimeout(t); t = setTimeout(() => refresh(true), 450); };
    Object.values(fields).forEach(sel => $(sel).addEventListener('input', later));
    $('#sPn').addEventListener('change', () => refresh(true));
    $('#deckSrc').addEventListener('input', later);
    $('#sIns').addEventListener('change', e => {
      const id = e.target.value; if (!id) return; const ta = $('#deckSrc'), p = ta.selectionStart;
      const v = ta.value, ins = `\n[[${id}]]\n`; ta.value = v.slice(0, p) + ins + v.slice(p); ta.focus(); ta.selectionStart = ta.selectionEnd = p + ins.length; e.target.value = ''; refresh(true);
    });
    $('#sReset').onclick = () => { if (confirm('還原成範例內容？目前的內容會被取代。')) { store.set('sal-studio', {}); renderStudio(); } };
    window.onmessage = e => { const no = $('#pNo'); if (no && e.data && e.data.deck && e.source === $('#stageFrame').contentWindow) { cur = e.data.cur; no.textContent = `${e.data.cur + 1} / ${e.data.n}`; } };
    const send = m => $('#stageFrame').contentWindow && $('#stageFrame').contentWindow.postMessage(m, '*');
    $('#pPrev').onclick = () => send({ go: 'prev' });
    $('#pNext').onclick = () => send({ go: 'next' });
    $('#pPlay').onclick = () => { const w = window.open(URL.createObjectURL(new Blob([buildDeck(read())], { type: 'text/html' })), '_blank'); if (!w) toast('請允許彈出視窗'); };
    $('#pDl').onclick = () => { const st = read(); download((st.title || '網頁簡報') + '.html', buildDeck(st), 'text/html'); };
    $('#pCopy').onclick = () => {
      const st = read(); const names = k => (BY_ID[st[k]] || {}).name || '（模板預設）';
      const used = [...parseSlides(st.src).used];
      const txt = `請幫我把下面這份網頁簡報做得更完整、更好看（保留單一 HTML 檔、1280×720 投影片、方向鍵換頁）。\n目前設定：模板「${names('tp')}」、標題字型 ${names('hf')}、內文字型 ${names('bf')}、轉場「${names('tr')}」、元素動畫「${st.an ? names('an') : '無'}」${st.sx ? '、換頁音效「' + names('sx') + '」' : ''}。\n使用的元件：${used.length ? used.join('、') : '無'}\n\n以下是完整的 HTML：\n\n\`\`\`html\n${buildDeck(st)}\n\`\`\``;
      copy(txt, '已複製整份簡報，可以貼給 Claude 了');
    };
    refresh(false);
  }


  /* ---------- 一覽挑選（字型／轉場／動畫並排比較） ---------- */
  const PICK_TABS = { fonts: '字型', transitions: '轉場', animations: '元素動畫' };
  const pickState = () => Object.assign({ text: '健康生活小學堂', size: 40, speed: 1, ft: '', tr: '', an: '' }, store.get('sal-pick', {}));
  let pickTimer = 0;
  function stopPick() { clearInterval(pickTimer); pickTimer = 0; }
  function renderPick(tab) {
    if (!PICK_TABS[tab]) tab = 'fonts';
    const ps = pickState();
    const key = { fonts: 'ft', transitions: 'tr', animations: 'an' }[tab];
    const items = LIB.items[tab];
    const groups = [...new Set(items.map(i => i.group || (i.tags || [])[0]).filter(Boolean))];
    const ctl = tab === 'fonts'
      ? `<label class="pk-ctl">示範文字<input type="text" id="pkText" value="${esc(ps.text)}"></label><label class="pk-ctl">字級 <b id="pkSizeV">${ps.size}</b>px<input type="range" id="pkSize" min="20" max="80" value="${ps.size}"></label>`
      : `<label class="pk-ctl">${tab === 'animations' ? '示範文字<input type="text" id="pkText" value="' + esc(ps.text) + '">' : ''}</label><label class="pk-ctl">速度<select id="pkSpeed">${[[1, '正常'], [2, '慢動作 ×2'], [4, '超慢 ×4']].map(([v, n]) => `<option value="${v}" ${+ps.speed === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label><button class="btn" id="pkReplay">↻ 全部重播</button><button class="btn" id="pkPause">❚❚ 暫停</button>`;
    $('#view').innerHTML = `<div class="page-head"><div><h1>一覽挑選</h1><p>同一個畫面看完所有${PICK_TABS[tab]}，${tab === 'fonts' ? '可以換成你自己的文字比較' : '全部同步播放，方便比較'}；點一下卡片就選定，最下方可以套用或複製。</p></div></div>
      <div class="chips pk-tabs">${Object.entries(PICK_TABS).map(([k, n]) => `<a class="chip ${k === tab ? 'on' : ''}" href="#pick/${k}">${n}（${LIB.items[k].length}）</a>`).join('')}</div>
      <div class="pk-bar">${ctl}${groups.length > 1 ? `<select id="pkGroup" class="pk-sel"><option value="">全部分組</option>${groups.map(g => `<option>${esc(g)}</option>`).join('')}</select>` : ''}</div>
      <div class="pk-grid pk-${tab}" id="pkGrid">${items.map((it, n) => pickTile(tab, it, n, ps)).join('')}</div>
      <div class="pk-dock" id="pkDock"></div>`;
    const grid = $('#pkGrid');
    const refreshDock = () => {
      const st = pickState(), f = BY_ID[st.ft], t = BY_ID[st.tr], a = BY_ID[st.an];
      $$('.pk-tile', grid).forEach(el => el.classList.toggle('sel', el.dataset.id === st[key]));
      $('#pkDock').innerHTML = `<div class="pk-picked"><span>字型：<b>${f ? esc(f.name) : '未選'}</b></span><span>轉場：<b>${t ? esc(t.name) : '未選'}</b></span><span>動畫：<b>${a ? esc(a.name) : '未選'}</b></span></div><div class="pk-acts"><button class="btn sm" id="pkClear">清除選擇</button><button class="btn sm" id="pkBasket">加入素材籃</button><button class="btn sm" id="pkCopy">複製給 Claude</button><button class="btn sm primary" id="pkStudio">套用到簡報工作室</button></div>`;
      const chosen = [f, t, a].filter(Boolean);
      $('#pkClear').onclick = () => { store.set('sal-pick', Object.assign(pickState(), { ft: '', tr: '', an: '' })); refreshDock(); };
      $('#pkBasket').onclick = () => { if (!chosen.length) return toast('還沒有選任何項目'); chosen.forEach(it => { if (!basket.includes(it.id)) basket.push(it.id); }); saveBasket(); toast(`已加入 ${chosen.length} 項到素材籃`); };
      $('#pkCopy').onclick = () => chosen.length ? copy(`我選好的簡報風格：\n${chosen.map(it => `- ${CAT[it.cat].n}：${it.name}（${it.id}）`).join('\n')}\n\n` + chosen.map(promptFor).join('\n---\n\n')) : toast('還沒有選任何項目');
      $('#pkStudio').onclick = () => {
        if (!chosen.length) return toast('還沒有選任何項目');
        const s = studioState(); if (f) s.hf = f.id; if (t) s.tr = t.id; if (a) s.an = a.id;
        store.set('sal-studio', s); location.hash = '#studio'; toast('已套用到簡報工作室');
      };
    };
    grid.addEventListener('click', e => {
      const tile = e.target.closest('.pk-tile'); if (!tile) return;
      if (e.target.closest('.pk-more')) return openModal(BY_ID[tile.dataset.id]);
      const st = pickState(); st[key] = st[key] === tile.dataset.id ? '' : tile.dataset.id; store.set('sal-pick', st); refreshDock();
    });
    refreshDock();
    const gsel = $('#pkGroup');
    if (gsel) gsel.onchange = () => $$('.pk-tile', grid).forEach(el => { el.style.display = !gsel.value || el.dataset.g === gsel.value ? '' : 'none'; });
    const txt = $('#pkText');
    if (txt) txt.oninput = () => { store.set('sal-pick', Object.assign(pickState(), { text: txt.value })); $$('.pk-sample', grid).forEach(el => el.textContent = txt.value || '示範文字'); };
    if (tab === 'fonts') {
      const sz = $('#pkSize');
      sz.oninput = () => { grid.style.setProperty('--pk-size', sz.value + 'px'); $('#pkSizeV').textContent = sz.value; store.set('sal-pick', Object.assign(pickState(), { size: +sz.value })); };
      grid.style.setProperty('--pk-size', ps.size + 'px');
      return;
    }
    let speed = +ps.speed || 1, paused = false;
    $('#pkSpeed').onchange = e => { speed = +e.target.value; store.set('sal-pick', Object.assign(pickState(), { speed })); restart(); };
    $('#pkReplay').onclick = () => { paused = false; $('#pkPause').textContent = '❚❚ 暫停'; restart(); };
    $('#pkPause').onclick = () => { paused = !paused; $('#pkPause').textContent = paused ? '▶ 繼續' : '❚❚ 暫停'; if (paused) stopPick(); else restart(); };
    function restart() { stopPick(); tick(); pickTimer = setInterval(tick, (tab === 'transitions' ? 2200 : 2600) * speed); }
    let showB = false;
    function tick() {
      if (tab === 'transitions') {
        $$('.pk-tile', grid).forEach(el => {
          const it = BY_ID[el.dataset.id], stg = el.querySelector('.pk-stage'), d = it.dur * speed;
          const a = stg.querySelector(showB ? '.b' : '.a'), b = stg.querySelector(showB ? '.a' : '.b');
          [a, b].forEach(x => { x.className = x.className.split(' ')[0]; x.style.animationDuration = ''; });
          void stg.offsetWidth;
          a.classList.add(it.id + '-out'); b.classList.add(it.id + '-in');
          a.style.animationDuration = b.style.animationDuration = d + 's';
          a.style.zIndex = it.outTop ? 2 : 1; b.style.zIndex = it.outTop ? 1 : 2;
          clearTimeout(a._t); a._t = setTimeout(() => { a.className = a.className.split(' ')[0]; a.style.zIndex = 0; }, d * 1000 + 30);
        });
        showB = !showB;
      } else {
        $$('.pk-tile', grid).forEach(el => {
          const it = BY_ID[el.dataset.id], node = el.querySelector('.pk-anim');
          if (it.loop && node.classList.contains(it.id)) { node.style.animationDuration = it.dur * speed + 's'; return; }
          node.classList.remove(it.id); void node.offsetWidth; node.classList.add(it.id);
          node.style.animationDuration = it.dur * speed + 's';
        });
      }
    }
    setTimeout(restart, 50);
  }
  function pickTile(tab, it, n, ps) {
    const g = esc(it.group || (it.tags || [])[0] || '');
    const head = `<div class="pk-cap"><span class="pk-no">${String(n + 1).padStart(2, '0')}</span><b>${esc(it.name)}</b><button class="pk-more" title="看程式碼">⋯</button></div>`;
    if (tab === 'fonts') return `<div class="pk-tile" data-id="${it.id}" data-g="${g}"><div class="pk-font ${it.id}"><div class="pk-sample">${esc(ps.text || '示範文字')}</div><div class="pk-en">Aa Bb 0123 簡報</div></div>${head}<small class="pk-desc">${esc(it.group)}・${esc(it.desc)}</small></div>`;
    if (tab === 'transitions') return `<div class="pk-tile" data-id="${it.id}" data-g="${g}"><div class="pk-stage tr-stage"><div class="a"><span>第 1 頁</span><i></i><i></i></div><div class="b"><span>第 2 頁</span><i></i><i></i></div></div>${head}<small class="pk-desc">${esc(it.desc)}・${it.dur} 秒</small></div>`;
    return `<div class="pk-tile" data-id="${it.id}" data-g="${g}"><div class="pk-astage"><div class="pk-anim ${it.loop ? it.id : ''}"><span class="pk-sample">${esc(ps.text || '示範文字')}</span></div></div>${head}<small class="pk-desc">${esc(it.desc)}</small></div>`;
  }

  /* ---------- 啟動 ---------- */
  $('#basketCount').textContent = basket.length; renderBasket();
  route();
  window.LIB_APP = { buildDeck, parseSlides, BY_ID, ALL };
})();
