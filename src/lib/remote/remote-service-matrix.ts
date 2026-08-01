/**
 * 원격(방문 전) 진행 적합도 — 콘텐츠에서 과장하지 않도록 업무별 수준을 고정한다.
 * A: 방문 전 대부분의 확인·준비 가능
 * B: 원격 검토·상담 가능하나 추가 확인 가능성 높음
 * C: 사건별로 방문·본인확인·별도 절차 필요할 수 있음
 */

export type RemoteSuitability = "A" | "B" | "C";

export type RemoteServiceMatrixItem = {
  id: string;
  label: string;
  category: "inheritance" | "corporate" | "real-estate" | "civil" | "general";
  suitability: RemoteSuitability;
  remoteScope: string;
  extraChecks: string[];
  relatedPaths: string[];
};

export const REMOTE_SERVICE_MATRIX: RemoteServiceMatrixItem[] = [
  {
    id: "inheritance-registration",
    label: "상속등기",
    category: "inheritance",
    suitability: "A",
    remoteScope:
      "사망일·상속인·부동산 주소로 절차·서류·비용 구성을 먼저 확인할 수 있습니다.",
    extraChecks: [
      "협의분할 인감·서명 원본",
      "해외 상속인 공증·번역",
      "연락두절·미성년 특별대리",
    ],
    relatedPaths: [
      "/전국상속등기",
      "/방문없이준비하는상속등기",
      "/상속인이여러지역에있는경우",
    ],
  },
  {
    id: "inheritance-renunciation",
    label: "상속포기",
    category: "inheritance",
    suitability: "A",
    remoteScope:
      "기한·관할 가정법원·준비서류를 원격으로 먼저 정리할 수 있습니다. 신고 관할은 유지됩니다.",
    extraChecks: ["가정법원 제출 원본·인감", "후순위 효과 안내"],
    relatedPaths: [
      "/방문없이준비하는상속포기한정승인",
      "/부산상속포기",
      "/부모빚상속방법",
    ],
  },
  {
    id: "qualified-acceptance",
    label: "한정승인",
    category: "inheritance",
    suitability: "B",
    remoteScope:
      "재산·채무 목록과 기한은 원격으로 확인할 수 있으나, 채권자·처분행위 쟁점이 있으면 추가 검토가 큽니다.",
    extraChecks: ["재산목록·채무목록 작성", "채권자 수·처분행위 여부"],
    relatedPaths: [
      "/방문없이준비하는상속포기한정승인",
      "/부산한정승인",
      "/사망자재산채무조회",
    ],
  },
  {
    id: "overseas-heir",
    label: "해외 거주 상속인",
    category: "inheritance",
    suitability: "B",
    remoteScope:
      "국내 준비와 해외 서명·위임 서류를 나눠 안내할 수 있습니다. 완전 비대면을 보장하지 않습니다.",
    extraChecks: ["아포스티유·영사확인", "번역·공증", "원본 전달"],
    relatedPaths: ["/해외거주상속인", "/사진전자파일우편으로서류전달"],
  },
  {
    id: "corporate-establishment",
    label: "법인설립등기",
    category: "corporate",
    suitability: "A",
    remoteScope:
      "상호·목적·임원·자본금 개요로 준비서류와 비용 구성을 먼저 안내할 수 있습니다.",
    extraChecks: ["인감·서명", "정관·의사록 원본", "공동창업자 지역 분산"],
    relatedPaths: [
      "/부산법인설립등기",
      "/방문없이준비하는법인설립",
      "/해외대표이사주주법인등기",
      "/업무사례/전국비대면법무사",
    ],
  },
  {
    id: "director-change",
    label: "임원변경등기",
    category: "corporate",
    suitability: "A",
    remoteScope:
      "등기부·정관으로 변경 가능 범위와 준비서류를 원격으로 확인할 수 있습니다.",
    extraChecks: ["임원 인감·서명", "임기·결의 서류"],
    relatedPaths: [
      "/부산임원변경등기",
      "/방문없이준비하는임원변경",
      "/해외대표이사주주법인등기",
    ],
  },
  {
    id: "hq-relocation",
    label: "본점이전등기",
    category: "corporate",
    suitability: "B",
    remoteScope:
      "관할 변경 여부를 먼저 확인하고, 서류 준비는 원격으로 시작할 수 있습니다. 법정관할을 유지합니다.",
    extraChecks: ["관할 등기소 변경", "세무·행정 별도 영역"],
    relatedPaths: ["/전국법인본점이전등기", "/부산본점이전등기"],
  },
  {
    id: "gift-registration",
    label: "증여등기",
    category: "real-estate",
    suitability: "A",
    remoteScope:
      "부동산 주소·당사자 관계로 서류·비용 구성을 먼저 확인할 수 있습니다.",
    extraChecks: ["인감·서명", "세금은 세무 별도", "해외 수증자 서류"],
    relatedPaths: [
      "/부산증여등기",
      "/부모자녀다른지역증여등기",
      "/부산부모자녀아파트증여등기",
      "/방문없이준비하는부담부증여",
      "/해외서류가필요한증여등기",
    ],
  },
  {
    id: "mortgage-cancel",
    label: "근저당권 말소등기",
    category: "real-estate",
    suitability: "A",
    remoteScope:
      "은행 말소서류 목록과 부동산 주소로 추가 필요 자료를 원격 확인할 수 있습니다.",
    extraChecks: ["은행 발급 서류 원본", "채권자 협조"],
    relatedPaths: [
      "/부산근저당말소등기",
      "/방문없이준비하는근저당말소",
      "/근저당말소필요서류",
    ],
  },
  {
    id: "jeonse-cancel",
    label: "전세권 말소등기",
    category: "real-estate",
    suitability: "A",
    remoteScope:
      "전세권자 말소 서류와 계약 종료·정산 여부를 원격으로 먼저 점검할 수 있습니다.",
    extraChecks: ["전세권자 협조", "확정일자와 전세권등기 구분"],
    relatedPaths: [
      "/부산전세권말소등기",
      "/방문없이준비하는전세권말소",
    ],
  },
  {
    id: "partition-registration",
    label: "공유물분할등기",
    category: "real-estate",
    suitability: "B",
    remoteScope:
      "등기원인(협의·판결)과 공유자 구성을 원격으로 확인할 수 있으나, 분쟁·측량은 추가될 수 있습니다.",
    extraChecks: ["등기원인 서류", "소송과의 경계", "측량·분필"],
    relatedPaths: ["/공유물분할등기서류준비", "/부산공동명의등기"],
  },
  {
    id: "provisional-attachment-apply",
    label: "가압류 신청 서류",
    category: "civil",
    suitability: "B",
    remoteScope:
      "채권·증거·목적물 개요로 신청 전 서류 범위를 원격 점검할 수 있으나 인용·담보는 보장하지 않습니다.",
    extraChecks: ["관할·담보", "송달·보정", "소송 대리 아님"],
    relatedPaths: ["/가압류신청서류준비", "/부산가압류말소등기"],
  },
  {
    id: "content-certified-mail",
    label: "내용증명 작성",
    category: "civil",
    suitability: "A",
    remoteScope:
      "사실관계·증거·주소를 원격으로 정리할 수 있습니다. 발송만으로 분쟁 해결을 보장하지 않습니다.",
    extraChecks: ["주소 확인", "과장 문구 지양", "다음 절차 연결"],
    relatedPaths: [
      "/내용증명작성준비",
      "/방문없이준비하는지급명령서류",
    ],
  },
  {
    id: "capital-increase",
    label: "유상증자등기",
    category: "corporate",
    suitability: "A",
    remoteScope:
      "등기부·정관·결의·납입 개요로 준비서류를 원격 확인할 수 있습니다.",
    extraChecks: ["납입 증명", "주주·임원 서명", "무상·감자와 구분"],
    relatedPaths: [
      "/부산유상증자등기",
      "/방문없이준비하는유상증자",
    ],
  },
  {
    id: "dormant-company-continue",
    label: "휴면법인 계속등기",
    category: "corporate",
    suitability: "B",
    remoteScope:
      "등기부와 계속·해산 의사로 선택지를 원격으로 나눌 수 있습니다. 가능 여부를 단정하지 않습니다.",
    extraChecks: ["임기·해태", "폐업 후 정리와 구분"],
    relatedPaths: [
      "/휴면법인계속등기준비",
      "/부산휴면법인계속등기",
      "/사업자폐업후법인정리",
    ],
  },
  {
    id: "corporate-dissolution",
    label: "법인해산·청산·폐업 후 정리",
    category: "corporate",
    suitability: "B",
    remoteScope:
      "등기부와 폐업 시점으로 해산·휴면 계속 선택지를 원격으로 먼저 나눌 수 있습니다. 결의·인감·채무 확인은 추가될 수 있습니다.",
    extraChecks: [
      "사업자 폐업과 법인등기 구분",
      "자산·채무·임기",
      "세무·노무 별도 영역",
    ],
    relatedPaths: [
      "/사업자폐업후법인정리",
      "/부산법인해산청산등기",
      "/부산휴면법인계속등기",
    ],
  },
  {
    id: "payment-order",
    label: "지급명령 서류작성",
    category: "civil",
    suitability: "B",
    remoteScope:
      "계약서·입금내역으로 서류 범위를 원격 검토할 수 있으나, 송달·보정에 따라 추가 대응이 필요할 수 있습니다.",
    extraChecks: ["상대방 주소", "송달·보정", "업무 범위 고지"],
    relatedPaths: [
      "/부산지방법원지급명령",
      "/방문없이준비하는지급명령서류",
    ],
  },
  {
    id: "leasehold-registration-order",
    label: "임차권등기명령",
    category: "civil",
    suitability: "B",
    remoteScope:
      "계약서·이사 전후 자료를 원격으로 검토할 수 있으나, 관할·요건은 사건별로 확인합니다.",
    extraChecks: ["관할 법원", "이사 시점", "보증금 입증"],
    relatedPaths: [
      "/부산임차권등기명령",
      "/이사후임차권등기명령준비",
      "/임차권등기명령필요서류",
    ],
  },
  {
    id: "provisional-disposition",
    label: "가처분 신청 서류",
    category: "civil",
    suitability: "B",
    remoteScope:
      "피보전권리·목적물·분쟁 자료를 원격으로 점검할 수 있으나, 심문·현장 확인이 필요할 수 있습니다.",
    extraChecks: ["가압류와 구분", "관할·담보", "인용 미보장"],
    relatedPaths: ["/가처분신청서류준비", "/가압류신청서류준비", "/민사소송"],
  },
  {
    id: "creditor-attachment-collection",
    label: "채권압류·추심 서류",
    category: "civil",
    suitability: "B",
    remoteScope:
      "집행권원·대상채권 개요를 원격으로 정리할 수 있으나, 회수 금액·시기는 보장하지 않습니다.",
    extraChecks: ["집행권원 확정", "제3채무자 개요", "회수 미보장"],
    relatedPaths: [
      "/채권압류추심서류준비",
      "/방문없이준비하는지급명령서류",
      "/공탁채권회수",
    ],
  },
  {
    id: "performance-deposit",
    label: "변제공탁 서류",
    category: "civil",
    suitability: "B",
    remoteScope:
      "채무·채권자·수령거부 개요를 원격으로 점검할 수 있으나, 채무 소멸을 단정하지 않습니다.",
    extraChecks: ["공탁 유형 구분", "관할 공탁소", "효과 미단정"],
    relatedPaths: ["/변제공탁서류준비", "/공탁채권회수"],
  },
  {
    id: "divorce-property-division-registry",
    label: "이혼 재산분할등기",
    category: "real-estate",
    suitability: "B",
    remoteScope:
      "분할 근거·등기부·담보를 원격으로 먼저 대조할 수 있으나, 인감·원본·금융 협의는 추가될 수 있습니다.",
    extraChecks: ["재산분할 근거서류", "근저당·대출", "이혼소송 대리 아님"],
    relatedPaths: [
      "/이혼재산분할등기서류준비",
      "/부산이혼재산분할등기",
      "/공유물분할등기서류준비",
    ],
  },
  {
    id: "attachment-cancellation-registry",
    label: "압류말소등기",
    category: "real-estate",
    suitability: "B",
    remoteScope:
      "기관 해제 서류·등기부를 원격으로 점검할 수 있으나, 말소 완료·체납 해소를 보장하지 않습니다.",
    extraChecks: ["가압류말소와 구분", "기관별 해제서류", "매매 일정 조율"],
    relatedPaths: [
      "/압류말소등기서류준비",
      "/부산압류말소등기",
      "/부산가압류말소등기",
    ],
  },
  {
    id: "inheritance-then-sale",
    label: "상속등기 후 매매",
    category: "inheritance",
    suitability: "B",
    remoteScope:
      "상속인·협의·잔금일로 순서를 원격으로 나눌 수 있으나, 세액·잔금일 준수는 보장하지 않습니다.",
    extraChecks: ["상속등기 선행", "협의분할·인감", "세무 별도"],
    relatedPaths: [
      "/상속등기후매매서류준비",
      "/부산상속후매매등기",
      "/방문없이준비하는상속등기",
    ],
  },
];

export function getRemoteMatrixByCategory(
  category: RemoteServiceMatrixItem["category"],
): RemoteServiceMatrixItem[] {
  return REMOTE_SERVICE_MATRIX.filter((i) => i.category === category);
}

export function getRemoteSuitabilityLabel(level: RemoteSuitability): string {
  switch (level) {
    case "A":
      return "방문 전 대부분의 확인·준비에 적합";
    case "B":
      return "원격 검토·상담 가능하나 추가 확인 가능성이 높음";
    case "C":
      return "사건별로 방문·본인확인·별도 절차가 필요할 수 있음";
  }
}
