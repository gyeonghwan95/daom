/**
 * Static HTML에서 Footer가 Main/H1보다 앞에 있으면 Main 닫힌 뒤로 이동.
 * Next.js page Suspense hole로 layout Footer가 먼저 flush된 산출물을 보정한다.
 * (소스에서는 Footer를 page 트리에 두지만, 잔여/옛 산출물·예외 라우트용 안전망)
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");

function findClosingTag(html, openIndex) {
  const tagMatch = html.slice(openIndex).match(/^<([a-zA-Z0-9:-]+)\b/);
  if (!tagMatch) return -1;
  const tag = tagMatch[1];
  const openRe = new RegExp(`<${tag}\\b`, "gi");
  const closeRe = new RegExp(`</${tag}\\s*>`, "gi");
  let depth = 0;
  let i = openIndex;
  while (i < html.length) {
    openRe.lastIndex = i;
    closeRe.lastIndex = i;
    const open = openRe.exec(html);
    const close = closeRe.exec(html);
    if (!close) return -1;
    if (open && open.index < close.index) {
      depth += 1;
      i = open.index + open[0].length;
      continue;
    }
    depth -= 1;
    if (depth === 0) return close.index + close[0].length;
    i = close.index + close[0].length;
  }
  return -1;
}

function reorderFooterAfterMain(html) {
  const footerOpen = html.search(/<footer\b/i);
  const mainOpen = html.search(/<main\b/i);
  if (footerOpen < 0 || mainOpen < 0) return { html, changed: false };
  if (footerOpen > mainOpen) return { html, changed: false };

  const footerEnd = findClosingTag(html, footerOpen);
  if (footerEnd < 0) return { html, changed: false };
  const footerBlock = html.slice(footerOpen, footerEnd);

  const withoutFooter = html.slice(0, footerOpen) + html.slice(footerEnd);
  const mainOpen2 = withoutFooter.search(/<main\b/i);
  if (mainOpen2 < 0) return { html, changed: false };
  const mainEnd = findClosingTag(withoutFooter, mainOpen2);
  if (mainEnd < 0) return { html, changed: false };

  const next = withoutFooter.slice(0, mainEnd) + footerBlock + withoutFooter.slice(mainEnd);
  return { html: next, changed: true };
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full, files);
    else if (name.name.endsWith(".html")) files.push(full);
  }
  return files;
}

if (!fs.existsSync(OUT)) {
  console.error("[fix-html-dom-order] out/ missing");
  process.exit(1);
}

const files = walk(OUT);
let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const result = reorderFooterAfterMain(before);
  if (result.changed) {
    fs.writeFileSync(file, result.html, "utf8");
    changed += 1;
  }
}

console.log(`[fix-html-dom-order] scanned=${files.length} reordered=${changed}`);
