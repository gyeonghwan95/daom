import {
  CONTACT_MAX,
  HONEYPOT_FIELD,
  MESSAGE_MAX,
  MESSAGE_MIN,
} from "./constants";
import { parseContact, sanitizeText } from "./sanitize";
import type { InquiryResult, QuickInquiryPayload, ValidatedInquiry } from "./types";

export function validateInquiryBody(
  body: unknown,
): { ok: true; data: ValidatedInquiry } | { ok: false; error: InquiryResult & { ok: false } } {
  if (!body || typeof body !== "object") {
    return {
      ok: false,
      error: {
        ok: false,
        code: "invalid_json",
        message: "요청 형식이 올바르지 않습니다.",
      },
    };
  }

  const raw = body as QuickInquiryPayload & Record<string, unknown>;
  const honeypot = typeof raw[HONEYPOT_FIELD] === "string" ? raw[HONEYPOT_FIELD] : "";
  if (honeypot.trim()) {
    return {
      ok: false,
      error: {
        ok: false,
        code: "honeypot",
        message: "요청을 처리할 수 없습니다.",
      },
    };
  }

  const message = sanitizeText(raw.message, MESSAGE_MAX);
  if (message.length < MESSAGE_MIN) {
    return {
      ok: false,
      error: {
        ok: false,
        code: "validation",
        field: "message",
        message: "문의 내용을 조금 더 구체적으로 적어 주세요.",
      },
    };
  }

  const contactRaw = sanitizeText(raw.contact, CONTACT_MAX);
  const parsed = parseContact(contactRaw);
  if (!parsed) {
    return {
      ok: false,
      error: {
        ok: false,
        code: "validation",
        field: "contact",
        message: "전화번호 또는 이메일 형식을 확인해 주세요.",
      },
    };
  }

  if (raw.consent !== true) {
    return {
      ok: false,
      error: {
        ok: false,
        code: "validation",
        field: "consent",
        message: "개인정보 수집·이용에 동의해 주세요.",
      },
    };
  }

  const pageTitle = sanitizeText(raw.pageTitle ?? "", 200) || "제목 없음";
  const pageUrl = sanitizeText(raw.pageUrl ?? raw.pagePath ?? "", 500) || "-";

  return {
    ok: true,
    data: {
      message,
      contact: parsed.display,
      contactKind: parsed.kind,
      pageTitle,
      pageUrl,
    },
  };
}
