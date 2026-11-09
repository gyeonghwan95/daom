/**
 * 고객후기 페이지 미리보기는 원문과 같지 않고 150자 이내 + 말줄임표.
 * 실행: npx --yes tsx --test tests/place-review-preview.spec.ts
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { previewPlaceReview } from "../src/lib/naver-place-reviews/preview";

test("짧은 후기도 원문 그대로 두지 않고 ...으로 끝낸다", () => {
  const body =
    "전세 관련해서 머리가 복잡했는데 친절하고 꼼꼼하게 상담해주셔서 마음의 부담을 내려두게 된것 같습니다. 다음에도 또 부탁드리고 싶네요!";
  const preview = previewPlaceReview(body);
  assert.notEqual(preview, body.replace(/\s+/g, " ").trim());
  assert.ok(preview.endsWith("..."));
  assert.ok(preview.replace(/\.\.\.$/, "").length <= 150);
});

test("긴 후기는 150자 이내만 남기고 ...으로 표기한다", () => {
  const body =
    "처음에는 비용이 궁금해서 몇 군데 전화해서 물어봤는데 여기 상담받아보고 맡겼습니다. 비용도 그냥 얼마라고만 하는 게 아니라 어떤 부분에서 비용이 나오는지 설명해주셔서 이해하기 좋았어요. 서류도 필요한 것들 미리 알려주셔서 준비하는 것도 어렵지 않았고, 중간중간 궁금한 거 물어봐도 잘 알려주셨습니다. 법무사에 맡기는 게 처음이라 괜히 어렵게 생각했는데 생각보다 편하게 끝나서 만족합니다.";
  const preview = previewPlaceReview(body);
  assert.ok(preview.endsWith("..."));
  assert.ok(preview.replace(/\.\.\.$/, "").length <= 150);
  assert.notEqual(preview.replace(/\.\.\.$/, ""), body.replace(/\s+/g, " ").trim());
  assert.ok(body.startsWith(preview.replace(/\.\.\.$/, "").trim()));
});

test("저장된 후기 원문은 미리보기와 한 건도 같지 않다", async () => {
  const { readFile } = await import("node:fs/promises");
  const raw = await readFile(
    new URL("../public/data/naver-place-reviews.json", import.meta.url),
    "utf8",
  );
  const feed = JSON.parse(raw) as { items: { body: string }[] };
  for (const item of feed.items) {
    const preview = previewPlaceReview(item.body);
    assert.notEqual(preview, item.body.replace(/\s+/g, " ").trim());
    assert.ok(preview.endsWith("..."));
    assert.ok(preview.replace(/\.\.\.$/, "").length <= 150);
  }
});
