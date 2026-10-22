# Klänge für h_lock (Sicherheitsalarm). Alles synthetisch, eigener Zweiton (kein Martinshorn).
def lock_rev(x, tail=1.0, mix=0.35, lo=250, hi=7000):
    n = int(tail * SR); t = T(n)
    ir = bpf(rng.standard_normal(n) * np.exp(-t * 6.9 / tail), lo, hi)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    L = len(x) + n; F = 1 << int(np.ceil(np.log2(L)))
    wet = np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[:L]
    out = np.concatenate([x, np.zeros(n)]) + wet * mix
    f = int(0.05 * SR); out[-f:] *= np.linspace(1, 0, f)
    return out

def lock_env(n, a=0.006, r=0.012):
    t = T(n); d = n / SR
    return np.minimum(1, t / a) * np.minimum(1, np.maximum(0, (d - t) / r))

def lock_tone(f):
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.tanh(2.4 * np.sin(ph)) * 0.6 + 0.25 * (2 * ((ph / (2 * np.pi)) % 1) - 1) + 0.18 * np.sin(2 * ph + 0.4)
    return bpf(s, 280, 6500)

def lock_siren_raw(d=0.5, both=True):
    n = int(d * SR); t = T(n)
    hi, lo = 1046.5, 739.99   # C6 und Fis5 (Tritonus, klingt nach Alarm, nicht nach Martinshorn)
    if both: f = lo + (hi - lo) * np.clip((0.27 - t) / 0.03, 0, 1)
    else: f = np.full(n, hi)
    f = f * (1 + 0.007 * np.sin(2 * np.pi * 6.5 * t))
    return lock_tone(f) * lock_env(n)

def lock_siren(): return np.tanh(lock_rev(lock_siren_raw(0.5, True), 0.9, 0.45) * 1.2) * 0.85
def lock_siren_hi(): return np.tanh(lock_rev(lock_siren_raw(0.25, False), 0.9, 0.45) * 1.2) * 0.85

def lock_hit():
    n = int(0.9 * SR); t = T(n)
    body = np.sin(2 * np.pi * np.cumsum(40 + 110 * np.exp(-t * 28)) / SR) * np.exp(-t * 5)
    crack = bpf(rng.standard_normal(n), 1500, 11000) * np.exp(-t * 45)
    metal = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(523, 9), (1187, 14), (2290, 20), (3410, 26)]) * 0.18
    s = np.tanh((body * 1.6 + crack * 0.9 + metal) * 1.4)
    return lock_rev(s * lock_env(n, 0.001, 0.05), 1.1, 0.3) * 0.95

def lock_click():
    n = int(0.35 * SR); out = np.zeros(n); t = T(n)
    for at, g in [(0.0, 0.6), (0.016, 1.0)]:
        i = int(at * SR); m = n - i; tt = T(m)
        c = bpf(rng.standard_normal(m), 2000, 14000) * np.exp(-tt * 700) * 1.2
        c += sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) for f, k in [(2350, 38), (3870, 46), (5230, 60), (7110, 75)]) * 0.35
        c += np.sin(2 * np.pi * 190 * tt) * np.exp(-tt * 45) * 0.6
        out[i:] += c * g
    return lock_rev(np.tanh(out * 1.3) * lock_env(n, 0.0005, 0.03), 0.6, 0.22)

def lock_ok():
    n = int(1.1 * SR); out = np.zeros(n)
    for i, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
        st = int(i * 0.055 * SR); m = n - st; tt = T(m)
        out[st:] += (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 8)) * np.exp(-tt * 4.5) * np.minimum(1, tt / 0.004) * 0.3
    return lock_rev(out * lock_env(n, 0.002, 0.1), 1.2, 0.35)

def lock_rattle():
    n = int(0.45 * SR); out = np.zeros(n)
    for k in range(9):
        st = int((k * 0.045 + rng.random() * 0.012) * SR); m = int(0.06 * SR); tt = T(m)
        p = sum(np.sin(2 * np.pi * f * tt) for f in (2700 + rng.random() * 900, 4300 + rng.random() * 1200)) * np.exp(-tt * 90)
        p += bpf(rng.standard_normal(m), 3000, 12000) * np.exp(-tt * 300)
        e = min(n, st + m); out[st:e] += p[: e - st] * (0.5 + 0.5 * rng.random()) * (1 - k / 12)
    return out * 0.6

def lock_swish(): return whoosh(0.32, True, 1.0, 400, 9000)
def lock_slam(): return np.tanh(mx(kick(0.9, 0.35), bpf(rng.standard_normal(int(0.2 * SR)), 300, 5000) * np.exp(-T(int(0.2 * SR)) * 30)) * 1.3) * 0.9
def lock_lift(): return mx(blip(500, 1400, 0.16, 0.5), whoosh(0.18, True, 0.4, 800, 8000))

SOUND["lock_siren"] = lock_siren; SOUND["lock_siren_hi"] = lock_siren_hi; SOUND["lock_hit"] = lock_hit
SOUND["lock_click"] = lock_click; SOUND["lock_ok"] = lock_ok; SOUND["lock_rattle"] = lock_rattle
SOUND["lock_swish"] = lock_swish; SOUND["lock_slam"] = lock_slam; SOUND["lock_lift"] = lock_lift
