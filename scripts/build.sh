#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

rm -rf "${ROOT_DIR}/dist"
mkdir -p "${ROOT_DIR}/dist/chrome" "${ROOT_DIR}/dist/firefox"

# Shared files
cp "${ROOT_DIR}/content.js" "${ROOT_DIR}/dist/chrome/content.js"
cp "${ROOT_DIR}/content.js" "${ROOT_DIR}/dist/firefox/content.js"

cp "${ROOT_DIR}/README.md" "${ROOT_DIR}/dist/chrome/README.md"
cp "${ROOT_DIR}/README.md" "${ROOT_DIR}/dist/firefox/README.md"

# Chrome build includes DNR rules.
cp "${ROOT_DIR}/rules.json" "${ROOT_DIR}/dist/chrome/rules.json"
cp "${ROOT_DIR}/manifests/manifest.chrome.json" "${ROOT_DIR}/dist/chrome/manifest.json"

# Firefox build relies on content script (no DNR).
cp "${ROOT_DIR}/manifests/manifest.firefox.json" "${ROOT_DIR}/dist/firefox/manifest.json"

echo "Built:"
echo "  Chrome:  ${ROOT_DIR}/dist/chrome"
echo "  Firefox: ${ROOT_DIR}/dist/firefox"

