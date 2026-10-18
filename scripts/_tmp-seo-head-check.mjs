import fs from "node:fs";

function fileFor(route) {
  if (route === "/") return "out/index.html";
  const candidates = [
    `out${route}/index.html`,
    `out${route}.html`,
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

const routes = [
  "/",
  "/상속",
  "/상속등기비용",
  "/전국상속등기",
  "/부산상속포기",
  "/부산상속법무사",
  "/부산상속재산분할법무사",
  "/부산법무사상담",
  "/부산법률상담",
  "/부산부동산등기전문법무사",
  "/부산등기법무사",
  "/부산법인등기",
  "/부산법인설립전문법무사",
  "/부산법인설립등기",
  "/법무사진로특강",
  "/업무사례/울산동구상속등기법무사",
  "/상속상담전준비서류와비용",
  "/부산법인법무사",
  "/부산부동산등기",
];

for (const r of routes) {
  const f = fileFor(r);
  if (!f) {
    console.log("MISSING", r);
    continue;
  }
  const html = fs.readFileSync(f, "utf8");
  const title = pick(html, /<title>([^<]*)<\/title>/i);
  const desc =
    pick(html, /name=["']description["'] content=["']([^"']*)/i) ||
    pick(html, /content=["']([^"']*)["'] name=["']description["']/i);
  const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, "");
  const can =
    pick(html, /rel=["']canonical["'] href=["']([^"']*)/i) ||
    pick(html, /href=["']([^"']*)["'] rel=["']canonical["']/i);
  const robots = pick(html, /name=["']robots["'] content=["']([^"']*)/i);
  const noindex = /noindex/i.test(html.slice(0, 5000));
  console.log("---", r);
  console.log("title", title);
  console.log("desc", desc.slice(0, 180));
  console.log("h1", h1.slice(0, 140));
  console.log("canonical", can);
  console.log("robots", robots || (noindex ? "noindex-found" : "index-ok"));
}

const bodyChecks = {
  "/상속": ["등기·포기·한정승인", "변호사 소송대리", "상속 법무사를 고를 때"],
  "/상속등기비용": ["수임료는 위임 업무의 보수", "등기신청수수료"],
  "/전국상속등기": ["울산 동구", "상속등기 법무사"],
  "/부산상속포기": ["가정법원", "마지막 주소지"],
  "/법무사진로특강": ["양산제일고등학교", "학생·학부모의 상속 의뢰"],
  "/업무사례/울산동구상속등기법무사": ["이 페이지는 울산 동구 부동산 상속등기 사례"],
};

for (const [route, needles] of Object.entries(bodyChecks)) {
  const f = fileFor(route);
  const html = fs.readFileSync(f, "utf8");
  for (const n of needles) {
    console.log(route, n, html.includes(n) ? "YES" : "NO");
  }
}
