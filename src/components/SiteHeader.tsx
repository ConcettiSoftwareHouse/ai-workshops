"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { contactNavLink } from "@/lib/sections";

/**
 * Header sticky (§6.0): due soli elementi, nessuna navigazione, nessun menu
 * su mobile. Il link al contatto è testuale in `ink`, non accentato: l'accento
 * resta alle tre occorrenze dichiarate in §4.3.
 *
 * È un client component solo per il filetto inferiore, che compare oltre i
 * 24px di scroll (§2.3).
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-bg">
      <div className="shell relative flex h-[var(--header-h)] items-center">
        {/* Due soli elementi: il nome parte dalla colonna 1, il link chiude
            sulla colonna 12. Con due elementi la distribuzione è la stessa
            della griglia e non manda a capo l'etichetta nemmeno a 320px. */}
        <div className="flex w-full items-center justify-between gap-x-4">
          <span className="wordmark whitespace-nowrap">{site.nav.brand}</span>
          <a
            className="header-link t-eyebrow whitespace-nowrap"
            href={contactNavLink.href}
          >
            {contactNavLink.label}
          </a>
        </div>
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px bg-hairline transition-opacity duration-200 ease-linear ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </header>
  );
}
