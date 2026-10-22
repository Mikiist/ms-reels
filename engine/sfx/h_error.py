# Klänge für h_error: dumpfer Fehler-Zweiklang (vier Varianten), Glitch-Rauschen, letzter großer Fehler.
_h_error_rng = np.random.default_rng(5150)

def _h_error_fade(s, a=0.003, r=0.03):
    n = len(s); t = T(n); d = n / SR
    return s * np.minimum(1, t / a) * np.minimum(1, np.maximum(0, (d - t) / r))

def _h_error_tone(f, d, bright=1.0):
    n = int(d * SR); t = T(n); ph = 2 * np.pi * f * t
    s = np.sin(ph) + 0.45 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph) * bright + 0.12 * np.sin(5 * ph) * bright
    return lpf(s, 2200) * np.exp(-t * 7)

def h_error_pop(k=0):
    f1 = [392.0, 370.0, 415.3, 349.2][k % 4]; f2 = f1 * [0.75, 0.8, 0.7, 0.75][k % 4]  # fallender Zweiklang, leicht variiert
    a = _h_error_tone(f1, 0.11); b = _h_error_tone(f2, 0.2)
    out = np.zeros(int(0.32 * SR)); out[:len(a)] += _h_error_fade(a) * 0.9; i = int(0.085 * SR); out[i:i + len(b)] += _h_error_fade(b) * 1.0
    thud = np.sin(2 * np.pi * np.cumsum(70 + 120 * np.exp(-T(int(0.12 * SR)) * 50)) / SR) * np.exp(-T(int(0.12 * SR)) * 30) * 0.7
    out[:len(thud)] += thud
    return np.tanh(out * 1.2) * 0.8

def h_error_glitch():
    n = int(0.42 * SR); out = np.zeros(n)
    for k in range(14):
        i = int(_h_error_rng.random() * 0.36 * SR); m = int((0.01 + _h_error_rng.random() * 0.045) * SR); tt = T(m); f = 80 + _h_error_rng.random() * 2400
        s = np.sign(np.sin(2 * np.pi * f * tt)) * (0.6 + 0.4 * _h_error_rng.random())
        e = min(n, i + m); out[i:e] += _h_error_fade(s, 0.001, 0.003)[:e - i]
    t = T(n); out += bpf(_h_error_rng.standard_normal(n), 1500, 12000) * 0.25 * (t / 0.42)
    return _h_error_fade(bpf(out, 100, 10000) * 0.85, 0.002, 0.01)

def h_error_final():
    d = 1.5; n = int(d * SR); t = T(n)
    a = _h_error_tone(196.0, 0.22, 1.4); b = _h_error_tone(130.8, 1.1, 1.4)
    out = np.zeros(n); out[:len(a)] += _h_error_fade(a) * 1.0; i = int(0.16 * SR); out[i:i + len(b)] += _h_error_fade(b, 0.003, 0.3) * 1.1
    out += np.sin(2 * np.pi * np.cumsum(40 + 90 * np.exp(-t * 9)) / SR) * np.exp(-t * 3.2) * 1.1
    out += lpf(_h_error_rng.standard_normal(n), 1800) * np.exp(-t * 12) * 0.6
    crush = np.round(out * 6) / 6  # leicht kaputter Klang
    return _h_error_fade(np.tanh((out * 0.6 + crush * 0.5) * 1.4) * 0.95, 0.001, 0.25)

for _k in range(4):
    SOUND["h_error_pop%d" % _k] = (lambda k: (lambda: h_error_pop(k)))(_k)
def h_error_hit():  # Auftakt: dumpfer Schlag zum ersten Fenster
    n = int(0.5 * SR); t = T(n)
    s = np.sin(2 * np.pi * np.cumsum(45 + 140 * np.exp(-t * 25)) / SR) * np.exp(-t * 7) + lpf(_h_error_rng.standard_normal(n), 2500) * np.exp(-t * 30) * 0.5
    return _h_error_fade(np.tanh(s * 1.5) * 0.9, 0.001, 0.08)

SOUND["h_error_hit"] = h_error_hit
SOUND["h_error_glitch"] = h_error_glitch
SOUND["h_error_final"] = h_error_final
