/**
 * 강의·특강·강사 섭외 검색어 universe.
 * 검색의도 분석용이며, 본문에 모두 삽입하지 않는다.
 * 동일 semantic intent는 하나의 owner URL.
 * Search Advisor 실측이 없어 impressions/clicks/ctr는 비운다.
 */
export type LectureKeywordStatus =
  | "WINNER"
  | "OPPORTUNITY"
  | "WEAK"
  | "CANNIBALIZED"
  | "UNKNOWN";

export type LectureKeywordRow = {
  keyword: string;
  cluster: string;
  search_intent:
    | "transactional"
    | "commercial"
    | "informational"
    | "navigational";
  owner_url: string;
  secondary_url?: string;
  status: LectureKeywordStatus;
  notes: string;
};

function row(
  keyword: string,
  cluster: string,
  search_intent: LectureKeywordRow["search_intent"],
  owner_url: string,
  notes: string,
  secondary_url?: string,
): LectureKeywordRow {
  return {
    keyword,
    cluster,
    search_intent,
    owner_url,
    secondary_url,
    status: "UNKNOWN",
    notes,
  };
}

export const lectureKeywordUniverse: LectureKeywordRow[] = [
  // —— pillar hub ——
  row("부산 법률 강의", "pillar-hub", "informational", "/법률강의", "PILLAR PRIMARY"),
  row("부산 법률 특강", "pillar-hub", "informational", "/법률강의", "PILLAR PRIMARY 동의어", "/부산법률강사"),
  row("부산법률강의", "pillar-hub", "informational", "/법률강의", "표기 변형"),
  row("맞춤형 법률교육", "pillar-hub", "informational", "/법률강의", "형식 동의어"),
  row("부산 생활법률 강의", "pillar-hub", "informational", "/법률강의", "주제 secondary. 도서관 페이지와 분리", "/부산도서관법률특강"),
  row("부산 생활법률 특강", "pillar-hub", "informational", "/법률강의", "주제 secondary", "/부산도서관법률특강"),
  row("부산 법률교육 강사", "hiring", "commercial", "/부산법률강사", "강사 선택 의도", "/법률강의"),
  row("부산 법률 세미나", "pillar-hub", "informational", "/법률강의", "형식 동의어. 별도 URL 없음"),
  row("부산 법률 워크숍", "pillar-hub", "informational", "/법률강의", "형식 동의어"),
  row("부산 법률 워크샵", "pillar-hub", "informational", "/법률강의", "철자 변형"),
  row("부산 찾아가는 강의", "pillar-hub", "informational", "/법률강의", "출강 형식. FAQ/본문 대응"),
  row("부산 찾아가는 특강", "pillar-hub", "informational", "/법률강의", "출강 형식"),
  row("부산 방문교육 강사", "hiring", "commercial", "/부산법률강사", "출강 강사 선택"),
  row("부산 출장강의", "pillar-hub", "informational", "/법률강의", "출강 형식"),
  row("부산 출강 강사", "hiring", "commercial", "/부산법률강사", "강사 선택"),
  row("부산 맞춤형 특강", "pillar-hub", "informational", "/법률강의", "형식"),
  row("부산 맞춤교육", "pillar-hub", "informational", "/법률강의", "형식"),
  row("부산 1시간 특강", "admin-duration", "informational", "/강의시간별구성", "시간 구성 가이드", "/강의문의"),
  row("부산 단체교육 강사", "hiring", "commercial", "/부산법률강사", "기관 단체 교육 강사"),

  // —— inquiry ——
  row("부산 강의 문의", "inquiry", "transactional", "/강의문의", "TRANSACTIONAL PRIMARY"),
  row("부산 특강 문의", "inquiry", "transactional", "/강의문의", "동일 문의 의도"),
  row("부산 강연 문의", "inquiry", "transactional", "/강의문의", "동일 문의 의도"),
  row("부산 출강 문의", "inquiry", "transactional", "/강의문의", "동일 문의 의도"),
  row("강의 제안 문의", "inquiry", "transactional", "/강의문의", "제안·일정 협의"),
  row("법률 강의 문의", "inquiry", "transactional", "/강의문의", "표기 변형"),
  row("출강 문의", "inquiry", "transactional", "/강의문의", "표기 변형"),

  // —— hiring / 섭외 ——
  row("부산 강사 섭외", "hiring", "commercial", "/부산법률강사", "COMMERCIAL PRIMARY. 기존 URL 유지(/부산강사초빙 없음)"),
  row("부산 강사 초빙", "hiring", "commercial", "/부산법률강사", "PRIMARY 동의어"),
  row("부산 외부강사", "hiring", "commercial", "/부산법률강사", "동일 섭외 의도"),
  row("부산 외부 강사", "hiring", "commercial", "/부산법률강사", "표기 변형"),
  row("부산 외부강사 섭외", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 외부강사 초빙", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 특강 강사", "hiring", "commercial", "/부산법률강사", "강사 선택. 허브 title과 분리"),
  row("부산 강연 강사", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 강의 강사", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 초청강사", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 강연자 섭외", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 강사 문의", "hiring", "commercial", "/부산법률강사", "섭외 검토 후 문의는 /강의문의", "/강의문의"),
  row("부산 강사 출강", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 법률 강사", "hiring", "commercial", "/부산법률강사", "전문영역 한정"),
  row("부산 법률 강사 섭외", "hiring", "commercial", "/부산법률강사", "동일"),
  row("생활법률 강사", "hiring", "commercial", "/부산법률강사", "주제+강사", "/법률강의"),
  row("법률 강사 섭외", "hiring", "commercial", "/부산법률강사", "지역 없는 변형"),
  row("부산 교육 강사", "hiring", "commercial", "/부산법률강사", "광범위. title에 사용하지 않음"),
  row("부산 기관 강사", "hiring", "commercial", "/부산법률강사", "기관 유형은 허브 섹션", "/부산기관법률특강"),
  row("부산 법무사 강사", "hiring", "commercial", "/부산법률강사", "법무사 정체성+강사", "/부산법무사강의"),
  row("부산 법률특강 강사", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 법률 강연 강사", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 전문가 초빙", "hiring", "commercial", "/부산법률강사", "전문가 허브와 구분", "/부산법률전문가"),
  row("부산 전문가 섭외", "hiring", "commercial", "/부산법률강사", "동일", "/부산법률전문가"),
  row("부산 전문가 강사", "hiring", "commercial", "/부산법률강사", "동일"),
  row("부산 강사 추천", "hiring", "commercial", "/부산법률강사", "가짜 순위 페이지 없음. 선택 기준으로 대응"),
  row("부산 특강 강사 추천", "hiring", "commercial", "/부산법률강사", "가짜 추천 페이지 없음"),
  row("부산 강연자 추천", "hiring", "commercial", "/부산법률강사", "가짜 추천 페이지 없음"),

  // —— wide queries: map closest, do not retarget site identity ——
  row("부산 강사", "skip-wide", "commercial", "/부산법률강사", "매우 넓은 검색어. title/H1에 사용하지 않음. 법률 맥락만"),
  row("부산 강연", "skip-wide", "informational", "/법률강의", "광범위. 법률 특강 맥락"),
  row("부산 교육", "skip-wide", "informational", "/법률강의", "광범위. 사이트 정체성(법무사) 유지"),

  // —— jeonse ——
  row("부산 전세사기 예방교육", "jeonse", "informational", "/전세사기예방교육", "주제 PRIMARY"),
  row("부산 전세사기 강의", "jeonse", "informational", "/전세사기예방교육", "동일 의도"),
  row("부산 전세사기 특강", "jeonse", "informational", "/전세사기예방교육", "동일"),
  row("부산 전세사기 예방 강사", "jeonse", "commercial", "/전세사기예방교육", "주제+강사. 별도 URL 없음"),
  row("부산 전월세 계약 교육", "jeonse", "informational", "/전세사기예방교육", "동일 클러스터"),
  row("부산 부동산 계약 강의", "jeonse", "informational", "/전세사기예방교육", "주거계약 교육", "/기업법률교육"),
  row("부산 부동산 법률교육", "jeonse", "informational", "/전세사기예방교육", "주거 중심", "/법률강의"),
  row("부산 등기부등본 교육 강사", "jeonse", "commercial", "/전세사기예방교육", "커리큘럼 항목"),
  row("부산 주거안전 강사", "jeonse", "commercial", "/전세사기예방교육", "관련 표현"),

  // —— youth ——
  row("부산 청년 법률교육", "youth", "informational", "/청년생활법률특강", "주제 PRIMARY"),
  row("부산 청년 생활법률", "youth", "informational", "/청년생활법률특강", "동일"),
  row("부산 청년 법률특강", "youth", "informational", "/청년생활법률특강", "동일"),
  row("부산 청년 생활법률 특강", "youth", "informational", "/청년생활법률특강", "동일"),
  row("부산 청년 특강 강사", "youth", "commercial", "/청년생활법률특강", "주제+강사"),
  row("부산 청년교육 강사", "youth", "commercial", "/청년생활법률특강", "동일"),
  row("부산 청년센터 강사", "youth", "commercial", "/청년생활법률특강", "기관유형은 허브 흡수, 이력 있어 페이지 유지"),
  row("부산 청년기관 특강", "youth", "informational", "/청년생활법률특강", "동일"),
  row("부산 자립청년 교육", "youth", "informational", "/청년생활법률특강", "자립준비청년"),
  row("부산 청년 자립교육 강사", "youth", "commercial", "/청년생활법률특강", "동일"),
  row("청년 법률강의", "youth", "informational", "/청년생활법률특강", "지역 없는 변형. 부산 실적 맥락"),
  row("대학생 법률특강", "youth", "informational", "/청년생활법률특강", "대상 기반. 학교 페이지와 분담", "/학교법률교육"),
  row("사회초년생 법률교육", "youth", "informational", "/청년생활법률특강", "대상"),
  row("자립준비청년 법률교육", "youth", "informational", "/청년생활법률특강", "확인된 이력"),
  row("부산 사회초년생 교육", "youth", "informational", "/청년생활법률특강", "동일"),
  row("부산 사회초년생 법률교육", "youth", "informational", "/청년생활법률특강", "동일"),
  row("부산 가족 간 돈거래 강사", "youth", "commercial", "/청년생활법률특강", "커리큘럼 항목"),

  // —— startup ——
  row("부산 창업 법률교육", "startup", "informational", "/창업법률교육", "주제 PRIMARY"),
  row("부산 창업 법률특강", "startup", "informational", "/창업법률교육", "동일"),
  row("부산 창업 강사", "startup", "commercial", "/창업법률교육", "주제+강사"),
  row("부산 예비창업자 법률교육", "startup", "informational", "/창업법률교육", "동일"),
  row("부산 창업교육 강사", "startup", "commercial", "/창업법률교육", "동일"),
  row("부산 예비창업자 강사", "startup", "commercial", "/창업법률교육", "동일"),
  row("부산 창업 특강", "startup", "informational", "/창업법률교육", "동일"),
  row("부산 창업 법률 특강", "startup", "informational", "/창업법률교육", "동일"),
  row("부산 스타트업 법률교육", "startup", "informational", "/창업법률교육", "동일"),
  row("부산 스타트업 특강", "startup", "informational", "/창업법률교육", "동일"),
  row("부산 스타트업 강사", "startup", "commercial", "/창업법률교육", "법률 창업만. 일반 스타트업 강사 아님"),
  row("부산 청년창업 교육", "startup", "informational", "/창업법률교육", "동일"),
  row("부산 창업기업 법률교육", "startup", "informational", "/창업법률교육", "동일"),
  row("부산 창업 법률 강사", "startup", "commercial", "/창업법률교육", "동일"),
  row("창업자 법률교육", "startup", "informational", "/창업법률교육", "지역 없는 변형"),

  // —— corporate ——
  row("부산 기업 법률교육", "corporate", "informational", "/기업법률교육", "주제 PRIMARY"),
  row("부산 기업 법률강의", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 기업 특강", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 기업 강의", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 기업교육 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 기업체 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 직원교육 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 임직원 교육 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 사내교육 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 기업특강", "corporate", "informational", "/기업법률교육", "표기"),
  row("부산 기업 특강 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 기업 법률특강", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 사내 특강", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 사내특강", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 직원교육", "corporate", "informational", "/기업법률교육", "법정교육 아님"),
  row("부산 임직원 교육", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 임직원 법률교육", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 회사 법률교육", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 기업교육", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 기업 강연", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 대표자 교육", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 실무교육 강사", "corporate", "commercial", "/기업법률교육", "계약·채권 실무"),
  row("부산 법인 실무 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 법인 실무 강의", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 법인등기 강의", "corporate", "informational", "/기업법률교육", "교육. 사건 페이지와 구분"),
  row("부산 계약 강의", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 계약 실무 교육", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 계약서 특강", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 계약서 교육", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 채권관리 강의", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 미수금 교육", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 내용증명 강의", "corporate", "informational", "/기업법률교육", "동일"),
  row("부산 계약서 강의 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 미수금·채권관리 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("부산 증거관리 강사", "corporate", "commercial", "/기업법률교육", "동일"),
  row("직장인 생활법률", "corporate", "informational", "/기업법률교육", "대상 기반", "/법률강의"),
  row("임직원 법률교육", "corporate", "informational", "/기업법률교육", "대상"),

  // —— digital ——
  row("부산 개인정보 교육", "digital", "informational", "/디지털법률교육", "주제"),
  row("부산 개인정보 특강", "digital", "informational", "/디지털법률교육", "동일"),
  row("부산 명예훼손 강의", "digital", "informational", "/디지털법률교육", "동일"),
  row("부산 온라인 법률교육", "digital", "informational", "/디지털법률교육", "동일"),
  row("부산 디지털 법률교육", "digital", "informational", "/디지털법률교육", "PRIMARY"),
  row("부산 생활분쟁 강의", "digital", "informational", "/법률강의", "생활분쟁은 허브+도서관", "/부산도서관법률특강"),

  // —— career / school ——
  row("부산 법무사 진로특강", "career", "informational", "/법무사진로특강", "PRIMARY"),
  row("법무사 직업 특강", "career", "informational", "/법무사진로특강", "동일"),
  row("법무사 진로 강사", "career", "commercial", "/법무사진로특강", "동일"),
  row("부산 진로 특강 강사", "career", "commercial", "/법무사진로특강", "법무사 진로만"),
  row("부산 학교 특강", "school", "informational", "/학교법률교육", "학교 허브"),
  row("부산 학교 강사", "school", "commercial", "/학교법률교육", "동일"),
  row("부산 진로특강 강사", "career", "commercial", "/법무사진로특강", "진로=법무사 진로"),
  row("부산 고등학교 특강", "school", "informational", "/학교법률교육", "확인된 양산제일고 이력"),
  row("부산 대학교 특강", "school", "informational", "/학교법률교육", "대학 대상"),
  row("부산 대학생 특강", "school", "informational", "/학교법률교육", "대상", "/청년생활법률특강"),
  row("부산 학교 특강 강사", "school", "commercial", "/학교법률교육", "동일"),
  row("부산 대학 특강 강사", "school", "commercial", "/학교법률교육", "동일"),
  row("부산 고등학생 법률교육", "school", "informational", "/학교법률교육", "동일"),
  row("부산 대학생 생활법률", "school", "informational", "/학교법률교육", "동일", "/청년생활법률특강"),
  row("부산 대학생 특강 강사", "youth", "commercial", "/청년생활법률특강", "청년 클러스터와 학교 분담", "/학교법률교육"),
  row("청소년 생활법률", "school", "informational", "/학교법률교육", "대상"),
  row("고등학생 법률특강", "school", "informational", "/학교법률교육", "대상"),

  // —— public / institution ——
  row("부산 공공기관 특강", "public", "informational", "/공공기관법률교육", "기관유형. 고유 이력·본문 유지"),
  row("부산 공공기관 강의", "public", "informational", "/공공기관법률교육", "동일"),
  row("부산 공공기관 강사", "public", "commercial", "/공공기관법률교육", "PRIMARY"),
  row("부산 공공기관 법률 강사", "public", "commercial", "/공공기관법률교육", "동일"),
  row("부산 기관교육 강사", "public", "commercial", "/공공기관법률교육", "동일"),
  row("부산 공공기관 직원교육", "public", "informational", "/공공기관법률교육", "법정교육 아님"),
  row("부산 공공기관 법률교육", "public", "informational", "/공공기관법률교육", "동일"),
  row("부산 공공기관 외부강사", "public", "commercial", "/공공기관법률교육", "동일"),
  row("부산 기관 특강", "institution", "informational", "/부산기관법률특강", "협회·단체 허브"),
  row("부산 기관 강의", "institution", "informational", "/부산기관법률특강", "동일"),
  row("부산 기관 법률 특강", "institution", "informational", "/부산기관법률특강", "PRIMARY"),
  row("부산 기관 강사 섭외", "hiring", "commercial", "/부산법률강사", "섭외는 hiring", "/부산기관법률특강"),
  row("부산 협회 특강", "institution", "informational", "/부산기관법률특강", "동일"),
  row("부산 단체 특강", "institution", "informational", "/부산기관법률특강", "동일"),
  row("부산 직원 특강", "corporate", "informational", "/기업법률교육", "직원=기업 우선", "/공공기관법률교육"),
  row("부산 종사자 교육", "welfare", "informational", "/부산사회복지기관강사", "복지 종사자", "/공공기관법률교육"),
  row("공무원 생활법률 교육", "public", "informational", "/공공기관법률교육", "대상. 법정교육 아님"),

  // —— library ——
  row("부산 도서관 특강", "library", "informational", "/부산도서관법률특강", "PRIMARY 동의어"),
  row("부산 도서관 법률특강", "library", "informational", "/부산도서관법률특강", "PRIMARY"),
  row("부산 도서관 강사", "library", "commercial", "/부산도서관법률특강", "동일"),
  row("부산 평생학습 강사", "library", "commercial", "/부산도서관법률특강", "동일"),
  row("부산 평생교육 강사", "library", "commercial", "/부산도서관법률특강", "동일"),
  row("부산 시민강좌 강사", "library", "commercial", "/부산도서관법률특강", "동일"),
  row("부산 주민 특강", "library", "informational", "/부산도서관법률특강", "시민 대상"),
  row("부산 성인교육 강사", "library", "commercial", "/부산도서관법률특강", "동일"),
  row("시민 생활법률 강의", "library", "informational", "/부산도서관법률특강", "대상", "/법률강의"),
  row("부산 상속 강의 강사", "library", "commercial", "/부산도서관법률특강", "시민강좌 상속 기초. 상속등기 사건 페이지 아님"),

  // —— welfare ——
  row("부산 사회복지기관 강사", "welfare", "commercial", "/부산사회복지기관강사", "이력·고유본문 있어 유지"),
  row("부산 복지기관 강사", "welfare", "commercial", "/부산사회복지기관강사", "동일"),
  row("부산 복지관 특강", "welfare", "informational", "/부산사회복지기관강사", "동일"),
  row("부산 사회복지사 교육 강사", "welfare", "commercial", "/부산사회복지기관강사", "동일"),
  row("부산 복지기관 종사자교육", "welfare", "informational", "/부산사회복지기관강사", "동일"),
  row("부산 자립지원 종사자교육", "welfare", "informational", "/부산사회복지기관강사", "확인된 이력"),
  row("부산 현장 실무교육 강사", "welfare", "commercial", "/부산사회복지기관강사", "종사자 현장"),
  row("복지기관 종사자 법률교육", "welfare", "informational", "/부산사회복지기관강사", "대상"),

  // —— lawyer identity ——
  row("부산 법무사 강의", "lawyer-identity", "informational", "/부산법무사강의", "PRIMARY. 허브와 역할 분리"),
  row("부산 법무사 특강", "lawyer-identity", "informational", "/부산법무사강의", "동의어"),
  row("부산 법무사 출강", "lawyer-identity", "informational", "/부산법무사강의", "동의어"),

  // —— speaker / history ——
  row("법률 강사 프로필", "speaker", "informational", "/강사소개", "프로필 PRIMARY"),
  row("안윤정 법무사 강사", "speaker", "navigational", "/강사소개", "인물"),
  row("부산 강사 프로필", "admin-docs", "informational", "/강사소개", "행정 검색. FAQ/소개서로 대응", "/강의문의"),
  row("부산 강사 소개서", "admin-docs", "informational", "/강사소개", "동일"),
  row("강의 이력", "history", "informational", "/강의이력", "실적 증명"),
  row("안윤정 법무사 강의 경력", "history", "informational", "/강의이력", "PRIMARY"),
  row("안윤정 법무사 강의 이력", "history", "informational", "/강의이력", "동의어"),

  // —— admin (FAQ/가이드, 가격 창작 금지) ——
  row("부산 강의계획서", "admin-docs", "informational", "/부산강사섭외체크리스트", "정보성. 고정 양식 단정하지 않음", "/강의문의"),
  row("부산 강사 제안서", "admin-docs", "informational", "/부산강사섭외체크리스트", "동일"),
  row("부산 특강 제안서", "admin-docs", "informational", "/부산강사섭외체크리스트", "동일"),
  row("강의계획서에 들어갈 내용", "admin-docs", "informational", "/부산강사섭외체크리스트", "동일"),
  row("강사 프로필 요청 방법", "admin-docs", "informational", "/부산강사섭외체크리스트", "동일"),
  row("부산 강사 섭외 체크리스트", "admin-docs", "informational", "/부산강사섭외체크리스트", "PRIMARY"),
  row("부산 외부강사 섭외 방법", "admin-docs", "informational", "/부산강사섭외체크리스트", "동일"),
  row("부산 강의 견적", "admin-cost", "informational", "/부산강사섭외비용", "고정가 없음. 결정 요인만"),
  row("부산 특강 비용", "admin-cost", "informational", "/부산강사섭외비용", "동일"),
  row("부산 강사료", "admin-cost", "informational", "/부산강사섭외비용", "동일"),
  row("부산 강의료", "admin-cost", "informational", "/부산강사섭외비용", "동일"),
  row("부산 출강료", "admin-cost", "informational", "/부산강사섭외비용", "동일"),
  row("부산 특강 강사 비용", "admin-cost", "informational", "/부산강사섭외비용", "동일"),
  row("부산 외부강사 비용", "admin-cost", "informational", "/부산강사섭외비용", "동일"),
  row("부산 강사 섭외 비용", "admin-cost", "informational", "/부산강사섭외비용", "PRIMARY"),
  row("강의료 견적", "admin-cost", "informational", "/부산강사섭외비용", "동일"),
  row("강사 교통비", "admin-cost", "informational", "/부산강사섭외비용", "동일"),
  row("부산 기관 특강 주제 추천", "admin-topics", "informational", "/기관특강주제추천", "기획 가이드. 가짜 랭킹 아님"),
  row("부산 직원교육 주제 추천", "admin-topics", "informational", "/기관특강주제추천", "동일"),
  row("부산 청년 프로그램 강의주제", "admin-topics", "informational", "/기관특강주제추천", "동일"),
  row("부산 시민강좌 주제 추천", "admin-topics", "informational", "/기관특강주제추천", "동일"),
  row("1시간 특강 주제", "admin-duration", "informational", "/강의시간별구성", "시간 구성"),
  row("2시간 참여형 교육", "admin-duration", "informational", "/강의시간별구성", "동일"),
  row("4시간 실무 워크숍", "admin-duration", "informational", "/강의시간별구성", "동일"),

  // —— expert hub (existing, not lecture doorway) ——
  row("부산 법률 전문가", "expert", "informational", "/부산법률전문가", "실무·공공활동. 강의 허브와 분리"),
  row("부산법률전문가", "expert", "informational", "/부산법률전문가", "표기"),
  row("부산 법률전문가", "expert", "informational", "/부산법률전문가", "표기"),
  row("부산 법률 전문가 추천", "expert", "commercial", "/부산법률전문가", "가짜 순위 없음"),
  row("부산 법률 전문가 섭외", "expert", "commercial", "/부산법률전문가", "강의 섭외는 /부산법률강사", "/부산법률강사"),
  row("부산 법률 전문가 강연", "expert", "informational", "/부산법률전문가", "동일"),
  row("부산 법률 전문가 출연", "expert", "informational", "/부산법률전문가", "언론"),
  row("부산 법률 전문가 인터뷰", "expert", "informational", "/부산법률전문가", "언론"),
  row("부산 법률 전문가 패널", "expert", "informational", "/부산법률전문가", "동일"),
  row("부산 법률 전문가 자문", "expert", "informational", "/부산법률전문가", "자문≠강의"),
  row("부산 법률 실무 전문가", "expert", "informational", "/부산법률전문가", "동일"),
  row("부산 법률 강연 전문가", "expert", "informational", "/부산법률전문가", "동일"),
];

export const lectureKeywordToUrlMap: Record<string, string> =
  Object.fromEntries(
    lectureKeywordUniverse.map((item) => [item.keyword, item.owner_url]),
  );

export function resolveLectureKeywordUrl(keyword: string): string | undefined {
  const normalized = keyword.trim().replace(/\s+/g, " ");
  return lectureKeywordToUrlMap[normalized] ?? lectureKeywordToUrlMap[keyword.trim()];
}

export function lectureOwnerCollisions(): Array<{
  keyword: string;
  owners: string[];
}> {
  const byKeyword = new Map<string, Set<string>>();
  for (const item of lectureKeywordUniverse) {
    const set = byKeyword.get(item.keyword) ?? new Set();
    set.add(item.owner_url);
    byKeyword.set(item.keyword, set);
  }
  const collisions: Array<{ keyword: string; owners: string[] }> = [];
  for (const [keyword, owners] of byKeyword) {
    if (owners.size > 1) collisions.push({ keyword, owners: [...owners] });
  }
  return collisions;
}
