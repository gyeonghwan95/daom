#!/usr/bin/env node
/**
 * 본문·공유용 텍스트 카드 생성 (1200×600, 2:1 — ArticleVisual "2:1" 슬롯과 같은 비율).
 * - 왼쪽: 네이비 패널 + 큰 한글 제목 2줄 + 짧은 설명 + 사무소 표기 (Noto Sans KR, OFL)
 * - 오른쪽: 기존 실제 사진(public/image 원본, 수정·덮어쓰기 없음)을 sharp attention 크롭으로 배치
 *   인물의 얼굴·자세는 편집하지 않는다(크롭·축소만).
 * 출력: public/image/cards/<id>.jpg (새 경로), 편집용 SVG: reports/.../cards/src/<id>.svg
 * 실행: node reports/naver-12kw-2026-10-13/cards/build-cards.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "../../..");
const OUT_DIR = path.join(ROOT, "public/image/cards");
const SRC_DIR = path.join(ROOT, "reports/naver-12kw-2026-10-13/cards/src");
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(SRC_DIR, { recursive: true });

const W = 1200;
const H = 600;
const PANEL = 560; // 왼쪽 글자 패널 폭
const PHOTO_W = W - PANEL + 80; // 사진은 패널 아래로 80px 겹쳐 그라데이션으로 이음

export const CARDS = [
  {
    id: "consult-prep",
    photo: "상담-메인.jpg",
    kicker: "상담 준비",
    title: ["상담 전", "준비할 자료"],
    sub: ["상황 메모와 가지고 있는 서류만", "있어도 상담을 시작할 수 있습니다"],
  },
  {
    id: "select-criteria",
    photo: "썸네일-사무실_정면.jpg",
    kicker: "법무사 선택",
    title: ["법무사 선택,", "확인할 기준"],
    sub: ["담당자·수임료와 공과금 구분·", "맡는 범위를 먼저 비교해 보세요"],
  },
  {
    id: "office-visit",
    photo: "썸네일-상담협의.jpg",
    kicker: "다옴법무사사무소",
    title: ["센텀 사무소,", "예약 후 방문"],
    sub: ["부산 해운대구 센텀동로 200", "평일 09:00–18:00 · 방문은 예약제"],
  },
  {
    id: "inheritance-start",
    photo: "썸네일_사무실_서류검토_여름 (5).jpg",
    kicker: "상속 업무",
    title: ["상속, 어떤", "절차부터?"],
    sub: ["상속등기·상속포기·한정승인 중", "무엇이 맞는지부터 가립니다"],
  },
  {
    id: "registry-check",
    photo: "썸네일-등기운영과.jpg",
    kicker: "등기 업무",
    title: ["등기 전에", "확인할 것"],
    sub: ["등기부·원인 서류·관할 등기소를", "먼저 확인한 뒤 접수합니다"],
  },
  {
    id: "corporate-change",
    photo: "썸네일-사무실_겨울 (4).jpg",
    kicker: "법인등기",
    title: ["법인등기,", "변경 사항부터"],
    sub: ["임원·본점·목적·자본 중", "무엇이 바뀌는지 먼저 정리합니다"],
  },
  {
    id: "officer-deadline",
    photo: "썸네일-사무실_작업중.jpg",
    kicker: "법인 업무",
    title: ["임원 변경,", "2주 안에 등기"],
    sub: ["변경이 생긴 날부터 본점 소재지에서", "등기합니다(상법 제317조·제183조)"],
  },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function overlaySvg(card) {
  const font = "Noto Sans KR";
  const title = card.title
    .map((line, i) => `<text x="72" y="${232 + i * 92}" font-family="${font}" font-weight="800" font-size="78" letter-spacing="-1.5" fill="#f7f4ef">${esc(line)}</text>`)
    .join("");
  const subText = card.sub
    .map((line, i) => `<text x="74" y="${398 + i * 40}" font-family="${font}" font-weight="500" font-size="27" fill="#e2d5bf">${esc(line)}</text>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="fade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#1b3354" stop-opacity="1"/>
      <stop offset="0.82" stop-color="#1b3354" stop-opacity="1"/>
      <stop offset="1" stop-color="#1b3354" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="${PANEL + 90}" height="${H}" fill="url(#fade)"/>
  <rect x="72" y="118" width="44" height="4" rx="2" fill="#c4b7a3"/>
  <text x="128" y="128" font-family="${font}" font-weight="700" font-size="26" fill="#c4b7a3">${esc(card.kicker)}</text>
  ${title}
  ${subText}
  <rect x="72" y="514" width="8" height="8" transform="rotate(45 76 518)" fill="#c4b7a3"/>
  <text x="94" y="527" font-family="${font}" font-weight="600" font-size="22" fill="#cfc3ae">다옴법무사사무소 · 안윤정 법무사</text>
</svg>`;
}

async function build(card) {
  const photoPath = path.join(ROOT, "public/image", card.photo);
  const photo = await sharp(photoPath)
    .rotate()
    .resize(PHOTO_W, H, { fit: "cover", position: sharp.strategy.attention })
    .toBuffer();
  const svg = overlaySvg(card);
  fs.writeFileSync(path.join(SRC_DIR, `${card.id}.svg`), svg);
  const out = path.join(OUT_DIR, `${card.id}.jpg`);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#1b3354" } })
    .composite([
      { input: photo, left: W - PHOTO_W, top: 0 },
      { input: Buffer.from(svg), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(out);
  const st = fs.statSync(out);
  return { id: card.id, file: path.relative(ROOT, out).replace(/\\/g, "/"), bytes: st.size, photo: card.photo };
}

const results = [];
for (const card of CARDS) results.push(await build(card));
fs.writeFileSync(path.join(SRC_DIR, "cards.json"), JSON.stringify({ size: `${W}x${H}`, font: "Noto Sans KR (SIL OFL 1.1)", cards: CARDS, results }, null, 1));
for (const r of results) console.log(r.id, r.bytes, r.file);
