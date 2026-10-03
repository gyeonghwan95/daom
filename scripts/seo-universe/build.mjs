#!/usr/bin/env node
/**
 * 348 업무 → legal scope / family / keyword / ownership / cannibalization / decision CSV 생성.
 * 입력: scripts/seo-universe/service-list.txt (사용자 제공 원문), seo-full-audit/*, raw-naver-evidence.md
 * 출력: seo-service-universe/01~13, 16 CSV
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "seo-service-universe");
const AUDIT = path.join(ROOT, "seo-full-audit");
fs.mkdirSync(OUT, { recursive: true });

function csvCell(v) {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function writeCsv(name, rows) {
  if (!rows.length) throw new Error(`${name}: empty`);
  const cols = Object.keys(rows[0]);
  const body = [cols.join(","), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\n");
  fs.writeFileSync(path.join(OUT, name), `\uFEFF${body}\n`, "utf8");
  return rows.length;
}
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...rest] = rows;
  return rest.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h.replace(/^\uFEFF/, ""), r[i]])));
}

const routes = new Set(fs.readFileSync(path.join(AUDIT, "route-snapshot-before.txt"), "utf8").split(/\r?\n/).filter(Boolean));
const afterSnap = path.join(AUDIT, "route-snapshot-after.txt");
const afterRoutes = fs.existsSync(afterSnap) ? new Set(fs.readFileSync(afterSnap, "utf8").split(/\r?\n/).filter(Boolean)) : null;
const metadata = parseCsv(fs.readFileSync(path.join(AUDIT, "02-current-metadata.csv"), "utf8").replace(/^\uFEFF/, ""));

/* ---------------- Wave 1 신규 URL ---------------- */
const NEW_PAGES = {
  "/부산가족관계등록부정정": { hub: "/가족후견", family: "27" },
  "/부산집행문부여신청": { hub: "/민사소송", family: "30" },
  "/부산채무불이행자명부등재": { hub: "/민사소송", family: "30" },
  "/부산배당요구신청": { hub: "/민사소송", family: "31" },
  "/부산실종선고청구": { hub: "/가족후견", family: "45" },
  "/부산가압류신청": { hub: "/민사소송", family: "32" },
};
const exists = (u) => routes.has(u) || Boolean(NEW_PAGES[u]);

/* ---------------- Families ---------------- */
// [id, name, hub, primary, secondary[], localRelevance 0-5, terms[]]
const FAMILY_DEFS = [
  ["01", "부동산 소유권 보존", "/부동산등기", "/부산신축건물보존등기", ["/지식산업센터보존등기"], 3, ["소유권보존등기", "보존등기"]],
  ["02", "부동산 소유권 이전", "/부동산등기", "/부산소유권이전등기", ["/부산명의변경등기", "/소유권이전등기필요서류"], 5, ["소유권이전등기", "명의변경"]],
  ["03", "매매등기", "/부동산등기", "/부산매매등기법무사", ["/부산아파트매매등기", "/부산토지매매등기"], 5, ["매매등기", "아파트 매매등기"]],
  ["04", "증여등기", "/부동산등기", "/부산증여등기", ["/부산부부간증여등기", "/부산부담부증여등기"], 5, ["증여등기", "부부간 증여등기"]],
  ["05", "상속등기", "/상속", "/부산상속등기", ["/부산상속법무사", "/대습상속등기", "/전국유증등기"], 5, ["상속등기", "협의분할 상속등기"]],
  ["06", "공유물·공유지분", "/부동산등기", "/부산공유물분할등기", ["/부산지분이전등기", "/공유물분할등기서류준비"], 4, ["공유물분할등기", "지분이전등기"]],
  ["07", "재산분할에 따른 등기", "/부동산등기", "/부산이혼재산분할등기", [], 3, ["재산분할 등기"]],
  ["08", "가등기·본등기·말소", "/부동산등기", "/부산가등기", ["/부산말소등기"], 3, ["가등기", "가등기 말소"]],
  ["09", "표시변경·멸실", "/부동산등기", "/부산등기명의인표시변경", ["/부산건물표시변경등기", "/부산건물멸실등기"], 3, ["등기명의인 표시변경", "건물멸실등기"]],
  ["10", "토지 분필·합필·지목", "/부동산등기", "", ["/부산토지매매등기"], 2, ["토지 분필등기", "토지 합필등기"]],
  ["11", "구분건물·대지권", "/부동산등기", "/부산대지권등기", ["/부산집합건물등기"], 3, ["대지권등기", "구분건물 등기"]],
  ["12", "근저당·저당", "/부동산등기", "/부산근저당설정등기", ["/부산근저당말소등기", "/부산근저당전문법무사"], 5, ["근저당 설정", "근저당 말소", "근저당 변경"]],
  ["13", "전세권·임차권", "/부동산등기", "/부산전세권설정등기", ["/부산전세권말소등기", "/부산임차권등기명령"], 5, ["전세권 설정", "전세권 말소"]],
  ["14", "지상권·지역권", "/부동산등기", "/부산지상권설정등기", [], 2, ["지상권 설정", "지역권 설정"]],
  ["15", "신탁등기", "/부동산등기", "/부산신탁등기", ["/부산시행사등기"], 4, ["신탁등기", "신탁말소"]],
  ["16", "상속포기·한정승인", "/상속", "/부산상속포기", ["/부산한정승인", "/특별한정승인"], 5, ["상속포기", "한정승인", "특별한정승인"]],
  ["17", "법인설립", "/법인등기", "/부산법인설립등기", ["/부산유한회사설립등기", "/부산1인법인설립"], 5, ["법인설립등기", "유한회사 설립"]],
  ["18", "법인 임원변경", "/법인등기", "/부산임원변경등기", ["/부산임원임기만료등기", "/부산대표이사변경등기", "/부산임원사임해임등기"], 5, ["임원변경등기", "임원 중임등기", "대표이사 변경"]],
  ["19", "법인 본점·지점", "/법인등기", "/부산본점이전등기", ["/부산지점설치등기", "/부산지점폐지등기"], 4, ["본점이전등기", "지점설치등기"]],
  ["20", "법인 목적·상호", "/법인등기", "/부산사업목적변경등기", ["/부산상호변경등기"], 4, ["목적변경등기", "상호변경등기"]],
  ["21", "증자·감자·신주", "/법인등기", "/부산유상증자등기", ["/부산감자등기", "/부산무상증자등기"], 4, ["증자등기", "감자등기"]],
  ["22", "법인 해산·청산", "/법인등기", "/부산법인해산청산등기", ["/부산휴면법인계속등기", "/부산법인해산전확인사항"], 4, ["법인 해산", "법인 청산", "휴면법인 계속등기"]],
  ["23", "회사 비송", "/법인등기", "", [], 1, ["임시주주총회 소집허가", "검사인 선임"]],
  ["24", "개인회생", "/개인회생파산", "/부산개인회생", ["/부산개인회생신청", "/부산회생법원개인회생"], 5, ["개인회생", "개인회생 신청"]],
  ["25", "개인파산·면책", "/개인회생파산", "/부산개인파산", ["/부산면책신청", "/부산회생법원개인파산"], 5, ["개인파산", "파산 면책"]],
  ["26", "공탁", "/공탁채권회수", "/부산공탁", ["/부산변제공탁", "/부산집행공탁", "/부산담보공탁", "/공탁금출급회수"], 4, ["변제공탁", "공탁금 출급"]],
  ["27", "가족관계등록", "/가족후견", "/부산가족관계등록부정정", [], 3, ["가족관계등록부 정정", "생년월일 정정"]],
  ["28", "개명·성본변경", "/가족후견", "/부산개명허가", [], 4, ["개명", "성본변경"]],
  ["29", "성년·미성년후견", "/가족후견", "/부산가정법원성년후견", ["/성년후견자가진단"], 4, ["성년후견", "한정후견"]],
  ["30", "집행문·재산명시·재산조회", "/민사소송", "/부산재산명시", ["/부산집행문부여신청", "/부산채무불이행자명부등재", "/채권압류추심서류준비"], 3, ["재산명시", "재산조회 신청", "집행문 부여", "채무불이행자명부"]],
  ["31", "경매 관련 신청서·등기", "/민사소송", "/부산경매낙찰등기", ["/부산공매낙찰등기", "/부산배당요구신청"], 4, ["경락 소유권이전", "배당요구"]],
  ["32", "가압류", "/민사소송", "/부산가압류신청", ["/가압류신청서류준비", "/부산가압류말소등기"], 4, ["가압류", "가압류 신청"]],
  ["33", "가처분", "/민사소송", "/가처분신청서류준비", ["/부산가처분말소등기"], 3, ["처분금지가처분", "점유이전금지가처분"]],
  ["34", "임대차·보증금", "/민사소송", "/부산임차권등기명령", ["/부산전세보증금반환법무사", "/부산지방법원지급명령"], 5, ["임차권등기명령", "보증금 지급명령"]],
  ["35", "부동산 집단등기", "/부동산등기", "/부산집단등기", ["/집단등기", "/부산입주등기"], 4, ["집단등기", "입주 소유권이전"]],
  ["36", "재개발·재건축", "/부동산등기", "/부산재개발등기", ["/부산재건축등기"], 4, ["재개발 등기", "재건축 등기"]],
  ["37", "토지·농지", "/부동산등기", "/부산토지매매등기", ["/부산토지상속등기", "/부산농업회사법인설립"], 3, ["토지 등기", "농지 소유권이전"]],
  ["38", "건물·집합건물", "/부동산등기", "/부산건물등기", ["/부산집합건물등기", "/부산건물표시변경등기"], 3, ["건물 등기", "집합건물 등기"]],
  ["39", "금융기관 담보", "/부동산등기", "/부산잔금대출근저당", ["/부산중도금대출근저당", "/부산근저당설정등기"], 4, ["은행 근저당 설정", "집단대출 등기"]],
  ["40", "PF·부동산개발", "/부동산등기", "/부산시행사등기", ["/부산신탁등기", "/부산분양등기"], 4, ["PF 담보등기", "시행사 등기", "개발사업 신탁등기"]],
  ["41", "자동차 관련 법원·등록업무", "/민사소송", "", ["/자동차상속명의이전"], 1, ["자동차 저당권", "자동차 가압류"]],
  ["42", "법원 제출서류", "/민사소송", "/민사소송", ["/부산소액소송"], 2, ["법원 제출서류 작성"]],
  ["43", "부동산 부수신고·공과금", "/부동산등기", "/취득세", ["/등기비용", "/상속취득세와등기순서"], 2, ["취득세 신고", "등기 비용"]],
  ["44", "등기 행정 부수업무", "/부동산등기", "/등기신청대행", ["/부산등기보정업무", "/부산등기권리증분실"], 3, ["등기신청 대행", "등기 보정"]],
  ["45", "실종선고·부재자(추가 하위 family)", "/가족후견", "/부산실종선고청구", ["/부산부재자재산관리인"], 3, ["실종선고", "실종선고 청구"]],
  ["46", "집행 증명서(송달·확정증명, 추가)", "/민사소송", "/부산집행문부여신청", [], 2, ["송달증명원", "확정증명원"]],
  ["47", "정비조합 법인등기(추가)", "/부동산등기", "/재건축조합임원변경등기", ["/부산재개발등기"], 3, ["조합 임원변경등기"]],
];
const FAMILIES = Object.fromEntries(FAMILY_DEFS.map(([id, name, hub, primary, secondary, local, terms]) => [id, { id, name, hub, primary, secondary, local, terms }]));

/* ---------------- Legal scope ---------------- */
const BASIS = {
  A: "법무사법 제2조①3호(등기·그 밖의 등록신청 서류 작성)·4호(등기 신청 대리)·7호(제출 대행)",
  B: "법무사법 제2조①4호(공탁 신청 대리)·1호(법원 제출서류 작성)",
  C: "법무사법 제2조①1·2호(법원·검찰청 제출·업무 관련 서류 작성)·7호(제출 대행)",
  D: "법무사법 제2조①7호(1~3호 작성서류의 제출 대행)",
  E: "법무사법 제2조①6호(개인파산·개인회생 신청 대리, 각종 기일 진술 대리 제외)·1호",
  F: "법무사법 제2조①5호(민사집행법 경매·국세징수법 공매 재산취득 상담, 매수신청·입찰신청 대리)",
  G: "법무사법 제2조①8호(1~7호 사무 처리에 부수되는 상담·자문)",
  H: "법무사법 제2조① 각호 해당 여부 개별 확인 필요(타 법령·전문자격 경계)",
  I: "변호사법 제109조(비변호사 소송대리 금지)·법무사법 제2조② — 법무사 업무 아님",
};
const TYPE_NAME = {
  A: "REGISTRATION_AGENCY", B: "DEPOSIT_AGENCY", C: "COURT_DOCUMENT_PREPARATION", D: "SUBMISSION_AGENCY",
  E: "INSOLVENCY_APPLICATION_AGENCY", F: "AUCTION_PURCHASE_AGENCY", G: "INCIDENTAL_CONSULTATION",
  H: "VERIFY_BEFORE_ADVERTISING", I: "EXCLUDED_LITIGATION_REPRESENTATION",
};
function wording(type, name) {
  switch (type) {
    case "A": return [`${name} 신청서류 작성·등기 신청 대리`, "당일 완료 보장, 최저가, 무조건 가능"];
    case "B": return [`${name} 관련 공탁 신청 대리·서류 작성`, "회수 보장, 분쟁 대리, 소송 대리"];
    case "C": return [`${name} — 법원 제출서류 작성·제출 대행`, "소송대리, 법정 출석 대리, 승소·인용 보장, 강제집행 전체 대행"];
    case "D": return [`${name} — 작성서류 제출 대행`, "사건 대리, 변론"];
    case "E": return [`${name} — 신청 대리·서류 작성(각종 기일 진술 대리 제외)`, "인가 보장, 탕감 보장, 기일 대리 출석, 채권자 협상 대리"];
    case "F": return [`${name} — 매수신청·입찰신청 대리(법정 요건 충족 시)`, "낙찰 보장, 수익 보장"];
    case "G": return [`${name} — 등기·법원서류 업무에 부수하는 확인·안내`, "독립 법률자문, 모든 법률문제 해결"];
    case "H": return [`${name} — 관련 법령 확인 후 범위를 정해 안내`, "신고 대리 전문, 세무 대리, 행정 대리 전문"];
    default: return ["(공개 표현 없음 — 법무사 업무로 광고하지 않음)", `${name} 법무사, ${name} 대행`];
  }
}

/* ---------------- Service list ---------------- */
const listText = fs.readFileSync(path.join(ROOT, "scripts/seo-universe/service-list.txt"), "utf8");
const services = [];
let section = 0;
let sectionName = "";
for (const line of listText.split("\n")) {
  const sec = line.match(/^■ (\d+)\. (.+)$/);
  if (sec) { section = Number(sec[1]); sectionName = sec[2].trim(); continue; }
  const it = line.match(/^(\d+)\. (.+)$/);
  if (it) services.push({ id: Number(it[1]), name: it[2].trim(), section, sectionName });
}
const exStart = listText.indexOf("=== EXCLUDED / RESTRICTED AREA START ===");
const excluded = listText.slice(exStart).split("\n").filter((l) => l.startsWith("- ")).map((l) => l.slice(2).trim());
if (services.length !== 348) throw new Error(`service count ${services.length}`);

/* ---------------- Classification ---------------- */
function classify(s) {
  const n = s.name;
  const id = s.id;
  let fam;
  let type = "A";
  let verify = "N";
  let note = "";
  const T = (f, t = "A") => { fam = f; type = t; };
  switch (s.section) {
    case 1:
      if (/분필|합필|지목/.test(n)) T("10");
      else if (/대지권|구분건물/.test(n)) T("11");
      else if (/멸실|건물 표시|토지 표시/.test(n)) T("09");
      else if (/명의인|주소변경|성명변경|주민등록/.test(n)) T("09");
      else if (/가등기|본등기|말소/.test(n)) T("08");
      else if (/공유/.test(n)) T("06");
      else if (/재산분할/.test(n)) T("07");
      else if (/경락/.test(n)) T("31");
      else if (/상속|유증|협의분할/.test(n)) T("05");
      else if (/증여/.test(n)) T("04");
      else if (/매매/.test(n)) T("03");
      else if (/보존/.test(n)) T("01");
      else T("02");
      if (/판결/.test(n)) note = "판결 확정 후 등기신청서 작성·신청 대리. 판결을 받기 위한 소송은 변호사 영역(I)과 구분";
      if (/진정명의/.test(n)) { verify = "Y"; note = "등기원인(진정명의회복) 서류 작성은 가능. 소유권 다툼 소송은 I"; }
      if (/주민등록번호/.test(n)) verify = "Y";
      if (/재산분할/.test(n)) note = "협의·조정·심판 확정 후 등기. 재산분할소송 대리는 I";
      break;
    case 2:
      if (/근저당|저당|담보권/.test(n)) T("12");
      else if (/전세권|임차권/.test(n)) T("13");
      else T("14");
      if (/임차권등기명령/.test(n)) note = "임차권등기는 법원 촉탁으로 기입. 법무사는 임차권등기명령 신청서 작성(C) 범위";
      break;
    case 3: T(/담보신탁/.test(n) ? "40" : "15"); break;
    case 4:
      if (id <= 66) T("05");
      else if (id <= 69) T("05", /서류/.test(n) ? "C" : "G");
      else T("16", "C");
      if (id === 67) type = "A";
      if (/신청$/.test(n) && id >= 70) note = "가정법원 심판청구서 작성·제출 대행. '신청 대리'로 표현하지 않음";
      if (id === 74) note = "특별한정승인: 민법 제1019조③, 안 날부터 3개월";
      if (id === 80) { verify = "Y"; note = "청산(공고·변제)은 한정승인자 본인 의무. 법무사는 관련 서류 작성 범위"; }
      if (id === 64) note = "대습상속: 상속인 범위 확인 후 등기";
      break;
    case 5:
      if (id <= 85) T("17");
      else if ([86, 87, 88, 91].includes(id)) T("19");
      else if ([89, 90, 110, 111].includes(id)) T("20");
      else if (id <= 101) T("18");
      else if (id <= 109) T("21");
      else if (id <= 117) T("22");
      else T("44", "G");
      if ([83, 84, 106, 108, 109, 111].includes(id)) { verify = "Y"; note = "검색 증거 약함·사례 적음. 등기 자체는 A이나 공개 전 실무 검토"; }
      break;
    case 6:
      T("23", "C");
      verify = "Y";
      note = id === 121 || id === 122
        ? "상법 제366조 소수주주 소집허가(비송사건절차법 제72·80·81조) 신청서 작성은 C. 경영권 분쟁 수반 시 소송 영역과 경계 — LEGAL_REVIEW"
        : "비송사건 신청서 작성은 C. 다툼이 있는 사건은 소송대리와 구분";
      break;
    case 7:
      T("24", "E");
      if ([137, 138, 139].includes(id)) { verify = "Y"; note = "변경·폐지 단계는 신청서 작성 범위만. 기일 진술 대리 불가"; }
      if (id === 136) note = "채권자 이의 대응 소송(채권조사확정재판 등 다툼)은 구분";
      break;
    case 8:
      T("25", id === 155 ? "C" : "E");
      if (id === 153) note = "면책불허가 사유 소명자료 작성. 이의 심문 기일 진술 대리 불가";
      if (id === 155) note = "복권 신청서 작성(채무자회생법 제575조 이하) — 법원 제출서류";
      break;
    case 9:
      T("26", id === 169 || id === 168 ? "C" : "B");
      if (id === 160 || id === 159) { verify = "Y"; note = "몰취·보관공탁: 수요·사례 적음"; }
      break;
    case 10:
      if (id === 177) T("45", "C");
      else if ([178, 179, 180, 181].includes(id)) T("28", /신고/.test(n) ? "H" : "C");
      else if ([182, 183, 184, 185].includes(id)) T("27", "C");
      else T("27", "H");
      if (type === "H") { verify = "Y"; note = "시·읍·면 신고(가족관계등록법). 신고서 작성이 법무사법 제2조①3호 '그 밖의 등록신청 서류'에 포함되는지 확인 후 공개. 신고 의무자 본인 신고가 원칙"; }
      if (id === 183) note = "허가 재판서 등본 받은 날부터 1개월 내 정정신청(가족관계등록법 제106조)";
      if (id === 177) note = "민법 제27조, 가사소송규칙 제53·54조(공시최고 6개월 이상), 가족관계등록법 제92조(확정 후 1개월 내 신고)";
      break;
    case 11:
      T("29", id === 195 ? "H" : "C");
      if (id === 195) { verify = "Y"; note = "후견등기법: 심판에 따른 후견등기는 법원 촉탁. 임의후견 등기 신청 범위 확인 필요"; }
      if (id === 190) { verify = "Y"; note = "임의후견계약은 공정증서(민법 제959조의14). 공증은 공증인 업무"; }
      break;
    case 12:
      if (id === 197 || id === 198) T("28", "C");
      else if (id === 199) T("27", "C");
      else if (id === 201) T("29", "C");
      else T("42", "C");
      if (id === 200) { verify = "Y"; note = "친족관계 비송 범위가 넓음 — 사건별 확인. 상속재산분할심판 대리는 I"; }
      break;
    case 13:
      if ([207, 208, 209].includes(id)) T("46", "C");
      else T("30", "C");
      if (id === 204) note = "민사집행법 제35조: 재도부여는 재판장 명령 필요";
      if (id === 205) note = "민사집행법 제31조: 승계가 법원에 명백하거나 증명서로 증명";
      if (id === 213) note = "민사집행법 제70~73조. 등재 신청서 작성(C). 심문 대리 불가";
      if (id === 214) note = "실제 강제집행 대리·집행관 현장 대행은 구분(사용자 목록 주석)";
      break;
    case 14:
      if (id >= 221 && id <= 224) T("31", "A");
      else T("31", "C");
      if (id === 218) note = "민사집행법 제84·88조, 제148조. 배당요구 종기까지 신청해야 배당";
      if (id === 219) note = "채권계산서(민사집행법 제84조④) — 배당요구 페이지 하위 section";
      if (id === 225) note = "매수신청 대리(F, 법무사법 제2조①5호)는 매수신청대리인 등록 요건 별도 확인";
      if ([215, 216].includes(id)) { verify = "Y"; note = "경매신청서 작성은 C. 배당이의 소 등 소송은 I"; }
      break;
    case 15:
      T([230, 231, 233, 235].includes(id) ? "33" : "32", "C");
      if (id === 229) note = "자동차 가압류 — 가압류 페이지 대상재산 section";
      if (id === 234) note = "민사집행법 제287조(제소명령)·제288조(사정변경, 3년 본안 미제기) 취소신청서 작성";
      if (id === 232 || id === 233) note = "해제(집행해제) 신청서 작성 및 말소등기(촉탁) 확인";
      break;
    case 16:
      if ([238, 239, 240].includes(id)) T("13", "A");
      else if (id === 237 || id === 241) T("34", "A");
      else T("34", "C");
      if (id === 242) note = "지급명령 신청서 작성(C). 채무자 이의 후 소송 전환 시 소송대리 불가";
      if (id === 245) verify = "Y";
      break;
    case 17: T(id === 254 ? "11" : "35", "A"); break;
    case 18:
      if ([263, 264, 265].includes(id)) T("47", "A");
      else if (id === 267) T("09", "A");
      else if (id === 268) T("01", "A");
      else T("36", "A");
      if (id === 262) note = "도시정비법 제86조 이전고시 후 소유권이전등기 — 조합 촉탁·신청 구조 확인";
      break;
    case 19:
      if (id === 269) T("01");
      else if (id === 270) T("02");
      else if ([271, 272, 273, 274].includes(id)) T("10");
      else if ([275, 276, 277].includes(id)) T("06");
      else if (id === 279) T("17");
      else T("37");
      if ([271, 272, 274].includes(id)) note = "분할·합병·지목변경 등기는 통상 지적소관청 촉탁(공간정보관리법 제89조) — 수요 검토 후";
      if (id === 278) { verify = "Y"; note = "농지취득자격증명(농지법 제8조) 등 선행요건 확인"; }
      break;
    case 20:
      if (id === 280) T("01");
      else if (id === 281) T("02");
      else if (id === 283) T("09");
      else if (id === 286 || id === 287) T("38");
      else T("09");
      break;
    case 21: T(id >= 296 ? "40" : "39", "A"); break;
    case 22:
      if (id === 298) T("17");
      else if (id === 299) T("18");
      else T("40");
      if (id === 300 || id === 306) note = "부동산등기법 제81·82·87조의2(신탁원부·동시신청·담보권신탁)";
      break;
    case 23:
      T("41", id >= 309 ? "C" : "H");
      if (type === "H") { verify = "Y"; note = "자동차저당법·자동차등록령: 등록신청 서류 작성(3호)은 가능하나 4호 '신청 대리'는 등기·공탁 한정 — 대리 표현 금지"; }
      break;
    case 24:
      if ([319, 320, 321].includes(id)) T("46", "C");
      else if (id === 322) T("30", "C");
      else if (id === 317) T("42", "D");
      else if (id === 318) T("42", "G");
      else T("42", "C");
      break;
    case 25:
      if (id <= 329) {
        T("43", "H");
        verify = "Y";
        note = id === 324
          ? "부동산거래신고법 제3조: 신고의무자는 거래당사자·중개사. 제출 대행 범위 확인"
          : "지방세 신고 — 세무사법 경계. 등기 신청에 부수하는 신고서 작성·납부 대행 범위만 안내";
      } else if (id <= 331) T("44", "G");
      else T("44", "A");
      break;
    default:
      if (id === 344 || id === 346) T("44", "A");
      else if (id === 345) T("44", "A");
      else if (id === 347) T("42", "C");
      else if (id === 348) { T("44", "H"); verify = "Y"; note = "'각종 행정절차 대행'은 범위가 넓음 — 법원·등기소 제출 대행(7호)으로 한정해 표현"; }
      else T("44", "G");
  }
  return { fam, type, verify, note };
}

/* ---------------- Decisions ---------------- */
const D = (decision, url, reason) => ({ decision, url, reason });
function decide(s, c) {
  const id = s.id;
  const fam = FAMILIES[c.fam];
  const pick = {
    10: D("KEEP", "/부산공유물분할등기", "SERP #1"), 11: D("KEEP", "/부산지분이전등기", "기존 지분이전 페이지"),
    14: D("WATCHLIST", "/부산소유권이전등기", "자동완성 有, 소송 연계 비중 큼 — 등기 section 후보"),
    6: D("KEEP", "/전국유증등기", "기존 유증 페이지"), 65: D("KEEP", "/전국유증등기", "기존 유증 페이지"),
    7: D("KEEP", "/부산상속등기", ""), 8: D("KEEP", "/부산상속등기", ""), 61: D("KEEP", "/부산상속등기", ""), 62: D("KEEP", "/부산상속등기", ""), 63: D("KEEP", "/부산상속등기", ""), 66: D("KEEP", "/상속재산분할협의서준비", ""),
    64: D("KEEP", "/대습상속등기", "기존 대습상속 페이지"),
    12: D("KEEP", "/부산경매낙찰등기", ""), 13: D("KEEP", "/부산소유권이전등기", "판결 등기 section"),
    17: D("KEEP", "/부산말소등기", ""), 18: D("KEEP", "/부산말소등기", ""),
    19: D("KEEP", "/부산등기명의인표시변경", ""), 20: D("KEEP", "/부산등기명의인표시변경", ""), 21: D("KEEP", "/부산등기명의인표시변경", ""), 22: D("KEEP", "/부산등기명의인표시변경", ""),
    23: D("KEEP", "/부산건물표시변경등기", ""), 24: D("WATCHLIST", "", "토지 표시변경은 대장 정리 후 촉탁 비중 큼"),
    25: D("KEEP", "/부산건물멸실등기", ""),
    26: D("WATCHLIST", "", "지적소관청 촉탁 구조, Daom은 인접 페이지만 노출"), 27: D("WATCHLIST", "", "지적소관청 촉탁 구조"), 28: D("WATCHLIST", "", "지적소관청 촉탁 구조"),
    29: D("KEEP", "/부산대지권등기", ""), 30: D("KEEP", "/부산집합건물등기", ""),
    31: D("KEEP", "/부산근저당설정등기", "SERP #1"), 32: D("ADD_SECTION", "/부산근저당설정등기", "변경(채권최고액·채무자) section 추가 — 부동산등기법 제52조5호"),
    33: D("ADD_SECTION", "/부산근저당설정등기", "이전(확정채권양도·계약양도) section 추가"), 34: D("KEEP", "/부산근저당말소등기", "근저당 말소 대표 URL"),
    35: D("KEEP", "/부산근저당설정등기", ""), 36: D("ADD_SECTION", "/부산근저당설정등기", "변경 section에 포함"), 37: D("ADD_SECTION", "/부산근저당설정등기", "이전 section에 포함"), 38: D("KEEP", "/부산근저당말소등기", ""),
    39: D("KEEP", "/부산전세권설정등기", ""), 40: D("WATCHLIST", "/부산전세권설정등기", "전세권 변경 section 후보(Wave 2)"), 41: D("WATCHLIST", "/부산전세권설정등기", "전세권 이전 수요 미확인"), 42: D("KEEP", "/부산전세권말소등기", ""),
    43: D("KEEP", "/부산지상권설정등기", ""), 44: D("KEEP", "/부산지상권설정등기", ""), 45: D("KEEP", "/부산지상권설정등기", ""), 46: D("KEEP", "/부산지상권설정등기", ""),
    47: D("WATCHLIST", "", "지역권 검색 증거 없음"), 48: D("WATCHLIST", "", "지역권 검색 증거 없음"), 49: D("WATCHLIST", "", "지역권 검색 증거 없음"),
    50: D("KEEP", "/부산임차권등기명령", ""), 51: D("KEEP", "/부산임차권등기명령", ""), 52: D("KEEP", "/부산근저당설정등기", ""),
    55: D("KEEP", "/부산신탁등기", "신탁말소 SERP #2"), 57: D("UPGRADE_EXISTING", "/부산시행사등기", "담보신탁·PF section 추가"),
    70: D("KEEP", "/부산상속포기", ""), 71: D("KEEP", "/부산상속포기", ""), 72: D("KEEP", "/부산한정승인", ""), 73: D("KEEP", "/부산한정승인", ""), 74: D("KEEP", "/특별한정승인", ""),
    75: D("KEEP", "/부산한정승인", ""), 76: D("KEEP", "/부산상속포기", ""), 77: D("KEEP", "/부산한정승인", ""), 78: D("KEEP", "/상속포기후다음순위확인", ""), 79: D("KEEP", "/부산한정승인", ""), 80: D("KEEP", "/부산상속재산관리인", ""),
    82: D("KEEP", "/부산유한회사설립등기", ""), 83: D("WATCHLIST", "", "자동완성 1건, 사례 없음"), 84: D("WATCHLIST", "", "검색 증거 없음"),
    86: D("KEEP", "/부산지점설치등기", ""), 88: D("KEEP", "/부산지점폐지등기", ""), 89: D("KEEP", "/부산상호변경등기", ""), 92: D("KEEP", "/부산대표이사변경등기", ""),
    94: D("KEEP", "/부산임원사임해임등기", ""), 95: D("KEEP", "/부산임원임기만료등기", ""), 98: D("KEEP", "/부산임원임기만료등기", ""),
    104: D("KEEP", "/부산감자등기", "SERP #1"), 106: D("WATCHLIST", "", ""), 107: D("WATCHLIST", "", ""), 108: D("WATCHLIST", "", ""), 109: D("WATCHLIST", "", ""),
    111: D("WATCHLIST", "", "조직변경 수요 미확인"),
    116: D("KEEP", "/부산휴면법인계속등기", ""), 117: D("KEEP", "/부산휴면법인계속등기", ""),
    121: D("LEGAL_REVIEW_REQUIRED", "", "SERP가 경영권 분쟁 로펌 위주, 자동완성 없음"), 122: D("LEGAL_REVIEW_REQUIRED", "", "분쟁성 사건 경계"),
    137: D("KEEP", "/부산개인회생", "변경 section 후보(Wave 2)"), 142: D("KEEP", "/부산개인회생", "재신청 section 후보(Wave 2)"),
    140: D("KEEP", "/부산개인회생", ""), 145: D("KEEP", "/부산면책신청", ""), 152: D("KEEP", "/부산면책신청", ""), 153: D("WATCHLIST", "/부산면책신청", "소명 section 후보"), 155: D("WATCHLIST", "/부산면책신청", "복권 section 후보"),
    156: D("KEEP", "/부산변제공탁", "대표 URL — /공탁채권회수 역할 정리 필요"), 157: D("KEEP", "/부산담보공탁", ""), 158: D("KEEP", "/부산집행공탁", ""),
    159: D("WATCHLIST", "/부산공탁", ""), 160: D("WATCHLIST", "/부산공탁", ""),
    163: D("KEEP", "/공탁금출급회수", ""), 164: D("KEEP", "/공탁금출급회수", ""), 165: D("KEEP", "/공탁금출급회수", ""), 166: D("KEEP", "/공탁금출급회수", ""),
    177: D("NEW_SERVICE_PAGE", "/부산실종선고청구", "자동완성 '실종선고 법무사/비용/절차', SERP Daom 부재"),
    182: D("NEW_SERVICE_PAGE", "/부산가족관계등록부정정", "자동완성 '정정하는 방법', SERP Daom 부재"),
    183: D("ADD_SECTION", "/부산가족관계등록부정정", "허가 후 1개월 내 정정신청 section"), 184: D("ADD_SECTION", "/부산가족관계등록부정정", ""), 185: D("ADD_SECTION", "/부산가족관계등록부정정", ""),
    199: D("SKIP_DUPLICATE", "/부산가족관계등록부정정", "182와 동일 의도"),
    178: D("KEEP", "/부산개명허가", "SERP #2"), 179: D("KEEP", "/부산개명허가", ""), 180: D("KEEP", "/부산개명허가", "성본변경 SERP #5 — 동일 URL"), 181: D("KEEP", "/부산개명허가", ""),
    197: D("SKIP_DUPLICATE", "/부산개명허가", "178과 동일"), 198: D("SKIP_DUPLICATE", "/부산개명허가", "180과 동일"),
    188: D("KEEP", "/부산가정법원성년후견", "한정후견 SERP #4 — 같은 URL에서 다룸"), 190: D("WATCHLIST", "", "공정증서 필요, 수요 미확인"), 196: D("WATCHLIST", "", "미성년후견 수요 미확인"), 200: D("WATCHLIST", "", ""),
    203: D("NEW_SERVICE_PAGE", "/부산집행문부여신청", "자동완성 '집행문 부여 신청 방법/신청서', SERP Daom 부재"),
    204: D("ADD_SECTION", "/부산집행문부여신청", "재도부여 section"), 205: D("ADD_SECTION", "/부산집행문부여신청", "승계집행문 section"), 206: D("ADD_SECTION", "/부산집행문부여신청", ""),
    207: D("ADD_SECTION", "/부산집행문부여신청", "송달·확정증명 section"), 208: D("ADD_SECTION", "/부산집행문부여신청", ""), 209: D("ADD_SECTION", "/부산집행문부여신청", ""), 210: D("ADD_SECTION", "/부산집행문부여신청", ""),
    211: D("KEEP", "/부산재산명시", ""), 212: D("KEEP", "/부산재산명시", "재산조회 연계 설명 존재"),
    213: D("NEW_SERVICE_PAGE", "/부산채무불이행자명부등재", "자동완성 '등재 비용/말소/셀프', SERP Daom 부재"),
    214: D("KEEP", "/민사소송", ""),
    215: D("WATCHLIST", "", "경매신청서 작성 수요 미조사"), 216: D("WATCHLIST", "", "경매신청서 작성 수요 미조사"), 217: D("WATCHLIST", "", ""),
    218: D("NEW_SERVICE_PAGE", "/부산배당요구신청", "자동완성 '배당요구신청서' 다수, SERP Daom 부재"), 219: D("ADD_SECTION", "/부산배당요구신청", "채권계산서 section"),
    220: D("WATCHLIST", "", ""), 221: D("KEEP", "/부산경매낙찰등기", ""), 222: D("KEEP", "/부산경매낙찰등기", ""), 223: D("KEEP", "/부산경매낙찰등기", ""), 224: D("KEEP", "/부산공매낙찰등기", ""), 225: D("KEEP", "/부산경매낙찰등기", ""),
    226: D("NEW_SERVICE_PAGE", "/부산가압류신청", "'부산 가압류 법무사' SERP Daom 부재, 자동완성 '부산 가압류 취소방법'"),
    227: D("ADD_SECTION", "/부산가압류신청", "대상재산별 section"), 228: D("ADD_SECTION", "/부산가압류신청", ""), 229: D("ADD_SECTION", "/부산가압류신청", ""),
    232: D("KEEP", "/부산가압류말소등기", ""), 234: D("ADD_SECTION", "/부산가압류신청", "제소명령·사정변경 취소 section"),
    230: D("KEEP", "/가처분신청서류준비", ""), 231: D("KEEP", "/가처분신청서류준비", ""), 233: D("KEEP", "/부산가처분말소등기", ""), 235: D("KEEP", "/가처분신청서류준비", ""),
    236: D("KEEP", "/부산임차권등기명령", "대표 URL — 전세 페이지와 역할 정리"), 237: D("KEEP", "/부산임차권등기명령", ""),
    238: D("KEEP", "/부산전세권설정등기", ""), 239: D("KEEP", "/부산전세권말소등기", ""), 240: D("WATCHLIST", "/부산전세권설정등기", ""),
    242: D("KEEP", "/부산지방법원지급명령", ""), 243: D("KEEP", "/부산전세보증금반환법무사", ""), 244: D("KEEP", "/부산전세보증금반환법무사", ""), 245: D("WATCHLIST", "", "상가임대차 수요 미조사"),
    252: D("KEEP", "/지식산업센터보존등기", "SERP #1"), 253: D("KEEP", "/지식산업센터보존등기", ""), 254: D("KEEP", "/부산대지권등기", ""),
    260: D("KEEP", "/부산재건축등기", ""), 261: D("KEEP", "/부산재건축등기", ""), 262: D("WATCHLIST", "/부산재개발등기", "이전고시 section 후보"),
    267: D("KEEP", "/부산건물멸실등기", ""), 268: D("KEEP", "/부산신축건물보존등기", ""), 269: D("WATCHLIST", "", "미등기 토지 보존 수요 미조사"),
    271: D("WATCHLIST", "", ""), 272: D("WATCHLIST", "", ""), 273: D("WATCHLIST", "", ""), 274: D("WATCHLIST", "", ""),
    275: D("KEEP", "/부산공유물분할등기", ""), 276: D("KEEP", "/부산지분이전등기", ""), 277: D("KEEP", "/부산공유물분할등기", ""),
    278: D("WATCHLIST", "", "농지법 선행요건"), 279: D("KEEP", "/부산농업회사법인설립", ""),
    280: D("KEEP", "/부산신축건물보존등기", ""), 283: D("KEEP", "/부산건물멸실등기", ""), 284: D("KEEP", "/부산건물표시변경등기", ""), 285: D("KEEP", "/부산건물표시변경등기", ""),
    289: D("KEEP", "/부산근저당말소등기", ""), 290: D("ADD_SECTION", "/부산근저당설정등기", "변경 section"), 291: D("ADD_SECTION", "/부산근저당설정등기", "이전 section"),
    295: D("KEEP", "/부산집단등기", ""), 296: D("UPGRADE_EXISTING", "/부산시행사등기", "담보신탁 section"), 297: D("UPGRADE_EXISTING", "/부산시행사등기", "PF 담보 section — SERP #4"),
    298: D("KEEP", "/부산시행사등기", ""), 299: D("KEEP", "/부산시행사등기", ""), 300: D("UPGRADE_EXISTING", "/부산시행사등기", "개발신탁 section"),
    301: D("KEEP", "/부산신축건물보존등기", ""), 303: D("KEEP", "/부산분양등기", ""), 304: D("KEEP", "/부산신축건물보존등기", ""), 305: D("KEEP", "/부산집단등기", ""), 306: D("UPGRADE_EXISTING", "/부산시행사등기", "PF section"),
    307: D("WATCHLIST", "", "자동차 등록 — 대리 표현 제한"), 308: D("WATCHLIST", "", ""), 309: D("ADD_SECTION", "/부산가압류신청", "자동차 가압류 section"), 310: D("WATCHLIST", "", ""), 311: D("WATCHLIST", "", ""),
    319: D("ADD_SECTION", "/부산집행문부여신청", ""), 320: D("ADD_SECTION", "/부산집행문부여신청", ""), 321: D("ADD_SECTION", "/부산집행문부여신청", ""), 322: D("SKIP_DUPLICATE", "/부산집행문부여신청", "203과 동일"),
    324: D("SKIP_DUPLICATE", "", "독립 페이지 금지 — 거래신고는 매매등기 section에서 언급"), 325: D("KEEP", "/취득세", ""),
    326: D("SKIP_DUPLICATE", "/등기비용", ""), 327: D("SKIP_DUPLICATE", "/등기비용", ""), 328: D("SKIP_DUPLICATE", "/등기비용", ""), 329: D("SKIP_DUPLICATE", "/취득세", ""),
    330: D("KEEP", "/등기비용", ""), 334: D("KEEP", "/부산등기보정업무", ""),
  };
  if (pick[id]) return pick[id];
  if (c.type === "H") return D("SKIP_DUPLICATE", fam.primary && exists(fam.primary) ? fam.primary : "", "VERIFY_BEFORE_ADVERTISING — 독립 페이지 생성 안 함");
  if (c.type === "G") return D("SKIP_DUPLICATE", fam.primary || "", "부수업무 — 대표 업무 페이지 안에서만 언급");
  if (fam.primary && exists(fam.primary)) return D("KEEP", fam.primary, "family 대표 URL이 포괄");
  return D("WATCHLIST", "", "대표 URL 없음·증거 미확인");
}

/* ---------------- Naver evidence ---------------- */
const evidenceRaw = fs.readFileSync(path.join(OUT, "raw-naver-evidence.md"), "utf8");
const serp = [];
for (const m of evidenceRaw.matchAll(/^\| (\d+) \| ([^|]+) \| OK \| ([^|]+(?:\\\|[^|]+)*) \| ([^|]+) \| [^|]+ \|$/gm)) {
  serp.push({ query: m[2].trim(), daom: m[3].trim(), top: m[4].trim() });
}
const autocomplete = [];
for (const m of evidenceRaw.matchAll(/^\| (\d+) \| ([^|]+) \| OK(?: \(empty\))? \| ([^|]+) \|$/gm)) {
  autocomplete.push({ term: m[2].trim(), suggestions: m[3].trim() });
}
const norm = (s) => s.replace(/\s+/g, "");
const acSet = new Map();
for (const a of autocomplete) for (const sug of a.suggestions.split(";").map((x) => x.trim()).filter((x) => x && !x.startsWith("("))) acSet.set(norm(sug), a.term);
const serpByQuery = new Map(serp.map((s) => [norm(s.query), s]));

/* ---------------- Outputs ---------------- */
const classified = services.map((s) => ({ s, c: classify(s) }));
for (const { s, c } of classified) if (!c.fam || !FAMILIES[c.fam]) throw new Error(`unmapped ${s.id} ${s.name}`);

// 01 legal scope
const r01 = classified.map(({ s, c }) => {
  const [safe, unsafe] = wording(c.type, s.name);
  return {
    SERVICE_ID: s.id, ORIGINAL_SERVICE_NAME: s.name, SECTION: `■${s.section} ${s.sectionName}`,
    SERVICE_FAMILY: `${c.fam} ${FAMILIES[c.fam].name}`, LEGAL_SCOPE_TYPE: `${c.type}. ${TYPE_NAME[c.type]}`,
    LEGAL_BASIS: BASIS[c.type], SAFE_PUBLIC_WORDING: safe, UNSAFE_WORDING: unsafe, VERIFY_REQUIRED: c.verify, NOTES: c.note,
  };
});
excluded.forEach((name, i) => {
  const [safe, unsafe] = wording("I", name);
  r01.push({
    SERVICE_ID: `X${String(i + 1).padStart(2, "0")}`, ORIGINAL_SERVICE_NAME: name, SECTION: "EXCLUDED / RESTRICTED",
    SERVICE_FAMILY: "EX 제외(변호사 업무)", LEGAL_SCOPE_TYPE: "I. EXCLUDED_LITIGATION_REPRESENTATION", LEGAL_BASIS: BASIS.I,
    SAFE_PUBLIC_WORDING: safe, UNSAFE_WORDING: unsafe, VERIFY_REQUIRED: "N", NOTES: "관련 검색어는 '법원 제출서류 작성 범위'로만 재설계 가능 여부 검토",
  });
});

// 02 families
const r02 = Object.values(FAMILIES).map((f) => {
  const members = classified.filter((x) => x.c.fam === f.id);
  const types = {};
  members.forEach((x) => { types[x.c.type] = (types[x.c.type] || 0) + 1; });
  return {
    FAMILY_ID: f.id, FAMILY_NAME: f.name, SERVICE_COUNT: members.length,
    SERVICE_IDS: members.map((x) => x.s.id).join(" "), LEGAL_TYPES: Object.entries(types).map(([k, v]) => `${k}:${v}`).join(" "),
    PARENT_HUB: f.hub, PRIMARY_URL: f.primary || "(없음)", PRIMARY_STATUS: !f.primary ? "NONE" : routes.has(f.primary) ? "EXISTING" : NEW_PAGES[f.primary] ? "NEW_WAVE1" : "MISSING",
    SECONDARY_URLS: f.secondary.filter(exists).join(" "), LOCAL_RELEVANCE: f.local,
  };
});

// 03 keyword universe + 04 evidence
const INTENTS = [
  ["SERVICE", (t) => `부산 ${t} 법무사`],
  ["COST", (t) => `부산 ${t} 비용`],
  ["DOCS", (t) => `${t} 필요서류`],
  ["PROCEDURE", (t) => `${t} 신청 방법`],
  ["TIME", (t) => `${t} 기간`],
];
const PROBLEM_QUERIES = [
  ["대출 다 갚았는데 근저당 말소", "12", "/부산근저당말소등기"],
  ["보증금 못받음 임차권등기명령", "34", "/부산임차권등기명령"],
  ["집주인 연락 안됨 보증금", "34", "/부산전세보증금반환법무사"],
  ["부모님 사망 집 명의 변경", "05", "/부산상속등기"],
  ["상속 빚 상속포기 기한", "16", "/부산상속포기"],
  ["법인 임원 임기 만료 등기", "18", "/부산임원임기만료등기"],
  ["돈 못받음 가압류", "32", "/부산가압류신청"],
  ["판결 받았는데 돈 안줌 집행문", "30", "/부산집행문부여신청"],
  ["채무자 재산 모름 재산명시", "30", "/부산재산명시"],
  ["경매 넘어간 집 보증금 배당요구", "31", "/부산배당요구신청"],
  ["가족관계증명서 생년월일 틀림", "27", "/부산가족관계등록부정정"],
  ["연락 끊긴 가족 실종선고", "45", "/부산실종선고청구"],
  ["채권자 공탁 받아주지 않음 변제공탁", "26", "/부산변제공탁"],
  ["휴면법인 다시 살리기", "22", "/부산휴면법인계속등기"],
  ["대표이사 바뀜 등기", "18", "/부산대표이사변경등기"],
];
const termUrl = {
  "근저당 말소": "/부산근저당말소등기", "근저당 변경": "/부산근저당설정등기", "전세권 말소": "/부산전세권말소등기",
  "신탁말소": "/부산신탁등기", "한정승인": "/부산한정승인", "특별한정승인": "/특별한정승인", "유한회사 설립": "/부산유한회사설립등기",
  "임원 중임등기": "/부산임원임기만료등기", "대표이사 변경": "/부산대표이사변경등기", "지점설치등기": "/부산지점설치등기",
  "상호변경등기": "/부산상호변경등기", "감자등기": "/부산감자등기", "휴면법인 계속등기": "/부산휴면법인계속등기",
  "개인회생 신청": "/부산개인회생신청", "파산 면책": "/부산면책신청", "공탁금 출급": "/공탁금출급회수", "성본변경": "/부산개명허가",
  "한정후견": "/부산가정법원성년후견", "집행문 부여": "/부산집행문부여신청", "채무불이행자명부": "/부산채무불이행자명부등재",
  "재산조회 신청": "/부산재산명시", "배당요구": "/부산배당요구신청", "보증금 지급명령": "/부산지방법원지급명령",
  "재건축 등기": "/부산재건축등기", "농지 소유권이전": "", "집합건물 등기": "/부산집합건물등기", "집단대출 등기": "/부산집단등기",
  "시행사 등기": "/부산시행사등기", "개발사업 신탁등기": "/부산시행사등기", "등기 보정": "/부산등기보정업무", "등기 비용": "/등기비용",
  "지분이전등기": "/부산지분이전등기", "건물멸실등기": "/부산건물멸실등기", "가등기 말소": "/부산가등기", "전세권 설정": "/부산전세권설정등기",
  "명의변경": "/부산명의변경등기", "아파트 매매등기": "/부산아파트매매등기", "부부간 증여등기": "/부산부부간증여등기",
  "입주 소유권이전": "/부산입주등기", "지역권 설정": "", "토지 합필등기": "", "검사인 선임": "", "자동차 가압류": "/부산가압류신청",
  "송달증명원": "/부산집행문부여신청", "확정증명원": "/부산집행문부여신청", "조합 임원변경등기": "/재건축조합임원변경등기",
};
const r03 = [];
const seenQ = new Set();
for (const f of Object.values(FAMILIES)) {
  for (const t of f.terms) {
    const url = t in termUrl ? termUrl[t] : f.primary;
    for (const [intent, fmt] of INTENTS) {
      const q = fmt(t);
      if (seenQ.has(norm(q))) continue;
      seenQ.add(norm(q));
      r03.push({ QUERY: q, FAMILY: `${f.id} ${f.name}`, AXIS: `업무명+${intent === "SERVICE" ? "전문가 탐색" : "행동"}`, INTENT: intent, TARGET_URL: url && exists(url) ? url : "" });
    }
  }
}
for (const [q, fid, url] of PROBLEM_QUERIES) {
  seenQ.add(norm(q));
  r03.push({ QUERY: q, FAMILY: `${fid} ${FAMILIES[fid].name}`, AXIS: "문제 표현", INTENT: "PROBLEM", TARGET_URL: exists(url) ? url : "" });
}
for (const s of serp) {
  if (seenQ.has(norm(s.query))) continue;
  seenQ.add(norm(s.query));
  r03.push({ QUERY: s.query, FAMILY: "", AXIS: "Broad seed / SERP 조사", INTENT: "SERVICE", TARGET_URL: "" });
}
function evidenceFor(q) {
  const sp = serpByQuery.get(norm(q));
  if (sp) return { level: "C", detail: `Naver web SERP 2026-10-04 실측. Daom: ${sp.daom.replace(/`/g, "")}` };
  if (acSet.has(norm(q))) return { level: "C", detail: `Naver 자동완성 노출(입력어 '${acSet.get(norm(q))}', 2026-10-04)` };
  const base = norm(q).replace(/^부산/, "").replace(/(법무사|비용|필요서류|신청방법|기간)$/, "");
  const hit = [...acSet.keys()].find((k) => k.includes(base) && base.length >= 3);
  if (hit) return { level: "C", detail: `관련 자동완성 존재('${hit}') — 정확 일치 아님` };
  return { level: "F", detail: "미조사 — 신규 URL 근거로 사용하지 않음(SEARCH_VOLUME 미확인)" };
}
r03.forEach((r) => {
  const e = evidenceFor(r.QUERY);
  r.EVIDENCE_LEVEL = e.level;
  r.SEARCH_VOLUME = "UNKNOWN";
});
const r04 = [
  { QUERY: "(전체)", SOURCE: "Naver Search Advisor", EVIDENCE_LEVEL: "A", EVIDENCE_DETAIL: "접근 권한 없음 — 사용자 계정 로그인 필요(18-naver-manual-checklist.md)", SEARCH_VOLUME: "UNKNOWN", DAOM_PRESENT: "", CHECKED_AT: "" },
  { QUERY: "(전체)", SOURCE: "Naver 검색광고 키워드도구", EVIDENCE_LEVEL: "B", EVIDENCE_DETAIL: "접근 권한 없음 — 검색량 숫자 미기록", SEARCH_VOLUME: "UNKNOWN", DAOM_PRESENT: "", CHECKED_AT: "" },
  ...serp.map((s) => ({ QUERY: s.query, SOURCE: "Naver web SERP", EVIDENCE_LEVEL: /^YES/.test(s.daom) ? "C" : "D", EVIDENCE_DETAIL: `Top: ${s.top.replace(/\*\*/g, "")}`, SEARCH_VOLUME: "UNKNOWN", DAOM_PRESENT: s.daom.replace(/`/g, ""), CHECKED_AT: "2026-10-04" })),
  ...autocomplete.map((a) => ({ QUERY: a.term, SOURCE: "Naver 자동완성", EVIDENCE_LEVEL: a.suggestions.startsWith("(") ? "F" : "C", EVIDENCE_DETAIL: a.suggestions, SEARCH_VOLUME: "UNKNOWN", DAOM_PRESENT: "", CHECKED_AT: "2026-10-04" })),
  ...r03.filter((r) => r.EVIDENCE_LEVEL !== "F").map((r) => ({ QUERY: r.QUERY, SOURCE: "derived", EVIDENCE_LEVEL: r.EVIDENCE_LEVEL, EVIDENCE_DETAIL: evidenceFor(r.QUERY).detail, SEARCH_VOLUME: "UNKNOWN", DAOM_PRESENT: "", CHECKED_AT: "2026-10-04" })),
];

// 05 regional matrix
const regional = parseCsv(fs.readFileSync(path.join(AUDIT, "05-current-regional-pages.csv"), "utf8").replace(/^\uFEFF/, ""));
const guPagesByFamilyTerm = (terms) => regional.filter((r) => r.REGION_SCOPE === "BUSAN_GU" && terms.some((t) => r.TITLE.includes(t.split(" ")[0]))).length;
const r05 = Object.values(FAMILIES).map((f) => {
  const gu = guPagesByFamilyTerm(f.terms);
  return {
    FAMILY: `${f.id} ${f.name}`, LOCAL_RELEVANCE: f.local, LEVEL1_BUSAN_URL: f.primary && exists(f.primary) ? f.primary : "",
    EXISTING_GU_PAGES: gu,
    LEVEL2_DECISION: f.local >= 5 && gu ? "기존 구 페이지 유지·부산 대표 URL로 상향 링크" : "구별 신규 페이지 생성 안 함 — 부산 대표 URL이 long-tail 포괄",
    LEVEL3_DECISION: "동 단위 신규 금지(지역 고유 정보·수요 증거 없음)",
    EVIDENCE: "구 단위 Naver 수요 미조사 → SEARCH_VOLUME UNKNOWN",
  };
});

// 06 coverage
const r06 = classified.map(({ s, c }) => {
  const d = decide(s, c);
  const f = FAMILIES[c.fam];
  return {
    SERVICE_ID: s.id, ORIGINAL_SERVICE_NAME: s.name, FAMILY: `${c.fam} ${f.name}`,
    COVERING_URL: d.url, URL_STATUS: !d.url ? "NONE" : routes.has(d.url) ? "EXISTING" : NEW_PAGES[d.url] ? "NEW_WAVE1" : "MISSING",
    FAMILY_PRIMARY: f.primary, COVERAGE: !d.url ? "GAP_OR_WATCH" : d.decision === "ADD_SECTION" || d.decision === "UPGRADE_EXISTING" ? "PARTIAL→SECTION" : d.decision === "NEW_SERVICE_PAGE" ? "TRUE_GAP→NEW" : "COVERED",
    DECISION: d.decision, REASON: d.reason,
  };
});
const missing = r06.filter((r) => r.URL_STATUS === "MISSING");
if (missing.length) throw new Error(`covering URL missing: ${missing.map((r) => `${r.SERVICE_ID}:${r.COVERING_URL}`).join(", ")}`);

// 07 ownership
const titleOf = new Map(metadata.map((m) => [m.ROUTE, m.TITLE]));
const h1Of = new Map(metadata.map((m) => [m.ROUTE, m.H1]));
function coreTokens(q) {
  return q.replace(/부산|법무사|비용|필요서류|신청 방법|기간|신청/g, " ").split(/\s+/).filter((t) => t.length >= 2);
}
const regionalChild = new Set(regional.filter((r) => r.REGION_SCOPE === "BUSAN_GU" || r.REGION_SCOPE === "BUSAN_PLACE").map((r) => r.ROUTE));
function competitors(q, primary) {
  const toks = coreTokens(q);
  if (!toks.length) return [];
  return metadata
    .filter((m) => m.ROUTE !== primary && !regionalChild.has(m.ROUTE) && !m.ROUTE.startsWith("/blog/") && !m.ROUTE.startsWith("/업무사례/") && m.TITLE.includes("부산") && toks.every((t) => norm(m.TITLE).includes(norm(t))))
    .map((m) => m.ROUTE);
}
const SERP_COMPETING = {
  "부산 변제공탁": ["/공탁채권회수"],
  "부산 임차권등기 법무사": ["/전세사기피해대응절차", "/부산전세전문법무사"],
  "부산 상속 법무사": ["/부산상속포기"],
};
const OWN_EXTRA = [
  ["부산 근저당 말소", "SERVICE", "/부산근저당말소등기"],
  ["부산 공유물분할등기", "SERVICE", "/부산공유물분할등기"],
  ["부산 개명 법무사", "SERVICE", "/부산개명허가"],
  ["부산 변제공탁", "SERVICE", "/부산변제공탁"],
  ["부산 임차권등기명령", "SERVICE", "/부산임차권등기명령"],
  ["부산 임차권등기 법무사", "SERVICE", "/부산임차권등기명령"],
  ["부산 법인 해산 청산", "SERVICE", "/부산법인해산청산등기"],
  ["부산 집단등기", "SERVICE", "/부산집단등기"],
  ["부산 PF 담보등기", "SERVICE", "/부산시행사등기"],
  ["부산 상속 법무사", "SERVICE", "/부산상속법무사"],
  ["부산 가족관계등록부 정정", "SERVICE", "/부산가족관계등록부정정"],
  ["부산 배당요구 신청", "SERVICE", "/부산배당요구신청"],
  ["집행문 부여 신청 법무사", "SERVICE", "/부산집행문부여신청"],
  ["채무불이행자명부 등재 신청", "SERVICE", "/부산채무불이행자명부등재"],
  ["실종선고 청구 법무사", "SERVICE", "/부산실종선고청구"],
  ["부산 가압류 법무사", "SERVICE", "/부산가압류신청"],
  ["부산 성본변경", "SERVICE", "/부산개명허가"],
  ["부산 한정후견", "SERVICE", "/부산가정법원성년후견"],
  ["신탁말소등기 법무사", "SERVICE", "/부산신탁등기"],
  ["부산 감자등기", "SERVICE", "/부산감자등기"],
  ["부산 지식산업센터 보존등기", "SERVICE", "/지식산업센터보존등기"],
];
const kmap = JSON.parse(fs.readFileSync(path.join(ROOT, "seo/keyword-map.json"), "utf8")).queries;
const kmapByNorm = new Map();
for (const [q, row] of Object.entries(kmap)) {
  const base = row.aliasOf && kmap[row.aliasOf] ? kmap[row.aliasOf] : row;
  kmapByNorm.set(norm(q), { q, owner: base.owner, supporting: base.supporting || [] });
}
const ownMap = new Map();
for (const [q, intent, url] of OWN_EXTRA) ownMap.set(norm(q), { q, intent, url });
for (const r of r03) if (r.TARGET_URL && !ownMap.has(norm(r.QUERY))) ownMap.set(norm(r.QUERY), { q: r.QUERY, intent: r.INTENT, url: r.TARGET_URL });
for (const [k, v] of ownMap) {
  const km = kmapByNorm.get(k);
  v.source = km ? "keyword-map" : "audit";
  if (km && km.owner !== v.url) { v.auditUrl = v.url; v.url = km.owner; }
}
for (const [k, km] of kmapByNorm) {
  if (!ownMap.has(k) && km.q.includes("부산")) ownMap.set(k, { q: km.q, intent: "SERVICE", url: km.owner, source: "keyword-map" });
}
const r07 = [...ownMap.values()].map(({ q, intent, url, source, auditUrl }) => {
  const famRow = Object.values(FAMILIES).find((f) => f.primary === url || f.secondary.includes(url));
  const supporting = new Set(kmapByNorm.get(norm(q))?.supporting || []);
  const comp = [...new Set([...(SERP_COMPETING[q] || []), ...competitors(q, url)])].filter((u) => u !== url && (SERP_COMPETING[q]?.includes(u) || !supporting.has(u))).slice(0, 6);
  const e = evidenceFor(q);
  return {
    QUERY: q, INTENT: intent, PRIMARY_URL: url, OWNER_SOURCE: auditUrl ? `keyword-map (감사 후보 ${auditUrl} 대신 기존 owner 유지)` : source,
    SECONDARY_URLS: famRow ? [famRow.primary, ...famRow.secondary].filter((u) => u && u !== url && exists(u)).slice(0, 3).join(" ") : "",
    COMPETING_URLS: comp.join(" "), EVIDENCE: `${e.level}: ${e.detail}`,
    ACTION: NEW_PAGES[url] ? "NEW_SERVICE_PAGE(Wave 1)" : SERP_COMPETING[q] ? "대표 URL 강화 + 경쟁 페이지 anchor/역할 정리" : intent === "COST" ? "대표 URL 비용 section이 담당(별도 URL 금지)" : "KEEP",
  };
});

// 08 cannibalization (대표 URL + 경쟁 URL 묶음 단위)
const groups = new Map();
for (const r of r07.filter((x) => x.COMPETING_URLS)) {
  const key = `${r.PRIMARY_URL}|${r.COMPETING_URLS}`;
  if (!groups.has(key)) groups.set(key, { ...r, QUERIES: [] });
  groups.get(key).QUERIES.push(r.QUERY);
}
const r08 = [...groups.values()].map((r) => {
  const comp = r.COMPETING_URLS.split(" ");
  const pt = titleOf.get(r.PRIMARY_URL) || "";
  const ph = h1Of.get(r.PRIMARY_URL) || "";
  const toks = coreTokens(r.QUERY);
  const titleOverlap = comp.filter((u) => toks.every((t) => norm(titleOf.get(u) || "").includes(norm(t)))).length;
  const h1Overlap = comp.filter((u) => toks.every((t) => norm(h1Of.get(u) || "").includes(norm(t)))).length;
  const serpHit = r.QUERIES.some((q) => SERP_COMPETING[q]);
  const risk = serpHit ? "HIGH" : titleOverlap >= 3 || h1Overlap >= 2 ? "MEDIUM" : "LOW";
  return {
    QUERIES: r.QUERIES.join(" | "), PRIMARY_URL: r.PRIMARY_URL, PRIMARY_TITLE: pt, PRIMARY_H1: ph, COMPETING_URLS: r.COMPETING_URLS,
    TITLE_OVERLAP: titleOverlap, H1_OVERLAP: h1Overlap, SERP_EVIDENCE: serpHit ? "경쟁 URL이 Naver SERP에서 대표 URL보다 상위" : "",
    RISK: risk,
    RESOLUTION: risk === "HIGH" ? "1) 대표 URL 강화 2) 경쟁 페이지 역할 문장·anchor를 대표 URL로 정렬(삭제·noindex·canonical 변경 없음)" : risk === "MEDIUM" ? "intro/H2 차별화 후보 — Wave 2 모니터링" : "현 상태 유지",
  };
}).sort((a, b) => ["HIGH", "MEDIUM", "LOW"].indexOf(a.RISK) - ["HIGH", "MEDIUM", "LOW"].indexOf(b.RISK));

// 09 true gaps / 11 new pages / 12 watchlist / 10 upgrades
const score = (o) => o.SEARCH_EVIDENCE + o.COMMERCIAL_INTENT + o.CASE_VALUE + o.BUSAN_LOCALITY + o.CONTENT_UNIQUENESS + o.CURRENT_GAP + o.LEGAL_CLARITY - o.CANNIBALIZATION_RISK - o.THIN_RISK - o.LEGAL_SCOPE_RISK;
const GAP_CANDIDATES = [
  ["/부산가압류신청", "가압류 신청서 작성", "226-229,234", 4, 5, 4, 4, 4, 5, 4, 1, 1, 1],
  ["/부산집행문부여신청", "집행문 부여·승계·재도부여", "203-210,319-322", 4, 4, 3, 3, 5, 5, 5, 0, 1, 0],
  ["/부산배당요구신청", "경매 배당요구·채권계산서", "218,219", 4, 4, 4, 3, 5, 5, 5, 0, 1, 0],
  ["/부산채무불이행자명부등재", "채무불이행자명부 등재·말소", "213", 4, 3, 3, 3, 5, 5, 5, 0, 1, 0],
  ["/부산가족관계등록부정정", "가족관계등록부 정정허가·정정신청", "182-185,199", 4, 3, 3, 4, 5, 5, 5, 0, 1, 0],
  ["/부산실종선고청구", "실종선고 심판청구·신고", "177", 4, 3, 4, 3, 5, 5, 5, 0, 1, 0],
  ["(보류) 임시주주총회 소집허가", "회사 비송", "121,122", 2, 4, 4, 2, 4, 5, 2, 0, 1, 3],
  ["(보류) 토지 분필·합필", "토지 분필·합필·지목", "26-28,271-274", 3, 2, 2, 2, 3, 4, 2, 1, 3, 2],
  ["(보류) 유한책임회사 설립", "유한책임회사", "83", 2, 3, 2, 1, 3, 4, 4, 1, 3, 0],
  ["(보류) 진정명의회복 등기", "진정명의회복", "14", 3, 2, 3, 1, 3, 4, 2, 1, 2, 2],
  ["(보류) 자동차 저당권", "자동차 저당·말소", "307,308", 1, 2, 1, 1, 2, 4, 2, 1, 3, 2],
];
const r09 = GAP_CANDIDATES.map(([url, topic, ids, se, ci, cv, bl, cu, cg, lc, cr, tr, lr]) => {
  const o = { SEARCH_EVIDENCE: se, COMMERCIAL_INTENT: ci, CASE_VALUE: cv, BUSAN_LOCALITY: bl, CONTENT_UNIQUENESS: cu, CURRENT_GAP: cg, LEGAL_CLARITY: lc, CANNIBALIZATION_RISK: cr, THIN_RISK: tr, LEGAL_SCOPE_RISK: lr };
  const total = score(o);
  const priority = url.startsWith("(") ? (lr >= 2 ? "WATCHLIST" : total >= 18 ? "P2" : "WATCHLIST") : total >= 24 ? "P0" : total >= 20 ? "P1" : "P2";
  return { CANDIDATE: url, TOPIC: topic, SERVICE_IDS: ids, ...o, TOTAL: total, PRIORITY: priority, DECISION: url.startsWith("(") ? (lr >= 3 ? "LEGAL_REVIEW_REQUIRED" : "WATCHLIST") : "NEW_SERVICE_PAGE" };
});
const NEW_META = {
  "/부산가압류신청": ["민사집행법 제276~280·282·287·288·292·293조", "/가압류신청서류준비, /부산가압류말소등기, /부산재산명시", "B2C: 채권 존재→보전 필요성→대상재산→신청서·소명→담보제공→결정 후(해방금액·제소명령·취소)"],
  "/부산집행문부여신청": ["민사집행법 제28~35·56·58조, 소액사건심판법 제5조의8", "/부산재산명시, /채권압류추심서류준비", "B2C: 집행권원 종류→집행문 필요 여부→일반·승계·재도부여→송달·확정증명→다음 집행"],
  "/부산배당요구신청": ["민사집행법 제84·88·148조, 민사집행규칙 제48조", "/부산임차권등기명령, /부산경매낙찰등기", "B2C: 배당요구 필요자 판별→종기 확인→자격 소명서류→채권계산서→철회 제한"],
  "/부산채무불이행자명부등재": ["민사집행법 제70~73조", "/부산재산명시", "B2C: 등재 사유(6개월·명시 불출석)→관할→소명자료→효과(통보·열람)→말소"],
  "/부산가족관계등록부정정": ["가족관계등록법 제104~107·18조", "/부산개명허가", "B2C: 오류 유형→허가 대상 vs 직권정정 vs 확정판결 필요→등록기준지 관할→소명자료→1개월 내 정정신청"],
  "/부산실종선고청구": ["민법 제27~29조, 가사소송법 제44조, 가사소송규칙 제53~57조, 가족관계등록법 제92조", "/부산부재자재산관리인, /부산상속등기", "B2C: 보통·특별실종 기간→청구권자→관할→공시최고(6개월+)→심판·확정→1개월 내 신고→상속 연결"],
};
const r11 = r09.filter((r) => r.DECISION === "NEW_SERVICE_PAGE").map((r) => ({
  NEW_URL: r.CANDIDATE, TOPIC: r.TOPIC, SERVICE_IDS: r.SERVICE_IDS, PRIORITY: r.PRIORITY, PARENT_HUB: NEW_PAGES[r.CANDIDATE].hub,
  LEGAL_BASIS: NEW_META[r.CANDIDATE][0], LEGAL_SCOPE: "C. COURT_DOCUMENT_PREPARATION (신청서 작성·제출 대행, 소송대리·기일 출석 아님)",
  INBOUND_CONTEXT_LINKS: NEW_META[r.CANDIDATE][1], STRUCTURE: NEW_META[r.CANDIDATE][2],
  CONDITIONS: "독립의도 Y / Naver C급 증거 Y / 기존 URL 없음 Y / 범위 명확 Y / 고유 콘텐츠 Y / Parent Hub Y / 잠식 위험 낮음 Y",
  STATUS: afterRoutes ? (afterRoutes.has(r.CANDIDATE) ? "BUILT" : "NOT_BUILT") : "PLANNED",
}));
const r12 = [
  ...r09.filter((r) => r.DECISION !== "NEW_SERVICE_PAGE").map((r) => ({ ITEM: r.CANDIDATE.replace("(보류) ", ""), SERVICE_IDS: r.SERVICE_IDS, STATUS: r.DECISION, REASON: `score ${r.TOTAL}`, RECHECK_TRIGGER: "Search Advisor 노출/문의 발생 시 재평가" })),
  ...r06.filter((r) => r.DECISION === "WATCHLIST" || r.DECISION === "LEGAL_REVIEW_REQUIRED").map((r) => ({ ITEM: r.ORIGINAL_SERVICE_NAME, SERVICE_IDS: String(r.SERVICE_ID), STATUS: r.DECISION, REASON: r.REASON, RECHECK_TRIGGER: r.COVERING_URL ? `${r.COVERING_URL} section 추가 검토` : "수요 증거 확보 시" })),
];
const r10 = [
  { URL: "/부산시행사등기", CHANGE: "PF·담보신탁·개발신탁 section 추가(부동산등기법 제81·82·87·87의2조)", SERVICE_IDS: "57,296,297,300,306", REASON: "'부산 PF 담보등기' SERP #4, 대표 URL 지정", TYPE: "UPGRADE_EXISTING" },
  { URL: "/부산근저당설정등기", CHANGE: "근저당 변경·이전 section 추가(부동산등기법 제52조5호·제46조①3)", SERVICE_IDS: "32,33,36,37,290,291", REASON: "변경·이전 전용 URL 없음 — 신규 대신 section", TYPE: "ADD_SECTION" },
  { URL: "/공탁채권회수", CHANGE: "변제공탁 의도는 /부산변제공탁으로 연결하는 역할 문장·anchor", SERVICE_IDS: "156", REASON: "'부산 변제공탁' SERP에서 허브가 대표 URL보다 상위", TYPE: "CANNIBALIZATION_FIX" },
  { URL: "/부산휴면법인계속등기, /부산임원사임해임등기, /부산개인사업자법인전환, /부산감자등기, /부산무상증자등기, /부산지점설치등기, /부산지점폐지등기, /부산공동대표변경등기, /부산법인해산전확인사항, 녹산 본점·지점 페이지", CHANGE: "본문·meta description의 내부 경로 문자열(`/부산…`) 제거 → 업무명", SERVICE_IDS: "", REASON: "Naver snippet에 raw path 노출 확인", TYPE: "GENERATOR_FIX" },
  { URL: "/유언공증준비, /예금상속인출절차, 보험금 상속 페이지", CHANGE: "meta description·본문의 '(/slug)' 표기 제거", SERVICE_IDS: "", REASON: "description raw path", TYPE: "GENERATOR_FIX" },
  { URL: "situations 13개, 울산·양산 업무사례 5개, 동 허브 6개, /공유물분할등기서류준비", CHANGE: "깨진 내부링크 33건 → 기존 유효 URL", SERVICE_IDS: "", REASON: "404 링크", TYPE: "BROKEN_LINK_FIX" },
  { URL: "/민사소송, /가족후견", CHANGE: "허브 링크 목록에 Wave 1 신규 URL 연결", SERVICE_IDS: "", REASON: "Parent hub 연결(footer 단독 발견 금지)", TYPE: "HUB_LINK" },
];

// 13 internal link map
const r13 = [];
for (const [url, meta] of Object.entries(NEW_PAGES)) {
  r13.push({ FROM: meta.hub, TO: url, ANCHOR_TYPE: "hub→child", PLACEMENT: "topic hub 링크 목록" });
  for (const src of NEW_META[url][1].split(",").map((x) => x.trim())) r13.push({ FROM: src, TO: url, ANCHOR_TYPE: "contextual(변형 anchor)", PLACEMENT: "관련 안내/본문 링크" });
  r13.push({ FROM: url, TO: meta.hub, ANCHOR_TYPE: "child→hub", PLACEMENT: "breadcrumb·관련 안내" });
}
r13.push({ FROM: "/공탁채권회수", TO: "/부산변제공탁", ANCHOR_TYPE: "role clarification", PLACEMENT: "본문 역할 문장" });

// 16 URL preservation
const before = [...routes];
const r16 = before.map((u) => ({ ROUTE: u, BEFORE: "Y", AFTER: afterRoutes ? (afterRoutes.has(u) ? "Y" : "N") : "PENDING", STATUS: afterRoutes ? (afterRoutes.has(u) ? "PRESERVED" : "REMOVED") : "PENDING" }));
if (afterRoutes) for (const u of afterRoutes) if (!routes.has(u)) r16.push({ ROUTE: u, BEFORE: "N", AFTER: "Y", STATUS: NEW_PAGES[u] ? "ADDED_WAVE1" : "ADDED_OTHER" });

const counts = {
  "01-service-legal-scope.csv": writeCsv("01-service-legal-scope.csv", r01),
  "02-service-intent-families.csv": writeCsv("02-service-intent-families.csv", r02),
  "03-keyword-universe.csv": writeCsv("03-keyword-universe.csv", r03),
  "04-naver-demand-evidence.csv": writeCsv("04-naver-demand-evidence.csv", r04),
  "05-regional-query-matrix.csv": writeCsv("05-regional-query-matrix.csv", r05),
  "06-existing-url-coverage.csv": writeCsv("06-existing-url-coverage.csv", r06),
  "07-query-url-ownership.csv": writeCsv("07-query-url-ownership.csv", r07),
  "08-cannibalization.csv": writeCsv("08-cannibalization.csv", r08),
  "09-true-gaps.csv": writeCsv("09-true-gaps.csv", r09),
  "10-upgrade-existing.csv": writeCsv("10-upgrade-existing.csv", r10),
  "11-new-pages.csv": writeCsv("11-new-pages.csv", r11),
  "12-watchlist.csv": writeCsv("12-watchlist.csv", r12),
  "13-internal-link-map.csv": writeCsv("13-internal-link-map.csv", r13),
  "16-url-preservation.csv": writeCsv("16-url-preservation.csv", r16),
};
const typeCount = {};
r01.forEach((r) => { const t = r.LEGAL_SCOPE_TYPE[0]; typeCount[t] = (typeCount[t] || 0) + 1; });
const decisionCount = {};
r06.forEach((r) => { decisionCount[r.DECISION] = (decisionCount[r.DECISION] || 0) + 1; });
const summary = {
  services: services.length, excluded: excluded.length, families: Object.keys(FAMILIES).length,
  unmapped: classified.filter((x) => !x.c.fam).length, typeCount, decisionCount,
  verifyRequired: r01.filter((r) => r.VERIFY_REQUIRED === "Y").length,
  serpQueries: serp.length, autocompleteTerms: autocomplete.length,
  ownershipQueries: r07.length, cannibalHigh: r08.filter((r) => r.RISK === "HIGH").length, cannibalMedium: r08.filter((r) => r.RISK === "MEDIUM").length,
  removedRoutes: r16.filter((r) => r.STATUS === "REMOVED").length, counts,
};
fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2) + "\n");
console.log(JSON.stringify(summary, null, 2));
