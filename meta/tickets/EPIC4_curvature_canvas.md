# EPIC 4 — Curvature Background (Canvas, minute-scale drift)

## Ticket 4.1 — Implement curvature-field renderer (tick-based)
**Goal:** Render a subtle curvature field behind content that drifts over minutes.

**Core requirements**
- Deterministic from `(seed, t)` (t defaults to ms since page load).
- Tick-based update, not RAF.
- Default tick: 500ms desktop; 1000ms mobile.
- Pause on `visibilitychange` when hidden.
- Respect `prefers-reduced-motion: reduce`:
  - render static frame (t=0)
  - do not schedule ticks

**Field model**
- Conformal factor φ from 2–4 masses (default 3):
  - φ(x,y) = Σ -w_i / sqrt(r_i^2 + ε^2)
- Curvature proxy K ≈ -Δφ (discrete Laplacian)
- Normalize with percentile clamp

**Rendering**
- Layer A shading (filled contour bands from K): opacity 0.01–0.05
- Layer B isolines (from φ or K): stroke opacity 0.04–0.10, width 1.0–1.5px
- Big features only; avoid high-frequency noise
- Optional calm-zone mask behind content (reduce opacity 40–60%)

**Resolution**
- Desktop grid ~240×135
- Tablet ~160×90
- Mobile ~120×68

**AC**
- Motion is imperceptible at 1-second scale.
- Motion is clearly different after ~2–3 minutes.
- Background never competes with text.
- CPU stays low (rough target: <5% desktop, <10% laptop).
- Reduced-motion: static background only.

**Notes / Guardrails**
- If it looks like “animation”, slow it down.
- If it looks like a data viz, simplify.
- If it looks “cool”, turn it down.

---

## Ticket 4.2 — Integrate CurvatureBackground component in BaseLayout
**Goal:** Canvas sits behind everything, always.

**Tasks**
- Add `<CurvatureBackground />` to BaseLayout.
- Ensure z-index stacking:
  - canvas at z=-1 or in fixed layer behind content
- Ensure content container has semi-opaque background (0.85–0.92).
- On resize, update canvas size and recompute.

**AC**
- Canvas fills viewport.
- No scrolling artifacts.
- Text remains readable on all pages.

---

## Ticket 4.3 — Fallback behaviour
**Goal:** Failure should be silent and safe.

**Tasks**
- If Canvas unsupported or script fails:
  - do nothing (no background)
- If reduced motion:
  - static frame only

**AC**
- Site remains fully functional without background.
