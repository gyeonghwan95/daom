/**
 * 준비자료 PNG(1080×1440)·A4 PDF·OG(1200×630)용 HTML 조판.
 * 문구는 모두 src/data/resources/guides.ts 원본에서 가져오고, 여기서 새 법률 문장을 만들지 않는다.
 */
import { RESOURCE_CATEGORY_LABEL, RESOURCE_VERIFIED_ON, RESOURCE_VERSION } from "@/data/resources/guides";
import type { ResourceGuide } from "@/data/resources/types";
import { absoluteUrl, RESOURCE_BRAND, readableUrl } from "@/lib/resources/urls";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const BASE_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:"Noto Sans KR","Malgun Gothic",sans-serif;color:#152a45;background:#fff;word-break:keep-all;overflow-wrap:anywhere}
a{color:#152a45}
`;

export function buildPngHtml(guide: ResourceGuide, qrSvg: string, phone: string): string {
  const items = guide.shareItems
    .map((t, i) => `<li><span class="n">${i + 1}</span><span>${esc(t)}</span></li>`)
    .join("");
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${BASE_CSS}
html,body{width:1080px;height:1440px;overflow:hidden}
.page{width:1080px;height:1440px;padding:56px 72px 0;display:flex;flex-direction:column;background:#fbf8f3}
.cat{display:inline-block;font-size:34px;font-weight:700;color:#fff;background:#152a45;border-radius:999px;padding:6px 26px;align-self:flex-start}
h1{margin-top:20px;font-size:calc(76px * var(--s,1));line-height:1.2;font-weight:800;letter-spacing:-1.5px}
ol{list-style:none;margin-top:26px;border-top:3px solid #152a45}
li{display:flex;gap:20px;font-size:calc(50px * var(--s,1));line-height:1.26;font-weight:500;padding:14px 0;border-bottom:2px solid #ddd4c6}
.n{flex:0 0 52px;height:52px;border-radius:50%;background:#152a45;color:#fff;font-size:30px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-top:5px}
.note{margin-top:18px;font-size:calc(38px * var(--s,1));line-height:1.38;color:#7a4a1f}
.foot{margin-top:auto;margin-left:-72px;margin-right:-72px;padding:20px 72px 24px;background:#152a45;color:#fff}
.row{display:flex;gap:24px;align-items:center}
.t{flex:1;font-size:32px;line-height:1.4}
.b{font-size:42px;font-weight:700;margin-bottom:4px}
.u{margin-top:10px;font-size:32px;font-weight:600;color:#f0ebe3;white-space:nowrap}
.sc{margin-top:2px;font-size:26px;color:#f0ebe3cc}
.qr{flex:0 0 150px;height:150px;background:#fff;border-radius:10px;padding:9px}
.qr svg{width:100%;height:100%}
</style></head><body><div class="page" id="page">
<span class="cat">${esc(RESOURCE_CATEGORY_LABEL[guide.category])} · 의뢰 전 준비자료</span>
<h1>${esc(guide.h1)}</h1>
<ol>${items}</ol>
<p class="note">${esc(guide.shareNote)}</p>
<div class="foot"><div class="row"><div class="t">
<div class="b">${esc(RESOURCE_BRAND)}</div>
<div>확인일 ${RESOURCE_VERIFIED_ON} · v${RESOURCE_VERSION}</div>
<div>문의 ${esc(phone)}</div>
</div><div class="qr">${qrSvg}</div></div>
<div class="u">원문 ${esc(readableUrl(guide.slug))}</div>
<div class="sc">${esc(guide.scope)}</div>
</div>
</div></body></html>`;
}

export function buildOgHtml(guide: ResourceGuide): string {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>${BASE_CSS}
html,body{width:1200px;height:630px;overflow:hidden}
.page{width:1200px;height:630px;padding:64px 72px;background:#152a45;color:#fff;display:flex;flex-direction:column}
.cat{font-size:30px;font-weight:700;color:#f0ebe3}
h1{margin-top:26px;font-size:60px;line-height:1.25;font-weight:800;letter-spacing:-1px}
p{margin-top:22px;font-size:30px;line-height:1.45;color:#ffffffcc}
.b{margin-top:auto;font-size:30px;font-weight:700;color:#f0ebe3}
</style></head><body><div class="page" id="page">
<div class="cat">${esc(RESOURCE_CATEGORY_LABEL[guide.category])} · 의뢰 전 준비자료</div>
<h1>${esc(guide.h1)}</h1>
<p>${esc(guide.readWhen)}</p>
<div class="b">${esc(RESOURCE_BRAND)}</div>
</div></body></html>`;
}

export function buildPdfHtml(guide: ResourceGuide, qrSvg: string, phone: string): string {
  const checks = guide.checks
    .map(
      (c, i) => `<section class="check"><h3>${i + 1}. ${esc(c.title)}</h3>
<p><b>왜 확인하나요</b> ${esc(c.why)}</p>
<p><b>지금 할 수 있는 준비</b> ${esc(c.prepare)}</p>
<p><b>추가 검토가 필요한 경우</b> ${esc(c.review)}</p></section>`,
    )
    .join("");
  const chooser = guide.chooser
    ? `<h2>${esc(guide.chooser.caption)}</h2><table><thead><tr><th>${esc(guide.chooser.head[0])}</th><th>${esc(guide.chooser.head[1])}</th></tr></thead><tbody>${guide.chooser.rows
        .map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`)
        .join("")}</tbody></table>`
    : "";
  const sheetRows = [
    ...(guide.sheet.example ? [`<tr class="ex">${guide.sheet.example.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`] : []),
    ...guide.sheet.rows.map(
      (r) => `<tr class="blank">${guide.sheet.columns.map((_, i) => `<td>${i === 0 ? esc(r) : ""}</td>`).join("")}</tr>`,
    ),
  ].join("");
  const conditions = guide.reviewConditions
    .map((c) => `<li><b>${esc(c.condition)}</b> — ${esc(c.why)}</li>`)
    .join("");
  const sources = guide.sources
    .map((s) => `<li><a href="${esc(s.url)}">${esc(s.label)}</a></li>`)
    .join("");
  const url = absoluteUrl(guide.slug);
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${esc(guide.h1)}</title><style>${BASE_CSS}
@page{size:A4;margin:16mm 15mm 18mm}
body{font-size:10.5pt;line-height:1.6}
.head{display:flex;gap:14px;align-items:flex-start;border-bottom:2px solid #152a45;padding-bottom:10px}
.head .t{flex:1}
.cat{font-size:9pt;font-weight:700;color:#7a4a1f}
h1{font-size:18pt;line-height:1.3;margin:4px 0 6px}
.meta{font-size:8.5pt;color:#152a45b3}
.qr{width:24mm;height:24mm;flex:0 0 24mm}
.qr svg{width:100%;height:100%}
.when{margin-top:10px;background:#f0ebe3;border-radius:6px;padding:8px 10px}
h2{font-size:12.5pt;margin:16px 0 6px;break-after:avoid}
h3{font-size:11pt;margin-bottom:3px;break-after:avoid}
.check{border:1px solid #ddd4c6;border-radius:6px;padding:8px 10px;margin-bottom:7px;break-inside:avoid}
.check p{margin-top:2px}
.check b{color:#243f5e;margin-right:4px}
table{width:100%;border-collapse:collapse;font-size:9.5pt;break-inside:auto}
th,td{border:1px solid #c4b7a3;padding:5px 6px;text-align:left;vertical-align:top}
th{background:#f0ebe3}
tr{break-inside:avoid}
tr.blank td{height:13mm}
tr.ex td{color:#152a4599;font-style:italic}
.cap{font-size:8.5pt;color:#152a45b3;margin-top:3px}
ul{padding-left:16px}
li{margin-bottom:3px}
.box{border-left:3px solid #152a45;background:#fbf8f3;padding:8px 10px;margin-top:6px}
.foot{margin-top:16px;border-top:1px solid #c4b7a3;padding-top:8px;font-size:8.5pt;color:#152a45cc}
</style></head><body>
<div class="head"><div class="t">
<div class="cat">${esc(RESOURCE_CATEGORY_LABEL[guide.category])} · 의뢰 전 준비자료</div>
<h1>${esc(guide.h1)}</h1>
<div class="meta">${esc(RESOURCE_BRAND)} · 원문 <a href="${esc(url)}">${esc(readableUrl(guide.slug))}</a> · 확인일 ${RESOURCE_VERIFIED_ON} · v${RESOURCE_VERSION}</div>
<div class="meta">${esc(guide.scope)}</div>
</div><div class="qr">${qrSvg}</div></div>
<p class="when"><b>이런 상황에 읽으세요</b> ${esc(guide.readWhen)}</p>
<p style="margin-top:8px">${esc(guide.intro)}</p>
<h2>먼저 확인할 것</h2>${checks}
${chooser}
<h2>${esc(guide.sheet.caption)}</h2>
<table><thead><tr>${guide.sheet.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${sheetRows}</tbody></table>
${guide.sheet.example ? `<p class="cap">첫 행은 가상 작성 예시입니다.</p>` : ""}
<h2>개별 검토가 필요한 조건</h2><ul>${conditions}</ul>
<h2>법무사가 맡는 일</h2><ul>${guide.officeTasks.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
<h3 style="margin-top:8px">법무사 업무가 아닌 부분</h3><ul>${guide.outsideScope.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
<p style="margin-top:6px">${esc(guide.costNote)}</p>
<h2>문의할 때 알려줄 것</h2>
<div class="box">${esc(guide.inquiry.message)}<br>문의 ${esc(phone)} · <a href="${esc(url)}">원문에서 최신 자료와 업무 안내 확인</a></div>
<h2>공식 근거</h2><ul>${sources}</ul>
<div class="foot">일반 안내이며 개별 사건의 결론이 아닙니다. 법령은 확인일 기준이며 바뀔 수 있으니 원문에서 최신 버전을 확인하세요. © ${esc(RESOURCE_BRAND)}</div>
</body></html>`;
}
