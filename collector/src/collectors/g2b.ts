/**
 * 나라장터(조달청) 입찰공고정보서비스 수집기.
 *
 * 공공데이터포털 "조달청_나라장터 입찰공고정보서비스" Open API 사용.
 * - Base: https://apis.data.go.kr/1230000/ad/BidPublicInfoService
 * - 오퍼레이션: getBidPblancListInfoServcPPSSrch(용역) 등 (sources.ts의 apiUrl)
 * - inqryDiv=1 (공고게시일시 기간 조회), inqryBgnDt/inqryEndDt=YYYYMMDDHHmm
 * - 응답: JSON (type=json)
 *
 * 엔드포인트가 변경되면 환경변수 G2B_API_BASE 또는 sources.ts만 수정한다.
 * 요청 제한: 페이지 간 지연·지수 백오프·최대 페이지 수 제한을 지킨다.
 */

import type { BidSource, RawNotice } from "../types";
import { parseAmount, parseNoticeDate, sleep, toG2bDateTime } from "../util";

const USER_AGENT = "daom-bid-monitor/1.0 (contact: site admin; purpose: daily briefing)";
const PAGE_SIZE = 100;
const MAX_PAGES = 30;
const MAX_RETRIES = 3;
const FETCH_TIMEOUT_MS = 30_000;

type G2bItem = Record<string, unknown>;

export type G2bCollectResult = {
  items: RawNotice[];
  fetchedCount: number;
  responseStatus?: number;
};

function str(item: G2bItem, key: string): string | undefined {
  const v = item[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  if (typeof v === "number") return String(v);
  return undefined;
}

/** apiUrl에 G2B_API_BASE 오버라이드를 적용한다 (API 이관 대비). */
export function resolveApiUrl(source: BidSource): string {
  const url = source.apiUrl ?? "";
  const override = process.env.G2B_API_BASE?.trim();
  if (!override) return url;
  const marker = "/1230000/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;
  return override.replace(/\/$/, "") + url.slice(idx + marker.length - 1);
}

async function fetchWithRetry(
  url: string,
): Promise<{ status: number; body: string }> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    if (attempt > 0) {
      // 지수 백오프: 1s → 2s → 4s
      await sleep(1000 * 2 ** (attempt - 1));
    }
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

type ParsedPage = { items: G2bItem[]; totalCount: number };

/**
 * data.go.kr 응답 파싱. 인증 오류 시 JSON 대신 XML(OpenAPI_ServiceResponse)이
 * 올 수 있으므로 방어적으로 처리한다.
 */
export function parseG2bResponse(body: string): ParsedPage {
  const trimmed = body.trim();
  if (trimmed.startsWith("<")) {
    const reason = trimmed.match(/<returnAuthMsg>([^<]+)<\/returnAuthMsg>/)?.[1]
      ?? trimmed.match(/<errMsg>([^<]+)<\/errMsg>/)?.[1]
      ?? "unexpected XML response";
    throw new Error(`G2B API error: ${reason}`);
  }
  const json = JSON.parse(trimmed) as {
    response?: {
      header?: { resultCode?: string; resultMsg?: string };
      body?: {
        items?: G2bItem[] | { item?: G2bItem | G2bItem[] } | null;
        totalCount?: number | string;
      };
    };
  };
  const header = json.response?.header;
  if (header?.resultCode && header.resultCode !== "00") {
    throw new Error(`G2B API resultCode ${header.resultCode}: ${header.resultMsg ?? ""}`);
  }
  const bodyNode = json.response?.body;
  const rawItems = bodyNode?.items;
  let items: G2bItem[] = [];
  if (Array.isArray(rawItems)) {
    items = rawItems;
  } else if (rawItems && typeof rawItems === "object") {
    const inner = (rawItems as { item?: G2bItem | G2bItem[] }).item;
    if (Array.isArray(inner)) items = inner;
    else if (inner) items = [inner];
  }
  const totalCount = Number(bodyNode?.totalCount ?? items.length) || items.length;
  return { items, totalCount };
}

export function normalizeG2bItem(item: G2bItem, source: BidSource): RawNotice | null {
  const title = str(item, "bidNtceNm");
  const noticeNumber = str(item, "bidNtceNo");
  if (!title || !noticeNumber) return null;

  const revision = str(item, "bidNtceOrd") ?? "00";
  const organization = str(item, "ntceInsttNm") ?? str(item, "dminsttNm") ?? "기관 미확인";
  const detailUrl = str(item, "bidNtceDtlUrl") ?? str(item, "bidNtceUrl");

  const regionRaw = str(item, "prtcptLmtRgnNm") ?? str(item, "prtcptPsblRgnNm");
  const regions = regionRaw
    ? regionRaw.split(/[,/]/).map((s) => s.trim()).filter(Boolean)
    : [];

  const qualifications: string[] = [];
  const permission = str(item, "permsnIndstrytyList") ?? str(item, "indstrytyLmtYn");
  if (permission) qualifications.push(`업종·면허: ${permission}`);
  const jointRaw = str(item, "cmmnSpldmdMethdNm") ?? str(item, "jntcontrctDutyRgnNm1");
  if (jointRaw) qualifications.push(`공동수급: ${jointRaw}`);

  // 첨부: bidNtceDtlUrl 외에 ntceSpecDocUrl1~10 / ntceSpecFileNm1~10 패턴
  const attachmentUrls: string[] = [];
  const attachmentNames: string[] = [];
  for (let i = 1; i <= 10; i += 1) {
    const u = str(item, `ntceSpecDocUrl${i}`);
    if (u) {
      attachmentUrls.push(u);
      attachmentNames.push(str(item, `ntceSpecFileNm${i}`) ?? `첨부 ${i}`);
    }
  }

  return {
    sourceId: source.id,
    sourceName: source.name,
    externalId: `${noticeNumber}-${revision}`,
    noticeNumber,
    revision,
    title,
    organization,
    demandOrganization: str(item, "dminsttNm"),
    publishedAt: parseNoticeDate(item["bidNtceDt"]),
    applicationStartAt: parseNoticeDate(item["bidBeginDt"]),
    applicationDeadline: parseNoticeDate(item["bidClseDt"]),
    openingAt: parseNoticeDate(item["opengDt"]),
    estimatedAmount:
      parseAmount(item["presmptPrce"]) ?? parseAmount(item["asignBdgtAmt"]),
    regionRequirements: regions,
    qualificationRequirements: qualifications,
    contractMethod: str(item, "cntrctCnclsMthdNm"),
    noticeKind: str(item, "ntceKindNm"),
    isReNotice: str(item, "reNtceYn") === "Y",
    originalUrl:
      detailUrl ??
      `https://www.g2b.go.kr:8101/ep/invitation/publish/bidInfoDtl.do?bidno=${encodeURIComponent(noticeNumber)}&bidseq=${encodeURIComponent(revision)}`,
    attachmentUrls,
    attachmentNames,
    raw: undefined,
  };
}

/**
 * 기간 내 공고 전체를 페이지네이션으로 수집한다.
 */
export async function collectG2b(
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
    const params = new URLSearchParams({
      pageNo: String(page),
      numOfRows: String(PAGE_SIZE),
      inqryDiv: "1",
      inqryBgnDt: toG2bDateTime(new Date(window.from.getTime() + 9 * 3600_000)),
      inqryEndDt: toG2bDateTime(new Date(window.to.getTime() + 9 * 3600_000)),
      type: "json",
    });
    // serviceKey는 Decoding 키를 그대로 encodeURIComponent 처리해 전달한다.
    const url = `${apiUrl}?serviceKey=${encodeURIComponent(serviceKey)}&${params.toString()}`;

    const { status, body } = await fetchWithRetry(url);
    lastStatus = status;
    if (status !== 200) {
      throw new Error(`G2B HTTP ${status} (source ${source.id}, page ${page})`);
    }
    const parsed = parseG2bResponse(body);
    fetched += parsed.items.length;
    for (const raw of parsed.items) {
      const notice = normalizeG2bItem(raw, source);
      if (notice) items.push(notice);
    }
    const totalPages = Math.ceil(parsed.totalCount / PAGE_SIZE);
    if (page >= totalPages || parsed.items.length === 0) break;
    await sleep(source.requestIntervalMs ?? 400);
  }

  return { items, fetchedCount: fetched, responseStatus: lastStatus };
}
