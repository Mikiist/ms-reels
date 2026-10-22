# Klänge für h_lightswitch: satter Kipphebel-Klick, Zirpen des Starters, elektrisches Flackern,
# Zünden der Röhre, Netzbrummen (Länge im Namen, ls_hum<zehntelsekunden>), Aufbau der Website.
_ls_rng = np.random.default_rng(2207)

def _ls_fade(s, att=0.002, rel=0.02):
    n = len(s); t = T(n); d = n / SR
    return s * np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (d - t) / rel))

def _ls_room(s, taps=((0.019, 0.22), (0.033, 0.15), (0.051, 0.10), (0.078, 0.06)), tail=0.15):
    out = np.concatenate([s, np.zeros(int(tail * SR))])
    for dl, gn in taps:
        i = int(dl * SR); out[i:i + len(s)] += s * gn
    return out

def ls_click():
    n = int(0.16 * SR); t = T(n); out = np.zeros(n)
    def snap(at, g, body):
        m = int(0.09 * SR); tt = T(m)
        cr = bpf(_ls_rng.standard_normal(m), 1800, 11000) * np.exp(-tt * 520)
        pl = (np.sin(2 * np.pi * 2350 * tt) * 0.5 + np.sin(2 * np.pi * 1180 * tt) * 0.6) * np.exp(-tt * 160)
        bd = np.sin(2 * np.pi * 410 * tt) * np.exp(-tt * 70) * 0.7 * body
        th = np.sin(2 * np.pi * np.cumsum(140 * np.exp(-tt * 40) + 70) / SR) * np.exp(-tt * 45) * 0.9 * body
        s = (cr * 1.4 + pl + bd + th) * g; i = int(at * SR); out[i:i + m] += s[: n - i]
    snap(0.0, 1.0, 1.0); snap(0.014, 0.45, 0.4)
    return np.tanh(_ls_room(_ls_fade(out, 0.0005, 0.03)) * 1.6) * 0.95

def ls_zirp():
    n = int(0.11 * SR); t = T(n)
    f = 5200 * np.exp(-t * 9) + 2600
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 180 * t)))
    s = s * np.exp(-t * 22) + bpf(_ls_rng.standard_normal(n), 4000, 12000) * np.exp(-t * 60) * 0.4
    return _ls_fade(s, 0.001, 0.02) * 0.6

def _ls_mains(n, f0=100.0):
    t = T(n); ph = 2 * np.pi * f0 * t
    s = np.sin(ph) + 0.6 * np.sin(2 * ph) + 0.45 * np.sin(3 * ph + 0.4) + 0.3 * np.sin(5 * ph) + 0.18 * np.sin(7 * ph + 1)
    return s / 2.2

def ls_flick():
    n = int(0.14 * SR); t = T(n)
    buzz_ = lpf(np.sign(np.sin(2 * np.pi * 100 * t)) * 0.6 + _ls_mains(n) , 3500) * np.exp(-t * 18)
    zap = bpf(_ls_rng.standard_normal(n), 900, 9000) * (np.exp(-t * 90) + 0.35 * (np.sin(2 * np.pi * 100 * t) > 0.6) * np.exp(-t * 25))
    tick_ = np.sin(2 * np.pi * 3100 * t) * np.exp(-t * 300) * 0.5
    low = np.sin(2 * np.pi * np.cumsum(90 + 60 * np.exp(-t * 50)) / SR) * np.exp(-t * 30) * 0.6
    return np.tanh(_ls_fade(buzz_ * 0.9 + zap * 0.9 + tick_ + low, 0.0008, 0.03) * 1.5) * 0.9

def ls_on():
    n = int(1.0 * SR); t = T(n)
    tink = (np.sin(2 * np.pi * 2900 * t) + 0.5 * np.sin(2 * np.pi * 4350 * t)) * np.exp(-t * 40) * 0.5
    crack = bpf(_ls_rng.standard_normal(n), 1500, 12000) * np.exp(-t * 120) * 0.9
    whump = np.sin(2 * np.pi * np.cumsum(46 + 90 * np.exp(-t * 14)) / SR) * np.exp(-t * 5) * np.minimum(1, t / 0.004)
    air = lpv(_ls_rng.standard_normal(n), 400 + 7000 * np.exp(-t * 5)) * np.exp(-t * 7) * 0.35
    swell = _ls_mains(n) * np.minimum(1, t / 0.03) * np.exp(-t * 3) * 0.5
    return np.tanh((tink + crack + whump * 1.1 + air + swell) * 1.4) * 0.9

def ls_hum(d):
    n = int(d * SR); t = T(n)
    m = _ls_mains(n) * (1 + 0.08 * np.sin(2 * np.pi * 0.7 * t))
    hiss = bpf(_ls_rng.standard_normal(n), 5000, 11000) * 0.05
    sing = np.sin(2 * np.pi * 12000 * t) * 0.012
    s = lpf(m, 2400) * 0.8 + hiss + sing
    env = np.minimum(1, t / 0.05) * np.minimum(1, np.maximum(0, (d - t) / 0.3))
    return s * env * 0.55

def ls_web():
    n = int(0.9 * SR); t = T(n); out = np.zeros(n)
    for at, f, g in ((0.0, 880, 0.5), (0.07, 1318.5, 0.45), (0.14, 1760, 0.35)):
        m = int(0.7 * SR); tt = T(m); s = (np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 8)) * np.exp(-tt * 6) * np.minimum(1, tt / 0.004)
        i = int(at * SR); out[i:i + m] += s[: n - i] * g
    out += lpv(_ls_rng.standard_normal(n), 800 + 6000 * np.clip(t / 0.25, 0, 1)) * np.sin(np.pi * np.clip(t / 0.35, 0, 1)) ** 2 * 0.12
    return _ls_fade(out, 0.002, 0.1) * 0.8

SOUND["ls_click"] = ls_click
SOUND["ls_zirp"] = ls_zirp
SOUND["ls_flick"] = ls_flick
SOUND["ls_on"] = ls_on
SOUND["ls_web"] = ls_web
for _k in range(10, 46):
    SOUND["ls_hum%d" % _k] = (lambda k: (lambda: ls_hum(k / 10)))(_k)
