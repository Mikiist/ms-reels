# Klänge für h_scanner (Laser-Scan, Warnpiep, Stempel, Buzzer). Läuft im Namensraum von audio.py.
def _hn_fade(x, a=0.002, b=0.01):
    ia, ib = max(1, int(a * SR)), max(1, int(b * SR)); x = x.copy()
    x[:ia] *= np.linspace(0, 1, ia); x[-ib:] *= np.linspace(1, 0, ib); return x

def scan_on():  # Laser zündet: Zap nach oben, Piep, Druck
    n = int(0.6 * SR); t = T(n); out = np.zeros(n)
    zap = np.sin(2 * np.pi * np.cumsum(180 + 2600 * (1 - np.exp(-t * 30))) / SR) * np.exp(-t * 9) * 0.5
    thump_ = np.sin(2 * np.pi * np.cumsum(50 + 120 * np.exp(-t * 40)) / SR) * np.exp(-t * 12) * 0.9
    out += zap + thump_
    out[:300] += bpf(rng.standard_normal(300), 1500, 12000) * np.linspace(1, 0, 300) * 1.0
    i = int(0.09 * SR); m = int(0.16 * SR); tt = T(m)
    beep = (np.sin(2 * np.pi * 1760 * tt) + 0.25 * np.sin(2 * np.pi * 3520 * tt)) * np.minimum(1, tt / 0.004) * np.minimum(1, (0.16 - tt) / 0.02) * 0.6
    out[i:i + m] += beep
    return _hn_fade(np.tanh(out * 1.3), 0.0005, 0.03)

def scan_hum():  # Scan-Summen, 0,8 s mit sin²-Fenster (überlappend gesetzt)
    d = 0.8; n = int(d * SR); t = T(n)
    b = (np.sign(np.sin(2 * np.pi * 120 * t)) * 0.25 + np.sin(2 * np.pi * 240 * t) * 0.3)
    b = lpf(b, 1400)
    whine = np.sin(2 * np.pi * (2900 + 60 * np.sin(2 * np.pi * 9 * t)) * t) * 0.07
    shim = bpf(rng.standard_normal(n), 3000, 9000) * 0.05 * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * t))
    return (b * (0.8 + 0.2 * np.sin(2 * np.pi * 9 * t)) + whine + shim) * np.sin(np.pi * t / d) ** 2 * 0.9

def scan_warn():  # Warnpiep doppelt
    out = np.zeros(int(0.3 * SR))
    for k, f in [(0.0, 1975.5), (0.13, 1479.98)]:
        m = int(0.1 * SR); tt = T(m); s = np.sign(np.sin(2 * np.pi * f * tt)) * 0.35 + np.sin(2 * np.pi * f * tt) * 0.5
        s = lpf(s, 6000) * np.minimum(1, tt / 0.003) * np.minimum(1, (0.1 - tt) / 0.012); i = int(k * SR); out[i:i + m] += s
    return _hn_fade(out, 0.001, 0.01)

def scan_off():  # Laser aus
    d = 0.25; n = int(d * SR); t = T(n)
    return _hn_fade(np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-t * 14) + 90) / SR) * np.exp(-t * 10) * 0.6, 0.001, 0.02)

def scan_drop():  # Stempel fällt heran
    d = 0.22; n = int(d * SR); t = T(n) / d
    return _hn_fade(lpv(rng.standard_normal(n), 300 + 5000 * t ** 2) * t ** 1.6 * 1.2, 0.01, 0.003)

def scan_stamp():  # Aufprall Stempel: Schlag + Papier
    n = int(0.9 * SR); t = T(n)
    body = np.sin(2 * np.pi * np.cumsum(42 + 130 * np.exp(-t * 38)) / SR) * np.exp(-t * 6) * 1.4
    slap_ = bpf(rng.standard_normal(n), 400, 6000) * np.exp(-t * 40) * 1.2
    wood = (np.sin(2 * np.pi * 180 * t) + 0.5 * np.sin(2 * np.pi * 410 * t)) * np.exp(-t * 22) * 0.4
    return _hn_fade(np.tanh((body + slap_ + wood) * 1.6), 0.0005, 0.05)

def scan_buzzer():  # Fehler-Buzzer, tief und rau
    d = 0.75; n = int(d * SR); t = T(n); s = np.zeros(n)
    for f in [98, 103.8, 146.8]: s += np.sign(np.sin(2 * np.pi * f * t + rng.random() * 6)) + 0.5 * np.sin(2 * np.pi * f * 2 * t)
    s = lpf(s / 3, 2200)
    env = np.minimum(1, t / 0.01) * np.minimum(1, (d - t) / 0.12)
    return _hn_fade(np.tanh(s * env * 1.4) * 0.8, 0.001, 0.03)

SOUND["scan_on"] = scan_on
SOUND["scan_hum"] = scan_hum
SOUND["scan_warn"] = scan_warn
SOUND["scan_off"] = scan_off
SOUND["scan_drop"] = scan_drop
SOUND["scan_stamp"] = scan_stamp
SOUND["scan_buzzer"] = scan_buzzer
