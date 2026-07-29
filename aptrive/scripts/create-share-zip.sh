#!/usr/bin/env bash
# Package the repo for sharing/export without leaking local secrets.
#
# .gitignore already excludes .env* for anything that goes through git,
# but a plain zip isn't git-aware — this is what should be used instead
# of `zip -r` directly whenever the project needs to be shared as an
# archive (audits, handoffs, etc).
set -euo pipefail

OUT="${1:-project-export.zip}"

zip -r "$OUT" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x ".git/*" \
  -x ".env*" \
  -x "*.tsbuildinfo" \
  -x "supabase/.temp/*"

echo "Wrote $OUT (excludes node_modules, .next, .git, .env*, *.tsbuildinfo, supabase/.temp)"
