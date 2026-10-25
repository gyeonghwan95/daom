/**
 * 생성물 — scripts/generate-premium-thumbnails.ts (npm run thumbnails:premium)
 * 직접 수정하지 않는다. 캐러셀 카드·ItemList 전용 1:1 훅 썸네일(가운데 제목, 얼굴과 겹치지 않음).
 */
export type SerpHookImage = {
  src: string;
  alt: string;
  width: 1200;
  height: 1200;
};

export const SERP_HOOK_IMAGES: Record<string, SerpHookImage> = {
  "/부산공탁": { src: "/images/generated/carousel/hooks/부산공탁.webp", alt: "공탁, 어디에 어떻게 맡길까 — 책상에서 서류를 작성하는 안윤정 법무사", width: 1200, height: 1200 },
  "/사상구법무사": { src: "/images/generated/carousel/hooks/사상구법무사.webp", alt: "사상구 사건, 서부지원 관할 — 부산지방법원 서부지원 앞의 안윤정 법무사", width: 1200, height: 1200 },
  "/기장군법무사": { src: "/images/generated/carousel/hooks/기장군법무사.webp", alt: "기장 땅·집, 상속 명의 정리 — 기장군청 전경", width: 1200, height: 1200 },
  "/정관법무사": { src: "/images/generated/carousel/hooks/정관법무사.webp", alt: "정관 아파트, 명의 정리부터 — 기장 우체국 전경", width: 1200, height: 1200 },
  "/강서구법무사": { src: "/images/generated/carousel/hooks/강서구법무사.webp", alt: "명지·녹산, 회사 등기 챙기기 — 사무실에서 서류를 넘겨 보는 안윤정 법무사", width: 1200, height: 1200 },
  "/명지법무사": { src: "/images/generated/carousel/hooks/명지법무사.webp", alt: "명지에서 회사를 세운다면 — 책상에서 계약 서류를 검토하는 안윤정 법무사", width: 1200, height: 1200 },
  "/북구법무사": { src: "/images/generated/carousel/hooks/북구법무사.webp", alt: "북구 집, 상속 명의 정리 — 북구청 청사 전경", width: 1200, height: 1200 },
  "/화명동법무사": { src: "/images/generated/carousel/hooks/화명동법무사.webp", alt: "화명동 아파트, 명의 정리 — 책상에서 서류를 작성하는 안윤정 법무사", width: 1200, height: 1200 },
  "/해운대법무사": { src: "/images/generated/carousel/hooks/해운대법무사.webp", alt: "해운대 사무소에서 직접 상담 — 해운대구청 청사 전경", width: 1200, height: 1200 },
  "/센텀법무사": { src: "/images/generated/carousel/hooks/센텀법무사.webp", alt: "센텀 사무소, 예약하고 방문 — 사무실에서 서류를 넘겨 보는 안윤정 법무사", width: 1200, height: 1200 },
  "/재송동법무사": { src: "/images/generated/carousel/hooks/재송동법무사.webp", alt: "재송동 집, 상속·매매 등기 — 재송2동 행정복지센터 앞의 안윤정 법무사", width: 1200, height: 1200 },
  "/서면법무사": { src: "/images/generated/carousel/hooks/서면법무사.webp", alt: "서면 상가·법인, 등기 정리 — 부산진구청 앞의 안윤정 법무사", width: 1200, height: 1200 },
  "/광안리법무사": { src: "/images/generated/carousel/hooks/광안리법무사.webp", alt: "광안리 전세, 등기부부터 — 전화로 상담하며 메모하는 안윤정 법무사", width: 1200, height: 1200 },
  "/연산동법무사": { src: "/images/generated/carousel/hooks/연산동법무사.webp", alt: "등기국 가기 전, 서류는 미리 — 부산지방법원 등기국 안의 안윤정 법무사", width: 1200, height: 1200 },
  "/부산역법무사": { src: "/images/generated/carousel/hooks/부산역법무사.webp", alt: "초량·부산역, 오래된 집 명의 — 책상에서 서류에 메모하는 안윤정 법무사", width: 1200, height: 1200 },
  "/하단법무사": { src: "/images/generated/carousel/hooks/하단법무사.webp", alt: "하단 아파트, 명의 정리부터 — 법무사 명패가 놓인 책상에서 업무 중인 안윤정 법무사", width: 1200, height: 1200 },
  "/연제구법무사": { src: "/images/generated/carousel/hooks/연제구법무사.webp", alt: "연제구 사건, 법원 서류부터 — 연제구청 청사 전경", width: 1200, height: 1200 },
  "/동래구법무사": { src: "/images/generated/carousel/hooks/동래구법무사.webp", alt: "온천·사직 집, 명의 정리 — 동래구청 청사 전경", width: 1200, height: 1200 },
  "/수영구법무사": { src: "/images/generated/carousel/hooks/수영구법무사.webp", alt: "광안·민락 집, 등기 챙기기 — 수영구청 청사 전경", width: 1200, height: 1200 },
  "/부산진구법무사": { src: "/images/generated/carousel/hooks/부산진구법무사.webp", alt: "서면·전포, 상가·법인 등기 — 부산진구청 청사 전경", width: 1200, height: 1200 },
  "/남구법무사": { src: "/images/generated/carousel/hooks/남구법무사.webp", alt: "대연·문현, 법인등기 정리 — 남구청 청사 전경", width: 1200, height: 1200 },
  "/금정구법무사": { src: "/images/generated/carousel/hooks/금정구법무사.webp", alt: "부곡·장전 집, 상속등기 — 금정구청 청사 전경", width: 1200, height: 1200 },
  "/사하구법무사": { src: "/images/generated/carousel/hooks/사하구법무사.webp", alt: "하단·괴정 아파트 명의 — 사하구청 청사 전경", width: 1200, height: 1200 },
  "/중구법무사": { src: "/images/generated/carousel/hooks/중구법무사.webp", alt: "남포동 상가, 등기부부터 — 중구청 청사 전경", width: 1200, height: 1200 },
  "/영도구법무사": { src: "/images/generated/carousel/hooks/영도구법무사.webp", alt: "영도 집·회사, 등기 정리 — 영도구청 청사 전경", width: 1200, height: 1200 },
  "/서구법무사": { src: "/images/generated/carousel/hooks/서구법무사.webp", alt: "송도·충무동, 상속등기 정리 — 다옴법무사사무소가 있는 해운대 청년채움공간", width: 1200, height: 1200 },
  "/동구법무사": { src: "/images/generated/carousel/hooks/동구법무사.webp", alt: "동구 오래된 집, 명의 정리 — 사무실 책상에서 서류를 작성하는 안윤정 법무사", width: 1200, height: 1200 },
  "/전국상속등기": { src: "/images/generated/carousel/hooks/전국상속등기.webp", alt: "멀리 있는 집도 상속등기 — 부산지방법원 등기국 표지 앞의 안윤정 법무사", width: 1200, height: 1200 },
  "/상속등기비용": { src: "/images/generated/carousel/hooks/상속등기비용.webp", alt: "상속등기, 비용이 얼마일까 — 상속 등기필정보 및 등기완료통지서(개인정보 가림)", width: 1200, height: 1200 },
  "/상속포기비용": { src: "/images/generated/carousel/hooks/상속포기비용.webp", alt: "상속포기 비용, 무엇이 드나요 — 상속재산포기 심판청구 관련 서류(개인정보 가림)", width: 1200, height: 1200 },
  "/부산부동산등기전문법무사": { src: "/images/generated/carousel/hooks/부산부동산등기전문법무사.webp", alt: "잔금일, 등기 순서부터 — 책상에서 서류를 작성하는 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법무사무소": { src: "/images/generated/carousel/hooks/부산법무사무소.webp", alt: "센텀 사무소에서 만나요 — 저녁의 해운대 청년채움공간 표지", width: 1200, height: 1200 },
  "/office": { src: "/images/generated/carousel/hooks/office.webp", alt: "센텀 사무소, 오시는 길 — 사무실 책상에서 서류를 작성하는 안윤정 법무사", width: 1200, height: 1200 },
  "/상속상담전준비서류와비용": { src: "/images/generated/carousel/hooks/상속상담전준비서류와비용.webp", alt: "상담 전, 이것만 챙기세요 — 사무실에서 서류를 넘겨 보는 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법률상담": { src: "/images/generated/carousel/hooks/부산법률상담.webp", alt: "법률 고민, 어디서 물어볼까 — 법무사 명패가 놓인 책상에서 업무 중인 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법무사추천": { src: "/images/generated/carousel/hooks/부산법무사추천.webp", alt: "법무사 고를 때 7가지 기준 — 다옴법무사사무소 로고 앞에 선 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법무사비교": { src: "/images/generated/carousel/hooks/부산법무사비교.webp", alt: "법무사 비교, 같은 기준으로 — 다옴법무사사무소 로고 앞에 선 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법무사비용": { src: "/images/generated/carousel/hooks/부산법무사비용.webp", alt: "법무사 비용, 나눠서 보세요 — 창가 책상에서 서류를 검토하는 안윤정 법무사", width: 1200, height: 1200 },
  "/about": { src: "/images/generated/carousel/hooks/about.webp", alt: "의뢰인 곁의 안윤정 법무사 — 사무실 책상에서 정면을 바라보는 안윤정 법무사", width: 1200, height: 1200 },
  "/resources": { src: "/images/generated/carousel/hooks/resources.webp", alt: "상담 전에 보는 서식·자료 — 서류를 넘기며 내용을 확인하는 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법무사상담": { src: "/images/generated/carousel/hooks/부산법무사상담.webp", alt: "전화 한 통으로 먼저 물어보세요 — 전화로 상담하며 메모하는 안윤정 법무사", width: 1200, height: 1200 },
  "/법무사진로특강": { src: "/images/generated/carousel/hooks/법무사진로특강.webp", alt: "법무사는 어떤 일을 할까 — 양산제일고 법무사 진로 특강 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/법률강의": { src: "/images/generated/carousel/hooks/법률강의.webp", alt: "생활 속 법, 쉽게 풀어드립니다 — 시민도서관 생활법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/전세사기예방교육": { src: "/images/generated/carousel/hooks/전세사기예방교육.webp", alt: "전세 계약 전, 등기부부터 — 전세사기 예방 법률 특강 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/청년생활법률특강": { src: "/images/generated/carousel/hooks/청년생활법률특강.webp", alt: "사회 첫발, 꼭 알아야 할 법 — 청년채움공간 생활법률 특강 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/창업법률교육": { src: "/images/generated/carousel/hooks/창업법률교육.webp", alt: "창업 전에 알아둘 법 — 창원청년비전센터 창업 법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/기업법률교육": { src: "/images/generated/carousel/hooks/기업법률교육.webp", alt: "회사가 놓치는 등기 의무 — 기업 대상 법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/학교법률교육": { src: "/images/generated/carousel/hooks/학교법률교육.webp", alt: "실수가 범죄가 되는 순간 — 학교 생활법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/부산대학교특강": { src: "/images/generated/carousel/hooks/부산대학교특강.webp", alt: "사회 나가기 전 알아둘 계약 — 청년 전세계약 법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법률강사": { src: "/images/generated/carousel/hooks/부산법률강사.webp", alt: "현장 맞춤 법률 강의 — 생활법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법무사강의": { src: "/images/generated/carousel/hooks/부산법무사강의.webp", alt: "실무에서 온 법률 강의 — 생활법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/부산도서관법률특강": { src: "/images/generated/carousel/hooks/부산도서관법률특강.webp", alt: "도서관에서 듣는 생활 법률 — 시민도서관 생활법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/공공기관법률교육": { src: "/images/generated/carousel/hooks/공공기관법률교육.webp", alt: "기관 맞춤 실무 법률교육 — 자립지원전담기관 법률 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/부산사회복지기관강사": { src: "/images/generated/carousel/hooks/부산사회복지기관강사.webp", alt: "복지 현장에 필요한 법 — 자립지원전담기관 전세사기 예방 강의 현장의 안윤정 법무사", width: 1200, height: 1200 },
  "/부산법인설립전문법무사": { src: "/images/generated/carousel/hooks/부산법인설립전문법무사.webp", alt: "법인 설립 전, 정할 것들 — 법인설립 등기 신청 서류(개인정보 가림)", width: 1200, height: 1200 },
  "/업무사례/서울상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-서울상속등기법무사.webp", alt: "서울 집 상속, 부산에서 진행 — 상속 등기필정보 및 등기완료통지서(개인정보 가림)", width: 1200, height: 1200 },
  "/업무사례/용인상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-용인상속등기법무사.webp", alt: "용인 집 상속, 비대면으로 — 창가 책상에서 서류를 검토하는 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/대구상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-대구상속등기법무사.webp", alt: "팔기 전에 상속 명의부터 — 법무사 명패가 놓인 책상에서 업무 중인 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/대전상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-대전상속등기법무사.webp", alt: "흩어진 상속인, 서류 모으기 — 다옴법무사사무소에 걸린 자격·위촉 증서", width: 1200, height: 1200 },
  "/업무사례/울산상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-울산상속등기법무사.webp", alt: "울산 집 상속, 비대면으로 — 법무사 명패가 놓인 책상에서 업무 중인 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/창원상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-창원상속등기법무사.webp", alt: "창원 집 상속, 한 번에 정리 — 법인 서류와 인감을 정리하는 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/김해상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-김해상속등기법무사.webp", alt: "김해 집 상속, 부산에서 진행 — 법무사 명패가 놓인 책상에서 업무 중인 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/양산상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-양산상속등기법무사.webp", alt: "양산 집 상속, 방문 없이 — 책상에서 서류를 확인하는 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/거제상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-거제상속등기법무사.webp", alt: "거제 집 상속, 멀어도 괜찮아요 — 책장 앞 책상에서 업무 중인 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/진주상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-진주상속등기법무사.webp", alt: "빚 확인 먼저, 등기는 그다음 — 사무실에서 서류를 검토하는 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/경주상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-경주상속등기법무사.webp", alt: "농지·임야, 상속 전 확인 — 창가 책상에서 서류를 검토하는 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/구미상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-구미상속등기법무사.webp", alt: "구미·부산 집, 한 번에 상속 — 책상에서 서류 내용을 확인하는 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/밀양상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-밀양상속등기법무사.webp", alt: "흩어진 형제, 서류부터 모으기 — 사무실에서 서류를 넘겨 보는 안윤정 법무사", width: 1200, height: 1200 },
  "/업무사례/통영상속등기법무사": { src: "/images/generated/carousel/hooks/업무사례-통영상속등기법무사.webp", alt: "섬 토지·미등기 주택 상속 — 책상에서 서류에 메모하는 안윤정 법무사", width: 1200, height: 1200 },
};

export function getSerpHookImage(url: string): SerpHookImage | undefined {
  return SERP_HOOK_IMAGES[url];
}
