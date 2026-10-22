# Klänge für h_slot (Spielautomat). Läuft im Namensraum von audio.py.
def _hs_fade(x, a=0.002, b=0.01):
    ia, ib = max(1, int(a * SR)), max(1, int(b * SR)); x = x.copy()
    x[:ia] *= np.linspace(0, 1, ia); x[-ib:] *= np.linspace(1, 0, ib); return x

def _hs_tick(f=2400, g=1.0):
    n = int(0.03 * SR); t = T(n)
    return (bpf(rng.standard_normal(n), 1500, 8000) * np.exp(-t * 380) * 0.8 + np.sin(2 * np.pi * f * t) * np.exp(-t * 260) * 0.5) * g

def slot_pull():  # Hebel: Ratsche, schnell werdend, ab 0,00 s
    n = int(0.24 * SR); out = np.zeros(n)
    k = 0.0; iv = 0.03
    while k < 0.17:
        s = _hs_tick(1900 + k * 4000, 1.0); i = int(k * SR); out[i:i + len(s)] += s[: n - i]; k += iv; iv = max(0.011, iv * 0.82)
    t = T(n); creak = np.sin(2 * np.pi * np.cumsum(300 + 900 * t / 0.24) / SR) * 0.12 * np.exp(-t * 4)
    out[:400] += rng.standard_normal(400) * np.linspace(1, 0, 400) * 0.9
    return _hs_fade(np.tanh((out + creak) * 1.4), 0.0005, 0.01)

def slot_clunk():  # Hebel unten: metallischer Anschlag
    n = int(0.4 * SR); t = T(n)
    body = np.sin(2 * np.pi * np.cumsum(70 + 120 * np.exp(-t * 45)) / SR) * np.exp(-t * 16) * 1.1
    ring_ = (np.sin(2 * np.pi * 620 * t) + 0.6 * np.sin(2 * np.pi * 1450 * t) + 0.3 * np.sin(2 * np.pi * 2790 * t)) * np.exp(-t * 20) * 0.35
    out = body + ring_; out[:300] += bpf(rng.standard_normal(300), 800, 9000) * np.linspace(1, 0, 300) * 1.2
    return _hs_fade(np.tanh(out * 1.3), 0.0005, 0.02)

def slot_spinup():  # Motor: Walzen laufen an
    d = 0.5; n = int(d * SR); t = T(n) / d
    whirr = np.sin(2 * np.pi * np.cumsum(90 + 260 * t ** 0.5) / SR) * 0.3 + lpv(rng.standard_normal(n), 600 + 3500 * t) * 0.5
    return _hs_fade(whirr * np.sin(np.pi * np.clip(t * 0.9, 0, 1)) ** 1.5, 0.004, 0.05)

def slot_tick():
    return _hs_fade(_hs_tick(2200 + rng.random() * 600, 1.0), 0.0005, 0.005)

def slot_klonk():  # Walze stoppt: Klonk
    n = int(0.5 * SR); t = T(n)
    thud = np.sin(2 * np.pi * np.cumsum(55 + 150 * np.exp(-t * 35)) / SR) * np.exp(-t * 11) * 1.2
    knock = (np.sin(2 * np.pi * 420 * t) + 0.7 * np.sin(2 * np.pi * 980 * t) + 0.35 * np.sin(2 * np.pi * 2150 * t)) * np.exp(-t * 26) * 0.5
    out = thud + knock; out[:350] += bpf(rng.standard_normal(350), 500, 7000) * np.linspace(1, 0, 350) * 1.0
    return _hs_fade(np.tanh(out * 1.5), 0.0005, 0.03)

def slot_win():  # Fanfare: Dur-Arpeggio aufwärts, dann Akkord (eigene Melodie)
    d = 1.6; n = int(d * SR); out = np.zeros(n)
    notes = [72, 76, 79, 84]
    for i, m in enumerate(notes):
        st = int(i * 0.075 * SR); dd = d - i * 0.075; s = saw(mid(m), dd, (-0.12, 0, 0.12)) + 0.5 * saw(mid(m + 12), dd, (0,))
        tt = T(len(s)); env = np.minimum(1, tt / 0.01) * (0.55 + 0.45 * np.exp(-tt * 3)) * np.minimum(1, (dd - tt) / 0.35)
        out[st:st + len(s)] += lpv(s, 1800 + 4000 * np.exp(-tt * 4)) * env * 0.35
    for m in [60, 64, 67]:
        s = saw(mid(m), d - 0.3, (-0.1, 0, 0.1)); tt = T(len(s)); st = int(0.3 * SR)
        out[st:st + len(s)] += lpv(s, 2500) * np.minimum(1, tt / 0.02) * np.minimum(1, (d - 0.3 - tt) / 0.4) * 0.22
    out += sub(mid(48), d, 0.35) * np.exp(-T(n) * 1.5)
    return _hs_fade(np.tanh(out * 1.3), 0.002, 0.05)

def slot_bells():  # Gewinnglocken: schnelles Läuten zweier Töne
    d = 1.4; n = int(d * SR); out = np.zeros(n); k = 0.0; i = 0
    while k < d - 0.3:
        f = 2093 if i % 2 == 0 else 2637; s = mx(chime(f, 0.35, 0.6), chime(f * 1.5, 0.25, 0.2)); a = int(k * SR)
        out[a:a + len(s)] += s[: n - a] * (1 - k / d) ** 0.5; k += 0.062; i += 1
    return _hs_fade(out, 0.001, 0.08)

def slot_coins():  # Münzen prasseln in die Schale
    d = 1.5; n = int(d * SR); out = np.zeros(n)
    for j in range(55):
        a = int((rng.random() ** 1.4) * (d - 0.35) * SR); f0 = 2200 + rng.random() * 1800; m = int(0.3 * SR); tt = T(m)
        s = np.zeros(m)
        for r, am, dec in [(1.0, 1.0, 14), (2.31, 0.6, 20), (3.7, 0.4, 26), (5.1, 0.25, 32)]: s += np.sin(2 * np.pi * f0 * r * tt + rng.random() * 6) * am * np.exp(-tt * dec)
        s[:80] += rng.standard_normal(80) * np.linspace(1, 0, 80) * 0.8
        out[a:a + m] += s[: n - a] * (0.25 + 0.5 * rng.random())
    return _hs_fade(np.tanh(out * 0.7), 0.001, 0.08)

SOUND["slot_pull"] = slot_pull
SOUND["slot_clunk"] = slot_clunk
SOUND["slot_spinup"] = slot_spinup
SOUND["slot_tick"] = slot_tick
SOUND["slot_klonk"] = slot_klonk
SOUND["slot_win"] = slot_win
SOUND["slot_bells"] = slot_bells
SOUND["slot_coins"] = slot_coins
