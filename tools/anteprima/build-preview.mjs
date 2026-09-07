/**
 * Impacchetta l'export statico in una pagina sola, autosufficiente, da usare
 * come anteprima: CSS in linea, foto in data URI, niente Next. Le poche cose
 * interattive che servono a giudicare gli stili (rivelazioni allo scorrimento,
 * menu degli stili, bottom sheet) sono riscritte qui in JS semplice.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const out = join(root, "out");
const dest = process.argv[2];

const pick = (file) => readFileSync(join(out, file), "utf8");

const landing = pick("index.html");
const percorso = pick("chi-sono/index.html");

const cssHref = [...landing.matchAll(/href="(\/_next\/static\/chunks\/[^"]+\.css)"/g)].map(
  (m) => m[1],
);
const css = cssHref.map((h) => readFileSync(join(out, h.slice(1)), "utf8")).join("\n");

const photo =
  "data:image/jpeg;base64," +
  readFileSync(join(root, "public/alessandro.jpg")).toString("base64");

const bodyOf = (html) => {
  const body = html.slice(html.indexOf("<body"), html.lastIndexOf("</body>"));
  return body
    .slice(body.indexOf(">") + 1)
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/\/alessandro\.jpg/g, photo);
};

const page = `<title>Workshop AI — anteprima</title>
<style>
${css}

/* --- Solo anteprima: le due pagine impilate e la barra che le separa ---- */
.preview-switch {
  position: fixed;
  /* A sinistra e non al centro: al centro finiva sotto alla pill degli
     stili sugli schermi stretti. */
  left: max(0.875rem, env(safe-area-inset-left));
  bottom: max(0.875rem, env(safe-area-inset-bottom));
  z-index: 61;
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 980px;
  background: rgba(28, 28, 32, 0.72);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.22), inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  backdrop-filter: saturate(160%) blur(18px);
  -webkit-backdrop-filter: saturate(160%) blur(18px);
  font-family: var(--font-sans);
}
.preview-switch button {
  padding: 0.4rem 0.85rem;
  min-height: 34px;
  border-radius: 980px;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.72);
}
.preview-switch button[data-on] {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}
.preview-page[hidden] { display: none; }
</style>

<div class="preview-page" data-page="landing">${bodyOf(landing)}</div>
<div class="preview-page" data-page="percorso" hidden>${bodyOf(percorso)}</div>

<nav class="preview-switch" aria-label="Pagina">
  <button type="button" data-page-btn="landing" data-on>Landing</button>
  <button type="button" data-page-btn="percorso">Chi sono</button>
</nav>

<script>
${readFileSync(new URL("./preview-runtime.js", import.meta.url), "utf8")}
</script>
`;

writeFileSync(dest, page);
console.log("scritto", dest, (page.length / 1024).toFixed(0) + "KB");
