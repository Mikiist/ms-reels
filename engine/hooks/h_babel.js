// VOICE_DELAY: 0.6
// h_babel: Sprechblasen in vielen Sprachen ploppen im Takt auf (Kunden sprechen viele Sprachen),
// dann verblassen alle, und eine rote Blase bleibt: „Nur Deutsch?“ mit Stempel.
// Parameter: words (Liste der Grüße), final (Standard „Nur Deutsch?“), stamp (Standard „NUR DE“).
(() => {
  if (document.fonts) ["600 20px D", "700 20px D", "800 20px D", "900 20px D", "500 20px I", "600 20px I", "700 20px I"].forEach((f) => document.fonts.load(f));
  const WORDS = ["Merhaba", "Hello", "Dzień dobry", "Bonjour", "Здравствуйте", "Hola", "Ciao", "Mirëdita", "Zdravo", "Olá", "Γεια σας", "Salut"];
  const COLS = ["#2f7bff", "#22c55e", "#f59e0b", "#a855f7", "#ec4899", "#06b6d4", "#ef4444", "#14b8a6", "#6366f1", "#84cc16", "#f97316", "#0ea5e9"];
  const STEP = 0.16;
  const climax = (d) => Math.max(1.35, Math.min(d - 0.6, 2.3));

  function bubble(g, x, y, s, label, col, alpha, sat) {
    g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = alpha;
    font(g, 800, 46, "D"); const tw = g.measureText(label).width; const w = tw + 64, h = 92;
    const c = sat < 1 ? "#3b4252" : col;
    shadow(g, 30, 12, "rgba(0,0,0,0.45)"); fillRR(g, -w / 2, -h / 2, w, h, 40, c); noShadow(g);
    g.fillStyle = c; g.beginPath(); g.moveTo(-w / 2 + 34, h / 2 - 6); g.lineTo(-w / 2 + 22, h / 2 + 26); g.lineTo(-w / 2 + 62, h / 2 - 6); g.closePath(); g.fill();
    const gl = g.createLinearGradient(0, -h / 2, 0, 0); gl.addColorStop(0, "rgba(255,255,255,0.28)"); gl.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gl; rr(g, -w / 2 + 6, -h / 2 + 5, w - 12, h / 2, 34); g.fill();
    txt(g, label, 0, 3, { w: 800, px: 46, c: sat < 1 ? "rgba(255,255,255,0.55)" : "#fff" });
    g.restore();
  }

  TYPES.h_babel = {
    zone: "bottom", pal: "night", bgv: 0, coverT: 2.15,
    draw(g, u, d, p) {
      const words = (p.words && p.words.length ? p.words : WORDS).slice(0, 12);
      const tc = climax(d);
      // Hintergrund: Nacht mit weichem Lichtfleck
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0b1226"); bg.addColorStop(1, "#05070f"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      const rg = g.createRadialGradient(W / 2, 860, 0, W / 2, 860, 700); rg.addColorStop(0, "rgba(47,123,255,0.25)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H);
      // leichte Kamerafahrt
      const cam = 1 + u * 0.035; g.save(); g.translate(W / 2, 860); g.scale(cam, cam); g.translate(-W / 2, -860);
      const fade = seg(u, tc, tc + 0.3);
      words.forEach((wd, i) => {
        const t0 = i * STEP; if (u < t0) return;
        const k = seg(u, t0, t0 + 0.22);
        const s = outBack(k, 2.2) * (1 - fade * 0.25);
        // feste, verteilte Plätze im Grafikbereich
        const col = i % 3, row = Math.floor(i / 3);
        const x = 245 + col * 295 + (rnd(i * 3.3) - 0.5) * 60 + Math.sin(u * 1.4 + i) * 10;
        const y = 500 + row * 200 + (rnd(i * 7.1) - 0.5) * 60 + Math.cos(u * 1.2 + i) * 8;
        bubble(g, x, y, s * (0.85 + rnd(i) * 0.25), wd, COLS[i % COLS.length], 1 - fade * 0.75, fade > 0.5 ? 0 : 1);
      });
      g.restore();
      // Finale: rote Blase „Nur Deutsch?“ knallt in die Mitte
      if (u >= tc) {
        const k = seg(u, tc, tc + 0.25); const s = outBack(k, 2.6) * 1.55;
        g.save(); g.fillStyle = `rgba(0,0,0,${0.45 * k})`; g.fillRect(0, 0, W, H); g.restore();
        bubble(g, W / 2 + 20, 840, s, p.final || "Nur Deutsch?", "#ef4444", 1, 1);
        const ks = seg(u, tc + 0.22, tc + 0.4); if (ks > 0) {
          g.save(); g.translate(W / 2 + 230, 990); g.rotate(-0.18); const ss = 1.8 - 0.8 * out3(ks); g.scale(ss, ss); g.globalAlpha = ks;
          g.strokeStyle = "#ffffff"; g.lineWidth = 7; rr(g, -150, -46, 300, 92, 14); g.stroke();
          txt(g, p.stamp || "NUR DE", 0, 3, { w: 900, px: 54, c: "#ffffff" }); g.restore();
        }
      }
    },
    ev(d, p) {
      const n = Math.min(12, (p.words && p.words.length) || WORDS.length); const tc = climax(d); const out = [];
      for (let i = 0; i < n; i++) { const t = i * STEP; if (t < tc - 0.05) out.push([t, `babel_pop${i % 4}`, 0.85, ((i % 3) - 1) * 0.5]); }
      out.push([tc, "babel_drop", 0.9, 0]); out.push([tc, "thump", 0.7, 0]); out.push([tc + 0.24, "babel_stamp", 1.0, 0.2]);
      return out;
    },
  };
})();
