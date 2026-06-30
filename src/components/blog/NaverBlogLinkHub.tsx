import { getNaverBlogUrl } from "@/lib/contact";

export function NaverBlogLinkHub() {
  const blogUrl = getNaverBlogUrl();

  return (
    <section
      id="naver-blog"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
    >
      <h2 className="section-heading">네이버 블로그 바로가기</h2>
      <p className="mt-3 text-sm leading-relaxed text-navy/75 sm:text-base">
        최신 법률정보, 상담 사례, 강의 소식은 공식 네이버 블로그에서 확인하실 수
        있습니다.
      </p>
      <a
        href={blogUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-6 inline-flex min-h-12 items-center justify-center px-6"
      >
        네이버 블로그 바로가기
      </a>
    </section>
  );
}
