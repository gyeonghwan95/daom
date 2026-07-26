/**
 * 사무소 프로필 — 적합도 점수에 반영되는 운영 현실.
 *
 * 개인정보·경력이 아닌 점수 계산용 설정만 담는다.
 * 지역·수행 가능 분야가 바뀌면 이 파일만 수정한다.
 */

export type OfficeProfile = {
  region: string;
  nearbyRegions: string[];
  teamSize: number;
  officeType: string;
  availableCategories: string[];
  remoteAvailable: boolean;
  collaborationAvailable: boolean;
  /** 1인 수행이 어려울 것으로 보는 추정금액 기준 (원) */
  largeContractThreshold: number;
};

export const OFFICE_PROFILE: OfficeProfile = {
  region: "부산",
  nearbyRegions: ["경남", "울산", "대구", "경북", "창원", "양산", "김해", "거제", "진주"],
  teamSize: 1,
  officeType: "법무사사무소",
  availableCategories: [
    "부동산등기",
    "법인등기",
    "상속등기",
    "회생파산서류",
    "민사신청서류",
    "법률강의",
    "복대리",
  ],
  remoteAvailable: true,
  collaborationAvailable: true,
  largeContractThreshold: 300_000_000,
};
