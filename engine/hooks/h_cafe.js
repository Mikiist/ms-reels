// VOICE_DELAY: 0.4
// h_cafe: „Zwei Läden“ als Mini-Stadt von schräg oben (isometrisch), Vorbild der Café-Reels, die Mihajlo geschickt hat.
// Zwei gleiche Cafés an einer Straße. Im ersten warten die Gäste, einer geht. Im zweiten: QR- und NFC-Sticker am Tisch,
// Bestellung am Handy, das iPad zeigt „Tisch 4, 2 Cappuccino“, Bonuspunkte in der Wallet. Zum Schluss beide Cafés im
// Vergleich (leer gegen voll), dann taucht die Kamera ins zweite Café und es wird weiß (danach Szene reveal).
// Zeiten aus den Wörtern: gleicher, ersten, warten, ewig, zweiten, code, bestellt, ipad, tisch, cappuccino, punkte, wallet, welches.
(() => {
  const S0 = 56, CY = 960, INK = "#1b1530", PINK = "#ff6b9a", LIME = "#c6f432";
  const norm = (w) => w.toLowerCase().replace(/[^a-zäöüß0-9]/g, "");
  const P = (x, y, z = 0) => [(x - y) * 0.866 * S0, (x + y) * 0.5 * S0 - z * S0];

  // Welt: Straße entlang x (y 6 bis 8), zwei Cafés hinter der Straße (y 0 bis 5), Häuser rundherum
  const C1 = { x: 0, y: 0, w: 6, d: 5, wall: "#d8d4cc", wallR: "#c9c4bb", floor: "#ebe7df", sign: "#9a958c" };
  const C2 = { x: 9, y: 0, w: 6, d: 5, wall: "#ffd2a8", wallR: "#ffbf8a", floor: "#fbead4", sign: PINK };
  const T1 = [[1.6, 1.8], [4.2, 1.8], [1.6, 3.8], [4.2, 3.8]];
  const T2 = [[10.6, 1.8], [13.2, 1.8], [10.6, 3.8], [13.2, 3.8]];
  const QR_T = 3; // Tisch mit QR-Sticker (Index in T2), heißt in der Geschichte „Tisch 4“
  const BLD = [];
  (() => {
    const cols = [["#ffffff", "#e3e7f0", "#ccd3e2"], ["#fdf7ef", "#efe3d1", "#ddcbb2"], ["#f3f6ff", "#d9e1f5", "#c0cbe8"], ["#fff6f8", "#f3dde3", "#e3c3cc"]];
    let k = 0;
    for (let gx = -14; gx <= 26; gx += 4) for (let gy = -16; gy <= 22; gy += 4) {
      if (gy >= 4 && gy <= 8) continue; // Straße frei
      if (gy >= -4 && gy <= 4 && gx >= -2 && gx <= 16) continue; // Platz der Cafés
      const h = 1.2 + rnd(k * 3.1) * 3.2, w = 2.4 + rnd(k * 1.7) * 0.9, d = 2.4 + rnd(k * 2.3) * 0.9;
      BLD.push({ x: gx + 0.4, y: gy + 0.4, w, d, h, c: cols[k % cols.length], tree: rnd(k * 9.7) > 0.72 });
      k++;
    }
    BLD.sort((a, b) => a.x + a.y + a.w / 2 + a.d / 2 - (b.x + b.y + b.w / 2 + b.d / 2));
  })();
  const PEOPLE = ["#5b8def", "#ff8a65", "#7bc67e", "#b388ff", "#ffd54f", "#4dd0e1", "#f06292", "#90a4ae"];

  function poly(g, pts, c, stroke) { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.fillStyle = c; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = 1.2; g.stroke(); } }

  TYPES.h_cafe = {
    zone: "top", pal: "ag_dark", bgv: 0, coverT: 1.2, capY: 300,
    prep(o, p) {
      const W0 = (SPEC.words || []).filter((w) => w.scene === o.i); const f = (re, after = 0, def = null) => { const w = W0.find((x) => x.t >= after && re.test(norm(x.w))); return w ? w.t - o.t0 : def; };
      const T = {}; T.gleich = f(/^gleiche/, 0, 1.1); T.ersten = f(/^ersten/, T.gleich, T.gleich + 1.6); T.warten = f(/^warten/, T.ersten, T.ersten + 0.4); T.ewig = f(/^ewig/, T.warten, T.warten + 0.7);
      T.zweiten = f(/^zweiten/, T.ewig, T.ewig + 1.3); T.code = f(/^code/, T.zweiten, T.zweiten + 1.0); T.bestellt = f(/^bestellt/, T.code, T.code + 0.9);
      T.ipad = f(/^(ipad|ipads|eipad)/, T.bestellt, T.bestellt + 1.0); T.tisch = f(/^tisch/, T.ipad, T.ipad + 0.8); T.capp = f(/^(cappuccino|capuccino|cappucino)/, T.tisch, T.tisch + 0.8);
      T.punkte = f(/^punkte/, T.capp, T.capp + 1.6); T.wallet = f(/^wallet/, T.punkte, T.punkte + 0.6); T.welches = f(/^welche/, T.wallet, T.wallet + 1.0);
      p._T = T;
    },
    draw(g, u, d, p, sc, Pl) {
      const T = p._T;
      // Kamera: Weltpunkt in der Bildmitte und Zoom, Schlüsselbilder aus den Wortzeiten
      const key = (t, x, y, z) => ({ t, x, y, z });
      const KF = [key(0, 7.5, 5, 0.5), key(T.gleich + 0.6, 7.2, 1.8, 0.85), key(T.ersten - 0.2, 7.2, 1.8, 0.85), key(T.ersten + 0.45, 3, 2.6, 1.75),
        key(T.zweiten - 0.3, 3, 2.6, 1.75), key(T.zweiten + 0.35, 13.2, 3.8, 2.7), key(T.ipad - 0.3, 13.2, 3.8, 2.7), key(T.ipad + 0.3, 10.6, 0.9, 2.3),
        key(T.welches - 0.35, 10.6, 0.9, 2.3), key(T.welches + 0.4, 7.2, 1.6, 0.78), key(d - 0.75, 7.2, 1.6, 0.84)];
      let cx = KF[0].x, cy = KF[0].y, z = KF[0].z;
      for (let i = 1; i < KF.length; i++) { const A = KF[i - 1], B = KF[i]; if (u >= A.t) { const k = inOut(cl((u - A.t) / Math.max(0.05, B.t - A.t))); cx = lerp(A.x, B.x, k); cy = lerp(A.y, B.y, k); z = lerp(A.z, B.z, k); } }
      const dive = inExpo(cl((u - (d - 0.55)) / 0.55)); if (dive > 0) { z *= 1 + dive * 14; cx = lerp(cx, 10.9, out3(dive)); cy = lerp(cy, 0.7, out3(dive)); }
      const c0 = P(cx, cy, 0);
      const S = (x, y, h = 0) => { const q = P(x, y, h); return [540 + (q[0] - c0[0]) * z, CY + (q[1] - c0[1]) * z]; };

      // Himmel und Boden
      const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#dde8ff"); bg.addColorStop(1, "#f7f2ff"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
      poly(g, [S(-40, -40), S(60, -40), S(60, 60), S(-40, 60)], "#eef1f7");
      // Straße mit Mittellinie, Gehwege
      poly(g, [S(-40, 4.6), S(60, 4.6), S(60, 9.4), S(-40, 9.4)], "#dfe3ec");
      poly(g, [S(-40, 5.6), S(60, 5.6), S(60, 8.4), S(-40, 8.4)], "#c3c9d6");
      for (let x = -40; x < 60; x += 2.4) poly(g, [S(x, 6.93), S(x + 1.2, 6.93), S(x + 1.2, 7.07), S(x, 7.07)], "#ffffff");
      // Autos fahren
      for (let i = 0; i < 3; i++) { const x = ((u * (2.2 + i * 0.7) + i * 17) % 60) - 20, y = i % 2 ? 6.3 : 7.5; box(g, S, x, y, 1.6, 0.8, 0.55, ["#ffffff", "#e9ecf3", "#d3d8e3"]); box(g, S, x + 0.3, y + 0.1, 1.0, 0.6, 0.85, [["#5b8def", "#ff8a65", "#7bc67e"][i], "#9db7f0", "#7e9be0"]); }

      // Häuser hinter den Cafés (weiter weg zuerst), dann Cafés, dann Häuser davor
      const before = BLD.filter((b) => b.y + b.d <= 4.2), after = BLD.filter((b) => b.y + b.d > 4.2);
      before.forEach((b) => building(g, S, b));
      cafe(g, S, C1, T1, u, T, false, z);
      cafe(g, S, C2, T2, u, T, true, z);
      after.forEach((b) => building(g, S, b));

      // Schilder „CAFÉ 1“, „CAFÉ 2“ über den Cafés
      [[C1, "1", 0.25], [C2, "2", 0.45]].forEach(([C, n, t0]) => { const k = outBack(seg(u, t0, t0 + 0.35), 2.2); if (k <= 0) return; const [x, y] = S(C.x + C.w / 2, C.y + 0.2, 2.6);
        g.save(); g.translate(x, y - 24); g.scale(k * 1.3, k * 1.3); shadow(g, 18, 6, "rgba(27,21,48,0.18)"); fillRR(g, -110, -30, 220, 60, 30, "#ffffff"); noShadow(g); cup(g, -72, 2, 1, INK); txt(g, "CAFÉ " + n, 22, 3, { w: 900, px: 26, c: INK, fam: "K" }); g.restore(); });

      // Café 1: warten. Sprechblasen mit „…“ und eine Uhr, ab „ewig“ geht ein Gast
      const wk = seg(u, T.warten - 0.1, T.warten + 0.3) * (1 - seg(u, T.welches - 0.2, T.welches + 0.2));
      if (wk > 0) {
        T1.forEach(([tx, ty], i) => { if (i === 2 && u > T.ewig + 0.3) return; const [x, y] = S(tx - 0.5, ty + 0.3, 1.5); const b = 0.9 + 0.1 * Math.sin(u * 5 + i);
          g.save(); g.globalAlpha = wk; g.translate(x, y); g.scale(b * Math.min(1.4, z / 1.4), b * Math.min(1.4, z / 1.4)); bubble(g, "…"); g.restore(); });
        const [x, y] = S(5.2, 2.0, 2.2); g.save(); g.globalAlpha = wk; clock(g, x, y - 40, 34 * Math.min(1.3, z / 1.4), u * 6); g.restore();
      }
      const ang = seg(u, T.ewig + 0.1, T.ewig + 0.4) * (1 - seg(u, T.welches - 0.2, T.welches)); if (ang > 0) { const [x, y] = S(1.6, 4.4, 1.6); g.save(); g.globalAlpha = ang; g.translate(x, y); g.scale(z / 1.4, z / 1.4); bubble(g, "😤"); g.restore(); }

      // Café 2: QR- und NFC-Sticker leuchtet, Funkwellen
      const qk = seg(u, T.zweiten + 0.2, T.zweiten + 0.5) * (1 - seg(u, T.ipad - 0.2, T.ipad));
      if (qk > 0) { const [tx, ty] = T2[QR_T]; const [x, y] = S(tx + 0.1, ty - 0.05, 0.72); for (let i = 0; i < 3; i++) { const r = ((u * 1.2 + i / 3) % 1); g.strokeStyle = `rgba(255,107,154,${(1 - r) * qk})`; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y, 20 * z * (0.4 + r), 10 * z * (0.4 + r), 0, 0, 7); g.stroke(); } }

      // Handy: Gast scannt den Code und bestellt
      const ph = outExpo(seg(u, T.code - 0.15, T.code + 0.3)) * (1 - inOut(seg(u, T.ipad - 0.35, T.ipad - 0.05)));
      if (ph > 0) phone(g, u, T, ph);
      // iPad: Bestellungen nach Tisch
      const ip = outExpo(seg(u, T.ipad - 0.05, T.ipad + 0.35)) * (1 - inOut(seg(u, T.punkte - 0.45, T.punkte - 0.15)));
      if (ip > 0) ipad(g, u, T, ip);
      // Wallet: Bonuspunkte
      const wl = outBack(seg(u, T.punkte - 0.25, T.punkte + 0.15), 1.6) * (1 - inOut(seg(u, T.welches - 0.3, T.welches)));
      if (wl > 0) wallet(g, u, T, wl);

      // Vergleich zum Schluss: leer gegen voll
      const vk = outBack(seg(u, T.welches + 0.3, T.welches + 0.7), 2);
      if (vk > 0) [[C1, "😴"], [C2, "🔥"]].forEach(([C, e]) => { const [x, y] = S(C.x + C.w + 0.9, C.y + C.d + 0.9, 0.3); g.save(); g.translate(x, y); g.scale(vk, vk); txt(g, e, 0, 0, { px: 120 }); g.restore(); });

      // Weiß am Ende (Übergang zur Enthüllung)
      const wf = cl((u - (d - 0.18)) / 0.18); if (wf > 0) { g.fillStyle = `rgba(255,255,255,${wf})`; g.fillRect(0, 0, W, H); }
    },
    ev(d, p) {
      const T = p._T, E = [[0.0, "whoosh_down", 0.4, 0], [0.25, "pop", 0.45, -0.4], [0.45, "pop", 0.45, 0.4]];
      E.push([T.ersten - 0.1, "whoosh_side", 0.35, -0.5]);
      for (let t = T.warten; t < T.zweiten - 0.4; t += 0.5) E.push([t, "tick", 0.22, -0.3]);
      E.push([T.ewig + 0.1, "slap", 0.25, -0.4]);
      E.push([T.zweiten - 0.2, "whoosh_side", 0.4, 0.5]); E.push([T.code - 0.05, "ping", 0.45, 0.2]);
      E.push([T.code + 0.45, "click", 0.4, 0.2]); E.push([T.code + 0.75, "click", 0.4, 0.2]); E.push([T.bestellt, "ding", 0.5, 0.2]);
      E.push([T.ipad - 0.15, "whoosh_up", 0.35, 0]); E.push([T.tisch, "chime", 0.45, 0]); E.push([T.capp, "pop", 0.4, 0]);
      E.push([T.punkte - 0.2, "pop", 0.4, 0]); E.push([T.punkte + 0.35, "cash", 0.4, 0]); E.push([T.wallet, "shimmer", 0.35, 0]);
      E.push([T.welches - 0.3, "whoosh_up", 0.4, 0]); E.push([T.welches + 0.35, "pop", 0.4, -0.4]); E.push([T.welches + 0.45, "pop", 0.4, 0.4]);
      E.push([d - 0.6, "riser", 0.6, 0, 0.6]);
      return E.filter((e) => e[0] < d + 0.1);
    },
  };

  function box(g, S, x, y, w, d, h, c) {
    poly(g, [S(x + w, y, 0), S(x + w, y + d, 0), S(x + w, y + d, h), S(x + w, y, h)], c[2]);
    poly(g, [S(x, y + d, 0), S(x + w, y + d, 0), S(x + w, y + d, h), S(x, y + d, h)], c[1]);
    poly(g, [S(x, y, h), S(x + w, y, h), S(x + w, y + d, h), S(x, y + d, h)], c[0]);
  }
  function building(g, S, b) {
    box(g, S, b.x, b.y, b.w, b.d, b.h, b.c);
    // Fenster auf beiden sichtbaren Seiten
    for (let fz = 0.5; fz < b.h - 0.3; fz += 0.8) {
      for (let fx = 0.35; fx < b.w - 0.3; fx += 0.7) poly(g, [S(b.x + fx, b.y + b.d, fz), S(b.x + fx + 0.35, b.y + b.d, fz), S(b.x + fx + 0.35, b.y + b.d, fz + 0.4), S(b.x + fx, b.y + b.d, fz + 0.4)], "#b9c7e6");
      for (let fy = 0.35; fy < b.d - 0.3; fy += 0.7) poly(g, [S(b.x + b.w, b.y + fy, fz), S(b.x + b.w, b.y + fy + 0.35, fz), S(b.x + b.w, b.y + fy + 0.35, fz + 0.4), S(b.x + b.w, b.y + fy, fz + 0.4)], "#a9b8da");
    }
    if (b.tree) tree(g, S, b.x + b.w + 0.6, b.y + b.d + 0.6);
  }
  function tree(g, S, x, y) { const [a, bb] = S(x, y, 0), [c, dd] = S(x, y, 0.7); g.strokeStyle = "#a08060"; g.lineWidth = 3; g.beginPath(); g.moveTo(a, bb); g.lineTo(c, dd); g.stroke(); const r = Math.abs(dd - bb) * 0.9; circle(g, c, dd - r * 0.5, r, "#8fd18a"); circle(g, c - r * 0.3, dd - r * 0.7, r * 0.55, "#a8e0a2"); }
  function cafe(g, S, C, tables, u, T, good, z) {
    const { x, y, w, d } = C;
    poly(g, [S(x, y, 0), S(x + w, y, 0), S(x + w, y + d, 0), S(x, y + d, 0)], C.floor, "rgba(27,21,48,0.15)");
    // Fliesen
    g.strokeStyle = "rgba(27,21,48,0.06)"; g.lineWidth = 1; for (let i = 1; i < w; i++) { const a = S(x + i, y), b = S(x + i, y + d); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    // Rückwände (Schnitt nach vorn offen)
    const hW = 1.7;
    poly(g, [S(x, y, 0), S(x + w, y, 0), S(x + w, y, hW), S(x, y, hW)], C.wall);
    poly(g, [S(x, y, 0), S(x, y + d, 0), S(x, y + d, hW), S(x, y, hW)], C.wallR);
    // Fenster und Schild an der Wand
    for (let i = 0; i < 3; i++) poly(g, [S(x + 0.8 + i * 1.8, y, 0.7), S(x + 1.8 + i * 1.8, y, 0.7), S(x + 1.8 + i * 1.8, y, 1.4), S(x + 0.8 + i * 1.8, y, 1.4)], good ? "#ffe9c7" : "#e9e6e0");
    poly(g, [S(x + 1.5, y, 1.75), S(x + w - 1.5, y, 1.75), S(x + w - 1.5, y, 2.25), S(x + 1.5, y, 2.25)], C.sign);
    // Theke mit Kaffeemaschine und iPad (nur im guten Café leuchtet das iPad)
    box(g, S, x + 0.4, y + 0.4, 2.2, 0.8, 0.9, good ? ["#ffffff", "#f1e3d0", "#e3cfb4"] : ["#f2f0ec", "#e2ded6", "#d2cdc4"]);
    box(g, S, x + 0.6, y + 0.5, 0.5, 0.4, 1.35, ["#6d6a66", "#55524e", "#46433f"]);
    if (good) { const a = S(x + 1.6, y + 0.75, 0.92), b = S(x + 2.3, y + 0.75, 0.92), c2 = S(x + 2.3, y + 0.75, 1.35), d2 = S(x + 1.6, y + 0.75, 1.35); poly(g, [a, b, c2, d2], INK); const gl = 0.5 + 0.5 * Math.sin(u * 4); poly(g, [lp(a, c2, 0.12), lp(b, d2, 0.12), lp(c2, a, 0.12), lp(d2, b, 0.12)], `rgba(198,244,50,${0.55 + 0.35 * gl})`); }
    // Tische mit Gästen
    const nGood = good ? Math.min(8, 4 + Math.floor(Math.max(0, u - T.zweiten) / 1.6)) : 4;
    tables.forEach(([tx, ty], i) => {
      chair(g, S, tx - 0.55, ty); chair(g, S, tx + 0.55, ty);
      table(g, S, tx, ty, z, good && i === QR_T);
      // Gast links immer, rechts im guten Café mit der Zeit
      const leaving = !good && i === 2;
      if (leaving && u > T.ewig + 0.3) { const k = seg(u, T.ewig + 0.3, T.ewig + 2.4); const px = lerp(tx - 0.55, tx - 0.6, k), py = lerp(ty, 6.5, k); if (k < 1) person(g, S, px, py, z, PEOPLE[i], false, 1 - seg(u, T.ewig + 2.0, T.ewig + 2.4)); }
      else person(g, S, tx - 0.55, ty, z, PEOPLE[i], true, 1);
      if (good && i + 4 < nGood) person(g, S, tx + 0.55, ty, z, PEOPLE[i + 4], true, outBack(cl((u - T.zweiten - (i + 1) * 1.6) / 0.4), 2));
      if (good || i % 2) cupOn(g, S, tx + 0.15, ty - 0.1, z);
    });
    // Kellner im schlechten Café rennt hin und her, im guten steht jemand gelassen an der Theke
    if (!good) { const k = 0.5 + 0.5 * Math.sin(u * 2.4); person(g, S, lerp(x + 1.2, x + 4.8, k), y + 2.8, z, "#37474f", false, 1); }
    else person(g, S, x + 1.6, y + 1.5, z, "#37474f", false, 1);
  }
  function lp(a, b, k) { return [lerp(a[0], b[0], k), lerp(a[1], b[1], k)]; }
  function chair(g, S, x, y) { box(g, S, x - 0.17, y - 0.17, 0.34, 0.34, 0.42, ["#b08a66", "#9a7655", "#866446"]); }
  function table(g, S, x, y, z, qr) {
    const [a, b] = S(x, y, 0), [c, dd] = S(x, y, 0.7); g.strokeStyle = "#6d5a48"; g.lineWidth = Math.max(2, 4 * z / 2); g.beginPath(); g.moveTo(a, b); g.lineTo(c, dd); g.stroke();
    const rx = 0.42 * 1.22 * S0 * z, ry = 0.42 * 0.61 * S0 * z;
    g.fillStyle = "#a07f5f"; g.beginPath(); g.ellipse(c, dd + ry * 0.18, rx, ry, 0, 0, 7); g.fill();
    g.fillStyle = "#ffffff"; g.beginPath(); g.ellipse(c, dd, rx, ry, 0, 0, 7); g.fill(); g.strokeStyle = "rgba(27,21,48,0.15)"; g.lineWidth = 1; g.stroke();
    if (qr) { // QR- und NFC-Sticker flach auf dem Tisch
      const s = 0.22; const q = [S(x - s, y - s + 0.12, 0.71), S(x + s, y - s + 0.12, 0.71), S(x + s, y + s + 0.12, 0.71), S(x - s, y + s + 0.12, 0.71)];
      poly(g, q, INK); const m = (i, j) => lp(lp(q[0], q[1], i), lp(q[3], q[2], i), j);
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if ((i + j * 3) % 3 === 0 || (i < 2 && j < 2) || (i > 2 && j < 2) || (i < 2 && j > 2)) poly(g, [m(0.12 + i * 0.152, 0.12 + j * 0.152), m(0.25 + i * 0.152, 0.12 + j * 0.152), m(0.25 + i * 0.152, 0.25 + j * 0.152), m(0.12 + i * 0.152, 0.25 + j * 0.152)], "#ffffff");
    }
  }
  function cupOn(g, S, x, y, z) { const [c, dd] = S(x, y, 0.72); const r = 5 * z; fillRR(g, c - r, dd - r * 1.6, r * 2, r * 1.8, r * 0.5, "#ffffff"); g.strokeStyle = "rgba(27,21,48,0.35)"; g.lineWidth = 1; g.strokeRect(c - r, dd - r * 1.6, r * 2, r * 1.6); }
  function person(g, S, x, y, z, col, seated, k) {
    if (k <= 0) return; const [px, py] = S(x, y, seated ? 0.42 : 0); const s = z * S0 / 56 * Math.min(1, k);
    g.save(); g.globalAlpha = cl(k); g.translate(px, py); g.scale(s, s);
    g.fillStyle = "rgba(27,21,48,0.12)"; g.beginPath(); g.ellipse(0, seated ? 22 : 2, 14, 6, 0, 0, 7); g.fill();
    const hBody = seated ? 26 : 40; fillRR(g, -10, -hBody, 20, hBody + 2, 9, col);
    circle(g, 0, -hBody - 10, 9, "#f2c7a5"); g.fillStyle = "#3e2c22"; g.beginPath(); g.arc(0, -hBody - 12, 9.5, Math.PI, 0); g.fill();
    g.restore();
  }
  function cup(g, x, y, s, c) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = c; g.lineWidth = 4; g.beginPath(); g.moveTo(-12, -8); g.lineTo(-9, 10); g.lineTo(9, 10); g.lineTo(12, -8); g.closePath(); g.stroke(); g.beginPath(); g.arc(15, 0, 5, -1.4, 1.4); g.stroke(); g.restore(); }
  function bubble(g, s) { shadow(g, 10, 3, "rgba(27,21,48,0.18)"); fillRR(g, -38, -30, 76, 52, 22, "#ffffff"); noShadow(g); g.fillStyle = "#ffffff"; g.beginPath(); g.moveTo(-6, 20); g.lineTo(6, 20); g.lineTo(-2, 32); g.closePath(); g.fill(); txt(g, s, 0, -4, { w: 900, px: s === "…" ? 40 : 34, c: INK }); }
  function clock(g, x, y, r, a) { shadow(g, 12, 4, "rgba(27,21,48,0.2)"); circle(g, x, y, r, "#ffffff"); noShadow(g); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(x, y, r - 3, 0, 7); g.stroke(); g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.sin(a) * r * 0.7, y - Math.cos(a) * r * 0.7); g.moveTo(x, y); g.lineTo(x + Math.sin(a / 12) * r * 0.45, y - Math.cos(a / 12) * r * 0.45); g.stroke(); g.lineCap = "butt"; }

  // ---------- Karten im Bild (fest im Bildschirm, nicht in der Welt) ----------
  function card(g, x, y, w, h, k, r = 36) { g.translate(0, (1 - k) * 380); g.globalAlpha = cl(k * 1.4); shadow(g, 50, 18, "rgba(27,21,48,0.28)"); fillRR(g, x, y, w, h, r, "#ffffff"); noShadow(g); }
  function phone(g, u, T, k) {
    g.save(); const x = 300, y = 1110, w = 480, h = 700; card(g, x, y, w, h, k, 54);
    fillRR(g, x + 190, y + 18, 100, 22, 11, INK);
    txt(g, "Café Zwei", x + 40, y + 90, { w: 900, px: 34, c: INK, al: "left", fam: "K" }); txt(g, "Tisch 4", x + w - 40, y + 90, { w: 800, px: 26, c: PINK, al: "right" });
    fillRR(g, x + 30, y + 120, w - 60, 2, 1, "rgba(27,21,48,0.1)");
    const items = [["Cappuccino", "☕"], ["Latte macchiato", "🥛"], ["Croissant", "🥐"]];
    const taps = [T.code + 0.45, T.code + 0.75]; const n = taps.filter((t) => u >= t).length;
    items.forEach(([s, e], i) => { const ry = y + 170 + i * 110; fillRR(g, x + 30, ry, w - 60, 90, 24, i === 0 && n ? "#fff1f5" : "#f6f6fa"); txt(g, e, x + 75, ry + 46, { px: 40 }); txt(g, s, x + 120, ry + 46, { w: 800, px: 28, c: INK, al: "left" });
      const bx = x + w - 90; fillRR(g, bx, ry + 22, 46, 46, 23, i === 0 ? PINK : "#e4e4ee"); txt(g, i === 0 && n ? String(n) : "+", bx + 23, ry + 46, { w: 900, px: 26, c: i === 0 ? "#ffffff" : INK }); });
    // Finger tippt zweimal auf Cappuccino
    taps.forEach((t) => { const f = seg(u, t - 0.12, t + 0.2); if (f > 0 && f < 1) { const sx = x + w - 67, sy = y + 216; circle(g, sx, sy, 30 * (1 - f) + 20, `rgba(255,107,154,${0.35 * (1 - f)})`); } });
    const done = u >= T.bestellt; const bk = outBack(seg(u, T.bestellt, T.bestellt + 0.3), 2.5);
    g.save(); g.translate(x + w / 2, y + h - 90); if (done) g.scale(lerp(1.15, 1, bk), lerp(1.15, 1, bk)); fillRR(g, -(w - 60) / 2, -40, w - 60, 80, 40, done ? "#2bb673" : INK); txt(g, done ? "Bestellt ✓" : "Bestellen", 0, 2, { w: 900, px: 30, c: "#ffffff", fam: "K" }); g.restore();
    g.restore();
  }
  function ipad(g, u, T, k) {
    g.save(); const x = 90, y = 1060, w = 900, h = 640; card(g, x, y, w, h, k, 40);
    fillRR(g, x + 16, y + 16, w - 32, h - 32, 28, "#f5f6fb");
    txt(g, "Bestellungen", x + 60, y + 80, { w: 900, px: 38, c: INK, al: "left", fam: "K" }); circle(g, x + w - 120, y + 80, 9, "#2bb673"); txt(g, "live", x + w - 100, y + 81, { w: 800, px: 24, c: "#2bb673", al: "left" });
    const nk = outBack(seg(u, T.tisch - 0.05, T.tisch + 0.35), 1.8); const off = 130 * cl(nk);
    const rows = [["Tisch 2", "Latte macchiato", "vor 3 Min."], ["Tisch 7", "2 Croissants", "vor 5 Min."], ["Tisch 1", "Espresso", "vor 9 Min."]];
    rows.forEach(([a, b, c], i) => { const ry = y + 130 + off + i * 130; if (ry > y + h - 140) return; fillRR(g, x + 50, ry, w - 100, 110, 22, "#ffffff"); txt(g, a, x + 90, ry + 40, { w: 900, px: 28, c: INK, al: "left" }); txt(g, b, x + 90, ry + 78, { w: 600, px: 24, c: "rgba(27,21,48,0.6)", al: "left" }); txt(g, c, x + w - 90, ry + 56, { w: 600, px: 22, c: "rgba(27,21,48,0.45)", al: "right" }); });
    if (nk > 0) { const ry = y + 130; g.save(); g.globalAlpha = cl(nk * 2); g.translate(0, (1 - cl(nk)) * -60); fillRR(g, x + 50, ry, w - 100, 110, 22, LIME); txt(g, "Tisch 4", x + 90, ry + 40, { w: 900, px: 30, c: INK, al: "left", fam: "K" });
      const ck = seg(u, T.capp - 0.1, T.capp + 0.2); txt(g, "2 Cappuccino", x + 90, ry + 79, { w: 700, px: 26, c: hexA(INK, 0.4 + 0.6 * ck), al: "left" }); fillRR(g, x + w - 200, ry + 34, 110, 42, 21, INK); txt(g, "NEU", x + w - 145, ry + 56, { w: 900, px: 22, c: LIME }); g.restore(); }
    g.restore();
  }
  function wallet(g, u, T, k) {
    g.save(); const w = 700, h = 440, x = 540 - w / 2, y = 1150; g.translate(540, y + h / 2); g.scale(cl(k) * 0.2 + 0.8 * k, k); g.translate(-540, -(y + h / 2));
    shadow(g, 50, 18, "rgba(27,21,48,0.35)"); fillRR(g, x, y, w, h, 36, INK); noShadow(g);
    cup(g, x + 70, y + 72, 1.3, PINK); txt(g, "Café Zwei", x + 110, y + 74, { w: 900, px: 34, c: "#ffffff", al: "left", fam: "K" });
    txt(g, "Bonuspunkte", x + 60, y + 150, { w: 700, px: 24, c: "rgba(255,255,255,0.6)", al: "left" });
    const filled = u >= T.punkte + 0.3 ? 9 : 8;
    for (let i = 0; i < 10; i++) { const cx = x + 90 + (i % 5) * 130, cy = y + 225 + Math.floor(i / 5) * 95; const on = i < filled; const pop = i === 8 ? outBack(seg(u, T.punkte + 0.3, T.punkte + 0.6), 3) : 1;
      g.save(); g.translate(cx, cy); if (i === 8 && on) g.scale(pop, pop); circle(g, 0, 0, 34, on ? PINK : "rgba(255,255,255,0.12)"); if (on) cup(g, -2, 2, 0.9, "#ffffff"); g.restore(); }
    txt(g, filled + " von 10", x + w - 60, y + 74, { w: 900, px: 28, c: LIME, al: "right" });
    const ck = outBack(seg(u, T.wallet - 0.1, T.wallet + 0.25), 2);
    if (ck > 0) [["Apple Wallet", -170], ["Google Wallet", 170]].forEach(([s, dx]) => { g.save(); g.translate(540 + dx, y + h + 70); g.scale(ck, ck); shadow(g, 20, 6, "rgba(27,21,48,0.2)"); fillRR(g, -150, -34, 300, 68, 34, "#ffffff"); noShadow(g); txt(g, s, 0, 2, { w: 900, px: 26, c: INK }); g.restore(); });
    g.restore();
  }
})();
