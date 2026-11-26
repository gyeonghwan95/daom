/**
 * 문의 본문에서 수임 가능 신호만 고른다.
 * 본문·연락처는 분석 저장소에 넣지 않고, date·place·intent·docs 표시만 보낸다.
 */

export type HireQualToken = "date" | "place" | "intent" | "docs";

const DATE_RE =
  /(\d{4}\s*[.년/-]\s*\d{1,2})|(\d{1,2}\s*월(\s*\d{1,2}\s*일)?)|(잔금|사망|돌아가|기한|만료|만기|결의일|임기)/;

const PLACE_RE =
  /([가-힣]{1,12}(동|로|길|읍|면|리)\d*)|([가-힣]{2,10}(구|시)(?![가-힣]))|(아파트|오피스텔|빌라|다세대|다가구|상가)/;

const CITY_RE =
  /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/;

/** "맡기지"는 아래 거절 표현과 겹치므로, 거절이 있으면 맡기 의사는 빼다. */
const INTENT_RE = /(맡기|의뢰|수임|진행\s*(부탁|해\s*주|하고\s*싶)|처리\s*(부탁|해\s*주))/;

const DECLINE_RE = /(맡기지\s*않|안\s*맡|위임하지\s*않|상담만\s*받)/;

export function qualifyHireSignals(
  text: string,
  options?: { hasDocuments?: boolean },
): HireQualToken[] {
  const s = String(text || "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
  const tokens: HireQualToken[] = [];
  if (DATE_RE.test(s)) tokens.push("date");
  if (PLACE_RE.test(s) || CITY_RE.test(s)) tokens.push("place");
  if (INTENT_RE.test(s) && !DECLINE_RE.test(s)) tokens.push("intent");
  if (options?.hasDocuments) tokens.push("docs");
  return tokens;
}

/** 분석 이벤트 meta.qual. 신호가 없으면 빈 문자열. */
export function hireQualMeta(text: string, options?: { hasDocuments?: boolean }): string {
  return qualifyHireSignals(text, options).join(",");
}
