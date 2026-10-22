# Klänge für h_ring: eigene Klingelmelodie (FM-Glocke), Vibrationsbrummen auf Holz, trauriger Zweiton.
_h_ring_rng = np.random.default_rng(4711)

def _h_ring_env(n, att=0.004, rel=0.02):
    t = T(n); d = n / SR
    return np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (d - t) / rel))

def h_ring_note(m, d=0.5):
    n = int(d * SR); t = T(n); f = mid(m)
    idx = 2.2 * np.exp(-t * 9) + 0.35
    mod = np.sin(2 * np.pi * f * 2.0 * t) * idx
    bell = np.sin(2 * np.pi * f * t + mod)
    shine = np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 22) * 0.25
    body = np.sin(2 * np.pi * f * 0.5 * t) * 0.18 * np.exp(-t * 6)
    s = (bell + shine + body) * np.exp(-t * 5.5)
    return np.tanh(s * 1.1) * _h_ring_env(n) * 0.75

def h_ring_vib(d=0.4, g=1.0):
    n = int(d * SR); t = T(n)
    f = 168 + 6 * np.sin(2 * np.pi * 3 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    motor = np.sin(ph) + 0.55 * np.sin(2 * ph + 0.3) + 0.3 * np.sign(np.sin(ph)) * 0.6
    rattle_gate = (np.sin(ph * 0.5) > 0.6).astype(float)
    rattle = bpf(_h_ring_rng.standard_normal(n), 400, 3500) * rattle_gate * 0.55
    s = lpf(motor, 900) * 0.8 + rattle
    env = np.minimum(1, t / 0.03) * np.minimum(1, np.maximum(0, (d - t) / 0.05))
    return np.tanh(s * 1.3) * env * 0.85 * g

def h_ring_stop():
    n = int(0.12 * SR); t = T(n)
    s = np.sin(2 * np.pi * np.cumsum(900 * np.exp(-t * 30) + 220) / SR) * np.exp(-t * 40)
    return s * _h_ring_env(n, 0.002, 0.02) * 0.5

def h_ring_sad(k=0):
    a, b = 79 - k, 75 - k  # fallende Terz, mit jedem Banner etwas tiefer
    out = np.zeros(int(0.75 * SR))
    for at, m, d, g in ((0.0, a, 0.26, 0.85), (0.17, b, 0.55, 1.0)):
        n = int(d * SR); t = T(n); f = mid(m) * (1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.1))
        ph = 2 * np.pi * np.cumsum(f) / SR
        s = np.sin(ph) + 0.28 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph)
        s = s * np.minimum(1, t / 0.012) * np.exp(-t * (6 if d > 0.3 else 9)) * np.minimum(1, np.maximum(0, (d - t) / 0.06))
        i = int(at * SR); out[i:i + n] += s * g
    return out * 0.95

for _m in (76, 78, 80, 81, 83, 85):
    SOUND["h_ring_n%d" % _m] = (lambda m: (lambda: h_ring_note(m)))(_m)
SOUND["h_ring_vib"] = lambda: h_ring_vib(0.4)
SOUND["h_ring_vibs"] = lambda: h_ring_vib(0.2, 0.9)
SOUND["h_ring_stop"] = h_ring_stop
for _k in range(4):
    SOUND["h_ring_sad%d" % _k] = (lambda k: (lambda: h_ring_sad(k)))(_k)
