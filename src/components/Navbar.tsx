import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";

/**
 * Le due pill in vetro sopra alla pagina. Il contenitore non prende i tap
 * (`pointer-events: none`), solo le pill: così la pagina resta scorrevole
 * anche sotto la navbar.
 *
 * Sulla landing il nome riporta al hero; sulla pagina "Chi sono" è solo una
 * targhetta, e il link a destra torna indietro.
 */
export function Navbar({ variant }: { variant: "landing" | "percorso" }) {
  const identity = (
    <>
      <Image
        className="nav__photo"
        src={site.person.photo}
        alt={site.person.name}
        width={30}
        height={30}
        priority
      />
      <span className="nav__identity">
        <span className="nav__name">{site.person.name}</span>
        <span className="nav__role">{site.person.role}</span>
      </span>
    </>
  );

  return (
    <header className="nav">
      {variant === "landing" ? (
        <a className="nav__brand" href="#hero">
          {identity}
        </a>
      ) : (
        <span className="nav__brand">{identity}</span>
      )}

      {variant === "landing" ? (
        <Link className="nav__link" href="/chi-sono/">
          {site.nav.toPercorso} <span aria-hidden="true">→</span>
        </Link>
      ) : (
        <Link className="nav__link" href="/">
          <span aria-hidden="true">←</span> {site.nav.toLanding}
        </Link>
      )}
    </header>
  );
}
