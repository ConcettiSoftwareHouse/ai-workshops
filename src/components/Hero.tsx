import { site } from "@/content/site";
import { Cta } from "./Cta";
import { Reveal } from "./Reveal";
import { CONTACT_HREF, SECTION_IDS } from "@/lib/sections";

/** Il hero parte al load, non allo scroll, con 120ms di delay iniziale (§8.1). */
const HERO_BASE_DELAY = 120;

/**
 * Hero (§6.1). Nessun filetto sopra, nessuno scroll indicator, un solo CTA.
 *
 * Lo scarto fra l'eyebrow (Lane A, col 1-2) e il titolo (Lane C, col 3-12)
 * è il gesto d'apertura: è lì che la griglia asimmetrica si dichiara. Il
 * bordo sinistro del titolo cade sulla colonna 3, la stessa di ogni h2 e di
 * ogni paragrafo della pagina. Le righe sono esplicite perché il titolo deve
 * stare sotto l'eyebrow, non accanto.
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
            className="lane-c row-start-2 t-display"
            trigger="load"
            index={1}
            baseDelay={HERO_BASE_DELAY}
          >
            {site.hero.title}
          </Reveal>

          <Reveal
            as="p"
            className="lane-b hero-gap-title-sub row-start-3 t-body-lg max-w-[52ch] text-gray-1"
            trigger="load"
            index={2}
            baseDelay={HERO_BASE_DELAY}
          >
            {site.hero.subtitle}
          </Reveal>

          {/* Sottotitolo → CTA (§5.3). */}
          <Reveal
            className="lane-b hero-gap-sub-cta row-start-4"
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
