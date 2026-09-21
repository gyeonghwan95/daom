import type { PageData } from "@/lib/pageData/types";
import { getLocalLandingConfig } from "@/lib/local-landing/config";
import { getPressArticle } from "@/lib/press-articles";
import { resolveCarouselBodyImage } from "@/lib/seo/carousel-images";
import { getTopicHubConfig } from "@/lib/topic-hubs/config";
import {
  getBlogPostImage,
  getCaseImage,
  getServiceImage,
  siteImages,
  type SiteImageAsset,
} from "@/lib/site-images";

export function getCoverImageForPageData(page: PageData): SiteImageAsset {
  const carouselImage = resolveCarouselBodyImage(page.path);
  if (carouselImage) return carouselImage;

  switch (page.category) {
    case "service":
      return getServiceImage(page.slug);
    case "blog":
      return getBlogPostImage(page.slug);
    case "case":
      return getCaseImage(page.slug);
    case "faq":
      return siteImages.faq.cover;
    case "media": {
      const article = getPressArticle(page.slug);
      return article?.image ?? siteImages.press.cover;
    }
    case "external":
      return siteImages.blog.defaultThumb;
    case "pillar": {
      const hub = getTopicHubConfig(page.slug);
      return hub
        ? getServiceImage(hub.primaryServiceSlug)
        : siteImages.seo.defaultOg;
    }
    case "local":
    case "cost":
    case "court":
    case "businessDistrict":
    case "realEstate": {
      const landing = getLocalLandingConfig(page.slug);
      return landing
        ? getServiceImage(landing.serviceSlug)
        : siteImages.seo.defaultOg;
    }
    default:
      return siteImages.seo.defaultOg;
  }
}
