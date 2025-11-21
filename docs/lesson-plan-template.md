# Universal Lesson Plan Template

This document provides a suggested learning progression and lesson schema template that can be used for teaching any language pair.

## Overview

A complete language learning curriculum typically consists of **30-50 lessons** organized into progressive difficulty levels. Each lesson should build upon previous knowledge while introducing new concepts incrementally.

## Suggested Learning Progression

### Phase 1: Foundation (Lessons 1-10)

**Goal**: Build basic communication skills and foundational grammar

1. **Basic Verbs** - Essential "to be" and common action verbs
2. **Greetings & Introductions** - Hello, goodbye, how are you, my name is
3. **Numbers & Time** - 0-100, days, months, telling time
4. **Common Objects** - Everyday items, foods, household objects
5. **Colors & Descriptions** - Adjectives for colors, size, quality
6. **Family & Relationships** - Family members, relationships, possessives
7. **Daily Activities** - Routine actions, present tense
8. **Questions & Answers** - Question words, forming questions
9. **Location & Direction** - Prepositions, giving/receiving directions
10. **Weather & Seasons** - Weather vocabulary, seasons, temperature

### Phase 2: Building Blocks (Lessons 11-20)

**Goal**: Expand vocabulary and introduce intermediate grammar

11. **Past Tense (Simple)** - Regular past tense, common irregular verbs
12. **Future Tense** - Going to, will, intentions
13. **Modal Verbs** - Can, must, should, may
14. **Shopping & Money** - Prices, currency, shopping phrases
15. **Food & Dining** - Restaurant vocabulary, ordering, food preferences
16. **Transportation** - Vehicles, travel, public transport
17. **Health & Body** - Body parts, illnesses, doctor visits
18. **Work & Professions** - Jobs, workplace vocabulary
19. **Hobbies & Interests** - Leisure activities, sports, entertainment
20. **Making Plans** - Invitations, accepting/declining, scheduling

### Phase 3: Intermediate (Lessons 21-30)

**Goal**: Complex grammar structures and specialized vocabulary

21. **Past Tense (Perfect)** - Present perfect, usage differences
22. **Conditional Tense** - If clauses, hypothetical situations
23. **Comparatives & Superlatives** - Comparing things, expressing preferences
24. **Gerund & Infinitive** - Verb forms, usage patterns
25. **Passive Voice** - Passive constructions, when to use
26. **Reported Speech** - Indirect speech, telling what others said
27. **Emotions & Feelings** - Expressing emotions, mental states
28. **House & Home** - Rooms, furniture, household tasks
29. **Technology & Communication** - Computers, phones, internet
30. **Travel & Tourism** - Hotels, sightseeing, tourist phrases

### Phase 4: Advanced (Lessons 31-40)

**Goal**: Nuanced language use and cultural contexts

31. **Subjunctive Mood** - Wishes, doubts, hypotheticals
32. **Phrasal Verbs** - Common multi-word verbs
33. **Idioms & Expressions** - Common sayings, cultural expressions
34. **Formal vs Informal** - Register differences, polite language
35. **Business Language** - Professional communication, meetings
36. **Education** - School, university, learning vocabulary
37. **Environment & Nature** - Environment, animals, natural world
38. **Culture & Traditions** - Cultural practices, holidays, customs
39. **News & Media** - Current events, journalism vocabulary
40. **Advanced Grammar Review** - Complex structures, fine points

### Phase 5: Mastery (Lessons 41-50)

**Goal**: Fluency, refinement, and specialized topics

41. **Politics & Government** - Political system, civic vocabulary
42. **Law & Justice** - Legal terms, rights, responsibilities
43. **Science & Research** - Scientific vocabulary, explanations
44. **Art & Literature** - Cultural vocabulary, critique
45. **Philosophy & Ideas** - Abstract concepts, argumentation
46. **Slang & Colloquialisms** - Informal language, street talk
47. **Regional Variations** - Dialects, regional differences
48. **Error Correction** - Common mistakes, refinement
49. **Advanced Conversation** - Debate, discussion, nuance
50. **Mastery Review** - Comprehensive review, assessment

## Lesson Structure Template

Each lesson should follow this structure:

```yaml
number: X
title: "Descriptive Lesson Title"
description: "Brief 1-2 sentence description of what this lesson covers"
sections:
  - title: "Section 1 Title - Main Concept"
    explanation: |
      **Overview** of the concept in markdown
      - Key point 1
      - Key point 2
      - Key point 3

      Usage rules, conjugation tables, or grammar explanations
    examples:
      - q: "Example sentence in target language"
        a: "Translation in base language"
        labels: ["GrammarConcept", "TenseForm"]  # Optional
        rel:
          - ["word1", "translation1", "part-of-speech"]
          - ["word2", "translation2", "context-note"]

      # 3-5 examples per section

  - title: "Section 2 Title - Related Concept"
    # ... similar structure

  # 4-6 sections per lesson
```

## Section Guidelines

### Number of Sections
- **Beginner lessons** (1-10): 4-5 sections
- **Intermediate lessons** (11-30): 5-6 sections
- **Advanced lessons** (31-50): 4-5 sections (concepts are more complex)

### Examples per Section
- **Minimum**: 3 examples
- **Optimal**: 4-5 examples
- **Maximum**: 7 examples (avoid overwhelming)

### Explanation Length
- **Brief** (1-2 sentences): Simple concepts, vocabulary
- **Moderate** (3-5 sentences): Grammar rules, usage patterns
- **Detailed** (6-10 sentences): Complex grammar, exceptions, cultural notes

## Example Lesson: Basic Verbs

```yaml
number: 1
title: "Essential Verbs - To Be & To Have"
description: "Learn the two most important verbs and their conjugations"
sections:
  - title: "To Be - Permanent States"
    explanation: |
      The verb "to be" is used for:
      - **Identity** (nationality, profession)
      - **Characteristics** (personality, physical traits)
      - **Permanent conditions**

      **Conjugation**:
      - I am / ich bin
      - you are / du bist
      - he/she/it is / er/sie/es ist
      - we are / wir sind
      - they are / sie sind
    examples:
      - q: "I am a teacher."
        a: "Ich bin Lehrer."
        rel:
          - ["am", "bin", "verb - to be"]
          - ["teacher", "Lehrer", "noun"]

      - q: "She is German."
        a: "Sie ist Deutsche."
        rel:
          - ["is", "ist", "verb - to be"]
          - ["German", "Deutsche", "nationality"]

      - q: "We are students."
        a: "Wir sind Studenten."
        rel:
          - ["are", "sind", "verb - to be"]
          - ["students", "Studenten", "noun"]

  - title: "To Be - Location"
    explanation: |
      "To be" is also used for location:
      - **Where something/someone is**
      - **Temporary position**
    examples:
      - q: "The book is on the table."
        a: "Das Buch ist auf dem Tisch."
        rel:
          - ["book", "Buch", "noun"]
          - ["table", "Tisch", "noun"]
          - ["on", "auf", "preposition"]

      - q: "I am at home."
        a: "Ich bin zu Hause."
        rel:
          - ["home", "Hause", "noun"]
          - ["at", "zu", "preposition"]

  - title: "To Have - Possession"
    explanation: |
      The verb "to have" expresses:
      - **Ownership**
      - **Relationships**
      - **Characteristics**

      **Conjugation**:
      - I have / ich habe
      - you have / du hast
      - he/she/it has / er/sie/es hat
      - we have / wir haben
      - they have / sie haben
    examples:
      - q: "I have a car."
        a: "Ich habe ein Auto."
        rel:
          - ["have", "habe", "verb - to have"]
          - ["car", "Auto", "noun"]

      - q: "She has two brothers."
        a: "Sie hat zwei Brüder."
        rel:
          - ["has", "hat", "verb - to have"]
          - ["two", "zwei", "number"]
          - ["brothers", "Brüder", "noun - family"]

  - title: "To Have - Feelings & Conditions"
    explanation: |
      "To have" is used with conditions and feelings in some languages,
      though this may differ from English usage.
    examples:
      - q: "I am hungry."
        a: "Ich habe Hunger."
        labels: ["Expression"]
        rel:
          - ["hungry", "Hunger", "noun - feeling"]

      - q: "She is cold."
        a: "Sie hat Kälte."
        labels: ["Expression"]
        rel:
          - ["cold", "Kälte", "noun - sensation"]
```

## Best Practices

### 1. Progressive Difficulty
- Build on previously learned vocabulary and grammar
- Reference earlier lessons when introducing related concepts
- Don't introduce too many new concepts in one lesson

### 2. Practical Examples
- Use real-world, practical sentences
- Include variety: statements, questions, negatives
- Show different persons (I, you, he/she, we, they)

### 3. Cultural Relevance
- Include culturally appropriate examples
- Explain differences in usage between languages
- Note false friends and common mistakes

### 4. Related Items (rel)
- First element is always the unique identifier (the word in target language)
- Include translations
- Add context: part of speech, usage notes, related words
- Consistent IDs allow tracking across lessons

### 5. Labels
- Use for categorization: grammar concepts, tenses, moods
- Keep labels consistent across lessons
- Useful for: Gerund, Infinitive, Past, Future, Conditional, Subjunctive, Passive, etc.

### 6. Explanations
- Use markdown for formatting
- Include conjugation tables when relevant
- Explain exceptions and irregular forms
- Provide usage context and examples

## Language-Specific Considerations

### For Gendered Languages (German, French, Spanish, etc.)
- Always include gender markers in `rel` items
- Example: `["cat", "der Kater (m) / die Katze (f)", "noun"]`

### For Tonal Languages (Mandarin, Vietnamese, etc.)
- Include tone markers in examples
- Note tone changes in compounds

### For Languages with Cases (German, Russian, etc.)
- Show different cases in examples
- Explain case usage in explanations

### For Languages with Formality Levels (Japanese, Korean, etc.)
- Indicate formality level in labels
- Include both formal and informal examples

### For Languages with Scripts (Arabic, Hebrew, etc.)
- Ensure proper right-to-left text handling
- Include transliteration if helpful

## Vocabulary Thresholds

**By Lesson 10**: 200-300 words
**By Lesson 20**: 600-800 words
**By Lesson 30**: 1200-1500 words
**By Lesson 40**: 2000-2500 words
**By Lesson 50**: 3000-3500 words

## Review Cycles

- **Every 5 lessons**: Mini review
- **Every 10 lessons**: Comprehensive review
- **Lesson 25**: Mid-point assessment
- **Lesson 50**: Final mastery review

## Customization for Specific Languages

When creating lessons for a new language pair:

1. Research the language's specific challenges
2. Adapt lesson order based on grammatical complexity
3. Add language-specific lessons (e.g., German cases, French articles)
4. Consider cultural context and authentic usage
5. Include false friends and common mistakes for that language pair

## Getting Started

To create a new lesson:

1. Choose your lesson number from the progression above
2. Copy the YAML template structure
3. Fill in sections with 4-6 main concepts
4. Add 3-5 examples per section
5. Include explanations with key grammar points
6. Add related vocabulary items
7. Test the lesson flow and difficulty

## Example Full Curriculum

See existing lessons in:
- `public/lessons/deutsch/portugiesisch/` - Portuguese taught in German
- `public/lessons/english/german/` - German taught in English

These serve as reference implementations of this lesson plan structure.
