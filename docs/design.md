# Specifica di design — Landing page "Giornate AI per PMI"

Documento vincolante. Ogni valore è normativo. Dove c'è un numero, si usa quel numero.
Stack di riferimento: Next.js App Router, TypeScript, Tailwind CSS v4 (token in `@theme`), static export, `next/font`.

---

## 1. Concept

La pagina è un documento, non un sito commerciale: si legge come una monografia di studio, con la calma di chi non deve convincere ma spiegare.
Nessuna immagine, nessuna icona: solo tipografia grande e leggera, filetti hairline da 1px e spazio vuoto che vale il 70% della superficie.
La griglia è dichiarata e asimmetrica — etichette a sinistra su una corsia stretta, contenuto su una corsia larga spostata a destra — e questa asimmetria si ripete identica in ogni sezione, così che il lettore la impari entro la seconda schermata.
Il colore è quasi assente: off-white e quasi-nero, due grigi di servizio; l'accento compare tre volte in tutta la pagina, sempre e solo dove si chiede un'azione.
L'unico obiettivo è il contatto: un solo CTA, ripetuto in tre punti, sempre con la stessa etichetta e lo stesso stile.

---

## 2. Griglia

### 2.1 Contenitore

| Breakpoint | Larghezza viewport | Colonne | Margine laterale (padding del contenitore) | Gutter | Max-width contenuto |
|---|---|---|---|---|---|
| `base` (mobile) | 320–639px | 4 | 24px | 16px | 100% |
| `sm` | 640–1023px | 8 | 40px | 20px | 100% |
| `lg` (desktop) | 1024–1439px | 12 | 64px | 24px | 100% |
| `xl` (large) | ≥1440px | 12 | auto (centrato) | 32px | **1360px** |

- Il contenitore è unico: `.shell` → `w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-16`.
- Le colonne sono un CSS Grid a 12 (`grid-cols-4 sm:grid-cols-8 lg:grid-cols-12`), gutter tramite `gap-x`.
- Su viewport ≥1600px **non** si allarga oltre 1360px: cresce solo il vuoto laterale. È voluto.
- Il grid è dichiarato al livello di sezione, non di pagina: ogni `<section>` apre il proprio grid dentro `.shell`.

### 2.2 Corsie asimmetriche ricorrenti

Tre corsie, e solo tre. Ogni elemento della pagina cade in una di queste.

| Nome | Desktop (12 col) | Tablet (8 col) | Mobile (4 col) | Uso |
|---|---|---|---|---|
| **Lane A — etichetta** | col 1 → 2 (span 2) | col 1 → 8 (span 8, sopra) | span 4 (sopra) | eyebrow, numerazione, micro-label |
| **Lane B — contenuto** | col 3 → 9 (span 7) | col 1 → 8 (span 8) | span 4 | corpo, titoli di sezione, testo lungo |
| **Lane C — spinta** | col 4 → 12 (span 9) | col 1 → 8 (span 8) | span 4 | display/hero, titoli fuori misura |

Regole d'uso:
- **Lane A + Lane B affiancate** è il pattern base di ogni sezione (chi sono, come funziona, contatto).
- **Lane C** si usa solo nel hero e nei titoli delle schede percorso, per creare uno scarto percepibile di una colonna rispetto a Lane B. Lo scarto (col 3 vs col 4) è deliberato e deve essere visibile.
- Le colonne 10–12 restano **vuote** in tutte le sezioni che usano Lane B. Il vuoto a destra è l'elemento di design, non uno spazio da riempire.
- Su mobile tutto collassa a colonna singola full-width; Lane A diventa una riga sopra Lane B, con 16px di distacco.

### 2.3 Filetti hairline

Regola: `1px` (non 0.5px, non 2px) in `--color-hairline`. Mai ombre.

Dove cadono, in ordine di apparizione:
1. Sotto l'header sticky — **solo dopo scroll > 24px**, full-bleed da margine a margine del `.shell`.
2. Sopra ogni sezione (`border-top` sul `<section>`), full-width del `.shell`, tranne: hero (nessun filetto sopra) e la sezione immediatamente successiva all'header.
3. Tra una scheda percorso e la successiva: filetto orizzontale full-width del `.shell`.
4. Nel hero: un filetto orizzontale corto (`width: 64px`) sotto l'eyebrow, allineato a Lane A, `margin-bottom: 24px`.
5. Sotto ogni campo del form (i campi sono underline-only: `border-bottom: 1px`, nessun box).
6. Sopra il footer.
7. **Mai** filetti verticali. Mai bordi completi attorno a un box, con la sola eccezione del bottone CTA.

---

## 3. Tipografia

### 3.1 Famiglia

Un solo carattere: **Inter** (Google Fonts, via `next/font/google`), subset `latin` (copre à è é ì ò ù e le maiuscole accentate È/À). Pesi caricati: **300, 400, 500**. Nessun altro peso, nessun secondo carattere.

```ts
// app/fonts.ts
import { Inter } from "next/font/google";
export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-sans",
});
```

Motivazione (2 righe): Inter regge il peso 300 a corpi molto grandi senza sfilacciarsi e resta perfettamente leggibile a 17–19px nel corpo, che è la condizione richiesta da lettori 40–60 anni.
È neutra al punto giusto per un registro da studio di architettura, ha metriche italiane complete e, essendo variabile e servita locale da `next/font`, non costa nulla in Lighthouse.

Fallback stack: `var(--font-sans), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
Feature: `font-feature-settings: "kern" 1, "liga" 1, "cv05" 1;` sul `body` (`cv05` = l a bastone chiusa, più editoriale). Numeri tabellari **solo** sulla numerazione delle schede: `font-variant-numeric: tabular-nums lining-nums;`.

### 3.2 Scala

Tutte le misure con `clamp()` tra 360px e 1440px di viewport. `letter-spacing` in `em`.

| Livello | `font-size` | line-height | letter-spacing | weight | Uso |
|---|---|---|---|---|---|
| `display` | `clamp(2.75rem, 1.30rem + 6.45vw, 6.25rem)` → 44 → 100px | `0.98` | `-0.035em` | 300 | titolo hero, unico in pagina |
| `h1` | `clamp(2.25rem, 1.39rem + 3.84vw, 4.50rem)` → 36 → 72px | `1.04` | `-0.030em` | 300 | (riservato; non usato — il hero è `display`) |
| `h2` | `clamp(1.875rem, 1.30rem + 2.56vw, 3.375rem)` → 30 → 54px | `1.08` | `-0.025em` | 300 | titoli di sezione |
| `h3` | `clamp(1.375rem, 1.11rem + 1.18vw, 2.063rem)` → 22 → 33px | `1.18` | `-0.018em` | 400 | titoli delle schede percorso, passi del "come funziona" |
| `h4` | `clamp(1.0rem, 0.95rem + 0.21vw, 1.125rem)` → 16 → 18px | `1.30` | `-0.010em` | 500 | sotto-intestazioni interne alla scheda ("Il problema", "La giornata") |
| `body-lg` | `clamp(1.188rem, 1.07rem + 0.51vw, 1.500rem)` → 19 → 24px | `1.55` | `-0.011em` | 300 | sottotitolo hero, primo paragrafo di "chi sono" |
| `body` | `clamp(1.063rem, 1.02rem + 0.19vw, 1.188rem)` → 17 → 19px | `1.65` | `-0.006em` | 400 | corpo generale |
| `small` | `clamp(0.875rem, 0.85rem + 0.11vw, 0.938rem)` → 14 → 15px | `1.60` | `0` | 400 | credenziali, nota formato, footer, help del form |
| `eyebrow` | `0.75rem` fisso (12px) | `1.20` | `0.14em` | 500 | etichette Lane A, numerazione schede, label form — **sempre UPPERCASE** |

Regole:
- **Misura di riga massima**: `body` e `body-lg` → `max-width: 66ch`; testo dentro le schede percorso → `62ch`; `display` e `h2` → `18ch`; `h3` → `24ch`; `small` → `72ch`. Applicare `max-width`, non contare a mano.
- Nessun testo giustificato. Sempre `text-align: left`, `text-wrap: pretty` sui paragrafi, `text-wrap: balance` su `display`/`h2`/`h3`.
- Nessun `text-transform: uppercase` fuori da `eyebrow`.
- Spazio tra paragrafi consecutivi: `margin-top: 1.15em` (relativo al proprio corpo). Mai `<br>`.
- Vietato l'uso di corsivo e grassetto dentro il corpo, tranne: `<strong>` con `font-weight: 500` (non 700) al massimo 4 occorrenze in tutta la pagina.

---

## 4. Colore

### 4.1 Token

| Token | Hex | Ruolo |
|---|---|---|
| `--color-bg` | `#F7F6F3` | fondo pagina, off-white caldo |
| `--color-surface` | `#FFFFFF` | usato **solo** per i campi form in focus — nessun altro uso |
| `--color-ink` | `#141414` | quasi-nero, testo primario e titoli |
| `--color-gray-1` | `#5A5A57` | testo secondario: eyebrow, credenziali, "a chi si rivolge", footer |
| `--color-gray-2` | `#8C8C88` | testo terziario: placeholder, numerazione schede, testo disabilitato |
| `--color-hairline` | `#DEDCD6` | tutti i filetti da 1px e i bordi dei campi |
| `--color-accent` | `#7A3B2E` | terracotta scura — accento unico |
| `--color-accent-hover` | `#5E2C22` | solo stato hover/active del CTA |
| `--color-error` | `#8C2F1F` | solo messaggi ed evidenziazione di errore del form |

Dark mode: **non prevista**. `color-scheme: light` esplicito su `:root`, `<body>` con background `--color-bg` dichiarato.

### 4.2 Contrasti WCAG (calcolati su `--color-bg #F7F6F3`)

| Combinazione | Ratio | Esito |
|---|---|---|
| `ink #141414` su `bg` | **15.9:1** | AAA (corpo ✓) |
| `gray-1 #5A5A57` su `bg` | **6.9:1** | AA large ✓, AA normal ✓ — usato solo ≥14px |
| `gray-2 #8C8C88` su `bg` | **3.2:1** | AA solo per testo ≥24px o elementi non testuali; **mai** per testo di lettura. Ammesso per placeholder e numerazione decorativa (che è duplicata nell'`aria-label` della scheda) |
| `accent #7A3B2E` su `bg` | **7.9:1** | AAA ✓ |
| `bg #F7F6F3` su `accent #7A3B2E` (CTA pieno) | **7.9:1** | AAA ✓ |
| `bg` su `accent-hover #5E2C22` | **11.0:1** | AAA ✓ |
| `error #8C2F1F` su `bg` | **7.4:1** | AAA ✓ |
| `hairline #DEDCD6` su `bg` | 1.15:1 | elemento decorativo: **mai** portatore di informazione unica |
| `ink` su `surface #FFFFFF` (campo in focus) | 17.4:1 | AAA ✓ |

Corpo del testo: sempre `ink`. Nessuna eccezione.

### 4.3 Usi dell'accento — elenco chiuso

L'accento compare **3 volte** in tutta la pagina, tutte e tre legate all'azione di contatto:

1. **CTA primario del hero** — bottone con fondo `--color-accent` e testo `--color-bg`.
2. **CTA di chiusura della sezione "I percorsi"** — stesso bottone, stessa etichetta, stesso stile.
3. **Bottone di invio del form** — stesso bottone.

Fuori da questi tre elementi l'accento **non esiste**: niente accento su link, hover di testo, sottolineature, numerazioni, filetti, headline, focus ring (che è `ink`), messaggio di successo. Il CTA dell'header, se presente, è **testuale in `ink`**, non accentato — proprio per non aggiungere una quarta occorrenza.

---

## 5. Spaziatura

### 5.1 Scala (base 4px, non lineare)

`4, 8, 12, 16, 24, 32, 40, 56, 72, 96, 128, 160, 200, 240` px.
Token Tailwind: `--spacing-1..14` mappati su questi valori. Nessun valore fuori scala, tranne i `clamp()` sotto.

### 5.2 Ritmo verticale delle sezioni

`padding-block` di ogni `<section>`:

| Sezione | padding-top | padding-bottom |
|---|---|---|
| Hero | `clamp(96px, 4.5rem + 8vw, 200px)` | `clamp(96px, 4.5rem + 8vw, 200px)` |
| Standard (chi sono, come funziona, contatto) | `clamp(80px, 3.5rem + 6.4vw, 160px)` | `clamp(80px, 3.5rem + 6.4vw, 160px)` |
| I percorsi | `clamp(80px, 3.5rem + 6.4vw, 160px)` | `clamp(64px, 3rem + 4.5vw, 120px)` |
| Footer | `clamp(40px, 2rem + 1.6vw, 56px)` | `clamp(40px, 2rem + 1.6vw, 56px)` |

Il filetto di sezione coincide con il `border-top`: quindi la distanza percepita tra fine testo e filetto successivo è il `padding-bottom` della sezione precedente.

### 5.3 Ritmo interno

| Relazione | Mobile | Desktop |
|---|---|---|
| Lane A → Lane B (verticale su mobile) | 16px | — (affiancate) |
| Titolo di sezione (`h2`) → primo paragrafo | 32px | 48px |
| Paragrafo → paragrafo | 1.15em | 1.15em |
| Blocco → blocco dentro una scheda | 24px | 32px |
| Scheda → filetto → scheda successiva | 48px / 1px / 48px | 72px / 1px / 72px |
| Titolo → CTA | 40px | 56px |
| Campo form → campo form | 32px | 40px |

---

## 6. Sezione per sezione

Notazione wireframe: `|` bordo del `.shell`; `·` colonna vuota; `───` filetto hairline.

### 6.0 Header

**Decisione: sì, serve** — ma ridotto a due elementi e senza navigazione a voci multiple. Un CEO che scrolla deve avere sempre a portata l'azione, e l'header è l'unico modo di darla senza ripetere un terzo bottone accentato.

Struttura: `position: sticky; top: 0; z-index: 50;` altezza **72px** desktop / **64px** mobile. Fondo `--color-bg` con `background-color` pieno (nessun blur, nessuna trasparenza, nessun glassmorphism).

- Sinistra (Lane A, col 1–3): nome del consulente, livello `eyebrow` ma **senza uppercase e senza tracking allargato** → override: `font-size: 15px; weight: 500; letter-spacing: -0.005em; color: ink`. È un wordmark tipografico, non un logo.
- Destra (col 11–12, allineato a destra): link testuale `Contatto` → `eyebrow` in `ink`, `text-decoration: none`, con underline `1px` in `hairline` a `offset 6px` che al hover diventa `ink`. Punta a `#contatto` con scroll morbido.
- Nessuna altra voce. Nessun menu hamburger su mobile: i due elementi stanno entrambi in 64px anche a 320px.
- Il filetto inferiore appare solo dopo `scrollY > 24`, con `transition: opacity 200ms linear`.

```
| Nome Cognome                                              Contatto |
|───────────────────────────────────────(solo dopo scroll)──────────|
```

### 6.1 Hero

Desktop:

```
|  col1-2        col3 ────────────────────────── col12              |
|  GIORNATE                                                          |
|  ───64px                                                           |
|            [col 4 → 12]                                            |
|            Formazione sull'AI                                      |
|            per chi decide.                        ← display        |
|                                                                    |
|                        [col 4 → 9]                                 |
|                        Sei ore per capire cosa cambia...           |
|                        ← body-lg, max 52ch                         |
|                                                                    |
|                        [ Prenota una conversazione ]  ← CTA        |
|                                                                    |
```

- Eyebrow su **Lane A** (col 1–2), in alto, `gray-1`. Sotto di esso il filetto corto da 64px.
- Titolo su **Lane C** (col 4–12), livello `display`, `ink`, max 2 righe forzate via `max-width: 14ch` a desktop — il titolo deve mandare a capo dove decide il designer, non dove capita. Su viewport <1024px `max-width` sale a 100%.
- Lo scarto di una colonna tra eyebrow (col 1) e titolo (col 4) è il gesto d'apertura della pagina: è il primo momento in cui la griglia asimmetrica si dichiara.
- Sottotitolo su col **4 → 9** (span 6), `body-lg`, `gray-1`, `max-width: 52ch`, distanza dal titolo 40px mobile / 56px desktop.
- CTA allineato a sinistra sulla stessa colonna 4 del titolo, distanza dal sottotitolo 48px mobile / 64px desktop. **Un solo CTA.** Nessun link secondario "scopri di più".
- Nessun filetto sopra il hero. Nessuno scroll indicator, nessuna freccia.

Mobile: colonna singola. Ordine invariato: eyebrow → filetto 48px → titolo (`display`, `max-width: none`) → 32px → sottotitolo (`body-lg`) → 40px → CTA a piena larghezza fino a 400px di viewport, poi `width: auto` inline.

### 6.2 Chi sono

```
|─────────────────────────────────────────────────────────────────────|
|  col1-2          col3 ──────────────────────── col9      col10-12  |
|  CHI SONO        Ho passato quindici anni...              ·  ·  ·  |
|                  ← body-lg (primo paragrafo)                       |
|                                                                     |
|                  Secondo paragrafo. ← body                          |
|                                                                     |
|                  Terzo paragrafo. ← body                            |
|                                                                     |
|                  ──────────────── (filetto largo quanto Lane B)     |
|                  Docente a ... — ... — ... ← small, gray-1          |
```

- Eyebrow "CHI SONO" su Lane A, `sticky top: 96px` a desktop (≥1024px) per la durata della sezione — è l'unico elemento sticky oltre all'header e regala continuità alla corsia sinistra. Su mobile e tablet non è sticky.
- Nessun `h2` in questa sezione: l'eyebrow fa da intestazione ed è marcato `<h2>` con classe `eyebrow` (gerarchia semantica corretta, peso visivo minimo). Questa è l'eccezione dichiarata.
- Tre paragrafi su Lane B (col 3–9). Il **primo** in `body-lg` `ink`; secondo e terzo in `body` `ink`. Interparagrafo 1.15em.
- Riga credenziali: preceduta da 40px di spazio e da un filetto hairline largo quanto Lane B. Livello `small`, colore `gray-1`, separatori con `—` circondato da spazi sottili. Una riga sola su desktop, va a capo naturalmente su mobile.
- Nessun ritratto fotografico. Se il committente lo chiede, la risposta è no.

### 6.3 I percorsi

Il problema è la densità: 4 schede ricche + 1 breve, ciascuna con 6 blocchi di testo. Soluzione: **niente card**. Nessun riquadro, nessun fondo diverso, nessun bordo perimetrale, nessuna griglia a 2 o 3 colonne affiancate — quello sarebbe il pricing table SaaS da evitare. Ogni percorso è una **voce di indice**, impaginata a piena larghezza e separata dalla successiva da un filetto e da 144px di aria. Si scorre in verticale come un catalogo di progetti.

Intestazione di sezione:
- Eyebrow "I PERCORSI" su Lane A.
- `h2` su Lane B (col 3–9): titolo di sezione, max 18ch.
- 96px di stacco prima della prima scheda.

**Anatomia di una scheda ricca (desktop, ≥1024px)** — griglia interna a 12 colonne, tre corsie:

```
|───────────────────────────────────────────────────────────────────────|
|  c1-2      c4 ─────────────── c8        c9 ──────────── c12          |
|  01                                                                   |
|            Il consiglio di amministrazione                            |
|            e l'intelligenza artificiale        ← h3, max 24ch         |
|                                                                       |
|  A CHI SI  Amministratori delegati di aziende                         |
|  RIVOLGE   manifatturiere fino a 200 addetti.  ← body, gray-1         |
|                                                                       |
|            IL PROBLEMA                    COSA RESTA                  |
|            Frase uno. Frase due.          — Voce uno                  |
|            Frase tre. ← body              — Voce due                  |
|                                           — Voce tre                  |
|            LA GIORNATA                    ← body, ink                 |
|            Frase uno. Frase due.                                      |
|            Frase tre. ← body                                          |
|                                                                       |
|───────────────────────────────────────────────────────────────────────|
```

Regole precise:
- **Numero** (`01`–`05`): col 1–2, livello `eyebrow`, `tabular-nums`, colore `gray-2`. Allineato in alto al titolo (stessa baseline della prima riga di `h3` — usare `line-height` compensato, non `margin` a occhio: `padding-top: 0.35em` sul numero).
- **Titolo**: col 4–8 (span 5), `h3`, `ink`, `max-width: 24ch`. Nota lo scarto: il numero è su col 1, il titolo su col 4 — stessa asimmetria del hero.
- **"A chi si rivolge"**: label `eyebrow` `gray-1` su col 1–2, testo su col 4–8, livello `body`, colore `gray-1`, max 2 righe (`max-width: 46ch`). È l'unico blocco che replica il pattern label-a-sinistra: serve a distinguerlo dai due blocchi narrativi.
- **"Il problema"** e **"La giornata"**: entrambi su col 4–8 (span 5), impilati verticalmente con 32px tra loro. Ogni blocco = label `h4` in `ink` + 12px + tre frasi in `body` `ink`, `max-width: 62ch`. Le tre frasi sono **un unico paragrafo**, non tre righe elenco.
- **"Cosa resta"**: col 9–12 (span 4), allineato in alto alla label "IL PROBLEMA" (cioè `align-self: start` sulla stessa riga di grid). Label `h4` in `ink` + 12px + tre voci in `body` `ink`. Le tre voci sono un `<ul>` con `list-style: none`, ogni `<li>` preceduta da un trattino em (`—`) come pseudo-elemento, `padding-left: 20px`, `text-indent: -20px`; interlinea tra voci 12px. `max-width: 30ch`.
- La colonna 3 resta **sempre vuota** dentro la scheda. È il respiro che impedisce alla densità di sembrare una tabella.
- Distanza verticale tra i blocchi della scheda: titolo → "a chi si rivolge" 40px; "a chi si rivolge" → blocco doppio 48px.
- **Filetto** hairline full-width del `.shell` tra una scheda e l'altra, con 72px sopra e 72px sotto.

**Quinta scheda (breve)**: stessa griglia, ma solo numero + titolo + "a chi si rivolge" + un unico paragrafo `body` su col 4–8 al posto dei tre blocchi. Nessun "cosa resta", quindi le colonne 9–12 restano vuote: la caduta di densità è visibile e comunica "questa è più leggera". Non aggiungere contenuto per pareggiare.

**Tablet (640–1023px)**: la scheda diventa a colonna singola su 8 colonne. Ordine: numero (riga a sé, `eyebrow`) → titolo (span 8) → "A CHI SI RIVOLGE" label sopra il testo → "IL PROBLEMA" → "LA GIORNATA" → "COSA RESTA". "Cosa resta" scende quindi sotto: è corretto, è la voce conclusiva.

**Mobile (<640px)**: identico al tablet su 4 colonne, con: distanza tra blocchi 24px, tra schede 48px + filetto + 48px, `h3` che scende a 22px. Le label `h4` restano 16px/500.

**Chiusura della sezione**: dopo l'ultima scheda, filetto, poi 96px, poi il **CTA accentato n. 2** su col 4 (allineato ai titoli delle schede), preceduto da una riga `body-lg` su col 4–9: una frase sola. Poi il `padding-bottom` di sezione.

### 6.4 Come funziona

```
|─────────────────────────────────────────────────────────────────────|
|  c1-2        c3 ─────────────────────── c9              c10-12     |
|  COME                                                               |
|  FUNZIONA    Titolo di sezione ← h2                        ·  ·  · |
|                                                                     |
|  01          Una conversazione                                      |
|              Testo del passo. ← body, max 58ch                      |
|              ─────────────────────────────  (filetto Lane B)        |
|  02          La preparazione                                        |
|              Testo del passo.                                       |
|              ─────────────────────────────                          |
|  03          La giornata                                            |
|              Testo del passo.                                       |
|                                                                     |
|              Sei ore, tre più tre, metà laboratorio. ← small,gray-1 |
```

- Eyebrow su Lane A; `h2` su Lane B (col 3–9), max 18ch; 64px di stacco prima del primo passo.
- Ogni passo: numero `01/02/03` su col 1–2 (`eyebrow`, `gray-2`, `tabular-nums`), titolo del passo `h3` su col 3–9, testo `body` sotto al titolo con 16px di stacco, `max-width: 58ch`.
- Tra un passo e l'altro: 40px + filetto hairline **largo quanto Lane B** (col 3–9, non full-width: distingue i passi dalle sezioni) + 40px. Nessun filetto dopo il terzo passo.
- Riga formato: 48px sotto il terzo passo, su col 3–9, livello `small`, `gray-1`. Testo unico su una riga, senza icone, senza bullet, senza box. Es.: `Sei ore in una sola giornata — tre di lavoro al mattino, tre al pomeriggio — metà del tempo è laboratorio.`

Mobile: numero su riga propria sopra il titolo del passo, 8px di stacco; filetto tra passi full-width della colonna.

### 6.5 Contatto

```
|─────────────────────────────────────────────────────────────────────|
|  c1-2        c3 ──────── c7        c8 ─────── c11        c12       |
|  CONTATTO                                                      ·    |
|              Titolo ← h2 (col 3-7)                                  |
|              Una frase. ← body-lg                                   |
|                                                    Telefono         |
|              Nome                                  +39 ...          |
|              ─────────────────────                                  |
|              Azienda                               Email            |
|              ─────────────────────                 nome@...         |
|              Email                                                  |
|              ─────────────────────                                  |
|              Messaggio                                              |
|              ─────────────────────                                  |
|              ─────────────────────                                  |
|                                                                     |
|              [ Invia il messaggio ]  ← CTA accentato                |
```

- Eyebrow "CONTATTO" su Lane A. `h2` su col 3–7 (span 5), max 18ch. Sotto, una frase `body-lg` `gray-1` su col 3–7, max 46ch. 64px di stacco prima del form.
- **Form** su col 3–7 (span 5). Non a piena larghezza: un form largo sembra un modulo burocratico.
- **Recapiti in chiaro** su col 9–11 (span 3), allineati in alto al primo campo del form. Ogni recapito: label `eyebrow` `gray-1` + 8px + valore `body` `ink` come `<a href="tel:">` / `<a href="mailto:">`. Distanza tra i due blocchi 32px. Sono link, non testo morto.
- **Campi**: underline-only. `border: 0; border-bottom: 1px solid var(--color-hairline); background: transparent; padding: 12px 0; font-size: 17px; line-height: 1.5; color: ink; border-radius: 0;`. Altezza minima 48px (touch target). Nessun box, nessun fondo grigio.
- **Label**: sempre visibili sopra il campo (`eyebrow`, `gray-1`, `margin-bottom: 8px`). **Mai** placeholder al posto della label — su questo target il floating label è un errore.
- Campo `Messaggio`: `<textarea rows="4">`, stesso stile, `resize: vertical`.
- Distanza tra campi: 40px desktop / 32px mobile.
- Bottone di invio 56px sotto l'ultimo campo, allineato a sinistra su col 3.
- Sotto il bottone, 24px, riga `small` `gray-1` con la nota privacy in una frase e link testuale.

Mobile: tutto in colonna singola; i recapiti in chiaro vanno **sopra** il form (dopo la frase introduttiva, 40px di stacco, poi 48px prima del primo campo). Su mobile chi vuole telefonare deve trovare il numero prima del modulo.

### 6.6 Footer

- `border-top` hairline full-width. Altezza contenuto minima, `padding-block` da §5.2.
- Sinistra (col 1–4): nome + `© 2026`, livello `small`, `gray-1`.
- Destra (col 9–12, allineato a destra): P. IVA e link `Privacy`, livello `small`, `gray-1`.
- Mobile: due righe impilate, 12px di stacco, entrambe allineate a sinistra.
- Niente social, niente newsletter, niente ripetizione del menu, niente "torna su".

---

## 7. Stati e interazioni

### 7.1 Link testuali (in corpo, recapiti, footer)

- Default: `color: ink`, `text-decoration: underline`, `text-decoration-color: var(--color-hairline)`, `text-decoration-thickness: 1px`, `text-underline-offset: 5px`.
- Hover: `text-decoration-color: var(--color-ink)`. Transizione `text-decoration-color 160ms linear`. Nessun cambio di colore del testo, nessun movimento.
- Active: `opacity: 0.7`.
- Visited: identico a default.

### 7.2 Focus-visible (globale)

```css
:where(a, button, input, textarea, [tabindex]):focus-visible {
  outline: 2px solid var(--color-ink);
  outline-offset: 3px;
  border-radius: 2px;
}
```
Mai `outline: none` senza sostituto. Sul CTA accentato l'outline resta `ink` con `outline-offset: 3px`: contrasto outline/fondo 15.9:1. Sui campi form l'outline sostituisce l'underline colorato (vedi 7.4).

### 7.3 CTA primario

Un solo stile, usato nelle 3 occorrenze accentate. Etichetta sempre in **sentence case**, mai uppercase.

- Default: `background: var(--color-accent); color: var(--color-bg); border: 1px solid var(--color-accent); border-radius: 2px; padding: 18px 32px; font-size: 17px; font-weight: 500; letter-spacing: -0.005em; line-height: 1;` altezza risultante 55px. **Nessuna ombra, nessun gradiente.**
- Hover: `background: var(--color-accent-hover); border-color: var(--color-accent-hover);` `transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1)`. Nessuno scale, nessun translate, nessuna ombra.
- Active: `background: var(--color-accent-hover); transform: translateY(1px);`.
- Disabled: `background: transparent; color: var(--color-gray-2); border-color: var(--color-hairline); cursor: not-allowed;`.
- Mobile <400px: `width: 100%`, testo centrato. Da 400px in su `width: auto`, testo centrato, allineamento a sinistra nel flusso.

Link CTA dell'header (non accentato): testo `eyebrow` in `ink` con underline hairline → `ink` al hover. Target minimo 44×44px garantito da `padding: 14px 4px; margin: -14px -4px`.

### 7.4 Campi del form

| Stato | Stile |
|---|---|
| Default | `border-bottom: 1px solid var(--color-hairline)`, `background: transparent`, testo `ink`, placeholder `gray-2` |
| Hover | `border-bottom-color: var(--color-gray-2)`; `transition: border-color 160ms linear` |
| Focus | `border-bottom: 1px solid var(--color-ink)`, `background: var(--color-surface)`, `padding-inline: 12px`, `margin-inline: -12px` (il campo si "accende" senza spostare il testo), più outline di §7.2 |
| Errore | `border-bottom: 1px solid var(--color-error)`; sotto il campo, 8px, messaggio `small` in `--color-error`, `role="alert"`, `id` referenziato da `aria-describedby`. La label resta `gray-1` (nessun rosso sulla label) |
| Disabled | testo `gray-2`, `border-bottom-color: var(--color-hairline)`, `opacity: 1`, `cursor: not-allowed` |

Validazione: **solo al submit** e poi `onBlur` per i campi già toccati. Mai validazione live durante la digitazione. Al submit fallito: focus programmatico sul primo campo in errore + `aria-live="polite"` su un riepilogo `small` sopra il form.

### 7.5 Invio e successo

- **Invio in corso**: il bottone entra in stato disabled (§7.3), l'etichetta diventa `Invio in corso…`. Nessuno spinner, nessuna animazione. I campi passano a `readonly` (non disabled, per non perdere il contrasto).
- **Successo**: il form viene **sostituito** in-place da un blocco su col 3–7 con `role="status"` e `aria-live="polite"`: un `h3` (`Messaggio ricevuto.`) + un paragrafo `body` `gray-1` di due righe con il tempo di risposta atteso + un filetto hairline sopra il blocco. Nessun colore verde, nessun segno di spunta, nessuna icona. L'altezza del blocco è libera: la pagina si accorcia, e va bene.
- **Errore di rete**: il form resta compilato; sopra il bottone compare un messaggio `small` in `--color-error` con `role="alert"` e l'invito a scrivere all'indirizzo email in chiaro (link mailto attivo).

---

## 8. Motion

Un solo pattern d'entrata in tutta la pagina. Nessuna animazione al hover che sposti elementi, nessun parallasse, nessun contatore, nessun `scroll-behavior` animato oltre a quello nativo dei link interni.

### 8.1 Reveal on scroll

- **Da**: `opacity: 0; transform: translateY(16px);`
- **A**: `opacity: 1; transform: translateY(0);`
- **Durata**: `520ms` (dentro il range richiesto 400–600).
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Proprietà animate**: solo `opacity` e `transform`. `will-change: opacity, transform` applicato solo mentre l'elemento è in attesa, rimosso a fine transizione.
- **Trigger**: `IntersectionObserver` con `threshold: 0.15` e `rootMargin: "0px 0px -10% 0px"`. Una sola volta per elemento (`unobserve` dopo il trigger).
- **Unità animata**: il blocco, non la singola riga. Cioè: hero (eyebrow+titolo+sottotitolo+CTA come 4 unità in stagger), intestazione di sezione, ogni paragrafo di "chi sono", ogni scheda percorso **intera** (una unità, non i suoi 6 blocchi), ogni passo del "come funziona", intestazione contatto, form intero, recapiti.
- **Stagger**: `70ms` tra elementi fratelli, massimo **5 step** (350ms totali); dal sesto in poi il delay resta 350ms. Implementato con `transition-delay` inline calcolato dall'indice.
- **Hero**: parte al load, non allo scroll, con `120ms` di delay iniziale e lo stesso stagger di 70ms su eyebrow → titolo → sottotitolo → CTA.
- **Header**: nessuna animazione d'entrata. Il filetto inferiore fa `opacity 0 → 1` in `200ms linear` oltre i 24px di scroll.

### 8.2 `prefers-reduced-motion: reduce`

Comportamento completo, non parziale:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

Inoltre, lato JS: se `window.matchMedia("(prefers-reduced-motion: reduce)").matches`, l'`IntersectionObserver` **non viene istanziato** e tutti gli elementi ricevono lo stato finale (`opacity: 1; transform: none`) al primo paint. Le transizioni di hover/focus (colore, border-color) sono già sotto la soglia percettiva e vengono comunque azzerate dalla regola sopra: il focus ring resta pienamente visibile perché è un `outline` statico, non animato.

**Fallback senza JS**: lo stato di partenza `opacity: 0` viene applicato da una classe che uno script inline nel `<head>` aggiunge a `<html>` (`js-motion`). Se JS non gira, la classe non c'è e tutto il contenuto è visibile. Nessun contenuto può dipendere da JS per essere leggibile.

---

## 9. Accessibilità

### 9.1 Gerarchia heading

```
h1  — titolo hero (unico h1 della pagina)
h2  — "Chi sono" (eyebrow marcato h2, vedi §6.2)
h2  — titolo sezione "I percorsi"
  h3 — titolo di ciascuno dei 5 percorsi
    h4 — "Il problema" / "La giornata" / "Cosa resta" / "A chi si rivolge"
h2  — titolo sezione "Come funziona"
  h3 — titolo di ciascuno dei 3 passi
h2  — titolo sezione "Contatto"
  h3 — solo nello stato di successo del form
```
Nessun salto di livello. Gli eyebrow decorativi che non sono heading (es. "I PERCORSI" quando la sezione ha già un `h2`) sono `<p>` o `<span>`, non heading.

### 9.2 Landmark e struttura

- `<header>` (banner) → `<main>` → `<footer>` (contentinfo). Nessun `<nav>`: due link non sono una navigazione; il link "Contatto" dell'header vive dentro `<header>`.
- Ogni sezione è `<section aria-labelledby="id-del-suo-heading">`.
- Skip link come primo elemento focusabile del `<body>`: visivamente nascosto, visibile al focus (posizione fissa in alto a sinistra, fondo `bg`, testo `ink`, outline di §7.2), punta a `#main`.
- Il numero decorativo delle schede (`01`) è `aria-hidden="true"`; l'informazione d'ordine è già nella struttura del documento.
- `<html lang="it">`.

### 9.3 Target touch

Minimo **44×44px** per qualsiasi elemento interattivo, ottenuto con padding reale (non con `transform`). Campi form ≥48px di altezza. Spazio minimo tra due target adiacenti: 12px. Il link "Privacy" del footer e i recapiti in chiaro richiedono padding verticale `10px` con margini negativi compensativi per non alterare il ritmo.

### 9.4 Contrasto

Vedi §4.2. Regole operative: corpo sempre `ink` (AAA); `gray-1` mai sotto i 14px; `gray-2` mai su testo che porta informazione; nessuna informazione veicolata dal solo colore (l'errore del form ha sempre testo esplicito oltre al bordo rosso).

### 9.5 Form

- Ogni campo ha una `<label for>` visibile. Nessun `aria-label` al posto della label.
- `autocomplete`: `name`, `organization`, `email`. `inputmode="email"` sul campo email. `type="email"` per la tastiera mobile corretta.
- Campi obbligatori marcati con `required` e, testualmente, con la parola `(obbligatorio)` nella label in `small` `gray-2` — mai con un asterisco isolato.
- Errori: `aria-invalid="true"` + `aria-describedby` verso il messaggio, che ha `role="alert"`.
- Riepilogo errori sopra il form in `aria-live="polite"`; focus al primo campo invalido dopo il submit fallito.
- Nessun CAPTCHA visivo. Anti-spam via honeypot nascosto (`aria-hidden`, `tabindex="-1"`, fuori dal flusso con `position: absolute; left: -9999px`).

---

## 10. Da non fare

- Niente immagini, fotografie, illustrazioni, pattern, texture, ritratti.
- Niente icone, niente SVG decorativi, niente emoji, niente frecce, niente checkmark.
- Niente ombre (`box-shadow` compare zero volte nel CSS), niente gradienti, niente blur, niente trasparenze, niente glassmorphism.
- Niente card con bordo perimetrale, fondo diverso o `border-radius` > 2px. Le schede percorso non sono box.
- Niente griglia a 2–3 colonne di schede affiancate: sembrerebbe un pricing table.
- Niente dark mode, niente toggle di tema.
- Niente hero centrato, niente testo centrato in nessun punto tranne l'etichetta dentro il bottone.
- Niente testo giustificato, niente `<br>` per impaginare, niente maiuscolo fuori dagli eyebrow.
- Niente `font-weight: 700` o superiore, mai.
- Niente più di un CTA per schermata, niente CTA secondari, niente "scopri di più", niente scroll indicator.
- Niente accento fuori dai 3 punti dichiarati in §4.3 — nemmeno sui link, nemmeno sul focus ring.
- Niente animazioni al hover che spostino, ingrandiscano o ruotino elementi; niente parallasse, niente contatori animati, niente carosello.
- Niente floating label, niente placeholder usato come label, niente validazione live durante la digitazione.
- Niente prezzi, niente loghi di clienti, niente badge, niente "certificato", niente contatore di aziende formate.
- Niente cookie banner non necessario, niente chat widget, niente popup di exit intent, niente newsletter.
- Niente librerie di animazione o UI (no Framer Motion, no shadcn, no Headless UI): `IntersectionObserver` + CSS bastano e il budget Lighthouse non ammette altro JS.
- Niente icone social nel footer, niente "torna su".
- Nessuna larghezza di contenuto oltre 1360px, nessuna riga di testo oltre 66ch.
