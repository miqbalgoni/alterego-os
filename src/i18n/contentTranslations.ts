// Italian translations for "data" content — question labels/options, module
// titles & blurbs, beat titles. These are short strings that benefit from
// authored translation rather than runtime Claude (instant, deterministic).
//
// Long body text (beat bodies, extended-section bodies, AI generations) is
// translated at runtime by Claude in src/lib/i18n/serverTranslate.ts and
// cached.
//
// Pattern: each map is keyed by the canonical id; missing keys fall back to
// the English source. So adding a new question / module never requires a
// translations file change to keep the app running — translations layer in
// progressively.

export type SupportedLocale = "en" | "it";

// ---------------------------------------------------------------------------
// QUESTIONS — section titles, subtitles, labels, helps, options
// ---------------------------------------------------------------------------

interface QuestionTranslation {
  label?: string;
  help?: string;
  options?: Record<string, string>; // English text -> translated text
}

export const QUESTION_IT: Record<string, QuestionTranslation> = {
  // ----- Personal -----
  p_email: { label: "Email" },
  p_fullName: { label: "Nome completo" },
  p_phone: { label: "Telefono" },
  p_address: { label: "Indirizzo" },
  p_startupName: { label: "Nome della startup" },
  p_industries: {
    label: "Settore / Ambito di attività",
    help: "Seleziona da 1 a 3 ambiti.",
    // Industry options are kept in English (they're commonly cited in English
    // even in Italian decks). If you want them localized, add entries here.
  },
  p_stage: {
    label: "Fase di sviluppo della startup",
    options: {
      "Initial idea": "Idea iniziale",
      "Pre-seed: Prototype ready / First version of product":
        "Pre-seed: prototipo pronto / prima versione del prodotto",
      "Product market-ready": "Prodotto pronto per il mercato",
      "Growth and expansion": "Crescita ed espansione",
    },
  },

  // ----- IRL 1 -----
  q6: {
    label: "Hai completato almeno una versione del Business Model Canvas (BMC)?",
    options: { YES: "SÌ", NO: "NO" },
  },
  q7: {
    label: "Quante versioni diverse hai compilato?",
    options: { "0": "0", "1": "1", "2 or more": "2 o più" },
  },
  q8: {
    label: "Per quali blocchi del BMC hai formalizzato almeno un'ipotesi?",
    help: "Seleziona tutte le opzioni applicabili.",
    options: {
      None: "Nessuno",
      "Value Proposition": "Proposta di valore",
      "Customer Segments": "Segmenti di clientela",
      Channels: "Canali",
      "Customer Relationships": "Relazioni con i clienti",
      "Revenue Streams": "Flussi di ricavi",
      "Key Resources": "Risorse chiave",
      "Key Activities": "Attività chiave",
      "Key Partners": "Partner chiave",
      "Cost Structure": "Struttura dei costi",
    },
  },
  q9: {
    label: "Hai pensato a ipotesi per ciascuna di queste aree?",
    options: { No: "No", "Only for some": "Solo per alcune", "Yes, for all": "Sì, per tutte" },
  },
  q10: {
    label: "Le ipotesi si basano su:",
    help: "Seleziona tutte le opzioni applicabili.",
    options: {
      "Personal intuitions or other": "Intuizioni personali o altro",
      "Interviews with people": "Interviste con persone",
      "Market data": "Dati di mercato",
      "I have not formulated hypotheses": "Non ho formulato ipotesi",
    },
  },
  q11: {
    label: "Come hai identificato il problema che vuoi risolvere?",
    help: "Seleziona tutte le opzioni applicabili.",
    options: {
      "Personal experience": "Esperienza personale",
      "Direct observation": "Osservazione diretta",
      "Data / market reports": "Dati / report di mercato",
      "I have not identified it yet": "Non l'ho ancora identificato",
    },
  },
  q12: {
    label: "Hai quantificato il problema?",
    options: {
      No: "No",
      "Only rough estimates": "Solo stime approssimative",
      "Yes, detailed data": "Sì, dati dettagliati",
    },
  },
  q13: {
    label: "Hai pensato a come dimostrare che la tua idea risponde a un bisogno reale?",
    help: "Seleziona tutti i metodi applicabili.",
    options: {
      Interviews: "Interviste",
      "Online surveys": "Sondaggi online",
      "Mockups / landing pages": "Mockup / landing page",
      "Desk research": "Desk research",
      Other: "Altro",
      "I haven't thought about it yet": "Non ci ho ancora pensato",
    },
  },
  q14: {
    label: "Hai già testato le ipotesi alla base della tua idea?",
    options: { No: "No", Planned: "Pianificato", "Yes, at least one": "Sì, almeno una" },
  },
  q15: {
    label: "Hai discusso le ipotesi con esperti o stakeholder?",
    options: { No: "No", Yes: "Sì" },
  },
  q16: {
    label: "Le ipotesi sono documentate formalmente?",
    options: {
      "Informal meetings / nothing": "Incontri informali / niente",
      Yes: "Sì",
    },
  },
  q17: {
    label: "Hai ricevuto feedback strutturati su queste ipotesi?",
    options: {
      No: "No",
      "Only impressions": "Solo impressioni",
      "Yes, documented": "Sì, documentati",
    },
  },
  q18: {
    label: "Hai apportato modifiche a qualche blocco del business model dopo aver ricevuto feedback?",
    options: { "0": "0", "1–2": "1–2", "3 or more": "3 o più" },
  },
  q19: {
    label: "Quanto sei sicuro delle tue ipotesi principali?",
    options: { "Not very": "Poco", Quite: "Abbastanza", Very: "Molto" },
  },

  // ----- IRL 2 -----
  q20: {
    label: "Hai identificato segmenti di mercato?",
    help: "I segmenti di mercato sono gruppi specifici di clienti con caratteristiche simili.",
    options: { None: "Nessuno", "1": "1", "2 or more": "2 o più" },
  },
  q21: { label: "Quali segmenti di mercato hai identificato?" },
  q22: {
    label: "Quanti concorrenti hai mappato?",
    help: "Un'azienda/prodotto/servizio che compete nello stesso mercato o settore.",
    options: { None: "Nessuno", "1–2": "1–2", "3 or more": "3 o più" },
  },
  q23: {
    label: "Quanto è grande il mercato che vuoi servire?",
    help: "Valore economico complessivo del mercato target.",
    options: {
      "Less than €1 million": "Meno di €1 milione",
      "From €1 million to €10 million": "Da €1 milione a €10 milioni",
      "More than €10 million": "Più di €10 milioni",
      "I have not yet identified a market": "Non ho ancora identificato un mercato",
    },
  },
  q24: {
    label: "Come hai stimato la dimensione del mercato?",
    options: {
      "Not estimated": "Non stimata",
      "Approximation / experience": "Approssimazione / esperienza",
      "Public data / sector reports": "Dati pubblici / report di settore",
    },
  },
  q25: {
    label: "La tua offerta è diversa da quella dei concorrenti?",
    options: {
      "Not differentiated": "Non differenziata",
      "Partially differentiated": "Parzialmente differenziata",
      "Highly differentiated": "Molto differenziata",
    },
  },
  q26: {
    label: "Hai analizzato la concorrenza in modo strutturato?",
    options: { No: "No", Yes: "Sì" },
  },

  // ----- IRL 3 -----
  q27: {
    label: "Hai definito il tuo pubblico target?",
    help: "Gruppo specifico di persone a cui un'azienda indirizza i propri prodotti e marketing.",
    options: { No: "No", Yes: "Sì" },
  },
  q28: {
    label: "Quante interviste hai condotto con potenziali clienti?",
    options: {
      "0": "0",
      "fewer than 10": "meno di 10",
      "between 10 and 59": "tra 10 e 59",
      "60 or more": "60 o più",
    },
  },
  q29: {
    label: "Qual è stato il risultato principale delle interviste?",
    options: {
      "No confirmation": "Nessuna conferma",
      "Partial confirmation": "Conferma parziale",
      "Strong confirmation": "Conferma forte",
    },
  },
  q30: {
    label: "Quali strumenti hai usato per validare la tua idea?",
    help: "Seleziona tutte le opzioni applicabili.",
    options: {
      Interviews: "Interviste",
      Surveys: "Sondaggi",
      "Focus groups": "Focus group",
      Other: "Altro",
    },
  },
  q31: {
    label: "Hai documentato feedback dei clienti o user story?",
    options: {
      No: "No",
      "Only a few examples": "Solo alcuni esempi",
      "Several complete cases": "Diversi casi completi",
    },
  },

  // ----- IRL 4 -----
  q32: {
    label: "Hai creato un prototipo di base del prodotto o servizio?",
    options: { No: "No", Yes: "Sì" },
  },
  q33: {
    label: "Quanti test hai eseguito sul prototipo?",
    options: { "0": "0", "between 1 and 4": "tra 1 e 4", "5 or more": "5 o più" },
  },
  q34: {
    label: "Che tipo di feedback hai raccolto?",
    help: "Qualitativo: opinioni e racconti. Quantitativo: numeri e statistiche. Seleziona tutti applicabili.",
    options: {
      "No structured feedback": "Nessun feedback strutturato",
      "Qualitative only": "Solo qualitativo",
      "Also quantitative": "Anche quantitativo",
    },
  },
  q35: {
    label: "I feedback hanno portato a modifiche del prodotto?",
    options: {
      No: "No",
      Partially: "Parzialmente",
      "Yes, relevant changes": "Sì, modifiche rilevanti",
    },
  },
  q36: {
    label: "Hai definito metriche di successo prima di misurare il test?",
    help: "es. Conversione, Retention, ROI, CLV, NPS.",
    options: {
      Never: "Mai",
      "Only for some": "Solo per alcuni",
      "For all tests": "Per tutti i test",
    },
  },

  // ----- IRL 5 -----
  q37: {
    label: "Hai documentato come acquisire e mantenere i clienti?",
    options: { No: "No", Yes: "Sì" },
  },
  q38: {
    label: "Quanti clienti 'early adopter' hai acquisito?",
    options: { "0": "0", "between 1 and 9": "tra 1 e 9", "10 or more": "10 o più" },
  },
  q39: {
    label: "Hai validato i tuoi canali di vendita?",
    options: { None: "Nessuno", "1": "1", "2 or more": "2 o più" },
  },
  q40: {
    label: "Hai informazioni sulla retention dei clienti o sulla frequenza d'acquisto?",
    options: {
      No: "No",
      Partial: "Parziale",
      "Yes, objective data": "Sì, dati oggettivi",
    },
  },
  q41: {
    label: "Hai recensioni dei clienti o case study?",
    options: { No: "No", Yes: "Sì" },
  },

  // ----- IRL 6 -----
  q42: { label: "La startup ha già generato ricavi?", options: { No: "No", Yes: "Sì" } },
  q43: { label: "Ricavi totali generati (€) ad oggi:" },
  q44: {
    label: "Quante interviste sui flussi di ricavi hai condotto?",
    help:
      "Conversazioni strutturate con potenziali clienti per validare il modello di monetizzazione.",
    options: { "0": "0", "between 1 and 19": "tra 1 e 19", "20 or more": "20 o più" },
  },
  q45: {
    label: "Hai identificato chiaramente tutte le possibili fonti di ricavo?",
    options: { No: "No", Yes: "Sì" },
  },
  q46: {
    label: "Il prezzo che applichi è stato accettato dai clienti?",
    options: { No: "No", Partially: "Parzialmente", Yes: "Sì" },
  },

  // ----- IRL 7 -----
  q47: {
    label: "Hai creato un prototipo avanzato?",
    options: { No: "No", Yes: "Sì" },
  },
  q48: {
    label: "Hai testato il prototipo in un ambiente reale?",
    options: {
      No: "No",
      "Yes, partial results": "Sì, risultati parziali",
      "Yes, positive results": "Sì, risultati positivi",
    },
  },
  q49: {
    label: "Hai avviato partnership strategiche?",
    options: { None: "Nessuna", "1": "1", "2 or more": "2 o più" },
  },
  q50: {
    label: "Quanti test ripetuti hai condotto?",
    options: { "0": "0", "between 1 and 3": "tra 1 e 3", "4 or more": "4 o più" },
  },

  // ----- IRL 8 -----
  q51: {
    label: "Da quanto la tua attività opera in modo continuativo?",
    options: {
      "Not operational": "Non operativa",
      "1–8 months": "1–8 mesi",
      ">8 months": ">8 mesi",
    },
  },
  q52: {
    label: "Quante partnership hai consolidato?",
    options: { "0": "0", "1": "1", "2 or more": "2 o più" },
  },
  q53: {
    label: "La tua produzione è scalabile?",
    help: "Capacità di crescere la produzione mantenendo qualità e margini.",
    options: {
      "Not yet": "Non ancora",
      "Only partially": "Solo parzialmente",
      "Yes, with current resources": "Sì, con le risorse attuali",
    },
  },
  q54: {
    label: "In quanti paesi sei operativo?",
    options: { "1": "1", "2–3": "2–3", ">3": ">3" },
  },

  // ----- IRL 9 -----
  q55: {
    label: "Quante metriche chiave (KPI) monitori regolarmente?",
    options: { None: "Nessuna", "1–2": "1–2", "3 or more": "3 o più" },
  },
  q56: {
    label: "Con che frequenza monitori le tue metriche?",
    options: {
      "Not monitored": "Non monitorate",
      Occasionally: "Occasionalmente",
      "Monthly or more often": "Mensilmente o più spesso",
    },
  },
  q57: {
    label: "Quanti report hai prodotto negli ultimi 12 mesi?",
    options: { None: "Nessuno", "1–3": "1–3", "4 or more": "4 o più" },
  },
  q58: {
    label: "Le tue metriche sono migliorate nel tempo?",
    options: {
      "No, they have remained the same": "No, sono rimaste invariate",
      "Yes, they have improved": "Sì, sono migliorate",
    },
  },
  q59: {
    label: "Hai sistemi automatici per monitorare le tue metriche?",
    options: {
      None: "Nessuno",
      "Excel / manual only": "Solo Excel / manuale",
      "Yes, dashboard / software": "Sì, dashboard / software",
    },
  },
};

// ---------------------------------------------------------------------------
// MODULE CATALOG — title, shortTitle, blurb
// ---------------------------------------------------------------------------

interface ModuleTranslation {
  title?: string;
  shortTitle?: string;
  blurb?: string;
}

export const MODULE_IT: Record<string, ModuleTranslation> = {
  "m13-defining-the-problem": {
    title: "Definire il problema",
    shortTitle: "Definisci il problema",
    blurb:
      "Un problema reale, doloroso e specifico è l'unica fondazione di cui una startup ha bisogno. Impara ad intervistare, ascoltare e scrivere un problem statement che resista al confronto con il mercato.",
  },
  "m14-bmc": {
    title: "Business Model Canvas",
    shortTitle: "BMC",
    blurb:
      "Mappa il tuo business in nove blocchi: clienti, valore, canali, ricavi, costi. Costruisci il tuo primo BMC mentre procedi.",
  },
  "m15-cv-and-team": {
    title: "CV e team",
    shortTitle: "Team",
    blurb:
      "Gli investitori investono nelle persone. Scopri cosa rende credibile un team di startup — competenze complementari, valori condivisi, ruoli chiari.",
  },
  "m16-experiments": {
    title: "Eseguire esperimenti",
    shortTitle: "Esperimenti",
    blurb:
      "Smetti di discutere, inizia a testare. Definisci ipotesi, progetta esperimenti lean e decidi sulla base dei segnali — non delle opinioni.",
  },
  "m17-competitive-analysis": {
    title: "Analisi competitiva",
    shortTitle: "Concorrenti",
    blurb:
      "Ogni mercato ha alternative — anche Excel è un concorrente. Mappa chi altro sta risolvendo questo problema e trova il tuo vero vantaggio.",
  },
  "m18-positioning": {
    title: "Posizionamento di mercato",
    shortTitle: "Posizionamento",
    blurb:
      "Sii rilevante per pochi, invece che invisibile per molti. Costruisci un posizionamento chiaro con la formula For-Who-We-Offer-Unlike.",
  },
  "m19-networking": {
    title: "Networking per startup",
    shortTitle: "Networking",
    blurb:
      "Nessuna startup cresce da sola. Costruisci relazioni che sbloccano clienti, partner e capitali — anche partendo da un contesto locale.",
  },
  "m20-mission-vision": {
    title: "Mission e Vision",
    shortTitle: "Mission",
    blurb:
      "La vision indica il futuro che vuoi costruire. La mission dice come ci arriverai. Entrambe rendono le decisioni più semplici.",
  },
  "m21-market-analysis": {
    title: "Analisi di mercato (TAM·SAM·SOM)",
    shortTitle: "Dimensione mercato",
    blurb:
      "Smetti di dire 'solo l'1% di un mercato enorme'. Stima TAM, SAM e un SOM difendibile con un approccio top-down + bottom-up.",
  },
  "m22-startup-tools": {
    title: "Strumenti per startup",
    shortTitle: "Strumenti",
    blurb:
      "Scegli gli strumenti giusti per CRM, automazione, analytics e operations. Inizia leggero — Notion + un foglio di calcolo battono cinque abbonamenti.",
  },
  "m23-project-management": {
    title: "Project Management (Agile)",
    shortTitle: "PM",
    blurb:
      "Lavora a sprint settimanali. Usa una Kanban. Rifletti, aggiusta, ripeti. Il framework che rende misurabile l'esecuzione di una startup.",
  },
  "m24-mvp": {
    title: "Costruire un MVP",
    shortTitle: "MVP",
    blurb:
      "Un MVP è un esperimento strategico, non un prodotto piccolo. Testa l'ipotesi più rischiosa con il minimo prodotto possibile.",
  },
  "m25-customer-journey": {
    title: "Customer Journey",
    shortTitle: "Journey",
    blurb:
      "Awareness → Consideration → Purchase → Retention → Advocacy. Mappa ogni touchpoint e progetta ciò che gli utenti sperimentano davvero.",
  },
  "m26-kpis": {
    title: "KPI e metriche",
    shortTitle: "KPI",
    blurb:
      "Misura ciò che conta davvero. KPI SMART invece di vanity metrics. Costruisci una cultura data-driven dal primo giorno.",
  },
  "m27-first-customer": {
    title: "Acquisire i primi clienti",
    shortTitle: "Primi clienti",
    blurb:
      "I primi clienti non arrivano — vanno trovati. Cold outreach, visite di persona e piccole offerte che costruiscono un portfolio.",
  },
  "m28-ecosystem": {
    title: "Capire l'ecosistema",
    shortTitle: "Ecosistema",
    blurb:
      "Mappa le persone, i partner e le istituzioni intorno alla tua startup. Trova alleati, anticipa le barriere, accelera la crescita.",
  },
  "m29-sales": {
    title: "Vendite",
    shortTitle: "Vendite",
    blurb:
      "Vendere è ascoltare, proporre, costruire fiducia — non spingere. Costruisci un processo ripetibile con outreach e prezzi chiari.",
  },
  "m30-presence": {
    title: "Costruire una presenza",
    shortTitle: "Presenza",
    blurb:
      "Brand, logo, sito, social, materiali. Anche allo stadio di idea, una presenza chiara crea fiducia prima ancora di vendere.",
  },
  "m31-social-startups": {
    title: "Startup sociali e Società Benefit",
    shortTitle: "Impatto",
    blurb:
      "Missione sociale e sostenibilità economica non sono in contraddizione. Scopri il modello di società benefit e le metriche di impatto.",
  },
  // ----- IRL 0 (Foundation) -----
  "m1-what-is-startup": {
    title: "Cos'è una startup?",
    shortTitle: "Cos'è una startup",
    blurb:
      "Una startup è un'organizzazione temporanea alla ricerca di un modello di business scalabile e ripetibile, in condizioni di incertezza. Comprendi la definizione, le fasi di vita (pre-seed → scale-up) e la differenza con un business tradizionale.",
  },
  "m2-trl-irl": {
    title: "TRL e IRL — misurare la maturità",
    shortTitle: "TRL e IRL",
    blurb:
      "Due scale: Technology Readiness Level (1–9) e Investment Readiness Level (1–9). Sapere dove ti trovi su entrambe è il modo in cui comunichi maturità a investitori e bandi.",
  },
  "m3-idea": {
    title: "Dall'idea all'azione",
    shortTitle: "Idea",
    blurb:
      "Ogni business inizia con un'idea — ma non ogni idea diventa un business. Impara a parlare della tua idea, a confrontarti con le persone e a muoverti senza aspettare di sentirti pronto.",
  },
  "m4-validation": {
    title: "Validazione — prima di costruire",
    shortTitle: "Validazione",
    blurb:
      "Tre livelli di validazione: problema, soluzione, disponibilità a pagare. Testa con interviste, landing page, MVP concierge — prima di investire denaro reale.",
  },
  "m5-company-system": {
    title: "L'azienda come sistema",
    shortTitle: "Sistema azienda",
    blurb:
      "Un'azienda è un sistema di risorse, stakeholder e flussi contabili. Comprendi le basi: stakeholder, bilanci, perché esistono le startup costituite.",
  },
  "m6-funding-options": {
    title: "Opzioni di finanziamento per startup",
    shortTitle: "Opzioni di finanziamento",
    blurb:
      "Bootstrapping, FFF, business angel, VC, equity crowdfunding, prestiti bancari, contributi pubblici. Scegli il capitale giusto per la tua fase — ed evita quello sbagliato.",
  },
  "m7-patents-trademarks": {
    title: "Brevetti e tutela del marchio",
    shortTitle: "Tutela IP",
    blurb:
      "Quando vale la pena depositare un brevetto, quando un segreto industriale è più intelligente, e quando un marchio registrato è la protezione a maggior leva che una startup possa comprare.",
  },
  "m8-legal": {
    title: "Fondamenta legali",
    shortTitle: "Aspetti legali",
    blurb:
      "Le basi legali che ogni founder deve conoscere: costituzione, statuto, cap table, patti parasociali, NDA, contratti, GDPR. Non devi diventare avvocato — ma devi sapere cosa chiedere.",
  },
  "m9-corporate-forms": {
    title: "Forme societarie — Partita IVA, S.r.l., S.r.l.s.",
    shortTitle: "Forme societarie",
    blurb:
      "Ditta individuale vs S.r.l.s. vs S.r.l. vs cooperativa vs status di startup innovativa. Scegli la forma che corrisponde alla tua fase, ambizione ed esposizione fiscale.",
  },
  "m10-being-entrepreneur": {
    title: "Essere imprenditore",
    shortTitle: "Mindset",
    blurb:
      "L'imprenditorialità è un modo di pensare e agire nell'incertezza. Reddito, tempo, sicurezza, decisioni — cosa cambia davvero quando smetti di essere dipendente.",
  },
  "m11-afc": {
    title: "Amministrazione, Finanza e Controllo (AFC)",
    shortTitle: "Basi AFC",
    blurb:
      "L'AFC è la tua bussola: cash flow, runway, classificazione delle spese, revisione mensile. Anche una startup di una persona ne ha bisogno — inizia in piccolo, costruisci l'abitudine subito.",
  },
  "m12-ai-for-startups": {
    title: "AI per startup",
    shortTitle: "Toolkit AI",
    blurb:
      "L'AI è un moltiplicatore di forza per team minuscoli: validazione di idee, ricerca di mercato, scaffolding MVP, marketing, automazione. Un toolkit pratico, non hype.",
  },
  // ----- IRL 5 (additions) -----
  "m32-marketing-branding": {
    title: "Marketing e branding per startup",
    shortTitle: "Marketing e brand",
    blurb:
      "Il marketing è il ponte tra ciò che fai e chi ne ha bisogno. Costruisci proposta di valore, brand, posizionamento, messaggio, canali — coerenti e sostenibili.",
  },
  "m33-editorial-plan": {
    title: "Piano editoriale e social media",
    shortTitle: "Piano editoriale",
    blurb:
      "Passa da pubblicare in modo sporadico a un Digital Editorial Plan strutturato: a chi parli, cosa pubblichi, su quali canali, con quale cadenza e metriche.",
  },
  "m34-abm": {
    title: "Account-Based Marketing (ABM)",
    shortTitle: "ABM",
    blurb:
      "Vendi meno, ma meglio. Scegli una piccola lista di account strategici, personalizza con cura, costruisci relazioni che il marketing di massa B2B non può eguagliare.",
  },
  // ----- IRL 6 (Revenue Model) -----
  "m35-financial-model": {
    title: "Modello finanziario — la tua bussola",
    shortTitle: "Modello finanziario",
    blurb:
      "I numeri trasformano la visione in runway, decisioni e credibilità. Costruisci un conto economico previsionale e una semplice proiezione di cash flow — gli unici modelli che ti servono davvero in questa fase.",
  },
  "m36-scalability": {
    title: "Scalabilità — la differenza tra esistere e crescere",
    shortTitle: "Scalabilità",
    blurb:
      "La scalabilità è la capacità di crescere senza aumentare i costi nella stessa proporzione. Ricavi · operations · tecnologia · organizzazione — progetta per la crescita, ma solo quando sei pronto.",
  },
  "m37-management-control": {
    title: "Controllo di gestione — misurare per decidere",
    shortTitle: "Controllo di gestione",
    blurb:
      "Budget, analisi degli scostamenti, monitoraggio dei costi, dashboard KPI. Un sistema di controllo leggero intercetta i problemi presto — e dimostra rigore agli investitori.",
  },
  "m38-crm": {
    title: "Customer Relationship Management",
    shortTitle: "CRM",
    blurb:
      "Il valore reale vive nelle relazioni, non nelle vendite singole. Centralizza i contatti, struttura il funnel, pianifica una comunicazione personalizzata — anche con 5 clienti.",
  },
  "m39-business-plan": {
    title: "Business plan",
    shortTitle: "Business plan",
    blurb:
      "Quando bandi, banche o investitori lo richiedono: un business plan davvero utile. Executive summary · mercato · modello · operations · finanziari. Adatta al destinatario.",
  },
  "m40-recruiting": {
    title: "Recruiting e gestione delle persone",
    shortTitle: "Recruiting",
    blurb:
      "Quando e come assumere — non prima. Ruoli, motivazione, ownership, cultura e gli strumenti leggeri per gestire un piccolo team senza burocrazia.",
  },
  // ----- IRL 7 (High-Fidelity MVP & Fundraising) -----
  "m41-industrial-plan": {
    title: "Piano industriale",
    shortTitle: "Piano industriale",
    blurb:
      "La traduzione strategica della visione in esecuzione: modello, mercato, operations, finanziari, crescita. Richiesto per bandi, investitori e partner di larga scala.",
  },
  "m42-fundraising": {
    title: "Strategie di fundraising",
    shortTitle: "Fundraising",
    blurb:
      "Il capitale segue la chiarezza, non la disperazione. Mappa gli strumenti di fundraising (equity, debito, contributi, crowdfunding) sulla tua fase e gestisci un processo strutturato in 8 step.",
  },
  "m43-crowdfunding": {
    title: "Crowdfunding",
    shortTitle: "Crowdfunding",
    blurb:
      "Reward · equity · donazione · lending. Il crowdfunding raccoglie capitale E valida il mercato — quando la campagna è strutturata, comunicata e calendarizzata bene.",
  },
  "m44-wfe-stock-options": {
    title: "Work for Equity e stock option",
    shortTitle: "WFE e opzioni",
    blurb:
      "Quando il cash è poco e le competenze sono critiche, la remunerazione in equity può attrarre le persone giuste. Capire vesting, strike price, diluizione — e le regole legali di base.",
  },
  "m45-esg": {
    title: "ESG — la sostenibilità come strategia",
    shortTitle: "ESG",
    blurb:
      "Environmental, Social, Governance: non una checklist burocratica ma una leva competitiva. Anche le startup early-stage possono integrare ESG senza rallentare.",
  },
  // ----- IRL 8 (Operations & Storytelling) -----
  "m46-pitch": {
    title: "Il pitch",
    shortTitle: "Pitch",
    blurb:
      "Elevator pitch · pitch deck · investor deck. Hook → problema → soluzione → mercato → modello → team → traction → ask. Chiarezza, sintesi, convinzione.",
  },
  "m47-company-formation": {
    title: "Costituire la società — quando e come",
    shortTitle: "Costituzione",
    blurb:
      "Da idea validata a vera entità giuridica: scegli la forma, redigi lo statuto, firma dal notaio, apri la P.IVA, iscriviti al Registro delle Imprese, decidi sullo status di startup innovativa.",
  },
  "m48-accounting": {
    title: "Contabilità — controlla i tuoi numeri",
    shortTitle: "Contabilità",
    blurb:
      "Regime forfettario vs ordinario, fatturazione, scadenze, rapporto con il commercialista. Anche allo stadio di idea, una contabilità organizzata è libertà.",
  },
  "m49-public-calls": {
    title: "Bandi pubblici e incentivi",
    shortTitle: "Bandi e incentivi",
    blurb:
      "Locali, nazionali (Smart&Start, Invitalia), europei (EIC, Horizon). Come trovare il bando giusto, preparare il dossier e scrivere una candidatura competitiva.",
  },
  // ----- IRL 9 (Metrics & Open Innovation) -----
  "m50-open-innovation": {
    title: "Open Innovation",
    shortTitle: "Open Innovation",
    blurb:
      "Innova INSIEME a partner esterni — corporate, hub, acceleratori, hackathon. Accedi a risorse, credibilità e canali che un team early-stage non può costruire da solo.",
  },
};

// ---------------------------------------------------------------------------
// BEAT TITLES & EXTENDED-SECTION TITLES — short, frequently shown
// (Beat bodies and extended-section bodies stay in English in the source
// files; serverTranslate.ts translates them at runtime via Claude with cache.)
// ---------------------------------------------------------------------------

export const BEAT_TITLE_IT: Record<string, string> = {
  // M13
  "m13:intro": "Perché un problema reale conta",
  "m13:concept-1": "Esci dalla teoria: incontra le persone",
  "m13:concept-2": "Conduci interviste esplorative con metodo",
  "m13:check-1": "Verifica rapida",
  "m13:concept-3": "Sintetizza: scrivi un problem statement",
  "m13:example-1": "Vago vs preciso",
  "m13:exercise-1": "Applica alla tua startup",
  "m13:outro": "Cosa fare adesso",
  // M14
  "m14:intro": "Perché il BMC conta",
  "m14:concept-1": "I 9 blocchi",
  "m14:concept-2": "Inizia da destra",
  "m14:check-1": "Verifica rapida",
  "m14:example-1": "Esempio concreto di BMC",
  "m14:exercise-1": "Costruisci il TUO BMC (prima il lato destro)",
  "m14:outro": "Itera il BMC",
  // M15
  "m15:intro": "Perché il team conta più dell'idea",
  "m15:concept-1": "Cinque pratiche per il team building",
  "m15:concept-2": "Co-founder fit",
  "m15:check-1": "Verifica rapida",
  "m15:exercise-1": "Analisi delle competenze del team",
  "m15:outro": "Azione di questa settimana",
  // M16
  "m16:intro": "Gli esperimenti battono le opinioni",
  "m16:concept-1": "Cosa rende efficace un esperimento",
  "m16:concept-2": "Prioritizza: facilità × impatto × confidenza",
  "m16:check-1": "Verifica rapida",
  "m16:exercise-1": "Pianifica un esperimento",
  "m16:outro": "Imposta una cadenza settimanale",
  // M17
  "m17:intro": "Perché l'analisi competitiva non è opzionale",
  "m17:concept-1": "Diretti, indiretti, e lo status quo",
  "m17:check-1": "Verifica rapida",
  "m17:exercise-1": "Costruisci una tabella di benchmark da 3 righe",
  // M18
  "m18:intro": "Posizionamento: sii rilevante per pochi",
  "m18:concept-1": "La formula For-Who-We-Offer-Unlike",
  "m18:check-1": "Verifica rapida",
  "m18:exercise-1": "Scrivi il tuo posizionamento",
  // M19
  "m19:intro": "Nessuna startup cresce da sola",
  "m19:concept-1": "Dai prima di chiedere",
  "m19:check-1": "Verifica rapida",
  "m19:exercise-1": "Pianifica 3 azioni di outreach",
  // M20
  "m20:intro": "Direzione prima dell'azione",
  "m20:concept-1": "Vision = futuro. Mission = presente.",
  "m20:check-1": "Verifica rapida",
  "m20:exercise-1": "Scrivi la tua",
  // M21
  "m21:intro": "Smetti di dire '1% di un mercato enorme'",
  "m21:concept-1": "TAM · SAM · SOM",
  "m21:check-1": "Verifica rapida",
  "m21:exercise-1": "Stima la tua",
  // M22
  "m22:intro": "Gli strumenti devono moltiplicare il tuo output",
  "m22:concept-1": "Scegli per bisogno, non per novità",
  "m22:check-1": "Verifica rapida",
  "m22:exercise-1": "Audit del tuo stack attuale",
  // M23
  "m23:intro": "Agile o Waterfall?",
  "m23:concept-1": "Lo sprint settimanale",
  "m23:check-1": "Verifica rapida",
  "m23:exercise-1": "Pianifica il prossimo sprint",
  // M24
  "m24:intro": "Un MVP è un esperimento, non un prodotto",
  "m24:concept-1": "Formati di MVP",
  "m24:check-1": "Verifica rapida",
  "m24:exercise-1": "Definisci il tuo MVP",
  // M25
  "m25:intro": "Cosa sperimenta davvero l'utente?",
  "m25:concept-1": "Awareness · Consideration · Purchase · Retention · Advocacy",
  "m25:check-1": "Verifica rapida",
  "m25:exercise-1": "Mappa il tuo journey",
  // M26
  "m26:intro": "Ciò che misuri plasma ciò che costruisci",
  "m26:concept-1": "KPI SMART",
  "m26:check-1": "Verifica rapida",
  "m26:exercise-1": "Scegli i tuoi KPI",
  // M27
  "m27:intro": "I primi clienti vanno trovati, non consegnati",
  "m27:concept-1": "La regola delle 20 conversazioni",
  "m27:check-1": "Verifica rapida",
  "m27:exercise-1": "Pianifica 5 messaggi di outreach",
  // M28
  "m28:intro": "Sei un nodo in una rete",
  "m28:concept-1": "Mappa per categoria",
  "m28:check-1": "Verifica rapida",
  "m28:exercise-1": "Mappa 10 attori",
  // M29
  "m29:intro": "Vendere è ascoltare, non spingere",
  "m29:concept-1": "Da freddo a chiuso",
  "m29:check-1": "Verifica rapida",
  "m29:exercise-1": "Costruisci la tua prima 'value ladder'",
  // M30
  "m30:intro": "La presenza crea fiducia prima di vendere",
  "m30:concept-1": "Less is more",
  "m30:check-1": "Verifica rapida",
  "m30:exercise-1": "Audit la tua",
  // M31
  "m31:intro": "Mission ed economia non sono in contraddizione",
  "m31:concept-1": "Le basi delle Società Benefit italiane",
  "m31:check-1": "Verifica rapida",
  "m31:exercise-1": "Definisci il tuo impatto",
  // M1
  "m1:intro": "Startup ≠ piccola impresa",
  "m1:concept-1": "Tre definizioni da conoscere",
  "m1:concept-2": "Lo status italiano di startup innovativa",
  "m1:check-1": "Verifica rapida",
  "m1:concept-3": "Le fasi di vita: pre-seed → scale-up",
  "m1:exercise-1": "Posizionati sulla mappa",
  "m1:outro": "Prossimo step",
  // M2
  "m2:intro": "Due scale per due domande",
  "m2:concept-1": "TRL — Technology Readiness Level (1–9)",
  "m2:concept-2": "IRL — Investment Readiness Level (1–9)",
  "m2:check-1": "Verifica rapida",
  "m2:exercise-1": "Auto-valutazione",
  "m2:outro": "Comunica entrambe",
  // M3
  "m3:intro": "Chiunque ha idee. Pochi agiscono davvero.",
  "m3:concept-1": "Parla con persone che già conosci",
  "m3:concept-2": "Cerca chi l'ha già fatto",
  "m3:check-1": "Verifica rapida",
  "m3:concept-3": "Cosa hanno in comune le idee forti",
  "m3:exercise-1": "Checklist delle 7 domande",
  "m3:outro": "Inizia in piccolo. Oggi.",
  // M4
  "m4:intro": "Valida prima di costruire",
  "m4:concept-1": "Tre livelli di validazione",
  "m4:concept-2": "Metodi per ogni livello",
  "m4:check-1": "Verifica rapida",
  "m4:example-1": "Tre percorsi reali di validazione italiana",
  "m4:exercise-1": "Scegli la prossima validazione",
  "m4:outro": "Non validare per confermare — valida per capire",
  // M5
  "m5:intro": "Un'azienda è un sistema",
  "m5:concept-1": "Stakeholder interni ed esterni",
  "m5:concept-2": "Il bilancio — a cosa serve davvero",
  "m5:check-1": "Verifica rapida",
  "m5:concept-3": "Cinque principi contabili fondamentali",
  "m5:exercise-1": "Mappa i tuoi stakeholder",
  "m5:outro": "Oltre la burocrazia",
  // M6
  "m6:intro": "Il denaro non è scarso — le buone startup sì",
  "m6:concept-1": "Percorsi di equity",
  "m6:concept-2": "Debito e finanziamenti pubblici",
  "m6:check-1": "Verifica rapida",
  "m6:exercise-1": "Mappa la tua strategia di capitale",
  "m6:outro": "Combina, non scegliere una sola",
  // M7
  "m7:intro": "Proteggi ciò che vale la pena proteggere",
  "m7:concept-1": "Brevetto — quando vale la pena",
  "m7:concept-2": "Marchio — quasi sempre vale la pena",
  "m7:check-1": "Verifica rapida",
  "m7:exercise-1": "Audit della IP",
  "m7:outro": "Più una difesa attiva",
  // M8
  "m8:intro": "Il legale non è burocrazia — è uno strumento",
  "m8:concept-1": "Cinque aree legali da conoscere",
  "m8:concept-2": "Cap table e patti parasociali",
  "m8:check-1": "Verifica rapida",
  "m8:exercise-1": "Audit degli errori comuni",
  "m8:outro": "Nel dubbio, chiedi aiuto",
  // M9
  "m9:intro": "Scegli la forma adatta alla fase",
  "m9:concept-1": "Ditta individuale / partita IVA professionista",
  "m9:concept-2": "S.r.l., S.r.l.s., cooperativa",
  "m9:concept-3": "Lo status di startup innovativa",
  "m9:check-1": "Verifica rapida",
  "m9:exercise-1": "Decidi la tua forma",
  "m9:outro": "Si può cambiare",
  // M10
  "m10:intro": "Imprenditore è un modo di agire",
  "m10:concept-1": "Dipendente vs imprenditore — cosa cambia",
  "m10:concept-2": "I tratti di chi costruisce davvero",
  "m10:check-1": "Verifica rapida",
  "m10:exercise-1": "Test di onestà personale",
  "m10:outro": "Non devi sentirti pronto",
  // M11
  "m11:intro": "I numeri sono la tua bussola, non scartoffie",
  "m11:concept-1": "Perché l'AFC conta dal primo giorno",
  "m11:concept-2": "Sistema AFC leggero",
  "m11:check-1": "Verifica rapida",
  "m11:exercise-1": "Costruisci il tuo runway sheet",
  "m11:outro": "Una startup che controlla i numeri controlla il proprio destino",
  // M12
  "m12:intro": "L'AI è un moltiplicatore di forza",
  "m12:concept-1": "Sei punti di leva per l'AI nelle startup early-stage",
  "m12:concept-2": "Regole d'uso intelligenti",
  "m12:check-1": "Verifica rapida",
  "m12:exercise-1": "Audit dei workflow AI",
  "m12:outro": "Un team virtuale, sempre disponibile",
  // M32
  "m32:intro": "Il marketing è un ponte, non un megafono",
  "m32:concept-1": "La proposta di valore prima di tutto",
  "m32:concept-2": "L'identità di brand non è opzionale",
  "m32:check-1": "Verifica rapida",
  "m32:exercise-1": "Affina la tua proposta di valore",
  "m32:outro": "Marketing integrato nel prodotto",
  // M33
  "m33:intro": "Il social non è un megafono — è una conversazione",
  "m33:concept-1": "Il framework del Digital Editorial Plan (DEP)",
  "m33:concept-2": "Adatta i canali al tuo business",
  "m33:check-1": "Verifica rapida",
  "m33:exercise-1": "Pianifica un mese",
  "m33:outro": "Storytelling su tutti i canali",
  // M34
  "m34:intro": "Vendi meno, ma meglio",
  "m34:concept-1": "Quando ABM ha senso",
  "m34:concept-2": "Il processo ABM",
  "m34:check-1": "Verifica rapida",
  "m34:exercise-1": "Costruisci la tua lista di account",
  "m34:outro": "Più relazioni, meno dispersione",
  // M35
  "m35:intro": "I numeri sono una bussola",
  "m35:concept-1": "Cosa costruire in questa fase",
  "m35:concept-2": "7 step per costruirlo",
  "m35:check-1": "Verifica rapida",
  "m35:exercise-1": "Costruisci il tuo modello minimo",
  "m35:outro": "Capire i numeri ti rende libero",
  // M36
  "m36:intro": "Esistere vs crescere",
  "m36:concept-1": "Quattro tipi di scalabilità",
  "m36:concept-2": "Progetta per la crescita fin dall'inizio",
  "m36:check-1": "Verifica rapida",
  "m36:concept-3": "Attento alla falsa crescita",
  "m36:exercise-1": "Stress-test del tuo modello",
  "m36:outro": "La scalabilità è una scelta",
  // M37
  "m37:intro": "Controllo come strategia, non burocrazia",
  "m37:concept-1": "Cinque elementi che ti servono",
  "m37:concept-2": "L'analisi degli scostamenti è la tua arma segreta",
  "m37:check-1": "Verifica rapida",
  "m37:exercise-1": "Costruisci una dashboard da 1 pagina",
  "m37:outro": "Misurare per decidere meglio",
  // M38
  "m38:intro": "Il valore reale vive nelle relazioni",
  "m38:concept-1": "Perché anche 5 clienti hanno bisogno di un CRM",
  "m38:concept-2": "Imposta un CRM leggero",
  "m38:check-1": "Verifica rapida",
  "m38:exercise-1": "Costruiscilo oggi",
  "m38:outro": "Senza relazioni, nessun cliente dura",
  // M39
  "m39:intro": "Tutti ne parlano, pochi lo usano bene",
  "m39:concept-1": "Le 8 sezioni essenziali",
  "m39:concept-2": "Quando NON scriverlo",
  "m39:check-1": "Verifica rapida",
  "m39:exercise-1": "Scrivi l'executive summary",
  "m39:outro": "Utile solo se lo usi",
  // M40
  "m40:intro": "Le persone prima dei processi",
  "m40:concept-1": "Chi assumere per primo",
  "m40:concept-2": "Quando e come assumere",
  "m40:check-1": "Verifica rapida",
  "m40:exercise-1": "Definisci la tua prossima assunzione",
  "m40:outro": "Il team è il vero moltiplicatore di crescita",
  // M41
  "m41:intro": "Da idea validata a realtà industriale",
  "m41:concept-1": "Sezioni principali",
  "m41:concept-2": "Best practice",
  "m41:check-1": "Verifica rapida",
  "m41:exercise-1": "Disegna la tua roadmap",
  "m41:outro": "Un alleato, non un obbligo",
  // M42
  "m42:intro": "Il fundraising è più di soldi",
  "m42:concept-1": "Adatta il capitale alla fase",
  "m42:concept-2": "Il processo di fundraising in 8 step",
  "m42:check-1": "Verifica rapida",
  "m42:exercise-1": "Mappa 10 investitori",
  "m42:outro": "Il capitale segue la chiarezza",
  // M43
  "m43:intro": "Il crowdfunding raccoglie capitale E valida la domanda",
  "m43:concept-1": "Quattro tipologie",
  "m43:concept-2": "Quando il crowdfunding ha senso",
  "m43:check-1": "Verifica rapida",
  "m43:exercise-1": "Pianifica la tua campagna",
  "m43:outro": "Più di uno strumento di finanziamento",
  // M44
  "m44:intro": "Equity come compenso",
  "m44:concept-1": "Work for Equity (WFE)",
  "m44:concept-2": "Stock option",
  "m44:check-1": "Verifica rapida",
  "m44:concept-3": "Come strutturare il WFE",
  "m44:exercise-1": "Disegna una proposta di WFE",
  "m44:outro": "Più di un compenso — allineamento",
  // M45
  "m45:intro": "ESG come leva strategica",
  "m45:concept-1": "Tre dimensioni",
  "m45:concept-2": "Come iniziare allo stadio di idea",
  "m45:check-1": "Verifica rapida",
  "m45:exercise-1": "Mini-audit ESG",
  "m45:outro": "Consapevoli E competitivi",
  // M46
  "m46:intro": "Il pitch è dove la visione incontra gli altri",
  "m46:concept-1": "Tre formati di pitch",
  "m46:concept-2": "Struttura del pitch deck (10 slide)",
  "m46:check-1": "Verifica rapida",
  "m46:concept-3": "Principi di un pitch efficace",
  "m46:exercise-1": "Costruisci il tuo outline da 10 slide",
  "m46:outro": "Il pitch non è una performance",
  // M47
  "m47:intro": "Quando un'idea diventa entità giuridica",
  "m47:concept-1": "Segnali che sei pronto",
  "m47:concept-2": "Processo di costituzione in 6 step",
  "m47:concept-3": "Costi indicativi",
  "m47:check-1": "Verifica rapida",
  "m47:exercise-1": "Checklist pre-costituzione",
  "m47:outro": "La struttura giusta è una fondazione",
  // M48
  "m48:intro": "La contabilità come consapevolezza, non come scartoffie",
  "m48:concept-1": "Due regimi principali in Italia",
  "m48:concept-2": "Essenziali del primo mese",
  "m48:check-1": "Verifica rapida",
  "m48:exercise-1": "Imposta il tuo primo sistema",
  "m48:outro": "Numeri, non scartoffie",
  // M49
  "m49:intro": "Soldi gratis? Non proprio — capitale strategico, sì",
  "m49:concept-1": "Dove trovarli",
  "m49:concept-2": "Come leggere un bando",
  "m49:check-1": "Verifica rapida",
  "m49:concept-3": "Candidatura efficace — 5 step",
  "m49:exercise-1": "Identifica 1 bando per questo trimestre",
  "m49:outro": "Capitale strategico, non solo denaro",
  // M50
  "m50:intro": "Innova INSIEME ad altri, non da solo",
  "m50:concept-1": "Cos'è l'Open Innovation",
  "m50:concept-2": "Quattro modi per partecipare",
  "m50:check-1": "Verifica rapida",
  "m50:concept-3": "Best practice",
  "m50:exercise-1": "Mappa 5 opportunità OI",
  "m50:outro": "Un ponte tra startup ed ecosistema",
};

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function tQuestionLabel(qid: string, locale: SupportedLocale, fallback: string): string {
  if (locale === "en") return fallback;
  return QUESTION_IT[qid]?.label ?? fallback;
}

export function tQuestionHelp(
  qid: string,
  locale: SupportedLocale,
  fallback: string | undefined
): string | undefined {
  if (locale === "en" || !fallback) return fallback;
  return QUESTION_IT[qid]?.help ?? fallback;
}

export function tQuestionOption(
  qid: string,
  option: string,
  locale: SupportedLocale
): string {
  if (locale === "en") return option;
  return QUESTION_IT[qid]?.options?.[option] ?? option;
}

export function tModuleTitle(moduleId: string, locale: SupportedLocale, fallback: string): string {
  if (locale === "en") return fallback;
  return MODULE_IT[moduleId]?.title ?? fallback;
}

export function tModuleShortTitle(moduleId: string, locale: SupportedLocale, fallback: string): string {
  if (locale === "en") return fallback;
  return MODULE_IT[moduleId]?.shortTitle ?? fallback;
}

export function tModuleBlurb(moduleId: string, locale: SupportedLocale, fallback: string): string {
  if (locale === "en") return fallback;
  return MODULE_IT[moduleId]?.blurb ?? fallback;
}

export function tBeatTitle(
  moduleIdShort: string, // "m13", "m14", ...
  beatId: string,
  locale: SupportedLocale,
  fallback: string
): string {
  if (locale === "en") return fallback;
  return BEAT_TITLE_IT[`${moduleIdShort}:${beatId}`] ?? fallback;
}
