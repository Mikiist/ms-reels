# Klänge für h_static: Rauschen, Bildrollen, 1-kHz-Testton (als nahtlose Stücke), Kanal-Knacks, Abschalten. Alles synthetisch.
_ST_X = int(0.004 * SR)  # Überblendung zwischen den Stücken

def _st_piece(sig):
    s = sig.copy(); s[:_ST_X] *= np.linspace(0, 1, _ST_X); s[-_ST_X:] *= np.linspace(1, 0, _ST_X); return s

def _st_snow(ms):
    n = int(ms / 1000 * SR) + _ST_X; x = rng.standard_normal(n)
    s = bpf(x, 180, 11000) * 0.8 + bpf(x, 2500, 9000) * 0.5
    cr = (rng.random(n) > 0.9993) * rng.standard_normal(n) * 4.0  # einzelne Knackser im Rauschen
    return _st_piece(np.tanh((s + cr) * 0.9) * 0.9)

def _st_roll(ms):
    n = int(ms / 1000 * SR) + _ST_X; t = T(n); x = rng.standard_normal(n)
    hum = np.tanh(np.sin(2 * np.pi * 50 * t) * 4) * 0.35 + np.sin(2 * np.pi * 150 * t) * 0.15
    buzz = lpf(np.sign(np.sin(2 * np.pi * 59.9 * t)), 2400) * 0.18
    s = bpf(x, 300, 7000) * 0.45 + hum + buzz
    return _st_piece(np.tanh(s * 1.1) * 0.85)

def _st_tone(ms):
    n = int(ms / 1000 * SR) + _ST_X; t = T(n)
    return _st_piece(np.sin(2 * np.pi * 1000 * t) * 0.8 + np.sin(2 * np.pi * 2000 * t) * 0.03)

for _L in (100, 50, 20, 10):
    SOUND["static_snow_%d" % _L] = (lambda L=_L: _st_snow(L))
    SOUND["static_roll_%d" % _L] = (lambda L=_L: _st_roll(L))
    SOUND["static_tone_%d" % _L] = (lambda L=_L: _st_tone(L))

def static_click():
    # mechanischer Kanalwähler (Rastung) plus elektrischer Knacks
    d = 0.32; n = int(d * SR); t = T(n); s = np.zeros(n)
    for f, dec, a in [(1250, 70, 1.0), (2600, 110, 0.6), (4100, 160, 0.35), (620, 50, 0.4)]: s += np.sin(2 * np.pi * f * t) * np.exp(-t * dec) * a
    s += rng.standard_normal(n) * np.exp(-t * 900) * 2.0
    s += np.sin(2 * np.pi * np.cumsum(60 + 140 * np.exp(-t * 60)) / SR) * np.exp(-t * 30) * 0.9
    s2 = np.zeros(n); i2 = int(0.018 * SR); s2[i2:] = bpf(rng.standard_normal(n - i2), 1500, 9000) * np.exp(-T(n - i2) * 220) * 1.0
    out = np.tanh((s + s2) * 1.3); out[-200:] *= np.linspace(1, 0, 200); return out

def static_off():
    d = 1.3; n = int(d * SR); t = T(n); s = np.zeros(n)
    s += rng.standard_normal(n) * np.exp(-t * 700) * 2.4
    for f, dec, a in [(900, 60, 1.0), (2100, 90, 0.5), (300, 35, 0.5)]: s += np.sin(2 * np.pi * f * t) * np.exp(-t * dec) * a
    s += np.sin(2 * np.pi * np.cumsum(45 + 120 * np.exp(-t * 25)) / SR) * np.exp(-t * 9) * 1.1   # Kondensator-Plopp
    zip_ = np.sin(2 * np.pi * np.cumsum(260 + 3200 * np.exp(-t * 16)) / SR) * np.exp(-t * 5) * 0.22  # Röhre fällt ab
    hum = np.sin(2 * np.pi * 50 * t) * np.exp(-t * 3) * 0.12
    out = np.tanh((s + zip_ + hum) * 1.3); out[:20] *= np.linspace(0, 1, 20); out[-2000:] *= np.linspace(1, 0, 2000); return out

SOUND["static_click"] = static_click
SOUND["static_off"] = static_off
