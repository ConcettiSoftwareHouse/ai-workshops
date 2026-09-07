"use client";

import { useEffect } from "react";

/**
 * Prepara le scritte per gli stili che le animano davvero.
 *
 * Il markup delle pagine resta pulito: qui, a pagina montata, i titoli
 * vengono spezzati in parole (`<span class="word"><span class="word__i">`)
 * e gli occhielli marcati per l'effetto "decodifica". Gli stili che non
 * animano il testo non vedono differenza: le parole restano `display: inline`
 * finché non è un tema a dire il contrario.
 *
 * Accessibilità: il testo originale finisce in `aria-label` sull'elemento e i
 * pezzi sono `aria-hidden`, così uno screen reader legge la frase intera una
 * volta sola invece di sillabare parola per parola.
 */

const TITLES = ".h1, .h2, .page-hero__title";
const EYEBROWS = ".eyebrow";

/** Gli stili che chiedono la decodifica degli occhielli. */
const SCRAMBLE_STYLES = new Set(["notte-kinetica", "notte-nebulosa"]);

/** Caratteri della decodifica: monospaziati di larghezza simile, niente accenti. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}=+*#%&";

function splitIntoWords(el: HTMLElement) {
  if (el.dataset.splitDone !== undefined) return;

  const text = el.textContent ?? "";
  if (!text.trim()) return;

  const fragment = document.createDocumentFragment();
  // Lo spazio resta un nodo di testo suo: così la riga continua a andare a
  // capo dove andrebbe normalmente.
  const parts = text.split(/(\s+)/);
  let index = 0;

  parts.forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part)) {
      fragment.appendChild(document.createTextNode(" "));
      return;
    }

    const outer = document.createElement("span");
    outer.className = "word";
    outer.setAttribute("aria-hidden", "true");
    outer.style.setProperty("--w", String(index));

    const inner = document.createElement("span");
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

/**
 * La decodifica: le lettere si fermano una dopo l'altra da sinistra a destra,
 * quelle non ancora ferme continuano a cambiare. Dura poco più di mezzo
 * secondo — abbastanza da leggersi come intenzione, non come glitch.
 */
function scramble(el: HTMLElement) {
  const text = el.dataset.scrambleText ?? el.textContent ?? "";
  if (!text.trim()) return;

  el.dataset.scrambleText = text;
  el.setAttribute("aria-label", text);

  const chars = [...text];
  const total = 26;
  let frame = 0;

  const timer = window.setInterval(() => {
    frame += 1;
    // Quante lettere sono già "atterrate": avanza da sinistra a destra.
    const settled = Math.floor((frame / total) * chars.length * 1.35);

    el.textContent = chars
      .map((char, i) => {
        if (char === " " || i < settled) return char;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      })
      .join("");

    if (frame >= total) {
      window.clearInterval(timer);
      el.textContent = text;
    }
  }, 34);

  return () => window.clearInterval(timer);
}

export function KineticText() {
  useEffect(() => {
    document
      .querySelectorAll<HTMLElement>(TITLES)
      .forEach((el) => splitIntoWords(el));

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const stops: (() => void)[] = [];

    // La decodifica parte quando l'occhiello entra in vista, e una volta sola.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          // Solo per gli stili che l'hanno chiesta: gli altri non devono
          // vedere le lettere ballare.
          if (!SCRAMBLE_STYLES.has(document.documentElement.dataset.style ?? ""))
            return;
          const stop = scramble(el);
          if (stop) stops.push(stop);
        });
      },
      { threshold: 0.6 },
    );

    document
      .querySelectorAll<HTMLElement>(EYEBROWS)
      .forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      stops.forEach((stop) => stop());
    };
  }, []);

  return null;
}
