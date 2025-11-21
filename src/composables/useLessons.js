import { ref } from 'vue'
import yaml from 'js-yaml'

export function useLessons() {
  const availableContent = ref({})
  const languageCodes = ref({}) // Store language codes
  const topicCodes = ref({}) // Store topic codes
  const isLoading = ref(false)

  async function loadAvailableContent() {
    try {
      console.log('📚 Loading available languages...')
      isLoading.value = true
      const response = await fetch('lessons/languages.yaml')

      if (!response.ok) {
        throw new Error(`Failed to fetch languages.yaml: ${response.status}`)
      }

      const text = await response.text()
      const data = yaml.load(text)
      console.log('📖 Loaded languages data:', data)

      const content = {}
      const codes = {}

      for (const lang of data.languages) {
        const folder = typeof lang === 'string' ? lang : lang.folder
        const code = typeof lang === 'string' ? null : lang.code
        content[folder] = {}
        codes[folder] = code
        console.log(`  ✓ Language: ${folder} (${code || 'no code'})`)
      }

      availableContent.value = content
      languageCodes.value = codes
      isLoading.value = false
      console.log('✅ Languages loaded successfully')
    } catch (error) {
      console.error('❌ Error loading available content:', error)
      isLoading.value = false
    }
  }

  async function loadTopicsForLanguage(lang) {
    try {
      console.log(`📚 Loading topics for language: ${lang}`)

      // Ensure languages are loaded first
      if (!availableContent.value[lang]) {
        console.log('⚠️ Languages not loaded yet, loading now...')
        await loadAvailableContent()

        if (!availableContent.value[lang]) {
          throw new Error(`Language ${lang} not found in available content`)
        }
      }

      const response = await fetch(`lessons/${lang}/topics.yaml`)

      if (!response.ok) {
        throw new Error(`Failed to fetch topics.yaml for ${lang}: ${response.status}`)
      }

      const text = await response.text()
      const data = yaml.load(text)
      console.log(`📖 Loaded topics data for ${lang}:`, data)

      // Initialize topic codes storage for this language if needed
      if (!topicCodes.value[lang]) {
        topicCodes.value[lang] = {}
      }

      for (const topic of data.topics) {
        const folder = typeof topic === 'string' ? topic : topic.folder
        const code = typeof topic === 'string' ? null : topic.code
        availableContent.value[lang][folder] = []
        topicCodes.value[lang][folder] = code
        console.log(`  ✓ Topic: ${folder} (${code || 'no code'})`)
      }

      console.log(`✅ Topics loaded for ${lang}`)
    } catch (error) {
      console.error(`❌ Error loading topics for ${lang}:`, error)
    }
  }

  async function loadLessonsForTopic(lang, topic) {
    try {
      console.log(`📚 Loading lesson list for ${lang}/${topic}`)

      // Ensure topics are loaded first
      if (!availableContent.value[lang] || availableContent.value[lang][topic] === undefined) {
        console.log('⚠️ Topics not loaded yet, loading now...')
        await loadTopicsForLanguage(lang)

        if (!availableContent.value[lang] || availableContent.value[lang][topic] === undefined) {
          throw new Error(`Topic ${topic} not found for language ${lang}`)
        }
      }

      const response = await fetch(`lessons/${lang}/${topic}/lessons.yaml`)

      if (!response.ok) {
        throw new Error(`Failed to fetch lessons.yaml for ${lang}/${topic}: ${response.status}`)
      }

      const text = await response.text()
      const data = yaml.load(text)
      console.log(`📖 Loaded lessons list for ${lang}/${topic}:`, data.lessons)

      availableContent.value[lang][topic] = data.lessons
      console.log(`✅ Lesson list loaded: ${data.lessons.length} lessons found`)
    } catch (error) {
      console.error(`❌ Error loading lessons for ${lang}/${topic}:`, error)
    }
  }

  async function loadLesson(lang, topic, filename) {
    try {
      console.log(`📄 Loading lesson: ${lang}/${topic}/${filename}`)

      // Add .yaml extension if not present
      const fullFilename = filename.endsWith('.yaml') ? filename : `${filename}.yaml`
      const response = await fetch(`lessons/${lang}/${topic}/${fullFilename}`)

      if (!response.ok) {
        console.error(`❌ Failed to fetch lesson ${fullFilename}: ${response.status}`)
        return null
      }

      const text = await response.text()
      const lesson = yaml.load(text)

      if (lesson) {
        console.log(`  ✓ Lesson loaded: #${lesson.number} - ${lesson.title}`)
      } else {
        console.error(`  ❌ Failed to parse lesson: ${fullFilename}`)
      }

      return lesson
    } catch (error) {
      console.error(`❌ Error loading lesson ${filename}:`, error)
      return null
    }
  }

  async function loadAllLessonsForTopic(lang, topic) {
    try {
      console.log(`📚 Loading all lessons for ${lang}/${topic}`)

      // Load the lesson list first (this will ensure topics are loaded too)
      await loadLessonsForTopic(lang, topic)

      const lessonFiles = availableContent.value[lang]?.[topic]

      if (!lessonFiles || lessonFiles.length === 0) {
        console.error(`❌ No lesson files found for ${lang}/${topic}`)
        return []
      }

      console.log(`📖 Found ${lessonFiles.length} lesson files to load`)

      const lessons = []
      for (const filename of lessonFiles) {
        const lesson = await loadLesson(lang, topic, filename)
        if (lesson) {
          // Add filename (without .yaml extension) to lesson object for audio path
          lesson._filename = filename.replace(/\.yaml$/, '')
          lessons.push(lesson)
        }
      }

      const sortedLessons = lessons.sort((a, b) => a.number - b.number)
      console.log(`✅ All lessons loaded and sorted: ${sortedLessons.length} lessons`)

      return sortedLessons
    } catch (error) {
      console.error(`❌ Error loading all lessons for ${lang}/${topic}:`, error)
      return []
    }
  }

  // Get language code for a language folder
  function getLanguageCode(langFolder) {
    return languageCodes.value[langFolder] || null
  }

  // Get topic code for a topic folder
  function getTopicCode(langFolder, topicFolder) {
    return topicCodes.value[langFolder]?.[topicFolder] || getLanguageCode(langFolder)
  }

  return {
    availableContent,
    languageCodes,
    topicCodes,
    isLoading,
    loadAvailableContent,
    loadTopicsForLanguage,
    loadLessonsForTopic,
    loadLesson,
    loadAllLessonsForTopic,
    getLanguageCode,
    getTopicCode
  }
}
