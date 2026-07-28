import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const jiti = require("jiti")(import.meta.url, {
  interopDefault: true,
  esmResolve: true,
});
const enrichPath = path.join(
  ROOT,
  "src/lib/special-entity-intent/content/body-enrichments.ts",
);
const mod = jiti(enrichPath);

const extras = {
  학교법인임원변경등기:
    "상담 전 등기부와 최근 승인·의사록만 보내주셔도 다음 절차를 확인할 수 있습니다.",
  의료법인임원변경등기:
    "대표 변경과 병원장 변경이 동시에면 어느 쪽이 등기 대상인지 먼저 구분해 주세요.",
  의료법인주사무소이전등기:
    "이전 예정일과 허가 진행 단계만 알려주셔도 관할·서류 점검이 가능합니다.",
  사회복지법인임원변경등기:
    "인가 대상 여부가 불명확하면 등기 접수 전에 반드시 구분해 확인하세요.",
  체육단체사단법인설립:
    "종목·회원 수·임원 후보만 정리되어 있어도 허가·등기 준비 체크리스트를 만들 수 있습니다.",
  환경단체사단법인설립:
    "활동 지역과 주된 사업을 한 문장으로 적어 주시면 목적·관할 검토가 빨라집니다.",
  교회사단법인설립:
    "재산 명의와 의사결정 기구만 정리되어 있어도 설립 유형 상담을 시작할 수 있습니다.",
  사회적기업과법인설립차이:
    "인증 희망 시점과 출자 구조를 알려주시면 법인 설립 순서를 먼저 잡아 드립니다.",
  협동조합과주식회사차이:
    "의결권·출자 방식을 기준으로 두 유형을 비교한 뒤 설립 안내 페이지로 연결해 드립니다.",
  재단법인과공익법인차이:
    "목적과 기본재산 규모만 알려주셔도 재단·공익 검토 포인트를 정리해 드립니다.",
};

const data = { ...mod.SPECIAL_BODY_ENRICHMENTS };
for (const [k, v] of Object.entries(extras)) {
  const list = data[k] || [];
  if (list.includes(v)) continue;
  data[k] = [...list, v];
}

const entries = Object.entries(data)
  .map(([k, arr]) => {
    const paras = arr.map((p) => `    ${JSON.stringify(p)},`).join("\n");
    return `  ${JSON.stringify(k)}: [\n${paras}\n  ]`;
  })
  .join(",\n");

fs.writeFileSync(
  enrichPath,
  `/**
 * 본문 1,500자 미만 특수법인 페이지용 고유 줄글 보강.
 * 페이지마다 다른 문장만 두고, 공통 템플릿 복제를 피한다.
 */
export const SPECIAL_BODY_ENRICHMENTS: Record<string, string[]> = {
${entries},
};
`,
);
console.log("done");
