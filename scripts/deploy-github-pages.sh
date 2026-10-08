#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
site_remote="${1:-github}"
git remote get-url "$site_remote" >/dev/null

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Guarda los cambios en un commit antes de publicar." >&2
  exit 1
fi

node --test tests/*.test.mjs
test -f dist/index.html
test -f dist/.nojekyll

# Publish only the web directory. Subtree history permits normal fast-forward
# updates and never overwrites unrelated history with a forced push.
site_commit="$(git subtree split --prefix=dist HEAD)"
git push "$site_remote" "$site_commit:refs/heads/gh-pages"
echo "Web enviada a gh-pages. GitHub Pages completará la publicación."
