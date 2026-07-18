import type { B2BPageContent } from "./types";
import { brokerCollabPageContent } from "./pages/broker";
import { delegationPageContent } from "./pages/delegation";
import { inquiryPageContent } from "./pages/inquiry";
import { partnersPageContent } from "./pages/partners";
import { realEstateDelegationPageContent } from "./pages/부산부동산등기복대리";
import { corporateDelegationPageContent } from "./pages/부산법인등기복대리";
import { receiptCollabPageContent } from "./pages/부산등기접수협업";
import { correctionWorkPageContent } from "./pages/부산등기보정업무";
import { registryOfficeLocalPageContent } from "./pages/부산등기소현지업무";
import { remoteCollabPageContent } from "./pages/부산원거리등기협업";
import { balanceCollabPageContent } from "./pages/부산잔금등기협업";
import { architectCollabPageContent } from "./pages/부산건축사등기협업";
import { developerRegistryPageContent } from "./pages/부산시행사등기";
import { builderRegistryPageContent } from "./pages/부산건설사등기";
import { saleRegistryPageContent } from "./pages/부산분양등기";
import { corporateOutsourcingPageContent } from "./pages/부산법인등기아웃소싱";

const bySlug: Record<string, B2BPageContent> = {
  [partnersPageContent.slug]: partnersPageContent,
  [delegationPageContent.slug]: delegationPageContent,
  [brokerCollabPageContent.slug]: brokerCollabPageContent,
  [inquiryPageContent.slug]: inquiryPageContent,
  [realEstateDelegationPageContent.slug]: realEstateDelegationPageContent,
  [corporateDelegationPageContent.slug]: corporateDelegationPageContent,
  [receiptCollabPageContent.slug]: receiptCollabPageContent,
  [correctionWorkPageContent.slug]: correctionWorkPageContent,
  [registryOfficeLocalPageContent.slug]: registryOfficeLocalPageContent,
  [remoteCollabPageContent.slug]: remoteCollabPageContent,
  [balanceCollabPageContent.slug]: balanceCollabPageContent,
  [architectCollabPageContent.slug]: architectCollabPageContent,
  [developerRegistryPageContent.slug]: developerRegistryPageContent,
  [builderRegistryPageContent.slug]: builderRegistryPageContent,
  [saleRegistryPageContent.slug]: saleRegistryPageContent,
  [corporateOutsourcingPageContent.slug]: corporateOutsourcingPageContent,
};

export const B2B_PAGE_SLUGS = Object.keys(bySlug);

export function getB2BPageContent(slug: string): B2BPageContent | undefined {
  return bySlug[slug];
}

export function getAllB2BPageContents(): B2BPageContent[] {
  return Object.values(bySlug);
}

export {
  PARTNER_CARDS,
  ENGAGEMENT_CARDS,
  COLLABORATION_PRINCIPLES,
  PROJECT_PROCESS_STEPS,
  VERIFIED_TRUST_ITEMS,
  PARTNER_OPTIONS,
  SERVICE_OPTIONS,
  SIZE_BAND_OPTIONS,
  PREP_STAGE_OPTIONS,
  B2B_PATHS,
  isB2BPath,
  buildInquiryHref,
  partnerLabel,
  serviceLabel,
} from "./options";

export type * from "./types";
