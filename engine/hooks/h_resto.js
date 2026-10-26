// VOICE_DELAY: 0.3
// h_resto: Comic-Geschichte im Restaurant (Look "story"). Ein Gast knallt den Teller hin und will den Chef.
// Der Chef kommt ruhig mit dem iPad: Tisch 7, per QR-Code bestellt, von seinem eigenen Handy. Der Gast wird knallrot.
// Dann tippt der Chef: zehnter Besuch, der nächste geht aufs Haus (Treuekarte in der Wallet). Der Gast strahlt.
// Montage: Er kommt jede Woche (Kalender reißt ab). Bei „gebaut“ taucht die Kamera in den QR-Aufsteller, Weiß, danach `reveal`.
// Zeiten aus den Wörtern: knallt, nie, chef, chef, ipad, tisch, qr, handy, knallrot, tippt, zehnter, haus, seitdem, woche, gebaut.
(() => {
  const OL = "#2b1d14", PINK = "#ff5c8a", LIME = "#c6f432", INK = "#1b1530";
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  const mix = (a, b, k) => { const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], k))).join(",")})`; };
  function qrBits(seed) { const b = []; for (let i = 0; i < 49; i++) b.push(rnd(seed * 5.31 + i * 1.91) > 0.5); return b; }
  const BITS = qrBits(7);
  function qr(g, x, y, s) {
    g.fillStyle = "#ffffff"; g.fillRect(x - s / 2, y - s / 2, s, s); const m = s * 0.08, c = (s - 2 * m) / 7; g.fillStyle = "#111318";
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { const fin = (i < 2 && j < 2) || (i > 4 && j < 2) || (i < 2 && j > 4); if (fin || BITS[i * 7 + j]) g.fillRect(x - s / 2 + m + i * c, y - s / 2 + m + j * c, c + 0.4, c + 0.4); }
  }
  function richLine(g, s, x, y, px, c, hi) { // *Wort* wird farbig
    const parts = s.split("*"); font(g, 900, px, "D"); let tw = 0; parts.forEach((t) => { tw += g.measureText(t).width; });
    let cx = x - tw / 2; g.textAlign = "left"; g.textBaseline = "middle";
    parts.forEach((t, i) => { g.fillStyle = i % 2 ? hi : c; g.fillText(t, cx, y); cx += g.measureText(t).width; });
  }
  function bubble(g, lines, x, y, tx, ty, k, o = {}) { // Sprechblase in Bildschirm-Koordinaten, Spitze zeigt auf (tx, ty)
    if (k <= 0) return; const px = o.px || 50; font(g, 900, px, "D");
    const w = Math.max(...lines.map((l) => g.measureText(l.replace(/\*/g, "")).width)) + 90, h = lines.length * px * 1.18 + 64;
    const e = outBack(cl(k), 2.2); g.save(); g.translate(tx + (x - tx) * e, ty + (y - ty) * e); g.scale(e, e); g.translate(-x, -y);
    g.lineWidth = 7; g.strokeStyle = OL; g.lineJoin = "round"; g.fillStyle = o.fill || "#ffffff";
    shadow(g, 0, 10, "rgba(0,0,0,0.22)");
    // Spitze (zuerst, die Blase liegt darüber)
    const ang = Math.atan2(ty - y, tx - x), bx = x + Math.cos(ang) * w * 0.22, by = y + Math.sin(ang) * h * 0.22, pr = 30;
    const ex = x + (tx - x) * 0.62, ey = y + (ty - y) * 0.62; g.beginPath(); g.moveTo(bx + Math.cos(ang + 1.57) * pr, by + Math.sin(ang + 1.57) * pr); g.lineTo(ex, ey); g.lineTo(bx + Math.cos(ang - 1.57) * pr, by + Math.sin(ang - 1.57) * pr); g.closePath();
    g.fillStyle = o.fill || "#ffffff"; g.fill(); g.stroke(); g.fillStyle = o.fill || "#ffffff";
    g.beginPath();
    if (o.shout) { // Zacken-Blase
      const n = 22; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, r = i % 2 ? 1 : 1.13 + 0.05 * Math.sin(i * 3.3); const px2 = x + Math.cos(a) * (w / 2 + 26) * r, py2 = y + Math.sin(a) * (h / 2 + 26) * r; i ? g.lineTo(px2, py2) : g.moveTo(px2, py2); }
      g.closePath(); g.fill(); noShadow(g); g.stroke();
    } else { g.roundRect(x - w / 2, y - h / 2, w, h, h / 2 > 60 ? 50 : h / 2); g.fill(); noShadow(g); g.stroke(); }
    lines.forEach((l, i) => richLine(g, l, x, y + (i - (lines.length - 1) / 2) * px * 1.18 + 2, px, o.c || INK, o.hi || "#e5243b"));
    g.restore();
  }

  // ---------- Raum ----------
  function room(g, u, mont) {
    g.fillStyle = "#f6e3c4"; g.fillRect(-900, -900, 2900, 1800);
    g.fillStyle = "rgba(190,120,70,0.10)"; for (let x = -900; x < 2000; x += 70) g.fillRect(x, -900, 26, 1580);
    // Fenster mit Nacht
    g.save(); g.lineWidth = 9; g.strokeStyle = OL; const sky = g.createLinearGradient(0, 230, 0, 560); sky.addColorStop(0, "#1c2550"); sky.addColorStop(1, "#3c4a8c"); g.fillStyle = sky; rr(g, 40, 230, 290, 330, 18); g.fill();
    g.fillStyle = "#fff6c8"; g.beginPath(); g.arc(250, 310, 34, 0, 7); g.fill(); g.fillStyle = "#1c2550"; g.beginPath(); g.arc(266, 300, 30, 0, 7); g.fill();
    g.fillStyle = "#ffffff"; for (let i = 0; i < 9; i++) { const a = 0.5 + 0.5 * Math.sin(u * 3 + i * 2); g.globalAlpha = a; g.fillRect(70 + rnd(i * 3.3) * 230, 260 + rnd(i * 7.1) * 260, 5, 5); } g.globalAlpha = 1;
    g.fillStyle = "#3a5d8f"; for (let i = 0; i < 4; i++) { const hgt = 60 + rnd(i * 2.2) * 90; g.fillRect(50 + i * 72, 560 - hgt, 60, hgt); }
    g.fillStyle = "#ffd36b"; for (let i = 0; i < 10; i++) g.fillRect(62 + (i % 4) * 72 + (i % 2) * 22, 500 - Math.floor(i / 4) * 32, 12, 14);
    rr(g, 40, 230, 290, 330, 18); g.stroke(); g.beginPath(); g.moveTo(185, 230); g.lineTo(185, 560); g.moveTo(40, 395); g.lineTo(330, 395); g.stroke();
    g.fillStyle = "#9b5a33"; rr(g, 22, 556, 326, 26, 8); g.fill(); g.stroke(); g.restore();
    // Bild oder Kalender
    if (!mont) { g.save(); g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#c58a3a"; rr(g, 560, 270, 230, 170, 10); g.fill(); g.stroke(); g.fillStyle = "#fff4dd"; g.fillRect(580, 290, 190, 130);
      g.fillStyle = "#ffffff"; g.beginPath(); g.ellipse(675, 380, 70, 22, 0, 0, 7); g.fill(); g.strokeStyle = "#d9a36a"; g.lineWidth = 6; g.beginPath(); g.moveTo(625, 372); g.bezierCurveTo(650, 340, 700, 400, 725, 365); g.stroke();
      g.fillStyle = "#e5484d"; g.beginPath(); g.arc(660, 368, 9, 0, 7); g.arc(690, 372, 8, 0, 7); g.fill(); g.restore(); }
    // Küchentür
    doorK(g, u);
    // Wandvertäfelung
    g.fillStyle = "#2e5e4e"; g.fillRect(-900, 690, 2900, 215); g.fillStyle = "#234a3d"; g.fillRect(-900, 690, 2900, 18);
    g.strokeStyle = "rgba(0,0,0,0.18)"; g.lineWidth = 5; for (let x = -880; x < 2000; x += 170) { if (x > 880 && x < 1120) continue; g.strokeRect(x, 730, 130, 150); }
    // Boden
    const fl = g.createLinearGradient(0, 905, 0, 2100); fl.addColorStop(0, "#b8743f"); fl.addColorStop(1, "#d79a5c"); g.fillStyle = fl; g.fillRect(-900, 905, 2900, 1600);
    g.strokeStyle = "rgba(90,45,15,0.25)"; g.lineWidth = 4; let yy = 905, step = 34; while (yy < 2100) { g.beginPath(); g.moveTo(-900, yy); g.lineTo(2000, yy); g.stroke(); yy += step; step *= 1.16; }
    g.fillStyle = OL; g.fillRect(-900, 900, 2900, 10);
    // Lampen
    [[400, 1], [760, 0.8], [130, 0.8]].forEach(([x, s], i) => { const sw = Math.sin(u * 1.4 + i) * 0.03; g.save(); g.translate(x, -200); g.rotate(sw); g.strokeStyle = OL; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 300); g.stroke();
      const gl = g.createRadialGradient(0, 360, 10, 0, 360, 280 * s); gl.addColorStop(0, "rgba(255,214,120,0.55)"); gl.addColorStop(1, "rgba(255,214,120,0)"); g.fillStyle = gl; g.beginPath(); g.arc(0, 360, 280 * s, 0, 7); g.fill();
      g.fillStyle = "#e0a034"; g.lineWidth = 7; g.beginPath(); g.moveTo(-26 * s, 300); g.lineTo(26 * s, 300); g.lineTo(70 * s, 360); g.lineTo(-70 * s, 360); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "#fff3c4"; g.beginPath(); g.ellipse(0, 362, 40 * s, 10, 0, 0, 7); g.fill(); g.restore(); });
  }
  let DOOR = 0;
  function doorK(g, u) {
    g.save(); g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#3a2617"; g.fillRect(920, 380, 200, 525);
    const op = DOOR; g.translate(925, 0); g.scale(1 - 0.85 * op, 1); g.fillStyle = "#8a4f2b"; rr(g, 0, 386, 190, 515, 6); g.fill(); g.stroke();
    g.fillStyle = "#cfe8ff"; g.beginPath(); g.arc(95, 520, 46, 0, 7); g.fill(); g.stroke(); g.strokeStyle = "#e7c27a"; g.lineWidth = 6; g.beginPath(); g.arc(95, 520, 54, 0, 7); g.stroke();
    g.fillStyle = "#e7c27a"; rr(g, 30, 640, 130, 26, 8); g.fill(); g.restore();
    g.save(); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#ffffff"; rr(g, 945, 330, 150, 40, 10); g.fill(); g.stroke(); txt(g, "KÜCHE", 1020, 352, { w: 900, px: 26, c: INK, ls: 3 }); g.restore();
  }
  function tableT(g, x, top, plateY, mont, u) {
    g.save(); g.lineWidth = 7; g.strokeStyle = OL; g.lineJoin = "round";
    g.fillStyle = "#5a3a22"; g.fillRect(x - 170, top + 120, 22, 150); g.fillRect(x + 148, top + 120, 22, 150); g.strokeRect(x - 170, top + 120, 22, 150); g.strokeRect(x + 148, top + 120, 22, 150);
    g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(x - 205, top); g.lineTo(x + 205, top); g.lineTo(x + 222, top + 130); g.lineTo(x - 222, top + 130); g.closePath(); g.fill();
    g.save(); g.clip(); g.fillStyle = "rgba(229,36,59,0.55)"; for (let i = -12; i < 12; i++) g.fillRect(x + i * 36, top, 18, 140); for (let j = 0; j < 4; j++) g.fillRect(x - 230, top + 8 + j * 36, 460, 18); g.restore();
    g.beginPath(); g.moveTo(x - 205, top); g.lineTo(x + 205, top); g.lineTo(x + 222, top + 130); g.lineTo(x - 222, top + 130); g.closePath(); g.stroke();
    g.fillStyle = "#ffffff"; rr(g, x - 215, top - 14, 430, 22, 8); g.fill(); g.stroke();
    // Teller
    g.save(); g.translate(x - 50, top - 12 - plateY.y); g.rotate(plateY.r);
    g.fillStyle = "#ffffff"; g.beginPath(); g.ellipse(0, 0, 105, 26, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#eef0f4"; g.beginPath(); g.ellipse(0, -2, 72, 16, 0, 0, 7); g.fill();
    if (!mont || u < 99) { g.fillStyle = "#e0a24a"; g.beginPath(); g.ellipse(-18, -14, 56, 18, -0.1, 0, 7); g.fill(); g.lineWidth = 5; g.stroke(); g.fillStyle = "#c98632"; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(-50 + i * 13, -16 + (i % 2) * 6, 4, 0, 7); g.fill(); }
      g.fillStyle = "#ffd34d"; for (let i = 0; i < 6; i++) { g.save(); g.translate(40 + i * 7, -18); g.rotate(-0.6 + i * 0.25); g.fillRect(-5, -26, 10, 40); g.strokeRect(-5, -26, 10, 40); g.restore(); }
      g.fillStyle = "#f2e86d"; g.beginPath(); g.arc(-58, -24, 10, 0, 7); g.fill(); g.lineWidth = 4; g.stroke(); }
    g.restore();
    // QR-Aufsteller „Tisch 7“
    g.save(); g.translate(x + 132, top - 14); g.fillStyle = "rgba(255,255,255,0.85)"; g.lineWidth = 6; g.beginPath(); g.moveTo(-40, 0); g.lineTo(40, 0); g.lineTo(32, -112); g.lineTo(-32, -112); g.closePath(); g.fill(); g.stroke();
    fillRR(g, -30, -106, 60, 22, 6, PINK); txt(g, "TISCH 7", 0, -95, { w: 900, px: 13, c: "#ffffff" }); qr(g, 0, -50, 46);
    g.strokeStyle = "rgba(255,92,138,0.7)"; g.lineWidth = 4; for (let i = 0; i < 2; i++) { const r = 18 + ((u * 1.2 + i * 0.5) % 1) * 30; g.globalAlpha = 1 - ((u * 1.2 + i * 0.5) % 1); g.beginPath(); g.arc(30, -100, r, -1.2, 0.1); g.stroke(); } g.globalAlpha = 1;
    g.restore();
    g.restore();
  }
  function diners(g, u, look) { // kleines Paar hinten rechts
    g.save(); g.translate(760, 800); g.scale(0.62, 0.62); g.lineWidth = 9; g.strokeStyle = OL;
    [[-150, "#8d5cc8", "#3b2a20"], [150, "#e98a3a", "#d9a441"]].forEach(([dx, sh, hair], i) => {
      g.fillStyle = sh; rr(g, dx - 70, -230, 140, 200, 50); g.fill(); g.stroke();
      g.fillStyle = "#f1c7a1"; g.beginPath(); g.arc(dx, -290, 58, 0, 7); g.fill(); g.stroke();
      g.fillStyle = hair; g.beginPath(); g.arc(dx, -305, 60, Math.PI * 1.05, Math.PI * 1.95); g.fill();
      const lx = -14 * look; g.fillStyle = OL; g.beginPath(); g.arc(dx - 18 + lx, -292, 7, 0, 7); g.arc(dx + 18 + lx, -292, 7, 0, 7); g.fill();
      if (look > 0.5) { g.beginPath(); g.ellipse(dx + lx, -255, 10, 13, 0, 0, 7); g.fill(); } else { g.lineWidth = 6; g.beginPath(); g.arc(dx, -262, 16, 0.2, Math.PI - 0.2); g.stroke(); g.lineWidth = 9; }
    });
    g.fillStyle = "#ffffff"; rr(g, -260, -40, 520, 40, 10); g.fill(); g.stroke(); g.fillStyle = "#5a3a22"; g.fillRect(-220, 0, 30, 200); g.fillRect(190, 0, 30, 200);
    g.fillStyle = "#b7e3ff"; rr(g, -40, -110, 34, 70, 8); g.fill(); g.stroke(); rr(g, 10, -110, 34, 70, 8); g.fill(); g.stroke();
    g.restore();
  }
  // ---------- Figuren ----------
  function guest(g, x, feet, s) { // s: red 0..1, ang 0..1, emb 0..1, joy 0..1, arm (Winkel), shout 0..1, bob
    g.save(); g.translate(x, feet); g.scale(1, 1 - 0.06 * s.emb); g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round"; g.lineCap = "round";
    g.fillStyle = "#33374a"; rr(g, -62, -215, 50, 215, 18); g.fill(); g.stroke(); rr(g, 12, -215, 50, 215, 18); g.fill(); g.stroke();
    g.fillStyle = "#1e1e24"; rr(g, -78, -26, 72, 30, 14); g.fill(); g.stroke(); rr(g, 6, -26, 72, 30, 14); g.fill(); g.stroke();
    g.fillStyle = "#4b7fd6"; g.beginPath(); g.ellipse(0, -330, 118, 150, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#3b68b8"; g.beginPath(); g.moveTo(-40, -470); g.lineTo(0, -420); g.lineTo(40, -470); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#e5243b"; g.beginPath(); g.moveTo(0, -425); g.lineTo(-14, -400); g.lineTo(0, -300); g.lineTo(14, -400); g.closePath(); g.fill(); g.stroke();
    // linker Arm in die Hüfte
    g.strokeStyle = "#4b7fd6"; g.lineWidth = 34; g.beginPath(); g.moveTo(-100, -400); g.lineTo(-150 + 20 * s.emb, -320); g.lineTo(-104, -270); g.stroke(); g.lineWidth = 8; g.strokeStyle = OL;
    // rechter Arm zeigt
    const a = s.arm; const ex = 95 + Math.cos(a) * 95, ey = -400 + Math.sin(a) * 95, hx = ex + Math.cos(a - 0.15) * 90, hy = ey + Math.sin(a - 0.15) * 90;
    g.strokeStyle = OL; g.lineWidth = 42; g.beginPath(); g.moveTo(90, -405); g.lineTo(ex, ey); g.lineTo(hx, hy); g.stroke(); g.strokeStyle = "#4b7fd6"; g.lineWidth = 28; g.stroke(); g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#f1c7a1"; g.beginPath(); g.arc(hx, hy, 22, 0, 7); g.fill(); g.stroke();
    // Kopf
    const skin = s.joy > 0 ? mix(mix("#f1c7a1", "#e2453b", s.red), "#f1c7a1", s.joy) : mix("#f1c7a1", "#d9262e", s.red);
    const hyH = -545 + (s.bob || 0); g.fillStyle = skin; g.beginPath(); g.arc(0, hyH, 72, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#5b3a23"; g.beginPath(); g.ellipse(-62, hyH - 4, 16, 34, 0.2, 0, 7); g.fill(); g.beginPath(); g.ellipse(62, hyH - 4, 16, 34, -0.2, 0, 7); g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(-22, hyH - 46, 22, 9, -0.4, 0, 7); g.fill();
    // Augen + Brauen
    g.fillStyle = OL; g.strokeStyle = OL;
    if (s.joy > 0.5) { g.lineWidth = 8; g.beginPath(); g.arc(-26, hyH - 4, 13, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.beginPath(); g.arc(26, hyH - 4, 13, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    else { const ey2 = hyH - 8 + 6 * s.emb, lx = -6 * s.emb; g.beginPath(); g.arc(-26 + lx, ey2, 9, 0, 7); g.arc(26 + lx, ey2, 9, 0, 7); g.fill();
      g.lineWidth = 9; const tilt = lerp(16, -12, s.emb) * s.ang + (1 - s.ang) * -6; g.beginPath(); g.moveTo(-46, hyH - 34 - tilt); g.lineTo(-12, hyH - 30 + tilt); g.moveTo(46, hyH - 34 - tilt); g.lineTo(12, hyH - 30 + tilt); g.stroke(); }
    // Schnurrbart + Mund
    g.fillStyle = "#5b3a23"; g.beginPath(); g.ellipse(-20, hyH + 24, 24, 11, 0.25, 0, 7); g.ellipse(20, hyH + 24, 24, 11, -0.25, 0, 7); g.fill();
    g.lineWidth = 7;
    if (s.joy > 0.5) { g.fillStyle = "#7a1f2a"; g.beginPath(); g.arc(0, hyH + 34, 26, 0.1, Math.PI - 0.1); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "rgba(255,90,120,0.45)"; g.beginPath(); g.arc(-46, hyH + 18, 13, 0, 7); g.arc(46, hyH + 18, 13, 0, 7); g.fill(); }
    else if (s.shout > 0.05) { g.fillStyle = "#7a1f2a"; g.beginPath(); g.ellipse(0, hyH + 46, 22, 10 + 20 * s.shout, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#ff8a9a"; g.beginPath(); g.ellipse(0, hyH + 52 + 10 * s.shout, 12, 6 * s.shout, 0, 0, 7); g.fill(); }
    else { g.beginPath(); g.moveTo(-18, hyH + 46); for (let i = 1; i <= 6; i++) g.lineTo(-18 + i * 6, hyH + 46 + (i % 2 ? -5 : 4) * (s.emb > 0.3 ? 1 : 0)); g.stroke(); }
    g.restore();
  }
  function guestSeated(g, x, seatY, u) {
    g.save(); g.translate(x, seatY); g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round";
    g.fillStyle = "#7a4a2a"; rr(g, -110, -330, 220, 40, 12); g.fill(); g.stroke(); g.fillRect(-100, -300, 20, 300); g.strokeRect(-100, -300, 20, 300);
    g.fillStyle = "#4b7fd6"; g.beginPath(); g.ellipse(0, -150, 112, 128, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(-60, -258); g.lineTo(60, -258); g.lineTo(70, -110); g.lineTo(-70, -110); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#e5243b"; g.beginPath(); const hx = 0, hy = -185; g.moveTo(hx, hy + 18); g.bezierCurveTo(hx - 30, hy - 6, hx - 14, hy - 30, hx, hy - 14); g.bezierCurveTo(hx + 14, hy - 30, hx + 30, hy - 6, hx, hy + 18); g.fill();
    const fy = Math.sin(u * 9) * 10; g.strokeStyle = OL; g.lineWidth = 40; g.beginPath(); g.moveTo(85, -230); g.lineTo(150, -260 + fy); g.stroke(); g.strokeStyle = "#4b7fd6"; g.lineWidth = 26; g.stroke(); g.lineWidth = 7; g.strokeStyle = OL;
    g.fillStyle = "#c9ced8"; g.fillRect(160, -340 + fy, 8, 90); g.strokeRect(160, -340 + fy, 8, 90); g.fillStyle = "#f1c7a1"; g.beginPath(); g.arc(160, -260 + fy, 20, 0, 7); g.fill(); g.stroke();
    const hy2 = -340 + Math.sin(u * 6) * 4; g.fillStyle = "#f1c7a1"; g.beginPath(); g.arc(0, hy2, 70, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#5b3a23"; g.beginPath(); g.ellipse(-60, hy2, 15, 32, 0.2, 0, 7); g.fill(); g.beginPath(); g.ellipse(60, hy2, 15, 32, -0.2, 0, 7); g.fill();
    g.lineWidth = 8; g.beginPath(); g.arc(-26, hy2 - 4, 13, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.beginPath(); g.arc(26, hy2 - 4, 13, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
    g.fillStyle = "#5b3a23"; g.beginPath(); g.ellipse(-20, hy2 + 24, 24, 11, 0.25, 0, 7); g.ellipse(20, hy2 + 24, 24, 11, -0.25, 0, 7); g.fill();
    g.fillStyle = "#7a1f2a"; g.beginPath(); g.arc(0, hy2 + 34, 24, 0.1, Math.PI - 0.1); g.closePath(); g.fill(); g.lineWidth = 7; g.stroke();
    g.fillStyle = "rgba(255,90,120,0.45)"; g.beginPath(); g.arc(-46, hy2 + 16, 13, 0, 7); g.arc(46, hy2 + 16, 13, 0, 7); g.fill();
    g.restore();
  }
  function chef(g, x, feet, s) { // s: walk (Phase), pad 0..1 (iPad zeigt nach vorn), tap 0..1, thumb 0..1
    g.save(); g.translate(x, feet); g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round"; g.lineCap = "round";
    const sw = Math.sin(s.walk) * 22 * (s.moving ? 1 : 0);
    g.fillStyle = "#24262e"; g.save(); g.translate(-28, -210); g.rotate(sw * 0.012); rr(g, -22, 0, 46, 210, 16); g.fill(); g.stroke(); g.restore(); g.save(); g.translate(28, -210); g.rotate(-sw * 0.012); rr(g, -22, 0, 46, 210, 16); g.fill(); g.stroke(); g.restore();
    g.fillStyle = "#111"; rr(g, -66, -24, 66, 28, 12); g.fill(); g.stroke(); rr(g, 4, -24, 66, 28, 12); g.fill(); g.stroke();
    g.fillStyle = "#ffffff"; rr(g, -96, -480, 192, 290, 46); g.fill(); g.stroke();
    g.fillStyle = OL; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(-26, -430 + i * 60, 7, 0, 7); g.arc(26, -430 + i * 60, 7, 0, 7); g.fill(); }
    g.fillStyle = "#e5243b"; rr(g, -50, -492, 100, 30, 12); g.fill(); g.stroke();
    // Kopf
    const hy = -560; g.fillStyle = "#e8b48a"; g.beginPath(); g.arc(0, hy, 64, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OL; g.beginPath(); g.arc(-22, hy - 8, 8, 0, 7); g.arc(22, hy - 8, 8, 0, 7); g.fill();
    g.lineWidth = 7; g.beginPath(); g.moveTo(-38, hy - 32); g.lineTo(-10, hy - 34); g.moveTo(38, hy - 32); g.lineTo(10, hy - 34); g.stroke();
    g.fillStyle = "#24170f"; g.beginPath(); g.moveTo(0, hy + 18); g.bezierCurveTo(-30, hy + 8, -54, hy + 20, -62, hy + 6); g.bezierCurveTo(-58, hy + 34, -24, hy + 38, 0, hy + 26); g.bezierCurveTo(24, hy + 38, 58, hy + 34, 62, hy + 6); g.bezierCurveTo(54, hy + 20, 30, hy + 8, 0, hy + 18); g.fill();
    g.beginPath(); g.arc(0, hy + 38, 14, 0.2, Math.PI - 0.2); g.stroke();
    // Kochmütze
    g.lineWidth = 8; g.fillStyle = "#ffffff"; rr(g, -56, hy - 98, 112, 50, 10); g.fill(); g.stroke();
    g.beginPath(); g.arc(-40, hy - 120, 38, 0, 7); g.arc(0, hy - 140, 44, 0, 7); g.arc(40, hy - 120, 38, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#ffffff"; g.fillRect(-52, hy - 120, 104, 40);
    // Arme + iPad
    const px = -60, py = -380;
    if (s.thumb > 0) { g.strokeStyle = OL; g.lineWidth = 40; g.beginPath(); g.moveTo(-80, -440); g.lineTo(-150, -380); g.lineTo(-150, -470 * s.thumb - 380 * (1 - s.thumb)); g.stroke(); g.strokeStyle = "#fff"; g.lineWidth = 26; g.stroke(); g.lineWidth = 7; g.strokeStyle = OL;
      const ty = -480 * s.thumb - 380 * (1 - s.thumb); g.fillStyle = "#e8b48a"; g.beginPath(); g.arc(-150, ty, 24, 0, 7); g.fill(); g.stroke(); g.beginPath(); rr(g, -160, ty - 52, 20, 40, 10); g.fill(); g.stroke(); }
    g.save(); g.translate(px, py); const fl = s.pad; g.scale(lerp(-1, 1, fl), 1);
    g.fillStyle = "#1b1d24"; rr(g, -78, -58, 156, 116, 14); g.fill(); g.stroke(); g.fillStyle = fl > 0.5 ? "#f3f5fa" : "#2a2f3c"; rr(g, -66, -46, 132, 92, 6); g.fill();
    if (fl > 0.5) { fillRR(g, -56, -36, 52, 18, 5, PINK); g.fillStyle = "#c8ccd6"; g.fillRect(-56, -8, 100, 8); g.fillRect(-56, 8, 80, 8); fillRR(g, -56, 22, 70, 14, 5, LIME); }
    g.restore();
    g.strokeStyle = OL; g.lineWidth = 40; g.beginPath(); g.moveTo(80, -440); g.lineTo(110, -360); g.lineTo(px + 60, py + 10 - s.tap * 18); g.stroke(); g.strokeStyle = "#fff"; g.lineWidth = 26; g.stroke(); g.lineWidth = 7; g.strokeStyle = OL;
    g.fillStyle = "#e8b48a"; g.beginPath(); g.arc(px + 60, py + 10 - s.tap * 18, 22, 0, 7); g.fill(); g.stroke();
    if (!s.thumb) { g.strokeStyle = OL; g.lineWidth = 40; g.beginPath(); g.moveTo(-80, -440); g.lineTo(-120, -360); g.lineTo(px - 66, py + 20); g.stroke(); g.strokeStyle = "#fff"; g.lineWidth = 26; g.stroke(); g.lineWidth = 7; g.strokeStyle = OL;
      g.fillStyle = "#e8b48a"; g.beginPath(); g.arc(px - 66, py + 20, 22, 0, 7); g.fill(); g.stroke(); }
    g.restore();
  }
  // ---------- Karten ----------
  function ipadCard(g, u, T, k) {
    const e = outBack(cl(k), 1.6); g.save(); g.translate(540, 740); g.scale(e, e); g.globalAlpha = cl(k * 2);
    shadow(g, 60, 26, "rgba(0,0,0,0.45)"); fillRR(g, -440, -300, 880, 600, 48, "#15171d"); noShadow(g); fillRR(g, -410, -272, 820, 544, 26, "#f6f7fb");
    txt(g, "Bestellungen", -370, -222, { w: 900, px: 40, c: INK, al: "left" }); const bl = 0.5 + 0.5 * Math.sin(u * 8);
    fillRR(g, 210, -246, 160, 50, 25, "#e7f8ec"); g.fillStyle = `rgba(30,170,90,${0.5 + bl * 0.5})`; g.beginPath(); g.arc(240, -221, 9, 0, 7); g.fill(); txt(g, "LIVE", 300, -219, { w: 900, px: 26, c: "#1a9c52", ls: 3 });
    // Ticket
    const tk = outBack(seg(u, T.tisch - 0.05, T.tisch + 0.3), 2.2); g.save(); g.translate(0, -60); g.scale(lerp(0.85, 1, tk), lerp(0.85, 1, tk)); g.globalAlpha *= cl(tk * 2 + 0.25);
    fillRR(g, -370, -100, 740, 200, 22, "#ffffff"); g.strokeStyle = tk > 0.5 ? PINK : "#e3e6ee"; g.lineWidth = 5; rr(g, -370, -100, 740, 200, 22); g.stroke();
    fillRR(g, -340, -70, 230, 76, 18, PINK); txt(g, "TISCH 7", -225, -30, { w: 900, px: 40, c: "#fff" });
    txt(g, "19:42", 330, -30, { w: 800, px: 34, fam: "I", c: "#8a90a0", al: "right" });
    txt(g, "1× Schnitzel mit Pommes", -340, 50, { w: 800, px: 36, fam: "I", c: INK, al: "left" }); g.restore();
    const row = (t0, icon, label, y) => { const r = outBack(seg(u, t0 - 0.05, t0 + 0.28), 2); if (r <= 0) return; g.save(); g.translate(-370 + 30 * (1 - r), y); g.globalAlpha *= cl(r * 2);
      fillRR(g, 0, -40, 740, 80, 20, "#eaf8d0"); g.strokeStyle = "#9fd31a"; g.lineWidth = 4; rr(g, 0, -40, 740, 80, 20); g.stroke(); txt(g, icon, 50, 2, { px: 40 }); txt(g, label, 96, 2, { w: 800, px: 36, fam: "I", c: INK, al: "left" }); g.restore(); };
    row(T.qr, "✓", "Bestellt per QR-Code am Tisch", 110); row(T.handy, "📱", "Von: Ihrem Handy", 210);
    g.restore();
  }
  function walletCard(g, u, T, k) {
    const e = outBack(cl(k), 1.7); g.save(); g.translate(660, 640); g.scale(e * 0.92, e * 0.92); g.globalAlpha = cl(k * 2);
    shadow(g, 60, 26, "rgba(0,0,0,0.45)"); fillRR(g, -330, -270, 660, 540, 40, INK); noShadow(g);
    const gr = g.createLinearGradient(-330, -270, 330, 270); gr.addColorStop(0, "rgba(255,92,138,0.35)"); gr.addColorStop(1, "rgba(198,244,50,0.08)"); g.fillStyle = gr; rr(g, -330, -270, 660, 540, 40); g.fill();
    txt(g, "Zum Goldenen Teller", -290, -212, { w: 900, px: 36, c: "#fff", al: "left" }); txt(g, "Treuekarte", -290, -168, { w: 700, px: 26, fam: "I", c: "#b9b3d6", al: "left" });
    const n = u >= T.zehn ? 10 : 9; for (let i = 0; i < 10; i++) { const cx = -224 + (i % 5) * 112, cy = -70 + Math.floor(i / 5) * 110; g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 40, 0, 7); g.stroke();
      if (i < n) { const pk = i === 9 ? outBack(seg(u, T.zehn - 0.02, T.zehn + 0.3), 3) : 1; g.save(); g.translate(cx, cy); g.scale(pk, pk); g.fillStyle = i === 9 ? LIME : PINK; g.beginPath(); g.arc(0, 0, 38, 0, 7); g.fill(); txt(g, "☕", 0, 2, { px: 34 }); g.restore(); }
      if (i === 9 && u >= T.zehn && u < T.zehn + 0.5) { const rk = (u - T.zehn) / 0.5; g.strokeStyle = `rgba(198,244,50,${1 - rk})`; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, 40 + rk * 70, 0, 7); g.stroke(); } }
    txt(g, n + " von 10", -290, 128, { w: 900, px: 40, c: n === 10 ? LIME : "#fff", al: "left" });
    const hb = outBack(seg(u, T.haus - 0.1, T.haus + 0.25), 2.4); if (hb > 0) { g.save(); g.translate(0, 200); g.scale(hb, hb); fillRR(g, -290, -38, 580, 76, 38, LIME); txt(g, "Nächster Besuch: aufs Haus 🎁", 0, 2, { w: 900, px: 32, c: INK }); g.restore(); }
    g.restore();
    if (hb > 0) confettiR(g, u - T.haus, 660, 560);
  }
  function confettiR(g, t, x, y) { if (t < 0 || t > 1.4) return; const C = [PINK, LIME, "#ffd34d", "#5cc8ff"]; for (let i = 0; i < 26; i++) { const a = rnd(i * 2.7) * Math.PI * 2, sp = 300 + rnd(i * 5.1) * 420; const px = x + Math.cos(a) * sp * t, py = y + Math.sin(a) * sp * t * 0.7 + 600 * t * t; g.save(); g.translate(px, py); g.rotate(t * 8 + i); g.globalAlpha = cl(1.4 - t); g.fillStyle = C[i % 4]; g.fillRect(-8, -4, 16, 9); g.restore(); } }
  function calendar(g, u, T) {
    g.save(); g.translate(670, 360); g.lineWidth = 8; g.strokeStyle = OL;
    const span = Math.max(0.6, T.gebaut - T.seit - 0.2), pages = ["3", "10", "17", "24", "1", "8"], N = Math.min(pages.length - 1, Math.max(2, Math.floor(span / 0.3)));
    const pos = cl((u - T.seit - 0.15) / span) * N, i = Math.min(N, Math.floor(pos)), fk = pos - i;
    const page = (lbl, mon) => { fillRR(g, -110, -120, 220, 240, 16, "#ffffff"); g.fillStyle = "#e5243b"; rr(g, -110, -120, 220, 66, [16, 16, 0, 0]); g.fill(); rr(g, -110, -120, 220, 240, 16); g.stroke();
      txt(g, "MONTAG", 0, -86, { w: 900, px: 30, c: "#fff", ls: 3 }); txt(g, lbl, 0, 20, { w: 900, px: 96, c: INK }); txt(g, mon, 0, 92, { w: 800, px: 26, fam: "I", c: "#8a90a0" }); };
    const mon = (j) => (j >= 4 ? "Dezember" : "November");
    page(pages[Math.min(N, i + 1)] || pages[i], mon(Math.min(N, i + 1))); if (i < N || fk < 1) { g.save(); const fall = i < N ? fk : 0; g.translate(fall * 180, fall * fall * 700); g.rotate(fall * 1.4); g.globalAlpha = 1 - fall * 0.6; page(pages[i], mon(i)); g.restore(); }
    g.fillStyle = OL; g.beginPath(); g.arc(-60, -124, 9, 0, 7); g.arc(60, -124, 9, 0, 7); g.fill();
    g.restore();
  }

  TYPES.h_resto = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 1.8,
    prep(o, p) {
      const W0 = (SPEC.words || []).filter((w) => w.scene === o.i); const f = (re, after = 0, def = null) => { const w = W0.find((x) => x.t - o.t0 >= after && re.test(norm(x.w))); return w ? w.t - o.t0 : def; };
      const T = {}; T.knall = f(/^knallt$/, 0, 0.6); T.nie = f(/^nie$/, T.knall, T.knall + 1.3); T.chef1 = f(/^chef/, T.nie, T.nie + 0.9); T.chef2 = f(/^chef/, T.chef1 + 0.25, T.chef1 + 0.9);
      T.ipad = f(/^ipad/, T.chef2, T.chef2 + 0.9); T.tisch = f(/^tisch/, T.ipad, T.ipad + 0.6); T.qr = f(/^qr/, T.tisch, T.tisch + 0.8); T.handy = f(/^handy/, T.qr, T.qr + 1.0);
      T.rot = f(/^knallrot/, T.handy, T.handy + 0.9); T.tippt = f(/^tippt/, T.rot, T.rot + 0.8); T.zehn = f(/^zehnt/, T.tippt, T.tippt + 0.8); T.haus = f(/^haus/, T.zehn, T.zehn + 1.0);
      T.seit = f(/^seitdem/, T.haus, T.haus + 0.7); T.woche = f(/^woche/, T.seit, T.seit + 1.0); T.gebaut = f(/^gebaut/, T.woche, T.woche + 0.7);
      p._T = T;
    },
    draw(g, u, d, p, sc, P) {
      const T = p._T; const mont = u >= T.seit - 0.12;
      // Kamera
      const key = (t, z, x, y) => ({ t, z, x, y });
      const KF = mont
        ? [key(T.seit - 0.12, 1.3, 470, 700), key(T.seit + 0.5, 1.12, 500, 740)]
        : [key(0, 1.36, 330, 700), key(T.chef1 - 0.1, 1.36, 330, 700), key(T.chef1 + 0.25, 1.55, 300, 650), key(T.chef2 - 0.4, 1.55, 300, 650), key(T.chef2 + 0.3, 1.0, 560, 760),
          key(T.rot - 0.25, 1.0, 560, 760), key(T.rot + 0.15, 2.0, 230, 590), key(T.tippt - 0.15, 2.0, 230, 590), key(T.tippt + 0.25, 1.0, 560, 760)];
      let z = KF[0].z, cx = KF[0].x, cy = KF[0].y;
      for (let i = 1; i < KF.length; i++) { const A = KF[i - 1], B = KF[i]; if (u >= A.t) { const k = inOut(cl((u - A.t) / Math.max(0.05, B.t - A.t))); z = lerp(A.z, B.z, k); cx = lerp(A.x, B.x, k); cy = lerp(A.y, B.y, k); } }
      const slams = [0.12, T.knall + 0.05]; let shake = 0; slams.forEach((s) => { const k = u - s; if (k > 0 && k < 0.3) shake = Math.max(shake, (1 - k / 0.3)); });
      const dive = mont ? inExpo(cl((u - T.gebaut + 0.05) / Math.max(0.3, d - T.gebaut + 0.05))) : 0;
      if (dive > 0) { z *= 1 + dive * 50; const k = inOut(cl((u - T.gebaut + 0.05) / 0.35)); cx = lerp(cx, 532, k); cy = lerp(cy, 796, k); }
      const sx = Math.sin(u * 90) * 14 * shake, sy = Math.cos(u * 77) * 10 * shake;
      const S = (x, y) => [(x - cx) * z + 540 + sx, (y - cy) * z + 960 + sy];
      DOOR = mont ? 0 : Math.sin(Math.PI * cl((u - (T.chef2 - 0.5)) / 0.9)) * 0.9;
      g.save(); g.translate(540 + sx, 960 + sy); g.scale(z, z); g.translate(-cx, -cy);
      room(g, u, mont);
      if (mont) {
        calendar(g, u, T); diners(g, u, 0);
        guestSeated(g, 300, 1050, u);
        tableT(g, 400, 860, { y: 0, r: 0 }, true, u);
        chef(g, 720, 1130, { walk: 0, moving: false, pad: 1, tap: 0, thumb: outBack(seg(u, T.seit + 0.1, T.seit + 0.45), 2) });
      } else {
        const look = cl(seg(u, T.chef1 - 0.3, T.chef1)) * (1 - seg(u, T.tippt, T.tippt + 0.3)); diners(g, u, look);
        // Gast
        const ang = 1 - seg(u, T.ipad, T.tisch + 0.2), emb = seg(u, T.tisch, T.rot + 0.15) * (1 - seg(u, T.haus - 0.1, T.haus + 0.2)), joy = outBack(seg(u, T.haus - 0.1, T.haus + 0.3), 1.6);
        const pulse = 0.5 + 0.5 * Math.sin(u * 7); const red = u < T.ipad ? 0.55 + 0.15 * pulse : lerp(0.6, 1, emb);
        const shouting = (u > 0.35 && u < T.chef2 - 0.3) ? 0.6 + 0.4 * Math.abs(Math.sin(u * 11)) : 0;
        const armA = lerp(lerp(-0.25, 0.35, 0.5 + 0.5 * Math.sin(u * 6)) * 0.4 + 0.1, 1.35, 1 - ang);
        guest(g, 190, 1130, { red, ang, emb, joy, arm: armA, shout: shouting, bob: joy > 0.5 ? -Math.abs(Math.sin(u * 9)) * 18 : 0 });
        if (u < T.ipad + 0.2) { // Dampf
          for (let i = 0; i < 4; i++) { const t = (u * 1.3 + i * 0.25) % 1; g.fillStyle = `rgba(255,255,255,${0.8 * (1 - t)})`; const side = i % 2 ? 1 : -1; g.beginPath(); g.arc(190 + side * (70 + t * 40), 470 - t * 120, 16 + t * 22, 0, 7); g.fill(); } }
        if (emb > 0.4 && joy < 0.3) { for (let i = 0; i < 3; i++) { const t = (u * 1.6 + i * 0.33) % 1; g.fillStyle = "#7fd0ff"; g.strokeStyle = OL; g.lineWidth = 4; const x = 270 + i * 12, y = 500 + t * 120; g.beginPath(); g.moveTo(x, y - 18); g.quadraticCurveTo(x + 13, y + 4, x, y + 8); g.quadraticCurveTo(x - 13, y + 4, x, y - 18); g.fill(); g.stroke(); } }
        if (joy > 0.5) { for (let i = 0; i < 3; i++) { const t = ((u - T.haus) * 0.9 + i * 0.33) % 1; g.save(); g.translate(150 + i * 40, 440 - t * 160); g.globalAlpha = 1 - t; g.scale(0.9, 0.9); g.fillStyle = PINK; g.beginPath(); g.moveTo(0, 14); g.bezierCurveTo(-26, -4, -12, -26, 0, -12); g.bezierCurveTo(12, -26, 26, -4, 0, 14); g.fill(); g.restore(); } }
        // Tisch mit springendem Teller
        let py = 0, pr = 0; slams.forEach((s) => { const k = u - s; if (k > 0 && k < 0.45) { py = Math.max(py, Math.sin(Math.PI * k / 0.45) * 46); pr = Math.sin(k * 30) * 0.08 * (1 - k / 0.45); } });
        tableT(g, 400, 860, { y: py, r: pr }, false, u);
        if (u < 0.12) { const k = u / 0.12; g.save(); g.translate(350, 848 - (1 - k) * 160); g.fillStyle = "#ffffff"; g.lineWidth = 7; g.strokeStyle = OL; g.beginPath(); g.ellipse(0, 0, 105, 26, 0, 0, 7); g.restore(); }
        // Chef
        const walkK = out3(seg(u, T.chef2 - 0.4, Math.min(T.ipad - 0.1, T.chef2 + 0.95)));
        if (u > T.chef2 - 0.45) chef(g, lerp(1160, 700, walkK), 1130, { walk: u * 11, moving: walkK > 0 && walkK < 0.98, pad: outBack(seg(u, T.ipad - 0.2, T.ipad + 0.1), 1.4), tap: Math.max(0, Math.sin(Math.PI * seg(u, T.tippt - 0.05, T.tippt + 0.25))), thumb: 0 });
      }
      g.restore();
      // Knall-Wörter
      slams.forEach((s, i) => { const k = (u - s) / 0.55; if (k <= 0 || k >= 1) return; const [x, y] = S(410, 760); g.save(); g.translate(x + (i ? 150 : -40), y - 40); g.rotate(i ? 0.18 : -0.15); g.scale(outBack(cl(k * 3), 3), outBack(cl(k * 3), 3)); g.globalAlpha = cl((1 - k) * 3);
        g.lineWidth = 16; g.strokeStyle = OL; font(g, 900, 120, "D"); g.textAlign = "center"; g.textBaseline = "middle"; g.strokeText(i ? "KNALL!" : "BAM!", 0, 0); g.fillStyle = "#ffd34d"; g.fillText(i ? "KNALL!" : "BAM!", 0, 0); g.restore(); });
      // Sprechblasen
      if (!mont) {
        const [gx, gy] = S(190, 470), [hx, hy] = S(Math.min(700, lerp(1160, 700, out3(seg(u, T.chef2 - 0.4, T.chef2 + 0.95)))), 470);
        const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
        const b1a = Math.max(0.3, T.nie - 0.6);
        bubble(g, ["Das habe ich *NIE*", "bestellt!"], 560, 520, gx + 40, gy, win(b1a, T.chef1 - 0.42), { shout: true, px: 54 });
        bubble(g, ["Ich will", "den *CHEF*!"], 600, 520, gx + 40, gy, win(T.chef1 - 0.42, T.chef2 - 0.3), { shout: true, px: 64 });
        bubble(g, ["Schauen wir mal."], hx - 120, 520, hx - 20, hy + 20, win(T.chef2 + 0.35, T.ipad + 0.05), { px: 44 });
        bubble(g, ["…"], 420, 470, gx + 30, gy + 20, win(T.rot - 0.05, T.tippt - 0.05), { px: 70 });
        bubble(g, ["Echt jetzt?!"], 230, 470, gx, gy - 10, win(T.haus + 0.25, T.seit - 0.15), { px: 44 });
      } else {
        const [gx, gy] = S(300, 610); bubble(g, ["Wie immer,", "*Chef*!"], 330, 560, gx + 20, gy, outBack(seg(u, T.seit + 0.35, T.seit + 0.6), 2) * (1 - seg(u, T.gebaut - 0.1, T.gebaut + 0.05)), { px: 46 });
      }
      // Karten
      if (!mont) {
        const ik = seg(u, T.ipad + 0.02, T.ipad + 0.42) * (1 - inOut(seg(u, T.rot - 0.32, T.rot - 0.08))); if (ik > 0) { g.fillStyle = `rgba(20,12,8,${0.35 * cl(ik * 2)})`; g.fillRect(0, 0, W, H); ipadCard(g, u, T, ik); }
        const wk = seg(u, T.tippt + 0.12, T.tippt + 0.5) * (1 - inOut(seg(u, T.seit - 0.4, T.seit - 0.14))); if (wk > 0) walletCard(g, u, T, wk);
      }
      // kurzer Blitz beim Sprung in die Montage
      const mf = 1 - cl(Math.abs(u - (T.seit - 0.12)) / 0.12); if (mf > 0) { g.fillStyle = `rgba(255,255,255,${mf * 0.8})`; g.fillRect(0, 0, W, H); }
      const wf = cl((u - (d - 0.16)) / 0.16); if (wf > 0) { g.fillStyle = `rgba(255,255,255,${wf})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) {
      const T = p._T, E = [[0.0, "whoosh_down", 0.35, 0], [0.12, "slap", 0.7, -0.2], [0.13, "boom", 0.35, -0.1], [0.2, "domino_tap", 0.4, 0]];
      E.push([T.knall + 0.05, "slap", 0.7, 0.1]); E.push([T.knall + 0.12, "domino_tap", 0.4, 0.1]);
      E.push([Math.max(0.3, T.nie - 0.6), "pop", 0.45, -0.3]); E.push([T.chef1 - 0.42, "pop", 0.5, -0.3]);
      E.push([T.chef2 - 0.5, "gdoor", 0.5, 0.6]); E.push([T.chef2 - 0.2, "vsteps", 0.4, 0.4]); E.push([T.chef2 + 0.35, "pop", 0.35, 0.3]);
      E.push([T.ipad, "whoosh_up", 0.4, 0]); E.push([T.tisch, "ding", 0.45, 0]); E.push([T.qr, "click", 0.4, 0]); E.push([T.handy, "ping", 0.45, 0]);
      E.push([T.rot, "vsad", 0.35, -0.3]); E.push([T.tippt, "click", 0.45, 0.2]); E.push([T.tippt + 0.15, "whoosh_side", 0.3, 0.3]);
      E.push([T.zehn, "rc_stamp", 0.55, 0.2]); E.push([T.zehn + 0.02, "chime", 0.35, 0.2]); E.push([T.haus, "shimmer", 0.4, 0]); E.push([T.haus + 0.05, "cash", 0.35, 0]);
      E.push([T.seit - 0.15, "whoosh_side", 0.45, 0]); for (let t = T.seit + 0.3; t < T.gebaut - 0.2; t += 0.3) E.push([t, "tr_swish", 0.25, 0.3]);
      E.push([T.gebaut - 0.05, "riser", 0.6, 0, Math.max(0.3, d - T.gebaut + 0.05)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0);
    },
  };
})();
