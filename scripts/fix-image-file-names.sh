#!/usr/bin/env bash

base_dir="./docs/media/products"

if [[ ! -d "$base_dir" ]]; then
  >&2 echo "Fail: $base_dir does not exist"
  exit 1
fi

while IFS= read -r -d '' dir; do
  while IFS= read -r -d '' file; do
    name="$(basename "$file")"
    [[ "$name" == "README.md" ]] && continue

    lower="$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]')"

    if [[ "$lower" == *.* ]]; then
      base="${lower%.*}"
      ext="${lower##*.}"
    else
      base="$lower"
      ext=""
    fi

    sanitized_base="$(printf '%s' "$base" | sed -E 's/[^a-z0-9_-]/-/g')"

    if [[ -n "$ext" ]]; then
      sanitized_ext="$(printf '%s' "$ext" | sed -E 's/[^a-z0-9_-]/-/g')"
      newname="${sanitized_base}.${sanitized_ext}"
    else
      newname="$sanitized_base"
    fi

    [[ "$newname" == "$name" ]] && continue

    target="$dir/$newname"

    if [[ -e "$target" ]]; then
      >&2 echo "Skip: $dir/$name -> $newname (target already exists)"
      continue
    fi

    mv -- "$file" "$target"
    echo "Renamed: $dir/$name -> $newname"
  done < <(find "$dir" -maxdepth 1 -type f -print0)
done < <(find "$base_dir" -mindepth 1 -maxdepth 1 -type d -print0)
