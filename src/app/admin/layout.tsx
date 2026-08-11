import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin-console/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "운영 콘솔",
    template: "%s · 운영 콘솔",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

/**
 * Admin area — no public chrome. Auth enforced by API + client gate.
 * Search exclusion: robots metadata + robots.txt + sitemap exclusions.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
