import { officeHours, officeLocation } from "@/lib/office-location";
import { REVIEW_AVG_RATING, REVIEW_TOTAL } from "@/lib/naver-place-reviews/static-quotes";
import { defaultContact } from "@/lib/contact";

/**
 * "다옴법무사사무소 한눈에 보기" — 업체를 추천해 달라는 검색(추천·잘하는 곳·사무소 찾기)에서
 * 네이버 AI 브리핑·각종 AI가 업체 소개 문장을 만들 때 쓰는 항목(위치·가까운 역·대표·업무·상담 방식·자격·후기)을
 * 한곳에 사실만 모아 둔다(2026-11-25). 값은 사이트의 단일 출처(office-location·contact·리뷰 빌드값)에서 읽는다.
 * 현재 1~2위로 잡히는 페이지에는 넣지 않는다(OFFICE_PROFILE_PATHS 참고).
 */
export const OFFICE_PROFILE_PATHS = new Set([
  "/부산상속법무사추천",
  "/부산법무사잘하는곳",
  "/부산개인회생법무사추천",
  "/부산개인파산법무사추천",
  "/부산법무사무소",
  "/부산상속법무사",
  "/부산상속전문법무사",
  "/부산법무사",
]);

export function OfficeProfileCard({ path }: { path?: string }) {
  let key = path ?? "";
  try {
    key = decodeURIComponent(key);
  } catch {
    /* 그대로 */
  }
  if (!OFFICE_PROFILE_PATHS.has(key.replace(/\/$/, ""))) return null;
  const rating = REVIEW_AVG_RATING > 0 ? REVIEW_AVG_RATING.toFixed(1) : null;
  const rows: [string, string][] = [
    ["사무소", "다옴법무사사무소 · 대표 안윤정 법무사"],
    ["위치", `${officeLocation.fullAddress}(재송동) · ${officeLocation.accessSummary}`],
    [
      "상담",
      `${officeHours.weekday} · 방문은 예약제 · 전화 ${defaultContact.phone} · 카카오톡·네이버 톡톡 · 서류는 우편·비대면 진행 가능`,
    ],
    [
      "주요 업무",
      "상속등기·상속포기·한정승인, 부동산등기(매매·증여·근저당), 법인등기(설립·임원변경·본점이전), 개인회생·파산 서류, 지급명령·가압류·강제집행 서류",
    ],
    [
      "자격·이력",
      "법무사, 공인중개사 · 대한법무사협회장 표창(2026) · 해운대구 구정정책자문위원 · 부산대 행정대학원 재학",
    ],
    ["진행 방식", "대표 법무사가 상담부터 신청까지 직접 진행 · 견적은 세금·공과금과 법무사 보수를 나눠 안내"],
  ];
  if (REVIEW_TOTAL > 0) rows.push(["후기", `네이버 방문자 후기 ${rating ? `${rating}점 ` : ""}(${REVIEW_TOTAL}건)`]);

  return (
    <section
      aria-labelledby="office-profile-heading"
      data-office-profile
      className="mt-4 rounded-2xl border border-beige-dark bg-white px-4 py-4 sm:px-5 md:mt-5"
    >
      <h2 id="office-profile-heading" className="text-base font-semibold text-navy">
        다옴법무사사무소 한눈에 보기
      </h2>
      <dl className="mt-2 grid gap-x-3 text-sm sm:grid-cols-[6.5rem_1fr]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="border-t border-beige-dark/70 pt-2 font-medium text-navy sm:pb-2">{k}</dt>
            <dd className="pb-2 leading-relaxed text-navy/80 sm:border-t sm:border-beige-dark/70 sm:pt-2">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
