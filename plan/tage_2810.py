"""Neugier-Geschichten Mi 28.10. bis Fr 30.10.2026, 1 Reel pro Tag (Uhrzeit nach Wochentag, engine/publish.py ZEITEN).
python3 plan/tage_2810.py [nur-diese-id ...]  -> work/<datum>-1/job.json

Aufbau jedes Reels (Mihajlo, 26./27.10.2026): Comic-Geschichte ohne Technik- oder Firmenwort bis zum Schnitt,
der letzte Halbsatz bricht ab, harter Schnitt (tr "cut") auf eine eigene Schluss-Szene *_end mit Filmtitel
„Mihajlo Systems“, ein Satz Angebot, ruhiger Aufruf WEBSITE. Captions sind schon lang (Story-Muster), darum
ist plan/lange_captions.py hier nicht nötig; check() prüft Länge, Hashtags, Gedankenstriche und Goslar."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIRST_END = "Kommentieren Sie WEBSITE 👇 dann schreibe ich Ihnen persönlich."
WER = [
    "Ich bin Mihajlo und baue Websites und digitale Lösungen für Betriebe in Braunschweig, Hannover, Berlin und ganz Deutschland. Sie haben einen Ansprechpartner vom ersten Gespräch bis zur Wartung, keine Agentur dazwischen, und der Preis steht vorher fest. Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026).",
    "Hinter Mihajlo Systems stehe ich, Mihajlo, mit Kunden in ganz Deutschland, von Hannover bis Berlin. Ich baue alles selbst und bin vom Erstgespräch bis zur Wartung Ihr fester Ansprechpartner, mit festem Preis. Bei Google stehe ich bei 4,8 Sternen aus 19 Bewertungen (Stand September 2026).",
    "Ich bin Mihajlo von Mihajlo Systems. Ich betreue Betriebe in Braunschweig, Hannover, Berlin und per Videoanruf in ganz Deutschland, mit einem Ansprechpartner und festem Preis. 4,8 Sterne bei Google aus 19 Bewertungen (Stand September 2026).",
]
CTA = "Kommentieren Sie WEBSITE und ich schicke Ihnen den Link zum kostenlosen Erstgespräch. 👇"
SIG = "Mihajlo Systems, Webdesign für ganz Deutschland"

V = []
def video(date, topic, hook_text, cover, audio, music, look, story, end, cap, share, tags, first):
    i = len(V)
    caption = "\n\n".join(cap + [WER[i % 3], CTA, share, SIG, " ".join(tags)])
    V.append({"id": f"{date}-1", "date": date, "slot": 1, "topic": topic, "keyword": "WEBSITE", "hook_text": hook_text, "cover_title": cover,
              "audio_name": audio, "music": music, "look": look, "first_comment": first,
              "segments": [{"say": story[0], "scene": story[1]}, {"say": end[0], "scene": end[1]}], "caption": caption})

# ---------- Mi 28.10. 12:00: Die Schlange vor dem Friseur (Terminbuchung) ----------
video("2026-10-28", "Geschichte: Schlange vor dem Friseursalon (Terminbuchung)", "Jeden Samstag um *sechs*", "Warum stehen die *hier*?",
      "Herr Krause versteht die Welt nicht mehr", "drive", "story",
      ("Jeden Samstag um sechs stehen zwölf Leute vor einem *Friseursalon*. Im Regen, mit Klappstühlen. Um neun gibt es *Streit*. "
       "Dann, eines Samstags, ist die Straße *leer*. Nur Herr Krause wartet, ganz allein. Um Punkt neun kommt eine Kundin und geht einfach *rein*. "
       "Herr Krause versteht die Welt nicht mehr. Denn der Salon hatte…", {"type": "h_salon", "params": {}}),
      ("Mihajlo Systems. Eine Online-Terminbuchung: Ihre Kunden buchen *selbst*, rund um die Uhr. Kommentieren Sie *WEBSITE*.",
       {"type": "salon_end", "params": {}, "tr": "cut"}),
      ["Stellen Sie sich vor: Jeden Samstag um sechs Uhr früh stehen zwölf Leute im Regen vor einem Friseursalon. ✂️",
       "Klar, die Geschichte ist ausgedacht. Die Idee dahinter stimmt aber: Wer bei Ihnen nur per Telefon oder vor Ort einen Termin bekommt, wartet, ärgert sich oder geht woanders hin. Mit einer Online-Terminbuchung auf Ihrer Website buchen Ihre Kunden ihren Termin selbst, auch abends und am Wochenende. Für Friseure, Kosmetikstudios, Praxen und alle, die mit Terminen arbeiten.",
       "Das Telefon klingelt weniger, der Kalender ist trotzdem voll, und niemand muss mehr vor der Tür warten. Ihre Kunden sehen freie Zeiten sofort und Sie haben den Kopf frei für Ihre Arbeit.",
       "Websites gibt es ab 99 € im Monat (12 Monate Mindestlaufzeit) oder einmalig 990 €. Wie die Terminbuchung bei Ihnen aussieht, besprechen wir im kostenlosen Erstgespräch."],
      "Kennen Sie einen Salon, vor dem samstags auch alle warten? Schicken Sie ihm das Video. 📩",
      ["#webdesign", "#friseur", "#hannover", "#terminbuchung", "#digitalisierung"],
      "Wo waren wohl alle anderen? 😄 " + FIRST_END)

# ---------- Do 29.10. 09:30: Kurz vor Mitternacht (Gutscheinshop) ----------
video("2026-10-29", "Geschichte: Geburtstagsgeschenk um Mitternacht (Gutscheinshop)", "Kurz vor *Mitternacht*", "Alles hat *zu*",
      "Kurz vor Mitternacht hatte alles zu", "house", "cinema",
      ("Kurz vor Mitternacht rennt ein Mann durch die *Stadt*. Morgen hat seine Frau Geburtstag, und er hat *nichts*. Blumenladen zu. Parfümerie zu. Alles *zu*. "
       "Er sitzt auf dem Bordstein. Dann sieht er das dunkle Studio gegenüber und *lächelt*. "
       "Am Morgen öffnet sie einen Umschlag, *schreit* vor Freude und fällt ihm um den Hals. Denn das Studio hatte…", {"type": "h_nacht", "params": {}}),
      ("Mihajlo Systems. Einen Gutscheinshop: Gutscheine kaufen und *verschenken*, auch um Mitternacht. Kommentieren Sie *WEBSITE*.",
       {"type": "gift_end", "params": {}, "tr": "cut"}),
      ["Stellen Sie sich vor: Kurz vor Mitternacht, morgen hat Ihre Frau Geburtstag, und jeder Laden in der Stadt hat zu. 🌙",
       "Klar, die Geschichte ist ausgedacht. Die Idee dahinter stimmt aber: Viele Geschenke werden in letzter Minute gekauft, oft abends, wenn Ihr Laden längst zu ist. Mit einem Online-Gutscheinshop auf Ihrer Website kaufen Ihre Kunden Gutscheine rund um die Uhr, drucken sie aus oder verschenken sie direkt. Für Kosmetikstudios, Friseure, Restaurants, Wellness und jeden Laden mit Stammkunden.",
       "Sie verkaufen, während Sie schlafen, und jeder Gutschein bringt einen neuen Gast zu Ihnen, der Sie vielleicht noch gar nicht kannte. Und die Beschenkten erzählen weiter, wo es so schön war.",
       "Websites gibt es ab 99 € im Monat (12 Monate Mindestlaufzeit) oder einmalig 990 €. Wie Ihr Gutscheinshop aussieht, besprechen wir im kostenlosen Erstgespräch."],
      "Kennen Sie jemanden, der Geschenke immer in letzter Minute kauft? Schicken Sie ihm das Video. 🎁",
      ["#website", "#kosmetikstudio", "#braunschweig", "#gutschein", "#onlinemarketing"],
      "Was stand wohl im Umschlag? 🎁 " + FIRST_END)

# ---------- Fr 30.10. 11:00: Der Pfeil auf dem Dach (Website + Google Maps) ----------
video("2026-10-30", "Geschichte: Tischler mit Pfeil auf dem Dach (Website und Google Maps)", "Ein *zwölf* Meter hoher Pfeil", "Wozu der *Pfeil*?",
      "Den Pfeil hatte er nur woanders aufgestellt", "trap", "story",
      ("Ein Tischler baut einen *zwölf* Meter hohen Pfeil auf sein Dach. Damit ihn endlich jemand findet. Die Nachbarn lachen. Die Kunden fahren *vorbei*. "
       "Er hängt Lichter dran, dann Luftballons. *Nichts*. Eine Woche später ist der Pfeil weg, und der Hof steht voller *Autos*. "
       "Die Nachbarin fragt: Wo ist Ihr Pfeil? Er zwinkert. Den hatte er nur woanders aufgestellt…", {"type": "h_pfeil", "params": {}}),
      ("Mihajlo Systems. Eine Website mit Eintrag bei *Google Maps*, damit Ihre Kunden Sie finden. Kommentieren Sie *WEBSITE*.",
       {"type": "pfeil_end", "params": {}, "tr": "cut"}),
      ["Stellen Sie sich vor: Ein Tischler baut einen zwölf Meter hohen Pfeil auf sein Dach, nur damit ihn endlich jemand findet. 🪵",
       "Klar, die Geschichte ist ausgedacht. Die Idee dahinter stimmt aber: Wer heute einen Tischler, Maler oder Elektriker sucht, sucht bei Google und auf Google Maps. Wer dort mit Website, Fotos, Öffnungszeiten und Leistungen steht, wird gefunden. Wer fehlt, bleibt unsichtbar, egal wie groß das Schild am Haus ist.",
       "Der Pfeil zeigt dann nicht mehr vom Dach auf die Werkstatt, sondern von der Suche direkt zu Ihnen. Ein Tipp auf Route oder Anrufen, und der Kunde ist da.",
       "Im Business-Paket stecken bis 5 Seiten, KI-Chatbot Basis, SEO und Google Maps: 1.990 € einmalig oder 179 € im Monat (12 Monate Mindestlaufzeit)."],
      "Kennen Sie einen Handwerker, den man nie findet? Schicken Sie ihm das Video. 📩",
      ["#webdesign", "#tischler", "#berlin", "#googlemaps", "#handwerk"],
      "Wo hat er den Pfeil wohl hingestellt? 📍 " + FIRST_END)

# Kino-Look zeigt den Text-Hook oben; er soll nur den Einstieg tragen, nicht die ganze Geschichte (Sekunden)
for v in V:
    if v["look"] == "cinema": v["hook_until"] = 3.2

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
