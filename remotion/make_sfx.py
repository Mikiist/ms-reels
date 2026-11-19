"""Erzeugt die Effekt-Bibliothek für die Fast-Vorlage (synthetisch, keine fremden Samples): public/sfx/*.wav"""
import numpy as np, wave, os
SR = 44100; R = np.random.default_rng(7)
def T(d): return np.arange(int(SR * d)) / SR
def lp(x, a):  # einfacher Tiefpass, a 0..1
    y = np.zeros_like(x); s = 0.0
    for i, v in enumerate(x): s += a * (v - s); y[i] = s
    return y
def env(t, att, dec): return np.minimum(t / max(att, 1e-4), 1) * np.exp(-np.maximum(t - att, 0) / dec)
def save(n, x, g=0.9):
    x = x / (np.abs(x).max() + 1e-9) * g; st = np.stack([x, x], 1)
    w = wave.open(f"public/sfx/{n}.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype("<i2").tobytes()); w.close()
def whoosh(d, up=True):
    t = T(d); n = R.standard_normal(len(t)); k = t / d
    cut = (0.02 + 0.5 * (k if up else 1 - k)) ** 2
    y = np.zeros_like(n); s = 0.0
    for i, v in enumerate(n): s += cut[i] * (v - s); y[i] = s
    return y * np.sin(np.pi * k) ** 1.5
t = T(0.35); save("whoosh", whoosh(0.35)); save("whoosh2", whoosh(0.5, False)); save("swish", whoosh(0.18))
t = T(1.2); save("boom", (np.sin(2 * np.pi * (55 - 25 * t) * t) * env(t, 0.005, 0.35) + lp(R.standard_normal(len(t)), 0.05) * env(t, 0.002, 0.08) * 0.8))
t = T(0.25); save("hit", np.sin(2 * np.pi * (140 - 90 * t / 0.25) * t) * env(t, 0.002, 0.07) + R.standard_normal(len(t)) * env(t, 0.001, 0.015) * 0.6)
t = T(0.12); save("pop", np.sin(2 * np.pi * (900 - 600 * t / 0.12) * t) * env(t, 0.002, 0.03), 0.6)
t = T(0.05); save("click", R.standard_normal(len(t)) * env(t, 0.0005, 0.006), 0.5)
t = T(1.5); save("riser", lp(R.standard_normal(len(t)), 0.15) * (t / 1.5) ** 2 + np.sin(2 * np.pi * (200 + 600 * (t / 1.5) ** 2) * t) * (t / 1.5) ** 2 * 0.3)
t = T(0.3); g = np.sign(np.sin(2 * np.pi * 60 * t)) * (R.random(len(t)) > 0.5) * env(t, 0.001, 0.1); save("glitch", g * 0.5 + R.standard_normal(len(t)) * env(t, 0.001, 0.05) * 0.4, 0.6)
t = T(0.6); save("ding", (np.sin(2 * np.pi * 1568 * t) + 0.5 * np.sin(2 * np.pi * 2349 * t)) * env(t, 0.003, 0.18), 0.5)
t = T(0.4); save("ring", np.sin(2 * np.pi * 1200 * t) * (np.sin(2 * np.pi * 20 * t) > 0) * env(t, 0.01, 0.3), 0.5)
print("ok", sorted(os.listdir("public/sfx")))
