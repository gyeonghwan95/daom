import Link from "next/link";
import type { B2BSection } from "@/lib/b2b/types";

export function B2BSections({ sections }: { sections: B2BSection[] }) {
  return (
    <div className="space-y-8 md:space-y-10">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-[calc(var(--header-height)+1rem)]"
        >
          <h2 className="section-heading">{section.title}</h2>
          {section.kind === "prose" ? (
            <div className="mt-3 max-w-3xl space-y-3">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="body-text text-navy/80">
                  {p}
                </p>
              ))}
            </div>
          ) : null}
          {section.kind === "bullets" ? (
            <>
              <ul className="body-text mt-3 max-w-3xl list-disc space-y-2 pl-5 text-navy/80">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {section.note ? (
                <p className="mt-3 max-w-3xl text-sm text-navy/60">{section.note}</p>
              ) : null}
            </>
          ) : null}
          {section.kind === "cards" ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {section.cards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-beige-dark bg-white p-4"
                >
                  <h3 className="text-base font-semibold text-navy">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy/75">
                    {card.body}
                  </p>
                  {card.href ? (
                    <Link
                      href={card.href}
                      className="mt-3 inline-flex text-sm font-medium text-navy-light underline"
                    >
                      자세히 보기
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {section.kind === "steps" ? (
            <ol className="mt-4 space-y-3">
              {section.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="rounded-xl border border-beige-dark bg-beige/20 px-4 py-3"
                >
                  <p className="text-sm font-semibold text-navy">
                    {index + 1}. {step.title}
                  </p>
                  <p className="mt-1 text-sm text-navy/75">{step.body}</p>
                </li>
              ))}
            </ol>
          ) : null}
          {section.kind === "table" ? (
            <>
              <div className="mt-4 overflow-x-auto rounded-xl border border-beige-dark">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-beige/60">
                    <tr>
                      {section.headers.map((h) => (
                        <th key={h} className="px-4 py-3 font-semibold text-navy">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige-dark bg-white">
                    {section.rows.map((row) => (
                      <tr key={row.join("|")}>
                        {row.map((cell, i) => (
                          <td
                            key={`${row[0]}-${i}`}
                            className="px-4 py-3 align-top text-navy/80"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {section.note ? (
                <p className="mt-2 text-sm text-navy/60">{section.note}</p>
              ) : null}
            </>
          ) : null}
          {section.kind === "example" ? (
            <div className="mt-3 rounded-xl border border-dashed border-navy/25 bg-beige/20 p-4">
              <p className="text-xs font-medium text-navy/60">{section.disclaimer}</p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-navy/80">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
