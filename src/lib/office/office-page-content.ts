import { officeHours, officeLocation } from "@/lib/office-location";
import { lawyerProfileMeta } from "@/lib/lawyer-profile";
import { siteConfig } from "@/lib/site";

/**
 * `/office` 사무소 안내 본문
 * - 오시는 길(`/location`)과 역할 분리: 이 페이지는 사무소 운영·상담 방식·신뢰 정보
 * - 공개 문구에 순위 보장·전문 표방·과장 비대면 금지
 * 검토일: 2026-08-07
 */

export const officePageMeta = {
  h1: "다옴법무사사무소 안내",
  intro: `${siteConfig.name}는 ${officeLocation.fullAddress}에 있습니다. ${officeLocation.areaLabel} 일대에서 ${lawyerProfileMeta.fullTitle}가 상속등기·부동산등기·법인등기·개인회생 등 법무사 업무를 직접 상담하고 진행합니다. 방문은 사전 예약 후 이용해 주시고, 전화·카카오톡·네이버 톡톡으로도 상황을 먼저 확인할 수 있습니다.`,
  seoTitleHint: "해운대·센텀 법무사 사무소",
  seoDescription:
    "부산 해운대구 센텀 다옴법무사사무소. 주소·운영시간·주차·상담 방식과 방문 전 준비사항을 안내합니다. 안윤정 법무사가 직접 상담하며, 예약 후 방문해 주세요.",
} as const;

export const officeProseSections: {
  id: string;
  title: string;
  paragraphs: string[];
}[] = [
  {
    id: "office-overview",
    title: "이 사무소에서 무엇을 확인하나요",
    paragraphs: [
      `${siteConfig.name}는 부산 해운대구·센텀에 둔 법무사 사무소입니다. 의뢰인이 가장 먼저 확인하고 싶어 하는 것은 ‘어디에 있는지’와 ‘누구와 상담하는지’, ‘방문 전에 무엇을 하면 되는지’입니다. 이 페이지에서는 상호·주소·운영시간·교통·주차와 함께, 상담이 어떻게 시작되고 어떤 업무를 다루는지 사무소 기준으로 정리합니다. 찾아오시는 길의 상세 지도·동선은 오시는 길 페이지에서, 법무사 개인 이력은 소개 페이지에서 이어 보시면 됩니다.`,
      `${lawyerProfileMeta.fullTitle}는 중간에서만 받아 적는 상담이 아니라, 서류·관할·기한을 직접 보고 진행 가능 범위와 다음 단계를 안내합니다. 상속등기와 상속포기·한정승인처럼 순서가 갈리는 사건, 부동산 매매·증여·근저당 말소, 법인 설립·임원·본점 변경, 개인회생·파산 등 법무사가 수행할 수 있는 업무를 중심으로 상담합니다. 소송대리처럼 범위를 넓혀 단정하지 않으며, 비용은 정액으로 미리 약속하기보다 보수와 공과금을 구분해 설명합니다.`,
    ],
  },
  {
    id: "office-visit-flow",
    title: "방문·원격 상담은 이렇게 진행됩니다",
    paragraphs: [
      `방문 상담은 ${officeLocation.visitNoticeDetail} 예약 없이 바로 방문하시면 다른 상담과 겹칠 수 있어, 시간을 맞춘 뒤 오시는 편이 안전합니다. 예약은 전화·카카오톡·네이버 톡톡 중 편한 채널로 요청해 주시면 됩니다. 평일 운영시간은 ${officeHours.weekday}이며, 점심(${officeHours.lunch})과 ${officeHours.closed}은 휴무입니다.`,
      "원격으로 먼저 확인하고 싶은 경우에는 등기부·가족관계증명서·정관·계약서·채무 통지 등 이미 가진 자료를 사진이나 파일로 보내 주셔도 됩니다. 개요를 본 뒤 방문이 필요한 단계(인감·서명 원본·본인확인 등)와 우편·대리로 맞출 수 있는 단계를 구분해 안내합니다. ‘서류 없이 전화 한 통으로 완료’처럼 과장하지 않으며, 원본이 꼭 필요한 시점은 수임 전에 말씀드립니다.",
      "상담에서는 업무명보다 ‘지금 놓치면 안 되는 기한’과 ‘확인된 사실’을 먼저 맞춥니다. 예를 들어 상속은 승인·포기·한정승인의 기한, 법인 임원변경은 등기 기한, 매매는 잔금·말소·취득세 순서가 겹칠 수 있습니다. 준비서류가 모두 없어도 주소·사망일·변경하려는 내용만 알려주셔도 1차 방향을 잡을 수 있습니다.",
    ],
  },
  {
    id: "office-prepare",
    title: "방문·문의 전에 준비하면 좋은 것",
    paragraphs: [
      "모든 서류를 처음부터 완벽하게 갖출 필요는 없습니다. 다만 아래 항목이 있으면 상담이 빨라집니다. 상속이면 사망일(또는 안 날)·상속인 관계·부동산 주소·알고 있는 채무, 부동산등기이면 등기사항증명서·계약서·근저당·임대차 여부, 법인등기이면 등기사항전부증명서·정관·바꾸려는 항목, 개인회생이면 월소득·채무 총액·부양가족 개요입니다.",
      "자료를 보내실 때는 개인정보가 포함된 사진을 안전한 채널로 전달해 주시고, 상담 목적(비용 확인·절차 확인·방문 예약)을 한 줄로 적어 주시면 필요한 안내부터 드립니다. 견적은 사건 내용을 본 뒤 안내하며, 처음 보이는 금액만 낮게 제시하지 않고 포함 범위를 함께 설명합니다.",
    ],
  },
  {
    id: "office-access",
    title: "위치·교통·주차",
    paragraphs: [
      `사무소 주소는 ${officeLocation.fullAddress}입니다. ${officeLocation.subway} 거리에 있으며, ${officeLocation.parking}합니다. 건물·호실(${officeLocation.room}) 안내는 예약 확정 시 다시 안내해 드리며, 네이버 플레이스에서도 위치를 확인할 수 있습니다.`,
      "주차·엘리베이터·입구 동선은 오시는 길 페이지의 지도·이미지에서 더 자세히 보실 수 있습니다. 대중교통으로 오실 때와 자차로 오실 때 모두, 예약 시간에 맞춰 여유 있게 도착해 주시면 상담 시간을 온전히 쓸 수 있습니다.",
    ],
  },
  {
    id: "office-trust",
    title: "상담에서 지키는 원칙",
    paragraphs: [
      "다옴법무사사무소는 결과를 보장하는 문구로 신뢰를 만들지 않습니다. 대신 사실관계·서류·관할을 기준으로 가능한 절차와 불가능한 범위를 구분하고, 진행 중에는 접수·보정·완료처럼 단계별 상황을 공유합니다. 법무사 보수와 세금·등기수수료·증명서·우편 등 공과금은 항목을 나눠 설명합니다.",
      `${lawyerProfileMeta.fullTitle}의 자격·강의·공공·기업 협업 이력은 소개 페이지에 모아 두었습니다. 사무소 페이지에서는 ‘어디서, 어떻게 연락하고, 무엇을 준비하면 되는지’에 집중합니다. 업무명을 정확히 모르셔도 현재 상황만 남겨 주시면 됩니다.`,
    ],
  },
];

export const officePrepareItems: string[] = [
  "상담 목적(절차 확인·비용 확인·방문 예약)",
  "관련 주소(부동산·본점·피상속인 최후주소 등)",
  "알고 있는 기한·잔금일·결의일",
  "등기부·가족관계·정관·계약서 중 보유 자료(사진 가능)",
  "연락 가능한 시간대",
];

export const officeServiceLinks: { href: string; label: string; hint: string }[] =
  [
    {
      href: "/부산상속법무사",
      label: "상속 업무",
      hint: "등기·포기·한정승인 중 무엇부터 볼지",
    },
    {
      href: "/부산부동산등기",
      label: "부동산등기",
      hint: "매매·증여·말소 등 원인별 안내",
    },
    {
      href: "/부산법인등기",
      label: "법인등기",
      hint: "설립·임원·본점·목적 변경",
    },
    {
      href: "/부산개인회생법무사",
      label: "개인회생",
      hint: "소득·채무·재산으로 신청 전 확인",
    },
    { href: "/services", label: "전체 업무안내", hint: "업무 목록과 절차 개요" },
    { href: "/about", label: "안윤정 법무사 소개", hint: "자격·이력·활동" },
  ];

export const officeFaqs: { question: string; answer: string }[] = [
  {
    question: "사무소 방문은 예약이 필요한가요?",
    answer:
      "네. 사전 예약 후 방문해 주세요. 전화·카카오톡·네이버 톡톡으로 예약하실 수 있습니다.",
  },
  {
    question: "운영시간과 휴무일은 어떻게 되나요?",
    answer: `${officeHours.weekday} 운영하며, 점심은 ${officeHours.lunch}입니다. ${officeHours.closed}은 휴무입니다.`,
  },
  {
    question: "방문하지 않고도 상담할 수 있나요?",
    answer:
      "가능합니다. 서류 사진·파일로 개요를 먼저 확인할 수 있습니다. 다만 원본·본인확인이 필요한 단계는 별도로 안내합니다.",
  },
  {
    question: "어디에 있나요?",
    answer: `${officeLocation.fullAddress}입니다. ${officeLocation.subway}, ${officeLocation.parking}합니다.`,
  },
  {
    question: "상담 전에 서류를 모두 준비해야 하나요?",
    answer:
      "아니요. 상황과 보유 자료만 있어도 1차 방향을 잡을 수 있습니다. 필요한 추가 서류는 상담에서 목록으로 안내합니다.",
  },
  {
    question: "오시는 길과 사무소 안내의 차이는 무엇인가요?",
    answer:
      "사무소 안내는 운영·상담 방식·준비사항 중심이고, 오시는 길은 지도·동선·주차 동선에 더 집중합니다.",
  },
];

/** 본문 순수 글자 수 점검용 (공백 제외) */
export function officePageBodyCharCount(): number {
  const parts = [
    officePageMeta.intro,
    ...officeProseSections.flatMap((s) => [s.title, ...s.paragraphs]),
    ...officePrepareItems,
    ...officeFaqs.flatMap((f) => [f.question, f.answer]),
    ...officeServiceLinks.map((l) => l.label + l.hint),
  ];
  return parts.join("").replace(/\s+/g, "").length;
}
