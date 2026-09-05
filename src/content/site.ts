/**
 * Tutti i contenuti del sito.
 *
 * Questo è l’unico file da toccare per cambiare i testi.
 * Non c’è un CMS, non c’è un database: si modifica qui, si fa il deploy.
 *
 * Il copy è quello approvato nel design handoff: va tenuto identico.
 */

export type Contact = {
  label: string;
  value: string;
  href: string;
  /** LinkedIn esce dal sito: si apre in una scheda nuova. */
  external?: boolean;
};

export type PathCard = {
  number: string;
  title: string;
  /** A chi si rivolge la giornata. Una riga. */
  audience: string;
  body: string;
};

export type Project = {
  sector: string;
  company: string;
  /** Anno e durata, già formattati: "2026 · 6 mesi". */
  period: string;
  title: string;
  role: string;
  body: string;
};

export type Publication = {
  venue: string;
  title: string;
  href: string;
};

export type Degree = {
  school: string;
  title: string;
};

export const site = {
  meta: {
    url: "https://formazione-ai.example.com",
    locale: "it_IT",
    title: "Formazione AI in azienda | Alessandro Concetti",
    description:
      "Giornate di formazione sull’AI in azienda: sei ore tra teoria e pratica, con demo e sessioni hands-on. In sede o in remoto.",
    ogTitle: "La trasformazione AI passa dalle persone",
    ogDescription:
      "Giornate di formazione sull’AI in azienda: sei ore tra teoria e pratica, con demo e sessioni hands-on.",
    ogImageAlt: "Formazione AI in azienda — Alessandro Concetti",
    author: "Alessandro Concetti",
  },

  person: {
    name: "Alessandro Concetti",
    role: "Delivery Manager Data & AI",
    roleLong: "Delivery Manager Data & AI · BIP xTech",
    photo: "/alessandro.jpg",
  },

  /** I tre recapiti, negli stessi termini in tutte e due le pagine. */
  contacts: [
    {
      label: "Telefono",
      value: "331 775 0857",
      href: "tel:+393317750857",
    },
    {
      label: "Email",
      value: "ale.concetti@gmail.com",
      href: "mailto:ale.concetti@gmail.com?subject=Formazione%20AI%20in%20azienda",
    },
    {
      label: "LinkedIn",
      value: "alessandro-concetti",
      href: "https://linkedin.com/in/alessandro-concetti",
      external: true,
    },
  ] satisfies Contact[],

  nav: {
    toPercorso: "Chi sono",
    toLanding: "Workshop",
  },

  landing: {
    hero: {
      eyebrow: "Formazione AI in azienda",
      title: "La trasformazione AI passa dalle persone.",
      lead: "L’AI sta ridisegnando il modo in cui le aziende competono. Non vincerà chi ha lo strumento migliore, ma chi saprà usarlo meglio.",
      body: "Organizzo giornate di formazione in azienda per costruire la cultura AI che serve a restare competitivi.",
      cta: "Richiedi una chiamata",
    },

    context: {
      eyebrow: "Il contesto",
      title: "Cambiano gli strumenti. Cambia il modo di lavorare.",
      body: "Le aziende che resteranno competitive sono quelle che impareranno a lavorare in modo diverso: produrre di più, con più qualità, e lasciare alle persone il lavoro ad alto valore aggiunto — comprendere, decidere, costruire.",
      claim:
        "Non è una questione solo tecnologica. È una questione di cultura aziendale, e la cultura parte dalle persone.",
      cta: "Richiedi una chiamata",
    },

    about: {
      eyebrow: "Chi sono",
      title: "Insegno quello che faccio ogni giorno.",
      body: "Sono Alessandro Concetti, Delivery Manager Data & AI. Lavoro da 5+ anni nella consulenza tecnologica e porto progetti AI dentro le grandi aziende italiane e internazionali.",
      body2:
        "I percorsi che propongo nascono dalla mia esperienza pratica: da quello che ho visto funzionare — e da quello che ho visto fallire.",
      link: "Scopri di più su chi sono",
      cta: "Richiedi una chiamata",
    },

    paths: {
      eyebrow: "I percorsi",
      title: "Ecco alcuni esempi di giornate che propongo.",
      intro: "Sei ore tra teoria e pratica, con demo e sessioni hands-on.",
      hint: "scorri",
      items: [
        {
          number: "01",
          title: "AI operativa",
          audience: "Per chi non programma.",
          body: "Usare gli strumenti AI nel lavoro di tutti i giorni: scrivere, sintetizzare, analizzare, preparare. Come chiedere bene, e come capire quando la risposta non va bene.",
        },
        {
          number: "02",
          title: "Dal caos ai processi",
          audience: "Per chi vuole automatizzare il lavoro ripetitivo.",
          body: "Come si prende un processo fatto a mano e lo si ricostruisce con l’AI dentro, passo per passo.",
        },
        {
          number: "03",
          title: "Costruire il primo agente",
          audience: "Per team tecnici e product.",
          body: "Cos’è davvero un agente, cosa può fare e cosa no. Ne progettiamo e mettiamo in piedi uno, dall’idea al funzionamento.",
        },
        {
          number: "04",
          title: "AI per lo sviluppo software",
          audience: "Per team di sviluppo.",
          body: "Integrare l’AI nel ciclo di sviluppo senza perdere il controllo della qualità: dove accelera davvero e dove conviene ancora fare a mano.",
        },
        {
          number: "05",
          title: "Percorso su misura",
          audience: "Se nessuno dei precedenti è la risposta giusta.",
          body: "Costruiamo il programma insieme, partendo da dove siete. Ne parliamo prima, con calma.",
        },
      ] satisfies PathCard[],
    },

    contact: {
      eyebrow: "Contatti",
      title: "Parliamone.",
      body: "Se pensi che possa esserci qualcosa di utile per la tua azienda, sono felice di parlarne!",
      /** Rimanda alla pagina "Chi sono", in celeste: è un invito, non l’azione principale. */
      cta: "Il mio percorso",
      footnote: "Alessandro Concetti · Formazione AI in azienda · in sede o in remoto",
    },
  },

  /** Il bottom sheet che si apre da tutte le CTA della landing. */
  sheet: {
    title: "Richiedi una chiamata",
    body: "Capiamo insieme se una giornata di formazione è utile per il tuo team.",
    actions: {
      phone: "Chiama 331 775 0857",
      email: "Scrivi una email",
      linkedin: "Contattami su LinkedIn",
    },
    close: "Chiudi",
    ariaLabel: "Menu e contatti",
  },

  percorso: {
    meta: {
      title: "Il mio percorso | Alessandro Concetti",
      description:
        "Delivery Manager Data & AI in BIP xTech: progetti di AI in consulenza, ricerca e formazione.",
    },
    hero: {
      eyebrow: "Il mio percorso",
      title: "Progetto e porto a termine soluzioni AI.",
      body: "Sono Delivery Manager in BIP xTech, con oltre 5 anni di esperienza tra strategia AI, data science e delivery di software. Unisco una base tecnica hands-on — applicazioni basate su LLM, machine learning, sviluppo full stack, cloud — alla gestione di progetto e al rapporto con gli stakeholder in diversi settori, tenendo insieme bisogni di business ed esecuzione tecnica.",
    },
    experience: {
      title: "Esperienza in consulenza",
      intro: "I progetti portati a termine, dal più recente.",
      items: [
        {
          sector: "Banking",
          company: "BIP",
          period: "2026 · 1 anno e mezzo",
          title: "Employee Copilot e piattaforma di Agentic AI",
          role: "AI Solution Architect",
          body: "Progettazione e sviluppo architetturale di un chatbot conversazionale che semplifica l’accesso alla knowledge base aziendale. Oltre all’implementazione della soluzione, ho dato supporto strategico nella definizione dell’architettura complessiva della piattaforma: pipeline automatiche di ingestion documentale, disegno del data layer e integrazione con modelli AI-as-a-Service.",
        },
        {
          sector: "Fashion",
          company: "BIP",
          period: "2026 · 6 mesi",
          title: "App di AI insights per il monitoraggio delle performance",
          role: "Delivery Manager",
          body: "Delivery end-to-end di una piattaforma di analytics che arricchisce le dashboard di business con insight generati automaticamente, a supporto delle decisioni del management. Ho gestito team cross-funzionali su architettura, sviluppo, test, deploy e relazione con gli stakeholder, e seguito il rollout di una soluzione cloud-native capace di generare migliaia di commenti ai KPI in batch.",
        },
        {
          sector: "Fashion",
          company: "BIP",
          period: "2025 · 6 mesi",
          title: "Sistema multi-agente per l’analisi dei dati",
          role: "Delivery Manager",
          body: "Delivery di una piattaforma multi-agente che permette agli utenti di business di interrogare i dati aziendali in linguaggio naturale. Agenti specializzati interrogano il data lake, generano analisi visuali, individuano insight e producono report condivisibili: accesso ai dati democratizzato e decisioni più rapide.",
        },
        {
          sector: "Fashion",
          company: "BIP",
          period: "2025 · 3 mesi",
          title: "Piattaforma di document intelligence",
          role: "Delivery Manager",
          body: "Delivery di una capability AI per l’estrazione e la digitalizzazione di misure scritte a mano su moduli non strutturati. Componenti di computer vision e AI trasformano il cartaceo in dati digitali strutturati; la soluzione è nata come capability enterprise riutilizzabile e ha automatizzato l’intero processo di gestione dei moduli, migliorando efficienza e qualità del dato.",
        },
        {
          sector: "Università",
          company: "BIP",
          period: "2024 · 6 mesi",
          title: "Chatbot su larga scala per le università telematiche italiane",
          role: "AI Engineer",
          body: "Sviluppo di un chatbot production-grade per gli studenti di diverse università online italiane: permette di fare domande durante le videolezioni, usando trascrizioni e materiali didattici. In parallelo, un copilot per i docenti che accelera la creazione degli esami.",
        },
        {
          sector: "Telco",
          company: "BIP",
          period: "2024 · 6 mesi",
          title: "Soluzioni GenAI per un operatore telco svizzero",
          role: "AI Engineer",
          body: "Design e manutenzione di due soluzioni: un sistema di analisi delle chiamate del call center che estrae KPI come argomento e sentiment delle conversazioni, e un chatbot a supporto del service desk. Ho curato il disegno architetturale e il deploy in produzione, garantendo l’integrazione nell’ambiente operativo del cliente.",
        },
        {
          sector: "Cross-industry",
          company: "Accenture",
          period: "2023 · 12 mesi",
          title: "Iniziative GenAI e PoC per clienti di più settori",
          role: "GenAI Team Leader",
          body: "Ho guidato lo sviluppo di numerosi PoC basati su LLM per clienti di settori diversi, tra project management, relazione con il cliente e supervisione tecnica. Alcuni esempi: chatbot su fonti dati non strutturate (documenti) e strutturate (modelli dati), generazione automatica di report e analisi statistiche da richieste in linguaggio naturale, supporto agli operatori di help desk.",
        },
        {
          sector: "Energy & Utilities",
          company: "Accenture",
          period: "2022 · 12 mesi",
          title: "Data science in uno scenario di trasformazione digitale",
          role: "Machine Learning Engineer",
          body: "In un team agile di sei persone abbiamo sviluppato modelli di machine learning per classificazione, regressione e forecasting. Il mio ruolo: standardizzare e semplificare processi ETL e feature engineering su tutti i casi d’uso, contribuendo anche all’industrializzazione dei modelli. Esperienza diretta su tutto il ciclo di vita, dalla raccolta dati al deploy.",
        },
        {
          sector: "Food & Beverage",
          company: "Accenture",
          period: "2021 · 6 mesi",
          title: "Data visualization con Power BI",
          role: "Data Analyst",
          body: "Sviluppo di dashboard per il monitoraggio delle vendite: definizione del modello dati, disegno dei visual e scelta dei KPI significativi. Ho contribuito al processo end-to-end, dall’ultimo layer della pipeline ETL alla preparazione dei test UAT.",
        },
      ] satisfies Project[],
    },
    research: {
      title: "Ricerca e pubblicazioni",
      items: [
        {
          venue: "ICML 2021",
          title: "Provably Efficient Learning of Transferable Rewards",
          href: "https://proceedings.mlr.press/v139/metelli21a.html",
        },
        {
          venue: "NeurIPS 2021",
          title:
            "Learning in a Non-Cooperative Configurable Markov Decision Process",
          href: "https://proceedings.neurips.cc/paper/2021/hash/c0f52c6624ae1359e105c8a5d8cd956a-Abstract.html",
        },
      ] satisfies Publication[],
    },
    education: {
      title: "Formazione",
      items: [
        {
          school: "Politecnico di Milano · 2018–2021",
          title: "Laurea magistrale in Computer Science and Engineering",
        },
        {
          school: "Politecnico di Milano · 2015–2018",
          title: "Laurea triennale in Ingegneria dell’Automazione",
        },
      ] satisfies Degree[],
    },
    contact: {
      title: "Questi sono i miei contatti",
      cta: "Scopri le mie proposte di workshop in azienda",
      footnote: "Alessandro Concetti · Delivery Manager Data & AI · BIP xTech",
    },
  },
};
