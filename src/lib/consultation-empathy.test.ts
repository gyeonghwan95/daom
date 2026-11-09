import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  consultKakaoGreeting,
  consultPasteText,
  getConsultEmpathy,
} from "./consultation-empathy";
import { suggestSituationsFromPath } from "./consult-wizard/catalog";

describe("getConsultEmpathy routing", () => {
  it("does not paste death copy on guardianship pages", () => {
    const e = getConsultEmpathy("/가족후견");
    assert.equal(e.intent, "guardianship");
    assert.match(e.line, /살아/);
    assert.doesNotMatch(e.example, /돌아가신/);
    assert.equal(e.hidePlaces, true);
  });

  it("does not paste closing-date copy on gift pages", () => {
    const e = getConsultEmpathy("/부산증여등기");
    assert.equal(e.intent, "gift");
    assert.doesNotMatch(e.line, /잔금이 다음 주/);
    assert.match(e.line, /잔금일이 없는/);
    assert.doesNotMatch(e.example, /잔금이 다음 주/);
  });

  it("uses auction-winning copy, not sale closing", () => {
    const e = getConsultEmpathy("/부산경매낙찰등기");
    assert.equal(e.intent, "auction-winning");
    assert.match(e.line, /사건번호/);
  });

  it("keeps auction analysis separate from winning", () => {
    const e = getConsultEmpathy("/부산경매권리분석");
    assert.equal(e.intent, "auction-analysis");
  });

  it("routes overseas inheritance before generic inheritance", () => {
    const e = getConsultEmpathy("/해외거주상속인");
    assert.equal(e.intent, "overseas-inheritance");
    assert.match(e.line, /거주국/);
  });

  it("routes sibling conflict before generic inheritance", () => {
    const e = getConsultEmpathy("/situations/siblings-not-cooperating");
    assert.equal(e.intent, "sibling-conflict");
  });

  it("splits will probate and notary", () => {
    assert.equal(getConsultEmpathy("/부산유언검인").intent, "will-probate");
    assert.equal(getConsultEmpathy("/유언공증준비").intent, "will-notary");
  });

  it("splits company setup from director change", () => {
    assert.equal(getConsultEmpathy("/부산법인설립등기").intent, "company-setup");
    assert.equal(getConsultEmpathy("/법인변경등기").intent, "corporate");
    assert.doesNotMatch(
      getConsultEmpathy("/부산법인설립등기").example,
      /임원 변경/,
    );
  });

  it("keeps jeonse ahead of auction tenant pages", () => {
    assert.equal(getConsultEmpathy("/situations/전세-경매-진행").intent, "jeonse");
  });

  it("uses greeting, not a fake story, on unmatched paths", () => {
    const e = getConsultEmpathy("/about");
    assert.equal(e.intent, "general");
    assert.equal(consultPasteText(e), consultKakaoGreeting);
  });
});

describe("suggestSituationsFromPath", () => {
  it("presets the matching wizard chip", () => {
    assert.deepEqual(suggestSituationsFromPath("/가족후견"), ["guardianship"]);
    assert.deepEqual(suggestSituationsFromPath("/부산증여등기"), ["gift"]);
    assert.deepEqual(suggestSituationsFromPath("/부산경매낙찰등기"), [
      "auction-winning",
    ]);
    assert.deepEqual(suggestSituationsFromPath("/해외거주상속인"), [
      "overseas-inheritance",
    ]);
    assert.deepEqual(suggestSituationsFromPath("/부산유언검인"), ["will-probate"]);
    assert.deepEqual(suggestSituationsFromPath("/부산법인설립등기"), [
      "company-setup",
    ]);
  });
});
