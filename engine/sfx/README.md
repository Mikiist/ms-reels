Jede Datei hier wird von audio.py mit dessen globalen Namen ausgeführt (np, SR, T, add, lpf, bpf, lpv, mx, mid, rng,
kick, clap, hat, saw, pluck, sub, pad, boom, thump, whoosh, riser, click, tick, blip, pop, chime, glass, ring, thunder,
suck, slap, cash, shimmer, flap, keyc, buzz, glitch, ping, ding) und trägt neue Klänge in das Wörterbuch SOUND ein:

    def ekg_beep(): ...  # gibt ein numpy-Array (Mono, 44100 Hz) zurück
    SOUND["ekg_beep"] = ekg_beep

Die Hook-Szene liefert in ev() Ereignisse [Sekunde, "ekg_beep", Lautstärke, Panorama].
Alles synthetisch, keine fremden Samples, keine bekannten Klingeltöne oder Markenklänge nachbauen.
