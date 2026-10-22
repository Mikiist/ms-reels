// VOICE_DELAY: 0.6
// h_error: Monitor im dunklen Raum, Fehlerfenster im eigenen Retro-Stil poppen immer schneller auf, Glitch, letzter großer Fehler.
// Parameter: items (Liste der Fehlertexte), final (Standard „Kunde hat die Seite verlassen“), url (Standard „ihre-firma.de“).
(() => {
  if (document.fonts) ["600 20px D", "700 20px D", "800 20px D", "900 20px D", "400 20px I", "500 20px I", "600 20px I", "700 20px I"].forEach((f) => document.fonts.load(f));
  const MX = 50, MY = 540, MW = 980, MH = 640; // Monitor (Weltpixel)
  const SX = 70, SY = 560, SWd = 940, SHd = 580; // Bildschirm
  const WW = 500, WH = 206, PAD = 30; // Fehlerfenster
  const DEF = ["Seite nicht gefunden", "Verbindung nicht sicher", "Lädt …", "Bild fehlt", "Fehler 404", "Formular kaputt"];
  const TITLES = ["Fehler", "Warnung", "Achtung", "Fehler", "Systemfehler", "Warnung"];

  function timing(d, p) {
    const tEnd = Math.max(1.1, d - 0.85); const N = Math.max(20, Math.min(30, Math.round(14 + tEnd * 5)));
    const iv0 = Math.min(0.27, tEnd / 6); let lo = 0.5, hi = 1.0; // Faktor r so, dass N Fenster bis tEnd passen
    for (let it = 0; it < 40; it++) { const r = (lo + hi) / 2; let s = 0, iv = iv0; for (let k = 0; k < N - 1; k++) { s += iv; iv *= r; } if (s > tEnd) hi = r; else lo = r; }
    const r = (lo + hi) / 2; const ts = [0]; let iv = iv0; for (let k = 1; k < N; k++) { ts.push(ts[k - 1] + iv); iv *= r; }
    const tG = ts[N - 1] + 0.07, tF = Math.max(tG + 0.22, Math.min(d - 0.5, tG + 0.32));
    return { ts, N, tG, tF };
  }
  function pos(i) { // kaskadierend versetzt, springt nach einigen Fenstern an eine neue Stelle
    const run = Math.floor(i / 7), k = i % 7; const ox = [30, 300, 110, 340, 16, 230][run % 6], oy = [20, 56, 160, 104, 236, 30][run % 6];
    return [ox + k * 30 + (rnd(i * 3.3) - 0.5) * 16, oy + k * 26 + (rnd(i * 5.7) - 0.5) * 12];
  }

  // ---------- Fenster im eigenen Retro-Stil ----------
  function icon(g, x, y, kind, s = 1) {
    g.save(); g.translate(x, y); g.scale(s, s);
    if (kind === 0) { const gr = g.createRadialGradient(-8, -10, 2, 0, 0, 30); gr.addColorStop(0, "#ff8a80"); gr.addColorStop(1, "#d11a1a"); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 28, 0, 7); g.fill(); g.strokeStyle = "#7a0b0b"; g.lineWidth = 2; g.stroke();
      g.strokeStyle = "#fff"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(-10, -10); g.lineTo(10, 10); g.moveTo(10, -10); g.lineTo(-10, 10); g.stroke(); }
    else if (kind === 1) { g.fillStyle = "#ffd23f"; g.strokeStyle = "#6b4e00"; g.lineWidth = 2.5; g.lineJoin = "round"; g.beginPath(); g.moveTo(0, -28); g.lineTo(30, 24); g.lineTo(-30, 24); g.closePath(); g.fill(); g.stroke();
      fillRR(g, -3.5, -12, 7, 22, 3, "#1a1a1a"); circle(g, 0, 16, 4, "#1a1a1a"); }
    else { const gr = g.createRadialGradient(-8, -10, 2, 0, 0, 30); gr.addColorStop(0, "#c4b5fd"); gr.addColorStop(1, "#6d28d9"); g.fillStyle = gr; g.beginPath(); g.moveTo(-12, -28); g.lineTo(12, -28); g.lineTo(28, -12); g.lineTo(28, 12); g.lineTo(12, 28); g.lineTo(-12, 28); g.lineTo(-28, 12); g.lineTo(-28, -12); g.closePath(); g.fill();
      txt(g, "!", 0, 2, { w: 900, px: 40, c: "#fff" }); }
    g.restore();
  }
  function bevel(g, x, y, w, h, up = true) {
    g.lineWidth = 2; g.strokeStyle = up ? "#ffffff" : "#6e6656"; g.beginPath(); g.moveTo(x + 1, y + h - 1); g.lineTo(x + 1, y + 1); g.lineTo(x + w - 1, y + 1); g.stroke();
    g.strokeStyle = up ? "#6e6656" : "#ffffff"; g.beginPath(); g.moveTo(x + w - 1, y + 1); g.lineTo(x + w - 1, y + h - 1); g.lineTo(x + 1, y + h - 1); g.stroke();
  }
  function winImg(title, msg, kind, w, h, big = false) {
    const c = document.createElement("canvas"); c.width = w + PAD * 2; c.height = h + PAD * 2; const g = c.getContext("2d"); g.translate(PAD, PAD);
    shadow(g, 26, 12, "rgba(0,0,0,0.55)"); g.fillStyle = "#e8e0cc"; g.fillRect(0, 0, w, h); noShadow(g);
    bevel(g, 0, 0, w, h); g.strokeStyle = "#2a2418"; g.lineWidth = 2; g.strokeRect(-1, -1, w + 2, h + 2);
    const th = big ? 56 : 40; const tg = g.createLinearGradient(0, 0, w, 0);
    if (big) { tg.addColorStop(0, "#5b0a0a"); tg.addColorStop(1, "#ff2d2d"); } else { tg.addColorStop(0, "#5a1a6b"); tg.addColorStop(0.6, "#c2185b"); tg.addColorStop(1, "#ff7a2f"); }
    g.fillStyle = tg; g.fillRect(5, 5, w - 10, th);
    for (let k = 0; k < 3; k++) { g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(12 + k * 7, 12, 4, th - 14); } // Griffleiste
    txt(g, title, 44, 5 + th / 2 + 1, { w: 700, px: big ? 30 : 22, fam: "I", c: "#ffffff", al: "left" });
    const bs = th - 12; const bx = w - 11 - bs; g.fillStyle = "#e8e0cc"; g.fillRect(bx, 11, bs, bs); bevel(g, bx, 11, bs, bs);
    g.strokeStyle = "#2a2418"; g.lineWidth = big ? 4 : 3; g.beginPath(); g.moveTo(bx + 8, 19); g.lineTo(bx + bs - 8, 11 + bs - 8); g.moveTo(bx + bs - 8, 19); g.lineTo(bx + 8, 11 + bs - 8); g.stroke();
    const by = 5 + th; const ih = h - by;
    icon(g, big ? 80 : 54, by + (big ? ih * 0.4 : ih * 0.38), kind, big ? 1.5 : 1);
    const tx = big ? 150 : 100, mw = w - tx - 24;
    if (big) { font(g, 800, 56, "D"); const lines = wrapLines(g, msg, mw); const px = lines.length > 2 ? 46 : 56; font(g, 800, px, "D"); const L = wrapLines(g, msg, mw);
      L.forEach((s, i) => txt(g, s, tx, by + ih * 0.4 + (i - (L.length - 1) / 2) * px * 1.1, { w: 800, px, fam: "D", c: "#1a140a", al: "left" })); }
    else { const px = fitPx(g, msg, mw, 31, 700, "I"); txt(g, msg, tx, by + ih * 0.38, { w: 700, px, fam: "I", c: "#1a140a", al: "left" }); }
    const bw = big ? 150 : 104, bh = big ? 54 : 40, bxx = w / 2 - bw / 2, byy = h - bh - (big ? 22 : 16);
    g.fillStyle = "#e8e0cc"; g.fillRect(bxx, byy, bw, bh); bevel(g, bxx, byy, bw, bh); g.strokeStyle = "#2a2418"; g.lineWidth = 2; g.strokeRect(bxx - 3, byy - 3, bw + 6, bh + 6);
    txt(g, "OK", w / 2, byy + bh / 2 + 1, { w: 700, px: big ? 28 : 22, fam: "I", c: "#1a140a" });
    return c;
  }
  // Hintergrund des Bildschirms: Schreibtisch + Browser mit Website
  function desk(p) {
    const c = document.createElement("canvas"); c.width = SWd; c.height = SHd; const g = c.getContext("2d");
    const bg = g.createLinearGradient(0, 0, SWd, SHd); bg.addColorStop(0, "#14315c"); bg.addColorStop(1, "#3b1460"); g.fillStyle = bg; g.fillRect(0, 0, SWd, SHd);
    g.fillStyle = "rgba(255,255,255,0.04)"; for (let y = 0; y < SHd; y += 4) for (let x = (y / 4) % 2 ? 0 : 2; x < SWd; x += 4) g.fillRect(x, y, 2, 2);
    // Browser
    const bx = 120, by = 40, bw = 700, bh = 450; shadow(g, 20, 8, "rgba(0,0,0,0.5)"); g.fillStyle = "#e8e0cc"; g.fillRect(bx, by, bw, bh); noShadow(g); bevel(g, bx, by, bw, bh);
    const tg = g.createLinearGradient(bx, 0, bx + bw, 0); tg.addColorStop(0, "#1d3b6e"); tg.addColorStop(1, "#3f7fd1"); g.fillStyle = tg; g.fillRect(bx + 5, by + 5, bw - 10, 34);
    txt(g, "Netzseher", bx + 18, by + 22, { w: 700, px: 19, fam: "I", c: "#fff", al: "left" });
    g.fillStyle = "#fff"; g.fillRect(bx + 10, by + 46, bw - 20, 30); bevel(g, bx + 10, by + 46, bw - 20, 30, false); txt(g, "http://" + (p.url || "ihre-firma.de"), bx + 20, by + 62, { w: 500, px: 18, fam: "I", c: "#333", al: "left" });
    const px0 = bx + 10, py0 = by + 84, pw = bw - 20, ph = bh - 94; g.fillStyle = "#f4f4f4"; g.fillRect(px0, py0, pw, ph);
    const hg = g.createLinearGradient(0, py0, 0, py0 + 170); hg.addColorStop(0, "#0f766e"); hg.addColorStop(1, "#14b8a6"); g.fillStyle = hg; g.fillRect(px0, py0, pw, 170);
    txt(g, "Willkommen bei Ihrer Firma", px0 + 30, py0 + 60, { w: 800, px: 34, fam: "D", c: "#fff", al: "left" }); fillRR(g, px0 + 30, py0 + 100, 200, 46, 8, "#fbbf24"); txt(g, "Anfrage", px0 + 130, py0 + 124, { w: 700, px: 20, fam: "I", c: "#111" });
    for (let i = 0; i < 3; i++) { fillRR(g, px0 + 30 + i * 215, py0 + 200, 195, 120, 10, "#ffffff"); fillRR(g, px0 + 50 + i * 215, py0 + 222, 120, 12, 6, "#cbd5e1"); fillRR(g, px0 + 50 + i * 215, py0 + 246, 150, 9, 4, "#e2e8f0"); fillRR(g, px0 + 50 + i * 215, py0 + 264, 140, 9, 4, "#e2e8f0"); }
    // Leiste unten (eigenes System)
    g.fillStyle = "#e8e0cc"; g.fillRect(0, SHd - 40, SWd, 40); bevel(g, 0, SHd - 40, SWd, 40);
    g.fillStyle = "#e8e0cc"; g.fillRect(6, SHd - 34, 110, 28); bevel(g, 6, SHd - 34, 110, 28); circle(g, 24, SHd - 20, 8, "#c2185b"); circle(g, 28, SHd - 23, 8, "#e8e0cc"); txt(g, "Menü", 42, SHd - 19, { w: 700, px: 17, fam: "I", c: "#1a140a", al: "left" });
    g.fillRect(SWd - 96, SHd - 34, 90, 28); bevel(g, SWd - 96, SHd - 34, 90, 28, false); txt(g, "10:24", SWd - 51, SHd - 19, { w: 600, px: 17, fam: "I", c: "#1a140a" });
    return c;
  }
  function chan(src, tmp, col) { // ein Farbkanal des Bildes
    const g = tmp.getContext("2d"); g.globalCompositeOperation = "source-over"; g.clearRect(0, 0, tmp.width, tmp.height); g.drawImage(src, 0, 0);
    g.globalCompositeOperation = "multiply"; g.fillStyle = col; g.fillRect(0, 0, tmp.width, tmp.height); g.globalCompositeOperation = "destination-in"; g.drawImage(src, 0, 0); g.globalCompositeOperation = "source-over"; return tmp;
  }

  TYPES.h_error = {
    zone: "bottom", pal: "black", bgv: 0, coverT: 2.9,
    prep(sc, p) {
      const items = (p.items && p.items.length ? p.items : DEF).map(String);
      sc.st.items = items; sc.st.wins = items.map((s, i) => winImg(TITLES[i % TITLES.length], s, i % 3, WW, WH));
      sc.st.fin = winImg("Systemfehler", p.final || "Kunde hat die Seite verlassen", 0, 860, 330, true);
      sc.st.desk = desk(p);
      const mk = () => { const c = document.createElement("canvas"); c.width = SWd; c.height = SHd; return c; };
      sc.st.S = mk(); sc.st.R = mk(); sc.st.G = mk(); sc.st.B = mk();
    },
    draw(g, u, d, p, sc, P) {
      const Tm = timing(d, p); const { ts, N, tG, tF } = Tm; const st = sc.st;
      const shown = ts.filter((t) => u >= t).length; const fill = shown / N; const af = u - tF;
      // Raum
      g.fillStyle = "#020205"; g.fillRect(0, 0, W, H);
      const hc = af >= 0 ? "255,40,40" : fill > 0.5 ? `255,${Math.round(140 - fill * 100)},${Math.round(120 - fill * 80)}` : "90,140,255";
      const hal = g.createRadialGradient(540, 850, 300, 540, 850, 900); hal.addColorStop(0, `rgba(${hc},${0.35 + (af >= 0 ? 0.25 * Math.max(0, 1 - af / 0.5) : 0)})`); hal.addColorStop(1, `rgba(${hc},0)`); g.fillStyle = hal; g.fillRect(0, 0, W, H);
      // Tischfläche mit Bildschirmlicht
      const dg = g.createLinearGradient(0, 1240, 0, H); dg.addColorStop(0, "#14121a"); dg.addColorStop(1, "#050407"); g.fillStyle = dg; g.fillRect(0, 1240, W, H - 1240);
      const dl = g.createRadialGradient(540, 1240, 10, 540, 1240, 700); dl.addColorStop(0, `rgba(${hc},0.28)`); dl.addColorStop(1, `rgba(${hc},0)`); g.fillStyle = dl; g.fillRect(0, 1240, W, 600);
      // Kamera
      const shk = af >= 0 && af < 0.45 ? 18 * Math.exp(-af / 0.1) : 0; const kick = af >= 0 ? 0.06 * Math.exp(-af / 0.12) + 0.06 * out3(seg(af, 0, 0.4)) : 0; const z = 1.07 + 0.03 * cl(u / d) + kick;
      g.save(); g.translate(540 + Math.sin(u * 97) * shk, 860 + Math.cos(u * 83) * shk); g.scale(z, z); g.translate(-540, -860);
      // Standfuß
      const sg = g.createLinearGradient(480, 0, 600, 0); sg.addColorStop(0, "#18181c"); sg.addColorStop(0.5, "#3a3a42"); sg.addColorStop(1, "#141418"); g.fillStyle = sg;
      g.beginPath(); g.moveTo(505, MY + MH - 10); g.lineTo(575, MY + MH - 10); g.lineTo(600, 1255); g.lineTo(480, 1255); g.closePath(); g.fill();
      g.fillStyle = "#1c1c22"; g.beginPath(); g.ellipse(540, 1260, 210, 22, 0, 0, 7); g.fill(); g.fillStyle = `rgba(${hc},0.25)`; g.beginPath(); g.ellipse(540, 1254, 200, 10, 0, Math.PI, 0); g.fill();
      // Gehäuse
      shadow(g, 80, 0, `rgba(${hc},0.45)`); fillRR(g, MX, MY, MW, MH, 22, "#0d0d11"); noShadow(g);
      const fr = g.createLinearGradient(MX, MY, MX, MY + MH); fr.addColorStop(0, "#3a3b44"); fr.addColorStop(0.1, "#16161b"); fr.addColorStop(1, "#0c0c10"); g.strokeStyle = fr; g.lineWidth = 3; rr(g, MX + 1.5, MY + 1.5, MW - 3, MH - 3, 21); g.stroke();
      circle(g, 540, MY + MH - 12, 3, af >= 0 ? "#ff3030" : "#4ade80");
      // Bildschirminhalt aufbauen
      const S = st.S, s = S.getContext("2d"); s.setTransform(1, 0, 0, 1, 0, 0); s.globalAlpha = 1; s.globalCompositeOperation = "source-over"; s.drawImage(st.desk, 0, 0);
      for (let i = 0; i < shown; i++) { const t0 = ts[i]; const k = seg(u, t0, t0 + 0.09); const sc_ = lerp(0.72, 1, outBack(k, 2.6)); const [x, y] = pos(i); const img = st.wins[i % st.wins.length];
        s.save(); s.translate(x + WW / 2, y + WH / 2); s.scale(sc_, sc_); s.globalAlpha = cl(k * 3); s.drawImage(img, -WW / 2 - PAD, -WH / 2 - PAD); s.restore();
        if (u - t0 < 0.12) { s.strokeStyle = `rgba(255,255,255,${0.9 * (1 - (u - t0) / 0.12)})`; s.lineWidth = 4; s.strokeRect(x - 3, y - 3, WW + 6, WH + 6); } }
      // Mauszeiger versucht, auf OK zu klicken
      if (shown > 0 && af < 0) { const li = shown - 1; const [x, y] = pos(li); const [x0, y0] = li > 0 ? pos(li - 1) : [600, 500]; const k = out3(seg(u, ts[li], ts[li] + 0.12));
        const cxp = lerp(x0, x, k) + WW / 2 + 20, cyp = lerp(y0, y, k) + WH - 30; const press = Math.max(0, Math.sin(u * 40)) * (u > 0.2 ? 1 : 0); cursor(s, cxp, cyp, 0.42, press * 0.5); }
      // Glitch-Phase
      const gk = seg(u, tG - 0.02, tF); const glitch = u >= tG - 0.02 ? (af < 0 ? gk : 0.12 + 0.88 * Math.max(0, 1 - af / 0.22)) : 0;
      if (af >= 0) { // letzter großer Fehler
        const k = seg(af, 0, 0.16); const sc_ = lerp(1.9, 1, outExpo(k)); s.save(); s.globalAlpha = cl(k * 4); s.translate(SWd / 2, SHd / 2 - 10); s.rotate(lerp(-0.06, -0.015, outExpo(k))); s.scale(sc_, sc_);
        s.drawImage(st.fin, -st.fin.width / 2, -st.fin.height / 2); s.restore(); }
      g.save(); rr(g, SX, SY, SWd, SHd, 6); g.clip();
      if (glitch > 0.01) {
        const off = af > 0.22 ? 2 : Math.round(4 + glitch * 22);
        g.fillStyle = "#000"; g.fillRect(SX, SY, SWd, SHd);
        g.globalCompositeOperation = "lighter"; g.drawImage(chan(S, st.R, "#ff0000"), SX - off, SY); g.drawImage(chan(S, st.G, "#00ff00"), SX, SY + off * 0.3); g.drawImage(chan(S, st.B, "#0000ff"), SX + off, SY); g.globalCompositeOperation = "source-over";
        const fr_ = Math.floor(u * 24); const nsl = af > 0.2 ? 0 : Math.round(3 + glitch * 9);
        for (let i = 0; i < nsl; i++) { const y = rnd(fr_ * 3.1 + i) * SHd, h = 6 + rnd(fr_ * 1.7 + i * 5) * 50, dx = (rnd(fr_ * 2.3 + i * 7) - 0.5) * 160 * glitch; g.drawImage(S, 0, y, SWd, h, SX + dx, SY + y, SWd, h);
          if (rnd(fr_ + i * 11) > 0.6) { g.fillStyle = ["rgba(255,0,180,0.35)", "rgba(0,255,200,0.3)", "rgba(255,255,255,0.3)"][i % 3]; g.fillRect(SX, SY + y, SWd, 3); } }
      } else g.drawImage(S, SX, SY);
      // Scanlines und Glas
      g.fillStyle = "rgba(0,0,0,0.12)"; for (let y = SY; y < SY + SHd; y += 4) g.fillRect(SX, y, SWd, 1.5);
      const gl = g.createLinearGradient(SX, SY, SX + SWd * 0.7, SY + SHd); gl.addColorStop(0, "rgba(255,255,255,0.10)"); gl.addColorStop(0.35, "rgba(255,255,255,0.02)"); gl.addColorStop(0.36, "rgba(255,255,255,0)"); gl.addColorStop(1, "rgba(255,255,255,0.03)"); g.fillStyle = gl; g.fillRect(SX, SY, SWd, SHd);
      if (af >= 0 && af < 0.25) { g.fillStyle = `rgba(255,255,255,${0.7 * (1 - af / 0.25)})`; g.fillRect(SX, SY, SWd, SHd); }
      g.restore(); g.restore();
      // Tastatur vorne (im Bildschirmlicht)
      g.save(); g.translate(540, 1335); const kg = g.createLinearGradient(0, -40, 0, 40); kg.addColorStop(0, "#26252c"); kg.addColorStop(1, "#0b0b0e"); g.fillStyle = kg; rr(g, -420, -34, 840, 70, 14); g.fill();
      g.fillStyle = `rgba(${hc},0.18)`; for (let r = 0; r < 3; r++) for (let c = 0; c < 18; c++) fillRR(g, -400 + c * 44.5 + r * 8, -24 + r * 20, 38, 14, 3, `rgba(${hc},${0.10 + 0.05 * r})`); g.restore();
      // Funken bei der Glitch-Phase
      if (af >= 0 && af < 0.5) sparkles(g, 540, 850, u * 3, 14, 520, "rgba(255,120,120,0.9)", 21);
    },
    ev(d, p) {
      const Tm = timing(d, p); const E = [];
      Tm.ts.forEach((t, i) => { const k = i / Tm.N; E.push([t, "h_error_pop" + (i % 4), i === 0 ? 1.0 : 0.85 - 0.5 * k, ((i * 37) % 7 - 3) / 6]); });
      E.push([0, "h_error_hit", 0.9, 0]);
      E.push([Tm.tG - 0.02, "h_error_glitch", 0.85, 0]); E.push([Tm.tF, "h_error_final", 1.0, 0]);
      return E;
    },
  };
})();
