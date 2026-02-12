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
      "Wenn keine Reaktion (auch keine LED) zu sehen ist, kann ein Defekt am Netzteil oder der Hauptplatine vorliegen."
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
      "Wenn nach allen Schritten weiterhin kein Ton zu hören ist, könnte ein Hardwaredefekt (Lautsprecher/Board) vorliegen."
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
      "Wenn Menü/OSD auch nicht erscheint, kann es ein Panel-/Backlight-Problem sein."
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
      "Wenn Tasten am Gerät funktionieren, ist die Fernbedienung selbst wahrscheinlich die Ursache."
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
      "Wenn andere Geräte auch kein WLAN haben, liegt es sehr wahrscheinlich am Router/Provider."
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
      "Wenn der PC keinerlei Lebenszeichen zeigt, ist ein Hardwaredefekt möglich (Netzteil/Mainboard)."
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
      "Wenn alle Geräte kein Internet haben, liegt es meist am Router oder Provider."
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
      "Wenn es dauerhaft sehr langsam bleibt, kann eine Überprüfung von Festplatte/SSD oder RAM sinnvoll sein."
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
      "Wenn es nur in einem Winkel lädt oder gar nicht mehr, kann die Ladebuchse defekt sein."
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
      "Wenn andere Geräte problemlos ins WLAN kommen, lohnt sich „Netzwerk vergessen“ und neu verbinden."
  }
};

function getProblemCopy(issueName) {
  const keyN = normalize(issueName);
  for (const key of Object.keys(COPY)) {
    if (normalize(key) === keyN) return COPY[key];
  }
  return null;
}

module.exports = { getProblemCopy };
