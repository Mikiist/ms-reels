// VOICE_DELAY: 8.5
// h_galton: Objekt-Reel über das ganze Video (Look "objekt"). Stahlkugeln klickern durch ein Galton-Brett.
// 0 bis ca. 8 s ohne Stimme: 36 Kugeln, Frage oben „Wie viele landen bei Ihnen?“, letzte Kugel in Zeitlupe fast im Ziel, verfehlt.
// Mit der Stimme: bei „woanders“ Schilder an den Stiften, bei „Ich“ (baue) drehen sich die Stifte zu Schienen,
// die Fächer leeren sich, dann rollen 26 Kugeln alle in „IHR BETRIEB“. Am Ende Kamerafahrt ins Fach.
// Parameter: target (Fachname, Standard "IHR BETRIEB"), rest ("WOANDERS"), tags (3 Schilder), w_tags / w_build (Wortanfänge, Standard "woanders" / "ich").
(() => {
  const CX = 540, ROW0 = 505, DY = 68, DX = 90, ROWS = 9, BR = 17, PR = 10, FLOOR = 1480, BIN_TOP = 1125, HOP = 360, LAST = ROWS;
  const N1 = 34, REL0 = 0.0, RELD = 0.125, NM_REL = 4.6, RATE = 0.16, N2 = 20, REL2D = 0.085;
  const slotX = (k) => CX + (k - ROWS / 2) * DX;
  const pinX = (r, j) => CX + (j - r / 2) * DX, pinY = (r) => ROW0 + r * DY;
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");

  // Bahn einer Kugel: Liste von Abschnitten {s0, s1, x0, y0, x1, y1, hop, fall}
  function path(rel, dirs, slide, rowDur) {
    const segs = []; let s = rel; const xs = CX + (rnd(rel * 13.7) - 0.5) * 10;
    segs.push({ s0: s, s1: s + 0.24, x0: xs, y0: HOP, x1: CX, y1: pinY(0) - PR - BR, fall: true }); s += 0.24;
    let j = 0; const hits = [];
    for (let r = 0; r < ROWS; r++) {
      hits.push({ s, x: pinX(r, j), r });
      const right = dirs[r]; const nj = j + (right ? 1 : 0); const d = rowDur(r);
      const x1 = r + 1 < ROWS ? pinX(r + 1, nj) : slotX(nj); const y1 = r + 1 < ROWS ? pinY(r + 1) - PR - BR : BIN_TOP - 30;
      segs.push({ s0: s, s1: s + d, x0: pinX(r, j), y0: pinY(r) - PR - BR, x1, y1, hop: slide ? 0 : 15 }); s += d; j = nj;
    }
    return { segs, hits, slot: j, s };
  }
  function finish(b, tx, ty) { // Fall ins Fach bis auf den Stapel
    const last = b.segs[b.segs.length - 1]; const dist = ty - last.y1; const d = 0.1 + Math.sqrt(Math.max(1, dist) / 1500);
    b.segs.push({ s0: b.s, s1: b.s + d, x0: last.x1, y0: last.y1, x1: tx, y1: ty, fall: true }); b.land = b.s + d; b.tx = tx; b.ty = ty;
  }
  function stackPos(slot, n, wide) { const col = n % 2, layer = Math.floor(n / 2); return [slotX(slot) + (col ? 1 : -1) * (BR + 0.5) + (layer % 2 ? 2 : -2), FLOOR - BR - layer * (2 * BR - 1)]; }
  function pos(b, s) {
    if (s < b.segs[0].s0) return null;
    for (const g of b.segs) if (s < g.s1) { const k = cl((s - g.s0) / (g.s1 - g.s0)); const e = g.fall ? k * k : k;
      return [lerp(g.x0, g.x1, g.fall ? k : k), lerp(g.y0, g.y1, e) - (g.hop ? g.hop * 4 * k * (1 - k) : 0)]; }
    return [b.tx, b.ty];
  }

  TYPES.h_galton = {
    zone: "bottom", pal: "o_cream", bgv: 0, coverT: 3.4,
    prep(o, p) {
      const words = (SPEC.words || []); const find = (pre, after = 0) => { const w = words.find((x) => x.t >= after && norm(x.w).startsWith(pre)); return w ? w.t : null; };
      // Lauf 1 (Simulationszeit), letzte Kugel ist die Beinahe-Kugel
      const run1 = [];
      for (let i = 0; i < N1; i++) {
        const nm = i === N1 - 1; const dirs = [];
        for (let r = 0; r < ROWS; r++) dirs.push(nm ? r < ROWS - 1 : rnd(i * 31.7 + r * 7.3 + 1) < 0.5);
        if (!nm && dirs.every(Boolean)) dirs[ROWS - 1] = false;
        const b = path(nm ? NM_REL : REL0 + i * RELD, dirs, false, (r) => 0.118 - r * 0.002); b.nm = nm; run1.push(b);
      }
      // Stapel in Reihenfolge der Ankunft
      const cnt = new Array(ROWS + 1).fill(0);
      run1.slice().sort((a, b) => a.s - b.s).forEach((b) => { const [tx, ty] = stackPos(b.slot, cnt[b.slot]++); finish(b, tx, ty); b.layer = Math.floor((cnt[b.slot] - 1) / 2); });
      const nm = run1[N1 - 1]; const A = nm.hits[ROWS - 3].s - 0.02, B = nm.hits[ROWS - 1].s + 0.09;
      const real = (s) => (s < A ? s : s < B ? A + (s - A) / RATE : A + (B - A) / RATE + (s - B));
      const uStop = real(nm.land);
      // Wortzeiten für Phase 2 und 3
      const tM = find(norm(p.w_person || "mensch"), uStop) || uStop + 0.9;
      const tW = find(norm(p.w_tags || "schwach"), uStop) || uStop + 2.4;
      const tI = find(norm(p.w_build || "ich"), tW) || tW + 1.2;
      const uRel2 = tI + 1.35;
      const run2 = []; let c2 = 0;
      for (let i = 0; i < N2; i++) { const b = path(uRel2 + i * REL2D, new Array(ROWS).fill(true), true, () => 0.07); const [tx, ty] = stackPos(LAST, c2++); finish(b, tx, ty); run2.push(b); }
      p._g = { run1, run2, A, B, real, uStop, tM, tW, tI, uRel2, sim: (u) => (u < A ? u : u < A + (B - A) / RATE ? A + (u - A) * RATE : B + (u - (A + (B - A) / RATE))) };
    },
    draw(g, u, d, p, sc, P) {
      const G = p._g; const s1 = G.sim(u);
      background(g, P, u, sc);
      // Kamera: in der Zeitlupe zur Beinahe-Kugel, am Ende ins Ziel-Fach
      const slow = u >= G.A && u < G.real(G.B) + 0.15; const sk = u >= G.A && u < G.uStop ? inOut(cl((u - G.A) / 0.6)) * (1 - cl((u - (G.uStop - 0.3)) / 0.3)) : 0;
      const nmP = pos(G.run1[N1 - 1], s1) || [CX, HOP]; const endK = inOut(cl((u - (d - 0.6)) / 0.6));
      let fx = 540, fy = 960, zs = 1;
      if (sk > 0) { fx = lerp(540, nmP[0], 0.6 * sk); fy = lerp(960, nmP[1], 0.6 * sk); zs = 1 + 0.22 * sk; }
      if (endK > 0) { fx = lerp(540, slotX(LAST), endK); fy = lerp(960, 1300, endK); zs = 1 + 2.3 * endK * endK; }
      g.save(); g.translate(540, 960); g.scale(zs, zs); g.translate(-fx, -fy);
      // Brett
      shadow(g, 60, 24, "rgba(70,50,20,0.16)"); fillRR(g, 66, 290, 948, 1225, 46, "#fbf8f3"); noShadow(g);
      g.strokeStyle = "rgba(0,0,0,0.07)"; g.lineWidth = 2; rr(g, 66, 290, 948, 1225, 46); g.stroke();
      // Trichter
      g.strokeStyle = "#cbbfae"; g.lineWidth = 10; g.lineCap = "round"; g.beginPath(); g.moveTo(400, 330); g.lineTo(512, 420); g.moveTo(680, 330); g.lineTo(568, 420); g.stroke();
      // Stifte (drehen sich ab tI zu Schienen nach rechts unten)
      for (let r = 0; r < ROWS; r++) { const rk = inOut(cl((u - G.tI - 0.1 - r * 0.09) / 0.28));
        for (let j = 0; j <= r; j++) { const x = pinX(r, j), y = pinY(r);
          g.save(); g.translate(x, y + 1); g.rotate(rk * Math.atan2(DY, DX / 2)); const L = lerp(PR * 2, 46, rk);
          shadow(g, 6, 3, "rgba(60,40,10,0.35)"); const gr = g.createLinearGradient(0, -PR, 0, PR); gr.addColorStop(0, "#f3d58f"); gr.addColorStop(0.5, "#c8932f"); gr.addColorStop(1, "#7a5517");
          g.fillStyle = gr; rr(g, -L / 2, -PR, L, PR * 2, PR); g.fill(); noShadow(g); g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(-L / 2 + PR * 0.8, -PR * 0.35, PR * 0.45, PR * 0.28, -0.4, 0, 7); g.fill(); g.restore(); } }
      // Fächer
      const open = cl((u - G.tI - 0.15) / 0.12) * (1 - cl((u - G.tI - 1.0) / 0.15));
      for (let k = 0; k <= ROWS + 1; k++) { const x = CX + (k - ROWS / 2 - 0.5) * DX; g.fillStyle = "rgba(120,105,85,0.28)"; g.fillRect(x - 1.5, BIN_TOP, 3, FLOOR - BIN_TOP); }
      const tg = slotX(LAST); const glow = cl(G.run2.filter((b) => u >= b.land).length / 6);
      g.save(); g.strokeStyle = hexA(P.acc, 0.6 + 0.4 * glow); g.lineWidth = 4; shadow(g, 24 * glow, 0, hexA(P.acc, 0.8)); rr(g, tg - DX / 2 + 3, BIN_TOP - 6, DX - 6, FLOOR - BIN_TOP + 12, 10); g.stroke(); noShadow(g); g.restore();
      for (let k = 0; k <= ROWS; k++) { const x = slotX(k); g.save(); g.translate(x - DX / 2 + 4, FLOOR + 4); g.rotate(open * 1.25); g.fillStyle = "#b9ab96"; g.fillRect(0, 0, DX - 8, 5); g.restore(); }
      // Kugeln
      const balls = [];
      G.run1.forEach((b, i) => { let q = pos(b, s1); if (!q) return; if (u > G.tI + 0.15 && s1 >= b.land) { const tt = u - G.tI - 0.15 - (12 - b.layer) * 0.012; if (tt > 0) q = [q[0], q[1] + 1800 * tt * tt]; }
        const pk = s1 >= b.land ? cl((u - G.tM - (i % 9) * 0.035) / 0.22) : 0; if (q[1] < 2000) balls.push([q[0], q[1], pk, i]); });
      for (const b of G.run2) { const q = pos(b, u); if (q) balls.push([q[0], q[1], 0, 0]); }
      for (const [x, y, pk, i] of balls) { if (pk <= 0) { steel(g, x, y, BR); continue; } // Kugel klappt um und wird zum Menschen
        const sxk = Math.abs(Math.cos(pk * Math.PI)); g.save(); g.translate(x, y); g.scale(Math.max(0.04, sxk), 1); if (pk < 0.5) steel(g, 0, 0, BR); else person(g, 0, 0, BR, i); g.restore(); }
      g.restore();
      // Schilder bei „woanders“
      const TAGS = p.tags || ["Lädt ewig", "Kein Anruf-Knopf", "Am Handy kaputt"]; const tagK = cl((u - G.tW) / 0.25) * (1 - cl((u - G.tI + 0.1) / 0.25));
      if (tagK > 0 && !endK) TAGS.forEach((t, i) => { const r = [2, 5, 7][i]; const ax = pinX(r, r), ay = pinY(r); const kk = outBack(cl((u - G.tW - i * 0.18) / 0.3), 2) * tagK; if (kk <= 0) return;
        const tx = 1035, ty = ay - 46; g.save(); g.globalAlpha = cl(kk); g.strokeStyle = "#e5484d"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(ax + 10, ay); g.lineTo(tx - 250, ty + 20); g.stroke(); circle(g, ax, ay, 14 * kk, "rgba(229,72,77,0.25)");
        font(g, 600, 30, "I"); const w = g.measureText(t).width + 36; g.translate(tx - w / 2, ty); g.scale(kk, kk); shadow(g, 18, 6, "rgba(0,0,0,0.15)"); fillRR(g, -w / 2, -26, w, 52, 12, "#ffffff"); noShadow(g);
        txt(g, t, 0, 1, { w: 600, px: 30, fam: "I", c: "#c62f35" }); g.restore(); });
      // Zähler unter den Fächern
      if (!endK) { const n1 = G.run1.filter((b) => s1 >= b.land).length * (u > G.tI + 0.2 ? 1 - cl((u - G.tI - 0.2) / 0.6) : 1); const n2 = G.run2.filter((b) => u >= b.land).length;
        const fl = u >= G.uStop && u < G.uStop + 0.9 ? Math.floor((u - G.uStop) * 8) % 2 : 0;
        txt(g, p.rest || "WOANDERS", 500, 1555, { w: 600, px: 26, fam: "I", c: P.sub, ls: 6 }); txt(g, String(Math.round(n1)), 500, 1606, { w: 800, px: 52, c: P.fg });
        txt(g, p.target || "IHR BETRIEB", slotX(LAST) - 20, 1555, { w: 700, px: 26, fam: "I", c: P.acc, ls: 4 }); txt(g, String(n2), slotX(LAST) - 20, 1606, { w: 900, px: 52, c: fl ? "#e5484d" : n2 ? P.acc : P.fg }); }
      // HUD wie eine Kamera
      g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 3; const C = 46;
      for (const [x, y, sx, sy] of [[60, 70, 1, 1], [1020, 70, -1, 1], [60, 1850, 1, -1], [1020, 1850, -1, -1]]) { g.beginPath(); g.moveTo(x, y + sy * C); g.lineTo(x, y); g.lineTo(x + sx * C, y); g.stroke(); }
      const f = Math.floor(u * 30 + 1e-6); circle(g, 92, 112, 9, Math.floor(u * 2) % 2 ? "rgba(229,72,77,0.35)" : "#e5484d");
      txt(g, `REC  00:00:${String(Math.floor(f / 30)).padStart(2, "0")}:${String(f % 30).padStart(2, "0")}`, 112, 113, { w: 600, px: 24, fam: "I", c: "rgba(0,0,0,0.55)", al: "left", ls: 2 });
      txt(g, slow ? "1000 FPS" : "60 FPS", 990, 113, { w: 700, px: 24, fam: "I", c: slow ? "#e5484d" : "rgba(0,0,0,0.55)", al: "right", ls: 2 });
      const hq = (SPEC.hook_text || "Wie viele landen bei Ihnen?").replace(/\*/g, ""); const hk = 1 - cl((u - G.uStop - 0.2) / 0.4);
      if (hk > 0) { g.save(); g.globalAlpha = hk; txt(g, hq, 540, 215, { w: 700, px: 54, c: P.fg }); g.restore(); }
      if (slow) { const vg = g.createRadialGradient(540, 960, 500, 540, 960, 1200); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${0.22 * sk})`); g.fillStyle = vg; g.fillRect(0, 0, W, H); }
      if (endK > 0) { g.fillStyle = `rgba(245,240,233,${cl((endK - 0.55) / 0.45)})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) {
      const G = p._g; const E = [];
      for (const b of G.run1) { const slowB = b.nm;
        b.hits.forEach((h) => { const u = G.real(h.s); const inSlow = h.s >= G.A && h.s < G.B; E.push([u, inSlow ? "gpinslow" : "gpin" + (Math.floor(rnd(h.s * 91 + h.x) * 6)), inSlow ? 0.9 : 0.32 + 0.2 * rnd(h.s * 7), (h.x - CX) / 540 * 0.7]); });
        E.push([G.real(b.land), slowB ? "gland_big" : "gland", slowB ? 0.9 : 0.42, (b.tx - CX) / 540 * 0.7]); }
      E.push([G.A, "gslow", 0.8, 0]); E.push([G.uStop + 0.02, "thump", 0.8, 0]); E.push([G.uStop + 0.05, "gstop", 0.7, 0]);
      [0, 1, 2].forEach((i) => E.push([G.tW + i * 0.18, "pop", 0.22, 0.4]));
      for (let i = 0; i < 9; i++) E.push([G.tM + i * 0.035 + 0.11, "gpin" + (i % 6), 0.14, (i - 4) / 6]); E.push([G.tM + 0.1, "shimmer", 0.2, 0]);
      for (let r = 0; r < ROWS; r++) E.push([G.tI + 0.1 + r * 0.09 + 0.2, "gratchet", 0.4, (r - 4.5) / 10]);
      E.push([G.tI + 0.15, "gdoor", 0.6, 0]); for (let i = 0; i < 14; i++) E.push([G.tI + 0.3 + rnd(i * 3.1) * 0.6, "gland", 0.18 + rnd(i) * 0.12, (rnd(i * 5.3) - 0.5) * 1.2]); E.push([G.tI + 1.0, "gdoor", 0.4, 0]);
      G.run2.forEach((b, i) => { b.hits.forEach((h, k) => { if (k % 2 === 0) E.push([h.s, "gpin" + (k % 6), 0.1, (h.x - CX) / 540 * 0.7]); });
        E.push([b.land, "gland", 0.32, 0.6]); if (i % 3 === 0) E.push([b.land + 0.01, "ding", 0.18, 0.5]); });
      return E.filter((e) => e[0] < d + 0.1);
    },
  };

  function person(g, x, y, r, i) { // kleiner Mensch auf farbiger Scheibe
    const C = ["#f4a259", "#5b8def", "#e5484d", "#30a46c", "#8e4ec6", "#f2c94c", "#0ea5e9", "#d6409f"]; const c = C[i % C.length];
    g.fillStyle = "rgba(60,40,15,0.18)"; g.beginPath(); g.ellipse(x + 4, y + 6, r, r * 0.95, 0, 0, 7); g.fill();
    circle(g, x, y, r, c); g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip(); g.fillStyle = "rgba(255,255,255,0.95)";
    g.beginPath(); g.arc(x, y - r * 0.22, r * 0.34, 0, 7); g.fill(); g.beginPath(); g.ellipse(x, y + r * 0.78, r * 0.62, r * 0.48, 0, Math.PI, 0); g.fill(); g.restore();
  }
  function steel(g, x, y, r) { // Stahlkugel mit Schatten, Spiegelung und Glanzpunkt
    g.fillStyle = "rgba(60,40,15,0.18)"; g.beginPath(); g.ellipse(x + 4, y + 6, r * 1.02, r * 0.95, 0, 0, 7); g.fill();
    const gr = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r * 1.05); gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.25, "#d9dde3"); gr.addColorStop(0.6, "#8d949e"); gr.addColorStop(0.85, "#4b5059"); gr.addColorStop(1, "#2a2d33");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.fillStyle = "rgba(255,240,215,0.35)"; g.beginPath(); g.ellipse(x, y + r * 0.45, r * 0.75, r * 0.22, 0, 0, 7); g.fill();
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x - r * 0.38, y - r * 0.42, r * 0.2, 0, 7); g.fill();
  }
})();
