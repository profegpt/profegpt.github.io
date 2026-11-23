#!/bin/sh
# Publishes profe-gpt.web.app (Firebase project agoral-a1, site profe-gpt): a single page, the live Apps Script web
# app's own page (scripts/standalone.mjs, the same copy publish-jsdelivr.sh puts on jsDelivr), with every path
# rewritten to it. profegpt.web.app (project saxonplanner) only redirects here (saxon-planner hosting/redirects).
#
# Run after every Apps Script deploy (npm run appscript:deploy), like publish-jsdelivr.sh.
set -e
cd "$(dirname "$0")/.."
OUT=$(mktemp -d); mkdir -p "$OUT/public"
node scripts/standalone.mjs "$OUT/public/index.html"
grep -q '<title>Profe' "$OUT/public/index.html" || { echo "built page doesn't look like Profe, refusing"; exit 1; }
cat > "$OUT/firebase.json" <<'JSON'
{ "hosting": { "site": "profe-gpt", "public": "public", "rewrites": [ { "source": "**", "destination": "/index.html" } ] } }
JSON
(cd "$OUT" && npx -y firebase-tools@latest deploy --project agoral-a1 --only hosting:profe-gpt --non-interactive)
curl -s -m 30 https://profe-gpt.web.app/ -o "$OUT/live.html"
cmp -s "$OUT/live.html" "$OUT/public/index.html" && echo "profe-gpt.web.app is live with the new page" || { echo "live page differs from the build"; exit 1; }
