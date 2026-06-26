/** 플로팅 CTA·상담 가능 표시 (Asia/Seoul · 평일 09–19시 · 주말 09–14시) */
const CONSULTATION_TZ = "Asia/Seoul";
const OPEN_MINUTES = 9 * 60;
const WEEKDAY_CLOSE_MINUTES = 19 * 60;
const WEEKEND_CLOSE_MINUTES = 14 * 60;

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

function getClosedAvailability(
  weekday: number,
  minutes: number,
): ConsultationAvailability {
  const hint = "지금 문의하시면 영업 시간에 순서대로 확인해 드려요";

  if (minutes < OPEN_MINUTES) {
    return {
      isOpen: false,
      statusLabel: "오전 9시부터 답변",
      statusHint: "남겨주신 문의는 영업 시작 후 확인해 드립니다",
    };
  }

  if (weekday === 5) {
    return {
      isOpen: false,
      statusLabel: "토요일 9시부터 답변",
      statusHint: hint,
    };
  }

  if (weekday === 6) {
    return {
      isOpen: false,
      statusLabel: "일요일 9시부터 답변",
      statusHint: hint,
    };
  }

  if (weekday === 0) {
    return {
      isOpen: false,
      statusLabel: "월요일 9시에 확인",
      statusHint: hint,
    };
  }

  return {
    isOpen: false,
    statusLabel: "내일 9시부터 답변",
    statusHint: hint,
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
