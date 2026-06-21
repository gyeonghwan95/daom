import { PaginatedLectureGrid } from "@/components/profile/PaginatedLectureGrid";
import { lawyerLectures, lawyerLecturesIntro } from "@/lib/lawyer-lectures";

export function LecturesSection() {
  return (
    <section
      id="lectures"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface overflow-hidden p-5 md:p-8"
    >
      <h2 className="section-heading">{lawyerLecturesIntro.title}</h2>
      <p className="mt-3 text-base leading-relaxed text-navy/75">
        {lawyerLecturesIntro.subtitle}
      </p>
      <div className="mt-10 md:mt-12">
        <PaginatedLectureGrid lectures={lawyerLectures} />
      </div>
    </section>
  );
}
