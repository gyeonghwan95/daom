import Image from "next/image";
import { siteConfig } from "@/lib/site";

export function HeroBrand() {
  return (
    <div className="home-hero__brand">
      <div className="home-hero__brand-mark" aria-hidden>
        <Image
          src="/image/logo.png"
          alt=""
          width={72}
          height={72}
          className="home-hero__brand-logo"
          priority
        />
      </div>
      <div className="min-w-0">
        <p className="home-hero__brand-name">{siteConfig.name}</p>
        <p className="home-hero__brand-rep">{siteConfig.representative}</p>
      </div>
    </div>
  );
}
