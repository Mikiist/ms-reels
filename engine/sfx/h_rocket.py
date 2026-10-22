# Klänge für h_rocket: Zündung (Sound-Hook bei 0,00 s), Triebwerksdröhnen, Abheben, Vorbeiflug nach oben.
_rk_rng = np.random.default_rng(321)

def _rk_env(n, att=0.004, rel=0.02):
    t = T(n); d = n / SR
    return np.minimum(1, t / att) * np.minimum(1, np.maximum(0, (d - t) / rel))

def rk_ignite():
    n = int(1.6 * SR); t = T(n)
    crack = bpf(_rk_rng.standard_normal(n), 1200, 12000) * np.exp(-t * 28) * 1.3
    boomv = np.sin(2 * np.pi * np.cumsum(32 + 90 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.6) * 1.2
    whoo = lpf(_rk_rng.standard_normal(n), 1800) * np.exp(-t * 5) * np.minimum(1, t / 0.03) * 0.9
    return np.tanh((crack + boomv + whoo) * 1.5) * _rk_env(n, 0.001, 0.3) * 0.95

def rk_roar():
    n = int(3.4 * SR); t = T(n)
    # Brummen (tief), Fauchen (mittel), Knistern (unregelmäßige Impulse)
    low = lpf(_rk_rng.standard_normal(n), 140) * 3.2
    mid_ = bpf(_rk_rng.standard_normal(n), 250, 2600) * 0.55
    cr = np.zeros(n); idx = _rk_rng.integers(0, n - 800, 900)
    for i in idx: m = 300; cr[i:i + m] += _rk_rng.standard_normal(m) * np.exp(-np.arange(m) / 40) * _rk_rng.random()
    cr = bpf(cr, 1500, 9000) * 0.5
    rum = 1 + 0.35 * np.sin(2 * np.pi * 7 * t) * np.sin(2 * np.pi * 2.3 * t)
    env = np.minimum(1, t / 0.04) * np.where(t < 1.2, 1, np.exp(-(t - 1.2) * 1.4))
    s = (low * rum + mid_ + cr) * env
    return np.tanh(s * 1.3) * _rk_env(n, 0.01, 0.4) * 0.9

def rk_lift():
    n = int(1.4 * SR); t = T(n)
    f = 45 + 25 * t
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.1) * np.exp(-t * 1.6)
    swell = lpf(_rk_rng.standard_normal(n), 900) * np.minimum(1, t / 0.4) * np.exp(-t * 2.0) * 0.8
    return np.tanh((s * 1.3 + swell) * 1.4) * _rk_env(n, 0.01, 0.2) * 0.85

def rk_pass():
    n = int(0.9 * SR); t = T(n) / 0.9
    x = _rk_rng.standard_normal(n)
    s = lpv(x, 6000 * (1 - t) ** 2 + 300) * np.sin(np.pi * np.clip(t * 1.3, 0, 1)) ** 1.5
    return s * _rk_env(n, 0.01, 0.1) * 0.9

SOUND["rk_ignite"] = rk_ignite
SOUND["rk_roar"] = rk_roar
SOUND["rk_lift"] = rk_lift
SOUND["rk_pass"] = rk_pass
