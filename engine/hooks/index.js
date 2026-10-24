// Lädt alle Hook-Szenen (je Datei eine Szene TYPES.h_*). Neue Datei hier eintragen.
const HOOK_FILES = ["h_ekg", "h_sonar", "h_bomb", "h_ring", "h_crack", "h_error", "h_cash", "h_slot", "h_scanner", "h_lock", "h_closed", "h_magnet", "h_balloon", "h_domino", "h_static", "h_typewriter", "h_rocket", "h_trash", "h_lightswitch", "h_vault", "h_receipt", "h_babel", "h_galton", "h_van", "h_tank"];
for (const f of HOOK_FILES) document.write(`<script src="hooks/${f}.js"><\/script>`);
