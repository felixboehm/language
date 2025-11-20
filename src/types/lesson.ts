/**
 * Core type definitions for the language learning application
 */

export interface Example {
  q: string
  a: string
  labels?: string[]
  rel?: RelatedItem[]
}

export type RelatedItem = [string, ...string[]]

export interface Section {
  title: string
  explanation?: string
  examples: Example[]
}

export interface Lesson {
  number: number
  title: string
  description?: string
  sections: Section[]
}

export interface LessonMetadata {
  number: number
  title: string
  description?: string
  sectionsCount: number
}

export interface TopicIndex {
  topics: string[]
}

export interface LessonIndex {
  lessons: string[]
}

export interface LanguageIndex {
  languages: string[]
}

export interface Progress {
  completedLessons: Set<string>
  completedExamples: Set<string>
  lastVisited: string | null
  stats: {
    totalLessons: number
    completedCount: number
    percentComplete: number
  }
}

export interface Settings {
  showTranslation: boolean
  showLearningItems: boolean
  showLabels: boolean
  darkMode: boolean
}

export interface AppError {
  id: number
  message: string
  details?: string
  timestamp: Date
  type: 'error' | 'warning' | 'info'
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  expiresAt?: number
}
