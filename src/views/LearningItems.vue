<template>
  <div v-if="allItems.length > 0">
    <!-- Controls -->
    <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-5 flex flex-wrap gap-4 items-center">
      <!-- Lesson Filter -->
      <select
        v-model="selectedLesson"
        class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-gray-800 dark:text-gray-200 max-w-full">
        <option value="all">All Lessons</option>
        <option v-for="lesson in availableLessons" :key="lesson.number" :value="lesson.number">
          Lesson {{ lesson.number }}: {{ lesson.title }}
        </option>
      </select>

      <!-- Group by toggles -->
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="groupByLearnStatus"
            class="w-4 h-4 text-primary-500" />
          <span class="text-gray-800 dark:text-gray-200">Group by Status</span>
        </label>

        <label v-if="showGroupByLessonOption" class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="groupByLesson"
            class="w-4 h-4 text-primary-500" />
          <span class="text-gray-800 dark:text-gray-200">Group by Lesson</span>
        </label>
      </div>
    </div>

    <!-- Items Display -->
    <div v-if="!groupByLesson && !groupByLearnStatus">
      <!-- Flat list -->
      <div class="grid grid-cols-2 md:flex md:flex-wrap gap-2">
        <button
          v-for="item in filteredItems"
          :key="item.id"
          @click="toggleItemLearned(learning, teaching, item.term)"
          :class="[
            'px-3 py-2 rounded text-sm transition cursor-pointer border',
            isItemLearned(learning, teaching, item.term)
              ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 line-through opacity-60'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
          ]">
          <div class="font-semibold text-primary-500 dark:text-blue-400">{{ item.term }}</div>
          <div class="text-gray-800 dark:text-gray-200">{{ item.translation }}</div>
          <div v-if="item.context" class="text-gray-600 dark:text-gray-400 text-xs">{{ item.context }}</div>
          <span v-if="isItemLearned(learning, teaching, item.term)" class="ml-1">✓</span>
        </button>
      </div>
    </div>

    <div v-else-if="groupByLearnStatus && !groupByLesson">
      <!-- Group by learned/unlearned -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
          Unlearned ({{ unlearnedItems.length }})
        </h2>
        <div class="grid grid-cols-2 md:flex md:flex-wrap gap-2">
          <button
            v-for="item in unlearnedItems"
            :key="item.id"
            @click="toggleItemLearned(learning, teaching, item.term)"
            class="px-3 py-2 rounded text-sm transition cursor-pointer border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600">
            <div class="font-semibold text-primary-500 dark:text-blue-400">{{ item.term }}</div>
            <div class="text-gray-800 dark:text-gray-200">{{ item.translation }}</div>
            <div v-if="item.context" class="text-gray-600 dark:text-gray-400 text-xs">{{ item.context }}</div>
          </button>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
          Learned ({{ learnedItems.length }})
        </h2>
        <div class="grid grid-cols-2 md:flex md:flex-wrap gap-2">
          <button
            v-for="item in learnedItems"
            :key="item.id"
            @click="toggleItemLearned(learning, teaching, item.term)"
            class="px-3 py-2 rounded text-sm transition cursor-pointer border bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 line-through opacity-60">
            <div class="font-semibold text-primary-500 dark:text-blue-400">{{ item.term }}</div>
            <div class="text-gray-800 dark:text-gray-200">{{ item.translation }}</div>
            <div v-if="item.context" class="text-gray-600 dark:text-gray-400 text-xs">{{ item.context }}</div>
            <span class="ml-1">✓</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="groupByLesson">
      <!-- Group by lesson (and optionally by learn status) -->
      <div v-for="lesson in lessonsWithItems" :key="lesson.number" class="mb-6">
        <h2 class="text-2xl font-bold text-primary-500 dark:text-blue-400 mb-3">
          Lesson {{ lesson.number }}: {{ lesson.title }}
        </h2>

        <div v-if="groupByLearnStatus">
          <!-- Group by both lesson and status -->
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Unlearned ({{ lesson.unlearnedItems.length }})
            </h3>
            <div class="grid grid-cols-2 md:flex md:flex-wrap gap-2">
              <button
                v-for="item in lesson.unlearnedItems"
                :key="item.id"
                @click="toggleItemLearned(learning, teaching, item.term)"
                class="px-3 py-2 rounded text-sm transition cursor-pointer border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600">
                <div class="font-semibold text-primary-500 dark:text-blue-400">{{ item.term }}</div>
                <div class="text-gray-800 dark:text-gray-200">{{ item.translation }}</div>
                <div v-if="item.context" class="text-gray-600 dark:text-gray-400 text-xs">{{ item.context }}</div>
              </button>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Learned ({{ lesson.learnedItems.length }})
            </h3>
            <div class="grid grid-cols-2 md:flex md:flex-wrap gap-2">
              <button
                v-for="item in lesson.learnedItems"
                :key="item.id"
                @click="toggleItemLearned(learning, teaching, item.term)"
                class="px-3 py-2 rounded text-sm transition cursor-pointer border bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 line-through opacity-60">
                <div class="font-semibold text-primary-500 dark:text-blue-400">{{ item.term }}</div>
                <div class="text-gray-800 dark:text-gray-200">{{ item.translation }}</div>
                <div v-if="item.context" class="text-gray-600 dark:text-gray-400 text-xs">{{ item.context }}</div>
                <span class="ml-1">✓</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else>
          <!-- Group by lesson only -->
          <div class="grid grid-cols-2 md:flex md:flex-wrap gap-2">
            <button
              v-for="item in lesson.items"
              :key="item.id"
              @click="toggleItemLearned(learning, teaching, item.term)"
              :class="[
                'px-3 py-2 rounded text-sm transition cursor-pointer border',
                isItemLearned(learning, teaching, item.term)
                  ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600 line-through opacity-60'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-600'
              ]">
              <div class="font-semibold text-primary-500 dark:text-blue-400">{{ item.term }}</div>
              <div class="text-gray-800 dark:text-gray-200">{{ item.translation }}</div>
              <div v-if="item.context" class="text-gray-600 dark:text-gray-400 text-xs">{{ item.context }}</div>
              <span v-if="isItemLearned(learning, teaching, item.term)" class="ml-1">✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading or empty state -->
  <div v-else class="text-center py-8">
    <div class="text-2xl font-bold text-primary-500 dark:text-blue-400 mb-4">
      {{ allItems.length === 0 && !loading ? 'No learning items found' : 'Loading items...' }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLessons } from '../composables/useLessons'
import { useProgress } from '../composables/useProgress'

const route = useRoute()
const router = useRouter()
const emit = defineEmits(['update-title'])

const { loadAllLessonsForTopic } = useLessons()
const { isItemLearned, toggleItemLearned } = useProgress()

// Use computed to make params reactive to route changes
const learning = computed(() => route.params.learning)
const teaching = computed(() => route.params.teaching)
const lessonNumber = computed(() => route.params.number ? parseInt(route.params.number) : null)

const allItems = ref([])
const availableLessons = ref([])
const selectedLesson = ref(lessonNumber.value || 'all')
const groupByLearnStatus = ref(true)
// Default for groupByLesson: true when showing all lessons, false when showing one lesson
const groupByLesson = ref(lessonNumber.value ? false : true)
const loading = ref(true)

// Show/hide the "Group by Lesson" checkbox based on selected lesson
const showGroupByLessonOption = computed(() => {
  return selectedLesson.value === 'all'
})

// Filtered items based on selected lesson
const filteredItems = computed(() => {
  if (selectedLesson.value === 'all') {
    return allItems.value
  }
  return allItems.value.filter(item => item.lessonNumber === selectedLesson.value)
})

// Unlearned items
const unlearnedItems = computed(() => {
  return filteredItems.value.filter(item => !isItemLearned(learning.value, teaching.value, item.term))
})

// Learned items
const learnedItems = computed(() => {
  return filteredItems.value.filter(item => isItemLearned(learning.value, teaching.value, item.term))
})

// Group items by lesson
const lessonsWithItems = computed(() => {
  if (selectedLesson.value !== 'all') {
    // If a specific lesson is selected, only show that lesson
    const lesson = availableLessons.value.find(l => l.number === selectedLesson.value)
    if (!lesson) return []

    const lessonItems = filteredItems.value.filter(item => item.lessonNumber === lesson.number)
    return [{
      ...lesson,
      items: lessonItems,
      unlearnedItems: lessonItems.filter(item => !isItemLearned(learning.value, teaching.value, item.term)),
      learnedItems: lessonItems.filter(item => isItemLearned(learning.value, teaching.value, item.term))
    }]
  }

  // Show all lessons with their items
  return availableLessons.value.map(lesson => {
    const lessonItems = allItems.value.filter(item => item.lessonNumber === lesson.number)
    return {
      ...lesson,
      items: lessonItems,
      unlearnedItems: lessonItems.filter(item => !isItemLearned(learning.value, teaching.value, item.term)),
      learnedItems: lessonItems.filter(item => isItemLearned(learning.value, teaching.value, item.term))
    }
  }).filter(lesson => lesson.items.length > 0)
})

// Load items data
async function loadItems() {
  loading.value = true

  // Get current params values
  const currentLearning = learning.value
  const currentTeaching = teaching.value
  const currentLessonNumber = lessonNumber.value

  // Load all lessons
  const lessons = await loadAllLessonsForTopic(currentLearning, currentTeaching)
  availableLessons.value = lessons

  // Extract all items from all lessons
  const items = []
  lessons.forEach(lesson => {
    if (lesson.sections) {
      lesson.sections.forEach(section => {
        if (section.examples) {
          section.examples.forEach(example => {
            if (example.rel && example.rel.length > 0) {
              example.rel.forEach(relItem => {
                items.push({
                  id: `${lesson.number}-${relItem[0]}`,
                  term: relItem[0],
                  translation: relItem[1] || '',
                  context: relItem[2] || '',
                  lessonNumber: lesson.number,
                  lessonTitle: lesson.title
                })
              })
            }
          })
        }
      })
    }
  })

  // Remove duplicates based on term
  const uniqueItems = []
  const seenTerms = new Set()
  items.forEach(item => {
    if (!seenTerms.has(item.term)) {
      seenTerms.add(item.term)
      uniqueItems.push(item)
    }
  })

  allItems.value = uniqueItems
  loading.value = false

  // Update selectedLesson when route changes
  selectedLesson.value = currentLessonNumber || 'all'
  groupByLesson.value = currentLessonNumber ? false : true

  // Set page title
  emit('update-title', 'Learning Items')
}

// Watch for route param changes to reload data when navigating
watch([learning, teaching, lessonNumber], async () => {
  await loadItems()
}, { immediate: true })

// Watch for selectedLesson changes and update route (when changing dropdown)
// Skip this if the change came from route update (to avoid infinite loop)
watch(selectedLesson, (newValue) => {
  // Don't update route if selectedLesson matches current route param
  const currentNumber = lessonNumber.value
  if ((newValue === 'all' && !currentNumber) || (newValue === currentNumber)) {
    return
  }

  if (newValue === 'all') {
    router.replace({
      name: 'learning-items',
      params: { learning: learning.value, teaching: teaching.value }
    })
  } else {
    router.replace({
      name: 'learning-items',
      params: { learning: learning.value, teaching: teaching.value, number: newValue }
    })
  }
})
</script>
