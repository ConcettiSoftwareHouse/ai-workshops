// Runtime dell'anteprima: rifà in JS semplice quello che nel sito fanno i
// componenti React (rivelazioni allo scorrimento, menu degli stili, sheet).
(function () {
  var STYLES = ["originale", "aurora", "notte", "editoriale"];
  var root = document.documentElement;

  function setStyle(id) {
    root.dataset.style = id;
    try { localStorage.setItem("ai-workshops:style", id); } catch (e) {}
    document.querySelectorAll(".style-switcher").forEach(function (sw) {
      sw.querySelectorAll(".style-switcher__item").forEach(function (item) {
        var on = item.dataset.styleId === id;
        item.toggleAttribute("data-on", on);
        item.setAttribute("aria-checked", String(on));
        var tick = item.querySelector(".style-switcher__tick");
        if (tick) tick.textContent = on ? "●" : "";
      });
      var current = sw.querySelector(".style-switcher__current");
      if (current) current.textContent = LABELS[id];
    });
  }

  var LABELS = {};
  // I nomi stanno già nel markup renderizzato: li leggo da lì una volta sola.
  document.querySelectorAll(".style-switcher__item").forEach(function (item, i) {
    var name = item.querySelector(".style-switcher__name");
    var id = STYLES[i % STYLES.length];
    item.dataset.styleId = id;
    if (name) LABELS[id] = name.textContent;
  });

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest(".style-switcher__trigger");
    if (trigger) {
      var sw = trigger.closest(".style-switcher");
      var menu = sw.querySelector(".style-switcher__menu");
      var open = menu.hasAttribute("hidden");
      menu.toggleAttribute("hidden", !open);
      sw.toggleAttribute("data-open", open);
      trigger.setAttribute("aria-expanded", String(open));
      return;
    }

    var item = e.target.closest(".style-switcher__item");
    if (item) {
      setStyle(item.dataset.styleId);
      var sw2 = item.closest(".style-switcher");
      sw2.querySelector(".style-switcher__menu").setAttribute("hidden", "");
      sw2.removeAttribute("data-open");
      return;
    }

    // Fuori dal menu: si chiude.
    document.querySelectorAll(".style-switcher[data-open]").forEach(function (sw3) {
      sw3.querySelector(".style-switcher__menu").setAttribute("hidden", "");
      sw3.removeAttribute("data-open");
    });

    var pageBtn = e.target.closest("[data-page-btn]");
    if (pageBtn) {
      var want = pageBtn.dataset.pageBtn;
      document.querySelectorAll("[data-page]").forEach(function (p) {
        p.toggleAttribute("hidden", p.dataset.page !== want);
      });
      document.querySelectorAll("[data-page-btn]").forEach(function (b) {
        b.toggleAttribute("data-on", b === pageBtn);
      });
      window.scrollTo(0, 0);
      setTimeout(fx, 0);
      return;
    }

    // CTA -> bottom sheet (versione essenziale, senza trascinamento).
    if (e.target.closest(".btn")) {
      var page = e.target.closest("[data-page]");
      var overlay = page && page.querySelector(".sheet-overlay");
      if (overlay) {
        overlay.removeAttribute("hidden");
        var sheet = overlay.querySelector(".sheet");
        var scrim = overlay.querySelector(".sheet-scrim");
        sheet.style.transition = "none";
        sheet.style.transform = "translateY(110%)";
        requestAnimationFrame(function () {
          sheet.style.transition = "transform 420ms cubic-bezier(0.32,0.72,0,1)";
          sheet.style.transform = "translateY(0)";
          if (scrim) scrim.style.opacity = "0.42";
        });
      }
      return;
    }

    if (e.target.closest(".sheet__close") || e.target.closest(".sheet-scrim")) {
      var ov = e.target.closest(".sheet-overlay");
      var sh = ov.querySelector(".sheet");
      var sc = ov.querySelector(".sheet-scrim");
      sh.style.transform = "translateY(110%)";
      if (sc) sc.style.opacity = "0";
      setTimeout(function () { ov.setAttribute("hidden", ""); }, 380);
    }
  });

  // --- Motore dello scorrimento, identico a ScrollFX -----------------------
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function index() {
    var seen = new Map();
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      var parent = el.parentElement;
      if (!parent) return;
      var n = seen.get(parent) || 0;
      seen.set(parent, n + 1);
      el.style.setProperty("--i", String(n));
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      // Il carosello si rivela tutto insieme: le schede fuori schermo di
      // lato non entrerebbero mai in vista da sole.
      if (el.hasAttribute("data-reveal-group")) {
        el.querySelectorAll("[data-reveal]").forEach(function (child) {
          child.dataset.inview = "true";
        });
      } else {
        el.dataset.inview = "true";
      }
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

  function fx() {
    index();
    if (reduced) {
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.dataset.inview = "true";
      });
      return;
    }
    document.querySelectorAll("[data-reveal]:not([data-inview])").forEach(function (el) {
      if (!el.closest("[data-reveal-group]")) observer.observe(el);
    });
    document.querySelectorAll("[data-reveal-group]").forEach(function (g) {
      observer.observe(g);
    });
    measure();
  }

  var frame = 0;
  function measure() {
    frame = 0;
    var vh = window.innerHeight || 1;
    var max = document.body.scrollHeight - vh;
    root.style.setProperty("--scroll", (max > 0 ? window.scrollY / max : 0).toFixed(4));
    document.querySelectorAll("section").forEach(function (section) {
      var box = section.getBoundingClientRect();
      var p = (vh - box.top) / (vh + box.height);
      section.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    });
  }

  window.addEventListener("scroll", function () {
    if (frame) return;
    frame = requestAnimationFrame(measure);
  }, { passive: true });
  window.addEventListener("resize", function () {
    if (frame) return;
    frame = requestAnimationFrame(measure);
  }, { passive: true });

  var saved = null;
  try { saved = localStorage.getItem("ai-workshops:style"); } catch (e) {}
  setStyle(STYLES.indexOf(saved) > -1 ? saved : "aurora");
  fx();
})();
