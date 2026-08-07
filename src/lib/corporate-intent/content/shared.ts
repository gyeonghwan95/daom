export const CORPORATE_OFFICE_LINE =
  "다옴법무사사무소 안윤정 법무사 · 부산 해운대·센텀";

export const CORPORATE_SCOPE_NOTICE =
  "법무사는 법인등기 신청·서류 작성·접수 대리 등 등기 관련 업무를 지원합니다. 세무 신고·노무·소송대리·경영 자문은 별도 전문 영역이며, 사안별로 지원 범위를 확인합니다. ‘기업 전문’·‘무조건 해결’·‘최저 비용’과 같은 표현으로 모든 문제를 처리한다고 안내하지 않습니다.";

/** 공증·인증 안내 페이지 공통 경계 (문맥에 맞게 notaryBoundaryNote로 변형) */
export const NOTARY_BOUNDARY_BASE =
  "공정증서 작성이나 사서증서 인증 등 공증업무 자체는 공증인이 수행합니다. 다옴법무사사무소는 법인설립·변경등기 과정에서 정관·의사록 등 등기 서류, 공증이 필요한지 확인할 포인트, 공증 전후 등기 절차를 안내합니다.";

export const CORPORATE_HUB_LINKS = {
  main: { href: "/부산법인법무사", label: "부산 법인 법무사 종합" },
  registry: { href: "/부산법인등기", label: "부산 법인등기 지역 안내" },
  pillar: { href: "/법인등기", label: "법인등기 업무 허브" },
  business: { href: "/부산기업법률자문", label: "기업 법률실무 지원" },
  contact: { href: "/contact", label: "법인등기 상담 문의" },
  establishment: { href: "/부산법인설립등기", label: "부산 법인설립등기" },
  director: { href: "/부산임원변경등기", label: "부산 임원변경등기" },
  changeHub: { href: "/법인변경등기", label: "법인 변경등기 안내" },
  charterHub: { href: "/법인정관업무", label: "법인 정관 업무 안내" },
  charterChange: { href: "/법인정관변경", label: "정관 변경 필요 여부" },
  notaryPrep: { href: "/법인공증준비", label: "법인 공증 준비 안내" },
  charterAuth: { href: "/법인정관인증확인", label: "정관 인증 필요 여부" },
  minutesNotary: { href: "/법인의사록공증준비", label: "의사록 공증 준비" },
} as const;
