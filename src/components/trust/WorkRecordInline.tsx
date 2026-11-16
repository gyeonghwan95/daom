import { getWorkRecords, WORK_RECORD_NOTE, workRecordSrc } from "@/data/seo/work-records";
import { encodePublicSrc } from "@/lib/encode-public-src";

/**
 * 본문 중간의 '실제로 진행한 업무' 카드 — 페이지마다 두 곳(slot 0·1)에 한 장씩.
 *
 * 왜: 글 끝 신뢰 블록 안에 모아 두면 끝까지 읽은 사람만 봤다. 설명을 읽는 도중에 실제 서류·현장 사진이 나와야
 * "이 사무소가 이 일을 실제로 한다"는 믿음이 생긴다(2026-11-16).
 * 경로로 업무를 고르는 서버 컴포넌트라 정적 HTML의 그 자리에 그대로 들어간다(검색 수집·레이아웃 이동 없음).
 */
export function WorkRecordInline({ path, slot }: { path: string; slot: 0 | 1 }) {
  const record = getWorkRecords(path)[slot];
  if (!record) return null;
  const label = record.title.replace(/\n/g, " ");
  const note = WORK_RECORD_NOTE[record.kind ?? "document"];

  return (
    <figure
      className="work-record-inline overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_18px_40px_-30px_rgba(30,58,95,0.45)] sm:grid sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]"
      data-work-record-inline={slot}
    >
      <div className="p-3 pb-0 sm:h-full sm:p-0">
        {/* /image/cards/ 1:1 카드는 파생본 없이 원본 JPG 하나만 배포한다(파일 수 한도) — next/image 대신 img */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={encodePublicSrc(workRecordSrc(record.file))}
          alt={`${label} — ${record.caption}(다옴법무사사무소 실제 업무${record.kind === "document" || !record.kind ? ", 개인정보 가림" : ""})`}
          width={1200}
          height={1200}
          loading="lazy"
          decoding="async"
          className="block aspect-square h-auto w-full rounded-xl object-cover sm:h-full sm:rounded-none"
        />
      </div>
      <figcaption className="px-5 pb-5 pt-4 sm:px-6 sm:py-6">
        <p className="flex items-center gap-2 text-xs font-bold tracking-[0.04em] text-navy-light">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#b08d57]" aria-hidden />
          실제로 진행한 업무
        </p>
        <p className="mt-2 text-balance text-[1.05rem] font-bold leading-snug text-navy sm:text-lg">{record.caption}</p>
        <p className="mt-2 text-sm leading-relaxed text-navy/65">{note}</p>
      </figcaption>
    </figure>
  );
}

/**
 * 섹션 목록을 배열로 그리는 화면용 — index번째 섹션 뒤가 두 자리 중 하나면 그 카드를 그린다.
 * 첫 장은 앞쪽(섹션이 5개 이상이면 두 번째 섹션 뒤), 둘째 장은 약 60% 지점 뒤. start는 이미 그림이 붙은 앞 섹션 수.
 */
export function WorkRecordSlot({
  path,
  index,
  total,
  start = 0,
}: {
  path: string;
  index: number;
  total: number;
  start?: number;
}) {
  const span = total - start;
  if (span <= 0) return null;
  const first = start + (span >= 5 ? 1 : 0);
  const second = Math.min(total - 1, Math.max(first + 1, Math.round(start + span * 0.6)));
  if (index === first) return <WorkRecordInline path={path} slot={0} />;
  if (index === second && second > first) return <WorkRecordInline path={path} slot={1} />;
  return null;
}
