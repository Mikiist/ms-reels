// VOICE_DELAY: 0.6
// h_lightswitch: Dunkler Raum, nur ein Lichtschalter im Mondlicht. Klick, die Leuchtstoffröhre flackert an,
// volles Licht: an der Wand hängt ein großer Bildschirm, auf dem sich eine moderne Website aufbaut. Staub im Lichtkegel.
// Parameter: label (Standard „IHRE WEBSITE“, Überschrift auf der Website), button (Standard „Jetzt anfragen“).
(() => {
  const FPS = 30;
  const OX = -170, OY = -150, WW = 1420, WH = 2220; // Weltleinwand (größer als das Bild, für die Kamerafahrt)
  const DX0 = 66, DY0 = 664, DW = 796, DH = 496, BZ = 16; // Bildschirm an der Wand
  const SWX = 964, SWY = 1072, SPW = 128, SPH = 190; // Schalter
  const TX0 = 140, TX1 = 790, TY = 600; // Leuchtstoffröhre über dem Bildschirm
  const TCX = (TX0 + TX1) / 2;
  const MX = SWX + 70, MY = SWY - 100; // Mondlicht-Fleck (Fenster) um den Schalter
  // Flackern in Bildern (30 fps): [erstes Bild, letztes Bild, Helligkeit]
  const FL = [[4, 5, 0.9], [8, 8, 0.45], [10, 11, 1.0], [14, 14, 0.5]];
  const ON = 18; // ab diesem Bild volles Licht

  function vnoise(PT) {
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, a1 = xf * xf * (3 - 2 * xf), b1 = yf * yf * (3 - 2 * yf);
      const i0 = xi & 255, j0 = yi & 255, i1 = (i0 + 1) & 255, j1 = (j0 + 1) & 255;
      const a = PT[j0 * 256 + i0], b = PT[j0 * 256 + i1], c = PT[j1 * 256 + i0], e = PT[j1 * 256 + i1];
      return a + (b - a) * a1 + (c - a) * b1 + (a - b - c + e) * a1 * b1;
    };
  }
  const sm = (a, b, x) => { const t = cl((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  // Licht der Röhre auf der Wand (0..~1.3)
  function tubeLight(x, y) {
    const dx = Math.max(0, Math.abs(x - TCX) - (TX1 - TX0) / 2) , dy = y - TY;
    const r2 = dx * dx * 1.1 + (dy > 0 ? dy * dy * 0.55 : dy * dy * 6) ;
    let I = 1.45 * Math.pow(230 * 230 / (230 * 230 + r2), 1.35);
    I += 0.06 * Math.exp(-(Math.abs(x - TCX) / 900) - Math.max(0, dy) / 1300); // Streulicht
    // kurzer weicher Schatten unter dem Bildschirm und unter dem Schalter
    const shx = sm(DX0 - 20, DX0 + 40, x) * (1 - sm(DX0 + DW - 40, DX0 + DW + 20, x));
    if (y > DY0 + DH) I *= 1 - 0.78 * shx * Math.exp(-(y - DY0 - DH) / 46);
    const ssx = sm(SWX - SPW / 2 - 8, SWX - SPW / 2 + 14, x) * (1 - sm(SWX + SPW / 2 - 14, SWX + SPW / 2 + 8, x));
    if (y > SWY + SPH / 2) I *= 1 - 0.55 * ssx * Math.exp(-(y - SWY - SPH / 2) / 16);
    return I;
  }
  // Mondlicht durch ein Fenster (Fleck mit Fensterkreuz)
  function moonLight(x, y) {
    const py = y - MY, px = (x - MX) + py * 0.36;
    const inX = sm(-200, -168, px) * (1 - sm(168, 200, px)), inY = sm(-300, -262, py) * (1 - sm(262, 300, py));
    let m = inX * inY; const bar = Math.max(1 - sm(5, 13, Math.abs(px)), 1 - sm(5, 13, Math.abs(py + 20)));
    m *= 1 - 0.85 * bar;
    return 0.30 * m + 0.03 * Math.exp(-Math.hypot(x - MX, y - MY) / 700);
  }

  function walls() {
    const lit = document.createElement("canvas"); lit.width = WW; lit.height = WH;
    const dark = document.createElement("canvas"); dark.width = WW; dark.height = WH;
    const gl = lit.getContext("2d"), gd = dark.getContext("2d");
    const iL = gl.createImageData(WW, WH), iD = gd.createImageData(WW, WH), L = iL.data, D = iD.data;
    const PT = new Float32Array(65536); for (let i = 0; i < 65536; i++) PT[i] = rnd(i * 0.517 + 9.3);
    const vn = vnoise(PT);
    for (let yy = 0; yy < WH; yy++) {
      const y = yy + OY;
      for (let xx = 0; xx < WW; xx++) {
        const x = xx + OX;
        // Putz: grobe Wolken + feines Korn
        const n = vn(x * 0.012, y * 0.012) * 0.6 + vn(x * 0.05 + 40, y * 0.05) * 0.3 + vn(x * 0.31, y * 0.31 + 7) * 0.25;
        const tex = 0.86 + 0.16 * n + (rnd(xx * 1.3 + yy * 7.1) - 0.5) * 0.05;
        const I = tubeLight(x, y) * tex, M = moonLight(x, y) * tex;
        const i = (yy * WW + xx) * 4;
        // warmes Graublau, im Licht leicht kühl-weiß
        L[i] = Math.min(255, 5 + 112 * I + 40 * I * I); L[i + 1] = Math.min(255, 8 + 126 * I + 38 * I * I); L[i + 2] = Math.min(255, 13 + 150 * I + 30 * I * I); L[i + 3] = 255;
        D[i] = 3 + 70 * M; D[i + 1] = 4 + 92 * M; D[i + 2] = 9 + 150 * M; D[i + 3] = 255;
      }
    }
    gl.putImageData(iL, 0, 0); gd.putImageData(iD, 0, 0);
    gl.translate(-OX, -OY); gd.translate(-OX, -OY);
    fixtures(gl, true); fixtures(gd, false);
    return { lit, dark };
  }

  // Bildschirmrahmen, Schalterplatte, Röhrengehäuse (statisch), je im Licht oder im Mondlicht
  function fixtures(g, lit) {
    // Bildschirm
    shadow(g, lit ? 60 : 30, lit ? 34 : 12, lit ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.6)");
    fillRR(g, DX0, DY0, DW, DH, 18, lit ? "#141619" : "#030406"); noShadow(g);
    let gr = g.createLinearGradient(0, DY0, 0, DY0 + DH);
    if (lit) { gr.addColorStop(0, "#5d636d"); gr.addColorStop(0.04, "#24272d"); gr.addColorStop(1, "#0d0e11"); } else { gr.addColorStop(0, "#0b0e14"); gr.addColorStop(1, "#040507"); }
    g.fillStyle = gr; rr(g, DX0, DY0, DW, DH, 18); g.fill();
    g.strokeStyle = lit ? "rgba(255,255,255,0.32)" : "rgba(140,170,255,0.10)"; g.lineWidth = 2; g.beginPath(); g.moveTo(DX0 + 18, DY0 + 1); g.lineTo(DX0 + DW - 18, DY0 + 1); g.stroke();
    fillRR(g, DX0 + BZ, DY0 + BZ, DW - 2 * BZ, DH - 2 * BZ, 6, "#020203");
    // Schalterplatte
    const x0 = SWX - SPW / 2, y0 = SWY - SPH / 2;
    shadow(g, lit ? 22 : 10, lit ? 12 : 4, "rgba(0,0,0,0.5)"); fillRR(g, x0, y0, SPW, SPH, 16, lit ? "#e9e6df" : "#1d2738"); noShadow(g);
    gr = g.createLinearGradient(x0, y0, x0 + SPW * 0.4, y0 + SPH);
    if (lit) { gr.addColorStop(0, "#fbfaf6"); gr.addColorStop(1, "#cfcbc2"); } else { gr.addColorStop(0, "#2f3d58"); gr.addColorStop(1, "#141b29"); }
    g.fillStyle = gr; rr(g, x0, y0, SPW, SPH, 16); g.fill();
    g.strokeStyle = lit ? "rgba(255,255,255,0.8)" : "rgba(160,190,255,0.35)"; g.lineWidth = 2; rr(g, x0 + 1, y0 + 1, SPW - 2, SPH - 2, 15); g.stroke();
    // Vertiefung für die Wippe
    fillRR(g, SWX - 50, SWY - 79, 100, 158, 10, lit ? "#b9b4aa" : "#0e1420");
    // Röhrengehäuse
    shadow(g, lit ? 26 : 8, lit ? 14 : 4, "rgba(0,0,0,0.6)"); fillRR(g, TX0 - 34, TY - 30, TX1 - TX0 + 68, 26, 8, lit ? "#2b2e33" : "#06080c"); noShadow(g);
    gr = g.createLinearGradient(0, TY - 30, 0, TY - 4); gr.addColorStop(0, lit ? "#6b717b" : "#111722"); gr.addColorStop(1, lit ? "#1c1e22" : "#05070a");
    g.fillStyle = gr; rr(g, TX0 - 34, TY - 30, TX1 - TX0 + 68, 26, 8); g.fill();
    for (const ex of [TX0 - 22, TX1 + 2]) fillRR(g, ex, TY - 10, 20, 22, 4, lit ? "#3a3e45" : "#07090d");
  }

  function rocker(g, k, lit) { // k: 0 = aus (oben vorgewölbt), 1 = an (unten vorgewölbt)
    const w = 92, h = 150, x = SWX - w / 2, y = SWY - h / 2; const s = lerp(1, -1, k); // Neigung
    shadow(g, lit ? 10 : 6, 3 * s + (lit ? 3 : 1), lit ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.6)");
    fillRR(g, x, y, w, h, 9, lit ? "#f4f2ec" : "#26324a"); noShadow(g);
    const gr = g.createLinearGradient(0, y, 0, y + h);
    const hi = lit ? "#ffffff" : "#3e4f72", mid_ = lit ? "#e7e3db" : "#222d43", lo = lit ? "#bdb8ae" : "#0f1522";
    if (s > 0) { gr.addColorStop(0, hi); gr.addColorStop(0.45, mid_); gr.addColorStop(1, lo); } else { gr.addColorStop(0, lo); gr.addColorStop(0.55, mid_); gr.addColorStop(1, hi); }
    g.fillStyle = gr; rr(g, x, y, w, h, 9); g.fill();
    // Knick in der Mitte
    g.strokeStyle = lit ? "rgba(0,0,0,0.16)" : "rgba(0,0,0,0.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 6, SWY + s * 2); g.lineTo(x + w - 6, SWY + s * 2); g.stroke();
    g.strokeStyle = lit ? "rgba(255,255,255,0.7)" : "rgba(170,200,255,0.25)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 6, SWY + s * 2 + 2); g.lineTo(x + w - 6, SWY + s * 2 + 2); g.stroke();
    // Glanzkante
    g.strokeStyle = lit ? "rgba(255,255,255,0.9)" : "rgba(170,200,255,0.35)"; g.lineWidth = 2; rr(g, x + 1, y + 1, w - 2, h - 2, 8); g.stroke();
    // Fenster der Glimmlampe
    fillRR(g, SWX - 14, SWY + 46, 28, 8, 4, lit ? "#a9a397" : "#0a0d14");
  }

  function lightAt(u) {
    const f = Math.floor(u * FPS + 0.001);
    if (f >= ON) return Math.min(1, 0.55 + 0.45 * (f - ON + 1) / 2) * (0.985 + 0.015 * Math.sin(u * 13));
    for (const [a, b, lv] of FL) if (f >= a && f <= b) return lv * (f === a ? 1 : 0.8);
    return f >= 4 ? 0.035 : 0;
  }

  // ---------- Website ----------
  function site(g, w, h, k, p) { // k = Aufbau 0..~1.4 (Sekunden seit Start)
    const e = (a, b) => out3(seg(k, a, b)), eb = (a, b) => outBack(seg(k, a, b), 1.6);
    const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, "#fbfcff"); bg.addColorStop(1, "#eef2fb"); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    const bl = g.createRadialGradient(w * 0.82, h * 0.18, 10, w * 0.82, h * 0.18, w * 0.55); bl.addColorStop(0, "rgba(59,130,246,0.22)"); bl.addColorStop(1, "rgba(59,130,246,0)"); g.fillStyle = bl; g.fillRect(0, 0, w, h);
    // Navigation
    let a = e(0.05, 0.3); g.save(); g.globalAlpha = a; g.translate(0, (1 - a) * -30);
    const lg = g.createLinearGradient(24, 16, 52, 44); lg.addColorStop(0, "#3b82f6"); lg.addColorStop(1, "#1d4ed8"); g.fillStyle = lg; rr(g, 24, 16, 30, 30, 9); g.fill();
    fillRR(g, 64, 25, 96, 12, 6, "#1f2937");
    for (let i = 0; i < 3; i++) fillRR(g, w - 330 + i * 72, 26, 54, 10, 5, "#c3cada");
    fillRR(g, w - 108, 15, 86, 32, 16, "#2563eb"); txt(g, "Kontakt", w - 65, 32, { w: 600, px: 14, fam: "I", c: "#fff" });
    g.restore();
    g.fillStyle = "rgba(15,23,42,0.06)"; g.fillRect(0, 62, w * e(0.05, 0.35), 1.5);
    // Überschrift
    const label = String(p.label || "IHRE WEBSITE").toUpperCase(); const lx = 30, maxW = Math.round(w * 0.47);
    font(g, 900, 62, "D"); let lines = [label]; let px = 62;
    if (g.measureText(label).width > maxW) { lines = wrapLines(g, label, maxW); if (lines.length > 2) lines = [lines.slice(0, Math.ceil(lines.length / 2)).join(" "), lines.slice(Math.ceil(lines.length / 2)).join(" ")]; }
    for (const ln of lines) px = Math.min(px, fitPx(g, ln, maxW, 62, 900));
    if (lines.length === 1) px = Math.min(70, fitPx(g, label, maxW, 70, 900));
    a = e(0.12, 0.25); g.save(); g.globalAlpha = a; fillRR(g, lx, 80, 132, 26, 13, "rgba(37,99,235,0.12)"); circle(g, lx + 16, 93, 5, "#2563eb"); fillRR(g, lx + 28, 89, 90, 8, 4, "rgba(37,99,235,0.55)"); g.restore();
    const hy0 = 120 + px * 0.5;
    lines.forEach((ln, i) => {
      const q = e(0.18 + i * 0.08, 0.46 + i * 0.08); if (q <= 0) return;
      g.save(); g.beginPath(); g.rect(lx - 4, hy0 + i * px * 1.02 - px * 0.62, maxW + 40, px * 1.2); g.clip();
      txt(g, ln, lx, hy0 + i * px * 1.02 + (1 - q) * px * 1.1, { w: 900, px, c: "#0b1220", al: "left", ls: -1 }); g.restore();
    });
    const yb = hy0 + (lines.length - 1) * px * 1.02 + px * 0.62 + 12;
    a = e(0.35, 0.55); g.save(); g.globalAlpha = a; fillRR(g, lx, yb, 330 * a, 10, 5, "#9aa4b8"); fillRR(g, lx, yb + 22, 250 * a, 10, 5, "#b9c1d1"); g.restore();
    // Knöpfe
    const btn = p.button || "Jetzt anfragen"; const bk = eb(0.48, 0.72);
    if (bk > 0) {
      g.save(); g.translate(lx + 84, yb + 66); g.scale(bk, bk); shadow(g, 18, 8, "rgba(37,99,235,0.45)"); fillRR(g, -84, -22, 168, 44, 22, "#2563eb"); noShadow(g);
      const bpx = fitPx(g, btn, 140, 16, 700, "I"); txt(g, btn, 0, 1, { w: 700, px: bpx, fam: "I", c: "#fff" }); g.restore();
    }
    const bk2 = eb(0.56, 0.8); if (bk2 > 0) { g.save(); g.translate(lx + 252, yb + 66); g.scale(bk2, bk2); g.strokeStyle = "#c3cada"; g.lineWidth = 2; rr(g, -64, -21, 128, 42, 21); g.stroke(); fillRR(g, -38, -4, 76, 8, 4, "#9aa4b8"); g.restore(); }
    // Bild rechts: Haus im Abendlicht
    const ik = e(0.22, 0.6); const iw = Math.round(w * 0.39), ih = Math.round(h * 0.56), ix = w - iw - 26 + (1 - ik) * 80, iy = 80;
    if (ik > 0) {
      g.save(); g.globalAlpha = ik; shadow(g, 30, 14, "rgba(15,23,42,0.22)"); fillRR(g, ix, iy, iw, ih, 16, "#fff"); noShadow(g);
      rr(g, ix, iy, iw, ih, 16); g.clip();
      const sky = g.createLinearGradient(0, iy, 0, iy + ih); sky.addColorStop(0, "#1e3a8a"); sky.addColorStop(0.55, "#f97316"); sky.addColorStop(1, "#fdba74"); g.fillStyle = sky; g.fillRect(ix, iy, iw, ih);
      const sun = g.createRadialGradient(ix + iw * 0.7, iy + ih * 0.58, 4, ix + iw * 0.7, iy + ih * 0.58, 70); sun.addColorStop(0, "rgba(255,247,214,1)"); sun.addColorStop(0.3, "rgba(255,220,150,0.8)"); sun.addColorStop(1, "rgba(255,180,90,0)"); g.fillStyle = sun; g.fillRect(ix, iy, iw, ih);
      g.fillStyle = "#1a1230"; g.beginPath(); g.moveTo(ix, iy + ih * 0.8); g.lineTo(ix + iw * 0.3, iy + ih * 0.7); g.lineTo(ix + iw * 0.62, iy + ih * 0.78); g.lineTo(ix + iw, iy + ih * 0.7); g.lineTo(ix + iw, iy + ih); g.lineTo(ix, iy + ih); g.fill();
      // Haus
      const hx = ix + 52, hy = iy + ih * 0.52; g.fillStyle = "#120c22"; g.beginPath(); g.moveTo(hx - 12, hy + 22); g.lineTo(hx + 52, hy - 26); g.lineTo(hx + 116, hy + 22); g.lineTo(hx + 104, hy + 22); g.lineTo(hx + 104, hy + 78); g.lineTo(hx, hy + 78); g.lineTo(hx, hy + 22); g.closePath(); g.fill();
      g.fillRect(hx + 80, hy - 18, 12, 24);
      g.fillStyle = "#ffd27a"; g.fillRect(hx + 18, hy + 34, 20, 18); g.fillRect(hx + 64, hy + 34, 20, 18); g.fillStyle = "#3b2a5a"; g.fillRect(hx + 42, hy + 46, 18, 32);
      g.restore();
    }
    // Karten unten
    for (let i = 0; i < 3; i++) {
      const q = eb(0.62 + i * 0.07, 0.9 + i * 0.07); if (q <= 0) continue;
      const cw = (w - 60 - 2 * 16) / 3, cx = 30 + i * (cw + 16), cyy = h - 84;
      g.save(); g.globalAlpha = cl(q); g.translate(0, (1 - q) * 40); shadow(g, 18, 8, "rgba(15,23,42,0.10)"); fillRR(g, cx, cyy, cw, 66, 14, "#ffffff"); noShadow(g);
      const ic = ["#2563eb", "#16a34a", "#f59e0b"][i]; circle(g, cx + 32, cyy + 33, 18, hexA(ic, 0.14));
      if (i === 0) check(g, cx + 32, cyy + 33, 16, 1, ic, 5); else if (i === 1) star(g, cx + 32, cyy + 33, 12, 1, ic, ic);
      else { g.strokeStyle = ic; g.lineWidth = 4; g.beginPath(); g.arc(cx + 32, cyy + 33, 9, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx + 32, cyy + 33); g.lineTo(cx + 32, cyy + 27); g.lineTo(cx + 36, cyy + 33); g.stroke(); }
      fillRR(g, cx + 60, cyy + 22, cw - 86, 9, 4.5, "#1f2937"); fillRR(g, cx + 60, cyy + 39, (cw - 86) * 0.7, 8, 4, "#c3cada"); g.restore();
    }
  }

  // Staub
  function dustSprite() {
    const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, "rgba(255,255,250,1)"); rg.addColorStop(0.25, "rgba(255,255,245,0.55)"); rg.addColorStop(1, "rgba(255,255,240,0)");
    g.fillStyle = rg; g.fillRect(0, 0, 64, 64); return c;
  }
  function coneAt(x, y) { if (y < TY + 6) return 0; const hw = (TX1 - TX0) / 2 + 30 + (y - TY) * 0.5; return (1 - sm(hw - 90, hw + 60, Math.abs(x - TCX))) * Math.exp(-(y - TY) / 900); }

  TYPES.h_lightswitch = {
    zone: "bottom", pal: "black", bgv: 0, coverT: 1.9,
    prep(sc, p) {
      const w = walls(); sc.st.lit = w.lit; sc.st.dark = w.dark; sc.st.dust = dustSprite();
      sc.st.web = document.createElement("canvas"); sc.st.web.width = DW - 2 * BZ; sc.st.web.height = DH - 2 * BZ; sc.st.webK = -1;
    },
    draw(g, u, d, p, sc, P) {
      const on = ON / FPS; const L = lightAt(u);
      const fk = seg(u, 0, 0.05); const flip = outBack(fk, 1.4);
      // Kamera: groß auf den Schalter, dann mit dem Licht zurück auf die ganze Wand
      const zk = inOut(seg(u, 0.08, on + 0.5));
      const s0 = 2.3, s1 = 1.0; let s = s0 * Math.pow(s1 / s0, zk);
      const cx = lerp(SWX - 6, 548, zk), cy = lerp(SWY - 10, 902, zk);
      s *= 1 + 0.03 * Math.exp(-Math.pow((u - 0.05) / 0.06, 2)); // Ruck beim Klick
      s *= 1 + 0.035 * inOut(seg(u, on + 0.5, Math.max(on + 1.5, d))); // langsame Fahrt danach
      const strike = u >= on ? Math.exp(-(u - on) / 0.09) : 0;
      let shx = 0, shy = 0; if (strike > 0.05) { shx = Math.sin(u * 97) * 5 * strike; shy = Math.cos(u * 83) * 5 * strike; }
      g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
      g.save(); g.translate(540 + shx, 860 + shy); g.scale(s, s); g.translate(-cx, -cy);
      // 1) Mondlicht-Szene, 2) Röhrenlicht darüber
      g.drawImage(sc.st.dark, OX, OY); rocker(g, flip, false);
      if (u < 0.05) { // Glimmlampe (aus beim Umlegen)
        const ga = 1 - seg(u, 0.02, 0.05); g.save(); g.globalCompositeOperation = "lighter";
        const rg = g.createRadialGradient(SWX, SWY + 50, 0, SWX, SWY + 50, 60); rg.addColorStop(0, `rgba(255,140,40,${0.55 * ga})`); rg.addColorStop(1, "rgba(255,120,30,0)"); g.fillStyle = rg; g.fillRect(SWX - 60, SWY - 10, 120, 120);
        fillRR(g, SWX - 13, SWY + 47, 26, 6, 3, `rgba(255,170,80,${ga})`); g.restore();
      }
      if (L > 0.001) { g.save(); g.globalAlpha = Math.min(1, L); g.drawImage(sc.st.lit, OX, OY); rocker(g, flip, true); g.restore(); }
      // Lichtkegel (Volumen)
      if (L > 0.01) {
        g.save(); g.globalCompositeOperation = "lighter";
        const cg = g.createLinearGradient(0, TY, 0, TY + 1100); cg.addColorStop(0, `rgba(220,235,255,${0.20 * L})`); cg.addColorStop(0.4, `rgba(220,235,255,${0.07 * L})`); cg.addColorStop(1, "rgba(220,235,255,0)");
        g.fillStyle = cg; g.beginPath(); g.moveTo(TX0 - 10, TY); g.lineTo(TX1 + 10, TY); g.lineTo(TX1 + 560, TY + 1100); g.lineTo(TX0 - 560, TY + 1100); g.closePath(); g.fill(); g.restore();
      }
      // Bildschirm: geht mit dem Licht an, Website baut sich auf
      const sx0 = DX0 + BZ, sy0 = DY0 + BZ, sw = DW - 2 * BZ, sh = DH - 2 * BZ;
      const wk = u - on - 0.06;
      if (wk > 0) {
        const kk = Math.min(1.5, wk); if (Math.abs(kk - sc.st.webK) > 1e-4) { const wg = sc.st.web.getContext("2d"); wg.setTransform(1, 0, 0, 1, 0, 0); wg.clearRect(0, 0, sw, sh); site(wg, sw, sh, kk, p); sc.st.webK = kk; }
        const pw = out3(seg(wk, 0, 0.14));
        g.save(); rr(g, sx0, sy0, sw, sh, 6); g.clip();
        g.globalAlpha = pw; g.drawImage(sc.st.web, sx0, sy0);
        const fl = 1 - seg(wk, 0, 0.3); if (fl > 0) { g.globalAlpha = 1; g.fillStyle = `rgba(210,230,255,${0.75 * fl})`; g.fillRect(sx0, sy0, sw, sh); }
        g.restore();
        // Schein des Bildschirms auf der Wand
        g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = pw;
        shadow(g, 120, 0, "rgba(140,180,255,0.55)"); fillRR(g, sx0 + 30, sy0 + 30, sw - 60, sh - 60, 10, "rgba(140,180,255,0.05)"); noShadow(g); g.restore();
      } else if (L > 0.3) { // im Blitz spiegelt das schwarze Glas
        g.save(); rr(g, sx0, sy0, sw, sh, 6); g.clip(); g.fillStyle = `rgba(40,50,70,${0.25 * L})`; g.fillRect(sx0, sy0, sw, sh); g.restore();
      }
      // Glanzstreif, wenn die Website steht
      const sk = seg(wk, 0.95, 1.45); if (sk > 0 && sk < 1) {
        g.save(); rr(g, sx0, sy0, sw, sh, 6); g.clip(); g.globalCompositeOperation = "lighter"; const bx = lerp(sx0 - 300, sx0 + sw + 300, inOut(sk));
        g.translate(bx, sy0 + sh / 2); g.rotate(0.38); const lg2 = g.createLinearGradient(-110, 0, 110, 0); lg2.addColorStop(0, "rgba(255,255,255,0)"); lg2.addColorStop(0.5, "rgba(255,255,255,0.32)"); lg2.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = lg2; g.fillRect(-110, -sh, 220, 2 * sh); g.restore();
      }
      // Glas-Spiegelung
      g.save(); rr(g, sx0, sy0, sw, sh, 6); g.clip(); const rl = Math.max(L, 0.15);
      const gr = g.createLinearGradient(sx0, sy0, sx0 + sw * 0.6, sy0 + sh); gr.addColorStop(0, `rgba(255,255,255,${0.12 * rl})`); gr.addColorStop(0.45, `rgba(255,255,255,${0.03 * rl})`); gr.addColorStop(0.46, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(sx0, sy0, sw, sh); g.restore();
      // Röhre
      const f = Math.floor(u * FPS + 0.001); const ends = f >= 3 && f < ON ? 0.8 : 0; // Glühenden Enden beim Zünden
      if (ends > 0) for (const ex of [TX0 + 8, TX1 - 8]) { g.save(); g.globalCompositeOperation = "lighter"; const rg = g.createRadialGradient(ex, TY + 3, 0, ex, TY + 3, 38); rg.addColorStop(0, "rgba(255,150,70,0.9)"); rg.addColorStop(1, "rgba(255,110,40,0)"); g.fillStyle = rg; g.fillRect(ex - 40, TY - 36, 80, 80); g.restore(); }
      const tb = Math.min(1, L * 1.05);
      fillRR(g, TX0, TY - 6, TX1 - TX0, 18, 9, `rgb(${Math.round(lerp(40, 245, tb))},${Math.round(lerp(44, 250, tb))},${Math.round(lerp(52, 255, tb))})`);
      if (tb > 0.02) {
        g.save(); g.globalCompositeOperation = "lighter";
        shadow(g, 70, 0, `rgba(200,225,255,${0.9 * tb})`); fillRR(g, TX0 + 4, TY - 4, TX1 - TX0 - 8, 14, 7, `rgba(255,255,255,${tb})`); noShadow(g);
        const bg2 = g.createRadialGradient(TCX, TY + 4, 10, TCX, TY + 4, 520); bg2.addColorStop(0, `rgba(210,230,255,${0.45 * tb})`); bg2.addColorStop(1, "rgba(210,230,255,0)");
        g.fillStyle = bg2; g.save(); g.translate(TCX, TY + 4); g.scale(1, 0.32); g.translate(-TCX, -TY - 4); g.fillRect(TCX - 600, TY - 600, 1200, 1200); g.restore();
        g.restore();
      }
      // Staub im Lichtkegel
      if (L > 0.02) {
        g.save(); g.globalCompositeOperation = "lighter";
        for (let i = 0; i < 90; i++) {
          const big = i < 8; const ph = rnd(i * 3.3) * 6.28;
          let x = TX0 - 120 + rnd(i * 1.7 + 2) * (TX1 - TX0 + 240) + Math.sin(u * (0.5 + rnd(i) * 0.6) + ph) * 22 + u * 8 * (rnd(i * 5) - 0.4);
          let y = TY + 20 + Math.pow(rnd(i * 2.9 + 1), 1.4) * 700 + Math.cos(u * (0.4 + rnd(i * 7) * 0.5) + ph) * 16 - u * 12 * rnd(i * 11);
          const c = coneAt(x, y); if (c < 0.02) continue;
          const tw = 0.55 + 0.45 * Math.sin(u * (2 + rnd(i * 13) * 4) + ph);
          const r = big ? 7 + rnd(i * 17) * 8 : 1.6 + rnd(i * 19) * 3;
          g.globalAlpha = Math.min(1, L * c * tw * (big ? 0.16 : 0.9));
          g.drawImage(sc.st.dust, x - r * 2, y - r * 2, r * 4, r * 4);
        }
        g.restore();
      }
      g.restore();
      // Lichtschlag beim Zünden und Blitze beim Flackern
      if (strike > 0.01) { g.fillStyle = `rgba(225,238,255,${0.32 * strike})`; g.fillRect(0, 0, W, H); }
      if (u < on && L > 0.3) { g.fillStyle = `rgba(200,255,235,${0.08 * L})`; g.fillRect(0, 0, W, H); }
      // Vignette
      const vg = g.createRadialGradient(540, 820, 360, 540, 900, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.72)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    },
    ev(d, p) {
      const E = [[0, "ls_click", 1.0, 0.15]];
      FL.forEach(([a], i) => { E.push([a / FPS, "ls_flick", 0.75 - i * 0.06, (i % 2 ? 0.2 : -0.2)]); if (i === 0 || i === 2) E.push([a / FPS - 0.02, "ls_zirp", 0.5, 0]); });
      const on = ON / FPS; E.push([on, "ls_on", 0.95, 0]);
      E.push([on, "ls_hum" + Math.max(10, Math.min(45, Math.round((d - on + 0.3) * 10))), 0.45, 0]);
      E.push([on + 0.08, "ls_web", 0.55, 0]);
      return E;
    },
  };
})();
