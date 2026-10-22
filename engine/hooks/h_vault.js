// VOICE_DELAY: 0.6
// h_vault: Massive Tresortür im Spotlicht. Das Zahlenschloss rastet ein (drei Lämpchen werden grün), das Rad dreht,
// die Riegel schnappen zurück, die Tür schwingt schwer auf, goldenes Licht strömt heraus, darin eine leuchtende Karte.
// Parameter: label (Standard „GEHEIMTIPP“), sub (optional, kleine Zeile unter dem Label).
(() => {
  const CX = 540, CY = 866, R = 312; // Tür
  const S = 2 * R + 12; // Größe der Tür-Leinwand
  const FOC = 2300; // Brennweite für die Perspektive beim Öffnen
  const BOLTS = 8;
  const GOLD = "#f5c451";

  function timing(d) {
    const tD = Math.max(0.42, Math.min(1.0, 0.235 * d));
    const wd = Math.max(0.3, Math.min(0.45, 0.1 * d + 0.12));
    const tW0 = tD + 0.03, tW1 = tW0 + wd, tO = tW1 + 0.02;
    const dO = Math.max(0.45, Math.min(0.85, 0.22 * d));
    const tC = tO + 0.55 * dO;
    const ph = [0, tD * 0.46, tD * 0.8, tD]; // Phasen des Zahlenschlosses
    const bolts = []; for (let i = 0; i < 4; i++) bolts.push(tW0 + wd * (0.12 + 0.2 * i));
    return { tD, tW0, tW1, wd, tO, dO, tC, ph, bolts };
  }
  const TURNS = [1.15, -0.8, 0.42];
  function dialAngle(u, T) {
    let a = 0; const eases = [out3, inOut, inOut];
    for (let i = 0; i < 3; i++) a += TURNS[i] * eases[i](seg(u, T.ph[i], T.ph[i + 1] - 0.03));
    return a * Math.PI * 2;
  }
  function openAngle(u, T) {
    const crack = out3(seg(u, T.tO, T.tO + 0.12)) * 0.05;
    const swing = inOut(seg(u, T.tO + 0.06, T.tO + T.dO)) * 0.95;
    return (crack + swing) * 1.36; // bis ~78°
  }

  // ---------- statische Teile ----------
  function brushedDisk(g, r, base, seed) { // gebürsteter Stahl, kreisförmig
    const cg = g.createConicGradient(0.6, 0, 0);
    const st = [[0, 0.62], [0.12, 0.9], [0.22, 0.55], [0.38, 0.75], [0.5, 0.5], [0.62, 0.85], [0.75, 0.55], [0.88, 0.8], [1, 0.62]];
    for (const [k, v] of st) { const c = Math.round(base * v); cg.addColorStop(k, `rgb(${c},${Math.round(c * 1.02)},${Math.round(c * 1.07)})`); }
    g.fillStyle = cg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
    g.save(); g.beginPath(); g.arc(0, 0, r, 0, 7); g.clip(); g.lineWidth = 1;
    for (let i = 0; i < 260; i++) { const rr_ = rnd(seed + i * 1.37) * r; const a = rnd(seed + i * 2.11) * 7; g.strokeStyle = `rgba(${rnd(i + seed) > 0.5 ? "255,255,255" : "0,0,0"},${0.03 + rnd(i * 3.3 + seed) * 0.05})`;
      g.beginPath(); g.arc(0, 0, rr_, a, a + 0.6 + rnd(i * 5.1) * 2.5); g.stroke(); }
    g.restore();
  }
  function rivet(g, x, y, r) {
    shadow(g, 6, 3, "rgba(0,0,0,0.7)"); circle(g, x, y, r, "#2a2d33"); noShadow(g);
    const rg = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); rg.addColorStop(0, "#f2f4f8"); rg.addColorStop(0.35, "#9aa0aa"); rg.addColorStop(1, "#30343b");
    g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  function hexBolt(g, x, y, r) {
    shadow(g, 8, 4, "rgba(0,0,0,0.7)"); g.fillStyle = "#3a3e46"; g.beginPath(); for (let k = 0; k < 6; k++) g.lineTo(x + Math.cos(k * Math.PI / 3 + 0.3) * r, y + Math.sin(k * Math.PI / 3 + 0.3) * r); g.closePath(); g.fill(); noShadow(g);
    const lg = g.createLinearGradient(x - r, y - r, x + r, y + r); lg.addColorStop(0, "#d9dde4"); lg.addColorStop(0.5, "#6d737d"); lg.addColorStop(1, "#2b2f36"); g.fillStyle = lg;
    g.beginPath(); for (let k = 0; k < 6; k++) g.lineTo(x + Math.cos(k * Math.PI / 3 + 0.3) * r * 0.86, y + Math.sin(k * Math.PI / 3 + 0.3) * r * 0.86); g.closePath(); g.fill();
    circle(g, x, y, r * 0.42, "rgba(20,22,26,0.55)");
  }

  function makeBg() {
    const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
    // Beton: halbe Auflösung, weich hochskaliert
    const hw = 540, hh = 960, t = document.createElement("canvas"); t.width = hw; t.height = hh; const tg = t.getContext("2d"); const im = tg.createImageData(hw, hh), D = im.data;
    const PT = new Float32Array(65536); for (let i = 0; i < 65536; i++) PT[i] = rnd(i * 0.731 + 5.5);
    const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, a1 = xf * xf * (3 - 2 * xf), b1 = yf * yf * (3 - 2 * yf); const i0 = xi & 255, j0 = yi & 255, i1 = (i0 + 1) & 255, j1 = (j0 + 1) & 255; const a = PT[j0 * 256 + i0], b = PT[j0 * 256 + i1], c = PT[j1 * 256 + i0], e = PT[j1 * 256 + i1]; return a + (b - a) * a1 + (c - a) * b1 + (a - b - c + e) * a1 * b1; };
    for (let y = 0; y < hh; y++) for (let x = 0; x < hw; x++) {
      const n = 0.5 * vn(x * 0.03, y * 0.03) + 0.3 * vn(x * 0.11 + 30, y * 0.11) + 0.2 * rnd(x * 3.1 + y * 7.7);
      const dx = (x * 2 - CX) / 700, dy = (y * 2 - (CY - 260)) / 900; const spot = Math.exp(-(dx * dx + dy * dy) * 1.6);
      const v = (0.035 + 0.30 * spot) * (0.8 + 0.34 * n); const i = (y * hw + x) * 4;
      D[i] = 255 * v * 1.05; D[i + 1] = 255 * v; D[i + 2] = 255 * v * 0.92; D[i + 3] = 255;
    }
    tg.putImageData(im, 0, 0); g.imageSmoothingQuality = "high"; g.drawImage(t, 0, 0, W, H);
    // Stahlrahmen
    const fx = CX - 404, fy = CY - 404, fw = 808;
    shadow(g, 80, 40, "rgba(0,0,0,0.85)"); fillRR(g, fx, fy, fw, fw, 34, "#1c1e22"); noShadow(g);
    let gr = g.createLinearGradient(fx, fy, fx + fw * 0.6, fy + fw); gr.addColorStop(0, "#6c727c"); gr.addColorStop(0.3, "#3a3e45"); gr.addColorStop(0.7, "#24272c"); gr.addColorStop(1, "#15171a");
    g.fillStyle = gr; rr(g, fx, fy, fw, fw, 34); g.fill();
    for (let i = 0; i < 180; i++) { const y = fy + rnd(i * 4.4) * fw; g.fillStyle = `rgba(255,255,255,${0.012 + rnd(i * 1.9) * 0.025})`; g.fillRect(fx + 8, y, fw - 16, 1); }
    g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 3; rr(g, fx + 2, fy + 2, fw - 4, fw - 4, 32); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 4; rr(g, fx + 26, fy + 26, fw - 52, fw - 52, 20); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.08)"; g.lineWidth = 2; rr(g, fx + 29, fy + 29, fw - 58, fw - 58, 18); g.stroke();
    for (const [x, y] of [[fx + 52, fy + 52], [fx + fw - 52, fy + 52], [fx + 52, fy + fw - 52], [fx + fw - 52, fy + fw - 52]]) hexBolt(g, x, y, 20);
    // Türzarge (Ring um die Öffnung)
    g.save(); g.translate(CX, CY);
    shadow(g, 40, 0, "rgba(0,0,0,0.8)"); circle(g, 0, 0, R + 64, "#1a1c20"); noShadow(g);
    gr = g.createLinearGradient(-R, -R - 64, R, R + 64); gr.addColorStop(0, "#80868f"); gr.addColorStop(0.45, "#3b3f46"); gr.addColorStop(1, "#16181b");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, R + 64, 0, 7); g.fill();
    gr = g.createLinearGradient(-R, -R, R, R); gr.addColorStop(0, "#0b0c0e"); gr.addColorStop(1, "#33373e");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, R + 24, 0, 7); g.fill();
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 + 0.13; rivet(g, Math.cos(a) * (R + 44), Math.sin(a) * (R + 44), 7); }
    // Riegelaufnahmen
    for (let i = 0; i < BOLTS; i++) { const a = i / BOLTS * Math.PI * 2 + Math.PI / 8; g.save(); g.rotate(a); fillRR(g, R + 4, -18, 30, 36, 6, "#060708"); g.restore(); }
    g.restore();
    // Scharnier rechts
    for (const yy of [CY - 190, CY + 110]) {
      const hx = CX + R + 40; shadow(g, 20, 8, "rgba(0,0,0,0.7)"); fillRR(g, hx - 26, yy, 52, 80, 14, "#2a2d33"); noShadow(g);
      gr = g.createLinearGradient(hx - 26, 0, hx + 26, 0); gr.addColorStop(0, "#3a3e45"); gr.addColorStop(0.35, "#c4c9d1"); gr.addColorStop(0.6, "#5f646d"); gr.addColorStop(1, "#1d2024");
      g.fillStyle = gr; rr(g, hx - 26, yy, 52, 80, 14); g.fill(); g.fillStyle = "rgba(0,0,0,0.4)"; g.fillRect(hx - 26, yy + 38, 52, 3);
    }
    return c;
  }

  function makeFace() { // Türblatt ohne bewegliche Teile, Mitte in (S/2, S/2)
    const c = document.createElement("canvas"); c.width = S; c.height = S; const g = c.getContext("2d"); g.translate(S / 2, S / 2);
    // Fase außen
    let gr = g.createLinearGradient(-R, -R, R, R); gr.addColorStop(0, "#d6dae1"); gr.addColorStop(0.35, "#6b717a"); gr.addColorStop(0.65, "#2c3036"); gr.addColorStop(1, "#5a606a");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill();
    brushedDisk(g, R - 26, 118, 3.3);
    // Ringe
    g.strokeStyle = "rgba(0,0,0,0.55)"; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, R - 27, 0, 7); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, R - 31, 0, 7); g.stroke();
    for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; rivet(g, Math.cos(a) * (R - 49), Math.sin(a) * (R - 49), 8); }
    g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, R - 72, 0, 7); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, R - 76, 0, 7); g.stroke();
    // Platte hinter Zahlenschloss
    shadow(g, 16, 6, "rgba(0,0,0,0.6)"); circle(g, 0, -88, 104, "#2b2e34"); noShadow(g);
    gr = g.createLinearGradient(-104, -192, 104, 16); gr.addColorStop(0, "#9ca2ab"); gr.addColorStop(0.5, "#454950"); gr.addColorStop(1, "#1e2024");
    g.fillStyle = gr; g.beginPath(); g.arc(0, -88, 104, 0, 7); g.fill();
    // Nabe des Rads
    shadow(g, 20, 8, "rgba(0,0,0,0.6)"); circle(g, 0, 118, 50, "#22252a"); noShadow(g);
    // Lämpchen-Fassungen
    for (let i = 0; i < 3; i++) { const x = (i - 1) * 42, y = -222 + Math.abs(i - 1) * 5; circle(g, x, y, 13, "#14161a"); g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 13, 0, 7); g.stroke(); }
    return c;
  }

  function dial(g, x, y, ang) {
    g.save(); g.translate(x, y);
    shadow(g, 18, 8, "rgba(0,0,0,0.7)"); circle(g, 0, 0, 90, "#1b1d21"); noShadow(g);
    // Rändelung
    g.save(); g.rotate(ang); for (let i = 0; i < 90; i++) { g.rotate(Math.PI * 2 / 90); g.fillStyle = i % 2 ? "#5d636c" : "#2a2d33"; g.fillRect(84, -2.2, 8, 4.4); } g.restore();
    let gr = g.createLinearGradient(-80, -80, 80, 80); gr.addColorStop(0, "#f0f2f5"); gr.addColorStop(0.45, "#a5abb4"); gr.addColorStop(1, "#4c5159");
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 82, 0, 7); g.fill();
    g.save(); g.rotate(ang);
    for (let i = 0; i < 50; i++) { g.save(); g.rotate(i / 50 * Math.PI * 2); g.fillStyle = "#16181c"; g.fillRect(-1.2, -78, 2.4, i % 5 === 0 ? 14 : 7); g.restore(); }
    for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 - Math.PI / 2; txt(g, String(i * 10), Math.cos(a) * 52, Math.sin(a) * 52 + 1, { w: 700, px: 17, fam: "I", c: "#16181c" }); }
    g.restore();
    gr = g.createRadialGradient(-10, -12, 2, 0, 0, 34); gr.addColorStop(0, "#e8ebef"); gr.addColorStop(1, "#3d4148"); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 32, 0, 7); g.fill();
    g.save(); g.rotate(ang); fillRR(g, -9, -30, 18, 60, 8, "#2b2e34"); fillRR(g, -6, -27, 6, 54, 3, "rgba(255,255,255,0.25)"); g.restore();
    // Glanz
    g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.ellipse(-26, -34, 34, 14, -0.6, 0, 7); g.fill();
    g.restore();
    // Index
    g.fillStyle = "#e23b2e"; g.beginPath(); g.moveTo(x - 9, y - 106); g.lineTo(x + 9, y - 106); g.lineTo(x, y - 92); g.closePath(); g.fill();
  }
  function wheel(g, x, y, ang, blur) {
    const draw = (a, alpha) => {
      g.save(); g.translate(x, y); g.rotate(a); g.globalAlpha = alpha;
      for (let i = 0; i < 4; i++) {
        g.save(); g.rotate(i * Math.PI / 2 + Math.PI / 4);
        shadow(g, 14, 10, "rgba(0,0,0,0.65)");
        const sg = g.createLinearGradient(0, -11, 0, 11); sg.addColorStop(0, "#eef0f3"); sg.addColorStop(0.4, "#8d939c"); sg.addColorStop(1, "#33373d");
        g.fillStyle = sg; rr(g, 28, -10, 96, 20, 10); g.fill(); noShadow(g);
        const kg = g.createRadialGradient(120 - 7, -9, 3, 120, 0, 23); kg.addColorStop(0, "#ffffff"); kg.addColorStop(0.35, "#aab0b9"); kg.addColorStop(1, "#2c3035");
        shadow(g, 12, 8, "rgba(0,0,0,0.6)"); g.fillStyle = kg; g.beginPath(); g.arc(120, 0, 22, 0, 7); g.fill(); noShadow(g);
        g.restore();
      }
      const hg = g.createRadialGradient(-14, -16, 4, 0, 0, 48); hg.addColorStop(0, "#f4f6f8"); hg.addColorStop(0.5, "#8b919a"); hg.addColorStop(1, "#2a2d32");
      g.fillStyle = hg; g.beginPath(); g.arc(0, 0, 46, 0, 7); g.fill(); circle(g, 0, 0, 16, "#25282d"); g.restore();
    };
    if (blur > 0.02) for (let k = 3; k >= 1; k--) draw(ang - blur * k * 0.12, 0.22);
    draw(ang, 1);
  }

  function goldBars(g, w, h) { // Goldbarren im Tresor (Mitte unten)
    const bar = (x, y, s) => {
      g.save(); g.translate(x, y); g.scale(s, s);
      const top = g.createLinearGradient(0, -30, 0, 0); top.addColorStop(0, "#ffe08a"); top.addColorStop(1, "#d9962a");
      g.fillStyle = "#9a5f14"; g.beginPath(); g.moveTo(-60, 0); g.lineTo(60, 0); g.lineTo(46, -30); g.lineTo(-46, -30); g.closePath(); g.fill();
      g.fillStyle = top; g.beginPath(); g.moveTo(-44, -30); g.lineTo(44, -30); g.lineTo(36, -42); g.lineTo(-36, -42); g.closePath(); g.fill();
      g.fillStyle = "rgba(255,245,200,0.6)"; g.fillRect(-40, -29, 80, 2); g.strokeStyle = "rgba(90,50,5,0.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(-60, 0); g.lineTo(-46, -30); g.lineTo(46, -30); g.lineTo(60, 0); g.stroke(); g.restore();
    };
    for (let row = 0; row < 3; row++) for (let i = 0; i < 4 - row; i++) bar((i - (3 - row) / 2) * 124, h - row * 42, 1);
  }

  TYPES.h_vault = {
    zone: "bottom", pal: "gold", bgv: 0, coverT: 2.3,
    prep(sc, p) {
      sc.st.bg = makeBg(); sc.st.face = makeFace();
      const b = document.createElement("canvas"); b.width = S; b.height = S; sc.st.buf = b;
    },
    draw(g, u, d, p, sc, P) {
      const T = timing(d); const ang = dialAngle(u, T);
      const wk = inOut(seg(u, T.tW0, T.tW1)); const wAng = wk * Math.PI * 1.1;
      const wv = Math.abs(Math.sin(Math.PI * seg(u, T.tW0, T.tW1))) * (u > T.tW0 && u < T.tW1 ? 1 : 0);
      const a = openAngle(u, T); const op = seg(u, T.tO, T.tO + T.dO);
      const glow = Math.max(0, Math.min(1, (a - 0.02) * 2.2));
      // Kamera
      const zk = inOut(seg(u, 0, T.tD + 0.14)); const camY = lerp(CY - 88, CY, zk);
      let s = Math.pow(1.9, 1 - zk) * (1 + 0.035 * cl(u / Math.max(1, T.tO)) + 0.07 * inOut(seg(u, T.tO, T.tO + T.dO + 0.6)) + 0.02 * cl((u - T.tO - T.dO) / 2));
      let shx = 0, shy = 0; const hit = (t0, amp) => { const x = u - t0; if (x >= 0 && x < 0.3) { const k = amp * Math.exp(-x / 0.06); shx += Math.sin(u * 97 + t0) * k; shy += Math.cos(u * 81 + t0) * k; } };
      T.bolts.forEach((t) => hit(t, 3)); hit(T.tO, 7); hit(T.tC + 0.05, 4);
      g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
      g.save(); g.translate(CX + shx, CY + shy); g.scale(s, s); g.translate(-CX, -camY);
      g.drawImage(sc.st.bg, 0, 0);
      // Innenraum (nur sichtbar, wenn die Tür aufgeht)
      if (a > 0.001) {
        g.save(); g.beginPath(); g.arc(CX, CY, R + 4, 0, 7); g.clip();
        const ig = g.createRadialGradient(CX, CY - 20, 10, CX, CY, R + 10); ig.addColorStop(0, `rgba(255,240,200,${glow})`); ig.addColorStop(0.35, `rgba(255,200,100,${glow})`); ig.addColorStop(0.8, `rgba(200,120,30,${glow})`); ig.addColorStop(1, `rgba(90,45,8,${glow})`);
        g.fillStyle = "#060403"; g.fillRect(CX - R - 10, CY - R - 10, 2 * R + 20, 2 * R + 20); g.fillStyle = ig; g.fillRect(CX - R - 10, CY - R - 10, 2 * R + 20, 2 * R + 20);
        g.save(); g.globalAlpha = glow; g.translate(CX, CY); goldBars(g, 0, R - 40); g.restore();
        // Regale (Silhouetten)
        g.fillStyle = `rgba(120,70,15,${0.35 * glow})`; g.fillRect(CX - R, CY - 140, 2 * R, 10); g.fillRect(CX - R, CY + 40, 2 * R, 10);
        g.restore();
      }
      // Riegel (nur solange zu)
      if (u < T.tO + 0.05) {
        for (let i = 0; i < BOLTS; i++) {
          const grp = i % 4; const rk = out3(seg(u, T.bolts[grp], T.bolts[grp] + 0.07)); const len = 46 * (1 - rk);
          if (len < 1) continue; const an = i / BOLTS * Math.PI * 2 + Math.PI / 8;
          g.save(); g.translate(CX, CY); g.rotate(an);
          const bg = g.createLinearGradient(0, -18, 0, 18); bg.addColorStop(0, "#f2f4f7"); bg.addColorStop(0.35, "#a4aab3"); bg.addColorStop(1, "#3a3e45");
          shadow(g, 8, 4, "rgba(0,0,0,0.6)"); g.fillStyle = bg; rr(g, R - 8, -17, len + 8, 34, 8); g.fill(); noShadow(g); g.restore();
        }
      }
      // Lichtstrahlen aus der Öffnung
      if (glow > 0) {
        g.save(); g.globalCompositeOperation = "lighter";
        for (let i = 0; i < 18; i++) {
          const an = i / 18 * Math.PI * 2 + u * 0.12 + rnd(i * 3.3) * 0.2; const wdt = 0.05 + rnd(i * 7.7) * 0.07; const len = 900 + rnd(i * 5.1) * 500;
          const rg = g.createRadialGradient(CX, CY, R * 0.4, CX, CY, len); rg.addColorStop(0, `rgba(255,214,120,${0.16 * glow})`); rg.addColorStop(1, "rgba(255,180,60,0)");
          g.fillStyle = rg; g.beginPath(); g.moveTo(CX, CY); g.arc(CX, CY, len, an - wdt, an + wdt); g.closePath(); g.fill();
        }
        const hg = g.createRadialGradient(CX, CY, 20, CX, CY, 700); hg.addColorStop(0, `rgba(255,230,160,${0.3 * glow})`); hg.addColorStop(0.5, `rgba(255,190,80,${0.07 * glow})`); hg.addColorStop(1, "rgba(255,170,60,0)");
        g.fillStyle = hg; g.fillRect(0, 0, W, H);
        g.restore();
      }
      // Tür: erst flach, beim Öffnen perspektivisch in Streifen
      const bufG = sc.st.buf.getContext("2d"); bufG.setTransform(1, 0, 0, 1, 0, 0); bufG.clearRect(0, 0, S, S); bufG.drawImage(sc.st.face, 0, 0);
      bufG.save(); bufG.translate(S / 2, S / 2);
      // Lämpchen
      for (let i = 0; i < 3; i++) {
        const on = u >= T.ph[i + 1] - 0.03; const x = (i - 1) * 42, y = -222 + Math.abs(i - 1) * 5;
        const k = on ? seg(u, T.ph[i + 1] - 0.03, T.ph[i + 1] + 0.05) : 0;
        if (on) { const lg = bufG.createRadialGradient(x, y, 0, x, y, 40); lg.addColorStop(0, `rgba(80,255,140,${0.8 * k})`); lg.addColorStop(1, "rgba(80,255,140,0)"); bufG.fillStyle = lg; bufG.fillRect(x - 40, y - 40, 80, 80); }
        circle(bufG, x, y, 9, on ? "#9dffbf" : "#3a1414"); circle(bufG, x - 3, y - 3, 3.5, on ? "#ffffff" : "rgba(255,120,120,0.35)");
      }
      bufG.restore();
      const av = (dialAngle(u + 0.012, T) - dialAngle(u - 0.012, T)) / 0.024;
      if (Math.abs(av) > 4) for (let k = 3; k >= 1; k--) { bufG.save(); bufG.globalAlpha = 0.28; dial(bufG, S / 2, S / 2 - 88, ang - av * 0.011 * k); bufG.restore(); }
      dial(bufG, S / 2, S / 2 - 88, ang);
      wheel(bufG, S / 2, S / 2 + 118, wAng, wv);
      // Licht von oben (Spot) auf der Tür
      bufG.save(); bufG.globalCompositeOperation = "source-atop";
      const sp = bufG.createRadialGradient(S / 2 - 60, S / 2 - 260, 40, S / 2, S / 2, S * 0.8); sp.addColorStop(0, "rgba(255,238,210,0.30)"); sp.addColorStop(0.45, "rgba(0,0,0,0)"); sp.addColorStop(1, "rgba(0,0,0,0.6)");
      bufG.fillStyle = sp; bufG.fillRect(0, 0, S, S);
      if (glow > 0) { bufG.fillStyle = `rgba(255,190,80,${0.12 * glow})`; bufG.fillRect(0, 0, S, S); }
      bufG.restore();
      if (a < 0.001) {
        shadow(g, 50, 24, "rgba(0,0,0,0.75)"); g.drawImage(sc.st.buf, CX - S / 2, CY - S / 2); noShadow(g);
      } else {
        const ca = Math.cos(a), sa = Math.sin(a), TH = 96;
        const proj = (x, y, z) => { const f = FOC / (FOC + z); return [CX + x * f, CY + y * f]; };
        const P3 = (lx, ly, back) => { const sx = lx - R; let X = R + sx * ca, Z = sx * sa; if (back) { X -= TH * sa; Z += TH * ca; } return proj(X, ly, Z); };
        // Rückseite + Rand
        const N = 72; const fr = [], bk = [];
        for (let i = 0; i <= N; i++) { const th = i / N * Math.PI * 2; fr.push(P3(Math.cos(th) * R, Math.sin(th) * R, false)); bk.push(P3(Math.cos(th) * R, Math.sin(th) * R, true)); }
        g.fillStyle = "#16181b"; g.beginPath(); bk.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.fill();
        for (let i = 0; i < N; i++) {
          const th = (i + 0.5) / N * Math.PI * 2; const up = Math.max(0, -Math.sin(th)), lf = Math.max(0, -Math.cos(th));
          const l = 0.16 + 0.42 * Math.pow(up, 1.5) + 0.12 * lf; const c = Math.round(40 + 160 * l);
          const q = [fr[i], fr[i + 1], bk[i + 1], bk[i]];
          const lg = g.createLinearGradient(q[0][0], q[0][1], q[3][0], q[3][1]);
          lg.addColorStop(0, `rgb(${c + 30},${c + 28},${c + 26})`); lg.addColorStop(0.08, `rgb(${c},${c},${c + 4})`); lg.addColorStop(0.3, `rgb(${c - 18},${c - 18},${c - 14})`); lg.addColorStop(0.32, `rgb(${c + 20},${c + 18},${c + 14})`);
          lg.addColorStop(0.62, `rgb(${c - 10},${c - 10},${c - 8})`); lg.addColorStop(0.64, `rgb(${c + 14},${c + 12},${c + 8})`); lg.addColorStop(1, `rgb(${Math.round(c * 0.5)},${Math.round(c * 0.48)},${Math.round(c * 0.45)})`);
          g.fillStyle = lg; g.beginPath(); g.moveTo(...q[0]); g.lineTo(...q[1]); g.lineTo(...q[2]); g.lineTo(...q[3]); g.closePath(); g.fill();
          g.strokeStyle = g.fillStyle; g.lineWidth = 1; g.stroke();
        }
        // Riegelköpfe im Rand
        for (let i = 0; i < BOLTS; i++) {
          const th = i / BOLTS * Math.PI * 2 + Math.PI / 8; const lx = Math.cos(th) * R, ly = Math.sin(th) * R;
          const [x1, y1] = P3(lx, ly, false), [x2, y2] = P3(lx, ly, true); const mx_ = (x1 + x2) / 2, my = (y1 + y2) / 2;
          const rg = g.createRadialGradient(mx_ - 4, my - 4, 1, mx_, my, 16); rg.addColorStop(0, "#ffffff"); rg.addColorStop(0.5, "#9aa0aa"); rg.addColorStop(1, "#2c3036");
          g.fillStyle = rg; g.beginPath(); g.ellipse(mx_, my, Math.max(3, Math.abs(x2 - x1) * 0.3), 15, 0, 0, 7); g.fill();
        }
        // Vorderseite in Streifen
        const STP = 4;
        for (let sx = 0; sx < S; sx += STP) {
          const lx0 = sx - S / 2, lx1 = lx0 + STP; const z0 = (lx0 - R) * sa, z1 = (lx1 - R) * sa;
          const f0 = FOC / (FOC + z0), f1 = FOC / (FOC + z1); const x0 = CX + (R + (lx0 - R) * ca) * f0, x1 = CX + (R + (lx1 - R) * ca) * f1;
          const fm = (f0 + f1) / 2; const wdt = Math.max(0.6, x1 - x0 + 0.6);
          g.drawImage(sc.st.buf, sx, 0, STP, S, x0, CY - S / 2 * fm, wdt, S * fm);
        }
        // Abdunkeln der Front, je weiter sie sich wegdreht
        g.save(); g.globalAlpha = 0.5 * Math.sin(a * 0.9); g.fillStyle = "#000"; g.beginPath(); fr.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.fill(); g.restore();
      }
      // Lichtspalt um die Tür, sobald die Riegel offen sind
      const seam = seg(u, T.bolts[3], T.tO + 0.05) * (1 - seg(u, T.tO + 0.1, T.tO + 0.3));
      if (seam > 0) { g.save(); g.globalCompositeOperation = "lighter"; shadow(g, 30, 0, `rgba(255,190,70,${seam})`); g.strokeStyle = `rgba(255,214,130,${0.85 * seam})`; g.lineWidth = 4; g.beginPath(); g.arc(CX + 3 * seg(u, T.tO, T.tO + 0.12), CY, R + 1, 0, 7); g.stroke(); noShadow(g); g.restore(); }
      if (glow > 0) {
        g.save(); g.globalCompositeOperation = "lighter";
        // Goldstaub fliegt heraus
        for (let i = 0; i < 70; i++) {
          const t0 = T.tO + 0.1 + rnd(i * 2.2) * 2.4; const k = (u - t0) / (1.2 + rnd(i * 4.4)); if (k < 0 || k > 1) continue;
          const an = rnd(i * 6.6) * 7; const rad = 40 + k * (300 + rnd(i * 8.8) * 500); const x = CX + Math.cos(an) * rad, y = CY + Math.sin(an) * rad * 0.8 - k * 60;
          const r = (1.5 + rnd(i) * 3) * (1 + k * 1.5); g.globalAlpha = Math.sin(k * Math.PI) * glow;
          const pg = g.createRadialGradient(x, y, 0, x, y, r * 3); pg.addColorStop(0, "rgba(255,245,200,1)"); pg.addColorStop(1, "rgba(255,200,90,0)"); g.fillStyle = pg; g.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
        }
        g.restore();
      }
      g.restore();
      // Karte mit Label
      const ck = seg(u, T.tC, T.tC + 0.32);
      if (ck > 0) {
        const e = outBack(ck, 1.8); const sc_ = lerp(0.25, 1, e); const bob = Math.sin((u - T.tC) * 2.4) * 8 * cl((u - T.tC - 0.3) * 3);
        const label = String(p.label || "GEHEIMTIPP").toUpperCase(); const cw = 700, ch = p.sub ? 300 : 260;
        g.save(); g.translate(CX, CY + 10 + bob); g.scale(sc_, sc_); g.rotate(-0.03 + 0.02 * Math.sin((u - T.tC) * 1.7)); g.globalAlpha = cl(ck * 3);
        // Schein hinter der Karte
        g.save(); g.globalCompositeOperation = "lighter"; const bgl = g.createRadialGradient(0, 0, 60, 0, 0, 560); bgl.addColorStop(0, "rgba(255,210,110,0.55)"); bgl.addColorStop(1, "rgba(255,180,60,0)"); g.fillStyle = bgl; g.fillRect(-600, -600, 1200, 1200); g.restore();
        shadow(g, 70, 30, "rgba(40,20,0,0.75)"); fillRR(g, -cw / 2, -ch / 2, cw, ch, 34, "#120d06"); noShadow(g);
        let gr = g.createLinearGradient(-cw / 2, -ch / 2, cw / 2, ch / 2); gr.addColorStop(0, "#2a1f0c"); gr.addColorStop(0.5, "#0f0b05"); gr.addColorStop(1, "#24190a");
        g.fillStyle = gr; rr(g, -cw / 2, -ch / 2, cw, ch, 34); g.fill();
        gr = g.createLinearGradient(-cw / 2, -ch / 2, cw / 2, ch / 2); gr.addColorStop(0, "#fff1b8"); gr.addColorStop(0.3, "#e0a93a"); gr.addColorStop(0.55, "#fff4c9"); gr.addColorStop(0.8, "#b9801f"); gr.addColorStop(1, "#ffe08a");
        g.strokeStyle = gr; g.lineWidth = 8; rr(g, -cw / 2 + 4, -ch / 2 + 4, cw - 8, ch - 8, 30); g.stroke();
        g.strokeStyle = "rgba(245,196,81,0.35)"; g.lineWidth = 2; rr(g, -cw / 2 + 22, -ch / 2 + 22, cw - 44, ch - 44, 20); g.stroke();
        // Sterne oben
        for (let i = -1; i <= 1; i++) star(g, i * 44, -ch / 2 + 52, i === 0 ? 17 : 12, 1, GOLD, GOLD);
        const px = fitPx(g, label, cw - 110, 118, 900);
        font(g, 900, px); g.textAlign = "center"; g.textBaseline = "middle";
        const tg = g.createLinearGradient(0, -px * 0.5, 0, px * 0.5); tg.addColorStop(0, "#fff6d0"); tg.addColorStop(0.45, "#f5c451"); tg.addColorStop(0.55, "#d99a28"); tg.addColorStop(1, "#ffe7a0");
        shadow(g, 30, 0, "rgba(255,190,70,0.7)"); g.fillStyle = tg; g.fillText(label, 0, p.sub ? 14 : 30); noShadow(g);
        if (p.sub) { const sp_ = fitPx(g, p.sub, cw - 140, 38, 600, "I"); txt(g, p.sub, 0, 92, { w: 600, px: sp_, fam: "I", c: "rgba(255,230,170,0.85)" }); }
        // Glanz läuft über die Karte
        const gk = seg(u, T.tC + 0.25, T.tC + 0.9); if (gk > 0 && gk < 1) {
          g.save(); rr(g, -cw / 2, -ch / 2, cw, ch, 34); g.clip(); g.globalCompositeOperation = "lighter"; const bx = lerp(-cw, cw, inOut(gk));
          g.translate(bx, 0); g.rotate(0.35); const lg = g.createLinearGradient(-90, 0, 90, 0); lg.addColorStop(0, "rgba(255,240,200,0)"); lg.addColorStop(0.5, "rgba(255,240,200,0.4)"); lg.addColorStop(1, "rgba(255,240,200,0)");
          g.fillStyle = lg; g.fillRect(-90, -ch, 180, 2 * ch); g.restore();
        }
        g.restore();
        if (ck >= 1) { g.save(); g.globalCompositeOperation = "lighter"; sparkles(g, CX, CY, u - T.tC, 22, 460, "#ffe9a8", 11); g.restore(); }
        // Lichtblitz beim Auftauchen
        const fl = 1 - seg(u, T.tC, T.tC + 0.25); if (fl > 0) { g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,220,140,${0.35 * fl * cl(ck * 4)})`; g.fillRect(0, 0, W, H); g.restore(); }
      }
      // Vignette
      const vg = g.createRadialGradient(CX, CY, 420, CX, CY + 40, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.78)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    },
    ev(d, p) {
      const T = timing(d); const E = [[0, "vault_hit", 0.9, 0]];
      // Rasten des Zahlenschlosses
      const step = Math.PI * 2 / 20; let last = Math.floor(dialAngle(0, T) / step), lastT = -1;
      for (let t = 0; t <= T.tD; t += 0.002) { const k = Math.floor(dialAngle(t, T) / step); if (k !== last) { if (t - lastT > 0.032) { E.push([t, "vault_tick" + (k & 1), 0.55, (k & 1 ? 0.15 : -0.15)]); lastT = t; } last = k; } }
      for (let i = 1; i <= 3; i++) E.push([T.ph[i] - 0.03, "vault_set", 0.75, (i - 2) * 0.2]);
      E.push([T.tW0, "vault_wheel", 0.7, 0]);
      T.bolts.forEach((t, i) => E.push([t, "vault_bolt", 0.9, i % 2 ? 0.35 : -0.35]));
      E.push([T.tO, "vault_open", 1.0, 0.1]);
      E.push([T.tO + 0.12, "vault_glow", 0.75, 0]);
      E.push([T.tC, "vault_card", 0.8, 0]);
      return E;
    },
  };
})();
