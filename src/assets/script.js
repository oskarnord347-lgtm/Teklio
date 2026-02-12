/* =========================
   THEME (läuft auf jeder Seite)
   ========================= */
(function themeInit() {
  var STORAGE_KEY = "teklio-theme"; // "light" | "dark" | "system"
  var root = document.documentElement;

  function getSystemTheme() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } catch (e) {
      return "light";
    }
  }

  function applyTheme(choice) {
    var theme = (choice === "system") ? getSystemTheme() : choice;
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
   Zweistufig: Dropdown + optionaler Finder
   ========================= */
document.addEventListener("DOMContentLoaded", () => {
  let daten = {};
  let aktuellesGeraetObj = null;

  let currentIssueName = null;
  let currentSteps = [];
  let currentStepIndex = 0;

  // ====== Elemente holen ======
  const geraetSelect = document.getElementById("geraetSelect");
  const markeSelect = document.getElementById("markeSelect");

  // Stufe 1: Dropdown
  const problemSelect = document.getElementById("problemSelect");

  // Stufe 2: optionaler Finder
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
    !geraetSelect || !markeSelect ||
    !problemSelect || !showProblemFinderBtn || !problemFinderWrap ||
    !problemFinder || !problemSuggestions ||
    !anleitungDiv
  ) return;

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
    "wlan verbindet nicht": ["wlan", "wifi", "internet", "netz", "netzwerk", "verbindung", "online"]
  };
  // findet z.B. "Allgemeine_TV_Probleme"
  const findGeneralProblemsKey = (deviceObj) => {
    if (!deviceObj) return null;
    return Object.keys(deviceObj).find(
      (k) => k.startsWith("Allgemeine_") && k.endsWith("_Probleme")
    );
  };

  function getGeneralProblemsObj(deviceObj) {
    const key = findGeneralProblemsKey(deviceObj);
    return key ? (deviceObj[key] || {}) : {};
  }

  function getIssuesForCurrentDevice() {
    if (!aktuellesGeraetObj) return [];
    const generalProblems = getGeneralProblemsObj(aktuellesGeraetObj);
    return Object.keys(generalProblems || {});
  }

  // ======================
  // UI HELPERS
  // ======================
  function hideSuggestions() {
    problemSuggestions.innerHTML = "";
    problemSuggestions.style.display = "none";
  }

  function showSuggestions(items) {
    if (!items.length) {
      hideSuggestions();
      return;
    }
    problemSuggestions.style.display = "block";
    problemSuggestions.innerHTML = items
      .map(
        (name) => `
        <li class="search-item">
          <a href="#" data-issue="${encodeURIComponent(name)}">
            <strong>${name}</strong><br/>
            <small>Problem auswählen</small>
          </a>
        </li>
      `
      )
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

    const baseSteps = Array.isArray(base.steps) ? base.steps : [];

    // Marke/System optional
    const brandChoice = (markeSelect.value || "Allgemein").trim();

    let overrideSteps = [];
    if (brandChoice && brandChoice !== "Allgemein") {
      const container = aktuellesGeraetObj.Marken || aktuellesGeraetObj.Systeme || {};
      const brandData = container[brandChoice];

      if (brandData && brandData.overrides) {
        const overrides = brandData.overrides;
        const keys = Object.keys(overrides);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (normalize(key) === normalize(issueName)) {
            overrideSteps = Array.isArray(overrides[key]) ? overrides[key] : [];
            break;
          }
        }
      }
    }

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
  function showStep() {
    anleitungDiv.innerHTML = "";
    if (!currentSteps.length) return;

    const stepText = currentSteps[currentStepIndex];

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>Schritt ${currentStepIndex + 1} von ${currentSteps.length}</h3>
      <p>${stepText}</p>
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

  const issues = getIssuesForCurrentDevice();
  const scored = [];

  // Query tokens (für "wifi geht nicht")
  const tokens = qRaw
    .toLowerCase()
    .replace(/[^\w\säöüß-]/g, " ")
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean);

  // Helper: Synonym-Boost finden
  function hintBoostForIssue(issueName) {
    const issueNorm = normalize(issueName);

    let boost = 0;

    for (const [hintIssueKey, words] of Object.entries(ISSUE_HINTS)) {
      // passt der Hint-Key zu einem echten Issue?
      // (z.B. "geht nicht an" -> echter Issue könnte "Geht nicht an" heißen)
      const keyNorm = normalize(hintIssueKey);

      // wenn dieser Hint-Key ungefähr zu diesem issue gehört
      // entweder direkt gleich oder issue enthält key / key enthält issue
      const belongs =
        issueNorm === keyNorm ||
        issueNorm.includes(keyNorm) ||
        keyNorm.includes(issueNorm);

      if (!belongs) continue;

      // wenn Query eines der Synonyme enthält -> Boost
      for (const w of words) {
        const wn = normalize(w);
        if (!wn) continue;

        if (q.includes(wn)) boost += 4; // starke Gewichtung
        if (tokens.includes(wn)) boost += 2;
      }
    }

    return boost;
  }

  for (const name of issues) {
    const n = normalize(name);
    let score = 0;

    // klassisches Matching auf Problemname
    if (n.startsWith(q)) score += 7;
    if (n.includes(q)) score += 4;

    // token matching: wenn einzelne Wörter passen
    for (const t of tokens) {
      if (!t) continue;
      if (n.includes(t)) score += 2;
    }

    // Synonym/Hint boost
    score += hintBoostForIssue(name);

    // kleine Bonus-Regel: kurze Eingaben wie "wlan", "ton", "bild"
    if (q.length <= 5 && n.includes(q)) score += 3;

    if (score > 0) scored.push({ name, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map((x) => x.name);
}


  // ======================
  // JSON LADEN
  // ======================
  fetch("/assets/guides.json")
    .then((res) => res.json())
    .then((data) => {
      daten = data;

      Object.keys(daten).forEach((geraet) => {
        const opt = document.createElement("option");
        opt.value = geraet;
        opt.textContent = geraet;
        geraetSelect.appendChild(opt);
      });
    })
    .catch(() => {});

  // ======================
  // GERÄT AUSWÄHLEN
  // ======================
  geraetSelect.addEventListener("change", (e) => {
    const selected = e.target.value;

    // reset brand
    markeSelect.innerHTML = '<option value="Allgemein">Allgemein</option>';
    markeSelect.disabled = true;

    // reset problems
    problemSelect.innerHTML = '<option value="">--Bitte wählen--</option>';
    problemSelect.disabled = true;

    showProblemFinderBtn.disabled = true;
    closeFinder();
    problemFinder.value = "";

    resetFlow();

    if (!selected) {
      aktuellesGeraetObj = null;
      return;
    }

    aktuellesGeraetObj = daten[selected];

    // Marken/Systeme optional
    const container = aktuellesGeraetObj.Marken || aktuellesGeraetObj.Systeme || {};
    const brandNames = Object.keys(container);

    for (const b of brandNames) {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      markeSelect.appendChild(opt);
    }

    markeSelect.disabled = false;

    // Probleme füllen (Stufe 1)
    fillProblemDropdown();

    // Stufe 2 darf benutzt werden, aber ist zugeklappt
    showProblemFinderBtn.disabled = false;
    closeFinder();
  });

  // ======================
  // PROBLEM AUS DROPDOWN
  // ======================
  problemSelect.addEventListener("change", () => {
    const issue = problemSelect.value;
    if (!issue) return;

    currentIssueName = issue;

    // Finder schließen + sync input
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

  // Klick auf Suggestion -> auswählen + Dropdown synchronisieren
  problemSuggestions.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!a) return;
    e.preventDefault();

    const issue = decodeURIComponent(a.getAttribute("data-issue") || "");
    if (!issue) return;

    currentIssueName = issue;

    problemFinder.value = issue;
    problemSelect.value = issue; // wichtig: Dropdown synchronisieren
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
        const issue = items[0];

        currentIssueName = issue;
        problemFinder.value = issue;
        problemSelect.value = issue;
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
      const name = document.getElementById("name") ? document.getElementById("name").value.trim() : "";
      const message = document.getElementById("message") ? document.getElementById("message").value.trim() : "";

      if (!name || !message) {
        alert("Bitte Name und Nachricht ausfüllen!");
        return;
      }

      console.log("📩 Feedback:", { name, message });
      alert("Danke für dein Feedback!");

      if (feedbackForm) feedbackForm.style.display = "none";
      if (document.getElementById("name")) document.getElementById("name").value = "";
      if (document.getElementById("message")) document.getElementById("message").value = "";
    });
  }
});
