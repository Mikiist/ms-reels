# ms-reels

Automatische Reels für Mihajlo Systems (Instagram und Facebook, 1 pro Tag).

- `engine/`: Video-Engine (HTML/Canvas-Animation, Playwright-Render, synthetische Musik und Effekte, Mix mit ffmpeg).
- `CLAUDE.md`: Anleitung für den täglichen Claude-Agenten.
- `FAKTEN.md`, `THEMEN.md`, `SZENEN.md`: Regeln, Themen, Szenen.
- `log/posted.jsonl`: was gepostet wurde.
- Branch `gh-pages`: die Videos des Tages und `queue.json` (GitHub Pages). Make holt dort die Posts ab.

Schriften: Inter (SIL Open Font License, `engine/fonts`).

## Make (Posten)
Seit 28.10.2026 ein Reel pro Tag. Sechs Szenarien in Make (Team 2425044, Zeitzone Europe/Berlin), je Uhrzeit eins mit Wochentag-Plan:
`Reels | Mo + Mi 12:00` (10027498), `Reels | Di 11:30` (10027503), `Reels | Do 09:30` (10027504),
`Reels | Fr 11:00` (10055922), `Reels | Sa 10:00` (10055923), `Reels | So 18:30` (10055925).
Alle holen `https://mikiist.github.io/ms-reels/<heute>/slot1.json`. Nur wenn die Datei da ist und `date` = heute,
postet es auf Instagram @mihajlo.systems (Reel + erster Kommentar) und auf die Facebook-Seite Mihajlo Systems.
Fehlt die Datei, passiert nichts. Verbindung „Mihajlo Systems Social“ (Instagram 14691190, Facebook-Seite 14691191).
Uhrzeit ändern: Make-Szenario UND `ZEITEN` in `engine/publish.py` anpassen.
