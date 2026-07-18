import Link from "next/link";
import {
  CollaborationPrinciples,
  ProjectProcessTimeline,
} from "@/components/b2b/CollaborationPrinciples";
import { COLLABORATION_PRINCIPLES, PROJECT_PROCESS_STEPS } from "@/lib/b2b";

/** 기존 /부산집단등기 페이지에 삽입하는 B2B 프로젝트 안내 */
export function MassRegistryB2BAddon() {
  return (
    <div className="space-y-8 border-t border-beige-dark pt-8 md:space-y-10 md:pt-10">
      <section id="b2b-project" className="scroll-mt-[calc(var(--header-height)+1rem)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
          Business & Project Collaboration
        </p>
        <h2 className="section-heading mt-2">
          시행사·건설사·분양·기관 담당자를 위한 프로젝트 검토
        </h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          여러 건의 등기는 한 건의 등기와 다른 방식으로 준비해야 합니다. 먼저
          호실 수보다 권리 구조와 일정 구조를 확인하고, 보존·이전·근저당·말소
          연결 여부와 자료 목록 표준화를 검토합니다. 수행 가능 여부와 일정은
          자료를 확인한 뒤 안내합니다.
        </p>
      </section>

      <section id="project-checklist">
        <h2 className="section-heading">대량등기에서 먼저 확인할 내용</h2>
        <ul className="body-text mt-3 max-w-3xl list-disc space-y-2 pl-5 text-navy/80">
          <li>건물 유형과 일반·집합건물 여부</li>
          <li>보존·이전·설정·말소가 연결되는지</li>
          <li>예상 건수 구간과 단계별 일정</li>
          <li>등기 대상 목록·원본 서류 흐름 표준화 가능 여부</li>
          <li>담당 연락 창구를 한 명으로 둘 수 있는지</li>
          <li>완료 기준과 결과 전달 방식</li>
        </ul>
      </section>

      <section id="project-types">
        <h2 className="section-heading">대상 프로젝트 유형</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "오피스텔·빌라·상가 분양 관련 등기",
            "신축건물 보존등기 이후 이전·담보 연결",
            "여러 필지·동·호실의 소유권이전·보존·말소",
            "공공기관·산업단지·조합 관련 여러 건의 등기",
          ].map((title) => (
            <div
              key={title}
              className="rounded-xl border border-beige-dark bg-white p-4 text-sm text-navy/80"
            >
              {title}
            </div>
          ))}
        </div>
      </section>

      <section id="project-example">
        <h2 className="section-heading">프로젝트 검토 예시</h2>
        <div className="mt-3 rounded-xl border border-dashed border-navy/25 bg-beige/20 p-4">
          <p className="text-xs font-medium text-navy/60">
            이해를 돕기 위한 예시이며 실제 수임 사례가 아닙니다.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-navy/80">
            <li>예상 진행 흐름: 개요 확인 → 목록 표준화 → 일부 건 우선 검토 → 단계별 접수</li>
            <li>문의 시 확인하는 항목: 건수 구간, 권리구조, 사용승인·잔금 일정, 후속 등기</li>
            <li>가상의 업무 구성 예시: 보존 후 호실별 이전·근저당이 이어지는 구조</li>
          </ul>
        </div>
      </section>

      <section id="project-process">
        <h2 className="section-heading">일반적인 협의 흐름</h2>
        <div className="mt-4">
          <ProjectProcessTimeline steps={PROJECT_PROCESS_STEPS} />
        </div>
      </section>

      <section id="project-principles">
        <h2 className="section-heading">협업 원칙</h2>
        <div className="mt-4">
          <CollaborationPrinciples items={COLLABORATION_PRINCIPLES} />
        </div>
      </section>

      <section className="rounded-xl border border-beige-dark bg-beige/30 p-5 md:p-6">
        <h2 className="text-lg font-semibold text-navy">프로젝트 문의</h2>
        <p className="mt-2 text-sm text-navy/75">
          건물 유형과 호실 수를 확인한 뒤 업무 범위를 협의합니다. 구체적인
          견적은 자료 확인 후 안내합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/협업문의?partner=developer&service=bulk&type=project"
            className="btn-primary inline-flex min-h-12 items-center px-5"
          >
            프로젝트 개요 보내기
          </Link>
          <Link
            href="/partners"
            className="btn-secondary inline-flex min-h-12 items-center px-5"
          >
            협업 안내 보기
          </Link>
          <Link
            href="/부산신축건물보존등기"
            className="btn-secondary inline-flex min-h-12 items-center px-5"
          >
            신축건물 보존등기
          </Link>
        </div>
      </section>
    </div>
  );
}
