"use client";

import { useCallback, useState, type FormEvent } from "react";
import { getContactInfo, getPhoneHref } from "@/lib/contact";
import { submitQuickInquiry, clientParseContact } from "@/lib/quick-inquiry/client";
import { quickInquiryCopy as copy } from "@/lib/quick-inquiry/copy";
import {
  HONEYPOT_FIELD,
  MESSAGE_MAX,
  MESSAGE_MIN,
} from "@/lib/quick-inquiry/shared";
import { TurnstileWidget, isTurnstileConfigured } from "./TurnstileWidget";
import { useDialogIds } from "./useDialogA11y";

type QuickInquiryFormProps = {
  pageTitle: string;
  pageUrl: string;
  onSuccess?: () => void;
  onClose?: () => void;
  variant?: "panel" | "inline";
};

type FieldErrors = {
  message?: string;
  contact?: string;
  consent?: string;
  turnstile?: string;
  form?: string;
};

export function QuickInquiryForm({
  pageTitle,
  pageUrl,
  onSuccess,
  onClose,
  variant = "panel",
}: QuickInquiryFormProps) {
  const ids = useDialogIds();
  const phone = getContactInfo().phone;
  const phoneHref = phone ? getPhoneHref(phone) : "/contact";

  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  const [resetSignal, setResetSignal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const resetForm = useCallback(() => {
    setMessage("");
    setContact("");
    setConsent(false);
    setHoneypot("");
    setToken("");
    setErrors({});
    setResetSignal((n) => n + 1);
  }, []);

  const validateLocal = (): FieldErrors => {
    const next: FieldErrors = {};
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < MESSAGE_MIN) {
      next.message = "문의 내용을 조금 더 구체적으로 적어 주세요.";
    } else if (trimmedMessage.length > MESSAGE_MAX) {
      next.message = "문의 내용이 너무 깁니다. 조금 줄여 주세요.";
    }
    if (!clientParseContact(contact)) {
      next.contact = "전화번호 또는 이메일 형식을 확인해 주세요.";
    }
    if (!consent) {
      next.consent = "개인정보 수집·이용에 동의해 주세요.";
    }
    if (isTurnstileConfigured() && !token) {
      next.turnstile = "보안 확인을 완료해 주세요.";
    }
    return next;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const localErrors = validateLocal();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const result = await submitQuickInquiry({
        message,
        contact,
        consent,
        turnstileToken: token,
        website: honeypot,
        pageTitle,
        pageUrl,
      });

      if (result.ok) {
        setDone(true);
        resetForm();
        onSuccess?.();
        return;
      }

      const fieldErrors: FieldErrors = {};
      if (result.field === "message") fieldErrors.message = result.message;
      else if (result.field === "contact") fieldErrors.contact = result.message;
      else if (result.field === "consent") fieldErrors.consent = result.message;
      else if (result.field === "turnstile") fieldErrors.turnstile = result.message;
      else fieldErrors.form = result.message;
      setErrors(fieldErrors);
      setResetSignal((n) => n + 1);
      setToken("");
    } catch {
      setErrors({
        form: "네트워크 연결을 확인해 주세요. 작성하신 내용은 그대로 유지됩니다.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="quick-inquiry__success" role="status" aria-live="polite">
        <p className="quick-inquiry__success-text">{copy.success}</p>
        <div className="quick-inquiry__success-actions">
          <a href={phoneHref} className="btn-primary min-h-11 justify-center">
            {copy.callNow}
          </a>
          {onClose ? (
            <button type="button" className="btn-secondary min-h-11" onClick={onClose}>
              {copy.close}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form
      className={`quick-inquiry__form quick-inquiry__form--${variant}`}
      onSubmit={onSubmit}
      noValidate
    >
      <div className="quick-inquiry__field">
        <label htmlFor={ids.messageId} className="quick-inquiry__label">
          {copy.messageLabel}
        </label>
        <textarea
          id={ids.messageId}
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={copy.messagePlaceholder}
          className="quick-inquiry__textarea"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${ids.cautionId}${errors.message ? ` ${ids.errorId}-message` : ""}`}
          maxLength={MESSAGE_MAX + 50}
          disabled={submitting}
          required
        />
        {errors.message ? (
          <p id={`${ids.errorId}-message`} className="quick-inquiry__error" role="alert">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="quick-inquiry__field">
        <label htmlFor={ids.contactId} className="quick-inquiry__label">
          {copy.contactLabel}
        </label>
        <input
          id={ids.contactId}
          name="contact"
          type="text"
          inputMode="email"
          autoComplete="tel email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={copy.contactPlaceholder}
          className="quick-inquiry__input"
          aria-invalid={Boolean(errors.contact)}
          aria-describedby={errors.contact ? `${ids.errorId}-contact` : undefined}
          disabled={submitting}
          required
        />
        {errors.contact ? (
          <p id={`${ids.errorId}-contact`} className="quick-inquiry__error" role="alert">
            {errors.contact}
          </p>
        ) : null}
      </div>

      <p id={ids.cautionId} className="quick-inquiry__caution">
        {copy.caution}
      </p>

      <div className="quick-inquiry__consent">
        <input
          id={ids.consentId}
          name="consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="quick-inquiry__checkbox"
          disabled={submitting}
          aria-invalid={Boolean(errors.consent)}
        />
        <label htmlFor={ids.consentId} className="quick-inquiry__consent-label">
          {copy.consent}
        </label>
      </div>
      {errors.consent ? (
        <p className="quick-inquiry__error" role="alert">
          {errors.consent}
        </p>
      ) : null}

      {/* honeypot */}
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
        onToken={setToken}
        onError={() =>
          setErrors((prev) => ({
            ...prev,
            turnstile: "보안 확인을 불러오지 못했습니다.",
          }))
        }
        resetSignal={resetSignal}
      />
      {errors.turnstile ? (
        <p className="quick-inquiry__error" role="alert">
          {errors.turnstile}
        </p>
      ) : null}

      <div aria-live="polite" className="sr-only">
        {submitting ? copy.submitting : ""}
      </div>

      {errors.form ? (
        <div className="quick-inquiry__form-error" role="alert">
          <p>{errors.form}</p>
          <a href={phoneHref} className="btn-secondary mt-3 inline-flex min-h-11 items-center justify-center">
            {copy.callNow}
          </a>
        </div>
      ) : null}

      <button
        type="submit"
        className="btn-primary quick-inquiry__submit"
        disabled={submitting}
      >
        {submitting ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
