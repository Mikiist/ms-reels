import React from "react";
import { C, DISPLAY, E, kick, lerp, seg } from "./lib";

type TT = Record<string, number | number[]>;
const n = (v: number | number[]) => v as number;

// ---------- Suche (keine echten Marken, nur Suchfeld + Ergebnisse) ----------
export const Search: React.FC<{ t: number; T: TT }> = ({ t, T }) => {
  const dive = n(T.dive);
  const google = n(T.google);
  const tap = n(T.tap);
  const q = "Handwerker in der Nähe";
  const typed = q.slice(0, Math.floor(seg(t, dive + 0.45, dive + 1.05) * q.length + 0.0001));
  const results = ["Betrieb A", "Betrieb B", "Betrieb C", "Ihr Betrieb"];
  const rise = seg(t, google, google + 0.55, E.inOut);
  const tilt = Math.sin(seg(t, google - 0.1, google + 0.75, E.inOut) * Math.PI);
  const stamp = seg(t, google + 0.5, google + 0.72, E.back);
  const tapK = kick(t, tap, 0.25);
  const slotY = (s: number) => 640 + s * 215;
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0a1328,#060b18)" }}>
      <div style={{ position: "absolute", top: 330, width: "100%", textAlign: "center", fontFamily: DISPLAY, fontWeight: 800, fontSize: 52, color: "#fff", opacity: seg(t, dive + 0.3, dive + 0.6) }}>
        Ihre Kunden suchen:
      </div>
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 420,
          height: 128,
          borderRadius: 64,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 40px",
          boxShadow: `0 20px 70px #000a, 0 0 0 ${4 + kick(t, dive + 1.05, 0.3) * 10}px ${C.blue}55`,
        }}
      >
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#5b6478" strokeWidth="2.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <div style={{ fontSize: 46, fontWeight: 600, color: "#0b1220" }}>
          {typed}
          <span style={{ color: C.blue, opacity: Math.floor(t * 4) % 2 ? 1 : 0 }}>|</span>
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, perspective: 1300, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateX(${tilt * 22}deg) translateZ(${tilt * -60}px)` }}>
          {results.map((r, i) => {
            const me = i === 3;
            const appear = seg(t, dive + 1.1 + i * 0.07, dive + 1.4 + i * 0.07, E.out3);
            const slot = me ? lerp(3, 0, rise) : i + rise;
            const lift = me ? Math.sin(rise * Math.PI) * 160 + rise * 30 : 0;
            const glow = me ? rise : 0;
            return (
              <div
                key={r}
                style={{
                  position: "absolute",
                  left: 80,
                  right: 80,
                  top: slotY(slot),
                  height: 185,
                  borderRadius: 34,
                  padding: "0 36px",
                  display: "flex",
                  alignItems: "center",
                  gap: 28,
                  background: me ? `linear-gradient(135deg, #12306e, #0d1b3d)` : "#ffffff10",
                  border: me ? `3px solid ${C.blue}` : "2px solid #ffffff1c",
                  boxShadow: me ? `0 30px 80px #000b, 0 0 ${80 * glow}px ${C.blue}` : "0 10px 30px #0006",
                  transform: `translateZ(${lift}px) scale(${me ? 1 + glow * 0.04 - tapK * 0.05 : 1})`,
                  opacity: appear * (me ? 1 : lerp(1, 0.55, rise)),
                  translate: `0 ${(1 - appear) * 60}px`,
                  zIndex: me ? 2 : 1,
                }}
              >
                <div style={{ width: 92, height: 92, borderRadius: 24, background: me ? `linear-gradient(135deg, ${C.blue}, ${C.cyan})` : "#ffffff22", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: "#fff" }}>{r}</div>
                  <div style={{ marginTop: 8, height: 14, width: me ? "70%" : "55%", borderRadius: 7, background: me ? `${C.cyan}88` : "#ffffff25" }} />
                </div>
                {me && (
                  <div
                    style={{
                      padding: "12px 22px",
                      borderRadius: 18,
                      background: "#22c55e",
                      color: "#fff",
                      fontFamily: DISPLAY,
                      fontWeight: 900,
                      fontSize: 30,
                      rotate: "-8deg",
                      opacity: stamp,
                      scale: String(lerp(2.2, 1, stamp)),
                    }}
                  >
                    GEFUNDEN
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Tipp-Finger */}
      <div
        style={{
          position: "absolute",
          left: 760,
          top: slotY(0) + 92,
          width: 120,
          height: 120,
          borderRadius: 60,
          border: `6px solid #fff`,
          opacity: seg(t, tap - 0.25, tap - 0.1) * (1 - seg(t, tap + 0.2, tap + 0.45)),
          scale: String(lerp(0.6, 1.6, seg(t, tap, tap + 0.45, E.out3))),
          translate: "-50% -50%",
        }}
      />
    </div>
  );
};

// ---------- Eingehender Anruf ----------
export const CallScreen: React.FC<{ t: number; T: TT; w: number; h: number }> = ({ t, T, w, h }) => {
  const ring = n(T.ring);
  return (
    <div style={{ width: w, height: h, background: "radial-gradient(circle at 50% 35%, #1a3a7a 0%, #070c1a 70%)", position: "relative", fontFamily: DISPLAY, color: "#fff" }}>
      <div style={{ position: "absolute", top: 120, width: "100%", textAlign: "center", fontSize: 30, color: "#9fb4e0", fontWeight: 600 }}>eingehender Anruf</div>
      <div style={{ position: "absolute", top: 175, width: "100%", textAlign: "center", fontSize: 50, fontWeight: 800 }}>Neuer Kunde</div>
      <div style={{ position: "absolute", left: "50%", top: 420, translate: "-50% -50%" }}>
        {[0, 1, 2].map((i) => {
          const k = ((t - ring + i * 0.33) % 1 + 1) % 1;
          const on = t > ring ? 1 : 0;
          return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 200, height: 200, borderRadius: 100, border: `4px solid ${C.cyan}`, translate: "-50% -50%", scale: String(1 + k * 1.3), opacity: on * (1 - k) * 0.8 }} />;
        })}
        <div style={{ width: 200, height: 200, borderRadius: 100, translate: "-50% -50%", background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${C.blue}` }}>
          <svg width="96" height="96" viewBox="0 0 24 24" fill="#fff">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
          </svg>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 150, width: "100%", display: "flex", justifyContent: "space-around" }}>
        <div style={{ width: 130, height: 130, borderRadius: 65, background: "#ef4444", opacity: 0.85 }} />
        <div style={{ width: 130, height: 130, borderRadius: 65, background: "#22c55e", scale: String(1 + Math.max(0, Math.sin(t * 9)) * 0.12 * (t > ring ? 1 : 0)), boxShadow: "0 0 50px #22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="62" height="62" viewBox="0 0 24 24" fill="#fff">
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
