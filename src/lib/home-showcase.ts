import type {
  HomeActivityItem,
  HomePressItem,
  ShowcaseImage,
} from "@/lib/home-showcase-types";
import { lawyerExternalActivities } from "@/lib/lawyer-activities";
import { getAllPressArticles, getPressArticleHref } from "@/lib/press-articles";
import { siteImages } from "@/lib/site-images";

export type {
  HomeActivityItem,
  HomePressItem,
  ShowcaseImage,
} from "@/lib/home-showcase-types";

export { homeShowcaseIntro } from "@/lib/home-showcase-types";

function toShowcase(asset: { src: string; alt: string; placeholder?: boolean }): ShowcaseImage {
  return {
    src: asset.src,
    alt: asset.alt,
    placeholder: asset.placeholder,
  };
}

const pressMeta: Omit<HomePressItem, "image">[] = getAllPressArticles().map(
  (article) => ({
    id: article.slug,
    source: article.source,
    title: article.title,
    date: article.publishedAtDisplay,
    url: getPressArticleHref(article.slug),
  }),
);

export const homeActivityItems: HomeActivityItem[] = lawyerExternalActivities.map(
  (item) => ({
    id: item.id,
    category: item.category,
    title: item.title,
    subtitle: item.subtitle,
    period: item.period,
    image: toShowcase(item.image),
  }),
);

export const homePressItems: HomePressItem[] = pressMeta.map((item, index) => {
  const article = getAllPressArticles()[index];
  const imageAsset = article?.image ?? siteImages.home.press[index] ?? siteImages.home.press[0];

  return {
    ...item,
    image: toShowcase(imageAsset),
  };
});

/** @deprecated youtube-videos.ts의 youtubeVideos 사용 */
export { homeYoutubeVideos, youtubeVideos } from "@/lib/youtube-videos";
