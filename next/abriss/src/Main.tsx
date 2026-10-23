import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { C, DISPLAY, E, FONT, FPS, H, W, clamp, kick, lerp, makeShards, polyCss, rnd, seg, shake, wob } from "./lib";
import { NewSite, OldSite, SH, SW } from "./Sites";
import { Captions } from "./Captions";
import { Search, CallScreen } from "./Screens";
import logoPts from "./logoPoints.json";

// ---------- Zeitmarken (Sekunden, Videozeit; Stimme beginnt bei 0,6 s) ----------
export const T = {
  crack1: 1.68, // "so"
  crack2: 3.02, // "reißen"
  shatter: 3.74, // "ab"
  back: 4.6, // "bauen sie neu"
  pieces: [5.86, 6.12, 6.38, 6.6, 6.78], // "Stück für Stück"
  fast: 7.08, // "schnell"
  clear: 7.86, // "klar"
  fold: 8.3, // "fürs Handy gemacht"
  dive: 9.86, // "damit"
  google: 11.3, // "Google finden"
  tap: 12.12,
  ring: 12.5, // "endlich"
  burst: 13.3, // "anrufen"
  logo: 14.48, // "Mihajlo Systems"
  goslar: 15.8,
  cta: 16.4, // "kommentieren"
  website: 17.0,
  pill: 18.35,
  end: 22.5,
};

const IMPACT: [number, number] = [SW * 0.56, SH * 0.4];
const SHARDS = makeShards(SW, SH, IMPACT[0], IMPACT[1], 40);
const MAXD = Math.max(...SHARDS.map((s) => s.d));

// Risskanten = Kanten der Scherben, sortiert nach Abstand zum Einschlag
type Edge = { x1: number; y1: number; x2: number; y2: number; d: number };
const EDGES: Edge[] = (() => {
  const out: Edge[] = [];
  const seen = new Set<string>();
  for (const s of SHARDS) {
    for (let i = 0; i < s.poly.length; i++) {
      const a = s.poly[i],
        b = s.poly[(i + 1) % s.poly.length];
      const onBorder = (p: number[]) => p[0] < 1 || p[1] < 1 || p[0] > SW - 1 || p[1] > SH - 1;
      if (onBorder(a) && onBorder(b)) continue;
      const key = [a, b]
        .map((p) => `${Math.round(p[0])},${Math.round(p[1])}`)
        .sort()
        .join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      // vom Einschlag weg zeichnen
      const da = Math.hypot(a[0] - IMPACT[0], a[1] - IMPACT[1]);
      const db = Math.hypot(b[0] - IMPACT[0], b[1] - IMPACT[1]);
      const [p, q] = da < db ? [a, b] : [b, a];
      out.push({ x1: p[0], y1: p[1], x2: q[0], y2: q[1], d: Math.min(da, db) });
    }
  }
  return out;
})();

// Momente mit schneller Bewegung bekommen echte Bewegungsunschärfe
const BLUR: [number, number][] = [
  [0, 0.55],
  [T.shatter - 0.05, T.shatter + 0.45],
  [T.back - 0.02, T.back + 0.95],
  [T.fast - 0.05, T.fast + 0.55],
  [T.fold, T.fold + 1.0],
  [T.dive - 0.05, T.dive + 0.7],
  [T.tap, T.tap + 0.75],
  [T.burst - 0.05, T.burst + 0.8],
  [T.logo - 0.55, T.logo + 0.1],
  [T.cta, T.cta + 0.7],
];

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fast = BLUR.some(([a, b]) => t >= a && t <= b);
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: FONT, overflow: "hidden" }}>
      <Audio src={staticFile("mix.wav")} />
      <Backdrop t={t} />
      <CameraMotionBlur samples={fast ? 7 : 1} shutterAngle={220}>
        <World />
      </CameraMotionBlur>
      <HookText t={t} />
      <Captions t={t} />
      <Overlays t={t} frame={frame} />
    </AbsoluteFill>
  );
};

const World: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const sh = shake(t, [
    [0.42, 26, 0.3],
    [T.crack1, 16, 0.25],
    [T.crack2, 24, 0.3],
    [T.shatter, 70, 0.45],
    [T.back + 0.68, 18, 0.25],
    [T.clear, 10, 0.2],
    [T.burst, 30, 0.4],
    [T.logo, 34, 0.45],
  ]);
  const ca = kick(t, T.shatter, 0.25) + kick(t, T.logo, 0.2) * 0.7 + kick(t, T.burst, 0.2) * 0.5;
  return (
    <AbsoluteFill
      style={{
        translate: `${sh.x}px ${sh.y}px`,
        rotate: `${sh.r}deg`,
        filter: ca > 0.02 ? `drop-shadow(${ca * 9}px 0 0 #ff2a5599) drop-shadow(${-ca * 9}px 0 0 #2ad4ff99)` : undefined,
      }}
    >
      {t < T.dive + 0.65 && <SiteStage t={t} />}
      {t >= T.shatter && t < T.shatter + 0.9 && <Shock t={t} />}
      {t >= T.dive + 0.3 && t < T.tap + 0.45 && <SearchStage t={t} />}
      {t >= T.tap && t < T.logo + 0.2 && <PhoneCall t={t} />}
      {t >= T.burst - 0.05 && t < T.logo + 0.4 && <Burst t={t} />}
      {t >= T.logo - 0.7 && <LogoStage t={t} />}
      {t >= T.cta && <Cta t={t} />}
    </AbsoluteFill>
  );
};

// Druckwelle + Glassplitter beim Zerspringen
const Shock: React.FC<{ t: number }> = ({ t }) => {
  const k = seg(t, T.shatter, T.shatter + 0.55, E.outExpo);
  const cx = W / 2 + (IMPACT[0] - SW / 2) * 0.86,
    cy = 880 + (IMPACT[1] - SH / 2) * 0.86;
  return (
    <AbsoluteFill style={{ perspective: 1200 }}>
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: 100,
          height: 100,
          borderRadius: 50,
          translate: "-50% -50%",
          border: `${lerp(30, 2, k)}px solid #fff`,
          scale: String(lerp(0.2, 22, k)),
          opacity: (1 - k) * 0.8,
          filter: "blur(2px)",
        }}
      />
      {Array.from({ length: 70 }, (_, i) => {
        const a = rnd(i + 100) * Math.PI * 2;
        const sp = 400 + rnd(i + 200) * 1300;
        const fall = seg(t, T.shatter, T.shatter + 0.9);
        const q = seg(t, T.shatter, T.shatter + 0.18, E.outExpo) * 0.7 + fall * 0.3;
        const x = cx + Math.cos(a) * sp * q;
        const y = cy + Math.sin(a) * sp * q + fall * fall * 260;
        const z = rnd(i + 300) * 900 * q;
        const sz = 6 + rnd(i + 400) * 22;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz * (0.4 + rnd(i) * 0.8),
              background: i % 3 ? "#e8f6ff" : "#ffffff",
              clipPath: "polygon(50% 0, 100% 100%, 0 70%)",
              transform: `translateZ(${z}px) rotate(${rnd(i + 500) * 720 * q}deg)`,
              opacity: (1 - fall) * 0.95,
              boxShadow: "0 0 12px #fff",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Hintergrund: Tiefe, Licht, Bauplan-Boden ----------
const Backdrop: React.FC<{ t: number }> = ({ t }) => {
  const grid = seg(t, T.back, T.back + 0.6, E.out3) * (1 - seg(t, T.dive, T.dive + 0.4));
  const warm = kick(t, T.shatter, 0.6);
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% ${42 + wob(t * 0.05, 3) * 3}%, ${C.bg2} 0%, ${C.bg} 70%)`,
        }}
      />
      {/* Lichtkegel von oben */}
      <AbsoluteFill
        style={{
          background: `conic-gradient(from 180deg at 50% -10%, transparent 160deg, #3b82f622 175deg, #5ee2ff18 180deg, #3b82f622 185deg, transparent 200deg)`,
          opacity: 0.7 + 0.3 * Math.sin(t * 1.3),
        }}
      />
      {/* Bauplan-Boden in Perspektive */}
      <div
        style={{
          position: "absolute",
          left: -600,
          right: -600,
          top: 1180,
          height: 1400,
          transformOrigin: "50% 0%",
          transform: "perspective(900px) rotateX(72deg)",
          backgroundImage: `linear-gradient(${C.cyan}55 2px, transparent 2px), linear-gradient(90deg, ${C.cyan}55 2px, transparent 2px)`,
          backgroundSize: "120px 120px",
          backgroundPosition: `0 ${(t * 160) % 120}px`,
          opacity: grid * 0.55,
          maskImage: "linear-gradient(180deg, #000 0%, transparent 85%)",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 56% 40%, #ff6a3d55 0%, transparent 50%)`, opacity: warm }} />
    </AbsoluteFill>
  );
};

// ---------- Website: alt, Risse, Scherben, Neubau, Handy ----------
const SiteStage: React.FC<{ t: number }> = ({ t }) => {
  // Kamera: schwebt herein, dreht sich, Zeitlupen-Orbit beim Zerspringen
  const intro = seg(t, 0, T.shatter, E.inOut);
  const rush = seg(t, 0, 0.45, E.outExpo);
  const orbit = seg(t, T.shatter, T.back, E.out3) * (1 - seg(t, T.back, T.back + 0.8, E.inOut));
  const settle = seg(t, T.back, 5.6, E.out3);
  const rx = lerp(lerp(16, 4, intro), 0, settle) + orbit * 10 + (1 - rush) * 30;
  const ry = lerp(lerp(-20, 7, intro), 0, settle) - orbit * 18 + (1 - rush) * -40;
  const baseScale = lerp(lerp(0.84, 0.9, intro), 0.86, settle);
  const z = lerp(-1100, 0, rush) + lerp(-60, 60, intro) * (1 - settle) + orbit * 40;

  // Handy-Faltung
  const fold = seg(t, T.fold, T.fold + 1.0, E.inOut);
  const sw = lerp(SW, 500, fold);
  const shh = lerp(SH, 1060, fold);
  const foldRot = Math.sin(fold * Math.PI) * -26 + seg(t, T.fold + 1.0, T.fold + 1.5, E.out3) * 0;
  const phoneScale = lerp(1, 1.02, fold);
  const bezel = seg(t, T.fold + 0.35, T.fold + 0.9, E.out3);

  // Eintauchen ins Handy
  const dive = seg(t, T.dive, T.dive + 0.55, E.in3);
  const diveScale = lerp(1, 3.6, dive);

  // "schnell": schneller Scroll, "klar": Puls
  const scroll = Math.sin(seg(t, T.fast, T.fast + 0.5, E.inOut) * Math.PI) * 520;
  const whip = Math.sin(seg(t, T.fast - 0.05, T.fast + 0.45, E.inOut) * Math.PI * 2) * 30;

  const shattered = t >= T.shatter;
  const rebuilt = t >= T.back + 0.86;
  const reveal = T.pieces.map((p) => seg(t, p, p + 0.2, E.out3));

  const float = wob(t * 0.08, 1) * 10;

  return (
    <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 45%" }}>
      <div
        style={{
          position: "absolute",
          left: W / 2,
          top: 880 + float,
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `translate3d(${whip}px,0,${z}px) scale(${baseScale * phoneScale * diveScale}) rotateX(${rx}deg) rotateY(${ry + foldRot}deg)`,
          opacity: 1 - seg(t, T.dive + 0.38, T.dive + 0.55),
        }}
      >
        {/* Handy-Rahmen */}
        <div
          style={{
            position: "absolute",
            left: -sw / 2 - 22,
            top: -shh / 2 - 22,
            width: sw + 44,
            height: shh + 44,
            borderRadius: lerp(30, 92, fold),
            background: "linear-gradient(145deg,#2a2f3a,#0b0d12 45%,#1d222c)",
            boxShadow: `0 60px 140px #000c, 0 0 0 2px #3a4150 inset, 0 0 80px ${C.blue}${Math.round(bezel * 60)
              .toString(16)
              .padStart(2, "0")}`,
            opacity: bezel,
            transform: "translateZ(-2px)",
          }}
        />
        {/* Schatten der Karte */}
        <div
          style={{
            position: "absolute",
            left: -sw / 2,
            top: -shh / 2,
            width: sw,
            height: shh,
            boxShadow: shattered && !rebuilt ? "none" : `0 50px 120px #000a`,
            borderRadius: lerp(10, 70, fold),
          }}
        />
        {!shattered && (
          <div style={{ position: "absolute", left: -SW / 2, top: -SH / 2, width: SW, height: SH, borderRadius: 10, overflow: "hidden", filter: glitchFilter(t) }}>
            <OldSite t={t} />
            <Cracks t={t} />
          </div>
        )}
        {shattered && !rebuilt && <Shards t={t} />}
        {rebuilt && (
          <div style={{ position: "absolute", left: -sw / 2, top: -shh / 2, width: sw, height: shh, borderRadius: lerp(10, 70, fold), overflow: "hidden" }}>
            <NewSite w={sw} h={shh} reveal={reveal} scrollY={scroll} headPulse={kick(t, T.clear, 0.4)} />
            {/* Speed-Streifen bei "schnell" */}
            <SpeedLines t={t} />
            {/* Glanz über das Glas */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(115deg, transparent 35%, #ffffff30 48%, transparent 60%)",
                translate: `${lerp(-900, 900, seg(t, T.fold + 0.7, T.fold + 1.4, E.inOut))}px 0`,
                opacity: bezel,
              }}
            />
            {/* Notch */}
            <div style={{ position: "absolute", left: "50%", top: 18, width: 150, height: 40, borderRadius: 20, background: "#000", translate: "-50% 0", opacity: bezel }} />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const glitchFilter = (t: number) => {
  const g = Math.max(kick(t, 0.02, 0.18), kick(t, T.crack1, 0.15), kick(t, T.crack2, 0.2));
  const flick = Math.floor(t * 30) % 7 === 0 ? 0.15 : 0;
  return `contrast(${1 + g * 0.6 + flick}) saturate(${1 + g}) hue-rotate(${g * 40}deg) brightness(${1 + g * 0.5})`;
};

const Cracks: React.FC<{ t: number }> = ({ t }) => {
  const r1 = 230 * seg(t, T.crack1, T.crack1 + 0.12, E.outExpo);
  const r2 = 560 * seg(t, T.crack2, T.crack2 + 0.16, E.outExpo);
  const r3 = 900 * seg(t, T.shatter - 0.35, T.shatter, E.in3);
  const R = Math.max(r1, r2, r3);
  if (R <= 0) return null;
  const glow = Math.max(kick(t, T.crack1, 0.3), kick(t, T.crack2, 0.3));
  return (
    <svg width={SW} height={SH} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="cg">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle cx={IMPACT[0]} cy={IMPACT[1]} r={20 + glow * 40} fill="#fff" opacity={0.25 + glow * 0.6} filter="url(#cg)" />
      {EDGES.map((e, i) => {
        if (e.d > R) return null;
        const len = Math.hypot(e.x2 - e.x1, e.y2 - e.y1);
        const k = clamp((R - e.d) / Math.max(60, len));
        return (
          <g key={i} filter="url(#cg)">
            <line x1={e.x1} y1={e.y1} x2={lerp(e.x1, e.x2, k)} y2={lerp(e.y1, e.y2, k)} stroke="#000" strokeOpacity={0.55} strokeWidth={7} />
            <line x1={e.x1} y1={e.y1} x2={lerp(e.x1, e.x2, k)} y2={lerp(e.y1, e.y2, k)} stroke="#fff" strokeWidth={2.6} />
          </g>
        );
      })}
    </svg>
  );
};

const Shards: React.FC<{ t: number }> = ({ t }) => {
  const fastK = seg(t, T.shatter, T.shatter + 0.2, E.outExpo);
  const slowK = seg(t, T.shatter + 0.15, T.back + 0.05);
  const burst = fastK * 0.62 + slowK * 0.38;
  // Kamera fährt in der Zeitlupe langsam in die Scherbenwolke
  const dolly = Math.sin(seg(t, T.shatter, T.back + 0.6, E.inOut) * Math.PI) * 160;
  return (
    <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translateZ(${dolly}px)` }}>
      {SHARDS.map((s) => {
        const delay = (s.d / MAXD) * 0.22;
        const ret = seg(t, T.back + delay, T.back + 0.6 + delay, E.snap);
        const e = burst * (1 - ret);
        const dx = (s.cx - IMPACT[0]) / (s.d || 1),
          dy = (s.cy - IMPACT[1]) / (s.d || 1);
        const dist = 50 + rnd(s.i + 1) * 150 + (s.d / MAXD) * 90;
        const tx = dx * dist * e,
          ty = (dy * dist + (rnd(s.i + 2) - 0.5) * 80) * e;
        const tz = (rnd(s.i + 3) * 760 - 300) * e;
        // dreht in der Zeitlupe weiter
        const spin = e * (0.55 + slowK * 0.45);
        const rxs = (rnd(s.i + 4) - 0.5) * 110 * spin,
          rys = (rnd(s.i + 5) - 0.5) * 120 * spin,
          rzs = (rnd(s.i + 6) - 0.5) * 80 * spin;
        const newK = seg(ret, 0.35, 0.8);
        const land = ret > 0.92 ? kick(ret, 0.92, 0.04) : 0;
        const edgeLit = 0.15 + 0.85 * Math.abs(Math.sin((rys * Math.PI) / 180));
        return (
          <div
            key={s.i}
            style={{
              position: "absolute",
              left: -SW / 2,
              top: -SH / 2,
              width: SW,
              height: SH,
              clipPath: polyCss(s.poly, SW, SH),
              transformOrigin: `${s.cx}px ${s.cy}px`,
              transform: `translate3d(${tx}px,${ty}px,${tz}px) rotateX(${rxs}deg) rotateY(${rys}deg) rotateZ(${rzs}deg)`,
              filter: `brightness(${1 + land * 1.6 + e * 0.25 * edgeLit})`,
            }}
          >
            <div style={{ position: "absolute", inset: 0, opacity: 1 - newK }}>
              <OldSite t={t} />
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: newK }}>
              <NewSite wire={1} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const SpeedLines: React.FC<{ t: number }> = ({ t }) => {
  const k = Math.sin(seg(t, T.fast, T.fast + 0.5) * Math.PI);
  if (k <= 0.01) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k }}>
      {Array.from({ length: 22 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${rnd(i + 9) * 100}%`,
            top: `${((rnd(i + 3) * 100 + t * 900) % 120) - 10}%`,
            width: 3,
            height: 120 + rnd(i) * 260,
            background: `linear-gradient(${C.cyan}00, ${C.cyan}cc, ${C.cyan}00)`,
          }}
        />
      ))}
    </div>
  );
};

// ---------- Google-Suche ----------
const SearchStage: React.FC<{ t: number }> = ({ t }) => {
  const inK = seg(t, T.dive + 0.3, T.dive + 0.6, E.out3);
  const outK = seg(t, T.tap + 0.12, T.tap + 0.62, E.in3);
  return (
    <AbsoluteFill
      style={{
        opacity: inK * (1 - seg(t, T.tap + 0.1, T.tap + 0.35)),
        scale: String(lerp(1.35, 1, inK) * lerp(1, 0.32, outK)),
        filter: `blur(${(1 - inK) * 14 + outK * 6}px)`,
        translate: `0 ${outK * -30}px`,
      }}
    >
      <Search t={t} T={T} />
    </AbsoluteFill>
  );
};

// ---------- Handy mit Anruf ----------
const PhoneCall: React.FC<{ t: number }> = ({ t }) => {
  const zoom = seg(t, T.tap + 0.1, T.tap + 0.7, E.outExpo);
  const s = lerp(3.1, 0.86, zoom);
  const vib = t > T.ring && t < T.burst + 0.2 ? Math.sin(t * 95) * 2.2 : 0;
  const leave = seg(t, T.burst + 0.25, T.logo - 0.1, E.in3);
  const pw = 500,
    ph = 1060;
  return (
    <AbsoluteFill style={{ perspective: 1600, opacity: seg(t, T.tap + 0.05, T.tap + 0.25) * (1 - leave) }}>
      <div
        style={{
          position: "absolute",
          left: W / 2 - pw / 2 - 22,
          top: 880 - ph / 2 - 22,
          width: pw + 44,
          height: ph + 44,
          borderRadius: 92,
          background: "linear-gradient(145deg,#2a2f3a,#0b0d12 45%,#1d222c)",
          boxShadow: `0 60px 140px #000c, 0 0 0 2px #3a4150 inset, 0 0 ${120 * kick(t, T.burst, 0.4)}px ${C.blue}`,
          scale: String(s * (1 - leave * 0.5)),
          rotate: `${vib}deg`,
          transform: `rotateY(${(1 - zoom) * 8 + leave * 40}deg)`,
          filter: `blur(${leave * 10}px)`,
        }}
      >
        <div style={{ position: "absolute", left: 22, top: 22, width: pw, height: ph, borderRadius: 70, overflow: "hidden" }}>
          <CallScreen t={t} T={T} w={pw} h={ph} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Explosion der Anfragen -> Partikel -> Logo ----------
const CARDS = ["Neue Anfrage", "Anruf", "Terminanfrage", "Rückruf erbeten", "Neue Anfrage", "Anruf", "Angebot anfragen", "Neue Anfrage", "Terminanfrage", "Anruf", "Neue Anfrage", "Rückruf erbeten", "Anruf", "Neue Anfrage"];
const LOGO_BOX = { x: W / 2 - 260, y: 560, s: 520 };

const Burst: React.FC<{ t: number }> = ({ t }) => {
  const fly = seg(t, T.burst, T.burst + 0.75, E.outExpo);
  const toDust = seg(t, T.logo - 0.62, T.logo - 0.38, E.in3);
  const conv = seg(t, T.logo - 0.5, T.logo, E.inOut);
  const pts = logoPts as number[][];
  return (
    <AbsoluteFill style={{ perspective: 1400 }}>
      {CARDS.map((txt, i) => {
        const ang = (i / CARDS.length) * Math.PI * 2 + rnd(i) * 0.4;
        const r = (360 + rnd(i + 7) * 420) * fly;
        const z = (rnd(i + 3) * 900 - 250) * fly;
        const x = W / 2 + Math.cos(ang) * r;
        const y = 880 + Math.sin(ang) * r * 1.25;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 340,
              translate: "-50% -50%",
              transform: `translateZ(${z}px) rotateY(${(rnd(i + 1) - 0.5) * 60 * fly}deg) rotateZ(${(rnd(i + 2) - 0.5) * 30 * fly}deg)`,
              opacity: seg(t, T.burst, T.burst + 0.08) * (1 - toDust),
              scale: String(lerp(0.3, 1, fly)),
              padding: "18px 22px",
              borderRadius: 24,
              background: "#ffffffee",
              boxShadow: `0 20px 60px #0008, 0 0 40px ${C.blue}66`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 14, background: i % 3 === 1 ? "#22c55e" : C.blue, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, color: "#0b1220" }}>{txt}</div>
              <div style={{ fontSize: 20, color: "#5b6478" }}>gerade eben</div>
            </div>
          </div>
        );
      })}
      {/* Partikel */}
      {toDust > 0 &&
        pts.map((p, i) => {
          const c = i % CARDS.length;
          const ang = (c / CARDS.length) * Math.PI * 2 + rnd(c) * 0.4;
          const r = 360 + rnd(c + 7) * 420;
          const sx = W / 2 + Math.cos(ang) * r + (rnd(i + 11) - 0.5) * 300;
          const sy = 880 + Math.sin(ang) * r * 1.25 + (rnd(i + 13) - 0.5) * 90;
          const tx = LOGO_BOX.x + p[0] * LOGO_BOX.s;
          const ty = LOGO_BOX.y + p[1] * LOGO_BOX.s;
          const k = clamp(conv * 1.15 - rnd(i + 5) * 0.15);
          const swirl = Math.sin(k * Math.PI) * 120 * (rnd(i + 17) - 0.5);
          const x = lerp(sx, tx, k) + swirl;
          const y = lerp(sy, ty, k) - Math.sin(k * Math.PI) * 60;
          const sz = 5 + rnd(i) * 6;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: sz,
                height: sz,
                borderRadius: sz,
                background: i % 5 === 0 ? "#fff" : C.cyan,
                boxShadow: `0 0 ${10 + sz}px ${C.cyan}`,
                opacity: toDust * (1 - seg(t, T.logo + 0.05, T.logo + 0.35)),
              }}
            />
          );
        })}
    </AbsoluteFill>
  );
};

const LogoStage: React.FC<{ t: number }> = ({ t }) => {
  const hit = seg(t, T.logo, T.logo + 0.5, E.back);
  const up = seg(t, T.cta, T.cta + 0.55, E.inOut);
  const name = "MIHAJLO SYSTEMS";
  const rays = seg(t, T.logo, T.logo + 0.4) * (1 - up * 0.6);
  return (
    <AbsoluteFill style={{ translate: `0 ${-310 * up}px`, scale: String(lerp(1, 0.78, up)), transformOrigin: "50% 40%" }}>
      {/* Lichtstrahlen */}
      <div
        style={{
          position: "absolute",
          left: W / 2 - 900,
          top: 820 - 900,
          width: 1800,
          height: 1800,
          borderRadius: 900,
          background: `repeating-conic-gradient(from ${t * 18}deg, ${C.blue}2a 0deg 6deg, transparent 6deg 18deg)`,
          maskImage: "radial-gradient(circle, #000 0%, transparent 62%)",
          opacity: rays,
        }}
      />
      <div style={{ position: "absolute", left: W / 2 - 330, top: 820 - 330, width: 660, height: 660, borderRadius: 330, background: `radial-gradient(circle, ${C.blue}66 0%, transparent 65%)`, opacity: rays }} />
      <Img
        src={staticFile("ms-logo-alpha.png")}
        style={{
          position: "absolute",
          left: LOGO_BOX.x,
          top: LOGO_BOX.y,
          width: LOGO_BOX.s,
          height: LOGO_BOX.s,
          opacity: seg(t, T.logo - 0.04, T.logo + 0.1),
          scale: String(lerp(1.3, 1, hit)),
          filter: `drop-shadow(0 0 ${30 + 60 * kick(t, T.logo, 0.5)}px ${C.blue}) brightness(${1 + kick(t, T.logo, 0.3)})`,
        }}
      />
      <div style={{ position: "absolute", top: 1120, width: "100%", display: "flex", justifyContent: "center", gap: 2 }}>
        {name.split("").map((ch, i) => {
          const k = seg(t, T.logo + 0.18 + i * 0.035, T.logo + 0.6 + i * 0.035, E.out3);
          return (
            <span
              key={i}
              style={{
                fontFamily: DISPLAY,
                fontWeight: 300,
                fontSize: 74,
                letterSpacing: 6,
                color: C.white,
                opacity: k,
                translate: `0 ${(1 - k) * 50}px`,
                filter: `blur(${(1 - k) * 12}px)`,
                minWidth: ch === " " ? 26 : undefined,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1225,
          width: "100%",
          textAlign: "center",
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: 10,
          color: C.cyan,
          opacity: seg(t, T.goslar - 0.1, T.goslar + 0.3) * (1 - up),
          translate: `0 ${(1 - seg(t, T.goslar - 0.1, T.goslar + 0.4, E.out3)) * 30}px`,
        }}
      >
        WEBSITES AUS GOSLAR
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ t: number }> = ({ t }) => {
  const card = seg(t, T.cta + 0.15, T.cta + 0.6, E.back);
  const word = "WEBSITE";
  const n = Math.floor(seg(t, T.website, T.website + 0.5) * word.length + 0.0001);
  const typed = word.slice(0, n);
  const press = kick(t, T.website + 0.62, 0.15);
  const heart = seg(t, T.website + 0.66, T.website + 0.95, E.back);
  const pill = seg(t, T.pill, T.pill + 0.45, E.back);
  const shine = seg(t, T.pill + 0.5, T.pill + 1.1, E.inOut);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 960,
          height: 150,
          borderRadius: 75,
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          gap: 22,
          opacity: card,
          translate: `0 ${(1 - card) * 120}px`,
          boxShadow: `0 30px 80px #000a, 0 0 60px ${C.blue}55`,
        }}
      >
        <div style={{ width: 100, height: 100, borderRadius: 50, background: `linear-gradient(135deg, ${C.orange}, #ffb347)` }} />
        <div style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, color: "#0b1220", letterSpacing: 1 }}>
          {typed || <span style={{ color: "#9aa3b5", fontWeight: 500, fontSize: 40 }}>Kommentieren …</span>}
          {typed && <span style={{ opacity: Math.floor(t * 4) % 2 ? 1 : 0, color: C.blue }}>|</span>}
        </div>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            background: n === word.length ? C.blue : "#d5dbe6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: String(1 - press * 0.2),
          }}
        >
          <svg width="46" height="46" viewBox="0 0 24 24" fill="#fff">
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </div>
        {/* Herz */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          style={{ position: "absolute", right: -26, top: -64, scale: String(heart * (1 + kick(t, T.website + 0.95, 0.3) * 0.2)), opacity: heart }}
        >
          <path fill="#ff3b5c" d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2.3 4.5 6 4.5c2.2 0 3.6 1.3 6 3.6 2.4-2.3 3.8-3.6 6-3.6 3.7 0 5.6 3.9 4 7.2C19.5 16.4 12 21 12 21z" />
        </svg>
        {Array.from({ length: 7 }, (_, i) => {
          const k = seg(t, T.website + 0.7 + i * 0.06, T.website + 1.9 + i * 0.06);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                right: 20 + rnd(i) * 80,
                top: -20 - k * (120 + rnd(i + 2) * 90),
                fontSize: 34 + rnd(i + 1) * 20,
                opacity: Math.sin(k * Math.PI),
                rotate: `${(rnd(i + 3) - 0.5) * 40}deg`,
                color: "#ff3b5c",
              }}
            >
              ♥
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          top: 1175,
          height: 120,
          borderRadius: 60,
          background: `linear-gradient(135deg, ${C.blue}, #6d5cff)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: DISPLAY,
          fontWeight: 800,
          fontSize: 46,
          color: "#fff",
          opacity: pill,
          translate: `0 ${(1 - pill) * 80}px`,
          scale: String(lerp(0.8, 1, pill)),
          overflow: "hidden",
          boxShadow: `0 20px 70px ${C.blue}99`,
        }}
      >
        Kostenloses Erstgespräch
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, transparent 30%, #ffffff66 50%, transparent 70%)", translate: `${lerp(-900, 900, shine)}px 0` }} />
      </div>
      <div style={{ position: "absolute", top: 1330, width: "100%", textAlign: "center", fontSize: 36, color: C.sub, fontWeight: 600, opacity: seg(t, T.pill + 0.7, T.pill + 1.1) }}>
        mihajlostanojevic.com
      </div>
    </AbsoluteFill>
  );
};

// ---------- Text-Hook oben (ab Bild 0 sichtbar) ----------
const HookText: React.FC<{ t: number }> = ({ t }) => {
  if (t > T.shatter + 0.6) return null;
  const blow = seg(t, T.shatter, T.shatter + 0.45, E.out3);
  const words = [
    { w: "Wir", acc: false },
    { w: "reißen", acc: false },
    { w: "Ihre", acc: false },
    { w: "Website", acc: false },
    { w: "ab.", acc: true },
  ];
  return (
    <div style={{ position: "absolute", top: 150, width: "100%", display: "flex", justifyContent: "center", gap: 18, perspective: 800 }}>
      {words.map((x, i) => (
        <span
          key={i}
          style={{
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 76,
            letterSpacing: -1.5,
            color: x.acc ? "#fff" : C.white,
            background: x.acc ? C.red : undefined,
            padding: x.acc ? "0 14px" : undefined,
            borderRadius: 12,
            textShadow: x.acc ? undefined : "0 6px 30px #000",
            opacity: 1 - blow,
            transform: `translate3d(${(rnd(i) - 0.5) * 500 * blow}px, ${(rnd(i + 4) - 0.6) * 400 * blow}px, ${blow * 500}px) rotate(${(rnd(i + 2) - 0.5) * 90 * blow}deg)`,
            scale: x.acc ? String(1 + kick(t, T.shatter - 0.02, 0.2) * 0.15) : undefined,
          }}
        >
          {x.w}
        </span>
      ))}
    </div>
  );
};

// ---------- Korn, Vignette, Blitze ----------
const Overlays: React.FC<{ t: number; frame: number }> = ({ t, frame }) => {
  const flash = Math.max(kick(t, T.shatter, 0.09) * 0.9, kick(t, T.back + 0.8, 0.1) * 0.18, kick(t, T.logo, 0.08) * 0.7, kick(t, T.burst, 0.12) * 0.4, kick(t, T.crack1, 0.06) * 0.35, kick(t, T.crack2, 0.08) * 0.45);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 65% at 50% 46%, transparent 55%, #000c 100%)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};
