"use client";

import { usePathname } from "next/navigation";
import { getWorkRecords, workRecordSrc } from "@/data/seo/work-records";
import { encodePublicSrc } from "@/lib/encode-public-src";

/**
 * 신뢰 블록 안 '실제로 진행한 업무 기록' — 이 페이지 업무와 같은 종류의 실제 서류 사진 1~2장.
 * 경로로 업무를 고르므로 클라이언트 컴포넌트지만, 정적 생성 때 경로가 정해져 HTML에 그대로 들어간다.
 * 업무를 알 수 없는 페이지(지역 소개·블로그 등)에는 아무것도 그리지 않는다.
 */
export function WorkRecordStrip() {
  const records = getWorkRecords(usePathname() ?? "/");
  if (!records.length) return null;
  const single = records.length === 1;

  return (
    <section className="mt-5" aria-labelledby="work-record-heading" data-work-records>
      <h3 id="work-record-heading" className="flex items-center gap-2 text-sm font-bold text-navy">
        <span className="h-2 w-2 rounded-full bg-[#b08d57]" aria-hidden />
        실제로 진행한 업무 기록
      </h3>
      <ul className={`mt-2.5 grid gap-3 ${single ? "max-w-[15rem] grid-cols-1" : "grid-cols-2"}`}>
        {records.map((r) => {
          const label = r.title.replace(/\n/g, " ");
          return (
            <li key={r.file}>
              <figure className="h-full overflow-hidden rounded-xl border border-navy/10 bg-white shadow-sm">
                {/* /image/cards/ 1:1 카드는 파생본 없이 원본 JPG 하나만 배포한다(파일 수 한도) — next/image 대신 img */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodePublicSrc(workRecordSrc(r.file))}
                  alt={`${label} — ${r.caption}(다옴법무사사무소 실제 업무, 개인정보 가림)`}
                  width={1200}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="block aspect-square h-auto w-full"
                />
                <figcaption className="border-t border-navy/10 px-3 py-2 text-xs leading-snug text-navy/75">
                  {r.caption}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs leading-relaxed text-navy/55">
        사무소가 직접 작성·접수한 서류를 찍은 사진입니다. 의뢰인 정보는 가렸습니다.
      </p>
    </section>
  );
}
