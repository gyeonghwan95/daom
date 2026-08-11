import Link from "next/link";
import { getNapInfo } from "@/lib/business-info";
import { NapInfoBlock } from "@/components/layout/NapInfoBlock";
import { NaverSmartPlaceCta } from "@/components/cta/NaverSmartPlaceCta";
import { LEGAL_PATHS } from "@/lib/legal";

export function FooterBusinessInfo() {
  const nap = getNapInfo();

  return (
    <div className="mt-10 border-t border-white/15 pt-8">
      <p className="text-sm font-semibold text-beige">사업자 · 연락처 정보</p>
      <NapInfoBlock variant="footer" showBusinessRegistration />
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/70">
        <li>
          <Link
            href={LEGAL_PATHS.privacy}
            className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white"
          >
            개인정보처리방침
          </Link>
        </li>
        <li>
          <Link
            href={LEGAL_PATHS.terms}
            className="inline-flex min-h-10 items-center transition-colors duration-200 hover:text-white"
          >
            이용약관
          </Link>
        </li>
        <li>
          <NaverSmartPlaceCta
            variant="place"
            placement="footer"
            tone="text"
            size="sm"
            label="네이버 플레이스"
            className="inline-flex min-h-10 items-center text-white/70 transition-colors duration-200 hover:text-white"
          />
        </li>
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-white/50">{nap.legalNotice}</p>
    </div>
  );
}
