import type { GlossaryHubConfig } from "./types";

export const glossaryHub: GlossaryHubConfig = {
  slug: "glossary",
  path: "/glossary",
  h1: "등기·신청에서 자주 확인하는 용어",
  intro:
    "상속등기, 임원변경, 임차권등기명령처럼 업무 중에 마주치는 용어를 짧게 풀어 두었습니다. 신청·등기의 대표 안내는 각 업무 페이지에 있습니다. 상황을 먼저 고르고 싶다면 상황별 안내를 보세요.",
  metaDescriptionBase:
    "등기·법원 신청에서 자주 나오는 용어를 짧게 확인합니다. 각 용어는 해당 업무 안내 페이지로 이어집니다.",
  faqs: [
    {
      question: "이 페이지와 업무 안내는 무엇이 다른가요?",
      answer:
        "여기는 용어를 빠르게 구분하는 목록입니다. 신청·등기 절차의 대표 페이지는 각 업무 URL입니다.",
    },
    {
      question: "지금 할 일을 상황으로 찾고 싶습니다.",
      answer:
        "상황별 안내(/situations)에서 고른 뒤, 해당 업무 페이지로 이동하는 편이 맞습니다. 이 목록은 용어가 낯설 때 보조로 씁니다.",
    },
    {
      question: "모든 용어가 검색 결과에 나오나요?",
      answer:
        "아닙니다. 이미 대표 업무 페이지가 있는 용어는 그 URL이 검색의 기준입니다.",
    },
  ],
};
