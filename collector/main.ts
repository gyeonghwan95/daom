/**
 * 법무사 업무기회 데일리 브리핑 — 실행 진입점.
 *
 * 사용법:
 *   npx tsx collector/main.ts                # 실수집 + 이메일 발송
 *   npx tsx collector/main.ts --dry-run      # 실수집, 이메일 미발송 (미리보기 파일만)
 *   npx tsx collector/main.ts --fixture collector/tests/fixtures/g2b-servc-sample.json
 *                                            # 오프라인 샘플 데이터로 전체 파이프라인 실행
 *   npx tsx collector/main.ts --force-email  # 당일 중복 발송 방지 무시
 *
 * 원칙:
 * - 수집원 하나가 실패해도 전체 브리핑을 중단하지 않는다 (소스별 격리).
 * - 신규 공고 0건은 실패가 아니다 — "신규 적합 공고 없음" 브리핑을 만든다.
 * - API 키·메일 주소는 로그에 마스킹한다.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getEnabledApiSources } from "./config/sources";
import { classifyNotice, isCandidate } from "./src/classify";
import { collectG2b, normalizeG2bItem, parseG2bResponse } from "./src/collectors/g2b";
import { collectNuri, normalizeNuriItem } from "./src/collectors/nuri";
import { mergeWithExisting, toOpportunity } from "./src/dedupe";
import { buildSubject, renderHtml, renderText, sendBriefingEmail } from "./src/email";
import { scoreNotice } from "./src/score";
import { appendRuns, lastSuccessAt, loadState, saveState } from "./src/state";
import type {
  BidSource,
  BriefingData,
  CollectionRun,
  Opportunity,
  OpportunityChange,
  RawNotice,
} from "./src/types";
import { daysUntil, kstDateString, kstDateTimeString, maskSecret } from "./src/util";

const OUTPUT_DIR = join(process.cwd(), "collector", "output");

type CliOptions = {
  dryRun: boolean;
  forceEmail: boolean;
  fixturePath?: string;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { dryRun: false, forceEmail: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--dry-run") options.dryRun = true;
    else if (argv[i] === "--force-email") options.forceEmail = true;
    else if (argv[i] === "--fixture") options.fixturePath = argv[i + 1];
  }
  return options;
}

function collectionWindow(): { from: Date; to: Date } {
  const lookbackDays = Number(process.env.BID_LOOKBACK_DAYS) || 3;
  const to = new Date();
  const from = new Date(to.getTime() - lookbackDays * 24 * 60 * 60 * 1000);
  return { from, to };
}

/** 오프라인 fixture에서 RawNotice를 만든다 (테스트·미리보기용). */
function loadFixtureNotices(path: string): RawNotice[] {
  const body = readFileSync(path, "utf8");
  const parsed = parseG2bResponse(body);
  const isNuri = path.includes("nuri");
  const source: BidSource = isNuri
    ? {
        id: "nuri-servc",
        name: "누리장터 민간입찰 (용역)",
        type: "official-api",
        baseUrl: "https://www.g2b.go.kr",
        enabled: true,
        priority: 1,
        categories: [],
        requiresApiKey: true,
        collectionMethod: "",
        termsReviewed: true,
        robotsReviewed: true,
        parserId: "nuri",
      }
    : getEnabledApiSources().find((s) => s.parserId !== "nuri") ?? getEnabledApiSources()[0];
  const normalize = isNuri || source.parserId === "nuri" ? normalizeNuriItem : normalizeG2bItem;
  return parsed.items
    .map((item) => normalize(item, source))
    .filter((n): n is RawNotice => n !== null);
}

async function collectSource(
  source: BidSource,
  window: { from: Date; to: Date },
  serviceKey: string,
) {
  if (source.parserId === "nuri") {
    return collectNuri(source, window, serviceKey);
  }
  return collectG2b(source, window, serviceKey);
}

function buildBriefing(
  candidates: Opportunity[],
  changes: OpportunityChange[],
  runs: CollectionRun[],
  fetchedTotal: number,
  window: { from: Date; to: Date },
): BriefingData {
  const active = candidates.filter((o) => {
    const d = daysUntil(o.applicationDeadline);
    return o.status !== "cancelled" && (d === undefined || d >= 0);
  });
  const byScore = [...active].sort((a, b) => b.totalScore - a.totalScore);

  const priorityItems = byScore.filter(
    (o) => o.recommendation === "strong-review" || o.recommendation === "review",
  );
  const inPriority = new Set(priorityItems.map((o) => o.id));
  const rest = byScore.filter((o) => !inPriority.has(o.id));

  const pick = (pred: (o: Opportunity) => boolean) => rest.filter(pred);

  return {
    generatedAtKst: kstDateTimeString(),
    collectionWindow: {
      from: kstDateTimeString(new Date(window.from.getTime() + 9 * 3600_000)),
      to: kstDateTimeString(new Date(window.to.getTime() + 9 * 3600_000)),
    },
    summary: {
      fetchedTotal,
      candidateTotal: active.length,
      priorityCount: priorityItems.length,
      deadlineSoonCount: active.filter((o) => {
        const d = daysUntil(o.applicationDeadline);
        return d !== undefined && d >= 0 && d <= 7;
      }).length,
      changedCount: changes.length,
      failedSources: runs.filter((r) => r.status === "failed").map((r) => r.sourceId),
    },
    priorityItems,
    directBidItems: pick((o) => o.category === "direct-bid"),
    registrationLeads: pick(
      (o) =>
        o.category === "registration" ||
        o.category === "real-estate" ||
        o.category === "trust" ||
        o.category === "corporate" ||
        o.category === "debt-court-document",
    ),
    collaborationItems: pick((o) => o.category === "collaboration"),
    lectureItems: pick((o) => o.category === "lecture"),
    marketSignals: pick(
      (o) => o.category === "auction-public-sale" || o.category === "market-signal",
    ),
    changedItems: changes,
    runs,
  };
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const window = collectionWindow();
  const state = loadState();
  const nowIso = new Date().toISOString();
  const runs: CollectionRun[] = [];
  const allNotices: RawNotice[] = [];
  let fetchedTotal = 0;

  if (options.fixturePath) {
    const started = Date.now();
    const notices = loadFixtureNotices(options.fixturePath);
    allNotices.push(...notices);
    fetchedTotal = notices.length;
    runs.push({
      runId: `fixture-${started}`,
      startedAt: nowIso,
      finishedAt: new Date().toISOString(),
      sourceId: "fixture",
      status: "success",
      fetchedCount: notices.length,
      newCount: 0,
      updatedCount: 0,
      durationMs: Date.now() - started,
    });
    console.log(`[fixture] ${notices.length}건 로드: ${options.fixturePath}`);
  } else {
    const serviceKey = process.env.G2B_SERVICE_KEY?.trim();
    if (!serviceKey) {
      console.error(
        "G2B_SERVICE_KEY 환경변수가 없습니다. 공공데이터포털에서 '나라장터 입찰공고정보서비스'와 '누리장터 민간입찰공고서비스'를 각각 활용신청한 뒤 Decoding 키를 등록하세요.",
      );
      console.error("오프라인 확인: npx tsx collector/main.ts --dry-run --fixture collector/tests/fixtures/g2b-servc-sample.json");
      process.exitCode = 1;
      return;
    }
    console.log(`[api] 서비스키 ${maskSecret(serviceKey)} 사용, 조회기간 ${kstDateString(new Date(window.from.getTime() + 9 * 3600_000))} ~ ${kstDateString(new Date(window.to.getTime() + 9 * 3600_000))}`);

    for (const source of getEnabledApiSources()) {
      const started = Date.now();
      const startedAt = new Date().toISOString();
      try {
        const result = await collectSource(source, window, serviceKey);
        allNotices.push(...result.items);
        fetchedTotal += result.fetchedCount;
        runs.push({
          runId: `${source.id}-${started}`,
          startedAt,
          finishedAt: new Date().toISOString(),
          sourceId: source.id,
          status: "success",
          fetchedCount: result.fetchedCount,
          newCount: 0,
          updatedCount: 0,
          responseStatus: result.responseStatus,
          durationMs: Date.now() - started,
        });
        console.log(`[${source.id}] ${result.fetchedCount}건 수집`);
      } catch (err) {
        // 소스 하나의 실패가 전체 브리핑을 중단하지 않는다.
        const message = err instanceof Error ? err.message : String(err);
        runs.push({
          runId: `${source.id}-${started}`,
          startedAt,
          finishedAt: new Date().toISOString(),
          sourceId: source.id,
          status: "failed",
          fetchedCount: 0,
          newCount: 0,
          updatedCount: 0,
          errorMessage: message.slice(0, 300),
          durationMs: Date.now() - started,
        });
        const last = lastSuccessAt(state, source.id);
        console.error(
          `[${source.id}] 수집 실패: ${message}${last ? ` (마지막 정상 수집 ${last})` : ""}`,
        );
      }
    }
  }

  // 분류 → 점수화 → 중복 병합
  const changes: OpportunityChange[] = [];
  const newCandidates: Opportunity[] = [];
  let newCount = 0;
  let updatedCount = 0;

  for (const notice of allNotices) {
    const cls = classifyNotice(notice);
    if (!isCandidate(cls)) continue;
    const score = scoreNotice(notice, cls);
    const incoming = toOpportunity(notice, cls, score, nowIso);
    const existing = state.opportunities[incoming.id];
    const { merged, isNew, change } = mergeWithExisting(incoming, existing, nowIso);
    state.opportunities[merged.id] = merged;
    if (isNew) {
      newCount += 1;
      newCandidates.push(merged);
    } else if (change) {
      updatedCount += 1;
      changes.push(change);
    }
  }
  // 실행 로그에 신규·갱신 수 반영
  for (const run of runs) {
    if (run.status === "success") {
      run.newCount = newCount;
      run.updatedCount = updatedCount;
      break;
    }
  }

  const briefing = buildBriefing(newCandidates, changes, runs, fetchedTotal, window);

  // 출력물 저장 (미리보기·아카이브)
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const dateTag = kstDateString();
  const htmlPath = join(OUTPUT_DIR, `briefing-${dateTag}.html`);
  writeFileSync(htmlPath, renderHtml(briefing), "utf8");
  writeFileSync(join(OUTPUT_DIR, `briefing-${dateTag}.txt`), renderText(briefing), "utf8");
  writeFileSync(
    join(OUTPUT_DIR, `briefing-${dateTag}.json`),
    JSON.stringify(briefing, null, 2),
    "utf8",
  );

  console.log(`\n제목: ${buildSubject(briefing)}`);
  console.log(
    `요약: 수집 ${fetchedTotal}건 → 후보 ${briefing.summary.candidateTotal}건 (우선 검토 ${briefing.summary.priorityCount}건, 변경 ${changes.length}건)`,
  );
  console.log(`미리보기: ${htmlPath}`);

  // 이메일 발송 (중복 발송 방지: KST 기준 하루 1회)
  if (options.dryRun) {
    console.log("--dry-run: 이메일을 발송하지 않습니다.");
  } else if (state.lastEmailKstDate === dateTag && !options.forceEmail) {
    console.log(`오늘(${dateTag}) 이미 발송됨 — 중복 발송 방지. 강제 발송은 --force-email.`);
  } else {
    const weekdaysOnly = process.env.BID_WEEKDAYS_ONLY === "true";
    const dayOfWeek = new Date(Date.now() + 9 * 3600_000).getUTCDay();
    if (weekdaysOnly && (dayOfWeek === 0 || dayOfWeek === 6)) {
      console.log("BID_WEEKDAYS_ONLY=true — 주말에는 발송하지 않습니다.");
    } else {
      const result = await sendBriefingEmail(briefing);
      console.log(result.detail);
      if (result.sent) {
        state.lastEmailKstDate = dateTag;
      } else if (!result.detail.includes("환경변수")) {
        // 발송 설정이 있는데 실패한 경우만 실패로 처리
        process.exitCode = 1;
      }
    }
  }

  appendRuns(state, runs);
  saveState(state);

  // 모든 소스가 실패했으면 워크플로에서 감지되도록 실패 코드 반환.
  // (신규 공고 0건은 실패가 아니다.)
  const allFailed = runs.length > 0 && runs.every((r) => r.status === "failed");
  if (allFailed) {
    console.error("모든 수집 소스가 실패했습니다.");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("실행 오류:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
