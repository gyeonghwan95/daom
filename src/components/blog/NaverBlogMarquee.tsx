"use client";

import Image from "next/image";
import { InfiniteMarquee } from "@/components/motion/InfiniteMarquee";
import type { NaverBlogMarqueeSlide } from "@/lib/naver-blog/marquee-images";

type NaverBlogMarqueeProps = {
  slides: NaverBlogMarqueeSlide[];
  blogUrl: string;
};

export function NaverBlogMarquee({ slides, blogUrl }: NaverBlogMarqueeProps) {
  return (
    <div className="naver-blog-marquee" aria-hidden={false}>
      <p className="naver-blog-marquee__hint">
        최신 글 미리보기 — 클릭하면 네이버 블로그에서 읽을 수 있습니다
      </p>
      <InfiniteMarquee speed={42} direction="left" className="naver-blog-marquee__track">
        {slides.map((slide, index) => (
          <a
            key={`${slide.href}-${index}`}
            href={slide.href}
            target="_blank"
            rel="noopener noreferrer"
            className="naver-blog-marquee__card group"
            title={slide.alt}
          >
            <span className="naver-blog-marquee__image-wrap">
              <Image
                src={slide.src}
                alt=""
                width={160}
                height={112}
                className="naver-blog-marquee__image"
                sizes="160px"
              />
              <span className="naver-blog-marquee__shine" aria-hidden />
            </span>
            <span className="naver-blog-marquee__label">{slide.label}</span>
          </a>
        ))}
      </InfiniteMarquee>
      <a
        href={blogUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="naver-blog-marquee__mobile-cta sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10"
      >
        네이버 블로그 전체 보기
      </a>
    </div>
  );
}
