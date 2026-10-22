# Klänge für h_domino: Antippen, ASMR-Klacken mit steigender Tonhöhe, dumpfer Schlag, Staub. Alles synthetisch.
def _dom_fade(s, a=0.0008, r=0.02):
    n = len(s); na = max(1, int(a * SR)); nr = max(1, int(r * SR))
    s = s.copy(); s[:na] *= np.linspace(0, 1, na); s[-nr:] *= np.linspace(1, 0, nr); return s

def _dom_clack(step, g=1.0):
    # harter, lackierter Stein auf Stein: wenige gedämpfte Eigenschwingungen plus kurzer Anschlag
    d = 0.22; n = int(d * SR); t = T(n); k = 2 ** (step * 1.6 / 12)
    modes = [(1850, 38, 1.0), (3020, 55, 0.6), (4630, 80, 0.38), (6900, 120, 0.2), (930, 30, 0.35)]
    s = np.zeros(n)
    for f, dec, a in modes: s += np.sin(2 * np.pi * f * k * t + a) * np.exp(-t * dec) * a
    s += bpf(rng.standard_normal(n), 2000, 12000) * np.exp(-t * 700) * 1.2
    s += np.sin(2 * np.pi * 380 * k * t) * np.exp(-t * 45) * 0.35
    s = np.tanh(s * 1.3)
    return _dom_fade(s * g, 0.0005, 0.03)

def domino_tap():
    d = 0.3; n = int(d * SR); t = T(n)
    cl_ = click(1.0); s = np.zeros(n); s[:len(cl_)] += cl_ * 0.9
    s += _dom_clack(-5, 0.7)[:n] if n <= int(0.22 * SR) else np.pad(_dom_clack(-5, 0.7), (0, n - int(0.22 * SR)))
    s += np.sin(2 * np.pi * np.cumsum(90 + 120 * np.exp(-t * 40)) / SR) * np.exp(-t * 22) * 0.5
    return _dom_fade(np.tanh(s * 2.0))

def domino_thud():
    d = 1.1; n = int(d * SR); t = T(n)
    body = np.sin(2 * np.pi * np.cumsum(48 + 110 * np.exp(-t * 26)) / SR) * np.exp(-t * 7) * 1.1
    knock = lpf(rng.standard_normal(n), 900) * np.exp(-t * 30) * 0.9
    top = np.pad(_dom_clack(-3, 0.6), (0, n - int(0.22 * SR)))
    rum = lpf(rng.standard_normal(n), 250) * np.exp(-t * 4) * 0.5
    return _dom_fade(np.tanh((body + knock + top + rum) * 1.5), 0.0005, 0.08)

def domino_dust():
    d = 0.9; n = int(d * SR); x = T(n) / d; nz = rng.standard_normal(n)
    s = (lpv(nz, 3500 * (1 - x) + 400) - lpv(nz, 250)) * np.sin(np.pi * np.clip(x * 1.4, 0, 1)) ** 1.5 * (1 - x)
    return _dom_fade(s * 0.9, 0.01, 0.1)

SOUND["domino_tap"] = domino_tap
SOUND["domino_thud"] = domino_thud
SOUND["domino_dust"] = domino_dust
for _i in range(8): SOUND["domino_clack%d" % _i] = (lambda _s=_i: _dom_clack(_s, 1.0))
