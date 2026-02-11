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
  const pages = [];

  for (const deviceName of Object.keys(guides)) {
    const deviceObj = guides[deviceName];
    const deviceSlug = slugify(deviceName);

    const generalKey = findGeneralProblemsKey(deviceObj);
    const generalProblems = generalKey ? deviceObj[generalKey] : {};
    const issueNames = Object.keys(generalProblems || {});

    const container = deviceObj.Marken || deviceObj.Systeme || {};
    const brandNames = Object.keys(container);

    // Allgemein-Seite
    pages.push({
      deviceName,
      deviceSlug,
      brandName: "Allgemein",
      brandSlug: "allgemein",
      system: null,
      url: `/${deviceSlug}/allgemein/`,
      issues: issueNames.map((issueName) => ({
        issueName,
        url: `/${deviceSlug}/allgemein/${slugify(issueName)}/`,
      })),
    });

    // Marken/System-Seiten
    for (const brandName of brandNames) {
      const brandSlug = slugify(brandName);
      const system = container[brandName]?.system || null;

      pages.push({
        deviceName,
        deviceSlug,
        brandName,
        brandSlug,
        system,
        url: `/${deviceSlug}/${brandSlug}/`,
        issues: issueNames.map((issueName) => ({
          issueName,
          url: `/${deviceSlug}/${brandSlug}/${slugify(issueName)}/`,
        })),
      });
    }
  }

  return pages;
};
