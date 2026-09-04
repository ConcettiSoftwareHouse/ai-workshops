import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { Reveal } from "./Reveal";
import { SECTION_IDS } from "@/lib/sections";

const HEADING_ID = "contatti-titolo";

/**
 * Contatto (§6.5). Il form sta su col 3-7 e non a piena larghezza: un form
 * largo sembra un modulo burocratico.
 *
 * I recapiti in chiaro stanno su col 9-11 allineati in alto al form; su
 * mobile passano sopra il form, perché chi vuole telefonare deve trovare il
 * numero prima del modulo.
 */
export function Contact() {
  return (
    <section id={SECTION_IDS.contact} aria-labelledby={HEADING_ID}>
      <div className="shell section-standard rule-top">
        <div className="grid-12">
          <Reveal className="lane-a lg:row-start-1" index={0}>
            <p className="t-eyebrow text-gray-1">{site.contact.eyebrow}</p>
          </Reveal>

          <Reveal
            as="h2"
            id={HEADING_ID}
            className="col-3-7 t-h2 mt-4 lg:row-start-1 lg:mt-0"
            index={1}
          >
            {site.contact.title}
          </Reveal>

          <Reveal
            as="p"
            className="col-3-7 t-body-lg mt-6 max-w-[46ch] text-gray-1 lg:row-start-2 lg:mt-x48"
            index={2}
          >
            {site.contact.intro}
          </Reveal>

          <Reveal className="col-9-11 mt-7 lg:row-start-3 lg:mt-x64" index={0}>
            <ContactDetail
              label={site.contact.phoneLabel}
              value={site.contactDetails.phoneLabel}
              href={`tel:${site.contactDetails.phoneHref}`}
            />
            <div className="mt-6">
              <ContactDetail
                label={site.contact.emailLabel}
                value={site.contactDetails.email}
                href={`mailto:${site.contactDetails.email}`}
              />
            </div>
          </Reveal>

          <Reveal className="col-3-7 mt-x48 lg:row-start-3 lg:mt-x64" index={1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Recapito in chiaro: label, 8px, valore come link. Non è testo morto. */
function ContactDetail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div>
      <p className="t-eyebrow text-gray-1">{label}</p>
      <p className="t-body mt-2">
        <a className="tap-pad" href={href}>
          {value}
        </a>
      </p>
    </div>
  );
}
