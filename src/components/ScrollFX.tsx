"use client";

import { usePathname } from "next/navigation";
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
 *   --p (sulle sezioni)  -> avanzamento della sezione nel viewport, da 0 a 1
 *                           (0.5 quando è esattamente al centro)
 *
 * Con `prefers-reduced-motion` tutto viene marcato come già visibile e il
 * ciclo di scroll non parte proprio.
 *
 * Il componente vive nel layout, che fra una pagina e l'altra NON si rimonta:
 * senza `pathname` fra le dipendenze, dopo un passaggio da "Workshop" a "Chi
 * sono" gli elementi della pagina nuova non verrebbero mai osservati e
 * resterebbero a opacità 0 — pagina vuota finché non si ricarica.
 */
export function ScrollFX() {
  const pathname = usePathname();

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

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
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
  }, [pathname]);

  return null;
}
