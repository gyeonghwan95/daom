/**
 * PDF 공식 프로필(2026.07.17 기준)과 맞춘 검증 실적 표.
 * 휴대폰·생년월일 등 비공개 개인정보는 포함하지 않습니다.
 * 강의일자는 이벤트 일자(블로그 게시일과 다를 수 있음).
 */

export type TrackRecordCommittee = {
  period: string;
  title: string;
  organization: string;
  status: "활동중" | "완료";
};

export type TrackRecordActivity = {
  date: string;
  title: string;
  organization: string;
  kind: "강의" | "상담" | "자문" | "협력" | "언론" | "학술" | "기타";
};

/** 위원회 참여현황 — PDF 기간 그대로 */
export const trackRecordCommittees: TrackRecordCommittee[] = [
  {
    period: "2026.06 ~ 2027.06",
    title: "1기 청년자문단 자문위원",
    organization: "기획예산처",
    status: "활동중",
  },
  {
    period: "2026.04 ~ 2028.04",
    title: "전문가 자문위원",
    organization: "부산광역시 청년정책조정위원회",
    status: "활동중",
  },
  {
    period: "2025.10 ~ 2027.10",
    title: "자문위원",
    organization: "해운대구구정 정책자문위원회",
    status: "활동중",
  },
  {
    period: "2025.11 ~ 2027.11",
    title: "자문위원",
    organization: "민주평화통일자문회의",
    status: "활동중",
  },
  {
    period: "2025.10",
    title: "시민배심원",
    organization: "부산시민배심원단",
    status: "완료",
  },
];

/**
 * 강의·기타 활동 — 최신순.
 * 방문자가 기관·날짜를 바로 확인할 수 있도록 PDF 표 형식을 유지합니다.
 */
export const trackRecordActivities: TrackRecordActivity[] = [
  {
    date: "2025.08 ~",
    title: "부산지방법원 동부지원 무료법률상담",
    organization: "부산지방법무사협회",
    kind: "상담",
  },
  {
    date: "2026.07.24",
    title: "일상분쟁 생존법 특강",
    organization: "부산광역시 자립지원전담기관",
    kind: "강의",
  },
  {
    date: "2026.07.16",
    title: "창업법률 특강",
    organization: "해운대청년채움공간",
    kind: "강의",
  },
  {
    date: "2026.07.02",
    title: "청년이 꼭 알아야 할 생활법률 특강",
    organization: "창원청년비전센터",
    kind: "강의",
  },
  {
    date: "2026.06.25",
    title: "기획예산처 청년자문단 위촉식(장관 임명)",
    organization: "정부세종청사",
    kind: "자문",
  },
  {
    date: "2026.06.24",
    title: "고유가 피해지원금 제도 전문가 촬영",
    organization: "부산 MBC NEWS",
    kind: "언론",
  },
  {
    date: "2026.06.11",
    title: "명예훼손·모욕죄부터 개인정보 보호 특강",
    organization: "부산광역시립시민도서관",
    kind: "강의",
  },
  {
    date: "2026.06.04",
    title: "혹시 나도 전과자? 생활 속 법률 특강",
    organization: "부산광역시립시민도서관",
    kind: "강의",
  },
  {
    date: "2026.05.22",
    title: "전세사기 예방 법률 특강",
    organization: "부산광역시 자립지원전담기관",
    kind: "강의",
  },
  {
    date: "2026.05.21",
    title: "전문가 진로 특강",
    organization: "양산제일고등학교",
    kind: "강의",
  },
  {
    date: "2026.05.21",
    title: "생활 속 분쟁과 법의 역할 법률 특강",
    organization: "부산광역시립시민도서관",
    kind: "강의",
  },
  {
    date: "2026.05.12",
    title: "전·월세계약의 모든 것 법률 특강",
    organization: "부산광역시립시민도서관",
    kind: "강의",
  },
  {
    date: "2026.01.27",
    title: "일상분쟁 생존법 법률 특강",
    organization: "부산청년 JOB카페",
    kind: "강의",
  },
  {
    date: "2026.01.20",
    title: "전세사기 예방접종 법률 특강",
    organization: "부산청년 JOB카페",
    kind: "강의",
  },
  {
    date: "2025.09.22",
    title: "전세사기 예방 법률 특강",
    organization: "부산청년 JOB카페",
    kind: "강의",
  },
  {
    date: "2025.08.27",
    title: "전세사기 예방 법률 특강",
    organization: "부산청년 JOB카페",
    kind: "강의",
  },
  {
    date: "2025.08.26",
    title: "디지털 법률 가이드 특강",
    organization: "해운대청년채움공간",
    kind: "강의",
  },
  {
    date: "2025.07 ~ 09",
    title: "법률 자문",
    organization: "부산창조경제혁신센터",
    kind: "자문",
  },
  {
    date: "2025.07.29",
    title: "혹시 나도 전과자 오프라인 법률 강의",
    organization: "해운대청년채움공간",
    kind: "강의",
  },
  {
    date: "2025.07.23",
    title: "법 없이도 살 수 없어요 오프라인 법률 강의",
    organization: "해운대청년채움공간",
    kind: "강의",
  },
  {
    date: "2025.07.02",
    title: "나가사키법무사회 협약 행사 일본어 통역·사회",
    organization: "부산지방법무사회",
    kind: "협력",
  },
  {
    date: "2025.06.30",
    title: "주거계약 실전가이드 오프라인 법률 강의",
    organization: "해운대청년채움공간",
    kind: "강의",
  },
  {
    date: "2025.06.26",
    title: "법률 지원 협약(MOU)",
    organization: "명례일반산업단지",
    kind: "협력",
  },
  {
    date: "2025.06.04",
    title: "법무사 모의고사 첨삭",
    organization: "박문각",
    kind: "기타",
  },
  {
    date: "2025.05.16 ~",
    title: "민사소송 및 민사집행학술회 소속 활동",
    organization: "제30기 법무사 동기회",
    kind: "학술",
  },
  {
    date: "2025.03.29",
    title: "부산 대표 합격 인터뷰 유튜브 촬영",
    organization: "박문각",
    kind: "언론",
  },
];

export function getFeaturedTrackRecordActivities(limit = 12): TrackRecordActivity[] {
  return trackRecordActivities.slice(0, limit);
}
