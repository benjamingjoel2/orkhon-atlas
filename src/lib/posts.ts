import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Launch posts share a publish date; keep them in the editorial order.
const LAUNCH_ORDER = [
  'first-timers-guide-mongolia', 'naadam-festival-guide', 'gobi-desert-dunes-cliffs-camels',
  'staying-with-nomad-family-ger', 'orkhon-valley-karakorum', 'lake-khovsgol-summer',
  'golden-eagle-festival-altai', 'mongolia-14-day-itinerary', 'horse-trekking-mongolia-beginners',
  'what-to-pack-mongolia-weather',
];
const order = (p: Post) => { const i = LAUNCH_ORDER.indexOf(p.id); return i === -1 ? 999 : i; };

export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts');
  return posts.sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf() || order(a) - order(b),
  );
}

export function readingMinutes(post: Post): number {
  const words = (post.body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function wordCount(post: Post): number {
  return (post.body ?? '').split(/\s+/).filter(Boolean).length;
}

export const postUrl = (post: Post) => `/posts/${post.id}/`;

/** Related posts: shared destinations score 2, same category 1. */
export function relatedPosts(post: Post, all: Post[], n = 3): Post[] {
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      p,
      score:
        p.data.destinations.filter((d) => post.data.destinations.includes(d)).length * 2 +
        (p.data.category === post.data.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.p.data.title.localeCompare(b.p.data.title))
    .slice(0, n)
    .map((x) => x.p);
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
