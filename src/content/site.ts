/**
 * Tutti i contenuti del sito.
 *
 * Questo è l’unico file da toccare per cambiare i testi.
 * Non c’è un CMS, non c’è un database: si modifica qui, si fa il deploy.
 */

export type Path = {
  /** Numero progressivo mostrato accanto al titolo (01, 02, ...). */
  number: string;
  title: string;
  /** A chi si rivolge la giornata. Una riga. */
  audience: string;
  /** Come si svolge la giornata. Un paragrafo solo, corto. */
  body: string;
  /** Cosa resta a fine giornata. Due voci, non di più. */
  takeaways: string[];
};

export type Step = {
  number: string;
  title: string;
  body: string;
};

export type SiteContent = {
  meta: {
    /** Usato per i tag canonical e Open Graph. Senza slash finale. */
    url: string;
    locale: string;
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    /** Frase secca stampata sull’immagine Open Graph. */
    ogImageText: string;
    author: string;
  };
  contactDetails: {
    /** Come si legge sulla pagina. */
    phoneLabel: string;
    /** Come si compone: formato internazionale, senza spazi. */
    phoneHref: string;
    email: string;
  };
  nav: {
    /** Il nome in alto a sinistra. */
    brand: string;
    links: { label: string; href: string }[];
    /** Etichetta dello skip link, primo elemento focusabile (design §9.2). */
    skipLink: string;
  };
  hero: {
    /** Etichetta della corsia sinistra del hero (design §6.1). */
    eyebrow: string;
    title: string;
    subtitle: string;
    /** Durata, sede e forma della giornata, in una riga sola. */
    facts: string;
    cta: string;
  };
  /** La cornice: perché la giornata serve. Sta subito sotto il hero. */
  why: {
    eyebrow: string;
    title: string;
    body: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
  };
  paths: {
    eyebrow: string;
    title: string;
    /** Avvisa con garbo quali percorsi richiedono un reparto tecnico. */
    techNote: string;
    /** Etichette delle due parti di ogni scheda. */
    labels: {
      audience: string;
      takeaways: string;
    };
    items: Path[];
    /** Alternativa al form sotto il CTA di chiusura. Peso secondario. */
    ctaPhone: string;
  };
  how: {
    eyebrow: string;
    title: string;
    steps: Step[];
    formatLabel: string;
    format: string;
    /** Come si dà il prezzo. Nessuna cifra in pagina: si dice in chiamata. */
    price: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    /** Toglie l’attrito a chi vuole solo sapere la cifra. */
    price: string;
    /**
     * Endpoint Formspree (es. "https://formspree.io/f/xxxxxxx").
     * Se resta vuoto il form apre il client di posta con il messaggio già scritto.
     */
    formspreeEndpoint: string;
    form: {
      name: { label: string };
      company: { label: string };
      email: { label: string };
      message: { label: string; placeholder: string };
      submit: string;
      sending: string;
      success: string;
      error: string;
      /** Messaggi di validazione lato client. */
      required: string;
      invalidEmail: string;
      /** Parola accanto alla label dei campi obbligatori (design §9.5). */
      requiredHint: string;
      /** Riepilogo in aria-live sopra il form dopo un submit fallito. */
      errorSummary: string;
    };
    /**
     * Oggetto della mail precompilata quando `formspreeEndpoint` è vuoto.
     * Non compare in pagina: si legge solo nel client di posta.
     */
    mailtoSubject: string;
    /** Etichette dei recapiti in chiaro accanto al form. */
    phoneLabel: string;
    emailLabel: string;
    /** Riga sotto il bottone di invio. Una frase, niente legalese. */
    privacyNote: string;
    /** Titolo del blocco che sostituisce il form dopo l’invio. */
    successTitle: string;
  };
  footer: {
    line: string;
    /** Anno mostrato accanto al nome. */
    year: string;
  };
};

export const site: SiteContent = {
  meta: {
    url: "https://formazione-ai.example.com",
    locale: "it_IT",
    title: "Formazione AI in azienda | Alessandro Concetti",
    description:
      "Una giornata di formazione sull’AI nella vostra sede: sei ore in presenza, metà pratica sul lavoro delle vostre persone. Per PMI del centro Italia.",
    ogTitle: "Una giornata di AI, nella vostra azienda",
    ogDescription:
      "Sei ore con le vostre persone: come funzionano questi strumenti e come si usano sul lavoro di tutti i giorni.",
    ogImageText: "Sei ore. Nella vostra sede. Metà pratica.",
    author: "Alessandro Concetti",
  },

  contactDetails: {
    phoneLabel: "331 7750857",
    phoneHref: "+393317750857",
    email: "ale.concetti@gmail.com",
  },

  nav: {
    brand: "Alessandro Concetti",
    links: [
      { label: "Percorsi", href: "#percorsi" },
      { label: "Come funziona", href: "#come-funziona" },
      { label: "Contatti", href: "#contatti" },
    ],
    skipLink: "Vai al contenuto",
  },

  hero: {
    eyebrow: "Giornate",
    title: "Una giornata di formazione sull’AI, in azienda, per le vostre persone.",
    subtitle:
      "Serve a metterle in condizione di usarla davvero, ognuna nel proprio lavoro. Non un corso teorico.",
    facts: "Sei ore in presenza, nella vostra sede. Metà aula, metà pratica.",
    cta: "Richiedi una chiamata",
  },

  why: {
    eyebrow: "Il punto di partenza",
    title: "L’AI entra in azienda con le persone",
    body: "Siamo dentro una trasformazione profonda del modo di lavorare. Gli strumenti si comprano in un pomeriggio; la cultura dell’AI si costruisce con le persone che li useranno. Per questo la giornata si fa in azienda, con chi il lavoro lo fa tutti i giorni.",
  },

  about: {
    eyebrow: "Chi conduce la giornata",
    title: "Alessandro Concetti",
    body: "Sono Alessandro Concetti, Delivery Manager in BIP xTech, la divisione tecnologica del gruppo BIP: costruisco sistemi di AI che vanno in produzione e ne scrivo il codice. In aula porto quelli, con le cose che hanno funzionato e quelle che no.",
  },

  paths: {
    eyebrow: "Cinque giornate",
    title: "Si sceglie in base a chi c’è in aula",
    techNote:
      "Le ultime due sono pensate per chi ha un reparto tecnico o fa software. Le altre tre non richiedono nessuna competenza informatica.",
    labels: {
      audience: "A chi si rivolge",
      takeaways: "Cosa resta",
    },
    items: [
      {
        number: "01",
        title: "AI operativa per chi non programma",
        audience: "Amministrazione, commerciale, ufficio acquisti, marketing.",
        body: "La mattina si vede come funzionano davvero questi strumenti: cosa sanno fare, cosa no, come si chiede bene. Il pomeriggio ognuno automatizza un compito che ripete ogni settimana: un’offerta, un’email, un verbale.",
        takeaways: [
          "Un compito ricorrente automatizzato, con le istruzioni scritte.",
          "Un criterio per capire dove conviene usarla e dove no.",
        ],
      },
      {
        number: "02",
        title: "Dal caos ai processi",
        audience: "Direzione e capi funzione.",
        body: "Si mappano insieme i processi come girano davvero e si guarda dove il tempo se ne va. Nel pomeriggio si mette in fila cosa conviene affrontare per primo.",
        takeaways: [
          "La mappa dei processi principali, disegnata da chi li esegue.",
          "Una lista di interventi ordinata per impatto e fattibilità.",
        ],
      },
      {
        number: "03",
        title: "Costruire il primo agente",
        audience: "Team tecnici e IT interni.",
        body: "La mattina si vede come è fatto un agente e dove si rompe. Il pomeriggio è tutto pratico: se ne costruisce uno che legge dai vostri dati e fa qualcosa di utile.",
        takeaways: [
          "Un agente funzionante nel vostro ambiente, codice compreso.",
          "Le regole su cosa automatizzare e cosa far controllare.",
        ],
      },
      {
        number: "04",
        title: "AI per lo sviluppo software",
        audience: "Software house e reparti IT.",
        body: "Come cambia il ciclo di sviluppo quando una parte consistente del codice la scrive l’AI: stime, revisione, qualità. Il pomeriggio si lavora sul vostro codice, non su un esempio.",
        takeaways: [
          "Regole condivise su cosa delegare all’AI e cosa no.",
          "Un processo di revisione adatto al nuovo volume di codice.",
        ],
      },
      {
        number: "05",
        title: "Giornata su misura",
        audience: "Chi ha un’esigenza sua, o vuole capire da dove partire.",
        body: "Ci sentiamo e mi dite quali temi di AI vi interessano di più, o su cosa vorreste lavorare. Da lì costruisco insieme a voi la proposta.",
        takeaways: [
          "Un programma scritto sui vostri temi, prima di decidere.",
          "Una risposta chiara anche se la giornata non serve.",
        ],
      },
    ],
    ctaPhone: "Se preferite il telefono: 331 7750857, rispondo io.",
  },

  how: {
    eyebrow: "Come si arriva alla giornata",
    title: "Tre passaggi",
    steps: [
      {
        number: "01",
        title: "Una chiamata",
        body: "Trenta minuti per capire come lavorate e cosa vi interessa. Se una giornata non è la cosa giusta, lo dico.",
      },
      {
        number: "02",
        title: "Preparazione sui vostri casi",
        body: "Concordiamo insieme quali esempi portare in aula. Gli esercizi del pomeriggio escono dal vostro lavoro, non da un manuale.",
      },
      {
        number: "03",
        title: "La giornata, e cosa resta",
        body: "Sei ore in azienda. Restano i materiali, i file costruiti in aula e le prossime cose da fare.",
      },
    ],
    formatLabel: "Formato",
    format:
      "Sei ore in presenza nella vostra sede: tre la mattina, tre il pomeriggio. Metà giornata è laboratorio.",
    price:
      "Il prezzo dipende da quante persone entrano in aula e dal percorso. Ve lo dico in chiamata, nei primi minuti.",
  },

  contact: {
    eyebrow: "Contatti",
    title: "Scrivetemi due righe",
    intro:
      "Ditemi cosa fa la vostra azienda e quante persone siete. Vi rispondo io, con una proposta oppure con un consiglio se la giornata non serve.",
    price:
      "Se volete solo sapere quanto costa, chiedete solo quello. Vi rispondo con la cifra, non con la proposta di un incontro.",
    formspreeEndpoint: "",
    form: {
      name: { label: "Nome e cognome" },
      company: { label: "Azienda" },
      email: { label: "Email" },
      message: {
        label: "Messaggio",
        placeholder:
          "Cosa fate, quante persone siete e su cosa vi piacerebbe lavorare.",
      },
      submit: "Invia",
      sending: "Invio",
      success: "Ricevuto. Vi rispondo io, di solito in un paio di giorni.",
      error:
        "L’invio non è riuscito. Scrivete a ale.concetti@gmail.com oppure chiamate il 331 7750857.",
      required: "Campo obbligatorio.",
      invalidEmail: "Indirizzo email non valido.",
      requiredHint: "(obbligatorio)",
      errorSummary: "Controllate i campi segnalati.",
    },
    mailtoSubject: "Richiesta di informazioni — giornata di formazione AI",
    phoneLabel: "Telefono",
    emailLabel: "Email",
    privacyNote:
      "I dati servono solo a rispondervi. Non finiscono in nessuna lista.",
    successTitle: "Messaggio ricevuto.",
  },

  footer: {
    line: "Alessandro Concetti — giornate di formazione sull’AI in azienda.",
    year: "2026",
  },
};
