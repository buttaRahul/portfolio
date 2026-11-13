#!/bin/sh
# Renders scripts/og.html to public/og.png with headless Chrome.
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=3000 \
  --screenshot="$PWD/public/og.png" "file://$PWD/scripts/og.html"
