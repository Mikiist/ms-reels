// motion_kit: Premium-Motion-Design ab 04.11.2026 (Mihajlo: „modern, sanft, große Handys, Terminal, Glas-Karten“).
// Echte 3D-Ebenen: jede Ebene ist ein eigenes DOM-Element (Canvas oder Glas-Div) im Szenen-Layer mit CSS-Perspektive,
// weichem Tiefenschatten und Glas-Unschärfe (backdrop-filter). Jeder sichtbare Text kommt aus den Parametern und wird gesprochen.
// Szenen: m_phone (Handy: orders, web, chat, search), m_ipad (Bestellterminal), m_cards (Glas-Karten), m_word (großes Wort),
// Schlüsse im Wechsel: m_end_comment (Handy, Kommentar WEBSITE), m_end_card (Glas-Karte mit Name), m_end_word (Riesen-Stichwort).
const MK = (() => {
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  // Zeitpunkt (Sekunden seit Szenenstart), an dem der Text gesprochen wird (erstes Wort), sonst def
  function when(o, text, after = 0, def = null) {
    const ws = (SPEC.words || []).filter((w) => w.scene === o.i); const first = norm(String(text).split(/\s+/).find((x) => norm(x)) || "");
    if (!first) return def; const w = ws.find((x) => x.t - o.t0 >= after - 1e-6 && (norm(x.w) === first || norm(x.w).startsWith(first) || first.startsWith(norm(x.w)) && norm(x.w).length > 2));
    return w ? w.t - o.t0 : def;
  }
  function times(o, list, gap = 0.6, start = 0.25) { const T = []; let after = 0; list.forEach((t, i) => { const v = when(o, t, after, (T[i - 1] ?? start - gap) + gap); T.push(v); after = v + 0.05; }); return T; }
  // ---------- DOM-Ebenen ----------
  function panel(o, key, w, h, opt = {}) {
    if (o.st[key]) return o.st[key];
    const el = document.createElement("div"); el.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${h}px;transform-origin:50% 50%;will-change:transform;`;
    if (opt.glass) { el.style.borderRadius = (opt.r || 48) + "px"; el.style.background = opt.light ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.09)";
      el.style.backdropFilter = "blur(30px) saturate(1.5)"; el.style.border = opt.light ? "1.5px solid rgba(255,255,255,0.9)" : "1.5px solid rgba(255,255,255,0.22)";
      el.style.boxShadow = opt.light ? "0 40px 90px rgba(30,40,80,0.18)" : "0 50px 110px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25)"; }
    else if (opt.shadow !== false) el.style.filter = `drop-shadow(0 ${opt.sy || 60}px ${opt.sb || 70}px rgba(0,0,0,${opt.sa || 0.5}))`;
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.style.cssText = `position:absolute;left:0;top:0;width:${w}px;height:${h}px;inset:auto;`;
    el.appendChild(cv); o.inner.appendChild(el); const rec = { el, cv, g: cv.getContext("2d"), w, h }; o.st[key] = rec; return rec;
  }
  function place(rec, x, y, t = {}) {
    const { rx = 0, ry = 0, rz = 0, s = 1, op = 1, persp = 2200 } = t;
    rec.el.style.transform = `translate(${x - rec.w / 2}px,${y - rec.h / 2}px) perspective(${persp}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${s})`;
    rec.el.style.opacity = String(cl(op)); rec.el.style.visibility = op <= 0.001 ? "hidden" : "visible";
  }
  // ---------- Zeichnen ----------
  function rrp(g, x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
  function phoneBody(g, w, h, dark = true) { // Handy-Rahmen, gibt Bildschirm-Rechteck zurück
    g.clearRect(0, 0, w, h); const r = w * 0.15;
    const fr = g.createLinearGradient(0, 0, w, h); fr.addColorStop(0, "#3b3f4a"); fr.addColorStop(0.45, "#16181d"); fr.addColorStop(1, "#4a4f5c");
    g.fillStyle = fr; rrp(g, 0, 0, w, h, r); g.fill(); g.fillStyle = "#0a0b0e"; rrp(g, 7, 7, w - 14, h - 14, r - 6); g.fill();
    const m = 20, sx = m, sy = m, sw = w - 2 * m, sh = h - 2 * m; g.save(); rrp(g, sx, sy, sw, sh, r - 16); g.clip();
    g.fillStyle = dark ? "#0b1020" : "#f6f7fb"; g.fillRect(sx, sy, sw, sh); g.restore();
    return { x: sx, y: sy, w: sw, h: sh, r: r - 16 };
  }
  function island(g, S) { g.fillStyle = "#000"; rrp(g, S.x + S.w / 2 - 70, S.y + 18, 140, 40, 20); g.fill(); }
  function glare(g, w, h, k) { const gx = lerp(-w, w * 2, k); const gr = g.createLinearGradient(gx - 200, 0, gx + 200, h); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,0.10)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  function t(g, s, x, y, o = {}) { g.font = `${o.w || 700} ${o.px || 40}px ${o.f || "I"}`; g.fillStyle = o.c || "#fff"; g.textAlign = o.al || "left"; g.textBaseline = "middle"; if (o.ls) g.letterSpacing = o.ls + "px"; g.fillText(s, x, y); if (o.ls) g.letterSpacing = "0px"; }
  function fit(g, s, maxW, px, w = 700, f = "I") { g.font = `${w} ${px}px ${f}`; const m = g.measureText(s).width; return m > maxW ? Math.floor(px * maxW / m) : px; }
  function icon(g, kind, x, y, r, c) { // kleine, saubere Icons
    g.save(); g.translate(x, y); g.fillStyle = c; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.strokeStyle = "#fff"; g.fillStyle = "#fff"; g.lineWidth = r * 0.16; g.lineCap = "round"; g.lineJoin = "round";
    if (kind === "check") { g.beginPath(); g.moveTo(-r * 0.4, 0); g.lineTo(-r * 0.1, r * 0.32); g.lineTo(r * 0.45, -r * 0.35); g.stroke(); }
    else if (kind === "bag") { rrp(g, -r * 0.42, -r * 0.2, r * 0.84, r * 0.62, r * 0.12); g.fill(); g.strokeStyle = "#fff"; g.beginPath(); g.arc(0, -r * 0.2, r * 0.24, Math.PI, 0); g.stroke(); }
    else if (kind === "star") { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * 0.25 : r * 0.55; g.lineTo(Math.cos(a) * q, Math.sin(a) * q); } g.closePath(); g.fill(); }
    else if (kind === "pin") { g.beginPath(); g.arc(0, -r * 0.12, r * 0.32, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(0, -r * 0.12, r * 0.13, 0, 7); g.fill(); }
    else if (kind === "x") { g.beginPath(); g.moveTo(-r * 0.32, -r * 0.32); g.lineTo(r * 0.32, r * 0.32); g.moveTo(r * 0.32, -r * 0.32); g.lineTo(-r * 0.32, r * 0.32); g.stroke(); }
    g.restore();
  }
  const ACC = "#2563eb", ACC2 = "#7c3aed", OK = "#16a34a", WARN = "#ef4444";
  return { norm, when, times, panel, place, rrp, phoneBody, island, glare, t, fit, icon, ACC, ACC2, OK, WARN };
})();

// ---------- m_phone: großes 3D-Handy ----------
// params: screen ("orders" | "web" | "chat" | "search"), title (Kopfzeile), items (orders: [[Titel, Unterzeile]], chat: [["kunde"|"bot", Text]],
// search: [[Name, Unterzeile]] (letzter = Ihr Betrieb, rutscht nach oben)), headline + button (web), query (search), side (-1 links / 1 rechts kippen)
TYPES.m_phone = {
  zone: "top", pal: "m_dark", bgv: 0, capY: 300,
  prep(o, p) { const it = p.items || []; const lab = it.map((x) => (Array.isArray(x) ? (p.screen === "chat" ? x[1] : x[0]) : x));
    const T = { items: MK.times(o, lab, 0.7, 0.5) }; T.head = p.headline ? MK.when(o, p.headline, 0, 0.6) : 0.6; T.btn = p.button ? MK.when(o, p.button, 0, T.head + 1) : null;
    T.query = p.query ? MK.when(o, p.query, 0, 0.4) : 0.4; T.title = p.title ? MK.when(o, p.title, 0, 0.3) : 0.3; p._T = T; MK.panel(o, "ph", 620, 1270, { sy: 70, sb: 90, sa: 0.55 }); },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const T = p._T, rec = sc.st.ph, G = rec.g, W = rec.w, Hh = rec.h, side = p.side || 1;
    const S = MK.phoneBody(G, W, Hh, p.screen !== "web"); const dark = p.screen !== "web";
    const ink = dark ? "#e8ecf6" : "#0b1220", sub = dark ? "#8b95ad" : "#5b6474", card = dark ? "rgba(255,255,255,0.07)" : "#ffffff";
    G.save(); MK.rrp(G, S.x, S.y, S.w, S.h, S.r); G.clip();
    if (p.title) { const k = seg(u, T.title - 0.2, T.title + 0.2); G.globalAlpha = 0.25 + 0.75 * k; MK.t(G, p.title, S.x + 40, S.y + 140, { px: MK.fit(G, p.title, S.w - 80, 60, 800, "D"), w: 800, f: "D", c: ink }); G.globalAlpha = 1; }
    if (p.screen === "orders" || p.screen === "search") {
      let y0 = S.y + (p.title ? 200 : 140);
      if (p.screen === "search") { const n = Math.floor((p.query || "").length * seg(u, T.query, T.query + 0.8)); MK.rrp(G, S.x + 30, y0, S.w - 60, 92, 46); G.fillStyle = card; G.fill();
        MK.t(G, (p.query || "").slice(0, n) + (u < T.query + 0.9 && Math.floor(u * 3) % 2 ? "|" : ""), S.x + 80, y0 + 47, { px: 38, w: 600, c: ink }); y0 += 140; }
      const items = p.items || []; const last = items.length - 1; const rise = p.screen === "search" && p.rise !== false ? inOut(seg(u, T.items[last] + 0.3, T.items[last] + 1.0)) : 0;
      items.forEach((it, i) => { const k = outBack(seg(u, T.items[i] - 0.15, T.items[i] + 0.3), 1.4); if (k <= 0) return; const [a, b] = Array.isArray(it) ? it : [it, ""];
        let slot = p.screen === "orders" ? i : i; if (p.screen === "search") slot = i === last ? lerp(last, 0, rise) : (i + (rise > 0 ? rise : 0));
        const y = y0 + slot * 196 + (1 - k) * 80; G.save(); G.globalAlpha = cl(k * 1.4); const hi = p.screen === "search" && i === last && (rise > 0 || (p.rise === false && u > T.items[last]));
        MK.rrp(G, S.x + 24, y, S.w - 48, 176, 38); G.fillStyle = hi ? "rgba(37,99,235,0.22)" : card; G.fill(); if (hi) { G.strokeStyle = MK.ACC; G.lineWidth = 4; G.stroke(); }
        MK.icon(G, p.screen === "orders" ? "bag" : (hi ? "pin" : "star"), S.x + 96, y + 88, 46, p.screen === "orders" ? MK.OK : (hi ? MK.ACC : "#64748b"));
        MK.t(G, a, S.x + 166, b ? y + 66 : y + 88, { px: MK.fit(G, a, S.w - 210, 50, 800, "D"), w: 800, f: "D", c: ink }); if (b) MK.t(G, b, S.x + 166, y + 122, { px: MK.fit(G, b, S.w - 210, 36, 600), w: 600, c: sub }); G.restore(); });
    } else if (p.screen === "web") {
      const hk = out3(seg(u, T.head - 0.15, T.head + 0.4)); const bg = G.createLinearGradient(0, S.y, 0, S.y + 700); bg.addColorStop(0, "#dbe6ff"); bg.addColorStop(1, "#f6f7fb"); G.fillStyle = bg; G.fillRect(S.x, S.y + 90, S.w, 640);
      G.save(); G.globalAlpha = hk; G.translate(0, (1 - hk) * 30); const lines = wrapLinesG(G, p.headline || "", S.w - 90, 62);
      lines.forEach((l, i) => MK.t(G, l, S.x + 45, S.y + 300 + i * 74, { px: 62, w: 900, f: "D", c: "#0b1220" })); G.restore();
      if (p.button) { const bk = outBack(seg(u, T.btn - 0.15, T.btn + 0.25), 2); if (bk > 0) { G.save(); G.translate(S.x + S.w / 2, S.y + 620); G.scale(bk, bk); MK.rrp(G, -200, -50, 400, 100, 50); G.fillStyle = MK.ACC; G.fill(); MK.t(G, p.button, 0, 2, { px: MK.fit(G, p.button, 340, 38, 800), w: 800, c: "#fff", al: "center" }); G.restore(); } }
      for (let i = 0; i < 3; i++) { G.fillStyle = "#e5e9f2"; MK.rrp(G, S.x + 30 + i * ((S.w - 60) / 3), S.y + 790, (S.w - 60) / 3 - 16, 200, 24); G.fill(); }
    } else if (p.screen === "chat") {
      let y = S.y + (p.title ? 230 : 160); (p.items || []).forEach((it, i) => { const k = outBack(seg(u, T.items[i] - 0.15, T.items[i] + 0.3), 1.6); if (k <= 0) return; const me = it[0] !== "bot"; const txt = it[1];
        G.font = "600 34px I"; const lines = wrapLinesG(G, txt, S.w - 200, 34); const bh = lines.length * 46 + 40, bw = Math.min(S.w - 120, Math.max(...lines.map((l) => G.measureText(l).width)) + 60);
        const x = me ? S.x + S.w - 40 - bw : S.x + 40; G.save(); G.globalAlpha = cl(k * 1.4); G.translate(0, (1 - k) * 40); MK.rrp(G, x, y, bw, bh, 30); G.fillStyle = me ? MK.ACC : "rgba(255,255,255,0.12)"; G.fill();
        lines.forEach((l, j) => MK.t(G, l, x + 30, y + 42 + j * 46, { px: 34, w: 600, c: "#fff" })); G.restore(); y += bh + 26; });
    }
    G.restore(); MK.island(G, S); MK.glare(G, W, Hh, seg(u, 0, d));
    const enter = outExpo(seg(u, 0, 0.7)); const y = 1100 + (1 - enter) * 900 + Math.sin(u * 1.4) * 10; const ry = side * lerp(-28, -12, inOut(cl(u / Math.max(1, d)))) * 1, rx = lerp(14, 6, enter);
    MK.place(rec, 540, y, { ry, rx, rz: side * lerp(-6, -2, enter), s: 1.22 });
  },
  ev(d, p) { const T = p._T, E = [[0, "whoosh_up", 0.5, 0]]; (T.items || []).forEach((t) => E.push([t, p.screen === "orders" ? "ping" : "pop", 0.45, 0])); if (p.button) E.push([T.btn, "click", 0.4, 0]); return E.filter((e) => e[0] < d); },
};
function wrapLinesG(g, s, maxW, px) { g.font = `900 ${px}px D`; const words = String(s).split(" "); const out = []; let cur = ""; for (const w of words) { const tt = cur ? cur + " " + w : w; if (g.measureText(tt).width > maxW && cur) { out.push(cur); cur = w; } else cur = tt; } if (cur) out.push(cur); return out; }

// ---------- m_ipad: Bestellterminal am iPad (quer) ----------
// params: title (Kopfzeile, gesprochen), items [[Titel, Unterzeile]] (Bestellungen, erscheinen beim Sprechen), stamp (optional, gesprochen)
TYPES.m_ipad = {
  zone: "top", pal: "m_deep", bgv: 0, capY: 300,
  prep(o, p) { const it = p.items || []; p._T = { items: MK.times(o, it.map((x) => x[0]), 0.7, 0.6), title: p.title ? MK.when(o, p.title, 0, 0.2) : 0.2, stamp: p.stamp ? MK.when(o, p.stamp, 0, null) : null };
    MK.panel(o, "pad", 1000, 720, { sy: 70, sb: 90, sa: 0.5 }); },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const T = p._T, rec = sc.st.pad, G = rec.g, W = rec.w, Hh = rec.h; G.clearRect(0, 0, W, Hh);
    const fr = G.createLinearGradient(0, 0, W, Hh); fr.addColorStop(0, "#c9ced8"); fr.addColorStop(0.5, "#8d93a0"); fr.addColorStop(1, "#d6dae2"); G.fillStyle = fr; MK.rrp(G, 0, 0, W, Hh, 56); G.fill();
    G.fillStyle = "#0a0b0e"; MK.rrp(G, 10, 10, W - 20, Hh - 20, 48); G.fill(); const S = { x: 34, y: 34, w: W - 68, h: Hh - 68 };
    G.save(); MK.rrp(G, S.x, S.y, S.w, S.h, 30); G.clip(); G.fillStyle = "#0f1424"; G.fillRect(S.x, S.y, S.w, S.h);
    G.fillStyle = "#141b30"; G.fillRect(S.x, S.y, S.w, 90); if (p.title) MK.t(G, p.title, S.x + 36, S.y + 46, { px: 48, w: 800, f: "D", c: "#e8ecf6" });
    const n = (p.items || []).filter((x, i) => u >= T.items[i]).length; if (n) { MK.rrp(G, S.x + S.w - 110, S.y + 22, 76, 48, 24); G.fillStyle = MK.WARN; G.fill(); MK.t(G, String(n), S.x + S.w - 72, S.y + 47, { px: 30, w: 800, c: "#fff", al: "center" }); }
    (p.items || []).forEach((it, i) => { const k = outBack(seg(u, T.items[i] - 0.1, T.items[i] + 0.35), 1.3); if (k <= 0) return; const col = i % 2, row = Math.floor(i / 2);
      const cw = (S.w - 36 * 3) / 2, x = S.x + 36 + col * (cw + 36) + (1 - k) * 400, y = S.y + 120 + row * 200; const fresh = 1 - seg(u, T.items[i] + 0.3, T.items[i] + 1.2);
      G.save(); G.globalAlpha = cl(k * 1.3); MK.rrp(G, x, y, cw, 170, 26); G.fillStyle = "#1c2440"; G.fill(); G.strokeStyle = `rgba(34,197,94,${0.3 + 0.7 * fresh})`; G.lineWidth = 4; G.stroke();
      MK.icon(G, "bag", x + 70, y + 85, 40, MK.OK); MK.t(G, it[0], x + 130, it[1] ? y + 62 : y + 85, { px: MK.fit(G, it[0], cw - 160, 54, 800, "D"), w: 800, f: "D", c: "#fff" }); if (it[1]) MK.t(G, it[1], x + 130, y + 112, { px: MK.fit(G, it[1], cw - 160, 30, 600), w: 600, c: "#9aa6c2" }); G.restore(); });
    if (p.stamp && T.stamp != null) { const sk = outBack(seg(u, T.stamp, T.stamp + 0.3), 2.4); if (sk > 0) { G.save(); G.translate(S.x + S.w / 2, S.y + S.h - 70); G.rotate(-0.04); G.scale(sk, sk); MK.rrp(G, -260, -46, 520, 92, 46); G.fillStyle = MK.OK; G.fill(); MK.t(G, p.stamp, 0, 2, { px: MK.fit(G, p.stamp, 460, 44, 900, "D"), w: 900, f: "D", c: "#fff", al: "center" }); G.restore(); } }
    G.restore(); MK.glare(G, W, Hh, seg(u, 0, d));
    const enter = outExpo(seg(u, 0, 0.8)); MK.place(rec, 540, 1050 + (1 - enter) * 700 + Math.sin(u * 1.2) * 8, { rx: lerp(24, 10, enter) - 2 * inOut(cl(u / Math.max(1, d))), ry: lerp(-16, -6, inOut(cl(u / Math.max(1, d)))), rz: -2, s: lerp(0.95, 1.06, enter) });
  },
  ev(d, p) { const T = p._T, E = [[0, "whoosh_up", 0.5, 0]]; T.items.forEach((t) => E.push([t, "ping", 0.5, 0.1])); if (T.stamp != null) E.push([T.stamp, "slap", 0.5, 0]); return E.filter((e) => e[0] < d); },
};

// ---------- m_cards: Glas-Karten, fliegen beim Sprechen aus der Tiefe ----------
// params: items (Texte, gesprochen), icon ("check" | "x"), light (true = helle Fläche)
TYPES.m_cards = {
  zone: "top", pal: "m_dark", bgv: 0, capY: 300,
  prep(o, p) { const it = (p.items || []).slice(0, 4); p._T = { items: MK.times(o, it, 0.6, 0.4) }; it.forEach((s, i) => MK.panel(o, "c" + i, 880, 180, { glass: true, light: !!p.light || !o.P.dark, r: 46 })); },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const T = p._T, it = (p.items || []).slice(0, 4), n = it.length, y0 = 1010 - (n - 1) * 105;
    it.forEach((s, i) => { const rec = sc.st["c" + i], G = rec.g; G.clearRect(0, 0, rec.w, rec.h); const k = seg(u, T.items[i] - 0.2, T.items[i] + 0.45), e = outExpo(k);
      MK.icon(G, p.icon || "check", 100, 85, 46, p.icon === "x" ? MK.WARN : MK.OK); MK.t(G, s, 180, 92, { px: MK.fit(G, s, 660, 60, 800, "D"), w: 800, f: "D", c: (p.light || !P.dark) ? "#0b1220" : "#ffffff" });
      const fl = Math.sin(u * 1.3 + i) * 6; MK.place(rec, 540 + (1 - e) * (i % 2 ? 220 : -220), y0 + i * 210 + fl, { rx: lerp(55, 8, e), ry: (i % 2 ? -1 : 1) * lerp(25, 6, e), s: lerp(0.6, 1, e), op: e, persp: 1800 }); });
  },
  ev(d, p) { return p._T.items.map((t) => [t, "pop", 0.45, 0]).filter((e) => e[0] < d); },
};

// ---------- m_word: großes Wort mit Tiefe (für emotionale Aussagen) ----------
// params: text (gesprochen), sub (optional, gesprochen), color
TYPES.m_word = {
  zone: "bottom", pal: "m_dark", bgv: 0, capY: 1500, nocap: true,
  prep(o, p) { p._T = { t: MK.when(o, p.text || "", 0, 0.2), s: p.sub ? MK.when(o, p.sub, 0, 1.2) : null, pre: p.pre ? MK.when(o, p.pre, 0, 0.1) : null }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const T = p._T;
    if (p.pre && T.pre != null) { const pk = out3(seg(u, T.pre - 0.1, T.pre + 0.35)); g.save(); g.globalAlpha = pk; g.translate(0, (1 - pk) * 30); txt(g, p.pre, 540, 560, { w: 800, px: fitPx(g, p.pre, 900, 72, 800, "I"), fam: "I", c: "rgba(255,255,255,0.92)" }); g.restore(); }
    const k = seg(u, T.t - 0.15, T.t + 0.5), e = outExpo(k), word = String(p.text || "").toUpperCase();
    const px = fitPx(g, word, 940, 260, 900, "D"); g.save(); g.translate(540, 820); g.scale(lerp(1.6, 1, e), lerp(1.6, 1, e)); g.globalAlpha = cl(k * 2);
    for (let z = 14; z >= 1; z--) { g.save(); g.translate(z * 2.2, z * 3); txt_(g, word, px, `rgba(15,23,42,${0.06 + z * 0.01})`); g.restore(); }
    const gr = g.createLinearGradient(0, -px / 2, 0, px / 2); gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, p.color || "#93c5fd"); g.filter = k < 1 ? `blur(${(1 - e) * 16}px)` : "none"; txt_(g, word, px, gr); g.restore();
    if (p.sub && T.s != null) { const sk = out3(seg(u, T.s - 0.1, T.s + 0.4)); g.save(); g.globalAlpha = sk; g.translate(0, (1 - sk) * 30); txt(g, p.sub, 540, 1060, { w: 600, px: fitPx(g, p.sub, 900, 54, 600, "I"), fam: "I", c: "rgba(255,255,255,0.85)" }); g.restore(); }
    function txt_(g2, s, px2, c) { g2.font = `900 ${px2}px D`; g2.textAlign = "center"; g2.textBaseline = "middle"; g2.fillStyle = c; g2.fillText(s, 0, 0); }
  },
  ev(d, p) { return [[p._T.t, "boom", 0.35, 0], [p._T.t, "whoosh_down", 0.3, 0]].filter((e) => e[0] < d); },
};

// ---------- Schlüsse (im Wechsel, nie zweimal hintereinander) ----------
// m_end_comment: Handy mit Kommentarfeld, WEBSITE wird getippt und gesendet, Herzen. params: keyword
TYPES.m_end_comment = {
  zone: "top", pal: "m_dark", bgv: 0, capY: 300, drop: true,
  nocap: true,
  prep(o, p) { const kw = (p.keyword || "WEBSITE"); p._T = { kw: MK.when(o, kw, 0, 1.0), k: MK.when(o, "Kommentieren", 0, 0.4), sys: MK.when(o, "Mihajlo", 0, 0.2) }; MK.panel(o, "ph", 620, 1270, { sy: 70, sb: 90 }); },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const T = p._T, rec = sc.st.ph, G = rec.g, kw = (p.keyword || "WEBSITE").toUpperCase(); const S = MK.phoneBody(G, rec.w, rec.h, true);
    G.save(); MK.rrp(G, S.x, S.y, S.w, S.h, S.r); G.clip(); const gr = G.createLinearGradient(0, S.y, 0, S.y + S.h); gr.addColorStop(0, "#1e3a8a"); gr.addColorStop(1, "#0b1020"); G.fillStyle = gr; G.fillRect(S.x, S.y, S.w, S.h);
    const n = Math.floor(kw.length * seg(u, T.kw, T.kw + 0.6)), sent = u > T.kw + 0.8; const fy = S.y + S.h - 170; const hk = out3(seg(u, T.k - 0.1, T.k + 0.4));
    const sk = out3(seg(u, T.sys - 0.25, T.sys + 0.15)) * (1 - out3(seg(u, T.k - 0.1, T.k + 0.2))); if (sk > 0) { G.save(); G.globalAlpha = sk; G.translate(0, (1 - sk) * 30); const lg = logoImg(); if (lg && lg.complete) G.drawImage(lg, S.x + S.w / 2 - 90, S.y + 380, 180, 180);
      MK.t(G, "Mihajlo", S.x + S.w / 2, S.y + 640, { px: 76, w: 900, f: "D", c: "#fff", al: "center" }); MK.t(G, "Systems", S.x + S.w / 2, S.y + 730, { px: 76, w: 900, f: "D", c: "#93c5fd", al: "center" }); G.restore(); }
    G.save(); G.globalAlpha = hk; MK.t(G, "Kommentieren", S.x + S.w / 2, S.y + 230, { px: 64, w: 900, f: "D", c: "#fff", al: "center" }); MK.t(G, "Sie", S.x + S.w / 2, S.y + 310, { px: 64, w: 900, f: "D", c: "#93c5fd", al: "center" }); G.restore();
    MK.rrp(G, S.x + 24, fy, S.w - 48, 110, 55); G.fillStyle = "rgba(255,255,255,0.95)"; G.fill(); MK.t(G, kw.slice(0, sent ? 0 : n) + (!sent && Math.floor(u * 3) % 2 ? "|" : ""), S.x + 64, fy + 56, { px: 52, w: 900, f: "D", c: "#0b1220" });
    if (sent) { const k = out3(seg(u, T.kw + 0.8, T.kw + 1.3)); const by = lerp(fy, S.y + 420, k); MK.rrp(G, S.x + 24, by, S.w - 48, 140, 36); G.fillStyle = "rgba(255,255,255,0.12)"; G.fill(); MK.t(G, kw, S.x + 60, by + 72, { px: 64, w: 900, f: "D", c: "#fff" });
      for (let i = 0; i < 10; i++) { const h = seg(u, T.kw + 1.2 + i * 0.08, T.kw + 2.6 + i * 0.08); if (h <= 0 || h >= 1) continue; G.globalAlpha = 1 - h; G.fillStyle = ["#ef4444", "#f472b6", "#fb7185"][i % 3]; G.font = "60px I"; G.fillText("♥", S.x + S.w - 120 + Math.sin(h * 6 + i) * 40, by - h * 400); G.globalAlpha = 1; } }
    G.restore(); MK.island(G, S); const e = outExpo(seg(u, 0, 0.6)); MK.place(rec, 540, 980 + (1 - e) * 800, { ry: lerp(20, 8, e), rx: 8, rz: 3, s: 1.22 });
  },
  ev(d, p) { const T = p._T; return [[0, "whoosh_up", 0.5, 0], [T.kw, "key", 0.4, 0], [T.kw + 0.2, "key", 0.4, 0], [T.kw + 0.4, "key", 0.4, 0], [T.kw + 0.8, "ping", 0.5, 0], [T.kw + 1.2, "shimmer", 0.35, 0]].filter((e) => e[0] < d); },
};
// m_end_card: Glas-Karte mit „Mihajlo Systems“, Zeile (gesprochen) und getipptem Stichwort. params: keyword, line
TYPES.m_end_card = {
  zone: "top", pal: "m_light", bgv: 0, nocap: true, drop: true,
  prep(o, p) { p._T = { sys: MK.when(o, "Systems", 0, 0.3), line: p.line ? MK.when(o, p.line, 0, 1.2) : null, kw: MK.when(o, p.keyword || "WEBSITE", 0, 2.2) }; MK.panel(o, "card", 900, 900, { glass: true, light: true, r: 60 }); },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const T = p._T, rec = sc.st.card, G = rec.g, W = rec.w; G.clearRect(0, 0, W, rec.h); const kw = (p.keyword || "WEBSITE").toUpperCase();
    const a = out3(seg(u, T.sys - 0.3, T.sys + 0.3)); G.globalAlpha = a; MK.t(G, "Mihajlo Systems", W / 2, 230, { px: 96, w: 900, f: "D", c: "#0b1220", al: "center" }); G.globalAlpha = 1;
    if (p.line && T.line != null) { const k = out3(seg(u, T.line - 0.1, T.line + 0.4)); G.globalAlpha = k; MK.t(G, p.line, W / 2, 340, { px: MK.fit(G, p.line, 780, 44, 600), w: 600, c: "#475569", al: "center" }); G.globalAlpha = 1; }
    const n = Math.floor(kw.length * seg(u, T.kw, T.kw + 0.6)); const bk = outBack(seg(u, T.kw - 0.3, T.kw), 1.8); if (bk > 0) { G.save(); G.translate(W / 2, 560); G.scale(bk, bk); MK.rrp(G, -340, -80, 680, 160, 80); G.fillStyle = MK.ACC; G.fill(); MK.t(G, kw.slice(0, n), 0, 4, { px: 84, w: 900, f: "D", c: "#fff", al: "center", ls: 6 }); G.restore(); }
    const e = outExpo(seg(u, 0, 0.8)); MK.place(rec, 540, 960, { rx: lerp(40, 4, e) + Math.sin(u) * 2, ry: lerp(-20, -3, e) + Math.sin(u * 0.7) * 3, s: lerp(0.8, 1, e) });
  },
  ev(d, p) { const T = p._T; return [[0, "shimmer", 0.4, 0], [T.kw, "pop", 0.5, 0], [T.kw + 0.6, "chime", 0.4, 0]].filter((e) => e[0] < d); },
};
// m_end_word: Riesen-Stichwort mit Tiefe auf Verlauf, Pfeil nach unten. params: keyword
TYPES.m_end_word = {
  zone: "top", pal: "m_deep", bgv: 0, nocap: true, drop: true,
  prep(o, p) { p._T = { kw: MK.when(o, p.keyword || "WEBSITE", 0, 1.0), k: MK.when(o, "Kommentieren", 0, 0.3), sys: MK.when(o, "Mihajlo", 0, 0.05) }; },
  draw(g, u, d, p, sc, P) {
    background(g, P, u, sc); const T = p._T, kw = (p.keyword || "WEBSITE").toUpperCase(); const ka = out3(seg(u, T.k - 0.1, T.k + 0.4));
    const sa = out3(seg(u, T.sys - 0.15, T.sys + 0.3)); if (sa > 0) { g.save(); g.globalAlpha = sa; g.translate(0, (1 - sa) * 24); const lg = logoImg(); if (lg && lg.complete) g.drawImage(lg, 480, 330, 120, 120); txt(g, "Mihajlo Systems", 540, 520, { w: 900, px: 76, fam: "D", c: "#ffffff" }); g.restore(); }
    g.save(); g.globalAlpha = ka; txt(g, "Kommentieren Sie", 540, 640, { w: 600, px: 64, fam: "I", c: "rgba(255,255,255,0.9)" }); g.restore();
    const k = seg(u, T.kw - 0.1, T.kw + 0.5), e = outExpo(k); const px = fitPx(g, kw, 960, 230, 900, "D"); g.save(); g.translate(540, 900); g.rotate(-0.03); g.scale(lerp(2, 1, e), lerp(2, 1, e)); g.globalAlpha = cl(k * 2);
    for (let z = 16; z >= 1; z--) { g.font = `900 ${px}px D`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = `rgba(30,58,138,${0.25})`; g.fillText(kw, z * 2, z * 3); }
    const gr = g.createLinearGradient(-400, 0, 400, 0); gr.addColorStop(0, "#93c5fd"); gr.addColorStop(1, "#ffffff"); g.fillStyle = gr; g.fillText(kw, 0, 0); g.restore();
    const ak = out3(seg(u, T.kw + 0.6, T.kw + 1)); if (ak > 0) { g.save(); g.globalAlpha = ak; g.translate(540, 1180 + Math.sin(u * 6) * 14); g.fillStyle = "#93c5fd"; g.beginPath(); g.moveTo(-50, -25); g.lineTo(50, -25); g.lineTo(0, 40); g.closePath(); g.fill(); g.restore(); }
  },
  ev(d, p) { const T = p._T; return [[T.kw, "boom", 0.4, 0], [T.kw + 0.05, "shimmer", 0.35, 0]].filter((e) => e[0] < d); },
};
