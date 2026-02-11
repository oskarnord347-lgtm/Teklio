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

module.exports = () => {
  const pages = [];

  for (const deviceName of Object.keys(guides)) {
    const deviceSlug = slugify(deviceName);
    pages.push({
      deviceName,
      deviceSlug,
      url: `/${deviceSlug}/`,
    });
  }

  return pages;
};
