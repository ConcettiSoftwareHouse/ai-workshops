"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const paths = site.landing.paths;

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Il carosello dei percorsi: scroll nativo con snap, niente frecce.
 * Il contatore segue la scheda più vicina al centro del rail, così si sa
 * sempre quante ne restano.
 */
export function PathsRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onScroll = () => {
      const cards = Array.from(rail.children) as HTMLElement[];
      if (!cards.length) return;
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;
      cards.forEach((card, i) => {
        const distance = Math.abs(
          card.offsetLeft + card.offsetWidth / 2 - mid,
        );
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      });
      setCurrent(best);
    };

    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="rail" ref={railRef}>
        {paths.items.map((path, i) => (
          <article
            key={path.number}
            className={`path${i === paths.items.length - 1 ? " path--custom" : ""}`}
          >
            <span className="path__number">{path.number}</span>
            <h3 className="path__title">{path.title}</h3>
            <p className="path__audience">{path.audience}</p>
            <p className="path__body">{path.body}</p>
          </article>
        ))}
      </div>

      <div className="rail__meta">
        <span className="rail__counter">
          {pad(current + 1)} / {pad(paths.items.length)}
        </span>
        <span className="rail__hint">{paths.hint} →</span>
      </div>
    </>
  );
}
