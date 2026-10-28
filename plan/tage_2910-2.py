"""Neugier-Geschichte Do 29.10.2026, Slot 2 (13:30 Berlin), Job 2026-10-29-2.
python3 plan/tage_2910-2.py [nur-diese-id ...]  -> work/2026-10-29-2/job.json

Motiv: Bruno, ein Hund mit Werbeschild, wird öfter gefragt als sein Herrchen. Geschichte bis zum Schnitt ohne Technik-
oder Firmenwort, der letzte Halbsatz bricht ab, harter Schnitt (tr "cut") auf die Schluss-Szene hund_end mit Filmtitel,
ein Satz Angebot (KI-Chatbot einzeln, 200, 350 oder 500 € einmalig, FAKTEN.md), ruhiger Aufruf WEBSITE."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIRST_END = "Kommentieren Sie WEBSITE 👇 dann schreibe ich Ihnen persönlich."
WER = "Ich bin Mihajlo und baue Websites und digitale Lösungen für Betriebe in Braunschweig, Hannover, Berlin und ganz Deutschland. Sie haben einen Ansprechpartner vom ersten Gespräch bis zur Wartung, keine Agentur dazwischen, und der Preis steht vorher fest. Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026)."
CTA = "Kommentieren Sie WEBSITE und ich schicke Ihnen den Link zum kostenlosen Erstgespräch. 👇"
SIG = "Mihajlo Systems, Webdesign für ganz Deutschland"

STORY = ("Jeden Morgen läuft Bruno mit einem *Schild* durch Hannover. Darauf steht: Fragen Sie mich. "
         "Die Leute bleiben stehen. Herr Lehmann sitzt auf der Bank und wartet. Niemand fragt ihn. "
         "Doch nachts, um elf, steht Bruno noch vor der Tür. Denn der Hund hatte…")
END = ("Mihajlo Systems. Ein KI-Chatbot beantwortet Ihre Fragen auch nachts. "
       "Einzeln gibt es ihn für einmalig 200, 350 oder 500 €. Kommentieren Sie *WEBSITE*.")

CAP = [
    "Warum fragen alle den Hund und nicht den Herrn? 🐕",
    "Ein Hund läuft jeden Morgen durch Hannover, mit einem Schild um den Hals. Die Leute bleiben stehen und fragen ihn alles, während sein Herrchen allein auf der Bank sitzt. Die Geschichte ist erfunden, aber das Prinzip kennt jeder Betrieb: Fragen kommen abends, nachts und am Wochenende, wenn niemand ans Telefon geht. Genau dort setzt eine Website mit KI-Chatbot an.",
    "Warum es wirkt: Ein Rätsel am Anfang bleibt im Kopf, und die Auflösung kommt erst mit dem letzten Satz. Wer nachts eine Antwort bekommt, bleibt eher dran als jemand, der bis zum nächsten Morgen warten muss.",
    "Angebot: Der KI-Chatbot gibt es einzeln für einmalig 200, 350 oder 500 €. Welche Variante zu Ihrem Betrieb passt, besprechen wir im kostenlosen Erstgespräch.",
    "Kennen Sie jemanden, dessen Hund mehr Fragen beantwortet als er selbst? Schicken Sie ihm das Video. 🐾",
]
TAGS = ["#webdesign", "#kleinunternehmen", "#hannover", "#chatbot", "#ki"]

def build():
    caption = "\n\n".join([CAP[0], CAP[1], CAP[2], WER, CAP[3], CTA, CAP[4], SIG, " ".join(TAGS)])
    return {
        "id": "2026-10-29-2", "date": "2026-10-29", "slot": 2,
        "topic": "Geschichte: Hund mit Werbeschild wird öfter gefragt als Herrchen (KI-Chatbot)",
        "keyword": "WEBSITE", "hook_text": "Warum fragen alle *den Hund*?", "cover_title": "Der Hund mit dem Schild",
        "audio_name": "Der Hund mit dem Schild", "music": "drive", "look": "pop", "first_comment": "Was hat Bruno wohl nachts beantwortet? 🐕 " + FIRST_END,
        "segments": [{"say": STORY, "scene": {"type": "h_hund", "params": {}}},
                     {"say": END, "scene": {"type": "hund_end", "params": {}, "tr": "cut"}}],
        "caption": caption,
    }

def check(v):
    c = v["caption"]; n = len(c); tags = re.findall(r"#\w+", c)
    assert 1100 <= n <= 1500, (v["id"], n)
    assert len(tags) == 5, (v["id"], tags)
    assert not re.search(r"[–—]", c + json.dumps(v, ensure_ascii=False)), v["id"]
    assert "goslar" not in json.dumps(v, ensure_ascii=False).lower(), v["id"]
    return n

if __name__ == "__main__":
    v = build()
    n = check(v)
    only = set(sys.argv[1:])
    if only and v["id"] not in only: sys.exit(0)
    d = os.path.join(ROOT, "work", v["id"]); os.makedirs(d, exist_ok=True)
    p = os.path.join(d, "job.json")
    if os.path.exists(p): v["look"] = json.load(open(p, encoding="utf-8")).get("look", v["look"])
    json.dump(v, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    words = len(" ".join(s["say"] for s in v["segments"]).split())
    print(v["id"], v["look"], v["music"], "Caption", n, "Zeichen,", words, "Wörter")
