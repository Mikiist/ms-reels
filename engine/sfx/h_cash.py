# Klänge für h_cash (Kassenschublade, Strudel, Münzen). Läuft im Namensraum von audio.py.
def _hc_fade(x, a=0.003, b=0.01):
    n = len(x); ia, ib = max(1, int(a * SR)), max(1, int(b * SR)); x = x.copy()
    x[:ia] *= np.linspace(0, 1, ia); x[-ib:] *= np.linspace(1, 0, ib); return x

def _hc_bell(d=0.9):
    n = int(d * SR); t = T(n); s = np.zeros(n)
    for f, a, k in [(2093, 1.0, 4.5), (2637, 0.7, 5.5), (4186, 0.35, 9), (5274, 0.25, 12), (3136, 0.4, 7)]:
        s += np.sin(2 * np.pi * f * t + rng.random() * 6) * a * np.exp(-t * k)
    s[:120] += rng.standard_normal(120) * np.linspace(1, 0, 120) * 0.8
    return s / 2.2

def cash_bell_rev():  # Kassenklingel rückwärts: schwillt an und reißt ab
    b = _hc_bell(0.62)[::-1].copy(); n = len(b); t = T(n) / (n / SR)
    b *= 0.25 + 0.75 * t ** 1.5
    return _hc_fade(b, 0.002, 0.012) * 1.1

def cash_open():  # Schublade springt auf: Riegel knallt bei 0, Gleiten, Anschlag mit Federn
    n = int(0.55 * SR); t = T(n); out = np.zeros(n)
    latch = (np.sin(2 * np.pi * 1180 * t) + 0.7 * np.sin(2 * np.pi * 2630 * t) + 0.4 * np.sin(2 * np.pi * 4410 * t)) * np.exp(-t * 30) * 0.6
    out += latch + np.sin(2 * np.pi * np.cumsum(70 + 160 * np.exp(-t * 50)) / SR) * np.exp(-t * 18) * 1.0
    out[:260] += rng.standard_normal(260) * np.linspace(1, 0, 260) * 1.2
    m0 = int(0.12 * SR); sl = lpv(rng.standard_normal(m0), 3000) * np.linspace(0.2, 0.8, m0) * 0.5; out[:m0] += sl
    i = int(0.12 * SR); m = n - i; tt = T(m)
    hit = np.sin(2 * np.pi * np.cumsum(90 + 140 * np.exp(-tt * 40)) / SR) * np.exp(-tt * 14) * 1.0
    ring_ = (np.sin(2 * np.pi * 740 * tt) + 0.6 * np.sin(2 * np.pi * 1310 * tt) + 0.4 * np.sin(2 * np.pi * 2210 * tt)) * np.exp(-tt * 16) * 0.3
    spring = np.sin(2 * np.pi * (180 + 40 * np.sin(2 * np.pi * 22 * tt)) * tt) * np.exp(-tt * 9) * 0.25
    out[i:] += hit + ring_ + spring
    return _hc_fade(np.tanh(out * 1.3), 0.0005, 0.02)

def cash_whirl():  # Sog, 0,8 s, sin²-Fenster (überlappend gesetzt)
    d = 0.8; n = int(d * SR); t = T(n)
    x = rng.standard_normal(n)
    cut = 900 + 700 * np.sin(2 * np.pi * 1.6 * t + rng.random() * 6)
    air = lpv(x, cut) - lpv(x, cut * 0.25)
    wob = 0.65 + 0.35 * np.sin(2 * np.pi * 6.5 * t + rng.random() * 6)
    rum = lpf(rng.standard_normal(n), 140) * 2.0
    tone = np.sin(2 * np.pi * np.cumsum(220 + 60 * np.sin(2 * np.pi * 1.6 * t)) / SR) * 0.06
    return (air * wob * 1.4 + rum + tone) * np.sin(np.pi * t / d) ** 2 * 0.8

def cash_flap():  # Papierflattern
    d = 0.32; n = int(d * SR); out = np.zeros(n); k = 0.0
    while k < d - 0.02:
        m = int(0.012 * SR); tt = T(m); i = int(k * SR)
        b = bpf(rng.standard_normal(m), 1200, 6500) * np.exp(-tt * 260) * (1 - k / d) ** 0.7
        out[i:i + m] += b[: n - i]; k += 0.024 + rng.random() * 0.012
    return _hc_fade(out * 1.4)

def _hc_clink(f0, d=0.45):
    n = int(d * SR); t = T(n); s = np.zeros(n)
    for r, a, dec in [(1.0, 1.0, 9), (2.32, 0.6, 14), (3.73, 0.45, 18), (5.06, 0.3, 24), (6.9, 0.2, 30)]:
        s += np.sin(2 * np.pi * f0 * r * t + rng.random() * 6) * a * np.exp(-t * dec)
    s[:160] += bpf(rng.standard_normal(160), 3000, 15000) * np.linspace(1, 0, 160) * 1.2
    return s / 2

def cash_coin1():  # Münze springt: zwei Klimper
    a = _hc_clink(2350 + rng.random() * 300); b = _hc_clink(2900 + rng.random() * 400, 0.3) * 0.5
    return _hc_fade(mx(a, np.concatenate([np.zeros(int(0.06 * SR)), b])) * 0.9)

def cash_coin2():
    a = _hc_clink(3100 + rng.random() * 300); b = _hc_clink(2500 + rng.random() * 300, 0.3) * 0.45
    return _hc_fade(mx(a, np.concatenate([np.zeros(int(0.045 * SR)), b])) * 0.9)

def cash_count():  # Kassen-Piep beim Hochzählen
    n = int(0.07 * SR); t = T(n); s = np.sign(np.sin(2 * np.pi * 1975 * t)) * 0.5 + np.sin(2 * np.pi * 3950 * t) * 0.2
    return _hc_fade(lpf(s, 4500) * np.minimum(1, (0.07 - t) / 0.02), 0.002, 0.01) * 0.7

def cash_suck():  # Sog zieht zusammen (vor der Implosion)
    d = 0.2; n = int(d * SR); t = T(n) / d
    nz = lpv(rng.standard_normal(n), 400 + 7000 * t ** 2) * t ** 1.5
    tone = np.sin(2 * np.pi * np.cumsum(300 + 1500 * t ** 2) / SR) * t ** 2 * 0.4
    return _hc_fade(nz + tone, 0.01, 0.004)

def cash_implode():  # Strudel fällt in sich zusammen
    d = 1.2; n = int(d * SR); t = T(n)
    sub_ = np.sin(2 * np.pi * np.cumsum(36 + 110 * np.exp(-t * 9)) / SR) * np.exp(-t * 3.2) * 1.3
    zap = np.sin(2 * np.pi * np.cumsum(2400 * np.exp(-t * 16) + 60) / SR) * np.exp(-t * 10) * 0.45
    nz = lpf(rng.standard_normal(n), 3000) * np.exp(-t * 18) * 0.9
    tail = lpf(rng.standard_normal(n), 400) * np.exp(-t * 3.5) * 0.4
    return _hc_fade(np.tanh((sub_ + zap + nz + tail) * 1.5), 0.001, 0.05)

def cash_flicker():  # Lampe flackert: elektrisches Knistern
    d = 0.14; n = int(d * SR); t = T(n)
    hum = np.sign(np.sin(2 * np.pi * 100 * t)) * 0.3 + np.sin(2 * np.pi * 200 * t) * 0.3
    cr = bpf(rng.standard_normal(n), 2000, 9000) * (rng.random(n) > 0.92) * 1.5
    ck = np.zeros(n); c = click(0.6); ck[:len(c)] += c[:n]
    return _hc_fade(lpf(hum, 2500) * np.exp(-t * 12) + cr * np.exp(-t * 20) + ck, 0.001, 0.02) * 0.8

SOUND["cash_bell_rev"] = cash_bell_rev
SOUND["cash_open"] = cash_open
SOUND["cash_whirl"] = cash_whirl
SOUND["cash_flap"] = cash_flap
SOUND["cash_coin1"] = cash_coin1
SOUND["cash_coin2"] = cash_coin2
SOUND["cash_count"] = cash_count
SOUND["cash_suck"] = cash_suck
SOUND["cash_implode"] = cash_implode
SOUND["cash_flicker"] = cash_flicker
