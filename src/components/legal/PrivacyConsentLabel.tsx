import Link from "next/link";
import { LEGAL_PATHS } from "@/lib/legal";

type PrivacyConsentLabelProps = {
  /** 동의 문구 앞부분(기본: 문의 확인과 연락을 위한) */
  lead?: string;
  /** 추가 안내(민감정보 등) */
  suffix?: string;
  linkClassName?: string;
};

/**
 * 문의 폼 공통 — 개인정보 수집·이용 동의 + 처리방침 링크
 */
export function PrivacyConsentLabel({
  lead = "문의 확인과 연락을 위한",
  suffix,
  linkClassName = "font-medium text-navy underline underline-offset-2 hover:text-navy/80",
}: PrivacyConsentLabelProps) {
  return (
    <span>
      {lead}{" "}
      <Link href={LEGAL_PATHS.privacy} className={linkClassName}>
        개인정보 수집·이용
      </Link>
      에 동의합니다.
      {suffix ? <> {suffix}</> : null}{" "}
      <Link href={LEGAL_PATHS.privacy} className={linkClassName}>
        개인정보처리방침
      </Link>
      을 확인하세요.
    </span>
  );
}
