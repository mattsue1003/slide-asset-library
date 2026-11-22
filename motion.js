/* 動態字影片素材庫：64 式即時預覽、換字、放大、錄成影片 */
(function () {
  'use strict';
  const K = window.WSTK;
  const $ = id => document.getElementById(id);
  const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const cs = s => Array.from(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } },
  };
  const toast = msg => { const t = $('toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1800); };
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('已複製，可以貼給 AI 了'); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('已複製'); }
  }

  const SCHEMES = [['ink', '墨黑', '#14161b'], ['paper', '紙白', '#f4f5f7'], ['cobalt', '鈷藍', '#2340ff'], ['verm', '朱紅', '#ff4d2e'], ['key', '綠幕', '#00b140']];
  const SCH_NAME = Object.fromEntries(SCHEMES.map(s => [s[0], s[1]]));
  const RAW = 'https://raw.githubusercontent.com/pound0423/claude-animated-text/main/';
  const gIndex = Object.fromEntries(K.groups.map((g, i) => [g.g, i]));
  const mp4Of = fx => RAW + encodeURI(`mp4/${gIndex[fx.g] + 1}_${K.groups[gIndex[fx.g]].zh.replace(/\s/g, '')}/${fx.no}_${fx.zh}_${fx.en.replace(/ /g, '-')}.mp4`);
  const LIST = K.list;

  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let playing = !reduce, custom = [], group = 'all';
  const parse = s => s.split(/[\s,，、;；|\/]+/).map(x => cs(x).slice(0, 14).join('')).filter(Boolean).slice(0, 8);
  const wordsFor = fx => custom.length ? custom : fx.words;

  /* ---------- 動畫時鐘：卡片只在看得到、沒暫停時跑；放大檢視一直跑 ---------- */
  const live = new Set(), byEl = new Map();
  let last = performance.now(), clock = 0;
  function tick(now) {
    const dt = Math.min(.1, Math.max(0, (now - last) / 1000)); last = now;
    if (playing) clock += dt;
    live.forEach(i => {
      if (i.big) { if (!i.hold) i.t += dt; i.f(i.t); }
      else if (playing && i.vis) i.f(clock + i.off);
    });
    requestAnimationFrame(tick);
  }
  function mountCard(el, fx, off) {
    const old = byEl.get(el); if (old) live.delete(old);
    const o = K.mount(el, fx.id, wordsFor(fx), fx.scheme);
    o.off = off; o.vis = old ? old.vis : true;
    if (playing) o.f(clock + off);
    byEl.set(el, o); live.add(o);
  }
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { const o = byEl.get(e.target); if (o) o.vis = e.isIntersecting; }), { rootMargin: '120px' }) : null;

  /* ---------- 卡片 ---------- */
  const cards = [];
  function build() {
    const main = $('moMain');
    K.groups.forEach(G => {
      const list = LIST.filter(f => f.g === G.g);
      const sec = h('section', 'mo-sec'); sec.dataset.g = G.g;
      const hd = h('div', 'mo-sec-h');
      hd.append(h('h2', null, G.zh), h('span', 'rng', list[0].no + '–' + list[list.length - 1].no), h('p', null, G.note));
      const ul = h('ul', 'mo-grid');
      list.forEach(fx => {
        const idx = LIST.indexOf(fx);
        const li = h('li', 'mo-card'), btn = h('button', 'mo-stage-btn'); btn.type = 'button';
        btn.setAttribute('aria-label', '放大看 ' + fx.no + ' ' + fx.zh);
        const st = h('div', 'mo-stage'); st.setAttribute('aria-hidden', 'true'); btn.append(st);
        const meta = h('div', 'mo-meta'), h3 = h('h3');
        h3.append(document.createTextNode(fx.zh), h('span', 'en', fx.en));
        const p = h('p'); p.append(document.createTextNode(fx.desc + ' '), h('span', 'use', fx.use));
        const acts = h('div', 'mo-acts');
        const cp = h('button', 'btn sm', '複製指令'); cp.type = 'button'; cp.setAttribute('aria-label', '複製 ' + fx.no + ' ' + fx.zh + ' 的指令');
        cp.onclick = () => copy(K.prompt(fx.id, wordsFor(fx), fx.scheme, '16:9'));
        const rv = h('button', 'btn sm', '錄成影片'); rv.type = 'button';
        rv.onclick = () => openBig(idx);
        acts.append(cp, rv);
        meta.append(h('span', 'no', fx.no), h3, p, acts);
        li.append(btn, meta); ul.append(li);
        btn.addEventListener('click', () => openBig(idx));
        cards.push({ fx, st, idx });
        if (io) io.observe(st);
      });
      sec.append(hd, ul); main.append(sec);
    });
    const gb = $('moGroups');
    [['all', '全部']].concat(K.groups.map(g => [g.g, g.zh])).forEach(([g, n]) => {
      const b = h('button', 'chip' + (g === 'all' ? ' on' : ''), n); b.type = 'button'; b.dataset.g = g; b.setAttribute('role', 'tab');
      b.onclick = () => setGroup(g); gb.append(b);
    });
  }
  function renderAll() { cards.forEach(c => mountCard(c.st, c.fx, c.idx * .37)); bigPrompt(); }
  function setGroup(g) {
    group = g;
    document.querySelectorAll('#moGroups .chip').forEach(b => { b.classList.toggle('on', b.dataset.g === g); b.setAttribute('aria-selected', b.dataset.g === g); });
    document.querySelectorAll('.mo-sec').forEach(s => { s.hidden = g !== 'all' && s.dataset.g !== g; });
  }
  function setPlay(v) {
    playing = v;
    const b = $('moPlay'); b.textContent = v ? '暫停全部' : '播放全部'; b.setAttribute('aria-pressed', v);
    if (!v) live.forEach(i => { if (!i.big) i.f(i.poster); });
  }

  /* ---------- 放大檢視 ---------- */
  const dlg = $('moDlg'), big = $('moBig');
  let openIdx = -1, bigInst = null, ratio = '16:9', scheme = null, len = 0;
  const curFx = () => LIST[openIdx];
  const curScheme = () => scheme || curFx().scheme;
  function bigPrompt() { if (openIdx >= 0) $('moPrompt').textContent = K.prompt(curFx().id, wordsFor(curFx()), curScheme(), ratio); }
  function mountBig() {
    const fx = curFx();
    if (bigInst) live.delete(bigInst);
    const [a, b] = ratio.split(':').map(Number);
    $('moBigWrap').style.setProperty('--r', a + '/' + b); $('moBigWrap').style.setProperty('--rn', a / b);
    bigInst = K.mount(big, fx.id, wordsFor(fx), curScheme()); bigInst.big = true; bigInst.t = 0; live.add(bigInst);
    $('moDlgNo').textContent = fx.no; $('moDlgName').textContent = fx.zh; $('moDlgEn').textContent = fx.en;
    document.querySelectorAll('#moScheme button').forEach(b => b.setAttribute('aria-pressed', b.dataset.s === curScheme()));
    document.querySelectorAll('#moRatio button').forEach(b => b.setAttribute('aria-pressed', b.dataset.r === ratio));
    const L = bigInst.len, sel = $('moLen'); const keep = len;
    sel.innerHTML = [[0, `跑一輪（${L} 秒）`], [3, '3 秒'], [5, '5 秒'], [8, '8 秒'], [10, '10 秒'], [15, '15 秒'], [20, '20 秒']].map(([v, n]) => `<option value="${v}">${n}</option>`).join('');
    sel.value = String(keep);
    const s = $('moSample'); s.href = mp4Of(fx); s.setAttribute('download', '');
    $('moMsg').textContent = '';
    bigPrompt();
    try { history.replaceState(null, '', '#' + fx.id); } catch (e) { }
  }
  function openBig(i) {
    openIdx = i; scheme = null; mountBig();
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  }
  function step(d) { if (openIdx < 0 || recording) return; openIdx = (openIdx + d + LIST.length) % LIST.length; scheme = scheme === 'key' ? 'key' : null; mountBig(); }
  function closeBig() {
    if (recording) return;
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener('close', () => { if (bigInst) live.delete(bigInst); bigInst = null; openIdx = -1; try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { } });
  dlg.addEventListener('click', e => { if (e.target === dlg) closeBig(); });
  dlg.addEventListener('cancel', e => { if (recording) e.preventDefault(); });
  $('moClose').onclick = closeBig;
  $('moPrev').onclick = () => step(-1);
  $('moNext').onclick = () => step(1);
  document.addEventListener('keydown', e => {
    if (!dlg.open || /INPUT|SELECT|TEXTAREA/.test((e.target.tagName || ''))) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });
  SCHEMES.forEach(([k, n, c]) => {
    const b = h('button'); b.type = 'button'; b.dataset.s = k; b.style.background = c; b.title = n; b.setAttribute('aria-label', '底色：' + n);
    b.onclick = () => { scheme = k; mountBig(); }; $('moScheme').append(b);
  });
  document.querySelectorAll('#moRatio button').forEach(b => b.onclick = () => { ratio = b.dataset.r; mountBig(); });
  $('moLen').onchange = e => { len = +e.target.value; };
  $('moCopy').onclick = () => copy(K.prompt(curFx().id, wordsFor(curFx()), curScheme(), ratio));
  $('moFull').onclick = () => {
    const w = $('moBigWrap'); const f = w.requestFullscreen || w.webkitRequestFullscreen;
    if (f) { f.call(w); bigInst.t = 0; } else toast('這個瀏覽器不支援全螢幕');
  };

  /* ---------- 錄成影片：分享這個分頁 → 只裁出動畫那一塊 → 錄一輪 → 下載 ---------- */
  let recording = false;
  const canRecord = () => !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia && window.MediaRecorder && window.CropTarget && CropTarget.fromElement);
  const pickMime = () => ['video/mp4;codecs=avc3.640028', 'video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || '';
  const msg = t => { $('moMsg').textContent = t; };
  async function record() {
    if (recording) return;
    if (!canRecord()) {
      msg('這個瀏覽器不能直接錄影（需要電腦版 Chrome 或 Edge）。可以按「全螢幕播放」，再用系統的螢幕錄影：Mac 按 ⌘+Shift+5，Windows 按 Win+Alt+R；或直接下載範例影片。');
      return;
    }
    const fx = curFx(), secs = len || bigInst.len, mime = pickMime();
    let stream;
    msg('請在瀏覽器跳出的視窗選「這個分頁」並按「分享」。');
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'browser', frameRate: 30 }, audio: false, preferCurrentTab: true, selfBrowserSurface: 'include' });
    } catch (e) { msg('沒有開始錄影（取消了分享）。想錄的時候再按一次「錄成影片」。'); return; }
    const track = stream.getVideoTracks()[0];
    recording = true; dlg.classList.add('rec'); $('moRecBadge').hidden = false;
    const stopAll = () => { stream.getTracks().forEach(t => t.stop()); recording = false; dlg.classList.remove('rec'); $('moRecBadge').hidden = true; };
    try {
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await track.cropTo(await CropTarget.fromElement(big));
    } catch (e) { stopAll(); msg('沒辦法只錄動畫那一塊，請確認分享的是「這個分頁」，再試一次。'); return; }
    // 分頁畫面靜止時不會送新的影格，所以先畫到固定尺寸的畫布，畫布每一格都會送出
    const video = document.createElement('video'); video.muted = true; video.playsInline = true; video.srcObject = stream;
    try { await video.play(); } catch (e) { }
    const [ra, rb] = ratio.split(':').map(Number), OUT = ra > rb ? [1920, 1080] : ra < rb ? [1080, 1920] : [1080, 1080];
    const cv = document.createElement('canvas'); cv.width = OUT[0]; cv.height = OUT[1];
    const g = cv.getContext('2d'); g.imageSmoothingQuality = 'high';
    // captureStream(0) + requestFrame：每 1/30 秒一定送出一格，畫面沒變也一樣（否則靜止的段落會被跳過，影片變短）
    const cstream = cv.captureStream(0), ctrack = cstream.getVideoTracks()[0];
    let drawing = true, nextT = 0;
    (function draw(now) {
      if (!drawing) return;
      if (now >= nextT) { nextT = Math.max(nextT + 1000 / 30, now - 5); if (video.videoWidth) g.drawImage(video, 0, 0, OUT[0], OUT[1]); if (ctrack.requestFrame) ctrack.requestFrame(); }
      requestAnimationFrame(draw);
    })(0);
    const chunks = [];
    const rec = new MediaRecorder(cstream, Object.assign({ videoBitsPerSecond: 16e6 }, mime ? { mimeType: mime } : {}));
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise(r => { rec.onstop = r; });
    track.addEventListener('ended', () => { if (rec.state !== 'inactive') rec.stop(); });
    // 等擷取的畫面真的送到，再多等一下讓裁切穩定，才開始錄
    for (let k = 0; k < 60 && !(video.videoWidth && video.readyState >= 2); k++) await new Promise(r => setTimeout(r, 50));
    await new Promise(r => setTimeout(r, 400));
    // 先停在第一格，等錄影開始、畫面跟上，再開始播（影片第一格就是動畫的開頭）
    bigInst.t = 0; bigInst.hold = true;
    await new Promise(r => setTimeout(r, 250));
    const started = new Promise(r => { rec.onstart = r; });
    rec.start(500);
    await started; await new Promise(r => setTimeout(r, 150)); bigInst.hold = false;
    let left = Math.ceil(secs);
    msg(`錄影中，約 ${left} 秒…（中途想停，按瀏覽器上方的「停止分享」）`);
    const iv = setInterval(() => { left--; if (left > 0) msg(`錄影中，還有 ${left} 秒…`); }, 1000);
    const to = setTimeout(() => { if (rec.state !== 'inactive') rec.stop(); }, secs * 1000 + 400);
    await done; clearInterval(iv); clearTimeout(to);
    drawing = false; cstream.getTracks().forEach(t => t.stop()); video.srcObject = null;
    stopAll();
    const type = (rec.mimeType || mime || 'video/webm').split(';')[0], ext = type === 'video/mp4' ? 'mp4' : 'webm';
    const blob = new Blob(chunks, { type });
    if (!blob.size) { msg('沒有錄到畫面，請再試一次。'); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${fx.no}_${fx.zh}_${ratio.replace(':', 'x')}_${SCH_NAME[curScheme()]}.${ext}`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 8000);
    msg(`已下載 ${a.download}（${OUT[0]}×${OUT[1]}，${(blob.size / 1048576).toFixed(1)} MB）。` + (ext === 'webm' ? '這是 WebM 檔，剪映、CapCut、Chrome 都能開；PowerPoint 不吃的話，可以先用剪映轉成 MP4。' : ''));
  }
  $('moRecord').onclick = record;
  if (!canRecord()) $('moRecord').title = '需要電腦版 Chrome 或 Edge';

  /* ---------- 換字、暫停 ---------- */
  const input = $('moWords'), resetBtn = $('moReset');
  let it = 0;
  function applyInput() {
    custom = parse(input.value); resetBtn.disabled = !input.value.trim();
    store.set('sal-motion-words', input.value);
    renderAll(); if (openIdx >= 0) mountBig();
  }
  input.addEventListener('input', () => { clearTimeout(it); it = setTimeout(applyInput, 250); });
  resetBtn.onclick = () => { input.value = ''; applyInput(); input.focus(); };
  $('moPlay').onclick = () => setPlay(!playing);

  /* ---------- 開始 ---------- */
  input.value = store.get('sal-motion-words', '');
  custom = parse(input.value); resetBtn.disabled = !input.value.trim();
  $('moCount').textContent = LIST.length + ' 式';
  build(); setPlay(playing); renderAll();
  requestAnimationFrame(tick);
  const fromHash = () => { const si = LIST.findIndex(f => f.id === location.hash.slice(1)); if (si >= 0 && si !== openIdx) openBig(si); };
  fromHash(); window.addEventListener('hashchange', fromHash);
  window.WSTK_MOTION = { open: openBig, mp4Of, canRecord };
})();
