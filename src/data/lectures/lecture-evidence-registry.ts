/**
 * 강의 target 페이지가 공개적으로 인용할 수 있는 근거 목록.
 * - COMPLETED_VERIFIED: 기관·주제·일자가 확인된 완료 강의 (history.ts verified)
 * - SCHEDULED: 확정된 예정 강의 — 완료 실적처럼 쓰지 않는다
 * - PARTIAL: 강의는 아니지만 관련된 확인 활동, 또는 대상이 일부만 겹치는 근거
 * - UNVERIFIED: 확인되지 않은 주장 — 화면에 노출하지 않는다
 */
export type LectureEvidenceStatus =
  | "COMPLETED_VERIFIED"
  | "SCHEDULED"
  | "PARTIAL"
  | "UNVERIFIED";

export type LectureEvidenceGroup =
  | "busan-hub"
  | "enterprise"
  | "university"
  | "career"
  | "high-school"
  | "jeonse"
  | "life-law"
  | "generic";

export type LectureEvidenceRecord = {
  id: string;
  /** history.ts 항목 id — 없으면 강의 외 활동 */
  historyId?: string;
  label: string;
  institution: string;
  date?: string;
  status: LectureEvidenceStatus;
  /** 그룹별 적용 방식: DIRECT = 같은 대상·주제, RELATED = 대상 또는 주제 일부만 겹침 */
  groups: Partial<Record<LectureEvidenceGroup, "DIRECT" | "RELATED">>;
  publicNote: string;
  sourceNote: string;
};

export const lectureEvidenceRegistry: LectureEvidenceRecord[] = [
  {
    id: "ev-citizen-library-series",
    historyId: "citizen-library-life-law",
    label: "생활법률 연속 특강",
    institution: "부산광역시립시민도서관",
    date: "2025~2026",
    status: "COMPLETED_VERIFIED",
    groups: { "busan-hub": "DIRECT", "life-law": "DIRECT", generic: "DIRECT" },
    publicNote: "시민 대상 생활법률 연속 특강(전·월세계약, 생활분쟁, 디지털·형사 예방 등).",
    sourceNote: "history.ts verified · 회차별 기록 citizen-library-week-1~4",
  },
  {
    id: "ev-self-support-jeonse",
    historyId: "self-support-jeonse-prevention",
    label: "전세사기 예방 특강",
    institution: "부산광역시 자립지원전담기관",
    date: "2026-05-22",
    status: "COMPLETED_VERIFIED",
    groups: {
      "busan-hub": "DIRECT",
      jeonse: "DIRECT",
      university: "RELATED",
      generic: "DIRECT",
    },
    publicNote: "자립준비청년 대상 전세사기 예방 특강.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-self-support-daily-dispute",
    historyId: "self-support-daily-dispute-survival",
    label: "일상분쟁 생존법 특강",
    institution: "부산광역시 자립지원전담기관",
    date: "2026-07-24",
    status: "COMPLETED_VERIFIED",
    groups: { "life-law": "DIRECT", university: "RELATED", "busan-hub": "DIRECT" },
    publicNote: "자립준비청년 대상 생활분쟁 예방 특강.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-haeundae-startup",
    historyId: "haeundae-startup-law-2026-07",
    label: "창업법률 특강",
    institution: "해운대청년채움공간",
    date: "2026-07-16",
    status: "COMPLETED_VERIFIED",
    groups: { enterprise: "RELATED", university: "RELATED", "busan-hub": "DIRECT" },
    publicNote: "예비창업 청년 대상 계약·법인설립 기초 특강. 기업 사내 강연은 아닙니다.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-changwon-youth",
    historyId: "changwon-youth-vision-center",
    label: "청년 생활법률 특강",
    institution: "창원청년비전센터",
    date: "2026-07-02",
    status: "COMPLETED_VERIFIED",
    groups: { university: "RELATED", "life-law": "DIRECT", generic: "DIRECT" },
    publicNote: "청년 대상 생활법률 특강(부산 외 출강).",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-yangsan-career",
    historyId: "yangsan-high-school-career-talk",
    label: "법무사 진로특강",
    institution: "양산제일고등학교",
    date: "2026-05-21",
    status: "COMPLETED_VERIFIED",
    groups: { career: "DIRECT", "high-school": "DIRECT", generic: "DIRECT" },
    publicNote: "고등학생 대상 법무사 직업·진로 특강.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-haeundae-job-cafe",
    historyId: "haeundae-youth-job-growth-cafe",
    label: "청년 맞춤 법률 강의",
    institution: "해운대 청년 JOB성장카페",
    date: "2025~2026",
    status: "COMPLETED_VERIFIED",
    groups: { university: "RELATED", jeonse: "DIRECT", "busan-hub": "DIRECT" },
    publicNote: "사회초년생·취업준비 청년 대상 전세계약·등기부 확인 강의.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-lh-ccei",
    historyId: "lh-busan-changjo-collab",
    label: "청년·시민 생활법률 프로그램",
    institution: "LH · 부산창조경제혁신센터",
    date: "2025",
    status: "COMPLETED_VERIFIED",
    groups: { enterprise: "RELATED", "life-law": "DIRECT", "busan-hub": "DIRECT" },
    publicNote: "공공기관·혁신센터 협업 생활법률 프로그램. 기업 임직원 교육은 아닙니다.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-youth-jeonse-series",
    historyId: "youth-jeonse-prevention-series",
    label: "청년 전세사기 예방 오프라인 강의",
    institution: "부산 지역 청년·기관 대상",
    date: "2025~2026",
    status: "COMPLETED_VERIFIED",
    groups: { jeonse: "DIRECT", university: "RELATED" },
    publicNote: "청년 대상 전세사기 예방 강의 시리즈.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-youth-mistake-crime",
    historyId: "youth-mistake-crime-lecture",
    label: "생활 속 형사 리스크 예방 강의",
    institution: "부산 지역 청년·기관 대상",
    date: "2025-08-01",
    status: "COMPLETED_VERIFIED",
    groups: { "high-school": "RELATED", "life-law": "DIRECT" },
    publicNote: "청년 대상 온라인 게시·금전거래 등 실수로 범죄가 되는 상황 예방 강의.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-youth-digital",
    historyId: "youth-digital-law-guide",
    label: "디지털 법률 가이드 강의",
    institution: "부산 지역 청년·기관 대상",
    date: "2025-08-31",
    status: "COMPLETED_VERIFIED",
    groups: { "high-school": "RELATED", "life-law": "DIRECT" },
    publicNote: "청년 대상 온라인·SNS 생활법률 강의.",
    sourceNote: "history.ts verified",
  },
  {
    id: "ev-myeongrye-mou",
    label: "명례일반산업단지 기업 법률지원 MOU",
    institution: "명례일반산업단지",
    status: "PARTIAL",
    groups: { enterprise: "RELATED" },
    publicNote: "입주기업 법률지원 협약. 강의 실적이 아니라 기업 협업 근거로만 안내합니다.",
    sourceNote: "활동-명례일반산업단지MOU.png · 강의 아님",
  },
  {
    id: "ev-university-lecture",
    label: "대학교 정규·비교과 특강 출강",
    institution: "-",
    status: "UNVERIFIED",
    groups: { university: "DIRECT" },
    publicNote: "확인된 대학 출강 기록 없음 — 화면에 실적으로 노출하지 않음",
    sourceNote: "history.ts에 university 유형 항목 없음",
  },
  {
    id: "ev-corporate-inhouse",
    label: "기업 사내 임직원 강연",
    institution: "-",
    status: "UNVERIFIED",
    groups: { enterprise: "DIRECT" },
    publicNote: "확인된 기업 사내 강연 기록 없음 — 화면에 실적으로 노출하지 않음",
    sourceNote: "history.ts에 corporate 유형 항목 없음",
  },
  {
    id: "ev-busan-high-school",
    label: "부산 소재 고등학교 출강",
    institution: "-",
    status: "UNVERIFIED",
    groups: { "high-school": "DIRECT" },
    publicNote: "확인된 고교 출강은 양산제일고(경남) 1건 — 부산 고교 실적으로 표기하지 않음",
    sourceNote: "history.ts school 유형은 양산제일고만 존재",
  },
];

export function getPublicEvidenceForGroup(
  group: LectureEvidenceGroup,
): Array<LectureEvidenceRecord & { applicability: "DIRECT" | "RELATED" }> {
  return lectureEvidenceRegistry
    .filter(
      (record) =>
        (record.status === "COMPLETED_VERIFIED" || record.status === "PARTIAL") &&
        record.groups[group],
    )
    .map((record) => ({
      ...record,
      applicability: record.groups[group] as "DIRECT" | "RELATED",
    }))
    .sort((a, b) =>
      a.applicability === b.applicability
        ? 0
        : a.applicability === "DIRECT"
          ? -1
          : 1,
    );
}
