/** Station Host published 여부 */
import { getStationHostAssignments } from "../src/data/seo/station-host-map";
import { getAllPublishedPaths } from "./lib/published-paths.mjs";

const published = new Set(getAllPublishedPaths());
const rows = getStationHostAssignments();
let missing = 0;
for (const r of rows) {
  if (!r.hostPage) {
    console.log("NO-HOST", r.stationName);
    missing += 1;
    continue;
  }
  if (!published.has(r.hostPage)) {
    console.log("HOST-MISSING", r.stationName, r.hostPage);
    missing += 1;
  }
}
console.log("checked", rows.length, "missing", missing);
if (missing) process.exitCode = 1;
