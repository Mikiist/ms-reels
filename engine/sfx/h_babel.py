# Klänge für h_babel: helle Sprechblasen-Plopps (vier Tonhöhen), tiefer Abfall, Stempel.
def _babel_pop(f0):
    n = int(0.16 * SR); t = T(n)
    f = f0 * (1 + 0.9 * np.exp(-t * 60))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 26)
    body = np.sin(2 * np.pi * f0 * 0.5 * t) * np.exp(-t * 40) * 0.4
    nz = bpf(rng.standard_normal(n), 2000, 8000) * np.exp(-t * 120) * 0.25
    return np.tanh((s + body + nz) * 1.4) * np.minimum(1, t / 0.002) * 0.9

for _i, _f in enumerate([660, 784, 880, 988]):
    SOUND[f"babel_pop{_i}"] = (lambda f=_f: _babel_pop(f))

def _babel_drop():
    n = int(0.7 * SR); t = T(n)
    tone = np.sin(2 * np.pi * np.cumsum(520 * np.exp(-t * 4) + 70) / SR) * np.exp(-t * 3.5)
    return np.tanh(tone * 1.5) * 0.8

def _babel_stamp():
    n = int(0.35 * SR); t = T(n)
    hit = bpf(rng.standard_normal(n), 200, 6000) * np.exp(-t * 30)
    low = np.sin(2 * np.pi * 70 * t) * np.exp(-t * 14)
    return np.tanh((hit * 1.6 + low) * 1.4) * 0.95

SOUND["babel_drop"] = _babel_drop
SOUND["babel_stamp"] = _babel_stamp
