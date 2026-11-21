/* 生成素材庫共用引擎：圖片生成／影片生成 */
(function () {
  'use strict';
  const G = window.GEN;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const KEY = 'sal-gen-' + G.kind;
  const store = {
    get(d) { try { return Object.assign(d, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { return d; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { } },
  };
  const BY_ID = {};
  G.cats.forEach(c => G.items[c.k].forEach(it => { it.cat = c.k; BY_ID[it.id] = it; }));
  const CAT = Object.fromEntries(G.cats.map(c => [c.k, c]));
  let st = store.get({ subject: G.sampleSubject, sel: {}, tab: G.cats[0].k, set: 'person' });
  Object.keys(st.sel).forEach(k => { st.sel[k] = (st.sel[k] || []).filter(id => BY_ID[id]); });
  const save = () => store.set(st);

  /* ---------- 共用插圖 ---------- */
  const SCENE = `<svg class="scene" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="gsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5fc"/><stop offset="1" stop-color="#fbe3c8"/></linearGradient></defs><rect width="320" height="200" fill="url(#gsky)"/><circle cx="240" cy="58" r="22" fill="#ffd36e"/><path d="M0 140 L70 92 L130 128 L190 80 L320 146 V200 H0z" fill="#7aa58a"/><path d="M0 166 C 80 150, 200 182, 320 160 V200 H0z" fill="#4f7a5e"/><g fill="#2f3b47"><circle cx="112" cy="122" r="9"/><path d="M98 176 C98 140,126 140,126 176z"/></g><rect x="258" y="122" width="5" height="40" fill="#5a4636"/><circle cx="260" cy="116" r="19" fill="#3f6b4c"/></svg>`;
  const PERSON = `<g fill="#3b4a5a"><circle cx="50" cy="30" r="18"/><path d="M42 46h16v10H42z"/><path d="M14 150 C14 78,30 58,50 58 C70 58,86 78,86 150z"/><rect x="28" y="148" width="18" height="92" rx="7"/><rect x="54" y="148" width="18" height="92" rx="7"/></g><g fill="#fff"><circle cx="43" cy="28" r="2.4"/><circle cx="57" cy="28" r="2.4"/></g><path d="M43 37 Q50 42 57 37" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const CAM = (x, y, r) => `<g transform="translate(${x} ${y}) rotate(${r || 0})"><rect x="-9" y="-6" width="14" height="12" rx="2" fill="#c2410c"/><path d="M5 -4 L11 -7 V7 L5 4z" fill="#c2410c"/></g>`;

  const SAMPLE = new Set(G.samples || []);
  const SETS = (G.sampleSets || []).map(s => Object.assign({ dir: 'samples', ids: G.samples || [] }, s, { has: new Set(s.ids || G.samples || []) }));
  const setFor = cat => SETS.filter(s => s.cats.includes(cat));
  function sampleOf(it) {
    const list = setFor(it.cat); if (!list.length) return SAMPLE.has(it.id) ? { dir: 'samples' } : null;
    const want = list.find(s => s.k === st.set) || list[0];
    return want.has.has(it.id) ? want : (list.find(s => s.has.has(it.id)) || null);
  }
  function preview(it) {
    const p = it.pv || {}, t = p.t || CAT[it.cat].pv;
    const sm = sampleOf(it);
    if (sm) {
      const src = `${sm.dir}/${it.id}.webp`, alt = `${esc(it.name)}範例${sm.n ? '（' + esc(sm.n) + '）' : ''}`;
      const img = sm.fit === 'contain'
        ? `<img class="g-img g-blur" src="${src}" alt="" aria-hidden="true" loading="lazy"><img class="g-img g-contain" src="${src}" alt="${alt}" loading="lazy">`
        : `<img class="g-img" src="${src}" alt="${alt}" loading="lazy" width="480" height="320">`;
      return `${img}<span class="g-src">${esc(G.sampleBy?.[it.cat] || 'AI 範例')}</span><span class="g-zoom" role="button" tabindex="0" data-zoom="${src}" data-cap="${esc(it.name)}" aria-label="放大看${esc(it.name)}範例">放大</span>`;
    }
    if (t === 'filter') return `<div class="g-scene" style="filter:${p.filter || 'none'}">${SCENE}${p.overlay ? `<i class="g-ov" style="background:${p.overlay};mix-blend-mode:${p.blend || 'soft-light'}"></i>` : ''}</div>`;
    if (t === 'fx') return `<div class="g-scene">${SCENE}<i class="g-ov fx-${it.id}" style="${esc(p.ov || '')}"></i></div>`;
    if (t === 'light') return `<div class="g-light" style="background:${p.bg}"><i style="${p.ball}"></i></div>`;
    if (t === 'swatch') return `<div class="g-sw">${p.c.map(c => `<i style="background:${c}"></i>`).join('')}</div>`;
    if (t === 'shot') return `<div class="g-shot"><svg viewBox="${p.vb}" preserveAspectRatio="xMidYMid slice"><rect x="-3000" y="232" width="6000" height="3000" fill="#d9cdbd"/>${PERSON}</svg></div>`;
    if (t === 'diagram') return `<div class="g-diag"><svg viewBox="0 0 160 100">${p.svg}</svg></div>`;
    if (t === 'angle') return `<div class="g-diag"><svg viewBox="0 0 160 100"><line x1="0" y1="86" x2="160" y2="86" stroke="#d6cbbb" stroke-width="2"/><g transform="translate(92 34) scale(.22)">${PERSON}</g><line x1="${p.x}" y1="${p.y}" x2="103" y2="41" stroke="#c2410c" stroke-width="1.2" stroke-dasharray="3 3"/>${CAM(p.x, p.y, p.r)}</svg></div>`;
    if (t === 'ratio') { const [w, h] = it.ratio; const s = Math.min(130 / w, 90 / h); return `<div class="g-ratio"><i style="width:${w * s}px;height:${h * s}px"><b>${w}:${h}</b></i></div>`; }
    if (t === 'motion') return `<div class="g-scene g-motion"><div class="mv mv-${it.id}">${SCENE}</div><i class="g-frame"></i></div>`;
    if (t === 'speed') return `<div class="g-speed"><i class="sp-${it.id}"></i><span></span></div>`;
    if (t === 'trans') return `<div class="g-trans"><div class="a">A</div><div class="b tr-${it.id}">B</div></div>`;
    if (t === 'music') return `<div class="g-music" style="--d:${(60 / (p.bpm || 90)).toFixed(2)}s;--c:${p.c || '#c2410c'}">${[...Array(14)].map((_, i) => `<i style="animation-delay:${-(i * 0.13).toFixed(2)}s"></i>`).join('')}</div>`;
    if (t === 'preset') return `<div class="g-preset" style="--c1:${p.c[0]};--c2:${p.c[1]}"><b>${esc(it.name)}</b><div>${it.picks.slice(0, 5).map(id => BY_ID[id] ? `<span>${esc(BY_ID[id].name)}</span>` : '').join('')}</div></div>`;
    // tag
    const c = p.c || ['#f1e8dc', '#8a5a32'];
    return `<div class="g-tag" style="background:${c[0]};color:${c[1]}${p.font ? ';font-family:' + p.font : ''}"><b>${esc(p.big || it.name)}</b><small>${esc(it.en.split(',')[0])}</small></div>`;
  }
  // 動態預覽需要的 keyframes
  const css = [];
  G.cats.forEach(c => G.items[c.k].forEach(it => { if (it.css) css.push(it.css); }));
  const styleEl = document.createElement('style'); styleEl.textContent = css.join('\n'); document.head.appendChild(styleEl);

  /* ---------- 提示詞組合 ---------- */
  function chosen() { const out = []; G.cats.forEach(c => (st.sel[c.k] || []).forEach(id => out.push(BY_ID[id]))); return out; }
  function build() { return G.build(st.subject.trim(), k => (st.sel[k] || []).map(id => BY_ID[id])); }

  /* ---------- 畫面 ---------- */
  function renderSide() {
    $('#gSide').innerHTML = G.cats.map(c => {
      const n = (st.sel[c.k] || []).length;
      return `<a href="#${c.k}" class="${st.tab === c.k ? 'on' : ''}"><span>${c.n}</span>${n ? `<em>${n}</em>` : `<small>${G.items[c.k].length}</small>`}</a>`;
    }).join('');
  }
  function renderGrid() {
    const c = CAT[st.tab], items = G.items[c.k], sel = st.sel[c.k] || [];
    const sets = setFor(c.k);
    const sw = sets.length > 1 ? `<div class="g-sets" role="group" aria-label="範例圖主題"><span>範例圖</span>${sets.map(s => `<button type="button" data-set="${s.k}" aria-pressed="${(sets.find(x => x.k === st.set) || sets[0]).k === s.k}">${esc(s.n)}</button>`).join('')}</div>` : '';
    $('#gHead').innerHTML = `<h1>${c.n}</h1><p>${esc(c.d)}<span class="g-mode">${c.mode === 'multi' ? '可複選' : '單選，點同一張可取消'}</span></p>${sw}`;
    $('#gGrid').className = 'g-grid gg-' + (c.pv || 'tag');
    $('#gGrid').innerHTML = items.map((it, i) => `<button class="g-card ${sel.includes(it.id) ? 'sel' : ''}" data-id="${it.id}"><div class="g-pv">${preview(it)}</div><div class="g-meta"><b><span>${String(i + 1).padStart(2, '0')}</span>${esc(it.name)}</b><small>${esc(it.desc || '')}</small><code>${esc(it.en)}</code></div></button>`).join('');
  }
  function renderDock() {
    const out = build(), ch = chosen();
    $('#gChips').innerHTML = ch.length ? ch.map(it => `<span class="g-chip" data-id="${it.id}"><em>${CAT[it.cat].n}</em>${esc(it.name)}<button aria-label="移除 ${esc(it.name)}">✕</button></span>`).join('') : '<span class="muted">還沒有選任何項目。先點左邊的「用途模板」最快。</span>';
    $('#gZh').textContent = out.zh;
    $('#gEn').textContent = out.en;
    $('#gNegWrap').hidden = !out.neg;
    $('#gNeg').textContent = out.neg || '';
    $('#gCopyNeg').hidden = !out.neg;
  }
  function renderAll() { renderSide(); renderGrid(); renderDock(); }

  function toggle(id) {
    const it = BY_ID[id], c = CAT[it.cat], cur = st.sel[c.k] || [];
    if (c.k === 'presets') {
      // 套用模板：把模板內的選擇覆蓋到各類別
      const on = cur.includes(id);
      st.sel = {};
      if (!on) { st.sel.presets = [id]; it.picks.forEach(pid => { const p = BY_ID[pid]; if (!p) return; const pc = CAT[p.cat]; st.sel[pc.k] = pc.mode === 'multi' ? [...(st.sel[pc.k] || []), pid] : [pid]; }); if (it.subject && (!st.subject || st.subject === G.sampleSubject)) { st.subject = it.subject; $('#gSubject').value = it.subject; } toast(`已套用「${it.name}」，可以再逐類微調`); }
    } else if (c.mode === 'multi') st.sel[c.k] = cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id];
    else st.sel[c.k] = cur[0] === id ? [] : [id];
    save(); renderAll();
  }

  const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 1900); };
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); } catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    toast(msg || '已複製');
  }

  /* ---------- 事件 ---------- */
  const zoom = (src, cap) => { let z = $('#gLight'); if (!z) { z = document.createElement('div'); z.id = 'gLight'; z.className = 'g-light-box'; z.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure><button type="button" aria-label="關閉">✕</button>'; document.body.appendChild(z); z.addEventListener('click', () => z.classList.remove('on')); } $('img', z).src = src; $('img', z).alt = cap + '範例'; $('figcaption', z).textContent = cap; z.classList.add('on'); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#gLight')?.classList.remove('on'); });
  $('#gGrid').addEventListener('click', e => { const z = e.target.closest('.g-zoom'); if (z) { e.stopPropagation(); zoom(z.dataset.zoom, z.dataset.cap); return; } const b = e.target.closest('.g-card'); if (b) toggle(b.dataset.id); });
  $('#gGrid').addEventListener('keydown', e => { const z = e.target.closest('.g-zoom'); if (z && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopPropagation(); zoom(z.dataset.zoom, z.dataset.cap); } });
  $('#gHead').addEventListener('click', e => { const b = e.target.closest('[data-set]'); if (!b) return; st.set = b.dataset.set; save(); renderGrid(); });
  $('#gChips').addEventListener('click', e => { const b = e.target.closest('.g-chip button'); if (!b) return; const id = b.parentNode.dataset.id, c = BY_ID[id].cat; st.sel[c] = (st.sel[c] || []).filter(x => x !== id); save(); renderAll(); });
  $('#gSubject').value = st.subject;
  $('#gSubject').addEventListener('input', e => { st.subject = e.target.value; save(); renderDock(); });
  $('#gCopyEn').onclick = () => copy(build().en, '已複製英文提示詞');
  $('#gCopyZh').onclick = () => copy(build().zh, '已複製中文提示詞');
  $('#gCopyNeg').onclick = () => copy(build().neg, '已複製負面提示詞');
  const chatText = () => G.chat(build(), st.subject.trim(), k => (st.sel[k] || []).map(id => BY_ID[id]));
  const openWith = (url, name) => { window.open(url, '_blank', 'noopener'); copy(chatText(), `已複製，到 ${name} 輸入框貼上送出`); };
  $('#gToGPT').onclick = () => openWith('https://chatgpt.com/', 'ChatGPT');
  $('#gToGemini').onclick = () => openWith('https://gemini.google.com/app', 'Gemini');
  window.GEN_APP_CHAT = chatText;
  $('#gClear').onclick = () => { st.sel = {}; save(); renderAll(); };
  $('#gDockToggle').onclick = () => $('#gDock').classList.toggle('open');
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (CAT[h]) { st.tab = h; save(); renderSide(); renderGrid(); window.scrollTo(0, 0); } });
  const h0 = location.hash.slice(1); if (CAT[h0]) st.tab = h0;
  renderAll();
  window.GEN_APP = { build, BY_ID, st: () => st };
})();
