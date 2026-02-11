(() => {
  const input = document.getElementById("siteSearch");
  const results = document.getElementById("searchResults");
  if (!input || !results) return;

  const slugify = (str) =>
    String(str)
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

  const normalize = (str) =>
    String(str)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "")
      .replace(/_/g, "")
      .replace(/\//g, "")
      .replace(/-/g, "");

  const findGeneralProblemsKey = (deviceObj) =>
    Object.keys(deviceObj).find((k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme"));

  let entries = []; // {title, url, device, brand, issue, keywords}

  function buildEntries(guides) {
    const out = [];

    for (const deviceName of Object.keys(guides)) {
      const deviceObj = guides[deviceName];
      const deviceSlug = slugify(deviceName);

      const generalKey = findGeneralProblemsKey(deviceObj);
      const generalProblems = generalKey ? deviceObj[generalKey] : {};
      const issueNames = Object.keys(generalProblems || {});

      const container = deviceObj.Marken || deviceObj.Systeme || {};
      const brandNames = Object.keys(container);

      for (const issueName of issueNames) {
        const issueSlug = slugify(issueName);

        // Allgemein
        out.push({
          device: deviceName,
          brand: "Allgemein",
          issue: issueName,
          url: `/${deviceSlug}/allgemein/${issueSlug}/`,
          title: `${deviceName}: ${issueName}`,
          keywords: normalize(`${deviceName} allgemein ${issueName}`),
        });

        // Marken/Systeme
        for (const brandName of brandNames) {
          const brandSlug = slugify(brandName);
          out.push({
            device: deviceName,
            brand: brandName,
            issue: issueName,
            url: `/${deviceSlug}/${brandSlug}/${issueSlug}/`,
            title: `${brandName} ${deviceName}: ${issueName}`,
            keywords: normalize(`${deviceName} ${brandName} ${issueName}`),
          });
        }
      }
    }

    return out;
  }

  function render(items) {
    if (!items.length) {
      results.innerHTML = "";
      results.style.display = "none";
      return;
    }

    results.style.display = "block";
    results.innerHTML = items
      .map(
        (it) => `
        <li class="search-item">
          <a href="${it.url}">
            <strong>${it.title}</strong><br/>
            <small>${it.brand}</small>
          </a>
        </li>
      `
      )
      .join("");
  }

  function search(q) {
    const nq = normalize(q);
    if (!nq || nq.length < 2) return [];

    // simple scoring: prefix/contains matches
    const scored = [];
    for (const e of entries) {
      const k = e.keywords;
      let score = 0;
      if (k.startsWith(nq)) score += 5;
      if (k.includes(nq)) score += 2;
      if (normalize(e.issue).includes(nq)) score += 2;
      if (normalize(e.brand).includes(nq)) score += 1;
      if (score > 0) scored.push({ e, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map((x) => x.e);
  }

  // Load guides once
  fetch("/assets/guides.json")
    .then((r) => r.json())
    .then((guides) => {
      entries = buildEntries(guides);
    })
    .catch(() => {
      // quietly fail
    });

  let t;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = input.value || "";
      render(search(q));
    }, 120);
  });

  // hide on escape
  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      render([]);
      input.blur();
    }
  });

  // click outside to close
  document.addEventListener("click", (e) => {
    if (e.target === input || results.contains(e.target)) return;
    render([]);
  });
})();
