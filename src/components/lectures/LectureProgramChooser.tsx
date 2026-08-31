import Link from "next/link";

type ChooserCard = {
  title: string;
  description: string;
  topics: string;
  href: string;
};

const PROGRAMS: ChooserCard[] = [
  {
    title: "전세사기 예방교육",
    description: "계약 전 확인부터 보증금 보호까지.",
    topics: "등기부 · 특약 · 확정일자",
    href: "/전세사기예방교육",
  },
  {
    title: "생활법률 특강",
    description: "시민·평생학습용 계약·주거·생활분쟁.",
    topics: "도서관 · 시민강좌",
    href: "/부산도서관법률특강",
  },
  {
    title: "청년 법률교육",
    description: "주거·계약·금전·온라인 분쟁 예방.",
    topics: "청년기관 · 자립 프로그램",
    href: "/청년생활법률특강",
  },
  {
    title: "창업 법률교육",
    description: "법인설립·계약·지분·기한 리스크.",
    topics: "예비창업자 · 창업지원",
    href: "/창업법률교육",
  },
  {
    title: "기업 법률교육",
    description: "임직원 계약·채권·개인정보 기초.",
    topics: "사내특강 · 직원교육",
    href: "/기업법률교육",
  },
  {
    title: "학교·진로특강",
    description: "생활법률과 법무사 직업·진로 이야기.",
    topics: "학교 · 대학",
    href: "/학교법률교육",
  },
];

const VENUES: ChooserCard[] = [
  {
    title: "공공기관",
    description: "직원·이용자 생활법률. 법정 지정교육은 제외합니다.",
    topics: "공공 · 공기업",
    href: "/공공기관법률교육",
  },
  {
    title: "기업",
    description: "임직원·신입 대상 계약·채권 실무 기초.",
    topics: "사내교육",
    href: "/기업법률교육",
  },
  {
    title: "도서관·평생학습",
    description: "시민 생활법률 1회 특강·연속과정.",
    topics: "시립·구립 도서관",
    href: "/부산도서관법률특강",
  },
  {
    title: "청년기관",
    description: "주거·계약·금전·자립 프로그램.",
    topics: "청년센터 · 채움공간",
    href: "/청년생활법률특강",
  },
  {
    title: "사회복지기관",
    description: "종사자·이용자 초기 안내와 예방교육.",
    topics: "복지관 · 자립지원",
    href: "/부산사회복지기관강사",
  },
  {
    title: "학교·대학",
    description: "연령에 맞춘 생활법률·진로 특강.",
    topics: "고교 · 대학",
    href: "/학교법률교육",
  },
  {
    title: "협회·단체",
    description: "회원·종사자 맞춤 1회 특강.",
    topics: "협회 · 비영리",
    href: "/부산기관법률특강",
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
        title="어떤 교육을 찾고 계신가요?"
        intro="담당자가 준비 중인 주제에 가까운 안내를 먼저 고르시면 됩니다. 마케팅·리더십·AI처럼 법무사 업무 밖의 주제는 다루지 않습니다."
        items={PROGRAMS}
      />
      <CardGrid
        id="venue-intent"
        title="어디에서 진행하시나요?"
        intro="같은 주제라도 공공기관·기업·도서관·청년·복지·학교·협회에 따라 사례와 시간이 달라집니다."
        items={VENUES}
      />
    </div>
  );
}
