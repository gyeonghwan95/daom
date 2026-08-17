import type { ReactNode } from "react";

type InfoCardProps = {
  title?: string;
  children: ReactNode;
  variant?: "default" | "highlight" | "plain";
  className?: string;
};

export function InfoCard({
  title,
  children,
  variant = "default",
  className = "",
}: InfoCardProps) {
  const variantClass =
    variant === "highlight"
      ? "readability-info-card readability-info-card--highlight"
      : variant === "plain"
        ? "readability-info-card readability-info-card--plain"
        : "readability-info-card";

  return (
    <div className={`${variantClass} ${className}`.trim()}>
      {title ? <h3 className="readability-info-card__title">{title}</h3> : null}
      <div
        className={`flex min-h-0 flex-1 flex-col ${title ? "mt-3" : ""}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}
