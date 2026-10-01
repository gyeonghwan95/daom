import { daeguMetroRemote } from "@/lib/metro-remote/pages/daegu";
import { daejeonMetroRemote } from "@/lib/metro-remote/pages/daejeon";
import { seoulMetroRemote } from "@/lib/metro-remote/pages/seoul";
import { yonginMetroRemote } from "@/lib/metro-remote/pages/yongin";
import type { MetroRemoteSpec } from "@/lib/metro-remote/types";

export const METRO_REMOTE_SPECS: readonly MetroRemoteSpec[] = [
  seoulMetroRemote,
  yonginMetroRemote,
  daejeonMetroRemote,
  daeguMetroRemote,
];

const BY_SLUG = new Map(METRO_REMOTE_SPECS.map((spec) => [spec.slug, spec]));

export function getMetroRemoteTarget(slug: string): MetroRemoteSpec | undefined {
  return BY_SLUG.get(slug);
}
