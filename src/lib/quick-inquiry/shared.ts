export {
  CONTACT_MAX,
  DUPLICATE_WINDOW_MS,
  HONEYPOT_FIELD,
  MESSAGE_MAX,
  MESSAGE_MIN,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from "./core/constants";

export { parseContact, sanitizeText } from "./core/sanitize";
export type {
  InquiryResult,
  QuickInquiryPayload,
  ValidatedInquiry,
} from "./core/types";
