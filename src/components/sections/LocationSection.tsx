import { OfficeLocationInfo } from "@/components/contact/OfficeLocationInfo";
import { OfficeLocationGallery } from "@/components/sections/OfficeLocationGallery";
import { siteImages } from "@/lib/site-images";

export function LocationSection() {
  return (
    <div className="space-y-8">
      <OfficeLocationInfo
        sideImage={siteImages.location.header}
        showQuickContact={false}
      />
      <OfficeLocationGallery />
    </div>
  );
}
