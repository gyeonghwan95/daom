import { DUPLICATE_WINDOW_MS, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from "./constants";

type Bucket = { count: number; resetAt: number };

/** Isolate 메모리 기반 소프트 제한 (다중 인스턴스에서는 best-effort) */
const rateBuckets = new Map<string, Bucket>();
const duplicateHits = new Map<string, number>();

function pruneMaps(now: number) {
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
  for (const [key, until] of duplicateHits) {
    if (until <= now) duplicateHits.delete(key);
  }
}

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  pruneMaps(now);
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count += 1;
  return true;
}

export async function hashDuplicateKey(message: string, contact: string): Promise<string> {
  const data = new TextEncoder().encode(`${message}\n${contact}`.toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}

export function checkDuplicate(hash: string): boolean {
  const now = Date.now();
  pruneMaps(now);
  const until = duplicateHits.get(hash);
  if (until && until > now) return false;
  duplicateHits.set(hash, now + DUPLICATE_WINDOW_MS);
  return true;
}
