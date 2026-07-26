/**
 * 누리장터(조달청) 민간입찰공고서비스 수집기.
 *
 * 공공데이터포털 "조달청_누리장터 민간입찰공고서비스" Open API 사용.
 * - Base: https://apis.data.go.kr/1230000/ao/PrvtBidNtceService
 * - 오퍼레이션 예: getPrvtBidPblancListInfoServc (용역)
 *
 * 나라장터(공공 수요기관)와 다른 민간 공고를 다룬다.
 * 예: 아파트관리사무소, 영리법인 등 나라장터 수요기관으로 등록할 수 없는 발주자.
 *
 * 주의: 나라장터 API와 필드명이 다르다 (bidNtceNm → ntceNm, bidNtceDt → nticeDt).
 * inqryDiv: 1=등록일시, 2=공고게시일시, 3=개찰일시, 4=입찰공고번호
 * → 나라장터와 맞추기 위해 공고게시일시(2)로 기간 조회한다.
 *
 * 별도 활용신청이 필요하다 (동일 계정 키라도 서비스별 승인 필수).
 */

import type { BidSource, RawNotice } from "../types";
import { parseAmount, parseNoticeDate, sleep, toG2bDateTime } from "../util";
import {
  parseG2bResponse,
  resolveApiUrl,
  type G2bCollectResult,
} from "./g2b";

const USER_AGENT = "daom-bid-monitor/1.0 (contact: site admin; purpose: daily briefing)";
const PAGE_SIZE = 100;
const MAX_PAGES = 30;
const MAX_RETRIES = 3;
const FETCH_TIMEOUT_MS = 30_000;

type NuriItem = Record<string, unknown>;

function str(item: NuriItem, key: string): string | undefined {
  const v = item[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  if (typeof v === "number") return String(v);
  return undefined;
}

async function fetchWithRetry(url: string): Promise<{ status: number; body: string }> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    if (attempt > 0) await sleep(1000 * 2 ** (attempt - 1));
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      const body = await res.text();
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`HTTP ${res.status}`);
        continue;
      }
      return { status: res.status, body };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError ?? new Error("fetch failed");
}

/**
 * 누리장터 응답 항목을 RawNotice로 정규화.
 * 아파트단지 정보가 있으면 bodyText·조직명에 반영해 분류·점수에 쓰이게 한다.
 */
export function normalizeNuriItem(item: NuriItem, source: BidSource): RawNotice | null {
  const title = str(item, "ntceNm") ?? str(item, "bidNtceNm");
  const noticeNumber = str(item, "bidNtceNo");
  if (!title || !noticeNumber) return null;

  const revision = str(item, "bidNtceOrd") ?? "00";
  const aptName = str(item, "aptHsmpNm");
  const orgBase = str(item, "ntceInsttNm") ?? "발주자 미확인";
  const organization = aptName ? `${orgBase} (${aptName})` : orgBase;

  const regionRaw =
    str(item, "rgnLmtDivNm") ??
    str(item, "prtcptLmtRgnNm") ??
    str(item, "prtcptPsblRgnNm");
  const regions = regionRaw
    ? regionRaw.split(/[,/]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const qualifications: string[] = [];
  const bidQlfct = str(item, "bidQlfctNm");
  if (bidQlfct) qualifications.push(`입찰자격: ${bidQlfct}`);
  if (str(item, "sptDscrptDt")) qualifications.push("현장설명회 있음 — 원문 확인");

  const attachmentUrls: string[] = [];
  const attachmentNames: string[] = [];
  for (let i = 1; i <= 10; i += 1) {
    const u = str(item, `ntceSpecDocUrl${i}`);
    if (u) {
      attachmentUrls.push(u);
      attachmentNames.push(
        str(item, `ntceSpecDocNm${i}`) ??
          str(item, `ntceSpecFileNm${i}`) ??
          `첨부 ${i}`,
      );
    }
  }

  const bodyParts = [
    str(item, "bidNtceClsfc") ? `분류: ${str(item, "bidNtceClsfc")}` : "",
    aptName ? `아파트단지: ${aptName}` : "",
    str(item, "aptCeoAdrs") ? `단지주소: ${str(item, "aptCeoAdrs")}` : "",
    str(item, "aptHshldNum") ? `세대수: ${str(item, "aptHshldNum")}` : "",
    str(item, "servcDtlList") ? `용역상세: ${str(item, "servcDtlList")}` : "",
  ].filter(Boolean);

  const detailUrl =
    str(item, "bidNtceDtlUrl") ??
    str(item, "bidNtceUrl") ??
    str(item, "bssAmtDtlScrnUrl");

  const noticeKind =
    str(item, "ntceDivNm") ?? str(item, "ntceKindNm") ?? str(item, "rbidDivNm");

  return {
    sourceId: source.id,
    sourceName: source.name,
    externalId: `${noticeNumber}-${revision}`,
    noticeNumber,
    revision,
    title,
    organization,
    demandOrganization: aptName ?? orgBase,
    bodyText: bodyParts.join("\n") || undefined,
    publishedAt: parseNoticeDate(item["nticeDt"] ?? item["bidNtceDt"] ?? item["rgstDt"]),
    applicationStartAt: parseNoticeDate(item["bidBeginDt"]),
    applicationDeadline: parseNoticeDate(item["bidClseDt"]),
    openingAt: parseNoticeDate(item["opengDt"]),
    estimatedAmount:
      parseAmount(item["refAmt"]) ??
      parseAmount(item["asignBdgtAmt"]) ??
      parseAmount(item["presmptPrce"]),
    regionRequirements: regions,
    qualificationRequirements: qualifications,
    contractMethod: str(item, "cntrctMthdNm") ?? str(item, "cntrctCnclsMthdNm"),
    noticeKind,
    isReNotice: /재공고|재입찰/.test(noticeKind ?? "") || str(item, "rbidDivNm") === "Y",
    originalUrl:
      detailUrl ??
      `https://www.g2b.go.kr/index.jsp?kwd=${encodeURIComponent(noticeNumber)}`,
    attachmentUrls,
    attachmentNames,
    raw: undefined,
  };
}

export async function collectNuri(
  source: BidSource,
  window: { from: Date; to: Date },
  serviceKey: string,
): Promise<G2bCollectResult> {
  const apiUrl = resolveApiUrl(source);
  if (!apiUrl) throw new Error(`source ${source.id}: apiUrl missing`);

  const items: RawNotice[] = [];
  let fetched = 0;
  let lastStatus: number | undefined;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    // 누리장터: inqryDiv=2 → 공고게시일시 기간 조회
    const params = new URLSearchParams({
      pageNo: String(page),
      numOfRows: String(PAGE_SIZE),
      inqryDiv: "2",
      inqryBgnDt: toG2bDateTime(new Date(window.from.getTime() + 9 * 3600_000)),
      inqryEndDt: toG2bDateTime(new Date(window.to.getTime() + 9 * 3600_000)),
      type: "json",
    });
    const url = `${apiUrl}?serviceKey=${encodeURIComponent(serviceKey)}&${params.toString()}`;

    const { status, body } = await fetchWithRetry(url);
    lastStatus = status;
    if (status !== 200) {
      throw new Error(`Nuri HTTP ${status} (source ${source.id}, page ${page})`);
    }
    const parsed = parseG2bResponse(body);
    fetched += parsed.items.length;
    for (const raw of parsed.items) {
      const notice = normalizeNuriItem(raw, source);
      if (notice) items.push(notice);
    }
    const totalPages = Math.ceil(parsed.totalCount / PAGE_SIZE);
    if (page >= totalPages || parsed.items.length === 0) break;
    await sleep(source.requestIntervalMs ?? 400);
  }

  return { items, fetchedCount: fetched, responseStatus: lastStatus };
}
