# David Nahlik: Personal Portfolio

A single-page portfolio site built with **Next.js + TypeScript** and exported as static files. A small Python server that uses only the standard library serves those files, and the site deploys to **Google Cloud Run**.

## How it fits together

- `web/` is the Next.js app. `npm run build` pre-renders the page to plain HTML/CSS/JS in `web/out/`.
- `portfolio_server/` is the Python server, managed with Poetry. It serves `web/out/` with security headers, caching rules, and a `/health` check.
- On Cloud Run, the Dockerfile builds the site with Node, then runs only the Python server. Node is not part of the running container.

## Project layout

```
web/
  data/portfolio.ts         # ← ALL CONTENT LIVES HERE (typed; checked at build time)
  app/layout.tsx            # <html>/<head>: page title, description, link previews, font
  app/page.tsx              # puts the sections together
  app/globals.css           # imports the stylesheets below
  components/               # Header, Hero, Showcase(+Card), Skills(+Group), Contact, Footer,
                            # ThemeToggle, CopyEmailButton, RevealObserver, BlueprintBackground, Icon
  styles/variables.css      # design tokens: colors, fonts, spacing, dark mode, blueprint grid
  styles/base.css           # reset, typography, buttons, blueprint grid, accessibility helpers
  styles/sections.css       # styles for each section
  styles/blueprint.css      # animated engineering drawings
  styles/responsive.css     # breakpoints (1024 / 768 / 600 / 480px) + print
  public/assets/img/        # headshot, project images, favicon
  public/theme_init.js      # restores saved light/dark theme before first paint
portfolio_server/server.py  # stdlib static server (CSP, caching, /health)
tests/                      # server tests (unittest)
Dockerfile                  # 2-stage build: Node builds web/, Python serves it
```

## The six components

| Component | Where |
|---|---|
| Home / Landing | `components/Hero.tsx`; content in `profile` in `data/portfolio.ts` |
| Projects / Awards Showcase | `components/Showcase.tsx`, `ShowcaseCard.tsx`; `showcase` list in `data/portfolio.ts` |
| Skills | `components/Skills.tsx`, `SkillGroup.tsx`; `skills` in `data/portfolio.ts` (`{name, level}` = bar, string = tag, `description` = paragraph) |
| Contact Information | `components/Contact.tsx`; `contact` in `data/portfolio.ts` (empty values are hidden) |
| Responsive Design | `styles/responsive.css`, fluid type in `styles/variables.css` |
| Professional Polish | design tokens, dark mode, blueprint background, scroll animations, page title/description in `app/layout.tsx`, security headers in the server |

## Install

Requires:
- Python 3.12+ and [Poetry](https://python-poetry.org/) 2.x
- Node.js 24 LTS. It's installed with [nvm](https://github.com/nvm-sh/nvm): `nvm install 24`.

```bash
poetry install          # Python server (no third-party packages)
cd web && npm ci        # Next.js front end
```

## Run locally

**While editing (live reload):**

```bash
cd web && npm run dev
```

Open http://localhost:3000. Pages update as you save.

**Exactly as production serves it:**

```bash
cd web && npm run build     # writes web/out/
cd .. && poetry run serve   # serves web/out/
```

Open http://localhost:8080. Set `PORT=8000` to use a different port. Re-run `npm run build`, then restart `poetry run serve`, after changes. The server reads the page's inline-script hashes at startup.

## Test

```bash
cd web && npm run lint && npm run build   # lint + TypeScript type check + build
cd .. && poetry run python -m unittest -v # server tests
```

## Edit content

Edit `web/data/portfolio.ts`. Images go in `web/public/assets/img/` and are referenced as `/assets/img/<file>`. Card images display at 16:9. Use `imagePosition` (e.g. `"left center"`) to choose which part of an image stays in the frame. A misspelled field or a missing title fails `npm run build` with a clear message.

## Deploy to Google Cloud Run

GCP project: `dmnahlik-personal-portfolio`. Cloud Build builds the container remotely, so Docker isn't needed locally.

```bash
# one-time setup
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  --project dmnahlik-personal-portfolio

# one-time: let the default build service account read sources and push images
gcloud projects add-iam-policy-binding dmnahlik-personal-portfolio \
  --member="serviceAccount:86737582063-compute@developer.gserviceaccount.com" \
  --role="roles/run.builder" --condition=None

# deploy (run again after every change)
gcloud run deploy personal-portfolio \
  --source . \
  --project dmnahlik-personal-portfolio \
  --region us-central1 \
  --allow-unauthenticated
```

To try a change on a private preview URL first, without affecting the live site, add `--no-traffic --tag preview`. Once it looks right, send all traffic to it:

```bash
gcloud run services update-traffic personal-portfolio --to-latest \
  --project dmnahlik-personal-portfolio --region us-central1
```

Live site: https://personal-portfolio-86737582063.us-central1.run.app

### Notes

- **Security:** the server sends a strict Content-Security-Policy. Next.js's inline startup scripts are allowed only by their exact SHA-256 hashes, computed from `index.html` when the server starts. Inline `style=""` attributes are blocked, so components set dynamic styles (skill-bar widths, image crop) through the DOM style API instead.
- **Caching:** files under `/_next/static/` have content-hashed names and are cached for a year. Everything else is revalidated on each visit, so edits show up immediately.
- **Health check:** it's at `/health`. It isn't `/healthz` because Cloud Run reserves paths ending in `z`.
- **Naming and uploads:** Cloud Run service names only allow lowercase letters, digits, and hyphens, which is why the service is `personal-portfolio`. Files listed in `.gcloudignore` (including `web/node_modules`) are not uploaded.
