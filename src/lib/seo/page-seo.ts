import { seoBrand } from "@/lib/seo/brand";
import { buildSeoTitle } from "@/lib/seo/metadata";

export const staticPageSeo = {
  about: {
    title: buildSeoTitle("안윤정 법무사 소개"),
    description:
      "다옴법무사사무소 안윤정 법무사 프로필. 법무사·공인중개사·신용관리사·직업상담사, 교사 자격, 부산대 행정대학원 재학, 대한법무사협회 표창, 기획예산처·부산시·해운대구·민주평통 자문, 시민도서관·청년기관 법률 강의.",
    path: "/about",
    keywords: ["안윤정 법무사", "해운대 법무사", seoBrand.siteName],
  },
  office: {
    title: buildSeoTitle("해운대·센텀 법무사 사무소"),
    description:
      "부산 해운대구 센텀 다옴법무사사무소. 주소·운영시간·주차·상담 방식과 방문 전 준비사항을 안내합니다. 안윤정 법무사가 직접 상담하며, 예약 후 방문해 주세요.",
    path: "/office",
    keywords: ["해운대 법무사", "센텀 법무사", seoBrand.siteName],
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
    title: buildSeoTitle("사례 탐색기 — 부산 법무사 실무 사례"),
    description:
      "상속·부동산등기·법인등기·전세보증금·민사서류·회생파산 등 업무별 사례를 카테고리·상황·지역으로 찾아볼 수 있습니다.",
    path: "/cases",
    keywords: ["부산 상속등기", "부산 부동산등기", "해운대 법무사", "부산 법무사 사례"],
  },
  blog: {
    title: buildSeoTitle("다옴법무사사무소 네이버 블로그 안내"),
    description:
      "다옴법무사사무소 공식 네이버 블로그 안내 페이지입니다. 최신 법률정보와 상담 사례는 네이버 블로그에서 확인하실 수 있습니다.",
    path: "/blog",
    keywords: ["다옴법무사사무소", "부산 법무사", seoBrand.siteName],
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
  notices: {
    title: buildSeoTitle("공지사항"),
    description:
      "다옴법무사사무소 운영 공지, 휴무·일정 변경 등 안내사항을 확인하실 수 있습니다.",
    path: "/공지사항",
    keywords: ["다옴법무사사무소", "공지사항", seoBrand.siteName],
  },
  media: {
    title: buildSeoTitle("언론·활동"),
    description:
      "언론 보도, 법률 강의, 기업·공공기관 협력, 정책 자문 등 대외 활동 기록.",
    path: "/media",
    keywords: ["안윤정 법무사", "부산 법무사", "부산 법률 강의", "언론보도", seoBrand.siteName],
  },
  contact: {
    title: buildSeoTitle("상담 문의 · 해운대·센텀"),
    description:
      "전화·카카오톡·네이버 톡톡 상담 안내. 방문 예약 후 센텀 사무소에서 직접 상담 가능.",
    path: "/contact",
    keywords: ["해운대 법무사", "센텀 법무사", "상담 문의", seoBrand.siteName],
  },
  location: {
    title: buildSeoTitle("오시는 길 · 센텀"),
    description:
      "부산 해운대구 센텀동로 200 D동 1층 위치, 센텀시티역·주차·건물 안내, 네이버 예약 링크.",
    path: "/location",
    keywords: ["해운대 법무사", "센텀 법무사", "오시는 길", seoBrand.siteName],
  },
  privacy: {
    title: buildSeoTitle("개인정보처리방침"),
    description:
      "다옴법무사사무소 개인정보처리방침. 문의·상담 시 수집 항목, 이용 목적, 보유 기간, 제3자 제공, 파기, 정보주체 권리를 안내합니다.",
    path: "/개인정보처리방침",
    keywords: ["개인정보처리방침", "부산 법무사", seoBrand.siteName],
  },
  terms: {
    title: buildSeoTitle("이용약관"),
    description:
      "다옴법무사사무소 웹사이트 이용약관. 법률정보 일반 안내의 범위, 상담 한계, 지적재산권, 책임의 제한을 안내합니다.",
    path: "/이용약관",
    keywords: ["이용약관", "부산 법무사", seoBrand.siteName],
  },
  searchGuides: {
    title: buildSeoTitle("상황별 안내 — 추천·비용·서류·기한"),
    description:
      "부산 법무사 추천·비용·후기, 등기 복대리·집단등기, 개인회생, 공공기관·보존등기처럼 상담 전에 자주 묻는 주제를 모았습니다.",
    path: "/search-guides",
    keywords: [
      "부산 법무사 추천",
      "부산 법무사 비용",
      "등기 복대리",
      "집단등기",
      "부산 개인회생",
      seoBrand.siteName,
    ],
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
