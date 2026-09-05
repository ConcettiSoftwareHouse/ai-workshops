"use client";

import { useEffect } from "react";

/**
 * Arrivando da un link con l'ancora (`/#percorsi`), il browser calcola la
 * posizione in pixel appena può — su mobile prima che la barra si assesti e
 * prima che la foto della navbar occupi il suo spazio. Il risultato è un
 * atterraggio storto, di solito a fondo sezione.
 *
 * Qui la posizione si ricalcola sull'elemento, subito e di nuovo a layout
 * finito. Se nel frattempo la persona ha già scorso, si lascia stare: la
 * correzione non deve mai strappare la pagina da sotto le dita.
 */
export function HashScroll() {
  useEffect(() => {
    if (!window.location.hash) return;

    let cancelled = false;
    const stop = () => {
      cancelled = true;
    };
    window.addEventListener("wheel", stop, { passive: true, once: true });
    window.addEventListener("touchstart", stop, { passive: true, once: true });
    window.addEventListener("keydown", stop, { once: true });

    const align = () => {
      if (cancelled) return;
      const target = document.querySelector(window.location.hash);
      target?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    const frame = requestAnimationFrame(align);
    // Secondo passaggio a immagini caricate: è lì che l'altezza si ferma.
    const timer = window.setTimeout(align, 300);
    window.addEventListener("load", align, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("load", align);
    };
  }, []);

  return null;
}
