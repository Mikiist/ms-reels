"""Baut ein Reel aus einem Auftrag.

  python3 build.py text <ordner>    Gibt den Sprechtext aus (für ElevenLabs).
  python3 build.py all <ordner>     voice_raw.mp3 + job.json -> final.mp4, cover.jpg, post.json

job.json: {"id", "date", "slot", "keyword", "caption", "segments": [{"say": "...", "scene": {"type", "params", "pal"?, "tr"?}}]}
Im Sprechtext markiert *Wort* ein Akzentwort (farbig auf dem Bildschirm), "|" erzwingt einen Phrasenumbruch.
"""
import sys, os, re, json, subprocess, difflib
HERE = os.path.dirname(os.path.abspath(__file__))
DELAY = 0.35  # Standard: Stimme startet nach 0,35 s (Hook knallt zuerst)
def voice_delay(job):
    if job.get("voice_delay") is not None: return float(job["voice_delay"])
    f = os.path.join(HERE, "hooks", job["segments"][0]["scene"]["type"] + ".js")
    if os.path.exists(f):
        m = re.search(r"VOICE_DELAY:\s*([0-9.]+)", open(f, encoding="utf-8").read())
        if m: return float(m.group(1))
    return DELAY

def sh(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0: raise SystemExit("Fehler: " + " ".join(cmd[:3]) + "\n" + r.stderr[-2000:])
    return r.stdout

def load(d): return json.load(open(os.path.join(d, "job.json"), encoding="utf-8"))

def script_words(job):
    out = []
    for i, s in enumerate(job["segments"]):
        for tok in s["say"].replace("|", " | ").split():
            if tok == "|":
                if out: out[-1]["br"] = True
                continue
            acc = "*" in tok; w = tok.replace("*", "")
            if w: out.append({"w": w, "scene": i, "acc": acc})
    return out

def voice_text(job):
    t = " ".join(s["say"].replace("*", "").replace("|", " ") for s in job["segments"])
    return re.sub(r"\s+", " ", t).strip()

def norm(w): return re.sub(r"[^0-9a-zäöüß]", "", w.lower())

def check_text(job):
    bad = []
    txt = voice_text(job) + " " + job.get("caption", "")
    if re.search(r"[–—]", txt): bad.append("Gedankenstrich im Text (verboten)")
    if re.search(r"\b(du|dein|deine|dich|dir)\b", voice_text(job), re.I): bad.append("Du-Form im Sprechtext (Sie-Form verlangt)")
    tags = re.findall(r"#\w+", job.get("caption", ""))
    if len(tags) > 5: bad.append(f"{len(tags)} Hashtags (Instagram erlaubt 5)")
    if len(job.get("caption", "")) > 2100: bad.append("Caption zu lang")
    types = [s["scene"]["type"] for s in job["segments"]]
    if types[-1] != "cta": bad.append("Letzte Szene muss 'cta' sein")
    known = set(re.findall(r"^TYPES\.(\w+) =", open(os.path.join(HERE, "scenes.js"), encoding="utf-8").read(), re.M))
    for hf in os.listdir(os.path.join(HERE, "hooks")):
        if hf.endswith(".js"): known |= set(re.findall(r"^\s*TYPES\.(\w+)\s*=", open(os.path.join(HERE, "hooks", hf), encoding="utf-8").read(), re.M))
    if not job.get("hook_text"): bad.append("hook_text fehlt (Text-Hook oben für Stummschauer)")
    if not job.get("cover_title"): bad.append("cover_title fehlt (Titel fürs Titelbild)")
    if not job.get("audio_name"): bad.append("audio_name fehlt (Name statt Original-Audio)")
    for t in types:
        if t not in known: bad.append(f"Unbekannter Szenentyp {t}")
    words = len(voice_text(job).split())
    if not 35 <= words <= 100: bad.append(f"{words} Wörter (Ziel 40 bis 80, also etwa 17 bis 33 Sekunden)")
    for i, s in enumerate(job["segments"]):
        n = len(s["say"].split())
        if n < 3: bad.append(f"Segment {i + 1} hat nur {n} Wörter (mindestens 3, sonst ist die Szene zu kurz)")
    return bad

def process_voice(d):
    raw = os.path.join(d, "voice_raw.mp3"); out = os.path.join(d, "voice.wav")
    if not os.path.exists(raw): raise SystemExit("voice_raw.mp3 fehlt")
    af = ("silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.32:stop_threshold=-45dB:stop_silence=0.2,"
          "atempo=1.05,highpass=f=70,equalizer=f=200:t=q:w=1:g=1.5,equalizer=f=3500:t=q:w=1:g=2.5,acompressor=threshold=-20dB:ratio=3:attack=5:release=80")
    sh(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", af, "-ar", "44100", "-ac", "1", out])
    return out

def whisper(wav, prompt):
    import numpy as np
    from faster_whisper import WhisperModel
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", wav, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    m = WhisperModel(os.environ.get("WHISPER", "small"), compute_type="int8")
    segs, _ = m.transcribe(a, language="de", word_timestamps=True, initial_prompt="Mihajlo Systems, Website, Google, Erstgespräch.", condition_on_previous_text=False, vad_filter=False)
    return [[w.word.strip(), w.start, w.end] for s in segs for w in s.words], len(a) / 16000

def align(sw, ww):
    a = [norm(x["w"]) for x in sw]; b = [norm(x[0]) for x in ww]
    T = [None] * len(sw)
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == "equal" or (op == "replace" and i2 - i1 == j2 - j1):
            for k in range(i2 - i1): T[i1 + k] = (ww[j1 + k][1], ww[j1 + k][2])
        elif op == "replace":
            t0, t1 = ww[j1][1], ww[j2 - 1][2]
            for k in range(i2 - i1): T[i1 + k] = (t0 + (t1 - t0) * k / (i2 - i1), t0 + (t1 - t0) * (k + 1) / (i2 - i1))
    # Lücken (nicht gehört) linear füllen
    known = [i for i, x in enumerate(T) if x]
    if not known: raise SystemExit("Ausrichtung gescheitert: Whisper hat nichts erkannt")
    for i in range(len(T)):
        if T[i]: continue
        prv = max([k for k in known if k < i], default=None); nxt = min([k for k in known if k > i], default=None)
        if prv is None: T[i] = (max(0, T[nxt][0] - 0.3 * (nxt - i)),) * 2
        elif nxt is None: T[i] = (T[prv][1] + 0.3 * (i - prv),) * 2
        else: f = (i - prv) / (nxt - prv); t = T[prv][1] + (T[nxt][0] - T[prv][1]) * f; T[i] = (t, t + 0.2)
    matched = sum(1 for op in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks() for _ in range(op.size))
    return T, matched / max(1, len(a))

def main():
    mode, d = sys.argv[1], os.path.abspath(sys.argv[2]); job = load(d)
    if mode == "text":
        bad = check_text(job)
        if bad: print("PROBLEME:\n- " + "\n- ".join(bad)); sys.exit(1)
        print(voice_text(job)); return
    bad = check_text(job)
    if bad: raise SystemExit("PROBLEME:\n- " + "\n- ".join(bad))
    global DELAY
    DELAY = voice_delay(job)
    wav = process_voice(d)
    sw = script_words(job); ww, vdur = whisper(wav, voice_text(job))
    T, q = align(sw, ww)
    print(f"Ausrichtung: {q:.0%} der Wörter direkt erkannt, Stimme {vdur:.1f} s")
    if q < 0.6: raise SystemExit("Stimme passt nicht zum Text (unter 60 % erkannt). Neu vertonen oder Text prüfen.")
    words = [{"w": x["w"], "t": round(T[i][0] + DELAY, 3), "e": round(T[i][1] + DELAY, 3), "scene": x["scene"], "acc": x["acc"], "br": x.get("br", False)} for i, x in enumerate(sw)]
    scenes = []
    for i, s in enumerate(job["segments"]):
        first = next(w for w in words if w["scene"] == i)
        t0 = 0.0 if i == 0 else max(scenes[-1]["t0"] + 0.9, first["t"] - 0.22)
        sc = dict(s["scene"]); sc["t0"] = round(t0, 3); scenes.append(sc)
    last = max(w["e"] for w in words)
    dur = max(last + 0.9, scenes[-1]["t0"] + 3.6, vdur + DELAY + 0.6)
    spec = {"id": job["id"], "dur": round(dur, 2), "scenes": scenes, "words": words, "hook_text": job.get("hook_text", ""), "hook_style": job.get("hook_style"), "cover_title": job.get("cover_title", ""), "music": job.get("music", "")}
    json.dump(spec, open(os.path.join(d, "spec.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    import hashlib
    h = hashlib.sha1(json.dumps(spec, sort_keys=True).encode()); 
    for f in sorted(os.listdir(HERE)):
        if f.endswith((".js", ".html", ".mjs")): h.update(open(os.path.join(HERE, f), "rb").read())
    hp = os.path.join(d, "video.hash")
    if os.path.exists(os.path.join(d, "video.mp4")) and os.path.exists(hp) and open(hp).read() == h.hexdigest():
        print("Video unverändert, Render übersprungen")
    else:
        r = subprocess.run(["node", os.path.join(HERE, "render.mjs"), d])
        if r.returncode != 0: raise SystemExit("Render-Fehler (siehe oben)")
        open(hp, "w").write(h.hexdigest())
    sh([sys.executable, os.path.join(HERE, "audio.py"), d])
    info = json.load(open(os.path.join(d, "info.json")))
    hook_end = info["scenes"][0]["t1"]
    fc = (f"[1:a]adelay={int(DELAY * 1000)}|{int(DELAY * 1000)},volume=2.2,aformat=channel_layouts=stereo,asplit=2[v][vk];"
          f"[2:a]volume=0.85[m];[m][vk]sidechaincompress=threshold=0.05:ratio=6:attack=8:release=250[md];"
          f"[3:a]volume=0.75[fx];[v][md][fx]amix=inputs=3:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]")
    out = os.path.join(d, "final.mp4")
    sh(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(d, "video.mp4"), "-i", wav, "-i", os.path.join(d, "music.wav"), "-i", os.path.join(d, "sfx.wav"),
        "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-t", str(spec["dur"]), "-movflags", "+faststart", out])
    cover_t = max(0.3, info.get("cover_t", hook_end - 0.35))
    if not os.path.exists(os.path.join(d, "cover.jpg")):
        sh(["ffmpeg", "-y", "-v", "error", "-ss", str(cover_t), "-i", out, "-frames:v", "1", "-q:v", "3", os.path.join(d, "cover.jpg")])
    pr = json.loads(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration,bit_rate,size:stream=codec_name,width,height,r_frame_rate,sample_rate", "-of", "json", out]))
    br = int(pr["format"]["bit_rate"]); size = int(pr["format"]["size"])
    problems = []
    if br > 5_000_000: problems.append(f"Bitrate {br / 1e6:.1f} Mbit/s über 5")
    if size > 95_000_000: problems.append("Datei über 95 MB")
    post = {"id": job["id"], "date": job.get("date"), "slot": job.get("slot"), "video": job["id"] + ".mp4", "caption": job["caption"],
            "thumb_offset": int(cover_t * 1000), "dur": spec["dur"], "audio_name": job.get("audio_name", ""), "cover_title": job.get("cover_title", ""), "first_comment": job.get("first_comment", ""), "topic": job.get("topic", ""), "keyword": job.get("keyword", "WEBSITE")}
    json.dump(post, open(os.path.join(d, "post.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(json.dumps({"final": out, "dur": spec["dur"], "mbit": round(br / 1e6, 2), "mb": round(size / 1e6, 1), "streams": pr["streams"], "problems": problems}, ensure_ascii=False))
    if problems: sys.exit(3)

if __name__ == "__main__": main()
