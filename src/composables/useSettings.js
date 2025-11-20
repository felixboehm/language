import { ref, watch } from 'vue'

// Shared state across all component instances (singleton pattern)
const settings = ref({
  showTranslation: true,
  showLearningItems: true,
  showLabels: true,
  darkMode: false
})

let isInitialized = false

// Apply dark mode class to HTML element
function applyDarkMode(enabled) {
  if (enabled) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Save settings to localStorage
function saveSettings() {
  localStorage.setItem('settings', JSON.stringify(settings.value))
}

// Load settings from localStorage
function loadSettings() {
  const saved = localStorage.getItem('settings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      settings.value = parsed
      applyDarkMode(settings.value.darkMode)
    } catch (e) {
      console.error('Error loading settings:', e)
    }
  } else {
    // Apply default dark mode on first load
    applyDarkMode(settings.value.darkMode)
  }
}

// Initialize watchers only once
function initializeWatchers() {
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
