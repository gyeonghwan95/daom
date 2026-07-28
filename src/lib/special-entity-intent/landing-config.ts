import type { LocalLandingConfig } from "@/types/local-landing";
import { getAllSpecialEntitySlugs } from "@/lib/special-entity-intent/content";

const busanSlugs = new Set([
  "부산비영리법인설립등기",
  "부산사단법인설립",
  "부산재단법인설립",
  "부산특수법인등기",
  "부산협회단체법인설립",
  "부산조합협동조합등기",
  "부산비영리법인변경등기",
  "부산사회적협동조합설립",
  "부산협동조합설립등기",
  "부산농업회사법인설립",
  "부산사회복지법인등기",
  "부산의료법인등기",
  "부산학교법인등기",
  "해운대비영리법인설립",
  "수영구비영리법인설립",
  "부산진구비영리법인설립",
  "부산문화예술단체법인설립",
  "부산체육단체법인설립",
]);

const gyeongnamSlugs = new Set([
  "경남사단법인설립",
  "경남재단법인설립",
  "창원비영리법인설립",
]);

const haeundaeSlugs = new Set(["해운대비영리법인설립"]);
const suyeongSlugs = new Set(["수영구비영리법인설립"]);
const busanjinSlugs = new Set(["부산진구비영리법인설립"]);

export const specialEntityIntentLandingConfigs: LocalLandingConfig[] =
  getAllSpecialEntitySlugs().map((slug) => {
    const isBusanDistrict =
      haeundaeSlugs.has(slug) ||
      suyeongSlugs.has(slug) ||
      busanjinSlugs.has(slug) ||
      busanSlugs.has(slug);

    let regionKey = "national";
    let regionLabel = "전국";
    let neighborhoods: string[] = [];

    if (haeundaeSlugs.has(slug)) {
      regionKey = "haeundae";
      regionLabel = "해운대구";
      neighborhoods = ["센텀", "우동", "재송동", "좌동"];
    } else if (suyeongSlugs.has(slug)) {
      regionKey = "suyeong";
      regionLabel = "수영구";
      neighborhoods = ["광안동", "민락동", "남천동"];
    } else if (busanjinSlugs.has(slug)) {
      regionKey = "busanjin";
      regionLabel = "부산진구";
      neighborhoods = ["서면", "전포동", "부전동"];
    } else if (busanSlugs.has(slug)) {
      regionKey = "busan";
      regionLabel = "부산";
      neighborhoods = [
        "해운대구",
        "센텀",
        "수영구",
        "연제구",
        "동래구",
        "부산진구",
      ];
    } else if (gyeongnamSlugs.has(slug)) {
      regionKey = "gyeongnam";
      regionLabel = slug.startsWith("창원") ? "창원" : "경남";
      neighborhoods = ["창원", "김해", "양산", "거제", "진주"];
    }

    return {
      slug,
      pageType: "special-entity-intent" as const,
      keywordKey: slug,
      serviceSlug:
        slug.includes("변경") || slug.includes("임원")
          ? "director-change"
          : "corporate-registration",
      regionKey,
      regionLabel,
      neighborhoods: isBusanDistrict || gyeongnamSlugs.has(slug) ? neighborhoods : [],
    };
  });
