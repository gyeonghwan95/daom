import Image from "next/image";
import Link from "next/link";
import type { LectureHistoryEntry } from "@/lib/lectures/types";
import {
  LECTURE_FORMAT_KIND_LABELS,
  LECTURE_INSTITUTION_TYPE_LABELS,
} from "@/lib/lectures/types";
import {
  getLectureHistoryAudienceLabel,
  getLectureHistoryDisplayDate,
  getLectureHistoryPrimaryImage,
  normalizeInstitutionType,
} from "@/lib/lectures/history-helpers";
import {
  getLawyerAwards,
  getLawyerQualifications,
  lawyerProfileMeta,
} from "@/lib/lawyer-profile";
import { getLecturePageLabel } from "@/lib/lectures/shared";

type LectureHistoryDetailViewProps = {
  entry: LectureHistoryEntry;
};

export function LectureHistoryDetailView({
  entry,
}: LectureHistoryDetailViewProps) {
  const image = getLectureHistoryPrimaryImage(entry);
  const qualifications = getLawyerQualifications().slice(0, 5);
  const awards = getLawyerAwards().slice(0, 2);
  const typeLabel =
    LECTURE_INSTITUTION_TYPE_LABELS[
      normalizeInstitutionType(entry.institutionType)
    ];

  return (
    <div className="space-y-10 md:space-y-12">
      <header className="space-y-3">
        <p className="text-sm text-navy/60">
          {typeLabel} · {entry.city}
          {entry.district ? ` · ${entry.district}` : ""}
        </p>
        <p className="text-base font-medium text-navy/80">{entry.institution}</p>
        <h1 className="page-title">{entry.title}</h1>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem
            label="강의일"
            value={getLectureHistoryDisplayDate(entry)}
          />
          <DetailItem
            label="교육 대상"
            value={getLectureHistoryAudienceLabel(entry)}
          />
          <DetailItem
            label="진행 형식"
            value={
              entry.formatKind
                ? `${LECTURE_FORMAT_KIND_LABELS[entry.formatKind]} · ${entry.format}`
                : entry.format
            }
          />
          <DetailItem
            label="강의 시간"
            value={entry.durationLabel ?? "시간 협의"}
          />
        </dl>
      </header>

      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-beige-dark bg-beige">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width:1280px) 100vw, 960px"
            priority
          />
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 className="section-heading">강의 소개</h2>
        <p className="body-text">{entry.summary}</p>
      </section>

      {entry.objectives?.length ? (
        <section className="space-y-3">
          <h2 className="section-heading">강의 목적</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-navy/75 md:text-base">
            {entry.objectives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry.curriculum?.length ? (
        <section className="space-y-3">
          <h2 className="section-heading">주요 교육 내용</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-navy/75 md:text-base">
            {entry.curriculum.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry.highlights?.length ? (
        <section className="space-y-3">
          <h2 className="section-heading">진행 구성 하이라이트</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-navy/75 md:text-base">
            {entry.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="section-heading">주요 주제</h2>
        <ul className="flex flex-wrap gap-2">
          {entry.topics.map((topic) => (
            <li
              key={topic}
              className="rounded-lg border border-beige-dark bg-cream px-3 py-1.5 text-sm text-navy"
            >
              {topic}
            </li>
          ))}
        </ul>
      </section>

      {entry.images && entry.images.length > 1 ? (
        <section className="space-y-3">
          <h2 className="section-heading">현장 사진</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {entry.images.map((photo) => (
              <li
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden rounded-xl border border-beige-dark bg-beige"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 40vw"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {entry.relatedLecturePages?.length ? (
        <section className="space-y-3">
          <h2 className="section-heading">관련 강의 주제</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {entry.relatedLecturePages.map((href) => (
              <li key={href}>
                <Link href={href} className="readability-link-card">
                  <span>{getLecturePageLabel(href)}</span>
                  <span className="readability-link-card__arrow" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-3 rounded-2xl border border-beige-dark bg-cream/40 p-5">
        <h2 className="text-lg font-semibold text-navy">강사 소개</h2>
        <p className="text-sm text-navy/70">
          {lawyerProfileMeta.fullTitle} · {lawyerProfileMeta.officeArea}
        </p>
        <p className="text-sm text-navy/75">
          법률 용어를 나열하기보다, 실제 생활에서 어떤 부분을 확인하고 어떻게
          예방할 수 있는지 사례 중심으로 설명합니다.
        </p>
        <ul className="list-disc pl-5 text-sm text-navy/75">
          {qualifications.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
          {awards.map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
        <Link
          href="/강사소개"
          className="inline-flex text-sm font-medium text-navy underline-offset-2 hover:underline"
        >
          강사 소개 자세히 보기
        </Link>
      </section>

      {entry.blogUrl ? (
        <section className="space-y-2">
          <h2 className="section-heading">네이버 블로그 원문</h2>
          <p className="text-sm text-navy/70">
            홈페이지에는 확인된 사실만 정리하며, 블로그 제목·본문은 복제하지
            않습니다.
          </p>
          <a
            href={entry.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-lg border border-beige-dark px-4 text-sm font-medium text-navy no-underline hover:bg-beige"
          >
            네이버 블로그 원문 보기
            <span className="sr-only"> (새 창)</span>
          </a>
        </section>
      ) : null}

      <section className="rounded-2xl bg-navy p-5 text-white md:p-8">
        <h2 className="text-lg font-semibold md:text-xl">
          비슷한 대상과 주제로 강의를 준비하고 계신가요?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/85 md:text-base">
          기관 유형, 교육 대상, 희망 주제와 시간을 알려주시면 실제 진행 이력을
          바탕으로 강의 구성을 협의할 수 있습니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/강의문의"
            className="inline-flex min-h-11 items-center rounded-lg bg-white px-4 text-sm font-semibold text-navy no-underline hover:bg-beige"
          >
            강의 문의하기
          </Link>
          <Link
            href="/법률강의"
            className="inline-flex min-h-11 items-center rounded-lg border border-white/40 px-4 text-sm font-medium text-white no-underline hover:bg-white/10"
          >
            주요 강의 주제 보기
          </Link>
          <Link
            href="/강사소개"
            className="inline-flex min-h-11 items-center rounded-lg border border-white/40 px-4 text-sm font-medium text-white no-underline hover:bg-white/10"
          >
            강사 소개 보기
          </Link>
        </div>
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-beige-dark bg-cream/40 px-3 py-3">
      <dt className="text-xs text-navy/55">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-navy">{value}</dd>
    </div>
  );
}
