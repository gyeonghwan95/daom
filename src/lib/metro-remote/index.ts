import { bucheonMetroRemote } from "@/lib/metro-remote/pages/bucheon";
import { daeguMetroRemote } from "@/lib/metro-remote/pages/daegu";
import { daejeonMetroRemote } from "@/lib/metro-remote/pages/daejeon";
import { gyeongsanMetroRemote } from "@/lib/metro-remote/pages/gyeongsan";
import { hwaseongMetroRemote } from "@/lib/metro-remote/pages/hwaseong";
import { seoulMetroRemote } from "@/lib/metro-remote/pages/seoul";
import { wonjuMetroRemote } from "@/lib/metro-remote/pages/wonju";
import { yonginMetroRemote } from "@/lib/metro-remote/pages/yongin";
import type { MetroRemoteSpec } from "@/lib/metro-remote/types";

export const METRO_REMOTE_SPECS: readonly MetroRemoteSpec[] = [
  seoulMetroRemote,
  yonginMetroRemote,
  daejeonMetroRemote,
  daeguMetroRemote,
  hwaseongMetroRemote,
  bucheonMetroRemote,
  wonjuMetroRemote,
  gyeongsanMetroRemote,
];

const BY_SLUG = new Map(METRO_REMOTE_SPECS.map((spec) => [spec.slug, spec]));

export function getMetroRemoteTarget(slug: string): MetroRemoteSpec | undefined {
  return BY_SLUG.get(slug);
}
