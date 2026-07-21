import { ProseParagraphs } from "@/components/readability/ProseParagraphs";

type DiagnosisSeoProseProps = {
  paragraphs: string[];
};

export function DiagnosisSeoProse({ paragraphs }: DiagnosisSeoProseProps) {
  return <ProseParagraphs paragraphs={paragraphs} />;
}
