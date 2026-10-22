"""Musik + Effekte für ein Reel, komplett synthetisch (keine fremden Samples).
Aufruf: python3 audio.py <ordner>  (liest events.json + info.json, schreibt music.wav + sfx.wav)"""
import sys, json, wave, numpy as np
D = sys.argv[1]
EV = json.load(open(D + "/events.json")); INFO = json.load(open(D + "/info.json"))
SR = 44100; DUR = INFO["dur"]; N = int(SR * (DUR + 0.5))
seed = sum(ord(c) for c in INFO.get("id", "x")); rng = np.random.default_rng(seed)
music = np.zeros((N, 2)); sfx = np.zeros((N, 2))
def T(n): return np.arange(n) / SR
def add(buf, at, sig, gain=1.0, pan=0.0):
    i = int(at * SR)
    if i >= N or i < 0: return
    sig = sig[: N - i]
    l, r = np.cos((pan + 1) * np.pi / 4) * 1.41, np.sin((pan + 1) * np.pi / 4) * 1.41
    buf[i:i + len(sig), 0] += sig * gain * l; buf[i:i + len(sig), 1] += sig * gain * r
def lpf(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X / (1 + (f / fc) ** 4), len(x))
def bpf(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); return np.fft.irfft(X * ((f > lo) & (f < hi)), len(x))
def lpv(x, cut):
    a = 1 - np.exp(-2 * np.pi * np.asarray(cut, dtype=float) / SR); a = np.broadcast_to(a, x.shape); y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a[i] * (x[i] - acc); y[i] = acc
    return y
def mid(m): return 440 * 2 ** ((m - 69) / 12)
def mx(*sig):
    n = max(len(x) for x in sig); out = np.zeros(n)
    for x in sig: out[:len(x)] += x
    return out

# ---------- Klangbausteine ----------
def kick(g=1.0, d=0.45):
    n = int(d * SR); t = T(n); f = 44 + 120 * np.exp(-t * 32)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5); s[:80] += rng.standard_normal(80) * 0.35 * np.linspace(1, 0, 80)
    return np.tanh(s * 1.4) * g
def clap(g=0.5):
    n = int(0.25 * SR); t = T(n); x = bpf(rng.standard_normal(n), 900, 6000)
    env = np.exp(-t * 22) + 0.6 * np.exp(-np.abs(t - 0.012) * 400) + 0.5 * np.exp(-np.abs(t - 0.024) * 400)
    return np.tanh(x * env * 2) * g
def hat(g=0.18, op=False):
    n = int((0.16 if op else 0.05) * SR); t = T(n); return bpf(rng.standard_normal(n), 7000, 16000) * np.exp(-t * (20 if op else 90)) * g
def saw(f, d, det=(-0.1, 0, 0.1)):
    n = int(d * SR); t = T(n); s = np.zeros(n)
    for dd in det: s += 2 * ((t * f * (1 + dd / 100) + rng.random()) % 1) - 1
    return s / len(det)
def pluck(f, d=0.35, g=0.2):
    n = int(d * SR); t = T(n); s = saw(f, d) + 0.5 * saw(2 * f, d, (0,))
    return lpv(s, 400 + 5000 * np.exp(-t * 18)) * np.exp(-t * 7) * g
def sub(f, d, g=0.5):
    n = int(d * SR); t = T(n); return (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(4 * np.pi * f * t)) * np.minimum(1, t / 0.01) * np.minimum(1, (d - t) / 0.03) * g
def pad(freqs, d, g=0.12, fc=1500):
    s = sum(saw(f, d, (-0.15, 0, 0.13)) for f in freqs) / len(freqs)
    t = T(len(s)); return lpf(s, fc) * np.minimum(1, t / 0.6) * np.minimum(1, (d - t) / 0.8) * g
def boom(g=1.0, d=2.2):
    n = int(d * SR); t = T(n)
    b = np.sin(2 * np.pi * np.cumsum(28 + 80 * np.exp(-t * 5)) / SR) * np.exp(-t * 2.0)
    c = lpf(rng.standard_normal(n), 2500) * np.exp(-t * 14) * 0.7
    return np.tanh((b + c) * 1.7) * g
def thump(g=0.8): return mx(kick(g, 0.8), boom(g * 0.35, 0.8))
def whoosh(d=0.5, up=True, g=0.5, lo=300, hi=7000):
    n = int(d * SR); t = T(n) / d; x = rng.standard_normal(n)
    cut = lo + (hi - lo) * (t ** 2 if up else (1 - t) ** 1.5)
    return lpv(x, cut) * np.sin(np.pi * np.clip(t, 0, 1)) ** 2 * g
def riser(d, g=0.5):
    n = int(d * SR); t = T(n) / d
    nz = lpv(rng.standard_normal(n), 300 + 9000 * t ** 2.2)
    tone = np.sin(2 * np.pi * np.cumsum(180 + 1100 * t ** 2.5) / SR)
    return (nz * 0.7 + tone * 0.22) * t ** 2.3 * g
def click(g=0.5):
    n = int(0.03 * SR); t = T(n); return (bpf(rng.standard_normal(n), 1500, 9000) * np.exp(-t * 400) + np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 300) * 0.5) * g
def tick(f=2600, g=0.3):
    n = int(0.03 * SR); t = T(n); return np.sin(2 * np.pi * f * t) * np.exp(-t * 180) * g
def blip(f0, f1, d=0.08, g=0.3):
    n = int(d * SR); t = T(n); f = f0 + (f1 - f0) * t / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5 / d) * g
def pop(g=0.4): return mx(blip(1100, 300, 0.08, g), kick(g * 0.25, 0.08))
def chime(f, d=0.8, g=0.3):
    n = int(d * SR); t = T(n); return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9)) * np.exp(-t * 5) * g
def glass(g=0.8):
    n = int(1.4 * SR); out = np.zeros(n); t = T(n)
    out += bpf(rng.standard_normal(n), 2500, 14000) * np.exp(-t * 9) * 0.8
    for k in range(70):
        st = int(rng.random() ** 1.8 * 0.9 * SR); m = int(0.25 * SR); tt = T(m); f = 2500 + rng.random() * 7000
        p = np.sin(2 * np.pi * f * tt) * np.exp(-tt * (25 + rng.random() * 30)) * (0.3 + 0.7 * rng.random())
        e = min(n, st + m); out[st:e] += p[: e - st] * 0.35
    return np.tanh(out) * g
def ring(d, g=0.18):
    n = int(d * SR); t = T(n); f = np.where((t * 18) % 1 < 0.5, 1318.5, 1567.98)
    gate = ((t % 0.6) < 0.38).astype(float)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * gate * g
def thunder(g=0.9):
    n = int(1.8 * SR); t = T(n)
    cr = bpf(rng.standard_normal(n), 1500, 12000) * np.exp(-t * 30)
    rum = lpf(rng.standard_normal(n), 220) * np.exp(-t * 2.2) * (1 + 0.5 * np.sin(t * 23))
    zap = np.sin(2 * np.pi * np.cumsum(3000 * np.exp(-t * 20) + 80) / SR) * np.exp(-t * 12) * 0.4
    return np.tanh((cr * 1.2 + rum * 2.5 + zap) * 1.3) * g
def suck(g=0.5):
    n = int(0.45 * SR); t = T(n) / 0.45
    tone = np.sin(2 * np.pi * np.cumsum(1400 * (1 - t) ** 2 + 120) / SR) * (1 - t) * 0.5
    return (tone + whoosh(0.45, False, 0.6)) * g
def slap(g=0.8):
    n = int(0.3 * SR); t = T(n); return np.tanh((bpf(rng.standard_normal(n), 300, 5000) * np.exp(-t * 35) * 2 + kick(0.6, 0.3)[:n])) * g
def cash(g=0.4):
    out = np.zeros(int(1.0 * SR)); add_ = lambda at, s: out.__setitem__(slice(int(at * SR), int(at * SR) + len(s)), out[int(at * SR):int(at * SR) + len(s)] + s)
    add_(0, click(0.8)); add_(0.05, chime(2093, 0.9, 0.5)); add_(0.09, chime(2637, 0.9, 0.4)); return out * g
def shimmer(d=1.2, g=0.25, base=2200):
    n = int(d * SR); s = np.zeros(n)
    for k in range(18):
        st = int(rng.random() * (n - 0.3 * SR)); m = int(0.3 * SR); tt = T(m)
        p = np.sin(2 * np.pi * base * (1 + rng.random() * 1.5) * tt) * np.exp(-tt * 12); s[st:st + m] += p
    return s / 6 * g
def flap(g=0.25):
    n = int(0.04 * SR); t = T(n); return (bpf(rng.standard_normal(n), 800, 5000) * np.exp(-t * 160) + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 200) * 0.4) * g
def keyc(g=0.25):
    n = int(0.025 * SR); t = T(n); return bpf(rng.standard_normal(n), 2000, 9000) * np.exp(-t * 350) * g


def buzz(g=0.5):
    n = int(0.5 * SR); t = T(n); s = np.sign(np.sin(2 * np.pi * 110 * t)) * 0.5 + np.sign(np.sin(2 * np.pi * 111.5 * t)) * 0.5
    return lpf(s, 1800) * np.exp(-t * 4) * g
def glitch(g=0.5):
    n = int(0.25 * SR); out = np.zeros(n)
    for k in range(6):
        st = int(rng.random() * 0.2 * SR); m = int((0.01 + rng.random() * 0.03) * SR); tt = T(m)
        out[st:st + m] += np.sign(np.sin(2 * np.pi * (200 + rng.random() * 3000) * tt))[: max(0, min(m, n - st))] * 0.5
    return bpf(out, 300, 9000) * g
def ping(g=0.3): return mx(chime(1760, 0.9, g), chime(2637, 0.6, g * 0.4))
def ding(g=0.35): return mx(chime(1568, 0.7, g), chime(2349, 0.5, g * 0.5))
def keyc(g=0.25):
    n = int(0.025 * SR); t = T(n); return bpf(rng.standard_normal(n), 2000, 9000) * np.exp(-t * 350) * g
SOUND = {
    "boom": lambda: boom(1.0, 2.2), "thump": lambda: thump(0.85), "slap": lambda: slap(0.9), "glass": lambda: glass(0.9), "thunder": lambda: thunder(0.9),
    "whoosh_up": lambda: whoosh(0.4, True, 0.7, 300, 8000), "whoosh_down": lambda: whoosh(0.4, False, 0.7, 300, 9000), "whoosh_side": lambda: whoosh(0.45, True, 0.7, 500, 6000),
    "flash": lambda: mx(whoosh(0.25, True, 0.5, 2000, 14000), boom(0.25, 0.6)), "tick": lambda: tick(2400, 1.0), "tick_hi": lambda: mx(tick(3000, 1.0), click(0.4)),
    "pop": lambda: pop(1.0), "key": lambda: keyc(1.0), "click": lambda: click(1.0), "ding": lambda: ding(1.0), "chime": lambda: mx(chime(1318.5, 0.9, 1.0), chime(1975.5, 0.9, 0.6)),
    "ping": lambda: ping(1.0), "cash": lambda: cash(1.0), "shimmer": lambda: shimmer(1.4, 1.0), "shimmer_hi": lambda: shimmer(1.0, 1.0, 3200),
    "riser_short": lambda: riser(0.3, 1.0), "buzz": lambda: buzz(1.0), "glitch": lambda: glitch(1.0),
}

# ---------- Effekte aus der Animation ----------
for at, kind, gain, pan, extra in EV:
    if kind == "riser": s = riser(max(0.2, extra or 0.6), 1.0)
    elif kind.startswith("chime_up"): i = int(kind[-1]); s = mx(chime(1318.5 * 2 ** (i * 2 / 12), 0.9, 1.0), shimmer(0.4, 0.4, 3000))
    elif kind.startswith("blip_up"): i = int(kind[-1]); s = blip(500 + i * 160, 900 + i * 220, 0.12, 1.0)
    elif kind in SOUND: s = SOUND[kind]()
    else: continue
    add(sfx, at, s, gain, pan)

# ---------- Musik ----------
KEYS = [  # Akkorde (MIDI), je 4 Takte
    [[42, 49, 54, 57], [38, 45, 50, 54], [45, 52, 57, 61], [40, 47, 52, 56]],
    [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]],
    [[40, 47, 52, 55], [36, 43, 48, 52], [43, 50, 55, 59], [38, 45, 50, 54]],
    [[43, 50, 55, 58], [39, 46, 51, 55], [46, 53, 58, 62], [41, 48, 53, 57]],
]
CH = KEYS[seed % len(KEYS)]; BEAT = 60 / (118 + seed % 9)
sc = INFO["scenes"]; s1 = sc[1]["t0"] if len(sc) > 1 else 2.0; DROP = INFO["drop"]; CTA = INFO.get("cta") or DUR - 4
if DROP <= s1 + 1.0: DROP = s1
# Intro: Drone
add(music, 0, pad([mid(CH[0][0]), mid(CH[0][0] + 7)], s1 + 0.3, 0.22, 420)); add(music, 0, sub(mid(CH[0][0] - 12), s1, 0.25))
# Vor dem Drop: gefilterter Groove
t = s1
while t < DROP - 0.05:
    add(music, t, kick(0.5)); add(music, t + BEAT / 2, hat(0.08))
    t += BEAT
seg_ = s1; k = 0
while seg_ < DROP - 0.1:
    e = min(DROP, seg_ + 4 * BEAT); ch = CH[k % 4]; add(music, seg_, pad([mid(m) for m in ch[1:]], e - seg_ + 0.3, 0.14, 900)); add(music, seg_, sub(mid(ch[0] - 12), e - seg_, 0.32)); seg_ = e; k += 1
if DROP > s1 + 0.8: add(music, max(s1, DROP - 1.6), riser(min(1.6, DROP - s1), 0.45))
# Drop bis zum Aufruf: volles Arrangement
t = DROP; k = 0
while t < CTA - 0.05:
    bar = int(k / 4) % 4; ch = CH[bar]; inbar = k % 4
    add(music, t, kick(0.9))
    if inbar in (1, 3): add(music, t, clap(0.4), 1, 0.05)
    for q in range(4): add(music, t + q * BEAT / 4, hat(0.06 if q % 2 == 0 else 0.1), 1, 0.25)
    for e2 in (0, BEAT / 2): add(music, t + e2 + 0.02, sub(mid(ch[0] - 12), BEAT * 0.45, 0.4))
    arp = [ch[1], ch[2], ch[3], ch[2] + 12]
    for q in range(4): add(music, t + q * BEAT / 4, pluck(mid(arp[(inbar * 4 + q) % 4] + 12), 0.3, 0.07), 1, -0.3 + 0.2 * q)
    if inbar == 0: add(music, t, pad([mid(m) for m in ch[1:]], 4 * BEAT + 0.1, 0.09, 2200))
    t += BEAT; k += 1
# Aufruf: ruhiger Teppich
ch = CH[0]; add(music, CTA, pad([mid(m) for m in ch[1:]] + [mid(ch[1] + 12)], DUR - CTA + 0.4, 0.16, 1800)); add(music, CTA, sub(mid(ch[0] - 12), DUR - CTA, 0.3))
t = CTA + BEAT / 2
while t < DUR - 0.6: add(music, t, kick(0.32)); t += BEAT
# Ende ausblenden
fade = int(0.6 * SR); music[-fade:] *= np.linspace(1, 0, fade)[:, None]; sfx[-fade:] *= np.linspace(1, 0, fade)[:, None]

def write(name, buf, g):
    x = buf / (np.abs(buf).max() + 1e-9) * g
    w = wave.open(name, "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes()); w.close()
write(D + "/music.wav", music, 0.8); write(D + "/sfx.wav", sfx, 0.9)
print("audio ok", round(DUR, 2))
