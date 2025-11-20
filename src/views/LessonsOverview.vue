<template>
  <div>
    <!-- Lessons grid -->
    <div v-if="!isLoading && lessons.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="lesson in lessons"
        :key="lesson.number"
        @click="openLesson(lesson.number)"
        class="border-3 border-primary-500 dark:border-gray-600 rounded-xl p-6 cursor-pointer transition hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-gray-800">
        <div class="flex items-baseline gap-3 mb-3">
          <div class="text-3xl font-bold text-primary-500 dark:text-blue-400">
            {{ lesson.number }}
          </div>
          <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200 flex-1">
            {{ lesson.title }}
          </div>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLessons } from '@/composables/useLessons'
import { formatLangName } from '@/utils/formatters'
import type { Lesson } from '@/types/lesson'

const router = useRouter()
const route = useRoute()
const emit = defineEmits<{
  (e: 'update-title', title: string): void
}>()

const { loadAllLessonsForTopic } = useLessons()

const lessons = ref<Lesson[]>([])
const isLoading = ref(true)

const learning = route.params.learning as string
const teaching = route.params.teaching as string

function openLesson(number: number) {
  router.push({
    name: 'lesson-detail',
    params: {
      learning,
      teaching,
      number: number.toString()
    }
  })
}

onMounted(async () => {
  isLoading.value = true
  lessons.value = await loadAllLessonsForTopic(learning, teaching)
  isLoading.value = false

  // Update page title
  const title = formatLangName(teaching)
  emit('update-title', title)
})
</script>
