"""Veröffentlicht die fertigen Reels eines Tages.

  python3 engine/publish.py <datum JJJJ-MM-TT>

Nimmt work/<datum>-<slot>/final.mp4 + post.json, baut die Seite (Ordner site/: queue.json, v/<id>.mp4, index.html)
und schiebt sie als einzelnen Commit auf den Branch gh-pages (GitHub Pages, öffentlich). Make holt dort queue.json
und postet zur Uhrzeit des Slots. Danach wird log/posted.jsonl auf main ergänzt.
"""
import sys, os, json, shutil, subprocess, html, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SLOTS = {1: "11:30", 2: "17:00", 3: "20:00"}

def git(*a, cwd=ROOT):
    r = subprocess.run(["git", *a], cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0: raise SystemExit("git " + " ".join(a) + "\n" + r.stderr)
    return r.stdout.strip()

def main():
    date = sys.argv[1]; datetime.date.fromisoformat(date)
    work = os.path.join(ROOT, "work"); posts = []
    for name in sorted(os.listdir(work)) if os.path.isdir(work) else []:
        d = os.path.join(work, name)
        if not name.startswith(date + "-") or not os.path.exists(os.path.join(d, "final.mp4")) or not os.path.exists(os.path.join(d, "post.json")): continue
        p = json.load(open(os.path.join(d, "post.json"), encoding="utf-8")); p["dir"] = d; posts.append(p)
    if not posts: raise SystemExit("Keine fertigen Reels für " + date)
    slots = [p["slot"] for p in posts]
    if len(set(slots)) != len(slots): raise SystemExit("Slot doppelt vergeben: " + str(slots))
    owner_repo = git("remote", "get-url", "origin").rstrip("/").removesuffix(".git").split("github.com/")[-1].split("/")
    owner, repo = owner_repo[-2], owner_repo[-1]
    base = f"https://{owner.lower()}.github.io/{repo}"
    site = os.path.join(ROOT, "site"); shutil.rmtree(site, ignore_errors=True); os.makedirs(site + "/v")
    q = {"date": date, "updated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"), "posts": []}
    for p in sorted(posts, key=lambda x: x["slot"]):
        shutil.copy(os.path.join(p["dir"], "final.mp4"), f"{site}/v/{p['id']}.mp4")
        shutil.copy(os.path.join(p["dir"], "cover.jpg"), f"{site}/v/{p['id']}.jpg")
        q["posts"].append({"slot": p["slot"], "time": SLOTS.get(p["slot"], ""), "id": p["id"], "video_url": f"{base}/v/{p['id']}.mp4", "cover_url": f"{base}/v/{p['id']}.jpg",
                           "caption": p["caption"], "thumb_offset": p["thumb_offset"], "topic": p.get("topic", "")})
    json.dump(q, open(site + "/queue.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for x in q["posts"]:  # eine Datei je Slot, die Make-Szenarien lesen nur ihren Slot
        json.dump({"date": date, **x}, open(f"{site}/slot{x['slot']}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    rows = "".join(f"<section><h2>Slot {x['slot']} um {x['time']}: {html.escape(x['topic'])}</h2><video src='v/{x['id']}.mp4' controls playsinline preload='metadata' poster='v/{x['id']}.jpg'></video><pre>{html.escape(x['caption'])}</pre></section>" for x in q["posts"])
    open(site + "/index.html", "w", encoding="utf-8").write(f"""<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Reels {date}</title><style>body{{font:16px system-ui;margin:0 auto;max-width:520px;padding:16px;background:#0b1220;color:#e5e7eb}}video{{width:100%;border-radius:16px;background:#000}}pre{{white-space:pre-wrap;font:14px system-ui;color:#cbd5e1}}h2{{font-size:17px}}</style>
<h1>Reels für {date}</h1>{rows}</html>""")
    open(site + "/robots.txt", "w").write("User-agent: *\nDisallow: /\n"); open(site + "/.nojekyll", "w").write("")
    # gh-pages als einzelner Commit (alte Videos fliegen raus, Repo bleibt klein)
    remote = git("remote", "get-url", "origin")
    subprocess.run(["git", "init", "-q", "-b", "gh-pages"], cwd=site, check=True)
    git("add", "-A", cwd=site); git("-c", "user.name=Reel-Agent", "-c", "user.email=reel-agent@users.noreply.github.com", "commit", "-q", "-m", f"Reels {date}", cwd=site)
    for i in range(4):
        r = subprocess.run(["git", "push", "-f", remote, "gh-pages"], cwd=site, capture_output=True, text=True)
        if r.returncode == 0: break
        if i == 3: raise SystemExit("Push gh-pages fehlgeschlagen:\n" + r.stderr)
        import time; time.sleep(2 ** (i + 1))
    shutil.rmtree(os.path.join(site, ".git"), ignore_errors=True)
    # Protokoll auf main
    os.makedirs(os.path.join(ROOT, "log"), exist_ok=True)
    with open(os.path.join(ROOT, "log", "posted.jsonl"), "a", encoding="utf-8") as f:
        for p in q["posts"]:
            job = json.load(open(os.path.join(ROOT, "work", p["id"], "job.json"), encoding="utf-8"))
            f.write(json.dumps({"date": date, "slot": p["slot"], "id": p["id"], "topic": p["topic"], "hook": job["segments"][0]["say"],
                                "scenes": [s["scene"]["type"] for s in job["segments"]]}, ensure_ascii=False) + "\n")
    print(json.dumps({"queue": base + "/queue.json", "seite": base + "/", "posts": [(p["slot"], p["video_url"]) for p in q["posts"]]}, ensure_ascii=False, indent=1))

if __name__ == "__main__": main()
