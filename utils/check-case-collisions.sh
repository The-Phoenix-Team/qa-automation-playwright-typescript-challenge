#!/bin/bash

echo "🔍 Scanning for case-insensitive file conflicts..."

# Get list of all Git-tracked files, normalize to lowercase, and count duplicates
git ls-files | awk '{ print tolower($0) }' | sort | uniq -d > .case-duplicates.tmp

if [[ -s .case-duplicates.tmp ]]; then
  echo "🚨 Potential case conflicts found:"
  cat .case-duplicates.tmp
  echo "❗ These files may break on Linux/CI (case-sensitive systems)"
else
  echo "✅ No casing conflicts found. You're clean!"
fi

rm -f .case-duplicates.tmp
