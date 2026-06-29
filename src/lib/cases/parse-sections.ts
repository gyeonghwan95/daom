import type { CaseSections } from "./types";

const SECTION_ALIASES: Record<keyof CaseSections, string[]> = {
  background: ["사건 개요", "사건 배경"],
  concerns: ["의뢰인의 고민", "의뢰인이 처음 걱정한 점"],
  issues: ["쟁점"],
  documents: ["준비 서류", "준비서류"],
  procedures: ["진행 절차"],
  outcome: ["결과"],
  cautions: [
    "비슷한 상황에서 주의할 점",
    "안윤정 법무사의 실무 코멘트",
    "실무 코멘트",
  ],
};

function splitSectionBody(body: string): { text: string; items: string[] } {
  const lines = body
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items: string[] = [];
  const paragraphs: string[] = [];

  for (const line of lines) {
    const bullet = line.match(/^[-*•]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (bullet) {
      items.push(bullet[1]!);
    } else if (ordered) {
      items.push(ordered[1]!);
    } else {
      paragraphs.push(line);
    }
  }

  return {
    text: paragraphs.join("\n\n"),
    items,
  };
}

function extractSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  const parts = body.split(/^##\s+/m).filter(Boolean);

  for (const part of parts) {
    const newline = part.indexOf("\n");
    if (newline === -1) continue;
    const title = part.slice(0, newline).trim();
    const content = part.slice(newline + 1).trim();
    if (title && content) {
      sections.set(title, content);
    }
  }

  return sections;
}

function pickSection(
  sections: Map<string, string>,
  aliases: string[],
): { text: string; items: string[] } {
  for (const alias of aliases) {
    const raw = sections.get(alias);
    if (raw) return splitSectionBody(raw);
  }
  return { text: "", items: [] };
}

export function parseCaseSections(body: string): CaseSections {
  const sections = extractSections(body);

  const background = pickSection(sections, SECTION_ALIASES.background);
  const concerns = pickSection(sections, SECTION_ALIASES.concerns);
  const issues = pickSection(sections, SECTION_ALIASES.issues);
  const documents = pickSection(sections, SECTION_ALIASES.documents);
  const procedures = pickSection(sections, SECTION_ALIASES.procedures);
  const outcome = pickSection(sections, SECTION_ALIASES.outcome);
  const cautions = pickSection(sections, SECTION_ALIASES.cautions);

  return {
    background: background.text,
    concerns: concerns.items.length > 0 ? concerns.items : concerns.text ? [concerns.text] : [],
    issues: issues.items.length > 0 ? issues.items : issues.text ? [issues.text] : [],
    documents:
      documents.items.length > 0 ? documents.items : documents.text ? [documents.text] : [],
    procedures:
      procedures.items.length > 0
        ? procedures.items
        : procedures.text
          ? [procedures.text]
          : [],
    outcome: outcome.text || outcome.items.join("\n"),
    cautions:
      cautions.items.length > 0
        ? cautions.items
        : cautions.text
          ? cautions.text
              .split(/\n\n+/)
              .map((p) => p.trim())
              .filter(Boolean)
          : [],
  };
}
