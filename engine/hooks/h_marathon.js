// VOICE_DELAY: 0.45
// h_marathon: Neugier-Geschichte (Look "story", Anti-Werbung). Kellner Tim (Startnummer 42 auf der Schürze) sprintet mit Tablett
// durchs Restaurant: Tisch 1, Küche (Durchreiche mit Glocke), Tisch 7, Küche, Tisch 12. Eine Lauf-Anzeige zählt bis 42,2 km.
// Nach der Schicht hängt ihm der Chef eine Medaille um, Konfetti, Tim schläft im Stehen (Zzz). Heute schlendert Tim mit Kaffee,
// die Gäste strahlen, das Essen ploppt schon auf die Tische. Bei „Denn“ taucht die Kamera in den Tischaufsteller (nur Rückseite), Weiß.
// Danach marathon_end (Filmtitel auf dunklem Holz, kleine Medaille, BESTELLEN DIREKT AM TISCH).
// Wörter: marathon, tisch eins, küche, tisch sieben, küche, tisch zwölf, nach, chef, medaille, schläft, stehen, heute, gemütlich, gäste, schneller, essen, denn.
(() => {
  const OL = SK.OL;
  const LANE = 1370, BASE = 1300; // Füße Tim (vorn) / Fußboden-Linie der Tische
  const TIM = { hs: "short", hair: "#3a2416", shirt: "#ffffff", pants: "#1e1e24", shoes: "#111", skin: "#f1c7a1", apron: "#1f2a44" };
  const CHEF = { hs: "bald", hair: "#2a1d16", shirt: "#f5f2ea", pants: "#3a3f48", shoes: "#1e1e24", skin: "#e8b48f", apron: "#ffffff" };
  const TABLES = [ // x, Nummer, Gäste
    { x: -300, n: "12", g: [{ hs: "long", hair: "#c98d3a", shirt: "#e85d75", skin: "#f1c7a1" }, { hs: "short", hair: "#2b2b2b", shirt: "#3d9a6b", skin: "#d9a07a", glasses: true }] },
    { x: 400, n: "1", g: [{ hs: "grey", hair: "#d9d9de", shirt: "#8e5bd6", skin: "#f0c4a0", glasses: true }, { hs: "bun", hair: "#7a4a2a", shirt: "#f2b134", skin: "#f1c7a1" }] },
    { x: 2000, n: "7", g: [{ hs: "cap", hair: "#2f6f8f", shirt: "#e0703a", skin: "#8d5a3c" }, { hs: "long", hair: "#1e1a18", shirt: "#5b6ee1", skin: "#e8b48f" }] },
  ];
  const HATCH = 1000, DOOR = 1250;
  const mixS = (a, b, k) => SK.mix(a, b, k);

  // ---------- Raum ----------
  function room(g, u, L) { // L: 0 = Nacht (nach der Schicht), 1 = Abend, 2 = heute (warm, hell)
    const warm = L === 2 ? 1 : L === 1 ? 0.75 : 0.25;
    g.lineWidth = 8; g.strokeStyle = OL;
    // Decke mit Balken
    g.fillStyle = mixS("#2a1a12", "#5a3a26", warm); g.fillRect(-1400, -1000, 4800, 1380);
    g.fillStyle = mixS("#1d120c", "#43291a", warm); for (let i = -6; i < 16; i++) { g.fillRect(i * 300 - 40, -1000, 80, 1380); }
    g.fillStyle = mixS("#1d120c", "#43291a", warm); g.fillRect(-1400, 330, 4800, 50); g.strokeRect(-1400, 330, 4800, 50);
    // Tapete mit Streifen
    g.fillStyle = mixS("#4a2a24", "#a8473a", warm); g.fillRect(-1400, 380, 4800, 640);
    g.fillStyle = mixS("#3e221d", "#953d31", warm); for (let i = -30; i < 70; i++) g.fillRect(i * 70, 380, 26, 640);
    g.fillStyle = "rgba(255,220,160,0.10)"; for (let i = -30; i < 70; i++) for (let r = 0; r < 6; r++) { g.beginPath(); g.arc(i * 70 + 48, 430 + r * 100, 6, 0, 7); g.fill(); }
    // Fenster (Abendhimmel)
    [-760, 760, 2480].forEach((wx, i) => { const sk = g.createLinearGradient(0, 520, 0, 900); sk.addColorStop(0, L === 0 ? "#070b1c" : L === 2 ? "#ff9e5e" : "#27305e"); sk.addColorStop(1, L === 0 ? "#18213f" : L === 2 ? "#ffd59a" : "#e0775a");
      g.fillStyle = "#3a2416"; rr(g, wx - 130, 500, 260, 420, 14); g.fill(); g.stroke(); g.fillStyle = sk; rr(g, wx - 108, 522, 216, 376, 8); g.fill(); g.stroke();
      if (L === 0) { circle(g, wx + 40, 600, 30, "#fff4cf"); circle(g, wx + 54, 592, 26, "#18213f"); }
      else { g.fillStyle = "rgba(20,14,30,0.55)"; for (let k = 0; k < 4; k++) { const h = 80 + rnd(i * 9 + k) * 120; g.fillRect(wx - 108 + k * 54, 898 - h, 46, h); } }
      g.strokeStyle = "#3a2416"; g.lineWidth = 12; g.beginPath(); g.moveTo(wx, 522); g.lineTo(wx, 898); g.moveTo(wx - 108, 700); g.lineTo(wx + 108, 700); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
      g.fillStyle = mixS("#5a1f22", "#b8343a", warm); g.beginPath(); g.moveTo(wx - 150, 480); g.quadraticCurveTo(wx - 120, 700, wx - 160, 940); g.lineTo(wx - 110, 940); g.quadraticCurveTo(wx - 80, 700, wx - 90, 480); g.closePath(); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(wx + 150, 480); g.quadraticCurveTo(wx + 120, 700, wx + 160, 940); g.lineTo(wx + 110, 940); g.quadraticCurveTo(wx + 80, 700, wx + 90, 480); g.closePath(); g.fill(); g.stroke(); });
    // Bilder an der Wand
    [[60, "#3d9a6b"], [1600, "#2f6f8f"], [2900, "#d9a441"]].forEach(([fx, c], i) => { g.fillStyle = "#c9a14a"; rr(g, fx - 110, 560, 220, 170, 8); g.fill(); g.stroke(); const pg = g.createLinearGradient(0, 580, 0, 710); pg.addColorStop(0, mixS("#2a3a5a", "#9fd3ff", warm)); pg.addColorStop(1, mixS("#1a2a1a", c, warm)); g.fillStyle = pg; g.fillRect(fx - 90, 580, 180, 130); g.strokeRect(fx - 90, 580, 180, 130);
      g.fillStyle = mixS("#1a2a1a", "#2f6b3a", warm); g.beginPath(); g.moveTo(fx - 90, 710); g.lineTo(fx - 30 + i * 10, 630); g.lineTo(fx + 20, 680); g.lineTo(fx + 60, 640); g.lineTo(fx + 90, 710); g.closePath(); g.fill(); });
    // Tafel "Heute"
    g.fillStyle = "#6b4a2a"; rr(g, 1440, 760, 300, 210, 10); g.fill(); g.stroke(); g.fillStyle = "#1f2b26"; g.fillRect(1462, 782, 256, 166);
    g.font = "italic 400 40px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(255,255,255,0.85)"; g.fillText("Heute", 1590, 818); g.font = "400 30px S"; g.fillText("Schnitzel", 1590, 866); g.fillText("Apfelstrudel", 1590, 908);
    // Holzvertäfelung
    g.fillStyle = mixS("#24150d", "#5a3620", warm); g.fillRect(-1400, 1000, 4800, 300); g.strokeRect(-1400, 1000, 4800, 300);
    g.fillStyle = mixS("#1d110a", "#4a2c1a", warm); for (let i = -14; i < 34; i++) { rr(g, i * 150 + 18, 1030, 114, 240, 8); g.fill(); }
    g.fillStyle = mixS("#3a2416", "#7a4a2a", warm); g.fillRect(-1400, 990, 4800, 22);
    // Durchreiche zur Küche
    g.fillStyle = "#3a2416"; rr(g, HATCH - 170, 760, 340, 300, 10); g.fill(); g.stroke();
    const kg = g.createLinearGradient(0, 780, 0, 1040); kg.addColorStop(0, "#fff1c9"); kg.addColorStop(1, "#e9c88a"); g.fillStyle = kg; g.fillRect(HATCH - 150, 780, 300, 250); g.strokeRect(HATCH - 150, 780, 300, 250);
    g.fillStyle = "#c9ced8"; for (let i = 0; i < 5; i++) { rr(g, HATCH - 140 + i * 58, 800, 40, 90, 6); g.fill(); g.stroke(); } // Töpfe an der Wand
    // Küchentür mit Bullauge und Schild KÜCHE
    g.fillStyle = "#3a2416"; g.fillRect(DOOR - 105, 760, 210, 540); g.strokeRect(DOOR - 105, 760, 210, 540);
    g.fillStyle = "#fff1c9"; g.fillRect(DOOR - 90, 775, 180, 525);
    fillRR(g, DOOR - 120, 650, 240, 86, 12, "#1f2a44"); g.strokeStyle = OL; rr(g, DOOR - 120, 650, 240, 86, 12); g.stroke();
    g.font = "900 54px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffd34d"; g.fillText("KÜCHE", DOOR, 695);
    // Boden: Fliesen
    g.fillStyle = mixS("#2a2420", "#8a6a50", warm); g.fillRect(-1400, 1300, 4800, 1000); g.strokeRect(-1400, 1300, 4800, 1000);
    for (let r = 0; r < 8; r++) for (let c = -12; c < 32; c++) if ((r + c) % 2 === 0) { g.fillStyle = mixS("#1e1a17", "#6e523c", warm); g.fillRect(c * 150 + (r % 2) * 0, 1300 + r * 110, 150, 110); }
    g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(-1400, 1300, 4800, 26);
  }
  function door(g, sw) { // Türblatt (sw 0 zu, 1 auf)
    const w = 180 * (1 - 0.8 * sw); g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#7a4a2a"; g.fillRect(DOOR - 90, 775, w, 525); g.strokeRect(DOOR - 90, 775, w, 525);
    if (w > 60) { g.fillStyle = "#c9a14a"; g.beginPath(); g.ellipse(DOOR - 90 + w / 2, 900, w * 0.28, 52, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#fff1c9"; g.beginPath(); g.ellipse(DOOR - 90 + w / 2, 900, w * 0.2, 38, 0, 0, 7); g.fill(); g.stroke(); }
  }
  function toque(g, x, feet, s, flip) { g.save(); g.translate(x, feet); g.scale(s * (flip ? -1 : 1), s); g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#ffffff";
    rr(g, -62, -640, 124, 60, 10); g.fill(); g.stroke(); g.beginPath(); g.arc(-40, -680, 42, 0, 7); g.arc(0, -705, 48, 0, 7); g.arc(40, -680, 42, 0, 7); g.fill(); g.stroke(); rr(g, -60, -650, 120, 40, 10); g.fill(); g.stroke();
    // Schnurrbart
    g.fillStyle = "#2a1d16"; g.beginPath(); g.ellipse(-22, -520, 26, 11, 0.25, 0, 7); g.ellipse(22, -520, 26, 11, -0.25, 0, 7); g.fill(); g.restore(); }
  function bib(g, x, feet, s) { g.save(); g.translate(x, feet); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#ffffff"; rr(g, -56, -405, 112, 80, 8); g.fill(); g.stroke();
    circle(g, -44, -393, 4, OL); circle(g, 44, -393, 4, OL); g.font = "900 54px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#e5243b"; g.fillText("42", 0, -362); g.restore(); }
  function medal(g, x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL;
    const gr = g.createRadialGradient(-10, -12, 4, 0, 0, 44); gr.addColorStop(0, "#fff2a8"); gr.addColorStop(0.6, "#f2b134"); gr.addColorStop(1, "#b07a1a"); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 40, 0, 7); g.fill(); g.stroke();
    g.strokeStyle = "#b07a1a"; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 30, 0, 7); g.stroke(); g.font = "900 40px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#8a5a10"; g.fillText("1", 0, 2); g.restore(); }
  function medalOn(g, x, feet, s) { g.save(); g.translate(x, feet); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL;
    for (const sd of [-1, 1]) { g.fillStyle = sd < 0 ? "#2f6f8f" : "#e5243b"; g.beginPath(); g.moveTo(sd * 64, -478); g.lineTo(sd * 30, -478); g.lineTo(sd * 4, -330); g.lineTo(sd * 30, -330); g.closePath(); g.fill(); g.stroke(); }
    g.restore(); medal(g, x, feet - 300 * s, s * 1.15); }
  function tray(g, h, u, wob, n) { // Tablett über der Hand, n Teller
    g.save(); g.translate(h[0], h[1] - 18); g.rotate(wob); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#c9ced8"; g.beginPath(); g.ellipse(0, 0, 120, 20, 0, 0, 7); g.fill(); g.stroke();
    for (let i = 0; i < n; i++) { const px = -62 + i * 70, hop = Math.abs(Math.sin(u * 17 + i * 1.7)) * 10 * Math.abs(wob) * 8; g.save(); g.translate(px, -10 - hop); g.rotate(Math.sin(u * 23 + i) * wob * 2);
      g.fillStyle = "#fff"; g.beginPath(); g.ellipse(0, 0, 40, 11, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = ["#d9822b", "#e5243b", "#6aa84f"][i % 3]; g.beginPath(); g.ellipse(0, -10, 24, 15, 0, Math.PI, 0); g.fill(); g.stroke(); g.restore(); }
    // Glas
    g.save(); g.translate(92, -14); g.fillStyle = "rgba(255,196,60,0.95)"; rr(g, -14, -56, 28, 56, 5); g.fill(); g.stroke(); g.fillStyle = "#fff"; g.beginPath(); g.ellipse(0, -56, 16, 9, 0, 0, 7); g.fill(); g.stroke(); g.restore();
    g.restore(); }
  function cup(g, h) { g.save(); g.translate(h[0], h[1] - 10); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#fff"; g.beginPath(); g.ellipse(0, 22, 46, 10, 0, 0, 7); g.fill(); g.stroke(); rr(g, -26, -34, 52, 52, 10); g.fill(); g.stroke();
    g.beginPath(); g.arc(30, -10, 13, -1.4, 1.4); g.stroke(); g.fillStyle = "#6b3a1a"; g.beginPath(); g.ellipse(0, -32, 22, 6, 0, 0, 7); g.fill(); g.restore(); }
  function steam(g, x, y, u, a = 1) { if (a <= 0) return; g.save(); g.strokeStyle = `rgba(255,255,255,${0.6 * a})`; g.lineWidth = 6; g.lineCap = "round"; for (let i = 0; i < 3; i++) { const k = (u * 0.8 + i / 3) % 1; g.globalAlpha = Math.sin(k * Math.PI); g.beginPath(); g.moveTo(x + (i - 1) * 22, y - k * 70); g.quadraticCurveTo(x + (i - 1) * 22 + 14, y - 20 - k * 70, x + (i - 1) * 22, y - 40 - k * 70); g.stroke(); } g.restore(); }
  function stand(g, x, y) { // Tischaufsteller, nur Rückseite (Holz, leer)
    g.save(); g.lineWidth = 5; g.strokeStyle = OL; g.fillStyle = "#7a4a2a"; rr(g, x - 40, y - 14, 80, 16, 4); g.fill(); g.stroke(); g.fillStyle = "#efe2c8"; rr(g, x - 30, y - 92, 60, 80, 5); g.fill(); g.stroke(); g.strokeStyle = "#c9a878"; g.lineWidth = 3; rr(g, x - 22, y - 84, 44, 64, 3); g.stroke(); g.restore(); }
  function table(g, u, T, o) { // o: food 0..1, happy, sign
    const x = T.x;
    T.g.forEach((gg, i) => { const gx = x + (i ? 85 : -85); SK.person(g, gx, BASE, 0.78, { ...gg, sit: true, mouth: o.happy ? "grin" : o.wait ? "flat" : "smile", eyes: o.happy ? "happy" : "dot", look: i ? -0.6 : 0.6, aL: o.happy && i ? -0.6 : 1.2, aR: o.happy && !i ? -0.6 : 1.2, eR: o.happy && !i ? -0.8 : 0, eL: o.happy && i ? -0.8 : 0, bob: o.happy ? -Math.abs(Math.sin(u * 7 + i)) * 8 : 0 }); });
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#fbf6e8"; g.beginPath(); g.moveTo(x - 190, 1050); g.lineTo(x + 190, 1050); g.lineTo(x + 220, 1290); g.lineTo(x - 220, 1290); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#e5243b"; g.fillRect(x - 196, 1050, 392, 18); g.strokeRect(x - 196, 1050, 392, 18);
    g.strokeStyle = "rgba(229,36,59,0.35)"; g.lineWidth = 4; for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(x + k * 52, 1068); g.lineTo(x + k * 60, 1288); g.stroke(); }
    g.strokeStyle = OL; g.lineWidth = 8;
    // Kerze + Aufsteller
    g.fillStyle = "#fff6d8"; rr(g, x - 128, 1000, 16, 50, 4); g.fill(); g.stroke(); const fl = 1 + 0.12 * Math.sin(u * 13 + x); g.fillStyle = "#ffb000"; g.beginPath(); g.ellipse(x - 120, 990, 7 * fl, 14 * fl, 0, 0, 7); g.fill();
    stand(g, x + 120, 1052);
    // Essen
    const fk = o.food || 0; if (fk > 0) { const e = outBack(cl(fk), 2.5); [-50, 40].forEach((px, i) => { g.save(); g.translate(x + px, 1046); g.scale(e, e); g.fillStyle = "#fff"; g.beginPath(); g.ellipse(0, 0, 50, 13, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = ["#d9822b", "#6aa84f"][i]; g.beginPath(); g.ellipse(0, -10, 30, 18, 0, Math.PI, 0); g.fill(); g.stroke(); g.restore(); steam(g, x + px, 1010, u + i * 0.4, cl(fk) * 0.9); }); }
    // Nummernschild an der Decke
    if (o.sign !== false) { const sw = Math.sin(u * 2.2 + x) * 0.04 + (o.swing || 0); g.save(); g.translate(x, 380); g.rotate(sw); g.strokeStyle = "#2b1d14"; g.lineWidth = 5; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-60, 170); g.moveTo(60, 0); g.lineTo(60, 170); g.stroke();
      g.lineWidth = 8; g.strokeStyle = OL; fillRR(g, -105, 170, 210, 150, 16, "#f6e7c8"); rr(g, -105, 170, 210, 150, 16); g.stroke(); g.strokeStyle = "#c9a14a"; g.lineWidth = 4; rr(g, -92, 183, 184, 124, 10); g.stroke();
      g.font = "400 30px S"; g.fillStyle = "#6b4a2a"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("TISCH", 0, 205); g.font = "900 92px D"; g.fillStyle = "#1f2a44"; g.fillText(T.n, 0, 262); g.restore(); }
  }
  function lamp(g, x, on) { g.save(); g.strokeStyle = "#1d120c"; g.lineWidth = 5; g.beginPath(); g.moveTo(x, 330); g.lineTo(x, 470); g.stroke(); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = "#2f5e4e"; g.beginPath(); g.moveTo(x - 60, 520); g.lineTo(x - 24, 470); g.lineTo(x + 24, 470); g.lineTo(x + 60, 520); g.closePath(); g.fill(); g.stroke();
    circle(g, x, 524, 14, `rgba(255,236,190,${on})`); const lg = g.createRadialGradient(x, 540, 5, x, 800, 520); lg.addColorStop(0, `rgba(255,205,130,${0.32 * on})`); lg.addColorStop(1, "rgba(255,205,130,0)"); g.fillStyle = lg; g.beginPath(); g.moveTo(x - 50, 524); g.lineTo(x + 50, 524); g.lineTo(x + 380, 1300); g.lineTo(x - 380, 1300); g.closePath(); g.fill(); g.restore(); }
  function cook(g, u, push, show = true) { // Koch hinter der Durchreiche (zugeschnitten)
    if (show) { g.save(); g.beginPath(); g.rect(HATCH - 150, 780, 300, 250); g.clip();
    SK.person(g, HATCH, 1290, 0.72, { ...CHEF, mouth: "grin", eyes: "happy", aL: -0.3 - 0.4 * push, aR: -0.3 - 0.4 * push, eL: 0.6, eR: 0.6 }); toque(g, HATCH, 1290, 0.72); g.restore(); }
    // Theke mit Glocke und Tellern
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#c9ced8"; g.fillRect(HATCH - 175, 1020, 350, 26); g.strokeRect(HATCH - 175, 1020, 350, 26);
    [-90, 0].forEach((px, i) => { g.fillStyle = "#fff"; g.beginPath(); g.ellipse(HATCH + px, 1016, 42, 11, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = ["#d9822b", "#e5243b"][i]; g.beginPath(); g.ellipse(HATCH + px, 1006, 24, 15, 0, Math.PI, 0); g.fill(); g.stroke(); steam(g, HATCH + px, 980, u + i * 0.5, 0.8); });
    g.fillStyle = "#e0b040"; g.beginPath(); g.arc(HATCH + 100, 1012, 26, Math.PI, 0); g.closePath(); g.fill(); g.stroke(); circle(g, HATCH + 100, 984, 6, "#e0b040"); g.stroke();
  }
  function zzz(g, x, y, u, k) { if (k <= 0) return; for (let i = 0; i < 3; i++) { const t = ((u * 0.7 + i / 3) % 1); g.save(); g.translate(x - t * 140 + Math.sin(u * 3 + i) * 12, y - t * 220); g.rotate(-0.2); g.globalAlpha = k * Math.sin(t * Math.PI);
    g.font = `900 ${60 + t * 40}px D`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 10; g.strokeStyle = OL; g.lineJoin = "round"; g.strokeText("Z", 0, 0); g.fillStyle = "#9fd3ff"; g.fillText("Z", 0, 0); g.restore(); } }
  function kmBadge(g, km, k, pulse) { if (k <= 0) return; const e = outBack(cl(k), 2); g.save(); g.translate(540, 160); g.scale(e * (1 + pulse * 0.12), e * (1 + pulse * 0.12)); g.rotate(-0.03);
    g.lineWidth = 8; g.strokeStyle = OL; shadow(g, 0, 10, "rgba(0,0,0,0.3)"); fillRR(g, -260, -84, 520, 168, 26, "#1f4fa8"); noShadow(g); rr(g, -260, -84, 520, 168, 26); g.stroke();
    g.strokeStyle = "#fff"; g.lineWidth = 5; rr(g, -244, -68, 488, 136, 18); g.stroke();
    // Läufer-Piktogramm
    g.save(); g.translate(-190, 2); g.strokeStyle = "#fff"; g.lineWidth = 12; g.lineCap = "round"; circle(g, 10, -44, 13, "#fff"); g.beginPath(); g.moveTo(4, -26); g.lineTo(-8, 12); g.lineTo(18, 46); g.moveTo(-8, 12); g.lineTo(-34, 40); g.moveTo(0, -16); g.lineTo(28, -2); g.moveTo(0, -16); g.lineTo(-28, -6); g.stroke(); g.restore();
    g.textAlign = "right"; g.textBaseline = "middle"; g.fillStyle = "#ffffff"; g.font = "900 96px D"; g.fillText(km.toFixed(1).replace(".", ","), 130, 6); g.textAlign = "left"; g.font = "900 50px D"; g.fillStyle = "#ffd34d"; g.fillText("km", 144, 22); g.restore(); }
  function dust(g, x, y, u, a) { if (a <= 0) return; for (let i = 0; i < 5; i++) { const t = (u * 3 + i / 5) % 1; circle(g, x + t * 160 * (i % 2 ? 1 : 0.7), y - t * 30 - i * 4, (1 - t) * 26 + 6, `rgba(230,215,195,${0.55 * a * (1 - t)})`); } }

  TYPES.h_marathon = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 4.2, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.mara = f(/^marathon/, 0, 1.4); T.t1 = f(/^tisch/, T.mara, T.mara + 0.7); T.k1 = f(/^küche/, T.t1, T.t1 + 0.8); T.t7 = f(/^tisch/, T.k1, T.k1 + 0.6); T.k2 = f(/^küche/, T.t7, T.t7 + 0.8); T.t12 = f(/^tisch/, T.k2, T.k2 + 0.6);
      T.nach = f(/^nach$/, T.t12, T.t12 + 1.0); T.chef = f(/^chef/, T.nach, T.nach + 1.0); T.med = f(/^medaille/, T.chef, T.chef + 0.6); T.schl = f(/^schläft/, T.med, T.med + 1.0); T.steh = f(/^stehen/, T.schl, T.schl + 0.5);
      T.heute = f(/^heute/, T.steh, T.steh + 0.9); T.gem = f(/^gemütlich/, T.heute, T.heute + 0.8); T.gae = f(/^gäste/, T.gem, T.gem + 0.6); T.schn = f(/^schneller/, T.gae, T.gae + 0.6); T.essen = f(/^essen/, T.schn, T.schn + 0.5);
      T.denn = f(/^denn/, T.essen, T.essen + 0.6);
      T.bB = T.nach - 0.15; T.bC = T.heute - 0.2;
      // Laufweg: Haltepunkte (Ankunft kurz vor dem Wort)
      T.stops = [[-0.3, 2350], [T.t1 - 0.08, 520], [T.k1 - 0.08, 1060], [T.t7 - 0.08, 2120], [T.k2 - 0.08, 1060], [T.t12 - 0.08, -170]];
      p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const ph = u < T.bB ? 1 : u < T.bC ? 2 : 3;
      const K = (t, z, x) => ({ t, z, x, y: LANE - 490 / z });
      g.fillStyle = "#1d120c"; g.fillRect(0, 0, W, H);
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      if (ph === 1) { // Sprint
        // Tim-Position aus den Haltepunkten
        const S = T.stops; let tx = S[0][1], run = 0, dir = -1, arrive = -1;
        for (let i = 1; i < S.length; i++) { const a = S[i - 1][0] + (i > 1 ? 0.14 : 0), b = S[i][0];
          if (u >= a && u < b) { const k = (u - a) / (b - a); tx = lerp(S[i - 1][1], S[i][1], i === 1 ? k : inOut(k) * 0.85 + k * 0.15); run = 1; dir = Math.sign(S[i][1] - S[i - 1][1]); }
          else if (u >= b) { tx = S[i][1]; dir = Math.sign(S[i][1] - S[i - 1][1]); arrive = i; run = u < b + 0.14 ? 0.3 : 1; } }
        if (u > S[S.length - 1][0]) run = 0.15;
        const camX = tx + dir * 40, z = lerp(1.5, 1.38, seg(u, T.mara - 0.3, T.mara + 0.4));
        const c = { z, x: camX, y: LANE - 490 / z };
        // weicher Kameranachlauf: kleine Neigung beim Spurt
        g.save(); SK.apply(g, c);
        room(g, u, 1); [-650, 50, 760, 1650, 2400].forEach((lx) => lamp(g, lx, 1));
        cook(g, u, Math.max(1 - cl(Math.abs(u - T.k1) / 0.3), 1 - cl(Math.abs(u - T.k2) / 0.3)));
        door(g, 0.15 + 0.1 * Math.sin(u * 3));
        TABLES.forEach((tb, i) => { const at = tb.n === "1" ? T.t1 : tb.n === "7" ? T.t7 : tb.n === "12" ? T.t12 : 0; const fk = seg(u, at - 0.05, at + 0.2);
          table(g, u, tb, { food: fk, happy: fk > 0.5, wait: fk <= 0.5, swing: Math.sin(u * 9) * 0.08 * (1 - cl(Math.abs(u - at) / 0.5)) * (fk > 0 ? 1 : 0) }); });
        // Speed-Linien hinter Tim
        if (run > 0.5) { g.save(); g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineCap = "round"; for (let i = 0; i < 9; i++) { const yy = LANE - 120 - i * 52, len = 160 + rnd(i * 3.1) * 220, off = ((u * 9 + rnd(i)) % 1) * 60; g.lineWidth = 6 + (i % 3) * 3; g.beginPath(); g.moveTo(tx - dir * (150 + off), yy); g.lineTo(tx - dir * (150 + off + len), yy); g.stroke(); } g.restore(); }
        dust(g, tx - dir * 60, LANE, u, run > 0.5 ? 1 : 0);
        const wob = run > 0.5 ? Math.sin(u * 17) * 0.09 : Math.sin(u * 30) * 0.03 * (1 - cl((u - (S[Math.max(1, arrive)] || [0])[0]) / 0.3));
        const st = u * 19; const bob = run > 0.5 ? -Math.abs(Math.sin(st)) * 26 : 0;
        SK.person(g, tx, LANE, 0.88, { ...TIM, flip: dir < 0, walk: run > 0.5 ? st : 0, mouth: run > 0.5 ? "open" : "o", eyes: run > 0.5 ? "dot" : "wide", brow: -0.6, red: 0.55 + 0.3 * seg(u, T.t1, T.t12), t: u,
          aL: run > 0.5 ? 1.25 + Math.sin(st) * 0.9 : 1.35, eL: run > 0.5 ? -0.9 : 0, aR: 0.25, eR: -1.75, bob, hold: (q, hR) => tray(q, hR, u, wob, 2) });
        bib(g, tx, LANE + bob, 0.88);
        g.restore();
        // Kilometer-Anzeige zählt bis 42,2
        const kmk = seg(u, T.mara - 0.15, T.mara + 0.2), kmv = 42.2 * inOut(seg(u, T.mara, T.nach - 0.35));
        kmBadge(g, kmv, kmk, 1 - cl(Math.abs(u - (T.nach - 0.3)) / 0.2));
        SK.pow(g, "LOS!", 250, 560, (u + 0.12) / 0.75, { px: 130, rot: -0.14 });
      } else if (ph === 2) { // nach der Schicht: Medaille, Tim schläft im Stehen
        const su = u - T.bB;
        const c = SK.cam([K(T.bB, 1.3, 720), K(T.med, 1.55, 730), K(T.schl + 0.2, 1.62, 720), K(T.bC, 1.66, 720)], u);
        g.save(); SK.apply(g, c);
        room(g, u, 0); lamp(g, 760, 1); [-650, 50, 1650].forEach((lx) => lamp(g, lx, 0.1)); cook(g, u, 0, false); door(g, seg(u, T.bB, T.bB + 0.3) * (1 - seg(u, T.chef - 0.2, T.chef + 0.3)));
        g.save(); g.fillStyle = "rgba(8,8,24,0.28)"; g.fillRect(-1400, -1000, 4800, 3400); g.restore();
        TABLES.forEach((tb) => table(g, u, { ...tb, g: [] }, { sign: true }));
        const walk = seg(u, T.bB + 0.1, T.chef - 0.05), cx = lerp(1260, 860, inOut(walk));
        const hang = out3(seg(u, T.med - 0.35, T.med + 0.05)); const sleep = seg(u, T.schl - 0.15, T.schl + 0.1);
        const sway = Math.sin(u * 2.2) * 0.05 * sleep;
        g.save(); g.translate(640, LANE); g.rotate(sway); g.translate(-640, -LANE);
        SK.person(g, 640, LANE, 0.88, { ...TIM, mouth: sleep > 0.5 ? "o" : "flat", eyes: sleep > 0.5 ? "closed" : "dot", brow: sleep > 0.5 ? 0 : -0.8, red: sleep > 0.5 ? 0 : 0.6, t: u, aL: 1.48, aR: 1.48, bob: Math.sin(u * 2.2) * 4 });
        bib(g, 640, LANE, 0.88); if (hang >= 1) medalOn(g, 640, LANE, 0.88);
        g.restore();
        SK.person(g, cx, LANE, 0.9, { ...CHEF, flip: true, walk: walk < 1 ? u * 10 : 0, mouth: u > T.schl + 0.3 ? "o" : "grin", eyes: u > T.schl + 0.3 ? "wide" : "happy", aL: hang < 1 && u > T.med - 0.5 ? -0.5 : 1.3, eL: hang < 1 && u > T.med - 0.5 ? 0.5 : 0, aR: 1.3 });
        toque(g, cx, LANE, 0.9, true);
        if (hang < 1 && u > T.med - 0.5) { const sx = lerp(cx - 150, 640, hang), sy = lerp(LANE - 470, LANE - 300 * 0.88, hang); medal(g, sx, sy, 1.0, Math.sin(u * 8) * 0.2); }
        g.restore();
        const [tx2, ty2] = SK.toScreen(c, 640, LANE - 560); const [cx2, cy2] = SK.toScreen(c, cx, LANE - 470);
        confetti(g, 540, 380, u - T.med + 0.05, 80, ["#ffd34d", "#e5243b", "#2f6f8f", "#3d9a6b", "#ffffff"], 650, 4);
        if (hang >= 1) sparkles(g, SK.toScreen(c, 640, LANE - 300 * 0.88)[0], SK.toScreen(c, 640, LANE - 300 * 0.88)[1], u, 6, 80, "#fff2a8", 7);
        const [, qy] = SK.toScreen(c, cx, LANE - 0.9 * 760); const bx = Math.min(820, Math.max(300, cx2 + 40));
        SK.bubble(g, ["Gut gelaufen,", "*Tim*!"], bx, qy - 110, cx2 - 20, qy + 10, win(T.chef - 0.05, T.schl + 0.2), { px: 50 });
        SK.bubble(g, ["…*Tim*?"], bx, qy - 90, cx2 - 20, qy + 10, win(T.steh - 0.1, T.bC + 0.05), { px: 56 });
        zzz(g, tx2 - 60, ty2 - 20, u, seg(u, T.schl - 0.1, T.schl + 0.3));
        SK.flashAt(g, u, [T.bB], 0.09, 0.6);
      } else { // heute: gemütlich, Gäste strahlen, Essen ist schon da
        const dive = inExpo(cl((u - T.denn - 0.08) / Math.max(0.3, d - T.denn - 0.08)));
        const c = SK.cam([K(T.bC, 1.5, 820), K(T.gem + 0.3, 1.4, 790), K(T.gae + 0.1, 1.05, 480), K(T.essen + 0.1, 1.1, 480), K(T.denn, 1.15, 500)], u);
        if (dive > 0) { const k = inOut(cl((u - T.denn) / 0.35)); c.x = lerp(c.x, 520, k); c.y = lerp(c.y, 1000, k); c.z *= 1 + dive * 28; }
        g.save(); SK.apply(g, c);
        room(g, u, 2); [-650, 50, 760, 1650].forEach((lx) => lamp(g, lx, 1)); cook(g, u, 0); door(g, 0);
        const fk = seg(u, T.schn - 0.1, T.schn + 0.25), hap = u > T.gae - 0.2;
        table(g, u, TABLES[0], { food: seg(u, T.schn + 0.05, T.schn + 0.35), happy: hap });
        table(g, u, TABLES[1], { food: fk, happy: hap });
        const wk = seg(u, T.bC, T.gae + 0.4), tx = lerp(900, 770, wk);
        SK.person(g, tx, LANE, 0.88, { ...TIM, flip: true, walk: wk < 1 ? u * 4.5 : 0, mouth: u > T.essen ? "grin" : "smile", eyes: "happy", t: u, aR: 0.35, eR: -1.6, aL: 1.3, bob: -Math.abs(Math.sin(u * 4.5)) * 5 * (wk < 1 ? 1 : 0), hold: (q, hR) => cup(q, hR) });
        bib(g, tx, LANE, 0.88); medalOn(g, tx, LANE, 0.88);
        const [cx3, cy3] = SK.toScreen(c, tx + 40, LANE - 520);
        steam(g, 0, 0, u, 0);
        g.restore();
        if (u < T.gae) { const [sx, sy] = SK.toScreen(c, tx - 150, LANE - 470); steam(g, sx, sy, u, 1); }
        sparkles(g, SK.toScreen(c, 400, 1000)[0], SK.toScreen(c, 400, 1000)[1], u, 10 * fk, 260, "#fff2a8", 9);
        const [gx, gy] = SK.toScreen(c, 315, 900), [hx, hy] = SK.toScreen(c, 485, 900);
        SK.bubble(g, ["Schon *da*?!"], 250, 830, gx, gy, win(T.schn + 0.05, T.denn + 0.05) * (1 - dive * 4), { shout: true, px: 54 });
        SK.bubble(g, ["*Lecker*!"], 700, 790, hx + 20, hy - 20, win(T.essen - 0.05, T.denn + 0.05) * (1 - dive * 4), { px: 50 });
        SK.bubble(g, ["Noch einen", "*Kaffee*?"], 790, 470, cx3, cy3, win(T.gem - 0.1, T.gae - 0.05), { px: 50 });
        SK.speedLines(g, 540, 960, seg(u, T.denn - 0.05, T.denn + 0.2) * (1 - dive * 2), "rgba(255,211,77,");
        SK.flashAt(g, u, [T.bC], 0.09, 0.6);
      }
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T, S = T.stops, E = [[0.0, "flash", 0.7, 0], [0.0, "pop", 0.5, 0], [0.12, "slap", 0.5, 0], [0.02, "whoosh_side", 0.45, -0.3]];
      for (let t = 0.05; t < T.t12 + 0.1; t += 0.13) { if (!S.some((s) => t > s[0] && t < s[0] + 0.14)) E.push([t, "click", 0.22, ((t * 7) % 2) - 1]); }
      E.push([T.mara - 0.1, "pop", 0.4, 0], [T.mara, "chime", 0.25, 0]);
      for (let i = 1; i < S.length; i++) { const kitchen = i === 2 || i === 4; E.push([S[i][0], kitchen ? "ding" : "thump", kitchen ? 0.55 : 0.45, 0], [S[i][0] + 0.05, "pop", 0.35, 0.2]); if (i < S.length - 1) E.push([S[i][0] + 0.12, "whoosh_side", 0.35, 0]); }
      E.push([T.nach - 0.32, "slot_win", 0.3, 0], [T.bB, "tr_slow", 0.4, 0], [T.bB + 0.15, "vsteps", 0.35, 0.4], [T.chef - 0.05, "pop", 0.4, 0.3], [T.med - 0.05, "shimmer", 0.45, 0], [T.med, "pop", 0.5, -0.2], [T.med + 0.08, "pop", 0.4, 0.2], [T.med + 0.15, "slot_bells", 0.25, 0]);
      E.push([T.schl - 0.1, "whoosh_down", 0.25, 0], [T.steh - 0.1, "pop", 0.35, 0.3]);
      E.push([T.bC - 0.05, "whoosh_up", 0.35, 0], [T.bC + 0.1, "chime", 0.25, 0], [T.gem - 0.1, "pop", 0.35, 0.3], [T.gae, "tr_swish", 0.3, 0], [T.schn - 0.05, "pop", 0.5, -0.2], [T.schn + 0.08, "pop", 0.45, 0.2], [T.schn + 0.2, "ding", 0.4, 0], [T.essen - 0.05, "pop", 0.35, -0.3]);
      E.push([T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Filmtitel auf dunklem Holz, kleine Medaille schwingt ----------
  TYPES.marathon_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^direkt/, E.sys, 1.4); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      // dunkles Holz: senkrechte Bretter mit Maserung
      for (let i = 0; i < 7; i++) { const x = i * 160 - 20; const gr = g.createLinearGradient(x, 0, x + 160, 0); const b = 0.85 + 0.15 * rnd(i * 4.1); gr.addColorStop(0, `rgb(${Math.round(46 * b)},${Math.round(28 * b)},${Math.round(18 * b)})`); gr.addColorStop(1, `rgb(${Math.round(36 * b)},${Math.round(22 * b)},${Math.round(14 * b)})`); g.fillStyle = gr; g.fillRect(x, 0, 160, H);
        g.strokeStyle = "rgba(0,0,0,0.45)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke();
        g.strokeStyle = "rgba(255,200,140,0.05)"; g.lineWidth = 2; for (let k = 0; k < 6; k++) { g.beginPath(); const ox = x + 20 + k * 22; g.moveTo(ox, 0); for (let y = 0; y <= H; y += 80) g.lineTo(ox + Math.sin(y * 0.004 + i * 2 + k) * 10, y); g.stroke(); } }
      // warmes Licht von oben, Vignette
      const lg = g.createRadialGradient(540, 760, 40, 540, 900, 1100); lg.addColorStop(0, "rgba(255,190,110,0.22)"); lg.addColorStop(1, "rgba(0,0,0,0.6)"); g.fillStyle = lg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 16; i++) { const x = rnd(i * 3.7) * 1080 + Math.sin(u * 0.4 + i) * 16, y = 200 + rnd(i * 5.9) * 1300, r = 30 + rnd(i * 1.3) * 80, a = 0.04 + 0.06 * rnd(i * 8.1); const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(255,200,130,${a})`); gg.addColorStop(1, "rgba(255,200,130,0)"); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      // Medaille an Band, schwingt sanft
      const mk = out3(seg(u, 0.25, 1.0)); if (mk > 0) { const sw = Math.sin(u * 2.1) * 0.07 * mk; g.save(); g.translate(540, -40); g.rotate(sw); g.globalAlpha = mk; const L = lerp(150, 400, mk);
        g.lineWidth = 4; g.strokeStyle = "rgba(0,0,0,0.5)"; for (const sd of [-1, 1]) { g.fillStyle = sd < 0 ? "#24506b" : "#a3242f"; g.beginPath(); g.moveTo(sd * 70, 0); g.lineTo(sd * 30, 0); g.lineTo(sd * 4, L); g.lineTo(sd * 34, L); g.closePath(); g.fill(); }
        g.translate(0, L + 50); const gr = g.createRadialGradient(-14, -16, 4, 0, 0, 60); gr.addColorStop(0, "#fff2b8"); gr.addColorStop(0.6, "#e8b85a"); gr.addColorStop(1, "#9a6a1a"); g.fillStyle = gr; g.shadowColor = "rgba(246,213,138,0.5)"; g.shadowBlur = 30; g.beginPath(); g.arc(0, 0, 56, 0, 7); g.fill(); g.shadowBlur = 0;
        g.strokeStyle = "rgba(120,80,20,0.8)"; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 44, 0, 7); g.stroke(); g.font = "400 46px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#7a5014"; g.fillText("M", 0, 3); g.restore();
        const sh = seg(u, 1.0, 1.6); if (sh > 0 && sh < 1) { sparkles(g, 540, -40 + L + 50, u, 6, 70, "#fff2b8", 5); } }
      SK.endTitle(g, u, d, T, { c: "#f6e7c8", glow: "rgba(246,213,138,0.45)", accent: "#e8b85a", sub: "rgba(255,230,195,0.85)", key: "#f6d58a", offer: "BESTELLEN DIREKT AM TISCH", y: 860 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.1, "shimmer", 0.35, 0], [0.4, "chime", 0.25, 0], [1.0, "shimmer_hi", 0.25, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
