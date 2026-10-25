import { reactive } from 'vue'

// Comments live only in this browser's localStorage — no backend, no network.
// Stored as one map: { [entryId]: [{ nick, text, at }] }
const KEY = 'softhub:comments'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export const commentsState = reactive({ all: readAll() })

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(commentsState.all))
  } catch {
    /* 存储不可用时静默失败 */
  }
}

export function commentsFor(entryId) {
  const list = commentsState.all[entryId] || []
  // newest first
  return [...list].sort((a, b) => (b.at || 0) - (a.at || 0))
}

export function addComment(entryId, nick, text) {
  const cleanText = String(text || '').trim()
  if (!cleanText) return false
  const entry = {
    nick: String(nick || '').trim() || '匿名',
    text: cleanText,
    at: Date.now(),
  }
  if (!Array.isArray(commentsState.all[entryId])) commentsState.all[entryId] = []
  commentsState.all[entryId].push(entry)
  save()
  return true
}
