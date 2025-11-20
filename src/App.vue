<template>
  <div class="w-full md:max-w-6xl md:mx-auto bg-white dark:bg-gray-900 md:rounded-xl md:shadow-2xl">
    <!-- Header with unified navigation - sticky on desktop -->
    <header class="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-4 px-4 md:rounded-t-xl relative sticky top-0 z-50">
      <div class="flex items-center justify-between gap-4">
        <!-- Left side buttons (fixed width container) -->
        <div class="flex items-center gap-2 min-w-fit">
          <!-- Home button (visible except on home page and lesson detail page) -->
          <button
            v-if="canGoBack && route.name !== 'lesson-detail'"
            @click="goHome"
            class="bg-white bg-opacity-20 border-2 border-white border-opacity-50 text-white w-10 h-10 rounded-full text-xl hover:bg-opacity-30 transition-all flex items-center justify-center flex-shrink-0"
            title="Go to home">
            🏠
          </button>

          <!-- Back button (only on lesson detail page) -->
          <button
            v-if="route.name === 'lesson-detail'"
            @click="goBackToLessons"
            class="bg-white bg-opacity-20 border-2 border-white border-opacity-50 text-white px-3 py-1.5 rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-1 text-sm flex-shrink-0"
            title="Back to lessons">
            ←
          </button>
        </div>

        <!-- Title (grows to fill available space) -->
        <h1 class="text-2xl md:text-3xl font-bold text-center flex-grow">
          {{ pageTitle }}
        </h1>

        <!-- Right side buttons (fixed width container) -->
        <div class="flex items-center gap-2 min-w-fit">
          <!-- Play/Pause button (visible only on lesson detail page, hidden on mobile) -->
          <button
            v-if="isLessonPage"
            @click="togglePlayPause"
            class="hidden md:flex bg-white bg-opacity-20 border-2 border-white border-opacity-50 text-white w-12 h-12 rounded-full text-2xl hover:bg-opacity-30 transition-all items-center justify-center flex-shrink-0"
            :title="isPlaying ? 'Pause' : 'Play'">
            {{ isPlaying ? '⏸' : '▶️' }}
          </button>

          <!-- Items button (visible on lesson pages and overview page) -->
          <button
            v-if="canShowItemsButton"
            @click="goToItems"
            class="bg-white bg-opacity-20 border-2 border-white border-opacity-50 text-white w-12 h-12 rounded-full text-2xl hover:bg-opacity-30 transition-all flex-shrink-0"
            title="Learning Items">
            📚
          </button>

          <!-- Settings button (hidden on settings page) -->
          <button
            v-if="route.name !== 'settings'"
            @click="goToSettings"
            class="bg-white bg-opacity-20 border-2 border-white border-opacity-50 text-white w-12 h-12 rounded-full text-2xl hover:bg-opacity-30 transition-all hover:rotate-90 flex-shrink-0"
            title="Settings">
            ⚙️
          </button>

          <!-- Done button (visible only on settings page) -->
          <button
            v-if="route.name === 'settings'"
            @click="goBack"
            class="bg-white bg-opacity-20 border-2 border-white border-opacity-50 text-white w-12 h-12 rounded-full text-2xl hover:bg-opacity-30 transition-all flex-shrink-0"
            title="Done">
            ✓
          </button>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="p-8">
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="currentRoute.path" @update-title="updatePageTitle" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAudio } from './composables/useAudio'
import { useSettings } from './composables/useSettings'

const router = useRouter()
const route = useRoute()

const pageTitle = ref('🌍 Language Learning')

const { isPlaying, play, pause, resume } = useAudio()
const { settings } = useSettings()

const canGoBack = computed(() => {
  return route.name !== 'home'
})

const isLessonPage = computed(() => {
  return route.name === 'lesson-detail'
})

const canShowItemsButton = computed(() => {
  return route.name === 'lesson-detail' ||
         route.name === 'lessons-overview' ||
         route.name === 'learning-items'
})

function goHome() {
  router.push({ name: 'home' })
}

function goBackToLessons() {
  const learning = route.params.learning
  const teaching = route.params.teaching
  router.push({
    name: 'lessons-overview',
    params: { learning, teaching }
  })
}

function goBack() {
  router.back()
}

function goToSettings() {
  if (route.name !== 'settings') {
    router.push({ name: 'settings' })
  }
}

function goToItems() {
  const learning = route.params.learning
  const teaching = route.params.teaching
  const number = route.params.number

  if (route.name === 'learning-items') {
    // If on items page, go back to lessons
    if (number) {
      // Go to specific lesson
      router.push({
        name: 'lesson-detail',
        params: { learning, teaching, number }
      })
    } else {
      // Go to lessons overview
      router.push({
        name: 'lessons-overview',
        params: { learning, teaching }
      })
    }
    return
  }

  if (learning && teaching) {
    // If coming from a lesson, include the lesson number to filter
    if (number && route.name === 'lesson-detail') {
      router.push({
        name: 'learning-items',
        params: { learning, teaching, number }
      })
    } else {
      // If coming from overview, show all items
      router.push({
        name: 'learning-items',
        params: { learning, teaching }
      })
    }
  }
}

function togglePlayPause() {
  if (isPlaying.value) {
    pause()
  } else {
    play(settings.value)
  }
}

function updatePageTitle(title) {
  pageTitle.value = title
}

// Update title based on route
watch(() => route.meta.title, (newTitle) => {
  if (newTitle) {
    pageTitle.value = newTitle
  }
}, { immediate: true })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
