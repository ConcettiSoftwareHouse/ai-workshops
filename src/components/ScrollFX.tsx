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
 *   [data-reveal-group]  -> contenitore che entra in vista tutto insieme: i
 *                           suoi figli si rivelano quando il gruppo è in
 *                           vista, non quando lo sono loro. Serve al
 *                           carosello, che scorre di lato: le schede fuori
 *                           dallo schermo non "entrano" mai da sole
 *   --i                  -> indice dell'elemento fra i fratelli con reveal,
 *                           per scalare i ritardi di una cascata
 *   --scroll             -> avanzamento della pagina, da 0 a 1
 *   --v                  -> velocità dello scorrimento, da 0 (fermo) a 1
 *                           (sale di scatto, scende piano: serve agli stili
 *                           che reagiscono a quanto forte si scorre)
 *   --dir                -> verso dello scorrimento: 1 in giù, -1 in su
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

    const groups = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal-group]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-reveal-group")) {
            el.querySelectorAll<HTMLElement>("[data-reveal]").forEach(
              (child) => (child.dataset.inview = "true"),
            );
          } else {
            el.dataset.inview = "true";
          }
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    // Chi sta dentro a un gruppo lo segue: osservarlo da solo lo lascerebbe
    // nascosto finché non lo si porta in vista scorrendo di lato.
    targets.forEach((el) => {
      if (!el.closest("[data-reveal-group]")) observer.observe(el);
    });
    groups.forEach((group) => observer.observe(group));

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section"),
    );

    const measure = () => {
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

    /* La velocità non si può leggere solo dagli eventi di scroll: quando il
       dito si stacca gli eventi finiscono di colpo e il valore resterebbe
       inchiodato all'ultimo. Gira quindi un ciclo a frame finché non è
       tornato a zero, e si spegne da solo appena la pagina è ferma. */
    let frame = 0;
    let lastY = window.scrollY;
    let speed = 0;

    const loop = () => {
      const y = window.scrollY;
      const moved = y - lastY;
      const delta = Math.abs(moved);
      lastY = y;

      // Il verso si aggiorna solo quando la pagina si muove davvero: a pagina
      // ferma resta l'ultimo, e la coda dell'effetto finisce nella direzione
      // in cui stava andando.
      if (moved !== 0) root.style.setProperty("--dir", moved > 0 ? "1" : "-1");

      // 90px in un frame è già una scorsa decisa: lì il valore satura.
      const instant = Math.min(1, delta / 90);
      // Sale in fretta e scende piano: così l'effetto si accende subito e si
      // spegne con la coda, invece di sfarfallare a ogni frame.
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
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(loop);
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
