/**
 * 본문·공유용 텍스트 카드(이미지 안에 한글 제목) — 페이지당 1장.
 * 제작: reports/naver-12kw-2026-10-13/cards/build-cards.mjs (실제 사진 + Noto Sans KR 합성, 1200×600).
 * 검색 대표 이미지(OG·primaryImageOfPage)에는 쓰지 않는다 — 대표 이미지는 글자 없는 사진 유지.
 * 이미지 속 문구는 같은 내용을 figcaption(HTML)으로도 제공한다.
 */
export type PageTextCard = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** 이미지 속 제목과 같은 뜻의 HTML 설명 */
  caption: string;
};

const card = (id: string, alt: string, caption: string): PageTextCard => ({
  src: `/image/cards/${id}.jpg`,
  width: 1200,
  height: 600,
  alt,
  caption,
});

export const PAGE_TEXT_CARDS: Record<string, PageTextCard> = {
  "/": card(
    "office-visit",
    "센텀 사무소, 예약 후 방문 — 다옴법무사사무소 책상에서 서류를 보는 안윤정 법무사",
    "부산 해운대구 센텀동로 200 다옴법무사사무소. 평일 09:00–18:00, 방문은 예약 후 이용해 주세요.",
  ),
  "/부산법무사상담": card(
    "consult-prep",
    "상담 전 준비할 자료 — 상담 중인 안윤정 법무사",
    "상담 전에는 지금 상황을 적은 메모와 가지고 있는 서류만 있어도 시작할 수 있습니다.",
  ),
  "/부산법무사추천": card(
    "select-criteria",
    "법무사 선택, 확인할 기준 — 다옴법무사사무소 로고 앞의 안윤정 법무사",
    "법무사를 고를 때는 담당자, 수임료와 공과금의 구분, 맡는 업무 범위를 먼저 비교해 보세요.",
  ),
  "/부산상속법무사": card(
    "inheritance-start",
    "상속, 어떤 절차부터? — 상속 서류를 검토하는 안윤정 법무사",
    "상속등기·상속포기·한정승인 중 무엇이 맞는지부터 가린 뒤 서류와 기한을 안내합니다.",
  ),
  "/부산상속전문법무사": card(
    "inheritance-start",
    "상속, 어떤 절차부터? — 상속 서류를 검토하는 안윤정 법무사",
    "상속등기·상속포기·한정승인 중 무엇이 맞는지부터 가린 뒤 서류와 기한을 안내합니다.",
  ),
  "/부산등기법무사": card(
    "registry-check",
    "등기 전에 확인할 것 — 등기소 등기운영과 민원 창구",
    "등기부·등기 원인 서류·관할 등기소를 먼저 확인한 뒤 접수합니다.",
  ),
  "/부산법인등기": card(
    "corporate-change",
    "법인등기, 변경 사항부터 — 법인 서류와 인감을 정리하는 안윤정 법무사",
    "임원·본점·목적·자본 중 무엇이 바뀌는지 먼저 정리하면 필요한 결의와 서류가 정해집니다.",
  ),
  "/법인등기": card(
    "corporate-change",
    "법인등기, 변경 사항부터 — 법인 서류와 인감을 정리하는 안윤정 법무사",
    "임원·본점·목적·자본 중 무엇이 바뀌는지 먼저 정리하면 필요한 결의와 서류가 정해집니다.",
  ),
  "/부산법인법무사": card(
    "officer-deadline",
    "임원 변경, 2주 안에 등기 — 상법 책이 놓인 사무실에서 업무 중인 안윤정 법무사",
    "임원 변경 등 등기사항이 바뀌면 변경이 생긴 날부터 본점 소재지에서 2주 안에 등기해야 합니다(상법 제317조 제4항·제183조).",
  ),
};

export function getPageTextCard(path: string): PageTextCard | undefined {
  return PAGE_TEXT_CARDS[path];
}
