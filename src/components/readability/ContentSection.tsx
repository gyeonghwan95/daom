import type { ReactNode } from "react";

type ContentSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function ContentSection({
  id,
  title,
  children,
  className = "",
}: ContentSectionProps) {
  return (
    <section
      id={id}
      className={`readability-section section-anchor scroll-mt-[calc(var(--header-height)+1rem)] ${className}`.trim()}
    >
      <h2 className="section-heading">{title}</h2>
      <div className="readability-section__body mt-4 md:mt-5">{children}</div>
    </section>
  );
}
