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
