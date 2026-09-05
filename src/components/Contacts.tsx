import Link from "next/link";
import { site } from "@/content/site";

/**
 * I tre recapiti, chiari e identici nelle due pagine: nessuno dei tre pesa
 * più degli altri, si sceglie il canale che si preferisce.
 */
export function ContactCards() {
  return (
    <div className="contact-grid">
      {site.contacts.map((contact) => (
        <a
          key={contact.label}
          className="card-link"
          href={contact.href}
          {...(contact.external
            ? { target: "_blank", rel: "noopener" }
            : null)}
        >
          <span className="card-link__text">
            <span className="card-link__label">{contact.label}</span>
            <span className="card-link__value">{contact.value}</span>
          </span>
          <span className="card-link__arrow" aria-hidden="true">
            →
          </span>
        </a>
      ))}
    </div>
  );
}

/**
 * La riga d'azione che chiude le due pagine: celeste quando invita a
 * proseguire ("Il mio percorso"), blu piena quando è la conversione.
 */
export function CtaCard({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone: "soft" | "accent";
}) {
  return (
    <Link className={`card-link card-cta card-cta--${tone}`} href={href}>
      <span>{label}</span>
      <span className="card-link__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}
