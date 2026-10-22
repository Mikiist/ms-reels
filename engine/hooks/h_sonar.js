// VOICE_DELAY: 0.6
// h_sonar: Radarschirm. Der Strahl findet Betriebe (Ping), überstreicht "SIE" in der Mitte: kein Ping, Fehlton, NICHT GEFUNDEN.
// Parameter: found (Liste, Standard ["Betrieb A", "Betrieb B", "Betrieb C"]), you (Standard "SIE"), miss_text (Standard "NICHT GEFUNDEN")
try { for (const f of ["600 20px I", "700 20px I", "800 20px D", "900 20px D"]) document.fonts.load(f); } catch (e) {}
const SON_CX = 540, SON_CY = 862, SON_R = 388, SON_A0 = -Math.PI / 2, SON_S = Math.PI * 2 * 0.93;

function sonPlan(d, p) {
  const M = Math.max(1.15, d - 0.72); const om = SON_S / M;
  const names = (p.found && p.found.length ? p.found : ["Betrieb A", "Betrieb B", "Betrieb C"]).slice(0, 5); const n = names.length;
  const RAD = [0.74, 0.5, 0.82, 0.62, 0.44];
  const pts = names.map((name, i) => { const f = n > 1 ? 0.13 + 0.6 * i / (n - 1) : 0.4; const a = SON_A0 + f * SON_S; const r = RAD[i] * SON_R;
    return { name, a, x: SON_CX + Math.cos(a) * r, y: SON_CY + Math.sin(a) * r, t: f * SON_S / om }; });
  const ya = SON_A0 + SON_S, yr = 92; const you = { a: ya, x: SON_CX + Math.cos(ya) * yr, y: SON_CY + Math.sin(ya) * yr, t: M };
  return { M, om, pts, you };
}
function sonAng(u, P) { return SON_A0 + P.om * u; }
// letzter Zeitpunkt <= u, an dem der Strahl den Winkel a überstrichen hat (oder -1)
function sonLast(u, a, P) { let k = (a - SON_A0) / P.om; const per = Math.PI * 2 / P.om; while (k + per <= u) k += per; while (k < 0) k += per; return k <= u ? k : -1; }

TYPES.h_sonar = {
  zone: "bottom", pal: "night", bgv: 0, coverT: 2.75,
  prep(sc, p) {
    const S = 1000, c = document.createElement("canvas"); c.width = S; c.height = S; const g = c.getContext("2d"); const o = S / 2, R = SON_R;
    // Gehäuse-Ring (gebürstetes Metall)
    shadow(g, 70, 30, "rgba(0,0,0,0.8)"); circle(g, o, o, R + 46, "#10191b"); noShadow(g);
    const cg = g.createConicGradient(0.6, o, o); ["#55666a", "#1d2729", "#7d8e91", "#202b2d", "#4a5a5d", "#151d1f", "#6d7f82", "#1d2729", "#55666a"].forEach((col, i, a) => cg.addColorStop(i / (a.length - 1), col));
    g.fillStyle = cg; g.beginPath(); g.arc(o, o, R + 44, 0, Math.PI * 2); g.moveTo(o + R + 8, o); g.arc(o, o, R + 8, 0, Math.PI * 2, true); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 2; g.beginPath(); g.arc(o, o, R + 44, Math.PI * 1.05, Math.PI * 1.7); g.stroke();
    g.strokeStyle = "rgba(0,0,0,0.85)"; g.lineWidth = 6; g.beginPath(); g.arc(o, o, R + 8, 0, 7); g.stroke();
    for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2, x = o + Math.cos(a) * (R + 26), y = o + Math.sin(a) * (R + 26);
      const sg = g.createRadialGradient(x - 3, y - 3, 1, x, y, 9); sg.addColorStop(0, "#c9d3d5"); sg.addColorStop(1, "#283234"); circle(g, x, y, 8, sg);
      g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 5, y - 5); g.lineTo(x + 5, y + 5); g.stroke(); }
    // Schirm
    const rg = g.createRadialGradient(o, o, 0, o, o, R); rg.addColorStop(0, "#073a35"); rg.addColorStop(0.6, "#042624"); rg.addColorStop(1, "#010d0d");
    circle(g, o, o, R + 6, rg);
    g.save(); g.beginPath(); g.arc(o, o, R, 0, 7); g.clip();
    // feines Gitter
    g.strokeStyle = "rgba(80,255,210,0.06)"; g.lineWidth = 1;
    for (let x = o % 38; x < S; x += 38) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, S); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(S, x); g.stroke(); }
    // Ringe
    for (let i = 1; i <= 4; i++) { g.strokeStyle = `rgba(90,255,210,${i === 4 ? 0.35 : 0.2})`; g.lineWidth = i === 4 ? 3 : 2; g.beginPath(); g.arc(o, o, R * i / 4, 0, 7); g.stroke(); }
    // Kreuz und Diagonalen
    g.strokeStyle = "rgba(90,255,210,0.22)"; g.lineWidth = 2; g.beginPath(); g.moveTo(o - R, o); g.lineTo(o + R, o); g.moveTo(o, o - R); g.lineTo(o, o + R); g.stroke();
    g.strokeStyle = "rgba(90,255,210,0.09)"; g.beginPath(); for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + k * Math.PI / 2; g.moveTo(o, o); g.lineTo(o + Math.cos(a) * R, o + Math.sin(a) * R); } g.stroke();
    // Gradstriche am Rand
    for (let k = 0; k < 72; k++) { const a = k * Math.PI / 36, L = k % 9 === 0 ? 22 : k % 3 === 0 ? 13 : 7; g.strokeStyle = `rgba(90,255,210,${k % 9 === 0 ? 0.6 : 0.3})`; g.lineWidth = k % 9 === 0 ? 3 : 2;
      g.beginPath(); g.moveTo(o + Math.cos(a) * (R - 2), o + Math.sin(a) * (R - 2)); g.lineTo(o + Math.cos(a) * (R - 2 - L), o + Math.sin(a) * (R - 2 - L)); g.stroke(); }
    // Wölbung
    const vg = g.createRadialGradient(o, o, R * 0.55, o, o, R); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)"); g.fillStyle = vg; g.fillRect(0, 0, S, S);
    g.restore();
    sc.st.scope = c;
    // Glas
    const gl = document.createElement("canvas"); gl.width = S; gl.height = S; const h = gl.getContext("2d");
    h.save(); h.beginPath(); h.arc(o, o, R + 4, 0, 7); h.clip();
    let lg = h.createLinearGradient(o - R, o - R, o + R * 0.2, o + R * 0.3); lg.addColorStop(0, "rgba(255,255,255,0.16)"); lg.addColorStop(0.5, "rgba(255,255,255,0.03)"); lg.addColorStop(0.51, "rgba(255,255,255,0)");
    h.fillStyle = lg; h.beginPath(); h.ellipse(o - R * 0.25, o - R * 0.3, R * 0.95, R * 0.62, -0.6, 0, 7); h.fill();
    h.strokeStyle = "rgba(255,255,255,0.12)"; h.lineWidth = 5; h.beginPath(); h.arc(o, o, R - 8, Math.PI * 1.1, Math.PI * 1.45); h.stroke();
    h.restore(); sc.st.glass = gl;
    // Nachglühen des Strahls als fertiges Bild (Strahl zeigt nach rechts, Spur liegt dahinter)
    const mkTrail = (rgb) => { const D = SON_R * 2, t = document.createElement("canvas"); t.width = t.height = D; const h2 = t.getContext("2d"); const im = h2.createImageData(D, D); const TR = 1.9;
      for (let y = 0; y < D; y++) for (let x = 0; x < D; x++) { const dx = x - SON_R + 0.5, dy = y - SON_R + 0.5, r = Math.hypot(dx, dy); if (r > SON_R) continue;
        let b = -Math.atan2(dy, dx); if (b < 0) b += Math.PI * 2; if (b > TR) continue; const k = 1 - b / TR; const a = 0.62 * Math.pow(k, 2.2) * (0.75 + 0.25 * r / SON_R) * cl((SON_R - r) / 3);
        const q = (y * D + x) * 4; im.data[q] = rgb[0]; im.data[q + 1] = rgb[1]; im.data[q + 2] = rgb[2]; im.data[q + 3] = Math.round(255 * a); }
      h2.putImageData(im, 0, 0); return t; };
    sc.st.trailG = mkTrail([90, 255, 210]); sc.st.trailR = mkTrail([255, 90, 100]);
    // Störflecken (Seegang) im Schirm
    sc.st.clut = []; for (let i = 0; i < 46; i++) { const a = rnd(i * 2.3 + 5) * Math.PI * 2, r = (0.12 + 0.86 * Math.sqrt(rnd(i * 4.1 + 1))) * SON_R; sc.st.clut.push({ a, x: SON_CX + Math.cos(a) * r, y: SON_CY + Math.sin(a) * r, s: 2 + rnd(i * 9.7) * 4 }); }
  },
  draw(g, u, d, p, sc, P) {
    const PL = sonPlan(d, p); const M = PL.M, miss = u >= M, mk = seg(u, M, M + 0.12); const th = sonAng(u, PL);
    const redBlink = miss ? 0.6 + 0.4 * Math.cos((u - M) * 18) : 0;
    // Hintergrund: tiefes Petrol mit Lichtschein
    let gr = g.createLinearGradient(0, 0, W * 0.3, H); gr.addColorStop(0, "#021214"); gr.addColorStop(1, "#04201f"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    gr = g.createRadialGradient(SON_CX, SON_CY, 100, SON_CX, SON_CY, 1000); gr.addColorStop(0, miss ? `rgba(255,40,60,${0.18 * redBlink})` : "rgba(40,255,200,0.13)"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.save(); g.globalAlpha = 0.07; g.strokeStyle = "#5affd2"; g.lineWidth = 2; const off = (u * 24) % 80;
    for (let y = -80 + off; y < H; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } for (let x = 20; x < W; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } g.restore();
    // Kamera: leichte Fahrt, Ruck beim Fehlschlag
    const z = 1 + 0.03 * cl(u / Math.max(1, M)) + 0.035 * outExpo(mk);
    let sx = 0, sy = 0; if (miss && u < M + 0.35) { const k = Math.exp(-(u - M) / 0.07) * 8; sx = Math.sin(u * 91) * k; sy = Math.cos(u * 77) * k; }
    g.save(); g.translate(SON_CX + sx, SON_CY + sy); g.scale(z, z); g.translate(-SON_CX, -SON_CY);
    g.drawImage(sc.st.scope, SON_CX - 500, SON_CY - 500);
    g.save(); g.beginPath(); g.arc(SON_CX, SON_CY, SON_R, 0, 7); g.clip();
    if (miss) { g.fillStyle = `rgba(255,30,50,${0.16 * redBlink * mk})`; g.fillRect(SON_CX - SON_R, SON_CY - SON_R, 2 * SON_R, 2 * SON_R); }
    // Start-Ping: Welle von der Mitte
    for (let i = 0; i < 2; i++) { const k = seg(u, i * 0.1, 0.9 + i * 0.1); if (u >= i * 0.1 && k < 1) ring(g, SON_CX, SON_CY, 30 + out3(k) * (SON_R - 30), 10 * (1 - k) + 1, `rgba(150,255,225,${0.7 * (1 - k)})`); }
    // Nachglühen des Strahls (Kegelverlauf)
    const bc = miss ? "255,90,100" : "90,255,210";
    g.save(); g.globalCompositeOperation = "lighter"; g.translate(SON_CX, SON_CY); g.rotate(th); g.drawImage(miss ? sc.st.trailR : sc.st.trailG, -SON_R, -SON_R); g.restore();
    // Störflecken leuchten nach dem Überstreichen kurz auf
    for (const c of sc.st.clut) { const L = sonLast(u, c.a, PL); if (L < 0) continue; const k = Math.exp(-(u - L) * 2.6); if (k < 0.04) continue; circle(g, c.x, c.y, c.s, `rgba(${bc},${0.5 * k})`); }
    // Strahl
    g.lineCap = "round"; const bx = SON_CX + Math.cos(th) * SON_R, by = SON_CY + Math.sin(th) * SON_R;
    g.strokeStyle = `rgba(${bc},0.25)`; g.lineWidth = 26; g.beginPath(); g.moveTo(SON_CX, SON_CY); g.lineTo(bx, by); g.stroke();
    shadow(g, 34, 0, `rgba(${bc},1)`); g.strokeStyle = miss ? "#ffc2c8" : "#e2fff7"; g.lineWidth = 7; g.beginPath(); g.moveTo(SON_CX, SON_CY); g.lineTo(bx, by); g.stroke(); noShadow(g);
    circle(g, SON_CX, SON_CY, 10, miss ? "#ffc2c8" : "#e2fff7");
    // Funde
    PL.pts.forEach((pt, i) => {
      if (u < pt.t) return; const L = sonLast(u, pt.a, PL); const since = u - L, first = u - pt.t;
      const glow = 0.45 + 0.55 * Math.exp(-since * 2.4);
      for (let j = 0; j < 2; j++) { const k = seg(first, j * 0.12, 0.7 + j * 0.12); if (k > 0 && k < 1) ring(g, pt.x, pt.y, 12 + out3(k) * 95, 6 * (1 - k) + 1, `rgba(160,255,230,${0.8 * (1 - k)})`); }
      const rg = g.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 56); rg.addColorStop(0, `rgba(120,255,220,${0.75 * glow})`); rg.addColorStop(1, "rgba(120,255,220,0)"); g.fillStyle = rg; g.fillRect(pt.x - 56, pt.y - 56, 112, 112);
      circle(g, pt.x, pt.y, 11 + 6 * Math.exp(-first * 6), `rgba(220,255,245,${0.6 + 0.4 * glow})`);
    });
    // SIE
    const Y = PL.you; const youCol = miss ? "#ff3b4e" : "#d9fff3";
    g.setLineDash([6, 6]); g.lineWidth = 4; g.strokeStyle = miss ? "#ff3b4e" : "rgba(217,255,243,0.75)"; g.beginPath(); g.arc(Y.x, Y.y, 26, u * 2, u * 2 + 7); g.stroke(); g.setLineDash([]);
    circle(g, Y.x, Y.y, 11, miss ? "#ff3b4e" : "rgba(217,255,243,0.55)");
    if (miss) { for (let j = 0; j < 3; j++) { const k = seg(u, M + j * 0.14, M + 0.75 + j * 0.14); if (k > 0 && k < 1) ring(g, Y.x, Y.y, 20 + out3(k) * 210, 12 * (1 - k) + 2, `rgba(255,50,70,${0.9 * (1 - k)})`); } }
    g.restore();
    // Labels über dem Glas (nicht geclippt)
    const lab = (s, x, y, k, col, bg, bd, big = false) => { if (k <= 0) return; const e = outBack(cl(k), 2.2); g.save(); g.translate(x, y); g.scale(e, e); const px = big ? 56 : 38, hh = px * 1.55; font(g, big ? 800 : 700, px, big ? "D" : "I"); const tw = g.measureText(s).width + px * 1.1;
      shadow(g, 24, 8, "rgba(0,0,0,0.5)"); fillRR(g, -tw / 2, -hh / 2, tw, hh, hh / 2, bg); noShadow(g); g.strokeStyle = bd; g.lineWidth = big ? 4 : 3; rr(g, -tw / 2, -hh / 2, tw, hh, hh / 2); g.stroke(); txt(g, s, 0, 2, { w: big ? 800 : 700, px, fam: big ? "D" : "I", c: col }); g.restore(); };
    PL.pts.forEach((pt) => { if (u < pt.t) return; const k = seg(u, pt.t, pt.t + 0.22); const dy = pt.y < SON_CY - 150 ? -62 : 62;
      g.strokeStyle = "rgba(160,255,230,0.6)"; g.lineWidth = 2; g.beginPath(); g.moveTo(pt.x, pt.y + Math.sign(dy) * 14); g.lineTo(pt.x, pt.y + dy * 0.55 * cl(k * 3)); g.stroke();
      lab(pt.name, Math.max(150, Math.min(930, pt.x)), pt.y + dy, k, "#e9fff8", "rgba(4,40,38,0.92)", "rgba(110,255,215,0.85)"); });
    const yb = miss ? 1 + 0.12 * Math.exp(-(u - M) * 8) : 1;
    g.save(); g.translate(Y.x, Y.y - 78); g.scale(yb, yb); lab((p.you || "SIE").toUpperCase(), 0, 0, 0.5 + 0.5 * seg(u, 0, 0.16), miss ? "#ffffff" : "#04201f", miss ? "#e11d2e" : "#d9fff3", miss ? "#ff8a95" : "#ffffff", true); g.restore();
    g.drawImage(sc.st.glass, SON_CX - 500, SON_CY - 500);
    g.restore();
    // Stempel NICHT GEFUNDEN
    const k = seg(u, M + 0.1, M + 0.26); if (k > 0) {
      const s = (p.miss_text || "NICHT GEFUNDEN").toUpperCase(); const px = fitPx(g, s, 760, 96, 900); const e = outExpo(k);
      g.save(); g.translate(540, 1075); g.rotate(-0.07); g.scale(lerp(2.3, 1, e), lerp(2.3, 1, e)); g.globalAlpha = cl(k * 3);
      font(g, 900, px); const tw = g.measureText(s).width + 70, th2 = px * 1.45;
      shadow(g, 50, 14, "rgba(0,0,0,0.6)"); fillRR(g, -tw / 2, -th2 / 2, tw, th2, 14, "rgba(225,29,46,0.96)"); noShadow(g);
      g.strokeStyle = "#ffffff"; g.lineWidth = 6; rr(g, -tw / 2 + 12, -th2 / 2 + 12, tw - 24, th2 - 24, 8); g.stroke();
      txt(g, s, 0, 4, { w: 900, px, c: "#ffffff" }); g.restore();
    }
  },
  ev(d, p) {
    const PL = sonPlan(d, p); const E = [[0, "sonar_ping", 1.0, 0]];
    PL.pts.forEach((pt) => E.push([pt.t, "sonar_find", 0.85, (pt.x - 540) / 540 * 0.6]));
    E.push([PL.M, "sonar_miss", 1.0, 0]); E.push([PL.M + 0.1, "thump", 0.55, 0]);
    return E;
  },
};
