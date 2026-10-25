import { ref } from 'vue'

// Theme choice persisted under 'softhub-theme' ('dark' | 'light').
// Default: system preference via prefers-color-scheme. The same logic
// runs inline in index.html before first paint to avoid a flash.
export const THEME_KEY = 'softhub-theme'

export function systemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  return 'dark'
}

export function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'dark' || saved === 'light') return saved
  } catch {
    /* 存储不可用时回退到系统偏好 */
  }
  return systemTheme()
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}

export const theme = ref(readTheme())

export function toggleTheme() {
  const next = theme.value === 'dark' ? 'light' : 'dark'
  theme.value = next
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    /* 存储不可用时仅本次生效 */
  }
  applyTheme(next)
}
