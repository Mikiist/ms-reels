// story_kit: gemeinsame Bausteine für Neugier-Geschichten (Comic-Figuren, Sprechblasen, Kamera, Wetter, Filmtitel-Schluss).
// Wird vor den Geschichten geladen (index.js). Nutzung: SK.person(g, x, feet, s, o), SK.bubble(...), SK.cam(...), SK.endTitle(...).
// Keine Szene hier (kein TYPES.*), nur Helfer. Alles deterministisch aus u.
const SK = (() => {
  const OL = "#2b1d14", INK = "#1b1530";
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  const mix = (a, b, k) => { const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16)); return `rgb(${pa.map((v, i) => Math.round(lerp(v, pb[i], cl(k)))).join(",")})`; };
  // Wortzeiten einer Szene: f(/^wort/, nach, standard) liefert Sekunden seit Szenenstart
  function finder(o) { const W0 = (SPEC.words || []).filter((w) => w.scene === o.i); return (re, after = 0, def = null) => { const w = W0.find((x) => x.t - o.t0 >= after - 1e-6 && re.test(norm(x.w))); return w ? w.t - o.t0 : def; }; }
  // Kamera aus Schlüsselbildern [{t, z, x, y}], liefert {z, x, y}
  function cam(KF, u) { let z = KF[0].z, x = KF[0].x, y = KF[0].y; for (let i = 1; i < KF.length; i++) { const A = KF[i - 1], B = KF[i]; if (u >= A.t) { const k = inOut(cl((u - A.t) / Math.max(0.05, B.t - A.t))); z = lerp(A.z, B.z, k); x = lerp(A.x, B.x, k); y = lerp(A.y, B.y, k); } } return { z, x, y }; }
  function apply(g, c, sx = 0, sy = 0) { g.translate(540 + sx, 960 + sy); g.scale(c.z, c.z); g.translate(-c.x, -c.y); }
  function toScreen(c, x, y) { return [(x - c.x) * c.z + 540, (y - c.y) * c.z + 960]; }

  function richLine(g, s, x, y, px, c, hi) {
    const parts = s.split("*"); g.font = `900 ${px}px D`; let tw = 0; parts.forEach((t) => { tw += g.measureText(t).width; });
    let cx = x - tw / 2; g.textAlign = "left"; g.textBaseline = "middle"; parts.forEach((t, i) => { g.fillStyle = i % 2 ? hi : c; g.fillText(t, cx, y); cx += g.measureText(t).width; });
  }
  // Sprechblase in Bildschirm-Koordinaten, Spitze zeigt auf (tx, ty). k 0..1 (Aufploppen), o: {px, shout, think, fill, c, hi}
  function bubble(g, lines, x, y, tx, ty, k, o = {}) {
    if (k <= 0) return; const px = o.px || 50; g.font = `900 ${px}px D`;
    const w = Math.max(...lines.map((l) => g.measureText(l.replace(/\*/g, "")).width)) + 90, h = lines.length * px * 1.18 + 64;
    const e = outBack(cl(k), 2.2); g.save(); g.translate(tx + (x - tx) * e, ty + (y - ty) * e); g.scale(e, e); g.translate(-x, -y);
    g.lineWidth = 7; g.strokeStyle = OL; g.lineJoin = "round"; const fill = o.fill || "#ffffff"; g.fillStyle = fill; shadow(g, 0, 10, "rgba(0,0,0,0.22)");
    const ang = Math.atan2(ty - y, tx - x);
    if (o.think) { for (let i = 0; i < 3; i++) { const f = 0.62 + i * 0.13, r = 12 - i * 3; const bx = x + (tx - x) * f, by = y + (ty - y) * f; g.beginPath(); g.arc(bx, by, r, 0, 7); g.fill(); g.stroke(); } }
    else { const bx = x + Math.cos(ang) * w * 0.22, by = y + Math.sin(ang) * h * 0.22, pr = 30, ex = x + (tx - x) * 0.62, ey = y + (ty - y) * 0.62;
      g.beginPath(); g.moveTo(bx + Math.cos(ang + 1.57) * pr, by + Math.sin(ang + 1.57) * pr); g.lineTo(ex, ey); g.lineTo(bx + Math.cos(ang - 1.57) * pr, by + Math.sin(ang - 1.57) * pr); g.closePath(); g.fill(); g.stroke(); }
    g.fillStyle = fill; g.beginPath();
    if (o.shout) { const n = 22; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, r = i % 2 ? 1 : 1.13 + 0.05 * Math.sin(i * 3.3); const qx = x + Math.cos(a) * (w / 2 + 26) * r, qy = y + Math.sin(a) * (h / 2 + 26) * r; i ? g.lineTo(qx, qy) : g.moveTo(qx, qy); } g.closePath(); g.fill(); noShadow(g); g.stroke(); }
    else if (o.think) { const n = 9; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; g.moveTo(x + Math.cos(a) * w * 0.5 + 40, y + Math.sin(a) * h * 0.5); g.arc(x + Math.cos(a) * w * 0.47, y + Math.sin(a) * h * 0.47, 44, 0, 7); } g.fill(); noShadow(g); g.stroke(); g.beginPath(); g.ellipse(x, y, w * 0.5, h * 0.5, 0, 0, 7); g.fill(); }
    else { g.roundRect(x - w / 2, y - h / 2, w, h, h / 2 > 60 ? 50 : h / 2); g.fill(); noShadow(g); g.stroke(); }
    lines.forEach((l, i) => richLine(g, l, x, y + (i - (lines.length - 1) / 2) * px * 1.18 + 2, px, o.c || INK, o.hi || "#e5243b"));
    g.restore();
  }
  // Comic-Schriftzug (BAM!) in Bildschirm-Koordinaten
  function pow(g, s, x, y, k, o = {}) { if (k <= 0 || k >= 1) return; const e = outBack(cl(k * 3), 3); g.save(); g.translate(x, y); g.rotate(o.rot || -0.12); g.scale(e, e); g.globalAlpha = cl((1 - k) * 3);
    g.lineWidth = 16; g.strokeStyle = OL; g.lineJoin = "round"; g.font = `900 ${o.px || 120}px D`; g.textAlign = "center"; g.textBaseline = "middle"; g.strokeText(s, 0, 0); g.fillStyle = o.c || "#ffd34d"; g.fillText(s, 0, 0); g.restore(); }

  // ---------- Figur ----------
  // Füße bei (x, feet). s = Maßstab (1 = ca. 600 px hoch). o: skin, hair, hs (short|long|bun|bald|grey|cap), shirt, pants, shoes, skirt,
  // aL, aR (Armwinkel, 0 = waagerecht nach außen, + nach unten), eL/eR (Ellbogen-Knick), mouth (smile|grin|open|shout|flat|o|sad),
  // eyes (dot|happy|wide|closed|wink|side), brow (-1 traurig .. 1 wütend), red 0..1, walk (Phase), sit, glasses, flip, look (-1..1 Blick), bob, beard, apron
  function person(g, x, feet, s, o = {}) {
    g.save(); g.translate(x, feet + (o.bob || 0)); g.scale(s * (o.flip ? -1 : 1), s); g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round"; g.lineCap = "round";
    const skin = mix(o.skin || "#f1c7a1", "#e0303a", (o.red || 0) * 0.8), shirt = o.shirt || "#4b7fd6", pants = o.pants || "#33374a", shoes = o.shoes || "#1e1e24";
    const sit = !!o.sit; const wl = o.walk != null ? Math.sin(o.walk) : 0;
    // Beine
    if (sit) { g.fillStyle = pants; rr(g, -60, -190, 140, 46, 20); g.fill(); g.stroke(); rr(g, 40, -190, 44, 190, 18); g.fill(); g.stroke(); rr(g, -14, -190, 44, 190, 18); g.fill(); g.stroke();
      g.fillStyle = shoes; rr(g, 30, -26, 76, 30, 14); g.fill(); g.stroke(); rr(g, -24, -26, 76, 30, 14); g.fill(); g.stroke(); }
    else { const leg = (lx, ph) => { g.save(); g.translate(lx, -215); g.rotate(ph * 0.35); g.fillStyle = pants; rr(g, -25, 0, 50, 215, 18); g.fill(); g.stroke(); g.fillStyle = shoes; rr(g, -36, 189, 76, 30, 14); g.fill(); g.stroke(); g.restore(); };
      leg(-37, wl); leg(37, -wl); }
    const by = sit ? 140 : 0; // Oberkörper sitzt tiefer
    g.save(); g.translate(0, by);
    // Rock / Schürze
    if (o.skirt) { g.fillStyle = o.skirt; g.beginPath(); g.moveTo(-95, -260); g.lineTo(95, -260); g.lineTo(120, -150); g.lineTo(-120, -150); g.closePath(); g.fill(); g.stroke(); }
    // Rumpf
    g.fillStyle = shirt; g.beginPath(); g.ellipse(0, -330, 112, 140, 0, 0, 7); g.fill(); g.stroke();
    if (o.apron) { g.fillStyle = o.apron; g.beginPath(); g.moveTo(-60, -420); g.lineTo(60, -420); g.lineTo(78, -210); g.lineTo(-78, -210); g.closePath(); g.fill(); g.stroke(); }
    if (o.scarf) { g.fillStyle = o.scarf; rr(g, -70, -470, 140, 40, 18); g.fill(); g.stroke(); rr(g, 20, -450, 34, 110, 14); g.fill(); g.stroke(); }
    // Arme (Schulter, Ellbogen, Hand)
    const arm = (side, a, bend) => { const sx = side * 92, sy = -410; const ax = Math.cos(a), ay = Math.sin(a); const ex = sx + side * ax * 95, ey = sy + ay * 95; const b = a + side * (bend || 0); const hx = ex + side * Math.cos(b) * 90, hy = ey + Math.sin(b) * 90;
      g.lineWidth = 42; g.strokeStyle = OL; g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.lineTo(hx, hy); g.stroke(); g.lineWidth = 28; g.strokeStyle = shirt; g.stroke(); g.lineWidth = 8; g.strokeStyle = OL;
      g.fillStyle = skin; g.beginPath(); g.arc(hx, hy, 22, 0, 7); g.fill(); g.stroke(); return [hx, hy]; };
    const aL = o.aL != null ? o.aL : 1.25 + wl * 0.25, aR = o.aR != null ? o.aR : 1.25 - wl * 0.25;
    const hL = arm(-1, Math.PI - aL > 0 ? aL : aL, o.eL || 0), hR = arm(1, aR, o.eR || 0);
    if (o.hold) o.hold(g, hR, hL);
    // Kopf
    const hy = -545; g.fillStyle = skin; g.beginPath(); g.arc(0, hy, 72, 0, 7); g.fill(); g.stroke();
    const hair = o.hair || "#5b3a23", hs = o.hs || "short";
    g.fillStyle = hair;
    if (hs === "short") { g.beginPath(); g.arc(0, hy - 8, 74, Math.PI * 1.05, Math.PI * 1.95); g.quadraticCurveTo(30, hy - 40, -66, hy - 30); g.closePath(); g.fill(); g.stroke(); }
    else if (hs === "long") { g.beginPath(); g.moveTo(-74, hy + 70); g.lineTo(-80, hy - 10); g.arc(0, hy - 8, 80, Math.PI, 0); g.lineTo(80, hy + 70); g.quadraticCurveTo(60, hy + 10, 50, hy - 40); g.quadraticCurveTo(0, hy - 20, -50, hy - 40); g.quadraticCurveTo(-60, hy + 10, -74, hy + 70); g.closePath(); g.fill(); g.stroke(); }
    else if (hs === "bun") { g.beginPath(); g.arc(0, hy - 92, 34, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.arc(0, hy - 8, 75, Math.PI * 1.02, Math.PI * 1.98); g.quadraticCurveTo(0, hy - 50, -70, hy - 26); g.closePath(); g.fill(); g.stroke(); }
    else if (hs === "grey") { g.fillStyle = o.hair || "#d9d9de"; g.beginPath(); g.ellipse(-62, hy - 6, 18, 34, 0.2, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.ellipse(62, hy - 6, 18, 34, -0.2, 0, 7); g.fill(); g.stroke(); }
    else if (hs === "cap") { g.fillStyle = o.hair || "#c0392b"; g.beginPath(); g.arc(0, hy - 18, 74, Math.PI, 0); g.closePath(); g.fill(); g.stroke(); rr(g, -10, hy - 30, 110, 22, 10); g.fill(); g.stroke(); }
    // Gesicht
    const eyes = o.eyes || "dot", lk = (o.look || 0) * 10, brow = o.brow || 0; g.fillStyle = OL; g.strokeStyle = OL;
    const ey = hy - 8;
    if (eyes === "happy") { g.lineWidth = 8; g.beginPath(); g.arc(-26, ey + 4, 13, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.beginPath(); g.arc(26, ey + 4, 13, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    else if (eyes === "closed") { g.lineWidth = 8; g.beginPath(); g.moveTo(-38, ey); g.lineTo(-14, ey); g.moveTo(14, ey); g.lineTo(38, ey); g.stroke(); }
    else if (eyes === "wink") { g.beginPath(); g.arc(-26 + lk, ey, 9, 0, 7); g.fill(); g.lineWidth = 8; g.beginPath(); g.arc(26, ey + 4, 13, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    else if (eyes === "wide") { g.fillStyle = "#fff"; g.beginPath(); g.arc(-26, ey, 17, 0, 7); g.arc(26, ey, 17, 0, 7); g.fill(); g.lineWidth = 5; g.beginPath(); g.arc(-26, ey, 17, 0, 7); g.stroke(); g.beginPath(); g.arc(26, ey, 17, 0, 7); g.stroke(); g.fillStyle = OL; g.beginPath(); g.arc(-26 + lk, ey, 7, 0, 7); g.arc(26 + lk, ey, 7, 0, 7); g.fill(); }
    else { g.beginPath(); g.arc(-26 + lk, ey, 9, 0, 7); g.arc(26 + lk, ey, 9, 0, 7); g.fill(); }
    if (o.glasses) { g.lineWidth = 5; g.beginPath(); g.arc(-26, ey, 22, 0, 7); g.stroke(); g.beginPath(); g.arc(26, ey, 22, 0, 7); g.stroke(); g.beginPath(); g.moveTo(-4, ey); g.lineTo(4, ey); g.stroke(); }
    if (brow) { g.lineWidth = 9; const t = brow * 12; g.beginPath(); g.moveTo(-46, ey - 28 - t); g.lineTo(-12, ey - 24 + t); g.moveTo(46, ey - 28 - t); g.lineTo(12, ey - 24 + t); g.stroke(); }
    if (o.beard) { g.fillStyle = o.beard; g.beginPath(); g.arc(0, hy + 20, 66, 0.15, Math.PI - 0.15); g.quadraticCurveTo(0, hy + 40, 63, hy + 30); g.fill(); }
    const m = o.mouth || "smile", my = hy + 38; g.lineWidth = 7; g.strokeStyle = OL;
    if (m === "smile") { g.beginPath(); g.arc(0, my - 12, 22, 0.35, Math.PI - 0.35); g.stroke(); }
    else if (m === "grin") { g.fillStyle = "#7a1f2a"; g.beginPath(); g.arc(0, my - 6, 26, 0.1, Math.PI - 0.1); g.closePath(); g.fill(); g.stroke(); g.fillStyle = "rgba(255,90,120,0.45)"; g.beginPath(); g.arc(-46, hy + 18, 13, 0, 7); g.arc(46, hy + 18, 13, 0, 7); g.fill(); }
    else if (m === "open" || m === "shout") { const k = m === "shout" ? 1 : 0.5; g.fillStyle = "#7a1f2a"; g.beginPath(); g.ellipse(0, my + 4, 20 + 4 * k, 9 + 18 * k, 0, 0, 7); g.fill(); g.stroke(); }
    else if (m === "o") { g.fillStyle = "#7a1f2a"; g.beginPath(); g.ellipse(0, my + 2, 11, 14, 0, 0, 7); g.fill(); g.stroke(); }
    else if (m === "sad") { g.beginPath(); g.arc(0, my + 16, 20, Math.PI + 0.5, -0.5); g.stroke(); }
    else { g.beginPath(); g.moveTo(-16, my); g.lineTo(16, my); g.stroke(); }
    if (o.red > 0.5) { g.fillStyle = "#7fd0ff"; g.lineWidth = 4; const t = ((o.t || 0) * 1.6) % 1; const sx = 70, sy = hy - 30 + t * 60; g.beginPath(); g.moveTo(sx, sy - 18); g.quadraticCurveTo(sx + 13, sy + 4, sx, sy + 8); g.quadraticCurveTo(sx - 13, sy + 4, sx, sy - 18); g.fill(); g.stroke(); }
    g.restore(); g.restore();
  }
  // Klappstuhl (Füße bei y)
  function chair(g, x, y, s, c = "#3d7f6a") { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 10; g.strokeStyle = OL; g.lineCap = "round";
    g.beginPath(); g.moveTo(-60, 0); g.lineTo(60, -160); g.moveTo(60, 0); g.lineTo(-60, -160); g.stroke(); g.lineWidth = 7; g.strokeStyle = "#9aa1ab"; g.stroke();
    g.fillStyle = c; g.strokeStyle = OL; g.lineWidth = 7; rr(g, -80, -170, 160, 26, 8); g.fill(); g.stroke(); rr(g, -70, -330, 18, 170, 6); g.fill(); g.stroke(); rr(g, -76, -330, 70, 90, 10); g.fill(); g.stroke(); g.restore(); }
  function umbrella(g, x, y, s, c, tilt = 0) { g.save(); g.translate(x, y); g.rotate(tilt); g.scale(s, s); g.lineWidth = 7; g.strokeStyle = OL; g.fillStyle = c;
    g.beginPath(); g.moveTo(-150, 0); g.quadraticCurveTo(-150, -120, 0, -130); g.quadraticCurveTo(150, -120, 150, 0); for (let i = 0; i < 4; i++) g.quadraticCurveTo(112 - i * 75, -26, 75 - i * 75, 0); g.closePath(); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(0, -130); g.lineTo(0, 170); g.stroke(); g.beginPath(); g.arc(-18, 170, 18, 0, Math.PI); g.stroke(); g.restore(); }
  function rain(g, u, a, n = 110, ang = 10) { if (a <= 0) return; g.save(); g.strokeStyle = `rgba(210,225,255,${0.55 * a})`; g.lineWidth = 3; for (let i = 0; i < n; i++) { const x = (rnd(i * 3.1) * 1300 + u * 160) % 1300 - 110, y = (rnd(i * 7.7) * 2100 + u * (1500 + rnd(i) * 700)) % 2100 - 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x - ang, y + 48); g.stroke(); } g.restore(); }
  function qmarks(g, x, y, u, k, n = 3, c = "#ffd34d") { if (k <= 0) return; for (let i = 0; i < n; i++) { const e = outBack(cl(k * 2 - i * 0.3), 3); if (e <= 0) continue; const px = x + (i - (n - 1) / 2) * 90, py = y - Math.abs(i - (n - 1) / 2) * 30 + Math.sin(u * 5 + i) * 8;
      g.save(); g.translate(px, py); g.rotate((i - 1) * 0.25 + Math.sin(u * 4 + i) * 0.08); g.scale(e, e); g.lineWidth = 12; g.strokeStyle = OL; g.lineJoin = "round"; g.font = "900 120px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.strokeText("?", 0, 0); g.fillStyle = c; g.fillText("?", 0, 0); g.restore(); } }
  function speedLines(g, cx, cy, k, c = "rgba(255,255,255,") { if (k <= 0) return; g.save(); for (let i = 0; i < 40; i++) { const a = rnd(i * 2.1) * Math.PI * 2, r0 = 380 + rnd(i * 5.5) * 300; g.strokeStyle = c + (0.5 * k) + ")"; g.lineWidth = 6 + rnd(i) * 10; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * 1400, cy + Math.sin(a) * 1400); g.stroke(); } g.restore(); }
  function whiteOut(g, u, d, k0 = 0.16) { const wf = cl((u - (d - k0)) / k0); if (wf > 0) { g.fillStyle = `rgba(255,255,255,${wf})`; g.fillRect(0, 0, W, H); } }
  function flashAt(g, u, ts, w = 0.1, a = 0.7) { let f = 0; ts.forEach((t) => { f = Math.max(f, 1 - cl(Math.abs(u - t) / w)); }); if (f > 0) { g.fillStyle = `rgba(255,255,255,${f * a})`; g.fillRect(0, 0, W, H); } }

  // ---------- Schluss: ruhiger Filmtitel (Vorbild gastro_end) ----------
  // T: {sys, offer, komm, web} (Sekunden), o: {c (Titelfarbe), glow, accent, offer (Text), line (Unterzeile), y (Titel-y), dark (Hintergrund ist dunkel)}
  function endTitle(g, u, d, T, o) {
    const name = "Mihajlo Systems", cy = o.y || 860; g.save(); const z = 1.06 - 0.06 * out3(cl(u / 2.5)); g.translate(540, cy); g.scale(z, z);
    g.font = "400 156px S"; const tw = g.measureText(name).width; let x = -tw / 2;
    name.split("").forEach((ch, i) => { const w = g.measureText(ch).width; const k = cl((u - 0.08 - i * 0.045) / 0.5); if (k > 0) { g.save(); g.globalAlpha = k; g.filter = k < 1 ? `blur(${(1 - k) * 12}px)` : "none"; g.fillStyle = o.c; g.textAlign = "left"; g.textBaseline = "middle"; g.shadowColor = o.glow; g.shadowBlur = 40; g.fillText(ch, x, (1 - out3(k)) * 20); g.restore(); } x += w; });
    const lk = out3(seg(u, 0.6, 1.4)); g.strokeStyle = o.accent; g.lineWidth = 2; g.beginPath(); g.moveTo(-lk * 380, 120); g.lineTo(lk * 380, 120); g.stroke();
    const bk = seg(u, T.offer - 0.2, T.offer + 0.3); if (bk > 0) { g.globalAlpha = bk; g.letterSpacing = "10px"; g.font = "600 36px I"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = o.sub || o.c; g.fillText(o.offer, 0, 185); g.letterSpacing = "0px"; g.globalAlpha = 1; }
    g.restore();
    const ck = seg(u, T.komm - 0.2, T.komm + 0.3); if (ck > 0) { g.save(); g.globalAlpha = ck; g.translate(0, (1 - out3(ck)) * 30); g.font = "italic 400 64px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = o.c; g.fillText("Kommentieren Sie", 540, 1260); g.restore(); }
    const wk = seg(u, T.web - 0.1, T.web + 0.35); if (wk > 0) { g.save(); g.globalAlpha = wk; g.letterSpacing = "18px"; g.font = "700 78px I"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = o.key || o.accent; g.fillText("WEBSITE", 549, 1370); g.restore();
      const ul = out3(seg(u, T.web + 0.1, T.web + 0.7)); g.strokeStyle = o.accent; g.lineWidth = 3; g.beginPath(); g.moveTo(540 - 230 * ul, 1428); g.lineTo(540 + 230 * ul, 1428); g.stroke();
      const sk = seg(u, T.web + 0.5, T.web + 0.9); if (sk > 0) { g.save(); g.globalAlpha = sk * 0.8; g.font = "400 32px I"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = o.sub || o.c; g.fillText(o.line || "und ich zeige Ihnen, wie das bei Ihnen aussieht.", 540, 1500); g.restore(); } }
  }
  function endTimes(o) { const f = finder(o); const sys = f(/^systems/, 0, 0.8); const komm = f(/^kommentieren/, sys, 2.8); return { f, sys, komm, web: f(/^website/, komm, komm + 0.6) }; }

  return { OL, INK, norm, mix, finder, cam, apply, toScreen, bubble, pow, person, chair, umbrella, rain, qmarks, speedLines, whiteOut, flashAt, endTitle, endTimes };
})();
