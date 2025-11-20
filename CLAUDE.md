# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static single-page web application for learning any topics by examples. It's a learning platform featuring example sentences with audio pronunciation using the Web Speech API, and tracking with progress persistence via LocalStorage.

- **static**: easy deploy on github pages
- **open**: learn any topic, lessons with sections, sections with examples, eg. new language, math, theory for driver / boot / pilot license
- **multi-language**: base language, learn based on your preferred known language
- **learning items**: track progress by marking items as learned
- **audio reading**: learning by just listening to examples

## Tech Stack

- **Framework**: Vue 3.4+ (Composition API with SFCs)
- **Routing**: Vue Router 4.6+ (hash-based routing)
- **Dependency Management**: pnpm
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Testing**:
  - Vitest 1.0 (unit tests with happy-dom/jsdom)
  - Playwright 1.40 (E2E tests)
- **Data Format**: YAML for lesson content (parsed with js-yaml 4.1)
- **Markdown**: Marked 17.0 for rendering explanations
- **Deployment**: GitHub Pages (via GitHub Actions)

## Directory Structure

```
language/
├── index.html              # Minimal HTML entry point
├── src/
│   ├── main.js            # App entry point - creates Vue app with router
│   ├── App.vue            # Root component with unified navigation bar
│   ├── style.css          # Custom styles (imports Tailwind)
│   ├── router/
│   │   └── index.js       # Vue Router configuration
│   ├── views/             # Page components
│   │   ├── Home.vue       # Language selection page
│   │   ├── LessonsOverview.vue  # Lessons grid page
│   │   ├── LessonDetail.vue     # Individual lesson page
│   │   └── Settings.vue   # Settings page
│   └── composables/       # Reusable composition functions
│       ├── useLessons.js  # Lesson loading logic with js-yaml
│       └── useSettings.js # Settings persistence logic
├── public/
│   └── lessons/           # YAML lesson content (deployed as-is)
│       ├── index.yaml     # Root index - lists available learning languages
│       ├── deutsch/       # Learning in German
│       │   ├── index.yaml             # Lists topics (portugiesisch, englisch)
│       │   ├── portugiesisch/
│       │   │   ├── index.yaml         # Lists lesson files
│       │   │   ├── 01-basic-verbs.yaml
│       │   │   ├── 02-modal-verbs.yaml
│       │   │   └── 03-daily-activities.yaml
│       │   └── englisch/
│       │       └── 01-greetings.yaml
│       └── README.md      # Lesson system documentation
├── docs/
│   └── lesson-schema.md   # Complete YAML lesson schema documentation
├── tests/
│   ├── basic.test.js      # Unit tests
│   ├── dark-mode.test.js  # Dark mode toggle tests
│   └── e2e/
│       └── app.spec.js    # Playwright E2E tests
├── vite.config.js         # Vite config (base: '/language/')
├── tailwind.config.js     # Tailwind customization
├── playwright.config.js   # Playwright E2E test config
└── package.json           # Dependencies and scripts
```

## Development Commands

```bash
# Install dependencies (first time setup)
pnpm install

# Development server (http://localhost:5173)
pnpm dev

# Build for production (outputs to dist/)
pnpm build

# Preview production build locally
pnpm preview

# Run unit tests (Vitest)
pnpm test

# Run unit tests with UI
pnpm test:ui

# Run E2E tests (Playwright)
pnpm test:e2e
```

## Architecture

### Vue Application Structure

**Component-Based Architecture**:
- Uses `.vue` Single File Components (SFCs)
- Vue Router for client-side routing
- Composition API with composables for shared logic
- Unified navigation bar in root App component

**Main Components**:
- `App.vue` - Root component with unified navigation (back button, dynamic title, settings button)
- `Home.vue` - Language selection page (route: `/`)
- `LessonsOverview.vue` - Lessons grid page (route: `/lessons/:learning/:teaching`)
- `LessonDetail.vue` - Individual lesson page (route: `/lesson/:learning/:teaching/:number`)
- `Settings.vue` - Settings page (route: `/settings`)

**Composables** (Reusable logic):
- `useLessons()` - Lesson loading with js-yaml parser
  - `loadAvailableContent()` - Load main lesson index
  - `loadTopicsForLanguage(lang)` - Load topics for a language
  - `loadAllLessonsForTopic(lang, topic)` - Load all lessons for a topic
- `useSettings()` - Settings management (singleton pattern)
  - Shared reactive state across all components
  - Automatic localStorage persistence via watchers
  - Dark mode toggle with DOM class manipulation
  - Translation visibility toggle
  - Settings loaded on app initialization in `main.js`

**Routing**:
- `#/` - Home page (language selection)
- `#/lessons/:learning/:teaching` - Lessons overview grid
- `#/lesson/:learning/:teaching/:number` - Lesson detail view
- `#/settings` - Settings panel

Uses hash-based routing (`createWebHashHistory`) for GitHub Pages compatibility.

**Navigation Pattern**:
- **Dynamic Title**: Changes based on route
  - Home: "🌍 Language Learning"
  - Overview: Teaching topic name (e.g., "Portugiesisch")
  - Detail: Lesson title (e.g., "Basic Verbs - Ser and Estar")
  - Settings: "⚙️ Settings"
- **Back Button**: Visible on all pages except home
- **Settings Button**: Always visible in top-right corner

**YAML Loading Flow**:
1. Load `lessons/index.yaml` → get learning languages
2. User selects learning language → load `lessons/{lang}/index.yaml` → get topics
3. User selects topic → navigate to `/lessons/{lang}/{topic}`
4. Load all lessons for topic → fetch and parse YAML files with js-yaml

### YAML Lesson Schema

Lessons follow a hierarchical structure: **Lesson → Sections → Examples → Related Items**

```yaml
number: 1
title: "Lesson Title"
description: "Brief description"
sections:
  - title: "Section Title"
    explanation: |
      Markdown-formatted explanation text
    examples:
      - q: "Question/source sentence"
        a: "Answer/translation"
        labels: ["Futur", "Gerundium"]  # Optional grammar labels
        rel:
          - ["term", "translation", "context"]  # First element is unique ID
          - ["word", "meaning"]
```

**Key Concepts**:
- **Two-level folder hierarchy**: `lessons/<learning-language>/<teaching-topic>/`
  - Example: `deutsch/portugiesisch/` = Learn Portuguese in German
  - Example: `english/math-algebra/` = Learn math in English
- **Labels**: Optional categorization (e.g. for grammer, like "Futur", "Passiv")
- **Related items (`rel`)**: Vocabulary with first element as unique identifier
- **Markdown support**: Section explanations support markdown formatting

See `docs/lesson-schema.md` for complete schema documentation.

### Third-Party Libraries

**js-yaml** (`import yaml from 'js-yaml'`):
- Full-featured YAML parser for lesson content
- Handles all YAML spec features (comments, multi-line strings, etc.)
- Used in `useLessons()` composable via `yaml.load(text)`

**marked** (`import { marked } from 'marked'`):
- Markdown-to-HTML converter
- Used for rendering section explanations in lesson detail view
- Supports GitHub-flavored markdown

### Settings & Persistence

**Singleton Pattern**: The `useSettings()` composable uses module-level reactive state, ensuring all components share the same settings instance.

**Persistence Flow**:
1. Settings loaded from `localStorage` in `main.js` before app mounts
2. Changes automatically saved via Vue watchers
3. Dark mode applied to `<html>` element via class toggle
4. All components access the same reactive settings object

**Settings**:
- `showTranslation` (boolean): Toggle visibility of answer translations in lessons
- `darkMode` (boolean): Dark theme toggle (adds/removes 'dark' class on `<html>`)

**Implementation**:
```javascript
// Shared state (singleton)
const settings = ref({
  showTranslation: true,
  darkMode: false
})

// Auto-save watchers
watch(() => settings.value.darkMode, (newValue) => {
  applyDarkMode(newValue)
  saveSettings()
})
```

No lesson progress tracking is currently implemented.

## Adding New Content

### Adding a New Lesson

1. Choose or create the appropriate folder: `public/lessons/<learning>/<teaching>/`
2. Create a YAML file following the schema (see `docs/lesson-schema.md`)
3. Add the filename to `public/lessons/<learning>/<teaching>/index.yaml`:
   ```yaml
   lessons:
     - 01-basics.yaml
     - 02-your-new-lesson.yaml
   ```

### Adding a New Language Pair

1. Create folder structure: `public/lessons/<learning>/<teaching>/`
2. Add language to `public/lessons/index.yaml` if it's a new learning language
3. Create `public/lessons/<learning>/index.yaml` with topics list:
   ```yaml
   topics:
     - portugiesisch
     - your-new-topic
   ```
4. Create `public/lessons/<learning>/<teaching>/index.yaml` with lesson files
5. Add lesson YAML files

## Testing

### Unit Tests (Vitest)
- `tests/basic.test.js`: Basic app initialization
- `tests/dark-mode.test.js`: Dark mode toggle functionality

### E2E Tests (Playwright)
- `tests/e2e/app.spec.js`: Full user flow testing

## Deployment

**GitHub Actions** (`.github/workflows/static.yml`):
- Triggers on push to `main` branch
- Runs build
- Deploys `dist/` to GitHub Pages

**Important**: Vite is configured with `base: '/language/'` for the GitHub Pages subdirectory deployment.

## Browser APIs Used

- **Web Speech API**: Text-to-speech for reading examples (planned feature)
- **LocalStorage**: Settings persistence
- **Fetch API**: Dynamic YAML lesson loading

## Development Notes

- All components use `.vue` Single File Components (SFCs)
- Vue Router handles client-side routing with hash-based URLs for GitHub Pages compatibility
- Tailwind classes are used directly in component templates
- Lessons are loaded dynamically at runtime - no build-time processing
- Dark mode: Tailwind `dark:` classes + `<html class="dark">` toggle via useSettings composable
- YAML parsing uses js-yaml library for full spec support
- Markdown rendering uses marked library for section explanations
- Composables pattern for shared logic (useLessons, useSettings)
- Navigation state is managed by Vue Router - no manual view switching
- Dynamic page titles based on route and content
