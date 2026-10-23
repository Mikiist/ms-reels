import { Easing, interpolate } from "remotion";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
// Stimme startet bei 0,6 s, damit der Sound-Hook zuerst knallt
export const VO = 0.6;

export const C = {
  bg: "#04060c",
  bg2: "#0a1222",
  blue: "#2f7bff",
  cyan: "#5ee2ff",
  white: "#f4f7ff",
  sub: "#8a97b3",
  red: "#ff3b4e",
  gold: "#ffc94a",
  orange: "#ff7a1a",
};

export const FONT = "Inter";
export const DISPLAY = "InterDisplay";

// Zeit-Helfer: Wert zwischen a und b (Sekunden) auf 0..1, geklemmt, mit Easing
export const seg = (t: number, a: number, b: number, ease: (x: number) => number = (x) => x) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });

export const E = {
  out3: Easing.bezier(0.22, 1, 0.36, 1),
  outExpo: Easing.bezier(0.16, 1, 0.3, 1),
  in3: Easing.bezier(0.55, 0, 1, 0.45),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
  snap: Easing.bezier(0.7, 0, 0.2, 1),
};

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));

// deterministischer Zufall
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// glatte Wackel-Funktion (Summe von Sinus), für Kamerazittern
export const wob = (t: number, seed: number) =>
  Math.sin(t * 37.1 + seed) * 0.5 + Math.sin(t * 61.7 + seed * 2.3) * 0.3 + Math.sin(t * 91.3 + seed * 4.1) * 0.2;

// Stoß, der nach einem Ereignis abklingt (Stärke 1 bei t0)
export const kick = (t: number, t0: number, decay = 0.35) => (t < t0 ? 0 : Math.exp(-(t - t0) / decay));

// Kamerazittern aus mehreren Stößen
export const shake = (t: number, hits: [number, number, number?][]) => {
  let x = 0,
    y = 0,
    r = 0;
  for (const [t0, amp, dec] of hits) {
    const k = kick(t, t0, dec ?? 0.3) * amp;
    x += wob(t, t0 * 3) * k;
    y += wob(t, t0 * 7 + 1) * k;
    r += wob(t, t0 * 11 + 2) * k * 0.04;
  }
  return { x, y, r };
};

// ---------- Voronoi-Scherben ----------
type P = [number, number];
const clipHalf = (poly: P[], a: P, b: P): P[] => {
  // Halbebene: Punkte näher an a als an b
  const mx = (a[0] + b[0]) / 2,
    my = (a[1] + b[1]) / 2;
  const nx = b[0] - a[0],
    ny = b[1] - a[1];
  const side = (p: P) => (p[0] - mx) * nx + (p[1] - my) * ny; // <0 = Seite a
  const out: P[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i],
      q = poly[(i + 1) % poly.length];
    const sp = side(p),
      sq = side(q);
    if (sp <= 0) out.push(p);
    if (sp * sq < 0) {
      const k = sp / (sp - sq);
      out.push([p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]);
    }
  }
  return out;
};

export type Shard = { poly: P[]; cx: number; cy: number; d: number; i: number };

export const makeShards = (w: number, h: number, ix: number, iy: number, n: number): Shard[] => {
  const seeds: P[] = [];
  for (let i = 0; i < n; i++) {
    // dichter am Einschlag, außen grob
    const ring = Math.sqrt((i + 0.5) / n);
    const ang = i * 2.39996 + rnd(i) * 0.6;
    const r = ring * Math.max(w, h) * 0.78 * (0.8 + rnd(i + 50) * 0.4);
    seeds.push([clamp(ix + Math.cos(ang) * r, 4, w - 4), clamp(iy + Math.sin(ang) * r * 1.15, 4, h - 4)]);
  }
  return seeds.map((s, i) => {
    let poly: P[] = [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ];
    seeds.forEach((o, j) => {
      if (j !== i) poly = clipHalf(poly, s, o);
    });
    const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length;
    const cy = poly.reduce((a, p) => a + p[1], 0) / poly.length;
    return { poly, cx, cy, d: Math.hypot(cx - ix, cy - iy), i };
  });
};

export const polyCss = (poly: P[], w: number, h: number) =>
  `polygon(${poly.map(([x, y]) => `${((x / w) * 100).toFixed(3)}% ${((y / h) * 100).toFixed(3)}%`).join(",")})`;
