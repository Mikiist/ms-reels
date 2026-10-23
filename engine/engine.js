// Mihajlo Systems Reel-Engine. Liest window.SPEC (von build.py erzeugt) und zeichnet jedes Bild aus der Zeit t.
// window.render(t) zeichnet, window.EVENTS() liefert Ton-Ereignisse, window.INFO() Eckdaten.
const W = 1080, H = 1920, TR = 0.32;
const SPEC = window.SPEC;
const $ = (id) => document.getElementById(id);

// ---------- Mathe ----------
const cl = (x) => Math.max(0, Math.min(1, x));
const lerp = (a, b, u) => a + (b - a) * u;
const seg = (t, a, b) => (b <= a ? (t >= a ? 1 : 0) : cl((t - a) / (b - a)));
const out3 = (x) => 1 - Math.pow(1 - x, 3);
const in3 = (x) => x * x * x;
const inOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const outExpo = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
const inExpo = (x) => (x <= 0 ? 0 : Math.pow(2, 10 * x - 10));
const outBack = (x, c = 1.7) => 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
const outElastic = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1);
function rnd(s) { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
const SEED = (() => { let h = 7; for (const c of String(SPEC.id || "x")) h = (h * 31 + c.charCodeAt(0)) % 100003; return h; })();
const R = (k) => rnd(SEED * 0.013 + k * 1.618);

// ---------- Farbwelten ----------
const PAL = {
  night:    { bg: ["#04050a", "#0c1324"], fg: "#ffffff", sub: "#9fb0cc", acc: "#3b82f6", acc2: "#22d3ee", dark: true },
  offwhite: { bg: ["#f7f4ef", "#ebe5dc"], fg: "#121212", sub: "#6b655d", acc: "#2563eb", acc2: "#0ea5e9", dark: false },
  crimson:  { bg: ["#1f0306", "#5a0b13"], fg: "#ffffff", sub: "#f3a7ae", acc: "#ff4d5e", acc2: "#ffb020", dark: true },
  navy:     { bg: ["#0b1220", "#15284d"], fg: "#ffffff", sub: "#93a8cf", acc: "#60a5fa", acc2: "#22d3ee", dark: true },
  electric: { bg: ["#1e40af", "#2563eb"], fg: "#ffffff", sub: "#c7d7ff", acc: "#fde047", acc2: "#ffffff", dark: true },
  cream:    { bg: ["#f5eddf", "#ecdfc8"], fg: "#1c1917", sub: "#7c6f5f", acc: "#ea580c", acc2: "#2563eb", dark: false },
  gold:     { bg: ["#090806", "#1b160d"], fg: "#ffffff", sub: "#bfae8a", acc: "#f5c451", acc2: "#fff2c4", dark: true },
  mint:     { bg: ["#effcf6", "#cff5e4"], fg: "#052e2b", sub: "#3f6b5f", acc: "#059669", acc2: "#2563eb", dark: false },
  violet:   { bg: ["#12082a", "#311066"], fg: "#ffffff", sub: "#c4b5fd", acc: "#c084fc", acc2: "#22d3ee", dark: true },
  sky:      { bg: ["#e6f3ff", "#bfe0fb"], fg: "#0b1220", sub: "#4b6587", acc: "#2563eb", acc2: "#f97316", dark: false },
  black:    { bg: ["#000000", "#0b0b0d"], fg: "#ffffff", sub: "#8d8d95", acc: "#ff3b30", acc2: "#ffd60a", dark: true },
  sunset:   { bg: ["#2b0f3a", "#c2410c"], fg: "#ffffff", sub: "#fcd9bd", acc: "#fde68a", acc2: "#f472b6", dark: true },
  // Look brutal
  b_black:  { bg: ["#0a0a0a", "#0a0a0a"], fg: "#ffffff", sub: "#bdbdbd", acc: "#ffe600", acc2: "#ff2d2d", dark: true },
  b_yellow: { bg: ["#ffe600", "#ffe600"], fg: "#0a0a0a", sub: "#3a3a3a", acc: "#ff2d2d", acc2: "#0a0a0a", dark: false },
  b_red:    { bg: ["#ff2d2d", "#e31b1b"], fg: "#ffffff", sub: "#ffe0e0", acc: "#ffe600", acc2: "#0a0a0a", dark: true },
  b_white:  { bg: ["#f2f2f2", "#f2f2f2"], fg: "#0a0a0a", sub: "#555555", acc: "#ff2d2d", acc2: "#0a0a0a", dark: false },
  // Look neon
  n_mag:    { bg: ["#05010d", "#14002e"], fg: "#ffffff", sub: "#c9b8ff", acc: "#ff2bd6", acc2: "#00f0ff", dark: true },
  n_cyan:   { bg: ["#00060d", "#00202f"], fg: "#ffffff", sub: "#a6e9ff", acc: "#00f0ff", acc2: "#ff2bd6", dark: true },
  n_lime:   { bg: ["#020a02", "#0d2409"], fg: "#ffffff", sub: "#c8f7a8", acc: "#b6ff00", acc2: "#00f0ff", dark: true },
  // Look editorial
  e_cream:  { bg: ["#f3ede1", "#ebe2d0"], fg: "#141414", sub: "#6d655a", acc: "#d6311f", acc2: "#141414", dark: false },
  e_ink:    { bg: ["#141414", "#1f1d1a"], fg: "#f3ede1", sub: "#a39a8c", acc: "#ff5a3c", acc2: "#f3ede1", dark: true },
  e_sage:   { bg: ["#dfe5d8", "#d2dbc8"], fg: "#141414", sub: "#5c6656", acc: "#d6311f", acc2: "#1f3a2e", dark: false },
  // Look pop
  p_pink:   { bg: ["#ff3d9a", "#ff3d9a"], fg: "#ffffff", sub: "#ffe1f0", acc: "#ffe600", acc2: "#1f1fff", dark: true },
  p_blue:   { bg: ["#2626ff", "#2626ff"], fg: "#ffffff", sub: "#d6d6ff", acc: "#ffe600", acc2: "#ff3d9a", dark: true },
  p_orange: { bg: ["#ff5e00", "#ff5e00"], fg: "#ffffff", sub: "#ffe3cf", acc: "#ffe600", acc2: "#1f1fff", dark: true },
  p_green:  { bg: ["#00b85f", "#00b85f"], fg: "#ffffff", sub: "#d8ffe9", acc: "#ffe600", acc2: "#1f1fff", dark: true },
  p_purple: { bg: ["#7a22ff", "#7a22ff"], fg: "#ffffff", sub: "#e6d6ff", acc: "#ffe600", acc2: "#ff3d9a", dark: true },
  // Look terminal
  t_green:  { bg: ["#020604", "#04140b"], fg: "#d8ffe6", sub: "#5fae7e", acc: "#2dff7a", acc2: "#00d0ff", dark: true },
  t_amber:  { bg: ["#0a0602", "#1a1004"], fg: "#ffe9c7", sub: "#b98c4a", acc: "#ffb000", acc2: "#ff5d2d", dark: true },
  // Look kino
  c_teal:   { bg: ["#03141a", "#0a2a33"], fg: "#ffffff", sub: "#9fc7cf", acc: "#ffb547", acc2: "#4fd1c5", dark: true },
  c_warm:   { bg: ["#1a0d06", "#3a1a0a"], fg: "#ffffff", sub: "#e0b896", acc: "#ffd27a", acc2: "#ff7a45", dark: true },
  c_night:  { bg: ["#05070d", "#121a2b"], fg: "#ffffff", sub: "#9aa7c0", acc: "#ffb547", acc2: "#7aa2ff", dark: true },
  // Look objekt (ruhiges Studio wie das Seifenblasen-Video)
  o_cream:  { bg: ["#f5f0e9", "#e9e2d7"], fg: "#18181b", sub: "#8b8379", acc: "#b8862b", acc2: "#2f6fde", dark: false },
};

// ---------- Looks: jedes Video bekommt einen eigenen Stil (Schrift, Hintergrund, Untertitel, Effekte, Schluss) ----------
// cap = Schrift der Untertitel, cd = Schrift für große Zahlen/Titel im Bild, cs = Untertitel-Stil, bg = Hintergrund.
const LOOKS = {
  clean:     { cap: "Y", capW: 800, cd: "D", bg: "soft", pals: null, cs: "plain", grain: 0.07, cta: "ui", punch: 0.03 },
  brutal:    { cap: "A", capW: 400, cd: "A", bg: "flat", pals: ["b_black", "b_yellow", "b_red", "b_white"], cs: "box", upper: true, grain: 0.04, cta: "giant", punch: 0.07 },
  neon:      { cap: "U", capW: 800, cd: "D", bg: "neon", pals: ["n_mag", "n_cyan", "n_lime"], cs: "glow", grain: 0.06, ovl: "scan", rgb: true, cta: "giant", punch: 0.045 },
  editorial: { cap: "S", capW: 400, cd: "S", bg: "paper", pals: ["e_cream", "e_ink", "e_sage"], cs: "serif", grain: 0.1, cta: "ui", punch: 0.02 },
  pop:       { cap: "K", capW: 400, cd: "D", bg: "pop", pals: ["p_pink", "p_blue", "p_orange", "p_green", "p_purple"], cs: "sticker", grain: 0.05, cta: "giant", punch: 0.06 },
  terminal:  { cap: "M", capW: 700, cd: "D", bg: "term", pals: ["t_green", "t_amber"], cs: "mono", grain: 0.06, ovl: "scan", cta: "ui", punch: 0.03 },
  objekt:    { cap: "I", capW: 500, cd: "D", bg: "studio", pals: ["o_cream"], cs: "subtle", grain: 0.03, cta: "card", punch: 0, hideHook: true, calm: true, capY: 1720 },
  cinema:    { cap: "B", capW: 400, cd: "B", bg: "cine", pals: ["c_teal", "c_warm", "c_night"], cs: "cine", upper: true, grain: 0.13, ovl: "letterbox", cta: "giant", punch: 0.025 },
};
const LOOK_KEY = LOOKS[SPEC.look] ? SPEC.look : "clean";
const LOOK = LOOKS[LOOK_KEY];
function lum(hex) { const n = parseInt(hex.slice(1, 7), 16); return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }
function inkOn(c) { return lum(c) > 0.6 ? "#0a0a0a" : "#ffffff"; } // lesbare Schrift auf Farbe c
function cardInk(P) { return P.dark ? P.bg[1] : P.acc; } // Akzentschrift auf weißer Karte

// ---------- Feste Fakten (nur diese Zahlen dürfen in Preis- und Bewertungsszenen stehen) ----------
const FACTS = {
  pakete: {
    landingpage:  { name: "Landingpage", monat: 99, fest: 990 },
    business:     { name: "Business", monat: 179, fest: 1990 },
    professional: { name: "Professional", monat: 279, fest: 2990 },
  },
  google: { sterne: "4,8", anzahl: 19 },
  zitat: { text: "Nach 1 Woche schon 4 Neukunden gewonnen.", name: "Justus Haase" },
  url: "mihajlostanojevic.com",
};

// ---------- Zeichenhilfen ----------
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function fillRR(g, x, y, w, h, r, c) { g.fillStyle = c; rr(g, x, y, w, h, r); g.fill(); }
function font(g, w, px, fam = "D") { const f = fam === "D" ? LOOK.cd : fam === "serif" ? "serif" : fam === "I" ? "I" : fam; g.font = `${w} ${px}px ${f}`; }
function txt(g, s, x, y, { w = 700, px = 40, fam = "D", c = "#fff", al = "center", base = "middle", ls = 0 } = {}) {
  font(g, w, px, fam); g.fillStyle = c; g.textAlign = al; g.textBaseline = base;
  if (ls) g.letterSpacing = ls + "px"; g.fillText(s, x, y); if (ls) g.letterSpacing = "0px";
}
function fitPx(g, s, maxW, px, w = 800, fam = "D") { font(g, w, px, fam); const m = g.measureText(s).width; return m > maxW ? Math.floor(px * maxW / m) : px; }
function shadow(g, blur, oy, c) { g.shadowColor = c; g.shadowBlur = blur; g.shadowOffsetY = oy; g.shadowOffsetX = 0; }
function noShadow(g) { g.shadowColor = "transparent"; g.shadowBlur = 0; g.shadowOffsetY = 0; }
function circle(g, x, y, r, c) { g.fillStyle = c; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); }
function ring(g, x, y, r, lw, c, a0 = 0, a1 = Math.PI * 2) { g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); g.arc(x, y, r, a0, a1); g.stroke(); }
function check(g, x, y, s, p, c, lw = 14) { // Häkchen, p = 0..1 gezeichnet
  const pts = [[-0.5, 0], [-0.15, 0.35], [0.55, -0.4]]; const L1 = Math.hypot(0.35, 0.35), L2 = Math.hypot(0.7, 0.75), L = L1 + L2;
  g.strokeStyle = c; g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath();
  g.moveTo(x + pts[0][0] * s, y + pts[0][1] * s); const d = p * L;
  if (d <= L1) { const k = d / L1; g.lineTo(x + lerp(pts[0][0], pts[1][0], k) * s, y + lerp(pts[0][1], pts[1][1], k) * s); }
  else { const k = (d - L1) / L2; g.lineTo(x + pts[1][0] * s, y + pts[1][1] * s); g.lineTo(x + lerp(pts[1][0], pts[2][0], k) * s, y + lerp(pts[1][1], pts[2][1], k) * s); }
  g.stroke();
}
function cross(g, x, y, s, p, c, lw = 16) {
  g.strokeStyle = c; g.lineWidth = lw; g.lineCap = "round"; const a = cl(p * 2), b = cl(p * 2 - 1);
  g.beginPath(); g.moveTo(x - s, y - s); g.lineTo(x - s + 2 * s * a, y - s + 2 * s * a); g.stroke();
  if (b > 0) { g.beginPath(); g.moveTo(x + s, y - s); g.lineTo(x + s - 2 * s * b, y - s + 2 * s * b); g.stroke(); }
}
function star(g, x, y, r, fillP, cOn, cOff) {
  const path = () => { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr_ = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr_, y + Math.sin(a) * rr_); } g.closePath(); };
  path(); g.fillStyle = cOff; g.fill();
  if (fillP > 0) { g.save(); path(); g.clip(); g.fillStyle = cOn; g.fillRect(x - r, y - r, 2 * r * cl(fillP), 2 * r); g.restore(); }
}
function cursor(g, x, y, s = 1, press = 0) {
  g.save(); g.translate(x, y); g.scale(s * (1 - press * 0.12), s * (1 - press * 0.12));
  shadow(g, 18, 8, "rgba(0,0,0,0.35)");
  g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 92); g.lineTo(24, 70); g.lineTo(40, 106); g.lineTo(56, 99); g.lineTo(40, 64); g.lineTo(72, 62); g.closePath();
  g.fillStyle = "#111"; g.fill(); noShadow(g); g.strokeStyle = "#fff"; g.lineWidth = 6; g.lineJoin = "round"; g.stroke(); g.restore();
}
function phone(g, cx, cy, w, h, drawScreen, tilt = 0) {
  g.save(); g.translate(cx, cy); g.rotate(tilt);
  shadow(g, 70, 40, "rgba(0,0,0,0.45)"); fillRR(g, -w / 2, -h / 2, w, h, w * 0.14, "#0d0d10"); noShadow(g);
  // Rahmen mit Glanz
  const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, "#4a4a52"); gr.addColorStop(0.5, "#1a1a1f"); gr.addColorStop(1, "#55555e");
  g.strokeStyle = gr; g.lineWidth = 6; rr(g, -w / 2 + 3, -h / 2 + 3, w - 6, h - 6, w * 0.14 - 3); g.stroke();
  const m = 16; g.save(); rr(g, -w / 2 + m, -h / 2 + m, w - 2 * m, h - 2 * m, w * 0.12); g.clip();
  g.translate(-w / 2 + m, -h / 2 + m); drawScreen(g, w - 2 * m, h - 2 * m); g.restore();
  fillRR(g, -60, -h / 2 + 30, 120, 34, 17, "#0d0d10");
  g.restore();
}
function browser(g, x, y, w, h, url, drawPage, dark = false) {
  shadow(g, 60, 30, "rgba(0,0,0,0.30)"); fillRR(g, x, y, w, h, 28, dark ? "#15171c" : "#ffffff"); noShadow(g);
  g.save(); rr(g, x, y, w, h, 28); g.clip();
  g.fillStyle = dark ? "#1d2027" : "#eef1f5"; g.fillRect(x, y, w, 70);
  for (let i = 0; i < 3; i++) circle(g, x + 36 + i * 28, y + 35, 9, ["#ff5f57", "#febc2e", "#28c840"][i]);
  fillRR(g, x + 130, y + 16, w - 160, 38, 19, dark ? "#262a33" : "#ffffff");
  txt(g, url, x + 152, y + 36, { w: 500, px: 22, fam: "I", c: dark ? "#8b93a3" : "#5b6474", al: "left" });
  g.translate(x, y + 70); drawPage(g, w, h - 70); g.restore();
}
function confetti(g, cx, cy, u, n = 70, cols = ["#2563eb", "#22d3ee", "#fde047", "#f472b6", "#22c55e"], spread = 900, seed = 1) {
  if (u <= 0 || u > 2.2) return;
  for (let i = 0; i < n; i++) {
    const a = rnd(seed + i) * Math.PI * 2, v = (0.4 + rnd(seed + i * 3) * 0.8) * spread;
    const x = cx + Math.cos(a) * v * out3(cl(u / 1.2)), y = cy + Math.sin(a) * v * out3(cl(u / 1.2)) * 0.8 + 600 * u * u * 0.5;
    g.save(); g.translate(x, y); g.rotate(u * (rnd(seed + i * 7) - 0.5) * 18); g.globalAlpha = cl(1.8 - u);
    g.fillStyle = cols[i % cols.length]; g.fillRect(-9, -5, 18, 10); g.restore();
  }
}
function sparkles(g, cx, cy, u, n, rad, c, seed = 3) {
  for (let i = 0; i < n; i++) {
    const ph = rnd(seed + i) * 2, k = ((u * 0.9 + ph) % 2) / 2; const a = rnd(seed + i * 5) * Math.PI * 2, r = rad * (0.3 + rnd(seed + i * 9) * 0.9);
    const s = Math.sin(k * Math.PI) * (6 + rnd(seed + i) * 10); if (s <= 0.2) continue;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r - k * 60;
    g.fillStyle = c; g.globalAlpha = Math.sin(k * Math.PI); g.beginPath();
    g.moveTo(x, y - s * 2); g.quadraticCurveTo(x, y, x + s * 2, y); g.quadraticCurveTo(x, y, x, y + s * 2); g.quadraticCurveTo(x, y, x - s * 2, y); g.quadraticCurveTo(x, y, x, y - s * 2); g.fill();
  }
  g.globalAlpha = 1;
}
function shock(g, cx, cy, u, c, maxR = 900, n = 3) {
  for (let i = 0; i < n; i++) { const k = u - i * 0.12; if (k <= 0 || k > 1) continue; ring(g, cx, cy, out3(k) * maxR, 18 * (1 - k) + 2, c.replace("A", (0.7 * (1 - k)).toFixed(3))); }
}
function wrapLines(g, s, maxW) { const words = s.split(" "); const lines = []; let cur = ""; for (const w of words) { const t = cur ? cur + " " + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
function logoImg() { return $("logo"); }

// ---------- Hintergrund ----------
function background(g, P, u, sc) {
  const B = BGS[LOOK.bg]; if (B) return B(g, P, u, sc);
  const gr = g.createLinearGradient(0, 0, W * 0.4, H); gr.addColorStop(0, P.bg[0]); gr.addColorStop(1, P.bg[1]);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // weiche Farbflecken mit Parallax
  for (let i = 0; i < 3; i++) {
    const bx = W * (0.15 + 0.7 * R(sc.i * 11 + i)) + Math.sin(u * 0.6 + i * 2) * 60, by = H * (0.15 + 0.7 * R(sc.i * 7 + i * 3)) + Math.cos(u * 0.5 + i) * 80;
    const rad = 420 + 260 * R(sc.i + i * 13); const c = i === 1 ? P.acc2 : P.acc;
    const rg = g.createRadialGradient(bx, by, 0, bx, by, rad); rg.addColorStop(0, hexA(c, P.dark ? 0.22 : 0.16)); rg.addColorStop(1, hexA(c, 0));
    g.fillStyle = rg; g.fillRect(0, 0, W, H);
  }
  const v = sc.bgv;
  g.save(); g.globalAlpha = P.dark ? 0.08 : 0.07; g.strokeStyle = P.fg; g.fillStyle = P.fg;
  if (v === 1) { g.lineWidth = 2; const o = (u * 30) % 90; for (let x = -90 + o; x < W + 90; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = -90 + o; y < H + 90; y += 90) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } }
  else if (v === 2) { for (let x = 30; x < W; x += 60) for (let y = 30; y < H; y += 60) { g.beginPath(); g.arc(x, y + ((u * 20) % 60), 3, 0, 7); g.fill(); } }
  else if (v === 3) { g.lineWidth = 26; const o = (u * 60) % 120; for (let k = -H; k < W + H; k += 120) { g.beginPath(); g.moveTo(k + o, 0); g.lineTo(k + o - H * 0.5, H); g.stroke(); } }
  else if (v === 4) { g.translate(W / 2, sc.gc); g.rotate(u * 0.15); for (let k = 0; k < 18; k++) { g.rotate(Math.PI / 9); g.beginPath(); g.moveTo(0, 0); g.lineTo(-90, -2200); g.lineTo(90, -2200); g.closePath(); g.fill(); } }
  g.restore();
}
// Hintergründe der Looks
function phraseIdx(sc, u) { const t = sc.t0 + u; let k = 0; for (const ph of sc.phrases || []) if (t >= ph.start) k++; return k; }
const BGS = {
  studio(g, P, u, sc) { // ruhiges Studio: Creme, weiches Licht von oben, Boden-Schatten
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, P.bg[0]); gr.addColorStop(1, P.bg[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const lg = g.createRadialGradient(540, 300, 0, 540, 300, 1100); lg.addColorStop(0, "rgba(255,255,255,0.55)"); lg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = lg; g.fillRect(0, 0, W, H);
  },
  flat(g, P, u, sc) { // brutal: Vollfarbe, harte Streifen-Bahn, Rahmen
    g.fillStyle = P.bg[0]; g.fillRect(0, 0, W, H);
    g.save(); g.translate(W / 2, sc.gc); g.rotate(-0.32); const o = (u * 140) % 80; g.fillStyle = hexA(P.fg, 0.07);
    for (let x = -1400 + o; x < 1400; x += 80) g.fillRect(x, -170, 34, 340); g.restore();
    g.strokeStyle = P.fg; g.lineWidth = 14; g.strokeRect(34, 34, W - 68, H - 68);
    for (const [x, y] of [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]]) { g.fillStyle = P.acc; g.fillRect(x - 22, y - 22, 44, 44); }
  },
  neon(g, P, u, sc) { // Synthwave: Gitterboden, Horizontglühen, Sonne
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, P.bg[0]); gr.addColorStop(0.62, P.bg[1]); gr.addColorStop(1, "#000"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const hz = H * 0.66; const sun = g.createLinearGradient(0, hz - 520, 0, hz); sun.addColorStop(0, hexA(P.acc2, 0.55)); sun.addColorStop(1, hexA(P.acc, 0.55));
    g.save(); g.beginPath(); g.arc(540, hz, 330, Math.PI, 0); g.clip(); g.fillStyle = sun; g.fillRect(200, hz - 340, 680, 340);
    g.fillStyle = P.bg[1]; for (let k = 0; k < 7; k++) { const y = hz - 30 - k * 40 - ((u * 30) % 40); g.fillRect(200, y, 680, 6 + k * 1.6); } g.restore();
    const hg = g.createRadialGradient(540, hz, 0, 540, hz, 700); hg.addColorStop(0, hexA(P.acc, 0.45)); hg.addColorStop(1, hexA(P.acc, 0)); g.fillStyle = hg; g.fillRect(0, hz - 700, W, 1400);
    g.save(); g.strokeStyle = hexA(P.acc, 0.75); g.lineWidth = 3; g.shadowColor = P.acc; g.shadowBlur = 16; g.beginPath();
    for (let k = -12; k <= 12; k++) { g.moveTo(540 + k * 18, hz); g.lineTo(540 + k * 260, H); }
    for (let k = 0; k < 14; k++) { const z = ((k + u * 1.6) % 14) / 14; const y = hz + (H - hz) * Math.pow(z, 2.2); g.moveTo(0, y); g.lineTo(W, y); }
    g.stroke(); g.restore(); g.fillStyle = hexA(P.acc2, 0.9); g.fillRect(0, hz - 2, W, 4);
    for (let i = 0; i < 40; i++) { const a = 0.3 + 0.7 * Math.abs(Math.sin(u * 2 + i)); circle(g, rnd(i * 3.1) * W, rnd(i * 5.7) * hz * 0.8, 1.5 + rnd(i) * 2, `rgba(255,255,255,${0.5 * a})`); }
  },
  paper(g, P, u, sc) { // Magazin: Papier, Fasern, Rasterpunkte, Linien
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, P.bg[0]); gr.addColorStop(1, P.bg[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.save(); g.strokeStyle = hexA(P.fg, 0.05); g.lineWidth = 1.5; for (let i = 0; i < 260; i++) { const x = rnd(i * 1.3) * W, y = rnd(i * 2.9) * H, a = rnd(i * 4.1) * 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 26, y + Math.sin(a) * 26); g.stroke(); } g.restore();
    const cx = 900 + Math.sin(u * 0.5) * 20, cy = 300; for (let x = 560; x < W + 40; x += 30) for (let y = -40; y < 760; y += 30) { const dd = Math.hypot(x - cx, y - cy); const r = Math.max(0, 11 - dd / 42); if (r > 0.5) circle(g, x, y, r, hexA(P.acc, 0.55)); }
    g.fillStyle = P.fg; g.fillRect(70, 150, W - 140, 5); g.fillRect(70, 166, W - 140, 2); g.fillRect(70, H - 168, W - 140, 2); g.fillRect(70, H - 158, W - 140, 5);
    txt(g, "MIHAJLO SYSTEMS", 70, H - 120, { w: 600, px: 24, fam: "I", c: P.sub, al: "left", ls: 6 }); txt(g, "NR. " + String(1 + (SEED % 97)).padStart(2, "0"), W - 70, H - 120, { w: 600, px: 24, fam: "I", c: P.sub, al: "right", ls: 6 });
  },
  pop(g, P, u, sc) { // Farbwechsel bei jeder neuen Untertitel-Zeile, Strahlen, Rasterpunkte
    const cols = P.dark ? ["#ff3d9a", "#2626ff", "#ff5e00", "#00b85f", "#7a22ff"] : [P.bg[0]]; const k = phraseIdx(sc, u);
    const base = cols.indexOf(P.bg[0]); const c = cols[((base < 0 ? 0 : base) + k) % cols.length]; g.fillStyle = c; g.fillRect(0, 0, W, H);
    g.save(); g.translate(540, sc.gc); g.rotate(u * 0.25); g.fillStyle = "rgba(255,255,255,0.10)"; for (let i = 0; i < 16; i++) { g.rotate(Math.PI / 8); g.beginPath(); g.moveTo(0, 0); g.lineTo(-120, -2300); g.lineTo(120, -2300); g.closePath(); g.fill(); } g.restore();
    for (let x = 18; x < W; x += 36) for (let y = 18; y < H; y += 36) { const r = 2 + 5 * cl((x + y) / (W + H)); circle(g, x, y, r, "rgba(0,0,0,0.10)"); }
  },
  term(g, P, u, sc) { // Terminal: Punktraster, fallender Code, Abtastlinie
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, P.bg[0]); gr.addColorStop(1, P.bg[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let x = 27; x < W; x += 54) for (let y = 27; y < H; y += 54) circle(g, x, y, 2, hexA(P.acc, 0.16));
    const CH = "01{}<>/=;+*#$"; g.font = "700 26px M"; g.textAlign = "center"; g.textBaseline = "middle";
    for (let c = 0; c < 18; c++) { const x = 30 + c * 60, sp = 80 + rnd(c * 7.7) * 160, off = rnd(c * 3.3) * H; for (let r = 0; r < 14; r++) { const y = (off + u * sp + r * 34) % (H + 200) - 100; g.fillStyle = hexA(P.acc, 0.05 + 0.10 * (r / 14)); g.fillText(CH[Math.floor(rnd(c * 31 + r + Math.floor(u * 6)) * CH.length)], x, y); } }
    const sy = (u * 520) % (H + 300) - 150; const sg = g.createLinearGradient(0, sy - 120, 0, sy); sg.addColorStop(0, hexA(P.acc, 0)); sg.addColorStop(1, hexA(P.acc, 0.12)); g.fillStyle = sg; g.fillRect(0, sy - 120, W, 120);
  },
  cine(g, P, u, sc) { // Kino: Farbverlauf, Lichtfleck, Staub
    const gr = g.createLinearGradient(0, 0, W * 0.3, H); gr.addColorStop(0, P.bg[0]); gr.addColorStop(1, P.bg[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const lx = W * 0.82 + Math.sin(u * 0.7) * 120, ly = H * 0.18 + Math.cos(u * 0.5) * 80; const lg = g.createRadialGradient(lx, ly, 0, lx, ly, 900); lg.addColorStop(0, hexA(P.acc, 0.38)); lg.addColorStop(1, hexA(P.acc, 0)); g.fillStyle = lg; g.fillRect(0, 0, W, H);
    const l2 = g.createRadialGradient(120, H * 0.85, 0, 120, H * 0.85, 800); l2.addColorStop(0, hexA(P.acc2, 0.22)); l2.addColorStop(1, hexA(P.acc2, 0)); g.fillStyle = l2; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 50; i++) { const x = (rnd(i * 2.3) * W + u * (10 + rnd(i) * 30)) % W, y = (rnd(i * 4.7) * H - u * (8 + rnd(i * 9) * 20) + H) % H; circle(g, x, y, 1 + rnd(i * 3) * 2.5, `rgba(255,240,220,${0.15 + 0.25 * rnd(i * 6)})`); }
  },
};
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
function onCol(P) { return P.dark ? "#ffffff" : "#ffffff"; }
