// usage: node show.mjs <route-without-leading-slash> [text|links|all]  (Git Bash가 /경로를 변환하므로 앞 슬래시 생략)
import fs from "node:fs";
import { parsePage, routeToFile } from "../../scripts/lib/seo-recovery/scan-out.mjs";
const route = "/" + (process.argv[2] || "").replace(/^\/+/, "");
const mode = process.argv[3] || "all";
const f = routeToFile(route);
if (!f) { console.log("NO FILE", route); process.exit(1); }
const p = parsePage(fs.readFileSync(f, "utf8"));
if (mode !== "links") console.log(p.mainText, "\nDESC:", p.description);
if (mode !== "text") console.log("LINKS:", [...new Map(p.links.filter((l) => !/^\/contact/.test(l.href)).map((l) => [l.href, l.text.slice(0, 28)])).entries()].map(([h, t]) => `${h}«${t}»`).join(" | "));
