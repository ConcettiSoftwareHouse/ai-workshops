import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SECTION_IDS } from "@/lib/sections";

const HEADING_ID = "perche-titolo";

/**
 * Perché la giornata serve. È la prima sezione dopo il hero perché il lettore
 * deve avere la cornice prima del catalogo.
 *
 * Stessa impaginazione di ogni altra sezione: etichetta su Lane A, contenuto
 * su Lane B, colonne 10-12 vuote.
 */
export function Why() {
  return (
    <section id={SECTION_IDS.why} aria-labelledby={HEADING_ID}>
      <div className="shell section-standard rule-top">
        <div className="grid-12">
          <Reveal className="lane-a" index={0}>
            <p className="t-eyebrow text-gray-1">{site.why.eyebrow}</p>
          </Reveal>

          <div className="lane-b mt-4 lg:mt-0">
            <Reveal as="h2" id={HEADING_ID} className="t-h2" index={1}>
              {site.why.title}
            </Reveal>
            <Reveal as="p" className="t-body-lg mt-6 lg:mt-7" index={2}>
              {site.why.body}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
