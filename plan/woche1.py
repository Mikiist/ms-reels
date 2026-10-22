"""Testwoche 1 (Sa 24.10. bis Fr 30.10.2026): 21 Reels. Erzeugt work/<datum>-<slot>/job.json.
python3 plan/woche1.py [nur-diese-id ...]

Slots (Europe/Berlin): 1 = 07:45 Wissen/Tipp (zum Speichern), 2 = 12:30 Angebot/Vertrauen, 3 = 19:30 Problem/Story (größte Reichweite).
Jeder Hook ist eine eigene Signature-Szene (Bild + Sound ab 0,00 s + Text-Hook oben + gesprochener Hook)."""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CTA = {"type": "cta", "params": {"keyword": "WEBSITE"}}
CTA_SAYS = ["Kommentieren Sie *WEBSITE*, und Sie bekommen Ihr kostenloses Erstgespräch.",
            "Schreiben Sie *WEBSITE* in die Kommentare. Ich melde mich persönlich bei Ihnen.",
            "Kommentieren Sie *WEBSITE*, und wir schauen uns Ihre Seite kostenlos gemeinsam an.",
            "Ein Wort in die Kommentare: *WEBSITE*. Den Rest machen wir zusammen."]
FIRST = "Kommentieren Sie WEBSITE 👇 dann schreibe ich Ihnen persönlich."

def C(hook, body, offer=""):
    """Caption: Hook-Zeile, Text mit Suchbegriffen, Aufruf. Hashtags hängt V() an."""
    parts = [hook, body]
    if offer: parts.append(offer)
    parts.append("💬 Kommentieren Sie WEBSITE und Sie bekommen Ihr kostenloses Erstgespräch per Nachricht.")
    return "\n\n".join(parts)

V = []
def video(date, slot, topic, hook_text, cover, audio, music, segs, caption, tags, share=""):
    cap = caption + ("\n\n" + share if share else "") + "\n\n" + " ".join(tags)
    assert len(tags) == 5, topic
    V.append({"id": f"{date}-{slot}", "date": date, "slot": slot, "topic": topic, "keyword": "WEBSITE", "hook_text": hook_text,
              "cover_title": cover, "audio_name": audio, "music": music, "first_comment": FIRST,
              "segments": [{"say": s, "scene": sc} for s, sc in segs] + [{"say": CTA_SAYS[len(V) % len(CTA_SAYS)], "scene": CTA}], "caption": cap})

SHARE = "Kennen Sie einen Betrieb, der das sehen sollte? Schicken Sie es ihm."

# ---------------- Tag 1: Samstag 24.10. ----------------
video("2026-10-24", 1, "Herzlich willkommen macht unsichtbar", "Dieser Satz macht Sie *unsichtbar*", "Dieser Satz macht Sie *unsichtbar*",
      "Dieser Satz macht Ihre Website unsichtbar", "house", [
      ("Dieser eine Satz macht Ihre Website *unsichtbar*.", {"type": "h_static", "params": {"title": "KEIN SIGNAL"}}),
      ("Herzlich willkommen auf unserer Homepage. Steht das bei Ihnen ganz *oben*?", {"type": "statement", "params": {"big": "HALLO?"}}),
      ("Google sucht nach *Was* und *Wo*. Malerbetrieb in Goslar zum Beispiel.", {"type": "google_search", "params": {"query": "Maler Goslar", "result": "Malerbetrieb Jonas", "url": "maler-jonas.de", "badge": "Gefunden"}}),
      ("Schreiben Sie oben, was Sie machen und wo. Das reicht schon.", {"type": "before_after", "params": {"headline": "Ihr Malerbetrieb in Goslar.", "sticker": "BESSER"}}),
      ("Was, Wo und ein Knopf zum Anrufen. So *findet* man Sie.", {"type": "checklist", "params": {"items": ["Was Sie machen", "Wo Sie arbeiten", "Knopf zum Anrufen"], "stamp": "Gefunden"}}),
      ], C("Steht „Herzlich willkommen“ ganz oben auf Ihrer Website? 👀",
           "Genau dieser Satz kostet viele Betriebe Kunden. Google und Ihre Kunden wollen in der ersten Zeile wissen, was Sie machen und wo: zum Beispiel „Malerbetrieb in Goslar“ oder „Elektriker in Berlin“. Dazu ein Knopf zum Anrufen, und Ihre Startseite arbeitet für Sie.",
           ), ["#website", "#seo", "#handwerk", "#goslar", "#marketingtipps"], "🔖 Speichern Sie sich das für Ihre nächste Änderung.")

video("2026-10-24", 2, "Jackpot: Landingpage Miete oder Festpreis", "Der *Jackpot* für Ihren Betrieb?", "Der *Jackpot* für Ihren Betrieb",
      "Jackpot für Ihren Betrieb", "phonk", [
      ("Jackpot für Ihren Betrieb? Eine Website, die *Anfragen* bringt.", {"type": "h_slot", "params": {"jackpot": "JACKPOT"}}),
      ("Kunden finden Sie, klicken und fragen direkt bei Ihnen an.", {"type": "phone_notifs", "params": {"count": 6}}),
      ("Und Sie entscheiden: *monatlich* zahlen oder einmal.", {"type": "versus", "params": {"left": ["Miete", "ab 99 € im Monat, 12 Monate"], "right": ["Festpreis", "990 € einmalig"]}}),
      ("Ab 99 Euro im Monat, oder einmalig 990 Euro. Dann sparen Sie *198 Euro*.", {"type": "price", "params": {"paket": "landingpage"}}),
      ("Gebaut von Mihajlo Systems aus Goslar.", {"type": "logo", "params": {"tagline": "Websites, die Anfragen bringen"}}),
      ], C("Der Jackpot für Ihren Betrieb? Eine Website, die Anfragen bringt. 🎰",
           "Eine Landingpage für Ihren Betrieb: eine Seite, schnell, fürs Handy gebaut und mit Knopf zur Anfrage. Sie wählen selbst, ob Sie monatlich zahlen oder einmal.",
           "Ab 99 € im Monat (12 Monate Mindestlaufzeit, Hosting und Wartung inklusive) oder einmalig 990 € Festpreis. Mit dem Festpreis sparen Sie 198 € gegenüber 12 Monaten Miete."),
      ["#webdesign", "#selbstständig", "#kleinunternehmen", "#berlin", "#website"])

video("2026-10-24", 3, "Website ohne Puls", "Ihre Website ist *tot*?", "Ihre Website ist *tot*?",
      "Ihre Website hat keinen Puls", "trap", [
      ("Ihre Website hat keinen *Puls* mehr.", {"type": "h_ekg", "params": {"label": "PULS IHRER WEBSITE", "flat_text": "KEIN SIGNAL"}}),
      ("Das Telefon bleibt still, das Postfach bleibt *leer*.", {"type": "clock", "params": {"from": 8, "to": 17, "label": "Kein einziger Anruf"}}),
      ("Weil die Seite *veraltet* ist und am Handy kaum lädt.", {"type": "alarm", "params": {"title": "VERALTET", "sub": "Seit Jahren nicht aktualisiert"}}),
      ("Mihajlo Systems holt sie zurück ins *Leben*.", {"type": "logo", "params": {"tagline": "Websites aus Goslar"}}),
      ("Schnell, modern und für das Handy gebaut.", {"type": "speed", "params": {"score": 97, "label": "PageSpeed mobil, Beispiel"}}),
      ("Damit Ihr Telefon wieder *klingelt*.", {"type": "phone_notifs", "params": {"count": 7}}),
      ], C("Ihre Website hat keinen Puls mehr? 🫀",
           "Wenn das Telefon still bleibt und über die Website keine Anfragen kommen, liegt es oft an der Seite selbst: veraltet, langsam, am Handy kaum zu bedienen. Ich baue Websites für Handwerker und Betriebe in ganz Deutschland, die wieder Anfragen bringen."),
      ["#webdesign", "#handwerker", "#unternehmer", "#deutschland", "#website"], SHARE)

# ---------------- Tag 2: Sonntag 25.10. ----------------
video("2026-10-25", 1, "Anruf-Knopf am Handy", "Ihr Kunde will *anrufen*", "Ihr Kunde will *anrufen*",
      "Ihr Kunde will anrufen", "cinematic", [
      ("Ein Kunde will Sie *anrufen*. Und findet Ihre Nummer nicht.", {"type": "h_ring", "params": {"caller": "Möglicher Kunde", "missed": 3}}),
      ("Am Handy gehört ganz oben ein Knopf: *Jetzt anrufen*.", {"type": "cursor_click", "params": {"button": "Jetzt anrufen", "done": "Wird verbunden"}}),
      ("Ein Tipp, und es klingelt bei Ihnen. Ohne Suchen, ohne Abschreiben.", {"type": "versus", "params": {"left": ["Nummer im Impressum", "Kunde sucht und geht"], "right": ["Knopf ganz oben", "Ein Tipp, es klingelt"]}}),
      ("Und wer abends schreibt, landet in einem *kurzen* Formular.", {"type": "clock", "params": {"from": 18, "to": 21.5, "label": "Feierabend"}}),
      ], C("Ihr Kunde will Sie anrufen und findet die Nummer nicht? 📞",
           "Die meisten Kunden suchen Handwerker und Betriebe am Handy. Dann gehört ganz oben auf Ihre Website ein Knopf „Jetzt anrufen“. Ein Tipp und es klingelt bei Ihnen. Für den Abend ein kurzes Anfrageformular, damit niemand verloren geht."),
      ["#handwerker", "#website", "#selbstständig", "#hannover", "#marketingtipps"], "🔖 Speichern und morgen auf Ihrer Seite prüfen.")

video("2026-10-25", 2, "Website-Test: bestehen Sie?", "Würde Ihre Website *bestehen*?", "Besteht Ihre Website den *Test*?",
      "Besteht Ihre Website den Test", "drive", [
      ("Würde Ihre Website diesen Test *bestehen*?", {"type": "h_scanner", "params": {"items": ["Lädt langsam", "Kein Anruf-Knopf", "Nicht fürs Handy"], "verdict": "DURCHGEFALLEN"}}),
      ("Sie muss sofort laden, am Handy funktionieren, bei Google auftauchen und zur *Anfrage* führen.", {"type": "checklist", "params": {"items": ["Lädt sofort", "Funktioniert am Handy", "Bei Google zu finden", "Führt zur Anfrage"], "title": "DER TEST"}}),
      ("Solche Websites baue ich, mit *4,8 Sternen* bei Google.", {"type": "stars", "params": {}}),
      ("Business mit Chatbot und Google Maps: 1990 Euro, oder 179 Euro im *Monat*.", {"type": "price", "params": {"paket": "business"}}),
      ], C("Würde Ihre Website diesen Test bestehen? 🔍",
           "Vier Fragen: Lädt sie sofort? Funktioniert sie am Handy? Taucht sie bei Google auf? Führt sie den Besucher zur Anfrage? Wenn einmal Nein dabei ist, verlieren Sie Kunden. Ich baue Websites, die alle vier erfüllen, für Betriebe in Goslar, Berlin und ganz Deutschland.",
           "Business-Paket mit bis zu 5 Seiten, KI-Chatbot und Google Maps: 1.990 € Festpreis oder 179 € im Monat (12 Monate Mindestlaufzeit)."),
      ["#webdesign", "#seo", "#kleinunternehmen", "#braunschweig", "#website"])

video("2026-10-25", 3, "Konkurrenz zieht Kunden ab", "Ihre Konkurrenz *klaut* Ihre Kunden", "Ihre Konkurrenz *klaut* Ihre Kunden",
      "Ihre Konkurrenz klaut Ihre Kunden", "phonk", [
      ("Ihre Konkurrenz zieht Ihnen jeden Tag *Kunden* ab.", {"type": "h_magnet", "params": {"left": "Ihr Betrieb", "right": "Konkurrenz"}}),
      ("Sie arbeitet nicht besser. Man findet sie nur *zuerst* bei Google.", {"type": "google_search", "params": {"query": "Dachdecker Braunschweig", "result": "Die Konkurrenz", "url": "konkurrenz.de", "badge": "Zuerst gesehen"}}),
      ("Mit einer klaren, schnellen Website drehen Sie das *um*.", {"type": "before_after", "params": {"headline": "Ihr Dachdecker in Braunschweig.", "sticker": "NEU"}}),
      ("Sichtbar bei der Suche und auf der *Karte*.", {"type": "map_pin", "params": {"title": "Ihr Betrieb", "place": "Braunschweig"}}),
      ("Genau das macht Mihajlo Systems.", {"type": "logo", "params": {"tagline": "Websites, die Kunden holen"}}),
      ], C("Ihre Konkurrenz zieht Ihnen jeden Tag Kunden ab. 🧲",
           "Oft arbeitet sie nicht besser als Sie. Man findet sie nur zuerst bei Google, weil ihre Website schneller, klarer und besser auffindbar ist. Mit einer modernen Website und einem gepflegten Google-Profil holen Sie diese Kunden zurück, egal ob Sie Dachdecker, Elektriker oder Friseur sind."),
      ["#handwerk", "#dachdecker", "#website", "#braunschweig", "#unternehmer"], SHARE)

# ---------------- Tag 3: Montag 26.10. ----------------
video("2026-10-26", 1, "Nicht sicher im Browser", "Steht bei Ihnen *Nicht sicher*?", "Steht bei Ihnen *Nicht sicher*?",
      "Steht bei Ihnen Nicht sicher", "drive", [
      ("Steht oben bei Ihrer Website *Nicht sicher*?", {"type": "h_lock", "params": {"warn": "Nicht sicher", "banner": "Diese Seite ist nicht sicher"}}),
      ("Dann wird jeder Kunde *misstrauisch* und schickt lieber nichts ab.", {"type": "cross_list", "params": {"items": ["Kunde zögert", "Formular bleibt leer", "Kunde geht"]}}),
      ("Die Lösung heißt SSL. Das *Schloss* im Browser.", {"type": "checklist", "params": {"items": ["SSL-Zertifikat", "Schloss im Browser", "Sicheres Formular"], "stamp": "Sicher"}}),
      ("Bei meiner Miete ist das mit Hosting und Wartung *inklusive*, ab 99 Euro im Monat.", {"type": "price", "params": {"paket": "landingpage", "only": "monat"}}),
      ], C("Steht oben in Ihrer Adresszeile „Nicht sicher“? 🔓",
           "Dann fehlt Ihrer Website ein SSL-Zertifikat. Kunden sehen die Warnung und schicken lieber keine Anfrage ab. Die Lösung ist schnell eingerichtet: SSL sorgt für das Schloss im Browser.",
           "Bei der Website-Miete ab 99 € im Monat (12 Monate Mindestlaufzeit) sind SSL, Hosting und Wartung inklusive."),
      ["#website", "#itsicherheit", "#selbstständig", "#berlin", "#webdesign"], "🔖 Speichern Sie sich das und prüfen Sie Ihre Seite.")

video("2026-10-26", 2, "KI-Chatbot nach Feierabend", "Sie haben zu. Ihr Kunde *nicht*.", "Sie haben zu. Ihr Kunde *nicht*.",
      "Sie haben zu, Ihr Kunde nicht", "house", [
      ("Sie haben Feierabend. Ihr Kunde hat *genau jetzt* eine Frage.", {"type": "h_closed", "params": {"sign": "GESCHLOSSEN", "sign_back": "ONLINE GEÖFFNET", "clock": "22:47"}}),
      ("Ein KI-Chatbot auf Ihrer Website antwortet *sofort*, auch um Mitternacht.", {"type": "chat", "params": {"clock": "23:47"}}),
      ("Und morgens liegen die *Anfragen* schon bereit.", {"type": "phone_notifs", "params": {"items": [["Neue Anfrage", "vom Website-Assistenten"], ["Terminwunsch", "über den Chat"], ["Rückruf erbeten", "über den Chat"]], "count": 5}}),
      ("Den Chatbot gibt es einzeln ab 200 Euro, *einmalig*.", {"type": "big_number", "params": {"value": 200, "prefix": "ab ", "suffix": " €", "label": "KI-Chatbot, einmalig"}}),
      ], C("Sie haben Feierabend. Ihr Kunde hat genau jetzt eine Frage. 🌙",
           "Ein KI-Chatbot auf Ihrer Website beantwortet Fragen zu Leistungen, Öffnungszeiten und Terminen sofort, auch nachts und am Wochenende. Morgens liegen die Anfragen bereit.",
           "KI-Chatbot einzeln ab 200 € einmalig. Im Business-Paket ist er schon dabei."),
      ["#ki", "#chatbot", "#kleinunternehmen", "#hannover", "#digitalisierung"])

video("2026-10-26", 3, "Alte Website als Zeitbombe", "Ihre Website ist eine *Zeitbombe*", "Ihre Website ist eine *Zeitbombe*",
      "Ihre Website ist eine Zeitbombe", "cinematic", [
      ("Ihre alte Website ist eine *Zeitbombe*.", {"type": "h_bomb", "params": {"label": "IHRE WEBSITE", "boom_text": "BOOM."}}),
      ("Jahre ohne Updates, alte Technik, und keiner kümmert sich *darum*.", {"type": "alarm", "params": {"title": "VERALTET", "sub": "Seit Jahren kein Update"}}),
      ("Irgendwann geht etwas *kaputt*, und Ihre Kunden sehen es zuerst.", {"type": "cross_list", "params": {"items": ["Sicherheitslücken", "Fehler am Handy", "Kunden springen ab"]}}),
      ("Bei Mihajlo Systems ist die *Wartung* dabei.", {"type": "logo", "params": {"tagline": "Ein Ansprechpartner für alles"}}),
      ("Updates, Hosting, SSL und ein fester Ansprechpartner, bei der Miete *inklusive*.", {"type": "checklist", "params": {"items": ["Updates", "Hosting", "SSL", "Ein Ansprechpartner"], "stamp": "Inklusive"}}),
      ], C("Ihre alte Website ist eine Zeitbombe. 💣",
           "Jahre ohne Updates, veraltete Technik und niemand, der sich kümmert. Irgendwann geht etwas kaputt und Ihre Kunden merken es vor Ihnen. Bei meiner Website-Miete sind Updates, Hosting, SSL und ein fester Ansprechpartner dabei.",
           "Miete ab 99 € im Monat, 12 Monate Mindestlaufzeit, danach monatlich kündbar."),
      ["#website", "#wordpress", "#handwerksbetrieb", "#deutschland", "#webdesign"], SHARE)

# ---------------- Tag 4: Dienstag 27.10. ----------------
video("2026-10-27", 1, "Kontaktformular zu lang", "Hier verlieren Sie *Anfragen*", "Hier verlieren Sie *Anfragen*",
      "Hier verlieren Sie Anfragen", "drive", [
      ("Genau hier verlieren Sie jeden Tag *Anfragen*.", {"type": "h_cash", "params": {"label": "Verlorene Anfragen"}}),
      ("Ein Kontaktformular mit zwölf Pflichtfeldern füllt kaum jemand *aus*.", {"type": "cross_list", "params": {"items": ["12 Pflichtfelder", "Rätsel-Captcha", "Knopf am Handy versteckt"]}}),
      ("Name, Telefon, Anliegen. *Drei* Felder reichen völlig.", {"type": "checklist", "params": {"items": ["Name", "Telefon", "Ihr Anliegen"], "title": "REICHT VÖLLIG"}}),
      ("Ein Klick, und die Anfrage ist bei *Ihnen*.", {"type": "cursor_click", "params": {"button": "Anfrage senden", "done": "Anfrage gesendet"}}),
      ], C("Genau hier verlieren Sie jeden Tag Anfragen. 💸",
           "Lange Kontaktformulare mit vielen Pflichtfeldern schrecken ab, vor allem am Handy. Für die erste Anfrage reichen Name, Telefon und Anliegen. Alles Weitere klären Sie im Gespräch."),
      ["#marketingtipps", "#website", "#selbstständig", "#goslar", "#kleinunternehmen"], "🔖 Speichern und Ihr Formular heute noch kürzen.")

video("2026-10-27", 2, "Versteckte Kosten platzen", "Versteckte Kosten? *Plopp.*", "Versteckte Kosten? *Plopp.*",
      "Versteckte Kosten bei Websites", "phonk", [
      ("Versteckte Kosten bei Ihrer Website? Die Blase *platzt* jetzt.", {"type": "h_balloon", "params": {"label": "VERSTECKTE KOSTEN", "pop_text": "PLOPP."}}),
      ("Bei mir gibt es Festpreise. Landingpage für 990 Euro, oder ab 99 Euro im *Monat*.", {"type": "price", "params": {"paket": "landingpage"}}),
      ("Ein Ansprechpartner, klare Preise, und Sie bekommen alle *Zugänge*.", {"type": "checklist", "params": {"items": ["Festpreis", "Ein Ansprechpartner", "Alle Zugänge für Sie"], "stamp": "Klar"}}),
      ("Und 4,8 Sterne bei Google sagen den *Rest*.", {"type": "stars", "params": {}}),
      ], C("Versteckte Kosten bei Ihrer Website? Hier platzt die Blase. 🎈",
           "Bei Mihajlo Systems stehen die Preise vorher fest. Ein Ansprechpartner von der ersten Idee bis online, und Sie bekommen alle Zugänge.",
           "Landingpage: 990 € Festpreis oder ab 99 € im Monat (12 Monate Mindestlaufzeit). Business: 1.990 € oder 179 € im Monat. Professional: 2.990 € oder 279 € im Monat."),
      ["#webdesign", "#selbstständig", "#handwerker", "#berlin", "#website"])

video("2026-10-27", 3, "Unsichtbar für Google", "Für Google *existieren* Sie nicht", "Für Google *existieren* Sie nicht",
      "Für Google existieren Sie nicht", "trap", [
      ("Für Google *existieren* Sie gerade nicht.", {"type": "h_sonar", "params": {"found": ["Betrieb A", "Betrieb B", "Betrieb C"], "you": "SIE", "miss_text": "NICHT GEFUNDEN"}}),
      ("Ohne Unternehmensprofil fehlen Sie auf der *Karte*.", {"type": "map_pin", "params": {"title": "Ihr Betrieb", "place": "Hannover", "cta": "Route"}}),
      ("Profil anlegen, echte Fotos, Öffnungszeiten, Website *verlinken*.", {"type": "checklist", "params": {"items": ["Profil anlegen", "Echte Fotos", "Öffnungszeiten", "Website verlinken"]}}),
      ("Dann tauchen Sie auf, wenn jemand in der *Nähe* sucht.", {"type": "google_search", "params": {"query": "Kfz Werkstatt Hannover", "result": "Werkstatt Schulz", "url": "werkstatt-schulz.de", "badge": "Gefunden"}}),
      ("Mihajlo Systems richtet das mit Ihnen *ein*.", {"type": "logo", "params": {"tagline": "Website und Google aus einer Hand"}}),
      ], C("Für Google existieren Sie gerade nicht? 📡",
           "Wer „Werkstatt in der Nähe“ oder „Elektriker Hannover“ sucht, sieht zuerst die Karte. Ohne gepflegtes Google-Unternehmensprofil fehlt Ihr Betrieb dort. Profil anlegen, echte Fotos, Öffnungszeiten und Ihre Website verlinken, dann werden Sie gefunden.",
           "Im Business-Paket richte ich Website und Google Maps mit Ihnen ein."),
      ["#googlemaps", "#seo", "#kfzwerkstatt", "#hannover", "#unternehmer"], SHARE)

# ---------------- Tag 5: Mittwoch 28.10. ----------------
video("2026-10-28", 1, "Ladezeit-Kettenreaktion", "So *verlieren* Sie einen Kunden", "So *verlieren* Sie einen Kunden",
      "So verlieren Sie einen Kunden", "house", [
      ("So verlieren Sie einen Kunden, Stein für *Stein*.", {"type": "h_domino", "params": {"labels": ["Website langsam", "Kunde wartet", "Kunde geht", "Anfrage weg", "Umsatz weg"]}}),
      ("Es fängt mit ein paar Sekunden *Ladezeit* an.", {"type": "statement", "params": {"big": "LÄDT …"}}),
      ("Testen Sie Ihre Seite kostenlos mit PageSpeed Insights von *Google*.", {"type": "speed", "params": {"score": 97, "label": "PageSpeed mobil, Beispiel"}}),
      ("Bilder verkleinern, wenige Plugins, schnelles *Hosting*.", {"type": "checklist", "params": {"items": ["Bilder verkleinern", "Wenige Plugins", "Schnelles Hosting"], "stamp": "Schneller"}}),
      ], C("So verlieren Sie einen Kunden, Stein für Stein. 🁢",
           "Es fängt mit ein paar Sekunden Ladezeit an. Der Kunde wartet, wird ungeduldig und klickt zurück zur Konkurrenz. Testen Sie Ihre Website kostenlos mit PageSpeed Insights von Google. Die häufigsten Bremsen: zu große Bilder, zu viele Plugins und langsames Hosting."),
      ["#website", "#seo", "#marketingtipps", "#deutschland", "#onlinemarketing"], "🔖 Speichern und heute Ihre Seite testen.")

video("2026-10-28", 2, "Kaputt am Handy", "Am Handy *kaputt*?", "Am Handy *kaputt*?",
      "Ihre Website ist am Handy kaputt", "drive", [
      ("Am Handy ist Ihre Website *kaputt*. Und keiner sagt es Ihnen.", {"type": "h_crack", "params": {"url": "ihre-firma.de"}}),
      ("Winzige Schrift, verrutschte Bilder. Daraus wird eine Seite, die *passt*.", {"type": "before_after", "params": {"headline": "Ihr Betrieb. Fürs Handy gebaut.", "sticker": "NEU"}}),
      ("Fürs Handy gebaut, denn dort sucht Ihr *Kunde*.", {"type": "phone_notifs", "params": {"count": 6}}),
      ("Business mit bis zu fünf Seiten: 1990 Euro, oder 179 Euro im *Monat*.", {"type": "price", "params": {"paket": "business"}}),
      ], C("Am Handy ist Ihre Website kaputt, und keiner sagt es Ihnen? 📱",
           "Winzige Schrift, verrutschte Bilder, Knöpfe, die man nicht trifft. Ihre Kunden suchen am Handy und gehen, bevor sie anrufen. Ich baue Websites zuerst fürs Handy, damit sie dort perfekt aussehen.",
           "Business mit bis zu 5 Seiten, KI-Chatbot und Google Maps: 1.990 € oder 179 € im Monat (12 Monate Mindestlaufzeit)."),
      ["#handwerk", "#website", "#kleinunternehmen", "#braunschweig", "#webdesign"])

video("2026-10-28", 3, "Fehler-Chaos", "So sieht Ihre Website für *Kunden* aus", "So sehen *Kunden* Ihre Website",
      "So sehen Kunden Ihre Website", "trap", [
      ("So sieht Ihre Website gerade für *Kunden* aus.", {"type": "h_error", "params": {"final": "Kunde hat die Seite verlassen"}}),
      ("Tote Links, fehlende Bilder, ein Formular, das nichts *sendet*.", {"type": "cross_list", "params": {"items": ["Bild fehlt", "Seite nicht gefunden", "Formular sendet nicht"]}}),
      ("Der Kunde geht, und Ihre Konkurrenz bekommt den *Auftrag*.", {"type": "versus", "params": {"left": ["Ihr Kunde", "sieht Fehler und geht"], "right": ["Die Konkurrenz", "bekommt den Auftrag"]}}),
      ("Mihajlo Systems baut Ihnen eine Seite, die *funktioniert*.", {"type": "logo", "params": {"tagline": "Websites, die laufen"}}),
      ("Getestet, gepflegt, mit einem festen *Ansprechpartner*.", {"type": "checklist", "params": {"items": ["Getestet", "Gepflegt", "Ein Ansprechpartner"], "stamp": "Läuft"}}),
      ], C("So sieht Ihre Website gerade für Kunden aus. ⚠️",
           "Tote Links, fehlende Bilder, ein Formular, das nichts sendet: Viele Betriebe merken es erst, wenn keine Anfragen mehr kommen. Ich baue und pflege Websites, die laufen, mit einem festen Ansprechpartner statt Warteschleife."),
      ["#website", "#unternehmer", "#selbstständig", "#berlin", "#webdesign"], SHARE)

# ---------------- Tag 6: Donnerstag 29.10. ----------------
video("2026-10-29", 1, "Mehr Google-Bewertungen", "Mehr *Google-Bewertungen*?", "Mehr *Bewertungen* bekommen",
      "Mehr Google Bewertungen bekommen", "cinematic", [
      ("Sie wollen mehr *Google-Bewertungen*? Dann fragen Sie richtig.", {"type": "h_typewriter", "params": {"text": "Mehr Bewertungen?"}}),
      ("Fragen Sie direkt nach dem Auftrag, solange der Kunde *zufrieden* ist.", {"type": "checklist", "params": {"items": ["Direkt nach dem Auftrag", "Link per WhatsApp", "QR-Code auf der Rechnung"]}}),
      ("Schicken Sie den Link gleich mit, per WhatsApp oder *QR-Code*.", {"type": "versus", "params": {"left": ["Später fragen", "Kunde vergisst es"], "right": ["Sofort fragen", "Link direkt dabei"]}}),
      ("Echte Bewertungen sind das stärkste *Vertrauen*, das Sie haben.", {"type": "stars", "params": {"no_quote": True}}),
      ], C("Sie wollen mehr Google-Bewertungen? ⭐",
           "Der beste Moment ist direkt nach dem Auftrag, solange der Kunde zufrieden ist. Schicken Sie ihm den Bewertungslink gleich per WhatsApp oder drucken Sie einen QR-Code auf die Rechnung. Echte Bewertungen bringen Vertrauen bei Google und bei neuen Kunden."),
      ["#googlebewertungen", "#handwerker", "#marketingtipps", "#harz", "#selbstständig"], "🔖 Speichern für Ihren nächsten Auftrag.")

video("2026-10-29", 2, "Ablauf in vier Schritten", "Ihre neue Website in *4 Schritten*", "In *4 Schritten* online",
      "In vier Schritten online", "house", [
      ("So startet Ihre neue Website, in *vier* Schritten.", {"type": "h_rocket", "params": {"label": "START"}}),
      ("Kostenloses Erstgespräch, Entwurf, Ihr Feedback, und dann geht sie *online*.", {"type": "checklist", "params": {"items": ["Kostenloses Erstgespräch", "Entwurf", "Ihr Feedback", "Online"], "title": "DER ABLAUF"}}),
      ("Sie kümmern sich um Ihren Betrieb, ich mich um die *Technik*.", {"type": "cursor_click", "params": {"button": "Website live schalten", "done": "Online"}}),
      ("Ab 99 Euro im Monat, oder einmalig *990 Euro*.", {"type": "price", "params": {"paket": "landingpage"}}),
      ], C("Ihre neue Website in 4 Schritten. 🚀",
           "1. Kostenloses Erstgespräch 2. Entwurf 3. Ihr Feedback 4. Online. Sie kümmern sich um Ihren Betrieb, ich mich um Technik, Hosting und Google. Ein Ansprechpartner von Anfang bis Ende.",
           "Landingpage ab 99 € im Monat (12 Monate Mindestlaufzeit) oder einmalig 990 € Festpreis."),
      ["#webdesign", "#website", "#selbstständig", "#hannover", "#kleinunternehmen"])

video("2026-10-29", 3, "Mythos: Instagram reicht", "„Instagram reicht“? *Weg damit.*", "„Instagram reicht“? *Nein.*",
      "Instagram reicht nicht", "phonk", [
      ("Ich habe doch Instagram, ich brauche keine Website. Ab in den *Müll* mit dem Satz.", {"type": "h_trash", "params": {"label": "Instagram reicht"}}),
      ("Wer einen Friseur sucht, googelt *zuerst*. Und da zählt Ihre Website.", {"type": "google_search", "params": {"query": "Friseur Hannover", "result": "Salon Lena", "url": "salon-lena.de", "badge": "Gefunden"}}),
      ("Instagram zeigt, was Sie können. Die Website bringt die *Anfrage*.", {"type": "versus", "params": {"left": ["Nur Instagram", "Kunde muss Sie erst finden"], "right": ["Mit Website", "Kunde findet Sie bei Google"]}}),
      ("Termine, Preise, Kontakt, alles an *einem* Ort.", {"type": "phone_notifs", "params": {"items": [["Terminanfrage", "über Ihre Website"], ["Neue Anfrage", "über Google gefunden"], ["Anruf", "über Ihre Website"]], "count": 6}}),
      ], C("„Ich habe doch Instagram, ich brauche keine Website.“ Wirklich? 🗑️",
           "Instagram zeigt Ihre Arbeit. Aber wer einen Friseur, Handwerker oder ein Restaurant sucht, googelt zuerst. Dort zählen Ihre Website und Ihr Google-Profil. Am besten arbeiten beide zusammen: Instagram für die Bilder, die Website für Termine, Preise und Anfragen."),
      ["#instagramtipps", "#friseur", "#website", "#hannover", "#selbstständig"], SHARE)

# ---------------- Tag 7: Freitag 30.10. ----------------
video("2026-10-30", 1, "Echte Fotos statt Stockbilder", "Ihre Website im *Dunkeln*?", "Licht an für Ihre *Website*",
      "Licht an für Ihre Website", "drive", [
      ("Ihre Website steht im *Dunkeln*. Machen wir das Licht an.", {"type": "h_lightswitch", "params": {"label": "IHRE WEBSITE"}}),
      ("Stockfotos von lachenden Models kennt jeder *Kunde*.", {"type": "cross_list", "params": {"items": ["Stockfoto", "Fremde Gesichter", "Kein Vertrauen"]}}),
      ("Zeigen Sie *echte* Fotos: Ihr Team, Ihre Werkstatt, Ihre Arbeit.", {"type": "checklist", "params": {"items": ["Ihr Team", "Ihre Werkstatt", "Vorher und Nachher"], "stamp": "Echt"}}),
      ("Das Handy reicht dafür völlig, Hauptsache *echt*.", {"type": "before_after", "params": {"headline": "Ihr Team. Ihre Arbeit.", "sticker": "ECHT"}}),
      ], C("Licht an für Ihre Website: echte Fotos statt Stockbilder. 💡",
           "Kunden erkennen Stockfotos sofort. Echte Fotos von Ihrem Team, Ihrer Werkstatt und Ihren Arbeiten schaffen Vertrauen, auf der Website und im Google-Profil. Das Handy reicht dafür völlig."),
      ["#fotografie", "#handwerk", "#marketingtipps", "#goslar", "#website"], "🔖 Speichern und diese Woche Fotos machen.")

video("2026-10-30", 2, "Bestellsystem für Restaurants", "Der *Geheimtipp* für Restaurants", "Bestellen *ohne* Provision",
      "Bestellen ohne Provision", "phonk", [
      ("Der Geheimtipp für Restaurants: Bestellungen ohne *Provision*.", {"type": "h_vault", "params": {"label": "GEHEIMTIPP"}}),
      ("Ihre Gäste bestellen direkt über Ihre eigene Seite, per QR-Code am *Tisch*.", {"type": "phone_notifs", "params": {"items": [["Neue Bestellung", "Tisch 4"], ["Neue Bestellung", "Abholung 18:30"], ["Neue Bestellung", "Tisch 7"]], "count": 6}}),
      ("Website, iPad und Tischaufsteller sind *dabei*.", {"type": "checklist", "params": {"items": ["Eigene Website", "iPad 11 Zoll", "Tischaufsteller mit QR", "Keine Provision"], "stamp": "Komplett"}}),
      ("499 Euro Einrichtung, dann 149 Euro im *Monat*.", {"type": "big_number", "params": {"value": 149, "suffix": " €", "label": "im Monat, plus 499 € Einrichtung"}}),
      ], C("Der Geheimtipp für Restaurants: Bestellungen ohne Provision. 🍕",
           "Mit dem Bestellsystem von Mihajlo Systems bestellen Ihre Gäste direkt über Ihre eigene Seite, am Tisch per QR-Code oder zum Abholen. Ohne Provision an Lieferportale. Website, iPad 11 Zoll und Tischaufsteller sind dabei.",
           "499 € Einrichtung, dann 149 € im Monat, 24 Monate Laufzeit. Auch für Friseure mit Terminbuchung."),
      ["#gastronomie", "#restaurant", "#digitalisierung", "#berlin", "#selbstständig"])

video("2026-10-30", 3, "Was die alte Website kostet", "Was kostet Sie Ihre *alte* Website?", "Was kostet Ihre *alte* Website?",
      "Was kostet Ihre alte Website", "trap", [
      ("Was kostet Sie Ihre alte Website *wirklich*?", {"type": "h_receipt", "params": {"items": ["Verpasste Anrufe", "Kunden bei der Konkurrenz", "Schlechter erster Eindruck"], "total": "Zu viel"}}),
      ("Jeder Kunde, der *nicht* anruft, ist ein Auftrag weniger.", {"type": "cross_list", "params": {"items": ["Kein Anruf", "Kein Auftrag", "Kein Umsatz"]}}),
      ("Dagegen steht eine Website ab 99 Euro im *Monat*.", {"type": "price", "params": {"paket": "landingpage", "only": "monat"}}),
      ("Die rechnet sich oft schon mit *einem* neuen Kunden.", {"type": "bars", "params": {"labels": ["Monat 1", "Monat 2", "Monat 3", "Monat 4", "Monat 5"], "title": "Anfragen über die Website"}}),
      ("Rechnen Sie es mit Mihajlo Systems *durch*.", {"type": "logo", "params": {"tagline": "Websites, die sich rechnen"}}),
      ], C("Was kostet Sie Ihre alte Website wirklich? 🧾",
           "Nicht die Rechnung fürs Hosting, sondern die Kunden, die nie anrufen: weil die Seite langsam ist, am Handy nicht funktioniert oder bei Google nicht auftaucht. Eine neue Website rechnet sich oft schon mit einem einzigen neuen Auftrag.",
           "Landingpage ab 99 € im Monat (12 Monate Mindestlaufzeit) oder einmalig 990 €."),
      ["#unternehmer", "#website", "#handwerker", "#deutschland", "#webdesign"], SHARE)

if __name__ == "__main__":
    only = set(sys.argv[1:])
    for v in V:
        if only and v["id"] not in only: continue
        d = os.path.join(ROOT, "work", v["id"]); os.makedirs(d, exist_ok=True)
        json.dump(v, open(os.path.join(d, "job.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(V), "Videos geplant")
