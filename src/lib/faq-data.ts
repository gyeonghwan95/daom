import { getFaqItems } from "@/lib/content/loader";

export type FaqItem = {
  question: string;
  answer: string;
  slug: string;
  href: string;
};

export const faqs: FaqItem[] = getFaqItems();
