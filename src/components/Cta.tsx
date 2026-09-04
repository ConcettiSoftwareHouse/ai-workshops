import type { ReactNode } from "react";

type CtaLinkProps = {
  children: ReactNode;
  href: string;
  type?: never;
  disabled?: never;
};

type CtaButtonProps = {
  children: ReactNode;
  href?: never;
  type: "submit" | "button";
  disabled?: boolean;
};

type CtaProps = CtaLinkProps | CtaButtonProps;

/**
 * Bottone accentato (§7.3). È l'unico elemento che porta `--color-accent` e
 * compare esattamente tre volte: CTA del hero, chiusura dei percorsi, invio
 * del form. Rende un <a> se riceve href, un <button> se riceve type.
 */
export function Cta(props: CtaProps) {
  if (props.href !== undefined) {
    return (
      <a className="cta" href={props.href}>
        {props.children}
      </a>
    );
  }

  return (
    <button className="cta" type={props.type} disabled={props.disabled}>
      {props.children}
    </button>
  );
}
