// VOICE_DELAY: 0.8
// h_ring: Handy liegt von oben gesehen auf einem Holztisch und klingelt. Niemand nimmt ab, Banner „Verpasster Anruf“ stapeln sich.
// Parameter: caller (Standard „Möglicher Kunde“), missed (Standard 3).
(() => {
  if (document.fonts) ["600 20px D", "700 20px D", "800 20px D", "900 20px D", "400 20px I", "500 20px I", "600 20px I", "700 20px I"].forEach((f) => document.fonts.load(f));
  const PW = 384, PH = 790, PR = 62; // Handy in Weltpixeln
  const BX = 548, BY = 890, BROT = -0.1; // Grundlage des Handys
  const BURST = 0.4, CYC = 0.55; // Vibration: 0,4 s an, Takt 0,55 s
  const MOTIF = [[76, 80, 83, 80], [78, 81, 85, 81]]; // eigene Melodie (E-Dur), je Vibrationsstoß vier Töne

  function timing(d, p) {
    const n = Math.max(1, Math.min(9, Math.round(p.missed != null ? +p.missed : 3)));
    const target = Math.max(0.9, Math.min(2.2, d * 0.48));
    const k = Math.max(1, Math.round((target - BURST) / CYC));
    const tR = k * CYC + BURST + 0.04; // Klingeln endet nach dem letzten ganzen Stoß
    const tLast = Math.max(tR + 0.3 * (n > 1 ? 1 : 0), Math.min(d - 0.5, tR + 0.5 * (n - 1)));
    const tb = []; for (let i = 0; i < n; i++) tb.push(n === 1 ? tR : tR + (tLast - tR) * i / (n - 1));
    return { n, k, tR, tb };
  }
  // Vibrationsstärke 0..1 zur Zeit u (Ringen + kurze Stöße bei neuen Bannern)
  function vibAt(u, T) {
    let v = 0;
    if (u < T.tR) { const ph = u % CYC; if (ph < BURST) v = Math.min(1, ph / 0.03, (BURST - ph) / 0.04); }
    for (let i = 1; i < T.tb.length; i++) { const x = u - T.tb[i]; if (x >= 0 && x < 0.2) v = Math.max(v, 0.6 * Math.min(1, x / 0.02, (0.2 - x) / 0.05)); }
    return Math.max(0, v);
  }
  // aufsummierte Vibration (für das Wandern über den Tisch), analytisch genähert
  function vibInt(u, T) {
    let s = 0; const full = Math.floor(Math.min(u, T.tR) / CYC); s += full * (BURST - 0.035);
    const ph = Math.min(u, T.tR) - full * CYC; s += Math.max(0, Math.min(ph, BURST) - 0.015);
    for (let i = 1; i < T.tb.length; i++) s += 0.5 * cl((u - T.tb[i]) / 0.2) * 0.14;
    return s;
  }

  // ---------- Holz ----------
  function wood(Wc, Hc) {
    const c = document.createElement("canvas"); c.width = Wc; c.height = Hc; const g = c.getContext("2d");
    const im = g.createImageData(Wc, Hc), D = im.data; const PT = new Float32Array(65536);
    for (let i = 0; i < 65536; i++) PT[i] = rnd(i * 0.731 + 3.1);
    const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, a1 = xf * xf * (3 - 2 * xf), b1 = yf * yf * (3 - 2 * yf);
      const i0 = xi & 255, j0 = yi & 255, i1 = (i0 + 1) & 255, j1 = (j0 + 1) & 255; const a = PT[j0 * 256 + i0], b = PT[j0 * 256 + i1], cc = PT[j1 * 256 + i0], e = PT[j1 * 256 + i1];
      return a + (b - a) * a1 + (cc - a) * b1 + (a - b - cc + e) * a1 * b1; };
    const PLW = 250, off = -60;
    for (let y = 0; y < Hc; y++) for (let x = 0; x < Wc; x++) {
      const xx = x - off, pl = Math.floor(xx / PLW), lx = xx - pl * PLW; const ps = pl * 17.3 + 5;
      // Maserung: gestreckte, verzerrte Jahresringe
      const warp = vn(x * 0.011 + ps, y * 0.0021) * 7 + vn(x * 0.04 + ps, y * 0.009) * 1.2;
      const t = lx * 0.075 + warp + (y + ps * 40) * 0.0016;
      const ringv = 0.5 + 0.5 * Math.sin(t * 6.2832); const late = Math.pow(ringv, 5); const fib = vn(x * 0.9 + ps, y * 0.018) - 0.5;
      const big = vn(x * 0.004 + ps, y * 0.0012 + ps) - 0.5; const tone = 0.08 * (rnd(pl * 3.7) - 0.5);
      let k = 0.55 + big * 0.35 + tone - late * 0.32 + fib * 0.14;
      const seam = Math.min(lx, PLW - lx); if (seam < 3) k -= (3 - seam) * 0.16; else if (seam < 5) k += 0.03;
      k = Math.max(0, Math.min(1.1, k));
      const i = (y * Wc + x) * 4; D[i] = 38 + 132 * k; D[i + 1] = 22 + 84 * k; D[i + 2] = 12 + 48 * k; D[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    // Klarlack: weicher Glanz
    const lg = g.createLinearGradient(0, 0, Wc, Hc); lg.addColorStop(0, "rgba(255,230,200,0.05)"); lg.addColorStop(0.5, "rgba(255,230,200,0)"); lg.addColorStop(1, "rgba(0,0,0,0.12)");
    g.fillStyle = lg; g.fillRect(0, 0, Wc, Hc);
    return c;
  }

  // ---------- Kleinteile ----------
  function handset(g, x, y, s, rot, c) { // Telefonhörer
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = c;
    g.beginPath(); g.moveTo(-22, -6); g.bezierCurveTo(-22, -22, 22, -22, 22, -6); g.lineTo(22, 2); g.quadraticCurveTo(22, 8, 16, 8); g.lineTo(9, 8); g.quadraticCurveTo(4, 8, 4, 3); g.lineTo(4, -3);
    g.bezierCurveTo(4, -6, -4, -6, -4, -3); g.lineTo(-4, 3); g.quadraticCurveTo(-4, 8, -9, 8); g.lineTo(-16, 8); g.quadraticCurveTo(-22, 8, -22, 2); g.closePath(); g.fill(); g.restore();
  }
  function statusBar(g, sw, c) {
    txt(g, "10:24", 44, 34, { w: 600, px: 22, fam: "I", c, al: "left" });
    g.fillStyle = c; for (let i = 0; i < 4; i++) g.fillRect(sw - 118 + i * 9, 40 - 6 - i * 4, 6, 6 + i * 4);
    g.strokeStyle = c; g.lineWidth = 2; rr(g, sw - 76, 24, 38, 19, 6); g.stroke(); fillRR(g, sw - 73, 27, 26, 13, 3, c); g.fillRect(sw - 36, 30, 3, 7);
  }
  function person(g, x, y, r) { // neutrale Silhouette
    g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
    const bg = g.createLinearGradient(x, y - r, x, y + r); bg.addColorStop(0, "#9fb3c8"); bg.addColorStop(1, "#5d728c"); g.fillStyle = bg; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(x, y - r * 0.18, r * 0.36, 0, 7); g.fill();
    g.beginPath(); g.ellipse(x, y + r * 0.78, r * 0.72, r * 0.52, 0, 0, 7); g.fill(); g.restore();
  }

  function callScreen(g, sw, sh, u, p, ring) {
    const bg = g.createLinearGradient(0, 0, sw * 0.3, sh); bg.addColorStop(0, "#0f3b33"); bg.addColorStop(0.55, "#0a1f24"); bg.addColorStop(1, "#05080c"); g.fillStyle = bg; g.fillRect(0, 0, sw, sh);
    for (let i = 0; i < 3; i++) { const x = sw * (0.2 + 0.6 * rnd(i * 4.1)) + Math.sin(u * 1.3 + i) * 30, y = sh * (0.15 + 0.5 * rnd(i * 2.3 + 1)); const rg = g.createRadialGradient(x, y, 0, x, y, 260);
      rg.addColorStop(0, i === 1 ? "rgba(52,211,153,0.35)" : "rgba(34,197,166,0.22)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0, 0, sw, sh); }
    statusBar(g, sw, "rgba(255,255,255,0.92)");
    txt(g, "Mobil", sw / 2, 132, { w: 500, px: 22, fam: "I", c: "rgba(255,255,255,0.6)" });
    const name = p.caller || "Möglicher Kunde"; const px = fitPx(g, name, sw - 50, 42, 700, "D");
    txt(g, name, sw / 2, 180, { w: 700, px, c: "#ffffff" });
    g.globalAlpha = 0.55 + 0.45 * Math.abs(Math.sin(u * 4)); txt(g, "ruft an …", sw / 2, 228, { w: 600, px: 30, fam: "I", c: "#c8ffe6" }); g.globalAlpha = 1;
    const ay = 400; // Avatar mit Pulsringen
    for (let k = 0; k < 3; k++) { const q = ((u * 1.6 + k / 3) % 1); g.globalAlpha = (1 - q) * 0.5 * ring; ring_(g, sw / 2, ay, 88 + q * 90, 3); }
    g.globalAlpha = 1; person(g, sw / 2, ay, 86);
    // Knöpfe
    const by = sh - 150, bob = Math.sin(u * 9) * 7 * ring; const gx = sw * 0.73, rx = sw * 0.27;
    shadow(g, 30, 0, "rgba(255,59,48,0.6)"); circle(g, rx, by, 50, "#ff3b30"); noShadow(g); handset(g, rx, by + 2, 1.15, Math.PI * 0.75 + Math.PI, "#fff");
    const gq = (u * 1.6) % 1; g.globalAlpha = (1 - gq) * 0.7 * ring; ring_(g, gx, by + bob, 52 + gq * 40, 4, "#34d399"); g.globalAlpha = 1;
    shadow(g, 40, 0, "rgba(52,211,153,0.8)"); circle(g, gx, by + bob, 50, "#22c55e"); noShadow(g); handset(g, gx, by + bob + 2, 1.15, Math.sin(u * 18) * 0.25 * ring, "#fff");
    txt(g, "Ablehnen", rx, by + 78, { w: 500, px: 20, fam: "I", c: "rgba(255,255,255,0.75)" }); txt(g, "Annehmen", gx, by + 78, { w: 500, px: 20, fam: "I", c: "rgba(255,255,255,0.75)" });
  }
  function ring_(g, x, y, r, lw, c = "#ffffff") { g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); }

  function banner(g, x, y, w, h, p, alpha, count) {
    g.save(); g.globalAlpha = alpha; shadow(g, 24, 8, "rgba(0,0,0,0.45)"); fillRR(g, x, y, w, h, 26, "rgba(58,62,74,0.86)"); noShadow(g);
    g.strokeStyle = "rgba(255,255,255,0.10)"; g.lineWidth = 1.5; rr(g, x + 0.5, y + 0.5, w - 1, h - 1, 26); g.stroke();
    fillRR(g, x + 16, y + h / 2 - 28, 56, 56, 15, "#ff3b30"); handset(g, x + 44, y + h / 2 + 1, 0.8, Math.PI * 1.75, "#fff");
    // kleiner Pfeil (verpasst)
    g.strokeStyle = "#fff"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(x + 52, y + h / 2 - 18); g.lineTo(x + 62, y + h / 2 - 8); g.moveTo(x + 62, y + h / 2 - 16); g.lineTo(x + 62, y + h / 2 - 8); g.lineTo(x + 54, y + h / 2 - 8); g.stroke();
    txt(g, "Verpasster Anruf", x + 84, y + h / 2 - 17, { w: 700, px: 28, fam: "I", c: "#ffffff", al: "left" });
    const nm = p.caller || "Möglicher Kunde"; font(g, 500, 24, "I"); let s = nm; while (g.measureText(s).width > w - 104 && s.length > 4) s = s.slice(0, -2) + "…";
    txt(g, s, x + 84, y + h / 2 + 18, { w: 500, px: 24, fam: "I", c: "rgba(255,255,255,0.72)", al: "left" });
    g.restore();
  }
  function missedScreen(g, sw, sh, u, p, T) {
    const bg = g.createLinearGradient(0, 0, sw * 0.4, sh); bg.addColorStop(0, "#1b1530"); bg.addColorStop(0.6, "#0d0b18"); bg.addColorStop(1, "#05050a"); g.fillStyle = bg; g.fillRect(0, 0, sw, sh);
    const rg = g.createRadialGradient(sw * 0.7, sh * 0.25, 0, sw * 0.7, sh * 0.25, 380); rg.addColorStop(0, "rgba(255,59,48,0.22)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0, 0, sw, sh);
    statusBar(g, sw, "rgba(255,255,255,0.85)");
    txt(g, "Dienstag", sw / 2, 110, { w: 500, px: 24, fam: "I", c: "rgba(255,255,255,0.7)" });
    txt(g, "10:24", sw / 2, 178, { w: 600, px: 96, fam: "D", c: "rgba(255,255,255,0.95)" });
    // Banner-Stapel: neuestes oben
    const shown = T.tb.filter((t) => u >= t).length; const BH = 112, GAP = 12, w = sw - 20;
    for (let j = 0; j < shown; j++) {
      const idx = shown - 1 - j; const t0 = T.tb[idx]; const a = seg(u, t0, t0 + 0.28); if (j > 3) continue;
      const slide = outBack(a, 1.5); const age = (u - t0);
      let y = 250 + j * (BH + GAP); // ältere rutschen nach unten
      if (j > 0) { const nt = T.tb[idx + 1]; const push = out3(seg(u, nt, nt + 0.25)); y = 250 + (j - 1) * (BH + GAP) + push * (BH + GAP); }
      if (j === 0) y = lerp(-BH - 20, 250, slide);
      const fl = j === 0 ? 1 + 0.35 * (1 - seg(age, 0, 0.35)) : 1;
      banner(g, 10, y, w, BH, p, (j === 3 ? 0.5 : 1) * Math.min(1, fl), idx + 1);
      if (j === 0 && age < 0.35) { g.save(); g.globalAlpha = 0.35 * (1 - age / 0.35); fillRR(g, 10, y, w, BH, 26, "#ffffff"); g.restore(); }
    }
    // Hinweis unten
    g.globalAlpha = 0.5; fillRR(g, sw / 2 - 70, sh - 26, 140, 6, 3, "#fff"); g.globalAlpha = 1;
  }

  function phoneBody(g, u, p, T, sc) {
    const sw = PW - 28, sh = PH - 28;
    // Körper mit Titanrand
    const bd = g.createLinearGradient(-PW / 2, -PH / 2, PW / 2, PH / 2); bd.addColorStop(0, "#5c606b"); bd.addColorStop(0.25, "#23252b"); bd.addColorStop(0.6, "#121317"); bd.addColorStop(1, "#4a4e58");
    g.fillStyle = bd; rr(g, -PW / 2, -PH / 2, PW, PH, PR); g.fill();
    const fr = g.createLinearGradient(-PW / 2, 0, PW / 2, 0); fr.addColorStop(0, "#a6abb6"); fr.addColorStop(0.08, "#3a3d45"); fr.addColorStop(0.92, "#3a3d45"); fr.addColorStop(1, "#8d929d");
    g.strokeStyle = fr; g.lineWidth = 3; rr(g, -PW / 2 + 1.5, -PH / 2 + 1.5, PW - 3, PH - 3, PR - 1); g.stroke();
    fillRR(g, -PW / 2 + 7, -PH / 2 + 7, PW - 14, PH - 14, PR - 7, "#030304");
    // Tasten seitlich
    fillRR(g, -PW / 2 - 4, -PH / 2 + 190, 6, 64, 3, "#2b2e35"); fillRR(g, -PW / 2 - 4, -PH / 2 + 270, 6, 64, 3, "#2b2e35"); fillRR(g, PW / 2 - 2, -PH / 2 + 230, 6, 100, 3, "#2b2e35");
    // Bildschirm
    g.save(); rr(g, -sw / 2, -sh / 2, sw, sh, PR - 14); g.clip(); g.translate(-sw / 2, -sh / 2);
    const sw2 = seg(u, T.tR - 0.02, T.tR + 0.14);
    if (sw2 < 1) { g.save(); g.globalAlpha = 1 - sw2; const s = 1 - 0.06 * sw2; g.translate(sw / 2, sh / 2); g.scale(s, s); g.translate(-sw / 2, -sh / 2); callScreen(g, sw, sh, u, p, u < T.tR ? 1 : 0); g.restore(); }
    if (sw2 > 0) { g.save(); g.globalAlpha = sw2; missedScreen(g, sw, sh, u, p, T); g.restore(); }
    // Weckblitz beim Wechsel
    const wk = 1 - seg(u, T.tR, T.tR + 0.3); if (u >= T.tR && wk > 0) { g.fillStyle = `rgba(255,255,255,${0.25 * wk})`; g.fillRect(0, 0, sw, sh); }
    g.restore();
    // Kamera-Loch
    circle(g, 0, -sh / 2 + 30, 11, "#050507"); circle(g, -3, -sh / 2 + 27, 3, "rgba(90,110,160,0.6)");
    // Glas: Spiegelung der Deckenleuchte
    g.save(); rr(g, -sw / 2, -sh / 2, sw, sh, PR - 14); g.clip();
    const sh1 = g.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2); sh1.addColorStop(0, "rgba(255,255,255,0.13)"); sh1.addColorStop(0.32, "rgba(255,255,255,0.03)"); sh1.addColorStop(0.33, "rgba(255,255,255,0.0)"); sh1.addColorStop(1, "rgba(255,255,255,0.02)");
    g.fillStyle = sh1; g.fillRect(-sw / 2, -sh / 2, sw, sh);
    g.globalCompositeOperation = "screen"; const sp = g.createRadialGradient(-sw * 0.2, -sh * 0.33, 0, -sw * 0.2, -sh * 0.33, 230); sp.addColorStop(0, "rgba(255,244,225,0.16)"); sp.addColorStop(1, "rgba(255,244,225,0)");
    g.fillStyle = sp; g.fillRect(-sw / 2, -sh / 2, sw, sh); g.restore();
  }

  TYPES.h_ring = {
    zone: "bottom", pal: "night", bgv: 0, coverT: 0.75,
    prep(sc, p) { sc.st.wood = wood(1200, 2040);
      const c = document.createElement("canvas"); c.width = PW + 240; c.height = PH + 240; const g = c.getContext("2d"); // weicher Schatten, vorberechnet
      g.shadowColor = "rgba(0,0,0,0.75)"; g.shadowBlur = 50; g.shadowOffsetX = 4000; fillRR(g, 120 + 6 - 4000, 120 + 6, PW - 12, PH - 12, PR, "#000"); sc.st.psh = c; },
    draw(g, u, d, p, sc, P) {
      const T = timing(d, p); const v = vibAt(u, T); const E = vibInt(u, T);
      const camx = -Math.min(u, 4) * 5, camy = -Math.min(u, 4) * 3; // leichte Kamerafahrt (Tisch langsamer als Handy)
      g.drawImage(sc.st.wood, -60 + camx, -60 + camy);
      // Deckenlicht
      const li = g.createRadialGradient(470, 760, 80, 540, 900, 1250); li.addColorStop(0, "rgba(255,226,190,0.20)"); li.addColorStop(0.45, "rgba(255,210,170,0.0)"); li.addColorStop(1, "rgba(0,0,0,0.62)");
      g.fillStyle = li; g.fillRect(0, 0, W, H);
      const missed = u >= T.tR; const ringing = u < T.tR ? 1 : 0;
      // Handy-Position: wandert mit der Vibration
      const jx = (rnd(Math.round(u * 60) + 1) - 0.5) * 11 * v, jy = (rnd(Math.round(u * 60) + 7) - 0.5) * 11 * v, jr = (rnd(Math.round(u * 60) + 3) - 0.5) * 0.02 * v;
      const px = BX + E * 24 + camx * 1.6, py = BY - E * 9 + camy * 1.6, rot = BROT + E * 0.05 + jr;
      // Lichtschein des Displays auf dem Holz
      const glowC = missed ? "255,70,80" : "70,255,170"; const gl = (missed ? 0.10 + 0.08 * (1 - seg(u, T.tR, T.tR + 0.6)) : 0.17 + 0.06 * Math.sin(u * 20));
      let gl2 = gl; for (const tb of T.tb) { const x = u - tb; if (x >= 0 && x < 0.5) gl2 = Math.max(gl2, 0.34 * (1 - x / 0.5)); }
      const sg = g.createRadialGradient(px, py, 200, px, py, 760); sg.addColorStop(0, `rgba(${glowC},${gl2})`); sg.addColorStop(1, `rgba(${glowC},0)`);
      g.save(); g.globalCompositeOperation = "screen"; g.fillStyle = sg; g.fillRect(0, 0, W, H); g.restore();
      // Wellenringe (Klingeln)
      if (u < T.tR + 0.9) {
        g.save(); g.globalCompositeOperation = "lighter";
        for (let k = 0; k * 0.275 < T.tR; k++) {
          const t0 = k * 0.275; const q = (u - t0) / 0.95; if (q <= 0 || q >= 1) continue; const e = out3(q); const grow = e * 300;
          g.save(); g.translate(px, py); g.rotate(rot); g.strokeStyle = `rgba(140,255,200,${0.55 * (1 - q) * (1 - q)})`; g.lineWidth = 9 * (1 - q) + 1.5;
          rr(g, -PW / 2 - grow, -PH / 2 - grow, PW + 2 * grow, PH + 2 * grow, PR + grow); g.stroke(); g.restore();
        }
        g.restore();
      }
      // Kaffeetasse oben links (Kaffee zittert mit)
      this.cup(g, 128 + camx * 1.2, 610 + camy * 1.2, u, v);
      // Stift unten rechts
      this.pen(g, 905 + camx * 1.3, 1215 + camy * 1.3);
      // Bewegungsunschärfe: Geisterbild
      if (v > 0.2) {
        const jx2 = (rnd(Math.round(u * 60) - 1 + 1) - 0.5) * 11 * v, jy2 = (rnd(Math.round(u * 60) - 1 + 7) - 0.5) * 11 * v;
        g.save(); g.globalAlpha = 0.28; g.translate(px + jx2, py + jy2); g.rotate(rot); fillRR(g, -PW / 2, -PH / 2, PW, PH, PR, "#1a1b20"); g.restore();
      }
      // Schatten (bei Vibration minimal abgehoben)
      g.save(); g.translate(px + jx, py + jy); g.rotate(rot);
      g.drawImage(sc.st.psh, -PW / 2 - 120 + 16 + v * 5, -PH / 2 - 120 + 26 + v * 6);
      shadow(g, 10, 3, "rgba(0,0,0,0.6)"); fillRR(g, -PW / 2, -PH / 2, PW, PH, PR, "#000"); noShadow(g);
      phoneBody(g, u, p, T, sc);
      // großes Zähler-Badge an der Ecke
      const shown = T.tb.filter((t) => u >= t).length;
      if (shown > 0) {
        const tl = T.tb[shown - 1]; const pk = outElastic(seg(u, tl, tl + 0.5)); const bxp = PW / 2 - 18, byp = -PH / 2 + 18; const r = 70 * (0.6 + 0.4 * pk) * (shown === 1 ? out3(seg(u, tl, tl + 0.2)) : 1);
        const sk = seg(u, tl, tl + 0.5); if (sk < 1) { g.strokeStyle = `rgba(255,80,70,${0.8 * (1 - sk)})`; g.lineWidth = 10 * (1 - sk) + 1; g.beginPath(); g.arc(bxp, byp, 70 + sk * 130, 0, 7); g.stroke(); }
        g.save(); g.translate(bxp, byp); g.rotate(-rot);
        shadow(g, 30, 8, "rgba(120,0,0,0.6)"); const bg2 = g.createRadialGradient(-18, -22, 4, 0, 0, r); bg2.addColorStop(0, "#ff7a6e"); bg2.addColorStop(1, "#e3241b"); g.fillStyle = bg2; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); noShadow(g);
        g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, r - 1, 0, 7); g.stroke();
        txt(g, String(shown), 0, 4, { w: 800, px: Math.round(r * 1.15), c: "#ffffff" }); g.restore();
      }
      g.restore();
      // leichte Vignette
      const vg = g.createRadialGradient(540, 880, 500, 540, 900, 1300); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.45)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    },
    cup(g, x, y, u, v) {
      g.save(); g.translate(x, y);
      shadow(g, 40, 0, "rgba(0,0,0,0.6)"); g.shadowOffsetX = 14; g.shadowOffsetY = 22; circle(g, 0, 0, 158, "#e9e4dc"); noShadow(g);
      const sa = g.createRadialGradient(-50, -60, 10, 0, 0, 160); sa.addColorStop(0, "#ffffff"); sa.addColorStop(0.7, "#e4ded5"); sa.addColorStop(1, "#bfb8ad"); g.fillStyle = sa; g.beginPath(); g.arc(0, 0, 156, 0, 7); g.fill();
      ring_(g, 0, 0, 120, 2, "rgba(0,0,0,0.08)");
      // Henkel
      g.save(); g.rotate(0.6); shadow(g, 14, 6, "rgba(0,0,0,0.35)"); fillRR(g, 95, -20, 70, 40, 20, "#f4f1ec"); noShadow(g); fillRR(g, 118, -9, 32, 18, 9, "#d8d1c6"); g.restore();
      shadow(g, 18, 8, "rgba(0,0,0,0.4)"); circle(g, 0, 0, 108, "#f7f4ef"); noShadow(g);
      const ri = g.createRadialGradient(-30, -40, 30, 0, 0, 108); ri.addColorStop(0, "#ffffff"); ri.addColorStop(1, "#d9d3c9"); g.fillStyle = ri; g.beginPath(); g.arc(0, 0, 106, 0, 7); g.fill();
      const co = g.createRadialGradient(-20, -24, 6, 0, 0, 90); co.addColorStop(0, "#7a4a2a"); co.addColorStop(0.55, "#4a2a16"); co.addColorStop(0.9, "#2d170b"); co.addColorStop(1, "#c79a6a");
      g.fillStyle = co; g.beginPath(); g.arc(0, 0, 90, 0, 7); g.fill();
      // Wellen im Kaffee bei Vibration
      if (v > 0.02) { for (let k = 0; k < 6; k++) { const r = ((u * 260 + k * 15) % 88); g.strokeStyle = `rgba(255,220,180,${0.22 * v * (1 - r / 88)})`; g.lineWidth = 2.2; g.beginPath(); g.arc(0, 0, r + 2, 0, 7); g.stroke(); } }
      g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(-30, -38, 26, 10, -0.6, 0, 7); g.fill();
      g.restore();
    },
    pen(g, x, y) {
      g.save(); g.translate(x, y); g.rotate(-0.95); shadow(g, 14, 0, "rgba(0,0,0,0.55)"); g.shadowOffsetX = 10; g.shadowOffsetY = 14;
      const pb = g.createLinearGradient(0, -14, 0, 14); pb.addColorStop(0, "#3d4a66"); pb.addColorStop(0.45, "#1c2438"); pb.addColorStop(1, "#0b0f19"); g.fillStyle = pb; rr(g, -200, -13, 360, 26, 13); g.fill(); noShadow(g);
      const tip = g.createLinearGradient(160, 0, 215, 0); tip.addColorStop(0, "#c9ccd2"); tip.addColorStop(1, "#6d7078"); g.fillStyle = tip; g.beginPath(); g.moveTo(158, -12); g.lineTo(212, -2); g.lineTo(212, 2); g.lineTo(158, 12); g.closePath(); g.fill();
      fillRR(g, -150, -18, 130, 8, 4, "#c7cad0"); g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(-195, -8, 350, 3); g.restore();
    },
    ev(d, p) {
      const T = timing(d, p); const E = [];
      for (let k = 0; k * CYC < T.tR - 0.1; k++) {
        const t0 = k * CYC; E.push([t0, "h_ring_vib", 0.75, 0]);
        MOTIF[k % 2].forEach((m, j) => E.push([t0 + j * 0.1, "h_ring_n" + m, 0.9, (j - 1.5) * 0.12]));
      }
      E.push([T.tR, "h_ring_stop", 0.6, 0]);
      T.tb.forEach((t, i) => { E.push([t + 0.02, "h_ring_sad" + Math.min(i, 3), 0.85, 0]); if (i > 0) E.push([t, "h_ring_vibs", 0.6, 0]); });
      return E;
    },
  };
})();
