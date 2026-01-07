# Footnotes at the Edge of Reality

A dialogue between physics, language, and what we claim to know.

This repository contains a poem and an accompanying exegesis about physics, language, and epistemology.

**Read online:** [adrianwedd.github.io/Footnotes-at-the-Edge-of-Reality](https://adrianwedd.github.io/Footnotes-at-the-Edge-of-Reality/) *(after first deploy)*

## About

The poem is written to be experienced without explanation.
The exegesis exists for readers who want to trace the physical and philosophical ideas the poem leans on.

The two texts are written in different grammars.

- **Poem:** [poem.md](poem.md)
- **Exegesis:** [exegesis.md](exegesis.md)

## The Site

The static site features:
- Dark-first typography optimized for reading
- A subtle animated background based on gravitational field equations
- Full accessibility support (keyboard navigation, reduced motion preferences)
- Print-friendly versions of both texts

The background animation is deliberately imperceptible at first viewing, becoming obvious only after 2-3 minutes. This reflects the poem's themes of continuation and ongoing dialogue.

## Local Development

To run the site locally:

```bash
cd site
npm install
npm run dev
```

The site will be available at `http://localhost:4321`.

To build for production:

```bash
npm run build
```

The built site will be in `site/dist/`.

## Technical Stack

- **Framework:** [Astro](https://astro.build) v5
- **Styling:** Custom CSS with dark-first design
- **Background:** Custom canvas-based field renderer
- **Deployment:** GitHub Pages via Actions

## Design Philosophy

This is a text-first work. The background exists to quietly support the idea of continuation, not to impress. See [DESIGN_CHARTER.md](DESIGN_CHARTER.md) for the full design philosophy.

## License

Content © 2026 Adrian Wedd. All rights reserved.
