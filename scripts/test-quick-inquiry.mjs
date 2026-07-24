#!/usr/bin/env node
/**
 * 간편 문의 검증·핸들러 스모크 테스트 (네트워크 알림 채널 없이)
 */
import assert from "node:assert/strict";
import { validateInquiryBody } from "../src/lib/quick-inquiry/core/validate.ts";
import { parseContact } from "../src/lib/quick-inquiry/core/sanitize.ts";
import { handleQuickInquiry } from "../src/lib/quick-inquiry/core/handler.ts";
import { normalizeSenderAddress } from "../src/lib/quick-inquiry/core/notify.ts";

function ok(name) {
  console.log(`  ✓ ${name}`);
}

console.log("quick-inquiry validation");

{
  const phone = parseContact("010-1234-5678");
  assert.equal(phone?.kind, "phone");
  ok("phone parse");
}

{
  const email = parseContact("user@example.com");
  assert.equal(email?.kind, "email");
  ok("email parse");
}

{
  assert.equal(parseContact("not-a-contact"), null);
  ok("invalid contact rejected");
}

{
  const v = validateInquiryBody({
    message: "부모님 명의 토지 상속등기 문의합니다",
    contact: "01012345678",
    consent: true,
    turnstileToken: "x",
    website: "",
    pageTitle: "테스트",
    pageUrl: "https://example.com/test",
  });
  assert.equal(v.ok, true);
  ok("valid body");
}

{
  const v = validateInquiryBody({
    message: "짧",
    contact: "01012345678",
    consent: true,
    turnstileToken: "x",
  });
  assert.equal(v.ok, false);
  assert.equal(v.error.field, "message");
  ok("short message rejected");
}

{
  const v = validateInquiryBody({
    message: "정상적인 길이의 문의 내용입니다",
    contact: "bad",
    consent: true,
    turnstileToken: "x",
  });
  assert.equal(v.ok, false);
  assert.equal(v.error.field, "contact");
  ok("bad contact rejected");
}

{
  const v = validateInquiryBody({
    message: "정상적인 길이의 문의 내용입니다",
    contact: "01012345678",
    consent: false,
    turnstileToken: "x",
  });
  assert.equal(v.ok, false);
  assert.equal(v.error.field, "consent");
  ok("consent required");
}

{
  const v = validateInquiryBody({
    message: "정상적인 길이의 문의 내용입니다",
    contact: "01012345678",
    consent: true,
    website: "http://spam.example",
    turnstileToken: "x",
  });
  assert.equal(v.ok, false);
  assert.equal(v.error.code, "honeypot");
  ok("honeypot blocked");
}

{
  assert.equal(
    normalizeSenderAddress("noreply@다옴법무사사무소.kr"),
    "noreply@xn--2j1br1na42lvxja38mk8r.kr",
  );
  assert.equal(
    normalizeSenderAddress("다옴 문의 <noreply@다옴법무사사무소.kr>"),
    "다옴 문의 <noreply@xn--2j1br1na42lvxja38mk8r.kr>",
  );
  ok("from address punycode normalize");
}

console.log("quick-inquiry handler");

{
  const res = await handleQuickInquiry(
    new Request("http://localhost:3000/api/quick-inquiry", { method: "GET" }),
    {},
  );
  assert.equal(res.status, 405);
  ok("GET → 405");
}

{
  const res = await handleQuickInquiry(
    new Request("https://xn--2j1br1na42lvxja38mk8r.kr/api/quick-inquiry", {
      method: "POST",
      headers: {
        Origin: "https://xn--2j1br1na42lvxja38mk8r.kr",
        "Content-Type": "application/json",
        "CF-Connecting-IP": "203.0.113.20",
      },
      body: JSON.stringify({
        message: "정상적인 길이의 문의 내용입니다",
        contact: "01012345678",
        consent: true,
        website: "",
        pageTitle: "홈",
        pageUrl: "/",
      }),
    }),
    {},
  );
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.equal(data.code, "no_channel");
  ok("punycode origin allowed (no channel → 503)");
}

{
  const res = await handleQuickInquiry(
    new Request("http://localhost:3000/api/quick-inquiry", {
      method: "POST",
      headers: {
        Origin: "http://evil.example",
        "Content-Type": "application/json",
        "CF-Connecting-IP": "203.0.113.21",
      },
      body: JSON.stringify({
        message: "정상적인 길이의 문의 내용입니다",
        contact: "01012345678",
        consent: true,
      }),
    }),
    {},
  );
  assert.equal(res.status, 403);
  ok("foreign origin → 403");
}

{
  const res = await handleQuickInquiry(
    new Request("http://localhost:3000/api/quick-inquiry", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
        "CF-Connecting-IP": "203.0.113.22",
      },
      body: JSON.stringify({
        message: "채널 미설정 시 오류 코드 확인용 문의입니다",
        contact: "01022223333",
        consent: true,
        website: "",
        pageTitle: "홈",
        pageUrl: "/",
      }),
    }),
    {},
  );
  assert.equal(res.status, 503);
  const data = await res.json();
  assert.equal(data.code, "no_channel");
  ok("no telegram/resend → 503");
}

{
  const payload = {
    message: "중복 전송 방지 테스트용 문의 본문입니다",
    contact: "01099998888",
    consent: true,
    website: "",
    pageTitle: "홈",
    pageUrl: "/",
  };
  const make = () =>
    handleQuickInquiry(
      new Request("http://localhost:3000/api/quick-inquiry", {
        method: "POST",
        headers: {
          Origin: "http://localhost:3000",
          "Content-Type": "application/json",
          "CF-Connecting-IP": "203.0.113.10",
        },
        body: JSON.stringify(payload),
      }),
      {
        TELEGRAM_BOT_TOKEN: "fake",
        TELEGRAM_CHAT_ID: "1",
      },
    );

  // first call will try telegram and fail delivery (fake token) → 502
  const first = await make();
  assert.ok([502, 429].includes(first.status));
  const second = await make();
  assert.equal(second.status, 429);
  const dup = await second.json();
  assert.equal(dup.code, "duplicate");
  ok("duplicate submit → 429");
}

console.log("\nAll quick-inquiry checks passed.");
