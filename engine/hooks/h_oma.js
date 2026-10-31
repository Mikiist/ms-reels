// VOICE_DELAY: 0.45
// h_oma: Neugier-Geschichte (Look "story", Anti-Werbung). Oma Gerda sitzt auf der Bank vor dem Laden ihres Enkels,
// drei Kunden fragen gleichzeitig (Sprechblasen ab Bild 0), Oma antwortet mit erhobenem Zeigefinger. Bei „alles“ POW.
// „Dann fliegt Oma“: Flugzeug über dem Strand, Oma mit Sonnenhut im Liegestuhl, Cocktail. „Der Enkel bekommt Panik“:
// leerer Laden, Kunden an der Scheibe, Fragen stapeln sich, der Enkel rauft sich die Haare, Omas Schaukelstuhl ist leer.
// „Doch“: Nacht, Laden dunkel, Mond, Kirchturmuhr. Eine Kundin im Schlafanzug fragt aus dem Fenster, eine freundliche
// Antwort-Sprechblase erscheint aus dem Nichts (kein Handy), sie lächelt. Uhr schlägt zwei. Bei „Denn“ Tauchfahrt in die Antwort, Weiß.
// Danach oma_end (Strickmuster, Wollknäuel, Filmtitel, „IHR KI-CHATBOT“).
// Wörter: wann, gibt, blau, liefern, alles, dann, mallorca, der, enkel, panik, doch, fragen, beantwortet, nachts, zwei, denn.
(() => {
  const OL = SK.OL;
  const FL = 1400, S = 0.85;
  const K = (t, z, x, sy = 1450) => ({ t, z, x, y: FL - (sy - 960) / z });
  const OMA = { hs: "bun", hair: "#dcdce4", skin: "#f1c7a1", glasses: true, shirt: "#b4506e", skirt: "#4a4f7a", pants: "#c9a58a", shoes: "#6b2a3a" };
  const C1 = { hs: "long", hair: "#7a4a2a", skin: "#f1c7a1", shirt: "#3d9a6b", skirt: "#2f5f8f", pants: "#f1c7a1", shoes: "#6b2f3a" };
  const C2 = { hs: "cap", hair: "#2f6f8f", skin: "#f0c9a8", shirt: "#f2b134", pants: "#3b4256", shoes: "#3a2a20" };
  const C3 = { hs: "short", hair: "#1e1a18", skin: "#a9734f", shirt: "#e0703a", pants: "#2f3a52", shoes: "#1e1e24", glasses: true };
  const ENKEL = { hs: "short", hair: "#c9772f", skin: "#f1c7a1", shirt: "#3d6fb0", apron: "#2f5d4a", pants: "#2b2f3a", shoes: "#5a3a26" };
  const KUNDIN = { hs: "long", hair: "#c9772f", skin: "#f1c7a1", shirt: "#9fc4ec" };
  const SE = 1.0; const OX = 440, X1 = 150, X2 = 770, X3 = 970; // Oma (Bank), Kunden
  const ANS = [680, 900]; // Antwort-Sprechblase in der Nacht (Welt)

  // ---------- kleine Dinge ----------
  function sweater(g, x, y, s, c, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL; g.lineJoin = "round"; g.fillStyle = c;
    g.beginPath(); g.moveTo(-40, -60); g.lineTo(-90, -30); g.lineTo(-78, 10); g.lineTo(-52, 0); g.lineTo(-52, 60); g.lineTo(52, 60); g.lineTo(52, 0); g.lineTo(78, 10); g.lineTo(90, -30); g.lineTo(40, -60); g.quadraticCurveTo(0, -36, -40, -60); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 4; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 26, -30); g.lineTo(i * 26, 52); g.stroke(); } g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(-52, 44, 104, 10); g.restore(); }
  function folded(g, x, y, c) { g.lineWidth = 5; g.strokeStyle = OL; g.fillStyle = c; rr(g, x - 60, y - 34, 120, 34, 8); g.fill(); g.stroke(); g.strokeStyle = "rgba(0,0,0,0.18)"; g.beginPath(); g.moveTo(x - 50, y - 17); g.lineTo(x + 50, y - 17); g.stroke(); }
  function yarn(g, x, y, r, c, u = 0) { g.save(); g.translate(x, y); g.rotate(u); g.lineWidth = 5; g.strokeStyle = OL; circle(g, 0, 0, r, c); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.22)"; g.lineWidth = 3; for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(0, 0, r * 0.95, r * (0.25 + i * 0.2), 0.6 + i * 0.5, 0, 7); g.stroke(); } g.restore(); }
  function flowers(g, x, y, u) { g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#b5552f"; g.beginPath(); g.moveTo(x - 60, y - 90); g.lineTo(x + 60, y - 90); g.lineTo(x + 46, y); g.lineTo(x - 46, y); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#4f8a4a"; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.38 + Math.sin(u * 1.7 + i) * 0.04; g.beginPath(); g.ellipse(x + Math.cos(a) * 50, y - 100 + Math.sin(a) * 50, 13, 32, a + 1.57, 0, 7); g.fill(); g.stroke(); }
    [[-34, -160], [0, -178], [34, -158], [-14, -134], [22, -128]].forEach(([a, b], i) => { circle(g, x + a, y + b, 17, i % 2 ? "#e5243b" : "#ff6b6b"); g.lineWidth = 4; g.stroke(); circle(g, x + a, y + b, 6, "#ffd34d"); }); g.lineWidth = 8; }
  function stars(g, u, n = 50) { for (let i = 0; i < n; i++) { const x = -300 + rnd(i * 3.3) * 1700, y = -200 + rnd(i * 5.1) * 900, a = 0.45 + 0.55 * Math.sin(u * 2.4 + i * 1.7); circle(g, x, y, 2 + rnd(i) * 3.5, `rgba(255,248,215,${a})`); } }
  function bench(g, x, back) { g.lineWidth = 7; g.strokeStyle = OL;
    if (back) { g.fillStyle = "#3a3f44"; [-170, 170].forEach((a) => { g.fillRect(x + a - 9, FL - 380, 18, 380); g.strokeRect(x + a - 9, FL - 380, 18, 380); });
      g.fillStyle = "#b07a4c"; [FL - 370, FL - 320, FL - 270].forEach((y) => { rr(g, x - 215, y, 430, 36, 8); g.fill(); g.stroke(); }); }
    else { g.fillStyle = "#c08a58"; rr(g, x - 225, FL - 182, 450, 34, 8); g.fill(); g.stroke(); g.fillStyle = "#3a3f44"; [-185, 185].forEach((a) => { g.beginPath(); g.moveTo(x + a - 12, FL - 150); g.lineTo(x + a + 12, FL - 150); g.lineTo(x + a + (a < 0 ? -30 : 30), FL); g.lineTo(x + a + (a < 0 ? -50 : 10), FL); g.closePath(); g.fill(); g.stroke(); }); } }
  function finger(q, h, up) { q.save(); q.translate(h[0], h[1]); q.lineWidth = 6; q.strokeStyle = OL; q.fillStyle = OMA.skin; rr(q, -9, -58 * up, 18, 58 * up, 9); q.fill(); q.stroke(); q.beginPath(); q.arc(0, 0, 22, 0, 7); q.fill(); q.stroke(); q.restore(); }
  function sweatDrop(g, x, y, s, u, ph) { const t = ((u + ph) * 1.4) % 1; g.save(); g.translate(x, y + t * 50 * s); g.scale(s, s); g.globalAlpha = 1 - t * 0.6; g.fillStyle = "#9fd8ff"; g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -20); g.quadraticCurveTo(14, 4, 0, 10); g.quadraticCurveTo(-14, 4, 0, -20); g.fill(); g.stroke(); g.restore(); }

  // ---------- Ladenfront (Tag oder Nacht) ----------
  function shopFront(g, u, ox, night, wallTop = -900) {
    g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = night ? "#8a7a74" : "#ecd2a4"; g.fillRect(ox - 140, wallTop, 1360, FL - 100 - wallTop);
    g.strokeStyle = night ? "rgba(40,30,50,0.25)" : "rgba(160,110,60,0.2)"; g.lineWidth = 3; for (let y = wallTop + 40; y < 480; y += 46) { g.beginPath(); g.moveTo(ox - 140, y); g.lineTo(ox + 1220, y); g.stroke(); for (let x = ox - 140 + ((y / 46) % 2) * 50; x < ox + 1220; x += 100) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 46); g.stroke(); } }
    g.strokeStyle = OL; g.lineWidth = 8;
    // Fenster im ersten Stock mit Fensterläden und Blumenkasten
    if (wallTop < 60) [ox + 190, ox + 690].forEach((wx, i) => { g.fillStyle = night ? "#22264a" : "#9fd3ff"; rr(g, wx, 90, 200, 260, 6); g.fill(); g.stroke(); if (!night) { g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.moveTo(wx + 30, 330); g.lineTo(wx + 110, 110); g.lineTo(wx + 150, 110); g.lineTo(wx + 70, 330); g.closePath(); g.fill(); }
      g.beginPath(); g.moveTo(wx + 100, 90); g.lineTo(wx + 100, 350); g.moveTo(wx, 210); g.lineTo(wx + 200, 210); g.stroke();
      g.fillStyle = night ? "#2f4a40" : "#3f7d62"; [-1, 1].forEach((sd) => { const sx = sd < 0 ? wx - 74 : wx + 204; rr(g, sx, 84, 70, 272, 6); g.fill(); g.stroke(); g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 4; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(sx + 10, 110 + k * 30); g.lineTo(sx + 60, 110 + k * 30); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8; });
      if (!night) { g.fillStyle = "#4f8a4a"; for (let k = 0; k < 7; k++) { circle(g, wx + 14 + k * 29, 352, 20, "#4f8a4a"); } for (let k = 0; k < 6; k++) circle(g, wx + 28 + k * 30, 340 + (k % 2) * 10, 11, k % 2 ? "#ff6b9a" : "#ffd34d"); }
      g.fillStyle = night ? "#5a3a2a" : "#8a5531"; rr(g, wx - 10, 360, 220, 40, 8); g.fill(); g.stroke(); void i; });
    // Gesims
    g.fillStyle = night ? "#6a5a58" : "#d8b98a"; g.fillRect(ox - 140, 450, 1360, 40); g.strokeRect(ox - 140, 450, 1360, 40);
    // Ladenrahmen
    g.fillStyle = night ? "#1f3a30" : "#2f5d4a"; g.fillRect(ox + 30, 490, 1020, FL - 100 - 490); g.strokeRect(ox + 30, 490, 1020, FL - 100 - 490);
    // Schaufenster
    const wl = ox + 80, wr = ox + 740, wt = 700, wb = 1180;
    g.save(); g.beginPath(); g.rect(wl, wt, wr - wl, wb - wt); g.clip();
    g.fillStyle = night ? "#141a2a" : "#fff3dc"; g.fillRect(wl, wt, wr - wl, wb - wt);
    if (!night) { const lg = g.createLinearGradient(0, wt, 0, wb); lg.addColorStop(0, "rgba(255,220,150,0.5)"); lg.addColorStop(1, "rgba(255,220,150,0)"); g.fillStyle = lg; g.fillRect(wl, wt, wr - wl, wb - wt); }
    // Regale mit Pullovern, Wolle, Hüten
    g.fillStyle = night ? "#2a2018" : "#8a5531"; [910, 1090].forEach((y) => { g.fillRect(wl, y, wr - wl, 16); g.strokeRect(wl, y, wr - wl, 16); });
    const cols = ["#3d6fb0", "#e5243b", "#f2b134", "#3d9a6b", "#8e5bd6", "#e0703a"];
    if (!night) { [wl + 90, wl + 250, wl + 420].forEach((x, i) => { for (let k = 0; k < 3; k++) folded(g, x, 910 - k * 34, cols[(i * 2 + k) % 6]); });
      sweater(g, wl + 580, 830, 0.85, "#3d9a6b", 0.05); [wl + 70, wl + 140, wl + 210].forEach((x, i) => yarn(g, x, 1062, 26, cols[(i + 3) % 6]));
      g.fillStyle = "#c98a3a"; g.beginPath(); g.ellipse(wl + 380, 1084, 90, 14, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(wl + 380, 1080, 50, Math.PI, 0); g.fill(); g.stroke(); g.fillStyle = "#e5243b"; g.fillRect(wl + 330, 1060, 100, 14);
      g.fillStyle = "#f4f0e8"; g.beginPath(); g.ellipse(wl + 560, 1050, 60, 40, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(wl + 618, 1040); g.quadraticCurveTo(wl + 660, 1020, wl + 662, 1000); g.stroke(); rr(g, wl + 540, 998, 40, 14, 6); g.fill(); g.stroke(); circle(g, wl + 560, 1050, 14, "#3d6fb0"); }
    else { [wl + 90, wl + 250, wl + 420].forEach((x) => { for (let k = 0; k < 3; k++) folded(g, x, 910 - k * 34, "#2a2f44"); }); }
    // Glasspiegelung
    g.fillStyle = night ? "rgba(160,180,255,0.10)" : "rgba(255,255,255,0.35)"; [[0, 120], [180, 50]].forEach(([a, w]) => { g.beginPath(); g.moveTo(wl + a + 120, wt); g.lineTo(wl + a + 120 + w, wt); g.lineTo(wl + a + w - 80, wb); g.lineTo(wl + a - 80, wb); g.closePath(); g.fill(); });
    g.restore(); g.lineWidth = 8; g.strokeStyle = OL; g.strokeRect(wl, wt, wr - wl, wb - wt);
    // Tür
    const dl = ox + 790, dr = ox + 1000; g.fillStyle = night ? "#173026" : "#285040"; g.fillRect(dl, 680, dr - dl, FL - 100 - 680); g.strokeRect(dl, 680, dr - dl, FL - 100 - 680);
    g.fillStyle = night ? "#141a2a" : "#fff3dc"; rr(g, dl + 30, 720, dr - dl - 60, 300, 6); g.fill(); g.stroke(); if (!night) { g.fillStyle = "rgba(255,255,255,0.4)"; g.beginPath(); g.moveTo(dl + 60, 1020); g.lineTo(dl + 120, 720); g.lineTo(dl + 150, 720); g.lineTo(dl + 90, 1020); g.closePath(); g.fill(); }
    circle(g, dl + 30, 1100, 12, "#e0b040"); g.stroke();
    // Türglocke oben
    g.save(); g.translate(dl + 105, 690); g.rotate(Math.sin(u * 9) * 0.25 * Math.exp(-u * 1.2) * (night ? 0 : 1)); g.fillStyle = "#e0b040"; g.lineWidth = 5; g.beginPath(); g.moveTo(-18, 30); g.quadraticCurveTo(-18, 0, 0, 0); g.quadraticCurveTo(18, 0, 18, 30); g.closePath(); g.fill(); g.stroke(); circle(g, 0, 34, 6, "#e0b040"); g.stroke(); g.restore(); g.lineWidth = 8;
    // Sockel
    g.fillStyle = night ? "#2a2830" : "#5a4a44"; g.fillRect(ox + 30, 1180, 760, 120); g.strokeRect(ox + 30, 1180, 760, 120);
    // Markise
    if (!night) { const at = 520, ab = 660, l = ox + 10, r = ox + 1070, n = 12, sw = (r - l) / n;
      for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? "#fbf3e4" : "#d8323f"; g.beginPath(); g.moveTo(l + i * sw, at); g.lineTo(l + (i + 1) * sw, at); g.lineTo(l + (i + 1) * sw + 6, ab); g.lineTo(l + i * sw + 6, ab); g.closePath(); g.fill(); }
      g.strokeRect(l, at, r - l + 6, ab - at); for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? "#fbf3e4" : "#d8323f"; g.beginPath(); g.moveTo(l + i * sw + 6, ab); g.lineTo(l + (i + 1) * sw + 6, ab); g.arc(l + (i + 0.5) * sw + 6, ab, sw / 2, 0, Math.PI); g.closePath(); g.fill(); g.stroke(); }
      // Schatten der Markise auf der Scheibe
      g.fillStyle = "rgba(60,30,10,0.16)"; g.fillRect(ox + 80, 700, 920, 60); }
    else { g.fillStyle = "#6a2a30"; rr(g, ox + 10, 500, 1060, 46, 22); g.fill(); g.stroke(); }
    // Gehweg
    g.fillStyle = night ? "#3a3a48" : "#c4bcb0"; g.fillRect(ox - 600, FL - 100, 2400, 1200); g.strokeRect(ox - 600, FL - 100, 2400, 1200);
    g.strokeStyle = night ? "rgba(0,0,0,0.25)" : "rgba(90,80,70,0.25)"; g.lineWidth = 3; for (let r = 0; r < 12; r++) { const y = FL - 100 + r * 70; g.beginPath(); g.moveTo(ox - 600, y); g.lineTo(ox + 1800, y); g.stroke(); for (let c = -6; c < 20; c++) { const x = ox + c * 140 + (r % 2) * 70; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 70); g.stroke(); } }
    g.strokeStyle = OL; g.lineWidth = 8;
  }

  // ---------- Strand ----------
  function beach(g, u) {
    const sk = g.createLinearGradient(0, -600, 0, 900); sk.addColorStop(0, "#2f8fd8"); sk.addColorStop(1, "#bfe8ff"); g.fillStyle = sk; g.fillRect(-800, -800, 2700, 1700);
    // Sonne
    g.save(); g.translate(900, 260); g.rotate(u * 0.3); g.fillStyle = "rgba(255,230,120,0.35)"; for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.beginPath(); g.moveTo(-26, 110); g.lineTo(26, 110); g.lineTo(0, 230); g.closePath(); g.fill(); } g.restore();
    circle(g, 900, 260, 95, "#ffd34d"); g.lineWidth = 7; g.strokeStyle = OL; g.stroke();
    // Wolken
    [[200, 300, 1], [640, 180, 0.8], [1180, 420, 0.9]].forEach(([x, y, s], i) => { const xx = x + Math.sin(u * 0.4 + i) * 20; g.fillStyle = "#ffffff"; g.lineWidth = 6; g.beginPath(); g.arc(xx - 60 * s, y, 44 * s, Math.PI * 0.5, Math.PI * 1.5); g.arc(xx, y - 30 * s, 60 * s, Math.PI, 0); g.arc(xx + 70 * s, y, 44 * s, Math.PI * 1.5, Math.PI * 0.5); g.closePath(); g.fill(); g.stroke(); });
    // Meer
    const se = g.createLinearGradient(0, 880, 0, 1160); se.addColorStop(0, "#1673b0"); se.addColorStop(1, "#38c0d0"); g.fillStyle = se; g.fillRect(-800, 880, 2700, 300); g.lineWidth = 6; g.beginPath(); g.moveTo(-800, 880); g.lineTo(1900, 880); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 5; for (let r = 0; r < 4; r++) for (let i = -6; i < 16; i++) { const x = i * 130 + ((u * 40 + r * 60) % 130), y = 920 + r * 60; g.beginPath(); g.arc(x, y, 22, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    // Segelboot
    const bx = 330 + u * 12; g.strokeStyle = OL; g.lineWidth = 5; g.fillStyle = "#fbf3e4"; g.beginPath(); g.moveTo(bx, 870); g.lineTo(bx, 760); g.lineTo(bx + 60, 860); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#e5243b"; g.beginPath(); g.moveTo(bx - 40, 872); g.lineTo(bx + 70, 872); g.lineTo(bx + 52, 892); g.lineTo(bx - 26, 892); g.closePath(); g.fill(); g.stroke();
    // Sand
    g.lineWidth = 8; g.fillStyle = "#f2d49a"; g.beginPath(); g.moveTo(-800, 1180); for (let i = 0; i <= 30; i++) g.lineTo(-800 + i * 90, 1160 + Math.sin(i * 1.3 + u * 1.5) * 10); g.lineTo(1900, 2600); g.lineTo(-800, 2600); g.closePath(); g.fill(); g.stroke();
    for (let i = 0; i < 70; i++) circle(g, -300 + rnd(i * 2.2) * 1700, 1220 + rnd(i * 4.4) * 700, 3 + rnd(i) * 3, "rgba(170,120,60,0.35)");
    // Palme links
    g.save(); g.translate(60, FL - 20); g.fillStyle = "#9a6a3a"; g.lineWidth = 7; g.beginPath(); g.moveTo(-34, 0); g.quadraticCurveTo(-10, -400, 70, -760); g.lineTo(110, -750); g.quadraticCurveTo(30, -400, 34, 0); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 4; for (let k = 1; k < 12; k++) { const t = k / 12; g.beginPath(); g.moveTo(lerp(-30, 72, t * t), -t * 740); g.lineTo(lerp(30, 108, t * t), -t * 740); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 7;
    g.translate(90, -760); for (let i = 0; i < 7; i++) { const a = -Math.PI + i * (Math.PI / 6) + Math.sin(u * 1.6 + i) * 0.05; g.save(); g.rotate(a); g.fillStyle = i % 2 ? "#3f9a4a" : "#4fae55"; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(180, -70, 330, 40); g.quadraticCurveTo(180, 10, 0, 0); g.fill(); g.stroke(); g.restore(); }
    circle(g, -10, 20, 24, "#7a4a2a"); g.stroke(); circle(g, 24, 26, 24, "#7a4a2a"); g.stroke(); g.restore();
    // Sandburg
    g.fillStyle = "#e3bf7a"; g.lineWidth = 6; rr(g, 900, 1420, 140, 80, 6); g.fill(); g.stroke(); rr(g, 940, 1360, 60, 70, 6); g.fill(); g.stroke(); g.strokeStyle = OL; g.beginPath(); g.moveTo(970, 1360); g.lineTo(970, 1310); g.stroke(); g.fillStyle = "#e5243b"; g.beginPath(); g.moveTo(970, 1310); g.lineTo(1006, 1322); g.lineTo(970, 1334); g.closePath(); g.fill(); g.stroke();
    g.lineWidth = 8;
  }
  function plane(g, x, y, s, u) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-0.06); g.lineWidth = 7; g.strokeStyle = OL; g.lineJoin = "round";
    g.fillStyle = "#3d6fb0"; g.beginPath(); g.moveTo(-150, -10); g.lineTo(-190, -90); g.lineTo(-150, -90); g.lineTo(-100, -14); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#fbfbff"; g.beginPath(); g.moveTo(-170, -10); g.quadraticCurveTo(-160, -40, -60, -40); g.lineTo(140, -40); g.quadraticCurveTo(210, -36, 220, 0); g.quadraticCurveTo(210, 34, 140, 34); g.lineTo(-60, 34); g.quadraticCurveTo(-160, 34, -170, -10); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#e5243b"; g.fillRect(-150, 8, 330, 12); g.fillStyle = "#9fd3ff"; for (let i = 0; i < 6; i++) { circle(g, -70 + i * 36, -12, 9, "#9fd3ff"); g.lineWidth = 4; g.stroke(); } g.lineWidth = 7;
    g.fillStyle = "#d8dce6"; g.beginPath(); g.moveTo(-10, 6); g.lineTo(60, 6); g.lineTo(-20, 110); g.lineTo(-60, 110); g.closePath(); g.fill(); g.stroke();
    g.restore(); void u; }
  function deckchair(g, x, front) { g.lineWidth = 7; g.strokeStyle = OL;
    if (!front) { g.strokeStyle = "#8a5a2a"; g.lineWidth = 16; g.beginPath(); g.moveTo(x + 120, FL); g.lineTo(x - 170, FL - 520); g.moveTo(x - 140, FL); g.lineTo(x + 40, FL - 230); g.stroke(); g.strokeStyle = OL; g.lineWidth = 7;
      g.save(); g.beginPath(); g.moveTo(x + 90, FL - 160); g.lineTo(x - 175, FL - 520); g.lineTo(x - 245, FL - 470); g.lineTo(x + 10, FL - 110); g.closePath(); g.clip(); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#fbf3e4" : "#2f8fd8"; g.save(); g.translate(x - 80, FL - 320); g.rotate(-0.94); g.fillRect(-400, -150 + i * 40, 800, 40); g.restore(); } g.restore();
      g.beginPath(); g.moveTo(x + 90, FL - 160); g.lineTo(x - 175, FL - 520); g.lineTo(x - 245, FL - 470); g.lineTo(x + 10, FL - 110); g.closePath(); g.stroke(); }
    else { g.strokeStyle = "#8a5a2a"; g.lineWidth = 16; g.beginPath(); g.moveTo(x - 170, FL - 230); g.lineTo(x + 130, FL - 230); g.stroke(); g.strokeStyle = OL; g.lineWidth = 7; } }
  function cocktail(q, h) { q.save(); q.translate(h[0], h[1] - 26); q.lineWidth = 5; q.strokeStyle = OL;
    q.fillStyle = "rgba(255,255,255,0.7)"; q.beginPath(); q.moveTo(-34, -70); q.lineTo(34, -70); q.lineTo(0, -10); q.closePath(); q.fill(); q.stroke(); q.fillStyle = "#ff7a3a"; q.beginPath(); q.moveTo(-26, -62); q.lineTo(26, -62); q.lineTo(0, -18); q.closePath(); q.fill();
    q.beginPath(); q.moveTo(0, -10); q.lineTo(0, 22); q.moveTo(-20, 24); q.lineTo(20, 24); q.stroke(); circle(q, 30, -70, 13, "#ffd34d"); q.stroke();
    q.strokeStyle = "#e5243b"; q.lineWidth = 4; q.beginPath(); q.moveTo(-8, -40); q.lineTo(-30, -120); q.stroke(); q.strokeStyle = OL; q.fillStyle = "#e5243b"; q.beginPath(); q.moveTo(-60, -110); q.quadraticCurveTo(-30, -150, 0, -110); q.closePath(); q.fill(); q.stroke(); q.restore(); }
  function gull(g, x, y, s, u, i) { const f = Math.sin(u * 8 + i) * 0.5; g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = OL; g.lineWidth = 6; g.beginPath(); g.moveTo(-40, -20 * f); g.quadraticCurveTo(-20, -30 - 20 * f, 0, 0); g.quadraticCurveTo(20, -30 - 20 * f, 40, -20 * f); g.stroke(); g.restore(); }

  // ---------- Laden innen ----------
  function interior(g, u, T) {
    g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#f1dfbd"; g.fillRect(-800, -800, 2800, 2200); g.fillStyle = "#e7d1a8"; for (let i = -10; i < 30; i++) g.fillRect(i * 80, -800, 36, 2200);
    // Schaufenster (von innen), draußen drängen sich die Kunden
    const wl = -40, wr = 470, wt = 520, wb = 1080;
    g.save(); g.beginPath(); g.rect(wl, wt, wr - wl, wb - wt); g.clip();
    const sk = g.createLinearGradient(0, wt, 0, wb); sk.addColorStop(0, "#9fd8ff"); sk.addColorStop(1, "#fff1cf"); g.fillStyle = sk; g.fillRect(wl, wt, wr - wl, wb - wt);
    g.fillStyle = "#d8a6a0"; g.fillRect(wl, wt + 260, wr - wl, 400); g.fillStyle = "#c4bcb0"; g.fillRect(wl, wb - 60, wr - wl, 80);
    const press = 1 + 0.03 * Math.sin(u * 12);
    [[30, C1, 0.4], [210, C3, -0.2], [380, C2, -0.5]].forEach(([x, o, lk], i) => SK.person(g, x, 1240 + Math.sin(u * 7 + i * 2) * 6, S * press, { ...o, mouth: i === 1 ? "shout" : "open", eyes: "wide", brow: 0.4, look: lk, aL: -0.7, eL: 1.0, aR: -0.7, eR: -1.0 }));
    g.fillStyle = "rgba(255,255,255,0.3)"; [[40, 110], [250, 40]].forEach(([a, w]) => { g.beginPath(); g.moveTo(wl + a + 160, wt); g.lineTo(wl + a + 160 + w, wt); g.lineTo(wl + a + w - 60, wb); g.lineTo(wl + a - 60, wb); g.closePath(); g.fill(); });
    g.restore();
    g.fillStyle = "#2f5d4a"; g.lineWidth = 22; g.strokeStyle = "#2f5d4a"; g.strokeRect(wl, wt, wr - wl, wb - wt); g.lineWidth = 8; g.strokeStyle = OL; g.strokeRect(wl - 11, wt - 11, wr - wl + 22, wb - wt + 22); g.strokeRect(wl + 11, wt + 11, wr - wl - 22, wb - wt - 22);
    g.beginPath(); g.moveTo((wl + wr) / 2, wt); g.lineTo((wl + wr) / 2, wb); g.stroke();
    // Regale rechts mit Pullovern und Wolle
    const cols = ["#3d6fb0", "#e5243b", "#f2b134", "#3d9a6b", "#8e5bd6", "#e0703a"];
    g.fillStyle = "#8a5531"; rr(g, 560, 440, 700, 860, 8); g.fill(); g.stroke(); g.fillStyle = "#6b3f22"; rr(g, 580, 460, 660, 820, 4); g.fill();
    [640, 840, 1040].forEach((y, r) => { g.fillStyle = "#a06a3a"; g.fillRect(580, y, 660, 20); g.strokeRect(580, y, 660, 20);
      for (let c = 0; c < 4; c++) { const x = 650 + c * 160; if (r === 1) { for (let k = 0; k < 3; k++) yarn(g, x - 40 + k * 40, y - 28 - (k === 1 ? 30 : 0), 28, cols[(c + k + r) % 6]); } else for (let k = 0; k < 4; k++) folded(g, x, y - k * 34, cols[(c * 2 + k + r) % 6]); } });
    // Ladentheke mit Klingel
    g.fillStyle = "#9a6a3a"; rr(g, 760, 1120, 520, 290, 10); g.fill(); g.stroke(); g.fillStyle = "#b07a4c"; rr(g, 740, 1100, 560, 40, 8); g.fill(); g.stroke(); g.fillStyle = "#86592f"; [790, 950, 1110].forEach((x) => { rr(g, x, 1170, 130, 200, 8); g.fill(); g.stroke(); });
    g.fillStyle = "#e0b040"; g.beginPath(); g.arc(1180, 1100, 26, Math.PI, 0); g.fill(); g.stroke(); circle(g, 1180, 1070, 7, "#e0b040"); g.stroke();
    // Boden
    g.fillStyle = "#b07a4c"; g.fillRect(-800, 1300, 2800, 1200); g.strokeRect(-800, 1300, 2800, 1200); g.strokeStyle = "rgba(60,30,15,0.35)"; g.lineWidth = 4; for (let r = 0; r < 10; r++) { const y = 1300 + r * 60; g.beginPath(); g.moveTo(-800, y); g.lineTo(2000, y); g.stroke(); for (let c = -6; c < 12; c++) { const x = c * 220 + (r % 2) * 110; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 60); g.stroke(); } } g.strokeStyle = OL; g.lineWidth = 8;
    // Omas leerer Schaukelstuhl mit Wollknäuel und Stricknadeln
    const rk = Math.sin(u * 2.2) * 0.06; g.save(); g.translate(260, FL); g.rotate(rk); g.lineWidth = 8;
    g.strokeStyle = "#6b3f22"; g.lineWidth = 14; g.beginPath(); g.moveTo(-160, -10); g.quadraticCurveTo(0, 30, 160, -10); g.stroke(); g.strokeStyle = OL; g.lineWidth = 7;
    g.fillStyle = "#8a5531"; [-110, 110].forEach((a) => { g.fillRect(a - 9, -200, 18, 190); g.strokeRect(a - 9, -200, 18, 190); }); g.fillRect(-130, -560, 18, 380); g.strokeRect(-130, -560, 18, 380); g.fillRect(-10 - 120 + 230, -380, 18, 200); g.strokeRect(100, -380, 18, 200);
    g.fillStyle = "#b4506e"; rr(g, -140, -230, 280, 40, 12); g.fill(); g.stroke(); g.fillStyle = "#8a5531"; rr(g, -150, -580, 60, 380, 10); g.fill(); g.stroke(); for (let k = 0; k < 4; k++) { g.fillRect(-130, -520 + k * 80, 14, 60); }
    g.fillStyle = "#c95a7a"; rr(g, -134, -540, 50, 300, 10); g.fill(); g.stroke();
    yarn(g, 30, -262, 34, "#b4506e", 0.3); g.strokeStyle = "#c9a14a"; g.lineWidth = 6; g.beginPath(); g.moveTo(-10, -320); g.lineTo(80, -240); g.moveTo(70, -330); g.lineTo(-10, -240); g.stroke();
    g.strokeStyle = "#b4506e"; g.lineWidth = 4; g.beginPath(); g.moveTo(40, -230); g.quadraticCurveTo(120, -100, 200, 0); g.stroke(); g.restore(); g.strokeStyle = OL; g.lineWidth = 8;
    void T;
  }

  // ---------- Nacht ----------
  function night(g, u, T) {
    const sk = g.createLinearGradient(0, -400, 0, 1300); sk.addColorStop(0, "#0b1030"); sk.addColorStop(1, "#2c2f66"); g.fillStyle = sk; g.fillRect(-800, -800, 2800, 2400);
    stars(g, u, 60);
    // Mond
    const mg = g.createRadialGradient(330, 380, 40, 330, 380, 260); mg.addColorStop(0, "rgba(255,244,200,0.35)"); mg.addColorStop(1, "rgba(255,244,200,0)"); g.fillStyle = mg; g.fillRect(30, 80, 600, 600);
    circle(g, 330, 380, 80, "#fff4cf"); g.lineWidth = 6; g.strokeStyle = OL; g.stroke(); circle(g, 360, 360, 70, "#1a2050"); circle(g, 302, 410, 10, "rgba(200,190,150,0.6)"); circle(g, 284, 356, 7, "rgba(200,190,150,0.6)");
    // Kirchturm mit Uhr
    const tx = 840; g.fillStyle = "#3a3a5a"; g.lineWidth = 7; g.beginPath(); g.moveTo(tx - 110, 1300); g.lineTo(tx - 110, 520); g.lineTo(tx, 300); g.lineTo(tx + 110, 520); g.lineTo(tx + 110, 1300); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#4a3a4a"; g.beginPath(); g.moveTo(tx - 130, 530); g.lineTo(tx, 250); g.lineTo(tx + 130, 530); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(tx, 250); g.lineTo(tx, 190); g.moveTo(tx - 22, 214); g.lineTo(tx + 22, 214); g.stroke();
    const CY = 560, hit = 1 - cl(Math.abs(u - T.zwei) / 0.5); const cg = g.createRadialGradient(tx, CY, 20, tx, CY, 150 + hit * 60); cg.addColorStop(0, `rgba(255,230,160,${0.3 + hit * 0.4})`); cg.addColorStop(1, "rgba(255,230,160,0)"); g.fillStyle = cg; g.fillRect(tx - 220, CY - 220, 440, 440);
    circle(g, tx, CY, 74, "#fff2c8"); g.stroke(); g.fillStyle = OL; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillRect(tx + Math.cos(a) * 60 - 4, CY + Math.sin(a) * 60 - 4, 8, 8); }
    const m = lerp(57, 60, seg(u, T.c4, T.zwei)), hr = 1 + m / 60; const am = m / 60 * Math.PI * 2 - Math.PI / 2, ah = hr / 12 * Math.PI * 2 - Math.PI / 2;
    g.lineCap = "round"; g.lineWidth = 9; g.beginPath(); g.moveTo(tx, CY); g.lineTo(tx + Math.cos(ah) * 36, CY + Math.sin(ah) * 36); g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(tx, CY); g.lineTo(tx + Math.cos(am) * 54, CY + Math.sin(am) * 54); g.stroke(); circle(g, tx, CY, 8, OL);
    g.fillStyle = "#2a2a44"; rr(g, tx - 40, 820, 80, 120, 40); g.fill(); g.stroke();
    // Dächer im Hintergrund
    g.fillStyle = "#1e2244"; g.beginPath(); g.moveTo(-800, 1000); [[-300, 1000], [-200, 900], [-100, 1000], [1100, 980], [1200, 880], [1320, 980], [1800, 980]].forEach(([a, b]) => g.lineTo(a, b)); g.lineTo(1800, 1300); g.lineTo(-800, 1300); g.closePath(); g.fill();
    // Haus der Kundin links
    g.fillStyle = "#6a5a7a"; g.lineWidth = 8; g.fillRect(-500, 620, 990, 900); g.strokeRect(-500, 620, 990, 900); g.fillStyle = "#4a3048"; g.beginPath(); g.moveTo(-540, 630); g.lineTo(0, 380); g.lineTo(530, 630); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 3; for (let y = 660; y < 1300; y += 46) { g.beginPath(); g.moveTo(-500, y); g.lineTo(490, y); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8;
    // Laden rechts (dunkel), Markise eingerollt
    g.save(); g.translate(490, 0); g.scale(0.62, 0.62); g.translate(0, FL / 0.62 - FL); shopFront(g, u, 40, true, 300); g.restore();
    // Fenster der Kundin (warm)
    const wl = 70, wr = 420, wt = 700, wb = 1000;
    g.save(); g.beginPath(); g.rect(wl, wt, wr - wl, wb - wt); g.clip();
    const ig = g.createRadialGradient(330, 760, 20, 250, 850, 380); ig.addColorStop(0, "#ffe2a0"); ig.addColorStop(1, "#d98a4a"); g.fillStyle = ig; g.fillRect(wl, wt, wr - wl, wb - wt);
    g.fillStyle = "rgba(160,80,60,0.25)"; for (let i = 0; i < 8; i++) g.fillRect(wl + i * 50, wt, 20, wb - wt);
    // Nachttischlampe hinten
    g.fillStyle = "#c95a3a"; g.beginPath(); g.moveTo(350, 780); g.lineTo(380, 730); g.lineTo(410, 780); g.closePath(); g.fill(); g.stroke(); g.fillRect(376, 780, 8, 60);
    const hap = seg(u, T.beantwortet + 0.1, T.beantwortet + 0.4);
    const kx = 220, kf = 1335;
    SK.person(g, kx, kf, S, { ...KUNDIN, mouth: hap > 0.5 ? "grin" : u > T.c4 + 0.3 ? "open" : "flat", eyes: hap > 0.5 ? "happy" : "dot", brow: hap > 0.5 ? 0 : -0.4, look: 0.7, aL: 1.3, aR: 1.3, bob: Math.sin(u * 2) * 3 });
    // Punkte auf dem Schlafanzug
    for (let i = 0; i < 10; i++) circle(g, kx + (rnd(i * 2.3) - 0.5) * 170, kf - 330 * S + (rnd(i * 4.1) - 0.5) * 120 - 30, 7, "rgba(255,255,255,0.85)");
    // Schlafmütze
    const hy = kf - 545 * S; g.save(); g.translate(kx, hy); g.fillStyle = "#3d6fb0"; g.lineWidth = 6; g.beginPath(); g.moveTo(-66, -26); g.quadraticCurveTo(-20, -150, 70, -120); g.quadraticCurveTo(110, -100, 120, -30); g.lineTo(96, -40); g.quadraticCurveTo(60, -70, 62, -26); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#fbf3e4"; rr(g, -72, -40, 140, 26, 12); g.fill(); g.stroke(); circle(g, 116, -24, 18, "#fbf3e4"); g.stroke(); g.restore();
    g.restore();
    g.lineWidth = 8; g.strokeStyle = OL; g.strokeRect(wl, wt, wr - wl, wb - wt);
    g.fillStyle = "#c0a090"; rr(g, wl - 30, wb - 6, wr - wl + 60, 34, 8); g.fill(); g.stroke();
    // Unterarme auf der Fensterbank
    g.fillStyle = KUNDIN.shirt; rr(g, kx - 120, wb - 28, 110, 40, 18); g.fill(); g.stroke(); rr(g, kx + 10, wb - 28, 110, 40, 18); g.fill(); g.stroke(); circle(g, kx - 10, wb - 8, 18, KUNDIN.skin); g.stroke(); circle(g, kx + 10, wb - 8, 18, KUNDIN.skin); g.stroke();
    g.fillStyle = "#7a3a5a"; [-1, 1].forEach((sd) => { const x = sd < 0 ? wl - 40 : wr + 4; rr(g, x, wt - 20, 36, wb - wt + 10, 8); g.fill(); g.stroke(); });
    // Lichtschein aus dem Fenster
    const lg = g.createRadialGradient(240, 860, 40, 240, 900, 520); lg.addColorStop(0, "rgba(255,200,120,0.22)"); lg.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = lg; g.fillRect(-300, 400, 1100, 1000);
    // Gehweg vorne
    g.fillStyle = "#2a2a3c"; g.fillRect(-800, FL - 60, 2800, 1200); g.strokeRect(-800, FL - 60, 2800, 1200);
  }
  // freundliche Antwort-Sprechblase aus dem Nichts (Weltkoordinaten), leuchtet sanft
  function answer(g, u, k) { if (k <= 0) return; const [x, y] = ANS; const gl = g.createRadialGradient(x, y, 40, x, y, 360); gl.addColorStop(0, `rgba(255,236,170,${0.45 * k})`); gl.addColorStop(1, "rgba(255,236,170,0)"); g.fillStyle = gl; g.fillRect(x - 380, y - 380, 760, 760);
    if (k >= 1) sparkles(g, x, y - 40, u, 7, 330, "#fff2c0", 11); SK.bubble(g, ["Ja, ab *9* Uhr.", "Schlafen Sie *gut*!"], x, y + Math.sin(u * 2.2) * 6, x, y, k, { px: 40, fill: "#fffaf0" }); }

  TYPES.h_oma = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 0.8, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.wann = f(/^wann/, 1.0, 3.4); T.gibt = f(/^gibt/, T.wann, T.wann + 1.0); T.blau = f(/^blau/, T.gibt, T.gibt + 0.8); T.liefern = f(/^liefern/, T.blau, T.blau + 0.6);
      T.alles = f(/^alles/, T.liefern, T.liefern + 1.3); T.dann = f(/^dann/, T.alles, T.alles + 0.6); T.mallorca = f(/^mallorca/, T.dann, T.dann + 1.0);
      T.enkel = f(/^enkel/, T.mallorca, T.mallorca + 1.0); T.der = f(/^der$/, T.mallorca, T.enkel - 0.2); T.panik = f(/^panik/, T.enkel, T.enkel + 0.7);
      T.doch = f(/^doch/, T.panik, T.panik + 0.9); T.fragen = f(/^fragen/, T.doch, T.doch + 0.4); T.beantwortet = f(/^beantwortet/, T.fragen, T.fragen + 0.8);
      T.nachts = f(/^nachts/, T.beantwortet, T.beantwortet + 1.0); T.zwei = f(/^zwei/, T.nachts, T.nachts + 0.5); T.denn = f(/^denn/, T.zwei, T.zwei + 0.9);
      T.c2 = T.dann - 0.1; T.c3 = T.der - 0.08; T.c4 = T.doch - 0.1;
      o.T.coverT = Math.max(0.6, T.mallorca + 0.6); p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const ph = u < T.c2 ? 1 : u < T.c3 ? 2 : u < T.c4 ? 3 : 4;
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      g.fillStyle = "#1d120c"; g.fillRect(0, 0, W, H);
      if (ph === 1) { // Bank vor dem Laden, drei Fragen
        const c = SK.cam([K(0, 1.1, 560, 1440), K(T.wann, 1.14, 550, 1445), K(T.alles - 0.25, 1.17, 530, 1450), K(T.alles + 0.2, 1.36, 450, 1510), K(T.c2, 1.4, 445, 1515)], u);
        const sh = (1 - cl(Math.abs(u - T.alles - 0.05) / 0.25)) * 12;
        g.save(); SK.apply(g, c, Math.sin(u * 60) * sh, Math.cos(u * 47) * sh);
        shopFront(g, u, 0, false);
        flowers(g, 1090, FL - 96, u);
        bench(g, OX, true);
        // Oma: Finger hoch bei jeder Antwort, bei „alles“ beide Hände
        const ansK = Math.max(win(T.gibt - 0.1, T.blau + 0.2), win(T.blau + 0.25, T.liefern + 0.35), win(T.liefern + 0.4, T.alles - 0.05));
        const big = seg(u, T.alles - 0.1, T.alles + 0.1), up = Math.max(cl(ansK), big, u < 0.6 ? 1 : 0);
        SK.person(g, OX, FL, S, { ...OMA, sit: true, mouth: big > 0.5 ? "grin" : ansK > 0.3 ? "open" : "smile", eyes: big > 0.5 ? "wink" : "dot", look: u < T.blau ? -0.5 : 0.6,
          aR: lerp(1.25, 0.25, up), eR: lerp(0, -1.85, up), aL: big > 0 ? lerp(1.25, 0.25, big) : 1.25, eL: big > 0 ? lerp(0, 1.85, big) : 0, bob: Math.sin(u * 3) * 2,
          hold: (q, hR, hL) => { if (up > 0.3) finger(q, hR, cl((up - 0.3) / 0.5)); if (big > 0.3) finger(q, hL, cl((big - 0.3) / 0.5)); } });
        // Strickjacke: Knöpfe und Kragen
        const ty = FL + (-330 + 140) * S; [-60, -20, 20].forEach((dy) => { circle(g, OX, ty + dy * S, 7, "#f4e6c8"); g.lineWidth = 3; g.stroke(); }); g.lineWidth = 8;
        yarn(g, OX + 170, FL - 210, 32, "#3d6fb0", Math.sin(u) * 0.2); g.strokeStyle = "#c9a14a"; g.lineWidth = 5; g.beginPath(); g.moveTo(OX + 140, FL - 260); g.lineTo(OX + 220, FL - 200); g.stroke(); g.strokeStyle = OL;
        bench(g, OX, false);
        // Kunden
        const happy = u > T.alles - 0.1;
        SK.person(g, X1, FL, S, { ...C1, mouth: happy ? "grin" : "open", eyes: happy ? "happy" : "dot", look: 0.8, aR: happy ? 1.2 : -0.2, eR: happy ? 0 : -0.9, aL: 1.3, bob: Math.sin(u * 4) * 3,
          hold: (q, hR, hL) => { q.save(); q.translate(hL[0], hL[1]); q.lineWidth = 6; q.strokeStyle = OL; q.fillStyle = "#e9c46a"; rr(q, -50, 10, 100, 110, 8); q.fill(); q.stroke(); q.beginPath(); q.arc(0, 14, 30, Math.PI, 0); q.stroke(); q.restore(); } });
        SK.person(g, X2, FL, S, { ...C2, mouth: happy ? "grin" : "open", eyes: happy ? "happy" : "dot", look: -0.8, aL: happy ? 1.25 : -0.3, eL: happy ? 0 : 0.9, bob: Math.sin(u * 4 + 1) * 3 });
        SK.person(g, X3, FL, S, { ...C3, mouth: happy ? "grin" : "open", eyes: happy ? "happy" : "dot", look: -0.8, aL: 0.6, eL: -1.4, bob: Math.sin(u * 4 + 2) * 3,
          hold: (q, hR, hL) => { sweater(q, hL[0] + 10, hL[1] + 20, 0.9, "#e5243b", -0.1); } });
        g.restore();
        // Sprechblasen ab Bild 0
        const qk = 1 - seg(u, T.alles - 0.2, T.alles);
        const pulse = (t) => 1 + 0.12 * Math.sin(cl((u - t) / 0.3) * Math.PI);
        const [h1x, h1y] = SK.toScreen(c, X1 + 20, FL - 620 * S), [h3x, h3y] = SK.toScreen(c, X3 - 20, FL - 620 * S), [h2x, h2y] = SK.toScreen(c, X2, FL - 620 * S);
        const qb = (lines, x, y, tx, ty, t0, tp) => { const k = outBack(cl((u - t0) / 0.22), 2) * qk; if (k <= 0) return; g.save(); const s = pulse(tp); g.translate(x, y); g.scale(s, s); g.translate(-x, -y); SK.bubble(g, lines, x, y, tx, ty, k, { px: 46 }); g.restore(); };
        qb(["Wann haben", "Sie *offen*?"], 245, 600, h1x, h1y, -0.14, T.wann);
        qb(["Gibt es das", "in *Blau*?"], 835, 590, h3x, h3y, -0.02, T.gibt);
        qb(["*Liefern*", "Sie auch?"], 690, 770, h2x, h2y, 0.1, T.liefern);
        const [ox, oy] = SK.toScreen(c, OX, FL - 500 * S);
        SK.bubble(g, ["Ab *9* Uhr!"], 310, 860, ox, oy, win(T.gibt - 0.1, T.blau + 0.2), { px: 46, fill: "#fff6d8" });
        SK.bubble(g, ["Hinten *links*!"], 310, 860, ox, oy, win(T.blau + 0.25, T.liefern + 0.35), { px: 46, fill: "#fff6d8" });
        SK.bubble(g, ["Ja, *gern*!"], 310, 860, ox, oy, win(T.liefern + 0.4, T.alles - 0.05), { px: 46, fill: "#fff6d8" });
        if (u > T.alles - 0.1) sparkles(g, ox, oy - 40, u, 9, 260, "#ffd34d", 5);
        SK.pow(g, "OMA WEISS ALLES!", 540, 640, (u - T.alles + 0.05) / 1.3, { px: 84, rot: -0.08 });
        SK.flashAt(g, u, [T.alles], 0.08, 0.35);
      } else if (ph === 2) { // Mallorca
        const c = SK.cam([K(T.c2, 1.25, 520, 960 + (FL - 470) * 1.25), K(T.mallorca - 0.15, 1.2, 540, 960 + (FL - 560) * 1.2), K(T.mallorca + 0.25, 1.12, 560, 1450), K(T.c3, 1.16, 560, 1455)], u);
        g.save(); SK.apply(g, c);
        beach(g, u);
        const pk = seg(u, T.c2 - 0.1, T.c3 + 0.4); const pxw = lerp(-350, 1500, pk), pyw = 470 - pk * 120;
        g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(Math.max(-500, pxw - 900), pyw + 60 + 70); g.lineTo(pxw - 150, pyw + 18); g.stroke(); g.lineCap = "butt";
        plane(g, pxw, pyw, 1.2, u);
        [[260, 640], [380, 600], [700, 720]].forEach(([x, y], i) => gull(g, x + Math.sin(u + i) * 30, y + Math.cos(u * 1.3 + i) * 10, 0.9, u, i));
        SK.umbrella(g, 840, 1150, 1.3, "#e5243b", 0.12);
        deckchair(g, 600, false);
        g.save(); g.translate(600, FL - 30); g.rotate(-0.42);
        SK.person(g, 0, 0, S, { ...OMA, sit: true, shirt: "#ff8fb0", skirt: "#ffd34d", mouth: "grin", eyes: "closed", aL: 0.6, eL: 2.17, aR: -0.6, eR: -2.2, bob: Math.sin(u * 2) * 2, hold: (q, hR, hL) => cocktail(q, hL) });
        const hy = (-545 + 140) * S; g.lineWidth = 6; g.strokeStyle = OL;
        g.fillStyle = "#1b1530"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(sd * 22 * S, hy - 8 * S, 19 * S, 14 * S, 0, 0, 7); g.fill(); }); g.beginPath(); g.moveTo(-6 * S, hy - 10 * S); g.lineTo(6 * S, hy - 10 * S); g.stroke();
        g.fillStyle = "#f2d07a"; g.beginPath(); g.ellipse(0, hy - 40 * S, 140 * S, 30 * S, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(0, hy - 46 * S, 66 * S, Math.PI, 0); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#e5243b"; g.fillRect(-64 * S, hy - 64 * S, 128 * S, 16 * S);
        circle(g, 52 * S, hy - 76 * S, 15 * S, "#ff6b9a"); g.stroke();
        g.restore();
        deckchair(g, 600, true);
        g.restore();
        const [ox, oy] = SK.toScreen(c, 510, FL - 520 * S);
        SK.bubble(g, ["*Herrlich*!"], 300, 760, ox, oy, win(T.mallorca + 0.35, T.c3 + 0.05), { px: 52 });
        SK.flashAt(g, u, [T.c2], 0.09, 0.55);
      } else if (ph === 3) { // Panik im leeren Laden
        const c = SK.cam([{ t: T.c3, z: 1.0, x: 540, y: 900 }, { t: T.panik - 0.1, z: 1.0, x: 540, y: 900 }, { t: T.panik + 0.3, z: 1.06, x: 550, y: 900 }, { t: T.c4, z: 1.08, x: 550, y: 900 }], u);
        const sh = (1 - cl(Math.abs(u - T.panik - 0.05) / 0.35)) * 16;
        g.save(); SK.apply(g, c, Math.sin(u * 60) * sh, Math.cos(u * 47) * sh);
        interior(g, u, T);
        const pk = seg(u, T.c3, T.panik), tear = Math.sin(u * 16) * 0.25 * pk;
        SK.person(g, 600, FL, SE, { ...ENKEL, red: pk * 0.6, t: u, mouth: pk > 0.5 ? "shout" : "o", eyes: "wide", brow: -0.7, look: -0.6, aL: lerp(1.25, -1.0, pk), eL: lerp(0, 1.73 + tear, pk), aR: lerp(1.25, -1.0, pk), eR: lerp(0, -1.73 - tear, pk), bob: -Math.abs(Math.sin(u * 9)) * 6 * pk });
        if (pk > 0.6) { sweatDrop(g, 600 - 95, FL - 545 * SE - 40, 1.1, u, 0); sweatDrop(g, 600 + 100, FL - 545 * SE - 30, 1.1, u, 0.5); }
        // rausgerissene Haare fliegen
        for (let i = 0; i < 6; i++) { const t = ((u - T.panik) * 1.2 + i / 6) % 1; if (u < T.panik) break; const sd = i % 2 ? 1 : -1; const x = 600 + sd * (60 + t * 160), y = FL - 600 * SE - t * 120 + t * t * 260; g.strokeStyle = ENKEL.hair; g.lineWidth = 5; g.globalAlpha = 1 - t; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 10, y - 16, x + 4, y - 30); g.stroke(); g.globalAlpha = 1; }
        g.strokeStyle = OL; g.restore();
        // Fragen stapeln sich
        const Q = [["*Offen*?", 170, 200], ["Gibt es das in *Rot*?", 610, 205], ["Größe *42*?", 250, 345], ["Wann *schließen* Sie?", 750, 350], ["Wo ist *Oma*?!", 520, 495], ["*Hallo*?!", 175, 500], ["*Liefern* Sie?", 875, 500]];
        const span = Math.max(1.2, T.c4 - T.c3 - 0.4);
        Q.forEach(([s, x, y], i) => { const t0 = T.c3 + 0.12 + i * span / Q.length; const fx = [30, 210, 380][i % 3]; const [tx, ty] = SK.toScreen(c, fx, 1240 - 600 * S); SK.bubble(g, [s], x + Math.sin(u * 3 + i) * 4, y, tx, ty, outBack(cl((u - t0) / 0.2), 2), { px: 44, shout: i === 4 || i === 5 }); });
        const [ex, ey] = SK.toScreen(c, 650, FL - 610 * SE);
        SK.bubble(g, ["*OMA*!!"], 870, 860, ex, ey, win(T.panik - 0.05, T.c4 + 0.1), { px: 62, shout: true, fill: "#fff1a8" });
        SK.flashAt(g, u, [T.c3], 0.09, 0.55);
      } else { // Nacht: Antwort aus dem Nichts
        const dive = inExpo(cl((u - T.denn - 0.08) / Math.max(0.3, d - T.denn - 0.08)));
        const c = SK.cam([{ t: T.c4, z: 1.18, x: 500, y: 790 }, { t: T.beantwortet, z: 1.24, x: 505, y: 800 }, { t: T.zwei - 0.2, z: 1.26, x: 505, y: 800 }, { t: T.zwei + 0.2, z: 1.28, x: 505, y: 795 }, { t: T.denn, z: 1.3, x: 510, y: 800 }], u);
        if (dive > 0) { const k = inOut(cl((u - T.denn) / 0.35)); c.x = lerp(c.x, ANS[0], k); c.y = lerp(c.y, ANS[1], k); c.z *= 1 + dive * 30; }
        g.save(); SK.apply(g, c);
        night(g, u, T);
        answer(g, u, outBack(seg(u, T.beantwortet - 0.15, T.beantwortet + 0.15), 2));
        g.restore();
        // Funkeln am Himmel, wenn die Uhr schlägt
        const [cx, cy] = SK.toScreen(c, 840, 560);
        const hit = seg(u, T.zwei, T.zwei + 0.9); if (hit > 0 && hit < 1) { g.save(); g.globalAlpha = (1 - hit) * (1 - dive * 4 > 0 ? 1 - dive * 4 : 0); ring(g, cx, cy, 80 + hit * 260, 6 * (1 - hit) + 2, "rgba(255,236,170,0.8)"); g.restore(); }
        const [kx, ky] = SK.toScreen(c, 230, 1335 - 640 * S);
        const fade = 1 - cl(dive * 4);
        SK.bubble(g, ["Haben Sie", "morgen *offen*?"], 300, 650, kx, ky, win(T.c4 + 0.15, T.denn + 0.2) * fade, { px: 44 });
        SK.speedLines(g, 540, 960, seg(u, T.denn - 0.05, T.denn + 0.2) * (1 - dive * 2), "rgba(255,236,170,");
        SK.flashAt(g, u, [T.c4], 0.1, 0.5);
      }
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T;
      const E = [[0.0, "closed_bell", 0.55, 0.3], [0.0, "pop", 0.6, -0.4], [0.0, "whoosh_up", 0.35, 0], [0.02, "pop", 0.55, 0.4], [0.12, "pop", 0.55, 0.15], [0.3, "shimmer_hi", 0.22, 0]];
      E.push([T.wann, "tick_hi", 0.25, -0.4], [T.gibt - 0.1, "pop", 0.4, -0.1], [T.gibt, "tick_hi", 0.25, 0.4], [T.blau + 0.25, "pop", 0.4, -0.1], [T.liefern, "tick_hi", 0.25, 0.2], [T.liefern + 0.4, "pop", 0.4, -0.1]);
      E.push([T.alles - 0.08, "whoosh_up", 0.4, 0], [T.alles, "slap", 0.5, 0], [T.alles + 0.02, "boom", 0.25, 0], [T.alles + 0.05, "shimmer", 0.4, 0], [T.alles + 0.1, "chime_up2", 0.25, 0]);
      E.push([T.c2, "whoosh_side", 0.55, 0.3], [T.c2 + 0.05, "rk_pass", 0.3, 0], [T.mallorca, "shimmer_hi", 0.3, 0.2], [T.mallorca + 0.35, "pop", 0.4, -0.3]);
      E.push([T.c3, "whoosh_down", 0.5, 0], [T.c3 + 0.05, "closed_rattle", 0.35, -0.5]);
      const span = Math.max(1.2, T.c4 - T.c3 - 0.4); for (let i = 0; i < 7; i++) E.push([T.c3 + 0.12 + i * span / 7, "pop", 0.38, ((i % 3) - 1) * 0.5]);
      E.push([T.panik - 0.05, "slap", 0.45, 0], [T.panik, "vsad", 0.3, 0], [T.panik + 0.05, "thump", 0.4, 0]);
      E.push([T.c4 - 0.1, "tr_slow", 0.4, 0], [T.c4 + 0.15, "pop", 0.4, -0.3], [T.beantwortet - 0.15, "shimmer", 0.45, 0.2], [T.beantwortet, "chime", 0.3, 0.2]);
      E.push([T.zwei, "chime", 0.35, 0.5], [T.zwei, "boom", 0.25, 0.5], [T.zwei + 0.9, "chime", 0.2, 0.5]);
      E.push([T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Strickmuster, Wollknäuel, Filmtitel ----------
  TYPES.oma_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^kichatbot/, E.sys, 1.4); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      g.fillStyle = "#5a1a28"; g.fillRect(0, 0, W, H);
      // Strickmuster: Reihen aus Maschen (V), leicht wandernd
      const off = (u * 10) % 56;
      for (let r = -1; r < 36; r++) for (let c = 0; c < 15; c++) { const x = c * 76 + 8, y = r * 56 + off; const band = Math.floor((r + 40) / 6) % 3; const col = band === 0 ? "#6e2232" : band === 1 ? "#7a2838" : "#652030";
        g.fillStyle = col; g.strokeStyle = "rgba(30,6,12,0.45)"; g.lineWidth = 3; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(x + sd * 17, y, 15, 30, sd * -0.5, 0, 7); g.fill(); g.stroke(); });
        if (band === 1 && (r + c) % 4 === 0) { g.fillStyle = "rgba(240,210,160,0.18)"; [-1, 1].forEach((sd) => { g.beginPath(); g.ellipse(x + sd * 17, y, 15, 30, sd * -0.5, 0, 7); g.fill(); }); } }
      // Wollknäuel mit Stricknadeln oben, Faden läuft herab
      const bk = out3(seg(u, 0.1, 0.9));
      if (bk > 0) { g.save(); g.translate(540, 400 - (1 - bk) * 120); g.globalAlpha = bk; g.rotate(Math.sin(u * 1.2) * 0.03);
        g.strokeStyle = "#e8c070"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(-200, -120); g.lineTo(180, 110); g.moveTo(200, -120); g.lineTo(-180, 110); g.stroke(); [[-200, -120], [200, -120]].forEach(([a, b]) => circle(g, a, b, 14, "#f1d18a"));
        const yg = g.createRadialGradient(-30, -30, 10, 0, 0, 120); yg.addColorStop(0, "#f2e4c8"); yg.addColorStop(1, "#c9b08a"); g.fillStyle = yg; g.beginPath(); g.arc(0, 0, 110, 0, 7); g.fill();
        g.strokeStyle = "rgba(120,90,50,0.45)"; g.lineWidth = 4; for (let i = 0; i < 7; i++) { g.beginPath(); g.ellipse(0, 0, 106, 30 + i * 12, 0.5 + i * 0.35, 0, 7); g.stroke(); }
        g.strokeStyle = "#e8d7b4"; g.lineWidth = 5; g.beginPath(); g.moveTo(80, 70); g.bezierCurveTo(260, 200, -200, 330, 40, 470 * bk); g.stroke(); g.lineCap = "butt"; g.restore(); if (bk >= 1) sparkles(g, 540, 400, u, 5, 200, "#fff2c0", 9); }
      const lg = g.createRadialGradient(540, 900, 60, 540, 960, 1150); lg.addColorStop(0, "rgba(255,200,140,0.10)"); lg.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = lg; g.fillRect(0, 0, W, H);
      const pk = seg(u, 0, 0.6); const dg = g.createLinearGradient(0, 600, 0, 1660); dg.addColorStop(0, "rgba(36,6,14,0)"); dg.addColorStop(0.2, `rgba(36,6,14,${0.62 * pk})`); dg.addColorStop(0.8, `rgba(36,6,14,${0.62 * pk})`); dg.addColorStop(1, "rgba(36,6,14,0)"); g.fillStyle = dg; g.fillRect(0, 600, W, 1060);
      SK.endTitle(g, u, d, T, { c: "#fbeee0", glow: "rgba(241,209,138,0.45)", accent: "#e8c070", sub: "rgba(255,232,205,0.9)", key: "#f1d18a", offer: "IHR KI-CHATBOT", line: "und ich zeige Ihnen, wie er bei Ihnen antwortet.", y: 880 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.1, "shimmer", 0.35, 0], [0.9, "chime", 0.25, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
