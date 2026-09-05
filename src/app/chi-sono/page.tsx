import type { Metadata } from "next";
import Image from "next/image";
import { ContactCards, CtaCard } from "@/components/Contacts";
import { Navbar } from "@/components/Navbar";
import { site } from "@/content/site";

const { hero, experience, research, education, contact } = site.percorso;

export const metadata: Metadata = {
  title: site.percorso.meta.title,
  description: site.percorso.meta.description,
  alternates: { canonical: "/chi-sono/" },
  openGraph: {
    title: site.percorso.meta.title,
    description: site.percorso.meta.description,
    url: "/chi-sono/",
  },
};

/**
 * Il curriculum, per chi dopo la landing vuole sapere chi conduce la giornata:
 * scroll normale, nessuno snap, e in fondo il ritorno all'offerta.
 */
export default function ChiSonoPage() {
  return (
    <>
      <Navbar variant="percorso" />

      <main className="page">
        <section className="page-hero">
          <div className="portrait">
            <Image
              src={site.person.photo}
              alt={site.person.name}
              width={796}
              height={1000}
              priority
            />
            <div className="portrait__plate">
              <span className="portrait__name">{site.person.name}</span>
              <span className="portrait__role">{site.person.roleLong}</span>
            </div>
          </div>
          <div className="page-hero__text">
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1 className="page-hero__title">{hero.title}</h1>
            <p className="page-hero__body">{hero.body}</p>
          </div>
        </section>

        <section className="page-section">
          <h2 className="h2 h2--page">{experience.title}</h2>
          <p className="page-section__intro">{experience.intro}</p>
          <div className="stack">
            {experience.items.map((project) => (
              <article className="project" key={project.title}>
                <div className="project__meta">
                  <span className="tag tag--sector">{project.sector}</span>
                  <span className="tag tag--company">{project.company}</span>
                  <span className="project__period">{project.period}</span>
                </div>
                <h3 className="project__title">{project.title}</h3>
                <span className="project__role">{project.role}</span>
                <p className="project__body">{project.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section">
          <h2 className="h2 h2--page">{research.title}</h2>
          <div className="stack stack--tight">
            {research.items.map((paper) => (
              <a
                key={paper.href}
                className="card-link pub"
                href={paper.href}
                target="_blank"
                rel="noopener"
              >
                <span className="card-link__text">
                  <span className="card-link__label">{paper.venue}</span>
                  <span className="card-link__value pub__title">
                    {paper.title}
                  </span>
                </span>
                <span className="card-link__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="page-section">
          <h2 className="h2 h2--page">{education.title}</h2>
          <div className="stack">
            {education.items.map((degree) => (
              <div className="degree" key={degree.title}>
                <span className="degree__school">{degree.school}</span>
                <h3 className="degree__title">{degree.title}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="page-section page-section--last">
          <h2 className="h2 h2--page">{contact.title}</h2>
          <ContactCards />
          <CtaCard href="/#percorsi" label={contact.cta} tone="accent" />
          <span className="footnote">{contact.footnote}</span>
        </section>
      </main>
    </>
  );
}
