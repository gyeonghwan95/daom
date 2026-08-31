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
          title="강의·특강"
          description="공공기관·도서관·청년기관·학교 대상 생활법률·전세사기·창업법률 교육. 확인된 최근 이력입니다."
        />
        <div className="mt-8">
          <LectureHistoryGrid items={recent} compact />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/강의이력"
            className="inline-flex min-h-11 items-center rounded-lg bg-navy px-4 text-sm font-medium text-white no-underline hover:bg-navy-light"
          >
            강의 이력 보기
          </Link>
          <Link
            href="/법률강의"
            className="inline-flex min-h-11 items-center rounded-lg border border-beige-dark px-4 text-sm font-medium text-navy no-underline hover:bg-beige"
          >
            강의 안내
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
