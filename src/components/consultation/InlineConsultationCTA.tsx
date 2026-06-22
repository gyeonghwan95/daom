import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { consultationCopy } from "@/lib/consultation";
import type { ConsultationChannel } from "@/lib/contact";
import { getDirectConsultationChannels } from "@/lib/contact";

type InlineConsultationCTAProps = {
  channels?: ConsultationChannel[];
  description?: string;
  title?: string;
};

export function InlineConsultationCTA({
  channels = getDirectConsultationChannels(),
  description = consultationCopy.inline,
  title = "지금 상담이 필요하신가요?",
}: InlineConsultationCTAProps) {

  return (
    <aside
      className="rounded-2xl border border-navy/10 bg-gradient-to-br from-beige to-cream p-5 md:p-6"
      aria-label="상담 안내"
    >
      <h2 className="text-base font-semibold text-navy md:text-lg">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-navy/75 md:text-base">
        {description}
      </p>
      <div className="mt-4">
        <ConsultationButtons channels={channels} theme="light" layout="grid" />
      </div>
    </aside>
  );
}
