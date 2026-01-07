# EPIC 5 — GitHub Pages Deployment (Actions)

## Ticket 5.1 — Add GitHub Actions workflow for Astro -> Pages
**Goal:** Deploy site from `main` via GitHub Actions.

**Tasks**
- Add `.github/workflows/deploy.yml` using official Pages actions pattern.
- Ensure correct permissions (`pages: write`, `id-token: write`).
- Configure base path if deploying to repo pages.

**AC**
- Push to `main` triggers deploy.
- GH Pages URL serves latest build.
- `/poem` and `/exegesis` load correctly under Pages path.

---

## Ticket 5.2 — Validate production build behaviour
**Goal:** Ensure production settings match local.

**Tasks**
- Confirm asset paths correct (`base` set if needed).
- Confirm no mixed content issues.
- Confirm canvas script loads once.

**AC**
- No broken links.
- No missing CSS.
- Background renders (unless reduced motion).
