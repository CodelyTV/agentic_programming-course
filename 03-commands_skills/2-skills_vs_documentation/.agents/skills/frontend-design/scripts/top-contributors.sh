#!/usr/bin/env bash

set -euo pipefail

SINCE=$(date -v-7d +%Y-%m-%d 2>/dev/null || date -d "7 days ago" +%Y-%m-%d)
{
  git shortlog -sn --since="$SINCE" HEAD | awk '{name=substr($0, index($0,$2)); print $1, name}'
  git log --since="$SINCE" --format='%(trailers:key=Co-Authored-By,valueonly)' HEAD \
    | sed '/^$/d' \
    | sed 's/^ *//' \
    | sed 's/ <.*>//' \
    | sort \
    | uniq -c \
    | awk '{name=substr($0, index($0,$2)); print $1, name}'
} | awk '{name=substr($0, index($0,$2)); counts[name]+=$1} END {for (n in counts) printf "%6d\t%s\n", counts[n], n}' \
  | sort -rn
