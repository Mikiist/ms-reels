# Klänge für h_sonar (Radar/Sonar). Läuft im Namensraum von audio.py.

def _son_rev(x, dur=2.2, decay=2.6, fc=3500, wet=0.55):
    n = int(dur * SR); t = T(n)
    ir = lpf(rng.standard_normal(n), fc) * np.exp(-t * decay)
    ir[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
    ir /= np.sqrt(np.sum(ir ** 2)) + 1e-9
    m = len(x) + n; L = 1 << int(np.ceil(np.log2(m)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[:m]
    y = y / (np.abs(y).max() + 1e-9) * np.abs(x).max()
    out = np.zeros(m); out[: len(x)] += x; out += y * wet
    f = int(0.25 * SR); out[-f:] *= np.linspace(1, 0, f)
    return out

def _son_tone(f, d, dec):
    n = int(d * SR); t = T(n)
    fr = f * (1 - 0.015 * (1 - np.exp(-t * 5)))  # sinkt minimal
    s = np.sin(2 * np.pi * np.cumsum(fr) / SR) + 0.18 * np.sin(2 * np.pi * np.cumsum(2 * fr) / SR) * np.exp(-t * 9)
    env = np.minimum(1, t / 0.004) * np.exp(-t * dec)
    r = int(0.03 * SR); env[-r:] *= np.linspace(1, 0, r)
    return s * env

def sonar_ping():
    x = _son_tone(1180, 0.9, 4.2) * 0.9
    return np.tanh(_son_rev(x, 2.4, 2.2, 4000, 0.7) * 1.1) * 0.95
SOUND["sonar_ping"] = sonar_ping

def sonar_find():
    x = mx(_son_tone(1568, 0.5, 7.5) * 0.85, _son_tone(2350, 0.3, 14) * 0.2)
    return _son_rev(x, 1.4, 3.4, 5000, 0.5) * 0.9
SOUND["sonar_find"] = sonar_find

def sonar_miss():
    # dumpfer Fehlton: zwei tiefe, gefilterte Töne abwärts plus Stoß
    def note(f, d):
        n = int(d * SR); t = T(n)
        s = np.sign(np.sin(2 * np.pi * f * t)) * 0.6 + np.sin(2 * np.pi * f * t) * 0.6 + np.sign(np.sin(2 * np.pi * f * 1.006 * t)) * 0.3
        env = np.minimum(1, t / 0.006) * np.minimum(1, (d - t) / 0.05) * np.exp(-t * 1.5)
        return lpf(s, 700) * env
    n = int(0.95 * SR); out = np.zeros(n)
    a = note(196, 0.2); out[: len(a)] += a
    b = note(131, 0.62); i = int(0.22 * SR); out[i: i + len(b)] += b
    t = T(n); th = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 6) + 40) / SR) * np.exp(-t * 7) * 0.8
    out += th
    return np.tanh(_son_rev(out, 0.9, 6, 1500, 0.3) * 1.3) * 0.95
SOUND["sonar_miss"] = sonar_miss
