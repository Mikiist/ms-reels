// VOICE_DELAY: 0.6
// h_rocket: Rakete auf der Startrampe. Countdown 3, 2, 1 in 0,8 s, Zündung mit Flammen und Rauchwolken,
// Rumpeln, die Rakete hebt ab und schießt nach oben aus dem Bild. Funken, Kamera wackelt, Rauch bleibt stehen.
// Parameter: label (Standard "START"), steht auf der Rakete.
(() => {
  const RX = 540, NOZ = 1186; // Rakete: Mitte und Düsenende (Welt)
  const TB = [0, 0.27, 0.54], TI = 0.8, TL = 1.06; // Piepen, Zündung, Abheben
  const exitDur = (d) => Math.max(0.6, Math.min(1.3, d - 0.42 - TL));
  const rise = (u, d) => (u <= TL ? 0 : 1650 * Math.pow(cl((u - TL) / exitDur(d)), 2.3));
  const tAt = (h, d) => TL + exitDur(d) * Math.pow(Math.min(1, h / 1650), 1 / 2.3); // Zeitpunkt, zu dem die Rakete h Pixel hoch ist

  // ---------- Vorbereitung ----------
  function sky() {
    const c = document.createElement("canvas"); c.width = W + 120; c.height = H + 120; const g = c.getContext("2d"); const w = c.width;
    let gr = g.createLinearGradient(0, 0, 0, 1320); gr.addColorStop(0, "#070b26"); gr.addColorStop(0.35, "#1c1c5a"); gr.addColorStop(0.62, "#5b2a78"); gr.addColorStop(0.8, "#d9566a"); gr.addColorStop(0.9, "#ff9a5a"); gr.addColorStop(1, "#ffd08a");
    g.fillStyle = gr; g.fillRect(0, 0, w, c.height);
    for (let i = 0; i < 140; i++) { const x = rnd(i * 3.3) * w, y = rnd(i * 7.1 + 2) * 800, r = 0.6 + rnd(i * 1.9) * 1.8; g.globalAlpha = (0.25 + rnd(i * 5.7) * 0.6) * (1 - y / 900); circle(g, x, y, r, "#fff"); }
    g.globalAlpha = 1;
    let rg = g.createRadialGradient(w / 2, 1260, 20, w / 2, 1260, 900); rg.addColorStop(0, "rgba(255,210,150,0.55)"); rg.addColorStop(1, "rgba(255,150,100,0)"); g.fillStyle = rg; g.fillRect(0, 0, w, c.height);
    // Hügel
    const hill = (base, amp, col, sd) => { g.fillStyle = col; g.beginPath(); g.moveTo(0, c.height); for (let x = 0; x <= w; x += 20) g.lineTo(x, base - amp * (0.5 + 0.5 * Math.sin(x * 0.006 + sd)) * (0.6 + 0.4 * Math.sin(x * 0.017 + sd * 2))); g.lineTo(w, c.height); g.closePath(); g.fill(); };
    hill(1235, 90, "#5a2d63", 1.2); hill(1262, 60, "#2f1840", 3.1);
    // Boden
    gr = g.createLinearGradient(0, 1262, 0, c.height); gr.addColorStop(0, "#1b0f22"); gr.addColorStop(1, "#050308"); g.fillStyle = gr; g.fillRect(0, 1262, w, c.height - 1262);
    return c;
  }
  function puff(warm) {
    const s = 256, c = document.createElement("canvas"); c.width = s; c.height = s; const g = c.getContext("2d");
    for (let i = 0; i < 34; i++) {
      const a = rnd(i * 2.7 + (warm ? 9 : 0)) * 6.28, r = Math.sqrt(rnd(i * 4.1)) * 62, x = s / 2 + Math.cos(a) * r, y = s / 2 + Math.sin(a) * r * 0.85, rad = 26 + rnd(i * 6.3) * 40 * (1 - r / 120);
      const q = g.createRadialGradient(x - rad * 0.3, y - rad * 0.35, rad * 0.05, x, y, rad);
      if (warm) { q.addColorStop(0, "rgba(255,236,200,0.75)"); q.addColorStop(0.5, "rgba(255,160,90,0.45)"); q.addColorStop(1, "rgba(200,80,50,0)"); }
      else { q.addColorStop(0, "rgba(255,255,255,0.8)"); q.addColorStop(0.45, "rgba(222,222,234,0.5)"); q.addColorStop(1, "rgba(150,150,175,0)"); }
      g.fillStyle = q; g.beginPath(); g.arc(x, y, rad, 0, 7); g.fill();
    }
    // Schattenseite unten rechts
    g.globalCompositeOperation = "source-atop"; const sh = g.createLinearGradient(60, 60, 220, 220); sh.addColorStop(0, "rgba(0,0,0,0)"); sh.addColorStop(1, warm ? "rgba(90,30,40,0.35)" : "rgba(60,55,95,0.45)"); g.fillStyle = sh; g.fillRect(0, 0, s, s);
    return c;
  }
  function tower() {
    const c = document.createElement("canvas"); c.width = 360; c.height = 900; const g = c.getContext("2d"); // Welt x 720..1080, y 400..1300
    g.translate(-720, -400);
    const L = 800, R = 880, top = 560, bot = 1250;
    shadow(g, 30, 0, "rgba(0,0,0,0.5)");
    const red = g.createLinearGradient(L, 0, R, 0); red.addColorStop(0, "#ff7a55"); red.addColorStop(0.5, "#c6322a"); red.addColorStop(1, "#6a1418");
    g.strokeStyle = red; g.lineWidth = 9; g.beginPath(); g.moveTo(L, bot); g.lineTo(L, top); g.moveTo(R, bot); g.lineTo(R, top); g.stroke(); noShadow(g);
    g.lineWidth = 4; g.strokeStyle = "#a82a26";
    for (let y = top; y < bot; y += 64) { g.beginPath(); g.moveTo(L, y); g.lineTo(R, y + 64); g.moveTo(R, y); g.lineTo(L, y + 64); g.moveTo(L, y); g.lineTo(R, y); g.stroke(); }
    g.strokeStyle = "rgba(255,220,190,0.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(L - 3, bot); g.lineTo(L - 3, top); g.stroke();
    // Plattform oben + Blinklicht-Halter
    fillRR(g, L - 20, top - 16, R - L + 40, 16, 4, "#3a1a22"); g.fillStyle = "#c6322a"; g.fillRect(R + 30, top + 10, 10, bot - top - 10);
    return c;
  }
  function rocketSprite(label) {
    const w = 480, h = 820; const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d");
    const cx = w / 2; const ox = cx - RX, oy = -380; g.translate(ox, oy); // Welt -> Sprite
    const bodyL = RX - 100, bodyR = RX + 100, bTop = 650, bBot = 1112;
    const metal = (x0, x1, cols) => { const gr = g.createLinearGradient(x0, 0, x1, 0); cols.forEach((c2, i) => gr.addColorStop(i / (cols.length - 1), c2)); return gr; };
    const WHITE = ["#7e869a", "#f4f6fb", "#ffffff", "#e7eaf1", "#b9bfcc", "#646c80"], RED = ["#6a0710", "#ff6a5c", "#f2353d", "#c4121f", "#8e0a16", "#4a040a"];
    // Flossen (hinten)
    const fin = (dir) => { g.beginPath(); g.moveTo(RX + dir * 92, 960); g.bezierCurveTo(RX + dir * 150, 1000, RX + dir * 190, 1060, RX + dir * 192, 1160); g.lineTo(RX + dir * 170, 1170); g.quadraticCurveTo(RX + dir * 140, 1120, RX + dir * 92, 1112); g.closePath(); };
    for (const dir of [-1, 1]) { fin(dir); g.fillStyle = metal(RX + dir * 92, RX + dir * 195, dir < 0 ? ["#8e0a16", "#ff6a5c", "#c4121f"] : ["#c4121f", "#8e0a16", "#4a040a"]); g.fill(); g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 2; g.stroke(); }
    // Düse
    const nz = g.createLinearGradient(RX - 70, 0, RX + 70, 0); nz.addColorStop(0, "#1c1d22"); nz.addColorStop(0.3, "#8d8f98"); nz.addColorStop(0.55, "#3a3c43"); nz.addColorStop(1, "#0d0d10");
    g.fillStyle = nz; g.beginPath(); g.moveTo(RX - 52, 1108); g.lineTo(RX + 52, 1108); g.quadraticCurveTo(RX + 62, 1160, RX + 78, NOZ); g.lineTo(RX - 78, NOZ); g.quadraticCurveTo(RX - 62, 1160, RX - 52, 1108); g.closePath(); g.fill();
    g.fillStyle = "#26272d"; g.beginPath(); g.ellipse(RX, NOZ, 78, 12, 0, 0, 7); g.fill();
    // Rumpf
    g.fillStyle = metal(bodyL, bodyR, WHITE); rr(g, bodyL, bTop, 200, bBot - bTop, 10); g.fill();
    // rote Bänder
    for (const [y0, hh] of [[1070, 42], [652, 26]]) { g.fillStyle = metal(bodyL, bodyR, RED); g.fillRect(bodyL, y0, 200, hh); }
    // Nase (Ogive)
    g.fillStyle = metal(bodyL, bodyR, RED); g.beginPath(); g.moveTo(bodyL, 656); g.bezierCurveTo(bodyL, 560, RX - 40, 470, RX, 440); g.bezierCurveTo(RX + 40, 470, bodyR, 560, bodyR, 656); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255,0.28)"; g.beginPath(); g.moveTo(RX - 62, 640); g.bezierCurveTo(RX - 62, 570, RX - 32, 500, RX - 8, 462); g.bezierCurveTo(RX - 28, 520, RX - 42, 580, RX - 40, 640); g.closePath(); g.fill();
    // Nahtlinien und Nieten
    g.strokeStyle = "rgba(40,50,70,0.25)"; g.lineWidth = 2; for (const y of [800, 960]) { g.beginPath(); g.moveTo(bodyL, y); g.lineTo(bodyR, y); g.stroke(); }
    g.fillStyle = "rgba(40,50,70,0.35)"; for (const y of [808, 968]) for (let x = bodyL + 14; x < bodyR; x += 22) { g.beginPath(); g.arc(x, y, 2, 0, 7); g.fill(); }
    // Fenster
    const wy = 730; const rg = g.createLinearGradient(RX - 46, wy - 46, RX + 46, wy + 46); rg.addColorStop(0, "#ffffff"); rg.addColorStop(0.4, "#9ea4b2"); rg.addColorStop(0.7, "#3e4352"); rg.addColorStop(1, "#d6dae3");
    shadow(g, 10, 4, "rgba(0,0,0,0.35)"); g.fillStyle = rg; g.beginPath(); g.arc(RX, wy, 46, 0, 7); g.fill(); noShadow(g);
    const gl = g.createRadialGradient(RX - 12, wy - 14, 4, RX, wy, 36); gl.addColorStop(0, "#9ae6ff"); gl.addColorStop(0.45, "#2a7bd8"); gl.addColorStop(1, "#0a1f52"); g.fillStyle = gl; g.beginPath(); g.arc(RX, wy, 34, 0, 7); g.fill();
    g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(RX - 12, wy - 14, 13, 7, -0.7, 0, 7); g.fill(); circle(g, RX + 13, wy + 12, 3.5, "rgba(255,255,255,0.5)");
    // Schriftzug
    const lab = String(label || "START").toUpperCase().replace(/[–—]/g, "-").slice(0, 12);
    const px = Math.max(26, Math.min(58, fitPx(g, lab, 168, 58, 900)));
    txt(g, lab, RX, 885, { w: 900, px, c: "#16224f", ls: lab.length <= 6 ? 3 : 0 });
    // Mittlere Flosse (von vorn)
    g.fillStyle = metal(RX - 14, RX + 14, ["#8e0a16", "#ff6a5c", "#7a0812"]); g.beginPath(); g.moveTo(RX - 12, 1000); g.lineTo(RX + 12, 1000); g.lineTo(RX + 15, 1180); g.lineTo(RX - 15, 1180); g.closePath(); g.fill();
    return { c, ox, oy };
  }

  // ---------- Partikel ----------
  function groundPuffs() { const L = []; for (let i = 0; i < 64; i++) { const dir = i % 2 ? 1 : -1; L.push({ tb: TI + 0.02 + Math.pow(rnd(i * 1.3), 1.4) * 1.0, dir, v: 0.5 + rnd(i * 2.9) * 0.9, up: rnd(i * 4.4), s: 0.6 + rnd(i * 7.7) * 0.8, rot: rnd(i * 5.2) * 6.28 }); } return L.sort((a, b) => b.up - a.up); }
  const GP = groundPuffs();
  function drawSmoke(g, sc, u, d, heat) {
    // Rauchsäule (bleibt entlang der Bahn)
    for (let j = 0; j < 50; j++) {
      const h = 40 + j * 32; const tb = tAt(h, d); if (u < tb) continue; const age = u - tb;
      const y = NOZ - h + 60 + age * 8, x = RX + (rnd(j * 2.3) - 0.5) * 26 + age * (12 + (rnd(j) - 0.5) * 50); const r = (52 + 40 * rnd(j * 3.1)) * (1 + age * 1.3) * (1 - j * 0.007);
      const a = cl(age * 6) * (0.62 - 0.2 * cl(age / 3));
      g.globalAlpha = a; g.drawImage(sc.st.pc, x - r, y - r, 2 * r, 2 * r);
      const wk = heat * Math.exp(-h / 380) * Math.exp(-age * 1.5); if (wk > 0.02) { g.globalAlpha = a * wk; g.drawImage(sc.st.pw, x - r, y - r, 2 * r, 2 * r); }
    }
    // Bodenwolken
    for (const P of GP) {
      if (u < P.tb) continue; const age = u - P.tb; const k = 1 - Math.exp(-age * 2.2);
      const x = RX + P.dir * (60 + P.v * 520 * k), y = 1222 - P.up * 160 * k - age * 14 * P.up; const r = (70 + 150 * P.s) * (0.35 + 0.65 * k) * (1 + age * 0.12);
      const a = cl(age * 5) * 0.92;
      g.globalAlpha = a; g.drawImage(sc.st.pc, x - r, y - r, 2 * r, 2 * r);
      const wk = heat * cl(1 - Math.abs(x - RX) / 520) * (1 - P.up * 0.5); if (wk > 0.02) { g.globalAlpha = a * wk; g.drawImage(sc.st.pw, x - r, y - r, 2 * r, 2 * r); }
    }
    g.globalAlpha = 1;
  }
  function flame(g, x, y, len, wid, u, k) {
    if (k <= 0) return;
    g.save(); g.globalCompositeOperation = "lighter"; g.translate(x, y);
    const fl = 1 + 0.12 * Math.sin(u * 53) + 0.08 * Math.sin(u * 91 + 1) + 0.05 * Math.sin(u * 137);
    const L = len * fl, Wd = wid * (1 + 0.06 * Math.sin(u * 77));
    const shape = (l, w) => { g.beginPath(); g.moveTo(-w * 0.5, 0); g.bezierCurveTo(-w * 0.62, l * 0.25, -w * 0.25, l * 0.7, 0, l); g.bezierCurveTo(w * 0.25, l * 0.7, w * 0.62, l * 0.25, w * 0.5, 0); g.closePath(); };
    // Außen
    let gr = g.createLinearGradient(0, 0, 0, L); gr.addColorStop(0, `rgba(255,120,40,${0.9 * k})`); gr.addColorStop(0.5, `rgba(255,70,30,${0.6 * k})`); gr.addColorStop(1, "rgba(160,30,20,0)");
    shape(L, Wd * 1.25); g.fillStyle = gr; g.fill();
    gr = g.createLinearGradient(0, 0, 0, L * 0.72); gr.addColorStop(0, `rgba(255,236,140,${k})`); gr.addColorStop(0.6, `rgba(255,170,60,${0.7 * k})`); gr.addColorStop(1, "rgba(255,120,40,0)");
    shape(L * 0.72, Wd * 0.9); g.fillStyle = gr; g.fill();
    gr = g.createLinearGradient(0, 0, 0, L * 0.42); gr.addColorStop(0, `rgba(255,255,255,${k})`); gr.addColorStop(0.5, `rgba(220,240,255,${0.8 * k})`); gr.addColorStop(1, "rgba(200,230,255,0)");
    shape(L * 0.42, Wd * 0.5); g.fillStyle = gr; g.fill();
    // Machsche Knoten
    for (let i = 1; i <= 3; i++) { const yy = L * (0.13 + i * 0.12), rr2 = Wd * 0.16 * (1 - i * 0.18); const q = g.createRadialGradient(0, yy, 0, 0, yy, rr2 * 2); q.addColorStop(0, `rgba(255,255,255,${0.8 * k})`); q.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = q; g.beginPath(); g.ellipse(0, yy, rr2 * 1.2, rr2 * 2, 0, 0, 7); g.fill(); }
    // Glühen
    const q = g.createRadialGradient(0, L * 0.2, 0, 0, L * 0.2, L * 0.9); q.addColorStop(0, `rgba(255,160,70,${0.45 * k})`); q.addColorStop(1, "rgba(255,120,40,0)"); g.fillStyle = q; g.fillRect(-L, -L * 0.7, 2 * L, 2 * L);
    g.restore();
  }
  function sparks(g, u, ny) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 90; i++) {
      const tb = TI - 0.2 + rnd(i * 1.7) * 1.6; const age = u - tb; if (age <= 0 || age > 0.9) continue;
      const pre = tb < TI; const a = (rnd(i * 3.3) - 0.5) * (pre ? 2.2 : 3.0) - Math.PI / 2 * (pre ? -1 : 0); const sp = (pre ? 300 : 700) * (0.4 + rnd(i * 5.9));
      const ang = pre ? Math.PI / 2 + (rnd(i * 3.3) - 0.5) * 2.4 : (rnd(i * 2.1) < 0.5 ? Math.PI - 0.2 - rnd(i * 4.7) * 0.6 : 0.2 + rnd(i * 4.7) * 0.6);
      const ox = RX + (rnd(i * 6.1) - 0.5) * 90, oy = pre ? NOZ + 10 : 1225;
      const vx = Math.cos(ang) * sp, vy = Math.sin(ang) * sp * (pre ? 1 : -0.55) - (pre ? 0 : 200);
      const x = ox + vx * age, y = oy + vy * age + 900 * age * age; const x2 = x - vx * 0.03, y2 = y - (vy + 1800 * age) * 0.03;
      const al = (1 - age / 0.9) * (pre ? 0.9 : 1);
      g.strokeStyle = `rgba(255,${200 + Math.floor(rnd(i) * 55)},${120 + Math.floor(rnd(i * 2) * 100)},${al})`; g.lineWidth = 2 + rnd(i * 8.1) * 2.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
    }
    g.restore();
  }

  TYPES.h_rocket = {
    zone: "bottom", pal: "night", bgv: 0, coverT: 1.55,
    prep(sc, p) { sc.st.sky = sky(); sc.st.pc = puff(false); sc.st.pw = puff(true); sc.st.tower = tower(); sc.st.rk = rocketSprite(p.label); sc.st.tmp = document.createElement("canvas"); sc.st.tmp.width = 480; sc.st.tmp.height = 820; },
    draw(g, u, d, p, sc) {
      const lift = rise(u, d); const ign = seg(u, TI, TI + 0.12); const tX = TL + exitDur(d);
      const heat = u < TI ? 0 : Math.min(1, ign * 1.2) * (1 - 0.65 * seg(u, tX - 0.2, tX + 0.8));
      // Kamera: Zittern ab Zündung, leichte Fahrt nach oben beim Start
      let A = 0; if (u >= TI) A = 15 * Math.exp(-(u - TI) / 0.12) + 6.5 * seg(u, TI, TI + 0.1) * (1 - seg(u, tX - 0.3, tX + 0.5)); if (u > TI - 0.25 && u < TI) A += 1.5 * seg(u, TI - 0.25, TI);
      const shx = Math.sin(u * 71) * A + Math.sin(u * 133) * A * 0.4, shy = Math.cos(u * 63) * A + Math.cos(u * 117) * A * 0.4;
      const camY = 70 * inOut(seg(u, TL, tX + 0.2)); const z = 1.0 + 0.03 * cl(u / 0.8) + 0.02 * inOut(seg(u, TL, tX));
      g.save(); g.translate(540 + shx, 860 + shy); g.rotate(Math.sin(u * 47) * A * 0.0012); g.scale(z, z); g.translate(-540, -860 + camY);
      g.drawImage(sc.st.sky, -60, -60 - camY * 0.6);
      // Zündblitz im Himmel
      if (heat > 0) { const rg = g.createRadialGradient(RX, 1210, 30, RX, 1210, 1100); rg.addColorStop(0, `rgba(255,170,80,${0.55 * heat})`); rg.addColorStop(1, "rgba(255,120,60,0)"); g.save(); g.globalCompositeOperation = "screen"; g.fillStyle = rg; g.fillRect(-200, -200, W + 400, 2600); g.restore(); }
      // Turm mit Arm und Blinklicht
      g.drawImage(sc.st.tower, 720, 400);
      const arm = out3(seg(u, TI - 0.15, TI + 0.25)); g.save(); g.translate(800, 760); g.rotate(-arm * 1.1); fillRR(g, -165, -10, 165, 20, 5, "#9e2a26"); g.fillStyle = "rgba(255,210,180,0.5)"; g.fillRect(-160, -9, 155, 3); g.restore();
      const bl = Math.floor(u * 4) % 2 === 0 ? 1 : 0.15; { const q = g.createRadialGradient(895, 548, 0, 895, 548, 46); q.addColorStop(0, `rgba(255,60,60,${0.9 * bl})`); q.addColorStop(1, "rgba(255,60,60,0)"); g.fillStyle = q; g.fillRect(840, 500, 110, 100); circle(g, 895, 548, 7, bl > 0.5 ? "#ffd0d0" : "#601010"); }
      // Rampe
      let gr = g.createLinearGradient(0, 1222, 0, 1290); gr.addColorStop(0, "#5c5a66"); gr.addColorStop(0.15, "#2c2a33"); gr.addColorStop(1, "#141219"); g.fillStyle = gr; g.beginPath(); g.moveTo(250, 1222); g.lineTo(830, 1222); g.lineTo(890, 1292); g.lineTo(190, 1292); g.closePath(); g.fill();
      g.fillStyle = "#07060a"; rr(g, RX - 120, 1214, 240, 20, 6); g.fill();
      for (let x = 262; x < 820; x += 36) { g.fillStyle = (x / 36) % 2 < 1 ? "#f2c230" : "#16141a"; g.fillRect(x, 1222, 18, 6); }
      if (heat > 0) { gr = g.createRadialGradient(RX, 1225, 10, RX, 1225, 420); gr.addColorStop(0, `rgba(255,170,70,${0.8 * heat})`); gr.addColorStop(1, "rgba(255,100,40,0)"); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = gr; g.fillRect(RX - 420, 805, 840, 840); g.restore(); }
      // Abgasstrahl unter der fliegenden Rakete
      const ny = NOZ - lift; const rj = u > TL && u < TL + 0.6 ? (rnd(Math.floor(u * 60)) - 0.5) * 3 : 0;
      if (u >= TI) {
        const fk = ign * (1 - 0.3 * seg(u, tX, tX + 0.6));
        if (lift > 10) { g.save(); g.globalCompositeOperation = "lighter"; const jg = g.createLinearGradient(0, ny, 0, Math.min(1230, ny + 900)); jg.addColorStop(0, `rgba(255,220,150,${0.32 * fk})`); jg.addColorStop(1, "rgba(255,120,60,0)"); g.fillStyle = jg; g.beginPath(); g.moveTo(RX - 30, ny); g.lineTo(RX + 30, ny); g.lineTo(RX + 70, Math.min(1230, ny + 900)); g.lineTo(RX - 70, Math.min(1230, ny + 900)); g.closePath(); g.fill(); g.restore(); }
      }
      // Rauch hinter der Rakete (Säule)
      // Rakete
      const vib = u >= TI - 0.25 && u < TL + 0.5 ? (rnd(Math.floor(u * 60) + 3) - 0.5) * (u < TI ? 1.5 : 4) : 0;
      if (ny > -900) {
        // Bewegungsunschärfe beim Steigen
        const vel = rise(u, d) - rise(u - 1 / 30, d); const R = sc.st.rk;
        const tmp = sc.st.tmp, t2 = tmp.getContext("2d"); t2.setTransform(1, 0, 0, 1, 0, 0); t2.globalCompositeOperation = "source-over"; t2.clearRect(0, 0, 480, 820); t2.drawImage(R.c, 0, 0);
        t2.globalCompositeOperation = "source-atop"; const lg = t2.createLinearGradient(0, 820, 0, 300); lg.addColorStop(0, `rgba(255,140,60,${0.75 * heat})`); lg.addColorStop(0.6, `rgba(255,140,60,${0.12 * heat})`); lg.addColorStop(1, "rgba(255,140,60,0)"); t2.fillStyle = lg; t2.fillRect(0, 0, 480, 820);
        const sky2 = t2.createLinearGradient(0, 0, 480, 0); sky2.addColorStop(0, "rgba(120,90,200,0.10)"); sky2.addColorStop(1, "rgba(30,20,70,0.25)"); t2.fillStyle = sky2; t2.fillRect(0, 0, 480, 820);
        const dx = -R.ox + vib + rj, dy = -R.oy - lift;
        if (vel > 14) { for (let k = 4; k >= 1; k--) { g.globalAlpha = 0.14; g.drawImage(tmp, dx, dy + vel * k * 0.35); } g.globalAlpha = 1; }
        // Schatten auf der Rampe (verschwindet beim Abheben)
        g.save(); g.globalAlpha = 0.5 * (1 - cl(lift / 200)); g.fillStyle = "#000"; g.beginPath(); g.ellipse(RX, 1222, 150, 14, 0, 0, 7); g.fill(); g.restore();
        g.drawImage(tmp, dx, dy);
        // Dampf vor dem Start (Bewegung ab Bild 0)
        if (u < TI + 0.3) { for (let i = 0; i < 9; i++) { const ph = (u * 1.4 + i / 9) % 1; const side = i % 2 ? 1 : -1; const x = RX + side * (100 + ph * 120 + rnd(i) * 20), y = 700 + i * 40 - ph * 60; const r = 18 + ph * 60; g.globalAlpha = (1 - ph) * 0.55 * (1 - seg(u, TI, TI + 0.3)); g.drawImage(sc.st.pc, x - r, y - r, 2 * r, 2 * r); } g.globalAlpha = 1; }
        sc.st.fl = [RX + vib + rj, ny - 4, (lift > 5 ? 360 + Math.min(260, vel * 3) : 120 + 220 * ign), 128, u, u < TI ? 0 : ign];
      } else sc.st.fl = null;
      // Rauch, dann Flamme darüber (leuchtet in den Rauch)
      drawSmoke(g, sc, u, d, heat);
      if (sc.st.fl) flame(g, ...sc.st.fl);
      sparks(g, u, ny);
      g.restore();
      // Countdown
      for (let k = 0; k < 3; k++) {
        const t0 = TB[k], x = u - t0; if (x < 0 || x > 0.36) continue; const e = outBack(seg(x, 0, 0.12), 2.4), a = 1 - seg(x, 0.2, 0.32);
        g.save(); g.translate(225, 820); g.scale(lerp(1.7, 1, e) * (1 + 0.15 * seg(x, 0.2, 0.32)), lerp(1.7, 1, e) * (1 + 0.15 * seg(x, 0.2, 0.32))); g.globalAlpha = a;
        shadow(g, 60, 0, "rgba(255,200,120,0.9)"); txt(g, String(3 - k), 0, 0, { w: 900, px: 300, c: "#ffffff" }); noShadow(g);
        g.strokeStyle = `rgba(255,230,180,${0.8 * (1 - seg(x, 0, 0.3))})`; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 140 + 70 * out3(seg(x, 0, 0.3)), 0, 7); g.stroke(); g.restore();
      }
      // Zündblitz
      const fl = u >= TI ? Math.exp(-(u - TI) / 0.07) : 0; if (fl > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,190,120,${0.45 * fl})`; g.fillRect(0, 0, W, H); g.restore(); }
      // Vignette und Platz für Untertitel
      gr = g.createLinearGradient(0, 1300, 0, 1920); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.4, "rgba(0,0,0,0.35)"); gr.addColorStop(1, "rgba(0,0,0,0.75)"); g.fillStyle = gr; g.fillRect(0, 1300, W, 620);
      const vg = g.createRadialGradient(540, 900, 520, 540, 900, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    },
    ev(d, p) {
      const tX = TL + exitDur(d);
      return [[TB[0], "rk_beep0", 0.85, 0], [TB[1], "rk_beep1", 0.85, 0], [TB[2], "rk_beep2", 0.95, 0], [0, "rk_hiss", 0.4, 0],
        [TI, "rk_ignite", 1.0, 0], [TI, "rk_roar", 0.95, 0], [TL, "rk_lift", 0.8, 0], [tX - 0.35, "rk_pass", 0.7, 0]];
    },
  };
})();
