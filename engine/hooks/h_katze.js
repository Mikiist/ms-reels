// VOICE_DELAY: 0.45
// h_katze: Neugier-Geschichte (Look "editorial", Anti-Werbung, kein Technikwort bis zum Schnitt). Supermarkt. Frau Lehmann schreibt
// ihre Telefonnummer auf zehntausend Bananen, der Zähler oben tickt hoch. Der Kassierer ruft „Was soll das?!“, die Kunden murren.
// Am nächsten Morgen kommt der Obstmann an die Kasse, schaut auf eine Banane und wird knallrot. Bei „Denn“ taucht die Kamera
// in sein Gesicht, Weiß. Danach bananen_end.
// Wörter: sie, glauben, supermarkt, schon, alles, gesehen, dann, schreibt, frau, lehmann, sechs, telefonnummer, zehntausend,
// bananen, kassierer, ruft, soll, endlich, anrufen, kunden, murren, morgen, kommt, obstmann, kasse, banane, knallrot, denn, hatte.
(() => {
  const OL = SK.OL;
  const FRAU = { hs: "bun", hair: "#7a3f1d", shirt: "#e85d75", skirt: "#3b4a7a", skin: "#f1c7a1", shoes: "#2a2a30" };
  const KASS = { hs: "cap", hair: "#c0392b", shirt: "#2f6f8f", apron: "#f4f1ea", pants: "#33374a", skin: "#f0c4a0", glasses: true };
  const OBST = { hs: "short", hair: "#2b2b2b", beard: "#3a2a1e", shirt: "#3d9a6b", apron: "#eeeae0", pants: "#3a3f48", shoes: "#4a3426", skin: "#efc29c" };
  const KUND = { hs: "long", hair: "#c98d3a", shirt: "#8e5bd6", pants: "#4a4e57", skin: "#f3cfb0" };
  const K = (t, z, x, y) => ({ t, z, x, y });
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const life = (u, a, b) => seg(u, a, a + 0.18) * (1 - seg(u, b - 0.25, b));

  // Banane (Mitte bei 0,0), label = Nummer auf der Schale
  function banana(g, x, y, r, s, label) {
    g.save(); g.translate(x, y); g.rotate(r); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#f4d03f";
    g.beginPath(); g.moveTo(-60, -14); g.quadraticCurveTo(0, 46, 58, -30); g.quadraticCurveTo(4, 14, -60, -14); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#6b4a1d"; g.fillRect(-66, -20, 10, 10); g.fillRect(52, -38, 10, 10);
    if (label) { g.font = "900 26px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#18181b"; g.fillText(label, 0, 2); }
    g.restore();
  }

  // Supermarkt-Hintergrund (Weltkoordinaten)
  function store(g) {
    g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#eef2f5"; g.fillRect(-900, 260, 2600, 900); g.strokeRect(-900, 260, 2600, 900);
    const cols = ["#e5243b", "#2f6f8f", "#f2b134", "#3d9a6b", "#8e5bd6", "#e0703a", "#5b6ee1", "#c9ced8"];
    for (let r = 0; r < 3; r++) {
      const y = 360 + r * 150;
      for (let c = 0; c < 30; c++) { const x = -900 + c * 90 + (r % 2) * 20, h = 70 + ((c * 37 + r * 11) % 40); g.fillStyle = cols[(c + r * 3) % cols.length]; g.fillRect(x, y + 110 - h, 70, h); g.strokeRect(x, y + 110 - h, 70, h); }
      g.fillStyle = "#b08a62"; g.fillRect(-900, y + 110, 2600, 18); g.strokeRect(-900, y + 110, 2600, 18);
    }
    g.fillStyle = "#d9d4c7"; g.fillRect(-900, 1140, 2600, 800); g.strokeRect(-900, 1140, 2600, 800);
    g.lineWidth = 3; g.strokeStyle = "rgba(43,29,20,0.18)";
    for (let x = -900; x < 1700; x += 140) { g.beginPath(); g.moveTo(x, 1140); g.lineTo(x - 200, 1940); g.stroke(); }
    g.lineWidth = 8; g.strokeStyle = OL;
  }

  // Kasse (wird nach dem Kassierer gezeichnet, damit er dahinter steht)
  function counter(g) {
    g.fillStyle = "#9aa6b4"; g.fillRect(660, 990, 440, 36); g.strokeRect(660, 990, 440, 36);
    g.fillStyle = "#4a6f9a"; g.fillRect(700, 1026, 380, 160); g.strokeRect(700, 1026, 380, 160);
    g.fillStyle = "#2f3b4c"; g.fillRect(840, 1040, 120, 50); g.strokeRect(840, 1040, 120, 50);
  }

  // Obststand-Kiste mit Bananen; nb = Anzahl der beschrifteten Bananen
  function crate(g, nb) {
    g.fillStyle = "#c98a5a"; g.fillRect(340, 1060, 320, 120); g.strokeRect(340, 1060, 320, 120);
    for (let i = 0; i < 6; i++) {
      const x = 380 + (i % 3) * 100 + (i >= 3 ? 40 : 0) - 40, y = i < 3 ? 1088 : 1112;
      banana(g, x, y, (i % 2 ? 0.25 : -0.2), 0.75, i < nb ? "0123 4567" : "");
    }
    g.fillStyle = "#c98a5a"; g.fillRect(340, 1130, 320, 50); g.strokeRect(340, 1130, 320, 50);
    g.font = "900 34px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = OL; g.fillText("OBST", 500, 1156);
  }

  TYPES.h_katze = {
    zone: "top", pal: "o_cream", bgv: 0, coverT: 1.6, capY: 1560,
    prep(o, p) {
      const f = SK.finder(o); const T = {};
      T.zehn = f(/^zehntausend$/, 0, 2.5);
      T.ruft = f(/^ruft$/, T.zehn, T.zehn + 1.2);
      T.anrufen = f(/^anrufen$/, T.ruft, T.ruft + 3.0);
      T.murren = f(/^murren$/, T.anrufen, T.anrufen + 1.5);
      T.kommt = f(/^kommt$/, T.murren, T.murren + 2.0);
      T.kasse = f(/^kasse$/, T.kommt, T.kommt + 2.0);
      T.banane = f(/^banane$/, T.kasse, T.kasse + 2.0);
      T.knall = f(/^knallrot$/, T.banane, T.banane + 2.0);
      T.denn = f(/^denn$/, T.knall, T.knall + 1.5);
      p._T = T;
    },
    draw(g, u, d, p) {
      const T = p._T;
      // Zähler: läuft bis kurz nach „zehntausend“
      const kc = cl((u - 0.4) / Math.max(0.6, T.zehn - 0.2 - 0.4));
      const cnt = Math.round(10000 * (1 - (1 - kc) * (1 - kc)));
      const KF = [K(0, 1.0, 540, 900), K(T.zehn - 0.4, 1.12, 360, 1010), K(T.ruft - 0.3, 0.95, 680, 900), K(T.anrufen - 0.5, 1.12, 300, 980),
        K(T.kommt - 0.3, 0.95, 640, 900), K(T.knall - 0.6, 1.3, 640, 960), K(T.denn - 0.2, 1.6, 620, 880), K(T.denn + 0.9, 3.0, 620, 842)];
      const c = SK.cam(KF, u);
      const screen = (x, y) => SK.toScreen(c, x, y);

      g.save(); SK.apply(g, c, 0, 0);
      store(g);
      crate(g, Math.round(6 * kc));

      // Kunde links, murrt
      const murr = life(u, T.murren - 0.2, T.kommt + 0.4) > 0;
      SK.person(g, 70, 1180, 0.62, { ...KUND, mouth: murr ? "shout" : "flat", brow: murr ? -1 : 0, aR: murr ? -0.6 : 0.5, eR: murr ? -0.8 : 0 });
      // Frau Lehmann mit Filzstift
      SK.person(g, 240, 1180, 0.62, { ...FRAU, mouth: (u > T.anrufen - 0.5 && u < T.murren) ? "open" : "smile", aR: 0.9 + Math.sin(u * 11) * 0.22, eR: -0.35,
        hold: (q, h) => { q.fillStyle = "#18181b"; q.strokeStyle = OL; q.lineWidth = 4; rr(q, h[0] - 6, h[1] - 60, 12, 70, 5); q.fill(); q.stroke(); } });
      // Kassierer hinter der Kasse
      const yell = u > T.ruft - 0.2 && u < T.kommt - 0.3;
      SK.person(g, 960, 1180, 0.62, { ...KASS, mouth: yell ? "shout" : "smile", brow: yell ? 1 : 0, aR: yell ? -0.7 : 0.9, eR: yell ? -0.5 : 0 });
      counter(g);

      // Obstmann kommt von rechts an die Kasse
      if (u >= T.kommt - 0.1) {
        const w = cl((u - T.kommt) / Math.max(0.4, T.kasse - T.kommt));
        const x = lerp(1250, 620, out3(w)); const walking = w < 1; const red = seg(u, T.knall - 0.7, T.knall);
        const hold = u > T.banane - 0.3;
        SK.person(g, x, 1180, 0.62, { ...OBST, walk: walking ? u * 12 : undefined, red, flip: false,
          mouth: u > T.knall ? "o" : u > T.banane - 0.2 ? "open" : "smile", eyes: u > T.knall ? "wide" : "dot", brow: u > T.knall ? -1 : 0,
          aR: hold ? 0.2 : (walking ? undefined : 1.2), eR: hold ? -1.0 : 0,
          hold: (q, h) => { if (hold) banana(q, h[0] + 8, h[1] - 10, -0.6, 1.2, ""); } });
        if (u >= T.kasse - 0.05 && u < T.kasse + 0.9) { const k = u - T.kasse; const [px, py] = screen(700, 980); SK.pow(g, "KLONK!", px, py, k / 0.8, { px: 110 }); }
      }
      g.restore();

      // Zähler und Sprechblasen (Bildschirmkoordinaten)
      g.save(); fillRR(g, 240, 470, 600, 120, 24, "#fff7e0"); g.strokeStyle = OL; g.lineWidth = 8; rr(g, 240, 470, 600, 120, 24); g.stroke();
      g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = OL; g.font = "900 30px D"; g.fillText("BANANEN MIT NUMMER", 540, 503);
      g.font = "900 74px D"; g.fillStyle = "#e5243b"; g.fillText(fmt(cnt), 540, 556); g.restore();

      // Blasen im Bild halten: Mitte nie außerhalb des Rahmens und nie unter den Zähler (y >= 680)
      const at = (wx, wy, hw) => { const [x, y] = screen(wx, wy); return [Math.max(hw, Math.min(1080 - hw, x)), Math.max(680, Math.min(1000, y))]; };
      const kas = at(760, 640, 170), kasT = screen(930, 830);
      SK.bubble(g, ["Was soll", "das?!"], kas[0], kas[1], kasT[0], kasT[1], life(u, T.ruft - 0.15, T.kommt - 0.3), { px: 50, shout: true });
      const fr = at(330, 700, 300), frT = screen(250, 840);
      SK.bubble(g, ["Der Obstmann soll", "endlich anrufen!"], fr[0], fr[1], frT[0], frT[1], life(u, T.anrufen - 0.4, T.murren + 0.2), { px: 46 });
      const ku = at(160, 640, 130), kuT = screen(90, 830);
      SK.bubble(g, ["Hallo?!"], ku[0], ku[1], kuT[0], kuT[1], life(u, T.murren - 0.2, T.kommt - 0.2), { px: 50, shout: true });
      const ob = at(520, 700, 110), obT = screen(620, 830);
      SK.bubble(g, ["Ich?!"], ob[0], ob[1], obT[0], obT[1], life(u, T.banane - 0.1, T.knall + 0.6), { px: 50 });

      SK.flashAt(g, u, [T.zehn, T.knall], 0.08, 0.5);
      SK.whiteOut(g, u, d);
    },
    ev(d, p) {
      const T = p._T; const E = [[0, "pop", 0.5, 0]];
      for (let i = 0, t = 0.4; t < T.zehn; i++, t += 0.09) E.push([t, "tick", 0.18, i % 2 ? 0.3 : -0.3]);
      E.push([T.zehn, "ding", 0.6, 0], [T.ruft - 0.15, "thump", 0.45, 0], [T.anrufen - 0.4, "blip", 0.3, 0.2], [T.murren - 0.2, "blip", 0.3, -0.4],
        [T.kommt, "whoosh", 0.4, 0.5], [T.kasse, "slap", 0.5, 0], [T.banane - 0.1, "blip", 0.3, 0], [T.knall, "glitch", 0.35, 0],
        [T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d && e[0] >= 0);
    },
  };

  // ---------- Schluss: Banane fällt auf den Filmtitel, Papier wie bei pfeil_end ----------
  TYPES.bananen_end = {
    zone: "center", pal: "o_cream", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^bestellsystem/, E.sys, 1.6); p._T = E; },
    draw(g, u, d, p) {
      const T = p._T;
      g.fillStyle = "#f3ead9"; g.fillRect(0, 0, W, H);
      g.save(); g.globalAlpha = 0.5; g.strokeStyle = "#d8c8a8"; g.lineWidth = 3;
      for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(-50, 120 + i * 140 + Math.sin(i) * 40); g.bezierCurveTo(300, 60 + i * 140, 700, 200 + i * 140, 1130, 100 + i * 140); g.stroke(); }
      g.restore();
      // Banane fällt von oben und landet über dem Titel
      const fall = cl(u / 0.35), hit = u - 0.35;
      const by = lerp(-420, 620, in3(fall)) + (hit > 0 && hit < 0.3 ? -Math.sin(hit / 0.3 * Math.PI) * 20 : 0);
      banana(g, 540, by, -0.5 + in3(fall) * 0.5, 2.2, "");
      if (hit > 0 && hit < 0.6) shock(g, 540, 700, hit / 0.6, "rgba(201,138,27,A)", 300, 2);
      SK.endTitle(g, u, d, T, { c: "#2b1d14", glow: "rgba(0,0,0,0)", accent: "#c98a1b", sub: "#5c4a3a", key: "#e5243b", offer: "BESTELLSYSTEM", y: 860, line: "für Restaurants und Friseure, ohne Provision." });
      const fi = 1 - cl(u / 0.3); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "whoosh", 0.45, 0], [0.35, "thump", 0.8, 0], [0.36, "boom", 0.4, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
