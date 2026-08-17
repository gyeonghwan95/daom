import { SiteImage } from "@/components/media/SiteImage";
import { ProseParagraphs } from "@/components/readability";
import Link from "next/link";
import { siteImages, type SiteImageAsset } from "@/lib/site-images";

type HubLawyerPortraitProps = {
  alt: string;
  paragraphs: string[];
};

export function HubLawyerPortrait({ alt, paragraphs }: HubLawyerPortraitProps) {
  const portrait: SiteImageAsset = {
    ...siteImages.about.portrait,
    alt,
  };

  return (
    <div className="grid items-start gap-6 md:grid-cols-[200px_minmax(0,1fr)]">
      <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-xl border border-beige-dark bg-beige">
        <SiteImage
          {...portrait}
          fill
          variant="cover"
          sizes="200px"
          className="h-full w-full"
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-lg font-semibold text-navy">안윤정 법무사</h3>
        <ProseParagraphs paragraphs={paragraphs} />
        <p className="mt-4">
          <Link
            href="/about"
            className="text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            안윤정 법무사 소개
          </Link>
        </p>
      </div>
    </div>
  );
}
