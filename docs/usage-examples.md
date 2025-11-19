# Lesson Schema Usage Examples

This document provides practical examples of how to use the lesson schema in different scenarios.

## Example 1: Basic Lesson Loading

```javascript
// Using js-yaml library
import yaml from 'js-yaml';
import fs from 'fs';

// Load a single lesson
const lessonPath = 'lessons/portuguese/01-basic-verbs.yaml';
const lessonData = yaml.load(fs.readFileSync(lessonPath, 'utf8'));

console.log(`Lesson ${lessonData.number}: ${lessonData.title}`);
console.log(`Language pair: ${lessonData.language_from} → ${lessonData.language_to}`);
console.log(`Sections: ${lessonData.sections.length}`);
```

## Example 2: Iterating Through Examples

```javascript
// Access all examples in a lesson
lessonData.sections.forEach((section, sectionIdx) => {
  console.log(`\nSection ${sectionIdx + 1}: ${section.title}`);
  
  if (section.explanation) {
    console.log(`Explanation: ${section.explanation.substring(0, 50)}...`);
  }
  
  section.examples.forEach((example, exIdx) => {
    console.log(`  Example ${exIdx + 1}:`);
    console.log(`    Q: ${example.q}`);
    console.log(`    A: ${example.a}`);
    console.log(`    Vocabulary items: ${example.rel.length}`);
  });
});
```

## Example 3: Extracting Vocabulary

```javascript
// Extract all unique vocabulary items from a lesson
function extractVocabulary(lesson) {
  const vocabMap = new Map();
  
  lesson.sections.forEach(section => {
    section.examples.forEach(example => {
      example.rel.forEach(item => {
        const [id, translation, ...extra] = item;
        
        // Use first element as unique identifier
        if (!vocabMap.has(id)) {
          vocabMap.set(id, {
            term: id,
            translation: translation,
            metadata: extra,
            examples: []
          });
        }
        
        // Track which examples use this vocab
        vocabMap.get(id).examples.push({
          question: example.q,
          answer: example.a
        });
      });
    });
  });
  
  return Array.from(vocabMap.values());
}

// Usage
const vocabulary = extractVocabulary(lessonData);
console.log(`Total unique vocabulary items: ${vocabulary.length}`);

// Find words used in multiple examples
const frequentWords = vocabulary.filter(v => v.examples.length > 1);
console.log(`Words appearing in multiple examples: ${frequentWords.length}`);
```

## Example 4: Tracking Learning Progress

```javascript
// Simple learning progress tracker
class LearningTracker {
  constructor() {
    this.learnedItems = new Set();
    this.learnedExamples = new Set();
  }
  
  // Mark a vocabulary item as learned
  markItemLearned(itemId) {
    this.learnedItems.add(itemId);
    this.save();
  }
  
  // Mark an example as learned (and optionally its vocabulary)
  markExampleLearned(exampleId, example, markVocab = true) {
    this.learnedExamples.add(exampleId);
    
    if (markVocab && example.rel) {
      example.rel.forEach(item => {
        this.markItemLearned(item[0]);
      });
    }
    
    this.save();
  }
  
  // Check if item is learned
  isItemLearned(itemId) {
    return this.learnedItems.has(itemId);
  }
  
  // Get progress statistics
  getProgress(lesson) {
    const allItems = new Set();
    const allExamples = [];
    
    lesson.sections.forEach(section => {
      section.examples.forEach(example => {
        allExamples.push(example);
        example.rel.forEach(item => allItems.add(item[0]));
      });
    });
    
    return {
      totalItems: allItems.size,
      learnedItems: Array.from(allItems).filter(id => this.isItemLearned(id)).length,
      totalExamples: allExamples.length,
      learnedExamples: this.learnedExamples.size,
      percentComplete: Math.round((this.learnedItems.size / allItems.size) * 100)
    };
  }
  
  // Save to localStorage or file
  save() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('learnedItems', JSON.stringify([...this.learnedItems]));
      localStorage.setItem('learnedExamples', JSON.stringify([...this.learnedExamples]));
    }
  }
  
  // Load from localStorage or file
  load() {
    if (typeof localStorage !== 'undefined') {
      const items = JSON.parse(localStorage.getItem('learnedItems') || '[]');
      const examples = JSON.parse(localStorage.getItem('learnedExamples') || '[]');
      this.learnedItems = new Set(items);
      this.learnedExamples = new Set(examples);
    }
  }
}

// Usage
const tracker = new LearningTracker();
tracker.load();

// Mark vocabulary as learned
tracker.markItemLearned('casa');  // house
tracker.markItemLearned('cansado');  // tired

// Get progress
const progress = tracker.getProgress(lessonData);
console.log(`Progress: ${progress.learnedItems}/${progress.totalItems} items (${progress.percentComplete}%)`);
```

## Example 5: Filtering Examples by Learned Vocabulary

```javascript
// Filter to show only examples with unlearned vocabulary
function getExamplesWithUnlearnedVocab(lesson, tracker) {
  const result = [];
  
  lesson.sections.forEach((section, sectionIdx) => {
    const filteredExamples = section.examples.filter(example => {
      // Check if any vocabulary in this example is not learned
      return example.rel.some(item => !tracker.isItemLearned(item[0]));
    });
    
    if (filteredExamples.length > 0) {
      result.push({
        sectionIndex: sectionIdx,
        sectionTitle: section.title,
        examples: filteredExamples
      });
    }
  });
  
  return result;
}

// Usage
const unlearnedExamples = getExamplesWithUnlearnedVocab(lessonData, tracker);
console.log(`Sections with unlearned content: ${unlearnedExamples.length}`);
```

## Example 6: Creating a Quiz

```javascript
// Generate a quiz from learned material
function createQuiz(lesson, tracker, count = 10) {
  const questions = [];
  
  lesson.sections.forEach(section => {
    section.examples.forEach(example => {
      // Only include examples with some learned vocabulary
      const learnedVocab = example.rel.filter(item => 
        tracker.isItemLearned(item[0])
      );
      
      if (learnedVocab.length > 0) {
        questions.push({
          question: example.q,
          answer: example.a,
          vocabulary: learnedVocab.map(item => ({
            term: item[0],
            translation: item[1]
          }))
        });
      }
    });
  });
  
  // Shuffle and take random subset
  return questions
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

// Usage
const quiz = createQuiz(lessonData, tracker, 5);
quiz.forEach((q, idx) => {
  console.log(`\nQuestion ${idx + 1}: Translate to German`);
  console.log(`"${q.question}"`);
  console.log(`Answer: ${q.answer}`);
});
```

## Example 7: Multi-Language Support

```javascript
// Load lessons for different languages
async function loadLanguageLessons(language) {
  const path = `lessons/${language}/`;
  const files = await fs.promises.readdir(path);
  
  const lessons = [];
  for (const file of files.filter(f => f.endsWith('.yaml'))) {
    const data = yaml.load(await fs.promises.readFile(`${path}${file}`, 'utf8'));
    lessons.push(data);
  }
  
  // Sort by lesson number
  return lessons.sort((a, b) => a.number - b.number);
}

// Language switcher
class LanguageLearningApp {
  constructor() {
    this.currentLanguage = null;
    this.lessons = [];
  }
  
  async switchLanguage(language) {
    this.currentLanguage = language;
    this.lessons = await loadLanguageLessons(language);
    console.log(`Switched to ${language}: ${this.lessons.length} lessons loaded`);
    return this.lessons;
  }
  
  getAvailableLanguages() {
    // Scan lessons directory
    return ['portuguese', 'english'];  // Add more as available
  }
  
  getCurrentLesson(number) {
    return this.lessons.find(l => l.number === number);
  }
}

// Usage
const app = new LanguageLearningApp();
await app.switchLanguage('portuguese');
const lesson1 = app.getCurrentLesson(1);
console.log(`Current lesson: ${lesson1.title}`);
```

## Example 8: Rendering with Markdown

```javascript
// Render section explanations with markdown support
import MarkdownIt from 'markdown-it';

function renderSection(section) {
  const md = new MarkdownIt();
  
  return {
    title: section.title,
    explanationHtml: section.explanation ? md.render(section.explanation) : null,
    examples: section.examples.map(ex => ({
      question: ex.q,
      answer: ex.a,
      vocabulary: ex.rel.map(item => ({
        term: item[0],
        translation: item[1],
        notes: item.slice(2).join(', ')
      }))
    }))
  };
}

// Usage in a web app
lessonData.sections.forEach(section => {
  const rendered = renderSection(section);
  
  // Display in HTML
  document.getElementById('content').innerHTML += `
    <div class="section">
      <h2>${rendered.title}</h2>
      ${rendered.explanationHtml || ''}
      <div class="examples">
        ${rendered.examples.map(ex => `
          <div class="example">
            <p class="question">${ex.question}</p>
            <p class="answer">${ex.answer}</p>
            <div class="vocab">
              ${ex.vocabulary.map(v => `
                <span class="vocab-item">
                  ${v.term} → ${v.translation}
                  ${v.notes ? `<small>(${v.notes})</small>` : ''}
                </span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
});
```

## Example 9: Spaced Repetition System

```javascript
// Simple spaced repetition for vocabulary
class SpacedRepetition {
  constructor() {
    this.items = new Map(); // itemId -> { interval, nextReview, correctCount }
  }
  
  // Mark item as reviewed
  review(itemId, correct) {
    const item = this.items.get(itemId) || {
      interval: 1,
      nextReview: new Date(),
      correctCount: 0
    };
    
    if (correct) {
      item.correctCount++;
      item.interval *= 2; // Double the interval
    } else {
      item.interval = 1; // Reset
      item.correctCount = 0;
    }
    
    // Set next review date
    const next = new Date();
    next.setDate(next.getDate() + item.interval);
    item.nextReview = next;
    
    this.items.set(itemId, item);
  }
  
  // Get items due for review
  getDueItems(lesson) {
    const now = new Date();
    const dueItems = [];
    
    lesson.sections.forEach(section => {
      section.examples.forEach(example => {
        example.rel.forEach(item => {
          const itemId = item[0];
          const itemData = this.items.get(itemId);
          
          if (!itemData || itemData.nextReview <= now) {
            dueItems.push({
              id: itemId,
              term: item[0],
              translation: item[1],
              example: example
            });
          }
        });
      });
    });
    
    return dueItems;
  }
}
```

## Example 10: Export Progress Report

```javascript
// Generate a learning progress report
function generateProgressReport(lessons, tracker) {
  const report = {
    generatedAt: new Date().toISOString(),
    totalLessons: lessons.length,
    completedLessons: 0,
    totalVocabulary: 0,
    learnedVocabulary: tracker.learnedItems.size,
    lessonDetails: []
  };
  
  lessons.forEach(lesson => {
    const progress = tracker.getProgress(lesson);
    
    report.lessonDetails.push({
      number: lesson.number,
      title: lesson.title,
      progress: progress.percentComplete,
      learnedItems: progress.learnedItems,
      totalItems: progress.totalItems
    });
    
    report.totalVocabulary += progress.totalItems;
    if (progress.percentComplete === 100) {
      report.completedLessons++;
    }
  });
  
  return report;
}

// Usage
const allLessons = await loadLanguageLessons('portuguese');
const report = generateProgressReport(allLessons, tracker);

console.log(`
Learning Progress Report
========================
Generated: ${report.generatedAt}
Completed Lessons: ${report.completedLessons}/${report.totalLessons}
Total Vocabulary: ${report.learnedVocabulary}/${report.totalVocabulary}

Lesson Details:
${report.lessonDetails.map(l => 
  `  Lesson ${l.number}: ${l.title} - ${l.progress}%`
).join('\n')}
`);
```

## See Also

- `/docs/lesson-schema.md` - Complete schema documentation
- `/lessons/README.md` - Overview of available lessons
- Example lessons in `/lessons/portuguese/` and `/lessons/english/`
