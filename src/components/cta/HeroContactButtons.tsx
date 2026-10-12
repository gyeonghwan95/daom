import Link from "next/link";
import type { ReactNode } from "react";
import { AltChannelButton } from "@/components/conversion/InquiryAltChannels";
import { NaverBlogMorePostsButton } from "@/components/cta/NaverBlogMorePostsButton";
import type { NaverSmartPlacePlacement } from "@/lib/naver-smartplace/cta";

type HeroContactButtonsProps = {
  /** '1분만에 문의하기' 버튼(페이지마다 문의 시작 방식이 달라 바깥에서 넘긴다) */
  inquiry: ReactNode;
  placement: NaverSmartPlacePlacement;
  pageSlug?: string;
  /** 네이버 예약 버튼 표시(기본 true) */
  showReservation?: boolean;
  /** 2행 첫 버튼(기본: 안윤정 법무사는 누구일까?). null이면 생략 */
  secondary?: { href: string; label: string } | null;
  /** 2행 끝에 덧붙이는 페이지 전용 버튼(예: 다른 지역 찾기) */
  extra?: { href: string; label: string }[];
  className?: string;
};

const secondaryClass =
  "btn-secondary inline-flex min-h-11 w-full items-center justify-center gap-2 px-3 text-sm";

/**
 * 본문형 페이지 글 시작 부분의 상담·신뢰 버튼.
 * 1행: 네이버 톡톡 · 카카오톡 · 전화상담 · 1분만에 문의하기 · 네이버 예약 · 네이버 후기·사진
 * 2행: 안윤정 법무사는 누구일까? · 네이버 지도에서 사무소 위치 확인 · 블로그에서 더 많은 글 보기
 * 본문 폭에 맞춰 1행은 2→3→6열, 2행은 1→3열로 줄바꿈한다.
 */
export function HeroContactButtons({
  inquiry,
  placement,
  pageSlug = "",
  showReservation = true,
  secondary = { href: "/about", label: "안윤정 법무사는 누구일까?" },
  extra = [],
  className = "",
}: HeroContactButtonsProps) {
  const row2Count = (secondary ? 1 : 0) + 2 + extra.length;
  return (
    <div className={`@container flex flex-col gap-2 ${className}`.trim()}>
      <ul className="grid grid-cols-2 gap-2 @md:grid-cols-3 @4xl:grid-cols-6" aria-label="상담 연결">
        <li>
          <AltChannelButton id="talk" placement={placement} pageSlug={pageSlug} />
        </li>
        <li>
          <AltChannelButton id="kakao" placement={placement} pageSlug={pageSlug} />
        </li>
        <li>
          <AltChannelButton id="phone" placement={placement} pageSlug={pageSlug} />
        </li>
        <li className="[&>*]:!min-h-11 [&>*]:w-full [&>*]:!px-3 [&>*]:text-sm">{inquiry}</li>
        {showReservation ? (
          <li>
            <AltChannelButton id="reservation" placement={placement} pageSlug={pageSlug} />
          </li>
        ) : null}
        <li>
          <AltChannelButton id="review" placement={placement} pageSlug={pageSlug} />
        </li>
      </ul>
      <ul
        className={`grid grid-cols-1 gap-2 ${row2Count >= 4 ? "@md:grid-cols-2 @3xl:grid-cols-4" : "@md:grid-cols-3"}`}
        aria-label="사무소·법무사 안내"
      >
        {secondary ? (
          <li>
            <Link href={secondary.href} className={secondaryClass}>
              {secondary.label}
            </Link>
          </li>
        ) : null}
        <li>
          <AltChannelButton
            id="map"
            placement={placement}
            pageSlug={pageSlug}
            label="네이버 지도에서 사무소 위치 확인"
          />
        </li>
        <li>
          <NaverBlogMorePostsButton className={secondaryClass} />
        </li>
        {extra.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={secondaryClass}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
