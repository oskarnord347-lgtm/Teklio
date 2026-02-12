// src/_data/problemCopy.js

function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "")
    .replace(/\//g, "")
    .replace(/-/g, "");
}

/**
 * Copy-Bausteine pro Problem.
 * Keys dürfen "schön" sein – Matching erfolgt später per normalize().
 *
 * NEU (skalierbar):
 * - synonyms: Array<string>  -> Synonyme/Keywords
 * - symptoms: Array<string>  -> typische Beschreibungen/Phrasen
 */
const COPY = {
  "Geht nicht an": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} nicht mehr angeht, liegt es oft an Stromversorgung, Standby-Hänger oder einer falschen Einschalt-Methode. Mit den Schritten unten kannst du die häufigsten Ursachen schnell prüfen.`,
    causes: [
      "Steckdose liefert keinen Strom oder Stecker sitzt locker",
      "Netzkabel/Netzteil hat einen Wackelkontakt",
      "Gerät hängt im Standby (kurz vom Strom trennen hilft oft)"
    ],
    support:
      "Wenn keine Reaktion (auch keine LED) zu sehen ist, kann ein Defekt am Netzteil oder der Hauptplatine vorliegen.",
    synonyms: [
      "startet nicht", "einschalten", "power", "tot", "keine reaktion", "bootet nicht", "standby"
    ],
    symptoms: [
      "geht kurz an dann aus", "led leuchtet nicht", "klickt nur", "reagiert nicht auf fernbedienung"
    ]
  },

  "Kein Ton": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} keinen Ton mehr hat, ist häufig die Audio-Ausgabe falsch eingestellt oder die Stummschaltung aktiv. Oft lässt sich das in wenigen Minuten beheben – ohne Technikkenntnisse.`,
    causes: [
      "Stummschaltung aktiv oder Lautstärke sehr niedrig",
      "Audio-Ausgabe auf Bluetooth/Receiver/HDMI umgestellt",
      "HDMI-Gerät übernimmt den Ton (ARC/eARC/CEC)"
    ],
    support:
      "Wenn nach allen Schritten weiterhin kein Ton zu hören ist, könnte ein Hardwaredefekt (Lautsprecher/Board) vorliegen.",
    synonyms: [
      "kein sound", "audio", "lautsprecher", "stumm", "mute", "lautstärke", "ton weg"
    ],
    symptoms: [
      "bild da aber kein ton", "ton nur über kopfhörer", "nur rauschen", "ton sehr leise"
    ]
  },

  "Kein Bild / Schwarzer Bildschirm": {
    intro: ({ device, brand }) =>
      `Ein schwarzer Bildschirm bei einem ${brand ? brand + " " : ""}${device} liegt oft an der falschen Eingangsquelle oder einem HDMI/Signal-Problem. Arbeite die Schritte der Reihe nach ab, um die Ursache einzugrenzen.`,
    causes: [
      "Falsche Quelle (Input/Source) ausgewählt",
      "HDMI-Kabel locker/defekt oder falscher HDMI-Port",
      "Zuspielgerät (Receiver/Konsole) sendet kein Signal"
    ],
    support:
      "Wenn Menü/OSD auch nicht erscheint, kann es ein Panel-/Backlight-Problem sein.",
    synonyms: [
      "schwarzer bildschirm", "kein screen", "kein display", "bild weg", "dunkel", "black screen"
    ],
    symptoms: [
      "ton da aber bild schwarz", "menü erscheint nicht", "nur hintergrundbeleuchtung", "flackert kurz"
    ]
  },

  "Fernbedienung funktioniert nicht": {
    intro: ({ device, brand }) =>
      `Wenn die Fernbedienung für deinen ${brand ? brand + " " : ""}${device} nicht reagiert, liegt es meist an leeren Batterien, fehlender Kopplung (Bluetooth) oder einem verdeckten IR-Sensor.`,
    causes: [
      "Batterien leer oder falsch eingelegt",
      "IR-Sensor verdeckt / zu weit entfernt / falscher Winkel",
      "Bluetooth-Fernbedienung muss neu gekoppelt werden"
    ],
    support:
      "Wenn Tasten am Gerät funktionieren, ist die Fernbedienung selbst wahrscheinlich die Ursache.",
    synonyms: [
      "remote", "fernbedienung", "batterie", "kopplung", "pairing", "bluetooth"
    ],
    symptoms: [
      "led blinkt nicht", "tasten reagieren nicht", "nur manche tasten gehen"
    ]
  },

  "WLAN funktioniert nicht": {
    intro: ({ device, brand }) =>
      `Wenn WLAN auf deinem ${brand ? brand + " " : ""}${device} nicht funktioniert, ist häufig der Router, das Passwort oder die Signalstärke die Ursache. Mit den Schritten unten bekommst du meist schnell wieder eine Verbindung.`,
    causes: [
      "Router hängt oder Internet ist kurz weg",
      "Passwort falsch oder Netzwerk nicht kompatibel (z. B. 5 GHz/2,4 GHz)",
      "Signal zu schwach (zu weit weg, Wände, Störungen)"
    ],
    support:
      "Wenn andere Geräte auch kein WLAN haben, liegt es sehr wahrscheinlich am Router/Provider.",
    synonyms: [
      "wifi", "internet", "netzwerk", "verbindung", "online", "offline"
    ],
    symptoms: [
      "findet kein wlan", "wlan-symbol fehlt", "verbindet sich nicht", "passwort wird abgelehnt"
    ]
  },

  // Computer
  "PC startet nicht": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} nicht startet, kann es an Strom, Akku/Netzteil oder einem Hardware-/Boot-Problem liegen. Die Schritte helfen dir, das schnell zu prüfen.`,
    causes: [
      "Netzteil/Kabel locker oder Steckdose ohne Strom",
      "Akku tiefentladen (bei Laptops)",
      "Peripherie/USB-Gerät blockiert den Start"
    ],
    support:
      "Wenn der PC keinerlei Lebenszeichen zeigt, ist ein Hardwaredefekt möglich (Netzteil/Mainboard).",
    synonyms: [
      "bootet nicht", "startet nicht", "power", "kein strom", "black screen"
    ],
    symptoms: [
      "lüfter dreht kurz", "pieptöne", "geht kurz an dann aus"
    ]
  },

  "Kein Internet": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} kein Internet hat, ist oft WLAN/LAN, Router oder ein falscher Netzwerkstatus die Ursache. Mit den Schritten unten findest du schnell den Auslöser.`,
    causes: [
      "Router/Modem hängt oder hat keine Verbindung",
      "WLAN deaktiviert / Flugmodus / falsches Netzwerk",
      "DNS/Netzwerk-Stack hängt (Neustart hilft oft)"
    ],
    support:
      "Wenn alle Geräte kein Internet haben, liegt es meist am Router oder Provider.",
    synonyms: [
      "offline", "dns", "netzwerk", "router", "modem", "keine verbindung"
    ],
    symptoms: [
      "seiten laden nicht", "apps gehen nicht online", "nur auf manchen seiten"
    ]
  },

  "Langsam / Hängt sich auf": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} langsam ist oder hängt, liegt es oft an zu vielen Programmen, wenig Speicherplatz oder Hintergrundprozessen. Die Schritte helfen dir, das System wieder flüssiger zu machen.`,
    causes: [
      "Zu viele Autostart-/Hintergrundprogramme",
      "Zu wenig freier Speicherplatz",
      "Updates/Virenscanner laufen im Hintergrund"
    ],
    support:
      "Wenn es dauerhaft sehr langsam bleibt, kann eine Überprüfung von Festplatte/SSD oder RAM sinnvoll sein.",
    synonyms: [
      "lag", "ruckelt", "freeze", "hängt", "langsam", "stockt"
    ],
    symptoms: [
      "programme öffnen langsam", "maus hängt", "dauernd lädt"
    ]
  },

  // Handy
  "Akku lädt nicht": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} nicht lädt, liegt es meist am Kabel/Netzteil, Schmutz im Anschluss oder einem Software-Hänger. Mit den Schritten findest du schnell heraus, woran es liegt.`,
    causes: [
      "Kabel/Netzteil defekt oder zu schwach",
      "Ladebuchse verschmutzt / Wackelkontakt",
      "Software hängt (Neustart hilft oft)"
    ],
    support:
      "Wenn es nur in einem Winkel lädt oder gar nicht mehr, kann die Ladebuchse defekt sein.",
    synonyms: [
      "lädt nicht", "charging", "kabel", "netzteil", "ladebuchse"
    ],
    symptoms: [
      "lädt nur im winkel", "lädt sehr langsam", "lädt nur manchmal"
    ]
  },

  "WLAN verbindet nicht": {
    intro: ({ device, brand }) =>
      `Wenn sich dein ${brand ? brand + " " : ""}${device} nicht mit WLAN verbindet, liegt es oft am Passwort, Router oder gespeicherten Netzwerkeinstellungen. Mit diesen Schritten klappt es meistens wieder.`,
    causes: [
      "Falsches Passwort oder Captive Portal",
      "Router hängt / Kanal-Störungen",
      "Gespeichertes WLAN-Profil ist beschädigt"
    ],
    support:
      "Wenn andere Geräte problemlos ins WLAN kommen, lohnt sich „Netzwerk vergessen“ und neu verbinden.",
    synonyms: [
      "wifi", "internet", "netzwerk", "passwort", "verbindung", "login"
    ],
    symptoms: [
      "verbindet kurz und trennt", "authentifizierung fehlgeschlagen", "ip wird nicht bezogen"
    ]
  },

  // ======================
  // DRUCKER (NEUES GERÄT)
  // ======================

  "Druckt nicht": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} nicht druckt, liegt es oft an einer unterbrochenen Verbindung, einem blockierten Druckauftrag oder falschen Druckereinstellungen. Mit den Schritten unten findest du die Ursache schnell heraus.`,
    causes: [
      "Drucker ist offline / nicht verbunden (USB/WLAN)",
      "Druckauftrag hängt in der Warteschlange",
      "Falscher Drucker ausgewählt oder Treiber/Software Problem"
    ],
    support:
      "Wenn der Drucker gar nicht reagiert oder Fehlerleuchten dauerhaft blinken, kann auch ein Hardware- oder Patronen/Toner-Problem vorliegen.",
    synonyms: [
      "druckt nicht", "kein druck", "druckauftrag", "warteschlange", "offline", "drucker reagiert nicht"
    ],
    symptoms: [
      "druckt gar nichts", "druckauftrag bleibt hängen", "druckt nur testseite", "drucker wird nicht gefunden"
    ]
  },

  "Papierstau": {
    intro: ({ device, brand }) =>
      `Ein Papierstau beim ${brand ? brand + " " : ""}${device} entsteht häufig durch schief eingelegtes Papier, zu dickes Papier oder kleine Papierreste im Einzug. Mit den Schritten kannst du den Stau meist ohne Schaden lösen.`,
    causes: [
      "Papier schief/zu voll eingelegt",
      "Papier ist feucht/zu dick oder ungeeignet",
      "Reste von Papier stecken im Einzug oder an den Rollen"
    ],
    support:
      "Wenn der Stau immer wieder an der gleichen Stelle passiert, können Einzugsrollen verschmutzt oder abgenutzt sein.",
    synonyms: [
      "papierstau", "paper jam", "klemmt", "papier klemmt", "stau", "einzug"
    ],
    symptoms: [
      "papier steckt fest", "knittert papier", "zieht papier schief ein", "fehler papierstau"
    ]
  },

  "Drucker wird nicht erkannt": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} nicht erkannt wird, liegt es oft an USB/WLAN-Verbindung, falschem Netzwerk oder fehlenden Treibern. Mit den Schritten bekommst du die Verbindung meist schnell wieder hin.`,
    causes: [
      "USB-Kabel/Port hat Kontaktprobleme oder ist defekt",
      "Drucker im falschen WLAN (2,4 GHz/5 GHz) oder falsches Netzwerk",
      "Treiber fehlt oder ist veraltet"
    ],
    support:
      "Wenn der Drucker auf keinem Gerät erscheint, hilft oft ein Neustart von Drucker und Router sowie ein erneutes Hinzufügen des Druckers.",
    synonyms: [
      "nicht erkannt", "drucker gefunden", "findet drucker nicht", "treiber", "usb", "wlan drucker"
    ],
    symptoms: [
      "drucker taucht nicht auf", "installation findet drucker nicht", "verbindung fehlgeschlagen"
    ]
  },

  "Streifen im Druck / Schlechte Druckqualität": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} Streifen druckt oder die Druckqualität schlecht ist, liegt es häufig an leerer/defekter Patrone, verschmutzten Düsen oder falschen Qualitäts-Einstellungen. Mit den Schritten lässt sich das oft schnell verbessern.`,
    causes: [
      "Patrone/Toner fast leer oder eingetrocknet",
      "Druckköpfe/Düsen verschmutzt (Reinigung notwendig)",
      "Falsche Druckqualität oder falsches Papierprofil eingestellt"
    ],
    support:
      "Wenn Reinigungen nichts bringen, kann eine Patrone defekt sein oder der Druckkopf muss professionell gereinigt/ersetzt werden.",
    synonyms: [
      "streifen", "blass", "verschmiert", "druckqualität", "unscharf", "flecken", "aussetzer"
    ],
    symptoms: [
      "druckt blass", "linien im druck", "farbe fehlt", "text ist unscharf", "schmiert"
    ]
  },

  "Patrone / Toner wird nicht erkannt": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} die Patrone oder den Toner nicht erkennt, liegt es oft an falschem Sitz, Schutzfolie/Chip oder einer inkompatiblen Patrone. Mit den Schritten kannst du das meist selbst lösen.`,
    causes: [
      "Patrone/Toner sitzt nicht richtig oder Kontakt verschmutzt",
      "Schutzfolie/Transportsicherung nicht entfernt",
      "Inkompatible oder defekte Patrone (Chip/Elektronik)"
    ],
    support:
      "Wenn der Fehler auch mit einer neuen Originalpatrone bleibt, kann ein Defekt am Drucker-Kontakt/Schlitten vorliegen.",
    synonyms: [
      "patrone nicht erkannt", "toner nicht erkannt", "cartridge", "chip", "ink", "tinte", "toner"
    ],
    symptoms: [
      "zeigt patrone leer obwohl neu", "patronenfehler", "tonerfehler", "bitte patrone einsetzen"
    ]
  },

  "WLAN-Drucker verbindet nicht": {
    intro: ({ device, brand }) =>
      `Wenn dein ${brand ? brand + " " : ""}${device} sich nicht mit WLAN verbindet, liegt es meist am falschen Netzwerk, Passwort oder Router-Einstellungen. Mit den Schritten bekommst du die Verbindung oft schnell wieder stabil.`,
    causes: [
      "Falsches WLAN/Passwort oder wechselndes Netzwerk",
      "Router hängt oder blockiert Geräte (MAC-Filter/Kindersicherung)",
      "2,4 GHz vs. 5 GHz: Drucker unterstützt oft nur 2,4 GHz"
    ],
    support:
      "Wenn das WLAN ständig abbricht, hilft häufig: Router näher, Kanal wechseln oder den Drucker neu ins WLAN einrichten.",
    synonyms: [
      "wlan drucker", "wifi", "verbindet nicht", "offline", "netzwerk", "router", "2,4 ghz"
    ],
    symptoms: [
      "drucker offline", "verbindung bricht ab", "findet wlan nicht", "passwort wird abgelehnt"
    ]
  },


};

function getProblemCopy(issueName) {
  const keyN = normalize(issueName);
  for (const key of Object.keys(COPY)) {
    if (normalize(key) === keyN) return COPY[key];
  }
  return null;
}

/**
 * NEU (für Skalierung): alle Problem-Metadaten exportieren
 * -> wird von problemMeta.js genutzt.
 */
function getAllProblemCopy() {
  return COPY;
}

module.exports = { getProblemCopy, getAllProblemCopy };
