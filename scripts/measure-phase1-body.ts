import { buildBusanLawyerFlagshipPage } from "../src/lib/local-landing/flagship-busan-lawyer";
import { buildBusanQualifiedAcceptancePage } from "../src/lib/local-landing/qualified-acceptance-busan";
import { buildBusanCorporateRegistrationPage } from "../src/lib/local-landing/corporate-registration-busan";
import { buildBusanInheritanceRegistrationPage } from "../src/lib/local-landing/inheritance-registration-busan";
import { buildBusanInheritanceRenunciationPage } from "../src/lib/local-landing/inheritance-renunciation-busan";
import { buildBusanRealEstateRegistrationPage } from "../src/lib/local-landing/real-estate-registration-busan";
import { buildBusanCompanyEstablishmentPage } from "../src/lib/local-landing/company-establishment-busan";
import { 부산개인회생법무사Override } from "../src/lib/local-landing/search-intent/overrides/busan-personal-rehabilitation-lawyer";
import { keywordTopics } from "../src/lib/local-landing/keyword-topics";

function stripLen(parts: unknown[]): number {
  const flat: string[] = [];
  const walk = (v: unknown) => {
    if (!v) return;
    if (typeof v === "string") {
      flat.push(v);
      return;
    }
    if (Array.isArray(v)) {
      v.forEach(walk);
      return;
    }
    if (typeof v === "object" && v !== null && "question" in v && "answer" in v) {
      const f = v as { question: string; answer: string };
      flat.push(f.question, f.answer);
    }
  };
  parts.forEach(walk);
  return flat.join(" ").replace(/\s+/g, " ").trim().replace(/\s/g, "").length;
}

const cfg = {
  slug: "x",
  serviceSlug: "y",
  regionKey: "busan",
  regionLabel: "부산",
  neighborhoods: ["해운대"],
};

function localLen(page: {
  problemStatement?: string;
  summaryParagraphs?: string[];
  legalIssues?: string[];
  precautions?: string[];
  procedures?: string[];
  documents?: string[];
  faqs?: unknown[];
  lawyerOpinion?: string;
  costGuide?: string;
  whenNeeded?: string[];
}) {
  return stripLen([
    page.problemStatement,
    page.summaryParagraphs,
    page.legalIssues,
    page.precautions,
    page.procedures,
    page.documents,
    page.faqs,
    page.lawyerOpinion,
    page.costGuide,
    page.whenNeeded,
  ]);
}

const rows = {
  "/부산법무사": localLen(
    buildBusanLawyerFlagshipPage({
      ...cfg,
      slug: "부산법무사",
      serviceSlug: "inheritance-registration",
    }),
  ),
  "/부산한정승인": localLen(
    buildBusanQualifiedAcceptancePage({
      ...cfg,
      slug: "부산한정승인",
      serviceSlug: "qualified-acceptance",
    }),
  ),
  "/부산법인등기": localLen(
    buildBusanCorporateRegistrationPage({
      ...cfg,
      slug: "부산법인등기",
      serviceSlug: "corporate-registration",
    }),
  ),
  "/부산상속등기": localLen(
    buildBusanInheritanceRegistrationPage({
      ...cfg,
      slug: "부산상속등기",
      serviceSlug: "inheritance-registration",
    }),
  ),
  "/부산상속포기": localLen(
    buildBusanInheritanceRenunciationPage({
      ...cfg,
      slug: "부산상속포기",
      serviceSlug: "inheritance-renunciation",
    }),
  ),
  "/부산부동산등기": localLen(
    buildBusanRealEstateRegistrationPage({
      ...cfg,
      slug: "부산부동산등기",
      serviceSlug: "real-estate-registration",
    }),
  ),
  "/부산법인설립등기": localLen(
    buildBusanCompanyEstablishmentPage({
      ...cfg,
      slug: "부산법인설립등기",
      serviceSlug: "company-establishment",
    }),
  ),
  "/부산상속법무사": localLen(keywordTopics["부산상속법무사"]),
  "/부산임원변경등기": localLen(keywordTopics["부산임원변경등기"]),
  "/부산개인회생법무사": stripLen([
    부산개인회생법무사Override.heroParagraphs,
    부산개인회생법무사Override.summaryBullets,
    부산개인회생법무사Override.searchIntents,
    부산개인회생법무사Override.whenNeeded,
    부산개인회생법무사Override.documents,
    부산개인회생법무사Override.procedures,
    부산개인회생법무사Override.commonMistakes,
    부산개인회생법무사Override.faqs,
    부산개인회생법무사Override.bottomCtaText,
    부산개인회생법무사Override.documentsNote,
  ]),
};

console.log(JSON.stringify(rows, null, 2));
