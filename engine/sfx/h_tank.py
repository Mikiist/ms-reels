# Klänge für h_tank: Drohnen-Surren, fallende Bombe (Pfeifen). Aufkleber, Scan, Piepen kommen aus h_van.py, Explosion ist "boom".
_TC = {}
def _tc(k, f):
    if k not in _TC: _TC[k] = f()
    return _TC[k]
def _buzz():
    n = int(1.6 * SR); t = T(n); f = 190 + 12 * np.sin(2 * np.pi * 3 * t)
    s = sum(np.sign(np.sin(2 * np.pi * np.cumsum(f * k) / SR)) / k for k in (1, 2, 3)) * 0.18
    return lpf(s, 2200) * np.minimum(1, t / 0.3) * np.minimum(1, (1.6 - t) / 0.4)
SOUND["tbuzz"] = lambda: _tc("tbuzz", _buzz)
def _whistle():
    n = int(0.5 * SR); t = T(n); f = 1600 - 1100 * (t / 0.5)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 * np.minimum(1, t / 0.05)
SOUND["twhistle"] = lambda: _tc("twhistle", _whistle)
