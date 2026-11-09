"use client";

import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { orderChannelsForAvailability } from "@/lib/consultation-availability";

/**
 * 영업 중이 아니면 전화를 숨긴다. 확정 전에도 번호를 깜빡이지 않게 한다.
 */
export function useOrderedConsultationChannels<T extends { id: string }>(
  channels: T[],
): T[] {
  const { isOpen, isResolved } = useConsultationAvailability();
  return orderChannelsForAvailability(channels, isOpen, isResolved);
}
