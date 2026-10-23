// Kern: baut Ebenen aus SPEC, verteilt Wörter auf Phrasen, Übergänge, Kamera, render(t), Ton-Ereignisse.
const TRANS = ["zoom", "slide_up", "iris", "slide_left", "flash", "diag", "split", "spin", "push_down", "blur"];
const MODES = ["rise", "slam", "skew", "drop", "track", "speed", "stamp", "rise", "slam", "glow"];
const SC = [];
let READY = false;

function setup() {
  if (READY) return; READY = true;
  const cam = $("cam"); const scenes = SPEC.scenes; let lastPal = "", lastTr = "", trI = Math.floor(R(5) * TRANS.length);
  scenes.forEach((s, i) => {
    const T = TYPES[s.type] || TYPES.statement; const p = s.params || {};
    let pal = s.pal || T.pal;
    if (LOOK.pals && !String(s.type).startsWith("h_")) { const L = LOOK.pals; pal = L[(i + SEED) % L.length]; if (pal === lastPal) pal = L[(i + SEED + 1) % L.length]; }
    else if (!LOOK.pals && s.type === "cta" && !s.pal) { const C = ["violet", "crimson", "navy", "black", "sunset", "gold"]; pal = C[SEED % C.length]; }
    if (pal === lastPal && !LOOK.pals) { const keys = Object.keys(PAL).filter((k) => k !== lastPal && PAL[k].dark === PAL[pal].dark); pal = keys[Math.floor(R(i * 3) * keys.length)]; }
    lastPal = pal; let tr = s.tr; if (!tr) { tr = TRANS[trI % TRANS.length]; trI += 1 + Math.floor(R(i * 9) * 2); if (tr === lastTr) tr = TRANS[(trI++) % TRANS.length]; } lastTr = tr;
    const t0 = s.t0, t1 = i + 1 < scenes.length ? scenes[i + 1].t0 : SPEC.dur; const zone = s.zone || T.zone;
    const gc = zone === "top" ? 1070 : zone === "bottom" ? 790 : 960;
    const el = document.createElement("div"); el.className = "layer"; el.style.zIndex = String(i + 1);
    const inner = document.createElement("div"); inner.style.cssText = "position:absolute;inset:0;transform-origin:50% 50%";
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const tx = document.createElement("div"); tx.className = "txt";
    inner.appendChild(cv); el.appendChild(inner); el.appendChild(tx); cam.appendChild(el);
    const o = { i, type: s.type, T, p, pal, P: PAL[pal] || PAL.navy, tr, t0, t1, d: t1 - t0, zone, gc, el, inner, cv, g: cv.getContext("2d"), tx, st: {}, bgv: T.bgv != null ? T.bgv : 0, phrases: [] };
    if (s.bgv != null) o.bgv = s.bgv; if (T.prep) T.prep(o, p); SC.push(o);
  });
  buildPhrases();
  $("grain").style.opacity = String(LOOK.grain);
  if (LOOK.ovl === "letterbox") $("ovl").innerHTML = '<div class="bar" style="top:0"></div><div class="bar" style="bottom:0"></div>';
  if (LOOK.ovl === "scan") { $("ovl").style.background = "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0 2px, rgba(0,0,0,0) 2px 5px)"; }
  // Körnung
  const gc = $("grain").getContext("2d"); const im = gc.createImageData(1160, 2000); for (let i = 0; i < im.data.length; i += 4) { const v = Math.floor(rnd(i * 0.37) * 255); im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } gc.putImageData(im, 0, 0);
}

function cleanWord(w) { return w.replace(/^[„"‚'(]+/, "").replace(/[,;:.“"‘')]+$/, "").replace(/[–—]/g, ""); }

function buildPhrases() {
  const words = SPEC.words || [];
  SC.forEach((sc) => {
    const ws = words.filter((w) => w.scene === sc.i); let cur = [];
    const flush = () => { if (cur.length) sc.phrases.push(cur); cur = []; };
    ws.forEach((w, j) => { const disp = cleanWord(w.w); if (!disp) return; cur.push({ ...w, disp });
      const chars = cur.reduce((a, x) => a + x.disp.length + 1, 0); const endP = /[.,!?:;]$/.test(w.w); const nxt = ws[j + 1];
      if (w.br || endP || cur.length >= 3 || chars > 15 || (nxt && chars + cleanWord(nxt.w).length > 18)) flush(); });
    flush();
    // kurze Restphrase an die vorige hängen
    for (let k = sc.phrases.length - 1; k > 0; k--) { const ph = sc.phrases[k]; if (ph.length === 1 && ph[0].disp.length <= 3 && sc.phrases[k - 1].length < 3 && !/[.!?]$/.test(sc.phrases[k - 1][sc.phrases[k - 1].length - 1].w)) { sc.phrases[k - 1].push(...ph); sc.phrases.splice(k, 1); } }
    const P = sc.P;
    sc.phrases = sc.phrases.map((ph, k) => {
      const div = document.createElement("div"); div.className = "ph"; const hasAcc = ph.some((w) => w.acc);
      const mode = MODES[Math.floor(R(sc.i * 31 + k * 7) * MODES.length)];
      const spans = ph.map((w) => { const s = document.createElement("span"); s.className = "w"; s.textContent = w.disp; s.style.color = w.acc ? P.acc : P.fg;
        if (w.acc && P.acc === "#fde047") s.style.color = "#fde047"; div.appendChild(s); return { el: s, t: w.t, acc: w.acc, mode: w.acc ? (R(w.t * 3) > 0.5 ? "slam" : "stamp") : mode }; });
      // Markierung hinter Akzentwort
      if (hasAcc && R(sc.i * 13 + k) > 0.45) spans.forEach((s) => { if (s.acc) { s.el.style.background = P.acc; s.el.style.color = P.dark && P.acc !== "#fde047" ? "#fff" : (P.acc === "#fde047" ? "#0b1220" : "#fff"); s.el.style.padding = "0 .18em"; s.el.style.borderRadius = ".12em"; } });
      if (!P.dark) div.style.textShadow = "none"; else div.style.textShadow = "0 6px 30px rgba(0,0,0,0.35)";
      capStyle(div, spans, P, sc);
      sc.tx.appendChild(div);
      // Größe: so groß wie möglich, eine Zeile bis 940 px, sonst zwei Zeilen
      let fs = Math.round((sc.zone === "center" ? 170 : 132) * (CAPSIZE[LOOK.cs] || 1)); div.style.fontSize = fs + "px"; div.style.whiteSpace = "nowrap";
      const MAXW = 860; const wpx = div.scrollWidth; if (wpx > MAXW) { fs = Math.max(76, Math.floor(fs * MAXW / wpx)); div.style.fontSize = fs + "px"; if (div.scrollWidth > MAXW) div.style.whiteSpace = "normal"; }
      const hpx = div.offsetHeight; const baseY = LOOK.capY || (sc.zone === "top" ? 410 : sc.zone === "bottom" ? 1440 : 960);
      const jq = LOOK.calm ? 0 : 1; const jy = (R(sc.i * 5 + k * 3) - 0.5) * 70 * jq, jx = (R(sc.i * 3 + k * 5) - 0.5) * 40 * jq; div.style.top = (baseY - hpx / 2 + jy) + "px"; div.style.left = (70 + jx) + "px";
      const flatPh = LOOK.cs === "box" || LOOK.cs === "sticker" || LOOK.cs === "mono" || LOOK.calm;
      const start = ph[0].t - 0.08; return { div, spans, start, rx: flatPh ? 0 : (R(k * 11 + sc.i) - 0.5) * 16, ry: flatPh ? 0 : (R(k * 17 + sc.i) - 0.5) * 22, dir: k % 2 ? 1 : -1, mode, rot: LOOK.cs === "sticker" ? (R(k * 5 + sc.i) - 0.5) * 7 : LOOK.cs === "box" ? (R(k * 9 + sc.i) - 0.5) * 3 : 0 };
    });
    sc.phrases.forEach((ph, k) => { const nx = sc.phrases[k + 1]; ph.end = nx ? nx.start : sc.t1 + TR + 0.5; });
  });
}

function wordFx(sp, t, P) {
  const { el, mode: m } = sp; const t0 = sp.t;
  if (t < t0 - 0.06) { el.style.opacity = 0; return; }
  let o = 1, tf = "", f = "", ts = "";
  if (m === "slam") { const p = seg(t, t0 - 0.03, t0 + 0.17), e = outExpo(p); o = cl(p * 4); tf = `scale(${lerp(2.2, 1, e)})`; f = `blur(${(1 - e) * 14}px)`; }
  else if (m === "rise") { const p = seg(t, t0 - 0.05, t0 + 0.24), e = out3(p); o = cl(p * 2); tf = `translateY(${(1 - e) * 70}px)`; f = `blur(${(1 - e) * 12}px)`; }
  else if (m === "drop") { const p = seg(t, t0 - 0.05, t0 + 0.3), e = outBack(p, 1.9); o = cl(p * 3); tf = `translateY(${(1 - e) * -90}px)`; f = `blur(${(1 - cl(p * 1.5)) * 10}px)`; }
  else if (m === "skew") { const p = seg(t, t0 - 0.05, t0 + 0.25), e = out3(p); o = cl(p * 2.5); tf = `translateX(${(1 - e) * -160}px) skewX(${(1 - e) * -24}deg)`; f = `blur(${(1 - e) * 14}px)`; }
  else if (m === "speed") { const p = seg(t, t0 - 0.04, t0 + 0.22), e = outExpo(p); o = cl(p * 3); tf = `translateX(${(1 - e) * -600}px) skewX(${-10 - (1 - e) * 20}deg)`; const gg = 1 - seg(t, t0, t0 + 0.5);
    const c = P.dark ? "255,255,255" : "20,20,20"; ts = `${-50 * gg}px 0 0 rgba(${c},${0.3 * gg}), ${-110 * gg}px 0 0 rgba(${c},${0.15 * gg})`; if (gg <= 0) tf = "skewX(-10deg)"; }
  else if (m === "glow") { const p = seg(t, t0 - 0.04, t0 + 0.3), e = out3(p); const fl = p < 1 ? (rnd(Math.floor(t * 30)) > 0.35 ? 1 : 0.25) : 1; o = cl(p * 2) * fl; tf = `scale(${lerp(1.25, 1, e)})`; }
  else if (m === "track") { const p = seg(t, t0 - 0.03, t0 + 0.4), e = out3(p); o = cl(p * 2); el.style.letterSpacing = lerp(0.35, 0, e) + "em"; f = `blur(${(1 - e) * 12}px)`; }
  else if (m === "cut") { const p = seg(t, t0 - 0.02, t0 + 0.07); o = t >= t0 - 0.02 ? 1 : 0; tf = `scale(${lerp(1.3, 1, outExpo(p))})`; }
  else if (m === "pop") { const p = seg(t, t0 - 0.04, t0 + 0.24), e = outBack(p, 2.8); o = cl(p * 4); tf = `scale(${Math.max(0, e)}) rotate(${(1 - p) * -14}deg)`; }
  else if (m === "type") { const p = seg(t, t0 - 0.03, t0 + Math.min(0.28, 0.035 * el.textContent.length)); o = p > 0 ? 1 : 0; el.style.clipPath = `inset(0 ${(1 - p) * 100}% 0 0)`; }
  else if (m === "stamp") { const p = seg(t, t0 - 0.02, t0 + 0.16), e = outExpo(p); o = cl(p * 4); tf = `rotate(${lerp(-14, -3, e)}deg) scale(${lerp(2.1, 1, e)})`; }
  el.style.opacity = o; el.style.transform = tf; el.style.filter = f; if (ts || m === "speed") el.style.textShadow = ts;
}

function drawPhrases(sc, t) {
  for (const ph of sc.phrases) {
    if (t < ph.start - 0.1 || t > ph.end + 0.05) { ph.div.style.visibility = "hidden"; continue; }
    ph.div.style.visibility = "visible"; const ex = seg(t, ph.end - 0.13, ph.end); const ent = out3(seg(t, ph.start - 0.05, ph.start + 0.3));
    const dx = LOOK.calm ? 0 : ex * ph.dir * 260, dy = LOOK.calm ? -ex * 10 : -ex * 40; const blur = ex * (LOOK.calm ? 8 : 18);
    ph.div.style.transform = `translate(${dx}px,${dy + (1 - ent) * 20}px) rotate(${ph.rot || 0}deg) rotateX(${ph.rx}deg) rotateY(${ph.ry * (1 - ex) + (LOOK.calm ? 0 : ph.dir * ex * 30)}deg) scale(${lerp(LOOK.calm ? 1 : 1.06, 1, ent)})`;
    ph.div.style.opacity = 1 - ex; ph.div.style.filter = blur > 0.2 ? `blur(${blur}px)` : "";
    for (const sp of ph.spans) wordFx(sp, t, sc.P);
  }
}

function transIn(sc, t) { // Stil der eingehenden Szene während des Übergangs
  const v = seg(t, sc.t0, sc.t0 + TR); const e = inOut(v); const el = sc.el; el.style.clipPath = ""; el.style.filter = ""; el.style.opacity = 1; el.style.transform = "";
  if (sc.i === 0 || v >= 1) return 1;
  switch (sc.tr) {
    case "zoom": el.style.transform = `scale(${lerp(1.5, 1, out3(v))})`; el.style.opacity = cl(v * 2.2); break;
    case "slide_up": el.style.transform = `translateY(${(1 - outExpo(v)) * 1920}px)`; break;
    case "push_down": el.style.transform = `translateY(${-(1 - outExpo(v)) * 1920}px)`; break;
    case "slide_left": el.style.transform = `translateX(${(1 - outExpo(v)) * 1080}px)`; break;
    case "iris": el.style.clipPath = `circle(${e * 1150}px at 540px ${SC[sc.i - 1].gc}px)`; break;
    case "diag": { const k = e * 2.2; el.style.clipPath = `polygon(0 0, ${k * 100}% 0, ${(k - 1.2) * 100}% 100%, 0 100%)`; break; }
    case "split": el.style.clipPath = `inset(0 ${(1 - e) * 50}% 0 ${(1 - e) * 50}%)`; break;
    case "spin": el.style.transform = `rotate(${(1 - out3(v)) * -28}deg) scale(${lerp(0.55, 1, out3(v))})`; el.style.opacity = cl(v * 2); break;
    case "blur": el.style.opacity = e; el.style.filter = `blur(${(1 - e) * 24}px)`; break;
    case "flash": el.style.opacity = v > 0.45 ? 1 : 0; break;
  }
  return v;
}
function transOut(prev, next, t) { // ausgehende Szene reagiert
  const v = seg(t, next.t0, next.t0 + TR); if (v <= 0 || v >= 1) return; const e = inOut(v);
  switch (next.tr) {
    case "zoom": prev.el.style.transform = `scale(${lerp(1, 0.82, e)})`; prev.el.style.filter = `blur(${e * 10}px)`; break;
    case "slide_up": prev.el.style.transform = `translateY(${-e * 500}px)`; break;
    case "push_down": prev.el.style.transform = `translateY(${e * 500}px)`; break;
    case "slide_left": prev.el.style.transform = `translateX(${-e * 420}px)`; break;
    case "spin": prev.el.style.transform = `rotate(${e * 14}deg) scale(${lerp(1, 1.3, e)})`; prev.el.style.opacity = 1 - e; break;
    case "blur": prev.el.style.filter = `blur(${e * 24}px)`; break;
  }
}

let ACCS = null;
function punch(t) { if (!ACCS) ACCS = (SPEC.words || []).filter((w) => w.acc).map((w) => w.t); let z = 0; for (const a of ACCS) if (t >= a && t < a + 0.4) z += LOOK.punch * Math.exp(-(t - a) / 0.09); return Math.min(z, LOOK.punch * 1.4); }
function hitK(t) { if (!HITS) shake(0); let k = 0; for (const [h] of HITS) if (t >= h && t < h + 0.25) k = Math.max(k, 1 - (t - h) / 0.25); if (!ACCS) punch(0); for (const a of ACCS) if (t >= a && t < a + 0.18) k = Math.max(k, 0.6 * (1 - (t - a) / 0.18)); return k; }
let HITS = null;
function shake(t) {
  if (!HITS) HITS = EVENTS().filter((e) => ["boom", "thump", "slap", "glass", "thunder"].includes(e[1])).map((e) => [e[0], e[1] === "boom" || e[1] === "glass" ? 20 : e[1] === "thunder" ? 14 : 7]);
  let x = 0, y = 0, r = 0;
  for (const [h, a] of HITS) if (t >= h && t < h + 0.4) { const k = a * Math.exp(-(t - h) / 0.08); x += Math.sin(t * 91) * k; y += Math.cos(t * 77) * k; r += Math.sin(t * 53) * k * 0.05; }
  return `translate(${x}px,${y}px) rotate(${r}deg)`;
}

function render(t) {
  setup();
  let flash = 0;
  for (const sc of SC) {
    const vis = t >= sc.t0 - 0.001 && t < sc.t1 + TR; sc.el.style.visibility = vis ? "visible" : "hidden"; if (!vis) continue;
    transIn(sc, t); const nx = SC[sc.i + 1]; if (nx) transOut(sc, nx, t);
    if (sc.tr === "flash" && sc.i > 0) { const v = seg(t, sc.t0, sc.t0 + TR); flash = Math.max(flash, v < 0.45 ? v / 0.45 : 1 - (v - 0.45) / 0.55); }
    const u = t - sc.t0; const k = cl(u / Math.max(0.5, sc.d)); const z = 1 + 0.045 * k; const dx = Math.sin(sc.i * 1.7) * 18 * k, dy = Math.cos(sc.i * 2.3) * 14 * k;
    sc.inner.style.transform = `translate(${dx}px,${dy}px) scale(${z})`;
    const g = sc.g; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; noShadow(g); g.clearRect(0, 0, W, H);
    sc.T.draw(g, u, sc.d, sc.p, sc, sc.P);
    drawPhrases(sc, t);
  }
  hookText(t);
  $("flash").style.opacity = flash * 0.9;
  $("cam").style.transform = shake(t) + ` scale(${1 + punch(t)})`;
  if (LOOK.rgb) { const h = hitK(t); $("cam").style.filter = h > 0.05 ? `drop-shadow(${10 * h}px 0 0 rgba(255,0,90,0.55)) drop-shadow(${-10 * h}px 0 0 rgba(0,240,255,0.55))` : ""; }
  const gr = $("grain"); gr.style.transform = `translate(${-Math.floor(rnd(Math.floor(t * 30)) * 40)}px,${-Math.floor(rnd(Math.floor(t * 30) + 7) * 40)}px)`;
}

// Text-Hook oben (für Stummschauer): erscheint ab Bild 0, bleibt während Szene 1
const HT_STYLES = [{ bg: "#ffffff", c: "#0b0b0b" }, { bg: "#fde047", c: "#0b0b0b" }, { bg: "#ef4444", c: "#ffffff" }, { bg: "rgba(0,0,0,0)", c: "#ffffff", outline: true }, { bg: "#0b0b0b", c: "#ffffff" }];
function hookText(t) {
  const box = $("hooktext"); const txt = SPEC.hook_text; if (!txt || !SC.length || LOOK.hideHook) { box.style.visibility = "hidden"; return; }
  const sp = box.firstChild; if (!sp.dataset.ok) { sp.dataset.ok = 1; sp.innerHTML = txt.replace(/\*([^*]+)\*/g, "<u>$1</u>"); headFont(sp); let st = HT_STYLES[SPEC.hook_style != null ? SPEC.hook_style : Math.floor(R(77) * HT_STYLES.length)]; if (st.outline && (LOOK.cs === "serif" || LOOK.cs === "mono")) st = HT_STYLES[1];
    sp.style.background = st.bg; sp.style.color = st.c; if (st.outline) { sp.style.webkitTextStroke = "3px #000"; sp.style.textShadow = "0 6px 0 #000, 0 10px 30px rgba(0,0,0,0.6)"; } else sp.style.boxShadow = "0 18px 50px rgba(0,0,0,0.35)";
    sp.querySelectorAll("u").forEach((u) => { u.style.textDecoration = "none"; u.style.color = st.bg === "#ef4444" ? "#fde047" : st.bg === "#fde047" ? "#dc2626" : st.outline ? "#fde047" : "#dc2626"; });
    if (sp.offsetWidth > 960) sp.style.fontSize = Math.floor(74 * 960 / sp.offsetWidth) + "px"; }
  const end = SC[0].t1 + 0.1; if (t > end + 0.2) { box.style.visibility = "hidden"; return; }
  box.style.visibility = "visible"; const k = seg(t, -0.1, 0.12); const ex = seg(t, end - 0.05, end + 0.15);
  const wig = Math.sin(t * 9) * 1.2 * (1 - ex);
  box.style.transform = `translateY(${-ex * 120}px) scale(${lerp(1.35, 1, outBack(k, 2.2)) * (1 - 0.2 * ex)}) rotate(${wig - 1.5}deg)`; box.style.opacity = cl(k * 3) * (1 - ex);
}
// Titelbild: Hook-Szene im besten Moment + großer Titel in der 3:4-Mitte
function renderCover() {
  setup(); const s0 = SC[0]; const t = s0.t0 + (s0.T.coverT != null ? Math.min(s0.T.coverT, s0.d) : Math.min(s0.d * 0.6, 1.6));
  render(t); SC.forEach((sc) => sc.phrases.forEach((ph) => (ph.div.style.visibility = "hidden"))); $("hooktext").style.visibility = "hidden"; $("flash").style.opacity = 0; $("cam").style.transform = "scale(1.06)"; $("cam").style.filter = "blur(7px) brightness(0.62) saturate(1.15)";
  const c = $("cover"); const h = c.querySelector("h1"); h.innerHTML = (SPEC.cover_title || SPEC.hook_text || "").replace(/\*([^*]+)\*/g, "<em>$1</em>"); headFont(h); if (LOOK.cs === "serif") h.querySelectorAll("em").forEach((e) => (e.style.fontStyle = "italic"));
  c.style.visibility = "visible"; let fs = 128; h.style.fontSize = fs + "px"; while (h.offsetHeight > 700 && fs > 70) { fs -= 6; h.style.fontSize = fs + "px"; }
}
window.renderCover = renderCover;

function EVENTS() {
  setup(); const E = [];
  SC.forEach((sc) => { const ev = sc.T.ev ? sc.T.ev(sc.d, sc.p) : []; ev.forEach((e) => { if (e[0] <= sc.d + 0.2) E.push([sc.t0 + e[0], e[1], e[2] == null ? 0.5 : e[2], e[3] || 0, e[4] || 0]); });
    if (sc.i > 0) E.push([sc.t0 - 0.12, sc.tr === "flash" ? "flash" : sc.tr.startsWith("slide") || sc.tr === "push_down" || sc.tr === "diag" ? "whoosh_side" : "whoosh_up", 0.45, 0, 0]); });
  return E.sort((a, b) => a[0] - b[0]);
}
function INFO() { setup(); const s0 = SC[0]; return { cover_t: s0.t0 + (s0.T.coverT != null ? Math.min(s0.T.coverT, s0.d - 0.1) : Math.min(s0.d * 0.6, 1.6)), music: SPEC.music || "", dur: SPEC.dur, drop: (SC.find((s) => s.T.drop) || SC[Math.min(2, SC.length - 1)]).t0, scenes: SC.map((s) => ({ i: s.i, type: s.type, t0: s.t0, t1: s.t1, pal: s.pal, tr: s.tr, phrases: s.phrases.map((p) => p.spans.map((x) => x.el.textContent).join(" ")) })), cta: (SC.find((s) => s.type === "cta") || {}).t0 }; }
window.render = render; window.EVENTS = EVENTS; window.INFO = INFO;

// ---------- Untertitel-Stile der Looks ----------
const CAPSIZE = { subtle: 0.4, box: 1.3, serif: 1.18, cine: 1.15, mono: 0.8, sticker: 1.0, glow: 0.92, plain: 1 };
function headFont(el) { // Schrift für Hook-Text und Titelbild passend zum Look
  if (LOOK_KEY === "clean") return; el.style.fontFamily = LOOK.cap; el.style.fontWeight = String(LOOK.capW);
  if (LOOK.upper) { el.style.textTransform = "uppercase"; el.style.letterSpacing = LOOK.cs === "cine" ? "0.03em" : "0"; }
  if (LOOK.cs === "serif") { el.style.letterSpacing = "-0.01em"; if (el.tagName === "SPAN") el.style.fontSize = "92px"; }
}
function capStyle(div, spans, P, sc) {
  const cs = LOOK.cs; div.style.fontFamily = LOOK.cap; div.style.fontWeight = String(LOOK.capW);
  if (LOOK.upper) div.style.textTransform = "uppercase";
  const accs = spans.filter((s) => s.acc);
  if (cs === "plain") { div.style.letterSpacing = "-0.03em"; return; }
  if (cs === "subtle") { div.style.letterSpacing = "-0.01em"; div.style.lineHeight = "1.25"; div.style.textShadow = "none";
    spans.forEach((s) => { s.el.style.color = P.fg; s.el.style.background = "none"; s.el.style.padding = "0"; s.el.style.fontWeight = s.acc ? "700" : "500"; s.el.style.margin = "0 0.13em"; s.mode = "rise"; }); return; }
  if (cs === "box") { div.style.lineHeight = "1.12"; div.style.letterSpacing = "0"; div.style.textShadow = "none";
    const bg = P.dark ? "#ffffff" : "#0a0a0a", fg = P.dark ? "#0a0a0a" : "#ffffff";
    spans.forEach((s) => { const a = s.acc; s.el.style.background = a ? P.acc : bg; s.el.style.color = a ? inkOn(P.acc) : fg; s.el.style.padding = "0.02em 0.14em 0"; s.el.style.margin = "0 0.05em 0.06em"; s.el.style.borderRadius = "0"; s.mode = a ? "stamp" : "cut"; });
    return; }
  if (cs === "glow") { div.style.letterSpacing = "-0.03em"; div.style.lineHeight = "1.08";
    spans.forEach((s) => { const c = s.acc ? P.acc2 : P.acc; s.el.style.color = s.acc ? P.acc2 : "#ffffff"; s.el.style.background = "none"; s.el.style.padding = "0"; s.el.style.textShadow = `0 0 10px ${c}, 0 0 30px ${hexA(c, 0.85)}, 0 0 60px ${hexA(c, 0.5)}`; if (!s.acc && s.mode === "speed") s.mode = "glow"; });
    div.style.textShadow = "none"; return; }
  if (cs === "serif") { div.style.letterSpacing = "-0.01em"; div.style.lineHeight = "0.98"; div.style.textShadow = "none";
    spans.forEach((s) => { s.el.style.color = s.acc ? P.acc : P.fg; s.el.style.background = "none"; s.el.style.padding = "0"; if (s.acc) s.el.style.fontStyle = "italic"; s.mode = s.acc ? "rise" : (s.mode === "speed" || s.mode === "glow" ? "rise" : s.mode === "slam" ? "track" : s.mode); });
    return; }
  if (cs === "sticker") { div.style.letterSpacing = "-0.01em"; div.style.lineHeight = "1.12";
    spans.forEach((s) => { s.el.style.background = s.acc ? P.acc : "none"; s.el.style.color = s.acc ? inkOn(P.acc) : "#ffffff"; s.el.style.padding = s.acc ? "0 0.14em" : "0"; s.el.style.borderRadius = "0.12em";
      s.el.style.webkitTextStroke = s.acc ? "0" : "0.075em #111"; s.el.style.paintOrder = "stroke fill"; s.el.style.textShadow = s.acc ? "none" : "0.06em 0.07em 0 #111"; s.el.style.boxShadow = s.acc ? "0.06em 0.07em 0 #111" : "none"; s.mode = "pop"; });
    div.style.textShadow = "none"; return; }
  if (cs === "mono") { div.style.letterSpacing = "-0.04em"; div.style.lineHeight = "1.12"; div.style.textAlign = "left";
    spans.forEach((s) => { s.el.style.color = s.acc ? "#000" : P.acc; s.el.style.background = s.acc ? P.acc : "none"; s.el.style.padding = s.acc ? "0 0.12em" : "0"; s.el.style.borderRadius = "0"; s.el.style.textShadow = s.acc ? "none" : `0 0 18px ${hexA(P.acc, 0.55)}`; s.mode = "type"; });
    const pr = document.createElement("span"); pr.className = "w"; pr.textContent = ">"; pr.style.color = P.sub; pr.style.opacity = 1; div.insertBefore(pr, div.firstChild);
    div.style.textShadow = "none"; return; }
  if (cs === "cine") { div.style.letterSpacing = "0.03em"; div.style.lineHeight = "1.0";
    spans.forEach((s) => { s.el.style.color = s.acc ? P.acc : "#ffffff"; s.el.style.background = "none"; s.el.style.padding = "0"; s.mode = s.acc ? "track" : "rise"; });
    div.style.textShadow = "0 6px 30px rgba(0,0,0,0.6)"; return; }
}
