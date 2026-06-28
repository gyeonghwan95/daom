import fs from "node:fs";
import path from "node:path";
import { pathToOutCandidates, normalizeRouteSlug } from "./published-paths.mjs";

/**
 * 정적 export(out/)에 routePath에 해당하는 HTML이 있는지 확인합니다.
 * 한글 slug는 NFC 정규화·퍼센트 인코딩·decodeURIComponent 변형을 모두 시도합니다.
 */
export function findOutHtmlForRoute(outDir, routePath) {
  const candidates = pathToOutCandidates(routePath);
  const found = candidates.filter((candidate) =>
    fs.existsSync(path.join(outDir, candidate)),
  );

  if (found.length > 0) {
    return { ok: true, candidates, matched: found };
  }

  const segments = routePath.split("/").filter(Boolean);
  const extra = [];

  if (segments.length > 0) {
    const decodedSegments = segments.map((segment) => {
      try {
        return normalizeRouteSlug(decodeURIComponent(segment));
      } catch {
        return normalizeRouteSlug(segment);
      }
    });

    const encodedSegments = decodedSegments.map((segment) =>
      encodeURIComponent(segment),
    );

    for (const base of [
      decodedSegments.join("/"),
      encodedSegments.join("/"),
    ]) {
      extra.push(`${base}.html`, `${base}/index.html`);
    }
  }

  const allCandidates = [...new Set([...candidates, ...extra])];
  const extraFound = allCandidates.filter((candidate) =>
    fs.existsSync(path.join(outDir, candidate)),
  );

  return {
    ok: extraFound.length > 0,
    candidates: allCandidates,
    matched: extraFound,
  };
}

export function assertOutDirExists(outDir) {
  if (!fs.existsSync(outDir)) {
    return {
      ok: false,
      message: "out/ 폴더가 없습니다. 먼저 npm run build 를 실행하세요.",
    };
  }
  return { ok: true };
}
