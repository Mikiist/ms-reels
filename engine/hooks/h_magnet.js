// VOICE_DELAY: 0.5
// h_magnet: Riesiger roter Hufeisenmagnet knallt ab 0,00 s ins Bild (KLONK) und hängt über dem Laden der Konkurrenz.
// Kunden-Pins werden vom linken Laden quer übers Bild zum Magneten gerissen (Schlieren, Summen, Klack). Am Ende ist der linke Laden leer.
// Parameter: left ("Ihr Betrieb"), right ("Konkurrenz"), n (8, Zahl der Pins, 4 bis 10).
for (const f of ["800 100px D", "900 100px D", "700 100px I"]) document.fonts.load(f);
const MAG_IMP = 0.1, MAG_FT = 0.34, MAG_GROUND = 1262, MAG_TOP = MAG_GROUND - 285;
const MAG_HOME = [[100, 1272], [178, 1266], [255, 1274], [330, 1267], [405, 1273], [140, 1302], [292, 1304], [215, 1298], [370, 1300], [60, 1300]];
const MAG_SLOT = [[-240, -146, 0], [-246, -104, 0], [-238, -62, 0], [-238, 62, 1], [-246, 104, 1], [-240, 146, 1], [-300, -125, 0], [-300, 125, 1], [-296, -84, 0], [-296, 84, 1]];

function mag_n(p) { return Math.max(4, Math.min(10, Math.round(+p.n || 8))); }
function mag_times(d, p) {
  const n = mag_n(p), peak = Math.max(1.3, d - 0.5), last = peak - MAG_FT, first = 0.42; const st = [];
  for (let i = 0; i < n; i++) st.push(first + (last - first) * Math.pow(i / (n - 1), 0.8));
  return { n, peak, st };
}
// Magnet-Lage zur Zeit u
function mag_pose(u, peak) {
  let x = 800, y = 600, r = -0.32, sx = 1, sy = 1;
  if (u < MAG_IMP) { const k = u / MAG_IMP; y = lerp(320, 600, k * k); r = -0.32 + 0.22 * (1 - k); }
  else {
    const t = u - MAG_IMP; r += 0.13 * Math.exp(-t / 0.28) * Math.sin(t * 26); y += -26 * Math.exp(-t / 0.12) * Math.sin(t * 30);
    const sq = 0.16 * Math.exp(-t / 0.07); sy = 1 - sq; sx = 1 + sq * 0.6;
    y += Math.sin(u * 2.4) * 6;
    if (u >= peak) { const k = u - peak; r += 0.05 * Math.exp(-k / 0.15) * Math.sin(k * 40); }
  }
  return { x, y, r, sx, sy, s: 1.18 };
}
function mag_toWorld(P, lx, ly) { const c = Math.cos(P.r), s = Math.sin(P.r); const x = lx * P.s * P.sx, y = ly * P.s * P.sy; return [P.x + x * c - y * s, P.y + x * s + y * c]; }

function mag_drawMagnet(g, glow) {
  const path = (x0) => { g.beginPath(); g.moveTo(x0, -105); g.lineTo(0, -105); g.arc(0, 0, 105, -Math.PI / 2, Math.PI / 2); g.lineTo(x0, 105); };
  g.lineCap = "butt";
  shadow(g, 70, 40, "rgba(0,0,0,0.55)"); g.lineWidth = 124; g.strokeStyle = "#5e0710"; path(-142); g.stroke(); noShadow(g);
  g.lineWidth = 110; g.strokeStyle = "#c3121f"; path(-142); g.stroke();
  g.save(); g.beginPath(); g.rect(-160, -200, 400, 400); g.clip();
  g.save(); g.translate(-6, -16); g.lineWidth = 58; g.strokeStyle = "rgba(255,90,100,0.85)"; path(-142); g.stroke(); g.restore();
  g.save(); g.translate(-6, -34); g.lineWidth = 12; g.strokeStyle = "rgba(255,235,235,0.85)"; path(-142); g.stroke(); g.restore();
  g.save(); g.translate(4, 26); g.lineWidth = 26; g.strokeStyle = "rgba(60,0,8,0.45)"; path(-142); g.stroke(); g.restore();
  g.restore();
  // silberne Pole
  for (const sy of [-1, 1]) {
    const y0 = sy * 105 - 62, gr = g.createLinearGradient(0, y0, 0, y0 + 124);
    [[0, "#5d6470"], [0.15, "#f6f8fb"], [0.35, "#b9c0ca"], [0.6, "#7d8590"], [0.8, "#dfe4ea"], [1, "#575e69"]].forEach(([o, c]) => gr.addColorStop(o, c));
    g.fillStyle = gr; g.fillRect(-222, y0, 82, 124);
    g.fillStyle = "rgba(255,255,255,0.65)"; g.fillRect(-222, y0, 6, 124);
    g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(-146, y0, 6, 124);
    if (glow > 0) { g.fillStyle = `rgba(150,220,255,${0.5 * glow})`; g.fillRect(-226, y0, 8, 124); }
  }
}

function mag_pin(g, s, hue) {
  g.save(); g.scale(s, s);
  g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-10, -18, -32, -34, -32, -58); g.arc(0, -58, 32, Math.PI, 0); g.bezierCurveTo(32, -34, 10, -18, 0, 0); g.closePath();
  const gr = g.createLinearGradient(-32, -90, 32, 0); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.6, "#e3eaf7"); gr.addColorStop(1, "#aab6cc");
  shadow(g, 14, 6, "rgba(0,0,0,0.45)"); g.fillStyle = gr; g.fill(); noShadow(g);
  circle(g, 0, -58, 23, hue);
  circle(g, 0, -66, 7.5, "#ffffff"); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(0, -45, 12, Math.PI, 0); g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(-14, -74, 7, 4, -0.6, 0, 7); g.fill();
  g.restore();
}

function mag_shop(g, x, w, label, awn, light) {
  const top = MAG_TOP, gy = MAG_GROUND;
  // Fassade
  const fg = g.createLinearGradient(0, top, 0, gy); fg.addColorStop(0, "#2a2f45"); fg.addColorStop(1, "#1a1d2c");
  shadow(g, 40, 18, "rgba(0,0,0,0.5)"); g.fillStyle = fg; g.fillRect(x, top, w, gy - top); noShadow(g);
  g.fillStyle = "rgba(255,255,255,0.06)"; g.fillRect(x, top, w, 6);
  // Schild
  fillRR(g, x + 16, top - 92, w - 32, 78, 14, "#0f1220"); g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 3; rr(g, x + 16, top - 92, w - 32, 78, 14); g.stroke();
  const px = fitPx(g, label, w - 70, 50, 800); txt(g, label, x + w / 2, top - 52, { w: 800, px, c: "#ffffff" });
  // Markise
  const ay = top + 18, ah = 64, n = 8, sw = w / n;
  for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? "#f4f1ea" : awn; g.beginPath(); g.moveTo(x + i * sw, ay); g.lineTo(x + (i + 1) * sw, ay); g.lineTo(x + (i + 1) * sw + 4, ay + ah); g.arc(x + (i + 0.5) * sw + 2, ay + ah, sw / 2 + 2, 0, Math.PI); g.closePath(); g.fill(); }
  const sh = g.createLinearGradient(0, ay, 0, ay + ah + 20); sh.addColorStop(0, "rgba(255,255,255,0.18)"); sh.addColorStop(1, "rgba(0,0,0,0.25)"); g.fillStyle = sh; g.fillRect(x, ay, w, ah + 16);
  // Fenster + Tür (Licht wird dynamisch darübergelegt)
  fillRR(g, x + 22, top + 110, w * 0.52, 150, 8, "#0b0e19"); fillRR(g, x + w * 0.62, top + 110, w * 0.3, gy - top - 110, 8, "#0b0e19");
  g.strokeStyle = "#3a4058"; g.lineWidth = 6; rr(g, x + 22, top + 110, w * 0.52, 150, 8); g.stroke(); rr(g, x + w * 0.62, top + 110, w * 0.3, gy - top - 110, 8); g.stroke();
}

function mag_bgImg(p) {
  const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#070818"); sky.addColorStop(0.35, "#161a46"); sky.addColorStop(0.58, "#3a2266"); sky.addColorStop(0.62, "#141428"); sky.addColorStop(1, "#05060c");
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) circle(g, rnd(i * 3.3) * W, 300 + rnd(i * 7.7) * 600, 1 + rnd(i) * 2, `rgba(255,255,255,${0.2 + 0.5 * rnd(i * 2)})`);
  // Skyline
  for (let k = 0; k < 2; k++) { let x = -20; const col = k ? "#11132a" : "#0c0d1f";
    while (x < W) { const w = 60 + rnd(x * 0.13 + k * 9) * 110, h = 140 + rnd(x * 0.31 + k) * (k ? 220 : 340); g.fillStyle = col; g.fillRect(x, MAG_GROUND - 180 - h + k * 80, w, h + 200);
      for (let wy = MAG_GROUND - 160 - h + k * 80; wy < MAG_GROUND - 120; wy += 30) for (let wx = x + 10; wx < x + w - 14; wx += 22) if (rnd(wx * 0.7 + wy * 0.3 + k) > 0.72) { g.fillStyle = `rgba(255,${190 + (rnd(wx) * 50 | 0)},120,${k ? 0.35 : 0.22})`; g.fillRect(wx, wy, 9, 13); g.fillStyle = col; }
      x += w + 6; } }
  // Straße
  const st = g.createLinearGradient(0, MAG_GROUND, 0, H); st.addColorStop(0, "#22253a"); st.addColorStop(0.08, "#14162a"); st.addColorStop(1, "#04050a"); g.fillStyle = st; g.fillRect(0, MAG_GROUND, W, H - MAG_GROUND);
  g.fillStyle = "#30344d"; g.fillRect(0, MAG_GROUND, W, 10);
  g.strokeStyle = "rgba(255,255,255,0.05)"; g.lineWidth = 3; for (let i = -8; i <= 8; i++) { g.beginPath(); g.moveTo(540 + i * 90, MAG_GROUND + 10); g.lineTo(540 + i * 380, H); g.stroke(); }
  mag_shop(g, 50, 380, p.left || "Ihr Betrieb", "#2f6fe0");
  mag_shop(g, 650, 380, p.right || "Konkurrenz", "#d0202e");
  return c;
}

TYPES.h_magnet = {
  zone: "bottom", pal: "violet", bgv: 0, coverT: 1.35,
  prep(sc, p) { sc.st.fok = document.fonts.check("800 100px D"); sc.st.bg = mag_bgImg(p); },
  draw(g, u, d, p, sc, P) {
    if (!sc.st.fok && document.fonts.check("800 100px D")) this.prep(sc, p);
    const { n, peak, st } = mag_times(d, p);
    const M = mag_pose(u, peak); const field = u < MAG_IMP ? 0 : out3(seg(u, MAG_IMP, MAG_IMP + 0.3));
    const left = st.filter((s) => u >= s + MAG_FT).length, gone = st.filter((s) => u >= s).length;
    // Kamera
    let shx = 0, shy = 0; const hit = (t0, a) => { if (u >= t0 && u < t0 + 0.4) { const k = a * Math.exp(-(u - t0) / 0.08); shx += Math.sin(u * 91) * k; shy += Math.cos(u * 77) * k; } };
    hit(MAG_IMP, 26); hit(peak, 10);
    const z = 1.08 - 0.08 * outExpo(seg(u, 0, 0.5)) + 0.035 * seg(u, 0.5, d);
    g.save(); g.translate(540 + shx, 900 + shy); g.scale(z, z); g.translate(-540, -900);
    g.drawImage(sc.st.bg, 0, 0);
    // Fensterlicht: links wird es dunkler, rechts heller
    let lL = 1 - 0.55 * left / n; if (u >= peak) { const k = u - peak; lL = k < 0.06 ? 0.05 : k < 0.12 ? 0.35 : k < 0.17 ? 0.05 : 0.08; }
    const lR = 0.55 + 0.45 * left / n;
    const win = (x, w, a) => { if (a <= 0) return; const T0 = MAG_TOP; g.save(); g.globalAlpha = a; const wg = g.createLinearGradient(0, T0 + 110, 0, MAG_GROUND); wg.addColorStop(0, "#ffd88a"); wg.addColorStop(1, "#ff9e3d");
      g.fillStyle = wg; rr(g, x + 25, T0 + 113, w * 0.52 - 6, 144, 6); g.fill(); rr(g, x + w * 0.62 + 3, T0 + 113, w * 0.3 - 6, MAG_GROUND - T0 - 116, 6); g.fill();
      g.globalCompositeOperation = "lighter"; const lg = g.createRadialGradient(x + 190, T0 + 185, 10, x + 190, T0 + 215, 330); lg.addColorStop(0, "rgba(255,190,90,0.35)"); lg.addColorStop(1, "rgba(255,160,60,0)"); g.fillStyle = lg; g.fillRect(x - 150, T0 - 55, 680, 560); g.restore(); };
    win(50, 380, lL); win(650, 380, lR);
    // Magnetfeld: Bögen ziehen sich zum Magneten zusammen, Feldlinien mit Fluss
    const [p1x, p1y] = mag_toWorld(M, -222, -105), [p2x, p2y] = mag_toWorld(M, -222, 105); const mx = (p1x + p2x) / 2, my = (p1y + p2y) / 2;
    const dir = M.r + Math.PI;
    if (field > 0) {
      g.save(); g.globalCompositeOperation = "lighter";
      for (let k = 0; k < 6; k++) { const ph = ((u * 1.3 + k / 6) % 1); const rad = lerp(820, 60, ph); const a = field * Math.sin(ph * Math.PI) * 0.5;
        g.strokeStyle = `rgba(120,200,255,${a})`; g.lineWidth = 3 + 8 * (1 - ph); g.beginPath(); g.arc(mx, my, rad, dir - 0.55, dir + 0.55); g.stroke(); }
      for (let k = 0; k < 7; k++) { const tx = 120 + k * 50, ty = MAG_GROUND - 30 - (k % 3) * 40; const sy = k < 4 ? [p1x, p1y] : [p2x, p2y];
        g.setLineDash([26, 22]); g.lineDashOffset = u * 260; g.strokeStyle = `rgba(160,220,255,${0.32 * field})`; g.lineWidth = 3;
        g.beginPath(); g.moveTo(tx, ty); g.quadraticCurveTo(lerp(tx, sy[0], 0.5) - 60 + k * 10, lerp(ty, sy[1], 0.5) - 160 + k * 40, sy[0], sy[1]); g.stroke(); }
      g.setLineDash([]);
      const cg = g.createRadialGradient(mx, my, 10, mx, my, 360); cg.addColorStop(0, `rgba(120,200,255,${0.35 * field})`); cg.addColorStop(1, "rgba(120,200,255,0)"); g.fillStyle = cg; g.fillRect(mx - 360, my - 360, 720, 720);
      g.restore();
    }
    // Pins
    const hues = ["#2563eb", "#0ea5e9", "#7c3aed", "#2563eb", "#0891b2", "#4f46e5", "#2563eb", "#0ea5e9", "#7c3aed", "#0891b2"];
    const pins = [];
    for (let i = 0; i < n; i++) {
      const [hx, hy] = MAG_HOME[i], sl = MAG_SLOT[i]; const s0 = st[i]; const sc0 = hy > 1290 ? 1.1 : 1;
      const [tx, ty] = mag_toWorld(M, sl[0], sl[1]); const [px_, py_] = mag_toWorld(M, -222, sl[2] ? 105 : -105);
      const rotT = Math.atan2(ty - py_, tx - px_) - Math.PI / 2 + Math.PI;  // Spitze zeigt zum Pol
      let x, y, rot = 0, sxx = 1, syy = 1, k = 0;
      if (u < s0 - 0.16) { x = hx; y = hy - Math.abs(Math.sin(u * 5 + i * 1.3)) * 6; rot = Math.sin(u * 3 + i) * 0.05 + 0.08 * field; }
      else if (u < s0) { const a = seg(u, s0 - 0.16, s0); x = hx + Math.sin(u * 90 + i) * 4 * a; y = hy + 4 * a; rot = 0.25 * a; syy = 1 - 0.18 * a; sxx = 1 + 0.12 * a; }
      else {
        k = seg(u, s0, s0 + MAG_FT); const e = Math.pow(k, 2.1);
        const cx = lerp(hx, tx, 0.45) - 40, cy = Math.min(hy, ty) - 220;
        const B = (q) => [(1 - q) * (1 - q) * hx + 2 * (1 - q) * q * cx + q * q * tx, (1 - q) * (1 - q) * hy + 2 * (1 - q) * q * cy + q * q * ty];
        [x, y] = B(e); if (k >= 1) { x = tx; y = ty; }
        rot = lerp(0.25, rotT, out3(k)); const sp = k < 1 ? Math.sin(k * Math.PI) : 0; syy = 1 + 0.55 * sp; sxx = 1 - 0.25 * sp;
        if (k >= 1) { const a = u - s0 - MAG_FT; const q = 0.3 * Math.exp(-a / 0.06); syy = 1 - q; sxx = 1 + q * 0.7; }
        // Schliere
        if (k > 0 && k < 1) { const pts = []; for (let j = 0; j <= 8; j++) pts.push(B(Math.pow(Math.max(0, k - j * 0.045), 2.1)));
          g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
          for (let j = 0; j < 8; j++) { g.strokeStyle = `rgba(140,200,255,${0.5 * (1 - j / 8)})`; g.lineWidth = 34 * (1 - j / 8) * sc0; g.beginPath(); g.moveTo(pts[j][0], pts[j][1] - 40); g.lineTo(pts[j + 1][0], pts[j + 1][1] - 40); g.stroke(); }
          g.restore(); }
      }
      pins.push({ x, y, rot, sxx, syy, sc0, i, k, arrived: k >= 1, at: s0 + MAG_FT });
    }
    // Schatten der wartenden Pins
    for (const q of pins) if (q.k === 0) { g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(q.x, q.y + 2, 22, 6, 0, 0, 7); g.fill(); }
    const drawPin = (q) => { g.save(); g.translate(q.x, q.y); g.rotate(q.rot); g.scale(q.sxx, q.syy); mag_pin(g, 1.2 * q.sc0, hues[q.i]); g.restore(); };
    for (const q of pins) if (!q.arrived) drawPin(q);
    // Magnet (mit Bewegungsunschärfe beim Fallen)
    const drawM = (yo, a) => { g.save(); g.globalAlpha = a; g.translate(M.x, M.y + yo); g.rotate(M.r); g.scale(M.s * M.sx, M.s * M.sy); mag_drawMagnet(g, field); g.restore(); };
    if (u < MAG_IMP) for (let k = 5; k >= 1; k--) drawM(-k * 85, 0.2 - k * 0.025);
    for (const q of pins) if (q.arrived) drawPin(q);
    drawM(0, 1);
    g.globalAlpha = 1;
    // Funkenbogen zwischen den Polen
    if (field > 0) {
      const fr = Math.floor(u * 15); g.save(); g.globalCompositeOperation = "lighter"; g.lineJoin = "round";
      for (let b = 0; b < 2; b++) { g.strokeStyle = b ? "rgba(255,255,255,0.9)" : `rgba(110,190,255,${0.6 * field})`; g.lineWidth = b ? 3 : 11; g.beginPath();
        for (let j = 0; j <= 10; j++) { const q = j / 10, x = lerp(p1x, p2x, q), y = lerp(p1y, p2y, q), off = j % 10 ? (rnd(fr * 13 + j) - 0.5) * 70 : 0; const nx = -(p2y - p1y), ny = p2x - p1x, L = Math.hypot(nx, ny);
          const xx = x + nx / L * off - 18 * Math.cos(dir), yy = y + ny / L * off - 18 * Math.sin(dir); j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }
        g.stroke(); }
      g.restore();
    }
    // Aufprall: Schockwelle, Funken
    if (u >= MAG_IMP) {
      const t = u - MAG_IMP; shock(g, M.x, M.y, t / 0.6, "rgba(255,255,255,A)", 900, 2);
      if (t < 0.7) for (let i = 0; i < 26; i++) { const a = rnd(i * 4.1) * Math.PI * 2, v = 500 + rnd(i * 2.9) * 900; const x = M.x + Math.cos(a) * v * t, y = M.y + Math.sin(a) * v * t + 1400 * t * t;
        g.strokeStyle = `rgba(255,${200 + 55 * rnd(i) | 0},140,${1 - t / 0.7})`; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x - Math.cos(a) * 30, y - Math.sin(a) * 30 - 40 * t); g.stroke(); }
    }
    // Ankommen: kleiner Blitz an jedem Pin
    for (const q of pins) if (q.arrived && u - q.at < 0.25) { const t = (u - q.at) / 0.25; g.save(); g.globalCompositeOperation = "lighter"; ring(g, q.x, q.y, 20 + 90 * out3(t), 8 * (1 - t), `rgba(170,225,255,${1 - t})`); g.restore(); }
    g.restore();
    if (u < MAG_IMP + 0.12 && u >= MAG_IMP) { g.fillStyle = `rgba(255,255,255,${0.5 * (1 - (u - MAG_IMP) / 0.12)})`; g.fillRect(0, 0, W, H); }
    const vg = g.createRadialGradient(540, 900, 420, 540, 900, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,8,0.55)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  },
  ev(d, p) {
    const { n, peak, st } = mag_times(d, p);
    const E = [[0, "magnet_drop", 0.8, 0.3], [MAG_IMP - 0.01, "magnet_klonk", 1.0, 0.25]];
    for (let t = MAG_IMP + 0.05; t < d; t += 1.2) E.push([t, "magnet_hum", 0.5, 0.2]);
    st.forEach((s, i) => { E.push([s - 0.02, "magnet_zip", 0.55, -0.55]); E.push([s + MAG_FT, i === n - 1 ? "magnet_klack_big" : "magnet_klack", 0.75, 0.3]); });
    E.push([peak + 0.02, "magnet_off", 0.6, -0.6]);
    return E;
  },
};
