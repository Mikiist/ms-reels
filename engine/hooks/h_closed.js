// VOICE_DELAY: 0.6
// h_closed: Nachtszene vor einer Ladentür. Schild "GESCHLOSSEN" schwingt am Faden (Quietschen), Türglocke klingelt,
// LED-Uhr zeigt 22:47, ein Kunde ist nur als Handy-Lichtschein vor der Tür angedeutet. Mit flip (Standard) dreht sich das
// Schild mit Schwung auf "ONLINE GEÖFFNET" und leuchtet warm, drinnen geht das Licht an.
// Parameter: sign ("GESCHLOSSEN"), sign_back ("ONLINE GEÖFFNET"), clock ("22:47"), flip (true), rain (true).
for (const f of ["900 100px D", "800 100px D", "700 100px D", "600 100px I"]) document.fonts.load(f);
const CLOSED_DOOR = { x: 230, y: 455, w: 620, h: 845 }, CLOSED_GLASS = { x: 266, y: 491, w: 548, h: 773 };
const CLOSED_SW = 520, CLOSED_SH = 216, CLOSED_PER = 0.92;

function closed_times(d, p) {
  const flip = !(p.flip === false || p.flip === "false" || p.flip === 0);
  const peak = Math.max(1.25, d - 0.5);
  return { flip, peak, f0: peak - 0.42 };
}
// Pendelwinkel des Schilds (schwingt ab Bild 0)
function closed_swing(u, d, p) {
  const { flip, f0, peak } = closed_times(d, p);
  const w = Math.PI * 2 / CLOSED_PER;
  let a = 0.34 * Math.exp(-u / 2.2) * Math.sin(w * u + 0.35);
  if (flip) { const k = seg(u, f0 - 0.15, f0 + 0.1); a *= 1 - k; if (u > peak) a += 0.07 * Math.exp(-(u - peak) / 0.5) * Math.sin((u - peak) * 9); }
  return a;
}

function closed_signImg(text, back) {
  const c = document.createElement("canvas"); c.width = CLOSED_SW + 80; c.height = CLOSED_SH + 80; const g = c.getContext("2d"); g.translate(40, 40);
  const w = CLOSED_SW, h = CLOSED_SH;
  if (!back) {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#fbf7ee"); gr.addColorStop(1, "#dcd3c2");
    shadow(g, 30, 16, "rgba(0,0,0,0.55)"); g.fillStyle = gr; rr(g, 0, 0, w, h, 26); g.fill(); noShadow(g);
    g.strokeStyle = "#c8102e"; g.lineWidth = 10; rr(g, 18, 18, w - 36, h - 36, 16); g.stroke();
    const px = fitPx(g, text, w - 90, 104, 900); txt(g, text, w / 2, h / 2 + 6, { w: 900, px, c: "#c8102e", ls: 2 });
    // Gebrauchsspuren
    g.fillStyle = "rgba(120,90,50,0.10)"; for (let i = 0; i < 30; i++) { g.beginPath(); g.arc(rnd(i) * w, rnd(i + 9) * h, 2 + rnd(i * 3) * 9, 0, 7); g.fill(); }
  } else {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#fff1b8"); gr.addColorStop(0.5, "#ffc94d"); gr.addColorStop(1, "#ff9a1f");
    shadow(g, 50, 0, "rgba(255,170,40,0.9)"); g.fillStyle = gr; rr(g, 0, 0, w, h, 26); g.fill(); noShadow(g);
    g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 8; rr(g, 16, 16, w - 32, h - 32, 16); g.stroke();
    const sp = text.indexOf(" ");
    if (sp > 0) {
      const a = text.slice(0, sp), b = text.slice(sp + 1);
      txt(g, a, w / 2, 62, { w: 800, px: fitPx(g, a, w - 120, 50, 800), c: "#5a2a00", ls: 10 });
      txt(g, b, w / 2, 138, { w: 900, px: fitPx(g, b, w - 80, 100, 900), c: "#3d1600" });
    } else txt(g, text, w / 2, h / 2 + 6, { w: 900, px: fitPx(g, text, w - 80, 104, 900), c: "#3d1600" });
    const gl = g.createLinearGradient(0, 0, 0, h * 0.5); gl.addColorStop(0, "rgba(255,255,255,0.5)"); gl.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gl; rr(g, 6, 6, w - 12, h * 0.45, 20); g.fill();
  }
  for (const x of [46, w - 46]) { circle(g, x, 34, 9, back ? "#7a3d00" : "#8c8273"); circle(g, x, 34, 5, "#2a2620"); }
  return c;
}

// Innenraum + Tür (dunkel oder hell)
function closed_doorImg(lit) {
  const D = CLOSED_DOOR, G = CLOSED_GLASS; const c = document.createElement("canvas"); c.width = D.w; c.height = D.h; const g = c.getContext("2d");
  const gx = G.x - D.x, gy = G.y - D.y;
  g.save(); g.beginPath(); g.rect(gx, gy, G.w, G.h); g.clip();
  const ig = g.createLinearGradient(0, gy, 0, gy + G.h);
  if (lit) { ig.addColorStop(0, "#5a2a0c"); ig.addColorStop(0.35, "#c9782c"); ig.addColorStop(0.7, "#8a4a1a"); ig.addColorStop(1, "#3a1a08"); }
  else { ig.addColorStop(0, "#050a16"); ig.addColorStop(0.5, "#0a1428"); ig.addColorStop(1, "#04070f"); }
  g.fillStyle = ig; g.fillRect(gx, gy, G.w, G.h);
  if (lit) { const rg = g.createRadialGradient(gx + G.w / 2, gy + 260, 20, gx + G.w / 2, gy + 260, 520); rg.addColorStop(0, "rgba(255,230,160,0.9)"); rg.addColorStop(1, "rgba(255,180,80,0)"); g.fillStyle = rg; g.fillRect(gx, gy, G.w, G.h); }
  // Regale und Theke als Silhouetten
  const sh = lit ? "rgba(70,30,8,0.75)" : "rgba(20,35,65,0.9)", it = lit ? "rgba(255,210,140,0.55)" : "rgba(60,90,140,0.35)";
  for (const [x0, w0] of [[gx + 10, 150], [gx + G.w - 160, 150]]) {
    g.fillStyle = sh; g.fillRect(x0, gy + 230, w0, 560);
    for (let k = 0; k < 5; k++) { const y = gy + 270 + k * 104; g.fillStyle = it; g.fillRect(x0 + 6, y, w0 - 12, 5); for (let j = 0; j < 5; j++) { const hh = 26 + rnd(k * 7 + j + x0) * 40; g.fillStyle = lit ? `rgba(${180 + j * 12},${110 + k * 10},60,0.8)` : "rgba(30,50,90,0.8)"; g.fillRect(x0 + 12 + j * 27, y - hh, 20, hh); } }
  }
  g.fillStyle = sh; g.fillRect(gx + 150, gy + 560, G.w - 300, 220);
  g.fillStyle = it; g.fillRect(gx + 150, gy + 560, G.w - 300, 8);
  // Hängelampe
  g.strokeStyle = lit ? "rgba(80,40,10,0.9)" : "rgba(30,45,75,0.9)"; g.lineWidth = 3; g.beginPath(); g.moveTo(gx + G.w / 2, gy); g.lineTo(gx + G.w / 2, gy + 190); g.stroke();
  g.fillStyle = lit ? "#ffe9b0" : "#1b2742"; g.beginPath(); g.moveTo(gx + G.w / 2 - 60, gy + 235); g.lineTo(gx + G.w / 2 + 60, gy + 235); g.lineTo(gx + G.w / 2 + 26, gy + 190); g.lineTo(gx + G.w / 2 - 26, gy + 190); g.closePath(); g.fill();
  // Glasspiegelungen
  g.globalCompositeOperation = "lighter";
  for (const [x, w0, a] of [[60, 120, 0.10], [220, 40, 0.07], [420, 90, 0.08]]) { const sg = g.createLinearGradient(gx + x, 0, gx + x + w0, 0); sg.addColorStop(0, "rgba(160,200,255,0)"); sg.addColorStop(0.5, `rgba(170,210,255,${a})`); sg.addColorStop(1, "rgba(160,200,255,0)"); g.fillStyle = sg; g.save(); g.transform(1, 0, -0.35, 1, 0, 0); g.fillRect(gx + x + 160, gy, w0, G.h); g.restore(); }
  g.globalCompositeOperation = "source-over";
  // Regentropfen auf dem Glas
  for (let i = 0; i < 90; i++) { const x = gx + rnd(i * 2.3) * G.w, y = gy + rnd(i * 5.1) * G.h, r = 2 + rnd(i * 7) * 5; g.fillStyle = "rgba(200,225,255,0.18)"; g.beginPath(); g.ellipse(x, y, r * 0.8, r, 0, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.35, r * 0.3, 0, 7); g.fill(); }
  g.restore();
  // Rahmen
  const fr = g.createLinearGradient(0, 0, D.w, 0); fr.addColorStop(0, "#2a3446"); fr.addColorStop(0.5, "#46536a"); fr.addColorStop(1, "#1f2737");
  g.fillStyle = fr; g.beginPath(); g.rect(0, 0, D.w, D.h); g.rect(gx, gy, G.w, G.h); g.fill("evenodd");
  g.strokeStyle = "rgba(170,200,255,0.35)"; g.lineWidth = 3; g.strokeRect(1.5, 1.5, D.w - 3, D.h - 3); g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 4; g.strokeRect(gx - 2, gy - 2, G.w + 4, G.h + 4);
  // Griff
  const hx = D.w - 70; const hg = g.createLinearGradient(hx - 12, 0, hx + 12, 0); hg.addColorStop(0, "#5d6878"); hg.addColorStop(0.4, "#e8eef7"); hg.addColorStop(1, "#4a5464");
  shadow(g, 14, 6, "rgba(0,0,0,0.6)"); g.fillStyle = hg; rr(g, hx - 12, 400, 24, 240, 12); g.fill(); noShadow(g);
  g.fillStyle = "#3b4454"; g.fillRect(hx - 30, 420, 18, 14); g.fillRect(hx - 30, 606, 18, 14);
  return c;
}

function closed_wallImg() {
  const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, "#020611"); sky.addColorStop(0.45, "#0a1830"); sky.addColorStop(0.68, "#081226"); sky.addColorStop(1, "#02040a");
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  // Mauerwerk
  for (let row = 0; row < 48; row++) { const y = 300 + row * 22; if (y > 1300) break; const off = row % 2 ? 0 : 46;
    for (let x = -off; x < W; x += 92) { const v = 14 + rnd(row * 31 + x) * 14; g.fillStyle = `rgb(${v},${v + 12},${v + 32})`; g.fillRect(x + 2, y + 2, 88, 18); } }
  const vg = g.createLinearGradient(0, 300, 0, 520); vg.addColorStop(0, "rgba(2,6,17,1)"); vg.addColorStop(1, "rgba(2,6,17,0)"); g.fillStyle = vg; g.fillRect(0, 280, W, 260);
  // Türnische
  g.fillStyle = "rgba(0,0,0,0.55)"; g.fillRect(CLOSED_DOOR.x - 30, CLOSED_DOOR.y - 30, CLOSED_DOOR.w + 60, CLOSED_DOOR.h + 30);
  // Gehweg
  const gw = g.createLinearGradient(0, 1300, 0, H); gw.addColorStop(0, "#0d1a30"); gw.addColorStop(1, "#02050c"); g.fillStyle = gw; g.fillRect(0, 1300, W, H - 1300);
  g.fillStyle = "#1a2a48"; g.fillRect(0, 1296, W, 8);
  g.strokeStyle = "rgba(120,160,220,0.08)"; g.lineWidth = 3; for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(540 + i * 120, 1304); g.lineTo(540 + i * 420, H); g.stroke(); }
  // Laternenmast
  const px = 1000; const pg = g.createLinearGradient(px - 16, 0, px + 16, 0); pg.addColorStop(0, "#0b1222"); pg.addColorStop(0.5, "#3a4864"); pg.addColorStop(1, "#0b1222");
  g.fillStyle = pg; g.fillRect(px - 13, 560, 26, 760); g.fillRect(px - 24, 1262, 48, 48);
  g.strokeStyle = "#2c3854"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(px, 580); g.quadraticCurveTo(px, 520, 945, 522); g.stroke();
  // Lichtkegel (weich, kühl)
  g.save(); g.globalCompositeOperation = "lighter"; g.filter = "blur(28px)";
  const lc = g.createRadialGradient(925, 545, 10, 925, 545, 900); lc.addColorStop(0, "rgba(175,215,255,0.5)"); lc.addColorStop(0.35, "rgba(100,150,230,0.16)"); lc.addColorStop(1, "rgba(40,80,160,0)");
  g.fillStyle = lc; g.beginPath(); g.moveTo(895, 545); g.lineTo(955, 545); g.lineTo(1250, 1310); g.lineTo(560, 1310); g.closePath(); g.fill();
  const pool = g.createRadialGradient(920, 1320, 10, 920, 1320, 360); pool.addColorStop(0, "rgba(160,200,255,0.35)"); pool.addColorStop(1, "rgba(160,200,255,0)"); g.save(); g.translate(920, 1320); g.scale(1, 0.25); g.translate(-920, -1320); g.fillStyle = pool; g.fillRect(500, 900, 840, 840); g.restore();
  g.filter = "none"; g.restore();
  // Leuchtenkopf
  g.fillStyle = "#1c2640"; g.beginPath(); g.moveTo(890, 548); g.lineTo(960, 548); g.lineTo(945, 518); g.lineTo(905, 518); g.closePath(); g.fill();
  g.save(); g.globalCompositeOperation = "lighter"; const hg = g.createRadialGradient(925, 550, 2, 925, 550, 120); hg.addColorStop(0, "rgba(230,245,255,1)"); hg.addColorStop(0.2, "rgba(160,205,255,0.6)"); hg.addColorStop(1, "rgba(120,170,255,0)"); g.fillStyle = hg; g.fillRect(800, 430, 250, 250); g.restore();
  fillRR(g, 896, 546, 58, 8, 4, "#eaf4ff");
  return c;
}

function closed_seg7(g, ch, x, y, w, h, on, off) {
  const t = w * 0.18, S = { a: [t, 0, w - 2 * t, t], b: [w - t, t, t, h / 2 - t * 1.5], c: [w - t, h / 2 + t * 0.5, t, h / 2 - t * 1.5], d: [t, h - t, w - 2 * t, t], e: [0, h / 2 + t * 0.5, t, h / 2 - t * 1.5], f: [0, t, t, h / 2 - t * 1.5], g: [t, h / 2 - t / 2, w - 2 * t, t] };
  const M = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  const lit = M[ch] || "";
  for (const k in S) { const [sx, sy, sw, sh] = S[k]; g.fillStyle = lit.includes(k) ? on : off; rr(g, x + sx + 2, y + sy + 2, sw - 4, sh - 4, t / 2); g.fill(); }
}

TYPES.h_closed = {
  zone: "bottom", pal: "navy", bgv: 0, coverT: 1.1,
  prep(sc, p) {
    sc.st.fok = document.fonts.check("900 100px D");
    sc.st.wall = closed_wallImg(); sc.st.doorD = closed_doorImg(false); sc.st.doorL = closed_doorImg(true);
    sc.st.front = closed_signImg(p.sign || "GESCHLOSSEN", false); sc.st.back = closed_signImg(p.sign_back || "ONLINE GEÖFFNET", true);
  },
  draw(g, u, d, p, sc, P) {
    if (!sc.st.fok && document.fonts.check("900 100px D")) this.prep(sc, p);
    const { flip, peak, f0 } = closed_times(d, p); const D = CLOSED_DOOR, G = CLOSED_GLASS;
    const rain = !(p.rain === false || p.rain === "false");
    // Licht drinnen: flackert nach dem Dreh an
    let lit = 0; if (flip && u > peak - 0.05) { const k = u - (peak - 0.05); lit = k < 0.05 ? 0.7 : k < 0.1 ? 0.15 : k < 0.15 ? 0.9 : k < 0.2 ? 0.4 : cl(0.6 + k * 2); }
    // Kamera: leichte Fahrt nach vorn, Ruck beim Dreh
    let sx = 0, sy = 0; if (u < 0.35) { const a = 9 * Math.exp(-u / 0.08); sx = Math.sin(u * 83) * a; }
    if (flip && u >= peak && u < peak + 0.4) { const a = 12 * Math.exp(-(u - peak) / 0.08); sx += Math.sin(u * 91) * a; sy += Math.cos(u * 77) * a; }
    const zoom = 1.13 - 0.13 * outExpo(seg(u, 0, 0.55)) + 0.03 * seg(u, 0.55, d);
    g.save(); g.translate(540 + sx, 880 + sy); g.scale(zoom, zoom); g.translate(-540, -880);
    g.drawImage(sc.st.wall, 0, 0);
    // Tür (rüttelt am Anfang)
    const rat = u < 0.45 ? Math.sin(u * 70) * 7 * Math.exp(-u / 0.12) : 0;
    g.save(); g.translate(rat, 0);
    shadow(g, 60, 20, "rgba(0,0,0,0.7)"); g.drawImage(sc.st.doorD, D.x, D.y); noShadow(g);
    if (lit > 0) { g.globalAlpha = lit; g.drawImage(sc.st.doorL, D.x, D.y); g.globalAlpha = 1; }
    // hinter dem Glas: LED-Uhr, Glocke
    g.save(); g.beginPath(); g.rect(G.x, G.y, G.w, G.h); g.clip();
    let cs = (p.clock || "22:47").slice(0, 5);
    if (!flip && u >= peak) { const m = /^(\d\d):(\d\d)$/.exec(cs); if (m) { const t = (+m[1] * 60 + +m[2] + 1) % 1440; cs = String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0"); } } const cw = 290, ch_ = 110, cx0 = 540 - cw / 2, cy0 = 540;
    shadow(g, 20, 8, "rgba(0,0,0,0.6)"); fillRR(g, cx0 - 18, cy0 - 16, cw + 36, ch_ + 32, 14, "#05070c"); noShadow(g);
    g.strokeStyle = "rgba(120,140,170,0.3)"; g.lineWidth = 2; rr(g, cx0 - 18, cy0 - 16, cw + 36, ch_ + 32, 14); g.stroke();
    g.save(); g.shadowColor = "rgba(255,40,40,0.95)"; g.shadowBlur = 22 + (!flip && u >= peak ? 60 * Math.exp(-(u - peak) / 0.25) : 0);
    let x = cx0; const dw = 54, gap = 14;
    for (const c of cs) { if (c === ":") { if (Math.floor(u * 2) % 2 === 0 || u > peak) { circle(g, x + 9, cy0 + 32, 7, "#ff3b30"); circle(g, x + 9, cy0 + 78, 7, "#ff3b30"); } x += 26; continue; }
      closed_seg7(g, c, x, cy0, dw, ch_, "#ff3b30", "rgba(255,60,50,0.07)"); x += dw + gap; }
    g.restore();
    // Glocke an Feder oben rechts
    const bA = 0.55 * Math.exp(-u / 0.45) * Math.sin(u * 17) + (flip && u > peak ? 0.35 * Math.exp(-(u - peak) / 0.4) * Math.sin((u - peak) * 17) : 0);
    g.save(); g.translate(770, 500); g.strokeStyle = "#8a7a52"; g.lineWidth = 6; g.beginPath(); g.moveTo(-40, 0); g.lineTo(0, 0); g.stroke(); g.rotate(bA);
    g.strokeStyle = "#a99560"; g.lineWidth = 3; g.beginPath(); for (let k = 0; k <= 30; k++) { const yy = k * 2.2, xx = Math.sin(k * 1.3) * 6; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke();
    const bg_ = g.createLinearGradient(-30, 0, 30, 0); bg_.addColorStop(0, "#6b4a12"); bg_.addColorStop(0.35, "#ffe08a"); bg_.addColorStop(0.6, "#c9922c"); bg_.addColorStop(1, "#5a3a0c");
    g.fillStyle = bg_; g.beginPath(); g.moveTo(-12, 66); g.quadraticCurveTo(-16, 92, -34, 112); g.lineTo(34, 112); g.quadraticCurveTo(16, 92, 12, 66); g.quadraticCurveTo(0, 58, -12, 66); g.fill();
    circle(g, 0, 118, 8, "#8a6420");
    g.restore();
    g.restore();
    // Spiegelung des Handy-Lichts im Glas
    const fl = 0.75 + 0.25 * Math.sin(u * 23) * Math.sin(u * 7.3);
    g.save(); g.globalCompositeOperation = "lighter"; const rf = g.createRadialGradient(330, 1130, 5, 330, 1130, 170); rf.addColorStop(0, `rgba(150,200,255,${0.35 * fl})`); rf.addColorStop(1, "rgba(150,200,255,0)"); g.fillStyle = rf; g.fillRect(G.x, 950, 400, 320); g.restore();
    g.restore();
    // ---------- Schild ----------
    const ang = closed_swing(u, d, p);
    let phi = 0; if (flip) { const a = seg(u, f0 - 0.14, f0), b = seg(u, f0, peak); phi = -0.35 * Math.sin(a * Math.PI / 2) * (1 - b) + Math.PI * 3 * (1 - Math.pow(1 - b, 2.6)); if (u > peak) phi = Math.PI * 3 + 0.12 * Math.exp(-(u - peak) / 0.12) * Math.sin((u - peak) * 40); }
    const hx = 540 + rat * 0.6, hy = 650; const L = 190;
    const scx = Math.cos(phi), back = scx < 0, sw = Math.abs(scx);
    // Leuchten hinter der Rückseite
    const glowK = flip ? cl((u - peak + 0.05) / 0.25) : 0;
    g.save(); g.translate(hx, hy); g.rotate(ang);
    if (glowK > 0) { g.save(); g.globalCompositeOperation = "lighter"; const gw = g.createRadialGradient(0, L, 30, 0, L, 560); gw.addColorStop(0, `rgba(255,190,80,${0.75 * glowK})`); gw.addColorStop(0.4, `rgba(255,140,40,${0.3 * glowK})`); gw.addColorStop(1, "rgba(255,120,30,0)"); g.fillStyle = gw; g.fillRect(-700, L - 700, 1400, 1400); g.restore(); }
    // Saugnapf und Fäden
    circle(g, 0, 0, 16, "rgba(190,215,255,0.5)"); circle(g, 0, 0, 7, "#d9e6ff");
    const ex = (CLOSED_SW / 2 - 46) * sw;
    g.strokeStyle = "rgba(225,215,190,0.9)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-ex, L - CLOSED_SH / 2 + 34); g.lineTo(0, 0); g.lineTo(ex, L - CLOSED_SH / 2 + 34); g.stroke();
    // Bewegungsunschärfe beim Drehen
    const spinning = flip && u > f0 && u < peak;
    const draw1 = (ph, a) => { const c = Math.cos(ph), img = c < 0 ? sc.st.back : sc.st.front; g.save(); g.translate(0, L); g.scale(Math.max(0.02, Math.abs(c)), 1); g.globalAlpha = a;
      if (Math.abs(c) < 0.25) { g.fillStyle = c < 0 ? "#ffb63a" : "#e9e1d0"; g.fillRect(-CLOSED_SW / 2, -CLOSED_SH / 2, CLOSED_SW, CLOSED_SH); }
      g.drawImage(img, -CLOSED_SW / 2 - 40, -CLOSED_SH / 2 - 40); g.restore(); };
    if (spinning) { const v = 3 * Math.PI * 2.6 * Math.pow(1 - seg(u, f0, peak), 1.6) / 0.42; for (let k = 3; k >= 1; k--) draw1(phi - v * 0.012 * k, 0.22); }
    draw1(phi, 1);
    g.globalAlpha = 1; g.restore();
    if (glowK > 0) sparkles(g, hx, hy + L, u - peak, 22, 380, "#fff1b8", 41);
    if (flip && u >= peak) shock(g, hx, hy + L, (u - peak) / 0.6, "rgba(255,200,110,A)", 620, 2);
    // ---------- Regen, Nebel ----------
    if (rain) {
      g.save(); g.lineCap = "round";
      for (let i = 0; i < 170; i++) {
        const z = 0.4 + rnd(i * 3.7) * 0.9, sp = 1900 * z, len = 40 + 60 * z;
        const y = ((rnd(i * 1.9) * 2100 + u * sp) % 2100) - 120, x = (rnd(i * 4.3) * 1300 - 110) - (y + 120) * 0.12;
        const nearLamp = Math.max(0, 1 - Math.hypot(x - 940, (y - 700) * 0.6) / 520);
        g.strokeStyle = `rgba(${170 + 60 * nearLamp | 0},${200 + 40 * nearLamp | 0},255,${0.10 + 0.18 * z + 0.35 * nearLamp})`; g.lineWidth = 1 + z * 1.8;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x - len * 0.12, y + len); g.stroke();
      }
      // Spritzer am Boden
      for (let i = 0; i < 26; i++) { const ph_ = (u * 2.2 + rnd(i * 5.3)) % 1, x = rnd(i * 8.1) * W, y = 1310 + rnd(i * 2.7) * 230; g.strokeStyle = `rgba(170,205,255,${0.35 * (1 - ph_)})`; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, 4 + ph_ * 26, 1.5 + ph_ * 6, 0, 0, 7); g.stroke(); }
      g.restore();
    }
    // nasse Spiegelung von Laterne und Schild am Boden
    g.save(); g.globalCompositeOperation = "lighter";
    const refl = (x, w0, h0, c, a) => { g.save(); g.translate(x, 1300); g.scale(w0 / h0, 1); const rg = g.createRadialGradient(0, 0, 0, 0, 0, h0); rg.addColorStop(0, hexA(c, a)); rg.addColorStop(1, hexA(c, 0)); g.fillStyle = rg; g.fillRect(-h0, 0, 2 * h0, h0); g.restore(); };
    refl(925, 70, 330, "#a8c8ff", 0.3);
    if (glowK > 0) refl(540, 260, 380, "#ffaa3c", 0.42 * glowK);
    // Nebel
    for (let k = 0; k < 3; k++) { const fx = ((u * (30 + k * 20) + k * 400) % 1600) - 300; const fg = g.createRadialGradient(fx, 1290 + k * 40, 10, fx, 1290 + k * 40, 520); fg.addColorStop(0, "rgba(90,120,170,0.13)"); fg.addColorStop(1, "rgba(90,120,170,0)"); g.fillStyle = fg; g.fillRect(fx - 520, 800, 1040, 900); }
    g.restore();
    g.restore();
    // ---------- Handy-Lichtschein vorn links (Kunde, unscharf im Vordergrund) ----------
    const gone = flip ? 0 : inExpo(seg(u, peak - 0.3, peak + 0.05));
    const px = 150 + Math.sin(u * 1.3) * 8 - gone * 520, py = 1250 + Math.sin(u * 1.7) * 6 + gone * 120;
    g.save(); g.globalCompositeOperation = "lighter";
    const ph1 = g.createRadialGradient(px, py, 5, px, py, 420); ph1.addColorStop(0, `rgba(170,215,255,${0.55 * fl})`); ph1.addColorStop(0.25, `rgba(110,160,255,${0.22 * fl})`); ph1.addColorStop(1, "rgba(80,120,255,0)");
    g.fillStyle = ph1; g.fillRect(px - 420, py - 420, 840, 840);
    const cone = g.createLinearGradient(px, py, px + 260, py - 330); cone.addColorStop(0, `rgba(140,200,255,${0.28 * fl})`); cone.addColorStop(1, "rgba(140,200,255,0)");
    g.fillStyle = cone; g.beginPath(); g.moveTo(px - 30, py - 40); g.lineTo(px + 40, py - 20); g.lineTo(px + 420, py - 330); g.lineTo(px + 120, py - 420); g.closePath(); g.fill();
    g.filter = "blur(7px)"; g.translate(px, py); g.rotate(0.35); fillRR(g, -32, -62, 64, 124, 14, `rgba(190,225,255,${0.95 * fl})`); fillRR(g, -22, -50, 44, 100, 8, `rgba(255,255,255,${0.9 * fl})`); g.filter = "none";
    g.restore();
    // Vignette
    const vg = g.createRadialGradient(540, 880, 420, 540, 900, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,2,10,0.6)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    if (flip && u >= peak) { const f = 1 - seg(u, peak, peak + 0.2); if (f > 0) { g.fillStyle = `rgba(255,220,150,${0.35 * f})`; g.fillRect(0, 0, W, H); } }
  },
  ev(d, p) {
    const { flip, peak, f0 } = closed_times(d, p);
    const E = [[0, "closed_rattle", 1.0, 0.1], [0.02, "closed_bell", 1.0, 0.45]];
    const rain = !(p.rain === false || p.rain === "false"); if (rain) for (let t = 0; t < d; t += 1.4) E.push([t, "closed_rain", 0.35, 0]);
    // Quietschen an den Umkehrpunkten des Pendels
    const w = Math.PI * 2 / CLOSED_PER; const stop = flip ? f0 - 0.1 : d;
    for (let k = 0; k < 12; k++) { const t = (Math.PI / 2 + k * Math.PI - 0.35) / w; if (t > stop || t < 0) continue; const a = Math.exp(-t / 2.2); E.push([Math.max(0, t - 0.12), k % 2 ? "closed_squeak2" : "closed_squeak", 0.95 * a, k % 2 ? 0.2 : -0.2]); }
    if (!flip) E.push([peak - 0.25, "whoosh_down", 0.5, -0.6], [peak, "closed_beep", 0.8, 0]);
    if (flip) E.push([f0 - 0.08, "closed_spin", 0.85, 0], [peak, "closed_open", 0.75, 0], [peak - 0.04, "closed_switch", 0.7, 0.3], [peak + 0.05, "closed_bell", 0.45, 0.45]);
    return E;
  },
};
