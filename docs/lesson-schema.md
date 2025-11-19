# Lesson Schema Documentation

## Overview

This document describes the generic lesson schema used for language learning. The schema is designed to be flexible and support learning any language pair or educational content.

## Format

Lessons are stored in **YAML** format for human readability and ease of editing.

## File Organization

```
lessons/
├── deutsch/                    # Learning language
│   ├── portugiesisch/         # Teaching language
│   │   ├── 01-basics.yaml
│   │   ├── 02-verbs.yaml
│   │   └── ...
│   └── englisch/
│       ├── 01-greetings.yaml
│       └── ...
├── english/                    # Learning language
│   ├── portugese/             # Teaching language
│   │   └── ...
│   └── math-algebra/          # Non-language topics
│       └── ...
└── [learning-language]/
    └── [teaching-language-or-topic]/
        └── ...
```

Lessons are organized in a two-level hierarchy:
1. **First level** (`learning`): The language you're learning in (e.g., `deutsch`, `english`)
2. **Second level** (`teaching`): The language or topic being taught (e.g., `portugiesisch`, `englisch`, `math-algebra`)

This structure allows for maximum flexibility - you can learn Portuguese from a German perspective (`deutsch/portugiesisch/`) or from an English perspective (`english/portugese/`), or even learn non-language topics like `english/driver-license/`.

## Lesson Structure

### Top Level

```yaml
number: 1                           # Lesson number (integer)
title: "Lesson Title"               # Lesson title (string)
description: "Brief description"    # Optional lesson description
sections: [...]                     # Array of sections (see below)
```

### Section Structure

Each lesson contains 5-10 sections. Sections have:

```yaml
sections:
  - title: "Section Title"          # Section title (string)
    explanation: |                  # Optional markdown explanation
      This is an **explanation** of the section.
      It supports _markdown_ formatting.
    examples: [...]                 # Array of examples (see below)
```

### Example Structure

Examples follow the q/a/rel pattern:

```yaml
examples:
  - q: "Question or source sentence"    # Question/source language
    a: "Answer or target sentence"      # Answer/target language
    labels: ["Futur", "Gerundium"]      # Optional labels for categorization
    rel:                                # Related items (vocabulary, etc.)
      - ["term1", "translation1"]       # Each item is an array of strings
      - ["term2", "translation2"]       # First element is the item ID
```

### Labels (Optional)

Examples can have optional labels to categorize them by grammar concepts or topics:

- **Format**: Array of strings
- **Usage**: Labels like "Gerundium", "Futur", "Passiv", "Präteritum", etc.
- **Display**: Shown on example cards, not as titles
- **Searchability**: Allows filtering and searching examples by label

#### Example:

```yaml
examples:
  - q: "Ela vai estudar medicina."
    a: "Sie wird Medizin studieren."
    labels: ["Futur"]
    rel:
      - ["vai", "geht/wird (sie/er)", "verb - ir"]
      - ["estudar", "studieren", "verb"]
```

### Related Items (`rel`)

Related items are vocabulary or concepts associated with an example:

- **Format**: Array of arrays
- **First element**: Acts as the unique identifier for the item
- **Elements**: Can be 2 or more strings (or numbers)
- **Multiple examples**: Can reference the same item using the same first element
- **Learning tracking**: Items can be marked as learned independently

#### Example:

```yaml
rel:
  - ["casa", "Haus", "noun"]           # Portuguese word, German translation, part of speech
  - ["cansado", "müde", "adjective"]   # Another vocabulary item
  - ["estar", "sein (temporär)"]       # Two strings only
```

When an example is marked as learned, all its related items can be marked as learned. The same item (identified by the first term) can appear in multiple examples.

## Complete Example

Here's a complete lesson file example:

```yaml
number: 1
title: "Basic Verbs - Ser and Estar"
description: "Learn the difference between permanent and temporary states of being"
sections:
  - title: "SER - Permanent Being"
    explanation: |
      **SER** is used for permanent or inherent characteristics:
      - Identity (nationality, profession)
      - Characteristics (personality, physical traits)
      - Time and dates
      
      Conjugation: eu sou, tu és, ele/ela é, nós somos, eles/elas são
    examples:
      - q: "Eu sou alemão."
        a: "Ich bin Deutscher."
        rel:
          - ["sou", "bin (ich)", "verb"]
          - ["alemão", "Deutscher", "noun"]
      - q: "Ela é médica."
        a: "Sie ist Ärztin."
        rel:
          - ["é", "ist (sie)", "verb"]
          - ["médica", "Ärztin", "noun"]
      - q: "Nós somos uma equipa."
        a: "Wir sind ein Team."
        rel:
          - ["somos", "sind (wir)", "verb"]
          - ["equipa", "Team", "noun"]
  
  - title: "ESTAR - Temporary Being"
    explanation: |
      **ESTAR** is used for temporary states or locations:
      - Emotions and feelings
      - Location
      - Temporary conditions
      
      Conjugation: eu estou, tu estás, ele/ela está, nós estamos, eles/elas estão
    examples:
      - q: "Eu estou cansado."
        a: "Ich bin müde."
        rel:
          - ["estou", "bin (ich)", "verb"]
          - ["cansado", "müde", "adjective"]
      - q: "Ela está no escritório."
        a: "Sie ist im Büro."
        rel:
          - ["está", "ist (sie)", "verb"]
          - ["escritório", "Büro", "noun"]
      - q: "Nós estamos prontos."
        a: "Wir sind bereit."
        rel:
          - ["estamos", "sind (wir)", "verb"]
          - ["prontos", "bereit", "adjective"]
```

## Learning Progress Tracking

### Marking Items as Learned

Items can be marked as learned individually:

```javascript
// Item ID is the first element of the rel array
const itemId = "casa";  // From ["casa", "Haus", "noun"]

// Track learned items
learnedItems = ["casa", "cansado", "médica"];
```

### Marking Examples as Learned

When an example is marked as learned, you can optionally mark all its related items as learned:

```javascript
example.rel.forEach(item => {
  const itemId = item[0];
  learnedItems.push(itemId);
});
```

### Cross-Example Item Tracking

The same vocabulary item can appear in multiple examples. The first term acts as a unique identifier:

```yaml
# Example 1
examples:
  - q: "Eu tenho uma casa."
    a: "Ich habe ein Haus."
    rel:
      - ["casa", "Haus", "noun"]

# Example 2 (different lesson)
examples:
  - q: "A casa é grande."
    a: "Das Haus ist groß."
    rel:
      - ["casa", "Haus", "noun"]  # Same item ID "casa"
```

Both examples reference the same vocabulary item. When marked as learned from either example, it's considered learned globally.

### Filtering by Labels

Labels enable filtering and searching examples by grammar concepts:

```javascript
// Get all examples with "Futur" label
function getExamplesByLabel(lesson, label) {
  const results = [];
  lesson.sections.forEach(section => {
    section.examples.forEach(example => {
      if (example.labels && example.labels.includes(label)) {
        results.push(example);
      }
    });
  });
  return results;
}

// Usage
const futurExamples = getExamplesByLabel(lesson, "Futur");
```

## Folder Structure and Language Specification

The language pair is determined by the folder structure, not by fields in the lesson file:

- **Path**: `lessons/<learning>/<teaching>/lesson.yaml`
- **Example**: `lessons/deutsch/portugiesisch/01-verbs.yaml`
  - Learning language: German (deutsch)
  - Teaching language: Portuguese (portugiesisch)

This allows the same lesson content to be reused in different contexts without modification.

## Best Practices

1. **Number lessons sequentially** starting from 01
2. **Keep sections focused** on one topic (5-10 sections per lesson)
3. **Include 3-5 examples** per section
4. **Use markdown** in explanations for formatting
5. **Be consistent** with vocabulary terms (same term = same ID)
6. **Add context** in rel items (part of speech, usage notes)
7. **Progressive difficulty** - order lessons from simple to complex
8. **Use labels** to categorize examples by grammar concepts
9. **Organize folders** by learning/teaching language hierarchy

## Schema Flexibility

This schema is intentionally generic and can be used for:

- **Language learning** (primary use case)
- **Vocabulary building**
- **Grammar exercises**
- **Any Q&A style learning**

Simply adjust `q` and `a` to represent whatever you're teaching/learning, and use `rel` for associated reference materials.
