import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useSettings } from '../src/composables/useSettings'

describe('Dark Mode Toggle', () => {
  let settingsInstance

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()

    // Clear dark mode class
    document.documentElement.classList.remove('dark')

    // Get a fresh settings instance
    settingsInstance = useSettings()

    // Reset settings to defaults
    settingsInstance.settings.value = {
      showTranslation: true,
      showLearningItems: true,
      showLabels: true,
      darkMode: false
    }
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('should initialize with dark mode disabled by default', () => {
    expect(settingsInstance.settings.value.darkMode).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should enable dark mode when toggled from false to true', async () => {
    // Start with dark mode off
    expect(settingsInstance.settings.value.darkMode).toBe(false)

    // Enable dark mode (simulates user toggle)
    settingsInstance.settings.value.darkMode = true

    // Wait for watchers to run
    await new Promise(resolve => setTimeout(resolve, 50))

    // Dark mode should be enabled
    expect(settingsInstance.settings.value.darkMode).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Settings should be saved
    const saved = JSON.parse(localStorage.getItem('settings'))
    expect(saved.darkMode).toBe(true)
  })

  it('should disable dark mode when toggled from true to false', async () => {
    // Start with dark mode on
    settingsInstance.settings.value.darkMode = true
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Disable dark mode
    settingsInstance.settings.value.darkMode = false
    await new Promise(resolve => setTimeout(resolve, 50))

    // Dark mode should be disabled
    expect(settingsInstance.settings.value.darkMode).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Settings should be saved
    const saved = JSON.parse(localStorage.getItem('settings'))
    expect(saved.darkMode).toBe(false)
  })

  it('should toggle dark mode multiple times correctly', async () => {
    // Start off
    expect(settingsInstance.settings.value.darkMode).toBe(false)

    // Toggle on
    settingsInstance.settings.value.darkMode = true
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(settingsInstance.settings.value.darkMode).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Toggle off
    settingsInstance.settings.value.darkMode = false
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(settingsInstance.settings.value.darkMode).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Toggle on again
    settingsInstance.settings.value.darkMode = true
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(settingsInstance.settings.value.darkMode).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should persist dark mode settings across sessions', () => {
    // Enable dark mode and save
    settingsInstance.settings.value.darkMode = true
    settingsInstance.saveSettings()

    // Simulate new session - create new settings instance
    localStorage.setItem('settings', JSON.stringify({
      showTranslation: true,
      showLearningItems: true,
      showLabels: true,
      darkMode: true
    }))

    const newSettingsInstance = useSettings()
    newSettingsInstance.loadSettings()

    // Should load the saved dark mode setting
    expect(newSettingsInstance.settings.value.darkMode).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('should save all settings together', async () => {
    // Change multiple settings
    settingsInstance.settings.value.darkMode = true
    settingsInstance.settings.value.showTranslation = false
    settingsInstance.settings.value.showLabels = false

    await new Promise(resolve => setTimeout(resolve, 50))

    // All settings should be saved
    const saved = JSON.parse(localStorage.getItem('settings'))
    expect(saved.darkMode).toBe(true)
    expect(saved.showTranslation).toBe(false)
    expect(saved.showLabels).toBe(false)
    expect(saved.showLearningItems).toBe(true) // unchanged
  })
})
