<template>
  <div v-if="lesson">
    <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
      {{ lesson.title }}
    </h2>
    <p class="text-gray-600 dark:text-gray-400 mb-5 text-lg">
      {{ lesson.description || '' }}
    </p>

    <!-- Sections -->
    <div
      v-for="(section, idx) in lesson.sections"
      :key="idx"
      class="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-5 bg-white dark:bg-gray-800">
      <div class="text-2xl text-primary-500 dark:text-blue-400 font-bold mb-4">
        {{ section.title }}
      </div>

      <!-- Explanation -->
      <div
        v-if="section.explanation"
        class="bg-gray-100 dark:bg-gray-900 p-4 rounded mb-4 text-gray-700 dark:text-gray-300"
        v-html="marked(section.explanation)">
      </div>

      <!-- Examples -->
      <div
        v-for="(example, exIdx) in section.examples"
        :key="exIdx"
        :class="[
          'p-4 mb-3 rounded',
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
          v-show="settings.showTranslation"
          class="text-gray-600 dark:text-gray-400 italic mb-3">
          {{ example.a }}
        </div>

        <!-- Related items -->
        <div v-if="settings.showLearningItems && example.rel && example.rel.length > 0" class="flex flex-wrap gap-2 mb-3">
          <div
            v-for="(item, relIdx) in example.rel"
            :key="relIdx"
            class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded text-sm">
            <span class="font-semibold text-primary-500 dark:text-blue-400">
              {{ item[0] }}
            </span>
            <span class="text-gray-800 dark:text-gray-200">
              • {{ item.slice(1).join(' • ') }}
            </span>
          </div>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useLessons } from '../composables/useLessons'
import { useSettings } from '../composables/useSettings'
import { marked } from 'marked'

const route = useRoute()
const emit = defineEmits(['update-title'])

const { loadAllLessonsForTopic } = useLessons()
const { settings } = useSettings()

const lesson = ref(null)

const learning = route.params.learning
const teaching = route.params.teaching
const lessonNumber = parseInt(route.params.number)

onMounted(async () => {
  // Load all lessons to find the correct file
  const lessons = await loadAllLessonsForTopic(learning, teaching)

  // Find the lesson with the matching number
  lesson.value = lessons.find(l => l.number === lessonNumber)

  if (lesson.value) {
    emit('update-title', lesson.value.title)
  }
})
</script>
