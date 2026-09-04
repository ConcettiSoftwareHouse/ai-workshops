import { Fragment } from "react";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SECTION_IDS } from "@/lib/sections";

const HEADING_ID = "come-funziona-titolo";

/**
 * Come funziona (§6.4). Numero su Lane A, passo su Lane B: le colonne 10-12
 * restano vuote. Il filetto fra un passo e l'altro è largo quanto Lane B, non
 * quanto la sezione: è così che si distingue un passo da una sezione.
 *
 * Ogni passo apre la propria griglia: una riga per passo, senza affidarsi al
 * posizionamento automatico.
 */
export function How() {
  return (
    <section id={SECTION_IDS.how} aria-labelledby={HEADING_ID}>
      <div className="shell section-standard rule-top">
        <div className="grid-12">
          <Reveal className="lane-a" index={0}>
            <p className="t-eyebrow text-gray-1">{site.how.eyebrow}</p>
          </Reveal>
          <Reveal
            as="h2"
            id={HEADING_ID}
            className="lane-b t-h2 mt-4 lg:mt-0"
            index={1}
          >
            {site.how.title}
          </Reveal>
        </div>

        {/* 64px di stacco prima del primo passo. */}
        <div className="mt-x64">
          {site.how.steps.map((step, i) => (
            <Fragment key={step.number}>
              {i > 0 ? (
                <div className="grid-12">
                  <div
                    aria-hidden="true"
                    className="lane-b my-7 h-px w-full bg-hairline"
                  />
                </div>
              ) : null}
              <Reveal className="grid-12" index={i}>
                <p className="lane-a t-eyebrow t-num pt-[0.35em] text-gray-2">
                  {step.number}
                </p>
                <div className="lane-b mt-2 lg:mt-0">
                  <h3 className="t-h3">{step.title}</h3>
                  <p className="t-body mt-4 max-w-[58ch]">{step.body}</p>
                </div>
              </Reveal>
            </Fragment>
          ))}

          {/* Riga formato: 48px sotto il terzo passo. */}
          <Reveal className="grid-12 mt-x48" index={site.how.steps.length}>
            <p className="lane-a t-eyebrow text-gray-1">
              {site.how.formatLabel}
            </p>
            <p className="lane-b t-small mt-2 text-gray-1 lg:mt-0">
              {site.how.format}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
