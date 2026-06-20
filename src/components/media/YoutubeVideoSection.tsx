"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { easeOutSoft } from "@/lib/motion";
import type { YoutubeVideo } from "@/lib/youtube-videos";
import { getYoutubeEmbedUrl, parseYoutubeUrl } from "@/lib/youtube";

type YoutubeEmbedProps = {
  video: YoutubeVideo;
  featured?: boolean;
  variant?: "dark" | "light";
};

export function YoutubeEmbed({
  video,
  featured = false,
  variant = "dark",
}: YoutubeEmbedProps) {
  const reduced = useReducedMotion();
  const parsed = parseYoutubeUrl(video.youtubeUrl);
  const isDark = variant === "dark";

  if (!parsed) return null;

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl ring-1 ${
        isDark
          ? `home-youtube-player bg-navy-dark/50 ring-white/10 ${featured ? "shadow-2xl shadow-black/30" : ""}`
          : "border border-beige-dark bg-white shadow-sm ring-beige-dark"
      }`}
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.85, ease: easeOutSoft }}
    >
      <div className="relative aspect-video">
        <iframe
          src={getYoutubeEmbedUrl(parsed.videoId, parsed.startSeconds)}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </motion.div>
  );
}

type YoutubeVideoSectionProps = {
  videos: YoutubeVideo[];
  variant?: "dark" | "light";
  /** 지정 시 featured 대신 이 ID를 메인 영상으로 */
  featuredId?: string;
  showAllInGrid?: boolean;
  footerLink?: { href: string; label: string };
  className?: string;
};

export function YoutubeVideoSection({
  videos,
  variant = "light",
  featuredId,
  showAllInGrid = false,
  footerLink,
  className = "",
}: YoutubeVideoSectionProps) {
  const isDark = variant === "dark";
  const featured =
    videos.find((v) => v.id === featuredId) ??
    videos.find((v) => v.featured) ??
    videos[0];
  const others = videos.filter((v) => v.id !== featured?.id);

  if (!featured) return null;

  const titleClass = isDark ? "text-white" : "text-navy";
  const descClass = isDark ? "text-white/60" : "text-navy/65";
  const linkClass = isDark
    ? "text-white/70 hover:text-white"
    : "text-navy-light hover:text-navy";

  return (
    <div className={`space-y-8 ${className}`}>
      <div className={featured && !showAllInGrid ? "mx-auto max-w-4xl" : ""}>
        <YoutubeEmbed video={featured} featured variant={variant} />
        <div className={`mt-4 ${!showAllInGrid ? "text-center" : ""}`}>
          <h3 className={`text-base font-semibold leading-snug md:text-lg ${titleClass}`}>
            {featured.title}
          </h3>
          <p className={`mt-2 text-sm leading-relaxed ${descClass}`}>
            {featured.description}
          </p>
          <a
            href={parseYoutubeUrl(featured.youtubeUrl)?.watchUrl ?? featured.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 inline-flex text-sm font-medium underline-offset-4 hover:underline ${linkClass}`}
          >
            YouTube에서 보기 →
          </a>
        </div>
      </div>

      {others.length > 0 && (
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {others.map((video) => (
            <div key={video.id}>
              <YoutubeEmbed video={video} variant={variant} />
              <h3 className={`mt-4 text-base font-semibold leading-snug ${titleClass}`}>
                {video.title}
              </h3>
              <p className={`mt-1 text-sm leading-relaxed ${descClass}`}>
                {video.description}
              </p>
              <a
                href={parseYoutubeUrl(video.youtubeUrl)?.watchUrl ?? video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 inline-flex text-xs font-medium hover:underline ${linkClass}`}
              >
                YouTube →
              </a>
            </div>
          ))}
        </div>
      )}

      {footerLink && (
        <div className="text-center">
          <Link
            href={footerLink.href}
            className={
              isDark
                ? "inline-flex min-h-12 items-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
                : "inline-flex min-h-12 items-center text-sm font-medium text-navy-light underline-offset-4 hover:underline"
            }
          >
            {footerLink.label}
          </Link>
        </div>
      )}
    </div>
  );
}
