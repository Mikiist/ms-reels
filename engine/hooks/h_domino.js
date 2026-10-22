// VOICE_DELAY: 0.5
// h_domino: Kurve aus großen, lackierten Dominosteinen. Ab Bild 0 tippt ein Mauszeiger den ersten Stein an, die Kette fällt
// beschleunigend (Klacken exakt beim Aufprall, Tonhöhe steigt), Kamera fährt mit, der letzte Stein schlägt dumpf auf (Staubwolke).
// Parameter: labels (Standard ["Website langsam", "Kunde wartet", "Kunde geht", "Anfrage weg", "Umsatz weg"], 3 bis 7 Steine).
try { document.fonts.load("800 120px D"); document.fonts.load("900 120px D"); } catch (e) {}

const HDOM = { h: 2.0, w: 1.25, t: 0.42, sp: 1.8, TW: 500, TH: 800 };
const HDOM_DEF = ["Website langsam", "Kunde wartet", "Kunde geht", "Anfrage weg", "Umsatz weg"];
const HDOM_PAL = ["#1f56d6", "#3a46cf", "#6b33c8", "#a3268f", "#d11f33"];
function hdomLabels(p) { let L = Array.isArray(p.labels) ? p.labels.map((x) => String(x).trim()).filter(Boolean) : HDOM_DEF; if (L.length < 3) L = HDOM_DEF; return L.slice(0, 7); }
function hdomCv(w, h) { const c = document.createElement("canvas"); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }
function hdomMix(a, b, k) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(lerp((A >> s) & 255, (B >> s) & 255, k)); return [m(16), m(8), m(0)]; }
function hdomColor(i, N) { const x = (N <= 1 ? 1 : i / (N - 1)) * (HDOM_PAL.length - 1); const j = Math.min(HDOM_PAL.length - 2, Math.floor(x)); return hdomMix(HDOM_PAL[j], HDOM_PAL[j + 1], x - j); }
function hdomRgb(c, k, a = 1) { return `rgba(${Math.min(255, c[0] * k) | 0},${Math.min(255, c[1] * k) | 0},${Math.min(255, c[2] * k) | 0},${a})`; }

function hdomTimes(d, N) {
  const tEnd = Math.max(1.25, d - 0.55), r = 0.8, fall = 0.3;
  let sum = 0; for (let i = 0; i < N - 1; i++) sum += Math.pow(r, i);
  const base = Math.min(0.5, (tEnd - fall) / sum);
  const T = [0]; for (let i = 0; i < N - 1; i++) T.push(T[i] + base * Math.pow(r, i));
  return { T, base, r, fall, tHit: T[N - 1] + fall, N };
}
// Kippwinkel aller Steine: freier Fall, begrenzt durch das Anlehnen an den nächsten Stein
function hdomAngles(u, Tm) {
  const { T, N, base, r, fall } = Tm, { h, t, sp } = HDOM; const thc = Math.asin((sp - t) / h); const th = new Array(N).fill(0); const L = N - 1;
  if (u > T[L]) { const x = (u - T[L]) / fall; if (x < 1) th[L] = Math.PI / 2 * (0.2 * x + 0.8 * x * x); else { const q = u - T[L] - fall; th[L] = Math.PI / 2 - 0.06 * Math.abs(Math.sin(q * 24)) * Math.exp(-q * 13); } }
  for (let i = L - 1; i >= 0; i--) {
    if (u <= T[i]) continue; const D = base * Math.pow(r, i), x = (u - T[i]) / D, a = i === 0 ? 0.35 : 0.3;
    const free = thc * (a * x + (1 - a) * x * x);
    const lean = th[i + 1] + Math.asin(Math.max(-1, Math.min(1, (sp * Math.cos(th[i + 1]) - t) / h)));
    th[i] = Math.min(free, lean);
  }
  return th;
}
function hdomPath(s, P) { const a = P.psi0 + P.k * s; return [(Math.cos(P.psi0) - Math.cos(a)) / P.k, (Math.sin(a) - Math.sin(P.psi0)) / P.k, a]; }
function hdomProj(p, C) {
  const x = p[0] - C.x, y = p[1] - C.y, z = p[2] - C.z; const cy = Math.cos(C.yaw), sy = Math.sin(C.yaw), cp = Math.cos(C.pitch), sp = Math.sin(C.pitch);
  const x1 = x * cy - z * sy, z1 = x * sy + z * cy; const y2 = y * cp + z1 * sp, z2 = -y * sp + z1 * cp;
  return [C.cx + C.f * x1 / z2, C.cy - C.f * y2 / z2, z2];
}
function hdomCam(u, Tm, P, st) {
  const { T, N, tHit } = Tm, sp = HDOM.sp; const Ltot = (N - 1) * sp;
  // Front der Kette entlang des Weges
  let sf = 0; for (let i = 0; i < N - 1; i++) if (u >= T[i]) sf = i * sp + sp * cl((u - T[i]) / (T[i + 1] - T[i]));
  if (u >= T[N - 1]) sf = Ltot + 0.6 * cl((u - T[N - 1]) / Tm.fall);
  const start = 0.9 * sp; let sT = lerp(start, sf + 0.3, out3(seg(u, 0, 0.5)));
  sT = Math.max(start, Math.min(sT, Ltot - 0.4));
  const end = inOut(seg(u, tHit + 0.05, tHit + 1.0));
  sT = lerp(sT, (Ltot + 1.8) * 0.5, end);
  const [px, pz, a] = hdomPath(sT, P);
  const drift = Math.max(0, u - tHit - 0.4); const yaw = a * 0.5 + 0.045 * drift; const pitch = lerp(0.66, 1.0, end); const dist = lerp(lerp(11.0, 13.2, out3(seg(u, 0, 0.8))), 20.5 - 0.35 * drift, end);
  const tx = px, tz = pz, ty = 0.55;
  const fx = Math.sin(yaw) * Math.cos(pitch), fy = -Math.sin(pitch), fz = Math.cos(yaw) * Math.cos(pitch);
  return { x: tx - fx * dist, y: ty - fy * dist, z: tz - fz * dist, yaw, pitch, f: 2150, cx: 540, cy: lerp(1000, 875, end) };
}

TYPES.h_domino = {
  zone: "bottom", pal: "night", bgv: 0, coverT: 1.25,
  prep(sc, p) {
    const st = sc.st; const labels = hdomLabels(p); const N = labels.length; st.N = N;
    const Ltot = (N - 1) * HDOM.sp; st.path = { psi0: -0.55, k: 1.1 / Ltot };
    st.stones = []; st.tex = []; st.col = [];
    for (let i = 0; i < N; i++) {
      const sc0 = i * HDOM.sp - HDOM.t / 2; const [px, pz] = hdomPath(i * HDOM.sp, st.path); const a = hdomPath(sc0, st.path)[2];
      st.stones.push({ px, pz, dx: Math.sin(a), dz: Math.cos(a), ex: Math.cos(a), ez: -Math.sin(a) });
      const col = hdomColor(i, N); st.col.push(col);
      // Vorderseite: Lack, Fase, Mittelsteg mit Messingstift, Beschriftung
      const { TW, TH } = HDOM; const c = hdomCv(TW, TH), g = c.getContext("2d");
      let gr = g.createLinearGradient(0, 0, TW * 0.6, TH); gr.addColorStop(0, hdomRgb(col, 1.35)); gr.addColorStop(0.5, hdomRgb(col, 1.0)); gr.addColorStop(1, hdomRgb(col, 0.62));
      g.fillStyle = gr; rr(g, 0, 0, TW, TH, 60); g.fill();
      gr = g.createLinearGradient(0, 0, TW, TH); gr.addColorStop(0, "rgba(255,255,255,0.55)"); gr.addColorStop(0.45, "rgba(255,255,255,0.05)"); gr.addColorStop(0.55, "rgba(0,0,0,0.05)"); gr.addColorStop(1, "rgba(0,0,0,0.5)");
      g.strokeStyle = gr; g.lineWidth = 14; rr(g, 9, 9, TW - 18, TH - 18, 52); g.stroke();
      const yd = TH * 0.6;
      g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(44, yd - 5, TW - 88, 8); g.fillStyle = "rgba(255,255,255,0.28)"; g.fillRect(44, yd + 3, TW - 88, 3);
      let rg = g.createRadialGradient(TW / 2 - 6, yd - 6, 2, TW / 2, yd, 22); rg.addColorStop(0, "#fff6cf"); rg.addColorStop(0.4, "#e9b949"); rg.addColorStop(1, "#7a5208");
      g.fillStyle = rg; g.beginPath(); g.arc(TW / 2, yd, 21, 0, 7); g.fill();
      const words = labels[i].split(/\s+/); let lines;
      if (words.length === 1) lines = [words[0]]; else { let best = null; for (let j = 1; j < words.length; j++) { const A = words.slice(0, j).join(" "), B = words.slice(j).join(" "); const m = Math.max(A.length, B.length); if (!best || m < best[0]) best = [m, A, B]; } lines = [best[1], best[2]]; }
      let px_ = 120; for (const l of lines) px_ = Math.min(px_, fitPx(g, l, TW - 64, 120, 900));
      const ys = lines.length === 2 ? [TH * 0.19, TH * 0.4] : [TH * 0.3];
      lines.forEach((l, j) => { txt(g, l, TW / 2, ys[j] + 4, { w: 900, px: px_, c: "rgba(0,0,0,0.5)" }); txt(g, l, TW / 2, ys[j], { w: 900, px: px_, c: "#fffaf0" }); });
      // Augen wie beim echten Domino (1 bis 6)
      const PIP = [[[0, 0]], [[-1, -1], [1, 1]], [[-1, -1], [0, 0], [1, 1]], [[-1, -1], [1, -1], [-1, 1], [1, 1]], [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]]][Math.min(5, i)];
      for (const [qx, qy] of PIP) { const x = TW / 2 + qx * 110, y = TH * 0.8 + qy * 72; circle(g, x, y + 3, 25, "rgba(255,255,255,0.25)"); circle(g, x, y, 25, "rgba(0,0,0,0.45)"); circle(g, x, y - 2, 21, "#fffaf0"); }
      st.tex.push(c);
    }
    // Staub-Wölkchen
    const dc = hdomCv(128, 128), dg = dc.getContext("2d"); const rg = dg.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, "rgba(235,225,210,0.9)"); rg.addColorStop(0.45, "rgba(220,210,195,0.45)"); rg.addColorStop(1, "rgba(200,190,180,0)"); dg.fillStyle = rg; dg.fillRect(0, 0, 128, 128); st.puff = dc;
    // Hintergrund (bildfest): dunkler Tisch mit warmem Lichtkegel
    const bg = hdomCv(W, H), g = bg.getContext("2d");
    let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#05070c"); gr.addColorStop(0.3, "#0d1220"); gr.addColorStop(1, "#06080e"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    let rr2 = g.createRadialGradient(560, 820, 0, 560, 820, 820); rr2.addColorStop(0, "rgba(255,214,160,0.22)"); rr2.addColorStop(0.5, "rgba(190,150,120,0.08)"); rr2.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rr2; g.fillRect(0, 0, W, H);
    st.bg = bg;
  },
  draw(g, u, d, p, sc, P) {
    const st = sc.st, N = st.N, Tm = hdomTimes(d, N), { h, w, t } = HDOM;
    const th = hdomAngles(u, Tm), thPrev = hdomAngles(Math.max(0, u - 0.03), Tm);
    const C = hdomCam(u, Tm, st.path, st);
    const k = u - Tm.tHit; let shx = 0, shy = 0; if (k >= 0 && k < 0.45) { const a = 20 * Math.exp(-k / 0.08); shx = Math.sin(k * 91) * a; shy = Math.cos(k * 77) * a; }
    C.cx += shx; C.cy += shy;
    g.drawImage(st.bg, 0, 0);
    const PR = (q) => hdomProj(q, C);
    // Dielen des Tisches (bewegen sich mit der Kamera)
    g.save(); g.lineWidth = 2; g.strokeStyle = "rgba(255,230,200,0.05)";
    for (let kx = -8; kx <= 8; kx++) { const a = PR([kx * 1.3 - 3, 0, -2]), b = PR([kx * 1.3 - 3, 0, 26]); if (a[2] > 0.5 && b[2] > 0.5) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); } }
    g.restore();
    const Lw = (() => { const v = [-0.42, 0.72, -0.62], n = Math.hypot(...v); return v.map((x) => x / n); })();
    const geo = (i, ang, mirror) => {
      const S = st.stones[i], c = Math.cos(ang), s = Math.sin(ang);
      const Pt = (f, side, uu) => { const f2 = f * c + uu * s, u2 = -f * s + uu * c; return [S.px + S.dx * f2 + S.ex * side, mirror ? -u2 : u2, S.pz + S.dz * f2 + S.ez * side]; };
      const n0 = -t, r0 = 0, L = -w / 2, R = w / 2;
      const V = { nLT: Pt(n0, L, h), nRT: Pt(n0, R, h), nRb: Pt(n0, R, 0), nLb: Pt(n0, L, 0), rLT: Pt(r0, L, h), rRT: Pt(r0, R, h), rRb: Pt(r0, R, 0), rLb: Pt(r0, L, 0) };
      const dv = [S.dx * c, -s, S.dz * c], uv = [S.dx * s, c, S.dz * s], ev = [S.ex, 0, S.ez];
      const faces = [
        { k: "near", q: ["nLT", "nRT", "nRb", "nLb"], n: dv.map((x) => -x) }, { k: "far", q: ["rRT", "rLT", "rLb", "rRb"], n: dv },
        { k: "top", q: ["rLT", "rRT", "nRT", "nLT"], n: uv }, { k: "left", q: ["rLT", "nLT", "nLb", "rLb"], n: ev.map((x) => -x) }, { k: "right", q: ["nRT", "rRT", "rRb", "nRb"], n: ev },
      ];
      return { V, faces };
    };
    const drawStone = (i, ang, alpha, mirror) => {
      const { V, faces } = geo(i, ang, mirror); const col = st.col[i]; const S = {};
      for (const key in V) S[key] = PR(V[key]);
      let cxw = 0, cyw = 0, czw = 0; for (const key in V) { cxw += V[key][0] / 8; cyw += V[key][1] / 8; czw += V[key][2] / 8; }
      const vv = [C.x - cxw, C.y - cyw, C.z - czw]; const vn = Math.hypot(...vv); vv[0] /= vn; vv[1] /= vn; vv[2] /= vn;
      const hv = [Lw[0] + vv[0], Lw[1] + vv[1], Lw[2] + vv[2]]; const hn = Math.hypot(...hv);
      g.save(); g.globalAlpha = alpha;
      for (const F of faces) {
        let n = F.n; if (mirror) n = [n[0], -n[1], n[2]];
        const P0 = V[F.q[0]]; const vis = (C.x - P0[0]) * n[0] + (C.y - P0[1]) * n[1] + (C.z - P0[2]) * n[2]; if (vis <= 0) continue;
        const dif = Math.max(0, n[0] * Lw[0] + n[1] * Lw[1] + n[2] * Lw[2]); const spec = Math.pow(Math.max(0, (n[0] * hv[0] + n[1] * hv[1] + n[2] * hv[2]) / hn), 30);
        const q = F.q.map((key) => S[key]);
        const path = () => { g.beginPath(); q.forEach((pt, j) => (j ? g.lineTo(pt[0], pt[1]) : g.moveTo(pt[0], pt[1]))); g.closePath(); };
        const shade = 0.3 + 0.85 * dif;
        if (F.k === "near" && !mirror) {
          path(); g.fillStyle = hdomRgb(col, 0.45); g.fill();
          const tl = S.nLT, tr = S.nRT, bl = S.nLb, br = S.nRb; const { TW, TH } = HDOM;
          // zwei Dreiecke, je eine affine Abbildung
          g.save(); g.beginPath(); g.moveTo(tl[0], tl[1]); g.lineTo(tr[0], tr[1]); g.lineTo(bl[0], bl[1]); g.closePath(); g.clip();
          g.setTransform((tr[0] - tl[0]) / TW, (tr[1] - tl[1]) / TW, (bl[0] - tl[0]) / TH, (bl[1] - tl[1]) / TH, tl[0], tl[1]); g.drawImage(st.tex[i], 0, 0); g.restore();
          g.save(); g.beginPath(); g.moveTo(br[0], br[1]); g.lineTo(bl[0], bl[1]); g.lineTo(tr[0], tr[1]); g.closePath(); g.clip();
          const a = (br[0] - bl[0]) / TW, b = (br[1] - bl[1]) / TW, c2 = (br[0] - tr[0]) / TH, d2 = (br[1] - tr[1]) / TH;
          g.setTransform(a, b, c2, d2, br[0] - a * TW - c2 * TH, br[1] - b * TW - d2 * TH); g.drawImage(st.tex[i], 0, 0); g.restore();
          g.save(); g.globalAlpha = alpha;
          if (shade < 1) { path(); g.fillStyle = `rgba(6,8,16,${(1 - shade) * 0.7})`; g.fill(); }
          const sp = 0.12 + spec * 0.75; const gr = g.createLinearGradient(tl[0], tl[1], br[0], br[1]);
          gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.32, `rgba(255,255,255,${sp * 0.25})`); gr.addColorStop(0.42, `rgba(255,255,255,${sp})`); gr.addColorStop(0.5, `rgba(255,255,255,${sp * 0.2})`); gr.addColorStop(1, "rgba(255,255,255,0)");
          path(); g.fillStyle = gr; g.fill(); g.restore();
        } else {
          const k2 = F.k === "top" ? 1.25 : F.k === "near" ? 0.9 : 0.75; path(); g.fillStyle = hdomRgb(col, shade * k2); g.fill();
          if (spec > 0.02) { path(); g.fillStyle = `rgba(255,255,255,${spec * 0.5})`; g.fill(); }
          if (!mirror) { g.strokeStyle = hdomRgb(col, 1.4, 0.35); g.lineWidth = 1.5; g.stroke(); }
        }
      }
      g.restore();
    };
    // Reihenfolge: hinten zuerst
    const order = [...Array(N).keys()].map((i) => { const S = st.stones[i]; return [i, PR([S.px, 1, S.pz])[2]]; }).sort((a, b) => b[1] - a[1]).map((x) => x[0]);
    // Spiegelung im lackierten Tisch
    for (const i of order) drawStone(i, th[i], 0.22, true);
    let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "rgba(6,8,14,0.55)"); gr.addColorStop(1, "rgba(6,8,14,0.2)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // Schatten (Licht von oben links)
    for (const i of order) {
      const { V } = geo(i, th[i], false); const pts = Object.values(V).map((q) => [q[0] - Lw[0] * q[1] / Lw[1], q[2] - Lw[2] * q[1] / Lw[1]]);
      pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const lo = [], hi = []; for (const q of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
      for (let j = pts.length - 1; j >= 0; j--) { const q = pts[j]; while (hi.length >= 2 && cr(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
      const hull = lo.slice(0, -1).concat(hi.slice(0, -1)).map((q) => PR([q[0], 0, q[1]]));
      g.save(); g.shadowColor = "rgba(0,0,0,0.75)"; g.shadowBlur = 26; g.shadowOffsetX = 4000; g.fillStyle = "#000"; g.beginPath(); hull.forEach((q, j) => (j ? g.lineTo(q[0] - 4000, q[1]) : g.moveTo(q[0] - 4000, q[1]))); g.closePath(); g.fill(); g.restore();
    }
    // Steine mit Bewegungsunschärfe
    for (const i of order) {
      const dv = th[i] - thPrev[i]; if (dv > 0.12) { drawStone(i, thPrev[i] + dv * 0.35, 0.28, false); drawStone(i, thPrev[i] + dv * 0.7, 0.4, false); }
      drawStone(i, th[i], 1, false);
    }
    // Staubwolke beim letzten Aufschlag
    if (k >= 0) {
      const L = N - 1, S = st.stones[L]; const cxw = S.px + S.dx * h * 0.55, czw = S.pz + S.dz * h * 0.55;
      for (let j = 0; j < 30; j++) {
        const a = rnd(j * 3.3 + 1) * Math.PI * 2, v = 0.9 + 2.2 * rnd(j * 5.1); const R_ = v * (1 - Math.exp(-k * 4.5)) / 1.0; const lift = 0.05 + 0.5 * rnd(j * 7.7) * (1 - Math.exp(-k * 2));
        const pt = PR([cxw + Math.cos(a) * (0.7 + R_), lift, czw + Math.sin(a) * (0.7 + R_) * 0.8]); if (pt[2] < 0.5) continue;
        const sz = (0.35 + 0.6 * rnd(j * 9.9)) * (1 + k * 1.4) * C.f / pt[2]; const al = cl(1 - k / 1.3) * 0.38 * (0.5 + 0.5 * rnd(j));
        if (al <= 0) continue; g.globalAlpha = al; g.drawImage(st.puff, pt[0] - sz, pt[1] - sz, sz * 2, sz * 2);
      }
      g.globalAlpha = 1;
      for (let j = 0; j < 36; j++) {
        const a = rnd(j * 2.1 + 9) * Math.PI * 2, v = 2 + 3.5 * rnd(j * 4.3); const R_ = v * (1 - Math.exp(-k * 6)) / 1.5; const up = Math.max(0, 1.6 * rnd(j * 6.1) * k * 2.4 - 4.9 * k * k * 2.4);
        const pt = PR([cxw + Math.cos(a) * (0.5 + R_), up, czw + Math.sin(a) * (0.5 + R_)]); const al = cl(1 - k / 1.0); if (al <= 0 || pt[2] < 0.5) continue;
        g.fillStyle = `rgba(240,228,210,${al * 0.8})`; g.beginPath(); g.arc(pt[0], pt[1], 2 + 3 * rnd(j * 8), 0, 7); g.fill();
      }
      if (k < 0.12) { const pt = PR([cxw, 0, czw]); const q = k / 0.12; const rg = g.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], 420); rg.addColorStop(0, `rgba(255,236,200,${0.35 * (1 - q)})`); rg.addColorStop(1, "rgba(255,236,200,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H); }
    }
    // Mauszeiger tippt den ersten Stein an
    if (u < 0.5) {
      const S = st.stones[0], c = Math.cos(th[0]), s = Math.sin(th[0]); const f = -t, uu = h * 0.9, sd = w * 0.47; const f2 = f * c + uu * s, u2 = -f * s + uu * c;
      const pt = PR([S.px + S.dx * f2 + S.ex * sd, u2, S.pz + S.dz * f2 + S.ez * sd]); const back = out3(seg(u, 0.12, 0.45));
      const x = pt[0] - 4 + back * 170, y = pt[1] - 4 + back * 200; g.save(); g.globalAlpha = 1 - seg(u, 0.25, 0.48); cursor(g, x, y, 1.25 + back * 0.4, u < 0.12 ? 1 : 0); g.restore();
      if (u < 0.2) { const q = u / 0.2; ring(g, pt[0], pt[1], 20 + q * 70, 6 * (1 - q), `rgba(255,255,255,${0.7 * (1 - q)})`); }
    }
    // Untertitelbereich ruhig halten
    { const gb = g.createLinearGradient(0, 1170, 0, 1440); gb.addColorStop(0, "rgba(4,6,10,0)"); gb.addColorStop(1, "rgba(4,6,10,0.88)"); g.fillStyle = gb; g.fillRect(0, 1170, W, H - 1170); }
    // Rand abdunkeln
    const rg = g.createRadialGradient(540, 860, 380, 540, 860, 1150); rg.addColorStop(0, "rgba(0,0,0,0)"); rg.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = rg; g.fillRect(0, 0, W, H);
  },
  ev(d, p) {
    const N = hdomLabels(p).length, Tm = hdomTimes(d, N); const E = [[0, "domino_tap", 1.0, -0.1]];
    for (let i = 1; i < N; i++) E.push([Tm.T[i], "domino_clack" + Math.min(7, i - 1), 0.75 + 0.05 * i, (i / (N - 1) - 0.5) * 0.6]);
    E.push([Tm.tHit, "domino_thud", 1.0, 0.25]); E.push([Tm.tHit, "thump", 0.45, 0]); E.push([Tm.tHit + 0.03, "domino_dust", 0.5, 0.2]);
    return E;
  },
};
