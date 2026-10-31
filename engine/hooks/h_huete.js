// VOICE_DELAY: 0.45
// h_huete: Neugier-Geschichte (Look "story", Anti-Werbung). Elektriker Jonas trägt jeden Tag fünf Hüte übereinander.
// Bild 0: Werkstatt, Hüte fallen von oben auf seinen Kopf und stapeln sich (PLOPP x5). Bei jeder Rolle springt der passende Hut
// nach oben und der Ort wechselt: Sicherungskasten (Helm), zwei klingelnde Telefone (rote Pagenmütze), Plakat an der Mauer (Barett),
// Papierberge mit Rechenmaschine (Melone), nachts im Schlafanzug an der Tür (Auskunftsmütze). Bei „qualmt“ Dampf aus den Ohren,
// der Hutturm wackelt. Heute bekommen die vier fremden Hüte Flügel und fliegen davon, Jonas behält nur seinen Helm und schläft
// durch (Helm am Bettpfosten, Uhr rast durch die Nacht). Bei „Denn“ taucht die Kamera in den Helm, Weiß.
// huete_end: grüner Flur, Hutleiste, die vier Hüte fliegen herein und landen bei Website / KI-Chatbot / Google Maps auf Haken
// mit Etiketten (WERBUNG, ANFRAGEN, AUSKUNFT, GEFUNDEN WERDEN), Filmtitel, BUSINESS-PAKET.
// Wörter: fünf, morgens, mittags, nachmittags, abends, nachts, sein, qualmt, heute, einen, seinen, und, schläft, durch, denn.
(() => {
  const OL = SK.OL;
  const JX = 600, FL = 1420; // Jonas: x, Füße
  const WORK = { hs: "short", hair: "#4a2c1a", shirt: "#e07a2e", pants: "#2d4a7a", shoes: "#3a2a1e", skin: "#f1c7a1", apron: "#2d4a7a" };
  const PJ = { hs: "short", hair: "#4a2c1a", shirt: "#8fb8e0", pants: "#7da6d0", shoes: "#b8343a", skin: "#f1c7a1" };
  const KINDS = ["helm", "tel", "werbe", "buch", "ausk"];
  const HH = { helm: 84, tel: 74, werbe: 54, buch: 80, ausk: 80 };
  const K = (t, z, x, y) => ({ t, z, x, y });

  // Handposition einer SK.person in Weltkoordinaten
  function hand(x, feet, s, side, a, bend) { const sx = side * 92, sy = -410; const ex = sx + side * Math.cos(a) * 95, ey = sy + Math.sin(a) * 95; const b = a + side * bend; return [x + (ex + side * Math.cos(b) * 90) * s, feet + (ey + Math.sin(b) * 90) * s]; }
  function bolt(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c; g.beginPath(); [[8, -40], [-18, 4], [0, 4], [-10, 40], [20, -8], [2, -8], [14, -40]].forEach(([a, b], i) => (i ? g.lineTo(a, b) : g.moveTo(a, b))); g.closePath(); g.fill(); g.restore(); }

  // ---------- Hüte (Vorderansicht, Krempe unten bei y = 0) ----------
  function hat(g, kind, x, y, s = 1, rot = 0, sq = 1) {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * (2 - sq), s * sq); g.lineWidth = 7; g.strokeStyle = OL; g.lineJoin = "round"; g.lineCap = "round";
    if (kind === "helm") { // gelber Schutzhelm
      g.fillStyle = "#ffcf2e"; g.beginPath(); g.moveTo(-82, -12); g.bezierCurveTo(-82, -116, 82, -116, 82, -12); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#ffe17d"; g.beginPath(); g.moveTo(-15, -14); g.lineTo(-15, -84); g.quadraticCurveTo(0, -94, 15, -84); g.lineTo(15, -14); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#f2b705"; g.beginPath(); g.ellipse(0, -8, 108, 17, 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.ellipse(-48, -60, 10, 20, 0.5, 0, 7); g.fill();
      bolt(g, 48, -46, 0.5, "#1b1530");
    } else if (kind === "tel") { // rote Pagenmütze mit Hörer-Abzeichen
      g.fillStyle = "#d93a3a"; rr(g, -62, -80, 124, 72, 14); g.fill(); g.stroke();
      g.fillStyle = "#ec5f5f"; g.beginPath(); g.ellipse(0, -80, 62, 14, 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = "#f2c14e"; rr(g, -64, -30, 128, 20, 6); g.fill(); g.stroke(); circle(g, 0, -96, 10, "#f2c14e"); g.lineWidth = 5; g.stroke();
      g.strokeStyle = "#1b1530"; g.lineWidth = 9; g.beginPath(); g.moveTo(-18, -50); g.quadraticCurveTo(0, -66, 18, -50); g.stroke(); g.fillStyle = "#1b1530"; rr(g, -28, -54, 16, 12, 4); g.fill(); rr(g, 12, -54, 16, 12, 4); g.fill();
    } else if (kind === "werbe") { // lila Barett mit Farbklecksen
      g.fillStyle = "#7b4bb5"; g.beginPath(); g.ellipse(14, -36, 98, 32, -0.14, 0, 7); g.fill(); g.stroke();
      g.fillStyle = "#5e3592"; rr(g, -64, -22, 128, 18, 9); g.fill(); g.stroke();
      g.lineWidth = 7; g.beginPath(); g.moveTo(22, -66); g.lineTo(28, -86); g.stroke();
      circle(g, -34, -44, 10, "#ffd34d"); circle(g, 44, -30, 8, "#4fb3e8"); circle(g, 62, -52, 7, "#ff7aa2"); circle(g, -2, -56, 6, "#8fd68a");
    } else if (kind === "buch") { // Melone mit Bleistift
      g.save(); g.translate(42, -40); g.rotate(-0.55); g.fillStyle = "#f2b134"; g.lineWidth = 5; rr(g, -7, -58, 14, 62, 3); g.fill(); g.stroke(); g.fillStyle = "#f5d7b0"; g.beginPath(); g.moveTo(-7, -58); g.lineTo(0, -76); g.lineTo(7, -58); g.closePath(); g.fill(); g.stroke(); g.restore();
      g.fillStyle = "#2b2b33"; g.beginPath(); g.moveTo(-58, -18); g.bezierCurveTo(-64, -118, 64, -118, 58, -18); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#7a2b2b"; g.fillRect(-58, -38, 116, 18); g.strokeRect(-58, -38, 116, 18);
      g.fillStyle = "#2b2b33"; g.beginPath(); g.moveTo(-98, -8); g.quadraticCurveTo(-92, -28, -58, -20); g.lineTo(58, -20); g.quadraticCurveTo(92, -28, 98, -8); g.quadraticCurveTo(0, 6, -98, -8); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "rgba(255,255,255,0.22)"; g.beginPath(); g.ellipse(-26, -78, 10, 20, 0.4, 0, 7); g.fill();
    } else { // blaue Schirmmütze mit i-Abzeichen (Auskunft)
      g.fillStyle = "#2c4f8f"; g.beginPath(); g.moveTo(-60, -24); g.lineTo(-86, -76); g.quadraticCurveTo(0, -108, 86, -76); g.lineTo(60, -24); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#1d335e"; rr(g, -62, -36, 124, 20, 6); g.fill(); g.stroke();
      g.fillStyle = "#141a2b"; g.beginPath(); g.ellipse(0, -16, 74, 16, 0, 0, Math.PI); g.closePath(); g.fill(); g.stroke();
      circle(g, 0, -64, 18, "#f2c14e"); g.lineWidth = 5; g.stroke(); g.font = "900 28px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = OL; g.fillText("i", 0, -62);
    }
    g.restore();
  }
  function wings(g, x, y, s, ph) {
    [-1, 1].forEach((sd) => { g.save(); g.translate(x + sd * 50 * s, y - 40 * s); g.scale(sd * s, s); g.rotate(-0.35 + Math.sin(ph) * 0.75); g.fillStyle = "#ffffff"; g.lineWidth = 6; g.strokeStyle = OL; g.lineJoin = "round";
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(60, -80, 140, -54); g.quadraticCurveTo(112, -34, 122, -16); g.quadraticCurveTo(84, -16, 92, 6); g.quadraticCurveTo(50, 2, 52, 18); g.quadraticCurveTo(20, 14, 0, 0); g.closePath(); g.fill(); g.stroke(); g.restore(); });
  }
  function puff(g, x, y, r, a) { if (a <= 0 || r <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = "#f4f6fa"; g.strokeStyle = OL; g.lineWidth = 5; g.beginPath(); for (let i = 0; i < 5; i++) { const an = i / 5 * 6.28; g.moveTo(x + Math.cos(an) * r * 0.55 + r * 0.5, y + Math.sin(an) * r * 0.45); g.arc(x + Math.cos(an) * r * 0.55, y + Math.sin(an) * r * 0.45, r * 0.5, 0, 7); } g.fill(); g.stroke(); g.beginPath(); g.arc(x, y, r * 0.62, 0, 7); g.fill(); g.restore(); }
  function zzz(g, x, y, u, k) { if (k <= 0) return; for (let i = 0; i < 3; i++) { const t = (u * 0.5 + i / 3) % 1; g.save(); g.globalAlpha = k * Math.sin(t * Math.PI); g.translate(x + t * 120 + Math.sin(u * 2 + i) * 14, y - t * 220); g.rotate(-0.2); g.font = `900 ${50 + t * 40}px D`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 9; g.strokeStyle = OL; g.strokeText("Z", 0, 0); g.fillStyle = "#cfe3ff"; g.fillText("Z", 0, 0); g.restore(); } }
  function bricks(g, x0, y0, x1, y1, c, c2, bw = 120, bh = 48) { g.fillStyle = c; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.strokeStyle = c2; g.lineWidth = 4; for (let r = 0; y0 + r * bh < y1; r++) { const y = y0 + r * bh; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); for (let x = x0 + (r % 2) * bw / 2; x < x1; x += bw) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, Math.min(y1, y + bh)); g.stroke(); } } g.strokeStyle = OL; g.lineWidth = 8; }
  function windowBox(g, x, y, w, h, sky, deco) { g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#f4ead2"; rr(g, x - 18, y - 18, w + 36, h + 36, 10); g.fill(); g.stroke();
    const sg = g.createLinearGradient(0, y, 0, y + h); sky.forEach((c, i) => sg.addColorStop(i / (sky.length - 1), c)); g.fillStyle = sg; g.fillRect(x, y, w, h);
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); deco(); g.restore(); g.strokeRect(x, y, w, h);
    g.strokeStyle = "#f4ead2"; g.lineWidth = 12; g.beginPath(); g.moveTo(x + w / 2, y); g.lineTo(x + w / 2, y + h); g.moveTo(x, y + h * 0.45); g.lineTo(x + w, y + h * 0.45); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    g.fillStyle = "#e9dcbc"; rr(g, x - 34, y + h + 10, w + 68, 24, 6); g.fill(); g.stroke(); }
  function roofs(g, x, y, w, c, lit) { g.fillStyle = c; g.beginPath(); g.moveTo(x, y + 400); const P = [[0, 120], [0.12, 60], [0.24, 120], [0.24, 90], [0.46, 90], [0.46, 40], [0.58, 0], [0.7, 40], [0.7, 110], [0.84, 110], [0.84, 70], [1, 70]]; P.forEach(([a, b]) => g.lineTo(x + a * w, y + b)); g.lineTo(x + w, y + 400); g.closePath(); g.fill();
    if (lit) { g.fillStyle = lit; [[0.08, 150], [0.3, 130], [0.52, 90], [0.62, 140], [0.9, 120]].forEach(([a, b]) => g.fillRect(x + a * w, y + b, 16, 20)); } }
  function clock(g, x, y, r, hA, mA) { circle(g, x, y, r + 10, "#7a4a2a"); g.lineWidth = 6; g.strokeStyle = OL; g.stroke(); circle(g, x, y, r, "#fbf6e8"); g.stroke(); g.lineWidth = 4; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28; g.beginPath(); g.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); g.lineTo(x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92); g.stroke(); }
    g.lineWidth = 7; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(hA) * r * 0.5, y + Math.sin(hA) * r * 0.5); g.stroke(); g.lineWidth = 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(mA) * r * 0.78, y + Math.sin(mA) * r * 0.78); g.stroke(); circle(g, x, y, 6, OL); g.lineWidth = 8; }
  function plant(g, x, y, u, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = "#4f8a4a"; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.36 + Math.sin(u * 1.4 + i) * 0.04; g.beginPath(); g.ellipse(Math.cos(a) * 62, -70 + Math.sin(a) * 74, 18, 54, a + Math.PI / 2, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = "#c4553f"; g.beginPath(); g.moveTo(-54, -70); g.lineTo(54, -70); g.lineTo(40, 0); g.lineTo(-40, 0); g.closePath(); g.fill(); g.stroke(); g.restore(); }
  function floorBoards(g, y, c, line) { g.fillStyle = c; g.fillRect(-400, y, 2000, 900); g.strokeStyle = line; g.lineWidth = 4; for (let r = 0; r < 12; r++) { const yy = y + r * 56; g.beginPath(); g.moveTo(-400, yy); g.lineTo(1600, yy); g.stroke(); for (let c2 = -3; c2 < 12; c2++) { const xx = c2 * 210 + (r % 2) * 105; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy + 56); g.stroke(); } } g.strokeStyle = OL; g.lineWidth = 8; g.beginPath(); g.moveTo(-400, y); g.lineTo(1600, y); g.stroke(); g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(-400, y, 2000, 18); }

  // ---------- Orte ----------
  function workshop(g, u) { // Werkstatt bei Tag
    bricks(g, -400, -300, 1600, 1360, "#b9c7b5", "#a6b5a2", 130, 52);
    windowBox(g, 60, 400, 300, 340, ["#7cc4f0", "#cfeaf8"], () => { circle(g, 290, 470, 40, "#fff2a8"); g.fillStyle = "#5c9a52"; [[110, 700, 90], [210, 690, 80], [300, 720, 70]].forEach(([a, b, r]) => { g.beginPath(); g.arc(a, b, r, 0, 7); g.fill(); }); g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(140 + Math.sin(u * 0.4) * 20, 480, 50, 18, 0, 0, 7); g.fill(); });
    // Lochwand mit Werkzeug
    g.fillStyle = "#c69a63"; rr(g, 770, 420, 420, 470, 10); g.fill(); g.stroke(); for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) circle(g, 800 + c * 52, 450 + r * 50, 4, "rgba(60,35,15,0.45)");
    g.lineWidth = 7; g.strokeStyle = OL;
    g.fillStyle = "#e5243b"; rr(g, 820, 470, 26, 150, 8); g.fill(); g.stroke(); g.fillStyle = "#c9ced8"; rr(g, 826, 610, 14, 90, 4); g.fill(); g.stroke(); // Schraubendreher
    g.fillStyle = "#8a5a34"; rr(g, 900, 520, 24, 190, 8); g.fill(); g.stroke(); g.fillStyle = "#6d7380"; rr(g, 862, 480, 100, 46, 10); g.fill(); g.stroke(); // Hammer
    g.fillStyle = "#f2b134"; g.save(); g.translate(1020, 560); [-1, 1].forEach((sd) => { g.save(); g.rotate(sd * 0.18); rr(g, -10 + sd * 8, 0, 20, 130, 8); g.fill(); g.stroke(); g.restore(); }); g.fillStyle = "#6d7380"; rr(g, -18, -50, 36, 60, 10); g.fill(); g.stroke(); g.restore(); // Zange
    g.strokeStyle = "#e0703a"; g.lineWidth = 16; g.beginPath(); g.arc(1110, 560, 44, 0, 7); g.stroke(); g.lineWidth = 10; g.beginPath(); g.arc(1110, 560, 26, 0, 7); g.stroke(); g.strokeStyle = OL; g.lineWidth = 7; g.beginPath(); g.arc(1110, 560, 54, 0, 7); g.stroke(); // Kabelrolle
    g.fillStyle = "#3d9a6b"; rr(g, 820, 760, 120, 90, 8); g.fill(); g.stroke(); g.fillStyle = "#2f6f8f"; rr(g, 960, 760, 120, 90, 8); g.fill(); g.stroke(); // Kisten
    // Glühbirne an der Decke
    const sw = Math.sin(u * 1.6) * 0.05; g.save(); g.translate(600, -300); g.rotate(sw); g.strokeStyle = OL; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 560); g.stroke(); g.fillStyle = "#6d7380"; rr(g, -18, 550, 36, 34, 6); g.fill(); g.stroke();
    const lg = g.createRadialGradient(0, 610, 10, 0, 610, 420); lg.addColorStop(0, "rgba(255,236,160,0.55)"); lg.addColorStop(1, "rgba(255,236,160,0)"); g.fillStyle = lg; g.fillRect(-420, 190, 840, 840); circle(g, 0, 612, 34, "#fff3b0"); g.lineWidth = 6; g.stroke(); g.restore();
    floorBoards(g, 1360, "#8d8f94", "rgba(40,40,50,0.25)");
    // Werkbank rechts vorn
    g.fillStyle = "#6b4226"; [870, 1200].forEach((x) => { g.fillRect(x - 16, 1150, 32, 300); g.strokeRect(x - 16, 1150, 32, 300); });
    g.fillStyle = "#b07a4c"; rr(g, 830, 1120, 460, 46, 8); g.fill(); g.stroke();
    g.fillStyle = "#c0392b"; rr(g, 900, 1040, 180, 82, 10); g.fill(); g.stroke(); g.fillStyle = "#9b2c20"; rr(g, 940, 1012, 100, 30, 8); g.fill(); g.stroke(); // Werkzeugkiste
    // Kabeltrommel links
    g.fillStyle = "#8a5a34"; g.beginPath(); g.arc(150, 1330, 110, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#e0703a"; g.beginPath(); g.arc(150, 1330, 80, 0, 7); g.fill(); g.stroke(); g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 4; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(150, 1330, 30 + i * 13, 0, 7); g.stroke(); } circle(g, 150, 1330, 20, "#6b4226"); g.strokeStyle = OL; g.lineWidth = 6; g.stroke(); g.lineWidth = 8;
  }
  function hallway(g, u) { // morgens: Flur beim Kunden, Sicherungskasten
    g.fillStyle = "#f3e3b3"; g.fillRect(-400, -300, 2000, 1700); g.fillStyle = "#ead39a"; for (let i = -6; i < 30; i++) g.fillRect(i * 70, -300, 26, 1700);
    windowBox(g, 770, 420, 300, 380, ["#f7a76c", "#ffd9a0", "#fff2d6"], () => { circle(g, 920, 760, 70, "#ffb347"); roofs(g, 770, 690, 300, "#6b4f6a", null); });
    g.fillStyle = "#c4553f"; [[740, 1], [1100, -1]].forEach(([x, sd]) => { g.beginPath(); g.moveTo(x - sd * 0, 390); g.quadraticCurveTo(x + sd * 30, 620, x - sd * 4, 840); g.lineTo(x + sd * 50, 840); g.quadraticCurveTo(x + sd * 70, 620, x + sd * 50, 390); g.closePath(); g.fill(); g.stroke(); });
    // Sicherungskasten (Tür offen)
    const bx = 110, by = 640, bw = 290, bh = 440; g.fillStyle = "#c9ced8"; rr(g, bx, by, bw, bh, 12); g.fill(); g.stroke(); g.fillStyle = "#3a3f48"; rr(g, bx + 20, by + 20, bw - 40, bh - 40, 8); g.fill(); g.stroke();
    for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const x = bx + 40 + c * 37, y = by + 50 + r * 92; g.fillStyle = "#f4f4f0"; g.lineWidth = 4; rr(g, x, y, 28, 60, 4); g.fill(); g.stroke(); const up = (r * 7 + c * 3) % 5 !== 0 || (r === 1 && c === 3 && Math.sin(u * 9) > 0); g.fillStyle = r === 1 && c === 3 ? "#e5243b" : "#1b1530"; rr(g, x + 6, up ? y + 8 : y + 30, 16, 22, 3); g.fill(); }
    g.lineWidth = 8; g.fillStyle = "#b3b9c4"; g.beginPath(); g.moveTo(bx, by); g.lineTo(bx - 80, by + 40); g.lineTo(bx - 80, by + bh - 40); g.lineTo(bx, by + bh); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#ffd34d"; g.beginPath(); g.moveTo(bx - 40, by + 140); g.lineTo(bx - 10, by + 200); g.lineTo(bx - 70, by + 200); g.closePath(); g.fill(); g.lineWidth = 5; g.stroke(); bolt(g, bx - 40, by + 182, 0.4, OL); g.lineWidth = 8;
    // Kabel aus dem Kasten
    g.strokeStyle = "#3a3f48"; g.lineWidth = 10; g.beginPath(); g.moveTo(bx + bw / 2, by + bh); g.quadraticCurveTo(bx + bw / 2 + 20, by + bh + 160, bx + bw + 60, 1360); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    // Garderobe, Spiegel
    g.fillStyle = "#c9a14a"; g.beginPath(); g.ellipse(560, 500, 70, 90, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#dceef7"; g.beginPath(); g.ellipse(560, 500, 52, 70, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(540, 476, 8, 26, 0.4, 0, 7); g.fill();
    floorBoards(g, 1360, "#c08a52", "rgba(90,50,20,0.3)"); plant(g, 1080, 1400, u, 1.1);
    g.fillStyle = "#3d6fb0"; g.beginPath(); g.ellipse(560, 1430, 420, 50, 0, 0, 7); g.fill(); g.stroke();
  }
  function office(g, u) { // mittags: Büro mit zwei Telefonen
    g.fillStyle = "#cfe3ef"; g.fillRect(-400, -300, 2000, 1700); g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 3; for (let i = -6; i < 30; i++) { g.beginPath(); g.moveTo(i * 80, -300); g.lineTo(i * 80, 1400); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8;
    windowBox(g, 90, 360, 300, 320, ["#4aa8e8", "#bfe4fa"], () => { circle(g, 240, 410, 46, "#fff2a8"); g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.ellipse(160 + Math.sin(u * 0.5) * 20, 560, 60, 20, 0, 0, 7); g.ellipse(320, 600, 50, 16, 0, 0, 7); g.fill(); roofs(g, 90, 590, 300, "#7d93b0", null); });
    clock(g, 900, 430, 66, -Math.PI / 2 - 0.02, -Math.PI / 2 + u * 0.3);
    // Pinnwand
    g.fillStyle = "#c89b62"; rr(g, 730, 560, 380, 250, 8); g.fill(); g.stroke(); [["#ffe873", 760, 590], ["#ffb3c7", 880, 600], ["#9fd8ff", 1000, 590], ["#b9f0a8", 800, 700], ["#ffe873", 960, 700]].forEach(([c, x, y], i) => { g.save(); g.translate(x + 40, y + 40); g.rotate((i - 2) * 0.06); fillRR(g, -40, -40, 80, 80, 3, c); g.lineWidth = 4; g.strokeRect(-40, -40, 80, 80); circle(g, 0, -30, 6, "#e5243b"); g.restore(); }); g.lineWidth = 8;
    // Aktenschrank
    g.fillStyle = "#8aa39a"; rr(g, 1020, 860, 240, 500, 8); g.fill(); g.stroke(); for (let i = 0; i < 4; i++) { rr(g, 1036, 880 + i * 118, 208, 104, 6); g.stroke(); g.fillStyle = "#c9ced8"; rr(g, 1110, 920 + i * 118, 60, 16, 6); g.fill(); g.stroke(); g.fillStyle = "#8aa39a"; }
    floorBoards(g, 1360, "#7d8aa0", "rgba(40,50,70,0.3)");
  }
  function phone(g, x, y, u, ring) { // Telefon mit Wählscheibe auf dem Tisch (Gabel leer)
    const sh = ring ? Math.sin(u * 70) * 6 : 0; g.save(); g.translate(x + sh, y - Math.abs(sh) * 0.5); g.lineWidth = 7; g.strokeStyle = OL;
    g.fillStyle = "#e5243b"; g.beginPath(); g.moveTo(-90, 0); g.lineTo(-70, -90); g.lineTo(70, -90); g.lineTo(90, 0); g.closePath(); g.fill(); g.stroke();
    circle(g, 0, -44, 36, "#fbf6e8"); g.stroke(); for (let i = 0; i < 8; i++) { const a = -2.2 + i * 0.55; circle(g, Math.cos(a) * 24, -44 + Math.sin(a) * 24, 6, "#9aa1ab"); } circle(g, 0, -44, 9, "#e5243b");
    g.fillStyle = "#b81c2c"; rr(g, -76, -110, 30, 24, 6); g.fill(); g.stroke(); rr(g, 46, -110, 30, 24, 6); g.fill(); g.stroke();
    if (ring) { g.strokeStyle = OL; g.lineWidth = 6; [-1, 1].forEach((sd) => { for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(sd * (100 + i * 4), -100 + i * 26 - 20); g.lineTo(sd * (136 + i * 10), -116 + i * 30 - 20); g.stroke(); } }); }
    g.restore();
  }
  function receiver(g, x, y, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#e5243b"; rr(g, -14, -70, 28, 140, 12); g.fill(); g.stroke(); rr(g, -26, -80, 40, 34, 10); g.fill(); g.stroke(); rr(g, -26, 46, 40, 34, 10); g.fill(); g.stroke(); g.restore(); }
  function coil(g, x0, y0, x1, y1, n = 16) { g.save(); g.strokeStyle = "#b81c2c"; g.lineWidth = 6; g.beginPath(); for (let i = 0; i <= n * 6; i++) { const k = i / (n * 6), x = lerp(x0, x1, k), y = lerp(y0, y1, k) + Math.sin(k * Math.PI) * 60; const a = k * n * 6.28; const px = x + Math.cos(a) * 12, py = y + Math.sin(a) * 12; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); g.restore(); }
  function desk(g, c, top = 1140) { g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = SK.mix(c, "#000000", 0.2); rr(g, 120, top + 30, 940, 330, 10); g.fill(); g.stroke(); g.fillStyle = c; rr(g, 90, top, 1000, 46, 10); g.fill(); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 5; rr(g, 170, top + 80, 360, 120, 8); g.stroke(); rr(g, 650, top + 80, 360, 120, 8); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8; circle(g, 350, top + 140, 10, "#e0b040"); circle(g, 830, top + 140, 10, "#e0b040"); }
  function street(g, u, prog) { // nachmittags: Mauer, Plakat
    const sg = g.createLinearGradient(0, -300, 0, 900); sg.addColorStop(0, "#5bb4ee"); sg.addColorStop(1, "#cdeefc"); g.fillStyle = sg; g.fillRect(-400, -300, 2000, 1300);
    g.fillStyle = "rgba(255,255,255,0.95)"; [[200, 260], [820, 200]].forEach(([x, y], i) => { const xx = x + Math.sin(u * 0.3 + i) * 30; g.beginPath(); g.ellipse(xx, y, 90, 30, 0, 0, 7); g.ellipse(xx + 50, y - 20, 60, 30, 0, 0, 7); g.fill(); });
    // Häuser im Hintergrund
    [["#e8b04a", -120, 300], ["#d9705a", 180, 360], ["#8fb3d9", 470, 280], ["#9fcf8f", 760, 340], ["#e8c9a0", 1040, 300]].forEach(([c, x, y]) => { g.fillStyle = c; rr(g, x, y, 290, 400, 6); g.fill(); g.stroke(); g.fillStyle = "#6b3f22"; g.beginPath(); g.moveTo(x - 16, y); g.lineTo(x + 145, y - 90); g.lineTo(x + 306, y); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#fbf6e8"; for (let r = 0; r < 2; r++) for (let k = 0; k < 3; k++) { rr(g, x + 30 + k * 86, y + 40 + r * 100, 56, 70, 4); g.fill(); g.lineWidth = 5; g.stroke(); g.lineWidth = 8; } });
    bricks(g, -400, 560, 1600, 1360, "#b5523b", "#8f3d2b", 110, 46); g.fillStyle = "#8f8a84"; g.fillRect(-400, 530, 2000, 40); g.strokeRect(-400, 530, 2000, 40);
    // alte Plakatreste
    [["#e8d8b0", -40, 700, 220, 300, 0.05], ["#9fc9e0", 210, 760, 160, 220, -0.06]].forEach(([c, x, y, w, h, r]) => { g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(r); g.globalAlpha = 0.85; g.fillStyle = c; g.beginPath(); g.moveTo(-w / 2, -h / 2); g.lineTo(w / 2, -h / 2); g.lineTo(w / 2, h / 2 - 40); g.lineTo(w / 4, h / 2 - 10); g.lineTo(0, h / 2 - 50); g.lineTo(-w / 2, h / 2); g.closePath(); g.fill(); g.globalAlpha = 1; g.lineWidth = 5; g.stroke(); g.restore(); }); g.lineWidth = 8;
    // neues Plakat, wird von oben angeklebt
    const px = 730, py = 620, pw = 320, ph = 440, vh = ph * prog; if (vh > 4) { g.save(); g.beginPath(); g.rect(px - 10, py - 10, pw + 20, vh + 10); g.clip();
      g.fillStyle = "#ffd34d"; g.fillRect(px, py, pw, ph); g.strokeRect(px, py, pw, ph); bolt(g, px + pw / 2, py + 190, 2.6, "#1b1530"); bolt(g, px + pw / 2 - 8, py + 182, 2.3, "#ffffff");
      g.fillStyle = "#1b1530"; g.font = "900 30px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ELEKTRO", px + pw / 2, py + 50); g.font = "900 74px D"; g.fillText("JONAS", px + pw / 2, py + 370); g.restore();
      if (prog < 1) { g.fillStyle = "#f2c54a"; rr(g, px - 14, py + vh - 22, pw + 28, 44, 22); g.fill(); g.stroke(); } }
    // Laterne
    g.fillStyle = "#2f3d4a"; g.fillRect(70, 300, 22, 1080); g.strokeRect(70, 300, 22, 1080); g.beginPath(); g.moveTo(40, 300); g.lineTo(122, 300); g.lineTo(100, 230); g.lineTo(62, 230); g.closePath(); g.fill(); g.stroke();
    // Taube auf der Mauer
    g.save(); g.translate(330, 530); g.fillStyle = "#9aa3b5"; g.beginPath(); g.ellipse(0, -26, 34, 22, 0, 0, 7); g.fill(); g.stroke(); circle(g, 30, -48, 16, "#9aa3b5"); g.lineWidth = 5; g.stroke(); circle(g, 34, -51, 4, OL); g.fillStyle = "#f2b134"; g.beginPath(); g.moveTo(44, -46); g.lineTo(58, -42); g.lineTo(44, -38); g.closePath(); g.fill(); g.restore(); g.lineWidth = 8;
    g.fillStyle = "#a9a49c"; g.fillRect(-400, 1360, 2000, 800); g.strokeStyle = "rgba(60,55,50,0.35)"; g.lineWidth = 4; for (let c = -4; c < 14; c++) { g.beginPath(); g.moveTo(c * 160, 1360); g.lineTo(c * 160 - 60, 2100); g.stroke(); } g.beginPath(); g.moveTo(-400, 1520); g.lineTo(1600, 1520); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8; g.beginPath(); g.moveTo(-400, 1360); g.lineTo(1600, 1360); g.stroke();
  }
  function bucket(g, x, y) { g.save(); g.translate(x, y); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = "#c9ced8"; g.beginPath(); g.moveTo(-60, -120); g.lineTo(60, -120); g.lineTo(46, 0); g.lineTo(-46, 0); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#f4f1e6"; g.beginPath(); g.ellipse(0, -120, 60, 14, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(0, -120, 64, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); g.restore(); }
  function study(g, u) { // abends: Arbeitszimmer
    g.fillStyle = "#7a3b3b"; g.fillRect(-400, -300, 2000, 1700); for (let i = -6; i < 24; i++) for (let r = 0; r < 18; r++) { g.fillStyle = "rgba(255,210,170,0.10)"; g.save(); g.translate(i * 90 + (r % 2) * 45, r * 90 - 200); g.rotate(0.785); g.fillRect(-8, -8, 16, 16); g.restore(); }
    windowBox(g, 80, 380, 300, 340, ["#3b2a6b", "#c4567a", "#f7a35c"], () => { circle(g, 230, 690, 50, "#ffcf7a"); roofs(g, 80, 620, 300, "#2a1d3a", "#ffd77a"); });
    // Ordnerregal
    g.fillStyle = "#5a3520"; rr(g, 760, 360, 420, 520, 8); g.fill(); g.stroke(); const C = ["#2f6f8f", "#e5243b", "#3d9a6b", "#f2b134", "#8e5bd6", "#e0703a"];
    for (let r = 0; r < 3; r++) { g.fillStyle = "#3f2414"; g.fillRect(776, 380 + r * 166, 388, 150); for (let k = 0; k < 9; k++) { g.fillStyle = C[(k + r * 2) % 6]; const lean = (k === 8 && r === 1) ? 0.25 : 0; g.save(); g.translate(790 + k * 42, 528 + r * 166); g.rotate(lean); rr(g, 0, -136, 36, 136, 4); g.fill(); g.lineWidth = 5; g.stroke(); g.fillStyle = "#fbf6e8"; g.fillRect(8, -110, 20, 30); circle(g, 18, -30, 7, "#fbf6e8"); g.restore(); } } g.lineWidth = 8;
    floorBoards(g, 1360, "#5a3a26", "rgba(20,10,5,0.35)");
  }
  function paperPile(g, x, y, n, u, lean) { for (let i = 0; i < n; i++) { const yy = y - i * 13, xx = x + Math.sin(i * 1.7) * 10 + i * lean + Math.sin(u * 3 + i * 0.3) * i * 0.25; g.fillStyle = i % 3 ? "#fbf6e8" : "#f1e6c8"; g.lineWidth = 4; g.strokeStyle = OL; g.save(); g.translate(xx, yy); g.rotate(Math.sin(i * 2.3) * 0.05); rr(g, -90, -12, 180, 14, 2); g.fill(); g.stroke(); g.restore(); } g.lineWidth = 8; }
  function adder(g, x, y, u, k) { // Rechenmaschine mit Papierstreifen
    g.save(); g.translate(x, y); g.lineWidth = 7; g.strokeStyle = OL;
    const len = 160 + k * 420; g.fillStyle = "#fbf6e8"; g.beginPath(); g.moveTo(-26, -150); g.lineTo(26, -150); g.quadraticCurveTo(40, -60, 70, 10); g.quadraticCurveTo(110, 40 + len * 0.4, 60 + Math.sin(u * 3) * 20, len); g.lineTo(10 + Math.sin(u * 3) * 20, len); g.quadraticCurveTo(60, 40 + len * 0.4, 20, 10); g.quadraticCurveTo(-10, -60, -26, -150); g.closePath(); g.fill(); g.lineWidth = 4; g.stroke();
    g.strokeStyle = "rgba(60,60,80,0.5)"; g.lineWidth = 3; for (let i = 0; i < len / 22; i++) { const yy = -120 + i * 22; if (yy > len - 10) break; const xx = yy < 0 ? 0 : yy < 30 ? 40 : 70 + Math.sin(yy * 0.01) * 10; g.beginPath(); g.moveTo(xx - 12, yy); g.lineTo(xx + 12, yy); g.stroke(); }
    g.strokeStyle = OL; g.lineWidth = 7; g.fillStyle = "#4a5568"; g.beginPath(); g.moveTo(-110, 0); g.lineTo(-90, -110); g.lineTo(90, -110); g.lineTo(110, 0); g.closePath(); g.fill(); g.stroke();
    circle(g, 0, -150, 22, "#c9ced8"); g.stroke(); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const pr = Math.sin(u * 22 + r * 2 + c * 3) > 0.7 ? 3 : 0; fillRR(g, -70 + c * 38, -90 + r * 28 + pr, 28, 20, 5, r === 2 && c === 3 ? "#e5243b" : "#f4f1e6"); g.lineWidth = 3; g.stroke(); }
    g.save(); g.translate(120, -40); g.rotate(-0.4 + Math.sin(u * 22) * 0.3); g.fillStyle = "#c9ced8"; rr(g, -6, -80, 12, 80, 4); g.fill(); g.lineWidth = 4; g.stroke(); circle(g, 0, -84, 14, "#e5243b"); g.stroke(); g.restore();
    g.restore(); g.lineWidth = 8;
  }
  function lamp(g, x, y) { g.save(); g.translate(x, y); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = "#c9a14a"; g.beginPath(); g.ellipse(0, 0, 60, 14, 0, 0, 7); g.fill(); g.stroke(); g.fillRect(-7, -150, 14, 150); g.strokeRect(-7, -150, 14, 150);
    g.fillStyle = "#2f7d5a"; g.beginPath(); g.moveTo(-110, -150); g.quadraticCurveTo(0, -210, 110, -150); g.lineTo(90, -130); g.lineTo(-90, -130); g.closePath(); g.fill(); g.stroke();
    const lg = g.createRadialGradient(0, -120, 10, 0, 0, 340); lg.addColorStop(0, "rgba(255,226,150,0.5)"); lg.addColorStop(1, "rgba(255,226,150,0)"); g.fillStyle = lg; g.beginPath(); g.moveTo(-90, -130); g.lineTo(90, -130); g.lineTo(320, 80); g.lineTo(-320, 80); g.closePath(); g.fill(); g.restore(); }
  function nightHall(g, u) { // nachts: Haustür
    g.fillStyle = "#2d3550"; g.fillRect(-400, -300, 2000, 1700); g.strokeStyle = "rgba(255,255,255,0.05)"; g.lineWidth = 3; for (let i = -6; i < 30; i++) { g.beginPath(); g.moveTo(i * 70, -300); g.lineTo(i * 70, 1400); g.stroke(); }
    g.strokeStyle = OL; g.lineWidth = 8;
    // offene Tür, draußen Nacht
    const dx = 60, dy = 520, dw = 340, dh = 850; g.fillStyle = "#4a3324"; rr(g, dx - 30, dy - 30, dw + 60, dh + 40, 8); g.fill(); g.stroke();
    const sk = g.createLinearGradient(0, dy, 0, dy + dh); sk.addColorStop(0, "#0d1330"); sk.addColorStop(1, "#2a2f5a"); g.fillStyle = sk; g.fillRect(dx, dy, dw, dh);
    g.save(); g.beginPath(); g.rect(dx, dy, dw, dh); g.clip(); for (let i = 0; i < 14; i++) circle(g, dx + rnd(i * 3.3) * dw, dy + 20 + rnd(i * 5.1) * 300, 2 + rnd(i) * 3, `rgba(255,248,210,${0.5 + 0.5 * Math.sin(u * 3 + i * 2)})`);
    circle(g, dx + 250, dy + 110, 40, "#fff4cf"); circle(g, dx + 268, dy + 100, 34, "#0f1633"); roofs(g, dx - 20, dy + 380, dw + 40, "#141a33", "#ffd77a");
    g.fillStyle = "#3a3f48"; g.fillRect(dx, dy + dh - 60, dw, 60); g.restore(); g.strokeRect(dx, dy, dw, dh);
    g.fillStyle = "#6b4a32"; g.beginPath(); g.moveTo(dx + dw, dy); g.lineTo(dx + dw + 110, dy - 30); g.lineTo(dx + dw + 110, dy + dh + 30); g.lineTo(dx + dw, dy + dh); g.closePath(); g.fill(); g.stroke(); circle(g, dx + dw + 88, dy + dh * 0.5, 10, "#e0b040"); g.lineWidth = 5; g.stroke(); g.lineWidth = 8;
    // Mondlicht auf dem Boden
    floorBoards(g, 1360, "#3b2a20", "rgba(0,0,0,0.35)"); g.fillStyle = "rgba(190,210,255,0.16)"; g.beginPath(); g.moveTo(dx, 1360); g.lineTo(dx + dw, 1360); g.lineTo(dx + dw + 260, 1700); g.lineTo(dx + 120, 1700); g.closePath(); g.fill();
    clock(g, 930, 540, 60, -Math.PI / 2 + 3 / 12 * 6.28, -Math.PI / 2 + u * 0.4);
    // Garderobe mit Jacken
    g.fillStyle = "#5a3520"; rr(g, 820, 720, 320, 30, 6); g.fill(); g.stroke(); [["#3d9a6b", 870], ["#e0703a", 980], ["#5f7fa8", 1090]].forEach(([c, x]) => { g.fillStyle = c; g.beginPath(); g.moveTo(x - 40, 760); g.lineTo(x + 40, 760); g.lineTo(x + 56, 1040); g.lineTo(x - 56, 1040); g.closePath(); g.fill(); g.stroke(); circle(g, x, 745, 9, "#e0b040"); });
  }
  function candle(q, x, y, u) { q.save(); q.translate(x, y); q.lineWidth = 5; q.strokeStyle = OL; q.fillStyle = "#c9a14a"; q.beginPath(); q.ellipse(0, 10, 44, 12, 0, 0, 7); q.fill(); q.stroke(); q.fillStyle = "#fbf6e8"; rr(q, -14, -70, 28, 80, 6); q.fill(); q.stroke();
    const f = 1 + 0.15 * Math.sin(u * 13); q.fillStyle = "#ffb000"; q.beginPath(); q.ellipse(0, -90, 10 * f, 20 * f, 0, 0, 7); q.fill(); circle(q, 0, -86, 5, "#fff4cf");
    const lg = q.createRadialGradient(0, -90, 5, 0, -90, 230); lg.addColorStop(0, "rgba(255,200,110,0.45)"); lg.addColorStop(1, "rgba(255,200,110,0)"); q.fillStyle = lg; q.fillRect(-240, -330, 480, 480); q.restore(); }
  function bedroom(g, u, tl) { // Schlafzimmer, tl 0..1 Zeitraffer der Nacht
    g.fillStyle = "#26305a"; g.fillRect(-400, -300, 2000, 1700); for (let i = 0; i < 70; i++) { const x = rnd(i * 1.3) * 1700 - 300, y = rnd(i * 2.7) * 1500 - 200; g.fillStyle = "rgba(255,240,200,0.12)"; g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
    const nk = cl(tl * 1.1); windowBox(g, 480, 360, 380, 380, [SK.mix("#0d1330", "#f7a76c", nk * nk), SK.mix("#2a2f5a", "#ffe2b0", nk * nk)], () => {
      for (let i = 0; i < 12; i++) circle(g, 480 + rnd(i * 3.3) * 380, 380 + rnd(i * 5.1) * 220, 2 + rnd(i) * 3, `rgba(255,248,210,${(1 - nk) * (0.5 + 0.5 * Math.sin(u * 3 + i * 2))})`);
      const ma = lerp(-0.3, 1.5, tl); const mx = 670 - Math.cos(ma) * 220, my = 700 - Math.sin(ma + 0.3) * 260; circle(g, mx, my, 40, "#fff4cf"); circle(g, mx + 16, my - 8, 34, SK.mix("#0f1633", "#f7b080", nk * nk));
      if (nk > 0.6) circle(g, 860 - (nk - 0.6) * 200, 740 - (nk - 0.6) * 300, 46, "#ffcf6a");
      roofs(g, 470, 610, 400, "#141a33", nk > 0.7 ? null : "#ffd77a"); });
    g.fillStyle = "#8e5bd6"; [[460, 1], [880, -1]].forEach(([x, sd]) => { g.beginPath(); g.moveTo(x, 330); g.quadraticCurveTo(x + sd * 30, 560, x - sd * 4, 780); g.lineTo(x + sd * 46, 780); g.quadraticCurveTo(x + sd * 66, 560, x + sd * 46, 330); g.closePath(); g.fill(); g.stroke(); });
    // Wecker auf der Fensterbank, Zeiger rasen
    const ca = tl * 6.28 * 7; clock(g, 780, 700, 34, -Math.PI / 2 + ca / 12 + 0.4, -Math.PI / 2 + ca); g.fillStyle = "#e5243b"; [-1, 1].forEach((sd) => { g.beginPath(); g.arc(780 + sd * 30, 660, 14, 0, 7); g.fill(); g.lineWidth = 5; g.stroke(); }); g.lineWidth = 8;
    // Bild an der Wand
    g.fillStyle = "#c9a14a"; rr(g, 140, 470, 200, 160, 8); g.fill(); g.stroke(); g.fillStyle = "#9fd3ff"; g.fillRect(160, 490, 160, 120); g.strokeRect(160, 490, 160, 120); g.fillStyle = "#4f8a4a"; g.beginPath(); g.moveTo(160, 610); g.lineTo(220, 540); g.lineTo(260, 580); g.lineTo(290, 550); g.lineTo(320, 610); g.closePath(); g.fill();
    floorBoards(g, 1360, "#5a3a26", "rgba(0,0,0,0.3)"); g.fillStyle = "#3d6fb0"; g.beginPath(); g.ellipse(600, 1460, 520, 60, 0, 0, 7); g.fill(); g.stroke();
  }
  function bed(g, u, front) {
    g.lineWidth = 8; g.strokeStyle = OL;
    if (!front) { g.fillStyle = "#8a5531"; rr(g, 150, 820, 90, 560, 14); g.fill(); g.stroke(); circle(g, 195, 810, 30, "#a8693e"); g.stroke(); // Kopfteil
      g.fillStyle = "#fbf6e8"; rr(g, 230, 1180, 800, 110, 20); g.fill(); g.stroke(); // Matratze
      g.fillStyle = "#ffffff"; rr(g, 250, 1150, 230, 84, 40); g.fill(); g.stroke(); return; }
    // Decke (Patchwork)
    const br = Math.sin(u * 2.2) * 6; g.save(); g.beginPath(); g.moveTo(450, 1150 - br); g.quadraticCurveTo(700, 1110 - br, 1010, 1150); g.lineTo(1030, 1320); g.lineTo(440, 1320); g.closePath(); g.fillStyle = "#e5243b"; g.fill(); g.clip();
    const C = ["#e5243b", "#f2b134", "#3d9a6b", "#2f6f8f", "#e85d75", "#8e5bd6"]; for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) { g.fillStyle = C[(r * 3 + c) % 6]; g.fillRect(440 + c * 76, 1100 + r * 60, 76, 60); } g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 3; g.setLineDash([10, 8]); for (let c = 0; c < 9; c++) { g.beginPath(); g.moveTo(440 + c * 76, 1100); g.lineTo(440 + c * 76, 1340); g.stroke(); } for (let r = 0; r < 5; r++) { g.beginPath(); g.moveTo(440, 1100 + r * 60); g.lineTo(1040, 1100 + r * 60); g.stroke(); } g.setLineDash([]); g.restore();
    g.strokeStyle = OL; g.lineWidth = 8; g.beginPath(); g.moveTo(450, 1150 - br); g.quadraticCurveTo(700, 1110 - br, 1010, 1150); g.lineTo(1030, 1320); g.lineTo(440, 1320); g.closePath(); g.stroke();
    g.fillStyle = "#8a5531"; rr(g, 990, 1060, 70, 320, 14); g.fill(); g.stroke(); circle(g, 1025, 1052, 26, "#a8693e"); g.stroke(); // Fußteil mit Pfosten
    g.fillStyle = "#6b4226"; rr(g, 230, 1286, 800, 40, 10); g.fill(); g.stroke(); g.fillRect(250, 1320, 26, 70); g.strokeRect(250, 1320, 26, 70); g.fillRect(990, 1320, 26, 70);
    // Pantoffeln
    [[600, 1420], [680, 1426]].forEach(([x, y]) => { g.fillStyle = "#b8343a"; g.beginPath(); g.ellipse(x, y, 46, 18, 0, 0, 7); g.fill(); g.stroke(); circle(g, x + 26, y - 14, 12, "#fff4e2"); g.lineWidth = 4; g.stroke(); g.lineWidth = 8; });
  }

  // ---------- Hutturm ----------
  function stackY(order, kind) { let y = 0; for (const k of order) { if (k === kind) return y; y -= HH[k] * 0.84; } return y; }
  function tower(g, u, T, o) { // o: {x, base, wob, only (nur Helm), fly (0..), sq}
    const S = T.ord; let ci = 0; for (let i = 0; i < S.length; i++) if (u >= S[i].t) ci = i;
    const cur = S[ci], prev = S[Math.max(0, ci - 1)], k = ci ? inOut(seg(u, cur.t, cur.t + 0.36)) : 1;
    const drawOrder = cur.order;
    drawOrder.forEach((kind, j) => {
      if (o.only && kind !== "helm" && !o.fly) return;
      let y = lerp(stackY(prev.order, kind), stackY(cur.order, kind), k), x = 0, rot = 0;
      if (ci && kind === cur.moved) { const a = Math.sin(k * Math.PI); x += a * 190; y -= a * 140; rot = a * 0.5; }
      const jj = drawOrder.indexOf(kind); x += o.wob * Math.sin(u * 5.2 + 0.4) * jj * jj * 3.2; rot += o.wob * Math.sin(u * 5.2) * 0.035 * jj;
      // Fall beim Start
      let sq = 1; if (T.TL) { const i = KINDS.indexOf(kind), tl = T.TL[i]; if (u < tl - 0.5) return; if (u < tl) { const f = cl((u - (tl - 0.5)) / 0.5); y -= (i === 0 ? 560 : 1100) * (1 - f * f); rot += (1 - f) * (i % 2 ? 0.5 : -0.5); } else sq = 1 - 0.2 * Math.sin(Math.PI * seg(u, tl, tl + 0.22)); }
      // Davonfliegen
      if (o.fly && kind !== "helm") { const i = KINDS.indexOf(kind), f = cl((u - o.fly - i * 0.12) / 1.1); if (f > 0) { const e = f * f; x += e * (620 + i * 90) + Math.sin(f * 9 + i) * 30 * f; y -= e * (1300 + i * 120); rot += Math.sin(u * 7 + i) * 0.2 * f; wings(g, o.x + x, o.base + y, 0.9, u * 26 + i); } }
      hat(g, kind, o.x + x, o.base + y, 1, rot, sq);
    });
  }

  TYPES.h_huete = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 2.9, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.fuenf = f(/^fünf/, 0, 2.4); T.morgens = f(/^morgens/, T.fuenf, 3.9); T.mittags = f(/^mittags/, T.morgens, 5.4); T.nachm = f(/^nachmittags/, T.mittags, 7.0);
      T.abends = f(/^abends/, T.nachm, 8.9); T.nachts = f(/^nachts/, T.abends, 10.5); T.sein = f(/^sein$/, T.nachts, 12.2); T.qualmt = f(/^qualmt/, T.sein, 12.7);
      T.heute = f(/^heute/, T.qualmt, 14.0); T.einen = f(/^einen/, T.heute, 15.07); T.seinen = f(/^seinen/, T.einen, 16.1); T.und = f(/^und$/, T.seinen, 17.3);
      T.schlaeft = f(/^schläft/, T.und, 17.4); T.durch = f(/^durch/, T.schlaeft, 18.2); T.denn = f(/^denn/, T.durch, 19.17);
      T.B = [T.morgens - 0.12, T.mittags - 0.12, T.nachm - 0.1, T.abends - 0.12, T.nachts - 0.12, T.heute - 0.15, T.und - 0.1];
      const last = Math.min(T.fuenf, T.B[0] - 0.7); T.TL = KINDS.map((_, i) => 0.3 + i * (last - 0.3) / 4);
      let ord = KINDS.slice(); T.ord = [{ t: 0, order: ord }]; ["helm", "tel", "werbe", "buch", "ausk"].forEach((kd, i) => { ord = ord.filter((k) => k !== kd).concat([kd]); T.ord.push({ t: T.B[i] + 0.05, order: ord, moved: kd }); });
      p._T = T; },
    draw(g, u, d, p) {
      const T = p._T, B = T.B; let ph = 0; B.forEach((b, i) => { if (u >= b) ph = i + 1; });
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      g.fillStyle = "#1d120c"; g.fillRect(0, 0, W, H);
      const base = FL - 545 - 44;
      let c, wob = 0.25, outfit = WORK, pose = {}, red = 0, bobY = 0;
      if (ph === 0 || ph === 6) { // Werkstatt
        if (ph === 0) { c = SK.cam([K(0, 1.38, 600, 820), K(T.TL[2], 1.3, 600, 860), K(T.B[0], 1.18, 600, 960)], u); const lastL = T.TL[4];
          const n = T.TL.filter((t) => u >= t).length; pose = { eyes: n >= 4 ? "wide" : "dot", mouth: n >= 5 ? "flat" : n >= 2 ? "o" : "smile", brow: n >= 5 ? -0.5 : 0, aL: 1.2, aR: 1.2 };
          bobY = T.TL.reduce((a, t) => a + Math.sin(Math.PI * seg(u, t, t + 0.2)) * 14, 0); wob = 0.15 + seg(u, lastL, lastL + 0.3) * 0.4; }
        else { c = SK.cam([K(B[5], 1.25, 600, 940), K(T.einen, 1.12, 640, 900), K(T.seinen, 1.3, 600, 900), K(B[6], 1.32, 600, 900)], u);
          const tap = seg(u, T.seinen - 0.1, T.seinen + 0.2) * (1 - seg(u, B[6] - 0.5, B[6] - 0.2));
          pose = { eyes: u > T.einen + 0.3 ? "happy" : "dot", mouth: u > T.einen + 0.3 ? "grin" : "smile", look: u < T.einen + 0.6 ? 0.5 : 0, aL: 1.2, aR: lerp(1.2, -1.15, tap), eR: lerp(0, -1.0, tap) }; wob = u < T.einen ? 0.3 : 0; }
        g.save(); SK.apply(g, c); workshop(g, u);
      } else if (ph === 1) { c = SK.cam([K(B[0], 1.32, 560, 900), K(B[1], 1.2, 540, 960)], u); g.save(); SK.apply(g, c); hallway(g, u);
        pose = { look: -0.9, brow: 0.4, mouth: "flat", aL: 0.15 + Math.sin(u * 14) * 0.05, eL: -0.25, aR: 1.2,
          hold: (q, hR, hL) => { q.save(); q.translate(hL[0], hL[1]); q.rotate(Math.PI + 0.1); q.lineWidth = 6; q.strokeStyle = OL; q.fillStyle = "#c9ced8"; rr(q, -6, -8, 92, 12, 4); q.fill(); q.stroke(); q.fillStyle = "#e5243b"; rr(q, -76, -16, 76, 28, 12); q.fill(); q.stroke(); q.restore(); } };
      } else if (ph === 2) { c = SK.cam([K(B[1], 1.28, 600, 900), K(B[2], 1.16, 600, 960)], u); g.save(); SK.apply(g, c); office(g, u);
        pose = { eyes: "wide", mouth: Math.sin(u * 16) > 0 ? "open" : "o", brow: -0.5, red: 0.3, aR: -0.6, eR: -1.84, aL: -0.6, eL: 1.84 };
      } else if (ph === 3) { c = SK.cam([K(B[2], 1.3, 640, 900), K(B[3], 1.2, 660, 960)], u); const prog = out3(seg(u, B[2] + 0.1, B[3] - 0.3)); g.save(); SK.apply(g, c); street(g, u, prog); bucket(g, 400, 1440);
        const st = Math.sin(u * 9); pose = { look: 0.9, mouth: "grin", eyes: "dot", brow: -0.3, aR: -0.75 + st * 0.12, eR: -0.25, aL: 1.25,
          hold: (q, hR) => { q.save(); q.translate(hR[0], hR[1]); q.rotate(-0.5 + st * 0.12); q.lineWidth = 6; q.strokeStyle = OL; q.fillStyle = "#8a5a34"; rr(q, -8, -170, 16, 190, 6); q.fill(); q.stroke(); q.fillStyle = "#e9dcbc"; rr(q, -38, -230, 76, 70, 10); q.fill(); q.stroke(); q.fillStyle = "#f4f1e6"; rr(q, -34, -250, 68, 26, 8); q.fill(); q.stroke(); q.restore(); } };
      } else if (ph === 4) { c = SK.cam([K(B[3], 1.3, 600, 900), K(B[4], 1.18, 600, 960)], u); g.save(); SK.apply(g, c); study(g, u);
        pose = { eyes: "wide", mouth: "sad", brow: -0.6, red: 0.55, look: -0.4, aR: 0.55, eR: 1.2, aL: 0.6, eL: -1.0,
          hold: (q, hR) => { q.save(); q.translate(hR[0], hR[1]); q.rotate(0.5 + Math.sin(u * 20) * 0.15); q.lineWidth = 5; q.strokeStyle = OL; q.fillStyle = "#f2b134"; rr(q, -6, -70, 12, 80, 3); q.fill(); q.stroke(); q.restore(); } };
      } else if (ph === 5) { // nachts, dann qualmt
        c = SK.cam([K(B[4], 1.0, 560, 960), K(T.sein - 0.1, 1.0, 560, 960), K(T.qualmt, 1.5, 600, 760), K(B[5], 1.62, 600, 740)], u); g.save(); SK.apply(g, c); nightHall(g, u);
        const qk = seg(u, T.sein - 0.1, T.qualmt + 0.2); red = qk; wob = 0.3 + qk * 1.6; outfit = PJ;
        const vk = outBack(seg(u, B[4] + 0.1, B[4] + 0.35), 2);
        if (vk > 0) SK.person(g, 190, FL, 0.82, { hs: "cap", hair: "#3d6f5a", shirt: "#c9a14a", pants: "#3a3f48", shoes: "#1e1e24", skin: "#d9a07a", scarf: "#e5243b", mouth: "o", eyes: "dot", look: 0.8, aL: 1.2, aR: 0.2, eR: -1.2 });
        pose = qk > 0.05 ? { eyes: "wide", mouth: "shout", brow: -0.8, aL: -0.5, eL: 1.2, aR: -0.5, eR: -1.2 } : { eyes: "closed", mouth: u > T.nachts + 0.6 ? (Math.sin(u * 14) > 0 ? "open" : "flat") : "o", look: -0.6, aR: 1.25, aL: 0.7, eL: -1.6,
          hold: (q, hR, hL) => candle(q, hL[0], hL[1] - 10, u) };
      } else { // schläft
        const tl = seg(u, T.schlaeft - 0.2, T.denn); const dive = inExpo(cl((u - T.denn - 0.08) / Math.max(0.3, d - T.denn - 0.08)));
        c = SK.cam([K(B[6], 1.25, 640, 1040), K(T.durch, 1.2, 640, 1020), K(T.denn, 1.32, 760, 1040)], u);
        if (dive > 0) { const kk = inOut(cl((u - T.denn) / 0.35)); c.x = lerp(c.x, 1025, kk); c.y = lerp(c.y, 990, kk); c.z *= 1 + dive * 34; }
        g.save(); SK.apply(g, c); bedroom(g, u, tl); bed(g, u, false);
        g.save(); g.translate(915, 1222); g.rotate(-Math.PI / 2); SK.person(g, 0, 0, 0.9, { ...PJ, eyes: "closed", mouth: "smile", aL: 1.57, aR: 1.57, bob: Math.sin(u * 2.2) * 3 }); g.restore();
        bed(g, u, true);
        hat(g, "helm", 1025, 1046, 0.92, 0.08 + Math.sin(u * 1.3) * 0.02);
        g.restore();
        const [zx, zy] = SK.toScreen(c, 380, 1080); zzz(g, zx, zy, u, seg(u, B[6] + 0.2, B[6] + 0.6) * (1 - dive * 3));
        SK.speedLines(g, 540, 960, seg(u, T.denn - 0.05, T.denn + 0.2) * (1 - dive * 2), "rgba(255,211,77,");
        SK.flashAt(g, u, [B[6]], 0.09, 0.5); SK.whiteOut(g, u, d); return;
      }
      // Jonas mit Hutturm
      const shake = ph === 5 ? seg(u, T.qualmt - 0.2, T.qualmt + 0.1) * 5 * Math.sin(u * 50) : 0;
      SK.person(g, JX + shake, FL, 1, { ...outfit, ...pose, red: Math.max(red, pose.red || 0), t: u, bob: -bobY });
      if (ph === 2) { // Telefonhörer an beiden Ohren, Kabel zum Tisch
        const hl = hand(JX, FL, 1, -1, -0.6, 1.84), hr = hand(JX, FL, 1, 1, -0.6, -1.84);
        desk(g, "#b07a4c"); phone(g, 230, 1140, u, Math.sin(u * 3.2) > -0.2); phone(g, 960, 1140, u, Math.sin(u * 3.2 + 2) > -0.2);
        coil(g, hl[0] - 10, hl[1] + 40, 230, 1050); coil(g, hr[0] + 10, hr[1] + 40, 960, 1050); receiver(g, hl[0], hl[1] - 4, 0.25); receiver(g, hr[0], hr[1] - 4, -0.25);
      }
      if (ph === 4) { desk(g, "#6b4226", 1150); paperPile(g, 230, 1140, 34, u, 0.6); paperPile(g, 960, 1140, 42, u, -0.8); adder(g, 400, 1140, u, seg(u, B[3], B[4])); lamp(g, 800, 1140);
        for (let i = 0; i < 5; i++) { const t = ((u - B[3]) * 0.6 + i / 5) % 1; if (u < B[3]) continue; g.save(); g.translate(200 + i * 190 + Math.sin(t * 6 + i) * 60, 500 + t * 700); g.rotate(Math.sin(t * 5 + i) * 0.8); g.lineWidth = 4; g.strokeStyle = OL; fillRR(g, -40, -26, 80, 52, 2, "#fbf6e8"); g.stroke(); g.restore(); } }
      tower(g, u, T, { x: JX + shake, base: base - bobY, wob, only: ph === 6 && u > T.einen + 1.6, fly: ph === 6 ? T.einen - 0.15 : 0 });
      if (ph === 5) { const qk = seg(u, T.sein - 0.05, T.qualmt + 0.1); if (qk > 0) [-1, 1].forEach((sd) => { for (let i = 0; i < 7; i++) { const t = (u * 1.4 + i / 7) % 1; puff(g, JX + sd * (80 + t * 170), FL - 545 - t * 260 + Math.sin(t * 8 + i) * 10, 26 + t * 50, qk * (1 - t)); } }); }
      if (ph === 6) { const sk = seg(u, T.seinen, T.seinen + 0.3) * (1 - seg(u, B[6] - 0.3, B[6])); if (sk > 0) sparkles(g, JX, base - 50, u, 6, 150, "#fff2a8", 4); }
      g.restore();
      // Comic-Schrift, Sprechblasen
      if (ph === 0) T.TL.forEach((t, i) => { const [sx, sy] = SK.toScreen(c, JX + (i % 2 ? 210 : -210), base + stackY(KINDS, KINDS[i]) - 40); SK.pow(g, "PLOPP!", sx, sy, (u - t) / 0.7, { px: 64, rot: i % 2 ? 0.12 : -0.12 }); });
      if (ph === 1) { SK.pow(g, "BZZZT!", 290, 470, (u - B[0] - 0.35) / 0.9, { px: 96, rot: -0.1 }); const sp = (Math.sin(u * 23) + 1) / 2; const [hx, hy] = SK.toScreen(c, hand(JX, FL, 1, -1, 0.15, -0.25)[0] - 80, hand(JX, FL, 1, -1, 0.15, -0.25)[1]); if (u > B[0] + 0.3) { g.save(); g.strokeStyle = "#ffe14d"; g.lineWidth = 6; for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28 + u * 9; g.beginPath(); g.moveTo(hx + Math.cos(a) * 14, hy + Math.sin(a) * 14); g.lineTo(hx + Math.cos(a) * (40 + sp * 30), hy + Math.sin(a) * (40 + sp * 30)); g.stroke(); } g.restore(); } SK.flashAt(g, u, [B[0] + 0.45, B[0] + 0.95], 0.05, 0.35); }
      if (ph === 2) { SK.pow(g, "RIIING!", 250, 440, (u - B[1] - 0.05) / 0.9, { px: 90, rot: -0.12 }); const [mx, my] = SK.toScreen(c, JX + 50, FL - 500); SK.bubble(g, ["*Moment*, bitte!"], 800, 470, mx, my, win(T.mittags + 0.35, B[2] + 0.05), { px: 50 }); }
      if (ph === 3) SK.pow(g, "KLATSCH!", 260, 470, (u - B[2] - 0.5) / 0.9, { px: 84, rot: -0.1, c: "#ffffff" });
      if (ph === 5) { const [dx, dy] = SK.toScreen(c, 190, FL - 520); SK.pow(g, "KLOPF KLOPF!", 330, 360, (u - B[4]) / 0.9, { px: 70, rot: -0.08 });
        const vk = 1 - seg(u, T.sein - 0.2, T.sein + 0.1); SK.bubble(g, ["Habt ihr", "*morgen* offen?"], 255, 520, dx + 20, dy, win(B[4] + 0.3, T.nachts + 0.95) * vk, { px: 44 });
        const [jx, jy] = SK.toScreen(c, JX + 40, FL - 520); SK.bubble(g, ["Ja, wir", "haben *offen*."], 850, 520, jx, jy, win(T.nachts + 0.8, T.sein), { px: 46 }); }
      if (ph === 6) { const [jx, jy] = SK.toScreen(c, JX + 40, FL - 520); SK.bubble(g, ["*Ruhe*."], 830, 560, jx, jy, win(T.seinen + 0.1, B[6] + 0.05), { px: 60 }); }
      SK.flashAt(g, u, B.slice(0, 6), 0.07, 0.45);
    },
    ev(d, p) { const T = p._T, B = T.B; const E = [[0.0, "whoosh_down", 0.45, 0], [0.0, "shimmer_hi", 0.2, 0]];
      T.TL.forEach((t, i) => { if (i) E.push([t - 0.25, "whoosh_down", 0.25, (i % 2) * 0.4 - 0.2]); E.push([t, "pop", 0.55, (i % 2) * 0.5 - 0.25], [t + 0.02, "thump", 0.3, 0]); });
      E.push([T.TL[4] + 0.1, "tr_slow", 0.2, 0]);
      B.slice(0, 6).forEach((b) => E.push([b - 0.05, "whoosh_side", 0.4, 0], [b + 0.05, "pop", 0.3, 0.2]));
      E.push([B[0] + 0.3, "tbuzz", 0.28, -0.3], [B[0] + 0.45, "flash", 0.3, -0.3], [B[0] + 0.95, "flash", 0.25, -0.3]);
      E.push([B[1] + 0.02, "vphone", 0.35, -0.5], [B[1] + 0.5, "vphone", 0.3, 0.5], [T.mittags + 0.4, "pop", 0.3, 0.3]);
      E.push([B[2] + 0.2, "tr_crumple_s", 0.3, 0.4], [B[2] + 0.5, "slap", 0.35, 0.3], [B[2] + 0.95, "slap", 0.3, 0.3], [B[2] + 1.4, "slap", 0.3, 0.3]);
      for (let i = 0; i < 8; i++) E.push([B[3] + 0.15 + i * 0.13, "key", 0.3, -0.2]); E.push([B[3] + 1.2, "ding", 0.25, -0.2]);
      E.push([B[4] + 0.0, "h_crack_knock", 0.5, -0.5], [B[4] + 0.25, "h_crack_knock", 0.45, -0.5], [B[4] + 0.35, "pop", 0.3, -0.4], [T.nachts + 0.8, "pop", 0.3, 0.3]);
      E.push([T.sein - 0.05, "riser_short", 0.35, 0], [T.qualmt - 0.1, "whoosh_up", 0.45, -0.3], [T.qualmt + 0.1, "whoosh_up", 0.4, 0.3], [T.qualmt + 0.2, "tbuzz", 0.2, 0]);
      E.push([T.heute - 0.15, "chime", 0.3, 0], [T.einen - 0.15, "balloon_flutter", 0.45, 0.2], [T.einen + 0.2, "balloon_flutter", 0.4, 0.4], [T.einen + 0.5, "whoosh_up", 0.35, 0.5], [T.seinen, "shimmer_hi", 0.3, 0], [T.seinen + 0.15, "pop", 0.3, 0]);
      E.push([B[6], "whoosh_side", 0.35, 0], [B[6] + 0.1, "shimmer", 0.25, 0]); for (let i = 0; i < 10; i++) E.push([T.schlaeft + i * 0.17, "tick", 0.18, 0.3]);
      E.push([T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Flur mit Hutleiste, Filmtitel ----------
  const PEGS = [{ x: 200, kind: "werbe", tag: ["WERBUNG"] }, { x: 413, kind: "tel", tag: ["ANFRAGEN"] }, { x: 627, kind: "ausk", tag: ["AUSKUNFT"] }, { x: 840, kind: "buch", tag: ["GEFUNDEN", "WERDEN"] }];
  TYPES.huete_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.website = E.f(/^website/, E.sys, 2.1); E.chat = E.f(/^ki/, E.website, 3.0); E.maps = E.f(/^maps/, E.chat, 4.4); if (E.maps === 4.4) E.maps = E.f(/^google/, E.chat, 4.2);
      E.offer = E.f(/^paket/, E.maps, 5.4); E.land = [E.website - 0.05, E.chat - 0.05, E.chat + 0.3, E.maps - 0.05]; p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1b3a2c"); bg.addColorStop(1, "#0d1f17"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.06)"; g.fillRect(i * 90, 0, 45, 1640); }
      for (let r = 0; r < 18; r++) for (let c = 0; c < 12; c++) { g.fillStyle = "rgba(232,192,112,0.08)"; g.save(); g.translate(c * 90 + 22 + (r % 2) * 45, r * 92 + 40); g.rotate(0.785); g.fillRect(-5, -5, 10, 10); g.restore(); }
      // Holzvertäfelung unten
      g.fillStyle = "#3a2214"; g.fillRect(0, 1640, W, 280); g.fillStyle = "#4a2c1a"; for (let i = 0; i < 6; i++) { rr(g, 20 + i * 180, 1670, 150, 220, 8); g.fill(); } g.fillStyle = "#5a3520"; g.fillRect(0, 1628, W, 20);
      // Lampenschein
      const lg = g.createRadialGradient(540, 120, 20, 540, 300, 760); lg.addColorStop(0, "rgba(255,214,150,0.30)"); lg.addColorStop(1, "rgba(255,214,150,0)"); g.fillStyle = lg; g.fillRect(0, 0, W, 1100);
      // Hutleiste
      const bk = out3(seg(u, 0.05, 0.6)); g.save(); g.globalAlpha = bk; g.lineWidth = 6; g.strokeStyle = "#1a0e08";
      const wg = g.createLinearGradient(0, 250, 0, 300); wg.addColorStop(0, "#7a4a2a"); wg.addColorStop(1, "#4f2e18"); g.fillStyle = wg; rr(g, 80, 248, 920, 54, 10); g.fill(); g.stroke();
      [100, 980].forEach((x) => circle(g, x, 275, 8, "#c9a14a"));
      PEGS.forEach((pg, i) => { const lk = seg(u, T.land[i], T.land[i] + 0.1);
        // Etikett an Schnur
        const tk = seg(u, T.land[i] + 0.05, T.land[i] + 0.4); if (tk > 0) { const sw = Math.sin((u - T.land[i]) * 7) * 0.3 * Math.exp(-(u - T.land[i]) * 2.2); g.save(); g.translate(pg.x, 330); g.rotate(sw); g.globalAlpha = bk * cl(tk * 3);
          g.strokeStyle = "#e8d8b0"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 190); g.stroke();
          const th = pg.tag.length > 1 ? 92 : 62; g.fillStyle = "#e9d3a6"; g.strokeStyle = "#5a3a1e"; g.lineWidth = 4; g.beginPath(); g.moveTo(-84, 190); g.lineTo(84, 190); g.lineTo(84, 190 + th); g.lineTo(-84, 190 + th); g.closePath(); g.fill(); g.stroke(); circle(g, 0, 204, 6, "#5a3a1e");
          g.fillStyle = "#3a2410"; g.font = "700 25px I"; g.textAlign = "center"; g.textBaseline = "middle"; g.letterSpacing = "2px"; pg.tag.forEach((t, j) => g.fillText(t, 0, 190 + 36 + j * 30 + (pg.tag.length > 1 ? 0 : -4))); g.letterSpacing = "0px"; g.restore(); }
        // Messinghaken
        g.fillStyle = "#c9a14a"; g.strokeStyle = "#1a0e08"; g.lineWidth = 5; rr(g, pg.x - 10, 296, 20, 40, 6); g.fill(); g.stroke(); circle(g, pg.x, 340, 13, "#e0b85a"); g.stroke();
        // Hut fliegt herein
        const f = cl((u - (T.land[i] - 1.0)) / 1.0); if (f > 0) { const e = out3(f); const x = lerp(-260, pg.x, e), y = lerp(560 + i * 40, 352, e) - Math.sin(e * Math.PI) * 160; const bob = lk >= 1 ? Math.sin((u - T.land[i]) * 10) * 6 * Math.exp(-(u - T.land[i]) * 4) : 0;
          if (f < 1) wings(g, x, y + 40, 0.75, u * 24 + i);
          g.globalAlpha = bk; hat(g, pg.kind, x, y + 40 + bob, 0.92, (1 - e) * -0.4, lk >= 1 ? 1 - 0.12 * Math.exp(-(u - T.land[i]) * 8) : 1); }
      });
      g.restore();
      const pk = seg(u, 0, 0.6); const dg = g.createLinearGradient(0, 700, 0, 1600); dg.addColorStop(0, "rgba(8,20,14,0)"); dg.addColorStop(0.2, `rgba(8,20,14,${0.45 * pk})`); dg.addColorStop(0.8, `rgba(8,20,14,${0.45 * pk})`); dg.addColorStop(1, "rgba(8,20,14,0)"); g.fillStyle = dg; g.fillRect(0, 700, W, 900);
      SK.endTitle(g, u, d, T, { c: "#f6ecd8", glow: "rgba(241,209,138,0.40)", accent: "#e8c070", sub: "rgba(246,236,216,0.88)", key: "#ffcf2e", offer: "BUSINESS-PAKET", y: 900 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; const E = [[0.0, "boom", 0.35, 0], [0.1, "shimmer", 0.3, 0]];
      T.land.forEach((t, i) => E.push([t - 0.9, "balloon_flutter", 0.3, -0.5], [t, "pop", 0.4, (i - 1.5) * 0.3], [t + 0.05, "tick_hi", 0.25, (i - 1.5) * 0.3]));
      E.push([T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]); return E.filter((e) => e[0] < d && e[0] >= 0); },
  };
})();
