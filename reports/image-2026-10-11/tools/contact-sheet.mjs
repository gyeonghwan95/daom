// 번호·파일명 연락판: node contact.mjs <out.png> <cols> <cell> files...
import sharp from "sharp";
const [out, colsS, cellS, ...files] = process.argv.slice(2);
const cols = +colsS, cell = +cellS, lab = 26;
const rows = Math.ceil(files.length / cols);
const comps = [];
for (let i = 0; i < files.length; i++) {
  const x = (i % cols) * cell, y = Math.floor(i / cols) * (cell + lab);
  const buf = await sharp(files[i]).rotate().resize(cell - 8, cell - 8, { fit: "contain", background: "#eee" }).toBuffer();
  comps.push({ input: buf, left: x + 4, top: y + 4 });
  const name = files[i].split("/").pop().replace(/&/g, "&amp;").replace(/</g, "&lt;");
  comps.push({ input: Buffer.from(`<svg width="${cell}" height="${lab}"><rect width="100%" height="100%" fill="#1e3a5f"/><text x="6" y="18" font-size="14" fill="#fff" font-family="Malgun Gothic, sans-serif">${i + 1}. ${name.slice(0, 34)}</text></svg>`), left: x, top: y + cell });
}
await sharp({ create: { width: cols * cell, height: rows * (cell + lab), channels: 3, background: "#fff" } }).composite(comps).png().toFile(out);
console.log(out, files.length);
