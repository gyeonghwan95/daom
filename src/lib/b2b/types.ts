export type PartnerType =
  | "legal-professional"
  | "broker"
  | "architect"
  | "developer"
  | "company"
  | "public"
  | "tax-accounting"
  | "finance-trust"
  | "individual-builder"
  | "other";

export type EngagementType =
  | "single-delegation"
  | "recurring"
  | "urgent"
  | "bulk-project"
  | "quote"
  | "local-support"
  | "corporate-recurring"
  | "public-bid"
  | "preservation"
  | "multi-unit"
  | "special-review";

export type ServiceType =
  | "delegation"
  | "receipt-correction"
  | "transfer-collab"
  | "preservation"
  | "bulk"
  | "corporate"
  | "public"
  | "redevelopment"
  | "demolition-change"
  | "quote"
  | "other";

export type ProjectSizeBand =
  | "1"
  | "2-5"
  | "6-20"
  | "21-50"
  | "51+"
  | "unknown";

export type PrepStage =
  | "exploring"
  | "negotiating"
  | "documents"
  | "use-approved"
  | "schedule-set"
  | "urgent"
  | "unsure";

export type B2BFaq = {
  question: string;
  answer: string;
};

export type B2BRelatedLink = {
  href: string;
  label: string;
};

export type PartnerCard = {
  id: PartnerType;
  title: string;
  description: string;
  href: string;
  inquiryParams?: Record<string, string>;
};

export type EngagementCard = {
  id: EngagementType;
  title: string;
  description: string;
  href: string;
};

export type PrincipleItem = {
  title: string;
  description: string;
};

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type TrustItem = {
  label: string;
  detail: string;
};

export type B2BPageContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  eyebrow: string;
  heroIntro: string;
  heroParagraphs: string[];
  primaryKeywords: string[];
  trustItems: TrustItem[];
  principles?: PrincipleItem[];
  processSteps?: ProcessStep[];
  faqs: B2BFaq[];
  relatedLinks: B2BRelatedLink[];
  bottomCtaText: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
  sections: B2BSection[];
};

export type B2BSection =
  | { id: string; title: string; kind: "prose"; paragraphs: string[] }
  | { id: string; title: string; kind: "bullets"; items: string[]; note?: string }
  | {
      id: string;
      title: string;
      kind: "cards";
      cards: { title: string; body: string; href?: string }[];
    }
  | {
      id: string;
      title: string;
      kind: "steps";
      steps: { title: string; body: string }[];
    }
  | {
      id: string;
      title: string;
      kind: "table";
      headers: string[];
      rows: string[][];
      note?: string;
    }
  | {
      id: string;
      title: string;
      kind: "example";
      disclaimer: string;
      items: string[];
    };
