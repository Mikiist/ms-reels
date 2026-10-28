"""Neugier-Geschichte Fr 30.10.2026, Slot 3 (19:30 Berlin), Job 2026-10-30-3.
python3 plan/tage_3010-3.py [2026-10-30-3] -> work/2026-10-30-3/job.json

Motiv: Herr Wendt steht nachts mit einem Suchscheinwerfer auf dem Dach seines Ladens (h_suchlicht, vier Einstellungen
= vier Segmente mit params.shot 1 bis 4). Wendung: Er sucht eine Kundin, die um zwei gefragt hat. Harter Schnitt auf
suchlicht_end (Filmtitel Mihajlo Systems, KI-Chatbot einzeln 200, 350 oder 500 Euro einmalig, Aufruf WEBSITE).
Look brutal, Musik cinematic. Die Geschichte ist erkennbar erfunden (Comic-Figuren)."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIRST_END = "Kommentieren Sie WEBSITE 👇 dann schreibe ich Ihnen persönlich."
WER = ("Ich bin Mihajlo und baue Websites, Bestellsysteme und KI-Chatbots für Betriebe in Braunschweig, Hannover, Berlin "
       "und ganz Deutschland. Sie haben einen Ansprechpartner vom ersten Gespräch bis zur Wartung, und der Preis steht vorher fest. "
       "Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026).")
CTA = "Kommentieren Sie WEBSITE und ich schicke Ihnen den Link zum kostenlosen Erstgespräch. 👇"
SIG = "Mihajlo Systems, Webdesign für ganz Deutschland"

V = []
def video(date, slot, topic, hook_text, cover, audio, music, look, segs, cap, tags, first):
    caption = "\n\n".join(cap + [WER, CTA_ANGEBOT, CTA, cap_share(cap), SIG, " ".join(tags)])
    V.append({"id": f"{date}-{slot}", "date": date, "slot": slot, "topic": topic, "keyword": "WEBSITE", "hook_text": hook_text,
              "cover_title": cover, "audio_name": audio, "music": music, "look": look, "first_comment": first,
              "segments": [{"say": s, "scene": sc} for s, sc in segs], "caption": caption})

CTA_ANGEBOT = ("Der KI-Chatbot gibt es einzeln für 200, 350 oder 500 Euro einmalig. Welche Variante zu Ihrem Betrieb passt, "
               "besprechen wir im kostenlosen und unverbindlichen Erstgespräch.")

def cap_share(cap):  # Teilen-Zeile steht als letzter Absatz der Fließtext-Liste
    return "Kennen Sie einen Betrieb, der abends immer wieder dieselben Fragen per Nachricht bekommt? Schicken Sie ihm das Video. 📩"

# ---------- Fr 30.10. 19:30: Der Mann auf dem Dach (KI-Chatbot nachts) ----------
video("2026-10-30", 3, "Geschichte: Mann mit Suchscheinwerfer auf dem Dach (KI-Chatbot nachts)",
      "Jede Nacht um zwei: *Licht* am Himmel", "Was sucht er am Himmel?", "Der Mann auf dem Dach", "cinematic", "brutal",
      [("Jede Nacht um zwei steht Herr Wendt auf seinem Dach. Mit einem Suchscheinwerfer.", {"type": "h_suchlicht", "params": {"shot": 1}}),
       ("Er sucht den Himmel ab. Die Nachbarn glauben: *Außerirdische*.", {"type": "h_suchlicht", "params": {"shot": 2}, "tr": "cut"}),
       ("Dann fragt ihn die Polizei: Wonach *suchen* Sie?", {"type": "h_suchlicht", "params": {"shot": 3}, "tr": "cut"}),
       ("Er sucht eine *Kundin*. Sie hat um zwei gefragt. Niemand hat geantwortet. Denn der Laden hatte…", {"type": "h_suchlicht", "params": {"shot": 4}, "tr": "cut"}),
       ("Mihajlo Systems. Ein KI-Chatbot beantwortet nachts Ihre Fragen, einzeln für 200, 350 oder 500 Euro einmalig. Kommentieren Sie *WEBSITE*.",
        {"type": "suchlicht_end", "params": {}, "tr": "cut"})],
      ["Stellen Sie sich vor: Jede Nacht um zwei steht ein Mann auf dem Dach seines Ladens und sucht mit einem riesigen Suchscheinwerfer den Himmel ab. 🔦",
       "Die Geschichte ist ausgedacht, das Problem dahinter kennen viele Betriebe: Kundinnen und Kunden schreiben abends oder nachts eine Frage, und bis zum nächsten Morgen kommt keine Antwort. Wer abends eine Frage hat und keine Antwort bekommt, sucht sich eben einen anderen Betrieb. Ein KI-Chatbot auf Ihrer Website antwortet genau dann, rund um die Uhr, mit Ihren Informationen.",
       "Warum die Geschichte hängen bleibt: Am Anfang steht ein Rätsel, in der Mitte eine Wendung. Jeder kennt das Gefühl, auf eine Antwort zu warten, die nicht kommt."],
      ["#webdesign", "#kleinunternehmen", "#hannover", "#chatbot", "#ki"],
      "Was hat Herr Wendt nachts gesucht? 🔦 " + FIRST_END)

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
