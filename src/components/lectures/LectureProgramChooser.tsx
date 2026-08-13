import Link from "next/link";

type ChooserCard = {
  title: string;
  description: string;
  topics: string;
  href: string;
};

const PROGRAMS: ChooserCard[] = [
  {
    title: "기업 임직원 교육",
    description: "사내특강·직원·신입 온보딩용 계약·채권·법인 기초.",
    topics: "계약 체크 · 미수금 · 등기기한",
    href: "/기업법률교육",
  },
  {
    title: "공공기관·공기업 교육",
    description: "직원·공무원·이용자 대상 생활법률. 법정 지정교육 제외.",
    topics: "생활법률 · 계약 · 전세 예방(선택)",
    href: "/공공기관법률교육",
  },
  {
    title: "워크숍·세미나 특강",
    description: "워크숍(워크샵)과 세미나·초청특강을 한 경로에서 협의.",
    topics: "사례 질문 · 체크리스트 · Q&A",
    href: "/부산법률강사#formats",
  },
  {
    title: "청년·사회초년생 교육",
    description: "주거·금전·직장생활 확인 순서 중심.",
    topics: "전월세 · 계약 · 일상분쟁",
    href: "/청년생활법률특강",
  },
  {
    title: "창업·스타트업 교육",
    description: "예비·초기 창업자 법인·계약 실무.",
    topics: "설립 · 동업 · 거래계약",
    href: "/창업법률교육",
  },
  {
    title: "전세사기 예방교육",
    description: "청년·직원·복지 프로그램용 주거계약 점검.",
    topics: "등기부 · 특약 · 보증금",
    href: "/전세사기예방교육",
  },
];

const AUDIENCES: ChooserCard[] = [
  {
    title: "임직원·관리자",
    description: "업무와 연결되는 계약·증거·법인 기초.",
    topics: "기업교육",
    href: "/기업법률교육",
  },
  {
    title: "신입사원",
    description: "60분 생활·계약 기초 모듈로 줄일 수 있습니다.",
    topics: "온보딩",
    href: "/기업법률교육#faq",
  },
  {
    title: "공공기관 직원·공무원",
    description: "생활법률·예방. 청렴 등 지정교육은 다루지 않습니다.",
    topics: "기관교육",
    href: "/공공기관법률교육",
  },
  {
    title: "청년·사회초년생",
    description: "첫 계약·주거·금전거래.",
    topics: "청년특강",
    href: "/청년생활법률특강",
  },
  {
    title: "창업자",
    description: "설립 전후 서류·계약.",
    topics: "창업교육",
    href: "/창업법률교육",
  },
  {
    title: "기관 종사자·상담사",
    description: "이용자 초기 안내와 전문기관 구분.",
    topics: "복지·자립",
    href: "/부산사회복지기관강사",
  },
];

const FORMATS: ChooserCard[] = [
  {
    title: "특강",
    description: "한 회차 60~120분. 핵심 주제 1~2개와 질의응답.",
    topics: "오리엔테이션·단일 주제",
    href: "/강의시간별구성",
  },
  {
    title: "워크숍 · 워크샵",
    description: "사례 질문·체크리스트·상황판단. 철자만 다른 같은 형식.",
    topics: "참여형 (게임형 퍼실리테이션 아님)",
    href: "/부산법률강사#formats",
  },
  {
    title: "세미나",
    description: "정보전달·전문주제 비중. 질의응답 포함.",
    topics: "초청강연·내부 세미나",
    href: "/부산법률강사#formats",
  },
  {
    title: "직원교육",
    description: "사내·기관 정기/수시 교육. 법정교육 대체 아님.",
    topics: "임직원·신입",
    href: "/기업법률교육",
  },
  {
    title: "주제 아직 미정",
    description: "대상만 정해진 기획 단계. 추천 주제부터.",
    topics: "기획 가이드",
    href: "/기관특강주제추천",
  },
  {
    title: "섭외·출강 문의",
    description: "일정·견적 구간 협의. 단가 단정하지 않습니다.",
    topics: "문의서",
    href: "/강의문의",
  },
];

function CardGrid({
  id,
  title,
  intro,
  items,
}: {
  id: string;
  title: string;
  intro: string;
  items: ChooserCard[];
}) {
  return (
    <section id={id} className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-navy md:text-xl">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-navy/75 md:text-base">
          {intro}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="block rounded-xl border border-navy/10 bg-white p-4 transition hover:border-navy/25 hover:bg-cream/40"
          >
            <p className="font-semibold text-navy">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-navy/75">
              {item.description}
            </p>
            <p className="mt-2 text-xs text-navy/55">{item.topics}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** SSR HTML — JS 없이도 링크·설명이 노출됩니다. */
export function LectureProgramChooser() {
  return (
    <div className="space-y-10">
      <CardGrid
        id="program-intent"
        title="어떤 교육을 준비 중인가요?"
        intro="기업 워크숍이나 공공기관 직원교육에서 생활법률·전세사기 예방 같은 실무형 주제로 외부강사를 찾는 경우, 아래 목적에 가까운 안내를 먼저 보시면 됩니다."
        items={PROGRAMS}
      />
      <CardGrid
        id="audience-intent"
        title="대상이 누구인가요?"
        intro="같은 주제라도 신입·임직원·공무원·청년·창업자에 따라 사례와 시간이 달라집니다."
        items={AUDIENCES}
      />
      <CardGrid
        id="format-intent"
        title="어떤 형태인가요?"
        intro="특강·워크숍(워크샵)·세미나·직원교육은 검색어만 다를 수 있습니다. 과장된 형식 차이는 두지 않고, 실제 가능한 진행만 안내합니다."
        items={FORMATS}
      />
    </div>
  );
}
