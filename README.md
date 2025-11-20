# 🌍 Language Learning by Examples

A modern, static single-page web application for learning any topic through practical examples. Built with Vue 3, this platform features interactive lessons with audio pronunciation, progress tracking, and a clean, responsive interface.

## ✨ Features

- **📚 Topic-Based Learning**: Organized lessons with sections and examples
- **🌐 Multi-Language Support**: Learn any topic in your preferred language
- **🔊 Audio Reading**: Text-to-speech functionality for listening to examples (Web Speech API)
- **📊 Progress Tracking**: Mark items as learned with LocalStorage persistence
- **🌓 Dark Mode**: Toggle between light and dark themes
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🚀 Static Deployment**: Easy deployment to GitHub Pages
- **📝 YAML-Based Content**: Simple, human-readable lesson format

## 🛠 Tech Stack

- **Framework**: Vue 3.4+ (Composition API with SFCs)
- **Routing**: Vue Router 4.6+ (hash-based routing)
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Package Manager**: pnpm
- **Data Format**: YAML (parsed with js-yaml 4.1)
- **Markdown**: Marked 17.0 for explanations
- **Testing**:
  - Vitest 1.0 (unit tests)
  - Playwright 1.40 (E2E tests)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (installed automatically via packageManager field)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd language

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:5173` to see the app running.

## 📦 Development Commands

```bash
# Development server with hot reload
pnpm dev

# Build for production
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

## 📁 Project Structure

```
language/
├── src/
│   ├── main.js              # Application entry point
│   ├── App.vue              # Root component with navigation
│   ├── style.css            # Custom styles (imports Tailwind)
│   ├── router/
│   │   └── index.js         # Vue Router configuration
│   ├── views/               # Page components
│   │   ├── Home.vue         # Language selection
│   │   ├── LessonsOverview.vue  # Lessons grid
│   │   ├── LessonDetail.vue     # Lesson viewer
│   │   └── Settings.vue     # Settings panel
│   └── composables/         # Reusable composition functions
│       ├── useLessons.js    # Lesson loading logic
│       └── useSettings.js   # Settings persistence
├── public/
│   └── lessons/             # YAML lesson content
│       ├── index.yaml       # Root index
│       ├── deutsch/         # German learning content
│       └── english/         # English learning content
├── tests/                   # Test files
├── docs/                    # Documentation
│   └── lesson-schema.md     # YAML schema reference
└── dist/                    # Production build output
```

## 📚 Adding New Content

### Adding a New Lesson

1. Navigate to the appropriate folder: `public/lessons/<learning>/<teaching>/`
2. Create a YAML file following the schema (see `docs/lesson-schema.md`)
3. Add the filename to the topic's `index.yaml`:

```yaml
lessons:
  - 01-basics.yaml
  - 02-your-new-lesson.yaml
```

### Lesson Format Example

```yaml
number: 1
title: "Basic Verbs"
description: "Essential verbs for daily conversation"
sections:
  - title: "Common Verbs"
    explanation: |
      These are the most commonly used verbs.
    examples:
      - q: "Ich bin Student"
        a: "I am a student"
        labels: ["Present"]
        rel:
          - ["bin", "am", "to be"]
```

### Adding a New Language Pair

1. Create folder structure: `public/lessons/<learning>/<teaching>/`
2. Add language to `public/lessons/index.yaml` if needed
3. Create topic index: `public/lessons/<learning>/index.yaml`
4. Add lesson files and their index

For complete schema documentation, see [`docs/lesson-schema.md`](docs/lesson-schema.md).

## 🧪 Testing

### Unit Tests
Located in `tests/`, run with:
```bash
pnpm test
```

### End-to-End Tests
Located in `tests/e2e/`, run with:
```bash
pnpm test:e2e
```

## 🚀 Deployment

The application is configured for GitHub Pages deployment using GitHub Actions.

### Manual Deployment

```bash
# Build the project
pnpm build

# The dist/ folder is ready for deployment
```

### GitHub Pages

Push to the `main` branch triggers automatic deployment via GitHub Actions (`.github/workflows/static.yml`).

**Note**: Vite is configured with `base: '/language/'` for subdirectory deployment.

## 🏗 Architecture

### Component Architecture
- **SFC Pattern**: Single File Components with Composition API
- **Composables**: Shared logic via composition functions
- **Singleton Settings**: Centralized settings management
- **Dynamic Routing**: Hash-based routing for static hosting

### Routes
- `#/` - Home (language selection)
- `#/lessons/:learning/:teaching` - Lessons overview
- `#/lesson/:learning/:teaching/:number` - Lesson detail
- `#/settings` - Settings panel

### Data Flow
1. Load `lessons/index.yaml` → get available languages
2. Load `lessons/{lang}/index.yaml` → get topics
3. Load lesson files dynamically with js-yaml
4. Render with Vue components

## 🤝 Contributing

1. Follow semantic commit conventions
2. Create feature branches (never push to `main`)
3. Include tests and documentation
4. Create pull requests for review

## 📄 License

See LICENSE file for details.

## 🔧 Development Notes

For detailed development guidance and architecture information, see [`CLAUDE.md`](CLAUDE.md).
