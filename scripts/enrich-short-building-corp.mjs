import fs from "fs";
import path from "path";

const enrichments = {
  건물면적상이경정등기:
    "면적 차이 원인을 대장 측량·도면·실제 사용으로 나눈 뒤, 경정·표시변경·추가 측량 중 맞는 경로를 고르는 것이 핵심입니다. 숫자만 맞추려다 표시 근거가 어긋나면 보정이 반복됩니다.",
  건물합병등기:
    "합병 전 각 동·호의 권리관계(근저당·임차·가압류)가 다르면 합병 자체가 막히거나 후속 말소·이전이 꼬일 수 있습니다. 권리 정리를 먼저 보고 합병 시점을 잡는 편이 안전합니다.",
  일반건물집합건물전환등기:
    "일반건물에서 집합건물로 바꾸려면 전유·공용·대지권 표시를 새로 맞추는 작업이 필요합니다. 전환 전 임대·담보 상태가 있으면 전환 가능 여부와 순서를 함께 검토해야 합니다.",
  미등기건물소유권보존등기:
    "미등기건물은 건축물대장·취득 원인·점유 경위를 먼저 모아 보존등기 가능 여부를 가늠합니다. 서류가 얇으면 원인 증명부터 보강해야 접수 단계에서 막히지 않습니다.",
  사상구공장창고등기:
    "사상·감전·학장 일대 공장·창고는 용도·필지·담보 관계가 겹치는 경우가 많아, 보존·이전·표시변경 중 무엇이 필요한지 대장과 등기부를 같이 보는 것이 중요합니다.",
  기장신축건물보존등기:
    "기장·정관·일광 신축은 사용승인 직후 보존등기 일정이 분양·대출과 맞물리는 경우가 많습니다. 건축주가 개인인지 법인인지에 따라 서류 구성이 달라지므로 초기부터 구분해 준비합니다.",
  부산지점설치등기:
    "지점설치는 본점 관할과 지점 소재지 표시, 정관상 지점 설치 근거를 함께 확인합니다. 영업소만 두고 지점등기를 생략하는 경우와 혼동하지 않도록 실제 운영 형태부터 정리합니다.",
  부산지점폐지등기:
    "지점폐지는 설치 때와 달리 폐지 결의·잔여 거래·사업자등록 정리 순서를 맞추는 것이 중요합니다. 등기만 남기고 영업을 중단한 지점은 대외 서류와 불일치가 생기기 쉽습니다.",
  부산감자등기:
    "감자는 채권자 보호 절차 유무에 따라 준비 기간이 크게 달라집니다. 유상증자 페이지와 반대로 자본을 줄이는 결의·공고·등기 순서를 별도로 설계해야 합니다.",
  부산무상증자등기:
    "무상증자는 납입 없이 준비금을 자본에 전입하는 구조라 유상증자와 결의·첨부서류가 다릅니다. 회계상 가능 여부와 등기 가능 시점을 같이 확인한 뒤 접수하는 편이 안전합니다.",
  부산공동대표변경등기:
    "공동대표·각자대표는 대표권 행사 방식이 바뀌는 등기이므로, 은행·계약 서명 실무까지 함께 맞춰야 합니다. 단순 이사 변경과 혼동하면 대표권 공백이 남을 수 있습니다.",
  부산임원사임해임등기:
    "사임·해임은 임기만료·중임과 결의 취지와 첨부서류가 다릅니다. 후임 유무와 대표권 공백을 먼저 정리해야 접수 후 보정이나 거래 중단을 줄일 수 있습니다.",
  부산개인사업자법인전환:
    "법인전환은 단순 설립과 달리 사업·계약·자산 승계 순서를 같이 봅니다. 개인 명의 부동산·임대차·인허가가 있으면 설립등기만으로 끝나지 않을 수 있습니다.",
  부산법인해산전확인사항:
    "폐업신고만 하고 법인을 방치하면 등기부상 회사가 남아 과태료·거래 이슈가 이어질 수 있습니다. 해산·청산·휴면 계속 중 무엇이 맞는지 재산·채무부터 확인합니다.",
};

const files = [
  "src/lib/building-intent/content/display-change.ts",
  "src/lib/building-intent/content/split-special-regional.ts",
  "src/lib/corporate-intent/content/phase-gaps.ts",
];

for (const rel of files) {
  const full = path.join(process.cwd(), rel);
  let text = fs.readFileSync(full, "utf8");
  let changed = 0;
  for (const [slug, para] of Object.entries(enrichments)) {
    if (!text.includes(`slug: "${slug}"`)) continue;
    if (text.includes(para.slice(0, 28))) continue;
    const marker = `slug: "${slug}"`;
    const idx = text.indexOf(marker);
    const hIdx = text.indexOf("heroParagraphs: [", idx);
    if (hIdx < 0 || hIdx - idx > 1200) continue;
    const after = text.slice(hIdx);
    const closeMatch = after.match(/heroParagraphs:\s*\[[\s\S]*?\n\s*\],/);
    if (!closeMatch) continue;
    const block = closeMatch[0];
    const escaped = para.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const newBlock = block.replace(/\n\s*\],$/, `,\n    "${escaped}",\n  ],`);
    text = text.slice(0, hIdx) + newBlock + text.slice(hIdx + block.length);
    changed += 1;
  }
  if (changed) {
    fs.writeFileSync(full, text);
    console.log(rel, "enriched", changed);
  } else {
    console.log(rel, "no change");
  }
}
