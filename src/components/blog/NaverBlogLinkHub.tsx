import { NaverBlogMarquee } from "@/components/blog/NaverBlogMarquee";
import { getNaverBlogUrl } from "@/lib/contact";
import { getNaverBlogFeed } from "@/lib/naver-blog";
import { getNaverBlogMarqueeSlides } from "@/lib/naver-blog/marquee-images";

export function NaverBlogLinkHub() {
  const blogUrl = getNaverBlogUrl();
  const feed = getNaverBlogFeed();
  const slides = getNaverBlogMarqueeSlides(feed.items, blogUrl);

  return (
    <section
      id="naver-blog"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] naver-blog-hub card-surface overflow-hidden p-0"
    >
      <div className="naver-blog-hub__layout">
        <div className="naver-blog-hub__copy">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
            Naver Blog
          </p>
          <h2 className="section-heading mt-2">네이버 블로그 바로가기</h2>
          <p className="mt-3 text-sm leading-relaxed text-navy/75 sm:text-base">
            최신 법률정보, 상담 사례, 강의 소식은 공식 네이버 블로그에서 확인하실
            수 있습니다. 오른쪽 미리보기를 눌러 바로 읽어보세요.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex min-h-12 items-center justify-center px-6"
            >
              네이버 블로그 바로가기
            </a>
            <span className="text-xs text-navy/55 sm:text-sm">
              {feed.items.length > 0
                ? `최신 글 ${feed.items.length}편 업데이트`
                : "공식 블로그에서 최신 글 확인"}
            </span>
          </div>
        </div>

        <div className="naver-blog-hub__visual">
          <NaverBlogMarquee slides={slides} blogUrl={blogUrl} />
        </div>
      </div>
    </section>
  );
}
