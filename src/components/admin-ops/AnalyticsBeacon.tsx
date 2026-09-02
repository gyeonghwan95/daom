"use client";

/**
 * Public page_view beacons used to POST /api/analytics/collect on every visit.
 * That path did GET+PUT on KV per view and exhausted the Free write budget.
 * Conversion events still go through trackEvent(); this component is a no-op.
 */
export function AnalyticsBeacon() {
  return null;
}
