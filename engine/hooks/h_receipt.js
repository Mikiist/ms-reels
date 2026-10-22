// VOICE_DELAY: 0.5
// h_receipt: Ein Thermodrucker druckt ab Bild 0 einen Kassenbon nach oben ins Bild. Zeile für Zeile erscheinen
// die Posten mit „??? €“, dann SUMME, ein roter Stempel knallt drauf, zum Schluss wird der Bon abgerissen.
// Parameter: items (Standard ["Verpasste Anrufe", "Kunden bei der Konkurrenz", "Schlechter erster Eindruck"]),
// total (Standard „Zu viel“, Stempeltext), title (Standard „IHR BELEG“).
(() => {
  const PW = 760, PX = 540 - PW / 2; // Papier
  const SLOT = 1226; // Austritt des Papiers
  const MONO = '"DejaVu Sans Mono", "Liberation Mono", monospace';
  const INK = "#23211f";
  const FEED_V = 1400; // px/s während eines Vorschubs (vor Zeitstreckung)

  function mono(g, w, px) { g.font = `${w} ${px}px ${MONO}`; }
  function items(p) { const it = Array.isArray(p.items) && p.items.length ? p.items : ["Verpasste Anrufe", "Kunden bei der Konkurrenz", "Schlechter erster Eindruck"]; return it.slice(0, 5).map(String); }

  // Inhalt des Bons vorbereiten: Leinwand + Zeilen (für den Vorschub in Schüben)
  function layout(p) {
    const c = document.createElement("canvas"); const g0 = c.getContext("2d");
    const IN = 42, inner = PW - 2 * IN; const rows = []; let y = 50;
    const title = String(p.title || "IHR BELEG").toUpperCase();
    rows.push({ kind: "title", y0: y, y1: y + 74, s: title }); y += 76;
    rows.push({ kind: "dash", y0: y, y1: y + 30 }); y += 34;
    mono(g0, 700, 38); const amtW = g0.measureText("??? €").width;
    for (const s of items(p)) {
      mono(g0, 600, 38); let lines = [s]; if (g0.measureText(s).width > inner - amtW - 30) lines = wrapLines(g0, s, inner - amtW - 30).slice(0, 2);
      const h = 22 + lines.length * 48; rows.push({ kind: "item", y0: y, y1: y + h, lines }); y += h + 6;
    }
    rows.push({ kind: "dash", y0: y, y1: y + 30 }); y += 34;
    rows.push({ kind: "sum", y0: y, y1: y + 110 }); y += 112;
    rows.push({ kind: "dbl", y0: y, y1: y + 28 }); y += 34;
    rows.push({ kind: "bar", y0: y, y1: y + 84 }); y += 88;
    const len = y + 30; c.width = PW; c.height = len;
    return { c, rows, len, IN, inner, amtW };
  }

  function paperBase(L, p) {
    const { c, rows, len, IN, inner } = L; const g = c.getContext("2d");
    // Papier mit Struktur
    const bg = g.createLinearGradient(0, 0, PW, 0); bg.addColorStop(0, "#f1eee6"); bg.addColorStop(0.5, "#fbfaf6"); bg.addColorStop(1, "#ece8df");
    g.fillStyle = bg; g.fillRect(0, 0, PW, len);
    const im = g.getImageData(0, 0, PW, len), D = im.data;
    for (let y = 0; y < len; y++) for (let x = 0; x < PW; x++) { const i = (y * PW + x) * 4; const n = (rnd(x * 1.31 + y * 7.17) - 0.5) * 7 + (rnd(Math.floor(x / 3) * 3.7 + y * 0.013) - 0.5) * 4; D[i] += n; D[i + 1] += n; D[i + 2] += n; }
    g.putImageData(im, 0, 0);
    // obere Abrisskante (Zacken)
    g.globalCompositeOperation = "destination-out"; g.beginPath(); g.moveTo(0, 0);
    for (let x = 0; x <= PW; x += 14) g.lineTo(x, (x / 14) % 2 ? 9 + rnd(x) * 3 : 1 + rnd(x + 3) * 2); g.lineTo(PW, 0); g.closePath(); g.fill(); g.globalCompositeOperation = "source-over";
    // Druck
    g.fillStyle = INK; g.textBaseline = "middle";
    const dashLine = (y, ch = "-") => { mono(g, 500, 32); g.textAlign = "left"; let s = ""; while (g.measureText(s + ch).width < inner) s += ch; g.fillText(s, IN, y); };
    for (const r of rows) {
      const ym = (r.y0 + r.y1) / 2;
      if (r.kind === "title") { mono(g, 700, Math.min(62, fitMono(g, r.s, inner, 62, 700))); g.textAlign = "center"; g.fillText(r.s, PW / 2, ym); }
      else if (r.kind === "meta") { mono(g, 500, 28); g.textAlign = "left"; g.fillText("Datum: heute", IN, ym); g.textAlign = "right"; g.fillText("Kasse 1", PW - IN, ym); }
      else if (r.kind === "dash") dashLine(ym);
      else if (r.kind === "dbl") dashLine(ym, "=");
      else if (r.kind === "item") {
        mono(g, 600, 38); g.textAlign = "left"; r.lines.forEach((ln, i) => g.fillText(ln, IN, r.y0 + 34 + i * 48));
        const ly = r.y0 + 34 + (r.lines.length - 1) * 48; mono(g, 700, 38); g.textAlign = "right"; g.fillText("??? €", PW - IN, ly);
        // Punkte bis zum Betrag
        mono(g, 600, 38); const lw = g.measureText(r.lines[r.lines.length - 1]).width; mono(g, 500, 30); g.textAlign = "left";
        let s = ""; const room = inner - lw - L.amtW - 20; while (g.measureText(s + ".").width < room) s += "."; if (room > 20) g.fillText(s, IN + lw + 8, ly + 2);
      } else if (r.kind === "sum") { mono(g, 700, 60); g.textAlign = "left"; g.fillText("SUMME", IN, ym); }
      else if (r.kind === "bar") {
        let x = IN + 30; let k = 0; while (x < PW - IN - 30) { const w = 2 + Math.floor(rnd(k * 3.7 + 1) * 4) * 2; if (k % 2 === 0) g.fillRect(x, r.y0 + 4, w, 56); x += w + (k % 2 ? 0 : 1); k++; }
        mono(g, 500, 20); g.textAlign = "center"; g.fillText("0 1 2 3 4 5 6 7 8 9", PW / 2, r.y0 + 74);
      }
    }
    // Thermodruck: leicht ungleichmäßig, feine Streifen
    g.globalCompositeOperation = "lighter"; for (let y = 0; y < len; y += 3) { g.fillStyle = `rgba(255,255,255,${0.03 + rnd(y * 0.7) * 0.05})`; g.fillRect(0, y, PW, 1); }
    g.globalCompositeOperation = "source-over";
    return c;
  }
  function fitMono(g, s, maxW, px, w) { mono(g, w, px); const m = g.measureText(s).width; return m > maxW ? Math.floor(px * maxW / m) : px; }

  function stampImg(p) {
    const tot = String(p.total || "Zu viel").toUpperCase();
    const c = document.createElement("canvas"); const g = c.getContext("2d");
    font(g, 900, 100, "D"); let px = 100; const tw0 = g.measureText(tot).width; if (tw0 > 380) px = Math.floor(100 * 380 / tw0);
    font(g, 900, px, "D"); const tw = g.measureText(tot).width; const w = Math.max(250, tw + 70), h = px + 64;
    c.width = w + 20; c.height = h + 20; const g2 = c.getContext("2d"); g2.translate(10, 10);
    g2.strokeStyle = "#d3202e"; g2.lineWidth = 9; rr(g2, 4, 4, w - 8, h - 8, 16); g2.stroke(); g2.lineWidth = 3; rr(g2, 15, 15, w - 30, h - 30, 10); g2.stroke();
    g2.fillStyle = "#d3202e"; font(g2, 900, px, "D"); g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillText(tot, w / 2, h / 2 + 3);
    // Stempelstruktur: Fehlstellen
    g2.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 900; i++) { const x = rnd(i * 2.3) * w, y = rnd(i * 5.9) * h; const r = 0.6 + rnd(i * 7.1) * 2.2; g2.globalAlpha = 0.4 + rnd(i * 1.1) * 0.6; g2.beginPath(); g2.arc(x, y, r, 0, 7); g2.fill(); }
    for (let i = 0; i < 7; i++) { g2.globalAlpha = 0.25; const y = rnd(i * 9.1) * h; g2.fillRect(0, y, w, 1 + rnd(i) * 2); }
    g2.globalAlpha = 1; g2.globalCompositeOperation = "source-over";
    return { c, w: w + 20, h: h + 20 };
  }

  // Zeitplan: Vorschub in Schüben, Stempel, Abriss
  function timing(d, L) {
    const tP = Math.max(0.95, Math.min(2.1, 0.5 * d));
    const start = 92; // so viel Papier ist bei Bild 0 schon draußen
    const pts = L.rows.map((r) => r.y1 + 14).filter((v) => v > start); pts.push(L.len);
    const bursts = []; let prev = start; for (const v of pts) { if (v - prev < 4) continue; bursts.push({ a: prev, b: v }); prev = v; }
    const pause = 0.035; let tot = 0; bursts.forEach((b) => (tot += (b.b - b.a) / FEED_V + pause));
    const k = tP / tot; let t = 0; bursts.forEach((b) => { b.t0 = t; b.t1 = t + (b.b - b.a) / FEED_V * k; t = b.t1 + pause * k; });
    const tS = tP + 0.07, tT = Math.min(tS + 0.34, d - 0.3);
    return { tP, tS, tT, bursts, start };
  }
  function lenAt(u, T, L) {
    if (u <= 0) return { len: T.start, moving: 1 }; let len = T.start, v = 0;
    for (const b of T.bursts) { if (u >= b.t1) { len = b.b; continue; } if (u > b.t0) { const k = (u - b.t0) / (b.t1 - b.t0); len = lerp(b.a, b.b, k); v = 1; } break; }
    return { len: Math.min(L.len, len), moving: v };
  }

  function bgCanvas() {
    const c = document.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#0d0f14"); gr.addColorStop(0.5, "#191b22"); gr.addColorStop(1, "#08090c"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // Lichtschein hinter dem Bon
    let rg = g.createRadialGradient(560, 820, 40, 540, 860, 820); rg.addColorStop(0, "rgba(255,226,190,0.28)"); rg.addColorStop(0.5, "rgba(255,200,150,0.08)"); rg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = rg; g.fillRect(0, 0, W, H);
    // Bokeh (Laden bei Nacht)
    for (let i = 0; i < 22; i++) {
      const x = rnd(i * 3.1 + 4) * W, y = 380 + rnd(i * 5.3 + 1) * 900, r = 30 + rnd(i * 1.9) * 80; const cols = ["255,170,90", "255,120,80", "120,170,255", "255,220,160"];
      const a = 0.05 + rnd(i * 7.3) * 0.08; rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, `rgba(${cols[i % 4]},${a})`); rg.addColorStop(0.75, `rgba(${cols[i % 4]},${a * 0.8})`); rg.addColorStop(1, `rgba(${cols[i % 4]},0)`);
      g.fillStyle = rg; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    return c;
  }

  function printer(g, u, moving, T) {
    const by = SLOT - 30, x0 = 104, x1 = 976, yb = 1580; // Oberkante, Breite, Unterkante
    // Körper
    shadow(g, 80, 30, "rgba(0,0,0,0.85)"); g.fillStyle = "#121317"; rr(g, x0, by - 16, x1 - x0, yb - by, 44); g.fill(); noShadow(g);
    // Deckel (Oberseite) mit Wölbung
    let gr = g.createLinearGradient(0, by - 16, 0, by + 84); gr.addColorStop(0, "#5a5e67"); gr.addColorStop(0.18, "#363940"); gr.addColorStop(0.7, "#22242a"); gr.addColorStop(1, "#18191d");
    g.fillStyle = gr; g.beginPath(); g.moveTo(x0, by + 84); g.lineTo(x0, by + 28); g.quadraticCurveTo(x0, by - 16, x0 + 44, by - 16); g.lineTo(x1 - 44, by - 16); g.quadraticCurveTo(x1, by - 16, x1, by + 28); g.lineTo(x1, by + 84); g.closePath(); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x0 + 40, by - 14); g.lineTo(x1 - 40, by - 14); g.stroke();
    // Glanz auf dem Deckel
    const hl = g.createLinearGradient(x0, 0, x1, 0); hl.addColorStop(0, "rgba(255,255,255,0)"); hl.addColorStop(0.25, "rgba(255,255,255,0.10)"); hl.addColorStop(0.4, "rgba(255,255,255,0)"); hl.addColorStop(1, "rgba(255,255,255,0.03)");
    g.fillStyle = hl; g.fillRect(x0 + 10, by - 12, x1 - x0 - 20, 30);
    // Fuge zwischen Deckel und Front
    g.strokeStyle = "rgba(0,0,0,0.7)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + 6, by + 84); g.lineTo(x1 - 6, by + 84); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.14)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 + 6, by + 87); g.lineTo(x1 - 6, by + 87); g.stroke();
    // Front
    gr = g.createLinearGradient(0, by + 88, 0, yb); gr.addColorStop(0, "#26282e"); gr.addColorStop(0.2, "#16171b"); gr.addColorStop(1, "#050506");
    g.fillStyle = gr; g.fillRect(x0 + 4, by + 88, x1 - x0 - 8, yb - by - 130);
    // Schlitz
    fillRR(g, PX - 24, SLOT - 7, PW + 48, 16, 7, "#040405");
    // Lüftungsschlitze links, LEDs und Taste rechts
    for (let i = 0; i < 6; i++) fillRR(g, x0 + 50 + i * 26, by + 116, 14, 46, 7, "#0b0c0e");
    const led = (x, c, on) => { if (on) { const rg = g.createRadialGradient(x, by + 136, 0, x, by + 136, 30); rg.addColorStop(0, hexA(c, 0.65)); rg.addColorStop(1, hexA(c, 0)); g.fillStyle = rg; g.fillRect(x - 30, by + 106, 60, 60); } circle(g, x, by + 136, 7, on ? c : "#1c1d22"); };
    led(x1 - 120, "#34d399", true); led(x1 - 84, "#f59e0b", moving > 0 && Math.floor(u * 14) % 2 === 0);
    fillRR(g, x1 - 226, by + 120, 72, 32, 10, "#0b0c0e"); fillRR(g, x1 - 224, by + 121, 68, 13, 7, "rgba(255,255,255,0.09)");
  }
  function tearBar(g) { // Abreißkante mit Zähnen über dem Papier
    const y = SLOT + 2; const gr = g.createLinearGradient(0, y - 8, 0, y + 12); gr.addColorStop(0, "#d9dde3"); gr.addColorStop(0.5, "#7d838d"); gr.addColorStop(1, "#2a2d33");
    g.fillStyle = gr; g.beginPath(); g.moveTo(PX - 26, y + 12); g.lineTo(PX - 26, y);
    for (let x = PX - 26; x <= PX + PW + 26; x += 10) { g.lineTo(x + 5, y - 7); g.lineTo(x + 10, y); } g.lineTo(PX + PW + 26, y + 12); g.closePath(); g.fill();
  }

  TYPES.h_receipt = {
    zone: "bottom", pal: "black", bgv: 0, coverT: 2.0,
    prep(sc, p) {
      const L = layout(p); sc.st.L = L; sc.st.base = paperBase(L, p);
      const st = stampImg(p); sc.st.stamp = st;
      const sum = L.rows.find((r) => r.kind === "sum"); sc.st.stampPos = { x: PW * 0.66, y: (sum.y0 + sum.y1) / 2 + 2, rot: -0.13 };
      const s2 = document.createElement("canvas"); s2.width = PW; s2.height = L.len; const g = s2.getContext("2d"); g.drawImage(sc.st.base, 0, 0);
      g.save(); g.globalCompositeOperation = "source-atop"; g.globalAlpha = 0.9; g.translate(sc.st.stampPos.x, sc.st.stampPos.y); g.rotate(sc.st.stampPos.rot); g.drawImage(st.c, -st.w / 2, -st.h / 2); g.restore();
      sc.st.stamped = s2; sc.st.bg = bgCanvas(); sc.st.T = null;
    },
    draw(g, u, d, p, sc, P) {
      const L = sc.st.L; if (!sc.st.T || sc.st.Td !== d) { sc.st.T = timing(d, L); sc.st.Td = d; } const T = sc.st.T;
      const st = lenAt(u, T, L); const len = st.len, moving = st.moving;
      const stamped = u >= T.tS; const torn = u >= T.tT;
      // Kamera
      const zk = inOut(seg(u, 0, T.tP + 0.1)); const camY = lerp(1050, 896, zk);
      let s = lerp(1.24, 0.95, zk) * (1 + 0.03 * cl((u - T.tP) / 2)); const punch = stamped ? Math.exp(-(u - T.tS) / 0.08) : 0; s *= 1 + 0.03 * punch;
      let shx = 0, shy = 0; if (punch > 0.03) { shx = Math.sin(u * 99) * 10 * punch; shy = Math.cos(u * 87) * 10 * punch; }
      if (moving) { shx += (rnd(Math.floor(u * 60)) - 0.5) * 1.6; }
      g.drawImage(sc.st.bg, 0, 0);
      g.save(); g.translate(540 + shx, 860 + shy); g.scale(s, s); g.translate(-540, -camY);
      // Papier: Lage nach dem Abriss
      const lift = torn ? outBack(seg(u, T.tT, T.tT + 0.4), 1.6) : 0; const dy = -45 * lift; const rot = -0.045 * lift + 0.006 * Math.sin(u * 2.1) * (torn ? 1 : 0.4);
      const top = SLOT - len; const src = stamped ? sc.st.stamped : sc.st.base;
      g.save(); g.translate(540, SLOT + dy); g.rotate(rot); g.scale(1 + 0.03 * lift, 1 + 0.03 * lift); g.translate(-540, -SLOT);
      // Schatten des Bons
      g.save(); shadow(g, 40 + 30 * lift, 20 + 30 * lift, `rgba(0,0,0,${0.55 + 0.2 * lift})`); g.shadowOffsetX = 18 + 24 * lift; g.fillStyle = "#000"; g.fillRect(PX + 6, top + 12, PW - 12, len - 12); noShadow(g); g.restore();
      // Papier in Streifen (leicht gewellt, oben nach hinten gebogen)
      const STR = 6; const clipB = torn ? SLOT + 40 : SLOT;
      g.save(); g.beginPath(); g.rect(0, 0, W, clipB); g.clip();
      for (let y = top; y < SLOT; y += STR) {
        const pp = y - top; const hgt = SLOT - y; const wv = Math.sin(pp / 95 + 1.3) * 0.5 + Math.sin(pp / 37 + 0.4) * 0.15;
        const curl = cl((hgt - 430) / 320); const sx = 1 - 0.012 * (1 + wv) - 0.08 * curl * curl; const ox = 3 * wv;
        const w = PW * sx, x = 540 - w / 2 + ox; const hh = Math.min(STR, SLOT - y) + 0.6;
        g.drawImage(src, 0, pp, PW, Math.min(STR, SLOT - y), x, y, w, hh);
        const sh = 0.07 * wv + 0.22 * curl * curl; if (sh > 0.005) { g.fillStyle = `rgba(30,25,20,${sh})`; g.fillRect(x, y, w, hh); } else if (sh < -0.005) { g.fillStyle = `rgba(255,255,255,${-sh * 0.6})`; g.fillRect(x, y, w, hh); }
      }
      // Bewegungsunschärfe beim Vorschub
      if (moving) { g.globalAlpha = 0.18; g.drawImage(src, 0, 0, PW, len, PX, top + 9, PW, len); g.drawImage(src, 0, 0, PW, len, PX, top + 18, PW, len); g.globalAlpha = 1; }
      // Glanz auf dem Thermopapier
      const gl = g.createLinearGradient(PX, 0, PX + PW, 0); gl.addColorStop(0, "rgba(255,255,255,0)"); gl.addColorStop(0.32, "rgba(255,255,255,0.10)"); gl.addColorStop(0.4, "rgba(255,255,255,0)"); gl.addColorStop(1, "rgba(0,0,0,0.06)");
      g.fillStyle = gl; g.fillRect(PX, top, PW, len);
      g.restore();
      // Abrisskante unten (Zacken), sichtbar nach dem Abriss
      if (torn) {
        g.fillStyle = "#f3f0e9"; g.beginPath(); g.moveTo(PX + 4, SLOT - 1);
        for (let x = 0; x <= PW - 8; x += 12) g.lineTo(PX + 4 + x, SLOT + ((x / 12) % 2 ? 8 + rnd(x * 1.7) * 4 : 1)); g.lineTo(PX + PW - 4, SLOT - 1); g.closePath(); g.fill();
      }
      g.restore();
      // Drucker davor
      printer(g, u, moving, T); tearBar(g);
      // Wärme des Druckkopfs: leichtes Glimmen am Schlitz beim Drucken
      if (moving) { g.save(); g.globalCompositeOperation = "lighter"; const rg = g.createLinearGradient(0, SLOT - 30, 0, SLOT); rg.addColorStop(0, "rgba(255,180,120,0)"); rg.addColorStop(1, "rgba(255,180,120,0.10)"); g.fillStyle = rg; g.fillRect(PX, SLOT - 30, PW, 30); g.restore(); }
      // Stempel im Anflug
      const sp = sc.st.stampPos, si = sc.st.stamp; const sk = seg(u, T.tS - 0.16, T.tS);
      if (sk > 0 && !stamped) {
        const e = in3(sk); const sc2 = lerp(2.6, 1.0, e);
        const wx = PX + sp.x, wy = SLOT - len + sp.y; g.save(); g.translate(wx, wy); g.rotate(sp.rot - 0.25 * (1 - e)); g.scale(sc2, sc2); g.globalAlpha = 0.25 + 0.75 * e;
        shadow(g, 40 * (1 - e) + 6, 30 * (1 - e), "rgba(0,0,0,0.5)"); g.drawImage(si.c, -si.w / 2, -si.h / 2); noShadow(g); g.restore();
      }
      if (stamped) { // Tintenspritzer und Druckwelle
        const k = u - T.tS; const wx = PX + sp.x, wy = SLOT - len + sp.y + dy * (torn ? 1 : 0);
        if (k < 0.35) { g.save(); g.translate(wx, wy); g.rotate(sp.rot); const q = k / 0.35; g.strokeStyle = `rgba(211,32,46,${0.5 * (1 - q)})`; g.lineWidth = 10 * (1 - q) + 1; rr(g, -si.w / 2 - q * 90, -si.h / 2 - q * 60, si.w + q * 180, si.h + q * 120, 24); g.stroke(); g.restore(); }
      }
      g.restore();
      // Lichtblitz beim Stempel
      if (punch > 0.02) { g.fillStyle = `rgba(255,240,235,${0.18 * punch})`; g.fillRect(0, 0, W, H); }
      // Vignette
      const vg = g.createRadialGradient(540, 860, 420, 540, 900, 1250); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.7)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    },
    ev(d, p) {
      const L = layout(p); const T = timing(d, L); const E = [[0, "rc_start", 0.9, 0]];
      T.bursts.forEach((b, i) => { const n = Math.max(3, Math.min(40, Math.round((b.t1 - b.t0) * 100))); E.push([b.t0, "rc_feed" + n, 0.85, (i % 2 ? 0.08 : -0.08)]); });
      E.push([T.tS - 0.14, "rc_whoosh", 0.5, 0.1]); E.push([T.tS, "rc_stamp", 1.0, 0.1]);
      E.push([T.tT - 0.02, "rc_tear", 0.95, -0.1]);
      return E;
    },
  };
})();
