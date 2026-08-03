import type { ReactNode } from "react";
import {
  getCredentialCopy,
  getMentionBusinessCredentials,
  getVisibleBusinessCredentials,
  type CredentialCopyGroup,
  type CredentialPlacement,
  type CredentialVariant,
  resolveCredentialPlacement,
  resolveHomeCredentialPlacement,
} from "@/lib/business-credentials";
import { BusinessCredentialInlineNote } from "@/components/credentials/BusinessCredentialInlineNote";
import { BusinessCredentialStrip } from "@/components/credentials/BusinessCredentialStrip";
import { BusinessCredentialTrustPanel } from "@/components/credentials/BusinessCredentialTrustPanel";

type BusinessCredentialSlotProps = {
  /** 경로 기반 자동 결정 */
  path?: string;
  slug?: string;
  /** 홈 등 고정 배치 */
  fixed?: "home" | CredentialPlacement;
  /**
   * 소개 페이지 등: 발급일·유효기간 검증 전이라도
   * 공식 명칭 안내 패널을 표시한다. (유효기간 숫자는 숨김)
   */
  forceDisplay?: boolean;
  panelTitle?: string;
  panelBody?: string;
  showSearchNameNote?: boolean;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
};

function renderVariant(
  variant: CredentialVariant,
  copyGroup: CredentialCopyGroup,
  extras: {
    panelTitle?: string;
    panelBody?: string;
    showSearchNameNote?: boolean;
    linkHref?: string;
    linkLabel?: string;
    className?: string;
    forceDisplay?: boolean;
  },
): ReactNode {
  const credentials = extras.forceDisplay
    ? getMentionBusinessCredentials()
    : getVisibleBusinessCredentials();
  if (credentials.length === 0) return null;

  const copy = getCredentialCopy(copyGroup);
  const verifiedCount = getVisibleBusinessCredentials().length;
  const expiryDisplay =
    extras.forceDisplay && verifiedCount === 0
      ? ("consult" as const)
      : ("date-or-valid" as const);

  if (variant === "strip") {
    if (extras.forceDisplay && verifiedCount === 0) {
      // Strip은 유효 확인 후에만 — 미검증 force는 패널만
      return (
        <BusinessCredentialTrustPanel
          credentials={credentials}
          title={extras.panelTitle ?? copy.title}
          body={extras.panelBody ?? copy.body}
          showSearchNameNote={extras.showSearchNameNote}
          expiryDisplay="consult"
          className={extras.className}
        />
      );
    }
    return (
      <BusinessCredentialStrip
        credentials={credentials}
        label={copy.stripLabel}
        support={copy.stripSupport}
        linkHref={extras.linkHref}
        linkLabel={extras.linkLabel}
        className={extras.className}
      />
    );
  }

  if (variant === "inline") {
    return (
      <BusinessCredentialInlineNote
        text={copy.inline}
        className={extras.className}
      />
    );
  }

  return (
    <BusinessCredentialTrustPanel
      credentials={credentials}
      title={extras.panelTitle ?? copy.title}
      body={extras.panelBody ?? copy.body}
      showSearchNameNote={extras.showSearchNameNote}
      expiryDisplay={expiryDisplay}
      className={extras.className}
    />
  );
}

/**
 * 페이지당 확인서 UI 1회.
 * 기본: 유효·enabled 항목만. forceDisplay: 소개용 명칭 안내.
 */
export function BusinessCredentialSlot({
  path,
  slug,
  fixed,
  forceDisplay = false,
  panelTitle,
  panelBody,
  showSearchNameNote,
  linkHref,
  linkLabel,
  className,
}: BusinessCredentialSlotProps) {
  let placement: CredentialPlacement | null = null;

  if (fixed === "home") {
    placement = forceDisplay
      ? { variant: "strip", copyGroup: "general" }
      : resolveHomeCredentialPlacement();
  } else if (fixed && typeof fixed === "object") {
    placement =
      forceDisplay || getVisibleBusinessCredentials().length > 0
        ? fixed
        : null;
  } else if (path && slug !== undefined) {
    placement = forceDisplay
      ? resolveCredentialPlacement(path, slug) ?? {
          variant: "inline",
          copyGroup: "general",
        }
      : resolveCredentialPlacement(path, slug);
  }

  if (!placement) return null;

  return renderVariant(placement.variant, placement.copyGroup, {
    panelTitle,
    panelBody,
    showSearchNameNote,
    linkHref,
    linkLabel,
    className,
    forceDisplay,
  });
}
