// VOICE_DELAY: 0.6
// h_cash: Offene Kassenschublade, Geldscheine und Münzen werden in einen Strudel gesogen, Zähler „Verlorene Anfragen“ zählt hoch.
// Parameter: label (Text über dem Zähler, Standard „Verlorene Anfragen“)
for (const f of ["700 30px I", "600 30px I", "900 30px D", "800 30px D"]) document.fonts.load(f);
const HC_VC = { x: 540, y: 585 };           // Mitte des Strudels
const HC_DX = 40, HC_DY = 735;               // Lage der Schublade (lokales Bild 1000 x 600)
function hc_floor(s, t) { // Punkt auf dem Schubladenboden (s quer, t von hinten nach vorn) in lokalen Koordinaten
  const y = lerp(102, 322, t), xl = lerp(162, 52, t), xr = lerp(838, 948, t);
  return [lerp(xl, xr, s), y, (xr - xl) / 896];
}
function hc_times(d) {
  const tc = Math.max(1.35, d - 0.5);                 // Implosion des Strudels
  const F = cl(0.24 * tc + 0.05) * 0.8 + 0.0;         // Flugzeit eines Scheins
  const fl = Math.max(0.5, Math.min(0.78, F));
  const last = tc - fl - 0.06, first = 0.08;
  const nb = Math.max(6, Math.min(18, Math.round((last - first) / 0.12) + 1));
  const bills = []; for (let i = 0; i < nb; i++) { const k = nb === 1 ? 0 : i / (nb - 1); bills.push(first + (last - first) * (1 - Math.pow(1 - k, 1.35))); }
  const nc = Math.max(5, Math.min(11, Math.round((tc - 0.6) / 0.2)));
  const coins = []; for (let j = 0; j < nc; j++) { const k = nc === 1 ? 0 : j / (nc - 1); coins.push(0.16 + (tc - 0.78) * k + (rnd(j * 3.3 + 1) - 0.5) * 0.05); }
  const flick = [0.16, 0.24, 0.42, 0.5, 0.58, 0.86, 0.94, 1.3, 1.36, 1.6].map((x) => tc + x).filter((x) => x < d + 0.3);
  return { tc, fl, bills, coins, flick };
}
function hc_lamp(u, T) { // Helligkeit der Lampe 0..1, flackert nach der Implosion
  if (u < T.tc + 0.12) return 1;
  let on = true; for (const f of T.flick) if (u >= f) on = !on;
  const base = on ? 0.95 : 0.16; return base * (0.92 + 0.08 * rnd(Math.floor(u * 60)));
}
function hc_seg7(g, x, y, h, str, on, off) { // Siebensegment-Ziffern, rechtsbündig ab x
  const w = h * 0.52, t = h * 0.13, gap = h * 0.2; const SEG = { 0: "abcdef", 1: "bc", 2: "abged", 3: "abgcd", 4: "fgbc", 5: "afgcd", 6: "afgedc", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  const segs = (ch, cx, col) => {
    const P = { a: [cx, y - h / 2, w, t, 0], d: [cx, y + h / 2 - t, w, t, 0], g: [cx, y - t / 2, w, t, 0], f: [cx, y - h / 2, t, h / 2, 1], b: [cx + w - t, y - h / 2, t, h / 2, 1], e: [cx, y, t, h / 2, 1], c: [cx + w - t, y, t, h / 2, 1] };
    for (const k in P) { const [sx, sy, sw, sh] = P[k]; const lit = ch != null && SEG[ch].includes(k); g.fillStyle = lit ? col : off; g.beginPath(); g.roundRect(sx + 2, sy + 2, sw - 4, sh - 4, t * 0.45); g.fill(); }
  };
  const n = Math.max(2, str.length); let cx = x - w;
  for (let i = 0; i < n; i++) { const ch = str[str.length - 1 - i]; segs(ch == null ? null : ch, cx, on); cx -= w + gap; }
}
function hc_bill(c, hue, val) { // stilisierter Geldschein (eigene Gestaltung)
  const g = c.getContext("2d"); const w = c.width, h = c.height; const col = `hsl(${hue},55%,52%)`, dk = `hsl(${hue},60%,30%)`, lt = `hsl(${hue},70%,78%)`;
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, lt); gr.addColorStop(0.45, col); gr.addColorStop(1, dk);
  g.fillStyle = gr; rr(g, 0, 0, w, h, 10); g.fill();
  g.save(); rr(g, 0, 0, w, h, 10); g.clip();
  g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 1.5;
  for (let k = 0; k < 16; k++) { g.beginPath(); for (let x = 0; x <= w; x += 6) g.lineTo(x, h * 0.5 + Math.sin(x * 0.045 + k * 0.4) * (h * 0.38) * Math.cos(k * 0.21)); g.stroke(); }
  const rg = g.createRadialGradient(w * 0.28, h * 0.5, 4, w * 0.28, h * 0.5, h * 0.42); rg.addColorStop(0, "rgba(255,255,255,0.75)"); rg.addColorStop(1, "rgba(255,255,255,0.08)");
  g.fillStyle = rg; g.beginPath(); g.arc(w * 0.28, h * 0.5, h * 0.36, 0, 7); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)"; g.lineWidth = 3; g.strokeRect(9, 9, w - 18, h - 18);
  txt(g, "€", w * 0.28, h * 0.53, { w: 900, px: h * 0.52, c: dk });
  txt(g, val, w - 22, h * 0.3, { w: 900, px: h * 0.32, c: "rgba(255,255,255,0.92)", al: "right" });
  txt(g, val, w - 22, h * 0.78, { w: 800, px: h * 0.16, c: "rgba(255,255,255,0.6)", al: "right" });
  g.restore();
}
function hc_coin(c, gold) {
  const g = c.getContext("2d"); const r = c.width / 2;
  const gr = g.createRadialGradient(r * 0.7, r * 0.6, 2, r, r, r); if (gold) { gr.addColorStop(0, "#fff3c0"); gr.addColorStop(0.4, "#f2c14e"); gr.addColorStop(1, "#8a5a12"); } else { gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.45, "#c8ced8"); gr.addColorStop(1, "#5d6470"); }
  g.fillStyle = gr; g.beginPath(); g.arc(r, r, r - 1, 0, 7); g.fill();
  g.strokeStyle = gold ? "rgba(110,70,10,0.8)" : "rgba(60,65,75,0.8)"; g.lineWidth = r * 0.1; g.beginPath(); g.arc(r, r, r * 0.8, 0, 7); g.stroke();
  txt(g, "€", r, r * 1.05, { w: 900, px: r * 1.0, c: gold ? "rgba(120,75,10,0.85)" : "rgba(70,75,85,0.85)" });
}
TYPES.h_cash = {
  zone: "bottom", pal: "black", bgv: 0, coverT: 1.45,
  prep(sc, p) {
    const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
    // Hintergrund: dunkler Raum, warmer Dunst
    const bg = mk(W, H); let g = bg.getContext("2d");
    let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#07050d"); gr.addColorStop(0.5, "#0d0814"); gr.addColorStop(1, "#050407"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) { const x = rnd(i * 7.1) * W, y = 300 + rnd(i * 3.7) * 1300, r = 30 + rnd(i * 5.3) * 90; const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(${180 + rnd(i) * 70 | 0},${60 + rnd(i * 2) * 80 | 0},${140 + rnd(i * 9) * 100 | 0},0.07)`); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
    sc.st.bg = bg;
    // Strudel-Textur: Spiralarme, außen violett, innen glühend
    const vt = mk(900, 900); g = vt.getContext("2d"); g.translate(450, 450); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    const ARMS = 7;
    for (let a = 0; a < ARMS; a++) for (let j = 0; j < 7; j++) {
      const ph = a * Math.PI * 2 / ARMS + j * 0.07 + rnd(a * 13 + j) * 0.12; const kk = 0.9 + rnd(a + j * 5) * 0.5; let px = null, py = null;
      for (let r = 440; r > 34; r *= 0.975) {
        const th = ph + kk * 2.3 * Math.log(440 / r); const x = Math.cos(th) * r, y = Math.sin(th) * r; const q = r / 440;
        if (px !== null) {
          const al = (0.05 + 0.2 * (1 - q)) * (1 - Math.pow(q, 6)) * (0.5 + 0.5 * rnd(a * 3 + j * 11));
          const cR = q > 0.55 ? 150 : q > 0.25 ? 255 : 255, cG = q > 0.55 ? 60 : q > 0.25 ? 70 : 190, cB = q > 0.55 ? 255 : q > 0.25 ? 170 : 110;
          g.strokeStyle = `rgba(${cR},${cG},${cB},${al.toFixed(3)})`; g.lineWidth = 2 + 10 * q * (j % 3 === 0 ? 1.6 : 0.7); g.beginPath(); g.moveTo(px, py); g.lineTo(x, y); g.stroke();
        }
        px = x; py = y;
      }
    }
    for (let i = 0; i < 260; i++) { const r = 40 + Math.pow(rnd(i * 1.7), 0.7) * 400, th = rnd(i * 2.9) * 7; g.fillStyle = `rgba(255,${180 + rnd(i) * 70 | 0},${200 + rnd(i * 4) * 55 | 0},${0.25 + rnd(i * 6) * 0.5})`; g.beginPath(); g.arc(Math.cos(th) * r, Math.sin(th) * r, 1 + rnd(i * 8) * 2.5, 0, 7); g.fill(); }
    let rg = g.createRadialGradient(0, 0, 0, 0, 0, 440); rg.addColorStop(0, "rgba(255,210,150,0.55)"); rg.addColorStop(0.18, "rgba(255,70,170,0.32)"); rg.addColorStop(0.55, "rgba(110,40,220,0.16)"); rg.addColorStop(1, "rgba(60,20,140,0)");
    g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 440, 0, 7); g.fill();
    sc.st.vt = vt;
    // Schublade leer (lokal 1000 x 600)
    const dr = mk(1000, 600); g = dr.getContext("2d");
    // Rand oben (Chrom) und Innenraum
    g.beginPath(); g.moveTo(112, 34); g.lineTo(888, 34); g.lineTo(988, 336); g.lineTo(12, 336); g.closePath();
    gr = g.createLinearGradient(0, 34, 0, 336); gr.addColorStop(0, "#5a5f6b"); gr.addColorStop(1, "#c9ced8"); g.fillStyle = gr; g.fill();
    g.beginPath(); g.moveTo(140, 50); g.lineTo(860, 50); g.lineTo(962, 326); g.lineTo(38, 326); g.closePath(); g.fillStyle = "#121318"; g.fill();
    // hintere Innenwand
    g.beginPath(); g.moveTo(140, 50); g.lineTo(860, 50); g.lineTo(838, 102); g.lineTo(162, 102); g.closePath();
    gr = g.createLinearGradient(0, 50, 0, 102); gr.addColorStop(0, "#23252c"); gr.addColorStop(1, "#3a3d46"); g.fillStyle = gr; g.fill();
    // Seitenwände innen
    g.fillStyle = "#1b1c22"; g.beginPath(); g.moveTo(140, 50); g.lineTo(162, 102); g.lineTo(52, 322); g.lineTo(38, 326); g.closePath(); g.fill();
    g.fillStyle = "#2a2c34"; g.beginPath(); g.moveTo(860, 50); g.lineTo(838, 102); g.lineTo(948, 322); g.lineTo(962, 326); g.closePath(); g.fill();
    // Boden
    g.beginPath(); const f00 = hc_floor(0, 0), f10 = hc_floor(1, 0), f11 = hc_floor(1, 1), f01 = hc_floor(0, 1);
    g.moveTo(f00[0], f00[1]); g.lineTo(f10[0], f10[1]); g.lineTo(f11[0], f11[1]); g.lineTo(f01[0], f01[1]); g.closePath();
    gr = g.createLinearGradient(0, 102, 0, 322); gr.addColorStop(0, "#2d2f37"); gr.addColorStop(1, "#4a4d57"); g.fillStyle = gr; g.fill();
    // Fächer: Scheine hinten (4), Münzen vorn (5)
    for (let i = 0; i < 4; i++) { const a = hc_floor(i * 0.25 + 0.012, 0.03), b = hc_floor(i * 0.25 + 0.238, 0.03), c = hc_floor(i * 0.25 + 0.238, 0.54), d0 = hc_floor(i * 0.25 + 0.012, 0.54);
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d0[0], d0[1]); g.closePath(); gr = g.createLinearGradient(0, a[1], 0, c[1]); gr.addColorStop(0, "#1a1b21"); gr.addColorStop(1, "#2a2c33"); g.fillStyle = gr; g.fill(); }
    for (let j = 0; j < 5; j++) { const a = hc_floor(j * 0.2 + 0.02, 0.62), c = hc_floor(j * 0.2 + 0.18, 0.97); const cx = (a[0] + c[0]) / 2, cy = (a[1] + c[1]) / 2, rw = (c[0] - a[0]) / 2, rh = (c[1] - a[1]) / 2;
      rg = g.createRadialGradient(cx, cy - rh * 0.3, 2, cx, cy, rw); rg.addColorStop(0, "#0c0d10"); rg.addColorStop(1, "#2b2d35"); g.fillStyle = rg; g.beginPath(); g.ellipse(cx, cy, rw, rh, 0, 0, 7); g.fill();
      g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy, rw, rh, 0, 0.1, Math.PI - 0.1); g.stroke(); }
    // Trennwände (mit Kante)
    const wall = (p1, p2, hgt) => { g.fillStyle = "#6b707c"; g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); g.lineTo(p2[0], p2[1] - hgt * p2[2]); g.lineTo(p1[0], p1[1] - hgt * p1[2]); g.closePath(); g.fill();
      g.strokeStyle = "#e6e9ef"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(p1[0], p1[1] - hgt * p1[2]); g.lineTo(p2[0], p2[1] - hgt * p2[2]); g.stroke(); };
    for (let i = 1; i < 4; i++) wall(hc_floor(i * 0.25, 0.0), hc_floor(i * 0.25, 0.56), 26);
    wall(hc_floor(0, 0.58), hc_floor(1, 0.58), 22);
    // vordere Kante (Chrom) und Front
    gr = g.createLinearGradient(0, 330, 0, 352); gr.addColorStop(0, "#f4f6fa"); gr.addColorStop(0.5, "#9aa1ad"); gr.addColorStop(1, "#3b3f48"); g.fillStyle = gr; g.fillRect(12, 334, 976, 18);
    gr = g.createLinearGradient(0, 352, 0, 596); gr.addColorStop(0, "#3c404a"); gr.addColorStop(0.12, "#2a2d35"); gr.addColorStop(1, "#15161b"); g.fillStyle = gr; g.fillRect(12, 352, 976, 244);
    g.globalAlpha = 0.06; for (let y = 356; y < 596; y += 3) { g.fillStyle = rnd(y) > 0.5 ? "#ffffff" : "#000000"; g.fillRect(12, y, 976, 1); } g.globalAlpha = 1;
    gr = g.createLinearGradient(12, 0, 988, 0); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.3, "rgba(255,255,255,0.08)"); gr.addColorStop(0.45, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(255,255,255,0.04)"); g.fillStyle = gr; g.fillRect(12, 352, 976, 244);
    // Griffmulde und Schloss
    fillRR(g, 380, 560, 240, 20, 10, "#0b0b0e"); g.fillStyle = "rgba(255,255,255,0.15)"; g.fillRect(390, 579, 220, 2);
    rg = g.createRadialGradient(905, 470, 2, 905, 470, 26); rg.addColorStop(0, "#e9edf3"); rg.addColorStop(1, "#5d636e"); g.fillStyle = rg; g.beginPath(); g.arc(905, 470, 24, 0, 7); g.fill();
    g.fillStyle = "#16171b"; g.beginPath(); g.arc(905, 465, 6, 0, 7); g.fill(); g.fillRect(902, 465, 6, 16);
    // Anzeige-Fenster
    fillRR(g, 240, 420, 520, 124, 16, "#050203"); g.strokeStyle = "#7a808c"; g.lineWidth = 3; rr(g, 240, 420, 520, 124, 16); g.stroke();
    // Beschriftung (graviert)
    const lab = (p.label || "Verlorene Anfragen").toUpperCase(); const lpx = fitPx(g, lab, 640, 30, 700, "I");
    txt(g, lab, 500, 391, { w: 700, px: lpx, fam: "I", c: "rgba(0,0,0,0.55)", ls: 5 }); txt(g, lab, 500, 389, { w: 700, px: lpx, fam: "I", c: "#c7ccd6", ls: 5 });
    // Schatten unter der Schublade
    sc.st.drawer = dr;
    // Scheine und Münzen
    sc.st.bills = [[150, "20"], [205, "50"], [32, "100"], [275, "10"]].map(([h, v]) => { const c = mk(300, 150); hc_bill(c, h, v); return c; });
    sc.st.coins = [true, false].map((gd) => { const c = mk(80, 80); hc_coin(c, gd); return c; });
    // Lichtfleck (Lampe)
    const glow = mk(256, 256); g = glow.getContext("2d"); rg = g.createRadialGradient(128, 128, 0, 128, 128, 128); rg.addColorStop(0, "rgba(255,255,255,1)"); rg.addColorStop(0.25, "rgba(255,255,255,0.45)"); rg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
    sc.st.glow = glow;
  },
  // Position eines Objekts auf dem Weg in den Strudel. k = 0..1, start = [x, y] im Bild, i = Index
  path(k, sx, sy, i) {
    const dx = sx - HC_VC.x; const R0 = Math.max(Math.abs(dx) + 40, 230); const th0 = Math.acos(cl((dx / R0 + 1) / 2) * 2 - 1);
    const turns = 2.4 + rnd(i * 2.1) * 0.8; const kk = Math.pow(k, 1.15);
    const th = th0 - turns * Math.PI * kk;                     // gleiche Drehrichtung wie der Strudel
    const r = R0 * Math.pow(1 - kk, 1.1), ry = 0.36;
    const yc = lerp(sy - Math.sin(th0) * R0 * ry, HC_VC.y - 20, inOut(cl(k * 1.25)));
    return [HC_VC.x + Math.cos(th) * r, yc + Math.sin(th) * r * ry, th];
  },
  draw(g, u, d, p, sc, P) {
    const T = hc_times(d); const tc = T.tc; const st = sc.st;
    const lamp = hc_lamp(u, T);
    // Strudel-Stärke: ab Bild 0 da, wächst, implodiert bei tc
    const vs = u < tc - 0.16 ? lerp(0.8, 1.0, out3(cl(u / 0.5))) + 0.02 * Math.sin(u * 9) + 0.16 * inOut(seg(u, tc - 0.5, tc - 0.16)) : 1.16 * Math.max(0, 1 - inExpo(seg(u, tc - 0.16, tc)));
    const vOn = u < tc ? 1 : 0;
    // Schütteln: leicht während des Sogs, stark bei der Implosion
    const sh = (u < tc ? 3 * cl(u / 1.5) : 0) + 24 * Math.exp(-Math.max(0, u - tc) / 0.09) * (u >= tc ? 1 : 0);
    const shx = Math.sin(u * 83) * sh, shy = Math.cos(u * 71) * sh;
    g.drawImage(st.bg, 0, 0);
    g.save(); g.translate(shx, shy);
    // Lichtkegel der Lampe (warm, von oben vorn) und Lichtfleck unter der Schublade
    g.save(); g.globalCompositeOperation = "lighter";
    g.globalAlpha = 0.22 * lamp; g.drawImage(st.glow, 540 - 700, 1030 - 330, 1400, 660);
    const cone = g.createLinearGradient(0, 380, 0, 1300); cone.addColorStop(0, `rgba(255,190,120,${0.0})`); cone.addColorStop(1, `rgba(255,170,100,${0.10 * lamp})`);
    g.globalAlpha = 1; g.fillStyle = cone; g.beginPath(); g.moveTo(470, 380); g.lineTo(610, 380); g.lineTo(1040, 1300); g.lineTo(40, 1300); g.closePath(); g.fill();
    g.restore();
    // Strudel: drei Schichten nach oben (Trichter), Licht ins Zimmer
    if (vs > 0.001) {
      g.save(); g.globalCompositeOperation = "lighter";
      g.globalAlpha = 0.5 * vs; g.drawImage(st.glow, HC_VC.x - 620 * vs, HC_VC.y - 380 * vs, 1240 * vs, 760 * vs);
      const lay = [[-120, 0.5, 3.4, 0.55], [-60, 0.75, 2.6, 0.75], [0, 1.0, 1.9, 1.0]];
      for (const [oy, s, sp, al] of lay) {
        g.save(); g.translate(HC_VC.x, HC_VC.y + oy * vs); g.scale(s * vs, s * vs * 0.36); g.rotate(-u * sp - oy * 0.01); g.globalAlpha = al; g.drawImage(st.vt, -450, -450); g.restore();
      }
      g.restore();
      // Auge des Strudels
      g.save(); g.translate(HC_VC.x, HC_VC.y - 30 * vs); g.scale(vs, vs * 0.36);
      let rg = g.createRadialGradient(0, 0, 0, 0, 0, 150); rg.addColorStop(0, "rgba(0,0,0,1)"); rg.addColorStop(0.55, "rgba(10,0,20,0.95)"); rg.addColorStop(0.8, "rgba(255,120,200,0.55)"); rg.addColorStop(1, "rgba(255,120,200,0)");
      g.fillStyle = rg; g.beginPath(); g.arc(0, 0, 150, 0, 7); g.fill(); g.restore();
      // Teilchen, die hineinwirbeln (mit Schweif)
      g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
      for (let i = 0; i < 80; i++) {
        const ph = rnd(i * 3.1) , life = 0.9 + rnd(i * 1.7) * 0.6; const k = ((u / life + ph) % 1);
        const r0 = 470 * (1 - Math.pow(k, 0.8)) * vs + 30; const th = rnd(i * 5.9) * 7 - u * (2.5 + 260 / r0);
        const th2 = th + (0.06 + 14 / r0); const yy = HC_VC.y - 60 * k * vs;
        const x1 = HC_VC.x + Math.cos(th) * r0, y1 = yy + Math.sin(th) * r0 * 0.36, x2 = HC_VC.x + Math.cos(th2) * r0, y2 = yy + Math.sin(th2) * r0 * 0.36;
        g.strokeStyle = i % 3 ? `rgba(255,${150 + (i % 5) * 20},220,${0.55 * vs})` : `rgba(255,215,130,${0.7 * vs})`; g.lineWidth = 2 + (i % 4);
        g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
      }
      g.restore();
    }
    // Implosion: Blitz + Ring
    if (u >= tc - 0.02 && u < tc + 0.7) {
      const k = u - tc; g.save(); g.globalCompositeOperation = "lighter";
      const f = Math.exp(-Math.max(0, k) / 0.08); g.globalAlpha = f; g.drawImage(st.glow, HC_VC.x - 500, HC_VC.y - 500, 1000, 1000);
      for (let n = 0; n < 2; n++) { const kk = cl((k - n * 0.08) / 0.5); if (kk <= 0 || kk >= 1) continue; g.globalAlpha = 1 - kk; g.strokeStyle = n ? "#ffd38a" : "#ff6fd0"; g.lineWidth = 16 * (1 - kk) + 2;
        g.beginPath(); g.ellipse(HC_VC.x, HC_VC.y, out3(kk) * 700, out3(kk) * 250, 0, 0, 7); g.stroke(); }
      g.restore();
    }
    // Schublade: springt bei 0 auf
    const op = outBack(cl(u / 0.22), 2.4); const dsc = lerp(0.9, 1, op), dyo = lerp(-70, 0, op);
    const toS = (lx, ly) => [540 + (HC_DX + lx - 540) * dsc, HC_DY + dyo + ly * dsc - (1 - dsc) * 0];
    g.save(); g.translate(540, HC_DY + dyo); g.scale(dsc, dsc); g.translate(-540, 0);
    // Schatten
    g.save(); g.globalAlpha = 0.6; g.fillStyle = "#000"; g.filter = "blur(18px)"; g.fillRect(HC_DX + 30, 590, 940, 40); g.filter = "none"; g.restore();
    g.translate(HC_DX, 0); g.drawImage(st.drawer, 0, 0);
    // Licht der Lampe im Innenraum, Farbschein vom Strudel
    g.save(); g.globalCompositeOperation = "lighter";
    g.globalAlpha = 0.16 * lamp; g.drawImage(st.glow, 120, 40, 760, 330);
    if (vs > 0) { g.beginPath(); g.moveTo(112, 34); g.lineTo(888, 34); g.lineTo(988, 336); g.lineTo(12, 336); g.closePath(); g.clip(); g.globalAlpha = 0.35 * Math.min(1, vs); const rg = g.createLinearGradient(0, 30, 0, 340); rg.addColorStop(0, "rgba(255,80,200,0.55)"); rg.addColorStop(1, "rgba(120,60,255,0)"); g.fillStyle = rg; g.fillRect(12, 30, 976, 310); }
    g.restore();
    // Stapel in den Fächern (werden leerer)
    const bills = T.bills, nb = bills.length; const left = [0, 0, 0, 0];
    for (let i = 0; i < nb; i++) if (u < bills[i]) left[i % 4]++;
    const jig = u < 0.35 ? Math.sin(u * 60) * 4 * (1 - u / 0.35) : 0;
    for (let b = 0; b < 4; b++) {
      const n = left[b] + 1; const a = hc_floor(b * 0.25 + 0.03, 0.12), c = hc_floor(b * 0.25 + 0.22, 0.5);
      const bw = c[0] - a[0], bh = (c[1] - a[1]); const img = st.bills[b];
      if (left[b] > 0) {
        for (let k = 0; k < n; k++) { const y = a[1] - k * 5 + jig * (k % 2 ? 1 : -1) * 0.5; g.globalAlpha = 1; g.filter = k < n - 1 ? "brightness(0.55)" : "none"; g.drawImage(img, a[0] + (rnd(b * 9 + k) - 0.5) * 8, y, bw, bh); }
        g.filter = "none";
      }
      // Klemmbügel
      const yb = a[1] + bh * 0.62 - (left[b] > 0 ? n * 5 : 0) - 8; const gr = g.createLinearGradient(0, yb - 6, 0, yb + 6); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.5, "#9097a3"); gr.addColorStop(1, "#3e434c");
      g.fillStyle = gr; rr(g, a[0] + 6, yb - 6, bw - 12, 12, 6); g.fill(); circle(g, a[0] + bw / 2, yb, 10, "#c9ced8");
    }
    // Münzen in den Bechern
    const coins = T.coins; const cl_ = [0, 0, 0, 0, 0]; coins.forEach((c, j) => { if (u < c) cl_[j % 5]++; });
    for (let j = 0; j < 5; j++) {
      const a = hc_floor(j * 0.2 + 0.02, 0.62), c = hc_floor(j * 0.2 + 0.18, 0.97); const cx = (a[0] + c[0]) / 2, cy = (a[1] + c[1]) / 2 + 6; const rw = (c[0] - a[0]) / 2;
      const n = cl_[j] * 2 + (u < tc ? 1 : 0); const img = st.coins[j === 4 ? 1 : 0];
      for (let k = 0; k < n; k++) { const ox = (rnd(j * 7 + k) - 0.5) * rw * 0.9, oy = (rnd(j * 3 + k * 5) - 0.5) * 18 - k * 1.5 + jig * 0.6; g.drawImage(img, cx + ox - 30, cy + oy - 13, 60, 26); }
    }
    g.restore();
    // Scheine im Flug (mit Bewegungsunschärfe und Flattern)
    for (let i = 0; i < nb; i++) {
      const L = bills[i]; if (u < L || u > L + T.fl + 0.02) continue; const b = i % 4;
      const a = hc_floor(b * 0.25 + 0.125, 0.3); const [sx, sy] = toS(a[0], a[1] - 30);
      for (let j = 3; j >= 0; j--) {
        const uu = u - j * 0.014; const k = cl((uu - L) / T.fl); if (uu < L) continue;
        const [x, y, th] = this.path(k, sx, sy, i); const s = lerp(1.05, 0.1, Math.pow(k, 1.3)) * (1 + 0.45 * Math.sin(k * Math.PI));
        const fl = Math.cos(uu * 26 + i * 1.7); const al = (j ? 0.28 / j : 1) * (1 - seg(k, 0.82, 1));
        if (al <= 0.01) continue;
        g.save(); g.translate(x, y); g.rotate(-th * 0.6 + Math.sin(uu * 11 + i) * 0.5 + i); g.scale(s, s * (0.25 + 0.75 * Math.abs(fl)));
        g.globalAlpha = al; if (fl < 0) g.filter = "brightness(0.6)"; g.drawImage(st.bills[b], -150, -75); g.filter = "none";
        g.restore();
      }
    }
    // Münzen: springen hoch, werden eingesogen
    for (let j = 0; j < coins.length; j++) {
      const C = coins[j]; const tt = u - C; if (tt < 0 || tt > 0.95) continue;
      const cu = j % 5; const a = hc_floor(cu * 0.2 + 0.1, 0.8); const [sx, sy] = toS(a[0], a[1]);
      const vx = (rnd(j * 4.1) - 0.5) * 500, T1 = 0.26; let x, y, s;
      if (tt < T1) { x = sx + vx * tt; y = sy - 1500 * tt + 0.5 * 3600 * tt * tt; s = 1; }
      else { const ex = sx + vx * T1, ey = sy - 1500 * T1 + 0.5 * 3600 * T1 * T1; const k = cl((tt - T1) / 0.62); const pp = this.path(k, ex, ey, j + 50); x = pp[0]; y = pp[1]; s = lerp(1, 0.15, k); if (k >= 1) continue; }
      const spin = Math.cos(tt * 30 + j); const img = st.coins[cu === 4 ? 1 : 0]; const cs = 62 * s;
      for (let q = 2; q >= 0; q--) { g.save(); g.globalAlpha = q ? 0.22 / q : 1; g.translate(x, y + q * 14 * s); g.scale(Math.max(0.12, Math.abs(spin)), 1); g.drawImage(img, -cs / 2, -cs / 2, cs, cs); g.restore(); }
      if (Math.abs(spin) > 0.93) { g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.9; g.drawImage(st.glow, x - 40 * s, y - 40 * s, 80 * s, 80 * s); g.restore(); sparkles(g, x, y, u, 2, 20 * s, "#fff6d0", j * 7); }
    }
    // Nach der Implosion: Papierfetzen sinken herab
    if (u > tc) {
      const k = u - tc;
      for (let i = 0; i < 14; i++) {
        const x = HC_VC.x + (rnd(i * 2.3) - 0.5) * 700 + Math.sin(k * 3 + i) * 30, y = HC_VC.y - 40 + (rnd(i * 4.4) - 0.3) * 120 + k * (110 + rnd(i) * 90);
        g.save(); g.translate(x, y); g.rotate(k * (2 + i % 3) + i); g.scale(1, Math.cos(k * 7 + i)); g.globalAlpha = cl(1 - k / 2.5) * 0.9 * (0.4 + 0.6 * lamp);
        g.fillStyle = `hsl(${[150, 205, 32, 275][i % 4]},50%,${45 + (i % 3) * 8}%)`; g.fillRect(-14, -9, 28, 18); g.restore();
      }
    }
    g.restore();
    // Dunkelheit, wenn die Lampe aus ist
    if (lamp < 0.99) { g.fillStyle = `rgba(0,0,0,${(1 - lamp) * 0.42})`; g.fillRect(0, 0, W, H); }
    // Anzeige: Zähler (über der Abdunklung, damit sie im Endbild leuchtet)
    g.save(); g.translate(shx, shy); g.translate(540, HC_DY + dyo); g.scale(dsc, dsc); g.translate(-540 + HC_DX, 0);
    let cnt = 0, lastInc = -9; for (let i = 0; i < nb; i++) { const tIn = bills[i] + T.fl * 0.93; if (u >= tIn) { cnt++; lastInc = tIn; } }
    const blink = u > tc + 0.1 ? (Math.floor((u - tc) * 4) % 2 === 0 ? 1 : 0.5) : 1; const pop = Math.exp(-(u - lastInc) / 0.12);
    const on = `rgba(255,${60 + pop * 120 | 0},${50 + pop * 80 | 0},${blink})`;
    g.save(); g.shadowColor = "rgba(255,40,40,0.9)"; g.shadowBlur = 22 + pop * 30; hc_seg7(g, 700, 482, 92, String(cnt), on, "rgba(255,40,40,0.07)"); g.restore();
    g.save(); g.globalCompositeOperation = "lighter"; const dg = g.createRadialGradient(640, 482, 0, 640, 482, 200); dg.addColorStop(0, `rgba(255,40,30,${0.22 * blink + pop * 0.25})`); dg.addColorStop(1, "rgba(255,40,30,0)"); g.fillStyle = dg; rr(g, 244, 424, 512, 116, 14); g.fill(); g.restore();
    g.restore();
    // Vignette
    const vg = g.createRadialGradient(540, 860, 300, 540, 860, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.6)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  },
  ev(d, p) {
    const T = hc_times(d); const E = [[0, "cash_open", 1.0, 0], [0, "cash_bell_rev", 0.85, 0]];
    for (let t = 0.05; t < T.tc - 0.25; t += 0.4) E.push([t, "cash_whirl", 0.6, Math.sin(t * 3) * 0.5]);
    T.bills.forEach((t, i) => E.push([t, "cash_flap", 0.55, [-0.5, -0.15, 0.15, 0.5][i % 4]]));
    T.bills.forEach((t, i) => { const ti = t + T.fl * 0.93; if (ti < T.tc - 0.02) E.push([ti, "cash_count", 0.35, 0]); });
    T.coins.forEach((t, j) => E.push([t, j % 2 ? "cash_coin2" : "cash_coin1", 0.75, ((j % 5) - 2) * 0.25]));
    E.push([T.tc - 0.16, "cash_suck", 0.9, 0]); E.push([T.tc, "cash_implode", 1.0, 0]);
    T.flick.forEach((t, i) => { if (i % 2 === 1 && t < d + 0.1) E.push([t, "cash_flicker", 0.5, 0.2]); });
    return E;
  },
};
