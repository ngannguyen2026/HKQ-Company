#!/usr/bin/env bash
# Quay về bản release trước đó (chạy trên server).
#   sudo -u deploy /var/www/bhqcompany/rollback.sh            # về bản ngay trước bản hiện tại
#   sudo -u deploy /var/www/bhqcompany/rollback.sh <release>  # về một bản cụ thể
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/bhqcompany}"
cd "$APP_DIR"

current="$(basename "$(readlink current)")"

if [ $# -ge 1 ]; then
  target="$1"
else
  target="$(ls -1 releases | sort | grep -B1 -x "$current" | head -n1)"
fi

if [ -z "$target" ] || [ "$target" = "$current" ] || [ ! -d "releases/$target" ]; then
  echo "Không tìm thấy release để rollback. Các bản hiện có:" >&2
  ls -1 releases | sort >&2
  exit 1
fi

ln -sfn "$APP_DIR/releases/$target" current.tmp
mv -T current.tmp current
echo "Đã rollback: $current -> $target"
