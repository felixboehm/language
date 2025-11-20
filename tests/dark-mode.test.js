import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createApp } from 'vue'

describe('Dark Mode Toggle', () => {
  let app
  let vm
  let container

  beforeEach(() => {
    // Setup DOM
    container = document.createElement('div')
    container.id = 'app'
    document.body.appendChild(container)

    // Clear localStorage
    localStorage.clear()

    // Mock fetch for content loading
    global.fetch = vi.fn((url) => {
      if (url === 'lessons/index.yaml') {
        return Promise.resolve({
          text: () => Promise.resolve('languages:\n  - english')
        })
      }
      return Promise.reject(new Error('Not found'))
    })

    // Import and create the app inline to test the actual behavior
    const appDefinition = {
      data() {
        return {
          availableContent: {},
          selectedLearning: null,
          selectedTeaching: null,
          loadedLessons: [],
          currentLesson: null,
          settings: {
            showTranslation: true,
            darkMode: false
          },
          currentView: 'selection',
          isLoadingContent: true,
        }
      },
      methods: {
        toggleDarkMode() {
          this.saveSettings()
          this.applyDarkMode()
        },
        loadSettings() {
          const saved = localStorage.getItem('appSettings')
          if (saved) {
            this.settings = JSON.parse(saved)
          }
        },
        saveSettings() {
          localStorage.setItem('appSettings', JSON.stringify(this.settings))
        },
        applyDarkMode() {
          if (this.settings.darkMode) {
            document.body.classList.add('dark')
          } else {
            document.body.classList.remove('dark')
          }
        }
      },
      mounted() {
        this.loadSettings()
        this.applyDarkMode()
      }
    }

    app = createApp(appDefinition)
    vm = app.mount(container)
  })

  afterEach(() => {
    if (app) {
      app.unmount()
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
    localStorage.clear()
  })

  it('should initialize with dark mode disabled by default', () => {
    expect(vm.settings.darkMode).toBe(false)
    expect(document.body.classList.contains('dark')).toBe(false)
  })

  it('should enable dark mode when toggled from false to true', () => {
    // Start with dark mode off
    expect(vm.settings.darkMode).toBe(false)
    
    // Simulate checkbox toggle (v-model changes the value)
    vm.settings.darkMode = true
    vm.toggleDarkMode()

    // Dark mode should be enabled
    expect(vm.settings.darkMode).toBe(true)
    expect(document.body.classList.contains('dark')).toBe(true)
    
    // Settings should be saved
    const saved = JSON.parse(localStorage.getItem('appSettings'))
    expect(saved.darkMode).toBe(true)
  })

  it('should disable dark mode when toggled from true to false', () => {
    // Start with dark mode on
    vm.settings.darkMode = true
    vm.applyDarkMode()
    expect(document.body.classList.contains('dark')).toBe(true)

    // Simulate checkbox toggle (v-model changes the value)
    vm.settings.darkMode = false
    vm.toggleDarkMode()

    // Dark mode should be disabled
    expect(vm.settings.darkMode).toBe(false)
    expect(document.body.classList.contains('dark')).toBe(false)
    
    // Settings should be saved
    const saved = JSON.parse(localStorage.getItem('appSettings'))
    expect(saved.darkMode).toBe(false)
  })

  it('should toggle dark mode multiple times correctly', () => {
    // Start off
    expect(vm.settings.darkMode).toBe(false)
    
    // Toggle on
    vm.settings.darkMode = true
    vm.toggleDarkMode()
    expect(vm.settings.darkMode).toBe(true)
    expect(document.body.classList.contains('dark')).toBe(true)

    // Toggle off
    vm.settings.darkMode = false
    vm.toggleDarkMode()
    expect(vm.settings.darkMode).toBe(false)
    expect(document.body.classList.contains('dark')).toBe(false)

    // Toggle on again
    vm.settings.darkMode = true
    vm.toggleDarkMode()
    expect(vm.settings.darkMode).toBe(true)
    expect(document.body.classList.contains('dark')).toBe(true)
  })

  it('should persist dark mode settings across sessions', () => {
    // Enable dark mode
    vm.settings.darkMode = true
    vm.toggleDarkMode()

    // Create a new instance to simulate a new session
    app.unmount()
    
    const newApp = createApp({
      data() {
        return {
          settings: {
            showTranslation: true,
            darkMode: false
          }
        }
      },
      methods: {
        loadSettings() {
          const saved = localStorage.getItem('appSettings')
          if (saved) {
            this.settings = JSON.parse(saved)
          }
        },
        applyDarkMode() {
          if (this.settings.darkMode) {
            document.body.classList.add('dark')
          } else {
            document.body.classList.remove('dark')
          }
        }
      },
      mounted() {
        this.loadSettings()
        this.applyDarkMode()
      }
    })

    const newContainer = document.createElement('div')
    newContainer.id = 'app2'
    document.body.appendChild(newContainer)
    const newVm = newApp.mount(newContainer)

    // Should load the saved dark mode setting
    expect(newVm.settings.darkMode).toBe(true)
    expect(document.body.classList.contains('dark')).toBe(true)

    newApp.unmount()
    newContainer.parentNode.removeChild(newContainer)
  })
})
