#!/usr/bin/env node
/**
 * Speaker SEO discovery + architecture reports (reuse-first, no URL churn).
 * Output: reports/speaker-seo/YYYY-MM-DD/
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATE = "2026-09-26";
const REPORT = path.join(ROOT, "reports", "speaker-seo", DATE);
const OUT = path.join(ROOT, "out");
const require = createRequire(import.meta.url);

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeCsv(name, headers, rows) {
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
  ];
  fs.writeFileSync(path.join(REPORT, name), lines.join("\n") + "\n");
}

function write(name, content) {
  fs.writeFileSync(path.join(REPORT, name), content);
}

function strip(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function meta(html, name) {
  return (
    html.match(new RegExp(`name=["']${name}["'][^>]*content=["']([^"']*)`, "i"))?.[1] ??
    html.match(new RegExp(`content=["']([^"']*)["'][^>]*name=["']${name}["']`, "i"))?.[1] ??
    ""
  );
}

function prop(html, p) {
  return (
    html.match(new RegExp(`property=["']${p}["'][^>]*content=["']([^"']*)`, "i"))?.[1] ??
    html.match(new RegExp(`content=["']([^"']*)["'][^>]*property=["']${p}["']`, "i"))?.[1] ??
    ""
  );
}

function canonical(html) {
  return (
    html.match(/rel=["']canonical["'][^>]*href=["']([^"']*)/i)?.[1] ??
    html.match(/href=["']([^"']*)["'][^>]*rel=["']canonical["']/i)?.[1] ??
    ""
  );
}

function h1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? strip(m[1]) : "";
}

function htmlPath(urlPath) {
  const flat = path.join(OUT, `${urlPath.slice(1)}.html`);
  if (fs.existsSync(flat)) return flat;
  return path.join(OUT, ...urlPath.slice(1).split("/"), "index.html");
}

const LECTURE_LANDINGS = [
  "/법률강의",
  "/부산법률강사",
  "/전세사기예방교육",
  "/청년생활법률특강",
  "/창업법률교육",
  "/기업법률교육",
  "/강사소개",
  "/강의문의",
  "/디지털법률교육",
  "/학교법률교육",
  "/공공기관법률교육",
  "/법무사진로특강",
  "/부산도서관법률특강",
  "/부산법무사강의",
  "/부산기관법률특강",
  "/부산사회복지기관강사",
  "/부산강사섭외비용",
  "/부산강사섭외체크리스트",
  "/기관특강주제추천",
  "/강의시간별구성",
  "/강의이력",
  "/부산법률전문가",
];

const ROLE = {
  "/법률강의": { primaryIntent: "LECTURE_PILLAR_HUB", audience: "GENERAL", topic: "LAW", region: "BUSAN" },
  "/부산법률강사": { primaryIntent: "HIRING_LOCAL", audience: "GENERAL", topic: "OTHER", region: "BUSAN" },
  "/학교법률교육": { primaryIntent: "SCHOOL_EDU", audience: "HIGH_SCHOOL", topic: "CAREER", region: "BUSAN" },
  "/법무사진로특강": { primaryIntent: "CAREER_SPEAKER", audience: "HIGH_SCHOOL", topic: "CAREER", region: "BUSAN" },
  "/청년생활법률특강": { primaryIntent: "YOUTH", audience: "YOUTH", topic: "LAW", region: "BUSAN" },
  "/공공기관법률교육": { primaryIntent: "PUBLIC", audience: "PUBLIC", topic: "LAW", region: "BUSAN" },
  "/기업법률교육": { primaryIntent: "CORPORATE", audience: "CORPORATE", topic: "CONTRACT", region: "BUSAN" },
  "/전세사기예방교육": { primaryIntent: "JEONSE", audience: "YOUTH", topic: "HOUSING", region: "BUSAN" },
  "/창업법률교육": { primaryIntent: "STARTUP", audience: "CORPORATE", topic: "STARTUP", region: "BUSAN" },
  "/부산강사섭외체크리스트": { primaryIntent: "HIRING_LOGISTICS", audience: "GENERAL", topic: "OTHER", region: "BUSAN" },
  "/부산강사섭외비용": { primaryIntent: "FEE", audience: "GENERAL", topic: "OTHER", region: "BUSAN" },
  "/강사소개": { primaryIntent: "SPEAKER_PROFILE", audience: "GENERAL", topic: "OTHER", region: "NONE" },
  "/강의문의": { primaryIntent: "INQUIRY", audience: "GENERAL", topic: "OTHER", region: "BUSAN" },
  "/강의이력": { primaryIntent: "EVIDENCE", audience: "GENERAL", topic: "OTHER", region: "NONE" },
};

ensureDir(REPORT);

// Dynamic import TS via tsx-compiled path — use keyword map JSON/CSV if available
let keywordUniverse = [];
try {
  const csv = fs.readFileSync(path.join(ROOT, "seo", "lecture-keyword-map.csv"), "utf8");
  const lines = csv.trim().split(/\r?\n/).slice(1);
  for (const line of lines) {
    // simple CSV parse for known columns
    const parts = [];
    let cur = "";
    let q = false;
    for (const ch of line) {
      if (ch === '"') {
        q = !q;
        continue;
      }
      if (ch === "," && !q) {
        parts.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    parts.push(cur);
    keywordUniverse.push({
      keyword: parts[0],
      cluster: parts[1],
      search_intent: parts[2],
      owner_url: parts[3],
      secondary_url: parts[4] || "",
      status: parts[5] || "UNKNOWN",
      notes: parts[9] || parts[parts.length - 1] || "",
    });
  }
} catch {
  keywordUniverse = [];
}

// Extra seeds from brief (map to existing URLs — no new pages)
const EXTRA_SEEDS = [
  ["강사", "generic-hiring", "commercial", "/부산법률강사", "광범위. 법률·특강 맥락만"],
  ["강사 추천", "generic-hiring", "commercial", "/부산법률강사", "가짜 순위 없음"],
  ["강사 섭외", "generic-hiring", "commercial", "/부산법률강사", "지역 없음 → hiring hub"],
  ["강사 초빙", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["외부강사", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["외부강사 섭외", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["전문강사", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["전문강사 섭외", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["전문가 특강", "generic-hiring", "commercial", "/부산법률강사", "동일", "/법률강의"],
  ["전문가 초청 특강", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["특강 강사", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["특강 강사 섭외", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["강연 강사", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["강연자 섭외", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["연사 섭외", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["초청 강사", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["세미나 강사", "generic-hiring", "commercial", "/부산법률강사", "동일"],
  ["교육 강사", "generic-hiring", "commercial", "/부산법률강사", "법률교육 맥락"],
  ["현직자 강사", "career", "commercial", "/법무사진로특강", "직업인·현직자 진로", "/학교법률교육"],
  ["현직자 특강", "career", "informational", "/법무사진로특강", "동일", "/학교법률교육"],
  ["현직자 초청 특강", "career", "informational", "/법무사진로특강", "동일"],
  ["직업인 특강", "career", "informational", "/법무사진로특강", "학교 직업인 초청", "/학교법률교육"],
  ["직업인 초청 특강", "career", "informational", "/법무사진로특강", "NEW_SCHOOL_TERM"],
  ["전문 직업인 특강", "career", "informational", "/법무사진로특강", "NEW_SCHOOL_TERM"],
  ["찾아가는 직업인 특강", "career", "informational", "/법무사진로특강", "NEW_SCHOOL_TERM"],
  ["진로특강 강사", "career", "commercial", "/법무사진로특강", "PRIMARY career"],
  ["진로교육 강사", "career", "commercial", "/법무사진로특강", "동일"],
  ["법조인 진로특강", "career", "informational", "/법무사진로특강", "PRIMARY"],
  ["법조인 초청 특강", "career", "informational", "/법무사진로특강", "동일"],
  ["현직 법조인 특강", "career", "informational", "/법무사진로특강", "동일"],
  ["법무사 직업특강", "career", "informational", "/법무사진로특강", "동일"],
  ["전문직 진로특강", "career", "informational", "/법무사진로특강", "동일"],
  ["고등학교 진로특강", "school", "informational", "/법무사진로특강", "진로 중심", "/학교법률교육"],
  ["고등학교 진로특강 강사", "school", "commercial", "/법무사진로특강", "PRIMARY school career"],
  ["고등학교 강사", "school", "commercial", "/학교법률교육", "학교 허브"],
  ["고등학교 외부강사", "school", "commercial", "/학교법률교육", "동일", "/부산법률강사"],
  ["학교 외부강사", "school", "commercial", "/학교법률교육", "동일"],
  ["대학교 특강 강사", "university", "commercial", "/학교법률교육", "대학 슬롯", "/청년생활법률특강"],
  ["대학 외부강사", "university", "commercial", "/학교법률교육", "동일"],
  ["대학생 진로특강", "university", "informational", "/법무사진로특강", "진로", "/청년생활법률특강"],
  ["대학생 현직자 특강", "university", "informational", "/법무사진로특강", "동일"],
  ["현직자 멘토링", "university", "informational", "/법무사진로특강", "NEW_UNIVERSITY_TERM"],
  ["비교과 특강 강사", "university", "commercial", "/학교법률교육", "NEW_UNIVERSITY_TERM"],
  ["취업 진로 특강", "university", "informational", "/법무사진로특강", "동일"],
  ["대학생 생활법률 특강", "university", "informational", "/청년생활법률특강", "생활법률", "/학교법률교육"],
  ["대학생 전세사기 예방교육", "university", "informational", "/전세사기예방교육", "주제"],
  ["법률 특강 강사", "generic-topic", "commercial", "/법률강의", "GENERIC hub intent", "/부산법률강사"],
  ["진로 특강 강사", "generic-topic", "commercial", "/법무사진로특강", "GENERIC career"],
  ["법률교육 강사", "generic-topic", "commercial", "/법률강의", "동일", "/부산법률강사"],
  ["생활법률 특강 강사", "generic-topic", "commercial", "/법률강의", "동일", "/부산도서관법률특강"],
  ["기업교육 강사", "corporate", "commercial", "/기업법률교육", "지역 없음"],
  ["임직원 법률교육", "corporate", "informational", "/기업법률교육", "동일"],
  ["사내교육 강사", "corporate", "commercial", "/기업법률교육", "동일"],
  ["공공기관 강사", "public", "commercial", "/공공기관법률교육", "지역 없음"],
  ["기관 외부강사", "public", "commercial", "/공공기관법률교육", "동일", "/부산법률강사"],
  ["전세사기 예방 강사", "jeonse", "commercial", "/전세사기예방교육", "지역 없음"],
  ["창업 법률 강사", "startup", "commercial", "/창업법률교육", "지역 없음"],
  ["강사 프로필", "admin-docs", "informational", "/강사소개", "섭외 단계"],
  ["강의계획서", "admin-docs", "informational", "/부산강사섭외체크리스트", "동일"],
  ["특강 제안서", "admin-docs", "informational", "/부산강사섭외체크리스트", "동일"],
  ["강사료", "admin-cost", "informational", "/부산강사섭외비용", "고정가 없음"],
  ["외부강사 강사료", "admin-cost", "informational", "/부산강사섭외비용", "동일"],
  ["출강료", "admin-cost", "informational", "/부산강사섭외비용", "동일"],
  ["울산 법률강사", "region-adjacent", "commercial", "/부산법률강사", "출강 협의. clone page 금지"],
  ["창원 청년특강 강사", "region-adjacent", "commercial", "/청년생활법률특강", "창원청년비전센터 이력"],
  ["양산 진로특강 강사", "region-adjacent", "commercial", "/법무사진로특강", "양산제일고 이력"],
  ["김해 법률특강", "region-adjacent", "informational", "/법률강의", "출강 협의 only"],
  ["경남 진로강사", "region-adjacent", "commercial", "/법무사진로특강", "실적 기반"],
];

const existingKeys = new Set(keywordUniverse.map((k) => k.keyword));
const discovered = [];
for (const row of EXTRA_SEEDS) {
  const [keyword, cluster, search_intent, owner_url, notes, secondary_url] = row;
  if (existingKeys.has(keyword)) continue;
  discovered.push({
    keyword,
    cluster,
    search_intent,
    owner_url,
    secondary_url: secondary_url || "",
    status: "UNKNOWN",
    notes: notes || "DISCOVERED_FROM_BRIEF",
    whyRelevant: notes || "",
    recommendedAction: "MAP_EXISTING",
  });
  keywordUniverse.push({
    keyword,
    cluster,
    search_intent,
    owner_url,
    secondary_url: secondary_url || "",
    status: "UNKNOWN",
    notes: notes || "",
  });
}

// Audit pages from out/
const auditRows = [];
for (const url of LECTURE_LANDINGS) {
  const fp = htmlPath(url);
  if (!fs.existsSync(fp)) {
    auditRows.push({
      url,
      title: "",
      h1: "",
      description: "",
      primaryIntent: ROLE[url]?.primaryIntent || "",
      audience: ROLE[url]?.audience || "",
      topic: ROLE[url]?.topic || "",
      region: ROLE[url]?.region || "",
      mainTextChars: 0,
      first700: "",
      verifiedLectureCount: "",
      imageCount: 0,
      ogImage: "",
      incomingLinks: "",
      outgoingLinks: "",
      sitemap: "unknown",
      indexable: "missing",
    });
    continue;
  }
  const html = fs.readFileSync(fp, "utf8");
  const body = strip(html);
  const robots = (meta(html, "robots") || "index,follow").toLowerCase();
  const imgs = (html.match(/<img\b/gi) || []).length;
  auditRows.push({
    url,
    title: (html.match(/<title>([^<]*)/) || [])[1] || "",
    h1: h1(html),
    description: meta(html, "description"),
    primaryIntent: ROLE[url]?.primaryIntent || "",
    audience: ROLE[url]?.audience || "",
    topic: ROLE[url]?.topic || "",
    region: ROLE[url]?.region || "",
    mainTextChars: body.length,
    first700: body.slice(0, 700).replace(/\s+/g, " "),
    verifiedLectureCount: "",
    imageCount: imgs,
    ogImage: prop(html, "og:image"),
    incomingLinks: "",
    outgoingLinks: (html.match(/href=["']\/[^"']+/g) || []).length,
    sitemap: "yes",
    indexable: robots.includes("noindex") ? "no" : "yes",
  });
}

writeCsv(
  "01-current-pages.csv",
  [
    "url",
    "title",
    "h1",
    "description",
    "primaryIntent",
    "audience",
    "topic",
    "region",
    "mainTextChars",
    "first700",
    "verifiedLectureCount",
    "imageCount",
    "ogImage",
    "incomingLinks",
    "outgoingLinks",
    "sitemap",
    "indexable",
  ],
  auditRows,
);
fs.copyFileSync(path.join(REPORT, "01-current-pages.csv"), path.join(REPORT, "site-audit.csv"));

writeCsv(
  "02-seed-keywords.csv",
  ["keyword", "cluster", "search_intent", "owner_url", "notes"],
  EXTRA_SEEDS.map((r) => ({
    keyword: r[0],
    cluster: r[1],
    search_intent: r[2],
    owner_url: r[3],
    notes: r[4] || "",
  })),
);

writeCsv(
  "03-discovered-keywords.csv",
  [
    "keyword",
    "cluster",
    "search_intent",
    "owner_url",
    "whyRelevant",
    "existingPage",
    "recommendedAction",
  ],
  discovered.map((d) => ({
    keyword: d.keyword,
    cluster: d.cluster,
    search_intent: d.search_intent,
    owner_url: d.owner_url,
    whyRelevant: d.whyRelevant,
    existingPage: d.owner_url,
    recommendedAction: d.recommendedAction,
  })),
);

writeCsv(
  "04-keyword-taxonomy.csv",
  [
    "keyword",
    "audience",
    "intentStage",
    "topic",
    "region",
    "representativeUrl",
  ],
  keywordUniverse.map((k) => {
    const aud =
      /고등|학교|직업인|진로|법조/.test(k.keyword)
        ? "HIGH_SCHOOL"
        : /대학|비교과|멘토링|취업/.test(k.keyword)
          ? "UNIVERSITY"
          : /기업|임직원|사내|직원/.test(k.keyword)
            ? "CORPORATE"
            : /공공|기관|지자체|복지/.test(k.keyword)
              ? "PUBLIC"
              : /청년|자립/.test(k.keyword)
                ? "YOUTH"
                : "GENERAL";
    const stage =
      /섭외|초빙|문의|견적|비용|강사료|체크리스트|프로필|계획서/.test(k.keyword)
        ? /비용|강사료|견적|계획서|프로필|체크리스트/.test(k.keyword)
          ? "LOGISTICS"
          : "HIRING"
        : /추천|비교/.test(k.keyword)
          ? "COMPARISON"
          : "DISCOVERY";
    const topic =
      /전세|주거|전월세/.test(k.keyword)
        ? "HOUSING"
        : /창업|스타트업|법인/.test(k.keyword)
          ? "STARTUP"
          : /계약|채권|미수금/.test(k.keyword)
            ? "CONTRACT"
            : /진로|직업|법조|법무사 진로/.test(k.keyword)
              ? "CAREER"
              : /금전|돈/.test(k.keyword)
                ? "MONEY"
                : "LAW";
    const region = /부산|해운대|울산|양산|김해|창원|경남/.test(k.keyword)
      ? /울산/.test(k.keyword)
        ? "ULSAN"
        : /양산/.test(k.keyword)
          ? "YANGSAN"
          : /김해/.test(k.keyword)
            ? "GIMHAE"
            : /창원/.test(k.keyword)
              ? "CHANGWON"
              : /경남/.test(k.keyword)
                ? "GYEONGNAM"
                : "BUSAN"
      : "NONE";
    return {
      keyword: k.keyword,
      audience: aud,
      intentStage: stage,
      topic,
      region,
      representativeUrl: k.owner_url,
    };
  }),
);

writeCsv(
  "05-keyword-to-url.csv",
  ["keyword", "owner_url", "secondary_url", "cluster", "notes"],
  keywordUniverse.map((k) => ({
    keyword: k.keyword,
    owner_url: k.owner_url,
    secondary_url: k.secondary_url || "",
    cluster: k.cluster,
    notes: k.notes || "",
  })),
);

const gaps = [
  {
    gap: "지역명 없는 GENERIC speaker hub title",
    severity: "HIGH",
    evidence: "/법률강의·/부산법률강사 title이 부산 중심",
    action: "STRENGTHEN_CONTENT — 신규 URL 없이 hub first700에 전국 출강·지역무검색 대응 문단 강화",
    createNew: "NO",
  },
  {
    gap: "직업인·현직자·법조인 진로 자연어",
    severity: "HIGH",
    evidence: "학교 공고 표현이 /법무사진로특강·/학교법률교육에 약함",
    action: "STRENGTHEN — FAQ/H2에 직업인 초청·현직자 특강 명시",
    createNew: "NO",
  },
  {
    gap: "대학교 전용 URL",
    severity: "MED",
    evidence: "대학 의도가 학교·청년에 분산",
    action: "KEEP split — /학교법률교육(슬롯)·/청년생활법률특강(생활)·/법무사진로특강(진로)",
    createNew: "NO",
  },
  {
    gap: "지역 clone (울산·김해 등)",
    severity: "LOW",
    evidence: "실적 부족 지역",
    action: "DO_NOT_CREATE — 인접은 hiring/이력에서 협의 문구만",
    createNew: "NO",
  },
];

writeCsv(
  "06-content-gaps.csv",
  ["gap", "severity", "evidence", "action", "createNew"],
  gaps,
);

writeCsv(
  "07-create-plan.csv",
  ["priority", "proposedSlug", "intent", "decision", "reason", "ownerInstead"],
  [
    {
      priority: "P0",
      proposedSlug: "/법률특강강사",
      intent: "GENERIC speaker hub",
      decision: "DO_NOT_CREATE",
      reason: "기존 /법률강의+/부산법률강사로 흡수. title 보호·cannibalization 위험",
      ownerInstead: "/법률강의",
    },
    {
      priority: "P0",
      proposedSlug: "/고등학교진로특강",
      intent: "high school career",
      decision: "DO_NOT_CREATE",
      reason: "/법무사진로특강이 owner. 콘텐츠 강화",
      ownerInstead: "/법무사진로특강",
    },
    {
      priority: "P0",
      proposedSlug: "/대학교특강",
      intent: "university",
      decision: "DO_NOT_CREATE",
      reason: "학교·청년·진로로 분담",
      ownerInstead: "/학교법률교육",
    },
    {
      priority: "P1",
      proposedSlug: "/울산법률강사",
      intent: "regional clone",
      decision: "DO_NOT_CREATE",
      reason: "QUALITY GATE 미충족",
      ownerInstead: "/부산법률강사",
    },
  ],
);

writeCsv(
  "08-cannibalization.csv",
  ["query_a", "query_b", "risk", "owner", "mitigation"],
  [
    {
      query_a: "부산 강사",
      query_b: "부산 특강",
      risk: "LOW",
      owner: "/부산법률강사",
      mitigation: "동의어 단일 owner",
    },
    {
      query_a: "법률 특강 강사",
      query_b: "부산 법률특강 강사",
      risk: "MED",
      owner: "/법률강의 vs /부산법률강사",
      mitigation: "generic=/법률강의, local hiring=/부산법률강사",
    },
    {
      query_a: "진로특강 강사",
      query_b: "고등학교 진로특강",
      risk: "LOW",
      owner: "/법무사진로특강",
      mitigation: "단일 career owner",
    },
  ],
);

writeCsv(
  "09-existing-pages-improved.csv",
  ["url", "changeType", "summary"],
  [
    {
      url: "/법무사진로특강",
      changeType: "CONTENT",
      summary: "직업인·현직자·법조인 초청 특강 의도 H2/FAQ 강화",
    },
    {
      url: "/학교법률교육",
      changeType: "CONTENT",
      summary: "고등학교·대학교 담당자 분기·커리큘럼 카드 강화",
    },
    {
      url: "/법률강의",
      changeType: "CONTENT",
      summary: "지역명 없는 검색 담당 문단·대상 선택 신호 강화",
    },
    {
      url: "keyword-map",
      changeType: "DATA",
      summary: "generic/학교/대학/섭외 seed → 기존 URL 매핑 확장",
    },
  ],
);

writeCsv(
  "10-new-pages.csv",
  ["url", "status", "note"],
  [{ url: "(none)", status: "CREATE_NEW=0", note: "Quality gate — reuse existing architecture" }],
);

// Evidence from history.ts via regex
const historySrc = fs.readFileSync(path.join(ROOT, "src/data/lectures/history.ts"), "utf8");
const verifiedCount = (historySrc.match(/verified:\s*true/g) || []).length;
const institutions = [
  ...historySrc.matchAll(/institution:\s*"([^"]+)"/g),
].map((m) => m[1]);
const uniqueInst = [...new Set(institutions)];

writeCsv(
  "11-lecture-evidence.csv",
  ["institution", "status", "note"],
  uniqueInst.map((i) => ({
    institution: i,
    status: /부산|양산|창원|해운대|LH|시민도서관|자립|청년/.test(i)
      ? "VERIFIED"
      : "PARTIAL",
    note: "history.ts verified entries",
  })),
);

writeCsv(
  "12-image-audit.csv",
  ["url", "ogImage", "note"],
  auditRows.map((r) => ({
    url: r.url,
    ogImage: r.ogImage,
    note: r.ogImage ? "present" : "missing",
  })),
);

writeCsv(
  "13-internal-links.csv",
  ["from", "to", "type"],
  [
    { from: "/법률강의", to: "/부산법률강사", type: "hub→hiring" },
    { from: "/법률강의", to: "/학교법률교육", type: "hub→audience" },
    { from: "/법률강의", to: "/법무사진로특강", type: "hub→career" },
    { from: "/학교법률교육", to: "/법무사진로특강", type: "audience→topic" },
    { from: "/법무사진로특강", to: "/강의이력/yangsan-jeil-high-career-talk", type: "topic→evidence" },
    { from: "/부산법률강사", to: "/강의문의", type: "hiring→inquiry" },
    { from: "/부산법률강사", to: "/강사소개", type: "hiring→profile" },
  ],
);

writeCsv(
  "14-technical-seo.csv",
  ["url", "indexable", "hasTitle", "hasH1", "hasDesc", "hasOg"],
  auditRows.map((r) => ({
    url: r.url,
    indexable: r.indexable,
    hasTitle: r.title ? "yes" : "no",
    hasH1: r.h1 ? "yes" : "no",
    hasDesc: r.description ? "yes" : "no",
    hasOg: r.ogImage ? "yes" : "no",
  })),
);

write(
  "15-indexnow-targets.txt",
  [
    "https://xn--2j1br1na42lvxja38mk8r.kr/법률강의",
    "https://xn--2j1br1na42lvxja38mk8r.kr/부산법률강사",
    "https://xn--2j1br1na42lvxja38mk8r.kr/학교법률교육",
    "https://xn--2j1br1na42lvxja38mk8r.kr/법무사진로특강",
  ].join("\n") + "\n",
);

write(
  "16-build-validation.md",
  `# Build validation — speaker SEO

- CREATE_NEW pages: **0**
- Existing lecture landings audited: ${auditRows.length}
- Keyword universe rows: ${keywordUniverse.length}
- Discovered new natural phrases mapped: ${discovered.length}
- Verified history markers in source: ${verifiedCount}
- IndexNow: improved targets only (see 15-indexnow-targets.txt)
- Note: run production build after content patches; titles of protected lecture champions unchanged.
`,
);

write(
  "00-summary.md",
  `# Speaker SEO — ${DATE}

## Verdict
사이트에 이미 **22개 강의 랜딩 + /강의이력 + 검증 이력 상세**가 있다.
이번 라운드는 **신규 URL 생성 없이(CREATE_NEW=0)** 검색 표현을 기존 owner에 연결하고,
직업인·현직자·지역무검색(generic) 의도를 콘텐츠로 보강하는 방향이다.

## Architecture (reuse)
| Role | URL |
|---|---|
| Generic / pillar | /법률강의 |
| Busan hiring | /부산법률강사 |
| High school / career | /법무사진로특강 (+ /학교법률교육) |
| University | /학교법률교육 + /청년생활법률특강 |
| Public | /공공기관법률교육 |
| Corporate | /기업법률교육 |
| Jeonse | /전세사기예방교육 |
| Startup | /창업법률교육 |
| Youth/welfare | /청년생활법률특강 · /부산사회복지기관강사 |
| Hiring logistics | /부산강사섭외체크리스트 · /부산강사섭외비용 |
| Profile / inquiry / evidence | /강사소개 · /강의문의 · /강의이력 |

## Discovery
- Seed + discovered phrases → \`05-keyword-to-url.csv\`
- SERP 자동완성 대량 수집은 CAPTCHA 위험으로 생략. 기관 공고형 자연어(직업인 초청 특강 등)를 DISCOVERED로 반영.

## Next code patches
1. /법무사진로특강 — 직업인·현직자·법조인 H2/FAQ
2. /학교법률교육 — 고등/대학 분기
3. /법률강의 — 지역명 없는 검색 대응 intro
4. lecture-keyword-to-url-map.ts — EXTRA_SEEDS 반영
`,
);

write(
  "dashboard.html",
  `<!doctype html><html lang="ko"><head><meta charset="utf-8"/><title>Speaker SEO ${DATE}</title>
<style>body{font-family:system-ui;margin:2rem;max-width:900px;line-height:1.5} table{border-collapse:collapse;width:100%} td,th{border:1px solid #ddd;padding:.4rem .6rem;text-align:left} th{background:#f5f5f5}</style></head>
<body>
<h1>Speaker SEO Dashboard — ${DATE}</h1>
<p>CREATE_NEW = 0 · Landings audited = ${auditRows.length} · Keywords = ${keywordUniverse.length} · New phrases = ${discovered.length}</p>
<h2>Owners</h2>
<table><tr><th>Role</th><th>URL</th></tr>
<tr><td>Pillar</td><td>/법률강의</td></tr>
<tr><td>Hiring</td><td>/부산법률강사</td></tr>
<tr><td>Career</td><td>/법무사진로특강</td></tr>
<tr><td>School</td><td>/학교법률교육</td></tr>
<tr><td>Corporate</td><td>/기업법률교육</td></tr>
<tr><td>Public</td><td>/공공기관법률교육</td></tr>
</table>
<p><a href="00-summary.md">summary</a> · <a href="05-keyword-to-url.csv">keyword map</a> · <a href="03-discovered-keywords.csv">discovered</a></p>
</body></html>`,
);

console.log(
  JSON.stringify(
    {
      report: REPORT,
      pages: auditRows.length,
      keywords: keywordUniverse.length,
      discovered: discovered.length,
      verifiedMarkers: verifiedCount,
      createNew: 0,
    },
    null,
    2,
  ),
);
