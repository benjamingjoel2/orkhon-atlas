import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, categoryBySlug } from '../lib/site';
import { getPosts, postUrl } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    trailingSlash: true,
    customData: '<language>en-gb</language>',
    items: posts.map((p) => ({
      title: (p.data.advertisement ? 'Advertisement feature: ' : '') + p.data.title,
      description: p.data.description,
      link: postUrl(p),
      pubDate: p.data.published,
      categories: [categoryBySlug(p.data.category).name],
      author: `${SITE.email} (Orkhon Atlas editors)`,
    })),
  });
}
