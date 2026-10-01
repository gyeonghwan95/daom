/**
 * 선박등기 클러스터 키워드 → 대표 URL.
 * 한 검색의도에는 대표 URL 하나만 둔다. 지역명만 바꾼 페이지를 새로 만들지 않고,
 * 등록되지 않은 지역은 /선박등기 의 지역 섹션이 받는다.
 */
export type ShipIntentOwner = {
  query: string;
  intent:
    | "CORE"
    | "INHERITANCE"
    | "MANAGER"
    | "OWNERSHIP"
    | "MORTGAGE"
    | "FISHING_VESSEL"
    | "REGIONAL";
  path: string;
  /** 같은 URL이 함께 받는 보조 검색어 */
  secondaryQueries: readonly string[];
  /** 대표 URL은 아니지만 내부링크로 연결하는 URL */
  supportingPaths: readonly string[];
};

export const SHIP_INTENT_OWNERS: readonly ShipIntentOwner[] = [
  {
    query: "선박등기",
    intent: "CORE",
    path: "/선박등기",
    secondaryQueries: ["선박등기 법무사", "선박등기 대상", "선박등기 절차"],
    supportingPaths: ["/선박등기와선박등록", "/선박등기자가진단"],
  },
  {
    query: "선박 소유권이전등기",
    intent: "OWNERSHIP",
    path: "/선박등기",
    secondaryQueries: ["선박 매매 등기", "배 명의이전"],
    supportingPaths: ["/창원선박등기", "/거제선박등기"],
  },
  {
    query: "선박 저당권 설정",
    intent: "MORTGAGE",
    path: "/선박등기",
    secondaryQueries: ["선박 저당권 말소", "소형선박 저당권"],
    supportingPaths: [],
  },
  {
    query: "선박등기 비용",
    intent: "CORE",
    path: "/선박등기",
    secondaryQueries: [],
    supportingPaths: ["/선박등기비용"],
  },
  {
    query: "선박상속",
    intent: "INHERITANCE",
    path: "/선박상속",
    secondaryQueries: ["선박상속 법무사", "선박 상속등기", "선주 사망 선박"],
    supportingPaths: ["/선박관리인선임등기"],
  },
  {
    query: "부산 선박상속",
    intent: "INHERITANCE",
    path: "/선박상속",
    secondaryQueries: ["부산 선박 상속등기"],
    supportingPaths: ["/부산선박등기"],
  },
  {
    query: "어선 상속",
    intent: "FISHING_VESSEL",
    path: "/선박상속",
    secondaryQueries: ["어선 상속 이전등록", "어선 상속 기한"],
    supportingPaths: ["/선박등기와선박등록", "/통영선박등기"],
  },
  {
    query: "선박관리인 선임등기",
    intent: "MANAGER",
    path: "/선박관리인선임등기",
    secondaryQueries: ["선박관리인", "선박 공유자 관리인", "공동상속 선박관리인"],
    supportingPaths: ["/선박상속"],
  },
  {
    query: "선박등기 선박등록 차이",
    intent: "FISHING_VESSEL",
    path: "/선박등기와선박등록",
    secondaryQueries: ["선박원부", "어선원부", "소형선박 등록"],
    supportingPaths: ["/선박등기"],
  },
  {
    query: "부산 선박등기",
    intent: "REGIONAL",
    path: "/부산선박등기",
    secondaryQueries: ["부산 선박등기 법무사", "부산지방법원 선박등기"],
    supportingPaths: ["/영도구선박등기"],
  },
  {
    query: "영도 선박등기",
    intent: "REGIONAL",
    path: "/영도구선박등기",
    secondaryQueries: [],
    supportingPaths: ["/부산선박등기"],
  },
  {
    query: "거제 선박등기",
    intent: "REGIONAL",
    path: "/거제선박등기",
    secondaryQueries: ["거제 선박 매매 등기", "거제 선박상속"],
    supportingPaths: ["/선박상속"],
  },
  {
    query: "통영 선박상속",
    intent: "REGIONAL",
    path: "/통영선박등기",
    secondaryQueries: ["통영 선박등기", "통영 어선 상속"],
    supportingPaths: ["/선박관리인선임등기"],
  },
  {
    query: "창원 선박등기",
    intent: "REGIONAL",
    path: "/창원선박등기",
    secondaryQueries: ["진해 선박등기", "마산 선박등기"],
    supportingPaths: ["/선박등기"],
  },
  {
    query: "울산 선박등기",
    intent: "REGIONAL",
    path: "/울산선박등기",
    secondaryQueries: ["울산 법인 선박 이전", "울산 부선 등기"],
    supportingPaths: ["/선박등기필요서류"],
  },
  {
    query: "포항 선박등기",
    intent: "REGIONAL",
    path: "/포항선박등기",
    secondaryQueries: ["울릉 선박등기", "포항 선박 경매 명의변경", "구룡포 선박 낙찰"],
    supportingPaths: ["/선박등기"],
  },
  {
    query: "울진 선박등기",
    intent: "REGIONAL",
    path: "/울진선박등기",
    secondaryQueries: ["울진 어선 명의변경", "후포 어선 명의변경", "죽변 어선 명의변경"],
    supportingPaths: ["/선박등기와선박등록"],
  },
  {
    query: "영덕 선박등기",
    intent: "REGIONAL",
    path: "/영덕선박등기",
    secondaryQueries: ["영덕 어선 증여", "어선 자녀 증여"],
    supportingPaths: ["/선박상속"],
  },
  {
    query: "경주 선박등기",
    intent: "REGIONAL",
    path: "/경주선박등기",
    secondaryQueries: ["감포 선박등기", "선박 선적항 변경"],
    supportingPaths: ["/선박등기"],
  },
];
