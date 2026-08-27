"use client";

import { useConsultationAvailability } from "@/hooks/useConsultationAvailability";
import { orderChannelsForAvailability } from "@/lib/consultation-availability";

/** 영업 외에는 카카오·톡톡을 전화보다 앞에 둔다. */
export function useOrderedConsultationChannels<T extends { id: string }>(
  channels: T[],
): T[] {
  const { isOpen } = useConsultationAvailability();
  return orderChannelsForAvailability(channels, isOpen);
}
