import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getConsultationAvailability,
  getHeaderConsultationAction,
  orderChannelsForAvailability,
} from "./consultation-availability";

describe("orderChannelsForAvailability", () => {
  const channels = [
    { id: "phone" },
    { id: "kakao" },
    { id: "naver" },
  ];

  it("hides phone until the time is resolved", () => {
    // 영업 여부가 확정되기 전에는 전화를 내보이지 않는다(영업 외 시간에 잠깐 보였다 사라지는 깜빡임 방지)
    assert.deepEqual(orderChannelsForAvailability(channels, false, false), [
      { id: "kakao" },
      { id: "naver" },
    ]);
  });

  it("hides phone and prefers chat when closed", () => {
    assert.deepEqual(orderChannelsForAvailability(channels, false, true), [
      { id: "kakao" },
      { id: "naver" },
    ]);
  });

  it("keeps phone when open", () => {
    assert.deepEqual(
      orderChannelsForAvailability(channels, true, true),
      channels,
    );
  });
});

describe("getHeaderConsultationAction", () => {
  const phoneHref = (phone: string) => `tel:${phone.replace(/\D/g, "")}`;

  it("stays neutral until resolved", () => {
    const action = getHeaderConsultationAction({
      availability: {
        isOpen: false,
        isResolved: false,
        statusLabel: "상담 안내",
        statusHint: "남겨 주세요",
      },
      phone: "010-4277-1279",
      kakao: "https://pf.kakao.com/test",
      phoneHref,
    });
    assert.equal(action.label, "상담 안내");
    assert.equal(action.href, "https://pf.kakao.com/test");
    assert.equal(action.visualOpen, false);
  });

  it("uses phone label and tel when open", () => {
    const action = getHeaderConsultationAction({
      availability: {
        isOpen: true,
        isResolved: true,
        statusLabel: "현재 상담가능",
        statusHint: "지금 바로 연결",
      },
      phone: "010-4277-1279",
      kakao: "https://pf.kakao.com/test",
      phoneHref,
    });
    assert.equal(action.label, "전화 상담");
    assert.equal(action.href, "tel:01042771279");
    assert.equal(action.visualOpen, true);
  });

  it("uses talk label and kakao when closed", () => {
    const action = getHeaderConsultationAction({
      availability: {
        isOpen: false,
        isResolved: true,
        statusLabel: "현재 카카오톡·네이버톡톡만 가능",
        statusHint: "전화상담은 내일 9시부터 가능",
      },
      phone: "010-4277-1279",
      kakao: "https://pf.kakao.com/test",
      phoneHref,
    });
    assert.equal(action.label, "톡 상담");
    assert.equal(action.href, "https://pf.kakao.com/test");
    assert.equal(action.visualOpen, false);
  });
});

describe("getConsultationAvailability", () => {
  it("marks resolved availability", () => {
    // Monday 2026-11-09 10:00 KST = 2026-11-09 01:00 UTC
    const open = getConsultationAvailability(
      new Date("2026-11-09T01:00:00.000Z"),
    );
    assert.equal(open.isResolved, true);
    assert.equal(open.isOpen, true);

    // Monday 2026-11-09 20:00 KST = 2026-11-09 11:00 UTC
    const closed = getConsultationAvailability(
      new Date("2026-11-09T11:00:00.000Z"),
    );
    assert.equal(closed.isResolved, true);
    assert.equal(closed.isOpen, false);
  });
});

describe("nextReplyAt (영업 외 문의 회신 시점)", () => {
  // 예전 문구는 금요일 밤·주말에도 "내일 아침"이라고 해 사실과 달랐다(2026-11-15)
  const at = (iso: string) => getConsultationAvailability(new Date(iso)).nextReplyAt;

  it("평일 영업 중에는 따로 말하지 않는다", () => {
    assert.equal(at("2026-11-09T01:00:00.000Z"), undefined); // 월 10:00
  });
  it("평일 아침 9시 전은 오늘", () => {
    assert.equal(at("2026-11-10T22:00:00.000Z"), "오늘 오전 10시 전"); // 수 07:00
  });
  it("월~목 저녁은 내일", () => {
    assert.equal(at("2026-11-09T11:00:00.000Z"), "내일 오전 10시 전"); // 월 20:00
  });
  it("금요일 저녁·토·일은 월요일", () => {
    assert.equal(at("2026-11-13T12:00:00.000Z"), "월요일 오전 10시 전"); // 금 21:00
    assert.equal(at("2026-11-14T03:00:00.000Z"), "월요일 오전 10시 전"); // 토 12:00
    assert.equal(at("2026-11-15T13:00:00.000Z"), "월요일 오전 10시 전"); // 일 22:00
  });
});
