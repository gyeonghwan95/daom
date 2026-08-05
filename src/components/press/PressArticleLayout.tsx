import { PageContainer } from "@/components/layout/PageContainer";
import { Breadcrumb } from "@/components/navigation/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { SiteImage } from "@/components/media/SiteImage";
import { RelatedLinks } from "@/components/page/RelatedLinks";
import { PressHighlightText } from "@/components/press/PressHighlightText";
import {
  getPressOriginalLinkLabel,
  type PressArticle,
} from "@/lib/press-articles";

type PressArticleLayoutProps = {
  article: PressArticle;
};

export function PressArticleLayout({ article }: PressArticleLayoutProps) {
  const breadcrumbs = [
    { label: "홈", href: "/" },
    { label: "언론·활동", href: "/media" },
    { label: article.title },
  ];
  const originalCta = article.originalUrl
    ? getPressOriginalLinkLabel(article, "cta")
    : null;
  const originalInline = article.originalUrl
    ? getPressOriginalLinkLabel(article, "inline")
    : null;
  const originalShort = article.originalUrl
    ? getPressOriginalLinkLabel(article, "short")
    : null;

  return (
    <PageContainer>
      <article className="content-stack">
        <Breadcrumb items={breadcrumbs} />
        <BreadcrumbJsonLd
          items={breadcrumbs}
          currentPath={`/media/${article.slug}`}
        />

        <header className="mt-6 border-b border-beige-dark pb-8">
          <span className="inline-block rounded-full bg-beige px-3 py-1 text-sm font-medium text-navy-light">
            {article.source}
          </span>
          <h1 className="page-title mt-4">{article.title}</h1>
          <p className="mt-4 text-sm text-navy/60 md:text-base">
            {article.publishedAtDisplay}
            {article.topic
              ? ` · ${article.topic}`
              : article.reporter
                ? ` · ${article.reporter}`
                : ""}
          </p>
          {article.originalUrl && originalCta ? (
            <p className="mt-4">
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center text-sm font-semibold text-navy-light underline-offset-4 hover:underline md:text-base"
              >
                {originalCta}
              </a>
            </p>
          ) : null}
        </header>

        <div className="mt-8 overflow-hidden rounded-xl border border-beige-dark">
          <SiteImage
            {...article.image}
            className="block w-full"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
          />
        </div>

        <section
          id="article"
          className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] py-8 md:space-y-6 md:py-10"
          aria-labelledby="press-article-heading"
        >
          <h2 id="press-article-heading" className="section-heading">
            기사 본문
          </h2>
          <div className="mt-6 space-y-5 md:space-y-6">
            {article.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="body-text text-base leading-relaxed text-navy/85 md:text-lg"
              >
                <PressHighlightText text={paragraph} />
              </p>
            ))}
          </div>
          {article.originalUrl && originalInline ? (
            <p className="mt-8 rounded-lg border border-beige-dark bg-beige/40 px-4 py-3 text-sm text-navy/80 md:text-base">
              이 페이지는 보도·출연 내용을 요약한 안내입니다.{" "}
              <a
                href={article.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-navy-light underline-offset-4 hover:underline"
              >
                {originalInline}
              </a>
              에서 더 자세히 확인하실 수 있습니다.
            </p>
          ) : null}
        </section>

        <RelatedLinks
          title="관련 페이지"
          links={[
            ...(article.originalUrl && originalShort
              ? [
                  {
                    href: article.originalUrl,
                    label: originalShort,
                  },
                ]
              : []),
            { href: "/media#press", label: "언론보도 목록" },
            { href: "/media", label: "언론·활동" },
            { href: "/about", label: "법무사 소개" },
            { href: "/blog", label: "블로그" },
            { href: "/contact", label: "상담 신청" },
          ]}
        />
      </article>
    </PageContainer>
  );
}
