import { reactive } from 'vue'

const KEY = 'softhub:favorites'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

export const favorites = reactive({ ids: read() })

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...favorites.ids]))
  } catch {
    /* 存储不可用时静默失败 */
  }
}

export function isFavorite(id) {
  return favorites.ids.has(id)
}

export function toggleFavorite(id) {
  if (favorites.ids.has(id)) favorites.ids.delete(id)
  else favorites.ids.add(id)
  save()
}
