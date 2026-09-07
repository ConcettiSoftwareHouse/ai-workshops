// Runtime dell'anteprima: rifà in JS semplice quello che nel sito fanno i
// componenti React (rivelazioni allo scorrimento, menu degli stili, sheet).
(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Stesso ordine di `src/content/styles.ts`: il markup del menu arriva già
  // renderizzato, qui si riattaccano gli id alle voci.
  var STYLES = [
    "notte-kinetica",
    "notte-nebulosa",
    "notte-deriva",
    "notte",
    "aurora",
    "editoriale",
    "originale",
  ];
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
    if (window.__nebulaSync) window.__nebulaSync();
  }

  // Utile in anteprima (e per gli screenshot): cambiare stile da console.
  window.__setStyle = setStyle;

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

  function measure() {
    var vh = window.innerHeight || 1;
    var max = document.body.scrollHeight - vh;
    root.style.setProperty("--scroll", (max > 0 ? window.scrollY / max : 0).toFixed(4));
    document.querySelectorAll("section").forEach(function (section) {
      var box = section.getBoundingClientRect();
      var p = (vh - box.top) / (vh + box.height);
      section.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    });
  }

  // Velocità e verso dello scorrimento, come in ScrollFX: un ciclo a frame
  // che si spegne da solo quando la pagina è ferma.
  var frame = 0;
  var lastY = window.scrollY;
  var speed = 0;

  function loop() {
    var y = window.scrollY;
    var moved = y - lastY;
    var delta = Math.abs(moved);
    lastY = y;

    if (moved !== 0) root.style.setProperty("--dir", moved > 0 ? "1" : "-1");

    var instant = Math.min(1, delta / 90);
    speed += (instant - speed) * (instant > speed ? 0.5 : 0.12);
    root.style.setProperty("--v", speed.toFixed(3));

    measure();

    if (delta > 0 || speed > 0.002) {
      frame = requestAnimationFrame(loop);
    } else {
      frame = 0;
      speed = 0;
      root.style.setProperty("--v", "0");
    }
  }

  function onScroll() {
    if (!frame) frame = requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });


  // ======================================================================
  // Tipografia cinetica — la stessa cosa che nel sito fa KineticText
  // ======================================================================

  var SCRAMBLE_STYLES = ["notte-kinetica", "notte-nebulosa"];
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%&";

  function splitIntoWords(el) {
    if (el.dataset.splitDone !== undefined) return;
    var text = el.textContent || "";
    if (!text.trim()) return;

    var fragment = document.createDocumentFragment();
    var parts = text.split(/(\s+)/);
    var index = 0;

    parts.forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(" "));
        return;
      }
      var outer = document.createElement("span");
      outer.className = "word";
      outer.setAttribute("aria-hidden", "true");
      outer.style.setProperty("--w", String(index));
      var inner = document.createElement("span");
      inner.className = "word__i";
      inner.textContent = part;
      outer.appendChild(inner);
      fragment.appendChild(outer);
      index += 1;
    });

    el.setAttribute("aria-label", text);
    el.replaceChildren(fragment);
    el.dataset.splitDone = "";
    el.style.setProperty("--words", String(index));
  }

  function scramble(el) {
    var text = el.dataset.scrambleText || el.textContent || "";
    if (!text.trim()) return;
    el.dataset.scrambleText = text;
    el.setAttribute("aria-label", text);

    var chars = [].slice.call(text);
    var total = 26;
    var f = 0;
    var timer = setInterval(function () {
      f += 1;
      var settled = Math.floor((f / total) * chars.length * 1.35);
      el.textContent = chars
        .map(function (c, i) {
          if (c === " " || i < settled) return c;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");
      if (f >= total) {
        clearInterval(timer);
        el.textContent = text;
      }
    }, 34);
  }

  document
    .querySelectorAll(".h1, .h2, .page-hero__title")
    .forEach(splitIntoWords);

  if (!reduced) {
    var eyebrowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        eyebrowObserver.unobserve(entry.target);
        if (SCRAMBLE_STYLES.indexOf(root.dataset.style) === -1) return;
        scramble(entry.target);
      });
    }, { threshold: 0.6 });
    document
      .querySelectorAll(".eyebrow")
      .forEach(function (el) { eyebrowObserver.observe(el); });
  }

  // ======================================================================
  // Nebulosa — lo stesso campo di polvere del componente Nebula
  // ======================================================================

  var canvas = document.createElement("canvas");
  canvas.className = "nebula";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  (function nebula() {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var w = 0, h = 0, dust = [], f = 0, on = false;
    var tx = 0, ty = 0, pull = 0, ripple = 0, lastHeading = null;
    var lastY = window.scrollY, sp = 0, dir = 1;

    function build() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(115, Math.round((w * h) / 7200));
      dust = [];
      for (var i = 0; i < count; i++) {
        var z = 0.35 + Math.random() * 0.65;
        dust.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: z,
          r: (0.5 + Math.random() * 1.5) * z,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.1 - 0.04,
        });
      }
    }

    function findHeading() {
      var headings = document.querySelectorAll(".h1, .h2, .page-hero__title");
      var mid = h / 2, best = null, bestDistance = Infinity;
      headings.forEach(function (el) {
        var box = el.getBoundingClientRect();
        // Le pagine nascoste hanno riquadro nullo: non sono candidate.
        if (!box.width || box.bottom < 0 || box.top > h) return;
        var d = Math.abs(box.top + box.height / 2 - mid);
        if (d < bestDistance) { bestDistance = d; best = el; }
      });
      if (!best) { pull = 0; return; }
      var b = best.getBoundingClientRect();
      tx = b.left + b.width / 2;
      ty = b.top + b.height / 2;
      pull = Math.max(0, 1 - bestDistance / (h * 0.42));
      if (best !== lastHeading && pull > 0.55) { lastHeading = best; ripple = 1; }
    }

    function draw() {
      f += 1;
      var y = window.scrollY;
      var moved = y - lastY;
      lastY = y;
      if (moved !== 0) dir = moved > 0 ? 1 : -1;
      var instant = Math.min(1, Math.abs(moved) / 90);
      sp += (instant - sp) * (instant > sp ? 0.5 : 0.1);

      if (f % 6 === 0) findHeading();

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      var streak = sp * 46;

      dust.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        p.y -= moved * 0.06 * p.z;

        if (pull > 0.01) {
          var dx = tx - p.x, dy = ty - p.y;
          var dist = Math.hypot(dx, dy) || 1;
          if (dist < 340) {
            var force = (1 - dist / 340) * pull * 0.42;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        var glow = pull > 0.01
          ? Math.max(0, 1 - Math.hypot(tx - p.x, ty - p.y) / 300) * pull
          : 0;
        var alpha = (0.16 + p.z * 0.3 + glow * 0.5) * (0.7 + sp * 0.3);

        if (streak > 1.5) {
          ctx.strokeStyle = "rgba(" + (150 + glow * 90) + "," + (190 + glow * 50) + ",255," + alpha + ")";
          ctx.lineWidth = p.r * 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + streak * p.z * dir);
          ctx.stroke();
        } else {
          ctx.fillStyle = "rgba(" + (170 + glow * 70) + "," + (205 + glow * 40) + ",255," + alpha + ")";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + glow * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (ripple > 0) {
        var radius = (1 - ripple) * Math.max(w, h) * 0.9;
        ctx.strokeStyle = "rgba(126, 178, 255, " + ripple * 0.28 + ")";
        ctx.lineWidth = 1 + ripple * 2;
        ctx.beginPath();
        ctx.arc(tx, ty, radius, 0, Math.PI * 2);
        ctx.stroke();
        ripple -= 0.018;
        if (ripple < 0) ripple = 0;
      }

      ctx.globalCompositeOperation = "source-over";
      if (on) requestAnimationFrame(draw);
    }

    function still() {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      dust.forEach(function (p) {
        ctx.fillStyle = "rgba(170, 205, 255, " + (0.16 + p.z * 0.26) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
    }

    window.__nebulaSync = function () {
      if (root.dataset.style === "notte-nebulosa" && !document.hidden) {
        if (on) return;
        build();
        if (reduced) { still(); return; }
        on = true;
        requestAnimationFrame(draw);
      } else {
        on = false;
        ctx.clearRect(0, 0, w, h);
      }
    };

    document.addEventListener("visibilitychange", window.__nebulaSync);
    window.addEventListener("resize", function () {
      if (root.dataset.style !== "notte-nebulosa") return;
      build();
      if (reduced) still();
    });
  })();

  var saved = null;
  try { saved = localStorage.getItem("ai-workshops:style"); } catch (e) {}
  setStyle(STYLES.indexOf(saved) > -1 ? saved : "notte-kinetica");
  fx();
})();
