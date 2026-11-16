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
  /** 그림 아래 설명 — 어떤 서류·장면인지 사실만 */
  caption: string;
  /** document: 사무소가 작성·접수·수령한 서류 / field: 법무사가 기관을 찾은 현장 / office: 사무실에서 서류를 검토하는 모습 */
  kind?: "document" | "field" | "office";
};

/** 카드 아래 한 줄 — 사진 종류별로 사실만 */
export const WORK_RECORD_NOTE: Record<NonNullable<WorkRecord["kind"]>, string> = {
  document: "다옴법무사사무소가 진행한 사건의 실제 서류를 찍은 사진입니다. 의뢰인 정보는 가렸습니다.",
  field: "안윤정 법무사가 직접 법원·등기소·관공서를 찾아 업무를 보는 모습입니다.",
  office: "담당 법무사가 사무실에서 서류를 직접 검토하는 모습입니다.",
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
  // ── 2026-11-16 추가: 서류
  distribution: {
    file: "배당요구-신청서작성",
    title: "배당요구\n신청서 작성",
    caption: "채권계산서와 함께 작성한 배당요구신청서",
  },
  factInquiry: {
    file: "사실조회촉탁-신청서작성",
    title: "사실조회촉탁\n신청서 작성",
    caption: "전자소송으로 작성한 사실조회촉탁신청서",
  },
  registryObjection: {
    file: "등기이의신청-신청서",
    title: "등기 각하결정\n이의신청서",
    caption: "등기신청 각하결정에 대한 이의신청서",
  },
  seizure: {
    file: "채권압류추심명령-결정문",
    title: "채권압류·추심명령\n법원 결정문",
    caption: "법원에서 받은 채권압류 및 추심명령 결정문",
  },
  landSplit: {
    file: "토지분필-등기신청서",
    title: "토지 분필등기\n신청서",
    caption: "토지 분필등기 신청서",
  },
  demolition: {
    file: "건물멸실-등기신청서",
    title: "건물 멸실등기\n신청서",
    caption: "건물 멸실등기 신청서",
  },
  familyCert: {
    file: "가족관계-기본증명서",
    title: "가족관계 서류\n발급·확인",
    caption: "상속 업무에서 발급해 확인한 기본증명서(상세)",
  },
  // ── 2026-11-16 추가: 현장·사무실(법무사 본인)
  registryHQ: {
    file: "현장-부산지방법원등기국",
    title: "등기국\n직접 방문",
    caption: "부산지방법원 등기국을 찾은 안윤정 법무사",
    kind: "field",
  },
  registryCounter: {
    file: "현장-서부지원등기과",
    title: "등기과\n직접 접수",
    caption: "부산지방법원 서부지원 등기과를 찾은 안윤정 법무사",
    kind: "field",
  },
  courtCivil: {
    file: "현장-법원종합민원실",
    title: "법원 민원실\n서류 제출",
    caption: "부산지방법원 종합민원실·공탁 창구 앞의 안윤정 법무사",
    kind: "field",
  },
  courtExec: {
    file: "현장-민사집행과",
    title: "민사집행과\n직접 방문",
    caption: "부산지방법원 민사집행과를 찾은 안윤정 법무사",
    kind: "field",
  },
  taxCounter: {
    file: "현장-구청세무창구",
    title: "구청 세무 창구\n직접 방문",
    caption: "수영구청 민원 창구에서 업무를 보는 안윤정 법무사",
    kind: "field",
  },
  officeReview: {
    file: "사무실-서류직접검토",
    title: "담당 법무사가\n서류 직접 검토",
    caption: "다옴법무사사무소 로고 아래에서 서류를 검토하는 안윤정 법무사",
    kind: "office",
  },
  nameChange: {
    file: "개명-법원결정서류",
    title: "개명허가\n법원 결정 서류",
    caption: "가정법원 개명허가 사건에서 받은 서류",
  },
};

export type WorkRecordKey = keyof typeof WORK_RECORDS;

/**
 * 경로 → 보여 줄 기록(2장, 본문 중간 두 곳에 하나씩). 위에서부터 처음 맞는 규칙 하나만 쓴다.
 * 두 번째 사진은 같은 업무 갈래일 때만 붙인다(증여 페이지에 매매 서류처럼 주제가 어긋나는 조합은 쓰지 않는다).
 * 좁은 업무(상속포기·한정승인, 근저당 말소 등)를 넓은 업무(상속, 부동산등기)보다 먼저 둔다.
 * 한정승인은 실제 한정승인 서류 사진이 없어 같은 가정법원 상속 사건인 상속포기 심판문을 보여 주되,
 * 설명은 '상속포기 사건 심판문'이라고 사실대로 쓴다.
 */
const RULES: [RegExp, WorkRecordKey[]][] = [
  // ── 가정법원
  [/특별대리인/, ["specialAgent", "familyCert"]],
  [/상속포기|한정승인|단순승인|숙려기간|inheritance-renunciation|qualified-acceptance/, ["renunciation", "inheritanceDone"]],
  [/개명/, ["nameChange", "familyCert"]],
  [/후견|실종|가족관계|검인|유언|유증|부재자|가정법원/, ["familyCert", "specialAgent"]],
  // ── 채무·회생(회생법원 사진이 없어 파산·면책 제출 서류와 사무실 서류 검토 사진)
  [/파산|면책|회생|신용회복|bankruptcy|rehab|personal-rehabilitation|급여-압류|빚|보증채무/, ["bankruptcy", "officeReview"]],
  // ── 공탁·특수
  [/공탁/, ["deposit", "courtCivil"]],
  [/선박/, ["ship", "registryCounter"]],
  [/촉탁|공공기관|공기업|보상등기|협의취득|이전등기.*기관/, ["commission", "registryHQ"]],
  [/복대리|협업|원거리|타지역법무사|partners/, ["subAgency", "registryCounter"]],
  // ── 세금(국민주택채권의 '채권'이 아래 민사 규칙에 걸리지 않게 먼저)
  [/취득세|등록면허세|국민주택채권/, ["taxCounter", "saleDone"]],
  // ── 보전처분(가압류·가처분)은 집행보다 먼저 — '압류' 글자에 걸려 추심명령 결정문이 붙지 않게
  [/가압류(?!말소)|가처분(?!말소)/, ["courtCivil", "seizure"]],
  // ── 집행(말소등기는 아래 등기 갈래)
  [/경매|낙찰|공매/, ["auction", "distribution"]],
  [/배당/, ["distribution", "courtExec"]],
  [/(?<!말소)(?:압류|추심|강제집행|집행문|재산명시|재산조회|채무불이행|채권회수|채권관리|채무자-재산|판결-후)(?!말소)/, ["seizure", "courtExec"]],
  // ── 민사 서류
  [/지급명령|payment-order|내용증명|대여금|공사대금|계약금|손해배상|중고거래|채권/, ["courtCivil", "factInquiry"]],
  // 소송·소액: 법무사는 법원 제출 서류 작성까지만 한다 — 소송대리로 읽힐 사진(소송대리허가신청서·변론기일통지서)은 쓰지 않는다
  [/소액|소송|답변서|민사/, ["factInquiry", "courtCivil"]],
  // ── 임대차
  [/임차권|전세보증금|보증금반환|보증금|전세사기|확정일자|집주인|임대인|전입|임대차|jeonse/, ["leaseOrder", "jeonse"]],
  [/전세권/, ["jeonse", "registryCounter"]],
  // ── 담보
  [/근저당.*말소|말소.*근저당|근저당말소|mortgage-cancellation/, ["mortgageCancel", "mortgageSet"]],
  [/근저당|담보/, ["mortgageSet", "mortgageCancel"]],
  // ── 증여·상속
  [/증여/, ["gift", "registryCounter"]],
  [/상속|inheritance|사망|장례|고인|기여분|특별수익|유류분|재산채무|siblings/, ["inheritanceDone", "inheritanceAgreement"]],
  // ── 법인
  [/유상증자|무상증자|감자|증자|출자전환|가수금/, ["corpCapital", "corpOfficer"]],
  [/목적변경|상호변경/, ["corpPurpose", "corpOfficer"]],
  [/본점이전|본점-이전|head-office/, ["corpRelocation", "corpOfficer"]],
  [/임원|대표이사|이사변경|공동대표|중임|director-change|corporate-officer/, ["corpOfficer", "corpRelocation"]],
  [/법인|회사설립|company-establishment|corporate|협동조합|조합|재단|사단|스타트업|창업|해산|청산|지점|기업|건설사|시행사/, ["corpEstablish", "corpOfficer"]],
  // ── 건물·토지
  [/멸실|철거|소실/, ["demolition", "registryCounter"]],
  [/분필|건물분할|토지분할|합병등기/, ["landSplit", "registryCounter"]],
  [/보존|신축|사용승인|건물|건축|집합건물|오피스텔|상가|공장|창고|지식산업|대지권|분양|입주|재개발|재건축|집단등기|컨테이너|증축/, ["registryCounter", "registryHQ"]],
  // ── 등기 보정·이의
  [/보정|반려|각하|이의/, ["registryObjection", "registryCounter"]],
  // ── 소유권·변경 등기
  [/매매|소유권이전|ownership-transfer|real-estate-sale|잔금|매수인|명의|지분|공동명의|공유물|재산분할|신탁|가등기|지상권|환매|예고등기|등기권리증|표시변경|도로명|말소|실권리자/, ["saleDone", "registryCounter"]],
  // ── 등기 전반
  [/등기|real-estate|registration/, ["registryCounter", "saleDone"]],
  // ── 상담·비용·법무사 선택(사무소 이야기) — 담당 법무사가 직접 검토하는 모습과 완료 서류
  [/상담|비용|보수|수임료|법무사맡기면|방문|서류가없어도|무슨법률업무|전화가어려울때|사진전자파일|자가진단|tools|situations/, ["officeReview", "inheritanceDone"]],
];

/**
 * 위 규칙에 맞지 않는 페이지(구·동·역 이름의 지역 안내, 업무사례 지역 허브 등)는
 * 이 사무소가 가장 많이 맡는 상속등기·매매 이전의 완료 서류를 보여 준다.
 */
const GENERAL: WorkRecordKey[] = ["inheritanceDone", "saleDone"];

/** 업무 페이지가 아닌 글·자료(블로그, FAQ, 용어, 언론·공지, 강의)에는 넣지 않는다 — 과하지 않게 */
const NOT_WORK_PAGE = /^\/(blog|faq|glossary|media|notices|공지사항|강의|강의이력|lectures|resources)(\/|$)|강의|교육|특강|강사/;

export function getWorkRecords(path: string): WorkRecord[] {
  let decoded = path;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    /* 그대로 */
  }
  if (NOT_WORK_PAGE.test(decoded)) return [];
  const rule = RULES.find(([re]) => re.test(decoded));
  return (rule ? rule[1] : GENERAL).map((k) => WORK_RECORDS[k]);
}

export const workRecordSrc = (file: string) => `/image/cards/work/${file}.jpg`;
