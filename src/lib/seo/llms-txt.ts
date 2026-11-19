import { getContactInfo } from "@/lib/contact";
import { formatLawyerProfileForAi } from "@/lib/lawyer-profile";
import { seoBrand } from "@/lib/seo/brand";
import { PREFETCH_CHAMPION_PATHS } from "@/lib/seo/inflow-policy";
import { getCanonicalUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site";
import { SERVICE_ANSWERS } from "@/data/seo/service-answers";

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
