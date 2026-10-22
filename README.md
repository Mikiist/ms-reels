# ms-reels

Automatische Reels für Mihajlo Systems (Instagram und Facebook, 3 pro Tag).

- `engine/`: Video-Engine (HTML/Canvas-Animation, Playwright-Render, synthetische Musik und Effekte, Mix mit ffmpeg).
- `CLAUDE.md`: Anleitung für den täglichen Claude-Agenten.
- `FAKTEN.md`, `THEMEN.md`, `SZENEN.md`: Regeln, Themen, Szenen.
- `log/posted.jsonl`: was gepostet wurde.
- Branch `gh-pages`: die Videos des Tages und `queue.json` (GitHub Pages). Make holt dort die Posts ab.

Schriften: Inter (SIL Open Font License, `engine/fonts`).
