import type { ReactNode } from "react";

type SectionAnchorProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function SectionAnchor({ id, children, className = "" }: SectionAnchorProps) {
  return (
    <section id={id} className={`section-anchor scroll-mt-[calc(var(--header-height)+1rem)] ${className}`.trim()}>
      {children}
    </section>
  );
}
