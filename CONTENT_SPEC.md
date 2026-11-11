# Orkhon Atlas post format (internal spec)

Each post is `src/content/posts/<slug>.md`:

```yaml
---
title: "The first-timer's guide to Mongolia"
description: "One or two sentences, <= 160 chars, for cards and meta."
category: travel-tips        # destinations | nomad-life | festivals | horses-adventure | itineraries | travel-tips
destinations: [ulaanbaatar]  # any of: ulaanbaatar, gobi, orkhon-valley, khovsgol, altai (may be [])
published: 2026-11-11
updated: 2026-11-11          # "last updated" shown on page
author: desk                 # always "desk" (Orkhon Atlas editors) - never invent a named person
hero: first-timer            # key in src/data/photos.json
heroAlt: "Describe the photo literally"
featured: false              # only first-timer's guide = true
startHere: false             # true for first-timer, 14-day itinerary, packing
plan:
  heading: "Plan this trip"
  text: "1-2 sentences tying the post to what an operator does for you."
  operatorName: "Steppe & Sky"
  operatorUrl: "https://steppeandsky.tourground.com/festivals"
  operatorNote: "One factual line on what that page offers (only what the page actually says)."
sources:
  - title: "Mongolia travel advice: Entry requirements"
    publisher: "UK Foreign, Commonwealth & Development Office"
    url: "https://www.gov.uk/foreign-travel-advice/mongolia/entry-requirements"
    accessed: 2026-11-11
---
```

Body: Markdown, starts with intro paragraphs (no H1), `##` section headings, 1,200-2,000 words.
