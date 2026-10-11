import fs from "node:fs";
import path from "node:path";
import type { EeatThumbImage } from "@/lib/lawyer-eeat-images";

/**
 * 서버(빌드) 전용: 소개 썸네일의 드롭인 파일(public/image/소개-*.jpg)이 실제로 있으면 그것을,
 * 없으면 기존 사진(fallbackSrc)을 src로 확정해 넘긴다.
 * 클라이언트가 없는 드롭인 경로를 요청하거나 RSC 데이터에 그 경로가 남지 않게 한다(2026-10-11, 404 정리).
 * 화면에 보이는 사진은 이전과 같다(EeatFactThumb는 원래 fallbackSrc를 먼저 보여 준다).
 */
export function resolveEeatThumb(image?: EeatThumbImage): EeatThumbImage | undefined {
  if (!image) return undefined;
  let dropInExists = false;
  try {
    const local = path.join(process.cwd(), "public", decodeURIComponent(image.src).normalize("NFC"));
    dropInExists = fs.existsSync(local);
  } catch {
    dropInExists = false;
  }
  if (dropInExists || !image.fallbackSrc) return { src: image.src, alt: image.alt };
  return { src: image.fallbackSrc, alt: image.alt };
}
