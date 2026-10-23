"""Schneidet Wörter aus einer fertigen Stimme, ohne neu zu vertonen (spart ElevenLabs-Credits).
python3 engine/cut_words.py work/<id> "aus Goslar"
Sucht die Wortfolge per Whisper in voice_raw.mp3, schneidet sie mit kurzer Überblendung heraus,
sichert das Original als voice_raw_orig.mp3 und prüft das Ergebnis mit einer zweiten Erkennung.
Den Sprechtext in job.json danach selbst anpassen und build.py all laufen lassen."""
import sys, os, re, shutil, subprocess
import numpy as np
from faster_whisper import WhisperModel

d, phrase = os.path.abspath(sys.argv[1]), sys.argv[2]
raw = os.path.join(d, "voice_raw.mp3"); orig = os.path.join(d, "voice_raw_orig.mp3")
if not os.path.exists(orig): shutil.copy(raw, orig)
SR = 44100
def load(p):
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy()
def words(a):
    m = WhisperModel(os.environ.get("WHISPER", "small"), compute_type="int8")
    a16 = np.interp(np.arange(0, len(a), SR / 16000), np.arange(len(a)), a).astype(np.float32)
    segs, _ = m.transcribe(a16, language="de", word_timestamps=True, initial_prompt="Mihajlo Systems, Goslar, Website.", condition_on_previous_text=False)
    return [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
norm = lambda w: re.sub(r"[^0-9a-zäöüß]", "", w.lower())

a = load(orig); ws = words(a); want = [norm(x) for x in phrase.split()]
nw = [norm(w[0]) for w in ws]
idx = next((i for i in range(len(nw) - len(want) + 1) if nw[i:i + len(want)] == want), None)
if idx is None: raise SystemExit(f"„{phrase}“ nicht gefunden. Erkannt: {' '.join(w[0] for w in ws)}")
prev_end = ws[idx - 1][2] if idx > 0 else 0.0
first, last = ws[idx], ws[idx + len(want) - 1]
nxt_start = ws[idx + len(want)][1] if idx + len(want) < len(ws) else len(a) / SR
# Schnitt: ab Mitte der Lücke vor dem ersten Wort bis Mitte der Lücke nach dem letzten Wort, Pause davor bleibt
c0 = max(prev_end, first[1] - 0.04); c1 = min(nxt_start, last[2] + 0.02)
if nxt_start - last[2] > 0.25: c1 = last[2] + 0.06  # Satzpause nach dem Wort behalten
i0, i1 = int(c0 * SR), int(c1 * SR); fade = int(0.015 * SR)
head, tail = a[:i0], a[i1:]; x = np.linspace(1, 0, fade)
out = np.concatenate([head[:-fade], head[-fade:] * x + tail[:fade] * (1 - x), tail[fade:]])
tmp = os.path.join(d, "_cut.wav")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=out.astype(np.float32).tobytes(), check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-c:a", "libmp3lame", "-q:a", "2", raw], check=True); os.remove(tmp)
print(f"geschnitten {c0:.2f} bis {c1:.2f} s ({first[0]} … {last[0]})")
print("neu erkannt:", " ".join(w[0] for w in words(load(raw))))
