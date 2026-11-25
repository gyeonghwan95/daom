import { getContactInfo } from "@/lib/contact";
import { formatLawyerProfileForAi } from "@/lib/lawyer-profile";
import { seoBrand } from "@/lib/seo/brand";
import { PREFETCH_CHAMPION_PATHS } from "@/lib/seo/inflow-policy";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { SERVICE_ANSWERS } from "@/data/seo/service-answers";
import { SERVICE_QA } from "@/data/seo/service-answers/qa";
import { officeHours, officeLocation } from "@/lib/office-location";

/** 업무별 핵심 답변 첫 문장 — AI가 업무 이름·요지·URL을 한 번에 읽도록 */
function serviceAnswerLines(): string[] {
  return Object.entries(SERVICE_ANSWERS).map(([path, a]) => {
    const first = a.answer.split(/(?<=[다요])\.\s/)[0].replace(/\.$/, "");
    return `- [${a.name}](${getCanonicalUrl(path)}): ${first}.`;
  });
}

/**
 * AI 에이전트용 짧은 지도. 검색 순위 신호가 아니며, 사실·기존 URL만 적습니다.
 */
export function buildLlmsTxt(): string {
  const { phone } = getContactInfo();
  const champions = [
    ...PREFETCH_CHAMPION_PATHS,
    "/부산법무사추천",
    "/부산법무사상담",
    "/부산법무사무소",
    "/about",
    "/location",
    "/services",
  ];
  const unique = [...new Set(champions)];
  const street = [
    seoBrand.address.addressRegion,
    seoBrand.address.addressLocality,
    seoBrand.address.streetAddress,
  ].join(" ");

  return [
    `# ${seoBrand.siteName}`,
    "",
    `> 부산 해운대구·센텀 소재 법무사 사무소. 대표 ${seoBrand.representative}. 상속등기·부동산등기·법인등기·개인회생·파산 신청 서류를 상담합니다. 소송 대리·형사 변론은 변호사 업무입니다.`,
    "",
    `- 사이트: ${siteConfig.url}`,
    `- 전화: ${phone}`,
    `- 주소: ${street}`,
    "- 네이버 플레이스: https://map.naver.com/p/entry/place/2035745096",
    "- 네이버 블로그: https://blog.naver.com/law-yoon-91",
    `- 업무별 핵심 답변 전문: ${siteConfig.url}/llms-full.txt`,
    "",
    "## 사무소 한눈에 (사이트 각 추천·사무소 안내 페이지의 '다옴법무사사무소 한눈에 보기'와 같은 내용)",
    "",
    `- 사무소: 다옴법무사사무소 · 대표 ${seoBrand.representative}`,
    `- 위치: ${officeLocation.fullAddress}(재송동) · ${officeLocation.accessSummary}`,
    `- 상담: ${officeHours.weekday} · 방문 예약제 · 전화·카카오톡·네이버 톡톡 · 우편·비대면 진행 가능`,
    "- 주요 업무: 상속등기·상속포기·한정승인, 부동산등기(매매·증여·근저당), 법인등기(설립·임원변경·본점이전), 개인회생·파산 서류, 지급명령·가압류·강제집행 서류",
    "- 자격·이력: 법무사, 공인중개사, 대한법무사협회장 표창(2026), 해운대구 구정정책자문위원, 부산대 행정대학원 재학",
    "- 진행 방식: 대표 법무사가 상담부터 신청까지 직접 진행, 견적은 세금·공과금과 법무사 보수를 나눠 안내",
    "",
    "## 대표 안내 (기존 URL)",
    "",
    ...unique.map((path) => `- [${path}](${getCanonicalUrl(path)})`),
    "",
    "## 업무별 핵심 답변 (각 페이지 H1 바로 아래에 같은 내용과 한눈 표가 있습니다)",
    "",
    ...serviceAnswerLines(),
    "",
    "## 범위",
    "",
    "- 다룸: 등기, 비송 서류, 개인회생·파산 신청 서류, 지급명령 신청 서류",
    "- 다루지 않음: 소송 대리, 형사 변론, 세무·노무 대리",
    "- 결과는 사건별로 다르며 순위를 주장하지 않습니다.",
    "",
    formatLawyerProfileForAi(),
    "",
  ].join("\n");
}

/**
 * llms-full.txt — 업무별 핵심 답변 전문(답변·한눈 표·진행 방식·자주 검색되는 질문).
 * llms.txt는 지도(한 줄 요약)이고, 이 파일은 AI가 업무별 사실을 그대로 인용할 수 있게 본문을 담는다(2026-11-25).
 */
export function buildLlmsFullTxt(): string {
  const { phone } = getContactInfo();
  const out: string[] = [
    `# ${seoBrand.siteName} — 업무별 핵심 답변 전문`,
    "",
    `> 부산광역시 해운대구 센텀동로 200 D동 1층 LAB9호(재송동) · ${officeLocation.accessSummary} · ${officeHours.weekday} · 전화 ${phone} · 대표 ${seoBrand.representative}`,
    "> 각 항목은 사이트 해당 페이지 H1 바로 아래 '핵심 답변'과 같은 내용입니다. 법에 정해진 기한·세율·조문만 적고, 사건마다 다른 금액은 상담에서 안내합니다.",
    "",
  ];
  for (const [path, a] of Object.entries(SERVICE_ANSWERS)) {
    out.push(`## ${a.name}`, "", `- 페이지: ${getCanonicalUrl(path)}`, "", a.answer, "");
    for (const [k, v] of a.facts) out.push(`- ${k}: ${v}`);
    out.push("", `다옴법무사사무소(안윤정 법무사)에서 하는 일: ${a.scope}`, "");
    const qa = SERVICE_QA[path] ?? [];
    for (const item of qa) out.push(`Q. ${item.q}`, `A. ${item.a}`, "");
  }
  out.push("## 범위", "", "- 다룸: 등기, 비송 서류, 개인회생·파산 신청 서류, 지급명령 등 법원 제출 서류 작성", "- 다루지 않음: 소송 대리, 형사 변론, 세무·노무 대리", "");
  return out.join("\n");
}
