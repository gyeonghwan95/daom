type DiagnosisProgressProps = {
  step: number;
  total: number;
  finished: boolean;
};

export function DiagnosisProgress({ step, total, finished }: DiagnosisProgressProps) {
  const currentStep = finished ? total : step + 1;
  const percent = total > 0 ? Math.round(((finished ? total : step + 1) / total) * 100) : 0;

  return (
    <div className="diagnosis-wizard__progress border-b border-navy/8 bg-gradient-to-r from-beige/70 via-cream to-beige/40 px-4 py-5 sm:px-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-navy-light">
            Self Check
          </p>
          <p className="mt-1 text-sm font-semibold text-navy" id="diagnosis-progress-label">
            {finished ? "진단 결과" : `질문 ${Math.min(currentStep, total)} / ${total}`}
          </p>
        </div>
        <span className="text-sm font-semibold tabular-nums text-navy/55" aria-hidden>
          {percent}%
        </span>
      </div>

      <div
        className="diagnosis-wizard__progress-track mt-4"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-labelledby="diagnosis-progress-label"
      >
        <div
          className="diagnosis-wizard__progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      {total > 1 && !finished ? (
        <ol className="mt-4 flex gap-1.5" aria-hidden>
          {Array.from({ length: total }, (_, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <li
                key={index}
                className={`diagnosis-wizard__step-dot ${
                  done
                    ? "diagnosis-wizard__step-dot--done"
                    : active
                      ? "diagnosis-wizard__step-dot--active"
                      : ""
                }`}
              />
            );
          })}
        </ol>
      ) : null}
    </div>
  );
}
