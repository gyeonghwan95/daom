import type { Diagnosis } from "../diagnosis";
import { applyDiagnosisSeo } from "./enrich";
import {
  inheritanceRegistrationSeo,
  inheritanceRenunciationSeo,
  qualifiedAcceptanceSeo,
} from "./inheritance";
import {
  corporateRegistrationSeo,
  directorChangeSeo,
} from "./corporate";
import {
  realEstateRegistrationSeo,
  ownershipTransferSeo,
} from "./real-estate";
import {
  personalRehabilitationSeo,
  personalBankruptcySeo,
} from "./rehab";
import {
  jeonseDepositSeo,
  leaseRegistrationOrderSeo,
} from "./jeonse";
import {
  paymentOrderSeo,
  certifiedMailSeo,
} from "./civil";
import {
  adultGuardianshipSeo,
  companyEstablishmentSeo,
  depositSeo,
  diagnosisHubSeo,
  shipRegistrationSeo,
  specialRepresentativeSeo,
} from "./others";
import type { DiagnosisSeoPack } from "./types";

const SEO_BY_SLUG: Record<string, DiagnosisSeoPack> = {
  자가진단: diagnosisHubSeo,
  상속등기자가진단: inheritanceRegistrationSeo,
  상속포기자가진단: inheritanceRenunciationSeo,
  한정승인자가진단: qualifiedAcceptanceSeo,
  법인등기자가진단: corporateRegistrationSeo,
  임원변경등기자가진단: directorChangeSeo,
  부동산등기자가진단: realEstateRegistrationSeo,
  소유권이전등기자가진단: ownershipTransferSeo,
  개인회생자가진단: personalRehabilitationSeo,
  개인파산자가진단: personalBankruptcySeo,
  전세보증금자가진단: jeonseDepositSeo,
  임차권등기명령자가진단: leaseRegistrationOrderSeo,
  지급명령자가진단: paymentOrderSeo,
  내용증명자가진단: certifiedMailSeo,
  법인설립자가진단: companyEstablishmentSeo,
  공탁자가진단: depositSeo,
  성년후견자가진단: adultGuardianshipSeo,
  특별대리인자가진단: specialRepresentativeSeo,
  선박등기자가진단: shipRegistrationSeo,
};

const FLAGSHIP_SLUGS = new Set([
  "상속등기자가진단",
  "상속포기자가진단",
  "한정승인자가진단",
  "법인등기자가진단",
  "부동산등기자가진단",
]);

const BODY_FILLER: string[] = [
  "본 안내는 일반적인 정보이며, 개별 사건은 등기부·계약서·가족관계증명서·법원 서류를 확인한 뒤 절차·비용·기한이 확정됩니다. 가능·불가능을 단정하지 않습니다.",
  "부산·해운대·센텀·재송동·반여동에서 방문·전화·카카오톡·네이버 톡톡 상담이 가능합니다. 서류를 미리 보내주시면 상담 시간을 줄일 수 있습니다.",
  "기한이 있는 사건은 지연 시 과태료·권리 제한·추가 비용이 생길 수 있어, 자가진단 결과와 관계없이 서류로 기한을 한 번 더 확인하는 것이 좋습니다.",
  "자가진단 결과가 사전 정보 확인이어도, 상속·법인·부동산·회생·임대차 사건은 서류 한두 가지에 따라 순서가 달라질 수 있습니다.",
  "상담 시 법무사 수임료와 등록세·인지대·송달료 등 공과금을 구분해 안내하며, 사건 복잡도에 따라 달라질 수 있습니다.",
  "관할 등기소·법원은 주소지·부동산 소재지·사건 연결지 기준으로 정해지므로, 관할 착오가 없도록 먼저 확인합니다.",
];

function countBodyChars(diagnosis: Diagnosis): number {
  const parts = [
    ...(diagnosis.intro ?? []),
    ...(diagnosis.resultExplanation ?? []),
    ...(diagnosis.conceptParagraphs ?? []),
    ...(diagnosis.busanConsultationTypes ?? diagnosis.targetUsers ?? []),
    ...(diagnosis.requiredDocuments ?? []),
    ...(diagnosis.processSteps ?? []),
    ...(diagnosis.costFactors ?? []),
    ...(diagnosis.deadlineWarnings ?? []),
    diagnosis.caseExample?.title,
    diagnosis.caseExample?.body,
    ...(diagnosis.faqs ?? []).flatMap((f) => [f.question, f.answer]),
  ];
  return parts.join("").length;
}

function ensureMinBodyChars(diagnosis: Diagnosis, min = 2000): Diagnosis {
  let current = diagnosis;
  let fillerIndex = 0;
  while (countBodyChars(current) < min && fillerIndex < 20) {
    current = {
      ...current,
      conceptParagraphs: [
        ...(current.conceptParagraphs ?? []),
        BODY_FILLER[fillerIndex % BODY_FILLER.length],
      ],
    };
    fillerIndex += 1;
  }
  return current;
}

function minBodyCharsFor(diagnosis: Diagnosis): number {
  return FLAGSHIP_SLUGS.has(diagnosis.slug) ? 3000 : 2000;
}

export function enrichDiagnosisWithSeo(diagnosis: Diagnosis): Diagnosis {
  const minChars = minBodyCharsFor(diagnosis);
  const pack = SEO_BY_SLUG[diagnosis.slug];
  if (!pack) {
    return ensureMinBodyChars(
      {
        ...diagnosis,
        resultExplanation: diagnosis.resultExplanation ?? [
          "자가진단 결과는 사전 정보 확인·검토 필요·상담 권장·긴급 확인 필요 네 단계로 안내됩니다.",
        ],
        conceptParagraphs: diagnosis.conceptParagraphs ?? diagnosis.intro,
        busanConsultationTypes:
          diagnosis.busanConsultationTypes ?? diagnosis.targetUsers,
      },
      minChars,
    );
  }
  return ensureMinBodyChars(applyDiagnosisSeo(diagnosis, pack), minChars);
}
