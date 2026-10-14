/** 텍스트 카드 데이터. keepLandscape: 기존 가로형(10-13 제작) 유지, 1:1만 새로 만든다. */
export const CARDS = [
  {
    id: "consult-prep", keepLandscape: true, sqPosition: "north", photo: "상담-메인.jpg", kicker: "상담 준비",
    title: ["상담 전", "준비할 자료"], sub: ["상황 메모와 가지고 있는 서류만", "있어도 상담을 시작할 수 있습니다"],
  },
  {
    id: "select-criteria", keepLandscape: true, sqPosition: "north", photo: "썸네일-사무실_정면.jpg", kicker: "법무사 선택",
    title: ["법무사 선택,", "확인할 기준"], sub: ["담당자·수임료와 공과금 구분·", "맡는 범위를 먼저 비교해 보세요"],
  },
  {
    id: "office-visit", keepLandscape: true, sqPosition: "center", photo: "썸네일-상담협의.jpg", kicker: "다옴법무사사무소",
    title: ["센텀 사무소,", "예약 후 방문"], sub: ["부산 해운대구 센텀동로 200", "평일 09:00–18:00 · 방문은 예약제"],
  },
  {
    id: "inheritance-start", keepLandscape: true, sqPosition: "south", photo: "썸네일_사무실_서류검토_여름 (5).jpg", kicker: "상속 업무",
    title: ["상속, 어떤", "절차부터?"], sub: ["상속등기·상속포기·한정승인 중", "무엇이 맞는지부터 가립니다"],
  },
  {
    id: "registry-check", keepLandscape: true, sqPosition: "center", photo: "썸네일-등기운영과.jpg", kicker: "등기 업무",
    title: ["등기 전에", "확인할 것"], sub: ["등기부·원인 서류·관할 등기소를", "먼저 확인한 뒤 접수합니다"],
  },
  {
    id: "corporate-change", keepLandscape: true, sqPosition: "center", photo: "썸네일-사무실_겨울 (4).jpg", kicker: "법인등기",
    title: ["법인등기,", "변경 사항부터"], sub: ["임원·본점·목적·자본 중", "무엇이 바뀌는지 먼저 정리합니다"],
  },
  {
    id: "officer-deadline", keepLandscape: true, sqPosition: "north", photo: "썸네일-사무실_작업중.jpg", kicker: "법인 업무",
    title: ["임원 변경,", "2주 안에 등기"], sub: ["변경이 생긴 날부터 본점 소재지에서", "등기합니다(상법 제317조·제183조)"],
  },
  // ── 10-14 신규 4종(가로형+1:1). 서류 사진은 이름·주민번호·상세 주소가 흐림 처리된 원본만 사용(구·군 단위 주소·날짜만 보임).
  {
    id: "inheritance-registration-prep", sqPosition: "center", photo: "서류/신청서_상속 (8).jpg", kicker: "상속등기",
    title: ["상속등기", "준비사항"], sub: ["가족관계 서류·상속재산분할협의서·", "부동산 서류를 순서대로 준비합니다"],
  },
  {
    id: "renunciation-check", sqPosition: "center", photo: "서류/서류_상속포기.jpg", kicker: "상속포기",
    title: ["상속포기", "신청 전 확인"], sub: ["상속개시를 안 날부터 3개월 안에", "상속개시지 관할 가정법원에 신고합니다"],
  },
  {
    id: "qualified-acceptance", sqPosition: "north", photo: "썸네일-사무실_가을 (2).jpg", kicker: "한정승인",
    title: ["한정승인,", "재산과 채무부터"], sub: ["상속받은 재산 한도에서 빚을 갚는 절차,", "재산·채무 목록부터 정리합니다"],
  },
  {
    id: "company-establishment-prep", sqPosition: "center", photo: "서류/신청서_법인설립.jpg", kicker: "법인설립",
    title: ["법인설립", "준비자료"], sub: ["상호·본점·목적·자본금·임원 구성을", "먼저 정하면 필요한 서류가 정해집니다"],
  },
];
