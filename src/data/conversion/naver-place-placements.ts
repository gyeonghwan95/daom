/**
 * P1 SmartPlace placement matrix (code-driven, not CMS).
 * Density rule: prefer 1–2 SmartPlace CTAs per page surface.
 */
import type {
  NaverSmartPlacePlacement,
  NaverSmartPlaceVariant,
} from "@/lib/naver-smartplace/cta";

export type NaverPlacePlacementRule = {
  pageType: string;
  placement: NaverSmartPlacePlacement;
  variant: NaverSmartPlaceVariant;
  priority: 1 | 2 | 3;
  enabled: boolean;
  note: string;
};

export const NAVER_PLACE_PLACEMENTS: NaverPlacePlacementRule[] = [
  {
    pageType: "home",
    placement: "homepage_hero",
    variant: "reservation",
    priority: 1,
    enabled: true,
    note: "Hero tertiary chip — not a 4th primary button row",
  },
  {
    pageType: "home",
    placement: "homepage_reviews",
    variant: "place",
    priority: 1,
    enabled: true,
    note: "Trust → SmartPlace after reviews",
  },
  {
    pageType: "home",
    placement: "homepage_location",
    variant: "map",
    priority: 1,
    enabled: true,
    note: "Map widget already; avoid duplicate reservation in same viewport",
  },
  {
    pageType: "contact",
    placement: "contact_page",
    variant: "reservation",
    priority: 1,
    enabled: true,
    note: "Distinct from 네이버 톡톡",
  },
  {
    pageType: "location",
    placement: "location_page",
    variant: "map",
    priority: 1,
    enabled: true,
    note: "Map + reservation with different labels",
  },
  {
    pageType: "location",
    placement: "location_page",
    variant: "reservation",
    priority: 1,
    enabled: true,
    note: "Visit intent",
  },
  {
    pageType: "mobile",
    placement: "mobile_bottom",
    variant: "reservation",
    priority: 1,
    enabled: true,
    note: "Existing sticky bar slot — no extra floating button",
  },
  {
    pageType: "footer",
    placement: "footer",
    variant: "place",
    priority: 2,
    enabled: true,
    note: "Text discoverability only",
  },
  {
    pageType: "global",
    placement: "page_hero",
    variant: "reservation",
    priority: 1,
    enabled: true,
    note: "Paired beside 1분 상담 via InquiryNaverCtaPair",
  },
  {
    pageType: "global",
    placement: "readability_cta",
    variant: "reservation",
    priority: 1,
    enabled: true,
    note: "Paired with mid/bottom readability CTAs",
  },
  {
    pageType: "global",
    placement: "floating_panel",
    variant: "reservation",
    priority: 1,
    enabled: true,
    note: "Under 상담하기 in desktop floating panel — no second ball",
  },
  {
    pageType: "global",
    placement: "conversion_actions",
    variant: "reservation",
    priority: 1,
    enabled: true,
    note: "Beside 1분만에 상담 신청하기 in ConversionActionButtons",
  },
  {
    pageType: "global",
    placement: "sidebar",
    variant: "reservation",
    priority: 2,
    enabled: true,
    note: "Below channel list in SidebarConsultationPanel",
  },
];
