#!/bin/sh

# WHY:
# Volume mounts can override file permissions,
# so we ensure executable flag at runtime.
chmod +x /app/docker/entrypoint.sh 2>/dev/null || true

echo "Starting frontend container..."

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/vite" ]; then
  echo "Installing npm dependencies..."
  # WHY:
  # node_modules may exist but be invalid (e.g. from Windows host),
  # so we verify vite binary and reinstall if needed.
  rm -rf node_modules package-lock.json
  npm install
fi

echo "Frontend ready"

if [ "$#" -eq 0 ]; then
  set -- sh -c "npm run dev -- --host 0.0.0.0"
fi

exec "$@"
