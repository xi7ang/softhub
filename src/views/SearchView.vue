<template>
  <h1>搜索{{ query ? `“${query}”` : '' }}</h1>
  <form class="hero-search" style="margin: 0 0 24px" @submit.prevent="goSearch">
    <input v-model="input" type="search" placeholder="搜索软件名称、英文名、标签、分类…" />
    <button type="submit">搜索</button>
  </form>

  <p style="color: var(--muted)">共 {{ results.length }} 条结果</p>
  <div v-if="results.length" class="grid">
    <SoftwareCard v-for="item in results" :key="item.id" :item="item" />
  </div>
  <p v-else class="empty">没有找到匹配的软件，换个关键词试试。</p>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { store } from '../lib/store.js'
import SoftwareCard from '../components/SoftwareCard.vue'

const props = defineProps({
  query: { type: String, default: '' },
})

const input = ref(props.query)

watch(() => props.query, (value) => {
  input.value = value
})

const results = computed(() => {
  const q = props.query.trim().toLowerCase()
  if (!q) return store.items
  return store.items.filter((item) => {
    const haystack = [
      item.name,
      item.enName,
      item.category,
      ...(item.tags || []),
    ].join(' ').toLowerCase()
    return haystack.includes(q)
  })
})

function goSearch() {
  location.hash = `#/search?q=${encodeURIComponent(input.value.trim())}`
}
</script>
