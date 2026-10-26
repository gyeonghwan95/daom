import Link from "next/link";
import { getNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews";
import { excerptReview } from "@/lib/naver-place-reviews/topic-quote";
import type { NaverPlaceReview } from "@/lib/naver-place-reviews/types";

/**
 * 법무사 소개 상단 — 네이버 플레이스 실제 방문자 후기를 크게 보여 준다.
 * "진행 방식"을 설명하는 대신, 맡겨 본 사람의 말로 먼저 보여 주기 위한 블록.
 * 후기 본문은 고치지 않고 앞부분만 자른다. 후기가 바뀌어도 빌드 때 다시 고른다.
 */

type Voice = {
  id: string;
  topic: string;
  excerpt: string;
  nickname: string;
  date: string;
};

/** 업무 주제 — 카드 위 작은 표시 */
function topicOf(body: string): string {
  if (/상속/.test(body)) return "상속등기";
  if (/증여/.test(body)) return "증여등기";
  if (/매매/.test(body)) return "매매등기";
  if (/전세|보증금/.test(body)) return "전세·보증금";
  if (/부동산/.test(body)) return "부동산 상담";
  if (/비용/.test(body)) return "비용 설명";
  return "상담";
}

/** 맡기는 사람이 가장 궁금해하는 점(비용 설명·속도·꼼꼼함·소통)을 직접 말한 후기를 앞에 둔다 */
const SIGNALS: RegExp[] = [/비용/, /설명/, /빠르|신속|스피드/, /꼼꼼/, /보정/, /소통|피드백/, /친절/, /편하|편안/];

function score(review: NaverPlaceReview): number {
  return SIGNALS.reduce((n, re) => n + (re.test(review.body) ? 1 : 0), 0);
}

function formatDate(sortKey: string): string {
  const [y, m] = sortKey.split("-");
  return y && m ? `${y}.${m}` : sortKey;
}

/** 소개 상단에 보여 주는 후기 id — 같은 페이지의 다른 블록(한눈에 보기)이 같은 후기를 반복하지 않게 쓴다 */
export function getAboutVoiceIds(): string[] {
  return pickVoices(getNaverPlaceReviewsFeed().items).map((v) => v.id);
}

function pickVoices(items: NaverPlaceReview[], count = 3): Voice[] {
  const candidates = items
    .filter((r) => r.body && r.body.replace(/\s+/g, "").length >= 40)
    // 길 찾기·주차 이야기로 시작하는 후기는 소개 인용으로 맞지 않는다
    .filter((r) => !/^(.{0,40})(못\s?찾|헤[매메]|주차)/.test(r.body.replace(/\s+/g, " ")))
    .sort((a, b) => score(b) - score(a) || b.createdSortKey.localeCompare(a.createdSortKey));

  const picked: NaverPlaceReview[] = [];
  const topics = new Set<string>();
  // 업무가 겹치지 않게 먼저 고르고, 모자라면 점수순으로 채운다
  for (const r of candidates) {
    if (picked.length >= count) break;
    const t = topicOf(r.body);
    if (topics.has(t)) continue;
    topics.add(t);
    picked.push(r);
  }
  for (const r of candidates) {
    if (picked.length >= count) break;
    if (!picked.includes(r)) picked.push(r);
  }

  return picked.map((r) => ({
    id: r.id,
    topic: topicOf(r.body),
    excerpt: excerptReview(r.body, 150),
    nickname: r.nickname,
    date: formatDate(r.createdSortKey),
  }));
}

export function AboutReviewVoices() {
  const feed = getNaverPlaceReviewsFeed();
  const voices = pickVoices(feed.items);
  if (voices.length === 0) return null;
  const total = feed.stats.totalCount || feed.items.length;

  return (
    <section
      id="voices"
      aria-labelledby="voices-heading"
      className="about-voices section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
    >
      <div className="about-voices__head">
        <p className="about-voices__kicker">네이버 방문자 후기 {total}건</p>
        <h2 id="voices-heading" className="about-voices__title">
          맡겨 본 분들이
          <br className="sm:hidden" /> 먼저 말합니다
        </h2>
        <p className="about-voices__lead">
          비용을 어떻게 나눠 설명하는지, 얼마나 빨리 끝나는지는 직접 맡겨 본 분들의 말이 가장
          정확합니다. 네이버 플레이스에 남은 후기를 고치지 않고 옮겼습니다.
        </p>
      </div>

      <ul className="about-voices__grid">
        {voices.map((v) => (
          <li key={v.id} className="about-voices__card">
            <span className="about-voices__topic">{v.topic}</span>
            <blockquote className="about-voices__quote">
              <p>{v.excerpt}</p>
            </blockquote>
            <p className="about-voices__meta">
              {v.nickname} · {v.date} · 네이버 플레이스
            </p>
          </li>
        ))}
      </ul>

      <div className="about-voices__foot">
        <Link href="/reviews" className="about-voices__more">
          후기 전체 보기 →
        </Link>
        <a
          href={feed.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="about-voices__naver"
        >
          네이버 플레이스에서 확인<span className="sr-only"> (새 창)</span>
        </a>
      </div>
    </section>
  );
}
