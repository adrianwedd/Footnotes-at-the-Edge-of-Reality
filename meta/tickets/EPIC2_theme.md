# EPIC 2 — Dark-first Theme + Typography

## Ticket 2.1 — Implement global CSS tokens (dark-first)
**Goal:** Establish calm, low-glare palette and typographic defaults.

**Tasks**
- Define CSS variables for bg/fg/muted/link/rule/selection.
- Implement base typography (font sizes, line-height, spacing).
- Ensure links are underlined and accessible.

**AC**
- High readability on mobile and desktop.
- No pure-white glare (#fff avoided for large text areas).
- Focus-visible outlines clearly visible.

**Notes**
- Keep the palette subtle; avoid neon.
- Support `prefers-color-scheme: dark` (dark is default regardless).

---

## Ticket 2.2 — Measures and rhythm (poem vs exegesis)
**Goal:** Different max-width for poem vs exegesis.

**Tasks**
- Poem container: ~62ch max width.
- Exegesis container: ~78ch max width.
- Stanza spacing: generous and consistent.

**AC**
- Poem looks like a book page.
- Exegesis reads like a careful note, not documentation.

---

## Ticket 2.3 — Accessibility pass
**Goal:** Ensure keyboard, contrast, and reduced motion policies.

**Tasks**
- `:focus-visible` for links and nav.
- Verify contrast (manual check acceptable).
- Ensure no required animation.

**AC**
- Keyboard nav works end-to-end.
- Reduced motion users see no motion.
