<template>
  <div class="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl">
    <!-- Header with unified navigation -->
    <header class="bg-gradient-to-br from-primary-500 to-secondary-500 text-white p-8 rounded-t-xl relative">
      <div class="flex items-center justify-between">
        <!-- Back button -->
        <button
          v-if="canGoBack"
          @click="goBack"
          class="bg-white bg-opacity-20 border-2 border-white border-opacity-50 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2"
          title="Go back">
          ← Back
        </button>
        <div v-else class="w-24"></div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-center flex-1">
          {{ pageTitle }}
        </h1>

        <!-- Settings button -->
        <button
          @click="goToSettings"
          class="bg-white bg-opacity-20 border-2 border-white border-opacity-50 text-white w-12 h-12 rounded-full text-2xl hover:bg-opacity-30 transition-all hover:rotate-90"
          title="Settings">
          ⚙️
        </button>
      </div>
    </header>

    <!-- Content -->
    <div class="p-8">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" @update-title="updatePageTitle" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const pageTitle = ref('🌍 Language Learning')

const canGoBack = computed(() => {
  return route.name !== 'home'
})

function goBack() {
  router.back()
}

function goToSettings() {
  if (route.name !== 'settings') {
    router.push({ name: 'settings' })
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
