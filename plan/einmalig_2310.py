"""Einmaliger Zusatz-Post Fr 23.10.2026, 19:30 (Slot 3): mehrsprachige Website (Professional).
python3 plan/einmalig_2310.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import woche1 as w

w.V.clear()
w.video("2026-10-23", 3, "Website spricht nur Deutsch", "Ihre Website spricht nur *Deutsch*?", "Nur *Deutsch*?",
        "Ihre Website spricht nur Deutsch", "drive", [
        ("Ihre Kunden sprechen nicht alle *Deutsch*.", {"type": "h_babel", "params": {}}),
        ("Und Ihre Website? Die spricht nur *eine* Sprache.", {"type": "statement", "params": {"big": "DE"}}),
        ("Wer Sie nicht versteht, fragt auch nicht *an*.", {"type": "cross_list", "params": {"items": ["Versteht nichts", "Fragt nicht an", "Geht weiter"]}}),
        ("Mit dem *Professional* Paket wird Ihre Website *mehrsprachig*.", {"type": "checklist", "params": {"items": ["Mehrsprachig", "10+ Seiten", "Blog", "Volle SEO"], "stamp": "Komplett"}}),
        ("2.990 Euro einmalig, oder *279* Euro im Monat.", {"type": "price", "params": {"paket": "professional"}}),
        ("Gebaut von Mihajlo Systems aus *Goslar*.", {"type": "logo", "params": {"tagline": "Websites in Ihrer Sprache"}}),
        ], w.C("Ihre Website spricht nur Deutsch? 🌍",
               "Ihre Kunden in Berlin, Hannover und ganz Deutschland sprechen viele Sprachen. Eine mehrsprachige Website holt auch die ab, die lieber auf Englisch, Türkisch oder Polnisch lesen. Im Professional Paket von Mihajlo Systems: 10+ Seiten, Blog, mehrsprachig, KI-Chatbot Pro und volle SEO.",
               "2.990 € Festpreis oder 279 € im Monat (12 Monate Mindestlaufzeit, Hosting und Wartung inklusive)."),
        ["#webdesign", "#mehrsprachig", "#website", "#berlin", "#unternehmer"], w.SHARE)

if __name__ == "__main__":
    for v in w.V:
        d = os.path.join(w.ROOT, "work", v["id"]); os.makedirs(d, exist_ok=True)
        json.dump(v, open(os.path.join(d, "job.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(v["id"])
