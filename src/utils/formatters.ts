/**
 * Format language/topic names for display
 */
export function formatLangName(lang: string): string {
  const names: Record<string, string> = {
    'deutsch': 'Deutsch',
    'english': 'English',
    'portugiesisch': 'Portugiesisch',
    'englisch': 'Englisch',
    'spanish': 'Spanish',
    'spanisch': 'Spanisch',
    'german': 'German'
  }
  return names[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Format a number with leading zeros
 */
export function padNumber(num: number, length: number = 2): string {
  return String(num).padStart(length, '0')
}
