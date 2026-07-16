/**
 * 사이트 이미지 경로 레지스트리 (public/image/ 단일 폴더, 한글 파일명)
 *
 * 실제 사진 교체: public/image/ 아래 동일 파일명으로 덮어쓰기
 */

import {
  THUMBNAIL_IMAGE_PATHS,
  pickThumbnailImagePath,
} from "@/lib/thumbnail-images";

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

/** RSS·빌드 스크립트와 공유하는 평탄화 경로 */
export const imagePaths = {
  logo: "/image/로고.png",
  officeExterior: "/image/사무소-전경.jpg",
  homeTrust: "/image/홈-신뢰안내.png",
  officeNameplate: "/image/사무소-명판.png",
  officeNameplateHorizontal: "/image/사무소-명판가로.jpg",
  officeInterior: "/image/사무소-내부.jpg",
  officeDocuments: "/image/사무소-서류.jpg",
  officeLocationMap: "/image/사무소-위치지도.png",
  locationHeaderMap: "/image/오시는길-지도.png",
  officeDirectionStep1: "/image/사무소-찾아오는길1.png",
  officeDirectionStep2: "/image/사무소-찾아오는길2.png",
  officeParking: "/image/사무소-주차.png",
  officeNameBadge: "/image/사무소-명패.png",
  appointmentCertificate: "/image/위촉장.jpg",
  activityBarAssociationAward: "/image/활동-법무사협회표창.jpg",
  activityYouthBudgetAdvisory: "/image/활동-청년예산자문단.jpg",
  activityBusanYouthPolicy: "/image/활동-부산청년정책위원.jpg",
  activityHaeundaePolicy: "/image/활동-해운대정책자문.jpg",
  activityPeaceUnification: "/image/활동-민주평통자문.jpg",
  activityCitizenJury: "/image/활동-시민배심원단.jpg",
  activityMou: "/image/활동-명례일반산업단지MOU.png",
  activityLhCollab: "/image/활동-LH부산창경협업.png",
  activityYouthSpace: "/image/활동-해운대청년채움공간강의.jpg",
  activityNagasaki: "/image/활동-나가사키사법서사회.jpg",
  contactConsultationHero: "/image/상담-메인.jpg",
  contactPhoneConsult: "/image/상담-전화.png",
  contactInPersonConsult: "/image/상담-대면.png",
  contactOnSiteConsult: "/image/상담-출장.png",
  pressBusanIlbo20260608: "/image/언론-부산일보-260608.jpg",
  pressKukjeSinmun20260603: "/image/언론-국제신문-260603.jpg",
  pressBeopryulSinmun20260602: "/image/언론-법률신문-260602.png",
  stockLegalDocuments: "/image/썸네일-서류등기.jpg",
  stockLegalConsultation: "/image/썸네일-상담협의.jpg",
  stockLegalContract: "/image/썸네일-계약임원.jpg",
  stockLegalOffice: "/image/썸네일-사무실.jpg",
  stockLegalCourthouse: "/image/썸네일-법원절차.jpg",
  thumbMajorBook: "/image/썸네일-전공책.jpg",
  thumbNotaryBook: "/image/썸네일-법무사책.png",
  thumbCivilLitigationBook: "/image/썸네일-민사소송책.png",
  thumbObject: "/image/썸네일-오브제.jpg",
  thumbDocumentReview: "/image/썸네일-서류확인.jpg",
  thumbEastDistrictCourt: "/image/썸네일-동부지원.jpg",
  thumbRegistryOffice: "/image/썸네일-등기소.jpg",
  thumbDongnaeDistrict: "/image/썸네일-동래구청.jpg",
  thumbSuyeongDistrict: "/image/썸네일-수영구청.jpg",
  thumbEastDistrictCourt2: "/image/썸네일-동부지원2.jpg",
  thumbComputerWork: "/image/썸네일-컴퓨터.png",
  thumbDrafting: "/image/썸네일-작성중.png",
  thumbPortraitBelow: "/image/썸네일-아래.jpg",
  thumbPortraitFront: "/image/썸네일-정면.jpg",
  lectureBusanSelfSupportJeonse:
    "/image/강의-부산광역시자립지원전담기관전세사기예방.jpg",
  lectureHousingContractGuide: "/image/강의-주거계약실전가이드.jpg",
  lectureYangsanHighSchool: "/image/강의-양산제일고.jpg",
  lectureFourWeekComplete: "/image/강의-4주완성.png",
  lectureMoneyPropertyDispute: "/image/강의-돈부동산관계분쟁미리막는방법.jpg",
  lectureHaeundaeSuyeongDongnae:
    "/image/강의-해운대수영동래청년전세계약등기부등본.jpg",
  lectureJeonseLegalEducation: "/image/강의-전세사기피하는법률교육특강.jpg",
  lectureYouthMostSoughtJeonse: "/image/강의-부산전세사기청년들이가장많이찾은.jpg",
  lectureYouthJeonsePrevention: "/image/강의-부산법무사의청년전세사기예방특강.jpg",
  lectureOnlineSurvival: "/image/강의-온라인세상에서살아남기.jpg",
  lectureJeonseVaccination: "/image/강의-청년전세사기예방접종.jpg",
  lectureMistakeCrime: "/image/강의-실수로범죄가되는순간들.jpg",
  lectureLawEssential: "/image/강의-법없이도살수없어요.jpg",
  lectureCitizenLibraryWeek1: "/image/강의-시민도서관1주차.jpg",
  lectureCitizenLibraryWeek2: "/image/강의-시민도서관2주차.jpg",
  lectureCitizenLibraryWeek3: "/image/강의-시민도서관3주차.jpg",
  lectureCitizenLibraryWeek4: "/image/강의-시민도서관4주차.jpg",
  lectureChangwonYouthVision: "/image/강의-창원청년비전센터.jpg",
} as const;

const STOCK = imagePaths;

const serviceImageBySlug: Record<ServiceSlug, string> = {
  "inheritance-registration": THUMBNAIL_IMAGE_PATHS[0],
  "inheritance-renunciation": THUMBNAIL_IMAGE_PATHS[1],
  "qualified-acceptance": THUMBNAIL_IMAGE_PATHS[2],
  "real-estate-registration": THUMBNAIL_IMAGE_PATHS[5],
  "ownership-transfer": THUMBNAIL_IMAGE_PATHS[4],
  "corporate-registration": THUMBNAIL_IMAGE_PATHS[7],
  "company-establishment": THUMBNAIL_IMAGE_PATHS[6],
  "director-change": THUMBNAIL_IMAGE_PATHS[9],
  "personal-rehabilitation": THUMBNAIL_IMAGE_PATHS[12],
  bankruptcy: THUMBNAIL_IMAGE_PATHS[10],
};

const caseImageBySlug: Record<string, string> = {
  "gijang-land-inheritance-case": STOCK.thumbRegistryOffice,
  "haeundae-inheritance-registration-case": STOCK.stockLegalDocuments,
  "jaesong-inheritance-renunciation-consultation":
    STOCK.thumbCivilLitigationBook,
  "dongnae-qualified-acceptance-consultation": STOCK.thumbDocumentReview,
  "centum-ownership-transfer-case": STOCK.thumbObject,
  "suyeong-company-establishment-case": STOCK.thumbMajorBook,
  "yeonje-director-change-case": STOCK.stockLegalContract,
  "busan-personal-rehabilitation-consultation": STOCK.thumbEastDistrictCourt,
};

const stockShowcaseImages = [
  STOCK.stockLegalDocuments,
  STOCK.stockLegalConsultation,
  STOCK.stockLegalContract,
  STOCK.stockLegalOffice,
  STOCK.stockLegalCourthouse,
] as const;

export const siteFavicon = imagePaths.logo;

export const siteImages = {
  logo: img(imagePaths.logo, "다옴법무사사무소 로고", 400, 120, false),

  seo: {
    defaultOg: img(imagePaths.officeExterior, "다옴법무사사무소", 1200, 630, true),
  },

  home: {
    hero: img(imagePaths.officeExterior, "다옴법무사사무소 전경", 1200, 900),
    /** 홈 히어로 우측 세로 슬라이드 */
    heroSlides: [
      img(imagePaths.officeNameBadge, "다옴법무사사무소 명패", 1200, 600),
      img(imagePaths.homeTrust, "안윤정 법무사 상담", 1000, 800),
      img(imagePaths.appointmentCertificate, "위원 위촉장", 1200, 800),
      img(imagePaths.officeExterior, "다옴법무사사무소 전경", 1200, 800),
    ],
    trust: img(imagePaths.homeTrust, "안윤정 법무사 상담", 1000, 800),
    activities: [
      img(imagePaths.activityMou, "기업 MOU 법률지원", 800, 600),
      img(imagePaths.activityLhCollab, "공공기관 협업", 800, 600),
      img(imagePaths.activityYouthSpace, "청년 법률 지원", 800, 600),
      img(imagePaths.activityBarAssociationAward, "협회장 표창", 800, 600),
      img(imagePaths.activityBusanYouthPolicy, "정책 자문 활동", 800, 600),
      img(imagePaths.activityNagasaki, "국제 법무 교류", 800, 600),
      img(imagePaths.activityPeaceUnification, "법률 강의", 800, 600),
    ],
    press: stockShowcaseImages.map((src, index) =>
      img(src, `언론 보도 ${index + 1}`, 800, 600),
    ),
  },

  about: {
    profile: img(imagePaths.officeExterior, "안윤정 법무사 프로필", 800, 1000),
    /** 안윤정 법무사 대표 인물 사진 */
    portrait: img(imagePaths.thumbPortraitFront, "안윤정 법무사", 720, 960),
    nameplate: img(imagePaths.officeNameplate, "안윤정 법무사 명판", 800, 600, false),
    policy: {
      barAssociationAward: img(
        imagePaths.activityBarAssociationAward,
        "대한법무사협회 표창",
        800,
        600,
        false,
      ),
      youthBudgetAdvisory: img(
        imagePaths.activityYouthBudgetAdvisory,
        "기획예산처 청년자문단",
        800,
        600,
        false,
      ),
      busanYouthPolicy: img(
        imagePaths.activityBusanYouthPolicy,
        "부산광역시 청년정책조정위원회",
        800,
        600,
        false,
      ),
      haewoondaePolicy: img(
        imagePaths.activityHaeundaePolicy,
        "해운대구 정책자문위원회",
        800,
        600,
        false,
      ),
      peaceUnification: img(
        imagePaths.activityPeaceUnification,
        "민주평화통일자문회의",
        800,
        600,
        false,
      ),
      citizenJury: img(
        imagePaths.activityCitizenJury,
        "부산시민배심원단",
        800,
        600,
        false,
      ),
    },
  },

  office: {
    exterior: img(imagePaths.officeExterior, "다옴법무사사무소 전경", 1200, 800),
    nameplate: img(imagePaths.officeNameplate, "다옴법무사사무소 명판", 800, 600),
    map: img(imagePaths.officeLocationMap, "사무소 위치 지도", 1200, 900),
    direction01: img(
      imagePaths.officeDirectionStep1,
      "찾아오시는 길 안내 1",
      1200,
      900,
    ),
    direction02: img(
      imagePaths.officeDirectionStep2,
      "찾아오시는 길 안내 2",
      1200,
      900,
    ),
    parking: img(imagePaths.officeParking, "주차 안내", 1200, 900),
    gallery: [
      img(imagePaths.officeNameBadge, "다옴법무사사무소 명패", 1200, 800),
      img(imagePaths.officeNameplateHorizontal, "다옴법무사사무소 명판", 800, 600),
      img(imagePaths.officeInterior, "사무소", 1200, 900),
      img(imagePaths.officeDocuments, "사무소", 1200, 900),
    ],
  },

  media: {
    community: img(imagePaths.stockLegalOffice, "기업·지역사회 활동", 1200, 800),
    policy: img(imagePaths.officeNameBadge, "정책·표창 활동", 1200, 800),
    education: img(imagePaths.stockLegalConsultation, "법률 강의 활동", 1200, 800),
    gallery: [
      img(imagePaths.stockLegalContract, "활동 사진 1", 1200, 800),
      img(imagePaths.stockLegalCourthouse, "활동 사진 2", 1200, 800),
    ],
  },

  services: {
    cover: img(THUMBNAIL_IMAGE_PATHS[3], "업무안내", 1400, 600),
  },

  blog: {
    cover: img(THUMBNAIL_IMAGE_PATHS[6], "법률 정보 블로그", 1400, 600),
    defaultThumb: img(
      pickThumbnailImagePath("blog-default"),
      "블로그 썸네일",
      800,
      500,
    ),
  },

  cases: {
    cover: img(imagePaths.stockLegalContract, "업무 사례", 1400, 600),
    defaultThumb: img(imagePaths.thumbNotaryBook, "사례 썸네일", 800, 500),
  },

  contact: {
    top: img(imagePaths.contactConsultationHero, "상담 안내", 1400, 600, false),
    phoneConsult: img(imagePaths.contactPhoneConsult, "전화 상담", 800, 600, false),
    inPersonConsult: img(
      imagePaths.contactInPersonConsult,
      "대면 상담",
      800,
      600,
      false,
    ),
    onSiteConsult: img(imagePaths.contactOnSiteConsult, "출장 상담", 800, 600, false),
  },

  press: {
    busanIlbo260608: img(
      imagePaths.pressBusanIlbo20260608,
      "부산일보 — 부산지방법무사회 제64회 정기총회",
      1200,
      800,
      false,
    ),
    kukjeSinmun260603: img(
      imagePaths.pressKukjeSinmun20260603,
      "국제신문 — 부산지방법무사회 정기총회",
      1200,
      800,
      false,
    ),
    beopryulSinmun260602: img(
      imagePaths.pressBeopryulSinmun20260602,
      "법률신문 — 부산지방법무사회 제64회 정기총회",
      1200,
      800,
      false,
    ),
    cover: img(imagePaths.pressBusanIlbo20260608, "언론보도", 1400, 600, false),
  },

  location: {
    header: img(imagePaths.locationHeaderMap, "오시는 길", 1400, 600),
  },

  faq: {
    cover: img(imagePaths.stockLegalCourthouse, "자주 묻는 질문", 1400, 600),
  },
} as const;

export function getServiceImage(slug: string): SiteImageAsset {
  const src =
    serviceImageBySlug[slug as ServiceSlug] ?? pickThumbnailImagePath(slug);
  return img(src, `${slug} 업무 안내`, 1200, 700);
}

export function getBlogPostImage(slug: string): SiteImageAsset {
  const src = pickThumbnailImagePath(slug);
  return img(src, "블로그 글 썸네일", 800, 500);
}

export function getCaseImage(slug: string): SiteImageAsset {
  const src = caseImageBySlug[slug] ?? imagePaths.stockLegalOffice;
  return img(src, "업무 사례 썸네일", 800, 500);
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
