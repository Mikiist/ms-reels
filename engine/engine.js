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
};

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
  ort: "Goslar",
};

// ---------- Zeichenhilfen ----------
function rr(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function fillRR(g, x, y, w, h, r, c) { g.fillStyle = c; rr(g, x, y, w, h, r); g.fill(); }
function font(g, w, px, fam = "D") { g.font = `${w} ${px}px ${fam === "D" ? "D" : fam === "serif" ? "serif" : "I"}`; }
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
function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
function onCol(P) { return P.dark ? "#ffffff" : "#ffffff"; }
