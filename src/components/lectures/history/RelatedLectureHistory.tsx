import Link from "next/link";
import type { LectureHistoryEntry } from "@/lib/lectures/types";
import { LectureHistoryGrid } from "./LectureHistoryGrid";

type RelatedLectureHistoryProps = {
  items: LectureHistoryEntry[];
  title?: string;
  description?: string;
  moreHref?: string;
};

export function RelatedLectureHistory({
  items,
  title = "관련 주제로 진행한 실제 강의",
  description = "이 주제와 연결된 확인된 출강 이력입니다.",
  moreHref = "/강의이력",
}: RelatedLectureHistoryProps) {
  if (items.length === 0) {
    return (
      <section
        id="related-history"
        className="rounded-2xl border border-beige-dark bg-cream/30 p-5"
      >
        <h2 className="text-lg font-semibold text-navy">{title}</h2>
        <p className="mt-2 text-sm text-navy/70">
          기관의 교육 목적과 대상에 맞춰 커리큘럼을 협의합니다.
        </p>
        <Link
          href="/강의문의"
          className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-navy px-4 text-sm font-medium text-white no-underline hover:bg-navy-light"
        >
          강의 문의하기
        </Link>
      </section>
    );
  }

  return (
    <section id="related-history" className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-navy md:text-xl">{title}</h2>
        <p className="mt-1 text-sm text-navy/70">{description}</p>
      </div>
      <LectureHistoryGrid items={items} compact />
      <p>
        <Link
          href={moreHref}
          className="text-sm font-medium text-navy underline-offset-2 hover:underline"
        >
          전체 강의 이력 보기
        </Link>
      </p>
    </section>
  );
}
