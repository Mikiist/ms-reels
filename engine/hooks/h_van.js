// VOICE_DELAY: 0.3
// h_van: Geschichten-Hook im Comic-Stil (Look "story", Vorbild: QR-Codes auf Panzern).
// Ein Klempner klebt seinen Transporter mit QR-Codes zu (immer schneller, am Ende auch Ampel, Boden, sich selbst),
// Passanten fotografieren das Auto, aber niemand ruft an. Dann taucht ein Blitzer auf, blitzt, scannt einen Code,
// die Kamera taucht in den Code, eine Wand aus Codes wird gescannt, ein Browser lädt die Website, das Telefon klingelt.
// Zeiten kommen aus den Wörtern: beklebt, ecke, leute, sahen|ampel, anriefen, blitzer, code, landet, website.
// Parameter: url (Standard "ihr-klempner.de"), label (Aufschrift Transporter, Standard "KLEMPNER").
(() => {
  const OL = "#263043", GROUND = 960;
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  function qrBits(seed) { const b = []; for (let i = 0; i < 49; i++) b.push(rnd(seed * 7.13 + i * 1.77) > 0.52); return b; }
  function sticker(g, x, y, s, rot, bits, k) { // weißer QR-Aufkleber mit Rand, Schatten und Code
    if (k <= 0) return; const e = outBack(Math.min(1, k), 2.6); g.save(); g.translate(x, y); g.rotate(rot + (1 - Math.min(1, k)) * 0.6); g.scale(e, e);
    g.fillStyle = "rgba(20,25,40,0.22)"; g.fillRect(-s / 2 + 3, -s / 2 + 4, s, s); g.fillStyle = "#ffffff"; g.fillRect(-s / 2, -s / 2, s, s);
    const m = s * 0.1, c = (s - 2 * m) / 7; g.fillStyle = "#111318";
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { const fin = (i < 2 && j < 2) || (i > 4 && j < 2) || (i < 2 && j > 4); if (fin || bits[i * 7 + j]) g.fillRect(-s / 2 + m + i * c, -s / 2 + m + j * c, c + 0.4, c + 0.4); }
    for (const [fi, fj] of [[0, 0], [5, 0], [0, 5]]) { g.fillStyle = "#ffffff"; g.fillRect(-s / 2 + m + fi * c + c * 0.5, -s / 2 + m + fj * c + c * 0.5, c, c); }
    g.restore();
  }
  function person(g, x, feet, h, col, look, phone, flash, walk) { // runde Comic-Figur
    const bw = h * 0.2, bob = walk ? Math.abs(Math.sin(walk * 9)) * 8 : 0; g.save(); g.translate(x, feet - bob); g.lineWidth = 7; g.strokeStyle = OL; g.lineCap = "round";
    const leg = walk ? Math.sin(walk * 9) * 22 : 0; g.strokeStyle = "#2b3242"; g.lineWidth = 16; g.beginPath(); g.moveTo(-bw * 0.4, -h * 0.4); g.lineTo(-bw * 0.4 - leg, -6); g.moveTo(bw * 0.4, -h * 0.4); g.lineTo(bw * 0.4 + leg, -6); g.stroke();
    g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = col; rr(g, -bw, -h * 0.8, bw * 2, h * 0.46, bw * 0.8); g.fill(); g.stroke();
    g.fillStyle = "#f2c9a5"; g.beginPath(); g.arc(look * 6, -h * 0.92, h * 0.13, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#3a2a20"; g.beginPath(); g.arc(look * 6, -h * 0.95, h * 0.13, Math.PI * 1.05, Math.PI * 1.95); g.fill();
    g.fillStyle = OL; for (const ex of [-1, 1]) { g.beginPath(); g.arc(look * 10 + ex * h * 0.045, -h * 0.92 - look * 6, 4.5, 0, 7); g.fill(); }
    if (phone > 0) { const ax = bw * 0.2 + 30, ay = -h * 0.66 - phone * h * 0.18; g.lineWidth = 12; g.strokeStyle = col; g.beginPath(); g.moveTo(bw * 0.7, -h * 0.66); g.lineTo(ax, ay); g.stroke(); g.lineWidth = 5; g.strokeStyle = OL;
      g.fillStyle = "#1c2230"; rr(g, ax - 14, ay - 44, 30, 50, 7); g.fill(); g.stroke();
      if (flash > 0) { g.fillStyle = `rgba(255,255,255,${flash})`; g.beginPath(); g.arc(ax + 1, ay - 34, 60 * flash + 8, 0, 7); g.fill(); } }
    g.restore();
  }
  function van(g, label) { // Transporter von der Seite, Front rechts
    g.lineWidth = 7; g.strokeStyle = OL; g.lineJoin = "round";
    g.fillStyle = "#f3f5f8"; g.beginPath(); g.moveTo(220, 905); g.lineTo(220, 680); g.quadraticCurveTo(220, 650, 250, 650); g.lineTo(720, 650); g.quadraticCurveTo(760, 650, 785, 690); g.lineTo(845, 790); g.quadraticCurveTo(858, 812, 858, 840); g.lineTo(858, 905); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#9fd0f5"; g.beginPath(); g.moveTo(735, 672); g.lineTo(768, 672); g.lineTo(830, 785); g.lineTo(735, 785); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(712, 660); g.lineTo(712, 900); g.moveTo(470, 660); g.lineTo(470, 900); g.stroke();
    g.fillStyle = "#3b82f6"; g.fillRect(224, 820, 630, 26); g.strokeRect(224, 820, 630, 26);
    txt(g, label, 460, 760, { w: 900, px: 58, c: "#3b82f6", fam: "K" });
    for (const wx of [360, 730]) { g.fillStyle = "#2a2f3a"; g.beginPath(); g.arc(wx, 922, 48, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#c9ced8"; g.beginPath(); g.arc(wx, 922, 20, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = "#ffd54a"; rr(g, 836, 812, 22, 18, 4); g.fill(); g.stroke();
  }
  function plumber(g, x, feet, arm, sad, stuck) {
    const h = 250; g.save(); g.translate(x, feet + sad * 6); g.scale(-1, 1); g.lineWidth = 6; g.strokeStyle = OL; g.lineCap = "round";
    g.beginPath(); g.moveTo(-14, -100); g.lineTo(-18, 0); g.moveTo(14, -100); g.lineTo(18, 0); g.stroke();
    g.fillStyle = "#2f6fde"; rr(g, -40, -200, 80, 110, 22); g.fill(); g.stroke();
    g.fillStyle = "#f2c9a5"; g.beginPath(); g.arc(0, -228, 30, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#e5484d"; g.beginPath(); g.arc(0, -238, 31, Math.PI, 0); g.fill(); g.stroke(); g.fillRect(-38, -240, 22, 8);
    g.fillStyle = OL; g.beginPath(); g.arc(-12, -228, 4, 0, 7); g.fill(); g.beginPath(); if (sad > 0.5) g.arc(-10, -196, 10, Math.PI * 1.15, Math.PI * 1.85); else g.arc(-10, -214, 10, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
    const ang = -2.2 + arm * 0.9; g.beginPath(); g.moveTo(-30, -180); g.lineTo(-30 + Math.cos(ang) * 70, -180 + Math.sin(ang) * 70); g.stroke();
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(-30 + Math.cos(ang) * 76, -180 + Math.sin(ang) * 76, 14, 0, 7); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(30, -180); g.lineTo(52, -110); g.stroke();
    for (const s of stuck) sticker(g, s[0], s[1], 26, s[2], s[3], s[4]);
    g.restore();
  }

  TYPES.h_van = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 2.6,
    prep(o, p) {
      const W0 = (SPEC.words || []).filter((w) => w.scene === o.i); const f = (re, after = 0, def = null) => { const w = W0.find((x) => x.t >= after && re.test(norm(x.w))); return w ? w.t - o.t0 : def; };
      const T = {}; T.bek = f(/^beklebt/, 0, 2.2); T.ecke = f(/^ecke/, T.bek, T.bek + 1.6); T.leute = f(/^leute/, T.ecke, T.ecke + 0.6); T.sahen = f(/^(sahen|ampel)/, T.leute, T.leute + 0.8);
      T.anrief = f(/^anriefen/, T.sahen, T.sahen + 1.0); T.blitz = f(/^blitzer/, T.anrief, T.anrief + 1.0); T.code = f(/^code/, T.blitz, T.blitz + 0.6); T.landet = f(/^landet/, T.code, T.code + 0.5); T.web = f(/^website/, T.landet, T.landet + 0.6);
      // Aufkleber: 130 auf dem Transporter (immer schneller), 34 drumherum, 5 auf dem Klempner
      const main = [], extra = [], onMan = []; const span = Math.max(1.2, T.ecke + 0.25 - 0.1);
      const cand = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 10; c++) cand.push([262 + c * 62 + (rnd(r * 9 + c) - 0.5) * 18, 682 + r * 62 + (rnd(r * 5 + c * 3) - 0.5) * 16]);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) cand.push([293 + c * 62 + (rnd(r * 7 + c + 50) - 0.5) * 18, 713 + r * 62 + (rnd(r * 3 + c + 70) - 0.5) * 16]);
      const ok = cand.filter(([x, y]) => !(x > 790 && y < 700 + (x - 790) * 1.6) && x < 852);
      const order = ok.map((c, i) => [rnd(i * 13.37 + 2), c]).sort((A, B) => A[0] - B[0]).map((x) => x[1]); const NM = order.length;
      order.forEach(([x, y], i) => main.push({ x, y, s: 54 + rnd(i * 9.1) * 10, r: (rnd(i * 2.3) - 0.5) * 0.45, b: qrBits(i + 1), t: 0.12 + span * Math.sqrt(i / (NM - 1)) }));
      const spots = [[930, 380], [930, 470], [935, 560], [262, 1000], [430, 1015], [600, 1000], [790, 1018], [330, 600], [560, 610], [700, 560], [880, 640], [120, 1050], [520, 1070], [880, 1060], [300, 1095], [700, 1095], [450, 545], [620, 525], [240, 560], [820, 530], [380, 960], [660, 955]];
      spots.forEach(([x, y], i) => extra.push({ x, y, s: 50 + rnd(i * 4.4) * 10, r: (rnd(i * 6.6) - 0.5) * 0.6, b: qrBits(300 + i), t: T.ecke - 0.15 + i * 0.03 }));
      [[-20, -150], [20, -170], [0, -125], [-25, -190], [22, -130]].forEach(([x, y], i) => onMan.push({ x, y, r: (rnd(i) - 0.5) * 0.8, b: qrBits(500 + i), t: T.ecke + 0.1 + i * 0.06 }));
      p._v = { T, main, extra, onMan, tgt: main.reduce((a, s) => (Math.abs(s.x - 600) + Math.abs(s.y - 760) < Math.abs(a.x - 600) + Math.abs(a.y - 760) ? s : a), main[0]) };
    },
    draw(g, u, d, p, sc, P) {
      const V = p._v, T = V.T;
      // Kamera
      const key = (t, z, x, y) => ({ t, z, x, y });
      const KF = [key(0, 1.5, 505, 795), key(T.ecke - 0.2, 1.42, 510, 800), key(T.ecke + 0.4, 1.18, 560, 820), key(T.leute - 0.3, 1.18, 560, 820), key(T.leute + 0.5, 1.0, 540, 1000),
        key(T.anrief - 0.25, 1.0, 540, 1000), key(T.anrief + 0.25, 1.45, 330, 760), key(T.blitz - 0.4, 1.45, 330, 760), key(T.blitz - 0.1, 1.28, 860, 740)];
      let z = KF[0].z, cx = KF[0].x, cy = KF[0].y;
      for (let i = 1; i < KF.length; i++) { const A = KF[i - 1], B = KF[i]; if (u >= A.t) { const k = inOut(cl((u - A.t) / Math.max(0.05, B.t - A.t))); z = lerp(A.z, B.z, k); cx = lerp(A.x, B.x, k); cy = lerp(A.y, B.y, k); } }
      const dive = inExpo(cl((u - T.code + 0.05) / 0.4)); if (dive > 0) { z *= 1 + dive * 9; cx = lerp(cx, V.tgt.x, inOut(cl((u - T.code + 0.15) / 0.3))); cy = lerp(cy, V.tgt.y, inOut(cl((u - T.code + 0.15) / 0.3))); }
      const wall = u >= T.code + 0.35;
      if (!wall) {
        g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-cx, -cy);
        // Himmel, Wolken, Häuser
        const sk = g.createLinearGradient(0, -400, 0, 760); sk.addColorStop(0, "#6fb4ff"); sk.addColorStop(1, "#cfe7ff"); g.fillStyle = sk; g.fillRect(-600, -600, 2300, 1400);
        for (let i = 0; i < 5; i++) { const x = ((i * 290 + u * (12 + i * 3)) % 1500) - 250, y = 120 + (i % 3) * 110; g.fillStyle = "#ffffff"; for (const [dx, dy, r] of [[0, 0, 44], [40, -18, 52], [88, 0, 40], [44, 14, 40]]) { g.beginPath(); g.arc(x + dx, y + dy, r, 0, 7); g.fill(); } }
        const HC = ["#f2c7a5", "#e8a87c", "#d9d4cf", "#a7c4bc", "#f0b9b9", "#c9b8e8"];
        for (let i = 0; i < 9; i++) { const x = -260 + i * 190, w = 180, hgt = 200 + rnd(i * 3.3) * 170, top = 760 - hgt; g.fillStyle = HC[i % HC.length]; g.lineWidth = 5; g.strokeStyle = OL; g.fillRect(x, top, w, hgt); g.strokeRect(x, top, w, hgt);
          g.fillStyle = "rgba(38,48,67,0.55)"; for (let r = 0; r < Math.floor((hgt - 40) / 60); r++) for (let c = 0; c < 3; c++) g.fillRect(x + 22 + c * 54, top + 26 + r * 60, 30, 34); }
        g.fillStyle = "#e9dccb"; g.fillRect(-600, 760, 2300, 60); g.fillStyle = "#5b6170"; g.fillRect(-600, 820, 2300, 430); g.fillStyle = "#e9dccb"; g.fillRect(-600, 1250, 2300, 900);
        g.fillStyle = "#f1f2f4"; for (let x = -560; x < 1700; x += 140) g.fillRect(x, 1112, 80, 12);
        g.strokeStyle = "rgba(38,48,67,0.12)"; g.lineWidth = 3; for (let x = -600; x < 1700; x += 120) { g.beginPath(); g.moveTo(x, 1250); g.lineTo(x - 60, 1920); g.stroke(); }
        // Ampel
        g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#3a4152"; g.fillRect(922, 420, 16, 400); g.strokeRect(922, 420, 16, 400); rr(g, 890, 330, 80, 190, 18); g.fill(); g.stroke();
        [["#ff4d4d", 370], ["#4a3a1e", 425], ["#1e3a26", 480]].forEach(([c, y]) => { g.fillStyle = c; g.beginPath(); g.arc(930, y, 22, 0, 7); g.fill(); });
        // Blitzer (taucht auf)
        const bk = outBack(cl((u - T.blitz + 0.35) / 0.35), 2); if (bk > 0) { g.save(); g.translate(1085, 820); g.scale(1.35, bk * 1.35); g.fillStyle = "#7a8091"; g.fillRect(-8, -240, 16, 240); g.strokeRect(-8, -240, 16, 240);
          g.fillStyle = "#c7ccd6"; rr(g, -48, -360, 96, 130, 12); g.fill(); g.stroke(); g.fillStyle = "#1c2230"; g.beginPath(); g.arc(0, -318, 22, 0, 7); g.fill(); g.stroke();
          const fl = cl(1 - (u - T.blitz - 0.08) / 0.25); g.fillStyle = u > T.blitz + 0.08 && fl > 0 ? `rgba(255,60,60,${fl})` : "#5a2020"; g.beginPath(); g.arc(0, -262, 12, 0, 7); g.fill(); g.restore(); }
        // Transporter und Aufkleber
        van(g, p.label || "KLEMPNER");
        for (const s of V.main) sticker(g, s.x, s.y, s.s, s.r, s.b, (u - s.t) / 0.16);
        // Klempner
        const lastHit = V.main.reduce((a, s) => (s.t <= u && s.t > a ? s.t : a), -9); const arm = cl(1 - (u - lastHit) / 0.12);
        const sad = inOut(cl((u - T.anrief) / 0.3)) * (1 - cl((u - T.blitz + 0.2) / 0.3));
        plumber(g, 160, 965, u < T.ecke + 0.3 ? arm : 0, sad, V.onMan.map((s) => [s.x, s.y, s.r, s.b, (u - s.t) / 0.16]));
        for (const s of V.extra) sticker(g, s.x, s.y, s.s, s.r, s.b, (u - s.t) / 0.16);
        // Handy-Blase "0 Anrufe"
        const bb = outBack(cl((u - T.anrief) / 0.3), 2) * (1 - cl((u - T.blitz + 0.2) / 0.25)); if (bb > 0) { g.save(); g.translate(250, 560); g.scale(bb * 1.3, bb * 1.3); g.fillStyle = "#ffffff"; g.lineWidth = 5; g.strokeStyle = OL; rr(g, -110, -50, 220, 100, 24); g.fill(); g.stroke();
          g.beginPath(); g.moveTo(10, 50); g.lineTo(30, 80); g.lineTo(40, 50); g.closePath(); g.fill(); g.stroke(); txt(g, "0 Anrufe", 0, 3, { w: 900, px: 40, c: "#e5484d", fam: "K" }); g.restore(); }
        // Passanten im Vordergrund
        if (u > T.leute - 0.3 && u < T.anrief + 1.4) { [[170, "#f4a259"], [430, "#8e4ec6"], [690, "#30a46c"]].forEach(([tx, col], i) => {
          const tin = T.leute - 0.3 + i * 0.12, tout = T.anrief + 0.25 + i * 0.1; const ki = inOut(cl((u - tin) / 0.7)), ko = inExpo(cl((u - tout) / 0.8));
          const x = lerp(-180, tx, ki) + ko * 900; const walking = (ki < 1 && ki > 0) || ko > 0; const ph = cl((u - T.sahen + 0.1 - i * 0.12) / 0.25) * (1 - cl((u - tout + 0.1) / 0.2));
          const fl = Math.max(0, 1 - Math.abs(u - (T.sahen + 0.2 + i * 0.18)) / 0.09); person(g, x, 1660, 360, col, ph > 0 ? 1 : 0, ph, fl, walking ? u : 0); }); }
        // Scan-Strahl vom Blitzer zum Ziel-Aufkleber
        const sb = cl((u - T.blitz - 0.25) / 0.2) * 1 * (1 - cl((u - T.code + 0.05) / 0.1)); if (sb > 0) { g.save(); g.globalAlpha = sb; g.fillStyle = "rgba(80,255,140,0.28)"; g.beginPath(); g.moveTo(1085, 820 - 318 * 1.35); g.lineTo(V.tgt.x - 30, V.tgt.y - 30 + Math.sin(u * 20) * 6); g.lineTo(V.tgt.x + 30, V.tgt.y + 30 + Math.sin(u * 20) * 6); g.closePath(); g.fill();
          g.strokeStyle = "#3dff8b"; g.lineWidth = 4; const s = 34; g.strokeRect(V.tgt.x - s, V.tgt.y - s, 2 * s, 2 * s); g.restore(); }
        g.restore();
        // Blitz über das ganze Bild
        const fl = Math.max(0, 1 - Math.abs(u - T.blitz - 0.1) / 0.12); if (fl > 0) { g.fillStyle = `rgba(255,255,255,${0.9 * fl})`; g.fillRect(0, 0, W, H); }
      } else {
        // Wand aus Codes, die gescannt werden
        const wu = u - (T.code + 0.35); g.fillStyle = "#cdb98f"; g.fillRect(0, 0, W, H);
        g.save(); const zz = 1.25 - 0.12 * cl(wu / 1.5); g.translate(540, 960); g.scale(zz, zz); g.translate(-540, -960);
        for (let r = -1; r < 12; r++) for (let c = -1; c < 7; c++) { const i = r * 9 + c + 20; const x = 70 + c * 170 + (rnd(i * 1.3) - 0.5) * 30, y = 120 + r * 170 + (rnd(i * 2.7) - 0.5) * 30; sticker(g, x, y, 130, (rnd(i * 3.9) - 0.5) * 0.3, qrBits(700 + i), 1); }
        const boxes = [[540, 960], [370, 790], [710, 1130], [540, 620], [880, 790], [200, 1130]]; boxes.forEach(([x, y], i) => { const k = cl((wu - i * 0.09) / 0.12); if (k <= 0) return; g.strokeStyle = "#3dff8b"; g.lineWidth = 6; const s = 80 * (1.3 - 0.3 * k);
          for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(x + sx * s, y + sy * (s - 26)); g.lineTo(x + sx * s, y + sy * s); g.lineTo(x + sx * (s - 26), y + sy * s); g.stroke(); } });
        g.restore();
        // Browser lädt die Website
        const bw = outExpo(cl((u - T.landet + 0.1) / 0.35)); if (bw > 0) { g.save(); g.translate(540, 960 + (1 - bw) * 300); g.globalAlpha = cl(bw * 1.5); shadow(g, 50, 20, "rgba(0,0,0,0.45)"); fillRR(g, -440, -330, 880, 660, 30, "#11151c"); noShadow(g);
          fillRR(g, -410, -300, 820, 70, 35, "#1f2530"); const url = "https://" + (p.url || "ihr-klempner.de"); const n = Math.floor(url.length * cl((u - T.landet) / 0.45));
          txt(g, url.slice(0, n), -370, -264, { w: 500, px: 30, fam: "M", c: "#cfd6e2", al: "left" }); const lp = cl((u - T.landet - 0.35) / 0.5); fillRR(g, -410, -214, 820 * lp, 6, 3, "#3dff8b");
          const pg = cl((u - T.web + 0.05) / 0.25); if (pg > 0) { g.globalAlpha = pg; txt(g, "Rohrbruch?", 0, -100, { w: 900, px: 74, c: "#ffffff", fam: "K" }); txt(g, "Wir kommen heute noch.", 0, -20, { w: 600, px: 40, fam: "I", c: "#9aa3b2" });
            const pu = 1 + 0.05 * Math.sin((u - T.web) * 12); g.save(); g.translate(0, 130); g.scale(pu, pu); fillRR(g, -230, -54, 460, 108, 54, "#3dff8b"); txt(g, "Jetzt anrufen", 0, 3, { w: 800, px: 44, fam: "I", c: "#0b0d11" }); g.restore();
            const rg = cl((u - T.web - 0.2) / 0.2); if (rg > 0) { const wob = Math.sin(u * 60) * 0.12 * rg; g.save(); g.translate(300, 230); g.rotate(wob); fillRR(g, -38, -66, 76, 132, 16, "#e8ecf2"); fillRR(g, -30, -56, 60, 100, 8, "#3dff8b"); g.restore(); } }
          g.restore(); }
      }
    },
    ev(d, p) {
      const V = p._v, T = V.T, E = [];
      V.main.forEach((s, i) => { if (i < 14 || i % 4 === 0) E.push([s.t, "vslap", i < 14 ? 0.55 : 0.3, (s.x - 540) / 600]); });
      V.extra.forEach((s, i) => { if (i % 3 === 0) E.push([s.t, "vslap", 0.3, (s.x - 540) / 600]); });
      E.push([T.leute - 0.3, "vsteps", 0.35, -0.5]); [0, 1, 2].forEach((i) => E.push([T.sahen + 0.2 + i * 0.18, "vshutter", 0.55, -0.4 + i * 0.4]));
      E.push([T.anrief, "vsad", 0.55, 0.3]); E.push([T.anrief + 0.25, "vsteps", 0.3, 0.5]);
      E.push([T.blitz - 0.35, "whoosh_up", 0.4, -0.6]); E.push([T.blitz + 0.05, "vblitz", 0.9, -0.5]); E.push([T.blitz + 0.3, "vscan", 0.5, -0.2]);
      E.push([T.code - 0.05, "whoosh_up", 0.6, 0]); for (let i = 0; i < 6; i++) E.push([T.code + 0.35 + i * 0.09, "vbeep", 0.35, (i % 3 - 1) * 0.4]);
      const url = "https://" + (p.url || "ihr-klempner.de"); for (let i = 0; i < url.length; i += 2) E.push([T.landet + 0.45 * i / url.length, "key", 0.25, 0]);
      E.push([T.web - 0.05, "ding", 0.4, 0]); E.push([T.web + 0.2, "vphone", 0.6, 0.4]);
      return E.filter((e) => e[0] < d + 0.1);
    },
  };
})();
