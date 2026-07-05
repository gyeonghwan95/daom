import { NaverPlaceReviewsMarquee } from "@/components/reviews/NaverPlaceReviewsMarquee";
import { NaverIcon } from "@/components/consultation/ConsultationIcons";
import type { NaverPlaceReviewsFeed } from "@/lib/naver-place-reviews/types";

type NaverPlaceReviewsLinkHubProps = {
  feed: NaverPlaceReviewsFeed;
};

export function NaverPlaceReviewsLinkHub({ feed }: NaverPlaceReviewsLinkHubProps) {
  const previewReviews = [...feed.items]
    .sort((a, b) => b.createdSortKey.localeCompare(a.createdSortKey))
    .slice(0, 8);

  const statsLabel =
    feed.stats.totalCount > 0
      ? `방문자 후기 ${feed.stats.totalCount}건`
      : "네이버 플레이스에서 후기 확인";

  return (
    <section
      id="naver-place-reviews"
      className="naver-place-reviews-hub overflow-hidden"
    >
      <div className="naver-place-reviews-hub__layout">
        <div className="naver-place-reviews-hub__copy">
          <p className="naver-place-reviews-hub__eyebrow">
            <span className="naver-place-reviews-hub__brand-mark" aria-hidden>
              <NaverIcon className="h-3.5 w-3.5" />
            </span>
            네이버 플레이스
          </p>
          <h2 className="section-heading mt-3">네이버 플레이스 후기 보기</h2>
          <p className="naver-place-reviews-hub__lead">
            상속·등기·회생 등 실제 의뢰인분들이 남겨 주신 방문자 후기는 네이버
            플레이스에서 전체 확인하실 수 있습니다. 오른쪽 미리보기를 눌러
            바로 이동해 보세요.
          </p>

          {feed.stats.totalCount > 0 ? (
            <dl className="naver-place-reviews-hub__stats">
              <div>
                <dt>방문자 후기</dt>
                <dd>{feed.stats.totalCount}건</dd>
              </div>
              {feed.stats.imageReviewCount > 0 ? (
                <div>
                  <dt>사진 후기</dt>
                  <dd>{feed.stats.imageReviewCount}건</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          <div className="naver-place-reviews-hub__actions">
            <a
              href={feed.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="naver-place-reviews-hub__cta"
            >
              <span className="naver-place-reviews-hub__cta-icon" aria-hidden>
                <NaverIcon className="h-5 w-5" />
              </span>
              <span>네이버 플레이스 후기 보기</span>
            </a>
            <span className="naver-place-reviews-hub__meta">{statsLabel}</span>
          </div>
        </div>

        <div className="naver-place-reviews-hub__visual">
          <NaverPlaceReviewsMarquee
            reviews={previewReviews}
            reviewUrl={feed.reviewUrl}
          />
        </div>
      </div>
    </section>
  );
}
