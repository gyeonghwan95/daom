/**
 * 검색 의도(기관·대상·주제·목적 조합) → 대표 URL.
 * 키워드만 다르고 답변이 같은 의도는 하나의 URL로 묶습니다.
 */
export type LectureIntentMapEntry = {
  id: string;
  intentLabel: string;
  /** 지역 + 강사표현 + 기관/대상 + 주제 + 목적 중 고유 조합 */
  dimensions: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  targetUrl: string;
  /** create | strengthen | merge | skip */
  action: "create" | "strengthen" | "merge" | "skip";
  notes?: string;
};

export const lectureIntentToUrlMap: LectureIntentMapEntry[] = [
  {
    id: "expert-discovery-hub",
    intentLabel: "부산 법률 전문가 탐색·섭외",
    dimensions: ["부산", "법률 전문가", "기업·기관·언론", "자격·이력 검증"],
    primaryKeyword: "부산 법률 전문가",
    secondaryKeywords: [
      "부산 법률 전문가 섭외",
      "부산 법률 전문가 인터뷰",
    ],
    targetUrl: "/부산법률전문가",
    action: "strengthen",
    notes: "DISCOVERY 허브. 기존 강의 URL 유지.",
  },
  {
    id: "speaker-hiring-hub",
    intentLabel: "부산 강사 초빙·출강·섭외 종합",
    dimensions: ["부산", "강사 초빙", "기관·기업·청년", "실무특강"],
    primaryKeyword: "부산 강사 초빙",
    secondaryKeywords: [
      "부산 강사 출강",
      "부산 강사 섭외",
      "부산 특강 강사",
      "부산 외부강사",
      "부산 여성 강사",
      "부산 법무사 강사",
    ],
    targetUrl: "/부산법률강사",
    action: "strengthen",
    notes: "기존 URL 유지·본문 보강",
  },
  {
    id: "program-hub",
    intentLabel: "법률 강의·특강 프로그램 허브",
    dimensions: ["부산", "법률 강의", "기관", "생활법률"],
    primaryKeyword: "부산 법률 강의",
    secondaryKeywords: ["부산 법률 특강", "맞춤형 법률교육"],
    targetUrl: "/법률강의",
    action: "strengthen",
  },
  {
    id: "public-institution",
    intentLabel: "공공기관 직원·시민 교육 강사",
    dimensions: ["부산", "공공기관", "직원교육", "생활·실무법률"],
    primaryKeyword: "부산 공공기관 강사",
    secondaryKeywords: [
      "부산 기관교육 강사",
      "부산 공공기관 직원교육",
      "부산 공공기관 특강",
    ],
    targetUrl: "/공공기관법률교육",
    action: "strengthen",
  },
  {
    id: "enterprise",
    intentLabel: "기업·직원교육 강사",
    dimensions: ["부산", "기업교육", "직원", "계약·미수금·법인"],
    primaryKeyword: "부산 기업교육 강사",
    secondaryKeywords: [
      "부산 직원교육 강사",
      "부산 사내교육 강사",
      "부산 실무교육 강사",
    ],
    targetUrl: "/기업법률교육",
    action: "strengthen",
  },
  {
    id: "youth",
    intentLabel: "청년 특강 강사",
    dimensions: ["부산", "청년", "자립역량", "주거·계약·금전"],
    primaryKeyword: "부산 청년 특강 강사",
    secondaryKeywords: [
      "부산 청년센터 강사",
      "부산 자립청년 교육",
      "부산 사회초년생 교육",
    ],
    targetUrl: "/청년생활법률특강",
    action: "strengthen",
  },
  {
    id: "startup",
    intentLabel: "창업교육 강사",
    dimensions: ["부산", "창업", "예비창업자", "계약·법인·채권"],
    primaryKeyword: "부산 창업교육 강사",
    secondaryKeywords: ["부산 예비창업자 강사", "부산 스타트업 강사"],
    targetUrl: "/창업법률교육",
    action: "strengthen",
  },
  {
    id: "welfare",
    intentLabel: "사회복지·자립지원 종사자교육",
    dimensions: ["부산", "사회복지기관", "종사자", "가족·재산·생활분쟁"],
    primaryKeyword: "부산 사회복지기관 강사",
    secondaryKeywords: [
      "부산 복지기관 종사자교육",
      "부산 자립지원 종사자교육",
    ],
    targetUrl: "/부산사회복지기관강사",
    action: "create",
    notes: "자립지원전담기관 검증 이력 기반 신규",
  },
  {
    id: "library-citizen",
    intentLabel: "도서관·시민강좌 강사",
    dimensions: ["부산", "도서관", "시민", "생활법률"],
    primaryKeyword: "부산 도서관 강사",
    secondaryKeywords: ["부산 시민강좌 강사", "부산 생활법률 강사"],
    targetUrl: "/부산도서관법률특강",
    action: "strengthen",
  },
  {
    id: "school",
    intentLabel: "학교·대학 특강",
    dimensions: ["부산", "학교", "학생", "생활법률·진로"],
    primaryKeyword: "부산 학교 특강 강사",
    secondaryKeywords: ["부산 대학 특강 강사"],
    targetUrl: "/학교법률교육",
    action: "strengthen",
    notes: "학교 출강 확인분(양산제일고)은 진로특강으로 연결, 일반화 금지",
  },
  {
    id: "topic-jeonse",
    intentLabel: "전세사기 예방 강사",
    dimensions: ["부산", "전세사기", "청년·기관", "등기부·계약"],
    primaryKeyword: "부산 전세사기 예방 강사",
    secondaryKeywords: ["부산 주거안전 강사", "등기부등본 교육 강사"],
    targetUrl: "/전세사기예방교육",
    action: "strengthen",
  },
  {
    id: "guide-checklist",
    intentLabel: "강사 섭외 체크리스트",
    dimensions: ["부산", "섭외", "담당자", "프로필·강의안·비용"],
    primaryKeyword: "부산 강사 섭외 체크리스트",
    secondaryKeywords: ["부산 외부강사 섭외 방법", "강의계획서에 들어갈 내용"],
    targetUrl: "/부산강사섭외체크리스트",
    action: "create",
  },
  {
    id: "guide-fee",
    intentLabel: "출강료·비용 안내",
    dimensions: ["부산", "출강료", "담당자", "견적 요소"],
    primaryKeyword: "부산 강사 섭외 비용",
    secondaryKeywords: ["부산 출강료", "부산 강사료", "강의료 견적"],
    targetUrl: "/부산강사섭외비용",
    action: "create",
  },
  {
    id: "guide-topics",
    intentLabel: "기관 특강 주제 추천",
    dimensions: ["부산", "주제추천", "청년·직원·시민", "교육기획"],
    primaryKeyword: "부산 기관 특강 주제 추천",
    secondaryKeywords: [
      "부산 직원교육 주제 추천",
      "부산 청년 프로그램 강의주제",
    ],
    targetUrl: "/기관특강주제추천",
    action: "create",
  },
  {
    id: "guide-duration",
    intentLabel: "강의시간별 구성",
    dimensions: ["시간", "60·90·120·반일", "진행방식"],
    primaryKeyword: "1시간 특강 주제",
    secondaryKeywords: ["2시간 참여형 교육", "4시간 실무 워크숍"],
    targetUrl: "/강의시간별구성",
    action: "create",
  },
  {
    id: "skip-gu-dong",
    intentLabel: "구·동 단위 강사 페이지",
    dimensions: ["해운대", "수영구", "센텀"],
    primaryKeyword: "해운대 강사",
    secondaryKeywords: ["수영구 강사", "부산진구 강사", "센텀 강사"],
    targetUrl: "/부산법률강사",
    action: "skip",
    notes: "구·동 페이지 생성 금지 — 허브 출강지역 설명으로 흡수",
  },
  {
    id: "skip-synonym-law-only",
    intentLabel: "법률 강사 동의어 thin",
    dimensions: ["법률", "강연", "특강"],
    primaryKeyword: "부산 법률교육 강사",
    secondaryKeywords: ["부산 법률특강 강사", "부산 법률 강연 강사"],
    targetUrl: "/부산법률강사",
    action: "merge",
    notes: "별도 페이지 생성하지 않음",
  },
];

export function getIntentEntryByKeyword(
  keyword: string,
): LectureIntentMapEntry | undefined {
  const q = keyword.trim();
  return lectureIntentToUrlMap.find(
    (entry) =>
      entry.primaryKeyword === q || entry.secondaryKeywords.includes(q),
  );
}
