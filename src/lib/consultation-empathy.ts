import {
  consultationReassurance,
  consultationReplySla,
} from "@/lib/consultation-copy";

export type ConsultIntent =
  | "rehab"
  | "renunciation"
  | "guardianship"
  | "overseas-inheritance"
  | "sibling-conflict"
  | "will-probate"
  | "will-notary"
  | "inheritance"
  | "jeonse"
  | "company-setup"
  | "corporate"
  | "gift"
  | "auction-winning"
  | "auction-analysis"
  | "mortgage-cancel"
  | "real-estate"
  | "general";

export type ConsultEmpathy = {
  intent: ConsultIntent;
  line: string;
  example: string;
  quiet: boolean;
  hidePlaces: boolean;
  comfort: boolean;
  primary: "kakao" | "phone" | "inquiry";
  costLine: string;
  afterInquiry: string;
  photoHint: string;
};

export const consultKakaoGreeting =
  "상황만 적어 주세요. 제가 확인하고 필요한 순서만 말씀드립니다.";

const AFTER =
  "문의 후 상황 확인 → 범위·비용·서류 안내 → 맡기시면 진행합니다. 문의만으로 진행되지 않습니다.";

function decodePath(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

const BASE: Omit<
  ConsultEmpathy,
  "intent" | "line" | "example" | "primary" | "costLine"
> = {
  quiet: false,
  hidePlaces: false,
  comfort: false,
  afterInquiry: AFTER,
  photoHint: consultationReassurance.photo,
};

function pack(
  partial: Pick<ConsultEmpathy, "intent" | "line" | "example"> &
    Partial<ConsultEmpathy>,
): ConsultEmpathy {
  return {
    ...BASE,
    primary: "kakao",
    costLine: consultationReassurance.cost,
    ...partial,
  };
}

/**
 * 세무·의료처럼 법무사 업무 밖으로 읽힐 수 있는 문맥에서, 제목 바로 아래에 둘 업무 경계 고지.
 * 해당 문맥이 아닌 페이지는 null이라 아무것도 더하지 않는다.
 */
export function getScopeBoundaryNote(pathname: string): string | null {
  const path = decodePath(pathname);
  if (/의료법인|병원/.test(path)) {
    return "이 사무소는 의료법인의 설립·변경 등기 서류를 작성하고 신청합니다. 의료기관 운영, 의료법 해석, 설립 허가 요건에 대한 자문은 하지 않으며 관할 관청과 해당 분야 전문가에게 확인하셔야 합니다.";
  }
  if (/상속세|취득세|증여세|양도세|상속증여등기비교|세금/.test(path)) {
    return "세금의 계산·신고·절세 판단은 세무사 업무라 이 사무소가 하지 않습니다. 등기에 필요한 취득세 납부 자료 준비와 등기 신청만 맡으며, 세액은 세무사에게 확인하셔야 합니다.";
  }
  return null;
}

export function getConsultEmpathy(pathname: string): ConsultEmpathy {
  const path = decodePath(pathname);

  if (/개인회생|개인파산|회생|파산|채무|압류|rehab|bankruptcy/.test(path)) {
    return pack({
      intent: "rehab",
      line: "이름 없이 상황만 남겨 주셔도 됩니다. 제가 직접 확인합니다.",
      example: "급여가 압류됐습니다. 회생이 가능한지 알고 싶습니다.",
      quiet: true,
      hidePlaces: true,
      photoHint: "소득·채무 자료 사진은 번호를 가리고 보내셔도 됩니다.",
    });
  }

  if (/포기|한정승인/.test(path)) {
    return pack({
      intent: "renunciation",
      line: "3개월이 걱정되시면 날짜만 알려 주세요. 오늘 밤 다 정하지 않으셔도 됩니다.",
      example:
        "돌아가신 지 두 달입니다. 빚이 있는 것 같아 포기를 알아보고 있습니다.",
      costLine:
        "법원 수수료와 법무사 보수를 나눠 안내합니다. 확정 금액은 사실관계 확인 후입니다.",
    });
  }

  if (/후견|특별대리/.test(path)) {
    return pack({
      intent: "guardianship",
      line: "부모님이 살아 계셔도 됩니다. 의사 소견서나 형제 합의가 없어도 지금 사실관계만 남겨 주세요.",
      example:
        "부모님이 살아 계신데 통장과 부동산 관리가 어려워 후견을 알아보고 있습니다.",
      hidePlaces: true,
      comfort: true,
      costLine:
        "가정법원 신청 비용과 법무사 보수를 나눠 안내합니다. 소송 대리는 하지 않습니다.",
      photoHint:
        "등기부나 진단 관련 사진만 보내셔도 됩니다. 주민등록번호는 가려 주세요.",
    });
  }

  if (/연락두절|siblings-not-cooperating|형제.*협조|협조하지/.test(path)) {
    return pack({
      intent: "sibling-conflict",
      line: "혼자 문의하셔도 됩니다. 협의로 되는 범위와 심판이 필요한 범위를 먼저 가릅니다.",
      example:
        "형제 중 한 명이 인감을 안 맞춰 줍니다. 혼자 등기가 가능한지 알고 싶습니다.",
      costLine:
        "공유등기까지 가능한 경우와 분할 심판(변호사 영역)을 구분해 안내합니다.",
    });
  }

  if (
    /해외거주상속|재외국민|해외.?거주.?상속|overseas-inheritance/.test(path)
  ) {
    return pack({
      intent: "overseas-inheritance",
      line: "거주국과 사망일만 알려 주세요. 오늘 해외에 시킬 일부터 회신합니다.",
      example:
        "상속인 중 한 명이 해외에 있습니다. 공증·아포스티유부터 알고 싶습니다.",
      costLine:
        "국내 등기 보수와 현지 공증·번역 비용을 나눠 안내합니다. 입국 여부는 단정하지 않습니다.",
      photoHint:
        "위임장·공증 사진과 등기부를 보내셔도 됩니다. 주민등록번호는 가려 주세요.",
    });
  }

  if (/유언검인/.test(path)) {
    return pack({
      intent: "will-probate",
      line: "유언장 사진만 보내 주셔도 됩니다. 검인 대상인지부터 가립니다. 효력 다툼은 하지 않습니다.",
      example: "자필 유언장을 발견했습니다. 검인이 필요한지 알고 싶습니다.",
      photoHint:
        "유언장 전체를 찍되 주민등록번호는 가려 주세요. 원본은 그대로 보관하세요.",
    });
  }

  if (/유언공증|유언/.test(path)) {
    return pack({
      intent: "will-notary",
      line: "공정증서 준비 범위를 안내합니다. 이 사무소는 공증을 대신 하지 않습니다.",
      example: "생전에 유언 공정증서를 준비하려고 합니다.",
    });
  }

  if (/상속|inheritance/.test(path)) {
    return pack({
      intent: "inheritance",
      line: "혼자 결정하지 않으셔도 됩니다. 지금 무엇을 해야 할지부터 제가 같이 정합니다.",
      example: "부모님 돌아가신 지 한 달, 집 하나 있습니다.",
      costLine:
        "법무사 보수와 취득세·등록면허세를 나눠 안내합니다. 확정 금액은 사실관계 확인 후입니다.",
    });
  }

  if (/전세|임대|임차|보증금|jeonse|lease/.test(path)) {
    return pack({
      intent: "jeonse",
      line: "보증금이 막히면 마음이 급합니다. 지금 상황만 적어 주세요. 제가 확인합니다.",
      example: "전세 만기인데 보증금이 안 나옵니다.",
      primary: "phone",
      costLine:
        "임차권등기·내용증명 등 가능한 순서를 먼저 안내하고, 보수와 실비를 나눠 말씀드립니다.",
    });
  }

  if (/법인설립|설립등기|설립자가진단/.test(path)) {
    return pack({
      intent: "company-setup",
      line: "상호·본점·임원·자본금만 알려 주시면 설립 순서를 먼저 회신합니다.",
      example: "1인 주식회사를 만들려고 합니다. 자본금과 본점부터 확인하고 싶습니다.",
      primary: "inquiry",
      costLine:
        "등록면허세와 법무사 보수를 나눠 안내합니다. 확정 금액은 정관·자본금 확인 후입니다.",
    });
  }

  if (/법인|임원|본점이전|대표이사|company|corporate/.test(path)) {
    return pack({
      intent: "corporate",
      line: "등기 기한이 있으면 날짜만 알려 주세요. 제가 가능한 순서를 먼저 회신합니다.",
      example: "임원 변경 등기 기한이 있어 확인이 필요합니다.",
      primary: "inquiry",
      costLine:
        "등록면허세·과태료 가능성과 법무사 보수를 나눠 안내합니다.",
    });
  }

  if (/경매낙찰/.test(path)) {
    return pack({
      intent: "auction-winning",
      line: "사건번호와 대금 기한만 알려 주세요. 촉탁·취득세·대출 근저당 순서를 맞춰 드립니다.",
      example: "경매에 낙찰받았습니다. 대금 기한이 있어 등기 순서가 궁금합니다.",
      costLine:
        "촉탁·이전 보수와 취득세를 나눠 안내합니다. 낙찰이나 일정을 보장하지 않습니다.",
    });
  }

  if (/경매권리분석|경매/.test(path)) {
    return pack({
      intent: "auction-analysis",
      line: "입찰 전 등기부에서 확인할 점을 안내합니다. 입찰가 산정·낙찰은 하지 않습니다.",
      example: "입찰 전입니다. 등기부에서 무엇을 봐야 하는지 알고 싶습니다.",
    });
  }

  if (/증여/.test(path)) {
    return pack({
      intent: "gift",
      line: "잔금일이 없는 일정입니다. 증여세는 세무 확인, 여기선 등기 순서와 서류를 안내합니다.",
      example: "아파트를 자녀에게 증여하려고 합니다. 등기부만 있습니다.",
      comfort: true,
      costLine:
        "법무사 보수와 취득세·등록면허세를 나눠 안내합니다. 증여세액은 세무사 확인이 필요합니다.",
      photoHint:
        "등기부만 보내셔도 됩니다. 주민등록번호는 가려 주세요.",
    });
  }

  if (/말소|근저당말소/.test(path)) {
    return pack({
      intent: "mortgage-cancel",
      line: "대출을 갚으셨으면 상환 확인서만 알려 주세요. 말소 순서를 맞춰 드립니다.",
      example: "대출을 다 갚았습니다. 등기부 근저당 말소가 필요합니다.",
      costLine:
        "말소 보수와 등록면허세를 나눠 안내합니다. 매매 잔금일과는 별개입니다.",
    });
  }

  if (/매매|소유권|부동산|등기|real-estate/.test(path)) {
    return pack({
      intent: "real-estate",
      line: "잔금일이나 계약서만 알려 주셔도 됩니다. 제가 필요한 순서부터 맞춰 드립니다.",
      example: "잔금이 다음 주입니다. 소유권이전등기가 궁금합니다.",
      costLine:
        "법무사 보수와 취득세·등록면허세를 나눠 안내합니다. 확정 금액은 계약·가액 확인 후입니다.",
    });
  }

  return pack({
    intent: "general",
    line: "지금 무엇을 해야 할지부터 제가 같이 정합니다.",
    example: consultKakaoGreeting,
    photoHint: consultationReassurance.photo,
  });
}

export function consultPasteText(empathy: ConsultEmpathy): string {
  return empathy.example.trim() || consultKakaoGreeting;
}

export function consultSlaLine(isOpen: boolean, isResolved: boolean): string {
  if (isResolved && !isOpen) return consultationReplySla.night;
  return consultationReplySla.weekday;
}
