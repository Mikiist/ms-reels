# Klänge für h_bomb (Zeitbombe). Läuft im Namensraum von audio.py.

def _bomb_beep(f, d, g):
    n = int(d * SR); t = T(n)
    s = np.sign(np.sin(2 * np.pi * f * t)) * 0.55 + np.sin(2 * np.pi * f * t) * 0.6
    s = lpf(s, 7000)
    env = np.minimum(1, t / 0.002) * np.minimum(1, (d - t) / 0.012)
    return s * env * g

def bomb_beep():
    return mx(_bomb_beep(2350, 0.065, 0.8), np.concatenate([np.zeros(int(0.004 * SR)), _bomb_beep(4700, 0.04, 0.12)]))
SOUND["bomb_beep"] = bomb_beep

def bomb_zero():
    # letzter, etwas längerer Ton bei 00:00, danach Stille
    return _bomb_beep(2350, 0.075, 0.95)
SOUND["bomb_zero"] = bomb_zero

def bomb_boom():
    n = int(3.2 * SR); t = T(n)
    sub_ = np.sin(2 * np.pi * np.cumsum(24 + 70 * np.exp(-t * 4.5)) / SR) * np.exp(-t * 1.3) * np.minimum(1, t / 0.004)
    crack = bpf(rng.standard_normal(n), 400, 9000) * np.exp(-t * 26) * 1.2
    rumble = lpf(rng.standard_normal(n), 160) * np.exp(-t * 1.1) * (1 + 0.4 * np.sin(t * 17)) * 3.0
    mid_ = lpf(rng.standard_normal(n), 1200) * np.exp(-t * 4.5) * 1.1
    s = np.tanh((sub_ * 1.4 + crack + rumble + mid_) * 1.5)
    f = int(0.6 * SR); s[-f:] *= np.linspace(1, 0, f) ** 2
    return s * 0.98
SOUND["bomb_boom"] = bomb_boom

def bomb_debris():
    n = int(1.6 * SR); out = np.zeros(n); t = T(n)
    for k in range(90):
        st = int((rng.random() ** 1.7) * 1.3 * SR); m = int(0.02 * SR); tt = T(m)
        c = bpf(rng.standard_normal(m), 1500, 9000) * np.exp(-tt * 300) * (0.25 + 0.75 * rng.random())
        e = min(n, st + m); out[st:e] += c[: e - st]
    out *= np.exp(-t * 1.6)
    return out * 0.7
SOUND["bomb_debris"] = bomb_debris
