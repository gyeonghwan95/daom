import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { buildLlmsTxt } from "../src/lib/seo/llms-txt";

const out = join(process.cwd(), "public", "llms.txt");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buildLlmsTxt(), "utf8");
console.log(`[llms.txt] wrote ${out}`);
