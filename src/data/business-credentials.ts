/**
 * 기업확인서(여성기업·중소기업·창업기업) 설정.
 *
 * 실제 확인서 원본에서 확인한 값만 입력한다.
 * 프로젝트에 검증된 문서가 없으면 verified/enabled를 false로 두고
 * 발급일·유효기간·발급기관을 추정하지 않는다.
 *
 * 공개 노출은 `src/lib/business-credentials`의 가시성 게이트를 통과한
 * 항목만 컴포넌트에서 렌더한다.
 */

export type BusinessCredentialId =
  | "women-owned-business"
  | "small-business"
  | "startup-business";

export type BusinessCredentialRecord = {
  id: BusinessCredentialId;
  shortLabel: string;
  officialName: string;
  /** 실제 문서에서 확인된 발급·확인기관. 미검증 시 빈 문자열 */
  issuer: string;
  /** YYYY-MM-DD. 미검증 시 null */
  issueDate: string | null;
  /** YYYY-MM-DD. 미검증 시 null */
  validUntil: string | null;
  /** 원본 문서·발급정보 대조 완료 여부 */
  verified: boolean;
  /** 사이트 공개 노출 스위치 (verified=true 이고 유효기간 내일 때만 실제 표시) */
  enabled: boolean;
  showExpiryPublicly: boolean;
  /** 마스킹된 공개용 이미지. 원본 PDF/이미지는 public에 두지 않음 */
  publicDocumentPath: string | null;
  description: string;
  /** 문서 미확인·갱신 필요 시 빌드 경고용 */
  verificationRequired: boolean;
};

/**
 * 현재 상태: 프로젝트 내 여성기업확인서·중소기업확인서·창업기업확인서
 * 원본/마스킹 파생본이 없어 공개 노출을 보류한다.
 * 실물 확인 후 verified·enabled·issuer·issueDate·validUntil만 갱신한다.
 */
export const businessCredentials: BusinessCredentialRecord[] = [
  {
    id: "women-owned-business",
    shortLabel: "여성기업",
    officialName: "여성기업확인서",
    issuer: "",
    issueDate: null,
    validUntil: null,
    verified: false,
    enabled: false,
    showExpiryPublicly: true,
    publicDocumentPath: null,
    description:
      "여성 대표자가 실질적으로 경영하는 기업임을 확인하는 공식 확인서",
    verificationRequired: true,
  },
  {
    id: "small-business",
    shortLabel: "중소기업",
    officialName: "중소기업확인서",
    issuer: "",
    issueDate: null,
    validUntil: null,
    verified: false,
    enabled: false,
    showExpiryPublicly: true,
    publicDocumentPath: null,
    description:
      "관계 법령상 중소기업 요건에 해당함을 확인하는 공식 확인서",
    verificationRequired: true,
  },
  {
    id: "startup-business",
    shortLabel: "창업기업",
    officialName: "창업기업확인서",
    issuer: "",
    issueDate: null,
    validUntil: null,
    verified: false,
    enabled: false,
    showExpiryPublicly: true,
    publicDocumentPath: null,
    description:
      "관계 법령상 창업기업 요건에 해당함을 확인하는 공식 확인서",
    verificationRequired: true,
  },
];
