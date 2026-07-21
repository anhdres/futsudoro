#!/bin/bash
# Auto-update BUILD and BUILD_DATE in web/src/data.js to match the current
# git HEAD. Called from .githooks/pre-commit so every commit stamps itself.
#
# VERSION (semver) is intentionally NOT touched here — bump it manually on
# meaningful releases.
set -e

# Locate project root (script is in scripts/, repo root is parent).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# Only run inside a git repo.
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "bump-version: not a git repo, skipping" >&2
  exit 0
fi

DATA_FILE="web/src/data.js"
if [ ! -f "$DATA_FILE" ]; then
  echo "bump-version: $DATA_FILE not found, skipping" >&2
  exit 0
fi

SHA=$(git rev-parse --short HEAD)
DATE=$(date +%Y-%m-%d)

# Sanity check: si alguien borró las constantes, fallar fuerte para no
# degradarse silencioso. Capturar la salida original antes del sed -i.
if ! grep -q "^export const BUILD " "$DATA_FILE" || ! grep -q "^export const BUILD_DATE " "$DATA_FILE"; then
  echo "bump-version: ERROR — BUILD o BUILD_DATE constant not found in $DATA_FILE" >&2
  echo "bump-version: add them back manually. Aborting commit." >&2
  exit 1
fi

# Replace `export const BUILD = '...';` and `export const BUILD_DATE = '...';`.
# Uses sed -i '' for macOS compatibility.
sed -i '' "s/^export const BUILD = '.*';$/export const BUILD = '$SHA';/" "$DATA_FILE"
sed -i '' "s/^export const BUILD_DATE = '.*';$/export const BUILD_DATE = '$DATE';/" "$DATA_FILE"

# Stage the change so the commit includes it.
git add "$DATA_FILE"

echo "bump-version: stamped $SHA ($DATE)"
