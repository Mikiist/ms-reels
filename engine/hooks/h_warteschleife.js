// h_warteschleife: Neugier-Geschichte (Look "story", Anti-Werbung). Herr Brandt will nur eine kleine Änderung und ruft an.
// „Drücken Sie die 1 / 2“ (Riesen-Zahlen), dann „verbunden“ dreimal mit hartem Schnitt: Stuhl, Sofa, Hängematte, Uhr und Kalender springen.
// Draußen Winter (Schnee), dann Sommer (Sonne), sein Bart wächst im Schaukelstuhl bis zum Boden, Spinnweben am Hörer.
// Splitscreen: rechts die Nachbarin, ein „RING!“, Sprechblase „Hallo?“, sie strahlt; links starrt Brandt ungläubig.
// Bei „Denn“ füllt ihr Bild den Schirm, die Kamera taucht in ihren Hörer, Weiß. Danach warteschleife_end (Hörer am Spiralkabel, Filmtitel).
// Wörter: änderung, ruft, eins, zwei, verbunden (3x), draußen, winter, sommer, bart, boden, nachbarin, ruft, klingeln, hallo, denn.
(() => {
  const OL = SK.OL;
  const pc = (a) => a[0] === "#" ? [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)) : a.match(/[\d.]+/g).slice(0, 3).map(Number);
  const mix = (a, b, k) => { const pa = pc(a), pb = pc(b); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], cl(k)))).join(",")})`; };
  const S = 0.75, FL = 1140; // Figuren-Maßstab, Fußboden
  const BX = 520, SX = 640;  // Brandt stehend, Brandt sitzend
  const PH = { x: 360, y: 930 }; // Telefon auf dem Beistelltisch (Tischplatte y)
  const BRANDT = { hs: "short", shirt: "#a9cdee", pants: "#3b4256", shoes: "#5a3a26", skin: "#f1c7a1" };
  const NACHBARIN = { hs: "long", hair: "#7a4a2a", shirt: "#e85d75", skirt: "#2f6f8f", pants: "#f1c7a1", shoes: "#8e2f45", skin: "#e8b48f" };
  // Hand am Ohr: rechter Arm (lokal), Hand bei (79, -521)
  const EAR = { aR: -0.8, eR: -1.84 }, HAND = [79, -521];

  // in lokale Figuren-Koordinaten wechseln (wie SK.person)
  function atP(g, x, feet, sit, fn) { g.save(); g.translate(x, feet); g.scale(S, S); g.translate(0, sit ? 140 : 0); fn(g); g.restore(); }
  const wP = (x, feet, sit, lx, ly) => [x + lx * S, feet + (ly + (sit ? 140 : 0)) * S];

  function handset(g, x, y, rot, s, col) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = col;
    rr(g, -14, -66, 28, 132, 14); g.fill(); g.stroke(); rr(g, -40, -96, 56, 52, 20); g.fill(); g.stroke(); rr(g, -40, 44, 56, 52, 20); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.35)"; rr(g, -6, -58, 8, 100, 4); g.fill(); g.fillStyle = OL; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-26, -82 + i * 12, 3, 0, 7); g.arc(-26, 58 + i * 12, 3, 0, 7); g.fill(); } g.restore(); }
  // Spiralkabel von (x1,y1) nach (x2,y2), durchhängend
  function cord(g, x1, y1, x2, y2, sag, col = "#2b2b33") { g.save(); g.strokeStyle = col; g.lineWidth = 5; g.lineCap = "round"; g.beginPath();
    const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + sag, L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(40, Math.floor(L / 3.2));
    for (let i = 0; i <= n; i++) { const t = i / n, a = (1 - t) * (1 - t), b = 2 * t * (1 - t), c = t * t; const px = a * x1 + b * mx + c * x2, py = a * y1 + b * my + c * y2;
      const dx = 2 * (1 - t) * (mx - x1) + 2 * t * (x2 - mx), dy = 2 * (1 - t) * (my - y1) + 2 * t * (y2 - my), dl = Math.hypot(dx, dy) || 1; const ph = t * L / 11 * Math.PI * 2, r = 9;
      const qx = px - dy / dl * Math.sin(ph) * r + dx / dl * Math.cos(ph) * 4, qy = py + dx / dl * Math.sin(ph) * r + dy / dl * Math.cos(ph) * 4; i ? g.lineTo(qx, qy) : g.moveTo(qx, qy); }
    g.stroke(); g.restore(); }
  // Tastentelefon auf dem Tisch. press: Index der gerade gedrückten Taste (-1), hs: Hörer liegt drauf
  function phone(g, x, y, col, press, cob) { g.save(); g.lineWidth = 7; g.strokeStyle = OL;
    g.fillStyle = col; g.beginPath(); g.moveTo(x - 82, y); g.lineTo(x + 82, y); g.lineTo(x + 62, y - 74); g.lineTo(x - 62, y - 74); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = mix(col, "#000000", 0.25); rr(g, x - 60, y - 96, 120, 26, 10); g.fill(); g.stroke();
    g.fillStyle = "#f6f1e3"; rr(g, x - 40, y - 66, 80, 60, 8); g.fill(); g.lineWidth = 4; g.stroke();
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const i = r * 3 + c, bx = x - 26 + c * 26, by = y - 56 + r * 14; g.fillStyle = i === press ? "#ffd34d" : "#3a3f48"; rr(g, bx - 9, by - 5, 18, 10, 3); g.fill(); }
    if (cob > 0) web(g, x + 62, y - 74, 70 * cob, 0.6, cob);
    g.restore(); }
  function web(g, x, y, r, rot, a) { if (a <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = 0.75 * cl(a); g.strokeStyle = "#ffffff"; g.lineWidth = 2;
    for (let i = 0; i <= 5; i++) { const an = i / 5 * Math.PI / 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * r, Math.sin(an) * r); g.stroke(); }
    for (let k = 1; k <= 4; k++) { g.beginPath(); for (let i = 0; i <= 5; i++) { const an = i / 5 * Math.PI / 2, rr2 = r * k / 4.4; const px = Math.cos(an) * rr2, py = Math.sin(an) * rr2; i ? g.quadraticCurveTo(Math.cos(an - 0.16) * rr2 * 0.86, Math.sin(an - 0.16) * rr2 * 0.86, px, py) : g.moveTo(px, py); } g.stroke(); } g.restore(); }
  function note(g, x, y, s, rot, a, c = "#ffd34d") { if (a <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = cl(a); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = c;
    g.beginPath(); g.ellipse(0, 0, 20, 14, -0.4, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.ellipse(46, -10, 20, 14, -0.4, 0, 7); g.fill(); g.stroke();
    g.lineWidth = 7; g.beginPath(); g.moveTo(17, -5); g.lineTo(17, -80); g.lineTo(63, -90); g.lineTo(63, -15); g.stroke(); g.restore(); }
  // Musiknoten steigen aus dem Hörer (Bildschirmkoordinaten)
  function notes(g, x, y, u, a) { if (a <= 0) return; for (let i = 0; i < 3; i++) { const k = (u * 0.7 + i / 3) % 1; note(g, x + 30 + Math.sin(u * 3 + i * 2) * 26 + k * 60, y - 40 - k * 200, 0.55 + 0.2 * (i % 2), Math.sin(u * 2 + i) * 0.3, a * Math.min(1, k * 5) * (1 - k)); } }

  function clock(g, x, y, hr) { g.save(); g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#6b4226"; g.beginPath(); g.arc(x, y, 84, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#fbf6e8"; g.beginPath(); g.arc(x, y, 68, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OL; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.arc(x + Math.sin(a) * 54, y - Math.cos(a) * 54, i % 3 ? 3 : 6, 0, 7); g.fill(); }
    const ha = (hr % 12) / 12 * Math.PI * 2, ma = (hr % 1) * Math.PI * 2; g.lineCap = "round"; g.lineWidth = 9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ha) * 34, y - Math.cos(ha) * 34); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ma) * 52, y - Math.cos(ma) * 52); g.stroke(); g.fillStyle = "#e5243b"; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); g.restore(); }
  function calendar(g, x, y, month, flip) { g.save(); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#fffdf6"; rr(g, x - 80, y - 90, 160, 190, 10); g.fill(); g.stroke();
    g.fillStyle = "#e5243b"; rr(g, x - 80, y - 90, 160, 50, 10); g.fill(); g.stroke(); g.font = "900 26px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText(month, x, y - 64);
    g.fillStyle = "#9aa1ab"; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) g.fillRect(x - 62 + c * 26, y - 22 + r * 26, 16, 14);
    g.fillStyle = OL; g.beginPath(); g.arc(x - 40, y - 96, 6, 0, 7); g.arc(x + 40, y - 96, 6, 0, 7); g.fill();
    if (flip > 0 && flip < 1) { g.save(); g.translate(x, y - 90); g.scale(1, Math.cos(flip * Math.PI)); g.fillStyle = "#fffdf6"; rr(g, -80, 0, 160, 190, 10); g.fill(); g.stroke(); g.restore(); }
    g.restore(); }

  // Wohnzimmer (Welt). o: wall, wall2, sky (0 Frühling, 1 Winter, 2 Sommer als Gewichte w, s), hr, month, flip, cob
  function room(g, u, o) {
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = o.wall; g.fillRect(-900, -700, 3000, 1840);
    g.fillStyle = o.wall2; for (let i = -14; i < 30; i++) g.fillRect(i * 90, -700, 34, 1820);
    if (o.dots) { g.fillStyle = o.dots; for (let r = 0; r < 26; r++) for (let c = -10; c < 30; c++) { g.beginPath(); g.arc(c * 90 + 62 + (r % 2) * 45, -660 + r * 70, 7, 0, 7); g.fill(); } }
    // Bilderleiste, Sockelleiste, Dielen
    g.fillStyle = mix(o.wall, "#000000", 0.25); g.fillRect(-900, 150, 3000, 14); g.fillStyle = "#e9dcc4"; g.fillRect(-900, 1100, 3000, 40); g.strokeRect(-900, 1100, 3000, 40);
    g.fillStyle = "#a8743e"; g.fillRect(-900, 1140, 3000, 1300); g.strokeRect(-900, 1140, 3000, 1300);
    g.strokeStyle = "rgba(60,30,10,0.35)"; g.lineWidth = 4; for (let r = 0; r < 12; r++) { const y = 1180 + r * 70; g.beginPath(); g.moveTo(-900, y); g.lineTo(2100, y); g.stroke(); for (let c = -6; c < 14; c++) { const x = c * 230 + (r % 2) * 115; g.beginPath(); g.moveTo(x, y - 70); g.lineTo(x, y); g.stroke(); } }
    g.strokeStyle = OL; g.lineWidth = 8;
    // Teppich
    g.fillStyle = o.rug || "#8e3b46"; g.beginPath(); g.ellipse(640, 1200, 420, 70, 0, 0, 7); g.fill(); g.stroke(); g.strokeStyle = "rgba(255,230,180,0.6)"; g.lineWidth = 5; g.beginPath(); g.ellipse(640, 1200, 370, 52, 0, 0, 7); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    // Fenster mit Jahreszeit
    const wx = 700, wy = 260, ww = 300, wh = 470, w = o.winter || 0, s = o.summer || 0;
    g.save(); g.beginPath(); g.rect(wx, wy, ww, wh); g.clip();
    const sky = g.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, mix(mix("#8fc6ea", "#b9c3cf", w), "#4fb0f0", s)); sky.addColorStop(1, mix(mix("#d8eef8", "#e9edf2", w), "#bfe8ff", s)); g.fillStyle = sky; g.fillRect(wx, wy, ww, wh);
    if (s > 0) { g.fillStyle = `rgba(255,214,80,${s})`; g.beginPath(); g.arc(wx + 220, wy + 110, 52 + Math.sin(u * 3) * 3, 0, 7); g.fill(); g.strokeStyle = `rgba(255,214,80,${s})`; g.lineWidth = 7; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + u * 0.6; g.beginPath(); g.moveTo(wx + 220 + Math.cos(a) * 66, wy + 110 + Math.sin(a) * 66); g.lineTo(wx + 220 + Math.cos(a) * 92, wy + 110 + Math.sin(a) * 92); g.stroke(); } }
    // Hügel und Baum
    g.fillStyle = mix(mix("#7cbf5a", "#f4f7fb", w), "#8fd060", s); g.beginPath(); g.moveTo(wx, wy + 380); g.quadraticCurveTo(wx + 150, wy + 320, wx + ww, wy + 370); g.lineTo(wx + ww, wy + wh); g.lineTo(wx, wy + wh); g.closePath(); g.fill();
    g.strokeStyle = OL; g.lineWidth = 7; g.fillStyle = "#6b4226"; g.beginPath(); g.moveTo(wx + 70, wy + wh); g.lineTo(wx + 84, wy + 200); g.lineTo(wx + 104, wy + 200); g.lineTo(wx + 112, wy + wh); g.closePath(); g.fill(); g.stroke();
    const leaf = 1 - w; if (leaf > 0.02) { g.fillStyle = mix("#3d9a6b", "#4cc26a", s); g.globalAlpha = leaf; [[94, 170, 90], [40, 220, 60], [150, 215, 64], [96, 110, 60]].forEach(([lx, ly, r]) => { g.beginPath(); g.arc(wx + lx, wy + ly, r, 0, 7); g.fill(); g.stroke(); }); g.globalAlpha = 1; }
    if (w > 0) { g.strokeStyle = OL; g.lineWidth = 6; [[94, 200, 30, 120], [94, 200, 160, 140], [94, 240, 20, 190]].forEach(([a, b, c2, d2]) => { g.beginPath(); g.moveTo(wx + a, wy + b); g.lineTo(wx + c2, wy + d2); g.stroke(); });
      g.fillStyle = `rgba(255,255,255,${w})`; for (let i = 0; i < 46; i++) { const fx = wx + ((rnd(i * 3.3) * ww + Math.sin(u * 2 + i) * 14) % ww), fy = wy + ((rnd(i * 7.1) * wh + u * (90 + rnd(i) * 70)) % wh); g.beginPath(); g.arc(fx, fy, 4 + rnd(i * 2) * 5, 0, 7); g.fill(); }
      g.fillStyle = `rgba(255,255,255,${w})`; g.fillRect(wx, wy + wh - 40, ww, 40); }
    g.restore();
    g.strokeStyle = OL; g.lineWidth = 8; g.fillStyle = "#fbf6ec"; g.strokeRect(wx, wy, ww, wh); g.fillRect(wx + ww / 2 - 9, wy, 18, wh); g.strokeRect(wx + ww / 2 - 9, wy, 18, wh); g.fillRect(wx, wy + 200, ww, 16); g.strokeRect(wx, wy + 200, ww, 16);
    if (w > 0) { g.fillStyle = `rgba(255,255,255,${0.9 * w})`; g.beginPath(); g.ellipse(wx + 75, wy + wh - 6, 70, 16, 0, Math.PI, 0); g.ellipse(wx + 225, wy + wh - 6, 70, 16, 0, Math.PI, 0); g.fill(); }
    g.fillStyle = "#e9dcc4"; rr(g, wx - 30, wy + wh, ww + 60, 26, 6); g.fill(); g.stroke();
    // Vorhänge
    const cur = o.curtain || "#c0392b"; g.fillStyle = cur; [[wx - 70, 1], [wx + ww - 10, -1]].forEach(([cx]) => { g.beginPath(); g.moveTo(cx, wy - 40); g.lineTo(cx + 80, wy - 40); g.quadraticCurveTo(cx + 50, wy + 260, cx + 70, wy + wh + 60); g.lineTo(cx, wy + wh + 60); g.closePath(); g.fill(); g.stroke(); });
    g.fillStyle = "#6b4226"; rr(g, wx - 100, wy - 56, ww + 200, 20, 10); g.fill(); g.stroke();
    if (o.cob > 0) web(g, wx, wy, 120 * o.cob, 0, o.cob);
    // Uhr, Kalender, Bild
    clock(g, 470, 300, o.hr); calendar(g, 250, 520, o.month, o.flip || 0);
    g.fillStyle = "#d9a441"; rr(g, 1080, 380, 170, 210, 8); g.fill(); g.stroke(); g.fillStyle = "#7cc4f0"; rr(g, 1100, 400, 130, 170, 4); g.fill(); g.stroke(); g.fillStyle = "#3d9a6b"; g.beginPath(); g.moveTo(1100, 570); g.lineTo(1150, 480); g.lineTo(1190, 540); g.lineTo(1230, 500); g.lineTo(1230, 570); g.closePath(); g.fill(); g.stroke();
    // Stehlampe rechts, Pflanze
    g.fillStyle = "#2b2b33"; g.fillRect(1046, 640, 10, 500); g.strokeRect(1046, 640, 10, 500); g.fillStyle = "#f2b134"; g.beginPath(); g.moveTo(1000, 650); g.lineTo(1102, 650); g.lineTo(1080, 560); g.lineTo(1022, 560); g.closePath(); g.fill(); g.stroke(); rr(g, 1010, 1120, 82, 22, 8); g.fillStyle = "#2b2b33"; g.fill(); g.stroke();
    g.fillStyle = "#b5651d"; rr(g, 895, 1040, 90, 100, 10); g.fill(); g.stroke(); g.fillStyle = mix("#3d9a6b", "#8a8f5a", o.wilt || 0);
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.42 + Math.sin(u * 1.5 + i) * 0.04 + (o.wilt || 0) * (i < 3 ? -0.6 : 0.6); g.save(); g.translate(940, 1040); g.rotate(a + Math.PI / 2); g.beginPath(); g.ellipse(0, -80, 22, 80, 0, 0, 7); g.fill(); g.stroke(); g.restore(); }
    // Beistelltisch
    g.fillStyle = "#7a4a2a"; rr(g, PH.x - 120, PH.y, 240, 26, 8); g.fill(); g.stroke(); [-100, 84].forEach((lx) => { rr(g, PH.x + lx, PH.y + 26, 16, FL - PH.y - 26, 4); g.fill(); g.stroke(); });
    g.fillStyle = "#5a3a20"; rr(g, PH.x - 100, PH.y + 30, 200, 60, 6); g.fill(); g.stroke(); g.fillStyle = "#d9a441"; g.beginPath(); g.arc(PH.x, PH.y + 60, 7, 0, 7); g.fill(); g.stroke();
  }

  // Möbel unter Brandt (Welt). kind: chair | sofa | hammock | rocker
  function furniture(g, u, kind, front) {
    g.save(); g.lineWidth = 8; g.strokeStyle = OL;
    if (kind === "chair" && !front) SK.chair(g, SX + 12, FL, 0.84, "#3d7f6a");
    if (kind === "sofa" && !front) { g.fillStyle = "#2f6f8f"; rr(g, SX - 210, 790, 420, 230, 40); g.fill(); g.stroke(); g.fillStyle = "#3b86ad"; rr(g, SX - 180, 960, 360, 80, 20); g.fill(); g.stroke(); rr(g, SX - 250, 880, 90, 200, 30); g.fill(); g.stroke(); rr(g, SX + 160, 880, 90, 200, 30); g.fill(); g.stroke();
      g.fillStyle = "#f2b134"; g.save(); g.translate(SX - 120, 900); g.rotate(-0.25); rr(g, -50, -50, 100, 90, 22); g.fill(); g.stroke(); g.restore(); g.fillStyle = "#3a2a20"; [[SX - 220, 1080], [SX + 200, 1080]].forEach(([fx, fy]) => { g.fillRect(fx, fy, 20, 60); g.strokeRect(fx, fy, 20, 60); }); }
    if (kind === "hammock") { const sw = Math.sin(u * 2.2) * 10; if (!front) { g.fillStyle = "#3a3f48"; [[380, 640], [900, 640]].forEach(([hx, hy]) => { g.beginPath(); g.arc(hx, hy, 12, 0, 7); g.fill(); g.stroke(); });
        g.strokeStyle = "#c9b48a"; g.lineWidth = 6; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(380, 640); g.lineTo(470 + sw, 940 + i * 16); g.moveTo(900, 640); g.lineTo(810 + sw, 940 + i * 16); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8;
        g.fillStyle = "#e0703a"; g.beginPath(); g.moveTo(470 + sw, 930); g.quadraticCurveTo(SX + sw, 1110, 810 + sw, 930); g.lineTo(810 + sw, 960); g.quadraticCurveTo(SX + sw, 1140, 470 + sw, 960); g.closePath(); g.fill(); g.stroke(); }
      else { g.fillStyle = "#f2b134"; g.beginPath(); g.moveTo(470 + sw, 945); g.quadraticCurveTo(SX + sw, 1080, 810 + sw, 945); g.lineTo(810 + sw, 975); g.quadraticCurveTo(SX + sw, 1125, 470 + sw, 975); g.closePath(); g.fill(); g.stroke();
        g.strokeStyle = "#c0392b"; g.lineWidth = 6; for (let i = 1; i < 6; i++) { const x = 470 + i * 56 + sw; g.beginPath(); g.moveTo(x, 950 + Math.sin(i / 6 * Math.PI) * 90); g.lineTo(x, 980 + Math.sin(i / 6 * Math.PI) * 100); g.stroke(); } } }
    if (kind === "rocker" && !front) { g.fillStyle = "#8a5a3a"; rr(g, SX - 120, 640, 26, 380, 10); g.fill(); g.stroke(); rr(g, SX - 140, 620, 70, 30, 12); g.fill(); g.stroke();
      for (let i = 0; i < 4; i++) { rr(g, SX - 116, 680 + i * 80, 26, 16, 6); g.fill(); g.stroke(); }
      rr(g, SX - 120, 990, 250, 28, 10); g.fill(); g.stroke(); rr(g, SX - 110, 1018, 18, 100, 6); g.fill(); g.stroke(); rr(g, SX + 100, 1018, 18, 100, 6); g.fill(); g.stroke();
      g.lineWidth = 12; g.beginPath(); g.moveTo(SX - 190, 1100); g.quadraticCurveTo(SX, 1170, SX + 190, 1100); g.stroke(); g.lineWidth = 6; g.strokeStyle = "#8a5a3a"; g.stroke(); g.strokeStyle = OL; g.lineWidth = 8; }
    g.restore();
  }

  // Herr Brandt. o: sit, beard (0..1, 1 = bis zum Boden), grey 0..1, press (0..1 linke Hand drückt), eyes, mouth, brow, look, cob
  function brandt(g, u, x, o) {
    const sit = !!o.sit, hair = mix("#5b3a23", "#d9d9de", o.grey || 0), bc = mix("#6b4a30", "#e6e6ea", o.grey || 0), pk = o.press || 0;
    SK.person(g, x, FL, S, { ...BRANDT, hair, sit, ...EAR, aL: lerp(1.3, 0.2, pk), eL: lerp(0, -1.2, pk), eyes: o.eyes || "dot", mouth: o.mouth || "smile", brow: o.brow || 0, look: o.look || 0, glasses: true, t: u });
    atP(g, x, FL, sit, (q) => {
      // Krawatte
      q.lineWidth = 7; q.strokeStyle = OL; q.fillStyle = "#c0392b"; q.beginPath(); q.moveTo(-16, -466); q.lineTo(16, -466); q.lineTo(9, -446); q.lineTo(-9, -446); q.closePath(); q.fill(); q.stroke();
      q.beginPath(); q.moveTo(-9, -446); q.lineTo(9, -446); q.lineTo(20, -320); q.lineTo(0, -296); q.lineTo(-20, -320); q.closePath(); q.fill(); q.stroke();
      q.strokeStyle = "rgba(255,255,255,0.5)"; q.lineWidth = 5; for (let i = 0; i < 3; i++) { q.beginPath(); q.moveTo(-14, -410 + i * 36); q.lineTo(14, -428 + i * 36); q.stroke(); }
      // Bart: Stoppeln bis Rauschebart bis zum Boden
      const b = o.beard || 0; if (b > 0.01) { const top = -500, len = 30 + b * ((sit ? -140 : 0) + 520 + 20); const wd = 66 + b * 8; q.lineWidth = 7; q.strokeStyle = OL; q.fillStyle = bc;
        q.beginPath(); q.moveTo(-64, -540); q.quadraticCurveTo(-74, top + 10, -wd * 0.9, top + len * 0.35); q.quadraticCurveTo(-wd, top + len * 0.8, -wd * 0.5 + Math.sin(u * 2) * 8, top + len);
        if (b > 0.9) { q.quadraticCurveTo(-wd * 0.3 - 80, top + len + 6, -wd - 60, top + len + 10); q.lineTo(wd + 70, top + len + 10); q.quadraticCurveTo(wd * 0.3 + 60, top + len + 4, wd * 0.5, top + len - 4); }
        else q.quadraticCurveTo(0, top + len + 30, wd * 0.5 + Math.sin(u * 2 + 1) * 8, top + len);
        q.quadraticCurveTo(wd, top + len * 0.8, wd * 0.9, top + len * 0.35); q.quadraticCurveTo(74, top + 10, 64, -540); q.quadraticCurveTo(30, -500, 0, -505); q.quadraticCurveTo(-30, -500, -64, -540); q.closePath(); q.fill(); q.stroke();
        q.strokeStyle = mix("#3b2614", "#a7a7b0", o.grey || 0); q.lineWidth = 4; for (let i = 0; i < 7; i++) { const lx = -wd * 0.6 + i * wd * 0.2; q.beginPath(); q.moveTo(lx, top + 30); q.quadraticCurveTo(lx + Math.sin(u * 2 + i) * 10, top + len * 0.5, lx * 0.7, top + len * 0.9); q.stroke(); }
        // Schnurrbart, Mund bleibt sichtbar
        q.fillStyle = bc; q.strokeStyle = OL; q.lineWidth = 6; q.beginPath(); q.ellipse(-20, -517, 26, 11, 0.25, 0, 7); q.fill(); q.stroke(); q.beginPath(); q.ellipse(20, -517, 26, 11, -0.25, 0, 7); q.fill(); q.stroke();
        if (o.mouth === "o") { q.fillStyle = "#7a1f2a"; q.beginPath(); q.ellipse(0, -492, 12, 16, 0, 0, 7); q.fill(); q.stroke(); } }
      // Hörer am Ohr, Hand darüber
      handset(q, 82, -528, -0.15, 1.0, "#4f9a6a"); if (o.cob > 0) web(q, 60, -620, 90 * o.cob, 0.2, o.cob);
      q.fillStyle = BRANDT.skin; q.lineWidth = 8; q.strokeStyle = OL; q.beginPath(); q.arc(HAND[0] + 4, HAND[1] + 6, 22, 0, 7); q.fill(); q.stroke();
    });
    const sit2 = sit; const bot = wP(x, FL, sit2, 92, -460); return { bot, ear: wP(x, FL, sit2, 70, -600), head: wP(x, FL, sit2, 0, -560) };
  }
  // Nachbarin mit Hörer
  function neighbor(g, u, x, o) { const pk = o.press || 0, hap = o.happy || 0;
    SK.person(g, x, FL, S, { ...NACHBARIN, ...EAR, aL: lerp(1.3, 0.2, pk), eL: lerp(0, -1.2, pk), eyes: hap > 0.5 ? "happy" : "dot", mouth: hap > 0.5 ? "grin" : "smile", bob: hap > 0.5 ? -Math.abs(Math.sin(u * 9)) * 14 : 0, t: u });
    const bob = hap > 0.5 ? -Math.abs(Math.sin(u * 9)) * 14 : 0;
    atP(g, x, FL + bob, false, (q) => { handset(q, 82, -528, -0.15, 1.0, "#d64550"); q.fillStyle = NACHBARIN.skin; q.lineWidth = 8; q.strokeStyle = OL; q.beginPath(); q.arc(HAND[0] + 4, HAND[1] + 6, 22, 0, 7); q.fill(); q.stroke(); });
    return { bot: wP(x, FL + bob, false, 92, -460), ear: wP(x, FL + bob, false, 70, -600), head: wP(x, FL + bob, false, 0, -560) };
  }

  const ROOM_B = { wall: "#d9c9a8", wall2: "rgba(255,255,255,0.18)", curtain: "#c0392b", rug: "#8e3b46" };
  const ROOM_N = { wall: "#f4d58d", wall2: "rgba(255,255,255,0.22)", dots: "rgba(232,93,117,0.35)", curtain: "#3d9a6b", rug: "#2f6f8f", summer: 1, hr: 10.2, month: "JULI" };

  // Brandts ganzes Bild (Welt), liefert Hörer-Punkte
  function brandtWorld(g, u, st) {
    room(g, u, { ...ROOM_B, winter: st.winter, summer: st.summer, hr: st.hr, month: st.month, flip: st.flip, cob: st.cob, wilt: st.wilt });
    const sit = st.kind !== "stand", x = sit ? SX : BX;
    let rot = 0; if (st.kind === "rocker") rot = Math.sin(u * 2.4) * 0.045;
    // Kabel vom Telefon zum Hörer (unter der Figur)
    g.save(); if (rot) { g.translate(SX, FL); g.rotate(rot); g.translate(-SX, -FL); }
    furniture(g, u, st.kind, false);
    const bb = wP(x, FL, sit, 92, -460);
    g.restore();
    cord(g, PH.x - 70, PH.y - 50, bb[0] + (rot ? (FL - bb[1]) * -rot : 0), bb[1], sit ? 160 : 90);
    phone(g, PH.x, PH.y, "#4f9a6a", st.pressKey != null ? st.pressKey : -1, st.cob || 0);
    g.save(); if (rot) { g.translate(SX, FL); g.rotate(rot); g.translate(-SX, -FL); }
    const P = brandt(g, u, x, { sit, beard: st.beard, grey: st.grey, press: st.press, eyes: st.eyes, mouth: st.mouth, brow: st.brow, look: st.look, cob: st.cob });
    furniture(g, u, st.kind, true);
    g.restore();
    if (rot) { const rp = (p) => { const dx = p[0] - SX, dy = p[1] - FL; return [SX + dx * Math.cos(rot) - dy * Math.sin(rot), FL + dx * Math.sin(rot) + dy * Math.cos(rot)]; }; return { bot: rp(P.bot), ear: rp(P.ear), head: rp(P.head) }; }
    return P;
  }

  const cam2 = (g, c, px, sx = 0, sy = 0) => { g.translate(px + sx, 960 + sy); g.scale(c.z, c.z); g.translate(-c.x, -c.y); };
  const scr = (c, px, x, y) => [(x - c.x) * c.z + px, (y - c.y) * c.z + 960];

  TYPES.h_warteschleife = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 16.6, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.aend = f(/^änderung/, 0, 1.85); T.ruft = f(/^ruft/, T.aend, 3.0); T.d1 = f(/^drücken/, T.ruft, 3.95); T.eins = f(/^eins/, T.d1, T.d1 + 0.6); T.d2 = f(/^drücken/, T.eins, T.eins + 0.9); T.zwei = f(/^zwei/, T.d2, T.d2 + 0.5);
      T.v1 = f(/^verbunden/, T.zwei, T.zwei + 1.2); T.v2 = f(/^verbunden/, T.v1 + 0.2, T.v1 + 1.2); T.v3 = f(/^verbunden/, T.v2 + 0.2, T.v2 + 1.6);
      T.drau = f(/^draußen/, T.v3, T.v3 + 1.4); T.winter = f(/^winter/, T.drau, T.drau + 0.8); T.sommer = f(/^sommer/, T.winter, T.winter + 1.3); T.bart = f(/^bart/, T.sommer, T.sommer + 1.1); T.boden = f(/^boden/, T.bart, T.bart + 1.3);
      T.nach = f(/^nachbarin/, T.boden, T.boden + 1.2); T.ruft2 = f(/^ruft/, T.nach, T.nach + 0.6); T.sache = f(/^sache/, T.ruft2, T.ruft2 + 1.0); T.kling = f(/^klingeln/, T.sache, T.sache + 1.0); T.hallo = f(/^hallo/, T.kling, T.kling + 1.4); T.denn = f(/^denn/, T.hallo, T.hallo + 0.85);
      T.cV1 = T.v1 - 0.18; T.cV2 = T.v2 - 0.18; T.cV3 = T.v3 - 0.18; T.cR = T.drau - 0.3; T.cS = T.nach - 0.25; p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const K = (t, z, x, y) => ({ t, z, x, y });
      const ph = u < T.cV1 ? 0 : u < T.cV2 ? 1 : u < T.cV3 ? 2 : u < T.cR ? 3 : u < T.cS ? 4 : 5;
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      if (ph <= 4) {
        const kind = ["stand", "chair", "sofa", "hammock", "rocker"][ph];
        const KF = ph === 0 ? [K(0, 1.75, 470, 820), K(T.aend + 0.3, 1.55, 500, 840), K(T.d1, 1.5, 540, 850), K(T.cV1, 1.45, 560, 850)]
          : ph === 1 ? [K(T.cV1, 1.55, 600, 860), K(T.cV2, 1.45, 600, 860)]
          : ph === 2 ? [K(T.cV2, 1.45, 640, 860), K(T.cV3, 1.38, 630, 860)]
          : ph === 3 ? [K(T.cV3, 1.5, 640, 870), K(T.cR, 1.4, 640, 860)]
          : [K(T.cR, 1.3, 680, 850), K(T.sommer, 1.32, 680, 850), K(T.boden, 1.42, 650, 860), K(T.cS, 1.42, 650, 860)];
        const c = SK.cam(KF, u);
        let shake = 0; [T.eins, T.zwei].forEach((s) => { const k = u - s; if (k > 0 && k < 0.3) shake = 1 - k / 0.3; });
        const sx = Math.sin(u * 90) * 10 * shake, sy = Math.cos(u * 77) * 8 * shake;
        // Zustand
        const press = ph === 0 ? Math.max(seg(u, 0, 0.15) * (1 - seg(u, 1.9, 2.3)), win(T.eins - 0.35, T.eins + 0.5), win(T.zwei - 0.35, T.zwei + 0.5)) : 0;
        const dial = [0.05, 0.35, 0.65, 0.95, 1.25, 1.55]; let key = -1; dial.forEach((t, i) => { if (u >= t && u < t + 0.15) key = [4, 0, 7, 2, 9, 5][i]; }); if (Math.abs(u - T.eins - 0.02) < 0.15) key = 0; if (Math.abs(u - T.zwei - 0.02) < 0.15) key = 1;
        const winter = ph === 4 ? seg(u, T.winter - 0.3, T.winter + 0.1) * (1 - seg(u, T.sommer - 0.3, T.sommer + 0.1)) : 0, summer = ph === 4 ? seg(u, T.sommer - 0.3, T.sommer + 0.1) : 0;
        const beard = ph === 0 ? 0 : ph === 1 ? 0.04 : ph === 2 ? 0.09 : ph === 3 ? 0.15 : lerp(0.22, 1, inOut(seg(u, T.bart - 0.25, T.boden + 0.2)));
        const hr = ph === 0 ? 9 + u / 60 : ph === 1 ? 11.25 : ph === 2 ? 14.5 : ph === 3 ? 18.75 : 7 + (u - T.cR) * 5;
        const month = ph <= 0 ? "MÄRZ" : ph === 1 ? "APRIL" : ph === 2 ? "JUNI" : ph === 3 ? "AUGUST" : u < T.winter - 0.1 ? "OKTOBER" : u < T.sommer - 0.1 ? "DEZEMBER" : "JULI";
        const flip = ph === 4 ? Math.max(seg(u, T.winter - 0.3, T.winter), seg(u, T.sommer - 0.3, T.sommer)) : 0;
        const cob = ph === 4 ? seg(u, T.sommer, T.boden) : 0;
        const st = { kind, winter, summer, beard, grey: ph === 4 ? seg(u, T.bart - 0.2, T.boden) : 0, hr, month, flip, cob, wilt: ph === 4 ? winter * 0.8 : 0, press, pressKey: key,
          eyes: ph === 0 ? (u < T.d1 ? "happy" : "dot") : ph === 4 ? (u > T.bart ? "closed" : "side") : "side", mouth: ph === 0 ? (u < T.d1 ? "grin" : "smile") : ph === 1 ? "flat" : ph === 2 ? "flat" : "sad",
          brow: ph >= 2 ? -0.6 : 0, look: ph >= 1 && ph < 4 ? Math.sin(u * 1.7) * 0.8 : 0 };
        g.save(); SK.apply(g, c, sx, sy); const P = brandtWorld(g, u, st); g.restore();
        const [hx, hy] = SK.toScreen(c, P.ear[0], P.ear[1]), [mx, my] = SK.toScreen(c, P.head[0], P.head[1]);
        if (ph === 0) {
          SK.bubble(g, ["Nur eine *kleine*", "Änderung…"], 330, 330, mx - 40, my - 90, win(0.25, T.ruft - 0.1), { think: true, px: 50 });
          SK.bubble(g, ["Tuut… *tuut*…"], 720, 420, hx, hy, win(T.ruft - 0.05, T.d1 - 0.05), { px: 48 });
          SK.bubble(g, ["Drücken Sie die…"], 600, 330, hx, hy, win(T.d1 - 0.05, T.cV1 + 0.05), { px: 50 });
          const n1 = win(T.eins - 0.1, T.d2 + 0.25), n2 = win(T.zwei - 0.1, T.cV1 + 0.05);
          SK.bubble(g, ["*1*"], 250, 640, hx - 60, hy - 20, n1, { shout: true, px: 230, fill: "#ffd34d", hi: "#1b1530" });
          SK.bubble(g, ["*2*"], 250, 640, hx - 60, hy - 20, n2, { shout: true, px: 230, fill: "#7fd0ff", hi: "#1b1530" });
        } else if (ph <= 3) {
          const L = [["Sie werden", "*verbunden*…"], ["Sie werden *weiter*", "verbunden…"], ["*Bitte* warten…", "Sie werden *verbunden*…"]][ph - 1];
          const ta = [T.v1, T.v2, T.v3][ph - 1], tb = [T.cV2, T.cV3, T.cR][ph - 1];
          SK.bubble(g, L, 560, 360, hx, hy, win(ta - 0.15, tb + 0.05), { px: 50 });
          notes(g, hx, hy, u, seg(u, ta - 0.2, ta));
        } else {
          notes(g, hx, hy, u, 1);
          const sw = win(T.winter - 0.1, T.sommer - 0.2), ss = win(T.sommer - 0.05, T.bart - 0.05);
          SK.bubble(g, ["*Winter*"], 300, 330, 470, 600, sw, { px: 64, fill: "#e8f4ff" });
          SK.bubble(g, ["*Sommer*"], 300, 330, 470, 600, ss, { px: 64, fill: "#fff3c4", hi: "#e0703a" });
          const [bx, by] = SK.toScreen(c, SX, FL); SK.bubble(g, ["…bis zum *Boden*"], 300, 430, bx - 120, by - 60, win(T.boden - 0.2, T.cS + 0.05), { px: 50 });
        }
        SK.flashAt(g, u, [T.cV1, T.cV2, T.cV3, T.cR], 0.09, 0.7);
      } else {
        // Splitscreen: links Brandt (Bart bis zum Boden), rechts die Nachbarin. Bei „Denn“ wächst ihr Bild über den ganzen Schirm.
        const ex = inOut(seg(u, T.denn - 0.05, T.denn + 0.25)), split = lerp(540, 0, ex);
        const surpr = seg(u, T.hallo - 0.05, T.hallo + 0.2);
        // links
        const slide = 1 - out3(seg(u, T.cS, T.cS + 0.35)), lw = split + slide * 540;
        const cl1 = SK.cam([K(T.cS, 1.12, 610, 900), K(T.hallo, 1.18, 620, 890), K(d, 1.24, 620, 880)], u);
        g.save(); g.beginPath(); g.rect(0, 0, lw, H); g.clip(); g.save(); cam2(g, cl1, lw / 2);
        const PB = brandtWorld(g, u, { kind: "rocker", winter: 0, summer: 1, beard: 1, grey: 1, hr: 7 + u * 2, month: "JULI", flip: 0, cob: 1, wilt: 0, press: 0, eyes: surpr > 0.5 ? "wide" : "closed", mouth: surpr > 0.5 ? "o" : "sad", brow: surpr > 0.5 ? -1 : -0.6, look: 0.8 });
        g.restore(); const [lhx, lhy] = scr(cl1, lw / 2, PB.ear[0], PB.ear[1]), [lmx, lmy] = scr(cl1, lw / 2, PB.head[0], PB.head[1]);
        notes(g, lhx, lhy, u, 1 - ex); SK.qmarks(g, lmx, lmy - 210, u, seg(u, T.hallo + 0.25, T.hallo + 0.6) * (1 - ex), 3);
        g.restore();
        // rechts
        const zin = inExpo(cl((u - T.denn - 0.1) / Math.max(0.3, d - T.denn - 0.1)));
        const cr = SK.cam([K(T.cS, 1.15, 470, 880), K(T.kling, 1.2, 480, 860), K(T.hallo, 1.28, 520, 830), K(T.denn, 1.25, 530, 810), K(T.denn + 0.25, 1.5, 560, 760)], u);
        const pcx = lerp(810, 540, ex);
        g.save(); g.beginPath(); g.rect(split, 0, W - split, H); g.clip(); g.translate(slide * 540, 0);
        const hap = seg(u, T.hallo + 0.05, T.hallo + 0.15);
        const pressN = Math.max(win(T.ruft2 - 0.3, T.sache + 0.2), 0); let keyN = -1; [0, 0.25, 0.5, 0.75].forEach((t, i) => { if (u >= T.ruft2 + t && u < T.ruft2 + t + 0.14) keyN = [3, 8, 1, 6][i]; });
        // Tauchfahrt in die Hörmuschel
        const tgt = [BX + 0.75 * 50, FL + 0.75 * (-610)]; const crz = { ...cr }; if (zin > 0 || ex > 0) { const k = inOut(cl((u - T.denn) / 0.4)); crz.x = lerp(cr.x, tgt[0], k); crz.y = lerp(cr.y, tgt[1], k); crz.z = cr.z * (1 + zin * 22); }
        g.save(); cam2(g, crz, pcx);
        room(g, u, ROOM_N); cord(g, PH.x - 70, PH.y - 50, BX + 0.75 * 92, FL + 0.75 * -460, 90, "#7a1f2a"); phone(g, PH.x, PH.y, "#d64550", keyN, 0);
        const PN = neighbor(g, u, BX, { press: pressN, happy: hap });
        g.restore();
        const [rhx, rhy] = scr(crz, pcx, PN.ear[0], PN.ear[1]);
        const rk = (u - T.kling) / 0.8; if (rk > 0 && rk < 1) { const vib = Math.sin(u * 80) * 6; SK.pow(g, "RING!", pcx - 20 + vib, 380, rk, { rot: -0.1, px: 120, c: "#ffd34d" });
          g.save(); g.strokeStyle = SK.OL; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 3; i++) { const a = -2.4 + i * 0.35, r0 = 50, r1 = 90; g.beginPath(); g.moveTo(rhx + Math.cos(a) * r0, rhy + Math.sin(a) * r0); g.lineTo(rhx + Math.cos(a) * r1, rhy + Math.sin(a) * r1); g.stroke(); } g.restore(); }
        SK.bubble(g, ["*Hallo?*"], pcx + 10, 470, rhx, rhy - 10, win(T.hallo - 0.08, d + 1) * (1 - ex * 0.999 * seg(u, T.denn + 0.1, T.denn + 0.25)), { px: 78, fill: "#ffffff", hi: "#2fa35a" });
        if (hap > 0) { g.save(); g.globalAlpha = hap * (1 - ex); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.5 + Math.sin(u * 3) * 0.05, [ax, ay] = scr(crz, pcx, PN.head[0], PN.head[1]); g.strokeStyle = "#ffd34d"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(ax + Math.cos(a) * 110, ay + Math.sin(a) * 110); g.lineTo(ax + Math.cos(a) * 150, ay + Math.sin(a) * 150); g.stroke(); } g.restore(); }
        g.restore();
        // Comic-Rahmen
        if (split > 2) { g.save(); g.fillStyle = "#fffaf0"; const gx = split + slide * 540; g.fillRect(gx - 9, 0, 18, H); g.strokeStyle = SK.OL; g.lineWidth = 6; g.beginPath(); g.moveTo(gx - 9, 0); g.lineTo(gx - 9, H); g.moveTo(gx + 9, 0); g.lineTo(gx + 9, H); g.stroke(); g.restore(); }
        SK.flashAt(g, u, [T.cS], 0.09, 0.6);
      }
      SK.whiteOut(g, u, d, 0.18);
    },
    ev(d, p) { const T = p._T, E = [[0.0, "closed_beep", 0.45, -0.3], [0.0, "whoosh_down", 0.3, 0]];
      [0.05, 0.35, 0.65, 0.95, 1.25, 1.55].forEach((t, i) => E.push([t, "closed_beep", 0.35, -0.3 + i * 0.05]));
      E.push([0.3, "pop", 0.35, -0.3], [T.ruft, "vphone", 0.3, 0.3], [T.d1 - 0.05, "pop", 0.35, 0.2], [T.eins, "closed_beep", 0.5, -0.3], [T.eins - 0.05, "slap", 0.45, 0], [T.eins, "boom", 0.25, 0], [T.zwei, "closed_beep", 0.5, -0.3], [T.zwei - 0.05, "slap", 0.45, 0], [T.zwei, "boom", 0.25, 0]);
      [T.cV1, T.cV2, T.cV3, T.cR].forEach((t, i) => E.push([t - 0.06, "whoosh_side", 0.4, (i % 2) ? 0.3 : -0.3], [t, "tick_hi", 0.35, 0.4], [t + 0.1, "pop", 0.3, 0.2]));
      for (let t = T.cV1; t < T.cS; t += 0.5) E.push([t, "tick", 0.12, 0.45]);
      E.push([T.winter - 0.2, "tr_swish", 0.3, -0.4], [T.winter, "shimmer", 0.35, 0.3], [T.sommer - 0.2, "tr_swish", 0.3, -0.4], [T.sommer, "chime", 0.35, 0.3], [T.bart - 0.1, "riser_short", 0.35, 0], [T.boden, "thump", 0.45, 0], [T.boden + 0.05, "pop", 0.3, -0.2]);
      E.push([T.cS - 0.06, "whoosh_side", 0.45, 0.4], [T.cS, "slap", 0.35, 0.3]); [0, 0.25, 0.5, 0.75].forEach((t) => E.push([T.ruft2 + t, "closed_beep", 0.35, 0.4]));
      E.push([T.kling, "vphone", 0.5, 0.4], [T.hallo - 0.05, "ding", 0.45, 0.4], [T.hallo, "pop", 0.4, 0.3], [T.hallo + 0.3, "pop", 0.3, -0.4], [T.hallo + 0.45, "pop", 0.3, -0.3], [T.hallo + 0.6, "pop", 0.3, -0.2]);
      E.push([T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: alter Hörer am Spiralkabel, ruhiger Filmtitel ----------
  TYPES.warteschleife_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^ansprechpartner/, E.sys, 2.0); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createRadialGradient(540, 760, 80, 540, 900, 1300); bg.addColorStop(0, "#3a2416"); bg.addColorStop(1, "#0e0805"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 20; i++) { const x = rnd(i * 3.7) * 1080 + Math.sin(u * 0.4 + i) * 20, y = 150 + rnd(i * 5.9) * 1500, r = 40 + rnd(i * 1.3) * 110, a = 0.05 + 0.08 * rnd(i * 8.1); const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(255,${170 + Math.floor(rnd(i) * 60)},110,${a})`); gg.addColorStop(1, "rgba(255,190,120,0)"); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      // Hörer hängt am Spiralkabel und pendelt aus
      const sw = Math.sin(u * 2.1) * 0.12 * Math.exp(-u * 0.35) + 0.02 * Math.sin(u * 1.3), hy = 470 + Math.sin(u * 1.6) * 6;
      const hx = 540 + Math.sin(sw) * 420; g.save(); g.globalAlpha = 0.95;
      g.strokeStyle = "#151010"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); for (let i = 0; i <= 120; i++) { const t = i / 120, px = lerp(540, hx, t), py = lerp(-20, hy - 120, t); const ph = t * 26 * Math.PI * 2; const qx = px + Math.sin(ph) * 13, qy = py + Math.cos(ph) * 4; i ? g.lineTo(qx, qy) : g.moveTo(qx, qy); } g.stroke();
      g.strokeStyle = "rgba(232,184,90,0.35)"; g.lineWidth = 2; g.stroke();
      g.translate(hx, hy); g.rotate(-sw * 0.8); g.scale(1.25, 1.25);
      g.shadowColor = "rgba(246,213,138,0.25)"; g.shadowBlur = 40; g.fillStyle = "#1c1412"; g.strokeStyle = "#e8b85a"; g.lineWidth = 3;
      rr(g, -16, -80, 32, 160, 16); g.fill(); g.stroke(); rr(g, -46, -112, 66, 60, 24); g.fill(); g.stroke(); rr(g, -46, 52, 66, 60, 24); g.fill(); g.stroke();
      g.shadowBlur = 0; g.fillStyle = "rgba(246,213,138,0.5)"; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-30, -96 + i * 14, 3, 0, 7); g.arc(-30, 68 + i * 14, 3, 0, 7); g.fill(); }
      g.fillStyle = "rgba(255,255,255,0.12)"; rr(g, -6, -70, 8, 130, 4); g.fill();
      g.restore();
      SK.endTitle(g, u, d, T, { c: "#f6d58a", glow: "rgba(246,213,138,0.5)", accent: "#e8b85a", sub: "rgba(255,236,200,0.85)", key: "#f6d58a", offer: "EIN ANSPRECHPARTNER", y: 860, line: "und Sie sprechen direkt mit mir." });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.05, "click", 0.4, -0.2], [0.1, "shimmer", 0.35, 0], [0.5, "closed_beep", 0.2, 0.2], [0.9, "shimmer_hi", 0.25, 0], [T.offer, "ding", 0.3, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
