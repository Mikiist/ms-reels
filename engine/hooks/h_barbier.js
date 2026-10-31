// h_barbier: Neugier-Geschichte (Look "story", Anti-Werbung). Barbier Leon schneidet mit rechts, links ein Hörer am Ohr,
// unterm Kinn ein zweiter, auf dem Fuß klingelt ein altes Wählscheibentelefon. Schnipp: Schnitt in den Spiegel, dem Kunden
// fehlt eine halbe Augenbraue. Harter Schnitt auf „Heute“: Leon schneidet ruhig mit beiden Händen, die Telefone schlafen
// in der Schublade, die Wartebank ist voll, der Wandkalender voll bis Samstag. Bei „Denn“ taucht die Kamera in den Samstag, Weiß.
// Danach barbier_end (Barber-Säule dreht, Filmtitel, „TERMINE SELBST BUCHEN“).
// Wörter: leon, rechten, linken, telefon, kinn, zweites, fuß, dritte, schnipp, kunden, augenbraue, heute, einziges, voll, samstag, denn.
(() => {
  const OL = SK.OL;
  const pc = (a) => a[0] === "#" ? [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)) : a.match(/[\d.]+/g).slice(0, 3).map(Number);
  const mix = (a, b, k) => { const pa = pc(a), pb = pc(b); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], cl(k)))).join(",")})`; };
  const S = 0.8, FL = 1140;
  const LX = 540;            // Leon in der Hektik (neben dem Stuhl)
  const CX = 690, CF = 1080; // Kunde im Stuhl (Füße auf der Fußstütze)
  const LX3 = 680, CF3 = 1150; // heute: Leon hinter dem Stuhl, Kunde etwas tiefer
  const LEON = { hs: "bun", hair: "#2a1d16", beard: "#2a1d16", shirt: "#e9e4d8", pants: "#2b2f3a", shoes: "#5a3a26", skin: "#e2b48c", apron: "#6b3f22" };
  const KUNDE = { hs: "short", hair: "#8a5a34", skin: "#f1c7a1", shirt: "#f4f4f4", pants: "#4a5168", shoes: "#2a2a30" };
  const GAST = [
    { hs: "long", hair: "#c9772f", skin: "#f1c7a1", shirt: "#3d9a6b", pants: "#33374a", shoes: "#6b2f3a", skirt: "#2f5f8f" },
    { hs: "short", hair: "#1e1a18", skin: "#a9734f", shirt: "#e0703a", pants: "#2f3a52", shoes: "#1e1e24" },
    { hs: "cap", hair: "#2f6f8f", skin: "#f0c9a8", shirt: "#f2b134", pants: "#3b4256", shoes: "#3a2a20" },
  ];

  // Zwei-Gelenk-Arm (lokale Figuren-Koordinaten, stehend): liefert Winkel für SK.person und Richtung der Hand
  function ik(side, tx, ty) { const sx = side * 92, sy = -410; const dx = (tx - sx) * side, dy = ty - sy; const L = Math.max(10, Math.min(183, Math.hypot(dx, dy)));
    const phi = Math.atan2(dy, dx), al = Math.acos(Math.max(-1, Math.min(1, (95 * 95 + L * L - 90 * 90) / (2 * 95 * L)))); const a = phi + al;
    const b = Math.atan2(dy - Math.sin(a) * 95, dx - Math.cos(a) * 95); return { a, e: side * (b - a), dir: side > 0 ? b : Math.PI - b }; }
  function atP(g, x, feet, sit, s, fn) { g.save(); g.translate(x, feet); g.scale(s, s); g.translate(0, sit ? 140 : 0); fn(g); g.restore(); }
  const wP = (x, feet, sit, s, lx, ly) => [x + lx * s, feet + (ly + (sit ? 140 : 0)) * s];

  // ---------- Gegenstände ----------
  function handset(g, x, y, rot, s, col, flip) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * (flip ? -1 : 1), s); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = col;
    rr(g, -14, -66, 28, 132, 14); g.fill(); g.stroke(); rr(g, -40, -96, 56, 52, 20); g.fill(); g.stroke(); rr(g, -40, 44, 56, 52, 20); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.35)"; rr(g, -6, -58, 8, 100, 4); g.fill(); g.fillStyle = OL; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-26, -82 + i * 12, 3, 0, 7); g.arc(-26, 58 + i * 12, 3, 0, 7); g.fill(); } g.restore(); }
  function cord(g, x1, y1, x2, y2, sag, col = "#2b2b33") { g.save(); g.strokeStyle = col; g.lineWidth = 5; g.lineCap = "round"; g.beginPath();
    const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + sag, L = Math.hypot(x2 - x1, y2 - y1) + sag, n = Math.max(40, Math.floor(L / 3.2));
    for (let i = 0; i <= n; i++) { const t = i / n, a = (1 - t) * (1 - t), b = 2 * t * (1 - t), c = t * t; const px = a * x1 + b * mx + c * x2, py = a * y1 + b * my + c * y2;
      const dx = 2 * (1 - t) * (mx - x1) + 2 * t * (x2 - mx), dy = 2 * (1 - t) * (my - y1) + 2 * t * (y2 - my), dl = Math.hypot(dx, dy) || 1; const ph = t * L / 11 * Math.PI * 2, r = 8;
      const qx = px - dy / dl * Math.sin(ph) * r, qy = py + dx / dl * Math.sin(ph) * r; i ? g.lineTo(qx, qy) : g.moveTo(qx, qy); }
    g.stroke(); g.restore(); }
  // Wandtelefon (Gabel leer oder mit Hörer)
  function wallPhone(g, x, y, col, withHs) { g.save(); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = col; rr(g, x - 52, y - 80, 104, 170, 18); g.fill(); g.stroke();
    g.fillStyle = mix(col, "#000000", 0.3); rr(g, x - 36, y + 10, 72, 60, 10); g.fill(); g.stroke(); g.fillStyle = "#f6f1e3"; g.beginPath(); g.arc(x, y + 40, 22, 0, 7); g.fill(); g.lineWidth = 4; g.stroke();
    g.fillStyle = OL; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; g.beginPath(); g.arc(x + Math.cos(a) * 15, y + 40 + Math.sin(a) * 15, 3, 0, 7); g.fill(); }
    g.lineWidth = 7; g.fillStyle = "#c9ccd2"; rr(g, x - 64, y - 70, 18, 40, 6); g.fill(); g.stroke(); rr(g, x + 46, y - 70, 18, 40, 6); g.fill(); g.stroke();
    if (withHs) handset(g, x, y - 52, Math.PI / 2, 0.9, col); g.restore(); }
  // Wählscheibentelefon. ring 0..1 (wackelt), hs: Hörer liegt drauf
  function rotary(g, x, y, s, col, rot, hs) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineWidth = 7; g.strokeStyle = OL;
    g.fillStyle = col; g.beginPath(); g.moveTo(-92, 0); g.lineTo(92, 0); g.quadraticCurveTo(84, -96, 0, -104); g.quadraticCurveTo(-84, -96, -92, 0); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.ellipse(-40, -66, 22, 10, -0.6, 0, 7); g.fill();
    g.fillStyle = "#f6f1e3"; g.beginPath(); g.arc(0, -46, 34, 0, 7); g.fill(); g.lineWidth = 5; g.stroke(); g.fillStyle = OL; for (let i = 0; i < 10; i++) { const a = -0.9 + i / 10 * Math.PI * 1.7; g.beginPath(); g.arc(Math.cos(a) * 23, -46 + Math.sin(a) * 23, 4.5, 0, 7); g.fill(); }
    g.fillStyle = mix(col, "#000000", 0.35); g.beginPath(); g.arc(0, -46, 9, 0, 7); g.fill();
    g.lineWidth = 7; g.fillStyle = mix(col, "#000000", 0.2); rr(g, -70, -122, 26, 24, 8); g.fill(); g.stroke(); rr(g, 44, -122, 26, 24, 8); g.fill(); g.stroke();
    if (hs) handset(g, 0, -128, Math.PI / 2, 0.95, col); g.restore(); }
  function scissors(g, x, y, ang, open, s = 1) { g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL;
    [-1, 1].forEach((sd) => { g.save(); g.rotate(sd * open * 0.5); g.fillStyle = "#d7dbe2"; g.beginPath(); g.moveTo(14, sd * 4); g.lineTo(130, sd * 2); g.quadraticCurveTo(80, sd * 16, 14, sd * 12); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#e5243b"; g.beginPath(); g.ellipse(-22, sd * 20, 20, 13, sd * 0.4, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.ellipse(-22, sd * 20, 9, 5, sd * 0.4, 0, 7); g.fill(); g.restore(); });
    g.fillStyle = "#9aa1ab"; g.beginPath(); g.arc(8, 0, 6, 0, 7); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.7)"; g.fillRect(40, -3, 60, 2); g.restore(); }
  function comb(g, x, y, ang, s = 1) { g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s); g.lineWidth = 5; g.strokeStyle = OL; g.fillStyle = "#2b2b33"; rr(g, -10, -70, 22, 140, 6); g.fill(); g.stroke();
    g.strokeStyle = "#2b2b33"; g.lineWidth = 4; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(12, -62 + i * 11); g.lineTo(34, -62 + i * 11); g.stroke(); } g.restore(); }
  // Barber-Säule, Streifen laufen
  function pole(g, x, y, w, h, u, glow = 0) { g.save(); g.lineWidth = 7; g.strokeStyle = OL;
    if (glow > 0) { const gg = g.createRadialGradient(x, y + h / 2, 10, x, y + h / 2, h * 0.8); gg.addColorStop(0, `rgba(255,120,110,${0.28 * glow})`); gg.addColorStop(1, "rgba(255,120,110,0)"); g.fillStyle = gg; g.fillRect(x - h, y - h * 0.3, 2 * h, h * 1.6); }
    g.save(); rr(g, x - w / 2, y, w, h, 10); g.clip(); g.fillStyle = "#fbf7ef"; g.fillRect(x - w / 2, y, w, h);
    const per = w * 1.1, off = (u * 70) % (per * 2); const cs = ["#d6303a", "#2f5fae"];
    for (let i = -3; i < h / per + 4; i++) { g.fillStyle = cs[((i % 2) + 2) % 2]; const y0 = y + i * per - off + per; g.beginPath(); g.moveTo(x - w / 2, y0); g.lineTo(x + w / 2, y0 - w * 0.9); g.lineTo(x + w / 2, y0 - w * 0.9 + per * 0.45); g.lineTo(x - w / 2, y0 + per * 0.45); g.closePath(); g.fill(); }
    const sh = g.createLinearGradient(x - w / 2, 0, x + w / 2, 0); sh.addColorStop(0, "rgba(0,0,0,0.25)"); sh.addColorStop(0.3, "rgba(255,255,255,0.45)"); sh.addColorStop(0.45, "rgba(255,255,255,0)"); sh.addColorStop(1, "rgba(0,0,0,0.3)"); g.fillStyle = sh; g.fillRect(x - w / 2, y, w, h);
    g.restore(); rr(g, x - w / 2, y, w, h, 10); g.stroke();
    g.fillStyle = "#c9ccd2"; rr(g, x - w / 2 - 12, y - 40, w + 24, 44, 14); g.fill(); g.stroke(); g.beginPath(); g.arc(x, y - 44, w * 0.32, Math.PI, 0); g.fill(); g.stroke();
    rr(g, x - w / 2 - 12, y + h - 4, w + 24, 44, 14); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.6)"; g.fillRect(x - w / 2 - 2, y - 32, 10, 28); g.restore(); }
  function zzz(g, x, y, u, a) { if (a <= 0) return; g.save(); g.lineWidth = 7; g.strokeStyle = OL; g.lineJoin = "round"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 0; i < 3; i++) { const k = (u * 0.45 + i / 3) % 1; g.globalAlpha = a * Math.min(1, k * 4) * (1 - k); g.font = `900 ${40 + i * 4 + k * 20}px D`; const px = x + k * 70 + Math.sin(u * 2 + i) * 10, py = y - k * 150; g.strokeText("z", px, py); g.fillStyle = "#e9f2ff"; g.fillText("z", px, py); } g.restore(); }

  // ---------- Barbershop (Welt) ----------
  function floor(g) { const VX = 600, VY = 560, Y0 = FL; const rows = [1140, 1182, 1232, 1292, 1362, 1444, 1540, 1650, 1780, 1930, 2110, 2440];
    for (let r = 0; r < rows.length - 1; r++) { const ya = rows[r], yb = rows[r + 1]; for (let k = -12; k < 26; k++) { const xa = -900 + k * 120, xb = xa + 120;
      const X = (x0, y) => VX + (x0 - VX) * (y - VY) / (Y0 - VY); g.fillStyle = (r + k) % 2 ? "#f1ece0" : "#2a2b33";
      g.beginPath(); g.moveTo(X(xa, ya), ya); g.lineTo(X(xb, ya), ya); g.lineTo(X(xb, yb), yb); g.lineTo(X(xa, yb), yb); g.closePath(); g.fill(); } }
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-900, FL); g.lineTo(2100, FL); g.stroke(); }
  function hairBits(g, n, x0, x1, y0, y1, seed, col = "#3a2a1c") { g.save(); g.strokeStyle = col; g.lineWidth = 4; g.lineCap = "round"; for (let i = 0; i < n; i++) { const x = x0 + rnd(seed + i * 3.3) * (x1 - x0), y = y0 + rnd(seed + i * 5.1) * (y1 - y0), a = rnd(seed + i) * 6;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * 12, y + Math.sin(a) * 12 - 6, x + Math.cos(a + 0.8) * 18, y + Math.sin(a + 0.8) * 18); g.stroke(); } g.restore(); }
  function room(g, u, o) {
    g.lineWidth = 8; g.strokeStyle = OL;
    // Tapete (dunkles Petrol mit Rautenmuster)
    g.fillStyle = "#1f4c4c"; g.fillRect(-900, -700, 3000, 1480);
    g.strokeStyle = "rgba(255,230,180,0.10)"; g.lineWidth = 3; for (let i = -40; i < 60; i++) { g.beginPath(); g.moveTo(i * 70 - 900, -700); g.lineTo(i * 70 - 900 + 1480, 780); g.moveTo(i * 70 - 900, -700); g.lineTo(i * 70 - 900 - 1480, 780); g.stroke(); }
    g.fillStyle = "rgba(255,230,180,0.14)"; for (let r = 0; r < 22; r++) for (let c = -14; c < 30; c++) { const x = c * 70 + (r % 2) * 35 - 900 + 35, y = -700 + r * 70; if (y > 760) continue; g.beginPath(); g.moveTo(x, y - 9); g.lineTo(x + 7, y); g.lineTo(x, y + 9); g.lineTo(x - 7, y); g.closePath(); g.fill(); }
    // Lampenlicht an der Wand
    [[380, 230], [860, 230]].forEach(([lx, ly]) => { const gg = g.createRadialGradient(lx, ly + 60, 10, lx, ly + 120, 520); gg.addColorStop(0, `rgba(255,214,150,${0.30 + (o.warm || 0) * 0.12})`); gg.addColorStop(1, "rgba(255,214,150,0)"); g.fillStyle = gg; g.fillRect(lx - 560, ly - 300, 1120, 1100); });
    // Holzvertäfelung
    g.strokeStyle = OL; g.lineWidth = 8; g.fillStyle = "#6b3f22"; g.fillRect(-900, 780, 3000, 330); g.fillStyle = "#4e2c17"; g.fillRect(-900, 760, 3000, 24); g.strokeRect(-900, 760, 3000, 24);
    g.lineWidth = 5; for (let i = -6; i < 16; i++) { const x = i * 170 + 20; g.fillStyle = "#7a4a2a"; rr(g, x, 815, 130, 250, 8); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(x + 10, 825, 8, 230); }
    g.lineWidth = 8; g.fillStyle = "#3b2414"; g.fillRect(-900, 1100, 3000, 40); g.strokeRect(-900, 1100, 3000, 40);
    floor(g);
    hairBits(g, 26, 420, 860, 1150, 1260, 3.3);
    // Pendelleuchten
    [[380, 230], [860, 230]].forEach(([lx, ly], i) => { const sw = Math.sin(u * 1.3 + i) * 0.03; g.save(); g.translate(lx, -700); g.rotate(sw); g.strokeStyle = OL; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, ly + 700 - 40); g.stroke();
      g.lineWidth = 7; g.fillStyle = "#2f3a36"; g.beginPath(); g.moveTo(-70, ly + 700 + 30); g.lineTo(70, ly + 700 + 30); g.lineTo(30, ly + 700 - 40); g.lineTo(-30, ly + 700 - 40); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#ffe7a8"; g.beginPath(); g.ellipse(0, ly + 700 + 32, 50, 12, 0, 0, 7); g.fill(); g.restore(); });
    // Barber-Säule an der Wand
    g.fillStyle = "#c9ccd2"; g.lineWidth = 7; g.strokeStyle = OL; rr(g, 200, 500, 30, 30, 6); g.fill(); g.stroke(); pole(g, 250, 360, 62, 330, u, 0.6);
    // Plakat mit Frisuren
    g.lineWidth = 7; g.fillStyle = "#d9a441"; rr(g, 330, 300, 170, 210, 8); g.fill(); g.stroke(); g.fillStyle = "#f3e6c8"; rr(g, 346, 316, 138, 178, 4); g.fill(); g.stroke();
    [[384, 370, "#2a1d16", 0], [446, 370, "#c9772f", 1], [384, 450, "#7a4a2a", 2], [446, 450, "#1e1a18", 3]].forEach(([hx, hy, hc, k]) => { g.lineWidth = 4; g.fillStyle = "#f1c7a1"; g.beginPath(); g.arc(hx, hy, 20, 0, 7); g.fill(); g.stroke(); g.fillStyle = hc; g.beginPath();
      if (k === 0) { g.arc(hx, hy - 6, 22, Math.PI, 0); } else if (k === 1) { g.ellipse(hx, hy - 20, 16, 14, 0, 0, 7); } else if (k === 2) { g.arc(hx, hy - 4, 22, Math.PI * 1.1, Math.PI * 1.9); } else { rr(g, hx - 20, hy - 30, 40, 16, 6); } g.fill(); g.stroke(); });
    // Spiegel mit Goldrahmen
    const MX0 = 580, MX1 = 920, MY0 = 300, MY1 = 800; g.lineWidth = 8; g.fillStyle = "#c79a3c"; rr(g, MX0 - 26, MY0 - 26, MX1 - MX0 + 52, MY1 - MY0 + 52, 30); g.fill(); g.stroke();
    const mg = g.createLinearGradient(MX0, MY0, MX1, MY1); mg.addColorStop(0, "#d9ecef"); mg.addColorStop(1, "#8fb0b8"); g.fillStyle = mg; rr(g, MX0, MY0, MX1 - MX0, MY1 - MY0, 16); g.fill(); g.stroke();
    g.save(); rr(g, MX0, MY0, MX1 - MX0, MY1 - MY0, 16); g.clip(); g.fillStyle = "rgba(255,255,255,0.35)"; [[0, 70], [110, 30]].forEach(([o2, w2]) => { g.beginPath(); g.moveTo(MX0 + 40 + o2, MY1); g.lineTo(MX0 + 40 + o2 + w2, MY1); g.lineTo(MX0 + 300 + o2 + w2, MY0); g.lineTo(MX0 + 300 + o2, MY0); g.closePath(); g.fill(); });
    g.fillStyle = "rgba(255,226,160,0.35)"; g.beginPath(); g.ellipse(MX0 + 90, MY0 + 60, 50, 18, 0, 0, 7); g.fill(); g.restore();
    g.fillStyle = "#e3bb5c"; [[MX0 - 13, MY0 - 13], [MX1 + 13, MY0 - 13], [MX0 - 13, MY1 + 13], [MX1 + 13, MY1 + 13]].forEach(([qx, qy]) => { g.lineWidth = 5; g.beginPath(); g.arc(qx, qy, 14, 0, 7); g.fill(); g.stroke(); });
    // Ablage unter dem Spiegel
    g.lineWidth = 8; g.fillStyle = "#5a3a20"; rr(g, 560, 860, 400, 250, 6); g.fill(); g.stroke(); g.fillStyle = "#6b4426"; rr(g, 580, 900, 170, 80, 6); g.fill(); g.stroke(); rr(g, 770, 900, 170, 80, 6); g.fill(); g.stroke();
    g.fillStyle = "#f3efe6"; rr(g, 548, 830, 424, 34, 8); g.fill(); g.stroke();
    // Kammglas, Flaschen, Rasierpinsel
    g.lineWidth = 6; g.fillStyle = "rgba(80,170,220,0.85)"; rr(g, 880, 750, 60, 82, 10); g.fill(); g.stroke(); g.strokeStyle = OL; for (let i = 0; i < 3; i++) { g.fillStyle = ["#2b2b33", "#e5243b", "#2b2b33"][i]; rr(g, 888 + i * 16, 700 + i * 8, 10, 70, 4); g.fill(); g.stroke(); }
    g.fillStyle = "#c0392b"; rr(g, 845, 770, 30, 62, 8); g.fill(); g.stroke(); g.fillStyle = "#f2b134"; rr(g, 851, 750, 18, 22, 4); g.fill(); g.stroke();
    g.fillStyle = "#3d9a6b"; rr(g, 572, 760, 34, 72, 8); g.fill(); g.stroke(); g.fillStyle = "#2b2b33"; rr(g, 580, 740, 18, 22, 4); g.fill(); g.stroke();
    // Wanduhr rechts
    g.lineWidth = 8; g.fillStyle = "#6b4226"; g.beginPath(); g.arc(1560, 330, 66, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#fbf6e8"; g.beginPath(); g.arc(1560, 330, 52, 0, 7); g.fill(); g.stroke();
    const hr = o.hr || 10; g.lineCap = "round"; g.lineWidth = 7; const ha = (hr % 12) / 12 * Math.PI * 2, ma = (hr % 1) * Math.PI * 2; g.beginPath(); g.moveTo(1560, 330); g.lineTo(1560 + Math.sin(ha) * 26, 330 - Math.cos(ha) * 26); g.stroke(); g.lineWidth = 5; g.beginPath(); g.moveTo(1560, 330); g.lineTo(1560 + Math.sin(ma) * 40, 330 - Math.cos(ma) * 40); g.stroke();
    // Wartebank
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#8e3b46"; rr(g, 920, 820, 500, 130, 24); g.fill(); g.stroke(); g.fillStyle = "#a8434f"; rr(g, 910, 950, 520, 56, 18); g.fill(); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 4; [1086, 1252].forEach((bx) => { g.beginPath(); g.moveTo(bx, 830); g.lineTo(bx, 940); g.stroke(); }); g.strokeStyle = OL; g.lineWidth = 8;
    g.fillStyle = "#c9ccd2"; [940, 1400].forEach((bx) => { rr(g, bx - 10, 1006, 20, 134, 6); g.fill(); g.stroke(); });
    // Pflanze
    g.fillStyle = "#b5651d"; rr(g, 1470, 1030, 90, 110, 10); g.fill(); g.stroke(); g.fillStyle = "#3d9a6b"; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4 + Math.sin(u * 1.4 + i) * 0.04; g.save(); g.translate(1515, 1030); g.rotate(a + Math.PI / 2); g.beginPath(); g.ellipse(0, -90, 24, 90, 0, 0, 7); g.fill(); g.stroke(); g.restore(); }
    // Seitenschrank links
    g.fillStyle = "#5a3a20"; rr(g, 140, 930, 230, 210, 6); g.fill(); g.stroke(); g.fillStyle = "#6b4426"; rr(g, 156, 1035, 198, 90, 6); g.fill(); g.stroke(); g.fillStyle = "#d9a441"; g.beginPath(); g.arc(255, 1080, 8, 0, 7); g.fill(); g.stroke();
    if (!o.open) { g.fillStyle = "#6b4426"; rr(g, 156, 948, 198, 76, 6); g.fill(); g.stroke(); g.fillStyle = "#d9a441"; g.beginPath(); g.arc(255, 986, 8, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = "#3b2414"; rr(g, 128, 916, 254, 22, 6); g.fill(); g.stroke();
  }
  // Barberstuhl: back = Lehne hinter der Figur, sonst Armlehnen, Fußstütze, Sockel
  function chair(g, x, feet, back) { g.save(); g.lineWidth = 8; g.strokeStyle = OL; const seat = feet - 190 * S;
    if (back) { g.fillStyle = "#b8242f"; rr(g, x - 125, seat - 250, 250, 270, 40); g.fill(); g.stroke(); g.fillStyle = "#d6303a"; rr(g, x - 100, seat - 225, 200, 220, 30); g.fill(); g.stroke();
      g.fillStyle = "#c9ccd2"; rr(g, x - 16, seat + 30, 32, FL - seat - 52, 8); g.fill(); g.stroke(); g.beginPath(); g.ellipse(x, FL - 14, 110, 22, 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(x - 8, seat + 40, 6, FL - seat - 80); }
    else { g.fillStyle = "#b8242f"; rr(g, x - 140, seat - 20, 280, 50, 18); g.fill(); g.stroke();
      g.fillStyle = "#c9ccd2"; rr(g, x - 160, seat - 70, 40, 90, 12); g.fill(); g.stroke(); rr(g, x + 120, seat - 70, 40, 90, 12); g.fill(); g.stroke(); g.fillStyle = "#d6303a"; rr(g, x - 170, seat - 92, 60, 30, 12); g.fill(); g.stroke(); rr(g, x + 110, seat - 92, 60, 30, 12); g.fill(); g.stroke();
      if (feet < FL - 10) { g.fillStyle = "#c9ccd2"; rr(g, x - 50, feet - 4, 170, 18, 8); g.fill(); g.stroke(); } }
    g.restore(); }
  // Kunde mit Umhang. o: eyes, mouth, look, red, brow (Anheben), cut (0..1 halbe Augenbraue weg), happy
  function kunde(g, u, x, feet, o) {
    SK.person(g, x, feet, S, { ...KUNDE, ...(o.look3 || {}), sit: true, aL: 1.45, aR: 1.45, eyes: o.eyes || "dot", mouth: o.mouth || "flat", look: o.look || 0, red: o.red || 0, t: u });
    atP(g, x, feet, true, S, (q) => { q.lineWidth = 7; q.strokeStyle = OL;
      // Umhang mit Streifen
      q.fillStyle = "#f7f7f2"; q.beginPath(); q.moveTo(-40, -468); q.quadraticCurveTo(-150, -420, -165, -205); q.lineTo(200, -205); q.quadraticCurveTo(160, -420, 40, -468); q.closePath(); q.fill(); q.stroke();
      q.save(); q.clip(); q.strokeStyle = "rgba(47,95,174,0.45)"; q.lineWidth = 6; for (let i = -6; i < 8; i++) { q.beginPath(); q.moveTo(i * 34, -470); q.lineTo(i * 44 + 8, -205); q.stroke(); } q.restore();
      q.strokeStyle = OL; q.lineWidth = 7; q.beginPath(); q.moveTo(-165, -205); q.lineTo(200, -205); q.stroke();
      q.strokeStyle = "rgba(0,0,0,0.18)"; q.lineWidth = 5; [[-80, -380, -110, -215], [60, -390, 100, -215], [0, -400, 10, -215]].forEach(([a, b, c, d]) => { q.beginPath(); q.moveTo(a, b); q.quadraticCurveTo((a + c) / 2 + 12, (b + d) / 2, c, d); q.stroke(); });
      q.strokeStyle = OL; q.lineWidth = 7; q.fillStyle = "#2f5fae"; rr(q, -46, -484, 92, 24, 10); q.fill(); q.stroke();
      // Augenbrauen (dick), rechte halb weg
      const by = -568 - (o.brow || 0) * 12, cut = o.cut || 0; q.fillStyle = "#1a110a"; q.lineWidth = 5;
      q.save(); q.translate(-30, by); q.rotate(0.08 - (o.brow || 0) * 0.12); rr(q, -22, -9, 44, 18, 9); q.fill(); q.stroke(); q.restore();
      const rx1 = lerp(52, 24, cut); q.save(); q.translate(10, by); q.rotate(-0.08 + (o.brow || 0) * 0.12); rr(q, 0, -9, rx1 - 10, 18, cut > 0 ? 4 : 9); q.fill(); q.stroke(); q.restore();
      if (cut > 0) { q.fillStyle = "rgba(255,190,170,0.7)"; q.beginPath(); q.ellipse(42, by + 2, 10, 6, 0, 0, 7); q.fill(); }
    });
    return { head: wP(x, feet, true, S, 0, -560), brow: wP(x, feet, true, S, 40, -568), mouth: wP(x, feet, true, S, 0, -505) };
  }
  // Leon. o: hair-Ziel (Schere, lokal), snip (0..1 Öffnung), phones (Anzahl am Körper 0..3), eyes, mouth, brow, red, comb (zweite Hand mit Kamm, lokal)
  function leon(g, u, x, o) {
    const R1 = ik(1, o.tgt[0], o.tgt[1]); let L1 = null; if (o.comb) L1 = ik(-1, o.comb[0], o.comb[1]);
    const ear = { aL: -0.8, eL: 1.84 };
    const arms = o.phones >= 1 ? ear : L1 ? { aL: L1.a, eL: L1.e } : { aL: 1.3, eL: 0 };
    SK.person(g, x, FL, S, { ...LEON, aR: R1.a, eR: R1.e, ...arms, eyes: o.eyes || "dot", mouth: o.mouth || "smile", brow: o.brow || 0, red: o.red || 0, look: o.look || 0, t: u,
      hold: (q, hR, hL) => {
        // Hörer 2 unterm Kinn (vor dem Kopf gezeichnet wird er teils verdeckt)
        if (o.phones >= 2) { const k = o.p2k != null ? o.p2k : 1; q.save(); q.translate(lerp(160, 0, outBack(cl(k), 2)), 0); handset(q, 18, -468, -1.35, 0.92, "#d64550"); q.restore(); }
        scissors(q, hR[0], hR[1], o.sAng != null ? o.sAng : R1.dir - 0.6, o.snip || 0, 1.1);
        if (L1 && o.phones < 1) comb(q, hL[0], hL[1], 0.5, 0.9);
      } });
    let ep = null;
    atP(g, x, FL, false, S, (q) => { // Schnurrbart, Hörer 1 am Ohr
      q.fillStyle = LEON.beard; q.strokeStyle = OL; q.lineWidth = 6; q.beginPath(); q.ellipse(-20, -517, 26, 10, 0.25, 0, 7); q.fill(); q.stroke(); q.beginPath(); q.ellipse(20, -517, 26, 10, -0.25, 0, 7); q.fill(); q.stroke();
      if (o.mouth === "open" || o.mouth === "shout") { q.fillStyle = "#7a1f2a"; q.beginPath(); q.ellipse(0, -488, 16, o.mouth === "shout" ? 18 : 10, 0, 0, 7); q.fill(); q.stroke(); }
      if (o.phones >= 1) { handset(q, -82, -528, 0.15, 1.0, "#4f9a6a", true); q.fillStyle = LEON.skin; q.lineWidth = 8; q.beginPath(); q.arc(-83, -515, 22, 0, 7); q.fill(); q.stroke(); }
    });
    return { head: wP(x, FL, false, S, 0, -560), ear: wP(x, FL, false, S, -82, -470), chin: wP(x, FL, false, S, 70, -470), mouth: wP(x, FL, false, S, 0, -500), foot: wP(x, FL, false, S, -37, 0) };
  }
  // Wartende (sitzend, zufrieden). which: 0 Zeitung, 1 Kaffee, 2 Arme verschränkt
  function gast(g, u, x, i, s) { const o = GAST[i]; const bob = Math.sin(u * 2 + i) * 3;
    const arm = i === 0 ? { aL: 0.2, eL: -0.9, aR: 0.2, eR: -0.9 } : i === 1 ? { aL: 1.3, eL: 0, aR: 0.3, eR: -1.2 } : { aL: 0.9, eL: -1.9, aR: 0.9, eR: -1.9 };
    SK.person(g, x, FL, s, { ...o, sit: true, ...arm, eyes: i === 2 ? "closed" : "happy", mouth: i === 0 ? "smile" : "grin", bob, t: u,
      hold: (q, hR, hL) => { if (i === 1) { q.lineWidth = 6; q.strokeStyle = OL; q.fillStyle = "#fbf6ec"; rr(q, hR[0] - 26, hR[1] - 56, 52, 60, 8); q.fill(); q.stroke(); q.beginPath(); q.arc(hR[0] + 30, hR[1] - 28, 14, -1.4, 1.4); q.stroke();
        q.strokeStyle = "rgba(255,255,255,0.7)"; q.lineWidth = 5; for (let k = 0; k < 2; k++) { q.beginPath(); q.moveTo(hR[0] - 8 + k * 16, hR[1] - 70); q.quadraticCurveTo(hR[0] + 6 + k * 16 + Math.sin(u * 3 + k) * 8, hR[1] - 100, hR[0] - 6 + k * 16, hR[1] - 130); q.stroke(); } } } });
    if (i === 0) atP(g, x, FL + bob, true, s, (q) => { q.lineWidth = 6; q.strokeStyle = OL; q.fillStyle = "#f3efe2"; q.save(); q.translate(0, -360); q.rotate(-0.05); rr(q, -150, -90, 300, 170, 6); q.fill(); q.stroke();
      q.fillStyle = "#9aa1ab"; for (let r = 0; r < 6; r++) { q.fillRect(-130, -60 + r * 22, 120, 9); q.fillRect(10, -60 + r * 22, 120, 9); } q.fillStyle = "#3a3f48"; q.fillRect(-130, -78, 260, 12); q.beginPath(); q.moveTo(0, -90); q.lineTo(0, 80); q.stroke(); q.restore(); });
    return wP(x, FL + bob, true, s, 0, -560);
  }
  // Wandkalender (Welt), fill 0..1 (Einträge), ring 0..1 (Kreis um Samstag)
  const CAL = { x: 1010, y: 380, w: 300, h: 300 };
  function calendar(g, u, fill, ring) { const { x, y, w, h } = CAL; g.save(); g.lineWidth = 7; g.strokeStyle = OL;
    g.fillStyle = "#3b2414"; g.beginPath(); g.arc(x + w / 2, y - 22, 8, 0, 7); g.fill(); g.lineWidth = 4; g.beginPath(); g.moveTo(x + w / 2, y - 22); g.lineTo(x + 40, y); g.moveTo(x + w / 2, y - 22); g.lineTo(x + w - 40, y); g.stroke(); g.lineWidth = 7;
    g.fillStyle = "#fffdf6"; rr(g, x, y, w, h, 10); g.fill(); g.stroke(); g.fillStyle = "#c0392b"; rr(g, x, y, w, 58, 10); g.fill(); g.stroke();
    g.font = "900 30px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText("NOVEMBER", x + w / 2, y + 31);
    const days = ["MO", "DI", "MI", "DO", "FR", "SA"], cw = (w - 24) / 6, top = y + 74; g.font = "800 19px D"; g.fillStyle = "#3a3f48"; days.forEach((dd, i) => g.fillText(dd, x + 12 + cw * (i + 0.5), top + 6));
    const cols = ["#f2b134", "#7fd0ff", "#e85d75", "#8fd060", "#c39bd3"]; let n = 0;
    for (let c = 0; c < 6; c++) for (let r = 0; r < 5; r++) { const cx = x + 12 + cw * c + 4, cy = top + 22 + r * 38; g.strokeStyle = "rgba(0,0,0,0.15)"; g.lineWidth = 2; g.strokeRect(cx, cy, cw - 8, 32);
      const k = cl(fill * 30 - n * 0.9); n++; if (k > 0) { const e = outBack(k, 2.4); g.save(); g.translate(cx + (cw - 8) / 2, cy + 16); g.scale(e, e); g.fillStyle = cols[(c * 2 + r) % 5]; rr(g, -(cw - 14) / 2, -12, cw - 14, 24, 6); g.fill(); g.strokeStyle = OL; g.lineWidth = 3; g.stroke();
        g.strokeStyle = "rgba(40,30,20,0.6)"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-12, 1); for (let j = 0; j < 4; j++) g.quadraticCurveTo(-9 + j * 6, -6 + (j % 2) * 10, -6 + j * 6, 1); g.stroke(); g.restore(); } }
    if (ring > 0) { const cx = x + 12 + cw * 5.5, cy = top + 110; g.strokeStyle = "#e5243b"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); const n2 = 60, a0 = -1.9; for (let i = 0; i <= n2 * ring; i++) { const a = a0 + i / n2 * Math.PI * 2.15; const px = cx + Math.cos(a) * (cw * 0.62 + Math.sin(i * 0.4) * 2), py = cy + Math.sin(a) * 118; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); }
    g.restore(); return [x + 12 + cw * 5.5, top + 22 + 2 * 38 + 16]; }

  TYPES.h_barbier = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 9.6, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.leon = f(/^leon/, 0, 0.5); T.rechten = f(/^rechten/, T.leon, 1.6); T.linken = f(/^linken/, T.rechten, 2.7); T.tel = f(/^telefon/, T.linken, 3.4);
      T.kinn = f(/^kinn/, T.tel, 4.3); T.zweites = f(/^zweites/, T.kinn, 5.0); T.fuss = f(/^fuß/, T.zweites, 5.7); T.dritte = f(/^dritte/, T.fuss, 6.5);
      T.schnipp = f(/^schnipp/, T.dritte, 7.5); T.kunden = f(/^kunden/, T.schnipp, 8.3); T.augen = f(/^augenbraue/, T.kunden, 9.3);
      T.heute = f(/^heute/, T.augen, 10.5); T.kein = f(/^einziges/, T.heute, 11.4); T.voll = f(/^voll/, T.kein, 13.2); T.samstag = f(/^samstag/, T.voll, 13.8); T.denn = f(/^denn/, T.samstag, 14.8);
      T.c2 = T.schnipp - 0.06; T.c3 = T.heute - 0.12; o.T.coverT = T.augen + 0.55; p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const K = (t, z, x, y) => ({ t, z, x, y });
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      const snipO = (t) => 0.55 * (0.5 + 0.5 * Math.cos(t * 17));
      if (u < T.c2) {
        // ---------- Hektik: drei Telefone ----------
        const KF = [K(0, 1.82, 560, 790), K(T.tel, 1.72, 560, 805), K(T.zweites, 1.76, 560, 800), K(T.fuss, 1.55, 540, 915), K(T.dritte + 0.4, 1.55, 560, 905), K(T.c2, 1.6, 600, 850)];
        const c = SK.cam(KF, u); let shake = 0; const rk = u - T.dritte; if (rk > 0) shake = 0.35 + 0.65 * Math.max(0, 1 - rk / 0.4);
        const sx = Math.sin(u * 83) * 6 * (rk > 0 ? shake : 0), sy = Math.cos(u * 71) * 5 * (rk > 0 ? shake : 0);
        const toBrow = inOut(seg(u, T.c2 - 0.9, T.c2));
        const tgt = [lerp(140 + Math.sin(u * 5) * 6, 205, toBrow), lerp(-575 + Math.cos(u * 5) * 6, -530, toBrow)];
        const stress = seg(u, T.tel, T.c2);
        g.save(); SK.apply(g, c, sx, sy);
        room(g, u, { hr: 10.4 + u / 60 });
        wallPhone(g, 380, 610, "#4f9a6a", false);
        rotary(g, 255, 930, 0.8, "#d64550", 0, false);
        chair(g, CX, CF, true);
        const PK = kunde(g, u, CX, CF, { eyes: u < T.dritte ? "side" : "wide", look: -0.9, mouth: u < T.zweites ? "flat" : "o", brow: seg(u, T.dritte, T.dritte + 0.3) * 0.6, red: stress * 0.3 });
        chair(g, CX, CF, false);
        // Kabel unter der Figur: Wandtelefon zum Ohr, Tischtelefon zum Kinn
        const p2k = seg(u, T.kinn - 0.1, T.zweites + 0.1);
        const PL = leon(g, u, LX, { tgt, snip: snipO(u), phones: u >= T.kinn - 0.1 ? 2 : 1, p2k, eyes: u < T.tel ? "happy" : u < T.dritte ? "side" : "wide", look: -0.6, mouth: (Math.sin(u * 13) > -0.2 && u > 0.4) ? "open" : "smile", brow: -0.4 * stress, red: lerp(0, 0.62, stress) });
        cord(g, 380, 690, PL.ear[0] - 4, PL.ear[1] + 12, 120, "#2f5f3e");
        if (p2k > 0.6) cord(g, 300, 905, PL.chin[0] + 20, PL.chin[1] + 10, 160, "#7a1f2a");
        // Telefon 3 auf dem Fuß
        const ring3 = u > T.fuss - 0.2; if (ring3) { const ap = outBack(seg(u, T.fuss - 0.2, T.fuss + 0.15), 2.2); const rg = u > T.dritte - 0.05 ? Math.sin(u * 46) * 0.09 : 0; const jump = u > T.dritte - 0.05 ? -Math.abs(Math.sin(u * 23)) * 10 : 0;
          cord(g, PL.foot[0] - 40, PL.foot[1] - 30, 120, 1110, 30, "#3a3f48"); rotary(g, PL.foot[0] + 4, PL.foot[1] - 18 + jump + (1 - ap) * 60, 0.62 * Math.max(0.01, ap), "#2b2b33", rg, true); }
        g.restore();
        const [lx, ly] = SK.toScreen(c, PL.mouth[0], PL.mouth[1]);
        SK.pow(g, "schnipp", 820, 600, (u + 0.2) / 0.8, { rot: 0.12, px: 84, c: "#f3efe6" });
        SK.bubble(g, ["Barbier Leon, *ja*?"], 330, 500, lx - 30, ly - 60, win(T.linken - 0.2, T.kinn - 0.05), { px: 48 });
        SK.bubble(g, ["*Moment*, bitte!"], 360, 500, lx - 20, ly - 60, win(T.kinn, T.dritte - 0.05), { px: 50 });
        const [fx, fy] = SK.toScreen(c, PL.foot[0], PL.foot[1] - 60);
        const rr3 = (u - T.dritte + 0.08) / 1.2; if (rr3 > 0 && rr3 < 1) { const vib = Math.sin(u * 80) * 5; SK.pow(g, "RRRING!", 300 + vib, 1130, rr3, { rot: -0.12, px: 104, c: "#ffd34d" });
          g.save(); g.strokeStyle = OL; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 3; i++) { const a = -2.6 + i * 0.45, r0 = 70, r1 = 115; g.beginPath(); g.moveTo(fx + Math.cos(a) * r0, fy + Math.sin(a) * r0); g.lineTo(fx + Math.cos(a) * r1, fy + Math.sin(a) * r1); g.stroke(); g.beginPath(); g.moveTo(fx - Math.cos(a) * r0 + 10, fy + Math.sin(a) * r0); g.lineTo(fx - Math.cos(a) * r1 + 10, fy + Math.sin(a) * r1); g.stroke(); } g.restore(); }
        SK.qmarks(g, SK.toScreen(c, PK.head[0], PK.head[1])[0] + 40, SK.toScreen(c, PK.head[0], PK.head[1])[1] - 190, u, seg(u, T.dritte + 0.2, T.dritte + 0.6), 2);
        SK.flashAt(g, u, [T.c2], 0.08, 0.8);
      } else if (u < T.c3) {
        // ---------- Spiegel: Nahaufnahme, Schnipp ----------
        const cut = seg(u, T.schnipp + 0.05, T.schnipp + 0.12), shock = seg(u, T.augen - 0.2, T.augen + 0.05);
        const c = SK.cam([K(T.c2, 3.3, 700, 735), K(T.augen - 0.3, 3.0, 690, 752), K(T.augen + 0.05, 3.15, 690, 755), K(T.c3, 3.1, 688, 757)], u);
        let sh = 0; const k1 = u - T.schnipp - 0.05; if (k1 > 0 && k1 < 0.3) sh = 1 - k1 / 0.3; const k2 = u - T.augen; if (k2 > 0 && k2 < 0.35) sh = Math.max(sh, 1 - k2 / 0.35);
        g.fillStyle = "#16302f"; g.fillRect(0, 0, W, H);
        const MR = [64, 330, 952, 1150];
        g.save(); rr(g, MR[0], MR[1], MR[2], MR[3], 40); g.clip();
        g.save(); SK.apply(g, c, Math.sin(u * 90) * 12 * sh, Math.cos(u * 77) * 10 * sh);
        room(g, u, { hr: 10.6 }); chair(g, CX, CF, true);
        const PK = kunde(g, u, CX, CF, { eyes: shock > 0.5 ? "wide" : u < T.schnipp + 0.1 ? "side" : "dot", look: shock > 0.5 ? 0 : -0.9, mouth: shock > 0.5 ? "shout" : u < T.schnipp + 0.1 ? "o" : "flat", brow: shock * 0.9, red: shock * 0.45, cut });
        chair(g, CX, CF, false);
        const back = inOut(seg(u, T.schnipp + 0.2, T.schnipp + 0.7));
        leon(g, u, LX, { tgt: [lerp(212, 90, back), lerp(-532, -380, back)], snip: u < T.schnipp + 0.05 ? 0.6 : 0.02, sAng: lerp(-0.15, -1.3, back), phones: 2, eyes: "side", look: -1, mouth: "open", brow: -0.4, red: 0.6 });
        // abgeschnittene Brauenhälfte fällt
        if (cut > 0) { const t2 = u - T.schnipp - 0.1, fy = PK.brow[1] + t2 * t2 * 260 + t2 * 40, fx = PK.brow[0] + 6 + t2 * 22; g.save(); g.translate(fx, fy); g.rotate(t2 * 4); g.fillStyle = "#1a110a"; g.strokeStyle = OL; g.lineWidth = 3; rr(g, -9, -6, 18, 12, 4); g.fill(); g.stroke(); g.restore();
          hairBits(g, 6, PK.brow[0] - 10, PK.brow[0] + 30, PK.brow[1] + t2 * 120, PK.brow[1] + 30 + t2 * 160, 9.1, "#1a110a"); }
        g.restore();
        // Spiegelglanz
        g.fillStyle = "rgba(220,240,245,0.10)"; g.fillRect(0, 0, W, H); g.fillStyle = "rgba(255,255,255,0.14)"; g.beginPath(); g.moveTo(120, 1480); g.lineTo(240, 1480); g.lineTo(700, 330); g.lineTo(580, 330); g.closePath(); g.fill(); g.beginPath(); g.moveTo(290, 1480); g.lineTo(330, 1480); g.lineTo(790, 330); g.lineTo(750, 330); g.closePath(); g.fill();
        g.restore();
        // Goldrahmen
        g.save(); g.lineWidth = 34; g.strokeStyle = "#c79a3c"; rr(g, MR[0], MR[1], MR[2], MR[3], 40); g.stroke(); g.lineWidth = 6; g.strokeStyle = OL; rr(g, MR[0] - 17, MR[1] - 17, MR[2] + 34, MR[3] + 34, 52); g.stroke(); rr(g, MR[0] + 17, MR[1] + 17, MR[2] - 34, MR[3] - 34, 28); g.stroke();
        g.fillStyle = "#e3bb5c"; [[MR[0], MR[1]], [MR[0] + MR[2], MR[1]], [MR[0], MR[1] + MR[3]], [MR[0] + MR[2], MR[1] + MR[3]]].forEach(([qx, qy]) => { g.beginPath(); g.arc(qx, qy, 26, 0, 7); g.fill(); g.lineWidth = 6; g.stroke(); }); g.restore();
        const [mx, my] = SK.toScreen(c, PK.mouth[0], PK.mouth[1]);
        SK.pow(g, "SCHNIPP!", 760, 470, (u - T.schnipp) / 1.0, { rot: 0.1, px: 120, c: "#ffd34d" });
        SK.bubble(g, ["Meine *Augenbraue*!"], 540, 1340, mx, my + 40, win(T.augen - 0.05, T.c3 + 0.05), { shout: true, px: 56 });
        SK.flashAt(g, u, [T.c3], 0.08, 0.8);
      } else {
        // ---------- Heute: Ruhe ----------
        const KF = [K(T.c3, 1.32, 500, 860), K(T.kein + 0.2, 1.28, 600, 850), K(T.voll - 0.35, 1.18, 1010, 790), K(T.samstag + 0.05, 1.7, 1160, 600), K(T.denn, 1.85, 1170, 580)];
        const cr = SK.cam(KF, u); const zin = inExpo(cl((u - T.denn - 0.05) / Math.max(0.3, d - T.denn - 0.05)));
        g.save();
        let c = cr; const fillK = seg(u, T.kein, T.samstag);
        // Ziel der Tauchfahrt: Samstag im Kalender
        const tg = (() => { const { x, y, w } = CAL, cw = (w - 24) / 6; return [x + 12 + cw * 5.5, y + 74 + 22 + 2 * 38 + 16]; })();
        if (u > T.denn) { const k = inOut(cl((u - T.denn) / 0.45)); c = { x: lerp(cr.x, tg[0], k), y: lerp(cr.y, tg[1], k), z: cr.z * (1 + zin * 26) }; }
        SK.apply(g, c);
        room(g, u, { hr: 15.5 + u / 60, warm: 1, open: true });
        // weggeräumtes Wandtelefon: hellerer Fleck
        g.fillStyle = "rgba(255,255,255,0.08)"; rr(g, 328, 530, 104, 170, 18); g.fill(); g.fillStyle = "#1a1a1a"; [[360, 560], [400, 560]].forEach(([hx, hy]) => { g.beginPath(); g.arc(hx, hy, 4, 0, 7); g.fill(); });
        // offene Schublade mit drei schlafenden Telefonen
        g.save(); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = "#2a1a0e"; g.beginPath(); g.moveTo(160, 950); g.lineTo(350, 950); g.lineTo(372, 1000); g.lineTo(138, 1000); g.closePath(); g.fill(); g.stroke();
        handset(g, 205, 978, Math.PI / 2 - 0.1, 0.5, "#4f9a6a"); handset(g, 300, 980, Math.PI / 2 + 0.12, 0.5, "#d64550"); rotary(g, 255, 1000, 0.42, "#2b2b33", 0, true);
        g.fillStyle = "#6b4426"; rr(g, 134, 996, 242, 64, 6); g.fill(); g.stroke(); g.fillStyle = "#d9a441"; g.beginPath(); g.arc(255, 1028, 8, 0, 7); g.fill(); g.stroke(); g.restore();
        // Kaffee und Pflanze auf dem Schrank
        g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#fbf6ec"; rr(g, 300, 870, 46, 48, 8); g.fill(); g.stroke(); g.beginPath(); g.arc(350, 892, 12, -1.4, 1.4); g.stroke();
        g.fillStyle = "#b5651d"; rr(g, 170, 860, 60, 58, 8); g.fill(); g.stroke(); g.fillStyle = "#3d9a6b"; for (let i = 0; i < 5; i++) { g.save(); g.translate(200, 862); g.rotate((i - 2) * 0.45 + Math.sin(u * 1.5 + i) * 0.05); g.beginPath(); g.ellipse(0, -44, 14, 44, 0, 0, 7); g.fill(); g.stroke(); g.restore(); }
        // Wartende
        const G = [gast(g, u, 1000, 0, 0.7), gast(g, u, 1165, 1, 0.7), gast(g, u, 1330, 2, 0.7)];
        const sat = calendar(g, u, fillK, seg(u, T.samstag - 0.05, T.samstag + 0.45));
        // Leon hinter dem Stuhl, ruhig mit beiden Händen
        const sn = 0.5 + 0.5 * Math.cos(u * 6);
        chair(g, CX, CF3, true);
        leon(g, u, LX3, { tgt: [70 + Math.sin(u * 2.2) * 8, -515 + Math.cos(u * 2.2) * 6], comb: [-58, -500 + Math.sin(u * 2.2 + 1) * 8], snip: 0.45 * sn, sAng: -1.2, phones: 0, eyes: "happy", mouth: "smile" });
        const PK = kunde(g, u, CX, CF3, { eyes: "closed", mouth: "smile", look3: { hair: "#7a4a2a", skin: "#e8b48f" } });
        chair(g, CX, CF3, false);
        hairBits(g, 8, 620, 780, 1150, 1210, 21.7, "#7a4a2a");
        g.restore();
        // Zzz aus der Schublade
        const [zx, zy] = SK.toScreen(c, 255, 950); zzz(g, zx, zy, u, seg(u, T.c3 + 0.2, T.c3 + 0.6) * (1 - seg(u, T.denn, T.denn + 0.2)));
        const [kx, ky] = SK.toScreen(c, PK.head[0], PK.head[1]);
        SK.bubble(g, ["*Herrlich* ruhig hier."], 420, 520, kx - 30, ky - 70, win(T.c3 + 0.35, T.voll - 0.4), { px: 50 });
        const [g2x, g2y] = SK.toScreen(c, G[1][0], G[1][1]);
        SK.bubble(g, ["Ich bin um *drei* dran."], 560, 1220, g2x, g2y + 150, win(T.voll - 0.25, T.denn), { px: 48 });
        SK.flashAt(g, u, [T.c3], 0.08, 0.8);
      }
      SK.whiteOut(g, u, d, 0.18);
    },
    ev(d, p) { const T = p._T, E = [[0.0, "tick_hi", 0.55, 0.2], [0.0, "click", 0.5, 0.2], [0.0, "whoosh_down", 0.3, 0]];
      for (let t = 0.37; t < T.c2 - 0.2; t += 0.37) E.push([t, "tick_hi", 0.18, 0.25]);
      E.push([T.linken - 0.15, "pop", 0.35, -0.3], [T.kinn - 0.1, "whoosh_side", 0.3, 0.3], [T.kinn + 0.05, "vphone", 0.22, 0.3], [T.kinn, "pop", 0.35, 0.2]);
      E.push([T.fuss - 0.15, "thump", 0.4, -0.2], [T.dritte - 0.05, "closed_bell", 0.5, -0.3], [T.dritte + 0.6, "closed_bell", 0.35, -0.3]);
      E.push([T.c2, "whoosh_side", 0.4, 0], [T.schnipp + 0.05, "tick_hi", 0.75, 0.3], [T.schnipp + 0.05, "slap", 0.45, 0.3], [T.schnipp + 0.08, "boom", 0.25, 0]);
      E.push([T.augen, "thump", 0.5, 0], [T.augen - 0.05, "pop", 0.4, 0]);
      E.push([T.c3 - 0.06, "whoosh_side", 0.4, -0.3], [T.c3, "chime", 0.35, 0], [T.c3 + 0.3, "shimmer", 0.25, 0], [T.c3 + 0.4, "pop", 0.3, -0.2]);
      for (let t = T.c3 + 0.5; t < T.denn; t += 0.6) E.push([t, "tick", 0.1, 0.1]);
      E.push([T.voll - 0.2, "pop", 0.35, 0.3]); for (let i = 0; i < 6; i++) E.push([T.kein + (T.samstag - T.kein) * (i / 6), "closed_beep", 0.12, 0.35]);
      E.push([T.samstag, "ding", 0.4, 0.3], [T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Barber-Säule dreht, ruhiger Filmtitel ----------
  TYPES.barbier_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^selbst/, E.sys, 1.6); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createRadialGradient(540, 700, 80, 540, 900, 1300); bg.addColorStop(0, "#16393a"); bg.addColorStop(1, "#050d0e"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 18; i++) { const x = rnd(i * 3.7) * 1080 + Math.sin(u * 0.4 + i) * 20, y = 150 + rnd(i * 5.9) * 1500, r = 40 + rnd(i * 1.3) * 110, a = 0.04 + 0.07 * rnd(i * 8.1); const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(255,${190 + Math.floor(rnd(i) * 50)},140,${a})`); gg.addColorStop(1, "rgba(255,200,140,0)"); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      const z = 1.04 - 0.04 * out3(cl(u / 2.5)); g.save(); g.translate(540, 470); g.scale(z, z); g.translate(-540, -470); g.globalAlpha = 0.95; pole(g, 540, 300, 96, 360, u * 0.8, 1); g.restore();
      SK.endTitle(g, u, d, T, { c: "#f3e6c8", glow: "rgba(243,230,200,0.45)", accent: "#d6303a", sub: "rgba(243,230,200,0.85)", key: "#f3e6c8", offer: "TERMINE SELBST BUCHEN", y: 880 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.05, "tick_hi", 0.4, 0.2], [0.1, "shimmer", 0.35, 0], [0.9, "shimmer_hi", 0.25, 0], [T.offer, "ding", 0.3, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
