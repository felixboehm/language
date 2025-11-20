<template>
  <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
    <!-- Show Translations Toggle -->
    <div class="mb-6">
      <label class="block font-semibold text-gray-800 dark:text-gray-200 mb-2 text-lg">
        Show Translations
      </label>
      <div class="text-gray-600 dark:text-gray-400 text-sm mb-3">
        Show or hide answer translations in lessons
      </div>
      <label class="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          v-model="settings.showTranslation"
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
</template>

<script setup lang="ts">
import { useSettings } from '@/composables/useSettings'

const { settings } = useSettings()
</script>
