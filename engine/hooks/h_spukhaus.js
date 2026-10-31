// VOICE_DELAY: 0.5
// h_spukhaus: Neugier-Geschichte (Look "cinema", Anti-Werbung). Halloween, Gewitter, Vollmond: ein Spukhaus mit schiefen Läden,
// Spinnweben, Fledermäusen und einem flackernden Schild RISTORANTE 1980. Drinnen warmes Licht, Mama Rosa hebt die dampfende Lasagne.
// Passanten rennen schreiend weg. Eine Woche später verwandelt ein goldener Lichtstreifen das Haus: frisch gestrichen, Lichterkette,
// Schild „Mama Rosa“, Schlange bis zur Ecke. Küche und Rezept sind dieselben, Rosa zwinkert. Bei „zuerst“ taucht die Kamera ins
// neue Schild, Weiß. Danach spukhaus_end (Kerzenlicht, Kürbisse, Filmtitel).
// Wörter: halloween, lasagne, rosa, aber, haus, sieht, rennt, schreiend, spinnweben, schiefe, schild, woche, leute, ecke, küche, rezept, auch, mama (2.), geändert, zuerst.
(() => {
  const OL = SK.OL;
  const ROSA = { hs: "bun", hair: "#dcdce2", shirt: "#b8452a", apron: "#fff4e2", skirt: "#2b2d42", pants: "#f0c4a0", shoes: "#2b2d42", skin: "#f0c4a0" };
  const SH = ["#4b7fd6", "#e85d75", "#f2b134", "#3d9a6b", "#8e5bd6", "#e0703a", "#2f6f8f", "#c44569", "#6aa84f", "#d9a441", "#5b6ee1", "#b04a3a"];
  const HA = ["#5b3a23", "#1e1a18", "#c98d3a", "#7a4a2a", "#2b2b2b", "#a0522d"];
  const HS = ["short", "long", "cap", "bun", "short", "long", "grey", "short", "cap", "long", "short", "bun"];
  const SK_ = ["#f1c7a1", "#d9a07a", "#8d5a3c", "#f0c4a0"];
  const GROUND = 1400;

  // ---------- kleine Bausteine ----------
  function bolt(g, x, y0, y1, seed, a) { if (a <= 0) return; const pts = [[x, y0]]; let cx = x; const n = 9;
    for (let i = 1; i <= n; i++) { cx += (rnd(seed + i * 1.7) - 0.5) * 120; pts.push([cx, y0 + (y1 - y0) * i / n]); }
    g.save(); g.lineJoin = "round"; g.lineCap = "round";
    [[34, `rgba(170,190,255,${0.18 * a})`], [14, `rgba(210,225,255,${0.55 * a})`], [5, `rgba(255,255,255,${a})`]].forEach(([w, c]) => { g.lineWidth = w; g.strokeStyle = c; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke(); });
    const b = pts[4]; g.lineWidth = 4; g.strokeStyle = `rgba(230,238,255,${0.8 * a})`; g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(b[0] + 90, b[1] + 70); g.lineTo(b[0] + 120, b[1] + 160); g.stroke(); g.restore(); }
  function bat(g, x, y, s, u, i) { const f = Math.sin(u * 18 + i * 2.1); g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#07070d";
    g.beginPath(); g.ellipse(0, 0, 14, 18, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(-6, -14); g.lineTo(-10, -28); g.lineTo(-2, -18); g.moveTo(6, -14); g.lineTo(10, -28); g.lineTo(2, -18); g.fill();
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 8, -6); g.quadraticCurveTo(sd * 40, -30 - f * 30, sd * 80, -10 - f * 40); g.quadraticCurveTo(sd * 66, 0, sd * 58, 8 - f * 10); g.quadraticCurveTo(sd * 46, -2, sd * 36, 12 - f * 6); g.quadraticCurveTo(sd * 22, 2, sd * 8, 8); g.closePath(); g.fill(); }
    g.fillStyle = "#ffd34d"; g.beginPath(); g.arc(-5, -6, 2.5, 0, 7); g.arc(5, -6, 2.5, 0, 7); g.fill(); g.restore(); }
  function web(g, x, y, r, a0, a = 0.75) { g.save(); g.strokeStyle = `rgba(225,230,240,${a})`; g.lineWidth = 2.2; const n = 6;
    for (let i = 0; i <= n; i++) { const an = a0 + i / n * Math.PI / 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r); g.stroke(); }
    for (let k = 1; k <= 4; k++) { const rr0 = r * k / 4.3; g.beginPath(); for (let i = 0; i <= n; i++) { const an = a0 + i / n * Math.PI / 2; const px = x + Math.cos(an) * rr0, py = y + Math.sin(an) * rr0; if (!i) g.moveTo(px, py); else { const am = a0 + (i - 0.5) / n * Math.PI / 2, rm = rr0 * 0.86; g.quadraticCurveTo(x + Math.cos(am) * rm, y + Math.sin(am) * rm, px, py); } } g.stroke(); }
    g.restore(); }
  function glow(g, x, y, r, c, a) { if (a <= 0) return; const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(${c},${a})`); gg.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function pumpkin(g, x, y, s, u, happy) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 5; g.strokeStyle = OL;
    glow(g, 0, -10, 150, "255,150,40", 0.25 + 0.08 * Math.sin(u * 11));
    g.fillStyle = "#e8742a"; for (const [dx, w] of [[-36, 44], [36, 44], [0, 50]]) { g.beginPath(); g.ellipse(dx, 0, w, 52, 0, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = "#4a6b2a"; rr(g, -7, -66, 14, 22, 4); g.fill(); g.stroke();
    const fl = 0.8 + 0.2 * Math.sin(u * 13); g.fillStyle = `rgb(255,${Math.round(200 * fl)},60)`;
    if (happy) { g.beginPath(); g.moveTo(-34, -18); g.lineTo(-18, -32); g.lineTo(-8, -14); g.closePath(); g.moveTo(34, -18); g.lineTo(18, -32); g.lineTo(8, -14); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(-40, 6); g.quadraticCurveTo(0, 46, 40, 6); g.quadraticCurveTo(0, 24, -40, 6); g.fill(); }
    else { g.beginPath(); g.moveTo(-36, -30); g.lineTo(-8, -16); g.lineTo(-30, -8); g.closePath(); g.moveTo(36, -30); g.lineTo(8, -16); g.lineTo(30, -8); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(-40, 12); for (let i = 0; i <= 8; i++) g.lineTo(-40 + i * 10, i % 2 ? 26 : 10); g.lineTo(40, 30); g.lineTo(-40, 30); g.closePath(); g.fill(); }
    g.restore(); }
  function lasagne(g, x, y, s, u, steam = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 7; g.strokeStyle = OL;
    // Auflaufform
    g.fillStyle = "#f2efe8"; rr(g, -190, -30, 380, 80, 18); g.fill(); g.stroke(); g.fillStyle = "#3a6ea5"; g.fillRect(-186, 20, 372, 10);
    // Schichten
    g.fillStyle = "#e9b04a"; rr(g, -170, -62, 340, 42, 12); g.fill(); g.stroke();
    g.fillStyle = "#c0392b"; for (let i = 0; i < 7; i++) { g.beginPath(); g.ellipse(-140 + i * 47, -52, 26, 10, 0, 0, 7); g.fill(); }
    g.fillStyle = "#ffe08a"; for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(-150 + i * 37 + (i % 2) * 8, -64, 18, 8, 0, 0, 7); g.fill(); }
    g.fillStyle = "#3d8b3d"; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(-90 + i * 60, -66, 12, 6, 0.6, 0, 7); g.fill(); }
    g.fillStyle = "#f2efe8"; rr(g, -222, -24, 40, 26, 10); g.fill(); g.stroke(); rr(g, 182, -24, 40, 26, 10); g.fill(); g.stroke();
    // Dampf
    if (steam > 0) { g.lineCap = "round"; for (let i = 0; i < 5; i++) { const ph = (u * 0.7 + i * 0.2) % 1; const sx = -120 + i * 60; g.strokeStyle = `rgba(255,255,255,${0.75 * steam * Math.sin(ph * Math.PI)})`; g.lineWidth = 9;
      g.beginPath(); for (let k = 0; k <= 10; k++) { const yy = -80 - k * 22 - ph * 60, xx = sx + Math.sin(k * 0.8 + u * 3 + i) * 14; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } }
    g.restore(); }
  const rosaHold = (u, steam) => (q, hR, hL) => { lasagne(q, (hR[0] + hL[0]) / 2, (hR[1] + hL[1]) / 2 + 10, 0.62, u, steam); };

  // ---------- Himmel ----------
  function sky(g, u, F) { const gr = g.createLinearGradient(0, -200, 0, 1450);
    if (F) { gr.addColorStop(0, "#141c46"); gr.addColorStop(0.55, "#3b3470"); gr.addColorStop(1, "#e08a5c"); } else { gr.addColorStop(0, "#05070f"); gr.addColorStop(0.6, "#141b30"); gr.addColorStop(1, "#2a3448"); }
    g.fillStyle = gr; g.fillRect(-1500, -1200, 4500, 2700);
    for (let i = 0; i < 70; i++) circle(g, -400 + rnd(i * 2.3) * 2900, rnd(i * 5.1) * 900, 1.5 + rnd(i) * 2.2, `rgba(255,255,255,${(F ? 0.5 : 0.25) * (0.5 + 0.5 * Math.sin(u * 3 + i))})`);
    // Vollmond
    const mx = 860, my = 520; glow(g, mx, my, F ? 260 : 380, F ? "255,236,190" : "210,225,255", F ? 0.25 : 0.4);
    g.fillStyle = F ? "#fff1cf" : "#eef0e2"; g.beginPath(); g.arc(mx, my, F ? 80 : 112, 0, 7); g.fill();
    g.fillStyle = F ? "rgba(220,190,140,0.35)" : "rgba(160,170,170,0.35)"; for (const [dx, dy, r] of [[-30, -20, 22], [26, 18, 16], [-8, 40, 12], [34, -34, 10]]) { g.beginPath(); g.arc(mx + dx * (F ? 0.7 : 1), my + dy * (F ? 0.7 : 1), r * (F ? 0.7 : 1), 0, 7); g.fill(); }
    if (!F) { // Gewitterwolken ziehen über den Mond
      for (let i = 0; i < 9; i++) { const cx = ((rnd(i * 4.1) * 2600 + u * (40 + rnd(i) * 40)) % 2600) - 600, cy = 160 + rnd(i * 7.3) * 420, w = 260 + rnd(i * 3.3) * 260;
        g.fillStyle = `rgba(14,18,32,${0.75 + 0.2 * rnd(i)})`; g.beginPath(); g.ellipse(cx, cy, w, 52, 0, 0, 7); g.ellipse(cx - w * 0.35, cy - 30, w * 0.45, 50, 0, 0, 7); g.ellipse(cx + w * 0.3, cy - 26, w * 0.4, 46, 0, 0, 7); g.fill();
        g.strokeStyle = "rgba(170,185,220,0.18)"; g.lineWidth = 4; g.beginPath(); g.ellipse(cx - w * 0.35, cy - 30, w * 0.45, 50, 0, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } }
    else { for (let i = 0; i < 4; i++) { const cx = ((rnd(i * 8.1) * 2400 + u * 18) % 2400) - 500, cy = 260 + rnd(i * 2.7) * 300; g.fillStyle = "rgba(250,170,140,0.22)"; g.beginPath(); g.ellipse(cx, cy, 300, 26, 0, 0, 7); g.fill(); } }
  }

  // ---------- Nachbarhäuser (rechts, bis zur Ecke) ----------
  function neighbors(g, u, F) { g.lineWidth = 7; g.strokeStyle = OL;
    const H3 = [[960, 360, 760, "#3b4256", "#c9a27a"], [1320, 330, 700, "#353b4e", "#b8c9b0"], [1650, 360, 820, "#3e3a50", "#d9b48a"]];
    H3.forEach(([x, w, top, cs, cf], j) => { g.fillStyle = F ? cf : cs; g.fillRect(x, top, w, GROUND - top); g.strokeRect(x, top, w, GROUND - top);
      g.fillStyle = F ? "#7a4a3a" : "#1d2130"; g.beginPath(); g.moveTo(x - 20, top); g.lineTo(x + w / 2, top - 150); g.lineTo(x + w + 20, top); g.closePath(); g.fill(); g.stroke();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) { const on = rnd(j * 9 + r * 3 + c + (F ? 50 : 0)) > (F ? 0.25 : 0.65); const wx = x + 50 + c * (w - 100) / 2 + 10, wy = top + 60 + r * 190;
        g.fillStyle = on ? (F ? "#ffd88a" : "rgba(255,200,120,0.75)") : (F ? "#55607a" : "#141826"); rr(g, wx, wy, (w - 100) / 2 - 20, 120, 8); g.fill(); g.stroke(); } });
    // Ecke: Straße biegt ab, Laterne, Straßenschild
    g.fillStyle = F ? "#5a4a62" : "#171b28"; g.fillRect(2010, 300, 700, GROUND - 300);
    const lx = 2050; g.fillStyle = "#15161d"; g.fillRect(lx - 8, 820, 16, GROUND - 820 + 40); circle(g, lx, 810, 26, F ? "#ffe6a8" : "#cfd6e6"); glow(g, lx, 830, 300, "255,214,150", F ? 0.35 : 0.15);
    fillRR(g, lx + 12, 900, 190, 54, 8, "#1f5aa8"); g.strokeStyle = "#fff"; g.lineWidth = 3; rr(g, lx + 18, 906, 178, 42, 6); g.stroke(); g.font = "700 26px I"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText("Lindenweg", lx + 107, 928);
  }

  // ---------- Das Haus ----------
  function house(g, u, F, o = {}) {
    g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round";
    // Baum links
    g.save(); g.fillStyle = "#16120f"; g.beginPath(); g.moveTo(40, GROUND); g.quadraticCurveTo(70, 1100, 60, 900); g.lineTo(100, 900); g.quadraticCurveTo(110, 1100, 130, GROUND); g.closePath(); g.fill();
    g.strokeStyle = "#16120f"; g.lineCap = "round"; for (const [a, b, c, d, w] of [[80, 920, -60, 700, 20], [85, 940, 230, 720, 16], [-20, 760, -120, 640, 10], [180, 760, 260, 620, 10], [70, 900, 90, 600, 14], [90, 700, 20, 560, 8], [90, 700, 170, 560, 8]]) { g.lineWidth = w; g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo((a + c) / 2 + 20, (b + d) / 2, c, d); g.stroke(); }
    g.restore();
    if (F) { g.fillStyle = "#2f5a3a"; for (const [x, y, r] of [[-40, 660, 120], [80, 580, 140], [200, 650, 110], [70, 740, 120]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
      for (let i = 0; i < 18; i++) { const x = -120 + rnd(i * 3.1) * 400, y = 500 + rnd(i * 6.2) * 300; circle(g, x, y, 6, `rgba(255,220,140,${0.6 + 0.4 * Math.sin(u * 4 + i)})`); glow(g, x, y, 26, "255,210,120", 0.3); } }
    g.strokeStyle = OL; g.lineWidth = 8;
    // Schornstein
    g.fillStyle = F ? "#9a4a36" : "#2a2630"; g.fillRect(740, 430, 74, 150); g.strokeRect(740, 430, 74, 150); g.fillRect(730, 420, 94, 24); g.strokeRect(730, 420, 94, 24);
    if (F) for (let i = 0; i < 4; i++) { const ph = (u * 0.35 + i * 0.25) % 1; g.fillStyle = `rgba(240,230,230,${0.35 * Math.sin(ph * Math.PI)})`; g.beginPath(); g.arc(777 + Math.sin(u + i) * 20 + ph * 60, 400 - ph * 220, 24 + ph * 40, 0, 7); g.fill(); }
    // Dach
    g.fillStyle = F ? "#b5523a" : "#221e2b"; g.beginPath(); g.moveTo(120, 712); g.lineTo(540, 370); g.lineTo(960, 712); g.closePath(); g.fill(); g.stroke();
    g.save(); g.beginPath(); g.moveTo(120, 712); g.lineTo(540, 370); g.lineTo(960, 712); g.closePath(); g.clip(); g.lineWidth = 4; g.strokeStyle = F ? "rgba(90,30,20,0.55)" : "rgba(0,0,0,0.5)";
    for (let r = 0; r < 9; r++) { const y = 420 + r * 36; g.beginPath(); for (let x = 100; x < 1000; x += 46) { g.moveTo(x + (r % 2) * 23, y); g.arc(x + 23 + (r % 2) * 23, y, 23, Math.PI, 0, true); } g.stroke(); }
    if (!F) { g.fillStyle = "#0a0910"; for (const [x, y] of [[420, 520], [660, 600], [360, 640], [600, 470]]) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 40, y - 10); g.lineTo(x + 56, y + 22); g.lineTo(x + 8, y + 30); g.closePath(); g.fill(); } }
    g.restore();
    // Dachfenster rund
    g.fillStyle = F ? "#ffd88a" : "#0d0f18"; g.beginPath(); g.arc(540, 575, 52, 0, 7); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(488, 575); g.lineTo(592, 575); g.moveTo(540, 523); g.lineTo(540, 627); g.stroke();
    if (!F) { g.fillStyle = `rgba(255,220,120,${0.5 + 0.5 * (Math.sin(u * 7) > 0.6 ? 1 : 0)})`; g.beginPath(); g.arc(522, 562, 5, 0, 7); g.arc(558, 562, 5, 0, 7); g.fill(); }
    // Wand
    const wall = g.createLinearGradient(0, 712, 0, GROUND); if (F) { wall.addColorStop(0, "#f6e6c6"); wall.addColorStop(1, "#e6c99a"); } else { wall.addColorStop(0, "#4d5260"); wall.addColorStop(1, "#33363f"); }
    g.fillStyle = wall; g.fillRect(170, 712, 740, GROUND - 712); g.strokeRect(170, 712, 740, GROUND - 712);
    if (!F) { g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 3; for (let x = 200; x < 910; x += 34) { g.beginPath(); g.moveTo(x, 716); g.lineTo(x + (rnd(x) - 0.5) * 6, GROUND); g.stroke(); }
      g.fillStyle = "rgba(20,30,20,0.35)"; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(220 + rnd(i * 4.4) * 640, 760 + rnd(i * 2.9) * 560, 40, 70, 0, 0, 7); g.fill(); }
      g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.moveTo(560, 720); g.lineTo(575, 790); g.lineTo(552, 840); g.lineTo(570, 900); g.stroke(); }
    else { g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(170, 712, 740, 16); }
    g.strokeStyle = OL; g.lineWidth = 8; g.fillStyle = F ? "#fff8ec" : "#2a2733"; g.fillRect(150, 700, 780, 26); g.strokeRect(150, 700, 780, 26);
    // Obere Fenster mit Läden
    const win = (x, y, k) => { const w = 160, h = 200;
      if (F) { const wg = g.createLinearGradient(0, y, 0, y + h); wg.addColorStop(0, "#ffe7a8"); wg.addColorStop(1, "#f6b860"); g.fillStyle = wg; } else g.fillStyle = "#11141f";
      g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h);
      if (F) { g.fillStyle = "#e85d75"; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 40, y + 90, x + 12, y + h); g.lineTo(x, y + h); g.closePath(); g.fill(); g.beginPath(); g.moveTo(x + w, y); g.quadraticCurveTo(x + w - 40, y + 90, x + w - 12, y + h); g.lineTo(x + w, y + h); g.closePath(); g.fill(); }
      else { g.strokeStyle = "rgba(200,210,230,0.5)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 30, y + 40); g.lineTo(x + 70, y + 90); g.lineTo(x + 52, y + 140); g.moveTo(x + 70, y + 90); g.lineTo(x + 120, y + 80); g.stroke(); g.fillStyle = "#05060a"; g.beginPath(); g.moveTo(x + 90, y + 110); g.lineTo(x + 140, y + 100); g.lineTo(x + 130, y + 170); g.closePath(); g.fill(); }
      g.strokeStyle = OL; g.lineWidth = 8; g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); g.moveTo(x, y + h / 2); g.lineTo(x + w, y + h / 2); g.stroke(); g.strokeRect(x, y, w, h);
      const shutter = (sx, rot, piv) => { g.save(); g.translate(piv[0], piv[1]); g.rotate(rot); g.translate(-piv[0], -piv[1]); g.fillStyle = F ? "#2f6b4f" : "#3a2e26"; g.fillRect(sx, y, 72, h); g.strokeRect(sx, y, 72, h);
        g.lineWidth = 3; g.strokeStyle = F ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.55)"; for (let k2 = 0; k2 < 9; k2++) { g.beginPath(); g.moveTo(sx + 8, y + 18 + k2 * 21); g.lineTo(sx + 64, y + 22 + k2 * 21); g.stroke(); } g.lineWidth = 8; g.strokeStyle = OL; g.restore(); };
      if (F) { shutter(x - 76, 0, [x, y]); shutter(x + w + 4, 0, [x + w, y]); g.fillStyle = "#7a4a2a"; g.fillRect(x - 10, y + h, w + 20, 36); g.strokeRect(x - 10, y + h, w + 20, 36);
        for (let i = 0; i < 7; i++) { circle(g, x + 6 + i * 25, y + h - 6, 15, i % 2 ? "#e5243b" : "#ff6b6b"); circle(g, x + 6 + i * 25, y + h - 6, 5, "#ffd34d"); } }
      else { shutter(x - 76, k ? 0.42 + Math.sin(u * 2.2) * 0.05 : 0.08, k ? [x - 4, y] : [x, y + h]); if (!k) shutter(x + w + 4, -0.3 + Math.sin(u * 1.8) * 0.04, [x + w + 4, y]); } };
    win(250, 770, 1); win(670, 770, 0);
    // Schild
    g.save(); g.translate(540, 1060); g.rotate(F ? 0 : 0.07 + Math.sin(u * 2.5) * 0.015);
    if (F) { g.fillStyle = "#e0b860"; rr(g, -312, -62, 624, 124, 14); g.fill(); g.stroke(); g.fillStyle = "#1f4a3a"; rr(g, -296, -48, 592, 96, 10); g.fill();
      g.font = "italic 400 74px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#f6d58a"; g.shadowColor = "rgba(255,214,130,0.6)"; g.shadowBlur = 20; g.fillText("Mama Rosa", 0, 2); noShadow(g);
      g.font = "600 20px I"; g.letterSpacing = "8px"; g.fillStyle = "#e0b860"; g.fillText("TRATTORIA", 4, -34); g.letterSpacing = "0px"; }
    else { g.fillStyle = "#4a3a2a"; rr(g, -300, -50, 600, 100, 8); g.fill(); g.stroke(); g.strokeStyle = "rgba(0,0,0,0.4)"; g.lineWidth = 3; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(-296, i * 26); g.lineTo(296, i * 26 + 4); g.stroke(); }
      g.font = "400 56px S"; g.textAlign = "left"; g.textBaseline = "middle"; const s = "RISTORANTE 1980"; let tx = -g.measureText(s).width / 2;
      s.split("").forEach((ch, i) => { const on = (o.flick || 0) > 0 ? (rnd(i * 3.3 + Math.floor(u * 9)) > 0.35 ? 1 : 0.25) : (i === 3 || i === 8 ? (Math.sin(u * 13 + i) > 0 ? 0.9 : 0.25) : 0.9); g.fillStyle = `rgba(222,205,160,${on})`; g.fillText(ch, tx, 4); tx += g.measureText(ch).width; });
      g.strokeStyle = OL; g.lineWidth = 8; }
    g.restore();
    // Ketten / Lampen am Schild
    if (F) { for (const sx of [-250, 250]) { g.fillStyle = "#1b1b22"; g.fillRect(540 + sx - 4, 960, 8, 30); circle(g, 540 + sx, 992, 14, "#ffe6a8"); glow(g, 540 + sx, 1010, 140, "255,214,150", 0.45); } }
    else { g.strokeStyle = "#1b1b22"; g.lineWidth = 5; g.beginPath(); g.moveTo(280, 1005); g.lineTo(290, 960); g.moveTo(790, 1022); g.lineTo(800, 960); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
      const fl = Math.sin(u * 23) > 0.2 ? 1 : 0.2; circle(g, 540, 978, 12, `rgba(200,230,255,${fl})`); glow(g, 540, 990, 120, "190,220,255", 0.25 * fl); }
    // Unten: Küchenfenster (immer warm), Tür
    const kx = 210, ky = 1140, kw = 300, kh = 220;
    g.save(); g.beginPath(); g.rect(kx, ky, kw, kh); g.clip();
    const kg = g.createLinearGradient(0, ky, 0, ky + kh); kg.addColorStop(0, "#ffd88a"); kg.addColorStop(1, "#e89a4a"); g.fillStyle = kg; g.fillRect(kx, ky, kw, kh);
    g.fillStyle = "#b5703a"; g.fillRect(kx, ky + 40, kw, 10); for (let i = 0; i < 5; i++) { g.fillStyle = ["#c0392b", "#3d8b3d", "#e9b04a"][i % 3]; rr(g, kx + 20 + i * 56, ky + 10, 30, 32, 5); g.fill(); }
    SK.person(g, kx + kw / 2, ky + kh + 150, 0.34, { ...ROSA, mouth: "grin", eyes: "happy", aL: 0.6, aR: 0.6, eR: -1.2, eL: 1.2, hold: rosaHold(u, 1) });
    g.fillStyle = "#7a4a2a"; g.fillRect(kx, ky + kh - 30, kw, 30);
    if (!F) { g.fillStyle = "rgba(60,50,30,0.45)"; g.fillRect(kx, ky, kw, kh); g.fillStyle = "rgba(40,30,20,0.35)"; for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(kx + rnd(i * 2.2) * kw, ky + rnd(i * 5.5) * kh, 30, 18, 0, 0, 7); g.fill(); } }
    g.restore(); g.strokeRect(kx, ky, kw, kh); g.beginPath(); g.moveTo(kx + kw / 2, ky); g.lineTo(kx + kw / 2, ky + kh); g.stroke();
    if (!F) { g.save(); g.translate(kx + kw / 2, ky + kh / 2); g.rotate(-0.12); g.fillStyle = "#6b4a2e"; g.fillRect(-170, -14, 340, 28); g.strokeRect(-170, -14, 340, 28); g.restore(); }
    else { g.fillStyle = "#7a4a2a"; g.fillRect(kx - 10, ky + kh, kw + 20, 30); g.strokeRect(kx - 10, ky + kh, kw + 20, 30); glow(g, kx + kw / 2, ky + kh + 120, 260, "255,200,120", 0.35); }
    // Tür
    const dx = 630, dy = 1130, dw = 180, dh = GROUND - 1130 - 20;
    g.fillStyle = F ? "#ffd9a0" : "#0a0a0f"; g.fillRect(dx, dy, dw, dh); if (o.door) o.door(g);
    const op = o.open || 0, pw = dw * (1 - 0.8 * op);
    g.fillStyle = F ? "#2f6b4f" : "#2a2018"; g.fillRect(dx, dy, pw, dh); g.strokeRect(dx, dy, pw, dh);
    if (pw > 60) { if (F) { g.fillStyle = "rgba(255,226,170,0.9)"; rr(g, dx + pw * 0.2, dy + 30, pw * 0.6, 100, 40); g.fill(); g.stroke(); circle(g, dx + pw - 24, dy + 150, 9, "#e0b860"); }
      else { g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 3; for (let x = dx + 30; x < dx + pw; x += 30) { g.beginPath(); g.moveTo(x, dy); g.lineTo(x, dy + dh); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8;
        g.save(); g.translate(dx + pw / 2, dy + 120); g.rotate(0.5); g.fillStyle = "#4a3828"; g.fillRect(-110, -14, 220, 28); g.strokeRect(-110, -14, 220, 28); g.rotate(-1.0); g.fillRect(-110, -14, 220, 28); g.strokeRect(-110, -14, 220, 28); g.restore(); } }
    g.strokeRect(dx, dy, dw, dh); g.fillStyle = F ? "#cbb89a" : "#2a2a30"; g.fillRect(dx - 30, GROUND - 20, dw + 60, 20); g.strokeRect(dx - 30, GROUND - 20, dw + 60, 20);
    if (F) { for (const lx of [596, 844]) { g.fillStyle = "#1b1b22"; rr(g, lx - 16, 1160, 32, 50, 6); g.fill(); g.stroke(); circle(g, lx, 1185, 10, "#ffe6a8"); glow(g, lx, 1190, 120, "255,214,150", 0.45); }
      for (const px of [590, 850]) { g.fillStyle = "#b5703a"; rr(g, px - 26, GROUND - 60, 52, 50, 8); g.fill(); g.stroke(); g.fillStyle = "#3d8b3d"; g.beginPath(); g.arc(px, GROUND - 80, 34, 0, 7); g.fill(); g.stroke(); } }
    // Spinnweben
    if (!F) { web(g, 172, 728, 130, 0); web(g, 908, 728, 120, Math.PI / 2); web(g, 252, 772, 70, 0, 0.6); web(g, 828, 772, 70, Math.PI / 2, 0.6); web(g, 632, 1132, 80, 0, 0.6); web(g, 808, 1132, 70, Math.PI / 2, 0.6);
      // Spinne
      const sy = 790 + 40 * Math.sin(u * 1.5); g.strokeStyle = "rgba(225,230,240,0.7)"; g.lineWidth = 2; g.beginPath(); g.moveTo(205, 740); g.lineTo(205, sy); g.stroke(); circle(g, 205, sy + 8, 9, "#0a0a0f");
      g.strokeStyle = "#0a0a0f"; g.lineWidth = 2; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(205, sy + 8); g.lineTo(190, sy - 4 + i * 7); g.moveTo(205, sy + 8); g.lineTo(220, sy - 4 + i * 7); g.stroke(); } g.strokeStyle = OL; }
    // Lichterkette
    if (F) { const pts = [[150, 718], [330, 740], [540, 712], [750, 740], [930, 718]]; g.strokeStyle = "#1b1b22"; g.lineWidth = 3;
      for (let i = 0; i < 4; i++) { const [a, b] = [pts[i], pts[i + 1]]; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 34, b[0], b[1]); g.stroke();
        for (let k = 1; k < 6; k++) { const t = k / 6, x = lerp(a[0], b[0], t), y = lerp(a[1], b[1], t) + Math.sin(t * Math.PI) * 30 + 10; const c = ["255,214,120", "255,140,120", "255,240,190"][(i + k) % 3]; glow(g, x, y, 30, c, 0.6); circle(g, x, y, 8, `rgb(${c})`); } } }
    // Kürbis auf der Stufe
    pumpkin(g, 880, GROUND - 46, 0.62, u, F);
  }
  function ground(g, u, F) { g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = F ? "#8f7f74" : "#2c2f3a"; g.fillRect(-1500, GROUND, 4500, 80); g.strokeRect(-1500, GROUND, 4500, 80);
    g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 3; for (let x = -1500; x < 3000; x += 120) { g.beginPath(); g.moveTo(x, GROUND); g.lineTo(x - 20, GROUND + 80); g.stroke(); }
    g.fillStyle = F ? "#3a3444" : "#14161f"; g.fillRect(-1500, GROUND + 80, 4500, 1200);
    if (F) glow(g, 540, GROUND + 60, 600, "255,190,120", 0.25); }
  function fog(g, u, a) { if (a <= 0) return; for (let i = 0; i < 12; i++) { const x = ((rnd(i * 3.7) * 2400 + u * (50 + rnd(i) * 60)) % 2400) - 600, y = 1240 + rnd(i * 5.3) * 300, r = 260 + rnd(i * 2.1) * 240;
      const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(170,185,210,${0.28 * a})`); gg.addColorStop(1, "rgba(170,185,210,0)"); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); } }
  function world(g, u, F, o = {}) { sky(g, u, F); neighbors(g, u, F); ground(g, u, F); house(g, u, F, o); if (!F) fog(g, u, 1);
    if (!F) for (let i = 0; i < 6; i++) { const t = (u * 0.22 + i / 6) % 1; bat(g, 540 + Math.sin(t * 6 + i) * 360 + (i % 2 ? 1 : -1) * t * 400, 560 - t * 500 + Math.sin(u * 3 + i) * 30, 0.9 + rnd(i) * 0.6, u, i); } }

  // ---------- Küche (innen) ----------
  function kitchen(g, u, o) {
    const wg = g.createLinearGradient(0, 0, 0, 1300); wg.addColorStop(0, "#c98a4a"); wg.addColorStop(1, "#f2c48a"); g.fillStyle = wg; g.fillRect(-800, -600, 2700, 2200);
    g.lineWidth = 7; g.strokeStyle = OL;
    // Fliesen
    for (let r = 0; r < 6; r++) for (let c = -6; c < 16; c++) { g.fillStyle = (r + c) % 2 ? "#f6ead2" : "#e3d2b0"; g.fillRect(c * 90, 860 + r * 60, 90, 60); }
    g.strokeStyle = "rgba(120,80,40,0.25)"; g.lineWidth = 2; for (let r = 0; r < 7; r++) { g.beginPath(); g.moveTo(-600, 860 + r * 60); g.lineTo(1600, 860 + r * 60); g.stroke(); }
    g.lineWidth = 7; g.strokeStyle = OL;
    // Regal mit Gläsern und Töpfen
    g.fillStyle = "#7a4a2a"; g.fillRect(-300, 470, 900, 24); g.strokeRect(-300, 470, 900, 24);
    for (let i = 0; i < 8; i++) { const x = -230 + i * 100; g.fillStyle = ["#c0392b", "#e9b04a", "#3d8b3d", "#f2efe8"][i % 4]; rr(g, x, 380, 60, 90, 10); g.fill(); g.stroke(); g.fillStyle = "#b5703a"; rr(g, x - 4, 366, 68, 20, 5); g.fill(); g.stroke(); }
    for (let i = 0; i < 3; i++) { const x = 120 + i * 150, sw = Math.sin(u * 1.8 + i) * 0.04; g.save(); g.translate(x, 520); g.rotate(sw); g.strokeStyle = "#3a2a1a"; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 60); g.stroke(); g.strokeStyle = OL; g.lineWidth = 6;
      const cg = g.createLinearGradient(-60, 0, 60, 0); cg.addColorStop(0, "#a8582c"); cg.addColorStop(0.5, "#f0a060"); cg.addColorStop(1, "#a8582c"); g.fillStyle = cg; g.beginPath(); g.arc(0, 90, 50 - i * 6, 0, Math.PI); g.closePath(); g.fill(); g.stroke(); g.restore(); }
    // Knoblauchzopf
    for (let i = 0; i < 5; i++) { circle(g, 650 + Math.sin(i) * 8, 420 + i * 46, 22, "#f6f1e6"); g.beginPath(); g.arc(650 + Math.sin(i) * 8, 420 + i * 46, 22, 0, 7); g.stroke(); }
    // Fenster mit Außenwelt
    const fx = 760, fy = 520, fw = 260, fh = 320; g.save(); g.beginPath(); g.rect(fx, fy, fw, fh); g.clip();
    const sg = g.createLinearGradient(0, fy, 0, fy + fh); sg.addColorStop(0, o.storm ? "#0a0f22" : "#1b2350"); sg.addColorStop(1, o.storm ? "#25304a" : "#e08a5c"); g.fillStyle = sg; g.fillRect(fx, fy, fw, fh);
    circle(g, fx + 190, fy + 90, 36, "#f2f0e0");
    if (o.storm) { SK.rain(g, u, 0.8, 40, 8); const lf = 1 - cl(Math.abs(u - (o.bolt || -9)) / 0.12); bolt(g, fx + 90, fy - 10, fy + fh, 77, lf); }
    g.restore(); g.fillStyle = "#fff8ec"; g.lineWidth = 7; g.strokeRect(fx, fy, fw, fh); g.beginPath(); g.moveTo(fx + fw / 2, fy); g.lineTo(fx + fw / 2, fy + fh); g.moveTo(fx, fy + fh / 2); g.lineTo(fx + fw, fy + fh / 2); g.stroke();
    g.fillStyle = "#e85d75"; g.beginPath(); g.moveTo(fx - 20, fy - 20); g.quadraticCurveTo(fx + 30, fy + 160, fx - 10, fy + fh + 20); g.lineTo(fx - 40, fy + fh + 20); g.lineTo(fx - 40, fy - 20); g.closePath(); g.fill(); g.stroke();
    // Rezeptkarte an der Wand
    const rk = o.card || 0; g.save(); g.translate(180, 720); g.rotate(-0.06); g.scale(1 + rk * 0.06, 1 + rk * 0.06);
    glow(g, 0, 0, 220, "255,240,190", 0.5 * rk); g.fillStyle = "#fff3d6"; g.lineWidth = 6; rr(g, -110, -130, 220, 260, 10); g.fill(); g.stroke(); circle(g, 0, -122, 12, "#e5243b"); g.stroke();
    g.font = "italic 400 34px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#8a2d2a"; g.fillText("Lasagne", 0, -78); g.font = "italic 400 24px S"; g.fillStyle = "#6b5a4a"; g.fillText("di Nonna", 0, -46);
    g.strokeStyle = "rgba(90,70,50,0.6)"; g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-80, -10 + i * 22); g.lineTo(60 - (i % 3) * 20, -10 + i * 22); g.stroke(); }
    g.restore(); g.save(); g.translate(240, 820); g.fillStyle = "#e5243b"; g.strokeStyle = OL; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 14); g.bezierCurveTo(-24, -2, -16, -24, 0, -10); g.bezierCurveTo(16, -24, 24, -2, 0, 14); g.fill(); g.stroke(); g.restore();
    // Rosa hinter der Theke
    const lift = o.lift || 0;
    SK.person(g, 540, 1470 - lift * 30, 1.28, { ...ROSA, mouth: o.mouth || "grin", eyes: o.eyes || "happy", look: o.look || 0, aL: 0.6 - lift * 0.35, aR: 0.6 - lift * 0.35, eR: -1.2, eL: 1.2, bob: Math.sin(u * 3) * 4, hold: rosaHold(u, 1) });
    // Theke
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#c9a27a"; g.fillRect(-600, 1150, 2300, 50); g.strokeRect(-600, 1150, 2300, 50);
    const tg = g.createLinearGradient(0, 1200, 0, 1920); tg.addColorStop(0, "#7a4a2a"); tg.addColorStop(1, "#4a2a18"); g.fillStyle = tg; g.fillRect(-600, 1200, 2300, 900);
    g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 4; for (let x = -600; x < 1700; x += 180) g.strokeRect(x + 20, 1240, 140, 520);
    // Kräuter, Tomaten, Nudelholz auf der Theke
    g.strokeStyle = OL; g.lineWidth = 6; circle(g, 150, 1130, 32, "#d6342a"); g.beginPath(); g.arc(150, 1130, 32, 0, 7); g.stroke(); circle(g, 205, 1138, 26, "#e5443a"); g.beginPath(); g.arc(205, 1138, 26, 0, 7); g.stroke();
    g.fillStyle = "#d9b07a"; rr(g, 760, 1120, 230, 30, 14); g.fill(); g.stroke(); g.fillStyle = "#b5703a"; rr(g, 730, 1126, 40, 18, 8); g.fill(); g.stroke(); rr(g, 980, 1126, 40, 18, 8); g.fill(); g.stroke();
    glow(g, 540, 800, 700, "255,200,120", 0.18);
  }

  TYPES.h_spukhaus = {
    zone: "top", pal: "c_night", bgv: 0, coverT: 7.3, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.hallo = f(/^halloween/, 0, 0.05); T.lasagne = f(/^lasagne/, T.hallo, T.hallo + 1.2); T.rosa = f(/^rosa/, T.lasagne, T.lasagne + 1.2); T.aber = f(/^aber/, T.rosa, T.rosa + 0.6);
      T.haus = f(/^haus/, T.aber, T.aber + 0.4); T.sieht = f(/^sieht/, T.haus, T.haus + 0.6); T.rennt = f(/^rennt/, T.sieht, T.sieht + 0.3); T.schrei = f(/^schreiend/, T.rennt, T.rennt + 0.3);
      T.spinn = f(/^spinnweben/, T.schrei, T.schrei + 0.9); T.schief = f(/^schiefe/, T.spinn, T.spinn + 0.8); T.schild = f(/^schild/, T.schief, T.schief + 1.0); T.jahr = f(/^neunzehn/, T.schild, T.schild + 0.5);
      T.woche = f(/^woche/, T.jahr, T.jahr + 1.8); T.leute = f(/^leute/, T.woche, T.woche + 1.0); T.ecke = f(/^ecke/, T.leute, T.leute + 0.6); T.kueche = f(/^küche/, T.ecke, T.ecke + 0.9);
      T.rezept = f(/^rezept/, T.kueche, T.kueche + 1.3); T.auch = f(/^auch/, T.rezept, T.rezept + 0.4); T.mama2 = f(/^mama/, T.auch, T.auch + 0.6); T.geaend = f(/^geändert/, T.mama2, T.mama2 + 1.2); T.zuerst = f(/^zuerst/, T.geaend, T.geaend + 0.6);
      T.eine = f(/^eine$/, T.jahr, T.woche - 0.3); T.die2 = f(/^die$/, T.ecke, T.kueche - 0.15);
      T.bB = T.lasagne - 0.45; T.bC = T.aber - 0.1; T.bD = T.eine - 0.12; T.bE = T.die2 - 0.08; T.bF = T.mama2 - 0.08; p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const ph = u < T.bB ? 0 : u < T.bC ? 1 : u < T.bD ? 2 : u < T.bE ? 3 : u < T.bF ? 4 : 5;
      const K = (t, z, x, y) => ({ t, z, x, y });
      g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      const lightning = [0.0, T.schrei - 0.05];
      if (ph === 0) { // Spukhaus, Blitz, Kamera schiebt sich ans warme Küchenfenster
        const c = SK.cam([K(0, 1.1, 540, 900), K(T.hallo + 0.3, 1.12, 520, 930), K(T.bB, 1.75, 360, 1180)], u); g.save(); SK.apply(g, c); world(g, u, false);
        bolt(g, 300, -200, 640, 11, 1 - cl(u / 0.45)); g.restore();
        const lf = 0.35 * (1 - cl(u / 0.3)); if (lf > 0) { g.fillStyle = `rgba(200,215,255,${lf})`; g.fillRect(0, 0, W, H); }
      } else if (ph === 1) { // Küche: Rosa hebt die Lasagne
        const su = u - T.bB; const c = SK.cam([K(T.bB, 1.12, 540, 980), K(T.rosa + 0.2, 1.02, 540, 940), K(T.bC, 1.0, 540, 940)], u);
        g.save(); SK.apply(g, c); kitchen(g, u, { storm: true, bolt: T.bB + 0.6, lift: out3(seg(u, T.bB, T.bB + 0.6)), eyes: u > T.rosa ? "happy" : "dot", mouth: "grin" }); g.restore();
        if (u > T.rosa - 0.1) sparkles(g, 540, 620, u, 8, 200, "#ffe9a8", 5);
      } else if (ph === 2) { // Passanten sehen das Haus und rennen schreiend weg, dann Details
        const c = SK.cam([K(T.bC, 1.0, 540, 980), K(T.schrei, 0.98, 520, 990), K(T.spinn - 0.15, 1.85, 330, 800), K(T.schief - 0.1, 1.75, 760, 860), K(T.schild - 0.15, 1.65, 540, 1060), K(T.bD, 1.72, 540, 1060)], u);
        let shake = 0; { const k = u - T.schrei; if (k > 0 && k < 0.35) shake = 1 - k / 0.35; }
        g.save(); SK.apply(g, c, Math.sin(u * 90) * 14 * shake, Math.cos(u * 77) * 10 * shake); world(g, u, false, { flick: u > T.schild - 0.15 ? 1 : 0 });
        bolt(g, 760, -300, 560, 23, 1 - cl(Math.abs(u - T.schrei + 0.05) / 0.25));
        const run = seg(u, T.rennt - 0.15, T.rennt + 1.4), scared = u > T.rennt - 0.2;
        const P = [[330, 0], [470, 1], [610, 2]];
        P.forEach(([x0, i]) => { const x = scared ? x0 - inExpo(run) * 1100 - run * 300 : x0 - 60 + seg(u, T.bC, T.sieht) * 60; const wk = scared ? u * 19 + i : u * 7 + i;
          SK.person(g, x, GROUND + 50, 0.62, { shirt: SH[i * 3 + 1], hair: HA[i], hs: HS[i], skin: SK_[i], walk: wk, flip: scared, eyes: u > T.sieht - 0.1 ? "wide" : "dot", mouth: scared ? "shout" : u > T.sieht - 0.1 ? "o" : "flat", brow: scared ? -1 : 0, look: scared ? 0 : 0.6,
            aL: scared ? -1.0 + Math.sin(u * 19 + i) * 0.3 : undefined, aR: scared ? -1.1 - Math.sin(u * 19 + i) * 0.3 : undefined, eL: scared ? 0.6 : 0, eR: scared ? -0.6 : 0, bob: scared ? -Math.abs(Math.sin(wk)) * 26 : 0 }); });
        g.restore();
        if (scared) { const [a1, b1] = SK.toScreen(c, 330 - inExpo(run) * 1100 - run * 300, GROUND - 330), [a2, b2] = SK.toScreen(c, 610 - inExpo(run) * 1100 - run * 300, GROUND - 330);
          SK.bubble(g, ["*AAAH!*"], 300, 560, Math.max(60, a1), b1, win(T.schrei - 0.05, T.spinn - 0.1), { shout: true, px: 70 });
          SK.bubble(g, ["*HILFE!*"], 770, 700, Math.max(60, a2), b2, win(T.schrei + 0.15, T.spinn - 0.1), { shout: true, px: 58 }); }
      } else if (ph === 3) { // Eine Woche später: goldener Lichtstreifen verwandelt das Haus, Schlange bis zur Ecke
        const sw = inOut(seg(u, T.bD + 0.05, T.woche + 0.75)); const sx = sw < 1 ? lerp(-150, 1250, sw) : 99999;
        const c = SK.cam([K(T.bD, 1.0, 540, 960), K(T.woche + 0.85, 1.0, 540, 960), K(T.ecke - 0.05, 1.0, 1520, 960), K(T.bE, 1.02, 1560, 960)], u);
        const queue = (q) => { for (let i = 11; i >= 0; i--) { const x = 900 + i * 100; const ap = seg(u, T.woche + 0.2 + i * 0.05, T.woche + 0.6 + i * 0.05);
            q.save(); q.globalAlpha = cl(ap * 1.5); SK.person(q, x, GROUND + 50 - (1 - out3(ap)) * 40, 0.64, { shirt: SH[i], hair: HA[i % 6], hs: HS[i], skin: SK_[i % 4], flip: true, mouth: i === 1 || i === 10 ? "grin" : "smile", eyes: i % 3 ? "happy" : "dot", look: -0.6, bob: Math.sin(u * 3 + i) * 3, aR: i % 4 === 2 ? -0.4 : undefined, eR: i % 4 === 2 ? -1.2 : 0 }); q.restore(); } };
        g.save(); SK.apply(g, c);
        g.save(); g.beginPath(); g.rect(sx, -2000, 6000, 6000); g.clip(); world(g, u, false); g.restore();
        g.save(); g.beginPath(); g.rect(-3000, -2000, sx + 3000, 6000); g.clip(); world(g, u, true); queue(g); g.restore();
        if (sw > 0 && sw < 1) { const gr = g.createLinearGradient(sx - 90, 0, sx + 90, 0); gr.addColorStop(0, "rgba(255,214,130,0)"); gr.addColorStop(0.5, "rgba(255,240,200,0.95)"); gr.addColorStop(1, "rgba(255,214,130,0)"); g.fillStyle = gr; g.fillRect(sx - 90, -400, 180, 2600);
          for (let i = 0; i < 26; i++) { const y = rnd(i * 3.3) * 1700 + 100, x = sx + (rnd(i * 7.1) - 0.5) * 140; circle(g, x, y, 3 + rnd(i) * 5, `rgba(255,236,170,${0.5 + 0.5 * Math.sin(u * 20 + i)})`); } }
        g.restore();
        const [p1x, p1y] = SK.toScreen(c, 1000, GROUND - 300), [p2x, p2y] = SK.toScreen(c, 1900, GROUND - 300);
        SK.bubble(g, ["Riecht das", "*gut*!"], Math.min(820, Math.max(280, p1x - 120)), 640, p1x, p1y, win(T.leute - 0.1, T.bE + 0.1), { px: 52 });
        if (u > T.ecke - 0.4) SK.bubble(g, ["*Mmmh!*"], 700, 820, p2x, p2y, win(T.ecke - 0.15, T.bE + 0.1), { px: 56 });
      } else if (ph === 4) { // Küche: dieselbe Rosa, dasselbe Rezept, sie zwinkert
        const c = SK.cam([K(T.bE, 1.0, 540, 940), K(T.kueche + 0.3, 1.08, 540, 920), K(T.rezept - 0.2, 1.45, 330, 800), K(T.auch + 0.1, 1.4, 420, 820), K(T.bF, 1.3, 480, 820)], u);
        const wink = u > T.auch - 0.05; g.save(); SK.apply(g, c); kitchen(g, u, { storm: false, card: seg(u, T.rezept - 0.25, T.rezept + 0.1), lift: 1, eyes: wink ? "wink" : "happy", mouth: "grin", look: u > T.rezept - 0.2 && !wink ? -0.8 : 0 }); g.restore();
        if (wink) sparkles(g, SK.toScreen(c, 540, 680)[0], SK.toScreen(c, 540, 680)[1], u, 7, 140, "#ffe9a8", 9);
      } else { // Fassade: Rosa winkt in der Tür, Kamera taucht ins Schild
        const dive = inExpo(cl((u - T.zuerst - 0.05) / Math.max(0.3, d - T.zuerst - 0.05)));
        const c = SK.cam([K(T.bF, 1.0, 540, 980), K(T.geaend + 0.2, 1.35, 540, 1060), K(T.zuerst, 1.45, 540, 1060)], u); c.z *= 1 + dive * 24;
        g.save(); SK.apply(g, c);
        const rosaDoor = (q) => SK.person(q, 720, GROUND - 20, 0.42, { ...ROSA, mouth: "grin", eyes: "happy", aR: -0.9 + Math.sin(u * 8) * 0.3, eR: -0.8, aL: 1.2 });
        world(g, u, true, { open: 1, door: rosaDoor });
        for (let i = 7; i >= 0; i--) SK.person(g, 920 + i * 100, GROUND + 50, 0.64, { shirt: SH[i], hair: HA[i % 6], hs: HS[i], skin: SK_[i % 4], flip: true, mouth: "smile", eyes: "happy", look: -0.6, bob: Math.sin(u * 3 + i) * 3 });
        g.restore();
      }
      SK.flashAt(g, u, [T.bB, T.bC, T.bE, T.bF], 0.08, 0.45); SK.flashAt(g, u, [T.schrei - 0.05], 0.12, 0.55); SK.flashAt(g, u, [T.bD], 0.1, 0.6);
      // Kino-Vignette
      const vg = g.createRadialGradient(540, 960, 500, 540, 960, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.45)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T, E = [[0.0, "thunder", 0.85, 0], [0.0, "boom", 0.35, 0], [0.02, "flash", 0.4, 0], [0.3, "balloon_flutter", 0.35, 0.4]];
      for (let t = 0.2; t < T.bB; t += 1.3) E.push([t, "closed_rain", 0.35, 0]); E.push([0.6, "h_crack_creak", 0.35, -0.3]);
      E.push([T.bB - 0.05, "whoosh_side", 0.35, 0], [T.bB + 0.1, "ding", 0.3, 0], [T.bB + 0.6, "thunder", 0.3, 0.4], [T.rosa, "shimmer", 0.35, 0]);
      E.push([T.bC, "whoosh_down", 0.3, 0], [T.haus, "h_crack_creak", 0.4, 0.3], [T.rennt - 0.15, "slap", 0.45, 0], [T.schrei - 0.05, "thunder", 0.8, 0], [T.schrei, "boom", 0.4, 0], [T.schrei + 0.02, "pop", 0.4, -0.3], [T.schrei + 0.17, "pop", 0.35, 0.3], [T.rennt, "vsteps", 0.45, -0.4]);
      E.push([T.spinn - 0.2, "whoosh_side", 0.3, -0.3], [T.schief - 0.15, "h_crack_creak", 0.5, 0.3], [T.schild - 0.2, "whoosh_side", 0.3, 0], [T.schild, "ls_flick", 0.4, 0], [T.schild + 0.4, "ls_zirp", 0.3, 0]);
      E.push([T.bD, "whoosh_up", 0.4, 0], [T.bD + 0.05, "tr_swish", 0.4, -0.5], [T.bD + 0.1, "shimmer", 0.5, 0], [T.woche + 0.4, "shimmer_hi", 0.35, 0.4], [T.woche + 0.8, "chime", 0.35, 0]);
      E.push([T.leute - 0.1, "pop", 0.35, 0], [T.leute + 0.2, "whoosh_side", 0.3, 0.5], [T.ecke - 0.15, "pop", 0.35, 0.4]);
      E.push([T.bE - 0.05, "whoosh_down", 0.3, 0], [T.bE + 0.05, "ding", 0.3, 0], [T.rezept - 0.2, "shimmer_hi", 0.3, -0.3], [T.auch - 0.05, "pop", 0.35, 0], [T.auch, "ding", 0.3, 0]);
      E.push([T.bF - 0.05, "whoosh_up", 0.35, 0], [T.bF + 0.1, "closed_bell", 0.4, 0.3], [T.geaend, "shimmer", 0.3, 0], [T.zuerst, "riser", 0.6, 0, Math.max(0.3, d - T.zuerst)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Kerzenlicht, Kürbisse, Filmtitel ----------
  TYPES.spukhaus_end = {
    zone: "center", pal: "c_warm", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^neue/, E.sys, 1.4); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createRadialGradient(540, 900, 80, 540, 980, 1250); bg.addColorStop(0, "#3a1c0c"); bg.addColorStop(1, "#0c0503"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { const x = (rnd(i * 3.3) * 1200 + u * (5 + rnd(i) * 8)) % 1200 - 60, y = rnd(i * 6.6) * 1900, r = 20 + rnd(i * 2.2) * 60; glow(g, x, y, r, "255,180,90", 0.05 + 0.08 * (0.5 + 0.5 * Math.sin(u * 1.4 + i))); }
      // Kerzen unten
      const candle = (x, y, h, i) => { g.fillStyle = "#f3e6cc"; g.strokeStyle = "#3a2410"; g.lineWidth = 4; rr(g, x - 22, y - h, 44, h, 6); g.fill(); g.stroke();
        const fl = 1 + 0.12 * Math.sin(u * 13 + i * 2) + 0.06 * Math.sin(u * 29 + i); glow(g, x, y - h - 26, 170, "255,170,70", 0.35 * fl);
        g.fillStyle = "#ffcf5a"; g.beginPath(); g.ellipse(x + Math.sin(u * 5 + i) * 2, y - h - 24, 11 * fl, 26 * fl, 0, 0, 7); g.fill(); g.fillStyle = "#fff4cf"; g.beginPath(); g.ellipse(x, y - h - 18, 5, 12, 0, 0, 7); g.fill(); };
      [[170, 1740, 120], [260, 1760, 80], [820, 1760, 90], [905, 1740, 140]].forEach(([x, y, h], i) => candle(x, y, h, i));
      pumpkin(g, 400, 1735, 0.95, u, true); pumpkin(g, 680, 1740, 0.8, u, true);
      SK.endTitle(g, u, d, T, { c: "#fff1dc", glow: "rgba(255,190,110,0.55)", accent: "#e8a24a", sub: "rgba(255,226,190,0.85)", key: "#ffc46a", offer: "IHR ERSTER EINDRUCK IM NETZ", y: 820 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.1, "shimmer", 0.35, 0], [0.3, "closed_bell", 0.25, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
