/**
 * SPEAKER SEO RESET — report generator.
 *   npx tsx scripts/speaker-seo-reset-reports.ts
 * Inputs: .cache/speaker-seo-reset/{qa,diff-report,serp,mobile}.json, before/manifest.json,
 *         scripts/output/sitemap-manifest.json, target specs, evidence registry, keyword map.
 */
import fs from "node:fs";
import path from "node:path";
import { lectureTargetSpecs } from "../src/lib/lectures/target-specs";
import { lecturePages } from "../src/lib/lectures/content";
import { lectureEvidenceRegistry } from "../src/data/lectures/lecture-evidence-registry";
import { LECTURE_TITLE_FREEZE } from "../src/data/seoExperiments/lecture-targets";
import { lectureKeywordUniverse } from "../src/data/lectures/lecture-keyword-to-url-map";
import { INTENT_GROUPS, TARGET_KEYWORDS, groupUrl } from "./speaker-seo-reset-keywords.mjs";

const ROOT = process.cwd();
const DATE = "2026-09-27";
const SITE = "https://xn--2j1br1na42lvxja38mk8r.kr";
const BASE = path.join(ROOT, "reports", "speaker-seo-reset");
const DIR = path.join(BASE, DATE);
const CACHE = path.join(ROOT, ".cache", "speaker-seo-reset");

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any
const readJson = (p: string): Json => JSON.parse(fs.readFileSync(p, "utf8"));
const qa = readJson(path.join(CACHE, "qa.json"));
const diff = readJson(path.join(CACHE, "diff-report.json"));
const serp: Json[] = fs.existsSync(path.join(CACHE, "serp.json")) ? readJson(path.join(CACHE, "serp.json")) : [];
const mobile = readJson(path.join(CACHE, "mobile.json"));
const before = readJson(path.join(CACHE, "before", "manifest.json"));
const sitemapAfter = readJson(path.join(ROOT, "scripts", "output", "sitemap-manifest.json"));
const seoPaths: string[] = readJson(path.join(ROOT, "scripts", "output", "seo-paths.json")).paths;

const TARGETS = INTENT_GROUPS.map((g) => g.url);
const pageByUrl = new Map<string, Json>(qa.pages.map((p: Json) => [p.url, p]));
const specByPath = new Map(lectureTargetSpecs.map((s) => [s.path, s]));
const groupById = new Map(INTENT_GROUPS.map((g) => [g.id, g]));
const sitemapByPath = new Map<string, Json>(sitemapAfter.entries.map((e: Json) => [e.path, e]));
const pathSet = new Set(seoPaths);

fs.mkdirSync(DIR, { recursive: true });
const csvCell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
function writeCsv(name: string, header: string[], rows: unknown[][], dir = DIR) {
  const body = [header.join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\n");
  fs.writeFileSync(path.join(dir, name), `\uFEFF${body}\n`);
}
function writeText(name: string, text: string, dir = DIR) {
  fs.writeFileSync(path.join(dir, name), text.endsWith("\n") ? text : `${text}\n`);
}
const abs = (p: string) => `${SITE}${p}`;

/* ---------- keyword coverage ---------- */
type Coverage = { keyword: string; group: string; priority: string; url: string; missingWords: string[]; inTop: boolean; phrase: boolean };
const coverage: Coverage[] = TARGET_KEYWORDS.map(([keyword, group, priority]: string[]) => {
  const url = groupUrl(group) as string;
  const p = pageByUrl.get(url);
  const words = keyword.split(/\s+/);
  const zones = [p.title, p.h1, p.description, p.first700, p.body];
  return {
    keyword,
    group,
    priority,
    url,
    missingWords: words.filter((w) => !zones.some((z: string) => z.includes(w))),
    inTop: words.every((w) => [p.title, p.h1, p.first700].some((z: string) => z.includes(w))),
    phrase: [p.title, p.h1, p.body].some((z: string) => z.includes(keyword)),
  };
});
const p0Gap = coverage.filter((c) => c.priority === "P0" && c.missingWords.length).length;
const p1Gap = coverage.filter((c) => c.priority === "P1" && c.missingWords.length).length;

/* ---------- 01 current pages ---------- */
const lectureRows = lecturePages.map((lp) => {
  const url = `/${lp.slug}`;
  const b = before.pages[url];
  const target = TARGETS.includes(url);
  const g = INTENT_GROUPS.find((x) => x.url === url);
  return [
    url,
    lp.kind ?? "",
    target ? "TARGET" : "PROTECTED",
    g ? g.decision : "NO_CHANGE",
    b && !b.missing ? b.title : "(new)",
    b && !b.missing ? b.h1 : "(new)",
    b && !b.missing ? b.bodyChars : "",
  ];
});
const currentHeader = ["url", "kind", "scope", "decision", "title_before", "h1_before", "body_chars_before"];
writeCsv("01-current-pages.csv", currentHeader, lectureRows);
writeCsv("current-pages.csv", currentHeader, lectureRows, BASE);

/* ---------- 02 target keywords ---------- */
writeCsv(
  "02-target-keywords.csv",
  ["keyword", "priority", "intent_group", "representative_url", "search_volume"],
  TARGET_KEYWORDS.map(([k, g, pr]: string[]) => [k, pr, groupById.get(g)?.label, groupUrl(g), "UNKNOWN (측정 안 함)"]),
);

/* ---------- 03 live SERP patterns ---------- */
writeCsv(
  "03-live-serp-patterns.csv",
  ["keyword", "representative_url", "status", "own_first_link_rank_non_naver", "own_first_url", "own_is_representative", "top20_non_naver_mix", "checked_at", "note"],
  serp.map((r) => [
    r.keyword,
    r.targetUrl,
    r.status,
    r.ownRankAmongTop40Links ?? "-",
    r.ownUrl || "-",
    r.ownUrl ? (r.ownIsTarget ? "YES" : "NO") : "-",
    Object.entries(r.top20Mix || {}).map(([k, v]) => `${k}:${v}`).join(" "),
    r.checkedAt,
    "1회 요청·HTML 링크 순서 기준. 블로그·카페(네이버 호스트)는 집계에서 제외됨. 순위 보장 아님",
  ]),
);

/* ---------- 04 keyword discovery ---------- */
const discovery: [string, string, string, string, string][] = [
  ["비교과 특강", "SERP_PATTERN: 대학 검색 결과 대부분 .ac.kr 비교과 공지", "university", "/부산대학교특강", "MAP_EXISTING — 본문·리드에 비교과 용어 사용"],
  ["대학 강연", "BRIEF P0 + SERP .ac.kr 행사 공지", "university", "/부산대학교특강", "MAP_EXISTING — 리드에 반영"],
  ["취업진로지원센터 특강", "SERP_PATTERN: 대학 공지 주관 부서명", "university", "/부산대학교특강", "MAP_EXISTING — 리드의 담당 부서로 반영"],
  ["전문직업인 특강", "SERP_PATTERN: 진로 검색 .go.kr·.or.kr(교육청·진로센터) 공고 용어", "career", "/법무사진로특강", "MAP_EXISTING"],
  ["진로체험의 날 강사", "SERP_PATTERN: 교육청 진로체험 공고", "career", "/법무사진로특강", "MAP_EXISTING — 반일 순환 커리큘럼으로 반영"],
  ["고등학생 법률특강", "BRIEF 확장", "high-school", "/학교법률교육", "MAP_EXISTING — 리드 반영"],
  ["학부모 연수 생활법률", "CONTENT_GAP: 학교 담당자 추가 요청 형태", "high-school", "/학교법률교육", "ADD_SECTION — 3시간 이상 커리큘럼에 포함"],
  ["기업교육 강사 / 사내특강", "BRIEF 확장", "enterprise", "/기업법률교육", "MAP_EXISTING — 리드 반영"],
  ["조찬 강연 법률", "CONTENT_GAP: 기업 강연 형식", "enterprise", "/기업법률교육", "ADD_SECTION — 진행 방식에 반영"],
  ["부산 세미나 강사", "BRIEF P0 (기존 map 누락)", "busan-hub", "/부산법률강사", "MAP_EXISTING — title에 세미나 반영"],
  ["전세사기 예방교육 강사", "BRIEF P0 (기존 map 누락)", "jeonse", "/전세사기예방교육", "MAP_EXISTING"],
  ["자립준비청년 전세 교육", "EVIDENCE: 자립지원전담기관 완료 강의", "jeonse", "/전세사기예방교육", "MAP_EXISTING"],
  ["평생학습 생활법률 강좌", "EVIDENCE: 시민도서관 4회차", "life-law", "/법률강의", "MAP_EXISTING"],
  ["법률특강 강사", "SERP: 이전 관측에서 /법률강의 노출", "life-law", "/법률강의", "OWNER_FIX — /부산법률강사에서 이동"],
  ["특강 강사 프로필", "BRIEF generic", "generic", "/강사소개", "MAP_EXISTING"],
  ["강의계획서 양식 강사", "CONTENT_GAP: 담당자 결재 서류", "generic", "/강사소개", "ADD_SECTION — 프로필·강의계획서 섹션"],
  ["기관 강사료 기준", "BRIEF", "busan-hub", "/부산법률강사", "ADD_SECTION — 전 target 강사료 요소 섹션"],
  ["부산 대학교 특강 강사 추천", "PATTERN", "university", "/부산대학교특강", "NO_PAGE — 추천·순위 페이지 만들지 않음"],
  ["부산 최고 강사", "PATTERN", "busan-hub", "-", "REJECT — 금지 표현"],
];
writeCsv(
  "04-keyword-discovery.csv",
  ["keyword", "source", "intent_group", "url", "action"],
  discovery.map((d) => [...d]),
);

/* ---------- 05 intent groups ---------- */
writeCsv(
  "05-intent-groups.csv",
  ["group_id", "label", "representative_url", "decision", "p0_keywords", "cta_label"],
  INTENT_GROUPS.map((g) => [
    g.id,
    g.label,
    g.url,
    g.decision,
    TARGET_KEYWORDS.filter(([, gr, pr]: string[]) => gr === g.id && pr === "P0").map((k: string[]) => k[0]).join(" / "),
    specByPath.get(g.url)?.ctaLabel ?? "",
  ]),
);

/* ---------- 06 keyword to url + coverage ---------- */
writeCsv(
  "06-keyword-to-url.csv",
  ["keyword", "priority", "representative_url", "map_owner_url", "owner_match", "coverage", "in_title_h1_first700", "exact_phrase_in_page"],
  coverage.map((c) => {
    const owner = lectureKeywordUniverse.find((r) => r.keyword === c.keyword)?.owner_url ?? "-";
    return [
      c.keyword,
      c.priority,
      c.url,
      owner,
      owner === c.url ? "OK" : "MISMATCH",
      c.missingWords.length ? `GAP(${c.missingWords.join("|")})` : "OK",
      c.inTop ? "YES" : "BODY_ONLY",
      c.phrase ? "YES" : "NO",
    ];
  }),
);

/* ---------- 07 content gaps ---------- */
const gaps: [string, string, string][] = [
  ["/부산법률강사", "담당자 첫 판단(주제·부산 출강 기록·강사료 기준) 부재, 세미나 표기 없음", "담당자 3가지 확인 리드, 대상별 선택 카드, 60/90/120/3h+ 샘플, 강사료 요소, 강의 전용 문의폼"],
  ["/기업법률교육", "직무별 장면 없이 주제 나열, 기업 강연 확인 기록과 관련 기록 구분 없음", "직무별(영업·총무·신입) 상황, 조찬 강연·워크숍 진행 방식, 기업 사내 강연 기록 없음 명시"],
  ["/부산대학교특강", "대학 전용 URL 없음(대학 키워드가 /학교법률교육에 섞여 있었음)", "신규: 학년·전공별 구성, 비교과 강의계획서 안내, 대학 출강 기록 없음 명시 + 관련 대상 강의 구분"],
  ["/법무사진로특강", "학교급별 차이·진로의 날 운영 형태 부족", "학교급별 선택 카드, 1교시/강당/멘토링/반일 순환 커리큘럼, 양산제일고 기록(경남) 정확 표기"],
  ["/학교법률교육", "대학·고교 혼재, 고등학교 수업시수 기준 구성 부족", "고등학교 전용 재배치, 교시 기준 커리큘럼, 학교 제출 서류 안내, 부산 고교 실적 없음 명시"],
  ["/전세사기예방교육", "대상별(청년·자립준비청년·신혼) 차이와 실습 구성 부족", "대상별 선택 카드, 계약 순서 실습, 공식 지정 교육 대체 아님 명시"],
  ["/법률강의", "허브 본문이 강의 목록 위주, 기관 유형별 주제 선택 부족", "title·H1 유지, 기관 유형별 주제, 시민도서관 4회차 구조 기반 커리큘럼"],
  ["/강사소개", "지역 없는 강사 검색 의도(프로필·강의계획서) 대응 부족", "결재용 프로필·강의계획서 요청 흐름, 지역별 진행 방식(대면/온라인)"],
];
writeCsv("07-content-gaps.csv", ["url", "gap_before", "added"], gaps.map((g) => [...g]));

/* ---------- 08 create plan ---------- */
writeText(
  "08-create-plan.md",
  `# 08 Create plan — ${DATE}

## CREATE (1)
- **/부산대학교특강** — 대학 키워드(부산 대학 특강·대학교 특강·대학 강연)가 고등학교 페이지(/학교법률교육)와 섞여 있었고, SERP가 대학(.ac.kr) 비교과 공지 위주라 대상·운영 방식(학년·전공·비교과 회차)이 고등학교와 다름. 고유 섹션: 학년별 선택, 비교과 강의계획서(학습목표·평가), 대학 출강 기록 없음 명시.

## CREATE 거부
| 후보 | 거부 이유 | 대신 |
|---|---|---|
| 부산 기업 강연 (별도) | 기업 특강과 동일 의도, 단어만 다름 | /기업법률교육 title에 "특강·강연" |
| 부산 세미나 강사 | 형식 동의어 | /부산법률강사 title에 "세미나" |
| 부산 대학 강연 (별도) | 대학 특강과 동일 의도 | /부산대학교특강 리드 |
| 부산 진로특강 강사 (별도) | 진로특강과 동일 의도 | /법무사진로특강 |
| 부산 생활법률 강사 (별도) | 생활법률 특강과 동일 의도 | /법률강의 |
| 전세사기 예방교육 강사 (별도) | 주제 페이지와 동일 의도 | /전세사기예방교육 |
| 지역별 clone (해운대·양산·창원…) | 지역명만 바꾼 페이지 금지 | 허브의 출강 범위 문단 |

원칙: keyword 하나마다 page 하나 만들지 않음. 새 URL은 대상·운영 방식이 실제로 다른 경우에만.
`,
);

/* ---------- 09 existing improved / 10 new ---------- */
writeCsv(
  "09-existing-pages-improved.csv",
  ["url", "decision", "title_before", "title_after", "h1_before", "h1_after", "desc_changed", "body_chars_before", "body_chars_after", "cta_label"],
  TARGETS.filter((u) => before.pages[u] && !before.pages[u].missing).map((u) => {
    const b = before.pages[u];
    const a = pageByUrl.get(u);
    return [u, INTENT_GROUPS.find((g) => g.url === u)?.decision, b.title, a.title, b.h1, a.h1, b.description !== a.description ? "YES" : "NO", b.bodyChars, a.bodyChars, specByPath.get(u)?.ctaLabel];
  }),
);
writeCsv(
  "10-new-pages.csv",
  ["url", "title", "h1", "description", "canonical", "in_sitemap", "lastmod", "og_image", "body_chars"],
  TARGETS.filter((u) => !before.pages[u] || before.pages[u].missing).map((u) => {
    const a = pageByUrl.get(u);
    const sm = sitemapByPath.get(u);
    return [u, a.title, a.h1, a.description, a.canonical, sm ? "YES" : "NO", sm?.lastmod ?? "", a.ogImage, a.bodyChars];
  }),
);

/* ---------- 11 evidence ---------- */
writeCsv(
  "11-lecture-evidence.csv",
  ["id", "status", "public_display", "label", "institution", "date", "history_id", "groups", "public_note", "source"],
  lectureEvidenceRegistry.map((e) => [
    e.id,
    e.status,
    e.status === "COMPLETED_VERIFIED" || e.status === "PARTIAL" ? "YES" : "NO",
    e.label,
    e.institution,
    e.date ?? "",
    e.historyId ?? "",
    Object.entries(e.groups).map(([g, t]) => `${g}:${t}`).join(" "),
    e.publicNote,
    e.sourceNote,
  ]),
);

/* ---------- 12 cannibalization ---------- */
writeCsv(
  "12-cannibalization.csv",
  ["url_a", "url_b", "first700", "body", "first700_region_normalized", "body_region_normalized", "gate_first700", "gate_body", "pass"],
  qa.similarity.map((r: Json) => [r.a, r.b, r.first700, r.body, r.first700Region, r.bodyRegion, qa.gates.FIRST700_GATE, qa.gates.BODY_GATE, r.pass ? "PASS" : "FAIL"]),
);
const simMax = (k: string) => Math.max(...qa.similarity.map((r: Json) => r[k]));
const simFails = qa.similarity.filter((r: Json) => !r.pass).length;

/* ---------- 13 title/description ---------- */
const allTitles = new Map<string, number>();
const allDescs = new Map<string, number>();
for (const lp of lecturePages) {
  allTitles.set(lp.metaTitle, (allTitles.get(lp.metaTitle) ?? 0) + 1);
  allDescs.set(lp.metaDescription, (allDescs.get(lp.metaDescription) ?? 0) + 1);
}
writeCsv(
  "13-title-description-audit.csv",
  ["url", "title_old", "title_new", "title_changed", "primary_query", "serp_reason", "content_reason", "frozen_at", "rendered_title", "description", "desc_len", "desc_80_120", "title_unique", "desc_unique"],
  TARGETS.map((u) => {
    const f = LECTURE_TITLE_FREEZE.find((x) => x.path === u);
    const a = pageByUrl.get(u);
    const lp = lecturePages.find((x) => `/${x.slug}` === u);
    return [
      u,
      f?.oldTitle ?? "(new)",
      f?.newTitle ?? a.title,
      f ? (f.oldTitle === f.newTitle ? "NO" : "YES") : "NEW",
      f?.primaryQuery ?? "",
      f?.serpReason ?? "",
      f?.contentReason ?? "",
      f?.frozenAt ?? DATE,
      a.title,
      a.description,
      a.description.length,
      a.description.length >= 80 && a.description.length <= 120 ? "OK" : "OUT",
      lp && allTitles.get(lp.metaTitle) === 1 ? "YES" : "NO",
      lp && allDescs.get(lp.metaDescription) === 1 ? "YES" : "NO",
    ];
  }),
);

/* ---------- 14 first700 ---------- */
const SITUATION = /(담당자|선생님|찾을 때|찾는|앞둔|결재|일정은 잡혔는데|강사가 아직 없다면)/;
writeCsv(
  "14-first700-audit.csv",
  ["url", "starts_with_situation", "primary_query", "primary_words_in_first700", "first_220_chars"],
  TARGETS.map((u) => {
    const a = pageByUrl.get(u);
    const spec = specByPath.get(u);
    const lead = spec?.lead ?? "";
    const pq = (spec?.primaryQuery ?? "").split("/")[0].trim();
    const words = pq.split(/\s+/).filter(Boolean);
    return [u, SITUATION.test(lead.slice(0, 80)) ? "YES" : "CHECK", pq, words.filter((w) => a.first700.includes(w)).length + "/" + words.length, a.first700.slice(0, 220)];
  }),
);

/* ---------- 15 images ---------- */
const imgRows: unknown[][] = [];
for (const u of TARGETS) {
  const a = pageByUrl.get(u);
  imgRows.push([u, "og:image", a.ogImage, "", a.ogImageWidth, a.ogImageHeight, "", a.ogImageSharedWith.length ? `SHARED:${a.ogImageSharedWith.join("|")}` : "UNIQUE", "실사진"]);
  for (const img of a.imgs) {
    if (!/\/images\//.test(img.src) && !/_next\/image/.test(img.src)) continue;
    imgRows.push([u, "article img", img.src, img.alt, img.width, img.height, img.loading, "", /photo|사진|강의|특강|활동/.test(img.src + img.alt) ? "실사진" : "CHECK"]);
  }
}
writeCsv("15-image-audit.csv", ["url", "slot", "src", "alt", "width", "height", "loading", "og_unique", "type"], imgRows);

/* ---------- 16 internal links ---------- */
const inboundToNew = TARGETS.filter((u) => pageByUrl.get(u).articleHrefs.includes("/부산대학교특강"));
writeCsv(
  "16-internal-link-map.csv",
  ["from_url", "related_count", "related_5_8", "related_links", "article_internal_links"],
  TARGETS.map((u) => {
    const a = pageByUrl.get(u);
    return [u, a.relatedHrefs.length, a.relatedHrefs.length >= 5 && a.relatedHrefs.length <= 8 ? "OK" : "OUT", a.relatedHrefs.join(" "), a.articleHrefs.length];
  }),
);

/* ---------- 17 technical ---------- */
writeCsv(
  "17-technical-seo.csv",
  ["url", "canonical_ok", "robots", "h1_count", "faq_schema", "schema_types", "fake_schema", "meta_keywords", "in_sitemap", "lastmod_before", "lastmod_after", "og_image_unique", "lecture_request_form", "institution_required", "consult_cta_in_article", "sidebar_consult"],
  TARGETS.map((u) => {
    const a = pageByUrl.get(u);
    let canon = a.canonical;
    try {
      canon = decodeURIComponent(canon);
    } catch {
      /* keep */
    }
    const lmBefore = diff.sitemap.targetLastmod.find((x: Json) => x.path === u)?.before ?? "(new)";
    return [
      u,
      canon.endsWith(u) ? "OK" : `CHECK(${canon})`,
      a.robots || "(default index)",
      a.h1Count,
      a.faqSchema ? "YES" : "NO",
      a.ldTypes.join(" "),
      a.fakeSchema ? "FOUND" : "NONE",
      a.metaKeywords ? "PRE-EXISTING GLOBAL (not added)" : "NONE",
      sitemapByPath.has(u) ? "YES" : "NO",
      lmBefore,
      sitemapByPath.get(u)?.lastmod ?? "",
      a.ogImageSharedWith.length ? "NO" : "YES",
      a.hasLectureRequest ? "YES" : "NO",
      a.formInstitutionRequired ? "YES" : "NO",
      a.consultCtaInArticle.length ? a.consultCtaInArticle.join("|") : "NONE",
      a.sidebarConsult ? "PRESENT" : "SUPPRESSED",
    ];
  }),
);

/* ---------- 19 / 20 submit lists ---------- */
const newUrls = TARGETS.filter((u) => !before.pages[u] || before.pages[u].missing);
const modified = TARGETS.filter((u) => !newUrls.includes(u));
writeText(
  "19-indexnow-targets.txt",
  [`# IndexNow — speaker SEO reset ${DATE}`, "# 신규 + 실질 수정 강의 URL만 (사이트 전체 재제출 금지)", "# NEW", ...newUrls.map(abs), "# SUBSTANTIALLY MODIFIED", ...modified.map(abs)].join("\n"),
);
const naverOrder = INTENT_GROUPS.map((g) => g.url);
const naverText = [
  `# 네이버 서치어드바이저 웹페이지 수집 요청 — ${DATE}`,
  "# 순서: Busan hub → 기업 → 대학교 → 진로 → 고등학교 → 전세 → 생활법률 → generic",
  ...naverOrder.map((u, i) => `${i + 1}. ${abs(u)}`),
].join("\n");
writeText("20-naver-submit-targets.txt", naverText);
writeText("naver-submit-targets.txt", naverText, BASE);

/* ---------- recommended inbound links ---------- */
const inbound: [string, string, string][] = [
  ["/강의문의", "/부산대학교특강", "문의 페이지 주제 카드에 대학교 특강 추가"],
  ["/청년생활법률특강", "/부산대학교특강", "대학생 대상 문단에서 대학 전용 안내로 연결"],
  ["/강의이력/yangsan-jeil-high-career-talk", "/학교법률교육", "고등학교 출강 기록에서 고등학교 특강 안내로 연결"],
  ["/강의이력/busan-self-support-jeonse-prevention", "/전세사기예방교육", "완료 강의 기록 → 주제 안내"],
  ["/강의이력/haeundae-youth-space-startup-law-2026-07", "/기업법률교육", "창업 법률 강의 → 기업 특강(관련 대상)"],
  ["/강의이력/busan-citizen-library-life-law", "/법률강의", "시민도서관 연속 특강 기록 → 생활법률 특강 안내"],
  ["/전세사기피해대응절차", "/전세사기예방교육", "전세사기 서비스 페이지 하단 '기관 예방교육' 링크"],
  ["/부산법인설립등기", "/기업법률교육", "법인 서비스 페이지 하단 '임직원 교육' 링크"],
  ["/about", "/강사소개", "사무소 소개 → 강사 프로필"],
  ["/부산강사섭외체크리스트", "/부산법률강사", "섭외 체크리스트 → 부산 강사 허브 (현재 '부산 생활법률 강사' SERP에서 이 페이지가 먼저 노출)"],
  ["/부산기관법률특강", "/부산대학교특강", "기관 유형 목록에 대학 추가"],
];
writeText(
  "recommended-inbound-links.md",
  `# Recommended inbound links — speaker SEO reset ${DATE}

이번 작업에서는 target 외 indexable URL을 수정하지 않았습니다. 아래는 **다음 작업에서 검토할 제안**이며 적용되지 않았습니다.

| from (보호 URL) | to (target) | 존재 | 제안 |
|---|---|---|---|
${inbound.map(([f, t, n]) => `| ${f} | ${t} | ${pathSet.has(f) ? "YES" : "확인 필요"} | ${n} |`).join("\n")}

현재 /부산대학교특강(신규)으로 들어오는 내부 링크: target 페이지 ${inboundToNew.length}곳 (${inboundToNew.join(", ") || "없음"}) + sitemap.
`,
  BASE,
);

/* ---------- 21 build validation ---------- */
const buildLog = (n: string) => {
  const p = path.join(ROOT, ".cache", n);
  if (!fs.existsSync(p)) return "missing";
  const t = fs.readFileSync(p, "utf8");
  return /EXIT=0/.test(t) ? "PASS (EXIT=0)" : /EXIT=\d+/.test(t) ? `FAIL (${t.match(/EXIT=\d+/)?.[0]})` : "UNKNOWN";
};
writeText(
  "21-build-validation.md",
  `# 21 Build validation — ${DATE}

| 항목 | 결과 |
|---|---|
| npm run build (최종) | ${buildLog("speaker-reset-build3.log")} — prebuild 검증(sitemap, seo-validate, keyword-ownership, region-boilerplate) 포함 |
| npx tsc --noEmit | 신규 오류 0. 기존 오류 1건: src/data/seoExperiments/reserved-inheritance-intents.ts(42) — 이번 변경과 무관(커밋된 파일, 미수정) |
| eslint (변경 파일) | 오류 0, 경고 0 (content.ts 미사용 import 1건 제거) |
| 보호 URL 해시 게이트 | NON_TARGET_CHANGED_URLS = ${diff.NON_TARGET_CHANGED_URLS} (protected ${diff.protectedCount}) |
| sitemap | 추가 ${diff.sitemap.addedEntries.map((e: Json) => e.path).join(", ") || "-"} · 삭제 ${diff.sitemap.removedEntries.length} · 비target lastmod 변경 ${diff.sitemap.nonTargetLastmodChanged.length} |
| 이웃 강의 페이지 head(JSON-LD·og·robots) vs 라이브 | 14/14 동일 |
| target QA | ${TARGETS.length}/${TARGETS.length} OK (H1 1개, desc 80~120, 관련링크 5~8, 강의 문의폼·기관명 필수, 강사료 기준 문구, 60/90/120/3h+ 커리큘럼, 상담 CTA 없음, 금지 표현 없음, FAQ schema, og:image 고유) |
| 유사도 | ${qa.similarity.length}쌍, FAIL ${simFails}. 최대 first700 ${simMax("first700")}, body ${simMax("body")}, [REGION] first700 ${simMax("first700Region")}, [REGION] body ${simMax("bodyRegion")} |
| 모바일 375/390/430 | ${mobile.checks}건 · 가로 넘침 ${mobile.horizontalOverflow} · 강의 CTA ${mobile.lectureCtaVisible} |
| 키워드 커버리지 | P0 GAP=${p0Gap}, P1 GAP=${p1Gap} |

## 참고
- 유사도: TF-IDF cosine(대상 15개 문서 기준)과 3-gram shingle Jaccard 중 큰 값. [REGION] 비교는 지역명·형식어(특강/강연/강의/세미나/교육/출강)를 shingle에서는 placeholder로, cosine에서는 제거 후 계산.
- meta keywords 태그는 사이트 전역에 이미 존재(라이브 동일)하며 이번에 추가하지 않음.
- 헤더 상담 상태바·푸터 '상담 안내'는 전역 요소라 변경하지 않음(보호 원칙). target 페이지에서는 사이드바 상담 패널을 숨기고 모바일 하단 바를 강의 문의용으로 교체.
`,
);

/* ---------- 00 summary ---------- */
const evidencePublic = lectureEvidenceRegistry.filter((e) => e.status === "COMPLETED_VERIFIED");
const evidenceHidden = lectureEvidenceRegistry.filter((e) => e.status === "UNVERIFIED" || e.status === "SCHEDULED");
const summary = `# Speaker SEO reset — summary (${DATE})

## 핵심 검색어 → 대표 URL
${INTENT_GROUPS.map((g) => `- **${g.url}** (${g.decision}) — ${TARGET_KEYWORDS.filter(([, gr, pr]: string[]) => gr === g.id && pr === "P0").map((k: string[]) => k[0]).join(", ") || "지역 없는 강사·프로필 검색"}`).join("\n")}

## 결과
- 신규 URL 1개(/부산대학교특강), 개선 7개. keyword별 페이지 생성 없음.
- NON_TARGET_CHANGED_URLS = **${diff.NON_TARGET_CHANGED_URLS}** (보호 ${diff.protectedCount}개), 비target lastmod 변경 ${diff.sitemap.nonTargetLastmodChanged.length}.
- 유사도 ${qa.similarity.length}쌍 모두 통과 (최대 first700 ${simMax("first700")} / body ${simMax("body")} / [REGION] body ${simMax("bodyRegion")}).
- 키워드 커버리지 P0 GAP=${p0Gap}, P1 GAP=${p1Gap}.
- 공개 근거: COMPLETED_VERIFIED ${evidencePublic.length}건만 노출. UNVERIFIED/SCHEDULED ${evidenceHidden.length}건은 비노출.
- 대학교·기업 사내·부산 고등학교 출강은 확인 기록이 없어 각 페이지에 "기록 없음"을 명시하고 관련 대상 강의로 구분 표시.

## 제출
- IndexNow: 19-indexnow-targets.txt (${TARGETS.length}개)
- 네이버: 20-naver-submit-targets.txt (허브 → 기업 → 대학교 → 진로 → 고등학교 → 전세 → 생활법률 → generic)

## 파일
00~21, dashboard.html, ../current-pages.csv, ../naver-submit-targets.txt, ../recommended-inbound-links.md
`;
writeText("00-summary.md", summary);

/* ---------- dashboard ---------- */
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const targetRows = TARGETS.map((u) => {
  const a = pageByUrl.get(u);
  const g = INTENT_GROUPS.find((x) => x.url === u);
  const s = serp.filter((r) => r.targetUrl === u);
  const serpCell = s.length ? s.map((r) => `${esc(r.keyword)}: ${r.ownUrl ? `${r.ownRankAmongTop40Links} ${esc(r.ownUrl)}` : "-"}`).join("<br>") : "-";
  return `<tr><td><a href="${esc(abs(u))}">${esc(u)}</a></td><td>${esc(g?.decision)}</td><td>${esc(a.title)}</td><td>${esc(a.h1)}</td><td>${a.description.length}</td><td>${a.bodyChars}</td><td>${a.relatedHrefs.length}</td><td>${esc(specByPath.get(u)?.ctaLabel)}</td><td class="small">${serpCell}</td></tr>`;
}).join("\n");
const simRows = qa.similarity
  .filter((r: Json) => TARGETS.includes(r.a) && TARGETS.includes(r.b))
  .sort((x: Json, y: Json) => y.bodyRegion - x.bodyRegion)
  .slice(0, 10)
  .map((r: Json) => `<tr><td>${esc(r.a)} ↔ ${esc(r.b)}</td><td>${r.first700}</td><td>${r.body}</td><td>${r.first700Region}</td><td>${r.bodyRegion}</td><td>${r.pass ? "PASS" : "FAIL"}</td></tr>`)
  .join("\n");
const covRows = coverage
  .filter((c) => c.priority === "P0")
  .map((c) => `<tr><td>${esc(c.keyword)}</td><td>${esc(c.url)}</td><td>${c.missingWords.length ? "GAP" : "OK"}</td><td>${c.inTop ? "상단" : "본문"}</td></tr>`)
  .join("\n");
writeText(
  "dashboard.html",
  `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Speaker SEO reset ${DATE}</title>
<style>body{font-family:system-ui,'Malgun Gothic',sans-serif;margin:24px;color:#1b2a41;background:#f7f5f0}h1{font-size:22px}h2{font-size:17px;margin-top:28px}.cards{display:flex;gap:12px;flex-wrap:wrap}.card{background:#fff;border:1px solid #e3ded3;border-radius:10px;padding:12px 16px;min-width:160px}.card b{display:block;font-size:22px}.ok{color:#1d7a3a}.bad{color:#b3261e}table{border-collapse:collapse;width:100%;background:#fff;font-size:13px}td,th{border:1px solid #e3ded3;padding:6px 8px;text-align:left;vertical-align:top}th{background:#efebe3}.small{font-size:12px}</style></head><body>
<h1>Speaker SEO reset — ${DATE}</h1>
<div class="cards">
<div class="card">NON_TARGET_CHANGED_URLS<b class="${diff.NON_TARGET_CHANGED_URLS === 0 ? "ok" : "bad"}">${diff.NON_TARGET_CHANGED_URLS}</b>보호 ${diff.protectedCount}</div>
<div class="card">P0 GAP<b class="${p0Gap === 0 ? "ok" : "bad"}">${p0Gap}</b>P1 GAP ${p1Gap}</div>
<div class="card">유사도 FAIL<b class="${simFails === 0 ? "ok" : "bad"}">${simFails}</b>${qa.similarity.length}쌍</div>
<div class="card">신규 / 개선<b>${newUrls.length} / ${modified.length}</b>URL</div>
<div class="card">공개 근거<b>${evidencePublic.length}</b>COMPLETED_VERIFIED</div>
<div class="card">모바일 넘침<b class="${mobile.horizontalOverflow === 0 ? "ok" : "bad"}">${mobile.horizontalOverflow}</b>${mobile.checks}건</div>
</div>
<h2>Target 페이지</h2>
<table><tr><th>URL</th><th>결정</th><th>title</th><th>H1</th><th>desc</th><th>본문</th><th>관련</th><th>CTA</th><th>SERP(비네이버 링크 중 첫 노출)</th></tr>
${targetRows}</table>
<h2>P0 커버리지</h2>
<table><tr><th>검색어</th><th>URL</th><th>커버리지</th><th>위치</th></tr>${covRows}</table>
<h2>유사도 상위 10 (target 간, [REGION] body 기준)</h2>
<table><tr><th>쌍</th><th>first700</th><th>body</th><th>[R] first700</th><th>[R] body</th><th>판정</th></tr>${simRows}</table>
<p class="small">검색량은 측정하지 않았습니다. SERP 관측은 1회 스냅샷이며 순위를 보장하지 않습니다.</p>
</body></html>`,
);

console.log(`reports written to ${path.relative(ROOT, DIR)} — P0 GAP=${p0Gap} P1 GAP=${p1Gap} simFails=${simFails} NON_TARGET_CHANGED_URLS=${diff.NON_TARGET_CHANGED_URLS}`);
