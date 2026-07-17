import type { PracticeHubCard } from "@/components/local-landing/PracticeHubPageView";

export const practiceHubDefs: Record<
  string,
  {
    intro: string;
    note?: string;
    cards: PracticeHubCard[];
  }
> = {
  등기실무: {
    intro:
      "일반 의뢰인과 법무사·금융·건축·기업 담당자가 함께 볼 수 있는 등기 실무 안내입니다. 업무명보다 접수·보정·서류·협업 흐름을 기준으로 연결합니다.",
    note: "결과는 보장하지 않으며, 관할·서류에 따라 절차가 달라질 수 있습니다.",
    cards: [
      { href: "/부산부동산등기", title: "부동산등기 접수", description: "매매·증여·이전 등기 절차" },
      { href: "/부산법인등기", title: "법인등기 접수", description: "설립·임원·본점 변경" },
      { href: "/등기보정", title: "등기 보정 대응", description: "보정 통지·보완 안내" },
      { href: "/전자등기", title: "전자등기", description: "전자신청·접수 방식" },
      { href: "/부산등기복대리", title: "등기 복대리", description: "부산 관할 접수 협업" },
      { href: "/부산집단등기", title: "집단등기", description: "신축·입주 다수 세대" },
      { href: "/부산신축건물보존등기", title: "신축 보존등기", description: "사용승인 후 보존" },
      { href: "/부산소유권이전등기", title: "소유권이전등기", description: "매매·잔금일 등기" },
      { href: "/부산매매등기법무사", title: "매매등기 법무사", description: "계약~잔금·이전 허브" },
      { href: "/부산빌라매매등기", title: "빌라 매매등기", description: "다세대·임대차 확인" },
      { href: "/부산오피스텔매매등기", title: "오피스텔 매매등기", description: "용도·대출·임대차" },
      { href: "/부산상가매매등기", title: "상가 매매등기", description: "상가임대차·권리관계" },
      { href: "/부산토지매매등기", title: "토지 매매등기", description: "지목·허가·분필 확인" },
      { href: "/부산증여등기", title: "증여등기", description: "부모·부부·지분 증여" },
      { href: "/부산명의변경등기", title: "명의변경등기", description: "원인별 명의 이전 안내" },
      { href: "/부산임차권등기명령", title: "임차권등기명령", description: "보증금 미반환 시" },
      { href: "/부산경매낙찰등기", title: "경매 낙찰등기", description: "낙찰 후 소유권이전" },
      { href: "/부산공매낙찰등기", title: "공매 낙찰등기", description: "온비드·캠코 낙찰 후" },
      { href: "/부산가압류말소등기", title: "가압류 말소", description: "변제·판결 후 정리" },
      { href: "/부산압류말소등기", title: "압류 말소", description: "체납·집행 해제 후" },
      { href: "/부산근저당설정등기", title: "근저당 설정·말소", description: "담보·상환 후 말소" },
      { href: "/부산전세권설정등기", title: "전세권 설정·말소", description: "전세권 등기" },
      { href: "/부산확정일자전세권비교", title: "확정일자·전세권 비교", description: "전세 보호 방식 비교" },
      { href: "/공공기관등기업무", title: "공공기관 등기", description: "촉탁·공공 부동산" },
      { href: "/부산신탁등기", title: "신탁등기", description: "신탁원부·담보신탁" },
      { href: "/특수등기", title: "특수등기", description: "선박·특수 대상" },
      { href: "/부산잔금일법무사", title: "잔금일 법무사", description: "잔금·말소·이전 일정" },
      { href: "/부산입주등기", title: "입주등기", description: "신축·분양 입주 이전" },
      { href: "/부산법무사비용", title: "비용·수임료", description: "보수와 공과금 구분" },
    ],
  },
  특수등기의뢰: {
    intro:
      "복대리·집단등기·대량 접수·협업 의뢰처럼 일반 개인 상담과 다른 특수 의뢰를 모았습니다. /특수등기(선박 등)와는 목적이 다릅니다.",
    cards: [
      { href: "/부산등기복대리", title: "부산 등기 복대리", description: "타지역 접수 협업" },
      { href: "/부산집단등기", title: "부산 집단등기", description: "아파트·오피스텔 입주" },
      { href: "/부산입주등기", title: "입주등기(개인)", description: "입주자 관점 이전등기" },
      { href: "/부산신탁등기", title: "신탁등기", description: "신탁원부·담보신탁" },
      { href: "/부산공매낙찰등기", title: "공매 낙찰등기", description: "기관 매각 후 이전" },
      { href: "/신축보존등기", title: "신축 입주·보존", description: "보존·이전 연계" },
      { href: "/오피스텔집단등기", title: "오피스텔 집단등기", description: "대표 안내는 집단등기" },
      { href: "/공공기관등기업무", title: "공공기관 등기업무", description: "촉탁·공공" },
      { href: "/법무사협업", title: "건축사·세무사 협업", description: "제휴·아웃소싱" },
      { href: "/법무사협업", title: "중개사 잔금일 협업", description: "잔금·말소 조율" },
      { href: "/부산등기복대리", title: "타지역 법무사 부산 접수", description: "복대리 문의" },
      { href: "/특수등기", title: "특수등기(대상별)", description: "선박·기타 특수" },
      { href: "/contact", title: "특수 의뢰 상담", description: "건수·관할·일정 문의" },
    ],
  },
  법무사협업: {
    intro:
      "세무사·공인중개사·건축사·금융기관·시행사·입주예정자협의회·공공기관 등과의 등기 업무 협업 안내입니다. 초기 문의에서 과도한 개인정보는 받지 않습니다.",
    note: "협업 가능 범위는 건수·관할·일정에 따라 달라질 수 있습니다.",
    cards: [
      { href: "/부산등기복대리", title: "등기 복대리", description: "부산 접수 지원" },
      { href: "/부산집단등기", title: "집단등기 제안", description: "단지·세대 일정" },
      { href: "/부산법인등기", title: "법인등기 제휴", description: "설립·변경 대량" },
      { href: "/공공기관등기업무", title: "공공기관 등기", description: "촉탁·용역" },
      { href: "/부산신축건물보존등기", title: "건축사 보존등기 협업", description: "사용승인 후" },
      { href: "/부산잔금일법무사", title: "잔금일 등기 협업", description: "중개·대출 연동" },
      { href: "/부산매매등기법무사", title: "매매등기 협업", description: "잔금·이전 연계" },
      { href: "/부산법무사비용", title: "비용 항목 안내", description: "보수·공과금" },
      { href: "/등기실무", title: "등기 실무 허브", description: "실무 링크 모음" },
      { href: "/contact", title: "협업 문의하기", description: "업무범위·건수·관할" },
    ],
  },
};
