"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function isAdminPath(pathname: string | null | undefined): boolean {
  return Boolean(pathname?.startsWith("/admin"));
}

/** Hide public chrome on /admin/* without changing public URL structure. */
export function PublicOnly({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (isAdminPath(pathname)) return null;
  return <>{children}</>;
}
