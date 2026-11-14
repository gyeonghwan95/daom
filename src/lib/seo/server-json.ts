/**
 * 빌드(서버 렌더링) 때만 src/generated의 JSON을 파일로 읽는다.
 * 일부 클라이언트 컴포넌트가 SEO 모듈을 간접 import해서, JSON을 정적으로 import하면 표 전체가 브라우저 JS에 실렸다
 * (2026-11-14: 랜딩 묶음 249KB → 394KB). 브라우저에서는 빈 표를 돌려줘 아무것도 바꾸지 않는다.
 * eval("require")는 번들러가 fs를 클라이언트 묶음에 넣지 않게 하려는 것이다.
 */
const cache = new Map<string, Record<string, string>>();

export function readGeneratedTable(file: string): Record<string, string> {
  if (typeof window !== "undefined") return {};
  const hit = cache.get(file);
  if (hit) return hit;
  let table: Record<string, string> = {};
  try {
    // eslint-disable-next-line no-eval
    const req = eval("require") as NodeRequire;
    const fs = req("fs") as typeof import("fs");
    const path = req("path") as typeof import("path");
    table = JSON.parse(fs.readFileSync(path.join(process.cwd(), "src/generated", file), "utf8"));
  } catch {
    table = {};
  }
  cache.set(file, table);
  return table;
}
