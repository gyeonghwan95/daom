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
    id: "lecture-education",
    title: "법률 강의·기관 출강",
    description:
      "기관·학교·기업 대상 생활법률·전세사기 예방·청년 특강 안내입니다. 법정의무교육은 포함하지 않습니다.",
    links: [
      { href: "/법률강의", label: "법률 강의 허브" },
      { href: "/강의이력", label: "강의 이력" },
      { href: "/부산법률강사", label: "부산 법률 강사 섭외" },
      { href: "/부산법무사강의", label: "부산 법무사 강의" },
      { href: "/부산기관법률특강", label: "기관·단체 법률특강" },
      { href: "/부산도서관법률특강", label: "도서관 법률특강" },
      { href: "/전세사기예방교육", label: "전세사기 예방교육" },
      { href: "/청년생활법률특강", label: "청년 생활법률 특강" },
      { href: "/기업법률교육", label: "기업 법률교육" },
      { href: "/강사소개", label: "강사 소개" },
      { href: "/강의문의", label: "강의 문의" },
    ],
  },
  {
    id: "search-intent-guides",
    title: "검색의도·실제 검색 키워드",
    description:
      "추천·비용·복대리·집단등기·회생·공공기관·보존등기 등 고객이 실제로 검색하는 키워드 안내입니다.",
    links: [
      { href: "/search-guides", label: "검색의도 안내 허브" },
      { href: "/등기실무", label: "등기 실무 허브" },
      { href: "/부산등기복대리", label: "부산 등기 복대리" },
      { href: "/부산집단등기", label: "부산 집단등기" },
      { href: "/특수등기의뢰", label: "특수 등기 의뢰" },
      { href: "/법무사협업", label: "법무사 협업" },
    ],
  },
  {
    id: "selection-guides",
    title: "추천·비용·상담 검색 안내",
    description: "추천·후기·비용·상담 키워드 검색 전 확인할 선택 기준 페이지입니다.",
    links: [
      { href: "/부산법무사추천", label: "부산 법무사 추천 기준" },
      { href: "/부산법무사비용", label: "부산 법무사 비용·수임료" },
      { href: "/부산잔금일법무사", label: "부산 잔금일 법무사" },
      { href: "/부산등기법무사추천", label: "부산 등기 법무사 선택" },
      { href: "/부산법무사비교", label: "부산 법무사 비교" },
      { href: "/개인회생파산", label: "개인회생·파산 허브" },
    ],
  },
  {
    id: "main-services",
    title: "부산 법무사 주요 업무",
    description: "상속·부동산·법인·개인회생 등 핵심 업무 허브로 이동합니다.",
    links: [
      { href: "/부산법무사", label: "부산 법무사" },
      { href: "/부산상속법무사", label: "부산 상속전문 법무사" },
      { href: "/부산법인법무사", label: "부산 법인전문 법무사" },
      { href: "/부산등기법무사", label: "부산 등기 전문 법무사" },
      { href: "/부산부동산등기전문", label: "부산 부동산등기 전문" },
      { href: "/부산개인회생", label: "부산 개인회생" },
      { href: "/부산법무사비용", label: "부산 법무사 비용" },
      { href: "/부산법무사추천", label: "부산 법무사 추천" },
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
      { href: "/부산기업법률자문", label: "기업 법률실무 지원" },
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/부산기업채권관리", label: "기업 채권관리" },
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
