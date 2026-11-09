import type { ConsultWizardDraft } from "./message";
import { isConsultSituationId } from "./catalog";

export function migrateWizardStep(step: unknown): 1 | 2 {
  const n = typeof step === "number" ? step : 1;
  if (n >= 3) return 2;
  return 1;
}

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
    const situationIds = Array.isArray(parsed.situationIds)
      ? parsed.situationIds.filter(isConsultSituationId)
      : [];
    return {
      ...createEmptyDraft(),
      ...parsed,
      step: migrateWizardStep(parsed.step),
      situationIds,
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
