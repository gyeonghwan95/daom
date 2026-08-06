import Link from "next/link";
import {
  getLawyerAppointments,
  getLawyerQualifications,
  lawyerProfileMeta,
} from "@/lib/lawyer-profile";
import { PrintProfileButton } from "@/components/lectures/PrintProfileButton";

type SpeakerProfileProps = {
  showPrint?: boolean;
  compact?: boolean;
  /** 페이지별 강조 문구 — 확인된 사실만 */
  focusNote?: string;
};

/**
 * 기관 담당자용 강사 프로필 요약.
 * 프로젝트에서 확인된 자격·위촉·출강 범위만 표시합니다.
 */
export function SpeakerProfile({
  showPrint = true,
  compact = false,
  focusNote,
}: SpeakerProfileProps) {
  const qualifications = getLawyerQualifications().slice(0, compact ? 4 : 8);
  const appointments = getLawyerAppointments().slice(0, 3);

  return (
    <section
      className="lecture-speaker-profile space-y-5 rounded-2xl border border-navy/10 bg-cream/40 p-5 md:p-6"
      aria-labelledby="speaker-profile-heading"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-navy/60">{lawyerProfileMeta.organization}</p>
          <h3
            id="speaker-profile-heading"
            className="text-xl font-bold text-navy md:text-2xl"
          >
            {lawyerProfileMeta.fullTitle}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy/75 md:text-base">
            안윤정 법무사는 등기·상속·기업 법률 실무를 수행하면서 청년, 시민,
            창업자, 공공기관 및 현장 종사자를 대상으로 생활에서 바로 활용할 수
            있는 사례 중심 교육을 진행하고 있습니다.
          </p>
          {focusNote ? (
            <p className="mt-2 text-sm leading-relaxed text-navy/70">
              {focusNote}
            </p>
          ) : null}
        </div>
        {showPrint ? <PrintProfileButton /> : null}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-beige-dark bg-white px-4 py-3">
          <dt className="text-xs font-semibold tracking-wide text-navy/55">
            출강지역
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy">
            부산 중심 · 인근·온라인 협의
          </dd>
        </div>
        <div className="rounded-xl border border-beige-dark bg-white px-4 py-3">
          <dt className="text-xs font-semibold tracking-wide text-navy/55">
            주요 대상
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy">
            청년 · 시민 · 창업자 · 종사자 · 임직원
          </dd>
        </div>
        <div className="rounded-xl border border-beige-dark bg-white px-4 py-3">
          <dt className="text-xs font-semibold tracking-wide text-navy/55">
            기본 강의시간
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy">
            60분 · 90~120분 · 3~4시간(협의)
          </dd>
        </div>
        <div className="rounded-xl border border-beige-dark bg-white px-4 py-3">
          <dt className="text-xs font-semibold tracking-wide text-navy/55">
            온라인
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy">협의 가능</dd>
        </div>
        <div className="rounded-xl border border-beige-dark bg-white px-4 py-3">
          <dt className="text-xs font-semibold tracking-wide text-navy/55">
            프로필·계획서
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy">요청 시 제공</dd>
        </div>
        <div className="rounded-xl border border-beige-dark bg-white px-4 py-3">
          <dt className="text-xs font-semibold tracking-wide text-navy/55">
            일정 문의
          </dt>
          <dd className="mt-1 text-sm font-medium text-navy">
            <Link
              href="/강의문의"
              className="underline-offset-2 hover:underline"
            >
              강의문의로 희망일 확인
            </Link>
          </dd>
        </div>
      </dl>

      {!compact ? (
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-navy">주요 자격</p>
            <ul className="mt-2 space-y-1.5 text-sm text-navy/75">
              {qualifications.map((item) => (
                <li key={item.name}>· {item.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">확인된 위촉·자문(일부)</p>
            <ul className="mt-2 space-y-1.5 text-sm text-navy/75">
              {appointments.map((item) => (
                <li key={item.title}>
                  · {item.title}
                  {item.organization ? ` · ${item.organization}` : ""}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-navy/60">
              상세 이력은{" "}
              <Link
                href="/강의이력"
                className="font-medium text-navy underline-offset-2 hover:underline"
              >
                강의 이력
              </Link>
              ·{" "}
              <Link
                href="/강사소개"
                className="font-medium text-navy underline-offset-2 hover:underline"
              >
                강사 소개
              </Link>
              에서 확인하세요.
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
