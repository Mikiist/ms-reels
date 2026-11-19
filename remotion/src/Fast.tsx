import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Schnelle Reel-Vorlage (19.11.2026): harte Schnitte im Sprechtakt, Übergänge, große Wörter, Motion-Karten, Effekte.
export type FWord = { w: string; t: number; e: number; acc: boolean };
export type Shot = {
  t0: number;
  src?: string; // Bild oder Clip in public/
  ui?: "orders" | "terminal" | "wallet" | "price" | "checks" | "logo"; // Motion-Szene statt Bild
  items?: string[];
  at?: number[]; // Sprechzeit (s) je Eintrag, sonst gestaffelt
  big?: string; // großes Wort mittig (statt Untertitel)
  tr?: "whip" | "zoom" | "glitch" | "flash" | "spin";
  bg?: string; // Hintergrundfarbe für Motion-Szenen
};
export type FProps = {
  dur: number; voice: string; music?: string; hook?: string; keyword: string;
  words: FWord[]; shots: Shot[]; sfx?: { t: number; s: string; v?: number }[]; endStyle?: "stamp" | "type" | "glow";
};

const ACC = "#ffd23f";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const outE = Easing.bezier(0.16, 1, 0.3, 1);
const isVid = (f: string) => /\.(mp4|webm|mov)$/i.test(f);
const TR = 7; // Übergangslänge in Bildern

// ---------- Hintergrund einer Einstellung mit Kamera-Bewegung und Übergang ----------
const ShotBg: React.FC<{ s: Shot; len: number; i: number }> = ({ s, len, i }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, TR], [0, 1], { ...cl, easing: outE });
  const dir = i % 2 ? 1 : -1;
  let tf = "", filt = "", op = 1;
  if (s.tr === "whip") { tf = `translateX(${(1 - k) * 900 * dir}px)`; filt = `blur(${(1 - k) * 30}px)`; }
  else if (s.tr === "zoom") { tf = `scale(${1.6 - 0.6 * k})`; filt = `blur(${(1 - k) * 18}px)`; }
  else if (s.tr === "spin") { tf = `rotate(${(1 - k) * 25 * dir}deg) scale(${1.4 - 0.4 * k})`; filt = `blur(${(1 - k) * 20}px)`; }
  else if (s.tr === "glitch") { tf = `translateX(${f < TR ? ((f * 37) % 7 - 3) * 14 : 0}px)`; filt = f < 4 ? "hue-rotate(90deg) saturate(3)" : ""; }
  else { op = 1; }
  const cam = interpolate(f, [0, len], [1.04, 1.16], cl);
  const drift = interpolate(f, [0, len], [0, -30 * dir], cl);
  const media: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", scale: String(cam), translate: `${drift}px 0px` };
  return (
    <AbsoluteFill style={{ transform: tf, filter: filt, opacity: op, backgroundColor: s.bg ?? "#05070f" }}>
      {s.src ? (isVid(s.src) ? <Video src={staticFile(s.src)} muted style={media} /> : <Img src={staticFile(s.src)} style={media} />) : null}
      {s.src ? <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.75) 100%)" }} /> : null}
      {s.ui ? <Ui s={s} /> : null}
      {s.tr === "flash" || s.tr === "zoom" ? <AbsoluteFill style={{ backgroundColor: "#fff", opacity: interpolate(f, [0, 5], [0.85, 0], cl) }} /> : null}
    </AbsoluteFill>
  );
};

// ---------- Motion-Szenen (UI in 3D) ----------
const Card: React.FC<{ d: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ d, children, style }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [d, d + 10], [0, 1], { ...cl, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  return <div style={{ opacity: interpolate(f, [d, d + 4], [0, 1], cl), transform: `translateY(${(1 - k) * 80}px) scale(${0.85 + 0.15 * k})`, ...style }}>{children}</div>;
};
const Ui: React.FC<{ s: Shot }> = ({ s }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const dl = (j: number, base: number, step: number) => (s.at && s.at[j] != null ? Math.max(0, Math.round((s.at[j] - s.t0) * fps) - 3) : base + j * step);
  const tilt = interpolate(f, [0, 60], [14, 4], cl);
  const items = s.items ?? [];
  if (s.ui === "orders" || s.ui === "terminal") {
    const tab = s.ui === "terminal";
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: s.ui === "orders" ? "flex-start" : "center", paddingTop: s.ui === "orders" ? 150 : 0, perspective: 1600, background: "radial-gradient(circle at 50% 40%, #1d2a5a 0%, #05070f 70%)" }}>
        <div style={{ width: tab ? 960 : 700, height: tab ? 700 : 1240, borderRadius: tab ? 46 : 80, background: "#0b1020", border: "14px solid #1a1f2e", boxShadow: "0 60px 160px rgba(0,0,0,0.7), 0 0 0 2px #333 inset", transform: `rotateX(${tilt}deg) rotateY(${-tilt}deg)`, padding: 50, display: "flex", flexDirection: tab ? "row" : "column", flexWrap: "wrap", gap: 28, alignContent: "flex-start" }}>
          <div style={{ width: "100%", color: "#93a4c8", fontFamily: "I", fontWeight: 600, fontSize: 36, letterSpacing: "0.1em" }}>{tab ? "TERMINAL · KÜCHE" : "BESTELLUNGEN"}</div>
          {items.map((it, j) => (
            <Card key={j} d={dl(j, 6, 9)} style={{ width: tab ? 410 : "100%" }}>
              <div style={{ background: j === items.length - 1 ? "#16a34a" : "#162042", borderRadius: 30, padding: "30px 34px", color: "#fff", fontFamily: "D", fontWeight: 900, fontSize: 70, display: "flex", alignItems: "center", gap: 22, boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>
                <span style={{ width: 22, height: 22, borderRadius: 11, background: j === items.length - 1 ? "#fff" : "#4ade80" }} />{it}
              </div>
            </Card>
          ))}
        </div>
      </AbsoluteFill>
    );
  }
  if (s.ui === "wallet") {
    return (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1400, background: "radial-gradient(circle at 50% 45%, #3b1d5a 0%, #07040f 70%)" }}>
        <Card d={2}>
          <div style={{ width: 820, height: 500, borderRadius: 44, background: "linear-gradient(135deg, #f59e0b, #ef4444 60%, #7c3aed)", transform: `rotateX(${tilt}deg) rotateZ(${-tilt / 3}deg)`, boxShadow: "0 60px 140px rgba(0,0,0,0.6)", padding: 56, color: "#fff", fontFamily: "D", fontWeight: 900 }}>
            <div style={{ fontSize: 44, opacity: 0.9 }}>BONUSKARTE</div>
            <div style={{ display: "flex", gap: 22, marginTop: 70 }}>{Array.from({ length: 6 }).map((_, j) => (
              <div key={j} style={{ width: 92, height: 92, borderRadius: 46, background: f > 12 + j * 5 ? "#fff" : "rgba(255,255,255,0.25)", transform: `scale(${f > 12 + j * 5 ? 1 : 0.8})` }} />))}</div>
          </div>
        </Card>
      </AbsoluteFill>
    );
  }
  if (s.ui === "checks") {
    return (
      <AbsoluteFill style={{ justifyContent: "center", padding: 90, gap: 34, display: "flex", flexDirection: "column", background: "radial-gradient(circle at 30% 30%, #0f3b2e 0%, #04080a 70%)" }}>
        {items.map((it, j) => (
          <Card key={j} d={dl(j, 4, 8)}>
            <div style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: "D", fontWeight: 900, fontSize: 84, color: "#fff", letterSpacing: "-0.02em" }}>
              <span style={{ width: 96, height: 96, borderRadius: 48, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>✓</span>{it}
            </div>
          </Card>
        ))}
      </AbsoluteFill>
    );
  }
  return null;
};

// ---------- Große Wörter im Sprechtakt (2 bis 3 Wörter je Bild) ----------
const Words: React.FC<{ words: FWord[]; shots: Shot[] }> = ({ words, shots }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = f / fps;
  const groups: FWord[][] = []; let g: FWord[] = [];
  for (const w of words) { g.push(w); if (/[.!?:,]$/.test(w.w) || g.length >= 3) { groups.push(g); g = []; } }
  if (g.length) groups.push(g);
  const i = groups.findIndex((gr, k) => t >= gr[0].t - 0.03 && (k === groups.length - 1 || t < groups[k + 1][0].t - 0.03));
  if (i < 0) return null;
  const gr = groups[i]; if (t > gr[gr.length - 1].e + 0.35) return null;
  const sh = [...shots].reverse().find((s) => s.t0 <= gr[0].t + 0.01);
  if (sh?.big || sh?.ui === "checks") return null; // dort steht der Text schon groß
  const top = sh?.ui === "orders" ? 1520 : sh?.ui ? 1480 : 1060;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 26px" }}>
      {gr.map((w, k) => {
        const a = (t - w.t) * fps;
        return (
          <span key={k} style={{ fontFamily: "D", fontWeight: 900, fontSize: w.acc ? 150 : 124, lineHeight: 1.02, letterSpacing: "-0.035em", textTransform: "uppercase", color: w.acc ? ACC : "#fff",
            WebkitTextStroke: "3px rgba(0,0,0,0.55)", textShadow: "0 10px 0 rgba(0,0,0,0.35), 0 20px 60px rgba(0,0,0,0.7)",
            opacity: interpolate(a, [-1, 1], [0, 1], cl), transform: `scale(${interpolate(a, [-1, 4], [1.6, 1], { ...cl, easing: outE })}) rotate(${w.acc ? interpolate(a, [0, 6], [-6, -2], cl) : 0}deg)` }}>
            {w.w.replace(/[.,:!?]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

const Big: React.FC<{ s: Shot; len: number }> = ({ s }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 9], [0, 1], { ...cl, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60 }}>
      <div style={{ fontFamily: "D", fontWeight: 900, fontSize: 190, lineHeight: 0.92, textAlign: "center", letterSpacing: "-0.05em", textTransform: "uppercase", color: "#fff",
        textShadow: `0 14px 0 ${ACC}, 0 40px 120px rgba(0,0,0,0.8)`, transform: `scale(${0.4 + 0.6 * k}) rotate(${(1 - k) * -8}deg)`, opacity: k }}>{s.big}</div>
    </AbsoluteFill>
  );
};

// ---------- Schluss (drei Varianten im Wechsel) ----------
const End: React.FC<{ keyword: string; style: string; words: FWord[]; t0: number }> = ({ keyword, style, words, t0 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const t = t0 + f / fps;
  const kw = words.find((w) => w.w.replace(/[^A-ZÄÖÜ]/g, "") === keyword)?.t ?? t0 + 1.2;
  const n = Math.floor(interpolate(t, [kw, kw + 0.45], [0, keyword.length], cl));
  const k = interpolate(t, [kw - 0.15, kw + 0.2], [0, 1], { ...cl, easing: Easing.bezier(0.34, 1.56, 0.64, 1) });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, background: style === "glow" ? "radial-gradient(circle at 50% 50%, #1e3a8a 0%, #020409 70%)" : undefined }}>
      <Img src={staticFile("ms-logo.png")} style={{ width: 160, height: 160, borderRadius: 34, opacity: interpolate(f, [0, 8], [0, 1], cl) }} />
      <div style={{ fontFamily: "D", fontWeight: 900, fontSize: 96, color: "#fff", letterSpacing: "-0.03em", opacity: interpolate(f, [3, 12], [0, 1], cl) }}>Mihajlo Systems</div>
      <div style={{ fontFamily: "I", fontWeight: 600, fontSize: 54, color: "rgba(255,255,255,0.9)", marginTop: 30 }}>Kommentieren Sie</div>
      <div style={{ padding: "26px 74px", borderRadius: style === "stamp" ? 18 : 999, background: style === "stamp" ? "transparent" : "#2563eb", border: style === "stamp" ? `10px solid ${ACC}` : "none",
        color: style === "stamp" ? ACC : "#fff", fontFamily: "D", fontWeight: 900, fontSize: 120, letterSpacing: "0.05em", transform: `scale(${0.3 + 0.7 * k}) rotate(${style === "stamp" ? -6 : 0}deg)`, opacity: k,
        boxShadow: style === "glow" ? "0 0 120px rgba(96,165,250,0.9)" : "0 30px 80px rgba(0,0,0,0.5)" }}>
        {style === "type" ? keyword.slice(0, n) || " " : keyword}
      </div>
    </AbsoluteFill>
  );
};

export const Fast: React.FC<FProps> = ({ dur, voice, music, hook, keyword, words, shots, sfx, endStyle }) => {
  const { fps } = useVideoConfig(); const f = useCurrentFrame(); const t = f / fps;
  const endT = words.find((w) => w.w.startsWith("Kommentieren"))?.t ?? dur - 2;
  const shake = (() => { let s = 0; for (const w of words) if (w.acc) { const a = t - w.t; if (a >= 0 && a < 0.25) s += (1 - a / 0.25) * 10; } return s; })();
  const end = Math.min(...shots.filter((s) => s.t0 > endT - 0.8).map((s) => s.t0), endT - 0.6);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${Math.sin(f * 2.1) * shake}px, ${Math.cos(f * 1.7) * shake}px)` }}>
        {shots.map((s, i) => {
          const nx = i + 1 < shots.length ? shots[i + 1].t0 : dur;
          const from = Math.round(s.t0 * fps); const len = Math.max(1, Math.round(nx * fps) - from);
          return (
            <Sequence key={i} from={from} durationInFrames={len} name={`Shot ${i + 1}${s.big ? " " + s.big : ""}`}>
              <ShotBg s={s} len={len} i={i} />
              {s.big ? <Big s={s} len={len} /> : null}
            </Sequence>
          );
        })}
        <Sequence from={Math.round(end * fps)} name="Schluss">
          <AbsoluteFill style={{ backgroundColor: "rgba(2,4,9,0.82)" }} />
          <End keyword={keyword} style={endStyle ?? "type"} words={words} t0={end} />
        </Sequence>
        {t < end ? <Words words={words} shots={shots} /> : null}
        {hook && t < 2.2 ? (
          <div style={{ position: "absolute", top: 230, left: 70, right: 70, textAlign: "center", fontFamily: "D", fontWeight: 900, fontSize: 82, lineHeight: 1.05, color: "#000", opacity: interpolate(t, [1.8, 2.2], [1, 0], cl) }}>
            <span style={{ background: ACC, padding: "6px 22px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone", lineHeight: 1.35 }}>{hook}</span>
          </div>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <Audio src={staticFile(voice)} />
      {music ? <Audio src={staticFile(music)} volume={0.32} /> : null}
      {(sfx ?? []).map((x, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(x.t * fps))} layout="none"><Audio src={staticFile(`sfx/${x.s}.wav`)} volume={x.v ?? 0.6} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
