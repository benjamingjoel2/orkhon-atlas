import { SITE, CATEGORIES, DESTINATIONS, categoryBySlug } from '../lib/site';
import { getPosts, postUrl, isoDate } from '../lib/posts';

export async function GET() {
  const posts = await getPosts();
  const abs = (p: string) => new URL(p, SITE.url).href;
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    'Every post lists its sources and shows when it was published and last updated. Visa, health and safety facts link the official source. We do not publish invented reviews, quotes, prices or statistics. Paid placements, if any, are labelled "Advertisement feature".',
    '',
    '## Stories',
    '',
    ...posts.map((p) => `- [${p.data.title}](${abs(postUrl(p))}): ${p.data.description} (${categoryBySlug(p.data.category).name}; last updated ${isoDate(p.data.updated)})`),
    '',
    '## Categories',
    '',
    ...CATEGORIES.map((c) => `- [${c.name}](${abs(`/${c.slug}/`)}): ${c.blurb}`),
    '',
    '## Destinations',
    '',
    ...DESTINATIONS.map((d) => `- [${d.name}](${abs(`/destinations/${d.slug}/`)}): ${d.blurb}`),
    '',
    '## About',
    '',
    `- [About](${abs('/about/')}): who publishes Orkhon Atlas (Tourground) and how we write.`,
    `- [Disclosure](${abs('/disclosure/')}): how we link to operators and label paid content.`,
    `- [Authors](${abs('/authors/')})`,
    `- [Photo credits](${abs('/photo-credits/')})`,
    `- [RSS feed](${abs('/rss.xml')})`,
    '',
    `Contact: ${SITE.email}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
