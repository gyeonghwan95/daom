import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { ResourceChecklist } from "@/components/resources/ResourceChecklist";
import { ResourceInquiry } from "@/components/resources/ResourceInquiry";
import { ResourceShareActions } from "@/components/resources/ResourceShareActions";
import { RESOURCE_CATEGORY_LABEL, RESOURCE_VERIFIED_ON, RESOURCE_VERSION, resourcePath } from "@/data/resources/guides";
import type { ResourceGuide } from "@/data/resources/types";
import { getContactInfo } from "@/lib/contact";
import { getContentMeta } from "@/lib/content/loader";
import { resourceAssetPaths } from "@/lib/resources/asset-paths";
import { absoluteUrl, RESOURCE_BRAND, readableUrl } from "@/lib/resources/urls";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";

/** 자료별 관련 실제 처리 사례(공개 사례 중 주제가 맞는 것만, 없으면 표시하지 않음) */
const RELATED_CASES: Record<string, string[]> = {
  "inheritance-family": ["haeundae-inheritance-registration-case"],
  "inheritance-overseas": ["haeundae-inheritance-registration-case"],
  "property-closing": ["centum-ownership-transfer-case"],
  "company-change": ["yeonje-director-change-case", "suyeong-company-establishment-case"],
};

/** 다운로드 파일 이름(사람이 알아보는 이름) */
const FILE_LABEL: Record<string, string> = {
  "inheritance-family": "상속등기_가족확인",
  "unpaid-evidence": "미수금_거래자료",
  "company-change": "법인변경_준비자료",
  "inheritance-overseas": "해외가족_상속등기",
  "property-closing": "잔금전_등기일정",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-[calc(var(--header-height)+1rem)] border-t border-beige-dark pt-7 md:pt-9">
      <h2 className="section-heading">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ResourceGuideView({ guide }: { guide: ResourceGuide }) {
  const { kakao, naverTalk } = getContactInfo();
  const assets = resourceAssetPaths(guide.slug);
  const fileBase = `다옴법무사사무소_${FILE_LABEL[guide.slug] ?? guide.slug}_v${RESOURCE_VERSION}`;
  const path = resourcePath(guide.slug);
  const relatedCases = (RELATED_CASES[guide.slug] ?? [])
    .map((slug) => getContentMeta("cases", slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: "의뢰 전 준비자료", href: "/resources" },
    { label: guide.h1, href: path },
  ];
  const inquiryProps = {
    slug: guide.slug,
    button: guide.inquiry.button,
    intent: guide.inquiry.intent,
    message: guide.inquiry.message,
    facts: guide.inquiry.facts,
    topic: guide.h1,
    kakaoHref: kakao,
    naverTalkHref: naverTalk,
  };

  return (
    <article className="mx-auto max-w-3xl break-keep" data-resource={guide.slug}>
      <JsonLd data={buildBreadcrumbSchema(breadcrumbs, path)} />
      <Breadcrumb items={breadcrumbs} />

      {/* 사이트 인쇄 CSS가 header 태그를 숨기므로 div로 둔다 */}
      <div>
        <p className="inline-flex rounded-full bg-navy px-3 py-1 text-xs font-bold text-white">
          {RESOURCE_CATEGORY_LABEL[guide.category]} · 의뢰 전 준비자료
        </p>
        <h1 className="mt-3 text-[1.6rem] font-bold leading-snug tracking-tight text-navy md:text-[2rem]">{guide.h1}</h1>
        <div className="mt-4 rounded-xl bg-cream px-4 py-3">
          <p className="text-sm font-semibold text-navy-light">이런 상황에 읽으세요</p>
          <p className="mt-1 text-[0.98rem] leading-relaxed text-navy">{guide.readWhen}</p>
        </div>
        <p className="body-text mt-4">{guide.intro}</p>
        <p className="mt-3 text-xs leading-relaxed text-navy/60">
          {RESOURCE_BRAND} · 근거 확인일 {RESOURCE_VERIFIED_ON} · 자료 버전 v{RESOURCE_VERSION} · {guide.scope}
        </p>
        <div className="mt-4">
          <ResourceShareActions
            slug={guide.slug}
            title={guide.h1}
            pageUrl={absoluteUrl(guide.slug)}
            pngHref={assets.png}
            pdfHref={assets.pdf}
            fileBase={fileBase}
          />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Section id="checks" title="먼저 확인할 것">
          <ResourceChecklist checks={guide.checks} />
        </Section>

        {guide.chooser ? (
          <Section id="chooser" title={guide.chooser.caption}>
            <div className="overflow-x-auto rounded-xl border border-beige-dark">
              <table className="w-full min-w-[30rem] border-collapse text-left text-[0.95rem]">
                <thead className="bg-cream text-navy">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 font-semibold">{guide.chooser.head[0]}</th>
                    <th scope="col" className="px-3 py-2.5 font-semibold">{guide.chooser.head[1]}</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.chooser.rows.map(([a, b]) => (
                    <tr key={a} className="border-t border-beige-dark">
                      <th scope="row" className="px-3 py-2.5 font-semibold text-navy">{a}</th>
                      <td className="px-3 py-2.5 text-navy/85">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        ) : null}

        <Section id="sheet" title={guide.sheet.caption}>
          <p className="mb-3 text-sm leading-relaxed text-navy/70">
            PDF로 받거나 인쇄해 빈칸을 채우세요. 화면에서는 옆으로 밀어 전체 칸을 볼 수 있습니다.
            {guide.sheet.example ? " 첫 행은 가상 작성 예시입니다." : ""}
          </p>
          <div className="overflow-x-auto rounded-xl border border-beige-dark" tabIndex={0} aria-label={`${guide.sheet.caption} (가로 스크롤)`}>
            <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
              <thead className="bg-cream text-navy">
                <tr>
                  {guide.sheet.columns.map((c) => (
                    <th key={c} scope="col" className="px-3 py-2.5 font-semibold">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {guide.sheet.example ? (
                  <tr className="border-t border-beige-dark italic text-navy/60">
                    {guide.sheet.example.map((c, i) => (
                      <td key={i} className="px-3 py-2.5">{c}</td>
                    ))}
                  </tr>
                ) : null}
                {guide.sheet.rows.map((r, ri) => (
                  <tr key={ri} className="border-t border-beige-dark">
                    {guide.sheet.columns.map((_, ci) => (
                      <td key={ci} className="h-11 px-3 py-2 text-navy">{ci === 0 ? r : ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="review" title="개별 검토가 필요한 조건">
          <ul className="space-y-3">
            {guide.reviewConditions.map((c) => (
              <li key={c.condition} className="rounded-xl border-l-4 border-navy/60 bg-white py-1 pl-4">
                <p className="font-semibold text-navy">{c.condition}</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-navy/80">{c.why}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <ResourceInquiry {...inquiryProps} placement="mid" />
          </div>
        </Section>

        <Section id="office" title="법무사가 맡는 일">
          <ul className="list-disc space-y-1.5 pl-5 text-[0.98rem] leading-relaxed text-navy">
            {guide.officeTasks.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-navy-light">법무사 업무가 아닌 부분</p>
          <ul className="mt-1.5 space-y-1.5 text-[0.95rem] leading-relaxed text-navy/75">
            {guide.outsideScope.map((t) => (
              <li key={t}>· {t}</li>
            ))}
          </ul>
          <p className="mt-3 rounded-lg bg-cream/70 px-3 py-2.5 text-[0.95rem] leading-relaxed text-navy/85">
            <span className="font-semibold">비용</span> · {guide.costNote}{" "}
            <Link href="/부산법무사비용" className="underline underline-offset-2">보수와 공과금 구분 안내</Link>
          </p>
        </Section>

        <Section id="share" title="가족·담당자와 공유할 자료">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,13rem)_1fr] sm:items-start print:block">
            <a href={assets.png} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-beige-dark print:hidden">
              <Image src={assets.png} alt={`${guide.h1} 공유 이미지 미리보기`} width={1080} height={1440} className="h-auto w-full" sizes="(min-width: 640px) 13rem, 100vw" unoptimized />
            </a>
            <div className="text-[0.95rem] leading-relaxed text-navy/85">
              <p>한 장 이미지(PNG)는 가족 단체방·메신저용, A4 PDF는 인쇄해 빈칸을 채우는 용도입니다. 두 파일 모두 이 페이지와 같은 내용이며 원문 주소와 확인일이 적혀 있습니다.</p>
              <p className="mt-2">원문 주소 <span className="font-semibold">{readableUrl(guide.slug)}</span></p>
              <p className="mt-2 text-sm text-navy/60">주민등록번호나 서류 원본 사진 대신 확인사항만 공유하세요.</p>
            </div>
          </div>
        </Section>

        <Section id="sources" title="공식 근거">
          <ul className="space-y-1.5 text-[0.95rem]">
            {guide.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2 hover:text-navy-light">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-navy/60">
            {RESOURCE_VERIFIED_ON}에 국가법령정보센터·찾기쉬운 생활법령정보 원문을 확인했습니다. 법령은 바뀔 수 있고, 이 자료는 일반 안내이지 개별 사건의 결론이 아닙니다.
          </p>
        </Section>

        {relatedCases.length ? (
          <Section id="related-cases" title="비슷한 실제 처리 사례">
            <p className="mb-3 text-sm text-navy/65">사무소에서 실제로 진행한 사건을 개인정보를 빼고 정리했습니다. 내 상황과 비교해 보세요.</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {relatedCases.map((c) => (
                <li key={c.slug}>
                  <Link href={c.href} className="flex h-full flex-col rounded-lg border border-beige-dark bg-white px-3 py-2.5 no-underline hover:border-navy/30" data-resource-case={c.slug}>
                    <span className="text-xs font-semibold text-navy-light">실제 처리 사례 · {c.category}</span>
                    <span className="mt-0.5 text-[0.95rem] font-semibold text-navy">{c.title} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <Section id="related" title="절차를 더 자세히 보려면">
          <ul className="grid gap-2 sm:grid-cols-2">
            {guide.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="flex min-h-11 items-center rounded-lg border border-beige-dark bg-white px-3 py-2 text-[0.95rem] font-semibold text-navy hover:border-navy/30">
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <div className="pt-6">
          <ResourceInquiry {...inquiryProps} placement="end" />
        </div>
      </div>
    </article>
  );
}
