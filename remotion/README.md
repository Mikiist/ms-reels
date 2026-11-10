# Remotion für die Reels (seit 10.11.2026)

Zweiter Weg, Reels zu rendern: echte Bilder oder Clips (z. B. von Higgsfield) als Hintergrund, darüber Untertitel im Sprechtakt,
Glas-Karten, großes Wort und Schluss. Stimme, Musik und Wort-Zeiten kommen unverändert aus `work/<id>` (also erst `engine/build.py all`).

1. Bilder oder Clips (9:16) nach `remotion/public/clips/` legen.
2. `python3 engine/remotion_job.py work/<id> <bg1> <bg2> ...` (ein Hintergrund pro Szene).
3. `cd remotion && npx remotion render Reel out/<id>.mp4 --props=public/<id>/props.json --crf=20`
4. Einzelbilder prüfen: `npx remotion render Reel out/frames --props=... --frames=5,90,200 --image-format=jpeg`

Vorlage: `src/Reel.tsx` (Szenenarten plain, cards, big, end). Vorschau im Browser: `npx remotion studio`.
Lizenz: Remotion ist kostenlos für Firmen bis 3 Personen.
