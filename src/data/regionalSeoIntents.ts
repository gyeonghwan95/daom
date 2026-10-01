/**
 * 전국 지역 상속 검색의도 → 대표 URL 레지스트리.
 * 같은 region·service에 대표 URL을 두 개 만들지 않기 위한 기준표이며, 새 지역 page를 만들기 전에 먼저 확인한다.
 * status: PROTECT = 검색 노출 또는 차별화가 확인돼 수정하지 않음(템플릿 본문이어도 노출 중이면 보호) /
 *         IMPROVED = 대표 URL 미노출이라 고유 각도로 재작성 / EXISTING = 노출은 확인됐으나 본문이 템플릿 /
 *         HOLD = 템플릿, 검색 노출 미확인 — 노출 확인 전에는 재작성하지 않음
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
  intent("화성", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01) · 재작성 초안 보류"),
  intent("부천", "PROTECT", "템플릿 본문 · '상속등기 법무사' 2순위 노출(2026-10-01) · 재작성 초안 보류"),
  intent("남양주", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01)"),
  intent("안산", "PROTECT", "템플릿 본문 · '상속등기 법무사' 2순위 노출(2026-10-01)"),
  intent("평택", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01)"),
  intent("안양", "PROTECT", "템플릿 본문 · '상속등기 법무사' 2순위 노출(2026-10-01)"),
  intent("시흥", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01)"),
  intent("파주", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01)"),
  intent("김포", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01)"),
  intent("의정부", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01)"),
  intent("대전", "IMPROVED", "상속인이 대전·서울·부산에 흩어져 있을 때 협의서 날인 순서"),
  intent("세종", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
  intent("청주", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
  intent("천안", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
  intent("아산", "EXISTING", "템플릿 본문 · 2026-09-30 노출 확인"),
  intent("대구", "IMPROVED", "상속 후 매도할 대구 부동산의 등기 명의 선택"),
  intent("경산", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01) · 재작성 초안 보류"),
  intent("안동", "PROTECT", "'상속등기 법무사' 1순위 노출(2026-10-01) · 오래된 토지 하위 page 함께 노출"),
  intent("김천", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01)"),
  intent("포항", "PROTECT", "검색 1순위 확인 · title/H1/본문 동결", "2026-09-27"),
  intent("경주", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("구미", "PROTECT", "지역 고유 각도 적용", "2026-09-27"),
  intent("울산", "PROTECT", "검색 1순위 확인 · title/H1/본문 동결", "2026-09-27"),
  intent("울주군", "PROTECT", "'상속등기 법무사' 1순위 노출(2026-10-01) · 울산토지상속등기도 함께 노출"),
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
  intent("순천", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01)"),
  intent("여수", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("춘천", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("원주", "PROTECT", "템플릿 본문 · '상속등기 법무사' 1순위 노출(2026-10-01) · 재작성 초안 보류"),
  intent("강릉", "HOLD", "템플릿 본문 · 다음 배치 후보"),
  intent("제주", "EXISTING", "템플릿 본문 · '상속 법무사' 검색 노출 확인"),
];
