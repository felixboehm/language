# Language Lessons

This directory contains language learning lessons in YAML format. Lessons are organized in a two-level hierarchy based on the learning and teaching languages.

## Directory Structure

```
lessons/
├── README.md
├── deutsch/                    # Learning in German
│   ├── portugiesisch/         # Teaching Portuguese
│   │   ├── 01-basic-verbs.yaml
│   │   ├── 02-modal-verbs.yaml
│   │   └── 03-daily-activities.yaml
│   └── englisch/              # Teaching English
│       └── 01-greetings.yaml
├── english/                    # Learning in English (examples)
│   ├── portugese/             # Teaching Portuguese
│   ├── math-algebra/          # Non-language topics
│   └── driver-license/
└── [learning-language]/
    └── [teaching-language-or-topic]/
```

## Folder Structure

Lessons use a **two-level folder hierarchy**:

1. **First level** (`learning`): The language you're learning **in** (interface language)
   - Examples: `deutsch`, `english`, `spanish`
   
2. **Second level** (`teaching`): The language or topic being **taught**
   - Examples: `portugiesisch`, `englisch`, `math-algebra`, `driver-license`

### Examples:

- `lessons/deutsch/portugiesisch/` - Learn Portuguese with German explanations
- `lessons/deutsch/englisch/` - Learn English with German explanations
- `lessons/english/portugese/` - Learn Portuguese with English explanations
- `lessons/english/math-algebra/` - Learn math/algebra in English
- `lessons/english/driver-license/` - Driver's license materials in English

This structure allows the same content to be presented from different linguistic perspectives or to teach non-language topics.

## Currently Available:

- **deutsch/portugiesisch/** - Portuguese lessons with German interface
  - 3 lessons: basic verbs, modal verbs, daily activities
  
- **deutsch/englisch/** - English lessons with German interface
  - 1 lesson: greetings and introductions

## Adding New Lessons

To add lessons for a new language pair or topic:

1. Create the folder structure: `lessons/<learning>/<teaching>/`
2. Add lesson files following the schema (see `docs/lesson-schema.md`)
3. Number lessons sequentially: `01-topic.yaml`, `02-topic.yaml`, etc.

Example for Spanish lessons in an English interface:
```yaml
number: 1
title: "Basic Greetings"
description: "Learn common Spanish greetings"
sections: [...]
```

**Note**: Language specification is determined by the folder path, not by fields in the YAML file.

## Lesson File Format

All lessons follow the YAML schema documented in `/docs/lesson-schema.md`. Key elements:

- **number**: Lesson number (integer)
- **title**: Lesson title
- **description**: Brief description of the lesson
- **sections**: Array of learning sections
  - **title**: Section title
  - **explanation**: Optional markdown explanation
  - **examples**: Array of Q&A examples
    - **q**: Question/source sentence
    - **a**: Answer/translation
    - **labels**: Optional array of labels (e.g., ["Futur", "Gerundium"])
    - **rel**: Related items (vocabulary)

### Example Labels

Labels help categorize examples by grammar concepts:
- **Futur** - Future tense
- **Gerundium** - Gerund forms
- **Passiv** - Passive voice
- **Präteritum** - Past tense
- **Konjunktiv** - Subjunctive mood

Labels are displayed on example cards and can be used to filter or search for specific grammar topics.

## Loading Lessons

To load lessons in your application:

```javascript
// Example: Load all Portuguese lessons (German interface)
const portugueseLessons = [
  'lessons/deutsch/portugiesisch/01-basic-verbs.yaml',
  'lessons/deutsch/portugiesisch/02-modal-verbs.yaml',
  'lessons/deutsch/portugiesisch/03-daily-activities.yaml'
];

// Example: Load English lessons (German interface)
const englishLessons = [
  'lessons/deutsch/englisch/01-greetings.yaml'
];

// Use a YAML parser to load the files
// For example with js-yaml:
// const lesson = YAML.parse(fs.readFileSync(lessonPath, 'utf8'));
```

## Folder Naming Conventions

Use lowercase folder names without special characters:
- **German**: `deutsch`
- **English**: `englisch`, `english`
- **Portuguese**: `portugiesisch`, `portugese`
- **Spanish**: `spanisch`, `spanish`
- **Topics**: `math-algebra`, `driver-license`, etc.

## Contributing

When adding new lessons:

1. Follow the schema documentation
2. Create appropriate folder structure: `lessons/<learning>/<teaching>/`
3. Maintain consistent numbering within each folder
4. Include 5-10 sections per lesson
5. Provide 3-5 examples per section
6. Add relevant vocabulary in the `rel` field
7. Use markdown for explanations when needed
8. Add labels to examples for grammar categorization

## See Also

- `/docs/lesson-schema.md` - Complete schema documentation with examples
- `/docs/quick-start.md` - Quick start guide
- `/docs/usage-examples.md` - Code examples
- Example lessons in `deutsch/portugiesisch/` and `deutsch/englisch/`
