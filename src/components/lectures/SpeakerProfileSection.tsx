import Link from "next/link";
import { PrintProfileButton } from "@/components/lectures/PrintProfileButton";
import {
  getLawyerAppointments,
  getLawyerAwards,
  getLawyerQualifications,
  lawyerExperience,
  lawyerProfileMeta,
} from "@/lib/lawyer-profile";

type SpeakerProfileSectionProps = {
  showPrint?: boolean;
  /** credentials: 자격·경력만 / full: 위촉까지 포함 */
  variant?: "credentials" | "full";
};

/** 강사 자격·경력 (이력·사진은 페이지에서 따로 배치) */
export function SpeakerProfileSection({
  showPrint = true,
  variant = "full",
}: SpeakerProfileSectionProps) {
  const qualifications = getLawyerQualifications();
  const awards = getLawyerAwards();
  const appointments = getLawyerAppointments().slice(0, 4);
  const experience =
    variant === "credentials"
      ? lawyerExperience.slice(0, 3)
      : lawyerExperience;

  return (
    <div className="lecture-print-profile space-y-5 rounded-2xl border border-navy/10 bg-cream/40 p-5 md:p-6">
      <div>
        <p className="text-sm text-navy/60">{lawyerProfileMeta.organization}</p>
        <h3 className="text-xl font-bold text-navy md:text-2xl">
          {lawyerProfileMeta.fullTitle}
        </h3>
        <p className="mt-1 text-sm text-navy/75">
          {lawyerProfileMeta.officeArea} · 생활법률·예방특강
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-navy">자격·학력</p>
          <ul className="mt-2 space-y-2">
            {qualifications.map((item) => (
              <li
                key={item.name}
                className="rounded-xl border border-beige-dark bg-white px-3 py-2.5"
              >
                <p className="text-sm font-medium text-navy">{item.name}</p>
                {item.detail ? (
                  <p className="mt-0.5 text-xs text-navy/65">{item.detail}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-navy">수상·표창</p>
          <ul className="mt-2 space-y-2">
            {awards.map((item) => (
              <li
                key={item.name}
                className="rounded-xl border border-beige-dark bg-white px-3 py-2.5"
              >
                <p className="text-sm font-medium text-navy">{item.name}</p>
                <p className="mt-0.5 text-xs text-navy/65">
                  {[item.detail, item.year].filter(Boolean).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
          {variant === "full" && appointments.length ? (
            <>
              <p className="mt-4 text-sm font-semibold text-navy">위촉·자문</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/75">
                {appointments.map((item) => (
                  <li key={item.title}>
                    {item.title}
                    {item.organization ? ` — ${item.organization}` : ""}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-navy">실무·활동 경력</p>
        <ol className="mt-3 space-y-2">
          {experience.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-beige-dark bg-white px-4 py-3"
            >
              <p className="text-xs font-medium text-navy/55">{item.period}</p>
              <p className="mt-0.5 text-sm font-semibold text-navy">
                {item.title}
              </p>
              {variant === "full" ? (
                <p className="mt-1 text-sm leading-relaxed text-navy/70">
                  {item.description}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {showPrint ? <PrintProfileButton /> : null}
        <Link
          href="/about"
          className="text-sm font-medium text-navy underline-offset-2 hover:underline"
        >
          법무사·사무소 소개
        </Link>
      </div>
    </div>
  );
}
