// VOICE_DELAY: 0.5
// h_zombie: Neugier-Geschichte (Look "story", Anti-Werbung). Halloween, drei Uhr nachts, Vollmond: Zombie-Hände knallen gegen die
// Glastür eines Kiosks (BAM). Hundert Comic-Zombies rütteln an der Tür („AUF!“, „Wann???“), Fragezeichen bei „aufmacht“.
// Innen zittert der Besitzer unter der Theke (Zähne klappern). Schwenk über die Straße: vor der Bäckerei sitzen Zombies entspannt
// auf Klappstühlen, einer liest Zeitung („Noch vier Stunden.“), Schild an der Tür „Mo bis So ab 7 Uhr“. Bei „sieben“ Kirchturmuhr
// (3 → 7 Uhr, Glocke). Bei „Denn“ schwingt die Kamera auf das Schild an der Bäckertür und taucht hinein, Weiß. Danach zombie_end.
// Wörter: drei, hundert, kiosk, rütteln, eins, wann, aufmacht, besitzer, zittert, gegenüber, bäckerei, entspannt, warten, sieben, denn.
(() => {
  const OL = SK.OL;
  const SKINS = ["#9fcf7c", "#8cc29a", "#b0d58a", "#86b98c", "#a6c98f"];
  const SHZ = ["#7a5a8e", "#5b6e8f", "#8e5b4a", "#6a7d4a", "#a0624a", "#4f6f7a", "#8a7a52", "#6b4f7a"];
  const PZ = ["#3b3f56", "#4a3b32", "#2f4550", "#50455c"];
  const HZ = ["#3a2a22", "#5b4a3a", "#2b2b2b", "#7a6a5a", "#4a3a5a"];
  const HSZ = ["short", "long", "bald", "short", "bun", "grey"];
  const OWNER = { hs: "short", hair: "#2a1f1a", shirt: "#e0703a", pants: "#33374a", skin: "#efc29c", beard: "#3a2a22", apron: "#f3efe4" };
  const mixS = (a, b, k) => SK.mix(a, b, k);

  // ---------- Bausteine ----------
  function palm(g, x, y, sz, col, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(sz, sz); g.fillStyle = col; g.strokeStyle = OL; g.lineWidth = 6; g.lineJoin = "round";
    for (let i = 0; i < 4; i++) { g.save(); g.rotate(-0.35 + i * 0.23); rr(g, -9, -78, 18, 52, 9); g.fill(); g.stroke(); g.restore(); }
    g.save(); g.rotate(-1.25); rr(g, -9, -62, 18, 40, 9); g.fill(); g.stroke(); g.restore();
    g.beginPath(); g.ellipse(0, -8, 30, 34, 0, 0, 7); g.fill(); g.stroke(); g.restore(); }
  function clockFace(g, x, y, r, hr, roman) { g.save(); g.lineWidth = Math.max(4, r * 0.08); g.strokeStyle = OL; g.fillStyle = "#3a3346"; g.beginPath(); g.arc(x, y, r * 1.13, 0, 7); g.fill(); g.stroke();
    const fg = g.createRadialGradient(x, y - r * 0.3, 4, x, y, r); fg.addColorStop(0, "#fff8de"); fg.addColorStop(1, "#e6d6a2"); g.fillStyle = fg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OL; if (roman) { g.font = `400 ${r * 0.24}px S`; g.textAlign = "center"; g.textBaseline = "middle"; const RN = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"]; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(RN[i], x + Math.sin(a) * r * 0.77, y - Math.cos(a) * r * 0.77); } }
    else for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.arc(x + Math.sin(a) * r * 0.8, y - Math.cos(a) * r * 0.8, i % 3 ? r * 0.04 : r * 0.08, 0, 7); g.fill(); }
    const ha = (hr % 12) / 12 * Math.PI * 2, ma = (hr % 1) * Math.PI * 2; g.lineCap = "round";
    g.lineWidth = r * 0.09; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ha) * r * 0.5, y - Math.cos(ha) * r * 0.5); g.stroke();
    g.lineWidth = r * 0.05; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ma) * r * 0.8, y - Math.cos(ma) * r * 0.8); g.stroke();
    circle(g, x, y, r * 0.07, "#b8452a"); g.restore(); }
  function pumpkin(g, x, y, s, u, i = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL;
    const gl = 0.75 + 0.25 * Math.sin(u * 11 + i * 2) * Math.sin(u * 7.3 + i); const rg = g.createRadialGradient(0, -40, 10, 0, -40, 170); rg.addColorStop(0, `rgba(255,170,60,${0.35 * gl})`); rg.addColorStop(1, "rgba(255,170,60,0)"); g.fillStyle = rg; g.fillRect(-170, -210, 340, 340);
    g.fillStyle = "#e8761e"; for (const dx of [-34, 34, 0]) { g.beginPath(); g.ellipse(dx, -42, dx ? 40 : 44, 44, 0, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = "#3d6b2a"; rr(g, -7, -102, 14, 24, 5); g.fill(); g.stroke();
    g.fillStyle = `rgb(255,${200 + Math.floor(40 * gl)},90)`; g.beginPath(); g.moveTo(-34, -56); g.lineTo(-18, -74); g.lineTo(-4, -56); g.closePath(); g.moveTo(34, -56); g.lineTo(18, -74); g.lineTo(4, -56); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(-40, -32); g.quadraticCurveTo(0, -4, 40, -32); g.lineTo(26, -26); g.lineTo(18, -34); g.lineTo(8, -24); g.lineTo(-4, -34); g.lineTo(-14, -24); g.lineTo(-24, -34); g.closePath(); g.fill(); g.restore(); }
  function lamp(g, x, ground, h) { g.fillStyle = "#14121e"; g.strokeStyle = OL; g.lineWidth = 6; g.fillRect(x - 9, ground - h, 18, h); g.strokeRect(x - 9, ground - h, 18, h);
    rr(g, x - 30, ground - h - 70, 60, 74, 10); g.fillStyle = "#14121e"; g.fill(); g.stroke(); fillRR(g, x - 20, ground - h - 60, 40, 52, 6, "#ffe2a0");
    const lg = g.createRadialGradient(x, ground - h - 34, 6, x, ground - h - 34, 380); lg.addColorStop(0, "rgba(255,214,140,0.45)"); lg.addColorStop(1, "rgba(255,214,140,0)"); g.fillStyle = lg; g.fillRect(x - 380, ground - h - 414, 760, 760); }
  function bat(g, x, y, s, u, i) { const f = Math.sin(u * 18 + i * 2); g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = "#0c0a14";
    g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-30, -30 * f - 10, -70, -20 * f); g.quadraticCurveTo(-50, 0, -40, 10); g.quadraticCurveTo(-20, 0, 0, 8); g.quadraticCurveTo(20, 0, 40, 10); g.quadraticCurveTo(50, 0, 70, -20 * f); g.quadraticCurveTo(30, -30 * f - 10, 0, 0); g.fill();
    g.beginPath(); g.ellipse(0, 2, 12, 16, 0, 0, 7); g.fill(); g.restore(); }
  function bats(g, u, a, n = 4) { if (a <= 0) return; g.save(); g.globalAlpha = a; for (let i = 0; i < n; i++) { const t = (u * (0.09 + rnd(i * 3.1) * 0.05) + rnd(i * 1.7)) % 1; bat(g, lerp(-100, 1180, t), 150 + rnd(i * 5.3) * 200 + Math.sin(u * 3 + i) * 30, 0.6 + rnd(i) * 0.5, u, i); } g.restore(); }

  // Himmel im Bildschirm (Parallaxe): Verlauf, Sterne, Vollmond, dünne Wolken
  function sky(g, u, mx = 250, my = 260, mr = 120) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0a0b22"); gr.addColorStop(0.55, "#22204a"); gr.addColorStop(1, "#3a2f5a"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) circle(g, rnd(i * 2.3) * W, rnd(i * 5.1) * 1100, 1.4 + rnd(i) * 2.2, `rgba(255,255,255,${0.3 + 0.5 * (0.5 + 0.5 * Math.sin(u * 3 + i))})`);
    const mg = g.createRadialGradient(mx, my, mr * 0.8, mx, my, mr * 3.2); mg.addColorStop(0, "rgba(255,246,210,0.35)"); mg.addColorStop(1, "rgba(255,246,210,0)"); g.fillStyle = mg; g.fillRect(mx - mr * 3.2, my - mr * 3.2, mr * 6.4, mr * 6.4);
    circle(g, mx, my, mr, "#fff3cf"); g.fillStyle = "rgba(214,196,150,0.55)"; [[-0.3, -0.2, 0.22], [0.35, 0.1, 0.16], [-0.05, 0.4, 0.13], [0.2, -0.45, 0.1]].forEach(([a, b, r]) => { g.beginPath(); g.arc(mx + a * mr, my + b * mr, r * mr, 0, 7); g.fill(); });
    g.fillStyle = "rgba(40,36,80,0.55)"; for (let i = 0; i < 3; i++) { const cx = ((rnd(i * 4.1) * 1400 + u * 22) % 1500) - 200, cy = 140 + i * 120; g.beginPath(); g.ellipse(cx, cy, 220, 26, 0, 0, 7); g.ellipse(cx + 120, cy - 14, 140, 22, 0, 0, 7); g.fill(); }
  }

  // ---------- Zombie (lustig, kein Blut) ----------
  function zombie(g, x, feet, s, o = {}) { const k = o.k || 0;
    const hs = o.hs || HSZ[k % HSZ.length], bald = hs === "bald";
    const base = { skin: SKINS[k % SKINS.length], hair: HZ[k % HZ.length], hs: bald ? "grey" : hs, shirt: SHZ[k % SHZ.length], pants: PZ[k % PZ.length], shoes: "#3a3030", eyes: "wide", mouth: "open", brow: 0.4, ...o };
    if (bald) base.hair = base.skin;
    if (o.back) { base.eyes = "closed"; base.mouth = "flat"; base.brow = 0; base.glasses = false; }
    SK.person(g, x, feet, s, base);
    g.save(); g.translate(x, feet + (o.bob || 0)); g.scale(s * (o.flip ? -1 : 1), s); g.lineWidth = 6; g.strokeStyle = OL; g.lineJoin = "round"; g.lineCap = "round";
    const by = o.sit ? 140 : 0, hy = -545 + by;
    // zerrissener Saum + Flicken
    g.fillStyle = mixS(base.shirt, "#000000", 0.35); for (let i = 0; i < 5; i++) { const sx = -70 + i * 35; g.beginPath(); g.moveTo(sx, -215 + by); g.lineTo(sx + 17, -188 + by); g.lineTo(sx + 34, -215 + by); g.fill(); }
    if (!o.back) { fillRR(g, -62 + (k % 3) * 30, -380 + by, 46, 40, 6, mixS(base.shirt, "#ffffff", 0.35)); rr(g, -62 + (k % 3) * 30, -380 + by, 46, 40, 6); g.stroke();
      g.lineWidth = 3; g.beginPath(); for (let i = 0; i < 3; i++) { const sx = -54 + (k % 3) * 30 + i * 14; g.moveTo(sx, -386 + by); g.lineTo(sx + 6, -374 + by); } g.stroke(); g.lineWidth = 6; }
    if (o.back) { // Hinterkopf
      g.fillStyle = base.skin; g.beginPath(); g.ellipse(-74, hy + 4, 14, 22, 0, 0, 7); g.ellipse(74, hy + 4, 14, 22, 0, 0, 7); g.fill(); g.stroke();
      g.fillStyle = bald ? base.skin : base.hair; g.beginPath(); g.arc(0, hy, 74, 0, 7); g.fill(); g.stroke();
      if (bald) { g.lineWidth = 4; g.beginPath(); g.moveTo(-30, hy - 30); g.lineTo(26, hy - 10); for (let i = 0; i < 4; i++) { const t = i / 3, sx = lerp(-30, 26, t), sy = lerp(hy - 30, hy - 10, t); g.moveTo(sx - 5, sy - 10); g.lineTo(sx + 5, sy + 10); } g.stroke(); }
      else { g.strokeStyle = mixS(base.hair, "#000000", 0.4); g.lineWidth = 4; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(-20 + i * 14, hy + 40, 40, -2.2, -1.4); g.stroke(); } }
    } else {
      const ey = hy - 8; g.strokeStyle = "rgba(70,40,90,0.55)"; g.lineWidth = 6; g.beginPath(); g.arc(-26, ey + 6, 20, 0.5, Math.PI - 0.5); g.stroke(); g.beginPath(); g.arc(26, ey + 6, 20, 0.5, Math.PI - 0.5); g.stroke();
      if (k % 2 === 0) { g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.moveTo(-40, hy - 46); g.lineTo(6, hy - 34); for (let i = 0; i < 4; i++) { const t = i / 3, sx = lerp(-40, 6, t), sy = lerp(hy - 46, hy - 34, t); g.moveTo(sx - 3, sy - 9); g.lineTo(sx + 3, sy + 9); } g.stroke(); }
      if (k % 3 === 1) { g.fillStyle = "#f3efe4"; g.strokeStyle = OL; g.lineWidth = 4; g.save(); g.translate(48, hy - 34); g.rotate(0.5); rr(g, -26, -9, 52, 18, 5); g.fill(); g.stroke(); g.restore(); }
      if (o.mouth === "open" || o.mouth === "shout" || o.mouth == null) { g.fillStyle = "#fffbe8"; g.fillRect(-12, hy + 30, 9, 9); g.fillRect(4, hy + 30, 9, 9); }
    }
    if (o.party) { g.fillStyle = "#f2b134"; g.strokeStyle = OL; g.lineWidth = 6; g.beginPath(); g.moveTo(-40, hy - 62); g.lineTo(12, hy - 180); g.lineTo(46, hy - 52); g.closePath(); g.fill(); g.stroke(); circle(g, 12, hy - 186, 14, "#e85d75"); g.stroke(); }
    if (o.curlers) { for (let i = 0; i < 4; i++) { fillRR(g, -60 + i * 32, hy - 84 + Math.abs(i - 1.5) * 10, 26, 20, 8, ["#f4a6c0", "#8ad6c9"][i % 2]); rr(g, -60 + i * 32, hy - 84 + Math.abs(i - 1.5) * 10, 26, 20, 8); g.stroke(); } }
    g.restore(); }
  // Silhouetten weiter hinten (die „Hundert“)
  function mass(g, u, x0, x1, feet, s, n, seed, a = 1) { g.save(); g.globalAlpha = a; for (let i = 0; i < n; i++) { const x = lerp(x0, x1, (i + rnd(seed + i) * 0.6) / n), b = Math.abs(Math.sin(u * 7 + i * 1.7)) * -14 * s, hy = feet - 520 * s + b;
      g.fillStyle = ["#3f5f4a", "#465a52", "#3a5446"][i % 3]; g.strokeStyle = "#1a1626"; g.lineWidth = 5;
      g.beginPath(); g.ellipse(x, feet - 250 * s, 105 * s, 240 * s, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(x, hy, 66 * s, 0, 7); g.fill(); g.stroke();
      const ax = Math.sin(u * 9 + i) * 20 * s; g.lineWidth = 26 * s; g.strokeStyle = "#3f5f4a"; g.beginPath(); g.moveTo(x - 80 * s, feet - 380 * s); g.lineTo(x - 120 * s + ax, feet - 600 * s + b); g.moveTo(x + 80 * s, feet - 380 * s); g.lineTo(x + 120 * s - ax, feet - 600 * s + b); g.stroke();
      circle(g, x - 22 * s, hy - 6 * s, 9 * s, "#e8f59a"); circle(g, x + 22 * s, hy - 6 * s, 9 * s, "#e8f59a"); } g.restore(); }

  // ---------- Welt: Kiosk (x 60..1020), Kirchturm (1380), Bäckerei (1750..2850), Boden y 1250 ----------
  function kiosk(g, u, o) {
    g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round";
    g.fillStyle = "#3b3552"; g.fillRect(40, 40, 1000, 460); g.strokeRect(40, 40, 1000, 460);
    g.fillStyle = "rgba(0,0,0,0.12)"; for (let r = 0; r < 11; r++) for (let c = 0; c < 14; c++) if ((r + c) % 3 === 0) g.fillRect(48 + c * 70 + (r % 2) * 35, 50 + r * 40, 60, 28);
    for (let i = 0; i < 3; i++) { const wx = 110 + i * 320, lit = i === 2; g.fillStyle = lit ? "#ffd98a" : "#1a1c33"; rr(g, wx, 130, 220, 260, 10); g.fill(); g.stroke();
      if (lit) { g.fillStyle = "#e85d75"; g.beginPath(); g.moveTo(wx + 8, 136); g.quadraticCurveTo(wx + 70, 200, wx + 40, 384); g.lineTo(wx + 8, 384); g.closePath(); g.fill(); g.beginPath(); g.moveTo(wx + 212, 136); g.quadraticCurveTo(wx + 150, 200, wx + 180, 384); g.lineTo(wx + 212, 384); g.closePath(); g.fill(); }
      g.beginPath(); g.moveTo(wx + 110, 130); g.lineTo(wx + 110, 390); g.moveTo(wx, 260); g.lineTo(wx + 220, 260); g.stroke(); fillRR(g, wx - 14, 384, 248, 22, 6, "#2a2640"); rr(g, wx - 14, 384, 248, 22, 6); g.stroke(); }
    // Ladenfront
    g.fillStyle = "#1f4f45"; g.fillRect(60, 500, 960, 750); g.strokeRect(60, 500, 960, 750);
    // Leuchtkasten KIOSK (flackert)
    const fl = o.flick; if (fl > 0.5) { const lg = g.createRadialGradient(540, 565, 40, 540, 565, 520); lg.addColorStop(0, "rgba(255,226,150,0.4)"); lg.addColorStop(1, "rgba(255,226,150,0)"); g.fillStyle = lg; g.fillRect(20, 300, 1040, 560); }
    g.strokeStyle = OL; const sg = g.createLinearGradient(0, 510, 0, 630); sg.addColorStop(0, mixS("#5a5040", "#fff1c2", fl)); sg.addColorStop(1, mixS("#4a4234", "#ffd77a", fl)); g.fillStyle = sg; rr(g, 110, 515, 860, 115, 18); g.fill(); g.stroke();
    g.font = "900 104px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.letterSpacing = "14px"; g.fillStyle = mixS("#3a2a22", "#b8321f", fl); g.fillText("KIOSK", 547, 576); g.letterSpacing = "0px";
    // Schaufenster
    const win = (wx, kind) => { g.fillStyle = "#16203a"; rr(g, wx, 690, 270, 430, 10); g.fill(); g.stroke(); g.save(); g.beginPath(); g.rect(wx, 690, 270, 430); g.clip();
      if (kind === 0) { for (let i = 0; i < 3; i++) { fillRR(g, wx + 20, 740 + i * 120, 230, 12, 4, "#6b4a32"); for (let j = 0; j < 4; j++) { const jx = wx + 45 + j * 58, jy = 700 + i * 120; g.fillStyle = "rgba(200,230,255,0.25)"; rr(g, jx - 20, jy, 40, 40, 8); g.fill(); g.lineWidth = 4; g.stroke(); circle(g, jx - 6, jy + 26, 8, ["#e85d75", "#f2b134", "#5b8def", "#3d9a6b"][(i + j) % 4]); circle(g, jx + 7, jy + 22, 8, ["#f2b134", "#e85d75", "#3d9a6b", "#5b8def"][(i + j) % 4]); } }
        for (let j = 0; j < 4; j++) { fillRR(g, wx + 24 + j * 60, 1040, 48, 70, 4, ["#f3efe4", "#ffe08a", "#f3efe4", "#cfe3ff"][j]); g.lineWidth = 3; rr(g, wx + 24 + j * 60, 1040, 48, 70, 4); g.stroke(); g.fillStyle = "#555"; g.fillRect(wx + 30 + j * 60, 1052, 36, 6); g.fillRect(wx + 30 + j * 60, 1064, 30, 4); } }
      else { const cg = g.createLinearGradient(0, 690, 0, 1120); cg.addColorStop(0, "#2b5f8f"); cg.addColorStop(1, "#173458"); g.fillStyle = cg; g.fillRect(wx + 20, 710, 230, 400); for (let i = 0; i < 3; i++) { fillRR(g, wx + 24, 830 + i * 130, 222, 8, 3, "#9fc7ea"); for (let j = 0; j < 5; j++) { g.fillStyle = ["#e5243b", "#3d9a6b", "#f2b134", "#8e5bd6", "#5b8def"][(i * 2 + j) % 5]; g.lineWidth = 3; rr(g, wx + 34 + j * 42, 740 + i * 130, 28, 86, 8); g.fill(); g.stroke(); } } }
      g.fillStyle = "rgba(255,255,255,0.13)"; g.beginPath(); g.moveTo(wx + 30, 1120); g.lineTo(wx + 150, 690); g.lineTo(wx + 200, 690); g.lineTo(wx + 80, 1120); g.closePath(); g.fill(); g.restore(); g.lineWidth = 8; };
    win(95, 0); win(715, 1);
    // Tür (rüttelt)
    g.save(); g.translate(o.rattle || 0, 0); g.fillStyle = "#123a33"; g.fillRect(398, 670, 284, 580); g.strokeRect(398, 670, 284, 580);
    g.fillStyle = "#151c30"; rr(g, 420, 692, 240, 470, 8); g.fill(); g.stroke();
    g.save(); g.beginPath(); g.rect(420, 692, 240, 470); g.clip(); g.fillStyle = "#222a44"; g.fillRect(420, 692, 240, 470);
    for (let i = 0; i < 3; i++) fillRR(g, 430, 920 + i * 90, 220, 10, 3, "#3a3046"); clockFace(g, 540, 790, 44, o.hr || 3, false);
    g.fillStyle = "rgba(255,255,255,0.12)"; g.beginPath(); g.moveTo(440, 1160); g.lineTo(560, 692); g.lineTo(600, 692); g.lineTo(480, 1160); g.closePath(); g.fill(); g.restore();
    fillRR(g, 622, 960, 22, 90, 10, "#d9b45a"); rr(g, 622, 960, 22, 90, 10); g.stroke(); g.restore();
    fillRR(g, 380, 1236, 320, 18, 4, "#2a2433");
  }
  function tower(g, u, hr) { g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#4a4462"; g.fillRect(1290, -40, 180, 1290); g.strokeRect(1290, -40, 180, 1290);
    g.fillStyle = "#2f2a44"; g.beginPath(); g.moveTo(1270, -40); g.lineTo(1380, -330); g.lineTo(1490, -40); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(1380, -330); g.lineTo(1380, -400); g.moveTo(1360, -380); g.lineTo(1400, -380); g.stroke();
    g.fillStyle = "rgba(0,0,0,0.13)"; for (let r = 0; r < 30; r++) g.fillRect(1296 + (r % 2) * 40, -20 + r * 42, 80, 26);
    fillRR(g, 1345, 360, 70, 140, 34, "#1a1830"); rr(g, 1345, 360, 70, 140, 34); g.stroke(); clockFace(g, 1380, 150, 95, hr, true); }
  function tree(g, x, ground) { g.strokeStyle = "#17131f"; g.lineCap = "round"; const br = (x0, y0, a, l, w, n) => { if (n <= 0) return; const x1 = x0 + Math.cos(a) * l, y1 = y0 + Math.sin(a) * l; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); br(x1, y1, a - 0.45, l * 0.72, w * 0.66, n - 1); br(x1, y1, a + 0.4, l * 0.7, w * 0.66, n - 1); };
    br(x, ground, -Math.PI / 2, 300, 40, 6); }
  function bakery(g, u, o) {
    g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round";
    g.fillStyle = "#5a4a6a"; g.fillRect(1730, 40, 1140, 460); g.strokeRect(1730, 40, 1140, 460);
    g.fillStyle = "#2a2440"; g.beginPath(); g.moveTo(1710, 40); g.lineTo(2300, -120); g.lineTo(2890, 40); g.closePath(); g.fill(); g.stroke();
    for (let i = 0; i < 3; i++) { const wx = 1820 + i * 360; g.fillStyle = "#1c1a33"; rr(g, wx, 130, 220, 260, 10); g.fill(); g.stroke(); g.beginPath(); g.moveTo(wx + 110, 130); g.lineTo(wx + 110, 390); g.moveTo(wx, 260); g.lineTo(wx + 220, 260); g.stroke();
      fillRR(g, wx - 10, 384, 240, 26, 6, "#3a2f2a"); rr(g, wx - 10, 384, 240, 26, 6); g.stroke(); for (let j = 0; j < 3; j++) { circle(g, wx + 40 + j * 70, 376, 22, ["#e85d75", "#f2b134", "#e0703a"][j]); g.lineWidth = 4; g.stroke(); g.lineWidth = 8; } }
    g.fillStyle = "#e9d6b4"; g.fillRect(1750, 500, 1100, 750); g.strokeRect(1750, 500, 1100, 750);
    g.fillStyle = "rgba(0,0,0,0.06)"; for (let r = 0; r < 18; r++) for (let c = 0; c < 15; c++) if ((r + c) % 4 === 0) g.fillRect(1756 + c * 74 + (r % 2) * 37, 506 + r * 42, 64, 30);
    fillRR(g, 1800, 515, 1000, 120, 18, "#4a2c1e"); rr(g, 1800, 515, 1000, 120, 18); g.stroke(); g.strokeStyle = "#d9b45a"; g.lineWidth = 3; rr(g, 1814, 529, 972, 92, 12); g.stroke(); g.strokeStyle = OL; g.lineWidth = 8;
    g.font = "400 88px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.letterSpacing = "12px"; g.fillStyle = "#f6d58a"; g.fillText("BÄCKEREI", 2306, 578); g.letterSpacing = "0px";
    // Brezel-Zeichen
    g.save(); g.translate(1760, 700); g.strokeStyle = OL; g.lineWidth = 6; g.fillStyle = "#3a3046"; g.fillRect(-10, -60, 60, 12); g.strokeRect(-10, -60, 60, 12); g.strokeStyle = "#a8642a"; g.lineWidth = 16; g.beginPath(); g.arc(36, 10, 34, 0, 7); g.stroke(); g.restore();
    // Markise
    for (let i = 0; i < 14; i++) { g.fillStyle = i % 2 ? "#f3efe4" : "#8a4a2a"; g.beginPath(); g.moveTo(1770 + i * 75, 650); g.lineTo(1845 + i * 75, 650); g.lineTo(1845 + i * 75, 712); g.arc(1807.5 + i * 75, 712, 37.5, 0, Math.PI); g.closePath(); g.fill(); g.stroke(); }
    // Auslage mit Brot (Mondlicht, dunkel)
    g.fillStyle = "#2a2234"; rr(g, 1790, 790, 470, 360, 10); g.fill(); g.stroke(); g.save(); g.beginPath(); g.rect(1790, 790, 470, 360); g.clip();
    for (let i = 0; i < 2; i++) { fillRR(g, 1800, 930 + i * 140, 450, 12, 4, "#6b4a32"); for (let j = 0; j < 5; j++) { const bx = 1840 + j * 88, by = 905 + i * 140; g.fillStyle = ["#c98a4a", "#b5733a", "#d9a05a"][(i + j) % 3]; g.lineWidth = 4; g.beginPath(); g.ellipse(bx, by, 36, 22, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(bx - 16, by - 8); g.lineTo(bx - 6, by + 8); g.moveTo(bx + 2, by - 10); g.lineTo(bx + 12, by + 6); g.stroke(); } }
    g.fillStyle = "rgba(255,255,255,0.12)"; g.beginPath(); g.moveTo(1820, 1150); g.lineTo(1960, 790); g.lineTo(2020, 790); g.lineTo(1880, 1150); g.closePath(); g.fill(); g.restore(); g.lineWidth = 8;
    // Tür mit Schild
    g.fillStyle = "#6b3f26"; g.fillRect(2300, 740, 260, 510); g.strokeRect(2300, 740, 260, 510); g.fillStyle = "#1f1a2c"; rr(g, 2322, 762, 216, 380, 8); g.fill(); g.stroke(); fillRR(g, 2510, 1010, 18, 80, 9, "#d9b45a"); rr(g, 2510, 1010, 18, 80, 9); g.stroke();
    const sw = Math.sin(u * 2.2) * 0.04; g.save(); g.translate(2430, 800); g.rotate(sw); g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.moveTo(-60, 22); g.lineTo(0, -16); g.lineTo(60, 22); g.stroke(); circle(g, 0, -16, 6, "#d9b45a");
    g.fillStyle = "#fff6e0"; g.lineWidth = 6; rr(g, -96, 20, 192, 156, 12); g.fill(); g.stroke(); g.strokeStyle = "#b8862a"; g.lineWidth = 2.5; rr(g, -86, 30, 172, 136, 8); g.stroke();
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#6b3f26"; g.font = "italic 400 25px S"; g.fillText("Öffnungszeiten", 0, 54); g.fillStyle = "#2b1d14"; g.font = "600 30px S"; g.fillText("Mo bis So", 0, 96); g.font = "900 38px D"; g.fillStyle = "#b8321f"; g.fillText("ab 7 Uhr", 0, 140); g.restore();
    g.fillStyle = "#2a2234"; rr(g, 2600, 790, 210, 360, 10); g.fill(); g.stroke(); g.fillStyle = "#c98a4a"; g.lineWidth = 4; for (let j = 0; j < 2; j++) { g.beginPath(); g.ellipse(2660 + j * 90, 1060, 34, 30, 0, 0, 7); g.fill(); g.stroke(); }
    fillRR(g, 2280, 1236, 300, 18, 4, "#5a4a3a");
  }
  function street(g, u) { g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#4e4b66"; g.fillRect(-1200, 1250, 5400, 90); g.strokeRect(-1200, 1250, 5400, 90); g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 4; for (let i = -12; i < 40; i++) { g.beginPath(); g.moveTo(i * 120, 1254); g.lineTo(i * 120 - 30, 1336); g.stroke(); }
    g.fillStyle = "#24223a"; g.fillRect(-1200, 1340, 5400, 1600); g.fillStyle = "rgba(255,255,255,0.35)"; for (let i = -10; i < 30; i++) g.fillRect(i * 220, 1590, 120, 16);
    for (let i = 0; i < 6; i++) { const fx = ((rnd(i * 3.7) * 4200 + u * (30 + rnd(i) * 30)) % 4400) - 600; const fg = g.createRadialGradient(fx, 1260, 10, fx, 1260, 420); fg.addColorStop(0, "rgba(190,200,240,0.16)"); fg.addColorStop(1, "rgba(190,200,240,0)"); g.fillStyle = fg; g.fillRect(fx - 420, 1000, 840, 520); }
  }
  function world(g, u, o) { tower(g, u, o.hr); tree(g, 1620, 1250); bakery(g, u, o); kiosk(g, u, o); lamp(g, 1130, 1250, 620); lamp(g, 2980, 1250, 620); street(g, u); }

  // Zombies vor dem Kiosk (vorn sichtbar, Gesicht zur Kamera, Arme hoch)
  const MID = [[60, 3, {}], [225, 1, { curlers: true, hs: "grey", hair: "#d0d0d8" }], [375, 6, {}], [710, 4, {}], [860, 2, { party: true }], [1020, 7, {}]];
  const FRONT = [[0, 5, {}], [160, 0, {}], [320, 8, { hs: "bald" }], [770, 9, { hs: "long" }], [925, 1, {}], [1085, 10, { hs: "bald" }]];
  function crowd(g, u, T, wild) {
    mass(g, u, -260, 1320, 1262, 0.5, 18, 11, 1);
    const sh = (i, a) => Math.sin(u * (8 + i % 3) + i * 1.3) * a;
    // an der Tür: zwei von hinten, rütteln
    [[468, 2, 0], [618, 5, 1]].forEach(([x, k, j]) => zombie(g, x + sh(j, 10) * wild, 1290, 0.66, { k, back: true, aL: -1.0 + sh(j + 1, 0.25), aR: -1.0 - sh(j + 2, 0.25), eL: -0.3, eR: -0.3, bob: -Math.abs(sh(j, 12)) }));
    MID.forEach(([x, k, ex], i) => zombie(g, x, 1330, 0.76, { k, ...ex, aL: -0.55 + sh(i, 0.4) * wild, aR: -0.55 + sh(i + 3, 0.4) * wild, eL: -0.5, eR: -0.5, mouth: i % 2 ? "open" : "shout", bob: -Math.abs(sh(i, 14)) * wild, look: i < 3 ? 0.6 : -0.6, flip: i % 2 === 1 }));
    FRONT.forEach(([x, k, ex], i) => zombie(g, x, 1415, 0.88, { k, ...ex, aL: -0.4 + sh(i + 5, 0.45) * wild, aR: -0.4 + sh(i + 7, 0.45) * wild, eL: -0.6, eR: -0.6, mouth: i % 3 ? "open" : "o", bob: -Math.abs(sh(i + 2, 16)) * wild, look: i < 3 ? 0.8 : -0.8 }));
  }
  // Zombies vor der Bäckerei: entspannt auf Klappstühlen
  function chill(g, u, T) { const br = Math.sin(u * 1.6);
    pumpkin(g, 2430, 1385, 0.9, u, 3);
    SK.chair(g, 1950, 1330, 0.7, "#3d7f6a"); zombie(g, 1940, 1330, 0.8, { k: 1, sit: true, eyes: "closed", mouth: "smile", brow: 0, hs: "grey", hair: "#d0d0d8", curlers: true, aL: 1.2, aR: 1.2, eL: -1.7, eR: -1.7, bob: br * 2,
      hold: (q, hR, hL) => { q.fillStyle = "#e85d75"; q.strokeStyle = OL; q.lineWidth = 5; for (let i = 0; i < 2; i++) { q.beginPath(); q.moveTo(hL[0] + 10, hL[1] - 10); q.lineTo(hR[0] - 10 - i * 10, hR[1] - 50 - i * 10); q.stroke(); } rr(q, hL[0] - 10, hL[1] + 4, hR[0] - hL[0] + 20, 36, 10); q.fill(); q.stroke(); } });
    SK.chair(g, 2150, 1330, 0.7, "#c0392b"); zombie(g, 2140, 1330, 0.8, { k: 3, sit: true, eyes: "dot", look: 0.4, mouth: "smile", brow: -0.2, glasses: true, aL: 1.0, aR: 1.0, eL: -1.4, eR: -1.4, bob: br * 2,
      hold: (q, hR, hL) => { q.save(); q.translate((hR[0] + hL[0]) / 2, Math.min(hR[1], hL[1]) - 30); const turn = Math.sin(u * 0.8) * 0.04; q.rotate(turn); q.fillStyle = "#f3efe4"; q.strokeStyle = OL; q.lineWidth = 5; rr(q, -150, -110, 300, 190, 6); q.fill(); q.stroke();
        q.beginPath(); q.moveTo(0, -110); q.lineTo(0, 80); q.stroke(); q.fillStyle = "#2b1d14"; q.font = "900 34px D"; q.textAlign = "center"; q.textBaseline = "middle"; q.fillText("TAGESBLATT", -70, -78); q.fillStyle = "#9aa1ab"; for (let i = 0; i < 5; i++) { q.fillRect(-136, -50 + i * 24, 120, 9); q.fillRect(16, -90 + i * 30, 120, 9); } q.restore(); } });
    SK.chair(g, 2710, 1330, 0.7, "#2f6f8f"); zombie(g, 2700, 1330, 0.8, { k: 4, sit: true, eyes: "closed", mouth: "o", brow: 0, party: true, aL: 1.3, aR: 1.3, eL: -1.9, eR: -1.9, bob: br * 4 });
    SK.chair(g, 2050, 1440, 0.75, "#d9a441"); zombie(g, 2040, 1440, 0.88, { k: 6, sit: true, eyes: "happy", mouth: "smile", brow: 0, aL: 1.0, aR: 0.2, eL: -1.4, eR: -1.6, bob: br * 2,
      hold: (q, hR) => { q.fillStyle = "#3d7f6a"; q.strokeStyle = OL; q.lineWidth = 5; rr(q, hR[0] - 22, hR[1] - 70, 44, 66, 8); q.fill(); q.stroke(); q.fillStyle = "#9aa1ab"; rr(q, hR[0] - 18, hR[1] - 86, 36, 18, 5); q.fill(); q.stroke();
        q.strokeStyle = "rgba(255,255,255,0.55)"; q.lineWidth = 4; for (let i = 0; i < 2; i++) { const t = (u * 0.7 + i * 0.5) % 1; q.globalAlpha = 1 - t; q.beginPath(); q.moveTo(hR[0] - 6 + i * 12, hR[1] - 92 - t * 90); q.quadraticCurveTo(hR[0] + 14 + i * 12, hR[1] - 120 - t * 90, hR[0] - 6 + i * 12, hR[1] - 150 - t * 90); q.stroke(); } q.globalAlpha = 1; } });
    SK.chair(g, 2640, 1440, 0.75, "#8e5bd6"); zombie(g, 2630, 1440, 0.88, { k: 8, sit: true, eyes: "happy", mouth: "grin", brow: 0, hs: "bald", aL: 1.2, aR: 1.2, eL: -1.8, eR: -1.8, flip: true, bob: br * 2 });
  }
  function zzz(g, x, y, u) { for (let i = 0; i < 3; i++) { const t = (u * 0.6 + i / 3) % 1; g.save(); g.globalAlpha = Math.sin(Math.PI * t); g.translate(x + t * 80, y - t * 160); g.font = `900 ${40 + i * 6}px D`; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 8; g.strokeStyle = OL; g.strokeText("z", 0, 0); g.fillStyle = "#cfe3ff"; g.fillText("z", 0, 0); g.restore(); } }

  // Innen: Besitzer unter der Theke
  function inside(g, u, T) {
    const su = u - T.bB, z = 1.04 + 0.05 * cl(su / 2.4); g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-540, -960);
    g.fillStyle = "#3a2c3e"; g.fillRect(-100, -100, 1280, 1000); g.lineWidth = 8; g.strokeStyle = OL;
    // Tür hinten mit Zombie-Gesichtern
    g.fillStyle = "#123a33"; g.fillRect(330, 90, 420, 640); g.strokeRect(330, 90, 420, 640); g.save(); g.beginPath(); g.rect(355, 115, 370, 610); g.clip();
    const sk = g.createLinearGradient(0, 115, 0, 725); sk.addColorStop(0, "#2a2a5a"); sk.addColorStop(1, "#4a3f6a"); g.fillStyle = sk; g.fillRect(355, 115, 370, 610); circle(g, 660, 200, 50, "#fff3cf");
    mass(g, u, 300, 780, 1000, 0.55, 5, 31, 0.9);
    [[420, 2], [560, 7], [700, 4]].forEach(([x, k], i) => { const b = Math.sin(u * 9 + i * 2) * 6; zombie(g, x, 1080 + b, 0.85, { k, eyes: "wide", mouth: "open", brow: 0.6, aL: -0.9, aR: -0.9, eL: -0.4, eR: -0.4, look: (540 - x) / 200 }); });
    const bang = (t) => 1 + 0.25 * (1 - cl((u - t) / 0.12)) * (u >= t ? 1 : 0); const bt = T.bB + Math.floor(Math.max(0, su) / 0.55) * 0.55;
    [[400, 330, 0.85, -0.3], [520, 270, 0.9, 0.1], [660, 320, 0.85, 0.35], [470, 460, 0.8, -0.1], [610, 450, 0.8, 0.2]].forEach(([x, y, s, r], i) => palm(g, x, y, s * (i === Math.floor(su / 0.55) % 5 ? bang(bt) : 1), SKINS[i % 5], r));
    g.fillStyle = "rgba(255,255,255,0.10)"; g.beginPath(); g.moveTo(380, 725); g.lineTo(560, 115); g.lineTo(620, 115); g.lineTo(440, 725); g.closePath(); g.fill(); g.restore();
    // Regale links und rechts
    const shelf = (x0) => { for (let i = 0; i < 4; i++) { fillRR(g, x0, 220 + i * 140, 280, 14, 4, "#6b4a32"); for (let j = 0; j < 5; j++) { const bx = x0 + 18 + j * 54; g.fillStyle = ["#e5243b", "#f2b134", "#3d9a6b", "#5b8def", "#e85d75"][(i + j + (x0 > 500 ? 2 : 0)) % 5]; g.lineWidth = 4; rr(g, bx, 140 + i * 140, 44, 80, 8); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.55)"; g.fillRect(bx + 8, 160 + i * 140, 28, 10); } } };
    shelf(20); shelf(780); clockFace(g, 900, 60, 46, 3, false);
    // Theke
    const wd = g.createLinearGradient(0, 700, 0, 780); wd.addColorStop(0, "#b5733a"); wd.addColorStop(1, "#7a4a2a"); g.fillStyle = wd; g.lineWidth = 8; g.strokeStyle = OL; g.fillRect(-100, 700, 1280, 76); g.strokeRect(-100, 700, 1280, 76);
    const cv = g.createLinearGradient(0, 776, 0, 1440); cv.addColorStop(0, "#1a1218"); cv.addColorStop(1, "#2e2026"); g.fillStyle = cv; g.fillRect(-100, 776, 1280, 664);
    for (const x0 of [40, 800]) { for (let i = 0; i < 2; i++) { g.fillStyle = ["#8a6a4a", "#a0784e"][i]; g.lineWidth = 5; rr(g, x0, 1000 + i * 190, 240, 170, 8); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x0 + 20, 1000 + i * 190 + 30); g.lineTo(x0 + 220, 1000 + i * 190 + 30); g.stroke(); } }
    g.fillStyle = "#4a3a3a"; g.fillRect(-100, 1440, 1280, 600); g.strokeRect(-100, 1440, 1280, 600);
    // Besitzer zittert
    const jit = Math.sin(u * 83) * 7, cl8 = Math.floor(u * 14) % 2;
    SK.person(g, 540 + jit, 1440, 1.1, { ...OWNER, sit: true, eyes: "wide", brow: -1, mouth: "flat", look: Math.sin(u * 3) * 0.5, aL: 0.95, aR: 0.95, eL: -1.9, eR: -1.9 });
    const hx = 540 + jit, hy = 1440 + (-545 + 140) * 1.1, my = hy + 38 * 1.1; g.lineWidth = 4; g.strokeStyle = OL; g.fillStyle = "#7a1f2a"; rr(g, hx - 30, my - 10, 60, cl8 ? 30 : 16, 7); g.fill(); g.stroke();
    g.fillStyle = "#fffbe8"; g.fillRect(hx - 25, my - 7, 50, 9); g.fillRect(hx - 25, my + (cl8 ? 10 : 1), 50, 8);
    for (let i = 0; i < 3; i++) { const t = (u * 1.4 + i / 3) % 1, sd = i % 2 ? 1 : -1; g.save(); g.globalAlpha = 1 - t; g.translate(hx + sd * (66 + t * 70), hy - 40 - t * 40 + t * t * 120); g.fillStyle = "#7fd0ff"; g.strokeStyle = OL; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -16); g.quadraticCurveTo(12, 4, 0, 8); g.quadraticCurveTo(-12, 4, 0, -16); g.fill(); g.stroke(); g.restore(); }
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 5; for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(hx + sd * 200, 1230 - i * 60, 30, sd > 0 ? -0.8 : Math.PI - 0.8, sd > 0 ? 0.8 : Math.PI + 0.8); g.stroke(); }
    g.restore();
    const kk = seg(u, T.zitt - 0.1, T.zitt + 0.1); if (kk > 0) { const wob = Math.sin(u * 40) * 0.06; [[860, 870, -0.18], [215, 1000, 0.15]].forEach(([x, y, r], i) => { g.save(); g.translate(x, y); g.rotate(r + wob * (i ? -1 : 1)); g.scale(kk, kk); g.font = "900 64px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 12; g.strokeStyle = OL; g.lineJoin = "round"; g.strokeText("KLAPPER", 0, 0); g.fillStyle = "#ffffff"; g.fillText("KLAPPER", 0, 0); g.restore(); }); }
  }

  TYPES.h_zombie = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 9.9, capY: 1545,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.drei = f(/^drei$/, 0, 0.9); T.hundert = f(/^hundert/, T.drei, T.drei + 1.4); T.kiosk = f(/^kiosk/, T.hundert, T.hundert + 1.6); T.ruett = f(/^rütteln/, T.kiosk, T.kiosk + 0.7);
      T.eins = f(/^eins/, T.ruett, T.ruett + 2.2); T.wann = f(/^wann/, T.eins, T.eins + 1.6); T.aufm = f(/^aufmacht/, T.wann, T.wann + 0.3); T.bes = f(/^besitzer/, T.aufm, T.aufm + 1.2);
      T.zitt = f(/^zittert/, T.bes, T.bes + 0.45); T.geg = f(/^gegenüber/, T.zitt, T.zitt + 1.9); T.baeck = f(/^bäckerei/, T.geg, T.geg + 0.9); T.ent = f(/^entspannt/, T.baeck, T.baeck + 2.1);
      T.warten = f(/^warten/, T.ent, T.ent + 1.0); T.sieben = f(/^sieben/, T.warten, T.warten + 0.6); T.denn = f(/^denn$/, T.sieben, T.sieben + 0.8);
      T.bA = T.hundert - 0.15; T.bB = T.bes - 0.3; T.bC = T.geg - 0.15; T.bD = T.sieben - 0.12; T.bE = T.denn - 0.06; p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const ph = u < T.bA ? 0 : u < T.bB ? 1 : u < T.bC ? 2 : u < T.bD ? 3 : u < T.bE ? 4 : 5;
      g.fillStyle = "#0a0b22"; g.fillRect(0, 0, W, H);
      const BANGS = []; for (let t = 0; t < T.bA; t += 0.5) BANGS.push(t);
      let shake = 0; BANGS.forEach((t) => { const k = u - t; if (k >= 0 && k < 0.16) shake = Math.max(shake, (1 - k / 0.16) * (t === 0 ? 1.4 : 0.8)); });
      if (ph === 2) { inside(g, u, T); }
      else {
        const K = (t, z, x, y) => ({ t, z, x, y });
        const KF = ph === 0 ? [K(0, 1.5, 545, 885), K(T.bA, 1.34, 548, 880)]
          : ph === 1 ? [K(T.bA, 0.94, 540, 950), K(T.ruett, 0.98, 540, 945), K(T.aufm, 1.04, 540, 930), K(T.bB, 1.05, 540, 930)]
          : ph === 3 ? [K(T.bC, 1.0, 540, 940), K(T.baeck - 0.1, 1.0, 2300, 960), K(T.warten + 0.3, 1.1, 2290, 985), K(T.bD, 1.11, 2290, 985)]
          : ph === 4 ? [K(T.bD, 1.4, 1420, 360), K(T.bD + 0.22, 2.9, 1380, 175), K(T.bE, 3.0, 1380, 170)]
          : [K(T.bE, 3.0, 1380, 170), K(T.bE + 0.4, 2.3, 2430, 900), K(d, 2.5, 2430, 905)];
        const c = SK.cam(KF, u);
        if (ph === 5) { const dive = inExpo(cl((u - T.denn - 0.35) / Math.max(0.3, d - T.denn - 0.35))); if (dive > 0) { c.x = lerp(c.x, 2430, cl(dive * 4)); c.y = lerp(c.y, 940, cl(dive * 4)); c.z *= 1 + dive * 26; } }
        if (ph === 1) { BANGS.length = 0; for (let t = T.ruett; t < T.bB; t += 0.42) { const k = u - t; if (k >= 0 && k < 0.12) shake = Math.max(shake, (1 - k / 0.12) * 0.35); } }
        const sx = Math.sin(u * 90) * 16 * shake, sy = Math.cos(u * 77) * 12 * shake;
        // Himmel: Mond je nach Einstellung
        if (ph === 4) sky(g, u, 180, 330, 110); else if (ph === 5) sky(g, u, 860, 200, 120); else sky(g, u, ph === 3 ? 900 : 250, ph === 3 ? 230 : 250, 120);
        if (ph === 1 || ph === 3) bats(g, u, 1, 4);
        g.save(); SK.apply(g, c, sx, sy);
        const hr = ph < 4 ? 3 : ph === 4 ? 3 + 4 * inOut(seg(u, T.sieben - 0.05, T.sieben + 0.5)) : 7;
        const flick = ph <= 1 ? (rnd(Math.floor(u * 13) + 7) > 0.28 ? 1 : 0.2) : 0.2;
        const rattle = ph === 0 ? Math.sin(u * 70) * 6 * shake : ph === 1 ? Math.sin(u * 46) * 5 * seg(u, T.ruett - 0.2, T.ruett) : 0;
        world(g, u, { hr, flick, rattle });
        pumpkin(g, 330, 1252, 0.75, u, 0); pumpkin(g, 760, 1252, 0.65, u, 1);
        if (ph === 0) { // zwei Zombies von hinten, Hände knallen an Glas
          const press = (t0) => { let s = 1; BANGS.forEach((t, i) => { if ((i % 2) === t0) { const k = u - t; if (k >= 0 && k < 0.2) s = Math.max(s, 1 + 0.35 * (1 - k / 0.2)); } }); return s; };
          const hand = (j) => (q, hR, hL) => { const sR = press(j), sL = press(1 - j); palm(q, hR[0], hR[1] - 20, 1.3 * sR, SKINS[j * 2], 0.25); palm(q, hL[0], hL[1] - 20, 1.3 * sL, SKINS[j * 2], -0.25); };
          zombie(g, 400, 1410, 0.92, { k: 2, back: true, hs: "bald", aL: -1.05, aR: -1.0, eL: -0.25, eR: -0.25, hold: hand(0), bob: Math.sin(u * 6) * 4 });
          zombie(g, 690, 1415, 0.95, { k: 5, back: true, hs: "short", hair: "#5b4a3a", aL: -1.0, aR: -1.05, eL: -0.25, eR: -0.25, hold: hand(1), bob: Math.sin(u * 6 + 2) * 4 });
        } else if (ph === 1) { crowd(g, u, T, 1); }
        else { crowd(g, u, T, 0.5); chill(g, u, T); }
        g.restore();
        const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
        if (ph === 0) SK.pow(g, "BAM!", 250, 700, (u + 0.14) / 0.75, { rot: -0.14, px: 150, c: "#c8f07a" });
        if (ph === 1) {
          const [ax, ay] = SK.toScreen(c, 540, 830); SK.bubble(g, ["*AUF!*"], 860, 740, ax + 50, ay - 20, win(T.ruett - 0.05, T.bB + 0.05), { shout: true, px: 74 });
          const [bx, by] = SK.toScreen(c, 160, 900); SK.bubble(g, ["*Wann???*"], 250, 730, bx + 40, by - 40, win(T.wann - 0.12, T.bB + 0.05), { shout: true, px: 64 });
          const [qx, qy] = SK.toScreen(c, 540, 770); SK.qmarks(g, qx, qy, u, seg(u, T.aufm - 0.05, T.aufm + 0.4), 3, "#c8f07a");
        }
        if (ph === 3) {
          const [nx, ny] = SK.toScreen(c, 2140, 1000); SK.bubble(g, ["Noch *vier*", "Stunden."], 330, 740, nx, ny - 40, win(T.warten - 0.15, T.bD + 0.05), { px: 50 });
          const [zx, zy] = SK.toScreen(c, 2700, 960); if (u > T.baeck) zzz(g, zx + 30, zy - 40, u);
        }
        if (ph === 4) { const ring = seg(u, T.sieben + 0.45, T.sieben + 1.2); if (ring > 0 && ring < 1) { g.save(); g.strokeStyle = `rgba(255,236,170,${1 - ring})`; g.lineWidth = 10; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(540, 960, 330 + ring * 260 + i * 60, -0.6, 0.6); g.stroke(); g.beginPath(); g.arc(540, 960, 330 + ring * 260 + i * 60, Math.PI - 0.6, Math.PI + 0.6); g.stroke(); } g.restore(); } }
      }
      SK.flashAt(g, u, [T.bA, T.bB, T.bC, T.bD, T.bE], 0.08, 0.55);
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T, E = [[0.0, "thump", 0.9, 0], [0.0, "slap", 0.8, 0], [0.01, "boom", 0.4, 0], [0.02, "thunder", 0.35, 0]];
      for (let t = 0.5, i = 0; t < T.bA - 0.05; t += 0.5, i++) E.push([t, "thump", 0.6, i % 2 ? 0.3 : -0.3], [t, "h_crack_knock", 0.35, i % 2 ? 0.3 : -0.3]);
      E.push([T.drei, "tick_hi", 0.35, 0]);
      E.push([T.bA, "whoosh_down", 0.35, 0], [T.bA + 0.05, "boom", 0.25, 0]);
      for (let t = T.ruett - 0.1; t < T.bB - 0.2; t += 0.84) E.push([t, "lock_rattle", 0.4, 0]);
      E.push([T.ruett, "pop", 0.4, 0.4], [T.wann - 0.1, "pop", 0.4, -0.4], [T.aufm, "pop", 0.35, 0], [T.aufm + 0.15, "pop", 0.3, 0.2], [T.aufm + 0.3, "pop", 0.3, -0.2]);
      E.push([T.bB, "whoosh_side", 0.35, 0], [T.bB + 0.05, "thump", 0.45, 0]);
      for (let t = T.bB + 0.1; t < T.bC - 0.1; t += 0.55) E.push([t, "thump", 0.35, 0.2]);
      for (let t = T.zitt - 0.05; t < T.bC - 0.1; t += 0.07) E.push([t, "click", 0.18, ((t * 13) % 2) - 1]);
      E.push([T.bC, "whoosh_side", 0.45, 0], [T.bC + 0.05, "tr_swish", 0.3, 0.3], [T.baeck, "chime", 0.2, 0.3], [T.ent, "shimmer", 0.2, 0], [T.warten - 0.15, "pop", 0.35, -0.3]);
      E.push([T.bD, "whoosh_up", 0.4, 0]); for (let i = 0; i < 6; i++) E.push([T.sieben - 0.05 + i * 0.09, "tick_hi", 0.3, 0]);
      E.push([T.sieben + 0.45, "chime", 0.55, 0], [T.sieben + 0.47, "closed_bell", 0.3, 0]);
      E.push([T.bE, "whoosh_down", 0.4, 0], [T.denn + 0.1, "riser", 0.6, 0, Math.max(0.3, d - T.denn - 0.1)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Vollmond, Nebel, Filmtitel ----------
  TYPES.zombie_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^google/, E.sys, 1.4); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#07081a"); bg.addColorStop(0.6, "#191936"); bg.addColorStop(1, "#262046"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 60; i++) circle(g, rnd(i * 2.9) * W, rnd(i * 4.7) * 1200, 1.2 + rnd(i) * 2, `rgba(255,255,255,${0.25 + 0.4 * (0.5 + 0.5 * Math.sin(u * 2 + i))})`);
      const my = 470 - 30 * out3(cl(u / 3)), mr = 190; const mg = g.createRadialGradient(540, my, mr * 0.8, 540, my, mr * 3); mg.addColorStop(0, "rgba(255,244,205,0.32)"); mg.addColorStop(1, "rgba(255,244,205,0)"); g.fillStyle = mg; g.fillRect(0, my - mr * 3, W, mr * 6);
      circle(g, 540, my, mr, "#fbefc8"); g.fillStyle = "rgba(214,196,150,0.45)"; [[-0.3, -0.2, 0.22], [0.35, 0.1, 0.16], [-0.05, 0.42, 0.13], [0.22, -0.45, 0.1]].forEach(([a, b, r]) => { g.beginPath(); g.arc(540 + a * mr, my + b * mr, r * mr, 0, 7); g.fill(); });
      // Fledermaus quert den Mond
      const bt = seg(u, 0.6, 3.4); if (bt > 0 && bt < 1) bat(g, lerp(-80, 1160, bt), my - 60 + Math.sin(bt * 9) * 40, 0.9, u, 1);
      // Dächer: Kiosk, Kirchturm, Bäckerei als Silhouette
      g.fillStyle = "#0b0a16"; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 1640); g.lineTo(300, 1640); g.lineTo(300, 1600); g.lineTo(420, 1600); g.lineTo(420, 1500); g.lineTo(470, 1420); g.lineTo(520, 1500); g.lineTo(520, 1600); g.lineTo(640, 1600); g.lineTo(780, 1540); g.lineTo(920, 1600); g.lineTo(1080, 1600); g.lineTo(1080, H); g.closePath(); g.fill();
      for (const [x, y] of [[120, 1680], [210, 1680], [700, 1660], [860, 1660]]) circle(g, x, y, 9, "rgba(255,214,140,0.8)");
      // Nebel
      for (let i = 0; i < 9; i++) { const fx = ((rnd(i * 3.1) * 1500 + u * (25 + rnd(i) * 30)) % 1700) - 300, fy = 1380 + rnd(i * 6.3) * 420; const fg = g.createRadialGradient(fx, fy, 10, fx, fy, 380); fg.addColorStop(0, "rgba(200,205,240,0.16)"); fg.addColorStop(1, "rgba(200,205,240,0)"); g.fillStyle = fg; g.fillRect(fx - 380, fy - 380, 760, 760); }
      SK.endTitle(g, u, d, T, { c: "#f6f0dc", glow: "rgba(200,240,140,0.35)", accent: "#ff9a3c", sub: "rgba(236,232,214,0.85)", key: "#ffb05a", offer: "BEI GOOGLE MAPS GEFUNDEN", y: 900 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.05, "thunder", 0.2, 0], [0.12, "shimmer", 0.35, 0], [0.8, "whoosh_side", 0.15, 0.4], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
