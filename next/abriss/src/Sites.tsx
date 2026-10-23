import React from "react";
import { C, DISPLAY, FONT } from "./lib";

export const SW = 820;
export const SH = 1340;

// ---------- Alte Website (2010er-Look, absichtlich hässlich) ----------
export const OldSite: React.FC<{ t: number }> = ({ t }) => {
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <div
      style={{
        width: SW,
        height: SH,
        background: "repeating-linear-gradient(45deg,#d9d2b8 0 14px,#cfc7a8 14px 28px)",
        fontFamily: "'DejaVu Serif', 'Times New Roman', serif",
        color: "#222",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Browserleiste */}
      <div style={{ height: 46, background: "linear-gradient(#e9e9e9,#bdbdbd)", display: "flex", alignItems: "center", gap: 10, padding: "0 16px", borderBottom: "2px solid #888" }}>
        {["#e44", "#eb3", "#4b4"].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
        ))}
        <div style={{ flex: 1, marginLeft: 12, height: 26, background: "#fff", border: "1px solid #999", fontSize: 15, padding: "3px 10px", fontFamily: "DejaVu Sans, sans-serif", color: "#555" }}>
          http://www.ihr-betrieb.de/index.html
        </div>
      </div>
      <div style={{ background: "linear-gradient(#1b3fa8,#0b1f63)", padding: "26px 20px 20px", textAlign: "center", borderBottom: "6px ridge #c9b200" }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: "#ffe100", textShadow: "4px 4px 0 #c00, 6px 6px 0 #000", fontStyle: "italic", letterSpacing: -1 }}>
          Herzlich Willkommen!!!
        </div>
        <div style={{ marginTop: 10, fontSize: 22, color: "#9fd0ff" }}>auf der Homepage von Ihrem Betrieb</div>
      </div>
      <div style={{ background: "#000", color: "#0f0", fontFamily: "DejaVu Sans Mono, monospace", fontSize: 22, padding: "8px 0", whiteSpace: "nowrap", overflow: "hidden" }}>
        <div style={{ translate: `${-((t * 160) % 900) + 400}px 0` }}>+++ NEU: Wir haben jetzt eine Homepage +++ Seite im Aufbau +++ Bitte haben Sie Geduld +++</div>
      </div>
      <div style={{ display: "flex", gap: 16, padding: 18 }}>
        <div style={{ width: 210, background: "#f2edd5", border: "3px outset #bbb", padding: 12, fontSize: 21, lineHeight: 1.9, color: "#00e" }}>
          {["» Startseite", "» Über uns", "» Leistungen", "» Gästebuch", "» Anfahrt", "» Impressum"].map((x) => (
            <div key={x} style={{ textDecoration: "underline" }}>{x}</div>
          ))}
          <div style={{ marginTop: 18, background: "#000", color: "#f00", fontFamily: "DejaVu Sans Mono, monospace", fontSize: 18, padding: 6, textAlign: "center" }}>
            Besucher:
            <br />
            <span style={{ color: "#0f0", fontSize: 26 }}>004127</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 240, border: "3px inset #999", background: "#e8e8e8", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <rect x="10" y="10" width="100" height="100" fill="#fff" stroke="#999" strokeWidth="4" />
              <path d="M20 20 L100 100 M100 20 L20 100" stroke="#c00" strokeWidth="6" />
            </svg>
            <div style={{ position: "absolute", bottom: 8, fontSize: 16, color: "#777" }}>bild_neu_final2.jpg</div>
          </div>
          {[0.95, 0.82, 0.9, 0.7, 0.88, 0.6, 0.93, 0.76].map((w, i) => (
            <div key={i} style={{ height: 13, width: `${w * 100}%`, background: "#555", opacity: 0.55, marginTop: 14 }} />
          ))}
          <div style={{ marginTop: 24, height: 70, background: "repeating-linear-gradient(-45deg,#ffcc00 0 22px,#111 22px 44px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ background: "#ffcc00", padding: "4px 12px", fontWeight: 900, fontSize: 24, fontFamily: "DejaVu Sans, sans-serif" }}>SEITE IM AUFBAU</span>
          </div>
        </div>
      </div>
      <div style={{ margin: "6px 18px", padding: 16, background: "#fff6", border: "2px dashed #a00", fontSize: 24, color: "#a00", textAlign: "center", opacity: blink ? 1 : 0.15 }}>
        Rufen Sie uns an! Telefon steht im Impressum.
      </div>
      <div style={{ display: "flex", gap: 14, margin: "14px 18px" }}>
        {["#3a3", "#c33", "#33c"].map((c) => (
          <div key={c} style={{ flex: 1, height: 150, background: c, border: "4px ridge #ddd" }} />
        ))}
      </div>
      <div style={{ position: "absolute", bottom: 14, width: "100%", textAlign: "center", fontSize: 16, color: "#666" }}>
        © 2012 · Optimiert für 1024 x 768 · Letzte Aktualisierung: 03.04.2013
      </div>
    </div>
  );
};

// ---------- Neue Website ----------
// mode: 0 = Bauplan (nur Linien), 1 = fertig. reveal[i] färbt Abschnitt i ein.
export const NewSite: React.FC<{
  w?: number;
  h?: number;
  reveal?: number[];
  scrollY?: number;
  headPulse?: number;
  wire?: number; // 1 = nur Bauplan
}> = ({ w = SW, h = SH, reveal = [1, 1, 1, 1, 1], scrollY = 0, headPulse = 0, wire = 0 }) => {
  const narrow = w < 600;
  const sec = (i: number, children: React.ReactNode, style: React.CSSProperties = {}) => {
    const k = Math.max(0, Math.min(1, reveal[i] ?? 1)) * (1 - wire);
    return (
      <div style={{ position: "relative", ...style }}>
        {/* Bauplan-Linien */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: style.borderRadius ?? 18,
            border: `2px solid ${C.cyan}`,
            opacity: (1 - k) * 0.9,
            boxShadow: `0 0 18px ${C.cyan}55 inset`,
            background: "repeating-linear-gradient(0deg, #5ee2ff10 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, #5ee2ff10 0 1px, transparent 1px 28px)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, borderRadius: style.borderRadius ?? 18, background: "#fff", opacity: 4 * k * (1 - k) * 0.55, zIndex: 3 }} />
        <div style={{ opacity: 0.12 + 0.88 * k, filter: k < 1 ? `saturate(${k}) brightness(${0.8 + 0.2 * k})` : undefined }}>{children}</div>
      </div>
    );
  };
  return (
    <div
      style={{
        width: w,
        height: h,
        background: `linear-gradient(180deg, #0b1630 0%, #081022 55%, #060c19 100%)`,
        overflow: "hidden",
        position: "relative",
        fontFamily: FONT,
        color: C.white,
      }}
    >
      <div style={{ translate: `0 ${-scrollY}px`, padding: narrow ? "26px 26px" : "30px 36px" }}>
        {sec(
          0,
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: narrow ? 64 : 70 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${C.blue}, ${C.cyan})` }} />
              <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: narrow ? 28 : 32, letterSpacing: -0.5 }}>Ihr Betrieb</div>
            </div>
            {!narrow && (
              <div style={{ display: "flex", gap: 26, fontSize: 22, color: C.sub, fontWeight: 600 }}>
                <span>Leistungen</span>
                <span>Preise</span>
                <span>Kontakt</span>
              </div>
            )}
            {narrow && (
              <div style={{ display: "grid", gap: 6 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 30, height: 4, borderRadius: 2, background: C.white }} />
                ))}
              </div>
            )}
          </div>,
          { borderRadius: 14, padding: "6px 10px" },
        )}
        <div style={{ height: narrow ? 30 : 46 }} />
        {sec(
          1,
          <div style={{ padding: narrow ? "8px 6px" : "10px 8px" }}>
            <div style={{ fontSize: narrow ? 20 : 22, fontWeight: 700, color: C.cyan, letterSpacing: 2, textTransform: "uppercase" }}>Meisterbetrieb aus der Region</div>
            <div
              style={{
                marginTop: 14,
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: narrow ? 66 : 92,
                lineHeight: 0.98,
                letterSpacing: -2.5,
                textShadow: headPulse > 0 ? `0 0 ${40 * headPulse}px ${C.blue}` : undefined,
                scale: String(1 + headPulse * 0.04),
                transformOrigin: "left center",
              }}
            >
              Schnell erreichbar.
              <br />
              <span style={{ color: C.cyan }}>Klar im Angebot.</span>
            </div>
            <div style={{ marginTop: 20, fontSize: narrow ? 24 : 28, color: C.sub, lineHeight: 1.35, maxWidth: 640 }}>
              Ihre Kunden sehen sofort, was Sie machen, wo Sie arbeiten und wie man Sie erreicht.
            </div>
          </div>,
          { borderRadius: 18 },
        )}
        <div style={{ height: 26 }} />
        {sec(
          2,
          <div style={{ display: "flex", flexDirection: narrow ? "column" : "row", gap: 22, alignItems: narrow ? "stretch" : "center", padding: 6 }}>
            <div
              style={{
                padding: narrow ? "24px 0" : "26px 44px",
                textAlign: "center",
                borderRadius: 999,
                background: `linear-gradient(135deg, ${C.blue}, #1b5cff)`,
                fontFamily: DISPLAY,
                fontWeight: 800,
                fontSize: narrow ? 30 : 32,
                boxShadow: `0 14px 50px ${C.blue}88`,
              }}
            >
              Jetzt anrufen
            </div>
            <div
              style={{
                flex: 1,
                height: narrow ? 250 : 210,
                borderRadius: 26,
                background: "linear-gradient(180deg,#ff9a4a 0%,#ff5e62 45%,#3a1c71 100%)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", left: "50%", top: "52%", width: 120, height: 120, borderRadius: 60, translate: "-50% -50%", background: "#ffe08a", boxShadow: "0 0 80px #ffd36e" }} />
              <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: "62%" }}>
                <path d="M0 120 L80 90 L160 110 L260 70 L400 105 L400 200 L0 200 Z" fill="#1b0f3a" />
                <path d="M150 200 L150 125 L195 92 L240 125 L240 200 Z" fill="#0d0820" />
                <rect x="185" y="150" width="20" height="50" fill="#ffcf6b" />
              </svg>
            </div>
          </div>,
          { borderRadius: 24 },
        )}
        <div style={{ height: 26 }} />
        {sec(
          3,
          <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr 1fr", gap: 16, padding: 6 }}>
            {[
              ["Leistungen", "Alles auf einen Blick"],
              ["Preise", "Klar und fair"],
              ["Termin", "Online anfragen"],
            ].map(([a, b]) => (
              <div key={a} style={{ padding: narrow ? "20px 22px" : "24px 22px", borderRadius: 20, background: "#ffffff0d", border: "1px solid #ffffff1a", display: narrow ? "flex" : "block", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 28 }}>{a}</div>
                <div style={{ fontSize: 20, color: C.sub, marginTop: narrow ? 0 : 6 }}>{b}</div>
              </div>
            ))}
          </div>,
          { borderRadius: 22 },
        )}
        <div style={{ height: 26 }} />
        {sec(
          4,
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px", borderRadius: 20, background: `linear-gradient(90deg, ${C.blue}33, transparent)` }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Kontakt in 1 Klick</div>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
              </svg>
            </div>
          </div>,
          { borderRadius: 20 },
        )}
      </div>
    </div>
  );
};
