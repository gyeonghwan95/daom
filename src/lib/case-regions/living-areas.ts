import type { CaseRegionEntry, DistrictKey } from "./types";

type LivingSeed = {
  name: string;
  slug: string;
  parent: DistrictKey;
  traits: CaseRegionEntry["traits"];
  context: string;
  keywords?: string[];
  indexable?: boolean;
  canonicalSlug?: string;
};

const livingSeeds: LivingSeed[] = [
  // 원도심
  { name: "국제시장", slug: "부산국제시장법무사", parent: "jung", traits: ["market", "commercial", "oldtown"], context: "원도심 상가·점포 권리와 상속·매매등기가 맞물리는 상권입니다." },
  { name: "자갈치시장", slug: "부산자갈치시장법무사", parent: "jung", traits: ["market", "commercial", "oldtown"], context: "전통시장 인근 상가·주택의 소유권·임대차 관련 등기 문의가 있는 생활권입니다." },
  { name: "부평깡통시장", slug: "부산부평깡통시장법무사", parent: "jung", traits: ["market", "commercial", "oldtown"], context: "원도심 소규모 상가와 주거가 인접한 상권으로 권리관계 정리가 필요한 경우가 있습니다." },
  { name: "부산근대역사관", slug: "부산근대역사관법무사", parent: "jung", traits: ["oldtown", "tourism"], context: "중구 원도심 문화시설 인근 주거·상가 등기 상담이 이어지는 구간입니다.", indexable: false, canonicalSlug: "중구법무사" },
  { name: "부산대학병원", slug: "부산대학병원법무사", parent: "seo", traits: ["university", "residential"], context: "병원 인근 거주·상속·부동산 이전 일정을 맞추는 상담이 있습니다." },
  { name: "동아대병원", slug: "부산동아대병원법무사", parent: "seo", traits: ["university", "residential"], context: "서구 병원 생활권 인근 주거 매매·상속등기 문의가 있습니다.", indexable: false, canonicalSlug: "서구법무사" },
  { name: "송도해수욕장", slug: "부산송도해수욕장법무사", parent: "seo", traits: ["coastal", "tourism", "residential"], context: "송도 해안 주거·상가와 관광 생활권이 겹치는 지역입니다." },
  { name: "송도해상케이블카", slug: "부산송도해상케이블카법무사", parent: "seo", traits: ["tourism", "coastal"], context: "송도 관광 축 인근 부동산 상담이 이어지는 구간입니다.", indexable: false, canonicalSlug: "부산송도해수욕장법무사" },

  // 동구·영도
  { name: "부산역", slug: "부산역법무사", parent: "dong", traits: ["station", "commercial", "port"], context: "역세권 상가·오피스·주거 이전등기와 법인 본점 관련 문의가 많은 거점입니다." },
  { name: "초량역", slug: "부산초량역법무사", parent: "dong", traits: ["station", "residential"], context: "초량 역세권 주거·상가 매매등기 상담이 있는 생활권입니다.", indexable: false, canonicalSlug: "부산초량동법무사" },
  { name: "부산진역", slug: "부산진역법무사", parent: "dong", traits: ["station", "commercial"], context: "동구 역세권 상권과 연결된 부동산·법인 상담 구간입니다.", indexable: false, canonicalSlug: "동구법무사" },
  { name: "북항", slug: "부산북항법무사", parent: "dong", traits: ["port", "commercial"], context: "북항 재개발·항만 배후 상권과 맞닿은 부동산·법인 업무 문의가 있습니다." },
  { name: "부산항", slug: "부산항법무사", parent: "dong", traits: ["port", "industrial"], context: "항만·물류 배후 지역의 사업장·부동산 등기 일정을 맞추는 상담이 있습니다." },
  { name: "부산항국제여객터미널", slug: "부산항국제여객터미널법무사", parent: "dong", traits: ["port", "tourism"], context: "여객터미널 인근 상업·주거 등기 문의가 이어지는 구간입니다.", indexable: false, canonicalSlug: "부산항법무사" },
  { name: "차이나타운", slug: "부산차이나타운법무사", parent: "dong", traits: ["commercial", "oldtown"], context: "초량 일대 상가·점포 권리관계 정리가 필요한 경우가 있습니다." },
  { name: "영도대교", slug: "부산영도대교법무사", parent: "yeongdo", traits: ["port", "residential"], context: "영도 진입 생활권의 주거·상가 등기 상담이 있는 구간입니다.", indexable: false, canonicalSlug: "영도구법무사" },
  { name: "태종대", slug: "부산태종대법무사", parent: "yeongdo", traits: ["tourism", "coastal"], context: "관광·주거가 공존하는 영도 해안 생활권입니다." },
  { name: "흰여울문화마을", slug: "부산흰여울문화마을법무사", parent: "yeongdo", traits: ["tourism", "residential"], context: "문화마을 인근 소규모 주택·상가 권리 상담이 있습니다." },
  { name: "동삼혁신지구", slug: "부산동삼혁신지구법무사", parent: "yeongdo", traits: ["newtown", "industrial", "port"], context: "혁신지구 입주·이전과 맞물린 법인·부동산등기 문의가 있습니다." },
  { name: "국립해양박물관", slug: "부산국립해양박물관법무사", parent: "yeongdo", traits: ["tourism", "coastal"], context: "영도 해양 문화시설 인근 생활권의 부동산 상담 구간입니다.", indexable: false, canonicalSlug: "영도구법무사" },

  // 부산진구
  { name: "서면", slug: "부산서면법무사", parent: "busanjin", traits: ["commercial", "station", "market"], context: "부산의 대표 도심 상권으로 잔금일 등기, 상가 이전, 법인 업무 문의가 많은 거점입니다." },
  { name: "서면1번가", slug: "부산서면1번가법무사", parent: "busanjin", traits: ["commercial"], context: "서면 핵심 상권의 점포·상가 권리관계가 잦은 구간입니다.", indexable: false, canonicalSlug: "부산서면법무사" },
  { name: "전포카페거리", slug: "부산전포카페거리법무사", parent: "busanjin", traits: ["commercial", "residential"], context: "전포 상권·주거 밀집지의 매매·임대 관련 등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산전포동법무사" },
  { name: "부산시민공원", slug: "부산시민공원법무사", parent: "busanjin", traits: ["residential"], context: "시민공원 인근 주거 단지의 이전·상속등기 문의가 있는 생활권입니다." },
  { name: "부전시장", slug: "부산부전시장법무사", parent: "busanjin", traits: ["market", "commercial"], context: "시장·상가 밀집지의 점포 권리와 부동산등기 상담이 있습니다." },
  { name: "부전역", slug: "부산부전역법무사", parent: "busanjin", traits: ["station", "commercial"], context: "부전 역세권 상가·주거 등기 일정을 맞추는 상담이 있습니다.", indexable: false, canonicalSlug: "부산부전동법무사" },
  { name: "양정역", slug: "부산양정역법무사", parent: "busanjin", traits: ["station", "residential"], context: "양정 역세권 주거·상가 이전등기 문의가 있는 구간입니다.", indexable: false, canonicalSlug: "부산양정동법무사" },
  { name: "가야역", slug: "부산가야역법무사", parent: "busanjin", traits: ["station", "residential"], context: "가야 생활권 아파트·상가 등기 상담이 이어집니다.", indexable: false, canonicalSlug: "부산가야동법무사" },
  { name: "동의대역", slug: "부산동의대역법무사", parent: "busanjin", traits: ["station", "university"], context: "대학·주거가 인접한 역세권의 부동산등기 문의가 있습니다." },
  { name: "개금역", slug: "부산개금역법무사", parent: "busanjin", traits: ["station", "residential"], context: "개금 주거 밀집지의 소유권이전·상속 상담이 있는 생활권입니다.", indexable: false, canonicalSlug: "부산개금동법무사" },

  // 동래
  { name: "동래역", slug: "부산동래역법무사", parent: "dongnae", traits: ["station", "commercial"], context: "동래 역세권 상권·주거의 매매등기 상담이 많은 거점입니다." },
  { name: "미남역", slug: "부산미남역법무사", parent: "dongnae", traits: ["station", "residential"], context: "미남 교차 생활권의 아파트 이전·상속등기 문의가 있습니다." },
  { name: "사직역", slug: "부산사직역법무사", parent: "dongnae", traits: ["station", "residential"], context: "사직 주거·체육시설 인근의 부동산등기 상담이 이어집니다.", indexable: false, canonicalSlug: "부산사직동법무사" },
  { name: "온천장", slug: "부산온천장법무사", parent: "dongnae", traits: ["oldtown", "commercial", "residential"], context: "온천장 전통 생활권의 상가·주택 권리 정리 문의가 있습니다." },
  { name: "온천장역", slug: "부산온천장역법무사", parent: "dongnae", traits: ["station"], context: "온천장 역세권 등기 상담 구간입니다.", indexable: false, canonicalSlug: "부산온천장법무사" },
  { name: "동래시장", slug: "부산동래시장법무사", parent: "dongnae", traits: ["market", "commercial"], context: "시장 상권의 점포·상가 등기 일정을 맞추는 상담이 있습니다." },
  { name: "사직야구장", slug: "부산사직야구장법무사", parent: "dongnae", traits: ["residential", "tourism"], context: "사직 일대 주거·상가 생활권의 부동산 상담이 있습니다.", indexable: false, canonicalSlug: "부산사직동법무사" },
  { name: "동래구청", slug: "부산동래구청법무사", parent: "dongnae", traits: ["residential"], context: "구청 인근 행정·주거 생활권의 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "동래구법무사" },
  { name: "동래문화회관", slug: "부산동래문화회관법무사", parent: "dongnae", traits: ["residential"], context: "동래 문화시설 인근 주거 등기 상담 구간입니다.", indexable: false, canonicalSlug: "동래구법무사" },

  // 남구
  { name: "문현금융단지", slug: "부산문현금융단지법무사", parent: "nam", traits: ["finance", "commercial"], context: "금융·오피스 밀집지로 법인등기·오피스 이전·담보등기 문의가 많은 업무지구입니다." },
  { name: "부산국제금융센터", slug: "부산국제금융센터법무사", parent: "nam", traits: ["finance", "commercial"], context: "BIFC 일대 기업·전문직의 법인·부동산등기 일정을 맞추는 상담이 있습니다." },
  { name: "BIFC", slug: "부산BIFC법무사", parent: "nam", traits: ["finance"], context: "문현 금융업무지구 법인·오피스 관련 등기 문의입니다.", indexable: false, canonicalSlug: "부산국제금융센터법무사" },
  { name: "대연혁신지구", slug: "부산대연혁신지구법무사", parent: "nam", traits: ["newtown", "university"], context: "대연 일대 주거·업무 변화와 맞물린 등기·법인 상담이 있습니다." },
  { name: "경성대", slug: "부산경성대법무사", parent: "nam", traits: ["university", "residential"], context: "대학가 임대·주거 매매등기 상담이 있는 생활권입니다." },
  { name: "부경대", slug: "부산부경대법무사", parent: "nam", traits: ["university", "residential"], context: "부경대 인근 주거·상가 등기 문의가 이어집니다." },
  { name: "용호만", slug: "부산용호만법무사", parent: "nam", traits: ["coastal", "residential"], context: "용호 해안 주거지의 아파트·상가 이전등기 상담이 있습니다." },
  { name: "이기대", slug: "부산이기대법무사", parent: "nam", traits: ["coastal", "tourism"], context: "이기대 공원 인근 주거 생활권의 부동산 상담 구간입니다.", indexable: false, canonicalSlug: "부산용호동법무사" },
  { name: "문현역", slug: "부산문현역법무사", parent: "nam", traits: ["station", "finance"], context: "문현 역세권·금융단지 인접 등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산문현동법무사" },
  { name: "못골역", slug: "부산못골역법무사", parent: "nam", traits: ["station", "residential"], context: "대연·못골 생활권 주거 등기 문의가 있는 구간입니다." },
  { name: "대연역", slug: "부산대연역법무사", parent: "nam", traits: ["station", "university"], context: "대연 역세권 주거·상가 등기 상담이 이어집니다.", indexable: false, canonicalSlug: "부산대연동법무사" },

  // 북구
  { name: "화명신도시", slug: "부산화명신도시법무사", parent: "buk", traits: ["newtown", "residential"], context: "화명 신도시 아파트 단지의 소유권이전·상속·담보등기 문의가 많은 생활권입니다." },
  { name: "구포역", slug: "부산구포역법무사", parent: "buk", traits: ["station", "market"], context: "구포 역세권·시장 생활권의 상가·주택 등기 상담이 있습니다." },
  { name: "구포시장", slug: "부산구포시장법무사", parent: "buk", traits: ["market", "commercial"], context: "시장 상권의 점포 권리·부동산등기 일정을 맞추는 상담이 있습니다.", indexable: false, canonicalSlug: "부산구포역법무사" },
  { name: "만덕역", slug: "부산만덕역법무사", parent: "buk", traits: ["station", "residential"], context: "만덕 주거 밀집지의 이전·상속등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산만덕동법무사" },
  { name: "화명역", slug: "부산화명역법무사", parent: "buk", traits: ["station", "newtown"], context: "화명 역세권 아파트 등기 상담이 이어집니다.", indexable: false, canonicalSlug: "부산화명신도시법무사" },
  { name: "율리역", slug: "부산율리역법무사", parent: "buk", traits: ["station", "residential"], context: "금곡·율리 생활권 주거 등기 문의가 있는 구간입니다." },
  { name: "금곡역", slug: "부산금곡역법무사", parent: "buk", traits: ["station", "residential"], context: "금곡 주거 단지의 부동산등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산금곡동법무사" },
  { name: "덕천역", slug: "부산덕천역법무사", parent: "buk", traits: ["station", "commercial"], context: "덕천 교차 생활권의 상가·주거 등기 문의가 많은 거점입니다." },
  { name: "북구청", slug: "부산북구청법무사", parent: "buk", traits: ["residential"], context: "북구청 인근 행정·주거 생활권의 등기 상담입니다.", indexable: false, canonicalSlug: "북구법무사" },
  { name: "부산과학기술대학교", slug: "부산과학기술대학교법무사", parent: "buk", traits: ["university"], context: "대학 인근 주거·상가 등기 문의가 있는 생활권입니다." },

  // 해운대
  { name: "해운대", slug: "부산해운대법무사", parent: "haeundae", traits: ["coastal", "tourism", "commercial", "residential"], context: "해수욕장·관광·주거가 겹친 대표 생활권으로 부동산·상속·법인 문의가 고루 있습니다." },
  { name: "센텀", slug: "부산센텀법무사", parent: "haeundae", traits: ["finance", "commercial", "station"], context: "센텀시티 업무·주거 밀집지로 법인등기, 오피스·아파트 이전, 잔금일 협업 문의가 많은 거점입니다." },
  { name: "센텀시티", slug: "부산센텀시티법무사", parent: "haeundae", traits: ["finance", "commercial"], context: "센텀 업무지구 기업·전문직의 등기 일정을 맞추는 상담이 있습니다.", indexable: false, canonicalSlug: "부산센텀법무사" },
  { name: "마린시티", slug: "부산마린시티법무사", parent: "haeundae", traits: ["coastal", "residential", "commercial"], context: "해안 고층 주거·상가의 매매·담보·상속등기 상담이 있는 생활권입니다." },
  { name: "엘시티", slug: "부산엘시티법무사", parent: "haeundae", traits: ["coastal", "residential", "commercial"], context: "해운대 해안 주거·상업시설 인근의 부동산등기 문의가 있습니다." },
  { name: "벡스코", slug: "부산벡스코법무사", parent: "haeundae", traits: ["commercial", "finance"], context: "전시·컨벤션 배후 업무지역의 법인·오피스 등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산센텀법무사" },
  { name: "센텀역", slug: "부산센텀역법무사", parent: "haeundae", traits: ["station", "finance"], context: "센텀 역세권 업무·주거 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산센텀법무사" },
  { name: "재송역", slug: "부산재송역법무사", parent: "haeundae", traits: ["station", "residential"], context: "재송 주거 밀집지의 이전·상속등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산재송동법무사" },
  { name: "해운대역", slug: "부산해운대역법무사", parent: "haeundae", traits: ["station", "tourism"], context: "해운대 역세권 관광·주거 등기 문의가 있는 거점입니다.", indexable: false, canonicalSlug: "부산해운대법무사" },
  { name: "중동역", slug: "부산중동역법무사", parent: "haeundae", traits: ["station", "residential"], context: "중동 주거·상가 생활권의 부동산등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산중동법무사" },
  { name: "장산역", slug: "부산장산역법무사", parent: "haeundae", traits: ["station", "residential"], context: "좌동·장산 생활권 아파트 등기 문의가 많은 구간입니다." },
  { name: "송정역", slug: "부산송정역법무사", parent: "haeundae", traits: ["station", "coastal"], context: "송정 해안·주거 생활권의 부동산등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산송정동법무사" },
  { name: "반여농산물시장", slug: "부산반여농산물시장법무사", parent: "haeundae", traits: ["market", "residential"], context: "반여 시장·주거 일대의 상가·주택 등기 문의가 있습니다." },
  { name: "달맞이길", slug: "부산달맞이길법무사", parent: "haeundae", traits: ["coastal", "tourism", "residential"], context: "달맞이 언덕 주거·상가의 매매등기 상담이 있는 해안 생활권입니다." },
  { name: "미포", slug: "부산미포법무사", parent: "haeundae", traits: ["coastal", "tourism"], context: "미포 해안 관광·주거 구간의 부동산 상담입니다.", indexable: false, canonicalSlug: "부산해운대법무사" },
  { name: "청사포", slug: "부산청사포법무사", parent: "haeundae", traits: ["coastal", "tourism"], context: "청사포 해안 생활권의 주거·상가 등기 문의가 있습니다." },
  { name: "해운대해수욕장", slug: "부산해운대해수욕장법무사", parent: "haeundae", traits: ["coastal", "tourism", "commercial"], context: "해수욕장 상권·주거의 매매·임대 관련 등기 상담이 많은 구간입니다.", indexable: false, canonicalSlug: "부산해운대법무사" },
  { name: "송정해수욕장", slug: "부산송정해수욕장법무사", parent: "haeundae", traits: ["coastal", "tourism"], context: "송정 해변 생활권의 부동산등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산송정동법무사" },

  // 수영
  { name: "광안리", slug: "부산광안리법무사", parent: "suyeong", traits: ["coastal", "tourism", "commercial", "residential"], context: "광안리 해변 상권·주거의 이전등기·상가 권리 상담이 많은 대표 생활권입니다." },
  { name: "광안대교", slug: "부산광안대교법무사", parent: "suyeong", traits: ["coastal", "tourism"], context: "광안 해안 경관 생활권의 부동산 상담 구간입니다.", indexable: false, canonicalSlug: "부산광안리법무사" },
  { name: "광안역", slug: "부산광안역법무사", parent: "suyeong", traits: ["station", "coastal"], context: "광안 역세권 주거·상가 등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산광안동법무사" },
  { name: "금련산역", slug: "부산금련산역법무사", parent: "suyeong", traits: ["station", "residential"], context: "남천·금련산 생활권 주거 등기 상담이 이어집니다." },
  { name: "남천역", slug: "부산남천역법무사", parent: "suyeong", traits: ["station", "residential"], context: "남천 주거 밀집지의 이전·상속등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산남천동법무사" },
  { name: "수영역", slug: "부산수영역법무사", parent: "suyeong", traits: ["station", "commercial"], context: "수영 교차 생활권의 상가·주거 등기 상담이 있는 거점입니다." },
  { name: "망미역", slug: "부산망미역법무사", parent: "suyeong", traits: ["station", "residential"], context: "망미 주거·상권 생활권의 부동산등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산망미동법무사" },
  { name: "민락수변공원", slug: "부산민락수변공원법무사", parent: "suyeong", traits: ["coastal", "residential"], context: "민락 수변 주거·상가의 등기 상담이 있는 구간입니다.", indexable: false, canonicalSlug: "부산민락동법무사" },
  { name: "민락항", slug: "부산민락항법무사", parent: "suyeong", traits: ["coastal", "commercial"], context: "민락항 인근 상업·주거 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산민락동법무사" },
  { name: "망미단길", slug: "부산망미단길법무사", parent: "suyeong", traits: ["commercial", "residential"], context: "망미 골목 상권의 점포·주택 권리 상담이 있습니다." },
  { name: "수영교차로", slug: "부산수영교차로법무사", parent: "suyeong", traits: ["commercial", "station"], context: "수영 교차로 일대 상가·주거 등기 일정을 맞추는 상담이 있습니다.", indexable: false, canonicalSlug: "수영구법무사" },

  // 사하
  { name: "다대포", slug: "부산다대포법무사", parent: "saha", traits: ["coastal", "tourism", "residential"], context: "다대포 해안·주거 생활권의 이전·상속등기 상담이 있습니다." },
  { name: "감천문화마을", slug: "부산감천문화마을법무사", parent: "saha", traits: ["tourism", "residential"], context: "문화마을 인근 소규모 주택·상가 권리 정리 문의가 있습니다." },
  { name: "하단오거리", slug: "부산하단오거리법무사", parent: "saha", traits: ["commercial", "station"], context: "하단 교통·상권 거점의 상가·주거 등기 상담이 많은 구간입니다." },
  { name: "다대포해수욕장역", slug: "부산다대포해수욕장역법무사", parent: "saha", traits: ["station", "coastal"], context: "다대 해수욕장 역세권 등기 문의입니다.", indexable: false, canonicalSlug: "부산다대포법무사" },
  { name: "신평역", slug: "부산신평역법무사", parent: "saha", traits: ["station", "industrial"], context: "신평 주거·산업 인접지의 부동산·법인등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산신평동법무사" },
  { name: "장림역", slug: "부산장림역법무사", parent: "saha", traits: ["station", "industrial"], context: "장림 산업·주거 생활권의 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산장림동법무사" },
  { name: "낫개역", slug: "부산낫개역법무사", parent: "saha", traits: ["station", "residential"], context: "다대·낫개 생활권 주거 등기 상담이 있습니다." },
  { name: "동매역", slug: "부산동매역법무사", parent: "saha", traits: ["station", "residential"], context: "괴정·동매 일대 주거 등기 문의가 있는 구간입니다." },
  { name: "하단역", slug: "부산하단역법무사", parent: "saha", traits: ["station", "commercial"], context: "하단 역세권 상가·주거 등기 상담이 많은 거점입니다.", indexable: false, canonicalSlug: "부산하단오거리법무사" },
  { name: "부산현대미술관", slug: "부산현대미술관법무사", parent: "saha", traits: ["tourism", "coastal"], context: "을숙도·미술관 인근 생활권의 부동산 상담 구간입니다.", indexable: false, canonicalSlug: "사하구법무사" },

  // 사상
  { name: "사상역", slug: "부산사상역법무사", parent: "sasang", traits: ["station", "commercial"], context: "사상 교통 거점의 상가·주거·법인 등기 문의가 많은 생활권입니다." },
  { name: "부산서부버스터미널", slug: "부산서부버스터미널법무사", parent: "sasang", traits: ["station", "commercial"], context: "서부터미널 배후 상권·주거의 부동산등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산사상역법무사" },
  { name: "서부시외버스터미널", slug: "부산서부시외버스터미널법무사", parent: "sasang", traits: ["station"], context: "사상 터미널 생활권 등기 문의입니다.", indexable: false, canonicalSlug: "부산사상역법무사" },
  { name: "주례역", slug: "부산주례역법무사", parent: "sasang", traits: ["station", "residential"], context: "주례 주거·상가 생활권의 이전등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산주례동법무사" },
  { name: "냉정역", slug: "부산냉정역법무사", parent: "sasang", traits: ["station", "residential"], context: "냉정 일대 주거 등기 문의가 있는 구간입니다." },
  { name: "괘법르네시떼역", slug: "부산괘법르네시떼역법무사", parent: "sasang", traits: ["station", "commercial"], context: "괘법 상권·주거 등기 상담이 이어집니다.", indexable: false, canonicalSlug: "부산괘법동법무사" },
  { name: "삼락생태공원", slug: "부산삼락생태공원법무사", parent: "sasang", traits: ["residential"], context: "삼락 일대 주거·근린 생활권의 부동산 상담입니다.", indexable: false, canonicalSlug: "부산삼락동법무사" },
  { name: "사상공업지역", slug: "부산사상공업지역법무사", parent: "sasang", traits: ["industrial"], context: "공업지역 공장·창고·법인 사업장 등기 문의가 있는 업무 구간입니다." },
  { name: "학장공단", slug: "부산학장공단법무사", parent: "sasang", traits: ["industrial"], context: "학장 공단 입주 기업의 법인·부동산등기 상담이 있습니다." },

  // 금정
  { name: "부산대", slug: "부산대법무사", parent: "geumjeong", traits: ["university", "residential"], context: "부산대 일대 대학가 주거·상가 매매등기 상담이 많은 생활권입니다." },
  { name: "부산대역", slug: "부산대역법무사", parent: "geumjeong", traits: ["station", "university"], context: "부산대 역세권 주거·상가 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산대법무사" },
  { name: "장전역", slug: "부산장전역법무사", parent: "geumjeong", traits: ["station", "university"], context: "장전 대학·주거 생활권의 부동산등기 상담이 있습니다.", indexable: false, canonicalSlug: "부산장전동법무사" },
  { name: "구서역", slug: "부산구서역법무사", parent: "geumjeong", traits: ["station", "residential"], context: "구서 주거 밀집지의 이전·상속등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산구서동법무사" },
  { name: "두실역", slug: "부산두실역법무사", parent: "geumjeong", traits: ["station", "residential"], context: "두실 생활권 주거 등기 상담이 있는 구간입니다." },
  { name: "남산역", slug: "부산남산역법무사", parent: "geumjeong", traits: ["station", "residential"], context: "남산동 주거 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산남산동법무사" },
  { name: "범어사역", slug: "부산범어사역법무사", parent: "geumjeong", traits: ["station", "tourism"], context: "범어사 인근 생활권의 부동산 상담 구간입니다." },
  { name: "노포역", slug: "부산노포역법무사", parent: "geumjeong", traits: ["station", "commercial"], context: "노포 터미널·역세권의 상가·주거 등기 문의가 있는 거점입니다." },
  { name: "금정구청", slug: "부산금정구청법무사", parent: "geumjeong", traits: ["residential"], context: "구청 인근 행정·주거 생활권의 등기 상담입니다.", indexable: false, canonicalSlug: "금정구법무사" },
  { name: "금사공업지역", slug: "부산금사공업지역법무사", parent: "geumjeong", traits: ["industrial"], context: "금사 공업지역 사업장·공장 등기 문의가 있습니다." },

  // 강서
  { name: "명지", slug: "부산명지법무사", parent: "gangseo", traits: ["newtown", "residential"], context: "명지 신도시 주거의 소유권이전·신축 관련 등기 상담이 많은 생활권입니다." },
  { name: "명지국제신도시", slug: "부산명지국제신도시법무사", parent: "gangseo", traits: ["newtown", "residential"], context: "명지국제신도시 아파트·상가 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산명지법무사" },
  { name: "에코델타시티", slug: "부산에코델타시티법무사", parent: "gangseo", traits: ["newtown", "industrial", "residential"], context: "에코델타시티 개발·입주와 맞물린 보존등기·이전등기·법인 업무 문의가 있는 신도시 권역입니다." },
  { name: "가덕도", slug: "부산가덕도법무사", parent: "gangseo", traits: ["coastal", "port"], context: "가덕도 일대 토지·건축물 권리와 관련한 등기 상담이 있습니다." },
  { name: "부산신항", slug: "부산신항법무사", parent: "gangseo", traits: ["port", "industrial"], context: "신항 물류·산업 배후의 공장·창고·법인등기 문의가 많은 업무 권역입니다." },
  { name: "가덕도신공항", slug: "부산가덕도신공항법무사", parent: "gangseo", traits: ["port", "newtown"], context: "신공항 계획 권역과 맞닿은 토지·사업장 권리 상담이 있습니다." },
  { name: "서부산권", slug: "부산서부산권법무사", parent: "gangseo", traits: ["industrial", "newtown"], context: "서부산 산업·신도시 권역의 법인·부동산등기 일정을 맞추는 상담이 있습니다." },
  { name: "국제산업물류도시", slug: "부산국제산업물류도시법무사", parent: "gangseo", traits: ["industrial", "port"], context: "물류·산업단지 입주 기업의 등기·법인 변경 문의가 있습니다." },
  { name: "부산연구개발특구", slug: "부산연구개발특구법무사", parent: "gangseo", traits: ["industrial", "university"], context: "R&D·특구 입주 기업의 법인등기 상담이 이어집니다." },
  { name: "녹산국가산업단지", slug: "부산녹산국가산업단지법무사", parent: "gangseo", traits: ["industrial"], context: "녹산산단 공장·사업장 부동산·법인등기 문의가 많은 산업 권역입니다." },

  // 연제
  { name: "부산시청", slug: "부산시청법무사", parent: "yeonje", traits: ["commercial", "station"], context: "시청 인근 업무·주거 생활권의 등기·법인 상담이 있습니다." },
  { name: "부산법원", slug: "부산법원법무사", parent: "yeonje", traits: ["court", "registry"], context: "법원 인근에서 소송·회생·등기 일정과 맞춘 법무사 업무 문의가 많은 거점입니다.", indexable: false, canonicalSlug: "부산지방법원법무사" },
  { name: "거제역", slug: "부산거제역법무사", parent: "yeonje", traits: ["station", "court"], context: "거제 역세권·법원 생활권의 등기 상담이 이어집니다.", indexable: false, canonicalSlug: "부산거제동법무사" },
  { name: "교대역", slug: "부산교대역법무사", parent: "yeonje", traits: ["station", "residential"], context: "교대 역세권 주거·상가 등기 문의가 있는 구간입니다." },
  { name: "연산역", slug: "부산연산역법무사", parent: "yeonje", traits: ["station", "commercial"], context: "연산 교차 생활권의 상가·주거 등기 상담이 많은 거점입니다." },
  { name: "시청역", slug: "부산시청역법무사", parent: "yeonje", traits: ["station", "commercial"], context: "시청 역세권 업무·주거 등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산시청법무사" },
  { name: "연제구청", slug: "부산연제구청법무사", parent: "yeonje", traits: ["residential"], context: "구청 인근 행정·주거 생활권의 등기 상담입니다.", indexable: false, canonicalSlug: "연제구법무사" },

  // 기장
  { name: "정관신도시", slug: "부산정관신도시법무사", parent: "gijang", traits: ["newtown", "residential", "industrial"], context: "정관 신도시 주거·산업단지와 맞물린 이전등기·법인 업무 문의가 많은 생활권입니다." },
  { name: "일광신도시", slug: "부산일광신도시법무사", parent: "gijang", traits: ["newtown", "coastal", "residential"], context: "일광 신도시·해안 주거의 신축·분양·이전등기 상담이 이어집니다." },
  { name: "오시리아", slug: "부산오시리아법무사", parent: "gijang", traits: ["tourism", "commercial", "newtown"], context: "오시리아 관광·상업단지 배후의 부동산·법인등기 문의가 있는 권역입니다." },
  { name: "동부산관광단지", slug: "부산동부산관광단지법무사", parent: "gijang", traits: ["tourism", "commercial"], context: "동부산 관광단지 일대 상업·숙박·상가 권리 상담이 있습니다.", indexable: false, canonicalSlug: "부산오시리아법무사" },
  { name: "기장시장", slug: "부산기장시장법무사", parent: "gijang", traits: ["market", "residential"], context: "기장읍 시장·주거 생활권의 상가·주택 등기 문의가 있습니다." },
  { name: "기장역", slug: "부산기장역법무사", parent: "gijang", traits: ["station", "residential"], context: "기장 역세권 주거·상가 등기 상담이 있는 거점입니다." },
  { name: "일광역", slug: "부산일광역법무사", parent: "gijang", traits: ["station", "newtown"], context: "일광 역세권·신도시 등기 문의가 이어집니다.", indexable: false, canonicalSlug: "부산일광신도시법무사" },
  { name: "일광해수욕장", slug: "부산일광해수욕장법무사", parent: "gijang", traits: ["coastal", "tourism"], context: "일광 해변 생활권의 부동산등기 상담이 있습니다." },
  { name: "롯데월드어드벤처부산", slug: "부산롯데월드어드벤처법무사", parent: "gijang", traits: ["tourism", "commercial"], context: "오시리아 관광시설 배후 상업·부동산 상담 구간입니다.", indexable: false, canonicalSlug: "부산오시리아법무사" },
  { name: "동부산롯데아울렛", slug: "부산동부산롯데아울렛법무사", parent: "gijang", traits: ["commercial", "tourism"], context: "아울렛 상권 인근의 상업시설·부동산 등기 문의가 있습니다.", indexable: false, canonicalSlug: "부산오시리아법무사" },
  { name: "기장군청", slug: "부산기장군청법무사", parent: "gijang", traits: ["residential"], context: "군청 인근 행정·주거 생활권의 등기 상담입니다.", indexable: false, canonicalSlug: "기장군법무사" },
  { name: "정관산업단지", slug: "부산정관산업단지법무사", parent: "gijang", traits: ["industrial", "newtown"], context: "정관산단 입주 기업의 공장·법인등기 문의가 있습니다." },
  { name: "장안산업단지", slug: "부산장안산업단지법무사", parent: "gijang", traits: ["industrial"], context: "장안산단 사업장·공장 등기 상담이 이어집니다." },
  { name: "명례산업단지", slug: "부산명례산업단지법무사", parent: "gijang", traits: ["industrial"], context: "명례산단 입주 기업의 법인·부동산등기 문의가 있는 산업 권역입니다." },
];

export function buildLivingAreaEntries(): CaseRegionEntry[] {
  return livingSeeds.map((seed) => ({
    slug: seed.slug,
    name: seed.name,
    displayName: `부산 ${seed.name}`,
    kind: "living" as const,
    parentDistrictKey: seed.parent,
    traits: seed.traits,
    keywords: seed.keywords ?? [seed.name, `부산 ${seed.name}`, `${seed.name} 법무사`],
    context: seed.context,
    indexable: seed.indexable ?? true,
    canonicalSlug: seed.canonicalSlug,
  }));
}
