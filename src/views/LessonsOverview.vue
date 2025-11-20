<template>
  <div>
    <!-- Lessons grid -->
    <div v-if="!isLoading && lessons.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="lesson in lessons"
        :key="lesson.number"
        @click="openLesson(lesson.number)"
        class="border-3 border-primary-500 dark:border-gray-600 rounded-xl p-6 cursor-pointer transition hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-gray-800">
        <div class="text-6xl font-bold opacity-20 text-primary-500 dark:text-blue-400">
          {{ lesson.number }}
        </div>
        <div class="text-2xl font-semibold my-2 text-gray-800 dark:text-gray-200">
          {{ lesson.title }}
        </div>
        <div class="text-gray-600 dark:text-gray-400 mb-2">
          {{ lesson.description || '' }}
        </div>
        <div class="text-primary-500 dark:text-blue-400 font-semibold">
          {{ lesson.sections.length }} sections
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="isLoading" class="text-center py-8">
      <div class="text-2xl font-bold text-primary-500 dark:text-blue-400 mb-4">
        Loading lessons...
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <div class="text-xl text-gray-600 dark:text-gray-400">
        No lessons found
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLessons } from '../composables/useLessons'
import { formatLangName } from '../utils/formatters'

const router = useRouter()
const route = useRoute()
const emit = defineEmits(['update-title'])

const { loadAllLessonsForTopic } = useLessons()

const lessons = ref([])
const isLoading = ref(true)

// Use computed to get current route params
const learning = computed(() => route.params.learning)
const teaching = computed(() => route.params.teaching)

function openLesson(number) {
  router.push({
    name: 'lesson-detail',
    params: {
      learning: learning.value,
      teaching: teaching.value,
      number
    }
  })
}

async function loadLessons() {
  if (!learning.value || !teaching.value) return

  isLoading.value = true
  lessons.value = await loadAllLessonsForTopic(learning.value, teaching.value)
  isLoading.value = false

  // Update page title
  emit('update-title', 'Lessons')
}

// Watch for route changes and reload lessons
watch([learning, teaching], () => {
  loadLessons()
}, { immediate: true })
</script>
