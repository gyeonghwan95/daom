"use client";

import type { DiagnosisQuestion as DiagnosisQuestionData } from "@/data/diagnosis";

type DiagnosisQuestionProps = {
  question: DiagnosisQuestionData;
  stepIndex: number;
  value: string | string[] | undefined;
  onSingleChange: (value: string) => void;
  onMultipleToggle: (value: string) => void;
  validationError?: string;
};

export function DiagnosisQuestion({
  question,
  stepIndex,
  value,
  onSingleChange,
  onMultipleToggle,
  validationError,
}: DiagnosisQuestionProps) {
  const inputId = `diagnosis-q-${question.id}`;
  const descriptionId = question.description ? `${inputId}-desc` : undefined;
  const errorId = validationError ? `${inputId}-error` : undefined;

  return (
    <fieldset
      className="min-w-0 border-0 p-0"
      aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined}
    >
      <legend className="sr-only">{question.question}</legend>

      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-navy-light">
        Question {stepIndex + 1}
      </p>
      <h3
        id={`${inputId}-label`}
        className="mt-2 text-xl font-semibold leading-snug text-navy sm:text-2xl"
      >
        {question.question}
        {question.required ? (
          <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wide text-navy/45">
            필수
          </span>
        ) : null}
      </h3>
      {question.description ? (
        <p id={descriptionId} className="mt-3 text-sm leading-relaxed text-navy/60 sm:text-base">
          {question.description}
        </p>
      ) : null}

      <div className="mt-6">
        {question.type === "single" && question.options ? (
          <ul className="space-y-2.5" role="radiogroup" aria-labelledby={`${inputId}-label`}>
            {question.options.map((option) => {
              const selected = value === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onSingleChange(option.value)}
                    className={`diagnosis-option ${selected ? "diagnosis-option--selected" : ""}`}
                  >
                    <span
                      className={`diagnosis-option__marker diagnosis-option__marker--radio ${
                        selected ? "diagnosis-option__marker--on" : ""
                      }`}
                      aria-hidden
                    >
                      {selected ? (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      ) : null}
                    </span>
                    <span className="diagnosis-option__label">{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {question.type === "multiple" && question.options ? (
          <ul className="space-y-2.5" aria-labelledby={`${inputId}-label`}>
            {question.options.map((option) => {
              const selected =
                Array.isArray(value) && value.includes(option.value);
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onMultipleToggle(option.value)}
                    className={`diagnosis-option ${selected ? "diagnosis-option--selected" : ""}`}
                  >
                    <span
                      className={`diagnosis-option__marker diagnosis-option__marker--check ${
                        selected ? "diagnosis-option__marker--on" : ""
                      }`}
                      aria-hidden
                    >
                      {selected ? "✓" : ""}
                    </span>
                    <span className="diagnosis-option__label">{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}

        {question.type === "date" ? (
          <input
            id={inputId}
            type="date"
            aria-labelledby={`${inputId}-label`}
            aria-invalid={Boolean(validationError)}
            aria-describedby={errorId}
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onSingleChange(event.target.value)}
            className="diagnosis-wizard__input"
          />
        ) : null}

        {question.type === "number" ? (
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            aria-labelledby={`${inputId}-label`}
            aria-invalid={Boolean(validationError)}
            aria-describedby={errorId}
            placeholder="숫자만 입력 (개인정보 불필요)"
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onSingleChange(event.target.value)}
            className="diagnosis-wizard__input"
          />
        ) : null}

        {question.type === "text" ? (
          <textarea
            id={inputId}
            rows={4}
            aria-labelledby={`${inputId}-label`}
            aria-invalid={Boolean(validationError)}
            aria-describedby={errorId}
            placeholder="간단히 입력해 주세요 (선택)"
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onSingleChange(event.target.value)}
            className="diagnosis-wizard__input diagnosis-wizard__input--textarea"
          />
        ) : null}
      </div>

      {validationError ? (
        <p id={errorId} className="mt-4 text-sm font-medium text-red-800" role="alert">
          {validationError}
        </p>
      ) : null}
    </fieldset>
  );
}
