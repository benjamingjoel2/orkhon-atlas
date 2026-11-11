import { SITE } from './site';

const abs = (path: string) => new URL(path, SITE.url).href;

export const ORG_ID = `${SITE.url}/#organization`;
export const SITE_ID = `${SITE.url}/#website`;

export function baseGraph() {
  return [
    {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE.publisher.name,
      url: SITE.publisher.url,
      email: SITE.email,
      logo: { '@type': 'ImageObject', url: abs('/favicon.svg') },
    },
    {
      '@type': 'WebSite',
      '@id': SITE_ID,
      name: SITE.name,
      url: `${SITE.url}/`,
      description: SITE.description,
      inLanguage: SITE.locale,
      publisher: { '@id': ORG_ID },
    },
  ];
}

export type Crumb = { name: string; path: string };

export function breadcrumbs(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function blogPosting(p: {
  path: string;
  title: string;
  description: string;
  image: string;
  published: string;
  updated: string;
  authorName: string;
  authorPath: string;
  section: string;
  words: number;
  citations: string[];
  sponsored: boolean;
}) {
  return {
    '@type': 'BlogPosting',
    '@id': `${abs(p.path)}#article`,
    headline: p.title,
    description: p.description,
    url: abs(p.path),
    mainEntityOfPage: abs(p.path),
    image: abs(p.image),
    datePublished: p.published,
    dateModified: p.updated,
    inLanguage: SITE.locale,
    articleSection: p.section,
    wordCount: p.words,
    author: { '@type': 'Organization', name: p.authorName, url: abs(p.authorPath) },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': SITE_ID },
    ...(p.citations.length ? { citation: p.citations } : {}),
    ...(p.sponsored ? { genre: 'Advertisement feature' } : {}),
  };
}
