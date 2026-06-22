import Link from "next/link";
import { getNapInfo } from "@/lib/business-info";
import { NapInfoBlock } from "@/components/layout/NapInfoBlock";

export function FooterBusinessInfo() {
  const nap = getNapInfo();

  return (
    <div className="mt-10 border-t border-white/15 pt-8">
      <p className="text-sm font-semibold text-beige">사업자 · 연락처 정보 (NAP)</p>
      <NapInfoBlock variant="footer" showBusinessRegistration />
      <p className="mt-4 text-xs leading-relaxed text-white/50">
        <a
          href={nap.naverPlaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/65 hover:text-white"
        >
          네이버 플레이스
        </a>
        {" · "}
        {nap.legalNotice}
      </p>
    </div>
  );
}
