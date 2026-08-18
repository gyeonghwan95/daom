import type { LocalLandingConfig, LocalLandingPage } from "@/types/local-landing";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { officeLocation } from "@/lib/office-location";
import {
  busanLawyerHubCostGuide,
  busanLawyerHubDescription,
  busanLawyerHubFaqs,
  busanLawyerHubH1,
  busanLawyerHubHeroParagraphs,
  busanLawyerHubMetaTitle,
} from "@/lib/local-landing/busan-lawyer-hub-content";

/**
 * `/부산법무사` — 「부산 법무사」 검색 대표 페이지.
 * 추천·비교 의도는 `/부산법무사추천`. 비용은 `/부산법무사비용`.
 * 홈(`/`) 제목과 exact-match를 나누어 자기잠식을 막는다.
 */
export function buildBusanLawyerFlagshipPage(
  config: LocalLandingConfig,
): LocalLandingPage {
  return {
    slug: config.slug,
    path: `/${config.slug}`,
    pageType: "region-hub",
    serviceSlug: config.serviceSlug,
    title: "부산 법무사",
    metaTitle: busanLawyerHubMetaTitle,
    h1: busanLawyerHubH1,
    description: busanLawyerHubDescription,
    summaryParagraphs: busanLawyerHubHeroParagraphs,
    primaryKeywords: [
      "부산 법무사",
      "부산법무사",
      "부산 법무사 업무",
      "부산 법무사 상담",
    ],
    regionLabel: config.regionLabel,
    regionKey: config.regionKey,
    neighborhoods: config.neighborhoods,
    problemStatement:
      "부산에서 법무사를 찾는 이유는 사람마다 다릅니다. 부모님 사망 후 부동산·채무 정리, 아파트 매매 잔금 후 소유권이전, 법인 설립·임원변경, 카드·대출 누적에 따른 개인회생처럼 사건이 갈립니다. 다옴법무사사무소는 해운대·센텀에서 안윤정 법무사가 직접 상담하며, 이 페이지에서 필요한 절차를 가린 뒤 상속·등기·법인·회생 안내로 이어집니다. 관할은 부동산·법인 본점 소재지에 따라 남부산·북부산·중부산·부산진등기소와 부산가정법원·부산회생법원으로 나뉩니다. 처음 확인할 사실은 업무명이 아니라 지금 놓치면 안 되는 기한입니다.",
    whenNeeded: [
      "부모님 사망 후 상속등기·상속포기·한정승인을 어디에 맡길지 고민할 때",
      "부산 아파트·상가 매매·증여 후 소유권이전등기가 필요할 때",
      "법인설립·임원변경·본점이전 등기를 진행해야 할 때",
      "개인회생·파산 신청 서류와 법원 접수를 준비할 때",
      "부산 법무사 추천·비교를 검색하다 선택 기준이 필요할 때",
      "해운대·센텀·재송동 등 인근에서 방문 상담을 원할 때",
      "전화·카카오톡으로 1차 절차만 먼저 확인하고 싶을 때",
    ],
    jurisdictionGuide: {
      title: "부산 관할 법원·등기소",
      address: "부산광역시 연제구 법원로 8 (부산지방법원 등기국)",
      accessNote:
        "부동산 소재지·법인 본점에 따라 남부산·북부산·중부산·부산진등기소로 나뉩니다. 상속포기·한정승인은 부산가정법원, 개인회생은 부산회생법원 관할을 확인하세요.",
      jurisdictionNote:
        "등기 신청은 부동산·법인 본점 소재지를 기준으로 관할이 정해집니다. 인터넷등기소 가능 여부를 먼저 확인하면 방문 부담을 줄일 수 있습니다.",
      practicalNotes: [
        "관할 오접수는 반려·이송 사유가 될 수 있습니다.",
        "취득세·등록면허세 신고와 등기 접수 순서를 맞추세요.",
        "상속 개시 후 3개월 기한은 등기와 별도로 확인하세요.",
      ],
    },
    consultationCase: {
      title: "상속·등기 복합 상담",
      summary:
        "해운대 거주 의뢰인이 부모님 아파트 상속과 근저당 정리를 함께 문의하셨습니다. 채무 조사 후 단순승인 가능 여부를 확인하고 상속등기·말소 순서를 잡아 진행했습니다.",
      href: "/services/cases/haeundae-inheritance-registration-case",
    },
    consultationCases: [
      {
        title: "상속·등기 복합 상담",
        summary:
          "해운대 거주 의뢰인이 부모님 아파트 상속과 근저당 정리를 함께 문의하셨습니다. 채무 조사 후 단순승인 가능 여부를 확인하고 상속등기·말소 순서를 잡아 진행했습니다.",
        href: "/services/cases/haeundae-inheritance-registration-case",
      },
      {
        title: "법인 임원변경·과태료 예방",
        summary:
          "센텀 소재 법인이 대표이사 변경 후 등기 기한이 임박해 상담하셨습니다. 의사록·취임승낙서를 점검해 기한 내 접수했습니다.",
        href: "/services/cases/yeonje-director-change-case",
      },
      {
        title: "매매 잔금일 소유권이전",
        summary:
          "수영구 아파트 매매에서 잔금일과 근저당 말소·이전등기 일정을 맞춰 당일 연속 처리를 준비한 사례입니다.",
        href: "/services/cases/centum-ownership-transfer-case",
      },
    ],
    legalIssues: [
      "상속·부동산·법인·개인회생은 관할·서류·기한이 다릅니다. 한 페이지에서 업무를 구분한 뒤 세부 안내로 이동하세요.",
      "법무사 선택 시 확인 기준: 해당 업무 경험, 관할 안내, 비용 항목 구분, 직접 상담 여부.",
      "비용만으로 선택하면 말소·보정·해외서류·세금 신고가 빠져 추가 부담이 생길 수 있습니다.",
      "상담 전 준비: 등기부·가족관계·정관·계약서 중 해당하는 것.",
      "상속·법인·부동산·회생은 기한이 겹치면 우선순위를 정해야 합니다. 3개월·임원변경·취득세 60일·잔금일을 같은 달력에 표시하세요.",
      "비대면 진행이 가능한 사건과 초기 대면·전화 상담이 필요한 사건을 구분해 안내합니다.",
    ],
    precautions: [
      "법원·등기소와 공식 제휴 관계가 아닙니다. 관할·접수·서류를 실무 기준으로 안내합니다.",
      "인터넷 평균 비용·순위만으로 사무소를 고르지 마세요. 사건 내용과 포함 범위를 확인하세요.",
      "이 안내는 일반 법률정보이며, 개별 사건에 대한 법률 자문·수임 확정이 아닙니다.",
    ],
    procedures: [
      "부산에서 법무사를 찾는 상황 확인(상속·매매·법인·회생)",
      "업무별 차이 설명 및 우선 기한(3개월·임원변경 등) 점검",
      "관할 법원·등기소와 준비서류 안내",
      "법무사 수임료·공과금·세금 구분 견적",
      "서류 준비·신청서 작성·접수·완료 확인",
    ],
    documents: [
      "최신 등기부등본 또는 법인 등기사항전부증명서",
      "신분증·인감증명서(해당 시)",
      "상속: 피상속인·상속인 가족관계증명서·기본증명서",
      "법인: 정관·주주총회·이사회 의사록",
      "매매·증여: 계약서·잔금 증빙",
      "위임장(수임 시)",
    ],
    costGuide: busanLawyerHubCostGuide,
    costFactors: [
      "업무 유형(상속·부동산·법인·회생)",
      "부동산 시가표준액·건수",
      "상속인·임원·공동명의자 수",
      "근저당·가압류 등 선순위 권리 정리",
      "해외 상속인·공증·보정 가능성",
    ],
    faqs: busanLawyerHubFaqs,
    lawyerOpinion: `${lawyerProfileMeta.fullTitle}는 ${lawyerProfileMeta.officeArea}에서 상속·부동산·법인·회생 사건을 직접 상담합니다. 검색으로 찾은 정보가 실제 절차와 맞는지 먼저 짚고, 업무명을 모르셔도 현재 상황만으로 1차 순서를 정리합니다. 작성·검토: ${lawyerProfileMeta.fullTitle}(다옴법무사사무소). 최종확인일 2026-08-17.`,
    directionsNote: `사무소는 ${officeLocation.fullAddress}입니다. 센텀시티역·벡스코 인근이며, 방문은 네이버 예약 후 이용해 주세요.`,
    ctaDescription:
      "필요한 업무부터 확인하고 싶으시면 현재 상황과 준비된 자료만 남겨 주세요.",
    relatedBlogHrefs: [
      {
        href: "/blog/busan-lawyer-consultation-documents",
        label: "부산 법무사 상담 준비 서류",
      },
      {
        href: "/blog/busan-lawyer-jurisdiction-checklist",
        label: "관할 등기소·법원 확인법",
      },
      {
        href: "/blog/centum-lawyer-visit-day-flow",
        label: "센텀 방문상담 하루 흐름",
      },
    ],
    relatedServiceLinks: [
      { href: "/부산상속법무사", label: "부산 상속 법무사 — 등기·포기·한정승인 선택" },
      { href: "/부산한정승인", label: "부산 한정승인 — 상속채무가 걱정될 때" },
      { href: "/부산상속등기", label: "부산 상속등기 — 서류와 진행 순서" },
      { href: "/부산부동산등기", label: "부산 부동산등기 — 매매·이전" },
      { href: "/부산법인법무사", label: "부산 법인 법무사 — 설립·변경·해산" },
      { href: "/부산법인등기", label: "부산 법인등기 — 임원·본점·목적 변경" },
      { href: "/부산상속포기", label: "부산 상속포기 — 기한·후순위 확인" },
      { href: "/부산개인회생법무사", label: "부산 개인회생 법무사 — 신청 가능성" },
      { href: "/업무사례/양산법무사업무", label: "양산 법무사 — 인접 시 업무 허브" },
      { href: "/부산법무사무소", label: "부산 법무사무소 안내" },
      { href: "/부산법무사서류준비", label: "서류 준비 체크리스트" },
      { href: "/부산법무사방문상담", label: "방문상담 안내" },
      { href: "/부산법무사비대면상담", label: "비대면상담 안내" },
      { href: "/부산법무사비용", label: "부산 법무사 비용" },
      { href: "/부산법무사상담", label: "상담 전 비용·준비서류" },
      { href: "/부산법률상담", label: "공공 상담과 법무사 업무" },
      { href: "/무슨법률업무인지모를때", label: "업무명을 모를 때" },
      { href: "/부산증여등기", label: "부산 증여등기" },
      { href: "/부산법무사추천", label: "부산 법무사 선택 기준" },
      { href: "/부산법무사보수표", label: "부산 법무사 보수표" },
      { href: "/contact/inquiry?from=부산법무사", label: "업무 가능 여부 확인하기" },
    ],
    relatedRegionLinks: [
      { href: "/해운대법무사", label: "해운대 법무사" },
      { href: "/센텀법무사", label: "센텀 법무사" },
      { href: "/재송동법무사", label: "재송동 법무사" },
      { href: "/연제구법무사", label: "연제구 법무사" },
      { href: "/동래구법무사", label: "동래구 법무사" },
      { href: "/수영구법무사", label: "수영구 법무사" },
      { href: "/부산진구법무사", label: "부산진구 법무사" },
      { href: "/동구법무사", label: "동구 법무사" },
      { href: "/남구법무사", label: "남구 법무사" },
      { href: "/금정구법무사", label: "금정구 법무사" },
      { href: "/북구법무사", label: "북구 법무사" },
      { href: "/사상구법무사", label: "사상구 법무사" },
      { href: "/사하구법무사", label: "사하구 법무사" },
      { href: "/중구법무사", label: "중구 법무사" },
      { href: "/서구법무사", label: "서구 법무사" },
      { href: "/영도구법무사", label: "영도구 법무사" },
      { href: "/강서구법무사", label: "강서구 법무사" },
      { href: "/기장군법무사", label: "기장군 법무사" },
      { href: "/업무사례/경남법무사업무", label: "경남 법무사 업무" },
    ],
  };
}
