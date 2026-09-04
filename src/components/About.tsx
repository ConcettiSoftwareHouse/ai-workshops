import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SECTION_IDS } from "@/lib/sections";

const HEADING_ID = "chi-sono-titolo";

/**
 * Chi sono (§6.2). Eccezione dichiarata dalla specifica: non c'è un h2 di
 * peso visivo, l'eyebrow stesso è l'h2. A desktop resta sticky per tutta la
 * sezione: è l'unico elemento sticky oltre all'header.
 *
 * Le colonne 10-12 restano vuote: Lane B si ferma alla 9.
 */
export function About() {
  return (
    <section id={SECTION_IDS.about} aria-labelledby={HEADING_ID}>
      <div className="shell section-standard rule-top">
        <div className="grid-12">
          {/* Il wrapper occupa tutta l'altezza della riga, l'h2 ci scorre
              dentro: senza wrapper il grid item si stira e lo sticky non ha
              spazio in cui muoversi. */}
          <div className="lane-a">
            <Reveal
              as="h2"
              id={HEADING_ID}
              className="t-eyebrow text-gray-1 lg:sticky lg:top-10"
              index={0}
            >
              {site.about.eyebrow}
            </Reveal>
          </div>

          <div className="lane-b mt-4 lg:mt-0">
            {site.about.body.map((paragraph, i) => (
              <Reveal
                key={i}
                as="p"
                /* Primo paragrafo in body-lg, gli altri in body (§6.2). */
                className={i === 0 ? "t-body-lg" : "t-body"}
                index={i}
              >
                {paragraph}
              </Reveal>
            ))}

            {/* Riga credenziali: 40px di stacco, filetto largo quanto Lane B. */}
            <Reveal className="mt-7" index={site.about.body.length}>
              <div aria-hidden="true" className="h-px w-full bg-hairline" />
              <p className="t-small mt-5 text-gray-1">
                {site.about.credentials}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
