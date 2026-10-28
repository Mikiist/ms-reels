"""Neugier-Geschichte Fr 30.10.2026, Slot 2 (13:30 Berlin): Die Bananen-Frau (h_katze + bananen_end).
python3 plan/tage_3010-2.py [nur-diese-id ...]  -> work/2026-10-30-2/job.json

Aufbau (wie plan/tage_2810.py): Comic-Geschichte ohne Technik- oder Firmenwort bis zum Schnitt, der letzte Halbsatz
bricht ab, harter Schnitt (tr "cut") auf die Schluss-Szene bananen_end mit Filmtitel, ein Satz Angebot, Aufruf WEBSITE.
Angebot: Bestellsystem für Restaurants und Friseure. Preise bewusst nicht genannt (siehe Bericht im Auftrag)."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIRST = "Was hat der Obstmann wohl geflüstert? 🍌 Kommentieren Sie WEBSITE, dann erfahren Sie, wie das Bestellsystem funktioniert."
WER = "Ich bin Mihajlo und baue Websites und digitale Lösungen für Betriebe in Braunschweig, Hannover, Berlin und ganz Deutschland. Sie haben einen Ansprechpartner vom ersten Gespräch bis zur Wartung, keine Agentur dazwischen, und der Preis steht vorher fest. Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026)."
CTA = "Kommentieren Sie WEBSITE und ich schicke Ihnen den Link zum kostenlosen Erstgespräch. 👇"
SIG = "Mihajlo Systems, Webdesign für ganz Deutschland"
SHARE = "Kennen Sie einen Gastwirt oder Friseur, dem diese Geschichte gefällt? Schicken Sie ihm das Video. 📩"

CAP = [
    "Stellen Sie sich vor, Sie kaufen Bananen und finden auf jeder einzelnen eine Telefonnummer. 🍌 Warum tut jemand so etwas? Die Antwort steht am Ende des Videos.",
    "Die Geschichte ist erfunden, ein Comic mit einer kleinen Pointe. Die Idee dahinter ist aber echt: Gäste wollen heute am Handy bestellen, ohne lange Telefonate. Ein Bestellsystem für Restaurants und Friseure passt genau dorthin.",
    "Warum es wirkt: Eine Geschichte, die man zu Ende hören will, bleibt hängen. Erst zum Schluss merkt man, dass es um ein echtes Angebot geht, und dann hat man sich selbst entschieden, weiter zuzuschauen.",
    "Das Angebot: ein Bestellsystem für Restaurants und Friseure, ohne Provision. Gäste bestellen direkt am eigenen Handy, per QR-Code am Tisch. Die Bestellungen laufen übersichtlich am iPad zusammen. Was es bei Ihnen kostet, besprechen wir im kostenlosen Erstgespräch.",
]

V = []
def video(date, slot, topic, hook_text, cover, audio, music, look, story, end, first, tags):
    caption = "\n\n".join(CAP + [WER, CTA, SHARE, SIG, " ".join(tags)])
    V.append({"id": f"{date}-{slot}", "date": date, "slot": slot, "topic": topic, "keyword": "WEBSITE", "hook_text": hook_text,
              "cover_title": cover, "audio_name": audio, "music": music, "look": look, "first_comment": first,
              "segments": [{"say": story[0], "scene": story[1]}, {"say": end[0], "scene": end[1]}], "caption": caption})

video("2026-10-30", 2, "Geschichte: Frau schreibt Telefonnummer auf 10.000 Bananen (Bestellsystem)",
      "Zehntausend Bananen, *eine* Nummer", "Was steht auf der Banane?", "Die 10.000 Bananen", "house", "editorial",
      ("Sie glauben, im Supermarkt haben Sie schon alles gesehen. Dann schreibt Frau Lehmann um sechs Uhr früh ihre *Telefonnummer* auf *zehntausend* Bananen. "
       "Der Kassierer ruft: Was soll das? Sie sagt nur: *Der Obstmann* soll endlich anrufen. Die Kunden murren, sie schreibt weiter. "
       "Am nächsten Morgen kommt der Obstmann an die Kasse, schaut auf eine Banane und wird *knallrot*. Denn der Obstmann hatte…",
       {"type": "h_katze", "params": {}}),
      ("Mihajlo Systems. Ein Bestellsystem für Restaurants und Friseure, ohne Provision. Kommentieren Sie *WEBSITE*.",
       {"type": "bananen_end", "params": {}, "tr": "cut"}),
      FIRST,
      ["#webdesign", "#gastronomie", "#berlin", "#bestellsystem", "#digitalisierung"])

def check(v):
    c = v["caption"]; n = len(c); tags = re.findall(r"#\w+", c)
    assert 1100 <= n <= 1500, (v["id"], n)
    assert len(tags) == 5, (v["id"], tags)
    assert not re.search(r"[–—]", c + json.dumps(v, ensure_ascii=False)), v["id"]
    assert "goslar" not in json.dumps(v, ensure_ascii=False).lower(), v["id"]
    return n

if __name__ == "__main__":
    only = set(sys.argv[1:])
    for v in V:
        n = check(v)
        if only and v["id"] not in only: continue
        d = os.path.join(ROOT, "work", v["id"]); os.makedirs(d, exist_ok=True)
        p = os.path.join(d, "job.json")
        if os.path.exists(p): v["look"] = json.load(open(p, encoding="utf-8")).get("look", v["look"])
        json.dump(v, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        words = len(" ".join(s["say"] for s in v["segments"]).split())
        print(v["id"], v["look"], v["music"], "Caption", n, "Zeichen,", words, "Wörter")
