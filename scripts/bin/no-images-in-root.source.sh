checks=(
  "JPEG:\.jpe?g$"
  "PNG:\.png$"
  "WEBP:\.webp$"
)

for check in "${checks[@]}"; do
  label="${check%%:*}"
  pattern="${check#*:}"
  if ls -lah . | grep --ignore-case -E "$pattern"; then
    >&2 echo "[fail] $label files found in root directory"
    exit 1
  else
    echo "[ok] No $label files found in root directory; put them in ./docs/media/products/gonaives"
  fi
done

echo "Moving on"
