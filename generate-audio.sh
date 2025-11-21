#!/usr/bin/env bash

# Generate audio files for YAML lessons
# Uses yq for YAML parsing, macOS 'say' for TTS, and ffmpeg for MP3 conversion
#
# Usage:
#   ./generate-lesson-audio.sh                    # Generate all lessons
#   ./generate-lesson-audio.sh -f                 # Force regenerate all
#   ./generate-lesson-audio.sh path/to/lesson.yaml # Generate single lesson
#   ./generate-lesson-audio.sh -f path/to/lesson.yaml # Force single lesson

LESSONS_DIR="public/lessons"
OUTPUT_DIR="public/audio"
FORCE_REGENERATE=false
SINGLE_LESSON=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -f|--force)
      FORCE_REGENERATE=true
      shift
      ;;
    *)
      SINGLE_LESSON="$1"
      shift
      ;;
  esac
done

# Voice mapping by language code
declare -A VOICES
VOICES["de-DE"]="Anna"        # German
VOICES["de"]="Anna"
VOICES["pt-PT"]="Joana"       # Portuguese (Portugal)
VOICES["pt"]="Joana"
VOICES["en-US"]="Samantha"    # English
VOICES["en"]="Samantha"
VOICES["es-ES"]="Mónica"      # Spanish
VOICES["es"]="Mónica"

echo "🎵 Generating audio files for lessons..."
if [[ "$FORCE_REGENERATE" == true ]]; then
  echo "   🔄 Force mode: regenerating existing files"
fi
echo ""

# Check dependencies
if ! command -v yq &> /dev/null; then
  echo "❌ Error: yq is not installed"
  echo "   Install with: brew install yq"
  exit 1
fi

if ! command -v ffmpeg &> /dev/null; then
  echo "⚠️  Warning: ffmpeg not found. Audio will be saved as AIFF instead of MP3"
  echo "   Install with: brew install ffmpeg"
  HAS_FFMPEG=false
else
  HAS_FFMPEG=true
fi

# Function to get language code from YAML file
get_language_code() {
  local yaml_file="$1"
  local folder_name="$2"

  if [[ ! -f "$yaml_file" ]]; then
    echo ""
    return
  fi

  # Try to find the code for this folder
  local code=$(yq eval ".languages[] | select(.folder == \"$folder_name\") | .code" "$yaml_file" 2>/dev/null)
  if [[ -z "$code" || "$code" == "null" ]]; then
    code=$(yq eval ".topics[] | select(.folder == \"$folder_name\") | .code" "$yaml_file" 2>/dev/null)
  fi

  echo "$code"
}

# Function to get voice for a language
get_voice() {
  local folder_name="$1"
  local parent_dir="$2"

  # Try to get code from parent's topics.yaml or index.yaml
  local code=""
  if [[ -f "$parent_dir/topics.yaml" ]]; then
    code=$(get_language_code "$parent_dir/topics.yaml" "$folder_name")
  fi
  if [[ -z "$code" || "$code" == "null" ]] && [[ -f "$parent_dir/index.yaml" ]]; then
    code=$(get_language_code "$parent_dir/index.yaml" "$folder_name")
  fi

  # Try main languages.yaml
  if [[ -z "$code" || "$code" == "null" ]]; then
    code=$(get_language_code "$LESSONS_DIR/languages.yaml" "$folder_name")
  fi

  # Look up voice by code
  if [[ -n "$code" && "$code" != "null" ]]; then
    local voice="${VOICES[$code]}"
    if [[ -n "$voice" ]]; then
      echo "$voice"
      return
    fi
  fi

  # Fallback: try folder name directly (legacy support)
  local voice="${VOICES[$folder_name]}"
  if [[ -n "$voice" ]]; then
    echo "$voice"
    return
  fi

  # Default fallback
  echo "Alex"
}

# Function to process a single lesson file
process_lesson() {
  local lesson_file="$1"

  # Extract path components
  local rel_path="${lesson_file#$LESSONS_DIR/}"
  local learning=$(echo "$rel_path" | cut -d'/' -f1)
  local teaching=$(echo "$rel_path" | cut -d'/' -f2)
  local filename=$(basename "$lesson_file" .yaml)

  echo "📚 Processing: $learning/$teaching/$filename"

  # Create output directory
  local audio_dir="$OUTPUT_DIR/$learning/$teaching/$filename"
  mkdir -p "$audio_dir"

  # Get voices for this lesson
  local teaching_voice=$(get_voice "$teaching" "$LESSONS_DIR/$learning")
  local learning_voice=$(get_voice "$learning" "$LESSONS_DIR")

  if [[ "$teaching_voice" == "Alex" ]]; then
    echo "   ⚠️  No voice found for '$teaching', using default"
  fi

  if [[ "$learning_voice" == "Alex" ]]; then
    echo "   ⚠️  No voice found for '$learning', using default"
  fi

  local files_generated=0
  local files_skipped=0

  # Extract and generate title audio (in base/learning language)
  local title=$(yq eval '.title' "$lesson_file")
  if [[ "$title" != "null" && -n "$title" ]]; then
    local final_file="$audio_dir/title.mp3"

    if [[ "$FORCE_REGENERATE" == true ]] || [[ ! -f "$final_file" ]]; then
      echo "   🎙️  Title: $title"

      local temp_file="$audio_dir/title.aiff"

      say -v "$learning_voice" "$title" -o "$temp_file" 2>/dev/null

      if [[ "$HAS_FFMPEG" == true ]]; then
        ffmpeg -i "$temp_file" -codec:a libmp3lame -qscale:a 2 "$final_file" -y 2>/dev/null
        rm "$temp_file"
      else
        mv "$temp_file" "${temp_file%.aiff}.aiff"
      fi
      ((files_generated++))
    else
      ((files_skipped++))
    fi
  fi

  # Process sections and examples
  local section_count=$(yq eval '.sections | length' "$lesson_file")

  for ((s=0; s<section_count; s++)); do
    # Generate section title audio (in topic/teaching language)
    local section_title=$(yq eval ".sections[$s].title" "$lesson_file")
    if [[ "$section_title" != "null" && -n "$section_title" ]]; then
      local final_section="$audio_dir/$s-title.mp3"

      if [[ "$FORCE_REGENERATE" == true ]] || [[ ! -f "$final_section" ]]; then
        local temp_section="$audio_dir/$s-title.aiff"
        say -v "$teaching_voice" "$section_title" -o "$temp_section" 2>/dev/null

        if [[ "$HAS_FFMPEG" == true ]]; then
          ffmpeg -i "$temp_section" -codec:a libmp3lame -qscale:a 2 "$final_section" -y 2>/dev/null
          rm "$temp_section"
        fi
        ((files_generated++))
      else
        ((files_skipped++))
      fi
    fi

    local example_count=$(yq eval ".sections[$s].examples | length" "$lesson_file")

    for ((e=0; e<example_count; e++)); do
      # Get question and answer
      local question=$(yq eval ".sections[$s].examples[$e].q" "$lesson_file")
      local answer=$(yq eval ".sections[$s].examples[$e].a" "$lesson_file")

      if [[ "$question" != "null" && -n "$question" ]]; then
        # Generate question audio (in teaching language)
        local final_q="$audio_dir/$s-$e-q.mp3"

        if [[ "$FORCE_REGENERATE" == true ]] || [[ ! -f "$final_q" ]]; then
          local temp_q="$audio_dir/$s-$e-q.aiff"
          say -v "$teaching_voice" "$question" -o "$temp_q" 2>/dev/null

          if [[ "$HAS_FFMPEG" == true ]]; then
            ffmpeg -i "$temp_q" -codec:a libmp3lame -qscale:a 2 "$final_q" -y 2>/dev/null
            rm "$temp_q"
          fi
          ((files_generated++))
        else
          ((files_skipped++))
        fi
      fi

      if [[ "$answer" != "null" && -n "$answer" ]]; then
        # Generate answer audio (in learning language)
        local final_a="$audio_dir/$s-$e-a.mp3"

        if [[ "$FORCE_REGENERATE" == true ]] || [[ ! -f "$final_a" ]]; then
          local temp_a="$audio_dir/$s-$e-a.aiff"
          say -v "$learning_voice" "$answer" -o "$temp_a" 2>/dev/null

          if [[ "$HAS_FFMPEG" == true ]]; then
            ffmpeg -i "$temp_a" -codec:a libmp3lame -qscale:a 2 "$final_a" -y 2>/dev/null
            rm "$temp_a"
          fi
          ((files_generated++))
        else
          ((files_skipped++))
        fi
      fi
    done
  done

  # Report results
  if [[ $files_skipped -gt 0 ]]; then
    echo "   ✅ Generated $files_generated, skipped $files_skipped existing files"
  else
    echo "   ✅ Generated $files_generated audio files"
  fi
  echo ""
}

# Main execution
if [[ -n "$SINGLE_LESSON" ]]; then
  # Process single lesson
  if [[ ! -f "$SINGLE_LESSON" ]]; then
    echo "❌ Error: File not found: $SINGLE_LESSON"
    exit 1
  fi

  # Check if it's a lesson file (not index/topics/languages)
  basename_file=$(basename "$SINGLE_LESSON")
  if [[ "$basename_file" == "index.yaml" || "$basename_file" == "languages.yaml" || "$basename_file" == "lessons.yaml" || "$basename_file" == "topics.yaml" ]]; then
    echo "❌ Error: Cannot process $basename_file - this is a metadata file, not a lesson"
    exit 1
  fi

  process_lesson "$SINGLE_LESSON"

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Complete!"
  echo "   Output directory: $OUTPUT_DIR/"
else
  # Process all lessons
  total_files=0
  processed_files=0

  while IFS= read -r -d '' lesson_file; do
    # Skip index files and language definition files
    basename_file=$(basename "$lesson_file")
    if [[ "$basename_file" == "index.yaml" || "$basename_file" == "languages.yaml" || "$basename_file" == "lessons.yaml" || "$basename_file" == "topics.yaml" ]]; then
      continue
    fi

    ((total_files++))
    process_lesson "$lesson_file"
    ((processed_files++))
  done < <(find "$LESSONS_DIR" -name "*.yaml" -type f -print0)

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "✅ Complete!"
  echo "   Processed $processed_files lessons"
  echo "   Output directory: $OUTPUT_DIR/"
  echo ""

  # Show directory structure
  if command -v tree &> /dev/null; then
    echo "Directory structure:"
    tree -L 3 "$OUTPUT_DIR" | head -20
  else
    echo "Audio files:"
    find "$OUTPUT_DIR" -type f | head -20
    local total=$(find "$OUTPUT_DIR" -type f | wc -l)
    echo "   ... ($total files total)"
  fi
fi
