import { imagePaths } from "@/lib/site-images";
import type { NaverBlogPost } from "@/lib/naver-blog/types";
import { extractNaverPostId } from "@/lib/naver-blog/urls";

export type NaverBlogMarqueeSlide = {
  src: string;
  alt: string;
  href: string;
  label: string;
};

const CATEGORY_IMAGE: Record<string, string> = {
  등기: imagePaths.thumbRegistryOffice,
  "재산·상속·후견": imagePaths.stockLegalDocuments,
  "민사·집행·공탁": imagePaths.thumbCivilLitigationBook,
  "강의·강연": imagePaths.activityYouthSpace,
  "사무소 소식": imagePaths.pressBusanIlbo20260608,
};

const FALLBACK_MARQUEE_IMAGES: Omit<NaverBlogMarqueeSlide, "href" | "label">[] = [
  { src: imagePaths.stockLegalDocuments, alt: "등기 서류 안내" },
  { src: imagePaths.stockLegalConsultation, alt: "법률 상담" },
  { src: imagePaths.thumbRegistryOffice, alt: "등기소 절차" },
  { src: imagePaths.thumbMajorBook, alt: "법률 정보" },
  { src: imagePaths.pressBusanIlbo20260608, alt: "언론 보도" },
  { src: imagePaths.activityYouthSpace, alt: "법률 강의" },
  { src: imagePaths.stockLegalCourthouse, alt: "법원 절차" },
  { src: imagePaths.thumbNotaryBook, alt: "법무사 실무" },
  { src: imagePaths.officeInterior, alt: "사무소 내부" },
  { src: imagePaths.thumbEastDistrictCourt, alt: "부산 법무" },
];

function imageForPost(post: NaverBlogPost): string {
  if (post.category && CATEGORY_IMAGE[post.category]) {
    return CATEGORY_IMAGE[post.category];
  }
  return imagePaths.stockLegalDocuments;
}

/** 네이버 블로그 허브 마퀴용 슬라이드 (RSS 항목 + 시각용 이미지) */
export function getNaverBlogMarqueeSlides(
  posts: NaverBlogPost[],
  blogUrl: string,
): NaverBlogMarqueeSlide[] {
  if (posts.length > 0) {
    return posts.map((post) => {
      const postId = extractNaverPostId(post.link);
      const baseBlogUrl = blogUrl.replace(/\/$/, "");
      const href = postId ? `${baseBlogUrl}/${postId}` : blogUrl;
      const shortTitle =
        post.title.length > 28 ? `${post.title.slice(0, 25)}…` : post.title;

      return {
        src: imageForPost(post),
        alt: post.title,
        href,
        label: shortTitle,
      };
    });
  }

  return FALLBACK_MARQUEE_IMAGES.map((item, index) => ({
    ...item,
    href: blogUrl,
    label: `블로그 글 ${index + 1}`,
  }));
}
