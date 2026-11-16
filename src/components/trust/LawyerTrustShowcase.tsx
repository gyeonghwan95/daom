import Link from "next/link";
import type { ReactNode } from "react";
import { TrustContactActions } from "@/components/trust/TrustContactActions";
import { TrustInfographicViewer } from "@/components/trust/TrustInfographicViewer";
import { TrustReviewQuote } from "@/components/trust/TrustReviewQuote";
import { PrepResourceLink } from "@/components/resources/PrepResourceLink";
import { getResourceGuide, RESOURCE_BY_PAGE, resourcePath } from "@/data/resources/guides";
import { getNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews";
import { buildReviewQuotes } from "@/lib/naver-place-reviews/topic-quote";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { officeHours } from "@/lib/office-location";
import { siteImages } from "@/lib/site-images";

type TrustHighlight = {
  label: string;
  value: string;
  icon: ReactNode;
};

const iconClass = "h-5 w-5";

function CertificateIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M7 9h10M7 12.5h6" />
      <path d="m15 17 1.5 3 1.5-3" />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="5.5" />
      <path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7" />
    </svg>
  );
}

function BroadcastIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="m8 2.5 4 3.5 4-3.5M10 10v4l3.5-2z" />
    </svg>
  );
}

function LectureIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2.5 9 12 4.5 21.5 9 12 13.5z" />
      <path d="M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0 text-navy" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" className="fill-navy/10" />
      <path d="m7.5 12.2 3 3 6-6.4" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const highlights: TrustHighlight[] = [
  {
    label: "보유 자격",
    value: "법무사 · 공인중개사 · 신용관리사",
    icon: <CertificateIcon />,
  },
  {
    label: "수상",
    value: "대한법무사협회장 표창",
    icon: <AwardIcon />,
  },
  {
    label: "언론·방송",
    value: "서울경제TV · 부산일보 · 부산 MBC 외",
    icon: <BroadcastIcon />,
  },
  {
    label: "강의·공공 위촉",
    value: "공공기관 법률 강의 · 부산시 청년정책 자문위원",
    icon: <LectureIcon />,
  },
];

const promises = [
  "서류 검토부터 등기 완료까지 담당 법무사가 직접 안내합니다.",
  "방문이 어려우면 서류 사진·우편으로 먼저 확인해 드립니다.",
  "상황을 먼저 듣고, 꼭 필요한 절차만 골라 안내합니다.",
];

/**
 * 게시글 끝 신뢰·전환 블록 — 안윤정 법무사 전문이력 인포그래픽 + 상담 채널.
 * 컨테이너 쿼리로 배치하므로 좁은 본문 칼럼과 넓은 PageContainer 양쪽에서 같은 컴포넌트를 쓴다.
 */
export function LawyerTrustShowcase() {
  const { phone } = getContactInfo();
  const image = siteImages.about.credentialInfographic;
  const activityImage = siteImages.about.activityInfographic;
  const reviewFeed = getNaverPlaceReviewsFeed();
  const reviewQuotes = buildReviewQuotes(reviewFeed.items);
  const prepByPath = Object.fromEntries(
    Object.entries(RESOURCE_BY_PAGE).map(([page, slug]) => [
      page,
      { href: resourcePath(slug), title: getResourceGuide(slug)?.h1 ?? "" },
    ]),
  );

  return (
    <section
      className="lawyer-trust @container mt-12 break-keep md:mt-16 print:hidden"
      aria-labelledby="lawyer-trust-heading"
      data-lawyer-trust
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-navy/10 bg-gradient-to-br from-cream via-white to-beige/70 shadow-[0_30px_60px_-40px_rgba(30,58,95,0.5)]">
        {/*
          한 흐름 배치(2026-11-15 재구성) — 예전엔 왼쪽 이미지 열·오른쪽 글 열 2단이라 PC에서 열 길이가 어긋나고,
          모바일에서는 이미지 제목 옆 설명이 밀려 제목이 아래로 내려갔다.
          1) 머리말 2) 전문 이력·전문 활동 이미지 한 줄 3) 자격·수상·언론·강의(PC 2개씩)
          4) PC: 약속·후기 | 실제 업무 기록(업무 페이지에만) 5) 상담 띠
        */}
        <div className="px-5 pb-6 pt-6 @md:px-7 @md:pb-7 @md:pt-7 @5xl:px-8 @5xl:pb-8 @5xl:pt-8">
          <header>
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-navy/15 bg-white px-3 py-1 text-xs font-bold tracking-[0.04em] text-navy-light">
              <span className="h-1.5 w-1.5 rounded-full bg-navy" aria-hidden />
              안윤정 법무사를 찾는 이유
            </p>
            <h2
              id="lawyer-trust-heading"
              className="mt-4 text-[1.4rem] font-bold leading-snug tracking-tight text-balance text-navy @md:text-[1.75rem] @5xl:text-[1.9rem]"
            >
              <span className="block">읽고도 막막하다면,</span>
              <span className="block">안윤정 법무사가 직접 답해 드립니다</span>
            </h2>
            <p className="mt-3 max-w-3xl text-[0.98rem] leading-relaxed text-navy/75 @md:text-base">
              자격과 현장 경험으로 이력을 쌓아 온 대표 법무사가 상속·부동산·법인등기, 민사
              법원서류, 개인회생·파산 신청에 필요한 상담을 직접 맡습니다. 부산 해운대 센텀
              사무소에서 의뢰인 곁에서 함께합니다.
            </p>
          </header>

          {/* 1행: 전문 이력 · 전문 활동 — 미리보기는 비율이 짧은 전문 이력(3:4)에 맞춰 위쪽 기준으로 자른다. 크게 보기는 원본 전체 */}
          <div className="mt-6 rounded-2xl bg-navy/[0.035] p-3 @md:p-4 @3xl:p-5">
            <div className="grid grid-cols-2 gap-3 @md:gap-4 @3xl:gap-5">
              {[
                { img: image, label: "전문 이력", sub: "자격·학력·주요 경력", title: "안윤정 법무사 전문이력 인포그래픽", track: "trust-infographic" },
                { img: activityImage, label: "전문 활동", sub: "위촉·수상·방송 출연", title: "안윤정 법무사 전문활동 인포그래픽", track: "trust-activity-infographic" },
              ].map((f) => (
                <figure key={f.label} className="min-w-0">
                  {/* 제목·설명을 두 줄로 고정 — 좁은 폰에서 설명이 밀려 제목이 내려가거나 두 이미지 시작선이 어긋나지 않게 */}
                  <figcaption className="mb-2 px-0.5">
                    <span className="flex items-center gap-2 text-sm font-bold text-navy @3xl:text-base">
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#b08d57]" aria-hidden />
                      {f.label}
                    </span>
                    <span className="mt-0.5 block truncate pl-4 text-xs text-navy/55">{f.sub}</span>
                  </figcaption>
                  <TrustInfographicViewer
                    image={f.img}
                    title={f.title}
                    trackKind={f.track}
                    thumbAspect={`${image.width} / ${image.height}`}
                    sizes="(max-width: 767px) 46vw, 420px"
                  />
                </figure>
              ))}
            </div>
            <div className="mt-3 flex flex-col items-stretch gap-3 @lg:flex-row @lg:items-center @lg:justify-between">
              <p className="text-center text-xs leading-relaxed text-navy/60 @lg:text-left">
                이미지를 누르면 원본 전체를 크게 볼 수 있습니다.
              </p>
              <Link
                href="/about"
                className="group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-navy/15 bg-white px-4 text-[0.95rem] font-bold text-navy no-underline shadow-sm transition hover:border-navy/30 hover:bg-cream @md:gap-2.5 @md:px-5"
                data-cta="trust-profile"
              >
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                  <ProfileIcon />
                </span>
                안윤정 법무사는 누구일까?
                {/* 좁은 폰(카드 폭 384px 미만)에서는 화살표를 빼야 글자가 한 줄에 들어간다 */}
                <span
                  className="hidden text-navy/50 transition-transform duration-200 group-hover:translate-x-0.5 @sm:inline"
                  aria-hidden
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* 2행: 자격·수상·언론·강의 — 넓으면 한 줄에 2개 */}
          <ul className="mt-5 grid gap-2.5 @lg:grid-cols-2 @3xl:gap-3">
            {highlights.map((item) => (
              <li
                key={item.label}
                className="flex items-start gap-3 rounded-xl border border-navy/10 bg-white/90 px-3.5 py-3"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                  {item.icon}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-navy-light">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-sm font-semibold leading-snug text-navy">
                    {item.value}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          {/* 3행: 약속·후기 — 실제 업무 기록 사진은 2026-11-16부터 본문 중간(WorkRecordInline)으로 옮겼다 */}
          <div className="mt-1 grid gap-x-6 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] @3xl:items-start">
            <div className="min-w-0">
              <ul className="mt-5 space-y-2">
                {promises.map((text) => (
                  <li key={text} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-navy/85">
                    <CheckIcon />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-0">
              <TrustReviewQuote quotes={reviewQuotes} />
            </div>
          </div>
          <PrepResourceLink byPath={prepByPath} />

          <div className="mt-6">
            <TrustContactActions
              phone={phone}
              phoneHref={getPhoneHref(phone)}
              hours={officeHours.weekday}
            />

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <Link href="/media" className="inline-flex min-h-11 items-center whitespace-nowrap text-navy underline-offset-4 hover:underline">
                언론·방송 출연 보기 →
              </Link>
              <Link href="/강의이력" className="inline-flex min-h-11 items-center whitespace-nowrap text-navy underline-offset-4 hover:underline">
                강의 이력 보기 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
