import {
  getAllSeoLandingPaths,
  getSeoLandingStats,
  validateSeoLandingSpecs,
} from "@/lib/seo-landing/combinations";

validateSeoLandingSpecs();

export default {
  ok: true,
  paths: getAllSeoLandingPaths(),
  stats: getSeoLandingStats(),
};
