// === Testdaten ===
const overrides = {
  "Geht nicht an": ["Schritt 1: Netz prüfen", "Schritt 2: Stecker ziehen"],
  "Kein Ton": ["Schritt A: Lautstärke prüfen", "Schritt B: HDMI prüfen"]
};

// === Testproblem ===
const selectedProblem = "Geht nicht an"; // genau so, wie es aus deinem Dropdown kommen würde

// === Normalize-Funktion aus deinem Skript ===
const normalize = str =>
  str.toLowerCase()
     .replace(/\s+/g, '')
     .replace(/_/g, '')
     .replace(/\//g, '')
     .replace(/-/g, '');

// === Test-Matching ===
let matchFound = false;

for (let key of Object.keys(overrides)) {
  console.log("Vergleiche:", key, "↔", selectedProblem);
  
  if (normalize(key) === normalize(selectedProblem)) {
    console.log("✅ MATCH! Override gefunden:", overrides[key]);
    matchFound = true;
    break;
  }
}

if (!matchFound) {
  console.log("❌ Kein Match gefunden!");
}
