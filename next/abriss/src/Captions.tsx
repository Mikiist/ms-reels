import React from "react";
import { C, DISPLAY, E, VO, seg } from "./lib";
import words from "../work/words.json";

// Schreibweise aus dem Skript, Zeiten aus Whisper (gleiche Wortzahl)
const SCRIPT =
  "Ihre Website sieht noch so aus? Dann reißen wir sie ab. Und bauen sie neu. Stück für Stück. Schnell, klar und fürs Handy gemacht. Damit Ihre Kunden Sie bei Google finden. Und endlich anrufen. Mihajlo Systems aus Goslar. Kommentieren Sie WEBSITE für Ihr kostenloses Erstgespräch.";
const ACCENT = new Set(["so", "ab", "neu", "Stück", "Schnell", "Handy", "Google", "anrufen", "WEBSITE", "Erstgespräch"]);

type Wd = { w: string; s: number; e: number; acc: boolean; end: boolean };
const W0 = (words as unknown as { words: [string, number, number][] }).words;
const toks = SCRIPT.split(" ");
const WORDS: Wd[] = toks.map((tk, i) => ({
  w: tk.replace(/[.,?]/g, ""),
  s: W0[i][1] + VO,
  e: W0[i][2] + VO,
  acc: ACCENT.has(tk.replace(/[.,?]/g, "")),
  end: /[.?]$/.test(tk) || (/,$/.test(tk) && false),
}));

// Phrasen: Satzende oder höchstens 3 Wörter
const PHRASES: Wd[][] = [];
{
  let cur: Wd[] = [];
  WORDS.forEach((w) => {
    cur.push(w);
    if (w.end || cur.length >= 3) {
      PHRASES.push(cur);
      cur = [];
    }
  });
  if (cur.length) PHRASES.push(cur);
}

export const Captions: React.FC<{ t: number }> = ({ t }) => {
  const idx = PHRASES.findIndex((p, i) => {
    const next = PHRASES[i + 1];
    return t >= p[0].s - 0.08 && (!next || t < next[0].s - 0.08);
  });
  if (idx < 0) return null;
  const p = PHRASES[idx];
  const last = p[p.length - 1];
  if (idx === PHRASES.length - 1 && t > last.e + 1.6) return null;
  return (
    <div style={{ position: "absolute", top: 1520, width: "100%", display: "flex", justifyContent: "center", gap: 26, flexWrap: "wrap", padding: "0 80px" }}>
      {p.map((w, i) => {
        const k = seg(t, w.s - 0.06, w.s + 0.12, E.back);
        const active = t >= w.s - 0.04 && t < w.e + 0.08;
        return (
          <span
            key={i}
            style={{
              fontFamily: DISPLAY,
              fontWeight: 900,
              fontSize: 68,
              letterSpacing: -1,
              color: w.acc ? C.cyan : C.white,
              opacity: 0.25 + 0.75 * k,
              scale: String(0.82 + 0.18 * k),
              textShadow: `0 6px 26px #000, 0 0 ${active && w.acc ? 30 : 0}px ${C.blue}`,
              WebkitTextStroke: "1px #0008",
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
