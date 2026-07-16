import {
  LECTURE_INSTITUTION_TYPE_LABELS,
  type LectureHistoryEntry,
  type LectureInstitutionType,
} from "@/lib/lectures/types";
import { getVerifiedLectureHistory } from "@/data/lectures/history";

export type LectureHistoryFilters = {
  query?: string;
  category?: string;
  year?: string;
  institutionType?: string;
  audience?: string;
  formatKind?: string;
};

export type LectureTrackRecordSummary = {
  lectureCount: number;
  institutionCount: number;
  audienceTypeCount: number;
  topicCount: number;
  totalDurationMinutes: number | null;
  cityCount: number;
  latestYear: number | null;
  institutionTypeLabels: string[];
  categoryLabels: string[];
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

export function getLectureHistoryDisplayDate(
  entry: LectureHistoryEntry,
): string {
  if (entry.date) return entry.date;
  if (entry.year) return String(entry.year);
  return "일시 확인 중";
}

export function getLectureHistoryAudienceLabel(
  entry: LectureHistoryEntry,
): string {
  if (entry.audiences?.length) return entry.audiences.join("·");
  return entry.audience ?? "교육 대상 협의";
}

export function getLectureHistoryPrimaryImage(
  entry: LectureHistoryEntry,
): { src: string; alt: string } | null {
  if (entry.images?.[0]) {
    return { src: entry.images[0].src, alt: entry.images[0].alt };
  }
  if (entry.imageSrc) {
    return { src: entry.imageSrc, alt: entry.title };
  }
  return null;
}

export function normalizeInstitutionType(
  type: LectureInstitutionType,
): LectureInstitutionType {
  switch (type) {
    case "public-library":
      return "library";
    case "public-agency":
      return "public";
    case "youth-agency":
      return "youth-center";
    case "community":
      return "other";
    default:
      return type;
  }
}

export function filterLectureHistory(
  filters: LectureHistoryFilters,
  source: LectureHistoryEntry[] = getVerifiedLectureHistory(),
): LectureHistoryEntry[] {
  const query = filters.query?.trim() ?? "";
  const q = normalize(query);

  return source.filter((entry) => {
    if (filters.category && filters.category !== "all") {
      if (!entry.lectureCategory.includes(filters.category)) return false;
    }
    if (filters.year && filters.year !== "all") {
      const year = filters.year;
      const matchesYear =
        entry.year === Number(year) ||
        entry.date?.includes(year) ||
        false;
      if (!matchesYear) return false;
    }
    if (filters.institutionType && filters.institutionType !== "all") {
      if (
        normalizeInstitutionType(entry.institutionType) !==
        filters.institutionType
      ) {
        return false;
      }
    }
    if (filters.audience && filters.audience !== "all") {
      const audiences = [
        ...(entry.audiences ?? []),
        entry.audience ?? "",
      ].join(" ");
      if (!audiences.includes(filters.audience)) return false;
    }
    if (filters.formatKind && filters.formatKind !== "all") {
      if (entry.formatKind !== filters.formatKind) return false;
    }
    if (!q) return true;

    const haystack = normalize(
      [
        entry.title,
        entry.shortTitle ?? "",
        entry.institution,
        entry.city,
        entry.district ?? "",
        entry.topics.join(" "),
        entry.lectureCategory.join(" "),
        getLectureHistoryAudienceLabel(entry),
        entry.summary,
      ].join(" "),
    );
    return haystack.includes(q);
  });
}

export function buildLectureTrackRecordSummary(
  source: LectureHistoryEntry[] = getVerifiedLectureHistory(),
): LectureTrackRecordSummary {
  const institutions = new Set(source.map((entry) => entry.institution));
  const audiences = new Set<string>();
  const topics = new Set<string>();
  const cities = new Set<string>();
  const types = new Set<string>();
  const categories = new Set<string>();
  let latestYear: number | null = null;
  let durationSum = 0;
  let durationCount = 0;

  for (const entry of source) {
    for (const audience of entry.audiences ?? []) audiences.add(audience);
    if (entry.audience) audiences.add(entry.audience);
    for (const topic of entry.topics) topics.add(topic);
    cities.add(entry.city);
    types.add(
      LECTURE_INSTITUTION_TYPE_LABELS[
        normalizeInstitutionType(entry.institutionType)
      ],
    );
    for (const category of entry.lectureCategory) categories.add(category);
    if (typeof entry.year === "number") {
      latestYear = latestYear === null ? entry.year : Math.max(latestYear, entry.year);
    }
    if (typeof entry.durationMinutes === "number" && entry.durationMinutes > 0) {
      durationSum += entry.durationMinutes;
      durationCount += 1;
    }
  }

  return {
    lectureCount: source.length,
    institutionCount: institutions.size,
    audienceTypeCount: audiences.size,
    topicCount: topics.size,
    totalDurationMinutes: durationCount > 0 ? durationSum : null,
    cityCount: cities.size,
    latestYear,
    institutionTypeLabels: [...types],
    categoryLabels: [...categories],
  };
}

export function getLectureHistoryFilterOptions(
  source: LectureHistoryEntry[] = getVerifiedLectureHistory(),
) {
  const years = new Set<string>();
  const audiences = new Set<string>();
  const institutionTypes = new Map<string, string>();
  const formatKinds = new Set<string>();

  for (const entry of source) {
    if (entry.year) years.add(String(entry.year));
    if (entry.date) {
      const match = entry.date.match(/20\d{2}/g);
      match?.forEach((year) => years.add(year));
    }
    for (const audience of entry.audiences ?? []) audiences.add(audience);
    if (entry.audience) {
      entry.audience.split(/[·,、]/).forEach((part) => {
        const value = part.trim();
        if (value) audiences.add(value);
      });
    }
    const type = normalizeInstitutionType(entry.institutionType);
    institutionTypes.set(type, LECTURE_INSTITUTION_TYPE_LABELS[type]);
    if (entry.formatKind) formatKinds.add(entry.formatKind);
  }

  return {
    years: [...years].sort((a, b) => b.localeCompare(a)),
    audiences: [...audiences].sort((a, b) => a.localeCompare(b, "ko")),
    institutionTypes: [...institutionTypes.entries()].map(([id, label]) => ({
      id,
      label,
    })),
    formatKinds: [...formatKinds],
  };
}

export function groupLectureHistoryByYear(
  source: LectureHistoryEntry[],
): Array<{ yearLabel: string; items: LectureHistoryEntry[] }> {
  const groups = new Map<string, LectureHistoryEntry[]>();

  for (const entry of source) {
    const label =
      entry.year != null
        ? String(entry.year)
        : entry.date?.match(/20\d{2}/)?.[0] ?? "연도 미확인";
    const list = groups.get(label) ?? [];
    list.push(entry);
    groups.set(label, list);
  }

  return [...groups.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([yearLabel, items]) => ({
      yearLabel,
      items: items.sort((a, b) =>
        getLectureHistoryDisplayDate(b).localeCompare(
          getLectureHistoryDisplayDate(a),
        ),
      ),
    }));
}
