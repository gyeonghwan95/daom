/**
 * 수도권·충청 원거리 의뢰 기준 업무별 원격 진행 범위.
 * 관할·원본·방문 위험의 세부 근거는 remoteServiceMatrix.ts(matrixRef)를 따르고,
 * 이 표는 지역 페이지를 만들지(metroAction)와 페이지에 써도 되는 문구만 정한다.
 */

export type RemoteLevel = "YES" | "CASE_DEPENDENT" | "NO";

/** EXPAND_NOW: 대표 지역 URL 개선 대상 · TEST: 기존 페이지 안에서만 안내 · HOLD: 근거 쌓일 때까지 보류 · DO_NOT_REGIONIZE: 지역 URL을 만들지 않음 */
export type MetroAction = "EXPAND_NOW" | "TEST" | "HOLD" | "DO_NOT_REGIONIZE";

export type RemoteServiceRow = {
  service: string;
  matrixRef?: string;
  initialConsultRemote: RemoteLevel;
  documentPrecheckRemote: RemoteLevel;
  originalDocumentsRequired: readonly string[];
  physicalVisitPossible: readonly string[];
  jurisdictionRule: string;
  finalCompletionRemote: RemoteLevel;
  safeMarketingCopy: string;
  metroAction: MetroAction;
  metroReason: string;
};

export const REMOTE_SERVICES: readonly RemoteServiceRow[] = [
  {
    service: "상속등기",
    matrixRef: "inheritance-registration",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["상속재산분할협의서(전원 인감 날인)", "인감증명서 또는 본인서명사실확인서", "위임장"],
    physicalVisitPossible: ["미성년 상속인 특별대리인 선임", "연락이 끊긴 상속인", "해외 상속인 서명 방식"],
    jurisdictionRule: "부동산 소재지 관할 등기소. 상속·유증은 관할 등기소가 아닌 등기소에서도 처리 가능(부동산등기법 제7조의3).",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "상담과 사진 검토는 방문 없이 시작하고, 원본은 우편으로 받습니다. 방문이 필요한 사건은 수임 전에 알려드립니다.",
    metroAction: "EXPAND_NOW",
    metroReason: "P0 검색 의도. 서울·용인 대표 URL만 이번 배치에서 개선.",
  },
  {
    service: "상속포기",
    matrixRef: "inheritance-renunciation",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["상속포기 신고서(인감 날인)", "인감증명서", "가족관계 서류"],
    physicalVisitPossible: ["법원 보정·출석 요구", "미성년 상속인 법정대리 문제"],
    jurisdictionRule: "피상속인 마지막 주소지 가정법원(가사소송법 제44조 제1항 제6호). 가정법원이 없는 곳은 지방법원·지원.",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "관할 법원은 돌아가신 분의 마지막 주소로 정해집니다. 서류 준비는 원거리로 진행하고 법원 요구가 있으면 따로 안내합니다.",
    metroAction: "TEST",
    metroReason: "지역 상속등기 페이지 안에서 관할 가정법원만 안내. 지역별 상속포기 URL은 성과 확인 후 판단.",
  },
  {
    service: "한정승인",
    matrixRef: "qualified-acceptance",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["한정승인 신고서", "상속재산목록", "인감증명서", "가족관계 서류"],
    physicalVisitPossible: ["법원 보정·출석 요구", "수리 후 청산 절차(공고·배당)"],
    jurisdictionRule: "피상속인 마지막 주소지 가정법원(가사소송법 제44조 제1항 제6호).",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "신고 준비는 원거리로 시작할 수 있고, 수리 뒤 청산 절차는 재산·채권자 상황에 따라 범위가 달라집니다.",
    metroAction: "TEST",
    metroReason: "청산 절차가 길어 원거리 완료를 약속하기 어려움. 전국 원격 안내 페이지로 연결.",
  },
  {
    service: "유증등기",
    matrixRef: "bequest-registration",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["유언서(공정증서·검인조서)", "유언집행자·수증자 인감증명서"],
    physicalVisitPossible: ["자필유언 검인", "유언집행자 선임"],
    jurisdictionRule: "상속등기와 같은 관할 특례(부동산등기법 제7조의3).",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "유언 형식과 등기부를 먼저 보고 원거리 진행 범위를 말씀드립니다.",
    metroAction: "HOLD",
    metroReason: "지역어 결합 검색 근거 없음.",
  },
  {
    service: "법인등기",
    matrixRef: "corporate-registration",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["의사록·주주명부 등 날인 서류", "인감 관련 서류"],
    physicalVisitPossible: ["법인인감 신고·변경", "공증이 필요한 의사록"],
    jurisdictionRule: "본점 소재지 관할 등기소.",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "등기사항과 의사록 초안은 원거리로 검토하고, 인감 관련 절차가 있으면 별도로 안내합니다.",
    metroAction: "HOLD",
    metroReason: "수도권 현지 경쟁이 강하고 이 사무소의 원거리 법인 사례 근거가 부족.",
  },
  {
    service: "증여등기",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["검인받은 증여계약서", "증여자 인감증명서", "등기필정보"],
    physicalVisitPossible: ["증여자 본인 확인", "등기필정보 분실 시 확인서면"],
    jurisdictionRule: "부동산 소재지 관할 등기소(상속·유증 관할 특례 적용 없음).",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "증여 방식과 세금 쟁점은 먼저 상담하고, 본인 확인이 필요한 단계는 사건마다 안내합니다.",
    metroAction: "HOLD",
    metroReason: "관할 특례가 없고 증여세 판단이 앞서는 업무라 지역 URL 확장 근거 약함.",
  },
  {
    service: "근저당 설정·말소",
    matrixRef: "mortgage",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["해지증서·위임장(금융기관)", "등기필정보"],
    physicalVisitPossible: ["소유자 본인 확인"],
    jurisdictionRule: "부동산 소재지 관할 등기소.",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "말소 서류가 갖춰졌는지 먼저 확인해 드립니다.",
    metroAction: "DO_NOT_REGIONIZE",
    metroReason: "금융기관 거래 흐름에 묶인 업무로 지역 검색 의도가 약함.",
  },
  {
    service: "지급명령",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["차용증·거래내역 등 채권 증빙"],
    physicalVisitPossible: ["이의신청으로 소송 전환 시 기일 출석"],
    jurisdictionRule: "채무자 보통재판적 소재지 등 법정 관할 법원(민사소송법 제463조). 전자소송 가능.",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "신청서 작성은 원거리로 진행할 수 있고, 이의가 나오면 이후 절차를 따로 안내합니다.",
    metroAction: "DO_NOT_REGIONIZE",
    metroReason: "전자소송으로 지역 차이가 작아 지역 URL의 고유 정보가 거의 없음.",
  },
  {
    service: "공탁",
    initialConsultRemote: "YES",
    documentPrecheckRemote: "YES",
    originalDocumentsRequired: ["공탁 원인 증빙", "공탁금"],
    physicalVisitPossible: ["공탁소 출석이 필요한 경우"],
    jurisdictionRule: "변제공탁은 채무이행지 공탁소(민법 제488조 제1항). 유형별로 다름.",
    finalCompletionRemote: "CASE_DEPENDENT",
    safeMarketingCopy: "공탁 유형과 관할 공탁소를 먼저 확인해 드립니다.",
    metroAction: "DO_NOT_REGIONIZE",
    metroReason: "유형별 관할이 달라 지역 페이지로 일반화하기 어렵고 검색 근거 없음.",
  },
];
