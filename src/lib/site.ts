export const SITE = {
  name: 'Orkhon Atlas',
  url: 'https://orkhonatlas.tourground.com',
  tagline: 'Story-led, practical travel writing for planning a trip to Mongolia.',
  description:
    'Orkhon Atlas is a travel blog for people planning a trip to Mongolia: the steppe, the Gobi, nomad life and the festivals, with sourced practical advice. Published by Tourground.',
  email: 'orkhonatlas@tourground.com',
  publisher: { name: 'Tourground', url: 'https://tourground.com' },
  directoryUrl: 'https://tourground.com/#/explore',
  launched: '2026-11-11',
  locale: 'en-GB',
};

export const CATEGORIES = [
  { slug: 'destinations', name: 'Destinations', blurb: 'Ulaanbaatar, the Gobi, the Orkhon Valley, Khövsgöl and the Altai: where to go and what each place is like on the ground.' },
  { slug: 'nomad-life', name: 'Nomad Life', blurb: 'Gers, herding families and the rhythm of the seasons, and how to be a good guest.' },
  { slug: 'festivals', name: 'Festivals', blurb: 'Naadam, the Golden Eagle Festival and the other dates worth building a trip around.' },
  { slug: 'horses-adventure', name: 'Horses & Adventure', blurb: 'Riding, trekking and the long days in the saddle that Mongolia is famous for.' },
  { slug: 'itineraries', name: 'Itineraries', blurb: 'Day-by-day routes with honest notes on distances, roads and pacing.' },
  { slug: 'travel-tips', name: 'Travel Tips', blurb: 'Visas, health, money, packing and the practical things first-timers ask about.' },
] as const;

export const DESTINATIONS = [
  { slug: 'ulaanbaatar', name: 'Ulaanbaatar', photo: 'ulaanbaatar', blurb: 'The capital, and where almost every trip begins and ends.' },
  { slug: 'gobi', name: 'The Gobi', photo: 'gobi', blurb: 'Singing dunes, red cliffs and camel country in the south.' },
  { slug: 'orkhon-valley', name: 'Orkhon Valley', photo: 'orkhon', blurb: 'The old heartland of the Mongol empire, and Karakorum.' },
  { slug: 'khovsgol', name: 'Khövsgöl', photo: 'khovsgol', blurb: 'A deep, clear lake among larch forest in the far north.' },
  { slug: 'altai', name: 'The Altai', photo: 'altai', blurb: 'Snow peaks, Kazakh eagle hunters and the far west.' },
] as const;

export const AUTHORS: Record<string, { name: string; slug: string; bio: string }> = {
  desk: {
    name: 'Orkhon Atlas editors',
    slug: 'desk',
    bio: 'The Orkhon Atlas editorial desk at Tourground writes, edits and fact-checks every post. Facts come from official sources listed at the end of each article.',
  },
};

export const categoryBySlug = (s: string) => CATEGORIES.find((c) => c.slug === s)!;
export const destinationBySlug = (s: string) => DESTINATIONS.find((d) => d.slug === s)!;
