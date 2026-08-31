import { getGlossaryPlainParagraphs as fromGuides } from "./guides";

/** @deprecated 본문은 guides.ts. 호환 export만 유지. */
export const GLOSSARY_PLAIN_EXPLANATIONS: Record<string, string[]> = {};

export function getGlossaryPlainParagraphs(slug: string, fallback: string): string[] {
  return fromGuides(slug, fallback);
}
