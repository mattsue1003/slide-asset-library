/* 簡報素材庫：標題文字效果、項目符號、圖片樣式、動畫節奏、出現順序 */
window.LIB = window.LIB || { items: {} };
(function () {
  const A = 'var(--accent)', FG = 'var(--fg)', BG = 'var(--bg)';
  const MIX = (p) => `color-mix(in srgb,var(--accent) ${p}%,transparent)`;

  /* 範例圖片（SVG 風景，內嵌免下載） */
  LIB.sampleImg = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ec5fc"/><stop offset="1" stop-color="#e0c3fc"/></linearGradient></defs><rect width="800" height="500" fill="url(#s)"/><circle cx="600" cy="140" r="60" fill="#ffd36e"/><path d="M0 360 L180 220 L330 330 L480 200 L800 380 V500 H0z" fill="#6a8d73"/><path d="M0 420 C 200 360, 400 460, 800 400 V500 H0z" fill="#3e6b4f"/></svg>`);

  /* ---------- 標題文字效果（作用在投影片標題 h1） ---------- */
  const TE = [
    ['shadow-soft', '柔和陰影', '淡淡的投影，讓標題浮起來', 'text-shadow:0 6px 18px rgba(0,0,0,.18)'],
    ['shadow-hard', '主色硬陰影', '用主色做實心位移陰影', `text-shadow:5px 5px 0 ${A}`],
    ['outline', '空心字', '只留外框線條', `color:transparent;-webkit-text-stroke:2px ${FG}`],
    ['gradient', '主色漸層字', '主色到文字色的漸層', `width:fit-content;max-width:100%;background:linear-gradient(90deg,${A},${FG});-webkit-background-clip:text;background-clip:text;color:transparent`],
    ['marker', '螢光筆劃線', '標題下半部塗上主色螢光', `width:fit-content;max-width:100%;background:linear-gradient(transparent 58%,${MIX(35)} 58%)`],
    ['underline-bar', '粗底線', '整條粗底線', `width:fit-content;max-width:100%;border-bottom:8px solid ${A};padding-bottom:8px`],
    ['underline-short', '短橫線', '標題下方一小段主色線', `padding-bottom:22px;background:linear-gradient(${A},${A}) 0 100%/110px 8px no-repeat`],
    ['underline-wavy', '波浪底線', '活潑的波浪線', `text-decoration:underline wavy ${A} 3px;text-underline-offset:16px`],
    ['underline-double', '雙底線', '正式感的雙線', `text-decoration:underline double ${A};text-decoration-thickness:4px;text-underline-offset:14px`],
    ['side-bar', '左側直條', '左邊一條主色直線', `border-left:14px solid ${A};padding-left:26px`],
    ['box', '色塊標籤', '整個標題放進主色色塊', `width:fit-content;max-width:100%;background:${A};color:${BG};padding:6px 28px;border-radius:10px`],
    ['box-tilt', '傾斜貼紙', '微微傾斜的色塊', `width:fit-content;max-width:100%;background:${A};color:${BG};padding:6px 28px;border-radius:6px;transform:rotate(-2deg)`],
    ['brush', '手繪色塊', '不規則圓角的淡色塊', `width:fit-content;max-width:100%;background:${MIX(22)};padding:4px 26px;border-radius:255px 15px 225px 15px/15px 225px 15px 255px`],
    ['outline-box', '外框標籤', '主色細框框住標題', `width:fit-content;max-width:100%;border:4px solid ${A};padding:6px 26px;border-radius:12px`],
    ['top-bar', '上方色條', '標題上方一小段色條', `padding-top:26px;background:linear-gradient(${A},${A}) 0 0/80px 8px no-repeat`],
    ['spaced', '寬字距', '字距拉開，大氣沉穩', 'letter-spacing:.18em'],
    ['quote', '引號括起', '用「」把標題括起來', '', `$S::before{content:'「';color:${A}}$S::after{content:'」';color:${A}}`],
    ['accent-color', '主色標題', '標題直接用主色', `color:${A}`],
    ['dot-end', '句點強調', '標題後面加一顆主色圓點', '', `$S::after{content:'';display:inline-block;width:.22em;height:.22em;margin-left:.12em;border-radius:50%;background:${A}}`],
    ['heavy', '粗黑緊排', '超粗字重、字距收緊，最有力量', 'font-weight:900;letter-spacing:-.03em'],
    ['first-letter', '首字放大', '第一個字用主色放大', '', `$S::first-letter{color:${A};font-size:1.35em}`],
    ['gradient-bar', '漸層底線', '主色漸層的粗底線', `width:fit-content;max-width:100%;padding-bottom:14px;background:linear-gradient(90deg,${A},transparent) 0 100%/100% 8px no-repeat`],
    ['marker-tilt', '斜筆刷', '略微傾斜的螢光筆刷', 'width:fit-content;max-width:100%', `$S::before{content:'';position:absolute;left:-12px;right:-12px;bottom:6%;height:42%;background:${MIX(30)};transform:rotate(-1.5deg);z-index:-1;border-radius:6px}`],
    ['kicker', '小標線引導', '標題前方一段主色短線', '', `$S::before{content:'';display:inline-block;width:56px;height:6px;margin-right:22px;vertical-align:middle;background:${A};border-radius:3px}`],
    ['rule-both', '兩側細線', '標題兩側延伸細線，典雅置中', 'display:flex;align-items:center;gap:28px', `$S::before,$S::after{content:'';flex:1;height:2px;background:${MIX(50)}}`],
  ];
  LIB.items.titleEffects = TE.map(([k, name, desc, decl, extra]) => {
    const id = 'te-' + k, S = `.slide.${id}>h1`;
    return { id, name, desc, decl, tags: ['標題'], css: `${S}{${decl}}${extra ? '\n' + extra.replace(/\$S/g, S) : ''}` };
  });

  /* ---------- 項目符號（作用在投影片條列 ul > li） ---------- */
  const RESET = `content:'';position:absolute;left:0;top:.42em;width:16px;height:16px;border-radius:50%;background:${A};border:0;transform:none;clip-path:none;color:${A};line-height:1;font-weight:900;display:block;text-align:center;`;
  const TXT = (ch, size = '1em', top = '.2em') => `content:'${ch}';background:none;width:auto;height:auto;border-radius:0;top:${top};font-size:${size}`;
  const BL = [
    ['dot', '圓點', '基本實心圓點', ''],
    ['ring', '空心圓', '圓圈外框', `background:none;border:4px solid ${A};width:18px;height:18px`],
    ['square', '方塊', '實心小方塊', 'border-radius:3px'],
    ['diamond', '菱形', '旋轉 45 度的方塊', 'border-radius:2px;transform:rotate(45deg);width:14px;height:14px'],
    ['triangle', '三角形', '指向右邊的三角', 'border-radius:0;clip-path:polygon(0 0,100% 50%,0 100%);width:16px;height:18px'],
    ['dash', '短橫線', '簡潔的一字線', 'border-radius:2px;width:22px;height:5px;top:.68em'],
    ['pill', '膠囊', '圓角長條', 'border-radius:99px;width:24px;height:12px;top:.55em'],
    ['check', '勾勾', '打勾，適合完成清單', TXT('✓')],
    ['check-circle', '圓圈勾勾', '主色圓底白勾', `content:'✓';width:28px;height:28px;top:.15em;color:#fff;font-size:18px;line-height:28px`],
    ['arrow', '箭頭', '→ 指向重點', TXT('→')],
    ['chevron', '尖角', '› 簡約尖角', TXT('›', '1.5em', '-.12em')],
    ['star', '星星', '★ 重點星號', TXT('★', '.9em', '.24em')],
    ['heart', '愛心', '♥ 溫暖柔和', TXT('♥', '.9em', '.24em')],
    ['plus', '加號', '＋ 補充、優點', TXT('+', '1.2em', '.05em')],
    ['number', '數字圓圈', '1、2、3 圓形編號', `content:counter(bl);width:32px;height:32px;top:.1em;color:#fff;font-size:18px;line-height:32px`, `$U{counter-reset:bl}$U>li{counter-increment:bl;padding-left:52px}`],
    ['number-plain', '數字編號', '01、02、03 大數字', `content:counter(bl,decimal-leading-zero);background:none;width:auto;height:auto;border-radius:0;top:.08em;font-size:.9em`, `$U{counter-reset:bl}$U>li{counter-increment:bl;padding-left:56px}`],
    ['letter', '英文字母', 'A、B、C 選項式編號', `content:counter(bl,upper-alpha);width:32px;height:32px;top:.1em;border-radius:8px;color:#fff;font-size:18px;line-height:32px`, `$U{counter-reset:bl}$U>li{counter-increment:bl;padding-left:52px}`],
    ['card', '卡片條列', '每一項變成淡色卡片', 'top:50%;margin-top:-8px;left:22px', `$U>li{background:${MIX(10)};border-radius:14px;padding:14px 22px 14px 56px}`],
    ['line-left', '左側直線', '每項左邊一條主色線', 'border-radius:2px;width:6px;height:100%;top:0', `$U>li{padding-left:30px}`],
    ['none', '無符號', '不要項目符號，只留文字', 'display:none', `$U>li{padding-left:0}`],
    ['num-square', '數字方塊', '方形底的編號', `content:counter(bl);width:32px;height:32px;top:.1em;border-radius:8px;color:#fff;font-size:18px;line-height:32px`, `$U{counter-reset:bl}$U>li{counter-increment:bl;padding-left:52px}`],
    ['check-soft', '淡底勾勾', '淡色圓底＋主色勾', `content:'✓';width:30px;height:30px;top:.12em;background:${MIX(18)};color:${A};font-size:17px;line-height:30px`, `$U>li{padding-left:50px}`],
    ['arrow-circle', '圓圈箭頭', '主色圓圈裡的箭頭', `content:'→';width:30px;height:30px;top:.12em;color:#fff;font-size:17px;line-height:30px`, `$U>li{padding-left:50px}`],
    ['timeline', '時間線串連', '圓點之間用細線串起來', `width:16px;height:16px;top:.45em;box-shadow:0 0 0 5px ${MIX(20)}`, `$U{gap:0!important}$U>li{padding:0 0 26px 44px}$U>li::after{content:'';position:absolute;left:7px;top:1.25em;bottom:-.3em;width:2px;background:${MIX(35)}}$U>li:last-child::after{display:none}`],
    ['divider', '分隔線條列', '不用符號，每項之間細線分隔', 'display:none', `$U{gap:0!important}$U>li{padding:16px 0;border-bottom:1px solid ${MIX(25)}}$U>li:first-child{padding-top:0}`],
  ];
  LIB.items.bullets = BL.map(([k, name, desc, decl, extra]) => {
    const id = 'bl-' + k, U = `.slide.${id}>ul`;
    return { id, name, desc, tags: ['條列'], css: `${U}>li::before{${RESET}${decl}}${extra ? '\n' + extra.replace(/\$U/g, U) : ''}` };
  });

  /* ---------- 圖片樣式（作用在投影片圖片 img） ---------- */
  const IR = 'border-radius:0;box-shadow:none;filter:none;transform:none;border:0;padding:0;background:none;outline:0;clip-path:none;';
  const IM = [
    ['plain', '原圖直角', '不加任何效果', ''],
    ['rounded', '圓角', '柔和的圓角', 'border-radius:24px'],
    ['circle', '圓形', '裁成正圓，適合人物頭像', 'border-radius:50%;aspect-ratio:1;width:auto;height:420px;object-fit:cover'],
    ['arch', '拱門', '上方圓弧的拱形', 'border-radius:999px 999px 20px 20px;aspect-ratio:3/4;width:auto;height:440px;object-fit:cover'],
    ['blob', '流體形', '不規則有機圓角', 'border-radius:42% 58% 63% 37%/45% 38% 62% 55%;aspect-ratio:1;width:auto;height:420px;object-fit:cover'],
    ['shadow', '浮起陰影', '大範圍柔和陰影', 'border-radius:16px;box-shadow:0 24px 50px rgba(0,0,0,.25)'],
    ['polaroid', '拍立得', '白邊相框加陰影', 'background:#fff;padding:16px 16px 60px;box-shadow:0 14px 30px rgba(0,0,0,.2);transform:rotate(-3deg)'],
    ['frame-white', '白框', '寬白邊相框', 'border:14px solid #fff;box-shadow:0 8px 24px rgba(0,0,0,.18)'],
    ['frame-accent', '主色外框', '用主色當相框', `border:10px solid ${A};border-radius:16px`],
    ['frame-double', '雙線框', '內外兩層框線', `border:4px solid ${A};outline:2px solid ${A};outline-offset:10px;border-radius:6px`],
    ['offset', '錯位色塊', '後方一塊主色錯位', `border-radius:12px;box-shadow:18px 18px 0 ${A}`],
    ['stack', '相片疊放', '後面疊了兩張相片', 'border-radius:8px;box-shadow:12px -10px 0 -2px #fff,12px -10px 0 0 rgba(0,0,0,.15),24px -20px 0 -2px #fff,24px -20px 0 0 rgba(0,0,0,.12)'],
    ['tilt-left', '向左傾斜', '輕鬆隨性的擺放', 'border-radius:12px;transform:rotate(-4deg);box-shadow:0 10px 24px rgba(0,0,0,.18)'],
    ['grayscale', '黑白', '懷舊、嚴肅主題', 'border-radius:12px;filter:grayscale(1)'],
    ['sepia', '老照片', '泛黃的懷舊色調', 'border-radius:12px;filter:sepia(.75) contrast(1.05)'],
    ['vintage', '復古底片', '低飽和、偏暖', 'border-radius:12px;filter:sepia(.35) saturate(.8) contrast(1.1) brightness(1.05)'],
    ['vivid', '鮮豔', '提高飽和度與對比', 'border-radius:12px;filter:saturate(1.45) contrast(1.08)'],
    ['soft-focus', '柔焦', '夢幻柔焦、微微朦朧', 'border-radius:12px;filter:blur(1.2px) brightness(1.08) saturate(1.15) contrast(.92)'],
    ['bright', '明亮柔和', '提亮、降低對比', 'border-radius:12px;filter:brightness(1.12) contrast(.92)'],
    ['squircle', '大圓角', '更圓潤的現代圓角', 'border-radius:40px'],
    ['inner-frame', '內嵌白框', '照片內側一圈白線，精緻感', 'border-radius:14px;outline:3px solid rgba(255,255,255,.85);outline-offset:-18px'],
    ['fade-edge', '底部漸隱', '照片下緣慢慢淡出到背景', '-webkit-mask-image:linear-gradient(#000 55%,transparent);mask-image:linear-gradient(#000 55%,transparent)'],
    ['cinematic', '電影寬銀幕', '寬畫幅、略低飽和的電影感', 'aspect-ratio:21/9;width:auto;height:300px;object-fit:cover;border-radius:6px;filter:saturate(.85) contrast(1.08)'],
    ['pill', '膠囊形', '左右全圓的長條裁切', 'aspect-ratio:2/1;width:auto;height:280px;object-fit:cover;border-radius:999px'],
  ];
  LIB.items.imageStyles = IM.map(([k, name, desc, decl]) => {
    const id = 'im-' + k;
    return { id, name, desc, tags: ['圖片'], css: `.slide.${id}>img{${IR}${decl}}` };
  });

  /* ---------- 動畫節奏（速度曲線 easing） ---------- */
  const EZ = [
    ['linear', '等速', '從頭到尾同樣速度，機械感', 'linear', [0, 0, 1, 1]],
    ['ease', '自然', '瀏覽器預設，慢—快—慢', 'ease', [.25, .1, .25, 1]],
    ['ease-in', '漸快', '起步慢、越來越快', 'ease-in', [.42, 0, 1, 1]],
    ['ease-out', '漸慢', '一開始快、慢慢停下（最常用）', 'ease-out', [0, 0, .58, 1]],
    ['ease-in-out', '慢快慢', '起步和結尾都放慢', 'ease-in-out', [.42, 0, .58, 1]],
    ['soft-out', '柔滑停下', '比漸慢更柔和的煞車', 'cubic-bezier(.22,1,.36,1)', [.22, 1, .36, 1]],
    ['quick-out', '急停', '衝出去再快速停住', 'cubic-bezier(.16,1,.3,1)', [.16, 1, .3, 1]],
    ['smooth', '絲滑', '對稱的平順曲線', 'cubic-bezier(.65,0,.35,1)', [.65, 0, .35, 1]],
    ['sharp', '銳利', '中段很快，有力量感', 'cubic-bezier(.87,0,.13,1)', [.87, 0, .13, 1]],
    ['back-out', '衝過頭回彈', '超過終點一點再回來', 'cubic-bezier(.34,1.56,.64,1)', [.34, 1.56, .64, 1]],
    ['back-in-out', '前後都彈', '起步後退、結尾超過', 'cubic-bezier(.68,-.6,.32,1.6)', [.68, -.6, .32, 1.6]],
    ['sine-out', '輕柔減速', '非常溫和的減速', 'cubic-bezier(.61,1,.88,1)', [.61, 1, .88, 1]],
    ['quart-out', '有力減速', '明顯的快進慢停', 'cubic-bezier(.25,1,.5,1)', [.25, 1, .5, 1]],
    ['expo-out', '閃現停下', '瞬間到位再慢慢停', 'cubic-bezier(.19,1,.22,1)', [.19, 1, .22, 1]],
    ['expo-in', '蓄力爆發', '很慢起步，最後爆衝', 'cubic-bezier(.95,.05,.8,.04)', [.95, .05, .8, .04]],
    ['circ-in-out', '圓弧進出', '兩端特別慢的圓弧曲線', 'cubic-bezier(.85,0,.15,1)', [.85, 0, .15, 1]],
    ['elastic', '彈簧', '像彈簧一樣抖動停下', 'linear(0,.22,.62,.98,1.2,1.24,1.15,1.01,.92,.9,.94,.99,1.03,1.03,1.01,1,.99,1)'],
    ['bounce', '落地彈跳', '像球落地彈幾下', 'linear(0,.06,.23,.52,.92,.8,.75,.8,.95,.92,.9,.92,.99,.98,.97,1)'],
  ];
  LIB.items.easings = EZ.map(([k, name, desc, value, bz]) => ({
    id: 'ez-' + k, name, desc, value, bz, tags: [value.startsWith('linear(') ? '彈性' : value.startsWith('steps') ? '格狀' : '曲線'],
    css: `/* 把這個速度曲線套到任何動畫或轉場 */\n.ez-${k}{animation-timing-function:${value};transition-timing-function:${value}}`,
  }));

  /* ---------- 出現順序（同一頁元素的進場時間） ---------- */
  const SQ = [
    ['stagger', '逐一出現', '由上而下，一個接一個（預設）', 'i*.16+.25'],
    ['together', '同時出現', '全部一起出現', '.25'],
    ['fast', '快速連發', '間隔很短，節奏明快', 'i*.07+.2'],
    ['slow', '慢慢逐一', '每項間隔較久，適合講解', 'i*.45+.3'],
    ['title-first', '標題先，內容一起', '標題先出現，其餘一起出現', 'i===0?.2:.75'],
    ['reverse', '由下往上', '最下面的先出現', '(n-1-i)*.16+.25'],
    ['center-out', '由中間往外', '中間的先出現，再往兩側', 'Math.abs(i-(n-1)/2)*.2+.25'],
    ['wave', '波浪節奏', '一快一慢交錯出現', 'i*.12+(i%2)*.18+.2'],
    ['random', '隨機出現', '每次順序都不一樣', 'Math.random()*.9+.2'],
    ['speed-up', '越來越快', '一開始慢，後面加速出現', '(1-Math.pow(.82,i))*2.2+.25'],
    ['slow-down', '越來越慢', '一開始快，後面放慢', 'i*i*.07+.25'],
    ['pairs', '兩兩一組', '每兩項一起出現', 'Math.floor(i/2)*.4+.25'],
    ['finale', '最後壓軸', '前面依序出現，最後一項停一下再登場', 'i===n-1?i*.15+.9:i*.15+.25'],
    ['title-late', '內容先、標題後', '先出內容，標題最後揭曉', 'i===0?(n-1)*.15+.6:(i-1)*.15+.25'],
    ['odd-even', '奇偶交替', '單數先出，再出雙數', '(i%2)*.7+Math.floor(i/2)*.12+.25'],
    ['click', '點一下出現一個', '講者按一下才出下一項（像 PPT 的動畫逐步出現）', 'i===0?.2:0', true],
  ];
  LIB.items.sequences = SQ.map(([k, name, desc, fn, click]) => ({
    id: 'sq-' + k, name, desc, fn, click: !!click, tags: [click ? '手動' : '自動'],
    js: click
      ? `// 點一下出現一個：換到投影片時先把標題以外的元素藏起來，之後每按一次「下一頁」先顯示下一個元素\nfunction sequenceStart(slide){slide.querySelectorAll('.anim').forEach(function(e,i){if(i>0)e.style.visibility='hidden'})}\nfunction sequenceNext(slide){var e=[].find.call(slide.querySelectorAll('.anim'),function(x){return x.style.visibility==='hidden'});if(!e)return false;e.style.visibility='';e.style.animation='none';void e.offsetWidth;e.style.animation='';return true}`
      : `// 換到這張投影片時呼叫：依「${name}」設定每個 .anim 元素的動畫延遲\nfunction applySequence(slide){var els=slide.querySelectorAll('.anim'),n=els.length;els.forEach(function(e,i){e.style.animationDelay=(${fn})+'s'})}`,
  }));
})();
