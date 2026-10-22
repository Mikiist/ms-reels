// VOICE_DELAY: 0.5
// h_slot: Spielautomat (Chrom, laufende Lichter). Hebel bei 0, drei Walzen drehen, stoppen nacheinander,
// alle drei Reihen zeigen gleiche Symbole, JACKPOT mit Münzregen.
// Parameter: symbols (3 Einträge, oben/mitte/unten; Schlüssel web, stern, telefon, glocke, herz, diamant, euro oder kurzer Text), jackpot (Text, Standard „JACKPOT“)
for (const f of ["700 30px I", "900 30px D", "800 30px D"]) document.fonts.load(f);
const HS_REEL = { x: [175, 407, 639], w: 206, top: 650, bot: 1030, cy: 840, rowH: 136, Rc: 300 };
const HS_SYMS = ["web", "stern", "telefon", "glocke", "herz", "diamant", "euro"];
function hs_times(d) {
  const tc = Math.max(1.3, Math.min(d - 0.6, 2.9)); const ts = 0.2;
  return { ts, tc, stops: [ts + (tc - ts) * 0.42, ts + (tc - ts) * 0.66, tc], N: 12 };
}
function hs_symbol(g, key, cx, cy, s) { // zeichnet ein Symbol (s = Radius ~ 60)
  g.save(); g.translate(cx, cy);
  const gloss = (r) => { const gr = g.createLinearGradient(0, -r, 0, 0); gr.addColorStop(0, "rgba(255,255,255,0.7)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.beginPath(); g.ellipse(0, -r * 0.45, r * 0.62, r * 0.38, 0, 0, 7); g.fill(); };
  if (key === "web") {
    let gr = g.createRadialGradient(-s * 0.35, -s * 0.4, s * 0.1, 0, 0, s); gr.addColorStop(0, "#9fdcff"); gr.addColorStop(0.45, "#2f8cf0"); gr.addColorStop(1, "#0b2f86");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, s, 0, 7); g.fill();
    g.save(); g.beginPath(); g.arc(0, 0, s, 0, 7); g.clip(); g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = s * 0.07;
    for (const k of [0.35, 0.72]) { g.beginPath(); g.ellipse(0, 0, s * k, s, 0, 0, 7); g.stroke(); }
    g.beginPath(); g.moveTo(0, -s); g.lineTo(0, s); g.stroke();
    for (const k of [-0.5, 0, 0.5]) { const yy = k * s; const w = Math.sqrt(1 - k * k) * s; g.beginPath(); g.moveTo(-w, yy); g.lineTo(w, yy); g.stroke(); }
    g.restore(); g.strokeStyle = "#0a2668"; g.lineWidth = s * 0.06; g.beginPath(); g.arc(0, 0, s, 0, 7); g.stroke(); gloss(s);
  } else if (key === "stern") {
    const path = (r, k) => { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * k : r; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); };
    let gr = g.createLinearGradient(0, -s, 0, s); gr.addColorStop(0, "#fff1a6"); gr.addColorStop(0.5, "#fbbf24"); gr.addColorStop(1, "#b45309");
    path(s * 1.12, 0.46); g.fillStyle = gr; g.fill(); g.lineJoin = "round"; g.strokeStyle = "#8a3f05"; g.lineWidth = s * 0.07; g.stroke();
    path(s * 0.66, 0.46); g.fillStyle = "rgba(255,250,210,0.55)"; g.fill();
  } else if (key === "telefon") {
    let gr = g.createRadialGradient(-s * 0.35, -s * 0.4, s * 0.1, 0, 0, s); gr.addColorStop(0, "#9af0b8"); gr.addColorStop(0.5, "#22c55e"); gr.addColorStop(1, "#0d6a33");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, s, 0, 7); g.fill(); g.strokeStyle = "#0b4f27"; g.lineWidth = s * 0.06; g.stroke();
    // Hörer (einfaches Telefon-Symbol, 24er-Raster)
    g.save(); const k = s * 0.078; g.translate(-12.5 * k, -12 * k); g.scale(k, k); g.fillStyle = "#ffffff"; g.shadowColor = "rgba(0,60,20,0.5)"; g.shadowBlur = 6; g.shadowOffsetY = 2;
    g.fill(new Path2D("M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z")); g.restore();
    g.restore(); gloss(s);
  } else if (key === "glocke") {
    let gr = g.createLinearGradient(-s, 0, s, 0); gr.addColorStop(0, "#a16207"); gr.addColorStop(0.35, "#fde68a"); gr.addColorStop(1, "#92400e");
    g.fillStyle = gr; g.beginPath(); g.moveTo(-s * 0.85, s * 0.6); g.quadraticCurveTo(-s * 0.6, s * 0.4, -s * 0.6, -s * 0.1); g.quadraticCurveTo(-s * 0.55, -s * 0.85, 0, -s * 0.88); g.quadraticCurveTo(s * 0.55, -s * 0.85, s * 0.6, -s * 0.1); g.quadraticCurveTo(s * 0.6, s * 0.4, s * 0.85, s * 0.6); g.closePath(); g.fill();
    g.strokeStyle = "#7c2d12"; g.lineWidth = s * 0.06; g.stroke(); circle(g, 0, s * 0.74, s * 0.17, "#fbbf24"); circle(g, 0, -s * 0.95, s * 0.12, "#fbbf24");
  } else if (key === "herz") {
    let gr = g.createRadialGradient(-s * 0.3, -s * 0.3, s * 0.1, 0, 0, s * 1.1); gr.addColorStop(0, "#ff9aa8"); gr.addColorStop(0.5, "#ef233c"); gr.addColorStop(1, "#7a0718");
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, s * 0.85); g.bezierCurveTo(-s * 1.3, 0, -s * 0.8, -s * 1.1, 0, -s * 0.45); g.bezierCurveTo(s * 0.8, -s * 1.1, s * 1.3, 0, 0, s * 0.85); g.fill(); g.strokeStyle = "#5c0613"; g.lineWidth = s * 0.06; g.stroke();
  } else if (key === "diamant") {
    g.lineJoin = "round"; const pts = [[-s, -s * 0.3], [-s * 0.55, -s * 0.8], [s * 0.55, -s * 0.8], [s, -s * 0.3], [0, s * 0.95]];
    g.beginPath(); pts.forEach((q) => g.lineTo(q[0], q[1])); g.closePath(); let gr = g.createLinearGradient(-s, -s, s, s); gr.addColorStop(0, "#cffafe"); gr.addColorStop(0.5, "#22d3ee"); gr.addColorStop(1, "#0e7490"); g.fillStyle = gr; g.fill();
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = s * 0.04; g.beginPath(); g.moveTo(-s, -s * 0.3); g.lineTo(s, -s * 0.3); g.moveTo(-s * 0.3, -s * 0.3); g.lineTo(0, s * 0.95); g.lineTo(s * 0.3, -s * 0.3); g.moveTo(-s * 0.55, -s * 0.8); g.lineTo(-s * 0.3, -s * 0.3); g.lineTo(0, -s * 0.8); g.lineTo(s * 0.3, -s * 0.3); g.lineTo(s * 0.55, -s * 0.8); g.stroke();
    g.strokeStyle = "#155e75"; g.lineWidth = s * 0.06; g.beginPath(); pts.forEach((q) => g.lineTo(q[0], q[1])); g.closePath(); g.stroke();
  } else if (key === "euro") {
    let gr = g.createRadialGradient(-s * 0.3, -s * 0.35, s * 0.1, 0, 0, s); gr.addColorStop(0, "#fff3c0"); gr.addColorStop(0.45, "#f2c14e"); gr.addColorStop(1, "#8a5a12");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, s, 0, 7); g.fill(); g.strokeStyle = "#7a4a0c"; g.lineWidth = s * 0.08; g.beginPath(); g.arc(0, 0, s * 0.8, 0, 7); g.stroke();
    txt(g, "€", 0, s * 0.05, { w: 900, px: s * 1.05, c: "#7a4a0c" });
  } else {
    const t = String(key); const px = fitPx(g, t, s * 2.6, s * 1.5, 900);
    txt(g, t, 3, 5, { w: 900, px, c: "rgba(0,0,0,0.35)" }); txt(g, t, 0, 0, { w: 900, px, c: "#d61f3a" });
  }
  g.restore();
}
function hs_coin(c) {
  const g = c.getContext("2d"); const r = c.width / 2;
  const gr = g.createRadialGradient(r * 0.7, r * 0.6, 2, r, r, r); gr.addColorStop(0, "#fff6cc"); gr.addColorStop(0.4, "#f5c443"); gr.addColorStop(1, "#8a5a12");
  g.fillStyle = gr; g.beginPath(); g.arc(r, r, r - 1, 0, 7); g.fill(); g.strokeStyle = "rgba(110,70,10,0.8)"; g.lineWidth = r * 0.1; g.beginPath(); g.arc(r, r, r * 0.78, 0, 7); g.stroke();
  txt(g, "€", r, r * 1.05, { w: 900, px: r, c: "rgba(120,75,10,0.85)" });
}
TYPES.h_slot = {
  zone: "bottom", pal: "violet", bgv: 0, coverT: 3.15,
  prep(sc, p) {
    const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
    const sy = (p.symbols && p.symbols.length ? p.symbols : ["web", "stern", "telefon"]).slice(0, 3); while (sy.length < 3) sy.push(sy[sy.length - 1]);
    sc.st.sy = sy;
    // Symbol-Kacheln: scharf und mit senkrechter Bewegungsunschärfe
    const keys = [...new Set([...sy, ...HS_SYMS])]; sc.st.tile = {}; sc.st.blur = {};
    for (const k of keys) {
      const c = mk(200, 160); hs_symbol(c.getContext("2d"), k, 100, 80, 52); sc.st.tile[k] = c;
      const b = mk(200, 260); const bg = b.getContext("2d"); for (let i = 0; i < 18; i++) { bg.globalAlpha = 0.16; bg.drawImage(c, 0, 50 + (i / 17 - 0.5) * 110); } sc.st.blur[k] = b;
    }
    // Walzenstreifen: Position 0, 1, 2 = Gewinnsymbole, Rest gemischt
    sc.st.strip = [0, 1, 2].map((r) => { const s = [sy[0], sy[1], sy[2]]; for (let i = 3; i < 12; i++) s.push(keys[Math.floor(rnd(r * 31 + i * 7.7) * keys.length)]); return s; });
    // Hintergrund: Casino-Bokeh
    const bg = mk(W, H); let g = bg.getContext("2d");
    let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#12030e"); gr.addColorStop(0.55, "#2a0a24"); gr.addColorStop(1, "#0a0208"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 60; i++) { const x = rnd(i * 3.3) * W, y = 150 + rnd(i * 5.1) * 1500, r = 14 + rnd(i * 7.7) * 60; const col = ["255,190,80", "255,60,90", "200,80,255", "255,230,160"][i % 4];
      const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(${col},${0.12 + rnd(i) * 0.18})`); rg.addColorStop(0.7, `rgba(${col},${0.06})`); rg.addColorStop(1, `rgba(${col},0)`); g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    let rg = g.createRadialGradient(540, 1330, 0, 540, 1330, 600); rg.addColorStop(0, "rgba(255,80,120,0.25)"); rg.addColorStop(1, "rgba(255,80,120,0)"); g.fillStyle = rg; g.fillRect(0, 900, W, 900);
    g.fillStyle = "rgba(0,0,0,0.65)"; g.filter = "blur(30px)"; g.beginPath(); g.ellipse(520, 1300, 470, 50, 0, 0, 7); g.fill(); g.filter = "none";
    sc.st.bg = bg;
    // Automat (statische Teile)
    const m = mk(W, H); g = m.getContext("2d");
    const chrome = (y0, y1, x0 = 0, x1 = 0) => { const c = x1 ? g.createLinearGradient(x0, 0, x1, 0) : g.createLinearGradient(0, y0, 0, y1); [["#ffffff", 0], ["#9aa3b1", 0.18], ["#f2f4f8", 0.36], ["#5b6270", 0.55], ["#d9dde5", 0.78], ["#717887", 1]].forEach(([cc, o]) => c.addColorStop(o, cc)); return c; };
    const red = (x0, x1) => { const c = g.createLinearGradient(x0, 0, x1, 0); c.addColorStop(0, "#5c0410"); c.addColorStop(0.2, "#c3142b"); c.addColorStop(0.42, "#ff5a6a"); c.addColorStop(0.55, "#d71a33"); c.addColorStop(1, "#4a030c"); return c; };
    // Krone
    g.beginPath(); g.moveTo(130, 640); g.lineTo(130, 560); g.bezierCurveTo(130, 430, 890, 430, 890, 560); g.lineTo(890, 640); g.closePath();
    g.fillStyle = red(130, 890); g.fill(); g.strokeStyle = chrome(0, 0, 130, 890); g.lineWidth = 14; g.stroke();
    fillRR(g, 190, 492, 640, 116, 22, "#14020a"); g.strokeStyle = chrome(492, 608); g.lineWidth = 8; rr(g, 190, 492, 640, 116, 22); g.stroke();
    // Körper
    rr(g, 110, 620, 800, 668, 42); g.fillStyle = red(110, 910); g.fill(); g.strokeStyle = chrome(0, 0, 110, 910); g.lineWidth = 16; g.stroke();
    // Chromleisten seitlich
    for (const x of [122, 852]) { g.fillStyle = chrome(0, 0, x, x + 46); rr(g, x, 650, 46, 610, 20); g.fill(); }
    // Fensterrahmen
    g.fillStyle = chrome(630, 1050); rr(g, 158, 630, 704, 420, 30); g.fill();
    fillRR(g, 170, 644, 680, 392, 22, "#0b0b10");
    // Walzenhintergrund (Zylinder)
    for (const x of HS_REEL.x) { const c = g.createLinearGradient(0, HS_REEL.top, 0, HS_REEL.bot); c.addColorStop(0, "#3a3540"); c.addColorStop(0.18, "#d9d4dc"); c.addColorStop(0.5, "#fffdf7"); c.addColorStop(0.82, "#d9d4dc"); c.addColorStop(1, "#3a3540"); g.fillStyle = c; g.fillRect(x, HS_REEL.top, HS_REEL.w, HS_REEL.bot - HS_REEL.top); }
    sc.st.mach = m;
    // Überlagerung der Walzen: Zylinderschatten und Glasglanz
    const ov = mk(W, H); g = ov.getContext("2d");
    for (const x of HS_REEL.x) { const c = g.createLinearGradient(0, HS_REEL.top, 0, HS_REEL.bot); c.addColorStop(0, "rgba(10,5,15,0.85)"); c.addColorStop(0.12, "rgba(10,5,15,0.25)"); c.addColorStop(0.5, "rgba(10,5,15,0)"); c.addColorStop(0.88, "rgba(10,5,15,0.25)"); c.addColorStop(1, "rgba(10,5,15,0.85)"); g.fillStyle = c; g.fillRect(x, HS_REEL.top, HS_REEL.w, HS_REEL.bot - HS_REEL.top);
      const s = g.createLinearGradient(x, 0, x + HS_REEL.w, 0); s.addColorStop(0, "rgba(0,0,0,0.35)"); s.addColorStop(0.15, "rgba(0,0,0,0)"); s.addColorStop(0.85, "rgba(0,0,0,0)"); s.addColorStop(1, "rgba(0,0,0,0.35)"); g.fillStyle = s; g.fillRect(x, HS_REEL.top, HS_REEL.w, HS_REEL.bot - HS_REEL.top); }
    g.fillStyle = "rgba(255,255,255,0.10)"; g.beginPath(); g.moveTo(170, 644); g.lineTo(520, 644); g.lineTo(330, 1036); g.lineTo(170, 1036); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255,0.05)"; g.beginPath(); g.moveTo(560, 644); g.lineTo(620, 644); g.lineTo(430, 1036); g.lineTo(370, 1036); g.closePath(); g.fill();
    // Unterteil: Chromplatte, Knöpfe, Münzschale
    g.fillStyle = chrome(1068, 1180); rr(g, 158, 1066, 704, 92, 22); g.fill();
    for (const [x, c1, c2] of [[300, "#ff8a8a", "#b10d23"], [420, "#fff0a0", "#c98a07"], [600, "#9ae6ff", "#0b6aa8"], [720, "#c3ffb0", "#1c8a2c"]]) { const rg2 = g.createRadialGradient(x - 10, 1102, 3, x, 1112, 30); rg2.addColorStop(0, c1); rg2.addColorStop(1, c2); g.fillStyle = rg2; g.beginPath(); g.ellipse(x, 1112, 42, 26, 0, 0, 7); g.fill(); g.strokeStyle = "rgba(0,0,0,0.45)"; g.lineWidth = 3; g.stroke(); }
    fillRR(g, 262, 1180, 496, 92, 30, "#0c0508"); g.strokeStyle = chrome(1180, 1272); g.lineWidth = 10; rr(g, 262, 1180, 496, 92, 30); g.stroke();
    const tr = g.createLinearGradient(0, 1185, 0, 1270); tr.addColorStop(0, "rgba(0,0,0,0.9)"); tr.addColorStop(1, "rgba(80,40,10,0.6)"); g.fillStyle = tr; rr(g, 272, 1190, 476, 72, 24); g.fill();
    // Gewinnlinien-Markierungen
    sc.st.ov = ov;
    // Glühsprite
    const glow = mk(128, 128); g = glow.getContext("2d"); rg = g.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, "rgba(255,255,255,1)"); rg.addColorStop(0.2, "rgba(255,255,255,0.6)"); rg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
    sc.st.glow = glow;
    const coin = mk(96, 96); hs_coin(coin); sc.st.coin = coin;
    // Lichter am Rand: Krone (Bogen) und Körperseiten
    const B = [];
    for (let i = 0; i <= 16; i++) { const k = i / 16; const x = lerp(150, 870, k); const y = 560 - Math.sin(k * Math.PI) * 96 + 10; B.push([x, y]); }
    for (let i = 0; i < 12; i++) B.push([890 - 12, 690 + i * 50]);
    for (let i = 11; i >= 0; i--) B.push([130 + 12, 690 + i * 50]);
    sc.st.bulbs = B;
  },
  reel(u, r, T) { // zurückgelegte Strecke s (Symbole) und Tempo
    const D = T.N * (3 + r * 2 + Math.round((T.tc - 1.3) * 2)) + [5, 8, 4][r]; const ts = T.ts + r * 0.05, te = T.stops[r];
    const a = 0.14, b = r === 2 ? 0.62 : 0.32; const Tm = Math.max(0.01, te - ts - a - b); const v = D / (a / 2 + Tm + b / 2);
    const tau = u - ts; let s, sp;
    if (tau <= 0) { s = 0; sp = 0; }
    else if (tau < a) { s = v * tau * tau / (2 * a); sp = v * tau / a; }
    else if (tau < a + Tm) { s = v * a / 2 + v * (tau - a); sp = v; }
    else if (tau < a + Tm + b) { const td = tau - a - Tm; s = v * a / 2 + v * Tm + v * (td - td * td / (2 * b)); sp = v * (1 - td / b); }
    else { const tb = tau - a - Tm - b; s = D + 0.16 * Math.sin(tb * 26) * Math.exp(-tb * 12); sp = 0; }
    return { pos: D - s, sp };
  },
  draw(g, u, d, p, sc, P) {
    const T = hs_times(d); const st = sc.st; const tc = T.tc; const win = u >= tc + 0.05;
    const kw = u - tc - 0.05;
    // Schütteln: kurz bei jedem Stopp, stark beim Jackpot
    let sh = 0; T.stops.forEach((t, i) => { if (u >= t && u < t + 0.3) sh += (i === 2 ? 20 : 7) * Math.exp(-(u - t) / 0.07); });
    if (u < 0.3) sh += 6 * Math.exp(-(u - 0.17) * (u - 0.17) / 0.002);
    const shx = Math.sin(u * 91) * sh, shy = Math.cos(u * 77) * sh;
    g.drawImage(st.bg, 0, 0);
    const zp = win ? 1 + 0.06 * Math.exp(-kw / 0.25) : 1; g.save(); g.translate(540, 860); g.scale(zp, zp); g.translate(-540, -860);
    // Lichtstrahlen beim Jackpot
    if (win) {
      const k = cl(kw / 0.3); g.save(); g.translate(520, 560); g.rotate(kw * 0.35); g.globalCompositeOperation = "lighter";
      for (let i = 0; i < 16; i++) { g.rotate(Math.PI / 8); const gr = g.createLinearGradient(0, 0, 0, -1300); gr.addColorStop(0, `rgba(255,210,120,${0.32 * k})`); gr.addColorStop(1, "rgba(255,120,80,0)"); g.fillStyle = gr; g.beginPath(); g.moveTo(-14, 0); g.lineTo(-120, -1300); g.lineTo(120, -1300); g.lineTo(14, 0); g.closePath(); g.fill(); }
      g.restore();
    }
    g.save(); g.translate(shx, shy);
    g.drawImage(st.mach, 0, 0);
    // Walzen
    const N = T.N;
    for (let r = 0; r < 3; r++) {
      const { pos, sp } = this.reel(u, r, T); const x = HS_REEL.x[r]; const bl = cl((Math.abs(sp) - 3) / 9);
      g.save(); g.beginPath(); g.rect(x, HS_REEL.top, HS_REEL.w, HS_REEL.bot - HS_REEL.top); g.clip();
      const f = Math.floor(pos);
      for (let i = f - 2; i <= f + 3; i++) {
        const lin = (i - pos - 1) * HS_REEL.rowH; const th = lin / HS_REEL.Rc; if (Math.abs(th) > 1.45) continue;
        const ys = HS_REEL.cy + HS_REEL.Rc * Math.sin(th), hs = Math.cos(th); const key = st.strip[r][((i % N) + N) % N];
        if (bl < 0.98) { g.globalAlpha = 1 - bl; g.drawImage(st.tile[key], x + 3, ys - 80 * hs, 200, 160 * hs); }
        if (bl > 0.02) { g.globalAlpha = bl; g.drawImage(st.blur[key], x + 3, ys - 130 * hs, 200, 260 * hs); }
      }
      g.globalAlpha = 1;
      // Gewinnrahmen
      if (win) for (let row = 0; row < 3; row++) { const kk = seg(kw, row * 0.09, row * 0.09 + 0.15); if (kk <= 0) continue; const ys = HS_REEL.cy + HS_REEL.Rc * Math.sin((row - 1) * HS_REEL.rowH / HS_REEL.Rc); const pul = 0.6 + 0.4 * Math.sin(kw * 16 + row);
        g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = kk * pul * 0.5; g.drawImage(st.glow, x - 20, ys - 90, HS_REEL.w + 40, 180); g.restore(); }
      g.restore();
    }
    g.drawImage(st.ov, 0, 0);
    // Gewinnlinien über alle Walzen
    if (win) for (let row = 0; row < 3; row++) {
      const kk = out3(seg(kw, row * 0.09, row * 0.09 + 0.2)); if (kk <= 0) continue; const ys = HS_REEL.cy + HS_REEL.Rc * Math.sin((row - 1) * HS_REEL.rowH / HS_REEL.Rc);
      const blink = Math.floor(kw * 8 + row) % 2 ? 1 : 0.55; g.save(); g.globalAlpha = blink; g.strokeStyle = ["#ffd54a", "#ff4d6d", "#4ade80"][row]; g.lineWidth = 9; g.lineCap = "round"; g.shadowColor = g.strokeStyle; g.shadowBlur = 24;
      g.beginPath(); g.moveTo(180, ys); g.lineTo(180 + 660 * kk, ys); g.stroke(); g.restore();
    }
    // Markierungen links/rechts der Reihen
    for (let row = 0; row < 3; row++) { const ys = HS_REEL.cy + HS_REEL.Rc * Math.sin((row - 1) * HS_REEL.rowH / HS_REEL.Rc); const on = win && Math.floor(kw * 8 + row) % 2 === 0; const c = on ? "#ffe27a" : "#5a1020";
      for (const [x, dir] of [[160, 1], [860, -1]]) { g.fillStyle = c; g.beginPath(); g.moveTo(x, ys - 16); g.lineTo(x + dir * 22, ys); g.lineTo(x, ys + 16); g.closePath(); g.fill(); } }
    // Schild in der Krone
    const jt = (p.jackpot || "JACKPOT").toUpperCase(); const px = fitPx(g, jt, 580, 104, 900);
    if (!win) {
      txt(g, jt, 510, 552, { w: 900, px, c: "#22040b" });
      // Lauflicht im Schild: Punkte wandern
      for (let i = 0; i < 22; i++) { const x = 210 + i * 28.5; const on = (i + Math.floor(u * 16)) % 4 === 0; circle(g, x, 506, 5, on ? "#ffcf5a" : "#3a0a14"); circle(g, 820 - i * 28.5, 598, 5, on ? "#ffcf5a" : "#3a0a14"); }
    } else {
      const pk = outBack(cl(kw / 0.28), 2.6); const sc_ = lerp(2.1, 1, pk); const fl = Math.floor(kw * 10) % 2 ? 1 : 0.85;
      g.save(); g.translate(510, 552); g.scale(sc_, sc_); g.rotate((1 - cl(kw / 0.28)) * -0.12);
      g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.7 * fl; g.drawImage(st.glow, -360, -110, 720, 220); g.restore();
      font(g, 900, px); g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
      g.lineWidth = 16; g.strokeStyle = "#5a1500"; g.strokeText(jt, 0, 6);
      const gr = g.createLinearGradient(0, -px * 0.5, 0, px * 0.5); gr.addColorStop(0, "#fffbe0"); gr.addColorStop(0.45, "#ffd23f"); gr.addColorStop(0.55, "#f59e0b"); gr.addColorStop(1, "#ffe9a0");
      g.shadowColor = "rgba(255,200,60,0.9)"; g.shadowBlur = 30 * fl; g.fillStyle = gr; g.fillText(jt, 0, 0); g.restore();
    }
    // Lichter: laufen im Kreis, beim Jackpot blinken alle
    const B = st.bulbs; const step = Math.floor(u * (u < tc ? 16 : 0));
    for (let i = 0; i < B.length; i++) {
      let on, col;
      if (!win) { on = (i + step) % 3 === 0; col = "255,70,80"; }
      else { on = (Math.floor(kw * 9) + (i % 2)) % 2 === 0; col = i % 2 ? "255,215,90" : "255,90,110"; }
      const [x, y] = B[i]; circle(g, x, y, 11, on ? `rgb(${col})` : "#4a0d18"); circle(g, x - 3, y - 3, 4, on ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.18)");
      if (on) { g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.85; g.filter = "none"; g.drawImage(st.glow, x - 34, y - 34, 68, 68); g.restore(); }
    }
    // Hebel: Drehpunkt rechts, Kugel kommt nach vorn und unten
    const pullF = (t) => t < 0.16 ? lerp(0.28, 1, Math.pow(cl(t / 0.16), 1.6)) : t < 0.32 ? 1 : 1 - outElastic(cl((t - 0.32) / 0.7)); const pull = pullF(u);
    const pivX = 948, pivY = 900; const phi = pull * Math.PI * 0.86; const L = 330;
    const drawLever = (ph, al) => {
      const kx = pivX + Math.sin(ph) * 30, ky = pivY - Math.cos(ph) * L; const ks = 1 + 0.4 * Math.sin(ph);
      g.save(); g.globalAlpha = al; g.lineCap = "round"; const gr = g.createLinearGradient(pivX - 14, 0, pivX + 14, 0); gr.addColorStop(0, "#6b7280"); gr.addColorStop(0.4, "#ffffff"); gr.addColorStop(1, "#4b5563");
      g.strokeStyle = gr; g.lineWidth = 20 * (0.8 + 0.2 * ks); g.beginPath(); g.moveTo(pivX, pivY); g.lineTo(kx, ky); g.stroke();
      const rg = g.createRadialGradient(kx - 14 * ks, ky - 16 * ks, 4, kx, ky, 46 * ks); rg.addColorStop(0, "#ffd0d6"); rg.addColorStop(0.35, "#ff2d4a"); rg.addColorStop(1, "#6b0012");
      g.fillStyle = rg; g.beginPath(); g.arc(kx, ky, 46 * ks, 0, 7); g.fill(); g.restore();
    };
    if (u < 0.7) for (let j = 4; j >= 1; j--) { const pu = u - j * 0.02; const pp = pullF(Math.max(0, pu)); drawLever(pp * Math.PI * 0.86, 0.28 / j); }
    drawLever(phi, 1);
    const hg = g.createRadialGradient(pivX - 8, pivY - 8, 3, pivX, pivY, 40); hg.addColorStop(0, "#ffffff"); hg.addColorStop(0.5, "#9aa3b1"); hg.addColorStop(1, "#3c414b"); g.fillStyle = hg; g.beginPath(); g.arc(pivX, pivY, 36, 0, 7); g.fill();
    // Münzen aus der Schale (zum Betrachter hin)
    if (win) {
      g.save(); rr(g, 272, 1190, 476, 72, 24); g.clip(); const nh = Math.min(30, Math.floor(kw * 28));
      for (let i = 0; i < nh; i++) { const x = 300 + rnd(i * 3.1) * 420, y = 1258 - rnd(i * 5.7) * 22 - i * 0.9; g.drawImage(st.coin, x - 26, y - 11, 52, 22); } g.restore();
      for (let i = 0; i < 30; i++) {
        const t0 = (i % 15) * 0.06 + (i > 14 ? 0.45 : 0); const tt = kw - t0; if (tt < 0 || tt > 1.6) continue;
        const side = i % 2 ? 1 : -1; const vx = side * (250 + rnd(i * 2.7) * 650), vy = -700 - rnd(i * 4.1) * 900; const x = 510 + (rnd(i) - 0.5) * 360 + vx * tt, y = 1215 + vy * tt + 3000 * tt * tt * 0.5;
        const s = (0.6 + tt * 0.8) * (0.8 + rnd(i * 9) * 0.5); const spin = Math.cos(tt * 18 + i); if (y > 2100) continue;
        g.save(); g.translate(x, y); g.globalAlpha = y > 1290 && y < 1660 ? 0.4 : 1; g.scale(Math.max(0.1, Math.abs(spin)), 1); g.drawImage(st.coin, -36 * s, -36 * s, 72 * s, 72 * s); g.restore();
      }
    }
    g.restore();
    // Münzregen von oben (vor dem Automaten) und Funken
    if (win) {
      for (let i = 0; i < 60; i++) {
        const z = 0.45 + rnd(i * 5.5) * 1.1; const t0 = rnd(i * 3.9) * 0.6; const tt = kw - t0; if (tt < 0) continue;
        const y = -120 + tt * (900 + z * 700) + 0.5 * 900 * tt * tt; if (y > H + 100) continue; const x = rnd(i * 1.9) * W + Math.sin(tt * 3 + i) * 30;
        const spin = Math.cos(tt * (8 + i % 5) + i); const s = 60 * z;
        g.save(); g.translate(x, y); g.globalAlpha = y > 1290 && y < 1660 ? 0.4 : 1; g.rotate(Math.sin(i) * 0.4); g.scale(Math.max(0.08, Math.abs(spin)), 1); if (z > 1.3) g.filter = "blur(3px)"; g.drawImage(st.coin, -s / 2, -s / 2, s, s); g.filter = "none"; g.restore();
        if (Math.abs(spin) > 0.96) { g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.8; g.drawImage(st.glow, x - s * 0.6, y - s * 0.6, s * 1.2, s * 1.2); g.restore(); }
      }
      sparkles(g, 520, 700, u, 26, 520, "#fff3b0", 11);
      const f = Math.exp(-Math.max(0, kw) / 0.1); if (f > 0.01) { g.fillStyle = `rgba(255,240,200,${0.6 * f})`; g.fillRect(0, 0, W, H); }
      shock(g, 510, 552, cl(kw / 0.7), "rgba(255,215,100,A)", 900, 2);
    }
    g.restore();
    const vg = g.createRadialGradient(540, 880, 380, 540, 880, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  },
  ev(d, p) {
    const T = hs_times(d); const E = [[0, "slot_pull", 1.0, 0.4], [0.17, "slot_clunk", 0.9, 0.4], [0.2, "slot_spinup", 0.5, 0]];
    // Klicken der Walzen: je Symbol, das vorbeizieht
    for (let r = 0; r < 3; r++) { let last = 0; for (let t = 0.2; t < T.stops[r] + 0.05; t += 0.004) { const { pos } = this.reel(t, r, T); const s0 = Math.floor(this.reel(0, r, T).pos - pos); if (s0 > last) { last = s0; E.push([t, "slot_tick", r === 2 && t > T.stops[2] - 0.6 ? 0.6 : 0.4, (r - 1) * 0.45]); } } }
    T.stops.forEach((t, r) => E.push([t, "slot_klonk", r === 2 ? 1.0 : 0.85, (r - 1) * 0.45]));
    E.push([T.stops[2] - 0.62, "riser", 0.4, 0, 0.6]);
    E.push([T.tc + 0.05, "slot_win", 1.0, 0]); E.push([T.tc + 0.08, "slot_bells", 0.8, 0]); E.push([T.tc + 0.1, "slot_coins", 0.8, 0]);
    if (d - T.tc > 1.2) E.push([T.tc + 0.95, "slot_coins", 0.55, 0.3]);
    return E;
  },
};
