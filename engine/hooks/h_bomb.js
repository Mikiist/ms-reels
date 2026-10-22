// VOICE_DELAY: 0.5
// h_bomb: Zeitbombe mit LED-Countdown 00:03 bis 00:00, beschleunigendes Piepen, Zeitlupenmoment, Explosion.
// Parameter: label (Etikett, Standard "IHRE WEBSITE"), boom_text (Standard "BOOM.", leer = kein Text)
try { for (const f of ["700 20px I", "800 20px D", "900 20px D"]) document.fonts.load(f); } catch (e) {}
const BOMB_CX = 540, BOMB_CY = 900, BOMB_O = 450; // Mitte der Bombe im Bild, Ursprung der Vorzeichnung (900 x 900)

function bombPlan(d) {
  const E = Math.max(1.35, d - 0.75), X0 = E - 0.2; const beeps = []; let t = 0, iv = 0.3;
  while (t < X0 - 0.045) { beeps.push(t); t += iv; iv = Math.max(0.065, iv * 0.84); }
  return { E, X0, beeps };
}
function bombSeg7(g, x, y, h, digit, on, off) {
  const w = h * 0.54, t = h * 0.13, hh = h / 2; const M = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f][digit];
  const segs = [[0, -hh, 1], [w / 2, -hh / 2, 0], [w / 2, hh / 2, 0], [0, hh, 1], [-w / 2, hh / 2, 0], [-w / 2, -hh / 2, 0], [0, 0, 1]];
  segs.forEach(([sx, sy, hor], i) => {
    const L = (hor ? w : hh) - t * 0.9, k = t / 2; g.beginPath();
    if (hor) { g.moveTo(x + sx - L / 2 - k, y + sy); g.lineTo(x + sx - L / 2, y + sy - k); g.lineTo(x + sx + L / 2, y + sy - k); g.lineTo(x + sx + L / 2 + k, y + sy); g.lineTo(x + sx + L / 2, y + sy + k); g.lineTo(x + sx - L / 2, y + sy + k); }
    else { g.moveTo(x + sx, y + sy - L / 2 - k); g.lineTo(x + sx + k, y + sy - L / 2); g.lineTo(x + sx + k, y + sy + L / 2); g.lineTo(x + sx, y + sy + L / 2 + k); g.lineTo(x + sx - k, y + sy + L / 2); g.lineTo(x + sx - k, y + sy - L / 2); }
    g.closePath(); const lit = (M >> i) & 1; g.fillStyle = lit ? on : off; g.fill();
  });
}
function bombWire(g, pts, col, hi) {
  g.lineCap = "round"; g.lineJoin = "round";
  const path = (dx, dy) => { g.beginPath(); g.moveTo(pts[0][0] + dx, pts[0][1] + dy); for (let i = 1; i < pts.length; i += 3) g.bezierCurveTo(pts[i][0] + dx, pts[i][1] + dy, pts[i + 1][0] + dx, pts[i + 1][1] + dy, pts[i + 2][0] + dx, pts[i + 2][1] + dy); };
  path(6, 10); g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 15; g.stroke();
  path(0, 0); g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 16; g.stroke();
  path(0, 0); g.strokeStyle = col; g.lineWidth = 12; g.stroke();
  path(-2, -3); g.strokeStyle = hi; g.lineWidth = 3.5; g.stroke();
}

TYPES.h_bomb = {
  zone: "bottom", pal: "black", bgv: 0, coverT: 1.0,
  prep(sc, p) {
    const S = 900, c = document.createElement("canvas"); c.width = S; c.height = S; const g = c.getContext("2d"), O = BOMB_O;
    const sticks = [[O - 158, 178, 742], [O, 150, 752], [O + 158, 186, 738]], w = 150;
    // Schatten der Bombe auf den Boden kommt im draw
    // Kabel hinter der Anzeige
    // Stangen
    sticks.forEach(([cx, yt, yb]) => {
      const gr = g.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
      [["#3b0305", 0], ["#8e0c13", 0.12], ["#d82630", 0.32], ["#ff7b75", 0.44], ["#f24a4f", 0.5], ["#c81c26", 0.68], ["#7a0910", 0.9], ["#2c0203", 1]].forEach(([col, s]) => gr.addColorStop(s, col));
      shadow(g, 40, 18, "rgba(0,0,0,0.55)"); g.fillStyle = gr; g.beginPath(); g.ellipse(cx, yb, w / 2, 20, 0, 0, Math.PI); g.lineTo(cx - w / 2, yt); g.lineTo(cx + w / 2, yt); g.closePath(); g.fill(); noShadow(g);
      g.fillRect(cx - w / 2, yt, w, yb - yt);
      // Papierkanten und feine Rillen
      g.fillStyle = "rgba(0,0,0,0.18)"; g.fillRect(cx - w / 2, yt + 26, w, 5); g.fillRect(cx - w / 2, yb - 34, w, 5);
      g.strokeStyle = "rgba(255,255,255,0.05)"; g.lineWidth = 2; for (let k = 0; k < 7; k++) { const x = cx - w / 2 + 12 + k * 20; g.beginPath(); g.moveTo(x, yt + 40); g.lineTo(x, yb - 40); g.stroke(); }
      // Deckel
      const cg = g.createRadialGradient(cx - 18, yt - 6, 4, cx, yt, w / 2); cg.addColorStop(0, "#f7e6c4"); cg.addColorStop(0.7, "#d9bc8a"); cg.addColorStop(1, "#8a6c45");
      g.fillStyle = cg; g.beginPath(); g.ellipse(cx, yt, w / 2, 20, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "rgba(90,40,10,0.6)"; g.lineWidth = 3; g.stroke();
      g.fillStyle = "#2a1a10"; g.beginPath(); g.ellipse(cx, yt, 13, 6, 0, 0, Math.PI * 2); g.fill();
    });
    // Klebeband (zwei Bahnen, leicht schief, knittrige Kanten)
    const tape = (yc, tilt, hgt, seed) => {
      for (const [cx] of sticks) {
        const y0 = yc + (cx - O) * tilt; const gr = g.createLinearGradient(cx - w / 2 - 6, 0, cx + w / 2 + 6, 0);
        [["#2e3034", 0], ["#80858c", 0.15], ["#c9cdd2", 0.38], ["#f2f4f6", 0.47], ["#b4b8be", 0.6], ["#6d7177", 0.85], ["#26282b", 1]].forEach(([col, s]) => gr.addColorStop(s, col));
        g.fillStyle = gr; g.beginPath(); const x0 = cx - w / 2 - 5, x1 = cx + w / 2 + 5; g.moveTo(x0, y0 - hgt / 2);
        for (let k = 1; k <= 8; k++) { const x = lerp(x0, x1, k / 8); g.lineTo(x, y0 - hgt / 2 + (x - cx) * tilt + (rnd(seed + k + cx) - 0.5) * 6); }
        for (let k = 8; k >= 0; k--) { const x = lerp(x0, x1, k / 8); g.lineTo(x, y0 + hgt / 2 + (x - cx) * tilt + (rnd(seed + k * 3 + cx) - 0.5) * 6); }
        g.closePath(); shadow(g, 10, 4, "rgba(0,0,0,0.45)"); g.fill(); noShadow(g);
        g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 2; for (let k = 0; k < 3; k++) { const x = cx - 40 + rnd(seed + k * 7 + cx) * 80; g.beginPath(); g.moveTo(x, y0 - hgt / 2 + 6); g.lineTo(x + 18, y0 + hgt / 2 - 6); g.stroke(); }
      }
    };
    tape(262, -0.02, 66, 11); tape(650, 0.025, 70, 29);
    // Kabel zu den Deckeln
    bombWire(g, [[O - 120, 345], [O - 160, 250], [O - 300, 220], [O - 168, 172]], "#e3232b", "#ff9a9a");
    bombWire(g, [[O - 10, 340], [O + 60, 230], [O - 80, 110], [O + 4, 148]], "#1f5fe0", "#9cc0ff");
    bombWire(g, [[O + 90, 342], [O + 120, 250], [O + 210, 130], [O + 160, 180]], "#f4c21c", "#fff1a6");
    bombWire(g, [[O + 200, 470], [O + 330, 470], [O + 330, 600], [O + 200, 628]], "#1f5fe0", "#9cc0ff");
    bombWire(g, [[O - 200, 500], [O - 320, 520], [O - 300, 640], [O - 190, 660]], "#e3232b", "#ff9a9a");
    // Anzeige-Gehäuse
    const bx = O - 215, by = 345, bw = 430, bh = 205;
    shadow(g, 40, 18, "rgba(0,0,0,0.7)"); fillRR(g, bx, by, bw, bh, 26, "#16181b"); noShadow(g);
    let gr = g.createLinearGradient(0, by, 0, by + bh); gr.addColorStop(0, "#4a4f56"); gr.addColorStop(0.12, "#2a2e33"); gr.addColorStop(0.85, "#1a1c1f"); gr.addColorStop(1, "#0d0e10");
    g.fillStyle = gr; rr(g, bx, by, bw, bh, 26); g.fill(); g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 2.5; rr(g, bx + 2, by + 2, bw - 4, bh - 4, 24); g.stroke();
    for (const [sx, sy] of [[bx + 20, by + 20], [bx + bw - 20, by + 20], [bx + 20, by + bh - 20], [bx + bw - 20, by + bh - 20]]) {
      const sg = g.createRadialGradient(sx - 2, sy - 2, 1, sx, sy, 8); sg.addColorStop(0, "#d6dade"); sg.addColorStop(1, "#3a3e43"); circle(g, sx, sy, 7, sg);
      g.strokeStyle = "rgba(0,0,0,0.55)"; g.lineWidth = 2; g.beginPath(); g.moveTo(sx - 4, sy); g.lineTo(sx + 4, sy); g.stroke(); }
    fillRR(g, bx + 34, by + 32, bw - 68, bh - 64, 12, "#0b0101"); g.strokeStyle = "rgba(0,0,0,0.9)"; g.lineWidth = 5; rr(g, bx + 34, by + 32, bw - 68, bh - 64, 12); g.stroke();
    sc.st.bomb = c; sc.st.box = { x: bx, y: by, w: bw, h: bh };
    // Rauch-Sprites (weich, wolkig)
    const mk = (col, seed) => { const s = document.createElement("canvas"); s.width = s.height = 256; const h = s.getContext("2d");
      for (let k = 0; k < 7; k++) { const x = 128 + (rnd(seed + k) - 0.5) * 100, y = 128 + (rnd(seed + k * 3) - 0.5) * 90, r = 42 + rnd(seed + k * 5) * 34;
        const q = h.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, hexA(col, 0.8)); q.addColorStop(0.6, hexA(col, 0.65)); q.addColorStop(0.85, hexA(col, 0.25)); q.addColorStop(1, hexA(col, 0)); h.fillStyle = q; h.fillRect(0, 0, 256, 256); }
      return s; };
    sc.st.smokeD = mk("#151313", 3); sc.st.smokeL = mk("#4a4440", 17); sc.st.smokeH = mk("#c9b8a6", 29); sc.st.smokeF = mk("#ff8a2a", 41);
    // Teilchen
    sc.st.sparks = []; for (let i = 0; i < 80; i++) sc.st.sparks.push({ a: rnd(i * 1.7 + 3) * Math.PI * 2, v: 900 + rnd(i * 2.9) * 1900, L: 0.45 + rnd(i * 4.3) * 0.8, w: 2.5 + rnd(i * 5.1) * 4, c: ["#fff6d0", "#ffd25a", "#ff9a2e", "#ffe9a8"][i % 4] });
    sc.st.debris = []; for (let i = 0; i < 16; i++) sc.st.debris.push({ a: -Math.PI / 2 + (rnd(i * 3.3 + 1) - 0.5) * Math.PI * 1.7, v: 800 + rnd(i * 6.1) * 1400, s: 12 + rnd(i * 2.2) * 22, r: (rnd(i * 8.8) - 0.5) * 18, t: i % 2 });
    sc.st.puffs = []; for (let i = 0; i < 38; i++) { const a = rnd(i * 2.1 + 9) * Math.PI * 2; sc.st.puffs.push({ a, dist: 30 + Math.sqrt(rnd(i * 3.7)) * 290, sz: 190 + rnd(i * 1.9) * 220, rise: 60 + rnd(i * 4.4) * 110, t0: rnd(i * 6.6) * 0.16, dark: rnd(i * 7.7) > 0.35 }); }
    sc.st.dust = []; for (let i = 0; i < 40; i++) sc.st.dust.push({ x: rnd(i * 9.1) * W, y: rnd(i * 3.9) * H, r: 1 + rnd(i * 5.3) * 3, v: 10 + rnd(i * 2.4) * 30 });
  },
  draw(g, u, d, p, sc, P) {
    const PL = bombPlan(d), E = PL.E, X0 = PL.X0, ex = u >= E, te = u - E;
    let bi = -1; for (let k = 0; k < PL.beeps.length; k++) if (u >= PL.beeps[k]) bi = k;
    const sb = bi >= 0 ? u - PL.beeps[bi] : 9; const led = u >= X0 && !ex ? 1 : sb < 0.07 ? 1 : 0;
    const pulse = ex ? 0 : u >= X0 ? 1 : Math.exp(-sb * 12);
    // Hintergrund mit Lichtkegel
    let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0b0a0c"); gr.addColorStop(1, "#1a1210"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    gr = g.createRadialGradient(540, 760, 50, 540, 900, 900); gr.addColorStop(0, "rgba(255,236,210,0.10)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const red = 0.10 + 0.22 * pulse; gr = g.createRadialGradient(540, 880, 50, 540, 880, 760); gr.addColorStop(0, `rgba(255,30,30,${ex ? 0 : red})`); gr.addColorStop(1, "rgba(255,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (ex) { const k = Math.exp(-te * 2.2); gr = g.createRadialGradient(540, 880, 50, 540, 880, 1300); gr.addColorStop(0, `rgba(255,150,50,${0.75 * k + 0.05})`); gr.addColorStop(0.5, `rgba(180,50,10,${0.35 * k + 0.02})`); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    // Staub im Licht (Parallax)
    for (const s of sc.st.dust) { const y = (s.y - u * s.v + H) % H, x = s.x + Math.sin(u + s.y) * 12 + (ex ? (s.x - 540) * te * 0.6 : 0); circle(g, x, y, s.r, `rgba(255,220,190,${0.10 + 0.08 * Math.sin(s.y + u * 2)})`); }
    // Kamera: Fahrt wird schneller, Zeitlupenmoment drückt nach vorn
    const kz = cl(u / X0); const slow = seg(u, X0, E);
    const zoom = ex ? 1.0 + 0.04 * Math.exp(-te * 4) : 1.1 + 0.05 * in3(kz) + 0.05 * kz + 0.07 * out3(slow);
    const intro = outExpo(seg(u, 0, 0.32)); const bump = 0.018 * pulse * (u < X0 ? 1 : 0);
    const rot = ex ? 0 : -0.035 + 0.05 * kz + Math.sin(u * 1.3) * 0.006 + 0.07 * (1 - intro);
    if (!ex) {
      // Bodenschatten
      g.save(); g.translate(BOMB_CX, BOMB_CY + 300 * zoom); g.scale(zoom, zoom * 0.22); const sh = g.createRadialGradient(0, 0, 10, 0, 0, 330); sh.addColorStop(0, "rgba(0,0,0,0.75)"); sh.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sh; g.fillRect(-340, -340, 680, 680); g.restore();
      g.save(); g.translate(BOMB_CX + Math.sin(u * 0.9) * 8, BOMB_CY + Math.cos(u * 1.1) * 6); g.rotate(rot); g.scale(zoom * lerp(1.25, 1, intro) * (1 + bump), zoom * lerp(1.25, 1, intro) * (1 + bump));
      if (u >= X0) { const j = (rnd(Math.floor(u * 60)) - 0.5) * 4; g.translate(j, -j); }
      g.drawImage(sc.st.bomb, -BOMB_O, -BOMB_O);
      // Anzeige
      const B = sc.st.box, ox = B.x - BOMB_O, oy = B.y - BOMB_O; const sx0 = ox + 34, sy0 = oy + 32, sw = B.w - 68, sh2 = B.h - 64;
      const scg = g.createRadialGradient(0, sy0 + sh2 / 2, 10, 0, sy0 + sh2 / 2, 260); scg.addColorStop(0, `rgba(120,0,0,${0.25 + 0.35 * pulse})`); scg.addColorStop(1, "rgba(30,0,0,0)"); g.fillStyle = scg; g.fillRect(sx0, sy0, sw, sh2);
      const num = u >= X0 ? 0 : 3 - Math.floor(u / (X0 / 3)); const digits = [0, 0, 0, Math.max(0, Math.min(3, num))]; const dh = 98, cy = sy0 + sh2 / 2;
      const on = u >= X0 ? (Math.floor((u - X0) * 30) % 2 ? "#ffd0c8" : "#ff3b30") : `rgb(255,${Math.round(40 + 60 * pulse)},${Math.round(30 + 40 * pulse)})`;
      g.save(); g.transform(1, 0, -0.08, 1, 0, 0); shadow(g, 22 + 20 * pulse, 0, "rgba(255,20,20,0.95)");
      const xs = [-128, -58, 58, 128]; digits.forEach((dg, i) => bombSeg7(g, xs[i] + cy * 0.08, cy, dh, dg, on, "rgba(255,40,40,0.07)"));
      g.fillStyle = on; for (const yy of [-22, 22]) { g.beginPath(); g.arc(cy * 0.08, cy + yy, 8, 0, 7); g.fill(); }
      noShadow(g); g.restore();
      // Glas der Anzeige
      gr = g.createLinearGradient(sx0, sy0, sx0 + sw * 0.6, sy0 + sh2); gr.addColorStop(0, "rgba(255,255,255,0.16)"); gr.addColorStop(0.45, "rgba(255,255,255,0.03)"); gr.addColorStop(0.46, "rgba(255,255,255,0)");
      g.fillStyle = gr; rr(g, sx0, sy0, sw, sh2, 12); g.fill();
      // LED
      const lx = ox + B.w - 52, ly = oy + 16; circle(g, lx, ly, 9, led ? "#ffe0dc" : "#4a0a0a");
      if (led) { const lg = g.createRadialGradient(lx, ly, 0, lx, ly, 80); lg.addColorStop(0, "rgba(255,40,40,0.9)"); lg.addColorStop(1, "rgba(255,0,0,0)"); g.fillStyle = lg; g.fillRect(lx - 80, ly - 80, 160, 160); }
      // Etikett
      const lab = (p.label || "IHRE WEBSITE").toUpperCase(); const px = fitPx(g, lab, 380, 58, 900);
      g.save(); g.translate(0, 650 - BOMB_O + 8); g.rotate(-0.055); font(g, 900, px); const tw = g.measureText(lab).width + 60, th = px + 46;
      shadow(g, 18, 8, "rgba(0,0,0,0.5)"); const pg = g.createLinearGradient(0, -th / 2, 0, th / 2); pg.addColorStop(0, "#fffaf0"); pg.addColorStop(1, "#ece2cf");
      g.fillStyle = pg; g.beginPath(); g.moveTo(-tw / 2, -th / 2 + 3); g.lineTo(tw / 2 - 4, -th / 2); g.lineTo(tw / 2, th / 2 - 2); g.lineTo(-tw / 2 + 3, th / 2); g.closePath(); g.fill(); noShadow(g);
      g.strokeStyle = "#d4202a"; g.lineWidth = 5; rr(g, -tw / 2 + 12, -th / 2 + 11, tw - 24, th - 22, 4); g.stroke();
      txt(g, lab, 0, 3, { w: 900, px, c: "#121212" });
      fillRR(g, -tw / 2 - 14, -th / 2 - 8, 70, 30, 3, "rgba(230,230,225,0.55)"); g.restore();
      // Glanz über allem
      g.restore();
      // Zeitlupe: Bild wird kurz kühler und dunkler, Ränder ziehen sich zu
      if (slow > 0) { const vg = g.createRadialGradient(540, 900, 300, 540, 900, 1100); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${0.55 * slow})`); g.fillStyle = vg; g.fillRect(0, 0, W, H); }
    } else {
      // ===== Explosion =====
      const cx = 540, cy = 900;
      // Rauch hinten
      for (const pf of sc.st.puffs) { const k = te - pf.t0 - 0.05; if (k <= 0) continue; const e = outExpo(cl(k / 0.9));
        const x = cx + Math.cos(pf.a) * pf.dist * e * 1.1, y = cy + Math.sin(pf.a) * pf.dist * e * 0.75 - pf.rise * k; const s = pf.sz * (0.35 + 0.65 * e + 0.08 * k);
        const a = cl(k * 5) * (0.95 - 0.12 * cl(k / 2)); g.globalAlpha = a; g.drawImage(pf.dark ? sc.st.smokeD : sc.st.smokeL, x - s / 2, y - s / 2, s, s);
        g.globalAlpha = a * 0.16; g.drawImage(sc.st.smokeH, x - s * 0.36, y - s * 0.52, s * 0.62, s * 0.5);
        const fire = Math.exp(-k * 2.6); if (fire > 0.03) { g.globalCompositeOperation = "lighter"; g.globalAlpha = fire * 0.8; g.drawImage(sc.st.smokeF, x - s * 0.4, y - s * 0.4, s * 0.8, s * 0.8); g.globalCompositeOperation = "source-over"; } }
      g.globalAlpha = 1;
      // Glut im Rauch (bleibt)
      { const k = 0.35 + 0.25 * Math.sin(te * 7) * Math.exp(-te * 0.5); const rgx = g.createRadialGradient(cx, cy + 110 - te * 30, 0, cx, cy + 110 - te * 30, 240); rgx.addColorStop(0, `rgba(255,110,25,${0.32 * k})`); rgx.addColorStop(1, "rgba(255,60,0,0)");
        g.globalCompositeOperation = "lighter"; g.fillStyle = rgx; g.fillRect(0, 0, W, H); g.globalCompositeOperation = "source-over"; }
      // Feuerball
      const fk = cl(te / 0.42), fr = 60 + 520 * outExpo(fk), fa = 1 - seg(te, 0.12, 0.75);
      if (fa > 0) { g.globalCompositeOperation = "lighter"; const fb = g.createRadialGradient(cx, cy, 0, cx, cy, fr);
        fb.addColorStop(0, `rgba(255,255,245,${fa})`); fb.addColorStop(0.25, `rgba(255,236,140,${fa})`); fb.addColorStop(0.55, `rgba(255,140,40,${0.85 * fa})`); fb.addColorStop(0.8, `rgba(200,40,10,${0.5 * fa})`); fb.addColorStop(1, "rgba(120,20,0,0)");
        g.fillStyle = fb; g.beginPath(); g.arc(cx, cy, fr, 0, 7); g.fill(); g.globalCompositeOperation = "source-over"; }
      // Trümmer
      for (const db of sc.st.debris) { const k = te; if (k > 1.6) continue; const dr = (1 - Math.exp(-k * 2.4)) / 2.4;
        const x = cx + Math.cos(db.a) * db.v * dr, y = cy + Math.sin(db.a) * db.v * dr + 1500 * k * k * 0.5; g.save(); g.translate(x, y); g.rotate(db.r * k); g.globalAlpha = 1 - seg(k, 0.9, 1.6);
        if (db.t === 0) { const q = g.createLinearGradient(-db.s / 2, 0, db.s / 2, 0); q.addColorStop(0, "#1a0102"); q.addColorStop(0.5, "#a3161c"); q.addColorStop(1, "#1a0102"); g.fillStyle = q; g.fillRect(-db.s / 2, -db.s * 0.9, db.s, db.s * 1.8); g.fillStyle = "#ffb35a"; g.fillRect(-db.s / 2, -db.s * 0.9, db.s, 4); }
        else { g.fillStyle = "#4d5055"; g.beginPath(); g.moveTo(-db.s, -db.s * 0.3); g.lineTo(db.s * 0.8, -db.s * 0.5); g.lineTo(db.s, db.s * 0.3); g.lineTo(-db.s * 0.7, db.s * 0.4); g.closePath(); g.fill(); }
        g.restore(); }
      // Funken mit Bewegungsunschärfe
      g.globalCompositeOperation = "lighter"; g.lineCap = "round";
      for (const s of sc.st.sparks) { const k = te; if (k > s.L) continue; const pos = (kk) => { const dr = (1 - Math.exp(-kk * 2.2)) / 2.2; return [cx + Math.cos(s.a) * s.v * dr, cy + Math.sin(s.a) * s.v * dr + 700 * kk * kk]; };
        const [x1, y1] = pos(k), [x0, y0] = pos(Math.max(0, k - 0.035)); g.strokeStyle = s.c; g.globalAlpha = 1 - k / s.L; g.lineWidth = s.w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
      // Glutfunken steigen aus der Wolke
      for (let i = 0; i < 34; i++) { const k = te - 0.25 - rnd(i * 3.3) * 0.5; if (k <= 0) continue; const x = cx + (rnd(i * 7.1) - 0.5) * 520 + Math.sin(k * 3 + i) * 20, y = cy + 120 - rnd(i * 2.7) * 200 - k * (90 + rnd(i * 5.9) * 160);
        const fl = 0.5 + 0.5 * Math.sin(te * 23 + i * 1.7); g.globalAlpha = cl(k * 4) * (0.55 + 0.45 * fl) * cl(1.6 - k * 0.5); circle(g, x, y, 2.5 + rnd(i) * 3, i % 3 ? "#ffb347" : "#ffe08a"); }
      g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
      // Schockwelle
      for (let i = 0; i < 2; i++) { const k = seg(te, i * 0.06, 0.55 + i * 0.06); if (k <= 0 || k >= 1) continue; const r = 80 + out3(k) * 1150;
        g.strokeStyle = `rgba(255,245,225,${0.85 * (1 - k)})`; g.lineWidth = 34 * (1 - k) + 2; g.beginPath(); g.ellipse(cx, cy, r, r * 0.92, 0, 0, 7); g.stroke(); }
      // Text
      const bt = p.boom_text == null ? "BOOM." : String(p.boom_text);
      if (bt) { const k = seg(te, 0.14, 0.34); if (k > 0) { const e = outBack(k, 2.6), px = fitPx(g, bt.toUpperCase(), 900, 230, 900); const wob = Math.sin(te * 9) * 0.012 * Math.exp(-te * 2);
        g.save(); g.translate(cx, cy + 10); g.rotate(-0.07 + wob); g.scale(e, e); font(g, 900, px); g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round"; const s = bt.toUpperCase();
        for (let k2 = 14; k2 >= 1; k2--) { g.fillStyle = k2 > 12 ? "#2a0204" : "#b3121b"; g.fillText(s, k2 * 0.9, k2 * 1.1); }
        g.lineWidth = 22; g.strokeStyle = "#140203"; g.strokeText(s, 0, 0);
        const tg = g.createLinearGradient(0, -px / 2, 0, px / 2); tg.addColorStop(0, "#fff6b0"); tg.addColorStop(0.45, "#ffd21f"); tg.addColorStop(1, "#ff8a00"); g.fillStyle = tg; g.fillText(s, 0, 0);
        g.globalAlpha = 0.5; g.fillStyle = "#ffffff"; g.save(); g.beginPath(); g.rect(-px * 3, -px / 2, px * 6, px * 0.32); g.clip(); g.fillText(s, 0, 0); g.restore(); g.restore(); } }
      // Weißer Blitz
      const fl = 1 - seg(te, 0.0, 0.32); if (fl > 0) { g.fillStyle = `rgba(255,252,240,${Math.pow(fl, 1.4)})`; g.fillRect(0, 0, W, H); }
    }
  },
  ev(d, p) {
    const PL = bombPlan(d); const E = PL.beeps.map((t, i) => [t, "bomb_beep", 0.75 + 0.2 * (i / Math.max(1, PL.beeps.length - 1)), 0]);
    E.push([PL.X0, "bomb_zero", 0.9, 0]);
    E.push([PL.E, "bomb_boom", 1.0, 0]); E.push([PL.E, "boom", 0.35, 0]); E.push([PL.E + 0.05, "bomb_debris", 0.6, 0]);
    return E;
  },
};
