/* 簡報素材庫 — 主程式 */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const IC = id => (LIB.items.icons.find(i => i.id === 'ic-' + id) || {}).svg || '';
  const svg = (id, s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC(id)}</svg>`;

  /* ---------- 動態字（64 式，來自 kinetic.js） ---------- */
  if (window.WSTK) {
    const GZ = Object.fromEntries(WSTK.groups.map(g => [g.g, g.zh]));
    LIB.items.kinetic = WSTK.list.map(f => ({ id: 'kt-' + f.id, fx: f.id, no: f.no, name: f.zh, en: f.en, group: GZ[f.g], desc: f.desc, use: f.use, words: f.words, scheme: f.scheme, tags: ['動態字', '文字動畫', f.en, f.use] }));
  } else LIB.items.kinetic = [];
  const MOTION_URL = new URL('motion.html', location.href).href;
  const DEF_TEXT = '健康生活小學堂';
  const ktParse = t => String(t || '').split(/[\s,，、;；|\/]+/).map(x => [...x].slice(0, 14).join('')).filter(Boolean).slice(0, 8);
  // 使用者改過示範文字就用他的字，否則用每一式的範例字
  const userText = () => { const t = (pickState().text || '').trim(); return t && t !== DEF_TEXT ? t : ''; };
  const ktWords = it => { const t = userText(); return t ? ktParse(t) : it.words; };

  /* ---------- 類別設定 ---------- */
  const CATS = [
    { k: 'templates', n: '簡報模板', ic: 'image', kind: 'slide', wide: 1, d: '整套配色＋字型＋裝飾的投影片主題' },
    { k: 'fonts', n: '字型', ic: 'book', kind: 'font', d: '繁中、日文、英文 Google Fonts，可直接連結使用' },
    { k: 'palettes', n: '配色方案', ic: 'sun', kind: 'palette', d: '五色一組：底色、輔色、主色、強調、文字' },
    { k: 'backgrounds', n: '背景', ic: 'cloud', kind: 'bg', d: '漸層、圖樣、紙質紋理、會動的背景' },
    { k: 'titleEffects', n: '標題文字效果', ic: 'flag', kind: 'tstyle', wide: 1, d: '陰影、空心、漸層、螢光筆、色塊、手繪底線…' },
    { k: 'bullets', n: '項目符號', ic: 'check', kind: 'tstyle', wide: 1, d: '圓點、勾勾、數字、箭頭、卡片式條列' },
    { k: 'imageStyles', n: '圖片樣式', ic: 'camera', kind: 'tstyle', wide: 1, d: '圓角、圓形、拱形、拍立得、黑白、復古、柔焦' },
    { k: 'layouts', n: '版面配置', ic: 'sliders', kind: 'layout', wide: 1, d: '封面、雙欄、圖文、數據、團隊、感謝頁等排版' },
    { k: 'transitions', n: '轉場', ic: 'arrow-right', kind: 'transition', d: '換頁效果：推移、翻轉、擦拭、圓形展開…' },
    { k: 'animations', n: '畫面動畫', ic: 'play', kind: 'anim', d: '元素進場、強調、循環動畫' },
    { k: 'kinetic', n: '動態字', ic: 'play', kind: 'kinetic', wide: 1, d: '64 種會動的中文字：爆出、蓋章、打字機、霓虹燈、跑馬燈、綜藝字卡…，換成你的字就能用，也能錄成影片' },
    { k: 'easings', n: '動畫節奏', ic: 'trend', kind: 'easing', d: '同一個動作用不同速度曲線：平穩、加速、彈性、回彈' },
    { k: 'sequences', n: '出現順序', ic: 'clock', kind: 'seq', wide: 1, d: '同一頁元素一起出現、逐一出現、點一下出現…' },
    { k: 'textboxes', n: '文字方塊', ic: 'chat', kind: 'block', w: 480, d: '便利貼、對話框、提示框、引言、標籤…' },
    { k: 'shapes', n: '形狀裝飾', ic: 'star', kind: 'block', w: 440, d: '分隔線、色塊、徽章、箭頭、框線、點綴' },
    { k: 'icons', n: '圖示', ic: 'smile', kind: 'icon', d: '線條 SVG 圖示，含醫療、生活、商務' },
    { k: 'charts', n: '圖表元件', ic: 'bar-chart', kind: 'block', w: 520, d: '純 CSS／SVG 圖表：甜甜圈、長條、雷達…' },
    { k: 'infographics', n: '資訊圖塊', ic: 'pie', kind: 'block', w: 640, d: '時間軸、流程、SWOT、心智圖、比較表…' },
    { k: 'interactive', n: '互動元件', ic: 'target', kind: 'ix', w: 480, d: '選擇題、是非題、翻牌、轉盤、計時器…' },
    { k: 'sounds', n: '音效', ic: 'music', kind: 'sound', d: '答對、答錯、掌聲、鼓聲…即時合成免音檔' },
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

  /* ---------- 片段（給 AI／複製用） ---------- */
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
    else if (c === 'titleEffects' || c === 'bullets' || c === 'imageStyles') {
      const what = { titleEffects: '標題 <h1>', bullets: '條列 <ul><li>', imageStyles: '圖片 <img>' }[c];
      s.css = it.css; s.html = { titleEffects: `<section class="slide ${it.id}">\n  <h1>投影片標題</h1>\n</section>`, bullets: `<section class="slide ${it.id}">\n  <ul><li>重點一</li><li>重點二</li><li>重點三</li></ul>\n</section>`, imageStyles: `<section class="slide ${it.id}">\n  <img src="照片網址" alt="說明">\n</section>` }[c];
      s.usage = `在投影片 <section class="slide"> 加上 class「${it.id}」，就會套用到該頁直接層的${what}（需搭配模板的 .slide 基礎樣式與 --accent 變數）。`;
    }
    else if (c === 'easings') { s.css = it.css; s.usage = `速度曲線「${it.name}」：在任何 animation 或 transition 後面寫 ${it.value}，例如 animation: fadeUp .8s ${it.value} both;`; }
    else if (c === 'sequences') { s.js = it.js; s.usage = it.click ? '換頁時先呼叫 sequenceStart(slide)；按「下一頁」時先呼叫 sequenceNext(slide)，回傳 false 才真的換頁。' : `換到投影片時呼叫 applySequence(slide)，每個 class="anim" 的元素會依「${it.name}」錯開出現。`; }
    else if (c === 'kinetic') { s.usage = `在簡報工作室寫一行 [[${it.id}]]，這一頁就會變成整頁的動態字（用這頁的「# 標題」當字）；也可以寫 [[${it.id} 今晚八點 首播]] 指定要動的字。要做成影片素材，到動態字影片素材庫：${MOTION_URL}#${it.fx}`; }
    else if (c === 'sounds') { s.js = it.js; s.usage = `呼叫 ${it.fn}() 就會播放（需在使用者點擊之後才能發聲）。`; }
    else { s.css = it.css || ''; s.html = it.html || ''; s.js = it.js || ''; s.usage = it.js ? '把 CSS、HTML、JS 一起放進簡報即可使用，可重複放多個。' : '把 CSS 放進 <style>，HTML 放進投影片即可。'; }
    return s;
  }
  function promptFor(it) {
    if (it.cat === 'kinetic') return WSTK.prompt(it.fx, ktWords(it), it.scheme, '16:9') + `\n\n（想直接拿影片檔：到「動態字影片素材庫」${MOTION_URL}#${it.fx} 換字、選比例和綠幕後按「錄成影片」。）`;
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
    const c = CAT[it.cat];
    if (el._kt) { ktLive.delete(el._kt); el._kt = null; }
    el.innerHTML = ''; el.className = (big ? 'modal-pv' : 'pv');
    if (c.kind === 'slide' || c.kind === 'layout') {
      el.classList.add('slidepv');
      const inner = c.kind === 'slide'
        ? `<div class="slide ${it.id}"><h1>${esc(userText() || it.name)}</h1><h2>${esc(it.desc)}</h2><ul><li>清楚好讀的重點條列</li><li>主色會用在項目符號與副標</li></ul><div class="pageno">3 / 12</div></div>`
        : `<div class="slide tp-minimal">${it.html}</div>`;
      el.innerHTML = `<div class="slidebox z">${inner}</div>`;
      el.dataset.fit = 'slide';
    } else if (c.kind === 'tstyle' || c.kind === 'seq') {
      el.classList.add('slidepv');
      el.innerHTML = `<div class="slidebox z">${composeSlide({ [{ titleEffects: 'te', bullets: 'bl', imageStyles: 'im', sequences: 'sq' }[it.cat]]: it.id }, { img: it.cat === 'imageStyles', seq: c.kind === 'seq', focus: it.cat === 'titleEffects' ? 'title' : it.cat === 'bullets' ? 'list' : '' })}</div>`;
      el.dataset.fit = 'slide';
      if (c.kind === 'seq') { const rp = () => seqPlay(it, el); el.addEventListener('mouseenter', rp); if (big) { rp(); el._iv = setInterval(rp, 4200); } else setTimeout(rp, 300); }
    } else if (c.kind === 'easing') {
      el.innerHTML = `<div class="ez-demo z">${ezCurve(it)}<div class="ez-track"><i style="animation-timing-function:${it.value}"></i></div><code>${esc(it.value.length > 28 ? it.value.slice(0, 26) + '…)' : it.value)}</code></div>`;
    } else if (c.kind === 'font') {
      el.innerHTML = `<div class="font-pv z ${it.id}"><div class="big">${esc(userText() || '永遠的好朋友')}</div><div class="big" style="font-size:26px">Slide Deck 2026</div><div class="small">${esc(it.family)}</div></div>`;
    } else if (c.kind === 'palette') {
      el.innerHTML = `<div class="pal">${it.colors.map((x, i) => `<i style="background:${x};color:${i === 4 || i === 2 ? it.colors[0] : it.colors[4]}">${x}</i>`).join('')}</div>`;
    } else if (c.kind === 'bg') {
      el.innerHTML = `<div class="${it.id}" style="position:absolute;inset:0"></div>`;
    } else if (c.kind === 'transition') {
      el.innerHTML = `<div class="tr-stage"><div class="a">A</div><div class="b">B</div></div>`;
      startTransitionDemo(it, el);
    } else if (c.kind === 'anim') {
      el.innerHTML = `<div class="an-stage ${it.id} z">${esc(userText() || '重點文字')}</div>`;
      if (!it.loop) startAnimDemo(it, el);
    } else if (c.kind === 'kinetic') {
      el.classList.add('ktpv');
      const host = document.createElement('div'); host.className = 'kt-host'; el.appendChild(host);
      const o = WSTK.mount(host, it.fx, ktWords(it), it.scheme);
      Object.assign(o, { big: !!big, t: 0, off: (+it.no) * .37, vis: true, host });
      if (ktPlaying || big) o.f(big ? 0 : ktClock + o.off);
      el._kt = o; ktLive.add(o); if (!big) ktIO.observe(el);
      return;
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
  /* 依目前選擇組合一張示範投影片：o = { tp, pl, bg, hf, bf, te, bl, im } */
  function composeSlide(o, opt = {}) {
    const tp = o.tp || 'tp-minimal', pl = BY_ID[o.pl], hf = BY_ID[o.hf], bf = BY_ID[o.bf];
    const cls = ['slide', tp, o.bg, o.te, o.bl, o.im, opt.focus === 'title' ? 'title-slide' : ''].filter(Boolean).join(' ');
    let st = '';
    if (pl) st += `--bg:${pl.colors[0]};--surface:${pl.colors[1]};--accent:${pl.colors[2]};--accent2:${pl.colors[3]};--fg:${pl.colors[4]};--muted:${pl.colors[4]}cc;`;
    if (hf) st += `--hf:'${hf.family}',sans-serif;`;
    if (bf) st += `--bf:'${bf.family}',sans-serif;`;
    const t = esc(opt.text || pickState().text || '健康生活小學堂'), q = opt.seq ? ' class="sq-el"' : '';
    if (opt.img) st += 'display:grid;grid-template-columns:1fr auto;align-content:center;column-gap:56px;row-gap:22px;';
    const img = opt.img ? `<img src="${LIB.sampleImg}" alt="範例圖片" style="grid-column:2;grid-row:1/span 2;height:380px;align-self:center">` : '';
    if (opt.focus === 'title') return `<div class="${cls}" style="${st}"><h1 style="font-size:112px">${t}</h1><p style="font-size:34px">副標題・2026 社區講座</p></div>`;
    if (opt.focus === 'list') return `<div class="${cls}" style="${st}"><h2 style="font-size:44px">${t}</h2><ul style="font-size:66px;gap:28px"><li>規律運動</li><li>均衡飲食</li><li>充足睡眠</li></ul></div>`;
    return `<div class="${cls}" style="${st}"><h1${q}>${t}</h1><ul><li${q}>規律運動，每天 30 分鐘</li><li${q}>均衡飲食，少油少鹽</li><li${q}>充足睡眠，作息規律</li></ul>${img}</div>`;
  }
  function seqPlay(it, root, speed = 1, an, ez) {
    const els = $$('.sq-el', root), n = els.length, f = new Function('i', 'n', 'return ' + it.fn);
    const A = an || BY_ID['an-fade-up'];
    els.forEach((e, i) => {
      e.style.animation = 'none'; void e.offsetWidth;
      const d = it.click ? (i === 0 ? .2 : .2 + i * .9) : f(i, n);
      e.style.animation = `${A.id}-kf ${A.dur * speed}s ${ez ? ez.value : A.ease} ${d * speed}s both`;
    });
  }
  function ezCurve(it) {
    const Y = v => (100 - v * 100).toFixed(1);
    let path = '';
    if (it.bz) { const [a, b, c, d] = it.bz; path = `<path d="M0 100 C${a * 100} ${Y(b)} ${c * 100} ${Y(d)} 100 0" />`; }
    else if (it.value.startsWith('linear(')) { const v = it.value.slice(7, -1).split(',').map(Number); path = `<polyline points="${v.map((y, i) => `${(i / (v.length - 1) * 100).toFixed(1)},${Y(y)}`).join(' ')}" />`; }
    else { const n = +it.value.match(/\d+/)[0]; let d = 'M0 100'; for (let i = 0; i < n; i++) d += ` H${(i + 1) / n * 100} V${Y((i + 1) / n)}`; path = `<path d="${d}" />`; }
    return `<svg class="ez-curve" viewBox="-6 -45 112 190"><rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" stroke-opacity=".15"/><g fill="none" stroke="#8a5a32" stroke-width="3.5" stroke-linejoin="round">${path}</g></svg>`;
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

  /* 動態字的動畫時鐘：卡片看得到、沒暫停才跑；大圖一直跑 */
  const ktLive = new Set();
  let ktPlaying = !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches), ktClock = 0, ktLast = performance.now();
  const ktIO = new IntersectionObserver(es => es.forEach(e => { if (e.target._kt) e.target._kt.vis = e.isIntersecting; }), { rootMargin: '120px' });
  (function ktTick(now) {
    const dt = Math.min(.1, Math.max(0, (now - ktLast) / 1000)); ktLast = now;
    if (ktPlaying) ktClock += dt;
    ktLive.forEach(o => {
      if (!o.host.isConnected) { ktLive.delete(o); return; }
      if (o.big) { o.t += dt; o.f(o.t); } else if (ktPlaying && o.vis) o.f(ktClock + o.off);
    });
    requestAnimationFrame(ktTick);
  })(performance.now());
  function setKtPlay(v) {
    ktPlaying = v; if (!v) ktLive.forEach(o => { if (!o.big) o.f(o.poster); });
    const b = $('#ktPlay'); if (b) { b.textContent = v ? '暫停動態' : '播放動態'; b.setAttribute('aria-pressed', v); }
  }

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

  // 把元件放進一張「# 標題」投影片；同名投影片已存在就整張換掉，不會越疊越多
  function withBlockSlide(src, title, ids) {
    const page = `# ${title}\n` + ids.map(id => `[[${id}]]`).join('\n');
    const parts = src.trim().split(/\n---\n/);
    const i = parts.findIndex(p => p.trim().split('\n')[0].trim() === `# ${title}`);
    if (i >= 0) parts[i] = page; else parts.push(page);
    return parts.join('\n---\n');
  }
  /* ---------- 素材籃 ---------- */
  let basket = store.get('sal-basket', []); if (!Array.isArray(basket)) basket = []; basket = [...new Set(basket)].filter(id => BY_ID[id]);
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
    return head + items.map(promptFor).join('\n---\n\n') + '\n\n如果有不清楚或缺少的資訊（例如用途、對象、要放的文字），請先問我，確認後再開始做。';
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
      if (['titleEffects', 'bullets', 'imageStyles', 'easings', 'sequences'].includes(it.cat)) s[STYLE_KEY[it.cat]] = it.id;
    });
    const blocks = basket.filter(id => INSERTABLE.has(BY_ID[id].cat));
    if (!basket.length) return toast('素材籃是空的，先加入一些素材');
    if (blocks.length) s.src = withBlockSlide(s.src, '素材籃的元件', blocks);
    delete s._f; store.set('sal-studio', s); openDrawer(false); location.hash = '#studio'; route(); toast('已套用到簡報工作室');
  };

  /* ---------- 詳細視窗 ---------- */
  let current = null, modalList = [];
  function openModal(it, list) {
    if (list) modalList = list; else if (!modalList.includes(it)) modalList = LIB.items[it.cat];
    current = it; const s = snippet(it);
    render(it, $('#modalPv'), true);
    $('#mName').textContent = it.name; $('#mId').textContent = it.id; $('#mDesc').textContent = it.desc || '';
    const studioable = STYLE_KEY[it.cat] || INSERTABLE.has(it.cat);
    $('#mActs').innerHTML = `<button class="btn primary cp">複製給 AI</button><button class="btn add"></button>${studioable ? '<button class="btn use">用在簡報工作室</button>' : ''}${it.cat === 'sounds' ? '<button class="btn play">▶ 播放</button>' : ''}${it.cat === 'kinetic' ? `<a class="btn" href="motion.html#${it.fx}">錄成影片</a>` : ''}${modalList.length > 1 ? `<span class="m-nav"><button class="btn sm" data-nav="-1" aria-label="上一個">←</button><span class="muted">${modalList.indexOf(it) + 1} / ${modalList.length}</span><button class="btn sm" data-nav="1" aria-label="下一個">→</button></span>` : ''}`;
    $$('#mActs [data-nav]').forEach(b => b.onclick = () => stepModal(+b.dataset.nav));
    $('#mActs .cp').onclick = () => copy(promptFor(it));
    $('#mActs .add').onclick = () => toggleBasket(it.id);
    if (studioable) $('#mActs .use').onclick = () => useInStudio(it);
    if (it.cat === 'sounds') $('#mActs .play').onclick = () => playSound(it);
    const tabs = [['prompt', '給 AI 的提示詞', promptFor(it)]];
    if (s.head) tabs.push(['head', 'HEAD', s.head]);
    if (s.css) tabs.push(['css', 'CSS', s.css]);
    if (s.html) tabs.push(['html', 'HTML', s.html]);
    if (s.js) tabs.push(['js', 'JS', s.js]);
    $('#mTabs').innerHTML = tabs.map((t, i) => `<button class="${i ? '' : 'on'}" data-i="${i}">${t[1]}</button>`).join('') + '<span style="flex:1"></span><button class="cp-tab">複製此分頁</button>';
    const show = i => { $('#mCode').textContent = tabs[i][2]; $$('#mTabs [data-i]').forEach(b => b.classList.toggle('on', +b.dataset.i === i)); $('#mTabs').dataset.cur = i; };
    $$('#mTabs [data-i]').forEach(b => b.onclick = () => show(+b.dataset.i));
    $('#mTabs .cp-tab').onclick = () => copy(tabs[+$('#mTabs').dataset.cur][2]);
    show(0); syncCards();
    if (!$('#modal').classList.contains('open')) lastFocus = document.activeElement;
    $('#modal').classList.add('open');
    requestAnimationFrame(() => { fit($('#modalPv')); $('#modalClose').focus(); });
  }
  function closeModal() {
    const pv = $('#modalPv'); clearInterval(pv._iv); demos.forEach(d => { if (d.el === pv) { d.off(); demos.delete(d); } });
    const was = $('#modal').classList.contains('open');
    pv.innerHTML = ''; $('#modal').classList.remove('open'); current = null;
    if (was && lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }
  function stepModal(d) {
    if (!current || modalList.length < 2) return;
    const i = modalList.indexOf(current); openModal(modalList[(i + d + modalList.length) % modalList.length]);
  }
  document.addEventListener('keydown', e => {
    if (!$('#modal').classList.contains('open') || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName || '') || (e.target.closest && e.target.closest('iframe'))) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepModal(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); stepModal(1); }
  });
  let lastFocus = null;
  $('#modalClose').onclick = closeModal;
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); openDrawer(false); } });
  new ResizeObserver(() => fit($('#modalPv'))).observe($('#modalPv'));

  /* ---------- 側欄與路由 ---------- */
  function renderSide(active) {
    $('#side').innerHTML = `<a href="#home" class="${active === 'home' ? 'on' : ''}">${svg('home')}總覽</a><a href="#studio" class="${active === 'studio' ? 'on' : ''}">${svg('rocket')}簡報工作室</a><a href="#pick/templates" class="${active === 'pick' ? 'on' : ''}">${svg('search')}一覽挑選</a><a href="image.html">${svg('image')}圖片生成素材庫</a><a href="video.html">${svg('play')}影片生成素材庫</a><a href="motion.html">${svg('play')}動態字影片素材庫</a><div class="sep">素材分類</div>` +
      CATS.map(c => `<a href="#${c.k}" class="${active === c.k ? 'on' : ''}">${svg(c.ic)}${c.n}<span class="n">${LIB.items[c.k].length}</span></a>`).join('');
  }
  $('#menuBtn').onclick = () => { $('#side').classList.toggle('open'); };
  let groupFilter = '';
  function route() {
    demos.forEach(d => { if (!d.el.closest('#modal')) { d.off(); demos.delete(d); } });
    let h; try { h = decodeURIComponent(location.hash.slice(1)) || 'home'; } catch (e) { h = 'home'; }
    const q = $('#q').value.trim();
    $('#side').classList.remove('open');
    stopPick();
    if (q) { renderSide(''); return renderSearch(q); }
    if (h.startsWith('pick')) { renderSide('pick'); return renderPick(h.split('/')[1] || 'templates'); }
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
    const no = String(LIB.items[it.cat].indexOf(it) + 1).padStart(2, '0');
    return `<div class="card ${on ? 'in-basket' : ''}" data-id="${it.id}"><div class="pv"></div><div class="meta"><span class="no">${no}</span><b>${esc(it.name)}${it.en ? `<small class="en">${esc(it.en)}</small>` : ''}</b><code>${it.id}</code><p>${esc(it.desc || '')}</p></div><div class="acts"><button class="btn sm cp">複製給 AI</button><button class="btn sm add ${on ? 'on' : ''}">${on ? '✓ 已加入' : '＋ 素材籃'}</button></div></div>`;
  }
  function mountCards(root) {
    $$('.card', root).forEach(card => {
      const it = BY_ID[card.dataset.id], pv = card.querySelector('.pv');
      render(it, pv); ro.observe(pv);
      pv.setAttribute('role', 'button'); pv.tabIndex = 0; pv.setAttribute('aria-label', `看「${it.name}」的大圖與程式碼`);
      const list = () => $$('.card', root).map(c => BY_ID[c.dataset.id]);
      pv.addEventListener('click', () => openModal(it, list()));
      pv.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(it, list()); } });
      card.querySelector('.cp').onclick = () => copy(promptFor(it));
      card.querySelector('.add').onclick = () => toggleBasket(it.id);
    });
  }
  function renderCat(k) {
    const c = CAT[k], items = LIB.items[k];
    const groups = [...new Set(items.map(i => i.group || (i.tags || [])[0]).filter(Boolean))];
    const list = groupFilter ? items.filter(i => (i.group || (i.tags || [])[0]) === groupFilter) : items;
    $('#view').innerHTML = `<div class="page-head"><div><h1>${c.n} <small class="muted" style="font-size:15px;font-weight:400">${items.length} 個</small></h1><p>${c.d}。點預覽看大圖與程式碼，${c.kind === 'transition' || c.kind === 'anim' ? '滑鼠移上去會播放，' : ''}按「複製給 AI」直接貼進 AI 對話。</p></div></div>` +
      ((TEXTY.has(k) || groups.length > 1) ? `<div class="cat-bar">${TEXTY.has(k) ? `<label class="cat-text"><span>你的字</span><input type="text" id="catText" maxlength="60" value="${esc(userText())}" placeholder="${k === 'kinetic' ? '例如：今晚八點 首播 不見不散（用空格分開幾個詞）' : '輸入你的標題，預覽會一起換'}" autocomplete="off"></label><button class="btn sm" id="catTextReset" ${userText() ? '' : 'disabled'}>還原範例字</button>` : ''}${k === 'kinetic' ? `<button class="btn sm" id="ktPlay" aria-pressed="${ktPlaying}">${ktPlaying ? '暫停動態' : '播放動態'}</button><a class="btn sm" href="motion.html">錄成影片 →</a>` : ''}` +
      (groups.length > 1 ? `<div class="chips"><button class="chip ${groupFilter ? '' : 'on'}" data-g="">全部</button>${groups.map(g => `<button class="chip ${g === groupFilter ? 'on' : ''}" data-g="${esc(g)}">${esc(g)}</button>`).join('')}</div>` : '') + `</div>` : '') +
      `<div class="grid ${c.wide ? 'wide' : ''}">${list.map(cardHtml).join('')}</div>`;
    $$('.chip').forEach(b => b.onclick = () => { groupFilter = b.dataset.g; renderCat(k); });
    mountCards($('#view'));
    const ti = $('#catText');
    if (ti) {
      let tt = 0;
      const apply = () => {
        const ps = pickState(); ps.text = ti.value.trim() || DEF_TEXT; savePick(ps);
        $('#catTextReset').disabled = !userText();
        $$('#view .card').forEach(card => { const pv = card.querySelector('.pv'); render(BY_ID[card.dataset.id], pv); });
      };
      ti.addEventListener('input', () => { clearTimeout(tt); tt = setTimeout(apply, 250); });
      $('#catTextReset').onclick = () => { ti.value = ''; apply(); ti.focus(); };
    }
    if ($('#ktPlay')) $('#ktPlay').onclick = () => setKtPlay(!ktPlaying);
    document.fonts && document.fonts.ready.then(() => $$('.pv').forEach(fit));
  }
  const TEXTY = new Set(['templates', 'fonts', 'titleEffects', 'bullets', 'sequences', 'animations', 'kinetic']);
  function renderSearch(q) {
    const t = q.toLowerCase();
    const hit = ALL.filter(i => [i.name, i.id, i.desc, i.group, ...(i.tags || []), CAT[i.cat].n, i.family].join(' ').toLowerCase().includes(t));
    $('#view').innerHTML = `<div class="page-head"><div><h1>搜尋「${esc(q)}」</h1><p>找到 ${hit.length} 個素材</p></div></div><div class="grid">${hit.slice(0, 120).map(cardHtml).join('')}</div>`;
    mountCards($('#view'));
  }
  function renderHome() {
    const total = ALL.length;
    $('#view').innerHTML = `<section class="hero"><h1>簡報素材庫</h1><p>共 <b>${CATS.length}</b> 類、<b>${total}</b> 個網頁簡報素材。每個素材都附有預覽和可直接使用的程式碼。按「複製給 AI」，貼進 ChatGPT、Gemini 或 Claude 的對話，就能請 AI 幫你做簡報；也可以在「簡報工作室」直接組成一份能播放、能下載的網頁簡報。</p><div class="row"><a class="btn primary" href="#studio">開始做簡報</a><a class="btn" href="#pick/templates">一覽挑選所有風格</a><a class="btn" href="image.html">圖片生成素材庫</a><a class="btn" href="video.html">影片生成素材庫</a><a class="btn" href="motion.html">動態字影片素材庫</a><a class="btn" href="#interactive">看互動元件</a></div></section>
      <div class="howto"><div><b>① 挑素材</b><p>在各分類點預覽可以看大圖、程式碼；滑鼠移到轉場和動畫上會自動播放。</p></div><div><b>② 複製或加入素材籃</b><p>單個素材按「複製給 AI」；想一次用很多個，就先加入素材籃，再一鍵複製全部。</p></div><div><b>③ 貼到對話或工作室</b><p>貼進 ChatGPT、Gemini 或 Claude，說「幫我用這些素材做簡報」，或在工作室用簡單語法直接排版、播放、下載。</p></div></div>
      <h2 class="sec">素材分類</h2><div class="cat-grid">${CATS.map(c => `<a class="cat-card" href="#${c.k}"><i>${svg(c.ic, 22)}</i><div><b>${c.n}<span>${LIB.items[c.k].length} 個</span>${c.isNew ? '<em class="new">新增</em>' : ''}</b><p>${c.d}</p></div></a>`).join('')}</div>`;
  }

  /* ---------- 簡報工作室 ---------- */
  const STYLE_KEY = { templates: 'tp', palettes: 'pl', backgrounds: 'bg', fonts: 'hf', titleEffects: 'te', bullets: 'bl', imageStyles: 'im', transitions: 'tr', animations: 'an', easings: 'ez', sequences: 'sq', sounds: 'sx' };
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
  const DEF = { tp: 'tp-beige', hf: '', bf: '', pl: '', bg: '', tr: 'tr-fade', an: 'an-fade-up', sx: '', te: '', bl: '', im: '', ez: '', sq: '', pn: true, title: '我的網頁簡報', src: DEFAULT_SRC };
  const studioState = () => {
    let raw = store.get('sal-studio', {}); if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};
    const o = Object.assign({}, DEF, raw);
    for (const k in DEF) if (typeof o[k] !== typeof DEF[k]) o[k] = DEF[k];   // 型別不對就用預設
    return o;
  };
  function useInStudio(it) {
    const s = studioState();
    if (STYLE_KEY[it.cat]) s[STYLE_KEY[it.cat]] = it.id;
    else s.src = s.src.trim() + `\n---\n[[${it.id}]]`;
    store.set('sal-studio', s); closeModal(); location.hash = '#studio'; route(); toast('已套用到簡報工作室');
  }

  function parseSlides(src) {
    const used = new Set(), usedTp = new Set(), usedBg = new Set();
    const inline = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/==(.+?)==/g, '<mark>$1</mark>');
    let kt = false;
    const slides = src.split(/^\s*---\s*$/m).map(chunk => {
      let html = '', ul = null, i = 0, tp = '', bg = '', kinds = { h1: 0, other: 0, p: 0 }, h1 = '';
      const A = () => ` class="anim" style="--i:${i++}"`;
      const flush = () => { if (ul) { html += `<ul>${ul.join('')}</ul>`; ul = null; } };
      chunk.split('\n').forEach(raw => {
        const l = raw.trim(); if (!l) return;
        let m;
        if ((m = l.match(/^@tp\s+(\S+)/))) { tp = m[1]; return; }
        if ((m = l.match(/^@bg\s+(\S+)/))) { bg = m[1]; return; }
        if (/^[-*]\s+/.test(l)) { (ul = ul || []).push(`<li${A()}>${inline(l.replace(/^[-*]\s+/, ''))}</li>`); kinds.other++; return; }
        flush();
        if ((m = l.match(/^#\s+(.*)/))) { html += `<h1${A()}>${inline(m[1])}</h1>`; kinds.h1++; h1 = h1 || m[1].replace(/\*\*|==/g, ''); }
        else if ((m = l.match(/^##\s+(.*)/))) html += `<h2${A()}>${inline(m[1])}</h2>`;
        else if ((m = l.match(/^>\s*(.*)/))) { html += `<blockquote${A()}>${inline(m[1])}</blockquote>`; kinds.other++; }
        else if ((m = l.match(/^!!\s*([^|]+)\|?\s*(.*)/))) { html += `<div class="bignum anim" style="--i:${i++}"><b>${inline(m[1].trim())}</b><span>${inline(m[2])}</span></div>`; kinds.other++; }
        else if ((m = l.match(/^!\[(.*?)\]\((.+?)\)/))) { html += `<img${A()} alt="${esc(m[1])}" src="${esc(m[2])}">`; kinds.other++; }
        else if ((m = l.match(/^\[\[(kt-[\w]+)(?:\s+(.+?))?\]\]$/)) && BY_ID[m[1]]) {
          const it = BY_ID[m[1]], W = m[2] ? ktParse(m[2]) : (h1 ? ktParse(h1) : it.words);
          kt = true; html += `<div class="kt" data-fx="${it.fx}" data-w="${esc(JSON.stringify(W))}"></div>`; kinds.other++;
        }
        else if ((m = l.match(/^\[\[([\w-]+)\]\]$/))) {
          const it = BY_ID[m[1]];
          if (it && INSERTABLE.has(it.cat)) { used.add(it.id); const cls = it.cat === 'layouts' ? (/position:absolute/.test(it.css) ? 'blk lyt full' : 'blk lyt') : 'blk';
            html += `<div class="anim ${cls}" style="--i:${i++}">${it.html}</div>`; kinds.other++; }
          else html += `<p${A()} style="color:#c0392b">找不到素材 ${esc(m[1])}</p>`;
        }
        else { html += `<p${A()}>${inline(l)}</p>`; kinds.p++; }
      });
      flush();
      if (tp && BY_ID[tp] && BY_ID[tp].cat === 'templates') usedTp.add(tp); else { if (tp) html += `<p${A()} style="color:#c0392b">@tp 後面要放模板 ID（tp- 開頭），「${esc(tp)}」不是模板</p>`; tp = ''; }
      if (bg && BY_ID[bg] && BY_ID[bg].cat === 'backgrounds') usedBg.add(bg); else { if (bg) html += `<p${A()} style="color:#c0392b">@bg 後面要放背景 ID（bg- 開頭），「${esc(bg)}」不是背景</p>`; bg = ''; }
      const isTitle = kinds.h1 && !kinds.other && kinds.p <= 1;
      return { html, tp, bg, isTitle };
    }).filter(s => s.html);
    return { slides, used, usedTp, usedBg, kt };
  }

  function buildDeck(s, opts = {}) {
    const { slides, used, usedTp, usedBg, kt } = parseSlides(s.src);
    const tp = (BY_ID[s.tp] && BY_ID[s.tp].cat === 'templates') ? BY_ID[s.tp] : BY_ID['tp-minimal'];
    if (s.bg && !(BY_ID[s.bg] && BY_ID[s.bg].cat === 'backgrounds')) s = Object.assign({}, s, { bg: '' });
    usedTp.add(tp.id); if (s.bg) usedBg.add(s.bg);
    const tr = BY_ID[s.tr] || BY_ID['tr-fade'], an = BY_ID[s.an], sx = BY_ID[s.sx], pl = BY_ID[s.pl];
    const te = BY_ID[s.te], bl = BY_ID[s.bl], im = BY_ID[s.im], ez = BY_ID[s.ez], sq = BY_ID[s.sq] || BY_ID['sq-stagger'];
    const extraCls = [te, bl, im].filter(Boolean).map(x => ' ' + x.id).join('');
    const hf = BY_ID[s.hf], bf = BY_ID[s.bf];
    const fams = new Set();
    usedTp.forEach(id => BY_ID[id].fonts.forEach(f => fams.add(f)));
    if (hf) fams.add(hf.family); if (bf) fams.add(bf.family);
    const links = [...fams].map(f => LIB.items.fonts.find(x => x.family === f)).filter(Boolean).map(f => f.head).join('\n') + (kt && window.WSTK ? '\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Noto+Sans+TC:wght@700;900&family=Noto+Serif+TC:wght@700;900&display=swap">' : '');
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
      ...[te, bl, im].filter(Boolean).map(x => x.css),
      an ? `@keyframes ${an.id}-kf{${an.kf}}\n.slide.play .anim{${an.pre}animation:${an.id}-kf ${an.dur}s ${ez ? ez.value : an.ease} ${an.loop ? 'infinite' : 'both'};animation-delay:${an.loop ? '0s' : 'var(--d,0s)'}}` : '',
      '.slide .anim.wait{visibility:hidden!important;animation:none!important}',
      kt ? '.slide>.kt{position:absolute;inset:0;z-index:2;--ac:var(--accent);--on-ac:var(--bg)}' : '',
      ...[...used].map(id => BY_ID[id].css || ''),
      '.bar{position:fixed;left:0;bottom:0;height:4px;background:var(--bar,#c98b4e);transition:width .3s;z-index:5}',
      '.hint{position:fixed;right:14px;bottom:12px;font:12px system-ui,sans-serif;color:rgba(255,255,255,.45);z-index:5;pointer-events:none}',
      '@page{size:1280px 720px;margin:0}',
      '@media print{html,body{overflow:visible;height:auto;background:#fff}.deck{position:static;transform:none;width:1280px;height:auto;overflow:visible}.slide{display:flex!important;position:relative;width:1280px;height:720px;break-after:page;page-break-after:always;animation:none!important;opacity:1!important;transform:none!important}.slide .anim,.slide .anim.wait{visibility:visible!important;animation:none!important;opacity:1!important;transform:none!important}.pageno{display:block}.bar,.hint{display:none}}',
    ].filter(Boolean).join('\n');
    const N = slides.length;
    const body = slides.map((sl, i) => `<section class="slide ${sl.tp || tp.id}${extraCls}${sl.bg ? ' ' + sl.bg : (s.bg ? ' ' + s.bg : '')}${sl.isTitle ? ' title-slide' : ''}${i === 0 ? ' active' : ''}">\n${sl.html}${s.pn && i > 0 ? `<div class="pageno">${i + 1} / ${N}</div>` : ''}\n</section>`).join('\n');
    const js = `(function(){var D=document.querySelector('.deck'),S=[].slice.call(document.querySelectorAll('.slide')),cur=0,busy=0,TR=${JSON.stringify(tr.id)},DUR=${Math.round(tr.dur * 1000)},TOP=${tr.outTop ? 1 : 0},bar=document.querySelector('.bar');
${sx ? sx.js + '\n' : ''}function fit(){D.style.setProperty('--scale',Math.min(innerWidth/1280,innerHeight/720))}addEventListener('resize',fit);fit();
var CLICK=${sq.click ? 1 : 0};function SEQ(i,n){return ${sq.fn}}
function play(sl){sl.classList.remove('play');var A=[].slice.call(sl.querySelectorAll('.anim')),n=A.length;A.forEach(function(e,i){e.style.setProperty('--d',SEQ(i,n)+'s');e.classList.toggle('wait',!!CLICK&&i>0)});void sl.offsetWidth;sl.classList.add('play')}
function reveal(){var w=S[cur].querySelector('.anim.wait');if(!w)return false;w.style.setProperty('--d','0s');w.classList.remove('wait');return true}
function upd(){bar.style.width=((cur+1)/S.length*100)+'%';if(!window.__start)try{history.replaceState(null,'','#'+(cur+1))}catch(e){}parent!==window&&parent.postMessage({deck:1,cur:cur,n:S.length},'*')}
function go(n){if(CLICK&&n===cur+1&&!busy&&reveal())return;if(n<0||n>=S.length||n===cur||busy)return;var a=S[cur],b=S[n];busy=1;b.classList.add('active',TR+'-in');a.classList.add(TR+'-out');a.style.zIndex=TOP?3:1;b.style.zIndex=TOP?1:3;a.style.display='flex';play(b);${sx ? sx.fn + '();' : ''}cur=n;upd();setTimeout(function(){a.classList.remove('active','play',TR+'-out');a.style.display='';a.style.zIndex='';b.classList.remove(TR+'-in');b.style.zIndex='';busy=0},DUR+30)}
addEventListener('keydown',function(e){var k=e.key;if(e.target.closest&&e.target.closest('input,button,select,textarea,[contenteditable],[class^="ix-"] [tabindex],[role="slider"]')&&k!=='Escape'&&k!=='PageDown'&&k!=='PageUp')return;if(/^(ArrowRight|ArrowDown|PageDown| |Enter)$/.test(k)){e.preventDefault();go(cur+1)}else if(/^(ArrowLeft|ArrowUp|PageUp|Backspace)$/.test(k)){e.preventDefault();go(cur-1)}else if(k==='Home')go(0);else if(k==='End')go(S.length-1);else if(k==='f'||k==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()}});
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
${kt && window.WSTK ? `(${WSTK.rt.toString()})();` : ''}
<\/script>
</body>
</html>`;
  }

  function renderStudio() {
    const s = studioState();
    const opt = (cat, sel, none) => (none ? `<option value="">${none}</option>` : '') + LIB.items[cat].map(i => `<option value="${i.id}" ${i.id === sel ? 'selected' : ''}>${esc(i.name)}</option>`).join('');
    const grouped = (cat, sel, none) => { const g = {}; LIB.items[cat].forEach(i => (g[i.group] = g[i.group] || []).push(i)); return (none ? `<option value="">${none}</option>` : '') + Object.entries(g).map(([k, arr]) => `<optgroup label="${k}">${arr.map(i => `<option value="${i.id}" ${i.id === sel ? 'selected' : ''}>${esc(i.name)}</option>`).join('')}</optgroup>`).join(''); };
    const ins = [...INSERTABLE].map(k => `<optgroup label="${CAT[k].n}">${LIB.items[k].map(i => `<option value="${i.id}">${esc(i.name)}（${i.id}）</option>`).join('')}</optgroup>`).join('') + (LIB.items.kinetic.length ? `<optgroup label="動態字（整頁，用這頁的 # 標題當字）">${LIB.items.kinetic.map(i => `<option value="${i.id}">${i.no} ${esc(i.name)}（${i.id}）</option>`).join('')}</optgroup>` : '');
    $('#view').innerHTML = `<div class="page-head"><div><h1>簡報工作室</h1><p>選模板、字型、轉場，用簡單的文字語法寫內容，就能播放、下載成網頁簡報，或整份複製給 AI（ChatGPT、Gemini、Claude）繼續加工。</p></div></div>
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
          <label>標題文字效果<select id="sTe">${opt('titleEffects', s.te, '模板預設')}</select></label>
          <label>項目符號<select id="sBl">${opt('bullets', s.bl, '模板預設')}</select></label>
          <label>圖片樣式<select id="sIm">${opt('imageStyles', s.im, '模板預設')}</select></label>
          <label>動畫節奏<select id="sEz">${opt('easings', s.ez, '動畫預設')}</select></label>
          <label>出現順序<select id="sSq">${opt('sequences', s.sq, '逐一出現（預設）')}</select></label>
          <label>換頁音效<select id="sSx">${grouped('sounds', s.sx, '不使用')}</select></label>
          <label class="chk" style="align-self:end"><input type="checkbox" id="sPn" ${s.pn ? 'checked' : ''}>顯示頁碼</label>
        </div>
        <textarea id="deckSrc" spellcheck="false">${esc(s.src)}</textarea>
        <div class="fields" style="margin-top:8px"><label class="full">插入素材到游標位置<select id="sIns"><option value="">選擇要插入的元件…</option>${ins}</select></label></div>
        <div class="syntax"><b>語法：</b><code>---</code> 換新頁　<code># 標題</code>　<code>## 副標</code>　<code>- 條列</code>　<code>&gt; 引言</code>　<code>!! 87% | 說明</code> 大數字　<code>![說明](圖片網址)</code>　<code>[[素材ID]]</code> 插入元件　<code>[[kt-burst]]</code> 整頁動態字　<code>**粗體**</code>　<code>==螢光==</code>　單頁換模板 <code>@tp tp-chalk</code>　單頁換背景 <code>@bg bg-dots</code></div>
        <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" id="sReset">還原範例</button></div>
      </div>
      <div class="stage-wrap">
        <div class="stage"><iframe id="stageFrame" title="簡報預覽"></iframe></div>
        <div class="stage-bar">
          <button class="btn" id="pPrev">← 上一頁</button><span id="pNo" class="muted">1 / 1</span><button class="btn" id="pNext">下一頁 →</button>
          <span class="sp"></span>
          <button class="btn" id="pPlay">▶ 全螢幕播放</button>
          <button class="btn" id="pDl">下載 HTML</button>
          <button class="btn primary" id="pCopy">複製給 AI</button>
        </div>
        <p class="muted" style="font-size:13px;line-height:1.7">提示：預覽中可以直接點互動元件試玩。下載的 HTML 雙擊就能用瀏覽器播放（方向鍵換頁、F 全螢幕、Ctrl+P 可列印成 PDF）。</p>
      </div>
    </div>`;
    const fields = { title: '#sTitle', tp: '#sTp', hf: '#sHf', bf: '#sBf', pl: '#sPl', bg: '#sBg', tr: '#sTr', an: '#sAn', sx: '#sSx', te: '#sTe', bl: '#sBl', im: '#sIm', ez: '#sEz', sq: '#sSq' };
    let cur = 0, t;
    const read = () => { if (!$('#deckSrc')) return null; const o = {}; for (const k in fields) o[k] = $(fields[k]).value; o.pn = $('#sPn').checked; o.src = $('#deckSrc').value; return o; };
    const saveNow = () => { const o = read(); if (o) store.set('sal-studio', o); };
    const refresh = (keep) => {
      const st = read(); if (!st) return; store.set('sal-studio', st);
      const f = $('#stageFrame');
      f.srcdoc = buildDeck(st, { preview: 1 }).replace('<script>', `<script>window.__start=${keep ? cur + 1 : 1};`);
    };
    const later = () => { saveNow(); clearTimeout(t); t = setTimeout(() => refresh(true), 450); };
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
      const txt = `請幫我把下面這份網頁簡報做得更完整、更好看（保留單一 HTML 檔、1280×720 投影片、方向鍵換頁）。\n目前設定：模板「${names('tp')}」、標題字型 ${names('hf')}、內文字型 ${names('bf')}、轉場「${names('tr')}」、元素動畫「${st.an ? names('an') : '無'}」${st.sx ? '、換頁音效「' + names('sx') + '」' : ''}。\n使用的元件：${used.length ? used.join('、') : '無'}\n\n以下是完整的 HTML：\n\n\`\`\`html\n${buildDeck(st)}\n\`\`\`\n\n如果有不清楚或缺少的資訊（例如用途、對象、要放的文字），請先問我，確認後再開始做。`;
      copy(txt, '已複製整份簡報，可以貼給 ChatGPT、Gemini 或 Claude 了');
    };
    refresh(false);
  }


  /* ---------- 一覽挑選（每一類都能並排比較、點選） ---------- */
  const PICK_STYLE = ['templates', 'palettes', 'backgrounds', 'fonts', 'titleEffects', 'bullets', 'imageStyles', 'transitions', 'animations', 'easings', 'sequences', 'sounds'];
  const PICK_COMP = ['layouts', 'textboxes', 'shapes', 'icons', 'charts', 'infographics', 'interactive'];
  const PICK_NAME = k => k === 'fonts' ? '標題字型' : k === 'sounds' ? '換頁音效' : CAT[k].n;
  const MOTION = new Set(['transitions', 'animations', 'easings', 'sequences']);
  const SLIDEY = new Set(['templates', 'palettes', 'backgrounds', 'titleEffects', 'bullets', 'imageStyles', 'sequences']);
  function pickState() {
    let raw = store.get('sal-pick', {}); if (!raw || typeof raw !== 'object' || Array.isArray(raw)) raw = {};
    const p = Object.assign({ text: '健康生活小學堂', size: 40, speed: 1, sel: {}, multi: [] }, raw);
    if (!p.sel || typeof p.sel !== 'object' || Array.isArray(p.sel)) p.sel = {};
    if (!Array.isArray(p.multi)) p.multi = [];
    if (typeof p.text !== 'string') p.text = '健康生活小學堂';
    if (p.ft || p.tr || p.an) { p.sel = Object.assign({ hf: p.ft || '', tr: p.tr || '', an: p.an || '' }, p.sel); delete p.ft; delete p.tr; delete p.an; }
    p.multi = (p.multi || []).filter(id => BY_ID[id]);
    return p;
  }
  const savePick = p => store.set('sal-pick', p);
  let pickTimer = 0;
  function stopPick() { clearInterval(pickTimer); pickTimer = 0; }

  function renderPick(tab) {
    if (!CAT[tab] || !(PICK_STYLE.includes(tab) || PICK_COMP.includes(tab))) tab = 'templates';
    const ps = pickState(), multi = PICK_COMP.includes(tab), key = STYLE_KEY[tab];
    const items = LIB.items[tab];
    const groups = [...new Set(items.map(i => i.group || (i.tags || [])[0]).filter(Boolean))];
    const chip = k => `<a class="chip ${k === tab ? 'on' : ''}" href="#pick/${k}">${PICK_NAME(k)}<em>${LIB.items[k].length}</em>${(STYLE_KEY[k] && PICK_STYLE.includes(k) && ps.sel[STYLE_KEY[k]]) || (PICK_COMP.includes(k) && ps.multi.some(id => BY_ID[id].cat === k)) ? '<i class="dot"></i>' : ''}</a>`;
    const usesText = tab === 'fonts' || tab === 'animations' || SLIDEY.has(tab);
    const ctl = [
      usesText ? `<label class="pk-ctl">示範文字<input type="text" id="pkText" value="${esc(ps.text)}"></label>` : '',
      tab === 'fonts' ? `<label class="pk-ctl">字級 <b id="pkSizeV">${ps.size}</b>px<input type="range" id="pkSize" min="20" max="80" value="${ps.size}"></label>` : '',
      MOTION.has(tab) ? `<label class="pk-ctl">速度<select id="pkSpeed">${[[1, '正常'], [2, '慢動作 ×2'], [4, '超慢 ×4']].map(([v, n]) => `<option value="${v}" ${+ps.speed === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label><button class="btn sm" id="pkReplay">↻ 全部重播</button><button class="btn sm" id="pkPause">❚❚ 暫停</button>` : '',
      groups.length > 1 ? `<select id="pkGroup" class="pk-sel"><option value="">全部分組</option>${groups.map(g => `<option>${esc(g)}</option>`).join('')}</select>` : '',
    ].join('');
    const hint = multi ? '元件可以複選，選好的會一起加到簡報裡。' : SLIDEY.has(tab) ? '示範投影片會套用你在其他分頁已選的模板、配色、字型等，所見即所得。' : '每一類選一個，點同一張可以取消。';
    $('#view').innerHTML = `<div class="page-head"><div><h1>一覽挑選</h1><p>同一個畫面看完同類的所有選項，點一下就選定。${hint}</p></div></div>
      <div class="pk-tabrow"><span>風格（每類選一個）</span><div class="chips pk-tabs">${PICK_STYLE.map(chip).join('')}</div></div>
      <div class="pk-tabrow"><span>元件（可複選）</span><div class="chips pk-tabs">${PICK_COMP.map(chip).join('')}</div></div>
      <div class="pk-bar">${ctl || `<span class="muted" style="font-size:13px">${esc(CAT[tab].d)}</span>`}</div>
      <div class="pk-grid pk-${tab}" id="pkGrid">${items.map((it, n) => pickTile(tab, it, n, ps)).join('')}</div>
      <div class="pk-dock" id="pkDock"></div>`;
    const grid = $('#pkGrid');
    grid.style.setProperty('--pk-size', ps.size + 'px');
    grid.style.setProperty('--pk-speed', ps.speed || 1);
    mountPickTiles(tab, grid, ps);

    const refreshDock = () => {
      const st = pickState();
      $$('.pk-tile', grid).forEach(el => { const on = multi ? st.multi.includes(el.dataset.id) : st.sel[key] === el.dataset.id; el.classList.toggle('sel', on); el.setAttribute('aria-pressed', on); });
      const styleChips = PICK_STYLE.filter(k => st.sel[STYLE_KEY[k]] && BY_ID[st.sel[STYLE_KEY[k]]]).map(k => `<span class="pk-pill" data-k="${STYLE_KEY[k]}">${PICK_NAME(k)}：<b>${esc(BY_ID[st.sel[STYLE_KEY[k]]].name)}</b><button aria-label="移除">✕</button></span>`).join('');
      const comps = st.multi.length ? `<span class="pk-pill" data-k="__multi">元件 <b>${st.multi.length}</b> 個<button aria-label="清除元件">✕</button></span>` : '';
      $('#pkDock').innerHTML = `<div class="pk-picked">${styleChips + comps || '<span class="muted">還沒有選任何項目，點上方卡片開始挑選</span>'}</div><div class="pk-acts"><button class="btn sm" id="pkClear">全部清除</button><button class="btn sm" id="pkBasket">加入素材籃</button><button class="btn sm" id="pkCopy">複製給 AI</button><button class="btn sm primary" id="pkStudio">套用到簡報工作室</button></div>`;
      const chosen = () => { const s2 = pickState(); return [...PICK_STYLE.map(k => BY_ID[s2.sel[STYLE_KEY[k]]]).filter(Boolean), ...s2.multi.map(id => BY_ID[id])]; };
      $$('.pk-pill button', $('#pkDock')).forEach(b => b.onclick = () => { const s2 = pickState(), k = b.parentNode.dataset.k; if (k === '__multi') s2.multi = []; else delete s2.sel[k]; savePick(s2); refreshDock(); });
      $('#pkClear').onclick = () => { const s2 = pickState(); s2.sel = {}; s2.multi = []; savePick(s2); refreshDock(); };
      $('#pkBasket').onclick = () => { const c = chosen(); if (!c.length) return toast('還沒有選任何項目'); c.forEach(it => { if (!basket.includes(it.id)) basket.push(it.id); }); saveBasket(); toast(`已加入 ${c.length} 項到素材籃`); };
      $('#pkCopy').onclick = () => { const c = chosen(); if (!c.length) return toast('還沒有選任何項目'); copy(`我選好的簡報風格與元件：\n${c.map(it => `- ${CAT[it.cat].n}：${it.name}（${it.id}）`).join('\n')}\n\n` + c.map(promptFor).join('\n---\n\n')); };
      $('#pkStudio').onclick = () => {
        const s2 = pickState(), c = chosen(); if (!c.length) return toast('還沒有選任何項目');
        const sd = studioState(); Object.entries(s2.sel).forEach(([k, v]) => { if (v && BY_ID[v]) sd[k] = v; });
        if (s2.multi.length) sd.src = withBlockSlide(sd.src, '挑選的元件', s2.multi);
        store.set('sal-studio', sd); location.hash = '#studio'; toast('已套用到簡報工作室');
      };
    };
    grid.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('pk-tile')) { e.preventDefault(); e.target.click(); } });
    grid.addEventListener('click', e => {
      const tile = e.target.closest('.pk-tile'); if (!tile) return;
      if (e.target.closest('.pk-more')) return openModal(BY_ID[tile.dataset.id]);
      if (e.target.closest('.pk-play')) return playSound(BY_ID[tile.dataset.id]);
      if (tab === 'interactive' && e.target.closest('iframe')) return;
      const st = pickState(), id = tile.dataset.id;
      if (multi) { const i = st.multi.indexOf(id); i >= 0 ? st.multi.splice(i, 1) : st.multi.push(id); }
      else st.sel[key] = st.sel[key] === id ? '' : id;
      savePick(st); refreshDock();
      $$('.pk-tabs .chip.on').forEach(c => c.querySelector('.dot') || c.insertAdjacentHTML('beforeend', '<i class="dot"></i>'));
    });
    refreshDock();

    const gsel = $('#pkGroup');
    if (gsel) gsel.onchange = () => $$('.pk-tile', grid).forEach(el => { el.style.display = !gsel.value || el.dataset.g === gsel.value ? '' : 'none'; });
    const txt = $('#pkText');
    if (txt) txt.oninput = () => {
      const st = pickState(); st.text = txt.value; savePick(st);
      $$('.pk-sample', grid).forEach(el => el.textContent = txt.value || '示範文字');
      $$('.slide>h1,.slide>h2', grid).forEach(el => el.textContent = txt.value || '示範文字');
    };
    const sz = $('#pkSize');
    if (sz) sz.oninput = () => { grid.style.setProperty('--pk-size', sz.value + 'px'); $('#pkSizeV').textContent = sz.value; const st = pickState(); st.size = +sz.value; savePick(st); };
    if (!MOTION.has(tab)) return;
    let speed = +ps.speed || 1, paused = false, showB = false;
    const restart = () => { stopPick(); tick(); pickTimer = setInterval(tick, (tab === 'sequences' ? 4200 : tab === 'transitions' ? 2200 : 2600) * speed); };
    $('#pkSpeed').onchange = e => { speed = +e.target.value; grid.style.setProperty('--pk-speed', speed); const st = pickState(); st.speed = speed; savePick(st); restart(); };
    $('#pkReplay').onclick = () => { paused = false; $('#pkPause').textContent = '❚❚ 暫停'; grid.classList.remove('paused'); restart(); };
    $('#pkPause').onclick = () => { paused = !paused; $('#pkPause').textContent = paused ? '▶ 繼續' : '❚❚ 暫停'; grid.classList.toggle('paused', paused); paused ? stopPick() : restart(); };
    const selAn = BY_ID[ps.sel.an], selEz = BY_ID[ps.sel.ez];
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
      } else if (tab === 'animations') {
        $$('.pk-tile', grid).forEach(el => {
          const it = BY_ID[el.dataset.id], node = el.querySelector('.pk-anim');
          if (!(it.loop && node.classList.contains(it.id))) { node.classList.remove(it.id); void node.offsetWidth; node.classList.add(it.id); }
          node.style.animationDuration = it.dur * speed + 's';
          if (selEz) node.style.animationTimingFunction = selEz.value;
        });
      } else if (tab === 'sequences') {
        $$('.pk-tile', grid).forEach(el => seqPlay(BY_ID[el.dataset.id], el, speed, selAn && !selAn.loop ? selAn : null, selEz));
      } else if (tab === 'easings') {
        $$('.ez-track i', grid).forEach(i => { i.style.animation = 'none'; void i.offsetWidth; i.style.animation = ''; });
      }
    }
    setTimeout(restart, 50);
  }

  function pickTile(tab, it, n, ps) {
    const g = esc(it.group || (it.tags || [])[0] || '');
    const cap = `<div class="pk-cap"><span class="pk-no">${String(n + 1).padStart(2, '0')}</span><b>${esc(it.name)}</b>${tab === 'sounds' ? '<button class="pk-play" title="播放">▶</button>' : ''}<button class="pk-more" title="看程式碼">⋯</button></div><small class="pk-desc">${esc(it.desc || '')}</small>`;
    let body;
    if (tab === 'fonts') body = `<div class="pk-font ${it.id}"><div class="pk-sample">${esc(ps.text || '示範文字')}</div><div class="pk-en">Aa Bb 0123 簡報</div></div>`;
    else if (tab === 'transitions') body = `<div class="pk-stage tr-stage"><div class="a"><span>第 1 頁</span><i></i><i></i></div><div class="b"><span>第 2 頁</span><i></i><i></i></div></div>`;
    else if (tab === 'animations') body = `<div class="pk-astage"><div class="pk-anim ${it.loop ? it.id : ''}"><span class="pk-sample">${esc(ps.text || '示範文字')}</span></div></div>`;
    else if (tab === 'sounds') body = `<div class="pk-snd"><button class="pk-play" aria-label="播放 ${esc(it.name)}">▶</button></div>`;
    else body = `<div class="pk-pv"></div>`;
    return `<div class="pk-tile" data-id="${it.id}" data-g="${g}" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(it.name)}">${body}${cap}</div>`;
  }
  function mountPickTiles(tab, grid, ps) {
    $$('.pk-pv', grid).forEach(pv => {
      const tile = pv.closest('.pk-tile'), it = BY_ID[tile.dataset.id];
      if (SLIDEY.has(tab)) {
        const o = Object.assign({}, ps.sel, { [STYLE_KEY[tab]]: it.id });
        if (tab === 'sequences') delete o.sq;
        pv.className = 'pv slidepv';
        pv.dataset.fit = 'slide';
        pv.innerHTML = `<div class="slidebox z">${composeSlide(o, { img: tab === 'imageStyles', seq: tab === 'sequences', text: ps.text, focus: tab === 'titleEffects' ? 'title' : tab === 'bullets' ? 'list' : '' })}</div>`;
        requestAnimationFrame(() => fit(pv));
      } else {
        render(it, pv);
      }
      ro.observe(pv);
    });
  }

  /* ---------- 啟動 ---------- */
  $('#basketCount').textContent = basket.length; renderBasket();
  route();
  window.LIB_APP = { buildDeck, parseSlides, BY_ID, ALL };
})();
