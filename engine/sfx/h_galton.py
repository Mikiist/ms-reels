# Klänge für h_galton: Stahlkugel auf Messingstift (6 Tonhöhen), Zeitlupen-Version, Landung im Fach, Ratsche, Klappe, Zeitlupen-Sog, Stopp.
_GC = {}
def _gcache(k, f):
    if k not in _GC: _GC[k] = f()
    return _GC[k]
def _pin(f0, d=0.14, slow=1.0):
    n = int(d * SR); t = T(n); s = np.zeros(n)
    for m, a, k in ((1.0, 1.0, 55), (2.76, 0.5, 80), (5.4, 0.25, 120), (8.9, 0.12, 160)):
        if f0 * m > 15000: continue  # nichts über 15 kHz, sonst Spiegelfrequenzen
        s += a * np.sin(2 * np.pi * f0 * m * t) * np.exp(-t * k * slow)
    nz = bpf(rng.standard_normal(n), 3000, 12000) * np.exp(-t * 900 * slow) * 0.6
    return (s * 0.5 + nz) * np.minimum(1, t / 0.0004)
for _i, _f in enumerate([2350, 2600, 2900, 3150, 3450, 3800]):
    SOUND[f"gpin{_i}"] = (lambda f=_f, k=f"gpin{_i}": _gcache(k, lambda: _pin(f)))
SOUND["gpinslow"] = lambda: _gcache("gpinslow", lambda: _pin(1150, 1.2, 0.18) * 1.2)
def _land(f0=1400, g=1.0):
    n = int(0.22 * SR); t = T(n)
    ring_ = np.sin(2 * np.pi * f0 * t) * np.exp(-t * 45) + 0.5 * np.sin(2 * np.pi * f0 * 2.3 * t) * np.exp(-t * 70)
    thud = lpf(rng.standard_normal(n), 500) * np.exp(-t * 40) * 1.5
    return (ring_ * 0.4 + thud + bpf(rng.standard_normal(n), 2000, 9000) * np.exp(-t * 400) * 0.4) * g
SOUND["gland"] = lambda: _gcache("gland", lambda: _land())
SOUND["gland_big"] = lambda: _gcache("gland_big", lambda: mx(_land(900, 1.2), boom(0.25, 0.7)))
def _ratchet():
    n = int(0.09 * SR); t = T(n); x = bpf(rng.standard_normal(n), 1500, 7000) * np.exp(-t * 120)
    return x + np.sin(2 * np.pi * 420 * t) * np.exp(-t * 60) * 0.5
SOUND["gratchet"] = lambda: _gcache("gratchet", _ratchet)
SOUND["gdoor"] = lambda: _gcache("gdoor", lambda: mx(_land(600, 1.0), lpf(rng.standard_normal(int(0.3 * SR)), 300) * np.exp(-T(int(0.3 * SR)) * 14) * 0.8))
def _slow():
    n = int(1.1 * SR); t = T(n); f = 160 * np.exp(-t * 1.6) + 38
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.05) * np.exp(-t * 1.2)
    sw = bpf(rng.standard_normal(n), 200, 2500) * np.exp(-((t - 0.25) ** 2) / 0.02) * 0.5
    return np.tanh((s + sw) * 1.3)
SOUND["gslow"] = lambda: _gcache("gslow", _slow)
SOUND["gstop"] = lambda: _gcache("gstop", lambda: mx(boom(0.9, 1.6), _land(500, 0.6)))
