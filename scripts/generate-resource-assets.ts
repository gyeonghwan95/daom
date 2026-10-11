/**
 * 의뢰 전 준비자료 PNG(1080×1440)·A4 PDF·OG(1200×630) 정적 생성.
 *   npx tsx scripts/generate-resource-assets.ts
 * - 문구 원본: src/data/resources/guides.ts / 조판: src/lib/resources/print-html.ts
 * - 로컬 Chrome(헤드리스, DevTools 프로토콜)으로 렌더링한다. PDF는 글꼴 임베딩·선택 가능한 텍스트·링크 유지.
 * - 결과: public/resources/files/<slug>-v<버전>.png|pdf, public/resources/og/<slug>-v<버전>.png,
 *   src/data/resources/assets-manifest.json(원본 해시·쪽수·글자 배율). 이전 버전 파일은 지우지 않는다.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import QRCode from "qrcode";
import { RESOURCE_GUIDES, RESOURCE_VERSION } from "../src/data/resources/guides";
import { getContactInfo } from "../src/lib/contact";
import { buildOgHtml, buildPdfHtml, buildPngHtml } from "../src/lib/resources/print-html";
import { absoluteUrl } from "../src/lib/resources/urls";
import { computeResourceContentHash, resourceAssetPaths } from "../src/lib/resources/asset-hash";

const ROOT = path.join(__dirname, "..");
const CHROME =
  process.env.CHROME_PATH ||
  ["C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "daom-resources-"));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Cdp = { send: (method: string, params?: Record<string, unknown>) => Promise<any>; close: () => void };

async function openChrome(): Promise<Cdp> {
  if (!CHROME) throw new Error("Chrome/Edge 실행 파일을 찾지 못했습니다. CHROME_PATH를 지정하세요.");
  const port = 9400 + Math.floor(Math.random() * 400);
  const proc = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(TMP, "profile")}`, "about:blank"], { stdio: "ignore" });
  let tabs: { type: string; webSocketDebuggerUrl: string }[] = [];
  for (let i = 0; i < 60 && !tabs.length; i++) {
    try {
      tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
    } catch {
      await sleep(250);
    }
  }
  const page = tabs.find((t) => t.type === "page");
  if (!page) throw new Error("Chrome DevTools 연결 실패");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 0;
  const pending = new Map<number, (m: any) => void>();
  ws.addEventListener("message", (e) => {
    const m = JSON.parse(String(e.data));
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)!(m);
      pending.delete(m.id);
    }
  });
  const send = (method: string, params: Record<string, unknown> = {}) =>
    new Promise<any>((resolve, reject) => {
      const i = ++id;
      pending.set(i, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  await send("Page.enable");
  return { send, close: () => { ws.close(); proc.kill(); } };
}

/**
 * 설치된 Noto Sans KR은 가변 글꼴이라 PDF에 Type3(윤곽선)로 들어간다.
 * 사이트와 같은 Noto Sans KR의 굵기별 고정 TTF(Google Fonts, OFL)를 캐시에 받아 @font-face로 지정해
 * PDF에 TrueType 글꼴로 임베딩되게 한다. 받을 수 없으면 실패한다(검사가 임베딩을 확인).
 */
async function staticFontCss(): Promise<string> {
  const cacheDir = path.join(os.tmpdir(), "daom-resource-fonts");
  fs.mkdirSync(cacheDir, { recursive: true });
  const css = await (await fetch("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=block")).text();
  const faces: string[] = [];
  for (const m of css.matchAll(/font-weight:\s*(\d+);[\s\S]*?url\((https:[^)]+\.ttf)\)/g)) {
    const [, weight, url] = m;
    const file = path.join(cacheDir, `NotoSansKR-${weight}.ttf`);
    if (!fs.existsSync(file)) fs.writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
    faces.push(`@font-face{font-family:"Noto Sans KR";font-weight:${weight};font-style:normal;src:url("${pathToFileURL(file).href}") format("truetype")}`);
  }
  if (faces.length < 5) throw new Error("Noto Sans KR 고정 TTF를 받지 못했습니다(네트워크 확인)");
  return faces.join("\n");
}

let FONT_CSS = "";

async function load(cdp: Cdp, html: string, name: string, width: number, height: number) {
  const file = path.join(TMP, `${name}.html`);
  fs.writeFileSync(file, html.replace("<style>", `<style>${FONT_CSS}\n`));
  await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
  await cdp.send("Page.navigate", { url: pathToFileURL(file).href });
  await sleep(400);
  await cdp.send("Runtime.evaluate", { expression: "document.fonts.ready.then(()=>true)", awaitPromise: true });
}

async function evalValue<T>(cdp: Cdp, expression: string): Promise<T> {
  const r = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return r.result.value as T;
}

function pdfPageCount(buf: Buffer): number {
  return (buf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
}

async function main() {
  const { phone } = getContactInfo();
  const contentHash = computeResourceContentHash();
  FONT_CSS = await staticFontCss();
  const cdp = await openChrome();
  const manifest: Record<string, unknown> = {};
  try {
    for (const guide of RESOURCE_GUIDES) {
      const out = resourceAssetPaths(guide.slug);
      for (const rel of [out.png, out.pdf, out.og]) fs.mkdirSync(path.dirname(path.join(ROOT, "public", rel)), { recursive: true });
      const qrSvg = await QRCode.toString(absoluteUrl(guide.slug), { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#152a45", light: "#ffffff" } });

      // PNG — 넘치면 글자 배율만 줄이고 항목은 그대로 둔다
      await load(cdp, buildPngHtml(guide, qrSvg, phone), `${guide.slug}-png`, 1080, 1440);
      let scale = 1;
      for (const s of [1, 0.96, 0.92, 0.88, 0.84]) {
        scale = s;
        const fits = await evalValue<boolean>(cdp, `(()=>{document.documentElement.style.setProperty('--s','${s}');const n=document.querySelector('.note').getBoundingClientRect();const f=document.querySelector('.foot').getBoundingClientRect();const h1=document.querySelector('h1').getBoundingClientRect();const u=document.querySelector('.u');return n.bottom<=f.top-12&&f.bottom<=1440&&h1.right<=1080&&u.scrollWidth<=u.clientWidth;})()`);
        if (fits) break;
        if (s === 0.84) {
          const m = await evalValue<string>(cdp, `JSON.stringify({note:document.querySelector('.note').getBoundingClientRect().bottom,foot:document.querySelector('.foot').getBoundingClientRect().top,footBottom:document.querySelector('.foot').getBoundingClientRect().bottom})`);
          const shot = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
          fs.writeFileSync(path.join(TMP, `${guide.slug}-overflow.png`), Buffer.from(shot.data, "base64"));
          throw new Error(`${guide.slug} PNG: 0.84배에서도 넘칩니다 ${m} — shareItems를 줄이세요 (${path.join(TMP, `${guide.slug}-overflow.png`)})`);
        }
      }
      const png = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1080, height: 1440, scale: 1 } });
      fs.writeFileSync(path.join(ROOT, "public", out.png), Buffer.from(png.data, "base64"));

      // OG
      await load(cdp, buildOgHtml(guide), `${guide.slug}-og`, 1200, 630);
      const ogFits = await evalValue<boolean>(cdp, "document.getElementById('page').scrollHeight<=630");
      if (!ogFits) throw new Error(`${guide.slug} OG 넘침`);
      const og = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
      fs.writeFileSync(path.join(ROOT, "public", out.og), Buffer.from(og.data, "base64"));

      // PDF (A4)
      await load(cdp, buildPdfHtml(guide, qrSvg, phone), `${guide.slug}-pdf`, 794, 1123);
      const pdf = await cdp.send("Page.printToPDF", { preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, generateTaggedPDF: true });
      const pdfBuf = Buffer.from(pdf.data, "base64");
      fs.writeFileSync(path.join(ROOT, "public", out.pdf), pdfBuf);

      manifest[guide.slug] = { ...out, pngScale: scale, pdfPages: pdfPageCount(pdfBuf), pdfBytes: pdfBuf.length };
      console.log(`[resources] ${guide.slug} png×${scale} pdf ${pdfPageCount(pdfBuf)}쪽`);
    }
  } finally {
    cdp.close();
  }
  const manifestPath = path.join(ROOT, "src/data/resources/assets-manifest.json");
  fs.writeFileSync(manifestPath, `${JSON.stringify({ version: RESOURCE_VERSION, contentHash, guides: manifest }, null, 2)}\n`);
  console.log(`[resources] manifest → ${path.relative(ROOT, manifestPath)} (${contentHash})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
