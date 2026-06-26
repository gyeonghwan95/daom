/** 업무 상세 slug → 토픽 허브 slug */
export const serviceToTopicHubSlug: Record<string, string> = {
  "inheritance-registration": "상속",
  "inheritance-renunciation": "상속",
  "qualified-acceptance": "상속",
  "real-estate-registration": "부동산등기",
  "ownership-transfer": "부동산등기",
  "corporate-registration": "법인등기",
  "company-establishment": "법인등기",
  "director-change": "법인등기",
  "personal-rehabilitation": "개인회생파산",
  bankruptcy: "개인회생파산",
};

export function getTopicHubSlugForService(serviceSlug: string): string | undefined {
  return serviceToTopicHubSlug[serviceSlug];
}

export function getTopicHubPathForService(serviceSlug: string): string | undefined {
  const slug = getTopicHubSlugForService(serviceSlug);
  return slug ? `/${slug}` : undefined;
}
