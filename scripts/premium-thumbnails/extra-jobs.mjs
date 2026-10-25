// 매니페스트 밖에서 쓰이는 썸네일 — 출력 경로·원본 사진·제목을 직접 정한다.
// out이 "reports/"로 시작하면 저장소 루트 기준, 아니면 public 기준 경로.
// 크기를 적지 않으면 1:1(1200×1200).

const O = "/image/og/";
const P = "/image/";

/** 페이지 공유·검색용 og 이미지(4:3 본문 사진은 실물 기록 사진이라 그대로 둔다) */
const OG = [
  ["haeundae-office-nameplate.jpg", "썸네일-정면.jpg", "해운대 사무소에서\n직접 상담"],
  ["metro-daegu.jpg", "썸네일-사무실_겨울 (3).jpg", "대구 집 상속,\n부산에서 진행"],
  ["metro-daejeon.jpg", "썸네일-사무실_겨울 (1).jpg", "대전 집 상속,\n방문 없이"],
  ["metro-seoul.jpg", "og/metro-seoul-4x3.jpg", "서울 집 상속,\n부산에서 진행"],
  ["metro-yongin.jpg", "썸네일-사무실_가을 (1).jpg", "용인 집 상속,\n비대면으로"],
  ["priority-busan-consult.jpg", "썸네일-사무실_전화중.jpg", "전화 한 통으로\n먼저 물어보세요"],
  ["priority-busan-lawyer.jpg", "썸네일-정면.jpg", "안윤정 법무사가\n직접 맡습니다"],
  ["priority-busan-recommend.jpg", "썸네일-사무실_정면.jpg", "법무사 고를 때\n7가지 기준"],
  ["priority-qualified-acceptance.jpg", "썸네일_사무실_서류검토_여름 (5).jpg", "빚이 더 많다면\n먼저 확인할 것"],
  ["priority-deposit-criminal.jpg", "썸네일-동부지원2.jpg", "형사공탁 전\n먼저 볼 것"],
  ["priority-deposit-execution.jpg", "썸네일-사무실_겨울 (2).jpg", "지급하기 전,\n공탁부터 확인"],
  ["priority-deposit-hub.jpg", "썸네일-동부지원.jpg", "공탁, 어디에\n어떻게 맡길까"],
  ["priority-deposit-payment.jpg", "썸네일-서류확인.jpg", "받지 않는 돈,\n변제공탁으로"],
  ["priority-deposit-release.jpg", "썸네일-사무실_겨울 (1).jpg", "맡긴 공탁금,\n찾아가는 방법"],
  ["priority-deposit-security.jpg", "썸네일-서부지원.jpg", "담보공탁,\n명령서부터 확인"],
  ["regional-inheritance-changwon.jpg", "썸네일-사무실_겨울 (4).jpg", "창원 집 상속,\n한 번에 정리"],
  ["regional-inheritance-daegu.jpg", "썸네일-사무실_전화중.jpg", "대구 집 상속,\n방문 없이"],
  ["regional-inheritance-geoje.jpg", "썸네일-사무실_작업중.jpg", "거제 집 상속,\n멀어도 괜찮아요"],
  ["regional-inheritance-gimhae.jpg", "썸네일-사무실_겨울 (3).jpg", "김해 집 상속,\n부산에서 진행"],
  ["regional-inheritance-gumi.jpg", "썸네일-사무실_가을 (3).jpg", "구미·부산 집,\n한 번에 상속"],
  ["regional-inheritance-gyeongju.jpg", "썸네일-사무실_가을 (1).jpg", "농지 상속,\n먼저 확인할 것"],
  ["regional-inheritance-hub.jpg", "썸네일-부산지방등기국.jpg", "멀리 있는 집도\n상속등기"],
  ["regional-inheritance-jinju.jpg", "썸네일_사무실_서류검토_여름 (5).jpg", "빚 확인 먼저,\n등기는 그다음"],
  ["regional-inheritance-miryang.jpg", "썸네일-사무실_겨울 (1).jpg", "흩어진 형제,\n서류부터 모으기"],
  ["regional-inheritance-tongyeong.jpg", "썸네일-사무실_겨울 (2).jpg", "미등기 주택,\n상속 정리"],
  ["regional-inheritance-yangsan.jpg", "썸네일-서류확인.jpg", "양산 집 상속,\n방문 없이"],
  ["ship-busan.jpg", "썸네일-부산지방법원등기국.jpg", "부산 선박,\n등기부터 확인"],
  ["ship-changwon.jpg", "썸네일-사무실_가을 (2).jpg", "창원 선박,\n명의 정리"],
  ["ship-geoje.jpg", "썸네일-아래.jpg", "거제 선박,\n넘겨받기 전에"],
  ["ship-gyeongju.jpg", "썸네일-사무실.jpg", "경주 선박,\n관할부터 확인"],
  ["ship-hub.jpg", "썸네일-부산지방등기국.jpg", "선박등기,\n먼저 확인할 것"],
  ["ship-inheritance.jpg", "썸네일-사무실_겨울 (3).jpg", "선박 상속,\n먼저 볼 네 가지"],
  ["ship-manager.jpg", "썸네일_사무실_여름 (13).jpg", "선박관리인,\n선임 전에 정할 것"],
  ["ship-pohang.jpg", "썸네일-계약임원.jpg", "낙찰받은 배,\n먼저 확인할 것"],
  ["ship-tongyeong.jpg", "썸네일-사무실_겨울 (4).jpg", "통영 어선,\n공동상속 정리"],
  ["ship-uljin.jpg", "썸네일-서류확인.jpg", "등기냐 등록이냐,\n증서로 구분"],
  ["ship-ulsan.jpg", "썸네일-사무실.jpg", "울산 선박,\n명의변경 전에"],
  ["ship-vs-registration.jpg", "썸네일-등기운영과.jpg", "선박등기와\n선박등록의 차이"],
  ["ship-yeongdeok.jpg", "썸네일-정면.jpg", "어선 증여,\n하기 전에 정할 것"],
].map(([file, photo, title]) => ({ set: "og", out: O + file, photo: P + photo, title }));

/** 본문 텍스트 카드(PageTextCardFigure) + /office·/resources og */
const CARDS = [
  ["consult-prep", "썸네일_사무실_여름 (13).jpg", "상담 전,\n이것만 챙기세요"],
  ["select-criteria", "썸네일-사무실_정면.jpg", "법무사 고를 때\n볼 기준"],
  ["office-visit", "썸네일-사무실_겨울 (3).jpg", "센텀 사무소,\n예약하고 방문"],
  ["inheritance-start", "썸네일_사무실_서류검토_여름 (5).jpg", "상속, 어떤\n절차부터?"],
  ["registry-check", "썸네일-등기운영과.jpg", "등기 전에\n확인할 것"],
  ["corporate-change", "썸네일-사무실_겨울 (4).jpg", "법인등기,\n변경 사항부터"],
  ["officer-deadline", "썸네일-사무실_작업중.jpg", "임원 변경,\n2주 안에 등기"],
  ["inheritance-registration-prep", "서류/신청서_상속 (8).jpg", "상속등기,\n준비할 서류"],
  ["renunciation-check", "서류/서류_상속포기.jpg", "상속포기,\n신청 전 확인"],
  ["qualified-acceptance", "썸네일-사무실_가을 (2).jpg", "한정승인,\n재산과 채무부터"],
  ["company-establishment-prep", "서류/신청서_법인설립.jpg", "법인설립,\n준비할 자료"],
  ["foreign-shareholder", "서류/서류_공증.jpg", "외국인 주주가\n있다면 먼저"],
].map(([id, photo, title]) => ({ set: "card", out: `/image/cards/${id}.jpg`, photo: P + photo, title }));

/** 자료실 정리표 og (검증: 1200×1200) */
const RESOURCES = [
  ["inheritance-family", "썸네일-사무실_겨울 (2).jpg", "상속등기 앞둔\n가족이 볼 6가지"],
  ["inheritance-overseas", "서류/서류_공증.jpg", "해외 사는 가족,\n상속등기 준비"],
  ["property-closing", "썸네일-등기필증_매매증여.jpg", "잔금 전,\n서류·등기 일정"],
  ["unpaid-evidence", "썸네일-사무실_전화중.jpg", "미수금 청구 전\n모아둘 자료"],
  ["company-change", "썸네일-사무실_겨울 (4).jpg", "임원·본점 변경 전\n정리할 자료"],
].map(([slug, photo, title]) => ({
  set: "resource",
  out: `/resources/og/${slug}-v2026.10.11-1.png`,
  photo: P + photo,
  title,
}));

/** 네이버 블로그 업로드용(대표 1:1, 본문 2:1) */
const B = "reports/naver-15kw-2026-10-14/blog-editor-pack/";
const BLOG = [
  [`${B}A-qualified-acceptance/대표이미지-한정승인-1x1.jpg`, "썸네일-사무실_가을 (2).jpg", "빚이 더 많을지\n모른다면", 1200, 1200],
  [`${B}A-qualified-acceptance/본문이미지-한정승인-가로.jpg`, "썸네일-사무실_가을 (2).jpg", "한정승인,\n재산과 채무부터", 1200, 600],
  [`${B}B-company-establishment/대표이미지-법인설립-1x1.jpg`, "썸네일-사무실_겨울 (4).jpg", "회사를 세우기 전\n정할 것들", 1200, 1200],
  [`${B}B-company-establishment/본문이미지-법인설립-가로.jpg`, "서류/신청서_법인설립.jpg", "법인설립,\n준비할 자료", 1200, 600],
  [`${B}C-corporate-change/대표이미지-법인변경등기-1x1.jpg`, "썸네일-계약임원.jpg", "회사가 바뀌면\n등기도 바꿔야", 1200, 1200],
  [`${B}C-corporate-change/본문이미지-임원변경기한-가로.jpg`, "썸네일-사무실_작업중.jpg", "임원 변경,\n2주 안에 등기", 1200, 600],
].map(([out, photo, title, width, height]) => ({ set: "blog", out, photo: P + photo, title, width, height }));

export const EXTRA_JOBS = [...OG, ...CARDS, ...RESOURCES, ...BLOG];
