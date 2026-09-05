import Link from "next/link";
import { CallButton } from "@/components/CallButton";
import { CallSheetProvider } from "@/components/CallSheet";
import { ContactCards, CtaCard } from "@/components/Contacts";
import { HashScroll } from "@/components/HashScroll";
import { Navbar } from "@/components/Navbar";
import { PathsRail } from "@/components/PathsRail";
import { SectionDots } from "@/components/SectionDots";
import { site } from "@/content/site";

const { hero, context, about, paths, contact } = site.landing;

/**
 * Cinque schermate, una per argomento: cosa succede (hero), perché riguarda
 * l'azienda (contesto), chi lo racconta (chi sono), cosa si compra (percorsi),
 * come si parte (contatti). Ogni schermata ha la sua CTA: la chiamata è
 * sempre a un tocco di distanza.
 */
export default function Page() {
  return (
    <div className="landing">
      <CallSheetProvider>
        <HashScroll />
        <Navbar variant="landing" />
        <SectionDots count={5} />

        <main>
          <section id="hero" data-snap className="section section--hero">
            <span className="eyebrow eyebrow--lg">{hero.eyebrow}</span>
            <h1 className="h1">{hero.title}</h1>
            <p className="lead">{hero.lead}</p>
            <p className="lead lead--muted">{hero.body}</p>
            <CallButton label={hero.cta} variant="primary" />
          </section>

          <section id="contesto" data-snap className="section">
            <span className="eyebrow">{context.eyebrow}</span>
            <h2 className="h2">{context.title}</h2>
            <p className="body">{context.body}</p>
            <p className="body body--claim">{context.claim}</p>
            <CallButton label={context.cta} />
          </section>

          <section id="chi-sono" data-snap className="section">
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 className="h2">{about.title}</h2>
            <p className="body">{about.body}</p>
            <p className="body">{about.body2}</p>
            <Link className="link-inline" href="/chi-sono/">
              {about.link} <span aria-hidden="true">→</span>
            </Link>
            <CallButton label={about.cta} />
          </section>

          <section id="percorsi" data-snap className="section section--rail">
            <div className="section__inner">
              <span className="eyebrow">{paths.eyebrow}</span>
              <h2 className="h2 h2--rail">{paths.title}</h2>
              <p className="intro">{paths.intro}</p>
            </div>
            <PathsRail />
          </section>

          <section id="contatti" data-snap className="section">
            <span className="eyebrow">{contact.eyebrow}</span>
            <h2 className="h2 h2--contact">{contact.title}</h2>
            <p className="body body--narrow">{contact.body}</p>
            <ContactCards />
            <CtaCard href="/chi-sono/" label={contact.cta} tone="soft" />
            <span className="footnote">{contact.footnote}</span>
          </section>
        </main>
      </CallSheetProvider>
    </div>
  );
}
