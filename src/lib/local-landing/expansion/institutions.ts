export type InstitutionTopic = {
  key: string;
  institutionName: string;
  institutionType: "court" | "registry" | "family-court";
  address: string;
  accessNote: string;
  jurisdictionNote: string;
  relatedServiceSlugs: string[];
  practicalNotes: string[];
  documentTips: string[];
  primaryServiceSlug: string;
};

export const institutionTopics: Record<string, InstitutionTopic> = {
  "busan-district-court": {
    key: "busan-district-court",
    institutionName: "부산지방법원",
    institutionType: "court",
    address: "부산광역시 해운대구 센텀중앙로 100",
    accessNote: "센텀시티역·벡스코 인근. 방문 전 사건번호·접수 창구를 확인하세요.",
    jurisdictionNote:
      "부산·울산·경남 일부 민사·형사 1심 및 가압류·가처분 등 관련 서류 접수가 이뤄집니다. 사건 종류에 따라 동부지원·서부지원 관할이 달라질 수 있습니다.",
    relatedServiceSlugs: [
      "inheritance-registration",
      "personal-rehabilitation",
      "bankruptcy",
    ],
    practicalNotes: [
      "민사·가사·회생 관련 서류는 사건별 양식과 제출 부수가 다릅니다.",
      "접수 전 인감·위임장·신분증 등 기본 서류를 빠뜨리지 않도록 체크리스트를 만드는 것이 좋습니다.",
      "법원 방문 시간과 접수 마감 시각은 사건 유형별로 다를 수 있으니 당일 확인이 필요합니다.",
    ],
    documentTips: [
      "신청서·위임장·인감증명서",
      "사건별 첨부 서류(등기부등본, 가족관계증명서 등)",
      "수수료 납부 영수증",
    ],
    primaryServiceSlug: "inheritance-registration",
  },
  "busan-registry-office": {
    key: "busan-registry-office",
    institutionName: "부산지방법원 등기국",
    institutionType: "registry",
    address: "부산광역시 연제구 법원로 8",
    accessNote: "연산역·동래역 인근. 부동산·법인 등기 접수의 중심 기관입니다.",
    jurisdictionNote:
      "부산 전역 부동산·법인 등기 중 일부가 이곳에 접수됩니다. 부동산 소재지와 법인 본점에 따라 남부산·북부산·중부산·부산진 등기소로 나뉘기도 합니다.",
    relatedServiceSlugs: [
      "inheritance-registration",
      "real-estate-registration",
      "corporate-registration",
    ],
    practicalNotes: [
      "등기 신청서 작성 오류는 보정명령으로 이어져 기간이 늘어날 수 있습니다.",
      "채권자·상대방 동의서가 필요한 등기는 사전 협의가 중요합니다.",
      "전자등기(인터넷등기소) 가능 여부를 먼저 확인하면 방문 부담을 줄일 수 있습니다.",
    ],
    documentTips: [
      "등기신청서·인감증명서·등록세 영수증",
      "원인증서(매매계약서·협의분할서 등)",
      "토지·건물 등기사항증명서",
    ],
    primaryServiceSlug: "real-estate-registration",
  },
  "busan-east-branch-court": {
    key: "busan-east-branch-court",
    institutionName: "부산지방법원 동부지원",
    institutionType: "court",
    address: "부산광역시 해운대구 센텀중앙로 100",
    accessNote: "센텀·해운대·재송 일대에서 접근이 편합니다.",
    jurisdictionNote:
      "해운대·수영·기장 등 동부 지역 관련 일부 민사·형사 사건이 관할됩니다. 정확한 관할은 사건 소재지·당사자 주소에 따라 달라집니다.",
    relatedServiceSlugs: ["personal-rehabilitation", "bankruptcy"],
    practicalNotes: [
      "지급명령·소송·보전처분 등 절차마다 관할 기준이 다릅니다.",
      "회생·파산은 부산회생법원이 별도이므로 사건 종류를 먼저 구분해야 합니다.",
    ],
    documentTips: ["소장·신청서", "증거서류", "인감증명서·위임장"],
    primaryServiceSlug: "personal-rehabilitation",
  },
  "busan-east-registry": {
    key: "busan-east-registry",
    institutionName: "부산지방법원 동부지원 등기과",
    institutionType: "registry",
    address: "부산광역시 해운대구 센텀중앙로 100",
    accessNote: "동부지원 건물 내 등기 접수 창구를 이용합니다.",
    jurisdictionNote:
      "동부권 부동산·법인 등기 일부가 접수됩니다. 부동산 소재지에 따라 다른 등기소가 관할일 수 있습니다.",
    relatedServiceSlugs: ["real-estate-registration", "corporate-registration"],
    practicalNotes: [
      "관할 등기소 오접수는 반려·이송 사유가 될 수 있어 소재지 확인이 우선입니다.",
      "법인 본점 주소 변경 시 관할 등기소가 바뀔 수 있습니다.",
    ],
    documentTips: ["등기신청서", "정관·주주총회 의사록(법인)", "등록세 납부서"],
    primaryServiceSlug: "corporate-registration",
  },
  "busan-rehab-court": {
    key: "busan-rehab-court",
    institutionName: "부산회생법원",
    institutionType: "court",
    address: "부산광역시 연제구 법원로 8",
    accessNote: "개인회생·법인회생·파산 전문 법원입니다.",
    jurisdictionNote:
      "부산·경남 일대 개인회생·개인파산·법인회생 사건을 관할합니다. 신청 전 채무·소득·재산 현황 정리가 필요합니다.",
    relatedServiceSlugs: ["personal-rehabilitation", "bankruptcy"],
    practicalNotes: [
      "신청서 기재 누락은 보정명령·기각으로 이어질 수 있습니다.",
      "최근 대출·재산 처분 이력은 심사에 영향을 줄 수 있습니다.",
      "회생과 파산 중 선택은 소득·재산 구조에 따라 달라집니다.",
    ],
    documentTips: [
      "개인회생·파산 신청서",
      "채권자 목록·재산목록·수입지출목록",
      "소득증빙·재산증빙",
    ],
    primaryServiceSlug: "personal-rehabilitation",
  },
  "busan-family-court": {
    key: "busan-family-court",
    institutionName: "부산가정법원",
    institutionType: "family-court",
    address: "부산광역시 연제구 법원로 8",
    accessNote: "가사 사건(상속포기·한정승인 등) 접수 기관입니다.",
    jurisdictionNote:
      "상속포기·한정승인·유류분·이혼 등 가사 사건을 관할합니다. 피상속인 주소지 기준으로 관할이 정해집니다.",
    relatedServiceSlugs: [
      "inheritance-renunciation",
      "qualified-acceptance",
      "inheritance-registration",
    ],
    practicalNotes: [
      "상속포기·한정승인은 상속 개시를 안 난 때부터 3개월 내 신고가 원칙입니다.",
      "가족관계증명서·재산목록 등 준비 서류가 사건에 따라 달라집니다.",
    ],
    documentTips: [
      "상속포기·한정승인 신고서",
      "가족관계증명서·기본증명서",
      "재산·채무 목록",
    ],
    primaryServiceSlug: "inheritance-renunciation",
  },
  "nam-busan-registry": {
    key: "nam-busan-registry",
    institutionName: "남부산등기소",
    institutionType: "registry",
    address: "부산광역시 남구 수영로 312",
    accessNote: "남구·수영·해운대 일부 부동산 관할.",
    jurisdictionNote:
      "남부산권 부동산·법인 등기가 접수됩니다. 부동산 소재지를 기준으로 관할을 확인해야 합니다.",
    relatedServiceSlugs: ["real-estate-registration", "ownership-transfer"],
    practicalNotes: [
      "아파트·상가 매매 시 저당권 말소 순서를 등기 일정과 맞추는 것이 중요합니다.",
      "전세권·근저당 등기부 권리 관계를 먼저 확인하세요.",
    ],
    documentTips: ["등기신청서", "매매계약서", "등록세 영수증"],
    primaryServiceSlug: "ownership-transfer",
  },
  "buk-busan-registry": {
    key: "buk-busan-registry",
    institutionName: "북부산등기소",
    institutionType: "registry",
    address: "부산광역시 북구 금곡대로 231",
    accessNote: "북구·금정·강서 일부 관할.",
    jurisdictionNote: "북부산권 부동산 등기 접수. 덕천·화명·명지 등 소재지에 따라 관할이 정해집니다.",
    relatedServiceSlugs: ["inheritance-registration", "real-estate-registration"],
    practicalNotes: [
      "토지·건물 지분등기는 협의서·분할 내용이 정확해야 합니다.",
      "농지·임야 등 특수 부동산은 추가 서류가 필요할 수 있습니다.",
    ],
    documentTips: ["등기사항증명서", "분할협의서", "인감증명서"],
    primaryServiceSlug: "inheritance-registration",
  },
  "jung-busan-registry": {
    key: "jung-busan-registry",
    institutionName: "중부산등기소",
    institutionType: "registry",
    address: "부산광역시 동래구 중앙대로 1333",
    accessNote: "동래·연제·북구 일부 관할.",
    jurisdictionNote: "중부산권 부동산·법인 등기. 본점·부동산 소재지에 따라 관할이 달라집니다.",
    relatedServiceSlugs: ["corporate-registration", "director-change"],
    practicalNotes: [
      "법인 임원변경은 결의일로부터 등기 기한을 지키는 것이 중요합니다.",
      "본점 이전 시 정관 변경과 사업자등록 변경을 함께 검토하세요.",
    ],
    documentTips: ["등기신청서", "주주총회 의사록", "인감증명서"],
    primaryServiceSlug: "director-change",
  },
  "busanjin-registry": {
    key: "busanjin-registry",
    institutionName: "부산진등기소",
    institutionType: "registry",
    address: "부산광역시 부산진구 중앙대로 686",
    accessNote: "서면·부전·전포 일대 부동산 관할.",
    jurisdictionNote: "부산진구 및 서면 일대 상가·오피스·주택 등기가 집중 접수되는 등기소입니다.",
    relatedServiceSlugs: ["real-estate-registration", "ownership-transfer"],
    practicalNotes: [
      "상가·오피스텔 매매는 용도·대지권 비율 확인이 필요합니다.",
      "상속 후 매매까지 일정이 겹치면 세금·등기 순서를 함께 검토하세요.",
    ],
    documentTips: ["등기부등본", "계약서", "취득세 신고서"],
    primaryServiceSlug: "ownership-transfer",
  },
};

export type ConversionTopic = {
  key: string;
  title: string;
  serviceSlug: string;
  focusKeywords: string[];
  costFactors: string[];
  timelineNotes: string[];
  documentList: string[];
};

export const conversionTopics: Record<string, ConversionTopic> = {
  "lawyer-fee-busan": {
    key: "lawyer-fee-busan",
    title: "부산 법무사 비용",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["부산 법무사 비용", "수임료", "보수"],
    costFactors: [
      "사건 유형(상속·부동산·법인·회생)",
      "부동산 가액·채무 규모",
      "상속인 수·공동명의 여부",
      "저당권 말소·보정 등 부가 업무",
    ],
    timelineNotes: [
      "상담 후 항목별 견적을 안내합니다.",
      "등기신청 수수료·세금은 별도입니다.",
    ],
    documentList: ["등기부등본", "가족관계증명서", "상황 설명 자료"],
  },
  "lawyer-fee-table": {
    key: "lawyer-fee-table",
    title: "부산 법무사 보수표",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["법무사 보수표", "대한법무사협회", "수임료 기준"],
    costFactors: [
      "협회 보수 기준을 참고하되 사건별 난이도에 따라 달라집니다.",
      "복잡한 채무·지분·해외 상속인이 있으면 추가 비용이 발생할 수 있습니다.",
    ],
    timelineNotes: ["견적은 사건 내용 확인 후 투명하게 안내합니다."],
    documentList: ["사건 관련 서류", "등기부등본"],
  },
  "inheritance-reg-cost": {
    key: "inheritance-reg-cost",
    title: "상속등기 비용",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["상속등기 비용", "상속등기 수수료"],
    costFactors: ["부동산 평가액", "상속인 수", "말소 등기 필요 여부"],
    timelineNotes: ["등록면허세·법무사 수임료·등기신청 수수료로 구분 안내"],
    documentList: ["등기부등본", "상속재산 목록"],
  },
  "renunciation-cost": {
    key: "renunciation-cost",
    title: "상속포기 비용",
    serviceSlug: "inheritance-renunciation",
    focusKeywords: ["상속포기 비용", "가정법원 수수료"],
    costFactors: ["상속인 수", "공동포기 여부", "채무 조사 범위"],
    timelineNotes: ["가정법원 신고 수수료와 법무사 수임료가 별도입니다."],
    documentList: ["가족관계증명서", "채무 관련 자료"],
  },
  "qualified-cost": {
    key: "qualified-cost",
    title: "한정승인 비용",
    serviceSlug: "qualified-acceptance",
    focusKeywords: ["한정승인 비용", "상속 채무 조사"],
    costFactors: ["재산·채무 규모", "조사 범위", "이후 상속등기 병행 여부"],
    timelineNotes: ["한정승인 후 상속등기까지 일괄 진행 시 단계별 견적 가능"],
    documentList: ["재산목록", "채무 목록"],
  },
  "company-est-cost": {
    key: "company-est-cost",
    title: "법인설립등기 비용",
    serviceSlug: "company-establishment",
    focusKeywords: ["법인설립등기 비용", "설립 등기 수수료"],
    costFactors: ["자본금 규모", "임원 수", "정관 복잡도"],
    timelineNotes: ["등기 완료 후 사업자등록·계좌 개설은 별도 일정"],
    documentList: ["정관", "임원 인감증명서"],
  },
  "director-penalty": {
    key: "director-penalty",
    title: "임원변경등기 과태료",
    serviceSlug: "director-change",
    focusKeywords: ["임원변경등기 과태료", "등기 지연"],
    costFactors: ["변경 사유 발생일", "접수 지연 기간", "변경 항목 수"],
    timelineNotes: ["결의 후 신속 접수로 과태료를 피하는 것이 좋습니다."],
    documentList: ["주주총회 의사록", "취임승낙서"],
  },
  "ownership-docs": {
    key: "ownership-docs",
    title: "소유권이전등기 서류",
    serviceSlug: "ownership-transfer",
    focusKeywords: ["소유권이전등기 서류", "매매 등기"],
    costFactors: ["매매·증여·상속 원인별 서류 상이"],
    timelineNotes: ["취득세 신고 기한과 등기 접수 순서를 맞추세요."],
    documentList: ["매매계약서", "인감증명서", "등기부등본", "취득세 영수증"],
  },
  "inheritance-docs": {
    key: "inheritance-docs",
    title: "상속등기 필요서류",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["상속등기 필요서류", "상속등기 서류"],
    costFactors: ["상속인 협의 여부", "해외 상속인 유무"],
    timelineNotes: ["서류 준비가 되면 등기 기간이 단축됩니다."],
    documentList: [
      "사망사실증명서",
      "가족관계증명서",
      "협의분할서 또는 공동상속 협의서",
      "인감증명서",
    ],
  },
  "inheritance-period": {
    key: "inheritance-period",
    title: "상속등기 기간",
    serviceSlug: "inheritance-registration",
    focusKeywords: ["상속등기 기간", "상속 신고 기한"],
    costFactors: ["서류 준비 속도", "보정 여부", "저당권 정리"],
    timelineNotes: [
      "상속 개시 3개월 내 신고·등기가 원칙입니다.",
      "보통 서류 완비 후 수 주 내외 소요되는 경우가 많습니다.",
    ],
    documentList: ["상속 관련 기본 서류"],
  },
};

export type BusinessZoneTopic = {
  key: string;
  title: string;
  zoneName: string;
  serviceSlug: string;
  zoneContext: string;
  commonCases: string[];
  relatedServiceSlugs: string[];
};

export const businessZoneTopics: Record<string, BusinessZoneTopic> = {
  centumCorp: {
    key: "centumCorp",
    title: "센텀 법인등기",
    zoneName: "센텀",
    serviceSlug: "corporate-registration",
    zoneContext: "센텀시티·재송 일대 IT·금융·스타트업 법인 밀집",
    commonCases: ["본점 이전", "임원변경", "목적 변경"],
    relatedServiceSlugs: ["company-establishment", "director-change"],
  },
  centumEst: {
    key: "centumEst",
    title: "센텀 법인설립등기",
    zoneName: "센텀",
    serviceSlug: "company-establishment",
    zoneContext: "센텀 스타트업·1인 법인 설립 수요",
    commonCases: ["1인 주식회사", "2인 이상 창업"],
    relatedServiceSlugs: ["corporate-registration", "director-change"],
  },
  munhyeonFinance: {
    key: "munhyeonFinance",
    title: "문현금융단지 법인등기",
    zoneName: "문현금융단지",
    serviceSlug: "corporate-registration",
    zoneContext: "금융·법률·전문서비스 업체 집중",
    commonCases: ["사옥 매매 후 본점 이전", "임원 변경"],
    relatedServiceSlugs: ["director-change", "real-estate-registration"],
  },
  bifc: {
    key: "bifc",
    title: "부산국제금융센터 법인등기",
    zoneName: "부산국제금융센터",
    serviceSlug: "corporate-registration",
    zoneContext: "BIFC 입주 금융·법인 사무소",
    commonCases: ["본점 소재지 등기", "임원 변경"],
    relatedServiceSlugs: ["director-change"],
  },
  myeongji: {
    key: "myeongji",
    title: "명지국제신도시 법인등기",
    zoneName: "명지국제신도시",
    serviceSlug: "company-establishment",
    zoneContext: "신도시 입주 기업·상가 법인",
    commonCases: ["신규 설립", "지점 설치"],
    relatedServiceSlugs: ["corporate-registration"],
  },
  ecodelta: {
    key: "ecodelta",
    title: "에코델타시티 법인등기",
    zoneName: "에코델타시티",
    serviceSlug: "company-establishment",
    zoneContext: "스마트시티·친환경 단지 입주 기업",
    commonCases: ["설립 등기", "본점 이전"],
    relatedServiceSlugs: ["corporate-registration"],
  },
  jeonggwan: {
    key: "jeonggwan",
    title: "정관 법인등기",
    zoneName: "정관·정관신도시",
    serviceSlug: "corporate-registration",
    zoneContext: "기장군 정관 일대 산업·물류·제조 법인",
    commonCases: ["공장 법인 설립", "본점 이전"],
    relatedServiceSlugs: ["company-establishment"],
  },
  myeongrye: {
    key: "myeongrye",
    title: "명례산업단지 법인등기",
    zoneName: "명례일반산업단지",
    serviceSlug: "corporate-registration",
    zoneContext: "기장군 명례 일반산업단지 80여 개 기업",
    commonCases: ["임원변경", "본점 주소 변경", "증자 등기"],
    relatedServiceSlugs: ["director-change"],
  },
};

export type RealEstateDevTopic = {
  key: string;
  title: string;
  serviceSlug: string;
  topicContext: string;
  legalPoints: string[];
  relatedServiceSlugs: string[];
};

export const realEstateDevTopics: Record<string, RealEstateDevTopic> = {
  redevelopment: {
    key: "redevelopment",
    title: "부산 재개발등기",
    serviceSlug: "real-estate-registration",
    topicContext: "재개발 조합원 지위·분양권·신축 아파트 등기",
    legalPoints: [
      "조합 설립·사업시행 단계별 권리 관계가 다릅니다.",
      "종전 권리와 신축 분양 권리의 연결이 핵심입니다.",
    ],
    relatedServiceSlugs: ["ownership-transfer", "inheritance-registration"],
  },
  reconstruction: {
    key: "reconstruction",
    title: "부산 재건축등기",
    serviceSlug: "real-estate-registration",
    topicContext: "노후 아파트 재건축 후 소유권 이전",
    legalPoints: ["재건축 사업성·조합원 지위 확인", "신축 입주 후 등기 일정"],
    relatedServiceSlugs: ["ownership-transfer"],
  },
  newApt: {
    key: "newApt",
    title: "부산 신축아파트 소유권이전등기",
    serviceSlug: "ownership-transfer",
    topicContext: "분양·입주 후 최초 등기",
    legalPoints: ["분양계약·대출·중도금 일정과 등기 연동", "공동주택 대지권 확인"],
    relatedServiceSlugs: ["real-estate-registration"],
  },
  officetel: {
    key: "officetel",
    title: "부산 오피스텔 소유권이전등기",
    serviceSlug: "ownership-transfer",
    topicContext: "오피스텔·도시형생활주택 매매",
    legalPoints: ["용도·전입·세금 처리가 주택과 다를 수 있음", "등기부 권리 관계 확인"],
    relatedServiceSlugs: ["real-estate-registration"],
  },
  commercial: {
    key: "commercial",
    title: "부산 상가등기",
    serviceSlug: "real-estate-registration",
    topicContext: "상가·점포 매매·상속",
    legalPoints: ["임대차·권리금·시설물 포함 여부", "대지권·건물 지분"],
    relatedServiceSlugs: ["ownership-transfer"],
  },
  landInheritance: {
    key: "landInheritance",
    title: "부산 토지상속등기",
    serviceSlug: "inheritance-registration",
    topicContext: "토지·임야·농지 상속",
    legalPoints: ["분할·협의", "농지취득자격", "다수 상속인"],
    relatedServiceSlugs: ["qualified-acceptance"],
  },
  gijangLand: {
    key: "gijangLand",
    title: "기장 토지상속등기",
    serviceSlug: "inheritance-registration",
    topicContext: "기장군 토지·전원주택 상속",
    legalPoints: ["관할 등기소 거리", "농지·임야 특수 규정"],
    relatedServiceSlugs: ["inheritance-renunciation"],
  },
  haeundaeRedev: {
    key: "haeundaeRedev",
    title: "해운대 재개발 상속등기",
    serviceSlug: "inheritance-registration",
    topicContext: "해운대구 재개발·재건축 지역 상속",
    legalPoints: ["조합원 지위 승계", "신축 전후 권리 변동"],
    relatedServiceSlugs: ["real-estate-registration"],
  },
};
