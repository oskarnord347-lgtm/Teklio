/* =========================
   THEME (läuft auf jeder Seite)
   ========================= */
(function themeInit() {
  var STORAGE_KEY = "teklio-theme"; // "light" | "dark" | "system"
  var root = document.documentElement;

  function getSystemTheme() {
    try {
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (e) {
      return "light";
    }
  }

  function applyTheme(choice) {
    var theme = choice === "system" ? getSystemTheme() : choice;
    root.setAttribute("data-theme", theme);
  }

  // gespeicherte Wahl anwenden (ohne Flackern – sobald JS geladen ist)
  var saved = localStorage.getItem(STORAGE_KEY) || "system";
  applyTheme(saved);

  function setActive(choice, pop) {
    if (!pop) return;
    var opts = pop.querySelectorAll(".theme-option");
    for (var i = 0; i < opts.length; i++) {
      var c = opts[i].getAttribute("data-theme-choice");
      opts[i].classList.toggle("active", c === choice);
    }
  }

  function openPopover(btn, pop) {
    pop.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closePopover(btn, pop) {
    pop.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeBtn");
    var pop = document.getElementById("themePopover");
    if (!btn || !pop) return;

    // Active-Zustand initial setzen
    setActive(saved, pop);

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (pop.classList.contains("open")) closePopover(btn, pop);
      else openPopover(btn, pop);
    });

    pop.addEventListener("click", function (e) {
      var target = e.target;
      if (!target) return;

      var opt = target.closest ? target.closest(".theme-option") : null;
      if (!opt) return;

      var choice = opt.getAttribute("data-theme-choice");
      localStorage.setItem(STORAGE_KEY, choice);
      applyTheme(choice);
      setActive(choice, pop);
      closePopover(btn, pop);
    });

    document.addEventListener("click", function () {
      closePopover(btn, pop);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closePopover(btn, pop);
    });

    // System-Theme-Wechsel live übernehmen, falls "system"
    try {
      if (window.matchMedia) {
        var mq = window.matchMedia("(prefers-color-scheme: dark)");
        if (mq && mq.addEventListener) {
          mq.addEventListener("change", function () {
            var currentChoice = localStorage.getItem(STORAGE_KEY) || "system";
            if (currentChoice === "system") applyTheme("system");
          });
        }
      }
    } catch (e) {}
  });
})();

/* =========================
   ASSISTENT (läuft NUR auf /assistent/)
   Zweistufig: Dropdown + Finder
   + StepLibrary Support
   + FIX: Finder kann global über alle Geräte suchen
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  let daten = {};
  let aktuellesGeraetObj = null;

  let currentIssueName = null;
  let currentSteps = [];
  let currentStepIndex = 0;

  // Nur für interne Unterscheidung (manuell vs auto gesetzt)
  let isAutoDeviceSelect = false;

  // (optional) später nutzbar – aktuell nicht zwingend
  let problemMeta = {};

  // StepLibrary (Browser lädt JSON)
  let stepLibrary = {}; // id -> { title, note, detail }

  // ====== Elemente holen ======
  const geraetSelect = document.getElementById("geraetSelect");
  const markeSelect = document.getElementById("markeSelect");

  // Stufe 1: Dropdown
  const problemSelect = document.getElementById("problemSelect");

  // Stufe 2: Finder
  const showProblemFinderBtn = document.getElementById("showProblemFinder");
  const problemFinderWrap = document.getElementById("problemFinderWrap");
  const problemFinder = document.getElementById("problemFinder");
  const problemSuggestions = document.getElementById("problemSuggestions");

  const anleitungDiv = document.getElementById("anleitung");

  const stepNav = document.getElementById("stepNav");
  const prevStepBtn = document.getElementById("prevStep");
  const nextStepBtn = document.getElementById("nextStep");
  const stepCounter = document.getElementById("stepCounter");

  const helpFeedback = document.getElementById("helpFeedback");
  const helpYes = document.getElementById("helpYes");
  const helpNo = document.getElementById("helpNo");

  const progressBar = document.getElementById("progressBar");

  const feedbackBtn = document.getElementById("feedbackBtn");
  const feedbackForm = document.getElementById("feedbackForm");
  const sendBtn = document.getElementById("sendFeedback");

  // Nur auf Assistent-Seite laufen lassen
  if (
    !geraetSelect ||
    !markeSelect ||
    !problemSelect ||
    !showProblemFinderBtn ||
    !problemFinderWrap ||
    !problemFinder ||
    !problemSuggestions ||
    !anleitungDiv
  )
    return;

  // ======================
  // NORMALIZE FUNCTION
  // ======================
  const normalize = (str) =>
    String(str)
      .toLowerCase()
      .trim()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/&/g, "und")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "")
      .replace(/_/g, "")
      .replace(/\//g, "")
      .replace(/-/g, "");

  // ======================
  // SMART FINDER HINTS
  // ======================
  const ISSUE_HINTS = {
    "kein ton": ["ton", "audio", "sound", "laut", "lautsprecher", "stumm", "mute"],
    "kein bild": ["schwarz", "black", "dunkel", "display", "screen", "anzeige", "bild"],
    "geht nicht an": ["an", "einschalten", "start", "startet", "power", "tot", "reagiert nicht", "led"],
    "wlan verbindet nicht": ["wlan", "wifi", "internet", "netz", "netzwerk", "verbindung", "online"],
  };

  // findet z.B. "Allgemeine_TV_Probleme"
  const findGeneralProblemsKey = (deviceObj) => {
    if (!deviceObj) return null;
    return Object.keys(deviceObj).find((k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme"));
  };

  function getGeneralProblemsObj(deviceObj) {
    const key = findGeneralProblemsKey(deviceObj);
    return key ? deviceObj[key] || {} : {};
  }

  function getIssuesForCurrentDevice() {
    if (!aktuellesGeraetObj) return [];
    const generalProblems = getGeneralProblemsObj(aktuellesGeraetObj);
    return Object.keys(generalProblems || {});
  }

  // ✅ NEU: globale Liste {device, issue}
  function getAllIssuesAcrossDevices() {
    const out = [];
    for (const deviceName of Object.keys(daten || {})) {
      const deviceObj = daten[deviceName];
      const general = getGeneralProblemsObj(deviceObj);
      for (const issueName of Object.keys(general || {})) {
        out.push({ device: deviceName, issue: issueName });
      }
    }
    return out;
  }

  // ======================
  // STEP LIBRARY -> Steps auflösen
  // ======================
  function resolveSteps(steps) {
    if (!Array.isArray(steps)) return [];

    return steps
      .map((s) => {
        // ALT: String
        if (typeof s === "string") {
          return { title: s, note: "", detail: null };
        }

        // NEU: { id: "..." }
        if (s && typeof s === "object" && s.id) {
          const lib = stepLibrary[s.id];
          if (lib && typeof lib === "object") return { id: s.id, ...lib };

          // Fallback: ID nicht gefunden
          return { id: s.id, title: s.id, note: "", detail: null };
        }

        // NEU: direkter Step als Objekt {title, note, detail}
        if (s && typeof s === "object" && s.title) {
          return s;
        }

        return null;
      })
      .filter(Boolean);
  }

  // ======================
  // UI HELPERS
  // ======================
  function hideSuggestions() {
    problemSuggestions.innerHTML = "";
    problemSuggestions.style.display = "none";
  }

  // ✅ kann Strings (lokal) oder Objekte {device, issue} (global)
  function showSuggestions(items) {
    if (!items.length) {
      hideSuggestions();
      return;
    }

    problemSuggestions.style.display = "block";
    problemSuggestions.innerHTML = items
      .map((it) => {
        if (typeof it === "string") {
          return `
            <li class="search-item">
              <a href="#" data-issue="${encodeURIComponent(it)}">
                <strong>${it}</strong><br/>
                <small>Problem auswählen</small>
              </a>
            </li>
          `;
        }

        const device = it.device || "";
        const issue = it.issue || "";
        return `
          <li class="search-item">
            <a href="#" data-device="${encodeURIComponent(device)}" data-issue="${encodeURIComponent(issue)}">
              <strong>${issue}</strong><br/>
              <small>${device}</small>
            </a>
          </li>
        `;
      })
      .join("");
  }

  // ======================
  // PROGRESS
  // ======================
  function updateProgress() {
    if (!progressBar || !currentSteps.length) return;
    const percent = ((currentStepIndex + 1) / currentSteps.length) * 100;
    progressBar.style.width = percent + "%";
  }

  // ======================
  // RESET FLOW
  // ======================
  function resetFlow({ keepDevice = false } = {}) {
    currentSteps = [];
    currentStepIndex = 0;
    currentIssueName = keepDevice ? currentIssueName : null;

    anleitungDiv.innerHTML = "";
    if (stepNav) stepNav.style.display = "none";
    if (helpFeedback) helpFeedback.style.display = "none";
    if (progressBar) progressBar.style.width = "0%";

    hideSuggestions();
  }

  // ======================
  // STEPS LADEN
  // ======================
  function loadSteps(issueName) {
    if (!aktuellesGeraetObj || !issueName) return;

    const generalProblems = getGeneralProblemsObj(aktuellesGeraetObj);
    const base = generalProblems[issueName];
    if (!base) return;

    const baseStepsRaw = Array.isArray(base.steps) ? base.steps : [];

    // Marke/System optional
    const brandChoice = (markeSelect.value || "Allgemein").trim();

    let overrideStepsRaw = [];
    if (brandChoice && brandChoice !== "Allgemein") {
      const container = aktuellesGeraetObj.Marken || aktuellesGeraetObj.Systeme || {};
      const brandData = container[brandChoice];

      if (brandData && brandData.overrides) {
        const overrides = brandData.overrides;
        for (const key of Object.keys(overrides)) {
          if (normalize(key) === normalize(issueName)) {
            overrideStepsRaw = Array.isArray(overrides[key]) ? overrides[key] : [];
            break;
          }
        }
      }
    }

    const baseSteps = resolveSteps(baseStepsRaw);
    const overrideSteps = resolveSteps(overrideStepsRaw);

    // Overrides zuerst
    currentSteps = [...overrideSteps, ...baseSteps];
    currentStepIndex = 0;

    if (progressBar) progressBar.style.width = "0%";
    if (stepNav) stepNav.style.display = "flex";
    if (helpFeedback) helpFeedback.style.display = "block";

    showStep();
  }

  // ======================
  // STEP ANZEIGEN
  // ======================
  function renderDetail(detail) {
    if (!detail) return "";

    // detail als string
    if (typeof detail === "string") {
      return `
        <details class="step-details">
          <summary>So geht’s</summary>
          <p>${detail}</p>
        </details>
      `;
    }

    // detail als object mit platform arrays
    const blocks = [];

    function addList(label, arr) {
      if (!Array.isArray(arr) || !arr.length) return;
      blocks.push(`<p><strong>${label}</strong></p>`);
      blocks.push("<ol>");
      for (const item of arr) blocks.push(`<li>${item}</li>`);
      blocks.push("</ol>");
    }

    addList("Allgemein", detail.allgemein);

    addList("Windows", detail.windows);
    addList("Mac", detail.mac);
    addList("Android", detail.android);
    addList("iPhone (iOS)", detail.ios);

    addList("Tizen (Samsung TV)", detail.tizen);
    addList("webOS (LG TV)", detail.webos);

    if (!blocks.length) return "";

    return `
      <details class="step-details">
        <summary>So geht’s</summary>
        ${blocks.join("")}
      </details>
    `;
  }

  function showStep() {
    anleitungDiv.innerHTML = "";
    if (!currentSteps.length) return;

    const stepObj = currentSteps[currentStepIndex] || {};
    const title = stepObj.title ? String(stepObj.title) : "Schritt";
    const note = stepObj.note ? String(stepObj.note) : "";
    const detailHTML = stepObj.detail ? renderDetail(stepObj.detail) : "";

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>Schritt ${currentStepIndex + 1} von ${currentSteps.length}</h3>
      <p><strong>${title}</strong></p>
      ${note ? `<p class="step-note">${note}</p>` : ""}
      ${detailHTML}
    `;
    anleitungDiv.appendChild(card);

    if (stepCounter) {
      stepCounter.textContent = `Schritt ${currentStepIndex + 1} / ${currentSteps.length}`;
      stepCounter.hidden = false;
    }

    if (prevStepBtn) prevStepBtn.disabled = currentStepIndex === 0;
    if (nextStepBtn) nextStepBtn.disabled = currentStepIndex === currentSteps.length - 1;

    if (prevStepBtn) prevStepBtn.hidden = false;
    if (nextStepBtn) nextStepBtn.hidden = false;

    updateProgress();
  }

  // ======================
  // NAVIGATION
  // ======================
  if (prevStepBtn) {
    prevStepBtn.addEventListener("click", () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        showStep();
      }
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener("click", () => {
      if (currentStepIndex < currentSteps.length - 1) {
        currentStepIndex++;
        showStep();
      }
    });
  }

  // ======================
  // HILFE → JA / NEIN
  // ======================
  if (helpYes) {
    helpYes.addEventListener("click", () => {
      anleitungDiv.innerHTML = `
        <div class="card">
          <h3>🎉 Super!</h3>
          <p>Freut mich, dass dein Problem gelöst wurde.</p>
          <p>Du kannst oben ein neues Problem auswählen.</p>
        </div>
      `;
      if (stepNav) stepNav.style.display = "none";
      if (helpFeedback) helpFeedback.style.display = "none";
      currentSteps = [];
      currentStepIndex = 0;
      if (progressBar) progressBar.style.width = "0%";
    });
  }

  if (helpNo) {
    helpNo.addEventListener("click", () => {
      if (currentStepIndex < currentSteps.length - 1) {
        currentStepIndex++;
        showStep();
        return;
      }
      anleitungDiv.innerHTML = `
        <div class="card">
          <h3>😕 Leider nicht gelöst</h3>
          <p>Alle Schritte wurden ausprobiert.</p>
          <p>Eventuell brauchst du technische Unterstützung.</p>
        </div>
      `;
      if (stepNav) stepNav.style.display = "none";
      if (helpFeedback) helpFeedback.style.display = "none";
      currentSteps = [];
      currentStepIndex = 0;
      if (progressBar) progressBar.style.width = "0%";
    });
  }

  // ======================
  // Dropdown + Finder Logik
  // ======================
  function fillProblemDropdown() {
    const issues = getIssuesForCurrentDevice();

    problemSelect.innerHTML = '<option value="">--Bitte wählen--</option>';
    issues.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      problemSelect.appendChild(opt);
    });

    problemSelect.disabled = false;
  }

  function closeFinder() {
    problemFinderWrap.style.display = "none";
    problemFinder.disabled = true;
    hideSuggestions();
  }

  function openFinder() {
    problemFinderWrap.style.display = "block";
    problemFinder.disabled = false;
    problemFinder.focus();
  }

  function computeSuggestions(query) {
    const qRaw = String(query || "").trim();
    const q = normalize(qRaw);
    if (!q || q.length < 2) return [];

    const tokens = qRaw
      .toLowerCase()
      .replace(/[^\w\säöüß-]/g, " ")
      .split(/\s+/)
      .map(normalize)
      .filter(Boolean);

    function hintBoostForIssue(issueName) {
      const issueNorm = normalize(issueName);
      let boost = 0;

      for (const [hintIssueKey, words] of Object.entries(ISSUE_HINTS)) {
        const keyNorm = normalize(hintIssueKey);

        const belongs =
          issueNorm === keyNorm || issueNorm.includes(keyNorm) || keyNorm.includes(issueNorm);
        if (!belongs) continue;

        for (const w of words) {
          const wn = normalize(w);
          if (!wn) continue;

          if (q.includes(wn)) boost += 4;
          if (tokens.includes(wn)) boost += 2;
        }
      }
      return boost;
    }

    // ✅ lokal (wenn Gerät gewählt)
    if (aktuellesGeraetObj) {
      const issues = getIssuesForCurrentDevice();
      const scored = [];

      for (const name of issues) {
        const n = normalize(name);
        let score = 0;

        if (n.startsWith(q)) score += 7;
        if (n.includes(q)) score += 4;

        for (const t of tokens) {
          if (!t) continue;
          if (n.includes(t)) score += 2;
        }

        score += hintBoostForIssue(name);
        if (q.length <= 5 && n.includes(q)) score += 3;

        if (score > 0) scored.push({ name, score });
      }

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 8).map((x) => x.name);
    }

    // ✅ global (wenn kein Gerät gewählt)
    const all = getAllIssuesAcrossDevices();
    const scored = [];

    for (const entry of all) {
      const issueN = normalize(entry.issue);
      const devN = normalize(entry.device);
      let score = 0;

      if (issueN.startsWith(q)) score += 8;
      if (issueN.includes(q)) score += 5;

      if (devN.startsWith(q)) score += 9;
      if (devN.includes(q)) score += 4;

      for (const t of tokens) {
        if (!t) continue;
        if (issueN.includes(t)) score += 2;
        if (devN.includes(t)) score += 1;
      }

      score += hintBoostForIssue(entry.issue);

      if (q.length <= 5 && (issueN.includes(q) || devN.includes(q))) score += 2;

      if (score > 0) scored.push({ entry, score });
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 8).map((x) => x.entry);
  }

  // ======================
  // JSON LADEN (Guides + ProblemMeta + StepLibrary)
  // ======================
  Promise.all([
    fetch("/assets/guides.json").then((r) => r.json()),
    fetch("/assets/problemMeta.json").then((r) => r.json()).catch(() => ({})),
    fetch("/assets/stepLibrary.json").then((r) => r.json()).catch(() => ({})),
  ])
    .then(([guidesData, metaData, stepLib]) => {
      daten = guidesData;
      problemMeta = metaData || {};
      stepLibrary = stepLib || {};

      Object.keys(daten).forEach((geraet) => {
        const opt = document.createElement("option");
        opt.value = geraet;
        opt.textContent = geraet;
        geraetSelect.appendChild(opt);
      });

      // Finder darf auch ohne Gerät geöffnet werden
      showProblemFinderBtn.disabled = false;
    })
    .catch(() => {
      console.warn("Fehler beim Laden der JSON-Daten.");
    });

  // ======================
  // GERÄT AUSWÄHLEN
  // ======================
  geraetSelect.addEventListener("change", (e) => {
    const selected = e.target.value;

    markeSelect.innerHTML = '<option value="Allgemein">Allgemein</option>';
    markeSelect.disabled = true;

    problemSelect.innerHTML = '<option value="">--Bitte wählen--</option>';
    problemSelect.disabled = true;

    // Nur schließen wenn User manuell im Dropdown gewählt hat
    if (!isAutoDeviceSelect) {
      closeFinder();
      problemFinder.value = "";
    } else {
      hideSuggestions();
    }

    resetFlow();

    if (!selected) {
      aktuellesGeraetObj = null;
      return;
    }

    aktuellesGeraetObj = daten[selected];

    const container = aktuellesGeraetObj.Marken || aktuellesGeraetObj.Systeme || {};
    const brandNames = Object.keys(container);

    for (const b of brandNames) {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      markeSelect.appendChild(opt);
    }

    markeSelect.disabled = false;
    fillProblemDropdown();
  });

  // ======================
  // PROBLEM AUS DROPDOWN
  // ======================
  problemSelect.addEventListener("change", () => {
    const issue = problemSelect.value;
    if (!issue) return;

    currentIssueName = issue;

    problemFinder.value = issue;
    closeFinder();

    resetFlow({ keepDevice: true });
    loadSteps(issue);
  });

  // ======================
  // "Ich finde mein Problem nicht" -> Finder öffnen
  // ======================
  showProblemFinderBtn.addEventListener("click", () => {
    openFinder();
  });

  // ======================
  // PROBLEM FINDER (tippen)
  // ======================
  problemFinder.addEventListener("input", () => {
    resetFlow({ keepDevice: true });

    const q = problemFinder.value || "";
    const items = computeSuggestions(q);
    showSuggestions(items);
  });

  // ✅ Klick auf Suggestion -> (global: Gerät setzen), dann Issue laden
  problemSuggestions.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    e.preventDefault();

    const issue = decodeURIComponent(a.getAttribute("data-issue") || "");
    const device = decodeURIComponent(a.getAttribute("data-device") || "");

    if (!issue) return;

    // global Treffer: Gerät setzen
    if (device) {
      isAutoDeviceSelect = true;
      geraetSelect.value = device;
      geraetSelect.dispatchEvent(new Event("change", { bubbles: true }));
      isAutoDeviceSelect = false;
    }

    currentIssueName = issue;
    problemFinder.value = issue;

    // Dropdown synchronisieren (falls vorhanden)
    if (problemSelect) problemSelect.value = issue;

    closeFinder();

    resetFlow({ keepDevice: true });
    loadSteps(issue);
  });

  // Enter: wenn genau 1 Vorschlag -> nehmen
  problemFinder.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFinder();
      problemFinder.blur();
    }
    if (e.key === "Enter") {
      const items = computeSuggestions(problemFinder.value || "");
      if (items.length === 1) {
        e.preventDefault();

        const one = items[0];

        // lokal: string, global: object
        let issue = "";
        let device = "";

        if (typeof one === "string") {
          issue = one;
        } else {
          issue = one.issue || "";
          device = one.device || "";
        }

        if (!issue) return;

        if (device) {
          isAutoDeviceSelect = true;
          geraetSelect.value = device;
          geraetSelect.dispatchEvent(new Event("change", { bubbles: true }));
          isAutoDeviceSelect = false;
        }

        currentIssueName = issue;
        problemFinder.value = issue;
        if (problemSelect) problemSelect.value = issue;

        closeFinder();
        resetFlow({ keepDevice: true });
        loadSteps(issue);
      }
    }
  });

  // click outside: suggestions schließen (aber Finder offen lassen)
  document.addEventListener("click", (e) => {
    if (e.target === problemFinder || problemSuggestions.contains(e.target)) return;
    hideSuggestions();
  });

  // ======================
  // MARKE ÄNDERN -> Schritte neu laden
  // ======================
  markeSelect.addEventListener("change", () => {
    if (currentIssueName) {
      resetFlow({ keepDevice: true });
      loadSteps(currentIssueName);
    }
  });

  // ======================
  // FEEDBACK (wie gehabt)
  // ======================
  if (feedbackBtn && feedbackForm) {
    feedbackBtn.addEventListener("click", () => {
      feedbackForm.style.display = feedbackForm.style.display === "block" ? "none" : "block";
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", () => {
      const nameEl = document.getElementById("name");
      const msgEl = document.getElementById("message");
      const name = nameEl ? nameEl.value.trim() : "";
      const message = msgEl ? msgEl.value.trim() : "";

      if (!name || !message) {
        alert("Bitte Name und Nachricht ausfüllen!");
        return;
      }

      console.log("📩 Feedback:", { name, message });
      alert("Danke für dein Feedback!");

      if (feedbackForm) feedbackForm.style.display = "none";
      if (nameEl) nameEl.value = "";
      if (msgEl) msgEl.value = "";
    });
  }
});

/* =========================
   GUIDE: <details>/<summary> Fix
   (nur wenn wirklich step-details da sind)
   ========================= */
document.addEventListener("click", (e) => {
  const summary = e.target && e.target.closest ? e.target.closest("summary") : null;
  if (!summary) return;

  // nur unsere Step-Details anfassen
  const details = summary.parentElement;
  if (!details || details.tagName !== "DETAILS") return;
  if (!details.classList.contains("step-details")) return;

  // Native Toggle kann durch anderes JS blockiert werden -> manuell togglen
  details.open = !details.open;
  e.preventDefault();
});
