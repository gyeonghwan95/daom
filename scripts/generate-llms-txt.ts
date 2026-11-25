import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildLlmsFullTxt, buildLlmsTxt } from "../src/lib/seo/llms-txt";

const out = join(process.cwd(), "public", "llms.txt");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buildLlmsTxt(), "utf8");
console.log(`[llms.txt] wrote ${out}`);

const full = join(process.cwd(), "public", "llms-full.txt");
writeFileSync(full, buildLlmsFullTxt(), "utf8");
console.log(`[llms-full.txt] wrote ${full}`);
