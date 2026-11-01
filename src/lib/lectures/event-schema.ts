import { schemaIds } from "@/lib/seo/json-ld";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import type { LectureHistoryEntry } from "@/lib/lectures/types";

/**
 * 실제로 진행한 강의 1건의 EducationEvent.
 * 날짜가 일(YYYY-MM-DD)까지 확정된 항목만 만들고, 인원·참가비처럼 기록에 없는 값은 넣지 않는다.
 * 강의 사진은 참석자 얼굴이 보일 수 있어 image로 싣지 않는다.
 */
export function buildLectureEventSchema(
  entry: LectureHistoryEntry,
  path: string,
): Record<string, unknown> | null {
  if (!entry.verified || !entry.date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) return null;
  const url = getCanonicalUrl(path);
  const locality = [entry.city, entry.district].filter(Boolean).join(" ");
  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    "@id": `${url}#event`,
    name: entry.title,
    description: entry.summary,
    url,
    startDate: entry.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    inLanguage: "ko-KR",
    location: {
      "@type": "Place",
      name: entry.venue ?? entry.institution,
      address: {
        "@type": "PostalAddress",
        addressLocality: locality || entry.city,
        addressCountry: "KR",
      },
    },
    organizer: { "@type": "Organization", name: entry.institution },
    performer: { "@id": schemaIds.person },
    about: entry.topics,
    audience: {
      "@type": "Audience",
      audienceType: (entry.audiences ?? (entry.audience ? [entry.audience] : [])).join(", ") || undefined,
    },
  };
}
