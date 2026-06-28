import { seoEntity } from "./helpers";
import type { SeoIntentEntity } from "./types";

/**
 * 검색 의도(비용·서류·절차 등) 키워드 DB
 */
export const seoIntents: SeoIntentEntity[] = [
  seoEntity({
    id: "intent-cost",
    name: "비용",
    slug: "intent-cost",
    type: "intent",
    parentRegion: null,
    keywords: ["법무사 비용", "등기 비용", "수임료", "부산 법무사 비용"],
    description:
      "상속등기·부동산등기·법인등기·개인회생 등 업무별 법무사 수임료·등기 비용 안내 검색 의도입니다.",
    relatedServices: [
      "inheritance-registration",
      "corporate-registration",
      "personal-rehabilitation",
    ],
    relatedRegions: ["busan"],
    searchIntent: "cost",
    priority: 88,
  }),
  seoEntity({
    id: "intent-fee-table",
    name: "보수표",
    slug: "intent-fee-table",
    type: "intent",
    parentRegion: null,
    keywords: ["법무사 보수표", "대한법무사협회 보수", "부산 법무사 보수표"],
    description:
      "법무사 협회 보수 기준·항목별 수임료 참고 검색 의도입니다.",
    relatedServices: ["inheritance-registration", "real-estate-registration"],
    relatedRegions: ["busan"],
    searchIntent: "fee-table",
    priority: 84,
  }),
  seoEntity({
    id: "intent-required-documents",
    name: "필요서류",
    slug: "intent-required-documents",
    type: "intent",
    parentRegion: null,
    keywords: ["필요서류", "등기 필요서류", "상속등기 필요서류", "법인등기 서류"],
    description:
      "업무별 제출·준비 서류 목록을 찾는 검색 의도입니다.",
    relatedServices: [
      "inheritance-registration",
      "ownership-transfer",
      "company-establishment",
    ],
    relatedRegions: ["busan"],
    searchIntent: "documents",
    priority: 86,
  }),
  seoEntity({
    id: "intent-preparation-documents",
    name: "준비서류",
    slug: "intent-preparation-documents",
    type: "intent",
    parentRegion: null,
    keywords: ["준비서류", "등기 준비서류", "상속 서류 준비", "회생 준비서류"],
    description:
      "상담 전·접수 전 미리 준비해야 할 서류를 찾는 검색 의도입니다.",
    relatedServices: [
      "personal-rehabilitation",
      "inheritance-registration",
      "director-change",
    ],
    relatedRegions: ["busan"],
    searchIntent: "preparation-documents",
    priority: 82,
  }),
  seoEntity({
    id: "intent-period",
    name: "기간",
    slug: "intent-period",
    type: "intent",
    parentRegion: null,
    keywords: ["등기 기간", "상속등기 기간", "법인등기 소요", "회생 기간"],
    description:
      "절차별 소요 기간·일정을 확인하려는 검색 의도입니다.",
    relatedServices: [
      "inheritance-registration",
      "corporate-registration",
      "personal-rehabilitation",
    ],
    relatedRegions: ["busan"],
    searchIntent: "period",
    priority: 80,
  }),
  seoEntity({
    id: "intent-deadline",
    name: "기한",
    slug: "intent-deadline",
    type: "intent",
    parentRegion: null,
    keywords: ["등기 기한", "상속 신고 기한", "임원변경 기한", "상속포기 기한"],
    description:
      "법정 신고·등기 기한을 확인하려는 검색 의도입니다.",
    relatedServices: [
      "inheritance-renunciation",
      "qualified-acceptance",
      "director-change",
    ],
    relatedRegions: ["busan"],
    searchIntent: "deadline",
    priority: 84,
  }),
  seoEntity({
    id: "intent-penalty",
    name: "과태료",
    slug: "intent-penalty",
    type: "intent",
    parentRegion: null,
    keywords: ["과태료", "임원변경 과태료", "등기 지연 과태료", "신고 지연"],
    description:
      "등기·신고 지연 시 과태료·가산세를 확인하려는 검색 의도입니다.",
    relatedServices: ["director-change", "inheritance-registration"],
    relatedRegions: ["busan"],
    searchIntent: "penalty",
    priority: 78,
  }),
  seoEntity({
    id: "intent-procedure",
    name: "절차",
    slug: "intent-procedure",
    type: "intent",
    parentRegion: null,
    keywords: ["등기 절차", "상속등기 절차", "법인등기 절차", "개인회생 절차"],
    description:
      "업무별 단계별 진행 절차를 알아보려는 검색 의도입니다.",
    relatedServices: [
      "inheritance-registration",
      "corporate-registration",
      "personal-rehabilitation",
      "bankruptcy",
    ],
    relatedRegions: ["busan"],
    searchIntent: "procedure",
    priority: 90,
  }),
  seoEntity({
    id: "intent-consultation",
    name: "상담",
    slug: "intent-consultation",
    type: "intent",
    parentRegion: null,
    keywords: ["법무사 상담", "부산 법무사 상담", "전화 상담", "방문 상담"],
    description:
      "법무사 상담 방법·비용·준비사항을 찾는 전환형 검색 의도입니다.",
    relatedServices: [
      "inheritance-registration",
      "personal-rehabilitation",
      "corporate-registration",
    ],
    relatedRegions: ["busan", "haeundae-gu", "centum"],
    searchIntent: "consultation",
    priority: 96,
  }),
  seoEntity({
    id: "intent-case",
    name: "사례",
    slug: "intent-case",
    type: "intent",
    parentRegion: null,
    keywords: ["법무사 사례", "상속등기 사례", "개인회생 사례", "등기 사례"],
    description:
      "유사 사건 진행 사례·후기를 찾는 검색 의도입니다.",
    relatedServices: [
      "inheritance-registration",
      "personal-rehabilitation",
      "ownership-transfer",
    ],
    relatedRegions: ["busan"],
    searchIntent: "case",
    priority: 76,
  }),
  seoEntity({
    id: "intent-faq",
    name: "FAQ",
    slug: "intent-faq",
    type: "intent",
    parentRegion: null,
    keywords: ["법무사 FAQ", "자주 묻는 질문", "상속등기 FAQ", "회생 FAQ"],
    description:
      "자주 묻는 질문·답변 형식의 정보를 찾는 검색 의도입니다.",
    relatedServices: [
      "inheritance-registration",
      "qualified-acceptance",
      "personal-rehabilitation",
    ],
    relatedRegions: ["busan"],
    searchIntent: "faq",
    priority: 74,
  }),
];
