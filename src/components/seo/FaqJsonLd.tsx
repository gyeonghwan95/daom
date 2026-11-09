import { JsonLd } from "@/components/seo/JsonLd";
import { buildFaqPageSchema } from "@/lib/seo/json-ld";

type FaqJsonLdProps = {
  faqs: readonly { question: string; answer: string }[];
  path: string;
};

/**
 * 화면에 보이는 FAQ(FAQAccordion)와 같은 질문·답변을 FAQPage 구조화 데이터로 내보낸다.
 * 화면에 없는 질문은 넣지 않는다. 질문이 3개 미만이면 내보내지 않는다(템플릿 기본 문구만 있는 페이지 제외).
 */
export function FaqJsonLd({ faqs, path }: FaqJsonLdProps) {
  const items = faqs.filter((faq) => faq.question.trim() && faq.answer.trim());
  if (items.length < 3) return null;
  return <JsonLd data={buildFaqPageSchema(items.map((f) => ({ question: f.question, answer: f.answer })), path)} />;
}
