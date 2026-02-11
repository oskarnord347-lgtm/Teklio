// src/_data/guidesPages.js
const guides = require("./guides.json");

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/&/g, "und")
    .replace(/[^\w\s-]/g, "")   // Sonderzeichen raus
    .replace(/\s+/g, "-")       // Spaces -> -
    .replace(/-+/g, "-");       // Mehrfach- -> -
}

function normalize(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "")
    .replace(/\//g, "")
    .replace(/-/g, "");
}

// findet z.B. "Allgemeine_TV_Probleme"
function findGeneralProblemsKey(deviceObj) {
  return Object.keys(deviceObj).find(
    (k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme")
  );
}

module.exports = () => {
  const pages = [];

  for (const deviceName of Object.keys(guides)) {
    const deviceObj = guides[deviceName];
    const generalKey = findGeneralProblemsKey(deviceObj);
    if (!generalKey) continue;

    const generalProblems = deviceObj[generalKey] || {};
    const brandsContainer = deviceObj.Marken || deviceObj.Systeme || {};
    const brandNames = Object.keys(brandsContainer);

    for (const issueName of Object.keys(generalProblems)) {
      const base = generalProblems[issueName];
      const baseSteps = Array.isArray(base.steps) ? base.steps : [];
      const difficulty = base.difficulty || null;

      // 1) Allgemeine Seite
      pages.push({
        deviceName,
        brandName: "Allgemein",
        system: null,
        issueName,
        difficulty,
        steps: baseSteps,
        url: `/${slugify(deviceName)}/allgemein/${slugify(issueName)}/`,
        title: `${deviceName}: ${issueName} – Schritt-für-Schritt`,
        description: `Einfache Schritt-für-Schritt Anleitung: ${issueName} (${deviceName}).`,
      });

      // 2) Marken/System-Seiten (mit overrides)
      for (const brandName of brandNames) {
        const brandData = brandsContainer[brandName] || {};
        const overrides = brandData.overrides || {};
        let overrideSteps = [];

        // matching über normalize (weil Keys manchmal leicht anders sind)
        for (const key of Object.keys(overrides)) {
          if (normalize(key) === normalize(issueName)) {
            overrideSteps = Array.isArray(overrides[key]) ? overrides[key] : [];
            break;
          }
        }

        const mergedSteps = [...overrideSteps, ...baseSteps];
        const system = brandData.system || null;

        pages.push({
          deviceName,
          brandName,
          system,
          issueName,
          difficulty,
          steps: mergedSteps,
          url: `/${slugify(deviceName)}/${slugify(brandName)}/${slugify(issueName)}/`,
          title: `${brandName} ${deviceName}: ${issueName} – Schritt-für-Schritt`,
          description: `Schritt-für-Schritt Hilfe für ${brandName} ${deviceName}: ${issueName}.`,
        });
      }
    }
  }

  return pages;
};
