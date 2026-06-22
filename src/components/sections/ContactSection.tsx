import { SiteImage } from "@/components/media/SiteImage";
import { ContactBox } from "@/components/sections/ContactBox";
import { NapInfoBlock } from "@/components/layout/NapInfoBlock";
import { siteImages } from "@/lib/site-images";

const consultationImages = [
  siteImages.contact.inPersonConsult,
  siteImages.contact.phoneConsult,
  siteImages.contact.onSiteConsult,
] as const;

export function ContactSection() {
  return (
    <div className="space-y-6 md:space-y-8">
      <section
        id="nap-info"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)] card-surface p-5 md:p-8"
      >
        <h2 className="section-heading">사무소 연락처 (NAP)</h2>
        <p className="mt-2 text-sm leading-relaxed text-navy/70 md:text-base">
          네이버 플레이스·홈페이지·상담 페이지에 동일하게 표시되는 공식 연락처입니다.
        </p>
        <NapInfoBlock variant="contact" showBusinessRegistration />
      </section>

      <section
        id="consultation-methods"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {consultationImages.map((image) => (
          <SiteImage
            key={image.src}
            {...image}
            className="block w-full overflow-hidden rounded-lg border border-beige-dark bg-beige/30 shadow-sm sm:rounded-xl"
            sizes="(max-width: 768px) 33vw, 240px"
          />
        ))}
        </div>
      </section>

      <section
        id="contact-form"
        className="section-anchor scroll-mt-[calc(var(--header-height)+1rem)]"
      >
        <ContactBox />
      </section>
    </div>
  );
}
