import { seoBrand } from "@/lib/seo/brand";
import { buildSeoTitle } from "@/lib/seo/metadata";

export const staticPageSeo = {
  about: {
    title: buildSeoTitle("부산 법무사 소개"),
    description: `${seoBrand.siteName} 대표 ${seoBrand.representative} 소개. 부산 해운대·센텀 상속등기·부동산등기·법인등기·개인회생 전문. 기업 MOU·공공기관 협업·정책 자문·법률 강의 활동.`,
    path: "/about",
    keywords: ["부산 법무사", "부산법무사", "안윤정 법무사", seoBrand.siteName],
  },
  office: {
    title: buildSeoTitle("해운대·센텀 법무사 사무소"),
    description: `부산 해운대구 센텀 ${seoBrand.siteName}. ${seoBrand.representative}가 상속·등기·회생 업무를 직접 상담하는 부산 법무사 사무소입니다.`,
    path: "/office",
    keywords: ["해운대 법무사", "부산 법무사", "센텀 법무사", seoBrand.siteName],
  },
  services: {
    title: buildSeoTitle("부산 등기·상속·회생 업무안내"),
    description: `${seoBrand.siteName} ${seoBrand.representative}의 업무 안내. 부산 상속등기, 상속포기, 한정승인, 부동산등기, 법인등기, 개인회생, 파산 등 법무사 업무와 실무 사례.`,
    path: "/services",
    keywords: [
      "부산 상속등기",
      "부산 부동산등기",
      "부산 법인등기",
      "부산 개인회생",
      "부산 법무사",
    ],
  },
  cases: {
    title: buildSeoTitle("부산 등기·상속 업무 사례"),
    description: `${seoBrand.siteName} ${seoBrand.representative}의 상속등기, 부동산등기, 법인등기, 한정승인 사례 유형을 소개합니다. 부산 해운대·센텀 지역 실무 경험.`,
    path: "/services#cases",
    keywords: ["부산 상속등기", "부산 부동산등기", "해운대 법무사"],
  },
  blog: {
    title: buildSeoTitle("부산 법률 정보 포스팅"),
    description: `${seoBrand.representative}가 정리하는 상속등기, 부동산등기, 법인등기, 개인회생·파산 법률 정보. ${seoBrand.siteName} 공식 포스팅과 네이버 블로그.`,
    path: "/blog",
    keywords: ["부산 상속등기", "부산 법인등기", "부산 개인회생", "부산 법무사"],
  },
  reviews: {
    title: buildSeoTitle("고객후기"),
    description: `${seoBrand.siteName} ${seoBrand.representative} 네이버 플레이스 방문자 리뷰. 부산 상속·등기·회생 법률 상담 실제 후기.`,
    path: "/reviews",
    keywords: ["부산 법무사", "해운대 법무사", "고객후기", seoBrand.siteName],
  },
  faq: {
    title: buildSeoTitle("부산 법무사 FAQ"),
    description: `상속등기, 부동산등기, 법인등기, 개인회생·파산 자주 묻는 질문. ${seoBrand.siteName} ${seoBrand.representative}가 답변합니다.`,
    path: "/faq",
    keywords: ["부산 법무사", "부산 상속등기", "부산 개인회생", seoBrand.siteName],
  },
  media: {
    title: buildSeoTitle("언론·활동"),
    description: `${seoBrand.representative}의 기업·공공기관 법률 지원, 정책 자문, 생활 법률 강의, 언론 보도 등 대외 활동. 대한법무사협회장 표창, 청년정책·해운대구 정책자문 참여.`,
    path: "/media",
    keywords: ["안윤정 법무사", "부산 법무사", "부산 법률 강의", "언론보도", seoBrand.siteName],
  },
  contact: {
    title: buildSeoTitle("부산 법무사 상담 문의"),
    description: `${seoBrand.siteName} ${seoBrand.representative} 상담 신청. 부산 상속등기, 부동산등기, 법인등기, 개인회생·파산 전화·카카오톡·네이버 톡톡 상담.`,
    path: "/contact",
    keywords: ["부산 법무사", "해운대 법무사", "센텀 법무사", seoBrand.siteName],
  },
  location: {
    title: buildSeoTitle("오시는 길 · 센텀"),
    description: `부산 해운대구 센텀동로 200 ${seoBrand.siteName} 위치 안내. 센텀시티역 도보 5분, 주차 가능. ${seoBrand.representative} 방문 상담 예약.`,
    path: "/location",
    keywords: ["해운대 법무사", "센텀 법무사", "부산 법무사", seoBrand.siteName],
  },
} as const;

export const serviceSeoMap: Record<
  string,
  { primaryKeyword: string; keywords: string[] }
> = {
  "inheritance-registration": {
    primaryKeyword: "부산 상속등기",
    keywords: ["부산 상속등기", "해운대 법무사", "부산 법무사", "상속등기"],
  },
  "inheritance-renunciation": {
    primaryKeyword: "부산 상속포기",
    keywords: ["부산 상속포기", "부산 법무사", "상속포기", seoBrand.siteName],
  },
  "qualified-acceptance": {
    primaryKeyword: "부산 한정승인",
    keywords: ["부산 한정승인", "부산 상속등기", "부산 법무사", "한정승인"],
  },
  "real-estate-registration": {
    primaryKeyword: "부산 부동산등기",
    keywords: ["부산 부동산등기", "해운대 법무사", "부산 법무사", "부동산등기"],
  },
  "ownership-transfer": {
    primaryKeyword: "부산 소유권이전등기",
    keywords: ["부산 부동산등기", "부산 법무사", "소유권이전등기", "해운대 법무사"],
  },
  "corporate-registration": {
    primaryKeyword: "부산 법인등기",
    keywords: ["부산 법인등기", "센텀 법무사", "부산 법무사", "법인등기"],
  },
  "company-establishment": {
    primaryKeyword: "부산 법인설립등기",
    keywords: ["부산 법인등기", "센텀 법무사", "법인설립", "부산 법무사"],
  },
  "director-change": {
    primaryKeyword: "부산 임원변경등기",
    keywords: ["부산 법인등기", "센텀 법무사", "임원변경등기", "부산 법무사"],
  },
  "personal-rehabilitation": {
    primaryKeyword: "부산 개인회생",
    keywords: ["부산 개인회생", "부산 법무사", "개인회생", seoBrand.representative],
  },
  bankruptcy: {
    primaryKeyword: "부산 파산",
    keywords: ["부산 파산", "부산 개인회생", "부산 법무사", "파산"],
  },
};
