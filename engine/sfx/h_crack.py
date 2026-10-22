# Klänge für h_crack: dumpfe Klopfer aufs Glas, Spannungs-Sog, Glasbruch mit Knistern, digitaler Fehler.
_h_crack_rng = np.random.default_rng(9031)

def _h_crack_fade(s, a=0.002, r=0.03):
    n = len(s); t = T(n); d = n / SR
    return s * np.minimum(1, t / a) * np.minimum(1, np.maximum(0, (d - t) / r))

def h_crack_knock(g=1.0, low=1.0):
    n = int(0.32 * SR); t = T(n)
    body = np.sin(2 * np.pi * np.cumsum(95 + 140 * np.exp(-t * 60)) / SR) * np.exp(-t * 22) * low
    tap = bpf(_h_crack_rng.standard_normal(n), 500, 3500) * np.exp(-t * 90) * 0.9
    tone = (np.sin(2 * np.pi * 1870 * t) * 0.25 + np.sin(2 * np.pi * 3110 * t) * 0.12) * np.exp(-t * 45)
    return _h_crack_fade(np.tanh((body * 1.6 + tap + tone) * 1.2) * g)

def h_crack_knock2():
    s = h_crack_knock(1.0, 1.35)
    n = int(0.08 * SR); t = T(n); tick = bpf(_h_crack_rng.standard_normal(n), 4000, 14000) * np.exp(-t * 120) * 0.6
    s[:n] += tick
    return np.tanh(s * 1.15)

def h_crack_tension():
    n = int(0.36 * SR); t = T(n) / 0.36
    nz = lpv(_h_crack_rng.standard_normal(n), 400 + 7000 * t ** 2) * t ** 2.2
    tone = np.sin(2 * np.pi * np.cumsum(220 + 900 * t ** 3) / SR) * t ** 3 * 0.35
    return _h_crack_fade((nz * 0.8 + tone) * 0.9, 0.01, 0.005)

def h_crack_break():
    d = 1.9; n = int(d * SR); t = T(n); out = np.zeros(n)
    snap_n = int(0.05 * SR); st = T(snap_n)
    out[:snap_n] += bpf(_h_crack_rng.standard_normal(snap_n), 1500, 16000) * np.exp(-st * 70) * 2.2
    out += np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-t * 18)) / SR) * np.exp(-t * 7) * 1.3
    out += lpf(_h_crack_rng.standard_normal(n), 900) * np.exp(-t * 10) * 0.8
    out += bpf(_h_crack_rng.standard_normal(n), 3000, 15000) * np.exp(-t * 6) * 0.35
    # Scherben-Klingeln
    for k in range(90):
        at = _h_crack_rng.random() ** 1.6 * 1.4; m = int(0.22 * SR); tt = T(m); f = 2800 + _h_crack_rng.random() * 7500
        p = np.sin(2 * np.pi * f * tt) * np.exp(-tt * (30 + _h_crack_rng.random() * 40)) * (0.25 + 0.75 * _h_crack_rng.random()) * np.exp(-at * 1.6)
        i = int(at * SR); e = min(n, i + m); out[i:e] += p[:e - i] * 0.5
    # Knistern: Risse kriechen weiter
    for k in range(140):
        at = 0.02 + _h_crack_rng.random() ** 2.2 * 1.2; m = int(0.006 * SR); i = int(at * SR)
        cl_ = bpf(_h_crack_rng.standard_normal(m + 64), 2000, 12000)[:m] * np.exp(-T(m) * 600) * (0.6 + _h_crack_rng.random()) * np.exp(-at * 1.2)
        out[i:i + m] += cl_ * 0.9
    return _h_crack_fade(np.tanh(out * 1.1) * 0.95, 0.0005, 0.2)

def h_crack_glitch():
    n = int(0.55 * SR); out = np.zeros(n)
    for k in range(9):
        i = int(_h_crack_rng.random() * 0.45 * SR); m = int((0.015 + _h_crack_rng.random() * 0.05) * SR); tt = T(m); f = 120 + _h_crack_rng.random() * 1800
        s = np.sign(np.sin(2 * np.pi * f * tt)) * 0.5 + np.sin(2 * np.pi * f * 3.01 * tt) * 0.3
        s = s * np.minimum(1, tt / 0.002) * np.minimum(1, np.maximum(0, (m / SR - tt) / 0.003))
        e = min(n, i + m); out[i:e] += s[:e - i]
    return _h_crack_fade(bpf(out, 150, 8000) * 0.8)

def h_crack_creak():  # Risse kriechen nach: dichtes Knistern, leises Knacken
    d = 0.6; n = int(d * SR); out = np.zeros(n)
    for k in range(70):
        at = _h_crack_rng.random() ** 1.5 * 0.45; m = int(0.005 * SR); i = int(at * SR)
        out[i:i + m] += bpf(_h_crack_rng.standard_normal(m + 64), 1800, 11000)[:m] * np.exp(-T(m) * 700) * (0.5 + _h_crack_rng.random()) * (1 - at / 0.5)
    t = T(n); out += np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-t * 30)) / SR) * np.exp(-t * 20) * 0.6
    return _h_crack_fade(np.tanh(out * 1.4) * 0.9, 0.001, 0.08)

SOUND["h_crack_creak"] = h_crack_creak
SOUND["h_crack_knock"] = h_crack_knock
SOUND["h_crack_knock2"] = h_crack_knock2
SOUND["h_crack_tension"] = h_crack_tension
SOUND["h_crack_break"] = h_crack_break
SOUND["h_crack_glitch"] = h_crack_glitch
