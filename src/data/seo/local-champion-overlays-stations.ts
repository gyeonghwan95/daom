import type { PageFaqItem, PageSection } from "@/lib/pageData/types";

/**
 * 기존 얇은 *역법무사 URL 전용 overlay.
 * 신규 station URL 생성 금지(docs/seo/station-seo-before.md).
 * 역 = 접근 동선, Primary Host = 구·동 허브.
 */
type StationOverlay = {
  regionId: string;
  slug: string;
  introParagraphs: string[];
  sections: PageSection[];
  faqs?: PageFaqItem[];
  serviceLinks?: { href: string; label: string }[];
};

const workChoice = {
  href: "/부산법무사",
  label: "부산 전역 업무 선택 안내",
} as const;

function overlay(input: StationOverlay): StationOverlay {
  return {
    ...input,
    serviceLinks: input.serviceLinks ?? [
      workChoice,
      { href: "/부산부동산등기", label: "부산 부동산등기" },
    ],
  };
}

export const SEO_LANDING_STATION_OVERLAYS: Record<string, StationOverlay> = {
    "centum-city-station": overlay({
      regionId: "centum-city-station",
      slug: "센텀시티역법무사",
      introParagraphs: [
        "센텀시티역 법무사를 찾으시면 2호선 센텀시티역·벡스코 인근으로 오시는 동선의 법인·오피스 등기를 이 역세권 안내에서 연결하시면 됩니다. 센텀 업무지구 본문은 센텀 법무사 안내가 Primary Host입니다.",
        "역 이름만으로 관할이 바뀌지 않습니다. 법인 본점·부동산 주소를 기준으로 등기소를 확인합니다.",
      ],
      sections: [
        {
          title: "센텀시티역과 센텀 허브의 관계",
          body: "역 검색은 방문·환승 동선이고, 법인설립·임원변경·오피스 등기 실무는 센텀 법무사 안내에서 보시면 됩니다. 재송 주거는 재송동 안내로 이어집니다.",
          links: [
            { href: "/센텀법무사", label: "센텀 법무사" },
            { href: "/재송동법무사", label: "재송동 법무사" },
            { href: "/해운대법무사", label: "해운대 법무사" },
          ],
        },
        {
          title: "해운대 중동·우동과의 구분",
          body: "해운대역·중동 상권은 중동 안내, 마린시티·우동 주거는 우동 안내입니다. 센텀시티역 인근 법인·오피스만 이 페이지와 센텀 허브를 보시면 각도가 겹치지 않습니다.",
          links: [
            { href: "/중동법무사", label: "해운대 중동 법무사" },
            { href: "/우동법무사", label: "우동 법무사" },
            { href: "/해운대구부동산등기", label: "해운대구 부동산등기" },
          ],
        },
      ],
      faqs: [
        {
          question: "센텀시티역 법무사와 센텀 법무사는 다른가요?",
          answer:
            "역은 접근 동선 검색이고, 센텀 업무지구 법인·오피스 안내는 센텀 법무사 페이지가 Primary Host입니다.",
        },
      ],
      serviceLinks: [
        workChoice,
        { href: "/센텀법무사", label: "센텀 법무사" },
        { href: "/센텀법인설립등기", label: "센텀 법인설립등기" },
      ],
    }),
    "seomyeon-station": overlay({
      regionId: "seomyeon-station",
      slug: "서면역법무사",
      introParagraphs: [
        "서면역 법무사를 찾으시면 1·2호선 환승역 인근으로 오시는 동선의 상가·오피스 등기를 이 역세권 안내에서 연결하시면 됩니다. 서면 상권 본문은 서면 법무사 안내가 Primary Host입니다.",
        "부전·전포 행정동 실무는 각 동 안내, 구 전체는 부산진구 안내를 보시면 역 검색과 역할이 겹치지 않습니다.",
      ],
      sections: [
        {
          title: "서면역과 서면 허브의 관계",
          body: "환승역 검색은 접근 동선이고, 상가·오피스 매매·권리금 구분은 서면 안내에서 보시면 됩니다. 부전 지번만 확정되면 부전동 안내로 이어갑니다.",
          links: [
            { href: "/서면법무사", label: "서면 법무사" },
            { href: "/부전동법무사", label: "부전동 법무사" },
            { href: "/전포동법무사", label: "전포동 법무사" },
          ],
        },
        {
          title: "부산진구 부동산등기와의 연결",
          body: "잔금일·근저당 말소 등기 실무는 부산진구 부동산등기 안내와 서면 안내를 함께 보시면 됩니다.",
          links: [
            { href: "/부산진구부동산등기", label: "부산진구 부동산등기" },
            { href: "/부산진구법무사", label: "부산진구 법무사" },
          ],
        },
      ],
      faqs: [
        {
          question: "서면역 법무사와 서면 법무사는 다른가요?",
          answer:
            "역은 환승·접근 검색이고, 서면 상권 등기 본문은 서면 법무사 안내입니다. 관할은 주소 지번 기준입니다.",
        },
      ],
      serviceLinks: [
        workChoice,
        { href: "/서면법무사", label: "서면 법무사" },
        { href: "/부산진구부동산등기", label: "부산진구 부동산등기" },
      ],
    }),
    "haeundae-station": overlay({
      regionId: "haeundae-station",
      slug: "해운대역법무사",
      introParagraphs: [
        "해운대역 법무사를 찾으시면 해운대역·중동 상권으로 오시는 동선의 상가·주거 등기를 이 역세권 안내에서 연결하시면 됩니다. 중동 생활권 본문은 중동 법무사 안내, 구 전체는 해운대 안내가 Primary Host에 가깝습니다.",
        "센텀 법인은 센텀 안내, 우동·마린시티는 우동 안내로 이어가면 해운대역 각도와 겹치지 않습니다.",
      ],
      sections: [
        {
          title: "해운대역과 중동·해운대 허브",
          body: "역 검색은 접근 동선이고, 해운대역 앞 상가·오피스텔 등기는 중동 안내, 해운대구 전체 분기는 해운대 안내를 보시면 됩니다.",
          links: [
            { href: "/중동법무사", label: "해운대 중동 법무사" },
            { href: "/해운대법무사", label: "해운대 법무사" },
            { href: "/해운대구부동산등기", label: "해운대구 부동산등기" },
          ],
        },
        {
          title: "센텀·우동과의 구분",
          body: "센텀시티역·법인 오피스는 센텀 안내, 마린시티·우동 주거는 우동 안내입니다.",
          links: [
            { href: "/센텀법무사", label: "센텀 법무사" },
            { href: "/우동법무사", label: "우동 법무사" },
          ],
        },
      ],
      faqs: [
        {
          question: "해운대역 법무사와 중동 법무사는 같은가요?",
          answer:
            "같은 해운대역·중동 생활권에 가깝습니다. 역 이름은 이 페이지, 중동 상권 실무는 중동 안내, 구 전체는 해운대 안내를 보시면 됩니다.",
        },
      ],
      serviceLinks: [
        workChoice,
        { href: "/중동법무사", label: "해운대 중동 법무사" },
        { href: "/해운대구부동산등기", label: "해운대구 부동산등기" },
      ],
    }),
    "gwangan-station": overlay({
      regionId: "gwangan-station",
      slug: "광안역법무사",
      introParagraphs: [
        "광안역 법무사를 찾으시면 광안역 인근으로 오시는 동선의 전세·매매 등기를 이 역세권 안내에서 연결하시면 됩니다. 해변·전세권 본문은 광안리 안내, 행정동 실거주는 광안동 안내가 Primary에 가깝습니다.",
        "민락 오피스텔은 민락동 안내, 수영구 전체는 수영구 안내로 이어갑니다.",
      ],
      sections: [
        {
          title: "광안역과 광안리·광안동 안내",
          body: "역 검색은 접근 동선입니다. 해변·전세권은 광안리, 광안1~3동 실거주 매매·상속은 광안동 안내를 보시면 각도가 겹치지 않습니다.",
          links: [
            { href: "/광안리법무사", label: "광안리 법무사" },
            { href: "/광안동법무사", label: "광안동 법무사" },
            { href: "/수영구부동산등기", label: "수영구 부동산등기" },
          ],
        },
        {
          title: "전세만 급할 때",
          body: "전세권 설정·말소·보증금 이슈는 광안리·전세권 안내와 수영구 안내를 이어서 보시면 됩니다.",
          links: [
            { href: "/부산전세권설정등기", label: "전세권설정등기" },
            { href: "/수영구법무사", label: "수영구 법무사" },
          ],
        },
      ],
      faqs: [
        {
          question: "광안역 법무사와 광안리 법무사는 다른가요?",
          answer:
            "역은 접근 검색이고, 해변·전세권 본문은 광안리 안내입니다. 행정동 실거주는 광안동 안내를 보시면 됩니다.",
        },
      ],
      serviceLinks: [
        workChoice,
        { href: "/광안리법무사", label: "광안리 법무사" },
        { href: "/수영구부동산등기", label: "수영구 부동산등기" },
      ],
    }),
    "sasang-station": overlay({
      regionId: "sasang-station",
      slug: "사상역법무사",
      introParagraphs: [
        "사상역 법무사를 찾으시면 사상역·서부산 유통 인근으로 오시는 동선의 상가·공장·회생 상담을 이 역세권 안내에서 연결하시면 됩니다. 괘법 상가·공장 본문은 사상 법무사 안내, 구 전체는 사상구 안내가 Primary Host입니다.",
        "주례 주거는 주례동 안내, 개인회생만 급하면 사상구 개인회생·부산 개인회생 안내로 이어갑니다.",
      ],
      sections: [
        {
          title: "사상역과 사상·사상구 허브",
          body: "역 검색은 접근 동선이고, 공장·상가·근저당 실무는 사상 안내, 상속·회생 분기는 사상구 안내를 보시면 됩니다.",
          links: [
            { href: "/사상법무사", label: "사상 법무사" },
            { href: "/사상구법무사", label: "사상구 법무사" },
            { href: "/사상구부동산등기", label: "사상구 부동산등기" },
          ],
        },
        {
          title: "회생·상속과의 연결",
          body: "채무 상담이 많으면 사상구 개인회생·상속포기 안내를 이어서 보시면 역 페이지와 역할이 겹치지 않습니다.",
          links: [
            { href: "/사상구개인회생", label: "사상구 개인회생" },
            { href: "/사상구상속포기", label: "사상구 상속포기" },
            { href: "/부산개인회생", label: "부산 개인회생" },
          ],
        },
      ],
      faqs: [
        {
          question: "사상역 법무사와 사상 법무사는 같은가요?",
          answer:
            "역은 접근 검색이고, 괘법·공장·상가 본문은 사상 법무사 안내입니다. 구 전체 분기는 사상구 안내를 보시면 됩니다.",
        },
      ],
      serviceLinks: [
        workChoice,
        { href: "/사상법무사", label: "사상 법무사" },
        { href: "/사상구부동산등기", label: "사상구 부동산등기" },
      ],
    }),
    "myeongji-station": overlay({
      regionId: "myeongji-station",
      slug: "명지역법무사",
      introParagraphs: [
        "명지역 법무사를 찾으시면 명지역 인근으로 오시는 동선의 신도시·법인·부동산 등기를 이 역세권 안내에서 연결하시면 됩니다. 신도시·법인 본문은 명지 법무사 안내, 기존 명지동 지번은 명지동 안내가 Primary에 가깝습니다.",
        "에코델타 입주 기업은 에코델타 법인등기 안내, 강서구 전체는 강서구 안내로 이어갑니다.",
      ],
      sections: [
        {
          title: "명지역과 명지·명지동 안내",
          body: "역 검색은 접근 동선입니다. 신도시·법인·신축은 명지 허브, 기존 명지동 주거·토지는 명지동 안내를 보시면 각도가 겹치지 않습니다.",
          links: [
            { href: "/명지법무사", label: "명지 법무사" },
            { href: "/명지동법무사", label: "명지동 법무사" },
            { href: "/강서구부동산등기", label: "강서구 부동산등기" },
          ],
        },
        {
          title: "에코델타·강서구와의 연결",
          body: "에코델타 설립·본점이전은 에코델타 법인등기 안내, 녹산·대저 흡수는 강서구 허브를 보시면 됩니다.",
          links: [
            { href: "/에코델타시티법인등기", label: "에코델타시티 법인등기" },
            { href: "/강서구법무사", label: "강서구 법무사" },
          ],
        },
      ],
      faqs: [
        {
          question: "명지역 법무사와 명지 법무사는 다른가요?",
          answer:
            "역은 접근 검색이고, 신도시·법인 본문은 명지 법무사 안내입니다. 기존 명지동 지번은 명지동 안내를 보시면 됩니다.",
        },
      ],
      serviceLinks: [
        workChoice,
        { href: "/명지법무사", label: "명지 법무사" },
        { href: "/강서구부동산등기", label: "강서구 부동산등기" },
      ],
    }),
  };
