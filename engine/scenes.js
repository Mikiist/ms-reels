// Szenen-Bibliothek. Jede Szene: zone (wo der gesprochene Text steht), pal (Standard-Farbwelt), bgv (Hintergrundmuster),
// draw(g, u, d, p, sc, P): u = Sekunden seit Szenenstart, d = Szenendauer, p = Parameter aus der Spec, sc.gc = Mitte der Grafik.
// ev(d, p): Ton-Ereignisse [Sekunde, Klang, Lautstärke, Panorama].
const TYPES = {};

// ===== 1. Hook: ladender Browser, Countdown, zersplittert =====
TYPES.hook_countdown = {
  zone: "bottom", pal: "black", bgv: 0,
  prep(sc, p) {
    const c = document.createElement("canvas"); c.width = 780; c.height = 540; const g = c.getContext("2d");
    browser(g, 0, 0, 780, 540, p.url || "ihre-firma.de", (g2, w, h) => {
      g2.strokeStyle = "#2c313b"; g2.lineWidth = 12; g2.beginPath(); g2.arc(w / 2, h * 0.38, 54, 0, 7); g2.stroke();
      txt(g2, "Lädt …", w / 2, h * 0.7, { w: 600, px: 36, c: "#6f7786" });
      fillRR(g2, 60, h * 0.84, w - 120, 12, 6, "#262a33");
    }, true);
    sc.st.img = c; const T = [];
    const NX = 7, NY = 6, Pt = [];
    for (let j = 0; j <= NY; j++) for (let i = 0; i <= NX; i++) { const e = i === 0 || j === 0 || i === NX || j === NY; Pt.push([i / NX * 780 + (e ? 0 : (rnd(i * 13 + j * 7) - 0.5) * 70), j / NY * 540 + (e ? 0 : (rnd(i * 5 + j * 17) - 0.5) * 60)]); }
    const id = (i, j) => j * (NX + 1) + i; let k = 0;
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const a = Pt[id(i, j)], b = Pt[id(i + 1, j)], cc = Pt[id(i + 1, j + 1)], dd = Pt[id(i, j + 1)];
      for (const tri of [[a, b, cc], [a, cc, dd]]) { const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3, dx = cx - 390, dy = cy - 270, len = Math.hypot(dx, dy) + 30;
        T.push({ tri, cx, cy, vx: dx / len * (700 + rnd(k) * 900), vy: dy / len * (700 + rnd(k + 9) * 900) - 200, vr: (rnd(k + 3) - 0.5) * 9 }); k++; }
    }
    sc.st.sh = T;
  },
  times(d, p) { const n = p.n || 3, end = Math.max(1.2, d - 0.42); const ts = []; for (let i = 0; i < n; i++) ts.push(0.15 + i * (end - 0.25) / n); return { ts, end, n }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc);
    const { ts, end, n } = this.times(d, p); const cy = sc.gc;
    // Kopfzeile: Label und laufende Sekunden
    txt(g, (p.label || "BESUCHER WARTET").toUpperCase(), 540, cy - 500, { w: 700, px: 40, fam: "I", c: "#9aa0aa", ls: 6 });
    const secs = Math.min(u, end) * 1.0 + 0.0; txt(g, secs.toFixed(1).replace(".", ",") + " s", 540, cy - 420, { w: 800, px: 84, c: "#ff453a" });
    if (u < end) {
      const sc_ = 1.12 + 0.02 * Math.sin(u * 7);
      g.save(); g.translate(540, cy); g.scale(sc_, sc_); g.drawImage(sc.st.img, -390, -270);
      g.strokeStyle = "#9aa3b3"; g.lineWidth = 12; g.beginPath(); g.arc(0, -270 + 70 + (540 - 70) * 0.38, 54, u * 6, u * 6 + 1.4); g.stroke();
      fillRR(g, -330, -270 + 70 + (540 - 70) * 0.84, 660 * (0.12 + 0.18 * cl(u / end)), 12, 6, "#9aa3b3");
      g.restore();
      for (let i = 0; i < n; i++) {
        const k = seg(u, ts[i] - 0.03, ts[i] + 0.2); if (k <= 0) continue; const nx = i + 1 < n ? ts[i + 1] : end; const fade = 1 - seg(u, nx - 0.08, nx);
        if (fade <= 0) continue; const s = lerp(2.4, 1, outExpo(k)); const num = String(n - i);
        g.save(); g.translate(540, cy); g.scale(s, s); g.globalAlpha = cl(k * 4) * fade; font(g, 900, 520); g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 10;
        g.strokeStyle = "rgba(255,40,60,0.85)"; g.strokeText(num, -10, 0); g.strokeStyle = "rgba(0,220,255,0.85)"; g.strokeText(num, 10, 0); g.strokeStyle = "#ffffff"; g.strokeText(num, 0, 0); g.restore();
      }
    } else {
      const k = u - end; const ox = 540 - 390, oy = cy - 270;
      for (const s of sc.st.sh) { const a = cl(1 - k / 1.0); if (a <= 0) continue; g.save(); g.globalAlpha = a;
        g.translate(ox + s.cx + s.vx * k, oy + s.cy + s.vy * k + 900 * k * k); g.rotate(s.vr * k); g.beginPath();
        g.moveTo(s.tri[0][0] - s.cx, s.tri[0][1] - s.cy); g.lineTo(s.tri[1][0] - s.cx, s.tri[1][1] - s.cy); g.lineTo(s.tri[2][0] - s.cx, s.tri[2][1] - s.cy); g.closePath(); g.clip();
        g.drawImage(sc.st.img, -s.cx, -s.cy); g.restore(); }
      const f = 1 - seg(k, 0, 0.25); if (f > 0) { g.fillStyle = `rgba(255,255,255,${0.5 * f})`; g.fillRect(0, 0, W, H); }
      const wk = outBack(seg(k, 0.02, 0.25), 2.2); if (wk > 0) { g.save(); g.translate(540, cy); g.rotate(-0.08); g.scale(wk, wk); txt(g, (p.boom || "WEG.").toUpperCase(), 0, 0, { w: 900, px: 230, c: "#ff3b30" }); g.restore(); }
    }
  },
  ev(d, p) { const { ts, end } = this.times(d, p); const E = [[0, "boom", 0.9], [0, "whoosh_down", 0.5]]; let t = 0.1, iv = 0.3; while (t < end - 0.05) { E.push([t, "tick", 0.3, (Math.round(t * 10) % 2 ? 0.3 : -0.3)]); t += iv; iv = Math.max(0.07, iv * 0.9); }
    ts.forEach((x) => E.push([x, "thump", 0.85])); E.push([end - 0.6, "riser", 0.35, 0, 0.6]); E.push([end, "glass", 0.9]); E.push([end, "boom", 1.0]); return E; },
};

// ===== 2. Alarm: Warnung mit Glitch =====
TYPES.alarm = {
  zone: "bottom", pal: "crimson", bgv: 3,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc - 40;
    // Sirenenlicht
    g.save(); g.globalCompositeOperation = "lighter"; const a = u * 3.2; const rg = g.createRadialGradient(540 + Math.cos(a) * 300, cy + Math.sin(a) * 200, 0, 540, cy, 900);
    rg.addColorStop(0, "rgba(255,60,60,0.30)"); rg.addColorStop(1, "rgba(255,60,60,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H); g.restore();
    const k = outBack(seg(u, 0.05, 0.4), 2.4); const pulse = 1 + 0.05 * Math.sin(u * 14) * (u > 0.4 ? 1 : 0);
    const glitch = R(Math.floor(u * 12) + sc.i * 99) > 0.82 ? (R(Math.floor(u * 30)) - 0.5) * 40 : 0;
    g.save(); g.translate(540 + glitch, cy - 140); g.scale(k * pulse, k * pulse);
    shadow(g, 60, 0, "rgba(255,40,40,0.8)"); g.fillStyle = "#ffcc00"; g.beginPath(); g.moveTo(0, -210); g.lineTo(240, 200); g.lineTo(-240, 200); g.closePath(); g.lineJoin = "round"; g.lineWidth = 40; g.strokeStyle = "#ffcc00"; g.stroke(); g.fill(); noShadow(g);
    txt(g, "!", 0, 40, { w: 900, px: 300, c: "#1a0003" }); g.restore();
    const tk = out3(seg(u, 0.35, 0.7));
    if (tk > 0) {
      const title = p.title || "ACHTUNG"; const px = fitPx(g, title, 960, 150, 900);
      g.save(); g.globalAlpha = tk; g.translate(0, (1 - tk) * 60);
      if (glitch) { txt(g, title, 540 - 8, cy + 230, { w: 900, px, c: "rgba(0,255,255,0.7)" }); txt(g, title, 540 + 8, cy + 230, { w: 900, px, c: "rgba(255,0,80,0.7)" }); }
      txt(g, title, 540, cy + 230, { w: 900, px, c: "#ffffff" });
      if (p.sub) txt(g, p.sub, 540, cy + 340, { w: 600, px: 46, fam: "I", c: P.sub });
      g.restore();
    }
    g.fillStyle = "rgba(0,0,0,0.12)"; for (let y = (u * 120) % 8; y < H; y += 8) g.fillRect(0, y, W, 3);
  },
  ev(d) { return [[0.05, "buzz", 0.6], [0.12, "thump", 0.8], [0.4, "glitch", 0.5], [0.42, "slap", 0.6], [Math.min(d - 0.3, 1.2), "glitch", 0.4]]; },
};

// ===== 3. Große Zahl mit Ring =====
TYPES.big_number = {
  zone: "top", pal: "navy", bgv: 2,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc; const D = Math.min(1.6, d * 0.6); const k = outExpo(seg(u, 0.15, 0.15 + D));
    const v = (p.value || 0) * k; const dec = p.decimals || 0; let s = v.toFixed(dec).replace(".", ","); s = (p.prefix || "") + s + (p.suffix || "");
    ring(g, 540, cy, 360, 34, hexA(P.fg, 0.12)); g.lineCap = "round"; ring(g, 540, cy, 360, 34, P.acc, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k * (p.ring == null ? 1 : p.ring)); g.lineCap = "butt";
    const px = fitPx(g, s, 600, 240, 900); txt(g, s, 540, cy - 10, { w: 900, px, c: P.fg });
    if (p.label) { const lp = fitPx(g, p.label, 560, 44, 600, "I"); txt(g, p.label, 540, cy + 130, { w: 600, px: lp, fam: "I", c: P.sub }); }
    if (k > 0.98) sparkles(g, 540, cy, u, 16, 470, P.acc2, sc.i);
    if (p.source) txt(g, "Quelle: " + p.source, 540, cy + 470, { w: 500, px: 26, fam: "I", c: P.sub });
  },
  ev(d) { const D = Math.min(1.6, d * 0.6); const E = []; for (let i = 0; i < 14; i++) E.push([0.15 + D * (1 - Math.pow(1 - i / 14, 2.5)) * 0.85, "tick", 0.16]); E.push([0.15 + D * 0.8, "ding", 0.4]); return E; },
};

// ===== 4. Handy, Benachrichtigungen prasseln rein =====
TYPES.phone_notifs = {
  zone: "top", pal: "offwhite", bgv: 2,
  items(p) { const base = p.items && p.items.length ? p.items : [["Neue Anfrage", "über Ihr Kontaktformular"], ["Anruf über Google", "gerade eben"], ["Neue Anfrage", "Terminwunsch"]]; return base.map((x) => (Array.isArray(x) ? x : [x, "gerade eben"])); },
  times(d, p) { const n = Math.max(3, Math.min(9, p.count || 7)); const ts = []; let t = 0.3, gap = Math.min(0.55, (d - 0.6) / 4); for (let i = 0; i < n && t < d - 0.15; i++) { ts.push(t); t += gap; gap = Math.max(0.13, gap * 0.72); } return ts; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc + 30; const it = this.items(p); const ts = this.times(d, p);
    const shown = ts.filter((x) => u >= x).length; const tilt = lerp(-0.12, -0.03, out3(seg(u, 0, 0.6)));
    const intro = out3(seg(u, 0, 0.45));
    g.save(); g.translate(0, (1 - intro) * 500);
    phone(g, 540, cy, 470, 940, (s, w, h) => {
      const gr = s.createLinearGradient(0, 0, w, h); gr.addColorStop(0, "#1e3a8a"); gr.addColorStop(1, "#0b1220"); s.fillStyle = gr; s.fillRect(0, 0, w, h);
      txt(s, "9:41", w / 2, 150, { w: 300, px: 110, c: "#fff" }); txt(s, p.day || "Dienstag, 14. Mai", w / 2, 225, { w: 500, px: 24, fam: "I", c: "rgba(255,255,255,0.75)" });
      for (let j = 0; j < shown; j++) {
        const age = u - ts[j]; const pos = shown - 1 - j; const yIn = out3(cl(age / 0.28)); const y = 300 + pos * 132 - (1 - yIn) * 160;
        if (y > h - 40) continue; const sc2 = lerp(0.9, 1, yIn);
        s.save(); s.translate(w / 2, y + 58); s.scale(sc2, sc2); s.globalAlpha = cl(age / 0.15);
        fillRR(s, -w / 2 + 14, -58, w - 28, 116, 26, "rgba(255,255,255,0.92)");
        const ic = j % 3 === 1 ? "#2563eb" : "#22c55e"; fillRR(s, -w / 2 + 32, -34, 68, 68, 18, ic);
        if (j % 3 === 1) { s.strokeStyle = "#fff"; s.lineWidth = 6; s.beginPath(); s.arc(-w / 2 + 66, 0, 18, 0.6, 5.2); s.stroke(); } else { s.strokeStyle = "#fff"; s.lineWidth = 5; rr(s, -w / 2 + 48, -16, 36, 28, 4); s.stroke(); s.beginPath(); s.moveTo(-w / 2 + 48, -14); s.lineTo(-w / 2 + 66, 2); s.lineTo(-w / 2 + 84, -14); s.stroke(); }
        const [a, b] = it[j % it.length]; txt(s, a, -w / 2 + 120, -14, { w: 700, px: 25, fam: "I", c: "#0b1220", al: "left" }); txt(s, b, -w / 2 + 120, 20, { w: 500, px: 21, fam: "I", c: "#5b6474", al: "left" });
        txt(s, "jetzt", w / 2 - 34, -20, { w: 500, px: 18, fam: "I", c: "#8b93a3", al: "right" }); s.restore();
      }
    }, tilt);
    if (shown > 0) { const bk = outBack(seg(u, ts[shown - 1], ts[shown - 1] + 0.18), 3); const bx = 540 + 225, by = cy - 470;
      g.save(); g.translate(bx, by); g.scale(bk, bk); shadow(g, 20, 6, "rgba(220,38,38,0.5)"); circle(g, 0, 0, 52, "#ef4444"); noShadow(g); txt(g, String(shown), 0, 3, { w: 800, px: 50, c: "#fff" }); g.restore(); }
    g.restore();
  },
  ev(d, p) { return this.times(d, p).map((t, i) => [t, i % 2 ? "pop" : "ding", 0.35, (i % 2 ? 0.3 : -0.3)]); },
};

// ===== 5. Suche: Anfrage wird getippt, Ihre Firma rutscht nach oben =====
TYPES.google_search = {
  zone: "top", pal: "sky", bgv: 1,
  times(d, p) { const q = p.query || "Elektriker Goslar"; const t0 = 0.25, t1 = t0 + Math.min(1.0, 0.045 * q.length); return { q, t0, t1, tr: Math.min(d - 0.6, t1 + 0.6), tb: Math.min(d - 0.3, t1 + 1.1) }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const { q, t0, t1, tr, tb } = this.times(d, p); const cy = sc.gc; const x = 90, w = 900, y = cy - 470;
    const intro = out3(seg(u, 0, 0.35)); g.save(); g.translate(0, (1 - intro) * 300); g.globalAlpha = intro;
    shadow(g, 40, 18, "rgba(15,40,80,0.18)"); fillRR(g, x, y, w, 120, 60, "#fff"); noShadow(g);
    ring(g, x + 66, y + 54, 20, 7, P.acc); g.strokeStyle = P.acc; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(x + 81, y + 70); g.lineTo(x + 96, y + 86); g.stroke();
    const n = Math.floor(q.length * seg(u, t0, t1)); const shownQ = q.slice(0, n); txt(g, shownQ, x + 130, y + 62, { w: 500, px: 40, fam: "I", c: "#0b1220", al: "left" });
    if (u < t1 + 0.4 && Math.floor(u * 3) % 2 === 0) { font(g, 500, 40, "I"); const cw = g.measureText(shownQ).width; g.fillStyle = P.acc; g.fillRect(x + 134 + cw, y + 38, 4, 48); }
    // Ergebnisse
    const others = p.others || ["Anbieter in der Nähe", "Branchenbuch Eintrag", "Vergleichsportal"]; const up = inOut(seg(u, tr, tr + 0.55));
    for (let i = 0; i < 3; i++) { const k = out3(seg(u, t1 + 0.05 + i * 0.08, t1 + 0.35 + i * 0.08)); if (k <= 0) continue; const ry = y + 170 + i * 190 + up * 190;
      g.save(); g.globalAlpha = k * (1 - 0.35 * up); fillRR(g, x, ry + (1 - k) * 40, w, 160, 26, "#fff"); txt(g, others[i % others.length], x + 40, ry + 58 + (1 - k) * 40, { w: 600, px: 32, fam: "I", c: "#1a0dab", al: "left" });
      fillRR(g, x + 40, ry + 96 + (1 - k) * 40, 560, 16, 8, "#e5e7eb"); fillRR(g, x + 40, ry + 124 + (1 - k) * 40, 380, 16, 8, "#e5e7eb"); g.restore(); }
    if (u > tr - 0.05) { const ry = lerp(y + 170 + 3 * 190 + 60, y + 170, up); const glow = seg(u, tr + 0.4, tr + 0.8);
      g.save(); shadow(g, 50 * glow + 20, 12, hexA(P.acc, 0.45)); fillRR(g, x - 10 * glow, ry - 6 * glow, w + 20 * glow, 160 + 12 * glow, 28, "#fff"); noShadow(g);
      g.strokeStyle = P.acc; g.lineWidth = 6; rr(g, x - 10 * glow, ry - 6 * glow, w + 20 * glow, 160 + 12 * glow, 28); g.stroke();
      txt(g, p.result || "Ihre Firma", x + 40, ry + 58, { w: 700, px: 36, fam: "I", c: "#1a0dab", al: "left" }); txt(g, p.url || "ihre-firma.de", x + 40, ry + 110, { w: 500, px: 26, fam: "I", c: "#16a34a", al: "left" }); g.restore();
      const bk = outBack(seg(u, tb, tb + 0.25), 2.5); if (bk > 0) { g.save(); g.translate(x + w - 120, ry + 6); g.rotate(-0.12); g.scale(bk, bk); fillRR(g, -110, -40, 220, 80, 40, P.acc); txt(g, p.badge || "Ganz oben", 0, 2, { w: 800, px: 32, c: "#fff" }); g.restore(); }
    }
    g.restore();
  },
  ev(d, p) { const { q, t0, t1, tr, tb } = this.times(d, p); const E = []; for (let i = 0; i < q.length; i++) E.push([t0 + (t1 - t0) * i / q.length, "key", 0.3, 0.2]); E.push([t1 + 0.1, "pop", 0.25]); E.push([tr, "whoosh_up", 0.45]); E.push([tr + 0.5, "chime", 0.25]); E.push([tb, "pop", 0.4]); return E; },
};

// ===== 6. Karte mit Pin =====
TYPES.map_pin = {
  zone: "top", pal: "mint", bgv: 0,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc; const z = 1 + 0.06 * u / d;
    g.save(); g.translate(540, cy); g.scale(z, z); g.translate(-540, -cy);
    fillRR(g, 60, cy - 560, 960, 1120, 50, "#eef2f0"); g.save(); rr(g, 60, cy - 560, 960, 1120, 50); g.clip();
    g.fillStyle = "#cdeccd"; g.beginPath(); g.ellipse(300, cy - 300, 220, 140, 0.3, 0, 7); g.fill();
    g.strokeStyle = "#a5d8f3"; g.lineWidth = 60; g.beginPath(); g.moveTo(60, cy + 380); g.bezierCurveTo(400, cy + 200, 650, cy + 520, 1020, cy + 300); g.stroke();
    g.strokeStyle = "#ffffff"; g.lineCap = "round";
    for (let i = 0; i < 9; i++) { const vert = i % 2 === 0; g.lineWidth = i % 3 === 0 ? 34 : 20; const o = 120 + R(i * 3 + sc.i) * 840; g.beginPath(); if (vert) { g.moveTo(o, cy - 600); g.lineTo(o + (R(i) - 0.5) * 200, cy + 600); } else { g.moveTo(40, cy - 520 + o); g.lineTo(1040, cy - 520 + o + (R(i + 5) - 0.5) * 160); } g.stroke(); }
    for (let i = 0; i < 14; i++) { const bx = 100 + R(i * 7 + 1) * 860, by = cy - 520 + R(i * 11 + 2) * 1040; fillRR(g, bx, by, 60 + R(i) * 50, 50 + R(i + 1) * 40, 10, "#dfe5e2"); }
    g.restore(); g.restore();
    const drop = seg(u, 0.25, 0.75); const py = cy - 40 - (1 - outElastic(drop)) * 700; const land = 0.5;
    const rk = u - 0.25 - land; if (rk > 0) for (let i = 0; i < 3; i++) { const k = ((rk * 0.7 + i / 3) % 1); g.strokeStyle = hexA(P.acc, 0.6 * (1 - k)); g.lineWidth = 6; g.beginPath(); g.ellipse(540, cy + 40, 40 + k * 260, (40 + k * 260) * 0.35, 0, 0, 7); g.stroke(); }
    g.fillStyle = "rgba(0,0,0,0.18)"; g.beginPath(); g.ellipse(540, cy + 40, 50 * cl(drop * 1.5), 16 * cl(drop * 1.5), 0, 0, 7); g.fill();
    if (drop > 0) { g.save(); g.translate(540, py); shadow(g, 30, 14, "rgba(0,0,0,0.3)"); g.fillStyle = "#ef4444"; g.beginPath(); g.arc(0, -80, 64, Math.PI * 0.85, Math.PI * 2.15); g.lineTo(0, 40); g.closePath(); g.fill(); noShadow(g); circle(g, 0, -82, 26, "#fff"); g.restore(); }
    const lk = outBack(seg(u, 0.9, 1.2), 2); if (lk > 0) { g.save(); g.translate(540, cy - 300); g.scale(lk, lk); shadow(g, 40, 14, "rgba(0,0,0,0.2)"); fillRR(g, -300, -70, 600, 140, 30, "#fff"); noShadow(g);
      txt(g, p.title || "Ihre Firma", -260, -22, { w: 800, px: 40, c: "#0b1220", al: "left" }); txt(g, p.place || FACTS.ort, -260, 30, { w: 500, px: 28, fam: "I", c: "#5b6474", al: "left" });
      fillRR(g, 150, -34, 120, 68, 34, P.acc); txt(g, p.cta || "Route", 210, 2, { w: 700, px: 26, fam: "I", c: "#fff" }); g.restore(); }
  },
  ev() { return [[0.25, "whoosh_down", 0.4], [0.62, "thump", 0.7], [0.8, "ping", 0.25], [0.9, "pop", 0.35], [1.5, "ping", 0.2]]; },
};

// ===== 7. Vorher / Nachher =====
TYPES.before_after = {
  zone: "top", pal: "offwhite", bgv: 1,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc + 70, x = 130, y = cy - 470, w = 820, h = 940;
    const intro = out3(seg(u, 0, 0.35)); g.save(); g.translate(0, (1 - intro) * 200); g.globalAlpha = intro;
    const wipe = inOut(seg(u, d * 0.3, d * 0.3 + Math.min(1.0, d * 0.4))); const dx = x + w * (1 - wipe);
    // Nachher (unten)
    browser(g, x, y, w, h, p.url || "ihre-firma.de", (s, ww, hh) => {
      const gr = s.createLinearGradient(0, 0, ww, 500); gr.addColorStop(0, "#1e3a8a"); gr.addColorStop(1, "#0ea5e9"); fillRR(s, 24, 24, ww - 48, 520, 30, gr);
      const head = p.headline || "Ihr Betrieb. Ihre Region. Ihre Anfragen."; font(s, 800, 58); const lines = wrapLines(s, head, ww - 140);
      lines.slice(0, 3).forEach((l, i) => txt(s, l, 70, 120 + i * 66, { w: 800, px: 58, al: "left", c: "#fff" }));
      fillRR(s, 70, 420, 300, 80, 40, "#fff"); txt(s, "Jetzt anfragen", 220, 461, { w: 800, px: 28, fam: "I", c: "#0b1220" });
      for (let i = 0; i < 3; i++) { fillRR(s, 24 + i * ((ww - 48) / 3 + 0), 580, (ww - 48) / 3 - 16, 200, 24, "#f1f5f9"); fillRR(s, 48 + i * ((ww - 48) / 3), 604, 60, 60, 16, "#dbeafe"); txt(s, ["Leistungen", "Preise", "Termin"][i], 48 + i * ((ww - 48) / 3), 720, { w: 700, px: 26, fam: "I", c: "#0b1220", al: "left" }); }
      fillRR(s, 24, 810, ww - 48, 160, 26, "#0b1220"); txt(s, "Vom Klick zur Anfrage in drei Schritten.", 60, 890, { w: 700, px: 30, al: "left", c: "#fff" });
    });
    // Vorher (oben, wird weggewischt)
    g.save(); g.beginPath(); g.rect(0, 0, dx, H); g.clip();
    browser(g, x, y, w, h, p.old_url || "ihre-firma.de/index.html", (s, ww, hh) => {
      s.fillStyle = "#d9d4c7"; s.fillRect(0, 0, ww, hh); s.fillStyle = "#003399"; s.fillRect(0, 0, ww, 90); txt(s, "Herzlich Willkommen!!!", ww / 2, 46, { w: 700, px: 40, fam: "serif", c: "#ffff00" });
      g.font = "400 22px serif"; for (let i = 0; i < 14; i++) { s.fillStyle = "#555"; s.fillRect(30, 130 + i * 30, ww * (0.4 + R(i) * 0.5), 12); }
      s.fillStyle = "#bbb"; s.fillRect(ww - 330, 130, 300, 260); cross(s, ww - 180, 260, 60, 1, "#888", 8);
      s.fillStyle = "#ff0000"; s.fillRect(30, 600, 400, 60); txt(s, "BESUCHERZÄHLER: 000347", 230, 631, { w: 700, px: 22, fam: "serif", c: "#fff" });
      for (let i = 0; i < 6; i++) { s.fillStyle = ["#00a", "#a00", "#0a0"][i % 3]; s.fillRect(30 + (i % 3) * 270, 700 + Math.floor(i / 3) * 120, 240, 90); }
      txt(s, "Letzte Aktualisierung: 2014", ww / 2, hh - 40, { w: 400, px: 20, fam: "serif", c: "#333" });
    });
    g.restore();
    if (wipe > 0 && wipe < 1) { g.fillStyle = "#fff"; g.fillRect(dx - 4, y - 20, 8, h + 40); circle(g, dx, cy, 46, "#fff"); txt(g, "‹ ›", dx, cy + 2, { w: 800, px: 36, c: "#0b1220" }); }
    const lb = (s, xx, c, a) => { if (a <= 0) return; g.save(); g.globalAlpha = a; fillRR(g, xx - 110, y - 90, 220, 64, 32, c); txt(g, s, xx, y - 57, { w: 800, px: 28, fam: "I", c: "#fff", ls: 3 }); g.restore(); };
    lb("VORHER", 290, "#6b7280", 1 - wipe); lb("NACHHER", 790, P.acc, wipe);
    const sk = outBack(seg(u, d * 0.3 + Math.min(1.0, d * 0.4) + 0.05, d * 0.3 + Math.min(1.0, d * 0.4) + 0.3), 2.5);
    if (sk > 0) { g.save(); g.translate(x + w - 40, y + 140); g.rotate(0.2); g.scale(sk, sk); circle(g, 0, 0, 90, "#facc15"); txt(g, p.sticker || "NEU", 0, 4, { w: 900, px: 44, c: "#0b1220" }); g.restore(); }
    g.restore();
  },
  ev(d) { const a = d * 0.3, b = a + Math.min(1.0, d * 0.4); return [[0, "whoosh_up", 0.3], [a, "whoosh_side", 0.6], [b + 0.05, "pop", 0.5], [b + 0.1, "chime", 0.25]]; },
};

// ===== 8. Tempo: Tacho schnellt hoch =====
TYPES.speed = {
  zone: "top", pal: "electric", bgv: 0,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc + 60;
    g.save(); g.globalAlpha = 0.35; g.strokeStyle = "#fff"; g.lineCap = "round"; for (let i = 0; i < 26; i++) { const yy = R(i * 3 + 1) * H, len = 120 + R(i) * 380, sp = 1600 + R(i + 9) * 1800; const xx = ((R(i * 5) * W * 2 - u * sp) % (W + 600) + W + 600) % (W + 600) - 300; g.lineWidth = 3 + R(i) * 6; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + len, yy); g.stroke(); } g.restore();
    const r = 360, k = inOut(seg(u, 0.2, Math.min(d - 0.4, 1.3))); const score = p.score || 97;
    g.lineCap = "round"; ring(g, 540, cy, r, 46, "rgba(255,255,255,0.18)", Math.PI, Math.PI * 2);
    const cols = ["#ef4444", "#f59e0b", "#22c55e"]; const ang = Math.PI + Math.PI * (score / 100) * k;
    const gr = g.createLinearGradient(180, 0, 900, 0); gr.addColorStop(0, cols[0]); gr.addColorStop(0.5, cols[1]); gr.addColorStop(1, cols[2]); ring(g, 540, cy, r, 46, gr, Math.PI, ang); g.lineCap = "butt";
    g.save(); g.translate(540, cy); g.rotate(ang); fillRR(g, -10, -10, r - 40, 20, 10, "#fff"); g.restore(); circle(g, 540, cy, 34, "#fff");
    txt(g, String(Math.round(score * k)), 540, cy + 150, { w: 900, px: 200, c: "#fff" }); txt(g, p.label || "PageSpeed mobil", 540, cy + 280, { w: 600, px: 40, fam: "I", c: P.sub });
    const bolt = seg(u, Math.min(d - 0.4, 1.3), Math.min(d - 0.4, 1.3) + 0.12); if (bolt > 0 && bolt < 1) { g.fillStyle = `rgba(255,255,255,${0.6 * (1 - bolt)})`; g.fillRect(0, 0, W, H); }
    if (bolt > 0) { const bk = outBack(cl(bolt * 2), 2); g.save(); g.translate(860, cy - 380); g.scale(bk, bk); g.fillStyle = "#fde047"; g.beginPath(); g.moveTo(20, -110); g.lineTo(-60, 20); g.lineTo(0, 20); g.lineTo(-20, 110); g.lineTo(60, -20); g.lineTo(0, -20); g.closePath(); g.fill(); g.restore(); }
  },
  ev(d) { const e = Math.min(d - 0.4, 1.3); return [[0.1, "whoosh_up", 0.5], [0.2, "riser", 0.4, 0, e - 0.2], [e, "thunder", 0.8]]; },
};

// ===== 9. Chat bei Nacht =====
TYPES.chat = {
  zone: "top", pal: "night", bgv: 0,
  msgs(p) { return p.messages && p.messages.length ? p.messages : [["kunde", "Haben Sie am Samstag Zeit?"], ["bot", "Ja, Samstag 10 Uhr ist frei. Soll ich eintragen?"], ["kunde", "Ja bitte!"], ["bot", "Erledigt. Sie bekommen eine Bestätigung."]]; },
  times(d, p) { const m = this.msgs(p); const step = Math.min(0.75, (d - 0.5) / m.length); return m.map((_, i) => 0.3 + i * step); },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc;
    for (let i = 0; i < 60; i++) { const tw = 0.4 + 0.6 * Math.abs(Math.sin(u * (1 + R(i)) * 2 + i)); circle(g, R(i * 3) * W, R(i * 7) * H * 0.55, 1 + R(i * 11) * 2.5, `rgba(255,255,255,${0.6 * tw})`); }
    const mg = g.createRadialGradient(860, 260, 0, 860, 260, 260); mg.addColorStop(0, "rgba(255,240,200,0.35)"); mg.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = mg; g.fillRect(500, 0, 580, 600);
    circle(g, 860, 260, 90, "#fef3c7"); circle(g, 900, 230, 86, P.bg[0]);
    txt(g, p.clock || "23:47", 200, 250, { w: 300, px: 90, c: "rgba(255,255,255,0.85)" });
    const x = 110, w = 860, y = cy - 430, h = 900; const intro = out3(seg(u, 0, 0.35));
    g.save(); g.translate(0, (1 - intro) * 200); g.globalAlpha = intro; shadow(g, 60, 20, "rgba(0,0,0,0.5)"); fillRR(g, x, y, w, h, 40, "#111827"); noShadow(g);
    fillRR(g, x, y, w, 110, [40, 40, 0, 0], "#1f2937"); circle(g, x + 70, y + 55, 30, P.acc); txt(g, "KI", x + 70, y + 57, { w: 800, px: 24, c: "#fff" });
    txt(g, p.botname || "Website-Assistent", x + 120, y + 42, { w: 700, px: 28, fam: "I", c: "#fff", al: "left" }); txt(g, "online", x + 120, y + 76, { w: 500, px: 22, fam: "I", c: "#4ade80", al: "left" });
    const m = this.msgs(p), ts = this.times(d, p); let yy = y + 150;
    for (let i = 0; i < m.length; i++) { if (u < ts[i] - (m[i][0] === "bot" ? 0.35 : 0)) break; const me = m[i][0] !== "bot";
      font(g, 500, 30, "I"); const lines = wrapLines(g, m[i][1], 520); const bh = 34 + lines.length * 40, bw = Math.min(600, Math.max(...lines.map((l) => g.measureText(l).width)) + 56);
      const bx = me ? x + w - 30 - bw : x + 30; const k = outBack(seg(u, ts[i], ts[i] + 0.22), 2);
      if (!me && u < ts[i]) { fillRR(g, bx, yy, 120, 64, 32, "#374151"); for (let j = 0; j < 3; j++) circle(g, bx + 34 + j * 26, yy + 32, 8, `rgba(255,255,255,${0.4 + 0.6 * Math.abs(Math.sin(u * 8 + j))})`); }
      else { g.save(); g.translate(bx + (me ? bw : 0), yy); g.scale(k, k); fillRR(g, me ? -bw : 0, 0, bw, bh, 30, me ? P.acc : "#374151"); lines.forEach((l, j) => txt(g, l, (me ? -bw : 0) + 28, 38 + j * 40, { w: 500, px: 30, fam: "I", c: "#fff", al: "left" })); g.restore(); }
      yy += bh + 24; }
    g.restore();
  },
  ev(d, p) { const m = this.msgs(p); return this.times(d, p).map((t, i) => [t, m[i][0] === "bot" ? "chime" : "pop", m[i][0] === "bot" ? 0.18 : 0.32, m[i][0] === "bot" ? -0.3 : 0.3]); },
};

// ===== 10. Checkliste =====
TYPES.checklist = {
  zone: "top", pal: "cream", bgv: 1,
  times(d, p) { const it = (p.items || ["Schnell", "Mobil", "Bei Google"]).slice(0, 5); const step = Math.min(0.5, (d - 0.6) / it.length); return { it, ts: it.map((_, i) => 0.35 + i * step) }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const { it, ts } = this.times(d, p); const cy = sc.gc; const rowH = 150, h = it.length * rowH + 120, y = cy - h / 2, x = 120, w = 840;
    const intro = out3(seg(u, 0, 0.35)); g.save(); g.translate(0, (1 - intro) * 200); g.globalAlpha = intro;
    shadow(g, 50, 20, "rgba(60,40,10,0.18)"); fillRR(g, x, y, w, h, 40, "#fffdf8"); noShadow(g);
    if (p.title) txt(g, p.title, x + 60, y + 40, { w: 700, px: 30, fam: "I", c: P.sub, al: "left", ls: 2 });
    it.forEach((s, i) => { const ry = y + 90 + i * rowH; const k = seg(u, ts[i], ts[i] + 0.3);
      fillRR(g, x + 60, ry, 80, 80, 22, k > 0 ? P.acc : "#efe7d8"); if (k > 0) check(g, x + 100, ry + 42, 50, out3(k), "#fff", 12);
      const px = fitPx(g, s, w - 260, 52, 700); txt(g, s, x + 180, ry + 42, { w: 700, px, c: k > 0 ? P.fg : hexA(P.fg, 0.35), al: "left" }); });
    g.restore();
    if (p.stamp) { const t = ts[ts.length - 1] + 0.45; const sk = outExpo(seg(u, t, t + 0.18)); if (sk > 0) { g.save(); g.translate(760, y + h - 40); g.rotate(-0.18); g.scale(lerp(2.2, 1, sk), lerp(2.2, 1, sk)); g.globalAlpha = cl(sk * 3);
      g.strokeStyle = "#16a34a"; g.lineWidth = 10; rr(g, -190, -60, 380, 120, 20); g.stroke(); txt(g, p.stamp.toUpperCase(), 0, 4, { w: 900, px: 52, c: "#16a34a", ls: 4 }); g.restore(); } }
  },
  ev(d, p) { const { ts } = this.times(d, p); const E = ts.map((t, i) => [t, "tick_hi", 0.4, -0.2 + i * 0.1]).concat(ts.map((t) => [t + 0.02, "pop", 0.25])); if (p.stamp) E.push([ts[ts.length - 1] + 0.45, "slap", 0.7]); return E; },
};

// ===== 11. Fehlerliste: wird durchgestrichen =====
TYPES.cross_list = {
  zone: "top", pal: "black", bgv: 0,
  times(d, p) { const it = (p.items || ["Lädt ewig", "Am Handy kaputt", "Bei Google unsichtbar"]).slice(0, 5); const step = Math.min(0.5, (d - 0.5) / it.length); return { it, ts: it.map((_, i) => 0.3 + i * step) }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const { it, ts } = this.times(d, p); const cy = sc.gc; const rowH = 170, y0 = cy - (it.length * rowH) / 2;
    it.forEach((s, i) => { const ry = y0 + i * rowH + rowH / 2; const a = out3(seg(u, ts[i] - 0.25, ts[i])); const k = seg(u, ts[i], ts[i] + 0.25);
      g.save(); g.globalAlpha = a; g.translate((1 - a) * -80, 0); const px = fitPx(g, s, 720, 70, 800); txt(g, s, 230, ry, { w: 800, px, c: k > 0 ? "rgba(255,255,255,0.45)" : "#fff", al: "left" });
      if (k > 0) { font(g, 800, px); const tw = g.measureText(s).width; g.strokeStyle = P.acc; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(220, ry + 4); g.lineTo(220 + (tw + 20) * out3(k), ry - 4); g.stroke();
        g.save(); g.translate(140, ry); const xk = outBack(k, 3); g.scale(xk, xk); circle(g, 0, 0, 48, P.acc); cross(g, 0, 0, 18, 1, "#fff", 10); g.restore(); }
      g.restore(); });
  },
  ev(d, p) { const { ts } = this.times(d, p); return ts.map((t, i) => [t, "slap", 0.55, -0.3 + i * 0.15]); },
};

// ===== 12. Preis: Monatspreis, dann Festpreis + gespart =====
TYPES.price = {
  zone: "top", pal: "electric", bgv: 3,
  pk(p) { return FACTS.pakete[p.paket || "landingpage"] || FACTS.pakete.landingpage; },
  times(d) { return { roll: 0.2, flip: Math.max(1.0, d * 0.5), stick: Math.max(1.0, d * 0.5) + 0.55 }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc; const pk = this.pk(p); const { roll, flip, stick } = this.times(d); const only = p.only; // "monat" | "fest"
    const fk = only ? (only === "fest" ? 1 : 0) : inOut(seg(u, flip, flip + 0.45)); const sx = Math.abs(Math.cos(fk * Math.PI)); const back = fk > 0.5;
    const intro = outBack(seg(u, 0, 0.35), 1.5);
    g.save(); g.translate(540, cy); g.scale(sx * intro, intro); shadow(g, 70, 30, "rgba(0,0,30,0.35)"); fillRR(g, -380, -400, 760, 800, 50, "#fff"); noShadow(g);
    txt(g, pk.name.toUpperCase(), 0, -300, { w: 700, px: 32, fam: "I", c: "#5b6474", ls: 6 });
    if (!back) { const k = outExpo(seg(u, roll, roll + 0.9)); const v = Math.round(pk.monat * k); txt(g, "ab", -200, -150, { w: 600, px: 44, fam: "I", c: "#5b6474" }); txt(g, v + " €", 0, -40, { w: 900, px: 200, c: "#0b1220" });
      txt(g, "im Monat", 0, 110, { w: 600, px: 44, fam: "I", c: "#5b6474" }); txt(g, "12 Monate Mindestlaufzeit", 0, 280, { w: 500, px: 28, fam: "I", c: "#8b93a3" }); }
    else { txt(g, "oder einmalig", 0, -160, { w: 600, px: 44, fam: "I", c: "#5b6474" }); txt(g, pk.fest.toLocaleString("de-DE") + " €", 0, -30, { w: 900, px: 170, c: P.bg[1] }); txt(g, "Festpreis", 0, 110, { w: 700, px: 48, fam: "I", c: "#0b1220" });
      txt(g, "Hosting, SSL und Wartung bei Miete inklusive", 0, 280, { w: 500, px: 24, fam: "I", c: "#8b93a3" }); }
    g.restore();
    if (!only) { const save = pk.monat * 12 - pk.fest; const sk = outBack(seg(u, stick, stick + 0.25), 2.6); if (sk > 0 && save > 0) { g.save(); g.translate(800, cy - 380); g.rotate(0.18); g.scale(sk, sk); shadow(g, 30, 10, "rgba(0,0,0,0.3)"); circle(g, 0, 0, 120, "#facc15"); noShadow(g);
      txt(g, save + " €", 0, -18, { w: 900, px: 58, c: "#0b1220" }); txt(g, "gespart", 0, 36, { w: 700, px: 32, fam: "I", c: "#0b1220" }); g.restore(); }
      confetti(g, 540, cy - 200, u - stick, 80, undefined, 800, sc.i * 17); }
  },
  ev(d, p) { const { roll, flip, stick } = this.times(d); const E = []; for (let i = 0; i < 12; i++) E.push([roll + 0.9 * (1 - Math.pow(1 - i / 12, 3)), "tick", 0.2]); E.push([roll + 0.85, "cash", 0.5]);
    if (!p.only) { E.push([flip, "whoosh_side", 0.5]); E.push([stick, "slap", 0.6]); E.push([stick + 0.02, "cash", 0.5]); } return E; },
};

// ===== 13. Google-Sterne + echtes Zitat =====
TYPES.stars = {
  zone: "top", pal: "gold", bgv: 4,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc - 60; const k = outExpo(seg(u, 0.1, 0.9));
    txt(g, (4.8 * k).toFixed(1).replace(".", ","), 540, cy - 230, { w: 900, px: 230, c: P.acc });
    for (let i = 0; i < 5; i++) { const sk = seg(u, 0.25 + i * 0.12, 0.45 + i * 0.12); const s = outBack(cl(sk * 1.4), 2.4); g.save(); g.translate(540 + (i - 2) * 150, cy - 30); g.scale(lerp(0.4, 1, s), lerp(0.4, 1, s));
      star(g, 0, 0, 62, i < 4 ? sk : sk * 0.8, P.acc, "rgba(255,255,255,0.12)"); g.restore(); }
    txt(g, FACTS.google.anzahl + " Bewertungen bei Google", 540, cy + 90, { w: 600, px: 40, fam: "I", c: P.sub });
    const qk = out3(seg(u, 1.0, 1.4)); if (qk > 0 && !p.no_quote) { g.save(); g.globalAlpha = qk; g.translate(0, (1 - qk) * 60);
      fillRR(g, 110, cy + 180, 860, 280, 36, "rgba(255,255,255,0.07)"); g.strokeStyle = hexA(P.acc, 0.4); g.lineWidth = 2; rr(g, 110, cy + 180, 860, 280, 36); g.stroke();
      txt(g, "„" + FACTS.zitat.text + "“", 540, cy + 290, { w: 600, px: 40, fam: "D", c: "#fff" }); txt(g, FACTS.zitat.name + ", Google-Bewertung", 540, cy + 380, { w: 500, px: 28, fam: "I", c: P.sub }); g.restore(); }
    sparkles(g, 540, cy - 30, u, 20, 420, P.acc2, sc.i);
  },
  ev() { const E = [[0.1, "whoosh_up", 0.3]]; for (let i = 0; i < 5; i++) E.push([0.25 + i * 0.12, "chime_up" + i, 0.22, -0.6 + i * 0.3]); E.push([1.0, "pop", 0.3]); return E; },
};

// ===== 14. Logo-Drop =====
TYPES.logo = {
  zone: "bottom", pal: "navy", bgv: 4,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc - 40; const k = outBack(seg(u, 0.08, 0.5), 1.8);
    shock(g, 540, cy, seg(u, 0.12, 1.2), "rgba(96,165,250,A)", 1000, 3);
    for (let i = 0; i < 40; i++) { const a = rnd(i + sc.i) * 7, v = 300 + rnd(i * 3) * 900, kk = out3(seg(u, 0.12, 1.4)); circle(g, 540 + Math.cos(a) * v * kk, cy + Math.sin(a) * v * kk, 3 + rnd(i) * 5, `rgba(255,255,255,${0.8 * (1 - kk)})`); }
    if (k > 0) { g.save(); g.translate(540, cy - 60); g.scale(k, k); shadow(g, 80, 0, "rgba(59,130,246,0.7)"); g.drawImage(logoImg(), -170, -170, 340, 340); noShadow(g); g.restore(); }
    const tk = out3(seg(u, 0.4, 0.9)); if (tk > 0) { g.save(); g.globalAlpha = tk; txt(g, "MIHAJLO SYSTEMS", 540, cy + 200, { w: 300, px: 78, c: "#fff", ls: lerp(40, 14, tk) });
      if (p.tagline) txt(g, p.tagline, 540, cy + 290, { w: 500, px: 34, fam: "I", c: P.sub, ls: 3 }); g.restore(); }
    sparkles(g, 540, cy - 60, u, 14, 300, "#fff", 9);
  },
  ev() { return [[0.0, "riser_short", 0.4], [0.12, "boom", 1.0], [0.14, "shimmer", 0.35], [0.5, "shimmer_hi", 0.25]]; },
  drop: true,
};

// ===== 15. Aufruf: Kommentar-Stichwort =====
TYPES.cta = {
  zone: "top", pal: "violet", bgv: 0,
  times(d, p) { const kw = (p.keyword || "WEBSITE").toUpperCase(); const t0 = 0.35, t1 = t0 + Math.min(0.9, kw.length * 0.09); return { kw, t0, t1, send: t1 + 0.25 }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc - 80; const { kw, t0, t1, send } = this.times(d, p);
    const intro = out3(seg(u, 0, 0.35)); g.save(); g.translate(0, (1 - intro) * 200); g.globalAlpha = intro;
    // Kommentarfeld
    const fy = cy + 40; shadow(g, 40, 14, "rgba(0,0,0,0.35)"); fillRR(g, 90, fy - 70, 900, 140, 70, "#fff"); noShadow(g);
    const av = g.createLinearGradient(110, fy - 50, 210, fy + 50); av.addColorStop(0, "#f59e0b"); av.addColorStop(0.5, "#ec4899"); av.addColorStop(1, "#8b5cf6"); circle(g, 160, fy, 48, av); circle(g, 160, fy, 40, "#fff"); circle(g, 160, fy - 8, 14, "#cbd5e1"); g.fillStyle = "#cbd5e1"; g.beginPath(); g.ellipse(160, fy + 26, 24, 14, 0, Math.PI, 0); g.fill();
    const n = Math.floor(kw.length * seg(u, t0, t1)); const typed = kw.slice(0, n); const sent = u >= send;
    txt(g, sent ? "Kommentieren …" : (typed || "Kommentieren …"), 240, fy + 2, { w: typed && !sent ? 800 : 500, px: 44, fam: "I", c: typed && !sent ? "#0b1220" : "#9ca3af", al: "left" });
    const sk = 1 - 0.15 * Math.sin(Math.PI * seg(u, send - 0.12, send + 0.05)); g.save(); g.translate(905, fy); g.scale(sk, sk); circle(g, 0, 0, 46, n > 0 ? "#3b82f6" : "#cbd5e1");
    g.fillStyle = "#fff"; g.beginPath(); g.moveTo(-18, -20); g.lineTo(24, 0); g.lineTo(-18, 20); g.lineTo(-10, 0); g.closePath(); g.fill(); g.restore();
    // gesendeter Kommentar fliegt nach oben
    if (sent) { const k = out3(seg(u, send, send + 0.45)); const by = lerp(fy - 30, cy - 330, k); g.save(); g.globalAlpha = cl(k * 3);
      shadow(g, 40, 14, "rgba(0,0,0,0.3)"); fillRR(g, 170, by - 85, 740, 170, 40, "#fff"); noShadow(g); circle(g, 250, by, 44, av);
      txt(g, "ihr_betrieb", 320, by - 30, { w: 700, px: 30, fam: "I", c: "#6b7280", al: "left" }); txt(g, kw, 320, by + 22, { w: 900, px: 64, c: "#0b1220", al: "left" });
      const hk = outBack(seg(u, send + 0.4, send + 0.65), 3); if (hk > 0) { g.save(); g.translate(850, by); g.scale(hk, hk); heart(g, 0, 0, 34, "#ef4444"); g.restore(); }
      g.restore();
      for (let i = 0; i < 8; i++) { const hk2 = seg(u, send + 0.45 + i * 0.07, send + 1.6 + i * 0.07); if (hk2 <= 0 || hk2 >= 1) continue; g.globalAlpha = 1 - hk2; heart(g, 850 + Math.sin(hk2 * 6 + i) * 40 - i * 8, by - hk2 * 500, 18 + (i % 3) * 6, ["#ef4444", "#f472b6", "#fb7185"][i % 3]); g.globalAlpha = 1; } }
    g.restore();
    const pk = outBack(seg(u, send + 0.5, send + 0.8), 1.8); if (pk > 0) { const bob = Math.sin(u * 5) * 6; g.save(); g.translate(540, cy + 300 + bob); g.scale(pk, pk);
      const label = p.button || "Kostenloses Erstgespräch"; const px = fitPx(g, label, 760, 46, 800); shadow(g, 40, 14, hexA(P.acc, 0.6)); fillRR(g, -420, -62, 840, 124, 62, P.acc); noShadow(g); txt(g, label, 0, 2, { w: 800, px, c: "#fff" }); g.restore(); }
    const lk = out3(seg(u, send + 0.8, send + 1.2)); if (lk > 0) { g.save(); g.globalAlpha = lk; g.drawImage(logoImg(), 540 - 260, cy + 470, 80, 80); txt(g, FACTS.url, 540 - 160, cy + 512, { w: 700, px: 36, fam: "I", c: "#fff", al: "left" }); g.restore(); }
  },
  ev(d, p) { const { kw, t0, t1, send } = this.times(d, p); const E = [[0, "whoosh_up", 0.4]]; for (let i = 0; i < kw.length; i++) E.push([t0 + (t1 - t0) * i / kw.length, "key", 0.32, 0.1]);
    E.push([send - 0.05, "click", 0.7]); E.push([send, "whoosh_up", 0.45]); E.push([send + 0.42, "pop", 0.4]); E.push([send + 0.5, "chime", 0.25]); E.push([send + 0.55, "pop", 0.35]); return E; },
};
function heart(g, x, y, s, c) { g.fillStyle = c; g.beginPath(); g.moveTo(x, y + s * 0.9); g.bezierCurveTo(x - s * 1.6, y - s * 0.1, x - s * 0.8, y - s * 1.3, x, y - s * 0.45); g.bezierCurveTo(x + s * 0.8, y - s * 1.3, x + s * 1.6, y - s * 0.1, x, y + s * 0.9); g.fill(); }

// ===== 16. Cursor klickt Button =====
TYPES.cursor_click = {
  zone: "top", pal: "offwhite", bgv: 2,
  times(d) { const c = Math.min(d * 0.55, 1.1); return { c }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc; const { c } = this.times(d); const pressed = seg(u, c - 0.05, c + 0.1); const done = u > c + 0.15;
    const label = done ? (p.done || "Anfrage gesendet") : (p.button || "Jetzt anfragen"); const intro = outBack(seg(u, 0, 0.35), 1.6); const bs = intro * (1 - 0.08 * Math.sin(Math.PI * pressed));
    g.save(); g.translate(540, cy); g.scale(bs, bs); shadow(g, 60, 24, done ? "rgba(22,163,74,0.45)" : hexA(P.acc, 0.45)); fillRR(g, -380, -100, 760, 200, 100, done ? "#16a34a" : P.acc); noShadow(g);
    const px = fitPx(g, label, 600, 60, 800); txt(g, label, done ? 40 : 0, 2, { w: 800, px, c: "#fff" }); if (done) check(g, -250 + 0 * px, 0, 60, out3(seg(u, c + 0.15, c + 0.45)), "#fff", 12); g.restore();
    if (u > c) { const rk = seg(u, c, c + 0.6); ring(g, 540 + 40, cy + 20, 60 + rk * 300, 10 * (1 - rk), hexA(P.acc, 0.6 * (1 - rk))); }
    confetti(g, 540, cy, u - c - 0.05, 90, undefined, 900, sc.i * 31);
    const mk = inOut(seg(u, 0.1, c - 0.05)); const mx = lerp(900, 580, mk) + Math.sin(mk * Math.PI) * 60, my = lerp(cy + 600, cy + 20, mk); cursor(g, mx, my, 1.5, pressed > 0 && pressed < 1 ? 1 : 0);
  },
  ev(d) { const { c } = this.times(d); return [[0.1, "whoosh_up", 0.25], [c, "click", 0.9], [c + 0.05, "pop", 0.4], [c + 0.15, "chime", 0.3], [c + 0.2, "shimmer", 0.25]]; },
};

// ===== 17. Balken wachsen =====
TYPES.bars = {
  zone: "top", pal: "sky", bgv: 1,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc; const labels = p.labels || ["Jan", "Feb", "Mär", "Apr", "Mai"]; const n = labels.length; const vals = p.values || labels.map((_, i) => 0.25 + 0.75 * Math.pow((i + 1) / n, 1.6));
    const x0 = 150, w = 780, base = cy + 380, maxH = 760; const bw = w / n * 0.62;
    g.strokeStyle = hexA(P.fg, 0.15); g.lineWidth = 3; g.beginPath(); g.moveTo(x0 - 20, base); g.lineTo(x0 + w + 20, base); g.stroke();
    const pts = [];
    for (let i = 0; i < n; i++) { const k = outBack(seg(u, 0.2 + i * 0.14, 0.6 + i * 0.14), 1.4); const bh = maxH * vals[i] * k; const bx = x0 + (i + 0.19) * (w / n);
      const gr = g.createLinearGradient(0, base - bh, 0, base); gr.addColorStop(0, i === n - 1 ? P.acc2 : P.acc); gr.addColorStop(1, hexA(i === n - 1 ? P.acc2 : P.acc, 0.6)); fillRR(g, bx, base - bh, bw, Math.max(0, bh), 18, gr);
      txt(g, labels[i], bx + bw / 2, base + 40, { w: 600, px: 30, fam: "I", c: P.sub }); pts.push([bx + bw / 2, base - bh - 30]); }
    const lk = seg(u, 0.4 + n * 0.14, 1.0 + n * 0.14); if (lk > 0) { g.strokeStyle = P.fg; g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); const m = (pts.length - 1) * lk; g.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= Math.floor(m); i++) g.lineTo(pts[i][0], pts[i][1]); const fi = Math.floor(m); if (fi < pts.length - 1) { const f = m - fi; g.lineTo(lerp(pts[fi][0], pts[fi + 1][0], f), lerp(pts[fi][1], pts[fi + 1][1], f)); } g.stroke();
      if (lk >= 1) { const [ax, ay] = pts[pts.length - 1]; g.save(); g.translate(ax, ay); g.rotate(-0.6); g.fillStyle = P.fg; g.beginPath(); g.moveTo(30, 0); g.lineTo(-14, -24); g.lineTo(-14, 24); g.closePath(); g.fill(); g.restore(); } }
    if (p.title) txt(g, p.title, 540, base - maxH - 80, { w: 700, px: 40, fam: "I", c: P.sub });
  },
  ev(d, p) { const n = (p.labels || [1, 2, 3, 4, 5]).length; const E = []; for (let i = 0; i < n; i++) E.push([0.2 + i * 0.14, "blip_up" + i, 0.25, -0.5 + i * 0.25]); E.push([0.4 + n * 0.14, "whoosh_up", 0.35]); return E; },
};

// ===== 18. Aussage: nur Typo, Text in der Mitte =====
TYPES.statement = {
  zone: "center", pal: "electric", bgv: 4,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc);
    g.save(); g.translate(540, 960); g.rotate(u * 0.25); g.strokeStyle = hexA(P.fg, 0.08); g.lineWidth = 40; for (let i = 0; i < 4; i++) { const s = 300 + i * 220 + Math.sin(u * 2 + i) * 20; g.strokeRect(-s / 2, -s / 2, s, s); g.rotate(0.3); } g.restore();
    if (p.big) { const k = out3(seg(u, 0, 0.5)); g.save(); g.globalAlpha = 0.12 * k; font(g, 900, 420); g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 6; g.strokeStyle = P.fg; g.strokeText(p.big, 540 + (1 - k) * 200, 960); g.restore(); }
  },
  ev() { return [[0.0, "thump", 0.6]]; },
};

// ===== 19. Uhr: Zeit läuft (Nacht, Feierabend, „während Sie schlafen“) =====
TYPES.clock = {
  zone: "top", pal: "violet", bgv: 2,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc; const r = 340; const from = p.from == null ? 18 : p.from, to = p.to == null ? 23 : p.to; const k = inOut(seg(u, 0.2, d - 0.3)); const hrs = lerp(from, to, k);
    shadow(g, 60, 20, "rgba(0,0,0,0.35)"); circle(g, 540, cy, r, P.dark ? "#1e1b4b" : "#fff"); noShadow(g); ring(g, 540, cy, r, 14, P.acc);
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.save(); g.translate(540 + Math.sin(a) * (r - 50), cy - Math.cos(a) * (r - 50)); g.rotate(a); fillRR(g, -5, -20, 10, i % 3 ? 26 : 44, 5, hexA(P.fg, 0.6)); g.restore(); }
    const ah = (hrs % 12) / 12 * Math.PI * 2, am = (hrs % 1) * Math.PI * 2;
    g.save(); g.translate(540, cy); g.rotate(ah); fillRR(g, -11, -190, 22, 210, 11, P.fg); g.restore(); g.save(); g.translate(540, cy); g.rotate(am); fillRR(g, -7, -280, 14, 300, 7, P.acc); g.restore(); circle(g, 540, cy, 22, P.acc);
    const hh = Math.floor(hrs) % 24, mm = Math.floor((hrs % 1) * 60); txt(g, String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0"), 540, cy + r + 110, { w: 800, px: 90, c: P.fg });
    if (p.label) txt(g, p.label, 540, cy + r + 200, { w: 500, px: 36, fam: "I", c: P.sub });
  },
  ev(d) { const E = []; for (let t = 0.2; t < d - 0.3; t += 0.25) E.push([t, "tick", 0.18, (Math.round(t * 4) % 2 ? 0.25 : -0.25)]); return E; },
};

// ===== 20. Zwei Wege: links schlecht, rechts gut =====
TYPES.versus = {
  zone: "top", pal: "offwhite", bgv: 0,
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const cy = sc.gc; const L = p.left || ["Ohne Website", "Kunde findet Sie nicht"], Rr = p.right || ["Mit Website", "Kunde ruft an"];
    const kl = out3(seg(u, 0.1, 0.45)), kr = out3(seg(u, Math.min(d * 0.45, 0.9), Math.min(d * 0.45, 0.9) + 0.35));
    const card = (x, k, lines, good, dir) => { if (k <= 0) return; g.save(); g.globalAlpha = k; g.translate(x + dir * (1 - k) * 200, cy); shadow(g, 50, 20, "rgba(0,0,0,0.2)"); fillRR(g, -230, -380, 460, 760, 40, good ? P.acc : "#e5e7eb"); noShadow(g);
      circle(g, 0, -200, 90, good ? "#fff" : "#9ca3af"); if (good) check(g, 0, -200, 70, cl(k * 1.5 - 0.3), P.acc, 16); else cross(g, 0, -200, 34, cl(k * 1.5 - 0.3), "#fff", 14);
      const px = fitPx(g, lines[0], 400, 50, 800); txt(g, lines[0], 0, -20, { w: 800, px, c: good ? "#fff" : "#374151" });
      g.font = "500 34px I"; wrapLines(g, lines[1] || "", 380).slice(0, 4).forEach((l, i) => txt(g, l, 0, 70 + i * 46, { w: 500, px: 34, fam: "I", c: good ? "rgba(255,255,255,0.9)" : "#6b7280" })); g.restore(); };
    card(285, kl, L, false, -1); card(795, kr, Rr, true, 1);
    const vk = outBack(seg(u, 0.4, 0.7), 2.5); if (vk > 0) { g.save(); g.translate(540, cy); g.scale(vk, vk); circle(g, 0, 0, 60, P.fg); txt(g, "VS", 0, 3, { w: 900, px: 44, c: P.bg[0] }); g.restore(); }
  },
  ev(d) { const r = Math.min(d * 0.45, 0.9); return [[0.1, "whoosh_side", 0.4, -0.5], [0.4, "pop", 0.4], [r, "whoosh_side", 0.4, 0.5], [r + 0.3, "chime", 0.25, 0.5]]; },
};
