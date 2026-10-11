import { RESOURCE_VERSION } from "@/data/resources/guides";

/** 버전이 붙은 정적 자산 경로 — 버전을 올려도 이전 파일은 남겨 기존 링크를 깨지 않는다 */
export function resourceAssetPaths(slug: string) {
  return {
    png: `/resources/files/${slug}-v${RESOURCE_VERSION}.png`,
    pdf: `/resources/pdf/${slug}-v${RESOURCE_VERSION}.pdf`,
    og: `/resources/og/${slug}-v${RESOURCE_VERSION}.png`,
  };
}
