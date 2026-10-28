# Szenen-Bibliothek der Reel-Engine

Jedes Segment in `job.json` bekommt genau eine Szene. Die Szene läuft, solange das Segment gesprochen wird. Der gesprochene Text erscheint automatisch Wort für Wort (kinetisch, wechselnde Effekte). `zone` sagt, wo der Text steht, die Grafik nimmt den Rest.

Optionale Felder je Szene: `pal` (Farbwelt), `tr` (Übergang hinein), `bgv` (Hintergrundmuster 0 bis 4). Ohne Angabe wählt die Engine selbst und sorgt dafür, dass zwei Szenen nacheinander nie dieselbe Farbwelt haben.

Farbwelten: `night`, `offwhite`, `crimson`, `navy`, `electric`, `cream`, `gold`, `mint`, `violet`, `sky`, `black`, `sunset`.
Übergänge: `zoom`, `slide_up`, `iris`, `slide_left`, `flash`, `diag`, `split`, `spin`, `push_down`, `blur`.

| Typ | Wofür | Text | Parameter (alle optional) |
|---|---|---|---|
| `hook_countdown` | Hook: Browser lädt, 3, 2, 1, zersplittert, „WEG.“ | unten | `n` (Zahl Countdown, 3), `label` („Besucher wartet“), `url`, `boom` („WEG.“) |
| `alarm` | Hook oder Problem: Warndreieck, Glitch, Sirene | unten | `title` (groß, z. B. „ZU LANGSAM“), `sub` |
| `statement` | Reine Aussage, große Schrift mittig | Mitte | `big` (riesiges Kontur-Wort im Hintergrund, z. B. „?“ oder „2014“) |
| `cross_list` | Fehler/Ausreden werden durchgestrichen | oben | `items` (2 bis 5 kurze Texte) |
| `checklist` | Lösung/Tipps werden abgehakt | oben | `items` (2 bis 5), `title`, `stamp` (z. B. „Fertig“) |
| `versus` | Zwei Wege: links schlecht, rechts gut | oben | `left` [Titel, Text], `right` [Titel, Text] |
| `phone_notifs` | Anfragen prasseln aufs Handy | oben | `items` [[Titel, Untertitel], …], `count` (3 bis 9), `day` |
| `google_search` | Suche wird getippt, Ihr Betrieb rutscht nach oben | oben | `query` („Friseur Goslar“), `result`, `url`, `badge` („Ganz oben“), `others` |
| `map_pin` | Pin fällt auf die Karte, Karte mit Name | oben | `title`, `place`, `cta` („Route“) |
| `before_after` | Alte Website wird zur neuen gewischt | oben | `headline` (neue Seite), `url`, `old_url`, `sticker` („NEU“) |
| `speed` | Tacho schnellt hoch, Blitz | oben | `score` (Standard 97), `label` |
| `chat` | KI-Chatbot antwortet nachts | oben | `messages` [["kunde", Text], ["bot", Text], …], `clock` („23:47“), `botname` |
| `clock` | Zeit läuft (Feierabend, nachts) | oben | `from`, `to` (Stunden, z. B. 18 und 23.5), `label` |
| `bars` | Balken wachsen, Pfeil nach oben (ohne Zahlen) | oben | `labels` (5 Monate o. ä.), `title` |
| `big_number` | Große Zahl mit Ring. NUR Zahlen aus FAKTEN.md oder echte Rechnung | oben | `value`, `prefix`, `suffix`, `decimals`, `label`, `source` |
| `price` | Preis: Monat, Karte dreht auf Festpreis, „… € gespart“ | oben | `paket` (`landingpage`, `business`, `professional`), `only` (`monat` oder `fest`) |
| `stars` | 4,8 Sterne, 19 Google-Bewertungen, echtes Zitat | oben | `no_quote` (true = ohne Zitat) |
| `logo` | Logo-Drop mit Schockwelle (Musik-Drop!) | unten | `tagline` |
| `cursor_click` | Cursor klickt Button, Konfetti, „Anfrage gesendet“ | oben | `button`, `done` |
| `cta` | Schluss: Kommentarfeld tippt Stichwort, Button, Logo, URL | oben | `keyword` („WEBSITE“), `button` |

Hinweise
- Szenen unter etwa 1,8 Sekunden wirken hektisch: Segmente mit mindestens 6 Wörtern, Hook darf kürzer sein.
- Die Szene mit `logo` ist der Musik-Drop. Ohne `logo` liegt der Drop auf Szene 3.
- Preise, Sterne und Zitat kommen fest aus der Engine (`engine/engine.js`, `FACTS`). Nie andere Zahlen in Parametern erfinden.


## Looks (seit 23.10.2026)
Jedes Video hat einen Look (`"look"` in `job.json`, verteilt mit `plan/looks.py`). Der Look ändert Schrift, Hintergrund, Farbwelten, Untertitel, Wort-Animation, Effekte und die Schluss-Szene. Hook-Szenen (`h_*`) behalten ihre eigenen Farben.

| Look | Schrift | Hintergrund | Untertitel | Schluss (cta) | Extra |
|---|---|---|---|---|---|
| brutal | Anton, Großbuchstaben | Vollfarbe Schwarz/Gelb/Rot/Weiß, Rahmen | Wörter in harten Kästen, Schnitt-Animation | Riesiges Stichwort mit Markerbalken | starker Zoom-Stoß auf Betonungen |
| neon | Unbounded | Synthwave-Gitterboden, Sonne | Leuchtschrift | Riesiges Stichwort | Scanlines, RGB-Versatz bei Treffern |
| editorial | Instrument Serif | Papier, Rasterpunkte, Linien | Serifen, Betonung kursiv rot | Kommentar-UI | ruhig, Magazin |
| pop | Archivo Black | Farbe wechselt bei jeder Zeile, Strahlen | Sticker mit Kontur und Schatten | Riesiges Stichwort | Pop-Animation |
| cinema | Bebas Neue, Großbuchstaben | Kino-Verlauf, Lichtfleck, Staub | breit gesperrt, gold betont | Riesiges Stichwort | Letterbox-Balken, Körnung |
| terminal | Space Mono | Code-Regen, Punktraster | Schreibmaschine mit „>“ | Kommentar-UI | Scanlines |
| clean | Syne | alter Stil (Verläufe) | wie bisher | Kommentar-UI | nur als Rückfall |

Regeln: Schrift auf Akzentflächen immer mit `inkOn(farbe)`, Schrift auf weißen Karten dunkel, nie `"#fff"` fest auf Hintergründen (Looks haben helle Farbwelten). Neue Szenen in mindestens brutal (hell und dunkel) und editorial prüfen.

## Objekt-Reels (seit 23.10.2026, Mihajlo: „so wie die Kugel, die ganze Zeit muss etwas passieren“)
Ein einziges physisches Ding trägt das ganze Video. 7 bis 8 Sekunden ohne Stimme, nur Bild und Geräusche, eine offene Frage oben (Zähler, „Wie viele …?“), Zeitlupe kurz vor der Auflösung, dann Stimme, Umbau, Auflösung, Schlusskarte. Look `objekt` (Creme-Studio, Kamera-HUD, kleine ruhige Untertitel, Klangfläche `music: "ambient"`, Schluss `card`), Stimme „Ads stimme“ `kJLuJl0MAmUoVyx3oDIT` wie im Seifenblasen-Video.
- `h_galton` (Galton-Brett): 34 Stahlkugeln klickern durch Messingstifte, Beinahe-Treffer in Zeitlupe, bei „Mensch“ werden Kugeln zu Personen, bei „schwach…“ Schilder an den Stiften, bei „Ich“ drehen die Stifte zu Schienen, alle Kugeln landen in „IHR BETRIEB“. VOICE_DELAY 8,5. Job: zwei Segmente (`h_galton` mit dem ganzen Text, dann `cta`). Beispiel `work/obj-galton/job.json`.

## Geschichten-Reels (seit 24.10.2026, Vorbild Mihajlo: QR-Codes auf Panzern)
Absurde Geschichte im Comic-Stil, ernst erzählt, ab Bild 0; das Bild steigert sich (immer mehr), die Pointe führt zur Website, danach Brücke zum Zuschauer, kurzes Angebot, Aufruf. Look `story`: Comic-Szene vorne, dann dunkler Agentur-Look mit Limettengrün, Untertitel als schwarze Wort-Schilder (`cs: "tag"`, im Hook unten bei 1210, sonst oben), Schluss `giant`. Stimme Mint.
- `h_van` (Klempner-Transporter): Aufkleber immer schneller (Wort „beklebt“ bis „Ecke“), dann Ampel, Boden, Klempner; Passanten fotografieren bei „Ampel“/„sahen“; „0 Anrufe“ bei „anriefen“; Blitzer bei „Blitzer“ mit Blitz und Scan-Strahl; Kamera taucht bei „Code“ in einen Code, QR-Wand mit Scan-Rahmen, Browser lädt bei „landet“, Seite mit „Jetzt anrufen“ und Klingeln bei „Website“. Parameter `url`, `label`. Beispiel `work/story-van/job.json`.
- Recht: Geschichte erkennbar erfunden (Comic, absurde Pointe), nie als echter Kunde ausgeben, kein „gebaut von Mihajlo Systems“ für eine erfundene Figur.
- `h_tank` (Panzer, wie das Taskless-Vorbild, eigene Zeichnung und eigener Text): Soldat beklebt den Panzer bis „Ecke“, Rückblende „VORHER“ bei „Weil“ mit drei Drohnen, Bomben und Comic-Explosionen bei „abgeschossen“ (Turm fliegt weg, keine Menschen getroffen), bei „Jetzt“ schwebt eine Drohne über dem beklebten Panzer und scannt, Kamera taucht bei „Code“ in die QR-Wand, Browser lädt mihajlostanojevic.com mit Logo bei „Website“. Beispiel `work/story-tank/job.json`.

## Marken-Enthüllung und Leistungen (24.10.2026)
- `reveal`: harter Schnitt auf „Mihajlo Systems“ (Weißblitz, Logo knallt rein, Buchstaben schlagen einzeln ein, Musik-Drop). Zeigt den Namen selbst groß, darum keine Untertitel (`nocap`). Darf ein Segment mit nur 2 Wörtern sein. Im Job `"tr": "cut"` setzen.
- `h_tank` mit `"reveal": true`: Satz endet auf „landeten sie auf…“, die Kamera taucht ab „landeten“ in den QR-Code und endet weiß. Danach `reveal`.
- `h_cafe` (Zwei Cafés, isometrische Mini-Stadt im Stil von Mihajlos Beispiel): Flug über die Stadt, Schilder CAFÉ 1/2 bei „gleiche“; Café 1 mit wartenden Gästen, Uhr und 😤 bei „ersten/warten/ewig“; Café 2 bei „zweiten“ mit QR/NFC-Aufsteller, Handy-Karte „Bestellen“ → „Bestellt ✓“ bei „Code/bestellt“; iPad-Karte „Bestellungen live“ mit Zeile „Tisch 4, 2 Cappuccino“ bei „iPad/Tisch“; Wallet-Karte 9 von 10 mit Apple/Google Wallet bei „Punkte/Wallet“; Rückflug mit 😴/🔥 bei „Welches“, am Ende Sturzflug und Weiß. Gesprochene Zahl „zwei Cappuccino“ und „Tisch vier“ müssen passen. Beispiel `work/2026-10-26-2/job.json`, Szene mit `capY: 300`.
- `h_resto` (Comic-Restaurant mit Sprechblasen): Teller knallt ab Bild 0 (BAM!), Gast brüllt „Das habe ich NIE bestellt!“ (bei „nie“) und „Ich will den CHEF!“, Chef kommt durch die Küchentür (zweites „Chef“), iPad-Karte bei „iPad“ mit Ticket „Tisch 7“ (bei „Tisch“), Zeilen bei „QR“ und „Handy“; Nahaufnahme knallrot bei „knallrot“; Treuekarte 9 → 10 bei „zehnter“, Banner „aufs Haus“ bei „Haus“, Gast strahlt; Montage mit Abreißkalender bei „Seitdem“; Kamera taucht bei „gebaut“ in den QR-Aufsteller, Weiß, dann `reveal`. Beispiel `work/2026-10-26-3/job.json`.
- `h_gast` (Anti-Werbung-Fassung, gleiches Restaurant, keine Technik): Teller knallt (BAM!), Gast brüllt „NIE bestellt!“ und „CHEF!“, Chef kommt ohne iPad (zweites „Chef“), beugt sich bei „flüstert“ zum Gast („psst…“), Gast knallrot (Schweiß, „…“), bei „isst“ sitzt er verlegen und isst, Chef geht; Montage mit Kalender bei „Seitdem“, Chef zwinkert, Kamera taucht ab „Denn“ in sein Gesicht, Weiß. Danach `reveal` und `resto_proof`.
- `resto_proof` (nach dem Schnitt): abgedunkeltes Restaurant, iPad-Karte „Tisch 7, von Ihrem Handy“ bei „zeigt“/„bestellt“, Treuekarte 10 von 10 bei „Treuepunkten“. Untertitel unten (`capY` 1240).
- `services`: Überschrift „VON A BIS Z“ (kommt bei „A“/„Z“), Kacheln springen auf, wenn ihr Wort fällt. Standard: Websites, Gutscheinshop, Bestellsystem (fürs Restaurant), KI-Chatbot. Eigene Liste: `items: [{k: web|gutschein|bestell|chatbot|termin, label, sub?, m: "regex-anfang"}]`.

## Geschichten-Baukasten (28.10.2026)
`engine/hooks/story_kit.js` stellt `SK` bereit: `SK.person(g, x, füße, maßstab, {hs, hair, shirt, pants, skirt, apron, scarf, beard, glasses, aL, aR, eL, eR, mouth, eyes, brow, red, walk, sit, flip, look, bob, hold})`, `SK.bubble` (Sprechblase, `shout`, `think`), `SK.pow` (BAM!), `SK.cam`/`SK.apply`/`SK.toScreen` (Kamera aus Schlüsselbildern), `SK.chair`, `SK.umbrella`, `SK.rain`, `SK.qmarks`, `SK.speedLines`, `SK.flashAt`, `SK.whiteOut`, `SK.finder` (Wortzeiten), `SK.endTitle` + `SK.endTimes` (ruhiger Filmtitel „Mihajlo Systems“, Angebotszeile, „Kommentieren Sie WEBSITE“).
- `h_salon` + `salon_end` (Terminbuchung): Schlange im Regen vor „Salon Jana“, Uhr 6:00, Streit um neun (ZOFF!, Sprechblasen), leere Straße, Herr Krause allein („Wo sind denn alle?“), Kundin geht um Punkt neun rein („Guten Morgen, Frau Weber!“), Fragezeichen, Tauchfahrt ins Türschild OFFEN. Schluss: Goldschrift auf der Salonscheibe. Wörter siehe Dateikopf. Job `plan/tage_2810.py`.
- `h_nacht` + `gift_end` (Gutscheinshop, Look cinema): Turmuhr 23:58, Mann rennt durch die Nacht, Denkblase Torte „MORGEN!“, NICHTS!, Blumenladen und Parfümerie zu, Rollläden KLONK, Bordstein, Blick zum dunklen „Studio Marie“, Lächeln; morgens Umschlag, „Ein ganzer Tag WELLNESS?!“, Umarmung. Schluss: Geschenkband gleitet auf, Filmtitel.
- `h_pfeil` + `pfeil_end` (Website + Google Maps): Holzpfeil knallt aufs Dach der „Tischlerei Jonas“ (BAM!), Maßlinie 12 m, Nachbarn lachen (HAHA!), Autos rasen vorbei, Lichterkette, Luftballons, „…nichts.“, Karte „1 WOCHE SPÄTER“, Pfeil weg, Hof voller Autos, Nachbarin „Wo ist Ihr Pfeil?“, Zwinkern. Schluss: Pfeil fällt auf den Filmtitel, Landkarten-Papier.
- Job-Feld `hook_until` (Sekunden): Text-Hook oben nur so lange zeigen (für Looks ohne `hideHook`).
