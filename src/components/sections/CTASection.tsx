import { ConsultationButtons } from "@/components/consultation/ConsultationButtons";
import { ConsultationFeeNotice } from "@/components/consultation/ConsultationFeeNotice";
import { consultationCopy } from "@/lib/consultation";
import type { ConsultationChannel } from "@/lib/contact";
import { getDirectConsultationChannels } from "@/lib/contact";

type CTASectionProps = {
  channels?: ConsultationChannel[];
  title?: string;
  description?: string;
};

export function CTASection({
  channels = getDirectConsultationChannels(),
  title = "상담 문의",
  description,
}: CTASectionProps) {

  return (
    <section className="card-surface bg-navy p-5 text-white sm:p-6 md:p-8 lg:p-10">
      <h2 className="text-lg font-semibold sm:text-xl md:text-2xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base md:text-lg">
        {description ?? consultationCopy.default}
      </p>
      <div className="mt-5 md:mt-6">
        <ConsultationButtons channels={channels} theme="dark" layout="grid" />
      </div>
      <ConsultationFeeNotice theme="dark" className="mt-4" />
    </section>
  );
}
