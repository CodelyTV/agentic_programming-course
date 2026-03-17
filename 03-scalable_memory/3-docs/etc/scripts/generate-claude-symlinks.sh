#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
base_dir="$(dirname "$script_dir")"

find "$base_dir" -name "AGENTS.md" -not -path "*/node_modules/*" | while read -r agents_file; do
  dir="$(dirname "$agents_file")"
  claude_file="$dir/CLAUDE.md"

  if [[ -e "$claude_file" ]]; then
    echo "Skipping $claude_file (already exists)"
    continue
  fi

  ln -s "AGENTS.md" "$claude_file"
  echo "Created symlink $claude_file → AGENTS.md"
done
