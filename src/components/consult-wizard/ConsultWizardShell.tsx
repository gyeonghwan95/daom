"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  isTurnstileConfigured,
  TurnstileWidget,
} from "@/components/quick-inquiry/TurnstileWidget";
import {
  useBodyScrollLock,
  useDialogIds,
  useFocusTrap,
} from "@/components/quick-inquiry/useDialogA11y";
import { useQuickInquiry } from "@/components/quick-inquiry/QuickInquiryProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { trackConsultEvent } from "@/lib/consult-wizard/analytics";
import {
  CONSULT_SITUATIONS,
  CONTACT_PREF_OPTIONS,
  CONTACT_TIME_OPTIONS,
  getDocsForSituations,
  type ConsultSituationId,
} from "@/lib/consult-wizard/catalog";
import { consultWizardCopy as copy } from "@/lib/consult-wizard/copy";
import {
  buildConsultMessage,
  buildConsultSummaryLines,
  type ConsultWizardDraft,
} from "@/lib/consult-wizard/message";
import {
  clearConsultDraft,
  createEmptyDraft,
  loadConsultDraft,
  saveConsultDraft,
} from "@/lib/consult-wizard/storage";
import {
  clientParseContact,
  submitQuickInquiry,
} from "@/lib/quick-inquiry/client";
import { HONEYPOT_FIELD } from "@/lib/quick-inquiry/shared";
import { PrivacyConsentLabel } from "@/components/legal/PrivacyConsentLabel";

type Phase = "form" | "success" | "review";

function toggleId<T extends string>(list: T[], id: T): T[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function stepTitle(step: number, phase: Phase): string {
  if (phase === "success") return copy.successTitle;
  if (phase === "review") return copy.step4Title;
  if (step === 1) return copy.step1Title;
  if (step === 2) return copy.step2Title;
  if (step === 3) return copy.step3Title;
  return copy.step4Title;
}

function stepDesc(step: number, phase: Phase): string | null {
  if (phase !== "form") return null;
  if (step === 1) return copy.step1Hint;
  if (step === 2) return copy.step2Hint;
  if (step === 3) return copy.step3Privacy;
  return "아래 내용이 맞는지 확인한 뒤 신청해 주세요.";
}

export function ConsultWizardShell() {
  const {
    open,
    closeInquiry,
    pageTitle,
    pageUrl,
    source,
    presetSituationIds,
  } = useQuickInquiry();
  const reducedMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const ids = useDialogIds("consult-wizard");
  const [phase, setPhase] = useState<Phase>("form");
  const [draft, setDraft] = useState<ConsultWizardDraft>(() =>
    createEmptyDraft(),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const resetKey = open
    ? `${pageTitle}\0${pageUrl}\0${presetSituationIds.join("\0")}`
    : "";
  const [appliedResetKey, setAppliedResetKey] = useState("");

  if (open && resetKey !== appliedResetKey) {
    const saved = loadConsultDraft();
    setAppliedResetKey(resetKey);
    setDraft(
      createEmptyDraft({
        ...(saved ?? {}),
        pageTitle,
        pageUrl,
        situationIds: saved?.situationIds?.length
          ? saved.situationIds
          : presetSituationIds,
        step: saved?.step ?? 1,
      }),
    );
    setPhase("form");
    setErrors({});
    setFormError("");
    setToken("");
    setHoneypot("");
    setResetSignal((n) => n + 1);
  } else if (!open && appliedResetKey !== "") {
    setAppliedResetKey("");
  }

  useFocusTrap(open, panelRef);
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("quick-inquiry-open");
    return () => document.body.classList.remove("quick-inquiry-open");
  }, [open]);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const sync = () => {
      const viewport = window.visualViewport;
      if (!viewport) {
        panel.style.setProperty("--qi-keyboard-inset", "0px");
        return;
      }
      const inset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      panel.style.setProperty("--qi-keyboard-inset", `${Math.round(inset)}px`);
    };
    sync();
    window.visualViewport?.addEventListener("resize", sync);
    window.visualViewport?.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    return () => {
      window.visualViewport?.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      panel.style.removeProperty("--qi-keyboard-inset");
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeInquiry();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeInquiry]);

  useEffect(() => {
    if (!open || phase !== "form") return;
    saveConsultDraft(draft);
  }, [draft, open, phase]);

  useEffect(() => {
    if (!open || !appliedResetKey || phase !== "form") return;
    trackConsultEvent({
      event: "consult_step",
      step: draft.step,
      source: source ?? "other",
      pagePath: (() => {
        try {
          return new URL(pageUrl).pathname;
        } catch {
          return "";
        }
      })(),
      situationIds: draft.situationIds,
    });
  }, [appliedResetKey, draft.step, open, phase, pageUrl, source, draft.situationIds]);

  const docs = useMemo(
    () => getDocsForSituations(draft.situationIds),
    [draft.situationIds],
  );

  const phone = getContactInfo().phone;
  const phoneHref = phone ? getPhoneHref(phone) : "tel:";
  const summary = useMemo(() => buildConsultSummaryLines(draft), [draft]);

  const update = (patch: Partial<ConsultWizardDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleTurnstileError = useCallback(() => {
    setErrors((prev) => ({
      ...prev,
      turnstile: "보안 확인을 불러오지 못했습니다.",
    }));
  }, []);

  const handleTurnstileToken = useCallback((nextToken: string) => {
    setToken(nextToken);
    if (!nextToken) return;
    setErrors((prev) => {
      if (!prev.turnstile) return prev;
      const rest = { ...prev };
      delete rest.turnstile;
      return rest;
    });
    setFormError("");
  }, []);

  const validateStep = (step: number): boolean => {
    const nextErrors: Record<string, string> = {};
    if (step === 1 && draft.situationIds.length === 0) {
      nextErrors.situations = "해당하는 상황을 하나 이상 선택해 주세요.";
    }
    if (step === 3) {
      if (!draft.name.trim()) nextErrors.name = "성함을 입력해 주세요.";
      if (!clientParseContact(draft.contact)) {
        nextErrors.contact = "전화번호 또는 이메일을 확인해 주세요.";
      }
      if (!draft.consent) {
        nextErrors.consent = "개인정보 수집·이용에 동의해 주세요.";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(draft.step)) return;
    if (draft.step < 4) update({ step: (draft.step + 1) as 1 | 2 | 3 | 4 });
  };

  const goBack = () => {
    if (phase === "review") {
      setPhase("success");
      return;
    }
    if (draft.step > 1) update({ step: (draft.step - 1) as 1 | 2 | 3 | 4 });
  };

  const onSubmit = async () => {
    if (submitting) return;

    if (!validateStep(3) && draft.step !== 4) return;
    if (draft.step === 4 && !validateStep(3)) {
      update({ step: 3 });
      return;
    }
    if (isTurnstileConfigured() && !token) {
      setErrors((e) => ({
        ...e,
        turnstile: "보안 확인을 완료해 주세요.",
      }));
      setFormError(
        "보안 확인이 완료되지 않았습니다. 이전 단계에서 보안 확인 후 다시 시도해 주세요.",
      );
      update({ step: 3 });
      return;
    }

    setSubmitting(true);
    setErrors({});
    setFormError("");
    try {
      const message = buildConsultMessage(draft);
      const result = await submitQuickInquiry({
        message,
        contact: draft.contact.trim(),
        consent: draft.consent,
        turnstileToken: token,
        website: honeypot,
        pageTitle: draft.pageTitle || pageTitle,
        pageUrl: draft.pageUrl || pageUrl,
      });

      if (!result.ok) {
        if (result.field === "turnstile") {
          setErrors({ turnstile: result.message });
          setFormError(
            "보안 확인이 만료되었거나 실패했습니다. 다시 확인해 주세요.",
          );
          update({ step: 3 });
        } else if (result.field === "contact") {
          setErrors({ contact: result.message });
          setFormError("연락처를 다시 확인해 주세요.");
          update({ step: 3 });
        } else if (result.field === "consent") {
          setErrors({ consent: result.message });
          setFormError("개인정보 수집·이용 동의가 필요합니다.");
          update({ step: 3 });
        } else {
          setFormError(result.message);
        }
        setResetSignal((n) => n + 1);
        setToken("");
        return;
      }

      clearConsultDraft();
      setPhase("success");
      trackConsultEvent({
        event: "consult_complete",
        source: source ?? "other",
        pagePath: (() => {
          try {
            return new URL(pageUrl).pathname;
          } catch {
            return "";
          }
        })(),
        situationIds: draft.situationIds,
      });
    } catch {
      setFormError(
        "네트워크 연결을 확인해 주세요. 작성하신 내용은 그대로 유지됩니다.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const progress = phase === "form" ? draft.step : 4;
  const desc = stepDesc(draft.step, phase);
  const barPct =
    phase === "success" || phase === "review"
      ? 100
      : Math.round((draft.step / 4) * 100);

  return (
    <div className="quick-inquiry-overlay consult-wizard" role="presentation">
      <button
        type="button"
        className="quick-inquiry-overlay__backdrop"
        aria-label="상담 창 닫기"
        onClick={() => {
          trackConsultEvent({
            event: "consult_abandon",
            step: draft.step,
            source: source ?? "other",
            situationIds: draft.situationIds,
          });
          closeInquiry();
        }}
      />
      <div
        ref={panelRef}
        className={`quick-inquiry-panel consult-wizard__panel${reducedMotion ? " quick-inquiry-panel--reduced" : ""}${phase === "success" || phase === "review" ? " quick-inquiry-panel--success" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ids.titleId}
        aria-describedby={desc ? ids.descId : undefined}
      >
        <div className="quick-inquiry-panel__handle" aria-hidden>
          <span className="quick-inquiry-panel__handle-bar" />
        </div>

        <header className="consult-wizard__chrome">
          <button
            type="button"
            className="quick-inquiry-panel__close"
            onClick={closeInquiry}
            aria-label="닫기"
          >
            <span aria-hidden>×</span>
          </button>

          <div className="consult-wizard__meta">
            <p className="consult-wizard__brand">{copy.title}</p>
            <p className="consult-wizard__step-label" aria-live="polite">
              {phase === "form" ? `단계 ${progress} / 4` : "완료"}
            </p>
          </div>

          <div
            className="consult-wizard__progress-bar"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={1}
            aria-valuemax={4}
            aria-label="상담 진행 단계"
          >
            <span style={{ width: `${barPct}%` }} />
          </div>

          <h2 id={ids.titleId} className="consult-wizard__title">
            {stepTitle(draft.step, phase)}
          </h2>
          {desc ? (
            <p id={ids.descId} className="consult-wizard__desc">
              {desc}
            </p>
          ) : null}
        </header>

        <div className="consult-wizard__body">
          {phase === "success" ? (
            <div className="consult-wizard__success" role="status">
              <div className="consult-wizard__success-badge" aria-hidden>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="consult-wizard__success-check"
                >
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.12" />
                  <path
                    d="M7.5 12.5l3 3 6-6.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="consult-wizard__success-text">{copy.successBody}</p>
              <div className="consult-wizard__success-actions">
                <a
                  href={phoneHref}
                  className="btn-primary min-h-11 justify-center"
                >
                  {copy.callNow}
                </a>
                <button
                  type="button"
                  className="btn-secondary min-h-11"
                  onClick={() => setPhase("review")}
                >
                  {copy.reviewAgain}
                </button>
                <Link href="/" className="btn-secondary min-h-11 justify-center">
                  {copy.goHome}
                </Link>
              </div>
            </div>
          ) : null}

          {(phase === "form" && draft.step === 4) || phase === "review" ? (
            <dl className="consult-wizard__summary">
              {summary.map((row) => (
                <div key={row.label} className="consult-wizard__summary-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {phase === "form" && draft.step === 1 ? (
            <div className="consult-wizard__step">
              <div
                className="consult-wizard__options"
                role="group"
                aria-label={copy.step1Title}
              >
                {CONSULT_SITUATIONS.map((item) => {
                  const selected = draft.situationIds.includes(item.id);
                  const recommended = presetSituationIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`consult-wizard__option${selected ? " is-selected" : ""}${recommended ? " is-recommended" : ""}`}
                      aria-pressed={selected}
                      onClick={() =>
                        update({
                          situationIds: toggleId(
                            draft.situationIds,
                            item.id as ConsultSituationId,
                          ),
                        })
                      }
                    >
                      <span
                        className={`consult-wizard__tick${selected ? " is-on" : ""}`}
                        aria-hidden
                      />
                      <span className="consult-wizard__option-text">
                        <span className="consult-wizard__option-label">
                          {item.label}
                        </span>
                        {recommended ? (
                          <span className="consult-wizard__option-rec">
                            이 페이지 추천
                          </span>
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.situations ? (
                <p className="quick-inquiry__error" role="alert">
                  {errors.situations}
                </p>
              ) : null}
              <label className="consult-wizard__field consult-wizard__field--note" htmlFor={ids.messageId}>
                <span className="consult-wizard__field-label">
                  {copy.step1NoteLabel}
                </span>
                <textarea
                  id={ids.messageId}
                  className="quick-inquiry__textarea"
                  rows={3}
                  value={draft.situationNote}
                  onChange={(e) => update({ situationNote: e.target.value })}
                  placeholder={copy.step1NotePlaceholder}
                  maxLength={400}
                />
                <span className="consult-wizard__field-hint">
                  {copy.step1NoteHint}
                </span>
              </label>
            </div>
          ) : null}

          {phase === "form" && draft.step === 2 ? (
            <div className="consult-wizard__step">
              <div
                className="consult-wizard__options"
                role="group"
                aria-label={copy.step2Title}
              >
                {docs.map((doc) => {
                  const selected = draft.documentIds.includes(doc.id);
                  const isNone = doc.id === "none-ready";
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      className={`consult-wizard__option${selected ? " is-selected" : ""}${isNone ? " is-none" : ""}`}
                      aria-pressed={selected}
                      onClick={() => {
                        if (isNone) {
                          update({
                            documentIds: selected ? [] : ["none-ready"],
                          });
                          return;
                        }
                        const withoutNone = draft.documentIds.filter(
                          (id) => id !== "none-ready",
                        );
                        update({
                          documentIds: toggleId(withoutNone, doc.id),
                        });
                      }}
                    >
                      <span
                        className={`consult-wizard__tick${selected ? " is-on" : ""}`}
                        aria-hidden
                      />
                      <span className="consult-wizard__option-text">
                        <span className="consult-wizard__option-label">
                          {doc.label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {phase === "form" && draft.step === 3 ? (
            <div className="consult-wizard__step">
              <p className="quick-inquiry__caution" id={ids.cautionId}>
                {copy.step3Caution}
              </p>

              <label
                className="consult-wizard__field"
                htmlFor={`${ids.contactId}-name`}
              >
                <span className="consult-wizard__field-label">
                  {copy.nameLabel}
                </span>
                <input
                  id={`${ids.contactId}-name`}
                  className="quick-inquiry__input"
                  value={draft.name}
                  onChange={(e) => update({ name: e.target.value })}
                  autoComplete="name"
                  disabled={submitting}
                />
                {errors.name ? (
                  <span className="quick-inquiry__error" role="alert">
                    {errors.name}
                  </span>
                ) : null}
              </label>

              <label className="consult-wizard__field" htmlFor={ids.contactId}>
                <span className="consult-wizard__field-label">
                  {copy.contactLabel}
                </span>
                <input
                  id={ids.contactId}
                  className="quick-inquiry__input"
                  value={draft.contact}
                  onChange={(e) => update({ contact: e.target.value })}
                  inputMode="email"
                  autoComplete="tel email"
                  disabled={submitting}
                />
                <span className="consult-wizard__field-hint">
                  {copy.contactHint}
                </span>
                {errors.contact ? (
                  <span className="quick-inquiry__error" role="alert">
                    {errors.contact}
                  </span>
                ) : null}
              </label>

              <fieldset className="consult-wizard__fieldset">
                <legend>{copy.prefLabel}</legend>
                <div className="consult-wizard__chips" role="group">
                  {CONTACT_PREF_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`consult-wizard__chip${draft.contactPreference === opt.id ? " is-selected" : ""}`}
                      aria-pressed={draft.contactPreference === opt.id}
                      onClick={() => update({ contactPreference: opt.id })}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="consult-wizard__fieldset">
                <legend>{copy.timeLabel}</legend>
                <div className="consult-wizard__chips" role="group">
                  {CONTACT_TIME_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`consult-wizard__chip${draft.contactTime === opt.id ? " is-selected" : ""}`}
                      aria-pressed={draft.contactTime === opt.id}
                      onClick={() => update({ contactTime: opt.id })}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="consult-wizard__consent" htmlFor={ids.consentId}>
                <input
                  id={ids.consentId}
                  type="checkbox"
                  className="quick-inquiry__checkbox"
                  checked={draft.consent}
                  onChange={(e) => update({ consent: e.target.checked })}
                  disabled={submitting}
                />
                <span>
                  <PrivacyConsentLabel suffix="(필수)" />
                </span>
              </label>
              {errors.consent ? (
                <p className="quick-inquiry__error" role="alert">
                  {errors.consent}
                </p>
              ) : null}

              <div className="quick-inquiry__hp" aria-hidden="true">
                <label htmlFor={`${ids.messageId}-hp`}>회사 웹사이트</label>
                <input
                  id={`${ids.messageId}-hp`}
                  name={HONEYPOT_FIELD}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              <TurnstileWidget
                onToken={handleTurnstileToken}
                onError={handleTurnstileError}
                resetSignal={resetSignal}
              />
              {errors.turnstile ? (
                <p className="quick-inquiry__error" role="alert">
                  {errors.turnstile}
                </p>
              ) : null}
            </div>
          ) : null}

        </div>

        {phase === "form" ? (
          <div className="consult-wizard__footer-wrap">
            {formError ? (
              <div
                className="consult-wizard__submit-alert"
                role="alert"
                aria-live="assertive"
              >
                <span className="consult-wizard__submit-alert-icon" aria-hidden>
                  !
                </span>
                <div>
                  <p className="consult-wizard__submit-alert-title">
                    상담 신청을 완료하지 못했습니다
                  </p>
                  <p className="consult-wizard__submit-alert-text">{formError}</p>
                </div>
              </div>
            ) : null}

            {submitting ? (
              <div
                className="consult-wizard__sending"
                role="status"
                aria-live="polite"
              >
                <span className="consult-wizard__spinner" aria-hidden />
                <span>상담 내용을 안전하게 전송하고 있습니다</span>
              </div>
            ) : null}

            <footer className="consult-wizard__footer">
              {draft.step > 1 ? (
                <button
                  type="button"
                  className="btn-secondary min-h-11 consult-wizard__footer-back"
                  onClick={goBack}
                  disabled={submitting}
                >
                  {copy.back}
                </button>
              ) : null}
              {draft.step < 4 ? (
                <button
                  type="button"
                  className="btn-primary min-h-11 consult-wizard__footer-next"
                  onClick={goNext}
                  disabled={submitting}
                >
                  {copy.next}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-primary min-h-11 consult-wizard__footer-next"
                  onClick={onSubmit}
                  disabled={submitting}
                  aria-busy={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="consult-wizard__spinner consult-wizard__spinner--button" aria-hidden />
                      {copy.submitting}
                    </>
                  ) : (
                    copy.submit
                  )}
                </button>
              )}
            </footer>
          </div>
        ) : null}

        {phase === "review" ? (
          <footer className="consult-wizard__footer">
            <button
              type="button"
              className="btn-secondary min-h-11 consult-wizard__footer-next"
              onClick={() => setPhase("success")}
            >
              {copy.back}
            </button>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
