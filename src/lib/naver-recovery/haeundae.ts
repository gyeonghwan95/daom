import { officeHours, officeLocation } from "@/lib/office-location";
import type { NaverRecoverySpec } from "./types";

/**
 * LOCAL PROVIDER — 해운대구에서 맡길 수 있는 업무·방문 정보.
 * 관할: 부산지방법원 동부지원 등기과(해운대구 전지역·기장군) — 부산지방법원 공지 확인 2026-09-27.
 */
export const haeundaeRecoverySpec: Omit<NaverRecoverySpec, "slug" | "path"> = {
  eyebrow: "해운대구 · 센텀 법무사사무소",
  lead: [
    "다옴법무사사무소는 해운대구 센텀동로 200에 있는 법무사사무소입니다. 해운대구에서 많이 찾는 아파트·오피스텔 매매와 증여 등기, 상속등기, 근저당 설정·말소, 법인설립과 임원변경 등기를 안윤정 법무사가 직접 상담합니다.",
    "해운대구 부동산 등기는 부산지방법원 동부지원 등기과가 관할하고, 등기과와 사무소가 모두 재송동에 있습니다. 방문 상담은 예약 후 가능하며 서류 확인은 전화·카카오톡으로 먼저 하셔도 됩니다.",
  ],
  facts: [
    { label: "주소", value: officeLocation.fullAddress },
    { label: "교통·주차", value: officeLocation.accessSummary },
    { label: "상담 시간", value: `${officeHours.weekday} (점심 ${officeHours.lunch}) · 예약 후 방문` },
  ],
  image: {
    src: "/image/og/haeundae-office-nameplate-4x3.jpg",
    alt: "해운대구 센텀동로 다옴법무사사무소 입구 명판",
    width: 1200,
    height: 900,
    caption: "다옴법무사사무소 명판 · 해운대구 센텀동로 200 D동 1층 LAB9호",
  },
  ogImage: {
    src: "/image/og/haeundae-office-nameplate.jpg",
    alt: "해운대구 센텀 다옴법무사사무소 명판",
    width: 1200,
    height: 630,
  },
  sections: [
    {
      id: "services",
      title: "해운대구에서 맡기시는 업무",
      blocks: [
        {
          kind: "cards",
          items: [
            {
              title: "부동산 매매·증여 등기",
              body: "잔금일에 맞춘 소유권이전, 가족 간 증여, 공동명의 변경. 계약서와 등기부를 함께 보고 취득세 납부 순서를 안내합니다.",
              link: { href: "/해운대구부동산등기", label: "해운대구 부동산등기 절차" },
            },
            {
              title: "상속등기·상속포기",
              body: "해운대구 아파트·토지 상속 명의이전과 협의분할. 빚이 있으면 가정법원 신고가 먼저인지부터 확인합니다.",
              link: { href: "/해운대구상속등기", label: "해운대구 상속등기 안내" },
            },
            {
              title: "근저당·임차권등기",
              body: "대출 상환 후 근저당 말소, 전세 보증금을 못 받았을 때 임차권등기명령 신청을 준비합니다.",
            },
            {
              title: "법인설립·임원변경",
              body: "센텀 업무지구 법인의 설립, 임원 임기 만료에 따른 변경, 본점 이전 등기를 상담합니다.",
              link: { href: "/센텀법무사", label: "센텀 법인등기 안내" },
            },
          ],
        },
      ],
    },
    {
      id: "neighborhoods",
      title: "센텀·재송·반여 생활권에서 자주 확인하는 것",
      blocks: [
        {
          kind: "list",
          items: [
            ["센텀 — 오피스텔·업무시설 매매, 법인 본점 주소와 임원 변경 일정"],
            [
              "재송동 — 아파트 매매 잔금과 상속 명의이전. 재송동 생활권 안내는 ",
              { href: "/재송동법무사", label: "재송동 법무사 안내" },
              "에 따로 정리했습니다.",
            ],
            ["반여동 — 오래 보유한 주택·토지의 상속, 등기부와 실제 소유 관계가 다른 경우"],
            ["우동·좌동·중동 — 주거 매매와 근저당 말소, 전세 계약 전 등기부 확인"],
          ],
        },
      ],
    },
    {
      id: "visit",
      title: "방문하기 전에 알아두실 것",
      blocks: [
        {
          kind: "list",
          items: [
            [`${officeLocation.visitNotice} 예약 없이 오시면 상담이 어려울 수 있습니다.`],
            [`동해선 재송역·센텀역에서 걸어서 약 5분이며 ${officeLocation.parking}합니다.`],
            ["토·일·공휴일은 쉬며, 급한 기한이 있으면 메시지로 먼저 알려 주세요."],
            [
              "건물 입구와 주차 위치는 ",
              { href: "/location", label: "오시는 길" },
              "에서 사진으로 확인할 수 있습니다.",
            ],
          ],
        },
      ],
    },
    {
      id: "jurisdiction",
      title: "해운대구 등기는 어디에 접수하나요?",
      blocks: [
        {
          kind: "table",
          caption: "해운대구 사건별 접수처",
          head: ["업무", "접수처", "비고"],
          rows: [
            ["해운대구 부동산 등기", "부산지방법원 동부지원 등기과", "해운대구 전 지역과 기장군 관할"],
            ["상속포기·한정승인", "부산가정법원", "고인의 마지막 주소지가 부산일 때"],
            ["법인등기", "본점 소재지 관할 등기소", "법인마다 따로 확인"],
          ],
        },
        {
          kind: "p",
          parts: [
            "부동산이 해운대구 밖에 있으면 그 소재지 등기소가 관할입니다. 전자신청이 가능한 등기는 사무소에서 바로 접수하므로 등기과를 직접 방문하지 않아도 됩니다.",
          ],
        },
      ],
    },
    {
      id: "records",
      title: "공개된 해운대구 처리 사례",
      blocks: [
        {
          kind: "records",
          items: [
            {
              status: "VERIFIED_HANDLED",
              title: "센텀 오피스텔 매매 소유권이전",
              body: "매수인 의뢰로 잔금일에 맞춰 취득세 납부와 등기 접수 일정을 조율하고, 저당권 여부를 확인한 뒤 이전등기를 마쳤습니다.",
              link: { href: "/services/cases/centum-ownership-transfer-case", label: "센텀 소유권이전등기 사례" },
            },
            {
              status: "VERIFIED_HANDLED",
              title: "해운대구 아파트 공동상속 등기",
              body: "상속인 3명 중 1명이 해외에 있어 위임 서류 일정을 먼저 잡고, 상속 방향을 정리한 뒤 명의이전을 진행했습니다.",
              link: { href: "/services/cases/haeundae-inheritance-registration-case", label: "해운대구 상속등기 사례" },
            },
          ],
        },
      ],
    },
    {
      id: "prepare",
      title: "상담 전에 준비하면 좋은 자료",
      blocks: [
        {
          kind: "list",
          items: [
            ["매매·증여 — 계약서 사진, 잔금일, 대출 여부"],
            ["상속 — 돌아가신 날, 상속인 구성, 부동산 주소"],
            ["근저당·임차권 — 상환 확인서 또는 임대차계약서"],
            ["법인 — 법인등기부, 바꾸려는 임원·주소·목적"],
          ],
        },
      ],
    },
  ],
  faqs: [
    {
      question: "예약 없이 방문해도 되나요?",
      answer:
        "외부 일정이나 상담이 겹칠 수 있어 예약 후 방문을 부탁드립니다. 전화, 카카오톡, 네이버 톡톡으로 시간을 정할 수 있습니다.",
    },
    {
      question: "해운대구 밖에 있는 부동산도 맡길 수 있나요?",
      answer:
        "가능합니다. 관할 등기소만 달라지고, 전자신청이 되는 등기는 센텀 사무소에서 접수합니다.",
    },
    {
      question: "법인 임원변경도 해운대 사무소에서 하나요?",
      answer:
        "네. 임기 만료일과 주주총회·이사회 서류를 확인한 뒤 변경등기를 준비합니다.",
    },
    {
      question: "상담 비용이 있나요?",
      answer:
        "업무 가능 여부와 준비서류 안내는 먼저 드리고, 진행하실 때 등기 종류와 부동산 가액에 따라 보수와 세금·수수료를 나눠 견적합니다.",
    },
  ],
  cta: {
    title: "해운대구 등기, 가능 여부와 준비서류부터 확인하세요",
    body: "부동산 주소나 법인명, 원하는 업무만 알려주시면 안윤정 법무사가 관할과 필요한 서류를 회신합니다.",
    href: "/contact/inquiry?field=real-estate-registration",
    label: "해운대 사무소에 문의하기",
  },
  remoteNote:
    "해운대구 밖에 사시거나 부동산·법인이 다른 지역에 있어도 전자신청과 우편 서류로 진행할 수 있는 업무가 많습니다. 인감 날인 원본이나 본인 확인이 필요한 단계는 방문 또는 등기우편이 필요할 수 있어 상담에서 먼저 알려 드립니다.",
  reviewNote:
    "작성·검토 안윤정 법무사(다옴법무사사무소). 사무소 주소·교통·영업시간은 사무소 공식 정보와 같으며, 관할은 부산지방법원 안내 기준입니다.",
  dateModified: "2026-09-27",
};
