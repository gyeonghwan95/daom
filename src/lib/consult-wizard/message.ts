import {
  CONTACT_PREF_OPTIONS,
  CONTACT_TIME_OPTIONS,
  CONSULT_DOCS_BY_GROUP,
  getSituationLabel,
  type ContactPreference,
  type ContactTimePreference,
  type ConsultSituationId,
} from "./catalog";

export type ConsultWizardDraft = {
  step: 1 | 2 | 3 | 4;
  situationIds: ConsultSituationId[];
  situationNote: string;
  documentIds: string[];
  name: string;
  contact: string;
  contactPreference: ContactPreference;
  contactTime: ContactTimePreference;
  consent: boolean;
  pageTitle: string;
  pageUrl: string;
};

function labelDocs(ids: string[]): string {
  const all = Object.values(CONSULT_DOCS_BY_GROUP).flat();
  const map = new Map(all.map((d) => [d.id, d.label]));
  return ids.map((id) => map.get(id) ?? id).join(", ") || "없음";
}

export function buildConsultMessage(draft: ConsultWizardDraft): string {
  const situations =
    draft.situationIds.map(getSituationLabel).join(" / ") || "미선택";
  const pref =
    CONTACT_PREF_OPTIONS.find((o) => o.id === draft.contactPreference)?.label ??
    "상관없음";
  const time =
    CONTACT_TIME_OPTIONS.find((o) => o.id === draft.contactTime)?.label ??
    "상관없음";

  const lines = [
    "[단계형 상담 신청]",
    `성함: ${draft.name.trim() || "미기재"}`,
    `상담 분야·상황: ${situations}`,
  ];

  if (draft.situationNote.trim()) {
    lines.push(`한 줄 메모: ${draft.situationNote.trim()}`);
  }

  lines.push(
    `준비된 자료: ${labelDocs(draft.documentIds)}`,
    `선호 연락: ${pref}`,
    `편한 시간: ${time}`,
  );

  return lines.join("\n");
}

export function buildConsultSummaryLines(draft: ConsultWizardDraft): {
  label: string;
  value: string;
}[] {
  const pref =
    CONTACT_PREF_OPTIONS.find((o) => o.id === draft.contactPreference)?.label ??
    "상관없음";
  const time =
    CONTACT_TIME_OPTIONS.find((o) => o.id === draft.contactTime)?.label ??
    "상관없음";

  return [
    {
      label: "상담 분야",
      value: draft.situationIds.map(getSituationLabel).join(", ") || "-",
    },
    {
      label: "현재 상황",
      value: draft.situationNote.trim() || "(메모 없음)",
    },
    {
      label: "준비된 자료",
      value: labelDocs(draft.documentIds),
    },
    { label: "성함", value: draft.name.trim() || "-" },
    { label: "연락처", value: draft.contact.trim() || "-" },
    { label: "선호 연락", value: `${pref} · ${time}` },
  ];
}
