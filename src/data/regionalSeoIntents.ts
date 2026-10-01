/**
 * 전국 지역 상속 검색의도 → 대표 URL 레지스트리.
 * 같은 region·service에 대표 URL을 두 개 만들지 않기 위한 기준표이며, 새 지역 page를 만들기 전에 먼저 확인한다.
 * status: PROTECT = 순위·차별화가 확인돼 수정하지 않음 / IMPROVED = 고유 각도로 재작성 /
 *         EXISTING = 노출은 확인됐으나 본문이 템플릿 / HOLD = 템플릿, 다음 배치 후보
 */
export type RegionalSeoIntentStatus = "PROTECT" | "IMPROVED" | "EXISTING" | "HOLD";

export type RegionalSeoIntent = {
  region: string;
  service: "상속등기";
  primaryQuery: string;
  url: string;
  uniqueAngle: string;
  status: RegionalSeoIntentStatus;
  createdAt: string;
};

const rep = (region: string) => `/업무사례/${region}상속등기법무사`;

function intent(
  region: string,
  status: RegionalSeoIntentStatus,
  uniqueAngle: string,
  createdAt = "2026-10-01",
): RegionalSeoIntent {
  return {
    region,
    service: "상속등기",
    primaryQuery: `${region} 상속 법무사`,
    url: rep(region),
    uniqueAngle,
    status,
    createdAt,
  };
}

export const REGIONAL_SEO_INTENTS: readonly RegionalSeoIntent[] = [
  intent("서울", "PROTECT", "서울가정법원 상속포기와 서울 부동산 상속등기를 부산에서 원거리로 맡기는 범위", "2026-09-30"),
  intent("용인", "PROTECT", "아파트와 여러 필지 토지·농지를 한 번에 정리하는 필지 목록", "2026-09-30"),
  intent("인천", "EXISTING", "템플릿 본문 · '상속등기 법무사' 검색 노출 확인"),
  intent("수원", "EXISTING", "템플릿 본문 · '상속등기 법무사' 검색 노출 확인"),
  intent("성남", "EXISTING", "템플릿 본문 · 2026-09-30 노출 확인"),
  intent("고양", "EXISTING", "템플릿 본문 · 2026-09-30 노출 확인"),
  intent("화성", "IMPROVED", "동탄 아파트에 담보대출이 남아 있을 때 채무 승계와 은행 승낙"),
  intent("부천", "IMPROVED", "세입자가 사는 빌라 상속 · 임대인 지위와 보증금, 한정승인 판단"),
  intent("대전", "IMPROVED", "상속인이 대전·서울·부산에 흩어져 있을 때 협의서 날인 순서"),
  intent("세종", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
  intent("청주", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
  intent("천안", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
  intent("아산", "EXISTING", "템플릿 본문 · 2026-09-30 노출 확인"),
  intent("대구", "IMPROVED", "상속 후 매도할 대구 부동산의 등기 명의 선택"),
  intent("경산", "IMPROVED", "대구·부산·수도권 자녀가 단계별로 원거리 진행 · 대구가정법원 관할"),
  intent("포항", "PROTECT", "검색 1순위 확인 · title/H1/본문 동결", "2026-09-27"),
  intent("경주", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("구미", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("울산", "PROTECT", "검색 1순위 확인 · title/H1/본문 동결", "2026-09-27"),
  intent("양산", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("김해", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("창원", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("진주", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("거제", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("통영", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("광주", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
  intent("전주", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
  intent("익산", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("군산", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("목포", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("순천", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("여수", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("춘천", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("원주", "IMPROVED", "조부모 명의로 남은 토지 · 대습상속과 두 번 이어진 상속 구분"),
  intent("강릉", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("제주", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
];
