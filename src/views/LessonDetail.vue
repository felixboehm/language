<template>
  <div>
    <div v-if="lesson">
      <!-- Lesson title and description -->
      <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
        {{ lesson.title }}
      </h2>
      <p v-if="lesson.description" class="text-gray-600 dark:text-gray-400 mb-5 text-lg">
        {{ lesson.description }}
      </p>

      <!-- Sections -->
      <div
        v-for="(section, idx) in filteredSections"
        :key="idx"
        class="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-5 bg-white dark:bg-gray-800">
        <div class="text-2xl text-primary-500 dark:text-blue-400 font-bold mb-4">
          {{ section.title }}
        </div>

        <!-- Explanation -->
        <div
          v-if="section.explanation"
          class="bg-gray-100 dark:bg-gray-900 p-4 rounded mb-4 prose prose-sm dark:prose-invert max-w-none"
          v-html="marked(section.explanation)">
        </div>

        <!-- Examples -->
        <div
          v-for="(example, exIdx) in section.examples"
          :key="exIdx"
          :id="`example-${example._originalSectionIdx}-${example._originalExampleIdx}`"
          @click="handleExampleClick(example)"
          :class="[
            'p-4 mb-3 rounded cursor-pointer transition',
            isCurrentlyReading(example) && isPlaying
              ? 'ring-4 ring-yellow-400 dark:ring-yellow-600'
              : '',
            isCurrentlyReading(example) && isPaused
              ? 'ring-4 ring-orange-400 dark:ring-orange-600'
              : '',
            example.labels
              ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 border-l-4 border-blue-500'
              : 'bg-orange-50 dark:bg-orange-900 dark:bg-opacity-20 border-l-4 border-orange-500'
          ]">
          <!-- Question -->
          <div class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {{ example.q }}
          </div>

          <!-- Answer (toggle with settings) -->
          <div
            v-show="settings.showAnswers"
            class="text-gray-600 dark:text-gray-400 italic mb-3">
            {{ example.a }}
          </div>

          <!-- Related items -->
          <div v-if="settings.showLearningItems && example.rel && example.rel.length > 0" class="flex flex-wrap gap-2 mb-3">
            <button
              v-for="(item, relIdx) in example.rel"
              :key="relIdx"
              @click.stop="handleItemClick(item[0])"
              :class="[
                'px-2 py-1 rounded text-sm transition cursor-pointer border',
                isItemLearned(learning, teaching, item[0])
                  ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 line-through opacity-60'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
              ]">
              <span class="font-semibold text-primary-500 dark:text-blue-400">
                {{ item[0] }}
              </span>
              <span class="text-gray-800 dark:text-gray-200">
                • {{ item.slice(1).join(' • ') }}
              </span>
              <span v-if="isItemLearned(learning, teaching, item[0])" class="ml-1">✓</span>
            </button>
          </div>

          <!-- Labels -->
          <div v-if="settings.showLabels && example.labels" class="flex gap-1">
            <span
              v-for="label in example.labels"
              :key="label"
              class="bg-blue-500 text-white px-2 py-0.5 rounded text-xs font-semibold">
              {{ label }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="text-center py-8">
      <div class="text-2xl font-bold text-primary-500 dark:text-blue-400 mb-4">
        Loading lesson...
      </div>
    </div>

    <!-- Debug overlay (for iOS debugging) -->
    <div v-if="lesson && settings.showDebugOverlay" class="fixed top-24 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-40 font-mono max-w-xs">
      <div>Playing: {{ isPlaying ? 'YES' : 'NO' }}</div>
      <div>Paused: {{ isPaused ? 'YES' : 'NO' }}</div>
      <div>Index: {{ currentItem ? currentItem.sectionIdx + '-' + currentItem.exampleIdx : 'none' }}</div>
      <div v-if="currentItem" class="truncate">{{ currentItem.text.substring(0, 30) }}...</div>
    </div>

    <!-- Floating play/pause button for mobile -->
    <button
      v-if="lesson"
      @click="togglePlayPause"
      class="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all flex items-center justify-center text-3xl z-50"
      :title="isPlaying ? 'Pause' : 'Play'">
      {{ isPlaying ? '⏸' : '▶️' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useLessons } from '../composables/useLessons'
import { useSettings } from '../composables/useSettings'
import { useProgress } from '../composables/useProgress'
import { useAudio } from '../composables/useAudio'
import { marked } from 'marked'

const route = useRoute()
const emit = defineEmits(['update-title'])

const { loadAllLessonsForTopic } = useLessons()
const { settings } = useSettings()
const { isItemLearned, toggleItemLearned, areAllItemsLearned, progress } = useProgress()
const { isPlaying, isPaused, currentItem, initializeAudio, jumpToExample, cleanup, play, pause } = useAudio()

const lesson = ref(null)

// Use computed to get current route params (they can change when navigating between lessons)
const learning = computed(() => route.params.learning)
const teaching = computed(() => route.params.teaching)
const lessonNumber = computed(() => parseInt(route.params.number))

// Filter sections to show only examples that have unlearned items (if setting is enabled)
const filteredSections = computed(() => {
  if (!lesson.value || !lesson.value.sections) {
    return []
  }

  return lesson.value.sections.map((section, originalSectionIdx) => {
    const filteredExamples = section.examples
      .map((example, originalExampleIdx) => ({
        ...example,
        _originalSectionIdx: originalSectionIdx,
        _originalExampleIdx: originalExampleIdx
      }))
      .filter(example => {
        // If hideLearnedExamples is disabled, show all examples
        if (!settings.value.hideLearnedExamples) {
          return true
        }

        // If example has no related items, always show it
        if (!example.rel || example.rel.length === 0) {
          return true
        }
        // Hide example only if ALL items are learned
        return !areAllItemsLearned(learning.value, teaching.value, example.rel)
      })

    return {
      ...section,
      examples: filteredExamples,
      _originalSectionIdx: originalSectionIdx
    }
  }).filter(section => section.examples.length > 0) // Only show sections with visible examples
})

// Handle item click to toggle learned status
function handleItemClick(itemId) {
  toggleItemLearned(learning.value, teaching.value, itemId)
}

// Handle example click for audio playback
function handleExampleClick(example) {
  const originalSectionIdx = example._originalSectionIdx
  const originalExampleIdx = example._originalExampleIdx

  if (isPlaying.value) {
    // If playing, jump to this example
    jumpToExample(originalSectionIdx, originalExampleIdx, settings.value)
  } else {
    // If not playing, just read this example once
    jumpToExample(originalSectionIdx, originalExampleIdx, settings.value)
  }
}

// Check if an example is currently being read
function isCurrentlyReading(example) {
  if (!currentItem.value) return false
  return currentItem.value.sectionIdx === example._originalSectionIdx &&
         currentItem.value.exampleIdx === example._originalExampleIdx
}

// Toggle play/pause
function togglePlayPause() {
  if (isPlaying.value) {
    pause()
  } else {
    play(settings.value)
  }
}

// Auto-scroll to currently reading item
watch(currentItem, async (newItem) => {
  if (!newItem) return

  await nextTick()

  const elementId = `example-${newItem.sectionIdx}-${newItem.exampleIdx}`
  const element = document.getElementById(elementId)

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
})

// Rebuild audio queue when hideLearnedExamples or readAnswers setting changes
watch(
  () => [settings.value.hideLearnedExamples, settings.value.readAnswers],
  async () => {
    if (lesson.value) {
      console.log('🔄 Settings changed, rebuilding audio queue')
      await initializeAudio(lesson.value, learning.value, teaching.value, settings.value)
    }
  },
  { deep: true }
)

// Rebuild audio queue when progress changes (items marked as learned/unlearned)
watch(
  progress,
  async () => {
    if (lesson.value && settings.value.hideLearnedExamples) {
      console.log('🔄 Progress changed, rebuilding audio queue')
      await initializeAudio(lesson.value, learning.value, teaching.value, settings.value)
    }
  },
  { deep: true }
)

onMounted(async () => {
  const currentLearning = route.params.learning
  const currentTeaching = route.params.teaching
  const currentLessonNumber = parseInt(route.params.number)

  // Load all lessons to find the correct file
  const lessons = await loadAllLessonsForTopic(currentLearning, currentTeaching)

  // Find the lesson with the matching number
  lesson.value = lessons.find(l => l.number === currentLessonNumber)

  if (lesson.value) {
    emit('update-title', `Lesson ${lesson.value.number}`)

    // Initialize audio for this lesson (load voices once)
    await initializeAudio(lesson.value, currentLearning, currentTeaching, settings.value)
  }
})

onUnmounted(() => {
  // Cleanup audio when leaving the page
  cleanup()
})
</script>
