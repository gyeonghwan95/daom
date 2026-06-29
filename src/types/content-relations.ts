/** 콘텐츠 간 내부링크 추천용 공통 필드 (모두 optional) */
export type ContentRelations = {
  tags?: string[];
  category?: string;
  region?: string;
  serviceSlug?: string;
  relatedServices?: string[];
  relatedSituations?: string[];
  relatedFaqs?: string[];
  relatedCases?: string[];
  relatedTools?: string[];
  relatedGlossary?: string[];
  relatedDiagnosis?: string[];
  relatedBlogs?: string[];
};
