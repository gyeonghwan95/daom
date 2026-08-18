/**
 * 법무사 업무 키워드 사전.
 *
 * 단순 포함검색이 아니라 그룹별 가중치로 점수화한다.
 * - strong:  직접 수임 강한 키워드
 * - related: 잠재 수임 연관 키워드
 * - lecture: 강의 키워드
 * - collab:  복대리·협업 키워드
 * - exclude: 제외·감점 키워드 (매칭돼도 즉시 삭제하지 않고 감점·표시만 한다)
 *
 * weight: 관련성 원점수 기여치. 카테고리 힌트는 분류 판단에 사용한다.
 */

import type { OpportunityCategory } from "../src/types";

export type KeywordEntry = {
  term: string;
  weight: number;
  category?: OpportunityCategory;
  subcategory?: string;
};

export const STRONG_KEYWORDS: KeywordEntry[] = [
  { term: "법무사 선정", weight: 20, category: "direct-bid" },
  { term: "법무사 선임", weight: 20, category: "direct-bid" },
  { term: "법무사 용역", weight: 20, category: "direct-bid" },
  { term: "법무사", weight: 18, category: "direct-bid" },
  { term: "등기업무", weight: 16, category: "registration" },
  { term: "등기대행", weight: 16, category: "registration" },
  { term: "등기용역", weight: 16, category: "registration" },
  { term: "집단등기", weight: 16, category: "registration", subcategory: "집단등기" },
  { term: "입주등기", weight: 16, category: "registration", subcategory: "집단등기" },
  { term: "소유권이전등기", weight: 15, category: "registration", subcategory: "이전등기" },
  { term: "소유권보존등기", weight: 15, category: "registration", subcategory: "보존등기" },
  { term: "보존등기", weight: 14, category: "registration", subcategory: "보존등기" },
  { term: "법인등기", weight: 15, category: "corporate", subcategory: "법인등기" },
  { term: "신탁등기", weight: 15, category: "trust", subcategory: "신탁등기" },
  { term: "촉탁등기", weight: 15, category: "registration", subcategory: "촉탁등기" },
  { term: "근저당 설정", weight: 14, category: "registration", subcategory: "담보등기" },
  { term: "근저당권 설정", weight: 14, category: "registration", subcategory: "담보등기" },
  { term: "근저당 말소", weight: 14, category: "registration", subcategory: "말소등기" },
  { term: "근저당권 말소", weight: 14, category: "registration", subcategory: "말소등기" },
  { term: "말소등기", weight: 14, category: "registration", subcategory: "말소등기" },
  { term: "등기 접수", weight: 13, category: "registration" },
  { term: "등기신청", weight: 13, category: "registration" },
  { term: "등기 신청", weight: 13, category: "registration" },
  { term: "등기서류", weight: 13, category: "registration" },
  { term: "대지권등기", weight: 14, category: "registration", subcategory: "대지권등기" },
  { term: "공탁", weight: 12, category: "debt-court-document", subcategory: "공탁" },
  { term: "지급명령", weight: 12, category: "debt-court-document", subcategory: "지급명령" },
  { term: "상속등기", weight: 16, category: "registration", subcategory: "상속등기" },
  { term: "상속포기", weight: 16, category: "registration", subcategory: "상속포기" },
  { term: "한정승인", weight: 16, category: "registration", subcategory: "한정승인" },
  { term: "법인설립", weight: 15, category: "corporate", subcategory: "법인설립" },
  { term: "법인 설립", weight: 15, category: "corporate", subcategory: "법인설립" },
  { term: "임원변경", weight: 15, category: "corporate", subcategory: "임원변경" },
  { term: "임원 변경", weight: 15, category: "corporate", subcategory: "임원변경" },
  { term: "본점이전", weight: 14, category: "corporate", subcategory: "본점이전" },
  { term: "본점 이전", weight: 14, category: "corporate", subcategory: "본점이전" },
  { term: "목적변경", weight: 13, category: "corporate", subcategory: "목적변경" },
  { term: "상호변경", weight: 13, category: "corporate", subcategory: "상호변경" },
  { term: "증자등기", weight: 14, category: "corporate", subcategory: "증자" },
  { term: "감자등기", weight: 14, category: "corporate", subcategory: "감자" },
  { term: "해산등기", weight: 14, category: "corporate", subcategory: "청산" },
  { term: "청산등기", weight: 14, category: "corporate", subcategory: "청산" },
  { term: "개인회생", weight: 16, category: "debt-court-document", subcategory: "개인회생" },
  { term: "개인파산", weight: 15, category: "debt-court-document", subcategory: "개인파산" },
  { term: "회생신청", weight: 14, category: "debt-court-document", subcategory: "개인회생" },
  { term: "가압류", weight: 14, category: "debt-court-document", subcategory: "가압류" },
  { term: "가처분", weight: 14, category: "debt-court-document", subcategory: "가처분" },
  { term: "내용증명", weight: 12, category: "debt-court-document", subcategory: "내용증명" },
  { term: "임차권등기", weight: 15, category: "registration", subcategory: "임대차등기" },
  { term: "임차권등기명령", weight: 16, category: "registration", subcategory: "임대차등기" },
  { term: "전세권설정", weight: 14, category: "registration", subcategory: "전세권" },
  { term: "전세권 설정", weight: 14, category: "registration", subcategory: "전세권" },
  { term: "성년후견", weight: 14, category: "debt-court-document", subcategory: "후견" },
  { term: "임의후견", weight: 13, category: "debt-court-document", subcategory: "후견" },
  { term: "집행문", weight: 12, category: "debt-court-document", subcategory: "강제집행" },
  { term: "강제집행", weight: 12, category: "debt-court-document", subcategory: "강제집행" },
];

export const RELATED_KEYWORDS: KeywordEntry[] = [
  { term: "공동주택 입주", weight: 8, category: "registration", subcategory: "집단등기" },
  { term: "신축아파트", weight: 8, category: "registration", subcategory: "집단등기" },
  { term: "신축 아파트", weight: 8, category: "registration", subcategory: "집단등기" },
  { term: "오피스텔 준공", weight: 8, category: "registration", subcategory: "보존등기" },
  { term: "사용승인", weight: 6, category: "registration", subcategory: "보존등기" },
  { term: "소유권 보존", weight: 9, category: "registration", subcategory: "보존등기" },
  { term: "소유권 이전", weight: 9, category: "registration", subcategory: "이전등기" },
  { term: "집단대출", weight: 7, category: "registration", subcategory: "집단등기" },
  { term: "잔금대출", weight: 6, category: "registration" },
  { term: "분양계약", weight: 5, category: "real-estate" },
  { term: "토지보상", weight: 8, category: "registration", subcategory: "보상등기" },
  { term: "수용재결", weight: 8, category: "registration", subcategory: "보상등기" },
  { term: "공유재산 매각", weight: 8, category: "real-estate", subcategory: "공유재산" },
  { term: "공유재산", weight: 6, category: "real-estate", subcategory: "공유재산" },
  { term: "국유재산 매각", weight: 8, category: "real-estate", subcategory: "국유재산" },
  { term: "국유재산", weight: 6, category: "real-estate", subcategory: "국유재산" },
  { term: "산업단지 분양", weight: 6, category: "real-estate" },
  { term: "택지개발", weight: 6, category: "real-estate" },
  { term: "도시개발", weight: 5, category: "real-estate" },
  { term: "재개발", weight: 6, category: "real-estate", subcategory: "정비사업" },
  { term: "재건축", weight: 6, category: "real-estate", subcategory: "정비사업" },
  { term: "도시정비", weight: 6, category: "real-estate", subcategory: "정비사업" },
  { term: "조합 청산", weight: 8, category: "corporate", subcategory: "청산" },
  { term: "법인 청산", weight: 8, category: "corporate", subcategory: "청산" },
  { term: "해산법인", weight: 8, category: "corporate", subcategory: "청산" },
  { term: "파산재단", weight: 8, category: "auction-public-sale", subcategory: "파산" },
  { term: "공매", weight: 6, category: "auction-public-sale" },
  { term: "경매", weight: 5, category: "auction-public-sale" },
  { term: "담보신탁", weight: 7, category: "trust" },
  { term: "관리신탁", weight: 7, category: "trust" },
  { term: "부동산 처분", weight: 6, category: "real-estate" },
  { term: "자산매각", weight: 5, category: "real-estate" },
  { term: "채권보전", weight: 8, category: "debt-court-document" },
  { term: "채권추심", weight: 7, category: "debt-court-document" },
  { term: "미수금", weight: 6, category: "debt-court-document" },
  { term: "권리보전", weight: 8, category: "registration" },
  { term: "권리정리", weight: 8, category: "registration" },
  { term: "미등기", weight: 8, category: "registration", subcategory: "보존등기" },
  { term: "공부정리", weight: 7, category: "registration" },
  // 공동주택 발주자 힌트 — 단독으로는 후보 임계값(8)을 넘지 않게 낮은 가중치.
  // 등기·법무사 키워드와 함께일 때만 가점 역할.
  { term: "아파트관리", weight: 3, category: "registration", subcategory: "공동주택" },
  { term: "관리사무소", weight: 3, category: "registration", subcategory: "공동주택" },
  { term: "입주자대표", weight: 5, category: "registration", subcategory: "공동주택" },
  { term: "입대의", weight: 4, category: "registration", subcategory: "공동주택" },
  { term: "관리단", weight: 4, category: "registration", subcategory: "집합건물" },
  { term: "상속재산", weight: 8, category: "registration", subcategory: "상속등기" },
  { term: "상속인", weight: 6, category: "registration", subcategory: "상속등기" },
  { term: "유언대용신탁", weight: 9, category: "trust", subcategory: "유언대용신탁" },
  { term: "사단법인", weight: 8, category: "corporate", subcategory: "비영리" },
  { term: "재단법인", weight: 8, category: "corporate", subcategory: "비영리" },
  { term: "비영리법인", weight: 8, category: "corporate", subcategory: "비영리" },
  { term: "조합등기", weight: 9, category: "corporate", subcategory: "조합" },
  { term: "집합건물", weight: 7, category: "registration", subcategory: "집합건물" },
  { term: "구분건물", weight: 7, category: "registration", subcategory: "집합건물" },
  { term: "가등기", weight: 8, category: "registration", subcategory: "가등기" },
  { term: "지상권", weight: 7, category: "registration", subcategory: "지상권" },
  { term: "권리분석", weight: 8, category: "auction-public-sale", subcategory: "경매" },
  { term: "강제경매", weight: 8, category: "auction-public-sale", subcategory: "경매" },
  { term: "인도명령", weight: 8, category: "debt-court-document", subcategory: "인도" },
  { term: "확정일자", weight: 8, category: "registration", subcategory: "임대차" },
  { term: "주택임대차", weight: 7, category: "registration", subcategory: "임대차" },
  { term: "법률상담", weight: 8, category: "collaboration" },
  { term: "서류작성", weight: 7, category: "collaboration" },
  { term: "채무조정", weight: 8, category: "debt-court-document", subcategory: "개인회생" },
  { term: "면책신청", weight: 8, category: "debt-court-document", subcategory: "개인파산" },
  { term: "보전처분", weight: 8, category: "debt-court-document" },
  { term: "공탁금", weight: 8, category: "debt-court-document", subcategory: "공탁" },
  { term: "보상금 공탁", weight: 10, category: "debt-court-document", subcategory: "공탁" },
  { term: "토지수용", weight: 8, category: "registration", subcategory: "보상등기" },
];

export const LECTURE_KEYWORDS: KeywordEntry[] = [
  { term: "법률강사", weight: 12, category: "lecture" },
  { term: "법률 강사", weight: 12, category: "lecture" },
  { term: "법률교육", weight: 12, category: "lecture" },
  { term: "법률 교육", weight: 12, category: "lecture" },
  { term: "생활법률", weight: 12, category: "lecture" },
  { term: "법률특강", weight: 12, category: "lecture" },
  { term: "법률 특강", weight: 12, category: "lecture" },
  { term: "전세사기", weight: 11, category: "lecture", subcategory: "전세사기예방" },
  { term: "임대차 교육", weight: 10, category: "lecture" },
  { term: "청년 법률", weight: 10, category: "lecture" },
  { term: "창업 법률", weight: 10, category: "lecture" },
  { term: "기업 법률교육", weight: 10, category: "lecture" },
  { term: "법조 진로", weight: 9, category: "lecture" },
  { term: "법무사 진로", weight: 10, category: "lecture" },
  { term: "외부강사", weight: 6, category: "lecture" },
  { term: "강사풀", weight: 6, category: "lecture" },
  { term: "강사 모집", weight: 6, category: "lecture" },
  { term: "전문가 위촉", weight: 5, category: "lecture" },
  { term: "자문위원", weight: 5, category: "lecture" },
  { term: "멘토 모집", weight: 4, category: "lecture" },
  { term: "시민강좌", weight: 9, category: "lecture" },
  { term: "평생학습", weight: 8, category: "lecture" },
  { term: "법률교실", weight: 11, category: "lecture" },
  { term: "찾아가는 법률", weight: 11, category: "lecture" },
  { term: "도서관 특강", weight: 9, category: "lecture" },
  { term: "청소년 법률", weight: 10, category: "lecture" },
  { term: "금융교육", weight: 6, category: "lecture" },
  { term: "무료법률상담", weight: 8, category: "lecture" },
];

export const COLLAB_KEYWORDS: KeywordEntry[] = [
  { term: "복대리", weight: 12, category: "collaboration", subcategory: "복대리" },
  { term: "접수대행", weight: 10, category: "collaboration" },
  { term: "등기소 접수", weight: 10, category: "collaboration" },
  { term: "보정대응", weight: 9, category: "collaboration" },
  { term: "부산지방법원", weight: 6, category: "collaboration", subcategory: "부산관할" },
  { term: "부산동부지원", weight: 6, category: "collaboration", subcategory: "부산관할" },
  { term: "부산서부지원", weight: 6, category: "collaboration", subcategory: "부산관할" },
  { term: "남부산등기소", weight: 7, category: "collaboration", subcategory: "부산관할" },
  { term: "북부산등기소", weight: 7, category: "collaboration", subcategory: "부산관할" },
  { term: "타지역 법무사", weight: 8, category: "collaboration" },
  { term: "협력 법무사", weight: 8, category: "collaboration" },
];

/**
 * 제외·감점 키워드.
 * 매칭 시 참가 불가 가능성을 표시하되 목록에서 즉시 삭제하지 않는다.
 * hardBlock: true → "참가자격 미충족 가능성 높음"(likely-ineligible) 후보.
 */
export type ExcludeEntry = {
  term: string;
  penalty: number;
  hardBlock?: boolean;
  reason: string;
};

export const EXCLUDE_KEYWORDS: ExcludeEntry[] = [
  { term: "변호사만", penalty: 20, hardBlock: true, reason: "변호사 자격 한정 가능성" },
  { term: "변호사 자격", penalty: 15, hardBlock: true, reason: "변호사 자격 요구 가능성" },
  { term: "법무법인만", penalty: 20, hardBlock: true, reason: "법무법인 한정 가능성" },
  { term: "법무법인에 한", penalty: 20, hardBlock: true, reason: "법무법인 한정 가능성" },
  { term: "공인회계사", penalty: 10, reason: "회계사 업무 중심 가능성" },
  { term: "세무사", penalty: 10, reason: "세무사 업무 중심 가능성" },
  { term: "노무사", penalty: 10, reason: "노무사 업무 중심 가능성" },
  { term: "특허법인", penalty: 12, reason: "특허 업무 중심 가능성" },
  { term: "감정평가", penalty: 8, reason: "감정평가 업무 중심 가능성" },
  { term: "건축사", penalty: 8, reason: "건축 업무 중심 가능성" },
  { term: "기술사", penalty: 8, reason: "기술용역 중심 가능성" },
  { term: "컨소시엄 필수", penalty: 12, reason: "컨소시엄 구성 요구" },
  { term: "공동수급 필수", penalty: 12, reason: "공동수급 구성 요구" },
  { term: "상근인력", penalty: 8, reason: "상근 인력 요건 확인 필요" },
  { term: "전국 지점", penalty: 12, reason: "전국 지점 요구 가능성" },
];

/**
 * 의미 기반 규칙 — 키워드 완전일치가 아니어도 업무 연관성을 포착한다.
 * 규칙 기반 점수화를 우선하며 LLM 분류는 선택 기능(Phase 2+)으로 둔다.
 */
export type SemanticRule = {
  id: string;
  pattern: RegExp;
  weight: number;
  category: OpportunityCategory;
  subcategory?: string;
  reason: string;
};

export const SEMANTIC_RULES: SemanticRule[] = [
  {
    id: "ownership-transfer-agency",
    pattern: /(소유권|공동주택|구분건물)[^\n]{0,30}(이전|보존)[^\n]{0,30}(업무|용역|수행|기관|대행)/,
    weight: 14,
    category: "registration",
    subcategory: "집단등기",
    reason: "법무사 미언급이어도 소유권 이전·보존 업무 수행기관 선정 → 집단등기 후보",
  },
  {
    id: "unregistered-preservation",
    pattern: /(미등기)[^\n]{0,30}(재산|건물|부동산|토지)[^\n]{0,40}(권리|정리|보전|조치)/,
    weight: 13,
    category: "registration",
    subcategory: "보존등기",
    reason: "미등기 재산 권리보전 → 보존등기·소유권 정리 후보",
  },
  {
    id: "dissolved-corp-realestate",
    pattern: /(해산|청산)[^\n]{0,20}(법인|조합)[^\n]{0,40}(부동산|재산|자산)/,
    weight: 13,
    category: "corporate",
    subcategory: "청산",
    reason: "해산·청산 법인 부동산 정리 → 법인 청산·부동산등기 후보",
  },
  {
    id: "completion-unit-rights",
    pattern: /(준공|사용승인)[^\n]{0,40}(구분건물|권리|등기|대지권)/,
    weight: 13,
    category: "registration",
    subcategory: "보존등기",
    reason: "준공에 따른 구분건물 권리정리 → 보존등기·대지권등기 후보",
  },
  {
    id: "compensation-registry",
    pattern: /(토지보상|수용|보상)[^\n]{0,40}(공부|등기|권리)/,
    weight: 13,
    category: "registration",
    subcategory: "보상등기",
    reason: "토지보상 관련 공부정리·등기업무 → 보상등기 후보",
  },
  {
    id: "life-law-education",
    pattern: /(외부전문가|전문가|강사)[^\n]{0,30}(생활법률|법률)[^\n]{0,20}(교육|강의|특강)/,
    weight: 11,
    category: "lecture",
    reason: "외부전문가 법률교육 → 강의 후보",
  },
  {
    id: "legal-affairs-support",
    pattern: /(법률|법무)[^\n]{0,20}(실무|사무)[^\n]{0,20}(지원|용역|대행)/,
    weight: 10,
    category: "collaboration",
    reason: "공공기관 법률실무 지원 용역 → 협업·수임 후보",
  },
  {
    id: "document-bulk",
    pattern: /(대량|일괄)[^\n]{0,20}(서류|문서)[^\n]{0,20}(발급|검토|접수)/,
    weight: 9,
    category: "collaboration",
    reason: "대량 서류 발급·검토·접수 → 법무사 실무 협업 후보",
  },
  {
    id: "personal-rehab",
    pattern: /(개인회생|개인파산|회생절차|파산신청)[^\n]{0,30}(상담|신청|지원|용역|대행|서류)/,
    weight: 14,
    category: "debt-court-document",
    subcategory: "개인회생",
    reason: "개인회생·파산 상담·신청 지원 → 법무사 서류·신청 후보",
  },
  {
    id: "corporate-registry-agency",
    pattern: /(법인)[^\n]{0,24}(설립|임원|본점|목적|상호|증자|감자|해산|청산)[^\n]{0,24}(등기|대행|용역)/,
    weight: 14,
    category: "corporate",
    reason: "법인 설립·변경·청산 등기 대행 → 법인등기 후보",
  },
  {
    id: "leasehold-registry",
    pattern: /(임차권등기|전세권설정|주택임대차)[^\n]{0,30}(등기|명령|용역|대행)/,
    weight: 13,
    category: "registration",
    subcategory: "임대차등기",
    reason: "임차권등기·전세권 관련 → 임대차 등기 후보",
  },
  {
    id: "inheritance-procedure",
    pattern: /(상속)[^\n]{0,20}(등기|포기|한정승인|재산분할|협의)[^\n]{0,24}(용역|대행|신청|지원|상담)/,
    weight: 14,
    category: "registration",
    subcategory: "상속등기",
    reason: "상속등기·포기·한정승인 절차 → 상속 업무 후보",
  },
  {
    id: "provisional-remedy",
    pattern: /(가압류|가처분|지급명령|강제집행|공탁)[^\n]{0,24}(신청|대행|용역|서류)/,
    weight: 13,
    category: "debt-court-document",
    reason: "보전처분·지급명령·공탁 서류 → 민사서류 후보",
  },
  {
    id: "legal-education-bid",
    pattern: /(생활법률|전세사기|임대차|상속|개인회생)[^\n]{0,24}(교육|강의|특강|강사|교실)/,
    weight: 12,
    category: "lecture",
    reason: "생활법률·전세사기 등 교육 공고 → 강의 후보",
  },
  {
    id: "guardianship",
    pattern: /(성년후견|임의후견|한정후견|특정후견)[^\n]{0,30}(선임|용역|지원|신청|상담)/,
    weight: 13,
    category: "debt-court-document",
    subcategory: "후견",
    reason: "후견 선임·신청 지원 → 후견 업무 후보",
  },
];

export const ALL_POSITIVE_KEYWORDS: KeywordEntry[] = [
  ...STRONG_KEYWORDS,
  ...RELATED_KEYWORDS,
  ...LECTURE_KEYWORDS,
  ...COLLAB_KEYWORDS,
];
