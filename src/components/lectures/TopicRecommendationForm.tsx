"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type RecommendResult = {
  topics: { title: string; href: string; outline: string[] }[];
  format: string;
  note: string;
};

export function TopicRecommendationForm() {
  const [institution, setInstitution] = useState("청년기관");
  const [audience, setAudience] = useState("청년");
  const [purpose, setPurpose] = useState("예방교육");
  const [minutes, setMinutes] = useState("90");
  const [interactive, setInteractive] = useState(true);

  const result = useMemo<RecommendResult>(() => {
    const topics: RecommendResult["topics"] = [];

    if (
      purpose.includes("전세") ||
      audience.includes("청년") ||
      institution.includes("복지") ||
      institution.includes("청년")
    ) {
      topics.push({
        title: "전세사기 예방교육",
        href: "/전세사기예방교육",
        outline: [
          "계약 전 확인",
          "등기부·확정일자",
          "보증·특약",
          "체크리스트 실습",
        ],
      });
    }
    if (audience.includes("청년") || purpose.includes("생활")) {
      topics.push({
        title: "청년 생활법률 특강",
        href: "/청년생활법률특강",
        outline: ["주거·계약", "금전거래", "온라인 예방", "질의응답"],
      });
    }
    if (institution.includes("창업") || purpose.includes("창업")) {
      topics.push({
        title: "창업 법률교육",
        href: "/창업법률교육",
        outline: ["법인/사업자", "동업·계약", "등기기한", "리스크 체크"],
      });
    }
    if (institution.includes("기업") || audience.includes("임직원")) {
      topics.push({
        title: "기업 법률교육",
        href: "/기업법률교육",
        outline: ["계약", "채권", "개인정보·SNS", "기한"],
      });
    }
    if (purpose.includes("디지털") || purpose.includes("온라인")) {
      topics.push({
        title: "디지털 법률교육",
        href: "/디지털법률교육",
        outline: ["게시글 책임", "개인정보", "사기 예방", "증거보존"],
      });
    }
    if (
      institution.includes("도서관") ||
      institution.includes("평생") ||
      audience.includes("시민")
    ) {
      topics.push({
        title: "도서관 법률특강",
        href: "/부산도서관법률특강",
        outline: ["생활법률", "주거·계약", "연속과정", "질의응답"],
      });
    }
    if (
      institution.includes("기관") ||
      institution.includes("협회") ||
      institution.includes("단체") ||
      institution.includes("복지")
    ) {
      topics.push({
        title: "기관·단체 법률특강",
        href: "/부산기관법률특강",
        outline: ["대상 맞춤", "생활·예방", "모듈 조합", "개요 회신"],
      });
    }
    if (institution.includes("공공") || institution.includes("지자체")) {
      topics.push({
        title: "공공기관 법률교육",
        href: "/공공기관법률교육",
        outline: ["임직원 실무", "계약·정보", "법정교육 제외"],
      });
    }

    const unique = topics.filter(
      (item, index, arr) =>
        arr.findIndex((other) => other.href === item.href) === index,
    ).slice(0, 3);

    if (unique.length === 0) {
      unique.push({
        title: "맞춤형 생활법률 특강",
        href: "/법률강의",
        outline: ["목적 확인", "핵심 모듈", "사례", "질답"],
      });
    }

    return {
      topics: unique,
      format: interactive
        ? `${minutes}분 · 사례·체크리스트 비중을 높인 참여형`
        : `${minutes}분 · 핵심 강의+질의응답`,
      note: "법률 판단이 아닌 교육 기획 추천입니다. 법정의무교육은 포함하지 않습니다.",
    };
  }, [institution, audience, purpose, minutes, interactive]);

  return (
    <div className="rounded-2xl border border-beige-dark bg-white/70 p-5 md:p-6">
      <h2 className="text-lg font-semibold text-navy">강의 주제 추천기</h2>
      <p className="mt-2 text-sm text-navy/70">
        기관 유형과 목적에 맞는 주제 후보를 제안합니다. 법률 자문이 아닙니다.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-medium text-navy">
          기관 유형
          <select
            className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          >
            {[
              "청년기관",
              "학교",
              "공공기관",
              "창업지원기관",
              "기업",
              "협회·단체",
              "복지기관",
              "도서관",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-navy">
          교육 대상
          <select
            className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            {["청년", "학생", "임직원", "시민", "예비창업자"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-navy">
          교육 목적
          <select
            className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            {[
              "예방교육",
              "전세·주거",
              "생활법률",
              "창업",
              "디지털·온라인",
              "진로",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-navy">
          강의 시간
          <select
            className="mt-2 w-full rounded-lg border border-navy/15 px-3 py-2.5 text-sm"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          >
            {["60", "90", "120", "180"].map((item) => (
              <option key={item} value={item}>
                {item}분
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-3 flex items-center gap-2 text-sm text-navy">
        <input
          type="checkbox"
          checked={interactive}
          onChange={(e) => setInteractive(e.target.checked)}
        />
        참여형·토론을 선호합니다
      </label>

      <div className="mt-5 space-y-3">
        <p className="text-sm font-semibold text-navy">추천 결과</p>
        <p className="text-sm text-navy/75">{result.format}</p>
        <ul className="space-y-3">
          {result.topics.map((topic) => (
            <li
              key={topic.href}
              className="rounded-xl border border-navy/10 bg-cream/60 p-3"
            >
              <Link
                href={topic.href}
                className="font-semibold text-navy underline-offset-2 hover:underline"
              >
                {topic.title}
              </Link>
              <p className="mt-1 text-xs text-navy/65">
                추천 목차: {topic.outline.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-navy/55">{result.note}</p>
        <Link href="/강의문의" className="btn-primary inline-flex">
          추천 주제로 문의하기
        </Link>
      </div>
    </div>
  );
}
