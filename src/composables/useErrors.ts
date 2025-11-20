import { ref } from 'vue'
import type { AppError } from '@/types/lesson'

// Shared state (singleton)
const errors = ref<AppError[]>([])
let errorIdCounter = 0

export function useErrors() {
  /**
   * Add an error to the error list
   */
  function addError(
    message: string,
    details?: string,
    type: AppError['type'] = 'error'
  ): number {
    const id = ++errorIdCounter
    const error: AppError = {
      id,
      message,
      details,
      timestamp: new Date(),
      type
    }

    errors.value.push(error)

    // Auto-dismiss after 5 seconds for non-errors
    if (type !== 'error') {
      setTimeout(() => {
        clearError(id)
      }, 5000)
    }

    return id
  }

  /**
   * Add info message
   */
  function addInfo(message: string, details?: string): number {
    return addError(message, details, 'info')
  }

  /**
   * Add warning message
   */
  function addWarning(message: string, details?: string): number {
    return addError(message, details, 'warning')
  }

  /**
   * Clear a specific error
   */
  function clearError(id: number): void {
    errors.value = errors.value.filter(e => e.id !== id)
  }

  /**
   * Clear all errors
   */
  function clearAll(): void {
    errors.value = []
  }

  /**
   * Handle async operations with automatic error handling
   */
  async function withErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage = 'An error occurred'
  ): Promise<T | null> {
    try {
      return await operation()
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error)
      addError(errorMessage, details)
      console.error(errorMessage, error)
      return null
    }
  }

  return {
    errors,
    addError,
    addInfo,
    addWarning,
    clearError,
    clearAll,
    withErrorHandling
  }
}
