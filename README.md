# ms-reels

Automatische Reels für Mihajlo Systems (Instagram und Facebook, 3 pro Tag).

- `engine/`: Video-Engine (HTML/Canvas-Animation, Playwright-Render, synthetische Musik und Effekte, Mix mit ffmpeg).
- `CLAUDE.md`: Anleitung für den täglichen Claude-Agenten.
- `FAKTEN.md`, `THEMEN.md`, `SZENEN.md`: Regeln, Themen, Szenen.
- `log/posted.jsonl`: was gepostet wurde.
- Branch `gh-pages`: die Videos des Tages und `queue.json` (GitHub Pages). Make holt dort die Posts ab.

Schriften: Inter (SIL Open Font License, `engine/fonts`).

## Make (Posten)
Drei Szenarien in Make (Team 2425044, Zeitzone Europe/Berlin), täglich 07:30, 13:30, 19:30:
`Reels | Slot 1 (07:30)` (10027498), `Reels | Slot 2 (13:30)` (10027503), `Reels | Slot 3 (19:30)` (10027504).
Ablauf: holt `https://mikiist.github.io/ms-reels/<heute>/slot<N>.json`. Nur wenn die Datei da ist und `date` = heute,
postet es auf Instagram @mihajlo.systems (Reel + erster Kommentar) und auf die Facebook-Seite Mihajlo Systems.
Fehlt die Datei, passiert nichts. Verbindung „Mihajlo Systems Social“ (Instagram 14691190, Facebook-Seite 14691191).
