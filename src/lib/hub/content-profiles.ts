import type { HubTheme } from "./types";

export type ContentProfile = {
  sectionTitles: string[];
  focusNote: string;
};

export const CONTENT_PROFILES: Record<HubTheme, ContentProfile> = {
  "region-lawyer": {
    sectionTitles: ["생활권·접근성", "많이 발생하는 상담", "관할·이동 안내"],
    focusNote: "해당 지역 생활권, 센텀 사무소 접근성, 자주 문의되는 상속·등기·회생 유형을 중심으로 안내합니다.",
  },
  "region-service": {
    sectionTitles: ["지역별 업무 상황", "관할·실무 포인트", "비용·일정 참고"],
    focusNote: "해당 지역에서 실제로 자주 발생하는 업무 상황과 관할 등기소·법원을 중심으로 설명합니다.",
  },
  cost: {
    sectionTitles: ["비용이 달라지는 이유", "보수표·실비", "사건 난이도별 견적"],
    focusNote: "수임료·등기 실비·세금이 구분되며, 부동산 가액·상속인 수·채무 규모에 따라 달라집니다.",
  },
  documents: {
    sectionTitles: ["필수 서류", "추가로 필요한 경우", "준비 체크리스트"],
    focusNote: "사건별 준비서류를 체크리스트 형태로 정리하고, 누락 시 보정·지연 위험을 안내합니다.",
  },
  period: {
    sectionTitles: ["법정 기한", "지연 시 불이익", "과태료·가산세"],
    focusNote: "신고·등기 기한과 지연 시 과태료·단순승인 등 불이익을 사례별로 설명합니다.",
  },
  court: {
    sectionTitles: ["관할 확인", "접수 전 확인사항", "서류 보정 대응"],
    focusNote: "법원·등기소 관할과 접수 창구, 보정명령 대응을 중심으로 실무 안내합니다.",
  },
  "female-lawyer": {
    sectionTitles: ["편안한 상담", "상속·가사 심리적 부담", "회생·채무 상담"],
    focusNote: "상속·회생·가족관계 상담 시 심리적 부담을 덜 수 있도록 차분히 설명드립니다.",
  },
  industrial: {
    sectionTitles: ["법인설립·등기", "본점이전·임원변경", "정관변경·기업등기"],
    focusNote: "산업단지·신도시 입주 기업의 설립, 본점이전, 임원변경, 정관변경 등기를 중심으로 안내합니다.",
  },
  maritime: {
    sectionTitles: ["선박등기", "해운·물류 법인", "항만기업 등기"],
    focusNote: "선박 소유권 이전, 해운회사·물류회사 법인등기 등 해양·항만 관련 업무를 다룹니다.",
  },
  inheritance: {
    sectionTitles: ["상속 절차", "가족 협의", "관할·기한"],
    focusNote: "상속등기·포기·한정승인 등 상속 절차를 가족 상황에 맞게 연결해 안내합니다.",
  },
  corporate: {
    sectionTitles: ["법인 변경등기", "임원·본점", "설립 후속"],
    focusNote: "설립, 임원변경, 본점이전, 정관변경 등 법인 생애주기별 등기를 설명합니다.",
  },
  "real-estate": {
    sectionTitles: ["매매·상속 원인", "관할 등기소", "세금·일정"],
    focusNote: "부동산 원인별 등기와 재개발·재건축 특수 상황을 구분해 안내합니다.",
  },
  rehab: {
    sectionTitles: ["회생·파산 선택", "채무·소득 정리", "법원 절차"],
    focusNote: "개인회생과 파산 중 적합한 절차를 비교하고, 부산회생법원 절차를 안내합니다.",
  },
  general: {
    sectionTitles: ["업무 안내", "상담 절차", "비용·서류"],
    focusNote: "부산 전역 법무사 업무를 사건별로 정리해 안내합니다.",
  },
};
