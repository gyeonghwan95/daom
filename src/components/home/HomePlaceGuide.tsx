import Link from "next/link";
import { CopyAddressButton } from "@/components/contact/CopyAddressButton";
import { VisitNoticeBanner } from "@/components/contact/VisitNoticeBanner";
import { Container } from "@/components/layout/Container";
import { HomeSectionActionLink } from "@/components/home/HomeSectionActionLink";
import { OfficeMap } from "@/components/map/OfficeMap";
import { Reveal } from "@/components/motion/Reveal";
import { getNapInfo } from "@/lib/business-info";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { officeHours, officeLocation } from "@/lib/office-location";

export function HomePlaceGuide() {
  const nap = getNapInfo();
  const { phone } = getContactInfo();

  return (
    <section className="home-place-guide w-full py-8 md:py-10 lg:py-12">
      <Container className="home-place__shell max-w-5xl">
        <Reveal className="home-place__head">
          <p className="home-section-label text-navy-light">Visit</p>
          <h2 className="home-place__title">오시는 길</h2>
          <p className="home-place__lede">
            {officeLocation.areaLabel} · {officeLocation.subway}
          </p>
        </Reveal>

        <div className="home-place__panel">
          <div className="home-place__map" id="home-directions">
            <OfficeMap compact />
          </div>

          <div className="home-place__info">
            <div className="home-place__facts">
              <div className="home-place__fact home-place__fact--address">
                <p className="home-place__fact-label">주소</p>
                <p className="home-place__fact-value">{nap.address}</p>
                <p className="home-place__fact-note">{officeLocation.room}</p>
                <CopyAddressButton className="home-place__copy" />
              </div>

              {nap.representative ? (
                <div className="home-place__fact">
                  <p className="home-place__fact-label">대표자</p>
                  <p className="home-place__fact-value">{nap.representative}</p>
                </div>
              ) : null}

              {nap.businessRegistrationNumber ? (
                <div className="home-place__fact">
                  <p className="home-place__fact-label">사업자등록번호</p>
                  <p className="home-place__fact-value">
                    {nap.businessRegistrationNumber}
                  </p>
                </div>
              ) : null}

              {phone ? (
                <div className="home-place__fact">
                  <p className="home-place__fact-label">전화</p>
                  <a href={getPhoneHref(phone)} className="home-place__phone">
                    {nap.phone}
                  </a>
                </div>
              ) : null}

              <div className="home-place__fact">
                <p className="home-place__fact-label">대중교통</p>
                <p className="home-place__fact-value">{officeLocation.subway}</p>
              </div>

              <div className="home-place__fact">
                <p className="home-place__fact-label">주차</p>
                <p className="home-place__fact-value">{officeLocation.parking}</p>
                <Link href="/location#parking" className="home-place__more">
                  주차 위치 보기
                </Link>
              </div>
            </div>

            <div id="home-hours" className="home-place__hours">
              <p className="home-place__fact-label">운영시간</p>
              <dl className="home-place__hours-grid">
                <div>
                  <dt>평일</dt>
                  <dd>{officeHours.weekday}</dd>
                </div>
                <div>
                  <dt>점심</dt>
                  <dd>{officeHours.lunch}</dd>
                </div>
                <div>
                  <dt>휴무</dt>
                  <dd>{officeHours.closed}</dd>
                </div>
              </dl>
              <p className="home-place__hours-note">{officeHours.note}</p>
            </div>

            <div className="home-place__foot">
              <VisitNoticeBanner variant="compact" theme="light" />
              <HomeSectionActionLink
                href="/location"
                label="오시는 길 상세"
                variant="button"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
