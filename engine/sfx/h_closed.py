# Klänge für h_closed (Ladentür bei Nacht). Alles synthetisch: eigener Glocken-Dreiklang, kein bekannter Türgong.
def closed_rev(x, tail=1.0, mix=0.3, lo=200, hi=8000):
    n = int(tail * SR); t = T(n)
    ir = bpf(rng.standard_normal(n) * np.exp(-t * 6.9 / tail), lo, hi)
    k = int(0.01 * SR); ir[:k] *= np.linspace(0, 1, k); ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    L = len(x) + n; F = 1 << int(np.ceil(np.log2(L)))
    out = np.concatenate([x, np.zeros(n)]) + np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[:L] * mix
    f = int(0.05 * SR); out[-f:] *= np.linspace(1, 0, f); return out

def closed_strike(f, d=1.4, g=1.0):
    n = int(d * SR); t = T(n); det = 1 + (rng.random() - 0.5) * 0.004
    parts = [(1.0, 1.0, 2.6), (2.0, 0.45, 4.0), (2.76, 0.35, 6.5), (5.4, 0.18, 11.0), (8.9, 0.08, 18.0)]
    s = sum(a * np.sin(2 * np.pi * f * det * r * t + rng.random() * 6) * np.exp(-t * k) for r, a, k in parts)
    s += bpf(rng.standard_normal(n), 3000, 12000) * np.exp(-t * 400) * 0.6
    return s * np.minimum(1, t / 0.0015) * g

def closed_bell():
    n = int(1.9 * SR); out = np.zeros(n)
    for i, (f, g) in enumerate([(1661.2, 0.9), (1318.5, 0.8), (1975.5, 0.75)]):   # Gis6, E6, H6
        st = int(i * 0.085 * SR); s = closed_strike(f, 1.6, g); e = min(n, st + len(s)); out[st:e] += s[: e - st]
    return closed_rev(out * 0.32, 1.2, 0.35)

def closed_rattle():
    n = int(0.5 * SR); out = np.zeros(n)
    for k, at in enumerate([0.0, 0.07, 0.13, 0.2, 0.26]):
        st = int(at * SR); m = int(0.2 * SR); tt = T(m); g = 1.0 - k * 0.15
        p = np.sin(2 * np.pi * np.cumsum(90 + 120 * np.exp(-tt * 60)) / SR) * np.exp(-tt * 30) * 0.9
        p += bpf(rng.standard_normal(m), 900, 7000) * np.exp(-tt * 120) * 0.7
        p += sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 50) for f in (2140 + rng.random() * 300, 3480 + rng.random() * 400)) * 0.15
        e = min(n, st + m); out[st:e] += p[: e - st] * g
    return closed_rev(np.tanh(out * 1.4) * 0.85, 0.5, 0.25)

def closed_squeak_raw(f0, d=0.3):
    n = int(d * SR); t = T(n) / d
    f = f0 * (1 + 0.25 * np.sin(np.pi * t) + 0.05 * np.sin(2 * np.pi * 23 * t * d))
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph + 1.8 * np.sin(ph * 2.01)) * (0.7 + 0.3 * np.sign(np.sin(2 * np.pi * 31 * t * d)))
    s = bpf(s, 700, 7000) * np.sin(np.pi * t) ** 1.5
    return closed_rev(s * 0.5, 0.4, 0.2)

def closed_squeak(): return closed_squeak_raw(1180, 0.3)
def closed_squeak2(): return closed_squeak_raw(1020, 0.28)

def closed_spin():
    d = 0.5; n = int(d * SR); t = T(n) / d
    rate = 6 + 26 * (1 - t) ** 1.2   # Flattern beim Drehen
    flut = 0.55 + 0.45 * np.abs(np.sin(np.pi * np.cumsum(rate) / SR))
    w = whoosh(d, True, 1.0, 500, 9000)[:n]
    return w * flut * 1.1

def closed_open():
    n = int(1.6 * SR); out = np.zeros(n); t = T(n)
    for i, f in enumerate([523.25, 659.25, 783.99, 1046.5, 1318.5]):
        st = int(i * 0.045 * SR); m = n - st; tt = T(m)
        out[st:] += (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt) * np.exp(-tt * 6)) * np.exp(-tt * 2.6) * np.minimum(1, tt / 0.004) * 0.22
    sh = shimmer(1.3, 0.5, 2600)[:n]; out[:len(sh)] += sh
    out += np.sin(2 * np.pi * np.cumsum(70 + 60 * np.exp(-t * 30)) / SR) * np.exp(-t * 9) * 0.5
    return closed_rev(out, 1.4, 0.4)

def closed_switch():
    n = int(0.12 * SR); t = T(n)
    return (bpf(rng.standard_normal(n), 1200, 9000) * np.exp(-t * 500) + np.sin(2 * np.pi * 1600 * t) * np.exp(-t * 250) * 0.4 + np.sin(2 * np.pi * 120 * t) * np.exp(-t * 60) * 0.5) * 0.9

def closed_rain():
    d = 1.8; n = int(d * SR); t = T(n)
    s = lpf(bpf(rng.standard_normal(n), 400, 9000), 5000) * 0.25
    for k in range(60):
        st = int(rng.random() * (n - 2000)); m = 1500; tt = T(m)
        s[st:st + m] += np.sin(2 * np.pi * (1800 + rng.random() * 3000) * tt) * np.exp(-tt * 260) * 0.25 * rng.random()
    return s * np.minimum(1, t / 0.2) * np.minimum(1, (d - t) / 0.35)

SOUND["closed_bell"] = closed_bell; SOUND["closed_rattle"] = closed_rattle; SOUND["closed_squeak"] = closed_squeak
SOUND["closed_squeak2"] = closed_squeak2; SOUND["closed_spin"] = closed_spin; SOUND["closed_open"] = closed_open
SOUND["closed_switch"] = closed_switch; SOUND["closed_rain"] = closed_rain

def closed_beep():
    out = np.zeros(int(0.5 * SR))
    for at in (0.0, 0.14):
        n = int(0.09 * SR); t = T(n); b = np.sign(np.sin(2 * np.pi * 2350 * t)) * 0.4 + np.sin(2 * np.pi * 2350 * t) * 0.6
        b = bpf(b, 600, 9000) * np.minimum(1, t / 0.003) * np.minimum(1, (0.09 - t) / 0.01) * 0.5
        i = int(at * SR); out[i:i + n] += b
    return closed_rev(out, 0.6, 0.3)
SOUND["closed_beep"] = closed_beep
