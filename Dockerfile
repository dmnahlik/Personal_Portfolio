# Portfolio container for Google Cloud Run.
#
# Stage 1 builds the Next.js front end into plain static files.
# Stage 2 serves them with the stdlib-only Python server (no Node at runtime,
# no Python packages, no Poetry needed in the image).

# ---------- Stage 1: build the static export ----------
FROM node:24-alpine AS web_build
WORKDIR /web
ENV NEXT_TELEMETRY_DISABLED=1

COPY web/package.json web/package-lock.json ./
RUN npm ci

COPY web/ ./
RUN npm run build

# ---------- Stage 2: serve it ----------
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080 \
    SITE_DIR=/app/site

WORKDIR /app

COPY portfolio_server ./portfolio_server
COPY --from=web_build /web/out ./site

RUN useradd --system --no-create-home app_user
USER app_user

EXPOSE 8080
CMD ["python", "-m", "portfolio_server.server"]
