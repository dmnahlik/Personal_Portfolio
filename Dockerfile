# Portfolio container for Google Cloud Run.
# The server uses only the Python standard library, so no packages
# (and no Poetry) are needed inside the image.
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

WORKDIR /app

COPY portfolio_server ./portfolio_server
COPY site ./site

RUN useradd --system --no-create-home app_user
USER app_user

EXPOSE 8080
CMD ["python", "-m", "portfolio_server.server"]
