import type { Metadata } from "next";

/** Google Search Console, Naver Search Advisor 등 — .env.local에 코드 설정 */
export function getSiteVerificationMetadata(): Metadata["verification"] {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const naver = process.env.NAVER_SITE_VERIFICATION?.trim();

  if (!google && !naver) return undefined;

  return {
    ...(google ? { google } : {}),
    ...(naver
      ? {
          other: {
            "naver-site-verification": naver,
          },
        }
      : {}),
  };
}
