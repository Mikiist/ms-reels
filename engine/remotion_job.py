"""Übergibt ein gebautes Reel (work/<id>) an Remotion: echte Bilder oder Clips als Hintergrund, Stimme und Wort-Zeiten bleiben.
Aufruf: python3 engine/remotion_job.py work/<id> <bg1> <bg2> ...   (ein Hintergrund pro Szene, Dateien in remotion/public/clips/;
        weniger Hintergründe als Szenen: der letzte wird weiterverwendet)
Danach: cd remotion && npx remotion render Reel out/<id>.mp4 --props=public/<id>/props.json"""
import json, os, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
d = os.path.abspath(sys.argv[1]); bgs = sys.argv[2:]
spec = json.load(open(os.path.join(d, "spec.json"))); rid = spec["id"]
pub = os.path.join(ROOT, "remotion", "public", rid); os.makedirs(pub, exist_ok=True)
for b in bgs:
    if not os.path.exists(os.path.join(ROOT, "remotion", "public", "clips", b)): sys.exit(f"Hintergrund fehlt: remotion/public/clips/{b}")
# Ton: fertige Mischung aus final.mp4 (Stimme, Musik, Effekte)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", os.path.join(d, "final.mp4"), "-vn", "-c:a", "aac", "-b:a", "192k", os.path.join(pub, "audio.m4a")], check=True)

def texte(items):  # [["Tisch 4", ""], ["Abholung", "18:30"]] oder ["Eigene Website"] → Kartenzeilen
    return [(" ".join(x for x in it if x) if isinstance(it, list) else it) for it in items or []]

scenes = []
for i, sc in enumerate(spec["scenes"]):
    t, p = sc["type"], sc.get("params", {})
    bg = "clips/" + bgs[min(i, len(bgs) - 1)] if bgs else None
    if t.startswith("m_end") or t == "cta" or t.endswith("_end"): s = {"kind": "end"}
    elif t == "m_word": s = {"kind": "big", "big": p.get("text", "")}
    elif t in ("m_cards", "m_phone", "m_ipad") and p.get("screen") != "chat": s = {"kind": "cards", "items": texte(p.get("items")), "title": p.get("title")}
    else: s = {"kind": "plain"}
    scenes.append({"t0": sc["t0"], "bg": bg, **s})
words = [{"w": w["w"], "t": w["t"], "e": w["e"], "scene": w["scene"], "acc": bool(w.get("acc"))} for w in spec["words"]]
props = {"id": rid, "dur": spec["dur"], "audio": f"{rid}/audio.m4a", "words": words, "scenes": scenes, "keyword": "WEBSITE"}
json.dump(props, open(os.path.join(pub, "props.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("ok", os.path.join(pub, "props.json"), len(scenes), "Szenen")
