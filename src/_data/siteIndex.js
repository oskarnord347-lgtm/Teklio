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
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function findGeneralProblemsKey(deviceObj) {
  return Object.keys(deviceObj).find(
    (k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme")
  );
}

module.exports = () => {
  const index = {
    byDevice: {}, // deviceSlug -> { deviceName, brands: [{brandName, brandSlug, system}], issues: [{issueName, issueSlug}] }
  };

  for (const deviceName of Object.keys(guides)) {
    const deviceObj = guides[deviceName];
    const deviceSlug = slugify(deviceName);

    const generalKey = findGeneralProblemsKey(deviceObj);
    const generalProblems = generalKey ? deviceObj[generalKey] : {};
    const issues = Object.keys(generalProblems || {}).map((issueName) => ({
      issueName,
      issueSlug: slugify(issueName),
    }));

    const container = deviceObj.Marken || deviceObj.Systeme || {};
    const brands = Object.keys(container).map((brandName) => ({
      brandName,
      brandSlug: slugify(brandName),
      system: container[brandName]?.system || null,
    }));

    // "Allgemein" immer als Marke mit reinnehmen
    brands.unshift({ brandName: "Allgemein", brandSlug: "allgemein", system: null });

    index.byDevice[deviceSlug] = {
      deviceName,
      deviceSlug,
      brands,
      issues,
    };
  }

  return index;
};
