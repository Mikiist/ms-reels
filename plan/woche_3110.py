"""Woche Sa 31.10. bis Fr 06.11.2026 (3 Reels pro Tag) plus Ersatz Fr 30.10. Slot 2.
python3 plan/woche_3110.py [id ...]  -> work/<id>/job.json (ohne ids: alle)

Regeln (Mihajlo, 30.10.2026): Brücke Pflicht (Problem der Geschichte = genau das, was das Angebot löst),
nur Look story oder cinema, Comic-Motive wie Panzer, Einbruch, Zombies, Piraten erlaubt.
Feld "bild" beschreibt die Szene für den Bau der h_*-Datei (build.py ignoriert es)."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

WER = [
    "Ich bin Mihajlo und baue Websites und digitale Lösungen für Betriebe in Braunschweig, Hannover, Berlin und ganz Deutschland. Sie haben einen Ansprechpartner vom ersten Gespräch bis zur Wartung, und der Preis steht vorher fest. Bei Google habe ich 4,8 Sterne aus 19 Bewertungen (Stand September 2026).",
    "Hinter Mihajlo Systems stehe ich, Mihajlo, mit Kunden von Hannover bis Berlin. Ich baue alles selbst und bin Ihr fester Ansprechpartner, mit festem Preis. Bei Google stehe ich bei 4,8 Sternen aus 19 Bewertungen (Stand September 2026).",
    "Ich bin Mihajlo von Mihajlo Systems. Ich betreue Betriebe in Braunschweig, Hannover, Berlin und per Videoanruf in ganz Deutschland. 4,8 Sterne bei Google aus 19 Bewertungen (Stand September 2026).",
]
CTA = "Kommentieren Sie WEBSITE und ich schicke Ihnen den Link zum kostenlosen Erstgespräch. 👇"
SIG = "Mihajlo Systems, Webdesign für ganz Deutschland"
LP = "Websites gibt es ab 99 € im Monat (12 Monate Mindestlaufzeit) oder als Landingpage für 990 € einmalig. Hosting, SSL, Wartung und Updates sind bei der Miete inklusive."
BUS = "Im Business-Paket stecken bis zu 5 Seiten, KI-Chatbot Basis, SEO und Google Maps: 1.990 € einmalig oder 179 € im Monat (12 Monate Mindestlaufzeit)."
BEST = "Das Bestellsystem für Restaurants: QR-Codes und NFC-Sticker am Tisch, Bestellterminal am iPad, eigene Website und Bonuspunkte in Apple Wallet und Google Wallet. Ohne Provision an Lieferportale. Die Pakete stelle ich Ihnen im Erstgespräch vor."
OFFER = {  # Warum es wirkt, Angebot
    "ansprech": ("Bei mir landen Sie in keiner Warteschleife. Sie haben eine Nummer und einen Menschen, der Ihren Betrieb kennt, vom ersten Entwurf bis zur Wartung.", LP),
    "maps": ("Wer heute etwas sucht, sucht zuerst bei Google und auf Google Maps. Wer dort mit Website, Öffnungszeiten, Fotos und Leistungen steht, wird gefunden, auch nachts und am Wochenende.", BUS),
    "bestell": ("Wenn Gäste selbst am Tisch bestellen, gibt es keine Missverständnisse und keine Laufwege. Die Bestellung landet mit Tischnummer direkt in der Küche, und Ihr Team hat Zeit für die Gäste.", BEST),
    "wallet": ("Papierkarten gehen verloren, landen in der Wäsche oder bleiben zu Hause liegen. Eine Stempelkarte in der Wallet ist immer dabei, und Ihre Stammgäste kommen wieder.", BEST),
    "neu": ("Ihre Kunden sehen Ihre Website, bevor sie Ihren Laden sehen. Wirkt der erste Eindruck alt oder unübersichtlich, gehen sie, obwohl Ihre Arbeit großartig ist.", LP),
    "gutschein": ("Geschenke werden oft spontan gekauft, abends oder in letzter Minute. Mit einem Gutscheinshop auf Ihrer Website verkaufen Sie auch, wenn Ihr Laden zu ist, und jeder Gutschein bringt einen neuen Gast zu Ihnen.", "Websites gibt es ab 99 € im Monat (12 Monate Mindestlaufzeit) oder einmalig ab 990 €. Wie Ihr Gutscheinshop aussieht, besprechen wir im kostenlosen Erstgespräch."),
    "termin": ("Jeder Anruf unterbricht Ihre Arbeit. Mit einer Online-Terminbuchung buchen Ihre Kunden selbst, auch abends und am Wochenende, und Sie arbeiten in Ruhe weiter.", "Websites gibt es ab 99 € im Monat (12 Monate Mindestlaufzeit) oder einmalig ab 990 €. Wie die Terminbuchung bei Ihnen aussieht, besprechen wir im kostenlosen Erstgespräch."),
    "chatbot": ("Viele Fragen kommen abends und nachts: Öffnungszeiten, Preise, freie Termine. Ein KI-Chatbot auf Ihrer Website beantwortet sie sofort, auch wenn Sie schlafen oder im Urlaub sind.", "Den KI-Chatbot gibt es einzeln für 200, 350 oder 500 € einmalig. Im Business-Paket ist die Basis schon dabei."),
    "festpreis": ("Bei mir steht der Preis vorher fest. Keine Posten, die später auftauchen, keine Rechnung, die keiner versteht.", "Landingpage für 990 € einmalig oder ab 99 € im Monat (12 Monate Mindestlaufzeit). Mit dem Festpreis sparen Sie 198 € gegenüber 12 Monaten Miete."),
    "sprachen": ("Ihre Gäste kommen aus aller Welt. Wenn sie Ihre Seite in ihrer Sprache lesen, bestellen und buchen sie ohne Hemmungen.", "Im Professional-Paket: 10+ Seiten, Blog, mehrsprachig, KI-Chatbot Pro und volle SEO für 2.990 € einmalig oder 279 € im Monat (12 Monate Mindestlaufzeit)."),
    "speed": ("Am Handy entscheidet die erste Sekunde. Lädt eine Seite zu langsam, ist der Kunde weg, bevor er Ihr Angebot gesehen hat. Darum baue ich jede Seite fürs Handy zuerst.", "Zum Beispiel erreicht webdesignberlin48h.de mobil 97 bei PageSpeed (gemessen am 21.10.2026). Landingpage ab 99 € im Monat (12 Monate Mindestlaufzeit) oder 990 € einmalig."),
    "kontakt": ("Wer Sie sucht, will in Sekunden wissen, wie er Sie erreicht. Ein Knopf zum Anrufen und ein kurzes Anfrageformular ganz oben machen aus Besuchern Anfragen.", LP),
    "business": ("Werbung, Auskunft und Gefundenwerden sollten nicht alle an Ihnen hängen. Im Business-Paket übernimmt die Website die Werbung, der Chatbot die Fragen und Google Maps das Finden.", BUS),
    "landing": ("Werbung, die einmal vorbeifliegt, ist weg. Eine Website ist jeden Tag da, genau dann, wenn Kunden nach Ihnen suchen.", LP),
}
V = []
def video(id_, topic, look, music, hook_text, cover, audio, story, h, end, e, offer, hook, klar, share, tags, first, bild):
    date, slot = id_[:10], int(id_[-1]); i = len(V)
    warum, angebot = OFFER[offer]
    cap = "\n\n".join([hook, "Klar, die Geschichte ist ausgedacht. Die Idee dahinter stimmt aber: " + klar, warum, WER[i % 3], angebot, CTA, share, SIG, " ".join(tags)])
    v = {"id": id_, "date": date, "slot": slot, "topic": topic, "keyword": "WEBSITE", "hook_text": hook_text, "cover_title": cover, "audio_name": audio,
         "music": music, "look": look, "first_comment": first + " Kommentieren Sie WEBSITE 👇 dann schreibe ich Ihnen persönlich.",
         "segments": [{"say": story, "scene": {"type": h, "params": {}}}, {"say": end, "scene": {"type": e, "params": {}, "tr": "cut"}}], "caption": cap, "bild": bild}
    if look == "cinema": v["hook_until"] = 3.2
    V.append(v)

# ---------- Fr 30.10. 13:30 (Ersatz für die Bananen) ----------
video("2026-10-30-2", "Geschichte: Warteschleife, Bart wächst (ein Ansprechpartner)", "story", "house", "Er wird *verbunden*", "Er wartet noch *immer*", "Herr Brandt wird verbunden",
      "Herr Brandt will nur eine kleine *Änderung*. Er ruft an. Drücken Sie die Eins. Drücken Sie die Zwei. Er wird verbunden. Und verbunden. Und *verbunden*. Draußen wird es Winter, dann wieder Sommer, sein Bart wächst bis zum *Boden*. Seine Nachbarin ruft wegen derselben Sache an. Nach einem Klingeln sagt jemand: Hallo? Denn sie hatte nur noch…", "h_warteschleife",
      "Mihajlo Systems. *Einen* Ansprechpartner, vom ersten Gespräch bis zur Wartung. Kommentieren Sie *WEBSITE*.", "warteschleife_end", "ansprech",
      "Stellen Sie sich vor: Sie wollen nur eine kleine Änderung an Ihrer Website und hängen ein Jahr in der Warteschleife. ☎️",
      "Wer eine Änderung an seiner Website braucht, will nicht von Abteilung zu Abteilung verbunden werden. Bei vielen Agenturen ist genau das Alltag. Bei Mihajlo Systems sprechen Sie immer mit derselben Person.",
      "Kennen Sie jemanden, der gerade in einer Warteschleife hängt? Schicken Sie ihm das Video. 📩",
      ["#webdesign", "#selbstständig", "#berlin", "#kleinunternehmen", "#website"], "Wie lange hingen Sie schon mal in einer Warteschleife? ⏳",
      "Comic, Look story. Bild 0: Herr Brandt (Hemd, Krawatte) mit Telefonhörer am Ohr, Sprechblase aus dem Hörer 'Drücken Sie die 1'. Bei 'Eins'/'Zwei' riesige Zahlen-Sprechblasen. Bei 'verbunden' (3x) Schnitt: er sitzt jedes Mal woanders (Stuhl, Sofa, Hängematte), Uhr springt. Bei 'Winter' Schnee am Fenster, bei 'Sommer' Sonne, Bart wächst sichtbar bis zum Boden, Spinnweben am Hörer. Splitscreen bei 'Nachbarin': rechts Frau, ein 'Ring!' und Sprechblase 'Hallo?' von einem freundlichen Menschen, sie strahlt; links Brandt mit Riesenbart starrt ungläubig. Bei 'Denn' Kamera taucht in ihren Hörer, Weiß. Schluss warteschleife_end: alter Hörer am Spiralkabel, der Filmtitel Mihajlo Systems, Zeile 'EIN ANSPRECHPARTNER'.")

# ---------- Sa 31.10. (Halloween) ----------
video("2026-10-31-1", "Geschichte: Zombies wollen die Öffnungszeiten (Google Maps)", "story", "trap", "Hundert *Zombies* vor dem Kiosk", "Was wollen die *Zombies*?", "Hundert Zombies vor dem Kiosk",
      "Halloween, drei Uhr nachts. Hundert *Zombies* stehen vor einem Kiosk und rütteln an der Tür. Sie wollen nur eins: wissen, wann er *aufmacht*. Der Besitzer zittert unter der Theke. Gegenüber vor der Bäckerei sitzen andere Zombies ganz *entspannt* und warten bis sieben. Denn der Bäcker hatte seine Öffnungszeiten…", "h_zombie",
      "Mihajlo Systems. Bei Google Maps *eingetragen*, mit eigener Website. Kommentieren Sie *WEBSITE*.", "zombie_end", "maps",
      "Stellen Sie sich vor: Halloween, drei Uhr nachts, und hundert Zombies rütteln an Ihrer Ladentür. 🧟",
      "Die meisten Menschen schauen vor dem Losgehen bei Google Maps, wann ein Laden offen hat. Fehlen dort Ihre Öffnungszeiten, stehen sie vor verschlossener Tür oder gehen gleich zur Konkurrenz.",
      "Kennen Sie einen Laden, dessen Öffnungszeiten keiner kennt? Schicken Sie ihm das Video. 🎃",
      ["#halloween", "#googlemaps", "#hannover", "#einzelhandel", "#website"], "Wer saß wohl gegenüber vor der Bäckerei? 🧟",
      "Comic, Nacht, Vollmond, Look story. Bild 0: Zombie-Hände knallen gegen die Glastür eines Kiosks (BAM), Schild 'KIOSK' flackert. Viele grüne, aber lustige Comic-Zombies (keine Gewalt, kein Blut) drängen sich, Sprechblasen 'Wann???' und 'AUF!'. Bei 'aufmacht' großes Fragezeichen über der Menge. Bei 'Besitzer' Innenansicht: Kioskbesitzer zittert unter der Theke, Zähne klappern. Bei 'Gegenüber' Kamera schwenkt über die Straße: vor 'BÄCKEREI' sitzen Zombies im Kreis auf Klappstühlen, entspannt, einer liest Zeitung, Schild an der Tür 'Mo bis So ab 7 Uhr'. Bei 'sieben' Kirchturmuhr. Bei 'Denn' Kamera taucht in das Öffnungszeiten-Schild, Weiß. zombie_end: Vollmond, Nebel, Filmtitel Mihajlo Systems, Zeile 'BEI GOOGLE MAPS GEFUNDEN'.")

video("2026-10-31-2", "Geschichte: Kellner läuft jeden Abend einen Marathon (Bestellsystem am Tisch)", "story", "drive", "Er läuft jeden Abend einen *Marathon*", "Der Kellner-*Marathon*", "Kellner Tim läuft einen Marathon",
      "Kellner Tim läuft jeden Abend einen *Marathon*. Tisch eins, Küche, Tisch sieben, Küche, Tisch zwölf. Nach der Schicht hängt ihm der Chef eine *Medaille* um, und Tim schläft im Stehen ein. Heute geht Tim ganz *gemütlich*, und die Gäste haben trotzdem schneller ihr Essen. Denn die Gäste bestellten jetzt…", "h_marathon",
      "Mihajlo Systems. Direkt am *Tisch*, über QR-Code und NFC, ohne Provision. Kommentieren Sie *WEBSITE*.", "marathon_end", "bestell",
      "Stellen Sie sich vor: Ihr Kellner läuft jeden Abend 42 Kilometer zwischen Tisch und Küche. 🏃",
      "In vielen Restaurants rennt das Team mehr, als es bedient. Wenn Gäste am Tisch selbst bestellen, landet alles direkt in der Küche, und für Gespräche mit den Gästen bleibt endlich wieder Zeit.",
      "Kennen Sie einen Kellner, der eine Medaille verdient hätte? Schicken Sie ihm das Video. 🏅",
      ["#gastronomie", "#restaurant", "#braunschweig", "#digitalisierung", "#kellner"], "Wie viele Kilometer läuft Ihr Team pro Abend? 🏃",
      "Comic, Look story, Restaurant innen, warm. Bild 0: Startschuss-Pistole? Nein: Startnummer auf Tims Schürze, er sprintet mit Tablett los (Speed-Linien), Teller wackeln. Bei 'Tisch eins/Küche/sieben/zwölf' Schwenk mit Tischnummern-Schildern groß, Schweißtropfen, eine Kilometeranzeige wie bei einem Lauf zählt hoch bis 42 km. Bei 'Medaille' Chef hängt Medaille um, Konfetti, Tim schläft im Stehen (Zzz). Bei 'gemütlich' Tim schlendert mit Kaffee, Gäste an Tischen strahlen, Teller kommen. Nur Menschen, kein Handy, kein Code bis zum Schnitt. Bei 'Denn' Kamera taucht in einen Tischaufsteller (nur von hinten zu sehen), Weiß. marathon_end: Filmtitel auf dunklem Holz, Zeile 'BESTELLEN DIREKT AM TISCH'.")

video("2026-10-31-3", "Geschichte: Spukhaus mit der besten Lasagne (neue Website)", "cinema", "cinematic", "Alle rennen *schreiend* weg", "Das *Spukhaus* von Mama Rosa", "Die beste Lasagne im Spukhaus",
      "Halloween. Die beste Lasagne der Stadt kocht Mama Rosa. Aber wer ihr Haus von außen sieht, rennt *schreiend* weg: Spinnweben, schiefe Läden, ein Schild von neunzehnhundertachtzig. Eine Woche später stehen die Leute bis zur *Ecke*. Die Küche ist dieselbe, das Rezept auch. Mama Rosa hatte nur das geändert, was alle *zuerst* sehen…", "h_spukhaus",
      "Mihajlo Systems. Eine neue Website, die so gut aussieht, wie Ihr Essen *schmeckt*. Kommentieren Sie *WEBSITE*.", "spukhaus_end", "neu",
      "Stellen Sie sich vor: Sie kochen die beste Lasagne der Stadt, und alle rennen schreiend an Ihrem Haus vorbei. 👻",
      "Ihre Website ist Ihre Fassade im Netz. Ist sie alt, langsam oder unübersichtlich, gehen Kunden weiter, bevor sie Ihr Essen, Ihre Arbeit oder Ihr Team überhaupt kennenlernen.",
      "Kennen Sie einen Laden mit großartigem Angebot und gruseliger Website? Schicken Sie ihm das Video. 👻",
      ["#halloween", "#webdesign", "#berlin", "#restaurant", "#website"], "Was hat Mama Rosa wohl geändert? 👻",
      "Kino-Comic, Look cinema, Vollmond, Nebel, Gewitter. Bild 0: Blitz, Spukhaus mit schiefen Fensterläden, Spinnweben, Fledermäuse, flackerndes altes Schild 'RISTORANTE 1980'. Drinnen warmes Licht, Mama Rosa (Schürze, Kochlöffel) hebt dampfende Lasagne. Bei 'schreiend' Passanten rennen weg mit Sprechblasen 'AAAH!'. Bei 'Woche' Zeitsprung: dasselbe Haus hell, frisch gestrichen, Lichterkette, neues Schild 'Mama Rosa', Schlange bis zur Ecke, Sprechblase 'Riecht das gut!'. Bei 'Küche' Nahaufnahme: dieselbe Lasagne, dieselbe Rosa, sie zwinkert. Bei 'zuerst' Kamera taucht ins neue Schild, Weiß. spukhaus_end: warmes Kerzenlicht, Filmtitel, Zeile 'IHR ERSTER EINDRUCK IM NETZ'.")

# ---------- So 01.11. ----------
video("2026-11-01-1", "Geschichte: Opa schenkt seit 30 Jahren Socken (Gutscheinshop)", "story", "house", "Seit 30 Jahren *Socken*", "Opa und die *Socken*", "Opa Heinz und die grauen Socken",
      "Seit dreißig Jahren schenkt Opa Heinz zum Geburtstag *Socken*. Graue Socken. Die Familie lächelt tapfer, der Schrank ist voll bis unter die *Decke*. Dieses Jahr gibt es keine Socken. Oma liest die Karte und *weint* vor Freude. Die Enkel fragen: Wie hat Opa das geschafft? Er war doch gar nicht in der Stadt. Denn ihr Lieblingsladen hatte…", "h_socken",
      "Mihajlo Systems. Einen Gutscheinshop, bei dem man von zu Hause aus *schenkt*. Kommentieren Sie *WEBSITE*.", "socken_end", "gutschein",
      "Stellen Sie sich vor: 30 Jahre lang graue Socken zum Geburtstag. Und dann dieses Jahr diese Karte. 🧦",
      "Viele Menschen wollen etwas Schönes aus ihrer Stadt verschenken, kommen aber nicht in den Laden. Mit einem Gutscheinshop kaufen sie bequem von zu Hause, und Ihr Laden bekommt den Umsatz statt der Sockenabteilung.",
      "Kennen Sie jemanden, der immer Socken verschenkt? Schicken Sie ihm das Video. 🎁",
      ["#gutschein", "#geschenkidee", "#hannover", "#einzelhandel", "#website"], "Was stand wohl auf Omas Karte? 🎁",
      "Comic, Look story, gemütliches Wohnzimmer, Geburtstagstorte. Bild 0: Opa Heinz überreicht stolz ein Päckchen, es öffnet sich, POW: graue Socken. Bei 'dreißig Jahren' Rückblende-Montage mit Kalenderblättern, jedes Jahr Socken, Familie lächelt gequält. Bei 'Decke' Schrank geht auf, Socken-Lawine. Bei 'keine Socken' Opa sitzt im Sessel zu Hause (Pantoffeln, Kater auf dem Schoß), nicht in der Stadt. Bei 'weint' Oma mit Karte, Freudentränen, Herzen. Bei 'Enkel' zwei Kinder mit Fragezeichen. Bei 'Denn' Kamera taucht in die Karte, Weiß. Kein Handy im Bild. socken_end: Geschenkpapier, Schleife, Filmtitel, Zeile 'IHR GUTSCHEINSHOP'.")

video("2026-11-01-2", "Geschichte: Barbier mit drei Telefonen (Terminbuchung)", "story", "phonk", "*Schnipp*. Die Augenbraue ist weg", "Schnipp. *Weg*.", "Barbier Leon und drei Telefone",
      "Barbier Leon schneidet Haare mit der *rechten* Hand. Mit der linken hält er das Telefon. Unterm Kinn klemmt ein zweites, am Fuß klingelt das *dritte*. Schnipp. Dem Kunden fehlt eine halbe *Augenbraue*. Heute klingelt kein einziges Telefon, und der Laden ist trotzdem voll bis Samstag. Denn seine Kunden buchten jetzt…", "h_barbier",
      "Mihajlo Systems. Ihren Termin *selbst*, über eine Online-Terminbuchung. Kommentieren Sie *WEBSITE*.", "barbier_end", "termin",
      "Stellen Sie sich vor: Sie schneiden Haare und haben drei Telefone am Körper. Schnipp. 💈",
      "Im Barbershop, beim Friseur oder in der Praxis unterbricht jeder Anruf die Arbeit. Mit einer Online-Terminbuchung auf Ihrer Website buchen Kunden selbst, und Sie konzentrieren sich auf den Schnitt.",
      "Kennen Sie einen Barbier, der ständig am Telefon hängt? Schicken Sie ihm das Video. 💈",
      ["#barbershop", "#friseur", "#braunschweig", "#terminbuchung", "#selbstständig"], "Wem fehlt wohl gleich eine Augenbraue? 💈",
      "Comic, Look story, Barbershop mit Spiegel, Barber-Säule. Bild 0: Schere schnippt (SCHNIPP), Kunde im Stuhl mit Umhang, Leon mit Telefonhörer am Ohr. Bei 'zweites' zweiter Hörer unterm Kinn, bei 'dritte' ein altes Telefon am Fuß klingelt (RRRING, wackelt). Bei 'Augenbraue' Nahaufnahme: halbe Augenbraue weg, Kunde schaut entsetzt in den Spiegel, POW 'SCHNIPP!'. Bei 'Heute' Leon schneidet entspannt mit beiden Händen, Telefone liegen still in einer Schublade, Wartebank voll mit zufriedenen Kunden, Wandkalender 'voll bis Samstag'. Bei 'Denn' Kamera taucht in den Kalender, Weiß. Klassische Telefone sind ok, kein Handy-Bildschirm. barbier_end: Barber-Säule dreht, Filmtitel, Zeile 'TERMINE SELBST BUCHEN'.")

video("2026-11-01-3", "Geschichte: Geheimagent sucht den besten Döner (Google Maps)", "cinema", "cinematic", "20 Jahre *Geheimdienst*. Ein Fall offen.", "Der *Döner*-Fall", "Agent Krüger und der beste Döner",
      "Agent Krüger hat jeden Fall gelöst. Nur einen nicht: Wo gibt es den besten *Döner* der Stadt? Zwanzig Jahre lang Verkleidungen, Ferngläser, Nachtsicht. *Nichts*. Dann fragt seine Oma: Den besten Döner? Sie zeigt in drei Sekunden auf die *Ecke* gegenüber. Krüger lässt die Sonnenbrille fallen. Denn der Dönerladen war längst…", "h_agent",
      "Mihajlo Systems. Bei Google Maps zu finden, mit eigener *Website*. Kommentieren Sie *WEBSITE*.", "agent_end", "maps",
      "Stellen Sie sich vor: 20 Jahre Geheimdienst, und Sie finden den besten Döner der Stadt nicht. 🕵️",
      "Ihre Kunden müssen keine Agenten sein, um Sie zu finden. Mit Eintrag bei Google Maps, Fotos, Öffnungszeiten und einer schnellen Website sind Sie in Sekunden da, wo gesucht wird.",
      "Kennen Sie jemanden, der den besten Döner der Stadt sucht? Schicken Sie ihm das Video. 🥙",
      ["#googlemaps", "#imbiss", "#berlin", "#gastronomie", "#website"], "Wie hat die Oma ihn wohl so schnell gefunden? 🕵️",
      "Kino-Comic im Agentenfilm-Stil, Look cinema, Nacht, Regen, Neonschilder ok, aber kein Bildschirm. Bild 0: Lichtkegel, Agent Krüger mit Trenchcoat, Hut, Sonnenbrille, Akte 'FALL OFFEN: DÖNER'. Bei 'Verkleidungen' Montage: Schnurrbart, Busch-Tarnung, Mülltonne, Fernglas auf Dach. Bei 'Nichts' er sitzt geknickt im Regen. Bei 'Oma' Tageslicht, Wohnzimmer, Oma mit Strickzeug, Sprechblase 'Den besten Döner?', sie zeigt aus dem Fenster auf 'DÖNER' an der Ecke gegenüber, Fingerzeig mit Glitzer. Bei 'Sonnenbrille' Brille fällt in Zeitlupe, Krüger mit offenem Mund. Bei 'Denn' Kamera taucht ins Dönerschild, Weiß. agent_end: Agenten-Akte, Stempel 'GELÖST', Filmtitel, Zeile 'BEI GOOGLE MAPS GEFUNDEN'.")

# ---------- Mo 02.11. ----------
video("2026-11-02-1", "Geschichte: Oma beantwortet alle Fragen vor dem Laden (KI-Chatbot)", "story", "drive", "Oma weiß *alles*", "Oma *Gerda* weiß alles", "Oma Gerda weiß alles",
      "Oma Gerda sitzt jeden Tag auf der Bank vor dem Laden ihres Enkels. Wann haben Sie offen? Gibt es das in Blau? Liefern Sie auch? Oma weiß *alles*. Dann fliegt Oma nach *Mallorca*. Der Enkel bekommt Panik. Doch die Fragen werden weiter beantwortet, sogar nachts um *zwei*. Denn ihr Enkel hatte…", "h_oma",
      "Mihajlo Systems. Einen KI-Chatbot, der Fragen beantwortet, auch *nachts*. Kommentieren Sie *WEBSITE*.", "oma_end", "chatbot",
      "Stellen Sie sich vor: Ihre Oma sitzt jeden Tag vor Ihrem Laden und beantwortet alle Fragen. Und dann fliegt sie nach Mallorca. 👵",
      "Die meisten Fragen Ihrer Kunden wiederholen sich: Öffnungszeiten, Lieferung, Preise. Ein KI-Chatbot auf Ihrer Website beantwortet sie sofort, auch nachts, wenn niemand im Laden ist.",
      "Kennen Sie jemanden, dessen Oma eigentlich die Chefin ist? Schicken Sie ihm das Video. 👵",
      ["#kichatbot", "#einzelhandel", "#hannover", "#kleinunternehmen", "#website"], "Wer hat wohl nachts um zwei geantwortet? 👵",
      "Comic, Look story, Laden mit Markise, sonnig. Bild 0: Oma Gerda (Dutt, Brille, Strickjacke) auf Bank, drei Kunden stellen gleichzeitig Fragen in Sprechblasen, Oma antwortet mit erhobenem Zeigefinger, Sternchen. Bei 'alles' POW 'OMA WEISS ALLES'. Bei 'Mallorca' Oma mit Sonnenhut im Liegestuhl am Strand, Cocktail, Flugzeug am Himmel. Bei 'Panik' Enkel rauft sich die Haare im leeren Laden, Fragen-Sprechblasen stapeln sich. Bei 'nachts um zwei' Nacht, Laden dunkel, Mond, eine Kundin im Schlafanzug am Fenster, Sprechblase 'Haben Sie morgen offen?', eine freundliche Antwort-Sprechblase erscheint aus dem Nichts, sie lächelt. Kein Handy-Bildschirm zeigen. Bei 'Denn' Kamera taucht in die Antwort-Sprechblase, Weiß. oma_end: Strickmuster, Filmtitel, Zeile 'IHR KI-CHATBOT'.")

video("2026-11-02-2", "Geschichte: Rechnung rollt bis ans Meer (Festpreis)", "cinema", "trap", "Die Rechnung rollt bis ans *Meer*", "Die endlose *Rechnung*", "Die Rechnung bis ans Meer",
      "Herr Wolf bekommt die Rechnung für seinen neuen Auftritt. Er rollt sie aus. Sie rollt über den *Tisch*, aus der Tür, die Straße runter, bis ans *Meer*. Posten über Posten, die ihm keiner erklärt hat. Sein Nachbar bekommt für dasselbe einen Zettel mit *einer* Zeile. Er lacht nur. Denn sein Preis stand schon…", "h_rechnung",
      "Mihajlo Systems. Vorher *fest*, zum Beispiel 990 Euro für eine Landingpage. Kommentieren Sie *WEBSITE*.", "rechnung_end", "festpreis",
      "Stellen Sie sich vor: Ihre Rechnung ist so lang, dass sie bis ans Meer rollt. 🧾",
      "Viele Betriebe erleben bei Webdesign Überraschungen: Stunden, Pauschalen, Zusatzposten. Bei Mihajlo Systems steht der Preis vor dem Start fest, und es kommt nichts dazu, was nicht besprochen ist. So wissen Sie vom ersten Tag an, woran Sie sind.",
      "Kennen Sie jemanden, der gerade so eine Rechnung bekommen hat? Schicken Sie ihm das Video. 📩",
      ["#webdesign", "#festpreis", "#braunschweig", "#selbstständig", "#website"], "Was stand wohl auf dem Zettel mit einer Zeile? 🧾",
      "Kino-Comic, Look cinema. Bild 0: Briefumschlag knallt auf den Tisch (KLATSCH), Herr Wolf reißt ihn auf. Bei 'rollt' Papierrolle rollt in Zeitlupe vom Tisch, durch die Tür, die Straße hinunter, durch die Stadt, Kamera fliegt hinterher, Posten wie 'Pauschale', 'Sonstiges', 'Aufschlag', bis ans Meer, Möwen, Wellen. Bei 'Nachbar' Gartenzaun, Nachbar hält kleinen Zettel mit einer Zeile, lacht, Sonnenschein. Bei 'Denn' Kamera taucht in den kleinen Zettel, Weiß. rechnung_end: weißes Papier mit einer Zeile, Filmtitel, Zeile 'FESTPREIS VORHER'.")

video("2026-11-02-3", "Geschichte: Panzer vor der Pizzeria (Bestellung über eigene Seite)", "story", "phonk", "Jeden Freitag ein *Panzer*", "Der *Panzer* bestellt Pizza", "Der Panzer vor der Pizzeria",
      "Jeden Freitag rollt ein *Panzer* vor die Pizzeria Bella. Der Kommandant brüllt durchs Fenster: Vierzig Pizzen, *sofort*! Der Koch versteht nur die Hälfte. Es kommen vierzig *Salate*. Diesen Freitag bleibt der Panzer in der Kaserne, und trotzdem kommen exakt vierzig Pizzen. Denn der Kommandant bestellte jetzt…", "h_panzerpizza",
      "Mihajlo Systems. Direkt über die eigene *Seite* der Pizzeria, ohne Provision. Kommentieren Sie *WEBSITE*.", "panzerpizza_end", "bestell",
      "Stellen Sie sich vor: Jeden Freitag rollt ein Panzer vor Ihre Pizzeria und brüllt die Bestellung durchs Fenster. 🍕",
      "Bestellungen am Telefon oder durchs Fenster gehen schnell schief. Wenn Gäste direkt über die eigene Seite Ihres Restaurants bestellen, kommt genau das an, was bestellt wurde, ohne Provision an ein Portal.",
      "Kennen Sie eine Pizzeria, die das sehen sollte? Schicken Sie ihr das Video. 🍕",
      ["#pizzeria", "#gastronomie", "#hannover", "#bestellsystem", "#restaurant"], "Was hat der Kommandant wohl diesmal gemacht? 🍕",
      "Comic im Stil des Panzer-Reels (h_tank), Look story, Tag. Bild 0: Panzerkette rollt ins Bild (Rumpeln, Staub), Panzer hält vor 'PIZZERIA BELLA', Rohr zeigt aufs Fenster. Bei 'brüllt' Kommandant aus der Luke mit Megafon, Sprechblase 'VIERZIG PIZZEN!', Fensterscheiben wackeln. Bei 'Hälfte' Koch mit Ohrenschützern, Fragezeichen. Bei 'Salate' vierzig Salatschüsseln auf dem Panzer gestapelt, Soldaten schauen entsetzt. Bei 'Kaserne' Panzer schläft in der Garage (Zzz), Soldaten an langen Tischen. Bei 'Pizzen' ein Lieferbote mit Turm aus 40 Pizzakartons, Jubel. Nur Comic, keine Gewalt, kein Handy im Bild. Bei 'Denn' Kamera taucht in einen Pizzakarton, Weiß. panzerpizza_end: Pizzakarton öffnet sich, Filmtitel, Zeile 'BESTELLEN OHNE PROVISION'.")

# ---------- Di 03.11. ----------
video("2026-11-03-1", "Geschichte: Gast gackert, Huhn kommt lebendig (mehrsprachig)", "story", "house", "Er bestellt *Hähnchen*. Pantomime.", "Das *Huhn* auf dem Tisch", "Das lebendige Huhn",
      "Ein Gast aus Japan zeigt auf die Speisekarte. Der Kellner versteht kein *Wort*. Der Gast macht es vor: Er gackert und flattert mit den Armen. Zehn Minuten später steht ein lebendiges *Huhn* auf dem Tisch. Nebenan bestellen Gäste aus zwölf Ländern ganz *entspannt*. Denn nebenan las jeder die Karte…", "h_huhn",
      "Mihajlo Systems. In seiner *eigenen* Sprache, auf einer mehrsprachigen Website. Kommentieren Sie *WEBSITE*.", "huhn_end", "sprachen",
      "Stellen Sie sich vor: Ihr Gast bestellt per Pantomime, und es kommt ein lebendiges Huhn. 🐔",
      "Touristen, Geschäftsreisende und Nachbarn aus aller Welt suchen Restaurants und Betriebe am liebsten in ihrer Sprache. Eine mehrsprachige Website holt sie ab, bevor sie überhaupt zur Tür reinkommen.",
      "Kennen Sie ein Restaurant mit vielen Gästen aus aller Welt? Schicken Sie ihm das Video. 🌍",
      ["#restaurant", "#tourismus", "#berlin", "#mehrsprachig", "#webdesign"], "Was wollte der Gast wohl wirklich bestellen? 🐔",
      "Comic, Look story, Restaurant. Bild 0: Huhn flattert gackernd ins Bild (GACK!), Federn fliegen, dann Rückblende. Freundlicher Tourist mit Kamera um den Hals zeigt auf eine Speisekarte mit Schnörkeln, Kellner mit Fragezeichen. Bei 'gackert' Gast steht auf, flattert mit den Armen, ganzes Restaurant schaut. Bei 'Huhn' Kellner stellt ein lebendiges Huhn auf den Teller, Huhn und Gast starren sich an. Bei 'Nebenan' Schwenk: anderes Restaurant, Gäste mit kleinen Länderfähnchen am Tisch lächeln und bestellen. Respektvoll, keine Klischees außer Kamera. Kein Handy-Bildschirm. Bei 'Denn' Kamera taucht in die Speisekarte nebenan, Weiß. huhn_end: Fähnchen, Filmtitel, Zeile 'MEHRSPRACHIGE WEBSITE'.")

video("2026-11-03-2", "Geschichte: Stempelkarte in der Waschmaschine (Wallet-Stempelkarte)", "cinema", "drive", "Neun Stempel. Dann die *Wäsche*.", "Neun Stempel, dann *Matsch*", "Neun Stempel in der Waschmaschine",
      "Herr Becker ist Stammgast im Café Lena. Neun Stempel auf seiner Karte, beim zehnten gibt es Kuchen *gratis*. Dann wäscht seine Frau die Hose. Die Karte ist *Matsch*. Herr Becker weint in die Waschmaschine. Bei Frau Schulz passiert dasselbe, und sie bekommt trotzdem ihren *Kuchen*. Denn ihre Stempelkarte war jetzt…", "h_stempel",
      "Mihajlo Systems. In der *Wallet*, mit dem Bestellsystem fürs Café. Kommentieren Sie *WEBSITE*.", "stempel_end", "wallet",
      "Stellen Sie sich vor: Neun Stempel gesammelt, und dann landet die Karte in der Waschmaschine. 🧺",
      "Stempelkarten aus Papier gehen verloren, werden gewaschen oder bleiben im falschen Portemonnaie. Eine digitale Stempelkarte in Apple Wallet und Google Wallet ist immer dabei und bringt Ihre Stammgäste zurück ins Café.",
      "Kennen Sie jemanden, der seine Stempelkarte schon mal gewaschen hat? Schicken Sie ihm das Video. ☕",
      ["#cafe", "#gastronomie", "#braunschweig", "#stammkunden", "#digitalisierung"], "Wo war wohl die Karte von Frau Schulz? ☕",
      "Kino-Comic, Look cinema, warmes Café-Licht. Bild 0: Stempel knallt auf Karte (STOMP), 9. Feld, Herr Becker (Schnauzer, Pullunder) strahlt, Kuchenvitrine leuchtet. Bei 'wäscht' Waschmaschine, Trommel dreht, Karte kreist im Schaum. Bei 'Matsch' Nahaufnahme Papierbrei, Tropfen. Bei 'weint' Becker kniet vor der Maschine, Tränenbäche. Bei 'Frau Schulz' Gegenschnitt: sie steht an der Theke, Kellnerin bringt Kuchen mit Kerze, Frau Schulz zwinkert. Kein Handy-Bildschirm bis zum Schnitt. Bei 'Denn' Kamera taucht ins Kuchenstück, Weiß. stempel_end: zehn Stempelfelder füllen sich golden, Filmtitel, Zeile 'STEMPELKARTE IN DER WALLET'.")

video("2026-11-03-3", "Geschichte: Die Tür, die sich ewig langsam öffnet (schnelle Website)", "cinema", "cinematic", "Diese Tür braucht *ewig*", "Die *langsamste* Tür", "Die langsamste Tür der Stadt",
      "Vor einem Laden steht eine Kundin, das Geld schon in der Hand. Die Tür öffnet sich. Ganz. Langsam. Zentimeter für *Zentimeter*. Die Kundin gähnt, ihr Kaffee wird kalt, sie bekommt graue *Haare*. Gegenüber geht eine Tür auf, schwupp, in einer Sekunde. Die Kundin ist weg. Denn gegenüber war alles in einer *Sekunde*…", "h_tuer",
      "Mihajlo Systems. Websites, die am Handy *schnell* laden. Kommentieren Sie *WEBSITE*.", "tuer_end", "speed",
      "Stellen Sie sich vor: Ihre Kundin steht mit Geld in der Hand vor Ihrer Tür, und die Tür öffnet sich im Schneckentempo. 🐌",
      "Genau so fühlt sich eine langsame Website am Handy an. Wer warten muss, tippt zurück und landet bei der Konkurrenz, die schneller ist.",
      "Kennen Sie eine Website, die sich so langsam öffnet? Schicken Sie das Video weiter. 🐌",
      ["#webdesign", "#pagespeed", "#hannover", "#einzelhandel", "#website"], "Wie lange warten Sie, bis Sie gehen? 🐌",
      "Kino-Comic, Look cinema, Zeitlupe als Stilmittel. Bild 0: Nahaufnahme Türklinke, Quietschen (QUIIIETSCH), Kundin mit Geldschein. Bei 'Langsam' Tür bewegt sich millimeterweise, Uhr über der Tür rast, Schnecke kriecht schneller vorbei. Bei 'gähnt' Gähnen, Kaffee dampft nicht mehr, Haare werden grau, Spinnweben am Türrahmen. Bei 'Gegenüber' Gegenschnitt: Glastür gleitet in einem Ruck auf (SCHWUPP), warmes Licht. Bei 'weg' nur noch Staubwolke in Kundenform. Kein Handy-Bildschirm. Bei 'Denn' Kamera taucht durch die schnelle Tür, Weiß. tuer_end: Stoppuhr bleibt bei 1 Sekunde stehen, Filmtitel, Zeile 'SCHNELL AM HANDY'.")

# ---------- Mi 04.11. ----------
video("2026-11-04-1", "Geschichte: Elektriker mit fünf Hüten (Business-Paket)", "story", "trap", "Jeden Tag *fünf* Hüte", "Fünf Hüte, *ein* Kopf", "Elektriker Jonas und die fünf Hüte",
      "Elektriker Jonas trägt jeden Tag fünf Hüte. Morgens Elektriker, mittags Telefonist, nachmittags Werbefachmann, abends Buchhalter, nachts *Auskunft*. Sein Kopf *qualmt*. Heute trägt er nur noch einen Hut, seinen eigenen, und schläft endlich *durch*. Denn um den Rest kümmerte sich jetzt…", "h_huete",
      "Mihajlo Systems. Website, KI-Chatbot und Google Maps in einem *Paket*. Kommentieren Sie *WEBSITE*.", "huete_end", "business",
      "Stellen Sie sich vor: Sie sind Elektriker, Telefonist, Werber, Buchhalter und nachts noch die Auskunft. 🎩",
      "Handwerker machen neben ihrem Beruf oft alles selbst. Eine gute Website wirbt für Sie, ein Chatbot beantwortet die immer gleichen Fragen und Google Maps sorgt dafür, dass man Sie findet.",
      "Kennen Sie einen Handwerker, der alles selbst macht? Schicken Sie ihm das Video. 🔌",
      ["#handwerk", "#elektriker", "#braunschweig", "#selbstständig", "#website"], "Welchen Hut würden Sie zuerst abgeben? 🎩",
      "Comic, Look story. Bild 0: fünf Hüte fallen von oben auf Jonas' Kopf und stapeln sich (PLOPP x5). Bei jeder Rolle wechselt der oberste Hut und die Szene: Sicherungskasten, Telefonhörer, Plakat kleben, Taschenrechner mit Papierbergen, nachts im Schlafanzug mit Sprechblase 'Ja, wir haben offen'. Bei 'qualmt' Dampf aus den Ohren, Hutturm wackelt. Bei 'einen Hut' die vier anderen Hüte fliegen davon wie Vögel, Jonas schläft im Bett, Mond, glücklich. Kein Handy-Bildschirm. Bei 'Denn' Kamera taucht in den Hut, Weiß. huete_end: vier Hüte landen auf einem Hutständer mit Etiketten, Filmtitel, Zeile 'BUSINESS-PAKET'.")

video("2026-11-04-2", "Geschichte: Maler mit Zeppelin, Kollegin mit Website (Landingpage)", "cinema", "house", "Er mietet einen *Zeppelin*", "Der *Zeppelin*-Maler", "Malermeister Klaus und der Zeppelin",
      "Malermeister Klaus mietet einen *Zeppelin*. Quer über der Stadt steht in riesigen Buchstaben: Maler Klaus. Die Leute winken, Kinder jubeln. Am Monatsende kommt die Rechnung, und Klaus fällt vom *Stuhl*. Seine Kollegin Lena wird jeden Tag gefunden und zahlt dafür so viel wie für ein *Abendessen* zu zweit. Denn Lena hatte…", "h_zeppelin",
      "Mihajlo Systems. Eine Landingpage ab 99 *Euro* im Monat. Kommentieren Sie *WEBSITE*.", "zeppelin_end", "landing",
      "Stellen Sie sich vor: Sie mieten einen Zeppelin, nur damit die Stadt Ihren Namen sieht. 🎈",
      "Große Werbung ist laut, teuer und am nächsten Tag vorbei. Eine Website ist jeden Tag da, genau dann, wenn jemand einen Maler, Elektriker oder Dachdecker in seiner Nähe sucht.",
      "Kennen Sie einen Handwerker, der zu viel für Werbung zahlt? Schicken Sie ihm das Video. 🎨",
      ["#maler", "#handwerk", "#hannover", "#webdesign", "#kleinunternehmen"], "Was hatte Lena wohl, was Klaus nicht hatte? 🎨",
      "Kino-Comic, Look cinema, Tag, goldenes Licht. Bild 0: riesiger Zeppelin schiebt sich vor die Sonne, Schatten über der Stadt, Schriftzug 'MALER KLAUS'. Bei 'winken' Leute auf der Straße winken, Kinder jubeln, Klaus im Overall stolz auf dem Balkon. Bei 'Rechnung' Briefträger, Umschlag, Klaus kippt mit dem Stuhl um (RUMMS), Zeppelin fliegt traurig davon. Bei 'Lena' Malerin im Overall pfeift, streicht entspannt eine Wand, ihr Kalender ist voll, auf dem Tisch ein Kerzenabendessen zu zweit als Preisvergleich. Kein Handy-Bildschirm. Bei 'Denn' Kamera taucht in Lenas Farbrolle, Weiß. zeppelin_end: Farbstreifen über die Leinwand, Filmtitel, Zeile 'LANDINGPAGE AB 99 € IM MONAT'.")

video("2026-11-04-3", "Geschichte: Einbrecher wollen nur einen Gutschein (Gutscheinshop)", "cinema", "phonk", "Zwei Uhr nachts. *Einbruch*.", "Der *Gutschein*-Einbruch", "Einbruch für einen Gutschein",
      "Zwei Uhr nachts. Zwei *Einbrecher* knacken die Tür einer Parfümerie. Der Alarm schrillt, die Polizei stürmt rein. Taschenlampen auf die beiden. Die halten nur einen Zettel hoch: Wir wollten doch nur einen *Gutschein* kaufen, tagsüber haben wir keine Zeit. Am nächsten Morgen hängt ein neues Schild an der Tür. Denn ab jetzt verkaufte die Parfümerie…", "h_einbruch",
      "Mihajlo Systems. Gutscheine rund um die *Uhr*, im eigenen Gutscheinshop. Kommentieren Sie *WEBSITE*.", "einbruch_end", "gutschein",
      "Stellen Sie sich vor: Zwei Uhr nachts brechen zwei Männer in Ihren Laden ein, nur um einen Gutschein zu kaufen. 🔦",
      "Ihre Kunden arbeiten tagsüber, wenn Ihr Laden offen hat. Mit einem Gutscheinshop auf Ihrer Website kaufen sie Gutscheine, wann es ihnen passt, und niemand muss nachts an Ihrer Tür rütteln.",
      "Kennen Sie einen Laden, der nachts Gutscheine verkaufen sollte? Schicken Sie ihm das Video. 🎁",
      ["#gutschein", "#einzelhandel", "#berlin", "#parfuemerie", "#website"], "Was stand wohl auf dem neuen Schild? 🔦",
      "Kino-Comic im Krimi-Stil, Look cinema, Nacht, Mond, Straßenlaterne. Bild 0: Dietrich knackt Schloss (KLICK), zwei Comic-Einbrecher mit Ringelpullis und Augenmasken. Bei 'Alarm' rotes Blinklicht, Sirene, Polizisten stürmen rein, Taschenlampenkegel. Bei 'Zettel' Einbrecher heben Zettel 'NUR 1 GUTSCHEIN BITTE', Polizisten verwirrt. Bei 'Morgen' Tageslicht, Inhaberin hängt Schild an die Tür (Text nicht lesbar, nur Rückseite oder unscharf). Comic, nichts Gewaltsames, kein Handy. Bei 'Denn' Kamera taucht ins Schild, Weiß. einbruch_end: Gutscheinkarte mit Schleife, Mond, Filmtitel, Zeile 'GUTSCHEINE RUND UM DIE UHR'.")

# ---------- Do 05.11. ----------
video("2026-11-05-1", "Geschichte: Kellner schreibt Reservierungen auf seinen Körper (Online-Reservierung)", "story", "drive", "Reservierungen auf dem *Arm*", "Voll *tätowiert* mit Namen", "Kellner Paul und die Reservierungen",
      "Kellner Paul nimmt jede Reservierung per Zuruf an. Er schreibt sie auf seinen *Arm*. Dann aufs Bein. Dann auf die Glatze vom Koch. Am Samstag steht er da, voller Namen, und findet den Tisch für zwölf *nicht*. Zwölf hungrige Gäste schauen ihn an. Nebenan stimmt jede Reservierung auf die *Minute*. Denn dort reservierten die Gäste…", "h_reserv",
      "Mihajlo Systems. Selbst, über eine Online-*Terminbuchung*. Kommentieren Sie *WEBSITE*.", "reserv_end", "termin",
      "Stellen Sie sich vor: Ihr Kellner schreibt jede Reservierung auf seinen Arm, sein Bein und die Glatze vom Koch. 🖊️",
      "Reservierungen per Zuruf, Zettel oder Telefon gehen verloren. Wenn Gäste online selbst reservieren, steht alles sauber im Kalender, und am Samstagabend sitzt jeder an seinem Tisch.",
      "Kennen Sie ein Restaurant, in dem Reservierungen verloren gehen? Schicken Sie ihm das Video. 🍽️",
      ["#restaurant", "#reservierung", "#hannover", "#gastronomie", "#digitalisierung"], "Wo stand wohl der Tisch für zwölf? 🖊️",
      "Comic, Look story, Restaurant. Bild 0: Kugelschreiber kritzelt auf Pauls Unterarm 'Müller 4P 19 Uhr' (KRITZEL). Bei 'Bein' Hosenbein hoch, weitere Namen, bei 'Glatze' Koch mit Kochmütze ab, Namen auf der Glatze, Koch schaut sauer. Bei 'Samstag' Paul voller Kritzeleien wie ein Tattoo, dreht sich im Kreis, sucht hektisch. Bei 'zwölf' zwölf Gäste stehen mit verschränkten Armen vor ihm, Magen knurrt (GRRR). Bei 'Nebenan' Schwenk: gepflegter Tisch mit Kärtchen 'reserviert', Gäste nehmen Platz, Kellnerin lächelt. Kein Handy-Bildschirm. Bei 'Denn' Kamera taucht ins Reserviert-Kärtchen, Weiß. reserv_end: Tischkarte 'reserviert', Filmtitel, Zeile 'ONLINE RESERVIEREN'.")

video("2026-11-05-2", "Geschichte: Ritter steht drei Jahre vor der Burg (Kontakt-Knopf)", "story", "cinematic", "Drei Jahre vor der *Burg*", "Der *höfliche* Ritter", "Ritter Kunibert vor der Burg",
      "Ritter Kunibert steht seit drei *Jahren* vor einer Burg. Er will nicht angreifen. Er will nur fragen, ob sie Pferde beschlagen. Aber es gibt kein Tor, keine Glocke, kein Schild. Er klopft, er ruft, er schießt höflich einen *Brief* über die Mauer. Bei der Schmiede nebenan steht er nach fünf Minuten *drin*. Denn die Schmiede hatte ganz vorne…", "h_ritter",
      "Mihajlo Systems. Einen *Knopf* zum Anrufen, auf ihrer Website. Kommentieren Sie *WEBSITE*.", "ritter_end", "kontakt",
      "Stellen Sie sich vor: Ein Ritter steht drei Jahre vor Ihrer Burg und will nur eine Frage stellen. 🏰",
      "Viele Websites verstecken Telefonnummer und Kontakt im Kleingedruckten. Wer Sie anfragen will, sollte das in einer Sekunde können, mit einem Knopf zum Anrufen und einem kurzen Formular ganz oben.",
      "Kennen Sie eine Website, bei der man den Kontakt nicht findet? Schicken Sie das Video weiter. 🏰",
      ["#webdesign", "#handwerk", "#braunschweig", "#kleinunternehmen", "#website"], "Was stand wohl ganz vorne an der Schmiede? 🏰",
      "Comic, Look story, Mittelalter, sonnig, Wiese. Bild 0: Ritter in Rüstung mit Spinnweben und langem Bart vor einer Burgmauer ohne Tor, Kalenderblätter fliegen (3 JAHRE). Bei 'angreifen' Ritter schüttelt Kopf, hält Hufeisen hoch. Bei 'klopft' KLOPF KLOPF an Stein, 'ruft' Sprechblase 'Hallooo?', 'Brief' kleine Armbrust schießt höflich einen Brief mit Siegel über die Mauer, Brief kommt zurückgesegelt. Bei 'Schmiede' Schwenk zur Schmiede mit großer Glocke am Eingang und Schild, Ritter sitzt drinnen mit Tee, Pferd bekommt Hufeisen. Comic, keine Gewalt. Bei 'Denn' Kamera taucht in die Glocke, Weiß. ritter_end: Wappen, Filmtitel, Zeile 'KONTAKT IN EINER SEKUNDE'.")

video("2026-11-05-3", "Geschichte: Dachdecker schießt Flyer mit einer Kanone (Website statt Flyer)", "story", "trap", "Er schießt *Flyer* mit einer Kanone", "Die *Flyer*-Kanone", "Dachdecker Franz und die Kanone",
      "Dachdecker Franz hat eine *Kanone* gebaut. Jeden Morgen schießt er tausend Flyer über die Stadt. Sie landen im Teich, auf dem Grill, auf einem *Polizisten*. Angerufen hat noch nie jemand. Jetzt rostet die Kanone im Garten, und sein Telefon klingelt trotzdem. Denn wer heute einen Dachdecker sucht, landet…", "h_kanone",
      "Mihajlo Systems. Direkt auf seiner *Website*. Kommentieren Sie *WEBSITE*.", "kanone_end", "landing",
      "Stellen Sie sich vor: Ein Dachdecker schießt jeden Morgen tausend Flyer mit einer Kanone über die Stadt. 💥",
      "Flyer landen im Briefkasten, im Altpapier oder im Teich. Wer einen Dachdecker, Maler oder Elektriker braucht, sucht ihn heute bei Google. Wer dann eine gute Website hat, bekommt den Anruf.",
      "Kennen Sie einen Handwerker, der noch Flyer verteilt? Schicken Sie ihm das Video. 📩",
      ["#dachdecker", "#handwerk", "#berlin", "#webdesign", "#website"], "Wo ist wohl der beste Flyer gelandet? 💥",
      "Comic im Panzer-Stil (h_tank), Look story, Morgen, Dächer. Bild 0: Kanone auf dem Hausdach feuert (BUMM!), Rauch, tausend Flyer explodieren wie Konfetti über der Stadt. Bei 'Teich' Flyer auf Enten, 'Grill' Flyer brennt auf Würstchen, 'Polizisten' Flyer klebt im Gesicht eines Polizisten, Pfeife (TRILLER). Bei 'Angerufen' Franz neben stummem Telefon, Grille zirpt. Bei 'rostet' Kanone mit Rost und Blumen im Rohr, Franz auf dem Dach bei der Arbeit, aus dem Haus klingelt es (RRRING). Comic, niemand wird verletzt. Kein Handy-Bildschirm. Bei 'landet' Kamera fliegt mit einem letzten Flyer durch die Luft und taucht in ihn hinein, Weiß. kanone_end: Kanonenrohr mit Blume, Filmtitel, Zeile 'GEFUNDEN STATT GEFLYERT'.")

# ---------- Fr 06.11. ----------
video("2026-11-06-1", "Geschichte: Schlüsseldienst schläft mit dem Telefon am Ohr (KI-Chatbot)", "cinema", "house", "Drei Uhr: *Nur eine Frage*", "Schlafen mit *Telefon*", "Herr Meier schläft mit dem Telefon",
      "Schlüsseldienst Meier schläft seit Jahren mit dem Telefon am *Ohr*. Drei Uhr: Was kostet das? Vier Uhr: Haben Sie morgen Zeit? Fünf Uhr: Nur eine *Frage*. Seine Frau zieht ins Gästezimmer. Heute schläft Meier durch, und morgens sind alle Fragen schon *beantwortet*. Denn nachts antwortete jetzt…", "h_schluessel",
      "Mihajlo Systems. Ein KI-Chatbot auf seiner *Website*. Kommentieren Sie *WEBSITE*.", "schluessel_end", "chatbot",
      "Stellen Sie sich vor: Sie schlafen seit Jahren mit dem Telefon am Ohr, weil nachts immer jemand eine Frage hat. 📞",
      "Gerade Notdienste und Handwerker bekommen nachts Fragen zu Preisen, Terminen und Anfahrt. Ein KI-Chatbot auf Ihrer Website beantwortet die Standardfragen, und Sie rufen morgens nur noch die echten Aufträge zurück.",
      "Kennen Sie jemanden, der nachts nie Ruhe hat? Schicken Sie ihm das Video. 🌙",
      ["#schluesseldienst", "#handwerk", "#hannover", "#kichatbot", "#selbstständig"], "Wer hat wohl nachts geantwortet? 🌙",
      "Kino-Comic, Look cinema, Schlafzimmer bei Nacht, Mondlicht. Bild 0: Wecker 03:00 knallt, altes Telefon klingelt neben dem Kissen (RRRING), Herr Meier mit Schlafmütze schreckt hoch, Hörer am Ohr festgeklebt. Bei 'Vier/Fünf Uhr' Uhr springt, Sprechblasen aus dem Hörer werden größer, Augenringe wachsen. Bei 'Gästezimmer' Frau mit Kissen unter dem Arm stapft raus, Tür knallt. Bei 'Heute' Meier schläft wie ein Baby, Telefon in der Schublade, Morgensonne, er streckt sich, auf dem Tisch ein Stapel Zettel mit Häkchen. Kein Handy-Bildschirm. Bei 'Denn' Kamera taucht in den Mond am Fenster, Weiß. schluessel_end: Schlüsselbund glitzert im Mondlicht, Filmtitel, Zeile 'IHR KI-CHATBOT FÜR DIE NACHT'.")

video("2026-11-06-2", "Geschichte: Pirat versteckt sein Fischbrötchen (Google Maps)", "story", "drive", "Der *Schatz* des Kapitäns", "Der *Fischbrötchen*-Schatz", "Kapitän Blaubarts Schatz",
      "Kapitän Blaubart versteckt seinen Schatz: das beste *Fischbrötchen* im Hafen. Die Karte dazu zeichnet er so geheim, dass kein Mensch sie lesen kann. Matrosen graben die ganze Insel um. Niemand findet die *Bude*. Dann steht da plötzlich eine Schlange bis zum *Leuchtturm*. Denn Blaubart hatte sein Kreuz…", "h_pirat",
      "Mihajlo Systems. Bei Google Maps *gesetzt*, mit eigener Website. Kommentieren Sie *WEBSITE*.", "pirat_end", "maps",
      "Stellen Sie sich vor: Sie verkaufen das beste Fischbrötchen im Hafen, und keiner findet Ihre Bude. 🏴‍☠️",
      "Viele Läden, Imbisse und Cafés verstecken sich, ohne es zu wissen: kein Eintrag bei Google Maps, keine Öffnungszeiten, keine Fotos. Mit einem guten Eintrag und einer eigenen Website finden Kunden Sie in Sekunden.",
      "Kennen Sie einen Imbiss, den keiner findet? Schicken Sie ihm das Video. 🏴‍☠️",
      ["#imbiss", "#googlemaps", "#braunschweig", "#gastronomie", "#website"], "Wo hat Blaubart sein Kreuz wohl gesetzt? 🏴‍☠️",
      "Comic, Look story, Hafen, Piratenschiff, Möwen. Bild 0: Schatzkiste klappt auf (KNARZ), goldenes Licht, darin ein riesiges Fischbrötchen. Bei 'Karte' Pergament mit wirren Linien, Spiralen, X an fünf Stellen, Matrosen drehen die Karte im Kreis. Bei 'graben' Matrosen buddeln Löcher, ganze Insel wie Käse. Bei 'Bude' kleine Fischbude mit Schild 'BLAUBART' hinter einer Düne, leer. Bei 'Leuchtturm' Schlange von der Bude bis zum Leuchtturm, Möwen klauen Brötchen. Kein Handy-Bildschirm. Bei 'Denn' Kamera taucht ins X auf der Karte, Weiß. pirat_end: Pergament, rotes X, Filmtitel, Zeile 'BEI GOOGLE MAPS GEFUNDEN'.")

video("2026-11-06-3", "Geschichte: Imbiss-Krieg mit Ketchup und Senf (Stempelkarte in der Wallet)", "story", "phonk", "Zwei Imbisse, eine Straße, *Krieg*", "Der *Ketchup*-Krieg", "Der Ketchup-Krieg",
      "Zwei Imbisse, eine Straße, *Krieg*. Links feuert Bruno mit der Ketchup-*Kanone*, rechts schießt Karl mit Senf. Die Kunden ducken sich und rennen zum dritten Imbiss am Ende der Straße. Der hat keine Kanone, aber jeden Tag dieselben *Stammgäste*. Denn der dritte Imbiss hatte…", "h_imbiss",
      "Mihajlo Systems. Eine Stempelkarte in der *Wallet*, mit dem Bestellsystem. Kommentieren Sie *WEBSITE*.", "imbiss_end", "wallet",
      "Stellen Sie sich vor: Zwei Imbisse beschießen sich mit Ketchup und Senf, und der dritte gewinnt. 🌭",
      "Kunden kommen wieder, wenn sich Treue lohnt. Eine digitale Stempelkarte in Apple Wallet und Google Wallet erinnert Ihre Gäste an Sie und bringt sie zurück, ohne dass Sie um jeden Kunden kämpfen müssen.",
      "Kennen Sie zwei Imbisse, die sich bekriegen? Schicken Sie ihnen das Video. 🌭",
      ["#imbiss", "#gastronomie", "#hannover", "#stammkunden", "#digitalisierung"], "Was hatte der dritte Imbiss wohl, was die anderen nicht hatten? 🌭",
      "Comic im Panzer-Stil, Look story, Straße mit drei Imbissbuden. Bild 0: Ketchup-Kanone feuert (SPLATSCH!), roter Strahl quer über die Straße, Senf-Gegenangriff in Gelb, Kunden ducken sich mit Pommesschalen über dem Kopf. Bei 'Kanone' Bruno mit Stahlhelm aus Pommesschale, Karl mit Senftuben-Bazooka, beide Comic. Bei 'rennen' Kunden flüchten zur dritten Bude 'IMBISS ANNA' am Ende der Straße. Bei 'Stammgäste' dieselben Gesichter jeden Tag, Kalender blättert, alle grüßen Anna. Nur Ketchup, kein Blut, keine echten Waffen. Kein Handy-Bildschirm. Bei 'Denn' Kamera taucht in Annas Theke, Weiß. imbiss_end: zehn goldene Stempel, Filmtitel, Zeile 'STEMPELKARTE IN DER WALLET'.")

def check(v):
    c = v["caption"]; n = len(c); tags = re.findall(r"#\w+", c); say = " ".join(s["say"] for s in v["segments"])
    w = len(say.replace("*", "").split())
    errs = []
    if not 1100 <= n <= 1500: errs.append(f"Caption {n}")
    if len(tags) != 5: errs.append(f"{len(tags)} Hashtags")
    if re.search(r"[–—]", json.dumps(v, ensure_ascii=False)): errs.append("Gedankenstrich")
    if "goslar" in json.dumps(v, ensure_ascii=False).lower(): errs.append("Goslar")
    if re.search(r"\b(du|dein|deine|dich|dir)\b", say.replace("*", ""), re.I): errs.append("Du-Form")
    story = v["segments"][0]["say"].lower()
    for bad in ["website", "online", "handy", "app ", "google", "internet", "qr", "ipad", "chatbot", "netz"]:
        if bad in story: errs.append("Technikwort vor dem Schnitt: " + bad)
    if not 40 <= w <= 85: errs.append(f"{w} Wörter")
    return n, w, errs

if __name__ == "__main__":
    only = set(sys.argv[1:]); bad = 0
    for v in V:
        n, w, errs = check(v)
        print(v["id"], v["look"], v["music"], f"Caption {n}", f"{w} Wörter", "FEHLER: " + ", ".join(errs) if errs else "ok")
        bad += bool(errs)
        if errs or (only and v["id"] not in only): continue
        d = os.path.join(ROOT, "work", v["id"]); os.makedirs(d, exist_ok=True)
        json.dump(v, open(os.path.join(d, "job.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(V), "Videos,", bad, "mit Fehlern")
