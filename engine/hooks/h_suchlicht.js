// VOICE_DELAY: 0.5
// h_suchlicht: Neugier-Geschichte (Look "brutal", Anti-Werbung). Nachts um zwei steht Herr Wendt auf dem Dach seines Ladens
// und schwenkt einen Suchscheinwerfer über den Himmel. Die Nachbarn glauben an Außerirdische, die Polizei fragt, wonach er sucht.
// Wendung: Er sucht eine Kundin, die um zwei gefragt hat, und niemand hat geantwortet. Bei „Denn der Laden hatte“ weißer Schnitt
// auf suchlicht_end (Filmtitel „Mihajlo Systems“, KI-Chatbot, Aufruf WEBSITE). Keine Technik im Bild vor dem Schnitt.
// Eine Geschichte in vier Einstellungen: h_suchlicht mit params.shot 1 bis 4 (jede Einstellung ist ein eigenes Segment).
// Wörter je Einstellung: 1 jede, nacht, zwei, steht, wendt, dach, suchscheinwerfer. 2 sucht, himmel, aus (außerirdische).
// 3 fragt, polizei, wonach. 4 sucht, kundin, gefragt, niemand, denn.
(() => {
  const OL = SK.OL, UP = -Math.PI / 2, LX = 660, LY = 742, ROOF = 880, ST = 1190;
  const K = (t, z, x, y) => ({ t, z, x, y });
  const WENDT = { hs: "short", hair: "#7a5a3a", beard: "#7a5a3a", glasses: true, shirt: "#3f7a5a", pants: "#2f4a7a", shoes: "#1e1e24", skin: "#efc29c" };
  const COP = { hs: "cap", hair: "#1f3a6e", shirt: "#2b3f6b", pants: "#1b2233", shoes: "#111116", skin: "#e0b48c" };
  const NB1 = { hs: "bun", hair: "#c9c9cf", glasses: true, shirt: "#e85d75", pants: "#33374a", skin: "#f1c7a1" };
  const NB2 = { hs: "short", hair: "#2b2b2b", shirt: "#f2b134", pants: "#3a3f48", skin: "#d9a07a" };
  const KUNDIN = { hs: "long", hair: "#b8452a", shirt: "#f4a6c0", skirt: "#2f6f8f", pants: "#f1c7a1", shoes: "#2f6f8f", skin: "#f3cfb0" };

  // Nachthimmel, Nachbarhäuser, Laden von Herrn Wendt, Straße, Laterne
  function night(g, u) {
    const sky = g.createLinearGradient(0, -700, 0, 1000); sky.addColorStop(0, "#04061a"); sky.addColorStop(0.7, "#17224c"); sky.addColorStop(1, "#33366a");
    g.fillStyle = sky; g.fillRect(-900, -900, 2900, 2800);
    for (let i = 0; i < 90; i++) circle(g, rnd(i * 2.7) * 1100 - 40, -300 + rnd(i * 4.9) * 1000, 1.2 + rnd(i) * 2.2, `rgba(255,255,255,${0.25 + 0.5 * (0.5 + 0.5 * Math.sin(u * 2 + i))})`);
    for (let i = -2; i < 7; i++) { const x = i * 230 - 60, w = 190 + rnd(i * 3.3) * 90, hh = 200 + rnd(i * 7.7) * 230, top = ROOF - hh;
      g.fillStyle = i % 2 ? "#0d1330" : "#121a3a"; g.fillRect(x, top, w, hh + 10);
      for (let r = 0; r < 9; r++) for (let c = 0; c < 2; c++) { const on = rnd(i * 31 + r * 3 + c) > 0.6; if (top + 30 + r * 42 < ROOF - 20) { g.fillStyle = on ? "rgba(255,206,130,0.75)" : "#0a0f25"; g.fillRect(x + 28 + c * (w - 76) / 2, top + 30 + r * 42, 34, 24); } } }
    g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#1e2650"; g.fillRect(820, 640, 400, 550); g.strokeRect(820, 640, 400, 550);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) { g.fillStyle = rnd(r * 7 + c * 3) > 0.5 ? "rgba(255,206,130,0.8)" : "#0c1230"; g.fillRect(860 + c * 120, 690 + r * 85, 60, 42); }
    // Laden: Dach, Schild, Schaufenster, Tür
    g.fillStyle = "#3a2a40"; g.fillRect(260, ROOF, 560, 310); g.strokeRect(260, ROOF, 560, 310);
    g.fillStyle = "#5a4560"; g.fillRect(240, ROOF - 24, 600, 26); g.strokeRect(240, ROOF - 24, 600, 26);
    g.fillStyle = "#101020"; rr(g, 300, 935, 480, 70, 10); g.fill(); g.stroke();
    g.font = "900 50px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffd34d"; g.fillText("SCHUHE WENDT", 540, 971);
    const lit = g.createLinearGradient(0, 1040, 0, 1170); lit.addColorStop(0, "#ffe2a0"); lit.addColorStop(1, "#f5b35a");
    g.fillStyle = lit; rr(g, 320, 1040, 230, 130, 10); g.fill(); g.stroke();
    g.fillStyle = "#1b1420"; rr(g, 600, 1040, 160, 150, 10); g.fill(); g.stroke();
    // Straße und Gehweg
    g.fillStyle = "#5b5f6e"; g.fillRect(-900, ST, 2900, 70); g.strokeRect(-900, ST, 2900, 70);
    g.fillStyle = "#262835"; g.fillRect(-900, ST + 70, 2900, 900);
    g.lineWidth = 12; g.beginPath(); g.moveTo(1010, ST); g.lineTo(1010, 700); g.stroke(); circle(g, 1010, 700, 26, "#ffe08a");
    const lg = g.createRadialGradient(1010, 700, 10, 1010, 700, 420); lg.addColorStop(0, "rgba(255,220,150,0.45)"); lg.addColorStop(1, "rgba(255,220,150,0)"); g.fillStyle = lg; g.fillRect(590, 280, 840, 840);
  }

  // Suchscheinwerfer auf dem Stativ, Strahl in Richtung a (Radiant), k = Stärke
  function light(g, u, a, k) {
    const ex = LX + Math.cos(a) * 1500, ey = LY + Math.sin(a) * 1500, px = -Math.sin(a) * 300, py = Math.cos(a) * 300;
    g.save(); g.globalCompositeOperation = "lighter";
    const gr = g.createLinearGradient(LX, LY, ex, ey); gr.addColorStop(0, `rgba(255,244,205,${0.62 * k})`); gr.addColorStop(0.6, `rgba(255,244,205,${0.2 * k})`); gr.addColorStop(1, "rgba(255,244,205,0)");
    g.fillStyle = gr; g.beginPath(); g.moveTo(LX, LY); g.lineTo(ex + px, ey + py); g.lineTo(ex - px, ey - py); g.closePath(); g.fill();
    const rg = g.createRadialGradient(LX, LY, 5, LX, LY, 150); rg.addColorStop(0, `rgba(255,250,225,${k})`); rg.addColorStop(1, "rgba(255,250,225,0)"); g.fillStyle = rg; g.fillRect(LX - 150, LY - 150, 300, 300);
    g.restore();
    g.save(); g.lineWidth = 9; g.strokeStyle = OL; g.beginPath(); g.moveTo(LX, ROOF); g.lineTo(LX, LY + 10); g.moveTo(LX - 46, ROOF); g.lineTo(LX, LY + 30); g.lineTo(LX + 46, ROOF); g.stroke();
    g.translate(LX, LY); g.rotate(a + Math.PI / 2); g.fillStyle = "#c9ced8"; rr(g, -44, -26, 88, 52, 12); g.fill(); g.stroke();
    g.fillStyle = "#fff6d6"; g.beginPath(); g.ellipse(0, -26, 34, 10, 0, 0, 7); g.fill(); g.stroke(); g.restore();
  }

  function wendt(g, u, o = {}) { SK.person(g, 470, ROOF, 0.9, { ...WENDT, bob: Math.sin(u * 2) * 2, mouth: o.mouth || "flat", eyes: o.eyes || "dot", aR: o.aR != null ? o.aR : -1.25, aL: o.aL != null ? o.aL : 1.1, brow: o.brow || 0, t: u }); }
  function nb(g, u, x, i) { SK.person(g, x, ST, 0.62, { ...(i ? NB2 : NB1), bob: Math.abs(Math.sin(u * 6 + i * 2)) * -26, mouth: "open", eyes: "wide", brow: 1, aL: -1.5, aR: -1.35, t: u }); }
  function cop(g, u, x, walk) { SK.person(g, x, ST, 0.66, { ...COP, walk, mouth: "flat", eyes: "side", aR: -1.4, aL: 0.5, t: u }); }
  function kundin(g, u, x) { SK.person(g, x, ST, 0.62, { ...KUNDIN, mouth: "flat", eyes: "dot", aR: -1.15, aL: 0.25, t: u,
    hold: (q, h) => { q.save(); q.fillStyle = "#fffdf5"; q.lineWidth = 8; rr(q, h[0] - 150, h[1] - 170, 300, 130, 14); q.fill(); q.stroke();
      q.fillStyle = "#e5243b"; q.font = "900 70px D"; q.textAlign = "center"; q.textBaseline = "middle"; q.fillText("OFFEN?", h[0], h[1] - 105); q.restore(); } }); }

  TYPES.h_suchlicht = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 1.6, capY: 1560,
    prep(o, p) { const f = SK.finder(o); const T = {}; const sh = Number(p.shot) || 1; p._sh = sh;
      const seqT = (pats) => { let t = 0; pats.forEach(([k, re]) => { const x = f(re, t, t + 0.5); T[k] = x; t = x + 0.05; }); };
      if (sh === 1) seqT([["jede", /^jede/], ["zwei", /^zwei$/], ["steht", /^steht/], ["wendt", /^wendt/], ["dach", /^dach/], ["such", /^suchscheinwerfer/]]);
      if (sh === 2) seqT([["sucht", /^sucht/], ["himmel", /^himmel/], ["aus", /^außerirdische/]]);
      if (sh === 3) seqT([["fragt", /^fragt/], ["pol", /^polizei/], ["wonach", /^wonach/]]);
      if (sh === 4) seqT([["sucht", /^sucht/], ["kundin", /^kundin/], ["gefragt", /^gefragt/], ["niemand", /^niemand/], ["denn", /^denn/]]);
      p._T = T; },
    draw(g, u, d, p) {
      const T = p._T, sh = p._sh; const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      if (sh === 1) { // Einstieg: Laden, Mann auf dem Dach, der Strahl kreist
        const c = SK.cam([K(0, 0.95, 540, 860), K(T.dach, 0.98, 540, 850), K(d, 1.02, 540, 840)], u); // Kopf unter dem Hook-Text (y 200 bis 430)
        g.save(); SK.apply(g, c); night(g, u); light(g, u, UP + 0.5 * Math.sin(u * 2.4) + 0.2 * Math.sin(u * 0.9), 1); wendt(g, u); g.restore();
      } else if (sh === 2) { // Himmel wird abgesucht, Nachbarn schreien
        const c = SK.cam([K(0, 0.86, 540, 1000), K(T.aus, 0.9, 520, 990), K(d, 0.92, 540, 980)], u);
        g.save(); SK.apply(g, c); night(g, u); light(g, u, UP + 0.95 * Math.sin(u * 3.2), 1);
        wendt(g, u, { mouth: "shout", aR: -1.1 + 0.3 * Math.sin(u * 8) }); nb(g, u, 230, 0); nb(g, u, 980, 1); g.restore();
        const [tx, ty] = SK.toScreen(c, 230, 880); SK.bubble(g, ["Außerirdische?!"], 300, 560, tx, ty, win(T.aus - 0.2, d - 0.15), { shout: true, px: 50 });
      } else if (sh === 3) { // Polizist kommt von links und fragt
        const wk = seg(u, 0, 1.0), cx = lerp(-160, 300, inOut(wk));
        const c = SK.cam([K(0, 0.9, 520, 1010), K(T.pol, 0.98, 500, 1000), K(d, 1.0, 480, 980)], u);
        g.save(); SK.apply(g, c); night(g, u); light(g, u, UP + 0.4 * Math.sin(u * 1.7), 1);
        wendt(g, u, { aR: -1.5, eyes: "wide" }); cop(g, u, cx, wk < 1 ? u * 11 : undefined); g.restore();
        const [tx, ty] = SK.toScreen(c, 470, 470);
        SK.bubble(g, ["Wonach suchen", "Sie denn?"], 330, 640, tx, ty, win(T.wonach - 0.15, d - 0.1), { px: 46 });
      } else { // Wendung: der Strahl findet die Kundin, sie hält ein Schild hoch, dann weißer Schnitt
        const c = SK.cam([K(0, 0.95, 560, 990), K(T.kundin - 0.1, 1.05, 640, 1010), K(T.gefragt, 1.0, 640, 1000), K(d, 1.12, 600, 1000)], u);
        const sweep = UP + 0.6 * Math.sin(u * 3), tg = Math.atan2(1000 - LY, 780 - LX), k = inOut(seg(u, T.kundin - 0.25, T.kundin + 0.5));
        const a = lerp(sweep, tg, k) + (k >= 1 ? 0.03 * Math.sin(u * 30) : 0);
        g.save(); SK.apply(g, c); night(g, u); light(g, u, a, 1);
        wendt(g, u, { eyes: u > T.niemand ? "side" : "dot" }); kundin(g, u, 780); g.restore();
        const [tx, ty] = SK.toScreen(c, 780, 880); SK.bubble(g, ["Haben Sie", "*nachts* offen?"], 680, 540, tx, ty, win(T.gefragt, d + 1), { px: 46 });
        const [hx, hy] = SK.toScreen(c, 470, 420); SK.qmarks(g, hx, hy - 220, u, seg(u, T.niemand, T.niemand + 0.4) * (1 - seg(u, T.denn - 0.1, T.denn)));
        SK.whiteOut(g, u, d);
      }
    },
    ev(d, p) { const T = p._T, sh = p._sh, E = [];
      if (sh === 1) E.push([0, "chime", 0.55, 0], [0.02, "whoosh_down", 0.3, 0], [T.such, "ding", 0.4, 0.3]);
      if (sh === 2) E.push([0, "whoosh_side", 0.35, 0], [T.aus, "pop", 0.5, -0.2], [T.aus + 0.3, "pop", 0.35, 0.2]);
      if (sh === 3) E.push([0, "vsteps", 0.35, -0.3], [T.wonach, "pop", 0.45, 0.2]);
      if (sh === 4) E.push([T.kundin - 0.2, "shimmer", 0.3, 0], [T.gefragt, "ding", 0.4, 0], [T.denn - 0.4, "riser", 0.6, 0, Math.max(0.3, d - T.denn + 0.4)], [d - 0.16, "thump", 0.6, 0]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Filmtitel aus der Unschärfe, Suchstrahl wandert unten über das Bild ----------
  TYPES.suchlicht_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/chatbot/, E.sys, 1.6); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#04061a"); bg.addColorStop(1, "#15204a"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 60; i++) circle(g, rnd(i * 3.3) * W, rnd(i * 6.1) * 1300, 1 + rnd(i) * 2, `rgba(255,255,255,${0.2 + 0.4 * (0.5 + 0.5 * Math.sin(u * 2 + i))})`);
      const a = -Math.PI / 2 + 0.7 * Math.sin(u * 1.1), ox = 540, oy = 2050, ex = ox + Math.cos(a) * 2400, ey = oy + Math.sin(a) * 2400, px = -Math.sin(a) * 380, py = Math.cos(a) * 380;
      g.save(); g.globalCompositeOperation = "lighter"; const bgr = g.createLinearGradient(ox, oy, ex, ey); bgr.addColorStop(0, "rgba(255,240,200,0.30)"); bgr.addColorStop(1, "rgba(255,240,200,0)");
      g.fillStyle = bgr; g.beginPath(); g.moveTo(ox, oy); g.lineTo(ex + px, ey + py); g.lineTo(ex - px, ey - py); g.closePath(); g.fill(); g.restore();
      SK.endTitle(g, u, d, T, { c: "#f4ead2", glow: "rgba(255,214,140,0.55)", accent: "#ffcf5a", sub: "#c9b98f", key: "#ffcf5a", offer: "KI-CHATBOT FÜR DIE NACHT", y: 860, line: "einzeln für 200, 350 oder 500 Euro einmalig." });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); } // weißer Schnitt aus der Wendung
    },
    ev(d, p) { const T = p._T; return [[0.0, "whoosh_down", 0.35, 0], [0.1, "shimmer", 0.3, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
