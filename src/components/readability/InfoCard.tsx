import type { ReactNode } from "react";

type InfoCardProps = {
  title?: string;
  children: ReactNode;
  variant?: "default" | "highlight" | "plain";
};

export function InfoCard({
  title,
  children,
  variant = "default",
}: InfoCardProps) {
  const className =
    variant === "highlight"
      ? "readability-info-card readability-info-card--highlight"
      : variant === "plain"
        ? "readability-info-card readability-info-card--plain"
        : "readability-info-card";

  return (
    <div className={className}>
      {title ? <h3 className="readability-info-card__title">{title}</h3> : null}
      <div className={title ? "mt-3" : ""}>{children}</div>
    </div>
  );
}
