"""Neugier-Geschichte Do 29.10.2026, Slot 3 (19:30 Berlin), Job-ID 2026-10-29-3.
Motiv: Ein Bäcker lässt jeden Morgen 500 Luftballons mit seiner Adresse steigen (Comic, Sprechblasen, Wendung, Schnitt).
python3 plan/tage_2910-3.py [2026-10-29-3]  -> work/2026-10-29-3/job.json

Aufbau: fünf Akte (Szenentyp h_baecker, params.act 1 bis 5, je ein Segment), danach baecker_end (Filmtitel,
Angebot in einem Satz, Aufruf WEBSITE). Das letzte Segment bekommt "tr": "cut" (harter Schnitt auf Mihajlo Systems).
Look neon, Musik phonk. Caption lang (1.100 bis 1.500 Zeichen), genau 5 Hashtags, keine Gedankenstriche, nie Goslar."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ID = "2026-10-29-3"

WER = "Ich bin Mihajlo und baue Websites und digitale Lösungen für Betriebe in Braunschweig, Hannover, Berlin und ganz Deutschland. Sie haben einen Ansprechpartner vom ersten Gespräch bis zur Wartung, keine Agentur dazwischen, und der Preis steht vorher fest. Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026)."
CTA = "Kommentieren Sie WEBSITE und ich schicke Ihnen den Link zum kostenlosen Erstgespräch. 👇"
SIG = "Mihajlo Systems, Webdesign für ganz Deutschland"
TAGS = ["#webdesign", "#bäckerei", "#kleinunternehmen", "#hannover", "#onlinemarketing"]
FIRST = "Was stand wohl auf dem Zettel am Ballon? 🎈 Kommentieren Sie WEBSITE 👇 dann schreibe ich Ihnen persönlich."

HOOK = "Die Geschichte ist erfunden, ein Comic. Die Frage dahinter ist aber echt: Wie finden neue Kunden eine Bäckerei, ein Café oder einen Handwerksbetrieb in Hannover, Braunschweig oder Berlin? Wer heute eine Bäckerei in der Nähe sucht, tippt oft zuerst bei Google ein und schaut danach auf die Website."
WIRKT = "Warum die Geschichte hängen bleibt: Sie ist absurd und ein bisschen rätselhaft, und man will wissen, was hinter den Ballons steckt. Eine gute Website funktioniert ähnlich. Sie erzählt in wenigen Sekunden, wer Sie sind, wo Sie sind und was Sie anbieten."
PREIS = "Eine Landingpage, also eine Website mit einer Seite, die Ihre Kunden direkt zur Anfrage führt, gibt es ab 99 € im Monat. Bei Miete gilt eine Mindestlaufzeit von 12 Monaten, danach ist sie monatlich kündbar. Einmalig gibt es sie für 990 €."

SEGMENTS = [
    ("Stellen Sie sich vor: Ein Bäcker lässt 500 Luftballons steigen. Jeder trägt seine Adresse.", {"type": "h_baecker", "params": {"act": 1}}),
    ("Die Nachbarn lachen. Eine Kundin fragt: Warum?", {"type": "h_baecker", "params": {"act": 2}}),
    ("Die Ballons fliegen über die Stadt. Einer landet im Sandkasten.", {"type": "h_baecker", "params": {"act": 3}}),
    ("Am Nachmittag steht die halbe Stadt vor der Tür.", {"type": "h_baecker", "params": {"act": 4}}),
    ("Das Brot ist ausverkauft. Denn der Bäcker hatte…", {"type": "h_baecker", "params": {"act": 5}}),
    ("Mihajlo Systems. Ihre Landingpage ab 99 Euro im Monat, mit 12 Monaten Mindestlaufzeit, oder einmalig 990 Euro. Kommentieren Sie WEBSITE.", {"type": "baecker_end", "params": {}, "tr": "cut"}),
]


def caption():
    parts = [
        "Warum lässt ein Bäcker jeden Morgen 500 Luftballons steigen? 🎈",
        HOOK,
        WIRKT,
        WER,
        PREIS,
        CTA,
        "Kennen Sie einen Bäcker oder Handwerker, der mehr Kunden braucht? Schicken Sie ihm das Video. 📩",
        SIG,
        " ".join(TAGS),
    ]
    return "\n\n".join(parts)


def job():
    segs = [{"say": s, "scene": sc} for s, sc in SEGMENTS]
    return {
        "id": ID, "date": "2026-10-29", "slot": 3, "topic": "Geschichte: Bäcker lässt 500 Luftballons steigen (Website)",
        "keyword": "WEBSITE", "hook_text": "Warum lässt der Bäcker *500* Ballons steigen?",
        "cover_title": "Warum steigen die *Ballons*?", "audio_name": "Die 500 Luftballons",
        "music": "phonk", "look": "neon", "first_comment": FIRST, "caption": caption(), "segments": segs,
    }


def check(v):
    c = v["caption"]; n = len(c); tags = re.findall(r"#\w+", c)
    words = len(" ".join(s["say"] for s in v["segments"]).replace("…", " ").split())
    assert 1100 <= n <= 1500, ("Caption-Länge", n)
    assert len(tags) == 5, ("Hashtags", tags)
    assert not re.search(r"[–—]", c + json.dumps(v, ensure_ascii=False)), "Gedankenstrich"
    assert "goslar" not in json.dumps(v, ensure_ascii=False).lower(), "Goslar"
    assert 40 <= words <= 70, ("Sprechtext-Wörter", words)
    assert all(len(s["say"].split()) >= 3 for s in v["segments"]), "Segment unter 3 Wörter"
    assert v["segments"][-1]["scene"]["type"].endswith("_end"), "letzte Szene muss *_end sein"
    assert 2 <= len(v["cover_title"].split()) <= 5 and 3 <= len(v["hook_text"].replace("*", "").split()) <= 7, "Titel/Hook-Länge"
    return n, words


if __name__ == "__main__":
    only = set(sys.argv[1:]) or {ID}
    v = job()
    n, words = check(v)
    if ID not in only:
        sys.exit(0)
    d = os.path.join(ROOT, "work", ID); os.makedirs(d, exist_ok=True)
    json.dump(v, open(os.path.join(d, "job.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(ID, v["look"], v["music"], "Caption", n, "Zeichen,", words, "Wörter")
