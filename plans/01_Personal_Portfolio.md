# Plan: Single-Page Personal Portfolio → GitHub + Cloud Run

## Context
David wants a single-page portfolio site scaffolded with six components (Home/Landing, Projects/Awards Showcase, Skills, Contact, Responsive Design, Professional Polish). Content comes later, so this round builds a **framework with clearly marked placeholders**. It will be pushed to the empty public repo `dmnahlik/Personal_Portfolio` and deployed to Cloud Run in GCP project `dmnahlik-personal-portfolio`.

Environment findings:
- `/home/dmnahlik/projects/Personal_Portfolio` is empty except a blank `CLAUDE.md`.
- The current git root is `/home/dmnahlik` (home dir). Must `git init` inside the project folder so dotfiles are never pushed.
- Node/Docker are not installed; gcloud is (account dmnahlik@gmail.com, active project is a *different* one: `project-183e80a7-...`). We deploy with `--project dmnahlik-personal-portfolio` and Cloud Build builds remotely.
- Stack chosen: **plain HTML/CSS/JS, served by nginx**.

## File structure
```
Personal_Portfolio/
├── index.html            # single page: nav + 4 content sections + footer
├── css/
│   ├── variables.css     # Professional Polish: design tokens (colors, type scale, spacing, light/dark)
│   ├── base.css          # reset, typography, buttons, utilities
│   ├── sections.css      # Home, Projects/Awards, Skills, Contact styles
│   └── responsive.css    # Responsive Design: breakpoints (≤480, ≤768, ≤1024), mobile nav
├── js/
│   ├── data.js           # ALL editable content (profile, projects, awards, skills, contact) in one object
│   ├── render.js         # renders data.js into the sections (cards, skill groups, contact links)
│   └── main.js           # smooth scroll, active-nav highlight, mobile menu toggle, scroll-reveal, theme toggle, footer year
├── assets/
│   ├── img/              # placeholder headshot/project images (.gitkeep + simple SVG placeholder)
│   └── resume/           # .gitkeep (future résumé PDF)
├── Dockerfile            # nginx:alpine, copies site, listens on $PORT (8080)
├── nginx.conf            # port 8080, gzip, cache headers, SPA fallback to index.html, security headers
├── .dockerignore / .gcloudignore / .gitignore
├── README.md             # how to edit content, run locally, deploy
└── CLAUDE.md             # project conventions for future AI-assisted edits
```

## The six components
1. **Home/Landing** (`#home`): hero with name, title/tagline, short intro, headshot placeholder, CTA buttons (View Projects / Contact / Résumé).
2. **Projects/Awards Showcase** (`#projects`): filterable card grid (All / Projects / Awards) rendered from `data.js`. Each card has image, title, description, tags, and links (repo/demo).
3. **Skills** (`#skills`): grouped skill categories (e.g. Languages, Cloud, Tools) as chips, with an optional proficiency level.
4. **Contact** (`#contact`): email (mailto), LinkedIn, GitHub, location, plus a static "copy email" button. No backend form, so the container stays static (a form can be added later).
5. **Responsive Design**: mobile-first CSS, fluid type with `clamp()`, CSS grid that goes from 3 to 2 to 1 columns, hamburger nav under 768px, touch-sized targets, responsive images.
6. **Professional Polish**: design tokens, light/dark theme toggle (respects `prefers-color-scheme`), sticky nav with active-section highlight, subtle scroll-reveal (disabled under `prefers-reduced-motion`), accessibility (semantic landmarks, skip link, alt text, focus styles, ARIA on the menu), SEO/meta and Open Graph tags, favicon, footer.

Placeholders are marked `TODO:` in `data.js`, so filling in content later means editing one file.

## Git / GitHub
1. `git init -b main` inside the project folder (a nested repo; the home-dir repo is left untouched).
2. `git remote add origin https://github.com/dmnahlik/Personal_Portfolio.git` (gh is authenticated).
3. Initial commit, then `git push -u origin main`, **only after the user confirms**.

## Cloud Run deploy (after user confirms)
```
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com --project dmnahlik-personal-portfolio
gcloud run deploy personal-portfolio --source . --project dmnahlik-personal-portfolio \
  --region us-central1 --allow-unauthenticated --port 8080
```
(Billing must be enabled on the project; I'll check and report if it isn't. Region us-central1 is the default unless the user wants another.)

## Verification
- Local preview with no Docker: `python3 -m http.server 8000`, then open http://localhost:8000. Check every section renders, nav scrolling and highlighting, the filter, the theme toggle, and the mobile menu at narrow width.
- Check that `data.js` edits show up after a reload.
- After deploy: `curl -I <service-url>` returns 200, and open the URL in a browser.
- `git status` in the project shows only portfolio files (no dotfiles), and the GitHub repo shows the commit.
