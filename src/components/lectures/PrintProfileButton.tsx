"use client";

export function PrintProfileButton() {
  return (
    <button
      type="button"
      className="btn-secondary print:hidden"
      onClick={() => window.print()}
    >
      강사 프로필 인쇄
    </button>
  );
}
