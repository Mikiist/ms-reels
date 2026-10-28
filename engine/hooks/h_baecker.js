// VOICE_DELAY: 0.45
// h_baecker: Neugier-Geschichte (Look neon, Mihajlo 29.10.2026). Ein Bäcker lässt jeden Morgen 500 Luftballons mit seiner
// Adresse steigen. Fünf Akte, jedes Segment ist eine Szene (params.act 1 bis 5), danach baecker_end (Filmtitel, Schnitt "cut").
// Akt 1: Ballons schießen aus der Tür (PUFF!). Akt 2: Nachbarn lachen, Kundin fragt „Warum?“, Bäcker: „Psst!“.
// Akt 3: Ballons über der Stadt, einer landet auf dem Balkon, einer im Sandkasten. Akt 4: Schlange vor der Tür.
// Akt 5: AUSVERKAUFT, der Bäcker zwinkert, die Kamera taucht in sein Gesicht, Weiß.
// Keine Technikwörter vor dem Schnitt. Wörter für die Zeiten: Akt 2 lachen, kundin, warum; Akt 3 stadt, sandkasten;
// Akt 4 nachmittag, tür; Akt 5 ausverkauft, denn, hatte.
(() => {
  const OL = SK.OL;
  const BCOL = ["#e5243b", "#ffe600", "#00f0ff", "#ff2bd6", "#b6ff00", "#ff8a4c", "#8e5bd6"];
  const TAG = "BROTWEG 1";
  const BAKER = { hs: "cap", hair: "#ffffff", shirt: "#ffffff", apron: "#e5243b", pants: "#2b3a55", skin: "#e8b48a", shoes: "#2b1d14" };
  const PEOPLE = [
    { hs: "long", hair: "#c98d3a", shirt: "#e85d75", skirt: "#5b3a6e", skin: "#f1c7a1" },
    { hs: "short", hair: "#1e1a18", shirt: "#2f6f8f", pants: "#3a3f48", skin: "#c98d6b" },
    { hs: "bun", hair: "#c9c9cf", shirt: "#8e5bd6", glasses: true, skin: "#f3cfb0" },
    { hs: "cap", hair: "#e5243b", shirt: "#f2b134", skin: "#efc29c" },
    { hs: "grey", hair: "#d9d9de", shirt: "#3d9a6b", pants: "#33374a", skin: "#f1c7a1" },
    { hs: "short", hair: "#7a4a2a", shirt: "#5b6ee1", beard: "#7a4a2a", skin: "#e0a77e" },
  ];

  // Nachthimmel: Violett oben, Horizont glüht, Sonne mit Streifen, Neon-Gitter am Boden
  function sky(g, hz) {
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#14072a"); gr.addColorStop(0.5, "#3b1a5e"); gr.addColorStop(hz / H, "#c2410c");
    gr.addColorStop(Math.min(1, hz / H + 0.02), "#1d1430"); gr.addColorStop(1, "#07040f");
    g.fillStyle = gr; g.fillRect(-600, -600, W + 1200, H + 1200);
    const sun = g.createLinearGradient(0, hz - 300, 0, hz); sun.addColorStop(0, "#ffe600"); sun.addColorStop(1, "#ff2bd6");
    g.fillStyle = sun; g.beginPath(); g.arc(540, hz, 280, Math.PI, 0); g.fill();
    g.fillStyle = "#1d1430"; for (let k = 0; k < 5; k++) g.fillRect(250, hz - 60 - k * 50 - k * 4, 580, 8 + k * 3);
    g.save(); g.strokeStyle = "rgba(0,240,255,0.55)"; g.lineWidth = 3; g.shadowColor = "#00f0ff"; g.shadowBlur = 12; g.beginPath();
    for (let k = -12; k <= 12; k++) { g.moveTo(540 + k * 18, hz); g.lineTo(540 + k * 260, H + 200); }
    for (let k = 0; k < 10; k++) { const y = hz + Math.pow(k / 10, 2.2) * (H - hz) + 40; g.moveTo(-600, y); g.lineTo(W + 600, y); }
    g.stroke(); g.restore();
  }

  // Ballon: Ellipse mit Glanz, Knoten, Schnur, optional Adressschild (tag)
  function balloon(g, x, y, s, c, tag) {
    g.save(); g.translate(x, y); g.scale(s, s); g.lineJoin = "round";
    g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 66); g.quadraticCurveTo(-22, 110, 4, tag ? 146 : 170); g.stroke();
    g.fillStyle = c; g.strokeStyle = OL; g.lineWidth = 6; g.beginPath(); g.ellipse(0, 0, 46, 58, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.ellipse(-17, -24, 9, 16, -0.4, 0, Math.PI * 2); g.fill();
    g.fillStyle = c; g.lineWidth = 5; g.beginPath(); g.moveTo(-8, 57); g.lineTo(8, 57); g.lineTo(0, 68); g.closePath(); g.fill(); g.stroke();
    if (tag) { g.fillStyle = "#ffffff"; g.lineWidth = 4; rr(g, -75, 146, 150, 46, 8); g.fill(); g.stroke();
      g.font = "900 22px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = OL; g.fillText(tag, 0, 170); }
    g.restore();
  }
  // Schwarm: n Ballons steigen von (x, y) nach oben, zeitlich gestaffelt ab t0, seitlicher Wind
  function flock(g, u, n, o) {
    for (let i = 0; i < n; i++) {
      const k = u - (o.t0 || 0) - rnd(i * 1.7) * (o.spread || 0.8); if (k <= 0) continue;
      const y = o.y - k * (240 + rnd(i * 3.3) * 200); if (y < -300) continue;
      const x = o.x + (rnd(i * 5.1) - 0.5) * (o.w || 240) + Math.sin(u * 2 + i) * 22 + k * (o.wind || 0);
      balloon(g, x, y, (o.s || 0.85) * (0.85 + rnd(i * 7.7) * 0.3), BCOL[i % BCOL.length], o.tags && i < o.tags ? TAG : null);
    }
  }
  // Ein Ballon fliegt in die Szene und landet bei t auf dem Ziel to
  function landBalloon(g, u, t, to, c) { if (u < t - 1.5) return; const e = inOut(seg(u, t - 1.5, t));
    balloon(g, lerp(-160, to.x, e), lerp(300, to.y, e) - Math.sin(e * Math.PI) * 200, 0.85, c, TAG); }
  // Bäckerei-Fassade: Wand, rot-weiße Markise, Schild BÄCKEREI, Schaufenster mit Brot, offene Tür mit Licht
  function bakery(g, x, y, w, h) {
    g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#8a4a2e"; g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h);
    g.fillStyle = "#3b2216"; g.beginPath(); g.moveTo(x - 40, y + 4); g.lineTo(x + w / 2, y - 150); g.lineTo(x + w + 40, y + 4); g.closePath(); g.fill(); g.stroke();
    for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? "#fff3e0" : "#e5243b"; g.fillRect(x + i * w / 10, y + 130, w / 10, 90); }
    g.strokeRect(x, y + 130, w, 90);
    fillRR(g, x + w * 0.16, y + 22, w * 0.68, 96, 14, "#2b1d14"); g.strokeStyle = OL; rr(g, x + w * 0.16, y + 22, w * 0.68, 96, 14); g.stroke();
    g.font = "900 70px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#f6d58a"; g.fillText("BÄCKEREI", x + w / 2, y + 72);
    g.fillStyle = "#ffd58a"; rr(g, x + 40, y + 250, w * 0.24, 150, 10); g.fill(); g.stroke();
    for (let i = 0; i < 3; i++) { g.fillStyle = "#b5651d"; g.beginPath(); g.ellipse(x + 40 + w * 0.24 * (0.2 + i * 0.3), y + 330, 34, 22, 0, 0, Math.PI * 2); g.fill(); g.stroke(); }
    const dx = x + w * 0.35, dw = w * 0.3;
    g.fillStyle = "#2b1d14"; g.fillRect(dx, y + 230, dw, h - 230); g.fillStyle = "#ffd58a"; g.fillRect(dx + 14, y + 260, dw - 28, h - 260); g.strokeRect(dx, y + 230, dw, h - 230);
  }

  // Akt 1: Hook. Ballons schießen aus der Tür, der Bäcker wedelt, PUFF!
  function act1(g, u, d, T) {
    sky(g, 1480); bakery(g, 150, 1000, 780, 480);
    flock(g, u, 34, { x: 540, y: 1360, spread: 1.0, w: 460, tags: 6, s: 0.9 });
    const hand = Math.sin(u * 13) * 0.25;
    SK.person(g, 540, 1500, 0.62, { ...BAKER, eyes: "wide", mouth: "shout", aR: -1.2 + hand, aL: -1.2 - hand });
    SK.flashAt(g, u, [0.02], 0.08, 0.6);
    SK.pow(g, "PUFF!", 540, 1000, u / 0.9, { px: 170, rot: -0.1 });
  }

  // Akt 2: Nachbarn lachen, Kundin fragt „Warum?“, der Bäcker zwinkert „Psst!“
  function act2(g, u, d, T) {
    sky(g, 1480); bakery(g, 470, 1000, 600, 480);
    const lk = u > T.lach - 0.1, bob = lk ? Math.abs(Math.sin(u * 14)) * -14 : 0;
    for (let i = 0; i < 2; i++) SK.person(g, 60 + i * 120, 1560, 0.5, { ...PEOPLE[i + 1], eyes: lk ? "happy" : "dot", mouth: lk ? "grin" : "smile", bob: bob * (i ? -1 : 1), aL: -1.1, aR: -1.1 });
    SK.person(g, 330, 1520, 0.62, { hs: "long", hair: "#c98d3a", shirt: "#e85d75", skirt: "#5b3a6e", skin: "#f1c7a1", eyes: "wide", mouth: "o", aR: 0.1, aL: 1.2 });
    SK.person(g, 770, 1520, 0.62, { ...BAKER, eyes: u > T.psst ? "wink" : "dot", mouth: u > T.psst ? "grin" : "smile", aL: 0.4, aR: 1.25 });
    SK.bubble(g, ["*Warum?*"], 330, 860, 330, 1120, seg(u, T.kund, T.kund + 0.25), { px: 60 });
    SK.bubble(g, ["*Psst!*"], 770, 860, 770, 1120, seg(u, T.psst, T.psst + 0.25), { px: 60 });
    if (lk) SK.pow(g, "HAHA!", 170, 760, (u - (T.lach - 0.1)) / 1.1, { px: 110, rot: -0.12, c: "#ff8ab0" });
  }

  // Akt 3: Ballons über der Stadt, einer landet auf dem Balkon, einer im Sandkasten
  function act3(g, u, d, T) {
    sky(g, 1480);
    const HS = [[-40, 1040, 230, 560], [170, 900, 210, 700], [360, 1060, 190, 540], [530, 860, 240, 740], [750, 980, 220, 620], [950, 1060, 200, 540]];
    HS.forEach(([x, y, w, h], j) => { g.fillStyle = "#1b1530"; g.strokeStyle = OL; g.lineWidth = 6; g.fillRect(x, y, w, h); g.strokeRect(x, y, w, h);
      for (let r = 0; r < Math.floor(h / 130); r++) for (let c = 0; c < Math.floor(w / 62); c++) { const on = rnd(j * 31 + r * 7 + c * 3) > 0.45; g.fillStyle = on ? "#ffd58a" : "#2a2046"; g.fillRect(x + 22 + c * 62, y + 26 + r * 130, 26, 36); } });
    const landed = u > T.balk;
    SK.person(g, 700, 1078, 0.42, { hs: "long", hair: "#e0703a", shirt: "#5b6ee1", skin: "#f3cfb0", eyes: landed ? "wide" : "happy", mouth: landed ? "o" : "smile", aR: landed ? -1.2 : 1.0, aL: 0.8 });
    g.fillStyle = "#3b2a5e"; g.strokeStyle = OL; g.lineWidth = 6; g.fillRect(620, 1078, 180, 14); g.strokeRect(620, 1078, 180, 14);
    const sandOn = u > T.sand;
    g.fillStyle = "#e9c46a"; g.strokeStyle = OL; g.lineWidth = 7; rr(g, 130, 1640, 330, 110, 24); g.fill(); g.stroke();
    SK.person(g, 250, 1700, 0.4, { hs: "bun", hair: "#1e1a18", shirt: "#f2b134", pants: "#3d9a6b", skin: "#c98d6b", eyes: sandOn ? "happy" : "dot", mouth: sandOn ? "open" : "smile", aL: sandOn ? -1.3 : 1.1, aR: sandOn ? -1.3 : 1.1 });
    flock(g, u, 16, { x: 720, y: 1260, spread: 1.2, w: 260, s: 0.7, wind: -70 });
    landBalloon(g, u, T.balk, { x: 735, y: 1010 }, "#ff2bd6");
    landBalloon(g, u, T.sand, { x: 420, y: 1560 }, "#ffe600");
  }

  // Akt 4: Die halbe Stadt steht vor der Tür, jeder hält einen Ballon
  function act4(g, u, d, T) {
    sky(g, 1480); bakery(g, 200, 860, 680, 620);
    const xs = [80, 230, 380, 700, 850, 1000];
    xs.forEach((x, i) => { const t = T.nach + 0.25 * i; if (u < t) return;
      SK.person(g, x, 1560, 0.5, { ...PEOPLE[i], walk: u * 6 + i, mouth: u > T.tuer ? "grin" : "smile", eyes: u > T.tuer ? "happy" : "dot" });
      balloon(g, x + 40, 1200, 0.6, BCOL[(i * 2) % BCOL.length], null); });
    if (u > T.tuer - 0.2) SK.bubble(g, ["*Der* Ballon!"], 220, 1000, 220, 1200, seg(u, T.tuer, T.tuer + 0.25), { px: 56 });
  }

  // Akt 5: AUSVERKAUFT, der Bäcker zwinkert, die Kamera taucht in sein Gesicht, dann Weiß
  function act5(g, u, d, T) {
    const KF = [{ t: 0, z: 1.0, x: 540, y: 960 }, { t: T.ausv, z: 1.05, x: 540, y: 980 }, { t: d - 0.7, z: 1.2, x: 540, y: 1000 }, { t: d - 0.05, z: 2.6, x: 540, y: 1318 }];
    const c = SK.cam(KF, u);
    g.save(); SK.apply(g, c);
    g.fillStyle = "#2b1d14"; g.fillRect(-600, -600, 2300, 3200);
    for (let r = 0; r < 4; r++) { g.fillStyle = "#6b3e26"; g.fillRect(-100, 420 + r * 210, 1300, 24);
      for (let i = 0; i < 9; i++) { g.fillStyle = "#c98a5a"; g.beginPath(); g.ellipse(-20 + i * 120, 386 + r * 210, 44, 28, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = OL; g.lineWidth = 6; g.stroke(); } }
    for (let i = 0; i < 4; i++) { g.fillStyle = "rgba(255,214,138,0.85)"; g.beginPath(); g.arc(120 + i * 280, 130, 46, 0, Math.PI * 2); g.fill(); }
    SK.person(g, 540, 1700, 0.7, { ...BAKER, eyes: "wink", mouth: "grin", aL: -1.0, aR: 1.0 });
    g.fillStyle = "#8a4a2e"; g.strokeStyle = OL; g.lineWidth = 8; g.fillRect(-100, 1480, 1300, 500); g.strokeRect(-100, 1480, 1300, 500);
    const sk = seg(u, T.ausv, T.ausv + 0.35);
    if (sk > 0) { g.save(); g.translate(540, 1010); g.rotate(-0.05); const e = outBack(sk, 1.6); g.scale(e, e);
      fillRR(g, -380, -80, 760, 160, 16, "#ffe600"); g.strokeStyle = OL; g.lineWidth = 8; rr(g, -380, -80, 760, 160, 16); g.stroke();
      g.font = "900 88px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = OL; g.fillText("AUSVERKAUFT", 0, 6); g.restore(); }
    g.restore();
    SK.whiteOut(g, u, d);
  }

  TYPES.h_baecker = {
    zone: "top", pal: "n_mag", bgv: 0, coverT: 1.4,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.lach = f(/^lachen/, 0, 1.0); T.kund = f(/^kundin/, T.lach, T.lach + 0.6); T.warum = f(/^warum/, T.kund, T.kund + 0.6); T.psst = T.warum + 0.7;
      T.stadt = f(/^stadt/, 0, 1.4); T.balk = T.stadt + 0.3; T.sand = f(/^sandkasten/, T.stadt, T.stadt + 1.5);
      T.nach = f(/^nachmittag/, 0, 0.3); T.tuer = f(/^tür/, T.nach, T.nach + 2.0);
      T.ausv = f(/^ausverkauft/, 0, 1.2); T.denn = f(/^denn/, T.ausv, T.ausv + 0.8); T.hatte = f(/^hatte/, T.denn, T.denn + 1.0);
      p._T = T; },
    draw(g, u, d, p) { const T = p._T, a = p.act || 1;
      if (a === 1) act1(g, u, d, T); else if (a === 2) act2(g, u, d, T); else if (a === 3) act3(g, u, d, T); else if (a === 4) act4(g, u, d, T); else act5(g, u, d, T); },
    ev(d, p) { const T = p._T, a = p.act || 1; let E = [];
      if (a === 1) { E = [[0, "boom", 0.7, 0], [0.03, "pop", 0.5, 0], [0.2, "whoosh_up", 0.35, 0], [0.9, "chime", 0.3, 0.3]]; for (let i = 0; i < 6; i++) E.push([0.25 + i * 0.12, "pop", 0.2, -0.5 + i * 0.2]); }
      else if (a === 2) E = [[T.lach, "chime", 0.35, 0], [T.kund, "tick", 0.35, 0], [T.warum, "ding", 0.5, 0], [T.psst, "whoosh_side", 0.3, 0]];
      else if (a === 3) E = [[0, "whoosh_up", 0.35, 0], [T.balk, "pop", 0.4, 0.3], [T.sand, "pop", 0.35, -0.3], [T.sand + 0.05, "shimmer", 0.25, 0]];
      else if (a === 4) { E = []; for (let i = 0; i < 6; i++) E.push([T.nach + 0.25 * i, "tick", 0.2, -0.4 + i * 0.16]); E.push([T.tuer, "chime", 0.4, 0]); }
      else E = [[T.ausv, "cash", 0.5, 0], [T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)], [T.hatte + 0.25, "shimmer_hi", 0.4, 0]];
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Ballons steigen langsam hinter dem Filmtitel, ruhiger Aufruf (wie gastro_end) ----------
  TYPES.baecker_end = {
    zone: "center", pal: "n_mag", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^landingpage/, E.sys, 1.6); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#05010d"); gr.addColorStop(1, "#1f0540"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.save(); g.globalAlpha = 0.45; for (let i = 0; i < 9; i++) { const yy = H + 200 - ((u * (60 + rnd(i) * 50) + i * 230) % (H + 500)); balloon(g, 120 + rnd(i * 3.3) * 840, yy, 0.8, BCOL[i % BCOL.length], null); } g.restore();
      SK.endTitle(g, u, d, T, { c: "#ffffff", glow: "rgba(255,43,214,0.9)", accent: "#00f0ff", sub: "#c9b8ff", key: "#b6ff00", offer: "LANDINGPAGE AB 99 € IM MONAT", y: 860, line: "und ich zeige Ihnen, wie das bei Ihnen aussieht." });
      const fi = 1 - cl(u / 0.3); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "whoosh_down", 0.45, 0], [T.sys, "boom", 0.5, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
