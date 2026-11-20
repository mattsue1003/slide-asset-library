/* 簡報素材庫：字型、轉場、畫面動畫、音效 */
window.LIB = window.LIB || { items: {} };

/* ---------- 字型 ---------- */
(function () {
  // [family, 顯示名稱, 分組, weights(null=僅 400), 備註]
  const F = [
    ['Noto Sans TC', '思源黑體', '中文黑體', '400;700;900', '最穩定的繁中黑體，內文與標題都適用'],
    ['Chiron Hei HK', '昭源黑體', '中文黑體', null, '筆畫較現代、字面略大，適合標題'],
    ['Huninn', '粉圓體', '中文圓體', null, '親切圓潤，適合長者、兒童與衛教簡報'],
    ['Chiron GoRound TC', '昭源圓體', '中文圓體', null, '圓角黑體，比粉圓更俐落'],
    ['Noto Serif TC', '思源宋體', '中文明體', '400;700;900', '正式、典雅，適合學術與文化主題'],
    ['Chiron Sung HK', '昭源宋體', '中文明體', null, '較有書卷氣的宋體'],
    ['Cactus Classical Serif', '仙人掌明體', '中文明體', null, '古典刻本風格，適合人文歷史'],
    ['LXGW WenKai TC', '霞鶩文楷', '中文手寫', '400;700', '楷書手寫感，溫暖好讀'],
    ['LXGW WenKai Mono TC', '霞鶩文楷等寬', '中文手寫', null, '等寬文楷，適合對齊表格或程式碼註解'],
    ['Iansui', '芫荽', '中文手寫', null, '清秀手寫風，適合故事、回憶類簡報'],
    ['Bpmf Huninn', '粉圓注音', '中文注音', null, '字旁自帶注音，適合兒童識字'],
    ['Bpmf Zihi Kai Std', '字嗨注音楷', '中文注音', null, '楷書附注音'],
    ['Ma Shan Zheng', '馬善政毛筆', '中文書法', null, '毛筆楷書（以簡中為主，部分繁體字會由系統字型替代）'],
    ['Zen Maru Gothic', 'Zen 丸黑', '日文字型', '400;700', '日系圓體（部分繁體字會由系統字型替代）'],
    ['Klee One', 'Klee 教科書體', '日文字型', null, '日式鉛筆教科書感'],
    ['Dela Gothic One', 'Dela 粗黑', '日文字型', null, '超粗黑體，大標題很有力'],
    ['Inter', 'Inter', '英文無襯線', '400;700;900', '最常見的介面字型，清楚中性'],
    ['Montserrat', 'Montserrat', '英文無襯線', '400;700;900', '幾何感，標題大氣'],
    ['Poppins', 'Poppins', '英文無襯線', '400;700', '圓潤幾何，親切現代'],
    ['Space Grotesk', 'Space Grotesk', '英文無襯線', '400;700', '科技感'],
    ['Oswald', 'Oswald', '英文無襯線', '400;700', '窄長粗體，適合數字與標語'],
    ['Bebas Neue', 'Bebas Neue', '英文展示', null, '全大寫海報字'],
    ['Archivo Black', 'Archivo Black', '英文展示', null, '厚重有力'],
    ['Fredoka', 'Fredoka', '英文展示', '400;700', '圓滾滾、童趣'],
    ['Playfair Display', 'Playfair Display', '英文襯線', '400;700;900', '高對比襯線，雜誌感'],
    ['DM Serif Display', 'DM Serif Display', '英文襯線', null, '優雅標題'],
    ['Abril Fatface', 'Abril Fatface', '英文襯線', null, '粗襯線海報字'],
    ['Roboto Slab', 'Roboto Slab', '英文襯線', '400;700', '粗襯線，穩重'],
    ['Cinzel', 'Cinzel', '英文襯線', '400;700', '羅馬碑文，典禮、頒獎'],
    ['Pacifico', 'Pacifico', '英文手寫', null, '海灘休閒感'],
    ['Caveat', 'Caveat', '英文手寫', '400;700', '自然筆記手寫'],
    ['Dancing Script', 'Dancing Script', '英文手寫', '400;700', '優雅連筆'],
    ['Permanent Marker', 'Permanent Marker', '英文手寫', null, '粗麥克筆'],
    ['Chocolate Classical Sans', '朱古力黑體', '中文黑體', null, '圓潤現代的繁中黑體，親和又俐落'],
    ['Manrope', 'Manrope', '英文無襯線', '400;700', '現代幾何，數字特別好看'],
    ['Plus Jakarta Sans', 'Plus Jakarta Sans', '英文無襯線', '400;700', '柔和現代，科技新創常用'],
    ['Outfit', 'Outfit', '英文無襯線', '400;700', '圓潤幾何，大標很有質感'],
    ['Sora', 'Sora', '英文無襯線', '400;700', '寬體科技感'],
    ['Fraunces', 'Fraunces', '英文襯線', '400;700;900', '有溫度的現代襯線，大標超有設計感'],
    ['Instrument Serif', 'Instrument Serif', '英文襯線', null, '細緻優雅的編輯風襯線'],
    ['Cormorant Garamond', 'Cormorant Garamond', '英文襯線', '400;700', '經典優雅，人文、典禮'],
    ['Libre Baskerville', 'Libre Baskerville', '英文襯線', '400;700', '書卷感，好讀穩重'],
  ];
  const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  LIB.fontLink = (family, weights) =>
    `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}${weights ? ':wght@' + weights : ''}&display=swap`;
  LIB.items.fonts = F.map(([family, name, group, weights, desc]) => {
    const id = 'ft-' + slug(family);
    const fallback = /英文/.test(group) ? 'sans-serif' : (/明體|襯線/.test(group) ? 'serif' : 'sans-serif');
    return {
      id, name: name === family ? family : `${name}（${family}）`, group, desc, family, weights,
      tags: [group],
      head: `<link rel="stylesheet" href="${LIB.fontLink(family, weights)}">`,
      css: `.${id}{font-family:'${family}',${fallback};}`,
      html: `<div class="${id}" style="font-size:34px;line-height:1.3">簡報標題 Aa 123</div>`,
    };
  });
})();

/* ---------- 轉場（換頁效果） ---------- */
(function () {
  // [id, 名稱, 說明, in keyframes, out keyframes(null=原地保持), 秒數, easing, outTop]
  const P = 'perspective(1200px)';
  const T = [
    ['fade', '淡入淡出', '最安全、最不搶戲的換頁', 'from{opacity:0}to{opacity:1}', 'from{opacity:1}to{opacity:0}', .6, 'ease'],
    ['push-left', '向左推移', '新頁從右推入、舊頁往左離開', 'from{transform:translateX(100%)}to{transform:none}', 'from{transform:none}to{transform:translateX(-100%)}', .6, 'cubic-bezier(.65,0,.35,1)'],
    ['push-right', '向右推移', '適合「回顧上一段」', 'from{transform:translateX(-100%)}to{transform:none}', 'from{transform:none}to{transform:translateX(100%)}', .6, 'cubic-bezier(.65,0,.35,1)'],
    ['push-up', '向上推移', '像捲動網頁一樣往下讀', 'from{transform:translateY(100%)}to{transform:none}', 'from{transform:none}to{transform:translateY(-100%)}', .6, 'cubic-bezier(.65,0,.35,1)'],
    ['push-down', '向下推移', '由上而下落入', 'from{transform:translateY(-100%)}to{transform:none}', 'from{transform:none}to{transform:translateY(100%)}', .6, 'cubic-bezier(.65,0,.35,1)'],
    ['cover', '覆蓋', '新頁滑入蓋住舊頁', 'from{transform:translateX(100%);box-shadow:-30px 0 60px rgba(0,0,0,.3)}to{transform:none;box-shadow:-30px 0 60px rgba(0,0,0,0)}', null, .6, 'cubic-bezier(.22,1,.36,1)'],
    ['uncover', '揭開', '舊頁滑走露出底下的新頁', null, 'from{transform:none}to{transform:translateX(-100%)}', .6, 'cubic-bezier(.65,0,.35,1)', true],
    ['zoom-in', '放大進入', '新頁由小放大，聚焦感', 'from{transform:scale(.6);opacity:0}to{transform:none;opacity:1}', 'from{transform:none;opacity:1}to{transform:scale(1.25);opacity:0}', .6, 'cubic-bezier(.22,1,.36,1)'],
    ['zoom-out', '縮小進入', '從大畫面收進來', 'from{transform:scale(1.4);opacity:0}to{transform:none;opacity:1}', 'from{transform:none;opacity:1}to{transform:scale(.7);opacity:0}', .6, 'cubic-bezier(.22,1,.36,1)'],
    ['elastic', '彈性縮放', '帶一點回彈，活潑', '0%{transform:scale(.3);opacity:0}60%{transform:scale(1.06);opacity:1}80%{transform:scale(.97)}100%{transform:none}', 'from{opacity:1}to{opacity:0}', .8, 'ease-out'],
    ['flip-x', '水平翻轉', '像翻牌一樣左右翻面', `0%,50%{transform:${P} rotateY(90deg);opacity:0}100%{transform:${P} rotateY(0);opacity:1}`, `0%{transform:${P} rotateY(0)}50%,100%{transform:${P} rotateY(-90deg);opacity:0}`, .8, 'ease-in-out'],
    ['flip-y', '垂直翻轉', '上下翻面', `0%,50%{transform:${P} rotateX(-90deg);opacity:0}100%{transform:${P} rotateX(0);opacity:1}`, `0%{transform:${P} rotateX(0)}50%,100%{transform:${P} rotateX(90deg);opacity:0}`, .8, 'ease-in-out'],
    ['cube', '立方體旋轉', '像轉動方塊的側面', `from{transform:${P} translateX(60%) rotateY(70deg);opacity:.4}to{transform:${P};opacity:1}`, `from{transform:${P}}to{transform:${P} translateX(-60%) rotateY(-70deg);opacity:.4}`, .8, 'ease-in-out'],
    ['door', '開門', '以左側為軸，像門一樣轉入', `from{transform:${P} rotateY(-95deg);transform-origin:left center;opacity:0}to{transform:${P};transform-origin:left center;opacity:1}`, 'from{opacity:1}to{opacity:0}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['page-turn', '翻書頁', '舊頁像書頁一樣翻走', null, `from{transform:${P};transform-origin:left center}to{transform:${P} rotateY(-110deg);transform-origin:left center;opacity:.2}`, .9, 'ease-in', true],
    ['blur', '模糊對焦', '由模糊慢慢清晰', 'from{filter:blur(24px);opacity:0}to{filter:none;opacity:1}', 'from{filter:none;opacity:1}to{filter:blur(24px);opacity:0}', .7, 'ease'],
    ['wipe-right', '向右擦拭', '像擦黑板一樣由左到右出現', 'from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}', null, .7, 'cubic-bezier(.65,0,.35,1)'],
    ['wipe-up', '向上擦拭', '由下往上揭露', 'from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}', null, .7, 'cubic-bezier(.65,0,.35,1)'],
    ['circle', '圓形擴散', '從中心圓形展開', 'from{clip-path:circle(0% at 50% 50%)}to{clip-path:circle(75% at 50% 50%)}', null, .8, 'cubic-bezier(.65,0,.35,1)'],
    ['curtain', '拉開布幕', '從中間往兩側打開', 'from{clip-path:inset(0 50% 0 50%)}to{clip-path:inset(0 0 0 0)}', null, .8, 'cubic-bezier(.65,0,.35,1)'],
    ['blinds', '百葉窗', '條狀逐步打開', 'from{--bl:0%}to{--bl:100%}', null, .8, 'ease-in-out', false,
      '-webkit-mask-image:linear-gradient(90deg,#000 var(--bl),transparent 0);mask-image:linear-gradient(90deg,#000 var(--bl),transparent 0);-webkit-mask-size:10% 100%;mask-size:10% 100%;'],
    ['skew', '斜切滑入', '帶速度感的斜向滑入', 'from{transform:translateX(100%) skewX(-25deg);opacity:0}to{transform:none;opacity:1}', 'from{transform:none;opacity:1}to{transform:translateX(-60%) skewX(25deg);opacity:0}', .6, 'cubic-bezier(.22,1,.36,1)'],
    ['flash', '閃白', '像相機閃光，適合揭曉答案', '0%{filter:brightness(4);opacity:0}30%{filter:brightness(3);opacity:1}100%{filter:none}', 'from{filter:none}to{filter:brightness(4);opacity:0}', .6, 'ease-out'],
    ['slide-fade', '輕推淡入', '小幅位移＋淡入，最自然有質感', 'from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}', 'from{opacity:1;transform:none}to{opacity:0;transform:translateX(-60px)}', .6, 'cubic-bezier(.22,1,.36,1)'],
    ['rise', '上浮淡入', '新頁從下方輕輕浮上來', 'from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:none}', 'from{opacity:1}to{opacity:0;transform:translateY(-30px)}', .6, 'cubic-bezier(.22,1,.36,1)'],
    ['scale-fade', '微縮淡入', '新頁從 94% 放大淡入，像 Keynote 的溶解', 'from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}', 'from{opacity:1;transform:none}to{opacity:0;transform:scale(1.04)}', .6, 'cubic-bezier(.22,1,.36,1)'],
    ['fade-through', '淡出再淡入', '先暗下來再出現新頁，適合段落轉換', '0%,45%{opacity:0}100%{opacity:1}', '0%{opacity:1}55%,100%{opacity:0}', .9, 'ease'],
    ['stack', '疊卡', '舊頁往後縮、新頁從下方蓋上來', 'from{transform:translateY(100%)}to{transform:none}', 'from{transform:none;filter:none}to{transform:scale(.9);filter:brightness(.6)}', .7, 'cubic-bezier(.22,1,.36,1)'],
    ['parallax', '視差推移', '新舊頁速度不同，有景深感', 'from{transform:translateX(100%)}to{transform:none}', 'from{transform:none;filter:none}to{transform:translateX(-30%);filter:brightness(.6)}', .7, 'cubic-bezier(.65,0,.35,1)'],
  ];
  LIB.items.transitions = T.map(([k, name, desc, inKF, outKF, dur, ease, outTop, pre]) => {
    const id = 'tr-' + k;
    inKF = inKF || 'from{opacity:1}to{opacity:1}';
    outKF = outKF || 'from{opacity:1}to{opacity:1}';
    const css = (k === 'blinds' ? "@property --bl{syntax:'<percentage>';inherits:false;initial-value:100%}\n" : '') + `@keyframes ${id}-in{${inKF}}\n@keyframes ${id}-out{${outKF}}\n.${id}-in{${pre || ''}animation:${id}-in ${dur}s ${ease} both}\n.${id}-out{animation:${id}-out ${dur}s ${ease} both}`;
    return { id, name, desc, dur, ease, outTop: !!outTop, pre: pre || '', css, tags: ['換頁'] };
  });
})();

/* ---------- 畫面動畫（元素進場／強調／循環） ---------- */
(function () {
  // [id, 名稱, 分組, keyframes, 秒數, easing, loop, 元素預設樣式]
  const A = [
    ['fade-in', '淡入', '進場', 'from{opacity:0}to{opacity:1}', .8, 'ease'],
    ['fade-up', '向上淡入', '進場', 'from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['fade-down', '向下淡入', '進場', 'from{opacity:0;transform:translateY(-40px)}to{opacity:1;transform:none}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['fade-left', '從左淡入', '進場', 'from{opacity:0;transform:translateX(-60px)}to{opacity:1;transform:none}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['fade-right', '從右淡入', '進場', 'from{opacity:0;transform:translateX(60px)}to{opacity:1;transform:none}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['zoom-in', '放大出現', '進場', 'from{opacity:0;transform:scale(.5)}to{opacity:1;transform:none}', .7, 'cubic-bezier(.22,1,.36,1)'],
    ['zoom-out', '縮小出現', '進場', 'from{opacity:0;transform:scale(1.6)}to{opacity:1;transform:none}', .7, 'cubic-bezier(.22,1,.36,1)'],
    ['pop', '彈出', '進場', '0%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.12)}100%{transform:none}', .55, 'ease-out'],
    ['bounce-in', '彈跳進場', '進場', '0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.08)}70%{transform:scale(.92)}100%{transform:none}', .9, 'ease-out'],
    ['drop-in', '掉落', '進場', '0%{opacity:0;transform:translateY(-120px)}60%{opacity:1;transform:translateY(12px)}80%{transform:translateY(-6px)}100%{transform:none}', .9, 'ease-out'],
    ['back-up', '回彈上升', '進場', 'from{opacity:0;transform:translateY(80px) scale(.8)}to{opacity:1;transform:none}', .8, 'cubic-bezier(.34,1.56,.64,1)'],
    ['flip-x', '翻牌（水平）', '進場', 'from{opacity:0;transform:perspective(600px) rotateY(90deg)}to{opacity:1;transform:perspective(600px)}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['flip-y', '翻牌（垂直）', '進場', 'from{opacity:0;transform:perspective(600px) rotateX(90deg)}to{opacity:1;transform:perspective(600px)}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['rotate-in', '旋轉出現', '進場', 'from{opacity:0;transform:rotate(-200deg) scale(.5)}to{opacity:1;transform:none}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['blur-in', '模糊對焦', '進場', 'from{opacity:0;filter:blur(16px);transform:scale(1.1)}to{opacity:1;filter:none;transform:none}', .9, 'ease'],
    ['mask-up', '遮罩上升', '進場', 'from{clip-path:inset(100% 0 0 0);transform:translateY(30px)}to{clip-path:inset(0);transform:none}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['wipe', '擦拭出現', '進場', 'from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}', .8, 'cubic-bezier(.65,0,.35,1)'],
    ['typewriter', '打字機', '進場', 'from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}', 1.4, 'steps(14,end)'],
    ['highlight', '螢光筆劃過', '強調', 'from{background-size:0% 40%}to{background-size:100% 40%}', .9, 'cubic-bezier(.65,0,.35,1)', false, 'background:linear-gradient(#ffe066,#ffe066) no-repeat 0 88%/0% 40%;'],
    ['pulse', '脈動', '強調', '0%,100%{transform:none}50%{transform:scale(1.08)}', .8, 'ease-in-out'],
    ['heartbeat', '心跳', '強調', '0%,28%,70%{transform:none}14%,42%{transform:scale(1.18)}', 1.3, 'ease-in-out'],
    ['shake', '左右搖晃', '強調', '0%,100%{transform:none}10%,30%,50%,70%,90%{transform:translateX(-10px)}20%,40%,60%,80%{transform:translateX(10px)}', .8, 'ease'],
    ['head-shake', '搖頭', '強調', '0%,50%{transform:none}6.5%{transform:translateX(-6px) rotateY(-9deg)}18.5%{transform:translateX(5px) rotateY(7deg)}31.5%{transform:translateX(-3px) rotateY(-5deg)}43.5%{transform:translateX(2px) rotateY(3deg)}', 1, 'ease-in-out'],
    ['swing', '吊牌擺盪', '強調', '20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}100%{transform:none}', 1, 'ease', false, 'transform-origin:top center;'],
    ['tada', '登登！', '強調', '0%,100%{transform:none}10%,20%{transform:scale(.9) rotate(-3deg)}30%,50%,70%,90%{transform:scale(1.1) rotate(3deg)}40%,60%,80%{transform:scale(1.1) rotate(-3deg)}', 1, 'ease'],
    ['float', '漂浮', '循環', '0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}', 3, 'ease-in-out', true],
    ['breathe', '呼吸', '循環', '0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.06);opacity:1}', 3, 'ease-in-out', true],
    ['glow', '發光', '循環', '0%,100%{filter:drop-shadow(0 0 0 rgba(255,200,0,0))}50%{filter:drop-shadow(0 0 14px rgba(255,190,0,.9))}', 2, 'ease-in-out', true],
    ['rise', '輕浮上升', '進場', 'from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}', .6, 'cubic-bezier(.22,1,.36,1)'],
    ['scale-fade', '微縮淡入', '進場', 'from{opacity:0;transform:scale(.92)}to{opacity:1;transform:none}', .6, 'cubic-bezier(.22,1,.36,1)'],
    ['tracking-in', '字距收合', '進場', 'from{opacity:0;letter-spacing:.5em;filter:blur(4px)}to{opacity:1;letter-spacing:normal;filter:none}', .9, 'cubic-bezier(.22,1,.36,1)'],
    ['tilt-in', '翻起淡入', '進場', 'from{opacity:0;transform:perspective(800px) rotateX(-40deg) translateY(20px);transform-origin:top}to{opacity:1;transform:perspective(800px);transform-origin:top}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['blur-up', '模糊上浮', '進場', 'from{opacity:0;filter:blur(10px);transform:translateY(24px)}to{opacity:1;filter:none;transform:none}', .8, 'cubic-bezier(.22,1,.36,1)'],
    ['stamp', '蓋章落下', '強調', '0%{opacity:0;transform:scale(1.8)}60%{opacity:1;transform:scale(.95)}100%{transform:none}', .5, 'ease-out'],
  ];
  LIB.items.animations = A.map(([k, name, group, kf, dur, ease, loop, pre]) => {
    const id = 'an-' + k;
    const anim = `${id}-kf ${dur}s ${ease} ${loop ? 'infinite' : 'both'}`;
    return {
      id, name, group, dur, ease, loop: !!loop, pre: pre || '', kf, anim, tags: [group],
      desc: `${group}動畫・${dur} 秒${loop ? '・無限循環' : ''}`,
      css: `@keyframes ${id}-kf{${kf}}\n.${id}{${pre || ''}animation:${anim}}`,
      html: `<div class="${id}">重點文字</div>`,
    };
  });
})();

/* ---------- 音效（Web Audio 即時合成，免下載檔案） ---------- */
(function () {
  LIB.sfxCore = `var AC=window.__sfxAC||(window.__sfxAC=new (window.AudioContext||window.webkitAudioContext)());if(AC.state==='suspended')AC.resume();
function T(f,d,type,v,t,f2){type=type||'sine';v=v||.3;t=t||0;var o=AC.createOscillator(),g=AC.createGain(),s=AC.currentTime+t;o.type=type;o.frequency.setValueAtTime(f,s);if(f2)o.frequency.exponentialRampToValueAtTime(f2,s+d);g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(v,s+.01);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(g);g.connect(AC.destination);o.start(s);o.stop(s+d+.05)}
function N(d,v,t,ff,ff2,type){v=v||.3;t=t||0;ff=ff||1000;var s=AC.currentTime+t,b=AC.createBuffer(1,Math.ceil(AC.sampleRate*d),AC.sampleRate),ch=b.getChannelData(0);for(var i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;var src=AC.createBufferSource(),fl=AC.createBiquadFilter(),g=AC.createGain();src.buffer=b;fl.type=type||'bandpass';fl.frequency.setValueAtTime(ff,s);if(ff2)fl.frequency.exponentialRampToValueAtTime(ff2,s+d);g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.0001,s+d);src.connect(fl);fl.connect(g);g.connect(AC.destination);src.start(s)}`;
  const S = [
    ['ding', '叮', '提示', "T(1046,.6,'sine',.35);T(2093,.4,'sine',.08)"],
    ['chime', '雙音鈴', '提示', "T(784,.5,'triangle',.3);T(1175,.7,'triangle',.25,.15)"],
    ['notify', '通知', '提示', "T(1318,.15,'sine',.25);T(1760,.3,'sine',.25,.12)"],
    ['bell', '鐘聲', '提示', "[1,2.76,5.4].forEach(function(m,i){T(523*m,1.6/(i+1),'sine',.25/(i+1))})"],
    ['correct', '答對了', '答題', "[523,659,784,1046].forEach(function(f,i){T(f,.25,'triangle',.3,i*.08)})"],
    ['wrong', '答錯了', '答題', "T(180,.45,'sawtooth',.22,0,120);T(185,.45,'square',.1,0,125)"],
    ['tada', '登登', '答題', "T(392,.15,'triangle',.25);[523,659,784].forEach(function(f){T(f,.9,'triangle',.18,.15)})"],
    ['level-up', '升級', '答題', "[392,523,659,784,1046,1319].forEach(function(f,i){T(f,.18,'square',.1,i*.07)})"],
    ['coin', '得分金幣', '答題', "T(988,.08,'square',.15);T(1319,.35,'square',.15,.08)"],
    ['gameover', '遊戲結束', '答題', "[523,494,466,440].forEach(function(f,i){T(f,.35,'triangle',.25,i*.3)})"],
    ['drumroll', '鼓聲揭曉', '揭曉', "for(var i=0;i<26;i++)N(.06,.2+i*.01,i*.05,1800);N(.9,.4,1.3,800);N(1.2,.25,1.3,6000,null,'highpass')"],
    ['applause', '掌聲', '揭曉', "for(var i=0;i<70;i++)N(.05,Math.random()*.25+.05,Math.random()*1.8,2500+Math.random()*2000)"],
    ['magic', '魔法', '揭曉', "[1046,1318,1568,2093].forEach(function(f,i){T(f,.5,'sine',.15,i*.08)});N(1,.06,0,8000,null,'highpass')"],
    ['sparkle', '閃閃發亮', '揭曉', "for(var i=0;i<8;i++)T(1500+Math.random()*2500,.25,'sine',.1,i*.06)"],
    ['whoosh', '咻（換頁）', '轉場', "N(.6,.35,0,300,4000)"],
    ['swoosh', '咻（下滑）', '轉場', "N(.5,.35,0,5000,250)"],
    ['page-flip', '翻頁聲', '轉場', "N(.25,.3,0,1500,6000)"],
    ['pop', '啵', '互動', "T(400,.12,'sine',.4,0,1200)"],
    ['click', '點擊', '互動', "N(.03,.5,0,3000,null,'highpass')"],
    ['bubble', '泡泡', '互動', "T(300,.15,'sine',.3,0,900);T(500,.12,'sine',.2,.12,1300)"],
    ['boing', '彈簧', '互動', "T(120,.45,'sine',.4,0,520)"],
    ['typewriter', '打字鍵', '互動', "N(.02,.6,0,4000,null,'highpass');T(1800,.03,'square',.05)"],
    ['shutter', '快門', '互動', "N(.05,.6,0,3000,null,'highpass');N(.08,.5,.09,2000,null,'highpass')"],
    ['beep', '嗶', '計時', "T(880,.15,'square',.15)"],
    ['countdown', '倒數 3-2-1', '計時', "[0,1,2].forEach(function(i){T(660,.12,'square',.15,i*.6)});T(1320,.5,'square',.15,1.8)"],
    ['xylophone', '木琴音階', '氣氛', "[523,587,659,698,784,880,988,1046].forEach(function(f,i){T(f,.3,'sine',.25,i*.1)})"],
  ];
  LIB.items.sounds = S.map(([k, name, group, body]) => {
    const id = 'sx-' + k;
    const fn = 'sfx_' + k.replace(/-/g, '_');
    return {
      id, name, group, body, fn, tags: [group], desc: `${group}音效・Web Audio 即時合成，不需要音檔`,
      js: `function ${fn}(){\n${LIB.sfxCore}\n${body}\n}`,
    };
  });
})();
