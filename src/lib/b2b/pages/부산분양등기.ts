import type { B2BPageContent } from "../types";
import { VERIFIED_TRUST_ITEMS } from "../options";

export const saleRegistryPageContent: B2BPageContent = {
  slug: "부산분양등기",
  metaTitle: "부산 분양등기｜수분양자 이전·잔금·담보 일정 협업",
  metaDescription:
    "분양 이후 수분양자 소유권이전·잔금·담보 일정을 조율하는 부산 분양등기 안내. 목록과 일정을 확인한 뒤 가능 범위를 안내합니다.",
  h1: "보존 이후 수분양자 이전, 목록과 잔금부터 맞춥니다",
  eyebrow: "분양등기 · 수분양자 이전",
  heroIntro:
    "보존등기 이후 수분양자 명의이전과 잔금·담보가 이어질 때, 호실 목록·일정·서류를 정리한 뒤 가능 범위를 안내합니다.",
  heroParagraphs: [
    "분양등기는 한 번의 접수가 아니라 일정표에 가까운 경우가 많습니다. 우선순위와 창구를 먼저 정합니다.",
    "시행·건설·중개 잔금 협업과 겹치면, 분양 목록 관리인지 개별 잔금일인지에 따라 안내를 나눕니다.",
  ],
  primaryKeywords: [
    "부산 분양등기",
    "수분양자 소유권이전",
    "분양 잔금 등기",
    "신축 분양 등기",
    "분양대행 등기 협업",
  ],
  trustItems: [...VERIFIED_TRUST_ITEMS],
  primaryCta: {
    href: "/협업문의?partner=developer&service=bulk",
    label: "분양등기 일정·범위 확인",
  },
  secondaryCta: {
    href: "/협업문의?partner=developer&service=transfer-collab",
    label: "수분양자 이전 협업 문의",
  },
  bottomCtaText:
    "예상 호실 수, 잔금·입주 시기, 담보 연동 여부만 알려 주셔도 목록·일정 점검 항목을 안내할 수 있습니다.",
  faqs: [
    {
      question: "보존이 끝나지 않아도 분양등기를 문의할 수 있나요?",
      answer:
        "가능합니다. 다만 보존·표시 확정 전이면 일정만 사전 조율하고, 실제 이전은 상태를 확인한 뒤 진행합니다.",
    },
    {
      question: "호실마다 잔금일이 다르면 어떻게 하나요?",
      answer:
        "목록에 잔금·우선순위를 두고 배치합니다. 한꺼번에 끝난다고 안내하지 않습니다.",
    },
    {
      question: "중도금·잔금 대출 근저당은?",
      answer:
        "세대별 금융 일정을 목록에 반영합니다. 설정·말소 순서는 자료를 확인한 뒤 조율합니다.",
    },
    {
      question: "분양대행사만 문의해도 되나요?",
      answer:
        "가능합니다. 시행·법무·대행 창구를 구분해 주시면 고객 안내가 일관됩니다.",
    },
    {
      question: "잔금등기협업 페이지와 차이는?",
      answer:
        "잔금 협업은 개별 거래 잔금일에, 분양등기는 다수 수분양자 목록·일정 관리에 더 초점을 둡니다.",
    },
    {
      question: "입주 지정일 전에 꼭 끝나나요?",
      answer:
        "서류·금융·관할 상태에 따라 달라집니다. 입주일에 맞춘 완료를 보장하지 않으며 확인 후 안내합니다.",
    },
    {
      question: "견적은 호당으로 나오나요?",
      answer:
        "건수·담보·서류 상태·일정 여유를 보고 견적 범위를 안내합니다. 확인 전 호당 단가를 단정하지 않습니다.",
    },
  ],
  relatedLinks: [
    { href: "/partners", label: "협업 허브" },
    { href: "/협업문의?partner=developer&service=bulk", label: "분양·집단 등기 문의" },
    { href: "/부산시행사등기", label: "시행사 등기업무" },
    { href: "/부산잔금등기협업", label: "잔금일 등기 협업" },
    { href: "/부산집단등기", label: "집단등기" },
    { href: "/부산신축아파트소유권이전등기", label: "신축 아파트 소유권이전" },
    { href: "/부산신축건물보존등기", label: "신축건물 보존등기" },
  ],
  sections: [
    {
      id: "audience",
      title: "대상",
      kind: "bullets",
      items: [
        "수분양자 이전이 이어지는 시행·분양 담당자",
        "호실별 잔금·담보 일정을 관리해야 하는 경우",
        "입주 전 명의이전 문의가 몰리는 경우",
      ],
    },
    {
      id: "when",
      title: "문의 시점",
      kind: "bullets",
      items: [
        "보존 일정이 보이거나 완료된 뒤",
        "잔금·입주 캘린더가 나온 뒤",
        "세대별 대출·말소 일정이 잡히기 전후",
      ],
    },
    {
      id: "scope",
      title: "범위",
      kind: "bullets",
      items: [
        "수분양자 소유권이전 목록·일정 관리",
        "잔금·담보와 등기 순서 조율",
        "고객·대행·시행 창구 분리",
        "접수·보정·완료 공유",
      ],
    },
    {
      id: "checklist",
      title: "체크리스트",
      kind: "bullets",
      items: [
        "호실·동 목록",
        "잔금·입주 일정",
        "담보·말소 연동",
        "보존·표시 확정 여부",
        "담당 창구(시행·대행·법무)",
      ],
    },
    {
      id: "documents",
      title: "서류 단계",
      kind: "table",
      headers: ["단계", "예시", "비고"],
      rows: [
        ["초기", "호수·일정·담보 여부", "개인정보 최소화"],
        ["검토", "샘플 세대 서류·목록", "누락 패턴 점검"],
        ["신청", "세대별 신청 패키지", "우선순위 배치"],
      ],
    },
    {
      id: "process",
      title: "진행",
      kind: "steps",
      steps: [
        { title: "목록 확정", body: "대상 호실과 상태를 맞춥니다." },
        { title: "일정 배치", body: "잔금·금융·접수 순서를 잡습니다." },
        { title: "서류 점검", body: "세대별 누락을 줄입니다." },
        { title: "진행 공유", body: "접수·보정·완료를 공유합니다." },
      ],
    },
    {
      id: "roles",
      title: "역할",
      kind: "table",
      headers: ["구분", "시행·분양 측", "법무사"],
      rows: [
        ["고객 일정", "잔금·입주 안내", "등기 가능 시점 안내"],
        ["목록", "대상·변경 공유", "진행 상태 관리"],
        ["서류", "당사자 취합 협조", "첨부·신청 검토"],
      ],
    },
    {
      id: "schedule",
      title: "일정 요인",
      kind: "bullets",
      items: [
        "보존·표시 확정",
        "호실별 잔금일",
        "대출·말소 확정",
        "고객 서류 준비 속도",
      ],
    },
    {
      id: "estimate",
      title: "견적 요인",
      kind: "bullets",
      items: [
        "호실 수·동시 진행 규모",
        "담보 연동 비율",
        "서류·목록 완성도",
        "일정 밀도·변경 빈도",
      ],
    },
  ],
};
