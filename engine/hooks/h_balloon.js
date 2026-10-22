// VOICE_DELAY: 0.5
// h_balloon: Glänzender Latexballon wird ab Bild 0 ruckweise aufgepumpt, eine Nadel nähert sich in Zeitlupe, POP.
// Parameter: color (Standard "#e0162b", auch "rot", "blau" …), label (Standard "IHRE WEBSITE"), pop_text (optional, Standard leer).
try { document.fonts.load("900 120px D"); document.fonts.load("800 120px D"); } catch (e) {}

const HBAL = { RX: 322, RY: 364, CX: 466, YB: 1236, TH: -0.56 };
const HBAL_NAMED = { rot: "#e0162b", red: "#e0162b", blau: "#1d5fe0", blue: "#1d5fe0", gruen: "#14a35b", grün: "#14a35b", green: "#14a35b", gelb: "#f2b705", yellow: "#f2b705",
  pink: "#ec3d8f", lila: "#7c3aed", violett: "#7c3aed", orange: "#f26a0f", gold: "#d9a21b", schwarz: "#22252c", black: "#22252c" };
function hbalCol(p) {
  let c = String(p.color || "#e0162b").trim().toLowerCase(); if (HBAL_NAMED[c]) c = HBAL_NAMED[c];
  if (/^#[0-9a-f]{3}$/.test(c)) c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
  return /^#[0-9a-f]{6}$/.test(c) ? c : "#e0162b";
}
function hbalCv(w, h) { const c = document.createElement("canvas"); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }
function hbalRGB(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function hbalHS(x, a, b) { const t = cl((x - a) / (b - a)); return t * t * (3 - 2 * t); }

// Zeitplan aus der Szenendauer: Pumpstöße, Nadel, Knall
function hbalTimes(d) {
  const tPop = Math.max(1.15, d - 0.55);
  const tPumpEnd = tPop * 0.56;
  const n = Math.max(3, Math.floor(tPumpEnd / 0.27) + 1);
  const pumps = []; for (let i = 0; i < n; i++) pumps.push(i * tPumpEnd / (n - 1));
  const tN0 = Math.max(0.3, tPumpEnd * 0.72);
  return { tPop, tPumpEnd, pumps, tN0 };
}
// Größe des Ballons (1 = voll), Wackeln nach jedem Pumpstoß, Spannung vor dem Knall
function hbalScale(u, T) {
  const n = T.pumps.length; const S = (i) => (i < 0 ? 0.66 : 0.66 + 0.29 * Math.pow((i + 1) / n, 0.85));
  let s = 0.66, wob = 0, k = -1;
  for (let i = 0; i < n; i++) if (u >= T.pumps[i]) k = i;
  if (k >= 0) { const p = T.pumps[k]; s = lerp(S(k - 1), S(k), outBack(seg(u, p, p + 0.17), 2.4)); const tt = u - p; wob = Math.exp(-tt * 7) * Math.sin(tt * 34) * 0.04; }
  const st = seg(u, T.tPumpEnd + 0.17, T.tPop); s += 0.05 * inOut(st);
  const tr = st * (0.006 * Math.sin(u * 83) + 0.004 * Math.sin(u * 131));
  return { s, sx: 1 + wob + tr, sy: 1 - wob * 0.8 - tr, strain: st };
}
// Abstand der Nadelspitze zur Haut (Pixel)
function hbalDist(u, T) {
  if (u < T.tN0) return null;
  const a = T.tN0, b = a + 0.3, c = T.tPop - 0.09;
  if (u < b) return lerp(860, 150, outExpo(seg(u, a, b)));
  if (u < c) return lerp(150, 14, 1 - Math.pow(1 - seg(u, b, c), 1.7));
  if (u < T.tPop) return lerp(14, -7, seg(u, c, T.tPop));
  return -7 + 46 * out3(seg(u - T.tPop, 0, 0.28));
}

// Ballon als Bild, Pixel für Pixel beleuchtet (Latex, Durchleuchten, Softbox-Spiegelung, gewölbte Aufschrift)
function hbalBake(rgb, thin, label) {
  const { RX, RY } = HBAL; const pad = 24; const IW = Math.ceil(2 * RX + 2 * pad), IH = Math.ceil(RY * 2.12 + 2 * pad);
  const ox = IW / 2, oy = pad + RY;
  const LW = 1100, LH = 470; const lc = hbalCv(LW, LH), lg = lc.getContext("2d");
  const words = String(label || "").trim().toUpperCase().split(/\s+/).filter(Boolean);
  let lines = [words.join(" ")];
  if (words.length >= 2 && lines[0].length > 8) { let best = null; for (let i = 1; i < words.length; i++) { const a = words.slice(0, i).join(" "), b = words.slice(i).join(" "); const m = Math.max(a.length, b.length); if (!best || m < best[0]) best = [m, a, b]; } lines = [best[1], best[2]]; }
  if (lines[0]) {
    let px = 210; for (const l of lines) px = Math.min(px, fitPx(lg, l, LW * 0.95, 210, 900)); if (lines.length === 1) px = Math.min(px, 230);
    lg.fillStyle = "#fff"; lg.textAlign = "center"; lg.textBaseline = "middle"; font(lg, 900, px);
    if (lines.length === 2) { lg.fillText(lines[0], LW / 2, LH * 0.28); lg.fillText(lines[1], LW / 2, LH * 0.74); } else lg.fillText(lines[0], LW / 2, LH * 0.5);
  }
  const la = lg.getImageData(0, 0, LW, LH).data;
  const LON = 1.0, LAT1 = 0.25, LAT0 = -0.45;
  const c = hbalCv(IW, IH), g = c.getContext("2d"); const im = g.createImageData(IW, IH), Dd = im.data;
  let br = rgb[0] / 255, bgc = rgb[1] / 255, bb = rgb[2] / 255;
  if (thin) { br = br * 0.8 + 0.2 * Math.min(1, br * 1.5); bgc = bgc * 0.8 + 0.2 * Math.min(1, bgc * 1.5 + 0.12); bb = bb * 0.8 + 0.2 * Math.min(1, bb * 1.5 + 0.1); }
  const nl = Math.hypot(-0.5, -0.78, 0.55), L = [-0.5 / nl, -0.78 / nl, 0.55 / nl];
  const hl = Math.hypot(L[0], L[1], L[2] + 1), Hh = [L[0] / hl, L[1] / hl, (L[2] + 1) / hl];
  const gl = thin ? 0.95 : 0.62;
  for (let y = 0; y < IH; y++) {
    const Yr = (y + 0.5 - oy) / RY; const sB = Math.max(0, Yr); const Y = Yr / (1 + 0.07 * sB); const sx = 1 - 0.2 * sB * sB;
    for (let x = 0; x < IW; x++) {
      const X = (x + 0.5 - ox) / RX / sx; const r2 = X * X + Y * Y; if (r2 >= 1) continue;
      const rr = Math.sqrt(r2); const a = Math.min(1, (1 - rr) * RX * sx * 0.95 + 0.25);
      const nz = Math.sqrt(1 - r2), nx = X, ny = Y;
      const dif = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
      const nh = Math.max(0, nx * Hh[0] + ny * Hh[1] + nz * Hh[2]);
      const fr = Math.pow(1 - nz, 2.2);
      const glow = nz * nz * (0.22 + 0.4 * Math.max(0, ny + 0.25));
      const sh = 0.06 + 0.98 * dif;
      let R = br * sh + br * glow * gl, G = bgc * sh + bgc * glow * gl * 0.8, B = bb * sh + bb * glow * gl * 0.8;
      const env = fr * Math.max(0, 0.55 * nx + 0.65 * ny + 0.25); R += env * 0.30; G += env * 0.40; B += env * 0.58;
      // Aufschrift (weiße Farbe auf der Wölbung)
      const lon = Math.atan2(nx, nz), lat = Math.asin(-ny);
      const lu = (lon / LON * 0.5 + 0.5) * LW - 0.5, lv = (LAT1 - lat) / (LAT1 - LAT0) * LH - 0.5;
      if (lu >= 0 && lu < LW - 1 && lv >= 0 && lv < LH - 1) {
        const ix = lu | 0, iy = lv | 0, fx = lu - ix, fy = lv - iy, q = (iy * LW + ix) * 4 + 3;
        const al = ((la[q] * (1 - fx) + la[q + 4] * fx) * (1 - fy) + (la[q + LW * 4] * (1 - fx) + la[q + LW * 4 + 4] * fx) * fy) / 255;
        if (al > 0) { const ia = al * 0.96, ish = 0.34 + 0.85 * dif + glow * 0.15; R = R * (1 - ia) + ia * ish; G = G * (1 - ia) + ia * ish * 0.97; B = B * (1 - ia) + ia * ish * 0.95; }
      }
      // Glanz: Punktlicht, Softbox oben links, Streiflicht rechts
      const Rx = 2 * nz * nx, Ry = 2 * nz * ny;
      const ex_ = (Rx + 0.5) * 0.8 - (Ry + 0.66) * 0.6, ey_ = (Rx + 0.5) * 0.6 + (Ry + 0.66) * 0.8; const box = 1 - hbalHS(Math.sqrt((ex_ / 0.2) ** 2 + (ey_ / 0.075) ** 2), 0.55, 1.05);
      const strip = hbalHS(Rx, 0.6, 0.68) * (1 - hbalHS(Rx, 0.78, 0.86)) * hbalHS(Ry, -0.38, -0.22) * (1 - hbalHS(Ry, 0.3, 0.48));
      const wht = Math.pow(nh, 110) * 1.3 + Math.pow(nh, 16) * 0.09 + box * 0.75 + strip * 0.3;
      R += wht; G += wht; B += wht;
      const i = (y * IW + x) * 4;
      Dd[i] = Math.min(255, R * 255); Dd[i + 1] = Math.min(255, G * 255); Dd[i + 2] = Math.min(255, B * 255); Dd[i + 3] = a * 255;
    }
  }
  g.putImageData(im, 0, 0);
  return { c, ox, oy, IW, IH };
}

TYPES.h_balloon = {
  zone: "bottom", pal: "night", bgv: 0, coverT: 1.55,
  prep(sc, p) {
    const col = hbalCol(p), rgb = hbalRGB(col); const st = sc.st; st.col = col; st.rgb = rgb;
    const label = p.label != null ? p.label : "IHRE WEBSITE";
    st.b = hbalBake(rgb, false, label); st.bt = hbalBake(rgb, true, label);
    // Hintergrund: dunkles Studio, Spot von oben, unscharfe Lichter
    const bg = hbalCv(W, H), g = bg.getContext("2d");
    let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0d1528"); gr.addColorStop(0.55, "#070b16"); gr.addColorStop(1, "#020308"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    let rg = g.createRadialGradient(540, 760, 0, 540, 760, 980); rg.addColorStop(0, "rgba(70,105,170,0.30)"); rg.addColorStop(0.5, "rgba(40,60,110,0.12)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 16; i++) {
      const x = rnd(i * 3.1 + 1) * W, y = 300 + rnd(i * 7.7 + 2) * 1300, r = 30 + rnd(i * 5.3) * 90, warm = i % 3 === 0;
      const c = warm ? hexA(col, 0.05 + 0.05 * rnd(i)) : `rgba(120,160,230,${0.05 + 0.07 * rnd(i * 2)})`;
      const bgr = g.createRadialGradient(x, y, 0, x, y, r); bgr.addColorStop(0, c); bgr.addColorStop(0.75, c); bgr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = bgr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
    }
    st.bg = bg;
    // Nadel: Stahlschaft mit Glanzlinie, Perlkopf
    const nc = hbalCv(400, 110), ng = nc.getContext("2d"); const ny = 55;
    ng.beginPath(); ng.moveTo(6, ny); ng.lineTo(120, ny - 10); ng.lineTo(300, ny - 10.5); ng.lineTo(300, ny + 10.5); ng.lineTo(120, ny + 10); ng.closePath();
    gr = ng.createLinearGradient(0, ny - 10, 0, ny + 10); gr.addColorStop(0, "#4d5563"); gr.addColorStop(0.25, "#eef2f7"); gr.addColorStop(0.42, "#ffffff"); gr.addColorStop(0.6, "#97a0af"); gr.addColorStop(1, "#262a33");
    ng.fillStyle = gr; ng.fill();
    rg = ng.createRadialGradient(312, ny - 16, 3, 326, ny, 44); rg.addColorStop(0, "#fff8d8"); rg.addColorStop(0.22, "#ffd34d"); rg.addColorStop(0.72, "#c98a0a"); rg.addColorStop(1, "#5a3800");
    ng.fillStyle = rg; ng.beginPath(); ng.arc(326, ny, 42, 0, 7); ng.fill();
    ng.fillStyle = "rgba(255,255,255,0.92)"; ng.beginPath(); ng.ellipse(310, ny - 19, 13, 7, -0.4, 0, 7); ng.fill();
    st.needle = nc;
    // Fetzen: Bild des gespannten Ballons in zerrissene Stücke schneiden
    const B = st.bt; const frags = []; const NS = 10; const ang = []; for (let k = 0; k <= NS; k++) ang.push(k * Math.PI * 2 / NS + (k < NS ? (rnd(k * 9.1) - 0.5) * 0.35 : (rnd(0) - 0.5) * 0.35) + HBAL.TH);
    const rMid = []; for (let k = 0; k <= NS; k++) rMid.push(0.5 + (rnd(k * 4.7 + 1) - 0.5) * 0.18); rMid[NS] = rMid[0];
    const P = (a, r) => [B.ox + Math.cos(a) * r * HBAL.RX * (1 - 0.2 * Math.max(0, Math.sin(a) * r) ** 2), B.oy + Math.sin(a) * r * HBAL.RY * (Math.sin(a) > 0 ? 1.07 : 1)];
    const jag = (k, s) => (rnd(k * 13.7 + s * 3.3) - 0.5);
    const addPoly = (pts, id) => {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      x0 = Math.floor(x0) - 2; y0 = Math.floor(y0) - 2; const w = Math.ceil(x1 - x0) + 4, h = Math.ceil(y1 - y0) + 4; if (w < 4 || h < 4) return;
      const mk = (back) => { const cc = hbalCv(w, h), cg = cc.getContext("2d"); cg.beginPath(); pts.forEach(([x, y], j) => (j ? cg.lineTo(x - x0, y - y0) : cg.moveTo(x - x0, y - y0))); cg.closePath(); cg.save(); cg.clip(); cg.drawImage(B.c, -x0, -y0);
        if (back) { cg.globalCompositeOperation = "source-atop"; cg.fillStyle = "rgba(25,0,6,0.55)"; cg.fillRect(0, 0, w, h); } cg.restore();
        cg.globalCompositeOperation = "source-atop"; cg.strokeStyle = back ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.18)"; cg.lineWidth = 3; cg.stroke(); return cc; };
      let mx = 0, my = 0; pts.forEach(([x, y]) => { mx += x; my += y; }); mx /= pts.length; my /= pts.length;
      frags.push({ c: mk(false), cb: mk(true), ax: mx - x0, ay: my - y0, cx: mx - B.ox, cy: my - B.oy, id });
    };
    for (let k = 0; k < NS; k++) {
      const a0 = ang[k], a1 = ang[k + 1]; const outer = [], inner = [];
      for (let j = 0; j <= 6; j++) { const a = lerp(a0, a1, j / 6); outer.push(P(a, 1.12)); }
      for (let j = 1; j < 4; j++) { const a = a1 + jag(k + 1, j) * 0.16; const r = lerp(1.12, rMid[k + 1], j / 4); outer.push(P(a, r)); }
      for (let j = 0; j <= 4; j++) { const a = lerp(a1, a0, j / 4); const r = lerp(rMid[k + 1], rMid[k], j / 4) + (j % 4 ? jag(k, j + 7) * 0.12 : 0); outer.push(P(a, r)); inner.push(P(a, r)); }
      for (let j = 1; j < 4; j++) { const a = a0 + jag(k, j) * 0.16; const r = lerp(rMid[k], 1.12, j / 4); outer.push(P(a, r)); }
      addPoly(outer, k);
      if (k % 2 === 0) { // inneres Stück über zwei Sektoren
        const a2 = ang[k + 2]; const pts = [];
        for (let j = 0; j <= 8; j++) { const a = lerp(a0, a2, j / 8); const r = (j <= 4 ? lerp(rMid[k], rMid[k + 1], j / 4) : lerp(rMid[k + 1], rMid[k + 2], (j - 4) / 4)) + (j % 4 ? jag(k, j + 20) * 0.1 : 0); pts.push(P(a, r)); }
        for (let j = 1; j < 3; j++) pts.push(P(a2 + jag(k, j + 30) * 0.3, rMid[k + 2] * (1 - j / 3)));
        pts.push(P(a0 + 0.4, 0.05));
        for (let j = 1; j < 3; j++) pts.push(P(a0 + jag(k, j + 40) * 0.3, rMid[k] * (j / 3)));
        addPoly(pts, 100 + k);
      }
    }
    st.frags = frags;
  },
  draw(g, u, d, p, sc, P) {
    const st = sc.st, T = hbalTimes(d), tp = T.tPop, k = u - tp, popped = k >= 0;
    const appr = seg(u, T.tN0, tp);
    // Kamera: langsam auf die Nadel zu, nach dem Knall zurück und Stoß
    let z = 1 + 0.12 * inOut(appr), shx = 0, shy = 0;
    if (popped) { z = lerp(1.12, 0.985, out3(seg(k, 0, 0.32))); if (k < 0.5) { const a = 26 * Math.exp(-k / 0.085); shx = Math.sin(k * 97) * a; shy = Math.cos(k * 83) * a; } }
    const Fx = 640, Fy = 760;
    g.save(); g.translate(540, 960); g.scale(1 + (z - 1) * 0.35, 1 + (z - 1) * 0.35); g.drawImage(st.bg, -540 + shx * 0.3, -960 + shy * 0.3); g.restore();
    const now = hbalScale(u, T), atPop = hbalScale(tp - 0.0001, T); const sP = atPop.s;
    const cyOf = (sc_) => HBAL.YB - 1.07 * HBAL.RY * sc_.s * sc_.sy;
    const cyP = cyOf(atPop);
    // Kontaktpunkt und Normale (am Ballon beim Knall)
    const th = HBAL.TH; const cpx = HBAL.CX + HBAL.RX * sP * Math.cos(th), cpy = cyP + HBAL.RY * sP * Math.sin(th);
    let nx = Math.cos(th) / HBAL.RX, ny = Math.sin(th) / HBAL.RY; const nn = Math.hypot(nx, ny); nx /= nn; ny /= nn;
    g.save(); g.translate(Fx + shx, Fy + shy); g.scale(z, z); g.translate(-Fx, -Fy);
    // Farbschein des Ballons im Raum
    const s = popped ? sP : now.s; const cy = popped ? cyP : cyOf(now);
    const glowA = popped ? 0.22 * (1 - seg(k, 0, 0.6)) : 0.22;
    let rg = g.createRadialGradient(HBAL.CX, cy, 0, HBAL.CX, cy, 720 * s); rg.addColorStop(0, hexA(st.col, glowA)); rg.addColorStop(1, hexA(st.col, 0)); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    // Pumpe: Chromrohr, ruckt bei jedem Stoß
    let push = 0; for (const t of T.pumps) { const q = u - t; if (q >= 0 && q < 0.2) push += Math.sin(q / 0.2 * Math.PI) * 9; }
    const nzx = HBAL.CX, ny0 = 1286 + push;
    let gr = g.createLinearGradient(nzx - 24, 0, nzx + 24, 0); gr.addColorStop(0, "#1b1f27"); gr.addColorStop(0.3, "#b9c1cc"); gr.addColorStop(0.45, "#ffffff"); gr.addColorStop(0.62, "#7d8695"); gr.addColorStop(1, "#14171d");
    g.fillStyle = gr; g.fillRect(nzx - 21, ny0 + 10, 42, 190);
    gr = g.createLinearGradient(nzx - 34, 0, nzx + 34, 0); gr.addColorStop(0, "#22262e"); gr.addColorStop(0.35, "#dfe5ec"); gr.addColorStop(0.5, "#ffffff"); gr.addColorStop(0.7, "#6f7887"); gr.addColorStop(1, "#191c22");
    fillRR(g, nzx - 33, ny0 + 30, 66, 30, 8, gr);
    gr = g.createLinearGradient(0, ny0 + 60, 0, ny0 + 200); gr.addColorStop(0, "rgba(3,4,9,0)"); gr.addColorStop(1, "rgba(3,4,9,1)"); g.fillStyle = gr; g.fillRect(nzx - 40, ny0 + 60, 80, 142);
    // Hals über der Düse
    const [r0, g0, b0] = st.rgb; const dk = `rgb(${r0 * 0.35 | 0},${g0 * 0.35 | 0},${b0 * 0.35 | 0})`, md = `rgb(${r0 * 0.85 | 0},${g0 * 0.85 | 0},${b0 * 0.85 | 0})`;
    const neckTop = popped ? ny0 - 28 + Math.sin(k * 40) * 5 * Math.exp(-k * 6) : HBAL.YB - 12;
    gr = g.createLinearGradient(nzx - 30, 0, nzx + 30, 0); gr.addColorStop(0, dk); gr.addColorStop(0.35, md); gr.addColorStop(0.5, hexA("#ffffff", 0.55)); gr.addColorStop(0.62, md); gr.addColorStop(1, dk);
    g.fillStyle = gr; g.beginPath();
    const wt = popped ? 30 : 22 + 12 * s;
    g.moveTo(nzx - 25, ny0 + 32); g.lineTo(nzx - wt, neckTop);
    if (popped) { for (let j = 0; j <= 6; j++) g.lineTo(nzx - wt + (2 * wt) * j / 6, neckTop - (j % 2 ? 16 : 2) - rnd(j * 3) * 10); }
    g.lineTo(nzx + wt, neckTop); g.lineTo(nzx + 25, ny0 + 32); g.closePath(); g.fill();
    fillRR(g, nzx - 27, ny0 + 22, 54, 14, 7, md);
    if (!popped) {
      // Ballon
      const sway = 0.035 * Math.sin(u * 2.1) * (1 - appr);
      const B = st.b, Bt = st.bt; const thinA = cl((now.s - 0.62) / 0.36);
      g.save(); g.translate(HBAL.CX, cy); g.rotate(sway); g.scale(now.s * now.sx, now.s * now.sy);
      shadow(g, 70, 30, "rgba(0,0,0,0.45)"); g.drawImage(B.c, -B.ox, -B.oy); noShadow(g);
      if (thinA > 0) { g.globalAlpha = thinA; g.drawImage(Bt.c, -Bt.ox, -Bt.oy); g.globalAlpha = 1; }
      g.restore();
      // Druckstelle der Nadel
      const dist = hbalDist(u, T);
      if (dist != null && dist < 70) {
        const q = 1 - cl(dist / 70); const ex = cpx + nx * Math.max(0, dist) * 0.2, ey = cpy + ny * Math.max(0, dist) * 0.2;
        rg = g.createRadialGradient(ex - nx * 8, ey - ny * 8, 0, ex - nx * 8, ey - ny * 8, 46); rg.addColorStop(0, `rgba(0,0,0,${0.5 * q})`); rg.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = rg; g.beginPath(); g.arc(ex - nx * 8, ey - ny * 8, 46, 0, 7); g.fill();
        if (dist < 4) { g.strokeStyle = `rgba(255,255,255,${0.55 * q})`; g.lineWidth = 3; g.beginPath(); g.arc(cpx - nx * 18, cpy - ny * 18, 22, Math.atan2(ny, nx) - 1.2, Math.atan2(ny, nx) + 1.2); g.stroke(); }
      }
    } else {
      // Knall: Blitz, Druckwelle, Puder, Fetzen
      const fl = 1 - seg(k, 0, 0.1);
      if (fl > 0) { rg = g.createRadialGradient(cpx, cpy, 0, cpx, cpy, 90 + 330 * out3(seg(k, 0, 0.1))); rg.addColorStop(0, `rgba(255,255,255,${0.95 * fl})`); rg.addColorStop(0.18, hexA(st.col, 0.45 * fl)); rg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
      for (let i = 0; i < 2; i++) { const q = seg(k, i * 0.05, i * 0.05 + 0.5); if (q <= 0 || q >= 1) continue; ring(g, HBAL.CX, cyP, 120 + out3(q) * 900, 30 * (1 - q) + 2, i ? hexA(st.col, 0.5 * (1 - q)) : `rgba(255,255,255,${0.6 * (1 - q)})`); }
      const mist = seg(k, 0, 0.9); if (mist < 1) { rg = g.createRadialGradient(HBAL.CX, cyP, 0, HBAL.CX, cyP, 220 + 520 * out3(mist)); rg.addColorStop(0, `rgba(255,240,240,${0.16 * (1 - mist)})`); rg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
      // Tempo-Striche
      if (k < 0.16) { const q = k / 0.16; g.strokeStyle = `rgba(255,255,255,${0.5 * (1 - q)})`; g.lineCap = "round";
        for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2 + rnd(i * 3) * 0.2, r0_ = 200 + 500 * out3(q) * (0.7 + rnd(i) * 0.5); g.lineWidth = 4 + rnd(i * 5) * 5; g.beginPath(); g.moveTo(HBAL.CX + Math.cos(a) * r0_, cyP + Math.sin(a) * r0_); g.lineTo(HBAL.CX + Math.cos(a) * (r0_ + 90 + 120 * rnd(i * 7)), cyP + Math.sin(a) * (r0_ + 90 + 120 * rnd(i * 7))); g.stroke(); } }
      // Puderteilchen
      for (let i = 0; i < 46; i++) {
        const a = rnd(i * 2.3 + 5) * Math.PI * 2, v = 500 + 1300 * rnd(i * 4.1); const tr = v * (1 - Math.exp(-k * 4)) / 4;
        const x = HBAL.CX + Math.cos(a) * (sP * 200 * rnd(i) + tr), y = cyP + Math.sin(a) * (sP * 220 * rnd(i * 1.7) + tr) + 60 * k * k; const al = cl(1.2 - k * 0.9) * (0.4 + 0.6 * rnd(i * 9));
        if (al <= 0) continue; g.fillStyle = i % 3 ? `rgba(255,255,255,${al * 0.7})` : hexA(st.col, al); g.beginPath(); g.arc(x, y, 2 + 4 * rnd(i * 6), 0, 7); g.fill();
      }
      const ccx = HBAL.CX, ccy = cyP;
      for (const f of st.frags) {
        const fx0 = ccx + f.cx * sP, fy0 = ccy + f.cy * sP;
        let dx = fx0 - cpx, dy = fy0 - cpy; let dl = Math.hypot(dx, dy) + 1; let ex = fx0 - ccx, ey = fy0 - ccy; const el = Math.hypot(ex, ey) + 1;
        dx = dx / dl * 0.55 + ex / el * 0.85; dy = dy / dl * 0.55 + ey / el * 0.85; dl = Math.hypot(dx, dy) + 1e-6; dx /= dl; dy /= dl;
        const sid = f.id + 3; const v = 800 + 900 * rnd(sid * 3.7); const kd = 5.0;
        const ghosts = k < 0.1 ? 3 : 0;
        for (let gh = ghosts; gh >= 0; gh--) {
          const kk = Math.max(0, k - gh * 0.014); const tr = v * (1 - Math.exp(-kd * kk)) / kd;
          const x = fx0 + dx * tr + Math.sin(kk * (2.2 + rnd(sid) * 2) + sid) * 28 * cl(kk), y = fy0 + dy * tr + 55 * kk + 22 * kk * kk;
          const scl = sP * lerp(1, 0.62 + 0.18 * rnd(sid * 5), outExpo(seg(kk, 0, 0.16)));
          const rot = (rnd(sid * 7) - 0.5) * 10 * (1 - Math.exp(-3 * kk)) / 3 + (rnd(sid * 11) - 0.5) * 1.2 * kk;
          const fx = Math.cos(rnd(sid * 13) * 3 + (2.5 + 5 * rnd(sid * 17)) * kk);
          g.save(); g.globalAlpha = gh ? 0.18 : 1; g.translate(x, y); g.rotate(rot); g.scale((Math.abs(fx) < 0.12 ? 0.12 * Math.sign(fx || 1) : fx) * scl, scl);
          g.drawImage(fx >= 0 ? f.c : f.cb, -f.ax, -f.ay); g.restore();
        }
      }
    }
    // Nadel
    const dist = hbalDist(u, T);
    if (dist != null) {
      const trem = (u < tp ? appr : Math.exp(-k * 5)) * (Math.sin(u * 61) * 1.6 + Math.sin(u * 37) * 1.0);
      const px = -ny, py = nx; const ang = Math.atan2(ny, nx);
      const draw1 = (dd, a) => { const tx = cpx + nx * dd + px * trem, ty = cpy + ny * dd + py * trem; g.save(); g.globalAlpha = a; g.translate(tx, ty); g.rotate(ang); shadow(g, 30, 14, "rgba(0,0,0,0.5)"); g.drawImage(st.needle, -6, -55); noShadow(g); g.restore(); };
      const fast = u < T.tN0 + 0.3; if (fast) for (let j = 3; j >= 1; j--) { const dd = hbalDist(Math.max(T.tN0, u - j * 0.012), T); draw1(dd, 0.16); }
      draw1(dist, 1);
      // Funkeln an der Spitze
      if (u < tp && dist < 170) { const q = (1 - dist / 170) * (0.7 + 0.3 * Math.sin(u * 30)); const sx_ = cpx + nx * dist + px * trem, sy_ = cpy + ny * dist + py * trem;
        g.save(); g.globalCompositeOperation = "lighter"; rg = g.createRadialGradient(sx_, sy_, 0, sx_, sy_, 40); rg.addColorStop(0, `rgba(255,255,255,${0.8 * q})`); rg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(sx_ - 40, sy_ - 40, 80, 80);
        g.fillStyle = `rgba(255,255,255,${0.9 * q})`; g.beginPath(); g.moveTo(sx_ - 34 * q, sy_); g.lineTo(sx_, sy_ - 2); g.lineTo(sx_ + 34 * q, sy_); g.lineTo(sx_, sy_ + 2); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(sx_, sy_ - 22 * q); g.lineTo(sx_ + 2, sy_); g.lineTo(sx_, sy_ + 22 * q); g.lineTo(sx_ - 2, sy_); g.closePath(); g.fill(); g.restore(); }
    }
    g.restore();
    // Zeitlupe: Rand dunkler
    const vg = popped ? 0.5 * (1 - seg(k, 0, 0.2)) : 0.5 * inOut(appr);
    if (vg > 0) { rg = g.createRadialGradient(600, 820, 260, 600, 820, 1100); rg.addColorStop(0, "rgba(0,0,0,0)"); rg.addColorStop(1, `rgba(0,0,0,${vg})`); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
    if (popped && k < 0.05) { g.fillStyle = `rgba(255,255,255,${0.3 * (1 - k / 0.05)})`; g.fillRect(0, 0, W, H); }
    // Text nach dem Knall
    const pt = String(p.pop_text || "").trim();
    if (popped && pt) {
      const q = seg(k, 0.1, 0.32); if (q > 0) { const e = outExpo(q); const px_ = fitPx(g, pt, 900, 150, 900);
        g.save(); g.translate(540, 860 + Math.sin(u * 2) * 6); g.rotate(-0.05 * (1 - e) - 0.02); g.scale(lerp(2.0, 1, e), lerp(2.0, 1, e)); g.globalAlpha = cl(q * 3);
        shadow(g, 50, 0, hexA(st.col, 0.9)); txt(g, pt, 0, 0, { w: 900, px: px_, c: "#ffffff" }); noShadow(g); g.restore(); }
    }
  },
  ev(d, p) {
    const T = hbalTimes(d); const E = [];
    T.pumps.forEach((t, i) => { const n = T.pumps.length; E.push([t, "balloon_pump", i === 0 ? 0.8 : 0.62, -0.1]); E.push([t + 0.035, "balloon_squeak" + (1 + Math.min(2, Math.floor(i * 3 / n))), 0.5, 0.15]); });
    E.push([T.tN0, "balloon_swish", 0.55, 0.5]);
    E.push([T.tPumpEnd + 0.2, "balloon_creak", 0.45, 0.1]);
    const room = T.tPop - T.tN0; const ten = room >= 1.6 ? ["balloon_tension_l", 1.6] : room >= 1.0 ? ["balloon_tension", 1.0] : ["balloon_tension_s", 0.6];
    E.push([Math.max(0, T.tPop - ten[1]), ten[0], 0.75, 0.2]);
    E.push([T.tPop, "balloon_pop", 1.0, 0.1]); E.push([T.tPop, "thump", 0.4, 0]);
    E.push([T.tPop + 0.04, "balloon_flutter", 0.35, -0.2]);
    return E;
  },
};
