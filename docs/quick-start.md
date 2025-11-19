# Quick Start Guide

Get started with the language lessons system in minutes.

## Overview

This system provides a flexible, YAML-based format for language learning lessons. Lessons are organized by language and support:

- Multiple language pairs
- Vocabulary tracking
- Learning progress
- Markdown explanations
- Flexible related items (vocabulary, grammar notes, etc.)

## File Structure

```
language/
├── lessons/
│   ├── portuguese/          # Portuguese lessons
│   │   ├── 01-basic-verbs.yaml
│   │   ├── 02-modal-verbs.yaml
│   │   └── 03-daily-activities.yaml
│   ├── english/             # English lessons
│   │   └── 01-greetings.yaml
│   └── README.md
├── docs/
│   ├── lesson-schema.md     # Complete schema documentation
│   ├── usage-examples.md    # Code examples
│   └── quick-start.md       # This file
└── index.html               # Example web app
```

## Quick Example

Here's what a lesson looks like:

```yaml
number: 1
title: "Basic Greetings"
language_from: "en"
language_to: "de"
sections:
  - title: "Hello and Goodbye"
    explanation: |
      Learn the most common greetings in English.
    examples:
      - q: "Hello! How are you?"
        a: "Hallo! Wie geht es dir?"
        rel:
          - ["hello", "hallo", "greeting"]
          - ["how", "wie", "question word"]
```

## Using Lessons in Your App

### 1. Load a Lesson

```javascript
// Node.js with js-yaml
import yaml from 'js-yaml';
import fs from 'fs';

const lesson = yaml.load(
  fs.readFileSync('lessons/portuguese/01-basic-verbs.yaml', 'utf8')
);
```

```python
# Python with PyYAML
import yaml

with open('lessons/portuguese/01-basic-verbs.yaml', 'r') as f:
    lesson = yaml.safe_load(f)
```

### 2. Access Lesson Data

```javascript
console.log(lesson.title);           // "Basic Verbs - Ser and Estar"
console.log(lesson.sections.length); // 5

// Get first example
const firstExample = lesson.sections[0].examples[0];
console.log(firstExample.q);         // "Eu sou alemão."
console.log(firstExample.a);         // "Ich bin Deutscher."
```

### 3. Extract Vocabulary

```javascript
// Get all vocabulary from a lesson
const vocabulary = [];
lesson.sections.forEach(section => {
  section.examples.forEach(example => {
    example.rel.forEach(item => {
      vocabulary.push({
        term: item[0],
        translation: item[1],
        type: item[2] || 'word'
      });
    });
  });
});

console.log(`Total vocabulary items: ${vocabulary.length}`);
```

### 4. Track Learning Progress

```javascript
// Simple localStorage-based tracking
const learned = JSON.parse(localStorage.getItem('learned') || '[]');

// Mark a word as learned
function markLearned(term) {
  if (!learned.includes(term)) {
    learned.push(term);
    localStorage.setItem('learned', JSON.stringify(learned));
  }
}

// Check if learned
function isLearned(term) {
  return learned.includes(term);
}

// Usage
markLearned('casa');  // house
console.log(isLearned('casa'));  // true
```

## Common Tasks

### Display a Lesson in HTML

```javascript
function renderLesson(lesson) {
  return `
    <div class="lesson">
      <h1>${lesson.title}</h1>
      <p>${lesson.description}</p>
      
      ${lesson.sections.map(section => `
        <div class="section">
          <h2>${section.title}</h2>
          ${section.explanation ? `<div class="explanation">${section.explanation}</div>` : ''}
          
          ${section.examples.map(example => `
            <div class="example">
              <div class="question">${example.q}</div>
              <div class="answer">${example.a}</div>
              <div class="vocabulary">
                ${example.rel.map(item => `
                  <span class="vocab-item">
                    <strong>${item[0]}</strong> → ${item[1]}
                  </span>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

document.body.innerHTML = renderLesson(lesson);
```

### Filter Unlearned Examples

```javascript
function getUnlearnedExamples(lesson, learnedTerms) {
  const unlearned = [];
  
  lesson.sections.forEach(section => {
    section.examples.forEach(example => {
      // Check if any vocabulary is not learned
      const hasUnlearned = example.rel.some(
        item => !learnedTerms.includes(item[0])
      );
      
      if (hasUnlearned) {
        unlearned.push(example);
      }
    });
  });
  
  return unlearned;
}

// Usage
const unlearnedExamples = getUnlearnedExamples(lesson, learned);
console.log(`${unlearnedExamples.length} examples with unlearned vocabulary`);
```

### Create a Quiz

```javascript
function createQuiz(lesson, count = 10) {
  const allExamples = [];
  
  lesson.sections.forEach(section => {
    allExamples.push(...section.examples);
  });
  
  // Shuffle and select
  return allExamples
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(ex => ({
      question: ex.q,
      answer: ex.a
    }));
}

const quiz = createQuiz(lesson, 5);
quiz.forEach((q, i) => {
  console.log(`Q${i + 1}: ${q.question}`);
  console.log(`A${i + 1}: ${q.answer}\n`);
});
```

## Language Switching

To switch between different languages:

```javascript
// List available languages
const languages = ['portuguese', 'english'];

// Load all lessons for a language
async function loadLanguage(lang) {
  const files = await fs.promises.readdir(`lessons/${lang}`);
  const lessons = [];
  
  for (const file of files) {
    if (file.endsWith('.yaml')) {
      const data = yaml.load(
        await fs.promises.readFile(`lessons/${lang}/${file}`, 'utf8')
      );
      lessons.push(data);
    }
  }
  
  return lessons.sort((a, b) => a.number - b.number);
}

// Usage
const portugueseLessons = await loadLanguage('portuguese');
const englishLessons = await loadLanguage('english');

console.log(`Portuguese: ${portugueseLessons.length} lessons`);
console.log(`English: ${englishLessons.length} lessons`);
```

## Adding Your Own Lessons

### 1. Create a new language directory

```bash
mkdir lessons/spanish
```

### 2. Create a lesson file

Create `lessons/spanish/01-basics.yaml`:

```yaml
number: 1
title: "Basic Spanish"
description: "Introduction to Spanish basics"
language_from: "es"
language_to: "de"
sections:
  - title: "Greetings"
    examples:
      - q: "¡Hola!"
        a: "Hallo!"
        rel:
          - ["hola", "hallo", "greeting"]
      - q: "¿Cómo estás?"
        a: "Wie geht es dir?"
        rel:
          - ["cómo", "wie", "question word"]
          - ["estás", "geht es dir", "verb - estar"]
```

### 3. Validate the YAML

```bash
python3 -c "import yaml; yaml.safe_load(open('lessons/spanish/01-basics.yaml'))"
```

If no errors, your lesson is valid!

## Design Principles

### 1. Generic Format
The schema works for any language pair or learning content. Just change `language_from` and `language_to`.

### 2. Related Items
The `rel` field is flexible:
- Minimum 2 items: `["term", "translation"]`
- Can add more: `["term", "translation", "part of speech", "notes"]`
- First element is always the unique identifier

### 3. Reusable Vocabulary
The same word can appear in multiple examples. Track it once by its ID (first element):

```yaml
# Example 1
rel:
  - ["casa", "Haus", "noun"]

# Example 2 (different section/lesson)
rel:
  - ["casa", "Haus", "noun"]  # Same ID, tracked together
```

### 4. Progressive Learning
- Number lessons sequentially
- Start with basics, increase complexity
- 5-10 sections per lesson
- 3-5 examples per section

## Best Practices

1. **Consistent IDs**: Use the same term (first element) for the same vocabulary across all lessons
2. **Rich Metadata**: Add context in the third+ elements: part of speech, usage notes, difficulty level
3. **Markdown Explanations**: Use markdown in explanations for formatting, links, and structure
4. **Logical Grouping**: Group related concepts in the same section
5. **Example Quality**: Provide realistic, useful examples that demonstrate vocabulary in context

## Next Steps

- Read the [complete schema documentation](lesson-schema.md)
- Check out [code examples](usage-examples.md)
- Explore existing lessons in `lessons/portuguese/` and `lessons/english/`
- Create your own lessons for your target language

## Troubleshooting

### YAML syntax errors
- Check indentation (use spaces, not tabs)
- Ensure colons have a space after them
- Use quotes for strings with special characters
- Validate with: `python3 -c "import yaml; yaml.safe_load(open('yourfile.yaml'))"`

### Missing fields
Required fields for each lesson:
- `number` (integer)
- `title` (string)
- `language_from` (string)
- `language_to` (string)
- `sections` (array)

Each section needs:
- `title` (string)
- `examples` (array)

Each example needs:
- `q` (string)
- `a` (string)
- `rel` (array of arrays)

### Can't find lessons
- Check file extension is `.yaml` (not `.yml`)
- Ensure files are in correct directory structure
- Verify file permissions (readable)

## Support

For issues or questions:
1. Check the schema documentation
2. Review example lessons
3. Validate your YAML syntax
4. Open an issue on GitHub
