import Link from "next/link";

export function PublicAgencyB2BSections() {
  return (
    <div className="space-y-8 border-t border-beige-dark pt-8 md:space-y-10 md:pt-10">
      <section
        id="agency-quick-inquiry"
        className="scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-navy/50">
          기관 담당자용
        </p>
        <h2 className="section-heading mt-2">기관 담당자용 빠른 문의</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          일반 상담과 구분해, 기관 등기업무·견적 검토·여러 건의 일정 상담을
          위한 문의 경로입니다. 사안과 일정 확인 후 가능 범위를 안내합니다.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/협업문의?partner=public&service=public"
            className="btn-primary inline-flex min-h-12 items-center px-5"
          >
            기관 등기업무 문의
          </Link>
          <Link
            href="/협업문의?partner=public&service=quote"
            className="btn-secondary inline-flex min-h-12 items-center px-5"
          >
            견적 검토 요청
          </Link>
          <Link
            href="/협업문의?partner=public&type=project&service=bulk"
            className="btn-secondary inline-flex min-h-12 items-center px-5"
          >
            여러 건의 등기 일정 상담
          </Link>
        </div>
      </section>

      <section id="agency-quote-basics">
        <h2 className="section-heading">견적 요청 시 필요한 기본정보</h2>
        <ul className="body-text mt-3 max-w-3xl list-disc space-y-2 pl-5 text-navy/80">
          <li>업무 유형(법인·부동산·촉탁 검토 여부)</li>
          <li>대상 부동산·법인 개요(민감정보 제외)</li>
          <li>예상 건수 구간과 희망 일정</li>
          <li>견적·제안서 제출 기한</li>
          <li>담당자 연락 창구</li>
        </ul>
      </section>

      <section id="agency-before-approval">
        <h2 className="section-heading">내부 결재 전에 확인할 내용</h2>
        <ul className="body-text mt-3 max-w-3xl list-disc space-y-2 pl-5 text-navy/80">
          <li>의결·공문·정관 등 내부 문서 상태</li>
          <li>촉탁등기와 일반 신청의 사전 구분</li>
          <li>법인등기와 부동산등기 병행 여부</li>
          <li>완료 결과 전달 방식(담당자·부서)</li>
        </ul>
      </section>

      <section id="agency-docs">
        <h2 className="section-heading">공문·의결서·정관·등기부 자료 목록</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          초기 문의에는 민감 원본을 보내지 마세요. 필요 자료와 안전한 전달
          방법은 별도로 안내합니다. 일반적으로 공문, 의결서, 정관, 등기사항
          증명서 사본(필요 범위)을 확인합니다.
        </p>
      </section>

      <section id="agency-commission">
        <h2 className="section-heading">촉탁등기와 일반 신청의 사전 구분</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          촉탁과 일반 신청은 절차·서류·일정이 달라질 수 있습니다. 내부 검토
          단계에서 어느 쪽인지 먼저 구분해 주시면 가능 범위 안내가 수월합니다.
        </p>
      </section>

      <section id="agency-multi">
        <h2 className="section-heading">여러 건의 부동산등기 프로젝트 문의</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          여러 필지·건물이 있는 경우 목록과 일정을 표준화한 뒤 검토합니다.
          프로젝트 규모에 따라 수행 방식과 필요 일정을 협의합니다.
        </p>
        <Link
          href="/부산집단등기"
          className="btn-secondary mt-4 inline-flex min-h-11 items-center px-4 text-sm"
        >
          집단·대량등기 안내
        </Link>
      </section>

      <section id="agency-bid">
        <h2 className="section-heading">조달·입찰·용역 문의 시 전달할 정보</h2>
        <ul className="body-text mt-3 max-w-3xl list-disc space-y-2 pl-5 text-navy/80">
          <li>용역 개요와 업무 범위(초안)</li>
          <li>제출 기한과 질의 마감</li>
          <li>예상 건수·일정</li>
          <li>비밀유지·자료 전달 요건</li>
        </ul>
      </section>

      <section id="agency-privacy">
        <h2 className="section-heading">비밀유지와 자료 전달 원칙</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          초기 문의에는 주민등록번호·인감·등기필정보 등 민감서류를 요구하지
          않습니다. 필요 시 안전한 전달 방법을 별도로 안내합니다.
        </p>
      </section>

      <section id="agency-handover">
        <h2 className="section-heading">담당자 변경 시 인수인계 정보</h2>
        <ul className="body-text mt-3 max-w-3xl list-disc space-y-2 pl-5 text-navy/80">
          <li>신규 담당자 연락처와 부서</li>
          <li>진행 중인 사건번호·일정(공개 가능 범위)</li>
          <li>자료 보관 위치와 접근 권한</li>
        </ul>
      </section>

      <section id="agency-delivery">
        <h2 className="section-heading">완료 결과 전달 방식</h2>
        <p className="body-text mt-3 max-w-3xl text-navy/80">
          접수증·완료 확인·결과물 전달 방식은 사전에 정해 두는 것이
          좋습니다. 담당자 변경에 대비해 부서 공용 연락 창구를 함께 두면
          누락을 줄일 수 있습니다.
        </p>
      </section>

      <section className="rounded-xl border border-beige-dark bg-beige/30 p-5">
        <h2 className="text-lg font-semibold text-navy">복대리·프로젝트 문의</h2>
        <p className="mt-2 text-sm text-navy/75">
          기관 업무와 부산 현지 등기 협업은 협업 허브에서도 확인할 수 있습니다.
        </p>
        <Link
          href="/partners"
          className="btn-secondary mt-4 inline-flex min-h-11 items-center px-4 text-sm"
        >
          전문직·기업 협업 안내
        </Link>
      </section>
    </div>
  );
}
