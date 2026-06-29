import type { ToolCalculatorInput, ToolCalculatorResult, ToolCalculatorType } from "./types";

function parseDate(value: string): Date | null {
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
    actions: ["날짜·금액을 다시 확인해 주세요."],
  };
}

function calcInheritanceRegistrationDeadline(
  input: ToolCalculatorInput,
): ToolCalculatorResult {
  const deathDate = parseDate(String(input.deathDate ?? ""));
  if (!deathDate) {
    return invalidResult("사망일(상속개시일)을 입력해 주세요.");
  }

  const renunciationDeadline = addDays(deathDate, 90);
  const reviewMilestone = addDays(deathDate, 60);
  const penaltyReview = addDays(deathDate, 180);
  const daysToRenunciation = daysFromToday(renunciationDeadline);
  const daysSinceDeath = -daysFromToday(deathDate);

  let urgency: ToolCalculatorResult["urgency"] = "low";
  if (daysToRenunciation <= 14 && daysToRenunciation >= 0) urgency = "urgent";
  else if (daysToRenunciation < 0 || daysSinceDeath > 120) urgency = "caution";
  else if (daysToRenunciation <= 30) urgency = "caution";

  const timeline = [
    { label: "상속개시일(사망일)", date: formatKr(deathDate) },
    {
      label: "상속포기·한정승인 신고 기한(참고)",
      date: formatKr(renunciationDeadline),
      note: "3개월 — 별도 검토 필요",
    },
    {
      label: "등기·서류 정리 권장 시점(참고)",
      date: formatKr(reviewMilestone),
      note: "빠른 확인이 좋을 수 있음",
    },
    {
      label: "지연 시 과태료 등 검토 시점(참고)",
      date: formatKr(penaltyReview),
      note: "사안별로 달라질 수 있음",
    },
  ];

  return {
    summary:
      daysToRenunciation >= 0
        ? `상속개시일 기준 상속포기·한정승인 관련 3개월 기한은 ${formatKr(renunciationDeadline)} 전후로 확인이 필요할 수 있습니다. 상속등기 역시 서류·채무를 먼저 정리해 검토하는 것이 좋습니다.`
        : `상속개시일로부터 3개월이 경과한 것으로 보입니다. 이미 단순승인으로 보일 수 있는지, 한정승인·상속포기 등 추가 검토가 필요할 수 있습니다.`,
    details: [
      `사망일(상속개시일): ${formatKr(deathDate)}`,
      `3개월 기한(참고): ${formatKr(renunciationDeadline)}${daysToRenunciation >= 0 ? ` — 약 ${daysToRenunciation}일 남음` : " — 기한 경과 가능"}`,
      "상속등기 자체의 기한은 사안마다 다르지만, 지연 시 과태료·세무 이슈를 검토해야 할 수 있습니다.",
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

function calcRenunciationDeadline(input: ToolCalculatorInput): ToolCalculatorResult {
  const deathDate = parseDate(String(input.deathDate ?? ""));
  if (!deathDate) {
    return invalidResult("사망일(상속개시일)을 입력해 주세요.");
  }

  const deadline = addDays(deathDate, 90);
  const daysLeft = daysFromToday(deadline);
  const urgency: ToolCalculatorResult["urgency"] =
    daysLeft < 0 ? "urgent" : daysLeft <= 14 ? "urgent" : daysLeft <= 30 ? "caution" : "low";

  return {
    summary:
      daysLeft >= 0
        ? `상속포기·한정승인 신고 기한은 통상 사망일(상속개시일)부터 3개월 이내로 알려져 있습니다. 기한은 ${formatKr(deadline)} 전후로 확인이 필요할 수 있습니다.`
        : `입력하신 사망일 기준 3개월이 이미 경과한 것으로 보입니다. 단순승인으로 처리되었을 가능성을 검토해야 할 수 있어 빠른 상담이 필요할 수 있습니다.`,
    details: [
      `상속개시일: ${formatKr(deathDate)}`,
      `3개월 기한(참고): ${formatKr(deadline)}`,
      daysLeft >= 0
        ? `오늘 기준 약 ${daysLeft}일 남은 것으로 계산됩니다.`
        : "기한이 지난 것으로 보이며, 예외·제척기간 여부는 별도 확인이 필요합니다.",
    ],
    urgency,
    actions: [
      "채무·재산 목록을 먼저 정리해 한정승인·상속포기 필요 여부를 검토해야 합니다.",
      "상속인 전원의 의견이 필요할 수 있으니 가족과 일정을 맞춰야 합니다.",
      "기한이 임박했거나 경과했다면 서류 확인을 우선하는 것이 좋습니다.",
    ],
    timeline: [
      { label: "상속개시일", date: formatKr(deathDate) },
      { label: "3개월 기한(참고)", date: formatKr(deadline) },
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

  let feeRange = "수만 원대";
  let stampNote = "소액";
  if (amount > 100_000_000) {
    feeRange = "수십만 원 이상";
    stampNote = "고액";
  } else if (amount > 30_000_000) {
    feeRange = "십만 원대~수십만 원";
    stampNote = "중고액";
  } else if (amount > 10_000_000) {
    feeRange = "수만 원~십만 원대";
    stampNote = "중액";
  }

  const urgency: ToolCalculatorResult["urgency"] =
    amount >= 50_000_000 ? "caution" : "low";

  return {
    summary: `청구금액 ${amount.toLocaleString("ko-KR")}원 기준, 지급명령 신청 시 인지대·송달료 등을 합쳐 대략 ${feeRange}부터 검토가 필요할 수 있습니다(${stampNote} 구간 참고).`,
    details: [
      "인지액은 청구금액·송달 횟수·관할에 따라 달라집니다.",
      "채무자 주소 확인·증거 정리 비용도 함께 고려해야 합니다.",
      "지급명령 대신 소장·조정 등 다른 경로가 맞을 수도 있습니다.",
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
