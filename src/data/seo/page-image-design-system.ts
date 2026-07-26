/**
 * 페이지 대표 이미지 디자인 시스템
 * — globals.css 브랜드 토큰에 맞춤. 별도 브랜드를 만들지 않음.
 */

import type { PageImageDesignSystem } from "@/data/seo/page-image-types";

export const pageImageDesignSystem: PageImageDesignSystem = {
  colors: {
    navy: "#1e3a5f",
    navyDark: "#0f1f33",
    navyLight: "#2d4f7c",
    cream: "#f7f4ef",
    beige: "#f0ebe3",
    surface: "#ffffff",
    textPrimary: "#152a45",
  },
  typography: {
    headline: "Bold sans, 최대 2줄, 12~16자 권장",
    subheadline: "Medium sans, 1줄, 15~20자 권장",
    brandMark: "작은 ‘다옴법무사사무소’ 표기 — 가장자리만",
  },
  canvas: {
    width: 1200,
    height: 800,
    safeAreaPercent: 20,
  },
  rules: [
    "기존 네이비·크림·베이지 팔레트만 사용",
    "제목만 바꾼 동일 템플릿 복제 금지",
    "로고·명함·지도·QR·전화 배너 단독 대표이미지 금지",
    "동일 인물사진 전 페이지 반복 금지",
    "가짜 법원서류·기관 로고·가짜 상담 장면 금지",
    "핵심 정보는 가장자리 15~20%에 두지 않음",
    "정사각 crop을 고려해 중앙 안전영역 확보",
    "광고성 CTA·전화번호 중앙 대형 표시 금지",
  ],
};
