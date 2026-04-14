(async () => {
  const section = document.getElementById("hero-banner");
  const canvas = document.getElementById("hero-pixi-bg");
  if (!section || !canvas || !window.PIXI) return;

  const variant = parseInt(section.dataset.variant, 10) || 1;
  const mode = (variant - 1) % 5;
  const cs = getComputedStyle(document.documentElement);
  const hex = (s) => {
    s = (s || "").trim().replace("#", "");
    return parseInt(s, 16) || 0xe5b848;
  };
  const C1 = hex(cs.getPropertyValue("--slot-gold"));
  const C2 = hex(cs.getPropertyValue("--slot-gold-light"));

  let W = section.offsetWidth;
  let H = section.offsetHeight;

  const app = new PIXI.Application();
  await app.init({
    canvas,
    width: W,
    height: H,
    backgroundAlpha: 0,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  let elapsed = 0;
  const PI2 = Math.PI * 2;

  if (mode === 0) {
    const rays = new PIXI.Graphics();
    app.stage.addChild(rays);
    const rd = [];
    for (let i = 0; i < 8; i++) rd.push({ a: -0.15 + Math.random() * 0.9, w: 0.04 + Math.random() * 0.07, sp: 0.0008 + Math.random() * 0.001, al: 0.09 + Math.random() * 0.09 });
    const sparks = [];
    for (let i = 0; i < 80; i++) {
      const g = new PIXI.Graphics();
      const sz = 2 + Math.random() * 3;
      g.circle(0, 0, sz).fill({ color: i % 3 ? C1 : C2 });
      g.x = Math.random() * W;
      g.y = H + Math.random() * 60;
      g._vy = -(0.4 + Math.random() * 0.8);
      g._vx = (Math.random() - 0.5) * 0.5;
      g._ba = 0.6 + Math.random() * 0.4;
      g._ph = Math.random() * PI2;
      g._fr = 0.015 + Math.random() * 0.025;
      g.alpha = g._ba;
      app.stage.addChild(g);
      sparks.push(g);
    }
    app.ticker.add((t) => {
      elapsed += t.deltaTime;
      rays.clear();
      for (const r of rd) {
        const a = r.a + Math.sin(elapsed * r.sp) * 0.25;
        const len = Math.max(W, H) * 1.8;
        const hw = r.w + Math.sin(elapsed * r.sp * 2) * 0.02;
        rays.moveTo(W, H);
        rays.lineTo(W + Math.cos(Math.PI + a - hw) * len, H + Math.sin(Math.PI + a - hw) * len);
        rays.lineTo(W + Math.cos(Math.PI + a + hw) * len, H + Math.sin(Math.PI + a + hw) * len);
        rays.closePath();
        rays.fill({ color: C1, alpha: r.al * (0.6 + 0.4 * Math.sin(elapsed * r.sp * 3)) });
      }
      for (const s of sparks) {
        s.x += s._vx + Math.sin(elapsed * s._fr + s._ph) * 0.4;
        s.y += s._vy;
        s.alpha = s._ba * (0.4 + 0.6 * Math.sin(elapsed * s._fr * 2 + s._ph));
        if (s.y < -20) {
          s.y = H + 20;
          s.x = Math.random() * W;
        }
      }
    });
  }

  if (mode === 1) {
    const SYMS = "♠♣♥♦★7$¢€£₿✦✧◆◇♛♞♜";
    const cols = Math.ceil(W / 16);
    const drops = [];
    for (let c = 0; c < cols; c++) {
      const x = c * 16 + 4;
      const cnt = 3 + Math.floor(Math.random() * 4);
      for (let j = 0; j < cnt; j++) {
        const t = new PIXI.Text({
          text: SYMS[Math.floor(Math.random() * SYMS.length)],
          style: { fontSize: 10 + Math.random() * 12, fill: j % 3 ? C1 : C2, fontFamily: "monospace" },
        });
        t.x = x + Math.random() * 6;
        t.y = -Math.random() * H * 2.5;
        t._vy = 0.8 + Math.random() * 1.6;
        t._ba = 0.25 + Math.random() * 0.45;
        t.alpha = t._ba;
        app.stage.addChild(t);
        drops.push(t);
      }
    }
    app.ticker.add((t) => {
      for (const d of drops) {
        d.y += d._vy * t.deltaTime;
        d.alpha = d._ba * (0.5 + 0.5 * Math.sin(d.y * 0.025));
        if (d.y > H + 30) {
          d.y = -20 - Math.random() * 120;
          d.text = SYMS[Math.floor(Math.random() * SYMS.length)];
        }
      }
    });
  }

  if (mode === 2) {
    const orbs = [];
    for (let i = 0; i < 10; i++) {
      const r = 30 + Math.random() * 90;
      const g = new PIXI.Graphics();
      g.circle(0, 0, r).fill({ color: i % 2 ? C1 : C2, alpha: 0.1 + Math.random() * 0.1 });
      g.x = Math.random() * W;
      g.y = Math.random() * H;
      g._ba = 0.4 + Math.random() * 0.45;
      g._ph = Math.random() * PI2;
      g._sp = 0.007 + Math.random() * 0.01;
      g._vx = (Math.random() - 0.5) * 0.3;
      g._vy = (Math.random() - 0.5) * 0.25;
      g.alpha = g._ba;
      app.stage.addChild(g);
      orbs.push(g);
    }
    app.ticker.add((t) => {
      elapsed += t.deltaTime;
      for (const o of orbs) {
        o.x += o._vx;
        o.y += o._vy;
        o.scale.set(0.7 + 0.3 * Math.sin(elapsed * o._sp + o._ph));
        o.alpha = o._ba * (0.4 + 0.6 * Math.sin(elapsed * o._sp * 1.5 + o._ph));
      }
    });
  }

  if (mode === 3) {
    const flies = [];
    for (let i = 0; i < 70; i++) {
      const g = new PIXI.Graphics();
      const r = 2.2 + Math.random() * 4.2;
      g.circle(0, 0, r).fill({ color: i % 4 ? C1 : C2 });
      g.x = Math.random() * W;
      g.y = Math.random() * H;
      g._ax = Math.random() * PI2;
      g._ay = Math.random() * PI2;
      g._sx = 0.01 + Math.random() * 0.015;
      g._sy = 0.008 + Math.random() * 0.012;
      g._rx = 35 + Math.random() * 70;
      g._ry = 25 + Math.random() * 50;
      g._ba = 0.4 + Math.random() * 0.6;
      g._blink = 0.025 + Math.random() * 0.035;
      g._ph = Math.random() * PI2;
      g.alpha = g._ba;
      app.stage.addChild(g);
      flies.push(g);
    }
    app.ticker.add((t) => {
      elapsed += t.deltaTime;
      for (const f of flies) {
        f.x += Math.sin(elapsed * f._sx + f._ax) * f._rx * 0.014;
        f.y += Math.cos(elapsed * f._sy + f._ay) * f._ry * 0.014;
        f.alpha = f._ba * Math.max(0, Math.sin(elapsed * f._blink + f._ph));
      }
    });
  }

  if (mode === 4) {
    const cx = W * 0.5;
    const cy = H * 0.5;
    const pts = [];
    for (let i = 0; i < 90; i++) {
      const g = new PIXI.Graphics();
      const sz = 1.5 + Math.random() * 3.2;
      g.circle(0, 0, sz).fill({ color: i % 3 ? C1 : C2 });
      const a = Math.random() * PI2;
      const r = 20 + Math.random() * (Math.min(W, H) * 0.48);
      g.x = cx + Math.cos(a) * r;
      g.y = cy + Math.sin(a) * r;
      g._a = a;
      g._r = r;
      g._sp = 0.004 + Math.random() * 0.008;
      g._dr = (Math.random() - 0.5) * 0.12;
      g._ba = 0.4 + Math.random() * 0.5;
      g._ph = Math.random() * PI2;
      g.alpha = g._ba;
      app.stage.addChild(g);
      pts.push(g);
    }
    app.ticker.add((t) => {
      elapsed += t.deltaTime;
      for (const p of pts) {
        p._a += p._sp * t.deltaTime;
        p._r += p._dr * Math.sin(elapsed * 0.006 + p._ph);
        if (p._r < 15) p._r = 15;
        if (p._r > Math.min(W, H) * 0.52) p._r = Math.min(W, H) * 0.52;
        p.x = cx + Math.cos(p._a) * p._r;
        p.y = cy + Math.sin(p._a) * p._r;
        p.alpha = p._ba * (0.5 + 0.5 * Math.sin(elapsed * 0.018 + p._ph));
      }
    });
  }

  const ro = new ResizeObserver(() => {
    const nw = section.offsetWidth;
    const nh = section.offsetHeight;
    if (Math.abs(nw - W) > 5 || Math.abs(nh - H) > 5) {
      W = nw;
      H = nh;
      app.renderer.resize(nw, nh);
    }
  });
  ro.observe(section);
})();

