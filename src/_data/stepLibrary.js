const stepLibrary = {
  // Strom & Neustart
  "check_power_supply": {
    title: "Stromversorgung prüfen",
    note: "Prüfe, ob das Gerät sicher mit Strom versorgt wird.",
    detail: {
      allgemein: [
        "Prüfe, ob der Stecker fest im Gerät und in der Steckdose sitzt.",
        "Wenn du eine Steckdosenleiste nutzt: Prüfe den Schalter an der Leiste und stecke das Gerät testweise direkt in die Wandsteckdose.",
        "Achte darauf, dass die Steckdose eingeschaltet ist (falls es eine schaltbare Steckdose ist)."
      ]
    }
  },
  "test_wall_outlet_other_device": {
    title: "Steckdose testen",
    note: "Teste die Steckdose kurz mit einem anderen Gerät.",
    detail: {
      allgemein: [
        "Stecke ein anderes Gerät ein (z. B. Lampe oder Handyladegerät).",
        "Wenn es dort auch nicht funktioniert: Nimm eine andere Steckdose."
      ]
    }
  },
  "bypass_power_strip": {
    title: "Steckdosenleiste umgehen",
    note: "Schließe das Gerät testweise direkt an der Wandsteckdose an.",
    detail: {
      allgemein: [
        "Ziehe den Stecker aus der Steckdosenleiste.",
        "Stecke das Gerät direkt in die Wandsteckdose.",
        "Teste danach erneut, ob das Gerät startet."
      ]
    }
  },
  "soft_reset_unplug_30s": {
    title: "Soft-Reset: 30 Sekunden vom Strom",
    note: "Trenne das Gerät 30 Sekunden vom Strom und schließe es dann wieder an.",
    detail: {
      allgemein: [
        "Schalte das Gerät aus (falls möglich).",
        "Ziehe den Netzstecker.",
        "Warte 30 Sekunden.",
        "Stecke den Netzstecker wieder ein und schalte das Gerät ein."
      ]
    }
  },
  "try_power_button_on_device": {
    title: "Einschalten am Gerät testen",
    note: "Teste das Einschalten am Knopf direkt am Gerät.",
    detail: {
      allgemein: [
        "Drücke die Power-Taste direkt am Gerät (nicht nur auf der Fernbedienung).",
        "Wenn es reagiert: Das Problem kann an der Fernbedienung oder Kopplung liegen."
      ]
    }
  },
  "restart_device": {
    title: "Gerät neu starten",
    note: "Starte das Gerät neu.",
    detail: {
      allgemein: [
        "Schalte das Gerät aus.",
        "Warte kurz (10–20 Sekunden).",
        "Schalte das Gerät wieder ein."
      ]
    }
  },
  "force_restart_hold_power_5s": {
    title: "Neustart erzwingen (5 Sekunden)",
    note: "Halte die Power-Taste ca. 5 Sekunden gedrückt, um einen Neustart zu erzwingen.",
    detail: {
      allgemein: [
        "Halte die Power-Taste am Gerät (oder an der Fernbedienung) etwa 5 Sekunden gedrückt.",
        "Lasse los, wenn das Gerät neu startet oder das Bild/Logo erscheint.",
        "Warte anschließend 1–2 Minuten, bis das Gerät wieder vollständig hochgefahren ist."
      ]
    }
  },
  "force_restart_hold_power_10s": {
    title: "Neustart erzwingen (10 Sekunden)",
    note: "Halte die Power-Taste ca. 10 Sekunden gedrückt, um einen Neustart zu erzwingen.",
    detail: {
      allgemein: [
        "Halte die Power-Taste am Gerät (oder an der Fernbedienung) etwa 10 Sekunden gedrückt.",
        "Lasse los, wenn das Gerät neu startet oder das Bild/Logo erscheint.",
        "Warte anschließend 1–2 Minuten, bis das Gerät wieder vollständig hochgefahren ist."
      ]
    }
  },
  "force_restart_hold_power_few_seconds": {
    title: "Neustart erzwingen (einige Sekunden)",
    note: "Halte die Power-Taste einige Sekunden gedrückt, um einen Neustart zu erzwingen.",
    detail: {
      allgemein: [
        "Halte die Power-Taste am Gerät einige Sekunden gedrückt.",
        "Lasse los, wenn das Gerät neu startet oder das Bild/Logo erscheint.",
        "Warte anschließend 1–2 Minuten, bis das Gerät wieder vollständig hochgefahren ist."
      ]
    }
  },
  "check_updates_later": {
    title: "Später nach Updates schauen",
    note: "Prüfe später im Menü, ob ein Software-Update verfügbar ist.",
    detail: {
      allgemein: [
        "Öffne die Einstellungen am Gerät.",
        "Suche nach „Software“, „System“ oder „Update“.",
        "Starte ein Update nur, wenn das Gerät stabil läuft und genug Zeit/Internet hat."
      ]
    }
  },
  "contact_service_hardware": {
    title: "Service kontaktieren (Hardware möglich)",
    note: "Wenn weiterhin keine Reaktion kommt, kann ein Hardwareproblem vorliegen.",
    detail: {
      allgemein: [
        "Achte darauf, ob LEDs leuchten oder Geräusche (Lüfter/Klicken) zu hören sind.",
        "Wenn gar nichts passiert: Netzteil/Hardware kann defekt sein.",
        "Wende dich an Hersteller/Service oder eine Werkstatt."
      ]
    }
  },

  // Internet & WLAN
  "check_internet_on_other_device": {
    title: "Internet mit anderem Gerät prüfen",
    note: "Prüfe, ob das Internet grundsätzlich funktioniert.",
    detail: {
      allgemein: [
        "Teste mit einem anderen Gerät im gleichen WLAN (z. B. Handy/Laptop).",
        "Wenn es dort auch nicht geht: Das Problem liegt eher am Router/Internetanschluss."
      ]
    }
  },
  "restart_router_unplug_30s_wait_2_5": {
    title: "Router neu starten",
    note: "Starte den Router neu (30 Sekunden vom Strom, dann 2–5 Minuten warten).",
    detail: {
      allgemein: [
        "Ziehe den Router-Stecker.",
        "Warte 30 Sekunden.",
        "Stecke den Router wieder ein.",
        "Warte 2–5 Minuten, bis das Internet wieder stabil ist."
      ]
    }
  },
  "toggle_wifi_or_airplane_mode": {
    title: "WLAN/Flugmodus kurz aus und an",
    note: "Schalte WLAN kurz aus und wieder an (oder Flugmodus kurz an/aus).",
    detail: {
      allgemein: [
        "Schalte WLAN aus und wieder ein.",
        "Wenn es nicht hilft: Flugmodus kurz einschalten und wieder ausschalten.",
        "Teste danach erneut die Verbindung."
      ]
    }
  },
  "open_network_settings_enable_wifi": {
    title: "Netzwerkeinstellungen prüfen",
    note: "Öffne die Netzwerkeinstellungen und prüfe, ob WLAN aktiviert ist.",
    detail: {
      allgemein: [
        "Öffne am Gerät die Einstellungen.",
        "Gehe zu „Netzwerk“, „Verbindungen“ oder „WLAN“.",
        "Stelle sicher, dass WLAN eingeschaltet ist und dein Netzwerk angezeigt wird."
      ]
    }
  },
  "forget_and_reconnect_wifi": {
    title: "WLAN neu verbinden (vergessen & neu anmelden)",
    note: "Trenne das WLAN und verbinde dich neu (Passwort erneut eingeben).",
    detail: {
      allgemein: [
        "Wähle dein WLAN aus.",
        "Tippe auf „Vergessen“, „Trennen“ oder „Entfernen“.",
        "Wähle das WLAN erneut und gib das Passwort neu ein (Tippfehler passieren häufig)."
      ]
    }
  },
  "move_closer_or_use_lan": {
    title: "Empfang verbessern oder LAN testen",
    note: "Stelle das Gerät näher an den Router oder teste ein LAN-Kabel.",
    detail: {
      allgemein: [
        "Stelle das Gerät näher an den Router (wenn möglich).",
        "Teste vorübergehend ein LAN-Kabel, um WLAN-Probleme auszuschließen.",
        "Vermeide Hindernisse (dicke Wände/Schränke) zwischen Gerät und Router."
      ]
    }
  },
  "reset_network_settings_device": {
    title: "Netzwerkeinstellungen zurücksetzen",
    note: "Setze die Netzwerkeinstellungen zurück und verbinde dich danach neu.",
    detail: {
      allgemein: [
        "Öffne die Einstellungen am Gerät.",
        "Suche nach „Netzwerk zurücksetzen“ oder „Netzwerkeinstellungen zurücksetzen“.",
        "Verbinde dich danach wieder mit dem WLAN (Passwort wird erneut benötigt)."
      ]
    }
  },
  "check_lan_cable_and_port": {
    title: "LAN-Kabel und Router-Port prüfen",
    note: "Stecke das LAN-Kabel neu ein und teste wenn möglich ein anderes Kabel oder einen anderen Port.",
    detail: {
      allgemein: [
        "Ziehe das LAN-Kabel am Gerät und am Router ab und stecke es wieder fest ein.",
        "Teste einen anderen LAN-Port am Router.",
        "Wenn möglich: Teste ein anderes LAN-Kabel."
      ]
    }
  },
  "disconnect_reconnect_network": {
    title: "Netzwerkverbindung trennen und neu verbinden",
    note: "Trenne die Verbindung und verbinde dich anschließend erneut.",
    detail: {
      allgemein: [
        "Öffne die Netzwerkeinstellungen.",
        "Trenne die Verbindung (oder deaktiviere/aktiviere den Adapter).",
        "Verbinde dich anschließend wieder und teste erneut."
      ]
    }
  },

  // Audio
  "unmute_and_increase_volume": {
    title: "Stumm aus und Lautstärke erhöhen",
    note: "Stelle sicher, dass das Gerät nicht stumm ist und erhöhe die Lautstärke deutlich.",
    detail: {
      allgemein: [
        "Deaktiviere „Stumm“ (Mute).",
        "Erhöhe die Lautstärke deutlich (nicht nur ein oder zwei Stufen).",
        "Teste einen anderen Inhalt/Sender/Video, um sicherzugehen."
      ]
    }
  },
  "disconnect_bluetooth_audio": {
    title: "Bluetooth-/Externe Audioverbindung prüfen",
    note: "Prüfe, ob Bluetooth-Kopfhörer oder externe Lautsprecher verbunden sind (und trenne sie testweise).",
    detail: {
      allgemein: [
        "Prüfe, ob ein Bluetooth-Kopfhörer oder Lautsprecher verbunden ist.",
        "Trenne die Verbindung testweise.",
        "Teste danach den Ton erneut."
      ]
    }
  },
  "set_audio_output_device_speakers": {
    title: "Audioausgabe auf Geräte-Lautsprecher stellen",
    note: "Stelle als Audioausgabe die Lautsprecher des Geräts ein (falls vorhanden).",
    detail: {
      allgemein: [
        "Öffne die Einstellungen → Ton/Audio.",
        "Suche „Audioausgabe“ oder „Tonausgabe“.",
        "Wähle „Geräte-Lautsprecher“ (oder „Interne Lautsprecher“)."
      ]
    }
  },
  "reseat_audio_cables": {
    title: "Audio-/HDMI-Kabel neu einstecken",
    note: "Ziehe Audio-/HDMI-Kabel einmal ab und stecke sie wieder fest ein.",
    detail: {
      allgemein: [
        "Ziehe das Kabel am Gerät und am angeschlossenen Gerät ab.",
        "Stecke es wieder fest ein (bis es richtig sitzt).",
        "Teste danach den Ton erneut."
      ]
    }
  },
  "disconnect_external_audio_test_device_speakers": {
    title: "Externe Lautsprecher kurz trennen",
    note: "Trenne externe Lautsprecher kurz und teste den Ton über die Geräte-Lautsprecher.",
    detail: {
      allgemein: [
        "Wenn du eine Soundbar oder externe Lautsprecher nutzt: Trenne sie kurz (Kabel oder Bluetooth).",
        "Stelle die Audioausgabe auf „Geräte-Lautsprecher“.",
        "Teste den Ton mit einem anderen Sender/Video.",
        "Verbinde die externen Lautsprecher danach wieder."
      ]
    }
  },
  "set_sound_mode_standard_disable_effects": {
    title: "Soundmodus prüfen",
    note: "Stelle testweise einen einfachen Soundmodus ein und deaktiviere Extras.",
    detail: {
      allgemein: [
        "Öffne Einstellungen → Ton/Audio.",
        "Wähle einen einfachen Modus wie „Standard“ (falls vorhanden).",
        "Deaktiviere testweise Extras wie „Surround“, „Klangverbesserung“ oder ähnliche.",
        "Teste danach den Ton erneut."
      ]
    }
  },

  // Bild & HDMI / Quelle
  "check_device_is_on": {
    title: "Prüfen, ob das Gerät wirklich an ist",
    note: "Prüfe, ob das Gerät an ist (z. B. Standby-Licht, Ton oder Reaktion auf Tasten).",
    detail: {
      allgemein: [
        "Achte auf ein Standby-Licht oder eine Anzeige.",
        "Prüfe, ob Ton da ist oder ob das Gerät auf Tasten reagiert.",
        "Teste die Tasten am Gerät selbst (z. B. Power/Lautstärke)."
      ]
    }
  },
  "select_correct_input_source": {
    title: "Richtige Quelle wählen",
    note: "Wähle die richtige Eingangsquelle (z. B. HDMI 1 statt HDMI 2).",
    detail: {
      allgemein: [
        "Drücke „Source“, „Input“ oder „Eingang“.",
        "Wähle die richtige Quelle (z. B. HDMI 1/2/3).",
        "Warte kurz nach dem Wechsel (5–10 Sekunden)."
      ]
    }
  },
  "reseat_hdmi_cable_and_try_other_port": {
    title: "HDMI-Kabel neu einstecken und anderen Port testen",
    note: "Stecke das HDMI-Kabel neu ein und teste wenn möglich einen anderen HDMI-Port.",
    detail: {
      allgemein: [
        "Ziehe das HDMI-Kabel am Gerät und am Zuspielgerät ab.",
        "Stecke es wieder fest ein.",
        "Teste zusätzlich einen anderen HDMI-Port."
      ]
    }
  },
  "restart_connected_device_wait_1_2": {
    title: "Angeschlossenes Gerät neu starten",
    note: "Starte das angeschlossene Gerät neu und warte 1–2 Minuten.",
    detail: {
      allgemein: [
        "Schalte das angeschlossene Gerät aus (z. B. Receiver/Streaming-Box/Konsole).",
        "Schalte es wieder ein.",
        "Warte 1–2 Minuten, bis es vollständig gestartet ist."
      ]
    }
  },
  "try_other_hdmi_cable_or_device": {
    title: "Anderes HDMI-Kabel oder Gerät testen",
    note: "Teste kurz ein anderes HDMI-Kabel oder ein anderes Gerät, um Kabel/Port auszuschließen.",
    detail: {
      allgemein: [
        "Teste ein anderes HDMI-Kabel (wenn vorhanden).",
        "Teste ein anderes Zuspielgerät am gleichen HDMI-Port (oder denselben Zuspieler an einem anderen Gerät).",
        "So erkennst du, ob Kabel/Port oder das Zuspielgerät die Ursache ist."
      ]
    }
  },
  "black_screen_soft_reset_and_service_if_persists": {
    title: "Bei schwarzem Bildschirm: Soft-Reset, dann ggf. Service",
    note: "Trenne das Gerät 30 Sekunden vom Strom und kontaktiere bei weiterhin schwarzem Bild den Service.",
    detail: {
      allgemein: [
        "Trenne das Gerät 30 Sekunden vom Strom (Soft-Reset).",
        "Starte es erneut und warte kurz.",
        "Wenn es weiterhin dauerhaft schwarz bleibt: Es kann ein Hardwareproblem sein → Service kontaktieren."
      ]
    }
  },
  "power_cycle_device_and_connected_unplug_30s": {
    title: "Gerät und Zuspielgerät komplett neu starten",
    note: "Trenne Gerät und angeschlossenes Gerät jeweils 30 Sekunden vom Strom und starte beide neu.",
    detail: {
      allgemein: [
        "Schalte Gerät und angeschlossenes Gerät aus.",
        "Ziehe beide Stecker aus der Steckdose.",
        "Warte 30 Sekunden.",
        "Stecke beide wieder ein und schalte erst das Gerät, dann das angeschlossene Gerät ein.",
        "Warte 1–2 Minuten, bis alles vollständig gestartet ist."
      ]
    }
  },

  // Fernbedienung
  "replace_remote_batteries_check_polarity": {
    title: "Batterien wechseln",
    note: "Wechsle die Batterien und achte auf die richtige Polarität (+/–).",
    detail: {
      allgemein: [
        "Lege neue Batterien ein (am besten gleiche Sorte).",
        "Achte auf + und – im Batteriefach.",
        "Teste danach die Fernbedienung erneut."
      ]
    }
  },
  "remote_test_short_distance_line_of_sight": {
    title: "Aus kurzer Entfernung testen",
    note: "Teste aus kurzer Entfernung und richte die Fernbedienung direkt auf den Sensor.",
    detail: {
      allgemein: [
        "Stelle dich 1–2 Meter vor das Gerät.",
        "Richte die Fernbedienung direkt auf den Sensor.",
        "Stelle sicher, dass nichts davor steht."
      ]
    }
  },
  "remote_test_device_buttons": {
    title: "Tasten am Gerät testen",
    note: "Prüfe, ob das Gerät grundsätzlich reagiert, indem du die Tasten am Gerät selbst nutzt.",
    detail: {
      allgemein: [
        "Drücke Power/Lautstärke direkt am Gerät.",
        "Wenn das funktioniert, liegt das Problem eher an der Fernbedienung oder Verbindung."
      ]
    }
  },
  "remote_check_stuck_buttons_and_battery_cover": {
    title: "Fernbedienung kurz prüfen",
    note: "Prüfe, ob Tasten klemmen und ob die Batterieklappe richtig sitzt.",
    detail: {
      allgemein: [
        "Drücke ein paar Tasten und prüfe, ob etwas klemmt.",
        "Prüfe, ob die Batterieklappe richtig schließt.",
        "Teste danach erneut."
      ]
    }
  },
  "remote_repair_pairing_after_soft_reset": {
    title: "Fernbedienung neu verbinden (nach Soft-Reset)",
    note: "Starte das Gerät neu (30 Sekunden vom Strom) und verbinde die Fernbedienung erneut.",
    detail: {
      allgemein: [
        "Trenne das Gerät 30 Sekunden vom Strom und starte es neu.",
        "Öffne die Verbindungs-/Bluetooth-Einstellungen (falls nötig).",
        "Kopple/verbinde die Fernbedienung erneut."
      ]
    }
  },
  "remote_consider_replacement": {
    title: "Ersatz in Betracht ziehen",
    note: "Wenn weiterhin keine Reaktion: Universalfernbedienung oder Hersteller-Ersatz in Betracht ziehen.",
    detail: {
      allgemein: [
        "Teste, ob das Gerät mit den Tasten am Gerät funktioniert.",
        "Wenn ja und die Fernbedienung weiter nicht reagiert: Ersatz/Universalfernbedienung prüfen.",
        "Bei Bedarf Hersteller-Support kontaktieren."
      ]
    }
  },

  // Computer – Start, Leistung, Installation
  "disconnect_usb_devices": {
    title: "USB-Geräte trennen",
    note: "Trenne alle USB-Geräte, damit nichts den Start blockiert.",
    detail: {
      allgemein: [
        "Ziehe USB-Sticks, Drucker, externe Festplatten und Dockingstationen ab.",
        "Lass nur Stromversorgung und (wenn nötig) Tastatur/Maus dran.",
        "Starte danach erneut."
      ]
    }
  },
  "power_reset_hold_power_10_15s": {
    title: "Power-Reset durchführen",
    note: "Führe einen Power-Reset durch (Power-Taste 10–15 Sekunden halten).",
    detail: {
      allgemein: [
        "Schalte das Gerät aus.",
        "Trenne das Netzteil/Stromkabel.",
        "Halte die Power-Taste 10–15 Sekunden gedrückt.",
        "Schließe das Netzteil wieder an und starte das Gerät."
      ]
    }
  },
  "check_psu_switch_on": {
    title: "Netzteil-Schalter prüfen",
    note: "Prüfe (falls vorhanden), ob der Netzteil-Schalter auf „1“ steht.",
    detail: {
      allgemein: [
        "Suche hinten am Netzteil nach einem Schalter „0/1“.",
        "Stelle ihn auf „1“ (Ein).",
        "Teste danach den Start erneut."
      ]
    }
  },
  "laptop_try_other_charger_charge_10_15": {
    title: "Ladegerät/Stromanschluss testen",
    note: "Teste ein anderes Ladegerät oder einen anderen Stromanschluss und lade 10–15 Minuten.",
    detail: {
      allgemein: [
        "Teste nach Möglichkeit ein anderes Ladegerät.",
        "Teste eine andere Steckdose.",
        "Lade 10–15 Minuten und versuche dann zu starten."
      ]
    }
  },
  "restart_pc": {
    title: "Computer neu starten",
    note: "Starte den Computer neu.",
    detail: {
      allgemein: [
        "Speichere offene Arbeiten (wenn möglich).",
        "Starte den Computer neu.",
        "Teste danach, ob das Problem behoben ist."
      ]
    }
  },
  "close_unneeded_programs_and_tabs": {
    title: "Programme und Tabs schließen",
    note: "Schließe unnötige Programme und Browser-Tabs.",
    detail: {
      allgemein: [
        "Schließe Programme, die du gerade nicht brauchst.",
        "Schließe viele Browser-Tabs (besonders wenn der PC langsam ist).",
        "Warte kurz und prüfe, ob es flüssiger läuft."
      ]
    }
  },
  "check_disk_space_cleanup": {
    title: "Speicherplatz prüfen und aufräumen",
    note: "Prüfe den freien Speicherplatz und räume bei Bedarf auf.",
    detail: {
      allgemein: [
        "Prüfe, ob die Systemplatte fast voll ist.",
        "Lösche große Dateien oder räume Downloads auf.",
        "Leere den Papierkorb."
      ]
    }
  },
  "disable_startup_programs": {
    title: "Autostart reduzieren",
    note: "Schalte unnötige Autostart-Programme aus, damit weniger beim Start geladen wird.",
    detail: {
      allgemein: [
        "Öffne die Einstellungen/Systemverwaltung für Autostart.",
        "Deaktiviere Programme, die du nicht sofort brauchst.",
        "Starte den Computer danach neu."
      ]
    }
  },
  "run_malware_scan": {
    title: "Viren-/Malware-Scan durchführen",
    note: "Führe einen Viren-/Malware-Scan durch.",
    detail: {
      allgemein: [
        "Öffne dein Virenschutzprogramm (z. B. Windows Defender).",
        "Starte einen vollständigen Scan.",
        "Entferne gefundene Bedrohungen und starte danach neu."
      ]
    }
  },
  "consider_hardware_upgrade": {
    title: "Hardware prüfen (SSD/RAM)",
    note: "Wenn es dauerhaft langsam bleibt, kann mehr Speicher oder eine SSD helfen.",
    detail: {
      allgemein: [
        "Installiere alle Updates.",
        "Wenn es weiterhin langsam ist: Eine SSD oder mehr Arbeitsspeicher kann spürbar helfen.",
        "Lass dich bei Bedarf im Service/Shop beraten."
      ]
    }
  },
  "check_free_space_before_install": {
    title: "Speicherplatz vor Installation prüfen",
    note: "Prüfe, ob genug Speicherplatz frei ist.",
    detail: {
      allgemein: [
        "Prüfe den freien Speicherplatz auf der Systemplatte.",
        "Wenn zu wenig frei ist: Lösche große Dateien oder verschiebe sie.",
        "Starte die Installation danach erneut."
      ]
    }
  },
  "close_other_programs_before_install": {
    title: "Andere Programme schließen",
    note: "Schließe andere Programme, damit die Installation nicht blockiert wird.",
    detail: {
      allgemein: [
        "Schließe alle Programme, die du gerade nicht brauchst.",
        "Schließe besonders andere Installationen/Updates (falls welche laufen).",
        "Schließe viele Browser-Tabs, wenn sehr viele offen sind.",
        "Versuche die Installation danach erneut."
      ]
    }
  },
  "redownload_installer_official": {
    title: "Installer neu herunterladen",
    note: "Lade die Installationsdatei erneut von der offiziellen Quelle.",
    detail: {
      allgemein: [
        "Lösche die alte Installationsdatei.",
        "Lade die Datei neu von der offiziellen Webseite/App-Quelle herunter.",
        "Starte die Installation erneut."
      ]
    }
  },
  "run_installer_as_admin": {
    title: "Als Administrator ausführen",
    note: "Starte die Installation mit Administratorrechten (falls möglich).",
    detail: {
      allgemein: [
        "Klicke mit Rechtsklick auf die Installationsdatei.",
        "Wähle „Als Administrator ausführen“.",
        "Folge den Schritten am Bildschirm."
      ]
    }
  },
  "check_os_compat_or_security_block": {
    title: "Kompatibilität/Sicherheitsblock prüfen",
    note: "Prüfe, ob dein System unterstützt wird oder ob Sicherheitssoftware blockiert.",
    detail: {
      allgemein: [
        "Prüfe, ob deine Betriebssystem-Version unterstützt wird.",
        "Achte auf Hinweise deiner Sicherheitssoftware (Block/Quarantäne).",
        "Versuche die Installation erneut, nachdem du die Ursache behoben hast."
      ]
    }
  },

  // Drucker
  "printer_check_on_no_error": {
    title: "Druckerstatus prüfen",
    note: "Prüfe, ob der Drucker eingeschaltet ist und keine Fehlermeldung zeigt.",
    detail: {
      allgemein: [
        "Prüfe, ob der Drucker an ist.",
        "Achte auf Warnlampen oder Meldungen am Display.",
        "Behebe Papierstau/fehlendes Papier/Tinte, falls angezeigt."
      ]
    }
  },
  "printer_check_connection_usb_or_wifi": {
    title: "Druckerverbindung prüfen",
    note: "Prüfe, ob USB/WLAN korrekt verbunden ist (beide Geräte im gleichen WLAN).",
    detail: {
      allgemein: [
        "Bei USB: Prüfe, ob das Kabel fest steckt.",
        "Bei WLAN: Prüfe, ob Drucker und Computer im gleichen WLAN sind.",
        "Teste bei Bedarf ein anderes USB-Kabel oder starte den Drucker kurz neu."
      ]
    }
  },
  "printer_select_correct_printer": {
    title: "Richtigen Drucker auswählen",
    note: "Wähle im Druckdialog den richtigen Drucker aus.",
    detail: {
      allgemein: [
        "Öffne den Druckdialog (Drucken).",
        "Wähle den richtigen Drucker (nicht z. B. „PDF“).",
        "Starte danach den Druck erneut."
      ]
    }
  },
  "restart_printer_wait_10s": {
    title: "Drucker neu starten",
    note: "Starte den Drucker neu (aus, 10 Sekunden warten, wieder an).",
    detail: {
      allgemein: [
        "Schalte den Drucker aus.",
        "Warte 10 Sekunden.",
        "Schalte den Drucker wieder ein und teste erneut."
      ]
    }
  },
  "remove_and_add_printer": {
    title: "Drucker entfernen und neu hinzufügen",
    note: "Entferne den Drucker und füge ihn in den Druckereinstellungen neu hinzu.",
    detail: {
      allgemein: [
        "Öffne die Druckereinstellungen.",
        "Entferne den betroffenen Drucker.",
        "Füge den Drucker erneut hinzu und teste."
      ]
    }
  },

  // Smartphone – Laden, Empfang, Apps
  "check_cable_charger_outlet": {
    title: "Kabel, Netzteil und Steckdose prüfen",
    note: "Prüfe, ob Kabel und Netzteil fest stecken und die Steckdose funktioniert.",
    detail: {
      allgemein: [
        "Prüfe, ob Kabel und Netzteil fest verbunden sind.",
        "Teste eine andere Steckdose.",
        "Prüfe, ob am Ladegerät eine Kontrollleuchte leuchtet (falls vorhanden)."
      ]
    }
  },
  "try_other_cable_or_charger": {
    title: "Anderes Kabel/Ladegerät testen",
    note: "Teste ein anderes Kabel und/oder ein anderes Ladegerät.",
    detail: {
      allgemein: [
        "Teste ein anderes Ladekabel.",
        "Teste ein anderes Netzteil/Ladegerät.",
        "Wenn möglich: Teste beides einzeln, um die Ursache zu finden."
      ]
    }
  },
  "clean_charging_port_carefully": {
    title: "Ladeanschluss vorsichtig reinigen",
    note: "Reinige den Ladeanschluss vorsichtig (kein Metall).",
    detail: {
      allgemein: [
        "Schalte das Gerät aus (wenn möglich).",
        "Entferne vorsichtig Staub/Flusen mit Holz/Zahnstocher (kein Metall).",
        "Teste danach das Laden erneut."
      ]
    }
  },
  "try_pc_usb_or_fast_charger": {
    title: "Anderen USB-Port oder anderes Netzteil testen",
    note: "Teste, ob es am PC/USB-Port lädt oder ob ein anderes Netzteil nötig ist.",
    detail: {
      allgemein: [
        "Teste einen USB-Port am Computer.",
        "Teste ein anderes Netzteil (z. B. stärkeres/„Schnellladen“-Netzteil).",
        "Prüfe, ob das Gerät eine Ladeanzeige zeigt."
      ]
    }
  },
  "toggle_airplane_mode": {
    title: "Flugmodus kurz an/aus",
    note: "Schalte den Flugmodus kurz ein und wieder aus.",
    detail: {
      allgemein: [
        "Schalte Flugmodus ein.",
        "Warte 5–10 Sekunden.",
        "Schalte Flugmodus wieder aus und prüfe den Empfang."
      ]
    }
  },
  "reseat_sim_card": {
    title: "SIM-Karte neu einsetzen",
    note: "Nimm die SIM-Karte kurz heraus und setze sie wieder ein (falls möglich).",
    detail: {
      allgemein: [
        "Schalte das Gerät aus (wenn möglich).",
        "Nimm die SIM-Karte heraus und setze sie wieder ein.",
        "Starte das Gerät und prüfe den Empfang."
      ]
    }
  },
  "try_other_location_for_signal": {
    title: "Anderen Ort testen",
    note: "Teste an einem anderen Ort, ob dort Empfang vorhanden ist.",
    detail: {
      allgemein: [
        "Gehe ans Fenster oder nach draußen (wenn möglich).",
        "Teste kurz in einem anderen Raum.",
        "Prüfe, ob sich der Empfang verbessert."
      ]
    }
  },
  "select_network_operator": {
    title: "Netzbetreiber neu auswählen",
    note: "Wähle den Anbieter automatisch oder manuell neu.",
    detail: {
      allgemein: [
        "Öffne die Netzwerkeinstellungen.",
        "Wähle „Netzbetreiber“/„Anbieter“.",
        "Teste „Automatisch“ oder wähle den Anbieter manuell neu."
      ]
    }
  },
  "check_provider_outage": {
    title: "Störung beim Anbieter prüfen",
    note: "Prüfe, ob es eine Störung beim Anbieter gibt.",
    detail: {
      allgemein: [
        "Teste die SIM in einem anderen Handy (wenn möglich).",
        "Frage kurz bei anderen im gleichen Netz nach.",
        "Wenn es weiterhin nicht geht: Provider-Support/Statusseite prüfen."
      ]
    }
  },
  "close_all_apps": {
    title: "Apps schließen",
    note: "Schließe alle offenen Apps.",
    detail: {
      allgemein: [
        "Öffne den App-Wechsler.",
        "Schließe die Apps (alle oder zumindest die großen).",
        "Teste danach, ob das Gerät flüssiger läuft."
      ]
    }
  },
  "check_storage_free_space": {
    title: "Speicherplatz prüfen",
    note: "Prüfe den Speicherplatz und schaffe Platz, wenn er fast voll ist.",
    detail: {
      allgemein: [
        "Öffne Einstellungen → Speicher.",
        "Lösche große Dateien (Videos/Fotos) oder nicht genutzte Apps.",
        "Starte das Gerät danach neu."
      ]
    }
  },
  "install_system_and_app_updates": {
    title: "Updates installieren",
    note: "Installiere System- und App-Updates.",
    detail: {
      allgemein: [
        "Öffne Einstellungen → Update/Softwareupdate.",
        "Installiere verfügbare Systemupdates.",
        "Öffne den App Store/Play Store und aktualisiere Apps."
      ]
    }
  },
  "clear_app_cache_or_reinstall": {
    title: "App-Cache leeren oder App neu installieren",
    note: "Leere den Cache (wenn möglich) oder installiere die App neu.",
    detail: {
      allgemein: [
        "Wenn möglich: Cache der App leeren.",
        "Wenn das nicht geht oder nicht hilft: App deinstallieren und neu installieren.",
        "Starte danach das Gerät neu und teste erneut."
      ],
      android: [
        "Einstellungen → Apps → (App auswählen) → Speicher → Cache leeren."
      ],
      ios: [
        "App löschen und aus dem App Store neu installieren (iOS hat meist keinen Cache-Button)."
      ]
    }
  },
  "force_quit_app_and_restart": {
    title: "App neu starten",
    note: "Schließe die App komplett und starte sie neu.",
    detail: {
      allgemein: [
        "Schließe die App vollständig (nicht nur minimieren).",
        "Öffne die App erneut.",
        "Teste, ob der Fehler weiterhin auftritt."
      ]
    }
  },
  "check_app_update_store": {
    title: "App-Update prüfen",
    note: "Prüfe im App Store/Play Store, ob ein Update verfügbar ist.",
    detail: {
      allgemein: [
        "Öffne den App Store/Play Store.",
        "Suche die App.",
        "Installiere das Update und teste erneut."
      ]
    }
  },
  "check_app_permissions": {
    title: "App-Berechtigungen prüfen",
    note: "Prüfe, ob die App die nötigen Berechtigungen hat (z. B. Kamera, Speicher, Standort).",
    detail: {
      allgemein: [
        "Öffne Einstellungen → Apps → (App auswählen) → Berechtigungen.",
        "Aktiviere die nötigen Berechtigungen (nur wenn du sie brauchst).",
        "Teste danach die App erneut."
      ]
    }
  },
  "reset_network_settings_phone": {
    title: "Netzwerkeinstellungen am Handy zurücksetzen",
    note: "Setze die Netzwerkeinstellungen zurück (Achtung: WLAN-Passwörter gehen verloren).",
    detail: {
      allgemein: [
        "Öffne Einstellungen → System/Allgemein → Zurücksetzen.",
        "Wähle „Netzwerkeinstellungen zurücksetzen“.",
        "Verbinde dich danach erneut mit WLAN und Bluetooth-Geräten."
      ]
    }
  },
  "factory_reset_last_resort": {
    title: "Werkseinstellungen (letzter Schritt)",
    note: "Setze das Gerät erst als letzten Schritt auf Werkseinstellungen zurück.",
    detail: {
      allgemein: [
        "Mache vorher ein Backup (Fotos, Kontakte, wichtige Daten).",
        "Starte den Zurücksetzen-Vorgang in den Einstellungen.",
        "Richte das Gerät danach neu ein und teste, ob das Problem behoben ist."
      ]
    }
  }
};

module.exports = stepLibrary;
