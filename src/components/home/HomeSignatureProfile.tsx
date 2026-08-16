import Image from "next/image";
import Link from "next/link";
import { homeTrust } from "@/lib/home-content";
import { lawyerCredentials, lawyerExperience } from "@/lib/lawyer-profile";
import { siteImages } from "@/lib/site-images";
import { siteConfig } from "@/lib/site";

export function HomeSignatureProfile() {
  const photo = siteImages.about.portrait;
  const license = lawyerCredentials.find((item) => item.category === "국가자격");
  const current = lawyerExperience[0];

  return (
    <section id="home-trust" className="home-v2-section home-v2-section--white home-section-anchor">
      <div className="home-v2-wrap">
        <div className="home-v2-signature">
          <div className="home-v2-signature__photo">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="home-v2-kicker">Representative</p>
            <h2 className="home-v2-h2">
              {siteConfig.representative} 법무사
            </h2>
            <blockquote className="home-v2-quote">“{homeTrust.quote}”</blockquote>
            <ul className="home-v2-facts">
              {homeTrust.points.map((point) => (
                <li key={point.title}>
                  <strong>{point.title}</strong>
                  <span>{point.body}</span>
                </li>
              ))}
              {license ? (
                <li>
                  <strong>자격</strong>
                  <span>
                    {license.name}
                    {license.year ? ` · ${license.year}` : ""}
                    {license.detail ? ` · ${license.detail}` : ""}
                  </span>
                </li>
              ) : null}
              {current ? (
                <li>
                  <strong>현재</strong>
                  <span>
                    {current.period} · {current.title}
                  </span>
                </li>
              ) : null}
            </ul>
            <p className="mt-6">
              <Link href="/about" className="home-v2-more">
                전체 프로필 보기 →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
