import { getPeerPagePath } from "@/lib/internal-links/peer-context";
import { getRecordedLastModified } from "@/lib/seo/lastmod-lookup";

/** 약관·공지처럼 안내 글이 아닌 페이지는 출처 표기를 붙이지 않는다. */
const SKIP_PATHS = new Set(["/개인정보처리방침", "/이용약관", "/공지사항", "/강의문의", "/1분간편상담"]);

const LINK_CLASS =
  "font-medium text-navy underline decoration-navy/30 underline-offset-4 hover:decoration-navy";

/**
 * 안내 글 끝의 작성·근거 표기. 날짜는 사이트맵 lastmod 기록(내용이 실제로 바뀐 날)만 쓰고, 기록이 없으면 날짜를 적지 않는다.
 * 경로는 페이지 함수가 기록한 값을 읽으므로, 경로를 기록하지 않는 페이지에는 나오지 않는다.
 */
export function PageTrustNote() {
  const path = getPeerPagePath();
  if (!path || SKIP_PATHS.has(path)) return null;
  const date = getRecordedLastModified(path);

  return (
    <aside
      className="mt-10 rounded-2xl border border-beige-dark bg-white/60 px-5 py-4 text-sm leading-relaxed text-navy/75 print:hidden"
      aria-label="작성 및 근거 안내"
    >
      <p>
        <span className="whitespace-nowrap font-semibold text-navy">작성·운영</span> 다옴법무사사무소 안윤정 법무사
        {date ? (
          <>
            {" "}
            · <span className="whitespace-nowrap font-semibold text-navy">최종 수정</span>{" "}
            <time dateTime={date}>{date}</time>
          </>
        ) : null}
      </p>
      <p className="mt-1.5">
        <span className="whitespace-nowrap font-semibold text-navy">근거 확인처</span> 법령은{" "}
        <a href="https://www.law.go.kr" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          국가법령정보센터<span className="sr-only"> (새 창)</span>
        </a>
        , 등기 절차와 서류는{" "}
        <a href="https://www.iros.go.kr" target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          대법원 인터넷등기소<span className="sr-only"> (새 창)</span>
        </a>
        에서 확인할 수 있습니다. 법령과 절차는 개정될 수 있어, 실제 진행 전에 최신 기준을 함께 확인해 안내해 드립니다.
      </p>
    </aside>
  );
}
