// 대표 이미지의 1.91:1·1:1·4:3 가운데 자르기 미리보기(공유 썸네일 잘림 확인용)
//   node crop-preview.mjs <out.png> <img>...
import sharp from "sharp";
const [out, ...files] = process.argv.slice(2);
const ratios = [["1.91:1", 1.91], ["1:1", 1], ["4:3", 4 / 3]];
const cellH = 220, comps = [];
let y = 0, maxW = 0;
for (const f of files) {
  let x = 0;
  for (const [, r] of ratios) {
    const w = Math.round(cellH * r);
    const buf = await sharp(f).resize(w, cellH, { fit: "cover", position: "centre" }).toBuffer();
    comps.push({ input: buf, left: x, top: y });
    x += w + 10;
  }
  maxW = Math.max(maxW, x);
  y += cellH + 10;
}
await sharp({ create: { width: maxW, height: y, channels: 3, background: "#fff" } }).composite(comps).png().toFile(out);
console.log(out);
