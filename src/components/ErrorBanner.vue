<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md">
    <TransitionGroup name="slide-fade">
      <div
        v-for="error in errors"
        :key="error.id"
        :class="[
          'p-4 rounded-lg shadow-lg flex items-start justify-between',
          error.type === 'error' ? 'bg-red-500 text-white' :
          error.type === 'warning' ? 'bg-yellow-500 text-white' :
          'bg-blue-500 text-white'
        ]">
        <div class="flex-1">
          <div class="font-semibold">{{ error.message }}</div>
          <div v-if="error.details" class="text-sm opacity-90 mt-1">
            {{ error.details }}
          </div>
        </div>
        <button
          @click="clearError(error.id)"
          class="ml-4 text-white hover:opacity-75 text-xl leading-none"
          :aria-label="`Dismiss ${error.type}`">
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useErrors } from '@/composables/useErrors'

const { errors, clearError } = useErrors()
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
