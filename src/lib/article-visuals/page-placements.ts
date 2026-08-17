import type { ArticleVisualPlacement } from "./types";
import { articleImageCatalog } from "./asset-catalog";
import {
  autoVisualCount,
  buildAutoPlacement,
  inferArticleVisualField,
  slotsForAutoCount,
  type ArticleVisualResolveContext,
} from "./resolve";

export type { ArticleVisualResolveContext };

/**
 * 핵심 URL 수동 오버라이드(문구·에셋 고정).
 * 그 외 경로는 resolve.ts 자동 배치.
 */
export const priorityArticleVisualPlacements: ArticleVisualPlacement[] = [
  // /부산법무사 — 허브 ~3000자 → 2~3
  {
    path: "/부산법무사",
    slot: "after-intro",
    assetId: "portraitFront",
    alt: "부산 해운대 다옴법무사사무소에서 상담을 준비하는 안윤정 법무사",
    overlayText: "정확한 업무명을 몰라도 괜찮습니다",
    caption: "상황을 먼저 듣고 필요한 절차부터 안내합니다.",
    aspectRatio: "3:2",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/부산법무사",
    slot: "before-procedures",
    assetId: "officeDocs",
    alt: "다옴법무사사무소 업무 공간에 정리된 상담·등기 관련 서류",
    overlayText: "준비된 서류가 없어도 시작할 수 있습니다",
    aspectRatio: "16:9",
    overlayPosition: "center",
    tone: "dark",
  },

  // /부산등기법무사
  {
    path: "/부산등기법무사",
    slot: "after-intro",
    assetId: "saleGiftRegCert",
    alt: "매매·증여 등기 완료 후 확인하는 등기필정보 서류",
    overlayText: "어떤 등기인지부터 가릅니다",
    caption: "등기부와 현재 상황을 보고 필요한 절차를 안내합니다.",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/부산등기법무사",
    slot: "before-procedures",
    assetId: "registryOfficeVisit",
    alt: "부산지방법원 등기국 앞에서 등기 서류를 확인하는 안윤정 법무사",
    overlayText: "관할 등기소를 확인한 뒤 접수합니다",
    aspectRatio: "4:3",
    overlayPosition: "left",
    tone: "dark",
  },

  // /부산상속법무사
  {
    path: "/부산상속법무사",
    slot: "after-intro",
    assetId: "docReviewDesk",
    alt: "상속 관련 가족관계·재산 서류를 검토하는 안윤정 법무사",
    overlayText: "상속인은 서류보다 먼저 확인합니다",
    aspectRatio: "4:3",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/부산상속법무사",
    slot: "before-procedures",
    assetId: "inheritanceRegCert",
    alt: "부산지방법원 등기국에서 발급된 상속 관련 등기필정보 서류",
    overlayText: "재산과 채무를 함께 살펴야 합니다",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },

  // /부산상속등기
  {
    path: "/부산상속등기",
    slot: "after-intro",
    assetId: "inheritanceRegCert",
    alt: "상속등기 완료 후 확인하는 등기필정보 및 등기완료통지서",
    overlayText: "가족관계에 따라 절차가 달라집니다",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/부산상속등기",
    slot: "before-example",
    assetId: "docReviewDesk",
    alt: "상속등기 서류를 책상에서 검토하는 안윤정 법무사",
    overlayText: "승인 방식을 먼저 가립니다",
    aspectRatio: "4:3",
    overlayPosition: "right",
    tone: "dark",
  },

  // 상속 생애주기 검색 유입
  {
    path: "/부모님사망후해야할일",
    slot: "after-intro",
    assetId: "docReviewDesk",
    alt: "사망 후 상속 절차 서류를 정리하는 모습",
    overlayText: "장례 직후부터 순서를 잡습니다",
    aspectRatio: "4:3",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/사망자재산채무조회",
    slot: "after-intro",
    assetId: "inheritanceRegCert",
    alt: "재산·채무 조회와 연결되는 상속 관련 서류",
    overlayText: "재산과 빚을 함께 확인합니다",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/부모빚상속방법",
    slot: "after-intro",
    assetId: "docReviewDesk",
    alt: "상속포기·한정승인 선택을 위해 자료를 검토하는 모습",
    overlayText: "등기보다 승인 방식부터",
    aspectRatio: "4:3",
    overlayPosition: "right",
    tone: "dark",
  },
  {
    path: "/방문없이준비하는상속등기",
    slot: "after-intro",
    assetId: "consultTalk",
    alt: "전화·카카오톡으로 상속등기 준비를 안내하는 상담 장면",
    overlayText: "방문 전에도 준비가 가능합니다",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/상속",
    slot: "after-intro",
    assetId: "inheritanceRegCert",
    alt: "상속등기·포기·한정승인 종합 안내와 연결되는 등기 서류",
    overlayText: "단계별로 이어지는 상속 안내",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/경상도비대면상속등기",
    slot: "after-intro",
    assetId: "consultTalk",
    alt: "경남·울산·경북 상속을 비대면으로 안내하는 상담 장면",
    overlayText: "방문 전에도 절차를 확인할 수 있습니다",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/기장군상속포기",
    slot: "after-intro",
    assetId: "docReviewDesk",
    alt: "기장군 상속포기·채무 확인을 위해 서류를 검토하는 모습",
    overlayText: "재산과 채무를 함께 확인합니다",
    aspectRatio: "4:3",
    overlayPosition: "left",
    tone: "dark",
  },

  // /부산한정승인
  {
    path: "/부산한정승인",
    slot: "after-intro",
    assetId: "docReviewDesk",
    alt: "한정승인 판단을 위해 재산·채무 자료를 검토하는 안윤정 법무사",
    overlayText: "3개월 안에 판단할 사항이 있습니다",
    aspectRatio: "4:3",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/부산한정승인",
    slot: "before-procedures",
    assetId: "consultTalk",
    alt: "한정승인·포기 선택을 상담하는 다옴법무사사무소 상담 장면",
    overlayText: "재산 처분 전 먼저 확인하세요",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },

  // /부산부동산등기
  {
    path: "/부산부동산등기",
    slot: "after-intro",
    assetId: "saleGiftRegCert",
    alt: "매매·증여 등기 완료 후 확인하는 등기필정보 서류",
    overlayText: "잔금과 말소 순서를 맞춰야 합니다",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/부산부동산등기",
    slot: "before-procedures",
    assetId: "registryOfficeVisit",
    alt: "부산지방법원 등기국 앞에서 등기 서류를 확인하는 안윤정 법무사",
    overlayText: "등기부와 계약을 함께 봅니다",
    aspectRatio: "4:3",
    overlayPosition: "left",
    tone: "dark",
  },

  // /부산건물멸실등기
  {
    path: "/부산건물멸실등기",
    slot: "after-intro",
    assetId: "busanRegistryBureau",
    alt: "부산지방법원등기국 건물 외관 — 건물 멸실등기 관할 맥락",
    overlayText: "철거 후에도 등기부가 남을 수 있습니다",
    aspectRatio: "16:9",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/부산건물멸실등기",
    slot: "before-procedures",
    assetId: "saleGiftRegCert",
    alt: "건물·부동산 등기 관련 등기필 서류를 정리한 모습",
    overlayText: "대장과 등기부가 같은지 확인하세요",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },

  // /부산신축건물보존등기
  {
    path: "/부산신축건물보존등기",
    slot: "after-intro",
    assetId: "busanRegistryBureau",
    alt: "신축건물 보존등기 접수가 이루어지는 부산 등기 관할 건물",
    overlayText: "준공 이후 보존등기가 시작됩니다",
    aspectRatio: "16:9",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/부산신축건물보존등기",
    slot: "before-procedures",
    assetId: "contractOfficerReview",
    alt: "신축 보존등기 서류를 검토하는 안윤정 법무사",
    overlayText: "건축물대장과 도면을 맞춰 봅니다",
    aspectRatio: "3:2",
    overlayPosition: "right",
    tone: "dark",
  },

  // /부산법인등기
  {
    path: "/부산법인등기",
    slot: "after-intro",
    assetId: "contractOfficerReview",
    alt: "법인등기를 위해 정관·등기 서류를 검토하는 안윤정 법무사",
    overlayText: "정관과 등기부를 함께 확인합니다",
    aspectRatio: "3:2",
    overlayPosition: "right",
    tone: "dark",
  },
  {
    path: "/부산법인등기",
    slot: "before-procedures",
    assetId: "deskComputer",
    alt: "법인 변경등기 서류를 모니터와 함께 확인하는 안윤정 법무사",
    overlayText: "변경 사실과 등기 시점은 다를 수 있습니다",
    aspectRatio: "16:9",
    overlayPosition: "right",
    tone: "dark",
  },

  // /부산임원변경등기
  {
    path: "/부산임원변경등기",
    slot: "after-intro",
    assetId: "contractOfficerReview",
    alt: "임원변경등기를 위해 의사록·취임 서류를 검토하는 안윤정 법무사",
    overlayText: "임기와 결의 절차가 등기의 출발점입니다",
    aspectRatio: "3:2",
    overlayPosition: "right",
    tone: "dark",
  },
  {
    path: "/부산임원변경등기",
    slot: "before-example",
    assetId: "deskComputer",
    alt: "임원 기한·과태료를 확인하기 위해 등기 자료를 보는 모습",
    overlayText: "결의 후 등기 기한을 달력에 표시하세요",
    aspectRatio: "16:9",
    overlayPosition: "center",
    tone: "dark",
  },

  // /부산개인회생법무사
  {
    path: "/부산개인회생법무사",
    slot: "after-intro",
    assetId: "consultMain",
    alt: "개인회생 상담에서 소득·채무 상황을 경청하는 안윤정 법무사",
    overlayText: "소득·채무·재산을 함께 검토합니다",
    aspectRatio: "3:2",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/부산개인회생법무사",
    slot: "before-procedures",
    assetId: "courtProcedureBook",
    alt: "개인회생·법원 절차 안내를 위한 법률 자료",
    overlayText: "채무액만으로 결정되지는 않습니다",
    aspectRatio: "16:9",
    overlayPosition: "center",
    tone: "dark",
  },

  // 정관·공증 준비 클러스터 (검색의도별 문구 차별화)
  {
    path: "/법인정관업무",
    slot: "after-intro",
    assetId: "officeDocs",
    alt: "법인 정관·등기 관련 서류를 정리한 다옴법무사사무소 업무 공간",
    overlayText: "법인 정관 — 작성·변경 전 확인사항",
    caption: "절대·상대·임의 기재사항과 등기 연결을 먼저 가릅니다.",
    aspectRatio: "16:9",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/법인정관변경",
    slot: "after-intro",
    assetId: "docReviewDesk",
    alt: "정관 변경 필요 여부를 검토하는 안윤정 법무사",
    overlayText: "무엇이 바뀌면 정관을 고칠까?",
    caption: "상호·목적·본점·공고방법을 표로 구분합니다.",
    aspectRatio: "3:2",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/법인공증준비",
    slot: "after-intro",
    assetId: "contractOfficerReview",
    alt: "정관·의사록 공증 준비 서류를 확인하는 모습",
    overlayText: "법인 공증 준비 — 정관·의사록 먼저",
    caption: "공증은 공증인, 등기 절차는 법무사 영역으로 구분합니다.",
    aspectRatio: "4:3",
    overlayPosition: "center",
    tone: "dark",
  },
  {
    path: "/법인정관인증확인",
    slot: "after-intro",
    assetId: "officeDocs",
    alt: "설립 전 정관 인증 필요 여부를 점검하는 서류",
    overlayText: "정관 인증이 필요한 경우부터",
    caption: "자본금·발기설립 기준을 설립등기 전에 확인합니다.",
    aspectRatio: "16:9",
    overlayPosition: "left",
    tone: "dark",
  },
  {
    path: "/법인의사록공증준비",
    slot: "after-intro",
    assetId: "deskComputer",
    alt: "주주총회·이사회 의사록과 등기 일정을 확인하는 모습",
    overlayText: "의사록 공증 — 주총·이사회 체크",
    caption: "등기용 의사록과 인증 필요 여부를 구분합니다.",
    aspectRatio: "16:9",
    overlayPosition: "center",
    tone: "dark",
  },

  // /situations
  {
    path: "/situations",
    slot: "after-intro",
    assetId: "consultTalk",
    alt: "상황별 법률 문제를 상담하는 다옴법무사사무소 안윤정 법무사",
    overlayText: "현재 상황부터 남겨주세요",
    aspectRatio: "3:2",
    overlayPosition: "center",
    tone: "dark",
  },

  // /contact
  {
    path: "/contact",
    slot: "before-cta",
    assetId: "consultMain",
    alt: "상담 문의에 응하는 안윤정 법무사 — 다옴법무사사무소",
    overlayText: "현재 상황부터 남겨주세요",
    caption: "전화·카카오톡·네이버 예약으로 상담을 시작할 수 있습니다.",
    aspectRatio: "3:2",
    overlayPosition: "left",
    tone: "dark",
  },
];

export function getArticleVisualsForPath(
  path: string,
  slot?: ArticleVisualPlacement["slot"],
  context?: ArticleVisualResolveContext,
): ArticleVisualPlacement[] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const overrides = priorityArticleVisualPlacements.filter(
    (p) => p.path === normalized && (slot ? p.slot === slot : true),
  );
  if (overrides.length > 0) return overrides;

  const field = inferArticleVisualField(normalized, context?.serviceSlug);
  const count = autoVisualCount(normalized, context?.category);
  const allowedSlots = new Set(slotsForAutoCount(count));

  // contact 등 CTA 전용
  if (normalized === "/contact" || normalized.startsWith("/contact/")) {
    if (slot && slot !== "before-cta" && slot !== "after-intro") return [];
    const targetSlot = slot ?? "before-cta";
    const placement = buildAutoPlacement(
      normalized,
      targetSlot === "before-cta" ? "before-cta" : "after-intro",
      "consultation",
      articleImageCatalog,
    );
    return placement ? [placement] : [];
  }

  if (slot && !allowedSlots.has(slot)) return [];

  const slots = slot ? [slot] : [...allowedSlots];
  const out: ArticleVisualPlacement[] = [];
  for (const s of slots) {
    const placement = buildAutoPlacement(
      normalized,
      s,
      field,
      articleImageCatalog,
    );
    if (placement) out.push(placement);
  }
  return out;
}
