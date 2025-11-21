import { ref } from 'vue'
import yaml from 'js-yaml'

// Helper function to resolve IPFS URLs to HTTP gateway URLs
function resolveUrl(urlOrPath) {
  if (typeof urlOrPath === 'string' && urlOrPath.startsWith('ipfs://')) {
    // Convert IPFS URL to HTTP gateway URL
    const ipfsHash = urlOrPath.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${ipfsHash}`
  }
  return urlOrPath
}

// Helper function to parse source (string, folder object, or url object)
function parseSource(source) {
  if (typeof source === 'string') {
    // Backward compatible: string is treated as folder
    return { type: 'folder', path: source }
  }
  if (typeof source === 'object') {
    if (source.folder) {
      return { type: 'folder', path: source.folder, code: source.code }
    }
    if (source.url) {
      return { type: 'url', path: resolveUrl(source.url), code: source.code }
    }
  }
  return null
}

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
        const source = parseSource(lang)
        if (!source) {
          console.warn(`⚠️ Invalid language source:`, lang)
          continue
        }

        // Use path as the key (for folders, it's the folder name; for URLs, it's the full URL)
        const key = source.path
        content[key] = {}
        codes[key] = source.code || null
        console.log(`  ✓ Language: ${key} (${source.type}) (${source.code || 'no code'})`)
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

      // Construct topics.yaml URL based on whether lang is a folder or URL
      let topicsUrl
      if (lang.startsWith('http://') || lang.startsWith('https://')) {
        // Language is a URL
        topicsUrl = `${lang}/topics.yaml`
      } else {
        // Language is a folder
        topicsUrl = `lessons/${lang}/topics.yaml`
      }

      const response = await fetch(topicsUrl)

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
        const source = parseSource(topic)
        if (!source) {
          console.warn(`⚠️ Invalid topic source:`, topic)
          continue
        }

        const key = source.path
        availableContent.value[lang][key] = []
        topicCodes.value[lang][key] = source.code || null
        console.log(`  ✓ Topic: ${key} (${source.type}) (${source.code || 'no code'})`)
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

      // Construct lessons.yaml URL
      let lessonsUrl
      if (topic.startsWith('http://') || topic.startsWith('https://')) {
        // Topic is a URL
        lessonsUrl = `${topic}/lessons.yaml`
      } else if (lang.startsWith('http://') || lang.startsWith('https://')) {
        // Language is a URL, topic is a folder
        lessonsUrl = `${lang}/${topic}/lessons.yaml`
      } else {
        // Both are folders
        lessonsUrl = `lessons/${lang}/${topic}/lessons.yaml`
      }

      const response = await fetch(lessonsUrl)

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

  async function loadLesson(lang, topic, filenameOrSource) {
    try {
      const sourceDisplay = typeof filenameOrSource === 'string'
        ? filenameOrSource
        : JSON.stringify(filenameOrSource)
      console.log(`📄 Loading lesson: ${lang}/${topic}/${sourceDisplay}`)

      // Parse lesson source (can be string, folder object, or url object)
      const source = parseSource(filenameOrSource)
      if (!source) {
        console.error(`❌ Invalid lesson source:`, filenameOrSource)
        return null
      }

      // Construct content.yaml URL
      let lessonPath
      if (source.type === 'url') {
        // Lesson is a URL
        lessonPath = `${source.path}/content.yaml`
      } else if (topic.startsWith('http://') || topic.startsWith('https://')) {
        // Topic is a URL, lesson is a folder
        lessonPath = `${topic}/${source.path}/content.yaml`
      } else if (lang.startsWith('http://') || lang.startsWith('https://')) {
        // Language is a URL, others are folders
        lessonPath = `${lang}/${topic}/${source.path}/content.yaml`
      } else {
        // All are folders
        lessonPath = `lessons/${lang}/${topic}/${source.path}/content.yaml`
      }

      const response = await fetch(lessonPath)

      if (!response.ok) {
        console.error(`❌ Failed to fetch lesson ${lessonPath}: ${response.status}`)
        return null
      }

      const text = await response.text()
      const lesson = yaml.load(text)

      if (lesson) {
        console.log(`  ✓ Lesson loaded: #${lesson.number} - ${lesson.title}`)
        // Store the source path for audio loading
        lesson._source = source
      } else {
        console.error(`  ❌ Failed to parse lesson: ${filenameOrSource}`)
      }

      return lesson
    } catch (error) {
      console.error(`❌ Error loading lesson ${filenameOrSource}:`, error)
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
          const source = parseSource(filename)
          lesson._filename = source ? source.path.replace(/\.yaml$/, '') : filename.replace(/\.yaml$/, '')
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
