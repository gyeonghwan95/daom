"use client";

import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { orderChannelsForAvailability } from "@/lib/consultation-availability";

/**
 * 시각 확정 후: 영업 외에는 전화를 숨기고 카카오·톡톡을 앞에 둔다.
 * 확정 전에는 채널을 바꾸지 않아 첫 페인트 플래시를 막는다.
 */
export function useOrderedConsultationChannels<T extends { id: string }>(
  channels: T[],
): T[] {
  const { isOpen, isResolved } = useConsultationAvailability();
  return orderChannelsForAvailability(channels, isOpen, isResolved);
}
