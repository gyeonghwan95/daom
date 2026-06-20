import { OfficeLocationInfo } from "@/components/contact/OfficeLocationInfo";
import { OfficeLocationGallery } from "@/components/sections/OfficeLocationGallery";

export function LocationSection() {
  return (
    <div className="space-y-8">
      <OfficeLocationInfo />
      <OfficeLocationGallery />
    </div>
  );
}
