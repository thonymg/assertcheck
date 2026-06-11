#!/usr/bin/env bash
set -euo pipefail

# ── colours ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC} $1"; }
info() { echo -e "${CYAN}→${NC} $1"; }
warn() { echo -e "${YELLOW}!${NC} $1"; }
die()  { echo -e "${RED}✗${NC} $1"; exit 1; }

# ── guards ─────────────────────────────────────────────────────────────────────
[[ -f package.json ]] || die "Run from the project root"
command -v bun  >/dev/null 2>&1 || die "bun is not installed"
command -v npm  >/dev/null 2>&1 || die "npm is not installed"
command -v npx  >/dev/null 2>&1 || die "npx is not installed"

# Require clean git state
if [[ -n "$(git status --porcelain)" ]]; then
  die "Working tree is dirty — commit or stash your changes first"
fi

CURRENT=$(node -p "require('./package.json').version")
info "Current version: ${YELLOW}${CURRENT}${NC}"

# ── choose bump type ───────────────────────────────────────────────────────────
echo ""
echo "  1) patch   — bug fixes           (x.x.+1)"
echo "  2) minor   — new features        (x.+1.0)"
echo "  3) major   — breaking changes    (+1.0.0)"
echo "  4) dry-run — preview without publishing"
echo ""
read -rp "Choose [1/2/3/4]: " choice

case "$choice" in
  1) BUMP="patch" ;;
  2) BUMP="minor" ;;
  3) BUMP="major" ;;
  4)
    info "Dry run — no publish"
    npm publish --dry-run
    exit 0
    ;;
  *) die "Invalid choice" ;;
esac

# ── bump version (triggers 'version' hook → syncs jsr.json) ───────────────────
echo ""
info "Bumping ${BUMP}..."
npm version "$BUMP" --no-git-tag-version

NEW=$(node -p "require('./package.json').version")
ok "Version bumped: ${CURRENT} → ${YELLOW}${NEW}${NC}"

# ── tests ──────────────────────────────────────────────────────────────────────
info "Running tests..."
bun test
ok "Tests passed"

# ── npm publish (triggers prepublishOnly: build + typecheck + format:check) ────
echo ""
info "Publishing to npm..."
npm publish
ok "Published to npm: assertcheck@${NEW}"

# ── jsr publish ────────────────────────────────────────────────────────────────
info "Publishing to JSR..."
npx jsr publish
ok "Published to JSR: assertcheck@${NEW}"

# ── git commit + tag ───────────────────────────────────────────────────────────
info "Creating git commit and tag..."
git add package.json jsr.json
git commit -m "chore: release v${NEW}"
git tag "v${NEW}"
git push && git push --tags
ok "Tag v${NEW} pushed"

# ── done ───────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}Released assertcheck v${NEW}${NC}"
echo -e "  npm → https://www.npmjs.com/package/assertcheck"
echo -e "  JSR → https://jsr.io/@assertcheck/core"
