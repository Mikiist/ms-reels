# Klänge für h_ekg (Herzmonitor). Läuft im Namensraum von audio.py (np, SR, T, lpf, mx, rng ...).

def _ekg_env(n, att, rel):
    e = np.ones(n); a = max(1, int(att * SR)); r = max(1, int(rel * SR))
    e[:a] = np.linspace(0, 1, a) ** 1.5; e[-r:] *= np.linspace(1, 0, r) ** 1.5
    return e

def _ekg_tone(f, d, att=0.004, rel=0.03):
    n = int(d * SR); t = T(n)
    # heller Monitorton: Grundton plus etwas ungerade Obertöne (weich, kein harter Rechteck-Klang)
    s = np.sin(2 * np.pi * f * t) + 0.22 * np.sin(2 * np.pi * 3 * f * t) + 0.08 * np.sin(2 * np.pi * 5 * f * t)
    return s / 1.3 * _ekg_env(n, att, rel)

def ekg_beep_k(k):
    f = 1000 * 2 ** (-k * 0.6 / 12)  # jeder Schlag eine Spur tiefer
    s = _ekg_tone(f, 0.13)
    # kurzer Raum (Krankenhauszimmer)
    tail = np.zeros(int(0.25 * SR)); out = np.concatenate([s, tail])
    for dl, gn in ((0.031, 0.22), (0.057, 0.14), (0.089, 0.08)):
        i = int(dl * SR); out[i:i + len(s)] += s * gn
    return out * 0.9

for _k in range(6):
    SOUND["ekg_beep%d" % _k] = (lambda k=_k: ekg_beep_k(k))

def ekg_flat():
    s = _ekg_tone(1000, 1.9, 0.008, 0.45)
    tail = np.zeros(int(0.3 * SR)); out = np.concatenate([s, tail])
    for dl, gn in ((0.031, 0.18), (0.057, 0.1)):
        i = int(dl * SR); out[i:i + len(s)] += s * gn
    return out * 0.85
SOUND["ekg_flat"] = ekg_flat

def ekg_drop():
    n = int(1.1 * SR); t = T(n)
    f = 38 + 70 * np.exp(-t * 7)
    b = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2) * np.minimum(1, t / 0.006)
    air = lpf(rng.standard_normal(n), 600) * np.exp(-t * 9) * 0.25
    return np.tanh((b + air) * 1.6) * 0.9
SOUND["ekg_drop"] = ekg_drop
