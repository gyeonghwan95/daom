/**
 * 페이지 시작 4:3 대표 썸네일(히어로)용 추가 원본 — 블로그 포스팅용 폴더에서 고른 실제 사진.
 * 얼굴·몸은 변형하지 않는다. 원본은 assets/thumbnail-sources/ 에 축소 사본으로 두고(배포 제외) "@posting/<key>.jpg"로 부른다.
 * faces: 머리(머리카락 포함) 박스 [x0, y0, x1, y1] — 제목이 얼굴에 닿지 않게 crop을 고르는 데 쓴다.
 *
 * 사본 만들기: node scripts/premium-thumbnails/hero-sources.mjs --import
 */
import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const POSTING_DIR = process.env.POSTING_DIR ?? "C:/Users/your1/Desktop/윤정블로그/포스팅용";
export const SOURCES_DIR = path.join(process.cwd(), "assets", "thumbnail-sources");

const P = (x0, y0, x1, y1) => ({ box: [x0, y0, x1, y1], primary: true });
const Q = (x0, y0, x1, y1) => ({ box: [x0, y0, x1, y1], primary: false });

export const HERO_SOURCES = {
  // ── 외근(법무사 본인)
  "field-haeundae-1": { file: "외근_안윤정/외근_해운대구청.jpg", desc: "해운대구청 민원실 앞의 안윤정 법무사", faces: [P(0.4, 0.46, 0.5, 0.6)] },
  "field-haeundae-2": { file: "외근_안윤정/외근_해운대구청 (2).jpg", desc: "해운대구청 민원실 앞의 안윤정 법무사", faces: [P(0.43, 0.46, 0.53, 0.6)] },
  "field-suyeong": { file: "외근_안윤정/외근_수영구청.jpg", desc: "수영구청 등록면허세 창구의 안윤정 법무사", faces: [P(0.54, 0.49, 0.62, 0.6)] },
  "field-saha-1": { file: "외근_안윤정/외근_사하구청.jpg", desc: "사하구청 종합민원실 앞의 안윤정 법무사", faces: [P(0.5, 0.5, 0.59, 0.64)] },
  "field-saha-2": { file: "외근_안윤정/외근_사하구청 (2).jpg", desc: "사하구청 앞의 안윤정 법무사", faces: [P(0.44, 0.6, 0.53, 0.72)] },
  "field-jingu-1": { file: "외근_안윤정/외근_진구청.jpg", desc: "부산진구의회 표지 앞의 안윤정 법무사", faces: [P(0.44, 0.57, 0.53, 0.7)] },
  "field-jingu-2": { file: "외근_안윤정/외근_진구청 (2).jpg", desc: "부산진구청 표지 앞의 안윤정 법무사", faces: [P(0.5, 0.52, 0.59, 0.65)] },
  "field-junggu": { file: "외근_안윤정/외근_여름_중구청 (2).jpg", desc: "부산 중구청 앞의 안윤정 법무사", faces: [P(0.43, 0.61, 0.51, 0.73)] },
  "field-yeongdo": { file: "외근_안윤정/외근_영도구청.jpg", desc: "영도구청 취득세 창구의 안윤정 법무사", faces: [P(0.57, 0.55, 0.67, 0.72)] },
  "field-jaesong": { file: "외근_안윤정/외근_재송2동행정복지센터 (2).jpg", desc: "재송2동 행정복지센터 앞의 안윤정 법무사", faces: [P(0.48, 0.48, 0.56, 0.61)] },
  "field-court-1": { file: "외근_안윤정/외근_부산지방법원.jpg", desc: "부산지방법원 앞의 안윤정 법무사", faces: [P(0.45, 0.51, 0.53, 0.62)] },
  "field-court-2": { file: "외근_안윤정/외근_부산지방법원 (2).jpg", desc: "부산지방법원 종합민원실·공탁 창구 앞의 안윤정 법무사", faces: [P(0.44, 0.45, 0.56, 0.62)] },
  "field-court-3": { file: "외근_안윤정/외근_부산지방법원 (3).jpg", desc: "부산지방법원 앞의 안윤정 법무사", faces: [P(0.48, 0.45, 0.57, 0.6)] },
  "field-court-4": { file: "외근_안윤정/외근_부산지방법원 (4).jpg", desc: "부산지방법원 민사집행과 앞의 안윤정 법무사", faces: [P(0.46, 0.45, 0.56, 0.6)] },
  "field-seobu-1": { file: "외근_안윤정/외근_서부지원.jpg", desc: "부산지방법원 서부지원 표지 앞의 안윤정 법무사", faces: [P(0.44, 0.59, 0.51, 0.69)] },
  "field-seobu-2": { file: "외근_안윤정/외근_서부지원 (4).jpg", desc: "부산지방법원 서부지원 등기과의 안윤정 법무사", faces: [P(0.45, 0.39, 0.57, 0.58), Q(0.05, 0.4, 0.13, 0.55)] },
  "field-seobu-3": { file: "외근_안윤정/외근_여름_서부지원.jpg", desc: "부산지방법원 서부지원 앞의 안윤정 법무사", faces: [P(0.49, 0.49, 0.56, 0.6)] },
  "field-seobu-4": { file: "외근_안윤정/외근_여름_서부지원 (2).jpg", desc: "부산지방법원 서부지원 앞의 안윤정 법무사", faces: [P(0.49, 0.55, 0.56, 0.67)] },
  "field-dongbu-1": { file: "외근_안윤정/외근_동부지원.jpg", desc: "부산지방법원 동부지원 앞의 안윤정 법무사", faces: [P(0.46, 0.55, 0.56, 0.69)] },
  "field-dongbu-2": { file: "외근_안윤정/외근_동부지원 (2).jpg", desc: "부산지방법원 동부지원 표지 앞의 안윤정 법무사", faces: [P(0.48, 0.43, 0.59, 0.62)] },
  "field-registry-1": { file: "외근_안윤정/외근_겨울_부산지방등기국 (5).jpg", desc: "부산지방법원 등기국으로 들어가는 안윤정 법무사", faces: [P(0.32, 0.56, 0.42, 0.69)] },
  "field-registry-2": { file: "외근_안윤정/외근_여름_부산지방등기국 (2).jpg", desc: "부산지방법원 등기국 안의 안윤정 법무사", faces: [P(0.46, 0.6, 0.54, 0.71)] },
  "field-registry-3": { file: "외근_안윤정/외근_여름_부산지방등기국 (3).jpg", desc: "부산지방법원 등기국 안의 안윤정 법무사", faces: [P(0.45, 0.53, 0.51, 0.63)] },
  "field-registry-4": { file: "외근_안윤정/외근_여름_부산지방등기국 (4).jpg", desc: "부산지방법원 등기국 입구의 안윤정 법무사", faces: [P(0.48, 0.43, 0.59, 0.61)] },
  "field-registry-5": { file: "외근_안윤정/외근_겨울_부산지방등기국 (2).jpg", desc: "부산지방법원 등기국 표지 옆의 안윤정 법무사", faces: [P(0.55, 0.54, 0.64, 0.68)] },
  // ── 청사(사람 없음)
  "bldg-gijang": { file: "구청/구청_기장군청 (3).jpg", desc: "기장군청 전경", faces: [] },
  "bldg-geumjeong": { file: "구청/구청_금정구청 (3).jpg", desc: "금정구청 청사 전경", faces: [] },
  "bldg-dongnae": { file: "구청/구청_동래구청 (2).jpg", desc: "동래구청 청사 전경", faces: [] },
  "bldg-seogu": { file: "구청/구청_서구청.jpg", desc: "부산 서구청 청사 전경", faces: [] },
  "bldg-bukgu": { file: "구청/구청_북구청.jpg", desc: "부산 북구청 청사 전경", faces: [] },
  "bldg-yangsan-city": { file: "시청/시청_양산시청.jpg", desc: "양산시청 청사 전경", faces: [] },
  "bldg-yangsan-registry": { file: "등기소/등기소_양산등기소.jpg", desc: "양산등기소 청사", faces: [] },
  "bldg-jinju-city": { file: "시청/시청_진주시청 (2).jpg", desc: "진주시청 청사 전경", faces: [] },
  "bldg-jinju-court": { file: "법원/법원_진주지원.jpg", desc: "창원지방법원 진주지원 청사", faces: [] },
  "bldg-ulsan-court": { file: "법원/법원_울산지방.jpg", desc: "울산지방법원 청사", faces: [] },
  // ── 서류(개인정보 가림)
  "doc-corp-establish": { file: "법인관련/신청서_법인설립 (2).jpg", desc: "주식회사 설립등기 신청서(개인정보 가림)", faces: [] },
  "doc-corp-officer": { file: "법인관련/서류_법인변경_임원변경.jpg", desc: "임원 변경등기 신청서(개인정보 가림)", faces: [] },
  "doc-inherit-cert": { file: "상속/등기필증_상속 (2).jpg", desc: "부산지방법원 동부지원 앞에서 든 상속 등기필정보(개인정보 가림)", faces: [] },
  "doc-inherit-app": { file: "상속/신청서_상속 (6).jpg", desc: "등기과 앞에서 든 상속등기 신청서(개인정보 가림)", faces: [] },
  "doc-gift": { file: "증여/등기필증_증여 (4).jpg", desc: "증여 등기필정보 및 등기완료통지서(개인정보 가림)", faces: [] },
  "doc-mortgage": { file: "근저당설정/등기필증_근저당설정.jpg", desc: "근저당권설정 등기필정보(개인정보 가림)", faces: [] },
  "doc-ship": { file: "선박/신청서_선박등기.jpg", desc: "선박등기 신청서(개인정보 가림)", faces: [] },
  "doc-lease": { file: "서류_임차권등기명령.jpg", desc: "주택임차권 등기명령 신청서 작성 화면(개인정보 가림)", faces: [] },
  "doc-demolish": { file: "서류_건물멸실.jpg", desc: "건물 멸실등기 신청서(개인정보 가림)", faces: [] },
};

export const heroPhoto = (key) => `@posting/${key}.jpg`;

/** "@posting/<key>.jpg" → 디스크 경로 */
export function postingDisk(photo) {
  return path.join(SOURCES_DIR, photo.slice("@posting/".length));
}

export const HERO_FACES = Object.fromEntries(
  Object.entries(HERO_SOURCES).map(([k, v]) => [heroPhoto(k), v.faces]),
);

export function heroPhotoDesc(photo) {
  const key = photo.startsWith("@posting/") ? photo.slice(9).replace(/\.jpg$/, "") : "";
  return HERO_SOURCES[key]?.desc;
}

// 지역: 그 지역 청사·관할 법원에서 찍은 사진(첫 매칭만). 순서 중요 — 강서가 서구보다, 부산진이 진구보다 먼저.
// 부산 밖 도시 이름이 있으면 부산 구·동 규칙을 쓰지 않는다("대구다사상속"의 '사상' 같은 오매칭 방지)
const OTHER_CITY = /서울|인천|(?<!해운)대구|광주|대전|세종|경기|수원|용인|성남|고양|화성|오산|안성|안산|평택|천안|청주|전주|제주|강원|충청|충북|충남|전라|전북|전남|경상|경북|경남|창원|마산|진해|김해|거제|통영|밀양|사천|포항|경주|구미|안동|의성|울산|양산|진주/;

const REGION = [
  [/울산/, ["bldg-ulsan-court"], true],
  [/양산/, ["bldg-yangsan-registry", "bldg-yangsan-city"], true],
  [/진주/, ["bldg-jinju-court", "bldg-jinju-city"], true],
  [/재송|반여/, ["field-jaesong", "field-dongbu-1", "field-dongbu-2"]],
  [/해운대|센텀|좌동|우동|송정/, ["field-haeundae-1", "field-haeundae-2", "field-jaesong"]],
  [/수영구|광안|민락|망미/, ["field-suyeong", "field-dongbu-1"]],
  // '정관'은 법인 정관(정관변경·정관인증)과 겹쳐 동네 이름일 때만
  [/기장|정관(읍|신도시|산업|법무사)|일광/, ["bldg-gijang", "field-dongbu-2"]],
  [/사하|하단|괴정|다대|장림|신평/, ["field-saha-1", "field-saha-2"]],
  // '법무사상담'의 '사상' 제외
  [/강서|명지|녹산|(?<!무)사상|북구|화명|덕천|구포|만덕|서부지원/, ["field-seobu-1", "field-seobu-3", "field-seobu-4", "field-seobu-2"]],
  [/부산진|서면|전포|부전|양정|범천|개금|가야|당감|초읍/, ["field-jingu-2", "field-jingu-1"]],
  [/연제|연산|거제동|법원근처/, ["field-court-1", "field-court-3", "field-registry-4"]],
  [/동부지원/, ["field-dongbu-1", "field-dongbu-2"]],
  [/영도/, ["field-yeongdo"]],
  [/금정|부곡|장전|구서동/, ["bldg-geumjeong"]],
  [/동래|온천|사직|명륜/, ["bldg-dongnae"]],
  [/(^|[^강])서구|송도|충무동|대신동|부민동/, ["bldg-seogu"]],
  [/(^|[^울산])중구|남포|광복|중앙동/, ["field-junggu"]],
];

// 업무: 지역 매칭이 없을 때. 법무사 사무실 사진과 번갈아 쓴다(share: 업무 사진 비율).
const TOPIC = [
  [/선박/, ["doc-ship"], 1],
  [/멸실/, ["doc-demolish"], 0.5],
  [/임차권|보증금반환|전세보증금/, ["doc-lease", "field-court-4"], 0.5],
  [/근저당/, ["doc-mortgage", "field-registry-2"], 0.5],
  [/증여/, ["doc-gift", "field-registry-3"], 0.5],
  [/임원|대표이사|이사변경|감사/, ["doc-corp-officer", "field-registry-4"], 0.5],
  [/법인|회사|본점|정관|유상증자|목적변경|창업/, ["doc-corp-establish", "doc-corp-officer", "field-registry-1"], 0.5],
  [/공탁|민사집행|강제집행|경매|배당|압류|가압류|가처분|지급명령|소송|소장|판결|개명|후견|검인|법원/, ["field-court-2", "field-court-4", "field-court-1", "field-court-3", "field-seobu-2"], 0.6],
  [/상속포기|한정승인/, ["field-court-3", "field-dongbu-2"], 0.4],
  [/상속/, ["doc-inherit-cert", "doc-inherit-app", "field-registry-3", "field-dongbu-1"], 0.5],
  [/등기국|등기소|부동산등기|소유권|잔금|매매|말소|등기부|등기/, ["field-registry-1", "field-registry-2", "field-registry-3", "field-registry-4", "field-registry-5"], 0.5],
];

function hash(s) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return h;
}

/** 페이지 주소로 사진을 고른다. 맞는 사진이 없거나 사무실 사진 차례면 기존 사진(fallback)을 쓴다. */
export function pickHeroPhoto(url, fallback) {
  let p = url;
  try {
    p = decodeURIComponent(url);
  } catch {
    // 이미 디코딩된 경로
  }
  const h = hash(p);
  const otherCity = OTHER_CITY.test(p);
  for (const [re, keys, any] of REGION) {
    if ((any || !otherCity) && re.test(p)) return heroPhoto(keys[h % keys.length]);
  }
  for (const [re, all, share] of TOPIC) {
    if (!re.test(p)) continue;
    // 다른 도시 페이지에는 부산 청사에서 찍은 외근 사진을 쓰지 않는다(서류 사진만)
    const keys = otherCity ? all.filter((k) => !k.startsWith("field-")) : all;
    if (!keys.length || (h % 100) / 100 >= share) return fallback;
    return heroPhoto(keys[Math.floor(h / 100) % keys.length]);
  }
  return fallback;
}

async function importSources() {
  const sharp = createRequire(path.join(process.cwd(), "package.json"))("sharp");
  mkdirSync(SOURCES_DIR, { recursive: true });
  for (const [key, v] of Object.entries(HERO_SOURCES)) {
    const src = path.join(POSTING_DIR, v.file);
    const out = path.join(SOURCES_DIR, `${key}.jpg`);
    if (!existsSync(src)) {
      console.error(`missing ${src}`);
      process.exitCode = 1;
      continue;
    }
    await sharp(src).rotate().resize(2400, 2400, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
  }
  console.log(`imported ${Object.keys(HERO_SOURCES).length} → ${SOURCES_DIR}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href && process.argv.includes("--import")) {
  await importSources();
}
