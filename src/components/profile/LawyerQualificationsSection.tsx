import { SiteImage } from "@/components/media/SiteImage";
import {
  lawyerQualificationItems,
  type LawyerQualificationCategory,
} from "@/lib/lawyer-activities";
import type { SiteImageAsset } from "@/lib/site-images";

const categoryLabels: Record<LawyerQualificationCategory, string> = {
  license: "국가자격",
  education: "학력·교육",
  award: "수상",
};

type LawyerQualificationsSectionProps = {
  profileImage: SiteImageAsset;
};

function QualificationBadge({
  title,
  detail,
  category,
}: {
  title: string;
  detail?: string;
  category: LawyerQualificationCategory;
}) {
  const isAward = category === "award";

  return (
    <div
      className={
        isAward
          ? "relative overflow-hidden rounded-xl border border-amber-200/90 bg-gradient-to-br from-amber-50 via-white to-beige/60 p-4 shadow-sm shadow-amber-900/5 md:p-5"
          : category === "education"
            ? "rounded-xl border border-navy/10 bg-gradient-to-br from-white to-beige/40 p-4 md:p-5"
            : "rounded-xl border border-beige-dark bg-white p-4 text-center shadow-sm shadow-navy/5 transition-shadow hover:shadow-md hover:shadow-navy/8 md:p-5"
      }
    >
      {isAward ? (
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-200/30 blur-2xl"
          aria-hidden
        />
      ) : null}
      <p
        className={
          isAward
            ? "text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800/80"
            : "text-[11px] font-semibold uppercase tracking-[0.14em] text-navy-light/80"
        }
      >
        {categoryLabels[category]}
      </p>
      <p
        className={
          isAward
            ? "mt-2 text-base font-bold leading-snug text-navy md:text-lg"
            : category === "education"
              ? "mt-2 text-base font-bold text-navy md:text-lg"
              : "mt-2 text-sm font-bold text-navy md:text-base"
        }
      >
        {title}
      </p>
      {detail ? (
        <p
          className={
            isAward
              ? "mt-1.5 text-sm font-medium text-amber-900/75"
              : "mt-1.5 text-sm text-navy/65"
          }
        >
          {detail}
        </p>
      ) : null}
    </div>
  );
}

export function LawyerQualificationsSection({
  profileImage,
}: LawyerQualificationsSectionProps) {
  const licenses = lawyerQualificationItems.filter(
    (item) => item.category === "license",
  );
  const education = lawyerQualificationItems.find(
    (item) => item.category === "education",
  );
  const awards = lawyerQualificationItems.filter(
    (item) => item.category === "award",
  );

  return (
    <section
      id="qualifications"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface overflow-hidden p-0 md:grid md:grid-cols-5"
    >
      <div className="relative aspect-[4/5] md:col-span-2 md:aspect-auto md:min-h-full">
        <SiteImage
          {...profileImage}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          priority
          className="h-full w-full"
        />
      </div>
      <div className="p-5 md:col-span-3 md:p-8">
        <h2 className="section-heading">주요 경력 및 자격</h2>
        <p className="mt-3 text-sm leading-relaxed text-navy/70 md:text-base">
          법무 실무와 교육, 지역사회 활동을 아우르는 다중 자격과 수상 이력을
          보유하고 있습니다.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {licenses.map((item) => (
            <QualificationBadge key={item.title} {...item} />
          ))}
        </div>

        {education ? (
          <div className="mt-3">
            <QualificationBadge {...education} />
          </div>
        ) : null}

        {awards.length > 0 ? (
          <div className="mt-3 space-y-3">
            {awards.map((item) => (
              <QualificationBadge key={item.title} {...item} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
