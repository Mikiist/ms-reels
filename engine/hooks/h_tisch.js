// VOICE_DELAY: 0.4
// h_tisch: Erklärvideo Bestellsystem nach Mihajlos Vorbild (isometrisches Restaurant am Abend, Deutsch).
// Kellner kann nicht überall sein → Gäste an Tisch 5 → QR- und NFC-Karte (Mihajlos schwarze Tischkarten) → Speisekarte am Handy
// ohne App → Bestellung → Küchen-iPad zeigt Tisch 5 → Live-Status am Handy → Punkte in der Wallet → Karten im eigenen Design.
// Nur Funktionen, die das Bestellsystem wirklich hat (FAKTEN.md, gehirn projekte/gastro-paket.md).
(() => {
  const S0 = 56, CY = 980, INK = "#141a2e", BLUE = "#3d6bff", GOLD = "#ffcf6b", GREEN = "#2bc275", PINK = "#ff5c8a";
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  const P = (x, y, z = 0) => [(x - y) * 0.866 * S0, (x + y) * 0.5 * S0 - z * S0];
  const TABLES = [[2.4, 3.4], [5.6, 3.4], [8.8, 3.4], [2.4, 6.6], [5.6, 6.6], [8.8, 6.6]]; // Tisch 1 bis 6, Tisch 5 = Index 4
  const T5 = TABLES[4];
  const COLS = ["#5b8def", "#ff8a65", "#7bc67e", "#b388ff", "#ffd54f", "#4dd0e1", "#f06292", "#90a4ae", "#ffb74d", "#81c784"];
  function poly(g, pts, c, stroke, lw = 1.2) { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fillStyle = c; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
  function box(g, S, x, y, w, d, h, c) { poly(g, [S(x + w, y, 0), S(x + w, y + d, 0), S(x + w, y + d, h), S(x + w, y, h)], c[2]); poly(g, [S(x, y + d, 0), S(x + w, y + d, 0), S(x + w, y + d, h), S(x, y + d, h)], c[1]); poly(g, [S(x, y, h), S(x + w, y, h), S(x + w, y + d, h), S(x, y + d, h)], c[0]); }
  const lp = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

  // ---------- Welt ----------
  function room(g, S, u, z) {
    // Boden Holz
    poly(g, [S(0, 0), S(12, 0), S(12, 9.5), S(0, 9.5)], "#7a4b2a");
    for (let i = 0; i <= 24; i++) { const a = S(0, i * 0.4), b = S(12, i * 0.4); g.strokeStyle = i % 2 ? "rgba(0,0,0,0.12)" : "rgba(255,210,150,0.06)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    // Rückwand Ziegel (y = 0) und linke Wand blau (x = 0)
    const hW = 3.0; poly(g, [S(0, 0, 0), S(12, 0, 0), S(12, 0, hW), S(0, 0, hW)], "#8e3b2b");
    for (let r = 0; r < 12; r++) for (let c = 0; c < 24; c++) { const off = r % 2 ? 0.25 : 0; const x0 = c * 0.5 + off, z0 = r * 0.25; if (x0 + 0.46 > 12) continue; poly(g, [S(x0, 0, z0 + 0.03), S(x0 + 0.46, 0, z0 + 0.03), S(x0 + 0.46, 0, z0 + 0.22), S(x0, 0, z0 + 0.22)], (r * 7 + c * 3) % 5 ? "#a2462f" : "#b5553a"); }
    poly(g, [S(0, 0, 0), S(0, 9.5, 0), S(0, 9.5, hW), S(0, 0, hW)], "#1d2a63");
    for (let i = 1; i < 6; i++) poly(g, [S(0, i * 1.6, 0), S(0, i * 1.6 + 0.04, 0), S(0, i * 1.6 + 0.04, hW), S(0, i * 1.6, hW)], "rgba(255,255,255,0.06)");
    // Leuchtschrift an der blauen Wand
    const nl = 0.85 + 0.15 * Math.sin(u * 7) * (Math.sin(u * 1.3) > 0.9 ? 1 : 0.2); const a = S(0, 2.2, 2.0), b = S(0, 6.6, 2.0); g.save(); g.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2); g.transform(1, 0.577, 0, 1, 0, 0); g.shadowColor = `rgba(110,160,255,${nl})`; g.shadowBlur = 30 * z; txt(g, "RESTAURANT", 0, 0, { w: 900, px: 30 * z, c: `rgba(200,220,255,${nl})`, fam: "K" }); g.restore();
    // Fenster in der Ziegelwand
    for (let i = 0; i < 2; i++) { const x0 = 1.0 + i * 2.6; poly(g, [S(x0, 0, 1.0), S(x0 + 1.6, 0, 1.0), S(x0 + 1.6, 0, 2.3), S(x0, 0, 2.3)], "#1a2346"); poly(g, [S(x0 + 0.1, 0, 1.1), S(x0 + 1.5, 0, 1.1), S(x0 + 1.5, 0, 2.2), S(x0 + 0.1, 0, 2.2)], "#26346a"); }
    // Theke mit Küchendurchreiche hinten rechts
    box(g, S, 6.4, 0.25, 5.3, 1.1, 1.05, ["#2b2f3d", "#1f2330", "#171a24"]); box(g, S, 6.4, 0.25, 5.3, 1.1, 0.08 + 1.05, ["#d9c4a0", "#b9a27c", "#a08a66"]);
    poly(g, [S(6.6, 0, 1.4), S(11.4, 0, 1.4), S(11.4, 0, 2.6), S(6.6, 0, 2.6)], "#f4efe6"); poly(g, [S(6.8, 0, 1.55), S(11.2, 0, 1.55), S(11.2, 0, 2.45), S(6.8, 0, 2.45)], "#ffb347");
    // Pfannen-Silhouetten in der Küche
    for (let i = 0; i < 3; i++) { const [px, py] = S(7.6 + i * 1.4, 0, 1.9 + 0.05 * Math.sin(u * 3 + i)); circle(g, px, py, 10 * z, "rgba(60,30,10,0.55)"); }
    // iPad auf der Theke
    const ia = S(9.0, 0.7, 1.14), ib = S(9.9, 0.7, 1.14), ic = S(9.9, 0.7, 1.75), id = S(9.0, 0.7, 1.75); poly(g, [ia, ib, ic, id], "#0b0d14"); const gl = 0.6 + 0.4 * Math.sin(u * 4); poly(g, [lp(ia, ic, 0.1), lp(ib, id, 0.1), lp(ic, ia, 0.1), lp(id, ib, 0.1)], `rgba(120,170,255,${0.6 * gl + 0.3})`);
  }
  function lamp(g, S, x, y, z, k) { const [lx, ly] = S(x, y, 2.6); const r = 150 * z * k; const gr = g.createRadialGradient(lx, ly + 40 * z, 0, lx, ly + 40 * z, r); gr.addColorStop(0, "rgba(255,200,120,0.35)"); gr.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = gr; g.beginPath(); g.arc(lx, ly + 40 * z, r, 0, 7); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(lx, ly - 160 * z); g.lineTo(lx, ly); g.stroke(); g.fillStyle = "#2a2a30"; g.beginPath(); g.moveTo(lx - 12 * z, ly); g.lineTo(lx + 12 * z, ly); g.lineTo(lx + 20 * z, ly + 14 * z); g.lineTo(lx - 20 * z, ly + 14 * z); g.closePath(); g.fill(); circle(g, lx, ly + 15 * z, 6 * z, "#ffe2a8"); }
  function booth(g, S, x, y) { box(g, S, x - 0.3, y - 0.45, 0.42, 0.9, 0.45, ["#3456d6", "#2a47b5", "#223b96"]); box(g, S, x - 0.42, y - 0.45, 0.14, 0.9, 0.95, ["#3d63ef", "#3456d6", "#2a47b5"]); }
  function tableW(g, S, x, y, z, hi, u, cardK = 0, ring = 0) {
    box(g, S, x - 0.05, y - 0.05, 0.1, 0.1, 0.7, ["#2a1d14", "#2a1d14", "#1f150e"]);
    box(g, S, x - 0.55, y - 0.5, 1.1, 1.0, 0.06 + 0.7, ["#b4794a", "#8d5a33", "#7a4b2a"]);
    if (cardK > 0 && !hi) { const q = S(x + 0.25, y - 0.15, 0.78); g.save(); g.translate(q[0], q[1]); const e = outBack(cl(cardK), 2.6) * 1.6; g.scale(z * e, z * e); shadow(g, 16, 0, "rgba(255,207,107,0.9)"); fillRR(g, -9, -24, 18, 26, 3, "#111"); noShadow(g); g.strokeStyle = "rgba(255,207,107,0.9)"; g.lineWidth = 1.2; g.beginPath(); g.arc(0, -15, 5, 0, 7); g.stroke(); g.restore();
      if (ring > 0) for (let i = 0; i < 2; i++) { const r = (u * 1.3 + i / 2) % 1; g.strokeStyle = `rgba(255,207,107,${(1 - r) * ring})`; g.lineWidth = 2.5; g.beginPath(); g.ellipse(q[0], q[1] - 16 * z, 40 * z * (0.4 + r), 20 * z * (0.4 + r), 0, 0, 7); g.stroke(); } }
    if (hi) { const q = S(x + 0.25, y - 0.15, 0.78); g.save(); g.translate(q[0], q[1]); g.scale(z, z); fillRR(g, -9, -24, 18, 26, 3, "#111"); g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 1.2; g.beginPath(); g.arc(0, -15, 5, 0, 7); g.stroke(); g.restore();
      for (let i = 0; i < 3; i++) { const r = (u * 1.1 + i / 3) % 1; g.strokeStyle = `rgba(255,207,107,${(1 - r) * 0.9})`; g.lineWidth = 2.5; g.beginPath(); g.ellipse(q[0], q[1] - 10 * z, 26 * z * (0.4 + r), 13 * z * (0.4 + r), 0, 0, 7); g.stroke(); } }
  }
  function person(g, S, x, y, z, col, seated, k, o = {}) {
    if (k <= 0) return; const [px, py] = S(x, y, seated ? 0.45 : 0); const s = z * Math.min(1, k);
    g.save(); g.globalAlpha = cl(k); g.translate(px, py + (o.bob || 0)); g.scale(s, s);
    g.fillStyle = "rgba(0,0,0,0.25)"; g.beginPath(); g.ellipse(0, seated ? 22 : 2, 14, 6, 0, 0, 7); g.fill();
    if (!seated) { const sw = Math.sin(o.walk || 0) * (o.moving ? 6 : 0); fillRR(g, -8 + sw * 0.3, -18, 7, 20, 3, "#1c2033"); fillRR(g, 1 - sw * 0.3, -18, 7, 20, 3, "#1c2033"); }
    const hBody = seated ? 26 : 30; fillRR(g, -10, -hBody - (seated ? 0 : 16), 20, hBody + 2, 9, col);
    const hy = -hBody - (seated ? 0 : 16) - 10; circle(g, 0, hy, 9, "#f2c7a5"); g.fillStyle = o.hair || "#3e2c22"; g.beginPath(); g.arc(0, hy - 2, 9.5, Math.PI, 0); g.fill();
    if (o.tray) { fillRR(g, 8, hy + 8, 22, 4, 2, "#c9ced8"); circle(g, 19, hy + 4, 6, "#ffb347"); }
    if (o.hand) { g.strokeStyle = "#f2c7a5"; g.lineWidth = 4; g.lineCap = "round"; g.beginPath(); g.moveTo(6, hy + 14); g.lineTo(14, hy - 10 - 3 * Math.sin(o.hand)); g.stroke(); }
    g.restore();
  }
  function bubbleW(g, x, y, s, z) { g.save(); g.translate(x, y); g.scale(z, z); shadow(g, 10, 3, "rgba(0,0,0,0.3)"); fillRR(g, -26, -24, 52, 40, 16, "#ffffff"); noShadow(g); g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(-5, 15); g.lineTo(5, 15); g.lineTo(-1, 24); g.closePath(); g.fill(); txt(g, s, 0, -4, { w: 900, px: 24, c: INK }); g.restore(); }

  // ---------- Bildschirm-Elemente ----------
  function veil(g, k) { if (k > 0) { g.fillStyle = `rgba(6,8,18,${0.55 * k})`; g.fillRect(0, 0, W, H); } }
  function phoneFrame(g, x, y, w, h, k, fn) { g.save(); g.translate(0, (1 - out3(cl(k))) * 900); g.globalAlpha = cl(k * 1.5); shadow(g, 60, 24, "rgba(0,0,0,0.55)"); fillRR(g, x, y, w, h, 70, "#0b0d14"); noShadow(g); fillRR(g, x + 14, y + 14, w - 28, h - 28, 58, "#f6f7fb");
    g.save(); rr(g, x + 14, y + 14, w - 28, h - 28, 58); g.clip(); fn(x + 14, y + 14, w - 28, h - 28); g.restore(); fillRR(g, x + w / 2 - 60, y + 30, 120, 30, 15, "#0b0d14"); g.restore(); }
  function finger(g, x, y, press) { g.save(); g.translate(x, y + press * 8); g.rotate(-0.35); g.fillStyle = "#f2c7a5"; g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 3; rr(g, -20, -6, 40, 100, 20); g.fill(); g.stroke(); fillRR(g, -46, 60, 92, 120, 40, BLUE); g.restore(); }
  function tapRing(g, x, y, t) { if (t < 0 || t > 0.45) return; const k = t / 0.45; g.strokeStyle = `rgba(61,107,255,${1 - k})`; g.lineWidth = 6; g.beginPath(); g.arc(x, y, 24 + k * 50, 0, 7); g.stroke(); }
  function cutlery(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = c; g.fillStyle = c; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 70, 0, 7); g.stroke();
    rr(g, -38, -40, 12, 80, 6); g.fill(); g.beginPath(); g.moveTo(-38, -40); g.quadraticCurveTo(-24, -20, -26, 0); g.lineTo(-38, 0); g.fill();
    for (let i = 0; i < 4; i++) g.fillRect(-9 + i * 5, -42, 3, 22); rr(g, -8, -22, 16, 64, 6); g.fill(); g.beginPath(); g.ellipse(30, -22, 11, 18, 0, 0, 7); g.fill(); rr(g, 26, -8, 8, 50, 4); g.fill(); g.restore(); }
  function nfcIcon(g, x, y, s, c, u) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = c; g.lineWidth = 4; g.lineCap = "round"; rr(g, -40, -55, 50, 90, 10); g.stroke(); txt(g, "NFC", -15, -10, { w: 900, px: 16, c, fam: "I" }); for (let i = 0; i < 3; i++) { g.globalAlpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin((u || 0) * 6 - i)); g.beginPath(); g.arc(30, -10, 10 + i * 10, -0.9, 0.9); g.stroke(); } g.restore(); }
  function qrCode(g, x, y, s, seed = 3) { g.fillStyle = "#ffffff"; g.fillRect(x - s / 2, y - s / 2, s, s); const n = 21, c = (s - 12) / n; g.fillStyle = "#111"; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const fin = (i < 7 && j < 7) || (i > 13 && j < 7) || (i < 7 && j > 13); let on; if (fin) { const a = i > 13 ? i - 14 : i, b = j > 13 ? j - 14 : j; on = a === 0 || a === 6 || b === 0 || b === 6 || (a > 1 && a < 5 && b > 1 && b < 5); } else on = rnd(seed * 31 + i * 7.3 + j * 3.1) > 0.52; if (on) g.fillRect(x - s / 2 + 6 + i * c, y - s / 2 + 6 + j * c, c + 0.5, c + 0.5); } }
  // Mihajlos Tischkarte (schwarz, Besteck im Kreis, MENÜ, QR oder NFC)
  function menuCard(g, x, y, w, side, o = {}) {
    const h = w * 1.55; g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(o.sx != null ? o.sx : 1, 1); shadow(g, 50, 20, "rgba(0,0,0,0.55)");
    const bg = o.bg || "#17171b", fg = o.fg || "#f2eef8"; fillRR(g, -w / 2, -h / 2, w, h, w * 0.06, bg); noShadow(g);
    if (o.gloss) { const gr = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); gr.addColorStop(0, "rgba(255,255,255,0.10)"); gr.addColorStop(0.5, "rgba(255,255,255,0)"); gr.addColorStop(1, "rgba(255,255,255,0.05)"); g.fillStyle = gr; rr(g, -w / 2, -h / 2, w, h, w * 0.06); g.fill(); }
    if (o.brand) txt(g, o.brand, 0, -h * 0.4, { w: 800, px: w * 0.07, c: o.acc || fg, fam: "I", ls: 3 });
    cutlery(g, 0, -h * 0.22, w / 340, fg);
    txt(g, side === "nfc" ? "Handy dranhalten für das" : "Scannen für das", 0, h * 0.02, { w: 600, px: w * 0.065, c: fg, fam: "I" });
    txt(g, "MENÜ", 0, h * 0.13, { w: 900, px: w * 0.2, c: o.acc || fg, fam: "D" });
    if (side === "nfc") nfcIcon(g, 0, h * 0.34, w / 300, fg, o.u); else qrCode(g, 0, h * 0.33, w * 0.36, o.seed || 3);
    g.restore();
  }
  function chip(g, x, y, s, k, col = GREEN) { if (k <= 0) return; font(g, 800, 30, "I"); const w = g.measureText(s).width + 60; g.save(); g.translate(x, y); const e = outBack(cl(k), 2.6); g.scale(e, e); shadow(g, 20, 8, "rgba(0,0,0,0.3)"); fillRR(g, -w / 2, -32, w, 64, 32, col); noShadow(g); txt(g, s, 0, 2, { w: 800, px: 30, fam: "I", c: "#fff" }); g.restore(); }

  // ---------- Handy wie im Vorbild: Restaurant-Startseite, Speisekarte mit Bildern, Finger tippt und scrollt ----------
  const PX = 270, PY = 410, PW = 540, PH = 1080, IX = PX + 14, IY = PY + 14, IW = PW - 28, IH = PH - 28;
  const MONO = "M";
  const ITEMS = [["PIZZA MARGHERITA", "Tomate, Fior di Latte,", "frisches Basilikum", "9,50 €", "pizza", "#ffe3cf"], ["SPAGHETTI CARBONARA", "Guanciale, Pecorino,", "Eigelb, Pfeffer", "11,90 €", "pasta", "#fff2c7"],
    ["POMMES", "Knusprig, Meersalz,", "Aioli dazu", "4,50 €", "fries", "#e6efff"], ["COLA", "0,33 l, eiskalt", "mit Zitrone", "3,20 €", "cola", "#ffe0e0"], ["TIRAMISU", "Hausgemacht, Mascarpone,", "Espresso", "5,90 €", "tira", "#f1e6ff"]];
  function food(g, kind, cx, cy, s) { g.save(); g.translate(cx, cy); g.scale(s, s);
    if (kind === "pizza") { circle(g, 0, 0, 40, "#e9a84c"); circle(g, 0, 0, 33, "#d9472f"); [[-14, -10], [12, -14], [4, 10], [-12, 14], [18, 8]].forEach(([a, b]) => circle(g, a, b, 8, "#fff6e0")); [[-4, -18], [16, 0], [-18, 2]].forEach(([a, b]) => circle(g, a, b, 4, "#3e9b4f")); }
    else if (kind === "pasta") { g.fillStyle = "#ffffff"; g.beginPath(); g.ellipse(0, 6, 42, 26, 0, 0, Math.PI); g.fill(); g.fillStyle = "#e8eef8"; g.beginPath(); g.ellipse(0, 6, 42, 10, 0, 0, 7); g.fill(); g.strokeStyle = "#f2c94c"; g.lineWidth = 5; g.lineCap = "round"; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(-18 + i * 7, 0, 10, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } circle(g, 8, -6, 4, "#b5452d"); circle(g, -10, -4, 3, "#b5452d"); }
    else if (kind === "fries") { g.fillStyle = "#ffcf3f"; for (let i = 0; i < 7; i++) { g.save(); g.translate(-18 + i * 6, -18); g.rotate(-0.25 + i * 0.08); g.fillRect(-3, -22, 6, 34); g.restore(); } g.fillStyle = "#e5483b"; g.beginPath(); g.moveTo(-26, -10); g.lineTo(26, -10); g.lineTo(20, 34); g.lineTo(-20, 34); g.closePath(); g.fill(); txt(g, "LUNA", 0, 12, { w: 900, px: 12, c: "#fff", fam: "I" }); }
    else if (kind === "cola") { g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.moveTo(-20, -30); g.lineTo(20, -30); g.lineTo(16, 34); g.lineTo(-16, 34); g.closePath(); g.fill(); g.fillStyle = "#5a2b17"; g.beginPath(); g.moveTo(-19, -18); g.lineTo(19, -18); g.lineTo(16, 32); g.lineTo(-16, 32); g.closePath(); g.fill(); fillRR(g, -10, -12, 10, 10, 2, "rgba(255,255,255,0.6)"); fillRR(g, 4, -6, 9, 9, 2, "rgba(255,255,255,0.5)"); g.strokeStyle = "#e5483b"; g.lineWidth = 4; g.beginPath(); g.moveTo(6, -18); g.lineTo(14, -44); g.stroke(); circle(g, -14, -28, 8, "#f4e04d"); }
    else { fillRR(g, -34, -18, 68, 46, 6, "#f4e2c4"); g.fillStyle = "#6b3e26"; g.fillRect(-34, -4, 68, 8); g.fillRect(-34, 12, 68, 6); g.fillStyle = "#7a4a2e"; g.fillRect(-34, -22, 68, 6); }
    g.restore(); }
  function statusBar(g, x, y, w) { txt(g, "20:47", x + 60, y + 34, { w: 700, px: 24, c: INK, fam: "I" }); txt(g, "5G", x + w - 110, y + 34, { w: 700, px: 20, c: INK, fam: "I" }); fillRR(g, x + w - 82, y + 24, 44, 20, 6, INK); }
  function urlBar(g, x, y, w, url) { fillRR(g, x + 20, y + 64, w - 40, 56, 28, "#ffffff"); shadow(g, 0, 0, "transparent"); g.strokeStyle = "#e3e6ef"; g.lineWidth = 2; rr(g, x + 20, y + 64, w - 40, 56, 28); g.stroke();
    fillRR(g, x + 46, y + 88, 16, 14, 3, INK); g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.arc(x + 54, y + 88, 6, Math.PI, 0); g.stroke(); txt(g, url, x + 72, y + 92, { w: 600, px: 22, c: INK, al: "left", fam: "I" }); }
  function chev(g, x, y) { g.strokeStyle = "#9aa0b4"; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 5, y - 9); g.lineTo(x + 4, y); g.lineTo(x - 5, y + 9); g.stroke(); }
  function homePage(g, x, y, w, h, u, M) {
    const hx = x + 22, hy = y + 140, hw = w - 44, hh = 330; const hg = g.createLinearGradient(hx, hy, hx + hw, hy + hh); hg.addColorStop(0, "#1b2a5e"); hg.addColorStop(1, "#0e1532"); fillRR(g, hx, hy, hw, hh, 26, "#0e1532"); g.fillStyle = hg; rr(g, hx, hy, hw, hh, 26); g.fill();
    g.save(); rr(g, hx, hy, hw, hh, 26); g.clip(); g.strokeStyle = "rgba(255,255,255,0.07)"; g.lineWidth = 1.5; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(hx + i * 44, hy); g.lineTo(hx + i * 44, hy + hh); g.stroke(); g.beginPath(); g.moveTo(hx, hy + i * 44); g.lineTo(hx + hw, hy + i * 44); g.stroke(); }
    const gl = g.createRadialGradient(hx + hw - 120, hy + 110, 10, hx + hw - 120, hy + 110, 170); gl.addColorStop(0, "rgba(255,190,90,0.45)"); gl.addColorStop(1, "rgba(255,190,90,0)"); g.fillStyle = gl; g.fillRect(hx, hy, hw, hh); g.restore();
    food(g, "pizza", hx + hw - 120, hy + 112 + 4 * Math.sin(u * 2), 2.0);
    circle(g, hx + 62, hy + 228, 40, "#ffffff"); txt(g, "L", hx + 62, hy + 230, { w: 900, px: 40, c: BLUE, fam: "A" }); txt(g, "Pizzeria Luna", hx + 120, hy + 222, { w: 400, px: 50, c: "#ffffff", al: "left", fam: "A" });
    g.save(); g.font = "italic 600 22px I"; g.fillStyle = "#9db4ff"; g.textBaseline = "middle"; g.fillText("Scannen. Essen. Wiederkommen.", hx + 122, hy + 266); g.restore();
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 2; rr(g, hx + 30, hy + 288, 130, 32, 16); g.fillStyle = "rgba(255,255,255,0.1)"; g.fill(); g.stroke(); txt(g, "TISCH 5", hx + 95, hy + 305, { w: 700, px: 17, c: "#fff", fam: MONO, ls: 2 });
    const rows = [["Speisekarte", "BESTELLEN AN IHREN TISCH", "#e7eeff", "menu"], ["Bewertung abgeben", "SAGEN SIE UNS, WIE ES WAR", "#fff4d6", "star"], ["Bonuskarte", "PUNKTE BEI JEDEM BESUCH", "#e2f7ea", "gift"], ["Spiele", "FÜR DIE WARTEZEIT", "#efe7ff", "game"]];
    rows.forEach(([t, s, c, ic], i) => { const ry = y + 500 + i * 104; const pressed = i === 0 && Math.abs(u - M.tapMenu) < 0.12; fillRR(g, x + 22, ry, w - 44, 90, 20, pressed ? "#eef2ff" : "#ffffff"); g.strokeStyle = "#e8eaf2"; g.lineWidth = 2; rr(g, x + 22, ry, w - 44, 90, 20); g.stroke();
      fillRR(g, x + 40, ry + 15, 60, 60, 16, c); const ix = x + 70, iy = ry + 45;
      if (ic === "menu") { g.strokeStyle = BLUE; g.lineWidth = 3; rr(g, ix - 13, iy - 17, 26, 34, 5); g.stroke(); for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(ix - 7, iy - 7 + k * 7); g.lineTo(ix + 7, iy - 7 + k * 7); g.stroke(); } }
      else if (ic === "star") { g.strokeStyle = "#e0a400"; g.lineWidth = 3; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 7 : 17; g.lineTo(ix + Math.cos(a) * r, iy + Math.sin(a) * r); } g.closePath(); g.stroke(); }
      else if (ic === "gift") { g.strokeStyle = GREEN; g.lineWidth = 3; g.strokeRect(ix - 14, iy - 6, 28, 22); g.strokeRect(ix - 16, iy - 12, 32, 7); g.beginPath(); g.moveTo(ix, iy - 12); g.lineTo(ix, iy + 16); g.stroke(); }
      else { g.strokeStyle = "#7b5cff"; g.lineWidth = 3; rr(g, ix - 18, iy - 10, 36, 22, 10); g.stroke(); g.beginPath(); g.moveTo(ix - 10, iy + 1); g.lineTo(ix - 4, iy + 1); g.moveTo(ix - 7, iy - 2); g.lineTo(ix - 7, iy + 4); g.stroke(); circle(g, ix + 8, iy - 1, 2.5, "#7b5cff"); circle(g, ix + 12, iy + 3, 2.5, "#7b5cff"); }
      txt(g, t, x + 120, ry + 36, { w: 700, px: 26, c: INK, al: "left", fam: "I" }); txt(g, s, x + 120, ry + 64, { w: 700, px: 14, c: "#8a90a6", al: "left", fam: MONO, ls: 1 }); chev(g, x + w - 52, ry + 45); });
    txt(g, "PIZZERIA LUNA · POWERED BY MIHAJLO SYSTEMS", x + w / 2, y + h - 34, { w: 700, px: 12, c: "#a0a6b8", fam: MONO, ls: 1 });
  }
  function menuPage(g, x, y, w, h, u, M) {
    g.save(); rr(g, x, y + 128, w, h - 128, 0); g.clip(); const t0 = y + 130 - M.off;
    txt(g, "Tisch 5", x + w / 2, t0 + 80, { w: 400, px: 66, c: INK, fam: "A" }); g.strokeStyle = INK; g.lineWidth = 2.5; rr(g, x + w / 2 - 110, t0 + 132, 220, 38, 19); g.stroke(); txt(g, "BESTELLUNG OFFEN", x + w / 2, t0 + 152, { w: 700, px: 15, c: INK, fam: MONO, ls: 2 });
    txt(g, "Wählen Sie aus der Karte, es geht", x + w / 2, t0 + 210, { w: 500, px: 21, c: "#7a8098", fam: "I" }); txt(g, "direkt in die Küche.", x + w / 2, t0 + 238, { w: 500, px: 21, c: "#7a8098", fam: "I" });
    fillRR(g, x + 22, t0 + 280, w - 44, 72, 16, "#eceef5"); txt(g, "Ihre Bestellung", x + 46, t0 + 317, { w: 700, px: 24, c: INK, al: "left", fam: "I" }); const pop = 1 + 0.15 * Math.max(...[M.tapP, M.tapC1, M.tapC2].map((t) => (u > t && u < t + 0.3 ? 1 - (u - t) / 0.3 : 0)));
    g.save(); g.translate(x + w - 46, t0 + 317); g.scale(pop, pop); txt(g, M.total.toFixed(2).replace(".", ",") + " €", 0, 0, { w: 700, px: 24, c: M.total > 0 ? BLUE : INK, al: "right", fam: MONO }); g.restore();
    txt(g, "Beliebt", x + 30, t0 + 420, { w: 400, px: 46, c: INK, al: "left", fam: "A" });
    ITEMS.forEach(([n, d1, d2, pr, kind, bgc], r) => { const ry = t0 + 470 + r * 165; g.fillStyle = "#e6e8f0"; g.fillRect(x + 22, ry - 8, w - 44, 2); fillRR(g, x + 24, ry + 10, 104, 104, 18, bgc); food(g, kind, x + 76, ry + 62, 1.0);
      txt(g, n, x + 146, ry + 28, { w: 700, px: 20, c: INK, al: "left", fam: MONO }); txt(g, pr, x + w - 28, ry + 28, { w: 700, px: 20, c: INK, al: "right", fam: MONO }); txt(g, d1, x + 146, ry + 58, { w: 400, px: 17, c: "#8a90a6", al: "left", fam: "I" }); txt(g, d2, x + 146, ry + 80, { w: 400, px: 17, c: "#8a90a6", al: "left", fam: "I" });
      const cnt = r === 0 ? M.pizza : r === 3 ? M.cola : 0; fillRR(g, x + 146, ry + 100, 168, 44, 10, BLUE); txt(g, cnt ? `${cnt} IM KORB` : "HINZUFÜGEN +", x + 230, ry + 123, { w: 700, px: 15, c: "#fff", fam: MONO, ls: 1 });
      g.strokeStyle = INK; g.lineWidth = 2.5; rr(g, x + 326, ry + 100, 126, 44, 10); g.stroke(); txt(g, "DETAILS", x + 389, ry + 123, { w: 700, px: 15, c: INK, fam: MONO, ls: 1 }); });
    g.restore();
    if (M.n > 0) { const bk = outBack(seg(u, M.tapP, M.tapP + 0.3), 2); g.save(); g.translate(x + w / 2, y + h - 70); g.scale(bk, bk); const sb = outBack(seg(u, M.tapS, M.tapS + 0.3), 2.5); fillRR(g, -(w - 48) / 2, -42, w - 48, 84, 42, M.sent ? GREEN : INK);
      txt(g, M.sent ? "In der Küche ✓" : `Bestellung senden · ${M.total.toFixed(2).replace(".", ",")} €`, 0, 2, { w: 800, px: M.sent ? 30 * lerp(1.2, 1, sb) : 24, c: "#fff", fam: "I" }); g.restore(); }
  }
  function statusPage(g, x, y, w, h, u, T) {
    txt(g, "Ihre Bestellung", x + 40, y + 190, { w: 400, px: 52, c: INK, al: "left", fam: "A" }); txt(g, "TISCH 5 · #1042", x + 42, y + 240, { w: 700, px: 18, c: "#7a8098", al: "left", fam: MONO, ls: 2 });
    const st = [["Eingegangen", T.live - 0.2], ["In Zubereitung", T.live + 0.3], ["Kommt gleich", T.essen]]; st.forEach(([s, t], i) => { const on = u >= t, yy = y + 330 + i * 130; circle(g, x + 80, yy, 28, on ? GREEN : "#dfe2ec"); if (on) txt(g, "✓", x + 80, yy + 2, { w: 900, px: 26, c: "#fff" }); if (i < 2) fillRR(g, x + 76, yy + 30, 8, 70, 4, u >= st[i + 1][1] ? GREEN : "#dfe2ec"); txt(g, s, x + 130, yy, { w: on ? 800 : 500, px: 32, c: on ? INK : "#9aa0b4", al: "left", fam: "I" });
      if (on && i === (u >= T.essen ? 2 : u >= T.live + 0.3 ? 1 : 0)) { const pr = 0.5 + 0.5 * Math.sin(u * 6); g.strokeStyle = `rgba(43,194,117,${pr})`; g.lineWidth = 4; g.beginPath(); g.arc(x + 80, yy, 36 + pr * 6, 0, 7); g.stroke(); } });
    const big = outBack(seg(u, T.essen, T.essen + 0.3), 2.5); if (big > 0) { g.save(); g.translate(x + w / 2, y + 800); g.scale(big * 2.6, big * 2.6); food(g, "pizza", 0, 0, 1); g.restore(); }
  }
  function menuPlan(u, T) {
    const W0 = T.speise, Wn = Math.max(2.4, T.kueche - 0.4 - T.speise), at = (f) => W0 + f * Wn;
    const M = { tapMenu: T.speise - 0.3, s1: [at(0.12), at(0.32)], tapP: at(0.42), s2: [at(0.5), at(0.64)], tapC1: at(0.72), tapC2: at(0.8), tapS: at(0.92) };
    M.page = out3(seg(u, T.speise - 0.15, T.speise + 0.2)); M.off = 220 * inOut(seg(u, M.s1[0], M.s1[1])) + 300 * inOut(seg(u, M.s2[0], M.s2[1]));
    M.pizza = u >= M.tapP ? 1 : 0; M.cola = (u >= M.tapC1 ? 1 : 0) + (u >= M.tapC2 ? 1 : 0); M.n = M.pizza + M.cola; M.total = 9.5 * M.pizza + 3.2 * M.cola; M.sent = u >= M.tapS;
    // Finger: Wegpunkte [Zeit, x, y, drückt]
    const add = (r, off) => [IX + 230, IY + 130 - off + 470 + r * 165 + 122];
    const P0 = [960, 1560], row = [IX + 260, IY + 545], pz = add(0, 220), cl1 = add(3, 520), send = [IX + IW / 2, IY + IH - 70];
    M.path = [[T.app + 0.2, ...P0, 0], [M.tapMenu - 0.35, row[0] + 120, row[1] + 160, 0], [M.tapMenu, ...row, 1], [M.tapMenu + 0.25, row[0] + 60, row[1] + 120, 0],
      [M.s1[0] - 0.1, 640, 1250, 0], [M.s1[0], 640, 1250, 1], [M.s1[1], 640, 1030, 1], [M.s1[1] + 0.08, 660, 1050, 0], [M.tapP, ...pz, 1], [M.tapP + 0.15, pz[0] + 40, pz[1] + 60, 0],
      [M.s2[0] - 0.05, 640, 1300, 0], [M.s2[0], 640, 1300, 1], [M.s2[1], 640, 1000, 1], [M.s2[1] + 0.08, 660, 1030, 0], [M.tapC1, ...cl1, 1], [M.tapC1 + 0.1, cl1[0] + 20, cl1[1] + 30, 0], [M.tapC2, ...cl1, 1], [M.tapC2 + 0.12, cl1[0] + 40, cl1[1] + 60, 0],
      [M.tapS, ...send, 1], [M.tapS + 0.2, send[0] + 80, send[1] + 120, 0], [M.tapS + 0.7, 980, 1700, 0]];
    return M;
  }
  function fingerAt(M, u) { const P = M.path; if (u <= P[0][0]) return [P[0][1], P[0][2], 0]; for (let i = 1; i < P.length; i++) if (u <= P[i][0]) { const A = P[i - 1], B = P[i]; const k = (u - A[0]) / Math.max(0.01, B[0] - A[0]); const press = A[3] && B[3] ? 1 : B[3] ? cl((k - 0.7) / 0.3) : A[3] ? 1 - cl(k / 0.3) : 0; const e = A[3] && B[3] ? inOut(k) : out3(k); return [lerp(A[1], B[1], e), lerp(A[2], B[2], e), press]; } const L = P[P.length - 1]; return [L[1], L[2], 0]; }
  function hand(g, x, y, press) { // Comic-Hand mit blauem Ärmel, Fingerspitze bei (x, y)
    g.save(); g.translate(x, y); g.rotate(-0.32); const s = 1 - 0.06 * press; g.scale(s, s); const SK = "#f3c9a4", SKD = "#d9a07a";
    g.fillStyle = "rgba(0,0,0,0.18)"; g.beginPath(); g.ellipse(20, 30, 70, 30, 0, 0, 7); g.fill();
    g.fillStyle = "#2f5be8"; g.beginPath(); g.moveTo(-40, 210); g.lineTo(90, 190); g.lineTo(140, 420); g.lineTo(-10, 440); g.closePath(); g.fill(); g.fillStyle = "#2448c4"; g.beginPath(); g.moveTo(-40, 210); g.lineTo(90, 190); g.lineTo(96, 228); g.lineTo(-34, 248); g.closePath(); g.fill();
    g.fillStyle = SK; g.strokeStyle = SKD; g.lineWidth = 4; rr(g, -48, 70, 130, 150, 50); g.fill(); g.stroke();
    for (let i = 0; i < 3; i++) { rr(g, 6 + i * 26, 64, 30, 60, 15); g.fill(); g.stroke(); }
    rr(g, -24, -6, 44, 130, 22); g.fill(); g.stroke(); g.strokeStyle = SKD; g.lineWidth = 3; g.beginPath(); g.moveTo(-14, 52); g.lineTo(10, 52); g.stroke(); fillRR(g, -14, 4, 24, 20, 8, "rgba(255,255,255,0.5)");
    g.restore(); if (press > 0.5) { g.strokeStyle = `rgba(61,107,255,${(press - 0.5) * 1.4})`; g.lineWidth = 5; g.beginPath(); g.arc(x, y, 30, 0, 7); g.stroke(); } }

  TYPES.h_tisch = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 1.0, capY: 300,
    prep(o, p) {
      const W0 = (SPEC.words || []).filter((w) => w.scene === o.i); const f = (re, after = 0, def = null) => { const w = W0.find((x) => x.t - o.t0 >= after - 1e-6 && re.test(norm(x.w))); return w ? w.t - o.t0 : def; };
      const T = {}; T.web = f(/^website/, 0, 2.4); T.gaeste = f(/^gäste/, T.web, T.web + 1.2); T.fuenf = f(/^fünf/, T.gaeste, T.gaeste + 0.9); T.scan = f(/^scannen/, T.fuenf, T.fuenf + 0.6); T.qr = f(/^qr/, T.scan, T.scan + 0.5);
      T.handy = f(/^handy/, T.qr, T.qr + 0.9); T.karte = f(/^karte/, T.handy, T.handy + 0.5); T.app = f(/^app/, T.karte, T.karte + 0.8); T.konto = f(/^konto/, T.app, T.app + 0.6); T.speise = f(/^speisekarte/, T.konto, T.konto + 0.6);
      T.best = f(/^bestellen/, T.speise, T.speise + 1.4); T.kueche = f(/^küche/, T.best, T.best + 1.4); T.ipad = f(/^ipad/, T.kueche, T.kueche + 0.5); T.tisch = f(/^tisch/, T.ipad, T.ipad + 0.6); T.pizza = f(/^pizza/, T.tisch, T.tisch + 0.8); T.cola = f(/^cola/, T.pizza, T.pizza + 0.6);
      T.live = f(/^live/, T.cola, T.cola + 1.4); T.essen = f(/^essen/, T.live, T.live + 0.8); T.punkte = f(/^punkte/, T.essen, T.essen + 1.4); T.wallet = f(/^wallet/, T.punkte, T.punkte + 0.6); T.karten = f(/^karten/, T.wallet, T.wallet + 1.0); T.design = f(/^design/, T.karten, T.karten + 1.8);
      p._T = T;
    },
    draw(g, u, d, p) {
      const T = p._T;
      const key = (t, x, y, z) => ({ t, x, y, z });
      const KF = [key(0, 4.2, 5.0, 2.5), key(0.25, 4.6, 5.0, 2.4), key(1.7, 5.6, 5.0, 1.38), key(T.web, 5.6, 5.0, 1.4), key(T.gaeste - 0.2, 5.6, 5.0, 1.45), key(T.gaeste + 0.5, 5.6, 6.2, 2.0), key(T.kueche - 0.25, 5.6, 6.2, 2.0), key(T.kueche + 0.35, 9.4, 1.4, 2.3),
        key(T.live - 0.25, 9.4, 1.4, 2.3), key(T.live + 0.35, 5.6, 6.0, 1.9), key(T.karten - 0.3, 5.6, 6.0, 1.9), key(T.karten + 0.4, 6.2, 4.8, 1.05), key(d, 6.2, 4.8, 1.12)];
      let cx = KF[0].x, cy = KF[0].y, z = KF[0].z;
      for (let i = 1; i < KF.length; i++) { const A = KF[i - 1], B = KF[i]; if (u >= A.t) { const k = inOut(cl((u - A.t) / Math.max(0.05, B.t - A.t))); cx = lerp(A.x, B.x, k); cy = lerp(A.y, B.y, k); z = lerp(A.z, B.z, k); } }
      const dive = inExpo(cl((u - (d - 0.5)) / 0.5)); if (dive > 0) { z *= 1 + dive * 10; cx = lerp(cx, T5[0], dive); cy = lerp(cy, T5[1], dive); }
      const c0 = P(cx, cy, 0); const S = (x, y, h = 0) => { const q = P(x, y, h); return [540 + (q[0] - c0[0]) * z, CY + (q[1] - c0[1]) * z]; };

      const bg = g.createRadialGradient(540, 900, 100, 540, 900, 1300); bg.addColorStop(0, "#1a2244"); bg.addColorStop(1, "#05070f"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      room(g, S, u, z);
      // Tische hinten nach vorn
      const order = TABLES.map((t, i) => [t, i]).sort((a, b) => a[0][0] + a[0][1] - (b[0][0] + b[0][1]));
      const busy = 1 - seg(u, T.gaeste - 0.3, T.gaeste + 0.2);
      order.forEach(([[tx, ty], i]) => {
        booth(g, S, tx - 0.55, ty); tableW(g, S, tx, ty, z, i === 4 && u > T.scan - 0.3 && u < T.speise, u, seg(u, T.web - 0.1 + i * 0.08, T.web + 0.2 + i * 0.08), seg(u, T.web, T.web + 0.2) * (1 - seg(u, T.gaeste + 0.3, T.gaeste + 0.8)));
        if (i === 4) { // Tisch 5: zwei Gäste kommen und setzen sich
          const k = seg(u, T.gaeste - 0.1, T.fuenf + 0.4); if (k > 0) { if (k < 1) { person(g, S, lerp(tx - 1.2, tx - 0.85, k), lerp(9.3, ty - 0.2, k), z, COLS[0], false, 1, { walk: u * 10, moving: true }); person(g, S, lerp(tx + 1.6, tx + 0.85, k), lerp(9.5, ty + 0.2, k), z, COLS[1], false, 1, { walk: u * 10 + 1, moving: true, hair: "#a0522d" }); }
            else { person(g, S, tx - 0.85, ty - 0.2, z, COLS[0], true, 1); person(g, S, tx + 0.85, ty + 0.2, z, COLS[1], true, 1, { hair: "#a0522d" }); } }
          booth(g, S, tx + 0.95, ty);
          if (u > T.essen + 0.3) { const [px, py] = S(tx, ty, 0.78); circle(g, px, py, 14 * z, "#ffb347"); circle(g, px, py, 10 * z, "#e94f37"); }
        } else {
          person(g, S, tx - 0.85, ty - 0.2, z, COLS[(i * 3 + 2) % COLS.length], true, 1); person(g, S, tx + 0.85, ty + 0.2, z, COLS[(i * 5 + 4) % COLS.length], true, 1, { hand: busy > 0.5 && i % 2 === 0 ? u * 8 : 0 });
          booth(g, S, tx + 0.95, ty);
          if (busy > 0.05 && u > 0.5 + i * 0.18 && u < T.web + 0.2) { const [bx, by] = S(tx + 0.85, ty + 0.2, 1.75); g.save(); g.globalAlpha = busy; bubbleW(g, bx, by - 10 * z, i % 3 === 0 ? "✋" : i % 3 === 1 ? "?" : "…", Math.min(2.2, z * 1.5)); g.restore(); }
        }
      });
      // Kellner: am Anfang hektisch zwischen den Tischen, später bringt er die Pizza zu Tisch 5
      const route = [[4.0, 5.0], [7.2, 5.0], [7.2, 8.0], [4.0, 8.0], [1.0, 5.0], [4.0, 5.0]];
      if (u < T.live) { const L = route.length - 1, pos = (u * 0.9) % L, i0 = Math.floor(pos), k = pos - i0; const wx = lerp(route[i0][0], route[i0 + 1][0], k), wy = lerp(route[i0][1], route[i0 + 1][1], k); person(g, S, wx, wy, z, "#222838", false, 1, { walk: u * 14, moving: true, tray: true, hair: "#111" }); if (u < T.gaeste) { const [sx, sy] = S(wx, wy, 1.55); txt(g, "💦", sx + 22 * z, sy, { px: 18 * z }); } }
      else { const k = seg(u, T.live, T.essen + 0.3); person(g, S, lerp(9.0, T5[0] + 0.1, k), lerp(1.8, T5[1] - 0.8, k), z, "#222838", false, 1, { walk: u * 12, moving: k > 0 && k < 1, tray: k < 1, hair: "#111" }); }
      // Lampen über allem
      TABLES.forEach(([tx, ty], i) => lamp(g, S, tx, ty, z, i === 4 && u > T.gaeste ? 1.25 : 1));
      // Tisch-5-Schild
      const tk = outBack(seg(u, T.fuenf - 0.1, T.fuenf + 0.25), 2.2) * (1 - seg(u, T.scan - 0.3, T.scan)); if (tk > 0) { const [x, y] = S(T5[0], T5[1], 2.0); g.save(); g.translate(x, y); g.scale(tk, tk); shadow(g, 20, 6, "rgba(0,0,0,0.4)"); fillRR(g, -110, -36, 220, 72, 36, GOLD); noShadow(g); txt(g, "TISCH 5", 0, 2, { w: 900, px: 34, c: INK, fam: "K" }); g.restore(); }

      // ---------- Overlays ----------
      // 1) Tischkarte: QR scannen, dann umdrehen auf NFC, Handy tippt
      const ck = seg(u, T.scan - 0.25, T.scan + 0.15) * (1 - seg(u, T.app - 0.3, T.app - 0.05));
      if (ck > 0) { veil(g, ck); const flip = seg(u, T.handy - 0.25, T.handy + 0.05); const sx = Math.cos(flip * Math.PI); const side = flip < 0.5 ? "qr" : "nfc";
        g.save(); g.globalAlpha = cl(ck * 1.5); const fl = 0.02 * Math.sin(u * 2); menuCard(g, 540, 920 + (1 - out3(ck)) * 700, 400, side, { sx: Math.abs(sx) < 0.02 ? 0.02 : Math.abs(sx), rot: -0.05 + fl, u, gloss: true }); g.restore();
        // Handy kommt: erst Kamera-Rahmen über dem QR, dann tippt es an die Karte
        const pk = out3(seg(u, T.qr - 0.25, T.qr + 0.15)); if (pk > 0 && flip < 0.5) { const yy = lerp(1900, 1180, pk); g.save(); g.globalAlpha = cl(ck * 1.5); g.strokeStyle = "#ffffff"; g.lineWidth = 8; const fx = 540, fy = 920 + 400 * 1.55 * 0.33, s = 110 * (1.2 - 0.2 * pk); for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(fx + a * s, fy + b * (s - 34)); g.lineTo(fx + a * s, fy + b * s); g.lineTo(fx + a * (s - 34), fy + b * s); g.stroke(); }
          const sl = (u * 1.8) % 1; g.fillStyle = "rgba(61,107,255,0.8)"; g.fillRect(fx - s, fy - s + sl * 2 * s, 2 * s, 5); g.restore(); void yy; }
        const nk = out3(seg(u, T.karte - 0.35, T.karte)); if (nk > 0 && flip >= 0.5) { g.save(); g.globalAlpha = cl(ck * 1.5); const px = lerp(1150, 700, nk), py = lerp(1500, 1180, nk); g.translate(px, py); g.rotate(-0.3); shadow(g, 40, 16, "rgba(0,0,0,0.5)"); fillRR(g, -110, -210, 220, 420, 34, "#0b0d14"); noShadow(g); fillRR(g, -98, -198, 196, 396, 26, "#26346a"); g.restore();
          if (u > T.karte) for (let i = 0; i < 3; i++) { const r = ((u - T.karte) * 1.5 + i / 3) % 1; g.strokeStyle = `rgba(255,207,107,${(1 - r) * ck})`; g.lineWidth = 6; g.beginPath(); g.arc(560, 1250, 40 + r * 160, 0, 7); g.stroke(); } }
        chip(g, 540, 330 + 70, flip < 0.5 ? "QR-Code scannen" : "oder Handy dranhalten", seg(u, T.qr - 0.1, T.qr + 0.2), BLUE);
      }
      // 2) Handy wie im Vorbild: Startseite, Finger tippt Speisekarte, scrollt, legt in den Korb, sendet. Später Live-Status.
      const p1 = seg(u, T.app - 0.25, T.app + 0.1) * (1 - seg(u, T.kueche - 0.3, T.kueche - 0.05));
      const p2 = seg(u, T.live - 0.2, T.live + 0.15) * (1 - seg(u, T.punkte - 0.35, T.punkte - 0.1));
      if (p1 > 0 || p2 > 0) { veil(g, Math.max(p1, p2) * 0.8); const k = Math.max(p1, p2); const M = menuPlan(u, T);
        phoneFrame(g, PX, PY, PW, PH, k, (x, y, w, h) => { statusBar(g, x, y, w);
          if (p2 > 0 && u >= T.live - 0.2) { urlBar(g, x, y, w, "pizzeria-luna.de/bestellung"); statusPage(g, x, y, w, h, u, T); return; }
          if (M.page < 1) { g.save(); g.translate(-M.page * w, 0); urlBar(g, x, y, w, "pizzeria-luna.de"); homePage(g, x, y, w, h, u, M); g.restore(); }
          if (M.page > 0) { g.save(); g.translate((1 - M.page) * w, 0); urlBar(g, x, y, w, "pizzeria-luna.de/karte"); menuPage(g, x, y, w, h, u, M); g.restore(); } });
        if (p1 > 0 && u < T.live - 0.3) { chip(g, 250, 760, "Keine App ✓", seg(u, T.app - 0.05, T.app + 0.2) * (1 - seg(u, T.speise - 0.2, T.speise)), GREEN); chip(g, 830, 860, "Kein Konto ✓", seg(u, T.konto - 0.05, T.konto + 0.2) * (1 - seg(u, T.speise - 0.2, T.speise)), GREEN);
          const [fx, fy, pr] = fingerAt(M, u); g.save(); g.globalAlpha = p1; g.translate(0, (1 - out3(cl(p1))) * 900); hand(g, fx, fy, pr); g.restore(); }
      }
      // 3) Küchen-iPad: neues Ticket Tisch 5
      const ik = seg(u, T.kueche - 0.05, T.kueche + 0.35) * (1 - seg(u, T.live - 0.35, T.live - 0.1));
      if (ik > 0) { veil(g, ik * 0.7); g.save(); g.translate(0, (1 - out3(ik)) * 900); g.globalAlpha = cl(ik * 1.5); const x = 60, y = 560, w = 960, h = 700; shadow(g, 60, 24, "rgba(0,0,0,0.55)"); fillRR(g, x, y, w, h, 50, "#0b0d14"); noShadow(g); fillRR(g, x + 22, y + 22, w - 44, h - 44, 32, "#10162b");
        txt(g, "Küche", x + 70, y + 90, { w: 900, px: 40, c: "#fff", al: "left", fam: "D" }); const bl = 0.5 + 0.5 * Math.sin(u * 8); circle(g, x + w - 150, y + 90, 9, `rgba(43,194,117,${0.5 + bl * 0.5})`); txt(g, "LIVE", x + w - 130, y + 91, { w: 800, px: 24, c: GREEN, al: "left", fam: "I" });
        ["Neu", "In Arbeit", "Fertig"].forEach((s, i) => { const cx2 = x + 70 + i * 290; txt(g, s.toUpperCase(), cx2, y + 160, { w: 800, px: 22, c: "#7f8bb3", al: "left", fam: "I", ls: 2 }); fillRR(g, cx2, y + 180, 260, h - 240, 22, "rgba(255,255,255,0.04)"); });
        const old = [[1, "#1039 · Tisch 2", "2× Lasagne"], [2, "#1035 · Tisch 6", "1× Tiramisu"], [1, "#1040 · Tisch 3", "3× Wasser"]]; old.forEach(([col, a, b], i) => { const tx2 = x + 80 + col * 290, ty2 = y + 200 + (i === 2 ? 170 : 0) + (col === 2 ? 0 : 0); fillRR(g, tx2, ty2, 240, 150, 18, "#1c2440"); txt(g, a, tx2 + 20, ty2 + 40, { w: 800, px: 22, c: "#fff", al: "left", fam: "I" }); txt(g, b, tx2 + 20, ty2 + 82, { w: 500, px: 22, c: "#aab3d6", al: "left", fam: "I" }); });
        const nk = outBack(seg(u, T.tisch - 0.1, T.tisch + 0.25), 1.8); if (nk > 0) { const tx2 = x + 80, ty2 = y + 200; g.save(); g.translate(tx2 + 120, ty2 + 110); g.scale(nk, nk); shadow(g, 30, 0, "rgba(255,207,107,0.6)"); fillRR(g, -120, -110, 240, 220, 18, GOLD); noShadow(g);
          txt(g, "#1042 · Tisch 5", -100, -70, { w: 900, px: 24, c: INK, al: "left", fam: "I" }); const a1 = seg(u, T.pizza - 0.1, T.pizza + 0.15), a2 = seg(u, T.cola - 0.1, T.cola + 0.15); g.globalAlpha = 0.25 + 0.75 * a1; txt(g, "1× Pizza Margherita", -100, -20, { w: 700, px: 21, c: INK, al: "left", fam: "I" }); g.globalAlpha = 0.25 + 0.75 * a2; txt(g, "2× Cola", -100, 20, { w: 700, px: 21, c: INK, al: "left", fam: "I" }); g.globalAlpha = 1;
          fillRR(g, -100, 52, 200, 44, 22, INK); txt(g, "NEU", 0, 75, { w: 900, px: 22, c: GOLD, fam: "I" }); g.restore();
          if (u > T.tisch && u < T.tisch + 0.6) { const r = (u - T.tisch) / 0.6; g.strokeStyle = `rgba(255,207,107,${1 - r})`; g.lineWidth = 6; g.beginPath(); g.arc(tx2 + 120, ty2 + 110, 140 + r * 120, 0, 7); g.stroke(); } txt(g, "🔔", x + w - 90, y + 160, { px: 44 * (1 + 0.15 * Math.sin(u * 30) * (u < T.tisch + 0.8 && u > T.tisch ? 1 : 0)) }); }
        g.restore(); }
      // 4) Wallet: Punkte
      const wk = seg(u, T.punkte - 0.25, T.punkte + 0.15) * (1 - seg(u, T.karten - 0.35, T.karten - 0.1));
      if (wk > 0) { veil(g, wk * 0.7); g.save(); const e = outBack(cl(wk), 1.6); g.translate(540, 900); g.scale(e, e); g.globalAlpha = cl(wk * 1.5); shadow(g, 60, 24, "rgba(0,0,0,0.55)"); fillRR(g, -380, -250, 760, 500, 40, "#141a2e"); noShadow(g);
        const gr = g.createLinearGradient(-380, -250, 380, 250); gr.addColorStop(0, "rgba(61,107,255,0.35)"); gr.addColorStop(1, "rgba(255,207,107,0.12)"); g.fillStyle = gr; rr(g, -380, -250, 760, 500, 40); g.fill();
        txt(g, "Ihr Restaurant", -330, -185, { w: 900, px: 38, c: "#fff", al: "left", fam: "D" }); txt(g, "Bonuskarte", -330, -140, { w: 600, px: 24, c: "#aab3d6", al: "left", fam: "I" });
        const filled = u >= T.punkte + 0.25 ? 7 : 6; for (let i = 0; i < 10; i++) { const cx2 = -270 + (i % 5) * 135, cy2 = -30 + Math.floor(i / 5) * 115; const on = i < filled; const pop = i === 6 ? outBack(seg(u, T.punkte + 0.25, T.punkte + 0.55), 3) : 1; g.save(); g.translate(cx2, cy2); if (i === 6 && on) g.scale(pop, pop); circle(g, 0, 0, 44, on ? GOLD : "rgba(255,255,255,0.1)"); if (on) txt(g, "🍕", 0, 2, { px: 40 }); g.restore(); }
        txt(g, filled + " von 10", 330, -185, { w: 900, px: 30, c: GOLD, al: "right", fam: "I" }); g.restore();
        const chk = outBack(seg(u, T.wallet - 0.1, T.wallet + 0.25), 2); if (chk > 0) [["Apple Wallet", -190], ["Google Wallet", 190]].forEach(([s, dx]) => { g.save(); g.translate(540 + dx, 1250); g.scale(chk, chk); shadow(g, 20, 6, "rgba(0,0,0,0.4)"); fillRR(g, -165, -36, 330, 72, 36, "#ffffff"); noShadow(g); txt(g, s, 0, 2, { w: 900, px: 28, c: INK, fam: "I" }); g.restore(); });
      }
      // 5) Karten im eigenen Design: Fächer aus Varianten
      const dk = seg(u, T.karten - 0.25, T.karten + 0.2);
      if (dk > 0) { veil(g, dk * 0.85); const sp = g.createRadialGradient(540, 900, 50, 540, 900, 700); sp.addColorStop(0, `rgba(255,207,107,${0.18 * dk})`); sp.addColorStop(1, "rgba(255,207,107,0)"); g.fillStyle = sp; g.fillRect(0, 0, W, H);
        const V = [{ bg: "#17171b", fg: "#f2eef8", side: "qr", brand: "" }, { bg: "#f7f2ea", fg: "#2b2118", side: "nfc", brand: "PIZZERIA ROMA", acc: "#c0392b" }, { bg: "#0f2a22", fg: "#e9dcc0", side: "qr", brand: "CAFÉ LINA", acc: GOLD }, { bg: "#1b1f3a", fg: "#ffffff", side: "nfc", brand: "SUSHI MORI", acc: PINK }];
        const fan = out3(seg(u, T.karten, T.karten + 1.1));
        V.forEach((v, i) => { const k = outBack(seg(u, T.karten - 0.1 + i * 0.18, T.karten + 0.3 + i * 0.18), 1.8); if (k <= 0) return; const a = (i - 1.5) * 0.2 * fan, x = 540 + (i - 1.5) * 200 * fan, y = 930 + Math.abs(i - 1.5) * 40 * fan + (1 - k) * 600;
          g.save(); g.globalAlpha = cl(k * 2) * dk; menuCard(g, x, y, 330, v.side, { rot: a, bg: v.bg, fg: v.fg, brand: v.brand, acc: v.acc, u, seed: 3 + i, gloss: true, sx: 1 - 0.15 * Math.sin(u * 2 + i) * (1 - fan) }); g.restore(); });
        chip(g, 540, 1340, "in Ihrem Design", seg(u, T.design - 0.1, T.design + 0.2), BLUE);
      }
      const wf = cl((u - (d - 0.18)) / 0.18); if (wf > 0) { g.fillStyle = `rgba(255,255,255,${wf})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) {
      const T = p._T, E = [[0, "whoosh_down", 0.4, 0]];
      for (let i = 0; i < 6; i++) E.push([0.4 + i * 0.25, "pop", 0.25, (i % 3 - 1) * 0.5]); for (let t = 0.2; t < T.gaeste - 0.2; t += 0.32) E.push([t, "vsteps", 0.12, 0]);
      E.push([T.gaeste, "whoosh_side", 0.35, 0]); E.push([T.fuenf, "pop", 0.4, 0]); E.push([T.scan - 0.2, "whoosh_up", 0.4, 0]); E.push([T.qr, "vscan", 0.45, 0]); E.push([T.handy - 0.2, "tr_swish", 0.35, 0.2]); E.push([T.karte, "ping", 0.5, 0.2]);
      E.push([T.app - 0.2, "whoosh_up", 0.35, 0]); E.push([T.app, "pop", 0.4, 0]); E.push([T.konto, "pop", 0.4, 0]); E.push([T.speise, "shimmer", 0.25, 0]);
      [T.best, T.best + 0.35, T.best + 0.65].forEach((t) => E.push([t, "click", 0.45, 0.2])); E.push([T.best + 1.0, "ding", 0.5, 0]);
      E.push([T.kueche - 0.1, "whoosh_side", 0.45, 0.4]); E.push([T.tisch, "chime", 0.5, 0]); E.push([T.tisch + 0.05, "closed_bell", 0.35, 0.3]); E.push([T.pizza, "pop", 0.3, 0]); E.push([T.cola, "pop", 0.3, 0]);
      E.push([T.live - 0.15, "whoosh_up", 0.35, 0]); E.push([T.live + 0.3, "tick", 0.3, 0]); E.push([T.essen, "ding", 0.45, 0]);
      E.push([T.punkte - 0.2, "whoosh_up", 0.35, 0]); E.push([T.punkte + 0.25, "rc_stamp", 0.5, 0]); E.push([T.wallet, "shimmer", 0.35, 0]);
      for (let i = 0; i < 4; i++) E.push([T.karten - 0.1 + i * 0.18, "tr_swish", 0.3, (i - 1.5) * 0.3]); E.push([T.design, "chime", 0.35, 0]); E.push([d - 0.6, "riser", 0.6, 0, 0.6]);
      return E.filter((e) => e[0] < d + 0.1 && e[0] >= 0);
    },
  };
})();
