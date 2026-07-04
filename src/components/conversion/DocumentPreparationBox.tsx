import { ChecklistBox, ContentSection } from "@/components/readability";

type DocumentPreparationBoxProps = {
  documents: string[];
  serviceName: string;
};

export function DocumentPreparationBox({
  documents,
  serviceName,
}: DocumentPreparationBoxProps) {
  return (
    <ContentSection
      id="conversion-documents"
      title="상담 전 준비하면 좋은 것"
    >
      <p className="body-text max-w-3xl text-navy/75">
        {serviceName} 상담 시 아래 서류가 있으면 검토가 수월합니다. 모두
        갖추지 못하셔도 괜찮습니다.
      </p>
      <div className="mt-4">
        <ChecklistBox
          items={documents}
          note="사건마다 추가 서류가 필요할 수 있습니다. 상담 중에 부족한 항목을 안내드립니다."
        />
      </div>
    </ContentSection>
  );
}
