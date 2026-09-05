"use client";

import { useEffect, useState } from "react";

/**
 * La colonnina di punti a destra: dice a che punto della pagina si è.
 * È decorativa (`aria-hidden`), la navigazione vera resta lo scroll.
 */
export function SectionDots({ count }: { count: number }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[data-snap]"),
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.indexOf(entry.target as HTMLElement);
          if (index >= 0) setActive(index);
        });
      },
      { threshold: 0.55 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="dots" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={`dot${i === active ? " dot--on" : ""}`} />
      ))}
    </nav>
  );
}
