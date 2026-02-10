module.exports = function (eleventyConfig) {
  // Kopiert CSS/JS/JSON aus src/assets nach public/assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data"
    }
  };
};
