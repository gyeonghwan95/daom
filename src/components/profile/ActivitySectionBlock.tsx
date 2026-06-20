import Image from "next/image";
import type { LawyerActivitySection } from "@/lib/lawyer-activities";

type ActivitySectionBlockProps = {
  section: LawyerActivitySection;
  variant?: "full" | "compact";
  imagePosition?: "left" | "right" | "top";
};

export function ActivitySectionBlock({
  section,
  variant = "full",
  imagePosition = "left",
}: ActivitySectionBlockProps) {
  const isCompact = variant === "compact";
  const imageOnTop = imagePosition === "top" || isCompact;

  const imageBlock = (
    <div
      className={
        imageOnTop
          ? "overflow-hidden rounded-xl border border-beige-dark bg-white"
          : "relative aspect-[4/3] overflow-hidden rounded-xl border border-beige-dark bg-white lg:aspect-auto lg:min-h-[280px]"
      }
    >
      <Image
        src={section.image.src}
        alt={section.image.alt}
        width={section.image.width}
        height={section.image.height}
        className="h-full w-full object-cover lg:absolute lg:inset-0"
        sizes={
          imageOnTop
            ? "(max-width: 768px) 100vw, 400px"
            : "(max-width: 1024px) 100vw, 480px"
        }
      />
    </div>
  );

  const contentBlock = (
    <div>
      <h2
        className={
          isCompact
            ? "text-lg font-bold text-navy md:text-xl"
            : "section-heading"
        }
      >
        {section.title}
      </h2>
      <p
        className={
          isCompact
            ? "mt-2 text-sm leading-relaxed text-navy/70"
            : "mt-3 text-base leading-relaxed text-navy/75"
        }
      >
        {isCompact ? section.homeSummary : section.subtitle}
      </p>

      {!isCompact && section.highlights && (
        <ul className="mt-5 space-y-4">
          {section.highlights.map((item) => (
            <li key={item.title}>
              <h3 className="font-semibold text-navy">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-navy/70 md:text-base">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!isCompact && section.roles && (
        <ul className="mt-5 divide-y divide-beige-dark rounded-xl border border-beige-dark bg-white">
          {section.roles.map((role) => (
            <li
              key={role.title}
              className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="font-medium text-navy">{role.title}</span>
              <span className="shrink-0 text-sm text-navy/55">{role.period}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  if (imageOnTop) {
    return (
      <article className="card-surface flex h-full flex-col overflow-hidden p-0">
        {imageBlock}
        <div className="flex flex-1 flex-col p-5 md:p-6">{contentBlock}</div>
      </article>
    );
  }

  return (
    <article className="card-surface overflow-hidden p-5 md:p-8">
      <div
        className={`grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8 ${
          imagePosition === "right" ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {imageBlock}
        {contentBlock}
      </div>
    </article>
  );
}
