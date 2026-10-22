# Klänge für h_typewriter: Typenanschlag (vier Varianten), Leertaste, Klingel, Wagenrücklauf mit Zeilenschaltung.
_tw_rng = np.random.default_rng(1926)

def _tw_env(n, att=0.0015, rel=0.01):
    t = T(n); d = n / SR
    return np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (d - t) / rel))

def _tw_noise(n, lo, hi):
    return bpf(_tw_rng.standard_normal(n), lo, hi)

def tw_key(v=0):
    n = int(0.22 * SR); t = T(n); out = np.zeros(n)
    pf = [1.0, 0.93, 1.07, 0.97][v % 4]
    # Typenhebel trifft Walze: harter, heller Knall mit Holz-/Gummikörper
    hit = _tw_noise(n, 1800 * pf, 9000) * np.exp(-t * 260) * 1.3
    body = np.sin(2 * np.pi * np.cumsum(260 * pf + 220 * np.exp(-t * 90)) / SR) * np.exp(-t * 45) * 0.9
    ping = np.sin(2 * np.pi * 2350 * pf * t) * np.exp(-t * 70) * 0.18 + np.sin(2 * np.pi * 3720 * pf * t) * np.exp(-t * 110) * 0.1
    out += hit + body + ping
    # Taste fällt zurück und Wagen rastet ein (Schaltklick), 35 bis 55 ms später
    for at, g, lo in ((0.038 + 0.008 * v, 0.55, 2500), (0.062, 0.35, 3500)):
        i = int(at * SR); m = int(0.03 * SR); tt = T(m)
        out[i:i + m] += _tw_noise(m, lo, 11000) * np.exp(-tt * 380) * g
    low = lpf(_tw_rng.standard_normal(n), 300) * np.exp(-t * 60) * 0.5
    return np.tanh((out + low) * 1.4) * _tw_env(n) * 0.95

def tw_space():
    n = int(0.16 * SR); t = T(n)
    s = _tw_noise(n, 900, 6000) * np.exp(-t * 200) * 0.8 + np.sin(2 * np.pi * np.cumsum(180 + 100 * np.exp(-t * 80)) / SR) * np.exp(-t * 40) * 0.5
    i = int(0.045 * SR); m = int(0.03 * SR); s[i:i + m] += _tw_noise(m, 3000, 10000) * np.exp(-T(m) * 380) * 0.4
    return np.tanh(s * 1.2) * _tw_env(n) * 0.85

def tw_ding():
    n = int(1.6 * SR); t = T(n)
    f = 2093.0  # eigene Glocke, leicht inharmonisch
    parts = ((1.0, 1.0, 2.6), (2.32, 0.45, 4.5), (2.98, 0.3, 6.0), (4.1, 0.16, 9.0), (0.5, 0.12, 3.5))
    s = sum(a * np.sin(2 * np.pi * f * r * t * (1 + 0.0008 * np.sin(2 * np.pi * 6 * t))) * np.exp(-t * dcy) for r, a, dcy in parts)
    strike = _tw_noise(n, 4000, 14000) * np.exp(-t * 300) * 0.5
    return np.tanh((s + strike) * 0.8) * _tw_env(n, 0.001, 0.2) * 0.9

def tw_return():
    n = int(0.62 * SR); t = T(n); out = np.zeros(n)
    # Zeilenschaltung: Ratsche (schnelle Klicks) 0 bis 0,12 s
    for k in range(7):
        at = 0.012 + k * 0.016; i = int(at * SR); m = int(0.02 * SR); tt = T(m)
        out[i:i + m] += (_tw_noise(m, 2500, 11000) * np.exp(-tt * 500) * 0.7 + np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt * 300) * 0.2)
    # Wagen gleitet: Rauschen mit steigender Geschwindigkeit
    sl = lpf(_tw_rng.standard_normal(n), 2500) * 0.0
    g = np.clip((t - 0.02) / 0.28, 0, 1); gate = (t > 0.02) & (t < 0.31)
    slide = bpf(_tw_rng.standard_normal(n), 400, 5000) * (0.25 + 0.6 * g) * gate * 0.55
    # Rollen der Wagenschiene: feines Rattern
    rat = np.sign(np.sin(2 * np.pi * np.cumsum(60 + 260 * g) / SR)) * gate * 0.06
    out += slide + lpf(rat, 3000) + sl
    # Anschlag am Rand bei 0,30 s
    i = int(0.30 * SR); m = n - i; tt = T(m)
    clunk = np.sin(2 * np.pi * np.cumsum(140 + 160 * np.exp(-tt * 50)) / SR) * np.exp(-tt * 18) * 1.1 + _tw_noise(m, 800, 7000) * np.exp(-tt * 90) * 0.9
    clunk += np.sin(2 * np.pi * 1180 * tt) * np.exp(-tt * 25) * 0.12
    out[i:] += clunk
    return np.tanh(out * 1.3) * _tw_env(n, 0.002, 0.05) * 0.95

for _v in range(4):
    SOUND["tw_key%d" % _v] = (lambda v: (lambda: tw_key(v)))(_v)
SOUND["tw_space"] = tw_space
SOUND["tw_ding"] = tw_ding
SOUND["tw_return"] = tw_return
