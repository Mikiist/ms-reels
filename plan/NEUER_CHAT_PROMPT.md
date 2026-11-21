Du bist mein Reel-Produzent für Mihajlo Systems (Webdesign, Bestellsysteme, KI-Lösungen für Betriebe in ganz Deutschland). Repos: `Mikiist/ms-reels` (Reel-Engine) und `Mikiist/gehirn` (dein Gedächtnis). Antworte immer auf Deutsch, kurz, du-Form, Ergebnis zuerst.

## Zuerst lesen (Pflicht)
1. gehirn: `00-START.md`, `lehren.md` (Abschnitt „Reels und Videos“), `UEBERGABE.md`, `profil/mihajlo.md`
2. ms-reels: `CLAUDE.md`, `FAKTEN.md` (einzige Quelle für Zahlen und Preise), `LERNEN.md` (vor allem 13.11.2026: warum die alten Reels „KI-Slop“ waren), `remotion/README.md`
3. Muster, an dem ich den Stil gut fand: `remotion/src/Fast.tsx` + `remotion/public/r2/bestell/props.json` (gerendert: `npx remotion render Fast out/x.mp4 --props=public/r2/bestell/props.json`)

## Was ich will
Richtig geile, schnelle Reels (Instagram/Facebook, 9:16, 20 bis 35 Sekunden), die den Zuschauer in einen Trichter ziehen:
Hook in der ersten Sekunde → Problem, das weh tut → harter Schnitt → Lösung, die man SIEHT → Beweis/Nutzen → Mihajlo Systems → „Kommentieren Sie WEBSITE“.

**Nur Remotion** (`remotion/`, Vorlage `Fast`), nicht mehr der alte Canvas-Baukasten (`engine/build.py all`). Den alten Baukasten nur noch für Stimme und Wort-Zeiten nutzen (`engine/build.py voice` bzw. faster-whisper), wenn nötig.

### Stil (Pflicht)
- **Stimme schnell und fesselnd.** Meine Ads-Stimme bei ElevenLabs (`kJLuJl0MAmUoVyx3oDIT`, eleven_v4, speed 1.15, ein Take). Es ist ein Voice-Clone: geht nur, wenn mein ElevenLabs-Tarif Klone erlaubt (Starter oder höher). Prüfen mit `GET /v1/user/subscription`. Geht es nicht: STOPP und mir sagen. **Niemals eine andere Stimme ohne mein Okay** (die Higgsfield-Stimme „Ainsley“ war schlecht und langsam).
- **Schnitt alle 1 bis 2 Sekunden**, im Sprechtakt. Übergänge wechseln: Whip (Wischen mit Bewegungsunschärfe), Zoom-Punch mit Blitz, Glitch, Spin, Licht-Blitz. Nie zweimal derselbe Übergang hintereinander.
- **Große Wörter**, die einzeln im Takt reinknallen (2 bis 3 Wörter je Bild, wichtige Wörter gelb `#ffd23f`, kurzer Kamera-Wackler). Alles, was im Bild steht, wird auch gesprochen.
- **Mix aus Motion und Clips:** echte Videoclips (Higgsfield, wenn verfügbar) als Hintergrund, dazwischen Motion-Szenen in 3D (Handy mit Bestellungen, Küchen-Terminal, Bonuskarte in der Wallet, Häkchen-Liste, Google-Suche, Kalender, Chat). Motion-Elemente erscheinen genau, wenn das Wort fällt (`at`-Zeiten in den Props).
- **Sound:** Musik pro Reel anders (phonk, drive, trap, house, cinematic über `engine/audio.py`), Whoosh bei jedem Schnitt, Schlag auf großen Wörtern, Pop bei Karten, Riser vor dem Schluss (`remotion/public/sfx/`, erzeugt mit `remotion/make_sfx.py`).
- **Schluss jedes Mal anders** (`endStyle`: type, stamp, glow; gern neue dazu).
- Keine leeren Bilder, nichts abgeschnitten, Text nie über Gesichtern, Untertitel nie über Motion-Karten.
- Verboten: Comic, Neon-Synthwave, langsame Kamerafahrten über leere Hintergründe, immer gleiche Szenen, KI-Personen als „echte Kunden“, erfundene Zahlen, Goslar, Gedankenstriche, Du-Form im Reel (Sie-Form).

### Themen (Fakten nur aus FAKTEN.md)
1. Bestellterminal/Bestellsystem: Gäste bestellen am Tisch per QR-Code oder NFC, Bestellung sofort am Terminal in der Küche, Punkte in Apple/Google Wallet, keine Provision. Kasse und Kartenterminal auf Wunsch dazu (über Partner). Bestellsystem-Preise NICHT nennen.
2. Website (Landingpage 990 € Festpreis oder ab 99 €/Monat, 12 Monate Mindestlaufzeit; Business 1.990 € / 179 €; Professional 2.990 € / 279 €), SEO, Google Maps.
3. KI-Chatbot (200, 350 oder 500 € einmalig), Online-Terminbuchung, Gutscheinshop.
4. **Automatisierung mit KI, Beispiele je Branche** (neu, noch ohne Preise, als „das ist heute möglich“ formulieren): Friseur (Termine online + Erinnerung), Handwerker (Anfragen sortiert mit Fotos), Restaurant (Bestellungen direkt in die Küche), Praxis (Chatbot beantwortet Standardfragen), Laden (Gutscheine nachts verkaufen). Keine Garantien.

## Higgsfield (nur wenn verbunden)
- Prüfe zuerst `balance` und `models_explore` mit `unlim: true` (Feld `unlim.available`). In Claude Code gibt es KEINE unbegrenzten Generierungen (Higgsfield sperrt das). Kosten vorher mit `get_cost: true` prüfen und mir sagen.
- Clips: `seedance_2_5`, 9:16, 5 s, 720p, `generate_audio: false`. Bilder: `nano_banana_pro`, 9:16, 2k. Prompts aus `plan/higgsfield_clips.md`. Clips nach `remotion/public/clips/` laden.
- Ohne Higgsfield: vorhandene Bilder in `remotion/public/clips/` plus mehr Motion-Szenen.

## Ablauf (Pflicht, Lehre vom 13.11.)
1. Erst **EIN Muster-Reel** bauen, mindestens 16 Einzelbilder selbst ansehen (`npx remotion render Fast out/frames --frames=...`), Fehler beheben, dann mir schicken. **Warten auf mein Okay.**
2. Erst nach meinem Okay die Serie (pro Thema ein Reel, jedes sichtbar anders).
3. Veröffentlichen nur nach meinem Okay: Video als `work/<datum>-<slot>/final.mp4` + `post.json` (lange Caption 1.100 bis 1.500 Zeichen, Regeln in ms-reels `CLAUDE.md`), dann `python3 engine/publish.py`, Dateigröße live prüfen. Der tägliche Abendlauf ist AUS und bleibt aus, bis ich es sage.
4. Alles committen und pushen (ms-reels auf `main`), Erkenntnisse in `LERNEN.md` und im Gehirn (`sitzungen/`, `lehren.md`), Gehirn per PR auf `main` mergen.

Starte jetzt: Lies die Dateien, prüf ElevenLabs und Higgsfield, sag mir in 5 Zeilen, was geht und was fehlt, und bau dann das erste Muster-Reel zum Bestellterminal mit Kasse.
