"use client";

import {
  formatPagePath,
  getPageDisplayName,
  hrefForPublicPage,
} from "@/lib/admin/url-display";

type Props = {
  path: string;
  showLink?: boolean;
  compact?: boolean;
};

export function PageIdentity({ path, showLink = true, compact = false }: Props) {
  const displayPath = formatPagePath(path);
  const title = getPageDisplayName(path);

  return (
    <div className="admin-page-identity">
      {title && title !== displayPath.slice(1) ? (
        <div className="admin-page-identity__title">{title}</div>
      ) : null}
      {showLink ? (
        <a
          href={hrefForPublicPage(path)}
          target="_blank"
          rel="noopener noreferrer"
          className="admin-page-identity__path"
          title={displayPath}
        >
          {displayPath}
          <span aria-hidden className="admin-page-identity__ext">
            ↗
          </span>
        </a>
      ) : (
        <span className="admin-page-identity__path" title={displayPath}>
          {displayPath}
        </span>
      )}
      {compact ? null : null}
    </div>
  );
}
