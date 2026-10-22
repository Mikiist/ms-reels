# Auftrag: Signature-Hook-Szenen für Mihajlo-Systems-Reels

Ziel: Scroll-Stopper der Klasse „Kugel trifft Seifenblase“. Der Zuschauer wischt in Bild 0 vorbei oder bleibt hängen. Jeder Hook arbeitet auf vier Ebenen gleichzeitig:
1. **Visueller Hook:** ab Bild 0 sichtbare, große, hochwertige Bewegung (kein leeres erstes Bild, kein langsames Einblenden). Ein klares Objekt, das sofort „Was ist das?“ auslöst.
2. **Sound-Hook:** ein markanter, synthetischer Klang ab 0,00 s (Piepen, Ping, Klingeln, Krachen …) und weitere Klänge exakt auf sichtbare Bewegungen (Regel von Mihajlo: Geräusch nur, wenn die Bewegung im Bild zu sehen ist).
3. **Text-Hook:** macht die Engine automatisch oben (y 200 bis 430, `SPEC.hook_text`). Dort nichts Wichtiges zeichnen.
4. **Gesprochener Hook:** kommt aus dem Skript; die Stimme startet nach `VOICE_DELAY` Sekunden, damit der Sound-Hook kurz allein knallt.

Qualitätsmaßstab: Motion-Design-Studio, nicht Clipart. Licht und Schatten, Verläufe, Tiefe (Parallax, leichte Kamerafahrt), Partikel, Glanzlichter, Unschärfe für Tempo, Zeitlupenmoment vor dem Knall, Shake nur am Höhepunkt. Farben satt und edel. Vorbilder zum Ansehen: `/home/user/gehirn/dateien/videos/erklaervideo-v4-hook/seifenblase/hook.js` (Seifenblase per Canvas, Dünnfilm-Farben, Glanz), `/home/user/gehirn/dateien/videos/erklaervideo-v6-lead/v7-viral/ad.js` (Szenen mit Scherben, Ziffernwalze …), dazu `engine/scenes.js` (bestehende Szenen als API-Beispiel).

## Technischer Vertrag
- Datei `engine/hooks/<typ>.js` (klassisches Skript, gleicher globaler Scope wie `engine/engine.js` und `engine/scenes.js`; alle Helfer dort sind nutzbar: `W, H, cl, lerp, seg, out3, in3, inOut, outExpo, inExpo, outBack, outElastic, rnd, R, PAL, FACTS, rr, fillRR, font, txt, fitPx, shadow, noShadow, circle, ring, check, cross, star, cursor, phone, browser, confetti, sparkles, shock, wrapLines, logoImg, background, hexA`).
- Inhalt:
```js
// VOICE_DELAY: 0.6
TYPES.h_xyz = {
  zone: "bottom",           // gesprochener Text unten (y ~1330 bis 1560)
  pal: "night",             // Standard-Farbwelt (siehe PAL in engine.js) oder eigene Farben im draw
  bgv: 0,
  coverT: 1.4,              // Sekunde mit dem stärksten Standbild (fürs Titelbild)
  prep(sc, p) { /* optional: Vorberechnung, Offscreen-Canvas in sc.st */ },
  draw(g, u, d, p, sc, P) { /* u = Sekunden seit Start, d = Dauer der Szene (ca. 2,2 bis 4 s), p = Parameter */ },
  ev(d, p) { return [[0, "xyz_beep", 0.8, 0], ...]; },   // [Sekunde, Klangname, Lautstärke 0..1, Panorama -1..1]
};
```
- Die Szene muss mit jeder Dauer `d` zwischen 1,8 und 4,5 s gut aussehen: Höhepunkt (Knall, Pop, Flatline) bei etwa `d - 0.5` oder früher, danach bleibt ein starkes Standbild stehen, bis der Übergang kommt.
- Layout 1080 × 1920: Grafik im Bereich y 440 bis 1290 (Mitte ~ y 860), oben y 190 bis 430 frei für den Text-Hook, unten y 1300 bis 1600 frei für die gesprochenen Untertitel, unter y 1600 nichts Wichtiges (Instagram-Leiste).
- Alles deterministisch aus `u` (kein `Math.random`, kein `Date.now`), nutze `rnd(seed)`.
- Pro Bild schnell genug (Ziel unter 60 ms): große Offscreen-Canvas in `prep` vorbereiten, keine riesigen Schleifen pro Pixel bei jedem Bild.
- Texte deutsch, Sie-Form, **keine Gedankenstriche (– —)**, keine echten Markenlogos (kein Google-, Apple-, Windows-Logo, keine echten Banknoten-Motive, keine bekannten Klingeltöne nachbauen). Keine erfundenen Statistiken; Zahlen in der Grafik nur als offensichtliche Illustration (Countdown, Zähler 1, 2, 3).
- Klänge in `engine/sfx/<typ>.py` (siehe `engine/sfx/README.md`): Funktionen, die numpy-Arrays (Mono, 44100 Hz) liefern, in `SOUND["name"] = fn` eintragen. Klangnamen mit Präfix des Hooks (z. B. `ekg_beep`). Laut, klar, kurz, hochwertig (Hüllkurven, kein Knacken an Anfang/Ende).

## Testen (Pflicht, mehrere Runden)
```
cd /home/user/ms-reels
python3 engine/hooktest.py <typ> '<params-json>' /tmp/hooktest/<typ> "Ihr Text-Hook *hier*" 3.2
```
Das rendert die Hook-Szene + eine Folgeszene, mischt Musik und Effekte (`test.mp4`), schreibt `bogen.jpg` (12 Bilder aus dem Hook) und `cover.jpg`. Bilder mit dem Read-Werkzeug ansehen und kritisch verbessern, bis es wirklich stark aussieht. Auch mit Dauer 2.2 und 4.2 testen. Ton prüfen: `python3 -c` mit numpy auf `sfx.wav` (Pegel an den Ereigniszeiten), keine Stille am Anfang.

## Regeln
- Nur deine eigenen Dateien anlegen/ändern: `engine/hooks/<deine typen>.js`, `engine/sfx/<deine typen>.py`, Testordner unter `/tmp/hooktest/`. Keine anderen Dateien ändern (andere Agenten arbeiten parallel). Kein git.
- Wenn ein Helfer fehlt, schreibe ihn lokal in deine Datei (Name mit Präfix deines Hooks, damit nichts kollidiert).
