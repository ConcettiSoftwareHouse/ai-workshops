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
        <div className="grid-12 w-full">
          <span className="wordmark col-span-3 sm:col-span-5 lg:col-span-3">
            {site.nav.brand}
          </span>
          <a
            className="header-link t-eyebrow col-span-1 col-start-4 justify-self-end sm:col-span-3 sm:col-start-6 lg:col-span-2 lg:col-start-11"
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
