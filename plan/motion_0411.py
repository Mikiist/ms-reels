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

# ---------- Mi 04.11. 13:30: Gefunden werden (Google und Google Maps) ----------
video("2026-11-04-2", "Motion: Kunden suchen Sie, Website und Google Maps", "motion", "house",
      "Finden sie *Sie*?", "Finden sie *Sie*?", "Jeden Tag suchen Kunden nach Ihnen", [
      ("Jeden Tag suchen *Kunden* nach Ihnen. Die Frage ist nur: Finden sie Sie?",
       {"type": "h_vault", "params": {"label": "Kunden", "sub": "Finden sie Sie?"}}),
      ("Elektriker Hannover. Elektro Meyer. Elektro Krause. Und Ihr Betrieb, mit *Website* und Karte.",
       {"type": "m_phone", "params": {"screen": "search", "query": "Elektriker Hannover", "rise": False,
        "items": [["Elektro Meyer", ""], ["Elektro Krause", ""], ["Ihr Betrieb", "Mit Website und Karte"]]}}),
      ("Mit Öffnungszeiten, Fotos und einem Knopf zum *Anrufen*.",
       {"type": "m_cards", "params": {"items": ["Öffnungszeiten", "Fotos", "Knopf zum Anrufen"]}}),
      ("So werden Sie gefunden. Bei Google und *Google Maps*.",
       {"type": "m_word", "params": {"text": "Gefunden", "sub": "Bei Google und Google Maps"}}),
      ("Mihajlo Systems. Business-Paket, 179 Euro im Monat. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_card", "params": {"keyword": "WEBSITE", "line": "Business-Paket, 179 € im Monat"}, "tr": "cut"}),
      ],
      ["Jeden Tag suchen Kunden nach Ihnen. Die Frage ist nur: Finden sie Sie auch? 🔎",
       "Wer heute einen Elektriker, Maler oder Friseur braucht, sucht bei Google und auf Google Maps. Dort entscheidet sich in Sekunden, wen er anruft: den Betrieb mit Website, Öffnungszeiten, Fotos und einem Knopf zum Anrufen, oder den, über den er nichts findet.",
       "Eine Website, die Google versteht, und ein gepflegter Eintrag bei Google Maps sorgen dafür, dass Kunden Sie finden, auch abends und am Wochenende, wenn Sie selbst keine Zeit haben.",
       "Im Business-Paket stecken bis zu 5 Seiten, KI-Chatbot Basis, SEO und Google Maps: 1.990 € einmalig oder 179 € im Monat (12 Monate Mindestlaufzeit)."],
      "Kennen Sie einen Handwerker, den man bei Google nicht findet? Schicken Sie ihm das Video. 📩",
      ["#seo", "#handwerk", "#hannover", "#googlemaps", "#website"],
      "Suchen Sie mal Ihre Branche plus Stadt bei Google. Wo stehen Sie? 🔎")

# ---------- Mi 04.11. 19:30: KI-Chatbot (Rückruf-Zettel) ----------
video("2026-11-04-3", "Motion: Wir rufen Sie morgen zurück, KI-Chatbot", "motion", "cinematic",
      "Wir rufen Sie *morgen* zurück", "Dieser Satz *kostet* Kunden", "Wir rufen Sie morgen zurück", [
      ("Wir rufen Sie morgen zurück. Dieser Satz kostet Sie *Kunden*.",
       {"type": "h_trash", "params": {"label": "Wir rufen Sie morgen zurück"}}),
      ("Ein Kunde fragt spät abends: Haben Sie morgen offen? Die Antwort kommt sofort: Ja, ab neun Uhr.",
       {"type": "m_phone", "params": {"screen": "chat", "items": [["kunde", "Haben Sie morgen offen?"], ["bot", "Ja, ab 9 Uhr."]], "side": -1}}),
      ("Ihr KI-Chatbot antwortet rund um die *Uhr*.",
       {"type": "m_word", "params": {"text": "Rund um die Uhr", "pre": "Ihr KI-Chatbot antwortet"}}),
      ("Auch nachts. Auch am Wochenende. Einmalig ab 200 *Euro*.",
       {"type": "m_cards", "params": {"items": ["Auch nachts", "Auch am Wochenende", "Einmalig ab 200 €"]}}),
      ("Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_word", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Wir rufen Sie morgen zurück. Genau dieser Satz kostet viele Betriebe Kunden. 📞",
       "Viele Fragen kommen abends und nachts: Haben Sie morgen offen? Was kostet das? Haben Sie Samstag Zeit? Wer bis morgen auf eine Antwort warten muss, fragt längst woanders. Ein KI-Chatbot auf Ihrer Website antwortet sofort, auch wenn Sie schlafen.",
       "Der Chatbot beantwortet die immer gleichen Fragen zu Öffnungszeiten, Leistungen und Ablauf. Sie bekommen morgens die Anfragen, die wirklich zählen, und verlieren keinen Kunden mehr an die Nacht.",
       "Den KI-Chatbot gibt es einzeln für 200, 350 oder 500 € einmalig. Im Business-Paket ist die Basis schon dabei."],
      "Kennen Sie jemanden, der abends nie ans Telefon kommt? Schicken Sie ihm das Video. 📩",
      ["#kichatbot", "#selbstständig", "#braunschweig", "#kleinunternehmen", "#website"],
      "Wie viele Anfragen kommen bei Ihnen nach Feierabend? 🌙")

# ---------- Do 05.11. 07:30: Terminbuchung ----------
video("2026-11-05-1", "Motion: Verpasster Anruf, Online-Terminbuchung", "motion", "phonk",
      "Verpasster *Anruf*", "Verpasster Anruf", "Ihr Handy klingelt umsonst", [
      ("Ein möglicher Kunde ruft an. Sie haben die Hände voll. Verpasster *Anruf*.",
       {"type": "h_ring", "params": {"caller": "Möglicher Kunde", "missed": 3}}),
      ("Mit Online-Terminbuchung bucht er selbst. Termine: Dienstag um 10 Uhr, Mittwoch um 14 *Uhr*.",
       {"type": "m_phone", "params": {"screen": "orders", "title": "Termine", "items": [["Dienstag", "10 Uhr"], ["Mittwoch", "14 Uhr"]]}}),
      ("Auch *nachts* und am Wochenende.",
       {"type": "m_word", "params": {"text": "Auch nachts"}}),
      ("Mihajlo Systems. Kostenloses Erstgespräch. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_card", "params": {"keyword": "WEBSITE", "line": "Kostenloses Erstgespräch"}, "tr": "cut"}),
      ],
      ["Ein Kunde ruft an und Sie haben gerade die Hände voll. Verpasster Anruf. Ruft er noch einmal an? 📞",
       "Ob Friseur, Praxis oder Handwerk: Viele Anrufe kommen genau dann, wenn Sie arbeiten. Mit einer Online-Terminbuchung auf Ihrer Website sucht sich der Kunde selbst einen freien Termin aus, auch abends und am Wochenende. Sie sehen morgens nur noch, wer wann kommt.",
       "Das spart Ihnen Telefonate zwischendurch, und kein Kunde landet mehr in der Mailbox. Gerade bei Google sucht man oft spät abends nach einem Termin, und wer dann direkt buchen kann, bleibt.",
       "Die Terminbuchung baue ich direkt in Ihre Website ein, passend zu Ihren Zeiten und Leistungen. Was es für Ihren Betrieb kostet, klären wir im kostenlosen Erstgespräch."],
      "Kennen Sie jemanden, der beim Arbeiten nie ans Telefon kommt? Schicken Sie ihm das Video. 📩",
      ["#terminbuchung", "#friseur", "#hannover", "#selbstständig", "#website"],
      "Wie viele Anrufe verpassen Sie an einem normalen Tag? ☎️")

# ---------- Do 05.11. 13:30: Gutscheinshop ----------
video("2026-11-05-2", "Motion: Laden zu, Gutscheinshop online geöffnet", "motion", "trap",
      "Der Laden ist *online geöffnet*", "Um Mitternacht geöffnet", "Geschlossen und trotzdem offen", [
      ("Zweiundzwanzig Uhr siebenundvierzig. Geschlossen. Das Geschenk fehlt noch. Doch der Laden ist *online geöffnet*.",
       {"type": "h_closed", "params": {"sign": "GESCHLOSSEN", "sign_back": "ONLINE GEÖFFNET", "clock": "22:47"}}),
      ("Gutschein aussuchen. Online bezahlen. *Verschenken*.",
       {"type": "m_cards", "params": {"items": ["Gutschein aussuchen", "Online bezahlen", "Verschenken"]}}),
      ("Ihr *Gutscheinshop* verkauft rund um die Uhr, auch an Feiertagen.",
       {"type": "m_word", "params": {"text": "Gutscheinshop", "pre": "Ihr", "sub": "Verkauft rund um die Uhr"}}),
      ("Der Gutscheinshop von Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_comment", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Ihr Laden hat geschlossen, und genau jetzt sucht jemand noch ein Geschenk. Was passiert? 🎁",
       "Viele Geschenke werden spät abends gekauft, wenn alle Läden zu sind. Mit einem Online-Gutscheinshop auf Ihrer Website kauft der Kunde Ihren Gutschein trotzdem: aussuchen, online bezahlen, verschenken. Ob Restaurant, Friseur, Kosmetik oder Café.",
       "Der Gutschein bringt den Beschenkten später zu Ihnen in den Laden. Sie verkaufen also auch dann, wenn das Licht aus ist, und neue Kunden lernen Sie über ein Geschenk kennen.",
       "Den Gutscheinshop richte ich direkt auf Ihrer Website ein, passend zu Ihrem Betrieb. Was das für Sie kostet, klären wir im kostenlosen Erstgespräch."],
      "Kennen Sie einen Laden, der abends Geschenke verkaufen könnte? Schicken Sie ihm das Video. 📩",
      ["#gutscheinshop", "#einzelhandel", "#braunschweig", "#kleinunternehmen", "#website"],
      "Haben Sie schon einmal einen Gutschein um Mitternacht gekauft? 🌙")

# ---------- Do 05.11. 19:30: Festpreis ----------
video("2026-11-05-3", "Motion: Website-Preis als Glücksspiel, Landingpage Festpreis", "motion", "drive",
      "Was kostet eine *Website*?", "Kein Glücksspiel", "Der Website-Jackpot", [
      ("Was kostet eine *Website*? Bei vielen ist das ein Glücksspiel. Hier gibt es den Jackpot: *Festpreis*.",
       {"type": "h_slot", "params": {"symbols": ["euro", "euro", "euro"], "jackpot": "Festpreis"}}),
      ("Eine Landingpage für Ihren Betrieb. 990 Euro. Der Preis steht vorher *fest*, ohne Überraschung.",
       {"type": "m_cards", "params": {"items": ["Landingpage", "990 €", "Preis steht vorher fest"]}}),
      ("Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_word", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Was kostet eigentlich eine Website? Bei vielen Angeboten weiß man das erst am Ende. 🎰",
       "Stundensätze, Zusatzkosten, Nachträge: Für viele Selbstständige fühlt sich ein Website-Angebot wie ein Glücksspiel an. Bei mir steht der Preis vorher fest. Eine Landingpage, also eine starke einzelne Seite für Ihren Betrieb, kostet 990 € als Festpreis.",
       "Ein fester Preis heißt: Sie können planen, und es kommen keine Überraschungen. Wer lieber monatlich zahlt, mietet die Landingpage ab 99 € im Monat, 12 Monate Mindestlaufzeit, danach monatlich kündbar.",
       "Landingpage 990 € Festpreis oder ab 99 € im Monat. Über 12 Monate sparen Sie mit dem Festpreis 198 €."],
      "Kennen Sie jemanden, der eine Website braucht und Angst vor dem Preis hat? Schicken Sie ihm das Video. 📩",
      ["#landingpage", "#webdesign", "#berlin", "#selbstständig", "#website"],
      "Festpreis oder lieber monatlich? Was ist Ihnen lieber? 💶")

# ---------- Do 12.11. 07:30: Website gegen die Konkurrenz (Stimme ab hier über Higgsfield) ----------
video("2026-11-12-1", "Motion: Konkurrenz zieht Kunden ab, Business-Paket", "motion", "house",
      "Die Konkurrenz zieht Ihre *Kunden* ab", "Der Kunden-Magnet", "Wer zieht Ihre Kunden ab?", [
      ("Ihr Betrieb. Die Konkurrenz. Und die Konkurrenz zieht Ihre *Kunden* ab.",
       {"type": "h_magnet", "params": {"left": "Ihr Betrieb", "right": "Konkurrenz", "n": 8}}),
      ("Was ist der Magnet? Eine bessere *Website*.",
       {"type": "m_word", "params": {"text": "Der Magnet", "pre": "Was ist", "sub": "Eine bessere Website"}}),
      ("Bis 5 Seiten. KI-Chatbot. Bei Google Maps *sichtbar*.",
       {"type": "m_cards", "params": {"items": ["Bis 5 Seiten", "KI-Chatbot", "Google Maps"]}}),
      ("Das Business-Paket von Mihajlo Systems. 1.990 Euro Festpreis. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_card", "params": {"keyword": "WEBSITE", "line": "Business-Paket, 1.990 € Festpreis"}, "tr": "cut"}),
      ],
      ["Zwei Betriebe, gleiche Arbeit, gleicher Ort. Warum landen die Kunden beim anderen? 🧲",
       "Meist liegt es an der Website. Wer bei Google nach einem Handwerker, Friseur oder einer Praxis sucht, vergleicht in Sekunden. Die Seite, die schneller lädt, klarer zeigt, was es gibt, und Fragen sofort beantwortet, bekommt den Anruf. Der andere Betrieb merkt davon nichts.",
       "Eine gute Website wirkt wie ein Magnet: Sie zeigt Leistungen, Fotos und Öffnungszeiten, ist bei Google Maps sichtbar und beantwortet mit dem KI-Chatbot die ersten Fragen, auch abends.",
       "Das Business-Paket: bis 5 Seiten, KI-Chatbot Basis, SEO und Google Maps für 1.990 € Festpreis oder 179 € im Monat, 12 Monate Mindestlaufzeit, danach monatlich kündbar."],
      "Kennen Sie einen Betrieb, der mehr Kunden verdient hätte? Schicken Sie ihm das Video. 📩",
      ["#webdesign", "#handwerk", "#hannover", "#kleinunternehmen", "#website"],
      "Haben Sie Ihre Website schon einmal mit der Konkurrenz verglichen? 👀", tempo=1.25)

# ---------- Do 12.11. 13:30: Bestellen am Tisch ----------
video("2026-11-12-2", "Motion: Gast wartet, Bestellen am Tisch per QR und NFC", "motion", "trap",
      "Der Gast *wartet*", "Der Gast wartet", "Bis der Gast geht", [
      ("Der Gast wartet. Der Kellner rennt. Die Bestellung ist falsch. Der Gast *geht*.",
       {"type": "h_domino", "params": {"labels": ["Gast wartet", "Kellner rennt", "Bestellung falsch", "Gast geht"]}}),
      ("Die Lösung: am Tisch *bestellen*. Direkt am eigenen Handy.",
       {"type": "m_word", "params": {"text": "Am Tisch bestellen", "pre": "Die Lösung", "sub": "Direkt am eigenen Handy"}}),
      ("Tisch 4. Tisch 7. Alles landet am Terminal, sofort in der *Küche*.",
       {"type": "m_ipad", "params": {"title": "Terminal", "items": [["Tisch 4", ""], ["Tisch 7", ""]], "stamp": "Sofort in der Küche"}}),
      ("QR-Code am Tisch. NFC-Sticker. Keine *Provision*.",
       {"type": "m_cards", "params": {"items": ["QR-Code am Tisch", "NFC-Sticker", "Keine Provision"]}}),
      ("Das Bestellsystem von Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_comment", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Der Gast wartet, der Kellner rennt, die Bestellung ist falsch. Und am Ende geht der Gast. 🍽️",
       "An vollen Abenden passiert genau das in vielen Restaurants. Mit einem Bestellsystem am Tisch bestellen Ihre Gäste direkt am eigenen Handy: QR-Code scannen oder das Handy an den NFC-Sticker halten, auswählen, abschicken. Das Bestellterminal am iPad zeigt sofort, welcher Tisch was bestellt hat.",
       "Ihr Team läuft weniger und hat mehr Zeit für die Gäste. Bestellungen kommen so an, wie der Gast sie getippt hat, und niemand wartet auf die Karte.",
       "Das Bestellsystem gehört zu Ihrem Restaurant, ohne Provision an ein Portal. Dazu gibt es auf Wunsch Bonuspunkte in Apple Wallet und Google Wallet. Was es für Ihren Betrieb kostet, klären wir im kostenlosen Erstgespräch."],
      "Kennen Sie ein Restaurant, in dem man zu lange wartet? Schicken Sie ihm das Video. 📩",
      ["#bestellsystem", "#gastronomie", "#berlin", "#restaurant", "#website"],
      "Würden Sie im Restaurant am Handy bestellen? 📱", tempo=1.25)

# ---------- Do 12.11. 19:30: Hosting und Wartung in der Miete ----------
video("2026-11-12-3", "Motion: Puls der Website, Hosting und Wartung in der Miete", "motion", "cinematic",
      "Der Puls Ihrer *Website*", "Kein Signal", "Der Puls Ihrer Website", [
      ("Das ist der Puls Ihrer *Website*. Er wird schwächer. Und dann: kein Signal.",
       {"type": "h_ekg", "params": {"label": "PULS IHRER WEBSITE", "flat_text": "KEIN SIGNAL"}}),
      ("In der Miete ist alles dabei: Hosting, Wartung, *Updates*.",
       {"type": "m_cards", "params": {"items": ["Hosting", "Wartung", "Updates"]}}),
      ("Ihre Landingpage bleibt online, ab 99 Euro im *Monat*.",
       {"type": "m_word", "params": {"text": "Ab 99 Euro", "pre": "Ihre Landingpage", "sub": "Im Monat"}}),
      ("Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_word", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Wann hat sich zuletzt jemand um Ihre Website gekümmert? 💓",
       "Viele Websites werden einmal gebaut und dann vergessen. Updates fehlen, das Zertifikat läuft ab, die Seite lädt langsam oder fällt ganz aus. Ihre Kunden sehen das sofort, Sie oft erst nach Wochen. Für Google und für Ihre Kunden zählt eine Website, die zuverlässig erreichbar ist.",
       "Bei der Miete kümmere ich mich darum: Hosting, SSL, Wartung und Updates sind inklusive. Sie haben einen Ansprechpartner und müssen sich um die Technik nicht kümmern.",
       "Die Landingpage gibt es ab 99 € im Monat, 12 Monate Mindestlaufzeit, danach monatlich kündbar. Oder als Festpreis für 990 €."],
      "Kennen Sie jemanden mit einer vergessenen Website? Schicken Sie ihm das Video. 📩",
      ["#website", "#webdesign", "#braunschweig", "#selbstständig", "#landingpage"],
      "Wissen Sie, ob Ihre Website gerade erreichbar ist? 🔍", tempo=1.25)

# ---------- Fr 13.11. 07:30: Google, nicht gefunden ----------
video("2026-11-13-1", "Motion: Radar findet alle außer Ihnen, SEO und Google Maps", "motion", "phonk",
      "Nur Sie: *nicht gefunden*", "Nicht gefunden", "Der Radar findet Sie nicht", [
      ("Der Radar findet Elektro Meyer. Elektro Krause. Elektro Schulz. Nur Sie: *nicht gefunden*.",
       {"type": "h_sonar", "params": {"found": ["Elektro Meyer", "Elektro Krause", "Elektro Schulz"], "you": "SIE", "miss_text": "NICHT GEFUNDEN"}}),
      ("Ihre Kunden suchen bei Google. Und dort zählt: gefunden *werden*.",
       {"type": "m_word", "params": {"text": "Gefunden werden", "pre": "Und dort zählt"}}),
      ("SEO. Google Maps. Eine schnelle *Website*.",
       {"type": "m_cards", "params": {"items": ["SEO", "Google Maps", "Schnelle Website"]}}),
      ("Alles im Business-Paket von Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_comment", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Ihre Konkurrenz taucht bei Google auf. Und Sie? 📡",
       "Wer einen Elektriker, Friseur oder eine Praxis sucht, tippt bei Google ein und ruft einen der ersten Treffer an. Wer dort nicht auftaucht, existiert für diese Kunden nicht. Das hat selten mit der Qualität der Arbeit zu tun, fast immer mit der Website und dem Google-Profil.",
       "SEO heißt: Ihre Seite sagt Google klar, was Sie anbieten und wo. Dazu ein gepflegter Eintrag bei Google Maps und eine Website, die schnell lädt. So finden Kunden aus Ihrer Stadt Sie, wenn sie suchen.",
       "Das Business-Paket: bis 5 Seiten, KI-Chatbot Basis, SEO und Google Maps für 1.990 € Festpreis oder 179 € im Monat, 12 Monate Mindestlaufzeit, danach monatlich kündbar."],
      "Kennen Sie einen Betrieb, den man bei Google nicht findet? Schicken Sie ihm das Video. 📩",
      ["#seo", "#googlemaps", "#hannover", "#handwerk", "#website"],
      "Haben Sie sich selbst schon mal bei Google gesucht? 🔎", tempo=1.25)

# ---------- Fr 13.11. 13:30: Verlorene Anfragen, Chatbot ----------
video("2026-11-13-2", "Motion: Verlorene Anfragen am Abend, KI-Chatbot", "motion", "drive",
      "Keiner antwortet. Verlorene *Anfragen*", "Verlorene Anfragen", "Jeden Abend verlorene Anfragen", [
      ("Jeden Abend kommen Fragen. Keiner antwortet. Verlorene *Anfragen*.",
       {"type": "h_cash", "params": {"label": "Verlorene Anfragen"}}),
      ("Ein Kunde fragt: Haben Sie Samstag geöffnet? Der Chatbot antwortet sofort: Ja, von 9 bis 14 *Uhr*.",
       {"type": "m_phone", "params": {"screen": "chat", "items": [["kunde", "Haben Sie Samstag geöffnet?"], ["bot", "Ja, von 9 bis 14 Uhr."]], "side": -1}}),
      ("Rund um die Uhr. Auf Ihrer Website. Ab 200 Euro *einmalig*.",
       {"type": "m_cards", "params": {"items": ["Rund um die Uhr", "Auf Ihrer Website", "Ab 200 € einmalig"]}}),
      ("Der KI-Chatbot von Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_card", "params": {"keyword": "WEBSITE", "line": "KI-Chatbot"}, "tr": "cut"}),
      ],
      ["Abends kommen die meisten Fragen. Und niemand antwortet. 💸",
       "Öffnungszeiten, Preise, freie Termine: Viele Kunden schreiben dann, wenn Ihr Betrieb längst zu hat. Bekommen sie keine Antwort, fragen sie beim nächsten Anbieter. Jede dieser Fragen war ein möglicher Auftrag, und meist merkt man es nicht einmal, weil die Nachricht nie beantwortet wurde.",
       "Ein KI-Chatbot auf Ihrer Website beantwortet die immer gleichen Fragen sofort, auch nachts und am Wochenende. Sie bekommen morgens die Anfragen, die wirklich zählen.",
       "Den KI-Chatbot gibt es einzeln für 200, 350 oder 500 € einmalig. Im Business-Paket ist die Basis schon dabei."],
      "Kennen Sie jemanden, der abends keine Zeit für Nachrichten hat? Schicken Sie ihm das Video. 📩",
      ["#kichatbot", "#kleinunternehmen", "#braunschweig", "#selbstständig", "#website"],
      "Wie viele Nachrichten bekommen Sie nach Feierabend? 🌙", tempo=1.25)

# ---------- Fr 13.11. 19:30: Website-Test durchgefallen ----------
video("2026-11-13-3", "Motion: Website im Test durchgefallen, neue Landingpage", "motion", "house",
      "Ihre Website im *Test*", "Durchgefallen", "Ihre Website im Test", [
      ("Ihre Website im Test. Lädt langsam. Nicht fürs Handy. Kein Anruf-Knopf. *Durchgefallen*.",
       {"type": "h_scanner", "params": {"url": "ihre-firma.de", "items": ["Lädt langsam", "Nicht fürs Handy", "Kein Anruf-Knopf"], "verdict": "DURCHGEFALLEN"}}),
      ("Neu gebaut von Grund auf: schnell, fürs Handy gebaut, mit Knopf zum *Anrufen*.",
       {"type": "m_cards", "params": {"items": ["Schnell", "Fürs Handy gebaut", "Knopf zum Anrufen"]}}),
      ("Eine Landingpage. 990 Euro *Festpreis*.",
       {"type": "m_word", "params": {"text": "990 Euro", "pre": "Eine Landingpage", "sub": "Festpreis"}}),
      ("Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_word", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Würde Ihre Website diesen Test bestehen? 🔬",
       "Die meisten Kunden öffnen Ihre Website am Handy. Lädt sie langsam, ist die Schrift zu klein oder fehlt der Knopf zum Anrufen, sind sie nach wenigen Sekunden weg. Bei Google zählt das ebenfalls: Schnelle, mobile Seiten haben es leichter.",
       "Eine neue Landingpage ist eine starke einzelne Seite für Ihren Betrieb: schnell, fürs Handy gebaut, mit allem, was ein Kunde für den ersten Anruf braucht. Leistungen, Fotos, Öffnungszeiten und Kontakt stehen dort, wo man sie sucht.",
       "Landingpage 990 € Festpreis oder ab 99 € im Monat, 12 Monate Mindestlaufzeit, danach monatlich kündbar."],
      "Kennen Sie eine Website, die diesen Test nicht besteht? Schicken Sie das Video weiter. 📩",
      ["#landingpage", "#webdesign", "#berlin", "#selbstständig", "#website"],
      "Haben Sie Ihre Website schon mal am Handy getestet? 📱", tempo=1.25)

# ---------- Sa 14.11. 07:30: Licht an, neue Website ----------
video("2026-11-14-1", "Motion: Licht an, neue Website, ein Ansprechpartner", "motion", "cinematic",
      "Licht an. Ihre *neue* Website", "Licht an", "Licht an für Ihre Website", [
      ("Licht an. Ihre neue *Website*. Modern, klar, mit einem Knopf: Jetzt anfragen.",
       {"type": "h_lightswitch", "params": {"label": "IHRE WEBSITE", "button": "Jetzt anfragen"}}),
      ("Bei mir: ein Ansprechpartner. Fester Preis. Kostenloses *Erstgespräch*.",
       {"type": "m_cards", "params": {"items": ["Ein Ansprechpartner", "Fester Preis", "Kostenloses Erstgespräch"]}}),
      ("Bei Google: 4,8 Sterne aus 19 *Bewertungen*.",
       {"type": "m_word", "params": {"text": "4,8 Sterne", "pre": "Bei Google", "sub": "Aus 19 Bewertungen"}}),
      ("Ihre neue Website von Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_comment", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Was, wenn Ihre Website morgen ganz neu aussieht? 💡",
       "Viele Betriebe schieben die neue Website seit Jahren vor sich her. Zu teuer, zu kompliziert, zu viele Ansprechpartner. Dabei ist die Website oft das Erste, was ein Kunde von Ihnen sieht, meist bei Google und am Handy.",
       "Bei mir haben Sie einen Ansprechpartner vom ersten Gespräch bis zur fertigen Seite, und der Preis steht vorher fest. Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026).",
       "Landingpage ab 990 € Festpreis, Business-Paket mit SEO, Google Maps und KI-Chatbot für 1.990 €. Das Erstgespräch ist kostenlos und unverbindlich."],
      "Kennen Sie jemanden, der schon lange eine neue Website will? Schicken Sie ihm das Video. 📩",
      ["#webdesign", "#neuewebsite", "#hannover", "#selbstständig", "#website"],
      "Wie lange schieben Sie Ihre neue Website schon vor sich her? ⏳", tempo=1.25)

# ---------- Sa 14.11. 13:30: Nur Deutsch, mehrsprachige Website ----------
video("2026-11-14-2", "Motion: Kunden sprechen viele Sprachen, Professional-Paket mehrsprachig", "motion", "trap",
      "Und Ihre Website? *Nur Deutsch*", "Nur Deutsch?", "Ihre Website spricht nur Deutsch", [
      ("Ihre Kunden sprechen viele Sprachen. Hello. Merhaba. Cześć. Ciao. Bonjour. Und Ihre Website? *Nur Deutsch*.",
       {"type": "h_babel", "params": {"words": ["Hello", "Merhaba", "Cześć", "Ciao", "Bonjour"], "final": "Nur Deutsch?", "stamp": "NUR DE"}}),
      ("Das Professional-Paket: mehrsprachig, mit Blog, 10 Seiten und *mehr*.",
       {"type": "m_cards", "params": {"items": ["Mehrsprachig", "Blog", "10 Seiten und mehr"]}}),
      ("Als Festpreis: 2.990 *Euro*.",
       {"type": "m_word", "params": {"text": "2.990 Euro", "pre": "Festpreis"}}),
      ("Professional-Paket von Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_card", "params": {"keyword": "WEBSITE", "line": "Professional-Paket"}, "tr": "cut"}),
      ],
      ["Ihre Kunden sprechen viele Sprachen. Ihre Website nur eine? 🌍",
       "In Hannover, Braunschweig oder Berlin sprechen viele Kunden zu Hause eine andere Sprache als Deutsch. Wer seine Leistungen auch auf Englisch, Türkisch oder Polnisch zeigt, wird verstanden und angerufen, wo andere weggeklickt werden. Das gilt für Handwerker genauso wie für Praxen, Restaurants und Kosmetikstudios.",
       "Das Professional-Paket ist für Betriebe gedacht, die mehr wollen: 10 und mehr Seiten, Blog, mehrere Sprachen, Chatbot Pro und volle SEO.",
       "Professional 2.990 € Festpreis oder 279 € im Monat, 12 Monate Mindestlaufzeit, danach monatlich kündbar."],
      "Kennen Sie einen Betrieb mit Kunden aus vielen Ländern? Schicken Sie ihm das Video. 📩",
      ["#mehrsprachig", "#webdesign", "#berlin", "#unternehmen", "#website"],
      "In welcher Sprache sollte Ihre Website noch sprechen? 💬", tempo=1.25)

# ---------- Sa 14.11. 19:30: Termin, Fehler, Online-Terminbuchung ----------
video("2026-11-14-3", "Motion: Fehler beim Termin, Kunde bucht woanders, Online-Terminbuchung", "motion", "drive",
      "Der Kunde bucht *woanders*", "Kunde bucht woanders", "Der Kunde bucht woanders", [
      ("Formular lädt nicht. Kein freier Termin sichtbar. Rückruf in 3 Tagen. Der Kunde bucht *woanders*.",
       {"type": "h_error", "params": {"items": ["Formular lädt nicht", "Kein freier Termin sichtbar", "Rückruf in 3 Tagen"], "final": "Kunde bucht woanders", "url": "ihre-firma.de"}}),
      ("Mit Online-Terminbuchung: freie Termine sehen, selbst buchen, auch *nachts*.",
       {"type": "m_cards", "params": {"items": ["Freie Termine sehen", "Selbst buchen", "Auch nachts"]}}),
      ("Ihre Kunden buchen ohne einen einzigen *Anruf*.",
       {"type": "m_word", "params": {"text": "Ohne Anruf", "pre": "Ihre Kunden buchen"}}),
      ("Mihajlo Systems. Kommentieren Sie *WEBSITE*.",
       {"type": "m_end_word", "params": {"keyword": "WEBSITE"}, "tr": "cut"}),
      ],
      ["Ein Kunde will einen Termin. Und bucht am Ende woanders. 📅",
       "Das Formular lädt nicht, freie Termine sieht man nirgends, und der Rückruf kommt erst in drei Tagen. So verlieren Friseure, Praxen und Handwerker jeden Tag Kunden, ohne es zu merken. Denn wer heute einen Termin sucht, will ihn sofort und am liebsten ohne Anruf.",
       "Mit einer Online-Terminbuchung auf Ihrer Website sieht der Kunde sofort, wann Sie Zeit haben, und bucht selbst. Auch abends und am Wochenende, ohne dass Sie ans Telefon müssen.",
       "Die Terminbuchung baue ich direkt in Ihre Website ein, passend zu Ihren Zeiten und Leistungen. Was es für Ihren Betrieb kostet, klären wir im kostenlosen Erstgespräch."],
      "Kennen Sie jemanden, bei dem man schwer einen Termin bekommt? Schicken Sie ihm das Video. 📩",
      ["#terminbuchung", "#friseur", "#braunschweig", "#praxis", "#website"],
      "Wie bucht man bei Ihnen einen Termin? ☎️", tempo=1.25)

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
        for k in ("title", "total", "tagline", "button", "stamp", "big", "label", "headline", "query", "result", "text", "sub", "pre", "line"):
            if isinstance(p.get(k), str): texts.append(p[k])
        for k in ("items", "left", "right", "labels"):
            for it in p.get(k, []) or []:
                if isinstance(it, list) and p.get("screen") == "chat": it = it[1:]  # Rolle kunde/bot ist kein sichtbarer Text
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
