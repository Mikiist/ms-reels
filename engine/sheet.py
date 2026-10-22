# Kontaktbogen: python3 sheet.py <ordner> <ausgabe.jpg> [spalten]
import sys, glob
from PIL import Image, ImageDraw
fs = sorted(glob.glob(sys.argv[1] + "/f_*.jpg")); cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
ims = [Image.open(f) for f in fs]; w, h = ims[0].size; rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * (h + 22)), "white"); d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * w, (i // cols) * (h + 22); sheet.paste(im, (x, y + 22)); d.text((x + 4, y + 4), f.split("_")[-1][:-4].lstrip("0") or "0", fill="black")
sheet.save(sys.argv[2], quality=85); print(sheet.size)
