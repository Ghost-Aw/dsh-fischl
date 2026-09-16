window.__ModuleLoader__.load({
  id: "dsh-fischl",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    const React = require("react");

    function insertStyle(css) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "@deepseek-ai/dsh-fischl";
      tag.textContent = css;
      document.head.appendChild(tag);
      return () => { try { tag.remove(); } catch (e) { /* ignore */ } };
    }
    function apiGet(path) {
      return fetch(path).then((r) => r.json());
    }
    function apiPost(path, body) {
      return fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body || {}) }).then((r) => r.json());
    }
    function modelUrl(folder, rest) {
      return '/fischl/' + encodeURIComponent(String(folder || '')) + '/' + rest;
    }

    const FISCHL_CSS = `
.fischl-stage{position:fixed;inset:0;pointer-events:none;overflow:hidden;}
.fischl-frame{position:absolute;inset:6px;border-radius:8px;border:1px solid rgba(214,177,106,.26);}
.fischl-model{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:0;pointer-events:none;overflow:hidden;-webkit-mask-image:linear-gradient(to top, transparent 0%, rgba(0,0,0,.55) 4%, #000 9%);mask-image:linear-gradient(to top, transparent 0%, rgba(0,0,0,.55) 4%, #000 9%);}
.fischl-touch{position:fixed;pointer-events:auto;cursor:pointer;}
.fischl-canvas{display:block;width:100%;height:100%;}
.fischl-items{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.fischl-item{position:absolute;left:0;top:0;opacity:0;transition:opacity .5s ease;will-change:transform,opacity;pointer-events:none;user-select:none;}
.fischl-bgdim{position:fixed;inset:0;z-index:0;pointer-events:none;background:rgba(4,2,10,.28);display:none;}
.fischl-bubble{position:absolute;max-width:300px;padding:12px 16px;border:1px solid var(--dl2d-border, rgba(214,177,106,.55));border-radius:14px 14px 14px 3px;background:var(--dl2d-bubble-bg, linear-gradient(150deg, rgba(46,28,84,.94), rgba(26,15,48,.94)));color:var(--dl2d-bubble-text, #f2e8ff);font-size:13px;line-height:1.6;box-shadow:var(--dl2d-bubble-glow, 0 0 14px rgba(129,62,243,.28));pointer-events:none;animation:fischl-bubble-in .3s cubic-bezier(.34,1.56,.64,1) both;}
.fischl-bubble::after{content:'';position:absolute;bottom:-9px;right:34px;border-left:9px solid transparent;border-right:9px solid transparent;border-top:10px solid var(--dl2d-border, rgba(214,177,106,.55));}
.fischl-bubble .fischl-bubble-name{display:block;font-size:10px;letter-spacing:.2em;color:var(--dl2d-special, #ffd76e);margin-bottom:4px;}
@keyframes fischl-bubble-in{from{opacity:0;transform:translateY(10px) scale(.92)}to{opacity:1;transform:none}}
.dl2d-card{display:flex;flex-direction:column;gap:14px;padding:14px 16px;border-radius:12px;border:1px solid rgba(178,138,255,.22);background:linear-gradient(135deg,rgba(64,40,104,.5),rgba(30,18,52,.55));}
.dl2d-card-title{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600;color:#ecddff;}
.dl2d-card-mark{color:#ffd76e;text-shadow:0 0 10px rgba(255,215,110,.6);}
.dl2d-row{display:flex;align-items:center;gap:10px;min-height:26px;}
.dl2d-row-label{font-size:12px;color:#c3b4e6;white-space:nowrap;min-width:88px;}
.dl2d-input{background:rgba(24,15,42,.7);border:1px solid rgba(178,138,255,.28);border-radius:7px;color:#ecddff;font-size:12px;padding:4px 9px;outline:none;}
.dl2d-input:focus{border-color:#b98cff;}
.dl2d-select{background:rgba(24,15,42,.7);border:1px solid rgba(178,138,255,.28);border-radius:7px;color:#ecddff;font-size:12px;padding:4px 8px;outline:none;}
.dl2d-range{accent-color:#b98cff;flex:1;}
.dl2d-toggle{appearance:none;width:34px;height:18px;border-radius:999px;background:rgba(90,70,130,.6);position:relative;cursor:pointer;transition:background .18s;flex:none;}
.dl2d-toggle::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#b9a8d8;transition:left .18s, background .18s;}
.dl2d-toggle:checked{background:linear-gradient(120deg,#6d3fd6,#8f5ce8);}
.dl2d-toggle:checked::after{left:18px;background:#fff;}
.dl2d-btn{background:rgba(43,26,74,.6);border:1px solid rgba(178,138,255,.3);color:#d9c6ff;font-size:12px;padding:4px 12px;border-radius:999px;cursor:pointer;transition:all .18s;}
.dl2d-btn:hover{border-color:#b98cff;box-shadow:0 0 12px rgba(185,140,255,.35);}
.dl2d-btn-primary{background:linear-gradient(120deg,#6d3fd6,#8f5ce8);color:#fff;border-color:#c9a2ff;}
.dl2d-colors{display:flex;gap:8px;flex-wrap:wrap;}
.dl2d-colorbtn{width:26px;height:26px;border-radius:7px;border:1px solid rgba(255,255,255,.25);cursor:pointer;position:relative;transition:transform .12s;}
.dl2d-colorbtn:hover{transform:scale(1.12);}
.dl2d-picker{position:fixed;z-index:9999;background:#241640;border:1px solid rgba(178,138,255,.4);border-radius:12px;padding:12px;box-shadow:0 8px 32px rgba(0,0,0,.5);width:230px;}
.dl2d-picker-sv{position:relative;height:130px;border-radius:8px;overflow:hidden;cursor:crosshair;margin-bottom:10px;}
.dl2d-picker-sv::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,#000,transparent);}
.dl2d-picker-hue{height:12px;border-radius:6px;background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);position:relative;cursor:pointer;margin-bottom:10px;}
.dl2d-picker-hex{display:flex;gap:8px;align-items:center;}
.dl2d-picker-hex input{flex:1;background:rgba(16,9,30,.8);border:1px solid rgba(178,138,255,.3);border-radius:6px;color:#ecddff;font-size:12px;padding:4px 8px;outline:none;font-family:monospace;}
.dl2d-check{display:flex;align-items:center;gap:6px;font-size:12px;color:#d6c6f2;cursor:pointer;}
.dl2d-check input{accent-color:#8f5ce8;}
.dl2d-exps{display:flex;flex-wrap:wrap;gap:6px;}
.dl2d-sub{font-size:11px;color:#ffd76e;letter-spacing:.08em;margin-top:2px;}
.dl2d-lines{display:flex;flex-direction:column;gap:6px;}
.dl2d-line-row{display:flex;gap:6px;align-items:center;min-width:0;}
.dl2d-line-input{flex:1;min-width:0;background:rgba(24,15,42,.7);border:1px solid rgba(178,138,255,.28);border-radius:7px;color:#ecddff;font-size:12px;padding:4px 9px;outline:none;}
.dl2d-line-input:focus{border-color:#b98cff;}
.dl2d-line-exp{width:118px;flex:none;}
.dl2d-line-del{background:none;border:none;color:#a292c6;cursor:pointer;font-size:13px;padding:2px 8px;border-radius:6px;flex:none;}
.dl2d-line-del:hover{color:#ff7d8e;background:rgba(255,125,142,.12);}
.dl2d-line-add{align-self:flex-start;}
.dl2d-adjust-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
.dl2d-adjust-hint{font-size:11px;color:#ffd76e;line-height:1.5;}
.fischl-adjust-handle{position:fixed;border:2px dashed rgba(255,214,110,.9);background:rgba(255,214,110,.06);transform:translate(-50%,-50%);cursor:grab;z-index:9990;pointer-events:auto;display:none;box-shadow:0 0 0 9999px rgba(4,2,10,.16),0 0 16px rgba(255,214,110,.35);touch-action:none;border-radius:10px;}
.fischl-adjust-mark{position:fixed;width:28px;height:28px;border:2px solid #ffd76e;border-radius:50%;background:rgba(255,214,110,.32);transform:translate(-50%,-50%);cursor:grab;z-index:9991;pointer-events:auto;display:none;box-shadow:0 0 10px rgba(0,0,0,.6);touch-action:none;}
.fischl-adjust-mark::after{content:'拖拽基准';position:absolute;left:50%;top:-22px;transform:translateX(-50%);font-size:10px;color:#ffd76e;white-space:nowrap;text-shadow:0 1px 2px #000;}
.fischl-adjust-bar{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:9992;display:none;flex-direction:column;gap:6px;align-items:center;background:rgba(24,15,42,.93);border:1px solid rgba(255,214,110,.5);border-radius:12px;padding:8px 12px;box-shadow:0 6px 24px rgba(0,0,0,.55);pointer-events:auto;}
.fischl-adjust-bar-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;}
.fischl-touch-edit{position:fixed;border:2px dashed rgba(255,214,110,.95);background:rgba(255,214,110,.05);cursor:move;z-index:9991;pointer-events:auto;display:none;box-shadow:0 0 0 9999px rgba(4,2,10,.12),0 0 12px rgba(255,214,110,.25);touch-action:none;}
.fischl-touch-handle{position:absolute;width:12px;height:12px;background:#ffd76e;border:1px solid #fff;border-radius:3px;}
.fischl-touch-h-nw{left:-7px;top:-7px;cursor:nwse-resize;}
.fischl-touch-h-n{left:50%;top:-7px;transform:translateX(-50%);cursor:ns-resize;}
.fischl-touch-h-ne{right:-7px;top:-7px;cursor:nesw-resize;}
.fischl-touch-h-e{right:-7px;top:50%;transform:translateY(-50%);cursor:ew-resize;}
.fischl-touch-h-se{right:-7px;bottom:-7px;cursor:nwse-resize;}
.fischl-touch-h-s{left:50%;bottom:-7px;transform:translateX(-50%);cursor:ns-resize;}
.fischl-touch-h-sw{left:-7px;bottom:-7px;cursor:nesw-resize;}
.fischl-touch-h-w{left:-7px;top:50%;transform:translateY(-50%);cursor:ew-resize;}
.dl2d-crop-overlay{position:fixed;inset:0;z-index:9998;background:rgba(5,2,12,.82);display:flex;align-items:center;justify-content:center;}
.dl2d-crop-box{position:relative;overflow:hidden;border:1px solid rgba(214,177,106,.7);border-radius:8px;box-shadow:0 0 0 9999px rgba(5,2,12,.55);cursor:grab;touch-action:none;}
.dl2d-crop-box img{position:absolute;left:0;top:0;max-width:none;user-select:none;-webkit-user-drag:none;}
.dl2d-crop-preview{position:fixed;right:4vw;top:50%;transform:translateY(-50%);z-index:9999;border:1px solid rgba(178,138,255,.5);border-radius:8px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.55);}
.dl2d-crop-preview::after{content:'最终效果预览';position:absolute;left:6px;top:4px;font-size:10px;color:#ffd76e;text-shadow:0 1px 3px #000;}
.dl2d-crop-bar{position:fixed;left:50%;transform:translateX(-50%);bottom:40px;display:flex;gap:10px;z-index:9999;}
.dl2d-bottombar{display:flex;gap:10px;align-items:center;padding:2px 2px 8px;}
.dl2d-followbox{position:fixed;z-index:6000;pointer-events:none;border:1.5px dashed rgba(255,214,110,.9);border-radius:6px;background:rgba(255,214,110,.07);box-shadow:0 0 0 1px rgba(0,0,0,.4);display:none;}
.dl2d-followbox::before,.dl2d-followbox::after{content:'';position:absolute;background:rgba(255,214,110,.65);}
.dl2d-followbox::before{left:50%;top:0;bottom:0;width:1px;}
.dl2d-followbox::after{top:50%;left:0;right:0;height:1px;}
`;
    function makeRng(seed) {
      let s = seed >>> 0;
      return function () {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 4294967296;
      };
    }
    function buildStarsCss() {
      const colors = ['255,255,255', '255,235,190', '203,186,255', '188,214,255'];
      const band = [];
      const field = [];
      const bright = [];
      const rb = makeRng(20240601);
      for (let i = 0; i < 280; i += 1) {
        const x = rb() * 100;
        const spread = 7 + rb() * 13;
        const y = 94 - x * 0.86 + (rb() - 0.5) * spread;
        if (y < 0 || y > 100) continue;
        const size = 0.7 + rb() * 1.8;
        const color = colors[Math.floor(rb() * colors.length)];
        const alpha = 0.45 + rb() * 0.55;
        band.push('radial-gradient(' + size.toFixed(2) + 'px ' + size.toFixed(2) + 'px at ' + x.toFixed(2) + '% ' + y.toFixed(2) + '%, rgba(' + color + ',' + alpha.toFixed(2) + '), transparent 68%)');
      }
      const rf = makeRng(987654321);
      for (let i = 0; i < 320; i += 1) {
        const x = rf() * 100;
        const y = rf() * 100;
        const size = 0.6 + rf() * 1.3;
        const color = colors[Math.floor(rf() * colors.length)];
        const alpha = 0.25 + rf() * 0.55;
        field.push('radial-gradient(' + size.toFixed(2) + 'px ' + size.toFixed(2) + 'px at ' + x.toFixed(2) + '% ' + y.toFixed(2) + '%, rgba(' + color + ',' + alpha.toFixed(2) + '), transparent 68%)');
      }
      const rl = makeRng(555000);
      for (let i = 0; i < 22; i += 1) {
        const x = rl() * 100;
        const y = 94 - x * 0.86 + (rl() - 0.5) * 18;
        if (y < 0 || y > 100) continue;
        const color = colors[Math.floor(rl() * 3)];
        bright.push('radial-gradient(2.6px 2.6px at ' + x.toFixed(2) + '% ' + y.toFixed(2) + '%, #ffffff, rgba(' + color + ',0.95) 22%, rgba(' + color + ',0) 70%)');
      }
      return `
body{background:linear-gradient(180deg,#04020a 0%,#0a0714 42%,#140c26 100%);background-size:cover;background-position:center;background-repeat:no-repeat;}
.fischl-nebula{position:fixed;inset:-32%;pointer-events:none;z-index:0;transform:rotate(-24deg);filter:blur(44px);animation:fischl-nebula-drift 70s ease-in-out infinite alternate;
  background:
    radial-gradient(44% 38% at 36% 44%, rgba(112,82,222,.36), transparent 70%),
    radial-gradient(30% 34% at 64% 56%, rgba(64,50,150,.32), transparent 70%),
    radial-gradient(24% 28% at 84% 32%, rgba(170,132,238,.26), transparent 70%),
    radial-gradient(34% 28% at 14% 66%, rgba(88,70,198,.28), transparent 70%),
    radial-gradient(18% 22% at 52% 50%, rgba(196,166,255,.20), transparent 70%);
}
@keyframes fischl-nebula-drift{from{transform:rotate(-24deg) translate(-1.5%,0)}to{transform:rotate(-24deg) translate(1.5%,0)}}
.fischl-stars{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:${bright.join(',')},${band.join(',')},${field.join(',')};animation:fischl-stars-twinkle 4.5s ease-in-out infinite alternate;}
@keyframes fischl-stars-twinkle{from{opacity:.7}to{opacity:1}}
`;
    }
    const LIB_ORDER = [
      {
        file: 'pixi.min.js', key: 'PIXI',
        cdns: [
          'https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js',
          'https://fastly.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js',
        ],
      },
      {
        // Cubism Core 必须支持 moc3 v5+。
        // npm 的 live2dcubismcore@1.0.2 是 2019 年 Cubism 4.0 版：能挂上全局对象，
        // 却无法解析 moc3 v5，模型会报 "Unknown error" —— 因此不再列为候选。
        // 插件已内置官方最新版（model/fischl-libs），本地优先；本地缺失时才回退 CDN。
        file: 'live2dcubismcore.min.js', key: 'Live2DCubismCore', minVersion: 0x04020000,
        cdns: [
          'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
          'https://cdn.jsdelivr.net/gh/Live2D/CubismWebSamples/Core/live2dcubismcore.min.js',
          'https://fastly.jsdelivr.net/gh/Live2D/CubismWebSamples/Core/live2dcubismcore.min.js',
          'https://cdn.jsdelivr.net/gh/Live2D/CubismWebSamples@master/Core/live2dcubismcore.min.js',
        ],
      },
      {
        file: 'cubism4.min.js', key: null,
        cdns: [
          'https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js',
          'https://fastly.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js',
        ],
      },
    ];
    let lineIdSeq = 1;
    function newLineId() {
      lineIdSeq += 1;
      return 'L' + Date.now().toString(36) + '-' + lineIdSeq.toString(36) + '-' + Math.random().toString(36).slice(2, 6);
    }
    const DEFAULT_LINES = [
      { text: '汝竟敢触碰皇女的发冠……此等僭越，可是要招来断罪之雷的哦。', exp: 'chuunibyou' },
      { text: '唔……此身之金发，可是幽夜净土千年未褪的光辉。', exp: '挤眼' },
      { text: '哼哼，被本皇女的魅力震慑了吗？也难怪。', exp: 'chuunibyou' },
      { text: '轻浮！奥兹，替吾记下这无礼之徒的罪状。', exp: 'chuunibyou' },
      { text: '圣裁之雷正在蓄积……若再敢冒犯，便赐你裁决。', exp: 'angry' },
      { text: '这身衣装乃是皇女的战袍，不是给你碰的。', exp: 'shy' },
      { text: '汝可知，挑战断罪之皇女，需要何等的觉悟？', exp: 'chuunibyou' },
      { text: '……奥兹说，你刚刚的行为足够判三个月的罪。', exp: 'shy' },
    ];
    const DEFAULT_DIZZY = { text: '呜……头、头好晕……此等邪术，本皇女绝不饶恕……', exp: 'dizzy' };
    const DEFAULT_WAKE = { enabled: true, text: '嗯？……此书所述夜鸦王国之事，倒有几分吾之乡国的影子。', exp: 'shocked' };
    const ADJUST_HINTS = {
      idle: '拖动模型上的金色虚线手柄，调整空闲姿态位置；松手即保存。',
      typing: '模型已切到打字姿态预览，拖动手柄调整打字位置；松手即保存。',
      head: '拖动金色十字标记，调整鼠标跟随的头部基准；松手即保存。',
      headTyping: '已切到打字姿态预览，拖动十字标记调整打字时的头部基准；松手即保存。',
      touch: '拖动虚线框移动点击区域，拖拽金色角/边手柄调整大小；松手即保存。',
    };
    const EXPR_LABELS = { cute: '可爱', wink: '挤眼', starry: '星星眼', cat: '猫耳猫尾', cream: '奶油', dizzy: '黑脸晕' };
    const DEFAULT_EXPS = ['shy', 'happy', 'surprised', 'cute', 'angry', 'chuunibyou', 'confused', 'shocked', 'thinking', 'wink', 'starry', 'love', 'cat', 'cream'];
    const ALL_EXP_IDS = ['shy', 'happy', 'surprised', 'cute', 'angry', 'chuunibyou', 'confused', 'shocked', 'thinking', 'wink', 'starry', 'love', 'cat', 'cream', 'dizzy'];
    const HEAD_EXP_IDS = ['shy', 'happy', 'surprised', 'cute'];
    const BODY_EXP_IDS = ['angry', 'chuunibyou', 'confused', 'shocked'];
    const AMBIENT_EXP_IDS = ['happy', 'shy', 'thinking', 'chuunibyou', 'wink', 'starry', 'cute', 'cat', 'cream', 'love'];
    const WAKE_EXP_IDS = ['surprised', 'shy'];
    const VOWELS = { a: 'ParamMouthA', e: 'ParamMouthE', i: 'ParamMouthI', o: 'ParamMouthO', u: 'ParamMouthU' };
    const OPEN_BY_VOWEL = { a: 0.55, e: 0.42, i: 0.26, o: 0.5, u: 0.22 };
    const F_IDLE = 0.32;
    const F_TYPING = 0.632;
    const HEAD_ZONE = 0.18;
    const HEAD_FRAC_X = 0.407;
    const HEAD_FRAC_Y = 0.148;
    const HEAD_TYPING_DX = 300;
    const HEAD_TYPING_DY = 200;
    const HEAD_H_FRAC = 0.084;
    const ITEM_SCALE = 2;
    const ITEM_OFFSET_X = 200;
    const ITEM_OFFSET_Y = 100;
    const ITEM_DEFS = {
      earL: { file: 'cat_ear_yellow (@catboymech).png', dx: -0.55, dy: -0.62, w: 0.30, rot: -6 },
      earR: { file: 'cat_ear_yellow (@catboymech).png', dx: 0.55, dy: -0.62, w: 0.30, rot: 6, flip: true },
      tail: { file: 'cat_tail_yellow (@catboymech).png', dx: 0.85, dy: 1.9, w: 0.42, rot: 24 },
      heart: { file: '327d844f6f82086d6b7aa8e3f31f3e77386a9932396e-VyQqgZ_fw1200.gif', dx: 1.0, dy: -0.25, w: 1.1, rot: -12 },
      zzz: { file: '04a17bbe2c3b452bbef1c2ea4245b3d4.gif', dx: -0.85, dy: -0.15, w: 0.35, rot: 0 },
      think: { file: '80f4ed5be073938a10e64e89619d49706ccb63ed7b4a4-FzOpwi.gif', dx: 0.85, dy: -0.25, w: 0.3, rot: 0 },
      exclaim: { file: '6fdfda1203dc5fe9c6a44262fc93318c356d4cbecf0e-8UCPLP.png', dx: 0.9, dy: -0.3, w: 0.25, rot: 8 },
      question: { file: 'd3d2b926eb184d8c6e7392867925f468d4b77a191eb2-oJhcbd.png', dx: 0.9, dy: -0.35, w: 0.44, rot: -6 },
      cream: { file: '奶油.png', dx: 0.35, dy: 0.55, w: 0.2, rot: 0 },
    };
    const ITEMS_BY_EXP = {
      thinking: ['think'],
      surprised: ['exclaim'],
      confused: ['question'],
      love: ['heart'],
      cat: ['earL', 'earR', 'tail'],
      cream: ['cream'],
    };
    const FISCHL_PRESET = {
      '--dsw-alias-bg-base': 'rgba(21, 15, 33, 0.45)',
      '--dsw-alias-bg-layer-1': 'rgba(31, 21, 49, 0.60)',
      '--dsw-alias-bg-layer-2': 'rgba(43, 28, 71, 0.66)',
      '--dsw-alias-bg-overlay': 'rgba(53, 34, 80, 0.88)',
      '--dsw-alias-border-l1': 'rgba(214, 177, 106, 0.14)',
      '--dsw-alias-border-l2': 'rgba(226, 188, 108, 0.24)',
      '--dsw-alias-brand-primary': '#b98cff',
      '--dsw-alias-label-primary': '#efe7fb',
      '--dsw-alias-label-secondary': '#a292c6',
      '--dsw-alias-state-error-primary': '#ff7d8e',
      '--dsw-alias-state-success-primary': '#7fe08e',
      '--dsw-alias-state-warn-primary': '#ffd76e',
      '--dsw-specific-sidebar-fill': 'rgba(24, 17, 36, 0.62)',
    };
    const EXPR_ALIAS = { wink: '挤眼', starry: '星星眼', cute: '可爱' };
    const EXPR_FACE = { wink: '挤眼', starry: '星星眼', cute: '可爱', idle: '待机', cat: 'happy', cream: 'shy' };
    function canonicalExpId(id) { return EXPR_ALIAS[id] || id; }
    function faceIdFor(id) { return EXPR_FACE[id] || id; }
    const PY = {
      你:'i', 我:'o', 的:'e', 是:'i', 了:'e', 在:'a', 人:'e', 有:'o', 不:'u', 这:'e', 那:'a', 一:'i', 就:'u', 说:'o', 来:'a', 去:'u', 会:'i', 能:'e', 想:'a', 要:'a', 也:'e', 和:'e', 到:'a', 吗:'a', 呢:'e', 吧:'a', 啊:'a', 哦:'o', 嗯:'e', 呀:'a',
      皇:'a', 女:'u', 菲:'e', 谢:'e', 尔:'e', 奥:'a', 兹:'i', 本:'e', 断:'a', 罪:'i', 之:'i', 雷:'e', 幽:'o', 夜:'e', 净:'i', 土:'u', 千:'a', 年:'a', 未:'e', 褪:'i', 光:'a', 辉:'i',
      汝:'u', 竟:'i', 敢:'a', 触:'u', 碰:'e', 发:'a', 冠:'a', 此:'i', 等:'e', 僭:'a', 越:'e', 可:'e', 招:'a', 唔:'u', 身:'e', 金:'i', 哼:'e', 被:'e', 魅:'e', 力:'i', 震:'e', 慑:'e', 难:'a', 怪:'a',
      轻:'i', 浮:'u', 替:'i', 吾:'u', 记:'i', 下:'a', 无:'u', 礼:'i', 徒:'u', 状:'a', 圣:'e', 裁:'a', 正:'e', 蓄:'u', 积:'i', 若:'o', 再:'a', 冒:'a', 犯:'a', 便:'a', 赐:'i', 决:'e', 衣:'i', 装:'a', 乃:'a', 战:'a', 袍:'a', 给:'e', 知:'i', 挑:'a', 需:'u', 何:'e', 觉:'e', 悟:'u',
      刚:'a', 够:'o', 判:'a', 三:'a', 个:'e', 月:'e', 书:'u', 所:'o', 述:'u', 鸦:'a', 王:'a', 国:'o', 事:'i', 倒:'a', 分:'e', 乡:'a', 影:'i', 子:'i', 抱:'a', 歉:'a', 方:'a', 随:'i', 巡:'u', 游:'o', 页:'e', 间:'a',
      呜:'u', 头:'o', 好:'a', 晕:'u', 邪:'e', 术:'u', 饶:'a', 恕:'u', 猫:'a', 耳:'e', 尾:'e', 爱:'a', 心:'i', 思:'i', 考:'a', 惊:'i', 讶:'a', 疑:'i', 惑:'o', 奶:'a', 油:'o', 读:'u', 中:'o', 勿:'u', 扰:'a', 笑:'a', 呆:'a', 眨:'a', 星:'i', 挤:'i', 眼:'a', 黑:'e', 脸:'a', 问:'e', 答:'a', 叹:'a', 息:'i', 常:'a', 见:'a', 什:'e', 么:'e', 得:'e', 出:'u', 现:'a', 情:'i', 起:'i', 没:'e', 意:'i', 忘:'a', 开:'a', 始:'i', 结:'e', 束:'u', 东:'o', 西:'i', 南:'a', 北:'e', 天:'a', 地:'i', 大:'a', 小:'a', 多:'o', 少:'a', 高:'a', 低:'i', 前:'a', 后:'o', 左:'o', 右:'o', 上:'a', 下:'a', 里:'i', 外:'a', 新:'i', 旧:'u', 真:'e', 假:'a', 美:'e', 丽:'i', 强:'a', 弱:'o', 快:'a', 慢:'a', 白:'a', 红:'o', 蓝:'a', 紫:'i', 银:'i', 风:'e', 云:'u', 雨:'u', 雪:'e', 电:'a', 闪:'a', 剑:'a', 弓:'o', 箭:'a', 城:'e', 堡:'o', 塔:'a', 门:'e', 窗:'a', 灯:'e', 火:'o', 水:'i', 山:'a', 石:'i', 树:'u', 花:'a', 草:'a', 鸟:'a', 鱼:'u', 马:'a', 龙:'o', 凤:'e', 公:'o', 主:'u', 骑:'i', 士:'i', 勇:'o', 者:'e', 英:'i', 雄:'o', 男:'a', 孩:'a', 朋:'e', 友:'o', 老:'a', 师:'i', 同:'o', 学:'e', 家:'a', 房:'a', 桌:'o', 椅:'i', 床:'a', 笔:'i', 纸:'i', 墨:'o', 画:'a', 歌:'e', 舞:'u', 乐:'e', 音:'i', 色:'e', 香:'a', 味:'e', 甜:'a', 苦:'u', 辣:'a', 酸:'a', 咸:'a', 饭:'a', 菜:'a', 茶:'a', 酒:'u', 肉:'o', 蛋:'a', 面:'a', 包:'a', 点:'a', 时:'i', 间:'a', 分:'e', 秒:'a', 今:'i', 明:'i', 昨:'o', 日:'i', 晨:'e', 午:'u', 晚:'a', 早:'a', 长:'a', 短:'a', 宽:'a', 窄:'e', 厚:'o', 薄:'o', 圆:'a', 方:'a', 直:'i', 弯:'a', 平:'i', 斜:'e', 顺:'u', 逆:'i', 进:'i', 回:'i', 走:'o', 跑:'a', 跳:'a', 飞:'e', 爬:'a', 看:'a', 听:'i', 写:'e', 念:'a', 哭:'u', 叫:'a', 喊:'a', 唱:'a', 讲:'a', 认:'e', 识:'i', 懂:'o', 清:'i', 楚:'u', 错:'o', 对:'i', 坏:'a'
    };
    const HASH_VOWELS = ['a', 'e', 'i', 'o', 'u'];
    function textToPhonemes(text) {
      const out = [];
      for (const ch of String(text || '')) {
        const code = ch.charCodeAt(0);
        if (code >= 65 && code <= 90) out.push(VOWELS[String.fromCharCode(code + 32)] || 'e');
        else if (code >= 97 && code <= 122) out.push(VOWELS[ch] || 'e');
        else if (code >= 48 && code <= 57) out.push('e');
        else if (PY[ch]) out.push(PY[ch]);
        else if (code >= 0x4e00 && code <= 0x9fff) out.push(HASH_VOWELS[code % 5]);
        else out.push(' ');
      }
      return out.join('');
    }
    function lineToSpeech(line) {
      return { text: line, ph: textToPhonemes(line) };
    }
    function hexToRgb(hex) {
      let h = String(hex || '#ffffff').replace('#', '');
      if (h.length === 3) h = h.split('').map((c) => c + c).join('');
      const n = parseInt(h, 16);
      if (!isFinite(n) || h.length !== 6) return { r: 255, g: 255, b: 255 };
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    function rgbToHex(r, g, b) {
      const p = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
      return '#' + p(r) + p(g) + p(b);
    }
    function rgba(hex, alpha) {
      const c = hexToRgb(hex);
      return 'rgba(' + c.r + ', ' + c.g + ', ' + c.b + ', ' + alpha + ')';
    }
    function shade(hex, delta) {
      const c = hexToRgb(hex);
      return rgbToHex(c.r + delta, c.g + delta, c.b + delta);
    }
    function hsvToRgb(h, s, v) {
      const f = (n) => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); };
      return { r: Math.round(f(5) * 255), g: Math.round(f(3) * 255), b: Math.round(f(1) * 255) };
    }
    function rgbToHsv(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0;
      const d = max - min;
      s = max === 0 ? 0 : d / max;
      if (d !== 0) {
        if (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
      }
      return { h: h, s: s, v: max };
    }
    function defaultCfg() {
      return {
        theme: { mode: 'preset', colors: { bg: '#150f21', border: '#d6b16a', text: '#efe7fb', specialText: '#ffd76e', icon: '#a292c6', activeIcon: '#b98cff' }, stars: true, bgImage: null, keepTheme: true },
        model: {
          folder: 'fischl_1.6', model3: 'fischl_live2d_1.6.model3.json', version: 1,
          idle: { x: 814.33, y: -258.44, scale: 0.48 },
          typing: { x: 678.78, y: -158.22, scale: 0.95 },
          expressions: {
            angry: true, chuunibyou: true, confused: true, dizzy: true, eyerecover: false, eyetest: false,
            happy: true, laugh: true, love: false, sad: true, shocked: true, shy: true, surprised: true,
            thinking: true, zzz: false, '可爱': false, '待机': false, '挤眼': true, '星星眼': true, '黑脸': true,
            cat: false, cream: false,
          },
          motion: { enabled: true, file: 'motion/READBOOK1.motion3.json', idleSeconds: 28 },
          follow: { enabled: true, headX: 221.33, headY: -287.78, size: 0.6, typingHeadX: 164.89, typingHeadY: -386.89 },
          touch: { x: 50, y: 0, w: 50, h: 100 },
          presets: {},
        },
        interact: {
          name: '菲谢尔 ',
          exprRate: 70,
          bubble: { left: 79, top: 20, width: 300 },
          lines: DEFAULT_LINES.map((l, i) => ({ id: 'dl' + (i + 1), text: l.text, exp: l.exp })),
          dizzy: { text: DEFAULT_DIZZY.text, exp: DEFAULT_DIZZY.exp },
          wake: { enabled: DEFAULT_WAKE.enabled, text: DEFAULT_WAKE.text, exp: DEFAULT_WAKE.exp },
        },
      };
    }
    function loadCfg() {
      const base = defaultCfg();
      try {
        const raw = window.localStorage.getItem('dl2d.cfg.v1');
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved && saved.theme) base.theme = Object.assign(base.theme, saved.theme);
          if (saved && saved.model) {
            base.model = Object.assign(base.model, saved.model);
            base.model.idle = Object.assign({ x: 0, y: 0, scale: 0.4667 }, saved.model.idle);
            base.model.typing = Object.assign({ x: 0, y: 0, scale: 0.9334 }, saved.model.typing);
            base.model.motion = Object.assign({ enabled: true, file: 'READBOOK1.motion3.json', idleSeconds: 28 }, saved.model.motion);
            base.model.follow = Object.assign({ enabled: true, headX: 0, headY: 0, size: 1, typingHeadX: 0, typingHeadY: 0 }, saved.model.follow);
            base.model.touch = Object.assign({ x: 50, y: 0, w: 50, h: 100 }, saved.model.touch);
          }
          if (saved && saved.interact) {
            base.interact = Object.assign(base.interact, saved.interact);
            if (typeof saved.interact.exprRate !== 'number') base.interact.exprRate = 50;
            if (saved.interact.bubble) {
              const b = saved.interact.bubble;
              if (typeof b.left === 'number') base.interact.bubble.left = b.left;
              else if (typeof b.right === 'number') base.interact.bubble.left = Math.max(0, Math.min(85, 100 - b.right));
              if (typeof b.top === 'number') base.interact.bubble.top = b.top;
              else if (typeof b.bottom === 'number') base.interact.bubble.top = Math.max(0, Math.min(90, 100 - b.bottom));
              if (typeof b.width === 'number') base.interact.bubble.width = b.width;
            }
            // 台词表格迁移：旧 textarea 字符串 → 数组；缺失或为空时填入默认台词
            if (!Array.isArray(base.interact.lines)) {
              if (typeof base.interact.lines === 'string') {
                const split = base.interact.lines.split(/[\r\n]+/).map((s) => s.trim()).filter((s) => s.length > 0);
                base.interact.lines = split.length
                  ? split.map((text) => ({ id: newLineId(), text: text, exp: '' }))
                  : DEFAULT_LINES.map((l) => ({ id: newLineId(), text: l.text, exp: l.exp }));
              } else {
                base.interact.lines = DEFAULT_LINES.map((l) => ({ id: newLineId(), text: l.text, exp: l.exp }));
              }
            } else {
              base.interact.lines = base.interact.lines.map((l) => {
                if (!l || typeof l !== 'object') return { id: newLineId(), text: String(l || ''), exp: '' };
                return { id: l.id || newLineId(), text: String(l.text || ''), exp: typeof l.exp === 'string' ? l.exp : '' };
              });
            }
            if (!base.interact.dizzy || typeof base.interact.dizzy !== 'object') {
              base.interact.dizzy = { text: DEFAULT_DIZZY.text, exp: DEFAULT_DIZZY.exp };
            } else {
              base.interact.dizzy = {
                text: String(base.interact.dizzy.text || DEFAULT_DIZZY.text),
                exp: typeof base.interact.dizzy.exp === 'string' ? base.interact.dizzy.exp : DEFAULT_DIZZY.exp,
              };
            }
            if (!base.interact.wake || typeof base.interact.wake !== 'object') {
              base.interact.wake = { enabled: true, text: DEFAULT_WAKE.text, exp: DEFAULT_WAKE.exp };
            } else {
              base.interact.wake = {
                enabled: typeof base.interact.wake.enabled === 'boolean' ? base.interact.wake.enabled : true,
                text: String(base.interact.wake.text || DEFAULT_WAKE.text),
                exp: typeof base.interact.wake.exp === 'string' ? base.interact.wake.exp : '',
              };
            }
          }
        }
      } catch (e) { /* ignore */ }
      if (!base.model.motion.file) {
        base.model.motion = { enabled: true, file: 'READBOOK1.motion3.json', idleSeconds: 28 };
      }
      return base;
    }
    function loadPresets() {
      try {
        const raw = window.localStorage.getItem('dl2d.presets.v1');
        if (raw) {
          const p = JSON.parse(raw);
          return p && typeof p === 'object' ? p : {};
        }
      } catch (e) { /* ignore */ }
      return {};
    }

    const inject = ['timer', 'theme', 'slots', 'workspaces'];
    function apply(ctx) {
      const theme = ctx.get('theme');
      const slots = ctx.get('slots');
      const workspaces = ctx.get('workspaces');
      if (!theme || !slots) return;
      const cfg = loadCfg();
      let cfgVersion = 0;
      const cfgListeners = new Set();
      function publishCfg() { cfgVersion += 1; for (const fn of [...cfgListeners]) { try { fn(cfgVersion); } catch (e) { /* ignore */ } } }
      function saveCfg() { try { window.localStorage.setItem('dl2d.cfg.v1', JSON.stringify(cfg)); } catch (e) { /* ignore */ } publishCfg(); }
      function useCfgVersion() {
        const [v, setV] = React.useState(cfgVersion);
        React.useEffect(() => { cfgListeners.add(setV); return () => { cfgListeners.delete(setV); }; }, []);
        return v;
      }
      function patchCfg(path, value) {
        const parts = path.split('.');
        let node = cfg;
        for (let i = 0; i < parts.length - 1; i += 1) node = node[parts[i]];
        node[parts[parts.length - 1]] = value;
        saveCfg();
      }
      function expIsEnabled(id) {
        const c = canonicalExpId(id);
        return !cfg.model.expressions || cfg.model.expressions[c] !== false;
      }
      function modelKey(folder, model3) { return String(folder || '') + '|' + String(model3 || ''); }
      function cloneModelParams() {
        return {
          idle: Object.assign({}, cfg.model.idle),
          typing: Object.assign({}, cfg.model.typing),
          follow: Object.assign({}, cfg.model.follow),
          motion: Object.assign({}, cfg.model.motion),
        };
      }
      function applyModelSwitch(nextFolder, nextModel3) {
        if (!nextFolder || !nextModel3) return;
        if (nextFolder === cfg.model.folder && nextModel3 === cfg.model.model3) return;
        // 保存旧模型参数记忆
        const oldKey = modelKey(cfg.model.folder, cfg.model.model3);
        if (!cfg.model.presets) cfg.model.presets = {};
        cfg.model.presets[oldKey] = cloneModelParams();
        // 恢复新模型记忆，或首次使用该模型 → 中性参数 + auto scale（-1）
        const key = modelKey(nextFolder, nextModel3);
        const saved = cfg.model.presets[key];
        if (saved && saved.idle) {
          cfg.model.idle = saved.idle;
          cfg.model.typing = saved.typing;
          cfg.model.follow = saved.follow;
          cfg.model.motion = saved.motion;
        } else {
          cfg.model.idle = { x: 0, y: 0, scale: -1 };
          cfg.model.typing = { x: 0, y: 0, scale: -1 };
          cfg.model.follow = { enabled: true, headX: 0, headY: 0, size: 1, typingHeadX: 0, typingHeadY: 0 };
          cfg.model.motion = { enabled: true, file: '', idleSeconds: 28 };
        }
        cfg.model.folder = nextFolder;
        cfg.model.model3 = nextModel3;
        cfg.model.expressions = null; // 重新检测新模型的表情勾选
        cfg.model.version += 1;
        saveCfg();
        // 异步：首次使用时自动挑选新模型的第一个动作
        if (!cfg.model.motion.file) {
          apiGet('/fischl/api/assets?folder=' + encodeURIComponent(nextFolder)).then((r) => {
            const motions = (r && r.motions) || [];
            if (cfg.model.folder === nextFolder && cfg.model.model3 === nextModel3 && !cfg.model.motion.file && motions.length) {
              cfg.model.motion.file = motions[0].file;
              saveCfg();
            }
          }).catch(() => {});
        }
      }
      const followBox = { el: null, idle: { x: 0, y: 0, w: 0, h: 0 }, typing: { x: 0, y: 0, w: 0, h: 0 }, hideTimer: null };
      function flashFollowBox(which) {
        const el = followBox.el;
        if (!el) return;
        const box = which === 'typing' ? followBox.typing : followBox.idle;
        el.style.display = 'block';
        el.style.left = Math.round(box.x - box.w / 2) + 'px';
        el.style.top = Math.round(box.y - box.h / 2) + 'px';
        el.style.width = Math.round(box.w) + 'px';
        el.style.height = Math.round(box.h) + 'px';
        if (followBox.hideTimer) { try { followBox.hideTimer(); } catch (e) { /* ignore */ } }
        followBox.hideTimer = ctx.timeout(() => { const e2 = followBox.el; if (e2) e2.style.display = 'none'; }, 2600);
      }
      let themeGen = 0;
      let themeDisposer = null;
      function disposeThemeNow() { if (themeDisposer) { try { themeDisposer(); } catch (e) { /* ignore */ } themeDisposer = null; } }
      function buildTokens() {
        if (cfg.theme.mode === 'custom') {
          const c = cfg.theme.colors;
          return {
            '--dsw-alias-bg-base': rgba(c.bg, 0.45),
            '--dsw-alias-bg-layer-1': rgba(shade(c.bg, 12), 0.62),
            '--dsw-alias-bg-layer-2': rgba(shade(c.bg, 22), 0.68),
            '--dsw-alias-bg-overlay': rgba(shade(c.bg, 32), 0.9),
            '--dsw-alias-border-l1': rgba(c.border, 0.4),
            '--dsw-alias-border-l2': c.border,
            '--dsw-alias-brand-primary': c.activeIcon,
            '--dsw-alias-label-primary': c.text,
            '--dsw-alias-label-secondary': c.icon,
            '--dsw-alias-state-error-primary': '#ff7d8e',
            '--dsw-alias-state-success-primary': '#7fe08e',
            '--dsw-alias-state-warn-primary': c.specialText,
            '--dsw-specific-sidebar-fill': rgba(shade(c.bg, -6), 0.62),
          };
        }
        return FISCHL_PRESET;
      }
      let applyingTheme = false;
      let activeDynamicId = 'fischl';
      let currentTokensKey = null;
      function applyTokens() {
        // reentrancy 防抖：theme.register/setTheme 会同步触发 theme/change，
        // 避免监听器抢回逻辑递归调用本函数造成卡顿
        if (applyingTheme) return;
        applyingTheme = true;
        try {
          const tokens = buildTokens();
          const key = JSON.stringify(tokens);
          if (key === currentTokensKey) {
            // token 未变：仅确保激活（ThemeRuntime.setTheme 幂等，preference 相同则零开销）
            try { theme.setTheme(activeDynamicId); } catch (e) { /* ignore */ }
            return;
          }
          currentTokensKey = key;
          themeGen += 1;
          const id = 'fischl' + themeGen;
          let newDisposer = null;
          try {
            newDisposer = theme.register({ id: id, colorScheme: 'dark', tokens: tokens });
          } catch (e) {
            themeDisposer = null;
            for (const k of Object.keys(tokens)) { try { document.documentElement.style.setProperty(k, tokens[k]); } catch (e3) { /* ignore */ } }
            try { theme.setTheme('fischl'); } catch (e4) { /* ignore */ }
            return;
          }
          const oldDisposer = themeDisposer;
          themeDisposer = newDisposer;
          activeDynamicId = id;
          // 先切换再释放旧主题：dispose 当前激活主题会把 preference 重置为 system 并 publish，
          // 而此刻 preference 已是新主题，旧主题 dispose 不会触发重置 → 无抢回递归
          try { theme.setTheme(id); } catch (e) { /* ignore */ }
          if (oldDisposer) { try { oldDisposer(); } catch (e) { /* ignore */ } }
        } finally {
          applyingTheme = false;
        }
      }
      const disposeTheme = theme.register({ id: 'fischl', colorScheme: 'dark', tokens: FISCHL_PRESET });
      ctx.effect(() => { disposeTheme(); disposeThemeNow(); }, 'fischl: theme registry');
      cfgListeners.add(() => { applyTokens(); });
      try { theme.setTheme('fischl'); } catch (error) { /* ignore */ }
      applyTokens();
      const store = {
        snapshot: theme.getTheme(),
        typing: false, reading: false, speech: null, previewTyping: false, version: 0, listeners: new Set(),
      };
      function publishStore() { store.version += 1; for (const listener of [...store.listeners]) listener(store); }
      function subscribeStore(listener) { store.listeners.add(listener); return () => { store.listeners.delete(listener); }; }
      function setPreviewTyping(on) {
        if (store.previewTyping === on) return;
        store.previewTyping = on;
        publishStore();
      }
      function useStoreVersion() {
        const [version, setVersion] = React.useState(store.version);
        React.useEffect(() => subscribeStore(() => setVersion(store.version)), []);
        return version;
      }
      const adjust = { mode: null, listeners: new Set() };
      function setAdjustMode(mode) {
        if (adjust.mode === mode) return;
        adjust.mode = mode;
        for (const fn of [...adjust.listeners]) { try { fn(mode); } catch (e) { /* ignore */ } }
      }
      function useAdjustMode() {
        const [m, setM] = React.useState(adjust.mode);
        React.useEffect(() => { adjust.listeners.add(setM); return () => { adjust.listeners.delete(setM); }; }, []);
        return m;
      }
      function ensureFischlTheme() {
        // 与 DEEP LIVE2D 页签一致的启用路径：动态注册/复用主题并切换
        if (cfg.theme.mode !== 'custom') cfg.theme.mode = 'preset';
        applyTokens();
      }
      let armed = true;
      // 用户点击「启用」后置位：DSH settings 同步（adopt）会把 preference 覆盖回官方值，
      // 只要 keepFischl 为真就持续抢回，保证菲谢尔主题真正保持（applyTokens 幂等，抢回零开销）
      let keepFischl = !!(cfg.theme && cfg.theme.keepTheme);
      ctx.on('theme/change', (snapshot) => {
        store.snapshot = snapshot;
        publishStore();
        const pref = String(snapshot.preference || '');
        const isFischl = pref.indexOf('fischl') === 0;
        if (isFischl) armed = false;
        if (applyingTheme) return;
        if ((armed || keepFischl) && !isFischl) {
          ensureFischlTheme();
        }
      });
      ctx.timeout(() => { armed = false; }, 5000);
      const disposeCss = insertStyle(FISCHL_CSS + buildStarsCss());
      ctx.effect(() => disposeCss, 'fischl: stylesheet');

      function SliderRow(props) {
        useCfgVersion();
        return React.createElement('div', { className: 'dl2d-row' },
          React.createElement('span', { className: 'dl2d-row-label' }, props.label),
          React.createElement('input', { type: 'range', className: 'dl2d-range', min: props.min, max: props.max, step: props.step || 1, value: props.value,
            onMouseDown: props.onTouchStart, onTouchStart: props.onTouchStart, onInput: props.onTouchStart, onKeyDown: props.onTouchStart,
            onMouseUp: props.onTouchEnd, onTouchEnd: props.onTouchEnd, onBlur: props.onTouchEnd, onKeyUp: props.onTouchEnd,
            onChange: (e) => { props.onChange(Number(e.target.value)); if (props.onTouchStart) props.onTouchStart(); } }),
          React.createElement('span', { style: { fontSize: 11, color: '#a292c6', minWidth: 42, textAlign: 'right' } }, props.display !== undefined ? props.display : props.value));
      }
      function ToggleRow(props) {
        useCfgVersion();
        return React.createElement('div', { className: 'dl2d-row' },
          React.createElement('span', { className: 'dl2d-row-label' }, props.label),
          React.createElement('input', { type: 'checkbox', className: 'dl2d-toggle', checked: props.value, onChange: (e) => props.onChange(e.target.checked) }));
      }
      function NumberRow(props) {
        useCfgVersion();
        return React.createElement('div', { className: 'dl2d-row' },
          React.createElement('span', { className: 'dl2d-row-label' }, props.label),
          React.createElement('input', { type: 'number', className: 'dl2d-input', style: { width: 80 }, value: props.value, min: props.min, max: props.max, onChange: (e) => props.onChange(e.target.value === '' ? 0 : Number(e.target.value)) }));
      }
      function HsvPicker(props) {
        const [hex, setHex] = React.useState(props.value);
        const [hsv, setHsv] = React.useState(() => { const c = hexToRgb(props.value); return rgbToHsv(c.r, c.g, c.b); });
        const svRef = React.useRef(null);
        const hueRef = React.useRef(null);
        const commit = (h) => { setHex(h); const c = hexToRgb(h); setHsv(rgbToHsv(c.r, c.g, c.b)); props.onChange(h); };
        const pick = (clientX, clientY, el, mode) => {
          const rect = el.getBoundingClientRect();
          setHsv((p) => {
            const nx = Object.assign({}, p);
            if (mode === 'hue') nx.h = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 360;
            else { nx.s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)); nx.v = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)); }
            const rgb = hsvToRgb(nx.h, nx.s, nx.v);
            const h = rgbToHex(rgb.r, rgb.g, rgb.b);
            setHex(h);
            props.onChange(h);
            return nx;
          });
        };
        const svBg = { background: 'hsl(' + Math.round(hsv.h) + ',100%,50%)' };
        const dotStyle = { position: 'absolute', width: 12, height: 12, borderRadius: 8, border: '2px solid #fff', background: hex, left: hsv.s * 196 - 6, top: (1 - hsv.v) * 118 - 6, boxShadow: '0 0 4px rgba(0,0,0,.6)' };
        const hueDot = { position: 'absolute', top: -2, left: (hsv.h / 360) * 216 - 6, width: 12, height: 16, borderRadius: 4, background: '#fff', border: '1px solid #999' };
        const bind = (mode) => (e) => {
          const el = mode === 'hue' ? hueRef.current : svRef.current;
          pick(e.clientX, e.clientY, el, mode);
          const mv = (ev) => pick(ev.clientX, ev.clientY, el, mode);
          const up = () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
          window.addEventListener('mousemove', mv);
          window.addEventListener('mouseup', up);
        };
        return React.createElement('div', { className: 'dl2d-picker' },
          React.createElement('div', { className: 'dl2d-picker-sv', ref: svRef, style: svBg, onMouseDown: bind('sv') }, React.createElement('div', { style: dotStyle })),
          React.createElement('div', { className: 'dl2d-picker-hue', ref: hueRef, onMouseDown: bind('hue') }, React.createElement('div', { style: hueDot })),
          React.createElement('div', { className: 'dl2d-picker-hex' },
            React.createElement('input', { value: hex, spellCheck: false, onChange: (e) => { const v = e.target.value.trim(); setHex(v); if (/^#?[0-9a-fA-F]{6}$/.test(v)) commit(v.indexOf('#') === 0 ? v : '#' + v); } }),
            React.createElement('button', { className: 'dl2d-btn dl2d-btn-primary', onClick: () => props.onClose && props.onClose() }, '确定')));
      }
      function ColorGroup(props) {
        const [open, setOpen] = React.useState(null);
        useCfgVersion();
        return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 8 } },
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, props.label),
            React.createElement('div', { className: 'dl2d-colors' },
              props.items.map((it) => React.createElement('button', {
                key: it.key, className: 'dl2d-colorbtn', title: it.title, style: { background: it.value },
                onClick: () => setOpen(open === it.key ? null : it.key),
              })))),
          open ? React.createElement(HsvPicker, { value: props.items.find((it) => it.key === open).value, onChange: (v) => props.onColor(open, v), onClose: () => setOpen(null) }) : null);
      }
      function CropModal(props) {
        const [img, setImg] = React.useState(null);
        const [translate, setTranslate] = React.useState({ x: 0, y: 0 });
        const [zoom, setZoom] = React.useState(1);
        const [drag, setDrag] = React.useState(null);
        const [preview, setPreview] = React.useState(null);
        const ratio = window.innerWidth / Math.max(1, window.innerHeight);
        const boxW = Math.min(window.innerWidth * 0.62, 860);
        const boxH = boxW / ratio;
        React.useEffect(() => {
          const image = new window.Image();
          image.onload = () => setImg(image);
          image.onerror = () => setImg(null);
          image.src = props.src;
        }, [props.src]);
        const base = img ? Math.max(boxW / img.naturalWidth, boxH / img.naturalHeight) : 1;
        const scale = base * zoom;
        const w = img ? img.naturalWidth * scale : 0;
        const h = img ? img.naturalHeight * scale : 0;
        const baseX = img ? (boxW - w) / 2 + translate.x : 0;
        const baseY = img ? (boxH - h) / 2 + translate.y : 0;
        const renderPreview = () => {
          if (!img) return;
          const canvas = document.createElement('canvas');
          const scaleOut = Math.min(1, 320 / boxW);
          canvas.width = Math.round(boxW * scaleOut);
          canvas.height = Math.round(boxH * scaleOut);
          const c = canvas.getContext('2d');
          c.drawImage(img, baseX * scaleOut, baseY * scaleOut, w * scaleOut, h * scaleOut);
          setPreview(canvas.toDataURL('image/jpeg', 0.85));
        };
        React.useEffect(() => { renderPreview(); }, [img, translate, zoom]);
        if (!img) return React.createElement('div', { className: 'dl2d-crop-overlay' },
          React.createElement('div', { style: { color: '#d6c6f2' } }, '加载图片…'));
        const onWheel = (e) => { e.preventDefault(); setZoom((z) => Math.max(0.2, Math.min(6, z * (e.deltaY > 0 ? 0.9 : 1.1)))); };
        const onMouseDown = (e) => { e.preventDefault(); setDrag({ x: e.clientX, y: e.clientY }); };
        const onMouseMove = (e) => {
          if (!drag) return;
          setTranslate((t) => ({ x: t.x + (e.clientX - drag.x), y: t.y + (e.clientY - drag.y) }));
          setDrag({ x: e.clientX, y: e.clientY });
        };
        const onMouseUp = () => setDrag(null);
        const confirm = () => {
          const canvas = document.createElement('canvas');
          const scaleOut = Math.min(1, 1600 / boxW);
          canvas.width = Math.round(boxW * scaleOut);
          canvas.height = Math.round(boxH * scaleOut);
          const c = canvas.getContext('2d');
          c.drawImage(img, baseX * scaleOut, baseY * scaleOut, w * scaleOut, h * scaleOut);
          props.onConfirm(canvas.toDataURL('image/jpeg', 0.85));
        };
        const pw = Math.min(220, window.innerWidth * 0.18);
        return React.createElement('div', { className: 'dl2d-crop-overlay', onMouseMove: onMouseMove, onMouseUp: onMouseUp, onMouseLeave: onMouseUp },
          React.createElement('div', { className: 'dl2d-crop-box', style: { width: boxW, height: boxH }, onWheel: onWheel, onMouseDown: onMouseDown },
            React.createElement('img', { src: props.src, style: { width: w, height: h, transform: 'translate(' + baseX + 'px,' + baseY + 'px)' } })),
          preview ? React.createElement('div', { className: 'dl2d-crop-preview', style: { width: pw, height: Math.round(pw / ratio) } },
            React.createElement('img', { src: preview, alt: '', style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }))
          : null,
          React.createElement('div', { className: 'dl2d-crop-bar' },
            React.createElement('button', { className: 'dl2d-btn dl2d-btn-primary', onClick: confirm }, '确认裁切'),
            React.createElement('button', { className: 'dl2d-btn', onClick: props.onCancel }, '取消'),
            React.createElement('span', { style: { color: '#a292c6', fontSize: 11, alignSelf: 'center' } }, '拖拽移动 · 滚轮缩放 · 右侧为最终效果')));
      }
      function ThemeCard() {
        useCfgVersion();
        const [bgSrc, setBgSrc] = React.useState(null);
        const fileRef = React.useRef(null);
        const colorKeys = [['bg', '背景色'], ['border', '边框色'], ['text', '文字颜色'], ['specialText', '特殊文字颜色'], ['icon', '图标颜色'], ['activeIcon', '活动图标颜色']];
        const onPickBg = (e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => setBgSrc(String(reader.result));
          reader.readAsDataURL(file);
          e.target.value = '';
        };
        const card = React.createElement('div', { className: 'dl2d-card' },
          React.createElement('div', { className: 'dl2d-card-title' }, React.createElement('span', { className: 'dl2d-card-mark' }, '✦'), '主题'),
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, '预设 / 自定义'),
            React.createElement('select', { className: 'dl2d-select', value: cfg.theme.mode, onChange: (e) => { cfg.theme.keepTheme = true; patchCfg('theme.mode', e.target.value); } },
              React.createElement('option', { value: 'preset' }, '预设'),
              React.createElement('option', { value: 'custom' }, '自定义'))),
          cfg.theme.mode === 'custom' ? React.createElement(React.Fragment, null,
            React.createElement(ColorGroup, {
              label: '主题色',
              items: colorKeys.map(([key, title]) => ({ key: key, title: title, value: cfg.theme.colors[key] })),
              onColor: (key, v) => patchCfg('theme.colors.' + key, v),
            }),
            React.createElement(ToggleRow, { label: '星空效果', value: cfg.theme.stars, onChange: (v) => patchCfg('theme.stars', v) }),
            React.createElement('div', { className: 'dl2d-row' },
              React.createElement('span', { className: 'dl2d-row-label' }, '背景图片'),
              React.createElement('button', { className: 'dl2d-btn', onClick: () => fileRef.current && fileRef.current.click() }, '点击选择'),
              React.createElement('input', { ref: fileRef, type: 'file', accept: 'image/*', style: { display: 'none' }, onChange: onPickBg })),
            cfg.theme.bgImage ? React.createElement('div', { className: 'dl2d-row' },
              React.createElement('img', {
                src: cfg.theme.bgImage, alt: '',
                style: { width: 200, height: Math.round(200 * window.innerHeight / Math.max(1, window.innerWidth)), objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: '1px solid rgba(178,138,255,.3)' },
                onClick: () => fileRef.current && fileRef.current.click(),
                title: '点击替换背景图片',
              }),
              React.createElement('button', { className: 'dl2d-btn', onClick: () => patchCfg('theme.bgImage', null) }, '清除'))
            : null)
          : React.createElement('div', { className: 'dl2d-row' },
              React.createElement('span', { className: 'dl2d-row-label', style: { color: '#a292c6' } }, '当前预设'),
              React.createElement('span', { style: { fontSize: 12, color: '#d6c6f2' } }, '菲谢尔主题')));
        if (bgSrc) {
          return React.createElement(React.Fragment, null,
            card,
            React.createElement(CropModal, { src: bgSrc, onCancel: () => setBgSrc(null), onConfirm: (dataUrl) => { patchCfg('theme.bgImage', dataUrl); setBgSrc(null); } }));
        }
        return card;
      }
      function ModelCard() {
        useCfgVersion();
        const [assets, setAssets] = React.useState({ expressions: [], motions: [] });
        const [assetsLoaded, setAssetsLoaded] = React.useState(false);
        const [models, setModels] = React.useState([]);
        const [busy, setBusy] = React.useState(false);
        const [curvesLoaded, setCurvesLoaded] = React.useState(false);
        React.useEffect(() => {
          let dead = false;
          setAssetsLoaded(false);
          apiGet('/fischl/api/models').then((r) => { if (!dead && r) setModels(r.models || []); }).catch(() => {});
          apiGet('/fischl/api/assets?folder=' + encodeURIComponent(cfg.model.folder)).then((r) => { if (!dead && r) { setAssets({ expressions: r.expressions || [], motions: r.motions || [] }); setAssetsLoaded(true); } }).catch(() => { setAssetsLoaded(true); });
          return () => { dead = true; };
        }, [cfg.model.folder]);
        React.useEffect(() => {
          setCurvesLoaded(false);
          if (cfg.model.motion.file) {
            apiGet('/fischl/api/motion-curves?folder=' + encodeURIComponent(cfg.model.folder) + '&file=' + encodeURIComponent(cfg.model.motion.file)).then((r) => { if (r && r.ok) setCurvesLoaded(true); }).catch(() => {});
          }
        }, [cfg.model.folder, cfg.model.motion.file]);
        const detected = assetsLoaded && !assets.expressions.length ? [] : (assets.expressions.length ? assets.expressions.map((e) => e.id) : DEFAULT_EXPS);
        const seen = {};
        const exps = [];
        for (const d of detected) if (!seen[d]) { seen[d] = 1; exps.push({ id: d }); }
        if (detected.length) for (const v of ['cat', 'cream']) if (!seen[v]) { seen[v] = 1; exps.push({ id: v }); }
        const motionOpts = (() => {
          const list = assets.motions ? assets.motions.slice() : [];
          if (cfg.model.motion.file && !list.some((m) => m.file === cfg.model.motion.file)) {
            list.unshift({ id: cfg.model.motion.file.replace(/\.motion3\.json$/i, '').split('/').pop(), file: cfg.model.motion.file });
          }
          return list;
        })();
        const modelOptions = models.slice();
        if (cfg.model.folder && !modelOptions.some((m) => m.folder === cfg.model.folder)) {
          modelOptions.push({ folder: cfg.model.folder, model3: cfg.model.model3 });
        }
        const adjustMode = useAdjustMode();
        const adjBtn = (mode, label) => React.createElement('button', {
          className: 'dl2d-btn' + (adjustMode === mode ? ' dl2d-btn-primary' : ''),
          onClick: () => setAdjustMode(adjustMode === mode ? null : mode),
        }, label);
        const resetModelPos = () => {
          cfg.model.idle.x = 0; cfg.model.idle.y = 0;
          cfg.model.typing.x = 0; cfg.model.typing.y = 0;
          saveCfg();
        };
        const resetHeadPos = () => {
          cfg.model.follow.headX = 0; cfg.model.follow.headY = 0;
          cfg.model.follow.typingHeadX = 0; cfg.model.follow.typingHeadY = 0;
          saveCfg();
        };
        const resetTouchArea = () => {
          cfg.model.touch = { x: 50, y: 0, w: 50, h: 100 };
          saveCfg();
        };
        const pickFolder = () => {
          if (!workspaces) return;
          setBusy(true);
          Promise.resolve(workspaces.pickDirectory()).then((path) => {
            if (!path) { setBusy(false); return; }
            return apiPost('/fischl/api/set-folder', { path: path }).then((r) => {
              setBusy(false);
              if (r && r.ok && r.folder && r.model3) {
                applyModelSwitch(r.folder, r.model3);
              }
            });
          }).catch(() => setBusy(false));
        };
        const followFlash = (which) => () => flashFollowBox(which);
        const previewOn = () => setPreviewTyping(true);
        const previewOff = () => setPreviewTyping(false);
        const previewTypingOn = () => { setPreviewTyping(true); flashFollowBox('typing'); };
        return React.createElement('div', { className: 'dl2d-card' },
          React.createElement('div', { className: 'dl2d-card-title' }, React.createElement('span', { className: 'dl2d-card-mark' }, '⚡'), 'Live2D 模型'),
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, '模型文件夹'),
            React.createElement('select', {
              className: 'dl2d-select', style: { flex: 1 }, value: cfg.model.folder,
              onChange: (e) => {
                const m = models.find((x) => x.folder === e.target.value);
                if (m) applyModelSwitch(m.folder, m.model3);
              },
            }, modelOptions.length ? modelOptions.map((m) => React.createElement('option', { key: m.folder, value: m.folder }, m.folder + ' / ' + m.model3))
              : React.createElement('option', { value: cfg.model.folder }, cfg.model.folder)),            React.createElement('button', { className: 'dl2d-btn', onClick: pickFolder, disabled: busy }, busy ? '…' : '浏览…')),
          adjustMode ? null : React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'dl2d-sub' }, '位置编辑（拖动调整）'),
            React.createElement('div', { className: 'dl2d-adjust-row' },
              adjBtn('idle', '空闲位'),
              adjBtn('typing', '打字位'),
              adjBtn('head', '头部基准'),
              adjBtn('headTyping', '打字头部'),
              adjBtn('touch', '点击区域')),
            React.createElement('div', { className: 'dl2d-adjust-row' },
              React.createElement('button', { className: 'dl2d-btn', onClick: resetModelPos, title: '把模型位置（空闲/打字）恢复为屏幕中央' }, '模型居中'),
              React.createElement('button', { className: 'dl2d-btn', onClick: resetHeadPos, title: '把头部跟随基准恢复为默认（模型头部）' }, '头部居中'),
              React.createElement('button', { className: 'dl2d-btn', onClick: resetTouchArea, title: '把点击区域恢复为默认右半屏' }, '点击区居中'))),
          React.createElement(SliderRow, { label: '空闲·缩放', min: 0.2, max: 1.4, step: 0.01, value: cfg.model.idle.scale, display: cfg.model.idle.scale.toFixed(3), onChange: (v) => patchCfg('model.idle.scale', v) }),
          React.createElement(SliderRow, { label: '打字·缩放', min: 0.4, max: 2.6, step: 0.01, value: cfg.model.typing.scale, display: cfg.model.typing.scale.toFixed(3), onChange: (v) => patchCfg('model.typing.scale', v), onTouchStart: previewOn, onTouchEnd: previewOff }),
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, '表情'),
            assetsLoaded && !exps.length
              ? React.createElement('span', { style: { fontSize: 11, color: '#a292c6' } }, '该模型未提供表情')
              : React.createElement('div', { className: 'dl2d-exps' },
                  exps.map((e) => React.createElement('label', { key: e.id, className: 'dl2d-check' },
                    React.createElement('input', { type: 'checkbox', checked: expIsEnabled(e.id), onChange: (ev) => { if (!cfg.model.expressions) cfg.model.expressions = {}; cfg.model.expressions[canonicalExpId(e.id)] = ev.target.checked; saveCfg(); } }),
                    e.id)))),
          React.createElement(ToggleRow, { label: '待机动作循环', value: cfg.model.motion.enabled, onChange: (v) => patchCfg('model.motion.enabled', v) }),
          cfg.model.motion.enabled ? React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'dl2d-row' },
              React.createElement('span', { className: 'dl2d-row-label' }, '选择动作'),
              React.createElement('select', { className: 'dl2d-select', style: { flex: 1 }, value: cfg.model.motion.file, onChange: (e) => patchCfg('model.motion.file', e.target.value) },
                React.createElement('option', { value: '' }, '（无）'),
                motionOpts.map((m) => React.createElement('option', { key: m.file, value: m.file }, m.id))),
              React.createElement('span', { style: { fontSize: 10, color: curvesLoaded ? '#7fe08e' : '#a292c6' } }, curvesLoaded ? '✓ 已加载' : '解析中')),
            React.createElement(NumberRow, { label: '空闲秒数', min: 0, max: 600, value: cfg.model.motion.idleSeconds, onChange: (v) => patchCfg('model.motion.idleSeconds', v) }))
          : null,
          React.createElement(ToggleRow, { label: '鼠标跟随', value: cfg.model.follow.enabled, onChange: (v) => patchCfg('model.follow.enabled', v) }),
          cfg.model.follow.enabled ? React.createElement(React.Fragment, null,
            React.createElement(SliderRow, { label: '跟随幅度', min: 0.2, max: 3, step: 0.05, value: cfg.model.follow.size, display: cfg.model.follow.size.toFixed(2), onChange: (v) => patchCfg('model.follow.size', v) }))
          : null);
      }
      function InteractCard() {
        useCfgVersion();
        const [assets, setAssets] = React.useState({ expressions: [] });
        React.useEffect(() => {
          let dead = false;
          apiGet('/fischl/api/assets?folder=' + encodeURIComponent(cfg.model.folder)).then((r) => { if (!dead && r) setAssets({ expressions: r.expressions || [] }); }).catch(() => {});
          return () => { dead = true; };
        }, [cfg.model.folder]);
        const expChoices = [];
        const seen = {};
        for (const e of assets.expressions) {
          if (!seen[e.id]) { seen[e.id] = 1; expChoices.push({ value: e.id, label: EXPR_LABELS[e.id] || e.id }); }
        }
        for (const v of ['cat', 'cream', 'dizzy']) if (!seen[v]) { seen[v] = 1; expChoices.push({ value: v, label: EXPR_LABELS[v] || v }); }
        const expOptions = [React.createElement('option', { key: '', value: '' }, '（随机）'),
          ...expChoices.map((c) => React.createElement('option', { key: c.value, value: c.value }, c.label))];
        const lines = Array.isArray(cfg.interact.lines) ? cfg.interact.lines : [];
        const dizzy = cfg.interact.dizzy || { text: '', exp: '' };
        const wake = cfg.interact.wake || { enabled: false, text: '', exp: '' };
        const addLine = () => {
          const next = lines.slice();
          next.push({ id: newLineId(), text: '', exp: '' });
          patchCfg('interact.lines', next);
        };
        const removeLine = (idx) => {
          const next = lines.slice();
          next.splice(idx, 1);
          patchCfg('interact.lines', next);
        };
        return React.createElement('div', { className: 'dl2d-card' },
          React.createElement('div', { className: 'dl2d-card-title' }, React.createElement('span', { className: 'dl2d-card-mark' }, '💬'), '互动'),
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, '模型名称'),
            React.createElement('input', { className: 'dl2d-input', style: { flex: 1 }, value: cfg.interact.name, onChange: (e) => patchCfg('interact.name', e.target.value) })),
          React.createElement('div', { className: 'dl2d-sub' }, '点击互动台词'),
          React.createElement('div', { className: 'dl2d-lines' },
            lines.map((line, idx) => React.createElement('div', { key: line && line.id ? line.id : idx, className: 'dl2d-line-row' },
              React.createElement('input', { className: 'dl2d-line-input', value: line.text, placeholder: '输入一句台词…', onChange: (e) => patchCfg('interact.lines.' + idx + '.text', e.target.value) }),
              React.createElement('select', { className: 'dl2d-select dl2d-line-exp', value: line.exp || '', onChange: (e) => patchCfg('interact.lines.' + idx + '.exp', e.target.value) }, expOptions),
              React.createElement('button', { className: 'dl2d-line-del', title: '删除此行', onClick: () => removeLine(idx) }, '✕'))),
            React.createElement('button', { className: 'dl2d-btn dl2d-line-add', onClick: addLine }, '+ 添加一行')),
          React.createElement('div', { className: 'dl2d-sub' }, '连击彩蛋（快速点击3次）'),
          React.createElement('div', { className: 'dl2d-line-row' },
            React.createElement('input', { className: 'dl2d-line-input', value: dizzy.text, placeholder: '连点3次触发…', onChange: (e) => patchCfg('interact.dizzy.text', e.target.value) }),
            React.createElement('select', { className: 'dl2d-select dl2d-line-exp', value: dizzy.exp || '', onChange: (e) => patchCfg('interact.dizzy.exp', e.target.value) }, expOptions)),
          React.createElement('div', { className: 'dl2d-sub' }, '打断待机动作循环'),
          React.createElement(ToggleRow, { label: '唤醒时说台词', value: !!wake.enabled, onChange: (v) => patchCfg('interact.wake.enabled', v) }),
          wake.enabled ? React.createElement('div', { className: 'dl2d-line-row' },
            React.createElement('input', { className: 'dl2d-line-input', value: wake.text, placeholder: '唤醒时的台词…', onChange: (e) => patchCfg('interact.wake.text', e.target.value) }),
            React.createElement('select', { className: 'dl2d-select dl2d-line-exp', value: wake.exp || '', onChange: (e) => patchCfg('interact.wake.exp', e.target.value) }, expOptions))
          : null,
          React.createElement(SliderRow, { label: '表情概率', min: 0, max: 100, step: 5, value: cfg.interact.exprRate, display: cfg.interact.exprRate + '% 表情 / ' + (100 - cfg.interact.exprRate) + '% 气泡', onChange: (v) => patchCfg('interact.exprRate', v) }),
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, '气泡·水平(右+)'),
            React.createElement('input', { type: 'range', className: 'dl2d-range', min: 0, max: 85, value: cfg.interact.bubble.left, onChange: (e) => patchCfg('interact.bubble.left', Number(e.target.value)) }),
            React.createElement('span', { style: { fontSize: 11, color: '#a292c6', minWidth: 40, textAlign: 'right' } }, cfg.interact.bubble.left + '%')),
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, '气泡·垂直(下+)'),
            React.createElement('input', { type: 'range', className: 'dl2d-range', min: 0, max: 90, value: cfg.interact.bubble.top, onChange: (e) => patchCfg('interact.bubble.top', Number(e.target.value)) }),
            React.createElement('span', { style: { fontSize: 11, color: '#a292c6', minWidth: 40, textAlign: 'right' } }, cfg.interact.bubble.top + '%')),
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, '气泡宽度'),
            React.createElement('input', { type: 'range', className: 'dl2d-range', min: 160, max: 520, step: 4, value: cfg.interact.bubble.width, onChange: (e) => patchCfg('interact.bubble.width', Number(e.target.value)) }),
            React.createElement('span', { style: { fontSize: 11, color: '#a292c6', minWidth: 40, textAlign: 'right' } }, cfg.interact.bubble.width + 'px')));
      }
      function SettingsPage() {
        useCfgVersion();
        const [presets, setPresets] = React.useState(loadPresets());
        const presetNames = Object.keys(presets);
        return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: 14, padding: '6px 2px 12px' } },
          React.createElement(ThemeCard, null),
          React.createElement(ModelCard, null),
          React.createElement(InteractCard, null),
          React.createElement('div', { className: 'dl2d-bottombar' },
            React.createElement('button', { className: 'dl2d-btn', onClick: () => {
              try {
                const fresh = defaultCfg();
                fresh.theme.keepTheme = true; // 恢复默认后仍保持菲谢尔主题
                try { window.localStorage.setItem('dl2d.cfg.v1', JSON.stringify(fresh)); } catch (e) { /* ignore */ }
              } catch (e) { try { window.localStorage.removeItem('dl2d.cfg.v1'); } catch (e2) { /* ignore */ } }
              try { theme.setTheme('fischl'); } catch (e) { /* ignore */ }
              window.location.reload();
            } }, '恢复默认'),
            React.createElement('button', {
              className: 'dl2d-btn',
              onClick: () => {
                const name = window.prompt('预设名称', '我的预设 ' + (presetNames.length + 1));
                if (!name || !name.trim()) return;
                const next = Object.assign({}, presets);
                next[name.trim()] = JSON.parse(JSON.stringify(cfg));
                try { window.localStorage.setItem('dl2d.presets.v1', JSON.stringify(next)); } catch (e) { /* ignore */ }
                setPresets(next);
              },
            }, '保存预设'),
            presetNames.length ? React.createElement('select', {
              className: 'dl2d-select', style: { flex: 1 }, value: '',
              onChange: (e) => {
                const p = presets[e.target.value];
                if (!p) return;
                try { window.localStorage.setItem('dl2d.cfg.v1', JSON.stringify(p)); } catch (err) { /* ignore */ }
                window.location.reload();
              },
            },
              React.createElement('option', { value: '' }, '应用预设…'),
              presetNames.map((n) => React.createElement('option', { key: n, value: n }, n)))
            : null));
      }
      slots.inject('settings.section', () => slots.register(
        { name: 'settings.section', id: 'deep-live2d', order: 100, label: 'DEEP LIVE2D' }, SettingsPage));
      function FischlAppearanceRow() {
        useStoreVersion();
        const on = String(store.snapshot.preference || '').indexOf('fischl') === 0;
        return React.createElement('div', { className: 'dl2d-card' },
          React.createElement('div', { className: 'dl2d-row' },
            React.createElement('span', { className: 'dl2d-row-label' }, '⚡ 菲谢尔主题'),
            React.createElement('button', { type: 'button', className: 'dl2d-btn' + (on ? ' dl2d-btn-primary' : ''), onClick: () => {
              try {
                if (on) {
                  keepFischl = false;
                  if (cfg.theme) cfg.theme.keepTheme = false;
                  saveCfg();
                  theme.setTheme('system');
                } else {
                  keepFischl = true;
                  if (cfg.theme) cfg.theme.keepTheme = true;
                  saveCfg();
                  ensureFischlTheme();
                }
              } catch (error) { /* ignore */ }
            } },
              on ? '✦ 已启用 · 点击关闭' : '✦ 点击启用')));
      }
      slots.inject('settings.general.item', () => slots.register(
        { name: 'settings.general.item', id: 'fischl-appearance', order: 20, label: '菲谢尔主题' }, FischlAppearanceRow));

      let libsPromise = null;
      function loadScript(src) {
        return new Promise((resolve, reject) => {
          const tag = document.createElement('script');
          tag.src = src;
          tag.async = true;
          const fail = (error) => { tag.onload = null; tag.onerror = null; try { tag.remove(); } catch (e) { /* ignore */ } reject(error); };
          tag.onload = () => { tag.onload = null; tag.onerror = null; resolve(); };
          tag.onerror = () => fail(new Error('script failed: ' + src));
          document.head.appendChild(tag);
        });
      }
      function coreVersion(core) {
        try {
          if (core && core.Version && typeof core.Version.csmGetVersion === 'function') return core.Version.csmGetVersion() || 0;
        } catch (error) { /* ignore */ }
        return 0;
      }
      function ensureLibs() {
        if (!libsPromise) {
          libsPromise = (async () => {
            for (const lib of LIB_ORDER) {
              const w = window;
              if (lib.key === 'PIXI' && w.PIXI && w.PIXI.live2d) return;
              if (lib.key && w[lib.key]) continue;
              const sources = [];
              if (!lib.alwaysCdn) sources.push('/fischl/fischl-libs/' + lib.file);
              for (const u of (lib.cdns || (lib.cdn ? [lib.cdn] : []))) sources.push(u);
              let loaded = false;
              for (const src of sources) {
                try {
                  await Promise.race([loadScript(src), ctx.timeout(20000).then(() => { throw new Error('timeout: ' + src); })]);
                  if (!lib.key || w[lib.key]) {
                    const version = lib.minVersion ? coreVersion(w[lib.key]) : 0;
                    if (lib.minVersion && version && version < lib.minVersion) {
                      // 旧版 core 能加载却解析不了 moc3 v5，必须换源而不是当作成功
                      console.warn('fischl: Cubism Core 版本过旧 (0x' + version.toString(16) + ')，无法解析 moc3 v5，继续尝试其他来源：' + src);
                    } else {
                      loaded = true; break;
                    }
                  } else {
                    console.warn('fischl: library loaded but global missing: ' + src);
                  }
                } catch (error) {
                  console.warn('fischl: library source failed: ' + src);
                }
              }
              if (!loaded) throw new Error('渲染库加载失败（已尝试 ' + sources.length + ' 个来源）：' + lib.file);
            }
            if (!window.PIXI || !window.PIXI.live2d) throw new Error('Live2D engine unavailable');
          })().catch((e) => { libsPromise = null; throw e; });
        }
        return libsPromise;
      }
      function findComposer() {
        let best = null;
        let bestArea = -1;
        try {
          const nodes = document.querySelectorAll('textarea, [contenteditable], [role="textbox"]');
          for (let i = 0; i < nodes.length; i += 1) {
            const el = nodes[i];
            try {
              const r = el.getBoundingClientRect();
              const area = r.width * r.height;
              if (r.width > 120 && r.height > 20 && area > bestArea) { bestArea = area; best = { el: el, rect: r }; }
            } catch (e) { /* skip */ }
          }
        } catch (e) { /* ignore */ }
        return best;
      }
      function findMainColumn(composerEl) {
        if (!composerEl) return null;
        try {
          const vw = window.innerWidth || 1;
          const cRect = composerEl.getBoundingClientRect();
          let el = composerEl;
          let best = null;
          for (let i = 0; i < 16; i += 1) {
            el = el.parentElement;
            if (!el) break;
            const r = el.getBoundingClientRect();
            const contains = r.left <= cRect.left + 12 && r.right >= cRect.right - 12 && r.top <= cRect.top + 12 && r.bottom >= cRect.bottom - 12;
            if (!contains) continue;
            if (r.width > vw * 0.9) break;
            if (r.height >= 120 && r.width >= cRect.width * 0.6) best = r;
          }
          return best;
        } catch (e) { return null; }
      }
      function notchFor(overlapRect, trect) {
        const m = 4;
        const W = trect.width;
        const H = trect.height;
        const ix1 = Math.max(0, overlapRect.left - trect.left - m);
        const ix2 = Math.min(W, overlapRect.right - trect.left + m);
        const iy1 = Math.max(0, overlapRect.top - trect.top - m);
        const iy2 = Math.min(H, overlapRect.bottom - trect.top + m);
        if (ix2 <= ix1 || iy2 <= iy1) return null;
        if (ix1 <= 0 && ix2 >= W) return 'polygon(0 0, 100% 0, 100% ' + iy1 + 'px, 0 ' + iy1 + 'px, 0 ' + iy2 + 'px, 100% ' + iy2 + 'px)';
        if (ix1 <= 0) return 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 ' + iy2 + 'px, ' + ix2 + 'px ' + iy2 + 'px, ' + ix2 + 'px ' + iy1 + 'px, 0 ' + iy1 + 'px)';
        if (ix2 >= W) return 'polygon(0 0, 100% 0, 100% ' + iy1 + 'px, ' + ix1 + 'px ' + iy1 + 'px, ' + ix1 + 'px ' + iy2 + 'px, 100% ' + iy2 + 'px, 100% 100%, 0 100%)';
        return 'polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, ' + ix1 + 'px ' + iy1 + 'px, ' + ix2 + 'px ' + iy1 + 'px, ' + ix2 + 'px ' + iy2 + 'px, ' + ix1 + 'px ' + iy2 + 'px)';
      }

      function Live2DCanvas() {
        const touchRef = React.useRef(null);
        const [status, setStatus] = React.useState('loading');
        const [statusError, setStatusError] = React.useState('');
        const handlersRef = React.useRef({});
        const onTouchClick = (event) => { if (typeof handlersRef.current.click === 'function') handlersRef.current.click(event); };
        React.useEffect(() => {
          let cancelled = false;
          let app = null;
          let model = null;
          let core = null;
          let motionManager = null;
          let mw = 1;
          let mh = 1;
          let expPayload = null;
          let motionCurves = null;
          let motionPlay = null;
          let motionCurveIds = [];
          let bookShown = false;
          let lastFlip = 0;
          let calibrated = false;
          let measuredW = 1;
          let measuredH = 1;
          let offsetCenterX = 0;
          let pxPerUnit = 0.02;
          let camW = 640;
          let camH = 800;
          let yIdle = 800;
          let yTyping = 800;
          let lastDiag = 0;
          let modelVersion = cfg.model.version;
          let lastMotionFile = cfg.model.motion.file;
          let lastExp = '';
          let booting = false;
          let bootRetried = false;
          const disposers = [];
          const exists = {};
          const paramAnim = {};
          let exprOwned = {};
          let exprGen = 0;
          const baseParams = {};
          const resting = {};
          const pose = { x: 0, y: 800, s: cfg.model.idle.scale };
          const poseIdle = { x: 0, y: 800, s: cfg.model.idle.scale };
          const poseTyping = { x: 0, y: 800, s: cfg.model.typing.scale };
          const prog = { x: 0, v: 0, target: 0 };
          let mouseNX = 0;
          let mouseNY = 0;
          let followX = 0;
          let followY = 0;
          let ballX = 0;
          let ballY = 0;
          let bodyX = 0;
          let nextBlink = 0;
          let blinkAt = -1;
          let blinkBase = 1;
          let lastActivity = Date.now();
          let nextAmbient = Date.now() + 14000;
          let speechStep = -1;
          let clicks = [];
          let restoreTimer = null;
          const activeItems = {};
          const SKIP_PARAMS = ['ParamEyeLOpen', 'ParamEyeROpen', 'ParamEyeBallX', 'ParamEyeBallY'];
          const nebulaLayer = document.createElement('div');
          nebulaLayer.className = 'fischl-nebula';
          const starsLayer = document.createElement('div');
          starsLayer.className = 'fischl-stars';
          const bgDim = document.createElement('div');
          bgDim.className = 'fischl-bgdim';
          const followEl = document.createElement('div');
          followEl.className = 'dl2d-followbox';
          followBox.el = followEl;
          document.body.appendChild(followEl);
          // ---- 位置调整手柄 / 头部基准标记 ----
          const adjustHandle = document.createElement('div');
          adjustHandle.className = 'fischl-adjust-handle';
          const adjustMark = document.createElement('div');
          adjustMark.className = 'fischl-adjust-mark';
          document.body.appendChild(adjustHandle);
          document.body.appendChild(adjustMark);
          // ---- 点击区域编辑框（可拖拽移动 + 拖拉边角缩放） ----
          const touchEdit = document.createElement('div');
          touchEdit.className = 'fischl-touch-edit';
          const TOUCH_HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
          for (const h of TOUCH_HANDLES) {
            const el = document.createElement('div');
            el.className = 'fischl-touch-handle fischl-touch-h-' + h;
            el.dataset.handle = h;
            touchEdit.appendChild(el);
          }
          document.body.appendChild(touchEdit);
          let touchDrag = null;
          function positionTouchEdit() {
            if (adjust.mode !== 'touch') { touchEdit.style.display = 'none'; return; }
            const t = cfg.model.touch || { x: 50, y: 0, w: 50, h: 100 };
            const vw = window.innerWidth || 1;
            const vh = window.innerHeight || 1;
            touchEdit.style.display = 'block';
            touchEdit.style.left = (t.x / 100 * vw) + 'px';
            touchEdit.style.top = (t.y / 100 * vh) + 'px';
            touchEdit.style.width = (t.w / 100 * vw) + 'px';
            touchEdit.style.height = (t.h / 100 * vh) + 'px';
          }
          function startTouchDrag(e) {
            if (adjust.mode !== 'touch') return;
            e.preventDefault();
            e.stopPropagation();
            const handle = e.target && e.target.dataset ? e.target.dataset.handle : undefined;
            const t = cfg.model.touch || { x: 50, y: 0, w: 50, h: 100 };
            touchDrag = { type: handle || 'move', sx: e.clientX, sy: e.clientY, x: t.x, y: t.y, w: t.w, h: t.h };
            window.addEventListener('pointermove', moveTouchDrag);
            window.addEventListener('pointerup', endTouchDrag);
          }
          function moveTouchDrag(e) {
            if (!touchDrag) return;
            const vw = window.innerWidth || 1;
            const vh = window.innerHeight || 1;
            const dx = (e.clientX - touchDrag.sx) / vw * 100;
            const dy = (e.clientY - touchDrag.sy) / vh * 100;
            const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
            const t = cfg.model.touch || { x: 50, y: 0, w: 50, h: 100 };
            if (touchDrag.type === 'move') {
              t.x = clamp(touchDrag.x + dx, 0, 100 - touchDrag.w);
              t.y = clamp(touchDrag.y + dy, 0, 100 - touchDrag.h);
            } else {
              let x = touchDrag.x, y = touchDrag.y, w = touchDrag.w, h = touchDrag.h;
              const type = touchDrag.type;
              if (type.indexOf('e') >= 0) w = clamp(touchDrag.w + dx, 5, 100 - x);
              if (type.indexOf('s') >= 0) h = clamp(touchDrag.h + dy, 5, 100 - y);
              if (type.indexOf('w') >= 0) { const nw = clamp(touchDrag.w - dx, 5, touchDrag.x + touchDrag.w); w = nw; x = clamp(touchDrag.x + (touchDrag.w - nw), 0, 100 - 5); }
              if (type.indexOf('n') >= 0) { const nh = clamp(touchDrag.h - dy, 5, touchDrag.y + touchDrag.h); h = nh; y = clamp(touchDrag.y + (touchDrag.h - nh), 0, 100 - 5); }
              t.x = x; t.y = y; t.w = w; t.h = h;
            }
            const touch = touchRef.current;
            if (touch) {
              touch.style.left = t.x + '%';
              touch.style.top = t.y + '%';
              touch.style.width = t.w + '%';
              touch.style.height = t.h + '%';
            }
            positionTouchEdit();
          }
          function endTouchDrag() {
            if (!touchDrag) return;
            touchDrag = null;
            window.removeEventListener('pointermove', moveTouchDrag);
            window.removeEventListener('pointerup', endTouchDrag);
            saveCfg();
          }
          touchEdit.addEventListener('pointerdown', startTouchDrag);
          let adjustDrag = null;
          function positionAdjustElements() {
            const mode = adjust.mode;
            if (!mode || mode === 'touch' || !calibrated || measuredW <= 5) { adjustHandle.style.display = 'none'; adjustMark.style.display = 'none'; return; }
            if (mode === 'idle' || mode === 'typing') {
              const poseT = mode === 'typing' ? poseTyping : poseIdle;
              const s = poseT.s;
              const drawnW = (measuredW / 0.4667) * s;
              const drawnH = (measuredH / 0.4667) * s;
              const rect = modelHost.getBoundingClientRect();
              const cx = rect.left + (poseT.x / Math.max(1, camW)) * rect.width;
              const cy = rect.top + ((poseT.y - drawnH / 2) / Math.max(1, camH)) * rect.height;
              adjustHandle.style.width = Math.max(180, drawnW * pxPerUnit * 1.05) + 'px';
              adjustHandle.style.height = Math.max(180, drawnH * pxPerUnit * 1.05) + 'px';
              adjustHandle.style.left = cx + 'px';
              adjustHandle.style.top = cy + 'px';
              adjustHandle.style.display = 'block';
              adjustMark.style.display = 'none';
            } else {
              const ref = computeHeadRef(mode === 'headTyping');
              adjustMark.style.left = ref.x + 'px';
              adjustMark.style.top = ref.y + 'px';
              adjustMark.style.display = 'block';
              adjustHandle.style.display = 'none';
            }
          }
          function startAdjustDrag(e) {
            const mode = adjust.mode;
            if (!mode) return;
            e.preventDefault();
            e.stopPropagation();
            adjustDrag = { mode: mode, sx: e.clientX, sy: e.clientY, ox: 0, oy: 0 };
            if (mode === 'idle') { adjustDrag.ox = cfg.model.idle.x; adjustDrag.oy = cfg.model.idle.y; }
            else if (mode === 'typing') { adjustDrag.ox = cfg.model.typing.x; adjustDrag.oy = cfg.model.typing.y; }
            else if (mode === 'head') { adjustDrag.ox = cfg.model.follow.headX; adjustDrag.oy = cfg.model.follow.headY; }
            else if (mode === 'headTyping') { adjustDrag.ox = cfg.model.follow.typingHeadX; adjustDrag.oy = cfg.model.follow.typingHeadY; }
            window.addEventListener('pointermove', moveAdjustDrag);
            window.addEventListener('pointerup', endAdjustDrag);
          }
          function moveAdjustDrag(e) {
            if (!adjustDrag) return;
            const dxPx = e.clientX - adjustDrag.sx;
            const dyPx = e.clientY - adjustDrag.sy;
            const ppu = Math.max(1, pxPerUnit);
            const mode = adjustDrag.mode;
            // idle/typing 的 x 是屏幕像素语义；y 是 cam 单位（屏幕效果 ×pxPerUnit），需换算
            if (mode === 'idle') { cfg.model.idle.x = adjustDrag.ox + dxPx; cfg.model.idle.y = adjustDrag.oy - dyPx / ppu; }
            else if (mode === 'typing') { cfg.model.typing.x = adjustDrag.ox + dxPx; cfg.model.typing.y = adjustDrag.oy - dyPx / ppu; }
            else if (mode === 'head') { cfg.model.follow.headX = adjustDrag.ox + dxPx / ppu; cfg.model.follow.headY = adjustDrag.oy - dyPx / ppu; }
            else if (mode === 'headTyping') { cfg.model.follow.typingHeadX = adjustDrag.ox + dxPx / ppu; cfg.model.follow.typingHeadY = adjustDrag.oy - dyPx / ppu; }
            updateCameraTargets();
            updatePoseTargets();
            prog.x = prog.target;
            prog.v = 0;
            applyPoseNow();
            if (model) { model.position.set(pose.x, pose.y); model.scale.set(pose.s); }
            updateFollowBoxState();
            positionAdjustElements();
          }
          function endAdjustDrag() {
            if (!adjustDrag) return;
            adjustDrag = null;
            window.removeEventListener('pointermove', moveAdjustDrag);
            window.removeEventListener('pointerup', endAdjustDrag);
            saveCfg();
          }
          adjustHandle.addEventListener('pointerdown', startAdjustDrag);
          adjustMark.addEventListener('pointerdown', startAdjustDrag);
          // ---- 悬浮编辑控制条（高于拖拽手柄，模型再大也不会被挡住） ----
          const adjustBar = document.createElement('div');
          adjustBar.className = 'fischl-adjust-bar';
          const adjustBarRow = document.createElement('div');
          adjustBarRow.className = 'fischl-adjust-bar-row';
          const adjustBarHint = document.createElement('div');
          adjustBarHint.className = 'dl2d-adjust-hint';
          const adjustBarBtns = {};
          for (const [m, label] of [['idle', '空闲位'], ['typing', '打字位'], ['head', '头部基准'], ['headTyping', '打字头部'], ['touch', '点击区域']]) {
            const b = document.createElement('button');
            b.className = 'dl2d-btn';
            b.textContent = label;
            b.dataset.mode = m;
            b.addEventListener('click', () => setAdjustMode(adjust.mode === m ? null : m));
            adjustBarBtns[m] = b;
            adjustBarRow.appendChild(b);
          }
          const adjustDoneBtn = document.createElement('button');
          adjustDoneBtn.className = 'dl2d-btn dl2d-btn-primary';
          adjustDoneBtn.textContent = '完成';
          adjustDoneBtn.addEventListener('click', () => setAdjustMode(null));
          adjustBarRow.appendChild(adjustDoneBtn);
          adjustBar.appendChild(adjustBarRow);
          adjustBar.appendChild(adjustBarHint);
          document.body.appendChild(adjustBar);
          function syncAdjustBar() {
            const mode = adjust.mode;
            if (mode) {
              adjustBar.style.display = 'flex';
              adjustBarHint.textContent = ADJUST_HINTS[mode] || '';
              for (const m of Object.keys(adjustBarBtns)) {
                adjustBarBtns[m].className = 'dl2d-btn' + (m === mode ? ' dl2d-btn-primary' : '');
              }
            } else {
              adjustBar.style.display = 'none';
            }
          }
          function applyAdjustMode() {
            const mode = adjust.mode;
            if (mode === 'typing' || mode === 'headTyping') setPreviewTyping(true);
            else setPreviewTyping(false);
            const touch = touchRef.current;
            if (touch) touch.style.pointerEvents = (mode || uiBlocked) ? 'none' : 'auto';
            if (mode === 'touch') { positionTouchEdit(); adjustHandle.style.display = 'none'; adjustMark.style.display = 'none'; }
            else { positionAdjustElements(); positionTouchEdit(); }
            syncAdjustBar();
          }
          adjust.listeners.add(applyAdjustMode);
          disposers.push(() => {
            adjust.listeners.delete(applyAdjustMode);
            try { adjustHandle.remove(); } catch (e) { /* ignore */ }
            try { adjustMark.remove(); } catch (e) { /* ignore */ }
            try { touchEdit.remove(); } catch (e) { /* ignore */ }
            try { adjustBar.remove(); } catch (e) { /* ignore */ }
            if (adjustDrag) { window.removeEventListener('pointermove', moveAdjustDrag); window.removeEventListener('pointerup', endAdjustDrag); adjustDrag = null; }
            if (touchDrag) { window.removeEventListener('pointermove', moveTouchDrag); window.removeEventListener('pointerup', endTouchDrag); touchDrag = null; }
            setPreviewTyping(false);
          });
          document.body.insertBefore(bgDim, document.body.firstChild);
          document.body.insertBefore(nebulaLayer, document.body.firstChild);
          document.body.insertBefore(starsLayer, document.body.firstChild);
          const modelHost = document.createElement('div');
          modelHost.className = 'fischl-model';
          document.body.insertBefore(modelHost, document.body.firstChild);
          const itemHost = document.createElement('div');
          itemHost.className = 'fischl-items';
          modelHost.appendChild(itemHost);
          function now() { return Date.now(); }
          function setParam(id, value) {
            if (exists[id] && core && isFinite(value)) { try { core.setParameterValueById(id, value); } catch (error) { /* ignore */ } }
          }
          function getParam(id) {
            if (exists[id] && core) {
              try { const v = core.getParameterValueById(id); return isFinite(v) ? v : 0; } catch (error) { /* ignore */ }
            }
            return 0;
          }
          function tweenParam(id, to, dur) {
            if (to === undefined || to === null || !isFinite(to)) return;
            const d = Math.max(25, dur === undefined ? 500 : dur);
            const last = getParam(id);
            paramAnim[id] = { to: to, rate: 4.6 / (d / 1000), start: now(), last: last };
          }
          function blendValue(cur, value, blend) {
            if (!isFinite(cur)) cur = 0;
            if (blend === 'Add' || blend === 0) return cur + value;
            if (blend === 'Multiply' || blend === 1) return cur * value;
            return value;
          }
          function expressionRecord(id) {
            const fileId = faceIdFor(id);
            if (expPayload && expPayload.exps) {
              const rec = expPayload.exps.find((item) => item.id === fileId);
              if (rec) return rec;
            }
            return undefined;
          }
          function applyTargets(targets, dur) { for (const id of Object.keys(targets)) tweenParam(id, targets[id], dur); }
          function pickEnabled(list) {
            const ok = list.filter((id) => expIsEnabled(id));
            if (ok.length) return ok[Math.floor(Math.random() * ok.length)];
            const all = ALL_EXP_IDS.filter((id) => expIsEnabled(id));
            if (all.length) return all[Math.floor(Math.random() * all.length)];
            return null;
          }
          function resetMotionPose() {
            for (const id of motionCurveIds) {
              if (!exists[id]) continue;
              const target = resting[id] !== undefined ? resting[id] : (baseParams[id] !== undefined ? baseParams[id] : 0);
              tweenParam(id, target, 500);
            }
            if (exists.Param52) tweenParam('Param52', 0, 500);
            if (exists.Param53) tweenParam('Param53', 0, 500);
            bookShown = false;
          }
          function springStep(sp, dt) {
            const stiffness = 170;
            const damping = 12.5;
            sp.v += (stiffness * (sp.target - sp.x) - damping * sp.v) * dt;
            sp.x += sp.v * dt;
          }
          function updatePoseTargets() {
            if (calibrated && measuredW > 5 && pxPerUnit > 0) {
              poseIdle.x = measuredW / 2 + cfg.model.idle.x / pxPerUnit;
              poseTyping.x = measuredW / 2 + cfg.model.typing.x / pxPerUnit;
            }
            poseIdle.y = yIdle;
            poseTyping.y = yTyping;
            poseIdle.s = cfg.model.idle.scale;
            poseTyping.s = cfg.model.typing.scale;
            prog.target = (store.typing || store.previewTyping) ? 1 : 0;
          }
          function applyPoseNow() {
            const p = prog.x;
            pose.x = poseIdle.x + (poseTyping.x - poseIdle.x) * p;
            pose.y = poseIdle.y + (poseTyping.y - poseIdle.y) * p;
            pose.s = poseIdle.s + (poseTyping.s - poseIdle.s) * p;
          }
          function computeHeadRef(typingFlag) {
            const rect = modelHost.getBoundingClientRect();
            const s = pose.s;
            const drawnW = (measuredW / 0.4667) * s;
            const drawnH = (measuredH / 0.4667) * s;
            const drawnLeft = pose.x - drawnW / 2;
            const drawnTop = pose.y - drawnH;
            let refX = drawnLeft + HEAD_FRAC_X * drawnW + (typingFlag ? 0 : cfg.model.follow.headX);
            let refY = drawnTop + HEAD_FRAC_Y * drawnH - (typingFlag ? 0 : cfg.model.follow.headY);
            if (typingFlag) {
              refX += HEAD_TYPING_DX + cfg.model.follow.typingHeadX;
              refY += HEAD_TYPING_DY - cfg.model.follow.typingHeadY;
            }
            return {
              x: rect.left + (refX / Math.max(1, camW)) * rect.width,
              y: rect.top + (refY / Math.max(1, camH)) * rect.height,
              headPxH: HEAD_H_FRAC * drawnH * (rect.height / Math.max(1, camH)),
            };
          }
          function updateFollowBoxState() {
            if (!calibrated || measuredW <= 5) return;
            const idle = computeHeadRef(false);
            const typing = computeHeadRef(true);
            followBox.idle = { x: idle.x, y: idle.y, w: idle.headPxH * 0.85, h: idle.headPxH };
            followBox.typing = { x: typing.x, y: typing.y, w: typing.headPxH * 0.85, h: typing.headPxH };
          }
          function updateItemsPositions() {
            if (!calibrated || measuredW <= 5 || Object.keys(activeItems).length === 0) return;
            try {
              const rect = modelHost.getBoundingClientRect();
              const s = pose.s;
              const drawnW = (measuredW / 0.4667) * s;
              const drawnH = (measuredH / 0.4667) * s;
              const drawnLeft = pose.x - drawnW / 2;
              const drawnTop = pose.y - drawnH;
              let refX = drawnLeft + HEAD_FRAC_X * drawnW + ITEM_OFFSET_X;
              let refY = drawnTop + HEAD_FRAC_Y * drawnH + ITEM_OFFSET_Y;
              if (store.typing) { refX += HEAD_TYPING_DX; refY += HEAD_TYPING_DY; }
              const headH = HEAD_H_FRAC * drawnH;
              const ux = rect.width / Math.max(1, camW);
              const uy = rect.height / Math.max(1, camH);
              for (const key of Object.keys(activeItems)) {
                const def = ITEM_DEFS[key];
                const el = activeItems[key];
                if (!def || !el) continue;
                const px = (refX + def.dx * headH) * ux;
                const py = (refY + def.dy * headH) * uy;
                const wpx = def.w * ITEM_SCALE * headH * ux;
                el.style.transform = 'translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) translate(-50%,-50%) rotate(' + def.rot + 'deg)' + (def.flip ? ' scaleX(-1)' : '');
                el.style.width = wpx.toFixed(1) + 'px';
              }
            } catch (error) { /* ignore */ }
          }
          function setItems(keys) {
            const wanted = keys || [];
            for (const key of Object.keys(activeItems)) {
              if (wanted.indexOf(key) >= 0) continue;
              const el = activeItems[key];
              el.style.opacity = '0';
              const old = el;
              ctx.timeout(() => { if (activeItems[key] === old) { try { old.remove(); } catch (e) { /* ignore */ } delete activeItems[key]; } }, 700);
            }
            for (const key of wanted) {
              if (activeItems[key]) continue;
              const def = ITEM_DEFS[key];
              if (!def) continue;
              const el = document.createElement('img');
              el.className = 'fischl-item';
              el.src = modelUrl(cfg.model.folder, 'items/' + def.file);
              el.draggable = false;
              el.alt = '';
              itemHost.appendChild(el);
              activeItems[key] = el;
            }
            updateItemsPositions();
            for (const key of wanted) {
              const el = activeItems[key];
              if (!el) continue;
              void el.offsetWidth;
              el.style.opacity = '1';
            }
          }
          function dialoguePool() {
            const pools = { head: [], body: [], wake: [], dizzy: [] };
            const lines = Array.isArray(cfg.interact.lines)
              ? cfg.interact.lines.filter((l) => l && String(l.text || '').trim())
              : [];
            pools.head = lines;
            pools.body = lines;
            const w = cfg.interact.wake;
            if (w && w.enabled && String(w.text || '').trim()) {
              pools.wake = [{ text: String(w.text), exp: typeof w.exp === 'string' ? w.exp : '' }];
            }
            const dz = cfg.interact.dizzy;
            if (dz && String(dz.text || '').trim()) {
              pools.dizzy = [{ text: String(dz.text), exp: typeof dz.exp === 'string' ? dz.exp : '' }];
            }
            return pools;
          }
          function speakLine(text, durMs, opts) {
            const lip = !(opts && opts.lip === false);
            const sp = lineToSpeech(text);
            store.speech = { text: sp.text, ph: lip ? sp.ph : '', start: now(), length: sp.text.length, lip: lip };
            speechStep = -1;
            publishStore();
            const ms = durMs || Math.max(2200, 260 + text.length * 150);
            disposers.push(ctx.timeout(() => { clearSpeech(); }, ms));
          }
          function clearSpeech() {
            store.speech = null;
            publishStore();
            for (const id of Object.keys(VOWELS)) { if (exists[VOWELS[id]]) tweenParam(VOWELS[id], 0, 90); }
            tweenParam('ParamMouthOpenY', 0, 90);
          }
          function applyExpression(id, dur, hold) {
            if (!id || !expIsEnabled(id)) return;
            lastExp = id;
            const record = expressionRecord(id);
            setItems(ITEMS_BY_EXP[id] || []);
            exprGen += 1;
            const gen = exprGen;
            if (!record || !record.params.length) {
              exprOwned = {};
              if (restoreTimer) { try { restoreTimer(); } catch (e) { /* ignore */ } restoreTimer = null; }
              const holdMs = hold === undefined ? 2800 : hold;
              restoreTimer = ctx.timeout(() => { setItems([]); restoreTimer = null; }, holdMs);
              return;
            }
            const targets = {};
            for (const p of record.params) {
              if (p.id === 'ParamEyeLOpen' || p.id === 'ParamEyeROpen') continue;
              const base = resting[p.id] !== undefined ? resting[p.id] : baseParams[p.id];
              targets[p.id] = blendValue(base, p.value, p.blend);
            }
            exprOwned = {};
            for (const pid of Object.keys(targets)) exprOwned[pid] = true;
            applyTargets(targets, dur === undefined ? 500 : dur);
            if (restoreTimer) { try { restoreTimer(); } catch (e) { /* ignore */ } restoreTimer = null; }
            const holdMs = hold === undefined ? 2800 : hold;
            restoreTimer = ctx.timeout(() => {
              applyTargets(resting, 500);
              setItems([]);
              restoreTimer = null;
              const myGen = gen;
              ctx.timeout(() => { if (exprGen === myGen) exprOwned = {}; }, 700);
            }, holdMs);
          }
          function enterReading() {
            if (store.reading) return;
            store.reading = true;
            motionPlay = null;
            setItems(['zzz']);
            if (exists.ParamEyeBallX) tweenParam('ParamEyeBallX', 0, 400);
            if (exists.ParamEyeBallY) tweenParam('ParamEyeBallY', 0, 400);
            publishStore();
          }
          function wake() {
            if (store.reading) {
              store.reading = false;
              motionPlay = null;
              setItems([]);
              resetMotionPose();
              const pool = dialoguePool();
              if (pool.wake.length) {
                const w = pool.wake[0];
                const wexp = w.exp && expIsEnabled(w.exp) ? String(w.exp) : '';
                applyExpression(wexp || pickEnabled(WAKE_EXP_IDS), 500, 2200);
                speakLine(w.text, 2600);
              } else {
                applyExpression(pickEnabled(WAKE_EXP_IDS), 500, 2200);
              }
            }
            lastActivity = now();
            publishStore();
          }
          function react(zone) {
            const pool = dialoguePool();
            const lines = zone === 'head' ? pool.head : pool.body;
            const list = zone === 'head' ? HEAD_EXP_IDS : BODY_EXP_IDS;
            const exprRate = typeof cfg.interact.exprRate === 'number' ? cfg.interact.exprRate : 50;
            if (lines.length) {
              const pick = lines[Math.floor(Math.random() * lines.length)];
              const boundExp = pick && pick.exp && expIsEnabled(pick.exp) ? String(pick.exp) : '';
              if (boundExp) {
                applyExpression(boundExp, 500, 2600);
                speakLine(pick.text, 2600);
                return;
              }
            }
            if (Math.random() * 100 < exprRate) {
              applyExpression(pickEnabled(list), 500, 2600);
            } else if (lines.length) {
              speakLine(lines[Math.floor(Math.random() * lines.length)].text, 2600);
            }
          }
          function hasBlockingUI() {
            try {
              const el = document.querySelector('[data-approval-key], [role="dialog"], [aria-modal="true"], .dl2d-picker, .dl2d-crop-overlay');
              if (!el) return false;
              const r = el.getBoundingClientRect();
              return r.width > 0 && r.height > 0;
            } catch (e) { return false; }
          }
          let uiBlocked = false;
          function applyUiBlock() {
            const blocked = hasBlockingUI();
            if (blocked === uiBlocked) return;
            uiBlocked = blocked;
            const touch = touchRef.current;
            if (!touch) return;
            touch.style.pointerEvents = blocked ? 'none' : 'auto';
            touch.style.cursor = blocked ? 'default' : (store.typing ? 'default' : 'pointer');
          }
          let uiCheckQueued = false;
          const uiObserver = new MutationObserver(() => {
            if (uiCheckQueued) return;
            uiCheckQueued = true;
            ctx.timeout(() => { uiCheckQueued = false; applyUiBlock(); }, 120);
          });
          try { uiObserver.observe(document.body, { childList: true, subtree: true }); } catch (e) { /* ignore */ }
          disposers.push(() => { try { uiObserver.disconnect(); } catch (e) { /* ignore */ } });
          applyUiBlock();
          function onModelClick(event) {
            if (hasBlockingUI()) return;
            if (adjust.mode) return;
            if (!model) return;
            if (store.typing) return;
            const composer = findComposer();
            if (composer) {
              const r = composer.rect;
              if (event.clientX >= r.left - 2 && event.clientX <= r.right + 2 && event.clientY >= r.top - 2 && event.clientY <= r.bottom + 2) return;
            }
            lastActivity = now();
            if (store.reading) { wake(); return; }
            let zone = 'body';
            try {
              const rect = modelHost.getBoundingClientRect();
              const s = pose.s;
              const drawnH = (measuredH / 0.4667) * s;
              const topUnits = pose.y - drawnH;
              const topScreen = rect.top + (topUnits / Math.max(1, camH)) * rect.height;
              const heightScreen = (drawnH / Math.max(1, camH)) * rect.height;
              if (event.clientY < topScreen + HEAD_ZONE * heightScreen) zone = 'head';
            } catch (error) { /* ignore */ }
            const t = now();
            clicks = clicks.filter((c) => t - c < 1600);
            clicks.push(t);
            if (clicks.length >= 3) {
              clicks = [];
              const pool = dialoguePool();
              const dz = pool.dizzy[0];
              if (dz) {
                const dexp = dz.exp && expIsEnabled(dz.exp) ? String(dz.exp) : 'dizzy';
                applyExpression(dexp, 500, 3200);
                speakLine(dz.text, 3400);
              } else {
                applyExpression('dizzy', 500, 3200);
              }
            } else {
              react(zone);
            }
          }
          handlersRef.current.click = onModelClick;
          function updateCameraTargets() {
            const S_IDLE = cfg.model.idle.scale;
            const S_TYPING = cfg.model.typing.scale;
            if (!calibrated) {
              yIdle = camH + 0.26 * mh * S_IDLE - cfg.model.idle.y;
              yTyping = camH + 0.33 * mh * S_TYPING + 60 - cfg.model.typing.y;
            } else {
              const unitH = measuredH / 0.4667;
              yIdle = camH + F_IDLE * measuredH - cfg.model.idle.y;
              yTyping = camH + F_TYPING * (unitH * S_TYPING) - cfg.model.typing.y;
            }
          }
          function curveValue(segments, t) {
            const n = segments.length;
            if (n < 2) return 0;
            let prevT = segments[0];
            let prevV = segments[1];
            for (let i = 0; i + 4 < n; i += 3) {
              const ease = segments[i + 2];
              const nextT = segments[i + 3];
              const nextV = segments[i + 4];
              if (t >= prevT && t <= nextT) {
                const d = nextT - prevT;
                if (d <= 0.0001) return nextV;
                let p = (t - prevT) / d;
                if (ease === 1) p = 1 - Math.cos((p * Math.PI) / 2);
                else if (ease === 2) p = Math.sin((p * Math.PI) / 2);
                else if (ease === 3) p = -(Math.cos(Math.PI * p) - 1) / 2;
                return prevV + (nextV - prevV) * p;
              }
              prevT = nextT;
              prevV = nextV;
            }
            return prevV;
          }
          function curveSegmentsOk(segments) {
            const n = segments.length;
            if (n < 4) return false;
            let prevT = segments[0];
            if (!isFinite(prevT)) return false;
            for (let i = 3; i + 2 < n; i += 3) {
              const t = segments[i];
              if (!isFinite(t) || t <= prevT) return false;
              prevT = t;
            }
            return true;
          }
          async function loadMotionCurves() {
            motionCurves = null;
            motionCurveIds = [];
            if (!cfg.model.motion.file) return;
            try {
              const r = await apiGet('/fischl/api/motion-curves?folder=' + encodeURIComponent(cfg.model.folder) + '&file=' + encodeURIComponent(cfg.model.motion.file));
              if (r && r.ok) {
                const okCurves = (r.curves || []).filter((c) => curveSegmentsOk(c.segments));
                if (okCurves.length) {
                  motionCurves = Object.assign({}, r, { curves: okCurves });
                  motionCurveIds = okCurves.map((c) => c.id);
                }
              }
            } catch (e) { motionCurves = null; }
          }
          async function boot() {
            if (booting) return;
            booting = true;
            try {
              await ensureLibs();
              if (cancelled) return;
              const PIXI = window.PIXI;
              const canvas = document.createElement('canvas');
              canvas.className = 'fischl-canvas';
              modelHost.appendChild(canvas);
              app = new PIXI.Application({
                view: canvas, transparent: true, backgroundAlpha: 0, antialias: true,
                resolution: 1, autoDensity: false, width: camW, height: camH,
              });
              model = await PIXI.live2d.Live2DModel.from(modelUrl(cfg.model.folder, cfg.model.model3), { autoUpdate: true, autoInteract: false, autoBlink: false });
              if (cancelled) { model.destroy(); model = null; return; }
              app.stage.addChild(model);
              const internal = model.internalModel;
              core = internal && internal.coreModel;
              motionManager = internal && internal.motionManager;
              let px = 0, py = 0, bw = 0, bh = 0;
              try {
                const bounds = model.getLocalBounds();
                if (bounds && isFinite(bounds.width) && isFinite(bounds.height) && bounds.width > 0.01) {
                  px = bounds.x; py = bounds.y; bw = bounds.width; bh = bounds.height;
                }
              } catch (error) { /* ignore */ }
              if (bw > 0.01) { mw = bw; mh = bh; model.pivot.set(px + bw / 2, py + bh); }
              else { mw = model.width || 1; mh = model.height || 1; }
              const candidates = ['ParamAngleX', 'ParamAngleY', 'ParamAngleZ', 'ParamEyeBallX', 'ParamEyeBallY', 'ParamBodyAngleX', 'ParamBodyAngleY', 'ParamEyeLOpen', 'ParamEyeROpen', 'ParamMouthOpenY', 'ParamMouthForm', 'ParamMouthA', 'ParamMouthI', 'ParamMouthU', 'ParamMouthE', 'ParamMouthO', 'ParamBreath', 'Param52', 'Param53'];
              const vtsParams = ['PartArmA', 'PartArmB', 'PartArmLA', 'PartArmRA', 'PartArmLB', 'PartArmRB', 'PartHandL', 'PartHandR'];
              if (core) {
                for (const id of candidates.concat(vtsParams)) {
                  try { core.getParameterValueById(id); exists[id] = true; } catch (error) { exists[id] = false; }
                }
              }
              for (const id of candidates) baseParams[id] = getParam(id);
              try { expPayload = await apiGet('/fischl/api/expressions?folder=' + encodeURIComponent(cfg.model.folder)); } catch (e) { /* ignore */ }
              if (expPayload && expPayload.exps && core) {
                for (const rec of expPayload.exps) {
                  for (const p of rec.params) {
                    if (exists[p.id] === undefined) {
                      try { core.getParameterValueById(p.id); exists[p.id] = true; } catch (error) { exists[p.id] = false; }
                    }
                    if (exists[p.id] && baseParams[p.id] === undefined) baseParams[p.id] = getParam(p.id);
                  }
                }
              }
              if (!cfg.model.expressions && expPayload && expPayload.exps) {
                cfg.model.expressions = {};
                for (const rec of expPayload.exps) cfg.model.expressions[rec.id] = true;
                for (const v of ['cat', 'cream']) cfg.model.expressions[v] = true;
                saveCfg();
              }
              const idleRecord = expressionRecord('idle');
              if (idleRecord && idleRecord.params.length) {
                for (const p of idleRecord.params) {
                  if (p.id === 'ParamEyeLOpen' || p.id === 'ParamEyeROpen') { blinkBase = Math.max(0.3, 1 + p.value * (p.blend === 'Add' || p.blend === 0 ? 1 : 0)); continue; }
                  resting[p.id] = blendValue(baseParams[p.id], p.value, p.blend);
                }
              }
              if (expPayload && expPayload.exps) {
                for (const rec of expPayload.exps) {
                  for (const p of rec.params) {
                    if (p.id === 'ParamEyeLOpen' || p.id === 'ParamEyeROpen') continue;
                    if (resting[p.id] === undefined) resting[p.id] = baseParams[p.id];
                  }
                }
              }
              applyTargets(resting, 500);
              // VTS 双臂模型适配：只显示 A 套手臂、隐藏 B 套（moc3 初始值可能让两套手臂部件都可见 → 四只手）
              if (exists.PartArmA) tweenParam('PartArmA', 1, 250);
              if (exists.PartArmB) tweenParam('PartArmB', 0, 250);
              await loadMotionCurves();
              pose.s = cfg.model.idle.scale;
              updateCameraTargets();
              updatePoseTargets();
              prog.x = prog.target;
              prog.v = 0;
              applyPoseNow();
              model.position.set(pose.x, pose.y);
              setStatus('ready');
              const measure = ctx.timeout(() => {
                try {
                  const b = model.getBounds(false);
                  if (b && isFinite(b.width) && isFinite(b.height) && b.width > 5) {
                    measuredW = b.width;
                    measuredH = b.height;
                    offsetCenterX = (b.x + b.width / 2) - pose.x;
                    calibrated = true;
                    // 首次使用该模型（scale=-1 自动标记）：按模型实际尺寸自适应缩放
                    if (cfg.model.idle.scale === -1 || cfg.model.typing.scale === -1) {
                      const vh = window.innerHeight || 1;
                      const basePx = Math.max(1, measuredH * pxPerUnit);
                      const autoIdle = Math.max(0.15, Math.min(1.5, (vh * 0.75) / basePx));
                      const autoTyping = Math.max(0.3, Math.min(3, (vh * 1.15) / basePx));
                      if (cfg.model.idle.scale === -1) cfg.model.idle.scale = Math.round(autoIdle * 10000) / 10000;
                      if (cfg.model.typing.scale === -1) cfg.model.typing.scale = Math.round(autoTyping * 10000) / 10000;
                      saveCfg();
                    }
                    updateCameraTargets();
                    updatePoseTargets();
                    prog.x = prog.target;
                    prog.v = 0;
                    applyPoseNow();
                    model.position.set(pose.x, pose.y);
                  }
                } catch (error) { /* ignore */ }
              }, 900);
              disposers.push(measure);
              const breathStart = now();
              const ticker = PIXI.Ticker.shared;
              const tick = (delta) => {
                if (!model) return;
                const dt = Math.min(delta / 60, 0.05);
                const t = now();
                prog.target = (store.typing || store.previewTyping) ? 1 : 0;
                springStep(prog, dt);
                applyPoseNow();
                model.scale.set(pose.s);
                model.position.set(pose.x, pose.y);
                updateItemsPositions();
                updateFollowBoxState();
                if (blinkAt < 0 && t >= nextBlink) blinkAt = t;
                if (blinkAt >= 0) {
                  const bt = (t - blinkAt) / 190;
                  let eye;
                  if (bt < 0.25) eye = blinkBase * (1 - bt / 0.25);
                  else if (bt < 1) eye = blinkBase * ((bt - 0.25) / 0.75);
                  else { eye = blinkBase; blinkAt = -1; nextBlink = t + 2200 + Math.random() * 3600; }
                  setParam('ParamEyeLOpen', Math.max(0.05, eye));
                  setParam('ParamEyeROpen', Math.max(0.05, eye));
                } else {
                  setParam('ParamEyeLOpen', blinkBase);
                  setParam('ParamEyeROpen', blinkBase);
                }
                const idleNow = !store.reading && !store.typing && !store.speech;
                if (idleNow && cfg.model.motion.enabled && t - lastActivity > Math.max(0, cfg.model.motion.idleSeconds) * 1000) enterReading();
                if (store.reading) {
                  if (motionCurves && motionCurves.curves.length) {
                    if (!motionPlay) motionPlay = { phase: 'play', start: now() };
                    if (motionPlay.phase === 'play') {
                      const mt = (now() - motionPlay.start) / 1000;
                      if (mt >= motionCurves.duration) {
                        motionPlay = { phase: 'wait', waitStart: now() };
                      } else {
                        for (const c of motionCurves.curves) {
                          if (SKIP_PARAMS.indexOf(c.id) >= 0) continue;
                          const v = curveValue(c.segments, mt);
                          if (!exprOwned[c.id]) setParam(c.id, v);
                        }
                      }
                    } else if (t - motionPlay.waitStart >= Math.max(0, cfg.model.motion.idleSeconds) * 1000) {
                      motionPlay = { phase: 'play', start: now() };
                    }
                  } else {
                    if (!bookShown && exists.Param52) { tweenParam('Param52', 1, 500); bookShown = true; }
                    if (exists.Param53 && t - lastFlip > 4200) {
                      lastFlip = t;
                      tweenParam('Param53', 1, 120);
                      const flipBack = ctx.timeout(() => tweenParam('Param53', 0, 350), 320);
                      disposers.push(flipBack);
                    }
                  }
                } else {
                  motionPlay = null;
                  if (bookShown) { tweenParam('Param52', 0, 500); bookShown = false; }
                }
                const followOn = !store.reading && !store.speech && cfg.model.follow.enabled;
                const dead = 0.1;
                const ax = followOn && Math.abs(mouseNX) > dead ? mouseNX : 0;
                const ay = followOn && Math.abs(mouseNY) > dead ? mouseNY : 0;
                const amp = cfg.model.follow.size;
                const tx = ax * 9 * amp;
                const ty = -ay * 5 * amp;
                const bx = ax * 2.2 * amp;
                const by = -ay * 2.0 * amp;
                followX += (tx - followX) * Math.min(1, dt * 4.5);
                followY += (ty - followY) * Math.min(1, dt * 4.5);
                ballX += (bx - ballX) * Math.min(1, dt * 7);
                ballY += (by - ballY) * Math.min(1, dt * 7);
                bodyX += (ax * 1.8 * amp - bodyX) * Math.min(1, dt * 4);
                if (followOn) {
                  if (!exprOwned.ParamAngleX) setParam('ParamAngleX', followX);
                  if (!exprOwned.ParamAngleY) setParam('ParamAngleY', followY);
                  if (!exprOwned.ParamEyeBallX) setParam('ParamEyeBallX', ballX);
                  if (!exprOwned.ParamEyeBallY) setParam('ParamEyeBallY', ballY);
                  if (!exprOwned.ParamBodyAngleX) setParam('ParamBodyAngleX', bodyX);
                }
                if (exists.ParamBreath) setParam('ParamBreath', 0.5 + 0.5 * Math.sin((t - breathStart) / 1000 * Math.PI * 0.42));
                for (const id of Object.keys(paramAnim)) {
                  const a = paramAnim[id];
                  if (!isFinite(a.to) || !isFinite(a.last)) { delete paramAnim[id]; continue; }
                  const k = 1 - Math.exp(-a.rate * dt);
                  const next = a.last + (a.to - a.last) * k;
                  a.last = next;
                  if (Math.abs(a.to - next) < 0.001 || t - a.start > Math.max(3000, (a.rate > 0 ? 4600 / a.rate : 500) * 1.5)) { setParam(id, a.to); delete paramAnim[id]; }
                  else setParam(id, next);
                }
                if (store.speech && store.speech.lip) {
                  const ph = store.speech.ph || '';
                  const step = Math.floor((t - store.speech.start) / 150);
                  if (step !== speechStep) {
                    speechStep = step;
                    const ch = ph[step];
                    for (const v of Object.keys(VOWELS)) { const on = ch === v; tweenParam(VOWELS[v], on ? 1 : 0, on ? 50 : 90); }
                    tweenParam('ParamMouthOpenY', ch && OPEN_BY_VOWEL[ch] !== undefined ? OPEN_BY_VOWEL[ch] : 0.08, 60);
                  }
                }
                if (t >= nextAmbient) {
                  if (!store.reading && !store.typing && !store.speech) {
                    nextAmbient = t + 11000 + Math.random() * 13000;
                    if (Math.random() < 0.72) applyExpression(pickEnabled(AMBIENT_EXP_IDS), 500, 2400 + Math.random() * 1600);
                  } else {
                    nextAmbient = t + 11000 + Math.random() * 13000;
                  }
                }
              };
              ticker.add(tick);
              disposers.push(() => ticker.remove(tick));
              nextBlink = now() + 900;
            } catch (bootError) {
              console.error('fischl boot error:', bootError);
              setStatusError(String(bootError && bootError.message || bootError));
              setStatus('error');
              try {
                apiPost('/fischl/api/diag', {
                  bootError: String(bootError && bootError.message || bootError),
                  stack: String(bootError && bootError.stack || ''),
                  folder: cfg.model.folder,
                  model3: cfg.model.model3,
                  url: modelUrl(cfg.model.folder, cfg.model.model3),
                }).catch(() => {});
              } catch (e) { /* ignore */ }
              // 首次失败自动重试一次（网络/时序瞬态）
              if (!cancelled && !bootRetried) {
                bootRetried = true;
                try { if (model) { model.destroy(); model = null; } } catch (e) { /* ignore */ }
                try { if (app) { app.destroy(true, { children: true, texture: true, baseTexture: true }); app = null; } } catch (e) { /* ignore */ }
                const cv = modelHost && modelHost.querySelector('canvas');
                if (cv) { try { cv.remove(); } catch (e) { /* ignore */ } }
                ctx.timeout(() => { void boot(); }, 700);
              }
            } finally {
              booting = false;
            }
          }
          const pollTyping = () => {
            let hasText = false;
            try {
              const composer = findComposer();
              if (composer && composer.el) {
                const value = composer.el.value !== undefined ? composer.el.value : (composer.el.textContent || '');
                hasText = String(value).length > 0;
              }
            } catch (error) { /* ignore */ }
            if (hasText && !store.typing) {
              lastActivity = now();
              if (store.reading) wake();
              store.typing = true;
              updateCameraTargets();
              updatePoseTargets();
              publishStore();
              const touch = touchRef.current;
              if (touch) touch.style.cursor = 'default';
            } else if (!hasText && store.typing) {
              store.typing = false;
              lastActivity = now();
              updateCameraTargets();
              updatePoseTargets();
              publishStore();
              const touch = touchRef.current;
              if (touch) touch.style.cursor = 'pointer';
            }
          };
          const pollInterval = ctx.interval(pollTyping, 400);
          disposers.push(pollInterval);
          const onMouse = (event) => {
            let headX = window.innerWidth * 0.5;
            let headY = window.innerHeight * 0.1;
            if (model && calibrated && measuredW > 5) {
              const ref = computeHeadRef(store.typing);
              headX = ref.x;
              headY = ref.y;
            }
            const w = window.innerWidth || 1;
            const h = window.innerHeight || 1;
            mouseNX = Math.max(-1, Math.min(1, (event.clientX - headX) / (w * 0.45)));
            mouseNY = Math.max(-1, Math.min(1, (event.clientY - headY) / (h * 0.45)));
          };
          window.addEventListener('mousemove', onMouse, { passive: true });
          disposers.push(() => window.removeEventListener('mousemove', onMouse));
          const placeWrap = () => {
            const touch = touchRef.current;
            const hostW = modelHost.offsetWidth || 1;
            const hostH = modelHost.offsetHeight || 1;
            const vw = window.innerWidth || 1;
            const vh = window.innerHeight || 1;
            pxPerUnit = (vw * 0.17) / 640;
            const logicalW = Math.max(64, Math.round(hostW / pxPerUnit));
            const logicalH = Math.max(64, Math.round(hostH / pxPerUnit));
            camW = logicalW;
            camH = logicalH;
            if (app && app.renderer) {
              try { if (Math.abs(app.renderer.width - logicalW) > 1 || Math.abs(app.renderer.height - logicalH) > 1) app.renderer.resize(logicalW, logicalH); } catch (error) { /* ignore */ }
            }
            const composer = findComposer();
            updateCameraTargets();
            if (model) {
              updatePoseTargets();
              if (Math.abs(prog.x - prog.target) < 0.002 && Math.abs(prog.v) < 0.01) { prog.x = prog.target; prog.v = 0; }
              applyPoseNow();
              model.position.set(pose.x, pose.y);
            }
            let clip = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
            let notchInfo = 'none';
            if (touch) {
              try {
                const trect = touch.getBoundingClientRect();
                let cutRect = null;
                if (composer) {
                  const col = findMainColumn(composer.el);
                  if (col) { cutRect = { left: col.left, right: Math.min(col.right, composer.rect.right + 24), top: col.top, bottom: col.bottom }; notchInfo = 'column'; }
                  else { cutRect = composer.rect; notchInfo = 'input'; }
                }
                if (cutRect) {
                  const built = notchFor(cutRect, trect);
                  if (built) clip = built;
                  else notchInfo = 'none';
                }
              } catch (error) { /* ignore */ }
              touch.style.clipPath = clip;
              touch.style.webkitClipPath = clip;
            }
            if (now() - lastDiag > 6000) {
              lastDiag = now();
              let expsFalse = [];
              if (cfg.model.expressions) {
                for (const k of Object.keys(cfg.model.expressions)) if (cfg.model.expressions[k] === false) expsFalse.push(k);
              }
              const diag = {
                viewport: { vw: vw, vh: vh },
                canvas: { logicalW: camW, logicalH: camH, pxPerUnit: pxPerUnit },
                notch: notchInfo,
                items: Object.keys(activeItems),
                anims: Object.keys(paramAnim).length,
                exps: { total: cfg.model.expressions ? Object.keys(cfg.model.expressions).length : -1, false: expsFalse, last: lastExp },
                motion: { enabled: cfg.model.motion.enabled, file: cfg.model.motion.file, loaded: !!(motionCurves && motionCurves.curves.length) },
                model: model ? { x: Math.round(pose.x), y: Math.round(pose.y), s: Math.round(pose.s * 10000) / 10000, measuredW: Math.round(measuredW), measuredH: Math.round(measuredH), calibrated: calibrated, yIdle: Math.round(yIdle), yTyping: Math.round(yTyping) } : null,
              };
              apiPost('/fischl/api/diag', diag).catch(() => {});
            }
            applyUiBlock();
            positionAdjustElements();
            positionTouchEdit();
          };
          placeWrap();
          window.addEventListener('resize', placeWrap);
          disposers.push(() => window.removeEventListener('resize', placeWrap));
          const placeInterval = ctx.interval(placeWrap, 1200);
          disposers.push(placeInterval);
          function applyVisuals() {
            const body = document.body;
            if (cfg.theme.bgImage) {
              body.style.backgroundImage = 'url("' + cfg.theme.bgImage + '")';
              body.style.backgroundSize = 'cover';
              body.style.backgroundPosition = 'center';
              bgDim.style.display = 'block';
            } else {
              body.style.backgroundImage = '';
              bgDim.style.display = 'none';
            }
            nebulaLayer.style.display = cfg.theme.stars ? '' : 'none';
            starsLayer.style.display = cfg.theme.stars ? '' : 'none';
          }
          applyVisuals();
          cfgListeners.add(() => applyVisuals());
          cfgListeners.add(() => {
            updateCameraTargets();
            updatePoseTargets();
            if (cfg.model.motion.file !== lastMotionFile) {
              lastMotionFile = cfg.model.motion.file;
              motionPlay = null;
              void loadMotionCurves();
            }
            if (!cfg.model.motion.enabled && store.reading) {
              store.reading = false;
              motionPlay = null;
              setItems([]);
              resetMotionPose();
              publishStore();
            }
            if (cfg.model.version !== modelVersion) {
              modelVersion = cfg.model.version;
              if (model) { try { model.destroy(); } catch (e) { /* ignore */ } model = null; }
              if (app) { try { app.destroy(true, { children: true, texture: true, baseTexture: true }); } catch (e) { /* ignore */ } app = null; }
              const cv = modelHost.querySelector('canvas');
              if (cv) try { cv.remove(); } catch (e) { /* ignore */ }
              calibrated = false;
              measuredW = 1;
              measuredH = 1;
              expPayload = null;
              motionCurves = null;
              motionPlay = null;
              motionCurveIds = [];
              bookShown = false;
              for (const id of Object.keys(paramAnim)) delete paramAnim[id];
              exprOwned = {};
              for (const key of Object.keys(activeItems)) { try { activeItems[key].remove(); } catch (e) { /* ignore */ } delete activeItems[key]; }
              void boot();
            }
          });
          void boot();
          return () => {
            cancelled = true;
            handlersRef.current.click = null;
            if (followBox.hideTimer) { try { followBox.hideTimer(); } catch (e) { /* ignore */ } followBox.hideTimer = null; }
            followBox.el = null;
            if (followEl && followEl.parentNode) { try { followEl.parentNode.removeChild(followEl); } catch (e) { /* ignore */ } }
            for (const dispose of disposers) { try { dispose(); } catch (e) { /* ignore */ } }
            disposers.length = 0;
            if (restoreTimer) { try { restoreTimer(); } catch (e) { /* ignore */ } restoreTimer = null; }
            for (const key of Object.keys(activeItems)) { try { activeItems[key].remove(); } catch (e) { /* ignore */ } delete activeItems[key]; }
            if (model) { try { model.destroy(); } catch (e) { /* ignore */ } model = null; }
            if (app) { try { app.destroy(true, { children: true, texture: true, baseTexture: true }); } catch (e) { /* ignore */ } app = null; }
            if (modelHost && modelHost.parentNode) { try { modelHost.parentNode.removeChild(modelHost); } catch (e) { /* ignore */ } }
            if (starsLayer && starsLayer.parentNode) { try { starsLayer.parentNode.removeChild(starsLayer); } catch (e) { /* ignore */ } }
            if (nebulaLayer && nebulaLayer.parentNode) { try { nebulaLayer.parentNode.removeChild(nebulaLayer); } catch (e) { /* ignore */ } }
            if (bgDim && bgDim.parentNode) { try { bgDim.parentNode.removeChild(bgDim); } catch (e) { /* ignore */ } }
          };
        }, []);
        useStoreVersion();
        const tc = cfg.model.touch || { x: 50, y: 0, w: 50, h: 100 };
        if (status === 'error') {
          return React.createElement('div', { className: 'fischl-touch', ref: touchRef, style: { left: tc.x + '%', top: tc.y + '%', width: tc.w + '%', height: tc.h + '%' } },
            React.createElement('div', { style: { position: 'absolute', left: 12, top: 12, background: 'rgba(60,20,30,.92)', border: '1px solid #ff7d8e', color: '#ffd0d6', padding: '8px 12px', borderRadius: 8, fontSize: 12, pointerEvents: 'none', maxWidth: 340 } },
              '模型加载失败：' + (statusError || '未知错误')));
        }
        return React.createElement('div', { className: 'fischl-touch', ref: touchRef, onClick: onTouchClick, style: { left: tc.x + '%', top: tc.y + '%', width: tc.w + '%', height: tc.h + '%' } });
      }
      function SpeechBubble() {
        useStoreVersion();
        const speech = store.speech;
        const [chars, setChars] = React.useState(0);
        React.useEffect(() => {
          if (!speech) { setChars(0); return; }
          setChars(0);
          const timer = ctx.interval(() => setChars((c) => Math.min(c + 1, speech.length)), 46);
          return () => timer();
        }, [speech && speech.text]);
        if (!speech) return null;
        const b = cfg.interact.bubble;
        const style = {
          left: b.left + '%',
          top: b.top + '%',
          maxWidth: b.width + 'px',
        };
        if (cfg.theme.mode === 'custom') {
          const c = cfg.theme.colors;
          style['--dl2d-border'] = c.border;
          style['--dl2d-special'] = c.specialText;
          style['--dl2d-bubble-bg'] = 'linear-gradient(150deg, ' + rgba(shade(c.bg, 36), 0.95) + ', ' + rgba(shade(c.bg, 6), 0.95) + ')';
          style['--dl2d-bubble-text'] = c.text;
          style['--dl2d-bubble-glow'] = '0 0 14px ' + rgba(c.activeIcon, 0.3);
        }
        return React.createElement('div', { className: 'fischl-bubble', style: style },
          React.createElement('span', { className: 'fischl-bubble-name' }, cfg.interact.name || '互动'),
          speech.text.slice(0, chars));
      }
      function FischlStage() {
        useStoreVersion();
        const active = store.snapshot.active && String(store.snapshot.active.id || '').indexOf('fischl') === 0;
        if (!active) return null;
        return React.createElement('div', { className: 'fischl-stage' },
          React.createElement(Live2DCanvas, null),
          React.createElement('div', { className: 'fischl-frame' }),
          React.createElement(SpeechBubble, null));
      }
      slots.inject('shell.overlay', () => slots.register(
        { name: 'shell.overlay', id: 'fischl-live2d', order: 50, label: 'Fischl Live2D' }, FischlStage));
    }

    exports.inject = inject;
    exports.apply = apply;
    return module.exports;
  }
});
