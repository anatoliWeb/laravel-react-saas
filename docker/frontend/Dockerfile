FROM node:20-alpine

WORKDIR /app

# WHY:
# Entrypoint is copied and made executable at build time,
# while runtime script still re-applies chmod for mounted volumes.
COPY frontend/docker/entrypoint.sh /app/docker/entrypoint.sh
RUN chmod +x /app/docker/entrypoint.sh