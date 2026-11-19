import { daeguMetroRemote } from "@/lib/metro-remote/pages/daegu";
import { daejeonMetroRemote } from "@/lib/metro-remote/pages/daejeon";
import { seoulMetroRemote } from "@/lib/metro-remote/pages/seoul";
import { yonginMetroRemote } from "@/lib/metro-remote/pages/yongin";
import { ulsanMetroRemote } from "@/lib/metro-remote/pages/ulsan";
import { gwangjuMetroRemote } from "@/lib/metro-remote/pages/gwangju";
import { suwonMetroRemote } from "@/lib/metro-remote/pages/suwon";
import { seongnamMetroRemote } from "@/lib/metro-remote/pages/seongnam";
import { cheongjuMetroRemote } from "@/lib/metro-remote/pages/cheongju";
import type { MetroRemoteSpec } from "@/lib/metro-remote/types";

export const METRO_REMOTE_SPECS: readonly MetroRemoteSpec[] = [
  seoulMetroRemote,
  yonginMetroRemote,
  daejeonMetroRemote,
  daeguMetroRemote,
  // 2026-11-19: 공통 틀 위주로 10위 밖이던 대도시 상속 페이지를 고유 주제로 교체(URL 동일)
  ulsanMetroRemote,
  gwangjuMetroRemote,
  suwonMetroRemote,
  seongnamMetroRemote,
  cheongjuMetroRemote,
];

const BY_SLUG = new Map(METRO_REMOTE_SPECS.map((spec) => [spec.slug, spec]));

export function getMetroRemoteTarget(slug: string): MetroRemoteSpec | undefined {
  return BY_SLUG.get(slug);
}
