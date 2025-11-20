import { ref, watch } from 'vue'
import type { Settings } from '@/types/lesson'

// Shared state across all component instances (singleton pattern)
const settings = ref<Settings>({
  showTranslation: true,
  showLearningItems: true,
  showLabels: true,
  darkMode: false
})

let isInitialized = false
const STORAGE_KEY = 'settings'

// Apply dark mode class to HTML element
function applyDarkMode(enabled: boolean): void {
  if (enabled) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Save settings to localStorage
function saveSettings(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

// Load settings from localStorage
function loadSettings(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      settings.value = { ...settings.value, ...parsed }
      applyDarkMode(settings.value.darkMode)
    } else {
      // Apply default dark mode on first load
      applyDarkMode(settings.value.darkMode)
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

// Initialize watchers only once
function initializeWatchers(): void {
  if (isInitialized) return

  isInitialized = true

  // Watch for settings changes and save to localStorage
  watch(() => settings.value.showTranslation, () => {
    saveSettings()
  })

  watch(() => settings.value.showLearningItems, () => {
    saveSettings()
  })

  watch(() => settings.value.showLabels, () => {
    saveSettings()
  })

  watch(() => settings.value.darkMode, (newValue) => {
    applyDarkMode(newValue)
    saveSettings()
  })
}

export function useSettings() {
  // Initialize watchers on first use
  initializeWatchers()

  return {
    settings,
    loadSettings,
    saveSettings
  }
}
