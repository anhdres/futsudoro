#!/usr/bin/env bash
# labadero-repo-hygiene — repo hygiene check
# Use as pre-commit hook or run manually: ./scripts/check-hygiene.sh
#
# Rules:
#   1. ZERO work docs / scripts inside the deploy root (default: src/)
#   2. ZERO asset variants (backup/test/new/old/final/copy/temp/og/rendered/etc.)
#   3. ZERO editable sources (ai/fig/sketch/afdesign/afphoto/psd/xd)
#   4. ZERO sensitive work docs in the repo at large
#
# Override deploy root: HYGIENE_DEPLOY_ROOT=build/web ./scripts/check-hygiene.sh
# Skip a rule: HYGIENE_SKIP_RULES=4 ./scripts/check-hygiene.sh
#
# Exit 0 = OK, exit 1 = block the commit.

set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
DEPLOY_ROOT="${HYGIENE_DEPLOY_ROOT:-src}"
SKIP_RULES="${HYGIENE_SKIP_RULES:-}"
ERRORS=0

red()   { printf '\033[31m%s\033[0m\n' "$*"; }
green() { printf '\033[32m%s\033[0m\n' "$*"; }
yel()   { printf '\033[33m%s\033[0m\n' "$*"; }

fail() {
  red "  ✗ $*"
  ERRORS=$((ERRORS+1))
}

# ─── Files to check ──────────────────────────────────────────────────
# If a commit is in progress, use staged files; otherwise audit tracked tree.
STAGED=$(git diff --cached --name-only --diff-filter=ACMRT 2>/dev/null || true)
if [ -z "$STAGED" ]; then
  STAGED=$(git ls-files)
fi

if [ -z "$STAGED" ]; then
  green "✓ Repo empty, nothing to review"
  exit 0
fi

yel "→ Reviewing $(echo "$STAGED" | wc -l | tr -d ' ') files (deploy root: $DEPLOY_ROOT)..."

# ─── Rule 1: work docs inside the deploy root ────────────────────────
if [[ ! " $SKIP_RULES " =~ " 1 " ]]; then
  yel "  [1/4] Work docs inside $DEPLOY_ROOT/"
  DOCS_PATTERN='\.md$|\.markdown$|\.txt$|\.rst$|CHANGELOG|HISTORY|TODO'
  while IFS= read -r f; do
    case "$f" in
      "$DEPLOY_ROOT"/*)
        if echo "$f" | grep -Eq "$DOCS_PATTERN"; then
          fail "$DEPLOY_ROOT/ contains work doc: $f  → move to docs/ or delete"
        fi
        ;;
    esac
  done <<< "$STAGED"
fi

# ─── Rule 2: scripts inside the deploy root ──────────────────────────
if [[ ! " $SKIP_RULES " =~ " 2 " ]]; then
  yel "  [2/4] Executable scripts inside $DEPLOY_ROOT/"
  while IFS= read -r f; do
    case "$f" in
      "$DEPLOY_ROOT"/*.sh|"$DEPLOY_ROOT"/*.py|"$DEPLOY_ROOT"/*.rb|"$DEPLOY_ROOT"/*.js.map)
        fail "$DEPLOY_ROOT/ contains ops script: $f  → move to scripts/ or delete"
        ;;
    esac
  done <<< "$STAGED"
fi

# ─── Rule 3: asset variants / backups / tests ────────────────────────
if [[ ! " $SKIP_RULES " =~ " 3 " ]]; then
  yel "  [3/4] Asset variants / backups / tests"
  ASSET_EXT='\.(png|jpe?g|gif|svg|webp|ico|bmp|tiff?|pdf|mp[34]|wav|ogg|woff2?)$'
  VARIANT_NAME='(backup|test|new|old|final|temp|tmp|copy|og|rendered|rsng|t2|v[0-9]+)'
  while IFS= read -r f; do
    base=$(basename "$f")
    if echo "$base" | grep -Eiq -- "$ASSET_EXT" && \
       echo "$base" | grep -Eiq -- "$VARIANT_NAME"; then
      fail "asset variant detected: $f  → use canonical or delete"
    fi
  done <<< "$STAGED"
fi

# ─── Rule 4: editable sources in repo ────────────────────────────────
if [[ ! " $SKIP_RULES " =~ " 4 " ]]; then
  yel "  [4/4] Editable sources (AI/FIG/Sketch/PSD/XD)"
  SRC_RE='(^|/)(.+/)?[^/]+\.(ai|fig|sketch|afdesign|afphoto|psd|xd)$'
  while IFS= read -r f; do
    if echo "$f" | grep -Eq -- "$SRC_RE"; then
      fail "editable source in repo: $f  → move outside repo (.gitignore already excludes root)"
    fi
  done <<< "$STAGED"
fi

# ─── Verdict ─────────────────────────────────────────────────────────
echo
if [ $ERRORS -gt 0 ]; then
  red "✗ Hygiene check FAILED: $ERRORS problems"
  echo
  yel "  Remember: $DEPLOY_ROOT/ is ONLY for the app and what it needs to run."
  yel "  Work docs → docs/"
  yel "  Ops scripts → scripts/"
  yel "  Asset variants → delete or rename to canonical"
  exit 1
fi

green "✓ Hygiene check OK — safe to commit"
exit 0
