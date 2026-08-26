import { NaverIcon } from "@/components/consultation/ConsultationIcons";
import { getNaverBlogUrl } from "@/lib/contact";
import { NAVER_BLOG_MORE_POSTS_LABEL } from "@/lib/naver-blog/more-posts-cta";

type NaverBlogMorePostsButtonProps = {
  className?: string;
};

export function NaverBlogMorePostsButton({
  className,
}: NaverBlogMorePostsButtonProps) {
  return (
    <a
      href={getNaverBlogUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-cta="naver-blog-more"
    >
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] bg-[#03C75A] text-white"
        aria-hidden
      >
        <NaverIcon className="h-3 w-3" />
      </span>
      <span>{NAVER_BLOG_MORE_POSTS_LABEL}</span>
      <span className="sr-only"> (새 창)</span>
    </a>
  );
}
