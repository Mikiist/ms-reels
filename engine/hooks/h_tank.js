// VOICE_DELAY: 0.3
// h_tank: Geschichten-Hook im Comic-Stil (Look "story"). Soldaten bekleben ihren Panzer mit QR-Codes (immer schneller,
// am Ende alles voll). Rückblende: Drohnen werfen Bomben auf drei Panzer ohne Codes, Comic-Explosionen, Türme fliegen weg.
// Dann schwebt eine Drohne über dem beklebten Panzer, scannt einen Code, die Kamera taucht in eine Wand aus Codes,
// der Browser lädt die Website von Mihajlo Systems. Keine verletzten Menschen, nur Blech.
// Zeiten aus den Wörtern: beklebt, ecke, weil, abgeschossen, jetzt, code, landet, website. Parameter: url (Standard mihajlostanojevic.com).
(() => {
  const OL = "#3a2a1c";
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  function qrBits(seed) { const b = []; for (let i = 0; i < 49; i++) b.push(rnd(seed * 7.13 + i * 1.77) > 0.52); return b; }
  function sticker(g, x, y, s, rot, bits, k) {
    if (k <= 0) return; const e = outBack(Math.min(1, k), 2.6); g.save(); g.translate(x, y); g.rotate(rot + (1 - Math.min(1, k)) * 0.6); g.scale(e, e);
    g.fillStyle = "rgba(40,25,10,0.25)"; g.fillRect(-s / 2 + 3, -s / 2 + 4, s, s); g.fillStyle = "#ffffff"; g.fillRect(-s / 2, -s / 2, s, s);
    const m = s * 0.1, c = (s - 2 * m) / 7; g.fillStyle = "#111318";
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) { const fin = (i < 2 && j < 2) || (i > 4 && j < 2) || (i < 2 && j > 4); if (fin || bits[i * 7 + j]) g.fillRect(-s / 2 + m + i * c, -s / 2 + m + j * c, c + 0.4, c + 0.4); }
    for (const [fi, fj] of [[0, 0], [5, 0], [0, 5]]) { g.fillStyle = "#ffffff"; g.fillRect(-s / 2 + m + fi * c + c * 0.5, -s / 2 + m + fj * c + c * 0.5, c, c); }
    g.restore();
  }
  function tank(g, x, y, s, burnt, turretOff) { // Panzer von der Seite, Mitte unten bei (x, y), Rohr nach rechts
    g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 7 / Math.max(0.6, s) * 0.9; g.strokeStyle = OL; g.lineJoin = "round";
    const body = burnt ? "#4a4038" : "#c9b48a", dark = burnt ? "#2e2823" : "#9c8a62";
    g.fillStyle = "#3b3a38"; rr(g, -300, -70, 600, 70, 35); g.fill(); g.stroke();
    for (let i = 0; i < 7; i++) { g.fillStyle = burnt ? "#5a5550" : "#8a8a86"; g.beginPath(); g.arc(-255 + i * 85, -35, 26, 0, 7); g.fill(); g.stroke(); }
    g.fillStyle = body; g.beginPath(); g.moveTo(-320, -70); g.lineTo(-285, -175); g.lineTo(290, -175); g.lineTo(335, -70); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = dark; g.fillRect(-300, -100, 620, 14);
    if (!turretOff || turretOff.k <= 0) turret(g, 0, 0, 0, body); else { const k = turretOff.k; g.save(); g.translate(turretOff.dx * k, -600 * k + 900 * k * k); g.rotate(turretOff.r * k); turret(g, 0, 0, 0, body); g.restore(); }
    g.restore();
  }
  function turret(g, ox, oy, r, body) {
    g.fillStyle = body; g.beginPath(); g.moveTo(-150, -175); g.quadraticCurveTo(-140, -265, -40, -270); g.lineTo(90, -270); g.quadraticCurveTo(170, -262, 175, -175); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = body; rr(g, 165, -245, 260, 30, 12); g.fill(); g.stroke(); g.fillStyle = OL; g.fillRect(410, -250, 22, 40);
    g.fillStyle = body; rr(g, -50, -300, 70, 34, 10); g.fill(); g.stroke();
  }
  function soldier(g, x, feet, arm, stuck) {
    g.save(); g.translate(x, feet); g.scale(-1, 1); g.lineWidth = 6; g.strokeStyle = OL; g.lineCap = "round";
    g.strokeStyle = "#2f3a22"; g.lineWidth = 16; g.beginPath(); g.moveTo(-14, -100); g.lineTo(-18, -6); g.moveTo(14, -100); g.lineTo(18, -6); g.stroke(); g.lineWidth = 6; g.strokeStyle = OL;
    g.fillStyle = "#4e6b33"; rr(g, -40, -205, 80, 115, 22); g.fill(); g.stroke();
    g.fillStyle = "#e9c49d"; g.beginPath(); g.arc(0, -232, 28, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#3e5528"; g.beginPath(); g.arc(0, -240, 34, Math.PI, 0); g.fill(); g.stroke(); g.fillRect(-40, -244, 80, 9);
    g.fillStyle = OL; g.beginPath(); g.arc(-12, -230, 4, 0, 7); g.fill();
    const ang = -2.2 + arm * 0.9; g.strokeStyle = "#4e6b33"; g.lineWidth = 14; g.beginPath(); g.moveTo(-28, -185); g.lineTo(-28 + Math.cos(ang) * 72, -185 + Math.sin(ang) * 72); g.stroke(); g.lineWidth = 6; g.strokeStyle = OL;
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(-28 + Math.cos(ang) * 80, -185 + Math.sin(ang) * 80, 13, 0, 7); g.fill(); g.stroke();
    for (const s of stuck) sticker(g, s[0], s[1], 26, s[2], s[3], s[4]);
    g.restore();
  }
  function drone(g, x, y, s, u, bomb) {
    g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 5; g.strokeStyle = OL;
    for (const sx of [-1, 1]) { g.beginPath(); g.moveTo(0, 0); g.lineTo(sx * 70, -18); g.stroke(); g.fillStyle = "rgba(60,60,70,0.35)"; g.beginPath(); g.ellipse(sx * 70, -26, 46 * (0.6 + 0.4 * Math.abs(Math.sin(u * 50 + sx))), 7, 0, 0, 7); g.fill(); g.fillStyle = OL; g.fillRect(sx * 70 - 3, -26, 6, 10); }
    g.fillStyle = "#e7e9ee"; rr(g, -44, -16, 88, 34, 14); g.fill(); g.stroke(); g.fillStyle = "#e5484d"; g.beginPath(); g.arc(30, -2, 5, 0, 7); g.fill();
    g.fillStyle = "#1c2230"; g.beginPath(); g.arc(0, 22, 12, 0, 7); g.fill(); g.stroke();
    if (bomb) { g.fillStyle = "#c0392b"; rr(g, -14, 30, 28, 34, 10); g.fill(); g.stroke(); }
    g.restore();
  }
  function bomb(g, x, y) { g.save(); g.translate(x, y); g.lineWidth = 4; g.strokeStyle = OL; g.fillStyle = "#c0392b"; rr(g, -11, -20, 22, 34, 10); g.fill(); g.stroke(); g.restore(); }
  function boomFx(g, x, y, k, sc) { // Comic-Explosion: Rauchkugeln, Blitz, Splitter
    if (k <= 0 || k >= 1) return; const R = 150 * sc;
    if (k < 0.22) { const a = 1 - k / 0.22; g.fillStyle = `rgba(255,214,90,${a})`; g.beginPath(); g.arc(x, y, R * 0.9 * (k / 0.22 + 0.4), 0, 7); g.fill(); g.fillStyle = `rgba(255,255,230,${a})`; g.beginPath(); g.arc(x, y, R * 0.45 * (k / 0.22 + 0.4), 0, 7); g.fill(); }
    for (let i = 0; i < 9; i++) { const a = rnd(i * 3.1 + x) * 7, dd = R * 0.55 * out3(k) * (0.4 + rnd(i * 7.7 + y) * 0.8); const r = R * (0.35 + 0.35 * rnd(i * 5.3)) * out3(cl(k * 1.6)) * (1 - 0.3 * k);
      g.fillStyle = `rgba(${Math.round(lerp(240, 120, k))},${Math.round(lerp(120, 70, k))},${Math.round(lerp(40, 40, k))},${0.9 * (1 - k * k)})`; g.beginPath(); g.arc(x + Math.cos(a) * dd, y - R * 0.3 * k + Math.sin(a) * dd * 0.7, r, 0, 7); g.fill(); }
    g.strokeStyle = `rgba(60,40,20,${1 - k})`; g.lineWidth = 6; for (let i = 0; i < 8; i++) { const a = -Math.PI * rnd(i * 2.2 + x), d1 = R * 0.6 + R * 1.2 * out3(k); g.beginPath(); g.moveTo(x + Math.cos(a) * d1, y + Math.sin(a) * d1); g.lineTo(x + Math.cos(a) * (d1 + 24), y + Math.sin(a) * (d1 + 24)); g.stroke(); }
  }
  function desert(g, u, top) {
    const sk = g.createLinearGradient(0, -400, 0, 700); sk.addColorStop(0, "#7fb6ef"); sk.addColorStop(1, "#cde4fb"); g.fillStyle = sk; g.fillRect(-700, -700, 2500, 1500);
    for (let i = 0; i < 5; i++) { const x = ((i * 300 + u * (10 + i * 3)) % 1600) - 300, y = 90 + (i % 3) * 120; g.fillStyle = "#ffffff"; for (const [dx, dy, r] of [[0, 0, 46], [44, -20, 54], [92, 0, 42], [46, 14, 42]]) { g.beginPath(); g.arc(x + dx, y + dy, r, 0, 7); g.fill(); } }
    g.fillStyle = "#e39a6a"; for (const [x, w, h] of [[-300, 420, 210], [180, 300, 280], [560, 380, 190], [980, 360, 250]]) { g.beginPath(); g.moveTo(x, 700); g.lineTo(x + 40, 700 - h); g.lineTo(x + w - 40, 700 - h); g.lineTo(x + w, 700); g.closePath(); g.fill(); }
    g.fillStyle = "#d9824f"; for (const [x, w, h] of [[-120, 300, 120], [430, 260, 150], [820, 300, 110]]) { g.beginPath(); g.moveTo(x, 700); g.lineTo(x + 30, 700 - h); g.lineTo(x + w - 30, 700 - h); g.lineTo(x + w, 700); g.closePath(); g.fill(); }
    const gr = g.createLinearGradient(0, 700, 0, 1900); gr.addColorStop(0, "#ec8a4f"); gr.addColorStop(1, "#d8682f"); g.fillStyle = gr; g.fillRect(-700, 700, 2500, 1500);
    g.fillStyle = "rgba(120,60,20,0.25)"; for (let i = 0; i < 40; i++) { const x = rnd(i * 4.4) * 1400 - 160, y = 740 + rnd(i * 8.8) * 900; g.beginPath(); g.ellipse(x, y, 10 + rnd(i) * 14, 4, 0, 0, 7); g.fill(); }
    g.strokeStyle = "#4f7a3a"; g.lineWidth = 5; for (let i = 0; i < 12; i++) { const x = rnd(i * 6.1 + 2) * 1300 - 110, y = 760 + rnd(i * 2.9) * 800; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 8, y - 16); g.moveTo(x, y); g.lineTo(x + 8, y - 16); g.moveTo(x, y); g.lineTo(x, y - 20); g.stroke(); }
  }

  TYPES.h_tank = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 2.6,
    prep(o, p) {
      const W0 = (SPEC.words || []).filter((w) => w.scene === o.i); const f = (re, after = 0, def = null) => { const w = W0.find((x) => x.t >= after && re.test(norm(x.w))); return w ? w.t - o.t0 : def; };
      const T = {}; T.bek = f(/^beklebt/, 0, 2.2); T.ecke = f(/^ecke/, T.bek, T.bek + 1.6); T.weil = f(/^weil/, T.ecke, T.ecke + 0.6); T.abg = f(/^abgeschossen/, T.weil, T.weil + 1.8);
      T.jetzt = f(/^(jetzt|doch)/, T.abg, T.abg + 1.0); T.code = f(/^code/, T.jetzt, T.jetzt + 1.0); T.landet = f(/^landet/, T.code, T.code + 0.5); T.web = f(/^website/, T.landet, T.landet + 0.8);
      const main = [], extra = [], onMan = []; const span = Math.max(1.2, T.ecke + 0.25 - 0.1);
      const cand = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 10; c++) cand.push([-270 + c * 60 + (rnd(r * 9 + c) - 0.5) * 16, -150 + r * 58 + (rnd(r * 5 + c * 3) - 0.5) * 12]);
      for (let c = 0; c < 9; c++) cand.push([-240 + c * 60 + (rnd(c + 50) - 0.5) * 16, -120 + (rnd(c + 70) - 0.5) * 12]);
      for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) cand.push([-110 + c * 56 + (rnd(r * 3 + c + 90) - 0.5) * 12, -245 + r * 50 + (rnd(r + c + 99) - 0.5) * 10]);
      for (let c = 0; c < 4; c++) cand.push([200 + c * 56, -230]);
      const order = cand.map((c, i) => [rnd(i * 13.37 + 2), c]).sort((A, B) => A[0] - B[0]).map((x) => x[1]); const NM = order.length;
      order.forEach(([x, y], i) => main.push({ x: 540 + x, y: 960 + y, s: 50 + rnd(i * 9.1) * 10, r: (rnd(i * 2.3) - 0.5) * 0.45, b: qrBits(i + 1), t: 0.12 + span * Math.sqrt(i / (NM - 1)) }));
      [[195, 900], [880, 980], [300, 1010], [520, 1015], [740, 1012], [1000, 950], [80, 980], [960, 760], [120, 760]].forEach(([x, y], i) => extra.push({ x, y, s: 50, r: (rnd(i * 6.6) - 0.5) * 0.6, b: qrBits(300 + i), t: T.ecke - 0.1 + i * 0.04 }));
      [[-20, -150], [20, -170], [0, -125]].forEach(([x, y], i) => onMan.push({ x, y, r: (rnd(i) - 0.5) * 0.8, b: qrBits(500 + i), t: T.ecke + 0.1 + i * 0.07 }));
      const tgt = main.reduce((a, s) => (Math.abs(s.x - 560) + Math.abs(s.y - 860) < Math.abs(a.x - 560) + Math.abs(a.y - 860) ? s : a), main[0]);
      p._t = { T, main, extra, onMan, tgt };
    },
    draw(g, u, d, p, sc, P) {
      const V = p._t, T = V.T; const flash = u >= T.weil - 0.05 && u < T.jetzt - 0.05;
      const rev = !!p.reveal; const dive = rev ? inExpo(cl((u - T.landet + 0.1) / Math.max(0.3, d - T.landet + 0.1))) : inExpo(cl((u - T.code + 0.05) / 0.4)); const wall = !rev && u >= T.code + 0.35;
      if (wall) return this.wall(g, u, p, V, T);
      if (flash) { // Rückblende: Drohnen schießen Panzer ohne Codes ab
        const fu = u - T.weil; g.save(); const zz = 1.12 + 0.05 * cl(fu / 2); g.translate(540, 960); g.scale(zz, zz); g.translate(-540, -880); desert(g, u, 0);
        const hx = [400, 700, 540]; const hit = (i) => T.abg - 0.35 + i * 0.2; const last = hit(2);
        const kt = cl((u - last - 0.05) / 1.1); tank(g, 540, 1090, 0.9, u > hit(0) + 0.05, { k: u > last + 0.05 ? kt : 0, dx: 260, r: 5 });
        [[180, 330], [540, 280], [900, 340]].forEach(([sx, sy], i) => { const di = cl((u - T.weil - i * 0.18) / 0.9); const tx = hx[i]; const dx = lerp(sx + 700, tx, out3(di)), dy = lerp(sy - 80, sy + 120, out3(di)) + Math.sin(u * 4 + i) * 8;
          drone(g, dx, dy, 1.15, u, u < hit(i) - 0.45); const bk = (u - (hit(i) - 0.45)) / 0.4; if (bk > 0 && bk < 1) bomb(g, tx, lerp(dy + 70, 930, bk * bk)); });
        hx.forEach((x, i) => boomFx(g, x, 960, (u - hit(i)) / 1.1, i === 2 ? 1.6 : 1.1));
        g.restore(); g.fillStyle = "rgba(0,0,0,0.12)"; g.fillRect(0, 0, W, H); // leicht dunkler: Rückblende
        txt(g, "VORHER", 540, 200, { w: 800, px: 34, fam: "I", c: "rgba(0,0,0,0.45)", ls: 10 });
        return;
      }
      // Kamera auf dem beklebten Panzer
      const key = (t, z, x, y) => ({ t, z, x, y });
      const KF = [key(0, 1.3, 560, 820), key(T.ecke - 0.2, 1.26, 560, 820), key(T.ecke + 0.4, 1.12, 545, 840), key(T.jetzt - 0.05, 1.18, 545, 760), key(T.jetzt + 0.6, 1.25, 560, 760)];
      let z = KF[0].z, cx = KF[0].x, cy = KF[0].y;
      for (let i = 1; i < KF.length; i++) { const A = KF[i - 1], B = KF[i]; if (u >= A.t) { const k = inOut(cl((u - A.t) / Math.max(0.05, B.t - A.t))); z = lerp(A.z, B.z, k); cx = lerp(A.x, B.x, k); cy = lerp(A.y, B.y, k); } }
      if (dive > 0) { z *= 1 + dive * (rev ? 60 : 9); const k = rev ? inOut(cl((u - T.landet + 0.1) / 0.35)) : inOut(cl((u - T.code + 0.15) / 0.3)); cx = lerp(cx, V.tgt.x, k); cy = lerp(cy, V.tgt.y, k); }
      g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-cx, -cy); desert(g, u, 0);
      tank(g, 540, 960, 1, false, null);
      for (const s of V.main) sticker(g, s.x, s.y, s.s, s.r, s.b, (u - s.t) / 0.16);
      const lastHit = V.main.reduce((a, s) => (s.t <= u && s.t > a ? s.t : a), -9); const arm = cl(1 - (u - lastHit) / 0.12);
      soldier(g, 200, 965, u < T.ecke + 0.3 ? arm : 0, V.onMan.map((s) => [s.x, s.y, s.r, s.b, (u - s.t) / 0.16]));
      for (const s of V.extra) sticker(g, s.x, s.y, s.s, s.r, s.b, (u - s.t) / 0.16);
      if (u >= T.jetzt - 0.3) { const di = out3(cl((u - T.jetzt + 0.3) / 0.6)); const dx = lerp(1150, 640, di), dy = lerp(300, 520, di) + Math.sin(u * 4) * 8; drone(g, dx, dy, 0.9, u, false);
        const sb = cl((u - T.jetzt - 0.35) / 0.2) * (1 - cl((u - T.code + 0.05) / 0.1)); if (sb > 0) { g.save(); g.globalAlpha = sb; g.fillStyle = "rgba(80,255,140,0.28)"; g.beginPath(); g.moveTo(dx, dy + 22); g.lineTo(V.tgt.x - 34, V.tgt.y - 30 + Math.sin(u * 20) * 6); g.lineTo(V.tgt.x + 34, V.tgt.y + 30 + Math.sin(u * 20) * 6); g.closePath(); g.fill();
          g.strokeStyle = "#3dff8b"; g.lineWidth = 4; g.strokeRect(V.tgt.x - 34, V.tgt.y - 34, 68, 68); g.restore(); } }
      g.restore();
      if (rev) { const wf = cl((u - (d - 0.16)) / 0.16); if (wf > 0) { g.fillStyle = `rgba(255,255,255,${wf})`; g.fillRect(0, 0, W, H); } }
    },
    wall(g, u, p, V, T) {
      const wu = u - (T.code + 0.35); g.fillStyle = "#c9b48a"; g.fillRect(0, 0, W, H);
      g.save(); const zz = 1.25 - 0.12 * cl(wu / 1.5); g.translate(540, 960); g.scale(zz, zz); g.translate(-540, -960);
      for (let r = -1; r < 12; r++) for (let c = -1; c < 7; c++) { const i = r * 9 + c + 20; const x = 70 + c * 170 + (rnd(i * 1.3) - 0.5) * 30, y = 120 + r * 170 + (rnd(i * 2.7) - 0.5) * 30; sticker(g, x, y, 130, (rnd(i * 3.9) - 0.5) * 0.3, qrBits(700 + i), 1); }
      [[540, 960], [370, 790], [710, 1130], [540, 620], [880, 790], [200, 1130]].forEach(([x, y], i) => { const k = cl((wu - i * 0.09) / 0.12); if (k <= 0) return; g.strokeStyle = "#3dff8b"; g.lineWidth = 6; const s = 80 * (1.3 - 0.3 * k);
        for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(x + sx * s, y + sy * (s - 26)); g.lineTo(x + sx * s, y + sy * s); g.lineTo(x + sx * (s - 26), y + sy * s); g.stroke(); } });
      g.restore();
      const bw = outExpo(cl((u - T.landet + 0.1) / 0.35)); if (bw <= 0) return; g.save(); g.translate(540, 960 + (1 - bw) * 300); g.globalAlpha = cl(bw * 1.5); shadow(g, 50, 20, "rgba(0,0,0,0.45)"); fillRR(g, -440, -340, 880, 680, 30, "#0b0d11"); noShadow(g);
      fillRR(g, -410, -310, 820, 70, 35, "#1f2530"); const url = "https://" + (p.url || "mihajlostanojevic.com"); const n = Math.floor(url.length * cl((u - T.landet) / 0.5));
      txt(g, url.slice(0, n), -370, -274, { w: 500, px: 28, fam: "M", c: "#cfd6e2", al: "left" }); const lp = cl((u - T.landet - 0.4) / 0.5); fillRR(g, -410, -224, 820 * lp, 6, 3, "#c6f432");
      const pg = cl((u - T.web + 0.05) / 0.25); if (pg > 0) { g.globalAlpha = pg; const lk = outBack(cl((u - T.web) / 0.35), 2); g.save(); g.translate(0, -110); g.scale(lk, lk); g.drawImage(logoImg(), -60, -60, 120, 120); g.restore();
        txt(g, "MIHAJLO SYSTEMS", 0, 10, { w: 300, px: 50, c: "#ffffff", ls: 10 }); txt(g, "Websites, die gefunden werden", 0, 72, { w: 500, px: 32, fam: "I", c: "#9aa3b2" });
        const pu = 1 + 0.05 * Math.sin((u - T.web) * 12); g.save(); g.translate(0, 190); g.scale(pu, pu); fillRR(g, -300, -50, 600, 100, 50, "#c6f432"); txt(g, "Kostenloses Erstgespräch", 0, 3, { w: 800, px: 38, fam: "I", c: "#0b0d11" }); g.restore();
        const dl = out3(cl((u - T.web - 0.25) / 0.6)); if (dl > 0) drone(g, lerp(560, 300, dl), lerp(-700, -400, dl) + Math.sin(u * 4) * 6, 0.7, u, false); }
      g.restore();
    },
    ev(d, p) {
      const V = p._t, T = V.T, E = [];
      V.main.forEach((s, i) => { if (i < 14 || i % 4 === 0) E.push([s.t, "vslap", i < 14 ? 0.55 : 0.3, (s.x - 540) / 600]); });
      V.extra.forEach((s, i) => { if (i % 2 === 0) E.push([s.t, "vslap", 0.3, (s.x - 540) / 600]); });
      E.push([T.weil - 0.05, "whoosh_side", 0.5, 0]); E.push([T.weil, "tbuzz", 0.45, 0.4]);
      [0, 1, 2].forEach((i) => { const h = T.abg - 0.35 + i * 0.2; E.push([h - 0.45, "twhistle", 0.35, (i - 1) * 0.6]); E.push([h, "boom", 0.9, (i - 1) * 0.6]); });
      E.push([T.jetzt - 0.3, "tbuzz", 0.4, 0.6]); E.push([T.jetzt + 0.35, "vscan", 0.5, 0.2]);
      if (p.reveal) { E.push([T.landet - 0.05, "riser", 0.7, 0, Math.max(0.3, d - T.landet + 0.05)]); return E.filter((e) => e[0] < d + 0.1); }
      E.push([T.code - 0.05, "whoosh_up", 0.6, 0]); for (let i = 0; i < 6; i++) E.push([T.code + 0.35 + i * 0.09, "vbeep", 0.35, (i % 3 - 1) * 0.4]);
      const url = "https://" + (p.url || "mihajlostanojevic.com"); for (let i = 0; i < url.length; i += 2) E.push([T.landet + 0.5 * i / url.length, "key", 0.25, 0]);
      E.push([T.web - 0.05, "ding", 0.45, 0]); E.push([T.web + 0.05, "shimmer", 0.3, 0]);
      return E.filter((e) => e[0] < d + 0.1);
    },
  };
})();
