// VOICE_DELAY: 0.5
// h_gastro: emotionales Kino-Reel für Gastronomen (Look "cinema"). Regennacht, ein Wirt allein, von jeder Plattform-Bestellung
// wird ein Stück Pizza abgeschnitten (bis zu 30 Prozent, laut Berichten bei Lieferung durch Lieferando). Stammgäste ziehen zur
// Plattform. „Für wen koche ich eigentlich?“ Dann geht das Licht an: eigene Seite, eigener Name, Bestellungen fliegen ins Lokal.
// Danach Szene gastro_end (Filmtitel Mihajlo Systems, kein Neon, kein Logo-Quadrat).
// Wörter: kennen, küche, bestellung, 30, prozent, weg, stammgäste, plattform, monats, wen, eigentlich, wäre, direkt, seite, namen.
(() => {
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  const AMBER = "#ffb35c", WARM = "#ffd9a0", RED = "#ff4b4b", COLD = "#5f7cff", CREAM = "#f6ecdc";
  const NAME = "BEI MARCO";
  function rain(g, u, a, n = 90) { if (a <= 0) return; g.save(); g.strokeStyle = `rgba(200,215,255,${0.35 * a})`; g.lineWidth = 2; for (let i = 0; i < n; i++) { const x = (rnd(i * 3.1) * 1300 + u * 140) % 1300 - 110, y = (rnd(i * 7.7) * 2100 + u * (1500 + rnd(i) * 600)) % 2100 - 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 10, y + 46); g.stroke(); } g.restore(); }
  function grade(g, warm, dark) { if (warm > 0) { g.fillStyle = `rgba(255,150,60,${0.12 * warm})`; g.fillRect(0, 0, W, H); } const vg = g.createRadialGradient(540, 900, 300, 540, 960, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${0.75 * dark})`); g.fillStyle = vg; g.fillRect(0, 0, W, H); }
  function chefSil(g, x, y, s, o = {}) { // Silhouette mit Kochmütze, Füße bei y
    g.save(); g.translate(x, y); g.scale(s * (o.flip ? -1 : 1), s); g.fillStyle = o.col || "#0b0806";
    rr(g, -34, -210, 68, 140, 26); g.fill(); g.fillRect(-30, -80, 24, 80); g.fillRect(6, -80, 24, 80);
    g.beginPath(); g.arc(0, -240, 30, 0, 7); g.fill(); rr(g, -26, -300, 52, 40, 8); g.fill(); g.beginPath(); g.arc(-16, -300, 20, 0, 7); g.arc(16, -300, 20, 0, 7); g.arc(0, -312, 22, 0, 7); g.fill();
    const a = o.arm || 0; g.lineWidth = 20; g.lineCap = "round"; g.strokeStyle = g.fillStyle; g.beginPath(); g.moveTo(20, -190); g.lineTo(20 + Math.cos(a) * 70, -190 + Math.sin(a) * 70); g.stroke();
    if (o.sit) { g.fillRect(-30, -80, 80, 22); }
    g.restore(); }
  function pizza(g, x, y, r, cutA, cutK, t) { // cutA: Winkel des Stücks, cutK: 0..1 wie weit es weggezogen ist
    g.save(); g.translate(x, y);
    const draw = (a0, a1) => { g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, a0, a1); g.closePath(); g.fillStyle = "#e3a24d"; g.fill(); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r * 0.86, a0, a1); g.closePath(); g.fillStyle = "#c63a24"; g.fill();
      for (let i = 0; i < 14; i++) { const aa = rnd(i * 4.1) * Math.PI * 2, rrd = r * (0.15 + rnd(i * 2.7) * 0.6); let A = aa; const inside = ((A - a0) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) < ((a1 - a0) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2 + 1e-9); if (!inside) continue; circle(g, Math.cos(A) * rrd, Math.sin(A) * rrd, r * 0.09, "#fff1d6"); }
      for (let i = 0; i < 6; i++) { const A = rnd(i * 9.3) * Math.PI * 2, rd = r * (0.2 + rnd(i) * 0.5); const inside = ((A - a0) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) < ((a1 - a0) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2 + 1e-9); if (inside) circle(g, Math.cos(A) * rd, Math.sin(A) * rd, r * 0.04, "#3c8a46"); } };
    const s0 = -Math.PI / 2, sA = cutA; draw(s0 + sA, s0 + Math.PI * 2);
    if (cutK < 1) { const mid = s0 + sA / 2; g.save(); g.translate(Math.cos(mid) * cutK * 600, Math.sin(mid) * cutK * 600 - cutK * 200); g.rotate(cutK * 1.5); g.globalAlpha = 1 - cutK; draw(s0, s0 + sA);
      if (t > 0) { g.strokeStyle = `rgba(255,75,75,${t})`; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r + 6, s0, s0 + sA); g.closePath(); g.stroke(); } g.restore(); }
    g.restore(); }
  function phone(g, x, y, s, rot, fn) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); shadow(g, 30, 10, "rgba(0,0,0,0.5)"); fillRR(g, -70, -140, 140, 280, 24, "#0d0d10"); noShadow(g); fillRR(g, -62, -130, 124, 260, 18, "#1c1c22"); fn && fn(); g.restore(); }
  function heart(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c; g.beginPath(); g.moveTo(0, 10); g.bezierCurveTo(-18, -2, -12, -18, 0, -8); g.bezierCurveTo(12, -18, 18, -2, 0, 10); g.fill(); g.restore(); }
  function receipt(g, x, y, s, rot, line, c) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); shadow(g, 20, 6, "rgba(0,0,0,0.4)"); g.fillStyle = CREAM; g.beginPath(); g.moveTo(-60, -90); g.lineTo(60, -90); g.lineTo(60, 80); for (let i = 0; i < 6; i++) g.lineTo(60 - i * 20 - 10, 90 - (i % 2) * 10); g.lineTo(-60, 80); g.closePath(); g.fill(); noShadow(g);
    g.fillStyle = "rgba(0,0,0,0.25)"; for (let i = 0; i < 4; i++) g.fillRect(-44, -66 + i * 22, 70 + (i % 2) * 18, 7); if (line) txt(g, line, 0, 50, { w: 900, px: 28, c: c || "#222", fam: "I" }); g.restore(); }
  function facade(g, x, y, s, lit, u, o = {}) { // Restaurant von außen, Mitte unten bei (x, y)
    g.save(); g.translate(x, y); g.scale(s, s);
    g.fillStyle = "#1a1310"; g.fillRect(-460, -1100, 920, 1100); for (let r = 0; r < 44; r++) for (let c = 0; c < 12; c++) { if ((r * 5 + c * 3) % 7) continue; g.fillStyle = "rgba(255,255,255,0.03)"; g.fillRect(-460 + c * 80 + (r % 2) * 40, -1100 + r * 25, 74, 20); }
    // Schild
    const sl = o.sign || 0; fillRR(g, -300, -1010, 600, 120, 16, "#0e0a08"); if (sl > 0) { g.save(); g.shadowColor = `rgba(255,217,160,${sl})`; g.shadowBlur = 50; txt(g, NAME, 0, -948, { w: 400, px: 84, c: `rgba(255,236,205,${0.25 + 0.75 * sl})`, fam: "S" }); g.restore(); } else txt(g, NAME, 0, -948, { w: 400, px: 84, c: "rgba(255,236,205,0.12)", fam: "S" });
    // Markise
    for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? "#5b1a14" : "#7a2418"; g.beginPath(); g.moveTo(-420 + i * 84, -860); g.lineTo(-336 + i * 84, -860); g.lineTo(-336 + i * 84, -790); g.arc(-378 + i * 84, -790, 42, 0, Math.PI); g.closePath(); g.fill(); }
    // Fenster mit Innenlicht
    const win = g.createLinearGradient(0, -720, 0, -180); win.addColorStop(0, `rgba(255,170,80,${0.25 + 0.6 * lit})`); win.addColorStop(1, `rgba(255,120,40,${0.15 + 0.5 * lit})`); g.fillStyle = "#0a0706"; g.fillRect(-400, -740, 800, 580); g.fillStyle = win; g.fillRect(-380, -720, 760, 540);
    g.strokeStyle = "#2a1d16"; g.lineWidth = 16; g.strokeRect(-390, -730, 780, 560); g.beginPath(); g.moveTo(0, -730); g.lineTo(0, -170); g.stroke();
    if (o.inside) o.inside(g);
    g.fillStyle = "#120d0a"; g.fillRect(-460, -150, 920, 150);
    g.restore(); }

  TYPES.h_gastro = {
    zone: "top", pal: "c_warm", bgv: 0, coverT: 7.0, capY: 1450,
    prep(o, p) { const W0 = (SPEC.words || []).filter((w) => w.scene === o.i); const f = (re, after = 0, def = null) => { const w = W0.find((x) => x.t - o.t0 >= after - 1e-6 && re.test(norm(x.w))); return w ? w.t - o.t0 : def; };
      const T = {}; T.kennen = f(/^kennen/, 0, 1.6); T.kueche = f(/^küche/, T.kennen, T.kennen + 2.0); T.best = f(/^bestellung/, T.kueche, T.kueche + 1.0); T.p30 = f(/^30$/, T.best, T.best + 2.0); T.proz = f(/^prozent/, T.p30, T.p30 + 0.5); T.weg = f(/^weg/, T.proz, T.proz + 0.5);
      T.stamm = f(/^stammgäste/, T.weg, T.weg + 0.8); T.platt = f(/^plattform/, T.stamm, T.stamm + 1.2); T.monat = f(/^monats/, T.platt, T.platt + 1.2); T.wen = f(/^wen$/, T.monat, T.monat + 1.5); T.eig = f(/^eigentlich/, T.wen, T.wen + 0.6);
      T.waere = f(/^wäre/, T.eig, T.eig + 1.2); T.direkt = f(/^direkt/, T.waere, T.waere + 1.2); T.seite = f(/^seite/, T.direkt, T.direkt + 1.4); T.namen = f(/^namen/, T.seite, T.seite + 0.8); p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const shot = u < T.kueche - 0.3 ? "A" : u < T.best - 0.25 ? "B" : u < T.stamm - 0.25 ? "C" : u < T.monat - 0.25 ? "D" : u < T.waere - 0.15 ? "E" : "F";
      g.fillStyle = "#050404"; g.fillRect(0, 0, W, H);
      if (shot === "A") { // Regennacht draußen
        const z = 1 + 0.25 * inOut(cl(u / Math.max(1, T.kueche - 0.3))); g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-540, -960);
        const sky = g.createLinearGradient(0, 0, 0, 1300); sky.addColorStop(0, "#06080f"); sky.addColorStop(1, "#141018"); g.fillStyle = sky; g.fillRect(-200, -200, 1500, 1500);
        facade(g, 540, 1320, 0.95, 0.7, u, { inside: (q) => { chefSil(q, -60 + Math.sin(u * 0.8) * 60, -190, 1.25, { col: "#1a0e08", arm: -0.4 + Math.sin(u * 4) * 0.5 }); } });
        // Straße, Pfütze mit Spiegelung
        g.fillStyle = "#08070a"; g.fillRect(-200, 1320, 1500, 800); const rf = g.createLinearGradient(0, 1330, 0, 1700); rf.addColorStop(0, "rgba(255,150,60,0.25)"); rf.addColorStop(1, "rgba(255,150,60,0)"); g.fillStyle = rf; g.fillRect(170, 1330, 740, 400);
        for (let i = 0; i < 8; i++) { const r = ((u * 0.8 + i * 0.37) % 1); g.strokeStyle = `rgba(255,200,150,${0.3 * (1 - r)})`; g.lineWidth = 2; g.beginPath(); g.ellipse(200 + rnd(i * 3) * 700, 1400 + rnd(i * 5) * 300, 20 + r * 60, 6 + r * 16, 0, 0, 7); g.stroke(); }
        // Laterne
        g.fillStyle = "#0a0a0c"; g.fillRect(70, 520, 14, 800); const lg = g.createRadialGradient(77, 520, 5, 77, 520, 260); lg.addColorStop(0, "rgba(255,210,150,0.55)"); lg.addColorStop(1, "rgba(255,210,150,0)"); g.fillStyle = lg; g.fillRect(-200, 260, 560, 560); circle(g, 77, 520, 14, "#ffe4b8");
        g.restore(); rain(g, u, 1); grade(g, 0.4, 1);
        const lf = Math.max(1 - cl(u / 0.12), 0.7 * (1 - cl(Math.abs(u - 0.32) / 0.08))); if (lf > 0) { g.fillStyle = `rgba(220,230,255,${0.75 * lf})`; g.fillRect(0, 0, W, H); }
      } else if (shot === "B") { // Küche, bis spät
        const su = u - (T.kueche - 0.3); g.save(); const z = 1.05 + 0.04 * su; g.translate(540 + Math.sin(u * 1.3) * 6, 960); g.scale(z, z); g.translate(-540, -960);
        const bg = g.createRadialGradient(560, 1000, 50, 560, 1000, 900); bg.addColorStop(0, "#3a1e0e"); bg.addColorStop(1, "#060403"); g.fillStyle = bg; g.fillRect(-100, -100, 1300, 2200);
        // Herd mit Flammen
        fillRR(g, 260, 1140, 600, 60, 8, "#1a120d"); for (let i = 0; i < 3; i++) { const fx = 360 + i * 200; for (let k = 0; k < 7; k++) { const h = 30 + 30 * (0.5 + 0.5 * Math.sin(u * 22 + k * 1.7 + i)); g.fillStyle = k % 2 ? "rgba(255,150,40,0.85)" : "rgba(90,140,255,0.8)"; g.beginPath(); g.moveTo(fx - 30 + k * 10, 1140); g.quadraticCurveTo(fx - 35 + k * 10, 1140 - h, fx - 25 + k * 10, 1140 - h * 1.3); g.quadraticCurveTo(fx - 20 + k * 10, 1140 - h, fx - 20 + k * 10, 1140); g.fill(); } }
        fillRR(g, 300, 1060, 140, 40, 10, "#2b211b"); fillRR(g, 500, 1050, 160, 50, 12, "#2b211b");
        for (let i = 0; i < 6; i++) { const t = (u * 0.5 + i / 6) % 1; g.fillStyle = `rgba(255,230,210,${0.14 * (1 - t)})`; g.beginPath(); g.arc(380 + i * 40 + Math.sin(u + i) * 30, 1040 - t * 500, 30 + t * 80, 0, 7); g.fill(); }
        // Pfannen an der Wand
        for (let i = 0; i < 4; i++) { const px = 180 + i * 220, sw = Math.sin(u * 1.5 + i) * 0.05; g.save(); g.translate(px, 380); g.rotate(sw); g.fillStyle = "#120c09"; g.fillRect(-3, 0, 6, 60); g.beginPath(); g.arc(0, 130, 70, 0, 7); g.fill(); g.restore(); }
        chefSil(g, 820, 1500, 2.2, { flip: true, arm: Math.PI + 0.3 + Math.sin(u * 7) * 0.4, col: "#070504" });
        // Uhr läuft auf spät
        const cx = 820, cy = 300, r = 90; circle(g, cx, cy, r, "#e8dcc8"); g.strokeStyle = "#1a120d"; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, r - 4, 0, 7); g.stroke(); const hr = 21 + cl(su / 2.5) * 2.8, mn = (hr % 1) * Math.PI * 2; g.lineCap = "round"; g.lineWidth = 8; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin((hr / 12) * Math.PI * 2) * 50, cy - Math.cos((hr / 12) * Math.PI * 2) * 50); g.stroke(); g.lineWidth = 5; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.sin(mn * 1) * 72, cy - Math.cos(mn) * 72); g.stroke();
        g.restore(); grade(g, 1, 1);
      } else if (shot === "C") { // Pizza, Stück wird abgeschnitten
        const su = u - (T.best - 0.25); const bg = g.createRadialGradient(540, 900, 50, 540, 900, 900); bg.addColorStop(0, "#2a1a10"); bg.addColorStop(1, "#050403"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
        const z = 1 + 0.05 * su; g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-540, -960);
        fillRR(g, 170, 640, 740, 640, 40, "#5a3a22"); g.fillStyle = "rgba(0,0,0,0.25)"; for (let i = 0; i < 8; i++) g.fillRect(170, 680 + i * 76, 740, 3);
        // Tablet mit Plattform-Bestellungen (neutral, kein Markenlogo)
        const pings = [T.best - 0.1, T.best + 0.45, T.best + 1.0]; pings.forEach((t, i) => { const k = outBack(seg(u, t, t + 0.3), 2); if (k <= 0) return; const fl = out3(seg(u, T.weg, T.weg + 0.8)); receipt(g, 240 + i * 300, 330 - fl * 900 + Math.sin(u * 2 + i) * 6, 0.9 * k, (i - 1) * 0.12, u > T.proz ? "−30 %" : "Neue Bestellung", u > T.proz ? RED : "#222"); });
        const cutA = Math.PI * 2 * 0.3, mark = seg(u, T.p30 - 0.2, T.p30 + 0.2), away = inExpo(seg(u, T.weg - 0.1, T.weg + 0.5)); pizza(g, 540, 960, 270, cutA, away, mark);
        if (mark > 0 && away < 1) { g.save(); g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 6; const kn = seg(u, T.p30 - 0.2, T.p30 + 0.1); g.beginPath(); g.moveTo(540, 960); g.lineTo(540 + Math.cos(-Math.PI / 2 + cutA) * 300 * kn, 960 + Math.sin(-Math.PI / 2 + cutA) * 300 * kn); g.stroke(); g.restore(); }
        const nk = outBack(seg(u, T.proz - 0.15, T.proz + 0.2), 2.4); if (nk > 0) { g.save(); g.translate(540, 575); g.scale(nk, nk); g.shadowColor = "rgba(255,75,75,0.8)"; g.shadowBlur = 50; txt(g, "−30 %", 0, 0, { w: 400, px: 170, c: RED, fam: "S" }); g.restore(); }
        g.restore(); grade(g, 0.6, 1);
      } else if (shot === "D") { // Stammgäste ziehen zur Plattform
        const su = u - (T.stamm - 0.25); const bend = inOut(seg(u, T.platt - 0.4, T.platt + 0.3)); g.fillStyle = "#07070b"; g.fillRect(0, 0, W, H);
        // Lokal links (warm), Plattform rechts (kalt)
        const dim = 1 - 0.7 * bend; g.save(); g.translate(250, 1000); g.fillStyle = `rgba(255,179,92,${0.15 * dim})`; g.beginPath(); g.arc(0, 0, 220, 0, 7); g.fill(); g.fillStyle = `rgba(40,26,18,1)`; g.beginPath(); g.moveTo(-120, 60); g.lineTo(-120, -60); g.lineTo(0, -150); g.lineTo(120, -60); g.lineTo(120, 60); g.closePath(); g.fill(); g.fillStyle = `rgba(255,179,92,${0.9 * dim})`; g.fillRect(-60, -40, 120, 80); txt(g, "IHR LOKAL", 0, 120, { w: 800, px: 30, c: `rgba(255,217,160,${dim})`, fam: "I", ls: 4 }); g.restore();
        const pk = out3(seg(u, T.platt - 0.3, T.platt + 0.2)); if (pk > 0) { g.save(); g.translate(830, 1000); g.scale(pk, pk); g.fillStyle = "rgba(95,124,255,0.18)"; g.beginPath(); g.arc(0, 0, 260, 0, 7); g.fill(); fillRR(g, -120, -120, 240, 240, 48, "#1b2450"); g.strokeStyle = COLD; g.lineWidth = 4; rr(g, -120, -120, 240, 240, 48); g.stroke(); txt(g, "PLATTFORM", 0, 180, { w: 800, px: 30, c: "#b8c6ff", fam: "I", ls: 4 }); g.restore(); }
        // Gäste mit Handys, Herzen fliegen
        for (let i = 0; i < 6; i++) { const gx = 160 + (i % 3) * 380, gy = i < 3 ? 520 : 1460; const k = out3(seg(u, T.stamm - 0.2 + i * 0.08, T.stamm + 0.2 + i * 0.08)); if (k <= 0) continue; phone(g, gx, gy, 0.6 * k, (i - 2.5) * 0.06, null);
          for (let h = 0; h < 3; h++) { const t = ((su * 0.8 + h / 3 + i * 0.13) % 1); const tx = lerp(250, 830, bend), ty = 1000; const cxp = lerp(gx, tx, t) + Math.sin(t * Math.PI) * (gx < 540 ? -80 : 80), cyp = lerp(gy, ty, t) - Math.sin(t * Math.PI) * 120; heart(g, cxp, cyp, 1.6, bend > 0.5 ? COLD : AMBER); } }
        grade(g, 0, 1);
      } else if (shot === "E") { // allein am Tisch
        const su = u - (T.monat - 0.25); const z = 1 + 0.18 * inOut(seg(u, T.wen - 0.3, T.eig + 0.6)); g.save(); g.translate(540, 1000); g.scale(z, z); g.translate(-540, -1000);
        const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0b0a0d"); bg.addColorStop(1, "#050405"); g.fillStyle = bg; g.fillRect(-200, -200, 1500, 2400);
        // Fenster mit Regen hinten
        g.fillStyle = "#0e1424"; g.fillRect(120, 300, 840, 560); g.strokeStyle = "#1c1612"; g.lineWidth = 14; g.strokeRect(120, 300, 840, 560); g.save(); g.beginPath(); g.rect(120, 300, 840, 560); g.clip(); rain(g, u, 0.8, 60); g.restore();
        // Stühle hochgestellt
        for (let i = 0; i < 3; i++) { const tx = 180 + i * 360; g.fillStyle = "#16100c"; g.fillRect(tx - 70, 1150, 140, 16); g.fillRect(tx - 6, 1166, 12, 150); g.save(); g.translate(tx - 30, 1150); g.rotate(Math.PI); g.fillRect(-30, 0, 60, 10); g.fillRect(-30, 0, 8, 90); g.fillRect(22, 0, 8, 90); g.restore(); }
        // Lampe pendelt, Lichtkegel
        const sw = Math.sin(u * 1.1) * 0.12; const lx = 540 + Math.sin(sw) * 520, ly = 200 + Math.cos(sw) * 520; g.strokeStyle = "#1a1a1a"; g.lineWidth = 3; g.beginPath(); g.moveTo(540, 200); g.lineTo(lx, ly); g.stroke();
        const cone = g.createRadialGradient(lx, ly, 10, lx, ly + 500, 520); cone.addColorStop(0, "rgba(255,200,130,0.5)"); cone.addColorStop(1, "rgba(255,200,130,0)"); g.fillStyle = cone; g.beginPath(); g.moveTo(lx - 30, ly); g.lineTo(lx + 30, ly); g.lineTo(lx + 330, ly + 760); g.lineTo(lx - 330, ly + 760); g.closePath(); g.fill(); circle(g, lx, ly + 10, 16, "#ffe2b0");
        // Wirt sitzt, Kopf gesenkt, Belege vor sich
        fillRR(g, 300, 1250, 480, 22, 6, "#2a1c13"); g.fillStyle = "#1e140e"; g.fillRect(530, 1272, 20, 200); receipt(g, 450, 1235, 0.45, -0.2, "", ""); receipt(g, 560, 1238, 0.45, 0.15, "", "");
        chefSil(g, 640, 1480, 1.7, { col: "#090606", arm: Math.PI * 0.85, sit: true });
        // Kalender: Monatsende
        const ck = seg(u, T.monat - 0.2, T.monat + 0.3); fillRR(g, 80, 960, 150, 170, 10, "#e8dcc8"); g.fillStyle = "#8a2318"; g.fillRect(80, 960, 150, 44); txt(g, String(Math.round(lerp(28, 31, ck))), 155, 1075, { w: 400, px: 80, c: "#1a120d", fam: "S" });
        g.restore(); const des = seg(u, T.wen - 0.3, T.eig + 0.3); grade(g, 0.2, 1 + 0.3 * des); if (des > 0) { g.fillStyle = `rgba(20,20,30,${0.35 * des})`; g.fillRect(0, 0, W, H); }
      } else { // F: das Licht geht an
        const su = u - (T.waere - 0.15); const on = out3(seg(u, T.waere, T.waere + 0.5)); const z = 1.2 - 0.18 * inOut(seg(u, T.waere, d)); g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-540, -960);
        const sky = g.createLinearGradient(0, 0, 0, 1300); sky.addColorStop(0, "#0a1024"); sky.addColorStop(1, "#2a1a24"); g.fillStyle = sky; g.fillRect(-200, -200, 1500, 1600);
        for (let i = 0; i < 40; i++) circle(g, rnd(i * 2.3) * 1080, rnd(i * 5.1) * 500, 1.5 + rnd(i) * 1.5, `rgba(255,255,255,${on * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(u * 3 + i)))})`);
        facade(g, 540, 1320, 0.95, 0.3 + 0.7 * on, u, { sign: seg(u, T.namen - 0.1, T.namen + 0.2) * (0.92 + 0.08 * Math.sin(u * 20)), inside: (q) => { for (let i = 0; i < 4; i++) { const k = outBack(seg(u, T.direkt + i * 0.15, T.direkt + 0.3 + i * 0.15), 2); if (k <= 0) continue; q.save(); q.globalAlpha = k; chefSil(q, -280 + i * 180, -190, 0.9, { col: "#2a150a" }); q.restore(); } chefSil(q, 260, -190, 1.25, { col: "#1a0e08", arm: -1.2 + Math.sin(u * 6) * 0.3 }); } });
        g.fillStyle = "#0b0909"; g.fillRect(-200, 1320, 1500, 800); const rf = g.createLinearGradient(0, 1330, 0, 1800); rf.addColorStop(0, `rgba(255,170,80,${0.35 * on})`); rf.addColorStop(1, "rgba(255,170,80,0)"); g.fillStyle = rf; g.fillRect(140, 1330, 800, 480);
        g.restore();
        // Bestellungen fliegen hinein
        for (let i = 0; i < 7; i++) { const t0 = T.direkt - 0.2 + i * 0.22, k = seg(u, t0, t0 + 1.0); if (k <= 0 || k >= 1) continue; const sx = i % 2 ? 1180 : -100, sy = 300 + rnd(i * 4.4) * 1200; const x = lerp(sx, 540, inOut(k)), y = lerp(sy, 900, inOut(k)) - Math.sin(k * Math.PI) * 200; g.save(); g.globalAlpha = 1 - k * k; receipt(g, x, y, 0.55, (i - 3) * 0.1 + k, "+ Bestellung", "#1a7a42"); g.restore(); }
        // Handy mit eigener Seite
        const pk = out3(seg(u, T.seite - 0.25, T.seite + 0.15)) * (1 - seg(u, T.namen + 0.4, T.namen + 0.8)); if (pk > 0) { g.save(); g.globalAlpha = pk; phone(g, 800, 1180 + (1 - pk) * 400, 1.4, 0.12, () => { fillRR(g, -56, -122, 112, 26, 13, "#f3ece0"); txt(g, "bei-marco.de", 0, -109, { w: 700, px: 11, c: "#2a1c13", fam: "I" }); txt(g, NAME, 0, -55, { w: 400, px: 22, c: WARM, fam: "S" }); fillRR(g, -46, 70, 92, 30, 15, AMBER); txt(g, "Bestellen", 0, 85, { w: 800, px: 12, c: "#1a120d", fam: "I" }); circle(g, 0, 8, 30, "#c63a24"); circle(g, 0, 8, 24, "#e3a24d"); }); g.restore(); }
        const fl = 1 - cl(Math.abs(u - T.waere) / 0.15); if (fl > 0) { g.fillStyle = `rgba(255,230,190,${fl * 0.6})`; g.fillRect(0, 0, W, H); }
        grade(g, 0.8 * on, 0.8); const wf = cl((u - (d - 0.25)) / 0.25); if (wf > 0) { g.fillStyle = `rgba(10,7,5,${wf})`; g.fillRect(0, 0, W, H); }
      }
    },
    ev(d, p) { const T = p._T, E = [];
      for (let t = 0; t < T.kueche - 0.3; t += 1.4) E.push([t, "closed_rain", 0.5, 0]); E.push([0.0, "thunder", 0.7, 0]);
      E.push([T.kueche - 0.3, "whoosh_side", 0.25, 0]); for (let t = T.kueche; t < T.best - 0.3; t += 0.5) E.push([t, "tick", 0.15, 0.3]);
      [T.best - 0.1, T.best + 0.45, T.best + 1.0].forEach((t) => E.push([t, "vbeep", 0.3, 0])); E.push([T.p30 - 0.2, "tr_swish", 0.4, 0]); E.push([T.proz - 0.1, "slap", 0.55, 0]); E.push([T.proz, "boom", 0.4, 0]); E.push([T.weg, "whoosh_up", 0.45, 0.4]);
      E.push([T.stamm - 0.2, "whoosh_side", 0.3, -0.3]); E.push([T.platt - 0.2, "vsad", 0.3, 0.4]);
      E.push([T.monat - 0.25, "whoosh_down", 0.3, 0]); for (let t = T.monat - 0.2; t < T.waere - 0.2; t += 1.4) E.push([t, "closed_rain", 0.35, 0]);
      E.push([T.waere, "ls_on", 0.6, 0]); E.push([T.waere + 0.02, "shimmer", 0.35, 0]); for (let i = 0; i < 7; i += 2) E.push([T.direkt - 0.2 + i * 0.22 + 0.9, "pop", 0.25, 0]); E.push([T.namen, "chime", 0.4, 0]);
      return E.filter((e) => e[0] < d && e[0] >= 0); },
  };

  // ---------- Schluss: Filmtitel statt Neon-Logo ----------
  TYPES.gastro_end = {
    zone: "center", pal: "c_warm", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const W0 = (SPEC.words || []).filter((w) => w.scene === o.i); const f = (re, after = 0, def = null) => { const w = W0.find((x) => x.t - o.t0 >= after - 1e-6 && re.test(norm(x.w))); return w ? w.t - o.t0 : def; };
      p._T = { sys: f(/^systems/, 0, 0.8), best: f(/^bestellsystem/, 0, 1.6), komm: f(/^kommentieren/, 0, 2.8), web: f(/^website/, 0, 3.4) }; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createRadialGradient(540, 900, 50, 540, 900, 1100); bg.addColorStop(0, "#22160e"); bg.addColorStop(1, "#050403"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 26; i++) { const x = (rnd(i * 3.3) * 1200 + u * (8 + rnd(i) * 12)) % 1200 - 60, y = rnd(i * 6.6) * 1900, r = 20 + rnd(i * 2.2) * 60; const a = 0.05 + 0.08 * (0.5 + 0.5 * Math.sin(u * 1.5 + i)); const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(255,190,110,${a})`); gg.addColorStop(1, "rgba(255,190,110,0)"); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      const z = 1.06 - 0.06 * out3(cl(u / 2.5)); g.save(); g.translate(540, 900); g.scale(z, z);
      // Name, Buchstabe für Buchstabe aus der Unschärfe
      const name = "Mihajlo Systems"; font(g, 400, 156, "S"); const tw = g.measureText(name).width; let x = -tw / 2; const ls = name.split("");
      ls.forEach((c, i) => { const w = g.measureText(c).width; const k = cl((u - 0.1 - i * 0.045) / 0.5); if (k > 0) { g.save(); g.globalAlpha = k; g.filter = k < 1 ? `blur(${(1 - k) * 12}px)` : "none"; g.fillStyle = "#fff3e2"; g.textAlign = "left"; g.textBaseline = "middle"; g.shadowColor = "rgba(255,190,110,0.45)"; g.shadowBlur = 40; g.fillText(c, x, -40 + (1 - out3(k)) * 20); g.restore(); } x += w; });
      const lk = out3(seg(u, 0.6, 1.4)); g.strokeStyle = "rgba(255,200,130,0.8)"; g.lineWidth = 2; g.beginPath(); g.moveTo(-lk * 380, 80); g.lineTo(lk * 380, 80); g.stroke();
      const bk = seg(u, T.best - 0.2, T.best + 0.3); if (bk > 0) { g.globalAlpha = bk; g.save(); g.letterSpacing = "10px"; txt(g, "IHR EIGENES BESTELLSYSTEM", 0, 145, { w: 600, px: 36, c: "rgba(255,226,190,0.85)", fam: "I" }); g.restore(); g.globalAlpha = 1; }
      g.restore();
      // Aufruf, ruhig und elegant
      const ck = seg(u, T.komm - 0.2, T.komm + 0.3); if (ck > 0) { g.save(); g.globalAlpha = ck; g.translate(0, (1 - out3(ck)) * 30); g.font = "italic 400 64px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "rgba(255,243,226,0.9)"; g.fillText("Kommentieren Sie", 540, 1260); g.restore(); }
      const wk = seg(u, T.web - 0.1, T.web + 0.35); if (wk > 0) { g.save(); g.globalAlpha = wk; g.letterSpacing = "18px"; txt(g, "WEBSITE", 549, 1370, { w: 600, px: 78, c: "#ffd9a0", fam: "I" }); g.restore(); const ul = out3(seg(u, T.web + 0.1, T.web + 0.7)); g.strokeStyle = "#ffb35c"; g.lineWidth = 3; g.beginPath(); g.moveTo(540 - 230 * ul, 1428); g.lineTo(540 + 230 * ul, 1428); g.stroke();
        const sk = seg(u, T.web + 0.6, T.web + 1.0); if (sk > 0) { g.globalAlpha = sk; txt(g, "und ich zeige Ihnen, wie das bei Ihnen aussieht.", 540, 1500, { w: 400, px: 32, c: "rgba(255,226,190,0.7)", fam: "I" }); g.globalAlpha = 1; } }
      const fi = 1 - cl(u / 0.4); if (fi > 0) { g.fillStyle = `rgba(5,4,3,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.05, "boom", 0.45, 0], [0.1, "shimmer", 0.35, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
