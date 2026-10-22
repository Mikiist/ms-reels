# Klänge für h_receipt: Start-Piep des Druckers, Thermodruck-Schübe (Länge im Namen, rc_feed<hundertstel>),
# Stempel im Anflug, satter Stempel, Abreißen (Ratsch).
_rc_rng = np.random.default_rng(3141)

def _rc_fade(s, att=0.002, rel=0.02):
    n = len(s); t = T(n); d = n / SR
    return s * np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (d - t) / rel))

def rc_start():
    n = int(0.32 * SR); t = T(n); out = np.zeros(n)
    # Motor greift: Klack
    m = int(0.06 * SR); tt = T(m)
    k = bpf(_rc_rng.standard_normal(m), 900, 7000) * np.exp(-tt * 220) + np.sin(2 * np.pi * np.cumsum(180 * np.exp(-tt * 40) + 90) / SR) * np.exp(-tt * 50) * 0.8
    out[:m] += k
    # zwei kurze Pieptöne
    for at in (0.0, 0.12):
        m = int(0.075 * SR); tt = T(m); b = (np.sin(2 * np.pi * 2730 * tt) + 0.25 * np.sin(2 * np.pi * 5460 * tt)) * np.minimum(1, tt / 0.003) * np.minimum(1, (0.075 - tt) / 0.01)
        i = int(at * SR); out[i:i + m] += b * 0.55
    return np.tanh(out * 1.2) * 0.9

def rc_feed(d):
    n = int(d * SR); t = T(n)
    step = 420 + 60 * np.sin(2 * np.pi * 3 * t)               # Schrittmotor-Takt
    ph = np.cumsum(step) / SR
    pulses = np.exp(-((ph % 1) * 18))                          # kurze Impulse je Schritt
    whine = np.sin(2 * np.pi * np.cumsum(1650 + 120 * np.sin(2 * np.pi * 7 * t)) / SR) * 0.45 + np.sign(np.sin(2 * np.pi * 840 * t)) * 0.12
    grit = bpf(_rc_rng.standard_normal(n), 2500, 9000) * (0.35 + 0.65 * pulses)
    paper = bpf(_rc_rng.standard_normal(n), 600, 3000) * 0.25
    s = whine * (0.6 + 0.4 * pulses) + grit * 0.9 + paper
    s = lpf(s, 9000)
    return _rc_fade(np.tanh(s * 1.4), 0.004, 0.012) * 0.8

def rc_whoosh():
    n = int(0.18 * SR); t = T(n) / 0.18
    return lpv(_rc_rng.standard_normal(n), 300 + 5000 * t ** 2) * np.sin(np.pi * np.clip(t, 0, 1)) ** 2 * 0.8

def rc_stamp():
    n = int(0.9 * SR); t = T(n)
    th = np.sin(2 * np.pi * np.cumsum(48 + 130 * np.exp(-t * 30)) / SR) * np.exp(-t * 7) * np.minimum(1, t / 0.002)
    slap_ = bpf(_rc_rng.standard_normal(n), 400, 6000) * np.exp(-t * 60) * 1.1
    rub = lpf(_rc_rng.standard_normal(n), 900) * np.exp(-t * 25) * 0.6
    wood = np.sin(2 * np.pi * 180 * t) * np.exp(-t * 30) * 0.5 + np.sin(2 * np.pi * 410 * t) * np.exp(-t * 45) * 0.25
    crin = bpf(_rc_rng.standard_normal(n), 3000, 10000) * np.exp(-t * 18) * 0.15
    return np.tanh((th * 1.4 + slap_ + rub + wood + crin) * 1.5) * 0.95

def rc_tear():
    d = 0.34; n = int(d * SR); t = T(n); out = np.zeros(n)
    # viele kleine Risse, dichter werdend, dazu Rauschen
    pos = 0.0; k = 0
    while pos < d - 0.02:
        m = int(0.012 * SR); tt = T(m); c = bpf(_rc_rng.standard_normal(m), 1500, 10000) * np.exp(-tt * 600) * (0.5 + _rc_rng.random() * 0.6)
        i = int(pos * SR); out[i:i + m] += c[: n - i]; pos += 0.004 + 0.012 * _rc_rng.random() * (1 - pos / d); k += 1
    noise = bpf(_rc_rng.standard_normal(n), 900, 7000) * np.sin(np.pi * np.clip(t / d, 0, 1)) ** 0.7 * 0.55
    snap = np.zeros(n); m = int(0.04 * SR); tt = T(m); i = n - m; snap[i:] = bpf(_rc_rng.standard_normal(m), 1500, 9000) * np.exp(-tt * 120) * 0.8
    return _rc_fade(np.tanh((out + noise + snap) * 1.6), 0.003, 0.03) * 0.9

SOUND["rc_start"] = rc_start
SOUND["rc_whoosh"] = rc_whoosh
SOUND["rc_stamp"] = rc_stamp
SOUND["rc_tear"] = rc_tear
for _k in range(3, 41):
    SOUND["rc_feed%d" % _k] = (lambda k: (lambda: rc_feed(k / 100)))(_k)
