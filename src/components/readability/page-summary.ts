import type { PageData } from "@/lib/pageData/types";

/** PageData에서 핵심 요약 bullet 3~5개 생성 (SEO 텍스트 유지) */
export function buildPageSummaryBullets(page: PageData): string[] {
  const bullets: string[] = [];

  for (const paragraph of page.introParagraphs) {
    if (bullets.length >= 2) break;
    const trimmed = paragraph.trim();
    if (trimmed.length > 0) {
      bullets.push(trimmed.length > 120 ? `${trimmed.slice(0, 117)}…` : trimmed);
    }
  }

  if (page.procedures[0] && bullets.length < 5) {
    bullets.push(`진행 절차: ${page.procedures[0]}`);
  }

  if (page.documents[0] && bullets.length < 5) {
    const docPreview =
      page.documents.length > 1
        ? `${page.documents[0]} 외 ${page.documents.length - 1}건`
        : page.documents[0];
    bullets.push(`준비 서류: ${docPreview}`);
  }

  if (page.consultationPoints[0] && bullets.length < 5) {
    bullets.push(page.consultationPoints[0]);
  }

  if (bullets.length < 3 && page.intro.trim()) {
    bullets.unshift(page.intro.trim());
  }

  return bullets.slice(0, 5);
}

export function buildPageTocItems(
  page: PageData,
  options?: { hasDetailContent?: boolean },
): { id: string; label: string }[] {
  const items: { id: string; label: string }[] = [];

  if (page.procedures.length > 0) {
    items.push({ id: "procedures", label: "핵심 절차" });
  }
  if (page.documents.length > 0) {
    items.push({ id: "documents", label: "필요 서류" });
  }
  if (page.consultationPoints.length > 0) {
    items.push({ id: "consultation-points", label: "상담 포인트" });
  }
  items.push({ id: "consultation-example", label: "상담 상황 예시" });

  for (const [index, section] of page.sections.entries()) {
    items.push({ id: `section-${index}`, label: section.title });
  }

  if (options?.hasDetailContent) {
    items.push({ id: "detail-content", label: "상세 안내" });
  }

  if (page.faqs.length > 0) {
    items.push({ id: "faq", label: "자주 묻는 질문" });
  }

  items.push({ id: "related", label: "관련 페이지" });
  items.push({ id: "consultation", label: "상담 문의" });

  return items;
}
