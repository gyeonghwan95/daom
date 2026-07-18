"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { buildInquiryHref } from "@/lib/b2b/options";

const AUDIENCE = [
  { id: "owner", label: "개인 건축주입니다", href: "#documents" },
  { id: "architect", label: "건축사사무소입니다", href: "#architect-collab" },
  {
    id: "developer",
    label: "시행사·건설사입니다",
    href: "#developer-collab",
  },
  { id: "multi", label: "여러 호실의 등기입니다", href: "#multi-unit" },
  { id: "org", label: "법인·기관 소유 건물입니다", href: "#org-owner" },
] as const;

const BUILDING_CHECKS: {
  id: string;
  title: string;
  items: string[];
}[] = [
  {
    id: "villa",
    title: "빌라·다세대주택",
    items: [
      "일반건물인지 집합건물인지",
      "세대 또는 호실 구성",
      "대지권 표시 여부",
      "공동건축주 여부",
      "분양 예정 여부",
      "담보 설정 예정 여부",
      "사용승인과 대장 정리 상태",
    ],
  },
  {
    id: "officetel",
    title: "오피스텔",
    items: [
      "집합건물 여부",
      "전유부분과 공용부분 표시",
      "호실별 면적",
      "대지권 비율",
      "시행사·신탁사 구조",
      "분양·임대 구조",
      "보존등기 이후 이전등기 일정",
    ],
  },
  {
    id: "retail",
    title: "상가·집합상가",
    items: [
      "호실별 구분 여부",
      "공용부분과 대지권",
      "분양 또는 임대 여부",
      "근저당 설정 계획",
      "법인 건축주 여부",
      "상가동과 주거동의 구분",
    ],
  },
  {
    id: "factory",
    title: "공장·창고·근린생활시설",
    items: [
      "건축물 용도",
      "산업단지 또는 공장등록 관련 자료",
      "토지와 건물 소유자 일치 여부",
      "법인 소유 여부",
      "담보권 설정 일정",
      "증축·부속건물 여부",
    ],
  },
  {
    id: "apt",
    title: "아파트·공동주택",
    items: [
      "시행사·조합·건축주 구조",
      "신탁 여부",
      "대지권",
      "세대 목록",
      "보존등기와 분양 이전등기 연결",
      "프로젝트 일정",
    ],
  },
];

type PrepState = {
  location: string;
  buildingType: string;
  ownerType: string;
  structure: string;
  dongCount: string;
  unitCount: string;
  useApproved: string;
  registryReady: string;
  landRelation: string;
  trust: string;
  sale: string;
  loan: string;
  schedule: string;
  contact: string;
};

const emptyPrep: PrepState = {
  location: "",
  buildingType: "",
  ownerType: "",
  structure: "",
  dongCount: "",
  unitCount: "",
  useApproved: "",
  registryReady: "",
  landRelation: "",
  trust: "",
  sale: "",
  loan: "",
  schedule: "",
  contact: "",
};

const FIELD =
  "mt-1 w-full rounded-lg border border-beige-dark bg-white px-3 py-2 text-sm outline-none ring-navy/20 focus:ring-2";

export function PreservationB2BSections() {
  const [prep, setPrep] = useState<PrepState>(emptyPrep);

  const inquiryHref = useMemo(() => {
    return buildInquiryHref({
      partner:
        prep.ownerType.includes("건축사")
          ? "architect"
          : prep.ownerType.includes("시행")
            ? "developer"
            : prep.ownerType.includes("법인")
              ? "company"
              : "individual-builder",
      service: "preservation",
      type: Number(prep.unitCount) > 1 || prep.unitCount.includes("~")
        ? "project"
        : undefined,
    });
  }, [prep.ownerType, prep.unitCount]);

  function update<K extends keyof PrepState>(key: K, value: PrepState[K]) {
    setPrep((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-8 border-t border-beige-dark pt-8 md:space-y-10 md:pt-10">
      <section id="audience-nav" className="scroll-mt-[calc(var(--header-height)+1rem)]">
        <h2 className="section-heading">어떤 입장이신가요?</h2>
        <p className="body-text mt-2 max-w-3xl text-navy/75">
          개인 건축주 안내는 그대로 두었습니다. 협업·프로젝트 담당자는 아래에서
          해당 구간으로 이동할 수 있습니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {AUDIENCE.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="inline-flex min-h-11 items-center rounded-lg border border-beige-dark bg-beige/40 px-3 text-sm text-navy hover:bg-beige/70"
            >
              {item.label}
            </a>
          ))}
        </div>
      </section>

      <section id="building-checkpoints">
        <h2 className="section-heading">건물 유형별 협업 체크포인트</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {BUILDING_CHECKS.map((block) => (
            <div
              key={block.id}
              className="rounded-xl border border-beige-dark bg-white p-4"
            >
              <h3 className="text-base font-semibold text-navy">{block.title}</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/75">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section
        id="architect-collab"
        className="scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <h2 className="section-heading">건축사사무소 협업</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          사용승인과 건축물대장 정리 이후 보존등기로 이어지는 과정에서 필요한
          자료와 역할을 확인합니다. 도면·사용승인 자료와 등기 서류의 연결
          지점을 먼저 정리하면 이후 절차가 수월합니다.
        </p>
        <Link
          href="/협업문의?partner=architect&service=preservation"
          className="btn-primary mt-4 inline-flex min-h-12 items-center px-5"
        >
          건축사 협업 문의
        </Link>
      </section>

      <section
        id="developer-collab"
        className="scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <h2 className="section-heading">시행사·건설사 협업</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          보존등기 이후 이전·담보가 연결되는 경우, 일정과 목록 관리 방식을
          함께 봅니다. 여러 호실이면 집단등기 안내도 함께 확인해 주세요.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/협업문의?partner=developer&service=preservation"
            className="btn-primary inline-flex min-h-12 items-center px-5"
          >
            시행·건설 협업 문의
          </Link>
          <Link
            href="/부산집단등기"
            className="btn-secondary inline-flex min-h-12 items-center px-5"
          >
            집단·대량등기 안내
          </Link>
        </div>
      </section>

      <section
        id="multi-unit"
        className="scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <h2 className="section-heading">여러 호실의 등기</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          건물 유형과 호실 수를 확인한 뒤 업무 범위를 협의합니다. 일괄 접수
          전에 일부 건을 우선 검토하는 방식도 협의할 수 있습니다.
        </p>
      </section>

      <section
        id="org-owner"
        className="scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <h2 className="section-heading">법인·기관 소유 건물</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          법인·기관 건축주는 결의·공문·인감 등 추가 확인이 필요할 수 있습니다.
          공공기관이면 공공기관 등기업무 안내도 참고해 주세요.
        </p>
        <Link
          href="/공공기관등기업무"
          className="btn-secondary mt-4 inline-flex min-h-12 items-center px-5"
        >
          공공기관 등기업무
        </Link>
      </section>

      <section id="collab-prep-table" className="print:hidden">
        <h2 className="section-heading">협업 준비자료 표</h2>
        <p className="body-text mt-2 max-w-3xl text-navy/75">
          회의·공유용으로 아래 항목을 채워 두시면 문의가 수월합니다. 민감
          원본은 적지 마세요.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["location", "건물 소재지"],
              ["buildingType", "건물 유형"],
              ["ownerType", "건축주 유형"],
              ["structure", "일반건물·집합건물 여부"],
              ["dongCount", "동 수"],
              ["unitCount", "예상 호실 수"],
              ["useApproved", "사용승인 여부"],
              ["registryReady", "건축물대장 생성 여부"],
              ["landRelation", "토지 소유관계"],
              ["trust", "신탁 여부"],
              ["sale", "분양 여부"],
              ["loan", "담보대출 예정 여부"],
              ["schedule", "희망 일정"],
              ["contact", "담당자 연락처"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm font-medium text-navy">
              {label}
              <input
                className={FIELD}
                value={prep[key]}
                onChange={(e) => update(key, e.target.value)}
              />
            </label>
          ))}
        </div>
        <Link
          href={inquiryHref}
          className="btn-primary mt-5 inline-flex min-h-12 items-center px-5"
        >
          프로젝트 개요 보내기
        </Link>
      </section>

      <section id="print-checklist" className="preservation-print-root">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <h2 className="section-heading">보존등기 사전 체크리스트</h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-secondary inline-flex min-h-11 items-center px-4 text-sm"
          >
            보존등기 사전 체크리스트 인쇄
          </button>
        </div>
        <div className="mt-4 rounded-xl border border-beige-dark bg-white p-5 print:border-0 print:p-0">
          <p className="text-sm font-semibold text-navy">다옴법무사사무소</p>
          <p className="mt-1 text-lg font-semibold text-navy">
            보존등기 사전 체크리스트
          </p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-navy/55">건물 소재지</dt>
              <dd className="min-h-6 border-b border-dashed border-navy/20">
                {prep.location}
              </dd>
            </div>
            <div>
              <dt className="text-navy/55">건물 유형</dt>
              <dd className="min-h-6 border-b border-dashed border-navy/20">
                {prep.buildingType}
              </dd>
            </div>
            <div>
              <dt className="text-navy/55">건축주 유형</dt>
              <dd className="min-h-6 border-b border-dashed border-navy/20">
                {prep.ownerType}
              </dd>
            </div>
            <div>
              <dt className="text-navy/55">희망 일정</dt>
              <dd className="min-h-6 border-b border-dashed border-navy/20">
                {prep.schedule}
              </dd>
            </div>
          </dl>
          <p className="mt-5 text-sm font-medium text-navy">확인 항목</p>
          <ul className="mt-2 space-y-2 text-sm text-navy/80">
            {[
              "사용승인 여부",
              "건축물대장 생성 여부",
              "일반·집합건물 구분",
              "토지 소유관계",
              "신탁·분양·담보 예정",
              "동·호실 구성",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>□</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm font-medium text-navy">담당자 메모</p>
          <div className="mt-2 min-h-24 rounded border border-dashed border-navy/25" />
          <p className="mt-4 text-xs text-navy/60">
            문의: 협업 문의 · 신축건물 보존등기 안내 · 다옴법무사사무소
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-beige-dark bg-beige/30 p-5">
        <h2 className="text-lg font-semibold text-navy">건축·시행사 등기 협업</h2>
        <p className="mt-2 text-sm text-navy/75">
          복대리·프로젝트 문의와 보존등기 협업은 일반 상담과 구분해 안내합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/partners" className="btn-secondary inline-flex min-h-11 items-center px-4 text-sm">
            전문직·기업 협업 안내
          </Link>
          <Link
            href="/협업문의?service=preservation"
            className="btn-primary inline-flex min-h-11 items-center px-4 text-sm"
          >
            보존등기 협업 문의
          </Link>
        </div>
      </section>
    </div>
  );
}
