// VOICE_DELAY: 0.35
// h_panzerpizza: Neugier-Geschichte (Look "story", Anti-Werbung). Jeden Freitag rollt ein Comic-Panzer vor die Pizzeria Bella,
// der Kommandant brüllt mit Megafon durchs Fenster „VIERZIG PIZZEN!“, die Scheiben wackeln. Der Koch trägt Ohrenschützer (Fragezeichen),
// es kommen vierzig Salatschüsseln, gestapelt auf dem Panzer. Rückblende-Schnitt: Diesen Freitag schläft der Panzer in der Halle
// (Schlafmütze, Zzz), Soldaten warten am langen Tisch. Ein Lieferbote bringt einen Turm Pizzakartons, Jubel. Bei „Denn“ taucht die
// Kamera in den obersten, offenen Karton, Weiß. Danach panzerpizza_end (Karton öffnet sich, Filmtitel, BESTELLEN OHNE PROVISION).
// Kein Handy, keine Technik, keine Gewalt. Wörter: rollt, bella, brüllt, vierzig, sofort, koch, hälfte, salate, diesen, kaserne, trotzdem, pizzen, denn.
(() => {
  const OL = SK.OL;
  const GROUND = 1300, TX = 120, TS = 0.9; // Gehweg-Kante, Halteposition und Maßstab des Panzers (Straße)
  const OLIVE = "#7f9150", OLIVE_D = "#5f6f3a", OLIVE_L = "#9fb06a";
  const SOLD = { hs: "bald", shirt: "#5e7a3a", pants: "#44562a", shoes: "#2a2a24", skin: "#f1c7a1" };
  const COOK = { hs: "bald", shirt: "#ffffff", pants: "#3a3f48", shoes: "#1e1e24", skin: "#e8b48f", apron: "#f4efe4" };
  const BOY = { hs: "cap", hair: "#c0392b", shirt: "#e0703a", pants: "#2f3a55", shoes: "#1e1e24", skin: "#d9a07a" };

  // ---------- Panzer (Comic, rund, freundlich). Mitte unten bei (x, y), Rohr nach rechts ----------
  function tank(g, x, y, s, o = {}) {
    g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round"; g.lineCap = "round";
    const roll = o.roll || 0;
    // Kette
    g.fillStyle = "#3b3a38"; rr(g, -300, -78, 600, 78, 39); g.fill(); g.stroke();
    g.strokeStyle = "#5a5853"; g.lineWidth = 5; for (let i = 0; i < 24; i++) { const px = -290 + (((i * 26 - roll * 0.9) % 624) + 624) % 624; if (px > 290) continue; g.beginPath(); g.moveTo(px, -76); g.lineTo(px, -66); g.stroke(); }
    g.strokeStyle = OL; g.lineWidth = 7;
    for (let i = 0; i < 7; i++) { const wx = -255 + i * 85; g.fillStyle = "#8a8a86"; g.beginPath(); g.arc(wx, -39, 27, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#5a5853"; g.beginPath(); g.arc(wx, -39, 9, 0, 7); g.fill();
      const a = roll / 27; g.strokeStyle = "#4a4844"; g.lineWidth = 5; g.beginPath(); g.moveTo(wx + Math.cos(a) * 12, -39 + Math.sin(a) * 12); g.lineTo(wx + Math.cos(a) * 22, -39 + Math.sin(a) * 22); g.moveTo(wx - Math.cos(a) * 12, -39 - Math.sin(a) * 12); g.lineTo(wx - Math.cos(a) * 22, -39 - Math.sin(a) * 22); g.stroke(); g.strokeStyle = OL; g.lineWidth = 7; }
    // Wanne
    g.fillStyle = OLIVE; g.beginPath(); g.moveTo(-325, -78); g.lineTo(-290, -178); g.lineTo(292, -178); g.lineTo(338, -78); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = OLIVE_D; g.fillRect(-310, -108, 632, 14); g.fillStyle = OLIVE_L; g.fillRect(-282, -172, 566, 10);
    // Kotflügel-Kisten, Werkzeug
    g.fillStyle = "#6e5a3a"; rr(g, -270, -214, 110, 40, 6); g.fill(); g.stroke(); g.fillStyle = "#8a7048"; rr(g, -258, -206, 86, 10, 3); g.fill();
    g.strokeStyle = "#6e5a3a"; g.lineWidth = 9; g.beginPath(); g.moveTo(190, -190); g.lineTo(272, -190); g.stroke(); g.strokeStyle = OL; g.lineWidth = 7;
    for (const nx of [-200, -60, 80, 220]) { g.fillStyle = OLIVE_D; g.beginPath(); g.arc(nx, -140, 6, 0, 7); g.fill(); }
    // Turm
    g.fillStyle = OLIVE; g.beginPath(); g.moveTo(-160, -178); g.quadraticCurveTo(-150, -272, -40, -278); g.lineTo(96, -278); g.quadraticCurveTo(178, -270, 184, -178); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = OLIVE_L; g.beginPath(); g.moveTo(-120, -250); g.quadraticCurveTo(-90, -266, -30, -268); g.lineTo(60, -268); g.lineTo(50, -256); g.lineTo(-30, -256); g.closePath(); g.fill();
    // Rohr (wippt leicht beim Bremsen)
    g.save(); g.translate(176, -232); g.rotate(o.gun || 0); g.fillStyle = OLIVE; rr(g, 0, -16, 270, 32, 12); g.fill(); g.stroke(); g.fillStyle = OLIVE_D; rr(g, 250, -22, 34, 44, 8); g.fill(); g.stroke(); g.restore();
    // Antenne mit Wimpel
    g.strokeStyle = "#2b2b28"; g.lineWidth = 5; const sw = Math.sin((o.t || 0) * 6) * 0.08 + (o.lean || 0); g.save(); g.translate(-120, -268); g.rotate(sw); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -170); g.stroke();
    g.fillStyle = "#e5243b"; g.strokeStyle = OL; g.lineWidth = 5; g.beginPath(); g.moveTo(0, -170); g.lineTo(-62 + Math.sin((o.t || 0) * 11) * 6, -150); g.lineTo(0, -128); g.closePath(); g.fill(); g.stroke(); g.restore();
    g.strokeStyle = OL; g.lineWidth = 7;
    // Luke (Deckel offen, wenn jemand herausschaut)
    g.fillStyle = OLIVE_D; rr(g, -18, -296, 96, 22, 8); g.fill(); g.stroke();
    if (o.lid) { g.save(); g.translate(-18, -294); g.rotate(-1.9 * o.lid); g.fillStyle = OLIVE; rr(g, -96, -12, 96, 18, 8); g.fill(); g.stroke(); g.restore(); }
    // Augen (nur in der Halle: schläft)
    if (o.sleep != null) { const op = o.wake || 0; g.lineWidth = 7; for (const ex of [-90, 10]) { g.fillStyle = "#fff"; g.beginPath(); g.ellipse(ex, -214, 30, 6 + 22 * op, 0, 0, 7); g.fill(); g.stroke(); if (op > 0.3) { g.fillStyle = OL; g.beginPath(); g.arc(ex + 6, -212, 10 * op, 0, 7); g.fill(); } else { g.beginPath(); g.moveTo(ex - 26, -210); g.quadraticCurveTo(ex, -196, ex + 26, -210); g.stroke(); } } }
    g.restore();
  }
  function nightcap(g, x, y, s, u) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 7; g.strokeStyle = OL; const tip = Math.sin(u * 2.2) * 0.12;
    g.fillStyle = "#e5243b"; g.beginPath(); g.moveTo(-70, 0); g.quadraticCurveTo(-40, -110, 60 + tip * 60, -150); g.quadraticCurveTo(30, -60, 70, 0); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 12; g.beginPath(); g.moveTo(-50, -40); g.quadraticCurveTo(0, -70, 40, -56); g.stroke(); g.beginPath(); g.moveTo(-20, -96); g.quadraticCurveTo(10, -112, 40, -110); g.stroke(); g.strokeStyle = OL; g.lineWidth = 7;
    g.fillStyle = "#fff"; rr(g, -80, -16, 160, 30, 15); g.fill(); g.stroke(); g.beginPath(); g.arc(64 + tip * 60, -152, 22, 0, 7); g.fill(); g.stroke(); g.restore(); }
  // Helm über einer SK.person-Figur (Kopf bei feet - 545 s, sitzend +140)
  function helmet(g, x, feet, s, sit, c = "#4e6232") { const hy = feet + (-545 + (sit ? 140 : 0)) * s; g.save(); g.translate(x, hy); g.scale(s, s); g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = c; g.beginPath(); g.arc(0, -14, 84, Math.PI * 1.02, Math.PI * 1.98); g.closePath(); g.fill(); g.stroke(); rr(g, -96, -26, 192, 20, 10); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(-30, -64, 30, 12, -0.4, 0, 7); g.fill(); g.restore(); }
  function officerCap(g, x, feet, s, sit) { const hy = feet + (-545 + (sit ? 140 : 0)) * s; g.save(); g.translate(x, hy); g.scale(s, s); g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#3e5528"; g.beginPath(); g.ellipse(0, -66, 100, 34, 0, 0, 7); g.fill(); g.stroke(); rr(g, -70, -66, 140, 44, 8); g.fill(); g.stroke();
    g.fillStyle = "#1e1e1e"; g.beginPath(); g.ellipse(14, -22, 82, 16, 0, 0, Math.PI); g.fill(); g.stroke(); g.fillStyle = "#e0b040"; g.beginPath(); g.arc(0, -48, 13, 0, 7); g.fill(); g.stroke();
    // Schnurrbart
    g.fillStyle = "#4a3020"; g.beginPath(); g.ellipse(-24, 22, 28, 11, 0.25, 0, 7); g.ellipse(24, 22, 28, 11, -0.25, 0, 7); g.fill(); g.restore(); }
  function toque(g, x, feet, s) { const hy = feet - 545 * s; g.save(); g.translate(x, hy); g.scale(s, s); g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#ffffff";
    rr(g, -62, -96, 124, 60, 10); g.fill(); g.stroke(); g.beginPath(); g.arc(-40, -136, 42, 0, 7); g.arc(0, -160, 48, 0, 7); g.arc(40, -136, 42, 0, 7); g.fill(); g.stroke(); rr(g, -60, -106, 120, 40, 10); g.fill(); g.stroke();
    g.fillStyle = "#2a1d16"; g.beginPath(); g.ellipse(-22, 24, 26, 11, 0.25, 0, 7); g.ellipse(22, 24, 26, 11, -0.25, 0, 7); g.fill(); g.restore(); }
  function earmuffs(g, x, feet, s) { const hy = feet - 545 * s; g.save(); g.translate(x, hy); g.scale(s, s); g.lineWidth = 8; g.strokeStyle = OL;
    g.strokeStyle = "#e5243b"; g.lineWidth = 18; g.beginPath(); g.arc(0, -10, 86, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); g.strokeStyle = OL; g.lineWidth = 7;
    for (const sx of [-1, 1]) { g.fillStyle = "#ff7aa8"; g.beginPath(); g.arc(sx * 78, 6, 36, 0, 7); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(sx * 78 - 10, -6, 10, 0, 7); g.fill(); } g.restore(); }
  function megaphone(g, h) { g.save(); g.translate(h[0], h[1]); g.rotate(-0.25); g.lineWidth = 6; g.strokeStyle = OL;
    g.fillStyle = "#f2b134"; g.beginPath(); g.moveTo(-10, -20); g.lineTo(120, -62); g.lineTo(120, 62); g.lineTo(-10, 20); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#fff"; g.beginPath(); g.ellipse(120, 0, 18, 62, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#c0392b"; rr(g, -34, -18, 30, 36, 6); g.fill(); g.stroke(); g.restore(); }
  function bowl(g, x, y, s, k) { if (k <= 0) return; const e = outBack(cl(k), 2.6); g.save(); g.translate(x, y); g.scale(s * e, s * e); g.lineWidth = 5; g.strokeStyle = OL;
    g.fillStyle = "#4f9a3a"; for (const [dx, dy, r] of [[-12, -18, 14], [8, -22, 15], [0, -10, 16], [-20, -8, 11], [20, -10, 11]]) { g.beginPath(); g.arc(dx, dy, r, 0, 7); g.fill(); g.stroke(); }
    circle(g, 6, -18, 6, "#e5243b"); circle(g, -14, -12, 4, "#f2d34d");
    g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(-30, -6); g.lineTo(30, -6); g.quadraticCurveTo(26, 16, 0, 18); g.quadraticCurveTo(-26, 16, -30, -6); g.closePath(); g.fill(); g.stroke(); g.restore(); }

  // ---------- Straße mit Pizzeria Bella ----------
  function street(g, u, shake) {
    g.lineWidth = 8; g.strokeStyle = OL;
    const sk = g.createLinearGradient(0, -300, 0, 600); sk.addColorStop(0, "#6fb0ee"); sk.addColorStop(1, "#cfe6fb"); g.fillStyle = sk; g.fillRect(-1200, -600, 3600, 1300);
    for (let i = 0; i < 4; i++) { const x = ((i * 420 + u * (14 + i * 4)) % 1900) - 500, y = 70 + (i % 2) * 120; g.fillStyle = "#ffffff"; for (const [dx, dy, r] of [[0, 0, 50], [48, -24, 60], [100, 0, 46], [50, 16, 44]]) { g.beginPath(); g.arc(x + dx, y + dy, r, 0, 7); g.fill(); } }
    // Nachbarhaus links (blaugrau, zwei Etagen)
    g.fillStyle = "#8fa6b8"; g.fillRect(-900, 330, 1240, 970); g.strokeRect(-900, 330, 1240, 970); g.fillStyle = "#6f879b"; g.fillRect(-900, 300, 1240, 40); g.strokeRect(-900, 300, 1240, 40);
    for (const wx of [-720, -470, -220, 60]) for (const wy of [420, 760]) { g.fillStyle = "#f4ead8"; rr(g, wx - 8, wy - 8, 156, 216, 6); g.fill(); g.stroke(); const wg = g.createLinearGradient(0, wy, 0, wy + 200); wg.addColorStop(0, "#d9eefc"); wg.addColorStop(1, "#8fb6d6"); g.fillStyle = wg; g.fillRect(wx, wy, 140, 200); g.strokeRect(wx, wy, 140, 200);
      g.beginPath(); g.moveTo(wx + 70, wy); g.lineTo(wx + 70, wy + 200); g.moveTo(wx, wy + 90); g.lineTo(wx + 140, wy + 90); g.stroke(); g.fillStyle = "#c86b4a"; rr(g, wx - 12, wy + 204, 164, 26, 6); g.fill(); g.stroke(); }
    // Pizzeria: Fassade, Fensterläden oben, Schild, Markise
    const PX0 = 330, PX1 = 1220; g.fillStyle = "#f3d9a4"; g.fillRect(PX0, 240, PX1 - PX0, 1060); g.strokeRect(PX0, 240, PX1 - PX0, 1060);
    g.fillStyle = "#e7c88a"; for (let r = 0; r < 18; r++) for (let c = 0; c < 6; c++) if ((r + c) % 3 === 0) { rr(g, PX0 + 20 + c * 150 + (r % 2) * 60, 260 + r * 22, 60, 10, 4); g.fill(); }
    g.fillStyle = "#c9604a"; g.fillRect(PX0, 210, PX1 - PX0, 40); g.strokeRect(PX0, 210, PX1 - PX0, 40);
    for (const wx of [420, 700, 980]) { g.fillStyle = "#e9f3fb"; rr(g, wx, 270, 130, 150, 6); g.fill(); g.stroke(); g.fillStyle = "#3d7f4a"; for (const sx of [-1, 1]) { const lx = sx < 0 ? wx - 56 : wx + 136; rr(g, lx, 266, 50, 158, 4); g.fill(); g.stroke(); g.strokeStyle = "#2d5f37"; g.lineWidth = 4; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(lx + 6, 284 + k * 24); g.lineTo(lx + 44, 284 + k * 24); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8; }
      g.beginPath(); g.moveTo(wx + 65, 270); g.lineTo(wx + 65, 420); g.stroke(); }
    // Wäscheleine zwischen den Häusern
    g.strokeStyle = "#5a4a3a"; g.lineWidth = 3; g.beginPath(); g.moveTo(240, 300); g.quadraticCurveTo(300, 345, 360, 305); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    // Schild (dunkelgrün, Serifenschrift)
    const sy = 450; g.fillStyle = "#1f4a32"; rr(g, PX0 + 70, sy, 700, 110, 14); g.fill(); g.stroke(); g.strokeStyle = "#e0b040"; g.lineWidth = 4; rr(g, PX0 + 84, sy + 12, 672, 86, 10); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    g.font = "400 30px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#f6e7c8"; g.fillText("PIZZERIA", PX0 + 420, sy + 32); g.font = "italic 400 58px S"; g.fillStyle = "#ffd98a"; g.fillText("Bella", PX0 + 420, sy + 74);
    // Markise mit Streifen und Bogenkante
    const ay = 590; for (let i = 0; i < 18; i++) { g.fillStyle = i % 2 ? "#ffffff" : "#d8343a"; g.beginPath(); g.moveTo(PX0 + 30 + i * 46, ay); g.lineTo(PX0 + 76 + i * 46, ay); g.lineTo(PX0 + 84 + i * 47, ay + 96); g.lineTo(PX0 + 28 + i * 47, ay + 96); g.closePath(); g.fill(); }
    g.beginPath(); g.moveTo(PX0 + 30, ay); g.lineTo(PX0 + 858, ay); g.lineTo(PX0 + 874, ay + 96); g.lineTo(PX0 + 28, ay + 96); g.closePath(); g.stroke();
    for (let i = 0; i < 18; i++) { g.fillStyle = i % 2 ? "#ffffff" : "#d8343a"; g.beginPath(); g.arc(PX0 + 52 + i * 47, ay + 96, 23, 0, Math.PI); g.fill(); g.stroke(); }
    // Tür links
    g.fillStyle = "#6b3a1f"; g.fillRect(PX0 + 40, 760, 140, 540); g.strokeRect(PX0 + 40, 760, 140, 540); g.fillStyle = "#b7d6ea"; rr(g, PX0 + 62, 790, 96, 200, 6); g.fill(); g.stroke(); circle(g, PX0 + 160, 1040, 9, "#e0b040");
    // Schild „Aperto“ an der Tür (hängt, schwingt beim Brüllen)
    g.save(); g.translate(PX0 + 110, 880); g.rotate(Math.sin(u * 3) * 0.04 + shake * Math.sin(u * 38) * 0.25); g.strokeStyle = "#3a2416"; g.lineWidth = 3; g.beginPath(); g.moveTo(-26, -40); g.lineTo(0, -60); g.lineTo(26, -40); g.stroke();
    fillRR(g, -46, -40, 92, 44, 8, "#fff6e0"); g.strokeStyle = OL; g.lineWidth = 5; rr(g, -46, -40, 92, 44, 8); g.stroke(); g.font = "italic 400 26px S"; g.fillStyle = "#1f4a32"; g.textAlign = "center"; g.fillText("Aperto", 0, -17); g.restore(); g.lineWidth = 8;
    // Großes Fenster mit Innenraum (Ofen, Koch kommt später), Scheibe wackelt
    g.fillStyle = "#4a2a18"; g.fillRect(PX0 + 210, 730, 640, 470); g.strokeRect(PX0 + 210, 730, 640, 470);
  }
  const WIN = { x0: 562, y0: 752, x1: 1158, y1: 1178 };
  function interior(g, u, cookFn) { g.save(); g.beginPath(); g.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); g.clip(); g.lineWidth = 8; g.strokeStyle = OL;
    const ig = g.createLinearGradient(0, WIN.y0, 0, WIN.y1); ig.addColorStop(0, "#f7c98a"); ig.addColorStop(1, "#d9904f"); g.fillStyle = ig; g.fillRect(WIN.x0, WIN.y0, 700, 500);
    // Holzofen (Backsteinkuppel mit Feuer)
    const ox = 1000, oy = 1150; g.fillStyle = "#b5523a"; g.beginPath(); g.arc(ox, oy, 190, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = "rgba(90,30,20,0.5)"; g.lineWidth = 4; for (let r = 0; r < 4; r++) { g.beginPath(); g.arc(ox, oy, 60 + r * 36, Math.PI, 0); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8;
    g.fillStyle = "#2a1410"; g.beginPath(); g.arc(ox, oy, 80, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
    for (let i = 0; i < 5; i++) { const fx = ox - 50 + i * 25, fh = 40 + 20 * Math.sin(u * 11 + i * 2); g.fillStyle = i % 2 ? "#ffb000" : "#ff6a2a"; g.beginPath(); g.moveTo(fx - 14, oy); g.quadraticCurveTo(fx - 10, oy - fh * 0.6, fx, oy - fh); g.quadraticCurveTo(fx + 10, oy - fh * 0.6, fx + 14, oy); g.closePath(); g.fill(); }
    // Regal mit Gläsern, Kräutertopf
    g.fillStyle = "#7a4a2a"; g.fillRect(WIN.x0, 860, 260, 16); g.strokeRect(WIN.x0, 860, 260, 16); [[600, "#c0392b"], [650, "#e0b040"], [700, "#3d9a6b"], [750, "#c0392b"]].forEach(([jx, c]) => { g.fillStyle = c; rr(g, jx - 16, 806, 32, 54, 6); g.fill(); g.stroke(); });
    if (cookFn) cookFn(g);
    // Theke
    g.fillStyle = "#e8dcc4"; g.fillRect(WIN.x0, 1110, 700, 80); g.strokeRect(WIN.x0 - 10, 1110, 720, 80);
    g.restore(); }
  function glass(g, u, shake) { const dx = shake * Math.sin(u * 47) * 7, dy = shake * Math.cos(u * 41) * 4; g.save(); g.translate(dx, dy); g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "rgba(200,230,255,0.16)"; g.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
    g.fillStyle = "rgba(255,255,255,0.28)"; g.beginPath(); g.moveTo(WIN.x0 + 60, WIN.y0); g.lineTo(WIN.x0 + 140, WIN.y0); g.lineTo(WIN.x0 + 20, WIN.y1); g.lineTo(WIN.x0 - 60, WIN.y1); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(WIN.x0 + 200, WIN.y0); g.lineTo(WIN.x0 + 230, WIN.y0); g.lineTo(WIN.x0 + 110, WIN.y1); g.lineTo(WIN.x0 + 80, WIN.y1); g.closePath(); g.fill();
    g.fillStyle = "#4a2a18"; g.fillRect((WIN.x0 + WIN.x1) / 2 - 9, WIN.y0, 18, WIN.y1 - WIN.y0); g.strokeRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
    if (shake > 0.2) { g.strokeStyle = `rgba(255,255,255,${0.7 * shake})`; g.lineWidth = 5; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(WIN.x0 - 20 - i * 18, WIN.y0 + 140 + i * 40); g.lineTo(WIN.x0 - 40 - i * 18, WIN.y0 + 160 + i * 40); g.stroke(); g.beginPath(); g.moveTo(WIN.x1 + 20 + i * 18, WIN.y0 + 140 + i * 40); g.lineTo(WIN.x1 + 40 + i * 18, WIN.y0 + 160 + i * 40); g.stroke(); } }
    g.restore();
    // Blumenkasten unter dem Fenster
    g.lineWidth = 8; g.strokeStyle = OL; for (let i = 0; i < 9; i++) { const fx = WIN.x0 + 30 + i * 66; g.fillStyle = "#3d7f4a"; g.beginPath(); g.ellipse(fx, 1206, 30, 18, 0, 0, 7); g.fill(); g.stroke(); circle(g, fx + (i % 2 ? 10 : -8), 1194, 13, i % 3 ? "#e5243b" : "#ffffff"); g.stroke(); }
    g.fillStyle = "#b5523a"; rr(g, WIN.x0 - 10, 1212, WIN.x1 - WIN.x0 + 20, 48, 8); g.fill(); g.stroke(); }
  function sidewalk(g) { g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#c9c4bb"; g.fillRect(-1200, GROUND, 3600, 90); g.strokeRect(-1200, GROUND, 3600, 90); g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 4; for (let i = -12; i < 26; i++) { g.beginPath(); g.moveTo(i * 120, GROUND); g.lineTo(i * 120 - 10, GROUND + 90); g.stroke(); }
    g.strokeStyle = OL; g.lineWidth = 8; g.fillStyle = "#8f8a82"; g.fillRect(-1200, GROUND + 90, 3600, 26); g.strokeRect(-1200, GROUND + 90, 3600, 26);
    const ag = g.createLinearGradient(0, GROUND + 116, 0, 2400); ag.addColorStop(0, "#5c5f66"); ag.addColorStop(1, "#45474d"); g.fillStyle = ag; g.fillRect(-1200, GROUND + 116, 3600, 1300);
    g.fillStyle = "#f2f2ee"; for (let i = -6; i < 14; i++) rr(g, i * 260, GROUND + 420, 150, 22, 6), g.fill();
    // Laterne
    g.fillStyle = "#2f3a3a"; g.fillRect(-268, 520, 16, GROUND - 520); g.strokeRect(-268, 520, 16, GROUND - 520); g.beginPath(); g.moveTo(-300, 520); g.lineTo(-220, 520); g.lineTo(-240, 460); g.lineTo(-280, 460); g.closePath(); g.fill(); g.stroke(); }
  function dust(g, x, y, u, a) { if (a <= 0) return; for (let i = 0; i < 8; i++) { const t = (u * 2.4 + i / 8) % 1; circle(g, x - t * 220 - (i % 3) * 30, y - 20 - t * 60 - (i % 2) * 20, (1 - t) * 34 + 10, `rgba(225,210,190,${0.6 * a * (1 - t)})`); } }

  // ---------- Halle (Kaserne): Panzer schläft, Soldaten am langen Tisch ----------
  function hall(g, u) { g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#4b5440"; g.fillRect(-1200, -600, 3600, 1800);
    g.fillStyle = "#7d876a"; g.fillRect(-1200, 160, 3600, 1000); for (let i = -30; i < 70; i++) { g.fillStyle = i % 2 ? "#717b5f" : "#87916f"; g.fillRect(i * 40, 160, 40, 1000); }
    g.fillStyle = "#3a4130"; g.fillRect(-1200, 120, 3600, 60); g.strokeRect(-1200, 120, 3600, 60); for (let i = -6; i < 16; i++) { g.fillStyle = "#30362a"; g.fillRect(i * 260, -600, 30, 760); }
    // großes Rolltor hinter dem Panzer
    g.fillStyle = "#5f6a52"; g.fillRect(-220, 300, 700, 860); g.strokeRect(-220, 300, 700, 860); g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 5; for (let i = 0; i < 20; i++) { g.beginPath(); g.moveTo(-220, 320 + i * 42); g.lineTo(480, 320 + i * 42); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8;
    // Schablonenschrift HALLE 3
    g.font = "900 64px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(240,220,120,0.75)"; g.fillText("HALLE 3", 330, 250);
    // Wanduhr, Pinnwand, Werkzeugwand
    g.fillStyle = "#fff"; g.beginPath(); g.arc(770, 330, 62, 0, 7); g.fill(); g.stroke(); g.lineWidth = 6; g.beginPath(); g.moveTo(770, 330); g.lineTo(770, 284); g.moveTo(770, 330); g.lineTo(800, 346); g.stroke(); g.lineWidth = 8;
    g.fillStyle = "#b88a52"; rr(g, 560, 470, 230, 170, 8); g.fill(); g.stroke(); [["#fff6a8", 580, 490, 0.05], ["#ffffff", 660, 500, -0.06], ["#a8e0ff", 720, 560, 0.08], ["#ffc0d0", 600, 570, -0.04]].forEach(([c, x, y, r]) => { g.save(); g.translate(x + 30, y + 30); g.rotate(r); g.fillStyle = c; g.fillRect(-30, -30, 60, 60); g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 2; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(-20, -12 + k * 12); g.lineTo(20, -12 + k * 12); g.stroke(); } g.restore(); circle(g, x + 30, y + 4, 6, "#e5243b"); });
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#5a4630"; rr(g, 860, 430, 260, 240, 8); g.fill(); g.stroke(); g.lineWidth = 7; [[900, 470, 40, 150], [960, 470, 30, 120], [1010, 470, 60, 40], [1010, 540, 60, 40], [1090, 470, 20, 160]].forEach(([x, y, w, h]) => { g.fillStyle = "#9aa1ab"; rr(g, x, y, w, h, 5); g.fill(); g.stroke(); });
    // Seitentür rechts (hier kommt der Lieferbote)
    g.lineWidth = 8; g.fillStyle = "#3a4130"; g.fillRect(1180, 640, 220, 520); g.strokeRect(1180, 640, 220, 520);
    // Hängelampen
    [20, 560, 1100].forEach((lx) => { g.strokeStyle = "#1e2218"; g.lineWidth = 5; g.beginPath(); g.moveTo(lx, -600); g.lineTo(lx, 60); g.stroke(); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = "#2f5e4e"; g.beginPath(); g.moveTo(lx - 70, 110); g.lineTo(lx - 26, 60); g.lineTo(lx + 26, 60); g.lineTo(lx + 70, 110); g.closePath(); g.fill(); g.stroke(); circle(g, lx, 114, 15, "#fff1c9");
      const lg = g.createRadialGradient(lx, 130, 5, lx, 700, 700); lg.addColorStop(0, "rgba(255,225,160,0.30)"); lg.addColorStop(1, "rgba(255,225,160,0)"); g.fillStyle = lg; g.beginPath(); g.moveTo(lx - 60, 114); g.lineTo(lx + 60, 114); g.lineTo(lx + 460, 1400); g.lineTo(lx - 460, 1400); g.closePath(); g.fill(); });
    g.strokeStyle = OL; g.lineWidth = 8;
    // Betonboden mit gelber Markierung
    g.fillStyle = "#9b9d93"; g.fillRect(-1200, 1150, 3600, 1200); g.strokeRect(-1200, 1150, 3600, 1200); g.fillStyle = "rgba(0,0,0,0.08)"; for (let i = 0; i < 30; i++) { g.beginPath(); g.ellipse(rnd(i * 3.3) * 1600 - 200, 1180 + rnd(i * 7.1) * 700, 40 + rnd(i) * 60, 10, 0, 0, 7); g.fill(); }
    g.fillStyle = "#e8c43a"; for (let i = -5; i < 12; i++) { g.save(); g.translate(i * 180, 1190); g.transform(1, 0, -0.5, 1, 0, 0); g.fillRect(0, 0, 90, 18); g.restore(); } }
  function zzz(g, x, y, u, k) { if (k <= 0) return; for (let i = 0; i < 3; i++) { const t = ((u * 0.7 + i / 3) % 1); g.save(); g.translate(x + t * 140 + Math.sin(u * 3 + i) * 12, y - t * 220); g.rotate(0.2); g.globalAlpha = k * Math.sin(t * Math.PI);
    g.font = `900 ${60 + t * 40}px D`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 10; g.strokeStyle = OL; g.lineJoin = "round"; g.strokeText("Z", 0, 0); g.fillStyle = "#9fd3ff"; g.fillText("Z", 0, 0); g.restore(); } }
  // Pizzakarton (Seitenansicht flach, Mitte unten bei x, y), lid 0 zu .. 1 offen (Pizza sichtbar)
  function box(g, x, y, w, lid, u) { g.save(); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#e3b878"; rr(g, x - w / 2, y - 26, w, 26, 4); g.fill(); g.stroke();
    g.fillStyle = "#c8995a"; g.fillRect(x - w / 2 + 6, y - 10, w - 12, 4);
    if (lid > 0) { // offener Deckel nach hinten, Pizza von schräg oben
      const lh = 150 * lid; g.fillStyle = "#f0d4a0"; g.beginPath(); g.moveTo(x - w / 2, y - 26); g.lineTo(x - w / 2 + 10, y - 26 - lh); g.lineTo(x + w / 2 - 10, y - 26 - lh); g.lineTo(x + w / 2, y - 26); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#e3b878"; g.beginPath(); g.ellipse(x, y - 30, w / 2 - 6, 22, 0, 0, 7); g.fill(); g.stroke(); pizzaTop(g, x, y - 32, w / 2 - 16, 0.28, u);
    } else { g.fillStyle = "#e9c48a"; rr(g, x - w / 2 - 2, y - 32, w + 4, 10, 3); g.fill(); g.stroke(); }
    g.restore(); }
  function pizzaTop(g, x, y, r, sq, u) { g.save(); g.translate(x, y); g.scale(1, sq); g.lineWidth = 6 / sq; g.strokeStyle = OL;
    g.fillStyle = "#d9963f"; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#e5512b"; g.beginPath(); g.arc(0, 0, r * 0.86, 0, 7); g.fill(); g.fillStyle = "#ffe9a8"; for (let i = 0; i < 9; i++) { const a = i * 2.3, d = r * 0.5 * rnd(i * 4.1 + 1); g.beginPath(); g.ellipse(Math.cos(a) * d, Math.sin(a) * d, r * 0.24, r * 0.18, a, 0, 7); g.fill(); }
    for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.3, d = r * (0.25 + 0.45 * rnd(i * 7.7)); circle(g, Math.cos(a) * d, Math.sin(a) * d, r * 0.12, "#b8322a"); }
    for (let i = 0; i < 4; i++) { const a = i * 1.6 + 1, d = r * 0.55; g.fillStyle = "#3d8a3a"; g.beginPath(); g.ellipse(Math.cos(a) * d, Math.sin(a) * d, r * 0.09, r * 0.05, a, 0, 7); g.fill(); }
    g.restore(); }
  function steam(g, x, y, u, a = 1, sc = 1) { if (a <= 0) return; g.save(); g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 6 * sc; g.lineCap = "round"; for (let i = 0; i < 3; i++) { const k = (u * 0.8 + i / 3) % 1; g.globalAlpha = Math.sin(k * Math.PI) * a; const bx = x + (i - 1) * 26 * sc; g.beginPath(); g.moveTo(bx, y - k * 70 * sc); g.quadraticCurveTo(bx + 16 * sc, y - (20 + k * 70) * sc, bx, y - (40 + k * 70) * sc); g.quadraticCurveTo(bx - 16 * sc, y - (60 + k * 70) * sc, bx, y - (80 + k * 70) * sc); g.stroke(); } g.restore(); }
  const NB = 16, BW = 200, BH = 30; // Kartonturm: Anzahl, Breite, Höhe je Karton

  TYPES.h_panzerpizza = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 3.6, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.rollt = f(/^rollt/, 0, 0.6); T.bella = f(/^bella/, T.rollt, 2.6); T.brull = f(/^brüllt/, T.bella, T.bella + 1.0); T.v40 = f(/^vierzig/, T.brull, T.brull + 0.9); T.sof = f(/^sofort/, T.v40, T.v40 + 0.8);
      T.koch = f(/^koch/, T.sof, T.sof + 0.9); T.halb = f(/^hälfte/, T.koch, T.koch + 0.9); T.kommen = f(/^kommen/, T.halb, T.halb + 0.7); T.salat = f(/^salate/, T.kommen, T.kommen + 0.6);
      T.dies = f(/^diesen/, T.salat, T.salat + 1.0); T.kas = f(/^kaserne/, T.dies, T.dies + 1.4); T.trotz = f(/^trotzdem/, T.kas, T.kas + 0.5); T.exakt = f(/^exakt/, T.trotz, T.trotz + 0.8); T.pizz = f(/^pizzen/, T.exakt, T.exakt + 0.6);
      T.denn = f(/^denn/, T.pizz, T.pizz + 0.8);
      T.bB = T.dies - 0.12; // Schnitt in die Halle
      this.coverT = T.v40 + 0.35; p._T = T; },
    draw(g, u, d, p) { const T = p._T; const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      g.fillStyle = "#1d120c"; g.fillRect(0, 0, W, H);
      if (u < T.bB) { // ---------- Straße ----------
        const drive = seg(u, 0, T.bella + 0.05), tx = lerp(-170, TX, out3(drive)), roll = tx * 1.0;
        const brake = u > T.bella ? Math.sin((u - T.bella) * 16) * Math.exp(-(u - T.bella) * 5) : 0;
        const rumble = drive < 1 ? Math.sin(u * 55) * 3 : 0;
        const shake = Math.max(seg(u, T.v40 - 0.1, T.v40 + 0.1) * (1 - seg(u, T.koch - 0.3, T.koch + 0.1)), 0);
        const pop = seg(u, T.brull - 0.25, T.brull + 0.05); // Kommandant kommt aus der Luke
        const c = SK.cam([{ t: 0, z: 1.45, x: -60, y: 1060 }, { t: 0.5, z: 1.4, x: 0, y: 1050 }, { t: T.bella + 0.1, z: 1.0, x: 540, y: 930 }, { t: T.brull - 0.15, z: 1.0, x: 540, y: 930 }, { t: T.brull + 0.35, z: 1.42, x: 330, y: 900 }, { t: T.koch - 0.15, z: 1.42, x: 330, y: 900 },
          { t: T.koch + 0.3, z: 1.7, x: 830, y: 960 }, { t: T.kommen - 0.2, z: 1.7, x: 830, y: 960 }, { t: T.kommen + 0.25, z: 1.0, x: 520, y: 930 }, { t: T.bB, z: 1.06, x: 500, y: 930 }], u);
        const sx = shake * Math.sin(u * 61) * 10, sy = shake * Math.cos(u * 53) * 8 + rumble;
        g.save(); SK.apply(g, c, sx, sy);
        street(g, u, shake);
        const cookIn = u < T.salat - 0.2; const ckSur = seg(u, T.v40 - 0.05, T.v40 + 0.15);
        interior(g, u, cookIn ? (q) => { const cx = 820, feet = 1335; SK.person(q, cx, feet, 0.62, { ...COOK, mouth: u > T.halb - 0.1 ? "o" : ckSur > 0.5 ? "flat" : "smile", eyes: u > T.koch - 0.1 ? "wide" : "happy", look: u > T.koch ? -0.8 : 0, brow: u > T.halb - 0.1 ? -0.7 : 0,
          aL: u > T.halb - 0.1 ? -0.4 : 1.2, eL: u > T.halb - 0.1 ? 0.9 : 0, aR: 0.9 + Math.sin(u * 7) * 0.2, eR: -0.8, bob: Math.sin(u * 3) * 3 }); toque(q, cx, feet, 0.62); earmuffs(q, cx, feet, 0.62); } : null);
        glass(g, u, shake);
        sidewalk(g);
        // Koch kommt mit Salat aus der Tür
        if (!cookIn) { const ck = seg(u, T.salat - 0.2, T.salat + 0.2); const cx = lerp(440, 500, out3(ck)); SK.person(g, cx, GROUND + 20, 0.6, { ...COOK, mouth: "grin", eyes: "happy", aR: -0.5, eR: 0.6, aL: 1.3, flip: true, hold: (q, hR) => bowl(q, hR[0] - 20, hR[1] - 30, 1.6, 1) }); toque(g, cx, GROUND + 20, 0.6); earmuffs(g, cx, GROUND + 20, 0.6); }
        // Panzer + Kommandant in der Luke
        const hatchX = TX + 30 * TS, hatchY = GROUND - 296 * TS;
        tank(g, tx, GROUND + 8, TS, { roll, gun: brake * 0.05 + (pop > 0 ? -0.02 : 0), lid: pop, t: u, lean: brake * 0.3 });
        if (pop > 0) { const cs = 0.5, rise = out3(pop); g.save(); g.beginPath(); g.rect(-600, -600, 2400, hatchY + 600 + 4); g.clip();
          const feet = hatchY + 420 * cs - rise * 190 * cs; const shout = u > T.v40 - 0.15 && u < T.koch; const saladShock = u > T.salat - 0.1;
          SK.person(g, hatchX, feet, cs, { ...SOLD, mouth: shout ? "shout" : saladShock ? "o" : "flat", eyes: saladShock ? "wide" : "dot", brow: shout ? 1 : saladShock ? -0.6 : 0.5, red: shout ? 0.6 : 0, t: u, aR: shout ? -0.15 : 0.6, eR: shout ? -0.5 : -1.4, aL: saladShock ? -0.7 : 1.3, eL: saladShock ? 0.8 : 0,
            hold: (q, hR) => megaphone(q, hR) }); officerCap(g, hatchX, feet, cs, false); g.restore();
          if (shout) { g.save(); g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 6; g.lineCap = "round"; for (let i = 0; i < 4; i++) { const k = ((Math.max(0, u - T.v40 + 0.2)) * 3 + i / 4) % 1; const r = 70 + k * 260; g.globalAlpha = 1 - k; g.beginPath(); g.arc(hatchX + 160, feet - 400 * cs, r, -0.5, 0.5); g.stroke(); } g.restore(); } }
        // vierzig Salatschüsseln stapeln sich auf dem Panzer (Pyramide 12, 11, 9, 8)
        const rows = [12, 11, 9, 8]; let n = 0; const t0 = T.kommen - 0.05, t1 = T.salat + 0.15;
        rows.forEach((cnt, r) => { for (let i = 0; i < cnt; i++) { const bx = TX - 140 + (12 - cnt) * 25 + i * 50 + r * 6, by = GROUND - 180 * TS - r * 34; const k = (u - (t0 + (t1 - t0) * (n / 39))) / 0.12; bowl(g, bx, by, 1, k); n++; } });
        dust(g, tx - 290 * TS, GROUND + 4, u, drive < 1 ? 1 : 1 - seg(u, T.bella, T.bella + 0.6));
        g.restore();
        // Sprechblasen (Bildschirm)
        const [mx, my] = SK.toScreen(c, hatchX + 40, hatchY - 300 * 0.5);
        SK.bubble(g, ["VIERZIG", "*PIZZEN*!"], 690, 470, mx + 60, my - 40, win(T.v40 - 0.08, T.koch - 0.05), { shout: true, px: 76 });
        SK.bubble(g, ["*SOFORT*!"], 330, 300, mx - 10, my - 70, win(T.sof - 0.05, T.koch - 0.05), { shout: true, px: 64 });
        const [kx, ky] = SK.toScreen(c, 820, 1335 - 545 * 0.62);
        SK.qmarks(g, kx, ky - 190, u, seg(u, T.halb - 0.1, T.halb + 0.3) * (1 - seg(u, T.kommen - 0.25, T.kommen - 0.05)), 3);
        SK.bubble(g, ["Vierzig…", "*was*?"], 300, 560, kx - 90, ky - 20, win(T.halb + 0.05, T.kommen - 0.1), { think: true, px: 54 });
        SK.bubble(g, ["*SALATE*?!"], 560, 360, mx + 10, my - 40, win(T.salat + 0.05, T.bB + 0.05), { shout: true, px: 70 });
        SK.pow(g, "RUMMS", 760, 1230, (u - T.bella + 0.12) / 0.8, { px: 120, rot: 0.1 });
      } else { // ---------- Halle: Panzer schläft, Pizza kommt ----------
        const walk = seg(u, T.trotz - 0.25, T.pizz - 0.15), bx = lerp(1320, 720, inOut(walk));
        const land = seg(u, T.pizz - 0.15, T.pizz + 0.05), cheer = u > T.pizz - 0.05;
        const topY = 1180 - 30 - NB * BH; // obere Kartonoberkante wenn abgestellt (Tisch y 1180)
        const dive = inExpo(cl((u - T.denn - 0.05) / Math.max(0.3, d - T.denn - 0.05)));
        const c = SK.cam([{ t: T.bB, z: 1.45, x: 300, y: 860 }, { t: T.kas + 0.2, z: 1.2, x: 600, y: 930 }, { t: T.trotz, z: 1.2, x: 600, y: 930 }, { t: T.exakt + 0.1, z: 1.15, x: 720, y: 840 }, { t: T.pizz + 0.2, z: 1.08, x: 620, y: 880 }, { t: T.denn, z: 1.1, x: 680, y: 820 }], u);
        if (dive > 0) { const k = inOut(cl((u - T.denn) / 0.35)); c.x = lerp(c.x, 720, k); c.y = lerp(c.y, topY - 50, k); c.z *= 1 + dive * 26; }
        g.save(); SK.apply(g, c);
        hall(g, u);
        const wake = cheer ? seg(u, T.pizz + 0.1, T.pizz + 0.4) : 0;
        tank(g, 170, 1160, 0.62, { sleep: true, wake, t: u * 0.2 }); nightcap(g, 170 + 30 * 0.62, 1160 - 296 * 0.62, 0.62, u);
        zzz(g, 210, 900, u, 1 - wake);
        // Lieferbote mit Kartonturm (hinter dem Tisch; der Turm landet danach auf dem Tisch)
        const carriedNow = land < 1; const wob = carriedNow ? Math.sin(u * 9) * 0.035 : 0;
        const feetB = 1165, bs = 0.66, stepB = walk < 1 ? -Math.abs(Math.sin(u * 10)) * 10 : 0;
        const drawTower = () => { const tyBase = carriedNow ? lerp(feetB - 615 * bs, 1180, out3(land)) : 1180; const tx0 = carriedNow ? bx - 10 : 720;
          g.save(); g.translate(tx0, tyBase + (carriedNow ? stepB : 0)); g.rotate(wob); for (let i = 0; i < NB; i++) { const lid = i === NB - 1 && cheer ? out3(seg(u, T.pizz + 0.15, T.pizz + 0.5)) : 0; box(g, Math.sin(i * 1.7) * 6, -i * BH, BW, lid, u); } g.restore();
          if (cheer) steam(g, 720, topY - 40, u, seg(u, T.pizz + 0.3, T.pizz + 0.6), 1.1); };
        if (u > T.trotz - 0.3) { const bxp = carriedNow ? bx : lerp(bx, 880, seg(u, T.pizz + 0.05, T.pizz + 0.5));
          SK.person(g, bxp, feetB, bs, { ...BOY, flip: true, walk: walk < 1 ? u * 10 : 0, mouth: cheer ? "grin" : "smile", eyes: cheer ? "happy" : "dot", aL: carriedNow ? -1.0 : cheer ? -0.8 : 1.3, eL: 0.4, aR: carriedNow ? -1.0 : 1.3, eR: carriedNow ? 0.4 : 0, bob: stepB });
          if (carriedNow) drawTower(); }
        // Soldaten sitzen hinter dem langen Tisch
        const seats = [440, 590, 740, 890, 1040];
        seats.forEach((sx, i) => { const off = i === 4; const bounce = cheer ? -Math.abs(Math.sin(u * 8 + i)) * 14 : 0; const wait = !cheer;
          SK.person(g, sx, 1300, 0.56, { ...SOLD, sit: true, shirt: off ? "#3e5528" : SOLD.shirt, mouth: cheer ? "grin" : i % 2 ? "flat" : "sad", eyes: cheer ? "happy" : u > T.trotz && i % 2 ? "side" : "dot", look: u > T.trotz ? 0.8 : 0, brow: wait ? -0.5 : 0,
            aL: cheer ? -0.9 : 1.3, eL: cheer ? 0.5 : 0, aR: cheer ? -0.9 : 1.3, eR: cheer ? 0.5 : 0, bob: bounce });
          if (off) officerCap(g, sx, 1300 + bounce, 0.56, true); else helmet(g, sx, 1300 + bounce, 0.56, true); });
        // Tisch
        g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#8a6a44"; g.fillRect(340, 1180, 800, 34); g.strokeRect(340, 1180, 800, 34); g.fillStyle = "#6e5232"; g.fillRect(340, 1214, 800, 14); g.strokeRect(340, 1214, 800, 14);
        [380, 1100].forEach((lx) => { g.fillStyle = "#6e5232"; g.fillRect(lx - 12, 1228, 24, 150); g.strokeRect(lx - 12, 1228, 24, 150); });
        // leere Teller, Besteck (vor dem Jubel), danach offene Pizzen
        seats.forEach((sx, i) => { if (Math.abs(sx - 720) < 60) return; const ok = seg(u, T.pizz + 0.02 + i * 0.05, T.pizz + 0.2 + i * 0.05);
          if (ok > 0) { box(g, sx, 1180, 128, out3(ok) * 0.22, u); steam(g, sx, 1120, u + i, ok, 0.7); } else { g.fillStyle = "#fff"; g.beginPath(); g.ellipse(sx, 1176, 46, 10, 0, 0, 7); g.fill(); g.stroke(); g.strokeStyle = "#9aa1ab"; g.lineWidth = 5; g.beginPath(); g.moveTo(sx + 58, 1174); g.lineTo(sx + 78, 1174); g.stroke(); g.lineWidth = 8; g.strokeStyle = OL; } });
        if (!carriedNow) drawTower();
        g.restore();
        if (cheer) confetti(g, 540, 520, u - T.pizz, 70, ["#ffd34d", "#e5243b", "#3d9a6b", "#ffffff", "#f2b134"], 620, 7);
        const [ox, oy] = SK.toScreen(c, 1040, 1300 - 405 * 0.56);
        SK.bubble(g, ["Exakt *vierzig*!"], 700, 330, ox - 30, oy - 40, win(T.pizz + 0.05, T.denn + 0.05) * (1 - dive * 4), { shout: true, px: 62 });
        SK.speedLines(g, 540, 960, seg(u, T.denn - 0.05, T.denn + 0.2) * (1 - dive * 2), "rgba(255,211,77,");
        SK.flashAt(g, u, [T.bB], 0.09, 0.6);
      }
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T; const E = [[0.0, "rk_roar", 0.5, -0.4], [0.0, "thump", 0.6, -0.3], [0.02, "closed_rattle", 0.35, -0.4]];
      for (let t = 0.15; t < T.bella; t += 0.24) E.push([t, "click", 0.18, -0.3 + t * 0.1]);
      E.push([T.bella - 0.05, "thump", 0.7, 0], [T.bella, "boom", 0.25, 0], [T.bella + 0.05, "closed_rattle", 0.35, 0]);
      E.push([T.brull - 0.25, "closed_squeak", 0.45, -0.2], [T.brull - 0.05, "pop", 0.45, -0.2]);
      E.push([T.v40 - 0.05, "slap", 0.5, -0.1], [T.v40, "closed_rattle", 0.55, 0.3], [T.v40 + 0.25, "closed_rattle", 0.4, 0.4], [T.sof - 0.05, "pop", 0.5, -0.3]);
      E.push([T.koch - 0.15, "whoosh_side", 0.4, 0.3], [T.halb - 0.05, "pop", 0.35, 0.3], [T.halb + 0.1, "pop", 0.3, 0.1]);
      E.push([T.kommen - 0.2, "whoosh_side", 0.35, -0.2]); for (let i = 0; i < 40; i += 3) E.push([T.kommen - 0.05 + (T.salat + 0.2 - T.kommen) * i / 39, "pop", 0.28, (i / 39 - 0.5) * 0.8]);
      E.push([T.salat + 0.05, "vsad", 0.4, 0]);
      E.push([T.bB, "tr_slow", 0.4, 0], [T.bB + 0.05, "whoosh_down", 0.35, 0], [T.kas, "chime", 0.2, -0.4]);
      E.push([T.trotz - 0.3, "gdoor", 0.45, 0.6], [T.trotz - 0.2, "vsteps", 0.4, 0.5], [T.exakt, "vsteps", 0.3, 0.2]);
      E.push([T.pizz - 0.12, "thump", 0.55, 0], [T.pizz, "pop", 0.5, -0.2], [T.pizz + 0.08, "pop", 0.45, 0.2], [T.pizz + 0.15, "slot_bells", 0.25, 0], [T.pizz + 0.2, "shimmer", 0.35, 0]);
      E.push([T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Pizzakarton öffnet sich, Filmtitel auf dem Kartondeckel ----------
  TYPES.panzerpizza_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^direkt/, E.sys, 1.4); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      // Innenseite des Deckels: Karton mit Fasern, warmes Licht
      const kg = g.createLinearGradient(0, 0, 0, H); kg.addColorStop(0, "#3a2414"); kg.addColorStop(0.5, "#4a2e18"); kg.addColorStop(1, "#2a190d"); g.fillStyle = kg; g.fillRect(0, 0, W, H);
      g.strokeStyle = "rgba(255,210,150,0.05)"; g.lineWidth = 2; for (let i = 0; i < 70; i++) { const y = rnd(i * 2.7) * H, x = rnd(i * 5.1) * W; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 60 + rnd(i) * 120, y + (rnd(i * 3.3) - 0.5) * 8); g.stroke(); }
      // Wellpappe-Kanten (Rillen) oben und unten
      g.fillStyle = "rgba(0,0,0,0.25)"; for (let i = 0; i < 28; i++) { g.beginPath(); g.ellipse(i * 40 + 20, 40, 14, 22, 0, 0, 7); g.fill(); }
      const lg = g.createRadialGradient(540, 820, 40, 540, 900, 1050); lg.addColorStop(0, "rgba(255,180,100,0.22)"); lg.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = lg; g.fillRect(0, 0, W, H);
      // Pizza unten (ragt ins Bild), Dampf steigt
      const pk = out3(seg(u, 0.1, 0.9)); g.save(); g.translate(540, lerp(2300, 1990, pk)); g.lineWidth = 7; g.strokeStyle = "rgba(0,0,0,0.6)";
      g.fillStyle = "#c48a3a"; g.beginPath(); g.arc(0, 0, 420, 0, 7); g.fill(); g.fillStyle = "#c9452a"; g.beginPath(); g.arc(0, 0, 370, 0, 7); g.fill();
      g.fillStyle = "#f2d896"; for (let i = 0; i < 14; i++) { const a = i * 2.39, dd = 330 * Math.sqrt(rnd(i * 4.1 + 1)); g.beginPath(); g.ellipse(Math.cos(a) * dd, Math.sin(a) * dd, 70, 52, a, 0, 7); g.fill(); }
      for (let i = 0; i < 12; i++) { const a = i * 1.7 + 0.4, dd = 80 + 250 * rnd(i * 7.7); circle(g, Math.cos(a) * dd, Math.sin(a) * dd, 34, "#9e2a22"); }
      for (let i = 0; i < 7; i++) { const a = i * 0.95 + 0.2, dd = 140 + 160 * rnd(i * 3.3); g.fillStyle = "#3d7a34"; g.beginPath(); g.ellipse(Math.cos(a) * dd, Math.sin(a) * dd, 26, 13, a, 0, 7); g.fill(); }
      const sh = g.createRadialGradient(0, -300, 40, 0, 0, 440); sh.addColorStop(0, "rgba(255,240,200,0.18)"); sh.addColorStop(1, "rgba(0,0,0,0.25)"); g.fillStyle = sh; g.beginPath(); g.arc(0, 0, 420, 0, 7); g.fill(); g.restore();
      g.save(); g.globalAlpha = 0.5 * pk; for (let i = 0; i < 5; i++) { const k = (u * 0.35 + i / 5) % 1; const x = 300 + i * 120 + Math.sin(u + i) * 30; g.strokeStyle = `rgba(255,240,220,${0.35 * Math.sin(k * Math.PI)})`; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(x, 1760 - k * 140); g.quadraticCurveTo(x + 30, 1720 - k * 140, x, 1680 - k * 140); g.quadraticCurveTo(x - 30, 1640 - k * 140, x, 1600 - k * 140); g.stroke(); } g.restore();
      SK.endTitle(g, u, d, T, { c: "#f6e7c8", glow: "rgba(255,190,110,0.45)", accent: "#e8a85a", sub: "rgba(255,230,195,0.85)", key: "#ffd98a", offer: "BESTELLEN OHNE PROVISION", y: 820, line: "und ich zeige Ihnen, wie das bei Ihnen aussieht." });
      // Deckel klappt auf (Außenseite mit Stempel), dann weg
      const lk = inOut(seg(u, 0.0, 0.55)); if (lk < 1) { g.save(); const hgt = H * (1 - lk); g.fillStyle = "#e3b878"; g.fillRect(0, 0, W, hgt); g.strokeStyle = "rgba(90,50,20,0.6)"; g.lineWidth = 8; g.strokeRect(-4, -4, W + 8, hgt + 4);
        if (hgt > 400) { g.translate(540, hgt / 2); g.scale(1, Math.max(0.05, 1 - lk)); g.strokeStyle = "#a33a2a"; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 230, 0, 7); g.stroke(); g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 200, 0, 7); g.stroke();
          g.font = "italic 400 120px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#a33a2a"; g.fillText("Bella", 0, 0); }
        g.restore(); }
      const fi = 1 - cl(u / 0.25); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.05, "tr_swish", 0.4, 0], [0.15, "shimmer", 0.35, 0], [0.5, "chime", 0.25, 0], [1.0, "shimmer_hi", 0.25, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
