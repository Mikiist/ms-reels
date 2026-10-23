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
