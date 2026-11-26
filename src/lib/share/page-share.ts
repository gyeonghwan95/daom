/**
 * 페이지 공유 버튼('공유') 공통 규칙.
 *
 * 왜: 상속·증여·상속포기처럼 가족이 함께 정하는 일은 "형제들과 보고 정할게요"에서 연락이 끊긴다.
 * 읽던 안내를 그대로 가족에게 보내면 대화가 이 페이지를 기준으로 이어지고, 받은 사람도 바로 물어볼 수 있다(2026-11-17).
 *
 * - 받는 사람 구분은 주소 끝의 ?from= 값 하나로만 한다(개인정보·사건 내용은 담지 않는다).
 * - 공유 주소의 대표 주소(canonical)는 원래 페이지 그대로라 검색 색인에는 영향이 없다.
 */
export type ShareAudience = "family" | "work" | "share";

export type ShareCopy = {
  audience: ShareAudience;
  /** 버튼 글자 */
  label: string;
  /** 글 끝 안내 한 줄 */
  prompt: string;
  /** 공유 메시지 끝에 붙는 한 줄 */
  messageTail: string;
  /** 공유 링크로 들어온 사람에게 보이는 첫 줄 */
  arrivalTitle: string;
};

const WORK = /법인|임원|본점|회사|기업|협업|복대리|partners|건설|시행|공공기관|공기업|조합|재단|사단|스타트업|창업|corporate|company/;
// 회생·파산·채무는 가족에게 알리기 꺼리는 경우가 많아 '가족'이라는 말을 쓰지 않는다
const PRIVATE = /회생|파산|면책|신용회복|채무|빚|rehab|bankruptcy/;

export function getShareCopy(path: string): ShareCopy {
  let p = path;
  try {
    p = decodeURIComponent(path);
  } catch {
    /* 그대로 */
  }
  if (PRIVATE.test(p)) {
    return {
      audience: "share",
      label: "공유",
      prompt: "함께 볼 분이 있으면 이 안내를 그대로 보내 보세요.",
      messageTail: "같이 읽어 보고 정해요.",
      arrivalTitle: "공유받은 안내입니다",
    };
  }
  if (WORK.test(p)) {
    return {
      audience: "work",
      label: "공유",
      prompt: "대표·동료와 함께 정하시나요? 이 안내를 그대로 보내 보세요.",
      messageTail: "함께 보고 진행 방법을 정해요.",
      arrivalTitle: "함께 일하는 분이 보내 준 안내입니다",
    };
  }
  return {
    audience: "family",
    label: "공유",
    prompt: "가족과 함께 정하시나요? 읽던 안내를 그대로 보내 보세요.",
    messageTail: "같이 읽어 보고 정해요.",
    arrivalTitle: "가족이 보내 준 안내입니다",
  };
}

export const SHARE_PARAM = "from";
const AUDIENCES: ShareAudience[] = ["family", "work", "share"];

export function isShareAudience(v: string | null): v is ShareAudience {
  return v !== null && (AUDIENCES as string[]).includes(v);
}

/** 지금 페이지 주소(검색어·해시 제외) + ?from=<받는 사람> */
export function buildShareUrl(origin: string, pathname: string, audience: ShareAudience): string {
  return `${origin}${pathname}?${SHARE_PARAM}=${audience}`;
}
