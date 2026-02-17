module.exports = function (eleventyConfig) {
  // date Filter für Nunjucks
  eleventyConfig.addFilter("date", (value, formatOrLocale = "de-DE") => {
    const d =
      value === "now"
        ? new Date()
        : value instanceof Date
        ? value
        : new Date(value);

    if (Number.isNaN(d.getTime())) return value;

    if (formatOrLocale === "yyyy") {
      return String(d.getFullYear());
    }

    return new Intl.DateTimeFormat(formatOrLocale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  });

  // ✅ NEU: Collection für sitemap
  eleventyConfig.addCollection("all", (collectionApi) => collectionApi.getAll());

  // Kopiert CSS/JS/JSON aus src/assets nach public/assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
  };
};
