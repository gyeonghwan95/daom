"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
type AudienceKey =
  | "youth"
  | "startup"
  | "enterprise"
  | "welfare"
  | "citizen"
  | "public"
  | "student"
  | "other";

type NeedKey =
  | "housing"
  | "contract"
  | "startup"
  | "inheritance"
  | "claim"
  | "dispute"
  | "field"
  | "custom";

type DurationKey = "60" | "90" | "120" | "half" | "tbd";

type FinderResult = {
  title: string;
  href: string;
  topics: string[];
  format: string;
  prepare: string[];
  relatedHistoryHref?: string;
};

const AUDIENCES: { key: AudienceKey; label: string }[] = [
  { key: "youth", label: "청년·사회초년생" },
  { key: "startup", label: "예비창업자·창업기업" },
  { key: "enterprise", label: "기업 대표·직원" },
  { key: "welfare", label: "사회복지·자립지원 종사자" },
  { key: "citizen", label: "시민·도서관 이용자" },
  { key: "public", label: "공공기관 상담·지원 담당자" },
  { key: "student", label: "학생·대학생" },
  { key: "other", label: "기타" },
];

const NEEDS: { key: NeedKey; label: string }[] = [
  { key: "housing", label: "주거와 전세사기 예방" },
  { key: "contract", label: "계약과 돈거래" },
  { key: "startup", label: "창업과 법인" },
  { key: "inheritance", label: "상속과 가족재산" },
  { key: "claim", label: "채권·미수금과 증거" },
  { key: "dispute", label: "생활분쟁 대응" },
  { key: "field", label: "현장 종사자의 초기 안내" },
  { key: "custom", label: "강사와 함께 주제 구성" },
];

const DURATIONS: { key: DurationKey; label: string }[] = [
  { key: "60", label: "60분" },
  { key: "90", label: "90분" },
  { key: "120", label: "2시간" },
  { key: "half", label: "3~4시간" },
  { key: "tbd", label: "미정" },
];

function buildResult(
  audience: AudienceKey,
  need: NeedKey,
  duration: DurationKey,
): FinderResult {
  const durationLabel =
    DURATIONS.find((d) => d.key === duration)?.label ?? "협의";

  if (need === "housing" || (audience === "youth" && need === "dispute")) {
    return {
      title: "전세사기 예방·주거계약 교육",
      href: "/전세사기예방교육",
      topics: [
        "임대차계약 전 확인",
        "등기부등본 보는 방법",
        "보증금 보호 포인트",
        "계약서·특약 체크",
      ],
      format: `${durationLabel} 사례형 · 체크리스트 중심`,
      prepare: ["대상 연령·인원", "희망일·장소", "온라인 여부", "기존 교육 유무"],
      relatedHistoryHref: "/강의이력/busan-self-support-jeonse-prevention",
    };
  }

  if (audience === "startup" || need === "startup") {
    return {
      title: "창업·법인 실무 교육",
      href: "/창업법률교육",
      topics: [
        "개인사업자와 법인 차이",
        "공동창업 전 합의사항",
        "거래계약·증거관리",
        "법인설립 후 변경등기",
      ],
      format: `${durationLabel} 실무형 · 질문 비중 확대 가능`,
      prepare: ["예비창업/초기기업 여부", "인원", "희망 주제 우선순위"],
      relatedHistoryHref: "/강의이력/haeundae-youth-space-startup-law-2026-07",
    };
  }

  if (audience === "enterprise" || need === "claim") {
    return {
      title: "기업·직원 계약·채권 교육",
      href: "/기업법률교육",
      topics: [
        "계약 전 확인사항",
        "미수금과 증거관리",
        "카카오톡·메일·통화녹음",
        "법인 임원·변경등기 기초",
      ],
      format: `${durationLabel} 사내특강 · 법정교육 제외`,
      prepare: ["대표/직원 구분", "업종", "희망 시간·장소"],
    };
  }

  if (audience === "welfare" || need === "field") {
    return {
      title: "사회복지·자립지원 종사자교육",
      href: "/부산사회복지기관강사",
      topics: [
        "가족·재산문제 초기 이해",
        "사망 후 행정·상속 흐름",
        "채무·상속포기·한정승인 구분",
        "전문기관 연결 기준",
      ],
      format: `${durationLabel} 현장 사례형`,
      prepare: ["종사자/이용자 대상 구분", "기관 유형", "희망일"],
      relatedHistoryHref: "/강의이력/busan-self-support-daily-dispute-survival",
    };
  }

  if (audience === "citizen" || need === "inheritance") {
    return {
      title: "도서관·시민 생활법률 강좌",
      href: "/부산도서관법률특강",
      topics: [
        "일상 계약·증거",
        "전세·주거 기초",
        "상속·증여 개요",
        "생활분쟁 해결기관",
      ],
      format: `${durationLabel} 시민 눈높이 · 연속과정 가능`,
      prepare: ["회차 수", "야간/주말 여부", "대상 연령대"],
      relatedHistoryHref: "/강의이력/busan-citizen-library-life-law",
    };
  }

  if (audience === "public") {
    return {
      title: "공공기관 직원·상담 담당 실무교육",
      href: "/공공기관법률교육",
      topics: [
        "민원 현장 생활분쟁",
        "계약·증거 기초",
        "상속·채무 초기 안내",
        "법정 지정교육과 구분",
      ],
      format: `${durationLabel} · 청렴 등 법정교육 제외`,
      prepare: ["직원/시민 대상", "제외할 법정교육 여부", "희망일"],
    };
  }

  if (audience === "student") {
    return {
      title: "학교·대학 생활법률·진로 특강",
      href: "/학교법률교육",
      topics: [
        "아르바이트·중고거래",
        "자취 계약·보증금",
        "디지털 기록과 증거",
        "법무사 진로(선택)",
      ],
      format: `${durationLabel} · 학년·연령에 맞춰 조정`,
      prepare: ["학교급·학년", "진로특강 포함 여부"],
      relatedHistoryHref: "/강의이력/yangsan-jeil-high-career-talk",
    };
  }

  return {
    title: "대상 맞춤 생활법률 특강",
    href: "/부산법률강사",
    topics: [
      "주거·계약",
      "금전거래",
      "생활분쟁",
      "기관 목적에 맞춘 모듈 조합",
    ],
    format: `${durationLabel} · 사전 협의 후 구성`,
    prepare: ["교육 목적", "대상", "인원", "희망일·시간"],
  };
}

/**
 * 기관 담당자용 강의주제 추천기.
 * 결과마다 별도 색인 URL을 만들지 않습니다.
 */
export function LectureTopicFinder() {
  const [step, setStep] = useState(1);
  const [audience, setAudience] = useState<AudienceKey | null>(null);
  const [need, setNeed] = useState<NeedKey | null>(null);
  const [duration, setDuration] = useState<DurationKey | null>(null);

  const result = useMemo(() => {
    if (!audience || !need || !duration) return null;
    return buildResult(audience, need, duration);
  }, [audience, need, duration]);

  return (
    <div className="lecture-topic-finder rounded-2xl border border-navy/10 bg-cream/30 p-4 md:p-6">
      <p className="text-sm text-navy/65">
        대상·목적·시간만 고르면 맞는 강의 방향과 문의에 필요한 정보를
        안내합니다. 추천 결과는 상담 편의를 위한 것이며, 별도 검색 페이지로
        색인되지 않습니다.
      </p>

      {step === 1 ? (
        <fieldset className="mt-4">
          <legend className="text-base font-semibold text-navy">
            어떤 분들을 위한 교육인가요?
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {AUDIENCES.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`rounded-xl border px-3 py-2.5 text-left text-sm ${
                  audience === item.key
                    ? "border-navy bg-navy text-white"
                    : "border-beige-dark bg-white text-navy hover:border-navy/30"
                }`}
                onClick={() => {
                  setAudience(item.key);
                  setStep(2);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className="mt-4">
          <legend className="text-base font-semibold text-navy">
            교육에서 가장 필요한 내용은 무엇인가요?
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {NEEDS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`rounded-xl border px-3 py-2.5 text-left text-sm ${
                  need === item.key
                    ? "border-navy bg-navy text-white"
                    : "border-beige-dark bg-white text-navy hover:border-navy/30"
                }`}
                onClick={() => {
                  setNeed(item.key);
                  setStep(3);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 text-sm text-navy/60 underline-offset-2 hover:underline"
            onClick={() => setStep(1)}
          >
            이전
          </button>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <fieldset className="mt-4">
          <legend className="text-base font-semibold text-navy">
            희망 교육시간은 어느 정도인가요?
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {DURATIONS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`rounded-xl border px-3 py-2.5 text-left text-sm ${
                  duration === item.key
                    ? "border-navy bg-navy text-white"
                    : "border-beige-dark bg-white text-navy hover:border-navy/30"
                }`}
                onClick={() => {
                  setDuration(item.key);
                  setStep(4);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 text-sm text-navy/60 underline-offset-2 hover:underline"
            onClick={() => setStep(2)}
          >
            이전
          </button>
        </fieldset>
      ) : null}

      {step === 4 && result ? (
        <div id="finder-result" className="mt-5 space-y-3 rounded-xl border border-beige-dark bg-white p-4">
          <p className="text-xs font-semibold tracking-wide text-navy/55">
            추천 결과
          </p>
          <h3 className="text-lg font-semibold text-navy">{result.title}</h3>
          <p className="text-sm text-navy/70">진행방식: {result.format}</p>
          <div>
            <p className="text-sm font-semibold text-navy">추천 세부주제</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy/75">
              {result.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">담당자가 준비할 정보</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-navy/75">
              {result.prepare.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={result.href} className="btn-secondary text-sm">
              추천 강의 자세히 보기
            </Link>
            {result.relatedHistoryHref ? (
              <Link
                href={result.relatedHistoryHref}
                className="text-sm font-medium text-navy underline-offset-2 hover:underline"
              >
                관련 출강 사례
              </Link>
            ) : null}
            <Link href="/강의문의" className="btn-primary text-sm">
              강의문의
            </Link>
          </div>
          <button
            type="button"
            className="text-sm text-navy/60 underline-offset-2 hover:underline"
            onClick={() => {
              setStep(1);
              setAudience(null);
              setNeed(null);
              setDuration(null);
            }}
          >
            다시 선택하기
          </button>
        </div>
      ) : null}
    </div>
  );
}
