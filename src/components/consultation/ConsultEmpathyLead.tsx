"use client";

import { usePathname } from "next/navigation";
import { isLecturePagePath } from "@/data/seoExperiments/lecture-targets";
import { getConsultEmpathy } from "@/lib/consultation-empathy";

export function ConsultEmpathyLead() {
  const pathname = usePathname() ?? "/";
  const line = isLecturePagePath(pathname)
    ? "강의 주제와 날짜만 알려 주시면, 제가 가능 여부부터 회신합니다."
    : getConsultEmpathy(pathname).line;

  return <p className="readability-hero__empathy">{line}</p>;
}
