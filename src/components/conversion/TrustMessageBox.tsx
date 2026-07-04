import { ContentSection } from "@/components/readability";

type TrustMessageBoxProps = {
  message: string;
  relaxedIntro?: string;
};

export function TrustMessageBox({ message, relaxedIntro }: TrustMessageBoxProps) {
  return (
    <ContentSection id="conversion-trust" title="상담 안내">
      {relaxedIntro ? (
        <p className="body-text max-w-3xl text-navy/80">{relaxedIntro}</p>
      ) : null}
      <p
        className={`body-text max-w-3xl text-navy/85 ${relaxedIntro ? "mt-3" : ""}`}
      >
        {message}
      </p>
    </ContentSection>
  );
}
