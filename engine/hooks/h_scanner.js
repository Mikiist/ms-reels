// VOICE_DELAY: 0.6
// h_scanner: Handy mit Website im dunklen Raum, roter Laser scannt von oben nach unten, Fehler leuchten auf, Stempel „DURCHGEFALLEN“.
// Parameter: url (Adresse im Browser), items (3 Fehler-Labels, oben nach unten), verdict (Stempeltext)
for (const f of ["400 30px I", "600 30px I", "700 30px I", "900 30px D", "800 30px D"]) document.fonts.load(f);
const HN = { cx: 540, cy: 868, w: 440, h: 840, tilt: -0.06 }; // Handy
const HN_SW = HN.w - 32, HN_SH = HN.h - 32;
const HN_ZONES = [[112, 404], [414, 590], [600, 790]]; // Fehlerbereiche im Display (y von, bis)
function hn_times(d) {
  const tc = Math.max(1.5, Math.min(d - 0.5, 3.3)); const s0 = 0.0, s1 = tc - 0.36;
  const yAt = (u) => lerp(-20, HN_SH + 10, inOut(cl((u - s0) / (s1 - s0))) * 0.25 + cl((u - s0) / (s1 - s0)) * 0.75);
  const hit = HN_ZONES.map(([a, b]) => { const y = a + (b - a) * 0.45; let lo = s0, hi = s1; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (yAt(m) < y) lo = m; else hi = m; } return lo; });
  return { tc, s0, s1, yAt, hit };
}
TYPES.h_scanner = {
  zone: "bottom", pal: "black", bgv: 0, coverT: 2.95,
  prep(sc, p) {
    const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
    // Raum
    const bg = mk(W, H); let g = bg.getContext("2d");
    let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "#030409"); gr.addColorStop(0.5, "#080a12"); gr.addColorStop(1, "#030305"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    // Tischplatte: feine Maserung
    g.globalAlpha = 0.05; for (let i = 0; i < 160; i++) { g.strokeStyle = i % 2 ? "#8090b0" : "#000"; g.lineWidth = 1 + rnd(i) * 2; g.beginPath(); const y = rnd(i * 3.3) * H; g.moveTo(0, y); g.bezierCurveTo(300, y + (rnd(i * 5) - 0.5) * 60, 700, y + (rnd(i * 7) - 0.5) * 60, W, y + (rnd(i * 9) - 0.5) * 40); g.stroke(); } g.globalAlpha = 1;
    sc.st.bg = bg;
    // Website-Mockup (veraltete Desktop-Seite auf dem Handy)
    const S = mk(HN_SW, HN_SH); g = S.getContext("2d"); const SW = HN_SW;
    g.fillStyle = "#f3f1ec"; g.fillRect(0, 0, SW, HN_SH);
    g.fillStyle = "#0b0b0e"; g.fillRect(0, 0, SW, 46); txt(g, "9:41", 34, 26, { w: 600, px: 20, fam: "I", c: "#fff", al: "left" }); fillRR(g, SW - 62, 17, 36, 16, 4, "#fff"); fillRR(g, SW - 26, 21, 4, 8, 2, "#fff");
    g.fillStyle = "#e7e5df"; g.fillRect(0, 46, SW, 58); fillRR(g, 14, 56, SW - 28, 38, 19, "#ffffff");
    const url = String(p.url || "ihre-firma.de"); txt(g, url, SW / 2, 76, { w: 500, px: fitPx(g, url, SW - 70, 19, 500, "I"), fam: "I", c: "#59606c" });
    // Kopfzeile alt
    g.fillStyle = "#2f4a6b"; g.fillRect(0, 104, SW, 8);
    // Bereich 1: großes Bild lädt
    let lg = g.createLinearGradient(0, 112, 0, 404); lg.addColorStop(0, "#cfd3d8"); lg.addColorStop(1, "#b9bec6"); g.fillStyle = lg; g.fillRect(0, 112, SW, 292);
    g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.moveTo(40, 380); g.lineTo(150, 240); g.lineTo(230, 330); g.lineTo(290, 270); g.lineTo(370, 380); g.closePath(); g.fill(); circle(g, 300, 190, 26, "rgba(255,255,255,0.4)");
    txt(g, "Bild wird geladen …", SW / 2, 352, { w: 500, px: 17, fam: "I", c: "#5e646e" }); fillRR(g, 70, 372, SW - 140, 8, 4, "#9aa0aa"); fillRR(g, 70, 372, (SW - 140) * 0.22, 8, 4, "#4b5563");
    // Bereich 2: Kontakt ohne Knopf
    txt(g, "Kontakt", 22, 440, { w: 700, px: 26, fam: "I", c: "#1f2937", al: "left" });
    for (let i = 0; i < 4; i++) fillRR(g, 22, 472 + i * 24, [300, 250, 280, 190][i], 10, 5, "#c5c8ce");
    g.setLineDash([7, 6]); g.strokeStyle = "#b3b7bf"; g.lineWidth = 2; rr(g, 22, 570 - 12, SW - 44, 0.1, 2); g.stroke(); g.setLineDash([]);
    // Bereich 3: Desktop-Text, zu klein, läuft rechts raus
    txt(g, "Willkommen auf unserer Homepage!", 22, 622, { w: 700, px: 22, fam: "I", c: "#1f2937", al: "left" });
    for (let c = 0; c < 3; c++) for (let i = 0; i < 9; i++) fillRR(g, 22 + c * 190, 646 + i * 13, 170 - (i % 3) * 18, 6, 3, "#b9bdc4");
    g.fillStyle = "#d9dbdf"; g.fillRect(0, 772, SW, 14); fillRR(g, 6, 775, 140, 8, 4, "#9aa0aa");
    sc.st.site = S;
    // Stempel mit Gebrauchsspuren
    const vt = String(p.verdict || "DURCHGEFALLEN").toUpperCase(); const st = mk(900, 300); g = st.getContext("2d");
    const px = fitPx(g, vt, 760, 140, 900); font(g, 900, px); const tw = g.measureText(vt).width; const bw = Math.min(880, tw + 90), bh = px * 1.05 + 70;
    g.translate(450, 150); g.strokeStyle = "#e3152b"; g.lineWidth = 14; rr(g, -bw / 2, -bh / 2, bw, bh, 26); g.stroke(); g.lineWidth = 5; rr(g, -bw / 2 + 18, -bh / 2 + 18, bw - 36, bh - 36, 16); g.stroke();
    txt(g, vt, 0, 6, { w: 900, px, c: "#e3152b" });
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 900; i++) { const x = rnd(i * 1.37) * 900, y = rnd(i * 2.71) * 300, r = rnd(i * 4.13) ** 3 * 4 + 0.5; g.globalAlpha = 0.35 + rnd(i * 6.1) * 0.65; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    for (let i = 0; i < 8; i++) { g.globalAlpha = 0.25; g.lineWidth = 2 + rnd(i) * 4; g.beginPath(); const y = rnd(i * 9.7) * 300; g.moveTo(rnd(i * 3) * 300, y); g.lineTo(600 + rnd(i * 5) * 300, y + (rnd(i * 7) - 0.5) * 40); g.stroke(); }
    sc.st.stamp = st;
    const glow = mk(128, 128); g = glow.getContext("2d"); const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64); rg.addColorStop(0, "rgba(255,255,255,1)"); rg.addColorStop(0.25, "rgba(255,255,255,0.5)"); rg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
    sc.st.glow = glow;
  },
  draw(g, u, d, p, sc, P) {
    const T = hn_times(d); const st = sc.st; const tc = T.tc;
    const items = (p.items && p.items.length ? p.items : ["Lädt langsam", "Kein Anruf-Knopf", "Nicht fürs Handy"]).slice(0, 3);
    const stamped = u >= tc; const ks = u - tc;
    const scanOn = u < T.s1 + 0.05; const beamA = scanOn ? 1 : Math.max(0, 1 - (u - T.s1 - 0.05) / 0.15);
    const ys = T.yAt(Math.min(u, T.s1)); // Strahl im Display (y)
    const sh = stamped ? 26 * Math.exp(-ks / 0.09) : 0; const shx = Math.sin(u * 89) * sh, shy = Math.cos(u * 73) * sh;
    g.drawImage(st.bg, 0, 0);
    g.save(); g.translate(shx, shy);
    // Rotes Raumlicht vom Laser
    const la = beamA * (0.85 + 0.15 * Math.sin(u * 40));
    g.save(); g.globalCompositeOperation = "lighter";
    const gy = HN.cy - HN_SH / 2 + ys; g.globalAlpha = 0.45 * la; g.drawImage(st.glow, HN.cx - 560, gy - 260, 1120, 520);
    if (stamped) { g.globalAlpha = 0.35 * (0.6 + 0.4 * Math.sin(ks * 9)); g.drawImage(st.glow, HN.cx - 700, HN.cy - 600, 1400, 1200); }
    g.restore();
    // Handy (lokal: Ursprung = Mitte des Handys)
    g.save(); g.translate(HN.cx, HN.cy); g.rotate(HN.tilt);
    g.save(); g.fillStyle = "rgba(0,0,0,0.75)"; g.filter = "blur(26px)"; rr(g, -HN.w / 2 + 30, -HN.h / 2 + 50, HN.w, HN.h, 70); g.fill(); g.filter = "none"; g.restore();
    fillRR(g, -HN.w / 2, -HN.h / 2, HN.w, HN.h, 62, "#0d0d10");
    const fr = g.createLinearGradient(-HN.w / 2, -HN.h / 2, HN.w / 2, HN.h / 2); fr.addColorStop(0, "#6a6d78"); fr.addColorStop(0.35, "#1c1d22"); fr.addColorStop(0.65, "#2a2b31"); fr.addColorStop(1, "#7a7d88");
    g.strokeStyle = fr; g.lineWidth = 7; rr(g, -HN.w / 2 + 3, -HN.h / 2 + 3, HN.w - 6, HN.h - 6, 60); g.stroke();
    const X0 = -HN_SW / 2, Y0 = -HN_SH / 2;
    g.save(); rr(g, X0, Y0, HN_SW, HN_SH, 50); g.clip();
    g.drawImage(st.site, X0, Y0);
    // Ladekreisel dreht sich (Bereich 1)
    g.strokeStyle = "#4b5563"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.arc(0, Y0 + 270, 30, u * 7, u * 7 + 1.6); g.stroke();
    // Raum etwas abdunkeln, gescannter Teil rot getönt mit Raster
    g.fillStyle = "rgba(0,0,10,0.28)"; g.fillRect(X0, Y0, HN_SW, HN_SH);
    const done = Math.max(0, Math.min(HN_SH, ys));
    if (done > 0 && beamA > 0) {
      g.fillStyle = `rgba(255,20,40,${0.1 * beamA})`; g.fillRect(X0, Y0, HN_SW, done);
      g.strokeStyle = `rgba(255,70,80,${0.22 * beamA})`; g.lineWidth = 1;
      for (let y = Y0 + 4; y < Y0 + done; y += 8) { g.beginPath(); g.moveTo(X0, y); g.lineTo(X0 + HN_SW, y); g.stroke(); }
      for (let x = X0 + 10; x < X0 + HN_SW; x += 34) { g.beginPath(); g.moveTo(x, Y0); g.lineTo(x, Y0 + done); g.stroke(); }
    }
    // Fehlerrahmen mit Label
    for (let i = 0; i < 3; i++) {
      const th = T.hit[i]; const k = seg(u, th, th + 0.18); if (k <= 0) continue; const [a, b] = HN_ZONES[i]; const pop = outBack(k, 2.6);
      const fl = u < th + 0.3 ? (Math.floor((u - th) * 24) % 2 ? 0.55 : 1) : (stamped ? lerp(1, 0.4, cl(ks / 0.15)) : 1);
      g.save(); g.translate(0, Y0 + (a + b) / 2); g.scale(lerp(1.2, 1, pop), lerp(1.2, 1, pop));
      const hh = (b - a) - 12, ww = HN_SW - 22;
      g.globalAlpha = fl; g.fillStyle = "rgba(255,30,50,0.13)"; rr(g, -ww / 2, -hh / 2, ww, hh, 14); g.fill();
      g.shadowColor = "rgba(255,30,50,0.95)"; g.shadowBlur = 26; g.strokeStyle = "#ff2d46"; g.lineWidth = 6; rr(g, -ww / 2, -hh / 2, ww, hh, 14); g.stroke(); g.shadowBlur = 0;
      // Ecken
      g.strokeStyle = "#ffffff"; g.lineWidth = 6; g.lineCap = "round"; const c = 22;
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { g.beginPath(); g.moveTo(sx * ww / 2, sy * hh / 2 - sy * c); g.lineTo(sx * ww / 2, sy * hh / 2); g.lineTo(sx * ww / 2 - sx * c, sy * hh / 2); g.stroke(); }
      // Label
      const lab = String(items[i] || ""); const lpx = fitPx(g, lab, ww - 100, 38, 800); font(g, 800, lpx); const tw = g.measureText(lab).width; const pw = tw + 92, ph = lpx + 30;
      const ly = i === 0 ? 30 : 0; g.globalAlpha = stamped ? fl : 1;
      g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.shadowOffsetY = 8; fillRR(g, -pw / 2, ly - ph / 2, pw, ph, ph / 2, "#e8132d"); noShadow(g);
      // Warndreieck
      const tx = -pw / 2 + 36; g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(tx, ly - 15); g.lineTo(tx + 17, ly + 14); g.lineTo(tx - 17, ly + 14); g.closePath(); g.fill(); txt(g, "!", tx, ly + 4, { w: 900, px: 22, c: "#e8132d" });
      txt(g, lab, -pw / 2 + 64, ly + 2, { w: 800, px: lpx, c: "#ffffff", al: "left" });
      g.restore();
    }
    // Abdunkeln nach dem Urteil
    if (stamped) { g.fillStyle = `rgba(10,0,3,${0.5 * cl(ks / 0.15)})`; g.fillRect(X0, Y0, HN_SW, HN_SH); }
    g.restore();
    // Spiegelung auf dem Glas
    g.save(); rr(g, X0, Y0, HN_SW, HN_SH, 50); g.clip(); const rf = g.createLinearGradient(X0, Y0, X0 + HN_SW, Y0 + HN_SH * 0.6); rf.addColorStop(0, "rgba(255,255,255,0.09)"); rf.addColorStop(0.4, "rgba(255,255,255,0.02)"); rf.addColorStop(0.41, "rgba(255,255,255,0)"); g.fillStyle = rf; g.fillRect(X0, Y0, HN_SW, HN_SH); g.restore();
    fillRR(g, -58, Y0 + 14, 116, 32, 16, "#0d0d10");
    // Laser: Lichtfächer vom Sender, Strahl mit Glühen, Funken
    if (beamA > 0) {
      const ly = Y0 + ys; const ex = 0, ey = -HN.h / 2 - 150; const flick = 0.9 + 0.1 * Math.sin(u * 63);
      g.save(); g.globalCompositeOperation = "lighter";
      const cg = g.createLinearGradient(0, ey, 0, ly); cg.addColorStop(0, `rgba(255,40,60,${0.02 * beamA})`); cg.addColorStop(1, `rgba(255,40,60,${0.2 * beamA})`);
      g.fillStyle = cg; g.beginPath(); g.moveTo(ex - 6, ey); g.lineTo(ex + 6, ey); g.lineTo(HN.w / 2 + 70, ly); g.lineTo(-HN.w / 2 - 70, ly); g.closePath(); g.fill();
      for (const xx of [-1, -0.5, 0, 0.5, 1]) { g.strokeStyle = `rgba(255,80,90,${0.08 * beamA})`; g.lineWidth = 2; g.beginPath(); g.moveTo(ex, ey); g.lineTo(xx * (HN.w / 2 + 70), ly); g.stroke(); }
      // Strahl
      const bgw = g.createLinearGradient(0, ly - 46, 0, ly + 46); bgw.addColorStop(0, "rgba(255,0,30,0)"); bgw.addColorStop(0.5, `rgba(255,30,50,${0.75 * beamA * flick})`); bgw.addColorStop(1, "rgba(255,0,30,0)");
      g.fillStyle = bgw; g.fillRect(-HN.w / 2 - 140, ly - 46, HN.w + 280, 92);
      const lx = g.createLinearGradient(-HN.w / 2 - 140, 0, HN.w / 2 + 140, 0); lx.addColorStop(0, "rgba(255,120,130,0)"); lx.addColorStop(0.15, `rgba(255,210,215,${beamA})`); lx.addColorStop(0.85, `rgba(255,210,215,${beamA})`); lx.addColorStop(1, "rgba(255,120,130,0)");
      g.fillStyle = lx; g.fillRect(-HN.w / 2 - 140, ly - 2.5, HN.w + 280, 5);
      g.globalAlpha = beamA; g.drawImage(st.glow, -HN.w / 2 - 70, ly - 40, 80, 80); g.drawImage(st.glow, HN.w / 2 - 10, ly - 40, 80, 80);
      // Sender
      g.globalAlpha = beamA * flick; g.drawImage(st.glow, ex - 60, ey - 60, 120, 120); g.globalAlpha = 1;
      // Funken am Strahl
      for (let i = 0; i < 46; i++) {
        const life = 0.35 + rnd(i * 2.3) * 0.4; const ph = rnd(i * 5.1); const k = ((u / life + ph) % 1); const born = u - k * life; if (born < 0) continue;
        const by = Y0 + T.yAt(Math.min(born, T.s1)); const x = (rnd(i * 7.7 + Math.floor(u / life + ph)) - 0.5) * (HN.w + 40); const vx = (rnd(i * 3.9) - 0.5) * 160;
        const y = by + k * life * (60 + rnd(i) * 120) + 300 * (k * life) ** 2; const al = (1 - k) * beamA;
        g.strokeStyle = `rgba(255,${150 + (i % 4) * 25},${120 + (i % 3) * 30},${al})`; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x + vx * k * life, y); g.lineTo(x + vx * k * life - vx * 0.03, y - 14); g.stroke();
      }
      g.restore();
    }
    g.restore();
    // Stempel: kommt aus der Kamera, knallt bei tc
    if (u > tc - 0.2) {
      const k = cl((u - (tc - 0.2)) / 0.2); const s = stamped ? 1 + 0.08 * Math.exp(-ks / 0.05) * Math.cos(ks * 60) : lerp(3.2, 1, in3(k));
      const al = stamped ? 1 : 0.25 + 0.75 * k;
      g.save(); g.translate(HN.cx, HN.cy + 10); g.rotate(-0.21 + (stamped ? 0 : (1 - k) * 0.1)); g.scale(s, s);
      if (!stamped) { g.filter = `blur(${(1 - k) * 10}px)`; }
      g.globalAlpha = al; g.globalCompositeOperation = "source-over";
      g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = stamped ? 18 : 40; g.shadowOffsetY = stamped ? 6 : 30;
      g.drawImage(st.stamp, -450, -150); g.restore(); g.filter = "none";
      if (stamped) {
        // Staub und Tintenspritzer beim Aufprall
        for (let i = 0; i < 26; i++) { const a = rnd(i * 3.1) * Math.PI * 2, v = 200 + rnd(i * 5.7) * 600; const kk = cl(ks / 0.6); const r = v * out3(kk) * 0.6;
          g.fillStyle = `rgba(227,21,43,${(1 - kk) * 0.9})`; g.beginPath(); g.arc(HN.cx + Math.cos(a) * (360 + r), HN.cy + Math.sin(a) * (120 + r * 0.5), 4 + rnd(i) * 7 * (1 - kk), 0, 7); g.fill(); }
        const f = Math.exp(-ks / 0.07); if (f > 0.02) { g.fillStyle = `rgba(255,255,255,${0.35 * f})`; g.fillRect(0, 0, W, H); }
      }
    }
    if (u < 0.2) { const f = Math.exp(-u / 0.05); g.fillStyle = `rgba(255,40,60,${0.45 * f})`; g.fillRect(0, 0, W, H); }
    const vg = g.createRadialGradient(540, 870, 320, 540, 870, 1200); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.7)"); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  },
  ev(d, p) {
    const T = hn_times(d); const E = [[0, "scan_on", 1.0, 0]];
    for (let t = 0.05; t < T.s1 - 0.1; t += 0.4) E.push([t, "scan_hum", 0.55, 0]);
    T.hit.forEach((t, i) => E.push([t, "scan_warn", 0.85, [-0.3, 0.3, 0][i]]));
    E.push([T.s1 + 0.02, "scan_off", 0.6, 0]);
    E.push([T.tc - 0.22, "scan_drop", 0.7, 0]);
    E.push([T.tc, "scan_stamp", 1.0, 0]); E.push([T.tc + 0.02, "scan_buzzer", 0.85, 0]);
    return E;
  },
};
