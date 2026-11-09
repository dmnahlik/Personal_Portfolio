# Plan: Migrate the Portfolio Front End to Next.js (static export)

## Context
The portfolio currently works as a hand-written single page. `site/index.html` holds empty containers, and `site/js/render.js` fills them in the browser from `site/js/data.js`. The stdlib Python server (`portfolio_server/server.py`) serves the page on Cloud Run. David asked for a Next.js implementation plan, and chose two things:
- **Keep the Python server.** Next.js is only used at build time, as a static export, and the Python server serves the output. This follows the CLAUDE.md "Python, managed with Poetry" rule.
- **TypeScript.**

Intended outcome:
- **Same look and behavior.** It's a 1:1 port, with no new pages or features.
- **Page content arrives pre-rendered.** This is better for search engines and LinkedIn link previews.
- **Better asset handling.** Fonts are self-hosted, and assets get hashed file names that can be cached long-term.
- **Better maintainability.** Code is organized as React components, with type-checked content.
- **Ready to grow.** The setup is ready for per-project pages or a blog later.

## Key decisions
- **Location:** the Next.js app lives in `web/`. The repo root keeps the Poetry project, the server, tests, and the Dockerfile.
- **Static export:** set `output: "export"` and `images.unoptimized: true` in `next.config.ts`. Static export can't do on-the-fly image optimization, but the images are already resized to 1280px.
- **Styling:** port the existing CSS files unchanged as global styles (`variables.css`, `base.css`, `sections.css`, `blueprint.css`, `responsive.css`). No Tailwind, so no visual drift and no extra packages.
- **Font:** load Inter with `next/font/google`. It downloads at build time and is self-hosted, so the Google Fonts request and its CSP allowances go away.
- **Dependencies (minimal):**
  - `next`, `react`, `react-dom`
  - Dev: `typescript`, `@types/react`, `@types/react-dom`, `@types/node`, `eslint`, `eslint-config-next`
  - Pin the versions npm resolves at install, through `package-lock.json`.
- **Node:** use Node 24 LTS, installed locally with nvm into `~/.nvm` (no sudo). Docker uses `node:24-alpine` for the build stage.
- **Branch:** `nextjs_migration`, created from `initial_portfolio_scaffold`. Never `main`.

## Structure
```
web/
  package.json, package-lock.json, tsconfig.json, next.config.ts, eslint.config.mjs
  app/layout.tsx            # <html>/<head>, metadata (title, description, Open Graph), Inter font, theme_init script
  app/page.tsx              # composes the sections
  app/globals.css           # @imports the five ported CSS files
  styles/*.css              # existing CSS, moved from site/css/
  data/portfolio.ts         # site/js/data.js converted to typed TS (Profile, ShowcaseItem, SkillGroup, Contact types)
  components/
    BlueprintBackground.tsx # the four animated SVG drawings (static markup)
    Header.tsx              # nav + mobile menu + active-section highlight   (client)
    ThemeToggle.tsx         # light/dark toggle + localStorage               (client)
    Hero.tsx                # name, role, intro, photo, CTA buttons
    Showcase.tsx            # filter buttons + cards                         (client: filter state)
    ShowcaseCard.tsx
    Skills.tsx / SkillGroup.tsx  # bars, chips, or description
    Contact.tsx + CopyEmailButton.tsx                                        (client)
    Reveal.tsx              # IntersectionObserver scroll-reveal wrapper      (client)
    Icon.tsx                # GitHub/LinkedIn/email/phone/location SVGs
    Footer.tsx
  public/theme_init.js      # unchanged; runs before paint to apply the saved theme
  public/assets/img/*       # moved from site/assets/img/
```
Logic is ported from existing code, not rewritten from scratch:
- The `site/js/render.js` builders become the JSX for `ShowcaseCard`, `SkillGroup` and `Contact`. This keeps the `tel:` normalization, hiding empty fields, `imagePosition`, and description-only skill groups.
- The `site/js/main.js` behaviors move into client components: menu toggle with Escape and outside-click closing, header shadow on scroll, active nav, reveal, filter, theme toggle, copy email, and footer year.

## Security headers (CSP) and caching changes in `portfolio_server/server.py`
1. **Inline scripts:** Next.js static export embeds small inline `<script>` tags (React hydration data), which `script-src 'self'` blocks. At startup, the server will read `index.html`, take the SHA-256 hash of each inline script, and add those hashes to `script-src`. That keeps a strict CSP without `'unsafe-inline'`.
2. **Inline style attributes:** these are blocked by `style-src 'self'`. Skill bar widths and `imagePosition` will be set through React refs (`el.style.setProperty`) after mount, not through `style={...}` props. Values set through the DOM style API are allowed by CSP.
3. **CSP cleanup:** drop `fonts.googleapis.com` and `fonts.gstatic.com` from the CSP, because fonts are now self-hosted.
4. **Caching:** files under `/_next/static/` have content-hashed names, so they get `Cache-Control: public, max-age=31536000, immutable`. Everything else keeps `no-cache`, which avoids the earlier stale-cache problem. The `?v=2` query strings go away.
5. **Site location:** `DEFAULT_SITE_DIR` points to `web/out` locally. In the container the build output is copied to `/app/site`, so the existing `SITE_DIR` logic still works.
6. **Unchanged:** `/health`, the SPA fallback, and directory-listing blocking.

## Docker / deploy
- **`Dockerfile` becomes two stages:**
  1. `node:24-alpine`: `npm ci && npm run build` in `web/`.
  2. `python:3.13-slim`: copy `portfolio_server/`, plus `web/out` copied to `/app/site`. Runs as non-root, the same as today.
- **Ignore files:** `.gcloudignore`, `.dockerignore` and `.gitignore` add `web/node_modules`, `web/.next` and `web/out`.
- **Preview first:** run `gcloud run deploy ... --no-traffic --tag nextjs`. This gives a separate preview URL with no effect on the live site. Once David approves it, run `gcloud run services update-traffic personal-portfolio --to-latest`.
- **Rollback:** route traffic back to the current revision `personal-portfolio-00019-pf6`.

## Steps
1. Create the branch, install nvm and Node 24, and scaffold `web/` with the minimal dependencies above (not `create-next-app` extras).
2. Port the data to `data/portfolio.ts` with types. Move the CSS and images.
3. Build the components and `layout.tsx` metadata. Use the real SEO description: "David Nahlik: CAPA Team Lead focused on quality, continuous improvement, and Lean Six Sigma."
4. Update the server (CSP hashing, caching, site dir) and the tests.
5. Update the Dockerfile and ignore files. Delete `site/` once the port is verified.
6. Update `README.md`: install now covers `poetry install` plus `npm ci`, and covers dev mode (`npm run dev`), building, serving, testing and deploying. Propose updating the CLAUDE.md "Project" line to "Python server (Poetry) + Next.js/TypeScript front end (static export)", and make that edit only after David approves.
7. Commit, push the branch, and deploy the preview.

## Verification
- **Build:** `cd web && npm run lint && npm run build` succeeds, which also covers the TypeScript type check, and produces `web/out/index.html` with all content in the HTML. Check with `curl` and `grep` for the intro, project titles and skills.
- **Tests:** `poetry run python -m unittest`, with new tests for:
  - CSP containing `sha256-` hashes for a fixture page with inline scripts
  - immutable caching on `/_next/static/*` and `no-cache` on HTML
  - the existing health, 404, SPA fallback and directory-listing tests
- **Local server:** `poetry run serve` serving `web/out`, plus `curl` checks for status codes and headers. David checks it in a browser, which should look identical to today:
  - nav, mobile menu and dark mode
  - filter, skill bars and blueprint animation
  - copy email, and LinkedIn/phone links
- **No CSP violations:** the browser console shows no CSP errors. David confirms in DevTools, and the hash logic is checked by test.
- **Cloud Run:** after the preview deploy, `curl` the tagged preview URL, David reviews it, then traffic is switched to it.
