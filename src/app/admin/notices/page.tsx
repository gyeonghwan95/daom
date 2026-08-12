"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { NoticeModal } from "@/components/notices/NoticeModal";
import type {
  FloatingNotice,
  PublicFloatingNotice,
} from "@/lib/admin-ops/types";

type NoticeRow = FloatingNotice & {
  stats7d?: {
    impression: number;
    click: number;
    dismiss: number;
    ctr: number | null;
  };
};

type Tab = "all" | "active" | "scheduled" | "draft" | "expired" | "archived";

const STATUS_LABEL: Record<string, string> = {
  active: "게시중",
  scheduled: "예약",
  draft: "초안",
  expired: "종료",
  archived: "보관",
};

type FormState = {
  title: string;
  message: string;
  publishedAt: string;
  startAt: string;
  endAt: string;
  displayScope: FloatingNotice["displayScope"];
  style: FloatingNotice["style"];
  ctaLabel: string;
  ctaUrl: string;
  dismissible: boolean;
  priority: number;
  showPopup: boolean;
  isPublicArchive: boolean;
  useCta: boolean;
};

const emptyForm = (): FormState => ({
  title: "",
  message: "",
  publishedAt: "",
  startAt: "",
  endAt: "",
  displayScope: "all",
  style: "notice",
  ctaLabel: "",
  ctaUrl: "",
  dismissible: true,
  priority: 10,
  showPopup: true,
  isPublicArchive: true,
  useCta: false,
});

function toLocalInput(iso?: string): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const d = new Date(t);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromLocalInput(value: string): string | undefined {
  if (!value) return undefined;
  const t = Date.parse(value);
  if (Number.isNaN(t)) return undefined;
  return new Date(t).toISOString();
}

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<NoticeRow[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [showEditor, setShowEditor] = useState(true);

  async function reload() {
    const res = await fetch("/api/admin/notices", { credentials: "include" });
    const json = (await res.json()) as {
      ok?: boolean;
      message?: string;
      data?: { notices?: NoticeRow[]; storageConfigured?: boolean };
    };
    if (!res.ok) {
      setError(json.message || "불러오기 실패");
      return;
    }
    setNotices(json.data?.notices || []);
    if (json.data?.storageConfigured === false) {
      setError("ADMIN_KV가 없어 공지를 저장할 수 없습니다.");
    }
  }

  useEffect(() => {
    void reload().catch(() => setError("네트워크 오류"));
  }, []);

  const filtered = useMemo(() => {
    if (tab === "all") return notices;
    return notices.filter((n) => n.status === tab);
  }, [notices, tab]);

  const previewNotice: PublicFloatingNotice = {
    id: editingId || "preview",
    title: form.title,
    message: form.message,
    style: form.style,
    ctaLabel: form.useCta ? form.ctaLabel || "자세히 보기" : "자세히 보기",
    ctaUrl: form.useCta && form.ctaUrl ? form.ctaUrl : undefined,
    dismissible: form.dismissible,
    priority: form.priority,
    publishedAt: fromLocalInput(form.publishedAt) || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    detailPath: "/공지사항",
  };

  function loadIntoForm(n: NoticeRow) {
    setEditingId(n.id);
    setShowEditor(true);
    setForm({
      title: n.title,
      message: n.message,
      publishedAt: toLocalInput(n.publishedAt || n.createdAt),
      startAt: toLocalInput(n.startAt),
      endAt: toLocalInput(n.endAt),
      displayScope: n.displayScope || "all",
      style: n.style || "notice",
      ctaLabel: n.ctaLabel || "",
      ctaUrl: n.ctaUrl || "",
      dismissible: n.dismissible !== false,
      priority: n.priority || 0,
      showPopup: n.showPopup !== false,
      isPublicArchive: n.isPublicArchive !== false,
      useCta: Boolean(n.ctaLabel || n.ctaUrl),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm());
  }

  function payload(publishNow: boolean) {
    return {
      title: form.title,
      message: form.message,
      publishNow,
      status: publishNow ? "active" : editingId ? undefined : "draft",
      publishedAt: fromLocalInput(form.publishedAt),
      startAt: fromLocalInput(form.startAt),
      endAt: fromLocalInput(form.endAt),
      displayScope: form.displayScope,
      style: form.style,
      dismissible: form.dismissible,
      priority: form.priority,
      showPopup: form.showPopup,
      isPublicArchive: form.isPublicArchive,
      ctaLabel: form.useCta ? form.ctaLabel : "",
      ctaUrl: form.useCta ? form.ctaUrl : "",
    };
  }

  async function create(publishNow: boolean) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/notices", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(publishNow)),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) {
        setError(json.message || "저장 실패");
        return;
      }
      resetForm();
      await reload();
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/notices/${editingId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload(false)),
      });
      const json = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !json.ok) {
        setError(json.message || "수정 실패");
        return;
      }
      resetForm();
      await reload();
    } finally {
      setSaving(false);
    }
  }

  async function archive(id: string) {
    await fetch(`/api/admin/notices/${id}/archive`, {
      method: "POST",
      credentials: "include",
    });
    await reload();
  }

  async function publish(id: string) {
    await fetch(`/api/admin/notices/${id}/publish`, {
      method: "POST",
      credentials: "include",
    });
    await reload();
  }

  async function unpublish(id: string) {
    await fetch(`/api/admin/notices/${id}/unpublish`, {
      method: "POST",
      credentials: "include",
    });
    await reload();
  }

  async function remove(id: string, title: string) {
    if (
      !window.confirm(
        `"${title}" 공지를 삭제할까요?\n보관(archive) 대신 영구 삭제됩니다.`,
      )
    ) {
      return;
    }
    const res = await fetch(`/api/admin/notices/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      setError("삭제 실패");
      return;
    }
    if (editingId === id) resetForm();
    await reload();
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "all", label: "전체" },
    { id: "active", label: "게시중" },
    { id: "scheduled", label: "예약" },
    { id: "draft", label: "초안" },
    { id: "expired", label: "종료" },
    { id: "archived", label: "보관" },
  ];

  return (
    <div>
      <AdminPageHeader title="공지사항">
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => {
            resetForm();
            setShowEditor(true);
          }}
        >
          새 공지 등록
        </button>
      </AdminPageHeader>
      <p className="admin-prose">
        중앙 팝업 공지 · 공개 `/공지사항` 목록과 연동됩니다. plain text만
        저장되며 CTA는 내부 경로 또는 http(s)만 허용됩니다.
      </p>

      {error ? (
        <p className="admin-alert admin-alert--warning" role="alert">
          {error}
        </p>
      ) : null}

      {showEditor ? (
        <div className="admin-notice-editor">
          <section className="admin-panel">
            <h2 className="admin-section__title">
              {editingId ? "공지 수정" : "새 공지"}
            </h2>
            <label className="admin-field">
              제목
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                maxLength={80}
              />
            </label>
            <label className="admin-field">
              내용
              <textarea
                className="admin-input admin-textarea"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                rows={6}
                maxLength={2000}
              />
            </label>
            <div className="admin-field-grid">
              <label className="admin-field">
                게시일
                <input
                  className="admin-input"
                  type="datetime-local"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, publishedAt: e.target.value }))
                  }
                />
              </label>
              <label className="admin-field">
                우선순위
                <input
                  className="admin-input"
                  type="number"
                  value={form.priority}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      priority: Number(e.target.value) || 0,
                    }))
                  }
                />
              </label>
              <label className="admin-field">
                게시 시작
                <input
                  className="admin-input"
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startAt: e.target.value }))
                  }
                />
              </label>
              <label className="admin-field">
                게시 종료
                <input
                  className="admin-input"
                  type="datetime-local"
                  value={form.endAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endAt: e.target.value }))
                  }
                />
              </label>
              <label className="admin-field">
                스타일
                <select
                  className="admin-input"
                  value={form.style}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      style: e.target.value as FloatingNotice["style"],
                    }))
                  }
                >
                  <option value="notice">공지</option>
                  <option value="info">정보</option>
                  <option value="important">중요</option>
                  <option value="event">이벤트</option>
                </select>
              </label>
              <label className="admin-field">
                노출 범위
                <select
                  className="admin-input"
                  value={form.displayScope}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      displayScope: e.target
                        .value as FloatingNotice["displayScope"],
                    }))
                  }
                >
                  <option value="all">전체 페이지</option>
                  <option value="home">홈만</option>
                </select>
              </label>
            </div>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.showPopup}
                onChange={(e) =>
                  setForm((f) => ({ ...f, showPopup: e.target.checked }))
                }
              />
              중앙 팝업 표시
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.isPublicArchive}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    isPublicArchive: e.target.checked,
                  }))
                }
              />
              공개 공지사항 목록에 포함
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.dismissible}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dismissible: e.target.checked }))
                }
              />
              「오늘은 더 이상 보지 않기」 허용
            </label>
            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.useCta}
                onChange={(e) =>
                  setForm((f) => ({ ...f, useCta: e.target.checked }))
                }
              />
              CTA 버튼 사용
            </label>
            {form.useCta ? (
              <div className="admin-field-grid">
                <label className="admin-field">
                  CTA 문구
                  <input
                    className="admin-input"
                    value={form.ctaLabel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ctaLabel: e.target.value }))
                    }
                    maxLength={40}
                  />
                </label>
                <label className="admin-field">
                  CTA URL
                  <input
                    className="admin-input"
                    value={form.ctaUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ctaUrl: e.target.value }))
                    }
                    placeholder="/contact 또는 https://..."
                  />
                </label>
              </div>
            ) : null}
            <div className="admin-page-header__actions" style={{ marginTop: 12 }}>
              {editingId ? (
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  disabled={saving || !form.title || !form.message}
                  onClick={() => void saveEdit()}
                >
                  수정 저장
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    disabled={saving || !form.title || !form.message}
                    onClick={() => void create(true)}
                  >
                    즉시 게시
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    disabled={saving || !form.title || !form.message}
                    onClick={() => void create(false)}
                  >
                    초안 저장
                  </button>
                </>
              )}
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={resetForm}
              >
                초기화
              </button>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-section__head">
              <h2 className="admin-section__title">팝업 Preview</h2>
              <div className="admin-page-header__actions">
                <button
                  type="button"
                  className={`admin-btn admin-btn--ghost${previewMode === "desktop" ? " is-active" : ""}`}
                  onClick={() => setPreviewMode("desktop")}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  className={`admin-btn admin-btn--ghost${previewMode === "mobile" ? " is-active" : ""}`}
                  onClick={() => setPreviewMode("mobile")}
                >
                  Mobile
                </button>
              </div>
            </div>
            <NoticeModal
              notice={previewNotice}
              preview
              previewMode={previewMode}
              onClose={() => undefined}
              onDismissToday={() => undefined}
            />
            <p className="admin-prose" style={{ marginTop: 8 }}>
              공개 사이트와 동일한 NoticeModal 컴포넌트입니다.
            </p>
          </section>
        </div>
      ) : null}

      <div className="admin-tabs" role="tablist" aria-label="공지 상태">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`admin-tabs__btn${tab === t.id ? " is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-panel">
        {filtered.length === 0 ? (
          <p className="admin-empty">해당 상태의 공지가 없습니다.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>상태</th>
                <th>게시기간</th>
                <th>팝업</th>
                <th>노출</th>
                <th>CTR</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{n.title}</div>
                    <div style={{ color: "#64748b", fontSize: 12 }}>
                      {n.message.slice(0, 60)}
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge">
                      {STATUS_LABEL[n.status] || n.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12 }}>
                    {(n.startAt || "—").slice(0, 10)}
                    <br />~{(n.endAt || "—").slice(0, 10)}
                  </td>
                  <td>{n.showPopup === false ? "OFF" : "ON"}</td>
                  <td>{n.stats7d?.impression ?? "—"}</td>
                  <td>
                    {n.stats7d?.ctr != null ? `${n.stats7d.ctr}%` : "—"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        onClick={() => loadIntoForm(n)}
                      >
                        수정
                      </button>
                      {n.status !== "active" && n.status !== "archived" ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          onClick={() => void publish(n.id)}
                        >
                          게시
                        </button>
                      ) : null}
                      {n.status === "active" ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          onClick={() => void unpublish(n.id)}
                        >
                          게시중단
                        </button>
                      ) : null}
                      {n.status !== "archived" ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn--ghost"
                          onClick={() => void archive(n.id)}
                        >
                          보관
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="admin-btn admin-btn--ghost"
                        onClick={() => void remove(n.id, n.title)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
