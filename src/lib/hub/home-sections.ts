import type { RelatedLink } from "@/types/content";
import { CORE_HUBS } from "./registry";

export type HomeHubSection = {
  id: string;
  title: string;
  description: string;
  links: RelatedLink[];
};

export const HOME_HUB_SECTIONS: HomeHubSection[] = [
  {
    id: "selection-guides",
    title: "추천·비용·상담 검색 안내",
    description: "추천·후기·비용·상담 키워드 검색 전 확인할 선택 기준 페이지입니다.",
    links: [
      { href: "/부산법무사추천", label: "부산 법무사 추천 기준" },
      { href: "/부산등기법무사추천", label: "부산 등기 법무사 선택" },
      { href: "/부산법무사비교", label: "부산 법무사 비교" },
      { href: "/부산법무사상담", label: "부산 법무사 상담 준비" },
      { href: "/부산법무사후기", label: "후기 확인 기준" },
      { href: "/부산상속등기전문", label: "상속등기 상담 확인" },
    ],
  },
  {
    id: "main-services",
    title: "부산 법무사 주요 업무",
    description: "상속·부동산·법인·개인회생 등 핵심 업무 허브로 이동합니다.",
    links: [
      { href: "/자가진단", label: "업무별 자가진단" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/부산상속포기", label: "부산 상속포기" },
      { href: "/부산한정승인", label: "부산 한정승인" },
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/services", label: "업무안내 전체 보기" },
    ],
  },
  {
    id: "popular-registration",
    title: "많이 찾는 등기 업무",
    description: "신축·매매·상속·법인 등 자주 검색하는 등기 안내입니다.",
    links: [
      { href: "/부산신축건물보존등기", label: "신축건물 보존등기" },
      { href: "/공공기관등기업무", label: "공공기관 등기업무" },
      { href: "/부산소유권이전등기", label: "부산 소유권이전등기" },
      { href: "/부산근저당설정등기", label: "부산 근저당설정등기" },
      { href: "/부산근저당말소등기", label: "부산 근저당말소등기" },
      { href: "/부산임원변경등기", label: "부산 임원변경등기" },
      { href: "/부산신축아파트소유권이전등기", label: "신축 아파트 소유권이전등기" },
    ],
  },
  {
    id: "popular-consult",
    title: "많이 찾는 상담",
    description: "의뢰인이 자주 검색하는 상담 주제입니다.",
    links: [
      { href: "/상속등기비용", label: "상속등기 비용" },
      { href: "/상속등기필요서류", label: "상속등기 필요서류" },
      { href: "/상속등기기간", label: "상속등기 기간" },
      { href: "/임원변경등기과태료", label: "임원변경등기 과태료" },
      { href: "/개인회생비용", label: "개인회생 비용" },
      { href: "/부산여성법무사", label: "부산 여성 법무사" },
    ],
  },
  {
    id: "region-lawyers",
    title: "지역별 법무사 안내",
    description: "부산 구·군·동·역세권별 법무사 상담 페이지입니다.",
    links: [
      { href: "/부산법무사", label: "부산 법무사" },
      { href: "/해운대법무사", label: "해운대 법무사" },
      { href: "/센텀법무사", label: "센텀 법무사" },
      { href: "/재송동법무사", label: "재송동 법무사" },
      { href: "/수영구법무사", label: "수영구 법무사" },
      { href: "/연제구법무사", label: "연제구 법무사" },
      { href: "/부산진구법무사", label: "부산진구 법무사" },
      { href: "/기장군법무사", label: "기장군 법무사" },
      { href: "/location", label: "지역·오시는 길 전체" },
    ],
  },
  {
    id: "court-registry",
    title: "법원·등기소 인근 업무 안내",
    description: "관할·접수·서류 보정이 중요한 기관별 안내입니다.",
    links: [
      { href: "/부산지방법원등기국", label: "부산지방법원 등기국" },
      { href: "/부산지방법원법무사", label: "부산지방법원 법무사" },
      { href: "/부산회생법원법무사", label: "부산회생법원 법무사" },
      { href: "/부산가정법원상속", label: "부산가정법원 상속" },
      { href: "/남부산등기소법무사", label: "남부산등기소 법무사" },
      { href: "/부산진등기소법무사", label: "부산진등기소 법무사" },
    ],
  },
  {
    id: "cost-docs-period",
    title: "비용·서류·기간 안내",
    description: "비용 산정 요인, 준비서류, 기한·과태료를 정리했습니다.",
    links: [
      { href: "/부산법무사비용", label: "부산 법무사 비용" },
      { href: "/부산법무사보수표", label: "부산 법무사 보수표" },
      { href: "/상속등기필요서류", label: "상속등기 필요서류" },
      { href: "/소유권이전등기서류", label: "소유권이전등기 서류" },
      { href: "/상속등기기간", label: "상속등기 기간" },
      { href: "/한정승인기간", label: "한정승인 기한" },
    ],
  },
  {
    id: "cases",
    title: "실제 상담 사례",
    description: "유사 사건 진행 경과를 참고하실 수 있습니다.",
    links: [
      { href: "/services/cases/haeundae-inheritance-registration-case", label: "해운대 상속등기 사례" },
      { href: "/services/cases/busan-personal-rehabilitation-consultation", label: "부산 개인회생 사례" },
      { href: "/services/cases/centum-ownership-transfer-case", label: "센텀 매매 등기 사례" },
      { href: "/services/cases/suyeong-company-establishment-case", label: "센텀 법인 설립 사례" },
      { href: "/services#cases", label: "업무 사례 전체" },
    ],
  },
  {
    id: "faq",
    title: "자주 묻는 질문",
    description: "비용·서류·기한 관련 FAQ 모음입니다.",
    links: [
      { href: "/faq/inheritance-registration-cost", label: "상속등기 비용 FAQ" },
      { href: "/faq/ownership-transfer-documents", label: "소유권이전 서류 FAQ" },
      { href: "/faq/personal-rehabilitation-duration-faq", label: "개인회생 기간 FAQ" },
      { href: "/faq/director-change-deadline-faq", label: "임원변경 기한 FAQ" },
      { href: "/faq", label: "FAQ 전체 보기" },
    ],
  },
  {
    id: "cta",
    title: "상담 문의",
    description: "전화·카카오톡·네이버 톡톡·방문(예약) 상담이 가능합니다.",
    links: [
      { href: "/contact", label: "부산 법무사 상담 신청" },
      { href: "/location", label: "센텀 법무사 오시는 길" },
      { href: "/about", label: "안윤정 법무사 소개" },
    ],
  },
];

export const SERVICE_HUB_SECTIONS: { title: string; links: RelatedLink[] }[] = [
  {
    title: "상속·가사",
    links: [
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/부산상속포기", label: "부산 상속포기" },
      { href: "/부산한정승인", label: "부산 한정승인" },
      { href: "/상속", label: "상속 종합 허브" },
      { href: "/services/inheritance-registration", label: "상속등기 업무 상세" },
    ],
  },
  {
    title: "부동산·개발",
    links: [
      { href: "/부산신축건물보존등기", label: "신축건물 보존등기" },
      { href: "/공공기관등기업무", label: "공공기관 등기업무" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/부산재개발등기", label: "부산 재개발·재건축 등기" },
      { href: "/부동산등기", label: "부동산등기 허브" },
      { href: "/services/real-estate-registration", label: "부동산등기 업무 상세" },
    ],
  },
  {
    title: "법인·기업",
    links: [
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/명례산업단지법인등기", label: "산업단지 법인등기" },
      { href: "/법인등기", label: "법인등기 허브" },
      { href: "/services/corporate-registration", label: "법인등기 업무 상세" },
    ],
  },
  {
    title: "개인회생·파산",
    links: [
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/부산회생법원개인회생", label: "부산회생법원 개인회생" },
      { href: "/개인회생파산", label: "개인회생·파산 허브" },
      { href: "/services/personal-rehabilitation", label: "개인회생 업무 상세" },
    ],
  },
];

export const LOCATION_HUB_LINKS: RelatedLink[] = [
  { href: "/부산법무사", label: "부산 법무사" },
  { href: "/해운대법무사", label: "해운대 법무사" },
  { href: "/센텀법무사", label: "센텀 법무사" },
  { href: "/재송동법무사", label: "재송동 법무사" },
  { href: "/반여동법무사", label: "반여동 법무사" },
  { href: "/서면법무사", label: "서면 법무사" },
  { href: "/연산동법무사", label: "연산동 법무사" },
  { href: "/광안리법무사", label: "광안리 법무사" },
  { href: "/광안동법무사", label: "광안동 법무사" },
  { href: "/센텀시티역법무사", label: "센텀시티역 법무사" },
  { href: "/서면역법무사", label: "서면역 법무사" },
  { href: "/명지동법무사", label: "명지동 법무사" },
  { href: "/기장법무사", label: "기장 법무사" },
];

export const FAQ_HUB_GROUPS = [
  {
    title: "비용·보수",
    slugs: [
      "inheritance-registration-cost",
      "lawyer-fee-and-remote-faq",
      "personal-rehabilitation-credit-faq",
    ],
  },
  {
    title: "서류·준비",
    slugs: [
      "ownership-transfer-documents",
      "personal-rehabilitation-documents-faq",
      "company-establishment-documents-faq",
      "multiple-heirs-inheritance-registration",
    ],
  },
  {
    title: "기간·기한",
    slugs: [
      "when-to-file-inheritance-registration",
      "inheritance-renunciation-deadline",
      "director-change-deadline-faq",
      "personal-rehabilitation-duration-faq",
    ],
  },
] as const;

export function getAllCoreHubLinks(): RelatedLink[] {
  return CORE_HUBS.map((hub) => ({
    href: `/${hub.slug}`,
    label: hub.title,
  }));
}
