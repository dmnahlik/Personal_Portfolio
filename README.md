# David Nahlik: Personal Portfolio

A single-page portfolio site (plain HTML, CSS, and JavaScript) served by a small Python server that uses only the standard library. It deploys to **Google Cloud Run**.

## Project layout

```
site/                     # the website (everything the browser loads)
  index.html              # single page: Home, Projects & Awards, Skills, Contact
  css/variables.css       # design tokens: colors, fonts, spacing, dark mode
  css/base.css            # reset, typography, buttons, accessibility helpers
  css/sections.css        # styles for each section
  css/responsive.css      # breakpoints (1024 / 768 / 600 / 480px) + print
  css/blueprint.css       # animated engineering drawings over the blueprint grid
  js/data.js              # ← ALL CONTENT LIVES HERE (look for "TODO")
  js/render.js            # renders data.js into the page
  js/main.js              # nav, mobile menu, filters, theme toggle, animations
  js/theme_init.js        # restores saved light/dark theme before first paint
  assets/img/             # headshot, project images, favicon, social image
portfolio_server/server.py  # stdlib static server (security headers, /health)
tests/                    # server tests (unittest)
Dockerfile                # container image for Cloud Run
```

## The six components

| Component | Where |
|---|---|
| Home / Landing | `#home` section; content in `profile` in `data.js` |
| Projects / Awards Showcase | `#projects`; `showcase` list in `data.js` (`type: "project"` or `"award"`) |
| Skills | `#skills`; `skills` groups in `data.js` (`{name, level}` = bar, plain string = chip) |
| Contact Information | `#contact`; `contact` in `data.js` (empty values are hidden) |
| Responsive Design | `css/responsive.css`, fluid type in `css/variables.css` |
| Professional Polish | `css/variables.css` tokens, dark mode, animations, SEO tags in `index.html`, security headers in the server |

## Install

Requires Python 3.12+ and [Poetry](https://python-poetry.org/) 2.x.

```bash
poetry install
```

The project has no third-party dependencies.

## Run locally

```bash
poetry run serve
```

Open http://localhost:8080. Set `PORT=8000` to use a different port. After editing files in `site/`, refresh the browser; no restart is needed.

## Test

```bash
poetry run python -m unittest -v
```

## Edit content

Open `site/js/data.js` and replace each `TODO`. To change images, add files to `site/assets/img/` and point `profile.photo` or a showcase item's `image` at them.
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

Live site: https://personal-portfolio-86737582063.us-central1.run.app

The health check is at `/health`. It isn't `/healthz` because Cloud Run reserves paths ending in `z`. Cloud Run service names only allow lowercase letters, digits, and hyphens, which is why the service is `personal-portfolio`. Files listed in `.gcloudignore` are not uploaded.
