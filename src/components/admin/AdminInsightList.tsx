import Link from "next/link";
import type { OpsInsight } from "@/lib/admin/ops-insights";

export function AdminInsightList({
  insights,
  empty = "지금 긴급히 확인할 운영 이슈는 없습니다.",
}: {
  insights: OpsInsight[];
  empty?: string;
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
            <Link href={item.href} className="admin-insight__link">
              해당 화면 보기
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
