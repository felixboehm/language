import { ref } from 'vue'
import type { Lesson } from '@/types/lesson'
import { lessonService } from '@/services/lessonService'
import { useErrors } from './useErrors'

// Shared state (singleton)
const availableLanguages = ref<string[]>([])
const isLoading = ref(false)

export function useLessons() {
  const { withErrorHandling } = useErrors()

  /**
   * Load available languages from index
   */
  async function loadAvailableContent(): Promise<void> {
    isLoading.value = true

    await withErrorHandling(
      async () => {
        const index = await lessonService.loadLanguageIndex()
        availableLanguages.value = index.languages
        return index
      },
      'Failed to load available content'
    )

    isLoading.value = false
  }

  /**
   * Load topics for a specific language
   */
  async function loadTopicsForLanguage(lang: string): Promise<string[]> {
    const result = await withErrorHandling(
      async () => {
        const index = await lessonService.loadTopicIndex(lang)
        return index.topics
      },
      `Failed to load topics for ${lang}`
    )

    return result || []
  }

  /**
   * Load all lessons for a topic
   */
  async function loadAllLessonsForTopic(
    lang: string,
    topic: string
  ): Promise<Lesson[]> {
    isLoading.value = true

    const result = await withErrorHandling(
      async () => {
        return await lessonService.loadAllLessons(lang, topic)
      },
      `Failed to load lessons for ${lang}/${topic}`
    )

    isLoading.value = false
    return result || []
  }

  /**
   * Load a single lesson
   */
  async function loadLesson(
    lang: string,
    topic: string,
    filename: string
  ): Promise<Lesson | null> {
    return await withErrorHandling(
      async () => {
        return await lessonService.loadLesson(lang, topic, filename)
      },
      `Failed to load lesson ${filename}`
    )
  }

  /**
   * Clear all cached data
   */
  function clearCache(): void {
    lessonService.clearCache()
  }

  return {
    availableLanguages,
    isLoading,
    loadAvailableContent,
    loadTopicsForLanguage,
    loadAllLessonsForTopic,
    loadLesson,
    clearCache
  }
}
