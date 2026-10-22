# Klänge für h_balloon: Pumpstoß, Gummi-Quietschen, Spannungston, Knall. Alles synthetisch.
def _bal_fade(s, a=0.003, r=0.02):
    n = len(s); na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    s = s.copy(); s[:na] *= np.linspace(0, 1, na); s[-nr:] *= np.linspace(1, 0, nr); return s

def balloon_pump():
    d = 0.36; n = int(d * SR); t = T(n); nz = rng.standard_normal(n)
    air = bpf(nz, 700, 5200) * np.minimum(1, t / 0.012) * np.exp(-np.maximum(0, t - 0.06) * 10)
    hiss = bpf(nz, 3000, 11000) * np.exp(-t * 13) * 0.45
    piston = np.sin(2 * np.pi * np.cumsum(70 + 160 * np.exp(-t * 14)) / SR) * np.exp(-t * 26) * 0.75
    knock = bpf(rng.standard_normal(n), 300, 2500) * np.exp(-t * 90) * 0.6
    return _bal_fade(np.tanh((air * 1.3 + hiss + piston + knock) * 1.2) * 0.9)

def _bal_squeak(f0, f1, d, rough=0.4):
    n = int(d * SR); t = T(n); x = t / d
    f = f0 + (f1 - f0) * np.sin(np.pi * 0.5 * x) + 0.03 * f0 * np.sin(2 * np.pi * 11 * t)
    f = f * (1 + 0.025 * lpf(rng.standard_normal(n), 80))
    ph = 2 * np.pi * np.cumsum(f) / SR; s = np.zeros(n)
    for h in range(1, 10): s += np.sin(h * ph) / h ** 0.8
    s = bpf(s, 600, 5000)
    am = 1 + rough * np.sin(2 * np.pi * 41 * t + 2.5 * np.sin(2 * np.pi * 6 * t))
    env = np.sin(np.pi * np.clip(x, 0, 1)) ** 0.5 * np.exp(-x * 0.8)
    s = s * am * env; s = s / (np.abs(s).max() + 1e-9)
    return _bal_fade(np.tanh(s * 1.8) * 0.75)

def balloon_squeak1(): return _bal_squeak(560, 820, 0.17)
def balloon_squeak2(): return _bal_squeak(700, 1050, 0.16)
def balloon_squeak3(): return _bal_squeak(880, 1350, 0.15)
def balloon_creak(): return _bal_squeak(300, 420, 0.5, 0.75) * 0.8

def balloon_swish():
    n = int(0.32 * SR); t = T(n) / 0.32; x = rng.standard_normal(n)
    s = lpv(x, 9000 - 7000 * t) - lpv(x, 900)
    return _bal_fade(s * np.sin(np.pi * t) ** 2 * 0.8)

def _bal_tension(d):
    n = int(d * SR); t = T(n); x = t / d
    f = 72 + 40 * x ** 1.4; ph = 2 * np.pi * np.cumsum(f) / SR
    low = lpf(np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.4 * np.sin(3 * ph + 0.3) + 0.25 * np.sin(4 * ph), 900)
    beat = 1 + 0.3 * np.sin(2 * np.pi * (2.5 + 9 * x ** 2) * t)
    whine = np.sin(2 * np.pi * np.cumsum(2100 + 1100 * x ** 2) / SR) * 0.05 * x ** 2
    air = bpf(rng.standard_normal(n), 2500, 8000) * 0.04 * x ** 2
    s = (low * 0.55 * beat + whine + air) * (0.15 + 0.85 * x ** 1.5)
    return _bal_fade(s, 0.05, 0.008)

def balloon_tension_s(): return _bal_tension(0.6)
def balloon_tension(): return _bal_tension(1.0)
def balloon_tension_l(): return _bal_tension(1.6)

def balloon_pop():
    d = 1.0; n = int(d * SR); t = T(n); nz = rng.standard_normal(n)
    crack = nz * np.exp(-t * 300) * 2.2 + bpf(nz, 1200, 14000) * np.exp(-t * 48) * 1.3
    body = np.sin(2 * np.pi * np.cumsum(52 + 190 * np.exp(-t * 38)) / SR) * np.exp(-t * 12) * 1.0
    snap = bpf(rng.standard_normal(n), 400, 3000) * np.exp(-t * 25) * 0.6
    tail = lpf(rng.standard_normal(n), 2200) * np.exp(-t * 6) * 0.14
    s = np.tanh((crack + body + snap + tail) * 1.7)
    return _bal_fade(s, 0.0006, 0.05)

def balloon_flutter():
    n = int(0.7 * SR); out = np.zeros(n)
    for k in range(9):
        st = int((0.02 + rng.random() * 0.55) * SR); m = int(0.05 * SR); tt = T(m)
        p = bpf(rng.standard_normal(m), 600, 4000) * np.exp(-tt * 70) * (0.4 + 0.6 * rng.random())
        e = min(n, st + m); out[st:e] += p[: e - st]
    return _bal_fade(out * 0.7)

SOUND["balloon_pump"] = balloon_pump
SOUND["balloon_squeak1"] = balloon_squeak1
SOUND["balloon_squeak2"] = balloon_squeak2
SOUND["balloon_squeak3"] = balloon_squeak3
SOUND["balloon_creak"] = balloon_creak
SOUND["balloon_swish"] = balloon_swish
SOUND["balloon_tension_s"] = balloon_tension_s
SOUND["balloon_tension"] = balloon_tension
SOUND["balloon_tension_l"] = balloon_tension_l
SOUND["balloon_pop"] = balloon_pop
SOUND["balloon_flutter"] = balloon_flutter
