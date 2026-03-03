#!/usr/bin/env bash

set -euo pipefail

SINCE=$(date -v-7d +%Y-%m-%d 2>/dev/null || date -d "7 days ago" +%Y-%m-%d)
git log --oneline --since="$SINCE"
