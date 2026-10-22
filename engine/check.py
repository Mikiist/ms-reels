"""Kontaktbogen aus dem fertigen Video zum Anschauen: python3 engine/check.py <ordner>  -> <ordner>/bogen.jpg
Zeigt je Szene drei Bilder (Anfang, Mitte, Ende). Mit dem Read-Werkzeug ansehen und auf Überlappungen,
abgeschnittenen Text, leere Bilder und falsche Inhalte prüfen."""
import sys, os, json, subprocess
from PIL import Image, ImageDraw
d = os.path.abspath(sys.argv[1]); info = json.load(open(d + "/info.json")); src = d + "/final.mp4"
ts = []
for s in info["scenes"]:
    a, b = s["t0"], s["t1"]; ts += [a + 0.35, (a + b) / 2, max(a + 0.4, b - 0.08)]
ims = []
for t in ts:
    out = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{t:.2f}", "-i", src, "-frames:v", "1", "-vf", "scale=270:480", "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
    import io; ims.append((t, Image.open(io.BytesIO(out)).convert("RGB")))
cols = 9; rows = (len(ims) + cols - 1) // cols; sheet = Image.new("RGB", (cols * 270, rows * 500), "white"); dr = ImageDraw.Draw(sheet)
for i, (t, im) in enumerate(ims):
    x, y = (i % cols) * 270, (i // cols) * 500; sheet.paste(im, (x, y + 20)); dr.text((x + 4, y + 4), f"{t:.1f}s S{i // 3 + 1}", fill="black")
sheet.save(d + "/bogen.jpg", quality=82); print(d + "/bogen.jpg", len(ims), "Bilder")
