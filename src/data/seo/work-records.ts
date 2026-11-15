/**
 * 업무 페이지의 '실제로 진행한 업무 기록' 이미지(1:1, 1200×1200).
 *
 * 왜: 설명만 있는 업무 페이지보다, 사무소가 실제로 접수·수령한 서류 사진을 보여 주면
 * "이 법무사가 실제로 이 일을 하는구나"를 바로 알 수 있다(2026-11-15 요청).
 *
 * - 사진: 대표 법무사의 블로그 게시용 원본(바탕화면 포스팅용 폴더). 이름·주소·주민번호·접수번호 등
 *   개인정보는 원본 단계에서 이미 가려져 있고, 생성 뒤 1200px 결과물을 한 장씩 다시 확인했다.
 *   사무소 주소·전화번호가 그대로 보이는 사진, 집행관 등 제3자 이름이 보이는 사진은 쓰지 않았다.
 * - 글자: 기존 업무 이미지와 같은 렌더러(scripts/premium-thumbnails/render.mjs) — crop·톤·타이포만, AI 생성 없음.
 * - 문구는 사진에 실제로 보이는 서류만 말한다(예: 상속포기 심판문 사진을 한정승인 기록이라고 하지 않는다).
 * - 생성: node scripts/premium-thumbnails/work-records.mjs  → public/image/cards/work/<file>.jpg
 *   원본 사진 경로는 그 스크립트에만 둔다 — src/에 원본 파일명이 보이면 scripts/optimize-images.mjs가
 *   public/image 아래 같은 이름 사진을 '사용 중'으로 보고 WebP 파생본을 만들어 배포 파일 수가 늘어난다(2026-11-15 +104개).
 *   (/image/cards/ 아래 1:1 카드는 WebP 파생본을 만들지 않아 이미지 1장 = 배포 파일 1개. 파일 수 한도 20,000)
 */
export type WorkRecord = {
  /** public/image/cards/work/<file>.jpg */
  file: string;
  /** 이미지 속 제목(두 줄, \n) */
  title: string;
  /** 그림 아래 설명 — 어떤 서류인지 사실만 */
  caption: string;
};

export const WORK_RECORDS: Record<string, WorkRecord> = {
  inheritanceDone: {
    file: "상속등기-등기완료통지서",
    title: "상속등기\n완료 서류",
    caption: "상속등기를 마치고 받은 등기완료통지서",
  },
  inheritanceAgreement: {
    file: "상속등기-협의분할신청서",
    title: "협의분할\n상속등기 신청서",
    caption: "분할협의서와 함께 준비한 상속등기 신청서",
  },
  renunciation: {
    file: "상속포기-가정법원심판문",
    title: "상속포기\n가정법원 심판문",
    caption: "가정법원에서 받은 상속포기 사건 심판문",
  },
  gift: {
    file: "증여등기-신청서",
    title: "증여등기\n신청 서류",
    caption: "증여계약서로 작성한 증여등기 신청서",
  },
  saleDone: {
    file: "매매등기-등기완료통지서",
    title: "매매 소유권이전\n완료 서류",
    caption: "매매 소유권이전 뒤 받은 등기완료통지서",
  },
  mortgageSet: {
    file: "근저당설정-신청서",
    title: "근저당권\n설정등기 신청서",
    caption: "근저당권설정등기 신청서",
  },
  mortgageCancel: {
    file: "근저당말소-해지증서",
    title: "근저당권\n말소 해지증서",
    caption: "근저당 말소등기에 쓰는 근저당권자 해지증서",
  },
  jeonse: {
    file: "전세권설정-신청서",
    title: "전세권\n설정등기 신청서",
    caption: "전세권설정등기 신청서",
  },
  leaseOrder: {
    file: "임차권등기명령-신청서",
    title: "임차권등기명령\n신청서 작성",
    caption: "전자소송으로 작성 중인 임차권등기명령 신청서",
  },
  corpEstablish: {
    file: "법인설립-설립등기신청서",
    title: "주식회사\n설립등기 신청서",
    caption: "주식회사 설립등기 신청서",
  },
  corpOfficer: {
    file: "임원변경-변경등기신청서",
    title: "임원변경\n등기 신청서",
    caption: "주식회사 임원 변경등기 신청서",
  },
  corpRelocation: {
    file: "본점이전-등기신청서",
    title: "본점이전\n등기 신청서",
    caption: "주식회사 본점이전등기 신청서",
  },
  corpCapital: {
    file: "유상증자-변경등기신청서",
    title: "유상증자\n변경등기 신청서",
    caption: "신주 발행에 따른 변경등기 신청서",
  },
  corpPurpose: {
    file: "목적변경-변경등기신청서",
    title: "목적변경\n등기 신청서",
    caption: "주식회사 목적변경등기 신청서",
  },
  deposit: {
    file: "공탁-출급회수청구서",
    title: "공탁금\n출급·회수 청구서",
    caption: "공탁금 출급·회수 청구서",
  },
  commission: {
    file: "촉탁등기-접수서류",
    title: "촉탁등기\n접수 서류",
    caption: "한꺼번에 준비한 촉탁등기 서류 묶음",
  },
  subAgency: {
    file: "복대리-접수서류",
    title: "복대리\n등기 접수 서류",
    caption: "복대리로 접수한 등기 신청 서류",
  },
  ship: {
    // 선박 등기사항증명서 사진은 선박 이름·톤수·등기번호가 그대로 읽혀(의뢰인 재산 식별 가능) 가려진 신청서 사진을 쓴다
    file: "선박등기-신청서",
    title: "선박등기\n신청서",
    caption: "상속에 따른 선박 소유권이전등기 신청서",
  },
  specialAgent: {
    file: "특별대리인-선임심판문",
    title: "특별대리인\n선임 심판문",
    caption: "가정법원에서 받은 특별대리인 선임 심판문",
  },
  bankruptcy: {
    file: "파산면책-법원제출서류",
    title: "파산·면책\n법원 제출 서류",
    caption: "부산회생법원에 보내는 파산·면책 서류",
  },
  auction: {
    file: "경매낙찰-매각대금완납증명",
    title: "경매 낙찰\n매각대금 완납증명",
    caption: "낙찰 뒤 소유권이전에 쓰는 매각대금완납증명원",
  },
  nameChange: {
    file: "개명-법원결정서류",
    title: "개명허가\n법원 결정 서류",
    caption: "가정법원 개명허가 사건에서 받은 서류",
  },
};

export type WorkRecordKey = keyof typeof WORK_RECORDS;

/**
 * 경로 → 보여 줄 기록(최대 2장). 위에서부터 처음 맞는 규칙 하나만 쓴다.
 * 두 번째 사진은 같은 업무 갈래일 때만 붙인다(증여 페이지에 매매 서류처럼 주제가 어긋나는 조합은 쓰지 않는다).
 * 좁은 업무(상속포기·한정승인, 근저당 말소 등)를 넓은 업무(상속, 부동산등기)보다 먼저 둔다.
 * 한정승인은 실제 한정승인 서류 사진이 없어 같은 가정법원 상속 사건인 상속포기 심판문을 보여 주되,
 * 설명은 '상속포기 사건 심판문'이라고 사실대로 쓴다.
 */
const RULES: [RegExp, WorkRecordKey[]][] = [
  [/특별대리인/, ["specialAgent"]],
  [/상속포기|한정승인|inheritance-renunciation|qualified-acceptance/, ["renunciation", "inheritanceDone"]],
  [/개명/, ["nameChange"]],
  [/파산|면책|bankruptcy/, ["bankruptcy"]],
  [/공탁/, ["deposit"]],
  [/선박/, ["ship"]],
  [/촉탁|공공기관등기|보상등기|협의취득/, ["commission"]],
  [/복대리/, ["subAgency"]],
  [/경매|낙찰/, ["auction"]],
  [/임차권등기|전세보증금|보증금반환/, ["leaseOrder"]],
  [/전세권/, ["jeonse"]],
  [/근저당.*말소|말소.*근저당|근저당말소/, ["mortgageCancel", "mortgageSet"]],
  [/근저당|담보/, ["mortgageSet", "mortgageCancel"]],
  [/증여/, ["gift"]],
  [/상속|inheritance-registration/, ["inheritanceDone", "inheritanceAgreement"]],
  [/유상증자|증자/, ["corpCapital", "corpOfficer"]],
  [/목적변경|상호변경/, ["corpPurpose", "corpOfficer"]],
  [/본점이전/, ["corpRelocation", "corpOfficer"]],
  [/임원|대표이사|이사변경|중임|director-change/, ["corpOfficer", "corpRelocation"]],
  [/법인설립|회사설립|company-establishment/, ["corpEstablish", "corpOfficer"]],
  [/법인|corporate-registration/, ["corpEstablish", "corpOfficer"]],
  [/매매|소유권이전|ownership-transfer|잔금/, ["saleDone"]],
  // 부동산등기 전반(부산 등기 법무사·등기소 안내 등) — 가장 흔한 매매 이전과 근저당 설정 기록
  [/부동산등기|등기법무사|등기소|등기국|셀프등기|real-estate-registration/, ["saleDone", "mortgageSet"]],
];

/** 업무 페이지가 아닌 글·자료(블로그, FAQ, 용어, 언론·공지, 강의)에는 넣지 않는다 — 과하지 않게 */
const NOT_WORK_PAGE = /^\/(blog|faq|glossary|media|notices|공지사항|강의|lectures|resources)(\/|$)/;

export function getWorkRecords(path: string): WorkRecord[] {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    /* 그대로 */
  }
  if (NOT_WORK_PAGE.test(decoded)) return [];
  const rule = RULES.find(([re]) => re.test(decoded));
  return rule ? rule[1].map((k) => WORK_RECORDS[k]) : [];
}

export const workRecordSrc = (file: string) => `/image/cards/work/${file}.jpg`;
