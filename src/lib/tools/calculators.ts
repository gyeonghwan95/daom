import type { ToolCalculatorInput, ToolCalculatorResult, ToolCalculatorType } from "./types";

function parseDate(value: string): Date | null {
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (ymd) return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatKr(date: Date): string {
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function monthEndAfter(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months + 1, 0);
}

const SERVICE_FEE_PER_ROUND = 5_640;

function civilStampFee(claim: number): number {
  if (claim < 10_000_000) return (claim * 50) / 10_000;
  if (claim < 100_000_000) return (claim * 45) / 10_000 + 5_000;
  if (claim < 1_000_000_000) return (claim * 40) / 10_000 + 55_000;
  return (claim * 35) / 10_000 + 555_000;
}

function roundStampFee(raw: number): number {
  if (raw < 1_000) return 1_000;
  return Math.floor(raw / 100) * 100;
}

function won(value: number): string {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function daysFromToday(target: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(target);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function invalidResult(message: string): ToolCalculatorResult {
  return {
    summary: message,
    details: [],
    urgency: "low",
    invalid: true,
    actions: ["날짜·금액을 다시 확인해 주세요."],
  };
}

/** 오늘(이용자 기기 기준) 0시 */
function todayStart(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * YYYY-MM-DD 날짜 입력 검증 — 형식·실재하는 날짜·1900년 이후·미래 아님.
 * 실패하면 이용자에게 보일 오류 문구를 돌려준다.
 */
export function parseInputDate(value: string, label: string): { date: Date } | { error: string } {
  const trimmed = value.trim();
  if (!trimmed) return { error: `${label}을 입력해 주세요.` };
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!m) return { error: `${label}을 연-월-일 형식으로 다시 입력해 주세요. 연도가 4자리인지 확인해 주세요.` };
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d || y < 1900) {
    return { error: `${label}이 올바른 날짜가 아닙니다. 다시 확인해 주세요.` };
  }
  if (date > todayStart()) return { error: `${label}이 오늘 이후 날짜입니다. 이미 지난 날짜를 입력해 주세요.` };
  return { date };
}

/**
 * 월 단위 기간의 만료일(민법 제157조 초일 불산입, 제160조 역에 의한 계산, 제161조 말일 토요일·공휴일 익일 만료).
 * 공휴일 중 일요일만 반영한다(설·추석·대체공휴일 등 그 밖의 공휴일 데이터는 없음 — 화면에 따로 표시).
 */
export function civilMonthPeriodEnd(eventDate: Date, months: number): { end: Date; shiftedFrom?: Date } {
  const start = addDays(eventDate, 1); // 초일 불산입
  const targetMonthLastDay = new Date(start.getFullYear(), start.getMonth() + months + 1, 0);
  let end: Date;
  if (start.getDate() > targetMonthLastDay.getDate()) {
    end = targetMonthLastDay; // 제160조 제3항: 최종 월에 해당일이 없으면 그 월의 말일
  } else {
    end = addDays(new Date(start.getFullYear(), start.getMonth() + months, start.getDate()), -1); // 제160조 제2항
  }
  const raw = end;
  while (end.getDay() === 6 || end.getDay() === 0) end = addDays(end, 1); // 토요일·일요일 → 익일
  return end.getTime() === raw.getTime() ? { end } : { end, shiftedFrom: raw };
}

const HOLIDAY_NOTE =
  "토요일·일요일은 반영했지만 설·추석·대체공휴일 같은 그 밖의 공휴일은 반영하지 않았습니다. 마지막 날이 공휴일이면 그다음 날까지입니다(민법 제161조).";

function calcInheritanceRegistrationDeadline(
  input: ToolCalculatorInput,
): ToolCalculatorResult {
  const parsedDeath = parseInputDate(String(input.deathDate ?? ""), "사망일(상속개시일)");
  if ("error" in parsedDeath) return invalidResult(parsedDeath.error);
  const deathDate = parsedDeath.date;

  const renunciationDeadline = civilMonthPeriodEnd(deathDate, 3).end;
  const acquisitionTaxDeadline = monthEndAfter(deathDate, 6);
  const acquisitionTaxDeadlineAbroad = monthEndAfter(deathDate, 9);
  const daysToRenunciation = daysFromToday(renunciationDeadline);
  const daysToAcquisitionTax = daysFromToday(acquisitionTaxDeadline);

  let urgency: ToolCalculatorResult["urgency"] = "low";
  if (
    (daysToRenunciation >= 0 && daysToRenunciation <= 14) ||
    (daysToAcquisitionTax >= 0 && daysToAcquisitionTax <= 30)
  ) {
    urgency = "urgent";
  } else if (daysToAcquisitionTax < 0 || daysToRenunciation <= 30) {
    urgency = "caution";
  }

  const timeline = [
    { label: "상속개시일(사망일)", date: formatKr(deathDate) },
    {
      label: "상속포기·한정승인 신고 기한",
      date: formatKr(renunciationDeadline),
      note: "사망 사실을 사망일에 안 경우 기준",
    },
    {
      label: "상속 취득세 신고·납부 기한",
      date: formatKr(acquisitionTaxDeadline),
      note: "사망한 달 말일부터 6개월",
    },
    {
      label: "외국에 주소를 둔 상속인이 있는 경우",
      date: formatKr(acquisitionTaxDeadlineAbroad),
      note: "사망한 달 말일부터 9개월",
    },
  ];

  return {
    summary:
      daysToAcquisitionTax >= 0
        ? `상속등기 자체에는 신청기한이 없지만, 상속 취득세는 ${formatKr(acquisitionTaxDeadline)}까지 신고·납부해야 합니다(약 ${daysToAcquisitionTax}일 남음). 상속포기·한정승인을 검토한다면 ${formatKr(renunciationDeadline)}까지가 기준입니다.`
        : `상속 취득세 신고기한(${formatKr(acquisitionTaxDeadline)})이 지난 것으로 보입니다. 상속등기는 지금도 할 수 있지만, 취득세에는 신고불성실·납부지연 가산세가 붙을 수 있어 세액부터 확인해야 합니다.`,
    details: [
      `사망일(상속개시일): ${formatKr(deathDate)}`,
      `상속포기·한정승인 기한: ${formatKr(renunciationDeadline)}${daysToRenunciation >= 0 ? ` — 약 ${daysToRenunciation}일 남음` : " — 기한 경과"}`,
      `상속 취득세 신고·납부 기한: ${formatKr(acquisitionTaxDeadline)}${daysToAcquisitionTax >= 0 ? ` — 약 ${daysToAcquisitionTax}일 남음` : " — 기한 경과"}`,
      "상속등기 자체에는 신청기한·과태료가 없습니다. 기한을 넘기면 취득세 가산세가 문제됩니다(지방세법 제20조, 지방세기본법).",
      "상속포기·한정승인 기간은 사망일이 아니라 상속개시 있음을 안 날부터 셉니다. 위 날짜는 사망 당일에 안 경우의 예시입니다.",
      HOLIDAY_NOTE,
    ],
    urgency,
    actions: [
      "가족관계증명서·등기부등본으로 상속인·재산을 확인해야 합니다.",
      "채무 여부를 조회·확인한 뒤 상속포기·한정승인·등기 방향을 검토해야 합니다.",
      "형제자매 등 상속인 협의가 필요하면 일정을 먼저 잡는 것이 좋습니다.",
    ],
    timeline,
  };
}

/** 날짜만으로 계산하지 않고 개별 확인으로 안내하는 상황 */
const RENUNCIATION_SPECIAL: Record<string, { title: string; body: string }> = {
  "later-heir": {
    title: "앞 순위 상속인이 포기해서 상속인이 된 경우",
    body: "앞 순위 상속인의 포기로 내가 상속인이 되었다면, 그 사실을 알게 된 날이 기준이 될 수 있습니다. 언제 알게 되었는지는 통지·서류로 따로 확인해야 해서 날짜만으로 계산하지 않습니다.",
  },
  "minor-or-incapacity": {
    title: "미성년자이거나 제한능력자인 상속인",
    body: "친권자 또는 후견인이 상속이 개시된 것을 안 날부터 기간을 세는 등(민법 제1020조) 확인할 사실이 더 있어 날짜만으로 계산하지 않습니다. 미성년 상속인은 성년이 된 뒤 한정승인을 할 수 있는 특례도 있습니다(민법 제1019조 제4항).",
  },
  "debt-found-later": {
    title: "빚이 재산보다 많다는 사실을 나중에 알게 된 경우",
    body: "3개월 안에 중대한 과실 없이 채무 초과 사실을 알지 못했다면, 그 사실을 안 날부터 3개월 안에 한정승인(특별한정승인)을 검토할 수 있습니다(민법 제1019조 제3항). 중대한 과실이 없었는지는 사정을 보고 판단해야 해서 날짜만으로 계산하지 않습니다.",
  },
  unknown: {
    title: "언제 알게 되었는지 정확히 모르는 경우",
    body: "기준일이 분명하지 않으면 계산 결과가 오히려 오해를 낳을 수 있습니다. 사망 사실을 알게 된 경위(연락받은 날, 서류를 받은 날 등)를 먼저 정리해 주세요.",
  },
};

function calcRenunciationDeadline(input: ToolCalculatorInput): ToolCalculatorResult {
  const situation = String(input.situation ?? "general");
  const special = RENUNCIATION_SPECIAL[situation];
  if (special) {
    return {
      summary: `${special.title}에는 날짜 계산 대신 개별 확인이 필요합니다. ${special.body}`,
      details: [
        "상속포기·한정승인은 상속개시 있음을 안 날부터 3개월 안에 가정법원에 신고합니다(민법 제1019조 제1항).",
        "‘안 날’은 상속이 시작된 사실을 알고 그로써 자기가 상속인이 된 것을 안 날이며, 상속재산이 있음을 안 날이 아닙니다(대법원 1984. 8. 23. 자 84스17 결정).",
        "이해관계인 등의 청구로 가정법원이 이 기간을 연장할 수 있습니다(민법 제1019조 제1항 단서).",
      ],
      urgency: "caution",
      actions: [
        "사망 사실·상속인이 된 사실을 알게 된 날과 그 근거(연락·통지·서류)를 정리해 두세요.",
        "채무·재산 자료를 모아 상속포기·한정승인 중 무엇이 맞는지 함께 검토하는 것이 좋습니다.",
      ],
    };
  }

  const parsed = parseInputDate(String(input.knownDate ?? input.deathDate ?? ""), "상속개시 있음을 안 날");
  if ("error" in parsed) return invalidResult(parsed.error);
  const knownDate = parsed.date;
  const { end: deadline, shiftedFrom } = civilMonthPeriodEnd(knownDate, 3);
  const daysLeft = daysFromToday(deadline);
  const urgency: ToolCalculatorResult["urgency"] =
    daysLeft < 0 ? "urgent" : daysLeft <= 14 ? "urgent" : daysLeft <= 30 ? "caution" : "low";

  return {
    summary:
      daysLeft >= 0
        ? `상속개시 있음을 ${formatKr(knownDate)}에 알았다면, 상속포기·한정승인 신고 기간은 ${formatKr(deadline)}까지로 계산됩니다(약 ${daysLeft}일 남음). 그 밖의 공휴일이 겹치면 하루 이상 늘어날 수 있습니다.`
        : `상속개시 있음을 ${formatKr(knownDate)}에 알았다면, 일반적인 3개월 기간(${formatKr(deadline)})은 지난 것으로 계산됩니다. 다만 안 날이 언제인지, 빚이 더 많다는 사실을 늦게 알았는지(특별한정승인)에 따라 아직 검토할 방법이 있을 수 있어 날짜만으로 단정할 수 없습니다.`,
    details: [
      `기준일(상속개시 있음을 안 날): ${formatKr(knownDate)}`,
      shiftedFrom
        ? `3개월 기간 만료일: ${formatKr(shiftedFrom)}이 토요일·일요일이라 ${formatKr(deadline)}까지`
        : `3개월 기간 만료일: ${formatKr(deadline)}`,
      "계산 방식: 안 날 다음 날부터 세고, 3개월째 같은 날짜의 전날에 끝납니다. 그 달에 같은 날짜가 없으면 그 달 말일입니다(민법 제157조·제160조).",
      HOLIDAY_NOTE,
      "‘안 날’은 상속이 시작된 사실을 알고 그로써 자기가 상속인이 된 것을 안 날이며, 상속재산이 있음을 안 날이 아닙니다(대법원 84스17). 사망일과 다를 수 있습니다.",
      "이해관계인 등의 청구로 가정법원이 기간을 연장할 수 있습니다(민법 제1019조 제1항 단서).",
    ],
    urgency,
    actions: [
      "채무·재산 목록을 먼저 정리해 한정승인·상속포기 필요 여부를 검토해야 합니다.",
      "상속포기는 가족마다 따로 신고하며, 앞 순위가 포기하면 다음 순위로 상속이 넘어갈 수 있어 가족과 함께 확인하는 것이 좋습니다.",
      "기한이 가깝거나 지났다면 서류 확인을 먼저 하는 것이 좋습니다.",
    ],
    timeline: [
      { label: "상속개시 있음을 안 날", date: formatKr(knownDate) },
      { label: "상속포기·한정승인 신고 기간 만료", date: formatKr(deadline), note: "그 밖의 공휴일 미반영" },
    ],
  };
}

const INHERITANCE_REGISTRATION_FEE = { paper: 20_000, eform: 17_000, electronic: 20_000 } as const;

const FILING_METHOD_LABEL = {
  paper: "서면",
  eform: "전자표준양식",
  electronic: "전자신청",
} as const;

function floorTo10(value: number): number {
  return Math.floor(value / 10) * 10;
}

function calcInheritanceRegistrationCost(input: ToolCalculatorInput): ToolCalculatorResult {
  const value = Number(String(input.propertyValue ?? "").replace(/,/g, ""));
  if (!Number.isFinite(value) || value <= 0) {
    return invalidResult("상속받는 부동산의 시가표준액(공시가격)을 입력해 주세요.");
  }

  const type = String(input.propertyType ?? "house");
  const isHouse = type === "house";
  const isFarmland = type === "farmland";
  const smallHouse = isHouse && String(input.smallHouse ?? "no") === "yes";
  const homelessSpecial = isHouse && String(input.homelessSpecial ?? "no") === "yes";
  const countRaw = Number(String(input.propertyCount ?? "1").replace(/,/g, ""));
  const count = Number.isFinite(countRaw) && countRaw >= 1 ? Math.floor(countRaw) : 1;
  const methodRaw = String(input.filingMethod ?? "paper");
  const method: keyof typeof INHERITANCE_REGISTRATION_FEE =
    methodRaw === "eform" || methodRaw === "electronic" ? methodRaw : "paper";

  // 세율 단위: 1/100,000 (2,800 = 2.8%)
  let acquisitionRate = isFarmland ? 2_300 : 2_800;
  let educationRate = isFarmland ? 60 : 160;
  let ruralRate = 200;
  let rateNote = isFarmland ? "농지 상속 세율" : "상속 일반 세율";

  if (homelessSpecial) {
    acquisitionRate = 800;
    educationRate = 160;
    ruralRate = 0;
    rateNote = "무주택 가구 1주택 상속 특례(지방세법 제15조 제1항)";
  } else if (smallHouse) {
    ruralRate = 0;
    rateNote = "전용 85㎡ 이하 주택(농어촌특별세 비과세)";
  }

  const exempt = value <= 500_000;
  const taxAt = (rate: number) => (exempt ? 0 : floorTo10(Math.floor((value * rate) / 100_000)));
  const acquisitionTax = taxAt(acquisitionRate);
  const educationTax = taxAt(educationRate);
  const ruralTax = taxAt(ruralRate);
  const registrationFee = INHERITANCE_REGISTRATION_FEE[method] * count;
  const taxTotal = acquisitionTax + educationTax + ruralTax;
  const total = taxTotal + registrationFee;
  const pct = (rate: number) => `${(rate / 1_000).toFixed(2).replace(/\.?0+$/, "")}%`;

  return {
    summary: `시가표준액 ${won(value)} 기준으로 상속등기 때 내는 세금·수수료는 약 ${won(total)}입니다(취득세 등 ${won(taxTotal)} + 등기신청수수료 ${won(registrationFee)}). 법무사 보수와 국민주택채권 할인 비용은 포함하지 않았습니다.`,
    details: [
      `적용 기준: ${rateNote}`,
      `취득세: ${won(acquisitionTax)} (${pct(acquisitionRate)})`,
      `지방교육세: ${won(educationTax)} (${pct(educationRate)})`,
      `농어촌특별세: ${won(ruralTax)} (${ruralRate === 0 ? "비과세" : pct(ruralRate)})`,
      `등기신청수수료: ${won(registrationFee)} (부동산 ${count}개 × ${won(INHERITANCE_REGISTRATION_FEE[method])}, ${FILING_METHOD_LABEL[method]})`,
      ...(exempt ? ["취득가액 50만원 이하는 취득세를 부과하지 않습니다(지방세법 제17조)."] : []),
      "상속 취득세 과세표준은 시가표준액(주택공시가격·개별공시지가 등)입니다. 여러 부동산이면 합계액을 넣되, 종류가 다르면 종류별로 따로 계산해야 정확합니다.",
      "국민주택채권은 시가표준액과 지역에 따라 매입 금액이 정해지며, 바로 팔면 할인 비용만 부담합니다.",
    ],
    urgency: "low",
    actions: [
      "주택공시가격·개별공시지가로 시가표준액을 먼저 확인해야 합니다.",
      "무주택 특례·85㎡ 이하 여부는 가족관계와 주택 면적으로 확인해야 합니다.",
      "취득세는 사망한 달 말일부터 6개월 안에 신고·납부해야 가산세가 붙지 않습니다.",
    ],
  };
}

function calcDirectorChangePenalty(input: ToolCalculatorInput): ToolCalculatorResult {
  const changeDate = parseDate(String(input.changeDate ?? ""));
  if (!changeDate) {
    return invalidResult("임원 변경일(취임·사임·임기만료일)을 입력해 주세요.");
  }

  const registrationDeadline = addDays(changeDate, 14);
  const daysLeft = daysFromToday(registrationDeadline);
  const urgency: ToolCalculatorResult["urgency"] =
    daysLeft < 0 ? "urgent" : daysLeft <= 3 ? "urgent" : daysLeft <= 7 ? "caution" : "low";

  return {
    summary:
      daysLeft >= 0
        ? `임원변경등기는 통상 변경일(취임·사임 등)부터 2주 이내 신청을 권장합니다. 참고 기한은 ${formatKr(registrationDeadline)} 전후입니다.`
        : `변경일로부터 2주가 경과한 것으로 보입니다. 과태료·보정 필요 여부를 검토해야 할 수 있습니다.`,
    details: [
      `변경일: ${formatKr(changeDate)}`,
      `등기 신청 참고 기한(2주): ${formatKr(registrationDeadline)}`,
      daysLeft >= 0
        ? `약 ${daysLeft}일 남은 것으로 계산됩니다.`
        : "기한 경과 — 과태료 부과 가능성을 확인해야 합니다.",
    ],
    urgency,
    actions: [
      "등기부등본·정관으로 결의 요건을 확인해야 합니다.",
      "주주총회·이사회 의사록·승낙서를 준비해야 합니다.",
      "지연이 길어졌다면 과태료·보정 범위를 상담으로 확인하는 것이 좋습니다.",
    ],
    timeline: [
      { label: "임원 변경일", date: formatKr(changeDate) },
      { label: "등기 신청 참고 기한(2주)", date: formatKr(registrationDeadline) },
    ],
  };
}

function calcHeadOfficeMove(input: ToolCalculatorInput): ToolCalculatorResult {
  const moveDate = parseDate(String(input.moveDate ?? ""));
  if (!moveDate) {
    return invalidResult("본점 이전일(사업장 이전일)을 입력해 주세요.");
  }

  const deadline = addDays(moveDate, 14);
  const daysLeft = daysFromToday(deadline);
  const urgency: ToolCalculatorResult["urgency"] =
    daysLeft < 0 ? "urgent" : daysLeft <= 3 ? "urgent" : daysLeft <= 7 ? "caution" : "low";

  return {
    summary:
      daysLeft >= 0
        ? `본점이전등기는 통상 이전일부터 2주 이내 신청을 검토합니다. 참고 기한은 ${formatKr(deadline)} 전후입니다.`
        : `본점 이전 후 2주가 경과한 것으로 보입니다. 등기 지연·과태료 여부를 확인해야 할 수 있습니다.`,
    details: [
      `본점 이전일: ${formatKr(moveDate)}`,
      `등기 신청 참고 기한(2주): ${formatKr(deadline)}`,
      "관할 등기소가 바뀔 수 있어 주소·관할을 함께 확인해야 합니다.",
    ],
    urgency,
    actions: [
      "이사회·주주총회 결의 요건을 정관과 대조해야 합니다.",
      "새 주소 임대차계약서·등기필증 등을 준비해야 합니다.",
      "사업자등록증·통장 주소도 등기 후 갱신이 필요할 수 있습니다.",
    ],
    timeline: [
      { label: "본점 이전일", date: formatKr(moveDate) },
      { label: "등기 신청 참고 기한(2주)", date: formatKr(deadline) },
    ],
  };
}

function calcJeonseTimeline(input: ToolCalculatorInput): ToolCalculatorResult {
  const leaseEnd = parseDate(String(input.leaseEndDate ?? ""));
  if (!leaseEnd) {
    return invalidResult("전세 계약 만료일을 입력해 주세요.");
  }

  const noticeDate = addDays(leaseEnd, -30);
  const followUp = addDays(leaseEnd, 14);
  const registrationReview = addDays(leaseEnd, 30);
  const daysToEnd = daysFromToday(leaseEnd);

  const urgency: ToolCalculatorResult["urgency"] =
    daysToEnd < 0 ? "caution" : daysToEnd <= 14 ? "caution" : "low";

  return {
    summary:
      daysToEnd >= 0
        ? `계약 만료일(${formatKr(leaseEnd)})을 기준으로 보증금 반환 독촴·증거 확보·임차권등기명령 검토 일정을 잡아 보았습니다.`
        : `계약이 만료된 것으로 보입니다. 보증금 미반환 시 권리 확보·독촉 기록을 검토해야 할 수 있습니다.`,
    details: [
      `계약 만료일: ${formatKr(leaseEnd)}`,
      "확정일자·대항력 요건·임대인 재산 상태에 따라 대응 순서가 달라질 수 있습니다.",
      "내용증명·합의 녹취 등 증거를 남기는 것이 좋습니다.",
    ],
    urgency,
    actions: [
      "전세계약서·확정일자·이체 내역을 확인해야 합니다.",
      "임대인 등기부등본으로 채무·경매 여부를 봐야 합니다.",
      "반환이 지연되면 임차권등기명령·배당요구 검토가 필요할 수 있습니다.",
    ],
    timeline: [
      { label: "만료 전 독촉·협의 권장(참고)", date: formatKr(noticeDate) },
      { label: "계약 만료일", date: formatKr(leaseEnd) },
      { label: "반환 지연 시 추가 대응 검토(참고)", date: formatKr(followUp) },
      { label: "권리 확보 절차 검토(참고)", date: formatKr(registrationReview) },
    ],
  };
}

function calcPaymentOrderFee(input: ToolCalculatorInput): ToolCalculatorResult {
  const raw = String(input.claimAmount ?? "").replace(/,/g, "");
  const amount = Number(raw);
  if (!raw || Number.isNaN(amount) || amount <= 0) {
    return invalidResult("청구 금액을 입력해 주세요.");
  }

  const partiesRaw = Number(String(input.partyCount ?? "2").replace(/,/g, ""));
  const parties =
    Number.isFinite(partiesRaw) && partiesRaw >= 2 ? Math.floor(partiesRaw) : 2;

  const lawsuitStamp = roundStampFee(civilStampFee(amount));
  const orderStamp = roundStampFee(civilStampFee(amount) / 10);
  const serviceFee = SERVICE_FEE_PER_ROUND * parties * 6;
  const total = orderStamp + serviceFee;

  const urgency: ToolCalculatorResult["urgency"] =
    amount >= 50_000_000 ? "caution" : "low";

  return {
    summary: `청구금액 ${won(amount)}, 당사자 ${parties}명 기준 지급명령 신청 때 법원에 내는 돈은 인지액 ${won(orderStamp)}과 송달료 ${won(serviceFee)}, 합계 ${won(total)}입니다.`,
    details: [
      `인지액: ${won(orderStamp)} — 소장 인지액의 10분의 1(민사소송 등 인지법 제7조 제2항), 1천원 미만은 1천원·100원 미만은 버림`,
      `송달료: ${won(serviceFee)} — 1회 ${won(SERVICE_FEE_PER_ROUND)} × 당사자 ${parties}명 × 6회분 예납, 남으면 돌려받음`,
      `같은 금액으로 소장을 낼 때의 인지액: ${won(lawsuitStamp)}`,
      "채무자가 이의신청을 하면 소송으로 넘어가며, 이때 소장 인지액과의 차액과 추가 송달료를 내야 합니다.",
      "인지액이 1만원 이상이면 인지 대신 송달료 수납은행에 현금으로 냅니다. 이자·지연손해금은 청구금액(소가)에 넣지 않습니다.",
      "법무사 서류작성 보수는 위 금액과 별도입니다.",
    ],
    urgency,
    actions: [
      "채권 원인·이체·계약서 등 증거를 정리해야 합니다.",
      "채무자 주소·송달 가능 여부를 확인해야 합니다.",
      "소멸시효 중단 여부를 함께 검토하는 것이 좋습니다.",
    ],
  };
}

function calcRealEstateDocuments(input: ToolCalculatorInput): ToolCalculatorResult {
  const type = String(input.transactionType ?? "sale");
  const hasMortgage = input.hasMortgage === "yes" || input.hasMortgage === true;

  const baseDocs = [
    "등기부등본·토지대장",
    "매도인·매수인 인감증명서·인감도장",
    "신분증 사본",
  ];

  const byType: Record<string, string[]> = {
    sale: ["매매계약서", "잔금 이체 증빙", "취득세 납부 서류(해당 시)"],
    gift: ["증여계약서", "증여세 관련 서류(해당 시)", "가족관계증명서"],
    inheritance: [
      "가족관계증명서(상세)·기본증명서",
      "협의분할협의서 또는 유언(해당 시)",
      "상속인 인감증명서",
    ],
    other: ["등기원인 증명 서류", "관할 확인 서류"],
  };

  const mortgageDocs = hasMortgage
    ? ["근저당권 말소·승낙 서류", "채권자 확인서(해당 시)"]
    : [];

  const docs = [...baseDocs, ...(byType[type] ?? byType.other), ...mortgageDocs];

  const typeLabel =
    type === "sale"
      ? "매매"
      : type === "gift"
        ? "증여"
        : type === "inheritance"
          ? "상속"
          : "기타";

  return {
    summary: `${typeLabel} 등기 기준으로 우선 확인하면 좋은 서류 목록입니다. 담보(근저당) ${hasMortgage ? "있음" : "없음"} 기준으로 정리했습니다.`,
    details: docs,
    urgency: hasMortgage ? "caution" : "low",
    actions: [
      "최신 등기부등본으로 권리관계를 먼저 확인해야 합니다.",
      "매도인·매수인 모두의 인감·서류 일정을 맞춰야 합니다.",
      "관할 등기소와 등기원인별 추가 서류를 확인해야 합니다.",
    ],
  };
}

function calcRehabIncomeDebt(input: ToolCalculatorInput): ToolCalculatorResult {
  const income = Number(String(input.monthlyIncome ?? "").replace(/,/g, ""));
  const debt = Number(String(input.totalDebt ?? "").replace(/,/g, ""));
  if (Number.isNaN(income) || income <= 0 || Number.isNaN(debt) || debt <= 0) {
    return invalidResult("월 소득과 총 채무액을 입력해 주세요.");
  }

  const annualIncome = income * 12;
  const ratio = debt / annualIncome;
  const minLiving = income * 0.4;
  const roughRepayment = income - minLiving;

  let urgency: ToolCalculatorResult["urgency"] = "low";
  if (ratio >= 3 || roughRepayment <= 0) urgency = "urgent";
  else if (ratio >= 1.5) urgency = "caution";

  return {
    summary:
      ratio >= 3
        ? `총 채무가 연 소득의 약 ${ratio.toFixed(1)}배로, 개인회생·파산 등 채무 조정 검토가 필요할 수 있습니다.`
        : ratio >= 1.5
          ? `채무 규모가 연 소득 대비 높은 편으로 보입니다(약 ${ratio.toFixed(1)}배). 변제계획·워크아웃 등을 함께 검토해야 할 수 있습니다.`
          : `채무·소득 비율은 약 ${ratio.toFixed(1)}배로, 추가 사실관계에 따라 회생·파산·분할상환 등 방향이 달라질 수 있습니다.`,
    details: [
      `월 소득(입력): ${income.toLocaleString("ko-KR")}원`,
      `총 채무(입력): ${debt.toLocaleString("ko-KR")}원`,
      `연 소득 대비 채무 비율(참고): 약 ${ratio.toFixed(1)}배`,
      `최저생계비를 단순 반영한 월 가용액(참고): 약 ${Math.max(0, roughRepayment).toLocaleString("ko-KR")}원 — 실제는 부양가족·담보 등에 따라 달라집니다.`,
    ],
    urgency,
    actions: [
      "채권자별 잔액증명서·채무 목록을 정리해야 합니다.",
      "부양가족·담보·재산(부동산·예금)을 함께 확인해야 합니다.",
      "급여압류·가압류가 있다면 우선 상담 일정을 잡는 것이 좋습니다.",
    ],
  };
}

const CALCULATORS: Record<
  ToolCalculatorType,
  (input: ToolCalculatorInput) => ToolCalculatorResult
> = {
  "inheritance-registration-deadline": calcInheritanceRegistrationDeadline,
  "inheritance-renunciation-deadline": calcRenunciationDeadline,
  "inheritance-registration-cost": calcInheritanceRegistrationCost,
  "director-change-penalty": calcDirectorChangePenalty,
  "head-office-move-deadline": calcHeadOfficeMove,
  "jeonse-deposit-timeline": calcJeonseTimeline,
  "payment-order-fee": calcPaymentOrderFee,
  "real-estate-documents": calcRealEstateDocuments,
  "rehab-income-debt": calcRehabIncomeDebt,
};

export function runToolCalculator(
  type: ToolCalculatorType,
  input: ToolCalculatorInput,
): ToolCalculatorResult {
  return CALCULATORS[type](input);
}
