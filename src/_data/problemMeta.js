// src/_data/problemMeta.js
const guides = require("./guides.json");
const { getAllProblemCopy } = require("./problemCopy");

function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "")
    .replace(/\//g, "")
    .replace(/-/g, "");
}

// findet z.B. "Allgemeine_TV_Probleme"
function findGeneralProblemsKey(deviceObj) {
  return Object.keys(deviceObj || {}).find(
    (k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme")
  );
}

module.exports = () => {
  const copy = getAllProblemCopy();
  const out = {}; // issueName -> { synonyms:[], symptoms:[] }

  // helper: copy-key per normalize matchen
  function findCopyEntry(issueName) {
    const n = normalize(issueName);
    for (const k of Object.keys(copy)) {
      if (normalize(k) === n) return copy[k];
    }
    return null;
  }

  for (const deviceName of Object.keys(guides)) {
    const deviceObj = guides[deviceName];
    const generalKey = findGeneralProblemsKey(deviceObj);
    if (!generalKey) continue;

    const generalProblems = deviceObj[generalKey] || {};
    for (const issueName of Object.keys(generalProblems)) {
      const entry = findCopyEntry(issueName);

      out[issueName] = {
        synonyms: Array.isArray(entry?.synonyms) ? entry.synonyms : [],
        symptoms: Array.isArray(entry?.symptoms) ? entry.symptoms : [],
      };
    }
  }

  return out;
};
