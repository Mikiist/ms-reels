// VOICE_DELAY: 0.55
// h_nacht: Neugier-Geschichte (Look "cinema", Anti-Werbung). Turmuhr 23:58 tickt, ein Mann rennt durch die nächtliche Stadt.
// Morgen hat seine Frau Geburtstag (Denkblase mit Torte), er hat nichts. Blumenladen zu, Parfümerie zu, alle Rollläden knallen runter.
// Er sitzt auf dem Bordstein, sieht das dunkle Studio gegenüber und lächelt. Morgens öffnet sie einen Umschlag, schreit vor Freude,
// fällt ihm um den Hals. Bei „Denn“ taucht die Kamera in die Karte, Weiß. Danach gift_end.
// Wörter: rennt, geburtstag, nichts, blumenladen, parfümerie, alles, bordstein, dann, studio, lächelt, morgen (2.), umschlag, schreit, hals, denn.
(() => {
  const OL = SK.OL;
  const MAN = { hs: "short", hair: "#2a1d16", shirt: "#3f7a5a", pants: "#2f4a7a", shoes: "#1e1e24", skin: "#efc29c" };
  const WIFE = { hs: "long", hair: "#b8452a", shirt: "#f4a6c0", skirt: "#f4a6c0", pants: "#f1c7a1", shoes: "#f4a6c0", skin: "#f3cfb0" };
  const NIGHT = ["#070b1c", "#18213f"];

  function sky(g, u, o = {}) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, NIGHT[0]); gr.addColorStop(1, NIGHT[1]); g.fillStyle = gr; g.fillRect(-1200, -1200, W + 2400, H + 2400);
    for (let i = 0; i < 60; i++) circle(g, rnd(i * 2.3) * W, rnd(i * 5.1) * 900, 1.5 + rnd(i) * 2, `rgba(255,255,255,${0.3 + 0.5 * (0.5 + 0.5 * Math.sin(u * 3 + i))})`);
    g.fillStyle = "#fff4cf"; g.beginPath(); g.arc(o.mx || 860, o.my || 300, 70, 0, 7); g.fill(); g.fillStyle = NIGHT[0]; g.beginPath(); g.arc((o.mx || 860) + 28, (o.my || 300) - 14, 62, 0, 7); g.fill(); }
  function towerClock(g, x, y, r, min) { // min = Minuten nach 23 Uhr (58 = 23:58)
    g.save(); g.lineWidth = 10; g.strokeStyle = OL; g.fillStyle = "#3b2f2a"; g.beginPath(); g.arc(x, y, r * 1.14, 0, 7); g.fill(); g.stroke();
    const fg = g.createRadialGradient(x, y - r * 0.3, 10, x, y, r); fg.addColorStop(0, "#fff7dc"); fg.addColorStop(1, "#e9d9a8"); g.fillStyle = fg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.stroke();
    g.fillStyle = OL; g.font = `400 ${r * 0.24}px S`; g.textAlign = "center"; g.textBaseline = "middle"; const RN = ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillText(RN[i], x + Math.sin(a) * r * 0.78, y - Math.cos(a) * r * 0.78); }
    for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; g.fillRect(x + Math.sin(a) * r * 0.93 - 2, y - Math.cos(a) * r * 0.93 - 2, 4, 4); }
    const hr = 11 + min / 60, ha = hr / 12 * Math.PI * 2, ma = min / 60 * Math.PI * 2; g.lineCap = "round";
    g.lineWidth = r * 0.06; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ha) * r * 0.5, y - Math.cos(ha) * r * 0.5); g.stroke();
    g.lineWidth = r * 0.035; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(ma) * r * 0.8, y - Math.cos(ma) * r * 0.8); g.stroke();
    circle(g, x, y, r * 0.05, "#b8452a"); g.restore(); }
  function lamp(g, x, ground, h, on = 1) { g.fillStyle = "#0c0f1a"; g.fillRect(x - 7, ground - h, 14, h); g.beginPath(); g.moveTo(x - 7, ground - h); g.quadraticCurveTo(x, ground - h - 40, x + 60, ground - h - 30); g.lineWidth = 12; g.strokeStyle = "#0c0f1a"; g.stroke();
    const lg = g.createRadialGradient(x + 60, ground - h - 20, 5, x + 60, ground - h + 200, 420); lg.addColorStop(0, `rgba(255,205,130,${0.55 * on})`); lg.addColorStop(1, "rgba(255,205,130,0)"); g.fillStyle = lg; g.beginPath(); g.moveTo(x + 40, ground - h - 20); g.lineTo(x + 80, ground - h - 20); g.lineTo(x + 330, ground); g.lineTo(x - 210, ground); g.closePath(); g.fill(); circle(g, x + 60, ground - h - 18, 14, `rgba(255,236,190,${on})`); }
  function houses(g, off, ground, lit = 1) { for (let i = -2; i < 9; i++) { const w = 300 + rnd(i * 3.3 + 50) * 160, x = i * 420 - (off % 420), hh = 520 + rnd(Math.floor((i * 420 + off) / 420) * 7.1) * 420;
      g.fillStyle = i % 2 ? "#141a33" : "#1a2142"; g.fillRect(x, ground - hh, w, hh); g.strokeStyle = "#0a0d1c"; g.lineWidth = 6; g.strokeRect(x, ground - hh, w, hh);
      for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) { const k = Math.floor((i * 420 + off) / 420) * 13 + r * 3 + c; const on = rnd(k * 1.7) > 0.55; g.fillStyle = on ? `rgba(255,200,120,${0.85 * lit})` : "#0d1124"; g.fillRect(x + 40 + c * (w - 80) / 3, ground - hh + 50 + r * 80, (w - 80) / 3 - 20, 50); } } }
  function shop(g, x, ground, w, name, col, kind, shut, u) { // Laden mit Schild, Fenster, Tür, Rollladen (shut 0..1)
    g.save(); g.lineWidth = 8; g.strokeStyle = OL; g.fillStyle = "#2a2f45"; g.fillRect(x, ground - 760, w, 760); g.strokeRect(x, ground - 760, w, 760);
    fillRR(g, x + 30, ground - 720, w - 60, 110, 14, col); rr(g, x + 30, ground - 720, w - 60, 110, 14); g.stroke();
    g.font = `400 ${Math.min(76, (w - 80) / name.length * 1.7)}px S`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff6e6"; g.fillText(name, x + w / 2, ground - 662);
    const wx = x + 40, ww = w * 0.58, wy = ground - 560; g.fillStyle = "#151a2c"; rr(g, wx, wy, ww, 420, 10); g.fill(); g.stroke();
    g.save(); g.beginPath(); g.rect(wx, wy, ww, 420); g.clip();
    if (kind === "blumen") for (let i = 0; i < 9; i++) { const fx = wx + 40 + (i % 5) * (ww - 80) / 4, fy = wy + 260 + Math.floor(i / 5) * 90; g.strokeStyle = "#2f6b3a"; g.lineWidth = 6; g.beginPath(); g.moveTo(fx, fy + 140); g.lineTo(fx, fy); g.stroke(); for (let k = 0; k < 6; k++) circle(g, fx + Math.cos(k) * 18, fy + Math.sin(k) * 18, 14, ["#e85d75", "#f2b134", "#c44569"][i % 3]); circle(g, fx, fy, 10, "#ffd34d"); }
    if (kind === "parfum") for (let i = 0; i < 6; i++) { const bx = wx + 50 + (i % 3) * (ww - 100) / 2, by = wy + 150 + Math.floor(i / 3) * 170; g.fillStyle = ["#b48ad6", "#f4a6c0", "#8ad6c9"][i % 3]; g.strokeStyle = OL; g.lineWidth = 5; rr(g, bx - 34, by, 68, 100, 18); g.fill(); g.stroke(); g.fillStyle = "#d9b45a"; rr(g, bx - 14, by - 30, 28, 30, 6); g.fill(); g.stroke(); }
    if (kind === "studio") { g.fillStyle = "rgba(244,166,192,0.12)"; g.fillRect(wx, wy, ww, 420); for (let i = 0; i < 3; i++) { const cx = wx + 80 + i * (ww - 160) / 2; g.fillStyle = "#e9e2d7"; rr(g, cx - 18, wy + 300, 36, 70, 6); g.fill(); const fl = 0.6 + 0.4 * Math.sin(u * 9 + i * 2); circle(g, cx, wy + 290, 9 * fl, `rgba(255,200,120,${0.4 * fl})`); } }
    g.restore();
    const dx = wx + ww + 30, dw = x + w - 30 - dx; g.fillStyle = "#3a2d24"; g.fillRect(dx, ground - 520, dw, 520); g.strokeStyle = OL; g.strokeRect(dx, ground - 520, dw, 520); circle(g, dx + 26, ground - 260, 9, "#d9b45a");
    fillRR(g, dx + 14, ground - 470, dw - 28, 52, 8, "#e5243b"); g.font = "900 22px D"; g.fillStyle = "#fff"; g.fillText("GESCHLOSSEN", dx + dw / 2, ground - 444);
    if (shut > 0) { const sh = (760 - 130) * shut; g.fillStyle = "#6b7280"; g.fillRect(x + 6, ground - 610, w - 12, sh); g.strokeStyle = "#3b414d"; g.lineWidth = 4; for (let y = ground - 610 + 22; y < ground - 610 + sh; y += 26) { g.beginPath(); g.moveTo(x + 6, y); g.lineTo(x + w - 6, y); g.stroke(); } g.strokeStyle = OL; g.lineWidth = 8; g.strokeRect(x + 6, ground - 610, w - 12, sh); }
    g.restore(); }
  function cake(g, x, y, s, u) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL; g.fillStyle = "#f4a6c0"; rr(g, -90, -40, 180, 80, 14); g.fill(); g.stroke(); g.fillStyle = "#fff6e6"; rr(g, -70, -100, 140, 64, 12); g.fill(); g.stroke();
    for (let i = 0; i < 3; i++) { const cx = -40 + i * 40; g.fillStyle = "#5b8def"; g.fillRect(cx - 5, -140, 10, 40); g.strokeRect(cx - 5, -140, 10, 40); const f = 1 + 0.15 * Math.sin(u * 14 + i); g.fillStyle = "#ffb000"; g.beginPath(); g.ellipse(cx, -152, 7 * f, 14 * f, 0, 0, 7); g.fill(); } g.restore(); }
  function heart(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c; g.strokeStyle = OL; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 10); g.bezierCurveTo(-18, -2, -12, -18, 0, -8); g.bezierCurveTo(12, -18, 18, -2, 0, 10); g.fill(); g.stroke(); g.restore(); }
  function envelope(g, x, y, s, open, card) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 6; g.strokeStyle = OL;
    if (card > 0) { const cy = -card * 150; g.save(); g.translate(0, cy); g.fillStyle = "#fff8ec"; rr(g, -150, -110, 300, 200, 12); g.fill(); g.stroke(); g.strokeStyle = "#d9b45a"; g.lineWidth = 4; rr(g, -136, -96, 272, 172, 8); g.stroke();
      g.font = "italic 400 44px S"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#8a2d4a"; g.fillText("Studio Marie", 0, -46); g.font = "700 26px I"; g.fillStyle = "#2b1d14"; g.fillText("EIN TAG WELLNESS", 0, 10); g.font = "400 22px I"; g.fillStyle = "#6b5a4a"; g.fillText("zum Geburtstag", 0, 48); g.restore(); }
    g.fillStyle = "#f2e2c4"; rr(g, -170, -10, 340, 200, 10); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-170, 190); g.lineTo(0, 80); g.lineTo(170, 190); g.stroke();
    g.save(); g.scale(1, lerp(1, -1, open)); g.fillStyle = "#e8d3ad"; g.beginPath(); g.moveTo(-170, -10); g.lineTo(0, 100); g.lineTo(170, -10); g.closePath(); g.fill(); g.stroke(); g.restore();
    if (open < 0.3) { circle(g, 0, 70, 22, "#b8452a"); } g.restore(); }

  TYPES.h_nacht = {
    zone: "top", pal: "c_night", bgv: 0, coverT: 7.6, capY: 1530,
    prep(o, p) { const f = SK.finder(o); const T = {};
      T.rennt = f(/^rennt/, 0, 1.1); T.stadt = f(/^stadt/, T.rennt, T.rennt + 0.9); T.geb = f(/^geburtstag/, T.stadt, T.stadt + 1.4); T.nichts = f(/^nichts/, T.geb, T.geb + 1.0);
      T.blumen = f(/^blumenladen/, T.nichts, T.nichts + 0.8); T.parf = f(/^parfümerie/, T.blumen, T.blumen + 0.9); T.alles = f(/^alles/, T.parf, T.parf + 0.9); T.bord = f(/^bordstein/, T.alles, T.alles + 1.6);
      T.dann = f(/^dann/, T.bord, T.bord + 0.6); T.studio = f(/^studio/, T.dann, T.dann + 0.9); T.laech = f(/^lächelt/, T.studio, T.studio + 0.9); T.morgen = f(/^morgen/, T.laech, T.laech + 0.9);
      T.umschl = f(/^umschlag/, T.morgen, T.morgen + 1.0); T.schreit = f(/^schreit/, T.umschl, T.umschl + 0.5); T.hals = f(/^hals/, T.schreit, T.schreit + 1.4); T.denn = f(/^denn/, T.hals, T.hals + 0.5);
      T.er = f(/^er$/, T.alles, T.bord - 0.4); T.bB = T.geb - 0.35; T.bC = T.blumen - 0.3; T.bD = T.er - 0.1; T.bE = T.morgen - 0.25; p._T = T; },
    draw(g, u, d, p) {
      const T = p._T; const ph = u < T.bB ? 0 : u < T.bC ? 1 : u < T.bD ? 2 : u < T.bE ? 3 : 4;
      g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
      if (ph === 0) {
        if (u < T.rennt - 0.15) { // Turmuhr groß, Minutenzeiger ruckt auf 23:58
          const z = 1.15 - 0.12 * cl(u / T.rennt); g.save(); g.translate(540, 900); g.scale(z, z); g.translate(-540, -900); sky(g, u, { mx: 900, my: 1500 }); g.fillStyle = "#2b2420"; g.fillRect(90, 300, 900, 1400);
          const mn = 57 + seg(u, 0.35, 0.45); towerClock(g, 540, 900, 400, mn); g.restore();
        } else { // Mann rennt, Häuser fliegen vorbei
          const su = u - T.rennt; sky(g, u); houses(g, su * 520, 1180); for (let i = 0; i < 4; i++) lamp(g, ((i * 600 - su * 900) % 2400 + 2400) % 2400 - 300, 1180, 560, 1);
          g.fillStyle = "#121624"; g.fillRect(0, 1180, W, 740); g.fillStyle = "#1c2236"; g.fillRect(0, 1180, W, 70);
          for (let i = 0; i < 8; i++) { const lx = ((i * 260 - su * 1300) % 2080 + 2080) % 2080 - 200; g.fillStyle = "rgba(255,255,255,0.22)"; g.fillRect(lx, 1500, 140, 14); }
          for (let i = 0; i < 6; i++) { g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 5; const yy = 820 + i * 60; g.beginPath(); g.moveTo(240 - i * 20, yy); g.lineTo(120 - i * 30 - 60 * Math.sin(u * 20 + i), yy); g.stroke(); }
          // kleine Turmuhr hinten
          towerClock(g, 860, 360, 95, 58);
          SK.person(g, 520, 1215, 0.82, { ...MAN, walk: u * 17, aL: 1.25 + Math.sin(u * 17) * 0.9, aR: 1.25 - Math.sin(u * 17) * 0.9, eL: -0.8, eR: -0.8, mouth: "open", brow: -0.4, bob: -Math.abs(Math.sin(u * 17)) * 22 });
        }
      } else if (ph === 1) { // stehen bleiben: Geburtstag! nichts!
        const su = u - T.bB; sky(g, u); houses(g, 2400, 1180, 0.8); lamp(g, 160, 1180, 560); g.fillStyle = "#121624"; g.fillRect(0, 1180, W, 740); g.fillStyle = "#1c2236"; g.fillRect(0, 1180, W, 70);
        const z = 1 + 0.12 * out3(cl(su / 1.5)); g.save(); g.translate(540, 1100); g.scale(z, z); g.translate(-540, -1100);
        const nk = seg(u, T.nichts - 0.1, T.nichts + 0.2);
        SK.person(g, 560, 1260, 0.95, { ...MAN, mouth: nk > 0.5 ? "shout" : "o", eyes: "wide", brow: -1, red: nk * 0.6, t: u, aL: nk > 0.5 ? -0.2 : 1.3, aR: nk > 0.5 ? -0.2 : 1.3, eL: nk > 0.5 ? -0.6 : 0, eR: nk > 0.5 ? -0.6 : 0, bob: Math.sin(u * 8) * 4 });
        g.restore();
        const tk = outBack(seg(u, T.bB + 0.05, T.bB + 0.35), 2) * (1 - seg(u, T.nichts - 0.05, T.nichts + 0.15)); if (tk > 0) { SK.bubble(g, ["          ", "          ", "*MORGEN!*"], 700, 470, 600, 700, tk, { think: true, px: 50 }); if (tk > 0.6) cake(g, 700, 470, 0.85 * tk, u); }
        SK.pow(g, "NICHTS!", 540, 420, (u - T.nichts + 0.05) / 0.9, { px: 150, rot: -0.08, c: "#ffffff" });
      } else if (ph === 2) { // Läden zu
        sky(g, u); g.fillStyle = "#121624"; g.fillRect(0, 1240, W, 700);
        if (u < T.alles - 0.12) { const isP = u >= T.parf - 0.12; const su = u - (isP ? T.parf - 0.12 : T.bC); const z = 1.05 + 0.05 * su;
          g.save(); g.translate(540, 1000); g.scale(z, z); g.translate(-540, -1000);
          shop(g, 60, 1240, 960, isP ? "Parfümerie" : "Blumenladen", isP ? "#5b3a6e" : "#2f6b3a", isP ? "parfum" : "blumen", 0, u);
          const rat = Math.sin(u * 60) * 6 * (1 - cl(su / 0.6)); SK.person(g, 760 + rat, 1300, 0.8, { ...MAN, aL: -0.3, eL: -0.4, aR: 1.4, mouth: "shout", brow: -0.8, eyes: "wide" });
          g.restore(); const [bx, by] = [300, 700]; SK.bubble(g, [isP ? "Hallo?!" : "*Bitte!*"], bx, by, 640, 760, seg(u, isP ? T.parf : T.blumen, (isP ? T.parf : T.blumen) + 0.25), { shout: true, px: 60 });
        } else { // alle Rollläden knallen runter
          const su = u - (T.alles - 0.12); g.save(); const z = 1 - 0.04 * cl(su); g.translate(540, 960); g.scale(z * 0.5, z * 0.5); g.translate(-1080, -1050);
          sky(g, u); g.fillStyle = "#121624"; g.fillRect(-200, 1240, 2600, 900); const names = ["Bäckerei", "Juwelier", "Blumenladen", "Parfümerie"], cols = ["#7a4a2a", "#1f3a5a", "#2f6b3a", "#5b3a6e"];
          for (let i = 0; i < 4; i++) shop(g, 40 + i * 520, 1240, 500, names[i], cols[i], i === 2 ? "blumen" : i === 3 ? "parfum" : "", outBack(seg(u, T.alles - 0.1 + i * 0.14, T.alles + 0.08 + i * 0.14), 1.2), u);
          SK.person(g, 1080, 1420, 1.3, { ...MAN, aL: 1.4, aR: 1.4, mouth: "sad", brow: -1, eyes: "dot" }); g.restore();
          SK.pow(g, "KLONK!", 540, 520, (u - T.alles - 0.3) / 0.8, { px: 140, rot: 0.08, c: "#d9dde5" });
        }
      } else if (ph === 3) { // Bordstein, Blick zum Studio, Lächeln
        const look = seg(u, T.dann, T.studio + 0.2), back = seg(u, T.laech - 0.35, T.laech - 0.05);
        const camX = lerp(lerp(380, 820, inOut(look)), 380, inOut(back)), z = lerp(lerp(1.15, 1.25, look), 1.7, inOut(back));
        g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-camX, -lerp(900, 960, inOut(back)));
        sky(g, u, { mx: 300, my: 250 }); g.fillStyle = "#121624"; g.fillRect(-400, 1180, 2200, 900); g.fillStyle = "#1c2236"; g.fillRect(-400, 1180, 2200, 60);
        shop(g, 660, 1080, 520, "Studio Marie", "#8a2d4a", "studio", 0, u); lamp(g, 120, 1180, 560);
        const up = seg(u, T.dann - 0.1, T.dann + 0.2), sm = seg(u, T.laech - 0.1, T.laech + 0.15);
        SK.person(g, 330, 1260, 0.75, { ...MAN, sit: true, eyes: sm > 0.5 ? "happy" : up > 0.5 ? "wide" : "closed", mouth: sm > 0.5 ? "grin" : up > 0.5 ? "o" : "sad", look: up * 0.9, brow: sm > 0.5 ? 0 : -1, aL: up > 0.5 ? 1.3 : 0.7, aR: up > 0.5 ? 1.3 : 0.7, eL: up > 0.5 ? 0 : -1.9, eR: up > 0.5 ? 0 : -1.9 });
        g.restore(); if (sm > 0) { sparkles(g, 560, 700, u, 8, 160, "#ffe9a8", 5); SK.pow(g, "!", 620, 520, (u - T.laech) / 0.7, { px: 170, c: "#ffd34d" }); }
      } else { // Morgen: Umschlag, Freudenschrei, Umarmung
        const su = u - T.bE; const dive = inExpo(cl((u - T.denn - 0.05) / Math.max(0.3, d - T.denn - 0.05)));
        const hug = out3(seg(u, T.hals - 0.35, T.hals + 0.1)); let z = 1.0 + 0.08 * cl(su / 3), cx = 540, cy = 960;
        if (dive > 0) { const k = inOut(cl((u - T.denn) / 0.3)); cx = lerp(cx, 560, k); cy = lerp(cy, 640, k); z *= 1 + dive * 24; }
        g.save(); g.translate(540, 960); g.scale(z, z); g.translate(-cx, -cy);
        const wall = g.createLinearGradient(0, 0, 0, 1300); wall.addColorStop(0, "#ffe7c2"); wall.addColorStop(1, "#f6c99a"); g.fillStyle = wall; g.fillRect(-200, -200, 1500, 2400);
        g.lineWidth = 8; g.strokeStyle = OL; const wg = g.createLinearGradient(0, 260, 0, 760); wg.addColorStop(0, "#9fd3ff"); wg.addColorStop(1, "#ffe0a8"); g.fillStyle = wg; rr(g, 640, 260, 340, 460, 14); g.fill(); g.stroke(); circle(g, 820, 620, 60, "#ffd35c"); g.beginPath(); g.moveTo(810, 260); g.lineTo(810, 720); g.moveTo(640, 490); g.lineTo(980, 490); g.stroke();
        g.fillStyle = "#c98a5a"; g.fillRect(-200, 1180, 1500, 900); g.strokeRect(-200, 1180, 1500, 900); g.fillStyle = "#8a5a3a"; rr(g, 120, 1020, 840, 40, 10); g.fill(); g.stroke(); g.fillRect(170, 1060, 26, 140); g.fillRect(880, 1060, 26, 140);
        circle(g, 820, 1000, 26, "#fff"); g.stroke(); // Kaffeetasse
        const wx = lerp(400, 470, hug), mx = lerp(760, 640, hug), jump = Math.sin(Math.PI * seg(u, T.schreit - 0.1, T.schreit + 0.5)) * -60;
        const joy = seg(u, T.schreit - 0.1, T.schreit + 0.1);
        SK.person(g, mx, 1200, 0.95, { ...MAN, flip: true, eyes: u > T.hals ? "wink" : "happy", mouth: "grin", aL: hug > 0.5 ? -0.3 : 1.3, aR: hug > 0.5 ? -0.3 : 1.3, eL: hug > 0.5 ? 0.6 : 0, eR: hug > 0.5 ? 0.6 : 0 });
        const env = (q, h) => { if (hug > 0.5) return; envelope(q, h[0] + 40, h[1] - 60, 0.75, seg(u, T.umschl - 0.15, T.umschl + 0.2), out3(seg(u, T.umschl + 0.1, T.umschl + 0.5))); };
        SK.person(g, wx, 1200, 0.95, { ...WIFE, bob: jump, eyes: joy > 0.5 ? "happy" : "dot", mouth: joy > 0.5 ? "shout" : "smile", aR: hug > 0.5 ? -0.4 : joy > 0.5 ? -1.2 : 0.1, eR: hug > 0.5 ? 0.6 : joy > 0.5 ? 0 : -1.3, aL: hug > 0.5 ? -0.4 : joy > 0.5 ? -1.2 : 1.3, hold: env, look: 0.6 });
        g.restore();
        if (joy > 0) for (let i = 0; i < 10; i++) { const t = ((u - T.schreit) * 0.6 + i / 10) % 1; heart(g, 300 + rnd(i * 3.3) * 480 + Math.sin(u * 3 + i) * 30, 1000 - t * 700, 2.2 + rnd(i) * 1.5, ["#e5243b", "#f4a6c0", "#ff5c8a"][i % 3]); }
        const win = (a, b) => outBack(seg(u, a, a + 0.22), 2) * (1 - seg(u, b - 0.12, b));
        SK.bubble(g, ["Ein ganzer Tag", "*WELLNESS*?!"], 360, 380, 420, 560, win(T.schreit - 0.05, T.denn + 0.1) * (1 - dive * 4), { shout: true, px: 56 });
        if (u > T.hals) SK.bubble(g, ["Tja…"], 820, 470, 700, 600, win(T.hals + 0.15, T.denn + 0.1) * (1 - dive * 4), { px: 54 });
      }
      SK.flashAt(g, u, [T.rennt - 0.15, T.bB, T.bC, T.bD, T.bE], 0.08, 0.5);
      SK.whiteOut(g, u, d);
    },
    ev(d, p) { const T = p._T, E = [[0.0, "tick_hi", 0.8, 0], [0.4, "tick_hi", 0.9, 0], [0.42, "thump", 0.5, 0], [0.8, "tick_hi", 0.6, 0]];
      for (let t = T.rennt; t < T.bB - 0.1; t += 0.24) E.push([t, "click", 0.25, ((t * 7) % 2) - 1]); E.push([T.rennt - 0.1, "whoosh_side", 0.4, 0]);
      E.push([T.bB, "tr_slow", 0.4, 0], [T.bB + 0.1, "pop", 0.35, 0.3], [T.nichts, "slap", 0.55, 0], [T.nichts + 0.02, "boom", 0.3, 0]);
      E.push([T.blumen, "closed_rattle", 0.5, 0.2], [T.blumen + 0.02, "pop", 0.35, -0.3], [T.parf - 0.12, "whoosh_side", 0.35, 0], [T.parf, "closed_rattle", 0.5, -0.2], [T.parf + 0.02, "pop", 0.35, -0.3]);
      for (let i = 0; i < 4; i++) E.push([T.alles + 0.06 + i * 0.14, "domino_thud", 0.6, -0.6 + i * 0.4]); E.push([T.alles + 0.3, "boom", 0.25, 0]);
      E.push([T.bD, "vsad", 0.35, 0], [T.dann + 0.05, "whoosh_side", 0.25, 0.3], [T.laech - 0.05, "ding", 0.45, 0], [T.laech, "shimmer", 0.4, 0]);
      E.push([T.bE - 0.05, "whoosh_up", 0.35, 0], [T.bE + 0.1, "chime", 0.25, 0], [T.umschl - 0.1, "rc_tear", 0.5, 0], [T.umschl + 0.2, "shimmer_hi", 0.3, 0], [T.schreit - 0.05, "pop", 0.45, -0.2], [T.schreit, "slot_win", 0.35, 0], [T.hals - 0.2, "whoosh_side", 0.3, 0], [T.hals + 0.15, "pop", 0.35, 0.3]);
      E.push([T.denn, "riser", 0.6, 0, Math.max(0.3, d - T.denn)]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0); },
  };

  // ---------- Schluss: Geschenkband öffnet sich, Filmtitel ----------
  TYPES.gift_end = {
    zone: "center", pal: "c_warm", bgv: 0, nocap: true, drop: true,
    prep(o, p) { const E = SK.endTimes(o); E.offer = E.f(/^gutscheinshop/, E.sys, 1.6); p._T = E; },
    draw(g, u, d, p) { const T = p._T;
      const bg = g.createRadialGradient(540, 860, 60, 540, 900, 1150); bg.addColorStop(0, "#4a1424"); bg.addColorStop(1, "#12040a"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      for (let i = 0; i < 28; i++) { const x = (rnd(i * 3.3) * 1200 + u * (6 + rnd(i) * 10)) % 1200 - 60, y = rnd(i * 6.6) * 1900, r = 18 + rnd(i * 2.2) * 50; const a = 0.06 + 0.08 * (0.5 + 0.5 * Math.sin(u * 1.5 + i)); const gg = g.createRadialGradient(x, y, 0, x, y, r); gg.addColorStop(0, `rgba(255,205,120,${a})`); gg.addColorStop(1, "rgba(255,205,120,0)"); g.fillStyle = gg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      // Geschenkband: kreuzt sich in der Mitte, gleitet zur Seite und gibt den Titel frei
      const op = inOut(seg(u, 0.15, 1.0)); g.save(); const gold = g.createLinearGradient(0, 0, W, 0); gold.addColorStop(0, "#a8782c"); gold.addColorStop(0.5, "#f6d58a"); gold.addColorStop(1, "#a8782c"); g.fillStyle = gold;
      g.fillRect(540 - 50 - op * 600, 0, 100, H); g.fillRect(540 - 50 + op * 600, 0, 100, H); g.fillStyle = gold; g.fillRect(0, 860 - 45 - op * 760, W, 90); g.fillRect(0, 860 - 45 + op * 760, W, 90);
      if (op < 0.98) { g.save(); g.translate(540, 860); g.scale(1 - op, 1 - op); g.fillStyle = "#e8b85a"; g.strokeStyle = "#7a5420"; g.lineWidth = 6; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(s * 160, -150, s * 230, 40, 0, 0); g.fill(); g.stroke(); } circle(g, 0, 0, 34, "#f6d58a"); g.restore(); }
      g.restore();
      SK.endTitle(g, u, d, T, { c: "#fff1dc", glow: "rgba(246,213,138,0.5)", accent: "#e8b85a", sub: "rgba(255,226,190,0.85)", key: "#f6d58a", offer: "IHR EIGENER GUTSCHEINSHOP", y: 840 });
      const fi = 1 - cl(u / 0.35); if (fi > 0) { g.fillStyle = `rgba(255,255,255,${fi})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) { const T = p._T; return [[0.0, "boom", 0.4, 0], [0.15, "tr_swish", 0.4, 0], [0.2, "shimmer", 0.4, 0], [T.offer, "ding", 0.25, 0], [T.web, "chime", 0.3, 0]].filter((e) => e[0] < d); },
  };
})();
