import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { siteImages } from "@/lib/site-images";
import { homeTrust } from "@/lib/home-content";
import { siteConfig } from "@/lib/site";

export function HomeTrust() {
  return (
    <section className="home-trust w-full py-14 md:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal variant="scaleIn">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
              <Image
                src={siteImages.home.trust.src}
                alt={siteImages.home.trust.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="home-section-label text-navy-light">
                {siteConfig.representative}
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-navy md:text-3xl">
                {homeTrust.title}
              </h2>
              <blockquote className="mt-5 border-l-2 border-navy/20 pl-5 text-base leading-relaxed text-navy/80 md:text-lg">
                {homeTrust.quote}
              </blockquote>
              <p className="mt-5 text-sm leading-relaxed text-navy/70 md:text-base">
                {homeTrust.identity}
              </p>
            </Reveal>

            <Stagger className="mt-8 space-y-5" stagger={0.08}>
              {homeTrust.points.map((point) => (
                <StaggerItem key={point.title} as="div">
                  <div className="border-b border-navy/8 pb-5 last:border-0">
                    <h3 className="font-semibold text-navy">{point.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy/65 md:text-base">
                      {point.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.2} className="mt-8">
              <Link href="/about" className="btn-secondary">
                법무사 소개
              </Link>
            </Reveal>
          </div>
        </div>

        <section
          aria-labelledby="home-consultation-choice-title"
          className="mt-10 rounded-2xl border border-beige-dark bg-white p-5 md:p-7"
        >
          <h3 id="home-consultation-choice-title" className="text-lg font-bold text-navy md:text-xl">
            부산에서 법무사 상담을 찾을 때, 목적부터 구분해 보세요
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-semibold text-navy">법원 무료 법률상담을 찾는 경우</p>
              <p className="mt-1 text-sm leading-relaxed text-navy/70">
                짧은 절차 확인은 부산법원종합청사(연제구 법원로 31) 2층 211·212호에서
                평일 10:00–12:00 법무사 상담으로 받을 수 있습니다. 방문해 번호표 순서로 진행하고
                전화 예약은 없습니다. 부산고등법원·부산가정법원·부산회생법원 안내가 같은 청사
                상담실을 가리킵니다. 시청 1층 상담실은 화·목 사전예약제입니다. 일정은 바뀔 수
                있으니 방문 전 공식 안내를 확인하세요.
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a
                  href="https://busan.scourt.go.kr/bsgodung/civil/civil_03/lawadvice_01/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy-light underline underline-offset-4"
                >
                  부산고등법원 안내
                </a>
                <a
                  href="https://busan.scourt.go.kr/bsfamily/civil/civil_03/lawadvice_01/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy-light underline underline-offset-4"
                >
                  부산가정법원 안내
                </a>
                <a
                  href="https://bsb.scourt.go.kr/bsb/civil/civil_02/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy-light underline underline-offset-4"
                >
                  부산회생법원 안내
                </a>
                <a
                  href="https://www.busan.go.kr/depart/freelegaladvice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-navy-light underline underline-offset-4"
                >
                  부산시 무료 법률상담
                </a>
              </div>
            </div>
            <div>
              <p className="font-semibold text-navy">등기·신청 업무를 맡기려는 경우</p>
              <p className="mt-1 text-sm leading-relaxed text-navy/70">
                상담 뒤에 서류 작성과 등기소·법원 접수, 보정까지 맡길 일은 안윤정 법무사가
                사안을 확인한 뒤 업무 범위, 준비서류, 보수와 공과금 구분을 안내합니다.
                맡길지 정하기 전에 비용만 물어보셔도 됩니다. 소송 대리와 형사 변론은 변호사 업무입니다.
              </p>
              <Link href="/contact" className="mt-2 inline-flex text-sm font-medium text-navy-light underline underline-offset-4">
                다옴법무사사무소에 상담 문의
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </section>
  );
}
