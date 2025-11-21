# YAML Schema Documentation

This document describes the YAML file schemas used for organizing and structuring learning content in the language learning application.

## Overview

The application uses a hierarchical structure of YAML files to organize content:

**Hierarchy**: Language → Topic → Lesson

1. **languages.yaml** - Root index listing all available languages (interface languages)
2. **topics.yaml** - Lists available topics for each language
3. **lessons.yaml** - Lists lesson files for each topic
4. **Individual lesson files** - Contain the actual lesson content (see [lesson-schema.md](lesson-schema.md))

## Directory Structure

```
lessons/
├── languages.yaml                  # Root: lists all available languages
├── deutsch/                        # Language folder
│   ├── topics.yaml                # Lists topics for this language
│   ├── portugiesisch/             # Topic folder
│   │   ├── lessons.yaml           # Lists lesson files
│   │   ├── 01-basic-verbs.yaml    # Individual lesson file
│   │   ├── 02-modal-verbs.yaml
│   │   └── ...
│   └── englisch/
│       ├── lessons.yaml
│       └── 01-greetings.yaml
└── english/                        # Another language folder
    ├── topics.yaml
    └── german/
        ├── lessons.yaml
        └── ...
```

## 1. languages.yaml

**Location**: `lessons/languages.yaml` (root level)

**Purpose**: Defines all available languages (interface/base languages) in the application.

### Schema

```yaml
languages:
  - folder: string              # Required: Folder name for this language
    code: string                # Required: Language code (BCP 47 format)
```

### Fields

- **languages** (array, required): List of available languages
  - **folder** (string, required): Directory name for this language (e.g., "deutsch", "english")
  - **code** (string, required): Language/locale code in BCP 47 format (e.g., "de-DE", "en-US")
    - Used for Web Speech API (text-to-speech)
    - Used for the interface/base language voice

### Example

```yaml
# Available languages
# This file lists all available base/interface languages
languages:
  - folder: deutsch
    code: de-DE
  - folder: english
    code: en-US
  - folder: francais
    code: fr-FR
```

### Usage in Code

```javascript
// In useLessons.js
const response = await fetch('lessons/languages.yaml')
const data = yaml.load(text)

// Iterate through languages
for (const lang of data.languages) {
  const folder = lang.folder    // "deutsch"
  const code = lang.code         // "de-DE"
}
```

## 2. topics.yaml

**Location**: `lessons/<language>/topics.yaml`

**Purpose**: Lists all available topics for a specific language.

### Schema

```yaml
topics:
  - folder: string              # Required: Folder name for this topic
    code: string                # Required: Language/voice code (BCP 47 format)
```

### Fields

- **topics** (array, required): List of available topics
  - **folder** (string, required): Directory name for this topic (e.g., "portugiesisch", "math-algebra")
  - **code** (string, required): Language/locale code for text-to-speech (BCP 47 format)
    - For language topics: the target language code (e.g., "pt-PT" for Portuguese)
    - For non-language topics: typically the same as the base language code

### Example

```yaml
# Available topics for German language
# This file lists all topics available in the German interface
topics:
  - folder: portugiesisch
    code: pt-PT
  - folder: englisch
    code: en-US
  - folder: spanisch
    code: es-ES
  - folder: math-algebra
    code: de-DE    # Non-language topic uses base language
```

### Usage in Code

```javascript
// In useLessons.js
const response = await fetch(`lessons/${lang}/topics.yaml`)
const data = yaml.load(text)

for (const topic of data.topics) {
  const folder = topic.folder    // "portugiesisch"
  const code = topic.code         // "pt-PT"
}
```

## 3. lessons.yaml

**Location**: `lessons/<language>/<topic>/lessons.yaml`

**Purpose**: Lists all lesson files available for a specific topic.

### Schema

```yaml
lessons:
  - string                      # Lesson filename (without .yaml extension)
```

### Fields

- **lessons** (array of strings, required): List of lesson filenames
  - Each entry is a string representing a lesson filename **without** the `.yaml` extension
  - Files should follow the naming convention: `##-descriptive-name` (e.g., "01-basic-verbs")
  - Lessons will be loaded and sorted by their `number` field, not by filename order

### Example

```yaml
# Portuguese topic lessons (German language)
lessons:
  - 01-basic-verbs
  - 02-modal-verbs
  - 03-daily-activities
  - 04-past-tense
  - 05-gerundium
  - 06-passive-subjunctive
```

### Naming Conventions

- **Prefix with number**: Use zero-padded numbers (01, 02, ..., 10, 11) for easy ordering
- **Descriptive names**: Use kebab-case for multi-word names (e.g., "basic-verbs", "daily-activities")
- **No extension**: Do not include `.yaml` in the filename list (added automatically by the loader)

### Usage in Code

```javascript
// In useLessons.js
const response = await fetch(`lessons/${lang}/${topic}/lessons.yaml`)
const data = yaml.load(text)

// data.lessons is an array of strings
console.log(data.lessons)  // ["01-basic-verbs", "02-modal-verbs", ...]

// Load each lesson
for (const filename of data.lessons) {
  const lesson = await loadLesson(lang, topic, filename)
  // filename is automatically appended with .yaml
}
```

## Audio Integration

The language codes specified in `languages.yaml` and `topics.yaml` are used for audio generation and text-to-speech functionality:

- **Language code** (`languages.yaml`): Used for reading answer translations (base language)
- **Topic code** (`topics.yaml`): Used for reading topic content including:
  - Lesson titles
  - Section titles
  - Questions in examples

### Audio File Structure

Pre-recorded audio files (if available) should follow this structure:

```
public/audio/
└── <language>/
    └── <topic>/
        └── <lesson-filename>/
            ├── 0-title.mp3                # Section 0 title (in topic language)
            ├── 0-0-q.mp3                  # Section 0, Example 0, Question (in topic language)
            ├── 0-0-a.mp3                  # Section 0, Example 0, Answer (in base language)
            ├── 0-1-q.mp3
            ├── 0-1-a.mp3
            ├── 1-title.mp3                # Section 1 title (in topic language)
            ├── 1-0-q.mp3
            └── ...
```

**Language Usage:**
- **Section titles** and **questions** use the **topic language** (e.g., Portuguese in `deutsch/portugiesisch/`)
- **Answers** use the **base language** (e.g., German in `deutsch/portugiesisch/`)

## Best Practices

### 1. Language Codes

- Use **BCP 47 format** (e.g., "en-US", "de-DE", "pt-PT", "es-ES")
- Include region variant when relevant (e.g., "pt-PT" for European Portuguese vs "pt-BR" for Brazilian)
- Ensure codes are supported by the Web Speech API in target browsers

### 2. Folder Names

- Use **lowercase** names
- Use **native language names** when possible (e.g., "deutsch" not "german")
- For compound words, use **hyphens** (e.g., "math-algebra", "driver-license")
- Keep names **consistent** and **descriptive**

### 3. File Organization

- Always create all three index files (`languages.yaml`, `topics.yaml`, `lessons.yaml`)
- Keep the directory structure consistent: `lessons/<language>/<topic>/`
- Update index files immediately when adding new content

### 4. Versioning and Updates

- **When adding a new language**:
  1. Add entry to `languages.yaml`
  2. Create `lessons/<language>/topics.yaml`
  3. Create topic folders and their `lessons.yaml` files

- **When adding a new topic**:
  1. Add entry to appropriate `topics.yaml`
  2. Create topic folder
  3. Create `lessons.yaml` in topic folder
  4. Add lesson files

- **When adding a new lesson**:
  1. Create lesson YAML file with proper schema (see [lesson-schema.md](lesson-schema.md))
  2. Add filename to `lessons.yaml`

## Validation

### Required Files Checklist

For each new content addition, ensure these files exist:

```
✓ lessons/languages.yaml exists
✓ lessons/<language>/topics.yaml exists
✓ lessons/<language>/<topic>/lessons.yaml exists
✓ All lesson files listed in lessons.yaml exist
✓ All YAML files are valid (parseable by js-yaml)
```

### Common Errors

**1. Missing index files**
```
Error: Failed to fetch topics.yaml for deutsch: 404
→ Create lessons/deutsch/topics.yaml
```

**2. Invalid YAML syntax**
```
Error: YAMLException: bad indentation
→ Check YAML syntax, ensure proper spacing (2 spaces, not tabs)
```

**3. Incorrect language codes**
```
Warning: Voice not available for language code 'xyz'
→ Use valid BCP 47 codes (en-US, de-DE, etc.)
```

**4. Missing .yaml extension**
```
# ❌ Wrong - includes extension
lessons:
  - 01-basic-verbs.yaml

# ✅ Correct - no extension
lessons:
  - 01-basic-verbs
```

## Examples

### Full Example: Adding German lessons with English interface

**1. Update or create `lessons/languages.yaml`:**
```yaml
languages:
  - folder: english
    code: en-US
```

**2. Create `lessons/english/topics.yaml`:**
```yaml
topics:
  - folder: german
    code: de-DE
```

**3. Create `lessons/english/german/lessons.yaml`:**
```yaml
lessons:
  - 01-basic-phrases
  - 02-numbers
```

**4. Create lesson files:**
- `lessons/english/german/01-basic-phrases.yaml`
- `lessons/english/german/02-numbers.yaml`

### Full Example: Adding Math Content

**1. Update `lessons/english/topics.yaml`:**
```yaml
topics:
  - folder: german
    code: de-DE
  - folder: math-algebra
    code: en-US    # Use interface language for non-language content
```

**2. Create `lessons/english/math-algebra/lessons.yaml`:**
```yaml
lessons:
  - 01-basic-operations
  - 02-equations
```

**3. Create lesson files with math content**

## See Also

- [Lesson Schema Documentation](lesson-schema.md) - Individual lesson file structure
- [Audio System Documentation](audio-system.md) - Audio playback and TTS integration
