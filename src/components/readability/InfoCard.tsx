import type { ReactNode } from "react";

type InfoCardProps = {
  title?: string;
  children: ReactNode;
  variant?: "default" | "highlight";
};

export function InfoCard({
  title,
  children,
  variant = "default",
}: InfoCardProps) {
  return (
    <div
      className={
        variant === "highlight"
          ? "readability-info-card readability-info-card--highlight"
          : "readability-info-card"
      }
    >
      {title ? <h3 className="readability-info-card__title">{title}</h3> : null}
      <div className={title ? "mt-3" : ""}>{children}</div>
    </div>
  );
}
