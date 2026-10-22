// VOICE_DELAY: 0.6
// h_trash: Ein Blatt mit einem handgeschriebenen Satz wird in Großaufnahme zerknüllt, dann im hohen Bogen
// (Zeitlupe kurz vor dem Ziel) in einen Metall-Mülleimer geworfen: trifft den Rand, Klonk, fällt hinein, Staub.
// Parameter: label (Standard "Instagram reicht").
(() => {
  const SX = 430, SY = 800, SW = 420, SH = 540, NX = 10, NY = 13, RB = 92; // Blatt (Welt) und Knäuel-Radius
  const BX = 785, BTOP = 968, BBOT = 1268, BRX = 150, BRY = 36, BRXB = 122; // Mülleimer
  const TEXW = 840, TEXH = 1080;

  function timing(d) {
    const tC = Math.max(0.5, Math.min(0.88, d * 0.27)); const tT = tC + 0.14;
    const tH = Math.max(tT + 0.45, Math.min(tT + 1.25, d - 0.85)); const tIn = tH + 0.32;
    return { tC, tT, tH, tIn, F: tH - tT };
  }
  const HIT = { x: BX - BRX + 16, y: BTOP - 26 };
  function lines(label) {
    const s = String(label || "Instagram reicht").replace(/[–—]/g, "-").trim() || "Instagram reicht"; const w = s.split(" "); const out = []; let cur = "";
    for (const x of w) { const t = cur ? cur + " " + x : x; if (t.length > 11 && cur) { out.push(cur); cur = x; } else cur = t; } if (cur) out.push(cur); return out.slice(0, 3);
  }

  // ---------- Papier mit Handschrift ----------
  function paperTex(label) {
    const c = document.createElement("canvas"); c.width = TEXW; c.height = TEXH; const g = c.getContext("2d");
    // Blattform mit abgerissener Oberkante (Spiralblock)
    g.beginPath(); g.moveTo(0, 30); for (let x = 0; x <= TEXW; x += 14) g.lineTo(x, 22 + rnd(x * 0.31) * 16); g.lineTo(TEXW, TEXH); g.lineTo(0, TEXH); g.closePath(); g.clip();
    const im = g.createImageData(TEXW, TEXH), D = im.data;
    for (let y = 0; y < TEXH; y++) for (let x = 0; x < TEXW; x++) { const n = rnd(x * 0.731 + y * 1.913) - 0.5, f = rnd(((x >> 2) * 3.1 + (y >> 1) * 7.3)) - 0.5; const k = 1 + n * 0.04 + f * 0.025; const i = (y * TEXW + x) * 4; D[i] = 250 * k; D[i + 1] = 248 * k; D[i + 2] = 240 * k; D[i + 3] = 255; }
    const tmp = document.createElement("canvas"); tmp.width = TEXW; tmp.height = TEXH; tmp.getContext("2d").putImageData(im, 0, 0); g.drawImage(tmp, 0, 0);
    // Linien und Rand
    g.strokeStyle = "rgba(90,140,210,0.42)"; g.lineWidth = 2.2; for (let y = 170; y < TEXH; y += 62) { g.beginPath(); g.moveTo(0, y); g.lineTo(TEXW, y); g.stroke(); }
    g.strokeStyle = "rgba(220,70,80,0.5)"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(112, 0); g.lineTo(112, TEXH); g.stroke();
    for (let k = 0; k < 9; k++) { const x = 40 + k * 95; g.fillStyle = "rgba(0,0,0,0.0)"; g.globalCompositeOperation = "destination-out"; g.beginPath(); g.arc(x, 56, 9, 0, 7); g.fill(); g.globalCompositeOperation = "source-over"; }
    // Handschrift (Kugelschreiber blau), Buchstabe für Buchstabe leicht unruhig
    const L = lines(label); let px = 150; g.font = `italic 700 ${px}px FreeSerif, "Liberation Serif", serif`;
    const maxW = Math.max(...L.map((l) => g.measureText(l).width)); if (maxW > 640) px = Math.floor(px * 640 / maxW);
    const y0 = L.length === 1 ? 560 : L.length === 2 ? 470 : 400, lh = px * 1.12;
    L.forEach((l, li) => {
      g.font = `italic 700 ${px}px FreeSerif, "Liberation Serif", serif`; let x = 150 + li * 26; const yb = y0 + li * lh;
      for (let i = 0; i < l.length; i++) {
        const ch = l[i]; const j1 = rnd(i * 3.3 + li * 7), j2 = rnd(i * 5.9 + li * 3), j3 = rnd(i * 1.7 + li);
        g.save(); g.translate(x, yb + (j1 - 0.5) * 10 - i * 1.2); g.rotate(-0.06 + (j2 - 0.5) * 0.09); const s = 0.94 + j3 * 0.12; g.scale(s, s);
        g.fillStyle = "rgba(24,52,150,0.93)"; g.fillText(ch, 0, 0); g.fillStyle = "rgba(24,52,150,0.35)"; g.fillText(ch, 1.6, 0.8); g.restore();
        x += g.measureText(ch).width * s * 0.97;
      }
      if (li === L.length - 1) { g.strokeStyle = "rgba(24,52,150,0.85)"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(150 + li * 26, yb + 34); g.bezierCurveTo(300, yb + 52, 520, yb + 18, Math.min(780, x + 20), yb + 30); g.stroke(); }
    });
    // Seitenlicht
    const gr = g.createLinearGradient(0, 0, TEXW, TEXH); gr.addColorStop(0, "rgba(255,240,215,0.10)"); gr.addColorStop(1, "rgba(60,50,40,0.10)"); g.fillStyle = gr; g.fillRect(0, 0, TEXW, TEXH);
    return c;
  }

  // ---------- Knüll-Netz ----------
  function meshBase() {
    const V = [];
    for (let j = 0; j <= NY; j++) for (let i = 0; i <= NX; i++) {
      const u = i / NX, v = j / NY, nx = (u - 0.5) * 2, ny = (v - 0.5) * 2; const a = Math.atan2(ny * 0.95, nx), rr2 = Math.max(Math.abs(nx), Math.abs(ny));
      const k = i * 17 + j * 31; const jx = rnd(k * 1.3) - 0.5, jy = rnd(k * 2.7) - 0.5;
      const inner = i > 0 && i < NX && j > 0 && j < NY;
      V.push({ u, v, x0: (u - 0.5) * SW, y0: (v - 0.5) * SH, bx: Math.cos(a) * RB * (0.12 + 0.88 * rr2) + jx * (inner ? 26 : 12), by: Math.sin(a) * RB * (0.12 + 0.88 * rr2) + jy * (inner ? 26 : 12), h: (rnd(k * 4.1) - 0.5) * (inner ? 1 : 0.5), wx: jx, wy: jy, rr: rr2, ph: rnd(k * 5.3) * 6.28 });
    }
    const T = []; for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const a = j * (NX + 1) + i, b = a + 1, c = a + NX + 1, e = c + 1; if ((i + j) % 2) { T.push([a, b, e], [a, e, c]); } else { T.push([a, b, c], [b, e, c]); } }
    return { V, T };
  }
  const MB = meshBase();
  function crumpleVerts(c) {
    const e = inOut(cl(c)), w = Math.sin(Math.PI * Math.min(1, c * 1.25));
    return MB.V.map((p) => {
      const x = lerp(p.x0, p.bx, e) + w * 27 * p.wx * (0.4 + p.rr) + Math.sin(p.ph + c * 9) * 6 * w;
      const y = lerp(p.y0, p.by, e) + w * 27 * p.wy * (0.4 + p.rr) + Math.cos(p.ph + c * 7) * 6 * w;
      const dome = Math.sqrt(Math.max(0, 1 - Math.min(1, p.rr * p.rr * 0.8))) * RB * 0.9 * e;
      const z = dome + p.h * 80 * Math.pow(c, 0.6);
      return { x, y, z };
    });
  }
  const LIGHT = (() => { const l = [-0.5, -0.62, 0.6]; const n = Math.hypot(...l); return l.map((x) => x / n); })();
  function drawMesh(g, tex, c, cx, cy, rot, sc2 = 1) {
    const P = crumpleVerts(c); const co = Math.cos(rot), si = Math.sin(rot);
    const Q = P.map((p) => ({ x: cx + (p.x * co - p.y * si) * sc2, y: cy + (p.x * si + p.y * co) * sc2, z: p.z }));
    const tris = MB.T.map((t) => ({ t, z: (Q[t[0]].z + Q[t[1]].z + Q[t[2]].z) / 3 + (c > 0.35 ? (rnd(t[0] * 3 + t[1]) - 0.5) * 30 * c : 0) })).sort((a, b) => a.z - b.z);
    for (const { t } of tris) {
      const [A, B, C] = t.map((k) => Q[k]); const [sA, sB, sC] = t.map((k) => [MB.V[k].u * TEXW, MB.V[k].v * TEXH]);
      // Normale für Facettenlicht
      const ux = B.x - A.x, uy = B.y - A.y, uz = B.z - A.z, vx = C.x - A.x, vy = C.y - A.y, vz = C.z - A.z;
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; if (nz < 0) { nx = -nx; ny = -ny; nz = -nz; } const nl = Math.hypot(nx, ny, nz) || 1;
      const lam = (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / nl;
      const den = (sB[0] - sA[0]) * (sC[1] - sA[1]) - (sC[0] - sA[0]) * (sB[1] - sA[1]); if (Math.abs(den) < 1e-6) continue;
      const a = ((B.x - A.x) * (sC[1] - sA[1]) - (C.x - A.x) * (sB[1] - sA[1])) / den, cc = ((C.x - A.x) * (sB[0] - sA[0]) - (B.x - A.x) * (sC[0] - sA[0])) / den;
      const b = ((B.y - A.y) * (sC[1] - sA[1]) - (C.y - A.y) * (sB[1] - sA[1])) / den, dd = ((C.y - A.y) * (sB[0] - sA[0]) - (B.y - A.y) * (sC[0] - sA[0])) / den;
      const ee = A.x - a * sA[0] - cc * sA[1], ff = A.y - b * sA[0] - dd * sA[1];
      const mx_ = (A.x + B.x + C.x) / 3, my_ = (A.y + B.y + C.y) / 3; const gx = (p) => p.x + Math.sign(p.x - mx_) * 1.1, gy = (p) => p.y + Math.sign(p.y - my_) * 1.1;
      g.save(); g.beginPath(); g.moveTo(gx(A), gy(A)); g.lineTo(gx(B), gy(B)); g.lineTo(gx(C), gy(C)); g.closePath(); g.clip();
      g.save(); g.transform(a, b, cc, dd, ee, ff); g.drawImage(tex, 0, 0); g.restore();
      const base = 0.6; const k = lam - base;
      if (k < 0) { g.fillStyle = `rgba(40,34,30,${Math.min(0.62, -k * 1.15)})`; g.fill(); } else if (k > 0.02) { g.fillStyle = `rgba(255,252,240,${Math.min(0.45, k * 1.1)})`; g.fill(); }
      if (c > 0.15) { g.strokeStyle = `rgba(60,50,40,${0.06 * c})`; g.lineWidth = 1; g.stroke(); }
      g.restore();
    }
  }

  // ---------- Raum und Mülleimer ----------
  function room() {
    const c = document.createElement("canvas"); c.width = W + 300; c.height = H + 300; const g = c.getContext("2d"); const ox = 150, oy = 150; g.translate(ox, oy);
    let gr = g.createLinearGradient(0, 0, 0, 1180); gr.addColorStop(0, "#0e2230"); gr.addColorStop(1, "#1d3a48"); g.fillStyle = gr; g.fillRect(-ox, -oy, c.width, 1180 + oy);
    // Wandleuchte (warm, links oben)
    let rg = g.createRadialGradient(120, 380, 10, 120, 380, 900); rg.addColorStop(0, "rgba(255,196,130,0.55)"); rg.addColorStop(0.4, "rgba(255,170,100,0.16)"); rg.addColorStop(1, "rgba(255,160,90,0)"); g.fillStyle = rg; g.fillRect(-ox, -oy, c.width, c.height);
    // Fußleiste und Boden (Holz)
    g.fillStyle = "#e9e3d6"; g.fillRect(-ox, 1150, c.width, 26); g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(-ox, 1172, c.width, 6);
    gr = g.createLinearGradient(0, 1178, 0, 1920); gr.addColorStop(0, "#6b4426"); gr.addColorStop(0.3, "#4f311b"); gr.addColorStop(1, "#24160c"); g.fillStyle = gr; g.fillRect(-ox, 1178, c.width, 1000);
    g.strokeStyle = "rgba(0,0,0,0.28)"; g.lineWidth = 2; for (let k = -12; k < 14; k++) { g.beginPath(); g.moveTo(540 + k * 70, 1178); g.lineTo(540 + k * 260, 2100); g.stroke(); }
    for (let y = 1230, s = 34; y < 2100; y += s, s *= 1.35) { g.strokeStyle = "rgba(0,0,0,0.16)"; g.beginPath(); g.moveTo(-ox, y); g.lineTo(c.width, y); g.stroke(); }
    rg = g.createRadialGradient(300, 1230, 20, 300, 1230, 700); rg.addColorStop(0, "rgba(255,200,140,0.22)"); rg.addColorStop(1, "rgba(255,200,140,0)"); g.fillStyle = rg; g.fillRect(-ox, 1178, c.width, 1000);
    // Bilderrahmen, Pflanze (unscharf)
    shadow(g, 30, 14, "rgba(0,0,0,0.5)"); fillRR(g, 610, 330, 300, 380, 6, "#c9b28a"); noShadow(g); fillRR(g, 630, 350, 260, 340, 3, "#28485a");
    rg = g.createLinearGradient(630, 350, 890, 690); rg.addColorStop(0, "#5a8fa3"); rg.addColorStop(1, "#1d3644"); g.fillStyle = rg; g.beginPath(); g.moveTo(630, 620); g.lineTo(720, 520); g.lineTo(790, 590); g.lineTo(890, 470); g.lineTo(890, 690); g.lineTo(630, 690); g.closePath(); g.fill();
    for (let i = 0; i < 9; i++) { g.save(); g.translate(-30, 1150); g.rotate(-1.2 + i * 0.22); const lg = g.createLinearGradient(0, 0, 0, -380); lg.addColorStop(0, "#1e4a2c"); lg.addColorStop(1, "#3f8a55"); g.fillStyle = lg; g.beginPath(); g.ellipse(0, -200, 34, 200, 0, 0, 7); g.fill(); g.restore(); }
    const out = document.createElement("canvas"); out.width = c.width; out.height = c.height; const o = out.getContext("2d"); o.filter = "blur(7px)"; o.drawImage(c, 0, 0);
    return { c: out, ox, oy };
  }
  function binParts() {
    const mk = () => { const c = document.createElement("canvas"); c.width = 420; c.height = 420; return c; };
    const back = mk(), front = mk(); const ox = BX - 210, oy = BTOP - 70; // Welt -> Leinwand: x - ox, y - oy
    let g = back.getContext("2d"); g.translate(-ox, -oy);
    // Innenraum
    let gr = g.createLinearGradient(0, BTOP - BRY, 0, BTOP + BRY); gr.addColorStop(0, "#5e6670"); gr.addColorStop(0.5, "#1c2127"); gr.addColorStop(1, "#07090b");
    g.fillStyle = gr; g.beginPath(); g.ellipse(BX, BTOP, BRX - 6, BRY - 3, 0, 0, 7); g.fill();
    gr = g.createLinearGradient(BX - BRX, 0, BX + BRX, 0); gr.addColorStop(0, "rgba(255,255,255,0.0)"); gr.addColorStop(0.6, "rgba(255,255,255,0.18)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.beginPath(); g.ellipse(BX, BTOP - 4, BRX - 10, BRY - 9, 0, Math.PI, 0); g.fill();
    // hinterer Rand (Wulst)
    g.lineWidth = 13; gr = g.createLinearGradient(BX - BRX, 0, BX + BRX, 0); gr.addColorStop(0, "#c9cfd6"); gr.addColorStop(0.3, "#fdfefe"); gr.addColorStop(0.65, "#8b939c"); gr.addColorStop(1, "#d8dde2");
    g.strokeStyle = gr; g.beginPath(); g.ellipse(BX, BTOP, BRX, BRY, 0, Math.PI, 0); g.stroke();
    g = front.getContext("2d"); g.translate(-ox, -oy);
    // Körper (leicht konisch) mit Rippen
    const body = () => { g.beginPath(); g.moveTo(BX - BRX, BTOP); g.lineTo(BX - BRXB, BBOT - 14); g.ellipse(BX, BBOT - 14, BRXB, 22, 0, Math.PI, 0, true); g.lineTo(BX + BRX, BTOP); g.ellipse(BX, BTOP, BRX, BRY, 0, 0, Math.PI, false); g.closePath(); };
    body(); gr = g.createLinearGradient(BX - BRX, 0, BX + BRX, 0);
    [["#4b525a", 0], ["#9aa2ab", 0.1], ["#f4f7f9", 0.24], ["#c3c9cf", 0.36], ["#7c848d", 0.55], ["#b4bbc2", 0.72], ["#5d646c", 0.88], ["#30353a", 1]].forEach(([c2, k]) => gr.addColorStop(k, c2));
    g.fillStyle = gr; g.fill();
    g.save(); body(); g.clip();
    for (let k = 0; k < 15; k++) { const a = Math.PI * (k + 0.5) / 15; const xt = BX - Math.cos(a) * BRX, xb = BX - Math.cos(a) * BRXB; const yt = BTOP + Math.sin(a) * BRY, yb = BBOT - 14 + Math.sin(a) * 22;
      const lit = 0.5 + 0.5 * Math.cos(a * 1.6 + 0.4); g.strokeStyle = `rgba(0,0,0,${0.18 + 0.12 * (1 - lit)})`; g.lineWidth = 5; g.beginPath(); g.moveTo(xt + 3, yt + 10); g.lineTo(xb + 3, yb - 4); g.stroke();
      g.strokeStyle = `rgba(255,255,255,${0.12 + 0.25 * lit})`; g.lineWidth = 3; g.beginPath(); g.moveTo(xt - 4, yt + 10); g.lineTo(xb - 4, yb - 4); g.stroke(); }
    // Querwulst + Verschmutzung unten
    for (const yy of [BTOP + 70, BBOT - 70]) { g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 6; g.beginPath(); g.ellipse(BX, yy, lerp(BRX, BRXB, (yy - BTOP) / (BBOT - BTOP)), BRY * 0.85, 0, 0.1, Math.PI - 0.1); g.stroke(); g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 2; g.beginPath(); g.ellipse(BX, yy - 4, lerp(BRX, BRXB, (yy - BTOP) / (BBOT - BTOP)), BRY * 0.85, 0, 0.15, Math.PI - 0.15); g.stroke(); }
    gr = g.createLinearGradient(0, BTOP, 0, BBOT + 10); gr.addColorStop(0, "rgba(255,230,190,0.12)"); gr.addColorStop(0.5, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(20,14,8,0.45)"); g.fillStyle = gr; g.fillRect(BX - BRX, BTOP, 2 * BRX, BBOT - BTOP + 20);
    g.restore();
    // vorderer Rand (Wulst) mit Glanz
    g.lineWidth = 14; gr = g.createLinearGradient(BX - BRX, 0, BX + BRX, 0); gr.addColorStop(0, "#6f7780"); gr.addColorStop(0.22, "#ffffff"); gr.addColorStop(0.5, "#a7afb7"); gr.addColorStop(0.8, "#e9edf0"); gr.addColorStop(1, "#59616a");
    g.strokeStyle = gr; g.beginPath(); g.ellipse(BX, BTOP, BRX, BRY, 0, 0, Math.PI); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 3; g.beginPath(); g.ellipse(BX, BTOP - 3, BRX, BRY, 0, Math.PI * 0.55, Math.PI * 0.85); g.stroke();
    // Griffe
    for (const s of [-1, 1]) { g.strokeStyle = "#8c949c"; g.lineWidth = 8; g.beginPath(); g.arc(BX + s * (BRX - 6), BTOP + 46, 22, s > 0 ? -1.2 : Math.PI - 1.9, s > 0 ? 1.9 : Math.PI + 1.2); g.stroke(); }
    return { back, front, ox, oy };
  }

  function ballPos(T, u) {
    // Ausholen, Flug (Parabel), Zeitlupe vor dem Rand, Abprall und Fall in den Eimer
    if (u < T.tT) { const k = seg(u, T.tC - 0.05, T.tT); return { x: SX - 30 * Math.sin(k * Math.PI), y: SY + 40 * Math.sin(k * Math.PI), r: 0, s: 1 }; }
    if (u < T.tH) {
      const q = (u - T.tT) / T.F; const sm = q < 0.6 ? 0.86 * (q / 0.6) : 0.86 + 0.14 * (1 - Math.pow(1 - (q - 0.6) / 0.4, 1.3));
      const s = q < 0.6 ? sm : sm; const apex = 250;
      const x = lerp(SX, HIT.x, s), y = lerp(SY, HIT.y, s) - 4 * apex * s * (1 - s);
      return { x, y, r: s * 7.5, s: 1 - 0.12 * s, slow: seg(q, 0.55, 0.65) };
    }
    const b = cl((u - T.tH) / (T.tIn - T.tH)); const x = lerp(HIT.x, BX - 10, out3(b)), y = lerp(HIT.y, BTOP + 10, b * b) - 110 * Math.sin(Math.PI * Math.min(1, b * 1.15)) * (1 - b * 0.4);
    const lx = u - T.tIn; const y2 = lx > 0 ? y + 34 * (1 - Math.exp(-lx * 14)) - 8 * Math.exp(-lx * 8) * Math.sin(lx * 30) : y;
    return { x, y: y2, r: 7.5 + b * 2.4, s: 0.88 };
  }

  TYPES.h_trash = {
    zone: "bottom", pal: "navy", bgv: 0, coverT: 2.05,
    prep(sc, p) {
      sc.st.tex = paperTex(p.label); sc.st.room = room(); sc.st.bin = binParts();
      // Knäuel als Bild (Endzustand des Netzes) für den Flug
      const b = document.createElement("canvas"); b.width = 520; b.height = 520; const g = b.getContext("2d"); g.scale(2, 2); drawMesh(g, sc.st.tex, 1, 130, 130, 0.6); g.globalCompositeOperation = "source-atop"; const sg = g.createRadialGradient(100, 95, 20, 130, 130, 120); sg.addColorStop(0, "rgba(255,250,235,0.12)"); sg.addColorStop(0.6, "rgba(0,0,0,0)"); sg.addColorStop(1, "rgba(30,25,20,0.45)"); g.fillStyle = sg; g.fillRect(0, 0, 260, 260); sc.st.ball = b;
    },
    draw(g, u, d, p, sc) {
      const T = timing(d); const bp = ballPos(T, u);
      // Kamera: Großaufnahme beim Knüllen, dann zurück; in der Zeitlupe leicht zum Eimer
      const zo = inOut(seg(u, T.tC - 0.12, T.tT + 0.3)); const slow = u < T.tH ? (bp.slow || 0) * (1 - seg(u, T.tH, T.tH + 0.1)) : 0;
      const slowK = u >= T.tT ? cl(seg(u, T.tT + T.F * 0.55, T.tT + T.F * 0.7)) * (1 - seg(u, T.tH + 0.15, T.tH + 0.6)) : 0;
      let z = lerp(1.45, 1.08, zo) + 0.1 * slowK, fx = lerp(SX, 590, zo) + (HIT.x - 540) * 0.35 * slowK, fy = lerp(SY + 40, 900, zo) + (HIT.y - 880) * 0.35 * slowK;
      z += 0.025 * Math.sin(u * 1.3) * (1 - zo);
      let shx = 0, shy = 0; for (const [t0, a] of [[T.tH, 9], [T.tIn, 4]]) { const x = u - t0; if (x >= 0 && x < 0.35) { const k = a * Math.exp(-x / 0.07); shx += Math.sin(x * 97) * k; shy += Math.cos(x * 83) * k; } }
      g.save(); g.translate(540 + shx, 860 + shy); g.scale(z, z); g.rotate(-0.02 * (1 - zo)); g.translate(-fx, -fy);
      const R = sc.st.room; g.drawImage(R.c, -R.ox - 20 * zo, -R.oy);
      // Mülleimer (wackelt nach dem Treffer)
      const wob = (u > T.tH ? 0.06 * Math.exp(-(u - T.tH) * 5) * Math.sin((u - T.tH) * 26) : 0) + (u > T.tIn ? 0.025 * Math.exp(-(u - T.tIn) * 6) * Math.sin((u - T.tIn) * 30) : 0);
      const B = sc.st.bin;
      g.save(); g.fillStyle = "rgba(0,0,0,0.45)"; g.filter = "blur(10px)"; g.beginPath(); g.ellipse(BX + 26, BBOT - 4, BRXB + 30, 26, 0, 0, 7); g.fill(); g.restore();
      const binT = () => { g.translate(BX, BBOT); g.rotate(wob); g.translate(-BX, -BBOT); };
      g.save(); binT(); g.drawImage(B.back, B.ox, B.oy); g.restore();
      // Schatten des Knäuels auf dem Boden
      if (u > T.tC) { const fh = Math.max(0, 1210 - bp.y); g.save(); g.globalAlpha = 0.35 * cl(1 - fh / 900) * (bp.y < BTOP + 20 ? 1 : 0); g.fillStyle = "#000"; g.beginPath(); g.ellipse(bp.x + 30, 1218, 70 + fh * 0.05, 14, 0, 0, 7); g.fill(); g.restore(); }
      // Papier / Knäuel
      if (u < T.tC + 0.06) {
        const c = cl(0.04 + 0.96 * Math.pow(u / T.tC, 1.25)); const rot = -0.05 + 0.6 * inOut(c);
        g.save(); if (u > T.tC - 0.02) g.globalAlpha = 1 - seg(u, T.tC - 0.02, T.tC + 0.06);
        // Schlagschatten unter dem Blatt
        g.save(); g.globalAlpha *= 0.5; g.fillStyle = "#000"; g.filter = "blur(18px)"; g.beginPath(); g.ellipse(SX + 30, SY + 40, lerp(SW * 0.6, RB, inOut(c)), lerp(SH * 0.55, RB, inOut(c)), rot, 0, 7); g.fill(); g.restore();
        drawMesh(g, sc.st.tex, c, SX, SY, rot); g.restore();
      }
      if (u >= T.tC - 0.02) {
        const vis = bp.y < BBOT + 200; if (vis) {
          // Bewegungsunschärfe im schnellen Teil, Geisterspur in der Zeitlupe
          const prev = (k) => ballPos(T, u - k / 60);
          if (u > T.tT && u < T.tH) for (let k = 4; k >= 1; k--) { const q = prev(k * (slowK > 0.5 ? 2.5 : 1)); g.save(); g.globalAlpha = 0.12 + 0.05 * slowK; g.translate(q.x, q.y); g.rotate(q.r + 0.6); g.scale(q.s, q.s); g.drawImage(sc.st.ball, -130, -130, 260, 260); g.restore(); }
          g.save(); if (u < T.tC + 0.06) g.globalAlpha = seg(u, T.tC - 0.02, T.tC + 0.06);
          if (u > T.tH) { g.beginPath(); g.rect(-2000, -2000, 5000, BTOP + 2000); g.ellipse(BX, BTOP, BRX - 4, BRY - 2, 0, 0, 7); g.clip(); }
          g.translate(bp.x, bp.y); g.rotate(bp.r); g.scale(bp.s, bp.s);
          g.drawImage(sc.st.ball, -130, -130, 260, 260); g.restore();
        }
      }
      g.save(); binT(); g.drawImage(B.front, B.ox, B.oy);
      // Glanzblitz am Rand beim Treffer
      const hx = u - T.tH; if (hx >= 0 && hx < 0.4) { const k = 1 - hx / 0.4; g.globalCompositeOperation = "lighter"; const q = g.createRadialGradient(HIT.x + 6, BTOP + 6, 0, HIT.x + 6, BTOP + 6, 120 * (0.5 + hx * 2)); q.addColorStop(0, `rgba(255,255,255,${0.9 * k})`); q.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = q; g.fillRect(HIT.x - 140, BTOP - 140, 290, 290);
        g.strokeStyle = `rgba(255,255,255,${0.8 * k})`; g.lineWidth = 3; for (let i = 0; i < 6; i++) { const a = -Math.PI * (0.15 + i * 0.14); const r0 = 30 + hx * 200, r1 = r0 + 40 * k; g.beginPath(); g.moveTo(HIT.x + Math.cos(a) * r0, BTOP + Math.sin(a) * r0); g.lineTo(HIT.x + Math.cos(a) * r1, BTOP + Math.sin(a) * r1); g.stroke(); } }
      g.restore();
      // Staub und Triumph nach dem Hineinfallen
      const lx = u - T.tIn; if (lx >= 0) {
        for (let i = 0; i < 26; i++) { const a = -Math.PI * (0.1 + 0.8 * rnd(i * 2.3)), v = 60 + rnd(i * 4.1) * 200; const k = 1 - Math.exp(-lx * 3); const x = BX + Math.cos(a) * v * k * 1.3, y = BTOP - 10 + Math.sin(a) * v * k * 0.9 + lx * 30;
          const r = 14 + rnd(i * 6.6) * 26 + lx * 30; const al = 0.35 * (1 - cl(lx / 1.6)); const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, `rgba(225,215,195,${al})`); q.addColorStop(1, "rgba(225,215,195,0)"); g.fillStyle = q; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
        g.save(); g.globalCompositeOperation = "lighter"; sparkles(g, BX, BTOP - 70, lx + 0.6, 14, 190, "#ffe7a3", 11); g.restore();
        const k = 1 - cl(lx / 0.5); if (k > 0) { g.strokeStyle = `rgba(255,236,170,${0.7 * k})`; g.lineWidth = 6 * k + 1; g.beginPath(); g.ellipse(BX, BTOP, BRX + 80 * (1 - k), BRY + 30 * (1 - k), 0, 0, 7); g.stroke(); }
      }
      g.restore();
      // Zeitlupe: leichte Entsättigung und Vignette
      if (slowK > 0.01) { g.save(); g.globalCompositeOperation = "saturation"; g.fillStyle = `rgba(128,128,128,${0.35 * slowK})`; g.fillRect(0, 0, W, H); g.restore(); }
      let gr = g.createLinearGradient(0, 1290, 0, 1920); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.35, "rgba(0,0,0,0.4)"); gr.addColorStop(1, "rgba(0,0,0,0.75)"); g.fillStyle = gr; g.fillRect(0, 1290, W, 630);
      const vg = g.createRadialGradient(540, 880, 460 - 120 * slowK, 540, 900, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${0.5 + 0.25 * slowK})`); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    },
    ev(d, p) {
      const T = timing(d);
      return [[0, T.tC > 0.72 ? "tr_crumple" : "tr_crumple_s", 1.0, 0], [T.tT, "tr_throw", 0.75, -0.1], [T.tT + T.F * 0.58, "tr_slow", 0.55, 0.1],
        [T.tH, "tr_clonk", 1.0, 0.25], [T.tIn, "tr_land", 0.85, 0.25], [T.tIn + 0.04, "tr_swish", 0.7, 0]];
    },
  };
})();
