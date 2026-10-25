import { reactive } from 'vue'

export const store = reactive({
  items: [],
  loaded: false,
  error: '',
})

export async function loadSoftware() {
  if (store.loaded) return
  try {
    const res = await fetch('./data/software.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    store.items = await res.json()
    store.loaded = true
  } catch (e) {
    store.error = `软件数据加载失败：${e.message || e}`
  }
}

export function findById(id) {
  return store.items.find((item) => item.id === id)
}

export function categories() {
  const seen = []
  for (const item of store.items) {
    if (!seen.includes(item.category)) seen.push(item.category)
  }
  return seen
}
