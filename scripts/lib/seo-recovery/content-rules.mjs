/**
 * 법률 사실 오류·업무범위 오인 문구 탐지 규칙.
 * 감사 스크립트와 회귀 테스트가 같은 규칙을 쓴다.
 * 적중 문장 안에 부정·한정 표현이 있으면 negated, 면제 표현이 있으면 exempt로 표시한다.
 */

const NEGATION = /(않|아닙|아니|아닌|아님|없습|없으|없는|없고|없다|없어|없음|없지|불가|금지|별도|변호사|공증인|세무사|제외|오해|혼동|구분|분리|영역|기대|표방|궁금|\?)/;

/** 상속등기 자체의 기한·과태료를 단정하는 서술 (회귀 테스트 대상) */
export const FACT_RULES = [
  {
    id: "inheritance-registration-6month-deadline",
    label: "상속등기 6개월 신청기한 단정",
    re: /상속\s*등기[^.?!]{0,30}?6\s*개월\s*(?:이내|내|안|까지)(?:에)?\s*(?:해야|신청해야|마쳐야|등기해야|하셔야|완료해야|접수해야)|상속\s*등기\s*(?:신청\s*)?기한[은는이]?\s*(?:사망[^.?!]{0,15})?6\s*개월/g,
    // 같은 문장에서 취득세·상속세 기한을 설명하는 경우는 등기기한 서술이 아니다.
    exempt: /(취득세|상속세)/,
  },
  {
    id: "inheritance-registration-penalty",
    label: "상속등기 지연 과태료 단정",
    re: /상속\s*등기[^.?!]{0,25}?(?:늦|미루|미뤄|지연|하지 않|안 하|기한[을이]?\s*(?:넘기|지나))[^.?!]{0,30}?과태료[가를는이]?\s*(?:부과|나오|나옵|내야|물게|물어|있습|발생|붙)|(?:신고|등기)\s*기한과\s*지연\s*시\s*과태료/g,
    exempt: null,
  },
  {
    id: "inheritance-3month-registration",
    label: "상속 3개월 내 신고·등기 원칙 단정",
    re: /(?:사망|상속\s*개시)[^.?!]{0,15}?3\s*개월\s*(?:이내|내|안에?)\s*(?:신고\s*[·및]?\s*)?등기(?:가|를|해야|하는\s*것이)?\s*(?:원칙|해야|마쳐야)/g,
    exempt: null,
  },
];

/** 상속등기·과태료가 함께 언급된 모든 문장 (감사 보고용, 사람이 검토) */
export const FACT_MENTION_RULES = [
  {
    id: "inheritance-registration-penalty-mention",
    label: "상속등기·과태료 동시 언급",
    re: /상속\s*등기[^.?!]{0,40}?과태료|과태료[^.?!]{0,30}?상속\s*등기/g,
    exempt: null,
  },
];

/** 법무사 업무 범위를 넘는 대리·변론 등을 수행하는 것처럼 보이는 서술 */
export const SCOPE_RULES = [
  { id: "litigation-agency", label: "소송 대리/수행", re: /소송\s*(?:을\s*)?(?:대리(?!인)|수행|대행)/g, exempt: null },
  { id: "trial-agency", label: "재판·법정 대리", re: /재판\s*(?:을\s*)?(?:대리|변론)|법정\s*(?:변론|출석\s*대리)/g, exempt: null },
  { id: "criminal-defense", label: "형사 변론/변호", re: /형사\s*(?:사건\s*)?(?:변론|변호)/g, exempt: null },
  { id: "pleading", label: "변론 대리", re: /변론\s*(?:을\s*)?(?:대리|수행|해\s*드)/g, exempt: null },
  { id: "negotiation-agency", label: "협상 대리", re: /(?:협상|합의)\s*(?:을\s*)?대리/g, exempt: null },
  { id: "legal-representation", label: "법률대리", re: /법률\s*대리(?!인)/g, exempt: null },
  { id: "notarization", label: "공증 직접 수행", re: /공증\s*(?:을\s*)?(?:대행|해\s*드|직접)/g, exempt: null },
  { id: "tax-filing", label: "세금 신고 대행", re: /(?:국세|양도소득세|양도세|상속세|증여세|종합소득세|부가가치세)\s*신고\s*(?:를\s*)?대행/g, exempt: null },
];

function contextOf(text, index, length) {
  const before = text.slice(Math.max(0, index - 120), index);
  const after = text.slice(index + length, index + length + 120);
  const startCut = Math.max(before.lastIndexOf(". "), before.lastIndexOf("? "), before.lastIndexOf("! "));
  const endRel = after.search(/[.?!](\s|$)/);
  const sentence =
    (startCut >= 0 ? before.slice(startCut + 2) : before) +
    text.slice(index, index + length) +
    (endRel >= 0 ? after.slice(0, endRel + 1) : after);
  return sentence.trim();
}

export function findRuleHits(text, rules) {
  const hits = [];
  for (const rule of rules) {
    rule.re.lastIndex = 0;
    for (const m of text.matchAll(rule.re)) {
      const context = contextOf(text, m.index, m[0].length);
      const exempt = rule.exempt ? rule.exempt.test(context) : false;
      const negated = NEGATION.test(context);
      hits.push({ rule: rule.id, label: rule.label, match: m[0], context, negated, exempt });
    }
  }
  return hits;
}

/** 부정·면제 문맥이 아닌, 수정이 필요한 적중만 */
export const isViolation = (h) => !h.negated && !h.exempt;
