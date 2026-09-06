"use client";

import { useEffect, useState } from "react";
import {
  defaultStyle,
  styleStorageKey,
  styleVariants,
  type StyleId,
} from "@/content/styles";

/**
 * Il menu a tendina per provare gli stili. È un attrezzo da anteprima, non
 * parte del sito: sta in basso a destra, in vetro, e scrive la scelta su
 * `<html data-style>` e in `localStorage` così regge il cambio pagina.
 */
export function StyleSwitcher() {
  const [current, setCurrent] = useState<StyleId>(defaultStyle);

  useEffect(() => {
    const applied = document.documentElement.dataset.style as StyleId | undefined;
    if (applied && styleVariants.some((v) => v.id === applied)) {
      setCurrent(applied);
    }
  }, []);

  const choose = (id: StyleId) => {
    setCurrent(id);
    document.documentElement.dataset.style = id;
    try {
      localStorage.setItem(styleStorageKey, id);
    } catch {
      // Navigazione privata: pazienza, la scelta vale per questa pagina.
    }
  };

  return (
    <div className="style-switcher">
      <label className="style-switcher__label" htmlFor="style-switcher">
        Stile
      </label>
      <select
        id="style-switcher"
        className="style-switcher__select"
        value={current}
        onChange={(e) => choose(e.target.value as StyleId)}
      >
        {styleVariants.map((variant) => (
          <option key={variant.id} value={variant.id}>
            {variant.label} — {variant.hint}
          </option>
        ))}
      </select>
      <span className="style-switcher__caret" aria-hidden="true">
        ▾
      </span>
    </div>
  );
}
