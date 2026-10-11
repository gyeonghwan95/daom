"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { normalizeNavPath } from "@/lib/navigation";

const LINKS = [
  { href: "/about", label: "법무사 소개" },
  { href: "/강사소개", label: "강사 소개" },
  { href: "/법률강의", label: "강의·특강" },
  { href: "/강의이력", label: "강의 이력" },
  { href: "/media", label: "언론·활동" },
  { href: "/reviews", label: "고객 후기" },
  { href: "/office", label: "사무소" },
] as const;

/**
 * 법무사를 소개하는 페이지들을 한 줄로 잇는 메뉴 — 어느 페이지로 들어와도 나머지를 놓치지 않게 한다.
 */
export function LawyerProfileNav({ className = "" }: { className?: string }) {
  const current = normalizeNavPath(usePathname() ?? "/");
  return (
    <nav aria-label="안윤정 법무사 더 알아보기" className={`print:hidden ${className}`.trim()}>
      <ul className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {LINKS.map((l) => {
          const active = current === l.href;
          return (
            <li key={l.href} className="shrink-0">
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm font-semibold no-underline transition ${
                  active ? "border-navy bg-navy text-white" : "border-beige-dark bg-white text-navy hover:border-navy/30"
                }`}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
