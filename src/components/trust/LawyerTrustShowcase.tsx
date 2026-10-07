import Link from "next/link";
import type { ReactNode } from "react";
import { TrustContactActions } from "@/components/trust/TrustContactActions";
import { TrustInfographicViewer } from "@/components/trust/TrustInfographicViewer";
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
    label: "국가자격",
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
  const { phone, kakao, naverTalk } = getContactInfo();
  const image = siteImages.about.credentialInfographic;

  return (
    <section
      className="lawyer-trust @container mt-12 break-keep md:mt-16 print:hidden"
      aria-labelledby="lawyer-trust-heading"
      data-lawyer-trust
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-navy/10 bg-gradient-to-br from-cream via-white to-beige/70 shadow-[0_30px_60px_-40px_rgba(30,58,95,0.5)]">
        <div className="grid @3xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @5xl:grid-rows-[auto_auto_1fr]">
          <header className="px-5 pt-6 @md:px-7 @md:pt-7 @3xl:col-span-2 @3xl:row-start-1 @5xl:col-span-1 @5xl:col-start-2 @5xl:px-8 @5xl:pt-8">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-navy/15 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-navy-light">
              <span className="h-1.5 w-1.5 rounded-full bg-navy" aria-hidden />
              Why 안윤정 법무사
            </p>
            <h2
              id="lawyer-trust-heading"
              className="mt-4 text-[1.4rem] font-bold leading-snug tracking-tight text-balance text-navy @md:text-[1.75rem] @5xl:text-[1.9rem]"
            >
              <span className="block">읽고도 막막하다면,</span>
              <span className="block">안윤정 법무사가 직접 답해 드립니다</span>
            </h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-navy/75 @md:text-base">
              자격과 현장 경험으로 이력을 쌓아 온 대표 법무사가 상속·부동산·법인등기, 민사
              법원서류, 개인회생·파산 신청에 필요한 상담을 직접 맡습니다. 부산 해운대 센텀
              사무소에서 의뢰인 곁에서 함께합니다.
            </p>
          </header>

          <div className="mx-4 mt-5 flex flex-col rounded-2xl bg-navy/[0.035] p-3 @md:mx-6 @md:p-4 @3xl:col-start-1 @3xl:row-start-2 @3xl:mr-0 @3xl:ml-7 @3xl:mt-6 @3xl:self-center @5xl:row-span-3 @5xl:row-start-1 @5xl:m-0 @5xl:self-stretch @5xl:justify-center @5xl:rounded-none @5xl:p-7">
            <TrustInfographicViewer image={image} />
            <p className="mt-3 text-center text-xs leading-relaxed text-navy/60">
              이미지를 누르면 이력 전체를 크게 볼 수 있습니다.
            </p>
            <Link
              href="/about"
              className="group mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-navy/15 bg-white px-5 text-[0.95rem] font-bold text-navy no-underline shadow-sm transition hover:border-navy/30 hover:bg-cream"
              data-cta="trust-profile"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                <ProfileIcon />
              </span>
              안윤정 법무사는 누구일까?
              <span
                className="text-navy/50 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </div>

          <div className="px-5 pt-5 @md:px-7 @3xl:col-start-2 @3xl:row-start-2 @3xl:pt-6 @5xl:px-8 @5xl:pt-5">
            <ul className="grid gap-2.5 @lg:grid-cols-2 @3xl:grid-cols-1 @5xl:grid-cols-2">
              {highlights.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-3 rounded-xl border border-navy/10 bg-white/90 px-3.5 py-3"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy text-white">
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-navy-light">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-sm font-semibold leading-snug text-navy">
                      {item.value}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <ul className="mt-5 space-y-2">
              {promises.map((text) => (
                <li key={text} className="flex gap-2.5 text-[0.95rem] leading-relaxed text-navy/85">
                  <CheckIcon />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 pb-6 pt-6 @md:px-7 @md:pb-7 @3xl:col-span-2 @3xl:row-start-3 @5xl:col-span-1 @5xl:col-start-2 @5xl:row-start-3 @5xl:px-8 @5xl:pb-8">
            <TrustContactActions
              phone={phone}
              phoneHref={getPhoneHref(phone)}
              kakaoHref={kakao}
              naverTalkHref={naverTalk}
              hours={officeHours.weekday}
            />

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <Link href="/media" className="text-navy underline-offset-4 hover:underline">
                언론·방송 출연 보기 →
              </Link>
              <Link href="/강의이력" className="text-navy underline-offset-4 hover:underline">
                강의 이력 보기 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
