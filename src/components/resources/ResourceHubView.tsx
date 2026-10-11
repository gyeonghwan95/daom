import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  RESOURCE_CATEGORY_LABEL,
  RESOURCE_GUIDES,
  RESOURCE_VERIFIED_ON,
  resourcePath,
} from "@/data/resources/guides";
import type { ResourceCategory, ResourceGuide } from "@/data/resources/types";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";

const ORDER: ResourceCategory[] = ["inheritance", "corporate", "receivable", "real-estate"];

export function ResourceCard({ guide, compact = false }: { guide: ResourceGuide; compact?: boolean }) {
  return (
    <Link
      href={resourcePath(guide.slug)}
      className="group flex h-full flex-col rounded-2xl border border-beige-dark bg-white p-4 no-underline transition hover:border-navy/30 hover:shadow-sm md:p-5"
      data-resource-card={guide.slug}
    >
      <span className="text-xs font-bold text-navy-light">{RESOURCE_CATEGORY_LABEL[guide.category]}</span>
      <span className="mt-1.5 text-base font-bold leading-snug text-navy md:text-[1.05rem]">{guide.h1}</span>
      {compact ? null : (
        <span className="mt-2 text-sm leading-relaxed text-navy/75">
          <span className="font-semibold text-navy/85">이런 상황에 읽으세요 · </span>
          {guide.readWhen}
        </span>
      )}
      <span className="mt-auto flex flex-wrap gap-1.5 pt-3 text-xs font-semibold text-navy/70">
        <span className="rounded-full bg-cream px-2 py-0.5">가족·담당자와 공유</span>
        <span className="rounded-full bg-cream px-2 py-0.5">PNG·PDF</span>
      </span>
    </Link>
  );
}

export function ResourceHubView() {
  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: "의뢰 전 준비자료", href: "/resources" },
  ];
  return (
    <div className="mx-auto max-w-5xl break-keep">
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, "/resources")} />
      <Breadcrumb items={breadcrumbs} />
      <div className="max-w-3xl">
        <h1 className="text-[1.6rem] font-bold leading-snug tracking-tight text-navy md:text-[2rem]">
          의뢰 전 준비자료 — 가족·회사 담당자와 함께 확인하세요
        </h1>
        <p className="body-text mt-4">
          실제 사건을 앞두고 무엇부터 확인할지, 혼자 판단하기 어려운 조건은 무엇인지, 법무사에게 맡기면 어떤 일을 하는지,
          처음 문의할 때 무엇을 알려주면 되는지를 정리했습니다. 직접 신청하는 방법 안내나 서식 모음이 아니라, 의뢰 전에
          상황과 가지고 있는 자료를 정리하는 자료입니다.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-navy/65">
          자료마다 빈 정리표와 한 장 이미지(PNG)·A4 PDF가 있어 가족 단체방이나 회사 담당자에게 그대로 보낼 수 있습니다.
          연락처나 가입 없이 볼 수 있고, 체크 표시는 저장되지 않습니다. 근거 확인일 {RESOURCE_VERIFIED_ON}.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {ORDER.map((cat) => {
          const guides = RESOURCE_GUIDES.filter((g) => g.category === cat);
          if (!guides.length) return null;
          return (
            <section key={cat} aria-labelledby={`res-${cat}`}>
              <h2 id={`res-${cat}`} className="section-heading">
                {RESOURCE_CATEGORY_LABEL[cat]}
              </h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <ResourceCard guide={g} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
