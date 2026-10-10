/**
 * 플로팅 CTA·상담 가능 표시 — 네이버 플레이스 영업시간과 같게 맞춘다(src/lib/office-location.ts officeHours).
 * Asia/Seoul · 평일 09:00–12:00, 13:00–18:00 · 토·일 휴무. 공휴일은 달력 자료가 없어 평일로 계산한다.
 */
const CONSULTATION_TZ = "Asia/Seoul";
const OPEN_MINUTES = 9 * 60;
const LUNCH_START_MINUTES = 12 * 60;
const LUNCH_END_MINUTES = 13 * 60;
const CLOSE_MINUTES = 18 * 60;

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

function isWeekday(weekday: number): boolean {
  return weekday >= 1 && weekday <= 5;
}

function isLunchBreak(weekday: number, minutes: number): boolean {
  return isWeekday(weekday) && minutes >= LUNCH_START_MINUTES && minutes < LUNCH_END_MINUTES;
}

function isConsultationOpen(weekday: number, minutes: number): boolean {
  if (!isWeekday(weekday)) return false;
  if (minutes < OPEN_MINUTES || minutes >= CLOSE_MINUTES) return false;
  return !isLunchBreak(weekday, minutes);
}

/** 영업 외 시간 — 다음 전화 가능 시점만 하위 멘트로 안내 */
function getPhoneAvailabilityHint(weekday: number, minutes: number): string {
  if (isLunchBreak(weekday, minutes)) return "전화상담은 13시부터 가능";
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
    statusLabel: isLunchBreak(weekday, minutes) ? "점심시간 · 카카오·네이버톡톡 가능" : CLOSED_STATUS_LABEL,
    statusHint: `${phoneHint} · 지금 메시지 주시면 확인해 드려요`,
  };
}

/** 영업 외에는 카카오·톡톡을 전화보다 앞에 둔다. */
export function orderChannelsForAvailability<T extends { id: string }>(
  channels: T[],
  isOpen: boolean,
): T[] {
  if (isOpen) return channels;
  const rank = (id: string) => {
    if (id === "kakao") return 0;
    if (id === "naver") return 1;
    if (id === "phone") return 2;
    return 3;
  };
  return [...channels].sort((a, b) => rank(a.id) - rank(b.id));
}

export function getConsultationAvailability(
  now: Date = new Date(),
): ConsultationAvailability {
  const { weekday, minutes } = getKoreaClock(now);

  if (isConsultationOpen(weekday, minutes)) {
    return {
      isOpen: true,
      statusLabel: "현재 상담가능",
      statusHint: "평일 09:00–18:00 · 지금 바로 연결",
    };
  }

  return getClosedAvailability(weekday, minutes);
}
