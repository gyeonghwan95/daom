/** 플로팅 CTA·상담 가능 표시 (Asia/Seoul · 평일 09–19시 · 주말 09–14시) */
const CONSULTATION_TZ = "Asia/Seoul";
const OPEN_MINUTES = 9 * 60;
const WEEKDAY_CLOSE_MINUTES = 19 * 60;
const WEEKEND_CLOSE_MINUTES = 14 * 60;

const CLOSED_STATUS_LABEL = "현재 카카오·네이버톡톡만 가능";

export type ConsultationAvailability = {
  isOpen: boolean;
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

function isWeekend(weekday: number): boolean {
  return weekday === 0 || weekday === 6;
}

function isConsultationOpen(weekday: number, minutes: number): boolean {
  if (minutes < OPEN_MINUTES) return false;
  if (isWeekend(weekday)) return minutes < WEEKEND_CLOSE_MINUTES;
  if (weekday >= 1 && weekday <= 5) return minutes < WEEKDAY_CLOSE_MINUTES;
  return false;
}

/** 영업 외 시간 — 전화 가능 시점만 하위 멘트로 안내 */
function getPhoneAvailabilityHint(weekday: number, minutes: number): string {
  if (minutes < OPEN_MINUTES) {
    return "전화상담은 오늘 9시부터 가능";
  }

  if (weekday === 5) {
    return "전화상담은 토요일 9시부터 가능";
  }

  if (weekday === 6) {
    return "전화상담은 일요일 9시부터 가능";
  }

  if (weekday === 0) {
    return "전화상담은 월요일 9시부터 가능";
  }

  return "전화상담은 내일 9시부터 가능";
}

function getClosedAvailability(
  weekday: number,
  minutes: number,
): ConsultationAvailability {
  const phoneHint = getPhoneAvailabilityHint(weekday, minutes);

  return {
    isOpen: false,
    statusLabel: CLOSED_STATUS_LABEL,
    statusHint: `${phoneHint} · 지금 메시지 주시면 확인해 드려요`,
  };
}

export function getConsultationAvailability(
  now: Date = new Date(),
): ConsultationAvailability {
  const { weekday, minutes } = getKoreaClock(now);

  if (isConsultationOpen(weekday, minutes)) {
    return {
      isOpen: true,
      statusLabel: "현재 상담가능",
      statusHint: isWeekend(weekday)
        ? "주말 09:00–14:00 · 지금 바로 연결"
        : "평일 09:00–19:00 · 지금 바로 연결",
    };
  }

  return getClosedAvailability(weekday, minutes);
}
