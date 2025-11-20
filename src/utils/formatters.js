/**
 * Format language/topic names for display
 * @param {string} lang - Language or topic identifier
 * @returns {string} - Formatted display name
 */
export function formatLangName(lang) {
  const names = {
    'deutsch': 'Deutsch',
    'english': 'English',
    'portugiesisch': 'Portugiesisch',
    'englisch': 'Englisch',
    'spanish': 'Spanish',
    'spanisch': 'Spanisch'
  }
  return names[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
}
