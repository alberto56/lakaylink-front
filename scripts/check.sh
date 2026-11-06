#!/usr/bin/env bash
# Runs every check in ./scripts/lib/checks/ against each line of a Google Sheet.
#
# Usage: ./scripts/check.sh https://docs.google.com/spreadsheets/d/<id>/edit?gid=<gid>

set -euo pipefail

url="${1:-}"
if [[ -z "$url" ]]; then
  >&2 echo "Usage: $0 <google sheet url>"
  exit 1
fi

sheet_id="$(printf '%s' "$url" | sed -nE 's#.*/spreadsheets/d/([a-zA-Z0-9_-]+).*#\1#p')"
gid="$(printf '%s' "$url" | sed -nE 's#.*[?&\#]gid=([0-9]+).*#\1#p')"
gid="${gid:-0}"

if [[ -z "$sheet_id" ]]; then
  >&2 echo "ERROR: $url does not look like a Google Sheet URL"
  exit 1
fi

csv="$(mktemp)"
trap 'rm -f "$csv"' EXIT

# Non-public sheets redirect to a Google login page instead of returning CSV.
content_type="$(curl -sL -o "$csv" -w '%{content_type}' \
  "https://docs.google.com/spreadsheets/d/$sheet_id/export?format=csv&gid=$gid" || true)"

if [[ "$content_type" != text/csv* ]]; then
  >&2 echo "ERROR: cannot access this, make it publicly accessible"
  exit 1
fi

if command -v php >/dev/null; then
  php ./scripts/lib/check.php < "$csv"
else
  docker run --rm -i -v "$PWD/scripts:/scripts" php:8.3-cli php /scripts/lib/check.php < "$csv"
fi
