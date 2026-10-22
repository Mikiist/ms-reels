#!/bin/bash
# Baut die angegebenen Reels nacheinander: bash plan/bauen.sh 2026-10-24-1 2026-10-24-2 ...
cd "$(dirname "$0")/.."
for id in "$@"; do
  PAR=${PAR:-2} python3 engine/build.py all work/$id > work/$id/build.log 2>&1 && python3 engine/check.py work/$id >> work/$id/build.log 2>&1
  echo "$id EXIT $? $(date +%H:%M)" >> /tmp/bau.log
done
