"use client";

import { InquiryAltChannels } from "@/components/conversion/InquiryAltChannels";

type InquiryFailureFallbackProps = {
  title?: string;
  description?: string;
  pageSlug?: string;
  className?: string;
};

/**
 * 온라인 상담 신청이 실패했거나 보안 확인을 쓸 수 없을 때 바로 연결할 수 있는 채널.
 * 카카오톡 · 네이버 톡톡 · 전화 상담 · 네이버 예약. 작성한 내용은 양식에 그대로 남는다.
 */
export function InquiryFailureFallback({
  title = "온라인 신청이 전달되지 않았습니다. 아래로 바로 연락해 주세요",
  description = "카카오톡·네이버 톡톡·전화·네이버 예약 중 편한 방법으로 말씀해 주시면 같은 내용으로 상담을 이어가겠습니다. 작성하신 내용은 그대로 남아 있습니다.",
  pageSlug,
  className = "",
}: InquiryFailureFallbackProps) {
  return (
    <div role="alert" aria-live="polite" className={className}>
      <InquiryAltChannels
        title={title}
        description={description}
        channels={["kakao", "talk", "phone", "reservation"]}
        placement="inquiry_failure"
        pageSlug={pageSlug}
      />
    </div>
  );
}
