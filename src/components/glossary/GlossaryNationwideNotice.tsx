import Link from "next/link";
import { josa } from "@/lib/glossary/josa";

/** 법률용어 — 전국 수임 안내를 본문에 반복하지 않고, 필요 시에만 사용 */
export function GlossaryNationwideNotice({ termLabel }: { termLabel: string }) {
  return (
    <aside className="glossary-nationwide-notice mt-8 border-t border-beige-dark pt-6">
      <h3 className="text-base font-bold text-[var(--text-primary)] md:text-lg">
        관할이 다른 지역이어도 서류 검토가 가능한 경우가 있습니다
      </h3>
      <p className="body-text mt-3">
        {josa(termLabel, "과/와")} 연결된 등기·신청 업무는 부동산이나 법원 관할이 달라도
        자료 검토와 위임으로 진행할 수 있는 사건이 있습니다. 방문이 꼭 필요한지는 사건마다
        다릅니다. 비용과 일정은 사실관계를 확인한 뒤 안내합니다.{" "}
        <Link href="/contact" className="font-semibold text-navy-light underline-offset-2 hover:underline">
          연락처·상담 안내
        </Link>
      </p>
    </aside>
  );
}
