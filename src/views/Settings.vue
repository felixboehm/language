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
    </div>
  </div>
</template>

<script setup>
import { useSettings } from '../composables/useSettings'

const { settings } = useSettings()
</script>
