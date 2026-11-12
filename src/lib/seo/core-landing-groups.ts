/**
 * 핵심 랜딩(수임으로 이어지는 대표 페이지)의 업무 묶음.
 * 사례 블록·진행 순서 블록이 어떤 페이지에 붙고, 어떤 사례를 보여 줄지 정한다.
 * URL·제목·본문은 건드리지 않고 블록만 더하는 용도다(2026-11-12).
 */

export type CoreLandingGroup =
  | "inheritance-registration"
  | "renunciation-qualified"
  | "corporate"
  | "real-estate"
  | "rehabilitation";

const GROUP_PATHS: Record<CoreLandingGroup, string[]> = {
  "inheritance-registration": [
    "/부산상속법무사",
    "/부산상속등기",
    "/부산상속전문법무사",
    "/대습상속등기",
    "/부산재상속등기",
    "/상속",
  ],
  "renunciation-qualified": [
    "/부산상속포기",
    "/상속포기기간",
    "/부산한정승인",
    "/한정승인후절차",
    "/특별한정승인",
    "/단순승인과숙려기간",
  ],
  corporate: [
    "/부산법인법무사",
    "/부산법인설립전문법무사",
    "/부산법인등기",
    "/부산임원변경등기",
    "/부산본점이전등기",
    "/부산법인설립등기",
  ],
  "real-estate": ["/부산부동산등기", "/부산부동산등기전문법무사", "/부산소유권이전등기"],
  rehabilitation: ["/부산개인회생"],
};

/** 그룹별로 보여 줄 사례 분류(case.category) — 앞쪽일수록 먼저 */
export const GROUP_CASE_CATEGORIES: Record<CoreLandingGroup, string[]> = {
  "inheritance-registration": ["상속등기", "상속포기", "한정승인"],
  "renunciation-qualified": ["상속포기", "한정승인"],
  corporate: ["법인설립", "법인등기"],
  "real-estate": ["부동산등기"],
  rehabilitation: ["개인회생"],
};

/** 진행 마지막 단계에서 받는 결과물 — 서비스마다 실제로 다른 것만 적는다 */
export const GROUP_DELIVERABLE: Record<CoreLandingGroup, string> = {
  "inheritance-registration": "등기가 끝나면 등기필정보와 등기사항증명서로 명의가 바뀐 것을 함께 확인합니다.",
  "renunciation-qualified": "법원 심판이 나오면 심판문 사본을 전달하고, 이후 해야 할 일(다음 순위 안내·공고 등)을 이어서 안내합니다.",
  corporate: "등기가 끝나면 등기사항증명서로 변경 내용이 반영된 것을 함께 확인합니다.",
  "real-estate": "등기가 끝나면 등기필정보와 등기사항증명서로 권리 변동을 함께 확인합니다.",
  rehabilitation: "접수 뒤 보정이나 추가 서류가 있으면 그에 맞춰 준비할 내용을 안내합니다.",
};

/** 2단계에서 가장 먼저 확인하는 사실 — 업무마다 다르게 적어 페이지 사이 문구가 같아지지 않게 한다 */
export const GROUP_FIRST_CHECK: Record<CoreLandingGroup, string> = {
  "inheritance-registration": "사망일과 상속인 전원, 부동산 소재지, 협의분할 여부, 근저당·대출 유무를 먼저 확인하고",
  "renunciation-qualified": "사망일과 상속이 시작된 것을 안 날, 고인의 빚·재산, 예금 인출 같은 처분 이력을 먼저 확인하고",
  corporate: "법인 등기사항증명서와 정관, 임원·주주 변동 사실, 총회·이사회 일정을 먼저 확인하고",
  "real-estate": "등기사항증명서와 계약서, 잔금일, 대출·근저당 일정을 먼저 확인하고",
  rehabilitation: "소득·재산·채무 내역과 법원 제출 기한을 먼저 확인하고",
};

/** 진행 기간·기한을 따로 설명한 페이지(숫자는 그 페이지의 기준일 표기를 따른다) */
export const GROUP_PERIOD_LINK: Record<CoreLandingGroup, { href: string; label: string } | null> = {
  "inheritance-registration": { href: "/상속등기기간", label: "상속등기 기간·기한 안내" },
  "renunciation-qualified": { href: "/상속포기기간", label: "부산 상속포기 기간 계산" },
  corporate: { href: "/법인등기", label: "법인등기 종합 안내" },
  "real-estate": { href: "/부동산등기", label: "부동산등기 종합 안내" },
  rehabilitation: { href: "/개인회생기간", label: "개인회생 기간 안내" },
};

export function getCoreLandingGroup(path: string): CoreLandingGroup | null {
  const normalized = path.length > 1 ? path.replace(/\/$/, "") : path;
  for (const [group, paths] of Object.entries(GROUP_PATHS)) {
    if (paths.includes(normalized)) return group as CoreLandingGroup;
  }
  return null;
}
