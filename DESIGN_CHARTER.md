# DESIGN_CHARTER.md
## Footnotes at the Edge of Reality

This document defines **intent, constraints, and authority** for the project.

It is not a task list.
It is not a technical deep dive.
It does not describe *how* to implement features.

It exists to answer one question only:

> **What must remain true, no matter how the project evolves?**

All execution details are delegated to the tickets and code.  
All work should be judged against this charter.

---

## 1. What This Project Is

This is a **text-first work**.

At its centre is a poem, accompanied by an exegesis.  
Everything else exists to support *legibility, patience, and continuation*.

The site is not a portfolio.
It is not a demo.
It is not a product.

It is a place where a reader can stay with a difficult, unfinished conversation.

---

## 2. What This Project Is Not

This project is **not**:

- an explanation of physics
- a claim of scientific authority
- an attempt at visual spectacle
- a metaphor made literal
- an interface experiment

This does **not** mean accuracy is optional.  
It means explanation is not the goal.

Nothing here exists to impress.
Nothing exists to persuade.

The work does not resolve the questions it raises.
The site must not pretend otherwise.

---

## 3. Non-Negotiable Principles (The Constitution)

These are not preferences.  
They are constraints.

If an implementation violates any of the following, it is wrong - even if it "works".

### 3.1 Text Comes First
- The poem and exegesis must always dominate attention.
- No visual element may compete with reading.
- If a reader notices a background before the text, the background has failed.

### 3.2 Dark-First, Sensory-Aware
- Dark mode is the default.
- Low glare, low contrast variation.
- The site must be comfortable to read for long periods.
- Accessibility overrides cleverness.

### 3.3 No Spectacle
- No animations that announce themselves.
- No particle effects.
- No gradients unrelated to the underlying mathematics.
- No "hero" visuals.

If it looks "cool", it is almost certainly too loud.

### 3.4 Motion Is Geological, Not Animated
- Any motion must operate on minute-scale time, not seconds.
- Motion must be subtle enough to be missed on first reading.
- Motion exists to suggest continuation, not activity.

### 3.5 Determinism Over Novelty
- Visual behaviour must be deterministic.
- No jitter, randomness, or novelty loops.
- The site should feel stable, not reactive.

### 3.6 Accessibility Is Mandatory
- prefers-reduced-motion disables motion entirely.
- Keyboard navigation must work everywhere.
- Print output must be clean and readable.
- Failure modes must degrade silently and safely.

---

## 4. Architectural Decisions (Final)

These decisions are settled.

They are no longer exploratory.

- Static site built with Astro
- Canonical content authored in Markdown
- GitHub Pages deployment from main
- Background rendered via Canvas, not SVG
- Background evolution driven by a slow, tick-based loop
- No client-side frameworks beyond what is strictly required
- No third-party visual libraries

If a future change requires revisiting these decisions, the charter must be updated explicitly.

---

## 5. The Background's Role (Clarified)

The background is not decoration.

It is a footnote in motion.

Its purpose is to quietly reinforce a single idea:
the dialogue described by the poem is still happening.

The background must therefore:
- evolve slowly
- remain mathematically grounded
- never demand attention
- never explain itself

If a reader never consciously notices it, the background has succeeded.

---

## 6. Authority and Delegation

This document defines intent and limits.

Implementation details — including task breakdowns, algorithms, performance tuning, code structure, and acceptance criteria — are defined in the tickets and supporting documents.

The relationship is explicit:

> Tickets implement.  
> This charter governs.

When there is conflict:
- The charter wins over tickets.
- Readability wins over visuals.
- Calm wins over cleverness.

---

## 7. How to Use This Document

- Read it before starting work.
- Re-read it when something feels off.
- Use it to decide what not to build.
- Update it only when the project's intent genuinely changes.

If the site ever becomes impressive, busy, or self-conscious,  
this document has been ignored.

---

## 8. Closing

This project does not promise coherence.
It does not promise completion.
It does not promise explanation.

It promises only this:

> the work will be given enough quiet space  
> to remain unfinished, honestly.

That is the contract.
