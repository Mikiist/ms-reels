// VOICE_DELAY: 0.45
// h_hund: Neugier-Geschichte (Look "pop", Anti-Werbung). Vormittag in Hannover: Bruno, ein Hund mit Werbeschild um den Hals,
// läuft durch die Straße. Passanten bleiben stehen und fragen ihn. Herr Lehmann sitzt allein auf der Bank („Keiner fragt mich?“).
// Nacht: Herr Lehmann schläft am Fenster (Zzz), Bruno sitzt vor der Tür, Passant fragt „Haben Sie noch offen?“.
// Bei „Denn“ Kamera auf das Schild, Weiß. Danach hund_end (Filmtitel, kein Neon).
// Wörter: morgen, bruno, schild, fragen, leute, lehmann, bank, niemand, nachts, elf, tür, denn.
(() => {
  const OL = SK.OL;
  const K = (t, z, x, y) => ({ t, z, x, y });
  const BODY = "#c58a4b", BELLY = "#f3dcb6", EAR = "#6b3e1e";

  // Hund (Füße bei feet, Blick nach rechts). o: walk (Phase), t (Zeit für Schwanz), body (Fellfarbe)
  function dog(g, x, feet, s, o = {}) {
    g.save(); g.translate(x, feet); g.scale(s, s); g.lineWidth = 8; g.strokeStyle = OL; g.lineJoin = "round"; g.lineCap = "round";
    const wl = Math.sin(o.walk || 0), t = o.t || 0, body = o.body || BODY;
    // Schwanz wedelt
    g.save(); g.translate(-160, -250); g.rotate(-0.8 + Math.sin(t * 14) * 0.45); g.fillStyle = body; rr(g, -12, -70, 34, 150, 17); g.fill(); g.stroke(); g.restore();
    // Beine (vier, in Gehbewegung)
    [[-110, wl], [-55, -wl], [65, -wl], [120, wl]].forEach(([lx, ph]) => { g.save(); g.translate(lx, -140); g.rotate(ph * 0.35); g.fillStyle = body; rr(g, -24, 0, 48, 140, 20); g.fill(); g.stroke();
      g.fillStyle = OL; rr(g, -28, 128, 56, 24, 12); g.fill(); g.restore(); });
    // Rumpf
    g.fillStyle = body; g.beginPath(); g.ellipse(0, -215, 170, 92, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = BELLY; g.beginPath(); g.ellipse(20, -185, 120, 36, 0.05, 0, 7); g.fill();
    // Hals und Kopf
    g.fillStyle = body; g.beginPath(); g.ellipse(120, -290, 60, 70, 0.3, 0, 7); g.fill(); g.stroke();
    g.save(); g.translate(165, -330); g.fillStyle = EAR; g.beginPath(); g.ellipse(-62, -4, 26, 62, 0.35, 0, 7); g.fill(); g.stroke(); g.restore();
    g.fillStyle = body; g.beginPath(); g.arc(165, -330, 74, 0, 7); g.fill(); g.stroke();
    g.fillStyle = BELLY; g.beginPath(); g.ellipse(222, -296, 52, 36, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OL; g.beginPath(); g.arc(252, -308, 17, 0, 7); g.fill();
    g.beginPath(); g.arc(178, -356, 12, 0, 7); g.fill();
    g.lineWidth = 7; g.beginPath(); g.arc(222, -282, 22, 0.25, Math.PI - 0.25); g.stroke();
    g.fillStyle = "#e0607e"; g.beginPath(); g.ellipse(230, -262, 14, 20, 0, 0, 7); g.fill();
    // Halsband
    g.save(); g.translate(120, -270); g.rotate(-0.3); g.fillStyle = "#c0392b"; rr(g, -26, -40, 52, 88, 18); g.fill(); g.stroke(); g.restore();
    // Schild an der Halsband-Schnur, schwingt leicht
    g.save(); g.translate(104, -200); g.rotate(Math.sin(t * 3) * 0.04);
    g.strokeStyle = OL; g.lineWidth = 6; g.beginPath(); g.moveTo(-18, -40); g.lineTo(-70, 0); g.moveTo(18, -40); g.lineTo(70, 0); g.stroke();
    g.fillStyle = "#fff4d6"; g.strokeStyle = OL; g.lineWidth = 9; rr(g, -150, 0, 300, 150, 18); g.fill(); g.stroke();
    g.fillStyle = "#c0392b"; rr(g, -134, 14, 268, 122, 12); g.fill();
    g.fillStyle = "#fff4d6"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = "900 40px D"; g.fillText("FRAGEN SIE", 0, 52); g.font = "900 78px D"; g.fillText("MICH!", 0, 114);
    g.restore();
    g.restore();
  }

  // Tageslicht, wird nachts (nk 0..1) zu Nacht
  function city(g, u, nk) {
    const top = SK.mix("#7cc4f0", "#070b1c", nk), bot = SK.mix("#ffe6b8", "#18213f", nk);
    const sky = g.createLinearGradient(0, -900, 0, 1140); sky.addColorStop(0, top); sky.addColorStop(1, bot);
    g.fillStyle = sky; g.fillRect(-1200, -1000, 3600, 2140);
    if (nk < 1) { g.globalAlpha = 1 - nk; g.fillStyle = "#fff0b8"; g.beginPath(); g.arc(200, 260, 90, 0, 7); g.fill(); g.globalAlpha = 1; }
    if (nk > 0) { g.globalAlpha = nk; g.fillStyle = "#fff4cf"; g.beginPath(); g.arc(860, 260, 70, 0, 7); g.fill(); g.fillStyle = top; g.beginPath(); g.arc(888, 246, 62, 0, 7); g.fill(); g.globalAlpha = 1;
      for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${nk * (0.3 + 0.4 * Math.sin(u * 3 + i))})`; g.beginPath(); g.arc(rnd(i * 2.3) * 1080, rnd(i * 5.1) * 500, 2, 0, 7); g.fill(); } }
    // Häuser
    const wall = SK.mix("#b9826a", "#1a2142", nk);
    for (let i = -2; i < 6; i++) { const x = -1200 + i * 330 + (i % 2) * 20, hh = 560 + rnd(i * 7.3 + 3) * 220; g.fillStyle = i % 2 ? wall : SK.mix("#d9a07a", "#141a33", nk);
      g.lineWidth = 8; g.strokeStyle = OL; g.fillRect(x, 1140 - hh, 310, hh); g.strokeRect(x, 1140 - hh, 310, hh);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) { const wx = x + 40 + c * 130, wy = 1140 - hh + 40 + r * 110; const lit = rnd(i * 13 + r * 3 + c) > 0.5;
        g.fillStyle = SK.mix("#4a6a8a", "#ffc878", lit ? nk : 0); g.fillRect(wx, wy, 90, 70); g.strokeRect(wx, wy, 90, 70); } }
    // Bürgersteig und Straße
    g.fillStyle = SK.mix("#c9c1b6", "#2a2f40", nk); g.fillRect(-1200, 1140, 3600, 160); g.strokeStyle = OL; g.lineWidth = 6; g.beginPath(); g.moveTo(-1200, 1140); g.lineTo(2400, 1140); g.stroke();
    g.fillStyle = SK.mix("#55596a", "#1c1f2e", nk); g.fillRect(-1200, 1300, 3600, 800);
    g.fillStyle = "rgba(255,255,255,0.5)"; for (let i = -2; i < 8; i++) g.fillRect(i * 300, 1480, 150, 14);
    if (nk > 0) { g.globalAlpha = nk; const lg = g.createRadialGradient(1000, 700, 10, 1000, 900, 420); lg.addColorStop(0, "rgba(255,205,130,0.55)"); lg.addColorStop(1, "rgba(255,205,130,0)"); g.fillStyle = lg; g.fillRect(560, 300, 900, 1000);
      g.fillStyle = "#0c0f1a"; g.fillRect(1010, 740, 14, 400); g.globalAlpha = 1; }
  }

  // Parkbank (Füße am Boden, Sitzfläche bei y 1000 bis 1040)
  function bench(g, x) { g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#8a5a3a";
    rr(g, x - 150, 1000, 300, 22, 10); g.fill(); g.stroke(); rr(g, x - 150, 1018, 300, 22, 10); g.fill(); g.stroke();
    g.fillStyle = "#5a3a24"; rr(g, x - 130, 1040, 22, 100, 6); g.fill(); g.stroke(); rr(g, x + 108, 1040, 22, 100, 6); g.fill(); g.stroke(); }

  TYPES.h_hund = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 2.2, capY: 1530,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.morgen = f(/^morgen/, 0, 0.5); T.bruno = f(/^bruno/, T.morgen, T.morgen + 0.8); T.schild = f(/^schild/, T.bruno, T.bruno + 1.0);
      T.fragen = f(/^fragen$/, T.schild, T.schild + 1.0); T.leute = f(/^leute/, T.fragen, T.fragen + 1.4); T.lehmann = f(/^lehmann/, T.leute, T.leute + 1.6);
      T.bank = f(/^bank/, T.lehmann, T.lehmann + 0.8); T.niemand = f(/^niemand/, T.bank, T.bank + 1.2); T.nachts = f(/^nachts/, T.niemand, T.niemand + 1.5);
      T.elf = f(/^elf/, T.nachts, T.nachts + 1.0); T.tuer = f(/^tür/, T.elf, T.elf + 1.0); T.denn = f(/^denn/, T.tuer, T.tuer + 1.0);
      p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const nk = seg(u, T.nachts - 0.9, T.nachts + 0.1);
      const KF = [K(0, 1.0, 540, 960), K(T.fragen, 1.12, 520, 920), K(T.lehmann, 1.18, 760, 920), K(T.niemand, 1.2, 800, 920), K(T.nachts, 1.22, 760, 900), K(T.elf, 1.28, 820, 880), K(T.tuer, 1.35, 960, 880), K(T.denn, 1.5, 960, 880)];
      const c = SK.cam(KF, u);
      const dv = inOut(cl((u - T.denn) / 0.45)); c.z *= 1 + dv * 1.4; c.x = lerp(c.x, 1040, dv); c.y = lerp(c.y, 1000, dv);
      const bx = lerp(-40, 980, cl(u / T.nachts)), walk = u < T.nachts ? u * 10 : 0;
      g.save(); SK.apply(g, c);
      city(g, u, nk);
      // Bank mit Herrn Lehmann (Tag)
      g.globalAlpha = 1 - nk; bench(g, 830);
      if (nk < 1) { SK.person(g, 830, 1040, 0.6, { hs: "grey", hair: "#d9d9de", glasses: true, shirt: "#9a6b3f", pants: "#c9b48a", shoes: "#4a3426", skin: "#f0c4a0",
        sit: true, mouth: u > T.niemand ? "sad" : "flat", eyes: u > T.niemand ? "side" : "dot", brow: u > T.niemand ? -0.8 : -0.2, aR: 0.6, eR: -1.4, look: -0.5 }); }
      g.globalAlpha = 1;
      // Herr Lehmann am Fenster (Nacht), schläft
      if (nk > 0) { g.save(); g.globalAlpha = nk; rr(g, 380, 560, 240, 260, 12); g.fillStyle = "#ffc878"; g.fill(); g.strokeStyle = OL; g.lineWidth = 8; g.stroke();
        SK.person(g, 500, 800, 0.4, { hs: "cap", hair: "#e9e3d5", shirt: "#4b7fd6", pants: "#33374a", skin: "#f0c4a0", eyes: "closed", mouth: "flat", brow: 0 });
        g.font = "900 96px D"; g.fillStyle = "#fff"; g.textAlign = "center"; g.lineWidth = 10; g.strokeStyle = OL; const zy = 520 - ((u * 40) % 40); g.strokeText("Zzz", 600, zy); g.fillText("Zzz", 600, zy); g.restore(); }
      // Passanten: Tag zwei, Nacht einer an der Tür
      g.globalAlpha = 1 - nk;
      SK.person(g, 420, 1140, 0.6, { hs: "bun", hair: "#1e1a18", shirt: "#e85d75", pants: "#2b2b33", skin: "#e8b48f", mouth: "smile", eyes: "dot", aR: 1.2, aL: 0.4 });
      SK.person(g, 1000, 1140, 0.6, { hs: "cap", hair: "#2a6fb0", shirt: "#f2b134", pants: "#3d3d4a", skin: "#d9a07a", mouth: "open", eyes: "wide", aR: -0.4, aL: 1.0, flip: true });
      g.globalAlpha = nk;
      SK.person(g, 760, 1140, 0.6, { hs: "long", hair: "#c98d3a", shirt: "#3d9a6b", pants: "#2f4a7a", skin: "#f0c4a0", mouth: "o", eyes: "wide", aR: 1.1, aL: -0.3 });
      g.globalAlpha = 1;
      dog(g, bx, 1140, 0.75, { walk, t: u, body: BODY });
      g.restore();
      // Sprechblasen (Bildschirm-Koordinaten)
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      const [hx1, hy1] = SK.toScreen(c, 420, 760), [hx2, hy2] = SK.toScreen(c, 1000, 800), [hx3, hy3] = SK.toScreen(c, 760, 800), [lx, ly] = SK.toScreen(c, 830, 860);
      SK.bubble(g, ["Haben Sie *Zeit*?"], 300, 420, hx1, hy1 - 30, win(T.fragen + 0.1, T.leute + 0.2), { px: 50 });
      SK.bubble(g, ["Ich frage den", "*Hund*!"], 760, 500, hx2, hy2 - 40, win(T.leute + 0.2, T.lehmann + 0.1), { px: 48 });
      SK.bubble(g, ["Keiner fragt *mich*?"], 720, 620, lx, ly, win(T.lehmann + 0.2, T.nachts + 0.1), { px: 50 });
      SK.bubble(g, ["Haben Sie noch", "*offen*?"], 560, 470, hx3, hy3 - 60, win(T.elf + 0.05, T.tuer + 0.25), { px: 48 });
      SK.flashAt(g, u, [T.lehmann, T.tuer], 0.09, 0.45);
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T;
      const E = [[0.0, "thump", 0.5, 0], [0.05, "chime", 0.3, 0.3], [T.morgen + 0.3, "click", 0.25, -0.3], [T.fragen + 0.1, "pop", 0.35, -0.4], [T.leute + 0.2, "pop", 0.35, 0.4],
        [T.lehmann, "ding", 0.35, 0.3], [T.niemand, "tick", 0.3, 0], [T.nachts - 0.3, "whoosh_side", 0.35, 0], [T.nachts + 0.2, "ding", 0.3, -0.4], [T.elf + 0.1, "pop", 0.35, 0.3],
        [T.tuer, "boom", 0.45, 0], [T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]];
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // Schluss: Filmtitel auf nächtlicher Straße (Bokeh), passend zur Geschichte
  TYPES.hund_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/chatbot/, E.sys, 1.6); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0b1126"); bg.addColorStop(1, "#1a1530"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 24; i++) { const x = rnd(i * 3.7) * 1080 + Math.sin(u * 0.4 + i) * 20, y = 180 + rnd(i * 5.9) * 1400, r = 40 + rnd(i * 1.3) * 110, a = 0.07 + 0.1 * rnd(i * 8.1);
        const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(255,${190 + Math.floor(rnd(i) * 50)},130,${a})`); gg.addColorStop(1, "rgba(255,190,130,0)"); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      g.save(); g.globalAlpha = 0.07; g.fillStyle = "#fff"; const rx = -400 + u * 120; g.beginPath(); g.moveTo(rx, 0); g.lineTo(rx + 160, 0); g.lineTo(rx + 760, H); g.lineTo(rx + 600, H); g.closePath(); g.fill(); g.restore();
      g.strokeStyle = "#0b0816"; g.lineWidth = 40; g.strokeRect(20, 20, W - 40, H - 40);
      SK.endTitle(g, u, d, T, { c: "#f3ead8", glow: "rgba(255,226,170,0.5)", accent: "#e8b85a", sub: "rgba(255,236,200,0.85)", key: "#f3ead8", offer: "IHR KI-CHATBOT", y: 820 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.1, "shimmer", 0.35, 0], [0.4, "ding", 0.3, 0], [0.9, "shimmer_hi", 0.25, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
