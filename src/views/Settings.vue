<template>
  <div class="space-y-8">
    <!-- Appearance Section -->
    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-600">
        🎨 Appearance
      </h2>

      <!-- Dark Mode Toggle -->
      <div class="mb-6">
        <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
          Dark Mode
        </label>
        <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
          Dark color scheme for comfortable reading at night
        </div>
        <label class="relative inline-block w-14 h-8 cursor-pointer">
          <input
            type="checkbox"
            v-model="settings.darkMode"
            class="opacity-0 w-0 h-0 peer" />
          <span
            class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 transition rounded-full peer-checked:bg-primary-500 before:content-[''] before:absolute before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full peer-checked:before:translate-x-6">
          </span>
        </label>
      </div>
    </div>

    <!-- Display Settings Section -->
    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-600">
        📖 Lesson Display
      </h2>

      <!-- Show Answers Toggle -->
      <div class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Show Answers
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Show or hide answer translations in lessons
      </div>
      <label class="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.showAnswers"
          class="opacity-0 w-0 h-0 peer" />
        <span
          class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 transition rounded-full peer-checked:bg-primary-500 before:content-[''] before:absolute before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full peer-checked:before:translate-x-6">
        </span>
      </label>
    </div>

    <!-- Show Learning Items Toggle -->
    <div class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Show Learning Items
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Show or hide vocabulary and related items
      </div>
      <label class="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.showLearningItems"
          class="opacity-0 w-0 h-0 peer" />
        <span
          class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 transition rounded-full peer-checked:bg-primary-500 before:content-[''] before:absolute before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full peer-checked:before:translate-x-6">
        </span>
      </label>
    </div>

    <!-- Show Labels Toggle -->
    <div class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Show Labels
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Show or hide grammar labels (Futur, Gerundium, etc.)
      </div>
      <label class="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.showLabels"
          class="opacity-0 w-0 h-0 peer" />
        <span
          class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 transition rounded-full peer-checked:bg-primary-500 before:content-[''] before:absolute before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full peer-checked:before:translate-x-6">
        </span>
      </label>
    </div>

    <!-- Hide Learned Examples Toggle -->
    <div class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Hide Learned Examples
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Automatically hide examples where all vocabulary items are learned
      </div>
      <label class="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.hideLearnedExamples"
          class="opacity-0 w-0 h-0 peer" />
        <span
          class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 transition rounded-full peer-checked:bg-primary-500 before:content-[''] before:absolute before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full peer-checked:before:translate-x-6">
        </span>
      </label>
    </div>
    </div>

    <!-- Audio Settings Section -->
    <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-600">
        🔊 Audio Settings
      </h2>

      <!-- Audio Speed Selection -->
      <div class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Audio Speed
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Playback speed for auto-reading audio
      </div>
      <div class="flex gap-3">
        <button
          v-for="speed in [0.6, 0.8, 1.0]"
          :key="speed"
          @click="settings.audioSpeed = speed"
          :class="[
            'px-4 py-2 rounded font-semibold transition',
            settings.audioSpeed === speed
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
          ]">
          {{ speed }}×
        </button>
      </div>
    </div>

    <!-- Read Answers Toggle -->
    <div class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Read Answers
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Include answer translations when auto-reading lessons
      </div>
      <label class="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.readAnswers"
          class="opacity-0 w-0 h-0 peer" />
        <span
          class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 transition rounded-full peer-checked:bg-primary-500 before:content-[''] before:absolute before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full peer-checked:before:translate-x-6">
        </span>
      </label>
    </div>

    <!-- Debug Overlay Toggle -->
    <div class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Show Debug Overlay
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Display playback information overlay (for troubleshooting)
      </div>
      <label class="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.showDebugOverlay"
          class="opacity-0 w-0 h-0 peer" />
        <span
          class="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 dark:bg-gray-600 transition rounded-full peer-checked:bg-primary-500 before:content-[''] before:absolute before:h-6 before:w-6 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full peer-checked:before:translate-x-6">
        </span>
      </label>
    </div>

    <!-- Voice Selection -->
    <div v-if="voicesLoaded && availableLanguages.length > 0" class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Voice Selection
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Choose preferred voice for each language.
        <span class="italic">Note: iOS devices typically have only 1 voice per language.</span>
      </div>

      <div v-for="lang in availableLanguages" :key="lang" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ getLanguageName(lang) }} ({{ lang }})
          <span class="text-xs text-gray-500">
            ({{ voicesByLanguage[lang]?.length || 0 }} voice{{ voicesByLanguage[lang]?.length !== 1 ? 's' : '' }})
          </span>
        </label>
        <select
          v-model="settings.selectedVoices[lang]"
          @change="testVoice(lang, settings.selectedVoices[lang])"
          class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-gray-800 dark:text-gray-200">
          <option :value="undefined">Default voice</option>
          <option v-for="voice in voicesByLanguage[lang]" :key="voice.name" :value="voice.name">
            {{ voice.name }} {{ voice.localService ? '(Local)' : '(Cloud)' }}
          </option>
        </select>
      </div>
    </div>

    <div v-else-if="voicesLoaded && availableLanguages.length === 0" class="mb-6">
      <div class="text-gray-600 dark:text-gray-400 text-sm">
        No voices available. Voice selection will work after you visit a lesson page.
      </div>
    </div>

    <div v-else class="mb-6">
      <div class="text-gray-600 dark:text-gray-400 text-sm">
        Loading available voices...
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSettings } from '../composables/useSettings'
import { useLessons } from '../composables/useLessons'

const { settings } = useSettings()
const { loadAvailableContent, loadTopicsForLanguage, getLanguageCode, getTopicCode, availableContent } = useLessons()

const voicesLoaded = ref(false)
const allVoices = ref([])

// Language display names
const languageNames = {
  'pt-PT': 'Portuguese (Portugal)',
  'pt-BR': 'Portuguese (Brazil)',
  'de-DE': 'German',
  'de-AT': 'German (Austria)',
  'de-CH': 'German (Switzerland)',
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  'es-ES': 'Spanish (Spain)',
  'es-MX': 'Spanish (Mexico)',
  'fr-FR': 'French',
  'it-IT': 'Italian',
  'ja-JP': 'Japanese',
  'ko-KR': 'Korean',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)'
}

// Get display name for language code
function getLanguageName(lang) {
  return languageNames[lang] || lang
}

// Test phrases for different languages
const testPhrases = {
  'pt-PT': 'Olá, este é um teste de voz.',
  'pt-BR': 'Olá, este é um teste de voz.',
  'de-DE': 'Hallo, dies ist ein Sprachtest.',
  'de-AT': 'Hallo, dies ist ein Sprachtest.',
  'de-CH': 'Hallo, dies ist ein Sprachtest.',
  'en-US': 'Hello, this is a voice test.',
  'en-GB': 'Hello, this is a voice test.',
  'es-ES': 'Hola, esto es una prueba de voz.',
  'es-MX': 'Hola, esto es una prueba de voz.',
  'fr-FR': 'Bonjour, ceci est un test vocal.',
  'it-IT': 'Ciao, questo è un test vocale.',
  'ja-JP': 'こんにちは、これは音声テストです。',
  'ko-KR': '안녕하세요, 이것은 음성 테스트입니다.',
  'zh-CN': '你好，这是语音测试。',
  'zh-TW': '你好，這是語音測試。'
}

// Test the selected voice by speaking a sample phrase
function testVoice(lang, voiceName) {
  console.log(`🔊 Testing voice: ${voiceName || 'default'} for ${lang}`)

  // Cancel any ongoing speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }

  // Get test phrase for this language
  const testText = testPhrases[lang] || 'Hello, this is a voice test.'

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(testText)
  utterance.lang = lang
  utterance.rate = settings.value.audioSpeed || 1.0

  // Set the selected voice if specified
  if (voiceName) {
    const voice = allVoices.value.find(v => v.name === voiceName)
    if (voice) {
      utterance.voice = voice
      console.log(`✅ Using voice: ${voice.name}`)
    }
  }

  utterance.onstart = () => {
    console.log(`▶️ Playing test: "${testText}"`)
  }

  utterance.onerror = (event) => {
    console.error('❌ Voice test error:', event.error)
  }

  // Speak the test phrase
  window.speechSynthesis.speak(utterance)
}

// Group voices by language
const voicesByLanguage = computed(() => {
  const grouped = {}

  for (const voice of allVoices.value) {
    const lang = voice.lang
    if (!grouped[lang]) {
      grouped[lang] = []
    }
    grouped[lang].push(voice)
  }

  return grouped
})

// Get language codes used in lessons
const usedLanguageCodes = computed(() => {
  const codes = new Set()

  // Get all learning languages
  for (const learningLang in availableContent.value) {
    const learningCode = getLanguageCode(learningLang)
    if (learningCode) {
      codes.add(learningCode)
    }

    // Get all topics for this learning language
    for (const topic in availableContent.value[learningLang]) {
      const topicCode = getTopicCode(learningLang, topic)
      if (topicCode) {
        codes.add(topicCode)
      }
    }
  }

  console.log('🌍 Language codes used in lessons:', Array.from(codes))
  return Array.from(codes)
})

// Get list of languages that have voices AND are used in lessons
const availableLanguages = computed(() => {
  const allLangs = Object.keys(voicesByLanguage.value)

  // Only show languages with exact matches to used language codes
  const usedLangs = allLangs.filter(lang => {
    return usedLanguageCodes.value.includes(lang)
  })

  console.log('🎤 Available languages for voice selection:', usedLangs)
  console.log('🎤 Used language codes:', usedLanguageCodes.value)
  return usedLangs.sort()
})

// Load voices on mount
onMounted(async () => {
  console.log('🔊 Loading voices for settings page...')

  // Load lesson content to know which languages are used
  await loadAvailableContent()

  // Load topics for each learning language to get all topic codes
  for (const learningLang in availableContent.value) {
    await loadTopicsForLanguage(learningLang)
  }

  console.log('✅ Lesson content loaded')

  // Check if browser supports Web Speech API
  if (!('speechSynthesis' in window)) {
    console.error('❌ Web Speech API not supported')
    voicesLoaded.value = true // Show UI anyway with message
    return
  }

  // Function to load voices
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices()
    console.log(`📢 Got ${voices.length} voices`)

    if (voices.length > 0) {
      allVoices.value = voices
      voicesLoaded.value = true
      console.log(`✅ Loaded ${voices.length} voices`)
      console.log('📋 Available languages:', Object.keys(voicesByLanguage.value))
      return true
    }
    return false
  }

  // Try to load immediately
  if (loadVoices()) {
    return
  }

  // If not available, wait for voices to load
  console.log('⏳ Waiting for voices to load...')
  let timeoutId

  const onVoicesChanged = () => {
    if (loadVoices()) {
      clearTimeout(timeoutId)
      window.speechSynthesis.onvoiceschanged = null
    }
  }

  window.speechSynthesis.onvoiceschanged = onVoicesChanged

  // Fallback timeout - show UI anyway after 2 seconds
  timeoutId = setTimeout(() => {
    console.log('⏰ Voice loading timeout, showing UI anyway')
    const voices = window.speechSynthesis.getVoices()
    allVoices.value = voices
    voicesLoaded.value = true
    console.log(`📢 Timeout: ${voices.length} voices available`)
    window.speechSynthesis.onvoiceschanged = null
  }, 2000)
})
</script>
