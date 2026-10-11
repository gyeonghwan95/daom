import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { getVerifiedLectureHistory } from "@/data/lectures/history";
import { getAllContent } from "@/lib/content/loader";
import { getLawyerAwards, getLawyerQualifications } from "@/lib/lawyer-profile";
import {
  eeatAwardThumbs,
  eeatLectureThumbs,
  type EeatThumbImage,
} from "@/lib/lawyer-eeat-images";
import { getNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews";
import { buildReviewQuotes } from "@/lib/naver-place-reviews/topic-quote";
import { getAllPressArticles } from "@/lib/press-articles";
import { siteImages } from "@/lib/site-images";

/** 드롭인 사진(public/image/소개-*.jpg)이 있으면 쓰고, 없으면 기존 사진을 쓴다(빌드 시 판정). */
function resolveThumb(image?: EeatThumbImage): string | undefined {
  if (!image) return undefined;
  try {
    const local = path.join(process.cwd(), "public", decodeURIComponent(image.src));
    if (fs.existsSync(local)) return image.src;
  } catch {
    /* fallback */
  }
  return image.fallbackSrc ?? image.src;
}

function Thumb({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  if (!src) return null;
  return (
    <div className={`relative overflow-hidden rounded-lg bg-beige/40 ${className}`}>
      <Image src={src} alt={alt} fill sizes="(min-width: 768px) 160px, 40vw" className="object-cover" />
    </div>
  );
}

function Tile({
  href,
  label,
  title,
  children,
  className = "",
}: {
  href: string;
  label: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl border border-beige-dark bg-white p-4 no-underline transition hover:-translate-y-0.5 hover:border-navy/25 hover:shadow-md ${className}`}
    >
      <span className="text-xs font-bold tracking-wide text-navy-light">{label}</span>
      <span className="mt-1 text-[1.02rem] font-bold leading-snug text-navy">{title}</span>
      {children}
      <span className="mt-auto pt-3 text-sm font-semibold text-navy-light group-hover:text-navy">자세히 보기 →</span>
    </Link>
  );
}

/**
 * 법무사 소개 '한눈에 보기' — 자격·수상·언론·강의·위원·후기·사무소를 한 화면에 모은다.
 * 숫자와 문구는 모두 기존 데이터 원본(lawyer-profile·press-articles·lectures/history·후기 피드)에서 계산한다.
 */
export function LawyerAtAGlance() {
  const qualifications = getLawyerQualifications().filter(
    (q) => q.category === "국가자격" || q.category === "국가공인 민간자격",
  );
  const awards = getLawyerAwards();
  const handledCases = getAllContent("cases").filter((c) => c.slug.endsWith("-case"));
  const press = getAllPressArticles();
  const lectures = getVerifiedLectureHistory();
  const lectureInstitutions = new Set(lectures.map((l) => l.institution));
  const reviewFeed = getNaverPlaceReviewsFeed();
  const quote = buildReviewQuotes(reviewFeed.items).find((q) => q.topic !== "general") ?? buildReviewQuotes(reviewFeed.items)[0];
  const lectureThumbs = Object.values(eeatLectureThumbs).slice(0, 3).map(resolveThumb);
  const awardThumb = resolveThumb(awards[0] ? eeatAwardThumbs[awards[0].name] : undefined);

  return (
    <section aria-labelledby="at-a-glance-heading" className="break-keep" data-lawyer-at-a-glance>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <h2 id="at-a-glance-heading" className="section-heading">
          안윤정 법무사, 한눈에 보기
        </h2>
        <p className="text-sm text-navy/60">궁금한 항목을 누르면 자세한 내용으로 이어집니다</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Link
          href="#experience"
          className="group col-span-2 row-span-2 flex flex-col overflow-hidden rounded-2xl border border-beige-dark bg-white no-underline transition hover:border-navy/25 hover:shadow-md md:col-span-2"
        >
          <div className="relative aspect-[4/3] w-full bg-beige/40">
            <Image
              src={siteImages.about.portrait.src}
              alt={siteImages.about.portrait.alt}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-top"
              priority
            />
          </div>
          <div className="p-4">
            <p className="text-xs font-bold tracking-wide text-navy-light">대표 법무사</p>
            <p className="mt-1 text-lg font-bold text-navy">안윤정 법무사</p>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-navy/80">
              부산 해운대 센텀에서 상속·부동산·법인등기와 개인회생·파산을 직접 상담하고, 서류 준비부터 마무리까지
              곁에서 챙깁니다.
            </p>
            <span className="mt-2 inline-block text-sm font-semibold text-navy-light group-hover:text-navy">경력 보기 →</span>
          </div>
        </Link>

        <Tile href="#credentials" label={`주요 보유 자격 ${qualifications.length}개`} title={qualifications.map((q) => q.name).join(" · ")}>
          <Thumb src={siteImages.about.credentialInfographic.src} alt="안윤정 법무사 전문이력 인포그래픽" className="mt-3 aspect-[4/3] w-full" />
        </Tile>

        <Tile href="#awards" label="수상" title={awards.map((a) => a.name).join(" · ") || "수상 내역"}>
          <Thumb src={awardThumb} alt={awards[0]?.name ?? "수상"} className="mt-3 aspect-[4/3] w-full" />
        </Tile>

        <Tile href="/media" label={`언론·방송 ${press.length}건`} title="방송·신문에서 생활 법률을 설명했습니다">
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {press.slice(0, 3).map((p) => (
              <Thumb key={p.slug} src={p.image.src} alt={`${p.source} — ${p.title}`} className="aspect-square" />
            ))}
          </div>
        </Tile>

        <Tile href="/강의이력" label={`강의 ${lectureInstitutions.size}곳`} title="도서관·청년기관·공공기관 생활법률 강의">
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {lectureThumbs.map((src, i) => (
              <Thumb key={i} src={src} alt="생활법률 강의 현장" className="aspect-square" />
            ))}
          </div>
        </Tile>

        <Tile href="/업무사례#case-list" label={`실제 업무 사례 ${handledCases.length}건`} title="사무소에서 처리한 상속·부동산·법인 사건">
          <p className="mt-2 text-sm leading-relaxed text-navy/70">어떤 조건을 확인했고 무엇을 맡았는지 사례로 볼 수 있습니다.</p>
        </Tile>

        <Tile
          href="/reviews"
          label={reviewFeed.stats.totalCount > 0 ? `네이버 방문자 후기 ${reviewFeed.stats.totalCount}건` : "고객 후기"}
          title="상담받은 분들이 남긴 이야기"
        >
          {quote ? (
            <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-navy/75">“{quote.excerpt}”</p>
          ) : null}
        </Tile>

        <Tile href="/office" label="사무소" title="해운대 센텀 사무소 · 방문 상담은 예약제" className="col-span-2 md:col-span-2">
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <Thumb src={siteImages.office.exterior.src} alt="다옴법무사사무소 전경" className="aspect-[4/3]" />
            <Thumb src={siteImages.office.nameplate.src} alt="다옴법무사사무소 현판" className="aspect-[4/3]" />
          </div>
        </Tile>
      </div>
    </section>
  );
}
