"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isAdminPath } from "@/components/layout/PublicOnly";
import { isSectionNavExcluded } from "@/lib/section-nav/get-sections-for-path";
import { getInflowItemsForPath } from "@/lib/seo/inflow-policy";

/**
 * 검색 유입 후 이탈을 사이트 안 대표 URL로 붙잡는 레일.
 * 새 페이지를 만들지 않고, 이미 있는 안내만 혼합 앵커로 연결합니다.
 * 폭은 푸터가 아니라 본문(.content-stack)과 맞춥니다.
 * 검색어 문구는 화면에 내지 않습니다. 이미 색인된 본문·제목을 바꾸지 않기 위함입니다.
 */
export function InflowIntentRail() {
  const pathname = usePathname();
  if (isAdminPath(pathname)) return null;

  const items = getInflowItemsForPath(pathname ?? "/");
  if (items.length === 0) return null;

  const excludeNav = isSectionNavExcluded(pathname ?? "/");

  const rail = (
    <aside
      className="mx-auto w-full max-w-[var(--content-measure)] border-t border-beige-dark bg-beige/35 py-10 md:py-12"
      aria-labelledby="inflow-intent-heading"
    >
      <h2
        id="inflow-intent-heading"
        className="text-lg font-semibold text-navy sm:text-xl"
      >
        이어서 확인하면 좋은 안내
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
        같은 업무라도 절차가 다를 수 있습니다. 아래는 이미 있는 페이지로만
        연결합니다.
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="readability-link-card rounded-lg border border-beige-dark bg-white px-4"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-navy">
                  {item.label}
                </span>
                <span className="readability-link-card__meta">
                  {item.reason}
                </span>
              </span>
              <span className="readability-link-card__arrow" aria-hidden>
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 md:px-6 xl:max-w-[1440px] xl:px-8">
      {excludeNav ? (
        rail
      ) : (
        <div className="lg:grid lg:grid-cols-[11.5rem_minmax(0,1fr)] xl:grid-cols-[12.5rem_minmax(0,1fr)] lg:gap-8 xl:gap-10">
          <div className="hidden lg:block" aria-hidden />
          <div className="min-w-0">{rail}</div>
        </div>
      )}
    </div>
  );
}
