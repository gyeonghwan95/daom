import { RelatedRecommendationsDisplay } from "@/components/internal-links/RelatedRecommendationsDisplay";
import type { RecommendationSource } from "@/lib/internal-links";
import { recommendInternalLinks } from "@/lib/internal-links/server";

type RelatedRecommendationsProps = {
  source: RecommendationSource;
  title?: string;
  className?: string;
};

export function RelatedRecommendations({
  source,
  title,
  className,
}: RelatedRecommendationsProps) {
  const groups = recommendInternalLinks(source);

  return (
    <RelatedRecommendationsDisplay
      groups={groups}
      title={title}
      className={className}
    />
  );
}
