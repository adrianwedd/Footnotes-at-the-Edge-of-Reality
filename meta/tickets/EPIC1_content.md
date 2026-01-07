# EPIC 1 — Content Integration (Poem + Exegesis)

## Ticket 1.1 — Add canonical Markdown sources
**Goal:** Place the poem and exegesis in canonical Markdown locations.

**Tasks**
- Add `src/content/poem.md`
- Add `src/content/exegesis.md`
- Preserve line breaks in poem (hard breaks as authored).

**AC**
- Poem renders with intended stanza spacing and line breaks.
- Exegesis renders as readable prose.
- No “markdown reflow” that collapses poem formatting.

---

## Ticket 1.2 — Create pages: /poem and /exegesis
**Goal:** Render each Markdown file on its own route.

**Tasks**
- Create `src/pages/poem.astro`
- Create `src/pages/exegesis.astro`
- Use common BaseLayout and Prose wrapper.

**AC**
- `/poem` loads quickly, text-first.
- `/exegesis` loads quickly, text-first.
- Title + meta description set sensibly.

---

## Ticket 1.3 — Landing page minimal index
**Goal:** Replace README-like landing with a quiet index.

**Tasks**
- Create `/` with:
  - 1–2 lines of orientation
  - buttons/links: Poem, Exegesis
  - optional “read order” line

**AC**
- Home page feels understated.
- Navigation is obvious without being loud.
