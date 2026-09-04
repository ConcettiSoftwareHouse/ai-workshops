import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SECTION_IDS } from "@/lib/sections";

const HEADING_ID = "chi-sono-titolo";

/**
 * Chi conduce la giornata (§6.2). Eccezione dichiarata dalla specifica: non
 * c'è un h2 di peso visivo, l'eyebrow stesso è l'h2.
 *
 * È deliberatamente breve — due frasi in body-lg — e sta dopo i percorsi: il
 * curriculum non deve mettersi fra il lettore e l'offerta. Il percorso esteso
 * avrà una sezione sua, quando ci sarà.
 */
export function About() {
  return (
    <section id={SECTION_IDS.about} aria-labelledby={HEADING_ID}>
      <div className="shell section-standard rule-top">
        <div className="grid-12">
          <Reveal
            as="h2"
            id={HEADING_ID}
            className="lane-a t-eyebrow text-gray-1"
            index={0}
          >
            {site.about.eyebrow}
          </Reveal>

          <Reveal
            as="p"
            className="lane-b t-body-lg mt-4 lg:mt-0"
            index={1}
          >
            {site.about.body}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
