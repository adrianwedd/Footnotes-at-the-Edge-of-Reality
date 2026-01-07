# CLAUDE.md
## Agent Guidance for Footnotes at the Edge of Reality

This document guides AI agents working on this project.

**Read [DESIGN_CHARTER.md](DESIGN_CHARTER.md) first.** The charter defines what must remain true. This file documents how to work within those constraints.

---

## 1. Governing Principle

This is a **text-first work** where calm wins over cleverness.

If you're unsure whether to add something, don't. If something feels impressive, it's probably too loud. When in doubt, subtract.

---

## 2. How to Work on This Project

### 2.1 Before Making Changes

1. **Read the charter** if you haven't yet
2. **Read existing code** before proposing changes
3. **Ask questions** rather than assuming intent
4. **Verify against the charter** before implementing

### 2.2 What "Text-First" Means in Practice

- Typography, readability, and content preservation come before visual features
- Line breaks in the poem are sacred - preserve exactly as authored
- Max width constraints (62ch poem, 78ch exegesis) are not negotiable
- Dark background, light text - no exceptions except print output
- If a reader notices the background before the text, you've failed

### 2.3 What "Geological Motion" Means

The background animation operates on **10-20 minute timescales**.

This is not a typo. This is not a suggestion. This is the design.

- Each tick should produce imperceptible change
- Motion should become obvious after 2-3 minutes of watching one spot
- The field should feel stable, not reactive
- If it looks animated, it's too fast

### 2.4 What "Subtle" Means (With Numbers)

Current background parameters (as of 2026-01-07):
- Opacity: 4-12% alpha on `rgba(220, 235, 255, a)`
- Grid: 120×68 points on desktop
- Tick rate: 800ms
- Orbital periods: 10-20 minutes

These were calibrated against the charter's requirement: visible if you look, quiet if you don't.

If you change these, you must test for:
1. Visibility when actively looking
2. Invisibility when reading text
3. Performance (no console violations)
4. Motion on geological timescale

---

## 3. Code Style and Conventions

### 3.1 Commits

Commit messages should:
- Echo the charter's tone (calm, deliberate, honest)
- Include precise technical details
- Explain *why*, not just *what*
- Avoid corporate voice ("implemented feature X")
- End with reflection, not summary

Example format:
```
[Poetic title that states intent]

[Context: what was wrong or missing]

[Technical changes, bulleted, specific]

[Closing reflection on what this means for the work]
```

See `git log` for examples.

### 3.2 File Organization

```
site/src/
  ├── pages/        # Routes: index, poem, exegesis
  ├── layouts/      # BaseLayout only
  ├── components/   # Minimal, purposeful
  ├── content/      # Markdown sources
  ├── scripts/      # Background field logic
  └── styles/       # global.css, curvature.css
```

**Do not** create new directories without discussion.
**Do not** add components that don't serve the text.

### 3.3 Dependencies

The project uses:
- Astro v5 (static site generation)
- No UI frameworks
- No animation libraries
- No visual effects libraries

**Do not** add dependencies for visual effects.
**Do not** suggest libraries that "make things easier" for animations.

The background is hand-coded because it needs to be exactly what it is, nothing more.

### 3.4 Accessibility

These are mandatory, not optional:

- `prefers-reduced-motion: reduce` → freeze all motion
- Keyboard navigation must work everywhere
- Focus indicators must be clearly visible
- Print output: black ink on white paper, nothing decorative
- Canvas must be `aria-hidden="true"`

If accessibility conflicts with a visual effect, accessibility wins. Always.

---

## 4. Working with the Background

### 4.1 The Background's Purpose

From the charter:

> The background is not decoration. It is a footnote in motion.
> Its purpose is to quietly reinforce a single idea: the dialogue described by the poem is still happening.

This means:
- It must be mathematically grounded (gravitational field simulation)
- It must evolve deterministically (seeded RNG, no jitter)
- It must never demand attention
- It must never explain itself

### 4.2 Performance Requirements

The background must:
- Run without console violations (setInterval handlers <50ms)
- Pause when tab is hidden
- Use minimal grid resolution
- Avoid redundant calculations

Current implementation uses tick-based rendering (setInterval), not RAF, because:
1. Minute-scale motion doesn't need 60fps
2. Lower tick rate = lower CPU usage
3. Deterministic timing is easier to reason about

### 4.3 What You Can Change

You may adjust:
- Alpha values (if visibility calibration is needed)
- Grid resolution (if performance requires it)
- Tick rate (within geological constraints)
- Color mapping (within dark-first constraints)

You must **not** change:
- Orbital periods (10-20 minutes is final)
- Determinism (seeded RNG is mandatory)
- Physics model (gravitational field + Laplacian curvature)
- Motion paradigm (geological, not animated)

---

## 5. When the Charter and Code Conflict

**The charter wins.**

If existing code violates the charter:
1. Flag it immediately
2. Explain the violation
3. Propose a fix that honors the charter
4. Wait for approval before changing

Never assume legacy code is correct just because it exists.

---

## 6. Typography and Readability

### 6.1 Established Standards

- Base size: 18px
- Line height: 1.65
- Poem width: max 62ch
- Exegesis width: max 78ch
- Font: Merriweather (serif) for content, system sans for UI

These are not suggestions. They are the result of deliberate choices about comfort and reading endurance.

### 6.2 Color Palette

```css
--bg: #070a0f;           /* near-black background */
--fg: #e9eef6;           /* soft white text */
--muted: #a8b3c2;        /* secondary text */
--link: #8ac7d9;         /* soft cyan links */
--rule: rgba(233, 238, 246, 0.10);
```

This palette is **dark-first** and **low-glare**.

Do not suggest light mode. Do not suggest higher contrast. Do not suggest "pops of color."

---

## 7. What Not to Build

From the charter:

> If the site ever becomes impressive, busy, or self-conscious, this document has been ignored.

Do **not** add:
- Hero sections
- Call-to-action buttons beyond the minimal landing links
- Animations that announce themselves
- Particle effects
- Gradient backgrounds unrelated to the physics
- Social sharing widgets
- Analytics beyond what GitHub provides
- Comment systems
- Newsletter signups
- "Back to top" buttons
- Loading spinners
- Tooltips
- Modals
- Carousels

The site exists to let someone read two texts. That's all.

---

## 8. Testing and Verification

Before considering work complete:

1. **Visual check:** Is text still dominant?
2. **Motion check:** Is background imperceptible at first?
3. **Performance:** No console violations?
4. **Accessibility:** Keyboard nav works? Reduced motion honored?
5. **Print:** `Cmd/Ctrl+P` shows clean black-on-white?
6. **Charter:** Does this violate any principle?

If unsure about #6, ask.

---

## 9. Tone and Communication

When writing commit messages, documentation, or comments:

- Be precise, not corporate
- Be honest about limitations
- Use the charter's language where appropriate
- Avoid superlatives ("amazing", "powerful", "incredible")
- Avoid false confidence ("simply", "just", "obviously")

The work is unfinished. The conversation is ongoing. The code should reflect that.

---

## 10. What This Project Promises

From the charter's closing:

> This project does not promise coherence.
> It does not promise completion.
> It does not promise explanation.
>
> It promises only this: the work will be given enough quiet space to remain unfinished, honestly.

Your job is to protect that space.

---

## 11. When to Ask for Guidance

Ask before:
- Adding new dependencies
- Creating new visual effects
- Changing the background's motion parameters
- Modifying typography settings
- Adding new pages or routes
- Implementing features not in the tickets

Do not ask before:
- Fixing bugs
- Improving performance
- Enhancing accessibility
- Correcting errors
- Optimizing existing code within charter constraints

---

## 12. Final Note

If you find yourself thinking:
- "This would look cool if..."
- "Users would love it if..."
- "This is industry standard..."
- "Modern sites usually..."

Stop.

Re-read the charter.

This is not a modern site.
This is not a portfolio piece.
This is not optimized for engagement.

This is a quiet space for a difficult conversation.

Keep it that way.
