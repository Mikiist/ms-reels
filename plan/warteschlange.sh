#!/bin/bash
# Arbeitet /tmp/bau-queue.txt Zeile für Zeile ab (eine ID pro Zeile). Stoppt bei /tmp/bau-stop.
cd "$(dirname "$0")/.."
while true; do
  [ -f /tmp/bau-stop ] && exit 0
  id=$(head -n1 /tmp/bau-queue.txt 2>/dev/null)
  if [ -z "$id" ]; then sleep 20; continue; fi
  sed -i '1d' /tmp/bau-queue.txt
  while pgrep -f "plan/bauen.sh" >/dev/null; do sleep 15; done
  bash plan/bauen.sh "$id"
done
