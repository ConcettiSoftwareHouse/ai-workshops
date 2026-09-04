/**
 * Tutti i contenuti del sito.
 *
 * Questo è l'unico file da toccare per cambiare i testi.
 * Non c'è un CMS, non c'è un database: si modifica qui, si fa il deploy.
 */

export type Path = {
  /** Numero progressivo mostrato accanto al titolo (01, 02, ...). */
  number: string;
  title: string;
  /** A chi si rivolge la giornata. Una riga. */
  audience: string;
  /** Il problema che risolve. Due o tre frasi. */
  problem: string;
  /** Come si svolge la giornata. Mattina e pomeriggio. */
  day: string;
  /** Cosa ci si porta a casa. Voci brevi e concrete. */
  takeaways: string[];
};

/** Il quinto percorso: più corto, senza la struttura degli altri quattro. */
export type CustomPath = {
  number: string;
  title: string;
  audience: string;
  body: string;
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
    /** Frase secca stampata sull'immagine Open Graph generata. */
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
    /** Aggiunto: etichetta dello skip link, primo elemento focusabile (design §9.2). */
    skipLink: string;
  };
  hero: {
    /** Aggiunto: etichetta della corsia sinistra del hero (design §6.1). */
    eyebrow: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string[];
    credentials: string;
  };
  paths: {
    eyebrow: string;
    title: string;
    intro: string;
    /** Etichette delle tre parti di ogni scheda. */
    labels: {
      audience: string;
      problem: string;
      day: string;
      takeaways: string;
    };
    items: Path[];
    custom: CustomPath;
  };
  how: {
    eyebrow: string;
    title: string;
    steps: Step[];
    formatLabel: string;
    format: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
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
      /** Aggiunto: parola accanto alla label dei campi obbligatori (design §9.5). */
      requiredHint: string;
      /** Aggiunto: riepilogo in aria-live sopra il form dopo un submit fallito (design §7.4). */
      errorSummary: string;
    };
    /**
     * Aggiunto: oggetto della mail precompilata quando `formspreeEndpoint` è vuoto.
     * Non compare in pagina: si legge solo nel client di posta.
     */
    mailtoSubject: string;
    /** Etichette dei recapiti in chiaro accanto al form. */
    directLabel: string;
    phoneLabel: string;
    emailLabel: string;
    /** Riga sotto il bottone di invio. Una frase, niente legalese. */
    privacyNote: string;
    /** Titolo e testo del blocco che sostituisce il form dopo l'invio. */
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
      "Giornate di formazione sull'AI per PMI. Sei ore in presenza, metà laboratorio sui vostri processi: offerte, preventivi, email ai fornitori, verbali.",
    ogTitle: "Una giornata per togliere ore al lavoro che si ripete",
    ogDescription:
      "Formazione AI per PMI. Si lavora sui vostri documenti veri. Compreso dire dove l'AI non conviene.",
    ogImageText: "Sei ore. I vostri processi. Nessuna demo.",
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
      { label: "Chi sono", href: "#chi-sono" },
      { label: "Percorsi", href: "#percorsi" },
      { label: "Come funziona", href: "#come-funziona" },
      { label: "Contatti", href: "#contatti" },
    ],
    skipLink: "Vai al contenuto",
  },

  hero: {
    eyebrow: "Giornate",
    title:
      "Ogni settimana la vostra azienda riscrive le stesse offerte e le stesse email.",
    subtitle:
      "Una giornata in azienda per capire dove l'AI toglie ore al lavoro ripetitivo e dove non serve. Sui vostri documenti, non su esempi da corso.",
    cta: "Richiedi una chiamata",
  },

  about: {
    eyebrow: "Chi conduce la giornata",
    title: "Alessandro Concetti",
    body: [
      "Faccio il Delivery Manager in BIP xTech, la divisione tecnologica del gruppo BIP. Guido progetti di AI e dati per grandi aziende: rispondo dell'architettura, della consegna e del cliente seduto dall'altra parte del tavolo. Sei anni di consulenza, prima in Accenture.",
      "Quello che costruisco sono sistemi che poi qualcuno usa ogni giorno e di cui si lamenta quando non funzionano. Archivi aziendali a cui si fa una domanda in italiano invece di aprire quaranta PDF. Programmi che eseguono da soli pezzi di lavoro ripetitivo. L'infrastruttura che li tiene accesi. Scrivo il codice, non solo le slide. E leggo la ricerca mentre esce, che è un modo poco elegante per dire che questo mestiere cambia ogni sei mesi e qualcuno deve stare dietro.",
      "In aula porto le stesse cose, comprese quelle che non hanno funzionato. Di solito sono la parte più utile della giornata.",
    ],
    credentials:
      "Politecnico di Milano, laurea cum laude. Formazione in intelligenza artificiale e data science. Pubblicazioni scientifiche su sistemi ad agenti e apprendimento per rinforzo. Python, FastAPI, Next.js, PostgreSQL, Azure.",
  },

  paths: {
    eyebrow: "Quattro giornate",
    title: "Si sceglie in base a chi sta in aula",
    intro:
      "Ogni giornata è pensata per un pubblico preciso. Se in sala mettete tutti insieme, la giornata funziona a metà.",
    labels: {
      audience: "A chi si rivolge",
      problem: "Il problema",
      day: "La giornata",
      takeaways: "Cosa resta",
    },
    items: [
      {
        number: "01",
        title: "AI operativa per chi non programma",
        audience: "Amministrazione, commerciale, ufficio acquisti, marketing.",
        problem:
          "Il vostro personale usa già questi strumenti, spesso senza dirlo. Li usa male: chiede in modo generico, ottiene risposte generiche, poi rifà il lavoro a mano. Intanto le offerte, le email ai fornitori e i verbali di riunione si riscrivono da zero ogni volta.",
        day: "Mattina: cosa sanno fare i modelli, cosa sbagliano e come se ne accorge chi non è tecnico. Poi come si formula una richiesta che restituisce qualcosa di usabile senza dieci tentativi. Pomeriggio: ognuno prende un compito che ripete ogni settimana e lo automatizza, con i propri file e il proprio linguaggio.",
        takeaways: [
          "Un compito ricorrente automatizzato a testa, funzionante prima delle sei.",
          "Le istruzioni scritte e salvate, riutilizzabili da chi non era in aula.",
          "L'elenco delle cose che da voi conviene continuare a fare a mano.",
        ],
      },
      {
        number: "02",
        title: "Dal caos ai processi",
        audience: "Direzione e capi funzione.",
        problem:
          "Nessuno in azienda sa dire quante ore costa un preventivo dal primo contatto alla firma. Il processo esiste, ma vive nella testa di tre persone, in una cartella condivisa e in qualche campo del gestionale. Finché non è su una lavagna non si può decidere dove mettere l'AI, e si finisce per comprare uno strumento e sperare.",
        day: "Mattina: si mappano i processi che girano davvero, non quelli scritti nel manuale della qualità. Si contano i passaggi, le attese e i punti in cui il lavoro torna indietro. Pomeriggio: per ogni punto si stima impatto e fattibilità, e si mette in fila.",
        takeaways: [
          "La mappa di due o tre processi centrali, disegnata da chi li esegue.",
          "Una lista di interventi ordinata per impatto e fattibilità, con i primi due già assegnati a una persona e a una data.",
          "Il conto in ore di quello che oggi si perde nei passaggi tra un ufficio e l'altro.",
        ],
      },
      {
        number: "03",
        title: "Costruire il primo agente",
        audience: "Team tecnici e IT interni.",
        problem:
          "Il vostro IT ha già provato le API. Ne è uscito uno script che funziona sul portatile di chi l'ha scritto. Il salto è farne qualcosa che legga dai vostri dati, che si possa lasciare acceso e di cui ci si fidi abbastanza da metterlo in mano a un ufficio.",
        day: "Mattina: come è fatto un agente dentro, dove si rompe, cosa si mette intorno perché un errore non diventi un ordine sbagliato. Pomeriggio interamente in laboratorio: si costruisce un agente che pesca dai vostri dati e fa una cosa utile, non un esempio con dati finti.",
        takeaways: [
          "Un agente funzionante nel vostro ambiente, con il codice in mano al team.",
          "Le regole di controllo: cosa passa da solo, cosa passa da una persona.",
          "La stima onesta di quanto lavoro serve ancora per aprirlo agli utenti.",
        ],
      },
      {
        number: "04",
        title: "AI per lo sviluppo software",
        audience: "Software house e reparti IT strutturati.",
        problem:
          "Gli sviluppatori sono più veloci. La revisione no. Arriva più codice di quanto il team riesca a leggere, e i problemi si spostano a valle, dove costano di più. La domanda non è più se usare l'AI: è come cambiano stime, revisione e responsabilità quando una parte consistente del codice non l'ha scritta una persona.",
        day: "Mattina: cosa cambia misurabilmente nel ciclo di sviluppo e in quali punti il tempo guadagnato si perde subito dopo. Pomeriggio: si lavora sul vostro codice, non su un progetto d'esempio. Dove conviene delegare, dove non conviene, e come si tiene la revisione al passo.",
        takeaways: [
          "Regole di ingaggio scritte per il team: cosa si delega, cosa si scrive a mano, cosa non si delega mai.",
          "Il processo di revisione adattato al volume di codice che vi arriva adesso.",
          "Due o tre punti del ciclo dove il tempo si recupera dalla settimana dopo.",
        ],
      },
    ],
    custom: {
      number: "05",
      title: "Una giornata sul vostro problema",
      audience: "Aziende che sanno già dove fa male.",
      body: "Se il problema è preciso — i capitolati, le bolle, le scadenze, il servizio clienti — la giornata si costruisce su quello. Ne parliamo in chiamata e vi dico se ha senso farla, oppure no.",
    },
  },

  how: {
    eyebrow: "Come si arriva alla giornata",
    title: "Tre passaggi",
    steps: [
      {
        number: "01",
        title: "Chiamata conoscitiva",
        body: "Trenta minuti. Mi raccontate come lavorate e cosa vi porta via più tempo. Se una giornata di formazione non è la cosa giusta, lo dico lì.",
      },
      {
        number: "02",
        title: "Giornata costruita sui vostri processi",
        body: "Prima di venire guardo i vostri documenti veri: offerte, capitolati, email, verbali. Gli esercizi del pomeriggio escono da lì.",
      },
      {
        number: "03",
        title: "Materiali e follow-up",
        body: "Restano le istruzioni scritte, i file costruiti in aula e la lista delle cose da fare. Qualche settimana dopo ci si risente per vedere cosa è rimasto in piedi e cosa no.",
      },
    ],
    formatLabel: "Formato",
    format:
      "Sei ore in presenza: tre la mattina, tre il pomeriggio. Metà della giornata è laboratorio sui casi reali della vostra azienda.",
  },

  contact: {
    eyebrow: "Contatti",
    title: "Scrivetemi due righe",
    intro:
      "Ditemi cosa fa la vostra azienda, quante persone siete e qual è il lavoro che si ripete di più. Rispondo entro due giorni lavorativi: se la giornata non è la cosa giusta per voi, ve lo dico prima di vendervela.",
    formspreeEndpoint: "",
    form: {
      name: { label: "Nome e cognome" },
      company: { label: "Azienda" },
      email: { label: "Email" },
      message: {
        label: "Messaggio",
        placeholder:
          "Cosa fate, quante persone siete, e il lavoro che vi ruba più ore ogni settimana.",
      },
      submit: "Invia",
      sending: "Invio",
      success: "Ricevuto. Rispondo entro due giorni lavorativi.",
      error:
        "L'invio non è riuscito. Scrivete a ale.concetti@gmail.com o chiamate il 331 7750857.",
      required: "Campo obbligatorio.",
      invalidEmail: "Indirizzo email non valido.",
      requiredHint: "(obbligatorio)",
      errorSummary: "Controllate i campi segnalati qui sotto.",
    },
    mailtoSubject: "Richiesta di contatto dal sito",
    directLabel: "Oppure direttamente",
    phoneLabel: "Telefono",
    emailLabel: "Email",
    privacyNote:
      "I dati servono solo a rispondervi. Non finiscono in nessuna lista.",
    successTitle: "Messaggio ricevuto.",
  },

  footer: {
    line: "Alessandro Concetti — giornate di formazione sull'AI in azienda.",
    year: "2026",
  },
};
