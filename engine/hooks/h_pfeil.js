// VOICE_DELAY: 0.45
// h_pfeil: Neugier-Geschichte (Look "story", Anti-Werbung). Ein riesiger Holzpfeil knallt aufs Dach einer Tischlerei (BAM),
// Maßlinie „12 m“, der Pfeil zeigt auf die Tür. Nachbarn lachen (HAHA), Autos fahren vorbei. Lichterkette, dann Luftballons. Nichts.
// Eine Woche später: Pfeil weg, Hof voller Autos und Kunden. Nachbarin: „Wo ist Ihr Pfeil?“ Er zwinkert. Bei „Den“ taucht die
// Kamera in sein Zwinkern, Weiß. Danach pfeil_end.
// Wörter: zwölf, dach, findet, nachbarn, lachen, kunden, vorbei, lichter, luftballons, nichts, woche, weg, hof, autos, nachbarin, zwinkert, den.
(() => {
  const OL = SK.OL;
  const JONAS = { hs: "short", hair: "#7a4a2a", beard: "#7a4a2a", shirt: "#2f6f8f", apron: "#8a5a3a", pants: "#3a3f48", shoes: "#4a3426", skin: "#efc29c" };
  const NACHB = { hs: "bun", hair: "#c9c9cf", glasses: true, shirt: "#8e5bd6", skirt: "#5b3a6e", pants: "#f1c7a1", skin: "#f3cfb0" };
  const CARC = ["#e5243b", "#2f6f8f", "#f2b134", "#3d9a6b", "#8e5bd6", "#e0703a", "#5b6ee1", "#c9ced8"];

  function car(g, x, y, s, c, flip, blur = 0) { g.save(); g.translate(x, y); g.scale(s * (flip ? -1 : 1), s); g.lineWidth = 8; g.strokeStyle = OL;
    if (blur > 0) for (let i = 1; i < 5; i++) { g.fillStyle = `rgba(255,255,255,${0.12 * blur})`; g.fillRect(-150 - i * 50, -120, 300, 90); }
    g.fillStyle = c; g.beginPath(); g.moveTo(-160, -40); g.lineTo(-150, -100); g.lineTo(-80, -110); g.lineTo(-40, -170); g.lineTo(80, -170); g.lineTo(120, -110); g.lineTo(165, -95); g.lineTo(170, -40); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#bfe3ff"; g.beginPath(); g.moveTo(-30, -158); g.lineTo(20, -158); g.lineTo(20, -112); g.lineTo(-62, -112); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(34, -158); g.lineTo(74, -158); g.lineTo(104, -112); g.lineTo(34, -112); g.closePath(); g.fill(); g.stroke();
    for (const wx of [-95, 100]) { circle(g, wx, -40, 38, "#1e1e24"); g.stroke(); circle(g, wx, -40, 16, "#c9ced8"); } g.fillStyle = "#ffe08a"; rr(g, 150, -92, 20, 18, 5); g.fill(); g.restore(); }
  function workshop(g, u, o) { // o: arrow 0..1 (gelandet), drop (y-Versatz beim Aufprall), lights, balloons, gone, busy
    g.lineWidth = 8; g.strokeStyle = OL;
    const sky = g.createLinearGradient(0, -1200, 0, 900); sky.addColorStop(0, "#5fb2ec"); sky.addColorStop(1, "#d8f0ff"); g.fillStyle = sky; g.fillRect(-1500, -1600, 3800, 2600);
    for (let i = 0; i < 5; i++) { const cx = ((i * 520 + u * 30) % 2600) - 900, cy = -900 + i * 210; g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(cx, cy, 60, 0, 7); g.arc(cx + 70, cy - 20, 80, 0, 7); g.arc(cx + 150, cy, 56, 0, 7); g.fill(); }
    // Nachbarhaus links mit Fenster
    g.fillStyle = "#e9c46a"; g.fillRect(-700, 300, 760, 840); g.strokeRect(-700, 300, 760, 840); g.fillStyle = "#b5651d"; g.beginPath(); g.moveTo(-740, 310); g.lineTo(-320, 60); g.lineTo(100, 310); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = "#bfe3ff"; rr(g, -380, 470, 300, 240, 10); g.fill(); g.stroke(); if (o.win) o.win(g);
    g.strokeStyle = OL; g.fillStyle = "#ffffff"; rr(g, -390, 700, 320, 24, 6); g.fill(); g.stroke();
    // Werkstatt
    g.fillStyle = "#c98a5a"; g.fillRect(100, 520, 900, 620); g.strokeRect(100, 520, 900, 620); g.strokeStyle = "rgba(43,29,20,0.35)"; g.lineWidth = 4; for (let x = 140; x < 1000; x += 46) { g.beginPath(); g.moveTo(x, 525); g.lineTo(x, 1135); g.stroke(); } g.lineWidth = 8; g.strokeStyle = OL;
    g.fillStyle = "#6b3e26"; g.beginPath(); g.moveTo(60, 530); g.lineTo(550, 300); g.lineTo(1040, 530); g.closePath(); g.fill(); g.stroke();
    fillRR(g, 240, 560, 620, 100, 12, "#2b1d14"); g.strokeStyle = OL; rr(g, 240, 560, 620, 100, 12); g.stroke(); g.font = "900 54px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#f6d58a"; g.fillText("TISCHLEREI JONAS", 550, 612);
    g.fillStyle = "#3d2a1e"; g.fillRect(560, 760, 280, 380); g.strokeRect(560, 760, 280, 380); g.fillStyle = "#8a5a3a"; g.fillRect(575, 775, 120, 365); g.fillRect(705, 775, 120, 365); g.strokeRect(575, 775, 120, 365); g.strokeRect(705, 775, 120, 365);
    g.fillStyle = "#bfe3ff"; rr(g, 170, 760, 300, 220, 10); g.fill(); g.stroke(); g.beginPath(); g.moveTo(320, 760); g.lineTo(320, 980); g.stroke();
    // Mast und Pfeil
    if (!o.gone) { const k = o.arrow, dy = o.drop || 0;
      g.save(); g.translate(0, dy); g.fillStyle = "#8a5a3a"; g.fillRect(760, -700, 34, 1190 * k + 10); g.strokeRect(760, -700, 34, 1190 * k + 10); g.restore();
      if (k > 0) { g.save(); g.translate(777, -700 + dy); g.rotate(1.95); // zeigt nach unten zur Tür
        g.fillStyle = "#e5243b"; g.beginPath(); g.moveTo(-60, -70); g.lineTo(420, -70); g.lineTo(420, -150); g.lineTo(620, 0); g.lineTo(420, 150); g.lineTo(420, 70); g.lineTo(-60, 70); g.closePath(); g.fill(); g.stroke();
        g.save(); g.rotate(Math.PI); g.font = "900 96px D"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("HIER!", -230, 4); g.restore();
        if (o.lights > 0) for (let i = 0; i < 16; i++) { const t = i / 15; const px = lerp(-50, 600, t), py = i % 2 ? -78 : 78; const on = (Math.floor(u * 6) + i) % 3 !== 0; circle(g, px, py, 14, on ? `rgba(255,224,120,${o.lights})` : `rgba(120,90,40,${o.lights})`); if (on) circle(g, px, py, 26, `rgba(255,224,120,${0.25 * o.lights})`); }
        g.restore(); }
      if (o.balloons > 0) for (let i = 0; i < 7; i++) { const e = outBack(cl(o.balloons * 2 - i * 0.12), 2); if (e <= 0) continue; const bx = 777 + (i - 3) * 70 + Math.sin(u * 2 + i) * 14, by = -930 - Math.abs(i - 3) * 40 + Math.cos(u * 1.7 + i) * 12;
        g.strokeStyle = OL; g.lineWidth = 3; g.beginPath(); g.moveTo(777, -700 + dy); g.lineTo(bx, by + 60 * e); g.stroke(); g.lineWidth = 6; g.fillStyle = CARC[i]; g.beginPath(); g.ellipse(bx, by, 48 * e, 60 * e, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.ellipse(bx - 16 * e, by - 22 * e, 10 * e, 16 * e, -0.4, 0, 7); g.fill(); }
    } else { g.fillStyle = "#8a5a3a"; g.fillRect(760, 380, 34, 110); g.strokeRect(760, 380, 34, 110); }
    // Hof und Straße
    g.fillStyle = "#cfc6b8"; g.fillRect(-1500, 1140, 3800, 130); g.strokeRect(-1500, 1140, 3800, 130); g.fillStyle = "#4a4e57"; g.fillRect(-1500, 1270, 3800, 900);
    g.fillStyle = "rgba(255,255,255,0.55)"; for (let i = -10; i < 20; i++) g.fillRect(i * 220, 1420, 120, 14);
  }

  TYPES.h_pfeil = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 0.55, capY: 1560,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.zwoelf = f(/^zwölf|^12$/, 0, 1.0); T.dach = f(/^dach/, T.zwoelf, T.zwoelf + 1.0); T.findet = f(/^findet/, T.dach, T.dach + 1.2); T.nachb = f(/^nachbarn$/, T.findet, T.findet + 0.6);
      T.lachen = f(/^lachen/, T.nachb, T.nachb + 0.5); T.kunden = f(/^kunden/, T.lachen, T.lachen + 0.5); T.vorbei = f(/^vorbei/, T.kunden, T.kunden + 0.6); T.lichter = f(/^lichter/, T.vorbei, T.vorbei + 0.9);
      T.ballon = f(/^luftballons/, T.lichter, T.lichter + 0.9); T.nichts = f(/^nichts/, T.ballon, T.ballon + 0.9); T.woche = f(/^woche/, T.nichts, T.nichts + 1.2); T.weg = f(/^weg/, T.woche, T.woche + 0.9);
      T.hof = f(/^hof/, T.weg, T.weg + 0.6); T.autos = f(/^autos/, T.hof, T.hof + 0.8); T.nachbin = f(/^nachbarin/, T.autos, T.autos + 0.9); T.pfeil2 = f(/^pfeil/, T.nachbin, T.nachbin + 1.0);
      T.zwink = f(/^zwinkert|^zwingert/, T.pfeil2, T.pfeil2 + 0.7); T.den = f(/^den$/, T.zwink, T.zwink + 0.6); T.eine = f(/^eine$/, T.nichts, T.woche - 0.3);
      T.bB = T.nachb - 0.35; T.bC = T.lichter - 0.3; T.bD = T.eine - 0.12; T.bE = T.nachbin - 0.3; p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const ph = u < T.bB ? 0 : u < T.bC ? 1 : u < T.bD ? 2 : u < T.bE ? 3 : 4; const K = (t, z, x, y) => ({ t, z, x, y });
      const KF = ph === 0 ? [K(0, 1.0, 620, 60), K(0.6, 1.05, 620, 120), K(T.zwoelf + 0.1, 0.62, 500, -60), K(T.findet - 0.2, 0.68, 500, 120), K(T.bB, 0.8, 520, 520)]
        : ph === 1 ? [K(T.bB, 0.8, 220, 700), K(T.lachen + 0.3, 0.95, 60, 640), K(T.kunden - 0.1, 0.85, 400, 860), K(T.bC, 0.85, 420, 880)]
        : ph === 2 ? [K(T.bC, 0.66, 560, 120), K(T.ballon + 0.2, 0.6, 600, -80), K(T.nichts - 0.1, 0.72, 520, 380), K(T.bD, 0.74, 520, 420)]
        : ph === 3 ? [K(T.bD, 0.72, 520, 480), K(T.autos, 0.85, 560, 760), K(T.bE, 0.9, 560, 780)]
        : [K(T.bE, 1.25, 180, 820), K(T.zwink - 0.2, 1.4, 470, 830), K(T.den, 2.3, 640, 700)];
      const c = SK.cam(KF, u); const land = 0.14; const hit = u - land; const shake = hit > 0 && hit < 0.4 ? 1 - hit / 0.4 : 0;
      const dive = ph === 4 ? inExpo(cl((u - T.den) / Math.max(0.3, d - T.den))) : 0; if (dive > 0) { c.z *= 1 + dive * 28; const k = inOut(cl((u - T.den) / 0.3)); c.x = lerp(c.x, 656, k); c.y = lerp(c.y, 797, k); }
      g.save(); SK.apply(g, c, Math.sin(u * 90) * 22 * shake, Math.cos(u * 77) * 16 * shake);
      const arrow = ph === 0 ? out3(cl(u / land)) : 1, drop = ph === 0 ? (u < land ? -600 * (1 - u / land) : -Math.sin(Math.min(1, hit / 0.25) * Math.PI) * 30) : 0;
      const laugh = ph === 1 ? seg(u, T.lachen - 0.2, T.lachen + 0.1) : 0;
      const win = (q) => { if (ph !== 1 && ph !== 4) return; for (let i = 0; i < 2; i++) { q.save(); q.beginPath(); q.rect(-380, 470, 300, 240); q.clip();
          SK.person(q, -300 + i * 150, 900, 0.5, { hs: i ? "long" : "cap", hair: i ? "#c98d3a" : "#3d9a6b", shirt: i ? "#e85d75" : "#f2b134", eyes: laugh > 0.5 ? "happy" : "dot", mouth: laugh > 0.5 ? "grin" : "smile", bob: laugh > 0.5 ? Math.abs(Math.sin(u * 14 + i)) * -14 : 0, aR: laugh > 0.5 ? -1.0 : 1.2, eR: laugh > 0.5 ? -1.2 : 0 }); q.restore(); } };
      workshop(g, u, { arrow, drop, lights: ph >= 2 ? seg(u, T.lichter - 0.1, T.lichter + 0.2) : 0, balloons: ph === 2 ? seg(u, T.ballon - 0.15, T.ballon + 0.5) : 0, gone: ph >= 3, win: ph === 1 ? win : null });
      if (ph <= 2) { // Jonas auf dem Dach oder davor
        if (ph === 0) SK.person(g, 330, 420, 0.45, { ...JONAS, aR: -0.9 + Math.sin(u * 12) * 0.5, eR: -0.6, mouth: "grin", eyes: "happy" });
        else SK.person(g, 450, 1140, 0.62, { ...JONAS, aR: ph === 1 ? -0.9 + Math.sin(u * 8) * 0.6 : 1.2, eR: ph === 1 ? -0.4 : 0, mouth: ph === 2 && u > T.nichts - 0.1 ? "sad" : "smile", eyes: "dot", brow: ph === 2 && u > T.nichts - 0.1 ? -1 : 0, look: ph === 1 ? 0.8 : 0 });
      }
      if (ph === 1 || ph === 2) { const sp = ph === 1 ? 2200 : 900; const n = ph === 1 ? 4 : 1; for (let i = 0; i < n; i++) { const t0 = (ph === 1 ? T.kunden - 0.4 : T.nichts - 0.6) + i * 0.35, k = u - t0; if (k < 0) continue; const x = -900 + k * sp; if (x > 2200) continue; car(g, x, 1350, 0.9, CARC[(i * 3 + 1) % 8], false, ph === 1 ? 1 : 0); } }
      if (ph >= 3) { // Hof voller Autos und Kunden
        const kk = (i) => outBack(seg(u, T.autos - 0.4 + i * 0.09, T.autos - 0.15 + i * 0.09), 1.6);
        for (let i = 0; i < 6; i++) { const e = ph === 4 ? 1 : kk(i); if (e <= 0.02) continue; g.save(); g.globalAlpha = cl(e * 2); car(g, -520 + i * 330, 1300 + (i % 2) * 40 + (1 - e) * -300, 0.82, CARC[i], i % 2 === 1); g.restore(); }
        for (let i = 0; i < 3; i++) SK.person(g, 600 + i * 120, 1140, 0.5, { shirt: CARC[i + 3], hs: ["long", "short", "bun"][i], hair: ["#5b3a23", "#1e1a18", "#c98d3a"][i], mouth: "smile", eyes: "happy", flip: i === 1 });
        const jb = ph === 4; SK.person(g, jb ? 640 : 470, 1140, 0.62, { ...JONAS, aR: jb ? 1.2 : 0.2, eR: jb ? 0 : -1.2, mouth: jb && u > T.zwink - 0.1 ? "grin" : "smile", eyes: jb && u > T.zwink - 0.1 ? "wink" : "happy", flip: jb,
          hold: jb ? null : (q, h) => { q.fillStyle = "#d9a36a"; q.strokeStyle = OL; q.lineWidth = 6; rr(q, h[0] - 10, h[1] - 120, 26, 200, 6); q.fill(); q.stroke(); } });
        if (ph === 4) SK.person(g, 240, 1140, 0.6, { ...NACHB, aR: -0.5, eR: -0.9, mouth: "o", eyes: "wide", look: 0.6 });
      }
      g.restore();
      if (ph === 0) { // Maßlinie 12 m
        const mk = seg(u, T.zwoelf - 0.2, T.zwoelf + 0.25) * (1 - seg(u, T.findet - 0.3, T.findet)); if (mk > 0) { const [x0, y0] = SK.toScreen(c, 900, 490), [x1, y1] = SK.toScreen(c, 900, -760); g.save(); g.globalAlpha = mk; g.strokeStyle = "#ffffff"; g.lineWidth = 6; g.setLineDash([16, 12]); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x0, lerp(y0, y1, out3(mk))); g.stroke(); g.setLineDash([]);
          g.font = "900 120px D"; g.textAlign = "left"; g.textBaseline = "middle"; g.lineWidth = 14; g.strokeStyle = OL; g.strokeText("12 m", x0 + 30, (y0 + y1) / 2); g.fillStyle = "#ffd34d"; g.fillText("12 m", x0 + 30, (y0 + y1) / 2); g.restore(); }
        const [px, py] = SK.toScreen(c, 777, 300); SK.pow(g, "BAM!", px, py - 120, (u - land) / 0.8, { px: 170, rot: -0.15 });
        if (hit > 0 && hit < 0.6) for (let i = 0; i < 14; i++) { const a = Math.PI + rnd(i * 3.1) * Math.PI, r = hit * (300 + rnd(i) * 300); circle(g, px + Math.cos(a) * r, py + Math.sin(a) * r * 0.5 + 60, 18 * (1 - hit / 0.6), "rgba(160,120,80,0.7)"); }
      }
      const win2 = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      if (ph === 1) { SK.pow(g, "HAHA!", 330, 470, (u - T.lachen + 0.1) / 1.1, { px: 110, rot: -0.12, c: "#ff8ab0" }); SK.pow(g, "HAHAHA!", 560, 300, (u - T.lachen - 0.15) / 1.1, { px: 90, rot: 0.1, c: "#ffd34d" }); }
      if (ph === 2) SK.pow(g, "…nichts.", 540, 640, (u - T.nichts + 0.05) / 1.3, { px: 120, rot: 0, c: "#d9dde5" });
      if (ph === 3) { const tk = seg(u, T.bD + 0.02, T.bD + 0.3) * (1 - seg(u, T.hof - 0.2, T.hof)); if (tk > 0) { g.save(); g.globalAlpha = tk; g.translate(540, 360); g.rotate(-0.04); fillRR(g, -330, -70, 660, 140, 10, "#ffd34d"); g.lineWidth = 8; g.strokeStyle = OL; rr(g, -330, -70, 660, 140, 10); g.stroke(); g.font = "900 64px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = OL; g.fillText("1 WOCHE SPÄTER", 0, 4); g.restore(); } }
      if (ph === 4) { const [nx, ny] = SK.toScreen(c, 240, 800), [jx, jy] = SK.toScreen(c, 640, 800);
        SK.bubble(g, ["Wo ist", "Ihr *Pfeil*?"], 330, 430, nx + 10, ny, win2(T.nachbin + 0.1, T.zwink + 0.2) * (1 - dive * 5), { px: 54 });
        if (u > T.zwink - 0.15) { const sk = seg(u, T.zwink - 0.1, T.zwink + 0.2); sparkles(g, jx + 20, jy - 50, u, 6, 90, "#ffe9a8", 9); SK.pow(g, "✦", jx + 70, jy - 40, sk * 0.6 + 0.05, { px: 90, c: "#ffe9a8" }); } }
      SK.flashAt(g, u, [T.bB, T.bC, T.bD, T.bE], 0.08, 0.55);
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T, E = [[0.0, "whoosh_down", 0.6, 0], [0.14, "domino_thud", 0.9, 0], [0.15, "boom", 0.55, 0], [0.18, "slap", 0.5, 0], [0.5, "domino_dust", 0.4, 0]];
      for (let t = 0.7; t < T.zwoelf - 0.3; t += 0.3) E.push([t, "tr_clonk", 0.25, -0.2]); E.push([T.zwoelf - 0.15, "tr_swish", 0.35, 0], [T.zwoelf + 0.1, "pop", 0.4, 0.3], [T.findet - 0.1, "whoosh_down", 0.3, 0]);
      E.push([T.bB, "whoosh_side", 0.3, 0], [T.lachen - 0.1, "pop", 0.35, -0.3], [T.lachen + 0.15, "pop", 0.35, 0.2]); for (let i = 0; i < 4; i++) E.push([T.kunden - 0.4 + i * 0.35 + 0.35, "whoosh_side", 0.45, -0.5 + i * 0.3]);
      E.push([T.lichter - 0.05, "ls_click", 0.5, 0], [T.lichter + 0.05, "shimmer_hi", 0.3, 0]); for (let i = 0; i < 4; i++) E.push([T.ballon - 0.1 + i * 0.1, "balloon_squeak" + (1 + i % 3), 0.3, -0.4 + i * 0.25]);
      E.push([T.nichts - 0.05, "vsad", 0.4, 0], [T.nichts + 0.1, "whoosh_side", 0.25, 0.5]);
      E.push([T.bD, "rc_tear", 0.4, 0], [T.bD + 0.05, "pop", 0.35, 0]); for (let i = 0; i < 6; i++) E.push([T.autos - 0.35 + i * 0.09, "tr_land", 0.25, -0.6 + i * 0.25]); E.push([T.autos, "shimmer", 0.3, 0]);
      E.push([T.bE - 0.05, "whoosh_side", 0.3, 0], [T.nachbin + 0.1, "pop", 0.4, -0.3], [T.zwink - 0.1, "ding", 0.45, 0.2], [T.den, "riser", 0.6, 0, Math.max(0.3, d - T.den)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Pfeil knallt auf den Filmtitel, Landkarten-Papier ----------
  TYPES.pfeil_end = {
    zone: "center", pal: "o_cream", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^google/, E.sys, 1.6); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      g.fillStyle = "#f3ead9"; g.fillRect(0, 0, W, H);
      g.save(); g.globalAlpha = 0.5; g.strokeStyle = "#d8c8a8"; g.lineWidth = 3; for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(-50, 120 + i * 140 + Math.sin(i) * 40); g.bezierCurveTo(300, 60 + i * 140, 700, 200 + i * 140, 1130, 100 + i * 140); g.stroke(); }
      g.strokeStyle = "#cdb88f"; g.lineWidth = 16; g.beginPath(); g.moveTo(-50, 1080); g.bezierCurveTo(300, 1000, 640, 1180, 1130, 1040); g.stroke(); g.beginPath(); g.moveTo(760, -50); g.bezierCurveTo(700, 500, 860, 900, 720, 1970); g.stroke(); g.restore();
      // Pfeil fällt und steckt über dem Titel
      const fall = cl(u / 0.35), hit = u - 0.35; const ay = lerp(-700, 560, in3(fall)) + (hit > 0 && hit < 0.3 ? -Math.sin(hit / 0.3 * Math.PI) * 20 : 0);
      g.save(); g.translate(540, ay); g.rotate(Math.PI / 2); g.lineWidth = 8; g.strokeStyle = SK.OL; g.fillStyle = "#e5243b"; g.beginPath(); g.moveTo(-260, -40); g.lineTo(-20, -40); g.lineTo(-20, -90); g.lineTo(100, 0); g.lineTo(-20, 90); g.lineTo(-20, 40); g.lineTo(-260, 40); g.closePath(); g.fill(); g.stroke(); g.restore();
      if (hit > 0 && hit < 0.6) shock(g, 540, 680, hit / 0.6, "rgba(229,36,59,A)", 300, 2);
      SK.endTitle(g, u, d, T, { c: "#2b1d14", glow: "rgba(0,0,0,0)", accent: "#e5243b", sub: "#5c4a3a", key: "#e5243b", offer: "WEBSITE + GOOGLE MAPS EINTRAG", y: 860, line: "und ich zeige Ihnen, wie man Sie besser findet." });
      const fi = 1 - cl(u / 0.3); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "whoosh_down", 0.45, 0], [0.35, "domino_thud", 0.8, 0], [0.36, "boom", 0.4, 0], [0.6, "shimmer", 0.3, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
