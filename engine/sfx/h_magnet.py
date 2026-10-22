# Klänge für h_magnet (Hufeisenmagnet zieht Kunden ab). Alles synthetisch.
def magnet_rev(x, tail=1.0, mix=0.3, lo=150, hi=8000):
    n = int(tail * SR); t = T(n)
    ir = bpf(rng.standard_normal(n) * np.exp(-t * 6.9 / tail), lo, hi)
    k = int(0.01 * SR); ir[:k] *= np.linspace(0, 1, k); ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    L = len(x) + n; F = 1 << int(np.ceil(np.log2(L)))
    out = np.concatenate([x, np.zeros(n)]) + np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[:L] * mix
    f = int(0.05 * SR); out[-f:] *= np.linspace(1, 0, f); return out

def magnet_klonk():
    n = int(1.6 * SR); t = T(n)
    body = np.sin(2 * np.pi * np.cumsum(46 + 140 * np.exp(-t * 35)) / SR) * np.exp(-t * 6)
    modes = [(143, 1.0, 3.2), (311, 0.8, 4.5), (587, 0.6, 6.0), (912, 0.45, 7.5), (1377, 0.35, 9.0), (2061, 0.22, 12.0), (3170, 0.12, 16.0)]
    metal = sum(a * np.sin(2 * np.pi * f * (1 + 0.002 * np.sin(2 * np.pi * 5 * t)) * t + rng.random() * 6) * np.exp(-t * k) for f, a, k in modes) * 0.45
    crack = bpf(rng.standard_normal(n), 900, 12000) * np.exp(-t * 55) * 1.2
    s = np.tanh((body * 1.7 + metal + crack) * 1.3) * np.minimum(1, t / 0.0008)
    return magnet_rev(s * 0.95, 1.4, 0.35)

def magnet_drop():
    d = 0.12; n = int(d * SR); t = T(n) / d
    zing = np.sin(2 * np.pi * np.cumsum(2400 - 1900 * t) / SR) * 0.35
    air = lpv(rng.standard_normal(n), 800 + 7000 * t) * 0.9
    return (zing + air) * np.sin(np.pi * np.clip(t * 0.5 + 0.5, 0, 1)) ** 0.5 * np.minimum(1, t * 20)

def magnet_hum():
    d = 1.4; n = int(d * SR); t = T(n)
    wob = 1 + 0.35 * np.sin(2 * np.pi * 5.5 * t)
    s = (np.sin(2 * np.pi * 100 * t) * 0.6 + np.sin(2 * np.pi * 200 * t) * 0.35 + np.tanh(3 * np.sin(2 * np.pi * 50 * t)) * 0.25 + np.sin(2 * np.pi * 1000.5 * t) * 0.05) * wob
    s += bpf(rng.standard_normal(n), 3000, 9000) * 0.05 * (rng.random(n) > 0.997)
    return s * np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.15) * 0.55

def magnet_zip():
    d = 0.3; n = int(d * SR); t = T(n) / d
    tone = np.sin(2 * np.pi * np.cumsum(300 + 1800 * t ** 1.6) / SR) * (1 - t) * 0.4
    air = lpv(rng.standard_normal(n), 500 + 7000 * t ** 2) * np.sin(np.pi * t) * 0.7
    pull = bpf(rng.standard_normal(n), 1500, 6000) * np.exp(-T(n) * 60) * 0.5
    return (tone + air + pull) * np.minimum(1, T(n) / 0.003)

def magnet_klack_raw(g=1.0, low=1.0):
    n = int(0.35 * SR); t = T(n)
    c = bpf(rng.standard_normal(n), 2000, 12000) * np.exp(-t * 500) * 1.2
    c += sum(np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, k in [(1840, 40), (2960, 55), (4410, 70)]) * 0.3
    c += np.sin(2 * np.pi * np.cumsum(120 + 200 * np.exp(-t * 80)) / SR) * np.exp(-t * 35) * 0.7 * low
    return magnet_rev(np.tanh(c * 1.3) * g, 0.5, 0.2)

def magnet_klack(): return magnet_klack_raw(0.85, 0.8)
def magnet_klack_big(): return mx(magnet_klack_raw(1.0, 1.4), kick(0.7, 0.4))

def magnet_off():
    d = 0.6; n = int(d * SR); t = T(n)
    tone = np.sin(2 * np.pi * np.cumsum(520 * np.exp(-t * 4) + 60) / SR) * np.exp(-t * 4) * 0.5
    clk = bpf(rng.standard_normal(n), 1500, 9000) * np.exp(-t * 400) * 0.6
    return magnet_rev((tone + clk) * np.minimum(1, t / 0.002), 0.8, 0.3)

SOUND["magnet_klonk"] = magnet_klonk; SOUND["magnet_drop"] = magnet_drop; SOUND["magnet_hum"] = magnet_hum
SOUND["magnet_zip"] = magnet_zip; SOUND["magnet_klack"] = magnet_klack; SOUND["magnet_klack_big"] = magnet_klack_big; SOUND["magnet_off"] = magnet_off
