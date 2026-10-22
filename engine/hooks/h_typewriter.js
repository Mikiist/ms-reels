// VOICE_DELAY: 0.6
// h_typewriter: Nahaufnahme einer edlen alten Schreibmaschine. Ab Bild 0 tippt sie Buchstabe für Buchstabe den Text,
// Typenhebel schlagen an, der Wagen rückt nach, am Zeilenende Klingel und Wagenrücklauf (Zeilenschaltung).
// Parameter: text (Standard "Mehr Bewertungen?"), längere Texte werden auf zwei Zeilen verteilt.
(() => {
  const TY = 820; // Schreiblinie (Grundlinie) in Weltpixeln, Anschlagpunkt x = 540
  const KEYROWS = [["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "ß"], ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"], ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"], ["SH", "Y", "X", "C", "V", "B", "N", "M", ",", ".", "-", "SH"]];
  const ROWY = [1080, 1153, 1232, 1318], ROWS = [0.8, 0.88, 0.97, 1.07], ROWB = [1.3, 2.3, 3.4, 4.8], ROWOFF = [-0.25, 0.05, 0.3, 0];
  const SHIFTED = { "?": "ß", "!": "1", ":": ".", ";": ",", "_": "-", "\"": "2", "§": "3", "$": "4", "%": "5", "&": "6", "/": "7", "(": "8", ")": "9", "=": "0" };
  const tf = (px) => `bold ${px}px FreeMono, "Liberation Mono", "DejaVu Sans Mono", monospace`;

  function keyPos(r, j) { const s = ROWS[r], sp = 106 * s, n = KEYROWS[r].length; return { x: 540 + (j - (n - 1) / 2 + ROWOFF[r]) * sp, y: ROWY[r], s }; }
  function keyFor(ch) { // Taste(n) zu einem Zeichen: [{r, j}] plus ggf. Umschalttaste
    if (ch === " ") return { space: true, keys: [] };
    let base = ch, shift = false;
    if (SHIFTED[ch]) { base = SHIFTED[ch]; shift = true; } else if (ch !== ch.toLowerCase()) { base = ch; shift = true; } else base = ch.toUpperCase();
    for (let r = 0; r < 4; r++) { const j = KEYROWS[r].indexOf(base); if (j >= 0 && base !== "SH") return { keys: [{ r, j }], shift }; }
    const h = Math.floor(rnd(ch.charCodeAt(0) * 0.37) * 11); return { keys: [{ r: 1 + (h % 3), j: h }], shift: false };
  }

  // ---------- Ablauf ----------
  function plan(d, p) {
    let raw = String(p.text || "Mehr Bewertungen?").replace(/[–—]/g, "-").replace(/\s+/g, " ").trim(); if (!raw) raw = "Mehr Bewertungen?";
    let lines = [raw];
    if (raw.length > 19) { const mid = raw.length / 2; let best = -1; for (let i = 0; i < raw.length; i++) if (raw[i] === " " && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i; if (best > 0) lines = [raw.slice(0, best), raw.slice(best + 1)]; }
    const maxLen = Math.max(...lines.map((l) => l.length)); const adv = Math.min(50, 650 / maxLen); const px = adv / 0.6; const lineH = Math.round(px * 1.28);
    let wsum = 0; lines.forEach((l) => { for (let i = 1; i < l.length; i++) wsum += l[i] === " " || l[i - 1] === " " ? 0.75 : 1; });
    const RET = 0.44; const avail = Math.max(0.55, d - 0.98 - (lines.length - 1) * RET);
    const dt = Math.max(0.042, Math.min(0.125, avail / Math.max(1, wsum)));
    const strikes = [], rets = []; let t = 0;
    lines.forEach((l, L) => {
      for (let i = 0; i < l.length; i++) {
        if (i > 0) t += (l[i] === " " || l[i - 1] === " " ? 0.75 : 1) * dt * (0.93 + 0.14 * rnd(i * 3.31 + L * 7));
        strikes.push({ t, ch: l[i], L, i, k: keyFor(l[i]), v: Math.floor(rnd(i * 1.7 + L) * 4) });
      }
      const last = L === lines.length - 1; const tR = t + (last ? 0.17 : 0.11);
      rets.push({ t: tR, L, n: l.length, ding: last ? t + 0.075 : null }); t = tR + RET;
    });
    return { lines, maxLen, adv, px, lineH, strikes, rets, dt };
  }
  const CAR0 = (P) => 540 - P.adv / 2;
  // Wagenstellung (ruckweise, wie die echte Schaltung) und weich geführte Kamera-Variante
  function carriage(P, u) {
    let car = CAR0(P), smooth = CAR0(P), lever = 0, bounce = 0, contentN = 0, mLin = 0;
    for (const R of P.rets) {
      const ss = P.strikes.filter((s) => s.L === R.L); const t0 = ss[0].t, tl = ss[ss.length - 1].t; const n = R.n;
      if (u < t0) break;
      let m = 0; for (const s of ss) m += outBack(seg(u, s.t + 0.012, s.t + 0.055), 2.2);
      mLin = n * cl((u - t0 + 0.03) / Math.max(0.05, tl - t0 + 0.06));
      const prevMax = Math.max(0, ...P.lines.slice(0, R.L).map((l) => l.length));
      if (u < R.t) { car = CAR0(P) - P.adv * m; smooth = CAR0(P) - P.adv * mLin; contentN = Math.max(prevMax, mLin); break; }
      // Wagenrücklauf
      const q = seg(u, R.t + 0.02, R.t + 0.3); const e = 1 - Math.pow(1 - q, 1.7);
      car = lerp(CAR0(P) - P.adv * n, CAR0(P), e);
      const x = u - (R.t + 0.3); if (x > 0) bounce = -7 * Math.exp(-x * 22) * Math.sin(x * 70);
      car += bounce;
      smooth = lerp(CAR0(P) - P.adv * n, CAR0(P), out3(seg(u, R.t + 0.04, R.t + 0.62)));
      lever = Math.max(lever, seg(u, R.t - 0.04, R.t + 0.03) * (1 - seg(u, R.t + 0.12, R.t + 0.4)));
      contentN = Math.max(prevMax, n);
      const nx = P.strikes.find((s) => s.L === R.L + 1); if (nx && u >= nx.t) continue; break;
    }
    return { car, smooth, lever, contentN };
  }
  function feedAt(P, u) { let f = 0; for (const R of P.rets) f += outBack(seg(u, R.t, R.t + 0.13), 1.4); return f; }

  // ---------- Vorbereitung ----------
  function paperTex() {
    const Wp = 1180, Hp = 1900; const c = document.createElement("canvas"); c.width = Wp; c.height = Hp; const g = c.getContext("2d");
    const im = g.createImageData(Wp, Hp), D = im.data; const PT = new Float32Array(4096); for (let i = 0; i < 4096; i++) PT[i] = rnd(i * 0.917 + 5.3);
    for (let y = 0; y < Hp; y++) for (let x = 0; x < Wp; x++) {
      const n = PT[(x * 7 + y * 131) & 4095] - 0.5, f = PT[((x >> 2) * 13 + (y >> 1) * 29) & 4095] - 0.5;
      const k = 1 + n * 0.035 + f * 0.03; const i = (y * Wp + x) * 4;
      D[i] = 246 * k; D[i + 1] = 239 * k; D[i + 2] = 224 * k; D[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    g.globalAlpha = 0.06; g.strokeStyle = "#8a7a5a"; g.lineWidth = 1;
    for (let i = 0; i < 2600; i++) { const x = rnd(i * 2.1) * Wp, y = rnd(i * 3.7 + 1) * Hp, a = rnd(i * 5.3) * 6.28, l = 3 + rnd(i * 1.9) * 9; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 1) * l * 0.5, y + Math.sin(a + 1) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke(); }
    g.globalAlpha = 1;
    return c;
  }
  function bokeh() {
    const c = document.createElement("canvas"); c.width = W + 400; c.height = H; const g = c.getContext("2d");
    g.fillStyle = "#0a0705"; g.fillRect(0, 0, c.width, H);
    let rg = g.createRadialGradient(-80, 640, 0, -80, 640, 1300); rg.addColorStop(0, "rgba(255,168,88,0.42)"); rg.addColorStop(0.5, "rgba(150,80,35,0.14)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0, 0, c.width, H);
    for (let i = 0; i < 30; i++) {
      const x = rnd(i * 4.3 + 2) * c.width, y = 120 + rnd(i * 2.9) * 1500, r = 30 + rnd(i * 6.1) * 90, a = 0.05 + rnd(i * 1.7) * 0.13;
      const col = i % 3 === 0 ? "255,200,140" : i % 3 === 1 ? "255,150,80" : "255,230,190";
      const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, `rgba(${col},${a})`); q.addColorStop(0.75, `rgba(${col},${a * 0.8})`); q.addColorStop(1, `rgba(${col},0)`); g.fillStyle = q; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    return c;
  }
  function keySprite(label, s, blur, pressed) {
    const r = 36 * s, pad = 26, stem = 46 * s; const w = Math.ceil(2 * (r + pad)), h = Math.ceil(2 * (r + pad) + stem);
    const t = document.createElement("canvas"); t.width = w; t.height = h; const g = t.getContext("2d"); const cx = w / 2, cy = r + pad;
    // Schatten auf dem Gehäuse
    g.save(); g.filter = `blur(${pressed ? 5 : 9}px)`; g.fillStyle = "rgba(0,0,0,0.75)"; g.beginPath(); g.ellipse(cx + 6 * s, cy + r * (pressed ? 0.55 : 0.9) + stem * 0.4, r * 0.95, r * 0.5, 0, 0, 7); g.fill(); g.restore();
    // Tastenhebel
    const sg = g.createLinearGradient(cx - 5 * s, 0, cx + 5 * s, 0); sg.addColorStop(0, "#2a2826"); sg.addColorStop(0.45, "#b9b2a6"); sg.addColorStop(1, "#1b1a19");
    g.fillStyle = sg; g.fillRect(cx - 4.5 * s, cy, 9 * s, stem + r * 0.4);
    // Chromring
    const rg = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r); rg.addColorStop(0, "#fff8ea"); rg.addColorStop(0.28, "#cfc8bb"); rg.addColorStop(0.55, "#6e675d"); rg.addColorStop(0.8, "#b9b1a3"); rg.addColorStop(1, "#3b3730");
    g.fillStyle = rg; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 1.5; g.beginPath(); g.arc(cx, cy, r - 0.5, 0, 7); g.stroke();
    // Glasierte schwarze Kappe
    const ir = r * 0.79; const kg = g.createRadialGradient(cx - ir * 0.35, cy - ir * 0.4, ir * 0.05, cx, cy, ir * 1.05);
    kg.addColorStop(0, pressed ? "#3c3b40" : "#56555c"); kg.addColorStop(0.35, "#18181c"); kg.addColorStop(1, "#040405"); g.fillStyle = kg; g.beginPath(); g.arc(cx, cy, ir, 0, 7); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.9)"; g.lineWidth = 2 * s; g.beginPath(); g.arc(cx, cy, ir, 0, 7); g.stroke();
    // Beschriftung
    g.fillStyle = "#efe4c8"; g.textAlign = "center"; g.textBaseline = "middle";
    if (label === "SH") { g.save(); g.translate(cx, cy + 2 * s); g.strokeStyle = "#efe4c8"; g.lineWidth = 3 * s; g.lineJoin = "round"; g.beginPath(); const a = ir * 0.5; g.moveTo(0, -a); g.lineTo(a * 0.9, 0); g.lineTo(a * 0.42, 0); g.lineTo(a * 0.42, a * 0.75); g.lineTo(-a * 0.42, a * 0.75); g.lineTo(-a * 0.42, 0); g.lineTo(-a * 0.9, 0); g.closePath(); g.stroke(); g.restore(); }
    else if (label === "ß") { g.font = `700 ${Math.round(ir * 0.62)}px I`; g.fillText("?", cx, cy - ir * 0.3); g.fillText("ß", cx, cy + ir * 0.32); }
    else { g.font = `700 ${Math.round(ir * 0.95)}px I`; g.fillText(label, cx, cy + 1.5 * s); }
    // Glanz
    g.fillStyle = "rgba(255,255,255,0.22)"; g.beginPath(); g.ellipse(cx - ir * 0.32, cy - ir * 0.48, ir * 0.42, ir * 0.18, -0.5, 0, 7); g.fill();
    g.strokeStyle = "rgba(255,236,200,0.85)"; g.lineWidth = 2.2 * s; g.beginPath(); g.arc(cx, cy, r - 2.5 * s, Math.PI * 1.05, Math.PI * 1.45); g.stroke();
    const out = document.createElement("canvas"); out.width = w; out.height = h; const o = out.getContext("2d"); o.filter = `blur(${blur}px)`; o.drawImage(t, 0, 0);
    return { c: out, ox: cx, oy: cy };
  }
  function spaceSprite() {
    const w = 640, h = 140; const t = document.createElement("canvas"); t.width = w; t.height = h; const g = t.getContext("2d");
    g.save(); g.filter = "blur(10px)"; g.fillStyle = "rgba(0,0,0,0.7)"; g.beginPath(); g.ellipse(w / 2 + 8, 92, 290, 26, 0, 0, 7); g.fill(); g.restore();
    const gr = g.createLinearGradient(0, 40, 0, 96); gr.addColorStop(0, "#4b4a50"); gr.addColorStop(0.3, "#141418"); gr.addColorStop(1, "#050506");
    g.fillStyle = gr; rr(g, 40, 40, w - 80, 52, 24); g.fill();
    const cg = g.createLinearGradient(40, 0, w - 40, 0); cg.addColorStop(0, "#fff4de"); cg.addColorStop(0.5, "#6d665b"); cg.addColorStop(1, "#cfc6b6");
    g.strokeStyle = cg; g.lineWidth = 6; rr(g, 40, 40, w - 80, 52, 24); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.18)"; rr(g, 70, 48, w - 140, 8, 4); g.fill();
    const out = document.createElement("canvas"); out.width = w; out.height = h; const o = out.getContext("2d"); o.filter = "blur(6px)"; o.drawImage(t, 0, 0);
    return out;
  }
  function deck() { // Gehäuse (maschinenfest): Deck, Typenkorb, Spulen, Frontplatte
    const c = document.createElement("canvas"); c.width = 2600; c.height = 1100; const g = c.getContext("2d"); const OX = 760, OY = 940; // Welt (x,y) -> (x+OX-540+540, y-OY)
    g.translate(OX, -OY);
    // Frontplatte
    let gr = g.createLinearGradient(0, 1040, 0, 2040); gr.addColorStop(0, "#141316"); gr.addColorStop(0.25, "#09090b"); gr.addColorStop(1, "#020203"); g.fillStyle = gr; g.fillRect(-760, 1040, 2600, 1000);
    // Deck
    gr = g.createLinearGradient(0, 958, 0, 1070); gr.addColorStop(0, "#2c2a2e"); gr.addColorStop(0.12, "#121114"); gr.addColorStop(0.85, "#0b0a0c"); gr.addColorStop(1, "#1d1b1e"); g.fillStyle = gr; g.fillRect(-760, 958, 2600, 112);
    // Reflexband (Fenster) auf dem Lack
    gr = g.createLinearGradient(-200, 0, 700, 0); gr.addColorStop(0, "rgba(255,200,140,0)"); gr.addColorStop(0.45, "rgba(255,200,140,0.10)"); gr.addColorStop(1, "rgba(255,200,140,0)"); g.fillStyle = gr; g.fillRect(-760, 962, 2600, 22);
    // Goldlinie
    g.strokeStyle = "rgba(214,170,90,0.75)"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-760, 1066); g.lineTo(1840, 1066); g.stroke();
    g.strokeStyle = "rgba(214,170,90,0.45)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-760, 1074); g.lineTo(1840, 1074); g.stroke();
    // Typenkorb: dunkle Mulde
    const bx = 540, by = 966, rx = 345, ry = 118;
    g.save(); g.beginPath(); g.ellipse(bx, by, rx, ry, 0, 0, Math.PI); g.closePath(); g.clip();
    gr = g.createRadialGradient(bx, by, 10, bx, by + 30, rx); gr.addColorStop(0, "#000"); gr.addColorStop(0.7, "#060506"); gr.addColorStop(1, "#1c1a1c"); g.fillStyle = gr; g.fillRect(bx - rx, by, 2 * rx, ry);
    g.restore();
    g.strokeStyle = "rgba(255,220,170,0.25)"; g.lineWidth = 2; g.beginPath(); g.ellipse(bx, by, rx, ry, 0, 0.02, Math.PI - 0.02); g.stroke();
    // Segment (Lagerbogen)
    g.strokeStyle = "#8d877d"; g.lineWidth = 7; g.beginPath(); g.ellipse(bx, by, rx * 0.93, ry * 0.93, 0, 0.05, Math.PI - 0.05); g.stroke();
    g.strokeStyle = "rgba(255,240,215,0.6)"; g.lineWidth = 2; g.beginPath(); g.ellipse(bx, by - 2, rx * 0.93, ry * 0.93, 0, 0.05, Math.PI - 0.05); g.stroke();
    // Spulen
    for (const sx of [540 - 505, 540 + 505]) {
      shadow(g, 18, 6, "rgba(0,0,0,0.8)"); g.fillStyle = "#222"; g.beginPath(); g.ellipse(sx, 1000, 82, 40, 0, 0, 7); g.fill(); noShadow(g);
      gr = g.createLinearGradient(sx - 82, 960, sx + 82, 1040); gr.addColorStop(0, "#f6efe1"); gr.addColorStop(0.35, "#a39c90"); gr.addColorStop(0.7, "#4f4a43"); gr.addColorStop(1, "#c3baab");
      g.fillStyle = gr; g.beginPath(); g.ellipse(sx, 996, 80, 38, 0, 0, 7); g.fill();
      g.fillStyle = "#1a1416"; g.beginPath(); g.ellipse(sx, 996, 58, 27, 0, 0, 7); g.fill();
      g.fillStyle = "#3a1015"; g.beginPath(); g.ellipse(sx, 996, 50, 23, 0, 0, 7); g.fill();
      g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 1; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(sx, 996, 30 + k * 4, 14 + k * 1.8, 0, 0, 7); g.stroke(); }
      gr = g.createRadialGradient(sx - 6, 990, 1, sx, 996, 18); gr.addColorStop(0, "#fffaf0"); gr.addColorStop(1, "#6b655c"); g.fillStyle = gr; g.beginPath(); g.ellipse(sx, 996, 18, 9, 0, 0, 7); g.fill();
    }
    return { c, OX, OY };
  }

  // ---------- Zeichnen ----------
  function drawPaper(g, sc, P, car, feed, u) {
    const pl = car - 160, pw = P.maxLen * P.adv + 320; const top = -400, bot = 905;
    g.save(); g.beginPath(); g.rect(pl, top, pw, bot - top); g.clip();
    const off = (feed * P.lineH) % 600; g.drawImage(sc.st.paper, 0, 0, pw, 1900, pl, top - off, pw, 1900);
    // Licht von links, Wölbung zur Walze
    let gr = g.createLinearGradient(pl, 0, pl + pw, 0); gr.addColorStop(0, "rgba(255,214,160,0.20)"); gr.addColorStop(0.5, "rgba(255,214,160,0.0)"); gr.addColorStop(1, "rgba(40,22,8,0.30)");
    g.fillStyle = gr; g.fillRect(pl, top, pw, bot - top);
    gr = g.createLinearGradient(0, TY + 20, 0, bot); gr.addColorStop(0, "rgba(30,18,6,0)"); gr.addColorStop(1, "rgba(30,18,6,0.55)"); g.fillStyle = gr; g.fillRect(pl, TY + 20, pw, bot - TY - 20);
    // Text
    for (const s of P.strikes) {
      if (s.ch === " " || u < s.t) continue;
      const y = TY - (feed - s.L) * P.lineH; if (y < -100 || y > bot + 60) continue;
      const x = car + s.i * P.adv + P.adv / 2; const age = u - s.t; const j1 = rnd(s.i * 9.1 + s.L * 3), j2 = rnd(s.i * 4.7 + s.L * 5 + 1);
      const fresh = 1 - seg(age, 0, 0.09);
      g.save(); g.translate(x + (j1 - 0.5) * 2.2, y + (j2 - 0.5) * 2.6); g.rotate((j1 - 0.5) * 0.035); const sc2 = 1 + 0.07 * fresh; g.scale(sc2, sc2);
      g.font = tf(Math.round(P.px)); g.textAlign = "center"; g.textBaseline = "alphabetic";
      g.globalAlpha = 0.8 + 0.2 * j2; g.fillStyle = "#17141a"; shadow(g, 1.6, 0, "rgba(23,20,26,0.7)"); g.fillText(s.ch, 0, 0); noShadow(g);
      g.globalAlpha = 0.22; g.fillText(s.ch, 0.9, 0.5); g.restore();
    }
    g.restore();
  }
  function drawCarriage(g, P, car, lever, feed) {
    const L = car - 300, R = car + P.maxLen * P.adv + 300;
    // Papierhalter (Bügel) mit Gummirollen
    const by = 470; const bg = g.createLinearGradient(0, by - 8, 0, by + 8); bg.addColorStop(0, "#fffaf0"); bg.addColorStop(0.45, "#9d968a"); bg.addColorStop(1, "#38342f");
    shadow(g, 16, 10, "rgba(40,20,0,0.35)"); g.fillStyle = bg; rr(g, L + 40, by - 7, R - L - 80, 14, 7); g.fill(); noShadow(g);
    for (const fx of [0.22, 0.78]) { const x = lerp(car - 100, car + P.maxLen * P.adv + 100, fx); const rg = g.createLinearGradient(0, by - 14, 0, by + 14); rg.addColorStop(0, "#5a5450"); rg.addColorStop(0.5, "#1c1a19"); rg.addColorStop(1, "#0b0a0a"); g.fillStyle = rg; rr(g, x - 30, by - 13, 60, 26, 9); g.fill(); }
    // Walze
    const py = 880, ph = 82; let gr = g.createLinearGradient(0, py, 0, py + ph);
    gr.addColorStop(0, "#050505"); gr.addColorStop(0.18, "#2f2c2b"); gr.addColorStop(0.3, "#8e857a"); gr.addColorStop(0.36, "#2a2827"); gr.addColorStop(0.7, "#0d0c0c"); gr.addColorStop(1, "#000");
    g.fillStyle = gr; g.fillRect(L, py, R - L, ph);
    // Rillen/Zeilenschaltung (Rad dreht beim Vorschub)
    // Drehknöpfe an den Enden
    for (const [x, dir] of [[L - 6, -1], [R + 6, 1]]) {
      const kw = 70, kx = dir < 0 ? x - kw : x; const kg = g.createLinearGradient(0, py - 18, 0, py + ph + 18);
      kg.addColorStop(0, "#5c5650"); kg.addColorStop(0.25, "#fbf4e6"); kg.addColorStop(0.45, "#8f877b"); kg.addColorStop(0.8, "#2c2925"); kg.addColorStop(1, "#6a635a");
      g.fillStyle = kg; rr(g, kx, py - 16, kw, ph + 32, 14); g.fill();
      g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 2; const ph2 = (feed * 22) % 8; for (let k = 0; k < 9; k++) { const xx = kx + 6 + k * 7.5 + ph2 * 0; g.beginPath(); g.moveTo(xx, py - 12); g.lineTo(xx, py + ph + 12); g.stroke(); }
    }
    // Wagenrücklauf-Hebel links
    g.save(); g.translate(L - 40, py + 6); g.rotate(-0.62 - lever * 0.45);
    const lg = g.createLinearGradient(0, -10, 0, 10); lg.addColorStop(0, "#fffaf0"); lg.addColorStop(0.5, "#8a8378"); lg.addColorStop(1, "#2f2b27");
    shadow(g, 14, 8, "rgba(0,0,0,0.5)"); g.fillStyle = lg; rr(g, -250, -9, 250, 18, 9); g.fill(); noShadow(g);
    const bgr = g.createRadialGradient(-262, -6, 2, -255, 0, 26); bgr.addColorStop(0, "#fffdf6"); bgr.addColorStop(1, "#5d574f"); g.fillStyle = bgr; g.beginPath(); g.arc(-255, 0, 24, 0, 7); g.fill();
    g.restore();
  }
  function drawGuideRibbon(g, lift) {
    // Farbband (schwarz/rot), wird beim Anschlag angehoben
    const y0 = 856, hb = 24, x0 = 540 - 505, x1 = 540 + 505;
    g.save(); const steps = 40; g.beginPath();
    const yy = (x) => y0 - lift * 34 * Math.exp(-Math.pow((x - 540) / 70, 2));
    for (let i = 0; i <= steps; i++) { const x = lerp(x0, x1, i / steps); if (i === 0) g.moveTo(x, yy(x)); else g.lineTo(x, yy(x)); }
    for (let i = steps; i >= 0; i--) { const x = lerp(x0, x1, i / steps); g.lineTo(x, yy(x) + hb); }
    g.closePath(); g.clip();
    const gr = g.createLinearGradient(0, y0 - 40, 0, y0 + hb); gr.addColorStop(0, "#0c0b0c"); gr.addColorStop(0.55, "#1a1718"); gr.addColorStop(0.56, "#5d0f17"); gr.addColorStop(1, "#2b060a");
    g.fillStyle = gr; g.fillRect(x0, y0 - 40, x1 - x0, hb + 40);
    const sh = g.createLinearGradient(x0, 0, x1, 0); sh.addColorStop(0, "rgba(255,210,170,0.0)"); sh.addColorStop(0.35, "rgba(255,210,170,0.10)"); sh.addColorStop(0.6, "rgba(255,210,170,0)"); g.fillStyle = sh; g.fillRect(x0, y0 - 40, x1 - x0, hb + 40);
    g.restore();
    // Typenführung (Chrom mit Kerbe)
    const gg = g.createLinearGradient(0, 836, 0, 872); gg.addColorStop(0, "#fffbf2"); gg.addColorStop(0.4, "#a59e92"); gg.addColorStop(1, "#3c3833");
    shadow(g, 10, 4, "rgba(0,0,0,0.5)"); g.fillStyle = gg; g.beginPath(); g.moveTo(450, 832); g.lineTo(512, 832); g.lineTo(540, 852); g.lineTo(568, 832); g.lineTo(630, 832); g.lineTo(616, 874); g.lineTo(464, 874); g.closePath(); g.fill(); noShadow(g);
    g.fillStyle = "#b3262e"; g.fillRect(538.5, 852, 3, 18);
  }
  function barGeom(k) { const a = Math.PI * (0.07 + 0.86 * k); return { a, px: 540 + 345 * 0.93 * Math.cos(a), py: 966 + 118 * 0.93 * Math.sin(a), tx: 540 + 345 * 0.2 * Math.cos(a), ty: 966 + 118 * 0.2 * Math.sin(a) - 4 }; }
  function bar(g, x0, y0, x1, y1, w, alpha) {
    g.save(); g.globalAlpha = alpha; const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, "#5b554d"); gr.addColorStop(0.6, "#d8d0c2"); gr.addColorStop(1, "#8a8276");
    g.strokeStyle = gr; g.lineCap = "round"; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0); g.translate(x1, y1); g.rotate(a); fillRR(g, -6, -w * 1.4, 22, w * 2.8, 3, "#cfc7b8"); g.restore();
  }
  function strikeOf(P, u) { // laufender Anschlag (Typenhebel + Taste)
    let best = null; for (const s of P.strikes) { if (s.ch === " ") continue; const x = u - s.t; if (x > -0.05 && x < 0.11) best = { s, x }; } return best;
  }
  function pressAmt(s, u) { const x = u - s.t; return x < -0.04 ? 0 : x < 0 ? (x + 0.04) / 0.04 : x < 0.03 ? 1 : Math.max(0, 1 - (x - 0.03) / 0.08); }

  TYPES.h_typewriter = {
    zone: "bottom", pal: "black", bgv: 0, coverT: 2.9,
    prep(sc, p) {
      sc.st.paper = paperTex(); sc.st.bok = bokeh(); sc.st.deck = deck(); sc.st.space = spaceSprite();
      sc.st.keys = KEYROWS.map((row, r) => row.map((lab) => ({ up: keySprite(lab, ROWS[r], ROWB[r], false), dn: keySprite(lab, ROWS[r], ROWB[r], true) })));
      sc.st.P = null;
    },
    draw(g, u, d, p, sc) {
      if (!sc.st.P || sc.st.Pd !== d) { sc.st.P = plan(d, p); sc.st.Pd = d; }
      const P = sc.st.P; const C = carriage(P, u); const feed = feedAt(P, u);
      const camX = C.smooth + (C.contentN * P.adv) / 2 - 540;
      const lastR = P.rets[P.rets.length - 1]; const fin = seg(u, lastR.t, lastR.t + 0.7);
      // Kamera: leichte Schräglage, langsame Fahrt, Rucke bei Anschlag und Anschlag des Wagens
      let shx = 0, shy = 0; for (const s of P.strikes) { const x = u - s.t; if (s.ch !== " " && x >= 0 && x < 0.12) { const k = Math.exp(-x * 40) * 2.2; shx += Math.sin(x * 160) * k * 0.5; shy += Math.cos(x * 130) * k; } }
      for (const R of P.rets) { const x = u - (R.t + 0.3); if (x >= 0 && x < 0.4) { const k = Math.exp(-x / 0.07) * 9; shx += Math.sin(x * 97) * k; shy += Math.cos(x * 83) * k * 0.6; } }
      const z = 1.27 + 0.04 * inOut(cl(u / Math.max(1.5, d))) + 0.03 * out3(fin);
      // Hintergrund
      g.drawImage(sc.st.bok, -200 - camX * 0.25 - u * 6, 0);
      g.save(); g.translate(540 + shx, 860 + shy); g.rotate(-0.058); g.scale(z, z); g.translate(-540 - camX, -860 + 18 * out3(fin));
      // Papier + Wagen (mit Bewegungsunschärfe beim Rücklauf)
      const v = C.car - carriage(P, u - 1 / 60).car;
      if (Math.abs(v) > 6) { for (let k = 3; k >= 1; k--) { g.save(); g.globalAlpha = 0.18; const cx = C.car - v * k * 0.9; drawPaper(g, sc, P, cx, feed, u); drawCarriage(g, P, cx, C.lever, feed); g.restore(); } }
      drawPaper(g, sc, P, C.car, feed, u);
      drawCarriage(g, P, C.car, C.lever, feed);
      // Schiene unter der Walze
      const rg = g.createLinearGradient(0, 960, 0, 976); rg.addColorStop(0, "#d9d2c4"); rg.addColorStop(0.5, "#5d5850"); rg.addColorStop(1, "#1c1a18"); g.fillStyle = rg; g.fillRect(camX - 400, 960, 1900, 14);
      // Gehäuse
      const D = sc.st.deck; g.drawImage(D.c, -D.OX, D.OY);
      // Klingel
      const ding = lastR.ding != null ? u - lastR.ding : -1; const dv = ding >= 0 && ding < 0.8 ? Math.exp(-ding * 6) : 0;
      { const bx = 540 - 375 + Math.sin(u * 140) * 2.5 * dv, by = 1012; shadow(g, 14, 6, "rgba(0,0,0,0.7)"); const bg2 = g.createRadialGradient(bx - 12, by - 14, 2, bx, by, 34); bg2.addColorStop(0, "#fffef8"); bg2.addColorStop(0.4, "#c9c0ae"); bg2.addColorStop(1, "#4a443b");
        g.fillStyle = bg2; g.beginPath(); g.ellipse(bx, by, 34, 22, 0, Math.PI, 0); g.lineTo(bx + 34, by + 4); g.lineTo(bx - 34, by + 4); g.closePath(); g.fill(); noShadow(g);
        circle(g, bx, by - 22, 5, "#e8e0d0");
        if (dv > 0.02) { g.save(); g.globalCompositeOperation = "lighter"; for (let k = 0; k < 3; k++) { const q = cl(ding * 1.6 - k * 0.18); if (q <= 0 || q >= 1) continue; g.strokeStyle = `rgba(255,225,160,${0.6 * (1 - q)})`; g.lineWidth = 4 * (1 - q) + 1; g.beginPath(); g.ellipse(bx, by - 6, 40 + q * 130, 26 + q * 80, 0, 0, 7); g.stroke(); }
          const fl = g.createRadialGradient(bx - 10, by - 14, 0, bx - 10, by - 14, 90); fl.addColorStop(0, `rgba(255,240,200,${0.8 * dv})`); fl.addColorStop(1, "rgba(255,240,200,0)"); g.fillStyle = fl; g.fillRect(bx - 100, by - 110, 200, 200); g.restore(); }
      }
      // Typenhebel in Ruhe
      const st = strikeOf(P, u); let activeK = -1;
      if (st) { const kk = st.s.k.keys[0]; const kp = keyPos(kk.r, kk.j); activeK = Math.round(cl(1 - (kp.x - 30) / 1020) * 43); }
      for (let k = 0; k < 44; k++) { if (k === activeK) continue; const B = barGeom(k / 43); bar(g, B.px, B.py, B.tx, B.ty, 4, 0.9); }
      // Farbband + Führung
      let lift = 0; if (st) { const x = st.x; lift = x < -0.03 ? 0 : x < 0 ? (x + 0.03) / 0.03 : Math.max(0, 1 - x / 0.07); }
      drawGuideRibbon(g, lift);
      // Tasten
      const pressed = new Map(); let shiftAmt = 0, spaceAmt = 0;
      for (const s of P.strikes) { const a = pressAmt(s, u); if (a <= 0) continue; if (s.k.space) spaceAmt = Math.max(spaceAmt, a); for (const kk of s.k.keys) pressed.set(kk.r * 100 + kk.j, Math.max(pressed.get(kk.r * 100 + kk.j) || 0, a)); if (s.k.shift) shiftAmt = Math.max(shiftAmt, Math.min(1, a * 1.6 + (u - s.t > -0.09 && u - s.t < 0.06 ? 1 : 0))); }
      for (let r = 0; r < 4; r++) KEYROWS[r].forEach((lab, j) => {
        const kp = keyPos(r, j); let a = pressed.get(r * 100 + j) || 0; if (lab === "SH" && j === 0) a = Math.max(a, cl(shiftAmt));
        const S = sc.st.keys[r][j]; const spr = a > 0.5 ? S.dn : S.up; g.drawImage(spr.c, kp.x - spr.ox, kp.y - spr.oy + a * 15 * kp.s);
      });
      g.drawImage(sc.st.space, 540 - 320 + 40, 1372 + spaceAmt * 12);
      // Anschlagender Typenhebel (vor allem anderen)
      if (st) {
        const B = barGeom(activeK / 43); const x = st.x; const e = x < 0 ? Math.pow(cl((x + 0.05) / 0.05), 1.6) : Math.max(0, 1 - out3(cl(x / 0.1)));
        const tip = (q) => [lerp(B.tx, 540, q), lerp(B.ty, TY - P.px * 0.32, q) - 90 * Math.sin(Math.PI * q) * 0.8];
        for (let k = 3; k >= 1; k--) { const q = cl(e - k * 0.11 * (x < 0 ? 1 : -0.6)); const [tx, ty] = tip(q); bar(g, B.px, B.py, tx, ty, 5 + 3 * Math.sin(Math.PI * q), 0.16); }
        const [tx, ty] = tip(e); bar(g, B.px, B.py, tx, ty, 5.5 + 3.5 * Math.sin(Math.PI * e), 1);
        if (x >= 0 && x < 0.06) { const k = 1 - x / 0.06; g.save(); g.globalCompositeOperation = "lighter"; const fl = g.createRadialGradient(540, TY - 20, 0, 540, TY - 20, 70); fl.addColorStop(0, `rgba(255,236,200,${0.55 * k})`); fl.addColorStop(1, "rgba(255,236,200,0)"); g.fillStyle = fl; g.fillRect(470, TY - 90, 140, 140); g.restore(); }
      }
      g.restore();
      // Lichtkegel von links mit schwebendem Staub
      g.save(); g.globalCompositeOperation = "screen";
      const bm = g.createLinearGradient(0, 250, 760, 1150); bm.addColorStop(0, "rgba(255,190,120,0.16)"); bm.addColorStop(0.6, "rgba(255,190,120,0.05)"); bm.addColorStop(1, "rgba(255,190,120,0)");
      g.fillStyle = bm; g.beginPath(); g.moveTo(-80, 180); g.lineTo(260, 120); g.lineTo(1100, 1100); g.lineTo(700, 1300); g.closePath(); g.fill();
      for (let i = 0; i < 34; i++) {
        const x = ((rnd(i * 3.7) * 1200 + u * (14 + rnd(i) * 22)) % 1200) - 60, y = 200 + rnd(i * 5.1) * 1000 + Math.sin(u * 0.9 + i) * 18 - u * 9;
        const inB = cl(1 - Math.abs((y - 120) - (x + 80) * 1.15) / 420); if (inB <= 0) continue;
        const r = 1.5 + rnd(i * 2.3) * 3.5, a = inB * (0.25 + 0.45 * (0.5 + 0.5 * Math.sin(u * 3 + i * 1.7)));
        const q = g.createRadialGradient(x, y, 0, x, y, r * 2.2); q.addColorStop(0, `rgba(255,226,180,${a})`); q.addColorStop(1, "rgba(255,226,180,0)"); g.fillStyle = q; g.fillRect(x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4);
      }
      g.restore();
      // Licht und Tiefe: warmes Seitenlicht, Unschärfe-Schleier oben und unten, Vignette
      let gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, "rgba(255,170,90,0.10)"); gr.addColorStop(0.55, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,0.38)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      gr = g.createLinearGradient(0, 0, 0, 560); gr.addColorStop(0, "rgba(12,8,4,0.62)"); gr.addColorStop(1, "rgba(12,8,4,0)"); g.fillStyle = gr; g.fillRect(0, 0, W, 560);
      gr = g.createLinearGradient(0, 1240, 0, 1920); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(0.3, "rgba(0,0,0,0.5)"); gr.addColorStop(1, "rgba(0,0,0,0.85)"); g.fillStyle = gr; g.fillRect(0, 1240, W, 680);
      const vg = g.createRadialGradient(540, 860, 420, 540, 900, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.55)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    },
    ev(d, p) {
      const P = plan(d, p); const E = [];
      for (const s of P.strikes) E.push(s.ch === " " ? [s.t, "tw_space", 0.75, 0] : [s.t, "tw_key" + s.v, s.i === 0 && s.L === 0 ? 1.0 : 0.82 + 0.1 * rnd(s.i * 2.2), 0]);
      for (const R of P.rets) { if (R.ding != null) E.push([R.ding, "tw_ding", 0.9, -0.15]); E.push([R.t, "tw_return", 0.95, 0.1]); }
      return E;
    },
  };
})();
