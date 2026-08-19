import { SiteImage } from "@/components/media/SiteImage";
import { ProseParagraphs } from "@/components/readability";
import Link from "next/link";
import { siteImages, type SiteImageAsset } from "@/lib/site-images";

type HubLawyerPortraitProps = {
  alt: string;
  paragraphs: string[];
  showHomeOfficeLink?: boolean;
};

export function HubLawyerPortrait({
  alt,
  paragraphs,
  showHomeOfficeLink = false,
}: HubLawyerPortraitProps) {
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
        <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {showHomeOfficeLink ? (
            <Link
              href="/"
              className="text-sm font-medium text-navy underline-offset-2 hover:underline"
            >
              부산 법무사 안윤정 · 다옴법무사사무소
            </Link>
          ) : null}
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
