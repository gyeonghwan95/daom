import type { B2BPageContent } from "../types";
import { VERIFIED_TRUST_ITEMS } from "../options";

export const correctionWorkPageContent: B2BPageContent = {
  slug: "부산등기보정업무",
  metaTitle: "부산 등기 보정 업무｜통지 공유·보완·재진행 협업",
  metaDescription:
    "부산 등기 보정 통지 이후의 기한·보완 서류·현지 대응 범위를 확인합니다. 자료와 일정을 확인한 뒤 가능 범위를 안내합니다.",
  h1: "보정 통지 이후, 기한과 보완 방향을 함께 맞춥니다",
  eyebrow: "등기 보정 · 보완 협업",
  heroIntro:
    "보정 안내가 나왔거나 나올 가능성이 있을 때, 기한·보완 서류·연락 창구를 정리한 뒤 현지에서 도울 수 있는 범위를 안내합니다.",
  heroParagraphs: [
    "보정은 ‘빠른 처리’보다 ‘무엇을 보완할지’가 먼저입니다. 통지 내용을 공유해 주시면 다음 조치를 조율합니다.",
    "접수만 맡긴 사건과 보정까지 포함한 사건은 역할이 달라집니다. 처음부터 범위를 나눠 두는 것이 좋습니다.",
  ],
  primaryKeywords: [
    "부산 등기 보정",
    "등기 보정 업무 협업",
    "부산 등기소 보정 대응",
    "보정 기한 등기",
    "타지역 법무사 보정 협조",
  ],
  trustItems: [...VERIFIED_TRUST_ITEMS],
  primaryCta: {
    href: "/협업문의?partner=legal-professional&service=receipt-correction",
    label: "보정 대응 가능 범위 확인",
  },
  secondaryCta: {
    href: "/협업문의?partner=legal-professional&type=urgent",
    label: "보정 기한 긴급 확인",
  },
  bottomCtaText:
    "보정 통지 요지, 기한, 관할, 기존 접수 여부만 알려 주셔도 먼저 확인할 항목을 안내할 수 있습니다.",
  faqs: [
    {
      question: "보정 통지 원문을 처음부터 보내야 하나요?",
      answer:
        "초기에는 요지·기한·사건번호 정도면 충분합니다. 상세 자료는 안전한 채널로 별도 안내합니다.",
    },
    {
      question: "보정이 여러 번 나올 수도 있나요?",
      answer:
        "가능합니다. 보완 후에도 추가 안내가 있을 수 있어, 연락 창구를 유지하는 것이 중요합니다.",
    },
    {
      question: "현지에서 보정서를 대신 작성하나요?",
      answer:
        "보완 내용의 법적·사실관계는 의뢰 측이 확정하는 경우가 많습니다. 현지는 협의된 범위의 제출·연락을 검토합니다.",
    },
    {
      question: "기한이 임박하면 무조건 대응하나요?",
      answer:
        "기한과 서류 준비 상태를 함께 봅니다. 임박 일정에서도 가능 여부를 단정하지 않고 확인 후 안내합니다.",
    },
    {
      question: "접수 협업과 보정 업무를 같이 맡길 수 있나요?",
      answer:
        "가능합니다. 접수 단계부터 보정 연락 창구를 맞춰 두면 이후 대응이 수월합니다.",
    },
    {
      question: "법인등기 보정과 부동산등기 보정은 다른가요?",
      answer:
        "보완 포인트가 다릅니다. 의사록·인감 중심인지, 권리서류·첨부 중심인지에 따라 점검 목록이 달라집니다.",
    },
    {
      question: "보정 후 재접수는 누가 하나요?",
      answer:
        "보완본 준비와 재제출 방식은 사건별로 협의합니다. 역할을 사전에 표로 맞춰 둡니다.",
    },
  ],
  relatedLinks: [
    { href: "/partners", label: "협업 허브" },
    { href: "/협업문의?partner=legal-professional&service=receipt-correction", label: "보정·접수 협업 문의" },
    { href: "/부산등기접수협업", label: "부산 등기 접수 협업" },
    { href: "/부산등기소현지업무", label: "부산 등기소 현지업무" },
    { href: "/부산부동산등기복대리", label: "부산 부동산등기 복대리" },
    { href: "/부산법인등기복대리", label: "부산 법인등기 복대리" },
    { href: "/부산법무사복대리", label: "부산 법무사 복대리" },
  ],
  sections: [
    {
      id: "audience",
      title: "대상",
      kind: "bullets",
      items: [
        "이미 접수한 사건의 보정 통지를 받은 타지역 사무소",
        "접수와 보정 대응을 한 흐름으로 조율하려는 경우",
        "기한 내 보완 제출만 현지에서 필요한 경우",
      ],
    },
    {
      id: "when",
      title: "문의 시점",
      kind: "bullets",
      items: [
        "보정 통지를 받은 직후",
        "접수 전 보정 위험이 보여 창구를 미리 맞출 때",
        "보완 서류 초안이 나와 제출 방식을 정해야 할 때",
      ],
    },
    {
      id: "scope",
      title: "협업 범위",
      kind: "bullets",
      items: [
        "보정 통지 내용 공유·기한 확인",
        "보완 방향에 대한 실무적 점검 의견",
        "협의된 범위의 보완 제출·현지 연락",
        "추가 보정·완료 여부 공유",
      ],
      note: "보정 사유를 없애 준다고 단정하지 않습니다.",
    },
    {
      id: "checklist",
      title: "보정 대응 체크리스트",
      kind: "bullets",
      items: [
        "사건번호·관할·기한",
        "보정 요지(무엇을 보완할지)",
        "보완 서류 준비 상태",
        "제출 방식(창구·전자·원본)",
        "연락받을 담당자",
      ],
    },
    {
      id: "documents",
      title: "서류 구분",
      kind: "table",
      headers: ["단계", "자료", "주의"],
      rows: [
        ["초기", "통지 요지·기한·사건번호", "전체 스캔은 안심 채널로"],
        ["검토", "보완안·수정 신청·추가 첨부", "원인 서류와 일치 여부"],
        ["신청", "최종 보완본·제출용 원본", "기한·접수 방식 재확인"],
      ],
    },
    {
      id: "process",
      title: "대응 절차",
      kind: "steps",
      steps: [
        { title: "통지 확인", body: "기한과 요구 사항을 정리합니다." },
        { title: "보완 조율", body: "누가 무엇을 준비할지 나눕니다." },
        { title: "제출", body: "합의된 방식으로 보완을 제출합니다." },
        { title: "후속 공유", body: "추가 안내·완료 여부를 공유합니다." },
      ],
    },
    {
      id: "roles",
      title: "역할",
      kind: "table",
      headers: ["구분", "의뢰 측", "현지"],
      rows: [
        ["내용 확정", "보완 사실·서류 확정", "실무 형식 점검 협조"],
        ["제출", "자료 전달", "협의 범위 제출"],
        ["기한 관리", "내부 일정 조율", "통지·결과 공유"],
      ],
    },
    {
      id: "schedule",
      title: "일정 요인",
      kind: "bullets",
      items: [
        "보정 기한",
        "보완 서류 확보에 걸리는 시간",
        "원본 이동·검수",
        "추가 보정 가능성",
      ],
    },
    {
      id: "estimate",
      title: "견적 요인",
      kind: "bullets",
      items: [
        "보정 횟수·복잡도",
        "방문·원본 제출 필요성",
        "기존 접수 협업 포함 여부",
        "긴급도",
      ],
    },
  ],
};
