import { defineSituationPage, solutions } from "../create-page";

const LOCAL =
  "부산 해운대구·센텀, 재송동·반여동 일대에서도 전화·카카오톡·방문(예약) 상담이 가능합니다.";

export const corporateBusinessPages = [
  defineSituationPage({
    slug: "임원-임기-만료",
    cardTitle: "법인 임원 임기 만료",
    cardDescription: "변경등기·과태료·결의",
    h1: "대표이사·이사 임기가 지났는데 등기를 안 하면?",
    metaDescriptionBase:
      "법인 임원 임기 만료 시 변경등기, 과태료, 주주총회 결의·서류를 정리했습니다. 부산·센텀 법인등기 상담.",
    intro: `임원 임기 만료 후 등기를 하지 않으면 등기부와 실제가 어긋나고, 과태료·은행·거래처 실사에서 문제가 됩니다. 정관·결의 요건을 먼저 확인하세요. ${LOCAL}`,
    situationCategory: "corporate-business",
    searchIntent: "임원 임기 만료 등기",
    conclusion:
      "임기 만료는 '그냥 지난 것'이 아니라 등기 사유입니다. 경과 기간·과태료·결의 하자를 함께 점검하세요.",
    situationChecklist: [
      "대표이사·이사 임기가 만료됐다",
      "등기부에는 옛 임원 그대로다",
      "은행·입찰·계약에서 등기부를 요구한다",
      "과태료 통지를 받았다",
      "누가 다음 대표인지 정하지 못했다",
    ],
    firstChecks: [
      "등기부등본·정관상 임원·임기·선임 방식",
      "주주총회·이사회 결의 요건",
      "임기 경과 기간·과태료 규정",
      "취임·사임·연임·재선임 절차",
      "법인 인감·통장·사업자등록과의 일치",
    ],
    solutions: solutions([
      {
        title: "연임·재선임 등기",
        body: "주주총회 결의로 동일 임원 연임 또는 새 임원 선임 후 변경등기를 합니다.",
        whenToChoose: "주주 간 의견이 맞고 결의·서류가 가능한 경우",
      },
      {
        title: "사임·신규 선임",
        body: "임기 만료와 함께 사임·교체가 필요하면 취임·사임 서류를 일괄 준비합니다.",
        whenToChoose: "대표·임원 교체가 확정된 경우",
      },
      {
        title: "과태료·보정 대응",
        body: "장기 미등기로 과태료·보정이 필요하면 등기와 함께 행정 대응을 검토합니다.",
        whenToChoose: "임기 경과가 길거나 등기소 보정·과태료가 발생한 경우",
      },
    ]),
    selfHandleCases: [
      "정관대로 결의 완료·서류·인감 준비된 단순 변경",
      "연임 1건 등 단순 등기",
    ],
    lawyerNeededCases: [
      "주주 간 대표·임원 갈등",
      "임기·결의 하자·과태료 장기 누적",
      "임원 변경과 본점·정관 변경 동시 필요",
      "은행·투자·입찰 일정이 촉박",
    ],
    costFactors: [
      "변경등기 건수·임원 수",
      "과태료·보정",
      "정관·본점 동시 변경",
      "주주·결의 분쟁 대응",
    ],
    commonMistakes: [
      "임기만 지나고 등기를 안 하는 경우",
      "결의 없이 등기 신청",
      "등기 후 통장·인감·사업자 갱신 누락",
      "사임·취임 서류 누락",
    ],
    caseExample: {
      title: "임기 1년 경과 후 임원변경",
      body: "대표이사 임기 만료 1년 후 등기를 안 해 은행 대출이 막혔습니다. 주주총회 재결의·과태료 확인 후 변경등기를 완료한 사례입니다.",
    },
    documents: [
      "법인 등기부등본·정관",
      "주주총회·이사회 의사록",
      "취임·사임 승낙서",
      "임원 인감증명서",
      "법인 인감카드·인감증명서",
    ],
    procedures: [
      "등기부·정관·임기 확인",
      "주주총회·이사회 결의",
      "취임·사임 서류 작성",
      "관할 등기소 접수",
      "등기 완료 후 통장·사업자·계약 갱신",
    ],
    diagnosisLinks: [
      { href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" },
      { href: "/법인등기자가진단", label: "법인등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    serviceLinks: [
      { href: "/services/director-change", label: "임원변경등기 안내" },
      { href: "/services/corporate-registration", label: "법인등기 안내" },
      { href: "/법인등기", label: "법인등기 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/director-change-deadline-faq", label: "임원변경 기한·과태료" },
      { href: "/faq/corporate-address-change-faq", label: "법인 주소 변경" },
      { href: "/faq/capital-increase-registration-faq", label: "증자 등기 FAQ" },
      { href: "/faq/company-establishment-documents-faq", label: "법인설립 서류" },
    ],
    extraLinks: [
      { href: "/blog/director-change-registration-deadline-penalty", label: "임원변경 과태료" },
      { href: "/services/cases/yeonje-director-change-case", label: "임원변경 사례" },
      { href: "/센텀법인등기", label: "센텀 법인등기" },
      { href: "/부산법인등기", label: "부산 법인등기" },
    ],
    faqs: [
      {
        question: "임기 만료 후 얼마나 지나면 과태료가 붙나요?",
        answer:
          "일정 기간 내 변경등기를 하지 않으면 과태료가 부과될 수 있습니다. 경과 기간·임원 종류에 따라 달라지므로 빠른 확인이 필요합니다.",
      },
      {
        question: "등기 안 해도 회사 운영은 되나요?",
        answer:
          "실무상 계속될 수 있지만, 등기부와 불일치하면 금융·계약·입찰에서 거절·지연이 생길 수 있습니다.",
      },
    ],
    relatedSituationSlugs: [
      "corporate-officer-address-change",
      "본점-이전-등기",
      "대표자-사망-법인",
      "법인-설립-처음",
    ],
    priority: 91,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "director-change",
  }),

  defineSituationPage({
    slug: "법인-설립-처음",
    cardTitle: "법인 설립 처음",
    cardDescription: "정관·자본금·등기 순서",
    h1: "법인을 처음 설립하려면 어떤 순서로 진행하나요?",
    metaDescriptionBase:
      "법인 설립 절차, 정관·발기·설립등기·사업자등록 순서와 필요 서류를 정리했습니다. 부산 법인설립 상담.",
    intro: `법인 설립은 정관 작성·발기·납입·설립등기·사업자등록 순으로 진행합니다. 업종·자본금·임원·본점 주소를 미리 정하면 일정이 수월합니다. ${LOCAL}`,
    situationCategory: "corporate-business",
    searchIntent: "법인 설립 처음",
    conclusion:
      "법인 설립은 등기 전 준비(정관·납입·임원)가 핵심입니다. 설립 후 통장·4대보험·세무 등록까지 일정을 잡으세요.",
    situationChecklist: [
      "개인사업자에서 법인으로 전환하려 한다",
      "친구·동업으로 법인을 만들려 한다",
      "정관·자본금·임원을 어떻게 정할지 모르겠다",
      "설립등기와 사업자등록 순서가 헷갈린다",
      "본점·상호·목적을 아직 못 정했다",
    ],
    firstChecks: [
      "회사 형태(주식·유한 등)·상호·본점·목적·자본금",
      "발기인·주주·임원 구성",
      "정관 필수·임의 조항",
      "출자금 납입·잔고증명",
      "설립등기 후 사업자·통장·4대보험",
    ],
    solutions: solutions([
      {
        title: "표준 정관·전자 설립",
        body: "모범 정관·전자 설립 시스템으로 빠르게 설립등기를 진행합니다.",
        whenToChoose: "소규모·단순 구조의 주식회사 설립",
      },
      {
        title: "맞춤 정관·동업 구조",
        body: "지분·의결권·임원·경업금지 등을 정관에 반영해 설립합니다.",
        whenToChoose: "복수 주주·특수 지분·동업 조건이 있는 경우",
      },
      {
        title: "개인사업자 법인 전환",
        body: "기존 사업·자산·계약·세무를 고려해 법인 전환·양도 방식을 설계합니다.",
        whenToChoose: "운영 중인 개인사업을 법인으로 옮기는 경우",
      },
    ]),
    selfHandleCases: [
      "전자 설립·모범 정관으로 단순 주식회사 설립",
      "자본금·임원·주소가 확정된 경우",
    ],
    lawyerNeededCases: [
      "복수 주주·지분·의결권 특약",
      "개인사업자 자산·부동산·계약 양도",
      "외국인·법인 주주 포함",
      "업종·인허가·세무 구조 동시 검토",
    ],
    costFactors: [
      "설립등기·공증·인지·등록세",
      "정관 맞춤·자문 범위",
      "자본금 규모·임원·주주 수",
      "사업자 전환·양도 포함 여부",
    ],
    commonMistakes: [
      "정관·지분·임원 미정인 채 서류부터",
      "납입·잔고증명 없이 등기 신청",
      "설립 후 통장·4대보험·세무 등록 누락",
      "동업 조건을 구두로만 합의",
    ],
    caseExample: {
      title: "2인 창업 주식회사 설립",
      body: "센텀 소재 IT 창업 2인이 법인 설립을 의뢰했습니다. 지분·대표·경업범위를 정관에 반영하고, 설립등기·사업자·법인통장까지 일정을 맞춘 사례입니다.",
    },
    documents: [
      "정관",
      "발기인·주주·임원 인감·신분증",
      "출자금 납입·잔고증명",
      "본점·임대차(해당 시)",
      "설립등기 신청서·첨부",
    ],
    procedures: [
      "상호·목적·자본금·임원 확정",
      "정관 작성·공증(해당 시)",
      "출자금 납입",
      "설립등기 접수",
      "법인등기부등본·인감·통장",
      "사업자등록·4대보험·세무 신고",
    ],
    diagnosisLinks: [
      { href: "/법인설립자가진단", label: "법인설립 자가진단" },
      { href: "/법인등기자가진단", label: "법인등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    serviceLinks: [
      { href: "/services/company-establishment", label: "법인설립 안내" },
      { href: "/services/corporate-registration", label: "법인등기 안내" },
      { href: "/법인등기", label: "법인등기 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/company-establishment-documents-faq", label: "법인설립 서류" },
      { href: "/faq/director-change-deadline-faq", label: "임원변경 FAQ" },
      { href: "/faq/corporate-address-change-faq", label: "본점이전 FAQ" },
      { href: "/faq/capital-increase-registration-faq", label: "증자 FAQ" },
    ],
    extraLinks: [
      { href: "/services/cases/suyeong-company-establishment-case", label: "법인설립 사례" },
      { href: "/센텀법인등기", label: "센텀 법인등기" },
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "최소 자본금은 얼마인가요?",
        answer:
          "주식회사는 원칙적으로 자본금 요건이 없습니다(2024년 개정 이후). 다만 사업·금융·입찰 조건에 따라 실무상 필요 금액이 달라질 수 있습니다.",
      },
      {
        question: "설립까지 얼마나 걸리나요?",
        answer:
          "정관·납입·서류 준비가 되면 등기는 보통 수일~2주 내외입니다. 사업자·통장은 등기 후 추가 일정이 필요합니다.",
      },
    ],
    relatedSituationSlugs: [
      "corporate-officer-address-change",
      "임원-임기-만료",
      "본점-이전-등기",
      "대표자-사망-법인",
    ],
    priority: 83,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "company-establishment",
  }),

  defineSituationPage({
    slug: "대표자-사망-법인",
    cardTitle: "대표자 사망 후 법인",
    cardDescription: "승계·임원변경·등기",
    h1: "법인 대표이사(대표자)가 사망하면 회사는 어떻게 하나요?",
    metaDescriptionBase:
      "대표이사 사망 시 임원변경등기, 유증·상속·주식 승계, 법인 운영 연속성을 정리했습니다. 부산 법인등기 상담.",
    intro: `대표이사 사망은 법인 운영과 등기 모두에 영향을 줍니다. 임원 변경·주식 승계·인감·통장·계약 승계를 빠르게 정리해야 합니다. ${LOCAL}`,
    situationCategory: "corporate-business",
    searchIntent: "대표자 사망 법인",
    conclusion:
      "대표 사망 후에는 임원변경등기와 주식·유증·상속 이슈를 분리해 보되, 동시에 일정을 맞추는 것이 좋습니다.",
    situationChecklist: [
      "대표이사(대표)가 사망했다",
      "법인 통장·인감·계약이 막혔다",
      "주식·지분 상속이 필요하다",
      "새 대표를 누구로 할지 정하지 못했다",
      "등기부에는 사망한 대표 그대로다",
    ],
    firstChecks: [
      "등기부·정관상 임원·주주·지분",
      "사망 대표의 주식·상속인",
      "주주총회·이사회 결의·새 대표 선임",
      "법인 인감·통장·주요 계약",
      "상속·유증·주식 변동 등기 필요성",
    ],
    solutions: solutions([
      {
        title: "임원변경·대표 교체",
        body: "주주총회 결의로 새 대표이사를 선임하고 임원변경등기를 합니다.",
        whenToChoose: "새 대표·임원 구성이 합의된 경우",
      },
      {
        title: "주식 상속·명의개서",
        body: "사망 대표의 주식을 상속·협의분할하고 주주명부·등기를 정리합니다.",
        whenToChoose: "지분 상속·형제·가족 공동 주주",
      },
      {
        title: "법인·상속 병행 상담",
        body: "상속등기·한정승인과 법인 임원·지분 변경을 함께 설계합니다.",
        whenToChoose: "대표 개인 재산·채무·법인 지분이 복합",
      },
    ]),
    selfHandleCases: [
      "단독 주주·대표였고 승계인이 명확한 경우",
      "결의·서류·인감이 준비된 단순 임원변경",
    ],
    lawyerNeededCases: [
      "복수 주주·상속인·의견 충돌",
      "대표 개인 채무·담보·법인 교차",
      "유증·분쟁·지분 다툼",
      "통장·계약·입찰 일정 긴급",
    ],
    costFactors: [
      "임원변경·주식변동 등기",
      "상속·유증·협의분할",
      "주주·상속인 수·분쟁",
      "긴급 대응·다수 등기",
    ],
    commonMistakes: [
      "임원변경 없이 통장·계약만 진행",
      "주식 상속·등기 누락",
      "상속 3개월·한정승인 기한 놓침",
      "구두로만 대표 교체",
    ],
    caseExample: {
      title: "창업자 사망 후 대표·지분 정리",
      body: "1인 대표·주주였던 창업자 사망 후 배우자가 상속·법인 운영을 문의했습니다. 상속·한정승인 검토와 새 대표 선임·임원변경등기를 병행한 사례입니다.",
    },
    documents: [
      "법인 등기부등본·정관·주주명부",
      "피상속인·상속인 가족관계증명서",
      "주주총회·이사회 의사록",
      "취임·사임 승낙·인감",
      "주식 상속·협의분할 서류",
    ],
    procedures: [
      "사망·상속인·주주 현황 확인",
      "상속·한정승인·포기 검토(개인)",
      "새 대표·임원 결의",
      "임원변경·주식변동 등기",
      "통장·인감·계약·사업자 갱신",
    ],
    diagnosisLinks: [
      { href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" },
      { href: "/상속등기자가진단", label: "상속등기 자가진단" },
      { href: "/법인등기자가진단", label: "법인등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
    ],
    serviceLinks: [
      { href: "/services/director-change", label: "임원변경등기 안내" },
      { href: "/services/inheritance-registration", label: "상속등기 안내" },
      { href: "/services/corporate-registration", label: "법인등기 안내" },
      { href: "/상속", label: "상속 허브" },
    ],
    faqLinks: [
      { href: "/faq/director-change-deadline-faq", label: "임원변경 기한" },
      { href: "/faq/multiple-heirs-inheritance-registration", label: "공동상속인" },
      { href: "/faq/what-is-qualified-acceptance", label: "한정승인" },
      { href: "/faq/company-establishment-documents-faq", label: "법인 서류" },
    ],
    extraLinks: [
      { href: "/services/cases/yeonje-director-change-case", label: "임원변경 사례" },
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/부산상속등기", label: "부산 상속등기" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "대표가 죽으면 회사는 자동으로 멈추나요?",
        answer:
          "법인은 대표 사망만으로 해산하지 않습니다. 다만 등기·통장·계약을 위해 새 임원 선임·변경등기가 필요합니다.",
      },
      {
        question: "주식도 상속등기를 해야 하나요?",
        answer:
          "주식·지분은 상속재산입니다. 주주명부·등기(해당 시)·협의분할 등 후속 정리가 필요할 수 있습니다.",
      },
    ],
    relatedSituationSlugs: [
      "parent-passed-away",
      "corporate-officer-address-change",
      "임원-임기-만료",
      "inheritance-unknown-debt",
    ],
    priority: 90,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "director-change",
  }),

  defineSituationPage({
    slug: "본점-이전-등기",
    cardTitle: "법인 본점 이전 등기",
    cardDescription: "관할·과태료·사업자",
    h1: "법인 본점(사무실)을 옮기면 등기를 꼭 해야 하나요?",
    metaDescriptionBase:
      "법인 본점 이전등기, 관할 등기소 변경, 과태료·사업자등록·계약 갱신을 정리했습니다. 부산 법인등기 상담.",
    intro: `본점 이전은 등기 사유입니다. 주소만 바꾸고 등기를 안 하면 등기부·사업자·계약·은행 주소가 어긋납니다. 관할 등기소 변경도 함께 확인하세요. ${LOCAL}`,
    situationCategory: "corporate-business",
    searchIntent: "법인 본점 이전 등기",
    conclusion:
      "본점 이전은 이전등기 + 사업자·통장·계약 주소 갱신까지 한 세트로 봐야 합니다.",
    situationChecklist: [
      "사무실·본점을 다른 구·시로 옮겼다",
      "등기부에는 옛 주소 그대로다",
      "사업자등록증 주소도 안 바꿨다",
      "과태료가 걱정된다",
      "임대차·등기필증 주소가 새 주소다",
    ],
    firstChecks: [
      "등기부·정관상 본점·분사무소",
      "새·구 주소·관할 등기소",
      "주주총회·이사회 결의 요건",
      "이전등기 기한·과태료",
      "사업자·통장·4대보험·계약 갱신",
    ],
    solutions: solutions([
      {
        title: "본점이전등기",
        body: "결의 후 본점 이전등기를 하고 등기부등본을 갱신합니다.",
        whenToChoose: "새 임대차·주소 확정·결의 가능",
      },
      {
        title: "분사무소 설치·정리",
        body: "본점은 유지하고 분사무소만 두거나, 분사무소를 폐지·통합합니다.",
        whenToChoose: "지사·지점 구조 조정",
      },
      {
        title: "과태료·일괄 정리",
        body: "장기 미등기·임원·주소 문제를 함께 정리합니다.",
        whenToChoose: "이전·임원·정관 등 복수 등기 필요",
      },
    ]),
    selfHandleCases: [
      "단순 본점 이전·결의·서류·인감 준비 완료",
      "관할 변경 없는 동일 등기소 내 이전",
    ],
    lawyerNeededCases: [
      "관할 등기소 변경·광역 이전",
      "장기 미등기·과태료",
      "본점 이전 + 임원·정관·증자 동시",
      "입찰·대출·실사 일정",
    ],
    costFactors: [
      "본점이전·분사무소 등기",
      "과태료·보정",
      "관할 변경·다수 등기",
      "긴급 일정",
    ],
    commonMistakes: [
      "사업자만 바꾸고 등기 안 함",
      "결의 없이 등기",
      "등기 후 통장·계약·4대보험 미갱신",
      "임대차 주소와 등기 주소 불일치",
    ],
    caseExample: {
      title: "해운대→센텀 본점 이전",
      body: "센텀으로 사무실을 옮긴 뒤 등기를 미루다 실사에서 걸린 법인이 상담했습니다. 본점이전등기와 사업자·통장 주소 갱신을 일괄 진행한 사례입니다.",
    },
    documents: [
      "법인 등기부등본·정관",
      "주주총회·이사회 의사록",
      "새 본점 임대차·등기필증",
      "법인 인감증명서",
      "이전등기 신청서",
    ],
    procedures: [
      "새 본점·관할 확인",
      "주주총회·이사회 결의",
      "이전등기 접수(신·구 관할)",
      "등기부등본·인감 갱신",
      "사업자·통장·계약·4대보험 주소 변경",
    ],
    diagnosisLinks: [
      { href: "/법인등기자가진단", label: "법인등기 자가진단" },
      { href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    serviceLinks: [
      { href: "/services/corporate-registration", label: "법인등기 안내" },
      { href: "/services/director-change", label: "임원변경등기 안내" },
      { href: "/법인등기", label: "법인등기 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/corporate-address-change-faq", label: "본점이전 FAQ" },
      { href: "/faq/director-change-deadline-faq", label: "임원변경 FAQ" },
      { href: "/faq/company-establishment-documents-faq", label: "법인설립 서류" },
      { href: "/faq/capital-increase-registration-faq", label: "증자 FAQ" },
    ],
    extraLinks: [
      { href: "/blog/director-change-registration-deadline-penalty", label: "법인등기 기한" },
      { href: "/센텀법인등기", label: "센텀 법인등기" },
      { href: "/부산법인등기", label: "부산 법인등기" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "사업자등록만 바꾸면 안 되나요?",
        answer:
          "등기부상 본점과 사업자 주소가 다르면 실사·금융·계약에서 문제가 될 수 있습니다. 등기와 행정 갱신을 함께 하는 것이 좋습니다.",
      },
      {
        question: "관할 등기소도 바뀌나요?",
        answer:
          "본점 소재지에 따라 관할 등기소가 바뀔 수 있습니다. 신·구 등기소 접수 순서를 확인해야 합니다.",
      },
    ],
    relatedSituationSlugs: [
      "corporate-officer-address-change",
      "임원-임기-만료",
      "법인-설립-처음",
      "대표자-사망-법인",
    ],
    priority: 85,
    isNew: true,
    addedAt: "2026-07-21",
    serviceSlug: "corporate-registration",
  }),

  defineSituationPage({
    slug: "임원변경-기한-임박",
    cardTitle: "임원변경 기한 임박",
    cardDescription: "과태료 전 등기 체크",
    h1: "법인 임원변경 등기 기한이 임박했는데 어떻게 하나요?",
    metaDescriptionBase:
      "임원변경·취임 등기 기한 임박 시 할 일. 의사록·취임승낙·과태료 예방 순서를 정리합니다. 부산·센텀 법인등기 상담.",
    intro:
      "임원 취임·변경·중임은 결의·취임일 기준으로 등기 기한이 있습니다. 기한을 넘기면 과태료 위험이 있어, 서류가 덜 갖춰져도 ‘기한·누락 항목’부터 확인하는 것이 우선입니다. 부산 센텀·해운대에서 전화·카카오톡·방문(예약) 상담이 가능합니다.",
    situationCategory: "corporate-business",
    searchIntent: "임원변경 등기 기한 임박",
    conclusion:
      "기한 임박 시에는 취임일·결의일·필요 서류를 당일 점검하고, 접수 가능한 범위부터 진행하세요.",
    situationChecklist: [
      "임원변경 등기 기한이 며칠 안 남았다",
      "의사록·취임승낙서가 아직 없다",
      "과태료가 나올까 봐 불안하다",
      "대표이사·이사·감사 중 누가 바뀌는지 정리가 안 됐다",
      "센텀·해운대 법인 등기를 급히 맡기고 싶다",
    ],
    firstChecks: [
      "취임·변경·퇴임·중임 일자와 등기 기한 계산",
      "등기사항전부증명서·정관으로 임원 현황 확인",
      "주주총회·이사회 의사록 필요 여부",
      "취임승낙서·인감·주민등록번호 기재 요건",
      "접수 관할 등기소·인터넷등기 가능 여부",
    ],
    solutions: solutions([
      {
        title: "기한 내 최소 접수",
        body: "필수 서류부터 맞춰 기한 내 접수하고, 보정은 안내에 따라 보완합니다.",
        whenToChoose: "기한이 매우 촉박한 경우",
      },
      {
        title: "결의·취임 서류 동시 정리",
        body: "의사록·취임승낙·인감을 한 번에 점검해 반려 사유를 줄입니다.",
        whenToChoose: "서류가 거의 준비된 경우",
      },
      {
        title: "과태료·지연 대응 상담",
        body: "이미 기한을 넘긴 경우 현황을 보고 가능한 조치를 안내합니다.",
        whenToChoose: "기한을 이미 경과한 경우",
      },
    ]),
    selfHandleCases: [
      "1인 주주·단순 중임으로 서류가 단순한 경우",
      "인터넷등기 경험이 있고 서식이 준비된 경우",
    ],
    lawyerNeededCases: [
      "기한이 임박하거나 이미 지난 경우",
      "다수 임원·정관과 실제 구성이 다른 경우",
      "취임·퇴임·중임이 한꺼번에 있는 경우",
      "보정·과태료 통지를 받은 경우",
    ],
    costFactors: [
      "변경 임원 수·항목",
      "급행·보정 대응 여부",
      "정관·의사록 작성 범위",
      "등록면허세·수수료",
    ],
    commonMistakes: [
      "취임일과 등기 신청일을 혼동하는 경우",
      "정관상 임원 수와 다르게 선임하는 경우",
      "취임승낙·인감 없이 접수하려는 경우",
    ],
    caseExample: {
      title: "센텀 법인 임원변경 기한 대응",
      body: "대표이사 변경 후 등기 기한이 임박해 상담한 사건에서, 의사록·취임승낙서를 점검해 기한 내 접수한 사례입니다.",
    },
    documents: [
      "등기사항전부증명서",
      "정관",
      "주주총회·이사회 의사록",
      "취임승낙서·인감증명",
      "취임·변경 일자 메모",
    ],
    procedures: [
      "기한·변경 내용 확인",
      "결의·취임 서류 점검",
      "신청서 작성",
      "등기소·인터넷 접수",
      "보정 대응(해당 시)",
      "등기 완료·증명서 확인",
    ],
    diagnosisLinks: [
      { href: "/임원변경등기자가진단", label: "임원변경등기 자가진단" },
      { href: "/법인등기자가진단", label: "법인등기 자가진단" },
      { href: "/자가진단", label: "자가진단 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    serviceLinks: [
      { href: "/services/director-change", label: "임원변경등기 안내" },
      { href: "/services/corporate-registration", label: "법인등기 안내" },
      { href: "/법인등기", label: "법인등기 허브" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqLinks: [
      { href: "/faq/director-change-deadline-faq", label: "임원변경 기한 FAQ" },
      { href: "/faq/company-establishment-documents-faq", label: "법인설립 서류" },
      { href: "/faq/corporate-address-change-faq", label: "본점이전 FAQ" },
      { href: "/faq/how-to-book-consultation-faq", label: "상담 예약" },
    ],
    extraLinks: [
      { href: "/부산법무사", label: "부산 법무사 종합 안내" },
      { href: "/부산법무사비대면상담", label: "비대면상담 안내" },
      { href: "/blog/director-change-registration-deadline-penalty", label: "임원변경 과태료" },
      { href: "/contact", label: "상담 문의" },
    ],
    faqs: [
      {
        question: "기한이 지나면 무조건 과태료인가요?",
        answer:
          "지연 등기 시 과태료 부과 대상이 될 수 있습니다. 경과 기간·사유에 따라 달라지므로 현황을 알려 주시면 안내합니다.",
      },
      {
        question: "서류가 없어도 상담할 수 있나요?",
        answer:
          "네. 취임일과 변경 내용만 알려 주셔도 기한과 필요 서류 방향을 바로 짚을 수 있습니다.",
      },
    ],
    relatedSituationSlugs: [
      "임원-임기-만료",
      "corporate-officer-address-change",
      "본점-이전-등기",
      "법인-설립-처음",
    ],
    priority: 92,
    isNew: true,
    addedAt: "2026-07-25",
    serviceSlug: "corporate-registration",
  }),
];
