"use client";

import { useState } from "react";
import { officeLocation } from "@/lib/office-location";

type CopyAddressButtonProps = {
  className?: string;
};

export function CopyAddressButton({ className = "" }: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(officeLocation.fullAddress);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex min-h-10 cursor-pointer items-center rounded-lg border border-navy/15 bg-white px-3 text-sm font-medium text-navy transition-colors hover:border-navy/30 hover:bg-beige/40 ${className}`}
    >
      {copied ? "주소 복사됨" : "주소 복사"}
    </button>
  );
}
