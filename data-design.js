/* 簡報素材庫：簡報模板、配色、背景、版面配置 */
window.LIB = window.LIB || { items: {} };

/* ---------- 投影片共用基礎樣式（1280×720） ---------- */
LIB.slideBase = `.slide{position:absolute;inset:0;width:1280px;height:720px;box-sizing:border-box;background:var(--bg);color:var(--fg);font-family:var(--bf,var(--tp-bf));padding:72px 96px;display:flex;flex-direction:column;justify-content:center;gap:22px;overflow:hidden}
.slide>*{position:relative;z-index:1}
.slide h1{font-family:var(--hf,var(--tp-hf));color:var(--hc,var(--fg));font-size:64px;line-height:1.2;margin:0;font-weight:700}
.slide h2{font-family:var(--hf,var(--tp-hf));font-size:32px;color:var(--accent);margin:0;font-weight:600}
.slide ul{margin:6px 0 0;padding:0;list-style:none;font-size:30px;display:grid;gap:16px}
.slide li{padding-left:42px;position:relative;line-height:1.45}
.slide li::before{content:'';position:absolute;left:0;top:.42em;width:16px;height:16px;border-radius:50%;background:var(--accent)}
.slide blockquote{font-family:var(--hf,var(--tp-hf));font-size:42px;line-height:1.5;border-left:8px solid var(--accent);padding-left:32px;margin:0}
.slide p{font-size:28px;line-height:1.6;margin:0;color:var(--muted)}
.slide img{max-width:100%;max-height:420px;border-radius:12px;object-fit:cover;align-self:flex-start}
.slide .bignum b{display:block;font-family:var(--hf,var(--tp-hf));font-size:180px;line-height:1;color:var(--accent)}
.slide .bignum span{font-size:34px;color:var(--fg)}
.slide.title-slide{align-items:center;text-align:center}
.slide.title-slide h1{font-size:88px}
.slide.title-slide h2{font-size:38px}
.slide .pageno{position:absolute;right:40px;bottom:26px;font-size:18px;color:var(--muted);z-index:2}`;

/* ---------- 簡報模板 ---------- */
(function () {
  // [key, 名稱, 說明, bg, fg, accent, muted, 標題字型, 內文字型, 額外CSS(S=選擇器)]
  const NS = "'Noto Sans TC',sans-serif", NSR = "'Noto Serif TC',serif", WK = "'LXGW WenKai TC',serif";
  const T = [
    ['minimal', '極簡白', '乾淨留白，萬用', '#ffffff', '#1f2328', '#2563eb', '#57606a', NS, NS, ''],
    ['business', '商務深藍', '正式報告、提案', '#0f2747', '#ffffff', '#f5b700', '#c9d6ea', NS, NS, `S::after{content:'';position:absolute;left:0;top:0;width:14px;height:100%;background:var(--accent)}`],
    ['beige', '米棕暖調', '溫暖質樸，適合長照與社區', '#f4ece1', '#4a3728', '#a0703c', '#7a6553', NSR, NS, `S::before{content:'';position:absolute;inset:26px;border:2px solid #d8c6ad;border-radius:18px;pointer-events:none}`],
    ['forest', '森林綠', '自然、健康、永續', '#eef3ea', '#1e3a2b', '#3f7d4e', '#5b7262', NS, NS, `S::after{content:'';position:absolute;right:-130px;bottom:-130px;width:400px;height:400px;border-radius:50%;background:#cfe3c8}`],
    ['tech', '科技暗黑', '科技、資訊、AI 主題', '#0b0f17', '#e6edf3', '#22d3ee', '#8b98a9', "'Space Grotesk','Noto Sans TC',sans-serif", NS, `S{background-image:linear-gradient(rgba(34,211,238,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,.08) 1px,transparent 1px);background-size:48px 48px}`],
    ['pastel', '粉彩夢幻', '柔和可愛', '#fff5f8', '#5a3d5c', '#f48fb1', '#8a6f8c', "'Huninn',sans-serif", NS, `S::before{content:'';position:absolute;width:440px;height:440px;border-radius:50%;background:#e1f5fe;top:-160px;right:-110px}S::after{content:'';position:absolute;width:300px;height:300px;border-radius:50%;background:#fff3c4;bottom:-120px;left:-80px}`],
    ['wa', '日系和風', '沉穩雅緻，文化主題', '#f7f3ea', '#2b2b2b', '#b33e3e', '#6b6b6b', NSR, NSR, `S::after{content:'';position:absolute;right:90px;top:80px;width:150px;height:150px;border-radius:50%;background:var(--accent);opacity:.9}`],
    ['chalk', '黑板粉筆', '課堂、教學', '#2f4f3f', '#f4f1e8', '#ffe58a', '#cfd8cf', WK, WK, `S{box-shadow:inset 0 0 0 22px #8a5a32,inset 0 0 80px rgba(0,0,0,.45)}S h1{text-shadow:0 0 3px rgba(255,255,255,.5)}`],
    ['medical', '醫療健康', '衛教、醫療、復健', '#f3f9fb', '#12343b', '#0e9aa7', '#4f6d73', NS, NS, `S::before{content:'';position:absolute;top:0;left:0;right:0;height:12px;background:linear-gradient(90deg,#0e9aa7,#3dd6c6)}S::after{content:'';position:absolute;right:60px;top:56px;width:60px;height:60px;background:#0e9aa7;opacity:.15;clip-path:polygon(35% 0,65% 0,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0 65%,0 35%,35% 35%)}`],
    ['elder', '長者友善大字', '超大字、高對比，適合長輩', '#fffaf0', '#222222', '#d35400', '#444444', "'Huninn',sans-serif", "'Huninn',sans-serif", `S h1{font-size:84px}S ul{font-size:44px;gap:22px}S li::before{width:24px;height:24px;top:.35em}S p{font-size:36px;color:#333}`],
    ['vivid', '漸層活力', '年輕、活動宣傳', '#ff7e5f', '#ffffff', '#fff3b0', '#fff1e6', NS, NS, `S{background:linear-gradient(135deg,#ff7e5f,#feb47b)}`],
    ['morandi', '莫蘭迪', '低飽和、高級感', '#e9e4df', '#4d4a47', '#9a8c98', '#75706b', NSR, NS, `S::after{content:'';position:absolute;right:0;top:0;width:30%;height:100%;background:#d6cfc7;z-index:0}`],
    ['earth', '大地色', '樸實、農業、在地', '#efe6da', '#3d2b1f', '#c06c3e', '#6e5848', NS, NS, `S::after{content:'';position:absolute;left:0;right:0;bottom:0;height:18px;background:repeating-linear-gradient(90deg,#c06c3e 0 80px,#8a9a5b 80px 160px,#d9a441 160px 240px)}`],
    ['ocean', '海洋藍', '清爽、旅遊、環境', '#e8f4fb', '#0b3954', '#087e8b', '#3e6b80', NS, NS, `S::after{content:'';position:absolute;left:-10%;right:-10%;bottom:-280px;height:380px;border-radius:50%;background:#bfe3f2}`],
    ['sunset', '夕陽暖橘', '感性、故事、回憶', '#2d1b4e', '#ffffff', '#ffd166', '#f7d6e0', NSR, NS, `S{background:linear-gradient(180deg,#2d1b4e 0%,#8b3a62 55%,#f08a4b 100%)}`],
    ['academic', '學術簡約', '研究報告、論文發表', '#ffffff', '#222222', '#8b0000', '#555555', NSR, NSR, `S::after{content:'';position:absolute;left:96px;right:96px;bottom:44px;height:2px;background:#8b0000}`],
    ['magazine', '雜誌風', '大字、強烈排版', '#fafafa', '#111111', '#e63946', '#555555', "'Abril Fatface','Noto Serif TC',serif", NS, `S h1{font-size:92px;letter-spacing:-1px}S::after{content:'01';position:absolute;right:60px;top:10px;font:400 260px 'Abril Fatface',serif;color:#ececec;z-index:0}`],
    ['swiss', '瑞士國際風', '網格、俐落、紅黑白', '#ffffff', '#000000', '#ff0000', '#333333', "'Inter','Noto Sans TC',sans-serif", NS, `S h1{font-weight:900;font-size:80px}S::after{content:'';position:absolute;right:0;bottom:0;width:240px;height:240px;background:var(--accent)}`],
    ['glass', '玻璃擬態', '現代、科技、產品', '#667eea', '#ffffff', '#a5f3fc', '#e0e7ff', NS, NS, `S{background:linear-gradient(135deg,#667eea,#764ba2)}S::before{content:'';position:absolute;inset:48px;border-radius:32px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);z-index:0}`],
    ['festive', '節慶紅金', '春節、喜慶、頒獎', '#9b1b1b', '#fff4d6', '#ffcc4d', '#f3d9a4', NSR, NSR, `S::before{content:'';position:absolute;inset:28px;border:3px solid #ffcc4d;border-radius:8px;box-shadow:inset 0 0 0 8px #9b1b1b,inset 0 0 0 9px #ffcc4d}`],
    ['dark', '簡約深色', '沉穩、專注', '#18181b', '#fafafa', '#a78bfa', '#a1a1aa', NS, NS, ''],
    ['handdrawn', '手繪溫馨', '親切、社區活動', '#fdf6ec', '#4b3b2a', '#e07a5f', '#7d6b5d', WK, WK, `S::before{content:'';position:absolute;inset:30px;border:3px dashed #e0c9a6;border-radius:26px}`],
    ['fresh', '清新薄荷', '健康、心理、正向', '#f0fbf4', '#134e4a', '#10b981', '#3f6f68', NS, NS, `S::after{content:'';position:absolute;top:-80px;left:-80px;width:260px;height:260px;border-radius:42% 58% 63% 37%/45% 38% 62% 55%;background:#c9f2dc}`],
    ['editorial', '編輯留白', '雜誌內頁感，大量留白、細線分隔', '#fbfaf7', '#1c1c1c', '#c2410c', '#6b6560', NSR, NS, `S::before{content:'';position:absolute;left:96px;right:96px;top:56px;height:1px;background:#1c1c1c}S::after{content:'';position:absolute;left:96px;right:96px;bottom:56px;height:1px;background:#d8d2c8}`],
    ['forest-gold', '深綠金', '沉穩高級，頒獎、成果發表', '#1f3a2e', '#f4efe3', '#d4a64a', '#c9d3c4', NSR, NS, `S::before{content:'';position:absolute;inset:32px;border:1px solid rgba(212,166,74,.55);pointer-events:none}`],
    ['navy-cream', '海軍藍米', '經典配色，提案、報告', '#f6f1e7', '#1d2a44', '#b5563f', '#5b6475', NS, NS, `S::before{content:'';position:absolute;left:0;top:0;bottom:0;width:24px;background:#1d2a44}`],
    ['sage', '鼠尾草綠', '柔和自然，身心健康、療癒', '#eef1ea', '#2f3b30', '#6b8f71', '#5e6b5f', NSR, NS, `S::after{content:'';position:absolute;right:-160px;top:-160px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(107,143,113,.3),rgba(107,143,113,0) 70%)}`],
    ['terracotta', '陶土暖橘', '溫暖有質感，社區、手作', '#f7efe7', '#3b2a22', '#c1653f', '#7a6255', NSR, NS, `S::after{content:'';position:absolute;right:90px;bottom:0;width:260px;height:340px;border-radius:130px 130px 0 0;background:#ecd3c2}`],
    ['mono-bold', '黑白粗體', '強烈對比、俐落有力', '#f2f2f0', '#111111', '#111111', '#555555', NS, NS, `S h1{font-weight:900;font-size:76px;letter-spacing:-.02em}S h2{color:#111;font-weight:700}S::after{content:'';position:absolute;left:96px;bottom:64px;width:120px;height:10px;background:#111}`],
    ['soft-card', '浮層卡片', '灰底白卡，乾淨現代', '#e9edf3', '#1f2937', '#4f46e5', '#6b7280', NS, NS, `S::before{content:'';position:absolute;inset:40px;background:#fff;border-radius:28px;box-shadow:0 20px 50px rgba(30,41,59,.10);z-index:0}`],
    ['midnight-gold', '夜藍金', '典雅夜色，晚會、致謝', '#0f1b2d', '#f5f1e6', '#e0b45c', '#b8c0cc', NSR, NS, `S{background:radial-gradient(ellipse at 80% 10%,rgba(224,180,92,.18),transparent 55%),#0f1b2d}`],
  ];
  const fam = s => (s.match(/'([^']+)'/g) || []).map(x => x.slice(1, -1));
  LIB.items.templates = T.map(([k, name, desc, bg, fg, accent, muted, hf, bf, extra]) => {
    const id = 'tp-' + k;
    const S = '.' + id;
    const css = `${S}{--bg:${bg};--fg:${fg};--accent:${accent};--muted:${muted};--tp-hf:${hf};--tp-bf:${bf}}\n${extra.replace(/S(?=[\s:{.,\[])/g, S)}`;
    return { id, name, desc, bg, fg, accent, muted, hf, bf, fonts: [...new Set([...fam(hf), ...fam(bf)])], css, tags: ['模板'] };
  });
})();

/* ---------- 配色方案（底色、輔色、主色、強調色、文字） ---------- */
(function () {
  const P = [
    ['warm-beige', '暖米棕', ['#f4ece1', '#e3d3bd', '#a0703c', '#6b8e5a', '#4a3728']],
    ['corporate', '企業藍', ['#f5f8fc', '#dbe6f4', '#1f4e8c', '#f2a900', '#16243a']],
    ['medical', '醫療青', ['#f3f9fb', '#d4eef1', '#0e9aa7', '#f4845f', '#12343b']],
    ['forest', '森林', ['#eef3ea', '#cfe3c8', '#3f7d4e', '#d9a441', '#1e3a2b']],
    ['ocean', '海洋', ['#e8f4fb', '#bfe3f2', '#087e8b', '#ff5a5f', '#0b3954']],
    ['mint', '薄荷', ['#f0fbf4', '#c9f2dc', '#10b981', '#f59e0b', '#134e4a']],
    ['morandi', '莫蘭迪', ['#e9e4df', '#d6cfc7', '#9a8c98', '#a3b18a', '#4d4a47']],
    ['sakura', '櫻花', ['#fff5f7', '#ffd6e0', '#e8577e', '#7fb77e', '#4a2c36']],
    ['midnight', '午夜', ['#0f172a', '#1e293b', '#38bdf8', '#facc15', '#f1f5f9']],
    ['mono', '黑白灰', ['#ffffff', '#e5e5e5', '#111111', '#777777', '#111111']],
    ['red-gold', '紅金喜慶', ['#9b1b1b', '#7a1212', '#ffcc4d', '#fff4d6', '#fff4d6']],
    ['earth', '大地', ['#efe6da', '#dccab2', '#c06c3e', '#8a9a5b', '#3d2b1f']],
    ['autumn', '秋楓', ['#fbf4ea', '#f1d9bd', '#c2410c', '#a16207', '#422006']],
    ['nordic', '北歐', ['#f6f7f4', '#dfe4e0', '#5b7c99', '#d4a373', '#2e3a46']],
    ['coffee', '咖啡', ['#f6efe8', '#e2cfbd', '#6f4e37', '#c08552', '#2b1d14']],
    ['tropical', '熱帶', ['#f2fff9', '#b8f2e6', '#00a896', '#ff9f1c', '#05445e']],
    ['olive', '橄欖', ['#f7f7ee', '#e3e4c8', '#6b7a2b', '#c97c5d', '#2f3317']],
    ['ice', '冰川', ['#f0f9ff', '#dbeafe', '#3b82f6', '#06b6d4', '#0c2340']],
    ['chalk', '黑板', ['#2f4f3f', '#3d6350', '#ffe58a', '#f4a7a7', '#f4f1e8']],
    ['elder-contrast', '長者高對比', ['#fffaf0', '#ffe8cc', '#d35400', '#1565c0', '#222222']],
    ['wine', '酒紅', ['#faf5f5', '#ead1d1', '#7b1e3a', '#c9a227', '#2a0e16']],
    ['tea', '抹茶', ['#f4f6ec', '#dbe3c3', '#7a9a3b', '#b5838d', '#2f3a1e']],
    ['dusk', '暮色', ['#2d1b4e', '#4b2c6f', '#f08a4b', '#ffd166', '#ffffff']],
    ['forest-gold', '深綠金', ['#f4efe3', '#d9e0d3', '#1f3a2e', '#d4a64a', '#1b2a22']],
    ['navy-cream', '海軍藍米', ['#f6f1e7', '#e6dccb', '#1d2a44', '#b5563f', '#1d2a44']],
    ['sage', '鼠尾草', ['#eef1ea', '#d5ddcf', '#6b8f71', '#c9a66b', '#2f3b30']],
    ['terracotta', '陶土', ['#f7efe7', '#ecd3c2', '#c1653f', '#5f7a61', '#3b2a22']],
    ['oat', '燕麥奶茶', ['#f5f0e8', '#e7dccb', '#9c7b5b', '#5f6f65', '#3a2f26']],
    ['slate-mist', '灰藍霧', ['#f1f4f7', '#dbe3ea', '#4a6a85', '#d98b5f', '#1f2d3a']],
    ['celadon', '青瓷', ['#f2f6f3', '#d3e4dc', '#4f8a7b', '#b78b5c', '#1f3330']],
    ['graphite-orange', '石墨橘', ['#f4f4f2', '#e2e2de', '#2b2b2b', '#e8622c', '#1a1a1a']],
  ];
  const ROLE = ['底色', '輔色', '主色', '強調', '文字'];
  LIB.items.palettes = P.map(([k, name, c]) => {
    const id = 'pl-' + k;
    return {
      id, name, colors: c, tags: ['配色'], desc: c.map((x, i) => ROLE[i] + ' ' + x).join('・'),
      css: `.${id}{--bg:${c[0]};--surface:${c[1]};--accent:${c[2]};--accent2:${c[3]};--fg:${c[4]};--muted:${c[4]}cc}`,
    };
  });
})();

/* ---------- 背景 ---------- */
(function () {
  // [key, 名稱, 分組, background 宣告, 額外 CSS]
  const B = [
    ['g-peach', '蜜桃漸層', '漸層', 'linear-gradient(135deg,#ffecd2,#fcb69f)'],
    ['g-sky', '天空漸層', '漸層', 'linear-gradient(180deg,#a1c4fd,#c2e9fb)'],
    ['g-purple', '紫羅蘭漸層', '漸層', 'linear-gradient(135deg,#667eea,#764ba2)'],
    ['g-sunset', '夕陽漸層', '漸層', 'linear-gradient(180deg,#2d1b4e,#8b3a62 55%,#f08a4b)'],
    ['g-ocean', '深海漸層', '漸層', 'linear-gradient(160deg,#0f2027,#203a43,#2c5364)'],
    ['g-warm', '暖米漸層', '漸層', 'linear-gradient(160deg,#fbf6ee,#efe1cc)'],
    ['radial-spot', '聚光燈', '漸層', 'radial-gradient(circle at 50% 40%,#3a3f5c,#0d0f1a 70%)'],
    ['mesh', '網格彩霧', '漸層', 'radial-gradient(at 20% 20%,#ffd1dc 0,transparent 50%),radial-gradient(at 80% 10%,#c7f0ff 0,transparent 50%),radial-gradient(at 70% 80%,#e0d4ff 0,transparent 50%),radial-gradient(at 10% 90%,#fff3b0 0,transparent 50%),#ffffff'],
    ['dots', '圓點', '圖樣', 'radial-gradient(#d6c7b0 2px,transparent 2.5px) 0 0/28px 28px,#faf6ef'],
    ['grid', '方格紙', '圖樣', 'linear-gradient(#e5e7eb 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,#e5e7eb 1px,transparent 1px) 0 0/32px 32px,#ffffff'],
    ['blueprint', '藍圖', '圖樣', 'linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px) 0 0/24px 24px,#1e4a8a'],
    ['paper', '紙張紋理', '質感', 'radial-gradient(circle at 20% 30%,rgba(0,0,0,.025) 0 1px,transparent 1px) 0 0/7px 7px,radial-gradient(circle at 70% 60%,rgba(0,0,0,.03) 0 1px,transparent 1px) 0 0/11px 11px,#fbf7ef'],
    ['chalkboard', '黑板', '質感', 'radial-gradient(ellipse at center,#3b5e4b,#22392d)'],
    ['aurora', '極光（會動）', '動態', 'linear-gradient(120deg,#a8edea,#fed6e3,#c3cfe2,#d4fc79) 0 0/300% 300%', '@keyframes bg-aurora-kf{0%,100%{background-position:0 50%}50%{background-position:100% 50%}}.bg-aurora{animation:bg-aurora-kf 12s ease infinite}'],
    ['starry', '星空', '動態', 'radial-gradient(1.5px 1.5px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 70% 20%,#fff,transparent),radial-gradient(2px 2px at 40% 70%,#fff,transparent),radial-gradient(1px 1px at 85% 60%,#fff,transparent),radial-gradient(1.5px 1.5px at 10% 85%,#fff,transparent) 0 0/300px 300px,linear-gradient(#0b1026,#2b2f77)', '@keyframes bg-starry-kf{0%,100%{filter:brightness(1)}50%{filter:brightness(1.25)}}.bg-starry{animation:bg-starry-kf 4s ease-in-out infinite}'],
    ['split', '左右分割', '版塊', 'linear-gradient(90deg,#1f4e8c 0 38%,#f5f8fc 38%)'],
    ['diagonal', '斜切分割', '版塊', 'linear-gradient(160deg,#ffb703 0 35%,#fffaf0 35%)'],
    ['corner-blob', '角落色塊', '版塊', 'radial-gradient(circle at 100% 0,#ffd6e0 0 220px,transparent 221px),radial-gradient(circle at 0 100%,#c7f0ff 0 260px,transparent 261px),#ffffff'],
    ['bottom-wave', '底部波浪', '版塊', 'radial-gradient(120% 60px at 50% 100%,#8ecae6 98%,transparent 100%) bottom/100% 120px no-repeat,#f7fbff'],
    ['g-mist', '霧藍灰漸層', '漸層', 'linear-gradient(160deg,#f1f4f7,#dbe3ea)'],
    ['g-milktea', '奶茶漸層', '漸層', 'linear-gradient(160deg,#f7f1e8,#e6d6c2)'],
    ['g-blush', '柔粉灰漸層', '漸層', 'linear-gradient(160deg,#faf3f1,#ecd9d6)'],
    ['g-forest', '深林漸層', '漸層', 'linear-gradient(160deg,#24443a,#13261f)'],
    ['g-midnight', '午夜藍漸層', '漸層', 'linear-gradient(160deg,#1b2a44,#0d1524)'],
    ['glow-light', '柔光光斑', '光斑', 'radial-gradient(circle at 15% 20%,rgba(255,196,160,.55),transparent 40%),radial-gradient(circle at 85% 80%,rgba(160,196,255,.5),transparent 42%),#fbfaf8'],
    ['glow-dark', '暗色光斑', '光斑', 'radial-gradient(circle at 20% 15%,rgba(124,92,255,.45),transparent 40%),radial-gradient(circle at 85% 85%,rgba(34,211,238,.35),transparent 42%),#0e1020'],
    ['glow-warm', '暖陽光暈', '光斑', 'radial-gradient(ellipse at 50% 120%,rgba(255,170,90,.55),transparent 60%),#fdf8f2'],
    ['dots-fade', '漸隱圓點', '圖樣', 'radial-gradient(ellipse at 100% 0,transparent 25%,#fbfaf8 70%),radial-gradient(#c9bca9 1.5px,transparent 2px) 0 0/22px 22px,#fbfaf8'],
    ['lines-diag', '細斜線', '圖樣', 'repeating-linear-gradient(135deg,rgba(0,0,0,.045) 0 1px,transparent 1px 14px),#fbfaf8'],
    ['grain', '細緻顆粒', '質感', `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .09 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>"),#f4efe6`],
    ['band-top', '頂部色帶', '版塊', 'linear-gradient(#1d2a44,#1d2a44) top/100% 30% no-repeat,#f6f1e7'],
    ['half-sun', '半圓色塊', '版塊', 'radial-gradient(circle at 78% 100%,#ecd3c2 0 300px,transparent 301px),#f7efe7'],
  ];
  LIB.items.backgrounds = B.map(([k, name, group, decl, extra]) => {
    const id = 'bg-' + k;
    return { id, name, group, decl, extra: extra || '', tags: [group], desc: group + '背景', css: `.${id}{background:${decl}}${extra ? '\n' + extra : ''}` };
  });
})();

/* ---------- 版面配置（放進投影片的內容排版） ---------- */
(function () {
  const IMG = `<div class="ly-img"><svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M3 17l5-5 4 4 3-3 6 6"/></svg></div>`;
  LIB.layoutBase = `.ly-img{display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 14%,transparent);color:var(--accent);border-radius:16px;min-height:160px}
.ly-card{background:color-mix(in srgb,var(--accent) 8%,var(--bg));border:1px solid color-mix(in srgb,var(--accent) 18%,transparent);border-radius:22px;padding:34px 36px}
.ly-card h3{margin:0 0 10px;font-size:38px;color:var(--accent);font-family:var(--hf,var(--tp-hf))}
.ly-card p{font-size:25px}`;
  const L = [
    ['cover', '封面標題', '置中大標 + 副標 + 講者', `.ly-cover{text-align:center;display:grid;gap:18px;justify-items:center}.ly-cover h1{font-size:88px}.ly-cover .line{width:120px;height:6px;border-radius:3px;background:var(--accent)}`,
      `<div class="ly-cover"><h1>簡報主標題</h1><div class="line"></div><h2>副標題・活動名稱</h2><p>講者姓名｜2026.11.20</p></div>`],
    ['section', '章節頁', '大編號 + 章節名稱', `.ly-section{display:flex;align-items:center;gap:48px}.ly-section b{font-size:220px;line-height:1;color:var(--accent);font-family:var(--hf,var(--tp-hf))}.ly-section h1{font-size:72px}`,
      `<div class="ly-section"><b>02</b><div><h2>PART TWO</h2><h1>第二章：方法與流程</h1></div></div>`],
    ['agenda', '議程目錄', '左標題、右編號清單', `.ly-agenda{display:grid;grid-template-columns:1fr 1.4fr;gap:60px;align-items:center}.ly-agenda ol{margin:0;padding:0;list-style:none;display:grid;gap:18px;counter-reset:a}.ly-agenda li{counter-increment:a;font-size:32px;display:flex;gap:20px;align-items:center;padding:0}.ly-agenda li::before{content:counter(a,decimal-leading-zero);position:static;width:auto;height:auto;background:none;color:var(--accent);font-weight:800;font-size:34px}`,
      `<div class="ly-agenda"><h1>今日議程</h1><ol><li>現況與問題</li><li>解決方案</li><li>實施成果</li><li>未來展望</li></ol></div>`],
    ['two-col', '雙欄文字', '左右兩欄對等內容', `.ly-two-col{display:grid;grid-template-columns:1fr 1fr;gap:56px}.ly-two-col h3{font-size:42px;margin:0 0 12px;color:var(--accent)}`,
      `<div class="ly-two-col"><div><h3>左欄標題</h3><p>這裡放第一段說明文字，可以是重點或是故事。</p></div><div><h3>右欄標題</h3><p>這裡放第二段說明文字，與左欄互相呼應。</p></div></div>`],
    ['img-left', '左圖右文', '圖片在左、文字在右', `.ly-img-left{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}.ly-img-left .ly-img{height:440px}`,
      `<div class="ly-img-left">${IMG}<div><h1>圖文標題</h1><p>用一張好照片搭配簡短說明，最容易讓人記住。</p></div></div>`],
    ['img-right', '左文右圖', '文字在左、圖片在右', `.ly-img-right{display:grid;grid-template-columns:1.1fr 1fr;gap:56px;align-items:center}.ly-img-right .ly-img{height:440px}`,
      `<div class="ly-img-right"><div><h1>圖文標題</h1><ul><li>重點一</li><li>重點二</li><li>重點三</li></ul></div>${IMG}</div>`],
    ['full-image', '滿版圖片 + 字卡', '整頁圖片上壓一段文字', `.ly-full-image{position:absolute!important;inset:0;display:flex;align-items:flex-end;padding:72px;background:linear-gradient(transparent 40%,rgba(0,0,0,.6)),linear-gradient(135deg,#89a7c2,#c4a484)}.ly-full-image h1{color:#fff;font-size:72px}.ly-full-image p{color:#f1f1f1}`,
      `<div class="ly-full-image"><div><h1>一張照片，一個故事</h1><p>把背景換成你的照片：background-image:url(...)</p></div></div>`],
    ['three-cards', '三張卡片', '三個並列重點', `.ly-three-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}.ly-three-cards .ly-card{min-height:280px;display:flex;flex-direction:column;justify-content:flex-end}`,
      `<div class="ly-three-cards"><div class="ly-card"><h3>01 觀察</h3><p>找出真正的需求</p></div><div class="ly-card"><h3>02 設計</h3><p>提出可行的方法</p></div><div class="ly-card"><h3>03 驗證</h3><p>用數據確認成效</p></div></div>`],
    ['four-grid', '四宮格', '2×2 重點方格', `.ly-four-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.ly-four-grid .ly-card{padding:30px 34px}`,
      `<div class="ly-four-grid"><div class="ly-card"><h3>睡眠</h3><p>規律作息</p></div><div class="ly-card"><h3>飲食</h3><p>均衡少油</p></div><div class="ly-card"><h3>運動</h3><p>每天 30 分鐘</p></div><div class="ly-card"><h3>社交</h3><p>多和朋友聊天</p></div></div>`],
    ['big-number', '大數字', '一個關鍵數據撐全場', `.ly-big-number{text-align:center}.ly-big-number b{display:block;font-size:240px;line-height:1;color:var(--accent);font-family:var(--hf,var(--tp-hf))}.ly-big-number span{font-size:38px}`,
      `<div class="ly-big-number"><b>87%</b><span>的長輩希望在熟悉的社區終老</span></div>`],
    ['stats-row', '數據三連', '三個數字並排', `.ly-stats-row{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;text-align:center}.ly-stats-row b{display:block;font-size:110px;color:var(--accent);line-height:1.1;font-family:var(--hf,var(--tp-hf))}.ly-stats-row span{font-size:26px;color:var(--muted)}`,
      `<div class="ly-stats-row"><div><b>120</b><span>位參與長輩</span></div><div><b>36</b><span>場次活動</span></div><div><b>95%</b><span>滿意度</span></div></div>`],
    ['quote', '金句頁', '置中大引言', `.ly-quote{text-align:center;padding:0 60px}.ly-quote q{display:block;font-size:56px;line-height:1.5;font-family:var(--hf,var(--tp-hf));quotes:'「' '」'}.ly-quote cite{display:block;margin-top:26px;font-size:26px;color:var(--accent);font-style:normal}`,
      `<div class="ly-quote"><q>照顧別人之前，先照顧好自己。</q><cite>— 照顧者的提醒</cite></div>`],
    ['comparison', '比較對照', 'A vs B 左右對照', `.ly-comparison{display:grid;grid-template-columns:1fr auto 1fr;gap:30px;align-items:stretch}.ly-comparison .vs{align-self:center;width:90px;height:90px;border-radius:50%;background:var(--accent);color:var(--bg);display:grid;place-items:center;font-size:34px;font-weight:900}.ly-comparison .ly-card ul{font-size:28px}`,
      `<div class="ly-comparison"><div class="ly-card"><h3>過去</h3><ul><li>紙本紀錄</li><li>人工統計</li></ul></div><div class="vs">VS</div><div class="ly-card"><h3>現在</h3><ul><li>平板即時輸入</li><li>自動產生報表</li></ul></div></div>`],
    ['split-color', '色塊分割', '左側色塊放標題', `.ly-split-color{position:absolute!important;inset:0;display:grid;grid-template-columns:40% 1fr}.ly-split-color .l{background:var(--accent);color:var(--bg);padding:72px;display:flex;align-items:center}.ly-split-color .l h1{color:inherit}.ly-split-color .r{padding:72px;display:flex;flex-direction:column;justify-content:center}`,
      `<div class="ly-split-color"><div class="l"><h1>本章重點</h1></div><div class="r"><ul><li>重點一的說明</li><li>重點二的說明</li><li>重點三的說明</li></ul></div></div>`],
    ['hero-left', '標題左置', '大標在左、條列在右', `.ly-hero-left{display:grid;grid-template-columns:1fr 1.2fr;gap:64px;align-items:center}.ly-hero-left h1{font-size:76px}`,
      `<div class="ly-hero-left"><h1>三個改變</h1><ul><li>從被動照顧到主動參與</li><li>從單打獨鬥到團隊合作</li><li>從經驗判斷到數據決策</li></ul></div>`],
    ['sidebar', '主文 + 側欄', '主內容加一條註解側欄', `.ly-sidebar{display:grid;grid-template-columns:1fr 320px;gap:48px}.ly-sidebar aside{border-left:4px solid var(--accent);padding-left:26px}.ly-sidebar aside p{font-size:22px}`,
      `<div class="ly-sidebar"><div><h1>主要內容</h1><p>這一頁的重點說明寫在這裡，篇幅可以長一點。</p></div><aside><h2>補充</h2><p>資料來源、延伸閱讀或小提醒。</p></aside></div>`],
    ['gallery', '照片牆', '六張照片網格', `.ly-gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.ly-gallery .ly-img{height:200px}`,
      `<div class="ly-gallery">${IMG.repeat(6)}</div>`],
    ['mosaic', '不對稱拼貼', '一大兩小的照片排版', `.ly-mosaic{display:grid;grid-template-columns:1.4fr 1fr;grid-template-rows:1fr 1fr;gap:18px;height:520px}.ly-mosaic .ly-img:first-child{grid-row:span 2}`,
      `<div class="ly-mosaic">${IMG.repeat(3)}</div>`],
    ['team', '團隊介紹', '四位成員頭像', `.ly-team{display:grid;grid-template-columns:repeat(4,1fr);gap:30px;text-align:center}.ly-team i{display:block;width:170px;height:170px;margin:0 auto 16px;border-radius:50%;background:color-mix(in srgb,var(--accent) 20%,transparent);border:5px solid var(--accent)}.ly-team b{display:block;font-size:28px}.ly-team span{font-size:20px;color:var(--muted)}`,
      `<div class="ly-team"><div><i></i><b>王小明</b><span>職能治療師</span></div><div><i></i><b>陳美華</b><span>護理師</span></div><div><i></i><b>林大同</b><span>社工師</span></div><div><i></i><b>張雅婷</b><span>營養師</span></div></div>`],
    ['icon-trio', '圖示三重點', '三個圖示 + 標題', `.ly-icon-trio{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;text-align:center}.ly-icon-trio i{display:grid;place-items:center;width:130px;height:130px;margin:0 auto 18px;border-radius:32px;background:var(--accent);color:var(--bg)}.ly-icon-trio b{display:block;font-size:32px}.ly-icon-trio span{font-size:22px;color:var(--muted)}`,
      `<div class="ly-icon-trio"><div><i><svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-8-5-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15 12 20 12 20z"/></svg></i><b>關懷</b><span>以人為本</span></div><div><i><svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.2"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6"/></svg></i><b>合作</b><span>跨專業團隊</span></div><div><i><svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/></svg></i><b>成長</b><span>持續改善</span></div></div>`],
    ['steps-flow', '三步驟流程', '步驟 + 箭頭', `.ly-steps-flow{display:flex;align-items:center;gap:20px}.ly-steps-flow .ly-card{flex:1;text-align:center;padding:44px 30px}.ly-steps-flow .ar{font-size:48px;color:var(--accent);font-weight:900}`,
      `<div class="ly-steps-flow"><div class="ly-card"><h3>評估</h3><p>了解現況</p></div><div class="ar">→</div><div class="ly-card"><h3>介入</h3><p>擬定計畫</p></div><div class="ar">→</div><div class="ly-card"><h3>追蹤</h3><p>定期檢視</p></div></div>`],
    ['chart-text', '圖表 + 解讀', '左側圖表、右側重點', `.ly-chart-text{display:grid;grid-template-columns:1.2fr 1fr;gap:56px;align-items:center}.ly-chart-text .bars{display:flex;align-items:flex-end;gap:22px;height:380px;border-bottom:3px solid var(--fg);padding:0 10px}.ly-chart-text .bars i{flex:1;background:var(--accent);border-radius:10px 10px 0 0}`,
      `<div class="ly-chart-text"><div class="bars"><i style="height:35%"></i><i style="height:55%"></i><i style="height:48%"></i><i style="height:80%"></i><i style="height:95%"></i></div><div><h1>持續成長</h1><p>五年來參與人數成長近三倍，以第四年增幅最大。</p></div></div>`],
    ['qa', '問答頁', '大問號 + Q&A', `.ly-qa{display:flex;align-items:center;gap:60px}.ly-qa b{font-size:300px;line-height:1;color:var(--accent);font-family:var(--hf,var(--tp-hf))}.ly-qa h1{font-size:80px}`,
      `<div class="ly-qa"><b>?</b><div><h1>Q &amp; A</h1><p>歡迎提問與交流</p></div></div>`],
    ['thanks', '感謝頁', '結尾致謝 + 聯絡方式', `.ly-thanks{text-align:center;display:grid;gap:20px}.ly-thanks h1{font-size:110px}.ly-thanks .c{display:flex;justify-content:center;gap:40px;font-size:24px;color:var(--muted)}`,
      `<div class="ly-thanks"><h1>謝謝聆聽</h1><h2>Thank you</h2><div class="c"><span>✉ hello@example.com</span><span>☎ 02-1234-5678</span></div></div>`],
    ['cover-bold', '色塊封面', '整頁主色底的強烈封面', `.ly-cover-bold{position:absolute!important;inset:0;background:var(--accent);color:var(--bg);display:flex;flex-direction:column;justify-content:flex-end;padding:90px 96px}.ly-cover-bold h1{color:var(--bg);font-size:96px;line-height:1.1}.ly-cover-bold p{color:var(--bg);opacity:.8;font-size:28px;margin-top:20px}.ly-cover-bold small{font-size:18px;letter-spacing:.3em;opacity:.75;margin-bottom:18px}`,
      `<div class="ly-cover-bold"><small>2026 社區健康講座</small><h1>好好生活，<br>從今天開始</h1><p>講者：王小明　職能治療師</p></div>`],
    ['bento', '便當盒格狀', '大小不一的方格拼成一頁，現代感', `.ly-bento{display:grid;grid-template-columns:1.3fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:20px;height:540px}.ly-bento .ly-card{display:flex;flex-direction:column;justify-content:flex-end}.ly-bento .big{grid-row:span 2;background:var(--accent);border:0}.ly-bento .big h3,.ly-bento .big p{color:var(--bg)}.ly-bento .big h3{font-size:48px}.ly-bento .wide{grid-column:span 2}`,
      `<div class="ly-bento"><div class="ly-card big"><h3>三大成果</h3><p>一年來的改變</p></div><div class="ly-card"><h3>120 人</h3><p>參與長輩</p></div><div class="ly-card"><h3>36 場</h3><p>活動場次</p></div><div class="ly-card wide"><h3>95% 滿意度</h3><p>家屬回饋：長輩變開朗了</p></div></div>`],
    ['numbered-rows', '大編號清單頁', '01／02／03 大編號逐列說明', `.ly-numbered-rows>div{display:grid;grid-template-columns:150px 1fr;align-items:baseline;padding:22px 0;border-bottom:1px solid color-mix(in srgb,var(--fg) 15%,transparent)}.ly-numbered-rows b{font-family:var(--hf,var(--tp-hf));font-size:68px;line-height:1;color:var(--accent)}.ly-numbered-rows h3{margin:0;font-size:38px}.ly-numbered-rows p{font-size:24px;margin-top:6px}`,
      `<div class="ly-numbered-rows"><div><b>01</b><div><h3>每天量血壓</h3><p>起床後一小時內、吃藥前</p></div></div><div><b>02</b><div><h3>少鹽少油</h3><p>外食時請店家少放醬料</p></div></div><div><b>03</b><div><h3>按時服藥</h3><p>不自行停藥或加量</p></div></div></div>`],
    ['image-bleed', '圖片滿邊', '左文右圖，圖片貼齊右邊與上下', `.ly-image-bleed{position:absolute!important;inset:0;display:grid;grid-template-columns:1fr 46%}.ly-image-bleed .t{padding:72px 64px 72px 96px;display:flex;flex-direction:column;justify-content:center;gap:22px}.ly-image-bleed .ly-img{border-radius:0;min-height:100%}`,
      `<div class="ly-image-bleed"><div class="t"><h2>現場紀錄</h2><h1>一起動起來的下午</h1><p>二十位長輩一起完成第一次的團體健走。</p></div>${IMG}</div>`],
    ['quote-portrait', '人物金句', '圓形人像＋一句話＋姓名', `.ly-quote-portrait{display:grid;grid-template-columns:300px 1fr;gap:64px;align-items:center}.ly-quote-portrait i{width:300px;height:300px;border-radius:50%;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 35%,var(--bg)),color-mix(in srgb,var(--accent) 12%,var(--bg)))}.ly-quote-portrait q{display:block;font-family:var(--hf,var(--tp-hf));font-size:46px;line-height:1.5;quotes:'「' '」'}.ly-quote-portrait b{display:block;margin-top:24px;font-size:26px;color:var(--accent)}.ly-quote-portrait span{font-size:20px;color:var(--muted)}`,
      `<div class="ly-quote-portrait"><i></i><div><q>來這裡之後，我每天都很期待出門。</q><b>林奶奶</b><span>82 歲・參加兩年</span></div></div>`],
    ['timeline', '時間軸頁', '橫向時間軸，四個重要節點', `.ly-timeline{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;position:relative;padding-top:20px}.ly-timeline::before{content:'';position:absolute;left:0;right:0;top:40px;height:3px;background:color-mix(in srgb,var(--accent) 30%,transparent)}.ly-timeline>div{position:relative;padding-top:56px}.ly-timeline>div::before{content:'';position:absolute;left:0;top:8px;width:24px;height:24px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 8px var(--bg)}.ly-timeline b{display:block;font-family:var(--hf,var(--tp-hf));font-size:46px;color:var(--accent)}.ly-timeline p{font-size:24px;margin-top:8px}`,
      `<div class="ly-timeline"><div><b>2019</b><p>計畫啟動</p></div><div><b>2021</b><p>第一個據點</p></div><div><b>2023</b><p>擴展十據點</p></div><div><b>2026</b><p>全面數位化</p></div></div>`],
  ];
  LIB.items.layouts = L.map(([k, name, desc, css, html]) => ({ id: 'ly-' + k, name, desc, css, html, tags: ['版面'] }));
})();
