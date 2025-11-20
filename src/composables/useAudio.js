import { ref, computed } from 'vue'
import { useLessons } from './useLessons'

// Get lesson composable for language codes
const { getLanguageCode, getTopicCode } = useLessons()

// Shared audio state (singleton pattern)
const isPlaying = ref(false)
const isPaused = ref(false)
const currentItemIndex = ref(-1)
const readingQueue = ref([])
const audioElement = ref(null)
const currentAudioBlob = ref(null)

// Convert text to speech blob using Web Speech API
function textToSpeechBlob(text, lang, rate) {
  return new Promise((resolve, reject) => {
    // Check if browser supports Web Speech API
    if (!('speechSynthesis' in window)) {
      reject(new Error('Web Speech API not supported'))
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate

    // Use MediaRecorder to capture audio
    // Note: This is a workaround since Web Speech API doesn't directly provide blobs
    // For better iOS support, we'll use a different approach with AudioContext

    // Alternative: For now, we'll play directly with Web Speech API
    // and handle iOS lock screen requirements differently
    utterance.onend = () => {
      resolve(null) // We'll handle playback differently
    }

    utterance.onerror = (event) => {
      reject(event.error)
    }

    // Store the utterance for playback
    resolve(utterance)
  })
}

// Build reading queue from lesson data
function buildReadingQueue(lesson, learning, teaching, settings) {
  const queue = []
  // Get language codes from the YAML files
  const learningLang = getLanguageCode(learning) || 'de-DE' // Fallback to German
  const teachingLang = getTopicCode(learning, teaching) || 'pt-PT' // Fallback to Portuguese

  console.log(`🌍 Building queue with languages: learning=${learning} (${learningLang}), teaching=${teaching} (${teachingLang})`)

  if (!lesson || !lesson.sections) {
    return queue
  }

  lesson.sections.forEach((section, sectionIdx) => {
    // Add section title first
    queue.push({
      type: 'section-title',
      text: section.title,
      lang: learningLang,
      sectionIdx,
      exampleIdx: -1
    })

    // Then add examples from this section
    section.examples.forEach((example, exampleIdx) => {
      // Add question
      queue.push({
        type: 'question',
        text: example.q,
        lang: teachingLang,
        sectionIdx,
        exampleIdx
      })

      // Add answer if setting is enabled
      if (settings.readAnswers && example.a) {
        queue.push({
          type: 'answer',
          text: example.a,
          lang: learningLang,
          sectionIdx,
          exampleIdx
        })
      }
    })
  })

  return queue
}

// Initialize audio queue for a lesson
function initializeAudio(lesson, learning, teaching, settings) {
  console.log('🎼 Initializing audio for lesson:', lesson.title)
  console.log('🌍 Languages:', { learning, teaching })
  console.log('⚙️ Settings:', settings)

  readingQueue.value = buildReadingQueue(lesson, learning, teaching, settings)

  console.log('📋 Built reading queue with', readingQueue.value.length, 'items')
  console.log('📋 First 5 items:', readingQueue.value.slice(0, 5).map(item => ({
    type: item.type,
    text: item.text.substring(0, 40) + '...',
    lang: item.lang
  })))

  currentItemIndex.value = -1
  isPlaying.value = false
  isPaused.value = false

  // Create or get audio element
  if (!audioElement.value) {
    audioElement.value = new Audio()
    audioElement.value.addEventListener('ended', onAudioEnded)
  }
}

// Current utterance being spoken
let currentUtterance = null

// Ensure voices are loaded (needed for desktop browsers)
function ensureVoicesLoaded() {
  console.log('🔍 Checking if voices are loaded...')
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    console.log('🔊 Current voices:', voices.length)

    if (voices.length > 0) {
      console.log('✅ Voices already loaded')
      console.log('🗣️ Available languages:', voices.slice(0, 10).map(v => v.lang))
      resolve(voices)
    } else {
      console.log('⏳ Waiting for voices to load...')
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = () => {
        const loadedVoices = window.speechSynthesis.getVoices()
        console.log('✅ Voices loaded via onvoiceschanged:', loadedVoices.length)
        resolve(loadedVoices)
      }
      // Fallback timeout
      setTimeout(() => {
        const timeoutVoices = window.speechSynthesis.getVoices()
        console.log('⏰ Voices loaded via timeout:', timeoutVoices.length)
        resolve(timeoutVoices)
      }, 1000)
    }
  })
}

// Play next item in queue
async function playNextItem(settings) {
  console.log('🎵 playNextItem called', {
    currentIndex: currentItemIndex.value,
    queueLength: readingQueue.value.length,
    isPlaying: isPlaying.value
  })

  if (currentItemIndex.value >= readingQueue.value.length - 1) {
    // Reached end of queue
    console.log('✅ Reached end of queue, stopping')
    stop()
    return
  }

  currentItemIndex.value++
  const item = readingQueue.value[currentItemIndex.value]

  console.log('🎤 Playing item:', {
    index: currentItemIndex.value,
    type: item.type,
    text: item.text,
    lang: item.lang,
    rate: settings.audioSpeed || 1.0
  })

  try {
    // Ensure voices are loaded first
    const voices = await ensureVoicesLoaded()
    console.log('🔊 Voices loaded:', voices.length, 'voices available')

    // Use Web Speech API directly
    currentUtterance = new SpeechSynthesisUtterance(item.text)
    currentUtterance.lang = item.lang
    currentUtterance.rate = settings.audioSpeed || 1.0

    currentUtterance.onstart = () => {
      console.log('▶️ Speech started for:', item.text.substring(0, 50))
    }

    currentUtterance.onend = () => {
      console.log('⏹️ Speech ended for:', item.text.substring(0, 50))
      if (isPlaying.value) {
        playNextItem(settings)
      }
    }

    currentUtterance.onerror = (event) => {
      console.error('❌ Speech synthesis error:', event.error, event)
      // If error is 'canceled', try to continue to next item
      if (event.error === 'canceled' && isPlaying.value) {
        console.log('⚠️ Speech was canceled, continuing to next item...')
        setTimeout(() => playNextItem(settings), 100)
      } else {
        stop()
      }
    }

    // Only cancel if something is actually speaking
    if (window.speechSynthesis.speaking) {
      console.log('🛑 Canceling ongoing speech')
      window.speechSynthesis.cancel()
      // Add a small delay to let the cancel complete
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    // Speak
    console.log('📢 Calling speechSynthesis.speak()')
    window.speechSynthesis.speak(currentUtterance)
    console.log('📢 speechSynthesis.speak() called, speaking:', window.speechSynthesis.speaking, 'pending:', window.speechSynthesis.pending)

  } catch (error) {
    console.error('❌ Error playing audio:', error)
    stop()
  }
}

// Start playing from beginning or continue
function play(settings) {
  console.log('🎬 Play button pressed')

  // Check browser support
  if (!('speechSynthesis' in window)) {
    console.error('❌ Web Speech API not supported in this browser')
    alert('Text-to-speech is not supported in your browser')
    return
  }

  console.log('✅ Browser supports Web Speech API')
  console.log('📋 Reading queue:', readingQueue.value.length, 'items')
  console.log('📋 Queue preview:', readingQueue.value.slice(0, 5).map(item => ({
    type: item.type,
    text: item.text.substring(0, 30) + '...'
  })))

  if (readingQueue.value.length === 0) {
    console.warn('⚠️ No items in reading queue')
    return
  }

  console.log('▶️ Setting isPlaying to true')
  isPlaying.value = true
  isPaused.value = false

  console.log('🎯 Current position:', currentItemIndex.value)

  // Always continue from current position (or start if at -1)
  playNextItem(settings)
}

// Pause playback (actually stops and maintains position)
function pause() {
  isPaused.value = true
  isPlaying.value = false
  // Stop speaking but don't reset position
  window.speechSynthesis.cancel()
}

// Resume playback (not used anymore, use play instead)
function resume(settings) {
  play(settings)
}

// Stop playback completely
function stop() {
  isPlaying.value = false
  isPaused.value = false
  currentItemIndex.value = -1
  window.speechSynthesis.cancel()
  currentUtterance = null
}

// Play a single item (for clicking on examples)
async function playSingleItem(index, settings) {
  console.log('👆 Clicked on example, playing single item at index:', index)

  const item = readingQueue.value[index]
  if (!item) {
    console.warn('⚠️ No item found at index:', index)
    return
  }

  console.log('🎤 Single item:', {
    type: item.type,
    text: item.text,
    lang: item.lang
  })

  // Ensure voices are loaded first
  await ensureVoicesLoaded()

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(item.text)
  utterance.lang = item.lang
  utterance.rate = settings.audioSpeed || 1.0

  utterance.onstart = () => {
    console.log('▶️ Single item speech started')
  }

  // When done, check if we should play the answer too
  utterance.onend = () => {
    console.log('⏹️ Single item speech ended')
    // If there's an answer right after this (next item), play it too
    const nextItem = readingQueue.value[index + 1]
    if (nextItem &&
        nextItem.sectionIdx === item.sectionIdx &&
        nextItem.exampleIdx === item.exampleIdx &&
        nextItem.type === 'answer') {
      console.log('📢 Playing answer too:', nextItem.text.substring(0, 30))
      const answerUtterance = new SpeechSynthesisUtterance(nextItem.text)
      answerUtterance.lang = nextItem.lang
      answerUtterance.rate = settings.audioSpeed || 1.0
      window.speechSynthesis.speak(answerUtterance)
    }
  }

  utterance.onerror = (event) => {
    console.error('❌ Single item speech synthesis error:', event.error, event)
    // Don't stop completely for canceled errors on single items
    if (event.error !== 'canceled') {
      console.log('⚠️ Non-canceled error on single item, stopping')
    }
  }

  // Only cancel if something is actually speaking
  if (window.speechSynthesis.speaking) {
    console.log('🛑 Canceling ongoing speech for single item')
    window.speechSynthesis.cancel()
    // Add a small delay to let the cancel complete
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  // Speak
  console.log('📢 Speaking single item')
  window.speechSynthesis.speak(utterance)
}

// Jump to specific example
function jumpToExample(sectionIdx, exampleIdx, settings) {
  // Find the index in the queue for this example
  const index = readingQueue.value.findIndex(
    item => item.sectionIdx === sectionIdx &&
            item.exampleIdx === exampleIdx &&
            item.type === 'question'
  )

  if (index !== -1) {
    // Stop current playback
    window.speechSynthesis.cancel()

    if (isPlaying.value) {
      // Continue playing from this point
      // Set to just before the target so playNextItem increments to it
      currentItemIndex.value = index - 1
      playNextItem(settings)
    } else {
      // Just play this one example
      playSingleItem(index, settings)
    }
  }
}

// Get current reading position
const currentItem = computed(() => {
  if (currentItemIndex.value >= 0 && currentItemIndex.value < readingQueue.value.length) {
    return readingQueue.value[currentItemIndex.value]
  }
  return null
})

// Handle audio ended event
function onAudioEnded() {
  if (isPlaying.value && !isPaused.value) {
    playNextItem({ audioSpeed: 1.0 }) // Will be replaced with actual settings
  }
}

// Cleanup
function cleanup() {
  stop()
  if (audioElement.value) {
    audioElement.value.removeEventListener('ended', onAudioEnded)
    audioElement.value = null
  }
}

export function useAudio() {
  return {
    isPlaying,
    isPaused,
    currentItem,
    currentItemIndex,
    readingQueue,
    initializeAudio,
    play,
    pause,
    resume,
    stop,
    jumpToExample,
    cleanup
  }
}
