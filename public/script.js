document.addEventListener('DOMContentLoaded', () => {
  let daten = {};
  let aktuellesGeraet = null;
  let aktuelleMarke = null;
  let currentSteps = [];
  let currentStepIndex = 0;

  console.log("🚀 Script gestartet");

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
  fetch('daten.json')
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

    const problemObj = aktuellesGeraet.Allgemeine_TV_Probleme?.[selectedProblem] ||
                       aktuellesGeraet.Allgemeine_PC_Probleme?.[selectedProblem] ||
                       aktuellesGeraet.Allgemeine_Smartphone_Probleme?.[selectedProblem];

    if (!problemObj) return;

    const markeData = aktuellesGeraet.Marken?.[aktuelleMarke] || aktuellesGeraet.Systeme?.[aktuelleMarke];
    let overrideSteps = [];

    if (markeData?.overrides) {
      for (const key of Object.keys(markeData.overrides)) {
        if (normalize(key) === normalize(selectedProblem)) {
          overrideSteps = markeData.overrides[key];
          break;
        }
      }
    }

    currentSteps = [...overrideSteps, ...problemObj.steps];
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

    // Navigation & Hilfe ausblenden
    stepNav.style.display = 'none';
    helpFeedback.style.display = 'none';

    // Nur Steps resetten — NICHT Dropdowns
    currentSteps = [];
    currentStepIndex = 0;

    if (progressBar) {
      progressBar.style.width = "0%";
    }
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

    if (progressBar) {
      progressBar.style.width = "0%";
    }
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
  const feedbackBtn = document.getElementById('feedbackBtn');
  const feedbackForm = document.getElementById('feedbackForm');
  const sendBtn = document.getElementById('sendFeedback');

  feedbackBtn.addEventListener('click', () => {
    feedbackForm.style.display = feedbackForm.style.display === 'block' ? 'none' : 'block';
  });

  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !message) {
      alert('Bitte Name und Nachricht ausfüllen!');
      return;
    }

    console.log('📩 Feedback:', { name, message });
    alert('Danke für dein Feedback!');

    feedbackForm.style.display = 'none';
    document.getElementById('name').value = '';
    document.getElementById('message').value = '';
  });
});
