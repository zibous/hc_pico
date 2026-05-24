#!/bin/bash

SAVE=false

for arg in "$@"; do
  case $arg in
    --save) SAVE=true ;;
    --help)
      echo "Usage: ./check.sh [--save]"
      exit 0
      ;;
  esac
done

echo -e "\n🔍 Starte Code-Check (Ruff + Pyright)...\n"

RUFF_CMD="ruff check . --select F --exclude tests,.venv"

if [ "$SAVE" = true ]; then
{
  echo "===== RUFF ====="
  $RUFF_CMD

  echo ""
  echo "===== PYRIGHT ====="
  pyright .
} | tee fehler.txt
else
{
  echo "===== RUFF ====="
  $RUFF_CMD

  echo ""
  echo "===== PYRIGHT ====="
  pyright .
}
fi

echo -e "\n🧹 Cleanup..."
find . -type d \( -name "__pycache__" -o -name ".mypy_cache" -o -name ".pyrightcache" \) -prune -exec rm -rf {} +

echo "✅ Fertig"