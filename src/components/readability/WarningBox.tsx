import type { ReactNode } from "react";

type WarningBoxProps = {
  children: ReactNode;
  title?: string;
};

export function WarningBox({
  children,
  title = "참고 안내",
}: WarningBoxProps) {
  return (
    <div className="readability-warning" role="note">
      <p className="readability-warning__title">{title}</p>
      <div className="readability-warning__body">{children}</div>
    </div>
  );
}
