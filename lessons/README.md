# Language Lessons

This directory contains language learning lessons in YAML format. Each language has its own subdirectory with numbered lesson files.

## Directory Structure

```
lessons/
├── README.md           # This file
├── portuguese/         # Portuguese lessons (PT → DE)
│   ├── 01-basic-verbs.yaml
│   ├── 02-modal-verbs.yaml
│   └── 03-daily-activities.yaml
├── english/            # English lessons (EN → DE)
│   └── 01-greetings.yaml
└── [other-languages]/  # Add more languages as needed
```

## Language Switching

Each lesson subfolder represents a different source language. The language pair is defined in each lesson file:

- `language_from`: The language you're learning from (source)
- `language_to`: The language you're translating to (target)

### Currently Available:

- **Portuguese** (`lessons/portuguese/`) - Learning Portuguese with German translations
  - 3 lessons covering basic verbs, modal verbs, and daily activities
  
- **English** (`lessons/english/`) - Learning English with German translations
  - 1 lesson covering greetings and introductions

### Adding a New Language

To add lessons for a new language:

1. Create a new subdirectory under `lessons/` with the language name (e.g., `lessons/spanish/`)
2. Add lesson files following the schema (see `docs/lesson-schema.md`)
3. Number lessons sequentially: `01-topic.yaml`, `02-topic.yaml`, etc.
4. Specify the language codes in each lesson file

Example for Spanish lessons:
```yaml
number: 1
title: "Basic Greetings"
language_from: "es"  # Spanish
language_to: "de"    # German
sections: [...]
```

## Lesson File Format

All lessons follow the YAML schema documented in `/docs/lesson-schema.md`. Key elements:

- **number**: Lesson number (integer)
- **title**: Lesson title
- **description**: Brief description of the lesson
- **language_from**: Source language code (ISO 639-1)
- **language_to**: Target language code (ISO 639-1)
- **sections**: Array of learning sections
  - **title**: Section title
  - **explanation**: Optional markdown explanation
  - **examples**: Array of Q&A examples
    - **q**: Question/source sentence
    - **a**: Answer/translation
    - **rel**: Related items (vocabulary, terms)

## Loading Lessons

To load lessons in your application:

```javascript
// Example: Load all Portuguese lessons
const portugueseLessons = [
  'lessons/portuguese/01-basic-verbs.yaml',
  'lessons/portuguese/02-modal-verbs.yaml',
  'lessons/portuguese/03-daily-activities.yaml'
];

// Example: Load English lessons
const englishLessons = [
  'lessons/english/01-greetings.yaml'
];

// Use a YAML parser to load the files
// For example with js-yaml:
// const lesson = YAML.parse(fs.readFileSync(lessonPath, 'utf8'));
```

## Language Codes (ISO 639-1)

Common language codes:
- `en` - English
- `de` - German
- `pt` - Portuguese
- `es` - Spanish
- `fr` - French
- `it` - Italian
- `nl` - Dutch
- `ru` - Russian
- `zh` - Chinese
- `ja` - Japanese

## Contributing

When adding new lessons:

1. Follow the schema documentation
2. Maintain consistent numbering within each language folder
3. Include 5-10 sections per lesson
4. Provide 3-5 examples per section
5. Add relevant vocabulary in the `rel` field
6. Use markdown for explanations when needed

## See Also

- `/docs/lesson-schema.md` - Complete schema documentation with examples
- Example lessons in `portuguese/` and `english/` directories
