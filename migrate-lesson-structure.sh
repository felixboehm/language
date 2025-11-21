#!/usr/bin/env bash

# Migration script: Convert flat lesson files to folder structure
# Old: lessons/deutsch/portugiesisch/01-essential-verbs.yaml
# New: lessons/deutsch/portugiesisch/01-essential-verbs/content.yaml
#      lessons/deutsch/portugiesisch/01-essential-verbs/audio/

LESSONS_DIR="public/lessons"
AUDIO_DIR="public/audio"

echo "🔄 Migrating lesson structure..."
echo "   Converting YAML files to folder-based structure"
echo ""

# Check if we're in the right directory
if [[ ! -d "$LESSONS_DIR" ]]; then
  echo "❌ Error: $LESSONS_DIR not found"
  echo "   Please run this script from the project root"
  exit 1
fi

total_migrated=0
total_skipped=0

# Find all lesson YAML files (excluding metadata files)
while IFS= read -r -d '' lesson_file; do
  basename_file=$(basename "$lesson_file")

  # Skip metadata files
  if [[ "$basename_file" == "index.yaml" || \
        "$basename_file" == "languages.yaml" || \
        "$basename_file" == "lessons.yaml" || \
        "$basename_file" == "topics.yaml" ]]; then
    continue
  fi

  # Get the directory and filename without extension
  lesson_dir=$(dirname "$lesson_file")
  filename=$(basename "$lesson_file" .yaml)

  # Target folder structure
  target_folder="$lesson_dir/$filename"
  target_content="$target_folder/content.yaml"
  target_audio_dir="$target_folder/audio"

  # Check if already migrated
  if [[ -d "$target_folder" && -f "$target_content" ]]; then
    echo "⏭️  Skipping (already migrated): $lesson_file"
    ((total_skipped++))
    continue
  fi

  echo "📦 Migrating: $lesson_file"

  # Create the folder structure
  mkdir -p "$target_folder"
  mkdir -p "$target_audio_dir"

  # Move the YAML file and rename to content.yaml
  mv "$lesson_file" "$target_content"
  echo "   ✓ Moved to: $target_content"

  # Check for existing audio files in old structure
  # Extract path components
  rel_path="${lesson_file#$LESSONS_DIR/}"
  learning=$(echo "$rel_path" | cut -d'/' -f1)
  teaching=$(echo "$rel_path" | cut -d'/' -f2)
  old_audio_dir="$AUDIO_DIR/$learning/$teaching/$filename"

  if [[ -d "$old_audio_dir" ]]; then
    echo "   🎵 Found existing audio files, moving them..."
    # Move all audio files to new location
    mv "$old_audio_dir"/* "$target_audio_dir/" 2>/dev/null
    # Remove old audio directory
    rmdir "$old_audio_dir" 2>/dev/null
    echo "   ✓ Moved audio files to: $target_audio_dir/"
  else
    echo "   ℹ️  No existing audio files found"
  fi

  ((total_migrated++))
  echo ""

done < <(find "$LESSONS_DIR" -name "*.yaml" -type f -print0)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Migration complete!"
echo "   Migrated: $total_migrated lessons"
echo "   Skipped: $total_skipped lessons (already migrated)"
echo ""

# Clean up empty audio directories
if [[ -d "$AUDIO_DIR" ]]; then
  echo "🧹 Cleaning up old audio directory structure..."
  find "$AUDIO_DIR" -type d -empty -delete 2>/dev/null

  # If audio directory is now empty, remove it
  if [[ -z "$(ls -A "$AUDIO_DIR" 2>/dev/null)" ]]; then
    rmdir "$AUDIO_DIR" 2>/dev/null
    echo "   ✓ Removed empty $AUDIO_DIR directory"
  fi
fi

echo ""
echo "📂 New structure example:"
echo "   lessons/deutsch/portugiesisch/"
echo "   └── 01-essential-verbs/"
echo "       ├── content.yaml"
echo "       └── audio/"
echo "           ├── title.mp3"
echo "           ├── 0-title.mp3"
echo "           ├── 0-0-q.mp3"
echo "           └── 0-0-a.mp3"
