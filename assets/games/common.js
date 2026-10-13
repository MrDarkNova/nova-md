/* DarkNova Games - shared helpers.
   Written for iPhone Safari (iOS 13 and later) and every other mobile browser:
   no optional chaining tricks that old WebKit lacks, pointer events for touch and mouse,
   WebAudio unlocked on the first tap, localStorage always in try/catch. */
(function () {
  'use strict';
  var NG = (window.NG = {});
  var body = document.body;
  NG.id = body.getAttribute('data-game') || 'game';
  NG.title = body.getAttribute('data-title') || document.title || 'Game';
  // Embedded: the page is shown inside a WhatsApp chat bubble. It has no fixed viewport height, so
  // the layout follows the width only and reports its height to the chat when it can.
  NG.embed = window.NG_EMBED === true || window.NG_EMBED === 1 || document.documentElement.className.indexOf('embed') >= 0;
  if (NG.embed) document.documentElement.className += (document.documentElement.className.indexOf('embed') >= 0 ? '' : ' embed');
  NG.embedH = 300;
  var lastReport = 0;
  // Tells the chat how tall the game is (Android and iOS bridges, both optional).
  NG.report = function () {
    if (!NG.embed) return;
    var a = document.getElementById('app');
    var h = Math.ceil(a ? a.getBoundingClientRect().height : 0);
    if (!h || h === lastReport) return;
    lastReport = h;
    try { if (window.AndroidBridge && window.AndroidBridge.updateSize) window.AndroidBridge.updateSize(h); } catch (e) { /* no bridge */ }
    try {
      var mh = window.webkit && window.webkit.messageHandlers;
      if (mh) ['updateSize', 'resize', 'setHeight'].forEach(function (n) { if (mh[n] && mh[n].postMessage) mh[n].postMessage(h); });
    } catch (e) { /* no bridge */ }
  };

  /* ---------- small tools ---------- */
  NG.rand = function (a, b) { return a + Math.random() * (b - a); };
  NG.ri = function (a, b) { return Math.floor(a + Math.random() * (b - a + 1)); };
  NG.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  NG.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  NG.shuffle = function (arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  };
  NG.hit = function (a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y; };
  NG.rr = function (ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2)); // a shrinking shape must never get a negative radius
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  };
  NG.text = function (ctx, str, x, y, size, color, align, weight) {
    ctx.font = (weight || '700') + ' ' + size + 'px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif';
    ctx.fillStyle = color || '#fff';
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(str, x, y);
  };
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  NG.el = el;

  /* ---------- storage that never throws ---------- */
  function sget(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  NG.store = { get: sget, set: sset };
  NG.best = function () { var n = Number(sget('ng:' + NG.id + ':best')); return isFinite(n) ? n : 0; };
  // Saves a score when it beats the best one. Returns true for a new best. Pass true when lower is better (a time).
  NG.saveBest = function (score, lower) {
    var key = 'ng:' + NG.id + ':best';
    var raw = sget(key), cur = raw === null ? NaN : Number(raw);
    var has = isFinite(cur) && (lower === true || cur > 0);
    var better = has ? (lower ? score < cur : score > cur) : (lower ? true : score > 0);
    if (better) { sset(key, String(score)); NG.statNow('best', score); }
    return better;
  };

  /* ---------- viewport height (iOS toolbars change it) ---------- */
  function vh() { document.documentElement.style.setProperty('--app-h', window.innerHeight + 'px'); }
  vh();
  window.addEventListener('resize', vh);
  window.addEventListener('orientationchange', function () { setTimeout(vh, 250); });

  /* ---------- stop the page from scrolling, zooming or selecting ---------- */
  document.addEventListener('touchmove', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('.scroll')) return;
    if (document.documentElement.classList.contains('hub')) return;
    e.preventDefault();
  }, { passive: false });
  ['gesturestart', 'gesturechange', 'gestureend', 'contextmenu', 'dblclick'].forEach(function (n) {
    document.addEventListener(n, function (e) { e.preventDefault(); });
  });

  /* ---------- sound ---------- */
  var ac = null;
  var muted = sget('ng:muted') === '1';
  function unlock() {
    try {
      if (!ac) { var C = window.AudioContext || window.webkitAudioContext; if (C) ac = new C(); }
      if (ac && ac.state === 'suspended') ac.resume();
    } catch (e) { /* no sound */ }
  }
  ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'keydown'].forEach(function (n) {
    document.addEventListener(n, unlock, { passive: true });
  });
  NG.beep = function (freq, dur, type, vol, slide) {
    if (muted || !ac || ac.state !== 'running') return;
    try {
      var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t + dur);
      var v = vol == null ? 0.07 : vol;
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ac.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (e) { /* ignore */ }
  };
  var SND = {
    tap: function () { NG.beep(520, 0.06, 'sine'); },
    coin: function () { NG.beep(880, 0.07, 'square'); setTimeout(function () { NG.beep(1320, 0.1, 'square'); }, 60); },
    eat: function () { NG.beep(600, 0.08, 'triangle', 0.09, 900); },
    jump: function () { NG.beep(300, 0.14, 'square', 0.06, 700); },
    shoot: function () { NG.beep(900, 0.1, 'sawtooth', 0.05, 200); },
    hit: function () { NG.beep(160, 0.16, 'sawtooth', 0.08, 60); },
    pop: function () { NG.beep(420, 0.05, 'sine', 0.09, 700); },
    lose: function () { NG.beep(300, 0.5, 'sawtooth', 0.08, 70); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { setTimeout(function () { NG.beep(f, 0.14, 'triangle', 0.09); }, i * 90); }); },
    line: function () { NG.beep(700, 0.12, 'square', 0.06, 1400); }
  };
  NG.snd = function (name) { try { (SND[name] || SND.tap)(); } catch (e) { /* ignore */ } };
  NG.buzz = function (ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 15); } catch (e) { /* ignore */ } };

  /* ---------- keys and buttons ---------- */
  var KEYS = {
    ArrowLeft: 'left', a: 'left', ArrowRight: 'right', d: 'right', ArrowUp: 'up', w: 'up', ArrowDown: 'down', s: 'down',
    ' ': 'act', Enter: 'act', z: 'act', x: 'act2', p: 'pause', Escape: 'pause'
  };
  NG.held = { left: false, right: false, up: false, down: false, act: false, act2: false };
  var handler = null;
  // handler(name, isDown). Called for keys and for the on-screen buttons.
  NG.input = function (fn) { handler = fn; };
  function press(k, down) {
    if (NG.held[k] === down) return;
    NG.held[k] = down;
    if (handler) { try { handler(k, down); } catch (e) { console.error(e); } }
  }
  NG.press = press;
  document.addEventListener('keydown', function (e) {
    var k = KEYS[e.key] || KEYS[String(e.key).toLowerCase()];
    if (!k) return;
    e.preventDefault();
    press(k, true);
  });
  document.addEventListener('keyup', function (e) {
    var k = KEYS[e.key] || KEYS[String(e.key).toLowerCase()];
    if (!k) return;
    press(k, false);
  });
  window.addEventListener('blur', function () {
    for (var k in NG.held) if (NG.held[k]) press(k, false);
  });

  // Draws buttons in a container. defs: [{k:'left', t:'◀', cls:'wide'}]. Holding keeps NG.held[k] true.
  NG.buttons = function (box, defs) {
    var row = el('div', 'prow');
    defs.forEach(function (d) {
      var b = el('button', 'pbtn' + (d.cls ? ' ' + d.cls : ''), d.t);
      b.setAttribute('type', 'button');
      b.setAttribute('aria-label', d.label || d.k);
      var ids = {};
      b.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        ids[e.pointerId] = true;
        try { b.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
        b.classList.add('on');
        press(d.k, true);
        if (d.tap) d.tap();
      });
      var up = function (e) {
        if (!ids[e.pointerId]) return;
        delete ids[e.pointerId];
        b.classList.remove('on');
        press(d.k, false);
      };
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('lostpointercapture', up);
      row.appendChild(b);
    });
    box.appendChild(row);
    return row;
  };

  // Swipes on an element. cb('left'|'right'|'up'|'down'). With {end:true} it fires once, when the finger lifts.
  NG.swipe = function (target, cb, o) {
    o = o || {};
    var min = o.min || 22, id = null, sx = 0, sy = 0, moved = false;
    function dir(dx, dy) { return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
    target.addEventListener('pointerdown', function (e) {
      if (id !== null) return;
      id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false;
      try { target.setPointerCapture(id); } catch (x) { /* ignore */ }
    });
    target.addEventListener('pointermove', function (e) {
      if (e.pointerId !== id || o.end) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < min) return;
      moved = true; cb(dir(dx, dy)); sx = e.clientX; sy = e.clientY;
    });
    var finish = function (e) {
      if (e.pointerId !== id) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      id = null;
      if (o.end && Math.max(Math.abs(dx), Math.abs(dy)) >= min) { cb(dir(dx, dy)); return; }
      if (!moved && o.tap && e.type === 'pointerup' && Math.max(Math.abs(dx), Math.abs(dy)) < min) o.tap(e);
    };
    target.addEventListener('pointerup', finish);
    target.addEventListener('pointercancel', function (e) { if (e.pointerId === id) id = null; });
  };

  /* ---------- the page frame ---------- */
  var S = null;
  var statEls = {};
  NG.statNow = function (id, v) { if (statEls[id]) statEls[id].textContent = v; };

  // Builds the header, the playing area and the button area.
  // opts: w, h (logical size, kept in proportion) or fill:true (canvas takes all the room and
  // the game reads S.W and S.H), pad: [buttons], stats: [[id, label, start]], flush: true, pixel: true
  NG.stage = function (opts) {
    opts = opts || {};
    var app = el('div'); app.id = 'app';
    var bar = el('div'); bar.id = 'bar';
    var back = el('a', 'back', '‹ Games'); back.href = 'index.html';
    var ttl = el('div', 'ttl', NG.title);
    var stats = el('div', 'stats');
    var list = opts.stats || [['score', 'Score', '0'], ['best', 'Best', String(NG.best())]];
    list.forEach(function (s) {
      var box = el('div', 'stat'); box.appendChild(el('small', '', s[1]));
      var b = el('b', '', String(s[2])); box.appendChild(b); stats.appendChild(box); statEls[s[0]] = b;
    });
    var mute = el('button', 'mute', muted ? '🔇' : '🔊'); mute.setAttribute('type', 'button'); mute.setAttribute('aria-label', 'sound');
    mute.addEventListener('click', function () {
      muted = !muted; sset('ng:muted', muted ? '1' : '0'); mute.textContent = muted ? '🔇' : '🔊'; unlock();
    });
    bar.appendChild(back); bar.appendChild(ttl); bar.appendChild(stats); bar.appendChild(mute);
    var stage = el('div'); stage.id = 'stage';
    if (opts.flush) stage.className = 'flush';
    var cv = el('canvas'); cv.id = 'cv';
    stage.appendChild(cv);
    var pad = el('div'); pad.id = 'pad';
    app.appendChild(bar); app.appendChild(stage); app.appendChild(pad);
    body.appendChild(app);
    if (opts.pad) NG.buttons(pad, opts.pad);
    var ctx = cv.getContext('2d');
    S = { cv: cv, ctx: ctx, stage: stage, pad: pad, bar: bar, W: opts.w || 360, H: opts.h || 640, scale: 1, dpr: 1, onresize: null };
    S.stat = NG.statNow;
    S.score = function (n) { NG.statNow('score', n); };
    S.clear = function (color) { ctx.fillStyle = color || '#000'; ctx.fillRect(0, 0, S.W, S.H); };
    // Pointer position in the game's own coordinates.
    S.pos = function (e) {
      var r = cv.getBoundingClientRect();
      return { x: (e.clientX - r.left) / S.scale, y: (e.clientY - r.top) / S.scale };
    };
    function layout() {
      var cs = window.getComputedStyle(stage);
      var padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
      var padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      var aw, ah;
      if (NG.embed) {
        // In a chat bubble the height is not given, so it is chosen from the width.
        var full = stage.clientWidth || document.documentElement.clientWidth || window.innerWidth || 320;
        var maxH = opts.embedH || NG.embedH;
        aw = full - padX;
        if (opts.fill) {
          var sh = Math.round(NG.clamp(aw * (opts.ratio || 1.05), 220, maxH + 40));
          stage.style.height = sh + 'px';
          ah = sh - padY;
        } else ah = maxH;
      } else {
        aw = stage.clientWidth - padX;
        ah = stage.clientHeight - padY;
      }
      if (aw < 40 || ah < 40) return;
      var W, H, scale;
      if (opts.fill) { W = Math.floor(aw); H = Math.floor(ah); scale = 1; }
      else { W = opts.w; H = opts.h; scale = Math.min(aw / W, ah / H); }
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var cw = W * scale, ch = H * scale;
      cv.style.width = cw + 'px'; cv.style.height = ch + 'px';
      cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
      if (opts.pixel) { ctx.imageSmoothingEnabled = false; cv.style.imageRendering = 'pixelated'; }
      S.W = W; S.H = H; S.scale = scale; S.dpr = dpr;
      if (S.onresize) S.onresize(W, H);
      NG.report();
    }
    S.layout = layout;
    layout();
    window.addEventListener('resize', function () { setTimeout(layout, 30); });
    window.addEventListener('orientationchange', function () { setTimeout(layout, 300); });
    if (window.ResizeObserver) { try { new ResizeObserver(layout).observe(stage); } catch (e) { /* ignore */ } }
    requestAnimationFrame(layout);
    setTimeout(layout, 250);
    if (NG.embed) { setTimeout(layout, 700); setTimeout(layout, 1500); setInterval(NG.report, 1200); }
    S.app = app;
    return S;
  };

  /* ---------- game loop: fixed steps, pauses when the page is hidden ---------- */
  NG.loop = function (update, draw, o) {
    var step = (o && o.step) || 1 / 60, acc = 0, last = 0, raf = 0, on = false, paused = false;
    function frame(t) {
      raf = requestAnimationFrame(frame);
      if (!last) last = t;
      var dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      if (!paused) {
        acc += dt;
        var n = 0;
        while (acc >= step && n < 6) { update(step); acc -= step; n++; }
        if (n === 6) acc = 0;
      }
      draw(acc / step);
    }
    var api = {
      start: function () { if (on) return; on = true; last = 0; raf = requestAnimationFrame(frame); },
      stop: function () { on = false; cancelAnimationFrame(raf); },
      pause: function (v) { paused = v !== false; last = 0; },
      get paused() { return paused; }
    };
    document.addEventListener('visibilitychange', function () { last = 0; });
    return api;
  };

  /* ---------- dialogs ---------- */
  var dialog = null;
  NG.closeDialog = function () { if (dialog && dialog.parentNode) dialog.parentNode.removeChild(dialog); dialog = null; };
  // o: title, big, lines:[html], buttons:[{t, primary, fn}]
  NG.dialog = function (o) {
    NG.closeDialog();
    var host = (NG.embed && S && S.app) || (S && S.stage) || body;
    var ov = el('div', 'ov'); var card = el('div', 'card');
    if (o.title) card.appendChild(el('h2', '', o.title));
    if (o.big != null) card.appendChild(el('div', 'big', String(o.big)));
    (o.lines || []).forEach(function (l) { card.appendChild(el('p', '', l)); });
    var btns = el('div', 'btns');
    (o.buttons || []).forEach(function (b) {
      var x = el('button', 'btn' + (b.primary ? ' primary' : ''), b.t); x.setAttribute('type', 'button');
      x.addEventListener('click', function () { unlock(); NG.snd('tap'); if (b.keep !== true) NG.closeDialog(); if (b.fn) b.fn(); });
      btns.appendChild(x);
    });
    card.appendChild(btns); ov.appendChild(card); host.appendChild(ov);
    dialog = ov;
    return ov;
  };
  // The first screen of a game: how to play, and a Play button (the tap also unlocks the sound).
  NG.intro = function (o) {
    NG.dialog({
      title: o.title || NG.title, lines: o.lines || [],
      buttons: [{ t: o.button || 'Play', primary: true, fn: o.fn }]
    });
  };
  NG.share = function (score, extra) {
    var url = String(location.href).split('#')[0];
    var text = (score != null ? 'I scored ' + score + ' in ' : 'Play ') + NG.title + ' ' + (extra || '🎮');
    if (navigator.share) { navigator.share({ title: NG.title, text: text, url: url }).catch(function () { /* cancelled */ }); return; }
    window.open('https://wa.me/?text=' + encodeURIComponent(text + '\n' + url), '_blank');
  };
  // Game over. o: score, title, lines, lower (a time: lower is better), format (fn for the score), again
  NG.over = function (o) {
    var isBest = o.noBest ? false : NG.saveBest(o.score, o.lower);
    var shown = o.format ? o.format(o.score) : o.score;
    var lines = (o.lines || []).slice();
    if (isBest) lines.unshift('<span class="good">New best!</span>');
    else if (!o.noBest) lines.push('Best: ' + (o.format ? o.format(NG.best()) : NG.best()));
    NG.snd(o.win ? 'win' : 'lose');
    var buttons = [{ t: 'Play again', primary: true, fn: o.again }];
    if (!NG.embed) {
      buttons.push({ t: 'Share score', keep: true, fn: function () { NG.share(shown); } });
      buttons.push({ t: 'More games', fn: function () { location.href = 'index.html'; } });
    }
    NG.dialog({ title: o.title || 'Game over', big: shown, lines: lines, buttons: buttons });
  };

  // Lets a test read what the game is doing: NG.expose({score: fn, over: fn})
  NG.expose = function (o) { window.__ng = o; };

  window.addEventListener('error', function (e) {
    try { console.error('game error', e.message); } catch (x) { /* ignore */ }
  });
})();
