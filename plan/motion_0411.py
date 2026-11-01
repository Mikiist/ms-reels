"""Neues Format ab Mi 04.11.2026 (Mihajlo, 01.11.2026): modernes, sanftes Motion Design statt Comic-Geschichten.
Regeln: schnelle, fesselnde Stimme (tempo), emotionaler Hook ab Bild 0, Themen Bestellterminal, Website, SEO.
JEDER sichtbare Text wird auch gesprochen (Szenen-Parameter = gesprochene Worte, hook_text = Teil des ersten Satzes).
Schluss wechselt (Look bestimmt die cta-Variante: editorial/terminal = Kommentarfeld, cinema/pop/brutal = Riesen-Stichwort,
objekt = Karte), nie zweimal hintereinander derselbe Schluss.
python3 plan/motion_0411.py [id ...]"""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WER = [
    "Ich bin Mihajlo und baue Websites und Bestellsysteme für Betriebe in Braunschweig, Hannover, Berlin und ganz Deutschland. Ein Ansprechpartner vom ersten Gespräch bis zur Wartung, und der Preis steht vorher fest. Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026).",
    "Hinter Mihajlo Systems stehe ich, Mihajlo, mit Kunden von Hannover bis Berlin. Ich baue alles selbst und bin Ihr fester Ansprechpartner, mit festem Preis. Bei Google stehe ich bei 4,8 Sternen aus 19 Bewertungen (Stand September 2026).",
    "Ich bin Mihajlo von Mihajlo Systems. Ich betreue Betriebe in Braunschweig, Hannover, Berlin und per Videoanruf in ganz Deutschland. 4,8 Sterne bei Google aus 19 Bewertungen (Stand September 2026).",
]
CTA = "Kommentieren Sie WEBSITE und ich schicke Ihnen den Link zum kostenlosen Erstgespräch. 👇"
SIG = "Mihajlo Systems, Webdesign für ganz Deutschland"
V = []
def video(id_, topic, look, music, hook_text, cover, audio, segs, cap, share, tags, first, tempo=1.1):
    i = len(V)
    caption = "\n\n".join(cap[:3] + [WER[i % 3], cap[3], CTA, share, SIG, " ".join(tags)])
    V.append({"id": id_, "date": id_[:10], "slot": int(id_[-1]), "topic": topic, "keyword": "WEBSITE", "hook_text": hook_text, "cover_title": cover,
              "audio_name": audio, "music": music, "look": look, "tempo": tempo, "voice_speed": 1.15, "voice_id": "kJLuJl0MAmUoVyx3oDIT", "hook_until": 3.0,
              "first_comment": first + " Kommentieren Sie WEBSITE 👇 dann schreibe ich Ihnen persönlich.",
              "segments": [{"say": s, "scene": sc} for s, sc in segs], "caption": caption})

# ---------- Mi 04.11. 07:30: Bestellterminal (Muster-Reel) ----------
video("2026-11-04-1", "Motion: Lieferportal kassiert mit, eigenes Bestellterminal", "motion", "drive",
      "Das Lieferportal *kassiert* mit", "Das Portal *kassiert* mit", "Sie kochen, das Portal kassiert", [
      ("Sie kochen. Das Lieferportal *kassiert* mit. Provision. Provision. Provision. Summe: *zu viel*.",
       {"type": "h_receipt", "params": {"title": "Lieferportal", "items": ["Provision", "Provision", "Provision"], "total": "Zu viel"}}),
      ("Schluss damit. Ab jetzt bestellen Ihre Gäste *direkt* bei Ihnen.",
       {"type": "m_word", "params": {"text": "Schluss damit", "sub": "Direkt bei Ihnen"}}),
      ("Ihre Bestellungen kommen rein. Tisch vier. Tisch sieben. Abholung um achtzehn Uhr *dreißig*.",
       {"type": "m_phone", "params": {"screen": "orders", "title": "Bestellungen", "items": [["Tisch 4", ""], ["Tisch 7", ""], ["Abholung", "18:30"]]}}),
      ("Alles landet auf Ihrem *Terminal*. Mit Tischnummer, auch die Abholung.",
       {"type": "m_ipad", "params": {"title": "Terminal", "items": [["Tisch 4", ""], ["Tisch 7", ""], ["Abholung", "18:30"]], "stamp": "Mit Tischnummer"}}),
      ("Punkte in der Wallet. Eigene Website. Keine *Provision*.",
       {"type": "m_cards", "params": {"items": ["Punkte in der Wallet", "Eigene Website", "Keine Provision"]}}),
      ("Das Bestellsystem von Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_comment", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Sie kochen, das Lieferportal kassiert mit. Jede Bestellung, jeden Abend. 🧾",
       "Mit einem eigenen Bestellsystem bestellen Ihre Gäste direkt bei Ihnen: am Tisch über QR-Code oder NFC, zum Abholen über Ihre eigene Website. Die Bestellungen landen auf Ihrem Bestellterminal am iPad, mit Tischnummer, und Bonuspunkte sammeln Ihre Gäste in Apple Wallet und Google Wallet.",
       "Keine Provision an Lieferportale, keine Missverständnisse am Telefon, kein Rennen zwischen Tisch und Küche. Ihr Team hat mehr Zeit für die Gäste, und das Geld bleibt bei Ihnen.",
       "Das Bestellsystem für Restaurants mit QR-Code, NFC, Bestellterminal am iPad, eigener Website und Wallet-Punkten. Ohne Provision. Die Pakete stelle ich Ihnen im kostenlosen Erstgespräch vor."],
      "Kennen Sie ein Restaurant, das zu viel Provision zahlt? Schicken Sie ihm das Video. 📩",
      ["#gastronomie", "#restaurant", "#hannover", "#bestellsystem", "#digitalisierung"],
      "Wie viel Provision zahlen Sie im Monat? 🧾")

def check(v):
    c = v["caption"]; n = len(c); errs = []
    if not 1100 <= n <= 1500: errs.append(f"Caption {n}")
    if len(re.findall(r"#\w+", c)) != 5: errs.append("Hashtags")
    if re.search(r"[–—]", json.dumps(v, ensure_ascii=False)): errs.append("Gedankenstrich")
    if "goslar" in json.dumps(v, ensure_ascii=False).lower(): errs.append("Goslar")
    say = " ".join(s["say"] for s in v["segments"]).replace("*", "")
    if re.search(r"\b(du|dein|deine|dich|dir)\b", say, re.I): errs.append("Du-Form")
    low = say.lower(); norm = lambda t: re.sub(r"[^a-z0-9äöüß ]", "", t.lower())
    if norm(v["hook_text"].replace("*", "")) not in norm(say): errs.append("hook_text wird nicht gesprochen")
    for s in v["segments"]:  # sichtbare Texte aus den Parametern müssen gesprochen werden
        p = s["scene"]["params"]; texts = []
        for k in ("title", "total", "tagline", "button", "stamp", "big", "label", "headline", "query", "result"):
            if isinstance(p.get(k), str): texts.append(p[k])
        for k in ("items", "left", "right", "labels"):
            for it in p.get(k, []) or []:
                texts += it if isinstance(it, list) else [it]
        for t in texts:
            if re.sub(r"\D", "", t) and not re.sub(r"[^a-zäöüß]", "", t.lower()): continue  # reine Zahl/Uhrzeit: gesprochen als Wort
            words = [w for w in norm(t).split() if not w.isdigit()]
            if words and not all(w in norm(s["say"]) for w in words): errs.append(f"nicht gesprochen: {t}")
    return n, len(say.split()), errs

if __name__ == "__main__":
    only = set(sys.argv[1:])
    for v in V:
        n, w, errs = check(v)
        print(v["id"], v["look"], v["music"], f"Caption {n}", f"{w} Wörter", "FEHLER: " + "; ".join(errs) if errs else "ok")
        if errs or (only and v["id"] not in only): continue
        d = os.path.join(ROOT, "work", v["id"]); os.makedirs(d, exist_ok=True)
        json.dump(v, open(os.path.join(d, "job.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
