/**
 * 사이트 이미지 경로 레지스트리
 *
 * 실제 사진 교체: public/image/ 아래 동일 파일명으로 덮어쓰기
 *
 * public/image/
 * ├── home/          hero, heroSlides, trust, activities/, press/
 * ├── about/         profile
 * ├── office/        exterior, nameplate, map, direction-*, parking, gallery
 * ├── media/         community, policy, education, gallery-*
 * ├── services/      cover + {slug}.jpg
 * ├── blog/          cover, default-thumb, posts/{slug}.jpg
 * ├── cases/         cover, default-thumb, items/{slug}.jpg
 * ├── contact/       상담_top, 전화·대면·출장 상담
 * ├── press/         언론보도 기사 이미지
 * ├── location/      header
 * └── faq/           cover
 */

export type SiteImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** @deprecated 배지 미사용 — 하위 호환용 */
  placeholder?: boolean;
};

function img(
  src: string,
  alt: string,
  width = 1200,
  height = 800,
  placeholder = false,
): SiteImageAsset {
  return { src, alt, width, height, placeholder };
}

const SERVICE_SLUGS = [
  "inheritance-registration",
  "inheritance-renunciation",
  "qualified-acceptance",
  "real-estate-registration",
  "ownership-transfer",
  "corporate-registration",
  "company-establishment",
  "director-change",
  "personal-rehabilitation",
  "bankruptcy",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const siteFavicon = "/image/logo.png";

export const siteImages = {
  logo: img(siteFavicon, "다옴법무사사무소 로고", 400, 120, false),

  seo: {
    defaultOg: img("/image/home/hero.jpg", "다옴법무사사무소", 1200, 630, true),
  },

  home: {
    hero: img("/image/home/hero.jpg", "다옴법무사사무소 전경", 1200, 900),
    /** 홈 히어로 우측 세로 슬라이드 — 항목 추가·순서 변경 시 이 배열만 수정 */
    heroSlides: [
      img("/image/home/hero.jpg", "다옴법무사사무소 전경", 1200, 900),
      img("/image/home/trust.png", "안윤정 법무사 상담", 1000, 800),
      img("/image/office/exterior.jpg", "다옴법무사사무소 외관", 1200, 800),
    ],
    trust: img("/image/home/trust.png", "안윤정 법무사 상담", 1000, 800),
    activities: [
      img("/image/home/activities/01.jpg", "기업 MOU 법률지원", 800, 600),
      img("/image/home/activities/02.jpg", "공공기관 협업", 800, 600),
      img("/image/home/activities/03.jpg", "청년 법률 지원", 800, 600),
      img("/image/home/activities/04.jpg", "협회장 표창", 800, 600),
      img("/image/home/activities/05.jpg", "정책 자문 활동", 800, 600),
      img("/image/home/activities/06.jpg", "법률 강의", 800, 600),
      img("/image/home/activities/07.jpg", "국제 법무 교류", 800, 600),
    ],
    press: [
      img("/image/home/press/01.jpg", "언론 보도 1", 800, 600),
      img("/image/home/press/02.jpg", "언론 보도 2", 800, 600),
      img("/image/home/press/03.jpg", "언론 보도 3", 800, 600),
      img("/image/home/press/04.jpg", "언론 보도 4", 800, 600),
      img("/image/home/press/05.jpg", "언론 보도 5", 800, 600),
      img("/image/home/press/06.jpg", "언론 보도 6", 800, 600),
    ],
  },

  about: {
    profile: img("/image/about/profile.jpg", "안윤정 법무사 프로필", 800, 1000),
    nameplate: img(
      "/image/about/명판.png",
      "안윤정 법무사 명판",
      800,
      600,
      false,
    ),
    policy: {
      barAssociationAward: img(
        "/image/about/policy/bar-association-award.jpg",
        "대한법무사협회 표창",
        800,
        600,
        false,
      ),
      youthBudgetAdvisory: img(
        "/image/about/policy/youth-budget-advisory.jpg",
        "기획예산처 청년자문단",
        800,
        600,
        false,
      ),
      busanYouthPolicy: img(
        "/image/about/policy/busan-youth-policy.jpg",
        "부산광역시 청년정책조정위원회",
        800,
        600,
        false,
      ),
      haewoondaePolicy: img(
        "/image/about/policy/haewoondae-policy.jpg",
        "해운대구 정책자문위원회",
        800,
        600,
        false,
      ),
      peaceUnification: img(
        "/image/about/policy/peace-unification.jpg",
        "민주평화통일자문회의",
        800,
        600,
        false,
      ),
      citizenJury: img(
        "/image/about/policy/citizen-jury.jpg",
        "부산시민배심원단",
        800,
        600,
        false,
      ),
    },
  },

  office: {
    exterior: img("/image/office/exterior.jpg", "다옴법무사사무소 전경", 1200, 800),
    nameplate: img("/image/office/nameplate.png", "다옴법무사사무소 명판", 800, 600),
    map: img("/image/office/map.png", "사무소 위치 지도", 1200, 900),
    direction01: img("/image/office/direction-01.png", "찾아오시는 길 안내 1", 1200, 900),
    direction02: img("/image/office/direction-02.png", "찾아오시는 길 안내 2", 1200, 900),
    parking: img("/image/office/parking.png", "주차 안내", 1200, 900),
    /** 사무소 페이지 상단 갤러리 — interior* 는 교체 전 목업 */
    gallery: [
      img("/image/photo/명패.png", "다옴법무사사무소 명패", 1200, 800),
      img("/image/office/명판가로.jpg", "다옴법무사사무소 명판", 800, 600),
      img("/image/office/office.jpg", "사무소", 1200, 900),
      img("/image/office/doc.jpg", "사무소", 1200, 900),
    ],
  },

  media: {
    community: img("/image/media/community.jpg", "기업·지역사회 활동", 1200, 800),
    policy: img("/image/media/policy.png", "정책·표창 활동", 1200, 800),
    education: img("/image/media/education.png", "법률 강의 활동", 1200, 800),
    gallery: [
      img("/image/media/gallery-01.jpg", "활동 사진 1", 1200, 800),
      img("/image/media/gallery-02.jpg", "활동 사진 2", 1200, 800),
    ],
  },

  services: {
    cover: img("/image/services/cover.jpg", "업무안내", 1400, 600),
  },

  blog: {
    cover: img("/image/blog/cover.jpg", "법률 정보 블로그", 1400, 600),
    defaultThumb: img("/image/blog/default-thumb.jpg", "블로그 썸네일", 800, 500),
  },

  cases: {
    cover: img("/image/cases/cover.jpg", "업무 사례", 1400, 600),
    defaultThumb: img("/image/cases/default-thumb.jpg", "사례 썸네일", 800, 500),
  },

  contact: {
    top: img("/image/contact/상담_top.jpg", "상담 안내", 1400, 600, false),
    phoneConsult: img("/image/contact/전화상담.png", "전화 상담", 800, 600, false),
    inPersonConsult: img("/image/contact/대면상담.png", "대면 상담", 800, 600, false),
    onSiteConsult: img("/image/contact/출장상담.png", "출장 상담", 800, 600, false),
  },

  press: {
    busanIlbo260608: img(
      "/image/press/부산일보260608.jpg",
      "부산일보 — 부산지방법무사회 제64회 정기총회",
      1200,
      800,
      false,
    ),
    kukjeSinmun260603: img(
      "/image/press/국제신문260603.jpg",
      "국제신문 — 부산지방법무사회 정기총회",
      1200,
      800,
      false,
    ),
    beopryulSinmun260602: img(
      "/image/press/법률신문260602.png",
      "법률신문 — 부산지방법무사회 제64회 정기총회",
      1200,
      800,
      false,
    ),
    cover: img("/image/press/부산일보260608.jpg", "언론보도", 1400, 600, false),
  },

  location: {
    header: img("/image/location/지도.png", "오시는 길", 1400, 600),
  },

  faq: {
    cover: img("/image/faq/cover.jpg", "자주 묻는 질문", 1400, 600),
  },
} as const;

export function getServiceImage(slug: string): SiteImageAsset {
  if (SERVICE_SLUGS.includes(slug as ServiceSlug)) {
    return img(
      `/image/services/${slug}.jpg`,
      `${slug} 업무 안내`,
      1200,
      700,
    );
  }
  return siteImages.services.cover;
}

export function getBlogPostImage(slug: string): SiteImageAsset {
  return img(
    `/image/blog/posts/${slug}.jpg`,
    "블로그 글 썸네일",
    800,
    500,
  );
}

export function getCaseImage(slug: string): SiteImageAsset {
  return img(
    `/image/cases/items/${slug}.jpg`,
    "업무 사례 썸네일",
    800,
    500,
  );
}

/** @deprecated siteImages.media 사용 */
export const profileImages = {
  community: siteImages.media.community,
  policy: siteImages.media.policy,
  education: siteImages.media.education,
  work: siteImages.media.gallery[0],
  workAlt: siteImages.media.gallery[1],
} as const;

export const officeImages = {
  map: siteImages.office.map,
  location1: siteImages.office.direction01,
  location2: siteImages.office.direction02,
  parking: siteImages.office.parking,
} as const;
