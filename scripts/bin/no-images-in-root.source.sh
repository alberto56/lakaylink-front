ls -lah . | grep --ignore-case -E '\.jpe?g$' && { >&2 echo "Fail: JPEG files found in root directory"; exit 1; } || echo "No jpeg files found in root directory"
ls -lah . | grep --ignore-case -E '\.png$' && { >&2 echo "Fail: PNG files found in root directory"; exit 1; } || echo "No png files found in root directory"
echo "Moving on"
