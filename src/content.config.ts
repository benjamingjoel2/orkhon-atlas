import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const CATEGORY_SLUGS = ['destinations', 'nomad-life', 'festivals', 'horses-adventure', 'itineraries', 'travel-tips'] as const;
export const DESTINATION_SLUGS = ['ulaanbaatar', 'gobi', 'orkhon-valley', 'khovsgol', 'altai'] as const;

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    category: z.enum(CATEGORY_SLUGS),
    destinations: z.array(z.enum(DESTINATION_SLUGS)).default([]),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    author: z.string().default('desk'),
    hero: z.string(),
    heroAlt: z.string(),
    featured: z.boolean().default(false),
    startHere: z.boolean().default(false),
    // Paid placements must set this; the page then shows "Advertisement feature".
    advertisement: z
      .object({ sponsor: z.string(), sponsorUrl: z.string().url().optional() })
      .optional(),
    plan: z.object({
      heading: z.string().default('Plan this trip'),
      text: z.string(),
      operatorName: z.string(),
      operatorUrl: z.string().url(),
      operatorNote: z.string().optional(),
    }),
    sources: z
      .array(
        z.object({
          title: z.string(),
          publisher: z.string(),
          url: z.string().url(),
          accessed: z.coerce.date(),
        }),
      )
      .default([]),
  }),
});

export const collections = { posts };
