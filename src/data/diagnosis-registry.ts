import { diagnosisHub, toPageConfig, type Diagnosis, type DiagnosisPageConfig } from "./diagnosis";
import { enrichDiagnosisWithSeo } from "./diagnosis-seo";
import { inheritanceRegistrationDiagnosis } from "./diagnosis-pages/inheritance-registration";
import { inheritanceRenunciationDiagnosis } from "./diagnosis-pages/inheritance-renunciation";
import { qualifiedAcceptanceDiagnosis } from "./diagnosis-pages/qualified-acceptance";
import { corporateRegistrationDiagnosis } from "./diagnosis-pages/corporate-registration";
import { directorChangeDiagnosis } from "./diagnosis-pages/director-change";
import {
  realEstateRegistrationDiagnosis,
  ownershipTransferDiagnosis,
} from "./diagnosis-pages/real-estate";
import {
  personalRehabilitationDiagnosis,
  personalBankruptcyDiagnosis,
} from "./diagnosis-pages/rehab-bankruptcy";
import {
  jeonseDepositDiagnosis,
  leaseRegistrationOrderDiagnosis,
} from "./diagnosis-pages/jeonse";
import {
  paymentOrderDiagnosis,
  certifiedMailDiagnosis,
} from "./diagnosis-pages/civil";
import {
  companyEstablishmentDiagnosis,
  depositDiagnosis,
  adultGuardianshipDiagnosis,
  specialRepresentativeDiagnosis,
  shipRegistrationDiagnosis,
} from "./diagnosis-pages/others";

const rawDiagnosisTopicPages: Diagnosis[] = [
  inheritanceRegistrationDiagnosis,
  inheritanceRenunciationDiagnosis,
  qualifiedAcceptanceDiagnosis,
  corporateRegistrationDiagnosis,
  companyEstablishmentDiagnosis,
  directorChangeDiagnosis,
  realEstateRegistrationDiagnosis,
  ownershipTransferDiagnosis,
  personalRehabilitationDiagnosis,
  personalBankruptcyDiagnosis,
  jeonseDepositDiagnosis,
  leaseRegistrationOrderDiagnosis,
  paymentOrderDiagnosis,
  certifiedMailDiagnosis,
  depositDiagnosis,
  adultGuardianshipDiagnosis,
  specialRepresentativeDiagnosis,
  shipRegistrationDiagnosis,
];

export const diagnosisTopicPages: Diagnosis[] =
  rawDiagnosisTopicPages.map(enrichDiagnosisWithSeo);

export const enrichedDiagnosisHub = enrichDiagnosisWithSeo(diagnosisHub);

export const allDiagnoses: Diagnosis[] = [
  enrichedDiagnosisHub,
  ...diagnosisTopicPages,
];

export const diagnosisHubPage = toPageConfig(enrichedDiagnosisHub);
export const allDiagnosisPages: DiagnosisPageConfig[] = allDiagnoses.map(toPageConfig);

export function getRawDiagnosisBySlug(slug: string): Diagnosis | undefined {
  const normalized = slug.normalize("NFC");
  return allDiagnoses.find((item) => item.slug === normalized);
}

export function getDiagnosisBySlug(slug: string): DiagnosisPageConfig | undefined {
  const normalized = slug.normalize("NFC");
  const found = allDiagnoses.find((item) => item.slug === normalized);
  return found ? toPageConfig(found) : undefined;
}

export function getDiagnosisById(id: string): Diagnosis | undefined {
  return allDiagnoses.find((item) => item.id === id);
}

export function getAllDiagnosisSlugs(): string[] {
  return allDiagnoses.map((item) => item.slug);
}

export function getDiagnosisTopicPages(): DiagnosisPageConfig[] {
  return diagnosisTopicPages.map(toPageConfig);
}
