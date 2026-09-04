import { site } from "@/content/site";
import { Cta } from "./Cta";
import { Reveal } from "./Reveal";
import { CONTACT_HREF, SECTION_IDS } from "@/lib/sections";

/** Il hero parte al load, non allo scroll, con 120ms di delay iniziale (§8.1). */
const HERO_BASE_DELAY = 120;

/**
 * Hero (§6.1). Nessun filetto sopra, nessuno scroll indicator, un solo CTA.
 *
 * Lo scarto di una colonna fra l'eyebrow (Lane A, col 1-2) e il titolo
 * (Lane C, col 4-12) è il gesto d'apertura: è lì che la griglia asimmetrica
 * si dichiara. Le righe sono esplicite perché il titolo deve stare sotto
 * l'eyebrow, non accanto.
 */
export function Hero() {
  return (
    <section id={SECTION_IDS.hero} aria-labelledby="hero-title">
      <div className="shell section-hero">
        <div className="grid-12">
          <Reveal
            className="lane-a row-start-1"
            trigger="load"
            index={0}
            baseDelay={HERO_BASE_DELAY}
          >
            <p className="t-eyebrow text-gray-1">{site.hero.eyebrow}</p>
            <div aria-hidden="true" className="rule-short mt-4" />
          </Reveal>

          <Reveal
            as="h1"
            id="hero-title"
            className="lane-c row-start-2 t-display max-w-none lg:max-w-[14ch]"
            trigger="load"
            index={1}
            baseDelay={HERO_BASE_DELAY}
          >
            {site.hero.title}
          </Reveal>

          <Reveal
            as="p"
            className="col-4-9 row-start-3 t-body-lg mt-7 max-w-[52ch] text-gray-1 lg:mt-8"
            trigger="load"
            index={2}
            baseDelay={HERO_BASE_DELAY}
          >
            {site.hero.subtitle}
          </Reveal>

          {/* Sottotitolo → CTA: 48px mobile, 64px desktop (§6.1). */}
          <Reveal
            className="col-4-9 row-start-4 mt-x48 lg:mt-x64"
            trigger="load"
            index={3}
            baseDelay={HERO_BASE_DELAY}
          >
            <Cta href={CONTACT_HREF}>{site.hero.cta}</Cta>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
