# Was der Reel-Agent gelernt hat

- 22.10.2026: Whisper bekommt nur einen kurzen Wortschatz-Prompt, nie den ganzen Sprechtext (sonst überspringt es den Anfang und wiederholt das Ende).
- 22.10.2026: Phrasen höchstens 860 px breit, sonst ragt der Text bei Schräg-Effekten aus dem Bild.
- Bauzeit pro Video etwa 3 Minuten (Render 2 Minuten mit 3 parallelen Seiten).

## 23.10.2026
- Lange Captions (Kugel-Post, 1.400 Zeichen, Ich-Form, Google-Bewertungen, Preis, Signatur) liefen deutlich besser als kurze. Ab Woche 1 alle Captions lang (`plan/lange_captions.py`). Hinweis: der Kugel-Post wurde auch beworben, die Aufrufe sind also nicht nur organisch.
- Facebook-Upload braucht eine Identitätsbestätigung in der Facebook-App. Fehler in einem Zweig dürfen nie den ganzen Ablauf scheitern lassen, sonst wiederholt Make und postet auf Instagram mehrfach (am 23.10. dreimal). Alle Module haben jetzt einen Ignore-Fehlerpfad.
- Preis-Szene zeigte immer erst den Monatspreis und drehte dann auf den Festpreis. Wurde der Festpreis zuerst gesprochen, passte das Bild nicht zur Stimme (19:30-Post am 23.10.). Seit 23.10. liest die Szene die Reihenfolge aus den Wortzeiten und dreht genau vor der zweiten Zahl.
- Mihajlo: alle Videos sahen gleich aus (eine Schrift, weiche Verläufe, gleiche lila Schluss-Szene). Seit 23.10. 6 Looks mit eigener Schrift, eigenem Hintergrund, eigenen Untertiteln und eigenem Schluss, verteilt mit `plan/looks.py`.
- 23.10.: Mihajlo will „aus Goslar“ nie mehr in Reels sehen. Entfernt aus Stimme (herausgeschnitten mit `engine/cut_words.py`, ohne neue Vertonung), Bild, Captions und Hashtags; `build.py` und `lange_captions.py` prüfen das jetzt.

## 28.10.2026: Umstellung auf 1 Reel pro Tag
- Mihajlo (27.10.): nur noch 1 Reel pro Tag, Uhrzeit nach Wochentag (Mo 12:00, Di 11:30, Mi 12:00, Do 09:30, Fr 11:00, Sa 10:00, So 18:30). Begründung: lieber ein starkes, sorgfältig gebautes Geschichten-Reel als drei schnelle (Qualität, ElevenLabs-Credits, Make-Operationen); Mittagspause unter der Woche, Sonntagabend am Wochenende. Nach zwei Wochen Insights je Uhrzeit vergleichen.
- Make kann pro Szenario nur eine Uhrzeit. Lösung: je Uhrzeit ein Szenario mit Wochentag-Plan (12:00 deckt Mo und Mi ab), alle lesen `<heute>/slot1.json`. Uhrzeit ändern heißt: Make UND `ZEITEN` in publish.py.
- Alte Erklär-Reels vom 28. bis 30.10. waren schon nicht mehr auf gh-pages (404), standen aber noch in `log/posted.jsonl`. Dadurch hätte publish.py das neue Reel mit derselben ID nie protokolliert. Nie gepostete Einträge aus dem Protokoll löschen, wenn Reels zurückgezogen werden.
- Frischer Container: `engine/hooks/kunden/` ist gitignored, reel.html lädt aber `hooks/kunden/index.js`, Render brach ab. build.py legt jetzt eine leere Datei an. Whisper (`faster-whisper`) war nicht installiert: `pip install faster-whisper` (Modell small lädt automatisch).
- Geschichten-Reels: eine Hook-Szene trägt die ganze Geschichte (Zeiten aus den Wörtern), dann `*_end` mit `"tr": "cut"`. Untertitel unten (`capY` 1530 bis 1560) in die leere Straßenfläche legen, sonst verdecken sie die Figuren. Figuren erst ab Kamera-Zoom ca. 1,3 groß genug.
- Kontaktbogen (check.py) zeigt bei 2 Szenen nur 6 Bilder. Für die Pflicht von 12+ Bildern eigene Einzelbilder ziehen (18 gleichmäßig verteilt plus gezielt die Sprechblasen-Momente).
- Blitz auf Bild 0 macht das erste Bild blass. Der Einstieg muss satt sein, Blitz erst kurz danach und schwach.
- Kino-Look zeigt den Text-Hook oben, solange Szene 1 läuft, bei Geschichten also 20 s. Neues Feld `hook_until` (Sekunden) im Job begrenzt das.

## 30.10.2026: Feedback Mihajlo zur ersten Geschichten-Woche
- Gut: Mitternacht (klare Brücke: alles zu → Gutscheinshop). Okay: Salon, Pfeil, Suchscheinwerfer.
- Schlecht: Bäcker mit Luftballons („maximal Slop“, Look neon billig, Ballon platzt → Landingpage passt nicht), Hund mit Schild („dumm“, Brücke zum Chatbot schwach). Bananen (Obstmann → Bestellsystem) aus demselben Grund vor dem Posten ersetzt.
- Zahlen (Instagram, 30.10. morgens): 43.380 Aufrufe in 30 Tagen, 43 Follower, Bäcker trotzdem 870 Aufrufe, 6 Likes, 2 geteilt.
- Panzer- und andere „makabre“ Comic-Motive sind wieder erlaubt (Panzer-Reel hatte 6.210 Aufrufe, die meisten).
- Meta Verified (Business) ab 30.10. 7 Tage im Test.

## 01.11.2026: Comic-Geschichten beendet
- Mihajlo: Geschichten sind „maximal Slop“, Aufrufe „peinlich“, die gleiche Schluss-Animation jedes Mal fällt auf. Ab 04.11. Motion Design (Premium, 3D-Handy, Terminal, Glas-Karten), Ads-Stimme schnell, alles Sichtbare wird gesprochen, wechselnde Schlüsse.
- Zahlen aus dem Raster (30.10.): alte Erklär-Reels Woche 1 nur 149 bis 511 Aufrufe, Geschichten 870 bis 1.463, Panzer 6.210, Seifenblase rund 5.000 (beworben). Ein Muster im alten Engine-Stil (kleine Grafiken, viel Leerraum) sah aus wie Woche 1, darum erst die Engine aufwerten.
- Mint klingt auch mit Tempo 1,15 plus atempo 1,18 noch langsam (60 Wörter in 30 s), weil die Trailer-Stimme Pausen macht.

## 13.11.2026: Mihajlo stoppt die Reels
- Urteil: „absolut schlecht“, „KI-Slop“. Higgsfield-Stimme („Ainsley“) klingt nicht wie die ElevenLabs-Ads-Stimme und ist zu langsam. Alles wirkt gleich, keine schönen Übergänge, die neue Remotion-Vorlage wurde gar nicht benutzt.
- Folge: täglicher Lauf deaktiviert, Sa 14.11. aus der Warteschlange genommen (liegt in `work/_gestoppt/`).
- Beim Neustart: nur mit der echten Ads-Stimme, schnelles Tempo, Remotion mit echten Clips und richtigen Übergängen, jedes Reel sichtbar anders. Erst ein Muster zeigen und Mihajlos Okay holen, dann erst Serie.
