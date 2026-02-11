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
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  let daten = {};
  let aktuellesGeraet = null;
  let aktuelleMarke = null;
  let currentSteps = [];
  let currentStepIndex = 0;

  // ====== Elemente holen ======
  const geraetSelect = document.getElementById('geraetSelect');
  const markeSelect = document.getElementById('markeSelect');
  const problemSelect = document.getElementById('problemSelect');
  const anleitungDiv = document.getElementById('anleitung');

  const stepNav = document.getElementById('stepNav');
  const prevStepBtn = document.getElementById('prevStep');
  const nextStepBtn = document.getElementById('nextStep');
  const stepCounter = document.getElementById('stepCounter');

  const helpFeedback = document.getElementById('helpFeedback');
  const helpYes = document.getElementById('helpYes');
  const helpNo = document.getElementById('helpNo');

  const progressBar = document.getElementById('progressBar');

  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackForm = document.getElementById('feedbackForm');
  const sendBtn = document.getElementById('sendFeedback');

  if (!geraetSelect || !markeSelect || !problemSelect || !anleitungDiv) return;

  console.log("🚀 Assistent Script gestartet");

  // Initial verstecken
  stepNav.style.display = 'none';
  helpFeedback.style.display = 'none';
  if (progressBar) progressBar.style.width = "0%";

  // ======================
  // NORMALIZE FUNCTION
  // ======================
  const normalize = str =>
    str.toString().toLowerCase().trim()
      .replace(/\s+/g, '')
      .replace(/_/g, '')
      .replace(/\//g, '')
      .replace(/-/g, '');

  // ======================
  // JSON LADEN
  // ======================
  fetch('/assets/guides.json')
    .then(res => res.json())
    .then(data => {
      daten = data;

      Object.keys(daten).forEach(geraet => {
        const opt = document.createElement('option');
        opt.value = geraet;
        opt.textContent = geraet;
        geraetSelect.appendChild(opt);
      });

      console.log("✅ JSON geladen");
    })
    .catch(err => console.error("❌ JSON Fehler:", err));

  // ======================
  // FORTSCHRITT UPDATE
  // ======================
  function updateProgress() {
    if (!progressBar || !currentSteps.length) return;
    const percent = ((currentStepIndex + 1) / currentSteps.length) * 100;
    progressBar.style.width = percent + "%";
  }

  // ======================
  // RESET FLOW
  // ======================
  function resetFlow() {
    currentSteps = [];
    currentStepIndex = 0;
    anleitungDiv.innerHTML = '';
    stepNav.style.display = 'none';
    helpFeedback.style.display = 'none';
    if (progressBar) progressBar.style.width = "0%";
  }

  // ======================
  // GERÄT AUSWÄHLEN
  // ======================
  geraetSelect.addEventListener('change', e => {
    const selectedGeraet = e.target.value;

    markeSelect.innerHTML = '<option value="">--Bitte wählen--</option>';
    problemSelect.innerHTML = '<option value="">--Bitte wählen--</option>';
    problemSelect.disabled = true;

    resetFlow();

    if (!selectedGeraet) {
      markeSelect.disabled = true;
      return;
    }

    aktuellesGeraet = daten[selectedGeraet];
    aktuelleMarke = null;

    let markenKeys = aktuellesGeraet.Marken
      ? Object.keys(aktuellesGeraet.Marken)
      : aktuellesGeraet.Systeme
      ? Object.keys(aktuellesGeraet.Systeme)
      : [];

    markenKeys.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      markeSelect.appendChild(opt);
    });

    markeSelect.disabled = false;
  });

  // ======================
  // MARKE AUSWÄHLEN
  // ======================
  markeSelect.addEventListener('change', e => {
    const selectedMarke = e.target.value;

    problemSelect.innerHTML = '<option value="">--Bitte wählen--</option>';
    resetFlow();

    if (!selectedMarke) {
      problemSelect.disabled = true;
      return;
    }

    aktuelleMarke = selectedMarke.trim();

    let problemeKeys = Object.keys(
      aktuellesGeraet.Allgemeine_TV_Probleme ||
      aktuellesGeraet.Allgemeine_PC_Probleme ||
      aktuellesGeraet.Allgemeine_Smartphone_Probleme || {}
    );

    problemeKeys.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p;
      opt.textContent = p;
      problemSelect.appendChild(opt);
    });

    problemSelect.disabled = false;
  });

  // ======================
  // SCHRITTE LADEN
  // ======================
  function loadSteps(selectedProblem) {
    if (!aktuellesGeraet || !aktuelleMarke || !selectedProblem) return;

    // ohne optional chaining, damit es überall läuft
    let problemObj = null;

    if (aktuellesGeraet.Allgemeine_TV_Probleme && aktuellesGeraet.Allgemeine_TV_Probleme[selectedProblem]) {
      problemObj = aktuellesGeraet.Allgemeine_TV_Probleme[selectedProblem];
    } else if (aktuellesGeraet.Allgemeine_PC_Probleme && aktuellesGeraet.Allgemeine_PC_Probleme[selectedProblem]) {
      problemObj = aktuellesGeraet.Allgemeine_PC_Probleme[selectedProblem];
    } else if (aktuellesGeraet.Allgemeine_Smartphone_Probleme && aktuellesGeraet.Allgemeine_Smartphone_Probleme[selectedProblem]) {
      problemObj = aktuellesGeraet.Allgemeine_Smartphone_Probleme[selectedProblem];
    }

    if (!problemObj) return;

    let markeData = null;
    if (aktuellesGeraet.Marken && aktuellesGeraet.Marken[aktuelleMarke]) {
      markeData = aktuellesGeraet.Marken[aktuelleMarke];
    } else if (aktuellesGeraet.Systeme && aktuellesGeraet.Systeme[aktuelleMarke]) {
      markeData = aktuellesGeraet.Systeme[aktuelleMarke];
    }

    let overrideSteps = [];

    if (markeData && markeData.overrides) {
      const overrides = markeData.overrides;
      const keys = Object.keys(overrides);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (normalize(key) === normalize(selectedProblem)) {
          overrideSteps = Array.isArray(overrides[key]) ? overrides[key] : [];
          break;
        }
      }
    }

    currentSteps = [...overrideSteps, ...(Array.isArray(problemObj.steps) ? problemObj.steps : [])];
    currentStepIndex = 0;

    if (progressBar) progressBar.style.width = "0%";

    stepNav.style.display = 'flex';
    helpFeedback.style.display = 'block';

    showStep();
  }

  // ======================
  // SCHRITT ANZEIGEN
  // ======================
  function showStep() {
    anleitungDiv.innerHTML = '';
    if (!currentSteps.length) return;

    const stepText = currentSteps[currentStepIndex];

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>Schritt ${currentStepIndex + 1} von ${currentSteps.length}</h3>
      <p>${stepText}</p>
    `;

    anleitungDiv.appendChild(card);

    stepCounter.textContent = `Schritt ${currentStepIndex + 1} / ${currentSteps.length}`;

    prevStepBtn.disabled = currentStepIndex === 0;
    nextStepBtn.disabled = currentStepIndex === currentSteps.length - 1;

    prevStepBtn.hidden = false;
    nextStepBtn.hidden = false;
    stepCounter.hidden = false;

    stepNav.style.display = 'flex';
    helpFeedback.style.display = 'block';

    updateProgress();
  }

  // ======================
  // NAVIGATION
  // ======================
  prevStepBtn.addEventListener('click', () => {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      showStep();
    }
  });

  nextStepBtn.addEventListener('click', () => {
    if (currentStepIndex < currentSteps.length - 1) {
      currentStepIndex++;
      showStep();
    }
  });

  // ======================
  // HILFE → JA
  // ======================
  helpYes.addEventListener('click', () => {
    anleitungDiv.innerHTML = `
      <div class="card">
        <h3>🎉 Super!</h3>
        <p>Freut mich, dass dein Problem gelöst wurde.</p>
        <p>Du kannst oben ein neues Problem auswählen.</p>
      </div>
    `;

    stepNav.style.display = 'none';
    helpFeedback.style.display = 'none';

    currentSteps = [];
    currentStepIndex = 0;

    if (progressBar) progressBar.style.width = "0%";
  });

  // ======================
  // HILFE → NEIN
  // ======================
  helpNo.addEventListener('click', () => {
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

    stepNav.style.display = 'none';
    helpFeedback.style.display = 'none';

    currentSteps = [];
    currentStepIndex = 0;

    if (progressBar) progressBar.style.width = "0%";
  });

  // ======================
  // PROBLEM AUSWÄHLEN
  // ======================
  problemSelect.addEventListener('change', e => {
    const selectedProblem = e.target.value.trim();
    loadSteps(selectedProblem);
  });

  // ======================
  // FEEDBACK
  // ======================
  if (feedbackBtn && feedbackForm) {
    feedbackBtn.addEventListener('click', () => {
      feedbackForm.style.display = feedbackForm.style.display === 'block' ? 'none' : 'block';
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name = document.getElementById('name') ? document.getElementById('name').value.trim() : "";
      const message = document.getElementById('message') ? document.getElementById('message').value.trim() : "";

      if (!name || !message) {
        alert('Bitte Name und Nachricht ausfüllen!');
        return;
      }

      console.log('📩 Feedback:', { name, message });
      alert('Danke für dein Feedback!');

      if (feedbackForm) feedbackForm.style.display = 'none';
      if (document.getElementById('name')) document.getElementById('name').value = '';
      if (document.getElementById('message')) document.getElementById('message').value = '';
    });
  }
});
