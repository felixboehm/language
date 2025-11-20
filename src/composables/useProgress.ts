import { ref, computed, watch } from 'vue'

// Shared state (singleton)
const completedLessons = ref<Set<string>>(new Set())
const completedExamples = ref<Set<string>>(new Set())
const lastVisited = ref<string | null>(null)

let isInitialized = false

const STORAGE_KEY = 'learning-progress'

/**
 * Composable for managing user learning progress
 */
export function useProgress() {
  /**
   * Load progress from localStorage
   */
  function loadProgress(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        completedLessons.value = new Set(data.completedLessons || [])
        completedExamples.value = new Set(data.completedExamples || [])
        lastVisited.value = data.lastVisited || null
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }
  }

  /**
   * Save progress to localStorage
   */
  function saveProgress(): void {
    try {
      const data = {
        completedLessons: Array.from(completedLessons.value),
        completedExamples: Array.from(completedExamples.value),
        lastVisited: lastVisited.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  /**
   * Initialize watchers for auto-save
   */
  function initializeWatchers(): void {
    if (isInitialized) return
    isInitialized = true

    watch([completedLessons, completedExamples, lastVisited], () => {
      saveProgress()
    }, { deep: true })
  }

  /**
   * Mark a lesson as completed
   */
  function markLessonComplete(lang: string, topic: string, lessonNumber: number): void {
    const id = `${lang}/${topic}/${lessonNumber}`
    completedLessons.value.add(id)
  }

  /**
   * Mark a lesson as incomplete
   */
  function markLessonIncomplete(lang: string, topic: string, lessonNumber: number): void {
    const id = `${lang}/${topic}/${lessonNumber}`
    completedLessons.value.delete(id)
  }

  /**
   * Check if a lesson is completed
   */
  function isLessonComplete(lang: string, topic: string, lessonNumber: number): boolean {
    const id = `${lang}/${topic}/${lessonNumber}`
    return completedLessons.value.has(id)
  }

  /**
   * Mark an example as completed
   */
  function markExampleComplete(
    lang: string,
    topic: string,
    lessonNumber: number,
    exampleIndex: number
  ): void {
    const id = `${lang}/${topic}/${lessonNumber}/${exampleIndex}`
    completedExamples.value.add(id)
  }

  /**
   * Check if an example is completed
   */
  function isExampleComplete(
    lang: string,
    topic: string,
    lessonNumber: number,
    exampleIndex: number
  ): boolean {
    const id = `${lang}/${topic}/${lessonNumber}/${exampleIndex}`
    return completedExamples.value.has(id)
  }

  /**
   * Set last visited lesson
   */
  function setLastVisited(lang: string, topic: string, lessonNumber: number): void {
    lastVisited.value = `${lang}/${topic}/${lessonNumber}`
  }

  /**
   * Get progress for a specific topic
   */
  function getTopicProgress(lang: string, topic: string, totalLessons: number) {
    const completed = Array.from(completedLessons.value).filter(id =>
      id.startsWith(`${lang}/${topic}/`)
    ).length

    return {
      total: totalLessons,
      completed,
      percentComplete: totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0
    }
  }

  /**
   * Get overall statistics
   */
  const stats = computed(() => ({
    totalLessons: completedLessons.value.size,
    totalExamples: completedExamples.value.size,
    lastVisited: lastVisited.value
  }))

  /**
   * Reset all progress
   */
  function resetProgress(): void {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      completedLessons.value.clear()
      completedExamples.value.clear()
      lastVisited.value = null
    }
  }

  // Initialize on first use
  if (!isInitialized) {
    loadProgress()
    initializeWatchers()
  }

  return {
    completedLessons,
    completedExamples,
    lastVisited,
    stats,
    markLessonComplete,
    markLessonIncomplete,
    isLessonComplete,
    markExampleComplete,
    isExampleComplete,
    setLastVisited,
    getTopicProgress,
    resetProgress,
    loadProgress,
    saveProgress
  }
}
