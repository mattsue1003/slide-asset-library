/* 圖片生成素材庫：提示詞積木 */
(function () {
  const I = (id, name, en, desc, pv) => ({ id, name, en, desc, pv });
  const T = (c1, c2, big, font) => ({ t: 'tag', c: [c1, c2], big, font });
  const items = {};

  items.styles = [
    I('st-photo', '寫實攝影', 'photorealistic photography, natural details', '像真的照片，最萬用', T('#eef1f4', '#24323f', 'PHOTO')),
    I('st-cinematic', '電影劇照', 'cinematic film still, anamorphic, dramatic composition', '有故事感的電影畫面', T('#1d2430', '#f0c27a', 'CINEMA')),
    I('st-film', '底片攝影', 'shot on 35mm film, Kodak Portra 400, soft grain', '溫暖顆粒、懷舊色彩', T('#efe2cf', '#7a4a2a', '35mm', 'Georgia,serif')),
    I('st-editorial', '雜誌人像', 'editorial magazine photography, clean styling, refined', '乾淨高級的雜誌感', T('#f4f1ec', '#1c1c1c', 'Editorial', 'Georgia,serif')),
    I('st-documentary', '紀實攝影', 'documentary photography, candid moment, authentic', '自然不擺拍的真實瞬間', T('#e9e6e1', '#3a3a3a', 'CANDID')),
    I('st-product', '商品攝影', 'commercial product photography, studio, crisp detail', '乾淨俐落的產品照', T('#ffffff', '#222', 'PRODUCT')),
    I('st-watercolor', '水彩插畫', 'soft watercolor illustration, gentle washes, paper texture', '溫柔透明的水彩', T('#e8f1f6', '#3f6f8f', '水彩')),
    I('st-colored-pencil', '色鉛筆手繪', 'colored pencil drawing, hand-drawn texture, warm', '溫暖的手繪筆觸', T('#fbf3e6', '#a0522d', '色鉛筆')),
    I('st-flat', '扁平插畫', 'flat vector illustration, simple shapes, limited palette', '簡潔現代，簡報最常用', T('#e9f0ff', '#3d5afe', 'FLAT')),
    I('st-line', '線條插畫', 'minimal line art illustration, single weight lines, lots of white space', '極簡線條，高級感', T('#ffffff', '#111', '— line —')),
    I('st-picture-book', '繪本風', 'children\'s picture book illustration, cozy, textured gouache', '親切溫馨，適合長者與兒童', T('#fff4dc', '#b0602a', '繪本')),
    I('st-japanese', '日系插畫', 'Japanese anime-inspired illustration, soft cel shading, airy colors', '清新明亮的日系畫風', T('#eaf6ff', '#e86a92', '日系')),
    I('st-3d-cute', '3D 可愛角色', 'cute 3D character render, soft rounded shapes, studio lighting', '圓潤立體的可愛角色', T('#ffe9e2', '#d1495b', '3D')),
    I('st-clay', '黏土風', 'claymation style, handmade clay texture, playful', '手捏黏土的質感', T('#fde4cf', '#a65e2e', 'CLAY')),
    I('st-isometric', '等距插畫', 'isometric 3D illustration, clean geometry, soft shadows', '說明流程、空間很好用', T('#eef3ff', '#4c5fd5', 'ISO')),
    I('st-paper-cut', '剪紙層次', 'layered paper cut art, depth, soft shadows', '立體剪紙的層次感', T('#fff1e6', '#c2410c', '剪紙')),
    I('st-ink', '水墨', 'traditional Chinese ink wash painting, expressive brush strokes, rice paper', '東方意境', T('#f4f1ea', '#222', '水墨', 'serif')),
    I('st-risograph', '孔版印刷', 'risograph print, grainy texture, two-color overprint', '顆粒感的雙色印刷', T('#fff0f3', '#ff4f79', 'RISO')),
    I('st-retro-poster', '復古海報', 'mid-century retro poster, bold shapes, muted print colors', '50–60 年代海報感', T('#f2e4c9', '#c0392b', 'RETRO', 'Georgia,serif')),
    I('st-oil', '油畫', 'oil painting, rich impasto brushwork, classical light', '厚實筆觸的經典油畫', T('#3b2a20', '#e8c38a', 'OIL', 'Georgia,serif')),
    I('st-collage', '拼貼', 'mixed media collage, cut paper, halftone textures', '手作拼貼、活潑', T('#f7efe2', '#2d2d2d', 'COLLAGE')),
    I('st-icon', '圖示風', 'clean app icon style, centered object, soft gradient background', '單一物件的圖示', T('#eef2ff', '#4f46e5', 'ICON')),
  ];

  items.shots = [
    I('sh-ecu', '大特寫', 'extreme close-up', '只拍眼睛或局部細節', { t: 'shot', vb: '30 16 40 25' }),
    I('sh-cu', '特寫', 'close-up shot', '臉部表情最清楚', { t: 'shot', vb: '14 4 72 45' }),
    I('sh-mcu', '近景', 'medium close-up, chest up', '胸口以上，訪談常用', { t: 'shot', vb: '-6 2 112 70' }),
    I('sh-ms', '中景', 'medium shot, waist up', '腰部以上，看得到手勢', { t: 'shot', vb: '-40 0 180 112' }),
    I('sh-full', '全身', 'full body shot', '看得到整個人與姿態', { t: 'shot', vb: '-150 -5 400 250' }),
    I('sh-wide', '遠景', 'wide shot, subject small in environment', '人在環境中，交代場景', { t: 'shot', vb: '-450 -160 1000 625' }),
    I('sh-detail', '物件細節', 'macro detail shot of object', '手、物品、質地的局部', T('#f3eee6', '#8a5a32', '細節')),
  ];

  const D = s => ({ t: 'diagram', svg: s });
  items.angles = [
    I('an-eye', '平視', 'eye-level angle', '最自然、親切的角度', { t: 'angle', x: 30, y: 42 }),
    I('an-high', '俯拍', 'high angle shot', '從上往下，顯得溫和、渺小', { t: 'angle', x: 34, y: 10, r: 30 }),
    I('an-low', '仰角', 'low angle shot', '從下往上，顯得有力量', { t: 'angle', x: 34, y: 80, r: -30 }),
    I('an-top', '正俯視', 'top-down flat lay, bird\'s-eye view', '桌面平拍、料理、物品排列', { t: 'angle', x: 103, y: 8, r: 90 }),
    I('an-ots', '過肩', 'over-the-shoulder shot', '對話、陪伴的視角', D('<rect x="0" y="0" width="160" height="100" fill="#f3eee6"/><g fill="#3b4a5a"><circle cx="112" cy="40" r="11"/><path d="M92 100 C92 64,132 64,132 100z"/></g><g fill="#2a2520" opacity=".9"><circle cx="38" cy="58" r="22"/><path d="M-6 100 C-6 70,82 70,82 100z"/></g>')),
    I('an-dutch', '傾斜構圖', 'dutch angle, tilted frame', '不安、動感', D('<rect x="0" y="0" width="160" height="100" fill="#f3eee6"/><g transform="rotate(-14 80 50)"><rect x="22" y="12" width="116" height="76" fill="none" stroke="#c2410c" stroke-width="2" rx="4"/><g fill="#3b4a5a"><circle cx="80" cy="40" r="10"/><path d="M62 86 C62 56,98 56,98 86z"/></g></g>')),
  ];

  items.composition = [
    I('cp-thirds', '三分法', 'rule of thirds composition', '主體放在交叉點，最穩', D('<rect width="160" height="100" fill="#f3eee6"/><g stroke="#d1c4b1" stroke-width="1"><path d="M53 0V100M107 0V100M0 33H160M0 67H160"/></g><circle cx="107" cy="33" r="9" fill="#c2410c"/>')),
    I('cp-center', '置中對稱', 'centered symmetrical composition', '莊重、有儀式感', D('<rect width="160" height="100" fill="#f3eee6"/><path d="M80 0V100" stroke="#d1c4b1" stroke-dasharray="3 3"/><rect x="62" y="30" width="36" height="46" rx="6" fill="#c2410c"/><rect x="20" y="40" width="20" height="36" fill="#d9c7b0"/><rect x="120" y="40" width="20" height="36" fill="#d9c7b0"/>')),
    I('cp-negative', '大量留白', 'minimalist composition, generous negative space', '可以放標題文字，簡報背景首選', D('<rect width="160" height="100" fill="#f3eee6"/><circle cx="128" cy="74" r="10" fill="#c2410c"/>')),
    I('cp-leading', '引導線', 'leading lines drawing the eye to the subject', '道路、走廊把視線帶向主體', D('<rect width="160" height="100" fill="#f3eee6"/><path d="M0 100 L72 46 M160 100 L88 46 M40 100 L76 46 M120 100 L84 46" stroke="#b8a68e" stroke-width="2"/><circle cx="80" cy="40" r="6" fill="#c2410c"/>')),
    I('cp-frame', '框中框', 'framed by a doorway or window, frame within a frame', '透過門窗看主體', D('<rect width="160" height="100" fill="#3b3430"/><rect x="40" y="14" width="80" height="80" fill="#f3eee6"/><circle cx="80" cy="56" r="10" fill="#c2410c"/>')),
    I('cp-layers', '前中後景層次', 'layered depth with foreground, midground and background', '畫面有深度', D('<rect width="160" height="100" fill="#e9eef0"/><path d="M0 60 L50 30 L100 55 L160 25 V100 H0z" fill="#c9d6d0"/><circle cx="96" cy="60" r="8" fill="#c2410c"/><path d="M0 100 C30 70,60 80,70 100z" fill="#5f7a61"/>')),
    I('cp-flatlay', '平鋪排列', 'neatly arranged flat lay, knolling', '物品整齊排列，清楚明瞭', D('<rect width="160" height="100" fill="#f3eee6"/><g fill="#c2410c"><rect x="24" y="22" width="26" height="26" rx="4"/><circle cx="80" cy="35" r="13" fill="#5f7a61"/><rect x="104" y="22" width="32" height="26" rx="4" fill="#d9a441"/><rect x="24" y="58" width="44" height="20" rx="4" fill="#4a6a85"/><rect x="80" y="58" width="56" height="20" rx="4" fill="#b5563f"/></g>')),
  ];

  const L = (bg, ball) => ({ t: 'light', bg, ball });
  items.lighting = [
    I('lt-soft', '自然柔光', 'soft natural light', '最不會出錯的光線', L('#ece7e1', 'background:radial-gradient(circle at 40% 35%,#fff 0,#f2d9c4 40%,#b99a83 100%)')),
    I('lt-golden', '黃金時刻', 'golden hour sunlight, warm glow', '傍晚暖暖的金色陽光', L('linear-gradient(160deg,#f7c58a,#e98a5a)', 'background:radial-gradient(circle at 28% 30%,#fff3c4 0,#f0a35e 45%,#7a4a2a 100%)')),
    I('lt-blue', '藍調時刻', 'blue hour, cool twilight', '日落後的冷藍寧靜', L('linear-gradient(160deg,#2b3e66,#5a6fa0)', 'background:radial-gradient(circle at 40% 35%,#cfe0ff 0,#4a6fa5 50%,#1d2b4a 100%)')),
    I('lt-window', '窗邊側光', 'soft window light from the side', '一側亮一側暗，有質感', L('linear-gradient(90deg,#f5efe8,#3a3330)', 'background:linear-gradient(90deg,#fff 0,#e8d5c4 35%,#3a2d26 100%)')),
    I('lt-backlit', '逆光', 'backlit, glowing rim, sun behind subject', '溫暖的光暈與輪廓', L('radial-gradient(circle,#fff6d6 0 25%,#f2b46a 55%,#7a4b2b)', 'background:#3a2a20;box-shadow:0 0 18px 6px rgba(255,214,150,.9)')),
    I('lt-silhouette', '剪影', 'dramatic silhouette against bright sky', '只看得到輪廓，很有意境', L('linear-gradient(180deg,#f9b16e,#e2634f)', 'background:#1b1412')),
    I('lt-studio', '攝影棚柔光', 'studio softbox lighting, even and clean', '乾淨均勻，商品與人像', L('#e9e9ec', 'background:radial-gradient(circle at 50% 28%,#fff 0,#eceae7 45%,#a9a49f 100%)')),
    I('lt-rembrandt', '林布蘭光', 'Rembrandt lighting, chiaroscuro', '經典人像的明暗', L('#2a2420', 'background:radial-gradient(circle at 30% 30%,#fff 0,#d9b9a0 28%,#4a3328 68%)')),
    I('lt-hard', '硬光陰影', 'hard direct light, crisp shadows', '強烈對比、夏日感', L('#e6e2dc', 'background:linear-gradient(120deg,#fff 0 46%,#3a3a3a 47%)')),
    I('lt-neon', '霓虹光', 'neon lighting, magenta and cyan', '夜晚都市、科技感', L('#120a24', 'background:linear-gradient(90deg,#ff3ec8,#2a1640 50%,#26e0ff)')),
    I('lt-candle', '燭光暖光', 'warm candlelight, cozy low light', '溫馨、親密的夜晚', L('#1f120a', 'background:radial-gradient(circle at 50% 80%,#ffe2a8 0,#c96b2c 50%,#2a1408 100%)')),
    I('lt-overcast', '陰天漫射', 'overcast diffused light, soft shadows', '柔和沒有陰影', L('#cfd5da', 'background:radial-gradient(circle at 50% 40%,#f4f4f4 0,#bfc4c8 60%,#8d949b 100%)')),
    I('lt-highkey', '高調明亮', 'high-key bright lighting, airy', '明亮清爽、正向', L('#fbfbfb', 'background:radial-gradient(circle,#fff 0,#f0ece8 60%,#d9d3cd 100%)')),
    I('lt-lowkey', '低調暗光', 'low-key moody lighting, deep shadows', '沉穩、戲劇性', L('#0b0b0b', 'background:radial-gradient(circle at 35% 30%,#c9b3a3 0,#3a2c25 35%,#0d0b0a 70%)')),
    I('lt-dappled', '樹影光斑', 'dappled sunlight through leaves', '樹蔭下的斑駁光影', L('radial-gradient(circle at 20% 30%,#fff3c4 0 8%,transparent 9%),radial-gradient(circle at 70% 60%,#fff3c4 0 6%,transparent 7%),radial-gradient(circle at 45% 80%,#fff3c4 0 7%,transparent 8%),#6f8f62', 'background:radial-gradient(circle at 35% 35%,#fff3c4 0 18%,#d7b48c 19% 45%,#7a5a40 100%)')),
  ];

  const F = (filter, overlay, blend) => ({ t: 'filter', filter, overlay, blend });
  items.colors = [
    I('cl-warm', '暖色調', 'warm color palette', '溫暖、親切', F('saturate(1.15)', '#ff9a3c', 'soft-light')),
    I('cl-cool', '冷色調', 'cool color palette', '冷靜、清爽', F('saturate(.95)', '#3c7bff', 'soft-light')),
    I('cl-muted', '低飽和莫蘭迪', 'muted desaturated palette, soft pastel tones', '耐看高級', F('saturate(.55) brightness(1.06) contrast(.92)')),
    I('cl-pastel', '粉彩', 'soft pastel colors', '柔和可愛', F('saturate(.8) brightness(1.15) contrast(.85)', '#ffc4dc', 'soft-light')),
    I('cl-earth', '大地色', 'earthy tones, terracotta, olive, sand', '自然樸實', F('sepia(.35) saturate(.9)', '#b5763f', 'soft-light')),
    I('cl-teal-orange', '青橙電影色', 'teal and orange color grading', '電影感調色', F('contrast(1.1) saturate(1.1)', 'linear-gradient(180deg,#0f8b8d,#f08a4b)', 'overlay')),
    I('cl-vivid', '鮮豔飽和', 'vibrant saturated colors', '活力、吸睛', F('saturate(1.6) contrast(1.05)')),
    I('cl-faded', '復古褪色', 'faded vintage colors, lifted blacks', '舊照片的懷舊感', F('sepia(.3) contrast(.85) brightness(1.08) saturate(.8)')),
    I('cl-bw', '黑白', 'black and white', '經典、紀實', F('grayscale(1) contrast(1.1)')),
    I('cl-sepia', '棕褐老照片', 'sepia tone', '歷史、回憶', F('sepia(.9)')),
    I('cl-mono-green', '清新綠調', 'fresh green tones', '自然、健康', F('saturate(1.05) hue-rotate(-12deg)', '#6fcf97', 'soft-light')),
    I('cl-dark', '深色質感', 'dark moody palette, rich shadows', '高級、沉穩', F('brightness(.65) contrast(1.2) saturate(.9)')),
    I('cl-cream', '奶油暖白', 'creamy off-white tones, soft beige', '溫柔乾淨', F('brightness(1.12) saturate(.75) sepia(.15)')),
    I('cl-duotone', '雙色調', 'duotone color effect', '設計感強的雙色', F('grayscale(1) contrast(1.2)', 'linear-gradient(135deg,#ff4f79,#3d5afe)', 'screen')),
  ];

  items.lens = [
    I('ln-bokeh', '淺景深散景', 'shallow depth of field, creamy bokeh', '背景模糊，主體突出', { t: 'filter', filter: 'blur(2px) brightness(1.05)' }),
    I('ln-deep', '全景深', 'deep focus, everything sharp', '從前到後都清楚', T('#eef1f4', '#24323f', 'f/11')),
    I('ln-wide', '廣角', 'wide-angle lens, 24mm', '空間感、場景大', T('#e9f0f6', '#2b4a6b', '24mm')),
    I('ln-50', '標準鏡頭', '50mm lens, natural perspective', '最接近人眼', T('#f3eee6', '#5a4636', '50mm')),
    I('ln-85', '人像鏡頭', '85mm portrait lens', '人像最好看的焦段', T('#f7ece6', '#9a4a3a', '85mm')),
    I('ln-tele', '長焦壓縮', 'telephoto lens, compressed background', '背景被拉近、壓縮', T('#ecefe9', '#3f5f45', '200mm')),
    I('ln-macro', '微距', 'macro lens, extreme detail', '小東西的細節', T('#fff6e6', '#a0522d', 'MACRO')),
    I('ln-tilt', '移軸微縮', 'tilt-shift miniature effect', '像模型一樣的小世界', { t: 'fx', ov: 'background:linear-gradient(rgba(255,255,255,0) 0,rgba(255,255,255,0) 100%);backdrop-filter:blur(2.5px);-webkit-mask-image:linear-gradient(#000 0 25%,transparent 45% 60%,#000 80%);mask-image:linear-gradient(#000 0 25%,transparent 45% 60%,#000 80%)' }),
    I('ln-grain', '底片顆粒', 'subtle film grain', '溫暖質感', { t: 'fx', ov: `background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")` }),
    I('ln-motion', '動態模糊', 'motion blur, sense of movement', '速度感', { t: 'filter', filter: 'blur(1.2px)', overlay: 'repeating-linear-gradient(90deg,rgba(255,255,255,.25) 0 2px,transparent 2px 10px)', blend: 'soft-light' }),
  ];

  items.moods = [
    I('md-warm', '溫馨', 'warm and heartwarming atmosphere', '家人、陪伴', T('#fff1e3', '#c0612b')),
    I('md-calm', '寧靜', 'calm, peaceful, serene', '放鬆、療癒', T('#eaf2f0', '#3f6f62')),
    I('md-joy', '歡樂', 'joyful, cheerful, lively', '活動、慶祝', T('#fff6d6', '#d97706')),
    I('md-hope', '希望', 'hopeful, uplifting', '正向、鼓勵', T('#eef7ff', '#2f6fb0')),
    I('md-nostalgic', '懷舊', 'nostalgic, sentimental', '回憶、老時光', T('#f3e6d3', '#7a4a2a')),
    I('md-pro', '專業可信', 'professional, trustworthy, clean', '醫療、機構、報告', T('#eef2f6', '#1f3a5f')),
    I('md-dreamy', '夢幻', 'dreamy, ethereal, soft glow', '浪漫、想像', T('#f6efff', '#8a5cd6')),
    I('md-fresh', '清新', 'fresh, airy, light', '早晨、健康', T('#effbf4', '#2f8f5b')),
    I('md-solemn', '莊重', 'solemn, dignified', '紀念、典禮', T('#ece9e4', '#2b2b2b')),
    I('md-cozy', '療癒舒適', 'cozy, comforting, hygge', '居家、慢生活', T('#f7ede2', '#8a5a32')),
    I('md-playful', '童趣', 'playful, whimsical', '兒童、遊戲', T('#fff0f3', '#e05780')),
    I('md-elegant', '優雅', 'elegant, refined, luxurious', '高級、品牌', T('#1e1b18', '#d9b26f')),
  ];

  const R = (id, w, h, desc, en) => Object.assign(I(id, `${w}:${h}`, en, desc, { t: 'ratio' }), { ratio: [w, h] });
  items.ratios = [
    R('ar-1-1', 1, 1, 'IG／FB 方形貼文', 'square 1:1 aspect ratio'),
    R('ar-4-5', 4, 5, 'IG 直式貼文', '4:5 portrait aspect ratio'),
    R('ar-3-4', 3, 4, '直式海報、IG', '3:4 portrait aspect ratio'),
    R('ar-9-16', 9, 16, '限時動態、Shorts 封面', '9:16 vertical aspect ratio'),
    R('ar-16-9', 16, 9, '簡報、YouTube 封面', '16:9 widescreen aspect ratio'),
    R('ar-3-2', 3, 2, '相機照片比例', '3:2 aspect ratio'),
    R('ar-21-9', 21, 9, '電影寬銀幕、橫幅', '21:9 cinematic aspect ratio'),
  ];

  items.quality = [
    I('q-detail', '細節豐富', 'highly detailed, sharp focus', '畫面清楚銳利', T('#eef1f4', '#24323f', 'DETAIL')),
    I('q-clean-bg', '乾淨背景', 'clean uncluttered background', '主體更突出', T('#ffffff', '#444', 'CLEAN')),
    I('q-white-bg', '純白背景', 'isolated on pure white background', '去背、商品、貼圖', T('#ffffff', '#111', 'WHITE')),
    I('q-text-space', '預留文字空間', 'empty space for text on the left side', '方便放標題', D('<rect width="160" height="100" fill="#f3eee6"/><rect x="12" y="30" width="56" height="8" rx="3" fill="#d1c4b1"/><rect x="12" y="44" width="40" height="6" rx="3" fill="#e2d7c7"/><circle cx="118" cy="56" r="20" fill="#c2410c"/>')),
    I('q-zh-text', '中文字清楚正確', 'large, clear, correctly written Traditional Chinese text', '衛教單張、海報要放字時', T('#eef6f1', '#1f6f4a', '中文')),
    I('q-handout', '單張版面', 'printable handout layout: title on top, three sections with simple icons, generous margins', '衛教單張、說明單', D('<rect width="160" height="100" fill="#f3eee6"/><rect x="52" y="6" width="56" height="88" rx="3" fill="#fff" stroke="#d1c4b1"/><rect x="60" y="13" width="40" height="7" rx="2" fill="#1f6f4a"/><circle cx="66" cy="32" r="5" fill="#c2410c"/><rect x="75" y="30" width="26" height="4" rx="2" fill="#d1c4b1"/><circle cx="66" cy="48" r="5" fill="#3fa58b"/><rect x="75" y="46" width="26" height="4" rx="2" fill="#d1c4b1"/><circle cx="66" cy="64" r="5" fill="#e0a33a"/><rect x="75" y="62" width="26" height="4" rx="2" fill="#d1c4b1"/><rect x="60" y="76" width="40" height="12" rx="2" fill="#e8f2ec"/>')),
    I('q-no-text', '畫面不要文字', 'no text, no letters, no watermark', '避免 AI 亂寫字', T('#fdecec', '#b91c1c', 'NO TEXT')),
    I('q-natural-skin', '自然膚質', 'natural skin texture, realistic faces', '人像不塑膠感', T('#f7e7dc', '#8a4b33', 'SKIN')),
    I('q-hands', '手部正確', 'anatomically correct hands', '避免多指、怪手', T('#f3eee6', '#5a4636', 'HANDS')),
    I('q-asian', '台灣／亞洲人物', 'Taiwanese people, East Asian features', '人物更貼近在地', T('#fff4e6', '#a0522d', '在地')),
    I('q-elder', '長者真實樣貌', 'realistic elderly people, gentle wrinkles, dignified', '長者不過度美化', T('#f1ece6', '#6b4f3a', '長者')),
  ];

  items.negative = [
    I('ng-text', '亂碼文字', 'garbled text, random letters', '常見的 AI 亂寫字', T('#fdecec', '#b91c1c', 'ABC?!')),
    I('ng-watermark', '浮水印與 logo', 'watermark, logo, signature', '去掉不明標誌', T('#fdecec', '#b91c1c', '©')),
    I('ng-fingers', '多餘手指', 'extra fingers, deformed hands', '最常見的錯誤', T('#fdecec', '#b91c1c', 'HANDS')),
    I('ng-face', '五官變形', 'distorted face, asymmetrical eyes', '人像必加', T('#fdecec', '#b91c1c', 'FACE')),
    I('ng-blur', '模糊失焦', 'blurry, out of focus, low resolution', '畫質問題', T('#fdecec', '#b91c1c', 'BLUR')),
    I('ng-oversat', '過度飽和', 'oversaturated, overexposed', '顏色太刺眼', T('#fdecec', '#b91c1c', 'SAT')),
    I('ng-cluttered', '畫面雜亂', 'cluttered composition, busy background', '保持乾淨', T('#fdecec', '#b91c1c', 'MESS')),
    I('ng-creepy', '詭異恐怖', 'creepy, uncanny, horror', '衛教、兒童題材必加', T('#fdecec', '#b91c1c', 'EEK')),
    I('ng-crop', '裁切到頭', 'cropped head, cut off limbs', '構圖完整', T('#fdecec', '#b91c1c', 'CROP')),
    I('ng-plastic', '塑膠感', 'plastic skin, airbrushed, CGI look', '寫實照片用', T('#fdecec', '#b91c1c', 'CGI')),
  ];

  items.presets = [
    Object.assign(I('ps-health-ed', '衛教插圖', 'health education illustration preset', '親切易懂的衛教畫面', { t: 'preset', c: ['#3fa58b', '#1f6f8b'] }), { picks: ['st-flat', 'sh-ms', 'an-eye', 'cp-negative', 'lt-soft', 'cl-muted', 'md-warm', 'ar-16-9', 'q-clean-bg', 'q-no-text', 'ng-text', 'ng-fingers', 'ng-creepy'], subject: '一位護理師親切地教阿伯量血壓' }),
    Object.assign(I('ps-handout', '衛教單張', 'health education handout preset', '直式 A4，標題＋三個重點＋插圖', { t: 'preset', c: ['#2f8f6b', '#1f5f4a'] }), { picks: ['st-flat', 'cp-center', 'lt-soft', 'cl-pastel', 'md-warm', 'ar-3-4', 'q-handout', 'q-zh-text', 'q-clean-bg', 'ng-watermark'], subject: '糖尿病健康飲食衛教單張，標題「糖尿病 健康飲食」，三個重點：「定時定量吃飯」「多吃蔬菜」「少喝含糖飲料」，搭配長者享用健康餐的小插圖' }),
    Object.assign(I('ps-elder-portrait', '長者溫馨人像', 'warm elder portrait preset', '自然真實、有溫度的人像', { t: 'preset', c: ['#c98b4e', '#8a5a32'] }), { picks: ['st-film', 'sh-mcu', 'an-eye', 'cp-thirds', 'lt-window', 'cl-warm', 'ln-85', 'ln-bokeh', 'md-warm', 'ar-4-5', 'q-natural-skin', 'q-elder', 'q-asian', 'ng-face', 'ng-plastic'], subject: '一位滿頭白髮的阿嬤在窗邊微笑，手上拿著老照片' }),
    Object.assign(I('ps-slide-bg', '簡報背景圖', 'presentation background preset', '留白給文字的乾淨背景', { t: 'preset', c: ['#4a6a85', '#1f2d3a'] }), { picks: ['st-photo', 'sh-wide', 'cp-negative', 'lt-soft', 'cl-muted', 'ln-bokeh', 'md-calm', 'ar-16-9', 'q-text-space', 'q-no-text', 'ng-text', 'ng-cluttered'], subject: '清晨的社區公園，遠處有幾位長者在散步' }),
    Object.assign(I('ps-social', '社群貼文主視覺', 'social media key visual preset', '吸睛、適合 IG／FB', { t: 'preset', c: ['#e8622c', '#c2410c'] }), { picks: ['st-3d-cute', 'sh-ms', 'cp-center', 'lt-studio', 'cl-vivid', 'md-joy', 'ar-1-1', 'q-clean-bg', 'q-text-space', 'ng-text', 'ng-watermark'], subject: '一顆開心的藥丸角色舉著「按時吃藥」的小旗子' }),
    Object.assign(I('ps-product', '商品白底照', 'product on white preset', '電商、型錄用', { t: 'preset', c: ['#6b7280', '#1f2937'] }), { picks: ['st-product', 'sh-detail', 'an-eye', 'cp-center', 'lt-studio', 'ln-50', 'md-pro', 'ar-1-1', 'q-white-bg', 'q-detail', 'ng-watermark', 'ng-text'], subject: '一支木質握柄的助行器' }),
    Object.assign(I('ps-picture-book', '繪本故事頁', 'picture book page preset', '溫暖手繪，說故事用', { t: 'preset', c: ['#d9a441', '#b0602a'] }), { picks: ['st-picture-book', 'sh-full', 'cp-layers', 'lt-golden', 'cl-warm', 'md-cozy', 'ar-4-5', 'q-no-text', 'ng-creepy', 'ng-text'], subject: '阿公牽著孫子在稻田邊散步' }),
    Object.assign(I('ps-poster', '活動海報', 'event poster preset', '主視覺＋留標題空間', { t: 'preset', c: ['#c0392b', '#7a1f1f'] }), { picks: ['st-retro-poster', 'sh-ms', 'cp-negative', 'lt-hard', 'cl-earth', 'md-joy', 'ar-3-4', 'q-text-space', 'ng-text'], subject: '一群長者在社區活動中心跳舞' }),
    Object.assign(I('ps-food', '料理美食', 'food photography preset', '健康餐、食譜', { t: 'preset', c: ['#5f7a61', '#2f3b30'] }), { picks: ['st-photo', 'sh-detail', 'an-top', 'cp-flatlay', 'lt-window', 'cl-cream', 'ln-50', 'md-fresh', 'ar-4-5', 'q-detail', 'ng-oversat'], subject: '一份少油少鹽的健康便當，有糙米飯、青菜和魚' }),
    Object.assign(I('ps-memory', '懷舊回憶照', 'nostalgic memory preset', '像老相簿裡的照片', { t: 'preset', c: ['#a0703c', '#5a3d25'] }), { picks: ['st-film', 'sh-ms', 'cp-thirds', 'lt-golden', 'cl-faded', 'ln-grain', 'md-nostalgic', 'ar-3-2', 'q-asian', 'ng-plastic'], subject: '1970 年代台灣街頭的柑仔店，門口坐著老闆娘' }),
    Object.assign(I('ps-icon', '扁平圖示', 'flat icon preset', '簡報、資訊圖用的小圖示', { t: 'preset', c: ['#4f46e5', '#3730a3'] }), { picks: ['st-icon', 'sh-detail', 'cp-center', 'lt-studio', 'cl-pastel', 'ar-1-1', 'q-white-bg', 'q-no-text', 'ng-text'], subject: '一個血壓計' }),
    Object.assign(I('ps-headshot', '專業形象照', 'professional headshot preset', '講者介紹、名片', { t: 'preset', c: ['#1f3a5f', '#0f1b2d'] }), { picks: ['st-editorial', 'sh-mcu', 'an-eye', 'cp-center', 'lt-studio', 'ln-85', 'ln-bokeh', 'md-pro', 'ar-4-5', 'q-natural-skin', 'q-asian', 'ng-face', 'ng-plastic'], subject: '一位穿著白袍的女性職能治療師，自然微笑' }),
    Object.assign(I('ps-ink', '東方水墨', 'ink painting preset', '節慶、文化主題', { t: 'preset', c: ['#3a3a3a', '#111'] }), { picks: ['st-ink', 'sh-wide', 'cp-negative', 'lt-overcast', 'cl-muted', 'md-calm', 'ar-3-4', 'q-text-space', 'ng-text'], subject: '山間小橋與一位撐傘的老人' }),
  ];

  window.GEN = {
    kind: 'image',
    sampleSubject: '一位微笑的阿嬤在社區公園打太極',
    samples: ['lt-backlit','lt-blue','lt-candle','lt-dappled','lt-golden','lt-hard','lt-highkey','lt-lowkey','lt-neon','lt-overcast','lt-rembrandt','lt-silhouette','lt-soft','lt-studio','lt-window','st-3d-cute','st-cinematic','st-clay','st-collage','st-colored-pencil','st-documentary','st-editorial','st-film','st-flat','st-icon','st-ink','st-isometric','st-japanese','st-line','st-oil','st-paper-cut','st-photo','st-picture-book','st-product','st-retro-poster','st-risograph','st-watercolor'],
    sampleBy: { styles: 'ChatGPT 生成', lighting: 'Nano Banana 生成' },
    sampleSets: [
      { k: 'person', n: '人物', cats: ['styles', 'lighting'] },
      { k: 'handout', n: '糖尿病衛教單張', cats: ['styles'], dir: 'samples/handout', fit: 'contain', ids: ['st-3d-cute','st-cinematic','st-clay','st-collage','st-colored-pencil','st-documentary','st-editorial','st-film','st-flat','st-icon','st-ink','st-isometric','st-japanese','st-line','st-oil','st-paper-cut','st-photo','st-picture-book','st-product','st-retro-poster','st-risograph','st-watercolor'] },
    ],
    cats: [
      { k: 'presets', n: '用途模板', pv: 'preset', mode: 'single', d: '一鍵套用整組設定，再逐類微調' },
      { k: 'styles', n: '畫風', pv: 'tag', mode: 'single', d: '整張圖的視覺風格' },
      { k: 'shots', n: '景別', pv: 'shot', mode: 'single', d: '主體在畫面中有多大' },
      { k: 'angles', n: '角度', pv: 'angle', mode: 'single', d: '相機從哪裡拍' },
      { k: 'composition', n: '構圖', pv: 'diagram', mode: 'single', d: '主體怎麼擺' },
      { k: 'lighting', n: '光線', pv: 'light', mode: 'single', d: '光從哪裡來、什麼感覺' },
      { k: 'colors', n: '色調', pv: 'filter', mode: 'single', d: '整體顏色氛圍（示意圖套用同一張風景）' },
      { k: 'lens', n: '鏡頭效果', pv: 'tag', mode: 'multi', d: '焦段、景深、質感' },
      { k: 'moods', n: '氛圍情緒', pv: 'tag', mode: 'multi', d: '想讓人感受到什麼' },
      { k: 'ratios', n: '畫幅比例', pv: 'ratio', mode: 'single', d: '依用途選尺寸' },
      { k: 'quality', n: '品質與細節', pv: 'tag', mode: 'multi', d: '讓結果更穩定的加分詞' },
      { k: 'negative', n: '負面提示', pv: 'tag', mode: 'multi', d: '不想出現的東西' },
    ],
    items,
    build(subject, get) {
      const one = k => get(k).map(i => i.en);
      const en = [subject || '[主體]', ...one('styles'), ...one('shots'), ...one('angles'), ...one('composition'), ...one('lighting'), ...one('colors'), ...one('lens'), ...one('moods'), ...one('quality')].filter(Boolean).join(', ');
      const ar = get('ratios')[0];
      const zhParts = [['畫風', 'styles'], ['景別', 'shots'], ['角度', 'angles'], ['構圖', 'composition'], ['光線', 'lighting'], ['色調', 'colors'], ['鏡頭', 'lens'], ['氛圍', 'moods'], ['比例', 'ratios'], ['細節', 'quality']]
        .map(([n, k]) => get(k).length ? `${n}：${get(k).map(i => i.name).join('、')}` : '').filter(Boolean);
      const neg = get('negative').map(i => i.en).join(', ');
      return {
        zh: `${subject || '（請先輸入畫面主體）'}\n${zhParts.join('\n')}${neg ? '\n避免：' + get('negative').map(i => i.name).join('、') : ''}`,
        en: en + (ar ? `\n\nAspect ratio: ${ar.ratio[0]}:${ar.ratio[1]}` : ''),
        neg,
      };
    },
    claude(o, chosen, subject) {
      return `請幫我生成一張圖片（可以用 Higgsfield 或你能用的圖片生成工具）。\n\n【畫面主體】${subject || '（未填）'}\n【我選的設定】\n${o.zh.split('\n').slice(1).join('\n')}\n\n【英文提示詞】\n${o.en}${o.neg ? `\n\n【負面提示】\n${o.neg}` : ''}\n\n如果主體描述是中文，請幫我翻成自然的英文再生成；生成後請給我看結果，我可能會再調整。`;
    },
  };
})();
