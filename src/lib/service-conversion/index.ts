export type { ServiceConversionConfig } from "./types";
export {
  getServiceConversionConfig,
  getConversionFaqsForPage,
  serviceConversionConfigs,
} from "./configs";
export {
  RELAXED_INTRO,
  MID_CTA_HINT,
  CASE_EXAMPLES_INTRO,
  CASE_RESULT_NOTICE,
  CASE_CTA_HINT,
  INQUIRY_RELAXED_NOTE,
  DOCUMENT_PREP_RELAXED,
} from "./copy";
export {
  INQUIRY_FIELD_OPTIONS,
  getInquiryFieldLabel,
  type InquiryFieldValue,
} from "./inquiry-fields";
export { resolveConversionKey, hasConversionEnhancements } from "./resolve";
