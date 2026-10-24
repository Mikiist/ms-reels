# Klänge für h_van: Aufkleber klatschen, Schritte, Kamera-Auslöser, trauriges Trompeten-Wah, Blitzer, Scan, Piepen, Telefon.
_VC = {}
def _vc(k, f):
    if k not in _VC: _VC[k] = f()
    return _VC[k]
def _slap():
    n = int(0.09 * SR); t = T(n)
    return bpf(rng.standard_normal(n), 700, 5000) * np.exp(-t * 70) * 0.9 + np.sin(2 * np.pi * 160 * t) * np.exp(-t * 45) * 0.5
SOUND["vslap"] = lambda: _vc("vslap", _slap)
def _steps():
    out = np.zeros(int(0.9 * SR))
    for i in range(4):
        n = int(0.07 * SR); t = T(n); s = lpf(rng.standard_normal(n), 900) * np.exp(-t * 60) * 1.2; j = int(i * 0.22 * SR); out[j:j + n] += s
    return out
SOUND["vsteps"] = lambda: _vc("vsteps", _steps)
def _shutter():
    out = np.zeros(int(0.16 * SR))
    for j0 in (0, int(0.07 * SR)):
        n = int(0.03 * SR); t = T(n); out[j0:j0 + n] += bpf(rng.standard_normal(n), 1500, 9000) * np.exp(-t * 220)
    return out
SOUND["vshutter"] = lambda: _vc("vshutter", _shutter)
def _sad():
    n = int(1.0 * SR); t = T(n); f = 330 - 140 * np.clip(t / 0.85, 0, 1) + 6 * np.sin(2 * np.pi * 6 * t)
    s = sum(np.sin(2 * np.pi * np.cumsum(f * k) / SR) / k for k in (1, 2, 3, 4)) * np.minimum(1, t / 0.03) * np.minimum(1, (1.0 - t) / 0.15)
    return lpf(s, 1800) * 0.6
SOUND["vsad"] = lambda: _vc("vsad", _sad)
def _blitz():
    n = int(0.45 * SR); t = T(n); ch = np.sin(2 * np.pi * np.cumsum(2000 + 5000 * np.clip(t / 0.18, 0, 1)) / SR) * (t < 0.18) * 0.15
    pop_ = bpf(rng.standard_normal(n), 800, 12000) * np.exp(-np.maximum(0, t - 0.18) * 30) * (t >= 0.18)
    return ch + pop_ + mx(boom(0.25, 0.45))[:n] if False else ch + pop_
SOUND["vblitz"] = lambda: _vc("vblitz", _blitz)
def _scan():
    n = int(0.6 * SR); t = T(n); f = 900 + 1400 * (0.5 + 0.5 * np.sin(2 * np.pi * 3 * t))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.22 * np.minimum(1, t / 0.02) * np.minimum(1, (0.6 - t) / 0.05)
SOUND["vscan"] = lambda: _vc("vscan", _scan)
def _beep():
    n = int(0.08 * SR); t = T(n); return np.sign(np.sin(2 * np.pi * 1760 * t)) * 0.18 * np.minimum(1, t / 0.003) * np.minimum(1, (0.08 - t) / 0.01)
SOUND["vbeep"] = lambda: _vc("vbeep", _beep)
SOUND["vphone"] = lambda: _vc("vphone", lambda: ring(1.4, 0.5))
