import crypto from "node:crypto";

/**
 * 페이지별 '의미 있는 콘텐츠' 지문 — lastmod 갱신 판단용.
 *
 * 포함: title, meta description, H1, <main> 안의 문장(스크립트·RSC 제외).
 * 제외: <main> 밖(메뉴·푸터), 그리고 전체 페이지의 15% 이상에 같은 문장으로 나오는 공통 블록
 *       (상담 패널·신뢰 패널·저작권 연도 등). 공백·인코딩·순서를 정규화해 결정적으로 계산한다.
 */
export const BOILERPLATE_SHARE = 0.15;

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
const clean = (s) => decode(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().normalize("NFC");

/** HTML → { head: [title, description, h1...], sentences: [...] } */
export function extractPageText(html) {
  const head = (html.match(/<head[\s\S]*?<\/head>/i) || [""])[0];
  const title = clean((head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  const description = decode(((head.match(/<meta[^>]+name="description"[^>]*>/i) || [""])[0].match(/content="([^"]*)"/) || [])[1] || "");
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, "");
  const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => clean(m[1]));
  const main = (body.match(/<main[\s\S]*<\/main>/i) || [""])[0];
  const sentences = [
    ...new Set(
      main
        .replace(/<(br|\/p|\/li|\/h[1-6]|\/div|\/td|\/th|\/dt|\/dd|\/summary|\/a|\/button)[^>]*>/gi, "\n")
        .split(/\n+/)
        .map(clean)
        .filter((s) => s.length >= 2),
    ),
  ];
  return { head: [`title:${title}`, `description:${description.normalize("NFC")}`, ...h1.map((h) => `h1:${h}`)], sentences };
}

/** { route: {head, sentences} } → { route: fingerprint } */
export function buildFingerprints(pages) {
  const routes = Object.keys(pages).sort();
  const df = new Map();
  for (const r of routes) for (const s of pages[r].sentences) df.set(s, (df.get(s) || 0) + 1);
  const limit = Math.max(2, Math.ceil(routes.length * BOILERPLATE_SHARE));
  const out = {};
  for (const r of routes) {
    const own = pages[r].sentences.filter((s) => df.get(s) < limit).sort();
    out[r] = crypto.createHash("sha256").update([...pages[r].head, ...own].join("\n")).digest("hex").slice(0, 20);
  }
  return out;
}

/**
 * 이전 지문·manifest와 현재 지문을 비교해 바뀐 route만 date로 갱신한다(순수 함수).
 * 새 route는 지문만 기록하고 날짜는 정하지 않는다(근거가 없으면 생략 원칙).
 */
export function applyFingerprintUpdate({ previous, routes, current, date, onlyRoutes }) {
  const nextRoutes = { ...routes };
  const changed = [];
  const added = [];
  for (const [r, fp] of Object.entries(current)) {
    if (onlyRoutes && !onlyRoutes.has(r)) continue;
    if (previous[r] === undefined) added.push(r);
    else if (previous[r] !== fp) {
      changed.push(r);
      nextRoutes[r] = date;
    }
  }
  const nextFingerprints = { ...previous };
  for (const [r, fp] of Object.entries(current)) if (!onlyRoutes || onlyRoutes.has(r)) nextFingerprints[r] = fp;
  return { routes: nextRoutes, fingerprints: nextFingerprints, changed, added };
}
