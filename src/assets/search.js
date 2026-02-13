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

  // normalisiert auf "worte mit leerzeichen" (gut zum matching)
  const normalize = (str) =>
    String(str)
      .toLowerCase()
      .trim()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/&/g, "und")
      .replace(/[^\w\s-]/g, " ")
      .replace(/_/g, " ")
      .replace(/\//g, " ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // normalisiert auf "ohne leerzeichen" (gut um "drucker" exakt zu matchen)
  const compact = (str) => normalize(str).replace(/\s+/g, "");

  const findGeneralProblemsKey = (deviceObj) =>
    Object.keys(deviceObj || {}).find(
      (k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme")
    );

  const STOPWORDS = new Set([
    "der",
    "die",
    "das",
    "ein",
    "eine",
    "einen",
    "einem",
    "einer",
    "und",
    "oder",
    "bei",
    "beim",
    "am",
    "an",
    "auf",
    "im",
    "in",
    "mit",
    "für",
    "von",
    "zum",
    "zur",
    "nicht",
    "kein",
    "keine",
    "geht",
  ]);

  const SYNONYMS = {
    // device synonyms (optional)
    printer: ["drucker"],
    drucker: ["printer"],

    // issue synonyms (optional)
    wlan: ["wifi", "internet", "netz", "netzwerk", "verbindung"],
    wifi: ["wlan", "internet", "netzwerk"],
    internet: ["wlan", "wifi", "netzwerk"],
    ton: ["audio", "sound", "lautsprecher"],
    audio: ["ton", "sound", "lautsprecher"],
    sound: ["ton", "audio", "lautsprecher"],
    bild: ["screen", "anzeige", "display"],
    display: ["bild", "screen", "anzeige"],
  };

  const tokenize = (q) => {
    const base = normalize(q).split(" ").filter(Boolean);
    const cleaned = base
      .map((t) => t.trim())
      .filter((t) => t.length >= 2)
      .filter((t) => !STOPWORDS.has(t));

    const expanded = [];
    for (const t of cleaned) {
      expanded.push(t);
      const syn = SYNONYMS[t];
      if (syn) expanded.push(...syn.slice(0, 3));
    }

    return Array.from(new Set(expanded)).slice(0, 12);
  };

  // Levenshtein (für "papie" -> "papier" / "papierstau")
  function levenshtein(a, b) {
    if (a === b) return 0;
    const al = a.length,
      bl = b.length;
    if (al === 0) return bl;
    if (bl === 0) return al;

    const v0 = new Array(bl + 1);
    const v1 = new Array(bl + 1);
    for (let i = 0; i <= bl; i++) v0[i] = i;

    for (let i = 0; i < al; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < bl; j++) {
        const cost = a[i] === b[j] ? 0 : 1;
        v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
      }
      for (let j = 0; j <= bl; j++) v0[j] = v1[j];
    }
    return v1[bl];
  }

  function tokenMatchScore(token, haystackText) {
    if (!token || !haystackText) return 0;

    // direkter contains
    if (haystackText.includes(token)) return 3;

    // prefix match auf wörter
    const words = haystackText.split(" ");
    if (words.some((w) => w.startsWith(token))) return 2;

    // typo tolerance (3-6 chars)
    if (token.length >= 3 && token.length <= 6) {
      for (const w of words) {
        if (Math.abs(w.length - token.length) > 2) continue;
        const d = levenshtein(token, w);
        if (d === 1) return 1.5;
      }
    }
    return 0;
  }

  let problemEntries = [];
  let brandEntries = [];
  let deviceIndex = []; // [{deviceName, deviceText, deviceCompact, deviceSlug}]

  function buildEntries(guides) {
    const problems = [];
    const brands = [];
    const devices = [];

    for (const deviceName of Object.keys(guides || {})) {
      const deviceObj = guides[deviceName];
      const deviceSlug = slugify(deviceName);
      const deviceText = normalize(deviceName);
      const deviceCompact = compact(deviceName);

      devices.push({ deviceName, deviceText, deviceCompact, deviceSlug });

      const generalKey = findGeneralProblemsKey(deviceObj);
      const generalProblems = generalKey ? deviceObj[generalKey] : {};
      const issueNames = Object.keys(generalProblems || {});

      const container = deviceObj.Marken || deviceObj.Systeme || {};
      const brandNames = Object.keys(container || {});

      for (const issueName of issueNames) {
        const issueSlug = slugify(issueName);
        const issueText = normalize(issueName);

        problems.push({
          type: "problem",
          device: deviceName,
          issue: issueName,
          brand: "Allgemein",
          url: `/${deviceSlug}/allgemein/${issueSlug}/`,
          title: `${deviceName}: ${issueName}`,
          deviceText,
          issueText,
          allText: normalize(`${deviceName} ${issueName}`),
        });

        for (const brandName of brandNames) {
          const brandSlug = slugify(brandName);
          const brandText = normalize(brandName);

          brands.push({
            type: "brand",
            device: deviceName,
            brand: brandName,
            issue: issueName,
            url: `/${deviceSlug}/${brandSlug}/${issueSlug}/`,
            title: `${brandName} ${deviceName}: ${issueName}`,
            deviceText,
            issueText,
            brandText,
            allText: normalize(`${deviceName} ${brandName} ${issueName}`),
          });
        }
      }
    }

    problemEntries = problems;
    brandEntries = brands;
    deviceIndex = devices;
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

  function scoreProblemEntry(e, tokens) {
    let s = 0;
    for (const t of tokens) {
      s += tokenMatchScore(t, e.issueText) * 2.2;
      s += tokenMatchScore(t, e.deviceText) * 1.2;
      s += tokenMatchScore(t, e.allText) * 0.8;
    }
    return s;
  }

  function scoreBrandEntry(e, tokens) {
    let s = 0;
    for (const t of tokens) {
      s += tokenMatchScore(t, e.issueText) * 2.0;
      s += tokenMatchScore(t, e.deviceText) * 1.0;
      s += tokenMatchScore(t, e.brandText) * 1.2;
      s += tokenMatchScore(t, e.allText) * 0.8;
    }
    return s;
  }

  function search(q) {
    const qNorm = normalize(q);
    const qCompact = compact(q);
    if (!qNorm || qNorm.length < 2) return [];

    const tokens = tokenize(q);
    if (!tokens.length) return [];

    // ✅ 0) Super-robust: wenn Query exakt ein Gerätestring ist -> alle Probleme dieses Geräts
    // Das fixt genau deinen Fall: "drucker" => Drucker-Probleme (nicht Computer-Issue)
    const deviceExact = deviceIndex.find((d) => d.deviceCompact === qCompact);
    if (deviceExact) {
      const list = problemEntries
        .filter((e) => compact(e.device) === deviceExact.deviceCompact)
        .map((e) => ({ e, s: scoreProblemEntry(e, tokens) || 1 }));

      list.sort((a, b) => b.s - a.s);
      return list.slice(0, 10).map((x) => x.e);
    }

    // 1) Normal: best scoring Problems + Brands
    const scored = [];

    for (const e of problemEntries) {
      const s = scoreProblemEntry(e, tokens);
      if (s >= 2) scored.push({ e, s });
    }
    for (const e of brandEntries) {
      const s = scoreBrandEntry(e, tokens);
      if (s >= 3.5) scored.push({ e, s }); // Brands etwas strenger
    }

    scored.sort((a, b) => b.s - a.s);

    // dedupe by url + limit
    const out = [];
    const seen = new Set();
    for (const x of scored) {
      if (seen.has(x.e.url)) continue;
      seen.add(x.e.url);
      out.push(x.e);
      if (out.length >= 10) break;
    }

    return out;
  }

  // Load guides once
  fetch("/assets/guides.json")
    .then((r) => r.json())
    .then((guides) => {
      buildEntries(guides);
    })
    .catch(() => {});

  let t;
  input.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = input.value || "";
      render(search(q));
    }, 120);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      render([]);
      input.blur();
    }
  });

  document.addEventListener("click", (e) => {
    if (e.target === input || results.contains(e.target)) return;
    render([]);
  });
})();
