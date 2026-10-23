"""Verteilt die Looks auf die Videos einer Woche (schreibt "look" in work/<id>/job.json).
python3 plan/looks.py 2026-10-24 2026-10-30
Reihenfolge rotiert, damit an einem Tag drei verschiedene Looks laufen und kein Look zweimal hintereinander kommt.
Danach: python3 engine/build.py all work/<id> (Stimme bleibt)."""
import json, os, sys, datetime
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORDER = ["brutal", "neon", "editorial", "pop", "cinema", "terminal"]

def main(a, b, start=0):
    d0 = datetime.date.fromisoformat(a); d1 = datetime.date.fromisoformat(b); n = start; d = d0
    while d <= d1:
        for slot in (1, 2, 3):
            p = os.path.join(ROOT, "work", f"{d.isoformat()}-{slot}", "job.json")
            if not os.path.exists(p): continue
            j = json.load(open(p, encoding="utf-8")); j["look"] = ORDER[n % len(ORDER)]; n += 1
            json.dump(j, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1); print(j["id"], j["look"])
        d += datetime.timedelta(days=1)

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 0)
