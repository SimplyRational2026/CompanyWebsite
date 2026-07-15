export type Locale = "de" | "en";

export type TextColor = "ink" | "purple";

export interface Segment {
  text: string;
  color: TextColor;
}

// --- Shared, locale-independent data -------------------------------------

export const FOOTER_CONTACT = {
  company: "SIMPLY RATIONAL GmbH",
  address: "Alte Brauerei 14 | 10965 Berlin | Germany",
  email: "GuteEntscheidung@simplyrational.de",
  phones: [
    { name: "Philipp", number: "+49 162 269 026 2" },
    { name: "Susanne", number: "+49 176 400 566 76" },
  ],
} as const;

// --- Locale content shape -------------------------------------------------

export interface Content {
  langSwitch: { de: string; en: string };
  nav: {
    pdf1: string;
    pdf2: string;
    cta: string;
    menuOpen: string;
    menuClose: string;
    linkedin: string;
  };
  hero: {
    blackTitleLines: readonly string[];
    purpleTitleLines: readonly string[];
    mobilePurpleTitleLines: readonly string[];
    descriptionLines: readonly string[];
    mobileDescriptionLines: readonly string[];
  };
  risiko: {
    title: string;
    bodyLines: readonly string[];
    mobileBody: string;
    bullets: readonly string[];
  };
  ungewissheit: {
    title: string;
    bodyLines: readonly string[];
    mobileBody: string;
    bullets: readonly string[];
  };
  entscheidung: {
    headlineLines: readonly [string, string];
  };
  wasAnders: {
    title: string;
    bullets: readonly (readonly string[])[];
  };
  entscheidbar: {
    titleLines: readonly [string, string];
    branchTexts: readonly string[];
  };
  team: {
    titleDesktopLines: readonly (readonly Segment[])[];
    titleMobileSegments: readonly Segment[];
    footerText: string;
    memberRoles: readonly string[];
  };
  footer: {
    headlineDesktopLines: readonly (readonly Segment[])[];
    headlineMobileSegments: readonly Segment[];
    impressum: string;
    datenschutz: string;
    legalAria: string;
    copyright: string;
  };
  contactForm: {
    name: string;
    email: string;
    subject: string;
    message: string;
    privacy: string;
    submitIdle: string;
    submitSending: string;
    submitSuccess: string;
    successMessage: string;
    errorMessage: string;
  };
  contactModal: { close: string };
}

const COPYRIGHT = "\u00A9 2026 SIMPLY RATIONAL GmbH";

const de: Content = {
  langSwitch: { de: "DE", en: "EN" },
  nav: {
    pdf1: "Entscheidungsbarometer",
    pdf2: "Versicherungen",
    cta: "Gute Entscheidung",
    menuOpen: "Men\u00fc \u00f6ffnen",
    menuClose: "Men\u00fc schlie\u00dfen",
    linkedin: "Simply Rational auf LinkedIn",
  },
  hero: {
    blackTitleLines: ["Gute Entscheidungen", "scheitern nicht an zu", "wenig Daten."],
    purpleTitleLines: [
      "Sondern an fehlender",
      "Klarheit, Struktur",
      "und",
      "Nachvollziehbarkeit.",
    ],
    mobilePurpleTitleLines: [
      "Sondern an fehlender",
      "Klarheit, Struktur",
      "und",
      "Nachvollziehbarkeit.",
    ],
    descriptionLines: [
      "Wir erm\u00f6glichen Entscheidungen unter Risiko und",
      "Ungewissheit \u2013 damit Teams auch dann sicher",
      "entscheiden, wenn es keine eindeutige Antwort gibt.",
    ],
    mobileDescriptionLines: [
      "Wir erm\u00f6glichen Entscheidungen",
      "unter Risiko und Ungewissheit \u2013",
      "damit Teams auch dann sicher",
      "entscheiden, wenn es keine",
      "eindeutige Antwort gibt.",
    ],
  },
  risiko: {
    title: "Risiko",
    bodyLines: [
      "Wenn Wahrscheinlichkeiten bekannt sind, entscheiden Daten. Wir",
      "machen komplexe Informationen verst\u00e4ndlich, nachvollziehbar",
      "und regulatorisch belastbar \u2013 damit datenbasierte",
      "Entscheidungen wirklich tragf\u00e4hig sind.",
    ],
    mobileBody:
      "Wenn Wahrscheinlichkeiten bekannt sind, entscheiden Daten. Wir machen komplexe Informationen verst\u00e4ndlich, nachvollziehbar und regulatorisch belastbar \u2013 damit datenbasierte Entscheidungen wirklich tragf\u00e4hig sind.",
    bullets: [
      "Transparente, erkl\u00e4rbare Analysen",
      "EU-AI-Act-konform",
      "Nachvollziehbar & auditierbar",
    ],
  },
  ungewissheit: {
    title: "Ungewissheit",
    bodyLines: [
      "Wenn Zukunft nicht berechenbar ist, braucht es menschliche",
      "Urteilskraft.",
      "Wir schaffen Strukturen, damit Erfahrung, Intuition und Wissen",
      "klar genutzt werden k\u00f6nnen.",
    ],
    mobileBody:
      "Wenn Zukunft nicht berechenbar ist, braucht es menschliche Urteilskraft. Wir schaffen Strukturen, damit Erfahrung, Intuition und Wissen klar genutzt werden k\u00f6nnen.",
    bullets: [
      "Es entstehen Entscheidungslogiken",
      "Erfahrung wird nutzbar gemacht",
      "Wissen bleibt im Unternehmen",
    ],
  },
  entscheidung: {
    headlineLines: [
      "Das Problem ist nicht fehlendes Wissen,",
      "sondern die Qualit\u00e4t der Entscheidung.",
    ],
  },
  wasAnders: {
    title: "Was anders wird mit uns",
    bullets: [
      ["Entscheidungen werden", "nachvollziehbar - auch wenn KI im", "Spiel ist"],
      ["Komplexit\u00e4t steht Entscheidungen", "nicht mehr im Weg"],
      ["Erfahrung wird zug\u00e4nglich -", "unabh\u00e4ngig von Einzelpersonen"],
      ["Entscheidungen werden", "getroffen, auch wenn noch nicht", "alles klar ist"],
    ],
  },
  entscheidbar: {
    titleLines: ["Wir machen Entscheidungen", "entscheidbar"],
    branchTexts: [
      "Investitionen werden klar entschieden - statt subjektiv",
      "Risiken werden klar erkannt und bewertet",
      "Strategie wird klar und umsetzbar",
      "Potenziale werden aus Unsicherheit sichtbar",
      "Governance wird wirksam",
    ],
  },
  team: {
    titleDesktopLines: [
      [
        { text: "Ein Team aus ", color: "ink" },
        { text: "international", color: "purple" },
      ],
      [
        { text: "renommierten Experten", color: "purple" },
        { text: " aus", color: "ink" },
      ],
      [{ text: "Wissenschaft und Praxis", color: "ink" }],
    ],
    titleMobileSegments: [
      { text: "Ein Team aus ", color: "ink" },
      { text: "international renommierten Experten", color: "purple" },
      { text: " aus Wissenschaft und Praxis", color: "ink" },
    ],
    footerText: "Basierend auf jahrzehntelanger, wissenschaftlicher Arbeit.",
    memberRoles: [
      "Prof. Dr.",
      "Prof. Dr.",
      "Dipl. Andragogin, M.A.",
      "Dipl. Psychologe",
    ],
  },
  footer: {
    headlineDesktopLines: [
      [{ text: "Menschliche Urteilskraft, klare Entscheidungslogik", color: "ink" }],
      [
        { text: "und transparente KI - ", color: "ink" },
        { text: "f\u00fcr weiterhin gute", color: "purple" },
      ],
      [{ text: "Entscheidungen", color: "purple" }],
    ],
    headlineMobileSegments: [
      {
        text: "Menschliche Urteilskraft, klare Entscheidungslogik und transparente KI - ",
        color: "ink",
      },
      { text: "f\u00fcr weiterhin gute Entscheidungen", color: "purple" },
    ],
    impressum: "Impressum",
    datenschutz: "Datenschutzerkl\u00e4rung",
    legalAria: "Rechtliches",
    copyright: COPYRIGHT,
  },
  contactForm: {
    name: "Name",
    email: "Email",
    subject: "Betreff",
    message: "Ihre Nachricht",
    privacy:
      "Mit dem Absenden dieses Formulars akzeptiere ich die Verarbeitung meiner pers\u00f6nlichen Daten gem\u00e4\u00df den Datenschutzbestimmungen.",
    submitIdle: "Klarheit in Entscheidungen bringen",
    submitSending: "Wird gesendet \u2026",
    submitSuccess: "Gesendet \u2713",
    successMessage: "Vielen Dank! Ihre Nachricht wurde gesendet.",
    errorMessage:
      "Etwas ist schiefgelaufen. Bitte versuchen Sie es sp\u00e4ter erneut.",
  },
  contactModal: { close: "Schlie\u00dfen" },
};

const en: Content = {
  langSwitch: { de: "DE", en: "EN" },
  nav: {
    pdf1: "Decision Barometer",
    pdf2: "Insurance",
    cta: "Good Decisions",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    linkedin: "Simply Rational on LinkedIn",
  },
  hero: {
    blackTitleLines: ["Good decisions", "don't fail for", "lack of data."],
    purpleTitleLines: [
      "They fail for lack of",
      "clarity, structure,",
      "and transparency.",
    ],
    mobilePurpleTitleLines: [
      "They fail for lack of",
      "clarity, structure,",
      "and transparency.",
    ],
    descriptionLines: [
      "We enable sound decision-making under risk and",
      "uncertainty\u2014so teams can decide with confidence",
      "even when there is no single right answer.",
    ],
    mobileDescriptionLines: [
      "We enable sound decision-",
      "making under risk and",
      "uncertainty\u2014so teams can",
      "decide with confidence even",
      "when there is no right answer.",
    ],
  },
  risiko: {
    title: "Risk",
    bodyLines: [
      "When probabilities are known, data drives decisions.",
      "We make complex information understandable,",
      "transparent, and ready for regulatory scrutiny\u2014so",
      "that data-driven decisions truly hold up.",
    ],
    mobileBody:
      "When probabilities are known, data drives decisions. We make complex information understandable, transparent, and ready for regulatory scrutiny\u2014so that data-driven decisions truly hold up.",
    bullets: [
      "Transparent, explainable analyses",
      "EU AI Act compliant",
      "Fully traceable and auditable",
    ],
  },
  ungewissheit: {
    title: "Uncertainty",
    bodyLines: [
      "When the future cannot be calculated, it takes",
      "human judgment.",
      "We create structures that let experience, intuition,",
      "and expertise be applied clearly and systematically.",
    ],
    mobileBody:
      "When the future cannot be calculated, it takes human judgment. We create structures that allow experience, intuition, and expertise to be applied clearly and systematically.",
    bullets: [
      "Decision logic becomes explicit",
      "Experience becomes actionable",
      "Knowledge stays in the organization",
    ],
  },
  entscheidung: {
    headlineLines: [
      "The real challenge isn't a lack of knowledge.",
      "It's the quality of the decision.",
    ],
  },
  wasAnders: {
    title: "What changes with us",
    bullets: [
      [
        "Decisions become",
        "transparent\u2014even when AI",
        "is involved.",
      ],
      ["Complexity no longer stands", "in the way of good decisions."],
      [
        "Experience becomes accessible\u2014",
        "no longer dependent on individuals.",
      ],
      [
        "Decisions get made,",
        "even when not everything",
        "is clear yet.",
      ],
    ],
  },
  entscheidbar: {
    titleLines: ["We make the undecidable", "decidable."],
    branchTexts: [
      "Investments decided clearly—not subjectively",
      "Risks clearly identified and assessed",
      "Strategy becomes clear and actionable",
      "Potential emerges from uncertainty",
      "Governance becomes effective",
    ],
  },
  team: {
    titleDesktopLines: [
      [
        { text: "An ", color: "ink" },
        { text: "internationally renowned", color: "purple" },
      ],
      [
        { text: "team of experts", color: "purple" },
        { text: " from", color: "ink" },
      ],
      [{ text: "research and practice", color: "ink" }],
    ],
    titleMobileSegments: [
      { text: "An ", color: "ink" },
      { text: "internationally renowned team of experts", color: "purple" },
      { text: " from research and practice", color: "ink" },
    ],
    footerText: "Built on decades of scientific research.",
    memberRoles: [
      "Prof. Dr.",
      "Prof. Dr.",
      "M.A. in Adult Education (Andragogy)",
      "Psychologist (Dipl.-Psych.)",
    ],
  },
  footer: {
    headlineDesktopLines: [
      [{ text: "Human judgment. Clear decision logic.", color: "ink" }],
      [
        { text: "Transparent AI. ", color: "ink" },
        { text: "For better", color: "purple" },
      ],
      [{ text: "decisions\u2014today and tomorrow.", color: "purple" }],
    ],
    headlineMobileSegments: [
      {
        text: "Human judgment. Clear decision logic. Transparent AI. ",
        color: "ink",
      },
      { text: "For better decisions\u2014today and tomorrow.", color: "purple" },
    ],
    impressum: "Legal Notice",
    datenschutz: "Privacy Policy",
    legalAria: "Legal",
    copyright: COPYRIGHT,
  },
  contactForm: {
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Your Message",
    privacy:
      "By submitting this form, you consent to the processing of your personal data in accordance with our Privacy Policy.",
    submitIdle: "Bring clarity to your decisions",
    submitSending: "Sending \u2026",
    submitSuccess: "Sent \u2713",
    successMessage: "Thank you! Your message has been sent.",
    errorMessage: "Something went wrong. Please try again later.",
  },
  contactModal: { close: "Close" },
};

export const CONTENT: Record<Locale, Content> = { de, en };

