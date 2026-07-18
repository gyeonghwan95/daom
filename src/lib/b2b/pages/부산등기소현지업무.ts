import type { B2BPageContent } from "../types";
import { VERIFIED_TRUST_ITEMS } from "../options";

export const registryOfficeLocalPageContent: B2BPageContent = {
  slug: "부산등기소현지업무",
  metaTitle: "부산 등기소 현지업무｜방문·제출·진행 확인 협업",
  metaDescription:
    "부산 등기소 방문·서류 제출·진행 확인이 필요할 때 현지 업무 범위를 안내합니다. 자료와 일정을 확인한 뒤 가능 범위를 안내합니다.",
  h1: "등기소에서만 되는 일, 현지에서 맞춰 확인합니다",
  eyebrow: "등기소 현지업무 · 방문 지원",
  heroIntro:
    "창구 확인, 원본 제출, 진행 상태 확인처럼 부산 등기소에서의 현지 작업이 필요할 때, 목적과 일정을 확인한 뒤 가능 범위를 안내합니다.",
  heroParagraphs: [
    "모든 등기가 방문이 필요한 것은 아닙니다. 전자로 가능한 일과 창구가 필요한 일을 먼저 구분합니다.",
    "복대리·접수·보정과 겹치면 목적을 한 문장으로 정리해 주시면, 어떤 안내 페이지가 맞는지부터 안내합니다.",
  ],
  primaryKeywords: [
    "부산 등기소 현지업무",
    "부산 등기소 방문",
    "등기소 서류 제출 협업",
    "부산 등기 진행 확인",
    "현지 법무사 등기소",
  ],
  trustItems: [...VERIFIED_TRUST_ITEMS],
  primaryCta: {
    href: "/협업문의?partner=legal-professional&type=local-support",
    label: "현지업무 가능 범위 확인",
  },
  secondaryCta: {
    href: "/협업문의?partner=legal-professional&service=receipt-correction",
    label: "접수·보정과 함께 문의",
  },
  bottomCtaText:
    "방문 목적, 관할 등기소, 희망일, 원본 유무만 알려 주셔도 점검 항목을 안내할 수 있습니다.",
  faqs: [
    {
      question: "어떤 일이 현지 방문이 필요한가요?",
      answer:
        "원본 제출, 창구 확인, 특정 진행 조회, 완료서류 수령 등이 해당될 수 있습니다. 사건마다 다르므로 목적을 먼저 확인합니다.",
    },
    {
      question: "등기소 위치를 대신 알아봐 주나요?",
      answer:
        "관할과 소재지를 기준으로 확인 방법을 안내합니다. 방문이 필요하면 일정과 함께 조율합니다.",
    },
    {
      question: "대기 시간이 길어질 수도 있나요?",
      answer:
        "창구 상황에 따라 달라질 수 있습니다. 특정 시각 완료를 보장하지 않으며, 여유를 두고 일정을 잡습니다.",
    },
    {
      question: "사진·영상으로 현장 상황을 보내 주나요?",
      answer:
        "개인정보·보안을 고려해 필요한 범위의 결과만 합의된 방식으로 공유합니다. 무단 촬영·과도한 공유는 하지 않습니다.",
    },
    {
      question: "원거리 협업과 무엇이 다른가요?",
      answer:
        "원거리 협업은 서류 이동·연락 창구·전체 조율에 초점을 두고, 이 페이지는 등기소에서의 현지 행위 자체에 초점을 둡니다.",
    },
    {
      question: "여러 등기소를 하루에 다니나요?",
      answer:
        "관할·거리·서류 준비에 따라 달라집니다. 가능 여부는 일정과 목적을 확인한 뒤 안내합니다.",
    },
    {
      question: "완료서류 수령만 부탁할 수 있나요?",
      answer:
        "가능 여부를 사건별로 확인합니다. 수령 권한·위임·반환 방식을 미리 맞춰야 합니다.",
    },
  ],
  relatedLinks: [
    { href: "/partners", label: "협업 허브" },
    { href: "/협업문의?partner=legal-professional&type=local-support", label: "현지 지원 문의" },
    { href: "/부산원거리등기협업", label: "부산 원거리 등기 협업" },
    { href: "/부산등기접수협업", label: "부산 등기 접수 협업" },
    { href: "/부산등기보정업무", label: "부산 등기 보정 업무" },
    { href: "/부산법무사복대리", label: "부산 법무사 복대리" },
    { href: "/부산지방법원등기국", label: "부산지방법원등기국 안내" },
  ],
  sections: [
    {
      id: "audience",
      title: "이런 때 필요합니다",
      kind: "bullets",
      items: [
        "창구에서만 확인·제출이 가능한 절차가 있을 때",
        "원본 서류의 현장 제출이 필요할 때",
        "진행 상태·완료서류 수령을 현지에서 맞춰야 할 때",
      ],
    },
    {
      id: "when",
      title: "문의 시점",
      kind: "bullets",
      items: [
        "방문 목적이 구체화된 뒤",
        "원본 발송·도착 일정이 잡히기 전후",
        "접수·보정과 같은 날 처리가 필요한지 확인할 때",
      ],
    },
    {
      id: "scope",
      title: "현지업무 예시",
      kind: "bullets",
      items: [
        "등기소 창구 제출·확인",
        "진행 상태 확인 후 공유",
        "완료서류·관련 자료 수령(사전 방식)",
        "접수·보정과 연계된 현지 지원",
      ],
      note: "수행하지 않는 특수 업무는 가능하다고 안내하지 않습니다.",
    },
    {
      id: "checklist",
      title: "방문 전 체크리스트",
      kind: "bullets",
      items: [
        "관할 등기소와 방문 목적",
        "지참·제출할 원본 목록",
        "위임·권한 관련 자료 필요 여부",
        "희망 방문일과 대체 일정",
        "결과 공유 방식",
      ],
    },
    {
      id: "documents",
      title: "서류 단계",
      kind: "table",
      headers: ["단계", "예시", "비고"],
      rows: [
        ["초기", "목적·관할·희망일", "민감정보 최소화"],
        ["검토", "제출 목록·위임 필요성", "누락 시 방문 의미 없음"],
        ["신청·방문", "원본·사본·수령 방법", "전달·보관 방식 합의"],
      ],
    },
    {
      id: "process",
      title: "진행",
      kind: "steps",
      steps: [
        { title: "목적 확인", body: "방문이 필요한지부터 가립니다." },
        { title: "준비물 정리", body: "원본·위임·일정을 맞춥니다." },
        { title: "현지 수행", body: "합의된 범위에서 방문·제출·확인합니다." },
        { title: "결과 공유", body: "합의된 형식으로 결과를 전달합니다." },
      ],
    },
    {
      id: "roles",
      title: "역할",
      kind: "table",
      headers: ["구분", "의뢰 측", "현지"],
      rows: [
        ["목적·권한", "위임·지시 명확화", "범위 내 수행"],
        ["서류", "원본 준비·발송", "수령·제출 지원"],
        ["결과", "다음 조치 결정", "결과 공유"],
      ],
    },
    {
      id: "schedule",
      title: "일정 요인",
      kind: "bullets",
      items: [
        "원본 도착일",
        "등기소 운영·혼잡",
        "동일 일정 접수·보정 연계",
        "수령물 반환 방식",
      ],
    },
    {
      id: "estimate",
      title: "견적 요인",
      kind: "bullets",
      items: [
        "방문 횟수·등기소 수",
        "대기·소요 가능성",
        "원본 수령·반환 포함 여부",
        "연계 업무(접수·보정) 범위",
      ],
    },
  ],
};
