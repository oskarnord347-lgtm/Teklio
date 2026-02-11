(function () {
  var KEY = "teklio-theme";
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

  function apply(choice) {
    root.setAttribute("data-theme", choice === "system" ? getSystemTheme() : choice);
  }

  // Sofort setzen (kein Flackern)
  var saved = localStorage.getItem(KEY) || "system";
  apply(saved);

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeBtn");
    var pop = document.getElementById("themePopover");
    if (!btn || !pop) return;

    function setActive(choice) {
      var opts = pop.querySelectorAll(".theme-option");
      for (var i = 0; i < opts.length; i++) {
        opts[i].classList.toggle("active", opts[i].getAttribute("data-theme-choice") === choice);
      }
    }
    setActive(saved);

    function open() { pop.classList.add("open"); btn.setAttribute("aria-expanded", "true"); }
    function close() { pop.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      pop.classList.contains("open") ? close() : open();
    });

    pop.addEventListener("click", function (e) {
      var opt = e.target.closest ? e.target.closest(".theme-option") : null;
      if (!opt) return;
      var choice = opt.getAttribute("data-theme-choice");
      localStorage.setItem(KEY, choice);
      apply(choice);
      setActive(choice);
      close();
    });

    document.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    // Wenn System-Theme wechselt und user "system" gewählt hat
    try {
      var mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      if (mq && mq.addEventListener) {
        mq.addEventListener("change", function () {
          var c = localStorage.getItem(KEY) || "system";
          if (c === "system") apply("system");
        });
      }
    } catch (e) {}
  });
})();
