#!/bin/bash

COMMAND=$(cat | jq -r '.tool_input.command')

if echo "$COMMAND" | grep -qE '(^|\s|;|&&|\|\|)export(\s|$)'; then
  echo "Blocked: the 'export' command is not allowed by security policy" >&2
  exit 2
fi

exit 0
