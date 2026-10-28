// VOICE_DELAY: 0.45
// h_salon: Neugier-Geschichte (Look "story", Anti-Werbung). Samstag, sechs Uhr, Regen: zwölf Leute stehen mit Klappstühlen vor dem
// Friseursalon. Um neun geht die Tür auf, Streit (Sprechblasen). Eine Woche später ist die Straße leer, nur Herr Krause wartet.
// Um Punkt neun kommt eine Kundin und geht einfach rein. Herr Krause versteht die Welt nicht mehr (Fragezeichen).
// Bei „Denn“ taucht die Kamera in das Türschild OFFEN, Weiß. Danach salon_end (Goldschrift auf der Scheibe, kein Neon).
// Wörter: sechs, friseursalon, regen, klappstühlen, neun, streit, dann, leer, krause, allein, punkt, kundin, rein, herr, versteht, denn.
(() => {
  const OL = SK.OL;
  const SHIRTS = ["#e85d75", "#4b7fd6", "#f2b134", "#3d9a6b", "#8e5bd6", "#e0703a", "#2f6f8f", "#c44569", "#6aa84f", "#d9a441", "#5b6ee1", "#b04a3a"];
  const HAIRS = ["#5b3a23", "#1e1a18", "#c98d3a", "#7a4a2a", "#2b2b2b", "#a0522d"];
  const HS = ["short", "long", "bun", "short", "cap", "long", "short", "grey", "bun", "short", "long", "cap"];
  const KRAUSE = { hs: "grey", hair: "#d9d9de", glasses: true, shirt: "#9a6b3f", pants: "#c9b48a", shoes: "#4a3426", skin: "#f0c4a0" };
  const QX = (i) => 740 - i * 92;

  function clock(g, x, y, hr) { g.save(); g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#3a3f48"; g.fillRect(x - 9, y + 70, 18, 1140 - y - 70); g.strokeRect(x - 9, y + 70, 18, 1140 - y - 70);
    g.fillStyle = "#2f343c"; g.beginPath(); g.arc(x, y, 88, 0, 7); g.fill(); g.stroke(); g.fillStyle = "#fbf6e8"; g.beginPath(); g.arc(x, y, 72, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OL; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.beginPath(); g.arc(x + Math.sin(a) * 58, y - Math.cos(a) * 58, i % 3 ? 3 : 6, 0, 7); g.fill(); }
    const ha = (hr % 12) / 12 * Math.PI * 2, ma = (hr % 1) * Math.PI * 2; g.lineCap = "round"; g.lineWidth = 9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ha) * 36, y - Math.cos(ha) * 36); g.stroke();
    g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ma) * 56, y - Math.cos(ma) * 56); g.stroke(); g.fillStyle = "#e5243b"; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); g.restore(); }

  function street(g, u, o) { // o: rain, open 0..1, sign (0 = GESCHLOSSEN, 1 = OFFEN), hr, sun 0..1, inside (Funktion: Person in der Tür)
    // Himmel
    const sky = g.createLinearGradient(0, -500, 0, 300); sky.addColorStop(0, mixS("#1d2742", "#7cc4f0", o.sun)); sky.addColorStop(1, mixS("#4a5a86", "#ffe6b8", o.sun)); g.fillStyle = sky; g.fillRect(-1200, -900, 3600, 1300);
    if (o.sun > 0) { g.fillStyle = `rgba(255,233,160,${o.sun})`; g.beginPath(); g.arc(-220, -120, 90, 0, 7); g.fill(); }
    // Nachbarhaus links und rechts
    g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = mixS("#8a5a4a", "#c98a6a", o.sun); g.fillRect(-1200, 160, 1560, 980); g.strokeRect(-1200, 160, 1560, 980);
    g.fillStyle = "rgba(0,0,0,0.08)"; for (let r = 0; r < 24; r++) for (let c = 0; c < 22; c++) if ((r + c) % 3 === 0) g.fillRect(-1200 + c * 72 + (r % 2) * 36, 170 + r * 40, 64, 30);
    for (let i = 0; i < 3; i++) { const wx = -1060 + i * 420; g.fillStyle = mixS("#2b3655", "#bfe3ff", o.sun); rr(g, wx, 330, 200, 240, 10); g.fill(); g.stroke(); g.beginPath(); g.moveTo(wx + 100, 330); g.lineTo(wx + 100, 570); g.moveTo(wx, 450); g.lineTo(wx + 200, 450); g.stroke(); }
    g.fillStyle = mixS("#5d6a7a", "#9fb3c8", o.sun); g.fillRect(1060, 160, 900, 980); g.strokeRect(1060, 160, 900, 980);
    // Salon
    g.fillStyle = mixS("#e9d6c0", "#fff1e0", o.sun); g.fillRect(360, 160, 700, 980); g.strokeRect(360, 160, 700, 980);
    fillRR(g, 400, 440, 620, 120, 16, "#1f2a44"); g.strokeStyle = OL; rr(g, 400, 440, 620, 120, 16); g.stroke();
    g.font = "900 70px D"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#ffd34d"; g.fillText("SALON JANA", 730, 503);
    // Schere als Zeichen
    g.save(); g.translate(1100, 600); g.rotate(-0.4); g.strokeStyle = OL; g.lineWidth = 7; g.fillStyle = "#c9ced8"; g.beginPath(); g.ellipse(-30, 50, 20, 26, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.ellipse(30, 50, 20, 26, 0, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-20, 26); g.lineTo(20, -70); g.moveTo(20, 26); g.lineTo(-20, -70); g.stroke(); g.restore();
    // Markise
    for (let i = 0; i < 9; i++) { g.fillStyle = i % 2 ? "#ffffff" : "#e85d75"; g.beginPath(); g.moveTo(380 + i * 75, 585); g.lineTo(455 + i * 75, 585); g.lineTo(455 + i * 75, 650); g.arc(417 + i * 75, 650, 37.5, 0, Math.PI); g.closePath(); g.fill(); g.stroke(); }
    // Schaufenster mit Innenleben
    const lit = 0.35 + 0.65 * Math.max(o.open, o.sun * 0.6); const iw = g.createLinearGradient(0, 700, 0, 1060); iw.addColorStop(0, mixS("#3a2a20", "#ffe2b0", lit)); iw.addColorStop(1, mixS("#24180f", "#f5c48a", lit));
    g.fillStyle = iw; rr(g, 400, 710, 360, 350, 12); g.fill(); g.stroke();
    g.fillStyle = mixS("#334", "#cfe9f5", lit); rr(g, 450, 740, 120, 170, 50); g.fill(); g.stroke(); g.fillStyle = "#2b2b33"; rr(g, 470, 930, 90, 60, 14); g.fill(); g.stroke(); g.fillRect(505, 990, 20, 60);
    g.fillStyle = "#3d9a6b"; g.beginPath(); g.arc(690, 980, 46, Math.PI, 0); g.fill(); g.stroke(); g.fillStyle = "#b5651d"; rr(g, 660, 980, 60, 70, 8); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.moveTo(420, 1040); g.lineTo(520, 720); g.lineTo(560, 720); g.lineTo(460, 1040); g.closePath(); g.fill();
    // Tür: Innen, Person, Türblatt
    g.fillStyle = mixS("#2a1d16", "#ffd9a0", 0.3 + 0.7 * o.open); g.fillRect(800, 690, 180, 450); if (o.inside) o.inside(g);
    const pw = 180 * (1 - 0.82 * o.open); g.fillStyle = "#2e5e4e"; g.fillRect(800, 690, pw, 450); g.strokeRect(800, 690, pw, 450);
    g.fillStyle = "rgba(190,225,240,0.55)"; if (pw > 40) { g.fillRect(800 + pw * 0.15, 720, pw * 0.7, 260); g.strokeRect(800 + pw * 0.15, 720, pw * 0.7, 260); }
    g.strokeRect(800, 690, 180, 450);
    // Schild an der Tür
    const sw = Math.sin(u * 3) * 0.06; g.save(); g.translate(800 + pw / 2, 800); g.rotate(sw); g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.moveTo(-40, -50); g.lineTo(0, -80); g.lineTo(40, -50); g.stroke();
    g.scale(Math.max(0.15, pw / 180), 1); g.lineWidth = 6; fillRR(g, -78, -50, 156, 64, 10, o.sign ? "#2fa35a" : "#e5243b"); rr(g, -78, -50, 156, 64, 10); g.stroke();
    g.font = `900 ${o.sign ? 34 : 22}px D`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText(o.sign ? "OFFEN" : "GESCHLOSSEN", 0, -17); g.restore();
    // Uhr, Gehweg, Straße
    clock(g, 230, 420, o.hr);
    g.fillStyle = mixS("#7d8590", "#c9ccd1", o.sun); g.fillRect(-1200, 1140, 3600, 120); g.strokeRect(-1200, 1140, 3600, 120); g.fillStyle = mixS("#2a2d33", "#4a4e57", o.sun); g.fillRect(-1200, 1260, 3600, 900);
    g.fillStyle = "rgba(255,255,255,0.5)"; for (let i = -10; i < 20; i++) g.fillRect(i * 200, 1500, 110, 16);
    if (o.rain > 0) for (let i = 0; i < 14; i++) { const r = ((u * 0.9 + i * 0.29) % 1); g.strokeStyle = `rgba(220,230,255,${0.5 * (1 - r) * o.rain})`; g.lineWidth = 3; g.beginPath(); g.ellipse(-600 + rnd(i * 3) * 1800, 1170 + rnd(i * 5) * 70, 20 + r * 50, 5 + r * 10, 0, 0, 7); g.stroke(); }
  }
  function mixS(a, b, k) { return SK.mix(a, b, k); }
  function leaves(g, u, a) { if (a <= 0) return; for (let i = 0; i < 12; i++) { const x = ((rnd(i * 4.4) * 1800 + u * (260 + rnd(i) * 200)) % 1900) - 500, y = 760 + rnd(i * 2.2) * 420 + Math.sin(u * 3 + i) * 40; g.save(); g.translate(x, y); g.rotate(u * 4 + i); g.globalAlpha = a; g.fillStyle = i % 2 ? "#e0703a" : "#d9a441"; g.strokeStyle = OL; g.lineWidth = 4; g.beginPath(); g.ellipse(0, 0, 22, 11, 0, 0, 7); g.fill(); g.stroke(); g.restore(); } }

  TYPES.h_salon = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 5.2, capY: 1530,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.sechs = f(/^sechs/, 0, 0.9); T.fris = f(/^friseursalon/, T.sechs, T.sechs + 1.2); T.regen = f(/^regen/, T.fris, T.fris + 0.8); T.klapp = f(/^klappstühlen/, T.regen, T.regen + 0.7);
      T.neun = f(/^neun/, T.klapp, T.klapp + 1.0); T.streit = f(/^streit/, T.neun, T.neun + 0.6); T.dann = f(/^dann/, T.streit, T.streit + 0.9); T.leer = f(/^leer/, T.dann, T.dann + 1.4);
      T.krause = f(/^krause/, T.leer, T.leer + 0.8); T.allein = f(/^allein/, T.krause, T.krause + 0.9); T.punkt = f(/^punkt/, T.allein, T.allein + 1.0); T.kundin = f(/^kundin/, T.punkt, T.punkt + 1.0);
      T.rein = f(/^rein$/, T.kundin, T.kundin + 1.2); T.herr = f(/^herr$/, T.rein, T.rein + 0.6); T.vers = f(/^versteht/, T.herr, T.herr + 0.6); T.denn = f(/^denn/, T.vers, T.vers + 1.3);
      T.bC = T.dann - 0.12; T.bD = T.punkt - 0.55; T.bE = T.herr - 0.1; p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const ph = u < T.neun - 0.12 ? 0 : u < T.bC ? 1 : u < T.bD ? 2 : u < T.bE ? 3 : 4;
      const K = (t, z, x, y) => ({ t, z, x, y });
      const KF = ph === 0 ? [K(0, 1.6, -60, 860), K(T.sechs + 0.2, 1.4, 150, 840), K(T.klapp, 1.35, 420, 830), K(T.neun, 1.35, 520, 830)]
        : ph === 1 ? [K(T.neun - 0.12, 1.35, 600, 830), K(T.streit + 0.2, 1.55, 680, 820), K(T.bC, 1.5, 660, 820)]
        : ph === 2 ? [K(T.bC, 1.3, 450, 830), K(T.krause, 1.75, 620, 860), K(T.bD, 1.8, 630, 860)]
        : ph === 3 ? [K(T.bD, 1.3, 480, 830), K(T.rein, 1.3, 600, 830), K(T.bE, 1.35, 640, 830)]
        : [K(T.bE, 1.6, 620, 830), K(T.vers + 0.1, 2.6, 620, 790), K(T.denn, 2.6, 620, 790)];
      const c = SK.cam(KF, u);
      let shake = 0; [T.streit].forEach((s) => { const k = u - s; if (k > 0 && k < 0.35) shake = 1 - k / 0.35; });
      const dive = ph === 4 ? inExpo(cl((u - T.denn - 0.1) / Math.max(0.3, d - T.denn - 0.1))) : 0;
      if (dive > 0) { const k = inOut(cl((u - T.denn) / 0.35)); c.x = lerp(c.x, 860, k); c.y = lerp(c.y, 783, k); c.z *= 1 + dive * 26; }
      const sx = Math.sin(u * 90) * 16 * shake, sy = Math.cos(u * 77) * 12 * shake;
      g.save(); SK.apply(g, c, sx, sy);
      const sun = ph >= 2 ? 1 : 0, open = ph === 1 ? out3(seg(u, T.neun - 0.1, T.neun + 0.3)) : ph >= 3 ? out3(seg(u, T.rein - 0.45, T.rein - 0.1)) * (1 - seg(u, T.rein + 0.7, T.rein + 1.0)) : 0;
      const hr = ph === 0 ? 6 : ph === 1 ? 9 : ph === 2 ? 8 + 50 / 60 + seg(u, T.bC, T.bD) * 9 / 60 : ph === 3 ? 8 + 59 / 60 + out3(seg(u, T.punkt - 0.1, T.punkt + 0.15)) / 60 : 9.05;
      const fris = (q) => { if (open <= 0.2) return; q.save(); q.globalAlpha = cl((open - 0.2) * 2); SK.person(q, 900, 1140, 0.6, { hs: "bun", hair: "#1e1a18", shirt: "#2b2b33", apron: "#111", skin: "#e8b48f", mouth: "smile", eyes: ph === 1 ? "wide" : "happy", aR: 0.4, aL: 1.3 }); q.restore(); };
      street(g, u, { rain: ph <= 1 ? 1 : 0, open, sign: ph === 1 || ph >= 3 ? (ph === 3 ? (u > T.punkt ? 1 : 0) : 1) : 0, hr, sun, inside: ph === 1 || ph >= 3 ? fris : null });
      if (ph <= 1) { // Schlange
        const rush = ph === 1 ? inOut(seg(u, T.neun, T.streit + 0.2)) : 0;
        for (let i = 11; i >= 0; i--) { const sitK = outBack(seg(u, T.klapp - 0.3 + i * 0.04, T.klapp + i * 0.04), 2) * (1 - rush); const sits = [2, 5, 8, 10].includes(i);
          let x = QX(i); if (rush > 0) x = lerp(x, 700 - (i % 6) * 60 + Math.sin(u * 13 + i) * 18, rush);
          const bob = ph === 1 ? Math.abs(Math.sin(u * 12 + i * 1.3)) * -18 * rush : Math.sin(u * 2 + i) * 3;
          if (sits && sitK > 0.02 && rush < 0.5) SK.chair(g, x + 12, 1140, 0.55, ["#3d7f6a", "#c0392b", "#2f6f8f", "#d9a441"][i % 4]);
          const angry = ph === 1 ? 1 : 0; const isK = i === 7;
          SK.person(g, x, 1140, 0.6, { ...(isK ? KRAUSE : {}), shirt: isK ? KRAUSE.shirt : SHIRTS[i], hair: isK ? KRAUSE.hair : HAIRS[i % HAIRS.length], hs: isK ? "grey" : HS[i], skin: isK ? KRAUSE.skin : ["#f1c7a1", "#d9a07a", "#8d5a3c", "#f0c4a0"][i % 4],
            sit: sits && sitK > 0.5 && rush < 0.5, bob, mouth: angry ? (i % 2 ? "shout" : "open") : (i % 3 ? "flat" : "sad"), brow: angry ? 1 : -0.4, red: angry * 0.6, t: u,
            aL: angry ? -0.9 - 0.4 * Math.sin(u * 10 + i) : undefined, aR: angry ? -1.1 + 0.4 * Math.sin(u * 9 + i) : (i % 3 === 0 ? 0.2 : undefined), eR: i % 3 === 0 && !angry ? -1.6 : 0, flip: i % 4 === 1 && !angry });
          if (i % 3 === 0 && !angry) SK.umbrella(g, x + 70, 1140 - 0.6 * 600 + 10, 0.62, SHIRTS[(i + 4) % 12], 0.08 + Math.sin(u * 2 + i) * 0.03);
          if (angry && i % 4 === 0) SK.umbrella(g, x + 40, 760 - 80 * Math.abs(Math.sin(u * 6 + i)), 0.5, SHIRTS[(i + 4) % 12], Math.sin(u * 8 + i) * 0.6);
        }
      } else if (ph === 2) {
        SK.chair(g, 632, 1140, 0.55, "#3d7f6a");
        SK.person(g, 620, 1140, 0.6, { ...KRAUSE, sit: true, mouth: u > T.allein ? "o" : "flat", eyes: u > T.allein ? "side" : "dot", look: Math.sin(u * 2.2) * 0.8, brow: -0.5, aR: 0.6, eR: -1.4,
          hold: (q, h) => { q.fillStyle = "#c0392b"; q.lineWidth = 6; rr(q, h[0] - 20, h[1] - 70, 40, 90, 10); q.fill(); q.stroke(); q.fillStyle = "#ddd"; rr(q, h[0] - 22, h[1] - 84, 44, 18, 6); q.fill(); q.stroke(); } });
        leaves(g, u, 1);
      } else { // Kundin geht rein, Herr Krause staunt
        const wk = seg(u, T.kundin - 0.5, T.rein + 0.15), wx = lerp(-200, 885, inOut(wk)), gone = seg(u, T.rein + 0.15, T.rein + 0.55);
        SK.chair(g, 632, 1140, 0.55, "#3d7f6a");
        const lookK = ph === 3 ? cl((wx - 600) / 250) : 1; const surpr = ph === 3 ? seg(u, T.rein - 0.2, T.rein + 0.2) : 1;
        if (gone < 1 && ph === 3) { g.save(); g.globalAlpha = 1 - gone; SK.person(g, wx, 1140, 0.6, { hs: "long", hair: "#c98d3a", shirt: "#e85d75", skirt: "#2f6f8f", pants: "#f1c7a1", skin: "#f1c7a1", walk: wk < 1 ? u * 11 : 0, mouth: "grin", eyes: "happy", scarf: "#f2b134" }); g.restore(); }
        SK.person(g, 620, 1140, 0.6, { ...KRAUSE, sit: true, mouth: surpr > 0.5 ? "o" : "flat", eyes: surpr > 0.5 ? "wide" : "dot", look: -0.6 + 1.6 * lookK, brow: surpr > 0.5 ? -1 : 0, red: ph === 4 ? 0.4 : 0, t: u, aR: ph === 4 ? -1.5 : 0.6, eR: ph === 4 ? -1.2 : -1.4, aL: ph === 4 ? -1.4 : undefined, eL: ph === 4 ? -1.2 : 0 });
        leaves(g, u, 0.6);
      }
      g.restore();
      if (ph <= 1) SK.rain(g, u, ph === 0 ? 1 : 0.6);
      if (ph === 0) { const lf = 0.4 * (1 - cl(Math.abs(u - 0.22) / 0.05)); if (lf > 0) { g.fillStyle = `rgba(225,235,255,${0.8 * lf})`; g.fillRect(0, 0, W, H); } }
      const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
      if (ph === 1) {
        SK.pow(g, "ZOFF!", 300, 930, (u - T.streit) / 0.7, { rot: 0.1, px: 140 });
        const [a1, b1] = SK.toScreen(c, 640, 760), [a2, b2] = SK.toScreen(c, 520, 760), [a3, b3] = SK.toScreen(c, 760, 760);
        SK.bubble(g, ["Ich war *ZUERST*!"], 330, 420, a1, b1, win(T.streit + 0.05, T.bC + 0.1), { shout: true, px: 52 });
        SK.bubble(g, ["Nein, *ICH*!"], 790, 560, a3, b3, win(T.streit + 0.35, T.bC + 0.1), { shout: true, px: 56 });
        SK.bubble(g, ["Seit *fünf* hier!"], 330, 690, a2, b2, win(T.streit + 0.7, T.bC + 0.1), { px: 44 });
      } else if (ph === 2) { const [hx, hy] = SK.toScreen(c, 620, 860); SK.bubble(g, ["Wo sind", "denn *alle*?"], 330, 520, hx - 20, hy - 60, win(T.allein - 0.1, T.bD), { px: 50 }); }
      else if (ph === 3) { const [fx, fy] = SK.toScreen(c, 900, 830); SK.bubble(g, ["Guten Morgen,", "Frau *Weber*!"], 720, 470, fx, fy - 40, win(T.rein - 0.3, T.bE + 0.05), { px: 46 });
        const [hx, hy] = SK.toScreen(c, 620, 860); SK.bubble(g, ["…?"], 300, 640, hx - 20, hy - 40, win(T.rein + 0.3, T.bE + 0.05), { px: 60 }); }
      else { const [hx, hy] = SK.toScreen(c, 620, 820); SK.qmarks(g, hx, hy - 330, u, seg(u, T.vers - 0.15, T.vers + 0.4) * (1 - dive * 3)); SK.speedLines(g, 540, 900, seg(u, T.vers - 0.1, T.vers + 0.2) * (1 - seg(u, T.denn - 0.2, T.denn)), "rgba(255,211,77,"); }
      SK.flashAt(g, u, [T.neun - 0.12, T.bC, T.bD, T.bE], 0.09, 0.65);
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T, E = [[0.0, "thunder", 0.6, 0], [0.02, "whoosh_down", 0.3, 0]];
      for (let t = 0.1; t < T.bC - 0.2; t += 1.4) E.push([t, "closed_rain", 0.45, 0]);
      E.push([T.sechs, "chime", 0.35, -0.4]); for (let i = 0; i < 4; i++) E.push([T.klapp - 0.25 + i * 0.12, "pop", 0.3, -0.5 + i * 0.3]);
      E.push([T.neun - 0.15, "closed_bell", 0.5, 0.5], [T.neun - 0.1, "gdoor", 0.4, 0.5], [T.streit - 0.02, "slap", 0.6, 0], [T.streit, "boom", 0.3, 0], [T.streit + 0.05, "pop", 0.4, -0.3], [T.streit + 0.35, "pop", 0.4, 0.3], [T.streit + 0.7, "pop", 0.35, -0.2]);
      E.push([T.bC - 0.08, "whoosh_side", 0.4, 0], [T.leer, "tr_swish", 0.25, -0.4], [T.allein - 0.1, "pop", 0.35, -0.3]);
      E.push([T.bD - 0.08, "whoosh_side", 0.35, 0], [T.punkt, "ding", 0.45, -0.4], [T.kundin - 0.4, "vsteps", 0.35, -0.3], [T.rein - 0.45, "closed_bell", 0.5, 0.4], [T.rein - 0.4, "gdoor", 0.35, 0.4], [T.rein - 0.3, "pop", 0.35, 0.3], [T.rein + 0.3, "pop", 0.25, -0.3]);
      E.push([T.bE - 0.08, "whoosh_up", 0.35, 0], [T.vers - 0.1, "pop", 0.4, 0], [T.vers + 0.1, "pop", 0.35, 0.2], [T.vers + 0.25, "pop", 0.3, -0.2], [T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Goldschrift auf der Salonscheibe ----------
  TYPES.salon_end = {
    zone: "center", pal: "ag_dark", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/terminbuchung/, E.sys, 1.6); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      // Innen: warmes, unscharfes Licht hinter der Scheibe
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#2a1810"); bg.addColorStop(1, "#120a06"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 22; i++) { const x = rnd(i * 3.7) * 1080 + Math.sin(u * 0.4 + i) * 20, y = 200 + rnd(i * 5.9) * 1300, r = 40 + rnd(i * 1.3) * 110, a = 0.06 + 0.1 * rnd(i * 8.1); const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(255,${180 + Math.floor(rnd(i) * 60)},120,${a})`); gg.addColorStop(1, "rgba(255,190,120,0)"); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      // Spiegelung auf dem Glas, wandert langsam
      g.save(); g.globalAlpha = 0.08; g.fillStyle = "#fff"; const rx = -400 + u * 120; g.beginPath(); g.moveTo(rx, 0); g.lineTo(rx + 160, 0); g.lineTo(rx + 760, H); g.lineTo(rx + 600, H); g.closePath(); g.fill(); g.restore();
      // Fensterrahmen
      g.strokeStyle = "#0b0705"; g.lineWidth = 40; g.strokeRect(20, 20, W - 40, H - 40);
      // Goldene Schaufensterschrift
      SK.endTitle(g, u, d, T, { c: "#f6d58a", glow: "rgba(246,213,138,0.55)", accent: "#e8b85a", sub: "rgba(255,236,200,0.85)", key: "#f6d58a", offer: "IHRE EIGENE TERMINBUCHUNG", y: 820 });
      // Glanz läuft einmal über die Goldschrift
      const sh = seg(u, 0.9, 1.7); if (sh > 0 && sh < 1) { g.save(); g.globalCompositeOperation = "lighter"; const gx = lerp(-200, 1280, sh); const gr = g.createLinearGradient(gx - 120, 0, gx + 120, 0); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,250,220,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 700, W, 260); g.restore(); }
      // kleines Türschild OFFEN schwingt
      const so = out3(seg(u, 0.3, 0.9)); if (so > 0) { g.save(); g.translate(540, 300 - (1 - so) * 120); g.rotate(Math.sin(u * 2.4) * 0.07); g.globalAlpha = so; g.strokeStyle = "#e8b85a"; g.lineWidth = 3; g.beginPath(); g.moveTo(-60, -60); g.lineTo(0, -100); g.lineTo(60, -60); g.stroke(); rr(g, -110, -60, 220, 84, 14); g.fillStyle = "#1f7a45"; g.fill(); g.stroke(); g.font = "700 46px I"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.letterSpacing = "6px"; g.fillText("OFFEN", 3, -17); g.letterSpacing = "0px"; g.restore(); }
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.05, "click", 0.4, -0.2], [0.18, "click", 0.4, 0.2], [0.1, "shimmer", 0.35, 0], [0.4, "closed_bell", 0.35, 0], [0.9, "shimmer_hi", 0.25, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
