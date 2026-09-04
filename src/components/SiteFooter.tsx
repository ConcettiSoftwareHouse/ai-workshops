import { site } from "@/content/site";

/**
 * Footer (§6.6). Niente social, niente newsletter, niente "torna su", niente
 * ripetizione del menu. Non esistono P. IVA né pagina privacy e non si
 * inventano: a destra restano i due recapiti, come link.
 */
export function SiteFooter() {
  return (
    <footer>
      <div className="shell section-footer rule-top">
        <div className="grid-12">
          <p className="col-1-4 t-small text-gray-1">
            {site.footer.line} © {site.footer.year}
          </p>
          <div className="col-9-12 t-small mt-3 flex flex-wrap gap-x-5 gap-y-2 text-gray-1 lg:mt-0 lg:justify-end">
            <a className="tap-pad" href={`tel:${site.contactDetails.phoneHref}`}>
              {site.contactDetails.phoneLabel}
            </a>
            <a className="tap-pad" href={`mailto:${site.contactDetails.email}`}>
              {site.contactDetails.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
