import { ref, watch } from 'vue'

// Shared progress state (singleton pattern)
// Structure: { "learning:teaching": { "itemId": true, ... } }
const progress = ref({})

let isInitialized = false

// Get the storage key for a specific topic
function getTopicKey(learning, teaching) {
  return `${learning}:${teaching}`
}

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem('progress', JSON.stringify(progress.value))
}

// Load progress from localStorage
function loadProgress() {
  const saved = localStorage.getItem('progress')
  if (saved) {
    try {
      progress.value = JSON.parse(saved)
    } catch (e) {
      console.error('Error loading progress:', e)
      progress.value = {}
    }
  }
}

// Check if an item is learned
function isItemLearned(learning, teaching, itemId) {
  const topicKey = getTopicKey(learning, teaching)
  return progress.value[topicKey]?.[itemId] === true
}

// Toggle learned status for an item
function toggleItemLearned(learning, teaching, itemId) {
  const topicKey = getTopicKey(learning, teaching)

  if (!progress.value[topicKey]) {
    progress.value[topicKey] = {}
  }

  if (progress.value[topicKey][itemId]) {
    delete progress.value[topicKey][itemId]
  } else {
    progress.value[topicKey][itemId] = true
  }

  saveProgress()
}

// Check if all items in an example are learned
function areAllItemsLearned(learning, teaching, items) {
  if (!items || items.length === 0) {
    return false
  }

  return items.every(item => {
    const itemId = item[0] // First element is the unique identifier
    return isItemLearned(learning, teaching, itemId)
  })
}

// Initialize watchers only once
function initializeWatchers() {
  if (isInitialized) return

  isInitialized = true

  // Watch for progress changes and save to localStorage
  watch(progress, () => {
    saveProgress()
  }, { deep: true })
}

export function useProgress() {
  // Initialize watchers on first use
  initializeWatchers()

  return {
    progress,
    loadProgress,
    isItemLearned,
    toggleItemLearned,
    areAllItemsLearned
  }
}
