# Language Learning Lessons - Documentation

Complete documentation for the language learning lesson system.

## Overview

This system provides a flexible, YAML-based format for creating and managing language learning lessons. It supports:

- **Multiple languages**: Add lessons for any language pair
- **Vocabulary tracking**: Track learned words across lessons
- **Progress monitoring**: Monitor learning progress
- **Flexible structure**: Generic format works for various learning styles
- **Markdown support**: Rich explanations with formatting

## Documentation Files

### 📚 [Quick Start Guide](quick-start.md)
**Start here!** Get up and running in minutes with practical examples and common tasks.

**Topics covered:**
- Loading and displaying lessons
- Tracking learning progress
- Creating quizzes
- Adding your own lessons

### 📖 [Lesson Schema Documentation](lesson-schema.md)
**Complete schema reference** with detailed explanations and examples.

**Topics covered:**
- Full schema structure
- Field descriptions
- Related items system
- Learning progress tracking
- Best practices

### 💻 [Usage Examples](usage-examples.md)
**Code examples** for common use cases in JavaScript and Python.

**Topics covered:**
- Loading lessons
- Extracting vocabulary
- Progress tracking
- Filtering and quizzes
- Spaced repetition
- Multi-language support
- Progress reports

### 📂 [Lessons README](../lessons/README.md)
**Overview of available lessons** and language switching.

**Topics covered:**
- Available languages
- Directory structure
- Adding new languages
- Language codes

## Quick Reference

### Lesson Structure

```yaml
number: 1                      # Lesson number
title: "Lesson Title"          # Title
description: "Description"     # Optional description
language_from: "pt"            # Source language (ISO 639-1)
language_to: "de"              # Target language (ISO 639-1)
sections:                      # Array of sections
  - title: "Section Title"
    explanation: |             # Optional markdown
      **Bold** text here
    examples:                  # Array of examples
      - q: "Question"          # Question/source
        a: "Answer"            # Answer/translation
        rel:                   # Related items
          - ["term1", "translation1", "note1"]
          - ["term2", "translation2"]
```

### Available Lessons

#### Portuguese (PT → DE)
1. **Basic Verbs** - Ser, Estar, Ter, Fazer, Ir
2. **Modal Verbs** - Querer, Poder, Dever, Saber, Conhecer
3. **Daily Activities** - Morning routine, work, meals, leisure, evening

#### English (EN → DE)
1. **Greetings and Introductions** - Basic greetings, introductions, questions, responses

## Design Philosophy

### 1. Generic and Flexible
The schema is intentionally generic to support various learning scenarios:
- Language learning (primary use)
- Vocabulary building
- Grammar exercises
- Q&A style content

### 2. Data-Driven
Lessons are pure data (YAML), separated from presentation logic. This allows:
- Easy editing without code changes
- Multiple UI implementations
- Automated processing and analysis
- Export/import between systems

### 3. Progress Tracking
The related items (`rel`) system enables sophisticated progress tracking:
- Items identified by first element
- Same item can appear in multiple examples
- Mark items or examples as learned
- Track progress across lessons

### 4. Human-Readable
YAML format makes lessons:
- Easy to read and edit
- Version control friendly
- Accessible to non-programmers
- Portable across systems

## Schema Features

### Related Items (`rel`)

The most powerful feature of the schema. Each example can have multiple related items:

```yaml
rel:
  - ["casa", "Haus", "noun"]                    # Word + translation + type
  - ["estar", "sein (temporär)", "verb"]        # Verb with note
  - ["eu", "ich", "pronoun", "1st person"]      # Multiple metadata fields
```

**Key points:**
- Array of arrays
- First element = unique identifier (item ID)
- Can have 2 or more elements
- Same ID across examples = same item
- Items tracked independently

### Markdown Explanations

Sections can include rich explanations:

```yaml
explanation: |
  **SER** is used for permanent characteristics:
  - Identity (nationality, profession)
  - Physical traits
  
  *Examples:* Eu sou alemão, Ela é médica
```

Rendered as formatted HTML with markdown processors.

### Language Pairs

Specify any language pair using ISO 639-1 codes:

```yaml
language_from: "pt"  # Portuguese
language_to: "de"    # German
```

Common codes: `en`, `de`, `pt`, `es`, `fr`, `it`, `nl`, `ru`, `zh`, `ja`

## Getting Started

### For Learners

1. Browse available lessons in `/lessons/`
2. Open lessons in any YAML-compatible app
3. Use the example web app (`index.html`) or create your own
4. Track progress using localStorage or a database

### For Developers

1. Read the [Quick Start Guide](quick-start.md)
2. Check [Usage Examples](usage-examples.md) for code
3. Load lessons using a YAML parser
4. Implement your own UI and progress tracking

### For Content Creators

1. Review the [Lesson Schema](lesson-schema.md)
2. Look at existing lessons for examples
3. Create your lesson files following the schema
4. Validate with a YAML parser
5. Submit via pull request

## File Organization

```
language/
├── docs/                          # Documentation
│   ├── README.md                  # This file
│   ├── quick-start.md             # Quick start guide
│   ├── lesson-schema.md           # Schema documentation
│   └── usage-examples.md          # Code examples
├── lessons/                       # Lesson content
│   ├── README.md                  # Lessons overview
│   ├── portuguese/                # Portuguese lessons
│   │   ├── 01-basic-verbs.yaml
│   │   ├── 02-modal-verbs.yaml
│   │   └── 03-daily-activities.yaml
│   └── english/                   # English lessons
│       └── 01-greetings.yaml
└── index.html                     # Example web application
```

## Common Use Cases

### 1. Language Learning App
Build a web or mobile app that:
- Loads lessons from YAML files
- Displays examples with translations
- Tracks learned vocabulary
- Shows progress statistics
- Generates quizzes

### 2. Flashcard System
Extract vocabulary and create flashcards:
- Front: source term
- Back: translation + example
- Track review intervals
- Spaced repetition

### 3. Educational Platform
Create a comprehensive learning platform:
- Multiple language courses
- Progress tracking per student
- Adaptive difficulty
- Gamification elements

### 4. Personal Study Tool
Simple command-line or web tool:
- Load lessons you're working on
- Mark words as learned
- Focus on difficult vocabulary
- Export progress reports

## Validation

Validate your lesson files:

```bash
# Python
python3 -c "import yaml; yaml.safe_load(open('lessons/portuguese/01-basic-verbs.yaml'))"

# Node.js
node -e "const yaml = require('js-yaml'); const fs = require('fs'); yaml.load(fs.readFileSync('lessons/portuguese/01-basic-verbs.yaml', 'utf8'));"
```

No errors = valid YAML!

## Contributing

To contribute new lessons:

1. Follow the schema in `lesson-schema.md`
2. Create well-structured examples
3. Include diverse vocabulary
4. Add helpful explanations
5. Validate your YAML
6. Submit a pull request

## Version History

- **v1.0** (2024) - Initial schema and documentation
  - YAML-based lesson format
  - Generic q/a/rel structure
  - Portuguese and English examples
  - Complete documentation

## Future Enhancements

Potential additions to the schema:
- Audio file references for pronunciation
- Image references for visual learning
- Difficulty ratings for lessons/examples
- Tags and categories
- Exercise types beyond Q&A
- Assessment questions

## License

See repository LICENSE file for licensing information.

## Support

For questions, issues, or contributions:
- Read the documentation thoroughly
- Check existing lessons for examples
- Validate your YAML syntax
- Open an issue or pull request on GitHub

---

**Happy Learning! 🎓**
