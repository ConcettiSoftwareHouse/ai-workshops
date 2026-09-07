/**
 * Gli stili fra cui si può scegliere dal menu a tendina. L'`id` finisce in
 * `<html data-style="...">`: ogni foglio in `src/app/themes/` si aggancia lì.
 * `originale` non ha un foglio suo — è la pagina nuda di `globals.css`.
 */
export type StyleId =
  | "originale"
  | "aurora"
  | "notte"
  | "notte-deriva"
  | "notte-profondita"
  | "notte-velocita"
  | "editoriale";

/**
 * Le quattro voci "Notte" condividono lo stesso aspetto — cambia solo come
 * si muove la pagina mentre si scorre. Stanno in cima perché sono quelle da
 * confrontare fra loro; sotto restano gli altri due stili e l'originale.
 */
export const styleVariants: { id: StyleId; label: string; hint: string }[] = [
  { id: "notte-deriva", label: "Notte · Deriva", hint: "Il gradiente viaggia con lo scorrimento" },
  { id: "notte-profondita", label: "Notte · Profondità", hint: "Carrellata: le schermate arrivano da lontano" },
  { id: "notte-velocita", label: "Notte · Velocità", hint: "Stelle in scia quando scorri di scatto" },
  { id: "notte", label: "Notte · Base", hint: "Movimento sobrio, come l'hai visto" },
  { id: "aurora", label: "Aurora", hint: "Chiaro, luce e gradienti in deriva" },
  { id: "editoriale", label: "Editoriale", hint: "Carta, inchiostro, testo grande" },
  { id: "originale", label: "Originale", hint: "La versione attuale, pulita" },
];

export const defaultStyle: StyleId = "notte-deriva";

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
