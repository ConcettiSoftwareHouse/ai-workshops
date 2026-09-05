# Handoff: Landing page workshop AI + pagina "Chi sono"

> Questo file è il design handoff approvato, tenuto come specifica di
> riferimento. Il sito lo implementa in Next.js (static export): i file
> `.dc.html` citati qui non stanno nel repository, la mappa fra spec e codice
> è in fondo, sotto "Dove sta nel codice".

## Overview
Sito a due pagine per vendere giornate di formazione AI in azienda (b2b, traffico prevalentemente mobile):
1. **Landing** — offerta dei workshop, con sezioni a schermo pieno e CTA "Richiedi una chiamata" che apre un bottom sheet con i contatti.
2. **Pagina percorso ("Chi sono")** — bio, esperienza in consulenza (9 progetti), ricerca/pubblicazioni, formazione, contatti.

Lingua: italiano. Copy approvato dal cliente: usare i testi ESATTAMENTE come stanno nei file HTML.

## About the Design Files
I file in questo bundle sono **design reference scritti in HTML** — prototipi che mostrano look e comportamento previsti, non codice di produzione da copiare. Il compito è **ricreare questi design nell'ambiente del codebase di destinazione** (React/Next.js, Vue, Astro, ecc.) usando pattern e librerie già in uso. Se non esiste ancora un codebase, scegliere il framework più adatto (per un sito di questo tipo: Next.js/Astro statico) e implementare lì.

Nota tecnica sui file: sono "Design Components" (`.dc.html`) con un runtime proprietario (`support.js`, tag `<x-dc>`) e **stili inline**. Non portare il runtime: leggere il markup e gli stili inline come specifica e riscriverli con i pattern del progetto (CSS Modules, Tailwind, styled-components…).

## Fidelity
**High-fidelity.** Colori, tipografia, spaziature, raggi, ombre e micro-interazioni sono definitivi. Da ricreare in modo pixel-accurate, mobile-first.

## Screens / Views

### 1. Landing (`Landing Workshop AI v3.dc.html`)
Impostazione: **mobile-first**, cinque sezioni ognuna `min-height: 100dvh`, contenuto centrato verticalmente (`display:flex; flex-direction:column; justify-content:center`), `scroll-snap-align: start` con `scroll-snap-type: y proximity` su `html`. Contenitore sezioni: `max-width: 880px`, `padding: 6rem 1.5rem 3rem`, separatore `border-top: 1px solid rgba(0,0,0,0.07)`.

**Navbar** — `position: fixed`, top 0, `z-index: 40`, `padding: 0.6rem 0.9rem`, `pointer-events: none` sul contenitore (auto sui figli). Due "pill" traslucide:
- Sinistra (link a #hero): foto tonda 30px + nome "Alessandro Concetti" (15px/600, `letter-spacing:-0.015em`) + ruolo "Delivery Manager Data & AI" (11px/500, #6e6e73), su `background: rgba(251,251,253,0.7)`, `backdrop-filter: blur(24px) saturate(180%)`, `box-shadow: 0 2px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.6)`, `border-radius: 980px`.
- Destra: link "Chi sono →" alla pagina percorso, stessa materia, altezza 42px, testo 14px/500 #0066cc.
- Press state su entrambe: `transform: scale(0.96–0.97)`, 120ms ease-out.

**Indicatori di sezione** — `position: fixed; right: 0.55rem; top: 50%`, colonna di 5 dot 6px (#1d1d1f, opacity 0.18); l'attivo diventa `height: 16px; border-radius: 3px; opacity: 0.85` con transizione 260ms `cubic-bezier(0.22,1,0.36,1)`. Attivo determinato da IntersectionObserver (threshold 0.55).

**Sezione 1 — Hero**: eyebrow "FORMAZIONE AI IN AZIENDA" (13px/600, tracking 0.1em, uppercase, #86868b); h1 `clamp(2.6rem, 11.5vw, 4.75rem)`, line-height 1.02, tracking -0.04em, 600; paragrafo 1 `clamp(1.1875rem,4.8vw,1.4375rem)` #3a3a3f max-width 34ch; paragrafo 2 `clamp(1rem,4.1vw,1.1875rem)` #6e6e73 max-width 36ch; CTA primaria.

**Sezione 2 — Il contesto**, **Sezione 3 — Chi sono** (con link "Scopri di più su chi sono →" alla pagina percorso): eyebrow 12px/600 uppercase #86868b, h2 `clamp(2rem,8.4vw,3.25rem)` tracking -0.032em, corpo `clamp(1.0625rem,4.4vw,1.25rem)` #3a3a3f max-width 40ch, CTA secondaria.

**Sezione 4 — I percorsi**: header (eyebrow + h2 `clamp(1.875rem,7.6vw,3rem)` + sottotitolo #6e6e73) dentro il contenitore da 880px; sotto, **carosello orizzontale full-bleed**: `display:flex; gap:0.875rem; overflow-x:auto; scroll-snap-type: x mandatory; padding: 0.25rem 1.5rem 0.75rem`. 5 card: `width: min(86vw, 340px)`, `flex: 0 0 auto`, `scroll-snap-align: center`, `background:#fff`, `border:1px solid rgba(0,0,0,0.07)`, `border-radius:24px`, `padding:1.5rem 1.375rem`, `box-shadow: 0 4px 20px rgba(0,0,0,0.05)`. Contenuto card: numero 11px/600 tracking 0.1em #b0b0b6, h3 23px/600 tracking -0.025em, target 16px/500 #0066cc, descrizione 17px/1.5 #3a3a3f. La quinta card ("Percorso su misura") ha `background: linear-gradient(180deg,#f5f5f7,#e9ebf0)`, numero #a8a8ae e target #4b4b52. Sotto il rail: contatore "01 / 05" (13px/500 #86868b, `font-variant-numeric: tabular-nums`) aggiornato allo scroll in base alla card più vicina al centro + hint "scorri →" #b0b0b6.

**Sezione 5 — Contatti**: eyebrow, h2 "Parliamone." `clamp(2.5rem,10.5vw,4rem)` tracking -0.038em, paragrafo, poi griglia `repeat(auto-fit, minmax(min(100%,285px),1fr))` gap 0.75rem con 3 card link (telefono primaria blu, email e LinkedIn bianche): `border-radius:18px`, `padding:1.05–1.1rem 1.25rem`, `min-height:60px`, label 12px #86868b + valore 17px/500; press `scale(0.985)`. Chiusura: riga 13px #a8a8ae.

**Bottom sheet (CTA)** — overlay `position: fixed; inset: 0; z-index: 60`, scrim `rgba(0,0,0,0.42)` con opacità legata alla posizione del foglio; foglio `max-width: 520px`, `background: rgba(255,255,255,0.93)`, `backdrop-filter: blur(30px) saturate(180%)`, `border-radius: 28px 28px 0 0`, `box-shadow: 0 -12px 48px rgba(0,0,0,0.24)`, `padding: 0.4rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom))`, maniglia 42×5px `rgba(0,0,0,0.18)`. Contenuto: h2 "Richiedi una chiamata", riga di spiegazione, 3 azioni (Chiama / Email / LinkedIn, `min-height:56px`, `border-radius:16px`), bottone "Chiudi".

### 2. Pagina percorso (`Il mio percorso.dc.html`)
Scroll normale (no snap), contenitore `max-width: 820px; padding: 0 1.5rem`.
- **Navbar**: stessa pill a sinistra (senza link), a destra "← Workshop" che torna alla landing.
- **Hero**: riga `display:flex; flex-wrap:wrap; align-items:flex-end; gap:1.5rem`. A sinistra cornice ritratto `flex: 1 1 260px; max-width: 320px; aspect-ratio: 4/5; border-radius: 26px; overflow:hidden; box-shadow: 0 12px 34px rgba(0,0,0,0.1)`, foto `object-fit: cover; object-position: 50% 12%`, con targhetta in vetro in basso (`rgba(255,255,255,0.74)`, blur 22px, `border-radius:16px`) contenente nome 15px/600 e "Delivery Manager Data & AI · BIP xTech" 12px/500 #4b4f5a. A destra (`flex: 1 1 300px`): eyebrow "IL MIO PERCORSO", h1 `clamp(2.15rem,8.8vw,3.25rem)` "Progetto e porto a termine soluzioni AI." e bio (`clamp(1.0625rem,4.4vw,1.25rem)`, #3a3a3f, max-width 46ch). Su mobile la riga va a capo: foto, poi titolo e bio.
- **Esperienza in consulenza**: h2 `clamp(1.5rem,6vw,2.125rem)`, sottotitolo "I progetti portati a termine, dal più recente." e 9 card `border-radius:22px; padding:1.375rem 1.25rem; box-shadow: 0 2px 14px rgba(0,0,0,0.04)`. Meta row: targhetta settore blu (12px/600 uppercase tracking 0.06em, `color:#0066cc`, `background: rgba(0,102,204,0.09)`, pill) + targhetta azienda grigia (`#4b4b52` su `rgba(0,0,0,0.06)`) + "ANNO · durata" 13px #86868b. Poi h3 21px/600, ruolo 15px/500 #6e6e73, descrizione 17px/1.5 #3a3a3f.
  Ordine e dati: Banking/BIP 2026 · 1 anno e mezzo (AI Solution Architect) → Fashion/BIP 2026 · 6 mesi (Delivery Manager) → Fashion/BIP 2025 · 6 mesi → Fashion/BIP 2025 · 3 mesi → Università/BIP 2024 · 6 mesi (AI Engineer) → Telco/BIP 2024 · 6 mesi (AI Engineer) → Cross-industry/Accenture 2023 · 12 mesi (GenAI Team Leader) → Energy & Utilities/Accenture 2022 · 12 mesi (ML Engineer) → Food & Beverage/Accenture 2021 · 6 mesi (Data Analyst).
- **Ricerca e pubblicazioni**: due card link (`border-radius:16px`, `min-height:56px`) con label conferenza (ICML 2021 / NeurIPS 2021) e titolo del paper, glifo "↗", target `_blank`.
- **Formazione**: due card `border-radius:22px; padding:1.25rem` — "Politecnico di Milano · 2018–2021" / Laurea magistrale in Computer Science and Engineering; "Politecnico di Milano · 2015–2018" / Laurea triennale in Ingegneria dell'Automazione.
- **Contatti**: h2 "Questi sono i miei contatti", griglia delle 3 card contatto (stessa specifica della landing, tutte bianche) e CTA blu "Scopri le mie proposte di workshop in azienda →" verso `landing#percorsi`.

## Interactions & Behavior
- **Feedback immediato al press** (non al click): tutti i bottoni/link interattivi hanno `:active` con `transform: scale(0.96–0.985)` e transizione 100–120ms ease-out.
- **Bottom sheet, fisica Apple** (implementato con Pointer Events + rAF, vedi `c_dc_js` nel file):
  - apertura: spring critically damped (damping ratio 1.0, response 0.36s) da `translateY(100%)` a 0;
  - drag 1:1 col dito dal foglio (`touch-action: none`, `setPointerCapture`), soglia di isteresi 6px, i tap su `a, button` non iniziano il drag;
  - **rubber-band** oltre il bordo superiore: `(overshoot·dim·0.55)/(dim + 0.55·|overshoot|)`;
  - al rilascio: **momentum projection** `y + (v/1000)·0.998/(1−0.998)`; se la proiezione supera il 35% dell'altezza o v > 700 px/s → chiude, altrimenti torna aperto passando la velocità come velocità iniziale della spring (bounce leggero, damping 0.8, solo se |v| > 250);
  - interrompibile in ogni istante: l'animazione parte sempre dal valore corrente on-screen;
  - scrim con opacità proporzionale alla posizione; chiusura anche con tap sullo scrim, bottone "Chiudi", Esc; `body { overflow: hidden }` mentre è aperto.
- **Carosello percorsi**: scroll nativo con snap x mandatory; il contatore si aggiorna al listener `scroll` (passive) scegliendo la card col centro più vicino al centro del rail.
- **Dot di sezione**: IntersectionObserver, threshold 0.55.
- **Reduced motion**: con `prefers-reduced-motion: reduce` → `scroll-behavior: auto`, `scroll-snap-type: none`, spring sostituite da salto diretto al valore target.
- **Responsive**: mobile-first; le griglie usano `repeat(auto-fit, minmax(min(100%, N), 1fr))`, l'hero della pagina percorso passa a due colonne via `flex-wrap`. Nessuna media query di layout, tutto fluido (`clamp`, `dvh`).

## State Management
Stato minimo, tutto locale:
- `sheetY` (posizione del foglio, in px) + velocità corrente — gestiti imperativamente su `transform` per non ri-renderizzare a ogni frame;
- `sheetOpen` (booleano);
- `activeSection` (indice 0–4, dai dot);
- `activeCard` (indice del carosello, per il contatore).
Nessun data fetching. Le CTA sono link `tel:`, `mailto:` (subject "Formazione AI in azienda") e LinkedIn.

## Design Tokens
**Colori**
- Sfondo pagina `#fbfbfd`; superfici card `#ffffff`; gradiente "su misura" `#f5f5f7 → #e9ebf0`; cornice foto `#eef1f6`.
- Testo: primario `#1d1d1f`; corpo `#3a3a3f`; secondario `#6e6e73`; tenue `#86868b`; molto tenue `#a8a8ae` / `#b0b0b6`; su vetro `#14161c` / `#4b4f5a`.
- Accento: `#0066cc` (base), `#0071e3` (hover), `#005bb5` (active), `rgba(0,102,204,0.09)` (fondo tenue), `rgba(0,102,204,0.22–0.26)` (ombra bottone).
- Bordi: `rgba(0,0,0,0.07)` (card), `rgba(0,0,0,0.08)` (separatori sezione).
- Materiali: chrome `rgba(251,251,253,0.7)` + blur 24px; sheet `rgba(255,255,255,0.93)` + blur 30px; targhetta `rgba(255,255,255,0.74)` + blur 22px; scrim `rgba(0,0,0,0.42)`.

**Tipografia** — system font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, "Segoe UI", sans-serif`. Tracking dipendente dalla dimensione: display −0.032…−0.04em, titoli medi −0.022…−0.028em, corpo −0.01…−0.015em, eyebrow/label +0.06…+0.11em uppercase. Line-height: 1.02–1.07 sui display, 1.45–1.6 sul corpo. Pesi usati: 500 e 600 (nessun 700).

**Spaziature** (rem): 0.15 / 0.35 / 0.5 / 0.75 / 0.875 / 1 / 1.25 / 1.5 / 2.5 / 6 (padding-top sezioni sotto la navbar fissa).

**Raggi**: 12 / 14 / 16 / 18 / 22 / 24 / 26 / 28px; pill `980px`; avatar 50%.

**Ombre**: card `0 2px 14px rgba(0,0,0,0.04)`; card carosello `0 4px 20px rgba(0,0,0,0.05)`; hover card `0 8px 22px rgba(0,0,0,0.07)`; chrome `0 2px 12px rgba(0,0,0,0.07)` + `inset 0 1px 0 rgba(255,255,255,0.6)`; CTA `0 10px 26px rgba(0,102,204,0.26)`; foto `0 12px 34px rgba(0,0,0,0.1)`; sheet `0 -12px 48px rgba(0,0,0,0.24)`.

**Touch target**: mai sotto 44px; CTA principali 56–60px.

## Assets
- `assets/alessandro.jpg` — ritratto fornito dal cliente (796×1000, fondo bianco). Usato: avatar navbar 30px (`object-position: 50% 12%`) e cornice 4:5 nell'hero della pagina percorso. Attenzione: **non** è un PNG scontornato, quindi evitare trattamenti "a figura intera" su fondo colorato — usare sempre un frame con `object-fit: cover`.
- Nessuna icon library: le poche glifi (→, ←, ↗) sono caratteri.
- Nessun font da caricare (system font).

## Dove sta nel codice

| Spec | Implementazione |
| --- | --- |
| Landing (5 sezioni, snap verticale) | `src/app/page.tsx` |
| Pagina percorso | `src/app/chi-sono/page.tsx` |
| Navbar (le due pill in vetro) | `src/components/Navbar.tsx` |
| Bottom sheet + fisica del drag | `src/components/CallSheet.tsx` |
| CTA che apre il sheet | `src/components/CallButton.tsx` |
| Carosello dei percorsi e contatore | `src/components/PathsRail.tsx` |
| Dot di sezione | `src/components/SectionDots.tsx` |
| Schede contatto e CTA di chiusura | `src/components/Contacts.tsx` |
| Token, materiali, tipografia | `src/app/globals.css` |
| Tutti i testi | `src/content/site.ts` |
| Ritratto | `public/alessandro.jpg` |

Niente librerie di stile e niente font da caricare: CSS scritto a mano e font
di sistema, come chiede la spec.

## Scostamenti dal handoff

Sezione 5 della landing (Contatti), su richiesta del cliente:

- i tre recapiti sono tutti chiari (scheda bianca con bordo), come nella
  pagina "Chi sono": il telefono non è più l'unica scheda blu piena;
- sotto ai recapiti c'è una CTA celeste (`rgba(0,102,204,0.09)`, testo
  `#0066cc`) "Il mio percorso" che porta alla pagina "Chi sono" — è il
  gemello della CTA blu che chiude la pagina "Chi sono" e riporta ai percorsi.

Scorrimento della landing, dopo la prova su telefono:

- **niente snap verticale.** `scroll-snap-type: y proximity` con sezioni alte
  quanto lo schermo si metteva di traverso al dito: a metà gesto la pagina
  veniva riagganciata alla sezione vicina. Lo scroll ora è quello nativo; le
  sezioni restano alte una schermata e i dot continuano a seguirle con
  l'IntersectionObserver. Resta lo snap orizzontale del carosello, che invece
  è quello che ci si aspetta da un carosello.
- **`100svh` al posto di `100dvh`.** Con `dvh` ogni apertura e chiusura della
  barra di Safari ridimensionava tutte le sezioni: il contenuto si spostava
  mentre lo si leggeva. `svh` è l'altezza minima e non cambia mai.
- **niente `overscroll-behavior-y: none`,** che toglieva il rimbalzo di fine
  pagina — parte di come ci si aspetta che una pagina si comporti su iOS.
- **ancore riallineate a layout finito** (`src/components/HashScroll.tsx`):
  arrivando da `/#percorsi` il browser sceglieva la posizione in pixel troppo
  presto e si finiva a fondo sezione invece che sul suo titolo.
