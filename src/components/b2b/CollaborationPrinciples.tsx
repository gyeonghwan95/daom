import type { PrincipleItem, ProcessStep } from "@/lib/b2b/types";

export function CollaborationPrinciples({
  items,
}: {
  items: readonly PrincipleItem[] | PrincipleItem[];
}) {
  return (
    <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.title}
          className="rounded-xl border border-beige-dark bg-white px-4 py-4"
        >
          <h3 className="text-sm font-semibold text-navy md:text-base">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-navy/75">
            {item.description}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function ProjectProcessTimeline({
  steps,
  note = "일반적인 협의 흐름이며, 사건마다 달라질 수 있습니다.",
}: {
  steps: readonly ProcessStep[] | ProcessStep[];
  note?: string;
}) {
  return (
    <div>
      <ol className="space-y-3">
        {steps.map((step) => (
          <li
            key={step.step}
            className="flex gap-3 rounded-xl border border-beige-dark bg-beige/20 px-4 py-3 md:gap-4"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
              aria-hidden
            >
              {step.step}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-navy md:text-base">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-navy/75">
                {step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-navy/55">{note}</p>
    </div>
  );
}
