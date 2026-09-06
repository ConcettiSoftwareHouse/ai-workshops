"use client";

import { useCallSheet } from "./CallSheet";

/**
 * La CTA che apre il bottom sheet. Primaria nel hero, secondaria (celeste)
 * nelle sezioni successive: la stessa azione, ripetuta senza gridare.
 */
export function CallButton({
  label,
  variant = "secondary",
  reveal = false,
}: {
  label: string;
  variant?: "primary" | "secondary";
  reveal?: boolean;
}) {
  const open = useCallSheet();

  return (
    <button
      type="button"
      className={`btn btn--${variant}`}
      onClick={open}
      {...(reveal ? { "data-reveal": "" } : null)}
    >
      {label}
    </button>
  );
}
