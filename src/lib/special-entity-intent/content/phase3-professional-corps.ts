import type { SpecialEntityPageContent } from "../types";
import {
  SPECIAL_ENTITY_OFFICE_LINE,
  SPECIAL_ENTITY_SCOPE_NOTICE,
  baseSpecialRelated,
} from "./shared";
import { PROFESSIONAL_REGISTRY_ONLY_NOTICE } from "./phase3-professional-boundary";

const profRelated = [
  { href: "/전문직법인등기", label: "전문직 법인 허브" },
  { href: "/기타전문직법인설립등기", label: "기타 전문직 등기 안내" },
  ...baseSpecialRelated,
];

const registryOnlyScope = `${SPECIAL_ENTITY_SCOPE_NOTICE}\n\n${PROFESSIONAL_REGISTRY_ONLY_NOTICE}`;

/**
 * 개별 전문직 법인 설립등기 페이지.
 * 각 페이지는 등기·서류·접수만 다루며, 해당 전문직 고유 업무는 명시적으로 제외한다.
 */
export const phase3ProfessionalCorpPages: SpecialEntityPageContent[] = [
  {
    slug: "회계법인설립등기",
    kind: "intent",
    title: "회계법인 설립등기",
    metaTitle: "회계법인 설립등기｜인가·등록 후 등기만 안내",
    metaDescription:
      "회계법인(공인회계사법인) 설립등기. 인가·등록은 공인회계사·금융감독원 절차, 법무사는 등기·서류·접수만 — 다옴법무사.",
    h1: "회계법인 설립등기 — 인가·등록 다음이 등기입니다",
    eyebrow: "회계법인 · 설립등기",
    heroIntro:
      "회계법인은 공인회계사법에 따른 공인회계사법인으로, 설립 인가·등록과 법인설립등기가 분리됩니다.",
    heroParagraphs: [
      "구성원 자격·출자·사무소 요건은 공인회계사법·관련 규정과 금융감독원·한국공인회계사회 안내를 따릅니다. 다옴법무사사무소는 인가·등록이 끝난 뒤 설립등기 서류 작성·검토·접수를 지원합니다.",
      "회계감사·기장·세무신고·경영 자문은 공인회계사·회계법인 고유 영역이며, 법무사가 대행하거나 보장한다고 안내하지 않습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: registryOnlyScope,
    conclusion:
      "회계법인 설립등기는 공인회계사법상 설립 인가·등록 후 관할 등기소에 접수합니다. 법무사는 등기 단계만 지원합니다.",
    primaryKeyword: "회계법인 설립등기",
    secondaryKeywords: [
      "공인회계사법인 설립",
      "회계법인 등기",
      "회계법인 구성원 변경등기",
    ],
    questionKeywords: ["회계법인 설립 절차", "회계법인 등기 서류"],
    searchIntent: "회계법인 설립등기 서류·절차를 확인하려는 검색",
    whoNeedsThis: [
      "회계법인 설립 인가·등록을 마치고 등기만 남은 경우",
      "구성원·주사무소 변경등기가 필요한 회계법인",
    ],
    whenAndDeadline: ["설립 인가·등록 후 법정 기한 내 설립등기"],
    decisionBodies: ["구성원 총회", "인가·등록 기관"],
    documents: [
      "설립 인가·등록 서류",
      "정관",
      "구성원 명부·출자 증빙",
      "임원·대표 서류",
    ],
    procedures: [
      "공인회계사법상 설립 인가·등록(회계사·해당 기관)",
      "설립등기 서류 준비(법무사 지원 가능)",
      "관할 등기소 접수",
    ],
    costFactors: ["구성원 수", "사무소", "관할"],
    penaltyRisks: ["인가 후 등기 지연"],
    commonConfusions: [
      "법무사에게 회계감사·세무까지 의뢰",
      "등록=설립 완료로 오인",
    ],
    diyErrors: ["인가 전 등기", "구성원 자격 서류 누락"],
    faqs: [
      {
        question: "회계 업무도 법무사가 하나요?",
        answer:
          "하지 않습니다. 회계·감사·세무는 공인회계사·세무사 영역입니다. 법무사는 법인 등기신청과 관련 서류만 지원합니다.",
      },
    ],
    relatedLinks: [
      { href: "/세무법인설립등기", label: "세무법인 설립등기(등기만)" },
      ...profRelated,
    ],
    ctaTitle: "회계법인 설립등기(등기만) 상담",
    ctaText:
      "설립 인가·등록이 끝났다면 등기사항과 첨부서류만 알려주세요. 회계·감사 업무는 해당 분야에 문의하세요.",
    legalProfile: {
      entityName: "회계법인(공인회계사법인)",
      legalBasis: ["공인회계사법", "공인회계사법 시행령·규칙"],
      establishmentMethod: "설립 인가·등록 후 설립등기",
      competentAuthority: [
        "인가·등록: 금융감독원·한국공인회계사회 등",
        "등기: 주사무소 관할 등기소",
      ],
      preRegistrationSteps: ["구성원·정관", "설립 인가·등록"],
      registrationDeadline: "인가·등록 후 법정 기한",
      registrableMatters: ["명칭·주사무소·구성원·대표"],
      lawyerScope: ["인가·등록 후 설립·변경·해산 등기"],
      excludedScope: [
        "회계감사",
        "기장·세무신고",
        "설립 인가·등록 대리",
        "경영 자문",
      ],
      lastLegalReview: "2026-07-29",
    },
  },
  {
    slug: "특허법인설립등기",
    kind: "intent",
    title: "특허법인 설립등기",
    metaTitle: "특허법인 설립등기｜변리사법인 인가 후 등기만",
    metaDescription:
      "특허법인(변리사법인) 설립등기. 인가·등록은 변리사 절차, 법무사는 등기·서류만 — 다옴법무사.",
    h1: "특허법인 설립등기 — 변리사 인가와 등기를 구분하세요",
    eyebrow: "특허법인 · 설립등기",
    heroIntro:
      "특허법인은 변리사법에 따른 변리사법인으로, 법인 설립 인가·등록 후 설립등기를 합니다.",
    heroParagraphs: [
      "구성원 변리사 자격·출자·사무소 요건은 변리사법·대한변리사회 안내를 따릅니다. 법무사는 인가·등록 이후 등기 서류·접수를 지원합니다.",
      "특허·상표·디자인 출원·심판·소송 대리는 변리사 고유 영역이며 법무사가 수행하지 않습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: registryOnlyScope,
    conclusion:
      "특허법인 설립등기는 변리사법상 설립 인가·등록 후 등기소에 접수합니다. 법무사는 등기만 지원합니다.",
    primaryKeyword: "특허법인 설립등기",
    secondaryKeywords: [
      "변리사법인 설립",
      "특허법인 등기",
      "특허법인 구성원 변경",
    ],
    questionKeywords: ["특허법인 설립 절차", "변리사법인 등기"],
    searchIntent: "특허법인 설립등기 절차를 확인하려는 검색",
    whoNeedsThis: [
      "변리사 사무소의 법인화 후 등기",
      "특허법인 구성원·주소 변경등기",
    ],
    whenAndDeadline: ["설립 인가·등록 후 법정 기한 내 등기"],
    decisionBodies: ["구성원 총회", "대한변리사회·관할 기관"],
    documents: ["인가·등록 서류", "정관", "구성원 서류", "출자 증빙"],
    procedures: ["변리사법상 인가·등록", "설립등기", "변경등기(운영 중)"],
    costFactors: ["구성원 수", "사무소"],
    penaltyRisks: ["등기 지연"],
    commonConfusions: ["특허 출원 대행을 법무사에게 의뢰"],
    diyErrors: ["인가 전 등기"],
    faqs: [
      {
        question: "특허 출원도 법무사가 하나요?",
        answer:
          "하지 않습니다. 특허·상표 등은 변리사 영역입니다. 법무사는 법인 등기만 지원합니다.",
      },
    ],
    relatedLinks: profRelated,
    ctaTitle: "특허법인 설립등기(등기만) 상담",
    ctaText:
      "설립 인가가 끝났다면 등기 서류부터 확인할 수 있습니다. 특허 업무는 변리사에게 문의하세요.",
    legalProfile: {
      entityName: "특허법인(변리사법인)",
      legalBasis: ["변리사법"],
      establishmentMethod: "설립 인가·등록 후 설립등기",
      competentAuthority: ["대한변리사회·관할 기관", "등기소"],
      preRegistrationSteps: ["구성원·정관", "설립 인가"],
      registrationDeadline: "인가 후 법정 기한",
      registrableMatters: ["명칭·주사무소·구성원"],
      lawyerScope: ["설립·변경 등기"],
      excludedScope: ["특허·상표 출원·대리", "설립 인가 대리"],
      lastLegalReview: "2026-07-29",
    },
  },
  {
    slug: "관세법인설립등기",
    kind: "intent",
    title: "관세법인 설립등기",
    metaTitle: "관세법인 설립등기｜관세사법인 등록 후 등기만",
    metaDescription:
      "관세법인(관세사법인) 설립등기. 등록·인가는 관세사 절차, 법무사는 등기만 — 다옴법무사.",
    h1: "관세법인 설립등기 — 통관 업무와 등기는 다릅니다",
    eyebrow: "관세법인 · 설립등기",
    heroIntro:
      "관세법인은 관세사법에 따른 관세사법인으로, 설립 등록·인가 후 설립등기를 합니다.",
    heroParagraphs: [
      "부산은 항만·수출입 관련으로 관세사 법인화 문의가 있을 수 있습니다. 등록·자격은 관세청·한국관세사회 절차를 따르고, 법무사는 등기 단계만 지원합니다.",
      "통관·관세 신고·관세 자문은 관세사 고유 영역입니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: registryOnlyScope,
    conclusion:
      "관세법인 설립등기는 관세사법상 등록·인가 후 관할 등기소에 접수합니다.",
    primaryKeyword: "관세법인 설립등기",
    secondaryKeywords: [
      "관세사법인 설립",
      "부산 관세법인",
      "관세법인 등기",
    ],
    questionKeywords: ["관세법인 설립", "관세사법인 등기"],
    searchIntent: "관세법인 설립등기를 확인하려는 검색",
    whoNeedsThis: [
      "관세사 사무소 법인화 후 등기",
      "부산·항만 인근 관세법인 설립등기",
    ],
    whenAndDeadline: ["등록·인가 후 법정 기한 내 등기"],
    decisionBodies: ["구성원 총회", "관세청·한국관세사회"],
    documents: ["등록·인가 서류", "정관", "구성원 서류"],
    procedures: ["관세사법상 등록", "설립등기"],
    costFactors: ["구성원·사무소"],
    penaltyRisks: ["등기 지연"],
    commonConfusions: ["통관 대리를 법무사에게 의뢰"],
    diyErrors: ["등록 전 등기"],
    faqs: [
      {
        question: "통관 업무도 하나요?",
        answer:
          "하지 않습니다. 통관·관세는 관세사 영역입니다. 법무사는 법인 등기만 지원합니다.",
      },
    ],
    relatedLinks: [
      { href: "/부산특수법인등기", label: "부산 특수법인 등기" },
      ...profRelated,
    ],
    ctaTitle: "관세법인 설립등기(등기만) 상담",
    ctaText:
      "등록이 끝났다면 등기 서류를 확인할 수 있습니다. 통관·관세는 관세사에게 문의하세요.",
    legalProfile: {
      entityName: "관세법인(관세사법인)",
      legalBasis: ["관세사법"],
      establishmentMethod: "설립 등록·인가 후 설립등기",
      competentAuthority: ["관세청·한국관세사회", "등기소"],
      preRegistrationSteps: ["구성원·정관", "설립 등록"],
      registrationDeadline: "등록 후 법정 기한",
      registrableMatters: ["명칭·주사무소·구성원"],
      lawyerScope: ["설립·변경 등기"],
      excludedScope: ["통관·관세 신고", "관세 자문", "등록 대리"],
      lastLegalReview: "2026-07-29",
      regionalNotes: ["부산 항만·수출입 관련 수요"],
    },
  },
  {
    slug: "감정평가법인설립등기",
    kind: "intent",
    title: "감정평가법인 설립등기",
    metaTitle: "감정평가법인 설립등기｜인가·등록 후 등기만",
    metaDescription:
      "감정평가법인 설립등기. 인가·등록은 감정평가사 절차, 법무사는 등기·서류만 — 다옴법무사.",
    h1: "감정평가법인 설립등기 — 감정 업무와 등기를 구분하세요",
    eyebrow: "감정평가법인 · 설립등기",
    heroIntro:
      "감정평가법인은 감정평가 및 감정평가사에 관한 법률에 따른 법인으로, 설립 인가·등록 후 설립등기를 합니다.",
    heroParagraphs: [
      "구성원 감정평가사 자격·출자·사무소 요건은 해당 법률·한국감정평가사협회 안내를 따릅니다. 법무사는 인가·등록 이후 등기만 지원합니다.",
      "부동산·동산·영업권 등 감정평가 자체는 감정평가사 고유 영역이며 법무사가 수행하지 않습니다.",
    ],
    officeLine: SPECIAL_ENTITY_OFFICE_LINE,
    scopeNotice: registryOnlyScope,
    conclusion:
      "감정평가법인 설립등기는 설립 인가·등록 후 관할 등기소에 접수합니다. 법무사는 등기 단계만 지원합니다.",
    primaryKeyword: "감정평가법인 설립등기",
    secondaryKeywords: [
      "감정평가사법인 설립",
      "감정법인 등기",
      "감정평가법인 구성원 변경",
    ],
    questionKeywords: ["감정평가법인 설립", "감정법인 등기"],
    searchIntent: "감정평가법인 설립등기를 확인하려는 검색",
    whoNeedsThis: [
      "감정평가사 사무소 법인화 후 등기",
      "구성원·주사무소 변경등기",
    ],
    whenAndDeadline: ["인가·등록 후 법정 기한 내 등기"],
    decisionBodies: ["구성원 총회", "협회·관할 기관"],
    documents: ["인가·등록 서류", "정관", "구성원 서류"],
    procedures: ["설립 인가·등록", "설립등기"],
    costFactors: ["구성원·사무소"],
    penaltyRisks: ["등기 지연"],
    commonConfusions: ["감정평가를 법무사에게 의뢰"],
    diyErrors: ["인가 전 등기"],
    faqs: [
      {
        question: "감정평가도 법무사가 하나요?",
        answer:
          "하지 않습니다. 감정평가는 감정평가사 영역입니다. 법무사는 법인 등기만 지원합니다.",
      },
    ],
    relatedLinks: profRelated,
    ctaTitle: "감정평가법인 설립등기(등기만) 상담",
    ctaText:
      "인가·등록이 끝났다면 등기 서류부터 확인할 수 있습니다. 감정평가는 감정평가사에게 문의하세요.",
    legalProfile: {
      entityName: "감정평가법인",
      legalBasis: ["감정평가 및 감정평가사에 관한 법률"],
      establishmentMethod: "설립 인가·등록 후 설립등기",
      competentAuthority: ["한국감정평가사협회·관할 기관", "등기소"],
      preRegistrationSteps: ["구성원·정관", "설립 인가"],
      registrationDeadline: "인가 후 법정 기한",
      registrableMatters: ["명칭·주사무소·구성원"],
      lawyerScope: ["설립·변경 등기"],
      excludedScope: ["감정평가", "설립 인가 대리"],
      lastLegalReview: "2026-07-29",
    },
  },
];
