// VOICE_DELAY: 0.6
// h_static: Alter Röhrenfernseher mit Holzgehäuse im dunklen Wohnzimmer. Ab Bild 0 lautes Rauschen (Schnee), Kanal-Knackser
// mit drehendem Kanalknopf, Bildrollen, dann Testbild mit Farbbalken, 1-kHz-Testton und Einblendung „KEIN SIGNAL“.
// Kurz vor Schluss (d minus 0,6 s) schaltet das Gerät ab: Bild klappt zu einem hellen Strich und Punkt zusammen, Knack.
// Parameter: title (Standard "KEIN SIGNAL").
try { document.fonts.load("900 80px D"); document.fonts.load("700 40px I"); } catch (e) {}

const HST = { sx: 128, sy: 556, sw: 630, sh: 474, cx: 540, cy: 860, SW: 640, SH: 480 };
function hstCv(w, h) { const c = document.createElement("canvas"); c.width = Math.ceil(w); c.height = Math.ceil(h); return c; }
function hstTimes(d) { const tOff = Math.max(1.3, d - 0.6); const a = Math.min(0.5, Math.max(0.32, tOff * 0.2)); const b = Math.min(1.0, Math.max(a + 0.3, tOff * 0.42)); return { tOff, a, b }; }
// Bildschirmform: gewölbte Kanten, runde Ecken
function hstScreenPath(g, x, y, w, h, bow = 10, r = 46) {
  g.beginPath(); g.moveTo(x + r, y); g.quadraticCurveTo(x + w / 2, y - bow, x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
  g.quadraticCurveTo(x + w + bow, y + h / 2, x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  g.quadraticCurveTo(x + w / 2, y + h + bow, x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.quadraticCurveTo(x - bow, y + h / 2, x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
}
function hstTestcard(g, W_, H_, title) {
  const bars = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"]; const bw = W_ / 7;
  bars.forEach((c, i) => { g.fillStyle = c; g.fillRect(Math.floor(i * bw), 0, Math.ceil(bw) + 1, H_ * 0.66); });
  const rev = ["#0000c0", "#131313", "#c000c0", "#131313", "#00c0c0", "#131313", "#c0c0c0"];
  rev.forEach((c, i) => { g.fillStyle = c; g.fillRect(Math.floor(i * bw), H_ * 0.66, Math.ceil(bw) + 1, H_ * 0.09); });
  const low = ["#00214c", "#ffffff", "#32006a", "#131313", "#090909", "#131313", "#1d1d1d", "#131313"]; const lw = [1.25, 1.25, 1.25, 1.25, 1 / 3, 1 / 3, 1 / 3, 1].map((x) => x * bw);
  let x = 0; low.forEach((c, i) => { g.fillStyle = c; g.fillRect(Math.floor(x), H_ * 0.75, Math.ceil(lw[i]) + 1, H_ * 0.25); x += lw[i]; });
  g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 4; g.beginPath(); g.arc(W_ / 2, H_ / 2, H_ * 0.42, 0, 7); g.stroke();
  g.lineWidth = 2; g.strokeStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.moveTo(W_ / 2, H_ * 0.08); g.lineTo(W_ / 2, H_ * 0.92); g.moveTo(W_ * 0.2, H_ / 2); g.lineTo(W_ * 0.8, H_ / 2); g.stroke();
}

TYPES.h_static = {
  zone: "bottom", pal: "night", bgv: 0, coverT: 1.25,
  prep(sc, p) {
    const st = sc.st; const { SW, SH } = HST;
    // Schnee: 6 Rauschbilder mit waagrechtem Verwischen
    st.snow = [];
    for (let f = 0; f < 6; f++) {
      const c = hstCv(320, 240), g = c.getContext("2d"), im = g.createImageData(320, 240), D = im.data;
      for (let y = 0; y < 240; y++) { let prev = 0.5; const rowB = 0.75 + 0.5 * rnd(f * 977 + y * 3.1); for (let x = 0; x < 320; x++) {
        const r = rnd(f * 131.7 + y * 320.3 + x * 1.013); prev = prev * 0.35 + r * 0.65; const v = Math.min(255, Math.pow(prev, 1.6) * 330 * rowB); const i = (y * 320 + x) * 4; D[i] = v; D[i + 1] = v; D[i + 2] = v * 1.04; D[i + 3] = 255; } }
      g.putImageData(im, 0, 0); st.snow.push(c);
    }
    // Testbild
    const tc = hstCv(SW, SH); hstTestcard(tc.getContext("2d"), SW, SH); st.tc = tc;
    st.title = String(p.title != null ? p.title : "KEIN SIGNAL").trim() || "KEIN SIGNAL";
    // Zwischenbilder für die Wölbung
    st.src = hstCv(SW, SH); st.t1 = hstCv(SW, SH); st.t2 = hstCv(SW, SH);
    // Zeilenmaske
    const sl = hstCv(SW, SH), sg = sl.getContext("2d"); for (let y = 0; y < SH; y += 3) { sg.fillStyle = "rgba(0,0,0,0.30)"; sg.fillRect(0, y, SW, 1.2); }
    const vg = sg.createRadialGradient(SW / 2, SH / 2, SH * 0.3, SW / 2, SH / 2, SW * 0.62); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.6)"); sg.fillStyle = vg; sg.fillRect(0, 0, SW, SH); st.scan = sl;
    // Raum: dunkle Wand mit Tapete, Lampenschein, Anrichte
    const bg = hstCv(W, H), g = bg.getContext("2d");
    let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0a0f12"); gr.addColorStop(0.62, "#0d1416"); gr.addColorStop(1, "#050707"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let x = 0; x < W; x += 54) { g.fillStyle = "rgba(255,255,255,0.018)"; g.fillRect(x, 0, 22, 1240); g.fillStyle = "rgba(0,0,0,0.05)"; g.fillRect(x + 27, 0, 3, 1240); }
    let rg = g.createRadialGradient(1060, 330, 0, 1060, 330, 760); rg.addColorStop(0, "rgba(255,170,90,0.20)"); rg.addColorStop(0.5, "rgba(255,140,70,0.06)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    // Anrichte (Holz) unter dem Fernseher
    gr = g.createLinearGradient(0, 1262, 0, 1340); gr.addColorStop(0, "#3a2416"); gr.addColorStop(0.15, "#24160d"); gr.addColorStop(1, "#120a05"); g.fillStyle = gr; g.fillRect(0, 1262, W, H - 1262);
    g.fillStyle = "rgba(255,210,160,0.10)"; g.fillRect(0, 1262, W, 3);
    st.bg = bg;
    // Gehäuse: Nussbaum mit Maserung, Lack, Blende, Bedienfeld
    const cab = hstCv(960, 780), cg = cab.getContext("2d"); const ox = 0, oy = 0;
    gr = cg.createLinearGradient(0, 0, 0, 780); gr.addColorStop(0, "#6b4428"); gr.addColorStop(0.5, "#4f311c"); gr.addColorStop(1, "#3a2313"); cg.fillStyle = gr; rr(cg, 0, 0, 960, 760, 42); cg.fill();
    cg.save(); rr(cg, 0, 0, 960, 760, 42); cg.clip();
    for (let i = 0; i < 140; i++) { const y0 = rnd(i * 3.7) * 800 - 20, amp = 4 + rnd(i * 5.1) * 14, fr = 0.004 + rnd(i * 2.2) * 0.01, ph = rnd(i) * 6;
      cg.strokeStyle = rnd(i * 7.3) > 0.5 ? `rgba(30,15,6,${0.10 + 0.18 * rnd(i * 9)})` : `rgba(150,100,60,${0.05 + 0.08 * rnd(i * 4)})`; cg.lineWidth = 0.8 + rnd(i * 6) * 2.4; cg.beginPath();
      for (let x = 0; x <= 960; x += 12) { const y = y0 + Math.sin(x * fr + ph) * amp + Math.sin(x * fr * 3.1 + ph * 2) * amp * 0.25; x ? cg.lineTo(x, y) : cg.moveTo(x, y); } cg.stroke(); }
    gr = cg.createLinearGradient(0, 0, 0, 760); gr.addColorStop(0, "rgba(255,230,200,0.22)"); gr.addColorStop(0.08, "rgba(255,230,200,0.04)"); gr.addColorStop(0.92, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.35)"); cg.fillStyle = gr; cg.fillRect(0, 0, 960, 760);
    cg.restore();
    cg.strokeStyle = "rgba(255,220,180,0.18)"; cg.lineWidth = 3; rr(cg, 2, 2, 956, 756, 41); cg.stroke();
    // Blende um den Bildschirm
    const bx = HST.sx - 60 - 28, by = HST.sy - 450 - 28; // in Gehäusekoordinaten (Gehäuse beginnt bei x 60, y 50)
    gr = cg.createLinearGradient(0, by, 0, by + HST.sh + 56); gr.addColorStop(0, "#1d1a17"); gr.addColorStop(1, "#0b0a09"); cg.fillStyle = gr; rr(cg, bx, by, HST.sw + 56, HST.sh + 56, 58); cg.fill();
    cg.strokeStyle = "rgba(255,255,255,0.10)"; cg.lineWidth = 2; rr(cg, bx + 2, by + 2, HST.sw + 52, HST.sh + 52, 56); cg.stroke();
    // Bedienfeld rechts
    const px = 740, pw = 190; gr = cg.createLinearGradient(px, 0, px + pw, 0); gr.addColorStop(0, "#2a2620"); gr.addColorStop(0.5, "#3a342c"); gr.addColorStop(1, "#211e19"); cg.fillStyle = gr; rr(cg, px, 40, pw, 680, 18); cg.fill();
    cg.strokeStyle = "rgba(255,255,255,0.08)"; cg.lineWidth = 2; rr(cg, px + 1, 41, pw - 2, 678, 17); cg.stroke();
    for (let y = 400; y < 700; y += 14) { cg.fillStyle = "rgba(0,0,0,0.55)"; rr(cg, px + 22, y, pw - 44, 7, 3.5); cg.fill(); cg.fillStyle = "rgba(255,255,255,0.05)"; cg.fillRect(px + 24, y + 7, pw - 48, 1.5); }
    // Ziffern um den Kanalknopf
    cg.fillStyle = "rgba(235,220,190,0.65)"; font(cg, 700, 18, "I"); cg.textAlign = "center"; cg.textBaseline = "middle";
    for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + i * Math.PI / 6; cg.fillText(String(i + 2), px + pw / 2 + Math.cos(a) * 82, 150 + Math.sin(a) * 82); }
    st.cab = cab;
    // Drehknopf (Chrom, geriffelt)
    const kn = hstCv(150, 150), kg = kn.getContext("2d"); rg = kg.createRadialGradient(60, 55, 4, 75, 75, 66); rg.addColorStop(0, "#f4f4f2"); rg.addColorStop(0.45, "#a9a59d"); rg.addColorStop(0.85, "#4d4943"); rg.addColorStop(1, "#24221f");
    kg.fillStyle = rg; kg.beginPath(); kg.arc(75, 75, 62, 0, 7); kg.fill();
    for (let i = 0; i < 36; i++) { const a = i * Math.PI / 18; kg.strokeStyle = i % 2 ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.22)"; kg.lineWidth = 3; kg.beginPath(); kg.moveTo(75 + Math.cos(a) * 50, 75 + Math.sin(a) * 50); kg.lineTo(75 + Math.cos(a) * 61, 75 + Math.sin(a) * 61); kg.stroke(); }
    rg = kg.createRadialGradient(68, 66, 2, 75, 75, 44); rg.addColorStop(0, "#ffffff"); rg.addColorStop(0.5, "#c9c5bd"); rg.addColorStop(1, "#6d6860"); kg.fillStyle = rg; kg.beginPath(); kg.arc(75, 75, 44, 0, 7); kg.fill();
    kg.fillStyle = "#c0261d"; rr(kg, 71, 26, 8, 34, 4); kg.fill();
    st.knob = kn;
    // Spiegelung im Glas (Fenster mit Sprossen, weich)
    const rf = hstCv(HST.sw + 40, HST.sh + 40), rgc = rf.getContext("2d"); rgc.filter = "blur(9px)";
    rgc.save(); rgc.translate(140, 95); rgc.rotate(-0.08); rgc.fillStyle = "rgba(200,225,255,0.16)"; rr(rgc, 0, 0, 170, 130, 12); rgc.fill();
    rgc.fillStyle = "rgba(0,0,0,0.5)"; rgc.globalCompositeOperation = "destination-out"; rgc.fillRect(80, -10, 10, 150); rgc.fillRect(-10, 60, 190, 10); rgc.restore();
    rgc.filter = "none"; st.refl = rf;
  },
  draw(g, u, d, p, sc, P) {
    const st = sc.st, Tm = hstTimes(d), { tOff, a, b } = Tm; const { SW, SH } = HST; const ko = u - tOff;
    // Kamera: langsam näher, kleiner Ruck beim Abschalten
    const z = 1 + 0.06 * inOut(cl(u / Math.max(1, d))); let jx = 0, jy = 0; if (ko >= 0 && ko < 0.3) { const k = 6 * Math.exp(-ko / 0.06); jx = Math.sin(ko * 90) * k; jy = Math.cos(ko * 70) * k; }
    g.drawImage(st.bg, 0, 0);
    // Bildinhalt
    const s = st.src.getContext("2d"); s.setTransform(1, 0, 0, 1, 0, 0); s.globalAlpha = 1; s.globalCompositeOperation = "source-over";
    const fi = Math.floor(u * 30); const snow = (alpha) => { const n = st.snow[fi % 6]; s.globalAlpha = alpha; const fx = (fi * 7) % 2 ? -1 : 1; s.save(); s.translate(SW / 2, SH / 2); s.scale(fx * SW / 320 * 1.02, SH / 240 * 1.02); s.drawImage(n, -160 + ((fi * 37) % 9), -120 + ((fi * 13) % 7)); s.restore(); s.globalAlpha = 1; };
    let glowCol = [180, 190, 210], glowA = 0, phase;
    if (u < a) {
      phase = 0; snow(1);
      // Störstreifen laufen durchs Bild
      for (let i = 0; i < 3; i++) { const y = ((u * (520 + i * 190) + i * 170) % (SH + 120)) - 60; const gr = s.createLinearGradient(0, y - 40, 0, y + 40); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, i === 1 ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.42)"); gr.addColorStop(1, "rgba(0,0,0,0)"); s.fillStyle = gr; s.fillRect(0, y - 40, SW, 80); }
      glowA = 0.55 + 0.15 * rnd(fi);
    } else if (u < b) {
      phase = 1; s.fillStyle = "#000"; s.fillRect(0, 0, SW, SH);
      const roll = (u - a) * 1500 * (1 - 0.55 * seg(u, a, b)); const off = roll % (SH + 70);
      for (let k = -1; k <= 0; k++) { const y0 = off + k * (SH + 70); for (let band = 0; band < 16; band++) { const by = band * SH / 16; const jitter = Math.sin(band * 1.7 + u * 40) * 22 * (1 - seg(u, a, b) * 0.7) + (rnd(fi * 3 + band) > 0.85 ? 40 : 0);
        s.drawImage(st.tc, 0, by, SW, SH / 16 + 1, jitter, y0 + by, SW, SH / 16 + 1); } }
      s.fillStyle = "rgba(0,0,0,0.25)"; s.fillRect(0, 0, SW, SH); snow(0.42);
      glowCol = [170, 140, 170]; glowA = 0.45;
    } else {
      phase = 2; s.drawImage(st.tc, 0, 0);
      const k = seg(u, b, b + 0.12); if (k < 1) { s.fillStyle = `rgba(255,255,255,${0.35 * (1 - k)})`; s.fillRect(0, 0, SW, SH); }
      snow(0.07);
      { const y = ((u - b) * 140) % (SH + 160) - 80; const gr = s.createLinearGradient(0, y - 60, 0, y + 60); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.5, "rgba(0,0,0,0.16)"); gr.addColorStop(1, "rgba(0,0,0,0)"); s.fillStyle = gr; s.fillRect(0, y - 60, SW, 120); }
      // Einblendung KEIN SIGNAL
      const q = seg(u, b + 0.08, b + 0.24); if (q > 0) {
        const e = outExpo(q); const tw = SW * 0.74, th = 110; font(s, 900, 70); const px_ = fitPx(s, st.title, tw - 60, 70, 900);
        s.save(); s.translate(SW / 2, SH / 2); s.scale(lerp(1.25, 1, e), Math.max(0.04, e));
        s.fillStyle = "rgba(0,0,0,0.88)"; rr(s, -tw / 2, -th / 2, tw, th, 10); s.fill(); s.strokeStyle = "rgba(255,255,255,0.9)"; s.lineWidth = 4; rr(s, -tw / 2 + 6, -th / 2 + 6, tw - 12, th - 12, 6); s.stroke();
        const blink = (Math.floor((u - b) * 2.2) % 2 === 1 && q >= 1) ? 0.78 : 1;
        s.globalAlpha = blink; s.fillStyle = "#ffffff"; s.textAlign = "center"; s.textBaseline = "middle"; font(s, 900, px_); s.letterSpacing = "4px"; s.fillText(st.title, 0, 4); s.letterSpacing = "0px"; s.restore(); s.globalAlpha = 1;
      }
      glowCol = [190, 170, 200]; glowA = 0.42;
    }
    // Abschalten: Bild klappt zum Strich, dann zum Punkt
    let offMode = 0, sy = 1, sxk = 1, white = 0, dotA = 0;
    if (ko >= 0) {
      if (ko < 0.09) { offMode = 1; const e = in3(ko / 0.09); sy = lerp(1, 0.012, e); white = e; }
      else if (ko < 0.24) { offMode = 2; const e = inOut((ko - 0.09) / 0.15); sy = 0.012; sxk = lerp(1, 0.012, e); white = 1; }
      else { offMode = 3; dotA = Math.exp(-(ko - 0.24) * 2.2); }
      glowA *= ko < 0.24 ? 1.2 : dotA * 0.5; glowCol = [220, 230, 255];
    }
    // Wölbung in zwei Durchgängen (Zeilen, dann Spalten)
    const t1 = st.t1.getContext("2d"), t2 = st.t2.getContext("2d"); t1.clearRect(0, 0, SW, SH); t2.clearRect(0, 0, SW, SH); const kb = 0.07;
    for (let y = 0; y < SH; y += 4) { const ny = (y + 2 - SH / 2) / (SH / 2); const w2 = SW * (1 - kb * ny * ny); t1.drawImage(st.src, 0, y, SW, 4, (SW - w2) / 2, y, w2, 4); }
    for (let x = 0; x < SW; x += 4) { const nx = (x + 2 - SW / 2) / (SW / 2); const h2 = SH * (1 - kb * nx * nx); t2.drawImage(st.t1, x, 0, 4, SH, x, (SH - h2) / 2, 4, h2); }
    t2.drawImage(st.scan, 0, 0);
    g.save(); g.translate(HST.cx + jx, HST.cy + jy + 34); g.scale(z, z); g.translate(-HST.cx, -HST.cy);
    // Lichtschein des Bildschirms auf Wand und Anrichte
    if (glowA > 0.01) { const fl = 0.85 + 0.15 * rnd(fi * 1.3); const [r, gg, bb] = glowCol; let rg = g.createRadialGradient(HST.sx + HST.sw / 2, HST.sy + HST.sh / 2, 100, HST.sx + HST.sw / 2, HST.sy + HST.sh / 2, 900);
      rg.addColorStop(0, `rgba(${r},${gg},${bb},${0.6 * glowA * fl})`); rg.addColorStop(0.45, `rgba(${r},${gg},${bb},${0.18 * glowA * fl})`); rg.addColorStop(1, `rgba(${r},${gg},${bb},0)`); g.fillStyle = rg; g.fillRect(-100, -100, W + 200, H + 200);
      rg = g.createRadialGradient(470, 1250, 0, 470, 1250, 560); rg.addColorStop(0, `rgba(${r},${gg},${bb},${0.32 * glowA * fl})`); rg.addColorStop(1, `rgba(${r},${gg},${bb},0)`); g.fillStyle = rg; g.fillRect(-100, 1228, W + 200, 600); }
    // Füße und Gehäuse
    g.fillStyle = "#1a100a"; rr(g, 150, 1200, 46, 34, 6); g.fill(); rr(g, 884, 1200, 46, 34, 6); g.fill();
    shadow(g, 60, 26, "rgba(0,0,0,0.6)"); g.drawImage(st.cab, 60, 450); noShadow(g);
    // Bildschirm
    g.save(); hstScreenPath(g, HST.sx, HST.sy, HST.sw, HST.sh); g.clip();
    g.fillStyle = "#0e1312"; g.fillRect(HST.sx - 20, HST.sy - 20, HST.sw + 40, HST.sh + 40);
    const scx = HST.sx + HST.sw / 2, scy = HST.sy + HST.sh / 2;
    if (offMode < 3) {
      g.save(); g.translate(scx, scy); g.scale(sxk, sy);
      g.drawImage(st.t2, -HST.sw / 2 - 8, -HST.sh / 2 - 8, HST.sw + 16, HST.sh + 16);
      if (white > 0) { g.fillStyle = `rgba(235,242,255,${white})`; g.fillRect(-HST.sw / 2, -HST.sh / 2, HST.sw, HST.sh); }
      g.restore();
      if (offMode >= 1) { const gw = HST.sw * sxk, gh = Math.max(6, HST.sh * sy); const rg = g.createRadialGradient(scx, scy, 0, scx, scy, Math.max(gw, 60) * 0.7);
        rg.addColorStop(0, "rgba(200,220,255,0.55)"); rg.addColorStop(1, "rgba(200,220,255,0)"); g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = rg; g.fillRect(scx - gw, scy - gh * 6 - 40, gw * 2, gh * 12 + 80); g.restore(); }
    } else if (dotA > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter"; const rg = g.createRadialGradient(scx, scy, 0, scx, scy, 70); rg.addColorStop(0, `rgba(240,248,255,${dotA})`); rg.addColorStop(0.12, `rgba(190,215,255,${0.8 * dotA})`); rg.addColorStop(1, "rgba(120,160,255,0)"); g.fillStyle = rg; g.fillRect(scx - 70, scy - 70, 140, 140); g.restore();
    }
    // Glas: Wölbungsschatten, Spiegelung von Fenster und Lampe
    let rg = g.createRadialGradient(scx - 60, scy - 80, 80, scx, scy, HST.sw * 0.66); rg.addColorStop(0, "rgba(255,255,255,0)"); rg.addColorStop(0.75, "rgba(0,0,0,0.08)"); rg.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = rg; g.fillRect(HST.sx - 20, HST.sy - 20, HST.sw + 40, HST.sh + 40);
    const rf = ko >= 0.24 ? 1.7 : 1; g.globalAlpha = rf * 0.6; g.drawImage(st.refl, HST.sx - 20, HST.sy - 20); g.globalAlpha = 1;
    rg = g.createLinearGradient(HST.sx, HST.sy, HST.sx + HST.sw * 0.6, HST.sy + HST.sh * 0.6); rg.addColorStop(0, `rgba(255,255,255,${0.16 * rf})`); rg.addColorStop(0.35, `rgba(255,255,255,${0.03 * rf})`); rg.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = rg; g.fillRect(HST.sx, HST.sy, HST.sw, HST.sh);
    rg = g.createRadialGradient(HST.sx + HST.sw - 40, HST.sy + 30, 0, HST.sx + HST.sw - 40, HST.sy + 30, 160); rg.addColorStop(0, `rgba(255,190,120,${0.14 * rf})`); rg.addColorStop(1, "rgba(255,190,120,0)"); g.fillStyle = rg; g.fillRect(HST.sx, HST.sy, HST.sw, HST.sh);
    g.restore();
    g.strokeStyle = "rgba(255,255,255,0.14)"; g.lineWidth = 2.5; hstScreenPath(g, HST.sx, HST.sy, HST.sw, HST.sh); g.stroke();
    // Kanalknopf dreht bei jedem Knacks, Lautstärkeknopf, Betriebslampe
    const turns = [0, a, b]; let ang = -0.6; for (const t of turns) ang += 0.5236 * outBack(seg(u, t, t + 0.09), 2.5); if (ko >= 0) ang += 0;
    const kx = 60 + 740 + 95, ky = 450 + 150;
    g.save(); g.translate(kx, ky); g.rotate(ang); shadow(g, 18, 8, "rgba(0,0,0,0.6)"); g.drawImage(st.knob, -75, -75); noShadow(g); g.restore();
    g.save(); g.translate(kx, 450 + 300); g.rotate(0.9 - (ko >= 0 ? 0.9 * out3(seg(ko, 0, 0.12)) : 0)); g.scale(0.62, 0.62); shadow(g, 14, 6, "rgba(0,0,0,0.6)"); g.drawImage(st.knob, -75, -75); noShadow(g); g.restore();
    const on = ko < 0; const lx = kx, ly = 450 + 372; rg = g.createRadialGradient(lx, ly, 0, lx, ly, on ? 30 : 8); rg.addColorStop(0, on ? "rgba(255,90,60,1)" : "rgba(70,20,15,1)"); rg.addColorStop(0.3, on ? "rgba(255,60,40,0.6)" : "rgba(40,10,8,1)"); rg.addColorStop(1, "rgba(255,60,40,0)");
    g.fillStyle = rg; g.fillRect(lx - 30, ly - 30, 60, 60);
    g.restore();
    // Rand abdunkeln, Untertitelbereich ruhig
    rg = g.createRadialGradient(540, 860, 420, 540, 860, 1200); rg.addColorStop(0, "rgba(0,0,0,0)"); rg.addColorStop(1, `rgba(0,0,0,${ko >= 0.24 ? 0.75 : 0.55})`); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    if (ko >= 0.24) { g.fillStyle = `rgba(0,0,0,${0.35 * seg(ko, 0.24, 0.6)})`; g.fillRect(0, 0, W, H); }
  },
  ev(d, p) {
    const { tOff, a, b } = hstTimes(d); const E = [[0, "static_click", 0.9, 0.25]];
    const tile = (t0, t1, name, gain) => { let t = t0; for (const L of [100, 50, 20, 10]) while (t + L / 1000 <= t1 + 0.004) { E.push([Math.round(t * 1000) / 1000, `${name}_${L}`, gain, 0]); t += L / 1000; } };
    tile(0, a, "static_snow", 0.85); E.push([a, "static_click", 0.9, 0.25]);
    tile(a, b, "static_roll", 0.75); E.push([b, "static_click", 0.85, 0.25]);
    tile(b + 0.02, tOff, "static_tone", 0.42);
    E.push([tOff, "static_off", 1.0, 0]);
    return E;
  },
};
