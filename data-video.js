/* 影片生成素材庫：提示詞積木（鏡頭運動等預覽會動） */
(function () {
  const I = (id, name, en, desc, pv, css) => ({ id, name, en, desc, pv, css });
  const T = (c1, c2, big) => ({ t: 'tag', c: [c1, c2], big });
  const items = {};

  /* 鏡頭運動：用同一張風景示範，框線代表攝影機畫面 */
  const MV = (id, name, en, desc, kf, dur, ease, extra) => I(id, name, en, desc, { t: 'motion' },
    `@keyframes k-${id}{${kf}}.mv-${id}{animation:k-${id} ${dur}s ${ease || 'ease-in-out'} infinite ${extra || 'alternate'}}`);
  items.camera = [
    MV('cm-static', '固定鏡頭', 'static locked-off camera', '鏡頭不動，讓主體自己動', 'from{transform:none}to{transform:none}', 2),
    MV('cm-push', '緩慢推進', 'slow push-in toward the subject', '慢慢靠近，情緒越來越集中', 'from{transform:scale(1)}to{transform:scale(1.35) translate(8%,2%)}', 3.2),
    MV('cm-pull', '緩慢拉遠', 'slow pull-back revealing the scene', '從主體退開，交代環境', 'from{transform:scale(1.4) translate(8%,2%)}to{transform:scale(1)}', 3.2),
    MV('cm-pan', '水平橫搖', 'smooth pan from left to right', '左右掃過場景', 'from{transform:translateX(9%)}to{transform:translateX(-9%)}', 3),
    MV('cm-tilt', '垂直上搖', 'tilt up from ground to sky', '由下往上看，揭示高度', 'from{transform:translateY(-8%)}to{transform:translateY(8%)}', 3),
    MV('cm-truck', '滑軌橫移', 'lateral tracking shot, dolly sideways', '相機平行移動，前後景視差', 'from{transform:translateX(10%) scale(1.05)}to{transform:translateX(-10%) scale(1.05)}', 3.4, 'linear'),
    MV('cm-orbit', '環繞主體', 'orbit around the subject, 180-degree arc', '繞著主體轉，很有質感', 'from{transform:perspective(600px) rotateY(16deg) scale(1.1)}to{transform:perspective(600px) rotateY(-16deg) scale(1.1)}', 3.4),
    MV('cm-crane', '升降上升', 'crane up, rising high above the scene', '從地面升起，壯闊收尾', 'from{transform:translateY(-10%) scale(1.25)}to{transform:translateY(8%) scale(1)}', 3.4),
    MV('cm-follow', '跟拍', 'tracking shot following the subject from behind', '跟著人走，有參與感', 'from{transform:translateX(-6%) scale(1.15)}to{transform:translateX(6%) scale(1.18)}', 1.2, 'ease-in-out'),
    MV('cm-handheld', '手持晃動', 'handheld camera, subtle natural shake', '真實、紀錄片感', '0%{transform:translate(0,0) rotate(0)}20%{transform:translate(1.2%,-.8%) rotate(.4deg)}40%{transform:translate(-.8%,1%) rotate(-.3deg)}60%{transform:translate(1%,.6%) rotate(.2deg)}80%{transform:translate(-1.2%,-.6%) rotate(-.4deg)}100%{transform:translate(0,0) rotate(0)}', 1.4, 'linear', 'normal'),
    MV('cm-zoom', '變焦推近', 'zoom in', '鏡頭位置不變，畫面放大', 'from{transform:scale(1)}to{transform:scale(1.5)}', 2.4, 'cubic-bezier(.65,0,.35,1)'),
    MV('cm-dolly-zoom', '希區考克變焦', 'dolly zoom, vertigo effect', '主體不變、背景拉伸，震撼感', 'from{transform:scale(1);filter:none}to{transform:scale(1.3);filter:blur(.6px)}', 1.8),
    MV('cm-drone', '空拍前進', 'aerial drone shot flying forward over the landscape', '大景開場最常用', 'from{transform:perspective(500px) rotateX(18deg) translateY(-6%) scale(1.15)}to{transform:perspective(500px) rotateX(18deg) translateY(10%) scale(1.45)}', 3.6, 'linear'),
    MV('cm-whip', '甩鏡', 'whip pan with motion blur', '快速甩過去，轉場很有力', '0%,60%{transform:translateX(0);filter:none}75%{transform:translateX(-30%);filter:blur(6px)}100%{transform:translateX(0);filter:none}', 1.8, 'ease-in', 'normal'),
    MV('cm-rack', '焦點轉移', 'rack focus from foreground to background', '焦點從前景移到後景', '0%,30%{filter:blur(0)}50%,80%{filter:blur(3px)}100%{filter:blur(0)}', 2.6, 'ease-in-out', 'normal'),
    MV('cm-roll', '旋轉', 'camera roll, slow rotation', '夢境、天旋地轉', 'from{transform:rotate(-6deg) scale(1.15)}to{transform:rotate(6deg) scale(1.15)}', 3),
    MV('cm-reveal', '遮擋揭露', 'reveal shot, camera moves past a foreground object', '從遮擋物後露出主體', 'from{transform:translateX(10%) scale(1.1);clip-path:inset(0 0 0 70%)}to{transform:translateX(0) scale(1.1);clip-path:inset(0 0 0 0)}', 2.6),
    MV('cm-pov', '第一人稱', 'first-person POV walking forward', '觀眾就是主角', '0%{transform:scale(1.1) translateY(0)}25%{transform:scale(1.15) translateY(-1%)}50%{transform:scale(1.2) translateY(0)}75%{transform:scale(1.25) translateY(-1%)}100%{transform:scale(1.3) translateY(0)}', 2.6, 'linear', 'normal'),
  ];

  const S = (vb) => ({ t: 'shot', vb });
  items.shots = [
    I('vs-ecu', '大特寫', 'extreme close-up', '眼神、手部、細節', S('30 16 40 25')),
    I('vs-cu', '特寫', 'close-up', '表情與情緒', S('14 4 72 45')),
    I('vs-mcu', '近景', 'medium close-up', '訪談、說話', S('-6 2 112 70')),
    I('vs-ms', '中景', 'medium shot', '動作與互動', S('-40 0 180 112')),
    I('vs-full', '全景', 'full shot', '人物與姿態', S('-150 -5 400 250')),
    I('vs-wide', '遠景', 'wide establishing shot', '開場交代場景', S('-450 -160 1000 625')),
  ];

  items.angles = [
    I('va-eye', '平視', 'eye-level', '自然親切', { t: 'angle', x: 30, y: 42 }),
    I('va-high', '俯拍', 'high angle', '溫和、觀察', { t: 'angle', x: 34, y: 10, r: 30 }),
    I('va-low', '仰角', 'low angle', '有力量、崇敬', { t: 'angle', x: 34, y: 80, r: -30 }),
    I('va-top', '正上方', 'top-down overhead shot', '料理、桌面、手作', { t: 'angle', x: 103, y: 8, r: 90 }),
    I('va-ots', '過肩', 'over-the-shoulder', '對話、陪伴', T('#f3eee6', '#5a4636', 'OTS')),
  ];

  items.action = [
    I('ac-smile', '轉頭微笑', 'turns toward the camera and smiles warmly', '最常用的溫暖收尾', T('#fff1e3', '#c0612b', '微笑')),
    I('ac-walk', '走向鏡頭', 'walks slowly toward the camera', '開場、登場', T('#eef2f6', '#1f3a5f', '走近')),
    I('ac-walk-away', '背影走遠', 'walks away from the camera into the distance', '結尾、離別、旅程', T('#ecefe9', '#3f5f45', '背影')),
    I('ac-hands', '雙手操作', 'close-up of hands carefully working', '教學、手作、料理', T('#f7ede2', '#8a5a32', '手部')),
    I('ac-talk', '對鏡頭說話', 'speaks naturally to the camera', '訪談、衛教講解', T('#eef7ff', '#2f6fb0', '說話')),
    I('ac-laugh', '一起大笑', 'a group laughing together', '歡樂、團體活動', T('#fff6d6', '#d97706', '大笑')),
    I('ac-hug', '擁抱', 'two people share a warm hug', '親情、感動', T('#fdeef0', '#c0566b', '擁抱')),
    I('ac-dance', '跟著音樂擺動', 'gently dances to music', '活動、律動', T('#f6efff', '#8a5cd6', '律動')),
    I('ac-exercise', '伸展運動', 'does gentle stretching exercises', '運動衛教', T('#effbf4', '#2f8f5b', '伸展')),
    I('ac-pour', '倒茶', 'pours tea into a cup, steam rising', '生活感、療癒', T('#f3e6d3', '#7a4a2a', '倒茶')),
    I('ac-page', '翻閱相簿', 'flips through an old photo album', '回憶、懷舊', T('#efe2cf', '#7a4a2a', '翻閱')),
    I('ac-product-spin', '產品旋轉', 'product slowly rotates on a turntable', '商品展示', T('#ffffff', '#222', '旋轉')),
    I('ac-hair-wind', '髮絲隨風', 'hair and clothes moving gently in the breeze', '自然、柔和', T('#eaf2f0', '#3f6f62', '微風')),
    I('ac-steam', '熱氣裊裊', 'steam rising from hot food', '料理、溫暖', T('#fff4e6', '#a0522d', '熱氣')),
  ];

  const SP = (id, name, en, desc, dur, ease) => I(id, name, en, desc, { t: 'speed' }, `.sp-${id}{animation:spMove ${dur}s ${ease} infinite alternate}`);
  items.speed = [
    SP('sp-normal', '正常速度', 'real-time speed', '自然真實', 1.2, 'ease-in-out'),
    SP('sp-slow', '慢動作', 'slow motion, 60fps', '情緒、細節、美感', 3, 'ease-in-out'),
    SP('sp-super-slow', '超慢動作', 'super slow motion, 240fps', '水花、髮絲、瞬間', 6, 'ease-in-out'),
    SP('sp-timelapse', '縮時攝影', 'timelapse', '雲、日落、人潮', .5, 'steps(6,end)'),
    SP('sp-hyperlapse', '移動縮時', 'hyperlapse moving through the city', '移動中的縮時', .6, 'linear'),
    SP('sp-ramp', '速度漸變', 'speed ramp from fast to slow motion', '快 → 慢，強調重點瞬間', 2.4, 'cubic-bezier(.05,.9,.1,1)'),
    SP('sp-oneshot', '一鏡到底', 'single continuous take, no cuts', '沉浸、真實', 4, 'linear'),
  ];
  items.speed[0].css += '@keyframes spMove{to{margin-left:calc(100% - 26px)}}';

  const L = (bg, ball) => ({ t: 'light', bg, ball });
  items.lighting = [
    I('vl-soft', '自然柔光', 'soft natural daylight', '萬用不出錯', L('#ece7e1', 'background:radial-gradient(circle at 40% 35%,#fff 0,#f2d9c4 40%,#b99a83 100%)')),
    I('vl-golden', '黃金時刻', 'golden hour sunlight', '溫暖、感性', L('linear-gradient(160deg,#f7c58a,#e98a5a)', 'background:radial-gradient(circle at 28% 30%,#fff3c4 0,#f0a35e 45%,#7a4a2a 100%)')),
    I('vl-blue', '藍調時刻', 'blue hour twilight', '寧靜、思念', L('linear-gradient(160deg,#2b3e66,#5a6fa0)', 'background:radial-gradient(circle at 40% 35%,#cfe0ff 0,#4a6fa5 50%,#1d2b4a 100%)')),
    I('vl-window', '窗光', 'soft window light', '居家、訪談', L('linear-gradient(90deg,#f5efe8,#3a3330)', 'background:linear-gradient(90deg,#fff 0,#e8d5c4 35%,#3a2d26 100%)')),
    I('vl-backlit', '逆光光暈', 'backlit with lens flare', '夢幻、希望', L('radial-gradient(circle,#fff6d6 0 25%,#f2b46a 55%,#7a4b2b)', 'background:#3a2a20;box-shadow:0 0 18px 6px rgba(255,214,150,.9)')),
    I('vl-studio', '攝影棚', 'clean studio lighting', '產品、專業', L('#e9e9ec', 'background:radial-gradient(circle at 50% 28%,#fff 0,#eceae7 45%,#a9a49f 100%)')),
    I('vl-lowkey', '暗調戲劇光', 'low-key dramatic lighting', '電影感、沉穩', L('#0b0b0b', 'background:radial-gradient(circle at 35% 30%,#c9b3a3 0,#3a2c25 35%,#0d0b0a 70%)')),
    I('vl-neon', '霓虹夜光', 'neon city lights at night', '都市、科技', L('#120a24', 'background:linear-gradient(90deg,#ff3ec8,#2a1640 50%,#26e0ff)')),
    I('vl-candle', '燭光', 'warm candlelight', '溫馨、節慶', L('#1f120a', 'background:radial-gradient(circle at 50% 80%,#ffe2a8 0,#c96b2c 50%,#2a1408 100%)')),
    I('vl-dappled', '樹影光斑', 'dappled sunlight through trees', '公園、自然', L('radial-gradient(circle at 20% 30%,#fff3c4 0 8%,transparent 9%),radial-gradient(circle at 70% 60%,#fff3c4 0 6%,transparent 7%),#6f8f62', 'background:radial-gradient(circle at 35% 35%,#fff3c4 0 18%,#d7b48c 19% 45%,#7a5a40 100%)')),
  ];

  const F = (filter, overlay, blend) => ({ t: 'filter', filter, overlay, blend });
  items.styles = [
    I('vy-cinematic', '電影感', 'cinematic, shallow depth of field, film color grading', '最常用的質感', F('contrast(1.1) saturate(1.05)', 'linear-gradient(180deg,#0f8b8d,#f08a4b)', 'overlay')),
    I('vy-documentary', '紀錄片', 'documentary style, natural and authentic', '真實、可信', F('saturate(.85) contrast(1.05)')),
    I('vy-commercial', '廣告質感', 'polished commercial look, crisp and bright', '品牌、產品', F('saturate(1.2) brightness(1.08) contrast(1.05)')),
    I('vy-japanese', '日系清新', 'Japanese airy style, soft pastel, overexposed', '清爽、溫柔', F('brightness(1.18) saturate(.8) contrast(.88)', '#bfe3ff', 'soft-light')),
    I('vy-8mm', '復古 8mm', 'vintage 8mm home video, warm film grain, light leaks', '家庭回憶', F('sepia(.45) saturate(1.1) contrast(.9)', 'radial-gradient(circle at 85% 20%,rgba(255,120,60,.7),transparent 40%)', 'screen')),
    I('vy-bw', '黑白電影', 'black and white film, high contrast', '經典、莊重', F('grayscale(1) contrast(1.2)')),
    I('vy-dreamy', '夢幻柔焦', 'dreamy soft focus, glowing highlights', '回憶、浪漫', F('blur(.8px) brightness(1.12) saturate(1.1)', '#fff0f6', 'soft-light')),
    I('vy-moody', '暗色情緒', 'moody dark tones, muted colors', '深刻、思考', F('brightness(.7) contrast(1.2) saturate(.8)')),
    I('vy-anime', '2D 動畫', '2D hand-drawn animation style', '溫暖、故事', T('#eaf6ff', '#e86a92', '2D')),
    I('vy-3d', '3D 動畫', 'stylized 3D animation, soft lighting', '可愛、解說', T('#ffe9e2', '#d1495b', '3D')),
    I('vy-clay', '黏土定格', 'stop-motion claymation', '手作、童趣', T('#fde4cf', '#a65e2e', 'CLAY')),
    I('vy-watercolor', '水彩動畫', 'animated watercolor illustration', '柔和、藝術', T('#e8f1f6', '#3f6f8f', '水彩')),
    I('vy-minimal', '極簡產品', 'minimal product video, clean backdrop', '乾淨俐落', T('#ffffff', '#222', 'MIN')),
    I('vy-nature', '自然紀錄', 'nature documentary, rich detail', '風景、生態', F('saturate(1.25) contrast(1.05)', '#6fcf97', 'soft-light')),
  ];

  const TR = (id, name, en, desc, kf) => I(id, name, en, desc, { t: 'trans' }, `@keyframes kt-${id}{${kf}}.tr-${id}{animation:kt-${id} 2.6s ease-in-out infinite}`);
  items.transitions = [
    TR('vt-cut', '直接剪接', 'hard cut', '最乾淨，節奏明快', '0%,49%{opacity:0}50%,100%{opacity:1}'),
    TR('vt-fade', '淡入淡出', 'smooth crossfade', '溫和、時間流逝', '0%,30%{opacity:0}70%,100%{opacity:1}'),
    TR('vt-black', '黑場轉換', 'fade through black', '段落結束、轉換心情', '0%,25%{opacity:0;filter:brightness(0)}50%{opacity:1;filter:brightness(0)}80%,100%{opacity:1;filter:brightness(1)}'),
    TR('vt-white', '白光閃轉', 'flash to white transition', '回憶、驚喜揭曉', '0%,40%{opacity:0;filter:brightness(1)}50%{opacity:1;filter:brightness(4)}75%,100%{opacity:1;filter:brightness(1)}'),
    TR('vt-wipe', '擦拭轉場', 'wipe transition', '活潑、清楚分段', '0%,30%{clip-path:inset(0 100% 0 0)}70%,100%{clip-path:inset(0 0 0 0)}'),
    TR('vt-zoom', '縮放轉場', 'zoom-through transition', '動感、年輕', '0%,30%{opacity:0;transform:scale(2.2)}65%,100%{opacity:1;transform:scale(1)}'),
    TR('vt-whip', '甩鏡轉場', 'whip pan transition', '快節奏 vlog', '0%,35%{transform:translateX(100%);filter:blur(8px)}55%,100%{transform:translateX(0);filter:blur(0)}'),
    TR('vt-match', '匹配剪接', 'match cut on similar shapes or movement', '形狀或動作接續，很有巧思', '0%,45%{opacity:0;transform:scale(.6) rotate(-20deg)}55%,100%{opacity:1;transform:none}'),
  ];

  const FX = (id, name, en, desc, ov, css) => I(id, name, en, desc, { t: 'fx', ov }, css);
  items.weather = [
    FX('vw-clear', '晴朗', 'clear sunny day', '明亮、正向', 'background:radial-gradient(circle at 75% 25%,rgba(255,240,180,.55),transparent 45%)'),
    FX('vw-mist', '晨霧', 'morning mist, soft fog', '寧靜、神秘', 'background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,.25) 60%,rgba(255,255,255,.6))'),
    FX('vw-rain', '細雨', 'light rain falling', '思念、洗滌', 'background:repeating-linear-gradient(105deg,rgba(255,255,255,.55) 0 1px,transparent 1px 9px),rgba(60,80,110,.35)', '@keyframes kRain{to{background-position:-30px 60px,0 0}}.fx-vw-rain{animation:kRain .5s linear infinite}'),
    FX('vw-snow', '雪景', 'gentle snowfall', '冬天、節慶', 'background:radial-gradient(circle,#fff 0 1.6px,transparent 2px) 0 0/22px 22px,radial-gradient(circle,#fff 0 1.2px,transparent 1.6px) 11px 7px/18px 18px,rgba(200,215,235,.35)', '@keyframes kSnow{to{background-position:6px 44px,15px 43px,0 0}}.fx-vw-snow{animation:kSnow 2s linear infinite}'),
    FX('vw-sunset', '夕陽', 'warm sunset sky', '溫暖、結尾', 'background:linear-gradient(180deg,rgba(255,120,60,.55),rgba(255,190,120,.25) 50%,rgba(120,40,60,.35));mix-blend-mode:multiply'),
    FX('vw-night', '城市夜景', 'city at night, bokeh lights', '都市、浪漫', 'background:radial-gradient(circle at 20% 70%,rgba(255,200,90,.9) 0 3px,transparent 4px),radial-gradient(circle at 60% 60%,rgba(120,200,255,.9) 0 3px,transparent 4px),radial-gradient(circle at 80% 75%,rgba(255,120,180,.9) 0 3px,transparent 4px),rgba(10,15,40,.72)'),
    FX('vw-stars', '星空', 'starry night sky', '夢想、寧靜', 'background:radial-gradient(1.5px 1.5px at 20% 20%,#fff,transparent),radial-gradient(1px 1px at 60% 15%,#fff,transparent),radial-gradient(1.5px 1.5px at 80% 35%,#fff,transparent),radial-gradient(1px 1px at 35% 40%,#fff,transparent),rgba(10,15,45,.8)', '@keyframes kStar{50%{opacity:.75}}.fx-vw-stars{animation:kStar 2s ease-in-out infinite}'),
    FX('vw-leaves', '落葉飄落', 'autumn leaves drifting down', '秋天、時光', 'background:radial-gradient(ellipse 4px 2.5px,#e07a3a 98%,transparent) 0 0/40px 40px,radial-gradient(ellipse 3px 2px,#d9a441 98%,transparent) 20px 14px/34px 34px', '@keyframes kLeaf{to{background-position:30px 80px,-10px 82px}}.fx-vw-leaves{animation:kLeaf 3s linear infinite}'),
    FX('vw-indoor', '室內溫暖', 'cozy warm interior', '居家、團聚', 'background:radial-gradient(circle at 30% 30%,rgba(255,200,120,.5),transparent 55%),rgba(120,70,30,.25);mix-blend-mode:multiply'),
    FX('vw-rays', '森林光束', 'sun rays through forest', '希望、靈性', 'background:repeating-linear-gradient(115deg,rgba(255,240,190,.45) 0 10px,transparent 10px 34px);-webkit-mask-image:linear-gradient(200deg,#000,transparent 70%);mask-image:linear-gradient(200deg,#000,transparent 70%)'),
  ];

  const MU = (id, name, en, desc, bpm, c) => I(id, name, en, desc, { t: 'music', bpm, c });
  items.music = [
    MU('mu-piano', '溫柔鋼琴', 'soft gentle piano music', '感動、回憶', 70, '#8a5a32'),
    MU('mu-guitar', '溫暖木吉他', 'warm acoustic guitar', '生活、旅行', 90, '#b5763f'),
    MU('mu-strings', '弦樂抒情', 'emotional string ensemble', '感人收尾', 60, '#7b1e3a'),
    MU('mu-orchestral', '史詩管弦', 'uplifting orchestral score', '大氣、成果發表', 80, '#1f3a5f'),
    MU('mu-lofi', 'Lo-fi 輕鬆', 'chill lo-fi beat', '日常、讀書', 80, '#6b8f71'),
    MU('mu-upbeat', '輕快流行', 'upbeat cheerful pop', '活動精華、短影音', 120, '#e8622c'),
    MU('mu-electronic', '輕電子', 'light electronic ambient', '科技、產品', 110, '#4f46e5'),
    MU('mu-ukulele', '烏克麗麗', 'playful ukulele and whistling', '輕鬆、童趣', 110, '#d9a441'),
    MU('mu-jazz', '慵懶爵士', 'smooth jazz', '咖啡廳、慢生活', 85, '#5a4636'),
    MU('mu-nature', '自然環境音', 'natural ambient sounds, birds and wind', '療癒、冥想', 50, '#3f6b4c'),
    MU('mu-none', '無配樂', 'no music, natural sound only', '訪談、紀實', 30, '#9aa0a6'),
  ];

  const R = (id, name, en, desc, w, h) => Object.assign(I(id, name, en, desc, { t: 'ratio' }), { ratio: [w, h] });
  items.format = [
    R('fm-9-16', '9:16 直式', 'vertical 9:16', 'Shorts、Reels、TikTok', 9, 16),
    R('fm-16-9', '16:9 橫式', 'horizontal 16:9', 'YouTube、簡報、投影', 16, 9),
    R('fm-1-1', '1:1 方形', 'square 1:1', 'FB／IG 動態', 1, 1),
    R('fm-4-5', '4:5 直式', 'portrait 4:5', 'IG 貼文影片', 4, 5),
    I('fm-5s', '5 秒', '5-second clip', '單一鏡頭', T('#f3eee6', '#8a5a32', '5s')),
    I('fm-10s', '10 秒', '10-second clip', '短片段、開場', T('#f3eee6', '#8a5a32', '10s')),
    I('fm-15s', '15 秒', '15-second clip', '廣告、短影音', T('#f3eee6', '#8a5a32', '15s')),
    I('fm-loop', '可無縫循環', 'seamless loop', '背景、等待畫面', T('#f3eee6', '#8a5a32', 'LOOP')),
  ];

  const P = (id, name, desc, c, picks, subject) => Object.assign(I(id, name, name, desc, { t: 'preset', c }), { picks, subject });
  items.presets = [
    P('vp-health-open', '衛教短片開場', '溫暖親切、建立信任', ['#3fa58b', '#1f6f8b'], ['cm-push', 'vs-mcu', 'va-eye', 'ac-talk', 'sp-normal', 'vl-window', 'vy-documentary', 'vw-indoor', 'mu-piano', 'fm-16-9', 'fm-10s'], '一位職能治療師在明亮的復健教室裡向鏡頭打招呼'),
    P('vp-elder-story', '長者生命故事', '溫柔、懷舊、有情感', ['#c98b4e', '#8a5a32'], ['cm-push', 'vs-cu', 'va-eye', 'ac-page', 'sp-slow', 'vl-window', 'vy-8mm', 'vt-fade', 'vw-indoor', 'mu-strings', 'fm-16-9'], '阿嬤坐在藤椅上翻閱老相簿，露出微笑'),
    P('vp-shorts-hook', '短影音開頭', '前三秒抓住注意力', ['#e8622c', '#c2410c'], ['cm-zoom', 'vs-cu', 'va-low', 'ac-smile', 'sp-ramp', 'vl-studio', 'vy-commercial', 'mu-upbeat', 'fm-9-16', 'fm-5s'], '一位阿公對著鏡頭比讚，背景是熱鬧的活動現場'),
    P('vp-event', '活動精華', '熱鬧、充滿笑容', ['#d97706', '#b45309'], ['cm-handheld', 'vs-ms', 'va-eye', 'ac-laugh', 'sp-normal', 'vl-golden', 'vy-documentary', 'vt-cut', 'mu-upbeat', 'fm-16-9', 'fm-15s'], '社區據點的長者們一起玩遊戲、開懷大笑'),
    P('vp-product', '產品展示', '乾淨、聚焦細節', ['#6b7280', '#1f2937'], ['cm-orbit', 'vs-ms', 'va-eye', 'sp-slow', 'vl-studio', 'vy-minimal', 'mu-electronic', 'fm-1-1', 'fm-loop'], '一支木質握柄的助行器'),
    P('vp-scenery', '風景空鏡', '開場或轉場的大景', ['#4f7a5e', '#2f4a3a'], ['cm-drone', 'vs-wide', 'va-high', 'sp-normal', 'vl-golden', 'vy-cinematic', 'vw-mist', 'mu-orchestral', 'fm-16-9', 'fm-10s'], '清晨被薄霧籠罩的山間小鎮'),
    P('vp-cooking', '料理示範', '手部特寫、生活感', ['#5f7a61', '#2f3b30'], ['cm-static', 'vs-ecu', 'va-top', 'ac-hands', 'sp-normal', 'vl-window', 'vy-japanese', 'vt-cut', 'mu-guitar', 'fm-9-16'], '一雙手在木砧板上切蔬菜，準備健康餐'),
    P('vp-exercise', '運動教學', '清楚示範每個動作', ['#2f8f5b', '#1f6f4a'], ['cm-static', 'vs-full', 'va-eye', 'ac-exercise', 'sp-normal', 'vl-soft', 'vy-commercial', 'vt-cut', 'mu-lofi', 'fm-16-9'], '一位長者坐在椅子上做抬腿伸展'),
    P('vp-memory-photo', '老照片動起來', '靜態照片加上輕微動態', ['#a0703c', '#5a3d25'], ['cm-push', 'vs-ms', 'ac-hair-wind', 'sp-slow', 'vy-8mm', 'mu-piano', 'fm-4-5', 'fm-5s'], '1970 年代的全家福老照片，大家微笑看著鏡頭'),
    P('vp-brand', '機構形象片', '專業、溫暖、值得信任', ['#1f3a5f', '#0f1b2d'], ['cm-truck', 'vs-ms', 'va-eye', 'ac-walk', 'sp-slow', 'vl-golden', 'vy-cinematic', 'vt-fade', 'mu-orchestral', 'fm-16-9', 'fm-15s'], '照服員陪著長輩在庭院散步，陽光灑落'),
    P('vp-explainer', '動畫解說', '把複雜的事講簡單', ['#4f46e5', '#3730a3'], ['cm-static', 'vs-ms', 'ac-talk', 'sp-normal', 'vy-3d', 'vt-zoom', 'mu-ukulele', 'fm-16-9', 'fm-15s'], '可愛的心臟角色解釋血壓是什麼'),
  ];

  window.GEN = {
    kind: 'video',
    sampleSubject: '一位阿嬤在社區公園慢慢打太極，陽光灑在她臉上',
    cats: [
      { k: 'presets', n: '用途模板', pv: 'preset', mode: 'single', d: '一鍵套用整組設定，再逐類微調' },
      { k: 'camera', n: '鏡頭運動', pv: 'motion', mode: 'single', d: '攝影機怎麼動（預覽會播放，白框代表畫面）' },
      { k: 'shots', n: '景別', pv: 'shot', mode: 'single', d: '主體在畫面中有多大' },
      { k: 'angles', n: '角度', pv: 'angle', mode: 'single', d: '相機的位置' },
      { k: 'action', n: '主體動作', pv: 'tag', mode: 'multi', d: '畫面裡的人或物在做什麼' },
      { k: 'speed', n: '速度節奏', pv: 'speed', mode: 'single', d: '慢動作、縮時、速度變化' },
      { k: 'lighting', n: '光線', pv: 'light', mode: 'single', d: '光的方向與氛圍' },
      { k: 'styles', n: '畫面風格', pv: 'filter', mode: 'single', d: '整體質感與調色' },
      { k: 'weather', n: '天氣氛圍', pv: 'fx', mode: 'single', d: '環境與時間（預覽會動）' },
      { k: 'transitions', n: '轉場', pv: 'trans', mode: 'single', d: '鏡頭之間怎麼銜接' },
      { k: 'music', n: '配樂', pv: 'music', mode: 'single', d: '音樂情緒（條紋跳動快慢代表節奏）' },
      { k: 'format', n: '比例時長', pv: 'ratio', mode: 'multi', d: '比例、長度各選一個，可加無縫循環' },
    ],
    items,
    exclusive: [['fm-9-16', 'fm-16-9', 'fm-1-1', 'fm-4-5'], ['fm-5s', 'fm-10s', 'fm-15s']],
    build(subject, get) {
      const j = k => get(k).map(i => i.en).join(', ');
      const lines = [
        ['Subject', [subject || '[主體]', j('action')].filter(Boolean).join(', ')],
        ['Shot', [j('shots'), j('angles')].filter(Boolean).join(', ')],
        ['Camera', j('camera')],
        ['Speed', j('speed')],
        ['Lighting', j('lighting')],
        ['Atmosphere', j('weather')],
        ['Style', j('styles')],
        ['Transition', j('transitions')],
        ['Audio', j('music')],
        ['Format', j('format')],
      ].filter(([, v]) => v);
      const zhParts = [['鏡頭', 'camera'], ['景別', 'shots'], ['角度', 'angles'], ['動作', 'action'], ['速度', 'speed'], ['光線', 'lighting'], ['天氣', 'weather'], ['風格', 'styles'], ['轉場', 'transitions'], ['配樂', 'music'], ['規格', 'format']]
        .map(([n, k]) => get(k).length ? `${n}：${get(k).map(i => i.name).join('、')}` : '').filter(Boolean);
      return { zh: `${subject || '（請先輸入畫面主體）'}\n${zhParts.join('\n')}`, en: lines.map(([k, v]) => `${k}: ${v}`).join('\n'), neg: '' };
    },
    chat(o, subject) {
      return [
        '請幫我生成一段影片。如果有不清楚或缺少的資訊（例如用途、長度、對象、要出現的文字），請先問我，確認後再生成。',
        '',
        `畫面主體：${subject || '（請在這裡寫你想拍的內容）'}`,
        ...o.zh.split('\n').slice(1),
        '',
        '英文提示詞（一起參考）：',
        o.en,
      ].join('\n');
    },
  };
})();
