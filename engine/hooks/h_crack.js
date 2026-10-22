// VOICE_DELAY: 0.7
// h_crack: schräges Handy mit Website. Zwei Klopfer aufs Glas, dann springt das Display mit Rissen, Splittern und Pixelfehlern.
// Parameter: url (Standard „ihre-firma.de“), crack_text (optional, z. B. „Kaputt.“).
(() => {
  if (document.fonts) ["600 20px D", "700 20px D", "800 20px D", "900 20px D", "400 20px I", "500 20px I", "600 20px I", "700 20px I"].forEach((f) => document.fonts.load(f));
  const PW = 420, PH = 860, PR = 62, SW = PW - 28, SH = PH - 28, SR = 50;
  const IX = SW * 0.62, IY = SH * 0.34; // Einschlag in Bildschirm-Koordinaten

  function timing(d) {
    const tC = Math.max(0.75, Math.min(1.45, d * 0.38)); const tL = d - tC >= 1.75 ? tC + Math.min(1.25, d - tC - 0.6) : -1;
    return { tK1: 0.0, tK2: tC * 0.5, tC, tL };
  }

  // ---------- Website-Mockup ----------
  function site(p) {
    const c = document.createElement("canvas"); c.width = SW; c.height = SH; const g = c.getContext("2d");
    g.fillStyle = "#f6f7f9"; g.fillRect(0, 0, SW, SH);
    // Statusleiste + Adresszeile
    g.fillStyle = "#ffffff"; g.fillRect(0, 0, SW, 112);
    txt(g, "10:24", 40, 30, { w: 600, px: 20, fam: "I", c: "#111", al: "left" });
    g.fillStyle = "#111"; for (let i = 0; i < 4; i++) g.fillRect(SW - 104 + i * 8, 36 - 5 - i * 4, 5, 5 + i * 4); g.strokeStyle = "#111"; g.lineWidth = 2; rr(g, SW - 66, 22, 34, 17, 5); g.stroke(); fillRR(g, SW - 63, 25, 24, 11, 3, "#111");
    fillRR(g, 18, 56, SW - 36, 44, 22, "#eef0f4");
    g.strokeStyle = "#5b6474"; g.lineWidth = 2.4; rr(g, 40, 72, 14, 12, 3); g.stroke(); g.beginPath(); g.arc(47, 72, 5, Math.PI, 0); g.stroke();
    const url = p.url || "ihre-firma.de"; const upx = fitPx(g, url, SW - 120, 22, 500, "I"); txt(g, url, 64, 79, { w: 500, px: upx, fam: "I", c: "#3b4250", al: "left" });
    // Navigation
    g.fillStyle = "#ffffff"; g.fillRect(0, 112, SW, 70); g.fillStyle = "#e6e8ec"; g.fillRect(0, 181, SW, 1);
    fillRR(g, 22, 128, 38, 38, 10, "#1f6feb"); g.fillStyle = "#fff"; g.beginPath(); g.moveTo(41, 136); g.lineTo(54, 148); g.lineTo(28, 148); g.closePath(); g.fill(); g.fillRect(32, 148, 18, 11);
    txt(g, "Ihre Firma", 72, 148, { w: 700, px: 24, fam: "D", c: "#111827", al: "left" });
    for (let i = 0; i < 3; i++) fillRR(g, SW - 58, 136 + i * 10, 34, 4, 2, "#111827");
    // Hero mit Abendhimmel und Dach
    const hy = 182, hh = 330; const sky = g.createLinearGradient(0, hy, 0, hy + hh); sky.addColorStop(0, "#1e3a8a"); sky.addColorStop(0.55, "#f97316"); sky.addColorStop(1, "#fbbf24");
    g.fillStyle = sky; g.fillRect(0, hy, SW, hh);
    const sun = g.createRadialGradient(SW * 0.72, hy + 220, 4, SW * 0.72, hy + 220, 120); sun.addColorStop(0, "rgba(255,248,220,0.95)"); sun.addColorStop(1, "rgba(255,248,220,0)"); g.fillStyle = sun; g.fillRect(0, hy, SW, hh);
    g.fillStyle = "#1c1917"; g.beginPath(); g.moveTo(0, hy + hh); g.lineTo(0, hy + 250); g.lineTo(110, hy + 170); g.lineTo(230, hy + 255); g.lineTo(230, hy + hh); g.closePath(); g.fill();
    g.fillRect(150, hy + 180, 22, 40); g.beginPath(); g.moveTo(200, hy + hh); g.lineTo(200, hy + 270); g.lineTo(300, hy + 215); g.lineTo(SW, hy + 262); g.lineTo(SW, hy + hh); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,210,120,0.9)"; g.fillRect(60, hy + 270, 22, 22); g.fillRect(96, hy + 270, 22, 22); g.fillRect(300, hy + 280, 20, 20);
    const sh = g.createLinearGradient(0, hy, 0, hy + 160); sh.addColorStop(0, "rgba(0,0,0,0.35)"); sh.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sh; g.fillRect(0, hy, SW, 160);
    txt(g, "Ihr Meisterbetrieb", 26, hy + 52, { w: 800, px: 34, fam: "D", c: "#ffffff", al: "left" });
    txt(g, "in der Region", 26, hy + 92, { w: 800, px: 34, fam: "D", c: "#ffffff", al: "left" });
    txt(g, "Zuverlässig. Pünktlich. Sauber.", 26, hy + 132, { w: 500, px: 19, fam: "I", c: "rgba(255,255,255,0.9)", al: "left" });
    // Knopf
    shadow(g, 16, 6, "rgba(31,111,235,0.4)"); fillRR(g, 24, hy + hh + 26, SW - 48, 64, 18, "#1f6feb"); noShadow(g);
    txt(g, "Jetzt anfragen", SW / 2, hy + hh + 59, { w: 700, px: 25, fam: "I", c: "#ffffff" });
    // Karten
    const cy0 = hy + hh + 116; const cols = ["#fee2e2", "#dcfce7", "#dbeafe"], ic = ["#ef4444", "#16a34a", "#2563eb"];
    for (let i = 0; i < 3; i++) { const x = 24 + i * ((SW - 48 - 24) / 3 + 12), w = (SW - 48 - 24) / 3; shadow(g, 14, 4, "rgba(0,0,0,0.08)"); fillRR(g, x, cy0, w, 120, 16, "#ffffff"); noShadow(g);
      circle(g, x + w / 2, cy0 + 40, 22, cols[i]); circle(g, x + w / 2, cy0 + 40, 9, ic[i]); fillRR(g, x + 16, cy0 + 76, w - 32, 9, 4, "#d1d5db"); fillRR(g, x + 24, cy0 + 94, w - 48, 7, 3, "#e5e7eb"); }
    // Textzeilen
    const ty = cy0 + 150; txt(g, "Über uns", 24, ty + 14, { w: 700, px: 24, fam: "D", c: "#111827", al: "left" });
    for (let i = 0; i < 5; i++) fillRR(g, 24, ty + 44 + i * 22, (SW - 48) * (i === 4 ? 0.55 : 0.9 + 0.1 * rnd(i)), 9, 4, "#d6d9df");
    return c;
  }

  // ---------- Risse ----------
  function build() {
    const rays = [], NR = 14; const MAXD = 1000;
    for (let i = 0; i < NR; i++) {
      const a0 = (i / NR) * Math.PI * 2 + (rnd(i * 3.1) - 0.5) * 0.35; let a = a0, x = IX, y = IY, dist = 0; const pts = [[x, y, 0]];
      while (x > -30 && x < SW + 30 && y > -30 && y < SH + 30 && dist < MAXD) {
        const st = 14 + rnd(i * 7 + pts.length) * 26; a += (rnd(i * 11 + pts.length * 1.7) - 0.5) * 0.42; a = lerp(a, a0, 0.25);
        x += Math.cos(a) * st; y += Math.sin(a) * st; dist = Math.hypot(x - IX, y - IY); pts.push([x, y, dist]);
      }
      rays.push({ pts, a0, w: 1 + rnd(i * 5) * 1.6 });
    }
    const pAt = (ray, r) => { const P = ray.pts; for (let k = 1; k < P.length; k++) if (P[k][2] >= r) { const f = (r - P[k - 1][2]) / (P[k][2] - P[k - 1][2] || 1); return [lerp(P[k - 1][0], P[k][0], f), lerp(P[k - 1][1], P[k][1], f)]; } return null; };
    // Ringrisse
    const RADII = [38, 92, 170, 280, 420]; const rings = [];
    RADII.forEach((r, ki) => { for (let i = 0; i < NR; i++) { if (rnd(ki * 31 + i * 7) < (ki === 0 ? 0.05 : 0.3)) continue; const A = pAt(rays[i], r * (0.92 + rnd(i + ki) * 0.16)), B = pAt(rays[(i + 1) % NR], r * (0.92 + rnd(i * 2 + ki) * 0.16)); if (!A || !B) continue;
      const mx_ = (A[0] + B[0]) / 2, my_ = (A[1] + B[1]) / 2; const nx = mx_ - IX, ny = my_ - IY, nl = Math.hypot(nx, ny) || 1; const bow = (rnd(ki * 13 + i) - 0.3) * 18;
      rings.push({ pts: [A, [mx_ + nx / nl * bow + (rnd(i * 9 + ki) - 0.5) * 10, my_ + ny / nl * bow], B], r }); } });
    // Äste
    const br = [];
    rays.forEach((ray, i) => { for (let k = 3; k < ray.pts.length - 2; k += 3) { if (rnd(i * 17 + k) > 0.45) continue; const [x0, y0, d0] = ray.pts[k]; let a = ray.a0 + (rnd(i + k * 3) > 0.5 ? 1 : -1) * (0.45 + rnd(k + i * 5) * 0.5); let x = x0, y = y0; const pts = [[x, y, d0]]; const n = 3 + Math.floor(rnd(i * k) * 5);
      for (let j = 0; j < n; j++) { const st = 12 + rnd(i + j * 7 + k) * 18; a += (rnd(j * 3 + i + k) - 0.5) * 0.5; x += Math.cos(a) * st; y += Math.sin(a) * st; pts.push([x, y, d0 + Math.hypot(x - x0, y - y0)]); } br.push({ pts, w: 0.8 }); } });
    // Splitterflächen zwischen Strahlen und Ringen
    const cells = []; const RR = [0, ...RADII, 1400];
    for (let i = 0; i < NR; i++) for (let k = 0; k < RR.length - 1; k++) {
      const r0 = RR[k], r1 = RR[k + 1]; const A = rays[i].pts.filter((q) => q[2] >= r0 && q[2] <= r1).map((q) => [q[0], q[1]]); const B = rays[(i + 1) % NR].pts.filter((q) => q[2] >= r0 && q[2] <= r1).map((q) => [q[0], q[1]]).reverse();
      const p0 = r0 === 0 ? [[IX, IY]] : [pAt(rays[i], r0)].filter(Boolean), p1 = [pAt(rays[i], r1) || A[A.length - 1]].filter(Boolean), q1 = [pAt(rays[(i + 1) % NR], r1) || B[0]].filter(Boolean), q0 = r0 === 0 ? [] : [pAt(rays[(i + 1) % NR], r0)].filter(Boolean);
      const poly = [...p0, ...A, ...p1, ...q1, ...B, ...q0]; if (poly.length < 3) continue; const s = i * 7 + k * 13; const near = 1 - k / RR.length;
      cells.push({ poly, r: r1, dx: (rnd(s) - 0.5) * 7 * near, dy: (rnd(s + 1) - 0.5) * 7 * near, lum: (rnd(s + 2) - 0.5) * 0.34, k });
    }
    // Glitzerpunkte entlang der Risse
    const glints = []; rays.forEach((ray, i) => ray.pts.forEach((q, k) => { if (rnd(i * 5 + k * 3) < 0.22) glints.push([q[0], q[1], q[2], rnd(i + k * 7) * 6.28, 3 + rnd(i * 3 + k) * 5]); }));
    // fallende Splitter (Weltkoordinaten relativ zum Einschlag)
    const chips = []; for (let i = 0; i < 34; i++) { const a = -Math.PI * (0.15 + rnd(i * 4.3) * 0.7) + (rnd(i) > 0.5 ? 0 : Math.PI * 0.1); const v = 220 + rnd(i * 2.7) * 700;
      chips.push({ vx: Math.cos(a) * v * (rnd(i * 9) > 0.5 ? 1 : -1), vy: Math.sin(a) * v * 0.9, s: 5 + rnd(i * 6.1) * 20, rot: rnd(i * 3) * 6.28, vr: (rnd(i * 8) - 0.5) * 18, z: rnd(i * 5.5), pts: [0, 1, 2, 3].map((j) => [Math.cos(j * 1.7 + rnd(i + j)) * (0.6 + rnd(i * j + 2) * 0.6), Math.sin(j * 1.7 + rnd(i + j)) * (0.6 + rnd(i * j + 2) * 0.6)]) }); }
    // Farbstreifen (Pixelfehler)
    const bars = []; for (let i = 0; i < 7; i++) bars.push({ x: IX + (rnd(i * 4.4) - 0.6) * 300, w: 2 + rnd(i * 2.2) * 9, c: ["#ff00e6", "#00ff9c", "#00e5ff", "#ffffff", "#ffe600", "#ff2d55", "#7c3aed"][i], y0: rnd(i * 3) * 0.3 * SH, t: rnd(i * 6) * 0.5 });
    // Nachknacken: lange Risse vom Rand der Splitterzone nach außen
    const late = []; for (let i = 0; i < 7; i++) { const ray = rays[(i * 2 + 1) % NR]; const q = ray.pts[Math.min(ray.pts.length - 1, 4 + (i % 3))]; let a = Math.atan2(q[1] - IY, q[0] - IX) + (i % 2 ? 0.7 : -0.7); let x = q[0], y = q[1], L = 0; const pts = [[x, y, 0]];
      while (x > -20 && x < SW + 20 && y > -20 && y < SH + 20 && L < 420) { const st = 12 + rnd(i * 13 + pts.length) * 20; a += (rnd(i * 7 + pts.length * 2.3) - 0.5) * 0.5; x += Math.cos(a) * st; y += Math.sin(a) * st; L += st; pts.push([x, y, L]); }
      late.push({ pts, w: 1.2, t: i * 0.05 }); }
    return { rays, rings, br, cells, glints, chips, bars, late };
  }

  function poly(g, pts, R, lw, col) { // Rissline bis Radius R gezeichnet
    g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); let ok = false;
    for (let k = 1; k < pts.length; k++) { const a = pts[k - 1], b = pts[k]; if (b[2] <= R) { g.lineTo(b[0], b[1]); ok = true; } else { if (a[2] < R) { const f = (R - a[2]) / (b[2] - a[2]); g.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); ok = true; } break; } }
    if (ok) g.stroke();
  }
  function crackLines(g, C, R, rv, lite) {
    g.lineCap = "round"; g.lineJoin = "round";
    const pass = (dx, dy, lwM, col) => { g.save(); g.translate(dx, dy);
      for (const r of C.rays) poly(g, r.pts, R, r.w * lwM, col);
      for (const b of C.br) if (b.pts[0][2] < R) poly(g, b.pts, R + 40, b.w * lwM, col);
      for (const ri of C.rings) { const p = cl((R - ri.r) / 90) * rv; if (p <= 0) continue; const P = ri.pts; const L1 = Math.hypot(P[1][0] - P[0][0], P[1][1] - P[0][1]), L2 = Math.hypot(P[2][0] - P[1][0], P[2][1] - P[1][1]); let dd = p * (L1 + L2);
        g.strokeStyle = col; g.lineWidth = 1.1 * lwM; g.beginPath(); g.moveTo(P[0][0], P[0][1]);
        if (dd <= L1) g.lineTo(lerp(P[0][0], P[1][0], dd / L1), lerp(P[0][1], P[1][1], dd / L1)); else { g.lineTo(P[1][0], P[1][1]); dd -= L1; g.lineTo(lerp(P[1][0], P[2][0], dd / L2), lerp(P[1][1], P[2][1], dd / L2)); } g.stroke(); }
      g.restore(); };
    pass(1.2, 1.4, 3.2, "rgba(0,0,0,0.55)"); // Schattenkante
    pass(0, 0, 1.9, "rgba(20,24,32,0.9)");
    pass(-1, -1, 0.9, `rgba(255,255,255,${0.85 * lite})`); // Lichtkante
  }

  TYPES.h_crack = {
    zone: "bottom", pal: "night", bgv: 0, coverT: 1.8,
    prep(sc, p) { sc.st.site = site(p); sc.st.C = build();
      const c = document.createElement("canvas"); c.width = PW + 300; c.height = PH + 300; const g = c.getContext("2d");
      g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 60; g.shadowOffsetX = 4000; fillRR(g, 150 - 4000, 150, PW, PH, PR, "#000"); sc.st.psh = c; },
    draw(g, u, d, p, sc, P) {
      const { tK1, tK2, tC, tL } = timing(d); const C = sc.st.C; const ac = u - tC; const al = tL > 0 ? u - tL : -1;
      // Hintergrund: dunkles Studio mit Lichtkegel
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#03050b"); bg.addColorStop(0.5, "#0a1222"); bg.addColorStop(1, "#04060c"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      const fl = ac >= 0 ? Math.max(0, 1 - ac / 0.5) : 0;
      const sp = g.createRadialGradient(560, 820, 40, 560, 860, 760); sp.addColorStop(0, `rgba(70,130,255,${0.32 + fl * 0.4})`); sp.addColorStop(0.5, "rgba(40,80,200,0.10)"); sp.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sp; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 16; i++) { const x = rnd(i * 3.3) * W, y = 300 + rnd(i * 5.1) * 1300 - u * (10 + rnd(i) * 20), r = 6 + rnd(i * 2.2) * 26; g.fillStyle = `rgba(120,170,255,${0.05 + rnd(i * 7) * 0.08})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
      // Wackeln durch Klopfer und Stoß
      const wob = (t0, A, f) => { const x = u - t0; return x < 0 ? 0 : A * Math.exp(-x * 9) * Math.sin(x * f); };
      const rk = wob(tK1, 0.045, 70) + wob(tK2, 0.07, 66) + wob(tC, 0.05, 55) + (tL > 0 ? wob(tL, 0.02, 60) : 0);
      const shk = ac >= 0 && ac < 0.45 ? 22 * Math.exp(-ac / 0.09) : 0; const sx = Math.sin(u * 93) * shk, sy = Math.cos(u * 71) * shk;
      // Kamera: vor dem Knall langsam heran (Zeitlupe), danach zurück
      const push = inOut(seg(u, tK2, tC)) * 0.08 - outExpo(seg(u, tC, tC + 0.5)) * 0.06;
      const rec = (t0, A) => { const x = u - t0; return x < 0 ? 0 : A * Math.exp(-x * 13) * Math.cos(x * 38); };
      const cx = 540 + sx, cy = 845 + sy + Math.sin(u * 1.4) * 6; const z = (1.07 + push) * (1 - rec(tK1, 0.035) - rec(tK2, 0.06));
      const m = new DOMMatrix().translate(cx, cy).scale(z, z).rotate((-11 + Math.sin(u * 0.9) * 0.6) + rk * 57.3).skewX(7).skewY(-3).scale(0.94, 1);
      // Schatten unter dem Handy
      g.save(); const sh = g.createRadialGradient(560, 1270, 10, 560, 1270, 330); sh.addColorStop(0, "rgba(0,0,0,0.6)"); sh.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sh; g.scale(1, 0.22); g.beginPath(); g.arc(560, 1270 / 0.22, 330, 0, 7); g.fill(); g.restore();
      g.save(); g.setTransform(m);
      // Seitenkante (Tiefe)
      for (let k = 14; k >= 1; k -= 2) { const e = g.createLinearGradient(-PW / 2, 0, PW / 2, 0); e.addColorStop(0, "#1b1d22"); e.addColorStop(0.5, "#3c414b"); e.addColorStop(1, "#15171b"); fillRR(g, -PW / 2 + k, -PH / 2 + k * 0.7, PW, PH, PR, k === 1 ? "#2c3038" : e); }
      g.drawImage(sc.st.psh, -PW / 2 - 150, -PH / 2 - 150 + 30); const bd = g.createLinearGradient(-PW / 2, -PH / 2, PW / 2, PH / 2); bd.addColorStop(0, "#9aa1ad"); bd.addColorStop(0.12, "#3b3f48"); bd.addColorStop(0.5, "#1b1d22"); bd.addColorStop(0.88, "#3b3f48"); bd.addColorStop(1, "#b7bdc8");
      fillRR(g, -PW / 2, -PH / 2, PW, PH, PR, bd);
      fillRR(g, -PW / 2 + 5, -PH / 2 + 5, PW - 10, PH - 10, PR - 5, "#020203");
      // Bildschirm
      g.save(); rr(g, -SW / 2, -SH / 2, SW, SH, SR); g.clip(); g.translate(-SW / 2, -SH / 2);
      const flick = (ac > 0 && ac < 1.2 && rnd(Math.floor(u * 30) * 1.3) > 0.72) || (al >= 0 && al < 0.25 && rnd(Math.floor(u * 30) * 2.1) > 0.4) ? 0.7 : 1;
      g.globalAlpha = flick; g.drawImage(sc.st.site, 0, 0); g.globalAlpha = 1;
      // Klopf-Ring auf dem Glas
      for (const [t0, A] of [[tK1, 0.75], [tK2, 1]]) { const x = u - t0; if (x >= 0 && x < 0.5) { const q = x / 0.5;
        const fg = g.createRadialGradient(IX, IY, 0, IX, IY, 160 * A); fg.addColorStop(0, `rgba(255,255,255,${0.75 * A * Math.max(0, 1 - x / 0.12)})`); fg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = fg; g.fillRect(0, 0, SW, SH);
        for (let j = 0; j < 2; j++) { const qq = q - j * 0.18; if (qq <= 0) continue; g.strokeStyle = `rgba(255,255,255,${A * (1 - qq) * (1 - qq)})`; g.lineWidth = 9 * (1 - qq) + 1; g.beginPath(); g.arc(IX, IY, 12 + out3(qq) * 190 * A, 0, 7); g.stroke(); } } }
      // Risse
      const chipR = 30 * out3(seg(u, tK2, tK2 + 0.06)); const R = Math.max(chipR, ac >= 0 ? 1000 * outExpo(seg(ac, 0, 0.42)) : 0);
      if (ac >= 0) {
        // versetzte Splitterflächen
        const done = R >= 990; if (done && !sc.st.cc) { const cc = document.createElement("canvas"); cc.width = SW; cc.height = SH; const q = cc.getContext("2d"); q.drawImage(sc.st.site, 0, 0); this.cells(q, C, 2000, sc.st.site); sc.st.cc = cc; }
        if (done) { g.globalAlpha = flick; g.drawImage(sc.st.cc, 0, 0); g.globalAlpha = 1; } else this.cells(g, C, R, sc.st.site);
        // ausgelaufene Pixel um den Einschlag
        const ink = out3(seg(ac, 0.05, 1.4)); if (ink > 0) { const ir = 40 + ink * 150; const ig = g.createRadialGradient(IX, IY, 0, IX, IY, ir); ig.addColorStop(0, "rgba(0,0,0,0.92)"); ig.addColorStop(0.55, "rgba(10,0,25,0.75)"); ig.addColorStop(0.8, "rgba(120,0,255,0.25)"); ig.addColorStop(0.92, "rgba(0,255,170,0.18)"); ig.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = ig; g.fillRect(0, 0, SW, SH); }
        // Farbstreifen und Zeilenversatz
        for (const [bi, b] of C.bars.entries()) { if (ac < b.t * 0.6 + 0.04) continue; if (bi >= 5 && tL > 0 && al < 0.05) continue; const on = rnd(Math.floor(u * 15) + b.x) > 0.25 ? 1 : 0.3; g.globalAlpha = 0.85 * on; g.fillStyle = b.c; g.fillRect(b.x, b.y0, b.w, SH - b.y0); }
        g.globalAlpha = 1;
        if (ac < 1.3) for (let i = 0; i < 4; i++) { const fr = Math.floor(u * 20); if (rnd(fr * 3 + i) < 0.55) continue; const y = rnd(fr * 7 + i) * SH, h = 8 + rnd(fr + i * 9) * 40, dx = (rnd(fr * 5 + i) - 0.5) * 70; g.drawImage(sc.st.site, 0, y, SW, h, dx, y, SW, h); g.fillStyle = "rgba(255,0,200,0.18)"; g.fillRect(0, y, SW, 2); }
      }
      if (R > 0) crackLines(g, C, R, 1, 1);
      if (al >= 0) { g.lineCap = "round"; g.lineJoin = "round"; for (const l of C.late) { const LR = 420 * outExpo(seg(al, l.t, l.t + 0.32)); if (LR <= 0) continue;
        g.save(); g.translate(1, 1.2); poly(g, l.pts, LR, 3.6, "rgba(0,0,0,0.5)"); g.restore(); poly(g, l.pts, LR, 2.2, "rgba(20,24,32,0.9)"); g.save(); g.translate(-1, -1); poly(g, l.pts, LR, 1, "rgba(255,255,255,0.85)"); g.restore(); } }
      // Einschlagpunkt: zertrümmertes Glas
      if (ac >= 0 || chipR > 0) { const s = ac >= 0 ? 1 : 0.4; const wg = g.createRadialGradient(IX, IY, 0, IX, IY, 40 * s); wg.addColorStop(0, "rgba(255,255,255,0.95)"); wg.addColorStop(0.5, "rgba(220,235,255,0.5)"); wg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = wg; g.beginPath(); g.arc(IX, IY, 40 * s, 0, 7); g.fill();
        g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 1; for (let i = 0; i < 26 * s; i++) { const a = rnd(i * 2.1) * 6.28, r0 = 4 + rnd(i * 3.7) * 10, r1 = r0 + 6 + rnd(i * 5.3) * 22 * s; g.beginPath(); g.moveTo(IX + Math.cos(a) * r0, IY + Math.sin(a) * r0); g.lineTo(IX + Math.cos(a + 0.2) * r1, IY + Math.sin(a + 0.2) * r1); g.stroke(); } }
      // Glitzern
      if (ac >= 0) { g.globalCompositeOperation = "lighter"; for (const q of C.glints) { if (q[2] > R) continue; const s = Math.pow(Math.max(0, Math.sin(u * 7 + q[3])), 8) * q[4] * (1 + fl * 2); if (s < 0.4) continue;
        g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.moveTo(q[0], q[1] - s * 2.4); g.quadraticCurveTo(q[0], q[1], q[0] + s * 2.4, q[1]); g.quadraticCurveTo(q[0], q[1], q[0], q[1] + s * 2.4); g.quadraticCurveTo(q[0], q[1], q[0] - s * 2.4, q[1]); g.quadraticCurveTo(q[0], q[1], q[0], q[1] - s * 2.4); g.fill(); } g.globalCompositeOperation = "source-over"; }
      // Spiegelung: Glanzband wandert leicht
      const gx = -260 + Math.sin(u * 0.8) * 30 + push * 300; const gl = g.createLinearGradient(gx, -100, gx + 380, 220); gl.addColorStop(0, "rgba(255,255,255,0)"); gl.addColorStop(0.45, "rgba(255,255,255,0.0)"); gl.addColorStop(0.5, "rgba(255,255,255,0.20)"); gl.addColorStop(0.62, "rgba(255,255,255,0.05)"); gl.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gl; g.fillRect(0, 0, SW, SH);
      const gl2 = g.createLinearGradient(0, 0, SW, SH); gl2.addColorStop(0, "rgba(255,255,255,0.10)"); gl2.addColorStop(0.3, "rgba(255,255,255,0)"); g.fillStyle = gl2; g.fillRect(0, 0, SW, SH);
      // Blitz beim Bruch
      if (fl > 0) { const fg = g.createRadialGradient(IX, IY, 0, IX, IY, 500); fg.addColorStop(0, `rgba(255,255,255,${fl})`); fg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = fg; g.fillRect(0, 0, SW, SH); }
      g.restore();
      // Kamera-Loch und Rahmenglanz
      circle(g, 0, -SH / 2 + 26, 10, "#050507");
      g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 2; rr(g, -PW / 2 + 1, -PH / 2 + 1, PW - 2, PH - 2, PR - 1); g.stroke();
      const imp = m.transformPoint(new DOMPoint(IX - SW / 2, IY - SH / 2));
      g.restore();
      // Druckwelle in der Luft
      if (ac >= 0 && ac < 0.6) { const q = ac / 0.6; g.strokeStyle = `rgba(200,225,255,${0.7 * (1 - q)})`; g.lineWidth = 16 * (1 - q) + 2; g.beginPath(); g.arc(imp.x, imp.y, 30 + outExpo(q) * 620, 0, 7); g.stroke(); }
      // fallende Splitter
      if (ac >= 0) for (const c of C.chips) { const t = ac; if (t > 2.2) break; const x = imp.x + c.vx * t, y = imp.y + c.vy * t + 1500 * t * t; if (y > H + 50) continue; const s = c.s * (1 + c.z * t * 1.6);
        g.save(); g.translate(x, y); g.rotate(c.rot + c.vr * t); g.globalAlpha = cl(1.6 - t * 0.7); g.beginPath(); c.pts.forEach((q, j) => (j ? g.lineTo(q[0] * s, q[1] * s) : g.moveTo(q[0] * s, q[1] * s))); g.closePath();
        const tw = 0.5 + 0.5 * Math.sin(t * 20 + c.rot * 5); g.fillStyle = `rgba(${200 + tw * 55},${225 + tw * 30},255,${0.35 + tw * 0.4})`; g.fill(); g.strokeStyle = `rgba(255,255,255,${0.5 + tw * 0.5})`; g.lineWidth = 1.5; g.stroke(); g.restore(); }
      // optionaler Text
      if (p.crack_text && ac > 0.15) { const k = outBack(seg(ac, 0.15, 0.45), 2.4); g.save(); g.translate(540, 1235); g.rotate(-0.07); g.scale(k, k); const s = String(p.crack_text); const px = fitPx(g, s, 820, 120, 900, "D");
        shadow(g, 40, 10, "rgba(0,0,0,0.6)"); font(g, 900, px, "D"); g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round"; g.lineWidth = 14; g.strokeStyle = "#0a0d16"; g.strokeText(s, 0, 0); noShadow(g); txt(g, s, 0, 0, { w: 900, px, c: "#ff3b30" }); g.restore(); }
    },
    cells(g, C, R, site) {
      for (const c of C.cells) { const k = cl((R - c.r) / 60 + 1); if (k <= 0) continue; g.save(); g.beginPath(); g.moveTo(c.poly[0][0], c.poly[0][1]); for (const q of c.poly) g.lineTo(q[0], q[1]); g.closePath(); g.clip();
          g.drawImage(site, c.dx * k, c.dy * k); g.fillStyle = c.lum > 0 ? `rgba(255,255,255,${c.lum * k * 0.6})` : `rgba(0,0,0,${-c.lum * k * 0.8})`; g.fillRect(0, 0, SW, SH);
          if (c.k <= 1) { g.fillStyle = `rgba(230,240,255,${0.25 * k})`; g.fillRect(0, 0, SW, SH); } g.restore(); }
    },
    ev(d, p) {
      const { tK1, tK2, tC } = timing(d);
      const { tL } = timing(d); const E = tL > 0 ? [[tL, "h_crack_creak", 0.8, 0.15]] : [];
      return [...E, [tK1, "h_crack_knock", 0.85, 0.1], [tK2, "h_crack_knock2", 1.0, 0.1], [tC - 0.36, "h_crack_tension", 0.55, 0], [tC, "h_crack_break", 1.0, 0.05], [tC + 0.05, "h_crack_glitch", 0.55, -0.2]];
    },
  };
})();
