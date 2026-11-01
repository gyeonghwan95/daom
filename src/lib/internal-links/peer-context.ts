import { cache } from "react";

/**
 * 렌더 한 번(페이지 하나) 동안만 유지되는 현재 경로 기록.
 * 페이지 함수가 기록하고, 본문 끝의 MainContactPhone이 읽어 같은 유형 페이지 링크를 붙인다.
 * 페이지마다 PageContainer를 거치는 수십 개 뷰를 건드리지 않기 위한 장치다.
 */
const store = cache(() => ({ path: "" }));

export function setPeerPagePath(path: string): void {
  store().path = path.normalize("NFC");
}

export function getPeerPagePath(): string {
  return store().path;
}
