base="./docs/media/products"

if [[ ! -d "$base" ]]; then
  >&2 echo "Fail: $base does not exist"
  exit 1
fi

fail=0

while IFS= read -r -d '' dir; do
  if [[ ! -f "$dir/README.md" ]]; then
    >&2 echo "Fail: $dir is missing README.md"
    fail=1
  fi

  while IFS= read -r -d '' file; do
    name="$(basename "$file")"
    [[ "$name" == "README.md" ]] && continue

    if [[ ! "$name" =~ ^[a-z0-9_-]+(\.[a-z0-9_-]+)?$ ]]; then
      >&2 echo "Fail: $dir/$name contains disallowed characters. Use ./scripts/fix-image-file-names.sh to fix this."
      fail=1
    fi
  done < <(find "$dir" -maxdepth 1 -type f -print0)
done < <(find "$base" -mindepth 1 -maxdepth 1 -type d -print0)

if [[ "$fail" -eq 0 ]]; then
  echo "All product media folders passed validation"
else
  exit 1
fi
