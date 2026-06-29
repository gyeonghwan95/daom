import { TOOL_DISCLAIMER } from "@/lib/tools";

export function ToolDisclaimer() {
  return (
    <p
      className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3.5 text-sm leading-relaxed text-navy/75"
      role="note"
    >
      {TOOL_DISCLAIMER}
    </p>
  );
}
