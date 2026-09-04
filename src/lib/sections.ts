import { site } from "@/content/site";

/**
 * Id delle sezioni: coincidono con gli href dei link in `site.nav.links`,
 * che restano l'unica fonte delle etichette.
 */
export const SECTION_IDS = {
  hero: "hero",
  why: "perche",
  about: "chi-sono",
  paths: "percorsi",
  how: "come-funziona",
  contact: "contatti",
} as const;

export const CONTACT_HREF = `#${SECTION_IDS.contact}`;

/**
 * L'header espone un solo link (§6.0): quello al contatto. L'etichetta arriva
 * dai contenuti; se il link sparisse da site.ts si ricade sull'ultimo.
 */
export const contactNavLink =
  site.nav.links.find((link) => link.href === CONTACT_HREF) ??
  site.nav.links[site.nav.links.length - 1];
