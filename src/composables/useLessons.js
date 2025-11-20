import { ref } from 'vue'
import yaml from 'js-yaml'

export function useLessons() {
  const availableContent = ref({})
  const isLoading = ref(false)

  async function loadAvailableContent() {
    try {
      isLoading.value = true
      const response = await fetch('lessons/index.yaml')
      const text = await response.text()
      const index = yaml.load(text)

      const content = {}
      for (const lang of index.languages) {
        content[lang] = {}
      }

      availableContent.value = content
      isLoading.value = false
    } catch (error) {
      console.error('Error loading available content:', error)
      isLoading.value = false
    }
  }

  async function loadTopicsForLanguage(lang) {
    try {
      const response = await fetch(`lessons/${lang}/index.yaml`)
      const text = await response.text()
      const index = yaml.load(text)

      for (const topic of index.topics) {
        availableContent.value[lang][topic] = []
      }
    } catch (error) {
      console.error(`Error loading topics for ${lang}:`, error)
    }
  }

  async function loadLessonsForTopic(lang, topic) {
    try {
      const response = await fetch(`lessons/${lang}/${topic}/index.yaml`)
      const text = await response.text()
      const index = yaml.load(text)

      // Ensure parent objects exist
      if (!availableContent.value[lang]) {
        availableContent.value[lang] = {}
      }
      availableContent.value[lang][topic] = index.lessons
    } catch (error) {
      console.error(`Error loading lessons for ${lang}/${topic}:`, error)
    }
  }

  async function loadLesson(lang, topic, filename) {
    try {
      // Add .yaml extension if not present
      const fullFilename = filename.endsWith('.yaml') ? filename : `${filename}.yaml`
      const response = await fetch(`lessons/${lang}/${topic}/${fullFilename}`)
      const text = await response.text()
      return yaml.load(text)
    } catch (error) {
      console.error(`Error loading lesson ${filename}:`, error)
      return null
    }
  }

  async function loadAllLessonsForTopic(lang, topic) {
    try {
      await loadLessonsForTopic(lang, topic)
      const lessonFiles = availableContent.value[lang][topic]

      const lessons = []
      for (const filename of lessonFiles) {
        const lesson = await loadLesson(lang, topic, filename)
        if (lesson) {
          lessons.push(lesson)
        }
      }

      return lessons.sort((a, b) => a.number - b.number)
    } catch (error) {
      console.error(`Error loading all lessons for ${lang}/${topic}:`, error)
      return []
    }
  }

  return {
    availableContent,
    isLoading,
    loadAvailableContent,
    loadTopicsForLanguage,
    loadLessonsForTopic,
    loadLesson,
    loadAllLessonsForTopic
  }
}
