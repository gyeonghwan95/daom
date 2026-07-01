type StepTimelineProps = {
  steps: string[];
};

export function StepTimeline({ steps }: StepTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <ol className="readability-timeline">
      {steps.map((step, index) => (
        <li key={step} className="readability-timeline__step">
          <span className="readability-timeline__number" aria-hidden>
            {index + 1}
          </span>
          <p className="readability-timeline__text">{step}</p>
        </li>
      ))}
    </ol>
  );
}
