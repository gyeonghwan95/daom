export function AdminLoading({ label = "불러오는 중" }: { label?: string }) {
  return (
    <div className="admin-loading" role="status" aria-live="polite">
      <div className="admin-skeleton-grid" aria-hidden>
        <span className="admin-skeleton" />
        <span className="admin-skeleton" />
        <span className="admin-skeleton" />
        <span className="admin-skeleton" />
      </div>
      <p className="admin-empty">{label}…</p>
    </div>
  );
}

export function AdminErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="admin-alert admin-alert--warning admin-error-state" role="alert">
      <p>{message}</p>
      {onRetry ? (
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onRetry}>
          다시 시도
        </button>
      ) : null}
    </div>
  );
}
