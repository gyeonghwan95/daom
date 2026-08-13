import {
  LECTURE_FORMAT_KIND_LABELS,
  LECTURE_INSTITUTION_TYPE_LABELS,
  type LectureHistoryEntry,
} from "@/lib/lectures/types";
import { getVerifiedLectureHistory } from "@/data/lectures/history";
import {
  getLectureHistoryAudienceLabel,
  normalizeInstitutionType,
} from "@/lib/lectures/history-helpers";

/** Inventory/SEO용 슬림 이력. 허위 필드 없음. */
export type LectureHistorySummary = {
  id: string;
  institutionType: string;
  audience: string[];
  topics: string[];
  duration?: string;
  region?: string;
  format: string[];
  verified: boolean;
  relatedPage?: string;
  institutionPublic: boolean;
};

function relatedPage(entry: LectureHistoryEntry): string | undefined {
  return entry.relatedLecturePages?.[0];
}

export function toLectureHistorySummary(
  entry: LectureHistoryEntry,
): LectureHistorySummary {
  const type = normalizeInstitutionType(entry.institutionType);
  const audiences = entry.audiences?.length
    ? entry.audiences
    : entry.audience
      ? [entry.audience]
      : [];
  const formats = [
    entry.formatKind
      ? LECTURE_FORMAT_KIND_LABELS[entry.formatKind]
      : entry.format,
  ].filter(Boolean);

  return {
    id: entry.id,
    institutionType: LECTURE_INSTITUTION_TYPE_LABELS[type] ?? type,
    audience: audiences,
    topics: [...entry.topics],
    duration: entry.durationLabel,
    region: [entry.city, entry.district].filter(Boolean).join(" "),
    format: formats,
    verified: entry.verified,
    relatedPage: relatedPage(entry),
    institutionPublic: Boolean(entry.institution && entry.verified),
  };
}

export function getLectureHistorySummaries(): LectureHistorySummary[] {
  return getVerifiedLectureHistory().map(toLectureHistorySummary);
}
