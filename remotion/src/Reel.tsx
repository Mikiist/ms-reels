import { Audio, Video } from "@remotion/media";
import { AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Ein Reel aus unserer Pipeline: Stimme + Wort-Zeiten aus spec.json, dazu echte Bilder oder Clips (z. B. von Higgsfield).
export type Word = { w: string; t: number; e: number; scene: number; acc: boolean };
export type Scene = {
  t0: number; // Start in Sekunden
  bg: string | null; // Datei in public/, Bild oder Video
  kind: "plain" | "cards" | "big" | "end";
  title?: string; // kleine Überschrift über den Karten
  items?: string[]; // Karten, erscheinen, wenn ihr erstes Wort gesprochen wird
  big?: string; // großes Wort
};
export type ReelProps = { id: string; dur: number; audio: string | null; words: Word[]; scenes: Scene[]; keyword: string };

const AKZENT = "#7cc4ff";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const weich = Easing.bezier(0.16, 1, 0.3, 1);
const istVideo = (f: string) => /\.(mp4|mov|webm)$/i.test(f);
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9äöüß]/g, "");

// Wann fällt das erste Wort eines Textes in dieser Szene? (Sekunden)
const wann = (text: string, words: Word[], scene: number, nach = 0): number | null => {
  const first = norm(text.split(" ")[0]);
  const hit = words.find((w) => w.scene === scene && w.t >= nach && norm(w.w) === first);
  return hit ? hit.t : null;
};

const Hintergrund: React.FC<{ src: string | null; dur: number; idx: number }> = ({ src, dur, idx }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const richtung = idx % 2 === 0 ? 1 : -1;
  const stil: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    scale: interpolate(frame, [0, dur * fps], [1.08, 1.2], clamp),
    translate: interpolate(frame, [0, dur * fps], [`${-14 * richtung}px 0px`, `${14 * richtung}px -24px`], clamp),
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#060914", opacity: idx === 0 ? 1 : interpolate(frame, [0, 9], [0, 1], clamp) }}>
      {src ? istVideo(src) ? <Video src={staticFile(src)} muted loop style={stil} /> : <Img src={staticFile(src)} style={stil} /> : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,7,18,0.55) 0%, rgba(4,7,18,0.12) 26%, rgba(4,7,18,0.25) 52%, rgba(4,7,18,0.86) 100%)" }} />
    </AbsoluteFill>
  );
};

// Untertitel: der gerade gesprochene Satzteil, jedes Wort erscheint mit seiner Sprechzeit
const Untertitel: React.FC<{ words: Word[]; scenes: Scene[]; y: number }> = ({ words, scenes, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const gruppen: Word[][] = [];
  let g: Word[] = [];
  for (const w of words) {
    g.push(w);
    if (/[.!?:,]$/.test(w.w) || g.length >= 4) { gruppen.push(g); g = []; }
  }
  if (g.length) gruppen.push(g);
  const i = gruppen.findIndex((gr, k) => t >= gr[0].t - 0.05 && (k === gruppen.length - 1 || t < gruppen[k + 1][0].t - 0.05));
  if (i < 0) return null;
  const gr = gruppen[i], sz = scenes[gr[0].scene], letzte = gr[gr.length - 1];
  // Nicht stehen lassen: weg nach dem letzten Wort, in Schluss/Großwort-Szenen, und wenn eine Karte denselben Text zeigt
  if (t > letzte.e + 0.7 || !sz || sz.kind === "end" || sz.kind === "big") return null;
  const text = norm(gr.map((w) => w.w).join(""));
  if (sz.kind === "cards" && (sz.items ?? []).some((it) => norm(it).includes(text) || text.includes(norm(it)))) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: y, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 22px", fontFamily: "D", fontWeight: 900, fontSize: 92, lineHeight: 1.08, letterSpacing: "-0.025em", textShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
      {gruppen[i].map((w, k) => (
        <span
          key={k}
          style={{
            color: w.acc ? AKZENT : "#fff",
            opacity: interpolate(t, [w.t - 0.04, w.t + 0.1], [0, 1], clamp),
            translate: interpolate(t, [w.t - 0.04, w.t + 0.22], ["0px 26px", "0px 0px"], { ...clamp, easing: weich }),
          }}
        >
          {w.w}
        </span>
      ))}
    </div>
  );
};

const Karten: React.FC<{ scene: Scene; idx: number; words: Word[] }> = ({ scene, idx, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = scene.t0 + frame / fps;
  let nach = scene.t0;
  const zeiten = (scene.items ?? []).map((it, k) => {
    const z = wann(it, words, idx, nach) ?? scene.t0 + 0.4 + k * 0.7;
    nach = z + 0.05;
    return z;
  });
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 470, display: "flex", flexDirection: "column", gap: 26 }}>
      {scene.title ? (
        <div style={{ fontFamily: "I", fontWeight: 600, fontSize: 44, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", textTransform: "uppercase", opacity: interpolate(frame, [4, 14], [0, 1], clamp) }}>{scene.title}</div>
      ) : null}
      {(scene.items ?? []).map((it, k) => (
        <div
          key={k}
          style={{
            display: "flex", alignItems: "center", gap: 28, padding: "34px 40px", borderRadius: 36,
            background: "rgba(13,20,48,0.55)", border: "2px solid rgba(255,255,255,0.16)", backdropFilter: "blur(22px)", boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
            opacity: interpolate(t, [zeiten[k] - 0.05, zeiten[k] + 0.15], [0, 1], clamp),
            translate: interpolate(t, [zeiten[k] - 0.05, zeiten[k] + 0.45], ["0px 70px", "0px 0px"], { ...clamp, easing: weich }),
            scale: interpolate(t, [zeiten[k] - 0.05, zeiten[k] + 0.45], [0.94, 1], { ...clamp, easing: weich }),
          }}
        >
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "D", fontWeight: 900, fontSize: 40 }}>✓</div>
          <div style={{ fontFamily: "D", fontWeight: 700, fontSize: 62, color: "#fff", letterSpacing: "-0.02em" }}>{it}</div>
        </div>
      ))}
    </div>
  );
};

const Gross: React.FC<{ scene: Scene; idx: number; words: Word[] }> = ({ scene, idx, words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = scene.t0 + frame / fps;
  const z = wann(scene.big ?? "", words, idx) ?? scene.t0 + 0.2;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 600, textAlign: "center", fontFamily: "D", fontWeight: 900, fontSize: 170, lineHeight: 0.98, letterSpacing: "-0.04em", textTransform: "uppercase", color: "#fff", textShadow: "0 14px 0 rgba(15,23,42,0.55), 0 30px 90px rgba(0,0,0,0.6)",
      opacity: interpolate(t, [z - 0.1, z + 0.12], [0, 1], clamp),
      scale: interpolate(t, [z - 0.1, z + 0.5], [1.5, 1], { ...clamp, easing: weich }),
      filter: `blur(${interpolate(t, [z - 0.1, z + 0.35], [18, 0], clamp)}px)` }}>
      {scene.big}
    </div>
  );
};

const Schluss: React.FC<{ scene: Scene; idx: number; words: Word[]; keyword: string }> = ({ scene, idx, words, keyword }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = scene.t0 + frame / fps;
  const zName = wann("Mihajlo", words, idx) ?? scene.t0 + 0.2;
  const zKomm = wann("Kommentieren", words, idx) ?? scene.t0 + 1.2;
  const zKey = wann(keyword, words, idx) ?? zKomm + 0.8;
  const n = Math.floor(interpolate(t, [zKey, zKey + 0.5], [0, keyword.length], clamp));
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 1010, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <Img src={staticFile("ms-logo.png")} style={{ width: 150, height: 150, borderRadius: 30, opacity: interpolate(t, [zName - 0.2, zName + 0.1], [0, 1], clamp), scale: interpolate(t, [zName - 0.2, zName + 0.4], [0.7, 1], { ...clamp, easing: weich }) }} />
      <div style={{ fontFamily: "D", fontWeight: 900, fontSize: 104, color: "#fff", letterSpacing: "-0.03em", textShadow: "0 10px 50px rgba(0,0,0,0.6)", opacity: interpolate(t, [zName - 0.1, zName + 0.2], [0, 1], clamp), translate: interpolate(t, [zName - 0.1, zName + 0.4], ["0px 30px", "0px 0px"], { ...clamp, easing: weich }) }}>Mihajlo Systems</div>
      <div style={{ fontFamily: "I", fontWeight: 600, fontSize: 56, color: "rgba(255,255,255,0.92)", marginTop: 16, opacity: interpolate(t, [zKomm - 0.1, zKomm + 0.2], [0, 1], clamp) }}>Kommentieren Sie</div>
      <div style={{ padding: "26px 70px", borderRadius: 999, background: "#2563eb", boxShadow: "0 24px 70px rgba(37,99,235,0.55)", fontFamily: "D", fontWeight: 900, fontSize: 110, color: "#fff", letterSpacing: "0.04em", minWidth: 300, textAlign: "center", opacity: interpolate(t, [zKey - 0.25, zKey - 0.05], [0, 1], clamp), scale: interpolate(t, [zKey - 0.25, zKey + 0.2], [0.6, 1], { ...clamp, easing: weich }) }}>{keyword.slice(0, n) || " "}</div>
    </div>
  );
};

export const Reel: React.FC<ReelProps> = ({ dur, audio, words, scenes, keyword }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#060914" }}>
      {scenes.map((sc, i) => {
        const ende = i + 1 < scenes.length ? scenes[i + 1].t0 : dur;
        const von = Math.round(sc.t0 * fps);
        // 9 Bilder Überlappung für die weiche Blende zur nächsten Szene
        const len = Math.round((ende - sc.t0) * fps) + (i + 1 < scenes.length ? 9 : 0);
        return (
          <Sequence key={i} from={von} durationInFrames={len} name={`Szene ${i + 1} (${sc.kind})`}>
            <Hintergrund src={sc.bg} dur={ende - sc.t0} idx={i} />
            <Sequence durationInFrames={len - (i + 1 < scenes.length ? 9 : 0)} layout="none">
              {sc.kind === "cards" ? <Karten scene={sc} idx={i} words={words} /> : null}
              {sc.kind === "big" ? <Gross scene={sc} idx={i} words={words} /> : null}
              {sc.kind === "end" ? <Schluss scene={sc} idx={i} words={words} keyword={keyword} /> : null}
            </Sequence>
          </Sequence>
        );
      })}
      <Untertitel words={words} scenes={scenes} y={1280} />
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};
