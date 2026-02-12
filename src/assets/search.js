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
      .replace(/\s+/g, " ")
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

  const findGeneralProblemsKey = (deviceObj) =>
    Object.keys(deviceObj).find(
      (k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme")
    );

  // --- Synonyme / UX: kleine Map, die du leicht erweitern kannst ---
  const SYNONYMS = {
    wlan: ["wifi", "internet", "netz", "netzwerk", "verbindung"],
    wifi: ["wlan", "internet", "netzwerk"],
    internet: ["wlan", "wifi", "netzwerk"],
    ton: ["audio", "sound", "lautsprecher"],
    audio: ["ton", "sound", "lautsprecher"],
    sound: ["ton", "audio", "lautsprecher"],
    an: ["start", "power", "einschalten"],
    einschalten: ["an", "start", "power"],
    startet: ["an", "boot", "hochfahren"],
    bild: ["screen", "anzeige", "display"],
    display: ["bild", "screen", "anzeige"],
  };

  const STOPWORDS = new Set([
    "der","die","das","ein","eine","einen","einem","einer",
    "und","oder","bei","beim","beim","am","an","auf","im","in",
    "mit","für","von","zum","zur","nicht","kein","keine","geht",
  ]);

  const tokenize = (q) => {
    const base = normalize(q).split(" ").filter(Boolean);
    const cleaned = base
      .map((t) => t.trim())
      .filter((t) => t.length >= 2)
      .filter((t) => !STOPWORDS.has(t));

    // Synonyme expanden (aber begrenzen)
    const expanded = [];
    for (const t of cleaned) {
      expanded.push(t);
      const syn = SYNONYMS[t];
      if (syn) expanded.push(...syn.slice(0, 3));
    }

    // Dedupe
    return Array.from(new Set(expanded)).slice(0, 12);
  };

  // kleine Tippfehler-Toleranz pro Token (nur für kurze Tokens anwenden)
  function levenshtein(a, b) {
    if (a === b) return 0;
    const al = a.length, bl = b.length;
    if (al === 0) return bl;
    if (bl === 0) return al;

    const v0 = new Array(bl + 1);
    const v1 = new Array(bl + 1);

    for (let i = 0; i <= bl; i++) v0[i] = i;

    for (let i = 0; i < al; i++) {
      v1[0] = i + 1;
      for (let j = 0; j < bl; j++) {
        const cost = a[i] === b[j] ? 0 : 1;
        v1[j + 1] = Math.min(
          v1[j] + 1,
          v0[j + 1] + 1,
          v0[j] + cost
        );
      }
      for (let j = 0; j <= bl; j++) v0[j] = v1[j];
    }
    return v1[bl];
  }

  function tokenMatchScore(token, haystackText) {
    // haystackText: normalize(...) already with spaces
    // direct contains
    if (haystackText.includes(token)) return 3;

    // prefix match any word
    const words = haystackText.split(" ");
    if (words.some((w) => w.startsWith(token))) return 2;

    // typo tolerance (only for tokens length 3-6)
    if (token.length >= 3 && token.length <= 6) {
      for (const w of words) {
        if (Math.abs(w.length - token.length) > 2) continue;
        const d = levenshtein(token, w);
        if (d === 1) return 1.5; // 1 typo
      }
    }

    return 0;
  }

  let problemEntries = [];
  let brandEntries = [];

  function buildEntries(guides) {
    const problems = [];
    const brands = [];

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

        const deviceText = normalize(deviceName);
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

  // erkennt Device/Issue fuzzy über Token-Scores
  function detectBestDevice(tokens) {
    // bestes Device anhand problemEntries (unique deviceText)
    const deviceSet = new Map(); // deviceText -> score
    for (const e of problemEntries) {
      if (deviceSet.has(e.deviceText)) continue;
      let s = 0;
      for (const t of tokens) s += tokenMatchScore(t, e.deviceText);
      deviceSet.set(e.deviceText, s);
    }

    let best = { key: null, score: 0 };
    for (const [k, s] of deviceSet.entries()) {
      if (s > best.score) best = { key: k, score: s };
    }
    return best.score >= 2 ? best.key : null; // threshold
  }

  function detectBestIssue(tokens) {
    // bestes Issue anhand problemEntries (unique issueText)
    const issueSet = new Map(); // issueText -> score
    for (const e of problemEntries) {
      if (issueSet.has(e.issueText)) continue;
      let s = 0;
      for (const t of tokens) s += tokenMatchScore(t, e.issueText);
      issueSet.set(e.issueText, s);
    }

    let best = { key: null, score: 0 };
    for (const [k, s] of issueSet.entries()) {
      if (s > best.score) best = { key: k, score: s };
    }
    return best.score >= 2 ? best.key : null; // threshold
  }

  function scoreProblemEntry(e, tokens) {
    let s = 0;
    for (const t of tokens) {
      s += tokenMatchScore(t, e.deviceText) * 1.2;
      s += tokenMatchScore(t, e.issueText) * 2.0;
      s += tokenMatchScore(t, e.allText) * 0.8;
    }
    return s;
  }

  function scoreBrandEntry(e, tokens) {
    let s = 0;
    for (const t of tokens) {
      s += tokenMatchScore(t, e.deviceText) * 1.0;
      s += tokenMatchScore(t, e.issueText) * 2.0;
      s += tokenMatchScore(t, e.brandText) * 1.2;
      s += tokenMatchScore(t, e.allText) * 0.8;
    }
    return s;
  }

  function search(q) {
    const raw = normalize(q);
    if (!raw || raw.length < 2) return [];

    const tokens = tokenize(q);
    if (!tokens.length) return [];

    const hitDeviceText = detectBestDevice(tokens); // z.B. "fernseher"
    const hitIssueText = detectBestIssue(tokens);   // z.B. "kein ton" -> "kein ton" normalisiert: "kein ton" (ohne stopwords ggf. "ton")

    // 1) Wenn Device erkannt, aber kein Issue: alle Probleme für Device (Allgemein)
    if (hitDeviceText && !hitIssueText) {
      const list = problemEntries
        .filter((e) => e.deviceText === hitDeviceText)
        .map((e) => ({ e, s: scoreProblemEntry(e, tokens) || 1 }));

      list.sort((a, b) => b.s - a.s);
      return list.slice(0, 10).map((x) => x.e);
    }

    // 2) Wenn Issue erkannt: streng nur dieses Issue (optional Device einschränken)
    if (hitIssueText) {
      const probs = [];
      for (const e of problemEntries) {
        if (e.issueText !== hitIssueText) continue;
        if (hitDeviceText && e.deviceText !== hitDeviceText) continue;
        probs.push({ e, s: scoreProblemEntry(e, tokens) || 1 });
      }
      probs.sort((a, b) => b.s - a.s);

      const brands = [];
      for (const e of brandEntries) {
        if (e.issueText !== hitIssueText) continue;
        if (hitDeviceText && e.deviceText !== hitDeviceText) continue;
        brands.push({ e, s: scoreBrandEntry(e, tokens) || 1 });
      }
      brands.sort((a, b) => b.s - a.s);

      const merged = [...probs.map((x) => x.e), ...brands.map((x) => x.e)];

      // dedupe + limit
      const seen = new Set();
      const out = [];
      for (const it of merged) {
        if (seen.has(it.url)) continue;
        seen.add(it.url);
        out.push(it);
        if (out.length >= 10) break;
      }
      return out;
    }

    // 3) Fallback: wenn weder Device noch Issue klar erkannt wird → best-scoring Probleme
    const scored = [];
    for (const e of problemEntries) {
      const s = scoreProblemEntry(e, tokens);
      if (s >= 2) scored.push({ e, s });
    }
    scored.sort((a, b) => b.s - a.s);
    return scored.slice(0, 10).map((x) => x.e);
  }

  // Load guides once
  fetch("/assets/guides.json")
    .then((r) => r.json())
    .then((guides) => {
      buildEntries(guides);
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
