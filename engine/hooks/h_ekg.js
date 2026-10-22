// VOICE_DELAY: 0.7
// h_ekg: Herzmonitor. Die Linie piept bei jedem Schlag, die Schläge werden schwächer und langsamer, dann Flatline.
// Parameter: label (Standard "PULS IHRER WEBSITE"), flat_text (Standard "KEIN SIGNAL"), start (Startzahl, Standard 96)
const EKG_X0 = 120, EKG_X1 = 960, EKG_V = 520, EKG_GAP = 56, EKG_CY = 868, EKG_AMP = 186, EKG_PY = 1172;
try { for (const f of ["500 20px I", "600 20px I", "700 20px I", "800 20px D", "900 20px D"]) document.fonts.load(f); } catch (e) {}
const EKG_GREEN = "#3dff8a", EKG_RED = "#ff3347";

function ekgTimes(d) {
  const F = Math.max(1.05, d - 1.0), L = F - 0.45, r = 1.25;
  const n = Math.max(3, Math.min(6, Math.floor(L / 0.36) + 1));
  let sum = 0; for (let k = 0; k < n - 1; k++) sum += Math.pow(r, k);
  const s = L / sum; const beats = [0]; let t = 0;
  for (let k = 0; k < n - 1; k++) { t += s * Math.pow(r, k); beats.push(t); }
  return { F, beats, n, s };
}
function ekgG(x, m, w) { const z = (x - m) / w; return Math.exp(-z * z); }
// Ein Herzschlag (R-Zacke bei 0), a = Stärke, wf = Breite
function ekgBeat(x, a, wf) {
  if (x < -0.3 * wf || x > 0.36 * wf) return 0;
  const y = 0.12 * ekgG(x, -0.17 * wf, 0.03 * wf) - 0.13 * ekgG(x, -0.028 * wf, 0.009 * wf) + 1.0 * ekgG(x, 0, 0.011 * wf)
    - 0.32 * ekgG(x, 0.03 * wf, 0.011 * wf) + 0.24 * ekgG(x, 0.2 * wf, 0.045 * wf);
  return y * a;
}
function ekgPleth(x, a) { // Pulswelle, verzögert
  if (x < 0 || x > 0.6) return 0;
  return a * (0.85 * ekgG(x, 0.14, 0.06) + 0.35 * ekgG(x, 0.3, 0.07));
}
function ekgInfo(T) { // Liste aller Schläge inkl. Vorgeschichte (vor Bild 0)
  if (T._b) return T._b;
  const { beats, n, s } = T; const list = [];
  for (let k = 6; k >= 1; k--) list.push({ t: -k * s * 0.95, a: 1, w: 1 });
  beats.forEach((t, k) => { const q = n > 1 ? k / (n - 1) : 0; list.push({ t, a: 1 - 0.8 * Math.pow(q, 1.1), w: 1 + 0.7 * q }); });
  T._b = list; return list;
}
function ekgSig(T, tau) {
  if (tau >= T.F - 0.02) return 0;
  let y = 0; for (const b of ekgInfo(T)) { const x = tau - b.t; if (x > -0.4 && x < 0.5) y += ekgBeat(x, b.a, b.w); } return y;
}
function ekgPl(T, tau) {
  if (tau >= T.F + 0.3) return 0;
  let y = 0; for (const b of ekgInfo(T)) { const x = tau - b.t; if (x > -0.1 && x < 0.7) y += ekgPleth(x, b.a); } return y;
}

TYPES.h_ekg = {
  zone: "bottom", pal: "black", bgv: 0, coverT: 2.5,
  prep(sc, p) {
    // Monitor (Gehäuse, Bildschirm, Raster) einmal vorzeichnen
    const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
    // Gehäuse
    shadow(g, 90, 40, "rgba(0,0,0,0.75)"); fillRR(g, 56, 448, 968, 848, 54, "#1a1d21"); noShadow(g);
    let gr = g.createLinearGradient(0, 448, 0, 1296); gr.addColorStop(0, "#3a4047"); gr.addColorStop(0.08, "#24282d"); gr.addColorStop(0.9, "#16191c"); gr.addColorStop(1, "#0c0e10");
    g.fillStyle = gr; rr(g, 56, 448, 968, 848, 54); g.fill();
    gr = g.createLinearGradient(56, 448, 1024, 1296); gr.addColorStop(0, "rgba(255,255,255,0.35)"); gr.addColorStop(0.3, "rgba(255,255,255,0.04)"); gr.addColorStop(0.7, "rgba(255,255,255,0.02)"); gr.addColorStop(1, "rgba(255,255,255,0.18)");
    g.strokeStyle = gr; g.lineWidth = 4; rr(g, 58, 450, 964, 844, 52); g.stroke();
    // Bildschirm-Vertiefung
    fillRR(g, 92, 484, 896, 732, 26, "#050607");
    g.strokeStyle = "rgba(0,0,0,0.9)"; g.lineWidth = 6; rr(g, 92, 484, 896, 732, 26); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.10)"; g.lineWidth = 2; rr(g, 89, 481, 902, 738, 28); g.stroke();
    // Bildschirm
    g.save(); rr(g, 100, 492, 880, 716, 20); g.clip();
    gr = g.createRadialGradient(540, 860, 50, 540, 860, 640); gr.addColorStop(0, "#04140b"); gr.addColorStop(1, "#010402"); g.fillStyle = gr; g.fillRect(100, 492, 880, 716);
    // Raster
    for (let x = EKG_X0; x <= EKG_X1 + 1; x += 21) { const major = Math.round((x - EKG_X0) / 21) % 5 === 0; g.strokeStyle = major ? "rgba(61,255,138,0.13)" : "rgba(61,255,138,0.05)"; g.lineWidth = major ? 2 : 1; g.beginPath(); g.moveTo(x, 680); g.lineTo(x, 1218); g.stroke(); }
    for (let y = 680 + 2; y < 1218; y += 21) { const major = Math.round((y - 682) / 21) % 5 === 0; g.strokeStyle = major ? "rgba(61,255,138,0.13)" : "rgba(61,255,138,0.05)"; g.lineWidth = major ? 2 : 1; g.beginPath(); g.moveTo(EKG_X0, y); g.lineTo(EKG_X1, y); g.stroke(); }
    // Kopfzeile
    g.fillStyle = "rgba(61,255,138,0.07)"; g.fillRect(100, 492, 880, 176);
    g.strokeStyle = "rgba(61,255,138,0.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(120, 668); g.lineTo(960, 668); g.stroke();
    g.strokeStyle = "rgba(70,225,255,0.18)"; g.lineWidth = 2; g.setLineDash([6, 8]); g.beginPath(); g.moveTo(120, 1095); g.lineTo(960, 1095); g.stroke(); g.setLineDash([]);
    // Wölbung (Vignette)
    gr = g.createRadialGradient(540, 850, 280, 540, 850, 720); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = gr; g.fillRect(100, 492, 880, 716);
    // Zeilen
    g.fillStyle = "rgba(0,0,0,0.16)"; for (let y = 492; y < 1208; y += 4) g.fillRect(100, y, 880, 2);
    g.restore();
    // Bedienleiste unten
    for (let i = 0; i < 4; i++) { const x = 690 + i * 70; fillRR(g, x, 1240, 52, 22, 8, "#0b0d0f"); fillRR(g, x + 2, 1241, 48, 9, 6, "rgba(255,255,255,0.07)"); }
    sc.st.mon = c;
    // Spiegelung (über allem)
    const s = document.createElement("canvas"); s.width = W; s.height = H; const h = s.getContext("2d");
    h.save(); rr(h, 100, 492, 880, 716, 20); h.clip();
    gr = h.createLinearGradient(100, 492, 620, 1100); gr.addColorStop(0, "rgba(255,255,255,0.13)"); gr.addColorStop(0.42, "rgba(255,255,255,0.035)"); gr.addColorStop(0.43, "rgba(255,255,255,0.0)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    h.fillStyle = gr; h.beginPath(); h.moveTo(100, 492); h.lineTo(860, 492); h.lineTo(100, 1150); h.closePath(); h.fill();
    gr = h.createLinearGradient(0, 492, 0, 530); gr.addColorStop(0, "rgba(255,255,255,0.10)"); gr.addColorStop(1, "rgba(255,255,255,0)"); h.fillStyle = gr; h.fillRect(100, 492, 880, 40);
    h.restore();
    sc.st.glass = s;
    sc.st.T = null;
    // Unscharfe Lichter im Hintergrund (Krankenhausflur)
    const b = document.createElement("canvas"); b.width = W + 120; b.height = H + 120; const k = b.getContext("2d");
    for (let i = 0; i < 26; i++) {
      const x = rnd(i * 3.1 + 1) * (W + 120), y = rnd(i * 7.7 + 2) * (H + 120), r = 40 + rnd(i * 1.3) * 120;
      const cols = ["90,200,255", "70,255,170", "255,220,170", "120,160,255"]; const c = cols[i % 4]; const a = 0.05 + rnd(i * 5.5) * 0.10;
      const q = k.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, `rgba(${c},${a})`); q.addColorStop(0.7, `rgba(${c},${a * 0.7})`); q.addColorStop(1, `rgba(${c},0)`);
      k.fillStyle = q; k.beginPath(); k.arc(x, y, r, 0, 7); k.fill();
    }
    sc.st.bok = b;
  },
  draw(g, u, d, p, sc, P) {
    if (!sc.st.T || sc.st.Td !== d) { sc.st.T = ekgTimes(d); sc.st.Td = d; }
    const T = sc.st.T, F = T.F, flat = u >= F, fk = seg(u, F, F + 0.1);
    const beats = T.beats; let bi = -1; for (let k = 0; k < beats.length; k++) if (u >= beats[k] - 0.001) bi = k;
    const sinceBeat = bi >= 0 ? u - beats[bi] : 9;
    const blink = flat ? (Math.floor((u - F) * 6) % 2 === 0 ? 1 : 0.25) : 0;
    // Hintergrund: dunkel, Lichtschein vom Bildschirm
    g.fillStyle = "#020303"; g.fillRect(0, 0, W, H);
    g.drawImage(sc.st.bok, -60 + Math.sin(u * 0.7) * 25 - u * 14, -60 + Math.cos(u * 0.5) * 18);
    let rg = g.createRadialGradient(540, 860, 60, 540, 860, 1100); const glowA = flat ? 0.22 * blink + 0.08 : 0.10 + 0.10 * Math.exp(-sinceBeat * 8);
    rg.addColorStop(0, flat ? `rgba(255,40,60,${glowA})` : `rgba(40,255,140,${glowA})`); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    // Kamera: langsame Fahrt, kleiner Ruck bei der Flatline
    const bump = flat ? 0 : 0.016 * Math.exp(-sinceBeat * 14) * (bi >= 0 ? ekgInfo(T)[6 + bi].a : 0);
    const push = 1 + bump + 0.035 * inOut(cl(u / Math.max(1, F))) + 0.03 * outExpo(seg(u, F, F + 0.25));
    let sx = 0, sy = 0; if (u >= F && u < F + 0.35) { const k = Math.exp(-(u - F) / 0.07) * 9; sx = Math.sin(u * 97) * k; sy = Math.cos(u * 83) * k; }
    const intro = lerp(1.12, 1, outExpo(seg(u, 0, 0.35)));
    g.save(); g.translate(540 + sx, 860 + sy); g.scale(push * intro, push * intro); g.rotate(-0.012 + 0.012 * cl(u / d)); g.translate(-540, -860);
    g.drawImage(sc.st.mon, 0, 0);
    txt(g, "II", 134, 705, { w: 700, px: 26, fam: "I", c: "rgba(61,255,138,0.75)", al: "left" });
    txt(g, "x1  25 mm/s", 172, 705, { w: 500, px: 22, fam: "I", c: "rgba(61,255,138,0.45)", al: "left" });
    txt(g, "PLETH", 134, 1112, { w: 700, px: 22, fam: "I", c: "rgba(70,225,255,0.7)", al: "left", ls: 2 });
    txt(g, "MONITOR 01", 130, 1252, { w: 600, px: 20, fam: "I", c: "rgba(255,255,255,0.28)", al: "left", ls: 5 });
    g.save(); rr(g, 100, 492, 880, 716, 20); g.clip();
    // Rotes Blinken im Bildschirm
    if (flat) { g.fillStyle = `rgba(255,20,40,${0.20 * blink * fk})`; g.fillRect(100, 492, 880, 716); }
    const col = flat ? EKG_RED : EKG_GREEN, colRGB = flat ? "255,51,71" : "61,255,138";
    // Kopfzeile: Label, Herz, Zahl
    const label = (p.label || "PULS IHRER WEBSITE").toUpperCase();
    const lpx = fitPx(g, label, 520, 34, 700, "I");
    txt(g, label, 134, 548, { w: 700, px: lpx, fam: "I", c: hexA(col, 0.95), al: "left", ls: 3 });
    txt(g, flat ? "ALARM" : "HF  /min", 134, 606, { w: 600, px: 26, fam: "I", c: flat ? `rgba(255,80,90,${blink})` : "rgba(61,255,138,0.55)", al: "left", ls: 4 });
    // Herz-Symbol pulsiert
    const hb = flat ? 0 : Math.exp(-sinceBeat * 10);
    g.save(); g.translate(560, 600); g.scale(1 + 0.25 * hb, 1 + 0.25 * hb); g.fillStyle = flat ? "rgba(255,51,71,0.35)" : `rgba(61,255,138,${0.35 + 0.65 * hb})`;
    g.beginPath(); g.moveTo(0, 14); g.bezierCurveTo(-30, -6, -18, -28, 0, -14); g.bezierCurveTo(18, -28, 30, -6, 0, 14); g.fill(); g.restore();
    // Zahl
    const start = p.start || 96, n = T.n; const val = (k) => (k < 0 ? start : Math.max(3, Math.round(start * Math.pow(1 - k / n, 1.15))));
    const cur = flat ? 0 : val(bi), prev = flat ? val(n - 1) : val(bi - 1);
    const roll = flat ? seg(u, F, F + 0.1) : bi <= 0 ? 1 : seg(sinceBeat, 0, 0.09);
    g.save(); g.beginPath(); g.rect(600, 500, 370, 160); g.clip();
    const numCol = flat ? `rgba(255,51,71,${0.35 + 0.65 * blink})` : EKG_GREEN;
    shadow(g, 30, 0, `rgba(${colRGB},0.8)`);
    if (roll < 1) txt(g, String(prev), 950, 590 + out3(roll) * 120, { w: 800, px: 150, c: hexA(flat ? EKG_RED : EKG_GREEN, 1 - roll), al: "right", ls: -4 });
    txt(g, String(cur), 950, 590 - (1 - out3(roll)) * 120, { w: 800, px: 150, c: numCol, al: "right", ls: -4 });
    noShadow(g); g.restore();
    // EKG-Linie mit Leuchtspur (Schreibkopf läuft von links nach rechts)
    const Wt = EKG_X1 - EKG_X0; const head = EKG_X0 + ((u * EKG_V + Wt * 0.62) % Wt);
    const span = Wt - EKG_GAP, step = 3, chunks = 7;
    g.lineJoin = "round"; g.lineCap = "round";
    const drawTrace = (sig, cy, amp, rgb, lw, glow) => {
      for (let c = chunks - 1; c >= 0; c--) {
        const a0 = (c / chunks) * span, a1 = ((c + 1) / chunks) * span; const age = c / chunks; const alpha = Math.pow(1 - age, 1.6) * 0.95 + 0.05;
        g.beginPath(); let first = true, lastX = null;
        for (let s = a0; s <= a1 + 0.01; s += step) {
          let x = head - s; if (x < EKG_X0) x += Wt; if (lastX !== null && x > lastX + 10) first = true;
          const y = cy - sig(u - s / EKG_V) * amp; if (first) { g.moveTo(x, y); first = false; } else g.lineTo(x, y); lastX = x;
        }
        shadow(g, glow, 0, `rgba(${rgb},${0.9 * alpha})`); g.strokeStyle = `rgba(${rgb},${alpha})`; g.lineWidth = lw; g.stroke();
        noShadow(g); g.strokeStyle = `rgba(235,255,240,${alpha * 0.85})`; g.lineWidth = lw * 0.38; g.stroke();
      }
    };
    drawTrace((tau) => ekgSig(T, tau), EKG_CY, EKG_AMP, colRGB, 8, 34);
    drawTrace((tau) => ekgPl(T, tau), EKG_PY, 70, flat ? "255,90,110" : "70,225,255", 5, 16);
    // Schreibkopf
    const hy = EKG_CY - ekgSig(T, u) * EKG_AMP; rg = g.createRadialGradient(head, hy, 0, head, hy, 60);
    rg.addColorStop(0, `rgba(${colRGB},0.9)`); rg.addColorStop(0.2, `rgba(${colRGB},0.35)`); rg.addColorStop(1, `rgba(${colRGB},0)`); g.fillStyle = rg; g.fillRect(head - 60, hy - 60, 120, 120);
    circle(g, head, hy, 7, "#f0fff4");
    // Ausschlag-Blitz bei jedem Schlag
    if (!flat && sinceBeat < 0.18) { const k = 1 - sinceBeat / 0.18; g.fillStyle = `rgba(61,255,138,${0.07 * k})`; g.fillRect(100, 492, 880, 716); }
    g.restore();
    // KEIN SIGNAL
    if (flat) {
      const k = seg(u, F + 0.08, F + 0.24), e = outBack(k, 2.4); if (k > 0) {
        const tx = (p.flat_text || "KEIN SIGNAL").toUpperCase(); const px = fitPx(g, tx, 660, 92, 900);
        g.save(); g.translate(540, 1012); g.rotate(-0.03); g.scale(lerp(1.8, 1, e), lerp(1.8, 1, e)); g.globalAlpha = cl(k * 3);
        font(g, 900, px); const tw = g.measureText(tx).width + 90;
        shadow(g, 60, 0, `rgba(255,30,50,${0.5 + 0.5 * blink})`); fillRR(g, -tw / 2, -px * 0.78, tw, px * 1.56, 18, `rgba(30,0,4,0.86)`); noShadow(g);
        g.strokeStyle = `rgba(255,51,71,${0.6 + 0.4 * blink})`; g.lineWidth = 7; rr(g, -tw / 2, -px * 0.78, tw, px * 1.56, 18); g.stroke();
        txt(g, tx, 0, 4, { w: 900, px, c: blink > 0.5 ? "#ffffff" : "#ff8f9a" }); g.restore();
      }
    }
    g.drawImage(sc.st.glass, 0, 0);
    // Rote Lampe oben am Gehäuse
    const lampOn = flat ? blink : 0.15; rg = g.createRadialGradient(952, 466, 0, 952, 466, 70);
    rg.addColorStop(0, `rgba(255,50,60,${0.9 * lampOn})`); rg.addColorStop(1, "rgba(255,50,60,0)"); g.fillStyle = rg; g.fillRect(880, 400, 140, 140);
    circle(g, 952, 466, 9, flat && blink > 0.5 ? "#ffd6da" : "#5a1016");
    circle(g, 130, 466, 6, flat ? "#2a0a0d" : "#7dffb0");
    g.restore();
    // Rote Bildschirmkante beim Alarm
    if (flat) { const a = 0.35 * blink * fk; const vg = g.createRadialGradient(540, 900, 500, 540, 900, 1250); vg.addColorStop(0, "rgba(255,0,30,0)"); vg.addColorStop(1, `rgba(255,0,30,${a})`); g.fillStyle = vg; g.fillRect(0, 0, W, H); }
  },
  ev(d, p) {
    const T = ekgTimes(d); const E = [];
    T.beats.forEach((t, k) => E.push([t, "ekg_beep" + Math.min(5, k), 0.95 - 0.08 * k, 0]));
    E.push([T.F, "ekg_flat", 0.95, 0]); E.push([T.F, "ekg_drop", 0.8, 0]);
    return E;
  },
};
