import type { CTAType } from "@/lib/analytics/track-cta";

export type B2BAnalyticsEvent =
  | "b2b_hub_view"
  | "b2b_partner_select"
  | "b2b_service_select"
  | "b2b_cta_click"
  | "delegation_page_view"
  | "project_page_view"
  | "project_brief_start"
  | "project_brief_step_complete"
  | "project_brief_submit"
  | "b2b_phone_click"
  | "b2b_kakao_click"
  | "b2b_email_click"
  | "b2b_print_click"
  | "b2b_share_click"
  | "collaboration_menu_open"
  | "collaboration_hub_view"
  | "collaboration_category_select"
  | "collaboration_page_view"
  | "delegation_cta_click"
  | "project_cta_click"
  | "collaboration_form_start"
  | "collaboration_form_step_complete"
  | "collaboration_form_submit"
  | "collaboration_phone_click"
  | "collaboration_kakao_click"
  | "collaboration_share_click"
  | "collaboration_print_click";

export type B2BAnalyticsParams = {
  source_page?: string;
  category?: string;
  partner_type?: string;
  service_type?: string;
  lead_size_band?: string;
  urgency_band?: string;
  contact_method?: string;
};

/**
 * B2B 이벤트 인터페이스.
 * 개인정보(이름·전화·이메일·주소·본문)는 절대 포함하지 않는다.
 * GA/GTM 미연동 시 개발 환경에서만 로그한다.
 */
export function trackB2BEvent(
  event: B2BAnalyticsEvent,
  params: B2BAnalyticsParams = {},
): void {
  const safe = {
    source_page: params.source_page,
    category: params.category,
    partner_type: params.partner_type,
    service_type: params.service_type,
    lead_size_band: params.lead_size_band,
    urgency_band: params.urgency_band,
    contact_method: params.contact_method,
  };

  if (typeof window !== "undefined") {
    const w = window as Window & {
      dataLayer?: unknown[];
      gtag?: (...args: unknown[]) => void;
    };
    if (typeof w.gtag === "function") {
      w.gtag("event", event, safe);
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...safe });
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[trackB2BEvent]", event, safe);
  }
}

export function trackB2BCTA(
  type: Extract<CTAType, "phone" | "kakao" | "contact"> | "email",
  sourcePage: string,
): void {
  if (type === "phone") trackB2BEvent("b2b_phone_click", { source_page: sourcePage });
  else if (type === "kakao")
    trackB2BEvent("b2b_kakao_click", { source_page: sourcePage });
  else if (type === "email")
    trackB2BEvent("b2b_email_click", { source_page: sourcePage });
  else trackB2BEvent("b2b_cta_click", { source_page: sourcePage });
}
