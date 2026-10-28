# ms-reels

Automatische Reels für Mihajlo Systems (Instagram und Facebook, 1 pro Tag).

- `engine/`: Video-Engine (HTML/Canvas-Animation, Playwright-Render, synthetische Musik und Effekte, Mix mit ffmpeg).
- `CLAUDE.md`: Anleitung für den täglichen Claude-Agenten.
- `FAKTEN.md`, `THEMEN.md`, `SZENEN.md`: Regeln, Themen, Szenen.
- `log/posted.jsonl`: was gepostet wurde.
- Branch `gh-pages`: die Videos des Tages und `queue.json` (GitHub Pages). Make holt dort die Posts ab.

Schriften: Inter (SIL Open Font License, `engine/fonts`).

## Make (Posten)
Seit 29.10.2026 drei Reels pro Tag, jeden Tag. Drei Szenarien in Make (Team 2425044, Zeitzone Europe/Berlin), täglich:
`Reels | Slot 1 (07:30)` (10027498) liest `<heute>/slot1.json`, `Reels | Slot 2 (13:30)` (10027503) liest `slot2.json`, `Reels | Slot 3 (19:30)` (10027504) liest `slot3.json`.
Nur wenn die Datei da ist und `date` = heute, postet es auf Instagram @mihajlo.systems (Reel + erster Kommentar) und auf die Facebook-Seite Mihajlo Systems.
Fehlt die Datei, passiert nichts. Verbindung „Mihajlo Systems Social“ (Instagram 14691190, Facebook-Seite 14691191).
Uhrzeit ändern: Make-Szenario UND `SLOTS` in `engine/publish.py` anpassen.
Die Szenarien 10055922, 10055923 und 10055925 (Wochentags-Versuch vom 28.10.) sind deaktiviert, nicht löschen und nicht wieder aktivieren, sonst doppelte Posts.
