# Klänge für h_trash: Papier knüllen (Knistern), Wurf, Zeitlupe, Klonk am Metallrand, Aufprall im Eimer, Swish.
_tr_rng = np.random.default_rng(808)

def _tr_env(n, att=0.003, rel=0.03):
    t = T(n); d = n / SR
    return np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (d - t) / rel))

def tr_crumple(d=0.9):
    n = int((d + 0.15) * SR); out = np.zeros(n); t = T(n)
    # dichte Knister-Impulse, am Anfang laut (Hook), Dichte folgt dem Knüllen
    k = 0
    while True:
        tt = (k / 260.0) ** 1.0 * d
        if tt > d: break
        k += 1
        if _tr_rng.random() < 0.35: continue
        at = tt + _tr_rng.random() * 0.006; i = int(at * SR); m = int((0.004 + _tr_rng.random() * 0.02) * SR)
        if i + m >= n: continue
        lo = 600 + _tr_rng.random() * 2500
        burst = bpf(_tr_rng.standard_normal(m + 64), lo, lo * (2 + _tr_rng.random() * 3))[:m] * np.exp(-np.arange(m) / (m * 0.3))
        g = (0.5 + _tr_rng.random()) * (1.2 if at < 0.12 else 0.75 + 0.35 * np.sin(np.pi * at / d))
        out[i:i + m] += burst * g
    rustle = bpf(_tr_rng.standard_normal(n), 2000, 9000) * 0.12 * np.minimum(1, t / 0.01) * np.exp(-np.maximum(0, t - d) * 10)
    return np.tanh((out + rustle) * 1.8) * _tr_env(n, 0.001, 0.08) * 0.9

def tr_throw():
    return whoosh(0.32, True, 0.9, 400, 7000)

def tr_slow():
    n = int(0.7 * SR); t = T(n) / 0.7
    x = _tr_rng.standard_normal(n)
    s = lpv(x, 1400 * (1 - t) ** 1.5 + 120) * np.sin(np.pi * t) ** 1.2 * 1.4
    tone = np.sin(2 * np.pi * np.cumsum(220 * (1 - 0.55 * t)) / SR) * np.sin(np.pi * t) * 0.25
    return (s + tone) * _tr_env(n, 0.02, 0.1)

def tr_clonk():
    n = int(1.3 * SR); t = T(n); s = np.zeros(n)
    for f, a, dc in ((412, 1.0, 5.0), (1013, 0.55, 7.0), (1597, 0.4, 9.0), (2380, 0.28, 12.0), (3310, 0.18, 16.0), (186, 0.5, 9.0)):
        s += a * np.sin(2 * np.pi * f * t * (1 + 0.002 * np.sin(2 * np.pi * 4 * t))) * np.exp(-t * dc)
    hit = bpf(_tr_rng.standard_normal(n), 1500, 10000) * np.exp(-t * 120) * 1.4
    thud = np.sin(2 * np.pi * np.cumsum(110 + 120 * np.exp(-t * 40)) / SR) * np.exp(-t * 18) * 0.8
    return np.tanh((s * 0.75 + hit + thud) * 1.1) * _tr_env(n, 0.0008, 0.2) * 0.95

def tr_land():
    n = int(0.6 * SR); t = T(n)
    thud = np.sin(2 * np.pi * np.cumsum(90 + 80 * np.exp(-t * 30)) / SR) * np.exp(-t * 14)
    pap = bpf(_tr_rng.standard_normal(n), 1200, 7000) * np.exp(-t * 30) * 0.6
    ring_ = (np.sin(2 * np.pi * 300 * t) * 0.3 + np.sin(2 * np.pi * 734 * t) * 0.15) * np.exp(-t * 8)
    return np.tanh((thud + pap + ring_) * 1.3) * _tr_env(n, 0.001, 0.1) * 0.9

def tr_swish():
    n = int(0.9 * SR); t = T(n)
    sw = bpf(_tr_rng.standard_normal(n), 2500, 9000) * np.sin(np.pi * np.clip(t / 0.25, 0, 1)) ** 2 * 0.5
    sp = np.zeros(n)
    for k, f in enumerate((1568.0, 2093.0, 2637.0)):
        i = int((0.05 + k * 0.06) * SR); m = n - i; tt = T(m)
        sp[i:] += (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt * 7) * 0.32
    return (sw + sp) * _tr_env(n, 0.005, 0.1)

SOUND["tr_crumple"] = lambda: tr_crumple(0.86)
SOUND["tr_crumple_s"] = lambda: tr_crumple(0.62)
SOUND["tr_throw"] = tr_throw
SOUND["tr_slow"] = tr_slow
SOUND["tr_clonk"] = tr_clonk
SOUND["tr_land"] = tr_land
SOUND["tr_swish"] = tr_swish
