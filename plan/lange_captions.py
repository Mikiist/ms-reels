"""Macht aus den kurzen Captions lange (Vorbild: Kugel-Post vom 22.10.2026, viel mehr Reichweite).
Aufbau: Hook, Thema, warum es wirkt, wer Mihajlo ist (mit echten Google-Zahlen), Angebot, Aufruf, Teilen, Signatur, 5 Hashtags.
python3 plan/lange_captions.py [ids...]  (ohne ids: alle work/2026-10-2*/ und 2026-10-3*/)"""
import json, os, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

WARUM = [
    "Gut aussehen allein bringt keinen Auftrag. Darum lädt jede Seite schnell auf dem Handy, wird bei Google gefunden und führt Besucher Schritt für Schritt zum Anruf oder zum Formular. Auf Wunsch beantwortet ein KI-Chatbot Fragen, auch nachts.",
    "Eine Website muss nicht nur schön sein, sie muss arbeiten. Wer Ihre Seite öffnet, sieht in wenigen Sekunden, was Sie anbieten, wo Sie arbeiten und wie man Sie erreicht. Dann landet die Anfrage bei Ihnen und nicht bei der Konkurrenz.",
    "Ihre Kunden entscheiden in Sekunden, ob sie bleiben. Deshalb baue ich jede Seite fürs Handy zuerst: schnell, klar aufgebaut und mit einem Knopf, der direkt zum Anruf oder zur Anfrage führt.",
]
WER = [
    "Ich bin Mihajlo und baue Websites für Handwerker, Praxen und kleine Firmen, in Braunschweig, Hannover, Berlin und ganz Deutschland. Sie haben einen Ansprechpartner vom ersten Gespräch bis zur Wartung, und der Preis steht vorher fest. Bei Google stehe ich bei 4,8 Sternen aus 19 Bewertungen (Stand September 2026).",
    "Hinter Mihajlo Systems stehe ich, Mihajlo, mit Kunden in ganz Deutschland. Ich baue alles selbst, ohne Agentur dazwischen, und bin vom Erstgespräch bis zur Wartung Ihr Ansprechpartner. Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026).",
    "Ich bin Mihajlo von Mihajlo Systems. Ich betreue Betriebe in Braunschweig, Hannover, Berlin und per Videoanruf in ganz Deutschland, mit festem Preis und einem Ansprechpartner. 4,8 Sterne bei Google aus 19 Bewertungen (Stand September 2026).",
]
OFFER = "Landingpage ab 99 € im Monat (12 Monate Mindestlaufzeit) oder einmal 990 €. KI-Chatbot und Google-Setup gibt es ab dem Business-Paket."
CTA = "Kommentieren Sie WEBSITE und ich schicke Ihnen den Link zum kostenlosen Erstgespräch. Dabei schauen wir uns gern auch Ihre jetzige Seite an. 👇"
SHARE = "Kennen Sie jemanden, dessen Website dringend neu muss? Schicken Sie ihm das Video. 📩"
SIG = "Mihajlo Systems, Webdesign für ganz Deutschland"

def lang(cap, i):
    parts = [p.strip() for p in cap.split("\n\n") if p.strip()]
    tags = next((p for p in parts if p.startswith("#")), "")
    save = next((p for p in parts if p.startswith("🔖")), "")
    keep = [p for p in parts if not p.startswith("#") and not p.startswith("💬") and not p.startswith("🔖") and not p.startswith("Kennen Sie")]
    hook, rest = keep[0], keep[1:]
    has_price = any("€" in p for p in rest)
    out = [hook] + rest[:1] + [WARUM[i % 3], WER[i % 3]] + rest[1:]
    if not has_price: out.append(OFFER)
    out += [CTA] + ([save] if save else []) + [SHARE, SIG, tags]
    txt = "\n\n".join(out)
    assert len(txt) <= 2200, (len(txt), hook)
    assert "–" not in txt and "—" not in txt
    assert "Goslar" not in txt, "Goslar kommt in Reels nicht mehr vor (Mihajlo, 23.10.2026)"
    return txt

ids = sys.argv[1:] or sorted(os.path.basename(d) for d in glob.glob(os.path.join(ROOT, "work", "2026-10-*")))
for n, id_ in enumerate(ids):
    for f in ("post.json", "job.json"):
        p = os.path.join(ROOT, "work", id_, f)
        if not os.path.exists(p): continue
        d = json.load(open(p, encoding="utf-8"))
        if "caption" not in d or d["caption"].count("\n\n") >= 7: continue
        d["caption"] = lang(d["caption"], n)
        json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(id_, len(json.load(open(os.path.join(ROOT, "work", id_, "job.json"), encoding="utf-8"))["caption"]))
