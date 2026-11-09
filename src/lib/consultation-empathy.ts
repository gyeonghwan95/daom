export type ConsultEmpathy = {
  line: string;
  example: string;
  quiet: boolean;
};

function decodePath(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

export function getConsultEmpathy(pathname: string): ConsultEmpathy {
  const path = decodePath(pathname);

  if (/개인회생|개인파산|회생|파산|채무|압류|rehab|bankruptcy/.test(path)) {
    return {
      line: "이름 없이 상황만 남겨 주셔도 됩니다. 제가 직접 확인합니다.",
      example: "급여가 압류됐습니다. 회생이 가능한지 알고 싶습니다.",
      quiet: true,
    };
  }
  if (/포기|한정승인/.test(path)) {
    return {
      line: "3개월이 걱정되시면 날짜만 알려 주세요. 오늘 밤 다 정하지 않으셔도 됩니다.",
      example: "돌아가신 지 두 달입니다. 빚이 있는 것 같아 포기를 알아보고 있습니다.",
      quiet: false,
    };
  }
  if (/상속|후견|inheritance/.test(path)) {
    return {
      line: "혼자 결정하지 않으셔도 됩니다. 지금 무엇을 해야 할지부터 제가 같이 정합니다.",
      example: "부모님 돌아가신 지 한 달, 집 하나 있습니다.",
      quiet: false,
    };
  }
  if (/전세|임대|임차|보증금|jeonse|lease/.test(path)) {
    return {
      line: "보증금이 막히면 마음이 급합니다. 지금 상황만 적어 주세요. 제가 확인합니다.",
      example: "전세 만기인데 보증금이 안 나옵니다.",
      quiet: false,
    };
  }
  if (/법인|설립|임원|본점이전|company|corporate/.test(path)) {
    return {
      line: "등기 기한이 있으면 날짜만 알려 주세요. 제가 가능한 순서를 먼저 회신합니다.",
      example: "임원 변경 등기 기한이 있어 확인이 필요합니다.",
      quiet: false,
    };
  }
  if (/매매|소유권|부동산|증여|등기|real-estate/.test(path)) {
    return {
      line: "잔금일이나 계약서만 알려 주셔도 됩니다. 제가 필요한 순서부터 맞춰 드립니다.",
      example: "잔금이 다음 주입니다. 소유권이전등기가 궁금합니다.",
      quiet: false,
    };
  }

  return {
    line: "지금 무엇을 해야 할지부터 제가 같이 정합니다.",
    example: "이런 상황인데, 어디부터 보면 될지 알고 싶습니다.",
    quiet: false,
  };
}

export const consultKakaoGreeting =
  "상황만 적어 주세요. 제가 확인하고 필요한 순서만 말씀드립니다.";
