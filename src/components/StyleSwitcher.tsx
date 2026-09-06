"use client";

import { useEffect, useRef, useState } from "react";
import {
  defaultStyle,
  styleStorageKey,
  styleVariants,
  type StyleId,
} from "@/content/styles";

/**
 * Il menu a tendina per provare gli stili. È un attrezzo d'anteprima, non
 * parte del sito: una pill compatta in basso a destra che apre l'elenco
 * verso l'alto. La scelta finisce su `<html data-style>` e in `localStorage`,
 * così regge il cambio pagina e il ricaricamento.
 *
 * Non è un `<select>` nativo: il nome dello stile va mostrato corto sulla
 * pill (altrimenti la pill copre la CTA sul telefono) e lungo, con la
 * descrizione, solo nell'elenco aperto.
 */
export function StyleSwitcher() {
  const [current, setCurrent] = useState<StyleId>(defaultStyle);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const applied = document.documentElement.dataset.style as StyleId | undefined;
    if (applied && styleVariants.some((v) => v.id === applied)) {
      setCurrent(applied);
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (id: StyleId) => {
    setCurrent(id);
    setOpen(false);
    document.documentElement.dataset.style = id;
    try {
      localStorage.setItem(styleStorageKey, id);
    } catch {
      // Navigazione privata: pazienza, la scelta vale per questa pagina.
    }
  };

  const label =
    styleVariants.find((v) => v.id === current)?.label ?? defaultStyle;

  return (
    <div className="style-switcher" ref={rootRef} data-open={open || undefined}>
      <ul className="style-switcher__menu" role="menu" hidden={!open}>
        {styleVariants.map((variant) => (
          <li key={variant.id}>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={variant.id === current}
              className="style-switcher__item"
              data-on={variant.id === current || undefined}
              onClick={() => choose(variant.id)}
            >
              <span className="style-switcher__tick" aria-hidden="true">
                {variant.id === current ? "●" : ""}
              </span>
              <span className="style-switcher__text">
                <span className="style-switcher__name">{variant.label}</span>
                <span className="style-switcher__hint">{variant.hint}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="style-switcher__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="style-switcher__eyebrow">Stile</span>
        <span className="style-switcher__current">{label}</span>
        <span className="style-switcher__caret" aria-hidden="true">
          ▾
        </span>
      </button>
    </div>
  );
}
