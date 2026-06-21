import Image from "next/image";
import { PaginatedRoleCardGrid } from "@/components/profile/PaginatedRoleCardGrid";
import type { ActivityRole, LawyerActivitySection } from "@/lib/lawyer-activities";

type ActivitySectionBlockProps = {
  section: LawyerActivitySection;
  variant?: "full" | "compact";
  imagePosition?: "left" | "right" | "top";
  paginated?: boolean;
};

function RoleCardList({ roles }: { roles: ActivityRole[] }) {
  return (
    <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <li
          key={`${role.title}-${role.period}`}
          className="overflow-hidden rounded-xl border border-beige-dark bg-white transition-shadow hover:shadow-md hover:shadow-navy/5"
        >
          {role.image ? (
            <div className="relative aspect-[16/10] overflow-hidden border-b border-beige-dark bg-beige/30">
              <Image
                src={role.image.src}
                alt={role.image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ) : null}
          <div className="p-4">
            <h3 className="text-sm font-semibold leading-snug text-navy md:text-base">
              {role.title}
            </h3>
            {role.subtitle ? (
              <p className="mt-1.5 text-xs leading-relaxed text-navy/65 md:text-sm">
                {role.subtitle}
              </p>
            ) : null}
            <p className="mt-1.5 text-xs text-navy/55 md:text-sm">{role.period}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function RoleTextList({ roles }: { roles: ActivityRole[] }) {
  return (
    <ul className="mt-5 divide-y divide-beige-dark rounded-xl border border-beige-dark bg-white">
      {roles.map((role) => (
        <li
          key={`${role.title}-${role.period}`}
          className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <span className="font-medium text-navy">{role.title}</span>
          <span className="shrink-0 text-sm text-navy/55">{role.period}</span>
        </li>
      ))}
    </ul>
  );
}

export function ActivitySectionBlock({
  section,
  variant = "full",
  imagePosition = "left",
  paginated = false,
}: ActivitySectionBlockProps) {
  const isCompact = variant === "compact";
  const rolesHaveImages = Boolean(
    section.roles?.length && section.roles.every((role) => role.image),
  );
  const showSideImage = !isCompact && !rolesHaveImages;
  const imageOnTop = imagePosition === "top" || isCompact;

  const imageBlock = (
    <div
      className={
        imageOnTop
          ? "overflow-hidden rounded-xl border border-beige-dark bg-white"
          : "relative min-h-[12rem] overflow-hidden rounded-xl border border-beige-dark bg-white sm:min-h-[14rem] lg:min-h-0 lg:h-full"
      }
    >
      <Image
        src={section.image.src}
        alt={section.image.alt}
        fill={!imageOnTop}
        width={imageOnTop ? section.image.width : undefined}
        height={imageOnTop ? section.image.height : undefined}
        className={
          imageOnTop
            ? "h-full w-full object-cover"
            : "object-cover"
        }
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

      {!isCompact && section.roles && rolesHaveImages && paginated && (
        <div className="mt-10 md:mt-12">
          <PaginatedRoleCardGrid roles={section.roles} />
        </div>
      )}

      {!isCompact && section.roles && rolesHaveImages && !paginated && (
        <RoleCardList roles={section.roles} />
      )}

      {!isCompact && section.roles && !rolesHaveImages && (
        <RoleTextList roles={section.roles} />
      )}
    </div>
  );

  if (imageOnTop) {
    return (
      <section
        id={section.id}
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <article className="card-surface flex h-full flex-col overflow-hidden p-0">
        {imageBlock}
        <div className="flex flex-1 flex-col p-5 md:p-6">{contentBlock}</div>
        </article>
      </section>
    );
  }

  if (!showSideImage) {
    return (
      <section
        id={section.id}
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <article className="card-surface overflow-hidden p-5 md:p-8">
          {contentBlock}
        </article>
      </section>
    );
  }

  return (
    <section
      id={section.id}
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
    >
      <article className="card-surface overflow-hidden p-5 md:p-8">
      <div
        className={`grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8 ${
          imagePosition === "right" ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        {imageBlock}
        {contentBlock}
      </div>
      </article>
    </section>
  );
}
