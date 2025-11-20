<template>
  <div v-if="total > 0" class="mb-4">
    <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
      <span>Progress: {{ completed }} / {{ total }} lessons</span>
      <span class="font-semibold">{{ percentComplete }}%</span>
    </div>
    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        class="bg-primary-500 h-2.5 rounded-full transition-all duration-300"
        :style="{ width: `${percentComplete}%` }">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  completed: number
}

const props = defineProps<Props>()

const percentComplete = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.completed / props.total) * 100)
})
</script>
