import {
  allSeoIntentEntities,
  seoIntentDbStats,
  validateSeoIntentDatabase,
} from "../src/data/seo";

validateSeoIntentDatabase();

console.log(
  JSON.stringify({
    ok: true,
    total: allSeoIntentEntities.length,
    stats: seoIntentDbStats,
  }),
);
