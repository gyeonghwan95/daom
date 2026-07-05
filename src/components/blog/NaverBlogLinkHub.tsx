import { NaverBlogMarquee } from "@/components/blog/NaverBlogMarquee";
import { NaverIcon } from "@/components/consultation/ConsultationIcons";
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
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] naver-blog-hub overflow-hidden"
    >
      <div className="naver-blog-hub__layout">
        <div className="naver-blog-hub__copy">
          <p className="naver-blog-hub__eyebrow">
            <span className="naver-blog-hub__brand-mark" aria-hidden>
              <NaverIcon className="h-3.5 w-3.5" />
            </span>
            네이버 공식 블로그
          </p>
          <h2 className="section-heading mt-3">네이버 블로그 바로가기</h2>
          <p className="naver-blog-hub__lead">
            최신 법률정보, 상담 사례, 강의 소식은 공식 네이버 블로그에서 확인하실
            수 있습니다. 오른쪽 미리보기를 눌러 바로 읽어보세요.
          </p>
          <div className="naver-blog-hub__actions">
            <a
              href={blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="naver-blog-hub__cta"
            >
              <span className="naver-blog-hub__cta-icon" aria-hidden>
                <NaverIcon className="h-5 w-5" />
              </span>
              <span>네이버 블로그 바로가기</span>
            </a>
            <span className="naver-blog-hub__meta">
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
