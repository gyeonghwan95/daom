/**
 * Phase1 Station Section — 역별 고유 콘텐츠
 * 역명만 바꾼 템플릿 금지. 가짜 “수요가 많다” 표현 금지.
 */
import type { BusanRailStation } from "@/data/geo/busan-rail-stations";

export type StationServiceLink = { href: string; label: string };

export type StationSectionContent = {
  stationId: string;
  heading: string;
  intro: string;
  localContext: string;
  nextStep: string;
  serviceLinks: StationServiceLink[];
  checklist?: string[];
  faq?: { question: string; answer: string };
};

export const stationSectionContents: Record<string, StationSectionContent> = {
  seomyeon: {
    stationId: "seomyeon",
    heading: "서면역에서 등기·법인 업무를 알아보는 경우",
    intro:
      "1호선·2호선이 만나는 서면역 인근에서 법무사 업무를 찾을 때는, 먼저 상가·오피스 매매인지 법인 변경인지부터 나누는 것이 좋습니다.",
    localContext:
      "서면역은 부산진구 부전동 생활권과 이어집니다. 이 페이지에서는 서면·부전·전포 일대에서 자주 이어지는 부동산·법인 등기 준비 순서를 안내합니다.",
    nextStep:
      "등기원인(매매·증여·임원변경 등)과 주소만 알려주셔도 관할·서류 목록을 먼저 정리할 수 있습니다.",
    serviceLinks: [
      { href: "/부산부동산등기", label: "부산 부동산등기 — 매매·이전 순서" },
      { href: "/부산법인법무사", label: "부산 법인 업무 — 설립·변경·해산" },
      { href: "/부산진구법무사", label: "부산진구 법무사 안내" },
    ],
    checklist: [
      "부동산이면 등기부·계약서·잔금일",
      "법인이면 등기사항전부증명서·정관·변경 일자",
    ],
    faq: {
      question: "서면역 인근 상가 매매도 상담할 수 있나요?",
      answer:
        "가능합니다. 소재지 관할 등기소와 말소·이전 순서를 먼저 확인합니다. 잔금일이 있으면 일정에 맞춰 서류 목록을 안내합니다.",
    },
  },
  yeonsan: {
    stationId: "yeonsan",
    heading: "연산역 생활권에서 상속·등기를 준비한다면",
    intro:
      "1호선·3호선 환승인 연산역 생활권에서는 아파트·다세대 상속과 법인 본점·임원 변경이 함께 문의되는 경우가 있습니다.",
    localContext:
      "연산동·거제동은 연제구에 속합니다. 상속인지 단순 명의이전인지, 채무 확인이 필요한지에 따라 다음 페이지가 달라집니다.",
    nextStep:
      "사망일·상속인 구성·부동산 주소만 있어도 등기·포기·한정승인 중 어디부터 볼지 가릴 수 있습니다.",
    serviceLinks: [
      { href: "/부산상속법무사", label: "부산 상속 — 등기·포기·한정 선택" },
      { href: "/연제구법무사", label: "연제구 법무사 안내" },
      { href: "/부산임원변경등기", label: "임원변경등기 기한·서류" },
    ],
    checklist: [
      "상속: 가족관계·등기부·확인된 채무",
      "법인: 결의일·임기·정관",
    ],
  },
  dongnae: {
    stationId: "dongnae",
    heading: "동래역 인근에서 법무사 업무를 문의할 때",
    intro:
      "1호선·4호선이 연결되는 동래역 인근에서 절차를 찾을 때는 관할 가정법원·등기소가 업무마다 다를 수 있어, 업무 종류를 먼저 확인하는 편이 안전합니다.",
    localContext:
      "동래구 생활권 안내는 동래역·구 단위 페이지로 나뉘어 있습니다. 이 섹션은 역 기준으로 첫 분기만 돕습니다.",
    nextStep:
      "부동산 소재지와 필요한 절차(상속·매매·법인)만 남겨 주시면 관할과 준비서류를 안내합니다.",
    serviceLinks: [
      { href: "/동래구법무사", label: "동래구 법무사 업무 안내" },
      { href: "/부산상속등기", label: "부산 상속등기 서류·순서" },
      { href: "/부산한정승인", label: "한정승인 — 채무가 불확실할 때" },
    ],
  },
  "busan-station": {
    stationId: "busan-station",
    heading: "부산역 인근에서 법무사 업무를 찾는 경우",
    intro:
      "도시철도 1호선 부산역 인근(초량 생활권)에서 등기·서류를 알아볼 때는, ‘부산’이라는 도시명과 역명을 구분하고 실제 부동산·법인 소재지를 기준으로 관할을 확인합니다.",
    localContext:
      "부산역 일대는 동구 초량동과 이어집니다. 타 지역 부동산이어도 상담·서류 준비는 가능하며, 접수 관할은 소재지에 따릅니다.",
    nextStep:
      "계약서·등기부 사진만 보내주셔도 이전·말소 순서와 방문 필요 여부를 먼저 안내합니다.",
    serviceLinks: [
      { href: "/부산소유권이전등기", label: "소유권이전등기 — 원인별 안내" },
      { href: "/부산법무사", label: "부산 법무사 — 업무별 첫 안내" },
      { href: "/부산법무사비대면상담", label: "비대면 상담·서류 전달" },
    ],
    faq: {
      question: "부산역 근처가 아니어도 상담할 수 있나요?",
      answer:
        "가능합니다. 상담·서류 준비 장소와 등기·법원 관할은 별개입니다. 소재지와 업무만 알려주시면 됩니다.",
    },
  },
  suyeong: {
    stationId: "suyeong",
    heading: "수영역에서 부동산·상속 절차를 확인할 때",
    intro:
      "2호선·3호선 환승인 수영역 생활권에서 법무사 업무를 찾을 때는 광안·민락·망미 등 수영구 안에서도 등기 원인이 달라질 수 있습니다.",
    localContext:
      "수영구 대표 안내와 광안리 등 동네 안내가 나뉘어 있습니다. 수영역 기준으로는 먼저 매매·전세·상속 중 무엇을 준비하는지 고르면 됩니다.",
    nextStep:
      "부동산 주소와 계약 종류만 있으면 필요 서류와 관할 등기소 확인 항목을 안내합니다.",
    serviceLinks: [
      { href: "/수영구부동산등기", label: "수영구 부동산등기" },
      { href: "/부산전세보증금반환법무사", label: "전세보증금 반환 안내" },
      { href: "/광안리법무사", label: "광안리 생활권 안내" },
    ],
  },
  "centum-city": {
    stationId: "centum-city",
    heading: "센텀시티역에서 법인·등기 상담을 준비하는 경우",
    intro:
      "2호선 센텀시티역 인근에서 회사 설립·임원변경·본점 정리를 알아볼 때는 정관·등기부와 변경 일자를 먼저 맞춰 보는 것이 좋습니다.",
    localContext:
      "다옴법무사사무소는 해운대구 센텀동로 인근에 있습니다. 방문은 예약 후 이용하시고, 서류 사진으로 1차 확인도 가능합니다.",
    nextStep:
      "변경하려는 항목(임원·본점·목적·설립)과 등기부 보유 여부만 남겨 주세요.",
    serviceLinks: [
      { href: "/부산법인법무사", label: "부산 법인 업무 전체 안내" },
      { href: "/센텀법인설립등기", label: "센텀 법인설립 준비" },
      { href: "/office", label: "사무소·방문 안내" },
    ],
    checklist: [
      "등기사항전부증명서",
      "정관",
      "변경 사유·일자",
    ],
  },
  haeundae: {
    stationId: "haeundae",
    heading: "해운대역 생활권에서 필요한 등기 절차",
    intro:
      "2호선 해운대역 인근에서 법무사 업무를 찾을 때는 주거·상가 매매와 상속 명의이전이 자주 겹칩니다. 원인부터 나누면 서류가 정리됩니다.",
    localContext:
      "해운대구 안내는 구 단위·센텀·재송·좌동 등으로 나뉩니다. 해운대역 기준으로는 우동 생활권 업무를 먼저 확인하면 됩니다.",
    nextStep:
      "매매인지 상속인지, 부동산 주소만 알려주셔도 다음 안내로 연결합니다.",
    serviceLinks: [
      { href: "/해운대구상속등기", label: "해운대구 상속등기" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
      { href: "/센텀법무사", label: "센텀 생활권 안내" },
    ],
  },
  jangsan: {
    stationId: "jangsan",
    heading: "장산역·좌동에서 등기를 준비할 때",
    intro:
      "2호선 종점인 장산역은 좌동 생활권과 이어집니다. 이 구간에서 명의이전·상속을 준비하면 등기부와 가족관계를 먼저 확인하는 편이 안전합니다.",
    localContext:
      "장산역 전용 허브 대신 좌동 법무사 안내에서 생활권 절차를 다룹니다. 해운대구 전체 안내는 구 페이지에서 이어집니다.",
    nextStep:
      "좌동·송정 쪽 주소와 등기 원인만 남겨 주시면 서류 목록을 안내합니다.",
    serviceLinks: [
      { href: "/좌동법무사", label: "좌동·장산 생활권" },
      { href: "/해운대법무사", label: "해운대 법무사 안내" },
      { href: "/부산상속등기", label: "상속등기 서류·순서" },
      { href: "/부산소유권이전등기", label: "소유권이전등기" },
    ],
  },
  sasang: {
    stationId: "sasang",
    heading: "사상역에서 상속·등기 절차를 확인할 때",
    intro:
      "2호선과 부산김해경전철이 만나는 사상역 인근에서 절차를 찾을 때는 사상구 소재 부동산·법인인지부터 확인합니다.",
    localContext:
      "사상·엄궁·감전·주례 생활권은 사상구·동네 안내로 이어집니다. 환승 이용자라도 관할은 소재지 기준입니다.",
    nextStep:
      "부동산·본점 주소와 필요한 절차만 알려주시면 관할·서류를 정리합니다.",
    serviceLinks: [
      { href: "/사상구법무사", label: "사상구 법무사 안내" },
      { href: "/부산상속법무사", label: "상속 절차 선택" },
      { href: "/부산법인등기", label: "법인등기 — 임원·본점·목적" },
    ],
  },
  gyodae: {
    stationId: "gyodae",
    heading: "교대역·거제동에서 업무를 고를 때",
    intro:
      "1호선 교대역(동해선 환승) 인근 거제동에서 법무사 업무를 찾을 때는 연제구 관할과 거제·연산 생활권을 함께 봅니다.",
    localContext:
      "교대 전용 URL을 새로 만들지 않고, 거제동·연제구 기존 안내에서 절차를 연결합니다.",
    nextStep:
      "상속·법인·매매 중 해당하는 것과 주소를 남겨 주세요.",
    serviceLinks: [
      { href: "/연제구법무사", label: "연제구 법무사 안내" },
      { href: "/연산동법무사", label: "연산동 생활권 안내" },
      { href: "/부산상속포기", label: "상속포기 — 기한·후순위" },
    ],
  },
  jaesong: {
    stationId: "jaesong",
    heading: "재송역 생활권에서 서류·상담을 준비하는 경우",
    intro:
      "동해선 재송역 인근 재송동에서 등기를 준비할 때는 방문 전 서류 사진으로 개요를 맞출 수 있는지부터 확인하는 것이 효율적입니다.",
    localContext:
      "재송동은 센텀·해운대 생활권과 가깝습니다. 원본·인감이 필요한 단계는 별도로 안내하며, ‘완전 비대면’으로 단정하지 않습니다.",
    nextStep:
      "등기부·계약서·가족관계 중 가진 자료를 보내주시면 방문 필요 여부를 구분합니다.",
    serviceLinks: [
      { href: "/부산법무사비대면상담", label: "비대면으로 가능한 범위" },
      { href: "/센텀법무사", label: "센텀 생활권·법인 안내" },
      { href: "/부산상속등기", label: "상속등기 준비" },
    ],
    checklist: [
      "보유 서류 사진",
      "방문 가능 요일",
      "급한 기한(잔금·3개월 등)",
    ],
  },
  bexco: {
    stationId: "bexco",
    heading: "벡스코역 인근에서 법인·상담 일정을 잡을 때",
    intro:
      "2호선·동해선이 연결되는 벡스코역 인근에서 회사 등기나 상담 일정을 볼 때는 센텀 생활권 안내를 기준으로 준비하면 됩니다.",
    localContext:
      "벡스코·센텀시티역은 같은 센텀 허브에서 다룹니다. 전시장·오피스 일정과 등기 기한이 겹치면 우선순위를 표시해 드립니다.",
    nextStep:
      "법인 변경 항목이나 상담 희망 시간을 남겨 주세요.",
    serviceLinks: [
      { href: "/부산법인법무사", label: "법인 업무 선택" },
      { href: "/office", label: "사무소 위치·예약" },
      { href: "/부산법무사상담", label: "상담 전 준비서류" },
    ],
  },
  gwangan: {
    stationId: "gwangan",
    heading: "광안역 인근 부동산·전세 관련 절차",
    intro:
      "2호선 광안역 인근에서 매매·전세·임대차 관련 등기를 준비할 때는 계약 내용과 등기부 을구를 함께 보는 것이 좋습니다.",
    localContext:
      "광안·광안리 생활권 안내는 광안리 법무사 페이지에서 이어집니다. 수영구 전체 안내는 구 페이지를 참고하세요.",
    nextStep:
      "계약서 종류와 부동산 주소만 있어도 1차 서류 목록을 안내합니다.",
    serviceLinks: [
      { href: "/수영구부동산등기", label: "수영구 부동산등기" },
      { href: "/부산전세권설정등기", label: "전세권·임차 관련 등기 안내" },
      { href: "/수영구법무사", label: "수영구 법무사" },
    ],
  },
  jeonpo: {
    stationId: "jeonpo",
    heading: "전포역 생활권에서 상가·오피스 등기를 볼 때",
    intro:
      "2호선 전포역 인근 상가·오피스 이전등기를 준비할 때는 잔금일·근저당 말소·취득세 순서를 같은 달력에 올려 두는 것이 안전합니다.",
    localContext:
      "전포동은 부산진구·서면 생활권과 맞닿아 있습니다. 구 단위 안내는 부산진구 페이지에서 확인할 수 있습니다.",
    nextStep:
      "잔금일과 등기부 을구 여부만 알려주셔도 순서를 정리합니다.",
    serviceLinks: [
      { href: "/부산진구법무사", label: "부산진구 법무사" },
      { href: "/서면법무사", label: "서면 생활권 안내" },
      { href: "/부산소유권이전등기", label: "소유권이전등기" },
    ],
  },
  nampo: {
    stationId: "nampo",
    heading: "남포역 인근에서 중구 등기 업무를 확인할 때",
    intro:
      "1호선 남포역 인근에서 법무사 업무를 찾을 때는 중구 소재 부동산·사업장인지, 다른 구 사건을 상담만 하는지를 구분해 안내합니다.",
    localContext:
      "중구 안내는 구 단위 페이지에서 다룹니다. 남포·자갈치·중앙은 같은 허브에 역 섹션으로만 구분합니다.",
    nextStep:
      "소재지와 업무 종류를 남겨 주시면 관할·서류를 안내합니다.",
    serviceLinks: [
      { href: "/중구법무사", label: "중구 법무사 안내" },
      { href: "/부산법무사", label: "부산 업무별 첫 안내" },
      { href: "/부산부동산등기", label: "부동산등기" },
    ],
  },
  jagalchi: {
    stationId: "jagalchi",
    heading: "자갈치역 인근 상가·주택 등기 확인",
    intro:
      "1호선 자갈치역 인근에서 상가·주택 등기를 준비할 때는 계약 원인과 공유자·담보 여부를 먼저 확인합니다.",
    localContext:
      "자갈치·남포는 중구 허브의 세부 역 섹션입니다. 법률 절차 본문은 업무 페이지에서 동일하게 안내합니다.",
    nextStep:
      "등기부 갑·을구와 계약서만 있어도 누락 서류를 가늠할 수 있습니다.",
    serviceLinks: [
      { href: "/부산소유권이전등기", label: "소유권이전등기" },
      { href: "/부산근저당말소등기", label: "근저당 말소 안내" },
    ],
  },
  minam: {
    stationId: "minam",
    heading: "미남역에서 동래·연제 접근 업무를 볼 때",
    intro:
      "3호선·4호선 환승인 미남역 인근에서 절차를 찾을 때는 동래구·인접 생활권 중 실제 소재지를 기준으로 관할을 확인합니다.",
    localContext:
      "미남역 자체 URL을 늘리지 않고 동래구 안내에 역 섹션으로 둡니다.",
    nextStep:
      "주소와 업무(상속·매매·법인)만 알려주세요.",
    serviceLinks: [
      { href: "/동래구법무사", label: "동래구 법무사" },
      { href: "/부산상속법무사", label: "상속 절차 선택" },
      { href: "/동래역법무사", label: "동래역 생활권 안내" },
    ],
  },
  "city-hall": {
    stationId: "city-hall",
    heading: "시청역 인근에서 연제구 업무를 확인할 때",
    intro:
      "1호선 시청역 인근에서 법무사 업무를 찾을 때는 연제구 소재 사건인지, 법원·등기국 방문과 연결된 서류인지부터 나눕니다.",
    localContext:
      "부산지방법원·등기국은 연제구에 있습니다. 상담 장소와 접수 관할은 다를 수 있습니다.",
    nextStep:
      "접수하려는 기관(등기소·가정법원 등)과 서류 종류를 알려주시면 됩니다.",
    serviceLinks: [
      { href: "/연제구법무사", label: "연제구 법무사" },
      { href: "/부산법무사서류준비", label: "서류 준비 체크리스트" },
      { href: "/연산동법무사", label: "연산동 안내" },
    ],
  },
  bujeon: {
    stationId: "bujeon",
    heading: "부전역 인근에서 부산진구 등기를 볼 때",
    intro:
      "1호선·동해선이 연결되는 부전역 인근에서 등기를 준비할 때는 서면·부전 상가·주택의 등기원인부터 확인합니다.",
    localContext:
      "부전역은 부산진구 허브와 서면 안내로 연결합니다. 환승 이용과 상관없이 관할은 소재지 기준입니다.",
    nextStep:
      "매매·증여·법인 중 해당하는 절차와 주소를 남겨 주세요.",
    serviceLinks: [
      { href: "/부산진구법무사", label: "부산진구 법무사" },
      { href: "/서면법무사", label: "서면 생활권" },
      { href: "/부산법인등기", label: "법인등기" },
    ],
  },
  jungang: {
    stationId: "jungang",
    heading: "중앙역 인근 중구 업무 확인",
    intro:
      "1호선 중앙역 인근에서 절차를 찾을 때는 중구 내 소재 사건과 상담만 필요한 사건을 구분해 안내합니다.",
    localContext:
      "중앙·남포·자갈치는 중구 페이지의 역 섹션으로만 구분하고, 동일 법률 본문을 복제하지 않습니다.",
    nextStep:
      "업무 종류와 주소를 남겨 주시면 됩니다.",
    serviceLinks: [
      { href: "/중구법무사", label: "중구 법무사" },
      { href: "/부산법무사", label: "부산 업무 선택" },
    ],
  },
  dongbaek: {
    stationId: "dongbaek",
    heading: "동백역 인근 해운대 주거·상가 등기",
    intro:
      "2호선 동백역 인근에서 명의이전을 준비할 때는 해운대구 주소와 등기 원인을 기준으로 서류를 맞춥니다.",
    localContext:
      "동백역은 해운대 구 안내에 세부 섹션으로 둡니다. 센텀·장산과 문장을 공유하지 않습니다.",
    nextStep:
      "부동산 주소와 매매·상속 여부만 알려주세요.",
    serviceLinks: [
      { href: "/해운대법무사", label: "해운대 법무사" },
      { href: "/해운대구상속등기", label: "해운대구 상속등기" },
    ],
  },
  millak: {
    stationId: "millak",
    heading: "민락역·민락동에서 수영구 절차를 볼 때",
    intro:
      "2호선 민락역 인근에서 등기를 준비할 때는 민락동 소재인지, 광안·남천 등 인접동인지에 따라 생활권 안내만 달리하고 법률 절차는 업무 페이지에서 통일합니다.",
    localContext:
      "민락은 수영구의 Local Champion 페이지에서 역·동 검색을 함께 다룹니다. 전세·매매·상속 중 무엇을 준비하는지 먼저 고르면 됩니다.",
    nextStep:
      "계약 유형과 주소를 남겨 주세요.",
    serviceLinks: [
      { href: "/민락동법무사", label: "민락동 법무사" },
      { href: "/수영구부동산등기", label: "수영구 부동산등기" },
      { href: "/부산부동산등기", label: "부산 부동산등기" },
    ],
  },
  yangjeong: {
    stationId: "yangjeong",
    heading: "양정역·양정동에서 등기를 준비하는 경우",
    intro:
      "1·2호선 환승인 양정역 생활권에서는 주택·상가 매매등기와 상속 명의이전, 잔금·대출 연동 등기 문의가 이어집니다. ‘양정 법무’처럼 짧게 검색하셔도 같은 안내입니다.",
    localContext:
      "양정동 법무사 안내가 역·동 Cluster의 Primary Host입니다. 서면·개금·연지와 인접하므로 소재지 행정동을 기준으로 관할을 확인합니다.",
    nextStep:
      "부동산 주소와 매매·상속·법인 중 해당하는 것을 알려주세요.",
    serviceLinks: [
      { href: "/양정동법무사", label: "양정동 법무사" },
      { href: "/부산진구부동산등기", label: "부산진구 부동산등기" },
      { href: "/부산잔금대출근저당", label: "잔금·대출 등기 연동" },
    ],
    checklist: [
      "등기부·계약서·잔금일",
      "대출·말소 필요 여부",
    ],
    faq: {
      question: "양정역과 양정동 안내가 다른 페이지인가요?",
      answer:
        "같은 생활권 Cluster입니다. 역 이름으로 검색하셔도 양정동 안내와 연결되는 업무 페이지를 보시면 됩니다.",
    },
  },
};

export function getStationSectionContent(
  stationId: string,
): StationSectionContent | undefined {
  return stationSectionContents[stationId];
}

export function buildStationSectionBody(
  station: BusanRailStation,
  content: StationSectionContent,
): string {
  const lines = [
    content.intro,
    content.localContext,
    `노선: ${station.lines.join("·")}${station.transfer ? " (환승)" : ""}${station.district ? ` · 행정구역: ${station.district}` : ""}.`,
    content.nextStep,
  ];
  return lines.join("\n\n");
}
