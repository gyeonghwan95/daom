import { seoBrand } from "@/lib/seo/brand";
import { buildSeoTitle } from "@/lib/seo/metadata";

export const staticPageSeo = {
  about: {
    title: buildSeoTitle("부산 법무사 소개"),
    description:
      "다옴법무사사무소 안윤정 법무사 프로필. 법무사·공인중개사·신용관리사 자격, 대한법무사협회 표창, 청년정책 자문, 부산 시민도서관·자립지원전담기관 법률 강의.",
    path: "/about",
    keywords: ["부산 법무사", "부산법무사", "안윤정 법무사", seoBrand.siteName],
  },
  office: {
    title: buildSeoTitle("해운대·센텀 법무사 사무소"),
    description:
      "센텀시티역 도보 5분, 해운대구 센텀동로 200 법무사 사무소 내부·주차·상담 공간 안내. 방문 상담 예약 필수.",
    path: "/office",
    keywords: ["해운대 법무사", "부산 법무사", "센텀 법무사", seoBrand.siteName],
  },
  services: {
    title: buildSeoTitle("부산 등기·상속·회생 업무안내"),
    description:
      "상속등기·상속포기·한정승인, 부동산등기, 법인설립·임원변경등기, 개인회생·파산 업무별 절차·수임 범위·실무 사례 안내.",
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
    description:
      "해운대·센텀·연제·동래 등 부산 지역 상속등기, 부동산등기, 법인등기, 한정승인 사건 유형별 처리 과정 소개.",
    path: "/services#cases",
    keywords: ["부산 상속등기", "부산 부동산등기", "해운대 법무사"],
  },
  blog: {
    title: buildSeoTitle("부산 법률 정보 포스팅"),
    description:
      "상속·부동산·법인·회생 관련 법률 칼럼과 네이버 블로그 최신 글 요약. 부산 지역 실무 기준으로 정리합니다.",
    path: "/blog",
    keywords: ["부산 상속등기", "부산 법인등기", "부산 개인회생", "부산 법무사"],
  },
  reviews: {
    title: buildSeoTitle("고객후기"),
    description:
      "네이버 플레이스 방문자가 남긴 상속등기·부동산등기·법인등기·상담 후기.",
    path: "/reviews",
    keywords: ["부산 법무사", "해운대 법무사", "고객후기", seoBrand.siteName],
  },
  faq: {
    title: buildSeoTitle("부산 법무사 FAQ"),
    description:
      "상속등기, 부동산등기, 법인등기, 개인회생·파산 등 법무사 업무 관련 자주 묻는 질문과 답변.",
    path: "/faq",
    keywords: ["부산 법무사", "부산 상속등기", "부산 개인회생", seoBrand.siteName],
  },
  media: {
    title: buildSeoTitle("언론·활동"),
    description:
      "언론 보도, 법률 강의, 기업·공공기관 협력, 정책 자문 등 대외 활동 기록.",
    path: "/media",
    keywords: ["안윤정 법무사", "부산 법무사", "부산 법률 강의", "언론보도", seoBrand.siteName],
  },
  contact: {
    title: buildSeoTitle("부산 법무사 상담 문의"),
    description:
      "전화·카카오톡·네이버 톡톡 상담 안내. 방문 예약 후 센텀 사무소에서 직접 상담 가능.",
    path: "/contact",
    keywords: ["부산 법무사", "해운대 법무사", "센텀 법무사", seoBrand.siteName],
  },
  location: {
    title: buildSeoTitle("오시는 길 · 센텀"),
    description:
      "부산 해운대구 센텀동로 200 D동 1층 위치, 센텀시티역·주차·건물 안내, 네이버 예약 링크.",
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
