// VOICE_DELAY: 0.45
// h_socken: Neugier-Geschichte (Look "story", Anti-Werbung). Opa Heinz schenkt seit 30 Jahren graue Socken.
// Bild 0: Geburtstagstafel im Wohnzimmer, Opa hält das Päckchen hin, der Deckel fliegt, eine graue Socke springt heraus.
// Rückblende (Sepia): Abreißkalender zählt JAHR 1 bis 30, jedes Jahr ein Päckchen, der Sockenberg auf dem Tisch wächst,
// die Familie lächelt tapfer (Schweißtropfen). Der Schrank springt auf, Socken-Lawine, Mama steckt bis zum Hals drin.
// Heute (Kalender JAHR 31): Opa im Sessel mit Pantoffeln und Kater, leere Hände. Oma liest die Karte, Freudentränen, Herzen.
// Die Enkel mit Fragezeichen, Opa zwinkert. Bei „Denn“ taucht die Kamera in die Karte, Weiß. Danach socken_end (Geschenkpapier, Filmtitel).
// Wörter: jahren, socken, graue, familie, tapfer, schrank, decke, dieses, keine, oma, karte, weint, enkel, wie, er, stadt, denn.
(() => {
  const OL = SK.OL;
  const FL = 1400, S = 0.85; // Füße, Figuren-Maßstab
  const OPA = { hs: "grey", hair: "#ecebef", shirt: "#5f7fa8", pants: "#4a4f5c", shoes: "#5a3a26", skin: "#f0c4a0", glasses: true };
  const OMA = { hs: "bun", hair: "#d4d4dc", shirt: "#b0476a", skirt: "#3c5a8a", pants: "#f0c4a0", shoes: "#6b2a3a", skin: "#f1c7a1", glasses: true };
  const MAMA = { hs: "long", hair: "#7a4a2a", shirt: "#3d9a6b", pants: "#2f3d5c", shoes: "#1e1e24", skin: "#e8b48f" };
  const KID1 = { hs: "short", hair: "#e0a030", shirt: "#e5243b", pants: "#2f6f8f", skin: "#f1c7a1" };
  const KID2 = { hs: "long", hair: "#5b3a23", shirt: "#f2b134", pants: "#8e5bd6", skin: "#f1c7a1" };
  const XO = 180, XM = 420, XG = 600, XK1 = 770, XK2 = 870, XP = 1070; // Sessel, Mama, Oma, Enkel, Opa stehend
  const TB = { l: 380, r: 930, top: 1170 }; const WR = { x: 1760, l: 1530, r: 1990, top: 430 }; // Tisch, Schrank
  const GREYS = ["#9aa0a8", "#8b9099", "#a9aeb5", "#7f858e"];
  const PAPER = ["#e5243b", "#2f6f8f", "#3d9a6b", "#8e5bd6", "#f2b134", "#e0703a"];
  const K = (t, z, x, sy = 1450) => ({ t, z, x, y: FL - (sy - 960) / z });

  // Handposition einer SK.person in Weltkoordinaten
  function hand(x, feet, s, side, a, bend, sit) { const sx = side * 92, sy = -410 + (sit ? 140 : 0); const ex = sx + side * Math.cos(a) * 95, ey = sy + Math.sin(a) * 95; const b = a + side * bend; return [x + (ex + side * Math.cos(b) * 90) * s, feet + (ey + Math.sin(b) * 90) * s]; }

  function sock(g, x, y, s, rot, c) {
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineWidth = 5; g.strokeStyle = OL; g.lineJoin = "round";
    const body = () => { g.beginPath(); g.moveTo(-22, -58); g.lineTo(22, -58); g.lineTo(22, 6); g.lineTo(56, 6); g.arc(56, 25, 19, -Math.PI / 2, Math.PI / 2); g.lineTo(-4, 44); g.quadraticCurveTo(-22, 44, -22, 24); g.closePath(); };
    g.fillStyle = c; body(); g.fill(); g.save(); body(); g.clip(); g.fillStyle = "rgba(0,0,0,0.16)"; g.fillRect(46, 0, 40, 50); g.beginPath(); g.arc(-8, 30, 16, 0, 7); g.fill(); g.restore(); body(); g.stroke();
    g.fillStyle = SK.mix(c.length === 7 ? c : "#9aa0a8", "#3a3f48", 0.25); rr(g, -25, -74, 50, 20, 6); g.fill(); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 3; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 12, -72); g.lineTo(i * 12, -56); g.stroke(); }
    g.restore();
  }
  function present(g, x, y, s, c, lid, rot = 0) { // Päckchen, Boden bei y; lid 0 zu .. 1 weg
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL;
    g.fillStyle = c; rr(g, -62, -96, 124, 96, 6); g.fill(); g.stroke(); g.fillStyle = "#ffd34d"; g.fillRect(-12, -96, 24, 96); g.strokeRect(-12, -96, 24, 96);
    g.fillStyle = "rgba(255,255,255,0.35)"; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(-40 + (i % 2) * 70, -70 + Math.floor(i / 2) * 40, 6, 0, 7); g.fill(); }
    const ly = -96 - lid * 260, lx = lid * 90, lr = lid * 1.2; g.save(); g.translate(lx, ly); g.rotate(lr); g.globalAlpha = 1 - cl((lid - 0.7) / 0.3);
    g.fillStyle = SK.mix(c, "#000000", 0.12); rr(g, -70, -30, 140, 34, 6); g.fill(); g.stroke(); g.fillStyle = "#ffd34d"; g.fillRect(-12, -30, 24, 34); g.strokeRect(-12, -30, 24, 34);
    g.beginPath(); g.ellipse(-26, -42, 28, 15, -0.4, 0, 7); g.ellipse(26, -42, 28, 15, 0.4, 0, 7); g.fill(); g.stroke(); circle(g, 0, -36, 11, "#ffd34d"); g.stroke(); g.restore();
    g.restore();
  }
  function spring(g, x, y0, y1, n = 7) { g.save(); g.strokeStyle = "#c9ced8"; g.lineWidth = 6; g.beginPath(); for (let i = 0; i <= n * 2; i++) { const yy = lerp(y0, y1, i / (n * 2)), xx = x + (i % 2 ? 22 : -22) * (i > 0 && i < n * 2 ? 1 : 0); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore(); }
  function sweat(g, x, y, s, u) { const t = (u * 1.3) % 1; g.save(); g.translate(x, y + t * 40 * s); g.scale(s, s); g.globalAlpha = 1 - t * 0.6; g.fillStyle = "#9fd8ff"; g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -20); g.quadraticCurveTo(14, 4, 0, 10); g.quadraticCurveTo(-14, 4, 0, -20); g.fill(); g.stroke(); g.restore(); }
  function mustache(g, x, feet, s, sit) { const y = feet + (-545 + 22 + (sit ? 140 : 0)) * s; g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#e4e3e8"; g.strokeStyle = OL; g.lineWidth = 5; g.beginPath(); g.ellipse(-22, 0, 28, 12, 0.25, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.ellipse(22, 0, 28, 12, -0.25, 0, 7); g.fill(); g.stroke(); g.restore(); }

  // ---------- Wohnzimmer ----------
  function room(g, u, now) {
    g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#efe3c8"; g.fillRect(-1600, -900, 4800, 1200); // Decke
    g.fillStyle = "#6f9474"; g.fillRect(-1600, 300, 4800, 1000); // Tapete
    g.fillStyle = "#668a6b"; for (let i = -18; i < 36; i++) g.fillRect(i * 90, 300, 40, 1000);
    for (let i = -18; i < 36; i++) for (let r = 0; r < 7; r++) { const fx = i * 90 + 65, fy = 360 + r * 110 + (i % 2) * 55; g.fillStyle = "rgba(240,225,180,0.35)"; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(fx + Math.cos(k * 1.57) * 7, fy + Math.sin(k * 1.57) * 7, 5, 0, 7); g.fill(); } }
    g.fillStyle = "#f4ead2"; g.fillRect(-1600, 286, 4800, 34); g.strokeRect(-1600, 286, 4800, 34);
    // Fenster hinter dem Sessel (Abend, Sterne, Dächer)
    const wx = 170; g.fillStyle = "#f4ead2"; rr(g, wx - 160, 520, 320, 480, 10); g.fill(); g.stroke();
    const sk = g.createLinearGradient(0, 540, 0, 980); sk.addColorStop(0, "#1b2450"); sk.addColorStop(1, "#5a4a7a"); g.fillStyle = sk; g.fillRect(wx - 136, 544, 272, 432); g.strokeRect(wx - 136, 544, 272, 432);
    for (let i = 0; i < 9; i++) circle(g, wx - 120 + rnd(i * 3.3) * 240, 560 + rnd(i * 5.1) * 200, 3 + rnd(i) * 3, `rgba(255,248,210,${0.5 + 0.5 * Math.sin(u * 3 + i * 2)})`);
    circle(g, wx + 70, 610, 30, "#fff4cf"); circle(g, wx + 84, 602, 26, "#1f2954");
    g.fillStyle = "#141a33"; g.beginPath(); g.moveTo(wx - 136, 976); [[-136, 880], [-90, 840], [-44, 880], [-44, 900], [20, 900], [20, 850], [60, 815], [100, 850], [100, 870], [136, 870]].forEach(([a, b]) => g.lineTo(wx + a, b)); g.lineTo(wx + 136, 976); g.closePath(); g.fill();
    g.fillStyle = "#ffd77a"; [[-70, 900], [40, 880], [80, 900]].forEach(([a, b]) => g.fillRect(wx + a, b, 14, 18));
    g.strokeStyle = "#f4ead2"; g.lineWidth = 12; g.beginPath(); g.moveTo(wx, 544); g.lineTo(wx, 976); g.moveTo(wx - 136, 740); g.lineTo(wx + 136, 740); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    g.fillStyle = "#c4553f"; [-1, 1].forEach((sd) => { g.beginPath(); g.moveTo(wx + sd * 190, 490); g.quadraticCurveTo(wx + sd * 150, 760, wx + sd * 205, 1030); g.lineTo(wx + sd * 130, 1030); g.quadraticCurveTo(wx + sd * 100, 760, wx + sd * 120, 490); g.closePath(); g.fill(); g.stroke(); });
    g.fillStyle = "#7a4a2a"; rr(g, wx - 230, 474, 460, 22, 10); g.fill(); g.stroke();
    // Hochzeitsfoto (oval) und Wanduhr
    g.fillStyle = "#c9a14a"; g.beginPath(); g.ellipse(XG + 20, 640, 95, 120, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#f2e6c9"; g.beginPath(); g.ellipse(XG + 20, 640, 74, 98, 0, 0, 7); g.fill(); g.stroke();
    circle(g, XG - 6, 625, 22, "#e6c2a0"); circle(g, XG + 46, 620, 22, "#e6c2a0"); g.fillStyle = "#3a2c22"; g.beginPath(); g.arc(XG - 6, 616, 23, Math.PI, 0); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(XG + 46, 590); g.quadraticCurveTo(XG + 90, 640, XG + 72, 720); g.lineTo(XG + 20, 720); g.closePath(); g.fill(); g.fillStyle = "#2b2b38"; g.beginPath(); g.moveTo(XG - 40, 720); g.quadraticCurveTo(XG - 30, 660, XG - 6, 652); g.quadraticCurveTo(XG + 18, 660, XG + 26, 720); g.closePath(); g.fill();
    const cx = 930; g.fillStyle = "#7a4a2a"; rr(g, cx - 70, 470, 140, 330, 16); g.fill(); g.stroke(); circle(g, cx, 550, 54, "#f8f1df"); g.stroke();
    g.lineWidth = 5; g.beginPath(); g.moveTo(cx, 550); g.lineTo(cx + Math.cos(u * 0.6) * 34, 550 + Math.sin(u * 0.6) * 34); g.moveTo(cx, 550); g.lineTo(cx + Math.cos(u * 7) * 44, 550 + Math.sin(u * 7) * 44); g.stroke(); g.lineWidth = 8;
    const sw = Math.sin(u * 4.2) * 0.3; g.save(); g.translate(cx, 620); g.rotate(sw); g.strokeStyle = "#c9a14a"; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.stroke(); circle(g, 0, 130, 22, "#e0b040"); g.strokeStyle = OL; g.lineWidth = 5; g.stroke(); g.restore(); g.lineWidth = 8;
    // Landschaftsbild
    g.fillStyle = "#c9a14a"; rr(g, 1180, 560, 230, 170, 8); g.fill(); g.stroke(); const pg = g.createLinearGradient(0, 580, 0, 710); pg.addColorStop(0, "#9fd3ff"); pg.addColorStop(1, "#f6e7c8"); g.fillStyle = pg; g.fillRect(1200, 580, 190, 130); g.strokeRect(1200, 580, 190, 130);
    g.fillStyle = "#4f8a4a"; g.beginPath(); g.moveTo(1200, 710); g.lineTo(1260, 630); g.lineTo(1300, 680); g.lineTo(1340, 640); g.lineTo(1390, 710); g.closePath(); g.fill(); circle(g, 1350, 610, 14, "#ffd34d");
    // Wimpelkette (nur heute)
    if (now) { g.strokeStyle = "#5a3a26"; g.lineWidth = 4; g.beginPath(); g.moveTo(300, 360); g.quadraticCurveTo(700, 470, 1120, 360); g.stroke(); g.lineWidth = 5; g.strokeStyle = OL;
      for (let i = 0; i < 11; i++) { const k = (i + 0.5) / 11, px = lerp(300, 1120, k), py = lerp(360, 360, k) + 4 * 55 * k * (1 - k) * 2 * 0.5 * 2 - 0, yy = 360 + 110 * 4 * k * (1 - k) * 0.5 * 2 * 0.5; const fl = Math.sin(u * 3 + i) * 0.08;
        g.save(); g.translate(px, yy); g.rotate(fl); g.fillStyle = PAPER[i % PAPER.length]; g.beginPath(); g.moveTo(-28, 0); g.lineTo(28, 0); g.lineTo(0, 62); g.closePath(); g.fill(); g.stroke(); g.restore(); } }
    // Holzvertäfelung und Boden
    g.fillStyle = "#7a5034"; g.fillRect(-1600, 1060, 4800, 240); g.strokeRect(-1600, 1060, 4800, 240); g.fillStyle = "#6a4429"; for (let i = -12; i < 22; i++) { rr(g, i * 160 + 16, 1084, 128, 196, 8); g.fill(); }
    g.fillStyle = "#8f6040"; g.fillRect(-1600, 1050, 4800, 20);
    g.fillStyle = "#b07a4c"; g.fillRect(-1600, 1300, 4800, 1100); g.strokeRect(-1600, 1300, 4800, 1100);
    g.strokeStyle = "rgba(60,30,15,0.35)"; g.lineWidth = 4; for (let r = 0; r < 10; r++) { const y = 1300 + r * 60; g.beginPath(); g.moveTo(-1600, y); g.lineTo(3200, y); g.stroke(); for (let c = -10; c < 30; c++) { const x = c * 220 + (r % 2) * 110; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 60); g.stroke(); } }
    g.strokeStyle = OL; g.lineWidth = 8; g.fillStyle = "rgba(0,0,0,0.22)"; g.fillRect(-1600, 1300, 4800, 20);
    // Teppich
    g.fillStyle = "#9b3b3b"; g.beginPath(); g.ellipse(650, 1440, 620, 90, 0, 0, 7); g.fill(); g.stroke(); g.strokeStyle = "#e9c46a"; g.lineWidth = 5; g.beginPath(); g.ellipse(650, 1440, 560, 70, 0, 0, 7); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    // Stehlampe neben dem Sessel
    const lx = -110; g.fillStyle = "#5a3a26"; g.fillRect(lx - 6, 820, 12, 560); g.strokeRect(lx - 6, 820, 12, 560); g.beginPath(); g.ellipse(lx, 1390, 60, 14, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#f2c76a"; g.beginPath(); g.moveTo(lx - 90, 860); g.lineTo(lx - 50, 740); g.lineTo(lx + 50, 740); g.lineTo(lx + 90, 860); g.closePath(); g.fill(); g.stroke();
    const lg = g.createRadialGradient(lx, 860, 10, lx, 1000, 560); lg.addColorStop(0, "rgba(255,214,140,0.32)"); lg.addColorStop(1, "rgba(255,214,140,0)"); g.fillStyle = lg; g.fillRect(lx - 600, 700, 1200, 800);
    // Anrichte mit Pflanze
    g.fillStyle = "#6b4226"; rr(g, 1150, 1120, 260, 270, 10); g.fill(); g.stroke(); g.fillStyle = "#7f5130"; rr(g, 1166, 1150, 108, 200, 6); g.fill(); g.stroke(); rr(g, 1286, 1150, 108, 200, 6); g.fill(); g.stroke(); circle(g, 1260, 1250, 8, "#e0b040"); circle(g, 1300, 1250, 8, "#e0b040");
    g.fillStyle = "#c4553f"; rr(g, 1320, 1050, 70, 72, 8); g.fill(); g.stroke(); g.fillStyle = "#4f8a4a"; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.4 + Math.sin(u * 1.5 + i) * 0.04; g.beginPath(); g.ellipse(1355 + Math.cos(a) * 52, 1046 + Math.sin(a) * 62, 16, 46, a + Math.PI / 2, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = "#f4ead2"; rr(g, 1190, 1040, 90, 80, 6); g.fill(); g.stroke(); g.fillStyle = "#c9a14a"; rr(g, 1182, 1032, 106, 96, 8); g.globalAlpha = 0; g.fill(); g.globalAlpha = 1;
  }
  function wardrobe(g, u, open, bulge) { // Schrank: open 0..1, bulge (Wackeln)
    const { l, r, top } = WR, bot = FL - 10, w = r - l, m = (l + r) / 2; g.lineWidth = 8; g.strokeStyle = OL;
    g.save(); g.translate(m, bot); g.scale(1 + bulge * 0.03 * Math.sin(u * 40), 1 - bulge * 0.02 * Math.sin(u * 40)); g.translate(-m, -bot);
    g.fillStyle = "#6b3f22"; rr(g, l, top, w, bot - top, 10); g.fill(); g.stroke();
    g.fillStyle = "#7f4c2a"; g.beginPath(); g.moveTo(l - 30, top + 10); g.lineTo(l + 30, top - 50); g.lineTo(r - 30, top - 50); g.lineTo(r + 30, top + 10); g.closePath(); g.fill(); g.stroke();
    // Innenraum, bis oben voll mit Socken
    g.fillStyle = "#2a1a10"; g.fillRect(l + 24, top + 30, w - 48, bot - top - 90);
    g.save(); g.beginPath(); g.rect(l + 24, top + 30, w - 48, bot - top - 90); g.clip(); for (let i = 0; i < 70; i++) sock(g, l + 40 + rnd(i * 1.7) * (w - 80), top + 50 + rnd(i * 2.9) * (bot - top - 120), 0.9, rnd(i * 4.3) * 6.28, GREYS[i % 4]); g.restore();
    const dw = (w - 48) / 2;
    [-1, 1].forEach((sd) => { const hx = sd < 0 ? l + 24 : r - 24, ww = dw * (1 - 1.15 * open) * (sd < 0 ? 1 : -1); if (Math.abs(ww) < 4) return;
      const sw = Math.abs(ww) / dw < 0 ? 0 : 1; g.fillStyle = open > 0.5 ? "#4f2e18" : "#8a5531"; g.fillRect(Math.min(hx, hx + ww), top + 30, Math.abs(ww), bot - top - 90); g.strokeRect(Math.min(hx, hx + ww), top + 30, Math.abs(ww), bot - top - 90);
      if (Math.abs(ww) > 40) { g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 5; rr(g, Math.min(hx, hx + ww) + Math.abs(ww) * 0.15, top + 80, Math.abs(ww) * 0.7, (bot - top) * 0.36, 8); g.stroke(); rr(g, Math.min(hx, hx + ww) + Math.abs(ww) * 0.15, top + 120 + (bot - top) * 0.38, Math.abs(ww) * 0.7, (bot - top) * 0.36, 8); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
        circle(g, hx + ww - Math.sign(ww) * 22, top + (bot - top) * 0.5, 11, "#e0b040"); g.stroke(); } void sw; });
    g.fillStyle = "#5a3520"; g.fillRect(l, bot - 60, w, 50); g.strokeRect(l, bot - 60, w, 50);
    g.restore();
  }
  function table(g, u, now) {
    const { l, r, top } = TB; g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#5a3520"; [l + 40, r - 40].forEach((x) => { g.fillRect(x - 14, top, 28, FL - top - 5); g.strokeRect(x - 14, top, 28, FL - top - 5); });
    g.fillStyle = "#fbf6e8"; g.beginPath(); g.moveTo(l - 20, top); g.lineTo(r + 20, top); g.lineTo(r + 30, top + 90); for (let i = 0; i <= 14; i++) { const x = lerp(r + 30, l - 30, i / 14); g.lineTo(x, top + 90 + (i % 2 ? 18 : 0)); } g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = "rgba(200,170,120,0.6)"; g.lineWidth = 3; for (let i = 0; i < 14; i++) { const x = lerp(l - 10, r + 10, (i + 0.5) / 14); g.beginPath(); g.arc(x, top + 60, 10, 0, 7); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8;
    // Kaffeekanne und Tassen
    g.fillStyle = "#f8f1df"; g.beginPath(); g.moveTo(455, top); g.lineTo(445, top - 90); g.quadraticCurveTo(480, top - 120, 515, top - 90); g.lineTo(505, top); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(448, top - 70); g.quadraticCurveTo(420, top - 90, 418, top - 108); g.stroke(); circle(g, 480, top - 118, 9, "#3d6fb0"); g.stroke();
    g.strokeStyle = "#3d6fb0"; g.lineWidth = 4; g.beginPath(); g.arc(480, top - 50, 14, 0, 7); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    [560, 820, 890].forEach((x) => { g.fillStyle = "#fff"; g.lineWidth = 5; g.beginPath(); g.ellipse(x, top - 4, 30, 8, 0, 0, 7); g.fill(); g.stroke(); rr(g, x - 18, top - 40, 36, 34, 8); g.fill(); g.stroke(); g.beginPath(); g.arc(x + 20, top - 24, 9, -1.4, 1.4); g.stroke(); g.fillStyle = "#3d6fb0"; g.fillRect(x - 18, top - 30, 36, 6); g.lineWidth = 8; });
    // Torte
    const tx = 690; g.fillStyle = "#fff"; g.beginPath(); g.ellipse(tx, top - 4, 110, 18, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#f4a6b8"; rr(g, tx - 90, top - 90, 180, 84, 12); g.fill(); g.stroke(); rr(g, tx - 60, top - 160, 120, 74, 12); g.fill(); g.stroke();
    g.fillStyle = "#fff6ee"; [[-90, -90, 180], [-60, -160, 120]].forEach(([a, b, w]) => { g.beginPath(); g.moveTo(tx + a, top + b + 10); for (let i = 0; i <= 8; i++) { const x = tx + a + w * i / 8; g.lineTo(x, top + b + (i % 2 ? 28 : 12)); } g.lineTo(tx + a + w, top + b + 10); g.quadraticCurveTo(tx + a + w, top + b, tx + a + w - 10, top + b); g.lineTo(tx + a + 10, top + b); g.quadraticCurveTo(tx + a, top + b, tx + a, top + b + 10); g.fill(); g.lineWidth = 5; g.stroke(); g.lineWidth = 8; });
    [-30, -10, 10, 30].forEach((dx, i) => { circle(g, tx + dx * 2.2, top - 50, 7, ["#e5243b", "#3d9a6b", "#f2b134", "#2f6f8f"][i]); });
    if (now) [-40, -14, 14, 40].forEach((dx, i) => { const x = tx + dx; g.fillStyle = ["#9fd3ff", "#ffd34d", "#e85d75", "#8fd68a"][i]; g.lineWidth = 4; rr(g, x - 6, top - 214, 12, 56, 4); g.fill(); g.stroke(); const fl = 1 + 0.18 * Math.sin(u * 14 + i * 2); g.fillStyle = "#ffb000"; g.beginPath(); g.ellipse(x + Math.sin(u * 9 + i) * 2, top - 228, 7 * fl, 15 * fl, 0, 0, 7); g.fill(); circle(g, x, top - 224, 4, "#fff4cf"); const fg = g.createRadialGradient(x, top - 228, 2, x, top - 228, 50); fg.addColorStop(0, "rgba(255,200,90,0.35)"); fg.addColorStop(1, "rgba(255,200,90,0)"); g.fillStyle = fg; g.fillRect(x - 50, top - 278, 100, 100); g.lineWidth = 8; });
  }
  function armchair(g, x, front) { // Ohrensessel, front: nur Armlehnen
    g.lineWidth = 8; g.strokeStyle = OL; const s = 1;
    if (!front) { g.fillStyle = "#3f6b5a"; g.beginPath(); g.moveTo(x - 150, FL - 200); g.lineTo(x - 150, FL - 560); g.quadraticCurveTo(x - 150, FL - 650, x - 60, FL - 650); g.lineTo(x + 60, FL - 650); g.quadraticCurveTo(x + 150, FL - 650, x + 150, FL - 560); g.lineTo(x + 150, FL - 200); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = "#355c4c"; [[-90, -540], [0, -560], [90, -540], [-60, -440], [60, -440]].forEach(([a, b]) => { circle(g, x + a, FL + b, 8, "#2a4a3c"); });
      g.fillStyle = "#4a7a66"; [-1, 1].forEach((sd) => { g.beginPath(); g.moveTo(x + sd * 150, FL - 560); g.quadraticCurveTo(x + sd * 210, FL - 560, x + sd * 200, FL - 420); g.lineTo(x + sd * 150, FL - 380); g.closePath(); g.fill(); g.stroke(); });
      g.fillStyle = "#4a7a66"; rr(g, x - 160, FL - 230, 320, 90, 20); g.fill(); g.stroke(); g.fillStyle = "#5a3520"; [-130, 130].forEach((a) => { g.fillRect(x + a - 10, FL - 140, 20, 140); g.strokeRect(x + a - 10, FL - 140, 20, 140); }); }
    else { g.fillStyle = "#4a7a66"; [-1, 1].forEach((sd) => { rr(g, x + sd * 160 - 34, FL - 340, 68, 200, 26); g.fill(); g.stroke(); g.fillStyle = "#3f6b5a"; g.beginPath(); g.ellipse(x + sd * 160, FL - 336, 36, 22, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#4a7a66"; }); }
    void s;
  }
  function cat(g, x, y, s, u, k = 0) { // schlafender Kater (orange), k: Schwanz-Wedeln
    g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL; g.lineJoin = "round"; const br = 1 + 0.03 * Math.sin(u * 3);
    const tw = Math.sin(u * 2.4) * (0.4 + k * 0.5); g.fillStyle = "#e8913a"; g.beginPath(); g.moveTo(70, 10); g.quadraticCurveTo(140, 0 + tw * 40, 120, -60 + tw * 30); g.lineTo(104, -54 + tw * 30); g.quadraticCurveTo(118, -4, 62, 24); g.closePath(); g.fill(); g.stroke();
    g.save(); g.scale(1, br); g.beginPath(); g.ellipse(10, 0, 90, 48, 0, 0, 7); g.fill(); g.stroke(); g.restore();
    g.strokeStyle = "#b9651f"; g.lineWidth = 6; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-10 + i * 28, -44); g.quadraticCurveTo(-2 + i * 28, -26, -12 + i * 28, -10); g.stroke(); } g.strokeStyle = OL;
    g.fillStyle = "#e8913a"; g.beginPath(); g.moveTo(-108, -48); g.lineTo(-96, -96); g.lineTo(-72, -62); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-52, -60); g.lineTo(-38, -100); g.lineTo(-24, -54); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.arc(-66, -30, 46, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#fbe3c8"; g.beginPath(); g.ellipse(-70, -12, 22, 15, 0, 0, 7); g.fill();
    g.lineWidth = 5; g.beginPath(); g.arc(-86, -36, 10, 0.2, Math.PI - 0.2); g.stroke(); g.beginPath(); g.arc(-48, -36, 10, 0.2, Math.PI - 0.2); g.stroke(); circle(g, -68, -20, 6, "#e85d75");
    g.lineWidth = 3; g.beginPath(); g.moveTo(-100, -12); g.lineTo(-136, -18); g.moveTo(-100, -6); g.lineTo(-136, -2); g.moveTo(-40, -12); g.lineTo(-4, -18); g.moveTo(-40, -6); g.lineTo(-4, -2); g.stroke();
    g.restore();
  }
  function slippers(g, x, s) { [[96, -16], [42, -16]].forEach(([a, b]) => { g.save(); g.translate(x + a * s, FL + b * s); g.lineWidth = 5; g.strokeStyle = OL; g.fillStyle = "#b8343a"; g.beginPath(); g.ellipse(0, 0, 48 * s, 20 * s, 0, 0, 7); g.fill(); g.stroke();
    g.strokeStyle = "rgba(255,230,180,0.6)"; g.lineWidth = 3; for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 14 * s, -18 * s); g.lineTo(i * 14 * s, 18 * s); g.stroke(); } g.beginPath(); g.moveTo(-40 * s, 0); g.lineTo(40 * s, 0); g.stroke(); circle(g, 30 * s, -16 * s, 14 * s, "#fff4e2"); g.strokeStyle = OL; g.lineWidth = 4; g.stroke(); g.restore(); }); }
  function card(g, x, y, s, rot) { // Karte, Vorderseite (Herz und Schleife, kein Text)
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL; shadow(g, 0, 6, "rgba(0,0,0,0.25)");
    g.fillStyle = "#fbf3e4"; rr(g, -100, -70, 200, 140, 8); g.fill(); noShadow(g); g.stroke(); g.strokeStyle = "#e0b040"; g.lineWidth = 3; rr(g, -88, -58, 176, 116, 5); g.stroke();
    heart(g, 0, 8, 30, "#e5243b"); g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.moveTo(-100, -70); g.lineTo(100, -70); g.stroke();
    g.fillStyle = "#e0b040"; g.lineWidth = 4; g.beginPath(); g.ellipse(-16, -60, 16, 9, -0.4, 0, 7); g.ellipse(16, -60, 16, 9, 0.4, 0, 7); g.fill(); g.stroke(); circle(g, 0, -58, 6, "#e0b040"); g.stroke();
    g.restore();
  }
  function heap(g, k, u) { // Socken-Lawine vor dem Schrank
    if (k <= 0) return; const cx = WR.x - 60, R = 640 * Math.min(1, 0.5 + k), Hh = 470 * k;
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#7f858e"; g.beginPath(); g.moveTo(cx - R, FL + 30); for (let i = 0; i <= 30; i++) { const px = -1 + 2 * i / 30; g.lineTo(cx + px * R, FL + 30 - Hh * (1 - px * px) - Math.sin(i * 2.1) * 12 * k); } g.closePath(); g.fill(); g.stroke();
    const n = Math.floor(170 * Math.min(1, k * 1.2)); for (let i = 0; i < n; i++) { const px = rnd(i * 1.31) * 2 - 1, py = Math.pow(rnd(i * 2.71), 0.7), mh = Hh * (1 - px * px); sock(g, cx + px * R * 0.96, FL + 20 - py * mh, 1.05, rnd(i * 4.3) * 6.28 + Math.sin(u * 2 + i) * 0.02, GREYS[i % 4]); }
  }

  // Abreißkalender (Bildschirm): JAHR n, beim Wechsel fliegt das alte Blatt weg
  function calendar(g, x, y, val, k, gold) {
    if (k <= 0) return; const e = outBack(cl(k), 2); const n = Math.floor(val), fr = val - n; g.save(); g.translate(x, y); g.scale(e, e); g.rotate(0.04);
    g.lineWidth = 7; g.strokeStyle = OL; shadow(g, 0, 10, "rgba(0,0,0,0.3)"); fillRR(g, -120, -120, 240, 250, 14, "#fffaf0"); noShadow(g); rr(g, -120, -120, 240, 250, 14); g.stroke();
    fillRR(g, -120, -120, 240, 64, 14, gold ? "#e0a020" : "#e5243b"); g.fillRect(-120, -80, 240, 24); rr(g, -120, -120, 240, 64, 14); g.stroke(); g.beginPath(); g.moveTo(-120, -56); g.lineTo(120, -56); g.stroke();
    [-60, 60].forEach((a) => { circle(g, a, -120, 12, "#c9ced8"); g.stroke(); });
    g.font = "900 34px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText("JAHR", 0, -86);
    g.font = "900 128px D"; g.fillStyle = gold ? "#c07a10" : "#1b1530"; g.fillText(String(Math.max(1, n)), 0, 36);
    if (fr > 0.02 && fr < 0.6 && n > 1) { const f = fr / 0.6; g.save(); g.translate(f * 260, -56 - f * 200); g.rotate(f * 1.4); g.globalAlpha = 1 - f; fillRR(g, -120, 0, 240, 186, 10, "#fffaf0"); rr(g, -120, 0, 240, 186, 10); g.stroke(); g.font = "900 128px D"; g.fillStyle = "#1b1530"; g.fillText(String(n - 1), 0, 92); g.restore(); }
    g.restore();
  }

  function family(g, u, o) { // Mama, Oma, Enkel hinter dem Tisch. o: mood (forced|shock|joy|ask), card, held, yr
    const m = o.mood, sw = m === "forced";
    SK.person(g, XM, FL, S, { ...MAMA, mouth: m === "shock" ? "shout" : sw ? "grin" : m === "ask" ? "o" : "smile", eyes: m === "shock" ? "wide" : sw ? "wide" : m === "joy" ? "happy" : "dot", brow: sw ? -0.5 : 0, look: 0.5,
      aL: m === "shock" ? -0.4 : 1.3, eL: m === "shock" ? 0.9 : 0, aR: m === "shock" ? -0.4 : 1.3, eR: m === "shock" ? -0.9 : 0 });
    const ag = o.card ? { aL: 0.6, eL: -2.3, aR: 0.6, eR: 2.3 } : o.held ? { aL: 1.3, aR: -0.7, eR: -0.6 } : { aL: 1.3, aR: 1.3 };
    SK.person(g, XG, FL, S, { ...OMA, ...ag, mouth: m === "joy" ? "grin" : sw ? "grin" : m === "shock" ? "o" : "smile", eyes: m === "joy" ? "closed" : sw ? "wide" : "dot", brow: sw ? -0.4 : m === "joy" ? -0.3 : 0, look: o.card ? 0 : 0.7,
      hold: o.held ? (q, hR) => { q.save(); q.translate(hR[0], hR[1]); q.rotate(Math.sin(u * 3) * 0.08); sock(q, 4, 30, 1.25, 0.15, GREYS[(o.yr || 0) % 4]); q.restore(); } : null });
    [[XK1, KID1, -0.6], [XK2, KID2, 0.6]].forEach(([x, kid, lk], i) => SK.person(g, x, FL, 0.6, { ...kid, mouth: m === "ask" ? "o" : m === "shock" ? "shout" : sw ? "grin" : "smile", eyes: m === "ask" || m === "shock" ? "wide" : sw ? "wide" : "happy", brow: m === "ask" ? -0.6 : sw ? -0.5 : 0, look: m === "ask" ? -0.8 : lk, bob: Math.sin(u * 5 + i) * 3 }));
    if (sw) { sweat(g, XM + 70, FL - 545 * S - 40, 1, u); sweat(g, XG - 70, FL - 545 * S - 30, 1, u + 0.4); sweat(g, XK1 + 46, FL - 545 * 0.6 - 30, 0.8, u + 0.2); sweat(g, XK2 - 46, FL - 545 * 0.6 - 30, 0.8, u + 0.7); }
  }

  TYPES.h_socken = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 0.3, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.jahren = f(/^jahren/, 0, 0.5); T.socken = f(/^socken/, T.jahren, 2.2); T.graue = f(/^graue/, T.socken, T.socken + 0.6);
      T.familie = f(/^familie/, T.graue, T.graue + 1.0); T.tapfer = f(/^tapfer/, T.familie, T.familie + 0.6); T.schrank = f(/^schrank/, T.tapfer, T.tapfer + 0.6); T.decke = f(/^decke/, T.schrank, T.schrank + 1.0);
      T.dieses = f(/^dieses/, T.decke, T.decke + 0.8); T.keine = f(/^keine/, T.dieses, T.dieses + 0.6); T.oma = f(/^oma/, T.keine, T.keine + 0.9); T.karte = f(/^karte/, T.oma, T.oma + 0.5); T.weint = f(/^weint/, T.karte, T.karte + 0.4);
      T.enkel = f(/^enkel/, T.weint, T.weint + 1.2); T.wie = f(/^wie$/, T.enkel, T.enkel + 0.7); T.er = f(/^er$/, T.wie, T.wie + 1.2); T.stadt = f(/^stadt/, T.er, T.er + 0.8); T.denn = f(/^denn/, T.stadt, T.stadt + 0.6);
      T.bB = T.schrank - 0.25; T.bC = T.dieses - 0.15;
      // Jahreswechsel für Ton
      T.yrs = []; let last = 1; for (let t = 0; t < T.graue; t += 0.01) { const y = 1 + 29 * inOut(seg(t, T.jahren - 0.1, T.graue - 0.15)); if (Math.floor(y) !== last) { last = Math.floor(y); T.yrs.push(t); } }
      p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const ph = u < T.bB ? 1 : u < T.bC ? 2 : 3;
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      g.fillStyle = "#1d120c"; g.fillRect(0, 0, W, H);
      if (ph === 1) { // Rückblende: 30 Jahre Socken
        const yv = 1 + 29 * inOut(seg(u, T.jahren - 0.1, T.graue - 0.15)), yr = Math.floor(yv), fr = yv - yr;
        const c = SK.cam([K(0, 1.62, 860), K(T.jahren, 1.5, 830), K(T.graue - 0.15, 1.42, 820), K(T.graue + 0.25, 2.1, 640, 1640), K(T.familie - 0.05, 2.1, 640, 1640), K(T.familie + 0.35, 1.25, 700), K(T.bB, 1.22, 720)], u);
        g.save(); SK.apply(g, c);
        room(g, u, false);
        family(g, u, { mood: u > T.familie - 0.1 ? "forced" : "smile", held: u > 0.35, yr });
        table(g, u, false);
        // Sockenberg auf dem Tisch (wächst mit den Jahren)
        const pile = u < T.jahren ? 0 : Math.min(36, yr * 1.2); for (let i = 0; i < pile; i++) { const a = rnd(i * 1.9) * 2 - 1, h = Math.pow(rnd(i * 3.7), 0.8) * (40 + pile * 3.4) * (1 - a * a * 0.8); sock(g, 820 + a * 95, TB.top - 10 - h, 0.82, rnd(i * 5.1) * 6.28, GREYS[i % 4]); }
        // Opa steht rechts und hält das Päckchen hin
        const pop = u < T.jahren ? u : u > T.graue - 0.15 ? 1 : fr, lid = cl((pop + 0.12) / 0.35), hop = outBack(cl(pop / 0.18), 3);
        SK.person(g, XP, FL, S, { ...OPA, mouth: "grin", eyes: "happy", look: -0.8, aL: 0.15, eL: -0.25, aR: 1.3, bob: -Math.abs(Math.sin(u * 6)) * 4,
          hold: (q, hR, hL) => { q.save(); q.translate(hL[0] + 6, hL[1] - 12); q.scale(hop, hop); present(q, 0, 0, 1.05, PAPER[yr % PAPER.length], lid, -0.05); const up = outBack(cl((pop - 0.04) / 0.22), 3) * (1 - cl((pop - 0.7) / 0.3)); if (up > 0.02) { spring(q, 0, -96, -96 - 150 * up); sock(q, 0, -96 - 150 * up - 40, 1.2, Math.sin(u * 18) * 0.3, "#9aa0a8"); } q.restore(); } });
        mustache(g, XP, FL, S, false);
        g.restore();
        // Sepia-Rückblende: warmer Schleier und Vignette
        g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = "rgba(238,210,160,0.55)"; g.fillRect(0, 0, W, H); g.restore();
        const vg = g.createRadialGradient(540, 900, 300, 540, 960, 1150); vg.addColorStop(0, "rgba(40,20,5,0)"); vg.addColorStop(1, "rgba(40,20,5,0.55)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
        // Konfetti beim ersten Öffnen
        confetti(g, 690, 760, u + 0.25, 50, ["#ffd34d", "#e5243b", "#2f6f8f", "#3d9a6b", "#ffffff"], 600, 5);
        calendar(g, 540, 560, yv, seg(u, T.jahren - 0.25, T.jahren) * (1 - seg(u, T.graue - 0.05, T.graue + 0.1)), false);
        SK.pow(g, "TADAA!", 740, 470, (u + 0.15) / 0.9, { px: 120, rot: -0.12 });
        const [oxs, oys] = SK.toScreen(c, XG + 30, FL - 600 * S);
        SK.bubble(g, ["Oh. *Grau*."], 300, 470, oxs, oys, win(T.graue + 0.1, T.familie + 0.05), { px: 58 });
        const [pxs, pys] = SK.toScreen(c, XP - 20, FL - 610 * S);
        SK.bubble(g, ["Schön *warm*,", "oder?"], 790, 470, pxs, pys, win(T.familie + 0.3, T.bB + 0.05), { px: 50 });
        SK.flashAt(g, u, [T.graue + 0.0], 0.08, 0.4);
      } else if (ph === 2) { // Schrank: Socken-Lawine
        const open = out3(seg(u, T.schrank + 0.05, T.schrank + 0.3)), fall = seg(u, T.schrank + 0.15, T.decke + 0.25);
        const c = SK.cam([K(T.bB, 1.18, 1640), K(T.schrank + 0.2, 1.12, 1660), K(T.decke + 0.1, 1.28, 1600), K(T.bC, 1.34, 1590)], u);
        const sh = (1 - cl((u - T.schrank - 0.2) / 0.5)) * 18 * (u > T.schrank + 0.15 ? 1 : 0) + (1 - cl(Math.abs(u - T.decke) / 0.3)) * 12;
        g.save(); SK.apply(g, c, Math.sin(u * 60) * sh, Math.cos(u * 47) * sh);
        room(g, u, false); wardrobe(g, u, open, u < T.schrank + 0.05 ? 1 : 0);
        const mk = out3(seg(u, T.bB, T.schrank)); const buried = fall > 0.55;
        SK.person(g, lerp(1300, 1450, mk), FL, S, { ...MAMA, mouth: open > 0.3 ? "shout" : "smile", eyes: open > 0.3 ? "wide" : "dot", brow: open > 0.3 ? -0.8 : 0, look: 0.8,
          aR: open > 0.3 ? -0.9 : lerp(1.3, 0.05, mk), eR: open > 0.3 ? -0.5 : 0, aL: open > 0.3 ? -0.9 : 1.3, eL: open > 0.3 ? 0.5 : 0, walk: mk < 1 ? u * 10 : 0 });
        // fliegende Socken
        for (let i = 0; i < 46; i++) { const t0 = T.schrank + 0.12 + i * 0.035, tt = u - t0; if (tt < 0 || tt > 1.1) continue; const vx = -350 - rnd(i * 2.3) * 700, vy = -500 - rnd(i * 3.1) * 500; const x = WR.x + (rnd(i) - 0.5) * 300 + vx * tt, y = WR.top + 220 + rnd(i * 5.7) * 500 + vy * tt + 1500 * tt * tt;
          if (y > FL + 40) continue; sock(g, x, y, 1.1, tt * 9 * (i % 2 ? 1 : -1) + i, GREYS[i % 4]); }
        heap(g, fall, u);
        if (buried) { // Mama steckt drin, ein Arm winkt
          const hx = 1450; SK.person(g, hx, FL, S, { ...MAMA, mouth: "shout", eyes: "wide", brow: -0.8, look: 0.4, aR: -1.2, eR: -0.3 + Math.sin(u * 14) * 0.4, aL: 1.3 });
          g.save(); g.beginPath(); g.rect(hx - 300, FL - 470 * S - 2, 2000, 1000); g.clip(); heap(g, fall, u); g.restore(); }
        g.restore();
        const [mxs, mys] = SK.toScreen(c, 1450, FL - 610 * S);
        SK.bubble(g, ["*Hilfe*!"], Math.max(240, mxs - 120), 470, mxs, mys, win(T.decke - 0.05, T.bC + 0.05), { shout: true, px: 66 });
        SK.pow(g, "RUMMS!", 760, 470, (u - T.schrank - 0.12) / 0.8, { px: 120, rot: 0.1, c: "#ffd34d" });
        g.save(); g.globalCompositeOperation = "multiply"; g.fillStyle = "rgba(238,210,160,0.55)"; g.fillRect(0, 0, W, H); g.restore();
        const vg = g.createRadialGradient(540, 900, 300, 540, 960, 1150); vg.addColorStop(0, "rgba(40,20,5,0)"); vg.addColorStop(1, "rgba(40,20,5,0.55)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
        SK.flashAt(g, u, [T.bB], 0.08, 0.5);
      } else { // heute: keine Socken, Karte, Freudentränen, Enkel rätseln
        const dive = inExpo(cl((u - T.denn - 0.08) / Math.max(0.3, d - T.denn - 0.08)));
        const CARD = [XG, FL - 350 * S];
        const c = SK.cam([K(T.bC, 1.55, 330), K(T.keine + 0.2, 1.6, 300), K(T.oma - 0.15, 1.6, 320), K(T.oma + 0.2, 1.9, 600, 1680), K(T.weint + 0.3, 2.0, 600, 1700), K(T.enkel - 0.05, 1.95, 610, 1690), K(T.enkel + 0.35, 1.12, 560), K(T.er, 1.12, 560), K(T.stadt + 0.2, 1.2, 480), K(T.denn, 1.25, 520)], u);
        if (dive > 0) { const k = inOut(cl((u - T.denn) / 0.35)); c.x = lerp(c.x, CARD[0], k); c.y = lerp(c.y, CARD[1], k); c.z *= 1 + dive * 30; }
        g.save(); SK.apply(g, c);
        room(g, u, true);
        const mood = u < T.oma - 0.1 ? "shock" : u < T.enkel - 0.1 ? "joy" : "ask";
        family(g, u, { mood: u < T.keine - 0.05 ? "smile" : mood, card: u > T.oma - 0.3 });
        table(g, u, true);
        if (u > T.oma - 0.3) { const ck = outBack(seg(u, T.oma - 0.3, T.oma + 0.05), 2); card(g, CARD[0], CARD[1], 0.9 * ck, Math.sin(u * 2) * 0.03); [-1, 1].forEach((sd) => { circle(g, CARD[0] + sd * 86 * ck, CARD[1] + 52 * ck, 15 * ck, OMA.skin); g.lineWidth = 6; g.strokeStyle = OL; g.stroke(); }); }
        // Opa im Sessel, Pantoffeln, Kater
        armchair(g, XO, false);
        const shrug = seg(u, T.keine - 0.15, T.keine + 0.1) * (1 - seg(u, T.oma - 0.4, T.oma - 0.1));
        const wink = (u > T.dieses + 0.2 && u < T.keine + 0.5) || u > T.stadt - 0.1;
        SK.person(g, XO, FL, S, { ...OPA, sit: true, shoes: "#b8343a", mouth: "grin", eyes: wink ? "wink" : "happy", look: 0.6, aL: lerp(1.0, -0.2, shrug), eL: lerp(-0.4, 1.1, shrug), aR: lerp(1.0, -0.2, shrug), eR: lerp(0.4, -1.1, shrug), bob: Math.sin(u * 2) * 2 });
        mustache(g, XO, FL, S, true); slippers(g, XO, S);
        cat(g, XO + 20, FL - 205 * S - 34, 0.85, u, u > T.stadt ? 1 : 0);
        armchair(g, XO, true);
        g.restore();
        // Freudentränen und Herzen
        const jk = seg(u, T.weint - 0.1, T.weint + 0.2) * (1 - seg(u, T.enkel + 0.2, T.enkel + 0.6));
        if (jk > 0) { [-1, 1].forEach((sd) => { for (let i = 0; i < 7; i++) { const t = ((u * 1.6 + i / 7) % 1); const [ex, ey] = SK.toScreen(c, XG + sd * 26 * S, FL - 553 * S); const x = ex + sd * t * 170, y = ey + (-90 * t + 260 * t * t); g.save(); g.globalAlpha = jk * (1 - t * 0.6); g.fillStyle = "#7fd0ff"; g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y, 10, 14, 0, 0, 7); g.fill(); g.stroke(); g.restore(); } });
          for (let i = 0; i < 6; i++) { const t = ((u * 0.45 + i / 6) % 1); const [hx, hy] = SK.toScreen(c, XG, FL - 640 * S); g.save(); g.globalAlpha = jk * Math.sin(t * Math.PI); heart(g, hx + Math.sin(i * 2.3 + u * 2) * 200 + (i - 2.5) * 40, hy - t * 300, 22 + rnd(i) * 14, ["#e5243b", "#ff7aa2", "#ffb3c7"][i % 3]); g.restore(); } }
        // Fragezeichen über den Enkeln
        const [kx, ky] = SK.toScreen(c, (XK1 + XK2) / 2, FL - 0.6 * 640);
        SK.qmarks(g, kx, ky - 40, u, seg(u, T.enkel - 0.05, T.enkel + 0.5) * (1 - seg(u, T.denn - 0.1, T.denn + 0.1)) * (1 - dive * 4), 3);
        const [mxs, mys] = SK.toScreen(c, XM + 10, FL - 620 * S);
        SK.bubble(g, ["Keine *Socken*?!"], Math.max(330, Math.min(760, mxs + 40)), 470, mxs, mys, win(T.keine - 0.05, T.oma - 0.1), { shout: true, px: 56 });
        const [oxs, oys] = SK.toScreen(c, XG, FL - 640 * S);
        SK.bubble(g, ["Oh, *Heinz*!"], 560, 460, oxs, oys, win(T.weint - 0.05, T.enkel + 0.1), { px: 62 });
        const [k1x, k1y] = SK.toScreen(c, XK2, FL - 0.6 * 640);
        SK.bubble(g, ["*Wie*, Opa?!"], 760, 500, k1x, k1y - 60, win(T.wie - 0.1, T.stadt - 0.05) * (1 - dive * 4), { px: 56 });
        const [k2x, k2y] = SK.toScreen(c, XK1, FL - 0.6 * 640);
        SK.bubble(g, ["Du warst doch", "*hier*!"], 700, 500, k2x, k2y - 60, win(T.stadt - 0.1, T.denn + 0.1) * (1 - dive * 4), { px: 52 });
        SK.speedLines(g, 540, 960, seg(u, T.denn - 0.05, T.denn + 0.2) * (1 - dive * 2), "rgba(255,211,77,");
        calendar(g, 640, 330, u < T.dieses + 0.1 ? 30 : 31 + Math.min(0.65, (u - T.dieses - 0.1) * 1.4), seg(u, T.bC, T.bC + 0.2) * (1 - seg(u, T.keine - 0.25, T.keine - 0.05)), u > T.dieses + 0.3);
        SK.flashAt(g, u, [T.bC], 0.09, 0.6);
      }
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T; const E = [[0.0, "pop", 0.6, 0], [0.0, "tr_crumple_s", 0.45, -0.2], [0.04, "whoosh_up", 0.45, 0.2], [0.12, "slap", 0.4, 0], [0.18, "shimmer_hi", 0.25, 0]];
      E.push([T.jahren - 0.2, "pop", 0.4, 0]); T.yrs.forEach((t, i) => { E.push([t, "tick", 0.3, ((i % 2) * 2 - 1) * 0.3]); if (i % 3 === 0) E.push([t + 0.03, "pop", 0.3, 0.3]); });
      E.push([T.graue - 0.05, "vsad", 0.35, 0], [T.graue, "pop", 0.4, -0.2], [T.familie + 0.3, "pop", 0.35, 0.3], [T.tapfer, "tick_hi", 0.2, 0]);
      E.push([T.bB, "whoosh_side", 0.45, 0.2], [T.bB + 0.05, "vsteps", 0.3, 0.3], [T.schrank, "closed_squeak", 0.45, 0.3], [T.schrank + 0.12, "slap", 0.5, 0], [T.schrank + 0.15, "whoosh_down", 0.5, 0], [T.schrank + 0.2, "thump", 0.55, 0]);
      for (let i = 0; i < 8; i++) E.push([T.schrank + 0.3 + i * 0.12, i % 2 ? "domino_thud" : "tr_land", 0.3, ((i % 3) - 1) * 0.4]);
      E.push([T.decke - 0.05, "thump", 0.6, 0], [T.decke, "pop", 0.45, 0], [T.decke + 0.05, "boom", 0.3, 0]);
      E.push([T.bC - 0.1, "tr_slow", 0.4, 0], [T.bC, "chime", 0.3, 0], [T.dieses + 0.2, "tick", 0.3, 0], [T.dieses + 0.3, "shimmer_hi", 0.3, 0], [T.keine - 0.05, "pop", 0.45, -0.3], [T.keine + 0.05, "tw_ding", 0.25, 0]);
      E.push([T.oma - 0.25, "whoosh_side", 0.35, 0], [T.oma, "tr_crumple_s", 0.3, 0], [T.weint - 0.1, "shimmer", 0.45, 0], [T.weint, "chime_up2", 0.3, 0], [T.weint + 0.1, "pop", 0.35, 0.2]);
      E.push([T.enkel, "whoosh_up", 0.3, 0], [T.enkel + 0.1, "pop", 0.35, -0.2], [T.enkel + 0.25, "pop", 0.35, 0], [T.enkel + 0.4, "pop", 0.35, 0.2], [T.wie - 0.05, "pop", 0.35, 0.3], [T.stadt - 0.1, "pop", 0.35, -0.3], [T.stadt, "tick_hi", 0.25, 0]);
      E.push([T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Geschenkpapier, Schleife, Filmtitel ----------
  TYPES.socken_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^gutscheinshop/, E.sys, 1.4); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      // dunkelrotes Geschenkpapier mit feinem Goldmuster
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#5a1220"); bg.addColorStop(1, "#3a0a14"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      g.save(); g.translate(0, -((u * 8) % 120)); for (let r = 0; r < 19; r++) for (let c = 0; c < 10; c++) { const x = c * 120 + (r % 2) * 60, y = r * 120; g.fillStyle = "rgba(232,192,112,0.13)"; g.save(); g.translate(x, y); g.rotate(0.785); g.fillRect(-7, -7, 14, 14); g.restore(); circle(g, x + 60, y, 3, "rgba(232,192,112,0.10)"); } g.restore();
      // Satinband senkrecht und waagerecht, Schleife oben
      const bk = out3(seg(u, 0.1, 0.9));
      const band = (x, y, w, h) => { const gr = w > h ? g.createLinearGradient(0, y, 0, y + h) : g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, "#b8862e"); gr.addColorStop(0.5, "#f1d18a"); gr.addColorStop(1, "#b8862e"); g.fillStyle = gr; g.fillRect(x, y, w, h); };
      band(540 - 46, 0, 92, 470 * bk); band(540 - 46, H - 330 * bk, 92, 330 * bk); band(0, 1660, W * bk, 80);
      const bw = out3(seg(u, 0.4, 1.2)); if (bw > 0) { g.save(); g.translate(540, 400); g.scale(bw, bw); g.rotate(Math.sin(u * 1.4) * 0.02);
        const loop = (sd) => { const gr = g.createLinearGradient(sd * 20, 0, sd * 200, 0); gr.addColorStop(0, "#b8862e"); gr.addColorStop(0.6, "#f1d18a"); gr.addColorStop(1, "#c9973a"); g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(sd * 80, -150, sd * 250, -110, sd * 200, 0); g.bezierCurveTo(sd * 250, 100, sd * 80, 120, 0, 0); g.fill(); g.strokeStyle = "rgba(90,50,10,0.5)"; g.lineWidth = 3; g.stroke();
          g.fillStyle = "#c9973a"; g.beginPath(); g.moveTo(sd * 10, 10); g.lineTo(sd * 110, 210); g.lineTo(sd * 70, 200); g.lineTo(sd * 50, 230); g.lineTo(-sd * 10, 30); g.closePath(); g.fill(); g.stroke(); };
        loop(-1); loop(1); const kg = g.createRadialGradient(-8, -8, 4, 0, 0, 44); kg.addColorStop(0, "#f8e2a8"); kg.addColorStop(1, "#b8862e"); g.fillStyle = kg; g.beginPath(); g.ellipse(0, 0, 44, 38, 0, 0, 7); g.fill(); g.stroke(); g.restore();
        if (bw >= 1) sparkles(g, 540, 400, u, 5, 220, "#fff2c0", 9); }
      const lg = g.createRadialGradient(540, 900, 60, 540, 960, 1150); lg.addColorStop(0, "rgba(255,200,140,0.10)"); lg.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = lg; g.fillRect(0, 0, W, H);
      // ruhige Fläche hinter dem Titel
      const pk = seg(u, 0, 0.6); const dg = g.createLinearGradient(0, 600, 0, 1660); dg.addColorStop(0, "rgba(40,6,14,0)"); dg.addColorStop(0.2, `rgba(40,6,14,${0.5 * pk})`); dg.addColorStop(0.8, `rgba(40,6,14,${0.5 * pk})`); dg.addColorStop(1, "rgba(40,6,14,0)"); g.fillStyle = dg; g.fillRect(0, 600, W, 1060);
      SK.endTitle(g, u, d, T, { c: "#fbeee0", glow: "rgba(241,209,138,0.45)", accent: "#e8c070", sub: "rgba(255,232,205,0.88)", key: "#f1d18a", offer: "IHR GUTSCHEINSHOP", y: 880 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.1, "shimmer", 0.35, 0], [0.45, "tr_crumple_s", 0.2, 0], [0.9, "chime", 0.25, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
