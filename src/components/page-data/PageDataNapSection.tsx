import Link from "next/link";
import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { NapInfoBlock } from "@/components/layout/NapInfoBlock";
import { getDirectConsultationChannels } from "@/lib/contact";
import type { PageRelatedLink } from "@/lib/pageData/types";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

type PageDataNapSectionProps = {
  contactLinks?: PageRelatedLink[];
};

export function PageDataNapSection({ contactLinks }: PageDataNapSectionProps) {
  const channels = getDirectConsultationChannels();

  return (
    <section
      id="office-info"
      className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] border-t border-beige-dark pt-8 md:pt-10"
    >
      <h2 className="section-heading">다옴법무사사무소 안내</h2>
      <p className="body-text prose-measure mt-3">
        부산 해운대구·센텀 인근에 위치한 다옴법무사사무소입니다. 안윤정 법무사가
        상속등기·부동산등기·법인등기·개인회생·파산 사건을 상담합니다.
      </p>

      <div className="mt-6 max-w-xl">
        <ConsultationButtons
          channels={channels}
          theme="light"
          layout="tile"
          showLabels="short"
          showQrCodes={false}
        />
      </div>

      {contactLinks && contactLinks.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {contactLinks.map((link) => (
            <li key={link.href}>
              {isExternalHref(link.href) ? (
                <a
                  href={link.href}
                  className="font-semibold text-navy underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="font-semibold text-navy underline-offset-2 hover:underline"
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8 border-t border-beige-dark pt-6">
        <NapInfoBlock variant="contact" showOpeningHours />
      </div>
    </section>
  );
}
