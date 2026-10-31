// VOICE_DELAY: 0.5
// h_rechnung: Neugier-Geschichte (Look "cinema", Anti-Werbung). Abends in der Stube knallt ein Briefumschlag auf den Tisch,
// Herr Wolf reißt ihn auf, eine dicke Papierrolle springt heraus. Er lässt sie los: Sie rollt über den Tisch, fällt, rollt zur Tür
// hinaus, die abschüssige Gasse hinunter (ein Passant springt zur Seite), Weitwinkel über die ganze Stadt: das weiße Band schlängelt
// sich durch die Straßen bis ans Meer, Platsch, Möwen. Kameraflug über die Posten (Pauschale, Sonstiges, Aufschlag …), Herr Wolf
// am Strand mit Fragezeichen. Gartenzaun im Sonnenschein: Wolf steckt bis zum Hals im Papier, der Nachbar hält einen Zettel mit
// einer Zeile und lacht. Bei „Denn“ taucht die Kamera in die Zeile, Weiß. Danach rechnung_end (Papier, Filmtitel, eine Zeile 990 €).
// Wörter: rechnung, auftritt, rollt, aus, rollt (2.), tisch, tür, straße, runter, bis, meer, posten (2x), keiner, erklärt, nachbar, zettel, einer, zeile, lacht, denn.
(() => {
  const OL = SK.OL;
  const WOLF = { hs: "short", hair: "#3a2a20", shirt: "#7a5a8a", pants: "#3a3f55", shoes: "#2a1d14", skin: "#efc29c", brow: 0 };
  const NACH = { hs: "grey", hair: "#e4e4ea", shirt: "#e9b949", pants: "#3d6a8a", shoes: "#5a3a26", skin: "#f1c7a1", glasses: true };
  const PAP = "#f6efdf", PAP2 = "#e6dcc4", INKP = "rgba(70,58,48,";
  const ITEMS = ["Pauschale", "Sonstiges", "Aufschlag", "Nachtrag", "Diverses", "Zuschlag", "Extras", "Gebühr", "Bearbeitung", "Nebenkosten", "Pauschale II", "Sonstiges II"];

  // Handposition einer SK.person (Bildkoordinaten)
  function hand(x, feet, s, side, a, bend, o = {}) { const sx = side * 92, sy = -410 + (o.sit ? 140 : 0); const ex = sx + side * Math.cos(a) * 95, ey = sy + Math.sin(a) * 95; const b = a + side * bend; const hx = ex + side * Math.cos(b) * 90, hy = ey + Math.sin(b) * 90; const f = o.flip ? -1 : 1; return [x + hx * s * f, feet + (o.bob || 0) + hy * s]; }
  // Polylinie bis Anteil k: Punkte, Endpunkt, Winkel
  function part(P, k) { const L = []; let tot = 0; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(l); tot += l; }
    let rem = cl(k) * tot; const out = [P[0]]; for (let i = 1; i < P.length; i++) { if (rem >= L[i - 1]) { out.push(P[i]); rem -= L[i - 1]; } else { const f = rem / L[i - 1]; const q = [lerp(P[i - 1][0], P[i][0], f), lerp(P[i - 1][1], P[i][1], f)]; out.push(q); return { pts: out, end: q, ang: Math.atan2(P[i][1] - P[i - 1][1], P[i][0] - P[i - 1][0]), len: tot }; } }
    const n = P.length; return { pts: out, end: P[n - 1], ang: Math.atan2(P[n - 1][1] - P[n - 2][1], P[n - 1][0] - P[n - 2][0]), len: tot }; }
  function path(g, pts) { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); }
  // Papierband entlang einer Linie
  function strip(g, pts, w, o = {}) { if (pts.length < 2) return; g.save(); g.lineJoin = "round"; g.lineCap = "butt";
    if (o.shadow) { g.save(); g.translate(0, w * 0.35); path(g, pts); g.strokeStyle = "rgba(0,0,0,0.28)"; g.lineWidth = w + 6; g.stroke(); g.restore(); }
    path(g, pts); g.strokeStyle = OL; g.lineWidth = w + (o.ol || 8); g.stroke(); g.strokeStyle = o.c || PAP; g.lineWidth = w; g.stroke();
    if (w > 14) { g.setLineDash([w * 0.55, w * 0.25, w * 1.1, w * 0.3, w * 0.4, w * 0.5]); g.strokeStyle = INKP + "0.32)"; g.lineWidth = w * 0.34; path(g, pts); g.stroke(); g.setLineDash([]); }
    g.restore(); }
  // Rolle von der Stirnseite (Spirale), dreht mit ang
  function roll(g, x, y, r, ang) { g.save(); g.translate(x, y); g.lineWidth = Math.max(3, r * 0.1); g.strokeStyle = OL; g.fillStyle = PAP; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.stroke();
    g.lineWidth = Math.max(1.5, r * 0.045); g.strokeStyle = INKP + "0.55)"; for (let k = 1; k <= 4; k++) { g.beginPath(); g.arc(0, 0, r * (0.25 + k * 0.17), ang + k, ang + k + 4.6); g.stroke(); }
    g.fillStyle = "#8a6a4a"; g.beginPath(); g.arc(0, 0, r * 0.2, 0, 7); g.fill(); g.lineWidth = Math.max(2, r * 0.06); g.strokeStyle = OL; g.stroke();
    g.fillStyle = "rgba(0,0,0,0.12)"; g.beginPath(); g.arc(0, 0, r, 0.2, 2.6); g.arc(0, -r * 0.15, r * 0.9, 2.6, 0.2, true); g.fill(); g.restore(); }
  function glow(g, x, y, r, c, a) { if (a <= 0) return; const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(${c},${a})`); gg.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function gull(g, x, y, s, u, i) { const f = Math.sin(u * 9 + i * 1.7) * 0.5; g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = "#f4f1ea"; g.lineWidth = 6; g.lineCap = "round"; g.beginPath(); g.moveTo(-40, -10 - f * 22); g.quadraticCurveTo(-18, -18 - f * 10, 0, 0); g.quadraticCurveTo(18, -18 - f * 10, 40, -10 - f * 22); g.stroke(); g.strokeStyle = "rgba(40,30,40,0.6)"; g.lineWidth = 2; g.stroke(); g.restore(); }
  function sunsetSky(g, y0, y1, hz) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, "#1b1d3e"); gr.addColorStop(0.45, "#5a3f6e"); gr.addColorStop(0.8, "#d9765a"); gr.addColorStop(1, "#f5b46a"); g.fillStyle = gr; g.fillRect(-400, y0, W + 800, y1 - y0); }
  function sea(g, u, hz, y1, sunX) { const gr = g.createLinearGradient(0, hz, 0, y1); gr.addColorStop(0, "#c8775f"); gr.addColorStop(0.12, "#4a4e7a"); gr.addColorStop(1, "#16203c"); g.fillStyle = gr; g.fillRect(-400, hz, W + 800, y1 - hz);
    for (let i = 0; i < 26; i++) { const yy = hz + 8 + Math.pow(i / 26, 1.6) * (y1 - hz); const wv = 30 + i * 9; const x = sunX + Math.sin(u * 2 + i * 1.3) * 14; g.fillStyle = `rgba(255,200,130,${0.5 * (1 - i / 26)})`; g.fillRect(x - wv / 2, yy, wv, 3 + i * 0.3); }
    g.strokeStyle = "rgba(255,255,255,0.10)"; g.lineWidth = 2; for (let i = 0; i < 14; i++) { const yy = hz + 20 + i * (y1 - hz) / 14; const xo = ((u * 30 + i * 97) % 300); g.beginPath(); for (let x = -300 + xo; x < W + 300; x += 300) { g.moveTo(x, yy); g.quadraticCurveTo(x + 40, yy - 5, x + 80, yy); } g.stroke(); } }

  // ---------- Stube (Welt bis x 2400) ----------
  const TOP = 1105, ROLLR = 52, FLOOR = 1390;
  function room(g, u, doorOpen) {
    const wall = g.createLinearGradient(0, 0, 0, FLOOR); wall.addColorStop(0, "#2a1810"); wall.addColorStop(1, "#5a3420"); g.fillStyle = wall; g.fillRect(-300, -200, 3000, FLOOR + 200);
    g.fillStyle = "rgba(255,220,170,0.05)"; for (let x = -300; x < 2700; x += 70) g.fillRect(x, -200, 26, FLOOR + 200);
    g.fillStyle = "#3a2214"; g.fillRect(-300, FLOOR - 120, 3000, 18); // Leiste
    // Fenster mit Nachtstadt
    g.save(); g.lineWidth = 10; g.strokeStyle = OL; const wg = g.createLinearGradient(0, 470, 0, 900); wg.addColorStop(0, "#0b1230"); wg.addColorStop(1, "#24305a"); g.fillStyle = wg; rr(g, 1180, 470, 420, 470, 10); g.fill();
    g.save(); g.beginPath(); g.rect(1180, 470, 420, 470); g.clip(); for (let i = 0; i < 30; i++) circle(g, 1180 + rnd(i * 3.1) * 420, 480 + rnd(i * 5.3) * 200, 2, "rgba(255,255,255,0.6)");
    for (let i = 0; i < 6; i++) { const bx = 1170 + i * 80, bh = 160 + rnd(i * 2.2) * 200; g.fillStyle = "#121a38"; g.fillRect(bx, 940 - bh, 72, bh); for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) if (rnd(i * 9 + r * 2 + c) > 0.5) { g.fillStyle = "rgba(255,200,120,0.8)"; g.fillRect(bx + 12 + c * 28, 940 - bh + 18 + r * 32, 14, 16); } } g.restore();
    rr(g, 1180, 470, 420, 470, 10); g.stroke(); g.beginPath(); g.moveTo(1390, 470); g.lineTo(1390, 940); g.moveTo(1180, 700); g.lineTo(1600, 700); g.stroke();
    g.fillStyle = "#7a2a2a"; rr(g, 1140, 450, 70, 520, 10); g.fill(); g.stroke(); rr(g, 1570, 450, 70, 520, 10); g.fill(); g.stroke(); g.restore();
    // Bilderrahmen, Regal
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#b8893a"; rr(g, 60, 560, 220, 170, 6); g.fill(); g.stroke(); g.fillStyle = "#4a6a5a"; g.fillRect(80, 580, 180, 130); g.fillStyle = "#e8c070"; g.beginPath(); g.arc(200, 620, 22, 0, 7); g.fill(); g.fillStyle = "#2f4a3a"; g.beginPath(); g.moveTo(80, 710); g.lineTo(150, 630); g.lineTo(210, 690); g.lineTo(260, 650); g.lineTo(260, 710); g.fill();
    g.fillStyle = "#4a2c1a"; rr(g, 820, 520, 260, 26, 4); g.fill(); g.stroke(); const BC = ["#a33a2a", "#2f5a7a", "#c49a3a", "#3a6a4a", "#6a3a6a"]; for (let i = 0; i < 7; i++) { g.fillStyle = BC[i % 5]; rr(g, 836 + i * 32, 520 - 70 - (i % 3) * 12, 26, 70 + (i % 3) * 12, 3); g.fill(); g.stroke(); }
    // Garderobe mit Mantel und Hut
    g.fillStyle = "#3a2214"; g.fillRect(1730, 560, 16, 800); g.fillStyle = "#5a5a6a"; rr(g, 1690, 600, 100, 300, 30); g.fill(); g.stroke(); g.fillStyle = "#2a2a34"; g.beginPath(); g.ellipse(1738, 570, 70, 16, 0, 0, 7); g.fill(); g.stroke(); rr(g, 1700, 520, 76, 54, 12); g.fill(); g.stroke();
    // Tür
    g.fillStyle = "#1a0f08"; g.fillRect(1940, 720, 300, FLOOR - 720); if (doorOpen > 0) { glow(g, 2090, 1050, 420, "255,190,110", 0.45 * doorOpen); g.fillStyle = `rgba(20,26,54,${doorOpen})`; g.fillRect(1950, 730, 280, FLOOR - 740); for (let i = 0; i < 3; i++) circle(g, 2000 + i * 90, 820 + (i % 2) * 40, 5, `rgba(255,220,150,${doorOpen})`); }
    const dw = 300 * (1 - 0.82 * doorOpen); g.fillStyle = "#6b3f22"; g.fillRect(1940, 720, dw, FLOOR - 720); g.strokeStyle = OL; g.lineWidth = 8; g.strokeRect(1940, 720, dw, FLOOR - 720); g.strokeRect(1940 + dw * 0.15, 780, dw * 0.7, 240); g.strokeRect(1940 + dw * 0.15, 1080, dw * 0.7, 240); circle(g, 1940 + dw * 0.85, 1060, 12, "#d9b45a"); g.stroke();
    g.strokeRect(1925, 705, 330, FLOOR - 705);
    // Boden (Dielen)
    const fg = g.createLinearGradient(0, FLOOR, 0, FLOOR + 600); fg.addColorStop(0, "#6a3e22"); fg.addColorStop(1, "#3a2010"); g.fillStyle = fg; g.fillRect(-300, FLOOR, 3000, 800); g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 4; for (let i = 0; i < 6; i++) { const yy = FLOOR + 30 + i * i * 22; g.beginPath(); g.moveTo(-300, yy); g.lineTo(2700, yy); g.stroke(); }
    g.fillStyle = "#7a2a2a"; g.beginPath(); g.ellipse(700, FLOOR + 120, 620, 70, 0, 0, 7); g.fill(); g.strokeStyle = "#b8893a"; g.lineWidth = 6; g.beginPath(); g.ellipse(700, FLOOR + 120, 570, 55, 0, 0, 7); g.stroke();
  }
  function lampAt(g, u) { g.strokeStyle = "#140a05"; g.lineWidth = 6; g.beginPath(); g.moveTo(600 + Math.sin(u * 1.3) * 4, -200); g.lineTo(600 + Math.sin(u * 1.3) * 8, 470); g.stroke();
    const lx = 600 + Math.sin(u * 1.3) * 8; g.fillStyle = "rgba(255,200,120,0.10)"; g.beginPath(); g.moveTo(lx - 90, 540); g.lineTo(lx + 90, 540); g.lineTo(lx + 560, TOP + 40); g.lineTo(lx - 560, TOP + 40); g.closePath(); g.fill(); glow(g, lx, 560, 380, "255,200,120", 0.35);
    g.fillStyle = "#2f5a4a"; g.strokeStyle = OL; g.lineWidth = 8; g.beginPath(); g.moveTo(lx - 40, 470); g.lineTo(lx + 40, 470); g.lineTo(lx + 110, 545); g.lineTo(lx - 110, 545); g.closePath(); g.fill(); g.stroke(); circle(g, lx, 552, 22, "#fff1c8"); }
  function table(g) { g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#4a2a16"; for (const x of [230, 1140]) { g.fillRect(x, TOP + 40, 34, FLOOR + 70 - TOP - 40); g.strokeRect(x, TOP + 40, 34, FLOOR + 70 - TOP - 40); }
    g.fillStyle = "#8a5430"; g.beginPath(); g.moveTo(190, TOP - 22); g.lineTo(1190, TOP - 22); g.lineTo(1215, TOP + 22); g.lineTo(165, TOP + 22); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#6a3c20"; rr(g, 165, TOP + 22, 1050, 30, 4); g.fill(); g.stroke();
    g.fillStyle = "#fff4e2"; g.beginPath(); g.ellipse(250, TOP - 4, 46, 12, 0, 0, 7); g.fill(); g.stroke(); rr(g, 220, TOP - 66, 60, 62, 10); g.fill(); g.stroke(); g.beginPath(); g.arc(286, TOP - 36, 16, -1.4, 1.4); g.stroke(); }
  function envelope(g, x, y, open, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#efe0c0"; rr(g, -150, -55, 300, 110, 8); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-150, 55); g.lineTo(0, -5); g.lineTo(150, 55); g.stroke();
    g.save(); g.scale(1, lerp(1, -1.4, open)); g.fillStyle = "#e2cfa6"; g.beginPath(); g.moveTo(-150, -55); g.lineTo(0, 20); g.lineTo(150, -55); g.closePath(); g.fill(); g.stroke(); g.restore(); if (open < 0.3) circle(g, 0, 18, 16, "#a3262f"); g.restore(); }

  // ---------- Gasse abwärts ----------
  const GY = (x) => 980 + 0.42 * x;
  function alley(g, u, cam, rx) {
    for (let i = -3; i < 12; i++) { const hx = i * 360 - 380, w = 320, base = GY(hx + w / 2) + 30, hh = 560 + rnd(i * 4.4 + 9) * 300; if (hx + w < cam.x - 800 || hx > cam.x + 800) continue;
      const col = ["#3a3550", "#4a3442", "#2f3b55", "#45384a"][(i + 8) % 4]; g.lineWidth = 7; g.strokeStyle = "#120d18"; g.fillStyle = col; g.fillRect(hx, base - hh, w, hh + 400); g.strokeRect(hx, base - hh, w, hh + 400);
      g.fillStyle = "#2a1d2a"; g.beginPath(); g.moveTo(hx - 20, base - hh); g.lineTo(hx + w / 2, base - hh - 130); g.lineTo(hx + w + 20, base - hh); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#1a121e"; g.fillRect(hx + w * 0.7, base - hh - 120, 34, 90);
      for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) { const wy = base - hh + 50 + r * 105; if (wy > base - 110) continue; const on = rnd(i * 31 + r * 3 + c) > 0.45; g.fillStyle = on ? "rgba(255,196,120,0.9)" : "#1a1424"; g.fillRect(hx + 34 + c * 92, wy, 58, 70); g.strokeRect(hx + 34 + c * 92, wy, 58, 70); } }
    // Laternen
    for (let i = 0; i < 8; i++) { const lx = i * 640 + 180; if (Math.abs(lx - cam.x) > 900) continue; const gy = GY(lx); g.fillStyle = "#0d0a12"; g.fillRect(lx - 7, gy - 470, 14, 470); glow(g, lx, gy - 470, 300, "255,200,120", 0.5); circle(g, lx, gy - 470, 16, "#ffe9b8"); }
    // Straße (Kopfstein)
    g.fillStyle = "#2c2534"; g.beginPath(); g.moveTo(cam.x - 1200, GY(cam.x - 1200)); g.lineTo(cam.x + 1200, GY(cam.x + 1200)); g.lineTo(cam.x + 1200, GY(cam.x + 1200) + 900); g.lineTo(cam.x - 1200, GY(cam.x - 1200) + 900); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,210,160,0.08)"; for (let i = 0; i < 160; i++) { const x = Math.floor(cam.x / 60) * 60 - 1100 + (i % 40) * 60, row = Math.floor(i / 40); g.beginPath(); g.ellipse(x + (row % 2) * 30, GY(x) + 30 + row * 46, 24, 12, 0.4, 0, 7); g.fill(); }
    g.strokeStyle = "#120d18"; g.lineWidth = 7; g.beginPath(); g.moveTo(cam.x - 1200, GY(cam.x - 1200)); g.lineTo(cam.x + 1200, GY(cam.x + 1200)); g.stroke();
    // Haus von Herrn Wolf mit offener Tür (links oben)
    const dx = -160; g.fillStyle = "rgba(255,190,110,0.85)"; g.fillRect(dx - 60, GY(dx) - 300, 120, 300); g.strokeRect(dx - 60, GY(dx) - 300, 120, 300); glow(g, dx, GY(dx) - 100, 320, "255,190,110", 0.4);
    // Papier auf der Straße
    const pts = []; for (let x = dx; x <= rx; x += 40) pts.push([x, GY(x) + 18]); pts.push([rx, GY(rx) + 18]); strip(g, pts, 26, { ol: 6 });
  }

  // ---------- Stadt bis ans Meer (Weitwinkel) ----------
  const RIB = [[180, 520], [560, 600], [250, 730], [600, 840], [290, 975], [640, 1080], [360, 1210], [720, 1290], [900, 1365]];
  const LAND = [[-60, 430], [120, 440], [330, 470], [520, 620], [620, 1000], [790, 1250], [880, 1520], [930, 1960], [-60, 1960]];
  const coastX = (y) => { for (let i = 4; i < 8; i++) { const A = LAND[i], B = LAND[i + 1]; if (y >= A[1] && y <= B[1]) return lerp(A[0], B[0], (y - A[1]) / (B[1] - A[1])); } return y < 1000 ? 620 : 930; };
  function city(g, u, k, splash) {
    sunsetSky(g, -400, 1000, 1000); glow(g, 880, 1000, 520, "255,170,90", 0.55); g.fillStyle = "#ffcf7a"; g.beginPath(); g.arc(880, 1000, 105, Math.PI, 0); g.fill();
    sea(g, u, 1000, 2300, 880);
    for (let i = 0; i < 4; i++) { const bx = 760 + i * 110 + Math.sin(u * 0.6 + i) * 10, by = 1120 + i * 120; g.fillStyle = "#1a1626"; g.beginPath(); g.moveTo(bx - 34, by); g.lineTo(bx + 34, by); g.lineTo(bx + 24, by + 14); g.lineTo(bx - 24, by + 14); g.closePath(); g.fill(); g.fillStyle = "#f4ead8"; g.beginPath(); g.moveTo(bx, by - 4); g.lineTo(bx, by - 56); g.lineTo(bx + 28, by - 8); g.closePath(); g.fill(); }
    // Land
    const lg = g.createLinearGradient(0, 430, 0, 1900); lg.addColorStop(0, "#3a3048"); lg.addColorStop(1, "#1e1a2a"); g.fillStyle = lg; path(g, LAND); g.closePath(); g.fill();
    g.strokeStyle = "#e0b88a"; g.lineWidth = 26; g.beginPath(); for (let i = 4; i < 8; i++) { const p = LAND[i]; i === 4 ? g.moveTo(p[0], p[1]) : g.lineTo(p[0], p[1]); } g.stroke(); g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 4; g.setLineDash([30, 20]); g.lineDashOffset = -u * 30; g.beginPath(); for (let i = 4; i < 8; i++) { const p = LAND[i]; i === 4 ? g.moveTo(p[0] + 18, p[1]) : g.lineTo(p[0] + 18, p[1]); } g.stroke(); g.setLineDash([]);
    // Häuser
    for (let yy = 470; yy < 1900; yy += 62) { const row = Math.round(yy / 62); for (let x = -40 + (row % 2) * 44; x < 900; x += 88) { const cx = coastX(yy) - 50; if (x > cx) continue; if (yy < 520 && x > 330 + (yy - 470) * 1.2) continue; const j = row * 17 + x; if (rnd(j * 0.37 + 5) > 0.55) { if (rnd(j * 0.91) > 0.45) { g.fillStyle = "#26302e"; g.beginPath(); g.arc(x + 20, yy - 14, 22, 0, 7); g.arc(x + 46, yy - 8, 18, 0, 7); g.fill(); } continue; }
        const c = ["#5a4a62", "#6a4a4a", "#4a5470", "#5e5a4a", "#6a5468"][Math.floor(rnd(j) * 5)]; g.fillStyle = c; g.fillRect(x, yy - 34, 64, 40); g.fillStyle = ["#8a3a2a", "#6a2a2a", "#3a2a3a"][Math.floor(rnd(j * 1.3) * 3)]; g.beginPath(); g.moveTo(x - 6, yy - 34); g.lineTo(x + 32, yy - 58); g.lineTo(x + 70, yy - 34); g.closePath(); g.fill();
        for (let w = 0; w < 3; w++) if (rnd(j * 2.7 + w) > 0.4) { g.fillStyle = "rgba(255,200,120,0.9)"; g.fillRect(x + 8 + w * 19, yy - 24, 9, 11); } } }
    // Leuchtturm
    const lx = 600, ly = 980; g.fillStyle = "#f2ece0"; g.beginPath(); g.moveTo(lx - 18, ly); g.lineTo(lx + 18, ly); g.lineTo(lx + 11, ly - 120); g.lineTo(lx - 11, ly - 120); g.closePath(); g.fill(); g.fillStyle = "#b8452a"; g.fillRect(lx - 15, ly - 60, 30, 18); g.fillRect(lx - 12, ly - 100, 24, 14); circle(g, lx, ly - 130, 13, "#ffe9a8");
    const ba = u * 1.6; g.save(); g.translate(lx, ly - 130); g.rotate(Math.sin(ba) * 0.9); const bg2 = g.createLinearGradient(0, 0, 520, 0); bg2.addColorStop(0, "rgba(255,235,170,0.5)"); bg2.addColorStop(1, "rgba(255,235,170,0)"); g.fillStyle = bg2; g.beginPath(); g.moveTo(0, 0); g.lineTo(520, -50); g.lineTo(520, 50); g.closePath(); g.fill(); g.restore();
    // Haus von Herrn Wolf oben
    g.lineWidth = 4; g.strokeStyle = OL; g.fillStyle = "#7a5a8a"; g.fillRect(130, 470, 100, 60); g.strokeRect(130, 470, 100, 60); g.fillStyle = "#a3262f"; g.beginPath(); g.moveTo(120, 470); g.lineTo(180, 432); g.lineTo(240, 470); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "rgba(255,200,120,1)"; g.fillRect(168, 498, 22, 32); glow(g, 180, 515, 90, "255,200,120", 0.5);
    // Papierband
    const pr = part(RIB, k); strip(g, pr.pts, 15, { ol: 5, shadow: true });
    if (!splash) { const [ex, ey] = pr.end; roll(g, ex, ey - 12, 16, -k * 60); }
    else { const [ex, ey] = RIB[RIB.length - 1]; for (let i = 0; i < 3; i++) { const q = cl(splash * 1.2 - i * 0.18); if (q > 0 && q < 1) { g.strokeStyle = `rgba(255,255,255,${0.8 * (1 - q)})`; g.lineWidth = 4; g.beginPath(); g.ellipse(ex, ey, 20 + q * 120, 6 + q * 34, 0, 0, 7); g.stroke(); } }
      for (let i = 0; i < 14; i++) { const a = -Math.PI / 2 + (rnd(i * 3.3) - 0.5) * 1.8, v = 140 + rnd(i) * 160, q = cl(splash * 1.6); if (q >= 1) continue; const px = ex + Math.cos(a) * v * q, py = ey + Math.sin(a) * v * q + 260 * q * q; circle(g, px, py, 5 + rnd(i * 2) * 4, `rgba(235,245,255,${1 - q})`); } }
    for (let i = 0; i < 6; i++) { const a = u * 0.9 + i * 1.05; gull(g, 820 + Math.cos(a) * (120 + i * 18), 1180 + Math.sin(a) * 50 - i * 30, 0.5 + 0.06 * i, u, i); }
  }

  // ---------- Posten im Vorbeiflug ----------
  function itemsFly(g, u, off) {
    const sg = g.createLinearGradient(0, 0, 0, H); sg.addColorStop(0, "#b48a6a"); sg.addColorStop(1, "#7a5a48"); g.fillStyle = sg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 220; i++) circle(g, rnd(i * 1.7) * W, ((rnd(i * 3.9) * H + off * 0.9) % H), 2 + rnd(i) * 2, "rgba(60,40,30,0.25)");
    const fx = ((off * 0.5) % 700); g.fillStyle = "rgba(255,255,255,0.35)"; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(1000 + Math.sin(u * 2 + i) * 30, -200 + i * 700 - fx + 700, 120, 260, 0, 0, 7); g.fill(); }
    g.save(); g.translate(540, 960); g.rotate(-0.22); g.fillStyle = "rgba(0,0,0,0.3)"; g.fillRect(-300 + 18, -1600, 600, 3200);
    g.fillStyle = PAP; g.fillRect(-300, -1600, 600, 3200); g.strokeStyle = OL; g.lineWidth = 8; g.beginPath(); g.moveTo(-300, -1600); g.lineTo(-300, 1600); g.moveTo(300, -1600); g.lineTo(300, 1600); g.stroke();
    g.fillStyle = "rgba(120,100,80,0.08)"; for (let i = 0; i < 40; i++) g.fillRect(-300, -1600 + i * 80 + (off % 80), 600, 2);
    const step = 210; const first = Math.floor((off - 1400) / step);
    for (let n = first; n < first + 16; n++) { const y = -(n * step - off) ; if (y < -1300 || y > 1300) continue; const it = ITEMS[((n % ITEMS.length) + ITEMS.length) % ITEMS.length];
      g.font = "600 50px I"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillStyle = "#3a2e26"; g.fillText(it, -250, y);
      g.fillStyle = "rgba(58,46,38,0.5)"; const tw = g.measureText(it).width; for (let x = -250 + tw + 20; x < 90; x += 22) g.fillRect(x, y + 14, 8, 5);
      g.strokeStyle = "#3a2e26"; g.lineWidth = 5; g.beginPath(); g.moveTo(120, y + 6); for (let x = 0; x < 6; x++) g.quadraticCurveTo(130 + x * 22, y - 22 + (x % 2) * 40 * rnd(n + x), 142 + x * 22, y + 6); g.stroke(); g.font = "600 46px I"; g.textAlign = "right"; g.fillStyle = "#3a2e26"; g.fillText("€", 270, y);
      g.strokeStyle = "rgba(58,46,38,0.25)"; g.lineWidth = 2; g.beginPath(); g.moveTo(-260, y + 60); g.lineTo(260, y + 60); g.stroke(); }
    g.restore();
    const vg = g.createRadialGradient(540, 960, 400, 540, 960, 1200); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(30,10,0,0.5)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  }

  // ---------- Strand ----------
  function beach(g, u) { sunsetSky(g, 0, 930, 930); glow(g, 760, 930, 500, "255,170,90", 0.55); g.fillStyle = "#ffcf7a"; g.beginPath(); g.arc(760, 930, 90, Math.PI, 0); g.fill(); sea(g, u, 930, 1200, 760);
    for (let i = 0; i < 3; i++) { const q = ((u * 0.35 + i / 3) % 1); g.strokeStyle = `rgba(255,255,255,${0.6 * (1 - q)})`; g.lineWidth = 6; g.beginPath(); g.moveTo(-50, 1190 + q * 60); for (let x = 0; x <= 1150; x += 115) g.quadraticCurveTo(x + 57, 1180 + q * 60 + Math.sin(x + i) * 10, x + 115, 1190 + q * 60); g.stroke(); }
    const sg = g.createLinearGradient(0, 1200, 0, H); sg.addColorStop(0, "#d8a878"); sg.addColorStop(1, "#8a6248"); g.fillStyle = sg; g.fillRect(0, 1215, W, H - 1215); for (let i = 0; i < 120; i++) circle(g, rnd(i * 2.9) * W, 1230 + rnd(i * 4.1) * 700, 2 + rnd(i) * 2, "rgba(80,50,30,0.3)");
    for (let i = 0; i < 5; i++) { const a = u * 1.1 + i * 1.3; gull(g, 300 + i * 150 + Math.cos(a) * 40, 640 + Math.sin(a) * 30 + (i % 2) * 70, 0.9, u, i); } }

  // ---------- Garten ----------
  function garden(g, u) { const sk = g.createLinearGradient(0, 0, 0, 1200); sk.addColorStop(0, "#5fa8e8"); sk.addColorStop(1, "#ffe3a8"); g.fillStyle = sk; g.fillRect(-300, -300, W + 600, 1600);
    glow(g, 900, 300, 420, "255,240,180", 0.8); circle(g, 900, 300, 80, "#fff6cf"); g.save(); g.translate(900, 300); g.rotate(u * 0.15); g.strokeStyle = "rgba(255,246,200,0.45)"; g.lineWidth = 10; for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.beginPath(); g.moveTo(110, 0); g.lineTo(170, 0); g.stroke(); } g.restore();
    for (let i = 0; i < 3; i++) { const cx = ((i * 420 + u * 18) % 1500) - 200, cy = 220 + i * 90; g.fillStyle = "rgba(255,255,255,0.9)"; for (const [dx, dy, r] of [[0, 0, 50], [50, -20, 60], [100, 0, 48], [50, 16, 50]]) { g.beginPath(); g.arc(cx + dx, cy + dy, r, 0, 7); g.fill(); } }
    g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#8a9ab0"; g.fillRect(-40, 560, 500, 700); g.strokeRect(-40, 560, 500, 700); g.fillStyle = "#4a5a70"; g.beginPath(); g.moveTo(-70, 560); g.lineTo(210, 380); g.lineTo(490, 560); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#e9c88a"; g.fillRect(610, 590, 520, 700); g.strokeRect(610, 590, 520, 700); g.fillStyle = "#b8452a"; g.beginPath(); g.moveTo(580, 590); g.lineTo(870, 400); g.lineTo(1160, 590); g.closePath(); g.fill(); g.stroke();
    for (const [x, y] of [[40, 660], [300, 660], [680, 690], [930, 690]]) { g.fillStyle = "#cfe6f5"; g.fillRect(x, y, 120, 130); g.strokeRect(x, y, 120, 130); g.beginPath(); g.moveTo(x + 60, y); g.lineTo(x + 60, y + 130); g.moveTo(x, y + 65); g.lineTo(x + 120, y + 65); g.stroke(); g.fillStyle = "#c0473a"; g.fillRect(x - 6, y + 130, 132, 20); g.strokeRect(x - 6, y + 130, 132, 20); for (let k = 0; k < 4; k++) circle(g, x + 14 + k * 30, y + 126, 11, ["#e85d75", "#ffd34d", "#f2b134", "#c44569"][k]); }
    g.fillStyle = "#3f7a3a"; g.fillRect(-40, 1060, W + 80, 200); for (let i = 0; i < 26; i++) { g.beginPath(); g.arc(i * 46, 1062, 34, Math.PI, 0); g.fill(); }
  }
  function fence(g) { g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = "#f5f2ea"; rr(g, -20, 1215, W + 40, 26, 4); g.fill(); g.stroke(); rr(g, -20, 1305, W + 40, 26, 4); g.fill(); g.stroke();
    for (let x = 10; x < W; x += 66) { g.beginPath(); g.moveTo(x, 1395); g.lineTo(x, 1180); g.lineTo(x + 20, 1155); g.lineTo(x + 40, 1180); g.lineTo(x + 40, 1395); g.closePath(); g.fill(); g.stroke(); }
    g.fillStyle = "#e8e2d4"; rr(g, 520, 1120, 52, 290, 6); g.fill(); g.stroke();
    const gg = g.createLinearGradient(0, 1380, 0, H); gg.addColorStop(0, "#5aa04a"); gg.addColorStop(1, "#2f6a2a"); g.fillStyle = gg; g.fillRect(-20, 1380, W + 40, H - 1380);
    for (let i = 0; i < 18; i++) { const x = rnd(i * 5.5) * W, y = 1420 + rnd(i * 2.1) * 360; circle(g, x, y, 9, ["#ffffff", "#ffd34d", "#e85d75"][i % 3]); } }
  function note(g, x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineWidth = 5; g.strokeStyle = OL; g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(-72, -44, 156, 100); g.fillStyle = "#fffaf0"; g.fillRect(-80, -52, 160, 100); g.strokeRect(-80, -52, 160, 100);
    g.strokeStyle = "#3a2e26"; g.lineWidth = 4; g.beginPath(); g.moveTo(-58, 2); for (let i = 0; i < 6; i++) g.quadraticCurveTo(-48 + i * 16, -10 + (i % 2) * 22, -40 + i * 16, 2); g.lineTo(30, 2); g.stroke(); g.lineWidth = 3; g.beginPath(); g.moveTo(40, 6); g.lineTo(62, 6); g.stroke(); g.restore(); }
  function pile(g, x, y, u, k) { if (k <= 0) return; g.save(); g.lineJoin = "round"; for (let i = 0; i < 12; i++) { const a = rnd(i * 2.2) * 6.28, rx = (90 + rnd(i * 4.4) * 140) * k, ry = (34 + rnd(i * 1.1) * 50) * k, cx = x + Math.cos(a) * 60 * k, cy = y - i * 13 * k + Math.sin(u * 2 + i) * 3;
      g.beginPath(); g.ellipse(cx, cy, rx, ry, rnd(i) - 0.5, 0, 7); g.strokeStyle = OL; g.lineWidth = 34; g.stroke(); g.strokeStyle = i % 2 ? PAP : PAP2; g.lineWidth = 26; g.stroke(); g.strokeStyle = INKP + "0.3)"; g.lineWidth = 8; g.setLineDash([22, 12, 40, 14]); g.stroke(); g.setLineDash([]); } g.restore(); }

  TYPES.h_rechnung = {
    zone: "top", pal: "c_warm", bgv: 0, coverT: 7.6, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.rechnung = f(/^rechnung/, 0, 1.7); T.auftritt = f(/^auftritt/, T.rechnung, T.rechnung + 1.2); T.rollt1 = f(/^rollt/, T.auftritt, T.auftritt + 0.7); T.aus = f(/^aus$/, T.rollt1, T.rollt1 + 0.4);
      T.rollt2 = f(/^rollt/, T.aus, T.aus + 0.6); T.tisch = f(/^tisch/, T.rollt2, T.rollt2 + 0.6); T.tuer = f(/^tür/, T.tisch, T.tisch + 0.7); T.strasse = f(/^straße/, T.tuer, T.tuer + 0.6); T.runter = f(/^runter/, T.strasse, T.strasse + 0.4);
      T.bis = f(/^bis$/, T.runter, T.runter + 0.35); T.meer = f(/^meer/, T.bis, T.bis + 0.45); T.posten = f(/^posten/, T.meer, T.meer + 0.8); T.posten2 = f(/^posten/, T.posten + 0.1, T.posten + 0.6);
      T.keiner = f(/^keiner/, T.posten2, T.posten2 + 0.7); T.erkl = f(/^erklärt/, T.keiner, T.keiner + 0.4); T.nachbar = f(/^nachbar/, T.erkl, T.erkl + 0.9); T.zettel = f(/^zettel/, T.nachbar, T.nachbar + 1.5);
      T.einer = f(/^einer$/, T.zettel, T.zettel + 0.45); T.zeile = f(/^zeile/, T.einer, T.einer + 0.3); T.lacht = f(/^lacht/, T.zeile, T.zeile + 0.7); T.denn = f(/^denn/, T.lacht, T.lacht + 0.9);
      T.bC = T.tuer + 0.18; T.bD = T.bis - 0.05; T.bE = T.posten - 0.12; T.bF = T.keiner - 0.15; T.bG = T.nachbar - 0.2;
      TYPES.h_rechnung.coverT = T.meer + 0.55; p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
      if (u < T.bC) { // ---------- Stube ----------
        const drop = T.rollt1 + 0.22, onTable = T.tisch, onFloor = T.tisch + 0.28, out = T.tuer + 0.18;
        let rx, ry, rang = 0; const held = [608, 900];
        if (u < drop) { const pop = out3(seg(u, T.rechnung + 0.05, T.rechnung + 0.4)); rx = lerp(640, held[0], pop); ry = lerp(TOP - 40, held[1], pop) - Math.sin(Math.PI * pop) * 120; }
        else if (u < onTable) { const k = seg(u, drop, onTable); const fall = out3(seg(u, drop, drop + 0.18)); rx = lerp(held[0] + 40, 1170, k * k * 0.4 + k * 0.6); ry = lerp(held[1], TOP - ROLLR + 6, fall) - (fall < 1 ? 0 : Math.abs(Math.sin(k * 9)) * 10 * (1 - k)); rang = rx / ROLLR; }
        else if (u < onFloor) { const k = seg(u, onTable, onFloor); rx = lerp(1170, 1290, k); ry = lerp(TOP - ROLLR + 6, FLOOR + 50 - ROLLR, k * k); rang = rx / ROLLR; }
        else { const k = seg(u, onFloor, out + 0.05); rx = lerp(1290, 2160, k); ry = FLOOR + 50 - ROLLR - Math.abs(Math.sin(k * 7)) * 18 * (1 - k); rang = rx / ROLLR; }
        const fk = inOut(seg(u, drop + 0.1, T.tisch)); const camX = lerp(lerp(545, 570, cl(u / Math.max(0.5, T.rollt1))), Math.max(640, Math.min(1830, rx)), fk), z = lerp(1.42 + 0.08 * cl(u / Math.max(0.5, T.rollt1)), 1.22, fk);
        const camY = lerp(1010, 1090, fk); const sh = u < 0.3 ? Math.sin(u * 90) * 14 * (1 - u / 0.3) : 0;
        g.save(); g.translate(540, 960 + sh); g.scale(z, z); g.translate(-camX, -camY);
        room(g, u, out3(seg(u, T.tuer - 0.16, T.tuer + 0.04)));
        lampAt(g, u);
        g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#3a2214"; rr(g, 310, 1015, 180, 140, 18); g.fill(); g.stroke();
        const startle = 1 - seg(u, 0.5, 0.9), rip = seg(u, T.rechnung - 0.15, T.rechnung + 0.1), lifted = seg(u, T.rechnung + 0.1, T.rechnung + 0.4), let_ = seg(u, drop - 0.05, drop + 0.1), chase = seg(u, T.rollt2, T.rollt2 + 0.3);
        const aR = u < drop ? lerp(1.0, -0.5, lifted) : lerp(-0.5, -0.1, let_), eR = u < drop ? lerp(-1.2, -0.7, lifted) : lerp(-0.7, -0.4, let_);
        SK.person(g, 400, 1330, 1.0, { ...WOLF, sit: true, aL: 1.0, eL: -1.2, aR, eR, eyes: startle > 0.2 ? "wide" : u > T.auftritt - 0.1 && u < drop ? "wide" : chase > 0.5 ? "wide" : "dot", mouth: startle > 0.2 ? "o" : u > drop ? "open" : u > T.auftritt - 0.1 ? "flat" : "smile", brow: u > T.auftritt - 0.1 ? -0.5 : 0, look: u > drop ? 1 : u > T.rechnung ? 0.6 : 0.3 });
        table(g);
        // Umschlag fällt ab Bild 0
        const land = seg(u, 0, 0.14); const ey = lerp(720, TOP - 30, land * land), erot = lerp(-0.5, 0.06, land);
        envelope(g, 680, ey, out3(rip), erot);
        if (land >= 1 && u < 0.7) { const q = seg(u, 0.14, 0.7); g.strokeStyle = `rgba(255,240,210,${0.8 * (1 - q)})`; g.lineWidth = 6; for (let i = 0; i < 6; i++) { const a = Math.PI + i / 5 * Math.PI; g.beginPath(); g.moveTo(680 + Math.cos(a) * (170 + q * 40), TOP - 30 + Math.sin(a) * (60 + q * 40) * 0.6); g.lineTo(680 + Math.cos(a) * (210 + q * 120), TOP - 30 + Math.sin(a) * (80 + q * 90) * 0.6); g.stroke(); } }
        // Papier: Hand → Tisch → (Kante, Boden) → Rolle
        const hR = hand(400, 1330, 1.0, 1, aR, eR, { sit: true });
        if (u >= drop) { const pts = [[hR[0], hR[1] + 10]]; if (rx < 1170 || ry < TOP - 20) { pts.push([Math.min(rx, hR[0] + 80), TOP - 8]); pts.push([rx, TOP - 8]); } else { pts.push([hR[0] + 80, TOP - 8]); pts.push([1195, TOP - 8]); pts.push([1205, FLOOR + 48]); pts.push([rx, FLOOR + 48]); } strip(g, pts, 30, { ol: 6 }); }
        if (u > T.rechnung - 0.05) roll(g, rx, ry, ROLLR, rang);
        if (u >= drop && u < T.tuer) for (let i = 0; i < 4; i++) { g.strokeStyle = "rgba(255,240,210,0.4)"; g.lineWidth = 5; g.beginPath(); g.moveTo(rx - ROLLR - 20 - i * 10, ry - 30 + i * 20); g.lineTo(rx - ROLLR - 120 - i * 30, ry - 30 + i * 20); g.stroke(); }
        g.restore();
      } else if (u < T.bD) { // ---------- Gasse ----------
        const k = seg(u, T.bC, T.bD); const rx = lerp(-60, 2700, k * 0.85 + k * k * 0.15); const cam = { x: rx + 160, y: GY(rx) - 160, z: 1.0 };
        const sk = g.createLinearGradient(0, 0, 0, H); sk.addColorStop(0, "#151a38"); sk.addColorStop(0.5, "#5a3f6e"); sk.addColorStop(0.75, "#e08a5e"); sk.addColorStop(1, "#f5b46a"); g.fillStyle = sk; g.fillRect(0, 0, W, H);
        g.save(); g.translate(0, 0); sea(g, u, 1150, 1950, 700); g.restore();
        g.save(); SK.apply(g, cam, Math.sin(u * 40) * 4, Math.sin(u * 53) * 4); alley(g, u, cam, rx);
        const px = 1500, pj = Math.sin(Math.PI * seg(rx, px - 260, px + 220)); SK.person(g, px + 90, GY(px + 90) + 70, 0.72, { hs: "cap", hair: "#2f6f8f", shirt: "#c0473a", pants: "#2f3d5c", skin: "#e8b48f", bob: -pj * 170, aL: pj > 0.2 ? -0.9 : 1.3, aR: pj > 0.2 ? -0.9 : 1.3, eyes: pj > 0.1 ? "wide" : "dot", mouth: pj > 0.1 ? "shout" : "smile", flip: true });
        roll(g, rx, GY(rx) + 18 - 44, 44, rx / 44);
        g.restore();
        for (let i = 0; i < 10; i++) { const yy = 400 + rnd(i * 3.3) * 1100, len = 160 + rnd(i) * 260; g.strokeStyle = "rgba(255,240,220,0.18)"; g.lineWidth = 4; g.beginPath(); g.moveTo(-50 + ((u * 3000 + i * 300) % 1300), yy); g.lineTo(-50 + ((u * 3000 + i * 300) % 1300) - len, yy - len * 0.42); g.stroke(); }
      } else if (u < T.bE) { // ---------- Weitwinkel: Stadt bis ans Meer ----------
        const kk = seg(u, T.bD, T.meer + 0.1); const k = lerp(0.42, 1, out3(kk) * 0.4 + kk * 0.6), splash = u > T.meer + 0.1 ? seg(u, T.meer + 0.1, T.meer + 1.0) : 0;
        const pr = part(RIB, k); const zk = inOut(seg(u, T.bD, T.meer + 0.25)); const z = lerp(2.6, 1.0, zk); const cx = lerp(pr.end[0], 540, zk), cy = lerp(pr.end[1], 1000, zk);
        g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-cx, -cy); city(g, u, k, splash); g.restore();
      } else if (u < T.bF) { // ---------- Posten über Posten ----------
        const su = u - T.bE; const off = su * 760 + su * su * 120; const z = 1.12 - 0.06 * cl(su / 1.5); g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-540, -960); itemsFly(g, u, off); g.restore();
      } else if (u < T.bG) { // ---------- Strand: keiner erklärt es ----------
        const su = u - T.bF; const z = 1.0 + 0.05 * cl(su / 1.5); g.save(); g.translate(540, 1000); g.scale(z, z); g.translate(-540, -1000); beach(g, u);
        strip(g, [[-80, 1235], [140, 1260], [320, 1300], [420, 1350]], 26, { ol: 6 }); pile(g, 560, 1440, u, 0.9);
        const hL = hand(520, 1430, 1.0, -1, 0.6, -1.4), hRr = hand(520, 1430, 1.0, 1, 0.6, -1.4);
        SK.person(g, 520, 1430, 1.0, { ...WOLF, aL: 0.6, eL: -1.4, aR: 0.6, eR: -1.4, eyes: "wide", mouth: u > T.erkl ? "sad" : "o", brow: -0.8, look: Math.sin(u * 3) * 0.6 });
        g.save(); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = PAP; rr(g, hL[0] + 10, hL[1] - 40, hRr[0] - hL[0] - 20, 190, 6); g.fill(); g.stroke();
        g.font = "600 30px I"; g.fillStyle = "#3a2e26"; g.textAlign = "left"; g.textBaseline = "middle"; ["Diverses", "Sonstiges", "Aufschlag"].forEach((s, i) => { g.fillText(s, hL[0] + 30, hL[1] + 20 + i * 52); g.fillRect(hRr[0] - 110, hL[1] + 30 + i * 52, 70, 4); }); g.restore();
        g.restore();
        SK.qmarks(g, 530, 700, u, seg(u, T.keiner - 0.1, T.keiner + 0.5), 3, "#ffd34d");
        SK.bubble(g, ["Was heißt", "*Diverses*?!"], 560, 455, 560, 620, outBack(seg(u, T.erkl - 0.15, T.erkl + 0.1), 2), { shout: true, px: 52 });
      } else { // ---------- Garten ----------
        const su = u - T.bG; const dive = inExpo(cl((u - T.denn - 0.05) / Math.max(0.3, d - T.denn - 0.05)));
        const laugh = seg(u, T.lacht - 0.1, T.lacht + 0.1), bob = laugh > 0 ? -Math.abs(Math.sin(u * 14)) * 16 * laugh : 0;
        const aRn = lerp(1.2, -0.6, outBack(seg(u, T.zettel - 0.3, T.zettel + 0.05), 1.6)), eRn = lerp(0, -0.6, seg(u, T.zettel - 0.3, T.zettel));
        const nh = hand(800, 1390, 0.95, 1, aRn, eRn, { flip: true, bob }); const nx = nh[0] - 10, ny = nh[1] - 70, nrot = -0.12 + Math.sin(u * 3) * 0.03;
        let z = 1.0 + 0.06 * cl(su / 3), cx = 540, cy = 960;
        if (dive > 0) { const k = inOut(cl((u - T.denn) / 0.35)); cx = lerp(cx, nx - 10, k); cy = lerp(cy, ny + 2, k); z *= 1 + dive * 34; }
        g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-cx, -cy);
        garden(g, u);
        SK.person(g, 290, 1390, 0.9, { ...WOLF, eyes: u > T.einer - 0.1 ? "wide" : "dot", mouth: u > T.einer - 0.1 ? "o" : "flat", brow: u > T.einer - 0.1 ? -0.6 : 0.8, red: u < T.einer ? 0.35 : 0, t: u, aL: -0.7, eL: 0.5, aR: -0.7, eR: 0.5, look: 0.8 });
        pile(g, 290, 1330, u, 1.15);
        SK.person(g, 800, 1390, 0.95, { ...NACH, flip: true, bob, aR: aRn, eR: eRn, aL: 1.3, eL: 0, eyes: laugh > 0.5 ? "happy" : "dot", mouth: laugh > 0.5 ? "grin" : "smile", look: -0.6 });
        note(g, nx, ny, 1.0, nrot);
        fence(g);
        if (laugh > 0) { g.strokeStyle = `rgba(43,29,20,${laugh})`; g.lineWidth = 6; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(800, 840 + bob, 110 + i * 22, -0.5 - i * 0.05, -0.15); g.stroke(); } }
        g.restore();
        const win = (a) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, T.denn - 0.05, T.denn + 0.2));
        SK.bubble(g, ["Nur *eine*", "Zeile?!"], 290, 560, 300, 760, win(T.einer - 0.12), { shout: true, px: 54 });
        if (u > T.lacht - 0.1) SK.bubble(g, ["Tja."], 830, 600, 800, 740, win(T.lacht + 0.05), { px: 54 });
      }
      SK.flashAt(g, u, [T.bC, T.bD, T.bE, T.bF, T.bG], 0.08, 0.55);
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T; const drop = T.rollt1 + 0.22; const E = [[0.0, "whoosh_down", 0.45, 0], [0.13, "slap", 0.75, 0], [0.14, "thump", 0.6, 0]];
      E.push([T.rechnung - 0.14, "rc_tear", 0.55, 0], [T.rechnung + 0.12, "pop", 0.4, 0.2], [T.rechnung + 0.2, "cash_flap", 0.35, 0]);
      E.push([drop + 0.15, "thump", 0.5, 0.1]); for (let t = drop + 0.2; t < T.tuer; t += 0.3) E.push([t, "cash_flap", 0.22, 0.3]);
      E.push([T.tisch + 0.02, "whoosh_down", 0.35, 0.3], [T.tisch + 0.28, "thump", 0.5, 0.4], [T.tuer - 0.14, "slap", 0.5, 0.5], [T.tuer - 0.12, "boom", 0.25, 0.5], [T.bC, "whoosh_side", 0.4, 0]);
      for (let t = T.bC + 0.05; t < T.bD - 0.05; t += 0.11) E.push([t, "click", 0.18, ((t * 13) % 2) - 1]); E.push([T.bC + (T.bD - T.bC) * 0.45, "pop", 0.4, 0.3]);
      E.push([T.bD, "whoosh_up", 0.4, 0], [T.meer + 0.1, "boom", 0.35, 0.4], [T.meer + 0.12, "whoosh_down", 0.3, 0.4], [T.meer + 0.2, "shimmer", 0.3, 0.4]);
      E.push([T.bE, "whoosh_side", 0.4, 0]); for (let t = T.bE + 0.15; t < T.bF - 0.1; t += 0.27) E.push([t, "cash_count", 0.22, ((t * 7) % 2) - 1]);
      E.push([T.bF, "tr_slow", 0.3, 0], [T.keiner, "pop", 0.3, -0.2], [T.keiner + 0.15, "pop", 0.3, 0], [T.keiner + 0.3, "pop", 0.3, 0.2], [T.erkl - 0.1, "slap", 0.3, 0], [T.erkl + 0.1, "vsad", 0.3, 0]);
      E.push([T.bG, "chime", 0.3, 0], [T.zettel - 0.1, "ding", 0.4, 0.3], [T.einer - 0.1, "pop", 0.45, -0.3], [T.lacht, "pop", 0.35, 0.3], [T.lacht + 0.05, "shimmer_hi", 0.2, 0.3]);
      E.push([T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: weißes Papier, eine Zeile, Filmtitel ----------
  TYPES.rechnung_end = {
    zone: "center", pal: "c_warm", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^fest/, E.sys, 1.4); E.preis = E.f(/^990/, E.offer, E.offer + 0.7); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createRadialGradient(540, 900, 100, 540, 960, 1250); bg.addColorStop(0, "#fbf6ea"); bg.addColorStop(1, "#d9ccb0"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 320; i++) circle(g, rnd(i * 1.3) * W, rnd(i * 2.7) * H, 1 + rnd(i) * 1.6, `rgba(120,96,70,${0.05 + rnd(i * 3) * 0.06})`);
      g.strokeStyle = "rgba(140,170,200,0.22)"; g.lineWidth = 2; const sh = u * 6; for (let y = 200; y < 1800; y += 64) { g.beginPath(); g.moveTo(0, y + sh % 64); g.lineTo(W, y + sh % 64); g.stroke(); }
      g.strokeStyle = "rgba(200,80,70,0.25)"; g.beginPath(); g.moveTo(120, 0); g.lineTo(120, H); g.stroke();
      SK.endTitle(g, u, d, T, { c: "#231b16", glow: "rgba(0,0,0,0)", accent: "#a3262f", sub: "#5b4a3e", key: "#a3262f", offer: "FESTPREIS VORHER", y: 770, line: "und ich zeige Ihnen, was es bei Ihnen kostet." });
      const lk = seg(u, T.preis - 0.15, T.preis + 0.3); if (lk > 0) { g.save(); g.globalAlpha = lk; const y = 1110 + (1 - out3(lk)) * 20; g.font = "italic 400 56px S"; g.fillStyle = "#231b16"; g.textBaseline = "middle"; g.textAlign = "left"; g.fillText("Landingpage", 190, y); g.textAlign = "right"; g.font = "600 56px S"; g.fillText("990 €", 890, y);
        g.fillStyle = "rgba(35,27,22,0.45)"; g.font = "italic 400 56px S"; const lw = g.measureText("Landingpage").width; g.font = "600 56px S"; const rw = g.measureText("990 €").width; for (let x = 190 + lw + 24; x < 890 - rw - 20; x += 20) g.fillRect(x, y + 14, 7, 4);
        const ul = out3(seg(u, T.preis + 0.1, T.preis + 0.5)); g.fillStyle = "#a3262f"; g.fillRect(890 - rw * ul, y + 38, rw * ul, 4); g.fillRect(890 - rw * ul, y + 48, rw * ul, 4); g.restore(); }
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.35, 0], [0.12, "tr_swish", 0.35, 0], [0.2, "shimmer", 0.35, 0], [T.offer, "rc_stamp", 0.35, 0], [T.preis, "ding", 0.3, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
