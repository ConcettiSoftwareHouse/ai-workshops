import { Fragment } from "react";
import { site } from "@/content/site";
import type { CustomPath, Path } from "@/content/site";
import { Cta } from "./Cta";
import { Reveal } from "./Reveal";
import { CONTACT_HREF, SECTION_IDS } from "@/lib/sections";

const HEADING_ID = "percorsi-titolo";

/**
 * I percorsi (§6.3).
 *
 * Non sono card: nessun riquadro, nessun fondo, nessun bordo perimetrale,
 * nessuna griglia di schede affiancate. Ogni percorso è una voce di indice a
 * piena larghezza, separata dalla successiva da un filetto e da 144px d'aria
 * (72 + 72 a desktop, 48 + 48 su mobile). Si scorre come un catalogo.
 */
export function Paths() {
  return (
    <section id={SECTION_IDS.paths} aria-labelledby={HEADING_ID}>
      <div className="shell section-paths rule-top">
        <div className="grid-12">
          <Reveal className="lane-a" index={0}>
            <p className="t-eyebrow text-gray-1">{site.paths.eyebrow}</p>
          </Reveal>
          <Reveal
            as="h2"
            id={HEADING_ID}
            className="lane-b t-h2 mt-4 lg:mt-0"
            index={1}
          >
            {site.paths.title}
          </Reveal>
        </div>

        {/* 96px di stacco prima della prima scheda. */}
        <div className="mt-10">
          {site.paths.items.map((item, i) => (
            <Fragment key={item.number}>
              {i > 0 ? <CardRule /> : null}
              <Reveal>
                <PathEntry item={item} />
              </Reveal>
            </Fragment>
          ))}

          <CardRule />
          <Reveal>
            <CustomEntry item={site.paths.custom} />
          </Reveal>
        </div>

        {/* Chiusura: filetto, 96px, riga di testo e CTA accentato n. 2. */}
        <div aria-hidden="true" className="rule-full mt-x48 lg:mt-9" />
        <div className="grid-12 mt-10">
          <Reveal as="p" className="col-4-9 t-body-lg" index={0}>
            {site.paths.intro}
          </Reveal>
          <Reveal className="col-4-9 mt-7 lg:mt-8" index={1}>
            <Cta href={CONTACT_HREF}>{site.hero.cta}</Cta>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Filetto fra una scheda e l'altra: 48px sopra e sotto, 72px da desktop. */
function CardRule() {
  return (
    <div aria-hidden="true" className="rule-full my-x48 lg:my-9" />
  );
}

/**
 * Scheda ricca. La colonna 3 resta sempre vuota: è il respiro che impedisce
 * alla densità di sembrare una tabella. "Cosa resta" sta su col 9-12 e si
 * allinea in alto alla label "Il problema" (stessa riga di griglia).
 */
function PathEntry({ item }: { item: Path }) {
  const labels = site.paths.labels;

  return (
    <article className="grid-12">
      <p
        aria-hidden="true"
        className="lane-a t-eyebrow t-num pt-[0.35em] text-gray-2 lg:row-start-1"
      >
        {item.number}
      </p>
      <h3 className="col-4-8 t-h3 mt-3 lg:row-start-1 lg:mt-0">{item.title}</h3>

      <h4 className="lane-a t-eyebrow mt-5 text-gray-1 lg:row-start-2 lg:mt-7">
        {labels.audience}
      </h4>
      <p className="col-4-8 t-body mt-2 max-w-[46ch] text-gray-1 lg:row-start-2 lg:mt-7">
        {item.audience}
      </p>

      <div className="col-4-8 mt-5 lg:row-start-3 lg:mt-x48">
        <Block title={labels.problem} body={item.problem} />
        <div className="mt-5 lg:mt-6">
          <Block title={labels.day} body={item.day} />
        </div>
      </div>

      <div className="col-9-12 mt-5 self-start lg:row-start-3 lg:mt-x48">
        <h4 className="t-h4">{labels.takeaways}</h4>
        <ul className="takeaways t-body mt-3">
          {item.takeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/**
 * Quinta scheda, breve: numero, titolo, "a chi si rivolge" e un solo
 * paragrafo. Le colonne 9-12 restano vuote — la caduta di densità è voluta e
 * non va pareggiata con altro contenuto.
 */
function CustomEntry({ item }: { item: CustomPath }) {
  const labels = site.paths.labels;

  return (
    <article className="grid-12">
      <p
        aria-hidden="true"
        className="lane-a t-eyebrow t-num pt-[0.35em] text-gray-2 lg:row-start-1"
      >
        {item.number}
      </p>
      <h3 className="col-4-8 t-h3 mt-3 lg:row-start-1 lg:mt-0">{item.title}</h3>

      <h4 className="lane-a t-eyebrow mt-5 text-gray-1 lg:row-start-2 lg:mt-7">
        {labels.audience}
      </h4>
      <p className="col-4-8 t-body mt-2 max-w-[46ch] text-gray-1 lg:row-start-2 lg:mt-7">
        {item.audience}
      </p>

      <p className="col-4-8 t-body mt-5 max-w-[62ch] lg:row-start-3 lg:mt-x48">
        {item.body}
      </p>
    </article>
  );
}

/** Label h4 + 12px + un unico paragrafo: mai tre righe elenco (§6.3). */
function Block({ title, body }: { title: string; body: string }) {
  return (
    <>
      <h4 className="t-h4">{title}</h4>
      <p className="t-body mt-3 max-w-[62ch]">{body}</p>
    </>
  );
}
