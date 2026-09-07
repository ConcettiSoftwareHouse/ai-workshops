"use client";

import { useEffect, useRef } from "react";

/**
 * Il campo di polvere luminosa dello stile "Nebulosa".
 *
 * Non è un gradiente: è un canvas con qualche decina di granelli che derivano
 * nel buio. Fa tre cose che il CSS da solo non può fare:
 *
 *  1. scorrendo, i granelli si allungano in scie proporzionali alla velocità;
 *  2. quando un titolo arriva al centro dello schermo, la polvere gli si
 *     raccoglie intorno — è il momento che si nota;
 *  3. all'arrivo di ogni nuovo titolo parte un'onda che attraversa il campo.
 *
 * Gira solo quando lo stile attivo è "notte-nebulosa": sugli altri il ciclo
 * non parte nemmeno. Con `prefers-reduced-motion` disegna il campo fermo, una
 * volta sola.
 */

type Particle = {
  x: number;
  y: number;
  z: number; // profondità: 0.35 lontano, 1 vicino
  r: number;
  vx: number;
  vy: number;
};

const STYLE_ID = "notte-nebulosa";

export function Nebula() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const root = document.documentElement;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let running = false;

    /* Densità per area, non numero fisso: su un telefono sono ~40 granelli,
       su un desktop ~110. Oltre non si guadagna nulla di visibile e si paga. */
    const build = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(115, Math.round((width * height) / 7200));
      particles = Array.from({ length: count }, () => {
        const z = 0.35 + Math.random() * 0.65;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: (0.5 + Math.random() * 1.5) * z,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.1 - 0.04,
        };
      });
    };

    // --- Il titolo al centro: è lì che la polvere si raccoglie ---------------
    let targetX = 0;
    let targetY = 0;
    let pull = 0; // quanto è forte l'attrazione adesso
    let wave = 0; // raggio dell'onda, 0 = spenta
    let lastHeading: Element | null = null;

    const findHeading = () => {
      const headings = document.querySelectorAll<HTMLElement>(
        ".h1, .h2, .page-hero__title",
      );
      const mid = height / 2;
      let best: HTMLElement | null = null;
      let bestDistance = Infinity;

      headings.forEach((heading) => {
        const box = heading.getBoundingClientRect();
        if (box.bottom < 0 || box.top > height) return;
        const distance = Math.abs(box.top + box.height / 2 - mid);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = heading;
        }
      });

      if (!best) {
        pull = 0;
        return;
      }

      const box = (best as HTMLElement).getBoundingClientRect();
      targetX = box.left + box.width / 2;
      targetY = box.top + box.height / 2;
      // Piena forza quando il titolo è al centro, zero a mezzo schermo di
      // distanza: l'effetto arriva e se ne va con la lettura.
      pull = Math.max(0, 1 - bestDistance / (height * 0.42));

      if (best !== lastHeading && pull > 0.55) {
        lastHeading = best;
        wave = 1; // nuovo titolo: parte l'onda
      }
    };

    // --- Velocità di scorrimento, la stessa misura di ScrollFX ---------------
    let lastScroll = window.scrollY;
    let speed = 0;
    let direction = 1;

    const draw = () => {
      frame += 1;

      const y = window.scrollY;
      const moved = y - lastScroll;
      lastScroll = y;
      if (moved !== 0) direction = moved > 0 ? 1 : -1;
      const instant = Math.min(1, Math.abs(moved) / 90);
      speed += (instant - speed) * (instant > speed ? 0.5 : 0.1);

      // Il titolo attivo non serve a 60fps: ogni sei frame è già fluido.
      if (frame % 6 === 0) findHeading();

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const streak = speed * 46;

      particles.forEach((p) => {
        // Deriva propria, lenta.
        p.x += p.vx;
        p.y += p.vy;

        // Parallasse: i granelli vicini scorrono più di quelli lontani.
        p.y -= moved * 0.06 * p.z;

        // Raccolta intorno al titolo.
        if (pull > 0.01) {
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          const distance = Math.hypot(dx, dy) || 1;
          if (distance < 340) {
            const force = (1 - distance / 340) * pull * 0.42;
            p.x += (dx / distance) * force;
            p.y += (dy / distance) * force;
          }
        }

        // Bordi: rientra dal lato opposto, il campo non finisce mai.
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Più il granello è vicino al titolo attivo, più è acceso.
        const glow =
          pull > 0.01
            ? Math.max(0, 1 - Math.hypot(targetX - p.x, targetY - p.y) / 300) *
              pull
            : 0;

        const alpha = (0.16 + p.z * 0.3 + glow * 0.5) * (0.7 + speed * 0.3);

        if (streak > 1.5) {
          // In corsa i granelli diventano scie: una linea, non un cerchio.
          ctx.strokeStyle = `rgba(${150 + glow * 90}, ${190 + glow * 50}, 255, ${alpha})`;
          ctx.lineWidth = p.r * 1.5;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + streak * p.z * direction);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${170 + glow * 70}, ${205 + glow * 40}, 255, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r + glow * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // L'onda: un anello sottile che si allarga dal titolo appena arrivato.
      if (wave > 0) {
        const radius = (1 - wave) * Math.max(width, height) * 0.9;
        ctx.strokeStyle = `rgba(126, 178, 255, ${wave * 0.28})`;
        ctx.lineWidth = 1 + wave * 2;
        ctx.beginPath();
        ctx.arc(targetX, targetY, radius, 0, Math.PI * 2);
        ctx.stroke();
        wave -= 0.018;
        if (wave < 0) wave = 0;
      }

      ctx.globalCompositeOperation = "source-over";

      if (running) requestAnimationFrame(draw);
    };

    // --- Accensione e spegnimento a seconda dello stile attivo ---------------
    const still = () => {
      // Con movimento ridotto il campo si disegna una volta e resta lì.
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(170, 205, 255, ${0.16 + p.z * 0.26})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
    };

    const start = () => {
      if (running) return;
      build();
      if (reduced) {
        still();
        return;
      }
      running = true;
      requestAnimationFrame(draw);
    };

    const stop = () => {
      running = false;
      ctx.clearRect(0, 0, width, height);
    };

    const sync = () => {
      if (root.dataset.style === STYLE_ID && !document.hidden) start();
      else stop();
    };

    const onResize = () => {
      if (root.dataset.style !== STYLE_ID) return;
      build();
      if (reduced) still();
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-style"] });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="nebula" aria-hidden="true" />;
}
