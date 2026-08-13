import Link from "next/link";

/** 법률용어 — 전국 수임·비용 문의 안내 (게시글 본문, 버튼 CTA 없음) */
export function GlossaryNationwideNotice({ termLabel }: { termLabel: string }) {
  return (
    <aside className="glossary-nationwide-notice mt-8 border-t border-beige-dark pt-6">
      <h3 className="text-base font-bold text-[var(--text-primary)] md:text-lg">
        지역과 관계없이 상담·수임이 가능합니다
      </h3>
      <p className="body-text mt-3">
        {termLabel}과(와) 연결된 등기·절차 업무는 부동산이나 관할이 전국 어디에
        있더라도 비대면 자료 검토와 위임을 통해 진행할 수 있는 경우가 많습니다.
        다옴법무사사무소(부산 해운대·센텀)는 사건의 관할·서류 난이도·긴급
        여부에 따라 수임료가 달라지므로, 절차를 시작하기 전에{" "}
        <strong className="font-semibold text-[var(--text-primary)]">
          비용과 일정을 먼저 확인
        </strong>
        하시는 것을 권합니다.{" "}
        <Link href="/contact" className="font-semibold text-navy-light underline-offset-2 hover:underline">
          연락처·상담 안내
        </Link>
        에서 확인하실 수 있습니다.
      </p>
    </aside>
  );
}
