import Link from "next/link";
import { getRecentLectureHistory } from "@/data/lectures/history";
import { LectureHistoryGrid } from "@/components/lectures/history/LectureHistoryGrid";
import { Container } from "@/components/layout/Container";
import { HomeSectionHeader } from "@/components/home/HomeSectionHeader";

export function HomeLectureHistorySection() {
  const recent = getRecentLectureHistory(3);
  if (recent.length === 0) return null;

  return (
    <section
      id="home-lecture-history"
      className="relative w-full border-t border-beige-dark bg-white py-14 md:py-20"
    >
      <Container>
        <HomeSectionHeader
          label="Lecture track record"
          title="현장에서 이어가는 생활법률 교육"
          description="확인된 기관·일정·사진을 바탕으로 최근 강의 이력을 안내합니다."
        />
        <div className="mt-8">
          <LectureHistoryGrid items={recent} compact />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/강의이력"
            className="inline-flex min-h-11 items-center rounded-lg bg-navy px-4 text-sm font-medium text-white no-underline hover:bg-navy-light"
          >
            전체 강의 이력
          </Link>
          <Link
            href="/강사소개"
            className="inline-flex min-h-11 items-center rounded-lg border border-beige-dark px-4 text-sm font-medium text-navy no-underline hover:bg-beige"
          >
            강사 소개
          </Link>
          <Link
            href="/강의문의"
            className="inline-flex min-h-11 items-center rounded-lg border border-beige-dark px-4 text-sm font-medium text-navy no-underline hover:bg-beige"
          >
            강의 문의
          </Link>
        </div>
      </Container>
    </section>
  );
}
