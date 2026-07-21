import { GLOSSARY_PLAIN_EXPLANATIONS } from "./plain-explanations";

const NATIONWIDE_PATTERN = /전국|지역에 관계없|지역과 관계없|어디서든/;

/** 법률용어 — 전국 수임·비용 문의 안내 표시 여부 */
export function isGlossaryNationwideTerm(slug: string): boolean {
  const paragraphs = GLOSSARY_PLAIN_EXPLANATIONS[slug];
  if (!paragraphs) return false;
  return NATIONWIDE_PATTERN.test(paragraphs.join(""));
}
