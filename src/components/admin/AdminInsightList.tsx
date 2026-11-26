import Link from "next/link";
import type { OpsInsight } from "@/lib/admin/ops-insights";

type InsightItem = Pick<OpsInsight, "id" | "level" | "title" | "detail" | "href">;

export function AdminInsightList({
  insights,
  empty = "지금 긴급히 확인할 운영 이슈는 없습니다.",
  onNavigate,
}: {
  insights: InsightItem[];
  empty?: string;
  /** 같은 관리자 화면 안에서 쿼리만 바꿀 때 (전체 페이지 이동 대신) */
  onNavigate?: (href: string) => void;
}) {
  if (!insights.length) {
    return <p className="admin-empty">{empty}</p>;
  }
  return (
    <ul className="admin-insights">
      {insights.map((item) => (
        <li
          key={item.id}
          className={`admin-insight admin-insight--${item.level}`}
        >
          <strong>{item.title}</strong>
          <p>{item.detail}</p>
          {item.href ? (
            onNavigate ? (
              <button
                type="button"
                className="admin-insight__link"
                onClick={() => onNavigate(item.href!)}
              >
                해당 표에서 보기
              </button>
            ) : (
              <Link href={item.href} className="admin-insight__link">
                해당 화면 보기
              </Link>
            )
          ) : null}
        </li>
      ))}
    </ul>
  );
}
