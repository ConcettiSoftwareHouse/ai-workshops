"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { site } from "@/content/site";

const CallSheetContext = createContext<() => void>(() => {});

/** Apre il bottom sheet dei contatti. Usabile da qualsiasi CTA della landing. */
export function useCallSheet() {
  return useContext(CallSheetContext);
}

const [phone, email, linkedin] = site.contacts;

/** Spring critically damped, come le transizioni di sistema su iOS. */
const RESPONSE = 0.36;
/** Attrito della proiezione di momentum al rilascio del dito. */
const DECAY = 0.998;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Il foglio si muove sempre a partire dalla posizione che ha in quel momento:
 * si può afferrare a metà apertura, trascinare, lasciare andare. La posizione
 * vive in un ref e finisce direttamente sul `transform`, senza render.
 */
export function CallSheetProvider({ children }: { children: ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const y = useRef(0);
  const raf = useRef<number | null>(null);
  const drag = useRef<{
    startY: number;
    baseY: number;
    history: { y: number; t: number }[];
    moved: boolean;
  } | null>(null);

  const [visible, setVisible] = useState(false);

  const sheetHeight = useCallback(
    () => sheetRef.current?.getBoundingClientRect().height ?? 400,
    [],
  );

  const paint = useCallback(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.style.transform = `translateY(${y.current}px)`;
    const scrim = scrimRef.current;
    if (scrim) {
      const height = sheetHeight() || 1;
      const progress = Math.max(0, Math.min(1, 1 - y.current / height));
      scrim.style.opacity = String(progress * 0.42);
    }
  }, [sheetHeight]);

  const springTo = useCallback(
    (target: number, v0: number, bounce: boolean, onRest?: () => void) => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (prefersReducedMotion()) {
        y.current = target;
        paint();
        onRest?.();
        return;
      }
      const omega = (2 * Math.PI) / RESPONSE;
      const zeta = bounce ? 0.8 : 1;
      let v = v0 || 0;
      let last = performance.now();
      const step = (now: number) => {
        const dt = Math.min((now - last) / 1000, 1 / 30);
        last = now;
        const x = y.current - target;
        v += (-omega * omega * x - 2 * zeta * omega * v) * dt;
        y.current += v * dt;
        paint();
        if (Math.abs(y.current - target) < 0.5 && Math.abs(v) < 8) {
          y.current = target;
          paint();
          raf.current = null;
          onRest?.();
          return;
        }
        raf.current = requestAnimationFrame(step);
      };
      raf.current = requestAnimationFrame(step);
    },
    [paint],
  );

  const open = useCallback(() => setVisible(true), []);

  const close = useCallback(() => {
    springTo(sheetHeight(), 0, false, () => setVisible(false));
  }, [sheetHeight, springTo]);

  // L'apertura parte da fuori schermo e sale: succede dopo il primo paint,
  // quando il foglio ha un'altezza vera da cui calcolare la corsa.
  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus({ preventScroll: true });
    const id = requestAnimationFrame(() => {
      y.current = sheetHeight();
      paint();
      springTo(0, 0, false);
    });
    return () => {
      cancelAnimationFrame(id);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
      document.body.style.overflow = "";
    };
  }, [visible, paint, sheetHeight, springTo]);

  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, close]);

  /** Resistenza oltre il bordo superiore: si tira, ma sempre meno. */
  const rubberband = (overshoot: number, dim: number) => {
    const c = 0.55;
    return (overshoot * dim * c) / (dim + c * Math.abs(overshoot));
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    if (raf.current) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
    sheetRef.current?.setPointerCapture(e.pointerId);
    drag.current = {
      startY: e.clientY,
      baseY: y.current,
      history: [{ y: e.clientY, t: performance.now() }],
      moved: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state) return;
    const delta = e.clientY - state.startY;
    if (!state.moved && Math.abs(delta) < 6) return;
    state.moved = true;
    let next = state.baseY + delta;
    if (next < 0) next = -rubberband(-next, sheetHeight());
    y.current = next;
    paint();
    state.history.push({ y: e.clientY, t: performance.now() });
    if (state.history.length > 5) state.history.shift();
  };

  const onPointerUp = () => {
    const state = drag.current;
    if (!state) return;
    drag.current = null;
    const first = state.history[0];
    const last = state.history[state.history.length - 1];
    const velocity =
      (last.y - first.y) / Math.max((last.t - first.t) / 1000, 0.001);
    const height = sheetHeight();
    const projected = y.current + (velocity / 1000) * DECAY / (1 - DECAY);
    if (projected > height * 0.35 || velocity > 700) {
      springTo(height, velocity, false, () => setVisible(false));
    } else {
      springTo(0, velocity, Math.abs(velocity) > 250);
    }
  };

  return (
    <CallSheetContext.Provider value={open}>
      {children}

      <div className="sheet-overlay" ref={overlayRef} hidden={!visible}>
        <div className="sheet-scrim" ref={scrimRef} onClick={close} />
        <div
          className="sheet"
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={site.sheet.ariaLabel}
          tabIndex={-1}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="sheet__grip">
            <span />
          </div>
          <h2 className="sheet__title">{site.sheet.title}</h2>
          <p className="sheet__body">{site.sheet.body}</p>
          <div className="sheet__actions">
            <a className="sheet-action sheet-action--primary" href={phone.href}>
              <span>{site.sheet.actions.phone}</span>
              <span aria-hidden="true">→</span>
            </a>
            <a className="sheet-action" href={email.href}>
              <span>{site.sheet.actions.email}</span>
              <span aria-hidden="true">→</span>
            </a>
            <a
              className="sheet-action"
              href={linkedin.href}
              target="_blank"
              rel="noopener"
            >
              <span>{site.sheet.actions.linkedin}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <button type="button" className="sheet__close" onClick={close}>
            {site.sheet.close}
          </button>
        </div>
      </div>
    </CallSheetContext.Provider>
  );
}
