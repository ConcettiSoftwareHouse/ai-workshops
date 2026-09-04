"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/** Stagger di 70ms fra fratelli, massimo 5 step: dal sesto in poi resta 350ms (§8.1). */
const STAGGER_MS = 70;
const MAX_STEPS = 5;

export function staggerDelay(index: number, base = 0): number {
  return base + Math.min(Math.max(index, 0), MAX_STEPS) * STAGGER_MS;
}

type RevealProps = {
  children: ReactNode;
  /** Posizione fra i fratelli: da qui si calcola il transition-delay. */
  index?: number;
  /** Ritardo iniziale del gruppo (il hero parte a 120ms). */
  baseDelay?: number;
  /**
   * "scroll": entra quando il blocco arriva in viewport (default).
   * "load": entra al primo paint, usato solo dal hero (§8.1).
   */
  trigger?: "scroll" | "load";
  /** Tag da renderizzare. Default: div. */
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

type RevealState = "out" | "in" | "done";

/**
 * Unico pattern d'entrata della pagina (§8.1): opacity 0 → 1 e translateY 16px → 0,
 * 520ms, cubic-bezier(0.22, 1, 0.36, 1).
 *
 * L'unità animata è il blocco intero, non la singola riga: un Reveal avvolge
 * una scheda, un paragrafo, un'intestazione — mai i loro pezzi.
 *
 * Il contenuto è sempre nel DOM e sempre leggibile: lo stato di partenza è
 * applicato solo sotto `.js-motion`, classe che uno script inline aggiunge a
 * <html>. Con prefers-reduced-motion l'IntersectionObserver non viene
 * nemmeno istanziato e l'elemento nasce già allo stato finale (§8.2).
 */
export function Reveal({
  children,
  index = 0,
  baseDelay = 0,
  trigger = "scroll",
  as,
  id,
  className,
  style,
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<RevealState>("out");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Nessuna animazione: stato finale al primo paint, niente observer.
    if (reduced || typeof IntersectionObserver === "undefined") {
      setState("done");
      return;
    }

    if (trigger === "load") {
      setState("in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // Una sola volta per elemento.
          observer.unobserve(entry.target);
          setState("in");
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [trigger]);

  // A transizione finita si toglie il will-change passando a "done".
  useEffect(() => {
    const node = ref.current;
    if (!node || state !== "in") return;

    const onEnd = () => setState("done");
    node.addEventListener("transitionend", onEnd, { once: true });
    return () => node.removeEventListener("transitionend", onEnd);
  }, [state]);

  const delay = staggerDelay(index, baseDelay);

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal={state}
      className={className}
      style={delay > 0 ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
