"use client";

import { useEffect } from "react";

/**
 * Il motore delle animazioni allo scorrimento, condiviso da tutti gli stili.
 *
 * Non anima nulla di suo: si limita a scrivere sul DOM lo stato che i fogli
 * di stile dei temi possono leggere in CSS.
 *
 *   [data-reveal]        -> riceve data-inview="true" quando entra in vista
 *                           (una volta sola: niente rientri che sfarfallano)
 *   --i                  -> indice dell'elemento fra i fratelli con reveal,
 *                           per scalare i ritardi di una cascata
 *   --scroll             -> avanzamento della pagina, da 0 a 1
 *   --p (sulle sezioni)  -> avanzamento della sezione nel viewport, da 0 a 1
 *                           (0.5 quando è esattamente al centro)
 *
 * Con `prefers-reduced-motion` tutto viene marcato come già visibile e il
 * ciclo di scroll non parte proprio.
 */
export function ScrollFX() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    // Indice fra i fratelli: serve ai temi per sfalsare i ritardi.
    const seen = new Map<Element, number>();
    targets.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const n = seen.get(parent) ?? 0;
      seen.set(parent, n + 1);
      el.style.setProperty("--i", String(n));
    });

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      targets.forEach((el) => (el.dataset.inview = "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.inview = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    targets.forEach((el) => observer.observe(el));

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section"),
    );

    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight || 1;
      const max = document.body.scrollHeight - vh;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--scroll", progress.toFixed(4));

      sections.forEach((section) => {
        const box = section.getBoundingClientRect();
        // 0 = sta per entrare dal basso, 1 = appena uscita in alto.
        const p = (vh - box.top) / (vh + box.height);
        section.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
