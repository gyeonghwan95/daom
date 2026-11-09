import { consultationReplySla } from "@/lib/consultation-copy";

/**
 * 플로팅 CTA·상담 가능 표시 — 네이버 플레이스 영업시간과 같게 맞춘다(src/lib/office-location.ts officeHours).
 * Asia/Seoul · 평일 09:00–18:00(점심 휴무 없음) · 토·일 휴무. 공휴일은 달력 자료가 없어 평일로 계산한다.
 */
const CONSULTATION_TZ = "Asia/Seoul";
const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 18 * 60;

const CLOSED_STATUS_LABEL = "현재 카카오톡·네이버톡톡만 가능";

export type ConsultationAvailability = {
  /** 한국 시각 기준 전화 상담 가능 여부 */
  isOpen: boolean;
  /**
   * 클라이언트에서 실제 시각을 반영했는지.
   * false면 SSR/첫 페인트용 중립 상태 — 닫힘·영업중을 단정하지 않는다.
   */
  isResolved: boolean;
  statusLabel: string;
  statusHint: string;
};

type KoreaClock = {
  weekday: number;
  minutes: number;
};

function getKoreaClock(date: Date): KoreaClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CONSULTATION_TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const hour = Number.parseInt(value("hour"), 10) || 0;
  const minute = Number.parseInt(value("minute"), 10) || 0;

  return {
    weekday: weekdayMap[value("weekday")] ?? 0,
    minutes: hour * 60 + minute,
  };
}

function isWeekday(weekday: number): boolean {
  return weekday >= 1 && weekday <= 5;
}

function isConsultationOpen(weekday: number, minutes: number): boolean {
  if (!isWeekday(weekday)) return false;
  if (minutes < OPEN_MINUTES || minutes >= CLOSE_MINUTES) return false;
  return true;
}

/** 영업 외 시간 — 다음 전화 가능 시점만 하위 멘트로 안내 */
function getPhoneAvailabilityHint(weekday: number, minutes: number): string {
  if (isWeekday(weekday) && minutes < OPEN_MINUTES) return "전화상담은 오늘 9시부터 가능";
  // 금요일 영업 종료 후·토·일은 다음 영업일이 월요일
  if (weekday === 5 || weekday === 6 || weekday === 0) return "전화상담은 월요일 9시부터 가능";
  return "전화상담은 내일 9시부터 가능";
}

function getClosedAvailability(
  weekday: number,
  minutes: number,
): ConsultationAvailability {
  const phoneHint = getPhoneAvailabilityHint(weekday, minutes);

  return {
    isOpen: false,
    isResolved: true,
    statusLabel: CLOSED_STATUS_LABEL,
    statusHint: `${phoneHint} · ${consultationReplySla.afterHours}`,
  };
}

export function isConsultationPhoneOffered(isResolved: boolean, isOpen: boolean): boolean {
  return isResolved && isOpen;
}

/**
 * 영업 중이 아니면 전화를 숨기고, 닫힘이면 카카오·톡톡을 앞에 둔다.
 * 시각이 확정되기 전에도 전화를 보여 깜빡이지 않게 한다.
 */
export function orderChannelsForAvailability<T extends { id: string }>(
  channels: T[],
  isOpen: boolean,
  isResolved = true,
): T[] {
  if (!isConsultationPhoneOffered(isResolved, isOpen)) {
    const visible = channels.filter((channel) => channel.id !== "phone");
    if (!isResolved) return visible;

    const rank = (id: string) => {
      if (id === "kakao") return 0;
      if (id === "naver") return 1;
      return 2;
    };
    return [...visible].sort((a, b) => rank(a.id) - rank(b.id));
  }

  return channels;
}

/** 헤더 칩 — 라벨·링크·aria가 같은 규칙을 쓰도록 한곳에서 계산 */
export type HeaderConsultationAction = {
  label: string;
  href: string;
  external: boolean;
  ariaLabel: string;
  visualOpen: boolean;
};

export function getHeaderConsultationAction(input: {
  availability: ConsultationAvailability;
  phone: string;
  kakao: string;
  phoneHref: (phone: string) => string;
  fallbackHref?: string;
}): HeaderConsultationAction {
  const { availability, phone, kakao, phoneHref } = input;
  const fallback = input.fallbackHref ?? "/contact/inquiry";
  const { isOpen, isResolved, statusLabel, statusHint } = availability;

  if (!isResolved) {
    const href = kakao || fallback;
    return {
      label: "상담 안내",
      href,
      external: Boolean(kakao),
      ariaLabel: `${statusLabel} · ${statusHint}`,
      visualOpen: false,
    };
  }

  if (isOpen && phone) {
    return {
      label: "전화 상담",
      href: phoneHref(phone),
      external: false,
      ariaLabel: `${statusLabel} · 전화 상담`,
      visualOpen: true,
    };
  }

  const href = kakao || fallback;
  return {
    label: "톡 상담",
    href,
    external: Boolean(kakao),
    ariaLabel: `${statusLabel} · ${statusHint}`,
    visualOpen: false,
  };
}

export function getConsultationAvailability(
  now: Date = new Date(),
): ConsultationAvailability {
  const { weekday, minutes } = getKoreaClock(now);

  if (isConsultationOpen(weekday, minutes)) {
    return {
      isOpen: true,
      isResolved: true,
      statusLabel: "현재 상담가능",
      statusHint: `평일 09:00–18:00 · ${consultationReplySla.weekday}`,
    };
  }

  return getClosedAvailability(weekday, minutes);
}
