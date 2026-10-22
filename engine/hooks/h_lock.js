// VOICE_DELAY: 0.6
// h_lock: Sicherheitsalarm. Riesige Adressleiste in 3D-Neigung, großes offenes Schloss in Rot, "Nicht sicher",
// Sirene ab 0,00 s, rotes Rundumlicht, Bildschirm pulsiert, Warnbanner rutscht ein, Schloss zittert.
// Parameter: warn ("Nicht sicher"), banner ("Diese Seite ist nicht sicher"), url ("ihre-firma.de"),
//            fix (false: Schloss schnappt am Ende zu und wird grün), ok ("Sicher"), banner_ok ("Jetzt geschützt").
for (const f of ["900 100px D", "800 100px D", "600 100px I", "500 100px I"]) document.fonts.load(f);
const LOCK_BW = 1560, LOCK_BH = 250, LOCK_F = 1700, LOCK_SIREN = 0.5;

function lock_times(d, p) {
  const fix = p.fix === true || p.fix === "true" || p.fix === 1;
  const peak = Math.max(1.2, d - 0.5);
  return { fix, peak };
}

// Adressleiste als flaches Bild (wird später in Streifen perspektivisch gezeichnet)
function lock_barImg(p, ok) {
  const c = document.createElement("canvas"); c.width = LOCK_BW; c.height = LOCK_BH; const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, LOCK_BH); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.55, "#eef1f6"); gr.addColorStop(1, "#d5dbe5");
  g.fillStyle = gr; rr(g, 2, 2, LOCK_BW - 4, LOCK_BH - 4, LOCK_BH / 2 - 2); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 4; rr(g, 6, 6, LOCK_BW - 12, LOCK_BH - 12, LOCK_BH / 2 - 6); g.stroke();
  g.strokeStyle = "rgba(60,70,90,0.25)"; g.lineWidth = 3; rr(g, 2, 2, LOCK_BW - 4, LOCK_BH - 4, LOCK_BH / 2 - 2); g.stroke();
  // Mulde für das Schloss
  const col = ok ? "#16a34a" : "#e0102a";
  const rg = g.createRadialGradient(170, LOCK_BH / 2, 10, 170, LOCK_BH / 2, 120); rg.addColorStop(0, hexA(col, 0.28)); rg.addColorStop(1, hexA(col, 0.06));
  g.fillStyle = rg; g.beginPath(); g.arc(170, LOCK_BH / 2, 104, 0, 7); g.fill();
  const warn = ok ? (p.ok || "Sicher") : (p.warn || "Nicht sicher");
  const px = fitPx(g, warn, 600, 108, 900);
  txt(g, warn, 320, LOCK_BH / 2 + 4, { w: 900, px, c: col, al: "left" });
  font(g, 900, px); const tw = g.measureText(warn).width;
  const x2 = 320 + tw + 44; g.fillStyle = "rgba(60,70,90,0.35)"; g.fillRect(x2, 62, 6, LOCK_BH - 124);
  const url = (p.url || "ihre-firma.de").replace(/^https?:\/\//, "");
  const pre = ok ? "https://" : "http://";
  txt(g, pre, x2 + 40, LOCK_BH / 2 + 4, { w: 600, px: 78, fam: "I", c: ok ? "#16a34a" : "#c81e33", al: "left" });
  font(g, 600, 78, "I"); const pw = g.measureText(pre).width;
  if (!ok) { g.fillStyle = "#c81e33"; g.fillRect(x2 + 36, LOCK_BH / 2 + 2, pw + 8, 7); }
  txt(g, url, x2 + 44 + pw, LOCK_BH / 2 + 4, { w: 500, px: 78, fam: "I", c: "#4b5568", al: "left" });
  return c;
}

function lock_bannerImg(p, ok) {
  const bw = 1180, bh = 150, c = document.createElement("canvas"); c.width = bw; c.height = bh; const g = c.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 0, bh);
  if (ok) { gr.addColorStop(0, "#22c55e"); gr.addColorStop(1, "#0f7a37"); } else { gr.addColorStop(0, "#ff3348"); gr.addColorStop(1, "#a50a1f"); }
  g.fillStyle = gr; g.fillRect(0, 0, bw, bh);
  // Warnstreifen oben und unten
  for (const y0 of [0, bh - 18]) {
    g.save(); g.beginPath(); g.rect(0, y0, bw, 18); g.clip(); g.fillStyle = ok ? "#0b3d1d" : "#111"; g.fillRect(0, y0, bw, 18);
    g.fillStyle = ok ? "#86efac" : "#ffd60a"; for (let x = -40; x < bw + 40; x += 44) { g.beginPath(); g.moveTo(x, y0 + 18); g.lineTo(x + 22, y0); g.lineTo(x + 44, y0); g.lineTo(x + 22, y0 + 18); g.closePath(); g.fill(); }
    g.restore();
  }
  g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(0, 18, bw, 4);
  // Symbol
  const ix = 120, iy = bh / 2;
  if (ok) { circle(g, ix, iy, 40, "#ffffff"); check(g, ix, iy + 2, 44, 1, "#15803d", 11); }
  else {
    g.fillStyle = "#ffd60a"; g.lineJoin = "round"; g.lineWidth = 12; g.strokeStyle = "#ffd60a";
    g.beginPath(); g.moveTo(ix, iy - 40); g.lineTo(ix + 44, iy + 36); g.lineTo(ix - 44, iy + 36); g.closePath(); g.stroke(); g.fill();
    txt(g, "!", ix, iy + 10, { w: 900, px: 64, c: "#1a0003" });
  }
  const s = ok ? (p.banner_ok || "Jetzt geschützt") : (p.banner || "Diese Seite ist nicht sicher");
  const px = fitPx(g, s, 840, 66, 800);
  shadow(g, 0, 4, "rgba(0,0,0,0.35)"); txt(g, s, 190, bh / 2 + 3, { w: 800, px, c: "#ffffff", al: "left" }); noShadow(g);
  return c;
}

// Schloss am Ursprung (Mitte des Körpers), open 0..1.15, green 0..1
function lock_draw(g, open, green) {
  const L = 82, lw = 46;
  // Bügel
  g.save();
  const lift = 92 * open;
  g.translate(L, -70 - lift); g.rotate(0.38 * Math.min(1, open)); g.translate(-L, 70);
  const leftBot = lerp(-40, -120, cl(open * 1.4));
  const path = () => { g.beginPath(); g.moveTo(-L, leftBot); g.lineTo(-L, -160); g.arc(0, -160, L, Math.PI, 0); g.lineTo(L, -40); };
  const mg = g.createLinearGradient(-L - lw / 2, 0, L + lw / 2, 0);
  [[0, "#6f7682"], [0.16, "#f7f8fa"], [0.32, "#a4abb6"], [0.5, "#5d646f"], [0.66, "#c9ced6"], [0.84, "#ffffff"], [1, "#7c838e"]].forEach(([o, c]) => mg.addColorStop(o, c));
  g.lineCap = "butt"; g.lineWidth = lw + 8; g.strokeStyle = "#2b2f36"; path(); g.stroke();
  g.lineWidth = lw; g.strokeStyle = mg; path(); g.stroke();
  g.save(); g.translate(-11, -4); g.lineWidth = 7; g.strokeStyle = "rgba(255,255,255,0.8)"; path(); g.stroke(); g.restore();
  g.save(); g.translate(13, 6); g.lineWidth = 5; g.strokeStyle = "rgba(0,0,0,0.25)"; path(); g.stroke(); g.restore();
  g.restore();
  // Körper
  const bx = -140, by = -100, bw = 280, bh = 228, r = 48;
  const body = (c0, c1, c2) => { const gr = g.createLinearGradient(0, by, 0, by + bh); gr.addColorStop(0, c0); gr.addColorStop(0.5, c1); gr.addColorStop(1, c2); g.fillStyle = gr; rr(g, bx, by, bw, bh, r); g.fill(); };
  shadow(g, 60, 30, "rgba(0,0,0,0.6)"); body("#ff6068", "#e3142c", "#8f0a1b"); noShadow(g);
  if (green > 0) { g.globalAlpha = green; body("#5cf08f", "#18a64b", "#0a5c2a"); g.globalAlpha = 1; }
  g.save(); rr(g, bx, by, bw, bh, r); g.clip();
  const gl = g.createLinearGradient(0, by, 0, by + bh * 0.55); gl.addColorStop(0, "rgba(255,255,255,0.42)"); gl.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gl; g.beginPath(); g.ellipse(-20, by + 10, 200, 92, -0.12, 0, Math.PI * 2); g.fill();
  const sd = g.createLinearGradient(0, by + bh * 0.6, 0, by + bh); sd.addColorStop(0, "rgba(0,0,0,0)"); sd.addColorStop(1, "rgba(0,0,0,0.3)"); g.fillStyle = sd; g.fillRect(bx, by, bw, bh);
  g.restore();
  g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 4; rr(g, bx + 5, by + 5, bw - 10, bh - 10, r - 5); g.stroke();
  // Schlüsselloch
  const kc = green > 0.5 ? "#04210f" : "#3d030c";
  g.fillStyle = kc; g.beginPath(); g.arc(0, -6, 30, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.moveTo(-14, 10); g.lineTo(14, 10); g.lineTo(24, 72); g.lineTo(-24, 72); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.28)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-24, 75); g.lineTo(24, 75); g.stroke();
  // Glanzpunkt
  const sp = g.createRadialGradient(-88, -62, 0, -88, -62, 34); sp.addColorStop(0, "rgba(255,255,255,0.95)"); sp.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = sp; g.fillRect(-130, -100, 90, 80);
}

function lock_proj(x, y, cx, cy, th, s) { const k = LOCK_F / (LOCK_F + x * Math.sin(th)); return [cx + x * Math.cos(th) * k * s, cy + y * k * s, k * s]; }

function lock_bar(g, img, cx, cy, th, s, a) {
  const N = 156, sw = LOCK_BW / N, sn = Math.sin(th), cs = Math.cos(th);
  g.globalAlpha = a;
  for (let i = 0; i < N; i++) {
    const x0 = -LOCK_BW / 2 + i * sw, x1 = x0 + sw; const s0 = LOCK_F / (LOCK_F + x0 * sn) * s, s1 = LOCK_F / (LOCK_F + x1 * sn) * s;
    const X0 = cx + x0 * cs * s0, X1 = cx + x1 * cs * s1; if (X1 < -10 || X0 > W + 10) continue;
    const h = LOCK_BH * (s0 + s1) / 2; g.drawImage(img, i * sw, 0, sw, LOCK_BH, X0, cy - h / 2, X1 - X0 + 0.9, h);
  }
  g.globalAlpha = 1;
}

TYPES.h_lock = {
  zone: "bottom", pal: "crimson", bgv: 0, coverT: 1.05,
  prep(sc, p) {
    sc.st.fok = document.fonts.check("900 100px D") && document.fonts.check("600 100px I");
    sc.st.barA = lock_barImg(p, false); sc.st.barB = lock_barImg(p, true);
    sc.st.banA = lock_bannerImg(p, false); sc.st.banB = lock_bannerImg(p, true);
  },
  draw(g, u, d, p, sc, P) {
    if (!sc.st.fok && document.fonts.check("900 100px D") && document.fonts.check("600 100px I")) this.prep(sc, p);
    const { fix, peak } = lock_times(d, p);
    const fixK = fix ? cl((u - peak) / 0.08) : 0;           // 0 = Alarm, 1 = grün
    const alarm = 1 - fixK;
    // ---------- Hintergrund ----------
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0d0105"); bg.addColorStop(0.5, "#2a0410"); bg.addColorStop(1, "#090103");
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (fixK > 0) { g.globalAlpha = fixK; const bg2 = g.createLinearGradient(0, 0, 0, H); bg2.addColorStop(0, "#010d07"); bg2.addColorStop(0.5, "#06301c"); bg2.addColorStop(1, "#010604"); g.fillStyle = bg2; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
    // Rasterboden (Tiefe)
    g.save(); g.strokeStyle = fixK > 0.5 ? "rgba(80,255,150,0.10)" : "rgba(255,60,80,0.10)"; g.lineWidth = 2; const hz = 1080;
    for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(540 + i * 40, hz); g.lineTo(540 + i * 260, H); g.stroke(); }
    for (let k = 0; k < 9; k++) { const y = hz + Math.pow((k + (u * 1.4) % 1) / 9, 2) * (H - hz); g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    g.restore();
    // Sirenen-Takt: hoher Ton zu Beginn jedes Zyklus
    const ph = (u % LOCK_SIREN) / LOCK_SIREN; const hi = ph < 0.5 ? 1 : 0;
    const pulse = alarm * (Math.exp(-(u % LOCK_SIREN) / 0.11) * 0.85 + 0.15 * hi);
    // Rundumlicht: zwei Lichtkegel drehen sich hinter der Leiste
    const lx = 560, ly = 860;
    if (alarm > 0) {
      g.save(); g.globalCompositeOperation = "lighter";
      const a0 = -Math.PI / 2 + u * Math.PI * 2 / (LOCK_SIREN * 2);
      for (let b = 0; b < 2; b++) {
        const a = a0 + b * Math.PI; const w = 0.3;
        const rg = g.createRadialGradient(lx, ly, 20, lx, ly, 1500); rg.addColorStop(0, `rgba(255,50,60,${0.75 * alarm})`); rg.addColorStop(0.35, `rgba(255,20,40,${0.32 * alarm})`); rg.addColorStop(1, "rgba(255,0,30,0)");
        g.fillStyle = rg; g.beginPath(); g.moveTo(lx, ly); g.arc(lx, ly, 1600, a - w, a + w); g.closePath(); g.fill();
        g.fillStyle = `rgba(255,120,120,${0.12 * alarm})`; g.beginPath(); g.moveTo(lx, ly); g.arc(lx, ly, 1600, a - w * 0.3, a + w * 0.3); g.closePath(); g.fill();
      }
      const core = g.createRadialGradient(lx, ly, 0, lx, ly, 520); core.addColorStop(0, `rgba(255,60,70,${(0.45 + 0.35 * pulse) * alarm})`); core.addColorStop(1, "rgba(255,0,20,0)");
      g.fillStyle = core; g.fillRect(0, 0, W, H);
      g.restore();
    }
    // Schwebende Funken im Licht
    for (let i = 0; i < 46; i++) {
      const x = (rnd(i * 3.1) * W + u * (20 + rnd(i) * 50)) % W, y = 470 + ((rnd(i * 7.3) * 900 - u * (40 + rnd(i * 2) * 90)) % 900 + 900) % 900;
      const r = 2 + rnd(i * 5) * 4; g.fillStyle = fixK > 0.5 ? `rgba(140,255,180,${0.25 + 0.4 * rnd(i)})` : `rgba(255,${120 + 80 * rnd(i * 9) | 0},120,${(0.25 + 0.5 * pulse) * rnd(i * 4)})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    // ---------- Kamera ----------
    const k0 = outExpo(seg(u, 0, 0.4));
    let shx = 0, shy = 0, shr = 0;
    const hitT = peak; if (u >= hitT && u < hitT + 0.45) { const a = (fix ? 14 : 22) * Math.exp(-(u - hitT) / 0.09); shx = Math.sin(u * 91) * a; shy = Math.cos(u * 77) * a; shr = Math.sin(u * 53) * a * 0.0015; }
    if (u < 0.3) { const a = 16 * Math.exp(-u / 0.07); shx += Math.sin(u * 97) * a; shy += Math.cos(u * 71) * a; }
    g.save(); g.translate(540 + shx, 900 + shy); g.rotate(-0.045 + shr); g.translate(-540, -900);
    const s = lerp(1.32, 0.94, k0) * (1 + 0.035 * seg(u, 0.4, d));
    const th = lerp(0.85, 0.40, k0) - 0.05 * inOut(seg(u, 0.4, d));
    const cx = lerp(800, 905, k0), cy = 900;
    // Schatten und Kante der Leiste
    const q = (x, y) => lock_proj(x, y, cx, cy, th, s);
    const B2 = LOCK_BW / 2 - 60, H2 = LOCK_BH / 2;
    g.save(); shadow(g, 90, 60, "rgba(0,0,0,0.75)"); g.fillStyle = "#1a1d24"; g.beginPath();
    [q(-B2, -H2 + 10), q(B2, -H2 + 10), q(B2, H2 + 20), q(-B2, H2 + 20)].forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill(); noShadow(g); g.restore();
    const ed = g.createLinearGradient(0, cy, 0, cy + 200); ed.addColorStop(0, "#a8b0bd"); ed.addColorStop(1, "#4a5160");
    g.fillStyle = ed; g.beginPath(); [q(-B2, H2 - 30), q(B2, H2 - 30), q(B2, H2 + 30), q(-B2, H2 + 30)].forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fill();
    lock_bar(g, sc.st.barA, cx, cy, th, s, 1);
    if (fixK > 0) lock_bar(g, sc.st.barB, cx, cy, th, s, fixK);
    // rotes Licht auf der Leiste + wandernder Glanz
    g.save(); g.beginPath(); [q(-B2 - 50, -H2 + 6), q(B2 + 50, -H2 + 6), q(B2 + 50, H2 - 6), q(-B2 - 50, H2 - 6)].forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.clip();
    if (alarm > 0) { g.fillStyle = `rgba(255,30,50,${0.22 * pulse})`; g.fillRect(0, 0, W, H); }
    const gx = -300 + ((u * 0.9) % 1.6) * 1500; const sh = g.createLinearGradient(gx - 120, 0, gx + 120, 0); sh.addColorStop(0, "rgba(255,255,255,0)"); sh.addColorStop(0.5, "rgba(255,255,255,0.55)"); sh.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = sh; g.save(); g.translate(0, 0); g.transform(1, 0, -0.5, 1, 450, 0); g.fillRect(gx - 140, 0, 280, H); g.restore();
    g.restore();
    // ---------- Schloss ----------
    const [lx0, ly0, ls] = q(-LOCK_BW / 2 + 170, 0);
    const lk = outBack(seg(u, 0.0, 0.45), 1.7);
    let open = 1, green = 0;
    const jit = alarm * (u < peak ? 1 : 0.4);
    open += 0.06 * Math.sin(u * 47) * jit;
    if (fix) {
      const a = seg(u, peak - 0.2, peak - 0.07), b = seg(u, peak - 0.07, peak);
      open = (1 + 0.14 * out3(a)) * (1 - inExpo(b)); if (u >= peak) open = -0.04 * Math.exp(-(u - peak) / 0.05) * Math.sin((u - peak) * 60);
      green = cl((u - peak) / 0.12);
    }
    let jump = 0; if (!fix) { const b = seg(u, peak - 0.18, peak); const c = seg(u, peak, peak + 0.4); jump = -70 * Math.sin(b * Math.PI / 2) * (1 - c) + 0 * c; if (u > peak) jump = -70 * (1 - outBack(c, 3)); }
    const lscale = ls * lerp(1.6, 1.16, lk) * (1 + 0.05 * pulse);
    const lshx = Math.sin(u * 71) * 7 * jit + Math.sin(u * 113) * 3 * jit, lrot = Math.sin(u * 53) * 0.05 * jit - 0.04;
    // Glühen hinter dem Schloss
    g.save(); g.globalCompositeOperation = "lighter"; const gc = fixK > 0 ? `rgba(40,255,120,${0.55 * fixK})` : `rgba(255,30,50,${0.35 + 0.4 * pulse})`;
    const glow = g.createRadialGradient(lx0, ly0 - 40, 10, lx0, ly0 - 40, 420 * ls); glow.addColorStop(0, gc); glow.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = glow; g.fillRect(0, 0, W, H); g.restore();
    g.save(); g.translate(lx0 + lshx, ly0 + 10 + jump); g.rotate(lrot); g.scale(lscale, lscale); lock_draw(g, open, green); g.restore();
    // Schockwelle am Höhepunkt
    if (u >= peak) { const k = (u - peak) / 0.55; shock(g, lx0, ly0, k, fix ? "rgba(80,255,150,A)" : "rgba(255,70,80,A)", 700, 3); }
    if (fix && u > peak) sparkles(g, lx0, ly0 - 60, u - peak, 18, 260, "#b9ffd2", 21);
    g.restore();
    // ---------- Banner ----------
    const bk = seg(u, 0.26, 0.56); if (bk > 0) {
      const e = outBack(bk, 1.25); const by = 1170; const bx = lerp(-1250, -50, e);
      const v = (1 - out3(bk)) * 900;
      g.save(); g.translate(540, by); g.rotate(-0.035 + 0.02 * (1 - e)); g.translate(-540, -by);
      shadow(g, 40, 20, "rgba(0,0,0,0.55)");
      for (let gh = 3; gh >= 0; gh--) { if (gh && v < 40) continue; g.globalAlpha = gh ? 0.18 / gh : 1; g.drawImage(sc.st.banA, bx - gh * v * 0.06, by - 75); if (!gh) noShadow(g); }
      if (fixK > 0) { g.globalAlpha = fixK; g.drawImage(sc.st.banB, bx, by - 75); }
      g.globalAlpha = 1;
      // Aufblitzen beim Einrasten
      const fl = 1 - seg(u, 0.5, 0.7); if (fl > 0 && bk >= 1) { g.fillStyle = `rgba(255,255,255,${0.35 * fl})`; g.fillRect(bx, by - 75, 1180, 150); }
      g.restore();
    }
    // ---------- Bildschirm pulsiert ----------
    if (alarm > 0) {
      g.fillStyle = `rgba(255,0,30,${0.13 * pulse})`; g.fillRect(0, 0, W, H);
      const vg = g.createRadialGradient(540, 900, 380, 540, 900, 1250); vg.addColorStop(0, "rgba(255,0,30,0)"); vg.addColorStop(1, `rgba(255,0,30,${0.6 * pulse + 0.15})`);
      g.fillStyle = vg; g.fillRect(0, 0, W, H);
    }
    // Blitz beim Knall
    if (u >= peak) { const f = 1 - seg(u, peak, peak + 0.22); if (f > 0) { g.fillStyle = fix ? `rgba(200,255,220,${0.55 * f})` : `rgba(255,80,90,${0.45 * f})`; g.fillRect(0, 0, W, H); } }
    if (u < 0.12) { g.fillStyle = `rgba(255,60,70,${0.5 * (1 - u / 0.12)})`; g.fillRect(0, 0, W, H); }
  },
  ev(d, p) {
    const { fix, peak } = lock_times(d, p);
    const E = [[0, "lock_hit", 1.0, 0], [0.02, "lock_rattle", 0.6, -0.3]];
    const end = fix ? peak - 0.08 : d + 0.1;
    let i = 0;
    for (let t = 0; t < end - 0.02; t += LOCK_SIREN, i++) {
      const vol = i < 2 ? 0.95 : 0.6;
      if (t + LOCK_SIREN <= end + 0.01) E.push([t, "lock_siren", vol, 0]); else if (t + LOCK_SIREN / 2 <= end + 0.05) E.push([t, "lock_siren_hi", vol, 0]);
    }
    E.push([0.27, "lock_swish", 0.7, -0.4], [0.47, "lock_slam", 0.75, 0]);
    if (fix) { E.push([peak - 0.2, "lock_lift", 0.6, -0.2], [peak, "lock_click", 1.0, -0.15], [peak + 0.03, "lock_ok", 0.8, 0]); }
    else { E.push([peak - 0.18, "lock_rattle", 0.6, -0.3], [peak, "lock_hit", 0.9, 0]); }
    return E;
  },
};
