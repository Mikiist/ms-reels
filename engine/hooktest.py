"""Schnelltest für eine Hook-Szene ohne Stimme:
  python3 engine/hooktest.py <typ> '<params-json>' <ordner> [hook_text] [dauer_hook]
Baut eine Spec mit Hook-Szene (Standard 3,2 s) + kurzer statement-Szene, Platzhalter-Wörtern, rendert Video,
Musik + Effekte, mischt test.mp4 (ohne Stimme), macht bogen.jpg (12 Bilder aus der Hook-Szene) und cover.jpg."""
import sys, os, json, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
typ, params, d = sys.argv[1], json.loads(sys.argv[2]), os.path.abspath(sys.argv[3])
hook_text = sys.argv[4] if len(sys.argv) > 4 else "Testet *Ihren* Hook"
hd = float(sys.argv[5]) if len(sys.argv) > 5 else 3.2
os.makedirs(d, exist_ok=True)
words = []; t = 0.7
for w in "Das ist ein Test für die Hook Szene".split(): words.append({"w": w, "t": round(t, 2), "e": round(t + 0.25, 2), "scene": 0, "acc": w == "Hook"}); t += 0.3
t = hd + 0.2
for w in "Und hier geht es weiter".split(): words.append({"w": w, "t": round(t, 2), "e": round(t + 0.25, 2), "scene": 1, "acc": False}); t += 0.3
spec = {"id": "hooktest-" + typ, "dur": round(hd + 2.2, 2), "scenes": [{"type": typ, "params": params, "t0": 0}, {"type": "statement", "params": {}, "t0": hd}],
        "words": words, "hook_text": hook_text, "cover_title": "Titel *Test*", "music": ""}
json.dump(spec, open(d + "/spec.json", "w"), ensure_ascii=False)
r = subprocess.run(["node", HERE + "/render.mjs", d]);
if r.returncode not in (0, 2): sys.exit("Render-Fehler")
subprocess.run([sys.executable, HERE + "/audio.py", d], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", d + "/video.mp4", "-i", d + "/music.wav", "-i", d + "/sfx.wav", "-filter_complex",
                "[1:a]volume=0.6[m];[2:a]volume=1.0[f];[m][f]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5[a]", "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-shortest", d + "/test.mp4"], check=True)
from PIL import Image, ImageDraw
import io
ims = []
for i in range(12):
    tt = hd * i / 11 * 0.98 + 0.01
    out = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{tt:.2f}", "-i", d + "/test.mp4", "-frames:v", "1", "-vf", "scale=270:480", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    ims.append((tt, Image.open(io.BytesIO(out)).convert("RGB")))
sheet = Image.new("RGB", (6 * 270, 2 * 500), "white"); dr = ImageDraw.Draw(sheet)
for i, (tt, im) in enumerate(ims):
    x, y = (i % 6) * 270, (i // 6) * 500; sheet.paste(im, (x, y + 20)); dr.text((x + 4, y + 4), f"{tt:.2f}s", fill="black")
sheet.save(d + "/bogen.jpg", quality=85)
ev = [e for e in json.load(open(d + "/events.json")) if e[0] < hd]
print("fertig:", d + "/test.mp4", d + "/bogen.jpg", d + "/cover.jpg"); print("Ton-Ereignisse im Hook:", ev[:30])
