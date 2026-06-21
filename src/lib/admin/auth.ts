import { createHmac, timingSafeEqual } from "node:crypto";
import { getAdminPassword, getAdminSessionSecret } from "@/lib/admin/config";

function hashPassword(password: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(password).digest();
}

export function verifyAdminPassword(input: string): boolean {
  const password = getAdminPassword();
  const secret = getAdminSessionSecret();
  if (!password || !secret) return false;

  const inputHash = hashPassword(input, secret);
  const expectedHash = hashPassword(password, secret);

  if (inputHash.length !== expectedHash.length) return false;
  return timingSafeEqual(inputHash, expectedHash);
}
