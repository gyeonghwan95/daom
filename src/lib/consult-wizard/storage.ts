import type { ConsultWizardDraft } from "./message";
import type { ConsultSituationId } from "./catalog";

const STORAGE_KEY = "daom-consult-wizard-v1";

export function createEmptyDraft(
  partial?: Partial<ConsultWizardDraft>,
): ConsultWizardDraft {
  return {
    step: 1,
    situationIds: [],
    situationNote: "",
    documentIds: [],
    name: "",
    contact: "",
    contactPreference: "any",
    contactTime: "any",
    consent: false,
    pageTitle: "",
    pageUrl: "",
    ...partial,
  };
}

/** 민감정보 장기 저장 금지 — sessionStorage만, 완료 시 삭제 */
export function loadConsultDraft(): ConsultWizardDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsultWizardDraft;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      ...createEmptyDraft(),
      ...parsed,
      situationIds: Array.isArray(parsed.situationIds)
        ? (parsed.situationIds as ConsultSituationId[])
        : [],
      documentIds: Array.isArray(parsed.documentIds) ? parsed.documentIds : [],
    };
  } catch {
    return null;
  }
}

export function saveConsultDraft(draft: ConsultWizardDraft): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    /* quota / private mode */
  }
}

export function clearConsultDraft(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
