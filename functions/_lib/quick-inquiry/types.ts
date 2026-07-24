export type ContactKind = "phone" | "email";

export type QuickInquiryPayload = {
  message: string;
  contact: string;
  consent: boolean;
  turnstileToken: string;
  /** honeypot — must be empty */
  website?: string;
  pageTitle?: string;
  pageUrl?: string;
  pagePath?: string;
};

export type ValidatedInquiry = {
  message: string;
  contact: string;
  contactKind: ContactKind;
  pageTitle: string;
  pageUrl: string;
};

export type InquiryResult =
  | { ok: true; channels: ("telegram" | "email")[] }
  | {
      ok: false;
      code:
        | "method_not_allowed"
        | "invalid_json"
        | "validation"
        | "honeypot"
        | "turnstile"
        | "origin"
        | "rate_limit"
        | "duplicate"
        | "no_channel"
        | "delivery_failed";
      message: string;
      field?: "message" | "contact" | "consent" | "turnstile";
      /** 운영 진단용 짧은 힌트 (비밀·개인정보 없음) */
      hint?: string;
    };
