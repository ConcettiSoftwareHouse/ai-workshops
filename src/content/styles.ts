/**
 * Gli stili fra cui si può scegliere dal menu a tendina. L'`id` finisce in
 * `<html data-style="...">`: ogni foglio in `src/app/themes/` si aggancia lì.
 * `originale` non ha un foglio suo — è la pagina nuda di `globals.css`.
 */
export type StyleId = "originale" | "aurora" | "notte" | "editoriale";

export const styleVariants: { id: StyleId; label: string; hint: string }[] = [
  { id: "originale", label: "Originale", hint: "La versione attuale, pulita" },
  { id: "aurora", label: "Aurora", hint: "Luce e gradienti in movimento" },
  { id: "notte", label: "Notte", hint: "Scuro, con accenti luminosi" },
  { id: "editoriale", label: "Editoriale", hint: "Carta, inchiostro, testo grande" },
];

export const defaultStyle: StyleId = "aurora";

export const styleStorageKey = "ai-workshops:style";

/**
 * Applica lo stile salvato prima del primo paint: senza, la pagina appare
 * per un istante con lo stile di partenza e poi cambia sotto gli occhi.
 */
export const styleBootScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  styleStorageKey,
)});var ok=${JSON.stringify(
  styleVariants.map((v) => v.id),
)};document.documentElement.dataset.style=ok.indexOf(s)>-1?s:${JSON.stringify(
  defaultStyle,
)};}catch(e){document.documentElement.dataset.style=${JSON.stringify(
  defaultStyle,
)};}})();`;
