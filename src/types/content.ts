export type RelatedLink = {
  href: string;
  label: string;
};

export type PageContent = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  relatedLinks: RelatedLink[];
};
