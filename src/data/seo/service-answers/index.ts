import type { ServiceAnswer } from "./types";
import { REAL_ESTATE_ANSWERS } from "./real-estate";
import { INHERITANCE_ANSWERS } from "./inheritance";
import { CORPORATE_ANSWERS } from "./corporate";
import { COURT_FAMILY_ANSWERS } from "./court-family";

export type { ServiceAnswer } from "./types";

/**
 * 업무 페이지 100개의 "핵심 답변"(2026-11-19).
 * 대상: seo-service-universe 업무 369개를 맡는 대표 URL 중 PageHero를 쓰는 페이지 + 질문 수요가 큰 정보 페이지.
 * 상속포기·공탁처럼 이미 첫 문단이 답변형인 전용 페이지(priority-seo·naver-recovery)는 넣지 않는다.
 */
export const SERVICE_ANSWERS: Record<string, ServiceAnswer> = {
  ...REAL_ESTATE_ANSWERS,
  ...INHERITANCE_ANSWERS,
  ...CORPORATE_ANSWERS,
  ...COURT_FAMILY_ANSWERS,
};

export function getServiceAnswer(path: string): ServiceAnswer | undefined {
  let p = path;
  try {
    p = decodeURIComponent(path);
  } catch {
    /* 그대로 */
  }
  return SERVICE_ANSWERS[p.replace(/\/$/, "") || "/"];
}
