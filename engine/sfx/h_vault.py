# Klänge für h_vault: tiefer Einschlag, Rasten des Zahlenschlosses, Einrasten mit Lämpchen-Piep,
# Rad mit Ratsche, schwere Riegel, knarzende Tür mit Druckausgleich, goldener Klangteppich, Karte.
_vt_rng = np.random.default_rng(1909)

def _vt_fade(s, att=0.001, rel=0.03):
    n = len(s); t = T(n); d = n / SR
    return s * np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (d - t) / rel))

def _vt_metal(n, freqs, decays, gains):
    t = T(n); s = np.zeros(n)
    for f, dc, g in zip(freqs, decays, gains): s += np.sin(2 * np.pi * f * t + _vt_rng.random() * 6) * np.exp(-t * dc) * g
    return s

def _vt_room(s, tail=0.35, taps=((0.023, 0.3), (0.041, 0.22), (0.067, 0.16), (0.097, 0.11), (0.139, 0.07), (0.19, 0.04))):
    out = np.concatenate([s, np.zeros(int(tail * SR))])
    for dl, gn in taps:
        i = int(dl * SR); out[i:i + len(s)] += lpf(s, 3000) * gn
    return out

def vault_hit():
    n = int(1.6 * SR); t = T(n)
    b = np.sin(2 * np.pi * np.cumsum(34 + 70 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.6) * np.minimum(1, t / 0.003)
    cl_ = bpf(_vt_rng.standard_normal(n), 1200, 9000) * np.exp(-t * 70) * 0.7
    ring_ = _vt_metal(n, (187, 431, 873, 1391, 2207), (3, 4, 6, 9, 13), (0.35, 0.3, 0.2, 0.12, 0.08))
    return np.tanh((b * 1.3 + cl_ + ring_) * 1.4) * 0.9

def vault_tick(k=0):
    n = int(0.07 * SR); t = T(n)
    tr = bpf(_vt_rng.standard_normal(n), 2500, 12000) * np.exp(-t * 700)
    body = _vt_metal(n, (1850 + 140 * k, 3420, 5120 - 200 * k), (120, 180, 260), (0.6, 0.35, 0.2))
    return _vt_fade((tr * 1.2 + body) * 0.9, 0.0003, 0.01)

def vault_set():
    n = int(0.45 * SR); t = T(n)
    th = np.sin(2 * np.pi * np.cumsum(120 + 160 * np.exp(-t * 60)) / SR) * np.exp(-t * 28)
    cl_ = bpf(_vt_rng.standard_normal(n), 1500, 10000) * np.exp(-t * 300) * 0.9
    ring_ = _vt_metal(n, (980, 1640, 2610), (25, 35, 50), (0.35, 0.25, 0.15))
    beep = np.zeros(n); m = int(0.12 * SR); tt = T(m); i = int(0.04 * SR)
    beep[i:i + m] = (np.sin(2 * np.pi * 1975.5 * tt) + 0.2 * np.sin(2 * np.pi * 3951 * tt)) * np.minimum(1, tt / 0.004) * np.exp(-tt * 14) * 0.35
    return np.tanh((th + cl_ + ring_ + beep) * 1.3) * 0.85

def vault_wheel():
    d = 0.48; n = int(d * SR); t = T(n); out = np.zeros(n)
    # Ratsche: Klicks erst schneller, dann langsamer (wie das Rad)
    pos = 0.0; k = 0
    while pos < d - 0.03:
        m = int(0.03 * SR); tt = T(m); c = bpf(_vt_rng.standard_normal(m), 1800, 9000) * np.exp(-tt * 500) + np.sin(2 * np.pi * (2300 + 300 * (k % 2)) * tt) * np.exp(-tt * 260) * 0.4
        i = int(pos * SR); out[i:i + m] += c[: n - i] * 0.7; x = pos / d; pos += 0.02 + 0.05 * abs(x - 0.5) * 2; k += 1
    scrape = bpf(_vt_rng.standard_normal(n), 300, 2500) * np.sin(np.pi * np.clip(t / d, 0, 1)) * 0.25
    grind = np.sin(2 * np.pi * np.cumsum(70 + 40 * np.sin(np.pi * t / d)) / SR) * np.sin(np.pi * np.clip(t / d, 0, 1)) * 0.35
    return _vt_fade(out + scrape + grind, 0.003, 0.05) * 0.9

def vault_bolt():
    n = int(0.6 * SR); t = T(n)
    th = np.sin(2 * np.pi * np.cumsum(70 + 140 * np.exp(-t * 45)) / SR) * np.exp(-t * 14) * np.minimum(1, t / 0.002)
    cl_ = bpf(_vt_rng.standard_normal(n), 900, 9000) * np.exp(-t * 160)
    clang = _vt_metal(n, (612, 1453, 2297, 3381), (16, 22, 30, 44), (0.45, 0.35, 0.22, 0.12))
    slide = bpf(_vt_rng.standard_normal(n), 2000, 7000) * np.exp(-np.abs(t - 0.02) * 120) * 0.25
    return np.tanh(_vt_room(th * 1.3 + cl_ + clang + slide, 0.3) * 1.5) * 0.92

def vault_open():
    d = 1.9; n = int(d * SR); t = T(n)
    hiss = bpf(_vt_rng.standard_normal(n), 2500, 12000) * np.exp(-t * 5) * np.minimum(1, t / 0.01) * 0.45
    # Knarzen: Sägezahn mit Ruckeln durch einen Resonanzfilter, Tonhöhe sinkt
    f0 = 52 + 28 * np.exp(-t * 1.5) + 6 * np.sin(2 * np.pi * 3.1 * t)
    ph = np.cumsum(f0) / SR; saw_ = 2 * (ph % 1) - 1
    stick = 0.55 + 0.45 * (np.sin(2 * np.pi * 13 * t + 2 * np.sin(2 * np.pi * 2.3 * t)) > 0.2)
    cr = bpf(saw_ * stick, 180, 1600) * 0.9
    cr = cr * np.minimum(1, t / 0.08) * np.exp(-t * 0.9)
    rum = lpf(_vt_rng.standard_normal(n), 120) * np.exp(-t * 1.5) * 1.6
    boom_ = np.sin(2 * np.pi * np.cumsum(30 + 40 * np.exp(-t * 6)) / SR) * np.exp(-t * 2.2) * np.minimum(1, t / 0.005) * 0.9
    return np.tanh(_vt_fade(hiss + cr + rum + boom_, 0.002, 0.3) * 1.3) * 0.95

def vault_glow():
    d = 2.2; n = int(d * SR); t = T(n); s = np.zeros(n)
    for m, g in ((62, 0.5), (66, 0.4), (69, 0.4), (74, 0.3), (78, 0.22), (81, 0.15)):
        f = mid(m); s += (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t + 0.5) + 0.12 * np.sin(2 * np.pi * 3 * f * t)) * g * (1 + 0.003 * np.sin(2 * np.pi * 5 * t))
    env = np.minimum(1, (t / 0.35) ** 1.5) * np.exp(-np.maximum(0, t - 0.5) * 1.6)
    sh = np.zeros(n)
    for k in range(26):
        st = int((0.1 + _vt_rng.random() * 1.5) * SR); m_ = int(0.35 * SR); tt = T(m_)
        p = np.sin(2 * np.pi * (2400 + _vt_rng.random() * 3600) * tt) * np.exp(-tt * 14); e = min(n, st + m_); sh[st:e] += p[: e - st] * 0.2
    air = lpv(_vt_rng.standard_normal(n), 600 + 5000 * np.clip(t / 0.6, 0, 1)) * env * 0.12
    return _vt_fade(s / 2.4 * env + sh + air, 0.005, 0.4) * 0.85

def vault_card():
    n = int(1.2 * SR); t = T(n); out = np.zeros(n)
    for at, m, g in ((0, 86, 0.6), (0.06, 90, 0.5), (0.12, 93, 0.45), (0.18, 98, 0.35)):
        mm = int(0.9 * SR); tt = T(mm); f = mid(m)
        s = (np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 12)) * np.exp(-tt * 5) * np.minimum(1, tt / 0.002)
        i = int(at * SR); out[i:i + mm] += s[: n - i] * g
    wh = lpv(_vt_rng.standard_normal(n), 1000 + 9000 * np.clip(t / 0.18, 0, 1)) * np.sin(np.pi * np.clip(t / 0.25, 0, 1)) ** 2 * 0.3
    sub_ = np.sin(2 * np.pi * np.cumsum(55 + 50 * np.exp(-t * 12)) / SR) * np.exp(-t * 6) * 0.6
    return np.tanh(_vt_fade(out * 0.6 + wh + sub_, 0.001, 0.2) * 1.2) * 0.85

SOUND["vault_hit"] = vault_hit
SOUND["vault_tick0"] = lambda: vault_tick(0)
SOUND["vault_tick1"] = lambda: vault_tick(1)
SOUND["vault_set"] = vault_set
SOUND["vault_wheel"] = vault_wheel
SOUND["vault_bolt"] = vault_bolt
SOUND["vault_open"] = vault_open
SOUND["vault_glow"] = vault_glow
SOUND["vault_card"] = vault_card
