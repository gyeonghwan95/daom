import { getAllContent } from "@/lib/content/loader";
import { getNaverPlaceReviewsFeed } from "@/lib/naver-place-reviews";
import { officeLocation } from "@/lib/office-location";
import { getAllPressArticles, getPressArticleHref } from "@/lib/press-articles";
import {
  getLawyerAppointments,
  getLawyerAwards,
  getLawyerQualifications,
  lawyerActivities,
  lawyerProfileMeta,
} from "@/lib/lawyer-profile";
import { buildLectureTrackRecordSummary } from "@/lib/lectures/history-helpers";
import { encodePublicSrc } from "@/lib/encode-public-src";
import { imagePaths } from "@/lib/site-images";

export type AboutHeroSlide = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
};

export type AboutProofItem = {
  value: string;
  label: string;
  hint: string;
};

export type AboutApproachItem = {
  title: string;
  body: string;
};

export type AboutPracticeItem = {
  title: string;
  body: string;
  href: string;
};

export type AboutProcessStep = {
  step: string;
  title: string;
  body: string;
};

export type AboutJumpLink = {
  href: string;
  label: string;
};

export type AboutAppeal = {
  name: string;
  role: string;
  officeName: string;
  locationShort: string;
  accessSummary: string;
  visitNotice: string;
  proof: AboutProofItem[];
  process: AboutProcessStep[];
  approach: AboutApproachItem[];
  practice: AboutPracticeItem[];
  jumps: AboutJumpLink[];
  pressQuote: { quote: string; source: string; href: string } | null;
  awardLine: string | null;
  appointmentTitles: string[];
  civicLines: string[];
  lectureLine: string;
};

function compactDate(value: string): string {
  return value.replace(/-/g, ".");
}

function toHeroSlide(
  src: string,
  caption: string,
  objectPosition?: string,
): AboutHeroSlide {
  return {
    src: encodePublicSrc(src),
    alt: caption,
    caption,
    objectPosition,
  };
}

export type AboutHeroSlideRows = {
  representative: AboutHeroSlide[];
  appeal: AboutHeroSlide[];
};

/**
 * 위줄: 대표 법무사·사무소·실무 사진 12~15장.
 * 아래줄: 강의·언론·공공활동 등 어필 사진 12~15장.
 * 원본 사진을 수정하지 않고 경로만 모은다.
 */
export function getAboutHeroSlides(): AboutHeroSlideRows {
  const representative = [
    toHeroSlide(imagePaths.thumbPortraitFront, "안윤정 법무사", "50% 28%"),
    toHeroSlide(imagePaths.homeTrust, "대표 프로필"),
    toHeroSlide(imagePaths.officeExterior, "해운대 센텀 사무소"),
    toHeroSlide(imagePaths.officeNameplateHorizontal, "다옴법무사사무소 현판"),
    toHeroSlide(imagePaths.officeNameBadge, "안윤정 법무사 명패"),
    toHeroSlide(imagePaths.officeInterior, "사무소 내부"),
    toHeroSlide(imagePaths.activityBarAssociationAward, "대한법무사협회장 표창"),
    toHeroSlide(imagePaths.appointmentCertificate, "위원 위촉장"),
    toHeroSlide(imagePaths.contactConsultationHero, "직접 상담"),
    toHeroSlide(imagePaths.officeOnPhone, "전화 상담"),
    toHeroSlide(imagePaths.stockLegalOffice, "사무실 실무"),
    toHeroSlide(imagePaths.thumbDocumentReview, "서류 검토"),
    toHeroSlide(imagePaths.stockLegalConsultation, "상담 협의"),
    toHeroSlide(imagePaths.thumbRegistryOffice, "등기국 현장"),
    toHeroSlide(imagePaths.stockLegalContract, "계약·법인 실무"),
  ];

  const appeal = [
    toHeroSlide(imagePaths.activityYouthBudgetUnboxing, "청년예산 언박싱 2027"),
    toHeroSlide(imagePaths.activityYouthBudgetUnboxing2, "청년예산 질의"),
    toHeroSlide(imagePaths.activityMou, "명례일반산업단지 법률지원"),
    toHeroSlide(imagePaths.activityLhCollab, "LH·부산창경 협업"),
    toHeroSlide(imagePaths.activityNagasaki, "나가사키 사법서사회 자매결연"),
    toHeroSlide(imagePaths.activityYouthSpace, "해운대청년채움공간 강의"),
    toHeroSlide(imagePaths.activityBusanYouthPolicy, "부산 청년정책조정위원회"),
    toHeroSlide(imagePaths.activityHaeundaePolicy, "해운대구 정책자문"),
    toHeroSlide(imagePaths.activityPeaceUnification, "민주평화통일자문회의"),
    toHeroSlide(imagePaths.activityCitizenJury, "부산시민배심원단"),
    toHeroSlide(imagePaths.pressWeeklyPeople20260804, "주간인물 소개"),
    toHeroSlide(imagePaths.pressViva100HaeundaeYouthSpace, "브릿지경제 보도"),
    toHeroSlide(imagePaths.activityTrendHotIssue, "서울경제TV 출연"),
    toHeroSlide(imagePaths.pressMbcInterview, "부산 MBC NEWS 출연"),
    toHeroSlide(imagePaths.lectureCitizenLibraryWeek1, "시민도서관 생활법률 특강"),
  ];

  return { representative, appeal };
}

export function getAboutAppeal(): AboutAppeal {
  const qualifications = getLawyerQualifications();
  const nationalCount = qualifications.filter((item) => item.category === "국가자격").length;
  const accreditedCount = qualifications.filter(
    (item) => item.category === "국가공인 민간자격",
  ).length;
  const awards = getLawyerAwards();
  const appointments = getLawyerAppointments();
  const lectures = buildLectureTrackRecordSummary();
  const press = getAllPressArticles();
  const cases = getAllContent("cases").filter((item) => item.slug.endsWith("-case"));
  const reviews = getNaverPlaceReviewsFeed();
  const civic = lawyerActivities.filter((item) => item.category === "시민 참여");

  const proof: AboutProofItem[] = [
    {
      value: String(nationalCount + accreditedCount),
      label: "검증된 자격",
      hint: `국가자격 ${nationalCount} · 국가공인 ${accreditedCount}`,
    },
  ];

  if (awards[0]) {
    proof.push({
      value: (awards[0].year ?? "").slice(0, 4) || "표창",
      label: "협회장 표창",
      hint: "대한법무사협회",
    });
  }

  proof.push({
    value: `${lectures.lectureCount}회`,
    label: "현장 강의",
    hint: `${lectures.institutionCount}곳`,
  });

  proof.push({
    value: `${appointments.length}건`,
    label: "공공 위촉",
    hint: "청년·구정·민주평통",
  });

  if (press.length > 0) {
    proof.push({
      value: `${press.length}건`,
      label: "언론 소개",
      hint: "보도·방송",
    });
  } else if (reviews.stats.totalCount > 0) {
    proof.push({
      value: `${reviews.stats.totalCount}건`,
      label: "네이버 후기",
      hint: "스마트플레이스 공개 후기",
    });
  } else if (cases.length > 0) {
    proof.push({
      value: `${cases.length}건`,
      label: "공개 사례",
      hint: "홈페이지에 정리한 실제 진행",
    });
  }

  const weeklyPeople = press.find((item) => item.source.includes("주간인물"));

  return {
    name: lawyerProfileMeta.fullTitle,
    role: lawyerProfileMeta.jobTitle,
    officeName: lawyerProfileMeta.organization,
    locationShort: officeLocation.areaLabel,
    accessSummary: officeLocation.accessSummary,
    visitNotice: officeLocation.visitNotice,
    proof,
    process: [
      {
        step: "01",
        title: "상황만 말씀해 주세요",
        body: "서류가 없어도 됩니다. 지금 벌어진 일과 알고 있는 날짜만 있으면 상담을 시작할 수 있습니다.",
      },
      {
        step: "02",
        title: "기한·절차·비용을 나눕니다",
        body: "당장 넣어야 하는 신청과 나중에 해도 되는 일을 구분하고, 범위가 잡힌 뒤 항목별로 비용을 안내합니다.",
      },
      {
        step: "03",
        title: "맡기시면 직접 진행합니다",
        body: "접수만 받고 넘기지 않습니다. 서류 구성부터 등기·신청 제출까지 대표 법무사가 이어서 처리합니다.",
      },
    ],
    approach: [
      {
        title: "상담부터 신청까지 직접",
        body: "창구만 두고 실무를 넘기지 않습니다. 상황 정리, 서류 구성, 등기·신청 제출까지 대표 법무사가 같은 사건으로 이어 갑니다.",
      },
      {
        title: "기한과 비용부터 구분",
        body: "상속 신고 기한, 등기 순서, 회생 신청 시점처럼 지금 해야 할 일과 미뤄도 되는 일을 먼저 가릅니다. 견적은 범위가 잡힌 뒤에 안내합니다.",
      },
      {
        title: "서류가 없어도 시작할 수 있음",
        body: "가족관계증명서나 등기부등본이 없어도 상황만 있으면 상담이 됩니다. 필요한 서류는 이후 단계에서 맞춰 안내합니다.",
      },
      {
        title: "부동산·신용 자격으로 교차 확인",
        body: "법무사 자격과 함께 공인중개사·신용관리사 자격으로 등기, 거래, 채무 구조를 같은 사건 안에서 맞춰 봅니다.",
      },
      {
        title: "해운대 센텀에서 전국 접수",
        body: `${officeLocation.subway}에 사무실이 있습니다. 방문은 예약제이고, 전국 문의는 전화·톡·폼으로 이어서 받습니다.`,
      },
      {
        title: "소송대리는 하지 않음",
        body: "민사집행·등기·신청은 법무사 업무로 진행합니다. 소송대리와 형사변론이 필요하면 변호사 의뢰가 맞다는 점을 먼저 말씀드립니다.",
      },
    ],
    practice: [
      {
        title: "상속등기",
        body: "상속인 특정부터 이전등기 접수까지",
        href: "/부산상속등기",
      },
      {
        title: "상속포기",
        body: "3개월 기한과 관할을 맞춰 가정법원 신고",
        href: "/부산상속포기",
      },
      {
        title: "한정승인",
        body: "재산과 빚을 나눠 본 뒤 범위 내 승인",
        href: "/부산한정승인",
      },
      {
        title: "부동산등기",
        body: "매매·증여·이전 등기 서류와 접수",
        href: "/부산부동산등기",
      },
      {
        title: "법인설립",
        body: "상호·목적·자본금 구성부터 설립등기",
        href: "/부산법인설립등기",
      },
      {
        title: "법인등기",
        body: "임원변경, 본점이전, 목적변경",
        href: "/부산법인등기",
      },
      {
        title: "개인회생",
        body: "변제계획과 인가까지 이어지는 신청",
        href: "/부산개인회생",
      },
      {
        title: "개인파산",
        body: "면책 취지에 맞는 파산 신청 구성",
        href: "/부산개인파산",
      },
    ],
    jumps: [
      { href: "#approach", label: "맡기는 이유" },
      { href: "#practice", label: "업무" },
      { href: "#at-a-glance", label: "한눈에" },
      { href: "#qualifications", label: "자격" },
      { href: "#track-record", label: "이력" },
      { href: "#consultation", label: "상담" },
    ],
    pressQuote: weeklyPeople
      ? {
          quote: "지역 법조계에 활력이 되는 청년 법무사",
          source: weeklyPeople.source,
          href: getPressArticleHref(weeklyPeople.slug),
        }
      : null,
    awardLine: awards[0]
      ? `${awards[0].name} · ${compactDate(awards[0].year ?? "")}`
      : null,
    appointmentTitles: appointments.map((item) => item.title),
    civicLines: civic.map((item) => item.title),
    lectureLine: `${lectures.lectureCount}회 · ${lectures.institutionCount}곳 · ${lectures.topicCount}개 주제`,
  };
}
