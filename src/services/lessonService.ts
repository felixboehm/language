import yaml from 'js-yaml'
import type {
  Lesson,
  LessonIndex,
  TopicIndex,
  LanguageIndex
} from '@/types/lesson'
import { cacheService } from './cacheService'

/**
 * Service for fetching and parsing lesson data from YAML files
 */
class LessonService {
  private baseURL = 'lessons'

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(
    url: string,
    retries = 3,
    delay = 1000
  ): Promise<Response> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response
      } catch (error) {
        if (i === retries - 1) throw error

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }

    throw new Error('Failed after retries')
  }

  /**
   * Fetch and parse YAML file
   */
  private async fetchYAML<T>(path: string): Promise<T> {
    const response = await this.fetchWithRetry(`${this.baseURL}/${path}`)
    const text = await response.text()
    return yaml.load(text) as T
  }

  /**
   * Load available languages index
   */
  async loadLanguageIndex(): Promise<LanguageIndex> {
    const cacheKey = 'index:languages'

    const cached = cacheService.get<LanguageIndex>(cacheKey)
    if (cached) return cached

    const index = await this.fetchYAML<LanguageIndex>('index.yaml')
    cacheService.set(cacheKey, index)

    return index
  }

  /**
   * Load topics for a specific language
   */
  async loadTopicIndex(lang: string): Promise<TopicIndex> {
    const cacheKey = `index:${lang}`

    const cached = cacheService.get<TopicIndex>(cacheKey)
    if (cached) return cached

    const index = await this.fetchYAML<TopicIndex>(`${lang}/index.yaml`)
    cacheService.set(cacheKey, index)

    return index
  }

  /**
   * Load lesson list for a topic
   */
  async loadLessonIndex(lang: string, topic: string): Promise<LessonIndex> {
    const cacheKey = `index:${lang}:${topic}`

    const cached = cacheService.get<LessonIndex>(cacheKey)
    if (cached) return cached

    const index = await this.fetchYAML<LessonIndex>(`${lang}/${topic}/index.yaml`)
    cacheService.set(cacheKey, index)

    return index
  }

  /**
   * Load a single lesson
   */
  async loadLesson(
    lang: string,
    topic: string,
    filename: string
  ): Promise<Lesson> {
    const fullFilename = filename.endsWith('.yaml') ? filename : `${filename}.yaml`
    const cacheKey = `lesson:${lang}:${topic}:${fullFilename}`

    const cached = cacheService.get<Lesson>(cacheKey)
    if (cached) return cached

    const lesson = await this.fetchYAML<Lesson>(
      `${lang}/${topic}/${fullFilename}`
    )
    cacheService.set(cacheKey, lesson)

    return lesson
  }

  /**
   * Load all lessons for a topic in parallel
   */
  async loadAllLessons(lang: string, topic: string): Promise<Lesson[]> {
    const index = await this.loadLessonIndex(lang, topic)

    // Load all lessons in parallel
    const lessons = await Promise.all(
      index.lessons.map(filename =>
        this.loadLesson(lang, topic, filename)
      )
    )

    // Sort by lesson number
    return lessons
      .filter(Boolean)
      .sort((a, b) => a.number - b.number)
  }

  /**
   * Clear all cached lesson data
   */
  clearCache(): void {
    cacheService.clear()
  }
}

// Export singleton instance
export const lessonService = new LessonService()
