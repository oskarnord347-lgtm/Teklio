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

    const deviceSlug = slugify(deviceName);

    const generalProblems = deviceObj[generalKey] || {};
    const brandsContainer = deviceObj.Marken || deviceObj.Systeme || {};
    const brandNames = Object.keys(brandsContainer);

    for (const issueName of Object.keys(generalProblems)) {
      const issueSlug = slugify(issueName);

      const base = generalProblems[issueName];
      const baseSteps = Array.isArray(base.steps) ? base.steps : [];
      const difficulty = base.difficulty || null;

      // 1) Allgemeine Seite
      pages.push({
        deviceName,
        deviceSlug,

        brandName: "Allgemein",
        brandSlug: "allgemein",

        system: null,

        issueName,
        issueSlug,

        difficulty,
        steps: baseSteps,

        // WICHTIG für Breadcrumbs:
        deviceUrl: `/${deviceSlug}/`,
        brandUrl: `/${deviceSlug}/allgemein/`,

        url: `/${deviceSlug}/allgemein/${issueSlug}/`,
        title: `${deviceName}: ${issueName} – Schritt-für-Schritt`,
        description: `Einfache Schritt-für-Schritt Anleitung: ${issueName} (${deviceName}).`,
      });

      // 2) Marken/System-Seiten (mit overrides)
      for (const brandName of brandNames) {
        const brandSlug = slugify(brandName);

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
          deviceSlug,

          brandName,
          brandSlug,

          system,

          issueName,
          issueSlug,

          difficulty,
          steps: mergedSteps,

          // WICHTIG für Breadcrumbs:
          deviceUrl: `/${deviceSlug}/`,
          brandUrl: `/${deviceSlug}/${brandSlug}/`,

          url: `/${deviceSlug}/${brandSlug}/${issueSlug}/`,
          title: `${brandName} ${deviceName}: ${issueName} – Schritt-für-Schritt`,
          description: `Schritt-für-Schritt Hilfe für ${brandName} ${deviceName}: ${issueName}.`,
        });
      }
    }
  }

  return pages;
};
