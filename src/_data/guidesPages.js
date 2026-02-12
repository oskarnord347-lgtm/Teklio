// src/_data/guidesPages.js
const guides = require("./guides.json");
const { getProblemCopy } = require("./problemCopy");

// OPTIONAL: Step Library (falls Datei noch nicht existiert, läuft es trotzdem)
let stepLibrary = {};
try {
  stepLibrary = require("./stepLibrary");
} catch (e) {
  stepLibrary = {};
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/&/g, "und")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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

function findGeneralProblemsKey(deviceObj) {
  return Object.keys(deviceObj).find(
    (k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme")
  );
}

// ✨ Moderner Intro-Text (ohne Schritt-für-Schritt)
function defaultIntro({ device, brand, issue, system }) {
  const brandPart = brand ? `${brand} ` : "";
  const systemPart = system ? ` (System: ${system})` : "";
  return `Hier findest du eine verständliche Anleitung zur Lösung des Problems „${issue}“ bei deinem ${brandPart}${device}${systemPart}. In vielen Fällen lässt sich das Problem schnell selbst beheben.`;
}

/**
 * Steps auflösen:
 * - string bleibt string (Altbestand)
 * - {id} wird mit stepLibrary[id] zu { title, note, detail }
 * - {custom:{...}} erlaubt komplett eigene Steps im JSON
 */
function resolveSteps(steps) {
  if (!Array.isArray(steps)) return [];

  return steps
    .map((s) => {
      // Alt: string
      if (typeof s === "string") return s;

      // Neu: { id, note? }
      if (s && typeof s === "object" && s.id) {
        const lib = stepLibrary[s.id];

        if (lib && typeof lib === "object") {
          // note aus JSON darf Library-Note überschreiben (praktisch)
          return { id: s.id, ...lib, ...(s.note ? { note: s.note } : {}) };
        }

        // Fallback: unbekannte ID
        return {
          id: s.id,
          title: s.note || s.id,
          note: s.note || "",
          detail: null,
        };
      }

      // Neu: { custom: { title, note, detail } }
      if (s && typeof s === "object" && s.custom && typeof s.custom === "object") {
        return { ...s.custom };
      }

      return null;
    })
    .filter(Boolean);
}

function attachCopy(pageObj) {
  const ctx = {
    device: pageObj.deviceName,
    brand:
      pageObj.brandName && pageObj.brandName !== "Allgemein"
        ? pageObj.brandName
        : "",
    system: pageObj.system || "",
    issue: pageObj.issueName,
  };

  const copy = getProblemCopy(pageObj.issueName);

  pageObj.intro = copy?.intro
    ? typeof copy.intro === "function"
      ? copy.intro(ctx)
      : String(copy.intro)
    : defaultIntro(ctx);

  pageObj.causes = Array.isArray(copy?.causes) ? copy.causes : null;
  pageObj.support = copy?.support ? copy.support : null;

  return pageObj;
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
      const baseStepsRaw = Array.isArray(base.steps) ? base.steps : [];
      const difficulty = base.difficulty || null;

      // ✅ Base Steps (aufgelöst)
      const baseSteps = resolveSteps(baseStepsRaw);

      // ✅ 1) Allgemein-Seite
      pages.push(
        attachCopy({
          deviceName,
          deviceSlug,

          brandName: "Allgemein",
          brandSlug: "allgemein",

          system: null,

          issueName,
          issueSlug,

          difficulty,
          steps: baseSteps,

          deviceUrl: `/${deviceSlug}/`,
          brandUrl: `/${deviceSlug}/allgemein/`,

          url: `/${deviceSlug}/allgemein/${issueSlug}/`,
          title: `${deviceName}: ${issueName}`,
          description: `Anleitung zur Lösung von „${issueName}“ bei ${deviceName}. Verständlich erklärt und einfach umsetzbar.`,
        })
      );

      // ✅ 2) Marken/System-Seiten
      for (const brandName of brandNames) {
        const brandSlug = slugify(brandName);

        const brandData = brandsContainer[brandName] || {};
        const overrides = brandData.overrides || {};
        let overrideStepsRaw = [];

        for (const key of Object.keys(overrides)) {
          if (normalize(key) === normalize(issueName)) {
            overrideStepsRaw = Array.isArray(overrides[key]) ? overrides[key] : [];
            break;
          }
        }

        const overrideSteps = resolveSteps(overrideStepsRaw);
        const mergedSteps = [...overrideSteps, ...baseSteps];

        const system = brandData.system || null;

        pages.push(
          attachCopy({
            deviceName,
            deviceSlug,

            brandName,
            brandSlug,

            system,

            issueName,
            issueSlug,

            difficulty,
            steps: mergedSteps,

            deviceUrl: `/${deviceSlug}/`,
            brandUrl: `/${deviceSlug}/${brandSlug}/`,

            url: `/${deviceSlug}/${brandSlug}/${issueSlug}/`,
            title: `${brandName} ${deviceName}: ${issueName}`,
            description: `Anleitung zur Lösung von „${issueName}“ bei ${brandName} ${deviceName}. Klar strukturiert und direkt umsetzbar.`,
          })
        );
      }
    }
  }

  return pages;
};
