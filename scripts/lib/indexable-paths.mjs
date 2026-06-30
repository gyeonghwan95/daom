import { getAllPublishedPaths } from "./published-paths.mjs";

/** 색인 대상 path (레거시 /cases/*, /press, 네이버 블로그 미러 제외) */
export function getIndexablePaths() {
  return getAllPublishedPaths().filter(
    (path) =>
      !path.startsWith("/cases/") &&
      path !== "/press" &&
      !path.startsWith("/press/") &&
      !path.startsWith("/blog/external/"),
  );
}
